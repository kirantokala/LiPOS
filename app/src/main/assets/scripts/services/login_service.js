app.factory('LoginService', function($rootScope,$cookieStore,$http,$location,commonService) {
        return {
        	logout : function(){
        		$cookieStore.put("user",undefined);
        		$cookieStore.put("store",undefined);
        		$http.get($rootScope.baseUrl+'action=logout').success(function(response){
        			if(response.status == "success") {
        				$rootScope.user = {};
        				$rootScope.store = {};
        	            $location.path('/');
        	            commonService.ajsToast(response.message);
        	        } else {
        	            $scope.error = response.message;
        	        }
        		});
        	}
        };
});