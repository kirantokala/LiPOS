app.factory('dialogService', function($mdToast,$mdDialog) {
   
	function openDialog(ev,controller,dialogPage) {
    	$http.get($rootScope.baseUrl+'action=getAddItemInfo&store_id='+$scope.store.storeId).success(function(data) {
    		
    		addItemService.setDetails(data.result);
    		
            $mdDialog.show({
              controller: controller,
              templateUrl: 'dialogs/'+dialogPage,
              parent: angular.element(document.body),
              targetEvent: ev,
              clickOutsideToClose:true,
              fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
            })
            
            .then(function(answer) {
              $scope.addItem();
            }, function() {
            });
            
    	});
    }
	
	function AddController($scope,$filter,$mdDialog,addItemService) {
		$scope.details = addItemService.getDetails();
    	
    	var item = {};
    	
  	    $scope.hide = function() {
  	      $mdDialog.hide();
  	    };

  	    $scope.cancel = function() {
  	      $mdDialog.cancel();
  	    };
  	    
  	    $scope.answer = function() {
  	    	
  	    	if(($scope.itemName == null) || ($scope.itemName == "")){
  	    		$scope.resMsg = "Plz enter Item Name";
  	    		return;
  	    	}
  	    	else if(($scope.itemId == null) || ($scope.itemId == "")){
  	    		$scope.resMsg = "Plz enter Item Id";
  	    		return;
  	    	}
  	    	else if(($scope.itemCategory == null) || ($scope.itemCategory == "")){
  	    		$scope.resMsg = "Plz choose Item Category";
  	    		return;
  	    	}
  	    	else if(($scope.price == null) || ($scope.price == "")){
  	    		$scope.resMsg = "Plz enter price";
  	    		return;
  	    	}
  	    	
  	    	item.itemStoreId = $scope.itemId;
  	    	item.itemName = $scope.itemName;
  	    	item.itemDescription = $scope.itemName;
  	    	item.subcategory = $scope.itemCategory;
  	    	item.materialType = $scope.materialType;
  	    	item.price = $scope.price;
  	    	addItemService.setItem(item);
  	    	$mdDialog.hide();
  	    };
  	    
  	    $scope.cancel = function(){
  	    	$mdDialog.hide();
  	    }
    }
	
	
    return {
    	
    };
});