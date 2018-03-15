app.controller("DayCloseInfoController", function ($scope, $http, $cookieStore, $rootScope, $mdDialog, $filter, $location, $window, commonService, UI_DAY_CLOSE_INFO, singleObjService) {
	$scope.user = $cookieStore.get("user");
	$scope.store = $cookieStore.get("store");
	
	$rootScope.pageTitle = "DAY CLOSE INFO";
	
	$scope.UI_DAY_CLOSE_INFO = UI_DAY_CLOSE_INFO;
	
	$scope.ownerType = $scope.user.userId;
	
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
	
	$scope.fromDay = 1;
	
	$scope.fromMonth = $scope.month;
	
	$scope.fromYear = $scope.year;
	
	$scope.toDay = $scope.days[$scope.month-1];
	
	$scope.toMonth = $scope.month;
	
	$scope.toYear = $scope.year;
	
	$scope.filterBy = "month";
	
	$scope.filterType = function(){
		if($scope.filterBy == "day"){
			$scope.clickDay();
		}
		else if($scope.filterBy == "month"){
			$scope.clickMonth();	
		}
		else if($scope.filterBy == "year"){
			$scope.clickYear();
		}
		else if($scope.filterBy == "today"){
			$scope.clickToday();
		}
	}
	
	$scope.clickDay = function(){
		$scope.day = 1;
		$scope.fromDay = $scope.day;
		$scope.toDay = $scope.day;
		$scope.filterWithDate();
	}
	
	$scope.clickToday = function(){
		$scope.day = $scope.presentDay;
		$scope.month = $scope.presentMonth;
		$scope.year = $scope.presentYear;
		
		$scope.fromDay = $scope.day;
		
		$scope.fromMonth = $scope.month;
		
		$scope.fromYear = $scope.year;
		
		$scope.toDay = $scope.day;
		
		$scope.toMonth = $scope.month;
		
		$scope.toYear = $scope.year;
		$scope.filterWithDate();
	}
	
	$scope.clickMonth = function(){
		$scope.fromDay = 1;
		$scope.toDay = $scope.days[$scope.month-1];
		$scope.fromMonth = $scope.month;
		$scope.toMonth = $scope.month;
		$scope.filterWithDate();
	}
	
	$scope.clickYear = function(){
		$scope.fromMonth = 1;
		$scope.toMonth = $scope.months.length-1;
		$scope.fromDay = 1;
		$scope.toDay = $scope.days[$scope.month-1];
		$scope.filterWithDate();
	}
	
	$scope.previous = function(){
		if(($scope.filterBy == "day") || ($scope.filterBy == "today")){
			$scope.filterByDay("prev");
		}
		else if($scope.filterBy == "month"){
			$scope.filterByMonth("prev");
		}
		else if($scope.filterBy == "year"){
			$scope.filterByYear("prev");
		}
		$scope.filterWithDate();
	}
	
	$scope.next = function(){
		if(($scope.filterBy == "day") || ($scope.filterBy == "today")){
			$scope.filterByDay("next");
		}
		else if($scope.filterBy == "month"){
			$scope.filterByMonth("next");
		}
		else if($scope.filterBy == "year"){
			$scope.filterByYear("next");
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
		$scope.toDay = $scope.day;
		$scope.fromMonth = $scope.month;
		$scope.toMonth = $scope.month;
		$scope.toYear = $scope.year;
		$scope.fromYear = $scope.year;
	}
	
	$scope.filterByMonth = function(dir){
		if(dir == "prev"){
			$scope.month = $scope.month - 1;
			if($scope.month == 0){
				$scope.month = $scope.months.length;
				$scope.year = $scope.year - 1;
			}
		}
		else if(dir == "next"){
			$scope.month = $scope.month + 1;
			if($scope.month > $scope.months.length){
				$scope.month = 1;
				$scope.year = $scope.year + 1;
			}
		}

		$scope.fromMonth = $scope.month;
		$scope.toMonth = $scope.month;
		
		$scope.fromDay = "1";
		$scope.toDay = $scope.days[$scope.month-1];
		
		$scope.toYear = $scope.year;
		$scope.fromYear = $scope.year;
	}
	
	$scope.filterByYear = function(dir){
		if(dir == "prev"){
			$scope.year = $scope.year - 1;
		}
		else if(dir == "next"){
			$scope.year = $scope.year + 1; 
		}

		$scope.fromYear = $scope.year;
		$scope.toYear = $scope.year;
		
		$scope.fromMonth = "1";
		$scope.toMonth = $scope.months.length;
	};
	
	$scope.dateFrom= new Date();
	$scope.dateTo= new Date();
	
	$scope.$watch('$viewContentLoaded', function(){
		$scope.filterWithDate();
	});
	
	$scope.getDayCloseInfo = function(dateFrom, dateTo){
		$rootScope.loading = true;
		$http.get($rootScope.baseUrl+'action=getDayCloseInfoHomeData&date_from='+dateFrom+'&date_to='+dateTo+'&store_id='+$scope.store.storeId+'&user_id='+$scope.ownerType).success(function(data) {
			$scope.infos = data.result.dayCloseInfo;
			$scope.userDayCloseInfos = data.result.userDayCloseInfo;
			
			for(var i=0;i<$scope.infos.length;i++){
				var info = $scope.infos[i];
				var disturbance = 0;
				disturbance = disturbance + info.creditAmount;
				disturbance = disturbance + info.prevCounterCash;
				disturbance = disturbance - info.debitAmount;
				for(var j=0;j<info.paymentTypes.length;j++){
					disturbance = disturbance - info.paymentTypes[j].amount;
				}
				disturbance = disturbance - info.counterCash;
				$scope.infos[i].disturbance = disturbance;
			}
		    $rootScope.loading = false;
		});
	}
	
	$scope.filterWithDate = function(){
		var dateFromIn;
		var dateToIn;
		
		if($scope.filterBy != "custom"){
			dateFromIn = $scope.fromYear+ "-" + $scope.fromMonth + "-" + $scope.fromDay;
			dateToIn = $scope.toYear + "-" + $scope.toMonth+ "-"+ $scope.toDay;
		}
		else{
			dateFromIn = $filter('date')($scope.dateFrom,'yyyy-MM-dd');
			dateToIn = $filter('date')($scope.dateTo, "yyyy-MM-dd");
		}
		$scope.getDayCloseInfo(dateFromIn, dateToIn);
	}
    
    $scope.openDayCloseInfo = function(ev,info) {
		singleObjService.setObj(info);        	
        $mdDialog.show({
          controller: infoController,
          templateUrl: 'templates/dialogs/day_close_info.html',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose:true,
          fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
        })
        
        .then(function(answer) {
        }, function() {
        });
    };
    
    function infoController($rootScope, $scope, $mdDialog, singleObjService, commonService, UI_DAY_CLOSE_INFO){
    	$scope.DAY_CLOSE_INFO = UI_DAY_CLOSE_INFO.day_close_info;
    	$scope.info = singleObjService.getObj();
		$scope.user = $rootScope.user;
		$scope.acceptPayment = function(){
			$http({
	            url : $rootScope.baseUrl+'action=dayCloseAccept&store_id='+$rootScope.store.storeId+'&user_id='+$scope.user.userId+'&status_id=2',
	            method : "POST",
	            data : {data: $scope.info},
	            headers: {
	                'Content-Type': 'application/json'
	            }
	        }).then(function(response) {
	        	$scope.info.status.id = 2;
	        	$scope.info.status.name = "Accepted";
	        	commonService.ajsToast(response.data.message);
	  	    	$mdDialog.hide();
	        }, function(response) {
	        });
		}
    	
  	    $scope.hide = function() {
  	      $mdDialog.hide();
  	    };

  	    $scope.cancel = function() {
  	      $mdDialog.cancel();
  	    };
  	    
  	    $scope.answer = function() {
  	    	$scope.acceptPayment();
	    };
    }
	
	$scope.sort = function(keyname){
        $scope.sortKey = keyname;   
        $scope.reverse = !$scope.reverse; 
    }
});