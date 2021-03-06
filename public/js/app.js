'use strict';

var srPlanner = angular.module('srPlanner', ['ngResource', 'ngRoute']);

srPlanner.config(function ($routeProvider, $locationProvider) {
    $locationProvider.html5Mode(true);
    $routeProvider
        .when('/', { templateUrl: '/partials/main', controller: 'MainCtrl' })
        .when('/orders', { templateUrl: '/partials/order-list', controller: 'OrderListCtrl' })
        .when('/products', { templateUrl: '/partials/product-list', controller: 'ProductListCtrl' })
        .when('/order/new', { templateUrl: '/partials/order-edit', controller: 'OrderEditCtrl' })
        .when('/order/:id', { templateUrl: '/partials/order-edit', controller: 'OrderEditCtrl' })
        .when('/order/:id/plan', { templateUrl: '/partials/order-plan', controller: 'OrderPlanCtrl' });
    $routeProvider.otherwise({ redirectTo: '/' });
});
