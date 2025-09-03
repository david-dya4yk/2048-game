import { CELL_GAP, CELL_SIZE, GRID_SIZE } from './constants.ts';
import type { Cell } from '../types/cell-type.ts';
import { canAccept, slideTiles } from './tile.ts';

export const addBoardProperty = (board: HTMLElement) => {
  board.style.setProperty('--grid-size', `${GRID_SIZE}`);
  board.style.setProperty('--cell-size', `${CELL_SIZE}vmin`);
  board.style.setProperty('--cell-gap', `${CELL_GAP}vmin`);
};


export const moveUp = (cellsByColumn: Cell[][]) => {
  return slideTiles(cellsByColumn);
};

export const moveDown = (cellsByColumn: Cell[][]) => {
  return slideTiles(cellsByColumn.map(column => [...column].reverse()));
};

export const moveLeft = (cellsByRow: Cell[][]) => {
  return slideTiles(cellsByRow);
};

export const moveRight = (cellsByRow: Cell[][]) => {
  return slideTiles(cellsByRow.map(row => [...row].reverse()));
};

const canMove = (cells: Cell[][]) => {
  return cells.some(group => {
    return group.some((cell, index) => {
      if (index === 0) return false;
      if (cell.tile == null) return false;

      const moveToCell = group[index - 1];

      return canAccept(cell, moveToCell);
    });
  });
};

export const canMoveUp = (cellsByColumn: Cell[][]) => {
  return canMove(cellsByColumn);
};

export const canMoveDown = (cellsByColumn: Cell[][]) => {
  return canMove(cellsByColumn.map(column => [...column].reverse()));
};

export const canMoveLeft = (cellsByRow: Cell[][]) => {
  return canMove(cellsByRow);
};

export const canMoveRight = (cellsByRow: Cell[][]) => {
  return canMove(cellsByRow.map(row => [...row].reverse()));
};
