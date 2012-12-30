$(function() {

  function slide_to_unlock_reach() {
    return $('.slider').offset().left + $('.well').width() - ($('.slider').offset().left - $('.well').offset().left + 60);
  }

  inicial_os = $('.slider').offset();

// Modified from http://reader-download.googlecode.com/svn/trunk/jquery-draggable/index.html
  $.fn.drags = function(opt) {

    opt = $.extend({handle: "", cursor: "move"}, opt);

    if (opt.handle === "") {
	 var $el = this;
    } else {
	 var $el = this.find(opt.handle);
    }

    happy = false;
    var $well = $('.well');


    console.info(inicial_os);

    return $el.css('cursor', opt.cursor)
		  .on("mousedown", function(e) {
	 if (opt.handle === "") {
	   var $drag = $(this).addClass('draggable');
	 } else {
	   var $drag = $(this).addClass('active-handle').parent().addClass('draggable');
	 }
	 var z_idx = $drag.css('z-index'),
		    drg_h = $drag.outerHeight(),
		    drg_w = $drag.outerWidth(),
		    pos_y = $drag.offset().top + drg_h - e.pageY,
		    pos_x = $drag.offset().left + drg_w - e.pageX;
	 $drag.css('z-index', 1000).parents().on("mousemove", function(e) {
	   var var_x = e.pageX + pos_x - drg_w
	   $('.draggable')
			 .offset({
		top: inicial_os.top,
		left: var_x
	   })
			 .on("mouseup", function(e) {
		$(this).removeClass('draggable').css('z-index', z_idx);
	   });
//	   console.info($el.offset().left);
	   if ($el.offset().left > slide_to_unlock_reach()) { // Swipe finished! (mouse still holded)
		if (!happy) {
		  $well.fadeOut();
		  $el.trigger('mouseup');
		  happy = true;
		  console.info('Happy!');
		}
	   }
	 });
	 e.preventDefault(); // disable selection
    }).on("mouseup", function() {
	 if (opt.handle === "") {
	   $(this).removeClass('draggable');
	 } else {
	   $(this).removeClass('active-handle').parent().removeClass('draggable');
	 }
	 if ($el.offset().left < slide_to_unlock_reach()) { // No reach
	   $el.animate({left: 0})
	 } else { // Reach the end of swipe (mouse up)
	   $el.animate({left: 0}).delay(2000, function() {
		happy = false;
		stored_well = $(".well").clone();
		$(".well").remove();
		$("#page-wrap").prepend(stored_well);
		$(".slider").drags();
		$(".well").fadeIn();
	   })
	 }
    });

  }

  $(".slider").drags();


//  $(".slider").draggable({
//    axis: 'x',
//    containment: 'parent',
//    drag: function(event, ui) {
//	 if (ui.position.left > 550) {
//	   $(".well").fadeOut();
//	 } else {
//	   // Apparently Safari isn't allowing partial opacity on text with background clip? Not sure.
//	   // $("h2 span").css("opacity", 100 - (ui.position.left / 5))
//	 }
//    },
//    stop: function(event, ui) {
//	 if (ui.position.left < 551) {
//	   $(this).animate({
//		left: 0
//	   })
//	 }
//    }
//  });

  // The following credit: http://www.evanblack.com/blog/touch-slide-to-unlock/

  $('.slider')[0].addEventListener('touchmove', function(event) {
    event.preventDefault();
    var el = event.target;
    var touch = event.touches[0];
    curX = touch.pageX - this.offsetLeft - 73;
    if (curX <= 0)
	 return;
    if (curX > slide_to_unlock_reach() - 100) {
	 $('.well').fadeOut();
	 $('.well').fadeIn();

    }
    el.style.webkitTransform = 'translateX(' + curX + 'px)';
  }, false);

  $('.slider')[0].addEventListener('touchend', function(event) {
    this.style.webkitTransition = '-webkit-transform 0.3s ease-in';
    this.addEventListener('webkitTransitionEnd', function(event) {
	 this.style.webkitTransition = 'none';
    }, false);
    this.style.webkitTransform = 'translateX(0px)';
  }, false);

});