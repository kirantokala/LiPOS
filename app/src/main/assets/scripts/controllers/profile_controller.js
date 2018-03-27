app.controller("ProfileController",function ($scope, $http, $filter,$mdDialog, $cookieStore, $location, $rootScope, commonService, UI_PROFILE) {
	$scope.user = $cookieStore.get("user");
	$rootScope.pageTitle = "EDIT PROFILE";
	$scope.UI_PROFILE = UI_PROFILE;
	
	$scope.clearPasswordInfo = function(){
		$scope.oldPassword = "";
		$scope.newPassword = "";
		$scope.confirmPassword = "";
	}
	
	$scope.getUser = function(){
		$http.get($rootScope.baseUrl+'action=getUser&user_id='+$scope.user.userId).success(function(data) {
			$scope.profile = data.result;
		});
	}
	
	$scope.$watch('$viewContentLoaded', function(){
		$scope.getUser();
	});
	
	$scope.updateProfile = function(){
		if($rootScope.isStrNull($scope.profile.userName)){
			$scope.resMsg = "Please enter userName";
			return;
		}
		if($rootScope.isStrNull($scope.profile.phone)){
			$scope.resMsg = "Please enter mobile number";
			return;
		}
		$http({
            url : $rootScope.baseUrl+'action=updateProfile',
            method : "POST",
            data : {data: $scope.profile},
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(function(response) {
        	//$scope.resMsg = response.data;
        	commonService.ajsToast(response.data.message);
            $scope.clearPasswordInfo();
        }, function(response) {
        });
	}
	
	$scope.openChangePassDialog = function(ev) {
        $mdDialog.show({
          controller: ChangePassController,
          templateUrl: 'templates/dialogs/change_password.html',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose:true,
          fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
        })
        
        .then(function(answer) {
        }, function() {
        });
    };
    
    function ChangePassController($scope, $filter,$cookieStore, $mdDialog, UI_PROFILE) {
    	$scope.CHANGE_PASSWORD = UI_PROFILE.change_password;
    	
  	    $scope.hide = function() {
  	      $mdDialog.hide();
  	    };

  	    $scope.cancel = function() {
  	      $mdDialog.cancel();
  	    };
  	    
  		$scope.changePassword = function(){
  	  	  	$http({
  	            url : $rootScope.baseUrl+'action=changePassword',
  	            method : "POST",
  	            data : {user_id: $cookieStore.get("user").userId, password:$scope.newPassword},
  	            headers: {
  	                'Content-Type': 'application/json'
  	            }
  	        }).then(function(response) {
  	        	commonService.ajsToast(response.data.message);
  	        	 $mdDialog.hide();
  	        }, function(response) {
  	        });
  		}
  	    
  	    $scope.answer = function() {
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
  			
  	    	$scope.changePassword();
  	    };
  	    
  	    $scope.cancel = function(){
  	    	$mdDialog.hide();
  	    }
    }

	
	
});