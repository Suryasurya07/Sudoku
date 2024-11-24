export const isValidSudoku = (grid) => {
    // Check rows and columns
    for (let i = 0; i < 9; i++) {
      const row = new Set();
      const col = new Set();
  
      for (let j = 0; j < 9; j++) {
        const rowValue = grid[i][j];
        const colValue = grid[j][i];
  
        if (rowValue !== "" && row.has(rowValue)) {
          return false; // Duplicate in the row
        }
        if (rowValue !== "") {
          row.add(rowValue);
        }
  
        if (colValue !== "" && col.has(colValue)) {
          return false; // Duplicate in the column
        }
        if (colValue !== "") {
          col.add(colValue);
        }
      }
    }
  
    // Check 3x3 sub-grids
    for (let rowStart = 0; rowStart < 9; rowStart += 3) {
      for (let colStart = 0; colStart < 9; colStart += 3) {
        const subGrid = new Set();
  
        for (let i = rowStart; i < rowStart + 3; i++) {
          for (let j = colStart; j < colStart + 3; j++) {
            const value = grid[i][j];
            if (value !== "" && subGrid.has(value)) {
              return false; // Duplicate in the 3x3 sub-grid
            }
            if (value !== "") {
              subGrid.add(value);
            }
          }
        }
      }
    }
  
    return true; // All checks passed, the grid is valid
  };
  