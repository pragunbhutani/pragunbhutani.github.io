var app = angular.module( 'rose', [ 'firebase' ] );

app.controller( 'mainCtrl', [ '$scope', '$firebase', 
	function( $scope, $firebase ) {

		var ref = new Firebase( 'https://rigel.firebaseIO.com/experiments/sensor1' );
		var sync = $firebase( ref );

		//download data into a local object
		var syncObject = sync.$asObject();

		//tie to a scope variable
		syncObject.$bindTo( $scope, 'firebaseData' );

	}
]);