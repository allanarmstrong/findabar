'use strict';

angular.module('findabarApp')
  .controller('MainCtrl', function ($scope, $http, $window, Auth) {
    $scope.bars = [];
    $scope.attend = [];
    $scope.searchTerm = '';
    var currBar = this;
    if (Auth.isLoggedIn()) {
      var currentUser = Auth.getCurrentUser()._id;
    }

    var previousSearch = sessionStorage.getItem('search');
    if (previousSearch) {
      $scope.searchTerm = previousSearch;
       $http.get('/api/search/' + previousSearch).success(function(bars) {
        $scope.bars = bars;
        sessionStorage.removeItem('search');
      });
    }

    $scope.search = function() {
      $http.get('/api/search/' + $scope.searchTerm).success(function(bars) {
        console.log(bars);
        _.forEach(bars, function(bar) {
          var idx = _.findIndex(bars, {id: bar.id});
          $http.get('/api/venues/' + bar.id).success(function(attendees) {
            bars[idx].attendance = attendees;
            if(currentUser && _.findIndex(attendees, currentUser) >= 0) {
              $scope.attend.push(bar.id);
            }
          });
        });
        $scope.bars = bars;
      });
    };

    $scope.attending = function(id) {
        var idx = _.findIndex($scope.bars, {id: id});
        if ($scope.bars[idx].attendance) {
            if($scope.bars[idx].attendance.indexOf(currentUser) === -1) {

              $scope.attend.push(id);
              $scope.bars[idx].attendance.push(currentUser);

            } else {
             
            $scope.attend.splice($scope.attend.indexOf(id), 1);
             $scope.bars[idx].attendance.splice($scope.bars[idx].attendance.indexOf(currentUser),1);
            }

            $http.put('/api/venues/' + id, {attendance: $scope.bars[idx].attendance});

          } else {
            $scope.bars[idx].attendance = [currentUser];
            $scope.attend.push(id);
            var newBar = {
              id: $scope.bars[idx].id,
              attendance: $scope.bars[idx].attendance
            };
            $http.post('/api/venues', newBar);
          }
      };

      $scope.update = function(id) {
        currBar.id = id;
        if (Auth.isLoggedIn()) {
          currentUser = Auth.getCurrentUser()._id;
          $scope.attending(currBar.id);
        } else {
          sessionStorage.setItem('search', $scope.searchTerm);
          $window.location.href = '/auth/twitter';
        }
      };



  });
