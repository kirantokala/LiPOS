app.factory('itemService', itemService);

app.factory("addItemService",itemAddService);

app.controller("ManageMenuController", function ($scope, $http, $mdDialog, $rootScope,$cookieStore, itemService, addItemService, commonService, singleObjService, UI_MENU) {
	$scope.user = $cookieStore.get("user");
	$scope.store = $cookieStore.get("store");
	
	$rootScope.pageTitle = "MANAGE MENU";
	
	$scope.subcategory1 = {};
	$scope.subcategory1.subcategoryName = "MENU";
	
	$scope.UI_MENU = UI_MENU;
	
	itemService.setStoreId($scope.store.storeId);
	$rootScope.loading = true;
	$http.get($rootScope.baseUrl+'action=getItemHomeData&store_id='+$scope.store.storeId).success(function(data) {
		$scope.items = data.result.items;
		$scope.paymentTypes = data.result.paymentTypes;
		$scope.categories = data.result.subcategories;
		itemService.addPaymentTypes($scope.paymentTypes);
		$rootScope.loading = false;
	});
	
	$scope.sort = function(keyname){
        $scope.sortKey = keyname;
        $scope.reverse = !$scope.reverse;
    }
	
    $scope.query = "";
    
    $scope.search = function (row) {
        var query = $scope.query.toLowerCase();
        var subName = $scope.subcategory1.subcategoryName;
        var res1 = subName=='MENU'?'':subName;
        
        var result;
        
        if(query != ""){
        	result = (row.itemStoreId.toString().indexOf(query || '') !== -1 || row.itemName.toLowerCase().indexOf(query || '') !== -1);
        }
        else{
        	result = (row.subcategory.subcategoryName.indexOf(res1)!==-1);
        }
        return result;
    };
    
    $scope.addString = function(value){
    	if(value!="bs"){
    		$scope.query = $scope.query + value;
    	}
    	else{
    		$scope.query = $scope.query.substring(0,$scope.query.length-1);
    	}
    }
    
    $scope.openAddUpdateItemDialog = function(ev, item, add) {
    	$http.get($rootScope.baseUrl+'action=getAddItemInfo&store_id='+$scope.store.storeId).success(function(data) {
    		addItemService.setDetails(data.result); 
    		if(add == 1){
    			singleObjService.setObj(item);
    		}
    		else{
    			var item1 = {};
    			item1.itemId = 0;
    			singleObjService.setObj(item1);
    		}
            $mdDialog.show({
              controller: AddUpdateController,
              templateUrl: 'templates/dialogs/item_edit.html',
              parent: angular.element(document.body),
              targetEvent: ev,
              clickOutsideToClose:true,
              fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
            })
            
            .then(function(answer) {
            	if(add == 0){
	            	if((addItemService.getItem()!=null) && (addItemService.getItem()!=undefined))
	            		$scope.items.push(addItemService.getItem());
            	}
            }, function() {
            });
    	});
    };
    
    function AddUpdateController($scope,$filter,$mdDialog,addItemService,itemService,commonService,singleObjService, UI_MENU) {
		$scope.details = addItemService.getDetails();
		
		$scope.item = singleObjService.getObj();
		
		$scope.ITEM_ADD = UI_MENU.item_add;
    	
  	    $scope.hide = function() {
  	      $mdDialog.hide();
  	    };

  	    $scope.cancel = function() {
  	      $mdDialog.cancel();
  	    };
  	    
  	    $scope.addItem = function(item){
  			  $http({
  		        url : $rootScope.baseUrl+'action=addOrUpdateItem&store_id='+itemService.getStoreId(),
  		        method : "POST",
  		        data : {data: item},
  		        headers: {
  		            'Content-Type': 'application/json'
  		        }
  		    }).then(function(response) {
  		    	if(response.data.status=="success"){
  			    	commonService.ajsToast(response.data.message);
  			    	item = response.data.result;
  		  	    	addItemService.setItem(item);
  			    	//$scope.items.push(item);
  		  	    	$mdDialog.hide();
  		    	}
  		    	else{
  			    	$scope.resMsg = response.data.message;
  		    	}
  		    }, function(response) {
  		    });
  		};
  	    
  	    $scope.answer = function() {
  	    	
  	    	if(($scope.item.itemName == null) || ($scope.item.itemName == "")){
  	    		$scope.resMsg = "Plz enter Item Name";
  	    		return;
  	    	}
  	    	else if(($scope.item.itemStoreId == null) || ($scope.item.itemStoreId == "")){
  	    		$scope.resMsg = "Plz enter Item Id";
  	    		return;
  	    	}
  	    	else if(($scope.item.subcategory == null) || ($scope.item.subcategory == "")){
  	    		$scope.resMsg = "Plz choose Item Category";
  	    		return;
  	    	}
  	    	else if(($scope.item.price == null) || ($scope.item.price == "")){
  	    		$scope.resMsg = "Plz enter price";
  	    		return;
  	    	}
  	    	
  	    	$scope.addItem($scope.item);
  	    };
  	    
  	    $scope.cancel = function(){
  	    	$mdDialog.hide();
  	    }
    }
});