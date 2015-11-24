const _mdDialog = new WeakMap();
const _weatherService = new WeakMap();
const _q = new WeakMap();
const _mdSidenav = new WeakMap();
const _localStorage = new WeakMap();

/**
 * Class representing main app controller
 */
class MainController {
	/**
     * Creates main app controller
     * @param {object} WeatherService
     * @param {object} $mdDialog
     * @param {object} $q
     * @param {object} $mdSidenav
     * @param {object} LocalStorage
     * @param {object} $scope
     */
	constructor(WeatherService, $mdDialog, $q, $mdSidenav, LocalStorage, $scope) {
		_mdDialog.set(this, $mdDialog);
		_weatherService.set(this, WeatherService);
		_q.set(this, $q);
		_mdSidenav.set(this, $mdSidenav);
		_localStorage.set(this, LocalStorage);
		this.cards = [];
		this.isProgress = false;
		this.clickedWeatherSearchBtn = false;
		this.isCommunicationError = false
		this.sideBarListItems = _localStorage.get(this).db;
		if (this.sideBarListItems.length > 0) {
			this.handleWeatherSearch(this.sideBarListItems[0]);
		} else {
			MainController.displaySearchDialog.bind(this)();
		}
		
		//
		$scope.$on('listItemClicked', (event, value) => {
			this.handleWeatherSearch(value, true);	
		})

		$scope.$on('listItemRemoved', (event, value) => {
			let index = this.sideBarListItems.indexOf(value);
			this.sideBarListItems.splice(index, 1);
		})
	}
	/**
	 * change the progress state ng-if attribute
	 */
	static changeProgressState() {
		this.isProgress = !this.isProgress;
	}
	/**
	 * Request weather from weather service
	 * @param {object} obj - An object including the address to get weather for 
	 * @param {string} [obj.address] The address to use for weather report
	 * @return {object} Promise
	 */
	static _getWeatherService(obj) {
		return _q.get(this)((resolve, reject) => {
			_weatherService.get(this).getWeather(obj).then((weather) => {
				console.log(weather.data.city.name);
				this.name = weather.data.city.name;
				this.cards = weather.data.list;
				this.isCommunicationError = false;
				resolve();
			}, (error) => {
				console.log(error);
				this.isCommunicationError = true
				reject();
			});
		})
	}
	/**
	 * handle weather search request from UI
	 * @param {string} address
	 * @param {boolean} isSideBar
	 * @param {HTMLFormElement} form
	 * @return {object} Promise
	 */
	handleWeatherSearch(address, isSideBar, form) {
		/**
		 * check to see if value exist in array
		 * @type{number}
		 */
		let index
		
		if (this.sideBarListItems.length !== 0) {
			try {
				index = _localStorage.get(this).db.indexOf(address);
			} catch (error) {
				console.log(error);
				_localStorage.get(this).remove();
				index = -1;
			}
		} else {
			index = -1;
		}
		
		if (index === -1) {
			let tempSideBarListItems = _localStorage.get(this).db;
			(address === 'current') ? tempSideBarListItems.unshift(address) : tempSideBarListItems.push(address);
			_localStorage.get(this).db = tempSideBarListItems;
			
			this.sideBarListItems.push(address)
			
			index = this.sideBarListItems.indexOf('current');

			if (index !== -1) {
				this.sideBarListItems.splice(index, 1);
			} 
		}
		
		if (isSideBar) {
			this.address = '';
			if (form) {
				form.$setPristine();
				form.$setUntouched();
			}
			/**
			 * reference to sidebar $mdSideNav
			 */
			let sideNav = _mdSidenav.get(this)('left');
			if (sideNav.isOpen()) {
				this.toggleSideBar();
			}

		}
		
		return _q.get(this)((resolve, reject) => {
			MainController.changeProgressState.bind(this)();
			if (address !== 'current') {
				MainController._getWeatherService.bind(this)({ address: address})
					.then((data) => {
						MainController.changeProgressState.bind(this)();
						resolve();
					}, () => {
						console.log("error")
						MainController.changeProgressState.bind(this)();
						reject()
					})

			}
			else {
				//change the button on the current page to "LOADING"
				this.clickedWeatherSearchBtn = !this.clickedWeatherSearchBtn
				MainController._getWeatherService.bind(this)()
					.then(() => {
						MainController.changeProgressState.bind(this)();
						resolve();
					}, () => {
						console.log("error")
						MainController.changeProgressState.bind(this)();
						reject()
					})
			}
		});
	}
	/**
	 * Open & close the side bar
	 */
	toggleSideBar() {
		_mdSidenav.get(this)('left')
			.toggle()
			.then(() => {

			});
	}
	 
	/**
	 * handles the search dialog box
	 */
	static displaySearchDialog() {
		let self = this;
		_mdDialog.get(this).show({
			clickOutsideToClose: true,
			templateUrl: "./partial/searchdialog.html",
			// preserveScope: true,
			controller: function DialogController($mdDialog) {
				/**
				 * set the intial state of progress
				 */
				this.isProgress = false;
				/**
				 * closes the dialog box
				 */
				let closeDialog = () => {
					$mdDialog.hide();
				}

				let changeProgressState = () => {
					this.isProgress = !this.isProgress;
				}
				
				/**
				 * handles the search field in dialog
				 */
				this._handleWeatherSearch = (address) => {
					changeProgressState();
					self.handleWeatherSearch(address)
						.then(() => {
							changeProgressState();
							closeDialog();
						})
				}

			},
			controllerAs: 'vm'
		});
	}
}

export default MainController