'use strict';

angular.module('findabarApp')
  .controller('MainCtrl', function ($scope, $http, $window, Auth) {
    $scope.bars = [];
    $scope.attend = [];
    $scope.searchTerm = '';
    var currBar = this;
    var currentUser = Auth.getCurrentUser()._id;
    console.log(currentUser);

    var previousSearch = sessionStorage.getItem('search');
    if (previousSearch) {
      $scope.searchTerm = previousSearch;
       $http.get('/api/search/' + previousSearch).success(function(bars) {
        console.log(bars);
        $scope.bars = bars;
      });
    }

    $scope.search = function() {
      $http.get('/api/search/' + $scope.searchTerm).success(function(bars) {
        console.log(bars);
        $scope.bars = bars;
      });
    };

    $scope.attending = function(id) {
        var idx = _.findIndex($scope.bars, {id: id});
        if ($scope.bars[idx].hasOwnProperty('attendance')) {
            if($scope.bars[idx].attendance.indexOf(currentUser) === -1) {

              $scope.attend.push(id);
              $scope.bars[idx].attendance.push(currentUser);
              console.log($scope.attend);
              console.log($scope.bars[idx].attendance);

            } else {
             
            $scope.attend.splice($scope.attend.indexOf(id), 1);
             $scope.bars[idx].attendance.splice($scope.bars[idx].attendance.indexOf(currentUser),1);
               console.log($scope.attend);
              console.log($scope.bars[idx].attendance);
            }

            $http.put('/api/venues/' + id, {attendance: $scope.bars[idx].attendance});

          } else {
            $scope.bars[idx].attendance = [currentUser];
            $scope.attend.push(id);
            var newBar = {
              name: $scope.bars[idx].id,
              attendance: $scope.bars[idx].attendance
            };
            $http.post('/api/venues', newBar);
          }
      };

      $scope.update = function(id) {
        currBar.id = id;
        if (Auth.isLoggedIn()) {
          $scope.attending(currBar.id);
        } else {
          sessionStorage.setItem('search', $scope.searchTerm);
          $window.location.href = '/auth/twitter';
        }
      };



  });
