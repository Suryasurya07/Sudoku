export const solveSudoku = (grid) => {
    const isValid = (num, row, col) => {
      for (let i = 0; i < 9; i++) {
        if (grid[row][i] === num || grid[i][col] === num) return false;
        const subRow = Math.floor(row / 3) * 3 + Math.floor(i / 3);
        const subCol = Math.floor(col / 3) * 3 + (i % 3);
        if (grid[subRow][subCol] === num) return false;
      }
      return true;
    };
  
    const solve = () => {
      for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
          if (!grid[row][col]) {
            for (let num = 1; num <= 9; num++) {
              if (isValid(num, row, col)) {
                grid[row][col] = num;
                if (solve()) return true;
                grid[row][col] = 0;
              }
            }
            return false;
          }
        }
      }
      return true;
    };
  
    return solve() ? grid : null;
  };
  