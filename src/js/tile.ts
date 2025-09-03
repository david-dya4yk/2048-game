import type { Cell } from '../types/cell-type.ts';
import { randomEmptyCell } from './cell.ts';
import { getElementCssVariableValue } from '../utils/get-element-css-variable-value.ts';
import { isValidNumber } from '../utils/is-valid-number.ts';

export const createTile = (tileContainer: HTMLElement, x: number, y: number) => {
  const tile = document.createElement('div');
  const value = Math.random() > 0.5 ? 2 : 4;
  const power = Math.log2(value);
  const backgroundLightness = 100 - power * 9;

  if (!isValidNumber(x) && !isValidNumber(y)) {
    throw new Error('Unable to calculate the tile');
  }

  tile.classList.add('tile');
  tile.style.setProperty('--y', `${y}`);
  tile.style.setProperty('--x', `${x}`);
  tile.style.setProperty('--background-lightness', `${backgroundLightness}%`);
  tile.style.setProperty('--text-lightness', `${backgroundLightness <= 50 ? 90 : 10}%`);
  tile.style.setProperty('--value', `${value}`);
  tile.textContent = `${value}`;

  tileContainer.append(tile);

  return tile;
};

export const getEmptyTiles = (cells: Cell[]) => cells.filter((cell: Cell) => !cell.tile);

export const addNewTile = (cells: Cell[], gameBoardElement: HTMLElement): HTMLElement | null => {
  const emptyTiles = getEmptyTiles(cells);

  const cell = randomEmptyCell(emptyTiles);

  if (cell) {
    const tile = createTile(gameBoardElement, cell.x, cell.y);
    cell.tile = tile;

    return tile;
  }

  return null;
};

export const updateCellTile = (cell: Cell, tile: HTMLElement) => {
  cell.tile = tile;

  if (!isValidNumber(cell.x) || !isValidNumber(cell.y)) {
    throw new Error('Unable to calculate the tile');
  }

  tile.style.setProperty('--x', `${cell.x}`);
  tile.style.setProperty('--y', `${cell.y}`);
};

export const updateCellMergeTile = (cell: Cell, mergeTile: HTMLElement) => {
  if (!cell.tile || !mergeTile) return;
  if (!isValidNumber(cell.x) || !isValidNumber(cell.y)) {
    throw new Error('Unable to calculate the tile');
  }

  cell.mergeTile = mergeTile;
  mergeTile.style.setProperty('--x', `${cell.x}`);
  mergeTile.style.setProperty('--y', `${cell.y}`);
};

export const canAccept = (cellToMove: Cell, destinationCell: Cell) => {
  return !destinationCell.tile ||
    (!destinationCell.mergeTile &&
      destinationCell.tile.textContent === cellToMove.tile?.textContent);
};

export const waitForTransition = (tile: HTMLElement, animations: boolean = false) => {
  return new Promise(resolve => {
    tile.addEventListener(animations ? 'animationend' : 'transitionend', resolve);
  });
};

export const slideTiles = (cells: Cell[][]) => {
  return Promise.all(
    cells.flatMap((group) => {
      const promises = [];

      for (let i = 1; i < group.length; i++) {
        const cell = group[i];
        if (cell.tile == null) continue;

        let lastValidCell;

        for (let j = i - 1; j >= 0; j--) {
          const moveToCell = group[j];
          if (!canAccept(cell, moveToCell)) break;
          lastValidCell = moveToCell;
        }

        if (lastValidCell != null) {
          promises.push(waitForTransition(cell.tile));

          if (lastValidCell.tile != null) {
            updateCellMergeTile(lastValidCell, cell.tile);

          } else {
            updateCellTile(lastValidCell, cell.tile);
          }

          cell.tile = null;
        }
      }

      return promises;
    }),
  );
};

export const mergeTiles = (cell: Cell) => {
  if (cell.tile === null || cell.mergeTile == null) return;

  const x = getElementCssVariableValue(cell.tile, 'x');
  const y = getElementCssVariableValue(cell.tile, 'y');
  const tileValue = getElementCssVariableValue(cell.tile, 'value');
  const mergeTileValue = getElementCssVariableValue(cell.mergeTile, 'value');

  if (!isValidNumber(x) || !isValidNumber(y) || !isValidNumber(tileValue) || !isValidNumber(mergeTileValue)) {
    throw new Error('Unable to calculate the tile');
  }

  const totalValue = +tileValue + +mergeTileValue;
  const power = Math.log2(totalValue);
  const backgroundLightness = 100 - power * 9;

  cell.tile.style.setProperty('--x', x);
  cell.tile.style.setProperty('--y', y);
  cell.tile.style.setProperty('--value', `${totalValue}`);
  cell.tile.style.setProperty('--background-lightness', `${backgroundLightness}%`);
  cell.tile.style.setProperty('--text-lightness', `${backgroundLightness <= 50 ? 90 : 10}%`);
  cell.tile.textContent = `${totalValue}`;

  cell.mergeTile.remove();
  cell.mergeTile = null;
};
