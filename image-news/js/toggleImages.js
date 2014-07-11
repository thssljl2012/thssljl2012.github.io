// JavaScript Document
var cur = -1;
var tot = 10;
var flagOfRefresh = 1;
var globarDir;

if (localStorage.imageID) {
	cur = localStorage.imageID - 1;
}

var timer = setInterval(function(){
	toggleImages(1);	
}, 6000);

function processData(json) {
	$('.d-title span').text(json.pictures[cur].title);
	$('.d-content span').text(json.pictures[cur].content);
	
	if (flagOfRefresh) {
		$('.slider-item #img-2').attr("src", json.pictures[cur].url);
		flagOfRefresh = 0;
	} 
	
	else {
		if (globalDir == 1) {
			$('#img-2').after('<img id="img-3" src="" alt="该图片无法显示"/>');
			$('#img-3').attr("src", json.pictures[cur].url);
			$('#img-2').css("left","0px");
			setTimeout(function(){
				$('#img-2').remove();
				$('#img-3').attr("id", "img-2");
			}, 2000);
			
			
		}
		
		else {
			$('#img-2').after('<img id="img-3" src="" alt="该图片无法显示"/>');
			$('#img-3').attr("src", json.pictures[cur].url);
			$('#img-2').css("left","1500px");
			setTimeout(function(){
				$('#img-2').remove();
				$('#img-3').attr("id", "img-2");
			}, 2000);
		}
		
	}
}

function handler() {
	if (this.readyState == 4 && this.status == 200) {
		try {
			processData(JSON.parse(this.responseText));
		} catch(ex) {
			console.log(ex.message);
		}
	}
}
				
function toggleImages(dir){
	globalDir = dir;
	cur = ((cur + dir) % tot + tot) % tot;
	localStorage.imageID = cur;
	var client =  new XMLHttpRequest();
	client.onreadystatechange = handler;
	client.open("GET", "json/pictures.json", true);
	client.send();
}
		
$('#toggle-left').click(function(){
	clearInterval(timer);
	toggleImages(-1);
	timer = setInterval(function(){
		toggleImages(1);
	}, 6000);
});
	$('#toggle-right').click(function(){
		clearInterval(timer);
		toggleImages(1);
		timer = setInterval(function(){
		toggleImages(1);	
	}, 6000);
});
		
toggleImages(1);