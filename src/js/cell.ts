import type { Cell } from '../types/cell-type.ts';
import { GRID_SIZE } from './constants.ts';

export const createCellElements = (gridElement: HTMLElement): Cell[] => {
  const cells = [];

  for (let i = 0; i < GRID_SIZE * GRID_SIZE; i++) {
    const cell = document.createElement('div');
    cell.classList.add('cell');
    cells.push(cell);
    gridElement.append(cell);
  }

  return cells.map((cell, index) => {
    return {
      cellElement: cell,
      tile: null,
      x: index % GRID_SIZE,
      y: Math.floor(index / GRID_SIZE),
      mergeTile: null,
    };
  });
};

export const getCellsByRow = (cells: Cell[]) => {
  return cells.reduce((cellGrid: Cell[][], cell: Cell) => {
    cellGrid[cell.y] = cellGrid[cell.y] || [];
    cellGrid[cell.y][cell.x] = cell;

    return [...cellGrid];
  }, []);
};


export const getCellsByColumn = (cells: Cell[]) => {
  return cells.reduce((cellGrid: Cell[][], cell: Cell) => {
    cellGrid[cell.x] = cellGrid[cell.x] || [];
    cellGrid[cell.x][cell.y] = cell;

    return [...cellGrid];
  }, []);
};

export const randomEmptyCell = (emptyCells: Cell[]): Cell | null => {
  const randomIndex = Math.floor(Math.random() * emptyCells.length);

  return emptyCells[randomIndex] ?? null;
};