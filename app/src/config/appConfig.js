var config = (function config() {
	var _config = ($routeProvider, $locationProvider)=> {
		$routeProvider
			.when('/', {
				templateUrl: './partial/app.html',
				controller: 'MainController',
				controllerAs: "vm",
			})
			.otherwise('/')
	}
	
	return _config

})();

export default config;