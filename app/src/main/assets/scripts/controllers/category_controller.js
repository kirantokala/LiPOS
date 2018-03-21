app.controller('CategoryController', function ($scope, $http, $rootScope, $location, commonService, $cookieStore) {
	

	$http.get($rootScope.baseUrl+'action=getItemCategories&store_id='+$scope.store.storeId).success(function(data) {
		 $scope.categories = data.result;
		 if($scope.categories.length == 1){
			 $scope.selectCategory($scope.categories[0]);
		 }
	});

	
   $scope.selectCategory = function(category){
    	$cookieStore.put("category", category);
    	
    	$rootScope.category = $cookieStore.get("category");
    	
    	$location.path('/kitchen');
    }
});