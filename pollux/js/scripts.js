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
  var imagePath = 'url(assets/img/bg/' + images[ Math.floor( Math.random() * images.length ) ] + ")";
  $("#bg-container").css("background-image", imagePath);

  var pageVariant = Math.floor( Math.random() * 3 );
  var userLang = navigator.language.indexOf("en") > -1 ? "en" : "fr";

  var variantName = "";

  switch (pageVariant) {
    case 0:
      variantName = "social-share";
      break;
    case 1:
      variantName = "save-pins";
      break;
    case 2:
      variantName = "discover-city";
      break;
  }

  var headingVariations = {
    "fr": [
      "Partage les lieux que tu aimes",
      "Crée ta propre carte de ta ville",
      "Explore de nouveaux endroits dans ta ville"
    ],
    "en": [
      "Share the places you like",
      "Make your own map of the city",
      "Flanr helps you discover new places"
    ]
  }

  var copyVariations = {
    "fr": [
      "Rencontre des personnes inspirantes, exprime-toi à travers les lieux que tu découvres "
        + "et permet aux autres de les découvrir à leur tour.",
      "Crée-toi un répertoire de ta villa, en enregistrant les lieux que tu découvres en moins "
        + "de temps qu’il te faut pour penser «ce lieu a vraiment l’air top».",
      "Découvre de nouveaux lieux de ta ville avec les suggestions de Flanr, élaborées "
        + "spécifiquement pour toi en fonction de tes goûts, ce que tu cherches et les "
        + "tendances du moment !"
    ],
    "en": [
      "Connect with people who inspire you, express yourself through your discoveries and "
        + "let other discover yours.",
      "Save the places you discover as easily as you think “this place looks very cool” "
        + "and never forget about your discoveries.",
      "Discover new places in your city with our suggestions, based on what you like and "
        + "the fancy places of the moment."
    ]
  }

  $(".feature-heading").text(headingVariations[userLang][pageVariant]);
  $(".main-copy").text(copyVariations[userLang][pageVariant]);

  /*
   * Page Events
   */

  $(".download-btn").click(function(e) {
    console.log({
      'event': 'download-btn-click',
      'properties': {
        'variantName': variantName,
        'userLang': userLang,
        'btn-type': $(e.target).attr('id')
      }
    });
  });

  $(".logo-main").click(function(e) {
    var elementList = [
      $(".header"),
      $(".header .logo"),
      $(".features-cta")
    ];
    for (i = 0; i < elementList.length; i++) {
      elementList[i].toggleClass("light");
    }
  });

});