(function ($, window, _) {
	'use strict';
    
    var lastTime = 0,
        vendors = ['ms', 'moz', 'webkit', 'o'];
	
    for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame'];
    }
 
    if (!window.requestAnimationFrame) {
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); },
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
    }
 
    if (!window.cancelAnimationFrame){
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
    }
    
	var $doc = $(document),
		win = $(window),
		Modernizr = window.Modernizr,
		AnimationsArray = [],
		thb_easing = [0.25, 0.1, 0.25, 1];
		
	window.SITE = {
		init: function() {
			var self = this,
				obj;
			var content = $('#wrapper'),
				pl = content.find('>.preloader');
			
			window.thb_init = true;
			content.waitForImages(function() {
				
				TweenMax.to(pl, 1, { autoAlpha: 0, ease: Quart.easeOut, onComplete: function() { pl.css('display', 'none'); }});
				
				for (var obj in self) {
					if ( self.hasOwnProperty(obj)) {
						var _method =  self[obj];
						if ( _method.selector !== undefined && _method.init !== undefined ) {
							if ( $(_method.selector).length > 0 ) {
								_method.init();
							}
						}
					}
				}
			});
			
		},
		SmoothScroll: {
			selector: '.smooth_scroll',
			init: function() {
				smoothScroll();
			}
		},
		logoColor: {
			selector: '.header.style2, .header.style3',
			init: function() {
				var base = this,
					container = $(base.selector);
				
				container.midnight();
				
			}
		},
		headerStyle: {
			selector: '.header',
			init: function() {
				var base = this,
					container = $(base.selector);
				

				if (container.hasClass('style1')) {
					$('.header_container').height(container.outerHeight());
					win.scroll(function() {
						if (win.scrollTop() > $('#home-slider').outerHeight()) {
							container.addClass('fixed');	
						} else {
							container.removeClass('fixed');
						}	
					}).trigger('scroll');
					
					win.resize(_.debounce(function(){
						$('.header_container').height(container.outerHeight());
					}, 30));
				}
			}
		},
		menu: {
			selector: '#mobile-menu',
			init: function() {
				
				var menu2 = $('#mobile-menu.style2'),
					menu3 = $('#mobile-menu.style3'),
					items2 = menu2.find('.mobile-menu>li,.menu-footer p, .select-wrapper'),
					items3 = menu3.find('.mobile-menu>li,.menu-footer p, .select-wrapper'),
					logo = menu3.find('.logoimg'),
					toggle = $('.mobile-toggle'), 
					span = toggle.find('span'),
					tlMainNav = new TimelineLite({ 
						paused: true, 
						onStart: function() { menu2.css('display', 'block'); },
						onReverseComplete: function() { 
							menu2.css('display', 'none');
						} 
					}),
					tlMainNavStyle3 = new TimelineLite({ paused: true, onStart: function() { menu3.css('display', 'block'); }, onReverseComplete: function() { menu3.css('display', 'none'); } }),
					close = $('.panel-close'),
					links = menu2.add(menu3).find('a'),
					hh = $('.header').outerHeight(),
					ah = $('#wpadminbar').outerHeight();
				
				AnimationsArray.push(tlMainNav);
				AnimationsArray.push(tlMainNavStyle3);
				
				tlMainNav
					.add(TweenLite.to(menu2, 0.5, {autoAlpha:1, ease: Quart.easeOut}))
					.staggerFrom(items2, items2.length * 0.1, { y: "50", opacity:0, ease: Quart.easeOut}, 0.10);

				tlMainNavStyle3
					.add(TweenLite.to(menu3, 0.5, {x:0, ease: Quart.easeOut}))
					.add(TweenLite.from(logo, 0.5, {opacity:0, ease: Quart.easeOut}))
					.staggerFrom(items3, items3.length * 0.15, { x: "-100", opacity:0, ease: Quart.easeOut}, 0.10);
				
				
				toggle.on('click',function() {
					if(!toggle.data('toggled')) {
						tlMainNav.timeScale(1).restart();
						tlMainNavStyle3.timeScale(1).restart();
						toggle.data('toggled', true);
					} else {
						tlMainNav.timeScale(1.6).reverse();
						tlMainNavStyle3.timeScale(1.6).reverse();
						toggle.data('toggled', false);
					}
					return false;
				});
				
				
				close.on('click', function() {
					tlMainNav.timeScale(1.6).reverse();
					tlMainNavStyle3.timeScale(1.6).reverse();
					toggle.data('toggled', false);
					
					return false;
				});
				
				links.on('click', function(){
					var _this = $(this),
						url = _this.attr('href'),
						hash = url.indexOf("#") !== -1 ? url.substring(url.indexOf("#")+1) : '',
						pos = $('#'+hash).offset().top - $('.header').outerHeight() - $('#wpadminbar').outerHeight();
						
					if (hash) {
						tlMainNav.timeScale(2).reverse();
						tlMainNavStyle3.timeScale(2).reverse();
						toggle.data('toggled', false);
						TweenMax.to(window, win.height() / 500, {scrollTo:{y:pos}, ease:Quart.easeOut});
						return false;
					} else {
						return true;	
					}
					
				});
			}
		},
		overlay: {
			selector: '.overlay-effect .overlay',
			init: function(el) {
				var base = this,
					container = $(base.selector),
					target = el ? el.find(base.selector) : container;

				target.each(function() {
					var _this = $(this),
						overlayInner = _this.find('.child'),
						overlayHover = new TimelineLite({ paused: true });
					
					TweenLite.set(overlayInner, {opacity: 0, y:50});
					
					overlayHover
						.add(TweenLite.to(_this, 0.5, {opacity:1, ease: Quart.easeOut}))
						.add(TweenMax.staggerTo(overlayInner,0.25, { y: 0, opacity:1, ease: Quart.easeOut}, 0.05), "-=0.25");
					
					_this.hoverIntent(function() {
						overlayHover.timeScale(1).play();
					}, function() {
						overlayHover.timeScale(1.6).reverse();
					});
				});
			}
		},
		onePageScroll: {
			selector: '.full-menu, .mobile-menu',
			init: function() {
				var base = this,
					container = $(base.selector),
					links = container.find('a'),
					hh = ($('.header').hasClass('style2') || $('.header').hasClass('style3')) ? 0 : $('.header').outerHeight(),
					ah = $('#wpadminbar').outerHeight();
					
				links.on('click', function(){
					var _this = $(this),
						url = _this.attr('href'),
						hash = url.indexOf("#") !== -1 ? url.substring(url.indexOf("#")+1) : '',
						pos = $('#'+hash).offset().top - hh - ah;
						
					if (hash) {
						TweenMax.to(window, win.height() / 500, {scrollTo:{y:pos}, ease:Quart.easeOut});
						return false;
					} else {
						return true;	
					}
					
				});
					
			}
		},
		fullHeightContent: {
			selector: '.full-height-content',
			init: function() {
				var base = this,
					container = $(base.selector);
				
				base.control(container);
				
				win.resize(_.debounce(function(){
					base.control(container);
				}, 50));
				
			},
			control: function(container) {
				var h = $('.header'),
					a = $('#wpadminbar'),
					ah = (a ? a.outerHeight() : 0);

				container.each(function() {
					var _this = $(this),
						height = win.height() - h.outerHeight() - ah;
						
					_this.css('min-height',height);
					
				});
			}
		},
		carousel: {
			selector: '.owl',
			init: function() {
				var base = this,
					container = $(base.selector);
				
				container.each(function() {
					var that = $(this),
						columns = that.data('columns'),
						center = (that.data('center') === true ? true : false),
						navigation = (that.data('navigation') === true ? true : false),
						autoplay = (that.data('autoplay') === false ? false : true),
						pagination = (that.data('pagination') === true ? true : false),
						autowidth = (that.data('autowidth') === true ? true : false),
						bgcheck = (that.data('bgcheck') ? that.data('bgcheck') : false),
						loop = (that.data('autowidth') === true ? false : true);
					
					var args = {
						//Basic Speeds
						slideSpeed : 1000,
						paginationSpeed : 1000,
						rewindSpeed : 1000,
						
						//Autoplay
						autoPlay : autoplay,
						goToFirst : true,
						stopOnHover: true,
						
						// Navigation
						navigation : navigation,
						navigationText : ['',''],
						pagination : pagination,
						paginationNumbers: false,
						
						// Responsive
						responsive: true,
						items : columns,
						itemsDesktop: false,
						itemsDesktopSmall : [980,(columns < 3 ? columns : 3)],
						itemsTablet: [768,(columns < 2 ? columns : 2)],
						itemsMobile : [479,1],
						itemsScaleUp : false,
					};
					if (that.data('owlCarousel')) {
						that.data('owlCarousel').reinit(args);
					} else {
						that.owlCarousel(args);
					}
					
				});
			}
		},
		toggle: {
			selector: '.toggle .title',
			init: function() {
				var base = this,
				container = $(base.selector);
				container.each(function() {
					var that = $(this);
					that.on('click', function() {
					
						if (that.hasClass('toggled')) {
							that.removeClass("toggled").closest('.toggle').find('.inner').slideUp(200);
						} else {
							that.addClass("toggled").closest('.toggle').find('.inner').slideDown(200);
						}
						
					});
				});
			}
		},
		masonry: {
			selector: '.masonry',
			init: function() {
				var base = this,
				container = $(base.selector);
								
				container.each(function() {
					var that = $(this),
						el = that.children('.item'),
						loadmore = $(that.data('loadmore')),
						filter = $(that.data('filters')),
						toggle = filter.find('.thb_toggle'),
						hr = filter.find('hr'),
						filters = filter.find('.filters'),
						select = filter.find('.filter-select'),
						org = [],
						page = 1;
					
					TweenLite.set(el, {opacity: 0, y:100});
					that.imagesLoaded(function() {
						that.isotope({
							itemSelector : '.item',
							transitionDuration : 0,
							masonry: {
								columnWidth: '.grid-sizer'
							}
						}).isotope( 'once', 'layoutComplete', function(i,l) {
							org = _.pluck(l, 'element');
						});
						that.isotope('layout');
						win.scroll(_.debounce(function(){
							if (that.is(':in-viewport')) {
								TweenMax.staggerTo(org, 1, { y: 0, opacity:1, ease: Quart.easeOut }, 0.25);
							}
						}, 50)).trigger('scroll');
						
						loadmore.on('click', function(){
							var text = loadmore.text(),
								type = loadmore.data('type'),
								loading = loadmore.data('loading'),
								nomore = loadmore.data('nomore'),
								initial = loadmore.data('initial'),
								categories = loadmore.data('categories'),
								count = loadmore.data('count'),
								style = loadmore.data('style'),
								information = loadmore.data('information'),
								columns = loadmore.data('columns');
							
							loadmore.text(loading).addClass('loading');
							
							$.post( themeajax.url, { 
							
									action: 'thb_ajax',
									count : count,
									type : type,
									initial : initial,
									style : style,
									information : information,
									columns : columns,
									categories : categories,
									page : page++
									
							}, function(data){
								
								var d = $.parseHTML($.trim(data)),
									l = d ? d.length : 0;
									
								if( data === '' || data === 'undefined' || data === 'No More Posts' || data === 'No $args array created') {
									data = '';
									loadmore.text(nomore).removeClass('loading').off('click').on('click', function() {
										return false;
									});
								} else {
									$(d).appendTo(that).hide().imagesLoaded(function() {
										$(d).show();
										that.isotope( 'appended', $(d) );
										that.isotope('layout');
										TweenMax.set($(d), {opacity: 0, y:100});
										TweenMax.staggerTo($(d), l*0.25, { y: 0, opacity:1, ease: Quart.easeOut, onComplete: window.SITE.overlay.init($(d))}, 0.25);
									});
									
									if (l < count){
										loadmore.text(nomore).removeClass('loading');
									} else {
										loadmore.text(text).removeClass('loading');
									}
								}
								
							});
							return false;
						});
					});
					
					if (filter.length) {
						var li = filters.find('li'),
							li_l = li.length,
							a = filters.find('a:not(.thb_toggle)'),
							tl = new TimelineMax({paused:true});
							
						tl
							.to(toggle, 0, { className:"+=active", ease:Quart.easeOut})
							.to(hr, 0.7, { scaleX: "1", borderTopColor: "#f0f0f0", ease:Quart.easeOut})
							.to(filters, 0.25, { autoAlpha:"1", height:"50", ease:Quart.easeOut})
							.staggerFromTo(li, (0.1 * li_l), { x: 50, opacity:0, ease: Quart.easeOut},{ x: 0, opacity:1, ease: Quart.easeOut}, 0.07);
						
						toggle.on('click',function(){
							if(!toggle.data('toggled')) {
								tl.timeScale(1).restart();
								toggle.data('toggled', true);
							} else {
								tl.timeScale(1.2).reverse();
								toggle.data('toggled', false);
							}
							return false;
						});
						
						select.on('change', function() {
							var _this = $(this),
								selector = _this.val();
								
							that.isotope( 'once', 'layoutComplete',function(x,y) {
								var iso_in = _.pluck(y, 'element'),
									iso_out = _.difference(_.pluck(x.items, 'element'), iso_in),
									iso_ani = new TimelineMax();
								
								TweenLite.set(iso_in, {opacity: 0, y:100});
								
								iso_ani
									.staggerTo(iso_out, (0.1 * iso_out.length), { y: 100, autoAlpha:0, ease: Quart.easeOut }, 0.1, false, function() {
										TweenMax.set(iso_out,{display:'none'});
									})
									.staggerTo(iso_in, (0.1 * iso_in.length), { y: 0, autoAlpha:1, ease: Quart.easeOut }, 0.1);
									
								
							});
							that.isotope({ filter: selector });
						});
						a.on('click',function(){
							var _this = $(this),
								selector = _this.attr('data-filter');
								a.removeClass('active');
								_this.addClass('active');
							
							that.isotope( 'once', 'layoutComplete',function(x,y) {
								var iso_in = _.pluck(y, 'element'),
									iso_out = _.difference(_.pluck(x.items, 'element'), iso_in),
									iso_ani = new TimelineMax();
								
								TweenLite.set(iso_in, {opacity: 0, y:100});
								
								iso_ani
									.staggerTo(iso_out, (0.1 * iso_out.length), { y: 100, autoAlpha:0, ease: Quart.easeOut }, 0.1, false, function() {
										TweenMax.set(iso_out,{display:'none'});
									})
									.staggerTo(iso_in, (0.1 * iso_in.length), { y: 0, autoAlpha:1, ease: Quart.easeOut }, 0.1);
									
								
							});
							that.isotope({ filter: selector });
							
							return false;
						});
					}
				});
			}
		},
		portfolioLightbox: {
			selector: '.thb-portfolio',
			init: function() {
				var base = this,
					container = $(base.selector),
					wrapper = $('#wrapper'),
					ap = $('#ajax-placeholder'),
					el = document.getElementById('ajax-placeholder');
				
				container.magnificPopup({
					delegate: '.portfolio:visible a',
					closeMarkup:'<nav class="portfolio-header only-portfolio"><div class="row"><div class="small-12 columns text-center"><span class="prev"></span><button title="%title%" class="mfp-close"></button><span class="next"></span></div></nav>', 
					closeBtnInside: false, 
					closeOnBgClick: false,
					type: 'ajax',
					fixedContentPos:false,
					alignTop: true,
					mainClass: 'mfp-fade mfp-portfolio',
					midClick: true,
					gallery: {
						enabled: true, 
						preload: [0,2], 
						navigateByImgClick: true
					},
					callbacks: {
						parseAjax: function(mfpResponse) {
							ap.html(mfpResponse.data);
							
							mfpResponse.data = ($(mfpResponse.data).find('.portfolio-post')).add(ap.find('[data-type="vc_shortcodes-custom-css"]')).add(ap.find('[data-type="vc_custom-css"]'));
							
							ap.html('');
						},
						change: function() {
						},
						ajaxContentAdded: function() {
							
							win.scrollTop(0);
							
							window.SITE.carousel.init();
							window.SITE.shareThisArticle.init();
							window.SITE.parallax_bg.refresh();
							window.SITE.animation.init();
							window.SITE.equalHeights.init();
							window.SITE.fullHeightContent.init();
						},
						open: function() {
							if($('.portfolio:visible a').length > 1){
								$('.portfolio-header.only-portfolio .prev').html(this.arrowLeft);
								$('.portfolio-header.only-portfolio .next').html(this.arrowRight);
							}
							wrapper.addClass('hide');
							$('.mfp-wrap').css('top','0');
							$('.mfp-bg').css('height','auto');
						},
						close: function() {
							wrapper.removeClass('hide');
							window.SITE.parallax_bg.refresh();
							window.SITE.contact.init();
							window.SITE.carousel.init();
							window.SITE.equalHeights.init();
						},
						afterClose: function() {
							
						}
					}
				});
	
			}
		},
		teamMember: {
			selector: '.team_member',
			init: function() {
				var base = this,
					container = $(base.selector),
					wrapper = $('#wrapper');
				
				container.magnificPopup({
					closeMarkup:'<nav class="portfolio-header team-member-header"><div class="row"><div class="small-12 columns text-center"><span class="prev"></span><button title="%title%" class="mfp-close mfp-team-close"></button><span class="next"></span></div></nav>', 
					closeBtnInside: false, 
					closeOnBgClick: false,
					type: 'ajax',
					fixedContentPos:false,
					mainClass: 'mfp-fade mfp-portfolio mfp-teammember',
					midClick: true,
					alignTop: true,
					gallery: {
						enabled: true, 
						preload: [0,2], 
						navigateByImgClick: true,
					},
					callbacks: {
						parseAjax: function(mfpResponse) {
							mfpResponse.data = $(mfpResponse.data).find('.team-member-post');
						},
						change: function() {
						},
						ajaxContentAdded: function() {
							win.scrollTop(0);
							
							window.SITE.carousel.init();
							window.SITE.shareThisArticle.init();
							window.SITE.parallax_bg.refresh();
							window.SITE.animation.init();
							window.SITE.equalHeights.init();
							window.SITE.fullHeightContent.init();
							
						},
						open: function() {
							if($('.team_member').length > 1){
								$('.portfolio-header.team-member-header .prev').html(this.arrowLeft);
								$('.portfolio-header.team-member-header .next').html(this.arrowRight);
							}
							wrapper.addClass('hide');
							$('.mfp-wrap').css('top','0');
							$('.mfp-bg').css('height','auto');
						},
						close: function() {
							wrapper.removeClass('hide');
							window.SITE.parallax_bg.refresh();
							window.SITE.contact.init();
							window.SITE.carousel.init();
							window.SITE.equalHeights.init();
						},
						afterClose: function() {
							
						}
					}
				});
	
			}
		},
		shareThisArticle: {
			selector: '.share-post-link',
			init: function() {
				var base = this,
					container = $(base.selector),
					fb = container.data('fb'),
					tw = container.data('tw'),
					pi = container.data('pi'),
					li  = container.data('li'),
					gp  = container.data('gp'),
					boxed  = (container.data('boxed') ? 'boxed-icon ' : ''),
					temp = '';
				
				if (fb) {
					temp += '<a href="#" class="'+boxed+'facebook"><i class="fa fa-facebook"></i></a> ';
				}
				if (tw) {
					temp += '<a href="#" class="'+boxed+'twitter"><i class="fa fa-twitter"></i></a> ';
				}
				if (pi) {
					temp += '<a href="#" class="'+boxed+'pinterest"><i class="fa fa-pinterest"></i></a> ';
				}
				if (li) {
					temp += '<a href="#" class="'+boxed+'linkedin"><i class="fa fa-linkedin"></i></a> ';
				}
				if (gp) {
					temp += '<a href="#" class="'+boxed+'google-plus"><i class="fa fa-google-plus"></i></a> ';
				}
				container.find('.placeholder').sharrre({
					share: {
						facebook: fb,
						twitter: tw,
						pinterest: pi,
						linkedin: li
					},
					buttons: {
						pinterest: {
							media: container.find(".placeholder").data("media")
						}
					},
					urlCurl: $('body').data('sharrreurl'),
					template: temp,
					enableHover: false,
					enableTracking: false,
					render: function(api){
						$(api.element).on('click', '.twitter', function() {
							api.openPopup('twitter');
						});
						$(api.element).on('click', '.facebook', function() {
							api.openPopup('facebook');
						});
						$(api.element).on('click', '.pinterest', function() {
							api.openPopup('pinterest');
						});
						$(api.element).on('click', '.linkedin', function() {
							api.openPopup('linkedin');
						});
						$(api.element).on('click', '.google-plus', function() {
							api.openPopup('googlePlus');
						});
					}
				});
			}
		},
		parallax_bg: {
			selector: 'body',
			init: function() {
				var base = this,
					container = $(base.selector);
				if(!Modernizr.touch){ 
					$.stellar({
						horizontalScrolling: false,
						verticalOffset: 40,
						responsive: true
					});
				}
			},
			refresh: function() {
				if(!Modernizr.touch){ 
					$.stellar('refresh');
				}
			}
		},
		magnificImage: {
			selector: '[rel="magnific"], .wp-caption a',
			init: function() {
				var base = this,
						container = $(base.selector),
						stype;
				
				container.each(function() {
					if ($(this).hasClass('video')) {
						stype = 'iframe';
					} else {
						stype = 'image';
					}
					$(this).magnificPopup({
						type: stype,
						closeOnContentClick: true,
						fixedContentPos: true,
						closeBtnInside: false,
						closeMarkup: '<button title="%title%" class="mfp-close"></button>',
						mainClass: 'mfp',
						removalDelay: 250,
						overflowY: 'scroll',
						image: {
							verticalFit: false
						}
					});
				});
	
			}
		},
		magnificInline: {
			selector: '[rel="inline"]',
			init: function() {
				var base = this,
						container = $(base.selector);
				
				container.each(function() {
					var eclass = ($(this).data('class') ? $(this).data('class') : '');

					$(this).magnificPopup({
						type:'inline',
						midClick: true,
						mainClass: 'mfp ' + eclass,
						removalDelay: 250,
						closeBtnInside: true,
						overflowY: 'scroll',
						closeMarkup: '<button title="%title%" class="mfp-close"></button>'
					});
				});
	
			}
		},
		magnificGallery: {
			selector: '[rel="gallery"]',
			init: function() {
				var base = this,
						container = $(base.selector);
				
				container.each(function() {
					$(this).magnificPopup({
						delegate: 'a',
						type: 'image',
						closeOnContentClick: true,
						fixedContentPos: true,
						mainClass: 'mfp',
						removalDelay: 250,
						closeBtnInside: false,
						overflowY: 'scroll',
						gallery: {
							enabled: true,
							navigateByImgClick: false,
							preload: [0,1] // Will preload 0 - before current, and 1 after the current image
						},
						image: {
							verticalFit: false,
							titleSrc: function(item) {
								return item.el.attr('title');
							}
						}
					});
				});
				
			}
		},
		parsley: {
			selector: '.comment-form, .wpcf7-form',
			init: function() {
				var base = this,
						container = $(base.selector);
				
				if ($.fn.parsley) {
					container.parsley();
				}
			}
		},
		contact: {
			selector: '.google_map',
			init: function() {
				var base = this,
					container = $(base.selector);
				
				container.each(function() {
					var that = $(this),
						mapzoom = that.data('map-zoom'),
						maplat = that.data('map-center-lat'),
						maplong = that.data('map-center-long'),
						pinlatlong = that.data('latlong'),
						pinimage = that.data('pin-image'),
						style = that.data('map-style'),
						mapstyle,
						tw = that.width();
					
					switch(style) {
						case 0:
							break;
						case 1:
							mapstyle = [{"featureType":"administrative","stylers":[{"visibility":"off"}]},{"featureType":"poi","stylers":[{"visibility":"simplified"}]},{"featureType":"road","stylers":[{"visibility":"simplified"}]},{"featureType":"water","stylers":[{"visibility":"simplified"}]},{"featureType":"transit","stylers":[{"visibility":"simplified"}]},{"featureType":"landscape","stylers":[{"visibility":"simplified"}]},{"featureType":"road.highway","stylers":[{"visibility":"off"}]},{"featureType":"road.local","stylers":[{"visibility":"on"}]},{"featureType":"road.highway","elementType":"geometry","stylers":[{"visibility":"on"}]},{"featureType":"road.arterial","stylers":[{"visibility":"off"}]},{"featureType":"water","stylers":[{"color":"#5f94ff"},{"lightness":26},{"gamma":5.86}]},{},{"featureType":"road.highway","stylers":[{"weight":0.6},{"saturation":-85},{"lightness":61}]},{"featureType":"road"},{},{"featureType":"landscape","stylers":[{"hue":"#0066ff"},{"saturation":74},{"lightness":100}]}];
							break;
						case 2:
							mapstyle = [{"featureType":"water","elementType":"all","stylers":[{"hue":"#e9ebed"},{"saturation":-78},{"lightness":67},{"visibility":"simplified"}]},{"featureType":"landscape","elementType":"all","stylers":[{"hue":"#ffffff"},{"saturation":-100},{"lightness":100},{"visibility":"simplified"}]},{"featureType":"road","elementType":"geometry","stylers":[{"hue":"#bbc0c4"},{"saturation":-93},{"lightness":31},{"visibility":"simplified"}]},{"featureType":"poi","elementType":"all","stylers":[{"hue":"#ffffff"},{"saturation":-100},{"lightness":100},{"visibility":"off"}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"hue":"#e9ebed"},{"saturation":-90},{"lightness":-8},{"visibility":"simplified"}]},{"featureType":"transit","elementType":"all","stylers":[{"hue":"#e9ebed"},{"saturation":10},{"lightness":69},{"visibility":"on"}]},{"featureType":"administrative.locality","elementType":"all","stylers":[{"hue":"#2c2e33"},{"saturation":7},{"lightness":19},{"visibility":"on"}]},{"featureType":"road","elementType":"labels","stylers":[{"hue":"#bbc0c4"},{"saturation":-93},{"lightness":31},{"visibility":"on"}]},{"featureType":"road.arterial","elementType":"labels","stylers":[{"hue":"#bbc0c4"},{"saturation":-93},{"lightness":-2},{"visibility":"simplified"}]}];
							break;
						case 3:
							mapstyle = [{"featureType":"poi","stylers":[{"visibility":"off"}]},{"stylers":[{"saturation":-70},{"lightness":37},{"gamma":1.15}]},{"elementType":"labels","stylers":[{"gamma":0.26},{"visibility":"off"}]},{"featureType":"road","stylers":[{"lightness":0},{"saturation":0},{"hue":"#ffffff"},{"gamma":0}]},{"featureType":"road","elementType":"labels.text.stroke","stylers":[{"visibility":"off"}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"lightness":20}]},{"featureType":"road.highway","elementType":"geometry","stylers":[{"lightness":50},{"saturation":0},{"hue":"#ffffff"}]},{"featureType":"administrative.province","stylers":[{"visibility":"on"},{"lightness":-50}]},{"featureType":"administrative.province","elementType":"labels.text.stroke","stylers":[{"visibility":"off"}]},{"featureType":"administrative.province","elementType":"labels.text","stylers":[{"lightness":20}]}];
							break;
						case 4:
							mapstyle = [{"featureType":"landscape","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"poi","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"road","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"stylers":[{"hue":"#00aaff"},{"saturation":-100},{"gamma":2.15},{"lightness":12}]},{"featureType":"road","elementType":"labels.text.fill","stylers":[{"visibility":"on"},{"lightness":24}]},{"featureType":"road","elementType":"geometry","stylers":[{"lightness":57}]}];
							break;
						case 5:
							mapstyle = [{"featureType":"landscape","stylers":[{"hue":"#F1FF00"},{"saturation":-27.4},{"lightness":9.4},{"gamma":1}]},{"featureType":"road.highway","stylers":[{"hue":"#0099FF"},{"saturation":-20},{"lightness":36.4},{"gamma":1}]},{"featureType":"road.arterial","stylers":[{"hue":"#00FF4F"},{"saturation":0},{"lightness":0},{"gamma":1}]},{"featureType":"road.local","stylers":[{"hue":"#FFB300"},{"saturation":-38},{"lightness":11.2},{"gamma":1}]},{"featureType":"water","stylers":[{"hue":"#00B6FF"},{"saturation":4.2},{"lightness":-63.4},{"gamma":1}]},{"featureType":"poi","stylers":[{"hue":"#9FFF00"},{"saturation":0},{"lightness":0},{"gamma":1}]}];
							break;
						case 6:
							mapstyle = [{"stylers":[{"hue":"#2c3e50"},{"saturation":250}]},{"featureType":"road","elementType":"geometry","stylers":[{"lightness":50},{"visibility":"simplified"}]},{"featureType":"road","elementType":"labels","stylers":[{"visibility":"off"}]}];
							break;
						case 7:
							mapstyle = [{"stylers":[{"hue":"#16a085"},{"saturation":0}]},{"featureType":"road","elementType":"geometry","stylers":[{"lightness":100},{"visibility":"simplified"}]},{"featureType":"road","elementType":"labels","stylers":[{"visibility":"off"}]}];
							break;
						case 8:
							mapstyle = [{"featureType":"all","stylers":[{"hue":"#0000b0"},{"invert_lightness":"true"},{"saturation":-30}]}];
							break;
						case 9:
							mapstyle = [{"featureType":"all","elementType":"labels.text.fill","stylers":[{"saturation":36},{"color":"#000000"},{"lightness":40}]},{"featureType":"all","elementType":"labels.text.stroke","stylers":[{"visibility":"on"},{"color":"#000000"},{"lightness":16}]},{"featureType":"all","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"administrative","elementType":"geometry.fill","stylers":[{"color":"#000000"},{"lightness":20}]},{"featureType":"administrative","elementType":"geometry.stroke","stylers":[{"color":"#000000"},{"lightness":17},{"weight":1.2}]},{"featureType":"landscape","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":20}]},{"featureType":"poi","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":21}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#000000"},{"lightness":17}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"color":"#000000"},{"lightness":29},{"weight":0.2}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":18}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":16}]},{"featureType":"transit","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":19}]},{"featureType":"water","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":17}]}];
							break;
					}
					var centerlatLng = new google.maps.LatLng(maplat,maplong);
					
					var mapOptions = {
						center: centerlatLng,
						styles: mapstyle,
						zoom: mapzoom,
						mapTypeId: google.maps.MapTypeId.ROADMAP,
						scrollwheel: false,
						panControl: true,
						zoomControl: true,
						mapTypeControl: false,
						scaleControl: false,
						streetViewControl: false
					};
					
					var map = new google.maps.Map(that[0], mapOptions);
					
					google.maps.event.addListenerOnce(map, 'tilesloaded', function() {
						if(pinimage.length > 0) {
							var pinimageLoad = new Image();
							pinimageLoad.src = pinimage;
							
							$(pinimageLoad).load(function(){
								base.setMarkers(map, pinlatlong, pinimage);
							});
						}
						else {
							base.setMarkers(map, pinlatlong, pinimage);
						}
					});
				});
			},
			setMarkers: function(map, pinlatlong, pinimage) {
				var infoWindows = [];
				
				function showPin (i) {
					var latlong_array = pinlatlong[i].lat_long.split(','),
						marker = new google.maps.Marker({
							position: new google.maps.LatLng(latlong_array[0],latlong_array[1]),
							map: map,
							animation: google.maps.Animation.DROP,
							icon: pinimage,
							optimized: false
						}),
						contentString = '<div class="marker-info-win'+(pinlatlong[i].image ? ' with-image': '')+'">'+
						(pinlatlong[i].image ? '<img src="'+pinlatlong[i].image+'" class="image" />' : '')+
						'<div class="marker-inner-win">'+
						'<h1 class="marker-heading">'+pinlatlong[i].title+'</h1>'+
						'<p>'+pinlatlong[i].information+'</p>'+ 
						'</div></div>';
					
					// info windows 
					var infowindow = new InfoBox({
						alignBottom: true,
						content: contentString,
						disableAutoPan: false,
						maxWidth: 380,
						closeBoxMargin: "10px 10px 10px 10px",
						closeBoxURL: "http://www.google.com/intl/en_us/mapfiles/close.gif",
						pixelOffset: new google.maps.Size(-196, -73),
						zIndex: null,
						infoBoxClearance: new google.maps.Size(1, 1)
					});
					infoWindows.push(infowindow);
					
					google.maps.event.addListener(marker, 'click', (function(marker, i) {
						return function() {
							infoWindows[i].open(map, this);
						};
					})(marker, i));
				}
				
				for (var i = 0; i + 1 <= pinlatlong.length; i++) {  
					setTimeout(showPin, i * 250, i);
				}
			}
		},
		equalHeights: {
			selector: '[data-equal]',
			init: function() {
				var base = this,
					container = $(base.selector);
					
				container.each(function(){
					var that = $(this),
						children = that.data("equal");
							
					that.waitForImages(function() {
						that.find(children).matchHeight(true);
					});
					 
				});
			}
		},
		animation: {
			selector: '.animation',
			init: function() {
				var base = this,
						container = $(base.selector);
				
				base.control(container);
				
				win.scroll(function(){
					base.control(container);
				});
			},
			control: function(element) {
				var t = -1;


				element.filter(':in-viewport').each(function () {
					var that = $(this);
						t++;
					
					setTimeout(function () {
						that.addClass("animate");
					}, 200 * t);
					
				});
			}
		},
		toBottom: {
			selector: '.mouse_scroll',
			init: function() {
				var base = this,
					container = $(base.selector);
				
				container.each(function() {
					var _this = $(this);
						
					
					_this.on('click', function(){
						var p = _this.parents('.row'),
							h = p.height();
						TweenMax.to(window, 1, {scrollTo:{y: p.scrollTop() + h }, ease:Quart.easeOut});
						return false;
					});
				});
			}
		},
		toTop: {
			selector: '#scroll_totop',
			init: function() {
				var base = this,
					container = $(base.selector);
				
				container.on('click', function(){
					TweenMax.to(window, win.height() / 1000, {scrollTo:{y:0}, ease:Quart.easeOut});
					return false;
				});
				win.scroll(_.debounce(function(){
					base.control();
				}, 50));
			},
			control: function() {
				var base = this,
					container = $(base.selector);
					
				if (($doc.height() - (win.scrollTop() + win.height())) < 300) {
					TweenMax.to(container, 0.2, { autoAlpha:1, ease: Quart.easeOut });
				} else {
					TweenMax.to(container, 0.2, { autoAlpha:0, ease: Quart.easeOut });
				}
			}
		}
	};
	
	$doc.ready(function() {
		if (!window.thb_init) {
			window.SITE.init();
		}
	});

})(jQuery, this, _);