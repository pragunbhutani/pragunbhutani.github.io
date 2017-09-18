var images = [
  'appetizers.jpg',
  'beer.jpg',
  'burger.jpg',
  'champagne.jpg',
  'pizza.jpg',
  'sunset.jpg',
  'bottles.jpg',
  'cheese.jpg',
  'cocktail.jpg',
  'smartphone.jpg'
];

var imagePath = 'img/bg/' + images[ Math.floor( Math.random() * images.length ) ];

document.getElementById( "bg-container" ).style.backgroundImage = "url(" + imagePath + ')';