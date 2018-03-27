app.factory('materialService', materialService);

app.factory("addMaterialService",matAddService);

app.controller("ManageMatController", function ($scope, $http, $mdDialog, $rootScope, $cookieStore, materialService, addMaterialService, commonService, singleObjService, UI_MATERIAL) {
	$scope.user = $cookieStore.get("user");
	$scope.store = $cookieStore.get("store");
	
	$rootScope.pageTitle = "MANAGE MATERIAL";
	
	$scope.subcategory1 = {};
	$scope.subcategory1.subcategoryName = "MENU";
	
	$scope.UI_MATERIAL = UI_MATERIAL;
	
	materialService.setStoreId($scope.store.storeId);
	$rootScope.loading = true;
	$scope.data = {};
	$http.get($rootScope.baseUrl+'action=getMatHomeData1&user_id='+$scope.user.userId+'&store_id='+$scope.store.storeId).success(function(data) {
		$scope.data = data.result;
		$scope.materials = data.result.materials;
		$scope.matcategories = data.result.materialCategories;
		$scope.materialTypes = data.result.materialType;
		$scope.quantityTypes = data.result.quantityTypes;
		$rootScope.loading = false;
	});
	
	$scope.sort = function(keyname){
        $scope.sortKey = keyname;
        $scope.reverse = !$scope.reverse;
    }
	
    $scope.query = "";
    
    $scope.openAddOrUpdateMaterialDialog = function(ev, mat, index, add) {
		addMaterialService.setDetails($scope.data);
		if(add == 1){
			singleObjService.setObj(angular.copy(mat));
		}
		else{
			var mat1 = {};
			mat1.materialId = 0;
			singleObjService.setObj(mat1);
		}
        $mdDialog.show({
          controller: AddController,
          templateUrl: 'templates/dialogs/material_edit.html',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose:true,
          fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
        })
        
        .then(function(answer) {
        	if(add == 0){
        		if((addMaterialService.getMaterial()!=null) && (addMaterialService.getMaterial()!=undefined))
            		$scope.materials.push(addMaterialService.getMaterial());
        	}
        	else{
        		if((addMaterialService.getMaterial()!=null) && (addMaterialService.getMaterial()!=undefined)){
        			if(addMaterialService.getMaterial().active == 0){
        				$scope.materials.splice(index, 1);
        			}
        			else{
            			$scope.materials[index] = addMaterialService.getMaterial();
        			}
        		}
        	}
        }, function() {
        });
    };
    
    function AddController($scope, $filter, $mdDialog, addMaterialService, commonService, singleObjService, UI_MATERIAL) {
    	$scope.MATERIAL_ADD = UI_MATERIAL.material_add;
    	
		$scope.details = addMaterialService.getDetails();
		
		$scope.material = singleObjService.getObj();
    	
    	var material = {};
    	
  	    $scope.hide = function() {
  	      $mdDialog.hide();
  	    };

  	    $scope.cancel = function() {
  	      $mdDialog.cancel();
  	    };
  	    
  	    $scope.addMaterial = function(material){
  			$http({
  		        url : $rootScope.baseUrl+'action=addOrUpdateMaterial',
  		        method : "POST",
  		        data : {data: material},
  		        headers: {
  		            'Content-Type': 'application/json'
  		        }
  		    }).then(function(response) {
  		    	if(response.data.status == "success"){
  	  		    	commonService.ajsToast(response.data.message);
  	  		    	material = response.data.result;
  	    	    	addMaterialService.setMaterial(material);
  	    	    	$mdDialog.hide();
  		    	}
  		    	else{
  	  		    	$scope.resMsg = response.data.message;
  		    	}
  		    }, function(response) {
  		    });
  		};
  		
  		$scope.deleteMat = function(){
			  $http({
		        url : $rootScope.baseUrl+'action=deleteMaterial&material_id='+$scope.material.materialId,
		        method : "POST",
		        data : {data: $scope.material},
		        headers: {
		            'Content-Type': 'application/json'
		        }
		    }).then(function(response) {
		    	if(response.data.status=="success"){
			    	commonService.ajsToast(response.data.message);
			    	$scope.material.active=0;
			    	addMaterialService.setMaterial($scope.material);
		  	    	$mdDialog.hide();
		    	}
		    	else{
			    	$scope.resMsg = response.data.message;
		    	}
		    }, function(response) {
		    });
		};
  	    
  	    $scope.answer = function() {
  	    	if(($scope.material.materialName == null) || ($scope.material.materialName == "")){
  	    		$scope.resMsg = "Plz enter Material Name";
  	    		return;
  	    	}
  	    	else if(($scope.material.materialCategory == null) || ($scope.material.materialCategory == "")){
  	    		$scope.resMsg = "Plz choose Material Category";
  	    		return;
  	    	}
  	    	else if(($scope.material.materialType == null) || ($scope.material.materialType == "")){
  	    		$scope.resMsg = "Plz choose material type";
  	    		return;
  	    	}
  	    	else if(($scope.material.quantityType == null) || ($scope.material.quantityType == "")){
  	    		$scope.resMsg = "Plz choose Quantity type";
  	    		return;
  	    	}
  	    	$scope.addMaterial($scope.material);
  	    };
  	    
  	    $scope.deleteI = function(){
	    	$scope.deleteMat();
	    }
  	    
  	    $scope.cancel = function(){
  	    	$mdDialog.hide();
  	    }
    }
    
    $scope.openAddUpdateMatcategoryDialog = function(ev, matcategory, index, add) {
    	addMaterialService.setDetails($scope.matcategories); 
		if(add == 1){
			singleObjService.setObj(angular.copy(matcategory));
		}
		else{
			var matcategory1 = {};
			matcategory1.materialCategoryId = 0;
			singleObjService.setObj(matcategory1);
		}
        $mdDialog.show({
          controller: AddUpdateMatcategoryController,
          templateUrl: 'templates/dialogs/matcategory_edit.html',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose:true,
          fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
        })
        
        .then(function(answer) {
        	if(add == 0){
            	if((addMaterialService.getMaterial()!=null) && (addMaterialService.getMaterial()!=undefined))
            		$scope.matcategories.push(addMaterialService.getMaterial());
        	}
        	else{
        		if((addMaterialService.getMaterial()!=null) && (addMaterialService.getMaterial()!=undefined)){
        			if(addMaterialService.getMaterial().active == 0){
        				$scope.matcategories.splice(index, 1);
        			}
        			else{
            			$scope.matcategories[index] = addMaterialService.getMaterial();
        			}
        		}
        	}
        }, function() {
        });
    };
    
    function AddUpdateMatcategoryController($scope, $filter, $mdDialog, addMaterialService, materialService, commonService, singleObjService, UI_MATERIAL) {
		$scope.details = addMaterialService.getDetails();
		
		$scope.matcategory = singleObjService.getObj();
		
		$scope.MATCATEGORY_ADD = UI_MATERIAL.matcategory_add;
    	
  	    $scope.hide = function() {
  	      $mdDialog.hide();
  	    };

  	    $scope.cancel = function() {
  	      $mdDialog.cancel();
  	    };
  	    
  	    $scope.addMatcategory = function(matcategory){
  			  $http({
  		        url : $rootScope.baseUrl+'action=addOrUpdateMatCategory&store_id='+materialService.getStoreId(),
  		        method : "POST",
  		        data : {data: matcategory},
  		        headers: {
  		            'Content-Type': 'application/json'
  		        }
  		    }).then(function(response) {
  		    	if(response.data.status=="success"){
  			    	commonService.ajsToast(response.data.message);
  			    	matcategory = response.data.result;
  			    	addMaterialService.setMaterial(matcategory);
  			    	//$scope.items.push(item);
  		  	    	$mdDialog.hide();
  		    	}
  		    	else{
  			    	$scope.resMsg = response.data.message;
  		    	}
  		    }, function(response) {
  		    });
  		};
  		
  		$scope.deleteMatcategory = function(){
			  $http({
		        url : $rootScope.baseUrl+'action=deleteMatCategory&material_category_id='+$scope.matcategory.materialCategoryId,
		        method : "POST",
		        data : {data: $scope.matcategory},
		        headers: {
		            'Content-Type': 'application/json'
		        }
		    }).then(function(response) {
		    	if(response.data.status=="success"){
			    	commonService.ajsToast(response.data.message);
			    	$scope.matcategory.active=0;
			    	addMaterialService.setMaterial($scope.matcategory);
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
  	    	
  	    	if(($scope.matcategory.materialCategoryName == null) || ($scope.matcategory.materialCategoryName == "")){
  	    		$scope.resMsg = "Plz enter Material category Name";
  	    		return;
  	    	}
  	    	
  	    	$scope.addMatcategory($scope.matcategory);
  	    };
  	    
  	    $scope.deleteI = function(){
  	    	$scope.deleteMatcategory();
  	    }
  	    
  	    $scope.cancel = function(){
  	    	$mdDialog.hide();
  	    }
    }
});