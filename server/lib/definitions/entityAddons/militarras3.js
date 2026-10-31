// ============================================================
//  MILITARRAS III — Mechs, Battleships, Robots & More
//  Companion addon for militarras.js + militarras2.js
//  All classes use _MR3 suffix — zero collisions
// ============================================================

const { combineStats } = require('../facilitators.js');
const _constants = require('../constants.js');
const { base, dfltskl } = _constants;
const g = require('../gunvals.js');

const safeCS = stats => combineStats(stats.filter(s => s != null));

if (!g.pounder)     g.pounder     = { reload:1.5, recoil:1.4, speed:0.65, maxSpeed:0.65, size:1.25, damage:1.5 };
if (!g.destroyer)   g.destroyer   = { reload:2, recoil:2, speed:0.55, maxSpeed:0.55, size:1.5, damage:2, pen:1.6 };
if (!g.assassin)    g.assassin    = { speed:1.6, maxSpeed:1.6, reload:0.55, recoil:0 };
if (!g.artillery)   g.artillery   = { reload:1.8, spray:2, size:1.2, damage:1.4 };
if (!g.skimmer)     g.skimmer     = { reload:2, recoil:1, speed:0.8, maxSpeed:0.8 };
if (!g.hunter)      g.hunter      = { speed:1.4, maxSpeed:1.4, reload:0.6, pen:1.1 };
if (!g.hunterSecondary) g.hunterSecondary = { size:0.6, damage:0.6, reload:0.5 };
if (!g.flankGuard)  g.flankGuard  = { reload:0.85, recoil:0.85 };

// ── SVG Shapes ────────────────────────────────────────────────────────────────
const TANK_SHAPE = 'M -1 -1 H 0 C 1 -1 1 0 1 0 C 1 0 1 1 0 1 H -1 V -1';

// ── Mech body SVG — humanoid torso silhouette ─────────────────────────────────
const MECH_BODY   = 'M -0.5 -1 L 0.5 -1 L 0.7 -0.4 L 1 -0.4 L 1 0.3 L 0.7 0.3 L 0.7 1 L 0.3 1 L 0.3 0.4 L -0.3 0.4 L -0.3 1 L -0.7 1 L -0.7 0.3 L -1 0.3 L -1 -0.4 L -0.7 -0.4 Z';
// Wide assault mech
const MECH_HEAVY  = 'M -0.7 -1 L 0.7 -1 L 1 -0.5 L 1 0.4 L 0.7 0.4 L 0.7 1 L 0.3 1 L 0.3 0.5 L -0.3 0.5 L -0.3 1 L -0.7 1 L -0.7 0.4 L -1 0.4 L -1 -0.5 Z';
// Spider/walker mech
const MECH_SPIDER = 'M -0.3 -0.8 L 0.3 -0.8 L 0.3 -0.3 L 0.8 -0.5 L 1 0 L 0.8 0.5 L 0.3 0.3 L 0.3 0.8 L -0.3 0.8 L -0.3 0.3 L -0.8 0.5 L -1 0 L -0.8 -0.5 L -0.3 -0.3 Z';
// Robot head
const ROBOT_HEAD  = 'M -0.7 -1 L 0.7 -1 L 0.9 -0.7 L 0.9 0.3 L 0.5 0.3 L 0.5 0.6 L 0.3 1 L -0.3 1 L -0.5 0.6 L -0.5 0.3 L -0.9 0.3 L -0.9 -0.7 Z';

// ── Battleship hull shapes ────────────────────────────────────────────────────
const BATTLESHIP_HULL  = 'M 0 -1 L 0.3 -0.9 L 0.5 -0.5 L 0.55 0.5 L 0.4 0.85 L 0.2 1 L -0.2 1 L -0.4 0.85 L -0.55 0.5 L -0.5 -0.5 L -0.3 -0.9 Z';
const DESTROYER_HULL   = 'M 0 -1 L 0.2 -0.85 L 0.45 -0.4 L 0.5 0.55 L 0.3 0.9 L 0 1 L -0.3 0.9 L -0.5 0.55 L -0.45 -0.4 L -0.2 -0.85 Z';
const CARRIER_HULL     = 'M -0.1 -1 L 0.1 -1 L 0.4 -0.7 L 0.6 0 L 0.5 0.7 L 0.3 1 L -0.3 1 L -0.5 0.7 L -0.6 0 L -0.4 -0.7 Z';
const SUBMARINE_HULL   = 'M 0 -1 L 0.25 -0.85 L 0.4 -0.4 L 0.42 0.4 L 0.3 0.85 L 0.1 1 L -0.1 1 L -0.3 0.85 L -0.42 0.4 L -0.4 -0.4 L -0.25 -0.85 Z';

// ── Generic base: generic tank is the fallback for everything ──────────────────
const MECH_BASE_BODY = {
    ACCELERATION: base.ACCELERATION || base.ACCEL || 1,
    SPEED:  base.SPEED  * 0.7,
    HEALTH: base.HEALTH * 2.5,
    DAMAGE: base.DAMAGE * 1.5,
    PENETRATION: base.PENETRATION,
    SHIELD: base.SHIELD * 4,
    REGEN:  base.REGEN  * 1.5,
    FOV:    base.FOV    * 1.8,
    DENSITY: base.DENSITY,
    PUSHABILITY: 0.3,
};
const SHIP_BASE_BODY = {
    ACCELERATION: base.ACCELERATION || base.ACCEL || 1,
    SPEED:  base.SPEED  * 0.55,
    HEALTH: base.HEALTH * 4,
    DAMAGE: base.DAMAGE * 2,
    PENETRATION: base.PENETRATION,
    SHIELD: base.SHIELD * 8,
    REGEN:  base.REGEN  * 1.8,
    FOV:    base.FOV    * 2.5,
    DENSITY: base.DENSITY * 1.5,
    PUSHABILITY: 0.2,
};

module.exports = ({ Class }) => {
    console.log('[militarras3] Loading Mechs, Ships, Robots...');

// ════════════════════════════════════════════════════════════════════════════
//  ███╗   ███╗███████╗ ██████╗██╗  ██╗███████╗
//  ████╗ ████║██╔════╝██╔════╝██║  ██║██╔════╝
//  ██╔████╔██║█████╗  ██║     ███████║███████╗
//  ██║╚██╔╝██║██╔══╝  ██║     ██╔══██║╚════██║
//  ██║ ╚═╝ ██║███████╗╚██████╗██║  ██║███████║
// ════════════════════════════════════════════════════════════════════════════

    // ── Shared mech auto-turret (shoulder-mount) ──────────────────────────────
    Class.mechShoulderTurret_MR3 = {
        PARENT:'autoTurret', LABEL:'Shoulder Cannon', INDEPENDENT:true,
        BODY:{ FOV: base.FOV*1.5 },
        GUNS:[{
            POSITION:[18,8,1,0,0,0,0],
            PROPERTIES:{ SHOOT_SETTINGS:safeCS([g.basic,g.pounder,{reload:1.5,damage:1.4}]), TYPE:'developerBullet' },
        }],
    };
    Class.mechMinigunTurret_MR3 = {
        PARENT:'autoTurret', LABEL:'Minigun Pod', INDEPENDENT:true,
        BODY:{ FOV: base.FOV*1.3 },
        GUNS:[
            {POSITION:[16,3,1,0,3,0,0],  PROPERTIES:{ SHOOT_SETTINGS:safeCS([g.basic,g.twin,g.gunner,{reload:0.3,damage:0.8,speed:18}]), TYPE:'tank5mmRound' }},
            {POSITION:[16,3,1,0,-3,0,0.25],PROPERTIES:{ SHOOT_SETTINGS:safeCS([g.basic,g.twin,g.gunner,{reload:0.3,damage:0.8,speed:18}]), TYPE:'tank5mmRound' }},
            {POSITION:[18,3,1,0,0,0,0.5],  PROPERTIES:{ SHOOT_SETTINGS:safeCS([g.basic,g.twin,g.gunner,{reload:0.3,damage:0.8,speed:18}]), TYPE:'tank5mmRound' }},
        ],
    };
    Class.mechMissileTurret_MR3 = {
        PARENT:'autoTurret', LABEL:'Missile Pod', INDEPENDENT:true,
        BODY:{ FOV: base.FOV*1.6 },
        GUNS:[{
            POSITION:[14,8,1,0,0,0,0],
            PROPERTIES:{ SHOOT_SETTINGS:safeCS([g.basic,g.skimmer,{reload:2.5,damage:1.8,size:1.4}]), TYPE:'homingflankMissile' },
        }],
    };

    // ── ATLAS — Standard bipedal assault mech ─────────────────────────────────
    Class.AtlasMech_MR3 = {
        PARENT:'genericTank', LABEL:'Atlas Mech', DANGER:6,
        HAS_NO_RECOIL:true, DAMAGE_CLASS:2,
        SIZE:20, SHAPE:MECH_BODY, COLOR:'grey',
        BODY:{ ...MECH_BASE_BODY },
        SKILL_CAP:Array(10).fill(dfltskl||7),
        GUNS:[
            // Left arm cannon
            {POSITION:[20,8,1,0,8,0,0],  PROPERTIES:{ SHOOT_SETTINGS:safeCS([g.basic,g.pounder,{reload:2,damage:1.8,size:1.3}]), TYPE:'developerBullet' }},
            // Right arm cannon
            {POSITION:[20,8,1,0,-8,0,0.5],PROPERTIES:{ SHOOT_SETTINGS:safeCS([g.basic,g.pounder,{reload:2,damage:1.8,size:1.3}]), TYPE:'developerBullet' }},
            // Chest machinegun
            {POSITION:[16,3,1,0,3,0,0.1],PROPERTIES:{ SHOOT_SETTINGS:safeCS([g.basic,{reload:0.12,damage:0.02,speed:20}]), TYPE:'tank5mmRound' }},
            {POSITION:[16,3,1,0,-3,0,0.35],PROPERTIES:{ SHOOT_SETTINGS:safeCS([g.basic,{reload:0.12,damage:0.02,speed:20}]), TYPE:'tank5mmRound' }},
        ],
        TURRETS:[
            {POSITION:[10,0,0,30,180,1],  TYPE:['mechShoulderTurret_MR3',{COLOR:'darkGrey'}]},
            {POSITION:[10,0,0,-30,180,1], TYPE:['mechShoulderTurret_MR3',{COLOR:'darkGrey'}]},
        ],
    };

    // ── GOLIATH — Heavy assault mech, slow, devastating ───────────────────────
    Class.GoliathMech_MR3 = {
        PARENT:'genericTank', LABEL:'Goliath Mech', DANGER:7,
        HAS_NO_RECOIL:true, DAMAGE_CLASS:2,
        SIZE:26, SHAPE:MECH_HEAVY, COLOR:'#333',
        BODY:{ ...MECH_BASE_BODY, SPEED:base.SPEED*0.45, HEALTH:base.HEALTH*4, SHIELD:base.SHIELD*8 },
        SKILL_CAP:Array(10).fill(dfltskl||7),
        GUNS:[
            // Twin destroyer arms
            {POSITION:[22,16,1,0,10,0,0],   PROPERTIES:{ SHOOT_SETTINGS:safeCS([g.basic,g.pounder,g.destroyer,{reload:3.5,damage:3,size:2}]), TYPE:'developerBullet' }},
            {POSITION:[22,16,1,0,-10,0,0.5],PROPERTIES:{ SHOOT_SETTINGS:safeCS([g.basic,g.pounder,g.destroyer,{reload:3.5,damage:3,size:2}]), TYPE:'developerBullet' }},
            // Shoulder rockets
            {POSITION:[14,10,1,0,18,0,0],  PROPERTIES:{ SHOOT_SETTINGS:safeCS([g.basic,g.skimmer,{reload:4,damage:2.5}]), TYPE:'flankMissile' }},
            {POSITION:[14,10,1,0,-18,0,0.5],PROPERTIES:{ SHOOT_SETTINGS:safeCS([g.basic,g.skimmer,{reload:4,damage:2.5}]), TYPE:'flankMissile' }},
        ],
        TURRETS:[
            {POSITION:[12,0,0,40,180,1],  TYPE:['mechMissileTurret_MR3',{COLOR:'#555'}]},
            {POSITION:[12,0,0,-40,180,1], TYPE:['mechMissileTurret_MR3',{COLOR:'#555'}]},
            {POSITION:[8,0,0,0,360,1],    TYPE:['tankAutoTurret4',{COLOR:'darkGrey'}]},
        ],
    };

    // ── WRAITH — Fast scout mech, light armour, twin miniguns ─────────────────
    Class.WraithMech_MR3 = {
        PARENT:'genericTank', LABEL:'Wraith Mech', DANGER:6,
        HAS_NO_RECOIL:true, DAMAGE_CLASS:2,
        SIZE:16, SHAPE:MECH_BODY, COLOR:'#1a2a1a',
        BODY:{ ...MECH_BASE_BODY, SPEED:base.SPEED*1.1, HEALTH:base.HEALTH*1.5 },
        SKILL_CAP:Array(10).fill(dfltskl||7),
        GUNS:[
            ...[-5,-2,2,5].flatMap((y,i)=>[
                {POSITION:[14,3,1,0,y,0,0],   PROPERTIES:{COLOR:'darkGrey'}},
                {POSITION:[18,3,1,0,y,0,i*0.15],PROPERTIES:{ SHOOT_SETTINGS:safeCS([g.basic,{reload:0.1,damage:0.018,speed:21,shudder:0,spray:1}]), TYPE:'tank5mmRound' }},
            ]),
        ],
        TURRETS:[
            {POSITION:[8,0,0,25,180,1],  TYPE:['mechMinigunTurret_MR3',{COLOR:'#444'}]},
            {POSITION:[8,0,0,-25,180,1], TYPE:['mechMinigunTurret_MR3',{COLOR:'#444'}]},
        ],
    };

    // ── TITAN — Siege walker, six-legged spider platform ─────────────────────
    Class.TitanMech_MR3 = {
        PARENT:'genericTank', LABEL:'Titan Walker', DANGER:7,
        HAS_NO_RECOIL:true, DAMAGE_CLASS:2,
        SIZE:28, SHAPE:MECH_SPIDER, COLOR:'#2a1a00',
        BODY:{ ...MECH_BASE_BODY, SPEED:base.SPEED*0.4, HEALTH:base.HEALTH*5, SHIELD:base.SHIELD*10, DENSITY:base.DENSITY*2 },
        SKILL_CAP:Array(10).fill(dfltskl||7),
        GUNS:[
            {POSITION:[28,18,1,0,0,0,0],    PROPERTIES:{COLOR:'#222'}},
            {POSITION:[18,16,-1.2,0,0,0,0], PROPERTIES:{COLOR:'#444'}},
            {POSITION:[12,18,1.3,30,0,0,0],
             PROPERTIES:{ SHOOT_SETTINGS:safeCS([g.basic,g.pounder,g.destroyer,{reload:5,damage:4,size:2.5,shudder:0.3,pen:2.5}]), TYPE:'developerBullet' }},
            {POSITION:[3,22,1,34,0,0,0]},
        ],
        TURRETS:[
            {POSITION:[14,0,0,60,180,1],   TYPE:['mechShoulderTurret_MR3',{COLOR:'#555'}]},
            {POSITION:[14,0,0,120,180,1],  TYPE:['mechShoulderTurret_MR3',{COLOR:'#555'}]},
            {POSITION:[14,0,0,180,180,1],  TYPE:['mechShoulderTurret_MR3',{COLOR:'#555'}]},
            {POSITION:[14,0,0,240,180,1],  TYPE:['mechShoulderTurret_MR3',{COLOR:'#555'}]},
            {POSITION:[14,0,0,300,180,1],  TYPE:['mechShoulderTurret_MR3',{COLOR:'#555'}]},
            {POSITION:[10,0,0,0,360,1],    TYPE:['tankAutoTurret5',{COLOR:'darkGrey'}]},
        ],
    };

    // ── PALADIN — Defensive mech, shield + traps + auto-guns ─────────────────
    Class.PaladinMech_MR3 = {
        PARENT:'genericTank', LABEL:'Paladin Mech', DANGER:6,
        HAS_NO_RECOIL:true, DAMAGE_CLASS:2,
        SIZE:22, SHAPE:MECH_HEAVY, COLOR:'#443300',
        BODY:{ ...MECH_BASE_BODY, SPEED:base.SPEED*0.55, HEALTH:base.HEALTH*3, SHIELD:base.SHIELD*12, REGEN:base.REGEN*3 },
        SKILL_CAP:Array(10).fill(dfltskl||7),
        GUNS:[
            // Trap layer arms
            {POSITION:[14,8,1,0,8,0,0]},
            {POSITION:[2,8,1.7,14,8,0,0],  PROPERTIES:{ SHOOT_SETTINGS:safeCS([g.trap,g.trap,{health:1.8,reload:1.5}]), TYPE:'trap', STAT_CALCULATOR:'trap', AUTOFIRE:true }},
            {POSITION:[14,8,1,0,-8,0,0]},
            {POSITION:[2,8,1.7,14,-8,0,0.5],PROPERTIES:{ SHOOT_SETTINGS:safeCS([g.trap,g.trap,{health:1.8,reload:1.5}]), TYPE:'trap', STAT_CALCULATOR:'trap', AUTOFIRE:true }},
        ],
        TURRETS:[
            {POSITION:[12,0,0,30,360,1],  TYPE:['tankAutoTurret3',{COLOR:'#665500'}]},
            {POSITION:[12,0,0,150,360,1], TYPE:['tankAutoTurret3',{COLOR:'#665500'}]},
            {POSITION:[12,0,0,270,360,1], TYPE:['tankAutoTurret3',{COLOR:'#665500'}]},
        ],
    };

    // ── REAPER — Sniper mech, long arms for extreme range ────────────────────
    Class.ReaperMech_MR3 = {
        PARENT:'genericTank', LABEL:'Reaper Mech', DANGER:6,
        HAS_NO_RECOIL:true, DAMAGE_CLASS:2,
        SIZE:18, SHAPE:MECH_BODY, COLOR:'#0a0a1a',
        BODY:{ ...MECH_BASE_BODY, SPEED:base.SPEED*0.7, FOV:base.FOV*2.5 },
        SKILL_CAP:Array(10).fill(dfltskl||7),
        GUNS:[
            {POSITION:[40,8,1,0,5,0,0],  PROPERTIES:{COLOR:'#111'}},
            {POSITION:[46,6,1,0,5,0,0],
             PROPERTIES:{ SHOOT_SETTINGS:safeCS([g.basic,g.assassin,g.sniper,{reload:2.5,damage:2.5,speed:26,range:4,spray:0}]), TYPE:'developerBullet' }},
            {POSITION:[3,10,1,48,5,0,0]},
            {POSITION:[40,8,1,0,-5,0,0], PROPERTIES:{COLOR:'#111'}},
            {POSITION:[46,6,1,0,-5,0,0.5],
             PROPERTIES:{ SHOOT_SETTINGS:safeCS([g.basic,g.assassin,g.sniper,{reload:2.5,damage:2.5,speed:26,range:4,spray:0}]), TYPE:'developerBullet' }},
            {POSITION:[3,10,1,48,-5,0,0]},
        ],
        TURRETS:[
            {POSITION:[8,0,0,0,360,1], TYPE:['tankAutoTurret1',{COLOR:'darkGrey'}]},
        ],
    };

    // ── ZEUS MECH — Electrical mech, lightning emitters on every joint ────────
    Class.ZeusMech_MR3 = {
        PARENT:'genericTank', LABEL:'Zeus Mech', DANGER:7,
        HAS_NO_RECOIL:true, DAMAGE_CLASS:2,
        SIZE:24, SHAPE:MECH_HEAVY, COLOR:'#001155',
        BODY:{ ...MECH_BASE_BODY, HEALTH:base.HEALTH*3, SHIELD:base.SHIELD*6 },
        SKILL_CAP:Array(10).fill(dfltskl||7),
        GUNS:[
            ...[-10,-5,0,5,10].flatMap((y,i)=>[
                {POSITION:[22,4,1,0,y,0,0],    PROPERTIES:{COLOR:'#002299'}},
                {POSITION:[26,3,1,0,y,0,i*0.1],PROPERTIES:{ SHOOT_SETTINGS:safeCS([g.basic,{reload:0.4,damage:0.9,speed:14,spray:6,pen:1.8}]), TYPE:'developerBullet' }},
            ]),
        ],
        TURRETS:[
            {POSITION:[12,0,0,45,180,1],  TYPE:['mechShoulderTurret_MR3',{COLOR:'#0033cc'}]},
            {POSITION:[12,0,0,-45,180,1], TYPE:['mechShoulderTurret_MR3',{COLOR:'#0033cc'}]},
            {POSITION:[8,0,0,0,360,1],    TYPE:['tankAutoTurret3',{COLOR:'#1144ff'}]},
        ],
    };

    // ── HYDRA — Multi-arm mech, eight weapon pods ─────────────────────────────
    Class.HydraMech_MR3 = {
        PARENT:'genericTank', LABEL:'Hydra Mech', DANGER:7,
        HAS_NO_RECOIL:true, DAMAGE_CLASS:2,
        SIZE:26, SHAPE:MECH_SPIDER, COLOR:'#1a0022',
        BODY:{ ...MECH_BASE_BODY, SPEED:base.SPEED*0.5, HEALTH:base.HEALTH*3.5 },
        SKILL_CAP:Array(10).fill(dfltskl||7),
        GUNS:[],
        TURRETS:[
            ...[0,45,90,135,180,225,270,315].map(angle=>({
                POSITION:[12,0,0,angle,180,1],
                TYPE:['mechMissileTurret_MR3',{COLOR:'#330044'}],
            })),
            {POSITION:[6,0,0,0,360,1], TYPE:['tankAutoTurret4',{COLOR:'#551166'}]},
        ],
    };

// ════════════════════════════════════════════════════════════════════════════
//  ██████╗  ██████╗ ██████╗  ██████╗ ████████╗███████╗
//  ██╔══██╗██╔═══██╗██╔══██╗██╔═══██╗╚══██╔══╝██╔════╝
//  ██████╔╝██║   ██║██████╔╝██║   ██║   ██║   ███████╗
//  ██╔══██╗██║   ██║██╔══██╗██║   ██║   ██║   ╚════██║
//  ██║  ██║╚██████╔╝██████╔╝╚██████╔╝   ██║   ███████║
// ════════════════════════════════════════════════════════════════════════════

    // ── Naval turret classes ──────────────────────────────────────────────────
    Class.navalTurretSmall_MR3 = {
        PARENT:'autoTurret', LABEL:'5" Naval Gun', INDEPENDENT:true,
        BODY:{ FOV:base.FOV*2 },
        GUNS:[
            {POSITION:[22,8,1,0,0,0,0],
             PROPERTIES:{ SHOOT_SETTINGS:safeCS([g.basic,g.pounder,{reload:2,damage:2,speed:16,size:1.3}]), TYPE:'developerBullet' }},
            {POSITION:[18,10,-1.2,0,0,0,0],PROPERTIES:{COLOR:'#333'}},
        ],
    };
    Class.navalTurretLarge_MR3 = {
        PARENT:'autoTurret', LABEL:'16" Naval Gun', INDEPENDENT:true,
        BODY:{ FOV:base.FOV*2.5 },
        GUNS:[
            {POSITION:[28,16,1,0,5,0,0],
             PROPERTIES:{ SHOOT_SETTINGS:safeCS([g.basic,g.pounder,g.destroyer,{reload:4,damage:4,speed:14,size:2,pen:2}]), TYPE:'developerBullet' }},
            {POSITION:[28,16,1,0,-5,0,0.5],
             PROPERTIES:{ SHOOT_SETTINGS:safeCS([g.basic,g.pounder,g.destroyer,{reload:4,damage:4,speed:14,size:2,pen:2}]), TYPE:'developerBullet' }},
            {POSITION:[22,18,-1.2,0,0,0,0],PROPERTIES:{COLOR:'#222'}},
        ],
    };
    Class.navalTorpedo_MR3 = {
        PARENT:'autoTurret', LABEL:'Torpedo', INDEPENDENT:true,
        BODY:{ FOV:base.FOV*1.8 },
        GUNS:[{
            POSITION:[16,10,1,0,0,0,0],
            PROPERTIES:{ SHOOT_SETTINGS:safeCS([g.basic,g.skimmer,{reload:3.5,damage:3,size:1.8,speed:1,pen:2.5}]), TYPE:'homingflankMissile' },
        }],
    };
    Class.navalAAGun_MR3 = {
        PARENT:'autoTurret', LABEL:'AA Battery', INDEPENDENT:true,
        BODY:{ FOV:base.FOV*2 },
        GUNS:[
            ...[-4,0,4].map((y,i)=>({
                POSITION:[18,3,1,0,y,0,i*0.15],
                PROPERTIES:{ SHOOT_SETTINGS:safeCS([g.basic,{reload:0.2,damage:0.5,speed:20,spray:3}]), TYPE:'tank5mmRound' },
            })),
        ],
    };

    // ── IOWA — WW2-era Battleship, triple turret arrangement ─────────────────
    Class.IowaBattleship_MR3 = {
        PARENT:'genericTank', LABEL:'Iowa-class BB', DANGER:7,
        HAS_NO_RECOIL:true, DAMAGE_CLASS:2,
        SIZE:30, SHAPE:BATTLESHIP_HULL, COLOR:'#3a3a3a',
        BODY:{ ...SHIP_BASE_BODY },
        SKILL_CAP:Array(10).fill(dfltskl||7),
        GUNS:[],
        TURRETS:[
            // Triple main battery turrets (fore, mid, aft)
            {POSITION:[16,0,0,0,180,1],  TYPE:['navalTurretLarge_MR3',{COLOR:'#444'}]},
            {POSITION:[10,0,0,15,180,1], TYPE:['navalTurretLarge_MR3',{COLOR:'#444'}]},
            {POSITION:[10,0,0,-15,180,1],TYPE:['navalTurretLarge_MR3',{COLOR:'#444'}]},
            // AA batteries along sides
            {POSITION:[8,0,0,60,180,1],  TYPE:['navalAAGun_MR3',{COLOR:'darkGrey'}]},
            {POSITION:[8,0,0,120,180,1], TYPE:['navalAAGun_MR3',{COLOR:'darkGrey'}]},
            {POSITION:[8,0,0,240,180,1], TYPE:['navalAAGun_MR3',{COLOR:'darkGrey'}]},
            {POSITION:[8,0,0,300,180,1], TYPE:['navalAAGun_MR3',{COLOR:'darkGrey'}]},
        ],
    };

    // ── YAMATO — Imperial super-battleship, massive main guns ─────────────────
    Class.YamatoBattleship_MR3 = {
        PARENT:'genericTank', LABEL:'Yamato-class BB', DANGER:7,
        HAS_NO_RECOIL:true, DAMAGE_CLASS:2,
        SIZE:34, SHAPE:BATTLESHIP_HULL, COLOR:'#2a2a2a',
        BODY:{ ...SHIP_BASE_BODY, HEALTH:base.HEALTH*6, SPEED:base.SPEED*0.4 },
        SKILL_CAP:Array(10).fill(dfltskl||7),
        GUNS:[
            // Massive triple 18.1" guns forward
            ...[-8,0,8].map((y,i)=>({
                POSITION:[14,22,1.3,36,y,0,i*0.15],
                PROPERTIES:{ SHOOT_SETTINGS:safeCS([g.basic,g.pounder,g.destroyer,{reload:5.5,damage:5,size:2.5,pen:3}]), TYPE:'developerBullet' },
            })),
            ...[-8,0,8].map(y=>({ POSITION:[36,22,1,0,y,0,0] })),
            ...[-8,0,8].map(y=>({ POSITION:[4,22,-1.3,8,y,0,0] })),
            {POSITION:[3,28,1,40,0,0,0]},
        ],
        TURRETS:[
            {POSITION:[14,0,0,150,180,1], TYPE:['navalTurretLarge_MR3',{COLOR:'#333'}]},
            {POSITION:[14,0,0,210,180,1], TYPE:['navalTurretLarge_MR3',{COLOR:'#333'}]},
            {POSITION:[10,0,0,75,180,1],  TYPE:['navalAAGun_MR3',{COLOR:'darkGrey'}]},
            {POSITION:[10,0,0,105,180,1], TYPE:['navalAAGun_MR3',{COLOR:'darkGrey'}]},
            {POSITION:[10,0,0,255,180,1], TYPE:['navalAAGun_MR3',{COLOR:'darkGrey'}]},
            {POSITION:[10,0,0,285,180,1], TYPE:['navalAAGun_MR3',{COLOR:'darkGrey'}]},
        ],
    };

    // ── TICONDEROGA — Aegis cruiser, missile-heavy ────────────────────────────
    Class.TiconderogaCruiser_MR3 = {
        PARENT:'genericTank', LABEL:'Ticonderoga CG', DANGER:6,
        HAS_NO_RECOIL:true, DAMAGE_CLASS:2,
        SIZE:24, SHAPE:DESTROYER_HULL, COLOR:'#4a4a5a',
        BODY:{ ...SHIP_BASE_BODY, SPEED:base.SPEED*0.65 },
        SKILL_CAP:Array(10).fill(dfltskl||7),
        GUNS:[],
        TURRETS:[
            {POSITION:[14,0,0,0,180,1],   TYPE:['navalTurretSmall_MR3',{COLOR:'#555'}]},
            {POSITION:[14,0,0,180,180,1], TYPE:['navalTurretSmall_MR3',{COLOR:'#555'}]},
            // VLS cells — missile pods at each bearing
            ...[45,90,135,225,270,315].map(angle=>({
                POSITION:[10,0,0,angle,180,1],
                TYPE:['navalTorpedo_MR3',{COLOR:'#4a4a6a'}],
            })),
            {POSITION:[8,0,0,0,360,1], TYPE:['navalAAGun_MR3',{COLOR:'darkGrey'}]},
        ],
    };

    // ── NIMITZ — Carrier, launches drone swarms ───────────────────────────────
    Class.NimitzCarrier_MR3 = {
        PARENT:'genericTank', LABEL:'Nimitz-class CV', DANGER:7,
        HAS_NO_RECOIL:true, DAMAGE_CLASS:2,
        SIZE:36, SHAPE:CARRIER_HULL, COLOR:'#5a5a5a',
        BODY:{ ...SHIP_BASE_BODY, SPEED:base.SPEED*0.35, HEALTH:base.HEALTH*7 },
        SKILL_CAP:Array(10).fill(dfltskl||7),
        GUNS:[
            // Flight deck launch catapults — drone spawners
            ...[0,45,90,135,180,225,270,315].map((angle,i)=>({
                POSITION:[8,10,1.2,10,0,angle,i*0.1],
                PROPERTIES:{
                    SHOOT_SETTINGS:safeCS([g.drone,g.overseer,{reload:3,health:1.5,damage:1.3,size:1.2}]),
                    TYPE:['drone',{INDEPENDENT:true}],
                    AUTOFIRE:true, SYNCS_SKILLS:true, WAIT_TO_CYCLE:true,
                    MAX_CHILDREN:2, STAT_CALCULATOR:'drone',
                },
            })),
        ],
        TURRETS:[
            {POSITION:[16,0,0,0,180,1],   TYPE:['navalTurretSmall_MR3',{COLOR:'#666'}]},
            {POSITION:[16,0,0,180,180,1], TYPE:['navalTurretSmall_MR3',{COLOR:'#666'}]},
            {POSITION:[10,0,0,90,180,1],  TYPE:['navalAAGun_MR3',{COLOR:'darkGrey'}]},
            {POSITION:[10,0,0,270,180,1], TYPE:['navalAAGun_MR3',{COLOR:'darkGrey'}]},
        ],
    };

    // ── SEAWOLF — Fast attack submarine ──────────────────────────────────────
    Class.SeawolfSub_MR3 = {
        PARENT:'genericTank', LABEL:'Seawolf-class SSN', DANGER:6,
        HAS_NO_RECOIL:true, DAMAGE_CLASS:2, LAYER:1,
        SIZE:22, SHAPE:SUBMARINE_HULL, COLOR:'#1a1a2a',
        BODY:{ ...SHIP_BASE_BODY, SPEED:base.SPEED*0.75, FOV:base.FOV*2.2, HEALTH:base.HEALTH*3 },
        SKILL_CAP:Array(10).fill(dfltskl||7),
        GUNS:[
            // Torpedo tubes — angled fore
            {POSITION:[18,12,1,0,8,0,0],
             PROPERTIES:{ SHOOT_SETTINGS:safeCS([g.basic,g.skimmer,{reload:4,damage:3,size:1.6,speed:1.2,pen:2}]), TYPE:'homingflankMissile' }},
            {POSITION:[18,12,1,0,-8,0,0.5],
             PROPERTIES:{ SHOOT_SETTINGS:safeCS([g.basic,g.skimmer,{reload:4,damage:3,size:1.6,speed:1.2,pen:2}]), TYPE:'homingflankMissile' }},
        ],
        TURRETS:[
            // Sail turret (the conning tower)
            {POSITION:[8,0,0,0,360,1], TYPE:['navalTorpedo_MR3',{COLOR:'#222'}]},
        ],
    };

// ════════════════════════════════════════════════════════════════════════════
//  ██████╗  ██████╗ ██████╗  ██████╗ ████████╗███████╗
//  ██╔══██╗██╔═══██╗██╔══██╗██╔═══██╗╚══██╔══╝██╔════╝
//  ██████╔╝██║   ██║██████╔╝██║   ██║   ██║   ███████╗
//  ██╔══██╗██║   ██║██╔══██╗██║   ██║   ██║   ╚════██║
//  ██║  ██║╚██████╔╝██████╔╝╚██████╔╝   ██║   ███████║
// (yes, robots!)
// ════════════════════════════════════════════════════════════════════════════

    // ── Robot eye / sensor turret ─────────────────────────────────────────────
    Class.robotEyeTurret_MR3 = {
        PARENT:'autoTurret', LABEL:'Sensor Array', INDEPENDENT:true,
        BODY:{ FOV:base.FOV*3 },
        GUNS:[{
            POSITION:[20,5,1,0,0,0,0],
            PROPERTIES:{ SHOOT_SETTINGS:safeCS([g.basic,g.sniper,g.assassin,{reload:1.5,damage:1.6,speed:22,spray:0}]), TYPE:'developerBullet' },
        }],
    };
    Class.robotArmTurret_MR3 = {
        PARENT:'autoTurret', LABEL:'Arm Laser', INDEPENDENT:true,
        BODY:{ FOV:base.FOV*1.5 },
        GUNS:[
            {POSITION:[16,4,1,0,3,0,0],  PROPERTIES:{ SHOOT_SETTINGS:safeCS([g.basic,g.twin,{reload:0.4,damage:0.9,speed:16,spray:2}]), TYPE:'developerBullet' }},
            {POSITION:[16,4,1,0,-3,0,0.25],PROPERTIES:{ SHOOT_SETTINGS:safeCS([g.basic,g.twin,{reload:0.4,damage:0.9,speed:16,spray:2}]), TYPE:'developerBullet' }},
        ],
    };

    // ── SENTINEL — Defensive security robot ──────────────────────────────────
    Class.SentinelRobot_MR3 = {
        PARENT:'genericTank', LABEL:'Sentinel Robot', DANGER:6,
        HAS_NO_RECOIL:true, DAMAGE_CLASS:2,
        SIZE:18, SHAPE:ROBOT_HEAD, COLOR:'#cc4400',
        BODY:{ ...MECH_BASE_BODY, SPEED:base.SPEED*0.9 },
        SKILL_CAP:Array(10).fill(dfltskl||7),
        GUNS:[
            {POSITION:[20,5,1,0,5,0,0],  PROPERTIES:{ SHOOT_SETTINGS:safeCS([g.basic,{reload:0.3,damage:0.8,speed:18,spray:1}]), TYPE:'developerBullet' }},
            {POSITION:[20,5,1,0,-5,0,0.25],PROPERTIES:{ SHOOT_SETTINGS:safeCS([g.basic,{reload:0.3,damage:0.8,speed:18,spray:1}]), TYPE:'developerBullet' }},
        ],
        TURRETS:[
            {POSITION:[10,0,0,40,360,1],  TYPE:['robotEyeTurret_MR3',{COLOR:'#ff6600'}]},
            {POSITION:[10,0,0,-40,360,1], TYPE:['robotEyeTurret_MR3',{COLOR:'#ff6600'}]},
        ],
    };

    // ── TERMINATOR — Combat android, relentless pursuer ───────────────────────
    Class.TerminatorRobot_MR3 = {
        PARENT:'genericTank', LABEL:'T-Series Robot', DANGER:6,
        HAS_NO_RECOIL:true, DAMAGE_CLASS:2,
        SIZE:20, SHAPE:ROBOT_HEAD, COLOR:'#1a1a1a',
        BODY:{ ...MECH_BASE_BODY, SPEED:base.SPEED*1.0, HEALTH:base.HEALTH*2 },
        SKILL_CAP:Array(10).fill(dfltskl||7),
        GUNS:[
            ...[-6,-2,2,6].flatMap((y,i)=>[
                {POSITION:[14,3,1,0,y,0,0],   PROPERTIES:{COLOR:'darkGrey'}},
                {POSITION:[18,3,1,0,y,0,i*0.15],PROPERTIES:{ SHOOT_SETTINGS:safeCS([g.basic,{reload:0.12,damage:0.02,speed:20}]), TYPE:'tank5mmRound' }},
            ]),
            // Shoulder rockets
            {POSITION:[16,8,1,0,12,0,0],   PROPERTIES:{ SHOOT_SETTINGS:safeCS([g.basic,g.skimmer,{reload:3,damage:2}]), TYPE:'flankMissile' }},
            {POSITION:[16,8,1,0,-12,0,0.5],PROPERTIES:{ SHOOT_SETTINGS:safeCS([g.basic,g.skimmer,{reload:3,damage:2}]), TYPE:'flankMissile' }},
        ],
        TURRETS:[
            {POSITION:[8,0,0,0,360,1], TYPE:['robotArmTurret_MR3',{COLOR:'#cc0000'}]},
        ],
    };

    // ── OVERLORD — Drone-command battle robot ─────────────────────────────────
    Class.OverlordRobot_MR3 = {
        PARENT:'genericTank', LABEL:'Overlord Robot', DANGER:7,
        HAS_NO_RECOIL:true, DAMAGE_CLASS:2,
        SIZE:24, SHAPE:ROBOT_HEAD, COLOR:'#220033',
        BODY:{ ...MECH_BASE_BODY, SPEED:base.SPEED*0.6, HEALTH:base.HEALTH*3, FOV:base.FOV*2.5 },
        SKILL_CAP:Array(10).fill(dfltskl||7),
        GUNS:[
            ...[0,72,144,216,288].map((angle,i)=>({
                POSITION:[6,8,1.1,10,0,angle,i*0.1],
                PROPERTIES:{
                    SHOOT_SETTINGS:safeCS([g.drone,g.overseer,{reload:2,health:1.4,damage:1.3,size:1.1}]),
                    TYPE:['drone',{INDEPENDENT:true}],
                    AUTOFIRE:true, SYNCS_SKILLS:true, WAIT_TO_CYCLE:true,
                    MAX_CHILDREN:2, STAT_CALCULATOR:'drone',
                },
            })),
        ],
        TURRETS:[
            {POSITION:[12,0,0,30,360,1],  TYPE:['robotEyeTurret_MR3',{COLOR:'#8800ff'}]},
            {POSITION:[12,0,0,150,360,1], TYPE:['robotEyeTurret_MR3',{COLOR:'#8800ff'}]},
            {POSITION:[12,0,0,270,360,1], TYPE:['robotEyeTurret_MR3',{COLOR:'#8800ff'}]},
            {POSITION:[7,0,0,0,360,1],    TYPE:['tankAutoTurret4',{COLOR:'#440066'}]},
        ],
    };

    // ── COLOSSUS ROBOT — Mega-sized walking fortress ──────────────────────────
    Class.ColossusRobot_MR3 = {
        PARENT:'genericTank', LABEL:'Colossus', DANGER:7,
        HAS_NO_RECOIL:true, DAMAGE_CLASS:2,
        SIZE:32, SHAPE:MECH_HEAVY, COLOR:'#111',
        BODY:{ ...MECH_BASE_BODY, SPEED:base.SPEED*0.35, HEALTH:base.HEALTH*6, SHIELD:base.SHIELD*10, DENSITY:base.DENSITY*2 },
        SKILL_CAP:Array(10).fill(dfltskl||7),
        GUNS:[
            // Twin devastator arms
            {POSITION:[24,18,1,0,12,0,0],   PROPERTIES:{COLOR:'#222'}},
            {POSITION:[16,16,-1.2,0,12,0,0],PROPERTIES:{COLOR:'#444'}},
            {POSITION:[12,18,1.3,26,12,0,0],PROPERTIES:{ SHOOT_SETTINGS:safeCS([g.basic,g.pounder,g.destroyer,g.annihilator,{reload:5,damage:5,size:2.8,pen:3}]), TYPE:'developerBullet' }},
            {POSITION:[3,22,1,30,12,0,0]},
            {POSITION:[24,18,1,0,-12,0,0],   PROPERTIES:{COLOR:'#222'}},
            {POSITION:[16,16,-1.2,0,-12,0,0],PROPERTIES:{COLOR:'#444'}},
            {POSITION:[12,18,1.3,26,-12,0,0.5],PROPERTIES:{ SHOOT_SETTINGS:safeCS([g.basic,g.pounder,g.destroyer,g.annihilator,{reload:5,damage:5,size:2.8,pen:3}]), TYPE:'developerBullet' }},
            {POSITION:[3,22,1,30,-12,0,0]},
        ],
        TURRETS:[
            ...[0,60,120,180,240,300].map(angle=>({
                POSITION:[16,0,0,angle,180,1],
                TYPE:['mechShoulderTurret_MR3',{COLOR:'#333'}],
            })),
            {POSITION:[10,0,0,0,360,1], TYPE:['tankAutoTurret6',{COLOR:'darkGrey'}]},
            {POSITION:[6,0,0,0,360,1],  TYPE:['robotEyeTurret_MR3',{COLOR:'#ff0000'}]},
        ],
    };

// ════════════════════════════════════════════════════════════════════════════
//  SPECIAL VEHICLES
// ════════════════════════════════════════════════════════════════════════════

    // ── GUNBOAT — Small fast riverine patrol boat ─────────────────────────────
    Class.Gunboat_MR3 = {
        PARENT:'genericTank', LABEL:'Gunboat', DANGER:6,
        HAS_NO_RECOIL:true, DAMAGE_CLASS:2,
        SIZE:18, SHAPE:DESTROYER_HULL, COLOR:'#556633',
        BODY:{ ...SHIP_BASE_BODY, SPEED:base.SPEED*0.85, HEALTH:base.HEALTH*1.5 },
        SKILL_CAP:Array(10).fill(dfltskl||7),
        GUNS:[
            {POSITION:[22,8,1,0,4,0,0],  PROPERTIES:{ SHOOT_SETTINGS:safeCS([g.basic,{reload:0.15,damage:0.025,speed:18}]), TYPE:'tank5mmRound' }},
            {POSITION:[22,8,1,0,-4,0,0.2],PROPERTIES:{ SHOOT_SETTINGS:safeCS([g.basic,{reload:0.15,damage:0.025,speed:18}]), TYPE:'tank5mmRound' }},
            {POSITION:[16,10,1,0,0,0,0.5],PROPERTIES:{ SHOOT_SETTINGS:safeCS([g.basic,g.pounder,{reload:2,damage:1.5}]), TYPE:'developerBullet' }},
        ],
        TURRETS:[
            {POSITION:[8,0,0,90,180,1],  TYPE:['navalAAGun_MR3',{COLOR:'darkGrey'}]},
            {POSITION:[8,0,0,270,180,1], TYPE:['navalAAGun_MR3',{COLOR:'darkGrey'}]},
        ],
    };

    // ── APACHE ULTRA — All-weapon helicopter gunship ───────────────────────────
    Class.ApacheUltra_MR3 = {
        PARENT:'genericActualHeli', LABEL:'Apache Ultra', DANGER:7,
        LAYER:29, HAS_NO_RECOIL:true, SIZE:14,
        INTANGIBLE:true, IGNORE_COLLISION:true,
        BODY:{ HEALTH:base.HEALTH*1.5, SPEED:base.SPEED*1.1 },
        SHAPE:'M -1 -1 C 1.5 -1.2 1.5 -1.2 1.5 -1.2 C 3.7 0 3.7 0 3.7 0 C 3.7 0 1.5 1.2 1.5 1.2 C -1 1 -1 1 -1 1 V -1 C -1 -1 -4 -0.2 -4 -0.2 C -4.7 -1 -4.7 -1 -4.7 -1 C -4.7 -0.3333 -4.7 0.3333 -4.7 1 C -4 0.2 -4 0.2 -4 0.2 C -4 0.2 -1 1 -1 1',
        GUNS:[
            // Wing weapon pods (6 missiles per side)
            ...[-22,-18,-14,14,18,22].flatMap((y,i)=>[
                {POSITION:[24,6,1,0,y,0,0],
                 PROPERTIES:{ SHOOT_SETTINGS:safeCS([g.basic,g.skimmer,{reload:3.5,damage:2,size:1.4}]), TYPE:'homingflankMissile' }},
            ]),
            // Nose cannon
            {POSITION:[36,4,1,0,-2,0,0],  PROPERTIES:{ SHOOT_SETTINGS:safeCS([g.basic,{reload:0.1,damage:0.02,speed:20}]), TYPE:'tank5mmRound' }},
            {POSITION:[36,4,1,0,2,0,0.1], PROPERTIES:{ SHOOT_SETTINGS:safeCS([g.basic,{reload:0.1,damage:0.02,speed:20}]), TYPE:'tank5mmRound' }},
            {POSITION:[2,15,1,30,0,0,0]},
        ],
        TURRETS:[
            {POSITION:[20,1,0,0,360,1],   TYPE:['HeliDeco1',{COLOR:'#42b4ec'}]},
            {POSITION:[24,1,0,0,360,1],   TYPE:['HeliDeco2']},
            {POSITION:[20,-4,0,0,360,1],  TYPE:['HeliDeco3']},
            {POSITION:[20,-36,0,0,360,1], TYPE:['HeliDeco4']},
            {POSITION:[22,0,0,0,360,0],   TYPE:['HeliDeco5']},
            {POSITION:[18,0,0,0,360,1],   TYPE:['HeliDeco5']},
            {POSITION:[20,1,0,0,360,1],   TYPE:['HeliDeco6']},
            {POSITION:[15,0,0,0,360,1],   TYPE:['attackPropeller',{COLOR:'darkGrey'}]},
        ],
    };

    // ── TANK DESTROYER — Ultra-fast ambush tank ───────────────────────────────
    Class.TankDestroyer_MR3 = {
        PARENT:'genericActualTank', LABEL:'Tank Destroyer', DANGER:6,
        HAS_NO_RECOIL:true, SIZE:16,
        BODY:{ HEALTH:base.HEALTH*0.9, SPEED:base.SPEED*1.25 },
        SHAPE: TANK_SHAPE,
        GUNS:[
            {POSITION:[44,12,1,0,0,0,0],  PROPERTIES:{COLOR:'#1a1a1a'}},
            {POSITION:[36,10,-1.1,0,0,0,0],PROPERTIES:{COLOR:'#333'}},
            {POSITION:[18,12,1.2,44,0,0,0],
             PROPERTIES:{ SHOOT_SETTINGS:safeCS([g.basic,g.pounder,g.destroyer,g.assassin,{reload:3.5,damage:3.5,pen:2.2,speed:18,size:1.8}]), TYPE:'developerBullet' }},
            {POSITION:[3,16,1,48,0,0,0]},
            // Pintle-mounted MG
            {POSITION:[14,2,1,0,6,0,0],   PROPERTIES:{COLOR:'darkGrey'}},
            {POSITION:[18,2,1,0,6,0,0],   PROPERTIES:{ SHOOT_SETTINGS:safeCS([g.basic,{reload:0.1,damage:0.015,speed:20}]), TYPE:'tank5mmRound' }},
        ],
        TURRETS:[ 
            {POSITION:[15,0,0,0,360,1], TYPE:['latTop',{COLOR:'darkGrey'}]},
            {POSITION:[10,0,0,0,360,1], TYPE:['latTop',{COLOR:'grey'}]},
            {POSITION:[35,0,0,0,360,0], TYPE:['TankBase',{COLOR:'#2a2a1a'}]},
        ],
    };

// ════════════════════════════════════════════════════════════════════════════
//  MENU + UPGRADE TREE
// ════════════════════════════════════════════════════════════════════════════

    Class.ActualMechsList_MR3 = {
        PARENT:'genericTank', LABEL:'Mechs', COLOR:'#555',
        SIZE:14, GUNS:[], TURRETS:[],
        UPGRADES_TIER_0:[
            'AtlasMech_MR3','GoliathMech_MR3','WraithMech_MR3','TitanMech_MR3',
            'PaladinMech_MR3','ReaperMech_MR3','ZeusMech_MR3','HydraMech_MR3',
        ],
    };
    Class.ActualShipsList_MR3 = {
        PARENT:'genericTank', LABEL:'Naval', COLOR:'#336699',
        SIZE:14, GUNS:[], TURRETS:[],
        UPGRADES_TIER_0:[
            'IowaBattleship_MR3','YamatoBattleship_MR3','TiconderogaCruiser_MR3',
            'NimitzCarrier_MR3','SeawolfSub_MR3','Gunboat_MR3',
        ],
    };
    Class.ActualRobotsList_MR3 = {
        PARENT:'genericTank', LABEL:'Robots', COLOR:'#cc3300',
        SIZE:14, GUNS:[], TURRETS:[],
        UPGRADES_TIER_0:[
            'SentinelRobot_MR3','TerminatorRobot_MR3','OverlordRobot_MR3','ColossusRobot_MR3',
        ],
    };
    Class.ActualSpecialsList_MR3 = {
        PARENT:'genericTank', LABEL:'Special', COLOR:'#335500',
        SIZE:14, GUNS:[], TURRETS:[],
        UPGRADES_TIER_0:['ApacheUltra_MR3','TankDestroyer_MR3'],
    };
    Class.militarrasMenu3_MR3 = {
        PARENT:'genericTank', LABEL:'Military III', COLOR:'#333',
        SIZE:16, GUNS:[], TURRETS:[],
        UPGRADES_TIER_0:[
            'ActualMechsList_MR3','ActualShipsList_MR3',
            'ActualRobotsList_MR3','ActualSpecialsList_MR3',
        ],
    };

    const _entry = ['menu_addons','addons']
        .find(n => Class[n] && Array.isArray(Class[n].UPGRADES_TIER_0));
    if (_entry) {
        Class[_entry].UPGRADES_TIER_0.push('militarrasMenu3_MR3');
        console.log('[militarras3] Connected to ' + _entry);
    } else {
        console.warn('[militarras3] Connect militarrasMenu3_MR3 manually.');
    }

    console.log('[militarras3] Loaded — 8 Mechs | 6 Ships | 4 Robots | 2 Specials!');
};