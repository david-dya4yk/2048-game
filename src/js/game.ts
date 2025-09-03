import type { Cell } from '../types/cell-type.ts';
import { getElementCssVariableValue } from '../utils/get-element-css-variable-value.ts';
import { isValidNumber } from '../utils/is-valid-number.ts';
import { addNewTile, mergeTiles, waitForTransition } from './tile.ts';
import {
  addBoardProperty,
  canMoveDown,
  canMoveLeft,
  canMoveRight,
  canMoveUp,
  moveDown,
  moveLeft,
  moveRight,
  moveUp,
} from './board.ts';
import { debounce } from '../utils/debounce.ts';
import { createCellElements, getCellsByColumn, getCellsByRow } from './cell.ts';

enum ArrowKey {
  up = 'ArrowUp',
  down = 'ArrowDown',
  left = 'ArrowLeft',
  right = 'ArrowRight',
}

interface Init {
  gameBoard: HTMLElement,
  gameSubtitle: HTMLElement,
  gameScore: HTMLElement,
  restartBtn: HTMLElement
  cells: Cell[],
  cellsByColumn: Cell[][],
  cellsByRow: Cell[][]
}

const isArrowKew = (key: string): key is ArrowKey => {
  return Object.values(ArrowKey).includes(key as ArrowKey);
};

const getTotalScore = (cells: Cell[]) => {
  return cells.reduce((acc: number, cur: Cell) => {
    if (cur.tile) {
      const value = Number(getElementCssVariableValue(cur.tile, 'value'));
      if (isValidNumber(value)) {
        acc += value;
      }
    }

    return acc;

  }, 0);
};

const initHandlers = ({gameBoard, gameSubtitle, gameScore, restartBtn, cells, cellsByColumn, cellsByRow} : Init) => {
  let touchstartX = 0;
  let touchstartY = 0;

  const restartGame = () => {
    cells.forEach((cell) => {
      if (cell.tile) {
        cell.tile.remove();
        cell.tile = null;
      }
    });

    addNewTile(cells, gameBoard);
    addNewTile(cells, gameBoard);
    gameScore.style.setProperty('--score', `${getTotalScore(cells)}`);
    gameSubtitle.textContent = 'Join the numbers and get to the 2048 tile!';
  };

  const handleStep = async (direction: ArrowKey) => {

    switch (direction) {
      case (ArrowKey.up): {
        if (!canMoveUp(cellsByColumn)) {
          // isAnimating = false;
          return;
        }
        await moveUp(cellsByColumn);
        break;
      }
      case ArrowKey.down: {
        if (!canMoveDown(cellsByColumn)) {
          return;
        }
        await moveDown(cellsByColumn);
        break;
      }
      case ArrowKey.left: {
        if (!canMoveLeft(cellsByRow)) {
          return;
        }
        await moveLeft(cellsByRow);
        break;
      }
      case ArrowKey.right: {
        if (!canMoveRight(cellsByRow)) {
          return;
        }
        await moveRight(cellsByRow);
        break;
      }
    }

    cells.forEach(mergeTiles);

    const newTile = addNewTile(cells, gameBoard);

    if (newTile) {
      await waitForTransition(newTile, true);
    }

    gameScore.style.setProperty('--score', `${getTotalScore(cells)}`);

    if (!canMoveUp(cellsByColumn) && !canMoveDown(cellsByColumn) && !canMoveLeft(cellsByRow) && !canMoveRight(cellsByRow)) {
      gameSubtitle.textContent = 'You lose :(';
    }

    if (getTotalScore(cells) >= 2048) {
      gameSubtitle.textContent = 'You win :)';
    }
  };

  restartBtn.addEventListener('click', restartGame);

  gameBoard.addEventListener('touchstart', (event) => {
    const [touch] = event.changedTouches;

    if (touch) {
      touchstartX = touch.screenX;
      touchstartY = touch.screenY;
    }
  });

  gameBoard.addEventListener('touchend', async (event) => {
    const [touch] = event.changedTouches;

    if (!touch) {
      return;
    }

    const minSwipeDistance = 50;
    const diffX = touch.screenX - touchstartX;
    const diffY = touch.screenY - touchstartY;
    const mathDiffX = Math.abs(diffX);
    const mathDiffY = Math.abs(diffY);

    if (mathDiffY > mathDiffX && mathDiffY > minSwipeDistance) {
      await handleStep(diffY > 0 ? ArrowKey.down : ArrowKey.up);

      return;
    }

    if (mathDiffY <= mathDiffX && mathDiffX > minSwipeDistance) {
      await handleStep(diffX > 0 ? ArrowKey.right : ArrowKey.left);
    }
  });

  window.addEventListener('keydown', debounce(async ({ key }) => {
    if (isArrowKew(key)) {
      await handleStep(key);
    }
  }, 300));
};

export const init = () => {
  const gameBoard = document.getElementById('game-board');
  const gameSubtitle = document.getElementById('game-subtitle');
  const gameScore = document.getElementById('game-score');
  const restartBtn = document.getElementById('game-restart');

  if (!gameBoard) {
    throw new Error('Game board not found!');
  }

  if (!gameSubtitle) {
    throw new Error('Game subtitle not found!');
  }

  if (!gameScore) {
    throw new Error('Game score not found!');
  }

  if (!restartBtn) {
    throw new Error('Game restart button not found!');
  }

  const cells = createCellElements(gameBoard);
  const cellsByColumn = getCellsByColumn(cells);
  const cellsByRow = getCellsByRow(cells);

  addBoardProperty(gameBoard);
  addNewTile(cells, gameBoard);
  addNewTile(cells, gameBoard);

  gameScore.style.setProperty('--score', `${getTotalScore(cells)}`);

  initHandlers({gameBoard, gameSubtitle, gameScore, restartBtn, cells, cellsByColumn, cellsByRow});
};