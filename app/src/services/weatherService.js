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
     * @param {object} $http
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
		var _obj = obj || {address:'current'};
		return _q.get(this)((resolve, reject) => {

			if ("geolocation" in navigator && _obj.address === "current") {
				try {
					navigator.geolocation.getCurrentPosition((position) => {
						_http.get(this).get(`http://api.openweathermap.org/data/2.5/forecast/daily?appid=2de143494c0b295cca9337e1e96b00e0&lat=${position.coords.latitude}&lon=${position.coords.longitude}&units=imperial&cnt=7`)
							.then((data) => {
								resolve(data);
							}, (e) => {
								reject(e);
							});
						console.log(position.coords.latitude, position.coords.longitude);
					}, (error) => {
						reject(error)
						console.log(error);
					});
				} catch (error) {
					reject(error)
					console.log(error);
				}
			} else {
				/* geolocation IS NOT available */
				// WeatherService.noGeoLocationAPI.call(this,resolve,reject,_obj.address);
				_http.get(this).get(`http://api.openweathermap.org/data/2.5/forecast/daily?appid=2de143494c0b295cca9337e1e96b00e0&q=${_obj.address}&units=imperial&cnt=7`)
					.then((data) => {
						resolve(data);
					}, (e) => {
						reject(e);
					});
			}

		})
	}

	static noGeoLocationAPI(resolve, reject, address) {
		_http.get(this).get(`http://api.openweathermap.org/data/2.5/forecast/daily?appid=2de143494c0b295cca9337e1e96b00e0&q=${address}&units=imperial&cnt=7`)
			.then((data) => {
				resolve(data);
			}, (e) => {
				reject(e);
			});
	}
	/**
	 * Get geolocation
	 * @return {object} Return a promise with the weather data
	 */
	getGeoLocation() {

	}
}

export default WeatherService