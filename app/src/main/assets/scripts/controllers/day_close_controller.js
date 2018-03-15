app.controller("DayCloseController",function ($scope, $http, $filter,$cookieStore,$location,$rootScope,commonService,UI_DAY_CLOSE) {
	$scope.user = $cookieStore.get("user");
	$scope.store = $cookieStore.get("store");
	
	$rootScope.pageTitle = "DAY CLOSE";
	
	$scope.UI_DAY_CLOSE = UI_DAY_CLOSE;
	
	$scope.months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
	$scope.days = [31,28,31,30,31,30,31,31,30,31,30,31];
	
	var df = new Date();
    var y = df.getFullYear();
    var m = df.getMonth()+1;
    var d = df.getDate();
	
	$scope.presentDay = d;
	$scope.presentMonth = m;
	$scope.presentYear = y;

	$scope.day = $scope.presentDay;
	$scope.month = $scope.presentMonth;
	$scope.year = $scope.presentYear;
	
	$scope.fromDay = $scope.day;
	
	$scope.fromMonth = $scope.month;
	
	$scope.fromYear = $scope.year;
	
	$scope.filterBy = "day";
	
	$scope.filterType = function(){
		if($scope.filterBy == "day"){
			$scope.clickDay();
		}
		else if($scope.filterBy == "today"){
			$scope.clickToday();
		}
	}
	
	$scope.clickDay = function(){
		$scope.day = 1;
		$scope.fromDay = $scope.day;
		$scope.filterWithDate();
	}
	
	$scope.clickToday = function(){
		$scope.day = $scope.presentDay;
		$scope.month = $scope.presentMonth;
		$scope.year = $scope.presentYear;
		
		$scope.fromDay = $scope.day;
		
		$scope.fromMonth = $scope.month;
		
		$scope.fromYear = $scope.year;
		$scope.filterWithDate();
	}
	
	$scope.previous = function(){
		if(($scope.filterBy == "day") || ($scope.filterBy == "today")){
			$scope.filterByDay("prev");
		}
		$scope.filterWithDate();
	}
	
	$scope.next = function(){
		if(($scope.filterBy == "day") || ($scope.filterBy == "today")){
			$scope.filterByDay("next");
		}
		$scope.filterWithDate();
	}
	
	$scope.filterByDay = function(dir){
		if(dir == "prev"){
			$scope.day = $scope.day - 1; 
			if($scope.day == 0 ){
				$scope.month = $scope.month - 1;
				if($scope.month == 0){
					$scope.year = $scope.year - 1;
					$scope.month = $scope.months.length;
				}
				$scope.day = $scope.days[$scope.month-1];
			}
		}
		else if(dir == "next"){
			$scope.day = $scope.day + 1; 
			if($scope.day > $scope.days[$scope.month-1]){
				$scope.month = $scope.month + 1;
				if($scope.month == $scope.months.length+1){
					$scope.year = $scope.year + 1;
					$scope.month = 1;
				}
				$scope.day = 1;
			}
		}
		$scope.fromDay = $scope.day;
		$scope.fromMonth = $scope.month;
		$scope.fromYear = $scope.year;
	}
	
	$scope.dateMain= new Date();
	
	$scope.$watch('$viewContentLoaded', function(){
		$scope.filterWithDate();
	});
	
	$scope.dateFromIn = $scope.dateMain;
	
	$scope.filterWithDate = function(){
		var dateFromIn;
		
		if($scope.filterBy != "custom"){
			dateFromIn = $scope.fromYear+ "-" + $scope.fromMonth + "-" + $scope.fromDay;
		}
		else{
			dateFromIn = $filter('date')($scope.dateMain,'yyyy-MM-dd');
			$scope.day = $scope.dateMain.getDate();
			$scope.month = $scope.dateMain.getMonth()+1;
			$scope.year = $scope.dateMain.getFullYear();
			$scope.fromDay = $scope.day;
			$scope.fromMonth = $scope.month;
			$scope.fromYear = $scope.year;
		}
		$scope.dateFromIn = dateFromIn;
		$scope.getDayCloseInfo(dateFromIn);
	}
	
	$scope.totalDebit = 0;
	
	$scope.getDayCloseInfo = function(date){
		$scope.resMsg = "";
		$http.get($rootScope.baseUrl+'action=getSingleDayCloseInfo&&date='+date+'&user_id='+$scope.user.userId+'&store_id='+$scope.store.storeId).success(function(data) {
			$scope.dayClose=data.result.dayClose;
		});
	}
	
	$http.get($rootScope.baseUrl+'action=getUsers&role_id=1&store_id='+$scope.store.storeId).success(function(data) {
		$scope.receivers = data.result;
	});
	
	$scope.addExpenses = function(){
		$location.path("/material");
	}
	
	$scope.dayClose = {};
	
	$scope.clearDayCloseInfo = function(){
        $scope.dayClose = {};
        $scope.dayClose.counterCash = 0;
        $scope.dayClose.user = $scope.user;
        $scope.dayClose.receiver = $scope.user;
	}
	
	$scope.clearDayCloseInfo();
	
	$scope.calculateDisturbance = function(){		
		$scope.totalEnteredAmount = 0;
		for(var i=0;i<$scope.dayClose.paymentTypes.length;i++){
			if($scope.dayClose.paymentTypes[i].common == 0)
				$scope.totalEnteredAmount += parseFloat($scope.dayClose.paymentTypes[i].amount);
		}
		$scope.totalEnteredAmount += parseFloat($scope.dayClose.counterCash);
		$scope.dayClose.discurbance = $scope.totalEnteredAmount - ($scope.dayClose.creditAmount - $scope.dayClose.debitAmount);
	}
	
	$scope.addDayCloseInfo = function(){
		$scope.resMsg = "";
		if(($scope.dayClose.receiver == null) || ($scope.dayClose.receiver == "")){
			$scope.resMsg = "Plz choose receiver";
			return;
		}		
		$scope.dayClose.date = $scope.dateFromIn;
		$scope.calculateDisturbance();	
		$scope.dayClose = $scope.dayClose;
		$scope.dayClose.storeId =$scope.store.storeId; 
  	  	$http({
            url : $rootScope.baseUrl+'action=addDayCloseInfo',
            method : "POST",
            data : {data: $scope.dayClose},
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(function(response) {
        	commonService.ajsToast(response.data.message);
        	if(response.data.status == "success"){
	        	$scope.dayClose.status.id = 1;
	        	$scope.dayClose.status.name = "In-Progress";
        	}
            //$scope.clearDayCloseInfo();
        }, function(response) {
        });
	}
});