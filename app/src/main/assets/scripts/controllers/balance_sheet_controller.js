app.controller("BalanceSheetController", function ($scope, $http, $mdDialog, $cookieStore, $filter, $location, $rootScope, commonService, UI_BALANCE_SHEET, singleObjService) {
	$scope.user = $cookieStore.get("user");
	$scope.store = $cookieStore.get("store");
	
	$rootScope.pageTitle = "BALANCE SHEET";
	
	$scope.UI_BALANCE_SHEET = UI_BALANCE_SHEET;
	
	$scope.months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
	$scope.days = [31,28,31,30,31,30,31,31,30,31,30,31];
	
	$scope.difference = 0;
	
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
	
	$scope.paymentTypes = {};
	
	$scope.getBalanceSheet = function(dateFrom, dateTo){
		$http.get($rootScope.baseUrl+'action=getBalanceSheet&date_from='+dateFrom+'&date_to='+dateTo+'&store_id='+$scope.store.storeId+'&user_id='+$scope.user.userId).success(function(data) {
		      $scope.balanceSheet = data.result.balSheet;

		      $scope.creditAmount = data.result.creditAmount;
		      $scope.debitAmount = data.result.debitAmount;
		      
		      /*for(var i=0;i<$scope.balanceSheet.length;i++){
		    	  var paymentTypes = $scope.balanceSheet[i].paymentTypes;
		    	  for(var j=0;j<paymentTypes.length;j++){
		    		  if($scope.paymentTypes[paymentTypes[j].paymentTypeName]){
		    			  if($scope.balanceSheet[i].amount > 0)
		    				  $scope.paymentTypes[paymentTypes[j].paymentTypeName]["creditAmount"] += paymentTypes[j].amount;
		    			  else
		    				  $scope.paymentTypes[paymentTypes[j].paymentTypeName]["debitAmount"] += paymentTypes[j].amount;
		    		  }
		    		  else{
	    				  $scope.paymentTypes[paymentTypes[j].paymentTypeName] = {};
		    			  if($scope.balanceSheet[i].amount > 0)
		    				  $scope.paymentTypes[paymentTypes[j].paymentTypeName]["creditAmount"] = paymentTypes[j].amount;
		    			  else
		    				  $scope.paymentTypes[paymentTypes[j].paymentTypeName]["debitAmount"] = paymentTypes[j].amount;
		    		  }
		    	  }
		      }
		      
		      console.log("Payment types:"+JSON.stringify($scope.paymentTypes));*/
		      
		      $scope.difference = $scope.creditAmount + $scope.debitAmount;
		      if($scope.difference > 0){
		    	  $scope.profitLoss = UI_BALANCE_SHEET.profit;
		    	  $scope.diff = $scope.difference;
		      }
		      else{
		    	  $scope.profitLoss = UI_BALANCE_SHEET.loss;
		    	  $scope.diff = -$scope.difference;
		      }
		});
	}
	
	$scope.openPaymentTypes = function(ev,bsheet) {
		singleObjService.setObj(bsheet);        	
        $mdDialog.show({
          controller: payController,
          templateUrl: 'templates/dialogs/bal_payment_det.html',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose:true,
          fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
        })
        
        .then(function(answer) {
        	
        }, function() {
        });
    };
    
    function payController($scope,$mdDialog,singleObjService, UI_BALANCE_SHEET){
    	$scope.PAYMENT_DET = UI_BALANCE_SHEET.payment_det;
    	$scope.bsheet = singleObjService.getObj();
    	
  	    $scope.hide = function() {
  	      $mdDialog.hide();
  	    };

  	    $scope.cancel = function() {
  	      $mdDialog.cancel();
  	    };
  	    
  	    $scope.answer = function() {
  	    	$mdDialog.hide();
	    };
    }
	
	$scope.$watch('$viewContentLoaded', function(){
		$scope.filterWithDate();
	});
	
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
		$scope.getBalanceSheet(dateFromIn, dateToIn);
	}
	
	$scope.sort = function(keyname){
        $scope.sortKey = keyname;   
        $scope.reverse = !$scope.reverse; 
    }	
});