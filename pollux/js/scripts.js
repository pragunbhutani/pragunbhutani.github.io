$(document).ready(function() {

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

  $(".body-copy form").submit(function(e) {
    console.log("gotcha");
  })

});