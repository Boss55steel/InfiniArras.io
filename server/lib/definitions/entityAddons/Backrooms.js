
const {combineStats} = require('../facilitators.js');
const {base, dfltskl} = require('../constants.js');
const g = require('../gunvals.js');
const safeCS = s => combineStats(s.filter(x => x != null));

const _g=(a,b,f)=>{g[a]=g[a]||g[b]||f;};
_g('pounder',   'pound',   {reload:1.5,recoil:1.4,speed:0.65,maxSpeed:0.65,size:1.25,damage:1.5});
_g('destroyer', 'destroy', {reload:2,recoil:2,speed:0.55,maxSpeed:0.55,size:1.5,damage:2,pen:1.6});
_g('annihilator','anni',   {reload:2.5,recoil:3,speed:0.45,maxSpeed:0.45,size:2,damage:2.5,pen:2});
_g('sniper',    'snip',    {reload:0.5,recoil:0.5,speed:2,maxSpeed:2,range:1.5,spray:0.3,damage:1.5,pen:1.2});
_g('assassin',  'ass',     {speed:1.6,maxSpeed:1.6,reload:0.55,recoil:0});
_g('overseer',  'over',    {reload:1.5,recoil:0,size:1.3,health:1.2});
_g('twin',      'tw',      {reload:0.6,recoil:0.6,speed:1.1});
_g('gunner',    'gunn',    {size:0.6,reload:0.4,speed:1.2});
_g('artillery', 'arty',    {reload:1.8,spray:2,size:1.2,damage:1.4});
_g('skimmer',   'skim',    {reload:2,recoil:1,speed:0.8,maxSpeed:0.8});
_g('weak',      'wk',      {damage:0.5,health:0.5,speed:0.8,maxSpeed:0.8});
_g('hive',      'hiveG',   {reload:0.5,size:1.2,damage:0.8});
_g('bee',       'beeG',    {reload:0.6,size:0.8,speed:1.4,maxSpeed:1.4,damage:0.7});
_g('flankGuard','flank',   {reload:0.85,recoil:0.85});
_g('lowPower',  'lp',      {damage:0.5,pen:0.5,health:0.5});

const _HUMAN_WRONG =
    'M -0.15 -1 L 0.15 -1 L 0.2 -0.55 L 0.55 -0.6 L 0.6 -0.1 L 0.25 -0.05 ' +
    'L 0.35 0.55 L 0.2 0.55 L 0.18 0.05 L -0.18 0.05 L -0.2 0.55 ' +
    'L -0.35 0.55 L -0.25 -0.05 L -0.6 -0.1 L -0.55 -0.6 L -0.2 -0.55 Z';

const _CRAWLER_SHAPE =
    'M -1 -0.2 L -0.7 -0.5 L -0.3 -0.6 L 0 -0.55 L 0.3 -0.6 ' +
    'L 0.7 -0.5 L 1 -0.2 L 0.9 0.1 L 0.6 0.3 L 0.3 0.5 ' +
    'L 0 0.55 L -0.3 0.5 L -0.6 0.3 L -0.9 0.1 Z';

const _BLOB_SHAPE =
    'M 0.1 -1 L 0.55 -0.85 L 0.9 -0.55 L 1 -0.05 L 0.85 0.4 ' +
    'L 0.6 0.75 L 0.15 0.95 L -0.3 1 L -0.7 0.8 L -0.95 0.45 ' +
    'L -1 0 L -0.9 -0.45 L -0.65 -0.75 L -0.3 -0.95 Z';

const _HOUND_SHAPE =
    'M -0.5 -1 L 0.5 -1 L 0.8 -0.6 L 1 0 L 0.8 0.3 ' +
    'L 0.5 0.15 L 0.6 0.8 L 0.2 1 L 0 0.6 L -0.2 1 ' +
    'L -0.6 0.8 L -0.5 0.15 L -0.8 0.3 L -1 0 ' +
    'L -0.8 -0.6 Z';

const _PARTY_SHAPE =
    'M 0 -1 L 0.18 -0.65 L 0.55 -0.7 L 0.3 -0.38 L 0.7 -0.2 ' +
    'L 0.38 0 L 0.65 0.3 L 0.28 0.28 L 0.35 0.75 ' +
    'L 0 0.55 L -0.35 0.75 L -0.28 0.28 L -0.65 0.3 ' +
    'L -0.38 0 L -0.7 -0.2 L -0.3 -0.38 L -0.55 -0.7 L -0.18 -0.65 Z';

const _EYE_SHAPE =
    'M -1 0 C -0.8 -0.7 0.8 -0.7 1 0 C 0.8 0.7 -0.8 0.7 -1 0 Z ' +
    'M -0.3 0 A 0.3 0.3 0 1 1 0.3 0 A 0.3 0.3 0 1 1 -0.3 0 Z';

const _TENTACLE =
    'M -0.15 -1 L 0.15 -1 L 0.25 -0.5 L 0.4 0 L 0.3 0.5 ' +
    'L 0.5 0.8 L 0.4 1 L 0.15 0.85 L 0 0.6 L -0.15 0.85 ' +
    'L -0.4 1 L -0.5 0.8 L -0.3 0.5 L -0.4 0 L -0.25 -0.5 Z';

module.exports = ({ Class }) => {
    console.log('[Backrooms] Loading Backrooms Entities...');


    Class.gazeShot = {
        PARENT: 'bullet', COLOR: '#ff0000', SHAPE: 0,
        BODY: {RANGE:600,SPEED:base.SPEED*1.8,HEALTH:base.HEALTH*0.4,DAMAGE:base.DAMAGE*1.2,PENETRATION:1.5},
        CONTROLLERS: ['nearestDifferentMaster','mapTargetToGoal'],
        AI: {NO_LEAD:false}, INDEPENDENT:true,
        ALPHA: 0.25,  // barely visible
        GUNS: [],
    };

    Class.confetti = {
        PARENT: 'bullet',
        COLOR: '#ff44aa', SHAPE: 4,
        BODY: {RANGE:180,SPEED:base.SPEED*1.8,HEALTH:base.HEALTH*0.3,DAMAGE:base.DAMAGE*0.7},
        GUNS: [],
    };

    Class.confettiBomb = {
        PARENT: 'bullet', COLOR: '#ffaaff', SHAPE: _PARTY_SHAPE,
        SIZE: 12,
        BODY: {RANGE:200,SPEED:base.SPEED*0.85,HEALTH:base.HEALTH*0.8,DAMAGE:base.DAMAGE*0.5,PENETRATION:0.5},
        GUNS: [
            ...Array.from({length:8},(_,i)=>({
                POSITION:[0,3,1.0,0,0,i*45,9999],
                PROPERTIES:{SHOOT_SETTINGS:safeCS([g.basic,{reload:999,damage:0.7,health:0.4,size:0.7,speed:1.6,range:0.6}]),
                    TYPE:'confetti',SHOOT_ON_DEATH:true,WAIT_TO_CYCLE:true},
            })),
            {POSITION:[0,4,1.2,0,0,0,9999],
             PROPERTIES:{SHOOT_SETTINGS:safeCS([g.basic,{reload:999,damage:1.4,health:1.0,size:1.1,speed:1.4,range:1.2}]),
                 TYPE:'gazeShot',SHOOT_ON_DEATH:true,WAIT_TO_CYCLE:true}},
        ],
    };
    Class.crawlerSpawnBullet = {
        PARENT: 'bullet', COLOR: '#887755', SHAPE: _CRAWLER_SHAPE,
        SIZE: 7,
        BODY:{RANGE:60,SPEED:base.SPEED*0.5,HEALTH:base.HEALTH*0.5,DAMAGE:0,PENETRATION:0},
        GUNS:[{
            POSITION:[0,2,1.2,0,0,0,9999],
            PROPERTIES:{SHOOT_SETTINGS:safeCS([g.drone,{reload:999,health:2,size:0.8,damage:1.2}]),
                TYPE:['crawlerMinion',{INDEPENDENT:true}],SHOOT_ON_DEATH:true,WAIT_TO_CYCLE:true},
        }],
    };

    Class.blobTendril = {
        PARENT: 'bullet', COLOR: '#334422', SHAPE: _TENTACLE,
        BODY:{RANGE:350,SPEED:base.SPEED*1.1,HEALTH:base.HEALTH*1.5,DAMAGE:base.DAMAGE*2.5,PENETRATION:3.0},
        CONTROLLERS:['nearestDifferentMaster','mapTargetToGoal'],
        AI:{NO_LEAD:true},
        INDEPENDENT:true, GUNS:[],
    };

    Class.crawlerMinion = {
        PARENT: 'genericTank', LABEL: '',
        SHAPE: _CRAWLER_SHAPE, COLOR: '#887755', SIZE: 7,
        INDEPENDENT: true, DRAW_HEALTH: false,
        SKILL_CAP: Array(10).fill(dfltskl||7),
        BODY:{SPEED:base.SPEED*2.2,HEALTH:base.HEALTH*1.2,DAMAGE:base.DAMAGE*2.5,DENSITY:base.DENSITY*2,FOV:base.FOV*0.8,PUSHABILITY:0.15},
        CONTROLLERS:['nearestDifferentMaster','mapTargetToGoal','canRepel'],
        TURRETS:[],  // TURRETS:[] triggers full Entity spawn
        GUNS:[],
    };

    Class.houndPup = {
        PARENT: 'genericTank', LABEL: 'Hound',
        SHAPE: _HOUND_SHAPE, COLOR: '#553322', SIZE: 11,
        INDEPENDENT: true, DRAW_HEALTH: true,
        SKILL_CAP: Array(10).fill(dfltskl||7),
        BODY:{SPEED:base.SPEED*2.2,HEALTH:base.HEALTH*2,DAMAGE:base.DAMAGE*4,DENSITY:base.DENSITY*3,FOV:base.FOV*1.2,PUSHABILITY:0.1},
        CONTROLLERS:['nearestDifferentMaster','mapTargetToGoal','canRepel'],
        TURRETS:[],
        GUNS:[],
    };

    Class.backroomsEyeTurret = {
        PARENT: 'autoTurret', LABEL: '', INDEPENDENT: true,
        BODY:{FOV:base.FOV*3},
        GUNS:[{
            POSITION:[18,6,1,0,0,0,0],
            PROPERTIES:{SHOOT_SETTINGS:safeCS([g.basic,g.sniper,g.assassin,
                {damage:1.5,health:1.0,reload:2.0,size:0.8,speed:1.8,spray:0}]),
                TYPE:'gazeShot'},
        }],
    };
    Class.wrongEyeDeco = {
        PARENT:['genericTank'],LABEL:'',SHAPE:_EYE_SHAPE,COLOR:'#ff2200',
        MIRROR_MASTER_ANGLE:true,INDEPENDENT:true,DRAW_HEALTH:false,
        CONTROLLERS:[['spin',{speed:0.0}]],  // stationary, watching
        GUNS:[],
    };

    Class.mimicTrue = {
        PARENT: 'genericTank',
        LABEL: 'Mimic', DANGER: 9,
        SHAPE: _HUMAN_WRONG, COLOR: '#334433', SIZE: 18,
        SKILL_CAP: Array(10).fill(9),
        BODY:{SPEED:base.SPEED*1.6,HEALTH:base.HEALTH*6,DAMAGE:base.DAMAGE*4,FOV:base.FOV*2.2,SHIELD:base.SHIELD*3,REGEN:base.REGEN*0.08,PUSHABILITY:0.05},
        CONTROLLERS:['nearestDifferentMaster','mapTargetToGoal','canRepel'],
        // 6 tentacle-like guns firing long piercing shots
        GUNS:[
            ...[-25,-15,-5,5,15,25].map((y,i)=>({
                POSITION:[26,5,1,0,y,0,i*0.14],
                PROPERTIES:{SHOOT_SETTINGS:safeCS([g.basic,g.sniper,g.assassin,{damage:1.8,health:1.2,reload:1.2,spray:1,pen:2}]),TYPE:'bullet'},
            })),
            {POSITION:[20,7,1,0, 5,180,0.5],
             PROPERTIES:{SHOOT_SETTINGS:safeCS([g.basic,g.sniper,{damage:1.4,reload:1.5}]),TYPE:'bullet'}},
            {POSITION:[20,7,1,0,-5,180,0.7],
             PROPERTIES:{SHOOT_SETTINGS:safeCS([g.basic,g.sniper,{damage:1.4,reload:1.5}]),TYPE:'bullet'}},
        ],
        TURRETS:[
            {POSITION:[8,12,0,  20,360,1],TYPE:['wrongEyeDeco',  {COLOR:'#ff0000'}]},
            {POSITION:[8,12,0,-20,360,1], TYPE:['wrongEyeDeco',  {COLOR:'#ff0000'}]},
            {POSITION:[7,10,0, 50,360,1], TYPE:['backroomsEyeTurret',{COLOR:'#ff0000'}]},
            {POSITION:[7,10,0,-50,360,1], TYPE:['backroomsEyeTurret',{COLOR:'#ff0000'}]},
            // Tentacle arm decorations
            {POSITION:[6,14,0, 90,180,0],TYPE:['wrongEyeDeco',{COLOR:'#222222'}]},
            {POSITION:[6,14,0,270,180,0],TYPE:['wrongEyeDeco',{COLOR:'#222222'}]},
        ],
    };

    const _mimicDisguises = ['basic','twin','sniper','machineGun','flankGuard'];
    const _disguiseName   = _mimicDisguises[Math.floor(Math.random()*_mimicDisguises.length)];

    Class.mimic = {
        PARENT: 'genericTank',
        LABEL: '???', DANGER: 7,
        SHAPE: 0, COLOR: '#aabbaa', SIZE: 14,
        SKILL_CAP: Array(10).fill(9),
        ALPHA: 0.85,  // slightly off — something is wrong
        BODY:{SPEED:base.SPEED*0.35,HEALTH:base.HEALTH*5,DAMAGE:base.DAMAGE*1,FOV:base.FOV*2.5,SHIELD:base.SHIELD*2,PUSHABILITY:0.05},
        CONTROLLERS:['nearestDifferentMaster','mapTargetToGoal','canRepel'],
        GUNS:[],   // no guns while disguised
        TURRETS:[
            {POSITION:[4,8,0, 15,360,0],TYPE:['wrongEyeDeco',{COLOR:'#550000'}]},
            {POSITION:[4,8,0,-15,360,0],TYPE:['wrongEyeDeco',{COLOR:'#550000'}]},
        ],
        ON:[{
            event:'tick',
            handler:({body})=>{
                try{
                    body._mimicTick=(body._mimicTick||0)+1;
                    if(body._mimicTick===360){
                        const savedScore=body.skill?.score??0;
                        body.define('mimicTrue');
                        if(savedScore>0&&body.skill){body.skill.score=savedScore;while(body.skill.maintain?.()){};}
                        if(body.health){body.health.amount=(body.HEALTH??base.HEALTH)*(body.skill?.str??1);}
                        body.refreshBodyAttributes?.();
                    }
                }catch(e){}
            },
        }],
    };

    setImmediate(()=>{
        const src=Class[_disguiseName]||Class.basicTank||Class.basic;
        if(src){
            Class.mimic.SHAPE=src.SHAPE||0;
            Class.mimic.COLOR=src.COLOR||'grey';
            Class.mimic.SIZE=(src.SIZE||12)*1.05; // slightly wrong size
            if(src.GUNS){
                Class.mimic.GUNS=(src.GUNS||[]).map(g2=>{
                    if(!g2?.POSITION)return null;
                    return {POSITION:Array.isArray(g2.POSITION)?g2.POSITION:[g2.POSITION.LENGTH||10,g2.POSITION.WIDTH||5,1,0,0,0,0]};
                }).filter(Boolean);
            }
            console.log('[Backrooms] Mimic disguised as: '+_disguiseName);
        }
    });

    Class.smiler = {
        PARENT: 'genericTank',
        LABEL: '⌣', DANGER: 8,
        SHAPE: 0, COLOR: '#111111', SIZE: 14,
        SKILL_CAP: Array(10).fill(9),
        INVISIBLE: [0.07, 0.03],  // almost completely invisible
        ALPHA: 0.07,
        BODY:{SPEED:base.SPEED*1.35,HEALTH:base.HEALTH*5,DAMAGE:base.DAMAGE*6,FOV:base.FOV*3.5,SHIELD:base.SHIELD*2,DENSITY:base.DENSITY*1.5,PUSHABILITY:0.05},
        CONTROLLERS:['nearestDifferentMaster','mapTargetToGoal','canRepel'],
        GUNS:[
            {POSITION:[22,5,1,0,-6,0,0],    PROPERTIES:{SHOOT_SETTINGS:safeCS([g.basic,g.sniper,{damage:1.6,reload:1.8,spray:1,pen:1.5}]),TYPE:'gazeShot'}},
            {POSITION:[22,5,1,0, 0,0,0.25], PROPERTIES:{SHOOT_SETTINGS:safeCS([g.basic,g.sniper,{damage:1.6,reload:1.8,spray:1,pen:1.5}]),TYPE:'gazeShot'}},
            {POSITION:[22,5,1,0, 6,0,0.5],  PROPERTIES:{SHOOT_SETTINGS:safeCS([g.basic,g.sniper,{damage:1.6,reload:1.8,spray:1,pen:1.5}]),TYPE:'gazeShot'}},
        ],
        TURRETS:[
            {POSITION:[7,9,0, 20,360,0],TYPE:['wrongEyeDeco',{COLOR:'#ff0000'}]},
            {POSITION:[7,9,0,-20,360,0],TYPE:['wrongEyeDeco',{COLOR:'#ff0000'}]},
        ],
    };

    Class.hound = {
        PARENT: 'genericTank',
        LABEL: 'Hound', DANGER: 8,
        SHAPE: _HOUND_SHAPE, COLOR: '#3a2010', SIZE: 18,
        SKILL_CAP: Array(10).fill(9),
        BODY:{SPEED:base.SPEED*2.2,HEALTH:base.HEALTH*5,DAMAGE:base.DAMAGE*9,FOV:base.FOV*2.0,DENSITY:base.DENSITY*5,PUSHABILITY:0.04},
        CONTROLLERS:['nearestDifferentMaster','mapTargetToGoal','canRepel'],
        GUNS:[
            {POSITION:[0,12,1.2,8,0, 90,0],
             PROPERTIES:{SHOOT_SETTINGS:safeCS([g.drone,g.weak,{reload:5,size:0.9,health:2,damage:1.3}]),
                TYPE:'houndPup',AUTOFIRE:true,SYNCS_SKILLS:true,STAT_CALCULATOR:'drone',WAIT_TO_CYCLE:true,MAX_CHILDREN:2}},
            {POSITION:[0,12,1.2,8,0,270,0.5],
             PROPERTIES:{SHOOT_SETTINGS:safeCS([g.drone,g.weak,{reload:5,size:0.9,health:2,damage:1.3}]),
                TYPE:'houndPup',AUTOFIRE:true,SYNCS_SKILLS:true,STAT_CALCULATOR:'drone',WAIT_TO_CYCLE:true,MAX_CHILDREN:2}},
        ],
        TURRETS:[
            {POSITION:[5,12,0, 25,360,0],TYPE:['wrongEyeDeco',{COLOR:'#ff5500'}]},
            {POSITION:[5,12,0,-25,360,0],TYPE:['wrongEyeDeco',{COLOR:'#ff5500'}]},
        ],
    };

    Class.partygoer = {
        PARENT: 'genericTank',
        LABEL: ':)', DANGER: 8,
        SHAPE: _PARTY_SHAPE, COLOR: '#ff88cc', SIZE: 17,
        SKILL_CAP: Array(10).fill(9),
        BODY:{SPEED:base.SPEED*1.1,HEALTH:base.HEALTH*5,DAMAGE:base.DAMAGE*5,FOV:base.FOV*1.8,SHIELD:base.SHIELD*2,PUSHABILITY:0.06},
        CONTROLLERS:['nearestDifferentMaster','mapTargetToGoal','canRepel'],
        GUNS:[
            {POSITION:[20,10,1,0, 0,  0,0],   PROPERTIES:{SHOOT_SETTINGS:safeCS([g.basic,g.artillery,{reload:1.8,damage:1.2,health:1.0,size:1.3,speed:0.9,recoil:1.5}]),TYPE:'confettiBomb'}},
            {POSITION:[18,9,1,0, 4,-15,0.4],  PROPERTIES:{SHOOT_SETTINGS:safeCS([g.basic,g.artillery,{reload:1.8,damage:1.2,health:1.0,size:1.3,speed:0.9,recoil:1.5}]),TYPE:'confettiBomb'}},
            {POSITION:[18,9,1,0,-4, 15,0.8],  PROPERTIES:{SHOOT_SETTINGS:safeCS([g.basic,g.artillery,{reload:1.8,damage:1.2,health:1.0,size:1.3,speed:0.9,recoil:1.5}]),TYPE:'confettiBomb'}},
        ],
        TURRETS:[
            {POSITION:[8,12,0, 40,360,0],TYPE:['wrongEyeDeco',{COLOR:'#ff00ff'}]},
            {POSITION:[8,12,0,-40,360,0],TYPE:['wrongEyeDeco',{COLOR:'#ffff00'}]},
            {POSITION:[7,14,0, 0, 360,0],TYPE:['wrongEyeDeco',{COLOR:'#00ffff'}]},
        ],
    };

    Class.crawler = {
        PARENT: 'genericTank',
        LABEL: 'Crawler', DANGER: 7,
        SHAPE: _CRAWLER_SHAPE, COLOR: '#887755', SIZE: 14,
        SKILL_CAP: Array(10).fill(9),
        BODY:{SPEED:base.SPEED*1.9,HEALTH:base.HEALTH*3,DAMAGE:base.DAMAGE*4,FOV:base.FOV*1.4,DENSITY:base.DENSITY*2,PUSHABILITY:0.08},
        CONTROLLERS:['nearestDifferentMaster','mapTargetToGoal','canRepel'],
        // Spawns baby crawlers periodically + shoots spawn bullets on the way
        GUNS:[
            {POSITION:[0,10,1.2,8,0, 90,0],
             PROPERTIES:{SHOOT_SETTINGS:safeCS([g.drone,g.weak,{reload:4,size:0.8,health:1.5,damage:1.0}]),
                TYPE:'crawlerMinion',AUTOFIRE:true,SYNCS_SKILLS:true,STAT_CALCULATOR:'drone',WAIT_TO_CYCLE:true,MAX_CHILDREN:3}},
            {POSITION:[0,10,1.2,8,0,270,0.5],
             PROPERTIES:{SHOOT_SETTINGS:safeCS([g.drone,g.weak,{reload:4,size:0.8,health:1.5,damage:1.0}]),
                TYPE:'crawlerMinion',AUTOFIRE:true,SYNCS_SKILLS:true,STAT_CALCULATOR:'drone',WAIT_TO_CYCLE:true,MAX_CHILDREN:3}},
        ],
        TURRETS:[
            // Two pinprick eyes
            {POSITION:[4,9,0, 18,360,0],TYPE:['wrongEyeDeco',{COLOR:'#ddaa44'}]},
            {POSITION:[4,9,0,-18,360,0],TYPE:['wrongEyeDeco',{COLOR:'#ddaa44'}]},
        ],
    };

    Class.watcher = {
        PARENT: 'genericTank',
        LABEL: 'The Watcher', DANGER: 9,
        SHAPE: _EYE_SHAPE, COLOR: '#220000', SIZE: 22,
        SKILL_CAP: Array(10).fill(9),
        BODY:{SPEED:0,HEALTH:base.HEALTH*8,DAMAGE:0,FOV:base.FOV*5,SHIELD:base.SHIELD*10,REGEN:base.REGEN*0.1,PUSHABILITY:0.0},
        CONTROLLERS:['nearestDifferentMaster','canRepel'],
        GUNS:[],
        TURRETS:[
            ...Array.from({length:8},(_,i)=>({
                POSITION:[9,16,0,i*45,360,1],
                TYPE:['backroomsEyeTurret',{COLOR:'#ff0000',GUN_STAT_SCALE:{damage:1.8,health:1.5}}],
            })),
            ...Array.from({length:4},(_,i)=>({
                POSITION:[8,8,0,i*90+22.5,360,0],
                TYPE:['wrongEyeDeco',{COLOR:'#ff3300'}],
            })),
            {POSITION:[10,0,0,0,360,1],TYPE:['backroomsEyeTurret',{COLOR:'#ffffff',GUN_STAT_SCALE:{damage:2.5,health:2.0,reload:1.5}}]},
        ],
    };

    Class.skinWalkerStage2 = {
        PARENT: 'genericTank',
        LABEL: '..', DANGER: 8,
        SHAPE: _HUMAN_WRONG, COLOR: '#4a3a2a', SIZE: 17,
        SKILL_CAP: Array(10).fill(9),
        INVISIBLE: [0.4, 0.15],
        BODY:{SPEED:base.SPEED*1.4,HEALTH:base.HEALTH*5,DAMAGE:base.DAMAGE*6,FOV:base.FOV*2.5,PUSHABILITY:0.05},
        CONTROLLERS:['nearestDifferentMaster','mapTargetToGoal','canRepel'],
        GUNS:[
            {POSITION:[22,6,1,0, 3,0,0],PROPERTIES:{SHOOT_SETTINGS:safeCS([g.basic,g.sniper,{damage:1.5,reload:1.8,spray:1,pen:1.2}]),TYPE:'gazeShot'}},
            {POSITION:[22,6,1,0,-3,0,0.5],PROPERTIES:{SHOOT_SETTINGS:safeCS([g.basic,g.sniper,{damage:1.5,reload:1.8,spray:1,pen:1.2}]),TYPE:'gazeShot'}},
        ],
        TURRETS:[
            {POSITION:[6,11,0, 22,360,0],TYPE:['wrongEyeDeco',{COLOR:'#882200'}]},
            {POSITION:[6,11,0,-22,360,0],TYPE:['wrongEyeDeco',{COLOR:'#882200'}]},
        ],
        ON:[{event:'tick',handler:({body})=>{
            try{body._swTick=(body._swTick||0)+1;
            if(body._swTick===480){const s=body.skill?.score??0;body.define('skinWalkerStage3');if(s>0&&body.skill){body.skill.score=s;while(body.skill.maintain?.()){};}if(body.health){body.health.amount=(body.HEALTH??base.HEALTH)*(body.skill?.str??1);}body.refreshBodyAttributes?.();}}catch(e){}
        }}],
    };
    Class.skinWalkerStage3 = {
        PARENT: 'genericTank',
        LABEL: 'Skin-Walker', DANGER: 9,
        SHAPE: _HUMAN_WRONG, COLOR: '#1a0f00', SIZE: 22,
        SKILL_CAP: Array(10).fill(9),
        BODY:{SPEED:base.SPEED*1.8,HEALTH:base.HEALTH*8,DAMAGE:base.DAMAGE*8,FOV:base.FOV*3,SHIELD:base.SHIELD*3,PUSHABILITY:0.02},
        CONTROLLERS:['nearestDifferentMaster','mapTargetToGoal','canRepel'],
        GUNS:[
            ...[-10,-5,0,5,10].map((y,i)=>({
                POSITION:[26,5,1,0,y,0,i*0.16],
                PROPERTIES:{SHOOT_SETTINGS:safeCS([g.basic,g.sniper,g.assassin,{damage:2.0,reload:1.2,spray:1.5,pen:2}]),TYPE:'gazeShot'},
            })),
            {POSITION:[20,6,1,0, 5,180,0.5],PROPERTIES:{SHOOT_SETTINGS:safeCS([g.basic,g.sniper,{damage:1.5,reload:1.5,pen:1.5}]),TYPE:'gazeShot'}},
            {POSITION:[20,6,1,0,-5,180,0.7],PROPERTIES:{SHOOT_SETTINGS:safeCS([g.basic,g.sniper,{damage:1.5,reload:1.5,pen:1.5}]),TYPE:'gazeShot'}},
        ],
        TURRETS:[
            {POSITION:[7,14,0,  0,360,1],TYPE:['backroomsEyeTurret',{COLOR:'#ff0000'}]},
            {POSITION:[7,14,0,180,360,1],TYPE:['backroomsEyeTurret',{COLOR:'#ff0000'}]},
            {POSITION:[6,11,0, 45,360,0],TYPE:['wrongEyeDeco',{COLOR:'#cc0000'}]},
            {POSITION:[6,11,0,135,360,0],TYPE:['wrongEyeDeco',{COLOR:'#cc0000'}]},
            {POSITION:[6,11,0,225,360,0],TYPE:['wrongEyeDeco',{COLOR:'#cc0000'}]},
            {POSITION:[6,11,0,315,360,0],TYPE:['wrongEyeDeco',{COLOR:'#cc0000'}]},
        ],
    };

    Class.skinWalker = {
        PARENT: 'genericTank',
        LABEL: '?', DANGER: 7,
        SHAPE: _HUMAN_WRONG, COLOR: '#ccccbb', SIZE: 15,
        SKILL_CAP: Array(10).fill(9),
        INVISIBLE: [0.6, 0.25],
        BODY:{SPEED:base.SPEED*0.3,HEALTH:base.HEALTH*4,DAMAGE:base.DAMAGE*2,FOV:base.FOV*2,PUSHABILITY:0.08},
        CONTROLLERS:['nearestDifferentMaster','mapTargetToGoal','canRepel'],
        GUNS:[],
        TURRETS:[{POSITION:[4,8,0,0,360,0],TYPE:['wrongEyeDeco',{COLOR:'#553300'}]}],
        ON:[{event:'tick',handler:({body})=>{
            try{body._swTick=(body._swTick||0)+1;
            if(body._swTick===300){const s=body.skill?.score??0;body.define('skinWalkerStage2');if(s>0&&body.skill){body.skill.score=s;while(body.skill.maintain?.()){};}if(body.health){body.health.amount=(body.HEALTH??base.HEALTH)*(body.skill?.str??1);}body.refreshBodyAttributes?.();}}catch(e){}
        }}],
    };

    Class.blobTentacleTurret = {
        PARENT: 'autoTurret', LABEL: 'Tendril', INDEPENDENT: true,
        BODY:{FOV:base.FOV*2.5},
        GUNS:[{
            POSITION:[24,10,1,0,0,0,0],
            PROPERTIES:{SHOOT_SETTINGS:safeCS([g.basic,g.pounder,g.destroyer,{damage:2.5,health:2.0,size:1.6,reload:3.0,pen:2.5}]),TYPE:'blobTendril'},
        }],
    };
    Class.blobAbsorbTurret = {
        PARENT: 'autoTurret', LABEL: '', INDEPENDENT: true,
        BODY:{FOV:base.FOV*2.0},
        GUNS:[
            {POSITION:[0,8,1.1,10,0, 90,0],   PROPERTIES:{SHOOT_SETTINGS:safeCS([g.drone,g.overseer,{health:2.0,damage:1.8,size:1.3,maxSpeed:1.2}]),TYPE:['drone',{INDEPENDENT:true}],AUTOFIRE:true,SYNCS_SKILLS:true,STAT_CALCULATOR:'drone',WAIT_TO_CYCLE:true,MAX_CHILDREN:3}},
            {POSITION:[0,8,1.1,10,0,270,0.5],  PROPERTIES:{SHOOT_SETTINGS:safeCS([g.drone,g.overseer,{health:2.0,damage:1.8,size:1.3,maxSpeed:1.2}]),TYPE:['drone',{INDEPENDENT:true}],AUTOFIRE:true,SYNCS_SKILLS:true,STAT_CALCULATOR:'drone',WAIT_TO_CYCLE:true,MAX_CHILDREN:3}},
        ],
    };
    Class.blobEyeRing = {
        PARENT:['genericTank'],LABEL:'',SHAPE:_EYE_SHAPE,COLOR:'#ff2200',
        MIRROR_MASTER_ANGLE:true,INDEPENDENT:true,DRAW_HEALTH:false,
        CONTROLLERS:[['spin',{speed:0.04}]],GUNS:[],
    };

    Class.entityZero = {
        PARENT: 'miniboss',
        LABEL: 'Entity 0', DANGER: 14,
        SHAPE: _BLOB_SHAPE, COLOR: '#111a11', SIZE: 55,
        VALUE: 1e6,
        SKILL_CAP: Array(10).fill(9),
        BODY:{
            FOV:    base.FOV   * 3.0,
            HEALTH: 3500,
            SHIELD: 500,
            REGEN:  base.REGEN * 0.1,
            SPEED:  base.SPEED * 0.18,
            DAMAGE: 15,
            DENSITY:base.DENSITY * 3,
            PUSHABILITY: 0.0,
        },
        BROADCAST_MESSAGE: 'Entity 0 has spawned. There is no escape from the Backrooms...',
        CONTROLLERS:[['minion',{orbit:300}]],
        FACING_TYPE:['spin',{speed:0.012}],
        GUNS:[
            ...Array.from({length:8},(_,i)=>({
                POSITION:[18,14,-1.4,5,0,i*45,i/8],
                PROPERTIES:{COLOR:'#223322'},
            })),
            ...Array.from({length:8},(_,i)=>({
                POSITION:[24,12,1,0,0,i*45,i/8],
                PROPERTIES:{SHOOT_SETTINGS:safeCS([g.basic,g.pounder,g.destroyer,{damage:2.8,health:2.2,size:1.8,reload:4,recoil:0.5,pen:2.0}]),TYPE:'blobTendril'},
            })),
            {POSITION:[4,16,1.3,28,0,0,0]},
        ],
        TURRETS:[
            ...Array.from({length:8},(_,i)=>({
                POSITION:[8,5,0,i*45,180,0],
                TYPE:['blobAbsorbTurret',{GUN_STAT_SCALE:{damage:1.3,health:1.2}}],
            })),
            ...Array.from({length:8},(_,i)=>({
                POSITION:[7,4,0,i*45+22.5,360,0],
                TYPE:['blobEyeRing',{COLOR:'#ff2200'}],
            })),
            ...Array.from({length:8},(_,i)=>({
                POSITION:[9,9,0,i*45+22.5,180,0],
                TYPE:['blobTentacleTurret',{GUN_STAT_SCALE:{damage:1.4,health:1.3}}],
            })),
            ...Array.from({length:6},(_,i)=>({
                POSITION:[10.5,13,0,i*60,180,0],
                TYPE:['blobTentacleTurret',{GUN_STAT_SCALE:{damage:1.6,health:1.5}}],
            })),
            ...Array.from({length:6},(_,i)=>({
                POSITION:[9,11,0,i*60+30,360,0],
                TYPE:['blobEyeRing',{COLOR:'#aa0000'}],
            })),
            ...Array.from({length:4},(_,i)=>({
                POSITION:[12,17,0,i*90+45,180,0],
                TYPE:['blobTentacleTurret',{GUN_STAT_SCALE:{damage:1.9,health:1.7,size:1.2}}],
            })),
            ...Array.from({length:4},(_,i)=>({
                POSITION:[10,15,0,i*90,360,0],
                TYPE:['blobEyeRing',{COLOR:'#880000'}],
            })),
        ],
    };

    Class.backroomsMenu = {
        PARENT:['genericTank'],LABEL:'The Backrooms',
        COLOR:'#223322',SHAPE:_EYE_SHAPE,SIZE:14,
        GUNS:[],TURRETS:[],
        UPGRADES_TIER_0:['mimic','smiler','hound','partygoer','skinWalker','crawler','watcher','entityZero'],
    };

//    const _e=['menu_addons','addons'].find(n=>Class[n]&&Array.isArray(Class[n].UPGRADES_TIER_0));
//    if(_e){Class[_e].UPGRADES_TIER_0.push('backroomsMenu');console.log('[Backrooms] Connected to '+_e);}
//    else console.warn('[Backrooms] Connect backroomsMenu manually.');

    console.log('[Backrooms] Loaded: Mimic | Smiler | Hound | Partygoer | Skin-Walker | Crawler | Watcher | Entity 0');
};