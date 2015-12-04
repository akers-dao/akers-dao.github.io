/**
 * Provides Material Design Icon based on Open Weather Data
 * https://www.google.com/design/icons/
 */
class IconService {
  /**
   * Retrives the name Material Design Icon
   * @param {string} code - The Open Weather Map Icon key
   * @return {string} The name of Material Design Icon
   */
  getName(code) {
    const name = {
      '01d': 'wb_sunny',
      '02d': 'filter_drama',
      '03d': 'cloud',
      '04d': 'cloud',
      '09d': 'grain',
      '10d': 'grain',
      '11d': 'flash_on',
      '13d': 'ac_unit',
      '01n': 'wb_sunny',
      '02n': 'filter_drama',
      '03n': 'cloud',
      '04n': 'cloud',
      '09n': 'grain',
      '10n': 'grain',
      '11n': 'flash_on',
      '13n': 'ac_unit'
    };
    return name[code];
  }
}

export default IconService;
