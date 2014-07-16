//Used for constants' declaration
//Name in upper case
//Levy. Jul 13.
var WIDTH=2048;
var HEIGHT=1300;
var SHOW_WIDTH=1024;
var SHOW_HEIGHT=650;
var TRANSPARENT_COLOR=[163,73,164];
var FPS=60;
var MAX_HEALTH=100;
var MAX_FALLING_SPEED=10000000;
var FLAG_FULL=63;
var CANNOT_WALK=3;
var JUMP_FORCE=140;
var JUMP_LONG=50;
var LEAN_FORCE=30;
var MIN_SPEED_RECOGNIZED=0.2;
var KEY_UP=38;
var KEY_DOWN=40;
var KEY_LEFT=37;
var KEY_RIGHT=39;
var KEY_LCTRL=17;
var KEY_SPACE=32;
var KEY_P=80;
var KEY_Z=90;
var KEY_X=88;
var KEY_C=67;
var SAMPLE_RANGE=10;
var MAX_GRAD=10;
var PLAYER_PIC_WIDTH=48;
var PLAYER_PIC_HEIGHT=32;
var WORD_HEIGHT=50; 
var WORD_WIDTH=60;
var INIT_ANGLE=20;
var MAP_MARGIN=20;
var MAX_TEAM_HEALTH=100;
var MAX_HEALTH_WIDTH=400;
var MAX_ENERGY=200;
var ENERGY_WIDTH=70;

//Used for global variables' declaration
var globalTerrain={};
var globalObjects=[];
var globalContext2;
var globalContext3;
var globalFlag=0;	//bit0: terrain, bit1:missile, bit2:player1, bit3:player2, bit4:aimer
var globalPlayerCount=2;
var globalIsIE;
var globalFocus;
var globalWind;