app.controller("KitchenController", function ($scope, $http, $mdDialog, $cookieStore, $filter, $rootScope, $interval, commonService, singleObjService, UI_KITCHEN) {
	$scope.user = $cookieStore.get("user");
	$scope.store = $cookieStore.get("store");
	
	$rootScope.pageTitle = "PENDING ORDERS";
	
	$scope.orderedItems = [];
	
	$scope.UI_KITCHEN = UI_KITCHEN;
	
	$scope.$watch('$viewContentLoaded', function(){
		$scope.getPendingOrders();
	});
	
	$scope.category = $cookieStore.get("category");
	
	$scope.getPendingOrders = function(){
		//$rootScope.loading = true;
		/*if(($scope.category == "") || ($scope.category == null)){
			$scope.categoryId = "0";
		}
		else{
			$scope.categoryId = $scope.category.subcategoryId;
		}*/
		$http.get($rootScope.baseUrl+'action=getPendingOrders&store_id='+$scope.store.storeId+'&category_id='+$scope.category.categoryId).success(function(data) {
			 $scope.pendingOrders = data.result.pendingOrders;
			 //$rootScope.loading = false;
		});
	}
	
	var theInterval = $interval(function(){
		 $scope.getPendingOrders();
		 //$scope.checkValue();
		 console.log("check:"+$scope.check);
	   }.bind(this), 3000);    

	    $scope.$on('$destroy', function () {
	        $interval.cancel(theInterval)
	});
	    
	$scope.check = 0;
	
	$scope.checkValue = function(){
		for(var i=0;i<$scope.pendingOrders.length;i++){
			var order = $scope.pendingOrders[i];
			for(var j=0;j<order.orderedItems.length;j++){
				if(order.orderedItems[j].status.id == 1){
					$scope.check = 1;
					break;
				}
			}
		}
	}
	
	$scope.preparedItem = function(orderItem){
		$scope.orderedItems = [];
		orderItem.status.id=2;
		$scope.orderedItems.push(orderItem);
		$scope.updateOrderedItems();
	}
	
	$scope.openConfirmationDialog = function(ev,orderItem,orderId) {
		orderItem.orderId = orderId;
    	singleObjService.setObj(orderItem);
        $mdDialog.show({
          controller: ConfirmationController,
          templateUrl: 'templates/dialogs/kitchen_confirm_item.html',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose:true,
          fullscreen: $scope.customFullscreen
        })
        .then(function(answer) {
        	$scope.preparedItem(orderItem);
        }, function() {
        });
    };
      
    function ConfirmationController($scope, $mdDialog, singleObjService, UI_KITCHEN) {
		$scope.ITEM_DET = UI_KITCHEN.item_det;
		$scope.orderItem = singleObjService.getObj();
	    $scope.hide = function() {
	      $mdDialog.hide();
	    };

	    $scope.cancel = function() {
	      $mdDialog.cancel();
	    };

	    $scope.answer = function() {
	      $mdDialog.hide();
	    };
    }
	
	$scope.updateOrderedItems = function(){    
    	$scope.itemOrder = {};
    	$scope.itemOrder.orderedItems = $scope.orderedItems;
    	$scope.itemOrder.orderId = $scope.orderedItems[0].orderId;
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