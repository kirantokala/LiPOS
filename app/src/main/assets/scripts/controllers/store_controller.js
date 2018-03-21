app.controller('StoreController', function ($scope, $rootScope, $location, commonService, $cookieStore) {
    $scope.user = $cookieStore.get("user");
    
    $scope.checkStore = function(){
    	if($scope.user.storeList.length == 1){
    		$scope.selectStore($scope.user.storeList[0]);
    	}
    }
    
	$scope.selectStore = function(store){
    	$cookieStore.put("store", store);

    	$rootScope.store = $cookieStore.get("store");
    	if($scope.user.role.roleId == $rootScope.CST_COM.roles.owner){
    		$location.path('/sales');
    	}
    	else if($scope.user.role.roleId == $rootScope.CST_COM.roles.treasurer){
    		$location.path('/dashboard');
    	}
    	else if($scope.user.role.roleId == $rootScope.CST_COM.roles.kitchen){
    		$location.path('/category');
    	}
    	else{
        	$location.path('/menu');
    	}
    }
	
	$scope.$watch('$viewContentLoaded', function(){
		$scope.checkStore();
	});
});