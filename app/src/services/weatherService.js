/**
 * $http service
 * @private
 * @const {object}
 */
const _http = new WeakMap();

/**
 * $http service
 * @private
 * @const {object}
 */
const _q = new WeakMap();

/**
 * Class representing weather services
 */
class WeatherService {
  /**
   * Create weather services
   * @param {object} $http HTTP method
   * @param {object} $q Promise method
	 * @return {object} Instance of Weather Service
   */
  constructor($http, $q) {
    _http.set(this, $http);
    _q.set(this, $q);
  }
    /**
     * Get the weather
     * @param {Object} obj - The address or
     * @param {string} [obj.address] The address to use for weather report
     * @param {boolean} [obj.useBrowserLoc] Use geo location
     * @return {object} Return a promise with the weather data
     */
  getWeather(obj) {
    const _obj = obj || {
      address: 'current'
    };
    return _q.get(this)((resolve, reject) => {

      if ('geolocation' in navigator && _obj.address === 'current') {
        try {
          navigator.geolocation.getCurrentPosition((position) => {
            _http.get(this).get(`http://api.openweathermap.org/data/2.5/forecast
							/daily?appid=351ed20102b23f5717c91fbc65a32c1c&lat=
							${position.coords.latitude}&lon=${position.coords.longitude}
							&units=imperial&cnt=7`)
              .then((data) => {
                resolve(data);
              }, (e) => {
                reject(e);
              });
          }, (error) => {
            reject(error);
          });
        }
				catch (error) {
					reject(error);
				}
      }
			else {
        /* geolocation IS NOT available */
        _http.get(this).get(`http://api.openweathermap.org/data/2.5/forecast
					/daily?appid=2de143494c0b295cca9337e1e96b00e0&q=${_obj.address}
					&units=imperial&cnt=7`)
          .then((data) => {
            resolve(data);
          }, (e) => {
            reject(e);
          });
      }

    });
  }

  /**
   * Request weather from weather service
   * @param {object} obj - An object including the address to get weather for
   * @param {string} [obj.address] The address to use for weather report
   * @return {object} Promise
   */
  getWeatherService(obj) {
    return _q.get(this)((resolve, reject) => {
      let info;

      this.getWeather(obj).then((weather) => {
        info = {
          name: weather.data.city.name,
          cards: weather.data.list,
          isCommunicationError: false
        };
        resolve(info);
      }, () => {
        info = {
          isCommunicationError: true
        };
        reject(info);
      });
    });
  }
}

export default WeatherService;
