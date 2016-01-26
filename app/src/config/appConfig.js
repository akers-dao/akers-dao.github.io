/**
 * Config method loading routing
 */
const config = (function config() {
  const _config = ($routeProvider, $compileProvider) => {
    
    $compileProvider.debugInfoEnabled(false);
      
    $routeProvider
      .when('/', {
        templateUrl: './app/partial/app.html',
        controller: 'MainController',
        controllerAs: 'vm',
      })
      .otherwise('/');
  };
  
  _config.$inject = ['$routeProvider','$compileProvider'];

  return _config;

})();

export default config;
