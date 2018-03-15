function materialService() {	
	  
	  var materialOrder = {};
	  
	  var orderMaterial = {};
	  
	  var orderedMaterials = [];
	  
	  var paymentTypes = [];
	  
	  var paymentAmount = 0;
	  
	  var paymentBill;
	  
	  var orderType;
	  
	  var vendor = {};
	  
	  var orderDate;
	  
	  var matSer = {};
	  
	  var index;
	  
	  matSer.getMaterialOrder = function(){
		  return materialOrder;
	  }
	  
	  matSer.setMaterialOrder = function(newObj){
		  materialOrder = newObj;
	  }
	  
	  matSer.getOrderMaterial = function(){
		  return orderMaterial;
	  }
	  
	  matSer.setOrderMaterial = function(newObj){
		  orderMaterial = newObj;
	  }
	  
	  matSer.setIndex = function(obj){
		  index = obj;
	  }
	  
	  matSer.getIndex = function(){
		  return index;
	  }
	  
	  matSer.getPaymentTypes = function(){
		  return paymentTypes;
	  }
	  
	  matSer.setPaymentTypes = function(obj){
		  paymentTypes = obj;
	  }
	  
	  matSer.getPaymentAmount = function(){
		  return paymentAmount;
	  }
	  
	  matSer.setPaymentAmount = function(obj){
		  paymentAmount = obj;
	  }
	  
	  matSer.getOrderedMaterials = function(){
		  return orderedMaterials;
	  }
	  
	  matSer.setOrderedMaterials = function(obj){
		  orderedMaterials = obj;
	  }
	  
	  matSer.setOrderDate = function(obj){
		  orderDate = obj;
	  }
	  
	  matSer.getOrderDate = function(){
		  return orderDate;
	  }
	  
	  matSer.getOrderType = function(){
		  return orderType;
	  }
	  
	  matSer.setOrderType = function(obj){
		  orderType = obj;
	  }
	  
	  matSer.setVendor = function(obj){
		  vendor = obj;
	  }
	  
	  matSer.getVendor = function(){
		  return vendor;
	  }
	  
	  matSer.setPaymentBill = function(obj){
		  paymentBill = obj;
	  }
	  
	  matSer.getPaymentBill = function(){
		  return paymentBill;
	  }
	  return matSer;	  
}

function matAddService(){
	var material;
	
	var materialName;
	
	var details;
	
	var matAddSer = {};
	
	matAddSer.getMaterial = function(){
		return material;
	};
	
	matAddSer.setMaterial = function(newObj){
		material = newObj;
	};
	
	matAddSer.getDetails = function(){
		return details;
	}
	
	matAddSer.setDetails = function(newObj){
		details = newObj;
	}
	
	matAddSer.getMaterialName = function(){
		return materialName;
	}
	
	matAddSer.setMaterialName = function(newObj){
		materialName = newObj;
	}
	
	return matAddSer;
}
