app.controller("SubstorePaymentController", function ($scope, $http, $cookieStore, $rootScope, $mdDialog, $filter, $location, $window, commonService, UI_TRANSACTION, singleObjService) {
	$scope.user = $cookieStore.get("user");
	$scope.store = $cookieStore.get("store");
	
	$rootScope.pageTitle = "PAYMENTS";
	
	$scope.UI_TRANSACTION = UI_TRANSACTION;	
	
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
		$scope.getSubstorePaymentInfo();
	});
	
	$scope.getInvestmentInfo = function(dateFrom, dateTo){
		$rootScope.loading = true;
		$http.get($rootScope.baseUrl+'action=getTransactionHomeData&date_from='+dateFrom+'&date_to='+dateTo+'&store_id='+$scope.store.storeId+'&user_id='+$scope.ownerType+'&role_id=0').success(function(data) {
			$scope.infos = data.result;
		    $rootScope.loading = false;
		});
	}
	
	$scope.getSubstorePaymentInfo = function(){
		$rootScope.loading = true;
		$http.get($rootScope.baseUrl+'action=getStorePaymentInfo&user_id='+$scope.user.userId).success(function(data) {
			$scope.paymentInfos = data.result;
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
		$scope.getInvestmentInfo(dateFromIn, dateToIn);
	}
	
	$scope.openAddInvestDialog = function(ev) {
		singleObjService.setObj(null);        	
        $mdDialog.show({
          controller: addController,
          templateUrl: 'templates/dialogs/payment_add.html',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose:true,
          fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
        })
        
        .then(function(answer) {
        	if(singleObjService.getObj()!=null){
        		$scope.infos.push(singleObjService.getObj());
        	}
        }, function() {
        });
    };
    
    function addController($rootScope, $scope, $mdDialog, singleObjService, commonService, UI_TRANSACTION){
    	$scope.ADD_PAYMENT = UI_TRANSACTION.add_payment;
		var status = {};
		status.id = 1;
		$scope.user = $rootScope.user;
		$scope.store = $rootScope.store;
		
		$http.get($rootScope.baseUrl+'action=getUsers&role_id=1,2&store_id='+$scope.store.storeId).success(function(data) {
			$scope.receivers = data.result;
		});
		
		$scope.investment = {};
		$scope.investment.user = $scope.user;
		$scope.investment.storeId = $scope.store.storeId;
		$scope.investment.status = status;
		
		$scope.date = new Date();
		
		$scope.addInvestmentInfo = function(){
			if(($scope.investment.receiver == null) || ($scope.investment.receiver == "")){
				$scope.resMsg = "Plz choose receiver";
				return;
			}
			var paymentTypes = [];
			var paymentType = {};
			paymentType.paymentTypeId = 1;
			paymentType.amount = $scope.investment.amount;
			paymentTypes.push(paymentType);
			
			$scope.investment.date = $filter('date')($scope.date,'yyyy-MM-dd');
			$scope.investment.storeId = $scope.store.storeId; 
			$scope.investment.paymentTypes = paymentTypes;
	  	  	$http({
	            url : $rootScope.baseUrl+'action=addTransactionInfo',
	            method : "POST",
	            data : {data: $scope.investment},
	            headers: {
	                'Content-Type': 'application/json'
	            }
	        }).then(function(response) {
	        	singleObjService.setObj($scope.investment);
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
  	    	$scope.addInvestmentInfo();
	    };
    }
	
	$scope.sort = function(keyname){
        $scope.sortKey = keyname;   
        $scope.reverse = !$scope.reverse; 
    }
});