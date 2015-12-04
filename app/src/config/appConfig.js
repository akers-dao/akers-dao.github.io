/**
 * Config method loading routing
 */
const config = (function config() {
  const _config = ($routeProvider) => {
    $routeProvider
      .when('/', {
        templateUrl: './app/partial/app.html',
        controller: 'MainController',
        controllerAs: 'vm',
      })
      .otherwise('/');
  };

  return _config;

})();

export default config;
