export const getElementCssVariableValue = (tile: HTMLElement, name: string) => {
  return getComputedStyle(tile).getPropertyValue(`--${name}`)
}