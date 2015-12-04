/**
 * Icon service
 * @private
 * @const {object}
 */
const _iconService = new WeakMap();

/**
 * Class representing weather-card directive
 */
class WeatherCardDirective {
	constructor(IconService) {
		this.scope = {
			data: '@'
		};
		this.templateUrl = "./app/partial/weathercard.html";
		_iconService.set(this, IconService);
	}

	link(scope, element, attrs) {
		/**
		 * adds/updates the weather-card directive with data
		 * @function
		 */
		let updateWeatherCard = ()=>{
			/**
			 * open weather data
			 * @type {object}
			 */
			let dayWeatherData = JSON.parse(attrs.data);
			/**
			 * convert open weather data DT time to milliseconds
			 * @type {number}
			 */
			let timeInMilliseconds = dayWeatherData.dt * 1000;
			/**
			 * number for the day of the week
			 * @type {number}
			 */
			let _day = new Date(timeInMilliseconds).getDay();
			/**
			 * Destructuring allows binding using pattern matching
			 * @type {string}
			 */
			let {main, description, icon} = dayWeatherData.weather[0];
			/**
			 * the name of the font icon to display based weather i.e. "icon": "01d"
			 * @type{string}
			 */
			let iconName = _iconService.get(WeatherCardDirective.instance).getName(icon);
			if (attrs.index === '0') {
				scope.name = attrs.name;
				attrs.$set('flex', 'grow');
			}
			/**
			 * The name of day of week
			 * @type{string}
			 */
			scope.day = WeatherCardDirective.getDayName(_day);
			/**
			 * Group of weather parameters (Rain, Snow, Extreme etc.)
			 * @type{string}
			 */
			scope.main = main;
			/**
			 * Weather condition within the group
			 * @type{string}
			 */
			scope.description = description;
			/**
			 *temperature
			 * @type{number}
			 */
			scope.temp = dayWeatherData.temp;
			/**
			 * the humidity
			 * @type{number}
			 */
			scope.humidity = (dayWeatherData.humidity === 0) ? 100 : dayWeatherData.humidity;
			/**
			 * 
			 * @type{string}
			 */
			scope.icon = iconName;
		}
		
		updateWeatherCard();
		
		scope.$watch('data', (n, o) => {
			if (n !== o) {
				updateWeatherCard();
			}
		})
	}
	/**
	 * Provides the name of the day of the week
	 * @param {number} num number that represents the day of week
	 * @static
	 * @return {string} Day of week
	 */

	static getDayName(num) {
		/**
		 * Name of Days of week
		 * @type {array.<string>} 
		 */
		let dayName = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

		return dayName[num];
	}
	
	/**
	 * Provides the Instance of Weather Card Directive.  This is required when using ES2015 class sytnax
	 * @param {IconService} IconService 
	 * @static
	 * @return {object} Instance of Weather Card Directive
	 */
	
	static weatherCardFactory(IconService) {
		WeatherCardDirective.instance = new WeatherCardDirective(IconService);
		return WeatherCardDirective.instance;
	}
}

export default WeatherCardDirective;