"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface GameScreenProps {
  difficulty: string
  onBack: () => void
}

export function GameScreen({ difficulty, onBack }: GameScreenProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
      >
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-2">Sudoku</h1>
        <div className="h-1 w-20 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto rounded-full mb-4"></div>
        <h2 className="text-xl text-gray-300 font-light">Difficulty: {difficulty}</h2>
      </motion.div>

      {/* Sudoku board */}
      <Card className="w-full max-w-2xl p-6 bg-white/5 backdrop-blur-sm border-0">
        <div className="grid grid-cols-3 gap-3">
          {Array.from({ length: 9 }).map((_, subGridIndex) => {
            const subGridRow = Math.floor(subGridIndex / 3)
            const subGridCol = subGridIndex % 3

            return (
              <div key={subGridIndex} className="grid grid-cols-3 gap-1">
                {Array.from({ length: 9 }).map((_, cellIndex) => {
                  const row = Math.floor(cellIndex / 3)
                  const col = cellIndex % 3
                  const absoluteRow = subGridRow * 3 + row
                  const absoluteCol = subGridCol * 3 + col

                  return (
                    <div
                      key={cellIndex}
                      className="aspect-square border border-gray-700 flex items-center justify-center text-white text-xl font-medium hover:bg-white/10 transition-colors cursor-pointer"
                    >
                      {/* Cell content will go here */}
                    </div>
                  )
                })}
              </div>
            )
          })}
        </div>
      </Card>

      <Button
        onClick={onBack}
        className="mt-8 bg-white/10 hover:bg-white/20 text-white"
      >
        Back to Menu
      </Button>

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