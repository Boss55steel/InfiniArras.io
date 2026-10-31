//══════════════════════════════════════════════════════════════════════════════
//  EXTENDED ARMSRACE BOSSES v3
//  Layered bosses, flush turrets, massive content expansion
//  Bob×13 | Nemesis×13 | Celestials×12 | Terrestrials×8 | Eternals×6 | Elites×60+
// ══════════════════════════════════════════════════════════════════════════════

const { combineStats } = require('../facilitators.js');
const _facs = require('../facilitators.js');
const { base, dfltskl } = require('../constants.js');
const g = require('../gunvals.js');

const safeCS = s => combineStats(s.filter(x => x != null));
const makeMenu   = _facs.makeMenu   || ((lbl,o={})=>({PARENT:['genericTank'],LABEL:lbl,COLOR:o.color||'white',SHAPE:o.shape||0,SIZE:14,GUNS:[],TURRETS:[],UPGRADES_TIER_0:[]}));
const makeTurret = _facs.makeTurret || ((def,o={})=>({PARENT:['genericTank'],LABEL:o.label||'',INDEPENDENT:o.independent!==false,BODY:{FOV:o.fov||3},CONTROLLERS:o.hasAI===false?[]:['canRepel','onlyAcceptInArc','mapAltToFire','nearestDifferentMaster'],COLOR:o.color||'mirror',GUNS:def.GUNS||[],TURRETS:def.TURRETS||[]}));
const weaponArray = _facs.weaponArray || ((w,n)=>{const a=Array.isArray(w)?w:[w];if(!n||n===1)return a;const o=[];for(let i=0;i<n;i++){const r=(360/n)*i;for(const x of a){const c=JSON.parse(JSON.stringify(x));if(c.POSITION&&Array.isArray(c.POSITION))c.POSITION[5]=(c.POSITION[5]||0)+r;o.push(c);}}return o;});
const weaponMirror = _facs.weaponMirror || ((w,o={})=>{const a=JSON.parse(JSON.stringify(w)),b=JSON.parse(JSON.stringify(w));if(b.POSITION&&Array.isArray(b.POSITION)){b.POSITION[4]=-(b.POSITION[4]||0);b.POSITION[6]=(b.POSITION[6]||0)+(o.delayIncrement||0.5);}return[a,b];});

const _g=(a,b,f)=>{g[a]=g[a]||g[b]||f;};
_g('pounder','pound',{reload:1.5,recoil:1.4,speed:0.65,maxSpeed:0.65,size:1.25,damage:1.5});
_g('destroyer','destroy',{reload:2,recoil:2,speed:0.55,maxSpeed:0.55,size:1.5,damage:2,pen:1.6});
_g('annihilator','anni',{reload:2.5,recoil:3,speed:0.45,maxSpeed:0.45,size:2,damage:2.5,pen:2});
_g('sniper','snip',{reload:0.5,recoil:0.5,speed:2,maxSpeed:2,range:1.5,spray:0.3,damage:1.5,pen:1.2});
_g('assassin','ass',{speed:1.6,maxSpeed:1.6,reload:0.55,recoil:0});
_g('predator','pred',{reload:2,damage:1.4,pen:1.2,speed:1.8,maxSpeed:1.8});
_g('artillery','arty',{reload:1.8,spray:2,size:1.2,damage:1.4});
_g('skimmer','skim',{reload:2,recoil:1,speed:0.8,maxSpeed:0.8});
_g('machineGun','mach',{reload:0.5,recoil:0.5});
_g('minigun','mini',{reload:0.3,size:0.6,damage:0.6,speed:1.1,maxSpeed:1.1});
_g('streamliner','stream',{reload:0.15,size:0.5,damage:0.5,speed:1.3,maxSpeed:1.3});
_g('overseer','over',{reload:1.5,recoil:0,size:1.3,health:1.2});
_g('summoner','summon',{reload:3,speed:0.5,maxSpeed:0.5,health:3,damage:3,size:1.5});
_g('hexaTrapper','hxt',{reload:0.7,health:1.5,speed:0.3,maxSpeed:0.3});
_g('setTrap','setT',{speed:0.5,maxSpeed:0.5,reload:0.8,health:1.5});
_g('pelleter','pellet',{reload:0.3,size:0.5,damage:0.35,speed:1.5,maxSpeed:1.5});
_g('battleship','battle',{reload:0.7,size:0.7});
_g('hive','hiveG',{reload:0.5,size:1.2,damage:0.8});
_g('bee','beeG',{reload:0.6,size:0.8,speed:1.4,maxSpeed:1.4,damage:0.7});
_g('flankGuard','flank',{reload:0.85,recoil:0.85});
_g('autoTurret','aTurr',{reload:0.5,damage:0.7,pen:0.5,recoil:0});
_g('turret','turr',{reload:0.8,damage:0.85,pen:0.75,speed:1.1,maxSpeed:1.1,recoil:0});
_g('power','pow',{damage:1.5,pen:1.5,health:1.5});
_g('minionGun','mG',{reload:1,damage:0.7,pen:0.7});
_g('launcher','launch',{reload:2.5,recoil:1,size:1.2});
_g('constructor','build',{reload:1.5,health:2});
_g('nestKeeper','nest',{size:1.2,health:1.4,damage:1.4});
_g('twin','tw',{reload:0.6,recoil:0.6,speed:1.1});
_g('gunner','gunn',{size:0.6,reload:0.4,speed:1.2});
_g('cyclone','cycl',{spray:6,reload:0.6,speed:1.2,maxSpeed:1.2});
_g('lowPower','lp',{damage:0.5,pen:0.5,health:0.5});
_g('boomerang','boom',{speed:0.4,maxSpeed:0.4,reload:1.5});
_g('fake','fk',{size:0.00001,health:0.0001,speed:0,maxSpeed:0,recoil:0,range:0});
_g('barricade','barr',{health:2,reload:0.5});
_g('halfreload','hr',{reload:2});
_g('weak','wk',{damage:0.5,health:0.5,speed:0.8,maxSpeed:0.8});
_g('carrier','carr',{reload:0.7,size:0.7});
_g('shotgun','shot',{spray:30,reload:0.3,size:0.7,damage:0.7});
_g('spam','sp',{reload:0.2,damage:0.4,size:0.6});
g.doper = g.doper || {speed:1.5,maxSpeed:1.5,pen:1.25,health:0.8,damage:0.95};

// TURRET POSITION HELPERS
// ring(sz, dist, startAngle, arc) — one slot in a ring
const ring = (sz,d,a,arc=180) => [sz,d,0,a,arc,0];
// center turret slot
const ctr  = (sz,arc=360)     => [sz,0,0,0,arc,1];
// N turrets evenly around a ring
const ringN = (n,sz,d,arc=180,off=0) =>
    Array.from({length:n},(_,i)=>({POSITION:ring(sz,d,(360/n)*i+off,arc)}));

// stupidBullet FOV gun
const _sfg = {POSITION:[10,10,0,0,0,0,0],PROPERTIES:{SHOOT_SETTINGS:safeCS([g.basic,{range:0.0005,speed:0.0005,maxSpeed:0.0005,recoil:0}]),TYPE:'stupidBullet',DRAW_FILL:false,BORDERLESS:true}};
// fov turret shorthand
const _ft = (guns,o={}) => makeTurret({GUNS:[_sfg,...guns]},{canRepel:true,limitFov:true,fov:10,extraStats:[],...o});

module.exports = ({ Class }) => {
    console.log('[EAB3] Loading v3...');

// ══════════════════════════════════════════════════════════════════════════════
//  SHARED WEAPON TURRET CLASSES
// ══════════════════════════════════════════════════════════════════════════════

    Class.EAB3_sniperT      = _ft([{POSITION:[28,7,1,0,0,0,0],PROPERTIES:{SHOOT_SETTINGS:safeCS([g.basic,g.sniper,g.assassin,{damage:1.4,health:1.3,pen:1.2}]),TYPE:'bullet',LABEL:'Apex'}},{POSITION:[23,10,1,0,0,0,0.2],PROPERTIES:{SHOOT_SETTINGS:safeCS([g.basic,g.sniper,g.predator,{damage:1.2}]),TYPE:'bullet'}},{POSITION:[18,13,1,0,0,0,0.4],PROPERTIES:{SHOOT_SETTINGS:safeCS([g.basic,g.sniper,{damage:1.0}]),TYPE:'bullet'}}]);
    Class.EAB3_destroyerT   = _ft([{POSITION:[24,18,1,0,0,0,0],PROPERTIES:{SHOOT_SETTINGS:safeCS([g.basic,g.pounder,g.destroyer,{damage:1.5,health:1.4,size:1.1}]),TYPE:'bullet',LABEL:'Devastator'}},{POSITION:[18,20,-1.3,0,0,0,0],PROPERTIES:{COLOR:'darkGrey'}}]);
    Class.EAB3_annihilatorT = _ft([{POSITION:[24,22,1,0,0,0,0],PROPERTIES:{SHOOT_SETTINGS:safeCS([g.basic,g.pounder,g.destroyer,g.annihilator,{damage:1.8,health:1.6,size:1.3,pen:1.5}]),TYPE:'bullet',LABEL:'Obliterator'}},{POSITION:[16,24,-1.4,0,0,0,0],PROPERTIES:{COLOR:'#222'}}]);
    Class.EAB3_gunnerT      = _ft([{POSITION:[16,3.5,1,0, 7.5,0,0],   PROPERTIES:{SHOOT_SETTINGS:safeCS([g.basic,g.twin,g.gunner,{damage:1.2,speed:1.3}]),TYPE:'bullet'}},{POSITION:[16,3.5,1,0,-7.5,0,0.25],PROPERTIES:{SHOOT_SETTINGS:safeCS([g.basic,g.twin,g.gunner,{damage:1.2,speed:1.3}]),TYPE:'bullet'}},{POSITION:[20,3.5,1,0,3.5,0,0.5],PROPERTIES:{SHOOT_SETTINGS:safeCS([g.basic,g.twin,g.gunner,{damage:1.2,speed:1.3}]),TYPE:'bullet'}},{POSITION:[20,3.5,1,0,-3.5,0,0.75],PROPERTIES:{SHOOT_SETTINGS:safeCS([g.basic,g.twin,g.gunner,{damage:1.2,speed:1.3}]),TYPE:'bullet'}}]);
    Class.EAB3_streamlinerT = _ft([{POSITION:[26,8,1,0,0,0,0],PROPERTIES:{SHOOT_SETTINGS:safeCS([g.basic,g.minigun,g.streamliner,{damage:1.3}]),TYPE:'bullet'}},{POSITION:[24,8,1,0,0,0,0.16],PROPERTIES:{SHOOT_SETTINGS:safeCS([g.basic,g.minigun,g.streamliner,{damage:1.3}]),TYPE:'bullet'}},{POSITION:[22,8,1,0,0,0,0.32],PROPERTIES:{SHOOT_SETTINGS:safeCS([g.basic,g.minigun,g.streamliner,{damage:1.3}]),TYPE:'bullet'}},{POSITION:[20,8,1,0,0,0,0.48],PROPERTIES:{SHOOT_SETTINGS:safeCS([g.basic,g.minigun,g.streamliner,{damage:1.3}]),TYPE:'bullet'}},{POSITION:[18,8,1,0,0,0,0.64],PROPERTIES:{SHOOT_SETTINGS:safeCS([g.basic,g.minigun,g.streamliner,{damage:1.3}]),TYPE:'bullet'}}]);
    Class.EAB3_missileT     = _ft([{POSITION:[10,14,-0.5,9,0,0,0]},{POSITION:[18,15,1,0,0,0,0],PROPERTIES:{SHOOT_SETTINGS:safeCS([g.basic,g.pounder,g.artillery,g.artillery,g.skimmer,{damage:1.4}]),TYPE:'missile',STAT_CALCULATOR:'sustained'}}]);
    Class.EAB3_droneT       = _ft([[0,90,180,270].map((a,i)=>({POSITION:[0,8,1.1,10,0,a,i*0.25],PROPERTIES:{SHOOT_SETTINGS:safeCS([g.drone,g.overseer,{health:1.5,damage:1.4,size:1.1}]),TYPE:['drone',{INDEPENDENT:true}],AUTOFIRE:true,SYNCS_SKILLS:true,STAT_CALCULATOR:'drone',WAIT_TO_CYCLE:true,MAX_CHILDREN:3}}))].flat());
    Class.EAB3_summonerT    = _ft([[0,120,240].map((a,i)=>({POSITION:[0,8,1.1,10,0,a,i/3],PROPERTIES:{SHOOT_SETTINGS:safeCS([g.drone,g.summoner,{health:1.6,damage:1.5,size:1.2}]),TYPE:['summonerDrone',{INDEPENDENT:true}],AUTOFIRE:true,SYNCS_SKILLS:true,STAT_CALCULATOR:'drone',WAIT_TO_CYCLE:true,MAX_CHILDREN:3}}))].flat());
    Class.EAB3_swarmT       = _ft([[0,72,144,216,288].map((a,i)=>({POSITION:[0,8,1.1,10,0,a,i/5],PROPERTIES:{SHOOT_SETTINGS:safeCS([g.swarm,g.battleship,g.carrier,{damage:1.4,health:1.3}]),TYPE:['autoswarm',{INDEPENDENT:true}],AUTOFIRE:true,SYNCS_SKILLS:true,STAT_CALCULATOR:'swarm'}}))].flat());
    Class.EAB3_trapT        = _ft([...Array.from({length:6},(_,i)=>[{POSITION:[13,7,1,0,0,i*60,i/6]},{POSITION:[3,7,1.7,13,0,i*60,i/6],PROPERTIES:{SHOOT_SETTINGS:safeCS([g.trap,g.hexaTrapper,{health:1.5,damage:1.4}]),TYPE:'trap',STAT_CALCULATOR:'trap',AUTOFIRE:true}}]).flat()]);
    Class.EAB3_hiveT        = _ft([{POSITION:[22,15,-1.2,4,0,0,0],PROPERTIES:{SHOOT_SETTINGS:safeCS([g.basic,g.pounder,g.destroyer,g.hive,{damage:1.5,health:1.4,range:1.3}]),TYPE:'hive',LABEL:'Hive'}},{POSITION:[22,13,1,5,0,0,0]}]);
    Class.EAB3_spreadT      = _ft([{POSITION:[13,4,1,0,-0.5,-50,4/5],PROPERTIES:{SHOOT_SETTINGS:safeCS([g.basic,g.twin,g.gunner,g.artillery,{damage:1.2,spray:2}]),TYPE:'bullet'}},{POSITION:[13,4,1,0,0.5,50,4/5],PROPERTIES:{SHOOT_SETTINGS:safeCS([g.basic,g.twin,g.gunner,g.artillery,{damage:1.2,spray:2}]),TYPE:'bullet'}},{POSITION:[15,4,1,0,-0.5,-28,3/5],PROPERTIES:{SHOOT_SETTINGS:safeCS([g.basic,g.twin,g.gunner,g.artillery,{damage:1.2,spray:2}]),TYPE:'bullet'}},{POSITION:[15,4,1,0,0.5,28,3/5],PROPERTIES:{SHOOT_SETTINGS:safeCS([g.basic,g.twin,g.gunner,g.artillery,{damage:1.2,spray:2}]),TYPE:'bullet'}},{POSITION:[17,9,1,0,0,0,0],PROPERTIES:{SHOOT_SETTINGS:safeCS([g.basic,g.pounder,{damage:1.3}]),TYPE:'bullet'}}]);
    Class.EAB3_demonchipT   = _ft([[0,120,240].map((a,i)=>({POSITION:[0,9,1.1,10,0,a,i/3],PROPERTIES:{SHOOT_SETTINGS:safeCS([g.drone,g.summoner,g.destroyer,{health:1.8,damage:1.7,density:2,size:1.3}]),TYPE:['demonchip',{INDEPENDENT:true}],AUTOFIRE:true,SYNCS_SKILLS:true,STAT_CALCULATOR:'drone',WAIT_TO_CYCLE:true,MAX_CHILDREN:3}}))].flat());
    // ── Skimmer sub-turrets ────────────────────────────────────────────────────
    Class.EAB3_ultramissile = {PARENT:'missile',GUNS:[[135,1/3],[225,1/3],[150,0],[210,0],[90,2/3],[270,2/3]].map(([a,d],i)=>({POSITION:[i<4?12:14,6,1,0,i%2==0?-2:2,a,d],PROPERTIES:{AUTOFIRE:true,SHOOT_SETTINGS:safeCS([g.basic,{reload:3}]),TYPE:['bullet',{PERSISTS_AFTER_DEATH:true}],STAT_CALCULATOR:a<180?'thruster':undefined}}))};
    Class.EAB3_ultraMissileT= _ft([{POSITION:[10,14,-0.5,9,0,0,0]},{POSITION:[18,15,1,0,0,0,0],PROPERTIES:{SHOOT_SETTINGS:safeCS([g.basic,g.pounder,g.artillery,g.artillery,g.skimmer,{damage:1.5}]),TYPE:'EAB3_ultramissile',STAT_CALCULATOR:'sustained'}},{POSITION:[3,9.5,0.775,15.75,0,0,0]}]);
    Class.EAB3_salvoT       = _ft([{POSITION:[10,12,-0.5,9,0,0,0]},...[2,-2,0].map((y,i)=>({POSITION:[16,13,1,0,y,0,i*0.2],PROPERTIES:{SHOOT_SETTINGS:safeCS([g.basic,g.pounder,g.artillery,g.artillery,g.skimmer,{damage:1.3}]),TYPE:'missile',STAT_CALCULATOR:'sustained'}}))]);
    Class.EAB3_hiveMissT    = _ft([{POSITION:[10,13,-0.5,9,0,0,0]},{POSITION:[17,14,1,0,0,0,0],PROPERTIES:{SHOOT_SETTINGS:safeCS([g.basic,g.pounder,g.destroyer,g.hive,g.skimmer,{damage:1.3,range:1.2}]),TYPE:'hive',STAT_CALCULATOR:'sustained'}}]);
    // ── Spawner helpers ────────────────────────────────────────────────────────
    Class.EAB3_crasherSpawner     = makeTurret({GUNS:[{POSITION:[6,12,1.2,8,0,0,0],PROPERTIES:{SHOOT_SETTINGS:safeCS([g.drone,g.weak,g.weak,{health:1.1}]),TYPE:['drone',{LABEL:'Crasher',DRAW_HEALTH:true}],SYNCS_SKILLS:true,AUTOFIRE:true,STAT_CALCULATOR:'drone',MAX_CHILDREN:4}}]},{independent:true,label:'Spawned',color:'pink'});
    Class.EAB3_megaCrasherSpawner = makeTurret({GUNS:[{POSITION:[6,16,1.2,8,0,0,0],PROPERTIES:{SHOOT_SETTINGS:safeCS([g.drone,g.weak,g.weak,g.pounder,{health:1.1}]),TYPE:['drone',{LABEL:'Mega Crasher',DRAW_HEALTH:true}],SYNCS_SKILLS:true,AUTOFIRE:true,STAT_CALCULATOR:'drone',MAX_CHILDREN:2}}]},{independent:true,label:'Spawned',color:'pink'});
    Class.EAB3_turrCrasherSpawner = makeTurret({GUNS:[{POSITION:[6,12,1.2,8,0,0,0],PROPERTIES:{SHOOT_SETTINGS:safeCS([g.drone,g.weak,g.weak,{health:1.1}]),TYPE:['turretedDrone',{LABEL:'Auto-Crasher',DRAW_HEALTH:true}],SYNCS_SKILLS:true,AUTOFIRE:true,STAT_CALCULATOR:'drone',MAX_CHILDREN:4}}]},{independent:true,label:'Spawned',color:'pink'});
    Class.EAB3_superSwarmMin  = {PARENT:'sentrySwarmMinion',GUNS:weaponMirror({POSITION:[7,10,0.6,7,5.5,180,0],PROPERTIES:{SHOOT_SETTINGS:safeCS([g.swarm,{recoil:1.15,range:0.9}]),TYPE:'swarm',STAT_CALCULATOR:'swarm'}},{delayIncrement:0.5})};
    Class.EAB3_superGunMin    = {PARENT:'sentryGunMinion',  TURRETS:[{POSITION:[12,0,0,0,360,1],TYPE:['ultraAutoTankGun',{GUN_STAT_SCALE:{health:0.8}}]}]};
    Class.EAB3_superTrapMin   = {PARENT:'sentryTrapMinion', TURLETS:[{POSITION:[12,0,0,0,360,1],TYPE:'megaTrapTurret'}]};
    // ── Spinner center turrets ─────────────────────────────────────────────────
    Class.EAB3_galeTurret    = {PARENT:'genericTank',COLOR:-1,FACING_TYPE:['spin',{speed:-0.10,independent:true}],GUNS:[...weaponArray([{POSITION:[18,8,1,0,0,45,0.5],PROPERTIES:{SHOOT_SETTINGS:safeCS([g.basic,g.flankGuard,g.flankGuard,g.spam]),TYPE:'bullet'}},{POSITION:[18,8,1,0,0,0,0],PROPERTIES:{SHOOT_SETTINGS:safeCS([g.basic,g.flankGuard,g.flankGuard,g.spam]),TYPE:'bullet'}}],4),...weaponArray([{POSITION:[14,3.5,1,0,0,-15,0],PROPERTIES:{SHOOT_SETTINGS:safeCS([g.basic,g.twin,g.gunner,g.cyclone]),TYPE:'bullet'}},{POSITION:[14,3.5,1,0,0,15,0.5],PROPERTIES:{SHOOT_SETTINGS:safeCS([g.basic,g.twin,g.gunner,g.cyclone]),TYPE:'bullet'}}],4)]};
    Class.EAB3_troveTurret   = {PARENT:'genericTank',COLOR:-1,FACING_TYPE:['spin',{speed:-0.10,independent:true}],GUNS:weaponArray([{POSITION:[14,3.5,1,0,0,-15,0],PROPERTIES:{SHOOT_SETTINGS:safeCS([g.basic,g.twin,g.gunner,g.cyclone]),TYPE:'bullet'}},{POSITION:[14,3.5,1,0,0,15,0.5],PROPERTIES:{SHOOT_SETTINGS:safeCS([g.basic,g.twin,g.gunner,g.cyclone]),TYPE:'bullet'}}],4),TURRETS:weaponArray({POSITION:[11,7,0,45,180,0],TYPE:['auto4gun',{INDEPENDENT:true}]},4)};
    Class.EAB3_blizzardTurret= {PARENT:'genericTank',COLOR:-1,FACING_TYPE:['spin',{speed:-0.12,independent:true}],GUNS:[...weaponArray([{POSITION:[15,4,1,0,0.5,35,0],PROPERTIES:{SHOOT_SETTINGS:safeCS([g.basic,g.flankGuard,g.flankGuard,{spray:5,damage:1.1}]),TYPE:'bullet'}},{POSITION:[15,4,1,0,-0.5,-35,0.5],PROPERTIES:{SHOOT_SETTINGS:safeCS([g.basic,g.flankGuard,g.flankGuard,{spray:5,damage:1.1}]),TYPE:'bullet'}}],5),...weaponArray([{POSITION:[12,3.5,1,0,0,-15,0],PROPERTIES:{SHOOT_SETTINGS:safeCS([g.basic,g.twin,g.gunner,g.cyclone]),TYPE:'bullet'}},{POSITION:[12,3.5,1,0,0,15,0.5],PROPERTIES:{SHOOT_SETTINGS:safeCS([g.basic,g.twin,g.gunner,g.cyclone]),TYPE:'bullet'}}],5)]};
    Class.EAB3_maelstromTurret={PARENT:'genericTank',COLOR:-1,FACING_TYPE:['spin',{speed:-0.16,independent:true}],GUNS:[...weaponArray([{POSITION:[20,8,1,0,0,40,0.5],PROPERTIES:{SHOOT_SETTINGS:safeCS([g.basic,g.flankGuard,g.spam,{damage:1.2,reload:0.6}]),TYPE:'bullet'}},{POSITION:[20,8,1,0,0,0,0],PROPERTIES:{SHOOT_SETTINGS:safeCS([g.basic,g.flankGuard,g.spam,{damage:1.2,reload:0.6}]),TYPE:'bullet'}}],6),...weaponArray([{POSITION:[14,3.5,1,0,0,-15,0],PROPERTIES:{SHOOT_SETTINGS:safeCS([g.basic,g.twin,g.gunner,g.cyclone]),TYPE:'bullet'}},{POSITION:[14,3.5,1,0,0,15,0.5],PROPERTIES:{SHOOT_SETTINGS:safeCS([g.basic,g.twin,g.gunner,g.cyclone]),TYPE:'bullet'}}],6)]};
    Class.EAB3_hexaSpinTurret= {PARENT:'genericTank',FACING_TYPE:['spin',{speed:0.06}],INDEPENDENT:true,COLOR:-1,GUNS:weaponArray({POSITION:[12,9.75,1.4,8,0,0,0],PROPERTIES:{SHOOT_SETTINGS:safeCS([g.basic,g.machineGun,g.flankGuard,g.flankGuard]),TYPE:'bullet',AUTOFIRE:true}},6)};
    Class.EAB3_tripleSprayT  = {PARENT:'genericTank',FACING_TYPE:['spin',{speed:0.06}],INDEPENDENT:true,COLOR:-1,GUNS:weaponArray([{POSITION:[23,7,1,0,0,0,0],PROPERTIES:{SHOOT_SETTINGS:safeCS([g.basic,g.machineGun,g.lowPower,g.pelleter,{recoil:1.15},g.flankGuard]),TYPE:'bullet',AUTOFIRE:true}},{POSITION:[12,10,1.4,8,0,0,0],PROPERTIES:{SHOOT_SETTINGS:safeCS([g.basic,g.machineGun,g.flankGuard]),TYPE:'bullet',AUTOFIRE:true}}],3)};
    Class.EAB3_streamHexaT   = {PARENT:'genericTank',FACING_TYPE:['spin',{speed:0.07,independent:true}],INDEPENDENT:true,COLOR:-1,GUNS:weaponArray({POSITION:[22,7,1,0,0,0,0],PROPERTIES:{SHOOT_SETTINGS:safeCS([g.basic,g.minigun,g.streamliner,{damage:1.2,reload:0.4}]),TYPE:'bullet',AUTOFIRE:true}},6)};
    Class.EAB3_biggerauto4g  = makeTurret({GUNS:[...[-5,-2.5,0,2.5,5].map((y,i)=>({POSITION:[12+i*0.4,5,1,0,y,0,i*0.2],PROPERTIES:{SHOOT_SETTINGS:safeCS([g.basic,g.pelleter,g.twin,g.twin,g.twin,g.power,{reload:2}]),TYPE:'bullet'}}))]},{canRepel:true,limitFov:true,fov:3});

// ══════════════════════════════════════════════════════════════════════════════
//  BOBS  (aqua, circle, ram)
// ══════════════════════════════════════════════════════════════════════════════
    const _bob=(lbl,tip,sz,spd,hp,dmg,dn,T)=>({PARENT:'ramMiniboss',LABEL:lbl,UPGRADE_TOOLTIP:tip,SHAPE:0,COLOR:'aqua',UPGRADE_COLOR:'aqua',SIZE:sz,BODY:{SPEED:spd*base.SPEED,HEALTH:hp*base.HEALTH,DAMAGE:dmg*base.DAMAGE,REGEN:8*base.REGEN,FOV:0.5*base.FOV,DENSITY:dn*base.DENSITY},CONTROLLERS:['nearestDifferentMaster','mapTargetToGoal'],TURRETS:T});
    const hH=(d,a=0) =>({POSITION:[d,0,0,a,360,0],TYPE:['hexagonHat_spin',     {COLOR:'black'}]});
    const hHF=(d,a=30)=>({POSITION:[d,0,0,a,360,0],TYPE:['hexagonHat_spinFaster',{COLOR:'black'}]});
    const hT=(d,a=0) =>({POSITION:[d,0,0,a,360,0],TYPE:['triangleHat_spin',    {COLOR:'black'}]});
    const hTF=(d,a=60)=>({POSITION:[d,0,0,a,360,0],TYPE:['triangleHat_spinFast', {COLOR:'black'}]});
    const hS=(d,a=0) =>({POSITION:[d,0,0,a,360,0],TYPE:['squareHat_spin',       {COLOR:'black'}]});
    const hP=(d,a=0) =>({POSITION:[d,0,0,a,360,0],TYPE:['pentagonHat_spin',     {COLOR:'black'}]});
    const aSm=()=>({POSITION:ctr(11,360),TYPE:['autoSmasherTurret',{INDEPENDENT:false}]});
    const a4=(d)=>({POSITION:ring(8,d,0,360),TYPE:['auto4gun',{INDEPENDENT:true,COLOR:-1}]});
    Class.EAB3_megaBob    = _bob('Mega Bob',    '(Mega)',     18,1.8,10, 4.5,7.5,[hH(24.5),hHF(24.5),hT(23.75)]);
    Class.EAB3_bobby      = _bob('Bobby',       '(Spike)',    18,1.8,4.5,10, 6,  [hH(24.5),hHF(24.5),hT(24),hTF(24)]);
    Class.EAB3_autoBob    = _bob('Auto-Bob',    '(Auto)',     18,1.9,4.8,4.8,6,  [hH(24.5),hHF(24.5),hT(23.75),aSm()]);
    Class.EAB3_hob        = _bob('Hob',         '(Bonker)',  12.5,2.5,3.5,5.5,4, [hH(24.5),hHF(24.5),hT(24)]);
    Class.EAB3_rupert     = _bob('Rupert',       '(Banger)',   28,2.0,7.0,4.0,12,[hH(24.5),hHF(24.5),hT(23)]);
    Class.EAB3_squareBob  = _bob('Square Bob',  '(Square)',   22,1.5,8.0,5.0,14,[hH(22),hHF(22),hS(25),hS(25,90),hT(23.75)]);
    Class.EAB3_pentaBob   = _bob('Penta Bob',   '(Penta)',    20,1.6,12, 4.2,8, [hH(22),hHF(22),hP(26),hP(26,72),hT(24)]);
    Class.EAB3_twinBob    = _bob('Twin Bob',    '(Twin)',     16,2.0,5.5,5.5,5.5,[hH(22),hHF(22),hT(24),aSm(),a4(7)]);
    Class.EAB3_destroyerBob=_bob('Destroyer Bob','(Destroyer)',24,1.4,14, 3.5,16,[hH(25),hHF(25),hT(25),hTF(25),aSm()]);
    Class.EAB3_cycloneBob = Object.assign(_bob('Cyclone Bob','(Cyclone)',17,3.0,3.0,5.0,4,[hH(22),hHF(22),hT(23),hTF(23)]),{FACING_TYPE:['spin',{speed:0.15}]});
    Class.EAB3_juggernautBob=_bob('Juggernaut Bob','(Juggernaut)',30,1.2,16,3.0,20,[hH(26),hHF(26),hT(26),hTF(26),aSm(),a4(9)]);
    Class.EAB3_swarmBob   = Object.assign(_bob('Swarm Bob','(Swarm)',18,1.9,5,5,5.5,[hH(22),hHF(22),hT(23.75)]),{GUNS:weaponArray({POSITION:[6,10,1.2,8,0,0,0],PROPERTIES:{SHOOT_SETTINGS:safeCS([g.drone,g.weak,g.weak,{health:1.2}]),TYPE:['drone',{LABEL:'Crasher',DRAW_HEALTH:true}],SYNCS_SKILLS:true,AUTOFIRE:true,STAT_CALCULATOR:'drone',MAX_CHILDREN:2}},6)});
    Class.EAB3_fortressBob= _bob('Fortress Bob','(Fortress)', 26,0.8,20,3.0,25,[hH(22),hHF(22),hT(23.75),hTF(23.75),...weaponArray({POSITION:ring(8,9,0,180),TYPE:['auto4gun',{INDEPENDENT:true,COLOR:'aqua'}]},4),aSm()]);

// ══════════════════════════════════════════════════════════════════════════════
//  NEMESES  (red, circle, extreme stats)
// ══════════════════════════════════════════════════════════════════════════════
    const _nem=(lbl,tip,sz,spd,hp,dmg,dn,fov,T,extraGuns=[])=>({PARENT:'ramMiniboss',LABEL:lbl,UPGRADE_TOOLTIP:tip,SHAPE:0,COLOR:'red',UPGRADE_COLOR:'red',SIZE:sz,BODY:{SPEED:spd*base.SPEED,HEALTH:hp,DAMAGE:dmg,REGEN:1e5,FOV:fov,DENSITY:dn},CONTROLLERS:['nearestDifferentMaster','mapTargetToGoal'],TURRETS:T,GUNS:extraGuns});
    const rH =({POSITION:[24.5,0,0,0, 360,0],TYPE:['hexagonHat_spin',     {COLOR:'black'}]});
    const rHF=({POSITION:[24.5,0,0,30,360,0],TYPE:['hexagonHat_spinFaster',{COLOR:'black'}]});
    const rT =({POSITION:[24,  0,0,0, 360,0],TYPE:['triangleHat_spin',    {COLOR:'black'}]});
    const rTF=({POSITION:[24,  0,0,60,360,0],TYPE:['triangleHat_spinFast', {COLOR:'black'}]});
    const rA =({POSITION:ctr(11,360), TYPE:['autoSmasherTurret',{INDEPENDENT:false}]});
    const r4 = d=>({POSITION:ring(8,d,0,360),TYPE:['auto4gun',{INDEPENDENT:true,COLOR:'red'}]});
    Class.EAB3_megaNemesis  = _nem('Mega Nemesis', '(Mega)',     18,1.8,2e6,  9e4, 37.5,5,  [rH,rHF,{POSITION:[23.75,0,0,0,360,0],TYPE:['triangleHat_spin',{COLOR:'black'}]}]);
    Class.EAB3_antagonist   = _nem('Antagonist',  '(Spike)',    18,1.8,9e5,  2e5, 30,  5,  [rH,rHF,rT,rTF]);
    Class.EAB3_autoNemesis  = _nem('Auto-Nemesis','(Auto)',     18,1.9,9.6e5,9.6e4,30,6.5,[rH,rHF,{POSITION:[23.75,0,0,0,360,0],TYPE:['triangleHat_spin',{COLOR:'black'}]},rA]);
    Class.EAB3_rival        = _nem('Rival',       '(Bonker)',  12.5,2.5,7e5, 1.1e5,20,4.5,[rH,rHF,rT]);
    Class.EAB3_bandit       = _nem('Bandit',      '(Banger)',   28,2.0,1.4e6,8e4, 60,5,  [rH,rHF,{POSITION:[23,0,0,0,360,0],TYPE:['triangleHat_spin',{COLOR:'black'}]}]);
    Class.EAB3_juggernaut   = _nem('Juggernaut',  '(Juggernaut)',36,1.2,3e6, 7e4, 90,4,  [rH,rHF,rT,rTF,rA,r4(12)]);
    Class.EAB3_blitz        = _nem('Blitz',       '(Blitz)',    10,4.0,5e5,  1.5e5,15,6,  [rH,rHF,rTF,{POSITION:[22,0,0,120,360,0],TYPE:['triangleHat_spinFast',{COLOR:'black'}]}]);
    Class.EAB3_turretNemesis= _nem('Turret Nemesis','(Turret)', 20,2.0,1.2e6,8e4, 30,5.5,[rH,rHF,rT,...weaponArray({POSITION:ring(8,8,0,180),TYPE:['auto4gun',{INDEPENDENT:true,COLOR:-1}]},4)]);
    Class.EAB3_swarmNemesis = _nem('Swarm Nemesis','(Swarm)',   18,2.1,1e6,  8.5e4,28,5.5,[rH,rHF,rT],[...weaponArray({POSITION:[6,10,1.2,8,0,0,0],PROPERTIES:{SHOOT_SETTINGS:safeCS([g.drone,g.weak,g.weak,{health:1.2}]),TYPE:['drone',{LABEL:'Crasher',DRAW_HEALTH:true}],SYNCS_SKILLS:true,AUTOFIRE:true,STAT_CALCULATOR:'drone',MAX_CHILDREN:2}},6)]);
    Class.EAB3_fortressNemesis=_nem('Fortress Nemesis','(Fortress)',26,0.5,4e6,6e4,50,5.5,[rH,rHF,rT,rTF,...weaponArray({POSITION:ring(9,9,0,180),TYPE:['auto4gun',{INDEPENDENT:true,COLOR:'red'}]},6),{POSITION:ctr(7,360),TYPE:['auto4gun',{INDEPENDENT:true,COLOR:-1}]}]);
    Class.EAB3_hexNemesis   = _nem('Hex Nemesis',  '(Hex)',     18,2.0,1.1e6,1e5, 32,5,  [rH,rHF,...weaponArray({POSITION:ring(8,10,0,120),TYPE:['hexagonHat_spin',{COLOR:'black'}]},6)]);
    Class.EAB3_ghostNemesis = Object.assign(_nem('Ghost Nemesis','(Ghost)',18,2.5,8e5,9e4,22,6,[rH,rHF,rT]),{INVISIBLE:[0.4,0.1]});
    Class.EAB3_overlordNemesis=_nem('Overlord Nemesis','(Overlord)',22,1.7,1.3e6,8.5e4,35,5.5,[rH,rHF,rT,rTF],[...[0,90,180,270].map((a,i)=>({POSITION:[0,9,1.1,10,0,a,i*0.25],PROPERTIES:{SHOOT_SETTINGS:safeCS([g.drone,g.overseer,{health:1.5,damage:1.4,size:1.2}]),TYPE:['drone',{INDEPENDENT:true}],AUTOFIRE:true,SYNCS_SKILLS:true,STAT_CALCULATOR:'drone',WAIT_TO_CYCLE:true,MAX_CHILDREN:3}}))]);

// ══════════════════════════════════════════════════════════════════════════════
//  LAYERED CELESTIALS — 3 rings of 9 at distances 8.5/9/9.5, staggered
// ══════════════════════════════════════════════════════════════════════════════
    const _cel=(lbl,col,t0,t1,t2,body={},msg)=>({
        PARENT:'celestial_CLSTL',LABEL:lbl,COLOR:col,UPGRADE_COLOR:col,
        BROADCAST_MESSAGE:msg||(lbl+' vanquished!'),BODY:body,
        TURRETS:[
            ...Array.from({length:9},(_,i)=>({POSITION:ring(6.5,8.5,i*40,180),    TYPE:[t0,{GUN_STAT_SCALE:{damage:1.25,health:1.15}}]})),
            ...Array.from({length:9},(_,i)=>({POSITION:ring(8.0,9.0,i*40+13.3,180),TYPE:[t1,{GUN_STAT_SCALE:{damage:1.25,health:1.15}}]})),
            ...Array.from({length:9},(_,i)=>({POSITION:ring(9.5,9.5,i*40+26.7,180),TYPE:[t2,{GUN_STAT_SCALE:{damage:1.25,health:1.15}}]})),
        ],
    });
    Class.EAB3_solarCel     = _cel('Solar',    '#ffcc44','EAB3_destroyerT', 'EAB3_gunnerT',    'EAB3_missileT',    {SPEED:base.SPEED*0.30,HEALTH:1000,SHIELD:130});
    Class.EAB3_lunarCel     = _cel('Lunar',    '#c8d8ff','EAB3_sniperT',    'EAB3_droneT',     'EAB3_spreadT',     {SPEED:base.SPEED*0.28,HEALTH:950, SHIELD:150});
    Class.EAB3_ignisCel     = _cel('Ignis',    '#ff4422','EAB3_annihilatorT','EAB3_missileT',  'EAB3_gunnerT',     {SPEED:base.SPEED*0.32,HEALTH:980, SHIELD:100});
    Class.EAB3_marisCel     = _cel('Maris',    '#3388ff','EAB3_swarmT',     'EAB3_streamlinerT','EAB3_droneT',     {SPEED:base.SPEED*0.33,HEALTH:900, SHIELD:140});
    Class.EAB3_terraeCel    = _cel('Terrae',   '#44bb44','EAB3_trapT',      'EAB3_hiveT',      'EAB3_destroyerT',  {SPEED:base.SPEED*0.26,HEALTH:1100,SHIELD:160});
    Class.EAB3_tonitrumCel  = _cel('Tonitrum', '#8844ff','EAB3_gunnerT',    'EAB3_ultraMissileT','EAB3_streamlinerT',{SPEED:base.SPEED*0.34,HEALTH:880,SHIELD:90});
    Class.EAB3_glaCel       = _cel('Gla',      '#aaeeff','EAB3_sniperT',    'EAB3_trapT',      'EAB3_missileT',    {SPEED:base.SPEED*0.25,HEALTH:1020,SHIELD:180,REGEN:base.REGEN*0.06});
    Class.EAB3_noxCel       = _cel('Nox',      '#110022','EAB3_demonchipT', 'EAB3_swarmT',     'EAB3_sniperT',     {SPEED:base.SPEED*0.27,HEALTH:940, SHIELD:145});
    Class.EAB3_auroraCel    = _cel('Aurora',   '#88ffcc','EAB3_hiveT',      'EAB3_summonerT',  'EAB3_spreadT',     {SPEED:base.SPEED*0.30,HEALTH:890, SHIELD:120});
    Class.EAB3_vortexCel    = _cel('Vortex',   '#cc44ff','EAB3_streamlinerT','EAB3_gunnerT',   'EAB3_droneT',      {SPEED:base.SPEED*0.36,HEALTH:860, SHIELD:85});
    Class.EAB3_inferniCel   = _cel('Inferni',  '#ff6600','EAB3_annihilatorT','EAB3_hiveT',     'EAB3_spreadT',     {SPEED:base.SPEED*0.28,HEALTH:1050,SHIELD:105});
    Class.EAB3_crystallisCel= _cel('Crystallis','#88ddff','EAB3_trapT',     'EAB3_sniperT',    'EAB3_swarmT',      {SPEED:base.SPEED*0.24,HEALTH:1100,SHIELD:200,REGEN:base.REGEN*0.07});

// ══════════════════════════════════════════════════════════════════════════════
//  LAYERED TERRESTRIALS — 3 rings of 7, distances 8.5/10.5/12.5
// ══════════════════════════════════════════════════════════════════════════════
    const _ter=(lbl,col,t0,t1,t2,body={},msg)=>({
        PARENT:'miniboss',LABEL:lbl,DANGER:9,SHAPE:7.5,COLOR:col,UPGRADE_COLOR:col,
        SIZE:55,VALUE:3e6,SKILL_CAP:Array(10).fill(9),
        BODY:{FOV:0.8,SPEED:0.18*base.SPEED,HEALTH:3500,DAMAGE:10,REGEN:base.REGEN*0.05,SHIELD:200,...body},
        HITS_OWN_TYPE:'boss',BROADCAST_MESSAGE:msg||(lbl+' falls!'),GUNS:[],
        TURRETS:[
            ...Array.from({length:7},(_,i)=>({POSITION:ring(8.5,9,  i*(360/7),180),         TYPE:[t0,{GUN_STAT_SCALE:{damage:1.3,health:1.2}}]})),
            ...Array.from({length:7},(_,i)=>({POSITION:ring(10.5,9.5,i*(360/7)+360/14,180), TYPE:[t1,{GUN_STAT_SCALE:{damage:1.3,health:1.2}}]})),
            ...Array.from({length:7},(_,i)=>({POSITION:ring(12.5,10, i*(360/7)+360/14*1.5,180),TYPE:[t2,{GUN_STAT_SCALE:{damage:1.3,health:1.2}}]})),
            {POSITION:ctr(6,360),TYPE:['auto4gun',{INDEPENDENT:true,COLOR:-1}]},
        ],
    });
    Class.EAB3_marsTer   = _ter('Mars',   'red',    'EAB3_annihilatorT','EAB3_ultraMissileT','EAB3_gunnerT',  {SPEED:0.22*base.SPEED,HEALTH:3800},'Mars, God of War, slain!');
    Class.EAB3_neptuneTer= _ter('Neptune','#3366cc','EAB3_swarmT',      'EAB3_droneT',       'EAB3_missileT', {SPEED:0.16*base.SPEED,HEALTH:3600,SHIELD:280},'Neptune recedes!');
    Class.EAB3_venusTer  = _ter('Venus',  '#ffddaa','EAB3_hiveT',       'EAB3_summonerT',    'EAB3_spreadT',  {SPEED:0.18*base.SPEED,HEALTH:3200,SHIELD:320,REGEN:base.REGEN*0.07},'Venus fades!');
    Class.EAB3_mercuryTer= _ter('Mercury','#aaaaaa','EAB3_sniperT',     'EAB3_streamlinerT', 'EAB3_ultraMissileT',{SPEED:0.30*base.SPEED,HEALTH:2900,SHIELD:150},'Mercury slips away!');
    Class.EAB3_jupiterTer= _ter('Jupiter','#dd9955','EAB3_demonchipT',  'EAB3_annihilatorT', 'EAB3_swarmT',   {SPEED:0.13*base.SPEED,HEALTH:5000,SHIELD:400},'Jupiter falls!');
    Class.EAB3_saturnTer = _ter('Saturn', '#ccbb88','EAB3_trapT',       'EAB3_destroyerT',   'EAB3_sniperT',  {SPEED:0.14*base.SPEED,HEALTH:4300,SHIELD:360},'Saturn rings shatter!');
    Class.EAB3_uranusTer = _ter('Uranus', '#88eeff','EAB3_streamlinerT','EAB3_trapT',        'EAB3_droneT',   {SPEED:0.17*base.SPEED,HEALTH:3700,SHIELD:250},'Uranus spins out!');
    Class.EAB3_plutoTer  = _ter('Pluto',  '#334455','EAB3_sniperT',     'EAB3_demonchipT',   'EAB3_hiveT',    {SPEED:0.20*base.SPEED,HEALTH:3300,SHIELD:180,REGEN:base.REGEN*0.06},'Pluto banished!');

// ══════════════════════════════════════════════════════════════════════════════
//  LAYERED ETERNALS — 4 rings of 11, distances 6/7.5/9/10.5
// ══════════════════════════════════════════════════════════════════════════════
    const _eter=(lbl,col,t0,t1,t2,t3,body={},msg)=>({
        PARENT:'eternal_CLSTL',LABEL:lbl,COLOR:col,UPGRADE_COLOR:col,
        BROADCAST_MESSAGE:msg||(lbl+' defeated!'),BODY:body,
        TURRETS:[
            ...Array.from({length:11},(_,i)=>({POSITION:ring(6,8,   i*(360/11),180),        TYPE:[t0,{GUN_STAT_SCALE:{damage:1.45,health:1.35}}]})),
            ...Array.from({length:11},(_,i)=>({POSITION:ring(7.5,8.5,i*(360/11)+10.9,180),  TYPE:[t1,{GUN_STAT_SCALE:{damage:1.45,health:1.35}}]})),
            ...Array.from({length:11},(_,i)=>({POSITION:ring(9,9,   i*(360/11)+21.8,180),   TYPE:[t2,{GUN_STAT_SCALE:{damage:1.45,health:1.35}}]})),
            ...Array.from({length:11},(_,i)=>({POSITION:ring(10.5,9.5,i*(360/11)+32.7,180), TYPE:[t3,{GUN_STAT_SCALE:{damage:1.45,health:1.35}}]})),
        ],
    });
    Class.EAB3_kronosEter  = _eter('Kronos',  '#888888','EAB3_annihilatorT','EAB3_ultraMissileT','EAB3_gunnerT',    'EAB3_streamlinerT',{HEALTH:2600,SHIELD:370,SPEED:0.13*base.SPEED,DAMAGE:12},'Kronos, lord of time, stopped!');
    Class.EAB3_odinEter    = _eter('Odin',    '#4455cc','EAB3_droneT',      'EAB3_sniperT',      'EAB3_swarmT',     'EAB3_missileT',    {HEALTH:2300,SHIELD:420,SPEED:0.16*base.SPEED,DAMAGE:10,REGEN:base.REGEN*0.08},'Odin falls from Asgard!');
    Class.EAB3_nuxEter     = _eter('Nux',     '#000011','EAB3_swarmT',      'EAB3_demonchipT',   'EAB3_hiveT',      'EAB3_droneT',      {HEALTH:3000,SHIELD:320,SPEED:0.11*base.SPEED,DAMAGE:14},'Nux, the void, sealed!');
    Class.EAB3_heraEter    = _eter('Hera',    '#ffccdd','EAB3_sniperT',     'EAB3_destroyerT',   'EAB3_ultraMissileT','EAB3_summonerT',  {HEALTH:2700,SHIELD:400,SPEED:0.15*base.SPEED,DAMAGE:11,REGEN:base.REGEN*0.10},'Hera, queen eternal, retreats!');
    Class.EAB3_aresEter    = _eter('Ares',    '#cc1100','EAB3_annihilatorT','EAB3_gunnerT',      'EAB3_ultraMissileT','EAB3_destroyerT', {HEALTH:2900,SHIELD:280,SPEED:0.17*base.SPEED,DAMAGE:15},'Ares, war eternal, defeated!');
    Class.EAB3_poseidonEter= _eter('Poseidon','#1144cc','EAB3_swarmT',      'EAB3_spreadT',      'EAB3_droneT',     'EAB3_hiveT',       {HEALTH:2800,SHIELD:450,SPEED:0.14*base.SPEED,DAMAGE:12,REGEN:base.REGEN*0.09},'Poseidon sinks!');

// ══════════════════════════════════════════════════════════════════════════════
//  ELITES
//  Turret position conventions:
//   - Elite body is a triangle. Arms point at angles 60/180/300 degrees.
//   - Arm tip turrets: POSITION: ring(SIZE, DIST, 60, ARC)  (with weaponArray×3 for all arms)
//   - Center turret:   POSITION: ctr(SIZE, ARC)
//   - The number in ring() positions controls flush look — DIST≈8 keeps turrets
//     snug against the arm tips; larger values push them further out.
// ══════════════════════════════════════════════════════════════════════════════

    // ── Elite Destroyer (9 variants) ─────────────────────────────────────────
    const _ED = (tip,guns,spawnT='EAB3_crasherSpawner',cenT='bigauto4gun') => ({
        PARENT:'elite',UPGRADE_LABEL:'Elite Destroyer',UPGRADE_TOOLTIP:tip,UPGRADE_COLOR:'pink',
        GUNS:guns,
        TURRETS:[...weaponArray({POSITION:ring(11,11,60,360),TYPE:spawnT},3),{POSITION:ctr(11,360),TYPE:[cenT,{INDEPENDENT:true,COLOR:-1}]}],
    });
    Class.EAB3_eliteDestroyerBigMac     = _ED('(Big Mac)',    [...weaponArray({POSITION:[5,25,-0.7,4,0,60,0]},3),...weaponArray({POSITION:[5,25,1,9,0,60,0],PROPERTIES:{SHOOT_SETTINGS:safeCS([g.basic,g.pounder,g.pounder,g.destroyer,g.destroyer]),TYPE:'bullet',LABEL:'Obliterator'}},3)]);
    Class.EAB3_eliteDestroyerConstructor= _ED('(Constructor)',[...weaponArray({POSITION:[5,15.5,1,6,0,60,0]},3),...weaponArray({POSITION:[1.5,15.5,1.05,11,0,60,0],PROPERTIES:{SHOOT_SETTINGS:safeCS([g.basic,g.setTrap,g.pounder,g.pounder,g.destroyer]),TYPE:'unsetTrap',LABEL:'Producer'}},3)]);
    Class.EAB3_eliteDestroyerLauncher   = _ED('(Launcher)',   [...weaponArray({POSITION:[6.5,14,1,6,0,60,0]},3),...weaponArray({POSITION:[5,16.5,1,6,0,60,0],PROPERTIES:{SHOOT_SETTINGS:safeCS([g.basic,g.pounder,g.pounder,g.destroyer,g.launcher]),TYPE:'minimissile',LABEL:'Diluter'}},3)]);
    Class.EAB3_eliteDestroyerPenta      = {PARENT:'elite',UPGRADE_LABEL:'Elite Destroyer',UPGRADE_TOOLTIP:'(Penta)',UPGRADE_COLOR:'pink',GUNS:weaponArray({POSITION:[5,16,1,6,0,60,0],PROPERTIES:{SHOOT_SETTINGS:safeCS([g.basic,g.pounder,g.pounder,g.destroyer]),TYPE:'bullet',LABEL:'Devastator'}},3),TURRETS:[...weaponArray({POSITION:ring(11,11,60,360),TYPE:'EAB3_crasherSpawner'},3),{POSITION:ctr(12,360),TYPE:['EAB3_biggerauto4g',{INDEPENDENT:true,COLOR:-1}]}]};
    Class.EAB3_eliteDestroyerDrive      = {PARENT:'elite',UPGRADE_LABEL:'Elite Destroyer',UPGRADE_TOOLTIP:'(Drive)',UPGRADE_COLOR:'pink',GUNS:weaponArray({POSITION:[5,16,1,6,0,60,0],PROPERTIES:{SHOOT_SETTINGS:safeCS([g.basic,g.pounder,g.pounder,g.destroyer]),TYPE:'bullet',LABEL:'Devastator'}},3),TURRETS:[...weaponArray({POSITION:ring(11,11,60,360),TYPE:'EAB3_turrCrasherSpawner'},3),{POSITION:ctr(11,360),TYPE:['triangle',{INDEPENDENT:true,MIRROR_MASTER_ANGLE:true,COLOR:'grey'}]},{POSITION:ctr(11,360),TYPE:['bigauto4gun',{INDEPENDENT:true,COLOR:-1}]}]};
    Class.EAB3_eliteDestroyerHoncho     = _ED('(Honcho)',     [...weaponArray({POSITION:[5,16,1,6,0,60,0],PROPERTIES:{SHOOT_SETTINGS:safeCS([g.basic,g.pounder,g.pounder,g.destroyer]),TYPE:'bullet',LABEL:'Devastator'}},3),...weaponArray({POSITION:[8,11,0.5,6,0,0,0]},3)],'EAB3_megaCrasherSpawner');
    Class.EAB3_eliteDestroyerDoper      = _ED('(Doper)',      [...weaponArray({POSITION:[5,16,1,6,0,60,0],PROPERTIES:{SHOOT_SETTINGS:safeCS([g.basic,g.pounder,g.pounder,g.destroyer]),TYPE:'bullet',LABEL:'Devastator'}},3),...weaponArray({POSITION:[4,2,0.5,14,0,0,0]},3)],'EAB3_crasherSpawner');
    Class.EAB3_eliteDestroyerAnni       = _ED('(Annihilator)',[...weaponArray({POSITION:[5,26,-0.5,4,0,60,0]},3),...weaponArray({POSITION:[5,26,1,9,0,60,0],PROPERTIES:{SHOOT_SETTINGS:safeCS([g.basic,g.pounder,g.pounder,g.destroyer,g.destroyer,g.annihilator]),TYPE:'bullet',LABEL:'Annihilator'}},3)],'EAB3_megaCrasherSpawner');
    Class.EAB3_eliteDestroyerMissile    = _ED('(Missile)',    [...weaponArray({POSITION:[6,14,1,6,0,60,0]},3),...weaponArray({POSITION:[5,16.5,1,6,0,60,0],PROPERTIES:{SHOOT_SETTINGS:safeCS([g.basic,g.pounder,g.destroyer,g.launcher,g.skimmer,{damage:1.1}]),TYPE:'missile',STAT_CALCULATOR:'sustained',LABEL:'Devastator'}},3)],'EAB3_crasherSpawner');

    // ── Elite Gunner (8 variants) ─────────────────────────────────────────────
    // Arm guns fire forward (angle 0), back-pillar fires backward (180)
    // Both side satellites (at 60 and 300) at ring distance 8, size 14
    const _EG = (tip,frontGuns,sideT1='auto4gun',sideT2='auto4gun') => ({
        PARENT:'elite',UPGRADE_LABEL:'Elite Gunner',UPGRADE_TOOLTIP:tip,UPGRADE_COLOR:'pink',
        FACING_TYPE:'toTarget',AI:{NO_LEAD:false},
        GUNS:frontGuns,
        TURRETS:[{POSITION:ring(14,8,60,180),TYPE:sideT1},{POSITION:ring(14,8,300,180),TYPE:sideT2}],
    });
    const _backPillar = (t) => [{POSITION:[14,16,1,0,0,180,0]},{POSITION:[4,16,1.5,14,0,180,0],PROPERTIES:{SHOOT_SETTINGS:safeCS([g.trap,g.setTrap,g.pounder,{speed:1.5,range:0.3}]),TYPE:t,NO_LIMITATIONS:true,STAT_CALCULATOR:'trap'}}];
    const _sideArms   = () => [{POSITION:[6,14,-2,2,0,60,0]},{POSITION:[6,14,-2,2,0,300,0]}];
    Class.EAB3_eliteGunnerMechanic   = _EG('(Mechanic)',  [{POSITION:[12,19,1,2,0,180,0]},{POSITION:[4,19,1.25,14,0,180,0],PROPERTIES:{SHOOT_SETTINGS:safeCS([g.trap,g.setTrap,g.pounder,g.destroyer,{speed:1.5,range:0.3}]),TYPE:'unsetPillbox',NO_LIMITATIONS:true,STAT_CALCULATOR:'trap'}},{POSITION:[5,14,-2,3,0,60,0]},{POSITION:[5,14,-2,3,0,300,0]}]);
    Class.EAB3_eliteGunnerDriver     = _EG('(Driver)',    [..._backPillar('unsetPillbox'),{POSITION:[14,6,1,0,0,180,0]},..._sideArms()]);
    Class.EAB3_eliteGunnerSpecialist = _EG('(Specialist)',[{POSITION:[14,6,0.5,0,0,180,0]},..._backPillar('unsetPillbox'),..._sideArms()]);
    Class.EAB3_eliteGunnerTriplet    = _EG('(Triplet)',   [..._backPillar('unsetPillbox'),..._sideArms()],'bigauto4gun','bigauto4gun');
    // NEW: Streamliner — 5-barrel stream from back
    Class.EAB3_eliteGunnerStreamliner= _EG('(Streamliner)',[...[24,22,20,18,16].map((len,i)=>({POSITION:[len,8,1,0,0,180,i/4]})),..._backPillar('unsetPillbox'),..._sideArms()]);
    // NEW: Sniper Gunner — triple predator from back
    Class.EAB3_eliteGunnerSniper     = _EG('(Sniper)',    [{POSITION:[28,8,1,0,0,180,0],PROPERTIES:{SHOOT_SETTINGS:safeCS([g.basic,g.sniper,g.assassin,g.predator,{damage:1.3,pen:1.3}]),TYPE:'bullet',LABEL:'Apex'}},{POSITION:[22,12,1,0,0,180,0.2],PROPERTIES:{SHOOT_SETTINGS:safeCS([g.basic,g.sniper,g.predator,{damage:1.1}]),TYPE:'bullet'}},..._backPillar('unsetPillbox'),..._sideArms()]);
    // NEW: Hive Gunner
    Class.EAB3_eliteGunnerHive       = _EG('(Hive)',      [{POSITION:[13,13,1.2,5,0,180,0],PROPERTIES:{SHOOT_SETTINGS:safeCS([g.basic,g.pounder,g.destroyer,g.hive,{damage:1.4,health:1.3,range:1.3}]),TYPE:'hive',LABEL:'Hive'}},{POSITION:[15,9,1,5,0,180,0]},{POSITION:[13,12,1,5,0,180,0]},..._sideArms()]);
    // NEW: Swarm Gunner — drone ring + back pillar
    Class.EAB3_eliteGunnerSwarm      = _EG('(Swarm)',     [...[0,90,180,270].map((a,i)=>({POSITION:[0,8,1.1,10,0,a,i*0.25],PROPERTIES:{SHOOT_SETTINGS:safeCS([g.drone,g.overseer,{health:1.4,damage:1.3,size:1.1}]),TYPE:['drone',{INDEPENDENT:true}],AUTOFIRE:true,SYNCS_SKILLS:true,STAT_CALCULATOR:'drone',WAIT_TO_CYCLE:true,MAX_CHILDREN:4}})),..._sideArms()]);

    // ── Elite Sprayer (8 variants) ────────────────────────────────────────────
    // Layout: center spinner + 3 pairs (inner + outer) per arm
    const _ESP = (tip,centerT,armT) => ({
        PARENT:'elite',UPGRADE_LABEL:'Elite Sprayer',UPGRADE_TOOLTIP:tip,UPGRADE_COLOR:'pink',
        SKILL_CAP:[3,5,5,5,3,1,0,9,1,0],AI:{NO_LEAD:false},HAS_NO_RECOIL:true,
        TURRETS:[
            {POSITION:ctr(6,360),TYPE:[centerT,{INDEPENDENT:true}]},
            ...weaponArray([
                {POSITION:ring(9,6.5,60,130), TYPE:[armT,{COLOR:'grey',GUN_STAT_SCALE:{damage:0.9,resist:0.95}}]},
                {POSITION:ring(8,8.5,60,130), TYPE:[armT,{COLOR:'grey',GUN_STAT_SCALE:{damage:0.9,resist:0.95}}]},
            ],3),
        ],
    });
    Class.EAB3_eliteSprayerRedist    = _ESP('(Redistributor)', 'machineTripleTurret',  'redistributor');
    Class.EAB3_eliteSprayerAtomizer  = _ESP('(Atomizer)',       'machineTripleTurret',  'atomizer');
    Class.EAB3_eliteSprayerFocal     = _ESP('(Focal)',          'machineTripleTurret',  'focal');
    Class.EAB3_eliteSprayerHexaMach  = _ESP('(Hexa Machine)',   'EAB3_hexaSpinTurret',  'sprayer');
    Class.EAB3_eliteSprayerTriple    = _ESP('(Triple Sprayer)',  'EAB3_tripleSprayT',    'sprayer');
    Class.EAB3_eliteSprayerStream    = _ESP('(Streamliner)',     'EAB3_streamHexaT',     'sprayer');
    Class.EAB3_eliteSprayerDistrib   = _ESP('(Distributor)',     'EAB3_hexaSpinTurret',  'redistributor');
    Class.EAB3_eliteSprayerAtomHexa  = _ESP('(Atomizer Hexa)',   'EAB3_hexaSpinTurret',  'atomizer');

    // ── Elite Battleship (9 variants) ─────────────────────────────────────────
    // 3 swarm guns per arm, satellite turrets flush at distance 7
    const _EBS = (tip,swarmStats,satT,extraGuns=[]) => ({
        PARENT:'elite',UPGRADE_LABEL:'Elite Battleship',UPGRADE_TOOLTIP:tip,UPGRADE_COLOR:'pink',
        GUNS:[...weaponArray([...[-8,0,8].map((y,i)=>({POSITION:[4,6,0.6,7,y,60,i/3],PROPERTIES:{SHOOT_SETTINGS:safeCS([g.swarm,g.battleship,...swarmStats]),TYPE:'autoswarm',STAT_CALCULATOR:'swarm'}}))],3),...extraGuns],
        TURRETS:weaponArray({POSITION:ring(5,7,0,360),TYPE:[satT,{INDEPENDENT:true,COLOR:-1}]},3),
    });
    const _sw = (extra=[]) => [{speed:0.95,maxSpeed:0.95,health:1.1,resist:1.05},...extra];
    Class.EAB3_eliteBshipCarrier = _EBS('(Carrier)',  _sw(),'autoTankGun');
    Class.EAB3_eliteBshipHoncho  = {PARENT:'elite',UPGRADE_LABEL:'Elite Battleship',UPGRADE_TOOLTIP:'(Honcho)',UPGRADE_COLOR:'pink',GUNS:weaponArray([...[-8,0,8].map((y,i)=>({POSITION:[4,7,0.7,7,y,60,i/3],PROPERTIES:{SHOOT_SETTINGS:safeCS([g.swarm,g.pounder,g.battleship,..._sw()]),TYPE:'autoswarm',STAT_CALCULATOR:'swarm'}}))],3),TURRETS:weaponArray({POSITION:ring(5,7,0,360),TYPE:['autoTankGun',{INDEPENDENT:true,COLOR:-1}]},3)};
    Class.EAB3_eliteBshipDoper   = _EBS('(Doper)',    _sw([g.doper]),'autoTankGun');
    Class.EAB3_eliteBshipMore    = {PARENT:'elite',UPGRADE_LABEL:'Elite Battleship',UPGRADE_TOOLTIP:'(More)',UPGRADE_COLOR:'pink',GUNS:weaponArray([...[-8,0,8].map((y,i)=>({POSITION:[4,6,0.6,7,y,60,i/3],PROPERTIES:{SHOOT_SETTINGS:safeCS([g.swarm,g.battleship,..._sw()]),TYPE:'autoswarm',STAT_CALCULATOR:'swarm'}}))],3),TURRETS:[...weaponArray({POSITION:ring(5,7,0,360),TYPE:['autoTankGun',{INDEPENDENT:true,COLOR:-1}]},3),...weaponArray({POSITION:ring(5,3.5,60,360),TYPE:['autoTankGun',{INDEPENDENT:true,COLOR:-1}]},3)]};
    Class.EAB3_eliteBshipTwin    = _EBS('(Twin)',     _sw(),'auto4gun');
    Class.EAB3_eliteBshipMega    = _EBS('(Mega)',     _sw(),'megaAutoTankGun');
    Class.EAB3_eliteBshipOverseer= {PARENT:'elite',UPGRADE_LABEL:'Elite Battleship',UPGRADE_TOOLTIP:'(Overseer)',UPGRADE_COLOR:'pink',GUNS:weaponArray([...[[60,0],[180,1/3],[300,2/3]].map(([a,d])=>({POSITION:[0,8,1.1,10,0,a,d],PROPERTIES:{SHOOT_SETTINGS:safeCS([g.drone,g.overseer,{health:1.4,damage:1.3,size:1.1}]),TYPE:['drone',{INDEPENDENT:true}],AUTOFIRE:true,SYNCS_SKILLS:true,STAT_CALCULATOR:'drone',WAIT_TO_CYCLE:true,MAX_CHILDREN:3}}))],3),TURRETS:weaponArray({POSITION:ring(5,7,0,360),TYPE:['auto4gun',{INDEPENDENT:true,COLOR:-1}]},3)};
    Class.EAB3_eliteBshipSummoner= {PARENT:'elite',UPGRADE_LABEL:'Elite Battleship',UPGRADE_TOOLTIP:'(Summoner)',UPGRADE_COLOR:'pink',GUNS:weaponArray([...[[60,0],[180,1/3],[300,2/3]].map(([a,d])=>({POSITION:[0,8,1.1,10,0,a,d],PROPERTIES:{SHOOT_SETTINGS:safeCS([g.drone,g.summoner,{health:1.5,damage:1.4,size:1.2}]),TYPE:['summonerDrone',{INDEPENDENT:true}],AUTOFIRE:true,SYNCS_SKILLS:true,STAT_CALCULATOR:'drone',WAIT_TO_CYCLE:true,MAX_CHILDREN:3}}))],3),TURRETS:weaponArray({POSITION:ring(6,7,0,360),TYPE:['auto4gun',{INDEPENDENT:true,COLOR:-1}]},3)};
    Class.EAB3_eliteBshipSwarm   = _EBS('(Swarm)',    [{speed:0.95,maxSpeed:0.95,health:1.2,resist:1.1}],'auto4gun');

    // ── Elite Skimmer (7 variants) ────────────────────────────────────────────
    // Arms: turret flush at distance 5 from arm tip, size 15
    const _ESK = (tip,T) => ({PARENT:'elite',LABEL:'Elite Skimmer',UPGRADE_TOOLTIP:tip,COLOR:'triangle',UPGRADE_COLOR:'triangle',TURRETS:weaponArray({POSITION:ring(15,5,60,170),TYPE:T},3)});
    Class.EAB3_eliteSkimmerHyper   = _ESK('(Hyper Skimmer)','EAB3_ultraMissileT');
    Class.EAB3_eliteSkimmerBazooka = _ESK('(Bazooka)',       'bazookaTurret');
    Class.EAB3_eliteSkimmerSkidder = _ESK('(Skidder)',       'skidderTurret');
    Class.EAB3_eliteSkimmerTicker  = _ESK('(Ticker)',        'tickerTurret');
    Class.EAB3_eliteSkimmerSalvo   = _ESK('(Salvo)',         'EAB3_salvoT');
    Class.EAB3_eliteSkimmerExplosive=_ESK('(Explosive)',     'EAB3_ultraMissileT');
    Class.EAB3_eliteSkimmerHive    = _ESK('(Hive)',          'EAB3_hiveMissT');

    // ── Elite Spinner (8 variants) ────────────────────────────────────────────
    // Arms: [2,20,0.75,8,0,60,0] is the arm shaft. Center turret is the spinner.
    const _ESPIN = (tip,armInnerGuns,cenT) => ({
        PARENT:'elite',UPGRADE_LABEL:'Elite Spinner',UPGRADE_TOOLTIP:tip,UPGRADE_COLOR:'pink',
        AI:{STRAFE:false},FACING_TYPE:['spin',{speed:0.08}],
        GUNS: weaponArray([...armInnerGuns,{POSITION:[2,20,0.75,8,0,60,0]}],3),
        TURRETS:[{POSITION:ctr(9.5,360),TYPE:[cenT,{COLOR:-1}]}],
    });
    const _cg = [
        {POSITION:[9.5,2,1,-1.5,11.5,10,2/3],PROPERTIES:{SHOOT_SETTINGS:safeCS([g.basic,g.twin,g.gunner,{speed:1.5,maxSpeed:1.25}]),TYPE:'bullet'}},
        {POSITION:[9.5,2,1, 3.5,6.5, 10,1/3],PROPERTIES:{SHOOT_SETTINGS:safeCS([g.basic,g.twin,g.gunner,{speed:1.5,maxSpeed:1.25}]),TYPE:'bullet'}},
        {POSITION:[9.5,2,1, 8.5,1.5, 10,0],  PROPERTIES:{SHOOT_SETTINGS:safeCS([g.basic,g.twin,g.gunner,{speed:1.5,maxSpeed:1.25}]),TYPE:'bullet'}},
    ];
    Class.EAB3_eliteSpinnerTornado  = _ESPIN('(Tornado)', [[-1.5,10.7,2/3],[3.5,5.95,1/3],[8.5,1,0]].map(([x,y,d])=>({POSITION:[9.5,3.5,1,x,y,10,d],PROPERTIES:{SHOOT_SETTINGS:safeCS([g.basic,g.twin,g.gunner,{speed:1.5,maxSpeed:1.25},g.pounder]),TYPE:'bullet'}})),'eliteSpinnerCyclone');
    Class.EAB3_eliteSpinnerTempest  = _ESPIN('(Tempest)',  [[-1.5,11.5,4/5],[1,9,3/5],[3.5,6.5,2/5],[6,4,1/5],[8.5,1.5,0]].map(([x,y,d])=>({POSITION:[9.5,2,1,x,y,10,d],PROPERTIES:{SHOOT_SETTINGS:safeCS([g.basic,g.twin,g.gunner,{speed:1.5,maxSpeed:1.25}]),TYPE:'bullet'}})),'eliteSpinnerCyclone');
    Class.EAB3_eliteSpinnerGale     = _ESPIN('(Gale)',     _cg,'EAB3_galeTurret');
    Class.EAB3_eliteSpinnerTrove    = _ESPIN('(Trove)',    _cg,'EAB3_troveTurret');
    Class.EAB3_eliteSpinnerHurricane= _ESPIN('(Hurricane)',_cg,'EAB3_blizzardTurret');
    Class.EAB3_eliteSpinnerBlizzard = _ESPIN('(Blizzard)', _cg,'EAB3_blizzardTurret');
    Class.EAB3_eliteSpinnerMaelstrom= _ESPIN('(Maelstrom)',_cg,'EAB3_maelstromTurret');

    // ── Elite Trap Guard (8 variants) ─────────────────────────────────────────
    // Arm trap guns + center turret + 2 satellite auto-turrets per arm (flush at distance 8)
    const _ETG = (tip,armGuns,cenT,satT) => ({
        PARENT:'elite',UPGRADE_LABEL:'Elite Trap Guard',UPGRADE_TOOLTIP:tip,UPGRADE_COLOR:'pink',
        AI:{STRAFE:false},GUNS:armGuns,
        TURRETS:[
            {POSITION:ctr(9.5,360),TYPE:cenT},
            ...weaponArray([
                {POSITION:ring(5,8,60,160),TYPE:[satT,{INDEPENDENT:false,GUN_STAT_SCALE:{health:1.1}}]},
                {POSITION:ring(5,8.5,60,160),TYPE:[satT,{INDEPENDENT:false,GUN_STAT_SCALE:{health:1.1}}]},
            ],3),
        ],
    });
    const _tgG = (t,stats=[g.trap,{speed:1.1,maxSpeed:1.1,reload:1.5,damage:1.6}]) => weaponArray([{POSITION:[10.5,6,1,0,0,60,0]},{POSITION:[3,6,1.7,10.5,0,60,0],PROPERTIES:{SHOOT_SETTINGS:safeCS(stats),TYPE:t,STAT_CALCULATOR:'trap'}}],3);
    Class.EAB3_eliteTGBuilder     = _ETG('(Builder)',    weaponArray([{POSITION:[12,6,1,0,0,60,0]},{POSITION:[1.5,6,1.2,12,0,60,0],PROPERTIES:{SHOOT_SETTINGS:safeCS([g.trap,g.setTrap,{speed:1.1,reload:1.5,damage:1.6}]),TYPE:'unsetTrap',STAT_CALCULATOR:'trap'}}],3),'triTrapGuardTurret','autoTurret');
    Class.EAB3_eliteTGMech        = _ETG('(Mech)',       weaponArray([{POSITION:[11,6,1,0,0,60,0]},{POSITION:[3,6,1.7,11,0,60,0],PROPERTIES:{SHOOT_SETTINGS:safeCS([g.trap,{speed:1.1,reload:1.5,damage:1.6}]),TYPE:'turretedTrap',STAT_CALCULATOR:'trap'}},{POSITION:[10,8,1,0,0,60,0]}],3),'triTrapGuardTurret','autoTurret');
    Class.EAB3_eliteTGTwin        = _ETG('(Twin)',        _tgG('trap'),'triTrapGuardTurret','auto4gun');
    Class.EAB3_eliteTGMega        = _ETG('(Mega)',        _tgG('trap'),'triTrapGuardTurret','megaAutoTankGun');
    Class.EAB3_eliteTGPeashooter  = _ETG('(Peashooter)', _tgG('trap'),'triPeashooterTurret','autoTurret');
    Class.EAB3_eliteTGHexaTrap    = _ETG('(HexaTrap)',    _tgG('trap',[g.trap,g.hexaTrapper,{speed:1.1,reload:1.5,damage:1.8,health:1.4}]),'triTrapGuardTurret','auto4gun');
    Class.EAB3_eliteTGBoomerang   = _ETG('(Boomerang)',   weaponArray([{POSITION:[18,8,1,0,0,60,0]},{POSITION:[13,8,-1.7,0,0,60,0]},{POSITION:[2,8,1.3,18,0,60,0],PROPERTIES:{SHOOT_SETTINGS:safeCS([g.trap,g.setTrap,g.boomerang]),TYPE:'boomerang',STAT_CALCULATOR:'block'}}],3),'triTrapGuardTurret','auto4gun');
    Class.EAB3_eliteTGConstructor = _ETG('(Constructor)', weaponArray([{POSITION:[10.7,8,1,0,0,60,0]},{POSITION:[1.5,8,1.2,10.7,0,60,0],PROPERTIES:{SHOOT_SETTINGS:safeCS([g.trap,g.setTrap,g.hexaTrapper,{speed:1.1,reload:1.4,damage:1.8,health:1.5}]),TYPE:'setTrap',STAT_CALCULATOR:'trap',AUTOFIRE:true}}],3),'triTrapGuardTurret','bigauto4gun');

    // ── Elite Spawner (6 variants) ─────────────────────────────────────────────
    const _sGuns = (t1,t2,t3,pw=18) => [...weaponArray([{POSITION:[9.675,pw,1,0,0,60,0]}],3),...[t1,t2,t3].flatMap((t,i)=>[{POSITION:[1.8,pw,1,11.5,0,i*120+60,0],PROPERTIES:{SHOOT_SETTINGS:safeCS([g.drone,{reload:2,size:0.5,speed:0.6,maxSpeed:0.6}]),TYPE:t,NO_LIMITATIONS:true,SYNCS_SKILLS:true,AUTOFIRE:true,STAT_CALCULATOR:'drone'}}])];
    const _ESP2 = (tip,maxChild,guns,cenT='auto4gun') => ({PARENT:'elite',UPGRADE_LABEL:'Elite Spawner',UPGRADE_TOOLTIP:tip,UPGRADE_COLOR:'pink',MAX_CHILDREN:maxChild,AI:{STRAFE:false},SKILL_CAP:Array(10).fill(15),GUNS:guns,TURRETS:[{POSITION:ctr(11,360),TYPE:[cenT,{INDEPENDENT:false,COLOR:-1}]}]});
    Class.EAB3_eliteSpawnerFactory = _ESP2('(Factory)', 9, _sGuns('EAB3_superSwarmMin','EAB3_superTrapMin','EAB3_superGunMin'));
    Class.EAB3_eliteSpawnerHoncho  = _ESP2('(Honcho)',  6, _sGuns('sentrySwarmMinion','sentryTrapMinion','sentryGunMinion'));
    Class.EAB3_eliteSpawnerDoper   = _ESP2('(Doper)',   6, [..._sGuns('sentrySwarmMinion','sentryTrapMinion','sentryGunMinion'),...weaponArray([{POSITION:[14,7/11,-5,0,0,60,0]}],3)]);
    Class.EAB3_eliteSpawnerTriplet = _ESP2('(Triplet)', 9, _sGuns('sentrySwarmMinion','sentryTrapMinion','sentryGunMinion'),'bigauto4gun');
    Class.EAB3_eliteSpawnerNexus   = _ESP2('(Nexus)',  12, _sGuns('EAB3_superSwarmMin','EAB3_superTrapMin','EAB3_superGunMin'),'bigauto4gun');
    Class.EAB3_eliteSpawnerOverlord= {PARENT:'elite',UPGRADE_LABEL:'Elite Spawner',UPGRADE_TOOLTIP:'(Overlord)',UPGRADE_COLOR:'pink',MAX_CHILDREN:16,AI:{STRAFE:false},SKILL_CAP:Array(10).fill(15),GUNS:[...[0,90,180,270].map((a,i)=>({POSITION:[0,8,1.1,10,0,a,i*0.25],PROPERTIES:{SHOOT_SETTINGS:safeCS([g.drone,g.overseer,{health:1.5,damage:1.4,size:1.1}]),TYPE:['drone',{INDEPENDENT:true}],AUTOFIRE:true,SYNCS_SKILLS:true,STAT_CALCULATOR:'drone',WAIT_TO_CYCLE:true,MAX_CHILDREN:4}}))],TURRETS:[{POSITION:ctr(11,360),TYPE:['bigauto4gun',{INDEPENDENT:false,COLOR:-1}]}]};

// ══════════════════════════════════════════════════════════════════════════════
//  MENUS
// ══════════════════════════════════════════════════════════════════════════════
    const _mk = (k,l,o) => { if(!Class[k])Class[k]=makeMenu(l,o); if(!Class[k].UPGRADES_TIER_0)Class[k].UPGRADES_TIER_0=[]; };
    _mk('EAB3Menu',       'Armsrace v3',       {rerootTree:'EAB3Menu'});
    _mk('EAB3_bobs',      'Bobs',              {color:'aqua',        shape:0});
    _mk('EAB3_nemeses',   'Nemeses',           {color:'red',         shape:0});
    _mk('EAB3_cels',      'Celestials III',    {color:'lightGrey',   shape:9.5});
    _mk('EAB3_ters',      'Terrestrials III',  {color:'orange',      shape:7.5});
    _mk('EAB3_eters',     'Eternals III',      {color:'veryLightGrey',shape:11.5});
    _mk('EAB3_elites',    'Elites III',        {color:'pink',        shape:3.5});
    _mk('EAB3_eED',       'Elite Destroyers',  {color:'pink',        shape:3.5});
    _mk('EAB3_eEG',       'Elite Gunners',     {color:'pink',        shape:3.5});
    _mk('EAB3_eESP',      'Elite Sprayers',    {color:'pink',        shape:3.5});
    _mk('EAB3_eEB',       'Elite Battleships', {color:'pink',        shape:3.5});
    _mk('EAB3_eESK',      'Elite Skimmers',    {color:'triangle',    shape:3.5});
    _mk('EAB3_eESN',      'Elite Spinners',    {color:'pink',        shape:3.5});
    _mk('EAB3_eETG',      'Elite Trap Guards', {color:'pink',        shape:3.5});
    _mk('EAB3_eESW',      'Elite Spawners',    {color:'pink',        shape:3.5});

    Class.EAB3Menu.UPGRADES_TIER_0    = ['EAB3_elites','EAB3_bobs','EAB3_nemeses','EAB3_cels','EAB3_ters','EAB3_eters'];
    Class.EAB3_bobs.UPGRADES_TIER_0   = ['EAB3_megaBob','EAB3_bobby','EAB3_autoBob','EAB3_hob','EAB3_rupert','EAB3_squareBob','EAB3_pentaBob','EAB3_twinBob','EAB3_destroyerBob','EAB3_cycloneBob','EAB3_juggernautBob','EAB3_swarmBob','EAB3_fortressBob'];
    Class.EAB3_nemeses.UPGRADES_TIER_0= ['EAB3_megaNemesis','EAB3_antagonist','EAB3_autoNemesis','EAB3_rival','EAB3_bandit','EAB3_juggernaut','EAB3_blitz','EAB3_turretNemesis','EAB3_swarmNemesis','EAB3_fortressNemesis','EAB3_hexNemesis','EAB3_ghostNemesis','EAB3_overlordNemesis'];
    Class.EAB3_cels.UPGRADES_TIER_0   = ['EAB3_solarCel','EAB3_lunarCel','EAB3_ignisCel','EAB3_marisCel','EAB3_terraeCel','EAB3_tonitrumCel','EAB3_glaCel','EAB3_noxCel','EAB3_auroraCel','EAB3_vortexCel','EAB3_inferniCel','EAB3_crystallisCel'];
    Class.EAB3_ters.UPGRADES_TIER_0   = ['EAB3_marsTer','EAB3_neptuneTer','EAB3_venusTer','EAB3_mercuryTer','EAB3_jupiterTer','EAB3_saturnTer','EAB3_uranusTer','EAB3_plutoTer'];
    Class.EAB3_eters.UPGRADES_TIER_0  = ['EAB3_kronosEter','EAB3_odinEter','EAB3_nuxEter','EAB3_heraEter','EAB3_aresEter','EAB3_poseidonEter'];
    Class.EAB3_eED.UPGRADES_TIER_0    = ['EAB3_eliteDestroyerBigMac','EAB3_eliteDestroyerConstructor','EAB3_eliteDestroyerLauncher','EAB3_eliteDestroyerPenta','EAB3_eliteDestroyerDrive','EAB3_eliteDestroyerHoncho','EAB3_eliteDestroyerDoper','EAB3_eliteDestroyerAnni','EAB3_eliteDestroyerMissile'];
    Class.EAB3_eEG.UPGRADES_TIER_0    = ['EAB3_eliteGunnerMechanic','EAB3_eliteGunnerDriver','EAB3_eliteGunnerSpecialist','EAB3_eliteGunnerTriplet','EAB3_eliteGunnerStreamliner','EAB3_eliteGunnerSniper','EAB3_eliteGunnerHive','EAB3_eliteGunnerSwarm'];
    Class.EAB3_eESP.UPGRADES_TIER_0   = ['EAB3_eliteSprayerRedist','EAB3_eliteSprayerAtomizer','EAB3_eliteSprayerFocal','EAB3_eliteSprayerHexaMach','EAB3_eliteSprayerTriple','EAB3_eliteSprayerStream','EAB3_eliteSprayerDistrib','EAB3_eliteSprayerAtomHexa'];
    Class.EAB3_eEB.UPGRADES_TIER_0    = ['EAB3_eliteBshipCarrier','EAB3_eliteBshipHoncho','EAB3_eliteBshipDoper','EAB3_eliteBshipMore','EAB3_eliteBshipTwin','EAB3_eliteBshipMega','EAB3_eliteBshipOverseer','EAB3_eliteBshipSummoner','EAB3_eliteBshipSwarm'];
    Class.EAB3_eESK.UPGRADES_TIER_0   = ['EAB3_eliteSkimmerHyper','EAB3_eliteSkimmerBazooka','EAB3_eliteSkimmerSkidder','EAB3_eliteSkimmerTicker','EAB3_eliteSkimmerSalvo','EAB3_eliteSkimmerExplosive','EAB3_eliteSkimmerHive'];
    Class.EAB3_eESN.UPGRADES_TIER_0   = ['EAB3_eliteSpinnerTornado','EAB3_eliteSpinnerTempest','EAB3_eliteSpinnerGale','EAB3_eliteSpinnerTrove','EAB3_eliteSpinnerHurricane','EAB3_eliteSpinnerBlizzard','EAB3_eliteSpinnerMaelstrom'];
    Class.EAB3_eETG.UPGRADES_TIER_0   = ['EAB3_eliteTGBuilder','EAB3_eliteTGMech','EAB3_eliteTGTwin','EAB3_eliteTGMega','EAB3_eliteTGPeashooter','EAB3_eliteTGHexaTrap','EAB3_eliteTGBoomerang','EAB3_eliteTGConstructor'];
    Class.EAB3_eESW.UPGRADES_TIER_0   = ['EAB3_eliteSpawnerFactory','EAB3_eliteSpawnerHoncho','EAB3_eliteSpawnerDoper','EAB3_eliteSpawnerTriplet','EAB3_eliteSpawnerNexus','EAB3_eliteSpawnerOverlord'];
    Class.EAB3_elites.UPGRADES_TIER_0 = ['EAB3_eED','EAB3_eEG','EAB3_eESP','EAB3_eEB','EAB3_eESK','EAB3_eESN','EAB3_eETG','EAB3_eESW'];

    const _ss=(n,p,v)=>{try{if(Class[n])Class[n][p]=v;}catch(e){}};
    _ss('eliteDestroyer','UPGRADES_TIER_0',Class.EAB3_eED.UPGRADES_TIER_0);
    _ss('eliteGunner',   'UPGRADES_TIER_0',Class.EAB3_eEG.UPGRADES_TIER_0);
    _ss('eliteSprayer',  'UPGRADES_TIER_0',Class.EAB3_eESP.UPGRADES_TIER_0);
    _ss('eliteBattleship','UPGRADES_TIER_0',Class.EAB3_eEB.UPGRADES_TIER_0);
    _ss('eliteSkimmer',  'UPGRADES_TIER_0',Class.EAB3_eESK.UPGRADES_TIER_0);
    _ss('eliteSpinner',  'UPGRADES_TIER_0',Class.EAB3_eESN.UPGRADES_TIER_0);
    _ss('eliteTrapGuard','UPGRADES_TIER_0',Class.EAB3_eETG.UPGRADES_TIER_0);
    _ss('eliteSpawner',  'UPGRADES_TIER_0',Class.EAB3_eESW.UPGRADES_TIER_0);
    _ss('bob',           'UPGRADES_TIER_0',Class.EAB3_bobs.UPGRADES_TIER_0);
    _ss('nemesis',       'UPGRADES_TIER_0',Class.EAB3_nemeses.UPGRADES_TIER_0);

    const _e=['menu_addons','addons'].find(n=>Class[n]&&Array.isArray(Class[n].UPGRADES_TIER_0));
    if(_e){Class[_e].UPGRADES_TIER_0.push('EAB3Menu');console.log('[EAB3] Connected to '+_e);}
    else console.warn('[EAB3] Connect EAB3Menu manually.');

    const total=[Class.EAB3_bobs,Class.EAB3_nemeses,Class.EAB3_cels,Class.EAB3_ters,Class.EAB3_eters,...[Class.EAB3_eED,Class.EAB3_eEG,Class.EAB3_eESP,Class.EAB3_eEB,Class.EAB3_eESK,Class.EAB3_eESN,Class.EAB3_eETG,Class.EAB3_eESW]].reduce((s,c)=>s+(c?c.UPGRADES_TIER_0.length:0),0);
    console.log('[EAB3] Loaded '+total+' boss variants! Bob×13 | Nemesis×13 | Celestial×12 | Terrestrial×8 | Eternal×6 | Elites×60+');
};