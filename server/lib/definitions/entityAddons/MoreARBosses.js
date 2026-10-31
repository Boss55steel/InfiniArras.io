// ══════════════════════════════════════════════════════════════════════════════
//  EXTENDED ARMSRACE BOSSES — Fixed for open-source-arras-main
//  + NEW: Terrestrials, more Elites, Rogue Fortress, Rogue Cyclone,
//         Cosmic Rammers, and Elite variants for every existing Elite class
// ══════════════════════════════════════════════════════════════════════════════

const { combineStats } = require('../facilitators.js');
const _facs = require('../facilitators.js');
const _constants = require('../constants.js');
const { base, dfltskl, smshskl } = _constants;
const g = require('../gunvals.js');

// ── Shims for all facilitator functions ───────────────────────────────────────
const makeAuto = _facs.makeAuto || ((type, name, opts={}) => ({
    PARENT: [typeof type==='string'?type:'genericTank'],
    LABEL: name||'', GUNS:[], TURRETS:[], INDEPENDENT:true,
}));
const makeTurret = _facs.makeTurret || ((def, opts={}) => ({
    PARENT: ['genericTank'],
    LABEL: opts.label||'', INDEPENDENT: opts.independent||true,
    BODY: { FOV: opts.fov||3 },
    CONTROLLERS: opts.hasAI===false ? [] : ['canRepel','onlyAcceptInArc','mapAltToFire','nearestDifferentMaster'],
    COLOR: opts.color||'mirror',
    GUNS: def.GUNS||[], TURRETS: def.TURRETS||[],
}));
const makeMenu = _facs.makeMenu || ((label, opts={}) => ({
    PARENT: ['genericTank'],
    LABEL: label||'', COLOR: opts.color||'white',
    SHAPE: opts.shape||0, SIZE: 14,
    GUNS: [], TURRETS: [], UPGRADES_TIER_0: [],
}));
const weaponArray = _facs.weaponArray || ((weapon, count, opts={}) => {
    const arr = Array.isArray(weapon) ? weapon : [weapon];
    if (!count || count===1) return arr;
    const out = [];
    for (let i=0; i<count; i++) {
        const rot = (360/count)*i;
        for (const w of arr) {
            const c = JSON.parse(JSON.stringify(w));
            if (c.POSITION && Array.isArray(c.POSITION)) c.POSITION[5] = (c.POSITION[5]||0)+rot;
            out.push(c);
        }
    }
    return out;
});
const weaponMirror = _facs.weaponMirror || ((weapon, opts={}) => {
    const w = JSON.parse(JSON.stringify(weapon));
    const mirror = JSON.parse(JSON.stringify(weapon));
    if (mirror.POSITION && Array.isArray(mirror.POSITION)) {
        mirror.POSITION[4] = -(mirror.POSITION[4]||0);
        mirror.POSITION[6] = (mirror.POSITION[6]||0)+(opts.delayIncrement||0.5);
    }
    return [w, mirror];
});
const weaponStack = _facs.weaponStack || ((weapon, count, opts={}) => {
    const out = [];
    for (let i=0; i<count; i++) {
        const c = JSON.parse(JSON.stringify(weapon));
        if (c.POSITION && Array.isArray(c.POSITION)) {
            c.POSITION[3] = (c.POSITION[3]||0)+(opts.xPosOffset||0)*i;
            c.POSITION[6] = (opts.delayIncrement||0)*i;
        }
        out.push(c);
    }
    return out;
});

// ── Safe combineStats ─────────────────────────────────────────────────────────
const safeCS = stats => combineStats(stats.filter(s => s != null));

// ── Gunval shims ──────────────────────────────────────────────────────────────
const _gShim = (a, b, fallback={}) => { g[a] = g[a]||g[b]||fallback; };
_gShim('pelleter',   'pellet',      { reload:0.3, size:0.5, damage:0.35, speed:1.5, maxSpeed:1.5 });
_gShim('pounder',    'pound',       { reload:1.5, recoil:1.4, speed:0.65, maxSpeed:0.65, size:1.25, damage:1.5 });
_gShim('destroyer',  'destroy',     { reload:2, recoil:2, speed:0.55, maxSpeed:0.55, size:1.5, damage:2, pen:1.6 });
_gShim('annihilator','anni',        { reload:2.5, recoil:3, speed:0.45, maxSpeed:0.45, size:2, damage:2.5, pen:2 });
_gShim('machineGun', 'mach',        { reload:0.5, recoil:0.5, spread:2 });
_gShim('minigun',    'mini',        { reload:0.3, size:0.6, damage:0.6, speed:1.1, maxSpeed:1.1 });
_gShim('streamliner','stream',      { reload:0.15, size:0.5, damage:0.5, speed:1.3, maxSpeed:1.3 });
_gShim('overseer',   'over',        { reload:1.5, recoil:0, size:1.3, health:1.2 });
_gShim('spreadshot', 'spread',      { spray:25, reload:0.7, size:0.6, damage:0.7 });
_gShim('artillery',  'arty',        { reload:1.8, spray:2, size:1.2, damage:1.4 });
_gShim('skimmer',    'skim',        { reload:2, recoil:1, speed:0.8, maxSpeed:0.8 });
_gShim('hexaTrapper','hexaTrap',    { reload:0.7, health:1.5, speed:0.3, maxSpeed:0.3 });
_gShim('setTrap',    'setTrap',     { speed:0.5, maxSpeed:0.5, reload:0.8, health:1.5 });
_gShim('constructor','builder',     { reload:1.5, health:2 });
_gShim('barricade',  'barricade',   { health:2, reload:0.5 });
_gShim('launcher',   'launch',      { reload:2.5, recoil:1, size:1.2 });
_gShim('hive',       'hiveGun',     { reload:0.5, size:1.2, damage:0.8 });
_gShim('bee',        'beeGun',      { reload:0.6, size:0.8, speed:1.4, maxSpeed:1.4, damage:0.7 });
_gShim('shotgun',    'shot',        { spray:30, reload:0.3, size:0.7, damage:0.7 });
_gShim('battleship', 'battle',      { reload:0.7, size:0.7 });
_gShim('nestKeeper', 'nest',        { size:1.2, health:1.4, damage:1.4 });
_gShim('summoner',   'summon',      { reload:3, speed:0.5, maxSpeed:0.5, health:3, damage:3, size:1.5 });
_gShim('assassin',   'ass',         { speed:1.6, maxSpeed:1.6, reload:0.55, recoil:0 });
_gShim('predator',   'pred',        { reload:2, damage:1.4, pen:1.2, speed:1.8, maxSpeed:1.8 });
_gShim('sniper',     'snip',        { reload:0.5, recoil:0.5, speed:2, maxSpeed:2, range:1.5, spray:0.3, damage:1.5, pen:1.2 });
_gShim('turret',     'turr',        { reload:0.8, damage:0.85, pen:0.75, speed:1.1, maxSpeed:1.1, recoil:0 });
_gShim('power',      'pow',         { damage:1.5, pen:1.5, health:1.5 });
_gShim('autoTurret', 'autoTurr',    { reload:0.5, damage:0.7, pen:0.5, recoil:0 });
_gShim('minionGun',  'minionG',     { reload:1, damage:0.7, pen:0.7 });
_gShim('cyclone',    'cycl',        { spray:6, reload:0.6, speed:1.2, maxSpeed:1.2 });
_gShim('lowPower',   'lowpow',      { damage:0.5, pen:0.5, health:0.5 });
_gShim('flankGuard', 'flank',       { reload:0.85, recoil:0.85 });
_gShim('boomerang',  'boom',        { speed:0.4, maxSpeed:0.4, reload:1.5 });
_gShim('fake',       'fake',        { size:0.00001, health:0.0001, speed:0, maxSpeed:0, recoil:0, range:0 });
g.weak         = g.weak         || { damage:0.5, health:0.5, speed:0.8, maxSpeed:0.8 };
g.minionGun    = g.minionGun    || { reload:1, damage:0.7, pen:0.7 };
g.carrier      = g.carrier      || { reload:0.7, size:0.7 };
g.halfreload   = g.halfreload   || { reload:2 };
g.twin         = g.twin         || { reload:0.6, recoil:0.6, speed:1.1 };
g.gunner       = g.gunner       || { size:0.6, reload:0.4, speed:1.2 };
g.spam         = g.spam         || { reload:0.2, damage:0.4, size:0.6 };

const doper = { speed:1.5, maxSpeed:1.5, pen:1.25, health:0.8, damage:0.95 };
const SKL9 = Array(10).fill(9);
const SKL7 = Array(10).fill(dfltskl||7);

// ── Shared stupidBullet FOV gun ───────────────────────────────────────────────
const _sfg = { POSITION:[10,10,0,0,0,0,0], PROPERTIES:{
    SHOOT_SETTINGS: safeCS([g.basic,{range:0.0005,speed:0.0005,maxSpeed:0.0005,recoil:0}]),
    TYPE:'stupidBullet', DRAW_FILL:false, BORDERLESS:true,
}};

module.exports = ({ Class }) => {
    console.log('[EAB] Loading Extended Armsrace Bosses...');

// ══════════════════════════════════════════════════════════════════════════════
// ── SHARED TURRET CLASSES ────────────────────────────────────────────────────
// ══════════════════════════════════════════════════════════════════════════════

    Class.EAB_crasherSpawner = makeTurret({ GUNS:[{
        POSITION:[6,12,1.2,8,0,0,0],
        PROPERTIES:{ SHOOT_SETTINGS:safeCS([g.drone,g.weak,g.weak,{health:1.1}]),
            TYPE:['drone',{LABEL:'Crasher',DRAW_HEALTH:true}],
            SYNCS_SKILLS:true, AUTOFIRE:true, STAT_CALCULATOR:'drone', MAX_CHILDREN:4 },
    }]}, {independent:true, aiSettings:{chase:true}, label:'Spawned', color:'pink'});

    Class.EAB_turretedCrasherSpawner = makeTurret({ GUNS:[{
        POSITION:[6,12,1.2,8,0,0,0],
        PROPERTIES:{ SHOOT_SETTINGS:safeCS([g.drone,g.weak,g.weak,{health:1.1}]),
            TYPE:['turretedDrone',{LABEL:'Auto-Crasher',DRAW_HEALTH:true}],
            SYNCS_SKILLS:true, AUTOFIRE:true, STAT_CALCULATOR:'drone', MAX_CHILDREN:4 },
    }]}, {independent:true, aiSettings:{chase:true}, label:'Spawned', color:'pink'});

    Class.EAB_megaCrasherSpawner = makeTurret({ GUNS:[{
        POSITION:[6,16,1.2,8,0,0,0],
        PROPERTIES:{ SHOOT_SETTINGS:safeCS([g.drone,g.weak,g.weak,g.pounder,{health:1.1}]),
            TYPE:['drone',{LABEL:'Mega Crasher',DRAW_HEALTH:true}],
            SYNCS_SKILLS:true, AUTOFIRE:true, STAT_CALCULATOR:'drone', MAX_CHILDREN:2 },
    }]}, {independent:true, aiSettings:{chase:true}, label:'Spawned', color:'pink'});

    Class.EAB_fastCrasherSpawner = makeTurret({ GUNS:[{
        POSITION:[6,12,1.2,8,0,0,0],
        PROPERTIES:{ SHOOT_SETTINGS:safeCS([g.drone,g.weak,g.weak,{health:1.1},doper]),
            TYPE:['drone',{LABEL:'Crasher',DRAW_HEALTH:true}],
            SYNCS_SKILLS:true, AUTOFIRE:true, STAT_CALCULATOR:'drone', MAX_CHILDREN:3 },
    }]}, {independent:true, aiSettings:{chase:true}, label:'Spawned', color:'pink'});

    Class.EAB_biggerauto4gun = makeTurret({ GUNS:[
        ...[-5,-2.5,0,2.5,5].map((y,i)=>({ POSITION:[12+i*0.5,5,1,0,y,0,i*0.2],
            PROPERTIES:{ SHOOT_SETTINGS:safeCS([g.basic,g.pelleter,g.twin,g.twin,g.twin,g.power,{reload:2}]), TYPE:'bullet' }})),
    ]}, {canRepel:true, limitFov:true, fov:3});

    Class.EAB_twinPillboxTurret = makeTurret({ HAS_NO_RECOIL:true, GUNS:[
        {POSITION:[18,7,1,0,5,0,0],   PROPERTIES:{SHOOT_SETTINGS:safeCS([g.basic,g.minionGun,g.turret,g.power,g.autoTurret,{density:0.1,speed:0.5,range:1.5}]),TYPE:'bullet',WAIT_TO_CYCLE:true}},
        {POSITION:[18,7,1,0,-5,0,0.5],PROPERTIES:{SHOOT_SETTINGS:safeCS([g.basic,g.minionGun,g.turret,g.power,g.autoTurret,{density:0.1,speed:0.5,range:1.5}]),TYPE:'bullet',WAIT_TO_CYCLE:true}},
    ]}, {independent:true, extraStats:[]});

    Class.EAB_unsetTwinPillbox = {
        PARENT:'unsetTrap', LABEL:'Pillbox', INDEPENDENT:true, DIE_AT_RANGE:true,
        TURRETS:[{POSITION:[11,0,0,0,360,1], TYPE:'EAB_twinPillboxTurret'}],
    };
    Class.EAB_turretedTrap = makeAuto('trap','Auto-Trap',{type:'droneAutoTurret'});

    Class.EAB_machineHexaTurret = {
        PARENT:'genericTank', FACING_TYPE:['spin',{speed:0.06}], INDEPENDENT:true, COLOR:-1,
        GUNS: weaponArray({POSITION:[12,9.75,1.4,8,0,0,0],PROPERTIES:{SHOOT_SETTINGS:safeCS([g.basic,g.machineGun,g.flankGuard,g.flankGuard]),TYPE:'bullet',AUTOFIRE:true}},6),
    };
    Class.EAB_sprayerTripleTurret = {
        PARENT:'genericTank', FACING_TYPE:['spin',{speed:0.06}], INDEPENDENT:true, COLOR:-1,
        GUNS: weaponArray([
            {POSITION:[23,7,1,0,0,0,0],  PROPERTIES:{SHOOT_SETTINGS:safeCS([g.basic,g.machineGun,g.lowPower,g.pelleter,{recoil:1.15},g.flankGuard]),TYPE:'bullet',AUTOFIRE:true}},
            {POSITION:[12,10,1.4,8,0,0,0],PROPERTIES:{SHOOT_SETTINGS:safeCS([g.basic,g.machineGun,g.flankGuard]),TYPE:'bullet',AUTOFIRE:true}},
        ],3),
    };
    Class.EAB_triPeashooterTurret = {
        PARENT:'genericTank', COLOR:-1, FACING_TYPE:['spin',{independent:true}],
        GUNS: weaponArray([
            {POSITION:[17,8,1,0,0,0,0],PROPERTIES:{SHOOT_SETTINGS:safeCS([g.basic,g.flankGuard,g.flankGuard]),TYPE:'bullet'}},
            {POSITION:[9,7.5,0.6,5,0,0,0],PROPERTIES:{SHOOT_SETTINGS:safeCS([g.swarm,g.flankGuard,g.flankGuard]),TYPE:'autoswarm'}},
            {POSITION:[13,8,1,0,0,60,0]},
            {POSITION:[4,8,1.7,13,0,60,0],PROPERTIES:{SHOOT_SETTINGS:safeCS([g.trap]),TYPE:'trap',STAT_CALCULATOR:'trap'}},
        ],3),
    };

    Class.EAB_ultramissile = {
        PARENT:'missile',
        GUNS:[
            {POSITION:[12.5,6,1,0,-2,135,1/3],PROPERTIES:{AUTOFIRE:true,SHOOT_SETTINGS:safeCS([g.basic,{reload:3}]),TYPE:['bullet',{PERSISTS_AFTER_DEATH:true}],STAT_CALCULATOR:'thruster'}},
            {POSITION:[12.5,6,1,0, 2,225,1/3],PROPERTIES:{AUTOFIRE:true,SHOOT_SETTINGS:safeCS([g.basic,{reload:3}]),TYPE:['bullet',{PERSISTS_AFTER_DEATH:true}],STAT_CALCULATOR:'thruster'}},
            {POSITION:[14,6,1,0,-2,150,0],    PROPERTIES:{AUTOFIRE:true,SHOOT_SETTINGS:safeCS([g.basic,{reload:3}]),TYPE:['bullet',{PERSISTS_AFTER_DEATH:true}],STAT_CALCULATOR:'thruster'}},
            {POSITION:[14,6,1,0, 2,210,0],    PROPERTIES:{AUTOFIRE:true,SHOOT_SETTINGS:safeCS([g.basic,{reload:3}]),TYPE:['bullet',{PERSISTS_AFTER_DEATH:true}],STAT_CALCULATOR:'thruster'}},
            {POSITION:[14,6,1,0,-2,90, 2/3],  PROPERTIES:{AUTOFIRE:true,SHOOT_SETTINGS:safeCS([g.basic,{reload:3}]),TYPE:['bullet',{PERSISTS_AFTER_DEATH:true}]}},
            {POSITION:[14,6,1,0, 2,270,2/3],  PROPERTIES:{AUTOFIRE:true,SHOOT_SETTINGS:safeCS([g.basic,{reload:3}]),TYPE:['bullet',{PERSISTS_AFTER_DEATH:true}]}},
        ],
    };
    Class.EAB_ultraSkimmerTurret = makeTurret({GUNS:[
        {POSITION:[10,14,-0.5,9,0,0,0]},
        {POSITION:[17,15,1,0,0,0,0],PROPERTIES:{SHOOT_SETTINGS:safeCS([g.basic,g.pounder,g.artillery,g.artillery,g.skimmer]),TYPE:'EAB_ultramissile',STAT_CALCULATOR:'sustained'}},
        {POSITION:[3,9.5,0.775,15.75,0,0,0]},
        {POSITION:[17,5,2,0,0,0,0]},
    ]},{canRepel:true,limitFov:true,extraStats:[],color:'mirror'});

    Class.EAB_bazookaTurret = makeTurret({GUNS:[
        {POSITION:[10,16,-0.75,9,0,0,0]},
        {POSITION:[17,17,1,0,0,0,0],PROPERTIES:{SHOOT_SETTINGS:safeCS([g.basic,g.pounder,g.destroyer,g.artillery,g.artillery,g.skimmer]),TYPE:'hypermissile',STAT_CALCULATOR:'sustained'}},
    ]},{canRepel:true,limitFov:true,extraStats:[],color:'mirror'});

    Class.EAB_skidderTurret = makeTurret({GUNS:[
        ...weaponMirror({POSITION:[15,5,1,0,-6,-7,0.25],PROPERTIES:{SHOOT_SETTINGS:safeCS([g.basic,g.pelleter,g.artillery]),TYPE:'bullet',LABEL:'Secondary'}},{delayIncrement:0.5}),
        {POSITION:[10,14,-0.5,9,0,0,0]},
        {POSITION:[17,15,1,0,0,0,0],PROPERTIES:{SHOOT_SETTINGS:safeCS([g.basic,g.pounder,g.artillery,g.artillery,g.skimmer]),TYPE:'hypermissile',STAT_CALCULATOR:'sustained'}},
    ]},{canRepel:true,limitFov:true,extraStats:[],color:'mirror'});

    Class.EAB_explosiveHypermissile = {
        PARENT:'missile',
        GUNS:[
            {POSITION:[14,6,1,0,-2,150,0],PROPERTIES:{AUTOFIRE:true,SHOOT_SETTINGS:safeCS([g.basic,{reload:3}]),TYPE:['bullet',{PERSISTS_AFTER_DEATH:true}],STAT_CALCULATOR:'thruster'}},
            {POSITION:[14,6,1,0, 2,210,0],PROPERTIES:{AUTOFIRE:true,SHOOT_SETTINGS:safeCS([g.basic,{reload:3}]),TYPE:['bullet',{PERSISTS_AFTER_DEATH:true}],STAT_CALCULATOR:'thruster'}},
            {POSITION:[14,6,1,0,-2,90, 0.5],PROPERTIES:{AUTOFIRE:true,SHOOT_SETTINGS:safeCS([g.basic,{reload:3}]),TYPE:['bullet',{PERSISTS_AFTER_DEATH:true}]}},
            {POSITION:[14,6,1,0, 2,270,0.5],PROPERTIES:{AUTOFIRE:true,SHOOT_SETTINGS:safeCS([g.basic,{reload:3}]),TYPE:['bullet',{PERSISTS_AFTER_DEATH:true}]}},
            ...weaponArray([{POSITION:[0,4,0,0,0,0,9999],PROPERTIES:{SHOOT_SETTINGS:safeCS([g.basic,{reload:999}]),TYPE:['bullet',{PERSISTS_AFTER_DEATH:true}],SHOOT_ON_DEATH:true,WAIT_TO_CYCLE:true}}],12),
        ],
        TURRETS:[{POSITION:[9,0,0,0,0,1],TYPE:'genericTank'}],
    };
    Class.EAB_tickerTurret = makeTurret({GUNS:[
        {POSITION:[10,15,-0.75,9,0,0,0]},
        {POSITION:[17,14,1.25,0,0,0,0],PROPERTIES:{SHOOT_SETTINGS:safeCS([g.basic,g.pounder,g.artillery,g.artillery,g.skimmer]),TYPE:'EAB_explosiveHypermissile',STAT_CALCULATOR:'sustained'}},
    ]},{canRepel:true,limitFov:true,extraStats:[],color:'mirror'});

    Class.EAB_recoilerTurret = makeTurret({GUNS:[
        {POSITION:[18,14,1,0,0,0,0]},
        {POSITION:[13,14,-1.425,0,0,0,0]},
        {POSITION:[2,14,1.2,18,0,0,0],PROPERTIES:{SHOOT_SETTINGS:safeCS([g.trap,g.pounder,g.setTrap,g.boomerang]),TYPE:'boomerang',STAT_CALCULATOR:'block'}},
    ]},{canRepel:true,limitFov:true,color:'mirror',extraStats:[]});

    Class.EAB_bentBoomerTurret = makeTurret({GUNS:[
        {POSITION:[18,9,1,0,2,20,0]},{POSITION:[13,9,-1.7,0,2,20,0]},
        {POSITION:[2,9,1.3,18,2,20,0],PROPERTIES:{SHOOT_SETTINGS:safeCS([g.trap,g.setTrap,g.boomerang]),TYPE:'boomerang',STAT_CALCULATOR:'block'}},
        {POSITION:[18,9,1,0,-2,-20,0.5]},{POSITION:[13,9,-1.7,0,-2,-20,0.5]},
        {POSITION:[2,9,1.3,18,-2,-20,0.5],PROPERTIES:{SHOOT_SETTINGS:safeCS([g.trap,g.setTrap,g.boomerang]),TYPE:'boomerang',STAT_CALCULATOR:'block'}},
    ]},{canRepel:true,limitFov:true,color:'mirror',extraStats:[]});

    Class.EAB_parryerTurret = makeTurret({GUNS:[
        {POSITION:[18,8,1,0,0,0,0]},{POSITION:[2,10,1,15.75,0,0,0]},{POSITION:[13,10,-1.9,0,0,0,0]},
        {POSITION:[2,10,1.3,18,0,0,0],PROPERTIES:{SHOOT_SETTINGS:safeCS([g.trap,g.setTrap,g.boomerang]),TYPE:'boomerang',STAT_CALCULATOR:'block'}},
    ]},{canRepel:true,limitFov:true,color:'mirror',extraStats:[]});

    Class.EAB_baseBuilderTurret = makeTurret({GUNS:[
        {POSITION:[17,15,1,0,0,0,0]},
        {POSITION:[3,15,1.3,17,0,0,0],PROPERTIES:{SHOOT_SETTINGS:safeCS([g.trap,g.setTrap,g.pounder,g.hexaTrapper,{reload:1.3,health:1.35,damage:1.4,speed:0.9,shudder:0.1}]),TYPE:'unsetTrap',STAT_CALCULATOR:'trap',AUTOFIRE:true}},
    ]},{independent:true,hasAI:false,extraStats:[]});

    Class.EAB_baseMechTurret = makeTurret({GUNS:[
        {POSITION:[16,14,1,0,0,0,0]},
        {POSITION:[4,14,1.8,16,0,0,0],PROPERTIES:{SHOOT_SETTINGS:safeCS([g.trap,g.pounder,g.hexaTrapper,{reload:1.3,size:1.2,health:1.35,damage:1.4,speed:0.9,shudder:0.1}]),TYPE:'turretedTrap',STAT_CALCULATOR:'trap',AUTOFIRE:true}},
        {POSITION:[11,19,1,0,0,0,0]},
    ]},{independent:true,hasAI:false,extraStats:[]});

    const _sctp = {SHOOT_SETTINGS:safeCS([g.trap,g.setTrap,g.pounder,g.shotgun,g.machineGun,{size:3,reload:0.65,speed:0.7,maxSpeed:0.1,damage:0.7,range:0.5}]),AUTOFIRE:true,TYPE:'shotTrapBox',STAT_CALCULATOR:'block'};
    Class.EAB_shotconstructorTurret = makeTurret({GUNS:[
        {POSITION:[4,3,1,11,-3,0,0],PROPERTIES:_sctp},{POSITION:[4,4,1,11,3,0,0],PROPERTIES:_sctp},
        {POSITION:[1,4,1,11,1,0,0],PROPERTIES:_sctp},{POSITION:[1,4,1,12,-1,0,0],PROPERTIES:_sctp},
        {POSITION:[16,16.75,-1.2,0,0,0,0]},
        {POSITION:[6,16.75,1.4,16,0,0,0],PROPERTIES:{SHOOT_SETTINGS:safeCS([g.trap,g.setTrap,g.pounder,g.shotgun,g.machineGun,{reload:0.65},g.fake]),AUTOFIRE:true,TYPE:'bullet'}},
    ]},{limitFov:true,aiSettings:{SKYNET:true,FULL_VIEW:true,independent:true,extraStats:[]}});

    Class.EAB_blockadeTurret = makeTurret({GUNS:[
        {POSITION:[24,12,1,0,0,0,0]},
        ...weaponStack({POSITION:[4,12,1.1,22,0,0,0],PROPERTIES:{SHOOT_SETTINGS:safeCS([g.trap,g.setTrap,g.minigun,g.barricade]),TYPE:'setTrap',STAT_CALCULATOR:'trap'}},3,{xPosOffset:4,delayIncrement:1/3}),
    ]},{aiSettings:{SKYNET:true,FULL_VIEW:true,independent:true,extraStats:[]}});

    Class.EAB_barrierTurret = makeTurret({GUNS:[
        {POSITION:[32,8,1,0,0,0,0]},
        ...weaponStack({POSITION:[4,8,1.3,30,0,0,0],PROPERTIES:{SHOOT_SETTINGS:safeCS([g.trap,g.minigun,g.barricade]),TYPE:'trap',STAT_CALCULATOR:'trap'}},5,{xPosOffset:4,delayIncrement:1/5}),
    ]},{aiSettings:{SKYNET:true,FULL_VIEW:true,independent:true,extraStats:[]}});

    Class.EAB_propperTurret = makeTurret({GUNS:[
        {POSITION:[26,8,1,0,0,0,0]},
        ...weaponStack({POSITION:[4,8,1.3,24,0,0,0],PROPERTIES:{SHOOT_SETTINGS:safeCS([g.trap,g.minigun,g.barricade]),TYPE:'turretedTrap',STAT_CALCULATOR:'trap'}},3,{xPosOffset:4,delayIncrement:1/3}),
        {POSITION:[13,8*1.3,1,0,0,0,0]},
    ]},{aiSettings:{SKYNET:true,FULL_VIEW:true,independent:true,extraStats:[]}});

    Class.EAB_myriadTurret = makeTurret({GUNS:[
        {POSITION:[15,15.5,-1.2,4,0,0,0],PROPERTIES:{SHOOT_SETTINGS:safeCS([g.basic,g.pounder,g.pounder,g.destroyer,g.hive]),TYPE:'hive'}},
        {POSITION:[15,14.5,1,5,0,0,0]},
    ]},{canRepel:true,limitFov:true,extraStats:[]});

    Class.EAB_explosiveHive = {
        PARENT:'hive',
        GUNS:[
            ...weaponArray({POSITION:[7,9.5,0.6,7,0,108,0],PROPERTIES:{SHOOT_SETTINGS:safeCS([g.swarm,g.hive,g.bee]),TYPE:['bee',{PERSISTS_AFTER_DEATH:true}],STAT_CALCULATOR:'swarm',AUTOFIRE:true}},5,{delayIncrement:0.2}),
            ...weaponArray([{POSITION:[0,4,0,0,0,0,9999],PROPERTIES:{SHOOT_SETTINGS:safeCS([g.basic,{reload:999}]),TYPE:['bullet',{PERSISTS_AFTER_DEATH:true}],SHOOT_ON_DEATH:true,WAIT_TO_CYCLE:true}}],12),
        ],
        TURRETS:[{POSITION:[9,0,0,0,0,1],TYPE:'genericTank'}],
    };
    Class.EAB_molotovTurret = makeTurret({GUNS:[
        {POSITION:[13,13,1.2,5,0,0,0],PROPERTIES:{SHOOT_SETTINGS:safeCS([g.basic,g.pounder,g.destroyer,g.hive]),TYPE:'EAB_explosiveHive'}},
        {POSITION:[15,8,1,5,0,0,0]},{POSITION:[13,12,1,5,0,0,0]},
    ]},{canRepel:true,limitFov:true,extraStats:[]});

    Class.EAB_catapultTurret = makeTurret({GUNS:[
        {POSITION:[10,16,-0.5,9,0,0,0]},
        {POSITION:[17,16.5,-1.2,0,0,0,0],PROPERTIES:{SHOOT_SETTINGS:safeCS([g.basic,g.pounder,g.destroyer,g.artillery,g.artillery,g.skimmer,{speed:0.6,reload:4/3,shudder:0.1}]),TYPE:'spinmissile',STAT_CALCULATOR:'sustained+lowspeed'}},
    ]},{canRepel:true,limitFov:true,color:'mirror',extraStats:[{speed:1.3,maxSpeed:1.3}]});

    Class.EAB_hyperTwisterTurret = makeTurret({GUNS:[
        {POSITION:[10,13,-0.5,9,0,0,0]},
        {POSITION:[17,14,-1.4,0,0,0,0],PROPERTIES:{SHOOT_SETTINGS:safeCS([g.basic,g.pounder,g.artillery,g.artillery,g.skimmer,{speed:0.6,reload:4/3,shudder:0.1}]),TYPE:'hyperspinmissile',STAT_CALCULATOR:'sustained+lowspeed'}},
        {POSITION:[10,7,-0.5,9,0,0,0]},{POSITION:[10,14,0.5,7,0,0,0]},
    ]},{canRepel:true,limitFov:true,color:'mirror',extraStats:[{speed:1.3,maxSpeed:1.3}]});

    // ── Spinner turrets ────────────────────────────────────────────────────
    Class.EAB_eliteSpinnerGaleTurret = {
        PARENT:'genericTank', COLOR:-1, FACING_TYPE:['spin',{speed:-0.1,independent:true}],
        GUNS:[
            ...weaponArray([
                {POSITION:[18,8,1,0,0,45,0.5],PROPERTIES:{SHOOT_SETTINGS:safeCS([g.basic,g.flankGuard,g.flankGuard,g.spam]),TYPE:'bullet'}},
                {POSITION:[18,8,1,0,0,0,0],  PROPERTIES:{SHOOT_SETTINGS:safeCS([g.basic,g.flankGuard,g.flankGuard,g.spam]),TYPE:'bullet'}},
            ],4),
            ...weaponArray([
                {POSITION:[14,3.5,1,0,0,-15,0],  PROPERTIES:{SHOOT_SETTINGS:safeCS([g.basic,g.twin,g.gunner,g.cyclone]),TYPE:'bullet'}},
                {POSITION:[14,3.5,1,0,0, 15,0.5],PROPERTIES:{SHOOT_SETTINGS:safeCS([g.basic,g.twin,g.gunner,g.cyclone]),TYPE:'bullet'}},
            ],4),
        ],
    };
    Class.EAB_eliteSpinnerTroveTurret = {
        PARENT:'genericTank', COLOR:-1, FACING_TYPE:['spin',{speed:-0.1,independent:true}],
        GUNS: weaponArray([
            {POSITION:[14,3.5,1,0,0,-15,0],  PROPERTIES:{SHOOT_SETTINGS:safeCS([g.basic,g.twin,g.gunner,g.cyclone]),TYPE:'bullet'}},
            {POSITION:[14,3.5,1,0,0, 15,0.5],PROPERTIES:{SHOOT_SETTINGS:safeCS([g.basic,g.twin,g.gunner,g.cyclone]),TYPE:'bullet'}},
        ],4),
        TURRETS: weaponArray({POSITION:[11,7,0,45,180,0],TYPE:['auto4gun',{INDEPENDENT:true}]},4),
    };

    // Mystical bases
    Class.EAB_turretedEggchip  = makeAuto('sorcererDrone','Auto-Drone',{type:'droneAutoTurret'});
    Class.EAB_turretedSunchip  = makeAuto('summonerDrone','Auto-Drone',{type:'droneAutoTurret'});
    Class.EAB_turretedDorito   = makeAuto('enchantressDrone','Auto-Drone',{type:'droneAutoTurret'});
    Class.EAB_turretedDemonchip= makeAuto('exorcistorDrone','Auto-Drone',{type:'droneAutoTurret'});
    Class.EAB_turretedRealchip = makeAuto('shamanDrone','Auto-Drone',{type:'droneAutoTurret'});

    // baltimoreTurret / moseyTurret helpers
    Class.EAB_baltimoreTurret = makeTurret({GUNS:weaponMirror({POSITION:[10,9.25,0.75,4,4.5,0,0],PROPERTIES:{SHOOT_SETTINGS:safeCS([g.swarm,g.pounder]),TYPE:'swarm',STAT_CALCULATOR:'swarm'}},{delayIncrement:0.5})},{canRepel:true,limitFov:true,extraStats:[]});
    Class.EAB_moseyTurret = makeTurret({GUNS:[
        ...weaponMirror({POSITION:[9,8.2,0.6,5,4,0,0],PROPERTIES:{SHOOT_SETTINGS:safeCS([g.swarm,doper]),TYPE:'swarm',STAT_CALCULATOR:'swarm'}},{delayIncrement:0.5}),
        ...weaponMirror({POSITION:[10,0.5,-5,5,4,0,0]},{delayIncrement:0.5}),
    ]},{canRepel:true,limitFov:true,extraStats:[]});

    const mystical_gp    = {LENGTH:3.5, WIDTH:8.65,  ASPECT:1.2,  X:8};
    const mystical_gph   = {LENGTH:4,   WIDTH:10,    ASPECT:1.15, X:8};
    const mystical_gpd   = {LENGTH:4.2, WIDTH:0.786, ASPECT:-5,   X:8};
    const mgPos  = (p) => [p.LENGTH, p.WIDTH,  p.ASPECT, p.X, 0, 0, 0];
    const mgPosH = (p) => [p.LENGTH, p.WIDTH,  p.ASPECT, p.X, 0, 0, 0];

// ══════════════════════════════════════════════════════════════════════════════
// ── ELITES ───────────────────────────────────────────────────────────────────
// ══════════════════════════════════════════════════════════════════════════════

    // Elite Destroyer variants ─────────────────────────────────────────────────
    const _edBase = (label, tooltip, guns, turretTypes) => ({
        PARENT:'elite', UPGRADE_LABEL:label, UPGRADE_TOOLTIP:tooltip, UPGRADE_COLOR:'pink',
        GUNS: guns,
        TURRETS:[
            ...weaponArray({POSITION:[11,0,0,60,360,0],TYPE:turretTypes[0]||'EAB_crasherSpawner'},3),
            {POSITION:[11,0,0,0,360,1],TYPE:['bigauto4gun',{INDEPENDENT:true,COLOR:-1}]},
        ],
    });
    Class.EAB_eliteDestroyerBigMac = _edBase('Elite Destroyer','(Big Mac)',[
        ...weaponArray({POSITION:[5,25,-0.7,4,0,60,0]},3),
        ...weaponArray({POSITION:[5,25,1,9,0,60,0],PROPERTIES:{SHOOT_SETTINGS:safeCS([g.basic,g.pounder,g.pounder,g.destroyer,g.destroyer]),TYPE:'bullet',LABEL:'Obliterator'}},3),
    ],['EAB_crasherSpawner']);
    Class.EAB_eliteDestroyerConstructor = _edBase('Elite Destroyer','(Constructor)',[
        ...weaponArray({POSITION:[5,15.5,1,6,0,60,0]},3),
        ...weaponArray({POSITION:[1.5,15.5,1.05,11,0,60,0],PROPERTIES:{SHOOT_SETTINGS:safeCS([g.basic,g.setTrap,g.pounder,g.pounder,g.destroyer]),TYPE:'unsetTrap',LABEL:'Producer'}},3),
    ],['EAB_crasherSpawner']);
    Class.EAB_eliteDestroyerLauncher = _edBase('Elite Destroyer','(Launcher)',[
        ...weaponArray({POSITION:[6.5,14,1,6,0,60,0]},3),
        ...weaponArray({POSITION:[5,16.5,1,6,0,60,0],PROPERTIES:{SHOOT_SETTINGS:safeCS([g.basic,g.pounder,g.pounder,g.destroyer,g.launcher]),TYPE:'minimissile',LABEL:'Diluter'}},3),
    ],['EAB_crasherSpawner']);
    Class.EAB_eliteDestroyerPenta = {
        PARENT:'elite', UPGRADE_LABEL:'Elite Destroyer', UPGRADE_TOOLTIP:'(Penta)', UPGRADE_COLOR:'pink',
        GUNS: weaponArray({POSITION:[5,16,1,6,0,60,0],PROPERTIES:{SHOOT_SETTINGS:safeCS([g.basic,g.pounder,g.pounder,g.destroyer]),TYPE:'bullet',LABEL:'Devastator'}},3),
        TURRETS:[...weaponArray({POSITION:[11,0,0,60,360,0],TYPE:'EAB_crasherSpawner'},3),{POSITION:[12,0,0,0,360,1],TYPE:['EAB_biggerauto4gun',{INDEPENDENT:true,COLOR:-1}]}],
    };
    Class.EAB_eliteDestroyerDrive = {
        PARENT:'elite', UPGRADE_LABEL:'Elite Destroyer', UPGRADE_TOOLTIP:'(Drive)', UPGRADE_COLOR:'pink',
        GUNS: weaponArray({POSITION:[5,16,1,6,0,60,0],PROPERTIES:{SHOOT_SETTINGS:safeCS([g.basic,g.pounder,g.pounder,g.destroyer]),TYPE:'bullet',LABEL:'Devastator'}},3),
        TURRETS:[...weaponArray({POSITION:[11,0,0,60,360,0],TYPE:'EAB_turretedCrasherSpawner'},3),{POSITION:[11,0,0,0,360,1],TYPE:['triangle',{INDEPENDENT:true,MIRROR_MASTER_ANGLE:true,COLOR:'grey'}]},{POSITION:[11,0,0,0,360,1],TYPE:['bigauto4gun',{INDEPENDENT:true,COLOR:-1}]}],
    };
    Class.EAB_eliteDestroyerHoncho = {
        PARENT:'elite', UPGRADE_LABEL:'Elite Destroyer', UPGRADE_TOOLTIP:'(Honcho)', UPGRADE_COLOR:'pink',
        GUNS:[...weaponArray({POSITION:[5,16,1,6,0,60,0],PROPERTIES:{SHOOT_SETTINGS:safeCS([g.basic,g.pounder,g.pounder,g.destroyer]),TYPE:'bullet',LABEL:'Devastator'}},3),...weaponArray({POSITION:[8,11,0.5,6,0,0,0]},3)],
        TURRETS:[...weaponArray({POSITION:[11,0,0,60,360,0],TYPE:'EAB_megaCrasherSpawner'},3),{POSITION:[11,0,0,0,360,1],TYPE:['bigauto4gun',{INDEPENDENT:true,COLOR:-1}]}],
    };
    Class.EAB_eliteDestroyerDoper = {
        PARENT:'elite', UPGRADE_LABEL:'Elite Destroyer', UPGRADE_TOOLTIP:'(Doper)', UPGRADE_COLOR:'pink',
        GUNS:[...weaponArray({POSITION:[5,16,1,6,0,60,0],PROPERTIES:{SHOOT_SETTINGS:safeCS([g.basic,g.pounder,g.pounder,g.destroyer]),TYPE:'bullet',LABEL:'Devastator'}},3),...weaponArray({POSITION:[4,2,0.5,14,0,0,0]},3)],
        TURRETS:[...weaponArray({POSITION:[11,0,0,60,360,0],TYPE:'EAB_fastCrasherSpawner'},3),{POSITION:[11,0,0,0,360,1],TYPE:['bigauto4gun',{INDEPENDENT:true,COLOR:-1}]}],
    };

    // Elite Gunner ────────────────────────────────────────────────────────────
    const _egBase = (label, tooltip, guns, turrets=[]) => ({
        PARENT:'elite', UPGRADE_LABEL:label, UPGRADE_TOOLTIP:tooltip, UPGRADE_COLOR:'pink',
        FACING_TYPE:'toTarget', AI:{NO_LEAD:false},
        GUNS:guns,
        TURRETS:[
            {POSITION:[14,8,0,60,180,0],TYPE:'auto4gun'},
            {POSITION:[14,8,0,300,180,0],TYPE:'auto4gun'},
            ...turrets,
        ],
    });
    Class.EAB_eliteGunnerMechanic   = _egBase('Elite Gunner','(Mechanic)',[{POSITION:[12,19,1,2,0,180,0]},{POSITION:[4,19,1.25,14,0,180,0],PROPERTIES:{SHOOT_SETTINGS:safeCS([g.trap,g.setTrap,g.pounder,g.destroyer,{speed:1.5,range:0.3}]),TYPE:'unsetPillbox',NO_LIMITATIONS:true,STAT_CALCULATOR:'trap'}},{POSITION:[5,14,-2,3,0,60,0]},{POSITION:[5,14,-2,3,0,300,0]}]);
    Class.EAB_eliteGunnerDriver     = _egBase('Elite Gunner','(Driver)',  [{POSITION:[14,16,1,0,0,180,0]},{POSITION:[4,16,1.5,14,0,180,0],PROPERTIES:{SHOOT_SETTINGS:safeCS([g.trap,g.setTrap,g.pounder,{speed:1.5,range:0.3}]),TYPE:'EAB_unsetTwinPillbox',NO_LIMITATIONS:true,STAT_CALCULATOR:'trap'}},{POSITION:[14,6,1,0,0,180,0]},{POSITION:[6,14,-2,2,0,60,0]},{POSITION:[6,14,-2,2,0,300,0]}]);
    Class.EAB_eliteGunnerSpecialist = _egBase('Elite Gunner','(Specialist)',[{POSITION:[14,16,1,0,0,180,0]},{POSITION:[14,6,0.5,0,0,180,0]},{POSITION:[4,16,1.5,14,0,180,0],PROPERTIES:{SHOOT_SETTINGS:safeCS([g.trap,g.setTrap,g.pounder,{speed:1.5,range:0.3}]),TYPE:'unsetPillbox',NO_LIMITATIONS:true,STAT_CALCULATOR:'trap'}},{POSITION:[6,14,-2,2,0,60,0]},{POSITION:[6,14,-2,2,0,300,0]}]);
    Class.EAB_eliteGunnerTriplet    = {PARENT:'elite',UPGRADE_LABEL:'Elite Gunner',UPGRADE_TOOLTIP:'(Triplet)',UPGRADE_COLOR:'pink',FACING_TYPE:'toTarget',AI:{NO_LEAD:false},GUNS:[{POSITION:[14,16,1,0,0,180,0]},{POSITION:[4,16,1.5,14,0,180,0],PROPERTIES:{SHOOT_SETTINGS:safeCS([g.trap,g.setTrap,g.pounder,{speed:1.5,range:0.3}]),TYPE:'unsetPillbox',NO_LIMITATIONS:true,STAT_CALCULATOR:'trap'}},{POSITION:[6,14,-2,2,0,60,0]},{POSITION:[6,14,-2,2,0,300,0]}],TURRETS:[{POSITION:[14,8,0,60,180,0],TYPE:'bigauto4gun'},{POSITION:[14,8,0,300,180,0],TYPE:'bigauto4gun'}]};

    // ── NEW: Elite Predator ──────────────────────────────────────────────────
    // Long range sniper-style elite with paired predator beams
    Class.EAB_elitePredatorSniper = {
        PARENT:'elite', UPGRADE_LABEL:'Elite Predator', UPGRADE_TOOLTIP:'(Sniper)', UPGRADE_COLOR:'pink',
        FACING_TYPE:'toTarget', AI:{NO_LEAD:false},
        GUNS:[
            {POSITION:[36,7,1,0,0,0,0],  PROPERTIES:{SHOOT_SETTINGS:safeCS([g.basic,g.sniper,g.assassin,g.predator,{damage:1.3,pen:1.2}]),TYPE:'bullet',LABEL:'Apex'}},
            {POSITION:[30,10,1,0,0,0,0.2],PROPERTIES:{SHOOT_SETTINGS:safeCS([g.basic,g.sniper,g.predator,{damage:1.15}]),TYPE:'bullet'}},
            {POSITION:[24,14,1,0,0,0,0.4],PROPERTIES:{SHOOT_SETTINGS:safeCS([g.basic,g.sniper,g.predator,{damage:1.0}]),TYPE:'bullet'}},
        ],
        TURRETS:[{POSITION:[14,0,0,0,360,1],TYPE:['auto4gun',{INDEPENDENT:true,COLOR:-1}]}],
    };
    Class.EAB_elitePredatorDual = {
        PARENT:'elite', UPGRADE_LABEL:'Elite Predator', UPGRADE_TOOLTIP:'(Dual)', UPGRADE_COLOR:'pink',
        FACING_TYPE:'toTarget', AI:{NO_LEAD:false},
        GUNS:[
            {POSITION:[30,7,1,0,5,0,0],  PROPERTIES:{SHOOT_SETTINGS:safeCS([g.basic,g.sniper,g.assassin,g.predator,{damage:1.2}]),TYPE:'bullet',LABEL:'Apex'}},
            {POSITION:[30,7,1,0,-5,0,0.5],PROPERTIES:{SHOOT_SETTINGS:safeCS([g.basic,g.sniper,g.assassin,g.predator,{damage:1.2}]),TYPE:'bullet',LABEL:'Apex'}},
            {POSITION:[22,12,1,0,0,0,0.25],PROPERTIES:{SHOOT_SETTINGS:safeCS([g.basic,g.sniper,g.predator]),TYPE:'bullet'}},
        ],
        TURRETS:[{POSITION:[12,0,0,0,360,1],TYPE:['auto4gun',{INDEPENDENT:true,COLOR:-1}]}],
    };
    Class.EAB_elitePredatorRanger = {
        PARENT:'elite', UPGRADE_LABEL:'Elite Predator', UPGRADE_TOOLTIP:'(Ranger)', UPGRADE_COLOR:'pink',
        FACING_TYPE:'toTarget', AI:{NO_LEAD:false},
        GUNS:[
            {POSITION:[42,6,1,0,0,0,0],  PROPERTIES:{SHOOT_SETTINGS:safeCS([g.basic,g.sniper,g.assassin,g.predator,{damage:1.5,pen:1.4,range:1.5,speed:1.3}]),TYPE:'bullet',LABEL:'Ultra Apex'}},
            {POSITION:[28,10,1,0,0,0,0.15],PROPERTIES:{SHOOT_SETTINGS:safeCS([g.basic,g.sniper,g.predator,{damage:1.2}]),TYPE:'bullet'}},
            {POSITION:[14,14,-1.2,0,0,0,0],PROPERTIES:{SHOOT_SETTINGS:safeCS([g.basic,g.sniper,g.predator,{damage:0.001},g.fake]),TYPE:'bullet'}},
        ],
        TURRETS:[{POSITION:[14,0,0,0,360,1],TYPE:['auto4gun',{INDEPENDENT:true,COLOR:-1}]}],
    };

    // ── NEW: Elite Necromancer ─────────────────────────────────────────────
    Class.EAB_eliteNecromancerSummoner = {
        PARENT:'elite', UPGRADE_LABEL:'Elite Necromancer', UPGRADE_TOOLTIP:'(Summoner)', UPGRADE_COLOR:'pink',
        FACING_TYPE:'toTarget', AI:{NO_LEAD:false}, MAX_CHILDREN:24,
        GUNS:[
            {POSITION:[0,9,1.1,10,0,  0,0],   PROPERTIES:{SHOOT_SETTINGS:safeCS([g.drone,g.overseer,{health:1.4,damage:1.3,size:1.1}]),TYPE:['summonerDrone',{INDEPENDENT:true}],AUTOFIRE:true,SYNCS_SKILLS:true,WAIT_TO_CYCLE:true,MAX_CHILDREN:6,STAT_CALCULATOR:'drone'}},
            {POSITION:[0,9,1.1,10,0, 90,0.25],PROPERTIES:{SHOOT_SETTINGS:safeCS([g.drone,g.overseer,{health:1.4,damage:1.3,size:1.1}]),TYPE:['summonerDrone',{INDEPENDENT:true}],AUTOFIRE:true,SYNCS_SKILLS:true,WAIT_TO_CYCLE:true,MAX_CHILDREN:6,STAT_CALCULATOR:'drone'}},
            {POSITION:[0,9,1.1,10,0,180,0.5],  PROPERTIES:{SHOOT_SETTINGS:safeCS([g.drone,g.overseer,{health:1.4,damage:1.3,size:1.1}]),TYPE:['summonerDrone',{INDEPENDENT:true}],AUTOFIRE:true,SYNCS_SKILLS:true,WAIT_TO_CYCLE:true,MAX_CHILDREN:6,STAT_CALCULATOR:'drone'}},
            {POSITION:[0,9,1.1,10,0,270,0.75], PROPERTIES:{SHOOT_SETTINGS:safeCS([g.drone,g.overseer,{health:1.4,damage:1.3,size:1.1}]),TYPE:['summonerDrone',{INDEPENDENT:true}],AUTOFIRE:true,SYNCS_SKILLS:true,WAIT_TO_CYCLE:true,MAX_CHILDREN:6,STAT_CALCULATOR:'drone'}},
        ],
        TURRETS:[{POSITION:[11,0,0,0,360,1],TYPE:['auto4gun',{INDEPENDENT:true,COLOR:-1}]}],
    };
    Class.EAB_eliteNecromancerOverlord = {
        PARENT:'elite', UPGRADE_LABEL:'Elite Necromancer', UPGRADE_TOOLTIP:'(Overlord)', UPGRADE_COLOR:'pink',
        FACING_TYPE:'toTarget', AI:{NO_LEAD:false}, MAX_CHILDREN:16,
        GUNS:[
            ...[0,90,180,270].map((a,i)=>({POSITION:[0,9,1.1,10,0,a,i*0.25],PROPERTIES:{SHOOT_SETTINGS:safeCS([g.drone,g.overseer,g.pounder,{health:1.5,damage:1.4,size:1.2}]),TYPE:['drone',{INDEPENDENT:true}],AUTOFIRE:true,SYNCS_SKILLS:true,WAIT_TO_CYCLE:true,MAX_CHILDREN:4,STAT_CALCULATOR:'drone'}})),
        ],
        TURRETS:[{POSITION:[11,0,0,0,360,1],TYPE:['auto4gun',{INDEPENDENT:true,COLOR:-1}]}],
    };
    Class.EAB_eliteNecromancerDemonchip = {
        PARENT:'elite', UPGRADE_LABEL:'Elite Necromancer', UPGRADE_TOOLTIP:'(Demonchip)', UPGRADE_COLOR:'pink',
        FACING_TYPE:'toTarget', AI:{NO_LEAD:false}, MAX_CHILDREN:12,
        GUNS:[
            ...[0,120,240].map((a,i)=>({POSITION:[0,10,1.2,10,0,a,i/3],PROPERTIES:{SHOOT_SETTINGS:safeCS([g.drone,g.overseer,g.destroyer,{health:1.8,damage:1.7,density:2,size:1.3,maxSpeed:1.4}]),TYPE:['demonchip',{INDEPENDENT:true}],AUTOFIRE:true,SYNCS_SKILLS:true,WAIT_TO_CYCLE:true,MAX_CHILDREN:4,STAT_CALCULATOR:'drone'}})),
        ],
        TURRETS:[{POSITION:[12,0,0,0,360,1],TYPE:['auto4gun',{INDEPENDENT:true,COLOR:-1}]}],
    };

    // Elite Sprayer ───────────────────────────────────────────────────────────
    const _esBase = (label, tooltip, innerTurret, outerType) => ({
        PARENT:'elite', UPGRADE_LABEL:label, UPGRADE_TOOLTIP:tooltip, UPGRADE_COLOR:'pink',
        SKILL_CAP:[3,5,5,5,3,1,0,9,1,0], AI:{NO_LEAD:false}, HAS_NO_RECOIL:true,
        TURRETS:[
            {POSITION:[6,0,0,0,360,1],TYPE:[innerTurret,{INDEPENDENT:true}]},
            ...weaponArray([
                {POSITION:[9,6,-5,60,130,0],TYPE:[outerType,{COLOR:'grey',GUN_STAT_SCALE:{damage:0.9,resist:0.95}}]},
                {POSITION:[9,6,5,60,130,0], TYPE:[outerType,{COLOR:'grey',GUN_STAT_SCALE:{damage:0.9,resist:0.95}}]},
            ],3),
        ],
    });
    Class.EAB_eliteSprayerRedistributor = _esBase('Elite Sprayer','(Redistributor)','machineTripleTurret','redistributor');
    Class.EAB_eliteSprayerAtomizer      = _esBase('Elite Sprayer','(Atomizer)',     'machineTripleTurret','atomizer');
    Class.EAB_eliteSprayerFocal         = _esBase('Elite Sprayer','(Focal)',        'machineTripleTurret','focal');
    Class.EAB_eliteSprayerHexaMachine   = _esBase('Elite Sprayer','(Hexa Machine)', 'EAB_machineHexaTurret','sprayer');
    Class.EAB_eliteSprayerTripleSprayer = _esBase('Elite Sprayer','(Triple Sprayer)','EAB_sprayerTripleTurret','sprayer');

    // ── NEW: Elite Sprayer Streamliner ─────────────────────────────────────
    Class.EAB_streamlinerRingTurret = {
        PARENT:'genericTank', COLOR:-1, FACING_TYPE:['spin',{speed:0.08,independent:true}],
        GUNS: weaponArray({POSITION:[22,7,1,0,0,0,0],PROPERTIES:{SHOOT_SETTINGS:safeCS([g.basic,g.minigun,g.streamliner,{damage:1.2,reload:0.4}]),TYPE:'bullet',AUTOFIRE:true}},6),
    };
    Class.EAB_eliteSprayerStreamliner = _esBase('Elite Sprayer','(Streamliner)','EAB_streamlinerRingTurret','sprayer');

    // Elite Battleship ────────────────────────────────────────────────────────
    const _ebsGuns = (extraStats=[]) => weaponArray([
        ...[-8,0,8].map((y,i)=>({POSITION:[4,6,0.6,7,y,60,i*0.25],PROPERTIES:{SHOOT_SETTINGS:safeCS([g.swarm,g.battleship,{speed:0.95,maxSpeed:0.95,health:1.1,resist:1.05},...extraStats]),TYPE:'autoswarm',STAT_CALCULATOR:'swarm'}})),
    ],3);
    const _ebsBase = (label, tooltip, guns, innerTurret) => ({
        PARENT:'elite', UPGRADE_LABEL:label, UPGRADE_TOOLTIP:tooltip, UPGRADE_COLOR:'pink',
        GUNS:guns, TURRETS:weaponArray({POSITION:[5,7,0,0,360,1],TYPE:[innerTurret,{INDEPENDENT:true,COLOR:-1}]},3),
    });
    Class.EAB_eliteBattleshipCarrier  = _ebsBase('Elite Battleship','(Carrier)', weaponArray([...[-8,-2.666,2.666,8].map((y,i)=>({POSITION:[3.75,5.5,0.6,7,y,60,i*0.25],PROPERTIES:{SHOOT_SETTINGS:safeCS([g.swarm,g.battleship,{speed:0.95,maxSpeed:0.95,health:1.1,resist:1.05}]),TYPE:'autoswarm',STAT_CALCULATOR:'swarm'}}))],3),'autoTankGun');
    Class.EAB_eliteBattleshipHoncho   = _ebsBase('Elite Battleship','(Honcho)',  weaponArray([...[-8,0,8].map((y,i)=>({POSITION:[4,7,0.7,7,y,60,i*0.25],PROPERTIES:{SHOOT_SETTINGS:safeCS([g.swarm,g.pounder,g.battleship,{speed:0.95,maxSpeed:0.95,health:1.1,resist:1.05}]),TYPE:'autoswarm',STAT_CALCULATOR:'swarm'}}))],3),'autoTankGun');
    Class.EAB_eliteBattleshipDoper    = _ebsBase('Elite Battleship','(Doper)',   _ebsGuns([doper]),'autoTankGun');
    Class.EAB_eliteBattleshipMore     = { PARENT:'elite', UPGRADE_LABEL:'Elite Battleship', UPGRADE_TOOLTIP:'(More)', UPGRADE_COLOR:'pink', GUNS:_ebsGuns(), TURRETS:[...weaponArray({POSITION:[5,7,0,0,360,1],TYPE:['autoTankGun',{INDEPENDENT:true,COLOR:-1}]},3),...weaponArray({POSITION:[5,3.5,0,60,360,1],TYPE:['autoTankGun',{INDEPENDENT:true,COLOR:-1}]},3)]};
    Class.EAB_eliteBattleshipTwin     = _ebsBase('Elite Battleship','(Twin)',    _ebsGuns(),'auto4gun');
    Class.EAB_eliteBattleshipMega     = _ebsBase('Elite Battleship','(Mega)',    _ebsGuns(),'megaAutoTankGun');

    // Elite Spawner ───────────────────────────────────────────────────────────
    const _espBase = (label, tooltip, maxChild, skill, guns) => ({
        PARENT:'elite', UPGRADE_LABEL:label, UPGRADE_TOOLTIP:tooltip, UPGRADE_COLOR:'pink',
        MAX_CHILDREN:maxChild, AI:{STRAFE:false},
        SKILL_CAP:Array(10).fill(15), SKILL_CAP:skill||Array(10).fill(15),
        GUNS:guns,
        TURRETS:[{POSITION:[11,0,0,0,360,1],TYPE:['auto4gun',{INDEPENDENT:false,COLOR:-1}]}],
    });
    Class.EAB_superSentrySwarmMinion = { PARENT:'sentrySwarmMinion', GUNS:weaponMirror({POSITION:[7,10,0.6,7,5.5,180,0],PROPERTIES:{SHOOT_SETTINGS:safeCS([g.swarm,{recoil:1.15,range:0.9}]),TYPE:'swarm',STAT_CALCULATOR:'swarm'}},{delayIncrement:0.5})};
    Class.EAB_superSentryGunMinion   = { PARENT:'sentryGunMinion',   TURRETS:[{POSITION:[12,0,0,0,360,1],TYPE:['ultraAutoTankGun',{GUN_STAT_SCALE:{health:0.8}}]}]};
    Class.EAB_superSentryTrapMinion  = { PARENT:'sentryTrapMinion',  TURRETS:[{POSITION:[12,0,0,0,360,1],TYPE:'megaTrapTurret'}]};
    const _sentryGuns = (type1,type2,type3, reload=2,size=0.5) => [
        {POSITION:[1.8,18,1,11.5,0,60, 0],PROPERTIES:{SHOOT_SETTINGS:safeCS([g.drone,{reload,size,speed:0.6,maxSpeed:0.6}]),TYPE:type1,NO_LIMITATIONS:true,SYNCS_SKILLS:true,AUTOFIRE:true,STAT_CALCULATOR:'drone'}},
        {POSITION:[1.8,18,1,11.5,0,180,0],PROPERTIES:{SHOOT_SETTINGS:safeCS([g.drone,{reload,size,speed:0.6,maxSpeed:0.6}]),TYPE:type2,NO_LIMITATIONS:true,SYNCS_SKILLS:true,AUTOFIRE:true,STAT_CALCULATOR:'drone'}},
        {POSITION:[1.8,18,1,11.5,0,300,0],PROPERTIES:{SHOOT_SETTINGS:safeCS([g.drone,{reload,size,speed:0.6,maxSpeed:0.6}]),TYPE:type3,NO_LIMITATIONS:true,SYNCS_SKILLS:true,AUTOFIRE:true,STAT_CALCULATOR:'drone'}},
    ];
    Class.EAB_eliteSpawnerFactory = {PARENT:'elite',UPGRADE_LABEL:'Elite Spawner',UPGRADE_TOOLTIP:'(Factory)',UPGRADE_COLOR:'pink',MAX_CHILDREN:9,AI:{STRAFE:false},SKILL_CAP:Array(10).fill(15),GUNS:[...weaponArray([{POSITION:[11.5,16,1,0,0,60,0]}],3),...weaponArray([{POSITION:[9.675,18,1,0,0,60,0]}],3),..._sentryGuns('EAB_superSentrySwarmMinion','EAB_superSentryTrapMinion','EAB_superSentryGunMinion')],TURRETS:[{POSITION:[11,0,0,0,360,1],TYPE:['auto4gun',{INDEPENDENT:false,COLOR:-1}]}]};
    Class.EAB_eliteSpawnerHoncho  = {PARENT:'elite',UPGRADE_LABEL:'Elite Spawner',UPGRADE_TOOLTIP:'(Honcho)', UPGRADE_COLOR:'pink',MAX_CHILDREN:6,AI:{STRAFE:false},SKILL_CAP:Array(10).fill(15),GUNS:[...weaponArray([{POSITION:[10,18.5,1,1,0,60,0]}],3),..._sentryGuns('sentrySwarmMinion','sentryTrapMinion','sentryGunMinion')],TURRETS:[{POSITION:[11,0,0,0,360,1],TYPE:['auto4gun',{INDEPENDENT:false,COLOR:-1}]}]};
    Class.EAB_eliteSpawnerDoper   = {PARENT:'elite',UPGRADE_LABEL:'Elite Spawner',UPGRADE_TOOLTIP:'(Doper)',  UPGRADE_COLOR:'pink',MAX_CHILDREN:6,AI:{STRAFE:false},SKILL_CAP:Array(10).fill(15),GUNS:[...weaponArray([{POSITION:[11,16,1,0,0,60,0]}],3),..._sentryGuns('sentrySwarmMinion','sentryTrapMinion','sentryGunMinion'),  ...weaponArray([{POSITION:[14,7/11,-5,0,0,60,0]}],3)],TURRETS:[{POSITION:[11,0,0,0,360,1],TYPE:['auto4gun',{INDEPENDENT:false,COLOR:-1}]}]};
    Class.EAB_eliteSpawnerTriplet = {PARENT:'elite',UPGRADE_LABEL:'Elite Spawner',UPGRADE_TOOLTIP:'(Triplet)',UPGRADE_COLOR:'pink',MAX_CHILDREN:9,AI:{STRAFE:false},SKILL_CAP:Array(10).fill(15),GUNS:[...weaponArray([{POSITION:[11,16,1,0,0,60,0]}],3),..._sentryGuns('sentrySwarmMinion','sentryTrapMinion','sentryGunMinion')],TURRETS:[{POSITION:[11,0,0,0,360,1],TYPE:['bigauto4gun',{INDEPENDENT:false,COLOR:-1}]}]};

    // ── NEW: Elite Spawner Nexus — spawns all 3 super minion types simultaneously ─
    Class.EAB_eliteSpawnerNexus = {
        PARENT:'elite', UPGRADE_LABEL:'Elite Spawner', UPGRADE_TOOLTIP:'(Nexus)', UPGRADE_COLOR:'pink',
        MAX_CHILDREN:12, AI:{STRAFE:false}, SKILL_CAP:Array(10).fill(15),
        GUNS:[
            ...weaponArray([{POSITION:[11,16,1,0,0,60,0]},{POSITION:[9,18,1,0,0,60,0]}],3),
            ..._sentryGuns('EAB_superSentrySwarmMinion','EAB_superSentryTrapMinion','EAB_superSentryGunMinion'),
        ],
        TURRETS:[{POSITION:[11,0,0,0,360,1],TYPE:['EAB_biggerauto4gun',{INDEPENDENT:false,COLOR:-1}]}],
    };

    // Elite Trap Guard ─────────────────────────────────────────────────────────
    const _etgBase = (label, tooltip, guns, centralTurret, outerTurretType) => ({
        PARENT:'elite', UPGRADE_LABEL:label, UPGRADE_TOOLTIP:tooltip, UPGRADE_COLOR:'pink',
        AI:{STRAFE:false}, GUNS:guns,
        TURRETS:[
            {POSITION:[9.5,0,0,0,360,1],TYPE:centralTurret},
            ...weaponArray([{POSITION:[5,8,-7,60,160,0],TYPE:[outerTurretType,{INDEPENDENT:false,GUN_STAT_SCALE:{health:1.1}}]},{POSITION:[5,8,7,60,160,0],TYPE:[outerTurretType,{INDEPENDENT:false,GUN_STAT_SCALE:{health:1.1}}]}],3),
        ],
    });
    const _trapGuns = (type) => weaponArray([{POSITION:[10.5,6,1,0,0,60,0]},{POSITION:[3,6,1.7,10.5,0,60,0],PROPERTIES:{SHOOT_SETTINGS:safeCS([g.trap,{speed:1.1,maxSpeed:1.1,reload:1.5,damage:1.6}]),TYPE:type,STAT_CALCULATOR:'trap'}}],3);
    Class.EAB_eliteTrapGuardBuilder   = _etgBase('Elite Trap Guard','(Builder)',   weaponArray([{POSITION:[12,6,1,0,0,60,0]},{POSITION:[1.5,6,1.2,12,0,60,0],PROPERTIES:{SHOOT_SETTINGS:safeCS([g.trap,g.setTrap,{speed:1.1,maxSpeed:1.1,reload:1.5,damage:1.6}]),TYPE:'unsetTrap',STAT_CALCULATOR:'trap'}}],3),'triTrapGuardTurret','autoTurret');
    Class.EAB_eliteTrapGuardMech      = _etgBase('Elite Trap Guard','(Mech)',      weaponArray([{POSITION:[11,6,1,0,0,60,0]},{POSITION:[3,6,1.7,11,0,60,0],PROPERTIES:{SHOOT_SETTINGS:safeCS([g.trap,{speed:1.1,maxSpeed:1.1,reload:1.5,damage:1.6}]),TYPE:'EAB_turretedTrap',STAT_CALCULATOR:'trap'}},{POSITION:[10,8,1,0,0,60,0]}],3),'triTrapGuardTurret','autoTurret');
    Class.EAB_eliteTrapGuardTwin      = _etgBase('Elite Trap Guard','(Twin)',      _trapGuns('trap'),'triTrapGuardTurret','auto4gun');
    Class.EAB_eliteTrapGuardMega      = _etgBase('Elite Trap Guard','(Mega)',      _trapGuns('trap'),'triTrapGuardTurret','megaAutoTankGun');
    Class.EAB_eliteTrapGuardPeashooter= _etgBase('Elite Trap Guard','(Peashooter)',_trapGuns('trap'),'EAB_triPeashooterTurret','autoTurret');

    // ── NEW: Elite Trap Guard Nexus — builder + hexa trapper ring ─────────
    Class.EAB_eliteTrapGuardNexus = {
        PARENT:'elite', UPGRADE_LABEL:'Elite Trap Guard', UPGRADE_TOOLTIP:'(Nexus)', UPGRADE_COLOR:'pink',
        AI:{STRAFE:false},
        GUNS: weaponArray([{POSITION:[10.5,6,1,0,0,60,0]},{POSITION:[3,6,1.7,10.5,0,60,0],PROPERTIES:{SHOOT_SETTINGS:safeCS([g.trap,g.hexaTrapper,{speed:1.1,reload:1.5,damage:1.8,health:1.4}]),TYPE:'trap',STAT_CALCULATOR:'trap'}}],3),
        TURRETS:[
            {POSITION:[9.5,0,0,0,360,1],TYPE:'EAB_triPeashooterTurret'},
            ...weaponArray([{POSITION:[6,8,-7,60,160,0],TYPE:['auto4gun',{INDEPENDENT:false,GUN_STAT_SCALE:{health:1.2}}]},{POSITION:[6,8,7,60,160,0],TYPE:['auto4gun',{INDEPENDENT:false,GUN_STAT_SCALE:{health:1.2}}]}],3),
            {POSITION:[12,0,0,0,360,1],TYPE:'EAB_baseBuilderTurret'},
        ],
    };

    // Elite Spinner ───────────────────────────────────────────────────────────
    const _spinGuns = (armLayers, extraArm=[]) => [
        ...weaponArray([
            ...armLayers,
            {POSITION:[2,20,0.75,8,0,60,0]},
        ],3),
        ...extraArm,
    ];
    Class.EAB_eliteSpinnerTornado  = {PARENT:'elite',UPGRADE_LABEL:'Elite Spinner',UPGRADE_TOOLTIP:'(Tornado)', UPGRADE_COLOR:'pink',AI:{STRAFE:false},FACING_TYPE:['spin',{speed:0.08}],GUNS:_spinGuns([{POSITION:[9.5,3.5,1,-1.5,10.7,10,2/3],PROPERTIES:{SHOOT_SETTINGS:safeCS([g.basic,g.twin,g.gunner,{speed:1.5,maxSpeed:1.25},g.pounder]),TYPE:'bullet'}},{POSITION:[9.5,3.5,1,3.5,5.95,10,1/3],PROPERTIES:{SHOOT_SETTINGS:safeCS([g.basic,g.twin,g.gunner,{speed:1.5,maxSpeed:1.25},g.pounder]),TYPE:'bullet'}},{POSITION:[9.5,3.5,1,8.5,1,10,0],PROPERTIES:{SHOOT_SETTINGS:safeCS([g.basic,g.twin,g.gunner,{speed:1.5,maxSpeed:1.25},g.pounder]),TYPE:'bullet'}}]),TURRETS:[{POSITION:[9.5,0,0,0,360,1],TYPE:['eliteSpinnerCyclone',{COLOR:-1}]}]};
    Class.EAB_eliteSpinnerTempest  = {PARENT:'elite',UPGRADE_LABEL:'Elite Spinner',UPGRADE_TOOLTIP:'(Tempest)', UPGRADE_COLOR:'pink',AI:{STRAFE:false},FACING_TYPE:['spin',{speed:0.08}],GUNS:_spinGuns([...[[-1.5,11.5,4/5],[1,9,3/5],[3.5,6.5,2/5],[6,4,1/5],[8.5,1.5,0]].map(([x,y,d])=>({POSITION:[9.5,2,1,x,y,10,d],PROPERTIES:{SHOOT_SETTINGS:safeCS([g.basic,g.twin,g.gunner,{speed:1.5,maxSpeed:1.25}]),TYPE:'bullet'}}))]),TURRETS:[{POSITION:[9.5,0,0,0,360,1],TYPE:['eliteSpinnerCyclone',{COLOR:-1}]}]};
    Class.EAB_eliteSpinnerGale     = {PARENT:'elite',UPGRADE_LABEL:'Elite Spinner',UPGRADE_TOOLTIP:'(Gale)',    UPGRADE_COLOR:'pink',AI:{STRAFE:false},FACING_TYPE:['spin',{speed:0.08}],GUNS:_spinGuns([{POSITION:[9.5,2,1,-1.5,11.5,10,2/3],PROPERTIES:{SHOOT_SETTINGS:safeCS([g.basic,g.twin,g.gunner,{speed:1.5,maxSpeed:1.25}]),TYPE:'bullet'}},{POSITION:[9.5,2,1,3.5,6.5,10,1/3],PROPERTIES:{SHOOT_SETTINGS:safeCS([g.basic,g.twin,g.gunner,{speed:1.5,maxSpeed:1.25}]),TYPE:'bullet'}},{POSITION:[9.5,2,1,8.5,1.5,10,0],PROPERTIES:{SHOOT_SETTINGS:safeCS([g.basic,g.twin,g.gunner,{speed:1.5,maxSpeed:1.25}]),TYPE:'bullet'}}]),TURRETS:[{POSITION:[9.5,0,0,0,360,1],TYPE:['EAB_eliteSpinnerGaleTurret',{COLOR:-1}]}]};
    Class.EAB_eliteSpinnerTrove    = {PARENT:'elite',UPGRADE_LABEL:'Elite Spinner',UPGRADE_TOOLTIP:'(Trove)',   UPGRADE_COLOR:'pink',AI:{STRAFE:false},FACING_TYPE:['spin',{speed:0.08}],GUNS:_spinGuns([{POSITION:[9.5,2,1,-1.5,11.5,10,2/3],PROPERTIES:{SHOOT_SETTINGS:safeCS([g.basic,g.twin,g.gunner,{speed:1.5,maxSpeed:1.25}]),TYPE:'bullet'}},{POSITION:[9.5,2,1,3.5,6.5,10,1/3],PROPERTIES:{SHOOT_SETTINGS:safeCS([g.basic,g.twin,g.gunner,{speed:1.5,maxSpeed:1.25}]),TYPE:'bullet'}},{POSITION:[9.5,2,1,8.5,1.5,10,0],PROPERTIES:{SHOOT_SETTINGS:safeCS([g.basic,g.twin,g.gunner,{speed:1.5,maxSpeed:1.25}]),TYPE:'bullet'}}]),TURRETS:[{POSITION:[9.5,0,0,0,360,1],TYPE:['EAB_eliteSpinnerTroveTurret',{COLOR:-1}]}]};

    // ── NEW: Elite Spinner Hurricane — combines Gale + Trove ───────────────
    Class.EAB_eliteSpinnerHurricane = {
        PARENT:'elite', UPGRADE_LABEL:'Elite Spinner', UPGRADE_TOOLTIP:'(Hurricane)', UPGRADE_COLOR:'pink',
        AI:{STRAFE:false}, FACING_TYPE:['spin',{speed:0.10}],
        GUNS:_spinGuns([
            {POSITION:[9.5,2,1,-1.5,11.5,10,2/3],PROPERTIES:{SHOOT_SETTINGS:safeCS([g.basic,g.twin,g.gunner,{speed:1.7,maxSpeed:1.4}]),TYPE:'bullet'}},
            {POSITION:[9.5,2,1,3.5,6.5,10,1/3],  PROPERTIES:{SHOOT_SETTINGS:safeCS([g.basic,g.twin,g.gunner,{speed:1.7,maxSpeed:1.4}]),TYPE:'bullet'}},
            {POSITION:[9.5,2,1,8.5,1.5,10,0],    PROPERTIES:{SHOOT_SETTINGS:safeCS([g.basic,g.twin,g.gunner,{speed:1.7,maxSpeed:1.4}]),TYPE:'bullet'}},
        ]),
        TURRETS:[{POSITION:[9.5,0,0,0,360,1],TYPE:['EAB_eliteSpinnerGaleTurret',{COLOR:-1}]},{POSITION:[7,0,0,0,360,1],TYPE:['EAB_eliteSpinnerTroveTurret',{COLOR:-1}]}],
    };

    // Elite Skimmer ───────────────────────────────────────────────────────────
    Class.EAB_eliteSkimmerHyperSkimmer = {PARENT:'elite',LABEL:'Elite Skimmer',UPGRADE_TOOLTIP:'(Hyper Skimmer)',COLOR:'triangle',UPGRADE_COLOR:'triangle',TURRETS:weaponArray({TYPE:'EAB_ultraSkimmerTurret',POSITION:[15,5,0,60,170,0]},3)};
    Class.EAB_eliteSkimmerBazooka      = {PARENT:'elite',LABEL:'Elite Skimmer',UPGRADE_TOOLTIP:'(Bazooka)',      COLOR:'triangle',UPGRADE_COLOR:'triangle',TURRETS:weaponArray({TYPE:'EAB_bazookaTurret',   POSITION:[15,5,0,60,170,0]},3)};
    Class.EAB_eliteSkimmerSkidder      = {PARENT:'elite',LABEL:'Elite Skimmer',UPGRADE_TOOLTIP:'(Skidder)',      COLOR:'triangle',UPGRADE_COLOR:'triangle',TURRETS:weaponArray({TYPE:'EAB_skidderTurret',  POSITION:[15,5,0,60,170,0]},3)};
    Class.EAB_eliteSkimmerTicker       = {PARENT:'elite',LABEL:'Elite Skimmer',UPGRADE_TOOLTIP:'(Ticker)',       COLOR:'triangle',UPGRADE_COLOR:'triangle',TURRETS:weaponArray({TYPE:'EAB_tickerTurret',   POSITION:[15,5,0,60,170,0]},3)};
    // ── NEW: Elite Skimmer Barrage — rapid-fire mini-missiles from all 3 arms ─
    Class.EAB_barrageMissileTurret = makeTurret({GUNS:[
        {POSITION:[10,11,-0.5,8,0,0,0]},
        {POSITION:[16,12,1,0,0,0,0],PROPERTIES:{SHOOT_SETTINGS:safeCS([g.basic,g.pounder,g.artillery,g.artillery,g.skimmer,{reload:1.5,damage:1.4}]),TYPE:'minimissile',STAT_CALCULATOR:'sustained'}},
        {POSITION:[16,12,1,0,0,0,0.2],PROPERTIES:{SHOOT_SETTINGS:safeCS([g.basic,g.pounder,g.artillery,g.artillery,g.skimmer,{reload:1.5,damage:1.4}]),TYPE:'minimissile',STAT_CALCULATOR:'sustained'}},
        {POSITION:[16,12,1,0,0,0,0.4],PROPERTIES:{SHOOT_SETTINGS:safeCS([g.basic,g.pounder,g.artillery,g.artillery,g.skimmer,{reload:1.5,damage:1.4}]),TYPE:'minimissile',STAT_CALCULATOR:'sustained'}},
    ]},{canRepel:true,limitFov:true,extraStats:[],color:'mirror'});
    Class.EAB_eliteSkimmerBarrage = {PARENT:'elite',LABEL:'Elite Skimmer',UPGRADE_TOOLTIP:'(Barrage)',COLOR:'triangle',UPGRADE_COLOR:'triangle',TURRETS:weaponArray({TYPE:'EAB_barrageMissileTurret',POSITION:[15,5,0,60,170,0]},3)};

// ══════════════════════════════════════════════════════════════════════════════
// ── MYSTICALS ────────────────────────────────────────────────────────────────
// ══════════════════════════════════════════════════════════════════════════════

    const mystGp  = (p) => [p.LENGTH, p.WIDTH, p.ASPECT, p.X, 0, 0, 0];
    const _mystBase = (name, label, danger, shape, color, size, maxChild, hp, spd, dmg) => ({
        PARENT:'miniboss', LABEL:label, DANGER:danger, SHAPE:shape, COLOR:color, UPGRADE_COLOR:color,
        SIZE:size, MAX_CHILDREN:maxChild, VALUE:danger*1e5,
        BODY:{ FOV:0.5, SPEED:spd*base.SPEED, HEALTH:hp*base.HEALTH, DAMAGE:dmg*base.DAMAGE },
    });
    const _mystVariant = (base_, label, tip, maxChild, gunProps, turrets=[]) => Object.assign({},base_,{LABEL:label,UPGRADE_TOOLTIP:tip,MAX_CHILDREN:maxChild,GUNS:weaponArray({POSITION:mystGp(mystical_gp),PROPERTIES:gunProps},gunProps._count||2),TURRETS:turrets});

    Class.EAB_sorcererBase    = _mystBase('EAB_sorcererBase',   'Sorcerer',   7,0,'egg',     26,50,6,0.12,2);
    Class.EAB_summonerBase    = _mystBase('EAB_summonerBase',   'Summoner',   8,4,'square',  26,28,7,0.10,2.6);
    Class.EAB_enchantressBase = _mystBase('EAB_enchantressBase','Enchantress',8,3.5,'triangle',26,28,10,0.09,3);
    Class.EAB_exorcistorBase  = _mystBase('EAB_exorcistorBase', 'Exorcistor', 8,5.5,'pentagon',26,20,15,0.08,4);
    Class.EAB_shamanBase      = _mystBase('EAB_shamanBase',     'Shaman',     8,6,'hexagon', 26,20,20,0.07,5);

    // Sorcerer variants ────────────────────────────────────────────────────────
    Class.EAB_sorcererdrive = Object.assign({},Class.EAB_sorcererBase,{LABEL:'Sorcererdrive',UPGRADE_TOOLTIP:'(Drive)',BODY:{FOV:0.75},GUNS:weaponArray({POSITION:mystGp(mystical_gp),PROPERTIES:{SHOOT_SETTINGS:safeCS([g.drone,g.summoner,g.machineGun,{damage:1.8,size:0.4,spray:150,speed:2,shudder:1.75}]),TYPE:'EAB_turretedEggchip',AUTOFIRE:true,SYNCS_SKILLS:true,STAT_CALCULATOR:'drone',WAIT_TO_CYCLE:true}},2),TURRETS:[{POSITION:[9,0,0,0,360,1],TYPE:['genericTank',{INDEPENDENT:true,MIRROR_MASTER_ANGLE:true,COLOR:'grey'}]}]});
    Class.EAB_sorcererHoncho = Object.assign({},Class.EAB_sorcererBase,{LABEL:'Sorcerer',UPGRADE_TOOLTIP:'(Honcho)',MAX_CHILDREN:30,GUNS:weaponArray({POSITION:mystGp(mystical_gph),PROPERTIES:{SHOOT_SETTINGS:safeCS([g.drone,g.pounder,g.summoner,g.machineGun,{damage:1.8,size:0.4,spray:150,speed:2,shudder:1.75}]),TYPE:'sorcererDrone',AUTOFIRE:true,SYNCS_SKILLS:true,STAT_CALCULATOR:'drone',WAIT_TO_CYCLE:true}},2)});
    Class.EAB_sorcererDoper  = Object.assign({},Class.EAB_sorcererBase,{LABEL:'Sorcerer',UPGRADE_TOOLTIP:'(Doper)',MAX_CHILDREN:45,GUNS:[...weaponArray({POSITION:mystGp(mystical_gp),PROPERTIES:{SHOOT_SETTINGS:safeCS([g.drone,g.summoner,g.machineGun,{damage:1.8,size:0.4,spray:150,speed:2,shudder:1.75},doper]),TYPE:'sorcererDrone',AUTOFIRE:true,SYNCS_SKILLS:true,STAT_CALCULATOR:'drone',WAIT_TO_CYCLE:true}},2),...weaponArray({POSITION:mystGp(mystical_gpd)},2)]});
    Class.EAB_summonerdrive  = Object.assign({},Class.EAB_summonerBase,{LABEL:'Summonerdrive',UPGRADE_TOOLTIP:'(Drive)',BODY:{FOV:0.75},GUNS:weaponArray({POSITION:mystGp(mystical_gp),PROPERTIES:{SHOOT_SETTINGS:safeCS([g.drone,g.summoner,{size:0.8}]),TYPE:'EAB_turretedSunchip',AUTOFIRE:true,SYNCS_SKILLS:true,STAT_CALCULATOR:'drone',WAIT_TO_CYCLE:true}},4),TURRETS:[{POSITION:[9,0,0,0,360,1],TYPE:['square',{INDEPENDENT:true,MIRROR_MASTER_ANGLE:true,COLOR:'grey'}]}]});
    Class.EAB_summonerHoncho = Object.assign({},Class.EAB_summonerBase,{LABEL:'Summoner',UPGRADE_TOOLTIP:'(Honcho)',MAX_CHILDREN:17,GUNS:weaponArray({POSITION:mystGp(mystical_gph),PROPERTIES:{SHOOT_SETTINGS:safeCS([g.drone,g.pounder,g.summoner,{size:0.8}]),TYPE:'summonerDrone',AUTOFIRE:true,SYNCS_SKILLS:true,STAT_CALCULATOR:'drone',WAIT_TO_CYCLE:true}},4)});
    Class.EAB_summonerDoper  = Object.assign({},Class.EAB_summonerBase,{LABEL:'Summoner',UPGRADE_TOOLTIP:'(Doper)',MAX_CHILDREN:25,GUNS:[...weaponArray({POSITION:mystGp(mystical_gp),PROPERTIES:{SHOOT_SETTINGS:safeCS([g.drone,g.summoner,{size:0.8},doper]),TYPE:'summonerDrone',AUTOFIRE:true,SYNCS_SKILLS:true,STAT_CALCULATOR:'drone',WAIT_TO_CYCLE:true}},4),...weaponArray({POSITION:mystGp(mystical_gpd)},4)]});
    Class.EAB_enchantressdrive= Object.assign({},Class.EAB_enchantressBase,{LABEL:'Enchantressdrive',UPGRADE_TOOLTIP:'(Drive)',BODY:{FOV:0.75},GUNS:weaponArray({POSITION:mystGp(mystical_gp),PROPERTIES:{SHOOT_SETTINGS:safeCS([g.drone,g.summoner,{size:0.9,damage:1.1}]),TYPE:'EAB_turretedDorito',AUTOFIRE:true,SYNCS_SKILLS:true,STAT_CALCULATOR:'drone',WAIT_TO_CYCLE:true}},3),TURRETS:[{POSITION:[9,0,0,180,360,1],TYPE:['triangle',{INDEPENDENT:true,MIRROR_MASTER_ANGLE:true,COLOR:'grey'}]}]});
    Class.EAB_enchantressHoncho=Object.assign({},Class.EAB_enchantressBase,{LABEL:'Enchantress',UPGRADE_TOOLTIP:'(Honcho)',MAX_CHILDREN:17,GUNS:weaponArray({POSITION:mystGp(mystical_gph),PROPERTIES:{SHOOT_SETTINGS:safeCS([g.drone,g.pounder,g.summoner,{size:0.9,damage:1.1}]),TYPE:'enchantressDrone',AUTOFIRE:true,SYNCS_SKILLS:true,STAT_CALCULATOR:'drone',WAIT_TO_CYCLE:true}},3)});
    Class.EAB_enchantressDoper = Object.assign({},Class.EAB_enchantressBase,{LABEL:'Enchantress',UPGRADE_TOOLTIP:'(Doper)',MAX_CHILDREN:25,GUNS:[...weaponArray({POSITION:mystGp(mystical_gp),PROPERTIES:{SHOOT_SETTINGS:safeCS([g.drone,g.summoner,{size:0.9,damage:1.1},doper]),TYPE:'enchantressDrone',AUTOFIRE:true,SYNCS_SKILLS:true,STAT_CALCULATOR:'drone',WAIT_TO_CYCLE:true}},3),...weaponArray({POSITION:mystGp(mystical_gpd)},3)]});
    Class.EAB_exorcistordrive = Object.assign({},Class.EAB_exorcistorBase,{LABEL:'Exorcistordrive',UPGRADE_TOOLTIP:'(Drive)',BODY:{FOV:0.75},GUNS:weaponArray({POSITION:mystGp(mystical_gp),PROPERTIES:{SHOOT_SETTINGS:safeCS([g.drone,g.summoner,g.destroyer,{maxSpeed:1.2,reload:5,size:1.15,damage:4}]),TYPE:'EAB_turretedDemonchip',AUTOFIRE:true,SYNCS_SKILLS:true,STAT_CALCULATOR:'drone',WAIT_TO_CYCLE:true}},5),TURRETS:[{POSITION:[9,0,0,180,360,1],TYPE:['pentagon',{INDEPENDENT:true,MIRROR_MASTER_ANGLE:true,COLOR:'grey'}]}]});
    Class.EAB_exorcistorHoncho= Object.assign({},Class.EAB_exorcistorBase,{LABEL:'Exorcistor',UPGRADE_TOOLTIP:'(Honcho)',MAX_CHILDREN:12,GUNS:weaponArray({POSITION:mystGp(mystical_gph),PROPERTIES:{SHOOT_SETTINGS:safeCS([g.drone,g.pounder,g.summoner,g.destroyer,{maxSpeed:1.2,reload:5,size:1.15,damage:4}]),TYPE:'exorcistorDrone',AUTOFIRE:true,SYNCS_SKILLS:true,STAT_CALCULATOR:'drone',WAIT_TO_CYCLE:true}},5)});
    Class.EAB_exorcistorDoper = Object.assign({},Class.EAB_exorcistorBase,{LABEL:'Exorcistor',UPGRADE_TOOLTIP:'(Doper)',MAX_CHILDREN:18,GUNS:[...weaponArray({POSITION:mystGp(mystical_gp),PROPERTIES:{SHOOT_SETTINGS:safeCS([g.drone,g.summoner,g.destroyer,{maxSpeed:1.2,reload:5,size:1.15,damage:4},doper]),TYPE:'exorcistorDrone',AUTOFIRE:true,SYNCS_SKILLS:true,STAT_CALCULATOR:'drone',WAIT_TO_CYCLE:true}},5),...weaponArray({POSITION:mystGp(mystical_gpd)},5)]});
    Class.EAB_shamandrive     = Object.assign({},Class.EAB_shamanBase,{LABEL:'Shamandrive',UPGRADE_TOOLTIP:'(Drive)',BODY:{FOV:0.75},GUNS:weaponArray({POSITION:mystGp(mystical_gp),PROPERTIES:{SHOOT_SETTINGS:safeCS([g.drone,g.summoner,g.destroyer,{size:1.25,maxSpeed:1.2,reload:3,damage:4}]),TYPE:'EAB_turretedRealchip',AUTOFIRE:true,SYNCS_SKILLS:true,STAT_CALCULATOR:'drone',WAIT_TO_CYCLE:true}},6),TURRETS:[{POSITION:[9,0,0,0,360,1],TYPE:['hexagon',{INDEPENDENT:true,MIRROR_MASTER_ANGLE:true,COLOR:'grey'}]}]});
    Class.EAB_shamanHoncho    = Object.assign({},Class.EAB_shamanBase,{LABEL:'Shaman',UPGRADE_TOOLTIP:'(Honcho)',MAX_CHILDREN:12,GUNS:weaponArray({POSITION:mystGp(mystical_gph),PROPERTIES:{SHOOT_SETTINGS:safeCS([g.drone,g.pounder,g.summoner,g.destroyer,{size:1.25,maxSpeed:1.2,reload:3,damage:4}]),TYPE:'shamanDrone',AUTOFIRE:true,SYNCS_SKILLS:true,STAT_CALCULATOR:'drone',WAIT_TO_CYCLE:true}},6)});
    Class.EAB_shamanDoper     = Object.assign({},Class.EAB_shamanBase,{LABEL:'Shaman',UPGRADE_TOOLTIP:'(Doper)',MAX_CHILDREN:18,GUNS:[...weaponArray({POSITION:mystGp(mystical_gp),PROPERTIES:{SHOOT_SETTINGS:safeCS([g.drone,g.summoner,g.destroyer,{size:1.25,maxSpeed:1.2,reload:3,damage:4},doper]),TYPE:'shamanDrone',AUTOFIRE:true,SYNCS_SKILLS:true,STAT_CALCULATOR:'drone',WAIT_TO_CYCLE:true}},6),...weaponArray({POSITION:mystGp(mystical_gpd)},6)]});

// ══════════════════════════════════════════════════════════════════════════════
// ── NESTERS ──────────────────────────────────────────────────────────────────
// ══════════════════════════════════════════════════════════════════════════════

    const _nkGuns = (type, stats, maxChild) => ({MAX_CHILDREN:maxChild,GUNS:weaponArray({POSITION:[3.5,6.65,1.2,8,0,36,0],PROPERTIES:{SHOOT_SETTINGS:safeCS(stats),TYPE:type,AUTOFIRE:true,LABEL:'Mega Crasher',STAT_CALCULATOR:'drone'}},5)});
    const _nkTurrets = (centerTurret) => ({TURRETS:[...weaponArray({POSITION:[8,9,0,0,120,0],TYPE:['auto4gun',{INDEPENDENT:true,COLOR:'purple'}]},5),{POSITION:[9,0,0,0,360,1],TYPE:[centerTurret,{INDEPENDENT:true,COLOR:-1}]}]});
    Class.EAB_nestKeeperDrive      = Object.assign({PARENT:'nester',LABEL:'Nest Keeper',UPGRADE_TOOLTIP:'(Drive)'},   _nkGuns('turretedDrone',[g.drone,g.nestKeeper],15),{...(_nkTurrets('boomerTurret')),GUNS:[...weaponArray({POSITION:[3.5,6.65,1.2,8,0,36,0],PROPERTIES:{SHOOT_SETTINGS:safeCS([g.drone,g.nestKeeper]),TYPE:'turretedDrone',AUTOFIRE:true,LABEL:'Mega Crasher',STAT_CALCULATOR:'drone'}},5),...weaponArray({POSITION:[3.75,3.5,,8,0,36,0]},5)]});
    Class.EAB_nestKeeperHoncho     = Object.assign({PARENT:'nester',LABEL:'Nest Keeper',UPGRADE_TOOLTIP:'(Honcho)'},  {MAX_CHILDREN:10,GUNS:weaponArray({POSITION:[3.5,8.5,1.1,8,0,36,0],PROPERTIES:{SHOOT_SETTINGS:safeCS([g.drone,g.nestKeeper,g.pounder]),TYPE:'drone',AUTOFIRE:true,LABEL:'Ultra Crasher',STAT_CALCULATOR:'drone'}},5),...(_nkTurrets('boomerTurret'))});
    Class.EAB_nestKeeperDoper      = Object.assign({PARENT:'nester',LABEL:'Nest Keeper',UPGRADE_TOOLTIP:'(Doper)'},   {MAX_CHILDREN:10,GUNS:[...weaponArray({POSITION:[3.5,6.65,1.2,8,0,36,0],PROPERTIES:{SHOOT_SETTINGS:safeCS([g.drone,g.nestKeeper,doper]),TYPE:'drone',AUTOFIRE:true,LABEL:'Mega Crasher',STAT_CALCULATOR:'drone'}},5),...weaponArray({POSITION:[5,0.5,-5,7,0,36,0]},5)],...(_nkTurrets('boomerTurret'))});
    Class.EAB_nestKeeperTriplet    = Object.assign({PARENT:'nester',LABEL:'Nest Keeper',UPGRADE_TOOLTIP:'(Triplet)'},  _nkGuns('drone',[g.drone,g.nestKeeper],15),{TURRETS:[...weaponArray({POSITION:[8,9,0,0,120,0],TYPE:['bigauto4gun',{INDEPENDENT:true,COLOR:'purple'}]},5),{POSITION:[9,0,0,0,360,1],TYPE:['boomerTurret',{INDEPENDENT:true,COLOR:-1}]}]});
    Class.EAB_nestKeeperRecoiler   = Object.assign({PARENT:'nester',LABEL:'Nest Keeper',UPGRADE_TOOLTIP:'(Recoiler)'},  _nkGuns('drone',[g.drone,g.nestKeeper],15),{...(_nkTurrets('EAB_recoilerTurret')),TURRETS:[...weaponArray({POSITION:[8,9,0,0,120,0],TYPE:['auto4gun',{INDEPENDENT:true,COLOR:'purple'}]},5),{POSITION:[10,0,0,0,360,1],TYPE:['EAB_recoilerTurret',{INDEPENDENT:true,COLOR:-1}]}]});
    Class.EAB_nestKeeperBentBoomer = Object.assign({PARENT:'nester',LABEL:'Nest Keeper',UPGRADE_TOOLTIP:'(Bent Boomer)'},_nkGuns('drone',[g.drone,g.nestKeeper],15),{..._nkTurrets('EAB_bentBoomerTurret')});
    Class.EAB_nestKeeperParryer    = Object.assign({PARENT:'nester',LABEL:'Nest Keeper',UPGRADE_TOOLTIP:'(Parryer)'},   _nkGuns('drone',[g.drone,g.nestKeeper],15),{..._nkTurrets('EAB_parryerTurret')});

    const _nwGuns  = (stats,type)=>weaponArray([{POSITION:[10.7,8,1,0,0,36,0]},{POSITION:[1.5,8,1.2,10.7,0,36,0],PROPERTIES:{SHOOT_SETTINGS:safeCS(stats),TYPE:type,STAT_CALCULATOR:'block'}}],5);
    const _nwBase  = (tip,guns,centerT,outerT) => ({PARENT:'nester',LABEL:'Nest Warden',UPGRADE_TOOLTIP:tip,GUNS:guns,TURRETS:[{POSITION:[9,0,0,0,360,1],TYPE:[centerT,{INDEPENDENT:true,COLOR:-1}]},...weaponArray({POSITION:[8,9,0,0,120,0],TYPE:[outerT,{INDEPENDENT:true,COLOR:-1}]},5)]});
    Class.EAB_nestWardenCarrier    = _nwBase('(Carrier)',    _nwGuns([g.trap,{speed:1.2},g.setTrap,g.constructor],'unsetTrap'), 'barricadeTurret','carrierTurret');
    Class.EAB_nestWardenHoncho     = _nwBase('(Honcho)',     _nwGuns([g.trap,{speed:1.2},g.setTrap,g.constructor],'unsetTrap'), 'barricadeTurret','EAB_baltimoreTurret');
    Class.EAB_nestWardenDoper      = _nwBase('(Doper)',      _nwGuns([g.trap,{speed:1.2},g.setTrap,g.constructor],'unsetTrap'), 'barricadeTurret','EAB_moseyTurret');
    Class.EAB_nestWardenConstructor= _nwBase('(Constructor)',weaponArray([{POSITION:[10.7,10,1,0,0,36,0]},{POSITION:[1.5,10,1.1,10.7,0,36,0],PROPERTIES:{SHOOT_SETTINGS:safeCS([g.trap,g.pounder,{speed:1.2},g.setTrap,g.constructor]),TYPE:'unsetTrap',STAT_CALCULATOR:'block'}}],5),'barricadeTurret','cruiserTurret');
    Class.EAB_nestWardenEngineer   = _nwBase('(Engineer)',   weaponArray([{POSITION:[10.75,7,1,0,0,36,0]},{POSITION:[10,8,1,0,0,36,0]},{POSITION:[0.75,8,1,10.75,0,36,0]},{POSITION:[0.75,8,1.2,11.5,0,36,0],PROPERTIES:{SHOOT_SETTINGS:safeCS([g.trap,{speed:1.2},g.setTrap,g.constructor]),TYPE:'unsetPillbox',STAT_CALCULATOR:'block'}}],5),'barricadeTurret','cruiserTurret');
    Class.EAB_nestWardenBlockade   = _nwBase('(Blockade)',   _nwGuns([g.trap,{speed:1.2},g.setTrap,g.constructor],'unsetTrap'), 'EAB_blockadeTurret','cruiserTurret');
    Class.EAB_nestWardenBarrier    = _nwBase('(Barrier)',    _nwGuns([g.trap,{speed:1.2},g.setTrap,g.constructor],'unsetTrap'), 'EAB_barrierTurret','cruiserTurret');
    Class.EAB_nestWardenPropper    = _nwBase('(Propper)',    _nwGuns([g.trap,{speed:1.2},g.setTrap,g.constructor],'unsetTrap'), 'EAB_propperTurret','cruiserTurret');

    const _ngGuns  = (guns) => ({GUNS:guns,TURRETS:[{POSITION:[9,0,0,0,360,1],TYPE:['twisterTurret',{INDEPENDENT:true,COLOR:-1}]},...weaponArray({POSITION:[8,9,0,0,120,0],TYPE:['swarmerTurret',{INDEPENDENT:true,COLOR:-1}]},5)]});
    const _devGuns = weaponArray({POSITION:[5.5,7,1,6,0,36,0],PROPERTIES:{SHOOT_SETTINGS:safeCS([g.basic,g.pounder,g.pounder,g.destroyer]),TYPE:'bullet',LABEL:'Devastator'}},5);
    Class.EAB_nestGuardianBigMac      = {PARENT:'nester',LABEL:'Nest Guardian',UPGRADE_TOOLTIP:'(Big Mac)',   ..._ngGuns([...weaponArray({POSITION:[4,7,1.5,6,0,36,0]},5),...weaponArray({POSITION:[2.5,10.5,1,10,0,36,0],PROPERTIES:{SHOOT_SETTINGS:safeCS([g.basic,g.pounder,g.pounder,g.destroyer,g.destroyer]),TYPE:'bullet',LABEL:'Obliterator'}},5)])};
    Class.EAB_nestGuardianStomper     = {PARENT:'nester',LABEL:'Nest Guardian',UPGRADE_TOOLTIP:'(Stomper)',   ..._ngGuns([...weaponArray({POSITION:[6,2,1,5.5,2.5,40,0],PROPERTIES:{SHOOT_SETTINGS:safeCS([g.basic,g.pelleter,g.artillery]),TYPE:'bullet',LABEL:'Secondary'}},5),...weaponArray({POSITION:[6,2,1,5.5,-2.5,-40,0.5],PROPERTIES:{SHOOT_SETTINGS:safeCS([g.basic,g.pelleter,g.artillery]),TYPE:'bullet',LABEL:'Secondary'}},5),...weaponArray({POSITION:[5.5,7,1,6,0,36,0],PROPERTIES:{SHOOT_SETTINGS:safeCS([g.basic,g.pounder,g.pounder,g.destroyer]),TYPE:'bullet',LABEL:'Devastator'}},5)])};
    Class.EAB_nestGuardianLauncher    = {PARENT:'nester',LABEL:'Nest Guardian',UPGRADE_TOOLTIP:'(Launcher)',  ..._ngGuns([...weaponArray({POSITION:[6.25,5,1,6,0,36,0]},5),...weaponArray({POSITION:[5.5,7,1,6,0,36,0],PROPERTIES:{SHOOT_SETTINGS:safeCS([g.basic,g.pounder,g.pounder,g.destroyer,g.launcher]),TYPE:'minimissile',LABEL:'Diluter'}},5)])};
    Class.EAB_nestGuardianMyriad      = {PARENT:'nester',LABEL:'Nest Guardian',UPGRADE_TOOLTIP:'(Myriad)',    GUNS:_devGuns,TURRETS:[{POSITION:[9,0,0,0,360,1],TYPE:['twisterTurret',{INDEPENDENT:true,COLOR:-1}]},...weaponArray({POSITION:[8,9,0,0,120,0],TYPE:['EAB_myriadTurret',{INDEPENDENT:true,COLOR:-1}]},5)]};
    Class.EAB_nestGuardianMolotov     = {PARENT:'nester',LABEL:'Nest Guardian',UPGRADE_TOOLTIP:'(Molotov)',   GUNS:_devGuns,TURRETS:[{POSITION:[9,0,0,0,360,1],TYPE:['twisterTurret',{INDEPENDENT:true,COLOR:-1}]},...weaponArray({POSITION:[8,9,0,0,120,0],TYPE:['EAB_molotovTurret',{INDEPENDENT:true,COLOR:-1}]},5)]};
    Class.EAB_nestGuardianCatapult    = {PARENT:'nester',LABEL:'Nest Guardian',UPGRADE_TOOLTIP:'(Catapult)',  GUNS:_devGuns,TURRETS:[{POSITION:[9,0,0,0,360,1],TYPE:['EAB_catapultTurret',{INDEPENDENT:true,COLOR:-1}]},...weaponArray({POSITION:[8,9,0,0,120,0],TYPE:['swarmerTurret',{INDEPENDENT:true,COLOR:-1}]},5)]};
    Class.EAB_nestGuardianHyperTwister= {PARENT:'nester',LABEL:'Nest Guardian',UPGRADE_TOOLTIP:'(Hyper Twister)',GUNS:_devGuns,TURRETS:[{POSITION:[9,0,0,0,360,1],TYPE:['EAB_hyperTwisterTurret',{INDEPENDENT:true,COLOR:-1}]},...weaponArray({POSITION:[8,9,0,0,120,0],TYPE:['swarmerTurret',{INDEPENDENT:true,COLOR:-1}]},5)]};

// ══════════════════════════════════════════════════════════════════════════════
// ── ROGUES ───────────────────────────────────────────────────────────────────
// ══════════════════════════════════════════════════════════════════════════════

    const _rpBase = {PARENT:'miniboss',LABEL:'Rogue Palisade',COLOR:'darkGrey',UPGRADE_COLOR:'darkGrey',SHAPE:6,SIZE:30,VALUE:5e5,SKILL_CAP:[2,6,6,6,2,0,0,9,0,0],CONTROLLERS:['nearestDifferentMaster','onlyAcceptInArc'],BODY:{FOV:1.4,SPEED:0.05*base.SPEED,HEALTH:16*base.HEALTH,SHIELD:3*base.SHIELD,DAMAGE:3*base.DAMAGE}};
    Class.EAB_roguePalisadeMegaSpawner = Object.assign({},_rpBase,{UPGRADE_TOOLTIP:'(Mega Spawner)',GUNS:weaponArray({POSITION:[4,6,-2,8,0,0,0],PROPERTIES:{SHOOT_SETTINGS:safeCS([g.minion,g.pounder,{reload:2,damage:0.7,density:0.6}]),TYPE:['megaMinion',{INDEPENDENT:true}],STAT_CALCULATOR:'drone',AUTOFIRE:true,MAX_CHILDREN:3,SYNCS_SKILLS:true,WAIT_TO_CYCLE:true}},6),TURRETS:weaponArray({POSITION:[5,10,0,30,110,0],TYPE:['baseTrapTurret',{GUN_STAT_SCALE:{health:0.7,damage:0.8}}]},6)});
    Class.EAB_roguePalisadeHoncho      = Object.assign({},_rpBase,{UPGRADE_TOOLTIP:'(Honcho)',     GUNS:weaponArray({POSITION:[4,7.75,-1.4,8,0,0,0],PROPERTIES:{SHOOT_SETTINGS:safeCS([g.minion,g.pounder,g.destroyer,{reload:2,damage:0.7,density:0.6}]),TYPE:['minion',{INDEPENDENT:true}],STAT_CALCULATOR:'drone',AUTOFIRE:true,MAX_CHILDREN:2,SYNCS_SKILLS:true,WAIT_TO_CYCLE:true}},6),TURRETS:weaponArray({POSITION:[5,10,0,30,110,0],TYPE:['baseTrapTurret',{GUN_STAT_SCALE:{health:0.7,damage:0.8}}]},6)});
    Class.EAB_roguePalisadeDoper       = Object.assign({},_rpBase,{UPGRADE_TOOLTIP:'(Doper)',      GUNS:[...weaponArray({POSITION:[4,6,-1.6,8,0,0,0],PROPERTIES:{SHOOT_SETTINGS:safeCS([g.minion,g.pounder,{reload:2,damage:0.7,density:0.6},doper]),TYPE:['minion',{INDEPENDENT:true}],STAT_CALCULATOR:'drone',AUTOFIRE:true,MAX_CHILDREN:3,SYNCS_SKILLS:true,WAIT_TO_CYCLE:true}},6),...weaponArray({POSITION:[4.75,0.3,-5,8,0,0,0]},6)],TURRETS:weaponArray({POSITION:[5,10,0,30,110,0],TYPE:['baseTrapTurret',{GUN_STAT_SCALE:{health:0.7,damage:0.8}}]},6)});
    Class.EAB_roguePalisadeBuilder     = Object.assign({},_rpBase,{UPGRADE_TOOLTIP:'(Builder)',    GUNS:weaponArray({POSITION:[4,6,-1.6,8,0,0,0],PROPERTIES:{SHOOT_SETTINGS:safeCS([g.minion,g.pounder,{reload:2,damage:0.7,density:0.6}]),TYPE:['minion',{INDEPENDENT:true}],STAT_CALCULATOR:'drone',AUTOFIRE:true,MAX_CHILDREN:3,SYNCS_SKILLS:true,WAIT_TO_CYCLE:true}},6),TURRETS:weaponArray({POSITION:[5,10,0,30,110,0],TYPE:['EAB_baseBuilderTurret',{GUN_STAT_SCALE:{health:0.7,damage:0.8}}]},6)});
    Class.EAB_roguePalisadeMech        = Object.assign({},_rpBase,{UPGRADE_TOOLTIP:'(Mech)',       GUNS:weaponArray({POSITION:[4,6,-1.6,8,0,0,0],PROPERTIES:{SHOOT_SETTINGS:safeCS([g.minion,g.pounder,{reload:2,damage:0.7,density:0.6}]),TYPE:['minion',{INDEPENDENT:true}],STAT_CALCULATOR:'drone',AUTOFIRE:true,MAX_CHILDREN:3,SYNCS_SKILLS:true,WAIT_TO_CYCLE:true}},6),TURRETS:weaponArray({POSITION:[5,10,0,30,110,0],TYPE:['EAB_baseMechTurret',{GUN_STAT_SCALE:{health:0.7,damage:0.8}}]},6)});

    // ── NEW: Rogue Fortress — hexagonal ultra-defensive rogue ──────────────
    Class.EAB_rogueFortressWall = makeTurret({GUNS:[
        {POSITION:[22,10,1,0,0,0,0]},{POSITION:[18,10,-1.3,0,0,0,0]},
        {POSITION:[3,10,1.3,22,0,0,0],PROPERTIES:{SHOOT_SETTINGS:safeCS([g.trap,g.setTrap,g.hexaTrapper,{health:2.5,reload:1.4,speed:0.8,damage:1.6}]),TYPE:'setTrap',STAT_CALCULATOR:'trap',AUTOFIRE:true}},
    ]},{aiSettings:{SKYNET:true,FULL_VIEW:true,independent:true,extraStats:[]}});
    Class.EAB_rogueFortressBase = {PARENT:'miniboss',LABEL:'Rogue Fortress',COLOR:'darkGrey',UPGRADE_COLOR:'darkGrey',SHAPE:6,SIZE:32,VALUE:7e5,SKILL_CAP:[1,5,5,5,1,0,0,9,0,0],CONTROLLERS:['nearestDifferentMaster','onlyAcceptInArc'],BODY:{FOV:1.2,SPEED:0.03*base.SPEED,HEALTH:24*base.HEALTH,SHIELD:8*base.SHIELD,REGEN:base.REGEN*2,DAMAGE:4*base.DAMAGE}};
    Class.EAB_rogueFortressConstructor = Object.assign({},Class.EAB_rogueFortressBase,{UPGRADE_TOOLTIP:'(Constructor)',GUNS:[],TURRETS:[...weaponArray({POSITION:[6,10,0,30,110,0],TYPE:['EAB_rogueFortressWall',{GUN_STAT_SCALE:{health:0.8,damage:0.9}}]},6),{POSITION:[10,0,0,0,360,1],TYPE:['auto4gun',{INDEPENDENT:true,COLOR:-1}]},{POSITION:[7,0,0,0,360,1],TYPE:['auto4gun',{INDEPENDENT:true,COLOR:-1}]}]});
    Class.EAB_rogueFortressBlockade    = Object.assign({},Class.EAB_rogueFortressBase,{UPGRADE_TOOLTIP:'(Blockade)',   GUNS:[],TURRETS:[...weaponArray({POSITION:[6,10,0,30,110,0],TYPE:['EAB_blockadeTurret',{GUN_STAT_SCALE:{health:0.8,damage:0.9}}]},6),{POSITION:[10,0,0,0,360,1],TYPE:['auto4gun',{INDEPENDENT:true,COLOR:-1}]},{POSITION:[7,0,0,0,360,1],TYPE:['auto4gun',{INDEPENDENT:true,COLOR:-1}]}]});
    Class.EAB_rogueFortressBarrier     = Object.assign({},Class.EAB_rogueFortressBase,{UPGRADE_TOOLTIP:'(Barrier)',    GUNS:[],TURRETS:[...weaponArray({POSITION:[6,10,0,30,110,0],TYPE:['EAB_barrierTurret',{GUN_STAT_SCALE:{health:0.8,damage:0.9}}]},6),{POSITION:[10,0,0,0,360,1],TYPE:['bigauto4gun',{INDEPENDENT:true,COLOR:-1}]}]});

    // ── NEW: Rogue Cyclone — spinning rogue with whirlwind pattern ─────────
    Class.EAB_rogueCycloneBase = {PARENT:'miniboss',LABEL:'Rogue Cyclone',COLOR:'darkGrey',UPGRADE_COLOR:'darkGrey',SHAPE:6,SIZE:28,VALUE:6e5,SKILL_CAP:[2,6,6,6,2,0,0,9,0,0],FACING_TYPE:['spin',{speed:0.06}],BODY:{FOV:1.4,SPEED:0.08*base.SPEED,HEALTH:14*base.HEALTH,SHIELD:2*base.SHIELD,DAMAGE:3.5*base.DAMAGE}};
    Class.EAB_rogueCycloneVortex = Object.assign({},Class.EAB_rogueCycloneBase,{UPGRADE_TOOLTIP:'(Vortex)',GUNS:weaponArray([{POSITION:[9.5,3,1,-1.5,11,10,2/3],PROPERTIES:{SHOOT_SETTINGS:safeCS([g.basic,g.twin,g.gunner,g.cyclone,{damage:1.3,speed:1.5}]),TYPE:'bullet',AUTOFIRE:true}},{POSITION:[9.5,3,1,3.5,6,10,1/3],PROPERTIES:{SHOOT_SETTINGS:safeCS([g.basic,g.twin,g.gunner,g.cyclone,{damage:1.3,speed:1.5}]),TYPE:'bullet',AUTOFIRE:true}},{POSITION:[9.5,3,1,8.5,1.5,10,0],PROPERTIES:{SHOOT_SETTINGS:safeCS([g.basic,g.twin,g.gunner,g.cyclone,{damage:1.3,speed:1.5}]),TYPE:'bullet',AUTOFIRE:true}}],6),TURRETS:[]});
    Class.EAB_rogueCycloneGale   = Object.assign({},Class.EAB_rogueCycloneBase,{UPGRADE_TOOLTIP:'(Gale)',  GUNS:weaponArray([{POSITION:[18,8,1,0,0,30,0.5],PROPERTIES:{SHOOT_SETTINGS:safeCS([g.basic,g.flankGuard,g.spam,{damage:1.2}]),TYPE:'bullet',AUTOFIRE:true}},{POSITION:[18,8,1,0,0,0,0],PROPERTIES:{SHOOT_SETTINGS:safeCS([g.basic,g.flankGuard,g.spam,{damage:1.2}]),TYPE:'bullet',AUTOFIRE:true}}],6),TURRETS:[{POSITION:[8,0,0,0,360,1],TYPE:['EAB_eliteSpinnerGaleTurret',{COLOR:-1}]}]});

    // Rogue Armada ──────────────────────────────────────────────────────────────
    const _raBase = {PARENT:'miniboss',LABEL:'Rogue Armada',COLOR:'darkGrey',UPGRADE_COLOR:'darkGrey',SHAPE:7,SIZE:28,VALUE:5e5,SKILL_CAP:[2,6,6,6,2,0,0,9,0,0],BODY:{FOV:1.3,SPEED:base.SPEED*0.1,HEALTH:base.HEALTH*16,SHIELD:base.SHIELD*3,REGEN:base.REGEN,DAMAGE:base.DAMAGE*3}};
    const _boomGun = (type) => ({PROPERTIES:{SHOOT_SETTINGS:safeCS([g.basic,g.machineGun,g.shotgun,g.pounder,{reload:2,damage:1.5,health:1.5,resist:1.25}]),TYPE:type}});
    Class.EAB_rogueArmadaBoomstick  = Object.assign({},_raBase,{UPGRADE_TOOLTIP:'(Boomstick)', GUNS:weaponArray([{POSITION:[8,2,1,0,-2,360/14,0],..._boomGun('casing')},{POSITION:[8,3,1,0,0.5,360/14,0],..._boomGun('bullet')},{POSITION:[8,4,1,0,1,360/14,0],..._boomGun('bullet')},{POSITION:[8.5,7.25,1,4,0,360/14,0],..._boomGun('casing')},{POSITION:[7,7.25,-1.2,4,0,360/14,0]}],7),TURRETS:weaponArray({POSITION:[5,10,0,0,110,0],TYPE:'shottrapTurret'},7)});
    Class.EAB_rogueArmadaPumper     = Object.assign({},_raBase,{UPGRADE_TOOLTIP:'(Pumper)',    GUNS:weaponArray([{POSITION:[8,2,1,0,-1.5,360/14,0],PROPERTIES:{SHOOT_SETTINGS:safeCS([g.basic,g.machineGun,g.shotgun,g.pounder,g.launcher,{reload:2,damage:1.5,health:1.5,resist:1.25}]),TYPE:'minimissile'}},{POSITION:[9.25,4,1,4,0,360/14,0]},{POSITION:[8.5,6,1,4,0,360/14,0],PROPERTIES:{SHOOT_SETTINGS:safeCS([g.basic,g.machineGun,g.shotgun,g.pounder,g.launcher,{reload:2},g.fake]),TYPE:'minimissile'}},{POSITION:[7,6,-1.6,4,0,360/14,0]}],7),TURRETS:weaponArray({POSITION:[5,10,0,0,110,0],TYPE:'shottrapTurret'},7)});
    Class.EAB_rogueArmadaConstructor= Object.assign({},_raBase,{UPGRADE_TOOLTIP:'(Constructor)',GUNS:weaponArray([{POSITION:[8,2,1,0,-2,360/14,0],..._boomGun('casing')},{POSITION:[8,3,1,0,0,360/14,0],..._boomGun('bullet')},{POSITION:[8,4,1,0,1.5,360/14,0],..._boomGun('casing')},{POSITION:[8.5,6,1,4,0,360/14,0],PROPERTIES:{SHOOT_SETTINGS:safeCS([g.basic,g.machineGun,g.shotgun,g.pounder,{reload:2},g.fake]),TYPE:'casing'}},{POSITION:[7,6,-1.6,4,0,360/14,0]}],7),TURRETS:weaponArray({POSITION:[5,10,0,0,110,0],TYPE:'EAB_shotconstructorTurret'},7)});
    Class.EAB_rogueArmadaEngineer   = Object.assign({},_raBase,{UPGRADE_TOOLTIP:'(Engineer)',  GUNS:weaponArray([{POSITION:[8,2,1,0,-2,360/14,0],..._boomGun('casing')},{POSITION:[8,3,1,0,0,360/14,0],..._boomGun('bullet')},{POSITION:[8,4,1,0,1.5,360/14,0],..._boomGun('casing')},{POSITION:[8.5,6,1,4,0,360/14,0],PROPERTIES:{SHOOT_SETTINGS:safeCS([g.basic,g.machineGun,g.shotgun,g.pounder,{reload:2},g.fake]),TYPE:'casing'}},{POSITION:[7,6,-1.6,4,0,360/14,0]}],7),TURRETS:weaponArray({POSITION:[5,10,0,0,110,0],TYPE:'EAB_shotmechTurret'},7)});

// ══════════════════════════════════════════════════════════════════════════════
// ── RAMMERS ──────────────────────────────────────────────────────────────────
// ══════════════════════════════════════════════════════════════════════════════

    const _bobTurrets = (hats) => hats.map(h=>({POSITION:h[0],TYPE:[h[1],{COLOR:'black'}]}));
    const _bobBase  = (label,tip,color,size,spd,hp,dmg,density,turrets) => ({PARENT:'ramMiniboss',LABEL:label,UPGRADE_TOOLTIP:tip,SHAPE:0,COLOR:color,UPGRADE_COLOR:color,SIZE:size,BODY:{SPEED:spd*base.SPEED,HEALTH:hp*base.HEALTH,DAMAGE:dmg*base.DAMAGE,REGEN:8*base.REGEN,FOV:0.5*base.FOV,DENSITY:density*base.DENSITY},CONTROLLERS:['nearestDifferentMaster','mapTargetToGoal'],TURRETS:turrets});
    const _hexSpins = [[24.5,0,0,0,360,0],[24.5,0,0,30,360,0],[23.75,0,0,0,360,0]];
    Class.EAB_megaBob    = _bobBase('Mega Bob',   '(Mega)', 'aqua',18,1.8,10, 4.5,7.5,_bobTurrets([[_hexSpins[0],'hexagonHat_spin'],[_hexSpins[1],'hexagonHat_spinFaster'],[_hexSpins[2],'triangleHat_spin']]));
    Class.EAB_bobby      = _bobBase('Bobby',      '(Spike)','aqua',18,1.8,4.5,10, 6,  _bobTurrets([[_hexSpins[0],'hexagonHat_spin'],[_hexSpins[1],'hexagonHat_spinFaster'],[[24,0,0,0,360,0],'triangleHat_spin'],[[24,0,0,60,360,0],'triangleHat_spinFast']]));
    Class.EAB_autoBob    = _bobBase('Auto-Bob',   '(Auto)', 'aqua',18,1.9,4.8,4.8,6,  [..._bobTurrets([[_hexSpins[0],'hexagonHat_spin'],[_hexSpins[1],'hexagonHat_spinFaster'],[_hexSpins[2],'triangleHat_spin']]),{POSITION:[11,0,0,0,360,1],TYPE:['autoSmasherTurret',{INDEPENDENT:false}]}]);
    Class.EAB_hob        = _bobBase('Hob',        '(Bonker)','aqua',12.5,2.5,3.5,5.5,4,  _bobTurrets([[_hexSpins[0],'hexagonHat_spin'],[_hexSpins[1],'hexagonHat_spinFaster'],[[24,0,0,0,360,0],'triangleHat_spin']]));
    Class.EAB_rupert     = _bobBase('Rupert',     '(Banger)','aqua',28, 2,  7,  4,  12, _bobTurrets([[_hexSpins[0],'hexagonHat_spin'],[_hexSpins[1],'hexagonHat_spinFaster'],[[23,0,0,0,360,0],'triangleHat_spin']]));
    Class.EAB_megaNemesis= _bobBase('Mega Nemesis','(Mega)', 'red', 18,1.8,1000,900, 37.5, _bobTurrets([[_hexSpins[0],'hexagonHat_spin'],[_hexSpins[1],'hexagonHat_spinFaster'],[_hexSpins[2],'triangleHat_spin']]));
    Class.EAB_antagonist = _bobBase('Antagonist',  '(Spike)','red', 18,1.8,900, 2000,30,  _bobTurrets([[_hexSpins[0],'hexagonHat_spin'],[_hexSpins[1],'hexagonHat_spinFaster'],[[24,0,0,0,360,0],'triangleHat_spin'],[[24,0,0,60,360,0],'triangleHat_spinFast']]));
    Class.EAB_autoNemesis= _bobBase('Auto-Nemesis','(Auto)', 'red', 18,1.9,960, 960, 30,  [..._bobTurrets([[_hexSpins[0],'hexagonHat_spin'],[_hexSpins[1],'hexagonHat_spinFaster'],[_hexSpins[2],'triangleHat_spin']]),{POSITION:[11,0,0,0,360,1],TYPE:['autoSmasherTurret',{INDEPENDENT:false}]}]);
    Class.EAB_rival      = _bobBase('Rival',       '(Bonker)','red',12.5,2.5,700,1100,20, _bobTurrets([[_hexSpins[0],'hexagonHat_spin'],[_hexSpins[1],'hexagonHat_spinFaster'],[[24,0,0,0,360,0],'triangleHat_spin']]));
    Class.EAB_bandit     = _bobBase('Bandit',      '(Banger)','red',28, 2,  1400,800,60,  _bobTurrets([[_hexSpins[0],'hexagonHat_spin'],[_hexSpins[1],'hexagonHat_spinFaster'],[[23,0,0,0,360,0],'triangleHat_spin']]));

    // ── NEW: Cosmic Rammers — ultra-tier rammers with weapon pods ─────────
    Class.EAB_cosmicRammerBase = {PARENT:'ramMiniboss',LABEL:'Cosmic Rammer',SHAPE:0,COLOR:'purple',UPGRADE_COLOR:'purple',SIZE:22,BODY:{SPEED:2.2*base.SPEED,HEALTH:18*base.HEALTH,DAMAGE:12*base.DAMAGE,REGEN:10*base.REGEN,FOV:0.55*base.FOV,DENSITY:10*base.DENSITY},CONTROLLERS:['nearestDifferentMaster','mapTargetToGoal']};
    Class.EAB_cosmicRammerNova = Object.assign({},Class.EAB_cosmicRammerBase,{LABEL:'Nova Rammer',UPGRADE_TOOLTIP:'(Nova)',TURRETS:[
        {POSITION:[24.5,0,0,0,360,0],TYPE:['hexagonHat_spin',{COLOR:'black'}]},{POSITION:[24.5,0,0,30,360,0],TYPE:['hexagonHat_spinFaster',{COLOR:'black'}]},
        {POSITION:[23.75,0,0,0,360,0],TYPE:['triangleHat_spin',{COLOR:'black'}]},
        {POSITION:[11,0,0,0,360,1],TYPE:['autoSmasherTurret',{INDEPENDENT:false}]},
        ...weaponArray({POSITION:[8,8,0,0,120,0],TYPE:['auto4gun',{INDEPENDENT:true,COLOR:-1}]},3),
    ]});
    Class.EAB_cosmicRammerPulsar = Object.assign({},Class.EAB_cosmicRammerBase,{LABEL:'Pulsar Rammer',UPGRADE_TOOLTIP:'(Pulsar)',SIZE:18,BODY:{...Class.EAB_cosmicRammerBase.BODY,SPEED:3.0*base.SPEED,HEALTH:12*base.HEALTH},TURRETS:[
        {POSITION:[21.5,0,0,0,360,0],TYPE:['hexagonHat_spin',{COLOR:'black'}]},{POSITION:[21.5,0,0,30,360,0],TYPE:['hexagonHat_spinFaster',{COLOR:'black'}]},
        {POSITION:[24,0,0,0,360,0],TYPE:['triangleHat_spin',{COLOR:'black'}]},{POSITION:[24,0,0,60,360,0],TYPE:['triangleHat_spinFast',{COLOR:'black'}]},
        ...weaponArray({POSITION:[6,7,0,0,180,0],TYPE:['auto4gun',{INDEPENDENT:true,COLOR:-1}]},6),
    ]});

// ══════════════════════════════════════════════════════════════════════════════
// ── NEW: TERRESTRIALS (7.5-sided, between Celestials and Minibosses) ─────────
// ══════════════════════════════════════════════════════════════════════════════

    // Terrestrial base (7.5-sided, size 55, health 3500)
    const _terrestrialBase = (name, label, color, extraBody={}) => ({
        PARENT:'miniboss', LABEL:label, DANGER:9, SHAPE:7.5, COLOR:color, UPGRADE_COLOR:color,
        SIZE:55, VALUE:3e6,
        SKILL_CAP:SKL9,
        BODY:{ FOV:0.8, SPEED:0.18*base.SPEED, HEALTH:3500, DAMAGE:10, REGEN:base.REGEN*0.05, SHIELD:200, ...extraBody },
        HITS_OWN_TYPE:'boss',
        BROADCAST_MESSAGE:`${label} has been defeated!`,
        GUNS:[], TURRETS:[],
    });

    const _terTurret = (guns) => makeTurret({GUNS:[_sfg,...guns]},{canRepel:true,limitFov:true,fov:10,extraStats:[]});

    // ── ARES — War deity, forward obliterators + missile storm ────────────────
    Class.EAB_aresBigMacTurret = _terTurret([
        {POSITION:[30,20,1,0,0,0,0],PROPERTIES:{SHOOT_SETTINGS:safeCS([g.basic,g.pounder,g.destroyer,g.annihilator,{damage:1.6,health:1.4,resist:1.3,size:1.2}]),TYPE:'bullet',LABEL:'War Hammer'}},
        {POSITION:[24,22,1,0,0,0,0.2],PROPERTIES:{SHOOT_SETTINGS:safeCS([g.basic,g.pounder,g.destroyer,{damage:1.4,health:1.3}]),TYPE:'bullet'}},
    ]);
    Class.EAB_aresMissileTurret = _terTurret([
        {POSITION:[10,14,-0.5,9,0,0,0]},
        {POSITION:[18,15,1,0,0,0,0],PROPERTIES:{SHOOT_SETTINGS:safeCS([g.basic,g.pounder,g.artillery,g.artillery,g.skimmer,{damage:1.5,reload:1.2}]),TYPE:'EAB_ultramissile',STAT_CALCULATOR:'sustained'}},
    ]);
    Class.EAB_ares = Object.assign(_terrestrialBase('ares','Ares','red',{SPEED:0.2*base.SPEED}),{
        BROADCAST_MESSAGE:'Ares, God of War, has been slain!',
        TURRETS:[
            ...Array.from({length:7},(_,i)=>({POSITION:[8.5,9,0,i*(360/7),180,0],TYPE:['EAB_aresBigMacTurret',{GUN_STAT_SCALE:{damage:1.3,health:1.2}}]})),
            ...Array.from({length:7},(_,i)=>({POSITION:[10,9,0,i*(360/7)+360/14,180,0],TYPE:['EAB_aresMissileTurret',{GUN_STAT_SCALE:{damage:1.3,health:1.2}}]})),
            {POSITION:[6,0,0,0,360,1],TYPE:['auto4gun',{INDEPENDENT:true,COLOR:-1}]},
        ],
    });

    // ── GERSEMI — Fertility deity, drone armies + swarm clouds ────────────────
    Class.EAB_gersemiSummonerTurret = _terTurret([
        {POSITION:[0,9,1.1,10,0,  0,0],   PROPERTIES:{SHOOT_SETTINGS:safeCS([g.drone,g.summoner,{health:1.6,damage:1.5,size:1.2,maxSpeed:1.4}]),TYPE:['summonerDrone',{INDEPENDENT:true}],AUTOFIRE:true,SYNCS_SKILLS:true,STAT_CALCULATOR:'drone',WAIT_TO_CYCLE:true,MAX_CHILDREN:3}},
        {POSITION:[0,9,1.1,10,0, 90,0.25],PROPERTIES:{SHOOT_SETTINGS:safeCS([g.drone,g.summoner,{health:1.6,damage:1.5,size:1.2,maxSpeed:1.4}]),TYPE:['summonerDrone',{INDEPENDENT:true}],AUTOFIRE:true,SYNCS_SKILLS:true,STAT_CALCULATOR:'drone',WAIT_TO_CYCLE:true,MAX_CHILDREN:3}},
        {POSITION:[0,9,1.1,10,0,180,0.5], PROPERTIES:{SHOOT_SETTINGS:safeCS([g.drone,g.summoner,{health:1.6,damage:1.5,size:1.2,maxSpeed:1.4}]),TYPE:['summonerDrone',{INDEPENDENT:true}],AUTOFIRE:true,SYNCS_SKILLS:true,STAT_CALCULATOR:'drone',WAIT_TO_CYCLE:true,MAX_CHILDREN:3}},
        {POSITION:[0,9,1.1,10,0,270,0.75],PROPERTIES:{SHOOT_SETTINGS:safeCS([g.drone,g.summoner,{health:1.6,damage:1.5,size:1.2,maxSpeed:1.4}]),TYPE:['summonerDrone',{INDEPENDENT:true}],AUTOFIRE:true,SYNCS_SKILLS:true,STAT_CALCULATOR:'drone',WAIT_TO_CYCLE:true,MAX_CHILDREN:3}},
    ]);
    Class.EAB_gersemiSwarmTurret = _terTurret([
        {POSITION:[0,9,1.1,10,0,  0,0],   PROPERTIES:{SHOOT_SETTINGS:safeCS([g.swarm,g.battleship,g.carrier,{health:1.5,damage:1.4}]),TYPE:['autoswarm',{INDEPENDENT:true}],AUTOFIRE:true,SYNCS_SKILLS:true,STAT_CALCULATOR:'swarm'}},
        {POSITION:[0,9,1.1,10,0, 72,0.2],  PROPERTIES:{SHOOT_SETTINGS:safeCS([g.swarm,g.battleship,g.carrier,{health:1.5,damage:1.4}]),TYPE:['autoswarm',{INDEPENDENT:true}],AUTOFIRE:true,SYNCS_SKILLS:true,STAT_CALCULATOR:'swarm'}},
        {POSITION:[0,9,1.1,10,0,144,0.4],  PROPERTIES:{SHOOT_SETTINGS:safeCS([g.swarm,g.battleship,g.carrier,{health:1.5,damage:1.4}]),TYPE:['autoswarm',{INDEPENDENT:true}],AUTOFIRE:true,SYNCS_SKILLS:true,STAT_CALCULATOR:'swarm'}},
        {POSITION:[0,9,1.1,10,0,216,0.6],  PROPERTIES:{SHOOT_SETTINGS:safeCS([g.swarm,g.battleship,g.carrier,{health:1.5,damage:1.4}]),TYPE:['autoswarm',{INDEPENDENT:true}],AUTOFIRE:true,SYNCS_SKILLS:true,STAT_CALCULATOR:'swarm'}},
        {POSITION:[0,9,1.1,10,0,288,0.8],  PROPERTIES:{SHOOT_SETTINGS:safeCS([g.swarm,g.battleship,g.carrier,{health:1.5,damage:1.4}]),TYPE:['autoswarm',{INDEPENDENT:true}],AUTOFIRE:true,SYNCS_SKILLS:true,STAT_CALCULATOR:'swarm'}},
    ]);
    Class.EAB_gersemi = Object.assign(_terrestrialBase('gersemi','Gersemi','lightGreen',{SPEED:0.15*base.SPEED,HEALTH:3200,SHIELD:350}),{
        BROADCAST_MESSAGE:'Gersemi, the Fertile, returns to the earth...',
        TURRETS:[
            ...Array.from({length:7},(_,i)=>({POSITION:[8.5,9,0,i*(360/7),180,0],TYPE:['EAB_gersemiSummonerTurret',{GUN_STAT_SCALE:{damage:1.3,health:1.2}}]})),
            ...Array.from({length:7},(_,i)=>({POSITION:[10,9,0,i*(360/7)+360/14,180,0],TYPE:['EAB_gersemiSwarmTurret',{GUN_STAT_SCALE:{damage:1.3,health:1.2}}]})),
            {POSITION:[6,0,0,0,360,1],TYPE:['auto4gun',{INDEPENDENT:true,COLOR:-1}]},
        ],
    });

    // ── EZEKIEL — Visionary deity, overlapping hive launchers + spinning beams ─
    Class.EAB_ezekielHiveTurretHive = {
        PARENT:'bullet', LABEL:'Vision Fragment', BODY:{RANGE:110,FOV:0.6},
        INDEPENDENT:true, CONTROLLERS:['nearestDifferentMaster','targetSelf'], AI:{NO_LEAD:true},
        GUNS: weaponArray({POSITION:[6,8,0.6,6,0,0,0],PROPERTIES:{SHOOT_SETTINGS:safeCS([g.swarm,g.hive,g.bee,{damage:1.3,health:1.1}]),TYPE:['bee',{PERSISTS_AFTER_DEATH:true}],STAT_CALCULATOR:'swarm',AUTOFIRE:true}},7,{delayIncrement:1/7}),
    };
    Class.EAB_ezekielHiveTurret = _terTurret([
        {POSITION:[22,14,-1.2,4,0,0,0],PROPERTIES:{SHOOT_SETTINGS:safeCS([g.basic,g.pounder,g.destroyer,g.hive,{damage:1.5,health:1.4,range:1.3,speed:1.2}]),TYPE:'EAB_ezekielHiveTurretHive',LABEL:'Vision'}},
        {POSITION:[22,12,1,5,0,0,0]},
    ]);
    Class.EAB_ezekielBeamTurret = _terTurret([
        {POSITION:[28,7,1,0,0,0,0],  PROPERTIES:{SHOOT_SETTINGS:safeCS([g.basic,g.sniper,g.predator,{damage:1.5,health:1.4,pen:1.3,range:1.2}]),TYPE:'bullet',LABEL:'Vision Beam'}},
        {POSITION:[22,10,1,0,0,0,0.2],PROPERTIES:{SHOOT_SETTINGS:safeCS([g.basic,g.sniper,g.predator,{damage:1.3,health:1.2}]),TYPE:'bullet'}},
        {POSITION:[16,14,1,0,0,0,0.4],PROPERTIES:{SHOOT_SETTINGS:safeCS([g.basic,g.sniper,{damage:1.1}]),TYPE:'bullet'}},
    ]);
    Class.EAB_ezekiel = Object.assign(_terrestrialBase('ezekiel','Ezekiel','gold',{HEALTH:3800,SPEED:0.14*base.SPEED}),{
        BROADCAST_MESSAGE:'The Vision of Ezekiel fades...',
        TURRETS:[
            ...Array.from({length:7},(_,i)=>({POSITION:[8.5,9,0,i*(360/7),180,0],TYPE:['EAB_ezekielHiveTurret',{GUN_STAT_SCALE:{damage:1.3,health:1.2,range:1.1}}]})),
            ...Array.from({length:7},(_,i)=>({POSITION:[10,9,0,i*(360/7)+360/14,180,0],TYPE:['EAB_ezekielBeamTurret',{GUN_STAT_SCALE:{damage:1.3,health:1.2}}]})),
            {POSITION:[6,0,0,0,360,1],TYPE:['auto4gun',{INDEPENDENT:true,COLOR:-1}]},
        ],
    });

// ══════════════════════════════════════════════════════════════════════════════
// ── MENUS ────────────────────────────────────────────────────────────────────
// ══════════════════════════════════════════════════════════════════════════════

    // Menu nodes — safe creation with null check
    const _mkMenu = (key, label, opts) => {
        if (!Class[key]) Class[key] = makeMenu(label, opts);
        if (!Class[key].UPGRADES_TIER_0) Class[key].UPGRADES_TIER_0 = [];
    };
    _mkMenu('EABMenu',          'Extended Armsrace Bosses', {rerootTree:'EABMenu'});
    _mkMenu('EAB_elites',       'Elites',       {color:'pink',    boxColor:'pink',    shape:3.5});
    _mkMenu('EAB_mysticals',    'Mysticals',    {color:'gold',    boxColor:'gold',    shape:4});
    _mkMenu('EAB_nesters',      'Nesters',      {color:'purple',  boxColor:'purple',  shape:5.5});
    _mkMenu('EAB_rogues',       'Rogues',       {color:'darkGrey',boxColor:'darkGrey',shape:6});
    _mkMenu('EAB_rammers',      'Rammers',      {color:'aqua',    boxColor:'aqua',    shape:0});
    _mkMenu('EAB_terrestrials', 'Terrestrials', {color:'orange',  boxColor:'orange',  shape:7.5});
    _mkMenu('EAB_celestials',   'Celestials',   {color:'lightGreen',boxColor:'lightGreen',shape:9.5});
    _mkMenu('EAB_eternals',     'Eternals',     {color:'veryLightGrey',boxColor:'veryLightGrey',shape:11.5});

    Class.EABMenu.UPGRADES_TIER_0 = ['EAB_elites','EAB_mysticals','EAB_nesters','EAB_rogues','EAB_rammers','EAB_terrestrials','EAB_celestials','EAB_eternals'];

    Class.EAB_elites.UPGRADES_TIER_0 = [
        'EAB_eliteDestroyerBigMac','EAB_eliteDestroyerConstructor','EAB_eliteDestroyerLauncher','EAB_eliteDestroyerPenta','EAB_eliteDestroyerDrive','EAB_eliteDestroyerHoncho','EAB_eliteDestroyerDoper',
        'EAB_eliteGunnerMechanic','EAB_eliteGunnerDriver','EAB_eliteGunnerSpecialist','EAB_eliteGunnerTriplet',
        'EAB_elitePredatorSniper','EAB_elitePredatorDual','EAB_elitePredatorRanger',
        'EAB_eliteNecromancerSummoner','EAB_eliteNecromancerOverlord','EAB_eliteNecromancerDemonchip',
        'EAB_eliteSprayerRedistributor','EAB_eliteSprayerAtomizer','EAB_eliteSprayerFocal','EAB_eliteSprayerHexaMachine','EAB_eliteSprayerTripleSprayer','EAB_eliteSprayerStreamliner',
        'EAB_eliteBattleshipCarrier','EAB_eliteBattleshipHoncho','EAB_eliteBattleshipDoper','EAB_eliteBattleshipMore','EAB_eliteBattleshipTwin','EAB_eliteBattleshipMega',
        'EAB_eliteSpawnerFactory','EAB_eliteSpawnerHoncho','EAB_eliteSpawnerDoper','EAB_eliteSpawnerTriplet','EAB_eliteSpawnerNexus',
        'EAB_eliteTrapGuardBuilder','EAB_eliteTrapGuardMech','EAB_eliteTrapGuardTwin','EAB_eliteTrapGuardMega','EAB_eliteTrapGuardPeashooter','EAB_eliteTrapGuardNexus',
        'EAB_eliteSpinnerTornado','EAB_eliteSpinnerTempest','EAB_eliteSpinnerGale','EAB_eliteSpinnerTrove','EAB_eliteSpinnerHurricane',
        'EAB_eliteSkimmerHyperSkimmer','EAB_eliteSkimmerBazooka','EAB_eliteSkimmerSkidder','EAB_eliteSkimmerTicker','EAB_eliteSkimmerBarrage',
    ];
    Class.EAB_mysticals.UPGRADES_TIER_0 = [
        'EAB_sorcererdrive','EAB_sorcererHoncho','EAB_sorcererDoper',
        'EAB_summonerdrive','EAB_summonerHoncho','EAB_summonerDoper',
        'EAB_enchantressdrive','EAB_enchantressHoncho','EAB_enchantressDoper',
        'EAB_exorcistordrive','EAB_exorcistorHoncho','EAB_exorcistorDoper',
        'EAB_shamandrive','EAB_shamanHoncho','EAB_shamanDoper',
    ];
    Class.EAB_nesters.UPGRADES_TIER_0 = [
        'EAB_nestKeeperDrive','EAB_nestKeeperHoncho','EAB_nestKeeperDoper','EAB_nestKeeperTriplet','EAB_nestKeeperRecoiler','EAB_nestKeeperBentBoomer','EAB_nestKeeperParryer',
        'EAB_nestWardenCarrier','EAB_nestWardenHoncho','EAB_nestWardenDoper','EAB_nestWardenConstructor','EAB_nestWardenEngineer','EAB_nestWardenBlockade','EAB_nestWardenBarrier','EAB_nestWardenPropper',
        'EAB_nestGuardianBigMac','EAB_nestGuardianStomper','EAB_nestGuardianLauncher','EAB_nestGuardianMyriad','EAB_nestGuardianMolotov','EAB_nestGuardianCatapult','EAB_nestGuardianHyperTwister',
    ];
    Class.EAB_rogues.UPGRADES_TIER_0 = [
        'EAB_roguePalisadeMegaSpawner','EAB_roguePalisadeHoncho','EAB_roguePalisadeDoper','EAB_roguePalisadeBuilder','EAB_roguePalisadeMech',
        'EAB_rogueArmadaBoomstick','EAB_rogueArmadaPumper','EAB_rogueArmadaConstructor',
        'EAB_rogueFortressConstructor','EAB_rogueFortressBlockade','EAB_rogueFortressBarrier',
        'EAB_rogueCycloneVortex','EAB_rogueCycloneGale',
    ];
    Class.EAB_rammers.UPGRADES_TIER_0 = [
        'EAB_megaBob','EAB_bobby','EAB_autoBob','EAB_hob','EAB_rupert',
        'EAB_megaNemesis','EAB_antagonist','EAB_autoNemesis','EAB_rival','EAB_bandit',
        'EAB_cosmicRammerNova','EAB_cosmicRammerPulsar',
    ];
    Class.EAB_terrestrials.UPGRADES_TIER_0 = ['EAB_ares','EAB_gersemi','EAB_ezekiel'];
    Class.EAB_celestials.UPGRADES_TIER_0   = [];
    Class.EAB_eternals.UPGRADES_TIER_0     = [];

    // ── Hook EABMenu into menu_addons ─────────────────────────────────────────
    const _entry = ['menu_addons','addons']
        .find(n => Class[n] && Array.isArray(Class[n].UPGRADES_TIER_0));
    if (_entry) {
        Class[_entry].UPGRADES_TIER_0.push('EABMenu');
        console.log('[EAB] Connected to ' + _entry);
    } else {
        console.warn('[EAB] Connect EABMenu manually.');
    }

    // ── Wire existing elite classes to their new upgrade trees (safe) ─────────
    const _safeSet = (className, prop, value) => {
        try { if (Class[className]) Class[className][prop] = value; } catch(e) {}
    };
    _safeSet('eliteDestroyer', 'UPGRADES_TIER_0', ['EAB_eliteDestroyerBigMac','EAB_eliteDestroyerConstructor','EAB_eliteDestroyerLauncher','EAB_eliteDestroyerPenta','EAB_eliteDestroyerDrive','EAB_eliteDestroyerHoncho','EAB_eliteDestroyerDoper']);
    _safeSet('eliteGunner',    'UPGRADES_TIER_0', ['EAB_eliteGunnerMechanic','EAB_eliteGunnerDriver','EAB_eliteGunnerSpecialist','EAB_eliteGunnerTriplet']);
    _safeSet('eliteSprayer',   'UPGRADES_TIER_0', ['EAB_eliteSprayerRedistributor','EAB_eliteSprayerAtomizer','EAB_eliteSprayerFocal','EAB_eliteSprayerHexaMachine','EAB_eliteSprayerTripleSprayer','EAB_eliteSprayerStreamliner']);
    _safeSet('eliteBattleship','UPGRADES_TIER_0', ['EAB_eliteBattleshipCarrier','EAB_eliteBattleshipHoncho','EAB_eliteBattleshipDoper','EAB_eliteBattleshipMore','EAB_eliteBattleshipTwin','EAB_eliteBattleshipMega']);
    _safeSet('eliteSpawner',   'UPGRADES_TIER_0', ['EAB_eliteSpawnerFactory','EAB_eliteSpawnerHoncho','EAB_eliteSpawnerDoper','EAB_eliteSpawnerTriplet','EAB_eliteSpawnerNexus']);
    _safeSet('eliteTrapGuard', 'UPGRADES_TIER_0', ['EAB_eliteTrapGuardBuilder','EAB_eliteTrapGuardMech','EAB_eliteTrapGuardTwin','EAB_eliteTrapGuardMega','EAB_eliteTrapGuardPeashooter','EAB_eliteTrapGuardNexus']);
    _safeSet('eliteSpinner',   'UPGRADES_TIER_0', ['EAB_eliteSpinnerTornado','EAB_eliteSpinnerTempest','EAB_eliteSpinnerGale','EAB_eliteSpinnerTrove','EAB_eliteSpinnerHurricane']);
    _safeSet('eliteSkimmer',   'UPGRADES_TIER_0', ['EAB_eliteSkimmerHyperSkimmer','EAB_eliteSkimmerBazooka','EAB_eliteSkimmerSkidder','EAB_eliteSkimmerTicker','EAB_eliteSkimmerBarrage']);
    _safeSet('elitePredator',  'UPGRADES_TIER_0', ['EAB_elitePredatorSniper','EAB_elitePredatorDual','EAB_elitePredatorRanger']);
    _safeSet('eliteNecromancer','UPGRADES_TIER_0',['EAB_eliteNecromancerSummoner','EAB_eliteNecromancerOverlord','EAB_eliteNecromancerDemonchip']);
    _safeSet('sorcerer',       'UPGRADES_TIER_0', ['EAB_sorcererdrive','EAB_sorcererHoncho','EAB_sorcererDoper']);
    _safeSet('summoner',       'UPGRADES_TIER_0', ['EAB_summonerdrive','EAB_summonerHoncho','EAB_summonerDoper']);
    _safeSet('enchantress',    'UPGRADES_TIER_0', ['EAB_enchantressdrive','EAB_enchantressHoncho','EAB_enchantressDoper']);
    _safeSet('exorcistor',     'UPGRADES_TIER_0', ['EAB_exorcistordrive','EAB_exorcistorHoncho','EAB_exorcistorDoper']);
    _safeSet('shaman',         'UPGRADES_TIER_0', ['EAB_shamandrive','EAB_shamanHoncho','EAB_shamanDoper']);
    _safeSet('nestKeeper',     'UPGRADES_TIER_0', ['EAB_nestKeeperDrive','EAB_nestKeeperHoncho','EAB_nestKeeperDoper','EAB_nestKeeperTriplet','EAB_nestKeeperRecoiler','EAB_nestKeeperBentBoomer','EAB_nestKeeperParryer']);
    _safeSet('nestWarden',     'UPGRADES_TIER_0', ['EAB_nestWardenCarrier','EAB_nestWardenHoncho','EAB_nestWardenDoper','EAB_nestWardenConstructor','EAB_nestWardenEngineer','EAB_nestWardenBlockade','EAB_nestWardenBarrier','EAB_nestWardenPropper']);
    _safeSet('nestGuardian',   'UPGRADES_TIER_0', ['EAB_nestGuardianBigMac','EAB_nestGuardianStomper','EAB_nestGuardianLauncher','EAB_nestGuardianMyriad','EAB_nestGuardianMolotov','EAB_nestGuardianCatapult','EAB_nestGuardianHyperTwister']);
    _safeSet('roguePalisade',  'UPGRADES_TIER_0', ['EAB_roguePalisadeMegaSpawner','EAB_roguePalisadeHoncho','EAB_roguePalisadeDoper','EAB_roguePalisadeBuilder','EAB_roguePalisadeMech','EAB_rogueFortressConstructor','EAB_rogueFortressBlockade','EAB_rogueFortressBarrier']);
    _safeSet('rogueArmada',    'UPGRADES_TIER_0', ['EAB_rogueArmadaBoomstick','EAB_rogueArmadaPumper','EAB_rogueArmadaConstructor','EAB_rogueCycloneVortex','EAB_rogueCycloneGale']);
    _safeSet('bob',            'UPGRADES_TIER_0', ['EAB_megaBob','EAB_bobby','EAB_autoBob','EAB_hob','EAB_rupert','EAB_cosmicRammerNova','EAB_cosmicRammerPulsar']);
    _safeSet('nemesis',        'UPGRADES_TIER_0', ['EAB_megaNemesis','EAB_antagonist','EAB_autoNemesis','EAB_rival','EAB_bandit']);

    console.log('[EAB] Extended Armsrace Bosses loaded!');
    console.log('[EAB] Total new classes: Elite×45 | Mystical×15 | Nester×21 | Rogue×14 | Rammer×12 | Terrestrial×3');
};