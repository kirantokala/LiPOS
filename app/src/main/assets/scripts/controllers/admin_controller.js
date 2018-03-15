app.controller("AdminController", function ($scope, $http, $mdDialog, $cookieStore, $filter, $rootScope, commonService, singleObjService, UI_ADMIN_PANEL) {
	$scope.user = $cookieStore.get("user");
	$scope.store = $cookieStore.get("store");
	
	$rootScope.pageTitle = "Admin Panel";
	
	$scope.UI_ADMIN_PANEL = UI_ADMIN_PANEL;
	
	$scope.query = "";
	$scope.query1 = "";
	
	$http.get($rootScope.baseUrl+'action=getStores&user_id=0').success(function(data) {
		$scope.stores = data.result;
	});
	
	$scope.openAddStoreDialog = function(ev) {
        $mdDialog.show({
          controller: AddController,
          templateUrl: 'templates/dialogs/store_add.html',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose:true,
          fullscreen: $scope.customFullscreen
        })
        
        .then(function(answer) {
        	if((singleObjService.getObj()!=null) && (singleObjService.getObj()!=undefined))
        		$scope.stores.push(singleObjService.getObj());
        }, function() {
        });
    };
    
    function AddController($scope,$filter,$mdDialog, UI_ADMIN_PANEL) {    	
    	$scope.STORE_ADD = UI_ADMIN_PANEL.store_add;
    	var store = {};
    	
  	    $scope.hide = function() {
  	      $mdDialog.hide();
  	    };

  	    $scope.cancel = function() {
  	      $mdDialog.cancel();
  	    };
  	    
  	    $scope.addStore = function(store){
  			  $http({
  		        url : $rootScope.baseUrl+'action=addStore',
  		        method : "POST",
  		        data : {data: store},
  		        headers: {
  		            'Content-Type': 'application/json'
  		        }
  		    }).then(function(response) {
  		    	
  		    	if(response.data.status == "success"){
  	  		    	commonService.ajsToast(response.data.message);
  	  		    	store = response.data.result;
  	  		    	singleObjService.setObj(store);
  	    	    	$mdDialog.hide();
  		    	}
  		    	else{
  	  		    	$scope.resMsg = response.data.message;
  		    	}
  		    }, function(response) {
  		    });
  		};
  	    
  	    $scope.answer = function() {
  	    	if(($scope.storeId == null) || ($scope.storeId == "")){
  	    		$scope.resMsg = "Plz choose Store Id";
  	    		return;
  	    	}
  	    	else if(($scope.storeName == null) || ($scope.storeName == "")){
  	    		$scope.resMsg = "Plz enter Store Name";
  	    		return;
  	    	}
  	    	else if(($scope.location == null) || ($scope.location == "")){
  	    		$scope.resMsg = "Plz choose location";
  	    		return;
  	    	}
  	    	store.storeName = $scope.storeName;
  	    	store.storeId = $scope.storeId;
  	    	store.location = $scope.location;
  	    	$scope.addStore(store);
  	    };
  	    
  	    $scope.cancel = function(){
  	    	$mdDialog.hide();
  	    }
    }
});