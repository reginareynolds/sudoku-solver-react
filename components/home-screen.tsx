"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Grid2X2, Trophy, Brain } from "lucide-react"
import { GameScreen } from "./game-screen"

export function HomeScreen() {
  const [hoveredDifficulty, setHoveredDifficulty] = useState<string | null>(null)
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null)

  const handleDifficultySelect = (difficulty: string) => {
    setSelectedDifficulty(difficulty)
  }

  const handleBack = () => {
    setSelectedDifficulty(null)
  }

  const difficulties = [
    {
      name: "Easy",
      icon: <Grid2X2 className="h-6 w-6" />,
      color: "bg-gradient-to-br from-green-400 to-green-600",
      description: "Perfect for beginners",
    },
    {
      name: "Medium",
      icon: <Brain className="h-6 w-6" />,
      color: "bg-gradient-to-br from-amber-400 to-amber-600",
      description: "A balanced challenge",
    },
    {
      name: "Hard",
      icon: <Trophy className="h-6 w-6" />,
      color: "bg-gradient-to-br from-rose-400 to-rose-600",
      description: "For Sudoku experts",
    },
  ]

  if (selectedDifficulty) {
    return <GameScreen difficulty={selectedDifficulty} onBack={handleBack} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-2">Sudoku</h1>
        <div className="h-1 w-20 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto rounded-full mb-8"></div>
        <h2 className="text-xl md:text-2xl text-gray-300 font-light">Select a difficulty</h2>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 w-full max-w-3xl">
        {difficulties.map((difficulty, index) => (
          <motion.div
            key={difficulty.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ scale: 1.05 }}
            onHoverStart={() => setHoveredDifficulty(difficulty.name)}
            onHoverEnd={() => setHoveredDifficulty(null)}
          >
            <Card
              className={`overflow-hidden border-0 shadow-lg ${hoveredDifficulty === difficulty.name ? "ring-2 ring-white/20" : ""}`}
            >
              <div className={`h-2 ${difficulty.color}`}></div>
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  <div className={`p-3 rounded-full mb-4 ${difficulty.color} bg-opacity-20`}>{difficulty.icon}</div>
                  <h3 className="text-xl font-semibold mb-1">{difficulty.name}</h3>
                  <p className="text-sm text-gray-500 mb-4">{difficulty.description}</p>
                  <Button
                    onClick={() => handleDifficultySelect(difficulty.name)}
                    className={`w-full ${difficulty.color} hover:opacity-90 transition-opacity`}
                  >
                    Start Game
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="mt-12 text-gray-400 text-sm"
      >
        <p>© {new Date().getFullYear()} Regina Reynolds</p>
      </motion.div>
    </div>
  )
}
