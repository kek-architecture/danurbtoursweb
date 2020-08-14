  $(document).ready(function() {

	$.scrollify({
        easing: "easeOutExpo",
		section:".panel",
		scrollSpeed:700,
		after:function(i) {
		}
	});

	$(".scroll,.scroll-btn").click(function(e) {
		e.preventDefault();
		$.scrollify.next();
	});

	$('#submit-personalization').on('click',function(){
		var val1 = document.getElementById("slider1").value;
		var val2 = document.getElementById("slider2").value;
		var val3 = document.getElementById("slider3").value;
		var val4 = document.getElementById("slider4").value;
		var val5 = document.getElementById("slider5").value;
		console.log(val1, val2, val3, val4, val5);

		if(val1==1){
			$('#futurism').show('slow');
			$('.masthead').hide();
			$('.personalization').hide();
		}
		else{
			$('#paleo').show('slow');
			$('.masthead').hide();
			$('.personalization').hide();
		}
	});


	
	var facebookShare = document.querySelector('[data-js="facebook-share"]');
	
	facebookShare.onclick = function(e) {
		e.preventDefault();
		var facebookWindow = window.open('https://www.facebook.com/sharer/sharer.php?u=' + document.URL, 'facebook-popup', 'height=350,width=600');
		if(facebookWindow.focus) { facebookWindow.focus(); }
			return false;
	}





	/******************************************************************** */

	var defaultSize = 1920;
	var sizes = [
			{ windowSize: 1200, bgSize: 1920 },
			{ windowSize: 992, bgSize: 1200 },
			{ windowSize: 768, bgSize: 992 },
	];

	var markers = null;
	var bg = null;

	var modal = null;
	var image = null;
	var modalTitle = null;
	var modalClose = null;

	function _onResize() {
			var h = parseFloat(bg.clientHeight);
			var w = parseFloat(bg.clientWidth);

			var dw = parseFloat(document.documentElement.clientWidth);

			var sizeIndex = 0;
			while (dw < sizes[sizeIndex].windowSize && sizeIndex < sizes.length-1)
					++sizeIndex;


			for (var i = 0; i < markers.length; ++i) {
					var marker = markers[i];

					// Get the markers offset from the original image's center
					var x = parseFloat(marker.getAttribute('data-x'));
					var y = parseFloat(marker.getAttribute('data-y'));

					// Scale positions to current background width
					x = x * (sizes[sizeIndex].bgSize / defaultSize)
					y = y * (sizes[sizeIndex].bgSize / defaultSize)

					// Calculate the real position of the marker
					var posX = w/2 + x;
					var posY = h/2 + y;

					marker.style.left = Math.round(posX) + "px";
					marker.style.top = Math.round(posY) + "px";
			}

	}



	function onResize() {
			_onResize();
	}

	var currentStage = 0;
	var numStages = 9;

	document.onreadystatechange = function () {
			if (document.readyState == "interactive") {
					bg = document.getElementById('bg');
					markers = document.getElementsByClassName('marker');

					modal = document.getElementById('details-modal');
					modalTitle = document.getElementById('content-title');
					modalClose = document.getElementById('modal-close');
					image = document.getElementById('details-image');
					modalClose.onclick = function () {
							modal.style.display = "none";
					};

					for (var i = 0; i < markers.length; ++i) {
							var marker = markers[i];
					
							marker.onclick = function(e) {
									modalTitle.innerText = e.target.getAttribute('data-name');
									image.src = ""; 
									image.src = "https://picsum.photos/320/180?" + new Date(); 
									modal.style.display = "block";
							}
					}

					var milestones = document.getElementsByClassName('milestone');
					for (var i = 0; i < milestones.length; ++i) {
							milestones[i].onclick = function(e) {
									slide("to", parseInt(e.target.id.split('-')[1]));
							}
					}

					window.onresize = onResize;
					_onResize();

					document.addEventListener("keydown", function(e) {
							if (e.keyCode == 39) {
									slide('right');
							}
							if (e.keyCode == 37) {
									slide('left');
							}


					}, false);

					document.addEventListener("wheel", function(e) {
							console.log('asdqwe');
					if (e.deltaY > 0){
							slide('right');
					} else {
							slide('left');
					}});
			}

			
	}

	function slide(direction, target) {
			if (direction == 'right' && currentStage < numStages) {
					currentStage++;
			}

			if (direction == 'left' && currentStage > 0) {
					currentStage--;
			}

			if (direction == "to") {
					if (target > currentStage)
							currentStage++;
					if (target < currentStage)
							currentStage--;
			}

			for (var i = 0; i <= numStages; ++i) {
					var ms = document.getElementById("milestone-" + i);
					if (i <= currentStage) {
							addClass(ms, "active")
					}
					else {
							removeClass(ms, "active")
					}
			}

			var prevPrev = document.getElementById("map-" + (currentStage - 2));
			var prev = document.getElementById("map-" + (currentStage - 1));
			var current = document.getElementById("map-" + (currentStage));
			var next = document.getElementById("map-" + (currentStage + 1));

			if (prevPrev) {
					removeClass(prevPrev, "prev");
			}

			if (prev) {
					addClass(prev, "prev")
					removeClass(prev, "current");
			}

			if (current) {
					addClass(current, "current");
					removeClass(current, "prev");
					removeClass(current, "next");
			}

			if (next) {
					removeClass(next, "current");
					removeClass(next, "prev");
					addClass(next, "next");
			}

			if (direction == "to" && target != currentStage)
					setTimeout(function() { slide("to", target); }, 200);
	}

	function hasClass(elem, className) {
			return new RegExp(' ' + className + ' ').test(' ' + elem.className + ' ');
	}
	
	function addClass(elem, className) {
			if (!hasClass(elem, className)) {
					elem.className += ' ' + className;
			}
	}

	function removeClass(elem, className) {
			var newClass = ' ' + elem.className.replace( /[\t\r\n]/g, ' ') + ' ';
			if (hasClass(elem, className)) {
					while (newClass.indexOf(' ' + className + ' ') >= 0 ) {
							newClass = newClass.replace(' ' + className + ' ', ' ');
					}
					elem.className = newClass.replace(/^\s+|\s+$/g, '');
			}
	}


});
