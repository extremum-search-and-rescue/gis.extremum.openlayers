let windowStyles = window.getComputedStyle(document.body);

export const gisColorPalette = [
  ['--blue-600','fff'],
  ['--red-600', 'fff'],
  ['--brown-300', '000'],
  ['--grass-600', 'fff'],
  ['--bluegray-500','fff'],
  ['--olive-600','fff'],
  ['--green-600', 'fff'],
  ['--violet-600','fff'],
  ['--red-300', '000'],
  ['--yellow-300', '00'],
  ['--grass-300', '000'],
  ['--purple-300', '000'],
  ['--gray-400','fff'],
  ['--red-800', 'fff'],
  ['--blue-400','000'],
  ['--orange-700', 'fff'],
  ['--brown-900', 'fff'],
  ['--olive-900','fff'],
  ['--grass-900', 'fff'],
  ['--purple-700', 'fff'],
  ['--violet-900','fff'],
  ['--gray-900','fff'],
  ['--blue-800','fff'],
  ['--bluegray-800','fff'],
  ['--orange-500', 'fff'],
].map(colorPair => 
  [
    windowStyles.getPropertyValue(colorPair[0]).replace('#',''), 
    colorPair[1]
  ]
);

let customLeafletColorId = 0;
export function customGetNextColorPair() {
  let neededColor = gisColorPalette[customLeafletColorId];
  customLeafletColorId++;

  if (customLeafletColorId === gisColorPalette.length) {
    customLeafletColorId = 0;
  }
  return neededColor;
}