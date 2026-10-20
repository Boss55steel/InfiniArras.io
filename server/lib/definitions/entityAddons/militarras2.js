// ============================================================
//  MILITARRAS II — New Tank Variants
//  Companion addon for militarras.js
//  All classes use _MR2 suffix — zero collisions
//  Requires: militarras.js loaded first (uses its base classes)
// ============================================================

const { combineStats } = require('../facilitators.js');
const _constants = require('../constants.js');
const { base } = _constants;
const g = require('../gunvals.js');

const safeCS = stats => combineStats(stats.filter(s => s != null));

// ── Gunval shims ─────────────────────────────────────────────────────────────
if (!g.flankGuard)  g.flankGuard  = { reload:0.85, recoil:0.85 };
if (!g.pounder)     g.pounder     = { reload:1.5, recoil:1.4, speed:0.65, maxSpeed:0.65, size:1.25, damage:1.5 };
if (!g.destroyer)   g.destroyer   = { reload:2, recoil:2, speed:0.55, maxSpeed:0.55, size:1.5, damage:2, pen:1.6 };
if (!g.annihilator) g.annihilator = { reload:2.5, recoil:3, speed:0.45, maxSpeed:0.45, size:2, damage:2.5, pen:2 };
if (!g.assassin)    g.assassin    = { speed:1.6, maxSpeed:1.6, reload:0.55, recoil:0 };
if (!g.hunter)      g.hunter      = { speed:1.4, maxSpeed:1.4, reload:0.6, pen:1.1 };
if (!g.hunterSecondary) g.hunterSecondary = { size:0.6, damage:0.6, reload:0.5 };
if (!g.artillery)   g.artillery   = { reload:1.8, spray:2, size:1.2, damage:1.4 };
if (!g.skimmer)     g.skimmer     = { reload:2, recoil:1, speed:0.8, maxSpeed:0.8 };

// ── Shared shapes ─────────────────────────────────────────────────────────────
const TANK_SHAPE  = 'M -1 -1 H 0 C 1 -1 1 0 1 0 C 1 0 1 1 0 1 H -1 V -1';
const HELI_SHAPE  = 'M -1 -1 C 1.5 -1.2 1.5 -1.2 1.5 -1.2 C 3.7 0 3.7 0 3.7 0 C 3.7 0 1.5 1.2 1.5 1.2 C -1 1 -1 1 -1 1 V -1 C -1 -1 -4 -0.2 -4 -0.2 C -4.7 -1 -4.7 -1 -4.7 -1 C -4.7 -0.3333 -4.7 0.3333 -4.7 1 C -4 0.2 -4 0.2 -4 0.2 C -4 0.2 -1 1 -1 1';
const JET_SHAPE   = 'M -1 -1 C 1 -1 1 -1 1 -1 C 2.7 -0.7 2.7 0.7 1 1 C -1 1 -0.9 1 -1 1 V -1 C -2.2 -0.5 -2.5 -0.3 -4 -0.2 C -4 -0.2 -4.3 -0.2 -4.3 -1 C -4.7 -1 -4.7 -1 -4.7 -1 C -4.7 -0.3333 -4.7 0.3333 -4.7 1 C -4.5667 1 -4.4333 1 -4.3 1 C -4.3 0.2 -4 0.2 -4 0.2 C -2.5 0.3 -2.3 0.4 -1 1';

// ── Standard tank turret stack (inner rings + body/tracks) ────────────────────
const stdTurrets = (bodyColor) => ([
    { POSITION:[15,0,0,0,360,1], TYPE:['latTop',{COLOR:'darkGrey'}] },
    { POSITION:[10,0,0,0,360,1], TYPE:['latTop',{COLOR:'grey'}] },
    { POSITION:[35,0,0,0,360,0], TYPE:['TankBase',{COLOR: bodyColor||'mirror'}] },
]);
// Kris-style (krisButTank body)
const krisTurrets = (bodyColor) => ([
    { POSITION:[15,0,0,0,360,1], TYPE:['krisTankTop',{COLOR:'darkGrey'}] },
    { POSITION:[10,0,0,0,360,1], TYPE:['krisTankTop',{COLOR:'grey'}] },
    { POSITION:[35,0,0,0,360,0], TYPE:['krisTankBase',{COLOR: bodyColor||'mirror'}] },
]);
// Electric-style
const elecTurrets = (bodyColor) => ([
    { POSITION:[15,0,0,0,360,1], TYPE:['electricTankTop',{COLOR:'darkGrey'}] },
    { POSITION:[10,0,0,0,360,1], TYPE:['electricTankTop',{COLOR:'grey'}] },
    { POSITION:[35,0,0,0,360,0], TYPE:['electricTankBase',{COLOR: bodyColor||'mirror'}] },
]);
// Heli standard turrets
const heliTurrets = () => ([
    { POSITION:[20,1,0,0,360,1],   TYPE:['HeliDeco1',{COLOR:'#42b4ec'}] },
    { POSITION:[24,1,0,0,360,1],   TYPE:['HeliDeco2'] },
    { POSITION:[20,-4,0,0,360,1],  TYPE:['HeliDeco3'] },
    { POSITION:[20,-36,0,0,360,1], TYPE:['HeliDeco4'] },
    { POSITION:[22,0,0,0,360,0],   TYPE:['HeliDeco5'] },
    { POSITION:[18,0,0,0,360,1],   TYPE:['HeliDeco5'] },
    { POSITION:[20,1,0,0,360,1],   TYPE:['HeliDeco6'] },
    { POSITION:[15,0,0,0,360,1],   TYPE:['attackPropeller',{COLOR:'darkGrey'}] },
]);

// ── Standard 5mm rapid gun ────────────────────────────────────────────────────
const mmGun = (x, y, delay) => ({
    POSITION:[40,3,1.3,-2,y||0,0,delay||0],
    PROPERTIES:{ SHOOT_SETTINGS:safeCS([g.basic,{reload:0.1,damage:0.015,speed:20,shudder:0,spray:0}]), TYPE:'tank5mmRound' },
});
// Wide barrel housing
const barrelGun = (len, wid, y, color) => ({
    POSITION:[len,wid,1,0,y||0,0,0],
    PROPERTIES:{ COLOR:color||'darkGrey' },
});
// Main cannon shot
const cannonGun = (x, y, delay, extraStats) => ({
    POSITION:[12,8,1.3,x||30,y||0,0,delay||0],
    PROPERTIES:{
        SHOOT_SETTINGS:safeCS([g.basic,{reload:3,damage:1.2,shudder:0.5},...(extraStats||[])]),
        TYPE:'developerBullet',
    },
});
// Tip cap
const tipGun = (x, w, y) => ({ POSITION:[2,w||9,1,x||34,y||0,0,0] });

module.exports = ({ Class }) => {
    console.log('[militarras2] Loading new variants...');

// ════════════════════════════════════════════════════════════════════════════
//  NEW TANK VARIANTS (genericActualTank)
// ════════════════════════════════════════════════════════════════════════════

    // TTV3 — Triple Cannon: 3 independently-angled big guns ──────────────────
    Class.TTV3_MR2 = {
        PARENT:'genericActualTank', LABEL:'TT V3', DANGER:6, HAS_NO_RECOIL:true,
        BODY:{ HEALTH:base.HEALTH*1.3 },
        SHAPE: TANK_SHAPE,
        GUNS:[
            barrelGun(30,5,5), {POSITION:[4,5,-1.4,8,5,0,0]},
            cannonGun(30,5,0,[g.twin]),
            tipGun(34,9,5),
            barrelGun(30,5,-5), {POSITION:[4,5,-1.4,8,-5,0,0]},
            cannonGun(30,-5,0.33,[g.twin]),
            tipGun(34,9,-5),
            barrelGun(34,6,0,'#444'), {POSITION:[4,6,-1.5,8,0,0,0]},
            cannonGun(33,0,0.66,[g.pounder,{damage:1.5}]),
            tipGun(38,11,0),
        ],
        TURRETS:[ ...stdTurrets('mirror'),
            { POSITION:[12,0,0,0,360,1], TYPE:['tankAutoTurret1',{COLOR:'darkGrey'}] },
        ],
    };

    // TTV4 — Quad Machinegun: four rapid-fire 5mm staggered ──────────────────
    Class.TTV4_MR2 = {
        PARENT:'genericActualTank', LABEL:'TT V4', DANGER:6, HAS_NO_RECOIL:true,
        BODY:{ HEALTH:base.HEALTH*1.1, SPEED:base.SPEED*1.1 },
        SHAPE: TANK_SHAPE,
        GUNS:[
            {POSITION:[30,5,1,0,8,0,0]},  {POSITION:[4,5,-1.4,8,8,0,0]},
            mmGun(30,8,0), tipGun(34,9,8),
            {POSITION:[30,5,1,0,3,0,0]},  {POSITION:[4,5,-1.4,8,3,0,0]},
            mmGun(30,3,0.25), tipGun(34,9,3),
            {POSITION:[30,5,1,0,-3,0,0]}, {POSITION:[4,5,-1.4,8,-3,0,0]},
            mmGun(30,-3,0.5), tipGun(34,9,-3),
            {POSITION:[30,5,1,0,-8,0,0]}, {POSITION:[4,5,-1.4,8,-8,0,0]},
            mmGun(30,-8,0.75), tipGun(34,9,-8),
        ],
        TURRETS:stdTurrets('#4a4a4a'),
    };

    // TTV5 — Heavy Artillery: slow, massive single shot ──────────────────────
    Class.TTV5_MR2 = {
        PARENT:'genericActualTank', LABEL:'TT V5 Artillery', DANGER:6, HAS_NO_RECOIL:true,
        BODY:{ HEALTH:base.HEALTH*1.5, SPEED:base.SPEED*0.75 },
        SHAPE: TANK_SHAPE,
        GUNS:[
            {POSITION:[36,18,1,0,0,0,0], PROPERTIES:{COLOR:'#333'}},
            {POSITION:[28,15,-1.3,0,0,0,0], PROPERTIES:{COLOR:'#555'}},
            {POSITION:[14,18,1.3,36,0,0,0],
             PROPERTIES:{ SHOOT_SETTINGS:safeCS([g.basic,g.pounder,g.artillery,{reload:5,damage:2.5,size:1.8,shudder:0.3}]),
               TYPE:'developerBullet' }},
            {POSITION:[3,22,1,38,0,0,0]},
        ],
        TURRETS:[ ...stdTurrets('#333'),
            { POSITION:[14,0,0,0,360,1], TYPE:['tankAutoTurret2',{COLOR:'grey'}] },
        ],
    };

    // AAATANK — Anti-Air: angled up-spread, shoots flak ──────────────────────
    Class.AAATANK_MR2 = {
        PARENT:'genericActualTank', LABEL:'A.A. Tank', DANGER:6, HAS_NO_RECOIL:true,
        BODY:{ HEALTH:base.HEALTH*1.1 },
        SHAPE: TANK_SHAPE,
        GUNS:[
            ...[-30,-15,0,15,30].flatMap((angle,i)=>[
                {POSITION:[28,4,1,0,0,angle,0], PROPERTIES:{COLOR:'darkGrey'}},
                {POSITION:[34,3,1,0,0,angle,i/5],
                 PROPERTIES:{ SHOOT_SETTINGS:safeCS([g.basic,{reload:0.35,damage:0.6,speed:18,spray:3,size:0.7}]),
                   TYPE:'tank5mmRound' }},
            ]),
        ],
        TURRETS:[ ...stdTurrets('#4a6040'),
            { POSITION:[12,0,0,0,360,1], TYPE:['tankAutoTurret3',{COLOR:'darkGrey'}] },
        ],
    };

    // SNIPERTANK — Extreme Range: single ultra-long barrel ───────────────────
    Class.SniperTank_MR2 = {
        PARENT:'genericActualTank', LABEL:'Sniper Tank', DANGER:6, HAS_NO_RECOIL:true,
        BODY:{ HEALTH:base.HEALTH*1.0, FOV:base.FOV*1.8 },
        SHAPE: TANK_SHAPE,
        GUNS:[
            {POSITION:[50,10,1,0,0,0,0], PROPERTIES:{COLOR:'#222'}},
            {POSITION:[42,8,-1.2,0,0,0,0], PROPERTIES:{COLOR:'#444'}},
            {POSITION:[20,10,1.3,48,0,0,0],
             PROPERTIES:{ SHOOT_SETTINGS:safeCS([g.basic,g.sniper,g.assassin,{reload:2.5,damage:2.2,speed:25,range:4,spray:0}]),
               TYPE:'developerBullet' }},
            {POSITION:[3,14,1,54,0,0,0]},
            {POSITION:[8,3,1,0,5,0,0], PROPERTIES:{COLOR:'darkGrey'}},
            {POSITION:[8,3,1,0,-5,0,0], PROPERTIES:{COLOR:'darkGrey'}},
        ],
        TURRETS:stdTurrets('#2a2a2a'),
    };

    // DESTROYERTANK — Dual Destroyers: two massive slugs ─────────────────────
    Class.DestroyerTank_MR2 = {
        PARENT:'genericActualTank', LABEL:'Destroyer Tank', DANGER:6, HAS_NO_RECOIL:true,
        BODY:{ HEALTH:base.HEALTH*1.4, SPEED:base.SPEED*0.85 },
        SHAPE: TANK_SHAPE,
        GUNS:[
            {POSITION:[28,16,1,0,7,0,0], PROPERTIES:{COLOR:'#2a2a2a'}},
            {POSITION:[22,14,-1.2,0,7,0,0], PROPERTIES:{COLOR:'#444'}},
            {POSITION:[14,16,1.3,28,7,0,0],
             PROPERTIES:{ SHOOT_SETTINGS:safeCS([g.basic,g.pounder,g.destroyer,{reload:4,damage:2.8,size:1.8,shudder:0.2}]),
               TYPE:'developerBullet' }},
            {POSITION:[3,20,1,32,7,0,0]},
            {POSITION:[28,16,1,0,-7,0,0], PROPERTIES:{COLOR:'#2a2a2a'}},
            {POSITION:[22,14,-1.2,0,-7,0,0], PROPERTIES:{COLOR:'#444'}},
            {POSITION:[14,16,1.3,28,-7,0.5],
             PROPERTIES:{ SHOOT_SETTINGS:safeCS([g.basic,g.pounder,g.destroyer,{reload:4,damage:2.8,size:1.8,shudder:0.2}]),
               TYPE:'developerBullet' }},
            {POSITION:[3,20,1,32,-7,0,0]},
        ],
        TURRETS:stdTurrets('#222'),
    };

    // MORTAR — Slow arcing shell with huge splash ─────────────────────────────
    Class.Mortar_MR2 = {
        PARENT:'genericActualTank', LABEL:'Mortar', DANGER:6, HAS_NO_RECOIL:true,
        BODY:{ HEALTH:base.HEALTH*1.2, SPEED:base.SPEED*0.7 },
        SHAPE: TANK_SHAPE,
        GUNS:[
            {POSITION:[20,22,1,0,0,30,0], PROPERTIES:{COLOR:'#3a3a3a'}},
            {POSITION:[12,22,1.3,22,0,30,0],
             PROPERTIES:{ SHOOT_SETTINGS:safeCS([g.basic,g.artillery,{reload:4,damage:2,size:2.2,spray:6,speed:0.8,shudder:0.4}]),
               TYPE:'developerBullet' }},
            {POSITION:[3,25,1,25,0,30,0]},
        ],
        TURRETS:[ ...stdTurrets('#444'),
            { POSITION:[10,0,0,0,360,1], TYPE:['tankAutoTurret1',{COLOR:'grey'}] },
        ],
    };

    // RAILGUN — One instant-kill penetrating slug ─────────────────────────────
    Class.Railgun_MR2 = {
        PARENT:'genericActualTank', LABEL:'Railgun', DANGER:6, HAS_NO_RECOIL:true,
        BODY:{ HEALTH:base.HEALTH*1.0, FOV:base.FOV*1.5 },
        SHAPE: TANK_SHAPE,
        GUNS:[
            {POSITION:[46,6,1,0,0,0,0], PROPERTIES:{COLOR:'#1a1aff'}},
            {POSITION:[40,4,-1.0,0,0,0,0], PROPERTIES:{COLOR:'#3333aa'}},
            {POSITION:[20,6,1.3,44,0,0,0],
             PROPERTIES:{ SHOOT_SETTINGS:safeCS([g.basic,g.sniper,{reload:4,damage:4,pen:5,speed:30,range:6,spray:0,size:0.5}]),
               TYPE:'railgunShot' }},
            {POSITION:[3,10,1,50,0,0,0]},
            {POSITION:[8,2,1,0,4,0,0], PROPERTIES:{COLOR:'#1a1aff'}},
            {POSITION:[8,2,1,0,-4,0,0], PROPERTIES:{COLOR:'#1a1aff'}},
        ],
        TURRETS:stdTurrets('#0a0a44'),
    };

    // FLAMECASTER — Rapid short-range burnout barrage ─────────────────────────
    Class.Flamecaster_MR2 = {
        PARENT:'genericActualTank', LABEL:'Flamecaster', DANGER:6, HAS_NO_RECOIL:true,
        BODY:{ HEALTH:base.HEALTH*1.1 },
        SHAPE: TANK_SHAPE,
        GUNS:[
            ...[-10,-5,0,5,10].flatMap((y,i)=>[
                {POSITION:[24,6+Math.abs(y)*0.5,1,0,y,0,0], PROPERTIES:{COLOR:'#662200'}},
                {POSITION:[12,6+Math.abs(y)*0.5,1.2,24,y,0,i*0.08],
                 PROPERTIES:{ SHOOT_SETTINGS:safeCS([g.basic,{reload:0.15,damage:0.4,speed:8,range:0.25,size:1.5,spray:8}]),
                   TYPE:'developerBullet' }},
            ]),
        ],
        TURRETS:stdTurrets('#661100'),
    };

    // PHALANX — Six rapid-fire stacked barrels ────────────────────────────────
    Class.Phalanx_MR2 = {
        PARENT:'genericActualTank', LABEL:'Phalanx', DANGER:6, HAS_NO_RECOIL:true,
        BODY:{ HEALTH:base.HEALTH*1.1 },
        SHAPE: TANK_SHAPE,
        GUNS:[
            ...[-12,-7,-2,2,7,12].flatMap((y,i)=>[
                {POSITION:[26,4,1,0,y,0,0], PROPERTIES:{COLOR:'darkGrey'}},
                mmGun(26,y,i/6),
            ]),
            {POSITION:[2,20,1,28,0,0,0]},
        ],
        TURRETS:stdTurrets('#555'),
    };

    // SIEGE — Stationary fortress, triple auto turrets + huge cannon ──────────
    Class.SiegeTank_MR2 = {
        PARENT:'genericActualTank', LABEL:'Siege Tank', DANGER:6, HAS_NO_RECOIL:true,
        BODY:{ HEALTH:base.HEALTH*2.0, SPEED:base.SPEED*0.4, DENSITY:base.DENSITY*2 },
        SHAPE: TANK_SHAPE,
        GUNS:[
            {POSITION:[38,20,1,0,0,0,0], PROPERTIES:{COLOR:'#222'}},
            {POSITION:[30,17,-1.2,0,0,0,0], PROPERTIES:{COLOR:'#444'}},
            {POSITION:[15,20,1.3,40,0,0,0],
             PROPERTIES:{ SHOOT_SETTINGS:safeCS([g.basic,g.pounder,{reload:6,damage:3.5,size:2.5,shudder:0.2,pen:2}]),
               TYPE:'developerBullet' }},
            {POSITION:[3,24,1,44,0,0,0]},
        ],
        TURRETS:[ ...stdTurrets('#1a1a1a'),
            { POSITION:[18,0,0,0,360,1], TYPE:['tankAutoTurret4',{COLOR:'darkGrey'}] },
            { POSITION:[12,0,0,0,360,1], TYPE:['tankAutoTurret3',{COLOR:'grey'}] },
            { POSITION:[7,0,0,0,360,1],  TYPE:['tankAutoTurret1',{COLOR:'#555'}] },
        ],
    };

    // ELECTRIC TESLA — Zap cannon with electric aesthetics ───────────────────
    Class.TeslaTank_MR2 = {
        PARENT:'genericActualTank', LABEL:'Tesla Tank', DANGER:6, HAS_NO_RECOIL:true,
        BODY:{ HEALTH:base.HEALTH*1.1 },
        SHAPE: TANK_SHAPE,
        GUNS:[
            {POSITION:[32,8,1,0,4,0,0], PROPERTIES:{COLOR:'#0055ff'}},
            {POSITION:[32,8,1,0,-4,0,0], PROPERTIES:{COLOR:'#0055ff'}},
            {POSITION:[14,8,1.3,32,4,0,0],
             PROPERTIES:{ SHOOT_SETTINGS:safeCS([g.basic,{reload:0.6,damage:1.0,speed:12,spray:4,pen:1.5,size:0.8}]),
               TYPE:'developerBullet' }},
            {POSITION:[14,8,1.3,32,-4,0,0.3],
             PROPERTIES:{ SHOOT_SETTINGS:safeCS([g.basic,{reload:0.6,damage:1.0,speed:12,spray:4,pen:1.5,size:0.8}]),
               TYPE:'developerBullet' }},
            {POSITION:[3,12,1,36,0,0,0]},
        ],
        TURRETS:[ ...elecTurrets('#0011aa'),
            { POSITION:[12,0,0,0,360,1], TYPE:['electricTankDeco1',{COLOR:'#0033ff'}] },
        ],
    };

    // KRIS BREACHER — Kris-style tank with dual assault barrels ──────────────
    Class.KrisBreacher_MR2 = {
        PARENT:'genericActualTank', LABEL:'Kris Breacher', DANGER:6, HAS_NO_RECOIL:true,
        BODY:{ HEALTH:base.HEALTH*1.2 },
        SHAPE: TANK_SHAPE,
        GUNS:[
            {POSITION:[32,6,1,0,5,0,0], PROPERTIES:{COLOR:'darkGrey'}},
            {POSITION:[4,6,-1.4,8,5,0,0]},
            cannonGun(30,5,0,[g.twin,{damage:1.4}]),
            tipGun(36,9,5),
            {POSITION:[32,6,1,0,-5,0,0], PROPERTIES:{COLOR:'darkGrey'}},
            {POSITION:[4,6,-1.4,8,-5,0,0]},
            cannonGun(30,-5,0.4,[g.twin,{damage:1.4}]),
            tipGun(36,9,-5),
            {POSITION:[20,6,1,0,0,0,0], PROPERTIES:{COLOR:'#555'}},
            mmGun(20,0,0.7),
        ],
        TURRETS:[ ...krisTurrets('mirror'),
            { POSITION:[12,0,0,0,360,1], TYPE:['krisTankTurret1',{COLOR:'grey'}] },
        ],
    };

    // DAZE MK2 — Enhanced Daze with flank defense ─────────────────────────────
    Class.DazeMK2_MR2 = {
        PARENT:'Daze', LABEL:'Daze Mk.II', DANGER:7,
        BODY:{ HEALTH:base.HEALTH*1.4, SPEED:base.SPEED*0.9 },
        TURRETS:[
            { POSITION:[20,0,0,0,360,0], TYPE:['autoLatBase',{COLOR:'darkGrey'}] },
            { POSITION:[15,0,0,0,360,1], TYPE:['latTop',{COLOR:'darkGrey'}] },
            { POSITION:[10,0,0,0,360,1], TYPE:['latTop',{COLOR:'grey'}] },
            { POSITION:[35,0,0,0,360,0], TYPE:['TankBase',{COLOR:'#5a4a3a'}] },
            { POSITION:[18,0,0,90,360,1],  TYPE:['tankAutoTurret3',{COLOR:'grey'}] },
            { POSITION:[18,0,0,270,360,1], TYPE:['tankAutoTurret3',{COLOR:'grey'}] },
        ],
    };

    // HAGU MK2 — Artillery fortress upgrade ───────────────────────────────────
    Class.HAGUMK2_MR2 = {
        PARENT:'HAGU', LABEL:'H.A.G.U Mk.II', DANGER:7,
        BODY:{ HEALTH:base.HEALTH*500, SPEED:base.SPEED*0.05 },
        TURRETS:[
            { POSITION:[20,0,0,0,360,0],   TYPE:['autoLatBase',{COLOR:'#96794E'}] },
            { POSITION:[15,0,0,0,360,1],   TYPE:['latTop',{COLOR:'#5C533F'}] },
            { POSITION:[10,0,0,0,360,1],   TYPE:['latTop',{COLOR:'#736245'}] },
            { POSITION:[5,0,0,0,360,1],    TYPE:['latTop'] },
            { POSITION:[35,0,0,0,360,0],   TYPE:['autoLatBase',{COLOR:'#96794E'}] },
            { POSITION:[18,0,0,45,360,1],  TYPE:['tankAutoTurret5',{COLOR:'darkGrey'}] },
            { POSITION:[18,0,0,135,360,1], TYPE:['tankAutoTurret5',{COLOR:'darkGrey'}] },
            { POSITION:[18,0,0,225,360,1], TYPE:['tankAutoTurret5',{COLOR:'darkGrey'}] },
            { POSITION:[18,0,0,315,360,1], TYPE:['tankAutoTurret5',{COLOR:'darkGrey'}] },
        ],
    };

// ════════════════════════════════════════════════════════════════════════════
//  NEW HELICOPTER VARIANTS (genericActualHeli)
// ════════════════════════════════════════════════════════════════════════════

    // HELLFIRE RAIDER — Rocket-heavy raider with more launch tubes ────────────
    Class.HellfireRaider_MR2 = {
        PARENT:'genericActualHeli', LABEL:'Hellfire Raider', DANGER:6,
        LAYER:29, HAS_NO_RECOIL:true, SIZE:12,
        INTANGIBLE:true, IGNORE_COLLISION:true,
        SHAPE: HELI_SHAPE,
        GUNS:[
            {POSITION:[32,14,1,0,-10,0,0], PROPERTIES:{COLOR:'darkGrey'}},
            {POSITION:[36,4,1,0,-14,0,0],  PROPERTIES:{ SHOOT_SETTINGS:safeCS([g.basic,{reload:0.1,damage:0.015,speed:20,shudder:0,spray:0}]), TYPE:'tank5mmRound' }},
            {POSITION:[36,4,1,0,-10,0,0.2],PROPERTIES:{ SHOOT_SETTINGS:safeCS([g.basic,{reload:0.1,damage:0.015,speed:20,shudder:0,spray:0}]), TYPE:'tank5mmRound' }},
            {POSITION:[36,4,1,0,-6,0,0.4], PROPERTIES:{ SHOOT_SETTINGS:safeCS([g.basic,{reload:0.1,damage:0.015,speed:20,shudder:0,spray:0}]), TYPE:'tank5mmRound' }},
            {POSITION:[24,8,1,0,-18,0,0],
             PROPERTIES:{ SHOOT_SETTINGS:safeCS([g.basic,g.skimmer,{reload:3,damage:2,speed:1.5,size:1.5}]), TYPE:'flankMissile' }},
            {POSITION:[24,8,1,0,-14,0,0.5],
             PROPERTIES:{ SHOOT_SETTINGS:safeCS([g.basic,g.skimmer,{reload:3,damage:2,speed:1.5,size:1.5}]), TYPE:'homingflankMissile' }},
            {POSITION:[2,15,1,30,0,0,0]},
            // Mirror side
            {POSITION:[32,14,1,0,10,0,0], PROPERTIES:{COLOR:'darkGrey'}},
            {POSITION:[36,4,1,0,14,0,0],  PROPERTIES:{ SHOOT_SETTINGS:safeCS([g.basic,{reload:0.1,damage:0.015,speed:20,shudder:0,spray:0}]), TYPE:'tank5mmRound' }},
            {POSITION:[36,4,1,0,10,0,0.2],PROPERTIES:{ SHOOT_SETTINGS:safeCS([g.basic,{reload:0.1,damage:0.015,speed:20,shudder:0,spray:0}]), TYPE:'tank5mmRound' }},
            {POSITION:[36,4,1,0,6,0,0.4], PROPERTIES:{ SHOOT_SETTINGS:safeCS([g.basic,{reload:0.1,damage:0.015,speed:20,shudder:0,spray:0}]), TYPE:'tank5mmRound' }},
            {POSITION:[24,8,1,0,18,0,0],
             PROPERTIES:{ SHOOT_SETTINGS:safeCS([g.basic,g.skimmer,{reload:3,damage:2,speed:1.5,size:1.5}]), TYPE:'flankMissile' }},
            {POSITION:[24,8,1,0,14,0,0.5],
             PROPERTIES:{ SHOOT_SETTINGS:safeCS([g.basic,g.skimmer,{reload:3,damage:2,speed:1.5,size:1.5}]), TYPE:'homingflankMissile' }},
            {POSITION:[2,15,1,30,0,0,0]},
        ],
        TURRETS:heliTurrets(),
    };

    // THUNDERHAWK — Ultra-fast close-air-support heli ─────────────────────────
    Class.Thunderhawk_MR2 = {
        PARENT:'genericActualHeli', LABEL:'Thunderhawk', DANGER:6,
        LAYER:29, HAS_NO_RECOIL:true, SIZE:12,
        INTANGIBLE:true, IGNORE_COLLISION:true,
        BODY:{ SPEED:base.SPEED*1.3 },
        SHAPE: HELI_SHAPE,
        GUNS:[
            ...[-6,-2,2,6].flatMap((y,i)=>[
                {POSITION:[38,3,1,0,y,0,0], PROPERTIES:{COLOR:'darkGrey'}},
                {POSITION:[42,3,1,0,y,0,i*0.1], PROPERTIES:{ SHOOT_SETTINGS:safeCS([g.basic,{reload:0.08,damage:0.012,speed:22,shudder:0,spray:0}]), TYPE:'tank5mmRound' }},
            ]),
            {POSITION:[26,10,1,0,-15,0,0],
             PROPERTIES:{ SHOOT_SETTINGS:safeCS([g.basic,g.skimmer,{reload:2,damage:1.8}]), TYPE:'volatileShells' }},
            {POSITION:[26,10,1,0,15,0,0.5],
             PROPERTIES:{ SHOOT_SETTINGS:safeCS([g.basic,g.skimmer,{reload:2,damage:1.8}]), TYPE:'volatileShells' }},
            {POSITION:[2,18,1,30,0,0,0]},
        ],
        TURRETS:heliTurrets(),
    };

    // SPECTRE GUNSHIP — Stealth heli with silenced weapons ────────────────────
    Class.SpectreGunship_MR2 = {
        PARENT:'genericActualHeli', LABEL:'Spectre Gunship', DANGER:6,
        LAYER:29, HAS_NO_RECOIL:true, SIZE:12,
        INTANGIBLE:true, IGNORE_COLLISION:true,
        BODY:{ FOV:base.FOV*1.4 },
        SHAPE: HELI_SHAPE,
        GUNS:[
            {POSITION:[40,8,1,0,-8,0,0], PROPERTIES:{COLOR:'#333'}},
            {POSITION:[46,6,1,0,-8,0,0], PROPERTIES:{ SHOOT_SETTINGS:safeCS([g.basic,g.assassin,g.sniper,{reload:2,damage:1.8,spray:0,speed:22}]), TYPE:'developerBullet' }},
            {POSITION:[3,12,1,46,-8,0,0]},
            {POSITION:[40,8,1,0,8,0,0], PROPERTIES:{COLOR:'#333'}},
            {POSITION:[46,6,1,0,8,0,0.5], PROPERTIES:{ SHOOT_SETTINGS:safeCS([g.basic,g.assassin,g.sniper,{reload:2,damage:1.8,spray:0,speed:22}]), TYPE:'developerBullet' }},
            {POSITION:[3,12,1,46,8,0,0]},
            {POSITION:[2,15,1,30,0,0,0]},
        ],
        TURRETS:heliTurrets(),
    };

    // COBRA — Light attack heli, speed + rapid cannons ─────────────────────────
    Class.Cobra_MR2 = {
        PARENT:'genericActualHeli', LABEL:'Cobra', DANGER:6,
        LAYER:29, HAS_NO_RECOIL:true, SIZE:12,
        INTANGIBLE:true, IGNORE_COLLISION:true,
        BODY:{ SPEED:base.SPEED*1.5, HEALTH:base.HEALTH*0.85 },
        SHAPE: HELI_SHAPE,
        GUNS:[
            {POSITION:[34,6,1,0,-5,0,0], PROPERTIES:{COLOR:'darkGrey'}},
            {POSITION:[34,6,1,0,5,0,0], PROPERTIES:{COLOR:'darkGrey'}},
            {POSITION:[38,4,1,0,-5,0,0], PROPERTIES:{ SHOOT_SETTINGS:safeCS([g.basic,g.twin,{reload:0.5,damage:0.8,speed:16}]), TYPE:'developerBullet' }},
            {POSITION:[38,4,1,0,5,0,0.3], PROPERTIES:{ SHOOT_SETTINGS:safeCS([g.basic,g.twin,{reload:0.5,damage:0.8,speed:16}]), TYPE:'developerBullet' }},
            {POSITION:[20,8,1,0,-14,0,0],
             PROPERTIES:{ SHOOT_SETTINGS:safeCS([g.basic,g.skimmer,{reload:2.5,damage:1.6}]), TYPE:'homingflankMissile' }},
            {POSITION:[20,8,1,0,14,0,0.5],
             PROPERTIES:{ SHOOT_SETTINGS:safeCS([g.basic,g.skimmer,{reload:2.5,damage:1.6}]), TYPE:'homingflankMissile' }},
            {POSITION:[2,12,1,26,0,0,0]},
        ],
        TURRETS:heliTurrets(),
    };

// ════════════════════════════════════════════════════════════════════════════
//  NEW JET VARIANTS (genericActualJet)
// ════════════════════════════════════════════════════════════════════════════

    // FIRESTRIKE — Fast attack jet with 6-barrel spread + missiles ────────────
    Class.Firestrike_MR2 = {
        PARENT:'genericActualJet', LABEL:'Firestrike', DANGER:6,
        BODY:{ HEALTH:base.HEALTH*1.0, SPEED:base.SPEED*1.3 },
        LAYER:29, HAS_NO_RECOIL:true, SIZE:12,
        INTANGIBLE:true, IGNORE_COLLISION:true,
        SHAPE: JET_SHAPE,
        GUNS:[
            ...[-8,-4,0,4,8].flatMap((y,i)=>[
                {POSITION:[38,3,1,0,y,0,0], PROPERTIES:{COLOR:'darkGrey'}},
                {POSITION:[42,3,1,0,y,0,i*0.1], PROPERTIES:{ SHOOT_SETTINGS:safeCS([g.basic,{reload:0.1,damage:0.015,speed:20,shudder:0,spray:0}]), TYPE:'tank5mmRound' }},
            ]),
            {POSITION:[28,8,1,0,-16,0,0],
             PROPERTIES:{ SHOOT_SETTINGS:safeCS([g.basic,g.skimmer,{reload:3,damage:1.8}]), TYPE:'flankMissile' }},
            {POSITION:[28,8,1,0,16,0,0.5],
             PROPERTIES:{ SHOOT_SETTINGS:safeCS([g.basic,g.skimmer,{reload:3,damage:1.8}]), TYPE:'flankMissile' }},
        ],
        TURRETS:[
            { POSITION:[1,0,0,0,360,0], TYPE:['JetAimer',{COLOR:'grey',SHAPE:JET_SHAPE}] },
            { POSITION:[21,0,0,0,360,0], TYPE:['VulcanBase',{COLOR:'mirror'}] },
        ],
    };

    // NIGHTSTALKER — Long-range stealth interceptor ───────────────────────────
    Class.NightStalker_MR2 = {
        PARENT:'genericActualJet', LABEL:'Nightstalker', DANGER:6,
        BODY:{ HEALTH:base.HEALTH*1.0, FOV:base.FOV*1.6 },
        LAYER:29, HAS_NO_RECOIL:true, SIZE:12,
        INTANGIBLE:true, IGNORE_COLLISION:true,
        SHAPE: JET_SHAPE,
        GUNS:[
            {POSITION:[48,8,1,0,-5,0,0], PROPERTIES:{COLOR:'#1a1a2a'}},
            {POSITION:[54,6,1,0,-5,0,0], PROPERTIES:{ SHOOT_SETTINGS:safeCS([g.basic,g.assassin,g.sniper,{reload:3,damage:3,speed:28,spray:0,pen:2}]), TYPE:'developerBullet' }},
            {POSITION:[3,12,1,56,-5,0,0]},
            {POSITION:[48,8,1,0,5,0,0], PROPERTIES:{COLOR:'#1a1a2a'}},
            {POSITION:[54,6,1,0,5,0,0.5], PROPERTIES:{ SHOOT_SETTINGS:safeCS([g.basic,g.assassin,g.sniper,{reload:3,damage:3,speed:28,spray:0,pen:2}]), TYPE:'developerBullet' }},
            {POSITION:[3,12,1,56,5,0,0]},
        ],
        TURRETS:[
            { POSITION:[1,0,0,0,360,0], TYPE:['StealthBomberAimer',{COLOR:'#1a1a2a',SHAPE:JET_SHAPE}] },
            { POSITION:[21,0,0,0,360,0], TYPE:['StealthJetBase',{COLOR:'#111122'}] },
        ],
    };

    // MEGABOMBER — Carpet-bomb ultra bomber ───────────────────────────────────
    Class.MegaBomber_MR2 = {
        PARENT:'genericActualJet', LABEL:'Mega Bomber', DANGER:6,
        BODY:{ HEALTH:base.HEALTH*1.5, SPEED:base.SPEED*0.75 },
        LAYER:29, HAS_NO_RECOIL:true, SIZE:12,
        INTANGIBLE:true, IGNORE_COLLISION:true,
        SHAPE: JET_SHAPE,
        GUNS:[
            ...[-20,-14,-8,-2,4,10,16,22].map((y,i)=>({
                POSITION:[14,8,1,0,y,0,i*0.1],
                PROPERTIES:{ SHOOT_SETTINGS:safeCS([g.basic,g.artillery,{reload:3,damage:2,size:1.6,speed:0.6,spray:2}]),
                    TYPE:'BomberShells', STAT_CALCULATOR:'sustained' },
            })),
        ],
        TURRETS:[
            { POSITION:[1,0,0,0,360,0],  TYPE:['StealthBomberAimer',{COLOR:'#332200',SHAPE:JET_SHAPE}] },
            { POSITION:[21,0,0,0,360,0], TYPE:['StealthJetBase',{COLOR:'#443300'}] },
        ],
    };

    // THUNDERBOLT — Fastest jet, ultra-rapid strafing runs ────────────────────
    Class.Thunderbolt_MR2 = {
        PARENT:'genericActualJet', LABEL:'Thunderbolt', DANGER:6,
        BODY:{ HEALTH:base.HEALTH*0.8, SPEED:base.SPEED*1.8 },
        LAYER:29, HAS_NO_RECOIL:true, SIZE:12,
        INTANGIBLE:true, IGNORE_COLLISION:true,
        SHAPE: JET_SHAPE,
        GUNS:[
            ...[-10,-6,-2,2,6,10].flatMap((y,i)=>[
                {POSITION:[36,3,1,0,y,0,0], PROPERTIES:{COLOR:'#1a1a44'}},
                {POSITION:[40,3,1,0,y,0,i*0.08], PROPERTIES:{ SHOOT_SETTINGS:safeCS([g.basic,{reload:0.07,damage:0.02,speed:22,shudder:0,spray:0}]), TYPE:'tank5mmRound' }},
            ]),
        ],
        TURRETS:[
            { POSITION:[1,0,0,0,360,0],  TYPE:['JetAimer',{COLOR:'#0a0a33',SHAPE:JET_SHAPE}] },
            { POSITION:[21,0,0,0,360,0], TYPE:['VulcanBase',{COLOR:'#0a0a33'}] },
        ],
    };

// ════════════════════════════════════════════════════════════════════════════
//  NEW UNREAL / SPECIAL WEAPONS
// ════════════════════════════════════════════════════════════════════════════

    // ORBITAL STRIKE — Even bigger nuke salvo ─────────────────────────────────
    Class.OrbitalStrike_MR2 = {
        PARENT:'genericActualTank', LABEL:'Orbital Strike', DANGER:6, HAS_NO_RECOIL:true,
        BODY:{ HEALTH:base.HEALTH*1.3 },
        SHAPE: TANK_SHAPE,
        GUNS:[
            ...[-8,0,8].map((y,i)=>({
                POSITION:[14,18,1.3,32,y,0,i*0.33],
                PROPERTIES:{ SHOOT_SETTINGS:safeCS([g.basic,{reload:4,damage:1.5,shudder:0.3}]), TYPE:'nuclearmissile' },
            })),
            ...[-8,0,8].map((y)=>({ POSITION:[30,18,1,0,y,0,0] })),
            ...[-8,0,8].map((y)=>({ POSITION:[4,18,-1.4,8,y,0,0] })),
            {POSITION:[3,26,1,36,0,0,0]},
        ],
        TURRETS:[ ...stdTurrets('#222'),
            { POSITION:[10,0,0,0,360,1], TYPE:['tankAutoTurret5',{COLOR:'darkGrey'}] },
        ],
    };

    // THERMONUKE — Thermal-signature guided bomb ───────────────────────────────
    Class.ThermoNuke_MR2 = {
        PARENT:'genericActualTank', LABEL:'ThermoNuke', DANGER:6, HAS_NO_RECOIL:true,
        BODY:{ HEALTH:base.HEALTH*1.2 },
        SHAPE: TANK_SHAPE,
        GUNS:[
            {POSITION:[34,22,1,0,0,0,0]},
            {POSITION:[4,22,-1.4,8,0,0,0]},
            {POSITION:[14,22,1.3,34,0,0,0],
             PROPERTIES:{ SHOOT_SETTINGS:safeCS([g.basic,{reload:5,damage:2,shudder:0.4,size:2}]), TYPE:'veryVolatileShells' }},
            {POSITION:[3,28,1,38,0,0,0]},
            // Side machine gun for self-defense
            {POSITION:[20,2,1.3,-5,8,0,0],
             PROPERTIES:{ SHOOT_SETTINGS:safeCS([g.basic,{reload:0.1,damage:0.01,speed:20,shudder:0,spray:0}]), TYPE:'tank5mmRound', COLOR:'darkGrey' }},
        ],
        TURRETS:[ ...stdTurrets('#333'),
            { POSITION:[12,0,0,0,360,1], TYPE:['tankAutoTurret4',{COLOR:'grey'}] },
        ],
    };

// ════════════════════════════════════════════════════════════════════════════
//  MENU + UPGRADE TREE
// ════════════════════════════════════════════════════════════════════════════

    // Menu nodes
    Class.ActualTanks3_MR2 = {
        PARENT:'genericTank', LABEL:'New Tanks II', COLOR:'darkGrey',
        SIZE:14, GUNS:[], TURRETS:[],
        UPGRADES_TIER_0:[
            'TTV3_MR2','TTV4_MR2','TTV5_MR2','AAATANK_MR2','SniperTank_MR2',
            'DestroyerTank_MR2','Mortar_MR2','Railgun_MR2','Flamecaster_MR2',
            'Phalanx_MR2','SiegeTank_MR2','TeslaTank_MR2','KrisBreacher_MR2',
            'DazeMK2_MR2','HAGUMK2_MR2',
        ],
    };
    Class.ActualCopters2_MR2 = {
        PARENT:'genericTank', LABEL:'New Copters II', COLOR:'darkGrey',
        SIZE:14, GUNS:[], TURRETS:[],
        UPGRADES_TIER_0:['HellfireRaider_MR2','Thunderhawk_MR2','SpectreGunship_MR2','Cobra_MR2'],
    };
    Class.ActualJets2_MR2 = {
        PARENT:'genericTank', LABEL:'New Jets II', COLOR:'darkGrey',
        SIZE:14, GUNS:[], TURRETS:[],
        UPGRADES_TIER_0:['Firestrike_MR2','NightStalker_MR2','MegaBomber_MR2','Thunderbolt_MR2'],
    };
    Class.ActualUnreal2_MR2 = {
        PARENT:'genericTank', LABEL:'New Specials II', COLOR:'darkGrey',
        SIZE:14, GUNS:[], TURRETS:[],
        UPGRADES_TIER_0:['OrbitalStrike_MR2','ThermoNuke_MR2'],
    };
    Class.militarrasMenu2_MR2 = {
        PARENT:'genericTank', LABEL:'Military II', COLOR:'grey',
        SIZE:16, GUNS:[], TURRETS:[],
        UPGRADES_TIER_0:[
            'ActualTanks3_MR2','ActualCopters2_MR2',
            'ActualJets2_MR2','ActualUnreal2_MR2',
        ],
    };

    // Hook into menu_addons
    const _entry = ['menu_addons','addons']
        .find(n => Class[n] && Array.isArray(Class[n].UPGRADES_TIER_0));
    if (_entry) {
        Class[_entry].UPGRADES_TIER_0.push('militarrasMenu2_MR2');
        console.log('[militarras2] Connected to ' + _entry);
    } else {
        console.warn('[militarras2] Connect militarrasMenu2_MR2 manually.');
    }
    console.log('[militarras2] Loaded — 25 new military vehicles!');
};