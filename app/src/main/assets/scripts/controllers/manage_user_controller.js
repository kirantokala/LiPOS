app.factory("addUserService",userAddService);

app.controller("ManageUserController", function ($scope, $http, $mdDialog, $cookieStore, $filter, $rootScope, singleObjService, commonService, addUserService, UI_MANAGE_USER) {
	$scope.user = $cookieStore.get("user");
	$scope.store = $cookieStore.get("store");
	
	$rootScope.pageTitle = "Manage User";
	
	$scope.UI_MANAGE_USER = UI_MANAGE_USER;
	
	$scope.query = "";
	$scope.query1 = "";
	
	$http.get($rootScope.baseUrl+'action=getUsers&store_id='+$scope.store.storeId).success(function(data) {
		$scope.users = data.result;
	});

	$scope.openAddUpdateUserDialog = function(ev, user, index, add) {		
		$http.get($rootScope.baseUrl+'action=getUserRoles&store_id='+$scope.store.storeId).success(function(data) {
			addUserService.setRoles(data.result.roles);
			addUserService.setUsers(data.result.users);
			
			if(add == 1){
				singleObjService.setObj(angular.copy(user));
			}
			else{
				var user1 = {};
				user1.userId = 0;
				singleObjService.setObj(user1);
			}
			
	        $mdDialog.show({
	          controller: AddUpdateController,
	          templateUrl: 'templates/dialogs/user_edit.html',
	          parent: angular.element(document.body),
	          targetEvent: ev,
	          clickOutsideToClose:true,
	          fullscreen: $scope.customFullscreen
	        })
	        
	        .then(function(answer) {	        	
	        	if(add == 0){
	        		if((singleObjService.getObj()!=null) && (singleObjService.getObj()!=undefined))
		        		$scope.users.push(singleObjService.getObj());
	        	}
	        	else{
	        		if((singleObjService.getObj()!=null) && (singleObjService.getObj()!=undefined))
	        			if(singleObjService.getObj().active == 0){
	        				$scope.users.splice(index, 1);
	        			}
	        			else{
	            			$scope.users[index] = singleObjService.getObj();
	        			}
	        		}
	        }, function() {
	        });
		});
    };
    
    function AddUpdateController($scope,$filter,$mdDialog,$cookieStore,addUserService,singleObjService, UI_MANAGE_USER) { 
    	$scope.USER_ADD = UI_MANAGE_USER.user_add;
    	$scope.userType="new"
    	$scope.roles = addUserService.getRoles();
    	$scope.users = addUserService.getUsers();
    	
    	$scope.user = singleObjService.getObj();
    	
    	var user = {};
    	
  	    $scope.hide = function() {
  	      $mdDialog.hide();
  	    };

  	    $scope.cancel = function() {
  	      $mdDialog.cancel();
  	    };
  	    
  	    $scope.addUser = function(user){
  			  $http({
  		        url : $rootScope.baseUrl+'action=addOrUpdateUser',
  		        method : "POST",
  		        data : {data: user, store_id:$cookieStore.get("store").storeId},
  		        headers: {
  		            'Content-Type': 'application/json'
  		        }
  		    }).then(function(response) {
  		    	
  		    	if(response.data.status == "success"){
  	  		    	commonService.ajsToast(response.data.message);
  	  		    	user = response.data.result;
  	  		    	singleObjService.setObj(user);
  	    	    	$mdDialog.hide();
  		    	}
  		    	else{
  	  		    	$scope.resMsg = response.data.message;
  		    	}
  		    }, function(response) {
  		    });
  		};
  		
  		$scope.deleteUser = function(){
			  $http({
		        url : $rootScope.baseUrl+'action=deleteUser&user_id='+$scope.user.userId+'&store_id='+$cookieStore.get("store").storeId,
		        method : "POST",
		        data : {data: $scope.user},
		        headers: {
		            'Content-Type': 'application/json'
		        }
		    }).then(function(response) {
		    	if(response.data.status=="success"){
			    	commonService.ajsToast(response.data.message);
			    	$scope.user.active=0;
			    	singleObjService.setObj($scope.user);
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
  	    	if($scope.userType == "new"){
	  	    	if(($scope.user.userName == null) || ($scope.user.userName == "")){
	  	    		$scope.resMsg = "Plz enter User Name";
	  	    		return;
	  	    	}
	  	    	else if(($scope.user.role == null) || ($scope.user.role == "")){
	  	    		$scope.resMsg = "Plz choose role";
	  	    		return;
	  	    	}
	  	    	else if(($scope.user.phone == null) || ($scope.user.phone == "")){
	  	    		$scope.resMsg = "Plz enter phone no.";
	  	    		return;
	  	    	}
  	    	}
  	    	else{
  	    		$scope.user = $scope.user1;
  	    	}
  	    	$scope.addUser($scope.user);
  	    };
  	    
  	    $scope.deleteI = function(){
	    	$scope.deleteUser();
	    }
  	    
  	    $scope.cancel = function(){
  	    	$mdDialog.hide();
  	    }
    }
});