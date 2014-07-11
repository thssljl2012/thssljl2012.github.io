// JavaScript Document
var curPage = 0, totPage = 3;
		
if (localStorage.pageID) {
	curPage = localStorage.pageID - 1;	
}

function importComments(json) {
	for (var i = 0; i < 5; i++) {
		var id = (curPage - 1) * 5 + i;
		if (id >= json.count) {
			$('.comment-item:eq('+i+')').css("display","none");	
		}
		else {
			$('.comment-item:eq('+i+')').css("display","block");
			$('.comment-item:eq('+i+') .user-name').html(json.content[id].name);
			$('.comment-item:eq('+i+') .user-place').html('['+json.content[id].place+']');
			$('.comment-item:eq('+i+') .txt').html(json.content[id].words);
			$('.comment-item:eq('+i+') .datetime').html(json.content[id].date);
			$('.comment-item:eq('+i+') .forward').html('转发');
			$('.comment-item:eq('+i+') .reply').html('回复');
		}
	}
}
		
function handlerForPages() {
	if (this.readyState == 4 && this.status == 200) {
		try {
			importComments(JSON.parse(this.responseText));	
		} catch(ex) {
			console.log(ex.message);	
		}
	}	
}
		
function hidePageButton() {
	if (curPage == 1) {
		$('.pre').css("display","none");	
	}
	else {
		$('.pre').css("display","block");
	}
	if (curPage == totPage) {
		$('.next').css("display","none");	
	}
	else {
		$('.next').css("display","block");		
	}
}
		
function togglePages(delta) {
	curPage = curPage + delta;
	localStorage.pageID = curPage;
	var client = new XMLHttpRequest();
	client.onreadystatechange = handlerForPages;
	client.open("GET", "json/comments.json", true);
	client.send();
	hidePageButton();
}
		
togglePages(1);
		
$('.pre a').click(function(){
	togglePages(-1);
});
$('.next a').click(function(){
	togglePages(1);	
});