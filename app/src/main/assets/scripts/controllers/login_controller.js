app.controller('LoginController', function ($scope, $http, $rootScope, $location, commonService, $cookieStore, LoginService, UI_LOGIN) {
	$scope.UI_LOGIN = UI_LOGIN;
    $scope.login = function () {
    	var loginUrl = $rootScope.baseUrl+'action=login&userName='+$scope.userName+"&password="+$scope.password;
        $http.get(loginUrl).success(function(response) {
        	if(response.status == "success") {
        		var result = response.result;
        		$cookieStore.put("user", result);
            	$rootScope.user = $cookieStore.get("user");
            	
            	if(result.role.roleId == 6){
            		$location.path('/admin');
            	}
            	else if(result.role.roleId == 9){
            		$location.path('/vendor');
            	}
            	else{
	                $location.path('/store');
            	}
            } else {
                $scope.error = response.message;
            }
		});
    };
});