//***********************
//LATEST EDIT: 7/14 22:27
//BY LEVY
//***********************
var ker_Refresh2Timer;
var ker_LoadingTimer;
var ker_PrevPlayer;
var ker_lastZoom=-1;
var ker_pip=[];
var ker_Blood={};
var ker_LastCan=false;
var ker_artiZoom=false;
var ker_InGame=false;

function clickOn(e)
{
	if (!ker_InGame) return;
	console.log(e.clientX,e.clientY);
	zoom("art",e.clientX,e.clientY);
}
function preLoad()
{
	$("#canvas1")[0].height=HEIGHT;
	$("#canvas1")[0].width=WIDTH;
	$("#canvas2")[0].height=HEIGHT;
	$("#canvas2")[0].width=WIDTH;
	$("#canvas3")[0].height=HEIGHT;
	$("#canvas3")[0].width=WIDTH;
	$(".smallerSize").css("width",SHOW_WIDTH-MAP_MARGIN)
				 	 .css("height",SHOW_HEIGHT-MAP_MARGIN);
	$(".uniSize").css("width",SHOW_WIDTH)
				 .css("height",SHOW_HEIGHT)
				 .css("left",-MAP_MARGIN)
				 .css("top",-MAP_MARGIN);

	getTerrain(2);
	getTerrain(1);
	initMissile();
	initAimer();
	initArrow();
	initSmoke();
	initSoul();
	initEnchante("p20");
	initEnchante("p50");
	initEnchante("x3");
	initPlayerPic("red",2);
	initPlayerPic("blue",3);
	$("#box").click(clickOn);
	globalContext2=$("#canvas2")[0].getContext("2d");
	globalContext3=$("#canvas3")[0].getContext("2d");
	if (document.all) globalIsIE=true; else globalIsIE=false;
	document.onkeydown=keyboardHook;
	document.onkeyup=keyboardHook2;
}
function zoom(size,dx,dy)
{
	var pX,pY;
	if (size=="art")
	{
		$(".uniSize").css("transition","1s")
					 .css("-moz-transition","1s")
					 .css("-webkit-transition","1s")
					 .css("-o-transition","1s");
		$(".uniSize").css("width",WIDTH)
				 	 .css("height",HEIGHT);
				
		pX=-$(".uniSize")[0].offsetLeft+dx;
		pY=-$(".uniSize")[0].offsetTop+dy;
		console.log(pX,pY);
		if (pX<=SHOW_WIDTH/2+MAP_MARGIN)
			$(".uniSize").css("left",-MAP_MARGIN);
		else if (pX>WIDTH-MAP_MARGIN-SHOW_WIDTH/2)
			$(".uniSize").css("left",-WIDTH+SHOW_WIDTH+MAP_MARGIN);
		else 
			$(".uniSize").css("left",SHOW_WIDTH/2-pX);
		if (pY<=SHOW_HEIGHT/2+MAP_MARGIN)
			$(".uniSize").css("top",-MAP_MARGIN);
		else if (pY>HEIGHT-MAP_MARGIN-SHOW_HEIGHT/2)
			$(".uniSize").css("top",-HEIGHT+SHOW_HEIGHT+MAP_MARGIN);
		else 
			$(".uniSize").css("top",SHOW_HEIGHT/2-pY);
			
		ker_artiZoom=true;
		ker_lastZoom=-2;
	}
	if (ker_artiZoom) return;
	
	var thisZoom=(size=="all"?-1:globalFocus)
	if (thisZoom==ker_lastZoom)
	{
		$(".uniSize").css("transition","0s")
					 .css("-moz-transition","0s")
					 .css("-webkit-transition","0s")
					 .css("-o-transition","0s");
	}
	else
	{
		$(".uniSize").css("transition","1s")
					 .css("-moz-transition","1s")
					 .css("-webkit-transition","1s")
					 .css("-o-transition","1s");
	}
	if (size=="all")
	{
		$(".uniSize").css("width",SHOW_WIDTH)
				 	 .css("height",SHOW_HEIGHT)
				 	 .css("left",-MAP_MARGIN)
				 	 .css("top",-MAP_MARGIN);
	}
	else
	{
		$(".uniSize").css("width",WIDTH)
				 	 .css("height",HEIGHT);
		pX=Math.round(globalObjects[globalFocus].position[0]);
		pY=Math.round(globalObjects[globalFocus].position[1]);
		if (pX<=SHOW_WIDTH/2+MAP_MARGIN)
			$(".uniSize").css("left",-MAP_MARGIN);
		else if (pX>WIDTH-MAP_MARGIN-SHOW_WIDTH/2)
			$(".uniSize").css("left",-WIDTH+SHOW_WIDTH+MAP_MARGIN);
		else 
			$(".uniSize").css("left",SHOW_WIDTH/2-pX);
		if (pY<=SHOW_HEIGHT/2+MAP_MARGIN)
			$(".uniSize").css("top",-MAP_MARGIN);
		else if (pY>HEIGHT-MAP_MARGIN-SHOW_HEIGHT/2)
			$(".uniSize").css("top",-HEIGHT+SHOW_HEIGHT+MAP_MARGIN);
		else 
			$(".uniSize").css("top",SHOW_HEIGHT/2-pY);
	}
	ker_lastZoom=thisZoom;
}
function nextPlay(who)
{
	globalObjects[ker_PrevPlayer].operate="idle";
	if (who==-1)
	{
		sbFocus=(ker_PrevPlayer+1)%globalPlayerCount;
		while (globalObjects[sbFocus].status=="die")
			sbFocus=(sbFocus+1)%globalPlayerCount;
	}
	else
		sbFocus=who;
	if (globalFocus==10000 && globalObjects[sbFocus].status=="fly")
	{
		setTimeout(function(){nextPlay(sbFocus)},1000/FPS);
		return;
	}
	globalFocus=sbFocus;
	globalObjects[globalFocus].operate="do";
	ker_artiZoom=false;
	ker_PrevPlayer=globalFocus;
	st_aimer_angle=INIT_ANGLE;
	globalObjects[globalFocus].energy=MAX_ENERGY;
	globalObjects[globalFocus].enchanter=[];
	globalWind=Math.random()*10-5;
}
function keyboardHook(e)		//ATTENTION: PROBABLY MULTIPLE JUMP
{
	if (!ker_InGame) return;
	if (globalFocus>=globalPlayerCount) return;
	
	var keyPressed=e.keyCode;
	ker_artiZoom=false;
	if (globalObjects[globalFocus].status=="fly" && !globalObjects[globalFocus].haveLean)
	{
		switch (keyPressed)
		{
		case KEY_LEFT:
			globalObjects[globalFocus].onLean("l");
			break;
		case KEY_RIGHT:
			globalObjects[globalFocus].onLean("r");
			break;
		}
	}
	if (globalObjects[globalFocus].operate=="ready" && keyPressed==KEY_SPACE)
	{
		globalObjects[globalFocus].onReady();
	}
	if ((globalObjects[globalFocus].status=="stand" || globalObjects[globalFocus].status=="crawl") && globalObjects[globalFocus].operate=="do")
	{
		switch (keyPressed)
		{
		case KEY_LEFT:
			globalObjects[globalFocus].onCrawl("l");
			break;
		case KEY_RIGHT:
			globalObjects[globalFocus].onCrawl("r");
			break;
		case KEY_LCTRL:
			globalObjects[globalFocus].onJump();
			break;
		case KEY_UP:
			if (st_aimer_angle<45)
				st_aimer_angle++;
			break;
		case KEY_DOWN:
			if (st_aimer_angle>-45)
				st_aimer_angle--;
			break;
		case KEY_SPACE:
			globalObjects[globalFocus].lForce=0;
			globalObjects[globalFocus].onReady();
			break;
		case KEY_P:
			nextPlay(-1);
			break;
		case KEY_Z:
			globalObjects[globalFocus].onEnchantez("x3");
			break;
		case KEY_X:
			globalObjects[globalFocus].onEnchantez("p50");
			break;
		case KEY_C:
			globalObjects[globalFocus].onEnchantez("p20");
			break;
		}
	}
}
function keyboardHook2(e)	
{
	if (!ker_InGame) return;
	if (globalFocus>=globalPlayerCount) return;
	var keyPressed=e.keyCode;
	if (keyPressed==KEY_LEFT || keyPressed==KEY_RIGHT)
	{
		if (globalObjects[globalFocus].status=="crawl") globalObjects[globalFocus].status="none";
	}
	if (globalObjects[globalFocus].operate=="ready" && keyPressed==KEY_SPACE)
	{
		globalObjects[globalFocus].onLaunch(st_aimer_angle,globalObjects[globalFocus].lForce);
	}
}
function startGame(id)
{
	initTerrain(id);
}
function postLoad(id)
{
	$('#starting-image').css("top","-630px");
	ker_Refresh2Timer=setInterval(refreshLayerDeux,1000/FPS);

	var huahua;
	MAX_TEAM_HEALTH=100*ter_mapInfo[id].spawn_X.length/2;
	for (var i=0;i<ter_mapInfo[id].spawn_X.length;i++)
	{
		huahua=new player(i,(i%2==0?"red":"blue"));
		huahua.onSpawn(ter_mapInfo[id].spawn_X[i],ter_mapInfo[id].spawn_Y[i]);
		globalObjects.push(huahua);
	}
	globalPlayerCount=ter_mapInfo[id].spawn_X.length;
	
	globalFocus=0;
	ker_PrevPlayer=0;
	globalObjects[0].operate="do";
	globalObjects[0].energy=MAX_ENERGY;
	globalObjects[globalFocus].enchanter=[];
	
	st_aimer_angle=INIT_ANGLE;
	globalWind=Math.random()*10-5;
	ker_InGame=true;
}
function standConfirm()
{
	if ((globalFocus<globalPlayerCount && globalObjects[globalFocus].status=="die")||globalFocus>=globalObjects.length)
		nextPlay(-1);
	for (var i=0;i<globalPlayerCount;i++)
	{
		if (globalObjects[i].status=="crawl" || globalObjects[i].status=="die") continue;
		
		if (globalObjects[i].velocity[0]==0 && globalObjects[i].velocity[1]==0 && !ker_pip[i])
			globalObjects[i].status="stand";
		else
			globalObjects[i].status="fly";
	}
}
function checkLoad()
{
	if (globalFlag==FLAG_FULL)
	{
		clearInterval(ker_LoadingTimer);
		postLoad();
	}
}
function gravity()
{
	var posX,posY
	for (var i=0;i<globalObjects.length;i++)
	{	
		//ATTENTION: ARRAY OVERFLOW
		posX=Math.round(globalObjects[i].position[0]);
		posY=Math.round(globalObjects[i].position[1]);
		if (globalObjects[i].type=="anime" || posY<MAP_MARGIN || !globalTerrain.rawData[posY+1][posX])
		{
			ker_pip[i]=true;
			globalObjects[i].velocity[1]+=globalObjects[i].g/FPS;
			if (globalObjects[i].velocity[1]>MAX_FALLING_SPEED)
				globalObjects[i].velocity[1]=MAX_FALLING_SPEED;
		}
		else ker_pip[i]=false;
	}
}
function wind()
{
	for (var i=0;i<globalObjects.length;i++)
		if (globalObjects[i].windVul)
			globalObjects[i].velocity[0]+=globalWind*10/FPS
	
}
function motion()
{
	var division,vx,vy,px,py;
	var hasCrushed=[];
	for (var i=0;i<globalObjects.length;i++)
	{	
		//ATTENTION: ARRAY OVERFLOW
		vx=globalObjects[i].velocity[0]/FPS;
		vy=globalObjects[i].velocity[1]/FPS;
		//if(i==0)console.log(globalObjects[i].velocity[1]);
		division=Math.max(Math.ceil(Math.abs(vx)),Math.ceil(Math.abs(vy)));
		hasCrushed[i]=false;
		if (globalObjects[i].position[1]<=MAP_MARGIN)
		{
			globalObjects[i].position[0]+=vx;
			globalObjects[i].position[1]+=vy;
			if (globalObjects[i].position[0]<=MAP_MARGIN || globalObjects[i].position[0]>WIDTH-MAP_MARGIN || globalObjects[i].position[1]>HEIGHT-MAP_MARGIN)
			{
				if (globalObjects[i].type=="player")
				{
					globalObjects[i].velocity=[0,0];
					globalObjects[i].g=0;
					globalObjects[i].onDie();
				}
				if (globalObjects[i].type=="entity" || globalObjects[i].type=="anime")
				{
					globalObjects[i].velocity=[0,0];
					globalObjects[i].g=0;
					globalObjects[i].windVul=0;
					globalObjects[i].canEliminate=true;
				}
			}
			continue;	
		}
		if (globalObjects[i].type=="player")
		{
			px=vx/division;
			py=vy/division;
			for (var j=0;j<division;j++)
			{
				globalObjects[i].position[0]+=px;
				globalObjects[i].position[1]+=py;
				if (globalObjects[i].position[0]<=MAP_MARGIN || globalObjects[i].position[0]>WIDTH-MAP_MARGIN || globalObjects[i].position[1]>HEIGHT-MAP_MARGIN)
				{
					globalObjects[i].velocity=[0,0];
					globalObjects[i].g=0;
					globalObjects[i].onDie();
				}
				if (globalTerrain.rawData[Math.round(globalObjects[i].position[1])][Math.round(globalObjects[i].position[0])])
				{
					hasCrushed[i]=true;
					globalObjects[i].position[0]-=px;
					globalObjects[i].position[1]-=py;
					break;
				}
			}
		}
		else if (globalObjects[i].type=="entity")
		{
			var oX=globalObjects[i].position[0];
			var oY=globalObjects[i].position[1];
			px=vx/division;
			py=vy/division;
			for (var j=0;j<division;j++)
			{
				globalObjects[i].position[0]+=px;
				globalObjects[i].position[1]+=py;
				if (globalObjects[i].position[0]<=MAP_MARGIN || globalObjects[i].position[0]>WIDTH-MAP_MARGIN || globalObjects[i].position[1]>HEIGHT-MAP_MARGIN)
				{
					globalObjects[i].velocity=[0,0];
					globalObjects[i].g=0;
					globalObjects[i].windVul=0;
					globalObjects[i].canEliminate=true;
				}
				for (var p=0;p<3;p++)
				{
					for (var q=0;q<3;q++)
						if (globalTerrain.rawData[Math.round(oY+q)][Math.round(oX+p)])
						{
							hasCrushed[i]=true;
							globalObjects[i].position[0]-=px;
							globalObjects[i].position[1]-=py;
							break;
						}
					if (hasCrushed[i]) break;
				}
				if (hasCrushed[i]) break;		
			}
		}
		else
		{
			globalObjects[i].position[0]+=vx;
			globalObjects[i].position[1]+=vy;
			if (globalObjects[i].position[0]<=MAP_MARGIN || globalObjects[i].position[0]>WIDTH-MAP_MARGIN || globalObjects[i].position[1]>HEIGHT-MAP_MARGIN)
			{
				globalObjects[i].velocity=[0,0];
				globalObjects[i].g=0;
				globalObjects[i].windVul=0;
				globalObjects[i].canEliminate=true;
			}
		}
	}
	for (var i=0;i<globalObjects.length;i++)
		if (hasCrushed[i])
			globalObjects[i].onCrush();
}
function checkEliminate()
{
	for (var i=0;i<globalObjects.length;i++)
		if (globalObjects[i].canEliminate)
		{
			if (globalFocus==i)
			{
				globalFocus=10000;
				//setTimeout(nextPlay,2000);
				nextPlay(-1);
			}
			globalObjects.splice(i,1);
			i--;
		}
}
function refreshLayerDeux()
{
	globalContext2.clearRect(0,0,WIDTH,HEIGHT);
	gravity();
	wind();
	motion();
	standConfirm();
	checkEliminate();
	refreshLayerTrois();
	if (globalFocus<globalPlayerCount)
	{
		zoom("part");
	}
	else
		zoom("all");
	calculateBlood();
	for (var i=0;i<globalObjects.length;i++)
		globalObjects[i].onDraw(globalContext2);
	if (ker_Blood.red==0 || ker_Blood.blue==0)
	{
		ker_InGame=false;
		setTimeout(gameOver,1500);
	}
}
function refreshLayerTrois()
{
	globalContext3.clearRect(0,0,WIDTH,HEIGHT);
	if (globalFocus<globalPlayerCount && (globalObjects[globalFocus].operate=="do" || globalObjects[globalFocus].operate=="ready") && (globalObjects[globalFocus].status=="stand" || globalObjects[globalFocus].status=="crawl") && globalObjects[globalFocus].position[1]>MAP_MARGIN)
	{
		drawAimer(globalObjects[globalFocus].position[0],globalObjects[globalFocus].position[1],globalObjects[globalFocus].faceAngle,globalObjects[globalFocus].orientation);
		if (!ker_LastCan)
		{
			$("#barer").css("opacity",0.9);
			$("#forceI").css("width",0);
		}
		ker_LastCan=true;
	}
	else
	{
		if (ker_LastCan) $("#barer").css("opacity",0);
		ker_LastCan=false;
	}
	if (globalWind<0)
		$("#winder").text("< "+(-globalWind.toFixed(1))+"  ");
	else
		$("#winder").text("  "+(globalWind.toFixed(1))+" >");
	if (globalFocus<globalPlayerCount && globalObjects[globalFocus].operate=="do" && globalObjects[globalFocus].position[1]>MAP_MARGIN)	
	{
		globalContext3.save();
		globalContext3.fillStyle="rgba(50,255,50,0.9)";
		globalContext3.fillRect(globalObjects[globalFocus].position[0]-ENERGY_WIDTH/2, globalObjects[globalFocus].position[1]-45, ENERGY_WIDTH/MAX_ENERGY*globalObjects[globalFocus].energy, 4);
		globalContext3.restore();
	}
}
function calculateBlood()
{
	ker_Blood.red=0;
	ker_Blood.blue=0;
	for (var i=0;i<globalPlayerCount;i++)
		ker_Blood[globalObjects[i].appear]+=globalObjects[i].health;
	$("#leftBlood").css("width",ker_Blood.red/MAX_TEAM_HEALTH*MAX_HEALTH_WIDTH);
	$("#rightBlood").css("width",ker_Blood.blue/MAX_TEAM_HEALTH*MAX_HEALTH_WIDTH);
}
function gameOver()
{
	globalObjects=[];
	clearInterval(ker_Refresh2Timer);
	
	if (ker_Blood.red==0)
		goToEndingPage("BLUE TEAM");
	else
		goToEndingPage("RED TEAM");
	
}
//$("document").ready(preLoad);