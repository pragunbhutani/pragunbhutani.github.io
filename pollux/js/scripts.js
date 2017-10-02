$(document).ready(function() {

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
  var imagePath = 'url(img/bg/' + images[ Math.floor( Math.random() * images.length ) ] + ")";
  $("#bg-container").css("background-image", imagePath);

  var pageVariant = Math.floor( Math.random() * 3 );

  var headingVariations = [
    "Social Media",
    "Save Places",
    "Aggregator"
  ];
  var copyVariations = [];

  $(".feature-heading").text(headingVariations[pageVariant]);

});