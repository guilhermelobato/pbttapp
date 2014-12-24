(function(window,undefined){
	// RubberBand, the object
	var RubberBand = function(cb) {

		// for down scope uses of this object
		var $me = this;

		this.config = {
			pull_text: 'Puxe para atualizar',
			load_text: ''
		};

		// variables to be used throughout that are set on init (don't edit)
		this.variables = {
			callback: null,
			calling: false,
			e_height: null,
			max_height: null,
			original_top: null,
			scrolling: null,
			closing: null,
			inplay: false,
			$RBe: null,
			images: true
		};

		// Initialize function
		// sets all variables
		this.init = function(cb) {
			// find me
			$me.variables.$RBe = $('#RubberBandjs');

			// if the element doesn't exist, FAILS!
			if(!$me.variables.$RBe.length) {
				throw new Error("RubberBandjs element not found!");
			}

			// set all necessary variables


			$me.variables.$RBe.find('.rband .text').html($me.config.pull_text);
			$me.variables.callback = cb;
			$me.variables.e_height = parseFloat( $me.variables.$RBe.css('top').replace(/px/, '') ); // this needs to be an integer
			$me.variables.max_height = Math.abs( $me.variables.e_height ); // swap to positive
			$me.variables.original_top = $me.variables.e_height;

			$me.variables.$RBcontainer = $me.variables.$RBe.parent();
			$me.variables.offset = parseFloat( $me.variables.$RBcontainer.css('padding-top').replace(/px/, '') );

			// Bind to the scrolling of the parent (container)
			$me.variables.$RBcontainer.scrollTop(1).on("scroll touchmove", $me.RB);
		};

		// The actual RubberBand function
		this.RB = function() {

			// clear the timeout on any scroll
			$me.variables.scrolling = clearTimeout($me.variables.scrolling);

			// only do something if they're at the top of the page
			if($me.variables.$RBcontainer.scrollTop()<=0) {
				$me.variables.inplay = true;
				var diff;

				if($me.variables.e_height<0) {
					// tension control for more of a natural feel
					if($me.variables.e_height>=-10) {
						diff = 5;
					} else if($me.variables.e_height>=-20) {
						diff = 6;
					} else if($me.variables.e_height>=-50) {
						diff = 7;
					} else {
						diff = 8;
					}

					// determine values and set css rules
					$me.variables.e_height = $me.variables.e_height + diff;
					$me.variables.$RBe.css('top', $me.variables.offset + $me.variables.e_height +'px');
					$me.variables.$RBcontainer.css('padding-top', ($me.variables.offset + $me.variables.max_height + $me.variables.e_height) +'px');

					// this allows the user to continue to scroll
					$me.variables.$RBcontainer.scrollTop(1);

				// when the very top has been reached, "refresh"
				} else if($me.variables.e_height>=0) {
					// no more scrolling for now
					$me.variables.$RBcontainer.unbind("scroll");

					// set CSS to avoid "over-scrolling"
					//$me.variables.$RBe.css('top', '0px');
					$me.variables.$RBcontainer.css('padding-top', $me.variables.offset + $me.variables.max_height +'px');
					$me.variables.scrolling = clearTimeout($me.variables.scrolling);
					$me.variables.$RBe.find('.rband .text').html($me.config.load_text);

					// switch images, if they exist
					if($me.variables.images) {
						$me.variables.$RBe.find('.rband .load').show();
						$me.variables.$RBe.find('.rband .arrow').hide();
					}

					// fire the callback, or "on refresh" function
					if($me.variables.callback) {
						if(!$me.variables.calling) {
							$me.variables.callback($me);
							$me.variables.calling = true;
						}

					// otherwise just close it
					} else {
						$me.close();
					}
				}
			}

			// if they're not scrolling, the band is showing, and it isn't already closing-- close it
			if(!$me.variables.closing && $me.variables.inplay && $me.variables.e_height<0) {
				$me.variables.scrolling = setTimeout(function() {
					$me.close();
				}, 200);
			}
		};

		// Close function
		// animates the band to the original closed state
		this.close = function() {
			// fire both animations
			$me.variables.$RBe.animate({ top: $me.variables.original_top }, 150);

			// reset after the animation has completed
			$me.variables.$RBcontainer.animate({ paddingTop: $me.variables.offset }, 150, function() {
				$me.variables.$RBcontainer.on("scroll touchmove", $me.RB);

				$me.variables.e_height = $me.variables.original_top;
				$me.variables.inplay = false;
				$me.variables.calling = false;
				$me.variables.closing = clearTimeout($me.variables.closing);

				// reset action text
				$me.variables.$RBe.find('.rband .text').html($me.config.pull_text);

				if($me.variables.images) {
					$me.variables.$RBe.find('.rband .load').hide();
					$me.variables.$RBe.find('.rband .arrow').show();
				}
			});
		};

		// Runtime
		this.init(cb);
	};

	// set the variable to be accessed
	window.RubberBand = RubberBand;
}(window));