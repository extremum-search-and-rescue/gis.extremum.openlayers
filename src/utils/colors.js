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

export function customGetNextColor() {
  let neededColor = gisColorPalette[customLeafletColorId];
  customLeafletColorId++;

  if (customLeafletColorId === gisColorPalette.length) {
    customLeafletColorId = 0;
  }
  return neededColor[0];
}

let customLeafletColorId = 0;
export function customGetNextColorPair() {
  let neededColor = gisColorPalette[customLeafletColorId];
  customLeafletColorId++;

  if (customLeafletColorId === gisColorPalette.length) {
    customLeafletColorId = 0;
  }
  return neededColor;
}

/**
 * 
 * @param {string} hex without leading #
 * @param {number?} alpha 
 * @returns {string}
 */
export function hexToRGB(hex, alpha) {
  var r = parseInt(hex.slice(0, 2), 16),
    g = parseInt(hex.slice(2, 4), 16),
    b = parseInt(hex.slice(4, 6), 16);

  if (alpha) {
    return 'rgba(' + r + ', ' + g + ', ' + b + ', ' + alpha + ')';
  } else {
    return 'rgb(' + r + ', ' + g + ', ' + b + ')';
  }
}


const isValidHex = (hex) => /^#?([A-Fa-f0-9]{3,4}){1,2}$/.test(hex);

const getChunksFromString = (st, chunkSize) => st.match(new RegExp(`.{${chunkSize}}`, 'g'));

const convertHexUnitTo256 = (hexStr) => parseInt(hexStr.repeat(2 / hexStr.length), 16);

const getAlphafloat = (a, alpha) => {
  if (typeof a !== 'undefined') {return a / 255;}
  if ((typeof alpha != 'number') || alpha <0 || alpha >1){
    return 1;
  }
  return alpha;
};

export const hexToRGBA = (hex, alpha) => {
  if (!isValidHex(hex)) {throw new Error('Invalid HEX');}
  const chunkSize = Math.floor((hex.length - 1) / 3);
  const hexArr = getChunksFromString(hex.slice(1), chunkSize);
  const [r, g, b, a] = hexArr.map(convertHexUnitTo256);
  return `rgba(${r}, ${g}, ${b}, ${getAlphafloat(a, alpha)})`;
};