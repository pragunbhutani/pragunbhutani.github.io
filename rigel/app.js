var app = angular.module( 'rose', [ 'firebase' ] );

app.controller( 'mainCtrl', [ '$scope', '$firebase', 
	function( $scope, $firebase ) {

		var ref = new Firebase( 'https://rigel.firebaseIO.com/experiments' );
		var sync = $firebase( ref );

		//download data into a local object
		var syncObject = sync.$asObject();

		//tie to a scope variable
		syncObject.$bindTo( $scope, 'firebaseData' );

		$scope.toggleSensor = function() {
			$scope.firebaseData.sensor.state = !$scope.firebaseData.sensor.state;
		};

		$scope.toggleLed = function() {
			$scope.firebaseData.led.state = !$scope.firebaseData.led.state;
		};

		$scope.controlMotor = function( value ) {
			$scope.firebaseData.motor.action = value;
		};

	}
]);