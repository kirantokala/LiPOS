app.factory('itemService', itemService);

app.factory("addItemService",itemAddService);

app.controller("MenuController", function ($scope, $http, $mdDialog, $rootScope, $cookieStore, itemService, addItemService, commonService, UI_MENU) {
	$scope.user = $cookieStore.get("user");			// Getting details of the user
	$scope.store = $cookieStore.get("store");		// Getting details of the store
	
	$rootScope.pageTitle = "SALES";
	
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
	
	$scope.itemOrder = {};
    
    $scope.clearOrder = function(){
      $scope.itemOrder = {};
  	  $scope.itemOrder.orderedItems = [];
  	  $scope.itemOrder.paymentTypes = [];
  	  $scope.itemOrder.totalAmount = 0;
  	  $scope.itemOrder.storeId = $scope.store.storeId;
  	  $scope.itemOrder.user = $scope.user;
    }
    
    $scope.parcelCost = $rootScope.CST_COM.parcelCost;
	
	$scope.clearOrder();
	
	$scope.updateTotalCost = function(quantity,item,index){
		if(quantity<=0){
			$scope.itemOrder.orderedItems.splice(index, 1);
		}
		$scope.updateTotalAmount();
	}
	
	$scope.updateOrderItem = function(quantity,item,index){
		$scope.itemOrder.orderedItems[index].quantity = quantity;
		$scope.itemOrder.orderedItems[index].parcelCount = item.parcelCount;
		$scope.updateTotalCost(quantity,item,index);
	}
	
	$scope.updateTotalAmount = function(){
		$scope.itemOrder.totalAmount = 0;
		for(var i=0;i<$scope.itemOrder.orderedItems.length;i++){
			$scope.itemOrder.totalAmount=$scope.itemOrder.totalAmount + ($scope.itemOrder.orderedItems[i].quantity*$scope.itemOrder.orderedItems[i].item.price) + ($scope.itemOrder.orderedItems[i].parcelCount*$scope.parcelCost);
		}
	}
	
	$scope.sort = function(keyname){
        $scope.sortKey = keyname;
        $scope.reverse = !$scope.reverse;
    }
	
	$scope.addToItemOrder = function (item) {
			$scope.query = "";
			var orderedItems = $scope.itemOrder.orderedItems;
			var isOrdered = false;
			for(var i=0;i<orderedItems.length;i++){
				if(orderedItems[i].item.itemId == item.itemId){
					$scope.itemOrder.orderedItems[i].quantity++;
					$scope.itemOrder.totalAmount += parseInt(item.price);
					isOrdered = true;
					break;
				}
			}
			if(!isOrdered){
	            var itemp = {};
	            itemp.item = item;
	            itemp.quantity = 1;
	            if($scope.user.role.roleId==$rootScope.CST_COM.roles.substore){
	            	itemp.parcelCount = 1;
	            }
	            else{
	            	itemp.parcelCount = 0;
	            }
	            $scope.itemOrder.totalAmount += parseInt(item.price);
	            $scope.itemOrder.totalAmount += parseInt(itemp.parcelCount * $scope.parcelCost);
	            $scope.itemOrder.orderedItems.push(itemp);
			}
    };
	
    $scope.query = "";
    
    $scope.search = function (row) {
        var query = $scope.query.toLowerCase();
        var subName = $scope.subcategory1.subcategoryName;
        var res1 = (subName==UI_MENU.title)?'':subName;
        
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
    
    $scope.customFullscreen = false;
    
    $scope.openOrderBillDialog = function(ev, paymentTypeId) {    	
    	if(paymentTypeId!=0){
	    	var paymentType;
	    	for(var i=0;i<$scope.paymentTypes.length;i++){
	    		if($scope.paymentTypes[i].paymentTypeId == paymentTypeId){
	    			paymentType = $scope.paymentTypes[i];
	    			break;
	    		}
	    	}
	    	paymentType.amount = $scope.itemOrder.totalAmount;
	    	$scope.itemOrder.paymentTypes = [];
	    	$scope.itemOrder.paymentTypes.push(paymentType);
    	}
    	
    	itemService.setItemOrder($scope.itemOrder);
        $mdDialog.show({
          controller: OrderBillController,
          templateUrl: 'templates/dialogs/item_order_bill.html',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose:true,
          fullscreen: $scope.customFullscreen
        })
        .then(function(answer) {
        		//$scope.itemOrderUp();
        	$scope.clearOrder();
        }, function() {
        });
    };
    
    function OrderBillController($scope, $rootScope, $filter, $mdDialog, $cookieStore, itemService, commonService, UI_MENU) {
    	$scope.ORDER_BILL = UI_MENU.order_bill;
    	$scope.orderDate= new Date();
    	$scope.parcelCost = $rootScope.CST_COM.parcelCost;
    	$scope.orderNo = 0;
	  	$scope.itemOrder = itemService.getItemOrder();
	    $scope.hide = function() {
	      $mdDialog.hide();
	    };
	    
	    $scope.printBill = function()
	    {
	    	/*$scope.itemOrder.orderId = $scope.orderNo;
	    	
	    	$scope.itemOrder.store = $cookieStore.get("store");
	       
	    	var currentdate = new Date(); 
	    	var datetime =  currentdate.getDate() + "/"
	    	                + (currentdate.getMonth()+1)  + "/" 
	    	                + currentdate.getFullYear() + "  "  
	    	                + currentdate.getHours() + ":"  
	    	                + currentdate.getMinutes() + ":" 
	    	                + currentdate.getSeconds();
	    	
	    	var billText = "";
	    	billText += "<SMALL>Date:"+datetime+"<BR>";
	    	billText += "<SMALL>Order no:"+$scope.itemOrder.orderId+"<BR>";
	    	billText += "<CENTER><BIG>"+$scope.itemOrder.store.storeName+"<BR>";
	    	
	    	billText += "<CENTER>--------------------------------<BR>";
	    	
	    	var item;
	    	for(var i=0;i<$scope.itemOrder.orderedItems.length;i++){
	    		item = $scope.itemOrder.orderedItems[i];
	    		billText += "<LEFT>"+item.item.itemName + "<BR>";
	    		billText += "<RIGHT>";
	    		if(item.parcelCount > 0){
	    			billText += "(P X " +item.parcelCount+" = "+item.parcelCount*$scope.parcelCost + ") + ";  
	    		}
	    		billText += "("+ item.quantity+" X "+item.item.price+") = "+(item.quantity*item.item.price+item.parcelCount*$scope.parcelCost)+"  <BR>";
	    	}
	    	
	    	billText += "<BR><RIGHT><BOLD>Total Amount : "+$scope.itemOrder.totalAmount + "  <BR>";
	    	
	    	billText += "<CENTER>--------------------------------<BR>";
	    	
	    	var paymentType;
	    	for(var i=0;i<$scope.itemOrder.paymentTypes.length;i++){
	    		paymentType = $scope.itemOrder.paymentTypes[i];
	    		if(paymentType.amount>0)
	    			billText += "<LEFT>"+paymentType.paymentTypeName + " : " + paymentType.amount + "<BR>";
	    	}

	    	billText += "<CENTER>--------------------------------<BR>";
	    	billText += "<CENTER><SMALL>THANK YOU. VISIT AGAIN<BR>";
	    	
	    	billText += '<CUT>';*/
	    	
	    	commonService.andPrint(JSON.stringify($scope.itemOrder));
	    }
	    
	    $scope.itemOrderUp = function(){    
	    	$scope.itemOrder.direct = 1;
	    	if($rootScope.user.role.roleId == $rootScope.CST_COM.roles.substore){
	    		$scope.itemOrder.direct = 0;
	    	}
	    	  $http({
	              url : $rootScope.baseUrl+'action=placeItemOrder',
	              method : "POST",
	              data : {data: $scope.itemOrder},
	              headers: {
	                  'Content-Type': 'application/json'
	              }
	          }).then(function(response) {
	        	  if(response.data.status == "success"){
		        	  commonService.ajsToast(response.data.message);
		        	  $scope.orderNo = response.data.result;
			    	  $mdDialog.hide();
			    	  $scope.printBill();
	        	  }
	        	  else{
	        		  $scope.resMsg = response.data.message;
	        	  }
	          }, function(response) {
	          });
	    }

	    $scope.cancel = function() {
	      $mdDialog.cancel();
	    };

	    $scope.printBill1 = function() {
    	  var df = new Date();
    	  var h = df.getHours();
    	  var mi = df.getMinutes();
    	  var s = df.getSeconds();
    	      
    	  var time = h+":"+mi+":"+s;
    	     
    	  $scope.itemOrder.orderDate = $filter('date')($scope.orderDate,'yyyy-MM-dd')+" "+time;
    	  $scope.itemOrderUp();
	    };
    }
    
    $scope.openPaymentSplitDialog = function(ev) {
    	itemService.setTotalAmount($scope.itemOrder.totalAmount);
        $mdDialog.show({
          controller: PaymentSplitController,
          templateUrl: 'templates/dialogs/item_payment_split.html',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose:true,
          fullscreen: $scope.customFullscreen
        })
        .then(function(answer) {
          $scope.itemOrder.paymentTypes = itemService.getPaymentTypes();
          $scope.openOrderBillDialog(ev,0);
        }, function() {
        });
    };
      
    function PaymentSplitController($scope, $rootScope, $mdDialog, itemService, UI_MENU) {
		$scope.SPLIT_PAYMENT = UI_MENU.split_payment;
	  	$scope.paymentTypes = itemService.getPaymentTypes();
	  	$scope.totalAmount = itemService.getTotalAmount();
	  	var paymentType;
	  	for(var i=0;i<$scope.paymentTypes.length;i++){
	  		if($scope.paymentTypes[i].paymentTypeId==1){
	  			paymentType = $scope.paymentTypes[i];
	  			$scope.paymentTypes[i].amount = $scope.totalAmount;
	  		}
	  		else{
	  			$scope.paymentTypes[i].amount = 0;
	  		}
	  	}
	    $scope.hide = function() {
	      $mdDialog.hide();
	    };

	    $scope.cancel = function() {
	      $mdDialog.cancel();
	    };

	    $scope.answer = function() {
    	  var amo = 0;
    	  for(var i=0;i<$scope.paymentTypes.length;i++){
    		  if($rootScope.isStrNull($scope.paymentTypes[i].amount))
    			  $scope.paymentTypes[i].amount = 0;
    		  amo += parseInt($scope.paymentTypes[i].amount);
    	  }
    	  if(amo!=$scope.totalAmount){
    		  $scope.errorMsg = "Amount not matching. "+ amo + " != " + $scope.totalAmount;
	    	  return;
    	  }
    	  else{
    	      itemService.addPaymentTypes($scope.paymentTypes);
    	      $mdDialog.hide();
    	  }
	    };
    }    
    
    $scope.openItemOptionDialog = function(ev,orderItem,index) {
    	itemService.setOrderItem(angular.copy(orderItem));
    	itemService.setIndex(index);
        $mdDialog.show({
          controller: ItemOptionController,
          templateUrl: 'templates/dialogs/order_item_cust.html',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose:true,
          fullscreen: $scope.customFullscreen
        })
        .then(function(answer) {
        	$scope.updateOrderItem(itemService.getOrderItem().quantity,itemService.getOrderItem(),itemService.getIndex());
        }, function() {
        });
    };
      
    function ItemOptionController($scope, $rootScope, $mdDialog, itemService, UI_MENU) {
		$scope.ORDER_ITEM = UI_MENU.order_item;
		$scope.orderItem1 = itemService.getOrderItem();
		
		$scope.user = $rootScope.user;
		
		$scope.CST_COM = $rootScope.CST_COM;
		
	    $scope.hide = function() {
	      $mdDialog.hide();
	    };

	    $scope.cancel = function() {
	      $mdDialog.cancel();
	    };
	    
	    $scope.deleteI = function(){
	    	var orderItem = $scope.orderItem1;
	    	orderItem.quantity = 0;
	    	orderItem.parcelCount = 0;
	    	itemService.setOrderItem(orderItem);
    	    $mdDialog.hide();
	    }

	    $scope.answer = function() {
	    	  var orderItem = $scope.orderItem1;
	    	  if(parseInt(orderItem.quantity) < parseInt(orderItem.parcelCount)){
	    		  $scope.resMsg = "Parcel Count cannot be greater than Quantity";
	    		  return;
	    	  }
	    	  else if((parseInt(orderItem.quantity) <=0) || (orderItem.quantity == undefined)){
	    		  $scope.resMsg = "Quantity Cannot be <=0";
	    		  return;
	    	  }
	    	  else if(orderItem.parcelCount == undefined){
	    		  $scope.resMsg = "ParcelCount must be >=0";
	    		  return;
	    	  }
	    	  if($scope.user.role.roleId == $rootScope.CST_COM.roles.substore){
	    		  $scope.orderItem1.parcelCount = orderItem.quantity;
	    	  }
		      itemService.setOrderItem($scope.orderItem1);
		      $mdDialog.hide();
	    };
    }
});