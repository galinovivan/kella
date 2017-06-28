(function ($) {

function sliderInit() {
  // console.log('slider');

  $('#carousel').flexslider({
    animation: "slide",
    controlNav: false,
    animationLoop: false,
    slideshow: false,
    itemWidth: 80,
    itemMargin: 10,
    asNavFor: '#slider'
  });
 
  $('#slider').flexslider({
    animation: "slide",
    controlNav: false,
    animationLoop: false,
    slideshow: false,
    sync: "#carousel"
  });
  
}

$(window).load(function() {

  $('.post-gallery .flex').on('click', function() {
    console.log('click');
    setTimeout(sliderInit, 1000);
  });

  $('.mfp-arrow').on('click', function() {
    console.log('click');
    setTimeout(sliderInit, 2000);
  });

});
 
})(jQuery);
