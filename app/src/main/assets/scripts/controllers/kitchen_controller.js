app.controller("KitchenController", function ($scope, $http, $mdDialog, $cookieStore, $filter, $rootScope, commonService, singleObjService, UI_PENDING_ORDERS) {
	$scope.user = $cookieStore.get("user");
	$scope.store = $cookieStore.get("store");
	
	$rootScope.pageTitle = "PENDING ORDERS";
	
	$scope.orderedItems = [];
	
	$scope.UI_PENDING_ORDERS = UI_PENDING_ORDERS;
	
	$scope.$watch('$viewContentLoaded', function(){
		$scope.getPendingOrders();
	});
	
	$scope.getPendingOrders = function(){
		$rootScope.loading = true;
		/*if(($scope.category == "") || ($scope.category == null)){
			$scope.categoryId = "0";
		}
		else{
			$scope.categoryId = $scope.category.subcategoryId;
		}*/
		$http.get($rootScope.baseUrl+'action=getPendingOrders&store_id='+$scope.store.storeId).success(function(data) {
			 $scope.pendingOrders = data.result.pendingOrders;
		      $scope.categories = data.result.subcategories;
			  $rootScope.loading = false;
		});
	}
	
	$scope.preparedItem = function(orderItem){
		orderItem.status.id=2;
		$scope.orderedItems.push(orderItem);
	}
	
	$scope.updateOrderedItems = function(){    
    	$scope.itemOrder = {};
    	$scope.itemOrder.orderedItems = $scope.orderedItems;
    	  $http({
              url : $rootScope.baseUrl+'action=updateOrderedItems',
              method : "POST",
              data : {data: $scope.itemOrder},
              headers: {
                  'Content-Type': 'application/json'
              }
          }).then(function(response) {
        	  if(response.data.status == "success"){
	        	  commonService.ajsToast(response.data.message);
		    	  $mdDialog.hide();
        	  }
          }, function(response) {
          });
    }
});