'use strict';

angular.module('findabarApp')
  .controller('MainCtrl', function ($scope, $http) {
    $scope.bars = [];
    $scope.searchTerm = '';
    $scope.attending = [];
    var attending = [];

    $scope.search = function() {
      $http.get('/api/search/' + $scope.searchTerm).success(function(bars) {
        $scope.bars = bars.businesses;
        console.log(bars);
      });
    };

    $scope.attending = function(barID) {
      console.log('Attending ', barID);
      attending.push(barID);
      $scope.attending = attending;
    };

  });
