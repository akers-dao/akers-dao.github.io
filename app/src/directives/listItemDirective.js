const _rootScope = new WeakMap();
const _localStorage = new WeakMap();
/**
 * Class representing list-item directive
 */
class ListItemDirective {
	constructor($rootScope, LocalStorage) {
		this.templateUrl = "./partial/listltem.html"
		this.scope = {
			items: "=",
			getPreviousWeather: "&"
		}
		_rootScope.set(this, $rootScope);
		_localStorage.set(this, LocalStorage);
	}

	link(scope, element, attr) {
		/**
		 * remove null value from the side bar list for current weather
		 * It is null because there is no address sent in the request
		 * @function removeNull
		 */
		let removeNull = () => {
			let index = scope.items.indexOf('current');
			if (index !== -1) {
				scope.items.splice(index, 1);
			}
		}
		/**
		 * Handles requesting save address weather report
		 * @function getPreviousWeather
		 * @param {string} item - Address for weather report
		 */
		scope.getPreviousWeather = (item) => {
			_rootScope.get(ListItemDirective.instance).$broadcast('listItemClicked',item);
		}
		/**
		 * Removes address from side bar list
		 * @function removeItem
		 * @param {string} item - Address for weather report
		 * @param {object} event - Event object
		 */
		scope.removeItem = (item, event) => {
			event.stopImmediatePropagation()
			_localStorage.get(ListItemDirective.instance).removeItem(item);
			_rootScope.get(ListItemDirective.instance).$broadcast('listItemRemoved', item);
			console.log(item);
		}

		removeNull();
	}

	static directiveFactory($rootScope, LocalStorage) {
		ListItemDirective.instance = new ListItemDirective($rootScope, LocalStorage);
		return ListItemDirective.instance;
	}
}

export default ListItemDirective