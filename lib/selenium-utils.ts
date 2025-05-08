import { Builder, By, until, WebDriver } from 'selenium-webdriver'
import chrome from 'selenium-webdriver/chrome'
import { execSync } from 'child_process'
import path from 'path'

interface SudokuPuzzle {
  puzzle: number[][]
  solution: number[][]
  difficulty: string
}

interface PuzzleData {
  puzzle: number[][]
  solution: number[][]
}

export class SeleniumManager {
  private driver: WebDriver | null = null
  private isInitializing: boolean = false

  private getChromeDriverPath(): string {
    try {
      // Try to get the path from the global installation
      const globalPaths = execSync('where chromedriver').toString().trim().split('\n')

      // Use the first path that ends with .exe
      const exePath = globalPaths.find(p => p.trim().endsWith('.exe'))
      if (exePath) {
        return exePath.trim()
      }
    } catch (error) {
      console.warn('Failed to find global chromedriver:', error)
    }

    // Fallback to local installation
    try {
      const localPath = path.join(process.cwd(), 'node_modules', 'chromedriver', 'lib', 'chromedriver', 'chromedriver.exe')
      return localPath
    } catch (error) {
      console.error('Failed to find local chromedriver:', error)
      throw new Error('Could not find chromedriver installation')
    }
  }

  async initialize() {
    if (this.driver) {
      console.log('Driver already initialized')
      return
    }

    if (this.isInitializing) {
      console.log('Driver is already initializing')
      return
    }

    try {
      this.isInitializing = true
      console.log('Initializing Selenium WebDriver...')

      const options = new chrome.Options()
      options.addArguments('--headless=new')  // Updated headless argument
      options.addArguments('--no-sandbox')
      options.addArguments('--disable-dev-shm-usage')
      options.addArguments('--disable-gpu')
      options.addArguments('--window-size=1920,1080')
      options.addArguments('--disable-extensions')
      options.addArguments('--disable-software-rasterizer')

      const chromedriverPath = this.getChromeDriverPath()
      console.log('Using chromedriver at:', chromedriverPath)

      // Create the driver with Chrome service and timeout
      this.driver = await new Builder()
        .forBrowser('chrome')
        .setChromeOptions(options)
        .setChromeService(new chrome.ServiceBuilder(chromedriverPath).setStdio('inherit'))
        .build()

      // Set page load timeout
      await this.driver.manage().setTimeouts({
        pageLoad: 30000,  // 30 seconds
        implicit: 10000   // 10 seconds
      })

      console.log('Selenium WebDriver initialized successfully')
    } catch (error) {
      console.error('Failed to initialize Selenium WebDriver:', error)
      if (this.driver) {
        try {
          await this.driver.quit()
        } catch (quitError) {
          console.error('Error quitting driver during initialization failure:', quitError)
        }
        this.driver = null
      }
      throw new Error(`Failed to initialize Selenium WebDriver: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      this.isInitializing = false
    }
  }

  async scrapePuzzle(difficulty: string): Promise<SudokuPuzzle> {
    if (!this.driver) {
      console.log('Driver not initialized, attempting to initialize...')
      await this.initialize()

      if (!this.driver) {
        throw new Error('Failed to initialize driver after attempt')
      }
    }

    try {
      const url = `https://www.nytimes.com/puzzles/sudoku/${difficulty.toLowerCase()}`
      console.log('Navigating to URL:', url)
      await this.driver.get(url)

      // Wait for the puzzle to load
      console.log('Waiting for puzzle board to load...')
      await this.driver.wait(
        until.elementLocated(By.css('.su-board')),
        10000
      )
      console.log('Puzzle board loaded successfully')

      // Get the puzzle data from the window object
      console.log('Extracting puzzle data...')
      const puzzleData = await this.driver.executeScript<PuzzleData>(`
        return window.__INITIAL_STATE__.sudoku.puzzleData;
      `)

      if (!puzzleData || !puzzleData.puzzle || !puzzleData.solution) {
        throw new Error('Failed to extract puzzle data')
      }

      // Log the extracted data
      console.log('Puzzle Data:', {
        difficulty,
        puzzle: puzzleData.puzzle,
        solution: puzzleData.solution
      })

      return {
        puzzle: puzzleData.puzzle,
        solution: puzzleData.solution,
        difficulty: difficulty
      }
    } catch (error) {
      console.error('Error scraping puzzle:', error)
      // Log additional error details
      if (error instanceof Error) {
        console.error('Error details:', {
          message: error.message,
          stack: error.stack
        })
      }
      throw error
    }
  }

  async cleanup() {
    if (this.driver) {
      try {
        console.log('Cleaning up Selenium WebDriver...')
        await this.driver.quit()
        console.log('Selenium WebDriver cleaned up successfully')
      } catch (error) {
        console.error('Error during cleanup:', error)
      } finally {
        this.driver = null
      }
    }
  }
}