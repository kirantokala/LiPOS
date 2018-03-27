var app = angular.module("app", ["ngRoute",'angular-click-outside','ngMaterial', 'ngMdIcons', 'ngCookies']);

app.directive('header', function() {
  return {
    templateUrl: 'templates/include/header.html'
  };
});

app.directive('navigator', function() {
  return {
    templateUrl: 'templates/include/navigator.html'
  };
});

app.filter('roundup', function () {
    return function (value) {
        return Math.round(value);
    };
})

app.config(function($routeProvider) {
    $routeProvider
    .when("/", {
        templateUrl : "templates/login.html"
    })
    .when("/menu", {
        templateUrl : "templates/menu.html"
    })
    .when("/store", {
        templateUrl : "templates/store.html"
    })
     .when("/category", {
        templateUrl : "templates/category.html"
    })
    .when("/material", {
        templateUrl : "templates/material.html"
    })
    .when("/calendar", {
        templateUrl : "templates/calendar.html"
    })
    .when("/sales", {
        templateUrl : "templates/sales.html"
    })
    .when("/dayClose", {
        templateUrl : "templates/day_close.html"
    })
    .when("/dayCloseInfo", {
        templateUrl : "templates/day_close_info.html"
    })
    .when("/dashboard", {
        templateUrl : "templates/dashboard.html"
    })
    .when("/balanceSheet", {
        templateUrl : "templates/balance_sheet.html"
    })
    .when("/purchases", {
        templateUrl : "templates/purchase.html"
    })
    .when("/chPass", {
        templateUrl : "templates/edit_profile.html"
    })
    .when("/investment", {
        templateUrl : "templates/investment.html"
    })
    .when("/admin", {
        templateUrl : "templates/admin_panel.html"
    })
    .when("/substoreOrder", {
        templateUrl : "templates/substore_order.html"
    })
    .when("/substoreOrderMgr", {
        templateUrl : "templates/substore_order_mgr.html"
    })
    .when("/substorePayment", {
        templateUrl : "templates/substore_payment.html"
    })
    .when("/substorePaymentMgr", {
        templateUrl : "templates/substore_payment_mgr.html"
    })
    .when("/vendor", {
        templateUrl : "templates/vendor_home.html"
    })
    .when("/vendorOwr", {
        templateUrl : "templates/vendor_order_owr.html"
    })
    .when("/vendorPayment", {
        templateUrl : "templates/vendor_payment.html"
    })
    .when("/vendorPaymentStr", {
        templateUrl : "templates/vendor_payment_store.html"
    })
    .when("/kitchen", {
        templateUrl : "templates/kitchen.html"
    })
    .when("/manageUser", {
        templateUrl : "templates/manage_user.html"
    })
    .when("/manageMenu", {
        templateUrl : "templates/manage_menu.html"
    })
    .when("/manageMat", {
        templateUrl : "templates/manage_material.html"
    });
});

app.controller('AppCtrl', function ($scope, $timeout, $mdSidenav, $rootScope, $location, $http, $cookieStore,commonService, LoginService, $interval, CST_COM) {
	
	$rootScope.loading = false;
	
	$rootScope.CST_COM = CST_COM;
	
	$rootScope.user = $cookieStore.get("user");
	
	$rootScope.store = $cookieStore.get("store");
	
	$rootScope.pageTitle = "LiPOS";
	
	$rootScope.baseUrl = "http://18.221.170.127:8080/POS/pos?";
	
	//$rootScope.baseUrl = "pos?";
	
	$rootScope.colors = ["#6f3c2b","#8E44AD","#ea781a","#256053","#a53860","#cb0031"];
	
	$rootScope.closeThis = function (element) {
		commonService.makeblur(element);
    }
	
	$scope.closeNotifications = function(){
		$scope.opened = false;
	}
	
	$rootScope.header = "LiPOS";
	
	$scope.navMenu = [
	    {
	      link : '/menu',
	      title: 'Sales',
	      icon: 'shopping_basket',
	      roles: [1,2,5,6,7,8]
	    },
	    {
	      link : '/material',
	      title: 'Expenses',
	      icon: 'add_shopping_cart',
	      roles: [1,2,5,6,7]
	    },
		{
		      link : '/substoreOrder',
		      title: 'Orders',
		      icon: 'label_outline',
		      roles: [8]
		},
		{
		      link : '/substoreOrderMgr',
		      title: 'Substore Orders',
		      icon: 'label_outline',
		      roles: [2]
		},
		{
		      link : '/substorePayment',
		      title: 'Payments',
		      icon: 'label_outline',
		      roles: [8]
		},
		{
		      link : '/substorePaymentMgr',
		      title: 'Substore Payments',
		      icon: 'label_outline',
		      roles: [2]
		},
	    {
		      link : '/dayClose',
		      title: 'Day Close',
		      icon: 'close',
		      roles: [2]
		},
	    {
		      link : '/dashboard',
		      title: 'Dashboard',
		      icon: 'dashboard',
		      roles: [1,5,6,7]
		},
	    {
	      link : '/sales',
	      title: 'Sales report',
	      icon: 'receipt',
	      roles: [1,5,6,7]
	    },
	    {
		      link : '/purchases',
		      title: 'Expenses report',
		      icon: 'receipt',
		      roles: [1,2,5,6,7]
		}, 
		{
		      link : '/vendorOwr',
		      title: 'Vendor Orders',
		      icon: 'receipt',
		      roles: [1,2,5,6,7]
		},
		{
		      link : '/vendorPaymentStr',
		      title: 'Vendor Payments',
		      icon: 'receipt',
		      roles: [1,2,5,6,7]
		},
		{
		      link : '/dayCloseInfo',
		      title: 'Dayclose info',
		      icon: 'label_outline',
		      roles: [1,5,6,7]
		},
		{
		      link : '/balanceSheet',
		      title: 'Balance Sheet',
		      icon: 'label_outline',
		      roles: [1,2,5,6,7]
		},
		{
		      link : '/kitchen',
		      title: 'Pending Orders',
		      icon: 'label_outline',
		      roles: [3]
		},
		{
		      link : '/investment',
		      title: 'Investment',
		      icon: 'remove_circle_outline',
		      roles: [1,5,6,7]
		},
		{
		      link : '/manageUser',
		      title: 'Manage user',
		      icon: 'account_circle',
		      roles: [5]
		},
		{
		      link : '/manageMenu',
		      title: 'Manage menu',
		      icon: 'account_circle',
		      roles: [1,2]
		},
		{
		      link : '/manageMat',
		      title: 'Manage material',
		      icon: 'account_circle',
		      roles: [1,2]
		}
	  ];
	
	$scope.vendor = [
	    {
	      link : '/vendor',
	      title: 'Orders',
	      icon: 'shopping_basket',
	      roles: [9]
	    },
	    {
	      link : '/vendorPayment',
	      title: 'Payments',
	      icon: 'shopping_basket',
	      roles: [9]
	    }
	];
	  
	$scope.logout = function(){
		LoginService.logout();
	}
	
	$scope.switchStore = function(){
		$cookieStore.put("store",undefined);
		$rootScope.store = {};
		$location.path('/store');
	}
	
	$scope.switchCategory = function(){
		$cookieStore.put("category",undefined);
		$rootScope.category = {};
		$location.path('/category');
	}
	
	$scope.openAdminPanel = function(){
		$location.path('/admin');
	}
	
	$scope.changePassword = function(){
		$location.path('/chPass');
	}
	
	$scope.openStoreOrders = function(){
		if($scope.user.role.roleId == $rootScope.CST_COM.roles.kitchen){
			$location.path('/kitchen');
		}
		else if($scope.user.role.roleId == $rootScope.CST_COM.roles.manager){
			$location.path('/substoreOrderMgr');
		}
	}
	
	$scope.$watch('$viewContentLoaded', function(){
		$scope.openPageWhenRefresh();
	});
	
	$scope.openPageWhenRefresh = function(){
		if(($cookieStore.get("user")!=undefined) && ($cookieStore.get("store")!=undefined)){
			if($rootScope.user.role.roleId == $rootScope.CST_COM.roles.kitchen){
				$location.path('/kitchen');
			}
			else{
				$location.path('/menu');
			}
		}
	}
	
	$scope.parcelPrice = 5;
	
	$scope.notificationCount = 0;
	
	$scope.loadNotifications = function(){
		if(($rootScope.user!=undefined) && ($rootScope.user.userId!=undefined)){
			$http.get($rootScope.baseUrl+'action=getNotifications&user_id='+$rootScope.user.userId).success(function(data) {
			      $scope.notifications = data.result.notifications;
			      $scope.notificationCount = data.result.notificationCount;
			      if($scope.notificationCount>0){
			    	  commonService.playAudio("notification");
			      }
			});
		}
	}
	
	$scope.opened = false;
	
	var theInterval = $interval(function(){
		 $scope.loadNotifications();
	   }.bind(this), 5000);    

	    $scope.$on('$destroy', function () {
	        $interval.cancel(theInterval)
	});
	    
	$scope.loadNotifications();
	
	$scope.updateNotificationsAsRead = function(){
		$http.get($rootScope.baseUrl+'action=updateNotificationsAsRead&user_id='+$rootScope.user.userId).success(function(data) {
		      $scope.status = data.status;
		});
	}
	  
	$rootScope.isObjectEmpty = function(card){
	   return Object.keys(card).length === 0;
	}
	
	$rootScope.isStrNull = function(str){
	   if((str==null) || (str=="") || (str==undefined)){
		   return true;
	   }
	   return false;
	}
	
	$rootScope.dateOnly= function(timestamp) {
	    return new Date(timestamp);
	}
    
    $scope.openSideNavPanel = function() {
        $mdSidenav('left').toggle();
        $rootScope.materialOrder = undefined;
    };
    
  });

app.config(function($mdThemingProvider) {
	var customBlueMap = $mdThemingProvider.extendPalette('light-blue', {
		'contrastDefaultColor' : 'light',
		'contrastDarkColors' : [ '50' ],
		'50' : 'ffffff'
	});
	$mdThemingProvider.definePalette('customBlue', customBlueMap);
	$mdThemingProvider.theme('default').primaryPalette('customBlue', {
		'default' : '500',
		'hue-1' : '500'
	}).accentPalette('pink');
	$mdThemingProvider.theme('input', 'default').primaryPalette('grey')
});

app.directive('appFilereader',appFileReader);