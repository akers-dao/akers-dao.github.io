/**
 * Bootstrap angular
 */

import angular from 'angular';
import ngMaterial from 'angular-material';
import ngMessages from 'angular-messages';
import ngAria from 'angular-aria';
import ngAnimate from 'angular-animate';
import ngRoute from 'angular-route';
import {} from 'babel-polyfill';
import appConfig from './config/appConfig.js';
import MainController from './controllers/mainController.js';
import WeatherService from './services/weatherService.js';
import IconService from './services/IconService.js';
import LocalStorage from './services/LocalStorage.js';
import weatherCardDirective from './directives/weatherCardDirective.js';
import listItemDirective from './directives/listItemDirective.js';

const WeatherApp = angular.module('WeatherApp', ['ngMessages', 'ngMaterial', 'ngAnimate', 'ngAria', 'ngRoute'])
	.config(appConfig)
	.controller('MainController', MainController)
	.service('WeatherService', WeatherService)
	.service('IconService', IconService)
	.service('LocalStorage', LocalStorage)
	.directive('weatherCard', weatherCardDirective.weatherCardFactory)
	.directive('listItem', listItemDirective.listItemFactory);
