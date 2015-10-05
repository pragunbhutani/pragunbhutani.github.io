var five = require( 'johnny-five' ),
	Firebase = require( 'firebase' );

var dataRef = new Firebase( 'https://rigel.firebaseIO.com/experiments' );

var firebaseInit = function() {
	dataRef.set({
		sensor: {
			state: false,
			value: 0	
		},
		led: {
			state: false
		},
		motor: {
			action: 'stop'
		}
	});
}

var board = new five.Board();
var sensor = {},
	led = {},
	motorPin1 = {},
	motorPin2 = {};

var boardInit = function() {
	sensor = new five.Sensor({
		pin: 'A0',
		freq: '300'
	});
	led = new five.Led( 13 );
	motorPin1 = new five.Pin( 11 );
	motorPin2 = new five.Pin( 12 );
}

board.on( 'ready', function() {

	firebaseInit();
	boardInit();

	var setSensorValue = function() {
		// console.log( this.value );
		dataRef.child( 'sensor/value' ).set( this.value );
	}

	// Toggle sensor
	dataRef.child( 'sensor/state' ).on( 'value', function( data ) {
		if( !data.val() ) {
			console.log( sensor.scale( [ 0, 1000 ] ).removeListener( 'data', setSensorValue ) );
			dataRef.child( 'sensor/value' ).set( 0 );
		}
		if( data.val() ) {
			sensor.scale( [ 0, 1000 ] ).on( 'data', setSensorValue );			
		}
	});

	// Toggle LEDs
	dataRef.child( 'led/state' ).on( 'value', function( data ) {
		if( !data.val() ) {
			led.off();
		}
		if( data.val() ) {
			led.on();
		}
	});

	// Control motor
	dataRef.child( 'motor/action' ).on( 'value', function( data ) {
		if( data.val() == 'forward' ) {
			motorPin1.low();
			motorPin2.high();
		} else if( data.val() == 'reverse' ) {
			motorPin2.low();
			motorPin1.high();
		} else if( data.val() == 'stop' ) {
			motorPin1.low();
			motorPin2.low();
		}
	})

});