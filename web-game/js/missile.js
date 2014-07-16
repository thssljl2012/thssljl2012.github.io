//*******************************************
//An object should contain the following attributes:
//---type:(player, entity)
//---position:[X,Y]
//---velocity:[X,Y]
//---windVul:num;
//---g:num;
//---onDraw:function
//---onCrush:function
//------for a player, it should contain:
//------id:num
//------health:num
//------status:(stand,fly,dead)
//------inventory:[]
//------onHit:function
//------onDie:function
//------onSpawn:function
//------onOperation:funciton
//------...
//---------for a entity, is should contain:
//---------body: Array[bool]
//---------timeout: num
//---------onTimeout:function
//---------onSpawn:function
//*******************************************
//Levy. Jul 13.
var st_missileSize;
var st_missileCentre={};
var st_missileBody={};
var st_missileColor;
var st_missileBlastRadius=45;
var st_blastForce=5000;
var st_maxInjury=50;

function missile_OnDraw(context)
{
	this.count++;
	if (this.position[1]<=MAP_MARGIN) return;
	var posX=Math.round(this.position[0])-st_missileCentre.width+1;
	var posY=Math.round(this.position[1])-st_missileCentre.height+1;
	var ag=Math.atan(this.velocity[1]/this.velocity[0]);
	if (this.count % Math.round(FPS/8)==0)
	{
		var smk=new smoke(10,"gray",0);
		smk.onSpawn(posX,posY);
		globalObjects.push(smk);
	}
	context.save();
	context.translate(posX,posY);
	context.rotate(ag);
	if (this.velocity[0]<0) context.scale(-1,1);
	context.translate(-st_missileSize.cx,-st_missileSize.cy);
	context.drawImage(st_missileColor,0,0);
	context.restore();
}
function missile_OnSpawn(x,y,angle,force,dirConst)	//in rad
{
	console.log(force);
	this.count=0;
	this.position[0]=x;
	this.position[1]=y;
	this.velocity[0]=dirConst*(this.flyMax*force/100)*Math.cos(angle);
	this.velocity[1]=-(this.flyMax*force/100)*Math.sin(angle);
	console.log(this);
}
function missile_Blast()
{
	function calc_Euclid_Dis(pos1,pos2)
	{
		return Math.sqrt((pos1[0]-pos2[0])*(pos1[0]-pos2[0])+(pos1[1]-pos2[1])*(pos1[1]-pos2[1]));
	}
	var blastCentre=[];
	var force;
	var tantPis=0;
	blastCentre[0]=Math.round(this.position[0]);
	blastCentre[1]=Math.round(this.position[1]);
	for (var i=0;i<globalPlayerCount;i++)
	{
		tantPis=calc_Euclid_Dis(this.position,globalObjects[i].position);
		if (Math.floor(tantPis)<=st_missileBlastRadius)
		{
			var stantPis=tantPis;
			if (stantPis<0.1) force=st_blastForce/0.1;
			else force=st_blastForce/stantPis;
			if (tantPis!=0)
			{
				globalObjects[i].velocity[0]+=force*(globalObjects[i].position[0]-this.position[0])/tantPis;
				globalObjects[i].velocity[1]+=force*(globalObjects[i].position[1]-this.position[1])/tantPis;
			}
			//damage;
			globalObjects[i].onHit(Math.round((1-tantPis/st_missileBlastRadius)*st_maxInjury*this.powerC));
		}
	}
	var y1;
	for (var i=-st_missileBlastRadius;i<=st_missileBlastRadius;i++)
	{
		y1=Math.round(Math.sqrt(st_missileBlastRadius*st_missileBlastRadius-i*i));
		for (var j=-y1;j<=y1;j++)
		{
			if (Math.random()>0.995)
			{
				var smk=new smoke(10,(Math.random()>0.6?"gray":"red"),Math.random()*20-40);
				smk.onSpawn(blastCentre[0]+j,blastCentre[1]+i,Math.random()*1.5);
				globalObjects.push(smk);
			}
			if (blastCentre[1]+i<=HEIGHT-MAP_MARGIN)
				globalTerrain.ruin[blastCentre[1]+i][blastCentre[0]+j]=true;
		}
	}
	refreshTerrain(blastCentre[0]-st_missileBlastRadius,blastCentre[1]-st_missileBlastRadius,st_missileBlastRadius*2+1,st_missileBlastRadius*2+1);
}
function missile_OnCrush()
{
	this.canEliminate=true;
	this.blast();
}
function missile(id,pwd)
{
	if (pwd==undefined)
		this.powerC=1;
	else
		this.powerC=pwd;
	this.type="entity";
	this.id=id;
	this.g=150;
	this.windVul=1;
	this.flyMax=700;
	this.body=st_missileBody;
	this.size=st_missileSize;
	this.centre=st_missileCentre;
	this.position=[0,0];
	this.velocity=[0,0];
	this.count=0;
	this.canEliminate=false;
	this.blast=missile_Blast;
	this.onDraw=missile_OnDraw;
	this.onSpawn=missile_OnSpawn;
	this.onCrush=missile_OnCrush;
}
function initMissile()
{
	$.get("file/entity/missile/info.json",function(data)
	{
		if (typeof(data)=="object")
			st_missileSize=data;
		else
			st_missileSize=JSON.parse(data);
		st_missileBody=new Array(st_missileSize.width);
		st_missileCentre.width=Math.round(st_missileSize.width/2);
		st_missileCentre.height=Math.round(st_missileSize.height/2);
		for (var i=0;i<st_missileSize.height;i++)
			st_missileBody[i]=[];
		var img=new Image;
		img.onload=function()
		{	
			var canvas=$("#hideCan")[0];
			var context=canvas.getContext("2d");
			context.clearRect(0,0,100,100);
			context.drawImage(this, 0, 0);
			st_missileColor=this;
			/*
			var x=0,y=0;
			for (var i=0;i<data.length;i+=4) 
			{
				st_missileBody[x][y]=false;
				if ()
				y++;
				if (y==st_missileSize.width)
				{
					x++;
					y=0;
				}
			}*/
			for (var i=0;i<st_missileSize.height;i++)
				for (var j=0;j<st_missileSize.width;j++)
					st_missileBody[i][j]=(i<3 && j<3);
			moduleCompleted++;
			console.log("missile");
		}
		img.src="file/entity/missile/pic.png"
	})
}