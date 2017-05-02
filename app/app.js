'use strict';

var ipfCalc = angular.module('ipfCalc', []);

ipfCalc.directive('mtuValid', function(){
	return {
		require: 'ngModel',
		link: function(scope, elm, attrs, ctrl) {
			ctrl.$parsers.unshift(function(viewValue) {
				var value = viewValue - scope.data.headerSize;
				if(value > scope.data.headerSize){ /* MHD fixed*/
					ctrl.$setValidity('mtuValid', true);
					return viewValue;
				} else {
					ctrl.$setValidity('mtuValid', false);
					return undefined;
				}
			});
		}
	};
});

ipfCalc.controller('CalculateController', function($scope) {
	//initial values
	$scope.fragments = [];
	$scope.data = {
		dataSize: 4000, 
		mtuSize: 1500,
		headerSize: 20
	};

	//when you click "Calculate"
	$scope.calculate = function(data){
		//Initializing the data...
		$scope.fragments = [];
		var headerSize = data.headerSize;
		var remaining = data.dataSize /*- headerSize*/; /* MHD fixed*/
		var maxSize = Math.floor((data.mtuSize-data.headerSize)/8)*8; /* MHD fixed*/
		var flag = 1;
		var offset = 0;

		//While data doesn't fit the MTU...
		while(remaining > 0){
			var length = 0;
			if(maxSize < remaining){
				length = maxSize + headerSize; /* MHD fixed*/
			} else {
				length = remaining + headerSize; /* MHD fixed*/
				flag = 0;
			}

			//Create the segment
			$scope.fragments.push({
				length: length,
				flag: flag,
				offset: offset, 
			})

			//until everything has been sent.
			remaining -= length - headerSize; /* MHD fixed*/
			offset = ~~(((offset*8)+length -headerSize)/8); /* MHD fixed*/
		}
	};
});
