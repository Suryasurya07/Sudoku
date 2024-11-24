import React, { useState, useEffect } from "react";
import { Clock, Rocket, RotateCcw, Save, Award } from "lucide-react";
import MessageModal from "./MessageModal";
import Button from "./Button";
import { solveSudoku } from '../utils/sudokuSolver';
import { isValidSudoku } from '../utils/validateGrid';

const SudokuGame = () => {
  const [grid, setGrid] = useState(Array(9).fill().map(() => Array(9).fill("")));
  const [modal, setModal] = useState({ visible: false, message: "", type: "" });
  const [timer, setTimer] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [difficulty, setDifficulty] = useState("medium");
  const [moves, setMoves] = useState(0);
  const [initialGrid, setInitialGrid] = useState(null);

  // Timer effect
  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  // Format time for display
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Generate a new puzzle
  const generatePuzzle = () => {
    const samplePuzzle = [
      ["5", "3", "", "", "7", "", "", "", ""],
      ["6", "", "", "1", "9", "5", "", "", ""],
      ["", "9", "8", "", "", "", "", "6", ""],
      ["8", "", "", "", "6", "", "", "", "3"],
      ["4", "", "", "8", "", "3", "", "", "1"],
      ["7", "", "", "", "2", "", "", "", "6"],
      ["", "6", "", "", "", "", "2", "8", ""],
      ["", "", "", "4", "1", "9", "", "", "5"],
      ["", "", "", "", "8", "", "", "7", "9"]
    ];

    setGrid(samplePuzzle);
    setInitialGrid(JSON.parse(JSON.stringify(samplePuzzle)));
    setIsPlaying(true);
    setTimer(0);
    setMoves(0);
  };

  const handleInputChange = (row, col, value) => {
    if (!isPlaying) return;
    if (initialGrid && initialGrid[row][col] !== "") return;

    if (value === "" || /^[1-9]$/.test(value)) {
      const newGrid = grid.map((r, i) =>
        r.map((cell, j) => (i === row && j === col ? value : cell))
      );
      setGrid(newGrid);
      setMoves((prev) => prev + 1);
    }
  };

  const validateGrid = () => {
    if (isValidSudoku(grid)) {
      setModal({ visible: true, message: "Great job! The puzzle is valid so far!", type: "success" });
    } else {
      setModal({ visible: true, message: "There are some conflicts in the puzzle. Keep trying!", type: "error" });
    }
  };

  const handleSolve = () => {
    const solvedGrid = solveSudoku([...grid]);
    if (solvedGrid) {
      setGrid(solvedGrid);
      setIsPlaying(false);
      setModal({ visible: true, message: "Puzzle solved! Try solving one yourself next time!", type: "success" });
    } else {
      setModal({ visible: true, message: "This puzzle cannot be solved. Check your inputs.", type: "error" });
    }
  };

  const resetGame = () => {
    if (initialGrid) {
      setGrid(JSON.parse(JSON.stringify(initialGrid)));
      setMoves(0);
    }
  };

  // Hint function to give a player a hint
  const giveHint = () => {
    // Find the first empty cell
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (grid[row][col] === "") {
          const validNumber = getValidNumber(row, col);
          if (validNumber) {
            const newGrid = grid.map((r, i) =>
              r.map((cell, j) => (i === row && j === col ? validNumber : cell))
            );
            setGrid(newGrid);
            setMoves((prev) => prev + 1);
            setModal({ visible: true, message: `Hint: Row ${row + 1}, Col ${col + 1} should be ${validNumber}`, type: "info" });
            return;
          }
        }
      }
    }
    setModal({ visible: true, message: "No more hints available.", type: "info" });
  };

  // Function to get valid number for a given cell
  const getValidNumber = (row, col) => {
    for (let num = 1; num <= 9; num++) {
      if (isValidMove(grid, row, col, num.toString())) {
        return num.toString();
      }
    }
    return null; // No valid number found
  };

  // Function to check if placing a number in a cell is valid
  const isValidMove = (grid, row, col, num) => {
    // Check row, column, and 3x3 grid for conflicts
    for (let i = 0; i < 9; i++) {
      if (grid[row][i] === num || grid[i][col] === num) return false;
    }
    const startRow = Math.floor(row / 3) * 3;
    const startCol = Math.floor(col / 3) * 3;
    for (let i = startRow; i < startRow + 3; i++) {
      for (let j = startCol; j < startCol + 3; j++) {
        if (grid[i][j] === num) return false;
      }
    }
    return true;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-800 via-pink-600 to-indigo-700 p-8">
      <div className="max-w-5xl mx-auto">
        {/* Game Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-extrabold text-white mb-2">Sudoku Master</h1>
          <p className="text-white/80 text-lg">Challenge your mind with our Sudoku puzzles</p>
        </div>

        {/* Game Container */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Panel - Stats */}
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-pink-600 to-purple-700 text-white p-6 rounded-xl">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <Clock className="w-6 h-6" />
                    <span className="text-2xl font-semibold">{formatTime(timer)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Rocket className="w-6 h-6" />
                    <span className="text-2xl font-semibold">{moves} moves</span>
                  </div>
                </div>
                <div className="flex gap-4">
                  <Button
                    text="New Game"
                    onClick={generatePuzzle}
                    className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-6 rounded-lg hover:bg-indigo-700 transition duration-300"
                  />
                  <Button
                    text="Reset"
                    onClick={resetGame}
                    className="flex-1 bg-gray-700 text-white py-3 px-6 rounded-lg hover:bg-gray-800 transition duration-300"
                  />
                </div>
              </div>

              {/* Difficulty Selection */}
              <div className="bg-white p-6 rounded-xl shadow-md">
                <h3 className="font-semibold mb-4 text-xl text-gray-800">Difficulty</h3>
                <div className="flex gap-4">
                  {["easy", "medium", "hard"].map((level) => (
                    <Button
                      key={level}
                      text={level.charAt(0).toUpperCase() + level.slice(1)}
                      onClick={() => setDifficulty(level)}
                      className={`flex-1 py-2 rounded-lg ${difficulty === level ? 'bg-purple-600 text-white' : 'bg-gray-300 text-black'}`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Main Game Board */}
            <div className="col-span-2 space-y-6">
              <div className="grid grid-cols-9 gap-1">
                {grid.map((row, rowIndex) => (
                  row.map((cell, colIndex) => (
                    <input
                      key={`${rowIndex}-${colIndex}`}
                      value={cell}
                      onChange={(e) => handleInputChange(rowIndex, colIndex, e.target.value)}
                      className="w-full h-16 text-center text-2xl font-semibold border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      maxLength="1"
                      disabled={initialGrid && initialGrid[rowIndex][colIndex] !== ""}
                    />
                  ))
                ))}
              </div>

              {/* Actions */}
              <div className="flex gap-4 mt-6">
                <Button
                  text="Validate"
                  onClick={validateGrid}
                  className="bg-gradient-to-r from-green-500 to-blue-500 text-white py-3 px-6 rounded-lg hover:bg-green-600 transition duration-300"
                />
                <Button
                  text="Solve"
                  onClick={handleSolve}
                  className="bg-gradient-to-r from-red-500 to-yellow-500 text-white py-3 px-6 rounded-lg hover:bg-red-600 transition duration-300"
                />
                <Button
                  text="Hint"
                  onClick={giveHint}
                  className="bg-gradient-to-r from-yellow-600 to-red-600 text-white py-3 px-6 rounded-lg hover:bg-yellow-700 transition duration-300"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {modal.visible && (
        <MessageModal
          message={modal.message}
          type={modal.type}
          onClose={() => setModal({ visible: false, message: "", type: "" })}
        />
      )}
    </div>
  );
};

export default SudokuGame;
