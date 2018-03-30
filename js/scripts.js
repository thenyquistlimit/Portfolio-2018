/**
 * Typer Text
 */

'use strict';

(function ($) {

	$.fn.kohanIsotope = function (opts) {
		var $self = $(this),
			defaults = {
				filter      : '*',
				itemSelector: '.grid-item'
			},
			options = $.extend(defaults, $self.data(), opts),
			$controls = $('.controls', $self),
			$grid = $('.grids', $self),
			$images = $('img', $self),
			count = 0,
			total = $images.length;

		$.each($images, function () {
			var image = new Image();

			image.src = $(this).attr('src');

			image.onload = function () {

				count++;

				if (count === total) {
					$('.grid-item', $grid).addClass('ready');
					$grid.isotope(options);
					$grid.data('isIsotope', true);
				}
			}
		});

		$grid.on( 'arrangeComplete', function() {
			var $items = $('.grid-item:not(.ready)', $grid);

			if ($items.length) {
				$items.addClass('ready');
				setTimeout(function () {
					$('.kd-hidden', $grid).addClass('kd-show');
				}, 300);
			}
		});

		$('a', $controls).on('click', function (event) {

			event.preventDefault();

			var $this = $(this),
				filter = $this.data('filter');

			if (!$this.hasClass('active')) {
				$('.active', $controls).removeClass('active');
				$this.addClass('active');

				$grid.isotope({
					filter: filter
				});
			}
		});

		if ($self.hasClass('gallery')) {
			$self.kohanMagnificPopup();
		}

	};
	$.fn.kohanMagnificPopup = function (opts) {
		var $self = $(this),
			options = $.extend({
				delegate   : '.media',
				type       : 'image',
				tLoading   : '<div class="dots">\
							<div class="dot active"></div>\
							<div class="dot active"></div>\
							<div class="dot active"></div>\
							<div class="dot active"></div>\
						</div>',
				mainClass  : 'mfp-img-mobile',
				gallery    : {
					enabled           : true,
					navigateByImgClick: true,
					preload           : [0, 3] // Will preload 0 - before current, and 1 after the current image
				},
				image      : {
					tError: '<a href="%url%">The image #%curr%</a> could not be loaded.'
				},
				closeMarkup: '<button title="%title%" type="button" class="mfp-close"></button>',
				callbacks  : {
					markupParse      : function (item) {
					},
					imageLoadComplete: function () {
						var $container = $('.mfp-container');

						$container.addClass('load-done');
						setTimeout(function () {
							$container.addClass('load-transition');
						}, 50);
					},
					change           : function () {
						var $container = $('.mfp-container');
						$container.removeClass('load-done load-transition');
					}

				}
			}, $self.data(), opts);

		$self.magnificPopup(options);
	}

	$(document).ready(function () {

		// Menu Mobile

		var $btnMenu = $('.menu-mobile');

		if ($btnMenu.length) {
			var $header = $('#header'),
				$mainMenu = $('.menu-list', $header);
			$btnMenu.on('click', function () {
				$header.toggleClass('active');
				if ($header.hasClass('active')) {
					$mainMenu.slideDown(400);
				}
				else {
					$mainMenu.slideUp(400);
				}
			});

			$('.menu-item-has-children > a', $mainMenu).on('click', function (event) {
				var ww = $(window).width();

				if (ww <= 991) {
					event.preventDefault();

					var $target = $(event.target).closest('.menu-item-has-children').children('a'),
						$subMenu = $target.next('ul');

					$target.toggleClass('active');

					if ($target.hasClass('active')) {
						$subMenu.slideDown(400);
					}
					else {
						$subMenu.slideUp(400);
					}
				}
			});
		}

		// View Project
		var $btnView = $('.view-more');

		if ($btnView.length) {
			$btnView.on('click', function (event) {
				event.preventDefault();
				var $portfolio = $('#portfolio');

				if ($portfolio.length) {
					var offsetTop = $portfolio.offset().top;

					$('html, body').animate({
						scrollTop: offsetTop
					}, 500);
				}
			});
		}

		// Typer Text
		var $typer = $('.typer');
		if ($typer.length) {
			$typer.each( function() {
				$(this).typer({
					highlightSpeed    : 20,
					typeSpeed         : 50,
					clearDelay        : 500,
					typeDelay         : 200,
					clearOnHighlight  : true,
					typerDataAttr     : 'data-typer-targets',
					typerInterval     : 2000
				});
			});
		}

		// Isotope
		var $portfolio = $('.portfolio');

		if ($portfolio.length) {

			$portfolio.each(function () {
				$(this).kohanIsotope();
			})
		}

		// Maps Google
		var $maps = $('.maps');

		if ($maps.length) {
			var $information = $('.information', $maps),
				lat = $maps.data('lat') ? $maps.data('lat') : '53.3498',
				long = $maps.data('long') ? $maps.data('long') : '-6.2732296',
				dataMap = {
					zoom     : 4,
					center   : new google.maps.LatLng(lat, long),
					mapTypeId: google.maps.MapTypeId.ROADMAP,
					mapTypeControlOptions: {
						mapTypeIds: ['roadmap', 'satellite', 'hybrid', 'terrain',
							'styled_map']
					},
					scrollwheel: false,
					styles: [{"featureType":"water","stylers":[{"saturation":43},{"lightness":-11},{"hue":"#0088ff"}]},{"featureType":"road","elementType":"geometry.fill","stylers":[{"hue":"#ff0000"},{"saturation":-100},{"lightness":99}]},{"featureType":"road","elementType":"geometry.stroke","stylers":[{"color":"#808080"},{"lightness":54}]},{"featureType":"landscape.man_made","elementType":"geometry.fill","stylers":[{"color":"#ece2d9"}]},{"featureType":"poi.park","elementType":"geometry.fill","stylers":[{"color":"#ccdca1"}]},{"featureType":"road","elementType":"labels.text.fill","stylers":[{"color":"#767676"}]},{"featureType":"road","elementType":"labels.text.stroke","stylers":[{"color":"#ffffff"}]},{"featureType":"poi","stylers":[{"visibility":"off"}]},{"featureType":"landscape.natural","elementType":"geometry.fill","stylers":[{"visibility":"on"},{"color":"#b8cb93"}]},{"featureType":"poi.park","stylers":[{"visibility":"on"}]},{"featureType":"poi.sports_complex","stylers":[{"visibility":"on"}]},{"featureType":"poi.medical","stylers":[{"visibility":"on"}]},{"featureType":"poi.business","stylers":[{"visibility":"simplified"}]}]
				},
				map = new google.maps.Map($maps[0], dataMap),
				marker = new google.maps.Marker({
					position: new google.maps.LatLng(lat, long),
					map: map,
					icon: 'images/marker.png'
				});

			if ($information.length) {
				var infoWindow = new google.maps.InfoWindow({
						content: $information.html()
					}),
					isOpen = false;

				marker.addListener('click', function() {
					if (isOpen) {
						infoWindow.close();
						isOpen = false;
					}
					else {
						infoWindow.open(map, marker);
						isOpen = true
					}
				});

				new google.maps.event.trigger( marker, 'click' );
			}


		}

		// Project Details
		var $imageProject = $('.images-project');

		if ($imageProject.length) {
			$imageProject.kohanMagnificPopup({
				delegate: 'a'
			});
		}

	});

})(jQuery);