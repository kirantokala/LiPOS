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
    	if($scope.user.role.roleId == 1){
    		$location.path('/sales');
    	}
    	else if($scope.user.role.roleId == 5){
    		$location.path('/dashboard');
    	}
    	else if($scope.user.role.roleId == 3){
    		$location.path('/kitchen');
    	}
    	else{
        	$location.path('/menu');
    	}
    }
	
	$scope.$watch('$viewContentLoaded', function(){
		$scope.checkStore();
	});
});