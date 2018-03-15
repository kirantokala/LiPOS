app.controller("DashboardController", function ($scope,$cookieStore,$rootScope,$http,UI_DASHBOARD,commonService) {
	$scope.user = $cookieStore.get("user");
	$scope.store = $cookieStore.get("store");
	
	$rootScope.pageTitle = "DASHBOARD";
	
	$scope.UI_DASHBOARD = UI_DASHBOARD;
	$rootScope.loading = true;
	
	$http.get($rootScope.baseUrl+'action=getUserMoney&store_id='+$scope.store.storeId).success(function(data) {
		$scope.paymentTypes = data.result.paymentTypes;
		$scope.users = data.result.users;
		$scope.userMoney = data.result.userMoney;
		$rootScope.loading = false;
	});
	
	$scope.getAmount = function(userId, paymentTypeId){
		var userObj = $scope.userMoney[userId];
		if(userObj != undefined){
			for(var i=0;i<userObj.length;i++){
				if(userObj[i][paymentTypeId]!=undefined)
					return userObj[i][paymentTypeId];
			}
		}
		return 0;
	}
	

	$scope.getUserTotalAmount = function(userId) {
		var userObj = $scope.userMoney[userId];
		var sum = 0;
		if (userObj != undefined) {
			for(var i=0;i<userObj.length;i++){
				for(var el in userObj[i]) {
					sum += parseFloat(userObj[i][el]);
				}
			}
		}
		return sum;
	}
	
	$scope.settleAmount = function(){
		$http.get($rootScope.baseUrl+'action=settleAmount&store_id='+$scope.store.storeId).success(function(response) {
			commonService.ajsToast(response.result);
			$scope.userMoney = {};
		});
	}
	
});