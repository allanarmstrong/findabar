'use strict';

angular.module('findabarApp')
  .controller('MainCtrl', function ($scope, $http) {
    $scope.bars = [];

    $http.get('/api/search/Melbourne').success(function(bars) {
      console.log(bars);
      $scope.bars = bars.businesses;
    });
  });
