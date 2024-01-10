/* eslint-disable no-useless-escape */
export class CoordinateConverter {

  static parse(text)
  {
    if (CoordinateConverter.DEGREES_AND_MINUTES_REGEXP.test(text)) {
      const matches = text.match(new RegExp(CoordinateConverter.DEGREES_AND_MINUTES_REGEXP, 'g'));
      if (matches.length > 0) return CoordinateConverter.degreesAndMinutesCoordinateToLonLat(matches[0]);
    }
    else if (CoordinateConverter.DEGREES_AND_MINUTES_AND_SECONDS_REGEXP.test(text)) {
      const matches = text.match(new RegExp(CoordinateConverter.DEGREES_AND_MINUTES_AND_SECONDS_REGEXP, 'g'));
      if (matches.length > 0) return CoordinateConverter.degreesAndMinutesAndSecondsCoordinateToLonLat(matches[0]);
    }
    else if (CoordinateConverter.SIGNED_DEGREES_REGEXP.test(text)) {
      const matches = text.match(new RegExp(CoordinateConverter.SIGNED_DEGREES_REGEXP, 'g'));
      if (matches.length > 0) return CoordinateConverter.signedDegreesCoordinateToLonLat(matches[0]);
    }
    else {
      return null;
    }
  }

  static formatNumber(
    value,
    size,
    precision = 0) {
    if (value < 0) {
      return value.toFixed(precision);
    }

    if (precision > 0) {
      size += 1;
    }

    return value
      .toFixed(precision)
      .padStart(size + precision, '0');
  }

  static coordinatePresentations(
    coordinate,
    isLat) {
    const degrees = Math.abs(coordinate);
    const intDegrees = Math.floor(degrees);
    const minutes = (degrees - intDegrees) * 60;
    const intMinutes = Math.floor(minutes);
    const seconds = (minutes - intMinutes) * 60;

    let direction, directionRus;
    if (isLat) {
      direction = (coordinate < 0) ? 'S' : 'N';
      directionRus = (coordinate < 0) ? 'Ю' : 'С';
    } else {
      direction = (coordinate < 0) ? 'W' : 'E';
      directionRus = (coordinate < 0) ? 'З' : 'В';
    }

    return {
      signedDegrees: CoordinateConverter.formatNumber(coordinate, 0, 5),
      degrees: CoordinateConverter.formatNumber(degrees, 0, 5),
      intDegrees: CoordinateConverter.formatNumber(intDegrees, isLat ? 2 : 3),
      minutes: CoordinateConverter.formatNumber(minutes, 2, 3),
      intMinutes: CoordinateConverter.formatNumber(intMinutes, 2),
      seconds: CoordinateConverter.formatNumber(seconds, 2, 0),
      direction,
      directionRus
    };
  }

  static formatLonLat(coordinates, formatter) {
    return `${formatter(CoordinateConverter.coordinatePresentations(coordinates[1], true))} ${formatter(CoordinateConverter.coordinatePresentations(coordinates[0], false))}`;
  }

  static SIGNED_DEGREES (formattedCoordinates) {
    return formattedCoordinates.signedDegrees;
  }

  static DEGREES_AND_MINUTES_AND_SECONDS (formattedCoordinates) {
    return `${formattedCoordinates.direction} ${formattedCoordinates.intDegrees}°${formattedCoordinates.intMinutes}′${formattedCoordinates.seconds}″`;
  }

  static DEGREES_AND_MINUTES (formattedCoordinates) {
    return `${formattedCoordinates.direction} ${formattedCoordinates.intDegrees}°${formattedCoordinates.minutes}′`;
  }

  static FPL_SHR_DEGREES_AND_MINUTES_AND_SECONDS (formattedCoordinates) {
    return `${formattedCoordinates.intDegrees}${formattedCoordinates.intMinutes}${formattedCoordinates.seconds}${formattedCoordinates.directionRus}`;
  }

  static DEGREES_AND_MINUTES_REGEXP = /[SN]?\s?(\d{1,2})[\s\.°]+(\d{1,2}([\s\.,]+\d{3,16}))['′]?[\s,;]+[EЕW]?\s?(\d{1,3})[\s\.°]+(\d{1,2}([\s\.,]+\d{3,16}))['′]?/;
  static SIGNED_DEGREES_REGEXP =  /[SN]?\s?(-?\d{1,2}[°\s\.,]\d{1,16})°?[\s,;]+[EЕW]?\s?(-?\d{1,3}[°\s\.,]\d{1,16})°?/;
  static DEGREES_AND_MINUTES_AND_SECONDS_REGEXP = /[SN]?\s?(\d{1,2})[\s.°]{1,2}(\d{1,2})[\s.'′]+(\d{1,2}([\.,]\d{1,9})?)['″""\s]{0,2}[SN]?[\s,;]+[EЕW]?\s?(\d{1,3})[\s.°]{1,2}(\d{1,2})[\s.'′]+(\d{1,2}([\.,]\d{1,9})?)['″""\s]{0,2}[EW]?/;
  static POINT_NAME_REGEXP = /[\s,;]?[a-zA-Zа-яА-Я\s,;]+\d/;

  static degreesAndMinutesCoordinateToLonLat(text) {
    if (CoordinateConverter.DEGREES_AND_MINUTES_REGEXP.test(text)) {
      let match = text.match(CoordinateConverter.DEGREES_AND_MINUTES_REGEXP);
      const latDeg = match[1];
      const latMin = match[2].replace(' ','.').replace(',','.');
      const lonDeg = match[4];
      const lonMin = match[5].replace(' ', '.').replace(',', '.');
        
      return [
        parseFloat(lonDeg) + 1 / 60 * parseFloat(lonMin),
        parseFloat(latDeg) + 1 / 60 * parseFloat(latMin) 
      ];
    }
  }

  static degreesAndMinutesAndSecondsCoordinateToLonLat(text) {
    if (CoordinateConverter.DEGREES_AND_MINUTES_AND_SECONDS_REGEXP.test(text)) {
      let match = text.match(CoordinateConverter.DEGREES_AND_MINUTES_AND_SECONDS_REGEXP);
      const latDeg = match[1];
      const latMin = match[2].replace(' ', '.').replace(',', '.');
      const latSec = match[3].replace(',', '.');

      const lonDeg = match[5];
      const lonMin = match[6].replace(' ', '.').replace(',', '.');
      const lonSec = match[7].replace(',', '.');

      return [
        parseFloat(lonDeg) + 1 / 60 * parseFloat(lonMin) + 1 / 3600 * parseFloat(lonSec),
        parseFloat(latDeg) + 1 / 60 * parseFloat(latMin) + 1/3600*parseFloat(latSec)      	
      ];
    }
  }

  static signedDegreesCoordinateToLonLat(text) {
    if (CoordinateConverter.SIGNED_DEGREES_REGEXP.test(text)) {
      let match = text.match(CoordinateConverter.SIGNED_DEGREES_REGEXP);
      const lat = match[1].replace(' ', '.').replace(',', '.').replace('°','.');
      const lon = match[2].replace(' ', '.').replace(',', '.').replace('°', '.');

      return [
        parseFloat(lon),
        parseFloat(lat)
      ];
    }
  }
}