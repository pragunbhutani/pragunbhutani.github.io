(function (w, d, $, undefined) {
  'use strict'

  // Polyfill for event listeners
  var addEventListener = null;
  var removeEventListener = null;
  if ('addEventListener' in window) {
    addEventListener = function (element, type, listener) {
      element.addEventListener(type, listener, false); // always bubbling
    };

    removeEventListener = function (element, type, listener) {
      element.removeEventListener(type, listener, false); // always bubbling
    };
  } else if ('attachEvent' in window) {
    addEventListener = function (element, type, listener) {
      element.attachEvent('on' + type, listener);
    };

    removeEventListener = function (element, type, listener) {
      element.detachEvent('on' + type, listener);
    };
  } else {
    addEventListener = function (element, type, listener) {
      element['on' + type] = listener;
    };

    removeEventListener = function (element, type, listener) {
      element['on' + type] = null;
    };
  }

  /**
   * Polyfill requestAnimationFrame
   */
  var lastTime = 0;
  var vendors = ['ms', 'moz', 'webkit', 'o'];
  for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
    window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
    window.cancelAnimationFrame =
    window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame'];
  }

  if (!window.requestAnimationFrame) {
    window.requestAnimationFrame = function(callback, element) {
      var currTime = new Date().getTime();
      var timeToCall = Math.max(0, 16 - (currTime - lastTime));
      var id = window.setTimeout(function() {
        callback(currTime + timeToCall);
      }, timeToCall);
      lastTime = currTime + timeToCall;
      return id;
    };
  }

  if (!window.cancelAnimationFrame) {
    window.cancelAnimationFrame = function(id) {
      clearTimeout(id);
    };
  }

  /** Custom animate function to animate scroll position of element.
   * @author @Piotr Kujawa (piotrkujawa.dev@gmail.com)
   * @param {object} Object which contains end scroll position.
   * @param {number} Time in milliseconds.
   */
  $.fn.scrollAnimate = function(data,duration) {
    var data = data || {};
    var currentScrollTop = this.scrollTop();
    var scrollTo = data.scrollTop;
    var frameDuration,diff,step;
    var duration = duration || 400;
    var that = this[0];

    diff = currentScrollTop - scrollTo;

    var start = +new Date();
    var prev = start;
    var speed = diff / duration;
    var sum = 0;
    var result, excess;

    var loop = function () {

      var now = +new Date();

      frameDuration = now - prev;
      step = frameDuration * speed;
      prev = now;
      sum+=step;

      /* Checking last frame */
      var absSum = Math.abs(sum);
      var absDiff = Math.abs(diff);

      if (absSum > absDiff) {
        excess = absSum - absDiff;
        if (diff > 0) {
          sum = sum - excess;
        } else {
          sum = sum + excess;
        }
      }

      /* Scrolling element here */
      that.scrollTo(0, currentScrollTop - sum);
      if (now - start < duration) {
        requestAnimationFrame(loop);
      }
    };
    loop();
  };

  var Page = function () {
    this.addEventListeners();
    this.setItemsFiltering(null, true);
    this.onScroll();
    this.embedMarketoForms();
  };

  Page.prototype = {

    addEventListeners: function () {
      $('#hamburger').on('click', this.toggleMobileNav.bind(this));
      $('header a').on('click', this.closeMobileNav.bind(this));
      $(w).on('scroll', this.onScroll.bind(this));
      $(w).on('resize', this.onResize.bind(this));
      $('#items-filter').on('change', this.setItemsFiltering.bind(this));
      $(w).on('popstate', this.setItemsFiltering.bind(this, true));
      $('.video-item').on('click', this.onClickVideoItem.bind(this));
      $('.customer-video').on('click', this.onClickCustomerVideo.bind(this));
      $('#schedule-demo').on('click', this.showLightboxForm.bind(this));
      $('.sections-menu a').on('click', this.scrollToSection.bind(this));
    },

    onResize: function () {
      this.closeMobileNav();
    },

    onScroll: function () {
      var scrollPosition = $(w).scrollTop();
      if (scrollPosition > 2) {
        $('header').addClass('scrolled');
      } else {
        $('header').removeClass('scrolled');
      }
      this.setHeaderTableFixedPosition();
    },

    /*
    * Customers page
    **/
    onClickCustomerVideo: function (event) {
      var $target = $(event.currentTarget);
      var $iframe = $('#customer-video-iframe');
      var videoSrc = $target.attr('data-video');
      var $header = $('header');

      if (!videoSrc) {
        return;
      }
      var position = $iframe.offset().top;
      $(w).scrollAnimate({
        scrollTop: position - $header.height()
      }, 400);
      $iframe.attr('src', videoSrc);
    },

    /*
    * Pricing page
    **/
    setHeaderTableFixedPosition: function () {
      var mainHeaderHeight = $('header').hasClass('header-mixpanel') ? 0 : $('header').height() + parseInt($('header').css('top'), 10);
      var borderWeight = $('header').hasClass('header-mixpanel') ? 0 : 3;
      var $tableHeader = $('.fixed-table-header');

      if ($tableHeader.length < 1) {
        return;
      }
      var $table = $('#features-table');
      var tableHeaderHeight = $tableHeader.height();
      var top = $table[0].getBoundingClientRect().top;
      var $bottomEdge = $('.bottom-edge');

      var endOfTable = $bottomEdge[0].getBoundingClientRect().bottom <= mainHeaderHeight + tableHeaderHeight - 3;

      if (endOfTable) {
        $tableHeader.css('top', $bottomEdge[0].getBoundingClientRect().bottom - tableHeaderHeight + borderWeight + 'px');
      } else {
        $tableHeader.attr('style','');
      }

      if (top <= mainHeaderHeight + 20) {
        $tableHeader.addClass('show');
      } else {
        $tableHeader.removeClass('show');
      }
    },

    /*
    * Resources page
    **/
    setItemsFiltering: function (event, initialize) {
      var $filter = $('#items-filter');
      if ($filter.length < 1) {
        return;
      }

      var $itemsContainer = $('.items-container');
      var className = null;

      var classes = {
        'all-items': 'all-items',
        'use-cases': 'type-usecase',
        'product-videos': 'type-product',
        'video-testimonials': 'type-testimonials',
        'reports': 'type-reports',
        'press': 'type-press',
        'webinars': 'type-webinars'
      }
      var classesString = _.values(classes).join(' ');

      if (initialize) {
        var hash = w.location.hash.split('#')[1];
        className = classes[hash];
        if (!className) {
          return;
        }
        $itemsContainer.removeClass('all-items');
        $itemsContainer.addClass(className);
        $filter.val(className);
        $filter.selectpicker("refresh");
        return;
      }

      className = $filter.val();
      $itemsContainer.removeClass(classesString);
      $itemsContainer.addClass(className);

      var hashName = _.findKey(classes, function (value) {
        return value === className;
      });

      w.location.hash = className !== 'all-items' ? hashName : '';
    },

    onClickVideoItem: function (event) {
      var $target, $modal, $content, template, data, videoSrc, videoTitle;

      $target = $(event.currentTarget);
      videoSrc = $target.attr('data-video');
      videoTitle = $target.attr('data-video-title')


      $modal = $('#modal');
      $content = $modal.find('.modal-content');
      $content.empty();
      $modal.on('hide.bs.modal', function (e) {
        $content.empty();
      });

      template = _.template($('#template-video').html());
      data = {
        title: videoTitle || '',
        src: videoSrc || ''
      };

      if (videoSrc) {
        $content.append(template(data));
        $modal.modal('toggle');
      }
    },

    /*
    * Embed all Marketo forms automatically
    **/
    embedMarketoForms: function () {
      if (typeof MktoForms2 === 'undefined') {
        return;
      }

      var $forms = $('[data-mkto-form]');
      var id;

      $forms.each(function () {
        id = parseInt($(this).attr('data-mkto-form'), 10);
        MktoForms2.loadForm("//app-ab13.marketo.com", "138-CDN-550", id);
      });
    },

    /*
    * Mixpanel vs Amplitude
    **/
    showLightboxForm: function (event) {
      if (typeof MktoForms2 === 'undefined') {
        return;
      }
      MktoForms2.loadForm("//app-ab13.marketo.com", "138-CDN-550", 1073, function (form){MktoForms2.lightbox(form).show();});
    },

    /*
    * Hub and spoke - scroll to section
    **/
    scrollToSection: function (event) {
      var $target = $(event.currentTarget);
      var hash = $target.attr('href');
      window.location.hash = hash;
      this.scrollToAnchor(hash);
      event.preventDefault();
    },

    scrollToAnchor: function(hash) {
      var hash = hash.replace('#', '#_');
      var $element = $(hash);
      var topMargin = parseInt($('main').css('padding-top'), 10);
      var offset;

      if (!hash && $element.length < 1) {
        return;
      }

      offset = $element.offset();
      if (offset) {
        $(window).scrollAnimate({
          scrollTop: offset.top - topMargin
        }, 400);
      }
    },

    /*
    * Main navigation
    **/
    closeMobileNav: function () {
      $('.nav-wrapper').removeClass('open');
      $('html').removeClass('nav-open');
    },

    toggleMobileNav: function () {
      $('.nav-wrapper').toggleClass('open');
      $('html').toggleClass('nav-open');
    }
  }

  var page = new Page();
})(window, document, jQuery);


function initAnchor() {
    jQuery(window).scroll(function() {
      var x = jQuery(".subnav");
      if(x.length == 0) {
        return false;
      }
      x = x.offset().top + 100
      jQuery(".section-customer").each(function(index) {
        var z = jQuery(this).attr("id");
        if (x > jQuery(this).offset().top && x <= jQuery(this).offset().top + jQuery(this).outerHeight()) {
          jQuery('a[href*="' + z + '"]').parent().addClass('active');
        } else {
          jQuery('a[href*="' + z + '"]').parent().removeClass('active');
        }
      })
    })

    jQuery('a[href*="#"]:not([href="#"])').click(function () {
        if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
            var target = jQuery(this.hash);
            target = target.length ? target : jQuery('[name=' + this.hash.slice(1) + ']');
            if (target.length) {
                if(target.selector.match(/section-/)) {
                    jQuery('html, body').animate({
                        scrollTop: target.offset().top - 120
                    }, 1000);
                    jQuery(this).parent().siblings().removeClass('active');
                    jQuery(this).parent().addClass('active');
                }  else {
                    jQuery('html, body').animate({
                        scrollTop: target.offset().top
                    }, 1000);
                }

                return false;
            }
        }
    });
}

function initFixedHeader() {
    var lastScroll = jQuery(window).scrollTop();
    jQuery(window).on('scroll', function (e) {
        var win = jQuery(window),
        currentScroll = win.scrollTop(),
        body = jQuery('body'),
        header = jQuery('.banner'),
        headerHeight = header.outerHeight() - 72;
        if (currentScroll > headerHeight){
            body.addClass('subnav-sticky');
        } else {
            body.removeClass('subnav-sticky');
        }
        lastScroll = currentScroll;
    });
    jQuery(window).scroll();
}

jQuery(function(){
  initFixedHeader();
  initAnchor();
});