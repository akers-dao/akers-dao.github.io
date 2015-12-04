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
   * @param {object} WeatherService Service to interact with Open Weather API
   * @param {object} $mdDialog Opens a dialog over the app
   * @param {object} $q A service that helps you run functions asynchronously
   * @param {object} $mdSidenav A Sidenav component that can be opened and closed programatically
   * @param {object} LocalStorage Service window.LocalStorage wrapper
   * @param {object} $scope Scope object
   * @return {object} Instance of MainController
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
    this.isCommunicationError = false;
    this.sideBarListItems = _localStorage.get(this).db;
    if (this.sideBarListItems.length > 0) {
      this.handleWeatherSearch(this.sideBarListItems[0]);
    }
		else {
      MainController.displaySearchDialog.bind(this)();
    }

    //
    $scope.$on('listItemClicked', (event, value) => {
      this.handleWeatherSearch(value, true);
    });

    $scope.$on('listItemRemoved', (event, value) => {
      const index = this.sideBarListItems.indexOf(value);
      this.sideBarListItems.splice(index, 1);
    });
  }
    /**
     * change the progress state ng-if attribute
     * @return {undefined}
     */
  static changeProgressState() {
    this.isProgress = !this.isProgress;
  }
    /**
     * Set scope variables
     * @param {object} data Weather Data
     * @param {string} data.name The name of the city
     * @param {array.<object>} data.cards List of weather data
     * @param {boolean} data.isCommunicationError Communication Error flag
     * @return {undefined}
     */
  static setCards(data) {
    const {
      name,
      cards,
      isCommunicationError
    } = data;

    this.name = name;
    this.cards = cards;
    this.isCommunicationError = isCommunicationError;
  }

  /**
   * handle weather search request from UI
   * @param {string} address - Address to search
   * @param {boolean} isSideBar - The request from the sidebar
   * @param {HTMLFormElement} form - HTML form
   * @return {object} Promise
   */
  handleWeatherSearch(address, isSideBar, form) {
    /**
     * check to see if value exist in array
     * @type{number}
     */
    let index;

    if (this.sideBarListItems.length !== 0) {
      try {
        index = _localStorage.get(this).db.indexOf(address);
      }
			catch (error) {
				console.log(error);
				_localStorage.get(this).remove();
				index = -1;
			}
    }
		else {
      index = -1;
    }

    if (index === -1) {
      const tempSideBarListItems = _localStorage.get(this).db;
      (address === 'current') ? tempSideBarListItems.unshift(address) : tempSideBarListItems.push(address);
      _localStorage.get(this).db = tempSideBarListItems;

      this.sideBarListItems.push(address);

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
      const sideNav = _mdSidenav.get(this)('left');
      if (sideNav.isOpen()) {
        this.toggleSideBar();
      }

    }

    return _q.get(this)((resolve, reject) => {
      MainController.changeProgressState.bind(this)();
      if (address !== 'current') {
        _weatherService.get(this).getWeatherService({ address })
          .then((data) => {
            MainController.changeProgressState.bind(this)();
            MainController.setCards.call(this, data);
            resolve();
          }, (data) => {
            MainController.changeProgressState.bind(this)();
            MainController.setCards.call(this, data);
            reject();
          });

      }
			else {
        //	change the button on the current page to 'LOADING'
        this.clickedWeatherSearchBtn = !this.clickedWeatherSearchBtn;
        _weatherService.get(this).getWeatherService()
          .then((data) => {
            MainController.changeProgressState.bind(this)();
            MainController.setCards.call(this, data);
            resolve();
          }, (data) => {
            MainController.changeProgressState.bind(this)();
            MainController.setCards.call(this, data);
            reject();
          });
      }
    });
  }
    /**
     * Open & close the side bar
     * @return {undefined}
     */
  toggleSideBar() {
    _mdSidenav.get(this)('left')
      .toggle()
      .then(() => {});
  }

  /**
   * handles the search dialog box
   * @return {undefined}
   */
  static displaySearchDialog() {
    const self = this;
    _mdDialog.get(this).show({
      clickOutsideToClose: true,
      templateUrl: './app/partial/searchdialog.html',
      // preserveScope: true,
      controller: function DialogController($mdDialog) {
        /**
         * set the intial state of progress
         */
        this.isProgress = false;
        /**
         * closes the dialog box
         * @return {undefined}
         */
        const closeDialog = () => {
          $mdDialog.hide();
        };

        const changeProgressState = () => {
          this.isProgress = !this.isProgress;
        };

        /**
         * handles the search field in dialog
         * @param{string} address - City, State
         * @return {undefined}
         */
        this._handleWeatherSearch = (address) => {
          changeProgressState();
          self.handleWeatherSearch(address)
            .then(() => {
              changeProgressState();
              closeDialog();
            });
        };

      },
      controllerAs: 'vm'
    });
  }
}

export default MainController;
