var images = [
  'appetizers.jpg',
  'beer.jpg',
  'blue-house.jpg',
  'green-tracks.jpg',
  'hedge-cars.jpg',
  'mall-fountain.jpg',
  'night-store.jpg',
  'pizza.jpg',
  'sports-field.jpg',
  'tuk-tuk.jpg',
  'veg-vendor.jpg',
];

var imagePath = 'img/bg/' + images[ Math.floor( Math.random() * images.length ) ];

document.getElementById( "bg-container" ).style.backgroundImage = "url(" + imagePath + ')';