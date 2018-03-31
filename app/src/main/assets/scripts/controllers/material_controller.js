app.factory('materialService', materialService);

app.factory("addMaterialService",matAddService);

app.controller("MaterialController", function ($scope, $http, $rootScope, $mdDialog, $cookieStore, materialService, addMaterialService, commonService, UI_MATERIAL) {
	$scope.user = $cookieStore.get("user");
	$scope.store = $cookieStore.get("store");
	
	$rootScope.pageTitle = "EXPENSES";
	
	$scope.UI_MATERIAL = UI_MATERIAL;
	
	$scope.materialOrder = {};
	
	$scope.paymentTypes = [];
	
	$scope.orderedMaterials = [];
	
	$scope.paymentAmount = 0;
	
	$scope.vendor = {};
	
	$scope.paymentBill = "";
	
	$scope.orderType = 0;
  	
	$scope.orderDate = new Date();
	
	$rootScope.loading = true;
	$http.get($rootScope.baseUrl+'action=getMatHomeData&user_id='+$scope.user.userId+'&store_id='+$scope.store.storeId).success(function(data) {
		$scope.materials = data.result.materials;
		$scope.paymentTypes = data.result.paymentTypes;
  	  	$scope.setOrder();
		$rootScope.loading = false;
	});
	
    $scope.clearMaterialOrder = function(){
    	$scope.materialOrder = {};
    	$scope.orderedMaterials = [];
    	$scope.paymentAmount = 0;
    }
    
    $scope.clearMaterialOrder();
	
	$scope.updateTotalCost = function(quantity,material,index){
		if(quantity==0){
			$scope.orderedMaterials.splice(index, 1);
		}
		$scope.updateTotalCostMat();
	}
	
	$scope.updateOrderMaterial = function(quantity,material,index){
		$scope.orderedMaterials[index].quantity = quantity;
		$scope.orderedMaterials[index].cost = material.cost;
		$scope.orderedMaterials[index].deliveredQuantity = quantity;
		$scope.orderedMaterials[index].actualCost = material.cost;
		$scope.updateTotalCost(quantity,material,index);
	}
	
	$scope.setOrder = function(){
		if(($rootScope.materialOrder!=undefined) && ($rootScope.materialOrder!={})){
			$scope.orderDate = $rootScope.materialOrder.orderDate;
			$scope.orderedMaterials = $rootScope.materialOrder.orderedMaterials;
			$scope.paymentTypes = angular.copy($rootScope.materialOrder.paymentTypes);
			$scope.paymentAmount = $rootScope.materialOrder.paymentAmount;
			$scope.paymentBill = $rootScope.materialOrder.paymentBill;
			if($rootScope.materialOrder.vendor.userId>0){
				$scope.orderType = 1;
				$scope.vendor = $rootScope.materialOrder.vendor;
			}
			else{
				$scope.orderType = 0;
			}
		}
	}
	
	$scope.updateTotalCostMat = function(){
		$scope.paymentAmount = 0;
		for(var i=0;i<$scope.orderedMaterials.length;i++){
			$scope.paymentAmount=$scope.paymentAmount + parseFloat($scope.orderedMaterials[i].cost);
		}
		$scope.paymentAmount = $scope.paymentAmount;
	}
	
	$scope.sort = function(keyname){
        $scope.sortKey = keyname;   
        $scope.reverse = !$scope.reverse; 
    }
	
	$scope.query = "";
    
    $scope.search = function (row) {
        var query = $scope.query.toLowerCase();
        return (row.materialId.toString().indexOf(query || '') !== -1 || row.materialName.toLowerCase().indexOf(query || '') !== -1);
    };
	
	$scope.addToMaterialOrder = function (material) {
			$scope.query = "";
			var orderedMaterials = $scope.orderedMaterials;
			var isOrdered = false;
			for(var i=0;i<orderedMaterials.length;i++){
				if(orderedMaterials[i].material.materialId == material.materialId){
					$scope.orderedMaterials[i].quantity++;
					$scope.orderedMaterials[i].deliveredQuantity++;
					isOrdered = true;
					break;
				}
			}
			if(!isOrdered){
	            var materialp = {};
	            materialp.material = material;
	            materialp.quantity = 1;
	            materialp.deliveredQuantity = 1;
	            materialp.cost = material.packCost;
	            materialp.actualCost = material.packCost;
	            $scope.paymentAmount += parseFloat(material.packCost);
	            $scope.orderedMaterials.push(materialp);
			}
    };
    
    $scope.openPaymentInfoDialog = function(ev) {
    	materialService.setOrderDate($scope.orderDate);
    	materialService.setOrderedMaterials($scope.orderedMaterials);
    	materialService.setPaymentTypes($scope.paymentTypes);
    	materialService.setPaymentAmount($scope.paymentAmount);
    	materialService.setOrderType($scope.orderType);
    	materialService.setVendor($scope.vendor);
    	materialService.setPaymentBill($scope.paymentBill);
        $mdDialog.show({
          controller: PaymentInfoController,
          templateUrl: 'templates/dialogs/material_order.html',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose:true,
          fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
        })
        .then(function(answer) {
          $scope.clearMaterialOrder();
        }, function() {
        });
    };
    
    $scope.openAddMaterialDialog = function(ev) {
    	if($scope.filtered.length == 0){
    		addMaterialService.setMaterialName($scope.query);
    	}
    	else{
    		addMaterialService.setMaterialName("");
    	}
    	$http.get($rootScope.baseUrl+'action=getAddMaterialInfo&store_id='+$scope.store.storeId).success(function(data) {
    		addMaterialService.setDetails(data.result);
        	
            $mdDialog.show({
              controller: AddController,
              templateUrl: 'templates/dialogs/material_add.html',
              parent: angular.element(document.body),
              targetEvent: ev,
              clickOutsideToClose:true,
              fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
            })
            
            .then(function(answer) {
            	if((addMaterialService.getMaterial()!=null) && (addMaterialService.getMaterial()!=undefined))
            		$scope.materials.push(addMaterialService.getMaterial());
            }, function() {
            });
    	});
    };
    
    function AddController($scope, $filter, $mdDialog, addMaterialService, UI_MATERIAL) {
    	$scope.MATERIAL_ADD = UI_MATERIAL.material_add;
		$scope.details = addMaterialService.getDetails();
		
		$scope.materialName = addMaterialService.getMaterialName();
		
		$scope.materialType = $scope.details.materialTypes[0];
    	
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
  	    
  	    $scope.answer = function() {
  	    	if(($scope.materialName == null) || ($scope.materialName == "")){
  	    		$scope.resMsg = "Plz enter Material Name";
  	    		return;
  	    	}
  	    	else if(($scope.materialCategory == null) || ($scope.materialCategory == "")){
  	    		$scope.resMsg = "Plz choose Material Category";
  	    		return;
  	    	}
  	    	else if(($scope.materialType == null) || ($scope.materialType == "")){
  	    		$scope.resMsg = "Plz choose material type";
  	    		return;
  	    	}
  	    	else if(($scope.quantityType == null) || ($scope.quantityType == "")){
  	    		$scope.resMsg = "Plz choose Quantity type";
  	    		return;
  	    	}
  	    	material.materialName = $scope.materialName;
  	    	material.materialDesc = $scope.materialName;
  	    	material.materialCategory = $scope.materialCategory;
  	    	material.materialType = $scope.materialType;
  	    	material.quantityType = $scope.quantityType;
  	    	material.packCost = $scope.packCost;
  	    	material.quantity = $scope.quantity;
  	    	$scope.addMaterial(material);
  	    };
  	    
  	    $scope.cancel = function(){
  	    	$mdDialog.hide();
  	    }
    }
    
    function PaymentInfoController($scope, $filter, $mdDialog, materialService, commonService, $cookieStore, $location, UI_MATERIAL) {
  	  	
    	$scope.MATERIAL_ORDER = UI_MATERIAL.material_order;
    	
    	$scope.materialOrder = {};
    	
  	  	$scope.paymentTypes = materialService.getPaymentTypes();
  	  	$scope.orderedMaterials = materialService.getOrderedMaterials();
  	  	$scope.paymentAmount = Math.round(materialService.getPaymentAmount());
  	  	$scope.orderDate = materialService.getOrderDate();
  	  	$scope.orderType = materialService.getOrderType();
  	  	$scope.vendor = materialService.getVendor();
  	  	$scope.paymentBill = materialService.getPaymentBill();
  	  	
  	  	
  	  	$scope.user = $cookieStore.get("user");
  	  	$scope.store = $cookieStore.get("store");
  	  	
	  	$http.get($rootScope.baseUrl+'action=getUserPayment&user_id='+$scope.user.userId+'&store_id='+$scope.store.storeId).success(function(data) {
	  		$scope.userMoney = data.result;
	  		if(($rootScope.materialOrder!=undefined) && ($rootScope.materialOrder!={})){
				for(var i=0;i<$rootScope.materialOrder.paymentTypes.length;i++){
					$scope.userMoney[$rootScope.materialOrder.paymentTypes[i].paymentTypeId]+=$rootScope.materialOrder.paymentTypes[i].amount;
				}
				$scope.materialOrder.orderId = $rootScope.materialOrder.orderId;
			}
	  	});
	  	  
	  	$http.get($rootScope.baseUrl+'action=getUsers&role_id=9&store_id='+$scope.store.storeId).success(function(data) {
	  		$scope.vendors = data.result;
	  	 });
  	  	
	  	var paymentTypeId;
	  	if($scope.user.role.roleId == 2){
			paymentTypeId = 1;
		}
		else{
			paymentTypeId = 5;
		}
	  	if(($rootScope.materialOrder!=undefined) && ($rootScope.materialOrder!={})){
		  	for(var i=0;i<$scope.paymentTypes.length;i++){
		  		$scope.paymentTypes[i].amount = $rootScope.materialOrder.paymentTypes[i].amount;
		  	}
	  	}
	  	else{		  	
		  	for(var i=0;i<$scope.paymentTypes.length;i++){
		  		if($scope.paymentTypes[i].paymentTypeId==paymentTypeId){
		  			$scope.paymentTypes[i].amount = $scope.paymentAmount;
		  		}
		  		else{
		  			$scope.paymentTypes[i].amount = 0;
		  		}
		  	}
	  	}
  	  	
  	  	$scope.errorMsg = "";
  	    $scope.hide = function() {
  	      $mdDialog.hide();
  	    };

  	    $scope.cancel = function() {
  	      $mdDialog.cancel();
  	    };
	    
	    $scope.ordered = false;

  	    $scope.answer = function() {
  	    	if(($scope.paymentAmount == 0) || ($scope.paymentAmount == null) || ($scope.paymentAmount == "")){
  	    		$scope.errorMsg = "Payment amount cannot be 0";
  	    		return;
  	    	}
  	    	else if(($scope.orderType == 1) && (angular.equals($scope.vendor, {}) || $scope.vendor=="")){
    			$scope.errorMsg = "Please select vendor";
  	    		return;
  	    	}
  	    	/*
  	    	else if(($scope.paymentBill == null) || ($scope.paymentBill == "")){
  	    		$scope.errorMsg = "Please upload paymentBill";
  	    	}*/
  	    	else{
  	    		if($scope.orderType == 0){
		    		var amou = 0;
		    		for(var i=0;i<$scope.paymentTypes.length;i++){
		    			if(($scope.paymentTypes[i].amount==null) || ($scope.paymentTypes[i].amount=="") || ($scope.paymentTypes[i].amount==undefined))
		    			  $scope.paymentTypes[i].amount = 0;
		    			
		    			/*if($scope.userMoney[$scope.paymentTypes[i].paymentTypeId] < $scope.paymentTypes[i].amount){
		    				$scope.errorMsg = "Only "+ $scope.userMoney[$scope.paymentTypes[i].paymentTypeId] + " amount available as " + $scope.paymentTypes[i].paymentTypeName;
			    			return;
		    				break;
		    			}*/
		    			amou = amou + parseFloat($scope.paymentTypes[i].amount);
		    		}
		    		if(amou != $scope.paymentAmount){
		    			$scope.errorMsg = "Amount not matching. "+ amou + " != " + $scope.paymentAmount;
		    			return;
		    		}
  	    		}
	    		
		  	    if(!$scope.ordered){
  	              var df = new Date();
	  	          var h = df.getHours();
	  	          var m = df.getMinutes();
	  	          var s = df.getSeconds();
  	          
	  	          var time = h+":"+m+":"+s;
  	              
  	              $scope.materialOrder.orderDate = $filter('date')($scope.orderDate,'yyyy-MM-dd')+" "+time;
  	              
  	              $scope.materialOrderUp();
  	              
  	              $scope.ordered = true;
		  	    }
  	    	}
  	    };
  	    
  	    $scope.cancel = function(){
  	    	$mdDialog.hide();
  	    }
	    
	    $scope.materialOrderUp = function(){
	    	
	    	$scope.materialOrder.orderedMaterials = $scope.orderedMaterials;
	    	
	    	$scope.materialOrder.storeId = $scope.store.storeId;
	    	
	   	  	$scope.materialOrder.user = $scope.user;
	    	
	    	$scope.materialOrder.paymentAmount = $scope.paymentAmount;
	    	
	    	$scope.materialOrder.paymentBill = $scope.paymentBill;
	    	
	    	if($scope.orderType == 0){
		    	var obj = {};
		    	obj.userId=0;
		    	$scope.materialOrder.vendor = obj;
		    	$scope.materialOrder.direct = 1;
	    	}
	    	else{
	    		for(var i=0;i<$scope.paymentTypes.length;i++){
			  		$scope.paymentTypes[i].amount = 0;
			  	}
	    		$scope.materialOrder.vendor = $scope.vendor;
		    	$scope.materialOrder.direct = 0;
	    	}
	    	$scope.materialOrder.paymentTypes = $scope.paymentTypes;
	  	  	$http({
	            url : $rootScope.baseUrl+'action=placeMaterialOrder',
	            method : "POST",
	            data : {data: $scope.materialOrder},
	            headers: {
	                'Content-Type': 'application/json'
	            }
	        }).then(function(response) {
	            commonService.ajsToast(response.data.message);
	            if(($rootScope.materialOrder!=undefined) && ($rootScope.materialOrder!={})){
		            $rootScope.materialOrder = {};
		            $location.path('/purchases');
	            }
	            $mdDialog.hide();
	        }, function(response) {
	        });
	    }
    }
    
    $scope.openMaterialOptionDialog = function(ev,orderMaterial,index) {
    	materialService.setOrderMaterial(angular.copy(orderMaterial));
    	materialService.setIndex(index);
        $mdDialog.show({
          controller: MaterialOptionController,
          templateUrl: 'templates/dialogs/order_material_cust.html',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose:true,
          fullscreen: $scope.customFullscreen
        })
        .then(function(answer) {
        	$scope.updateOrderMaterial(materialService.getOrderMaterial().quantity,materialService.getOrderMaterial(),materialService.getIndex());
        }, function() {
        });
    };
      
    function MaterialOptionController($scope, $mdDialog, materialService, UI_MATERIAL) {
		$scope.ORDER_MATERIAL = UI_MATERIAL.order_material;
		$scope.orderMaterial = materialService.getOrderMaterial();
	    $scope.hide = function() {
	      $mdDialog.hide();
	    };

	    $scope.cancel = function() {
	      $mdDialog.cancel();
	    };
	    
	    $scope.deleteI = function(){
	    	var orderMaterial = $scope.orderMaterial;
	    	orderMaterial.quantity = 0;
	    	orderMaterial.cost = 0;
	    	orderMaterial.deliveredQuantity = 0;
	    	orderMaterial.actualCost = 0;
	    	materialService.setOrderMaterial(orderMaterial);
		    $mdDialog.hide();
	    }
	    
	    $scope.answer = function() {
    	  var orderMaterial = $scope.orderMaterial;
    	  if((orderMaterial.quantity <=0) || (orderMaterial.cost <=0) || (orderMaterial.quantity==undefined) || (orderMaterial.cost==undefined)){
    		  $scope.resMsg = "Cost & Quantity Cannot be <=0";
    		  return;
    	  }
	      materialService.setOrderMaterial($scope.orderMaterial);
	      $mdDialog.hide();
	    };
    }
});