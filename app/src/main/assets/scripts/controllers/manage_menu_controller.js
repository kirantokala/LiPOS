app.factory('itemService', itemService);

app.factory("addItemService",itemAddService);

app.controller("ManageMenuController", function ($scope, $http, $mdDialog, $rootScope, $cookieStore, itemService, addItemService, commonService, singleObjService, UI_MENU) {
	$scope.user = $cookieStore.get("user");
	$scope.store = $cookieStore.get("store");
	
	$rootScope.pageTitle = "MANAGE MENU";
	
	$scope.subcategory1 = {};
	$scope.subcategory1.subcategoryName = "MENU";
	
	$scope.UI_MENU = UI_MENU;
	
	itemService.setStoreId($scope.store.storeId);
	$rootScope.loading = true;
	$http.get($rootScope.baseUrl+'action=getItemHomeData1&store_id='+$scope.store.storeId).success(function(data) {
		$scope.items = data.result.items;
		$scope.subcategories = data.result.subcategories;
		$scope.categories = data.result.categories;
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
    
    $scope.openAddUpdateItemDialog = function(ev, item, index, add) {
		addItemService.setDetails($scope.subcategories);     	
    	if(add==1){
	    	$http.get($rootScope.baseUrl+'action=getItemMaterialData&item_id='+item.itemId).success(function(data) {
	    		item.materialList = data.result;
	    		singleObjService.setObj(angular.copy(item));
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
	    	        	else{
	    	        		if((addItemService.getItem()!=null) && (addItemService.getItem()!=undefined)){
	    	        			if(addItemService.getItem().active == 0){
	    	        				$scope.items.splice(index, 1);
	    	        			}
	    	        			else{
	    	            			$scope.items[index] = addItemService.getItem();
	    	        			}
	    	        		}
	    	        	}
	    	        }, function() {
	    	        });
	    	});
    	}
    	else{
    		var item1 = {};
			item1.itemId = 0;
			singleObjService.setObj(item1);
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
    	        	else{
    	        		if((addItemService.getItem()!=null) && (addItemService.getItem()!=undefined)){
    	        			if(addItemService.getItem().active == 0){
    	        				$scope.items.splice(index, 1);
    	        			}
    	        			else{
    	            			$scope.items[index] = addItemService.getItem();
    	        			}
    	        		}
    	        	}
    	        }, function() {
    	        });
    	}
        
    };
    
    $scope.openAddUpdateSubcategoryDialog = function(ev, subcategory, index, add) {
		addItemService.setDetails($scope.categories); 
		if(add == 1){
			singleObjService.setObj(angular.copy(subcategory));
		}
		else{
			var subcategory1 = {};
			subcategory1.subcategoryId = 0;
			singleObjService.setObj(subcategory1);
		}
        $mdDialog.show({
          controller: AddUpdateSubcategoryController,
          templateUrl: 'templates/dialogs/subcategory_edit.html',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose:true,
          fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
        })
        
        .then(function(answer) {
        	if(add == 0){
            	if((addItemService.getItem()!=null) && (addItemService.getItem()!=undefined))
            		$scope.subcategories.push(addItemService.getItem());
        	}
        	else{
        		if((addItemService.getItem()!=null) && (addItemService.getItem()!=undefined)){
        			if(addItemService.getItem().active == 0){
        				$scope.subcategories.splice(index, 1);
        			}
        			else{
            			$scope.subcategories[index] = addItemService.getItem();
        			}
        		}
        	}
        }, function() {
        });
    };
    
    function AddUpdateController($scope, $filter, $rootScope, $location, $mdDialog, addItemService, itemService, commonService, singleObjService, UI_MENU) {
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
  		  	    	if($scope.item.itemId==0){
		  		  	    $rootScope.item = item;  
		  	  	    	$location.path('/materialUpdate');
  		  	    	}
  			    	//$scope.items.push(item);
  		  	    	$mdDialog.hide();
  		    	}
  		    	else{
  			    	$scope.resMsg = response.data.message;
  		    	}
  		    }, function(response) {
  		    });
  		};
  		
  		$scope.updateMaterials = function(){
			$rootScope.item = $scope.item;  
  	    	$location.path('/materialUpdate');
  	    	$mdDialog.hide();
  		}
  		
  		$scope.deleteItem = function(){
			  $http({
		        url : $rootScope.baseUrl+'action=deleteItem&item_id='+$scope.item.itemId,
		        method : "POST",
		        data : {data: $scope.item},
		        headers: {
		            'Content-Type': 'application/json'
		        }
		    }).then(function(response) {
		    	if(response.data.status=="success"){
			    	commonService.ajsToast(response.data.message);
			    	$scope.item.active=0;
		  	    	addItemService.setItem($scope.item);
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
  	    
  	    $scope.deleteI = function(){
  	    	$scope.deleteItem();
  	    }
  	    
  	    $scope.cancel = function(){
  	    	$mdDialog.hide();
  	    }
    }
    
    function AddUpdateSubcategoryController($scope, $filter, $mdDialog, addItemService, itemService, commonService, singleObjService, UI_MENU) {
		$scope.details = addItemService.getDetails();
		
		$scope.subcategory = singleObjService.getObj();
		
		$scope.SUBCATEGORY_ADD = UI_MENU.subcategory_add;
    	
  	    $scope.hide = function() {
  	      $mdDialog.hide();
  	    };

  	    $scope.cancel = function() {
  	      $mdDialog.cancel();
  	    };
  	    
  	    $scope.addSubcategory = function(subcategory){
  			  $http({
  		        url : $rootScope.baseUrl+'action=addOrUpdateSubcategory&store_id='+itemService.getStoreId(),
  		        method : "POST",
  		        data : {data: subcategory},
  		        headers: {
  		            'Content-Type': 'application/json'
  		        }
  		    }).then(function(response) {
  		    	if(response.data.status=="success"){
  			    	commonService.ajsToast(response.data.message);
  			    	subcategory = response.data.result;
  		  	    	addItemService.setItem(subcategory);
  			    	//$scope.items.push(item);
  		  	    	$mdDialog.hide();
  		    	}
  		    	else{
  			    	$scope.resMsg = response.data.message;
  		    	}
  		    }, function(response) {
  		    });
  		};
  		
  		$scope.deleteSubcategory = function(){
			  $http({
		        url : $rootScope.baseUrl+'action=deleteSubcategory&subcategory_id='+$scope.subcategory.subcategoryId,
		        method : "POST",
		        data : {data: $scope.subcategory},
		        headers: {
		            'Content-Type': 'application/json'
		        }
		    }).then(function(response) {
		    	if(response.data.status=="success"){
			    	commonService.ajsToast(response.data.message);
			    	$scope.subcategory.active=0;
		  	    	addItemService.setItem($scope.subcategory);
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
  	    	
  	    	if(($scope.subcategory.subcategoryName == null) || ($scope.subcategory.subcategoryName == "")){
  	    		$scope.resMsg = "Plz enter Subcategory Name";
  	    		return;
  	    	}
  	    	else if(($scope.subcategory.category == null) || ($scope.subcategory.category == "")){
  	    		$scope.resMsg = "Plz choose Item Category";
  	    		return;
  	    	}
  	    	
  	    	$scope.addSubcategory($scope.subcategory);
  	    };
  	    
  	    $scope.deleteI = function(){
  	    	$scope.deleteSubcategory();
  	    }
  	    
  	    $scope.cancel = function(){
  	    	$mdDialog.hide();
  	    }
    }
});