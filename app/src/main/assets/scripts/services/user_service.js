function userAddService(){
	var roles;
	
	var users;
	
	var userAddSer = {};
	
	userAddSer.getRoles = function(){
		return roles;
	};
	
	userAddSer.setRoles = function(newObj){
		roles = newObj;
	};
	
	userAddSer.getUsers = function(){
		return users;
	}
	
	userAddSer.setUsers = function(newObj){
		users = newObj;
	}
	
	return userAddSer;
}