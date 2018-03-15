app.factory("addUserService",userAddService);

app.controller("ManageUserController", function ($scope, $http, $mdDialog, $cookieStore, $filter, $rootScope, singleObjService, commonService, addUserService, UI_MANAGE_USER) {
	$scope.user = $cookieStore.get("user");
	$scope.store = $cookieStore.get("store");
	
	$rootScope.pageTitle = "Manage User";
	
	$scope.UI_MANAGE_USER = UI_MANAGE_USER;
	
	$scope.query = "";
	$scope.query1 = "";
	
	$http.get($rootScope.baseUrl+'action=getUsers&store_id='+$scope.store.storeId+"&role_id=0").success(function(data) {
		$scope.users = data.result;
	});

	$scope.openAddUserDialog = function(ev) {		
		$http.get($rootScope.baseUrl+'action=getUserRoles&store_id='+$scope.store.storeId).success(function(data) {
			addUserService.setRoles(data.result.roles);
			addUserService.setUsers(data.result.users);
			
	        $mdDialog.show({
	          controller: AddController,
	          templateUrl: 'templates/dialogs/user_add.html',
	          parent: angular.element(document.body),
	          targetEvent: ev,
	          clickOutsideToClose:true,
	          fullscreen: $scope.customFullscreen
	        })
	        
	        .then(function(answer) {
	        	if((singleObjService.getObj()!=null) && (singleObjService.getObj()!=undefined))
	        		$scope.users.push(singleObjService.getObj());
	        }, function() {
	        });
		});
    };
    
    function AddController($scope,$filter,$mdDialog,$cookieStore,addUserService,singleObjService, UI_MANAGE_USER) { 
    	$scope.USER_ADD = UI_MANAGE_USER.user_add;
    	$scope.userType="new"
    	$scope.roles = addUserService.getRoles();
    	$scope.users = addUserService.getUsers();
    	var user = {};
    	
  	    $scope.hide = function() {
  	      $mdDialog.hide();
  	    };

  	    $scope.cancel = function() {
  	      $mdDialog.cancel();
  	    };
  	    
  	    $scope.addUser = function(user){
  			  $http({
  		        url : $rootScope.baseUrl+'action=addUser',
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
  	    
  	    $scope.answer = function() {
  	    	if($scope.userType == "new"){
	  	    	if(($scope.userName == null) || ($scope.userName == "")){
	  	    		$scope.resMsg = "Plz enter User Name";
	  	    		return;
	  	    	}
	  	    	else if(($scope.role == null) || ($scope.role == "")){
	  	    		$scope.resMsg = "Plz choose role";
	  	    		return;
	  	    	}
	  	    	else if(($scope.phone == null) || ($scope.phone == "")){
	  	    		$scope.resMsg = "Plz enter phone no.";
	  	    		return;
	  	    	}
	  	    	user.userName = $scope.userName;
	  	    	user.role = $scope.role;
	  	    	user.phone = $scope.phone;
	  	    	user.location = $scope.location;
	  	    	user.address = $scope.address;
  	    	}
  	    	else{
  	    		user = $scope.user1;
  	    	}
  	    	$scope.addUser(user);
  	    };
  	    
  	    $scope.cancel = function(){
  	    	$mdDialog.hide();
  	    }
    }
});