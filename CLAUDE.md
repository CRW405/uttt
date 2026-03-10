# Recursive TicTacToe (UTTT) Project Context

## Overview
This is a web-based implementation of Ultimate TicTacToe (UTTT) - a recursive tic-tac-toe game where each cell contains another complete tic-tac-toe board. The project supports multiple levels of recursion (configurable depth).

## Project Structure
```
/home/cachy/Documents/uttt/
├── index.html          # Main HTML entry point
├── index.css           # Styling for the game board and UI
├── logic.js            # Core game logic and board creation
├── renderer.js         # DOM manipulation and visual board rendering
├── controller.js       # User interaction (pan/zoom/click handling)
└── .git/              # Git repository
```

## Key Files

### index.html
- Main entry point with basic HTML structure
- Includes title "Recursive TicTacToe"
- Contains UI controls explanation (click/drag to move, scroll to zoom)
- Loads all JavaScript modules

### logic.js
- **Core Functions:**
  - `create_board(l)` - Creates recursive board structure of depth `l`
  - `determine_winner(board)` - Checks for winning conditions
  - `log_board(board, depth)` - Debug utility for board visualization
- **Data Structures:**
  - Recursive arrays where each level contains 9 elements
  - Leaf nodes are arrays of 9 integers (-1, 0, 1) representing O, empty, X
  - `winning_shapes` - Array of all possible winning line combinations

### renderer.js
- **Key Variables:**
  - `player` - Current player (1 or -1)
  - `n = 3` - Current recursion depth
  - `game` - Main board instance
- **Core Functions:**
  - `create_visual_board()` - Recursively creates DOM elements for the board
  - `mark_cell()` - Handles player moves and updates board state
  - `render_mark()` - Updates visual representation of moves
- **DOM Structure:**
  - Creates nested `div` elements with classes `super_cell` and `sub_cell`
  - Uses `data-path` attributes to track position in recursive structure
  - Uses `data-mark` to track cell state

### controller.js
- **Pan/Zoom System:**
  - Mouse wheel zoom with center-focused scaling
  - Click-and-drag panning
  - Drag threshold to prevent accidental clicks after panning
- **Variables:**
  - `zoom`, `panX`, `panY` - Transform state
  - `isPanning`, `hasDragged` - Interaction state tracking

### index.css
- **Layout:**
  - Full viewport game board with overlay UI
  - CSS Grid for tic-tac-toe cell arrangement (3x3)
  - Responsive design with aspect ratios
- **Visual Style:**
  - Black borders for grid structure
  - Hover effects (red for super_cell, lightblue for sub_cell)
  - Color coding: X=red background, O=blue background

## Game Logic
1. **Board Creation:** Recursive structure where depth determines nesting level
2. **Move System:** Players alternate placing X/O marks
3. **Path Tracking:** Positions tracked as arrays (e.g., [0,1,2] for nested cells)
4. **Win Detection:** Standard tic-tac-toe rules applied recursively

## Technical Notes
- Uses ES6 modules (`import`/`export`)
- Event-driven architecture for user interactions
- No external dependencies - pure HTML/CSS/JavaScript
- Supports infinite zoom and panning for large recursive boards
- Currently set to depth 3 (playable at reasonable scale)

## Current Configuration
- **Recursion Depth:** 3 levels deep
- **Players:** X (red) and O (blue) alternating
- **Board Size:** 3x3 at each level (standard tic-tac-toe)