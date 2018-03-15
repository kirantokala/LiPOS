app.controller("ProfileController",function ($scope, $http, $filter, $cookieStore, $location, $rootScope, commonService, UI_PROFILE) {
	$scope.user = $cookieStore.get("user");
	$rootScope.pageTitle = "EDIT PROFILE";
	$scope.CHANGE_PASSWORD = UI_PROFILE.change_password;
	
	$scope.clearPasswordInfo = function(){
		$scope.oldPassword = "";
		$scope.newPassword = "";
		$scope.confirmPassword = "";
	}
	
	$scope.changePassword = function(){
		if(($scope.oldPassword == null) || ($scope.oldPassword == "")){
			$scope.resMsg = "Plz enter old password";
			return;
		}	
		if(($scope.newPassword == null) || ($scope.newPassword == "")){
			$scope.resMsg = "Plz enter new password";
			return;
		}	
		if(($scope.confirmPassword == null) || ($scope.confirmPassword == "")){
			$scope.resMsg = "Plz enter confirm password";
			return;
		}	
		if(($scope.confirmPassword != $scope.newPassword)){
			$scope.resMsg = "Password and confirm not matching";
			return;
		}	
  	  	$http({
            url : $rootScope.baseUrl+'action=changePassword',
            method : "POST",
            data : {user_id: $scope.user.userId, password:$scope.newPassword},
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(function(response) {
        	//$scope.resMsg = response.data;
        	commonService.ajsToast(response.data.result);
            $scope.clearPasswordInfo();
        }, function(response) {
        });
	}
});