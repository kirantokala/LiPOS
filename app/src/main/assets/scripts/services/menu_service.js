function itemService() {
	  var totalAmount = 0;
	  
	  var itemOrder = {};
	  
	  var orderItem = {};
	  
	  var storeId;
	  
	  var paymentTypes = [];
	  
	  var itemSer = {};
	  
	  var index;
	  
	  itemSer.addPaymentTypes = function(newObj) {
		  paymentTypes = newObj;
	  };

	  itemSer.getPaymentTypes = function(){
	      return paymentTypes;
	  };
	  
	  itemSer.setTotalAmount = function(amount){
		  totalAmount = amount;
	  };
	  
	  itemSer.getTotalAmount = function(){
		  return totalAmount;
	  };
	  
	  itemSer.getItemOrder = function(){
		  return itemOrder;
	  }
	  
	  itemSer.setItemOrder = function(newObj){
		  itemOrder = newObj;
	  }
	  
	  itemSer.getStoreId = function(){
		  return storeId;
	  }
	  
	  itemSer.setStoreId = function(newObj){
		  storeId = newObj;
	  }
	  
	  itemSer.getOrderItem = function(){
		  return orderItem;
	  }
	  
	  itemSer.setOrderItem = function(newObj){
		  orderItem = newObj;
	  }
	  
	  itemSer.setIndex = function(obj){
		  index = obj;
	  }
	  
	  itemSer.getIndex = function(){
		  return index;
	  }
	  
	  return itemSer;
}

function itemAddService(){
	var item;
	
	var details;
	
	var itemAddSer = {};
	
	itemAddSer.getItem = function(){
		return item;
	};
	
	itemAddSer.setItem = function(newObj){
		item = newObj;
	};
	
	itemAddSer.getDetails = function(){
		return details;
	}
	
	itemAddSer.setDetails = function(newObj){
		details = newObj;
	}
	return itemAddSer;
}