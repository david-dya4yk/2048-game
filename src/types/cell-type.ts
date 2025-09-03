export interface Cell {
  cellElement: HTMLElement
  tile: HTMLElement | null
  x: number
  y: number
  mergeTile: HTMLElement | null
}