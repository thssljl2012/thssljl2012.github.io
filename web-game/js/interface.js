var moduleCompleted = 0;
var moduleInTotal = 20;	//NEW!! in 7
var chosenMapImg = 2;
var startButtonClicked = false;

function addGlobalFlag(){
	moduleCompleted++;
}

function goToEndingPage(arg){
	
	$('#winner').html(arg).css("font-size","80px");
	if (arg == "BLUE TEAM") {
		$('#winner').css("color","#4169E1");
	}
	else if (arg == "RED TEAM") {
		$('#winner').css("color","#FF0000");
	}

	$('#ending-image').css("visibility","visible");
}


function bindEventsToButtons(){
	
	function rotateImages(jQuery, deg){
		jQuery.css("transform","rotate("+deg+"deg)")
			  .css("-ms-transform","rotate("+deg+"deg)")
			  .css("-webkit-transform", "rotate("+deg+"deg)")
			  .css("-o-transform","rotate("+deg+"deg)")
			  .css("-moz-transform","rotate("+deg+"deg)");
	}
	
	
	$('#start-game').hover(
		function(){
			$(this).css("font-size","60px");
			rotateImages($('#widget-6'), 180);
		},function(){
			$(this).css("font-size","48px");
			rotateImages($('#widget-6'), 0);
		}
	);
	
	$('#choose-map').hover(
		function(){
			$(this).css("font-size","60px");
			rotateImages($('#widget-7'), 180);
		},function(){
			$(this).css("font-size","48px");
			rotateImages($('#widget-7'), 0);
		}
	);
	
	$('#choose-mode').hover(
		function(){
			$(this).css("font-size","60px");
			rotateImages($('#widget-8'), 180);
		},function(){
			$(this).css("font-size","48px");
			rotateImages($('#widget-8'), 0);
		}
	);
	
	
	$('#start-game').click(function(event){
		if (startButtonClicked) {
			event.preventDefault();
		} else {
			startButtonClicked = true;

			startGame(chosenMapImg);
		}
	});
	
	
	$('#choose-map').click(function(event){
		if (startButtonClicked) {
			event.preventDefault();
		} else {

			$('.map-preview:eq('+ (chosenMapImg - 1) +')').css("border-color","#9AC0CD");
			$('#menu-area-map').fadeIn("slow",function(){
				$(this).css("display","block");
			});
			$('#widget-area').fadeOut("fast");
			$('#game-title').css("top","20px");
			$('#start-menu').css("visibility","hidden");
			$('#mode-menu').css("visibility","hidden");
			$('#menu-area').css("top","50px");
		}
		
	});
	
	
	$('#ok-button').click(function(){
		$('#menu-area-map').fadeOut("slow",function(){
			$(this).css("display","none");
		});
		$('#menu-area').css("top","260px");
		$('#mode-menu').css("visibility","visible");
		$('#start-menu').css("visibility","visible");
		$('#game-title').css("top","80px");
		$('#widget-area').fadeIn("slow");
	});
	
	
	$('.map-preview').click(function(){
		for (var i = 0; i < $('.map-preview').length; i++) {
			if ($('.map-preview:eq('+i+')').css("border-color") != "transparent") {
				$('.map-preview:eq('+i+')').css("border-color","transparent");	
			}
		}
		$(this).css("border-color","#9AC0CD");
		chosenMapImg = parseInt($(this).attr("id")[0]);
		console.log(chosenMapImg);
	});
	
	
	$('#return-home a').click(function(){
		$('#starting-image').css("top","0px");
		setTimeout(
			function(){
				$('#ending-image').css("visibility","hidden");
			}, 2000
		);
		startButtonClicked = false;
	});
}

function vibrateWidgets(){
	
	function moveWidgets(jQuery){
		var dir = Math.floor(Math.random() * 4);
		if (dir === 0) {
			jQuery.animate({top:'-=20px'}, 1000);
			jQuery.animate({top:'+=20px'}, 1000);	
		} else if (dir == 1) {
			jQuery.animate({left:'+=20px'}, 1000);
			jQuery.animate({left:'-=20px'}, 1000);	
		} else if (dir == 2) {
			jQuery.animate({top:'+=20px'}, 1000);
			jQuery.animate({top:'-=20px'}, 1000);	
		} else if (dir == 3) {
			jQuery.animate({left:'-=20px'}, 1000);
			jQuery.animate({left:'+=20px'}, 1000);	
		}
	}
	
	var jQuery = [];
	
	for (var i = 1; i <= 8; i++) {
		jQuery[i] = $('#widget-'+i);
	}
	
	setInterval(function(){
		moveWidgets(jQuery[1]);	
	}, 1000);
	
	setTimeout(function(){
		setInterval(function(){
			moveWidgets(jQuery[2]);	
		}, 1000);
	}, 100);
	
	setTimeout(function(){
		setInterval(function(){
			moveWidgets(jQuery[3]);	
		}, 1000);
	}, 200);
	
	setTimeout(function(){
		setInterval(function(){
			moveWidgets(jQuery[4]);	
		}, 1000);
	}, 300);
	
	setTimeout(function(){
		setInterval(function(){
			moveWidgets(jQuery[5]);	
		}, 1000);
	}, 400);
	
	
	
}

function getFrontpage(){
	
	bindEventsToButtons();
	
	$('#starting-image').css("visibility","visible");
	
	$('#loader-box').fadeOut(1500, function(){
		$(this).css("z-index","-1");
	});

	$('#film').css("visibility","visible");
	
	vibrateWidgets();
	
}


function loading(){
	
	var loader = $('#loader').percentageLoader({controllable:false});
	
	var timer = setInterval(animateFunc, 25);
	var kbTemporary = 0;
	var kbInTotal = moduleInTotal * 100;
	
	function animateFunc(){
		kbTemporary += 10;
		if (kbTemporary <= moduleCompleted * 100) {
			loader.setValue(kbTemporary + 'kb');
			loader.setProgress(kbTemporary / kbInTotal);
		} else if (moduleCompleted == moduleInTotal) {
			clearInterval(timer);
			getFrontpage();
		}
	}
	
	preLoad();
	
}

$('document').ready(loading);
