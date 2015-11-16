'use strict';

angular.module('findabarApp')
  .controller('MainCtrl', function ($scope, $http, $window, Auth) {
    $scope.bars = [];
    $scope.attend = [];
    $scope.searchTerm = '';

    var isLoggedIn = function() {
      if (Auth.isLoggedIn()) {
        return true;
      } else {
        $window.location.href = '/auth/twitter';
      }
    };

    var previousSearch = sessionStorage.getItem('search');
    if (previousSearch) {
      console.log(previousSearch);
       $http.get('/api/search/' + previousSearch).success(function(bars) {
        $scope.bars = bars.businesses;
      });
    }

    $scope.search = function() {
      $http.get('/api/search/' + $scope.searchTerm).success(function(bars) {
        $scope.bars = bars.businesses;
        console.log(bars);
      });
    };

    $scope.attending = function(id) {
      if (isLoggedIn()) {
        if ($scope.attend.indexOf(id) < 0) {
          $scope.attend.push(id);
        } else {
          $scope.attend.splice($scope.attend.indexOf(id), 1);
        }
      } else {
        sessionStorage.setItem('search', $scope.searchTerm);
        console.log(sessionStorage.getItem('search'));
        $window.location.href = '/auth/twitter';
      }
    };



  });
