app.factory('dateService', function() {
	var months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
	var days = [31,28,31,30,31,30,31,31,30,31,30,31];
	
	var df = new Date();
    var y = df.getFullYear();
    var m = df.getMonth()+1;
    var d = df.getDate();
	
	var presentDay = d;
	var presentMonth = m;
	var presentYear = y;

	var day = presentDay;
	var month = presentMonth;
	var year = presentYear;
	
	var fromDay = day;
	
	var fromMonth = month;
	
	var fromYear = year;
	
	var toDay = day;
	
	var toMonth = month;
	
	var toYear = year;
	
        return {
        	
        	filterType : function(type){
        		if(type == "day"){
        			clickDay();
        		}
        		else if(type == "month"){
        			clickMonth();	
        		}
        		else if(type == "year"){
        			clickYear();
        		}
        		else if(type == "today"){
        			clickToday();
        		}
        	},
        	
        	clickDay : function(){
        		day = 1;
        		fromDay = day;
        		$scope.toDay = day;
        		$scope.filterWithDate();
        	},
        	
        	clickToday : function(){
        		day = presentDay;
        		month = presentMonth;
        		year = presentYear;
        		
        		fromDay = day;
        		
        		fromMonth = month;
        		
        		fromYear = year;
        		
        		toDay = day;
        		
        		toMonth = month;
        		
        		toYear = year;
        		$scope.filterWithDate();
        	},
        	
        	clickMonth : function(){
        		fromDay = 1;
        		toDay = days[$scope.month-1];
        		$scope.fromMonth = $scope.month;
        		$scope.toMonth = $scope.month;
        		$scope.filterWithDate();
        	},
        	
        	clickYear : function(){
        		$scope.fromMonth = 1;
        		$scope.toMonth = $scope.months.length-1;
        		$scope.fromDay = 1;
        		$scope.toDay = $scope.days[$scope.month-1];
        		$scope.filterWithDate();
        	},
        	
        	previous : function(){
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
        	},
        	
        	next : function(){
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
        	},
        	
        	filterByDay : function(dir){
        		if(dir == "prev"){
        			$scope.day = $scope.day - 1; 
        			if($scope.day == 0 ){
        				$scope.month = $scope.month - 1; 
        				$scope.day = $scope.days[$scope.month-1];
        			}
        		}
        		else if(dir == "next"){
        			$scope.day = $scope.day + 1; 
        			if($scope.day > $scope.days[$scope.month-1]){
        				$scope.month = $scope.month + 1; 
        				$scope.day = 1;
        			}
        		}
        		$scope.fromDay = $scope.day;
        		$scope.toDay = $scope.day;
        	},
        	
        	filterByMonth : function(dir){
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
        	},
        	
        	filterByYear : function(dir){
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
        	}
        };
});