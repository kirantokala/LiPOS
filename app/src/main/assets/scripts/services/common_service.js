app.factory('commonService', function($mdToast) {
    var last = {
        bottom: false,
        top: true,
        left: false,
        right: true
      };

    var toastPosition = angular.extend({},last);

    function getToastPosition() {
      sanitizePosition();

      return Object.keys(toastPosition)
        .filter(function(pos) { return toastPosition[pos]; })
        .join(' ');
    };

    function sanitizePosition() {
      var current = toastPosition;

      if ( current.bottom && last.top ) current.top = false;
      if ( current.top && last.bottom ) current.bottom = false;
      if ( current.right && last.left ) current.left = false;
      if ( current.left && last.right ) current.right = false;

      last = angular.extend({},current);
    }

    function ajsToast(msg) {
      var pinTo = getToastPosition();
      var toast = $mdToast.simple()
        .textContent(msg)
        .action('X')
        .highlightAction(true)
        .highlightClass('md-accent')// Accent is used by default, this just demonstrates the usage.
        .position(pinTo);

      $mdToast.show(toast).then(function(response) {
        if ( response == 'ok' ) {
          //alert('You clicked the \'UNDO\' action.');
        }
      });
    };
    
    function andToast(msg){
    	 ANDROID.setToast(msg);
    }

    function placeOrder(order){
        ANDROID.placeItemOrderInLocalDB(order);
    }
    
    function andPrint(text){
    	//alert(text);
    	ANDROID.printBill(text);
    }
    
    function makeblur(element){
    	if((document.getElementById(element)!=undefined) && (document.getElementById(element)!=null))
    		document.getElementById(element).blur();
    }
    
    function playAudio(song) {
        var audio = new Audio('audio/'+song+".mp3");
        audio.play();
    }
    
    return {
    	andToast: andToast,
    	andPrint: andPrint,
    	makeblur: makeblur,
        ajsToast : ajsToast,
        placeOrder : placeOrder,
        playAudio : playAudio
    };
});

app.factory("singleObjService",function(){
	  var obj = {};
	  
	  var ser = {};
	  
	  ser.setObj = function(newObj) {
		  obj = newObj;
	  };

	  ser.getObj = function(){
	      return obj;
	  };
	  
	  return ser;
})