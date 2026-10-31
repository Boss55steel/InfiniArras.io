// ============================================================
//  ZENITH DREADS  —  Crystal/Cosmic dreadnoughts
//  All classes use "Zd" suffix — zero collisions.
//  Features custom SVG tank shapes, spinning deco turrets,
//  and 5 weapon families × 4 tiers = 80 weapon classes.
// ============================================================

const { combineStats } = require('../facilitators.js');
const _constants = require('../constants.js');
const { smshskl, base } = _constants;
const g = require('../gunvals.js');

const safeStats = stats => combineStats(stats.filter(s => s != null));

const gunCalcNames = _constants.gunCalcNames || {};
if (!gunCalcNames.trap)      gunCalcNames.trap      = 'trap';
if (!gunCalcNames.sustained) gunCalcNames.sustained = 'sustained';

// Gunval shims
if (!g.pound)       g.pound       = { reload: 1.6, recoil: 1.8, speed: 0.6, maxSpeed: 0.6, size: 1.3, damage: 1.6, pen: 1.4 };
if (!g.morerecoil)  g.morerecoil  = { recoil: 1.6 };
if (!g.assass)      g.assass      = { speed: 1.6, maxSpeed: 1.6, reload: 0.55, recoil: 0 };
if (!g.hexatrap)    g.hexatrap    = { reload: 0.7, health: 1.5, speed: 0.3, maxSpeed: 0.3 };
if (!g.pounder)     g.pounder     = { reload: 1.5, recoil: 1.4, speed: 0.65, maxSpeed: 0.65, size: 1.25, damage: 1.5 };

// ── Custom SVG shapes ─────────────────────────────────────────────────────────
// T1 — 8-pointed diamond/compass rose
const SHAPE_CRYSTAL = 'M 0 -1 L 0.24 -0.24 L 1 0 L 0.24 0.24 L 0 1 L -0.24 0.24 L -1 0 L -0.24 -0.24 Z';
// T2 — hexagram (Star of David)
const SHAPE_HEXSTAR = 'M 0 -1 L 0.289 -0.5 L 0.866 -0.5 L 0.577 0 L 0.866 0.5 L 0.289 0.5 L 0 1 L -0.289 0.5 L -0.866 0.5 L -0.577 0 L -0.866 -0.5 L -0.289 -0.5 Z';
// T3 — crux/plus cross
const SHAPE_CRUX    = 'M -0.22 -1 L 0.22 -1 L 0.22 -0.22 L 1 -0.22 L 1 0.22 L 0.22 0.22 L 0.22 1 L -0.22 1 L -0.22 0.22 L -1 0.22 L -1 -0.22 L -0.22 -0.22 Z';
// T4 — 5-pointed nova star
const SHAPE_NOVA    = 'M 0 -1 L 0.224 -0.307 L 0.951 -0.309 L 0.364 0.118 L 0.588 0.809 L 0 0.382 L -0.588 0.809 L -0.364 0.118 L -0.951 -0.309 L -0.224 -0.307 Z';
// Deco ring shapes
const SHAPE_RING8   = 'M 0 -1 L 0.18 -0.18 L 1 0 L 0.18 0.18 L 0 1 L -0.18 0.18 L -1 0 L -0.18 -0.18 Z';
const SHAPE_CROWN   = 'M -1 0.4 L -0.7 -0.4 L -0.35 0.1 L 0 -0.9 L 0.35 0.1 L 0.7 -0.4 L 1 0.4 L 0.85 0.8 L -0.85 0.8 Z';
const SHAPE_BLADE   = 'M 0 -1 L 0.18 -0.5 L 0.6 -0.3 L 0.18 0 L 0.6 0.3 L 0.18 0.5 L 0 1 L -0.18 0.5 L -0.6 0.3 L -0.18 0 L -0.6 -0.3 L -0.18 -0.5 Z';
const SHAPE_ORB     = 'M 0 -1 L 0.289 -0.5 L 0.866 -0.5 L 0.577 0 L 0.866 0.5 L 0.289 0.5 L 0 1 L -0.289 0.5 L -0.866 0.5 L -0.577 0 L -0.866 -0.5 L -0.289 -0.5 Z ' +
                      'M 0 -0.5 L 0.144 -0.25 L 0.433 -0.25 L 0.289 0 L 0.433 0.25 L 0.144 0.25 L 0 0.5 L -0.144 0.25 L -0.433 0.25 L -0.289 0 L -0.433 -0.25 L -0.144 -0.25 Z';

// ── Body stat blocks ──────────────────────────────────────────────────────────
const bodyT1Zd = { SPEED: base.SPEED*0.83, HEALTH: base.HEALTH*1.85, SHIELD: base.SHIELD*1.6,
                   REGEN: base.REGEN*1.6,  FOV: base.FOV,            RESIST: base.RESIST,      DENSITY: base.DENSITY*1.6 };
const bodyT2Zd = { SPEED: base.SPEED*0.66, HEALTH: base.HEALTH*2.7,  SHIELD: base.SHIELD*2.1,
                   REGEN: base.REGEN*2.1,  FOV: base.FOV*0.95,       RESIST: base.RESIST,      DENSITY: base.DENSITY*2.1 };
const bodyT3Zd = { SPEED: base.SPEED*0.52, HEALTH: base.HEALTH*3.8,  SHIELD: base.SHIELD*2.7,
                   REGEN: base.REGEN*2.7,  FOV: base.FOV*0.93,       RESIST: base.RESIST,      DENSITY: base.DENSITY*2.7 };
const bodyT4Zd = { SPEED: base.SPEED*0.38, HEALTH: base.HEALTH*5.0,  SHIELD: base.SHIELD*3.4,
                   REGEN: base.REGEN*3.4,  FOV: base.FOV*0.9,        RESIST: base.RESIST,      DENSITY: base.DENSITY*3.4 };

// ── Angle helpers ─────────────────────────────────────────────────────────────
const a2  = [0,180];
const a3  = [0,120,240];
const a4  = [0,90,180,270];
const a5  = [0,72,144,216,288];
const a5o = [36,108,180,252,324];
const a6  = [0,60,120,180,240,300];
const a8  = [0,45,90,135,180,225,270,315];
const a10 = [0,36,72,108,144,180,216,252,288,324];

// ── Gun builder functions ─────────────────────────────────────────────────────

// PRISM GUN — 3-barrel fan, thin spread (like light through a prism)
function prismGunZd(angle=0, delay=0, stats=[g.basic]) {
    return [
        { POSITION: [17, 4.5, 1, 0, 0, angle-12, delay],
          PROPERTIES: { SHOOT_SETTINGS: safeStats([...stats,{spray:2}]), TYPE:'bullet',
            COLOR:{BASE:-1,BRIGHTNESS_SHIFT:-8,SATURATION_SHIFT:0.7} } },
        { POSITION: [18, 5, 1, 0, 0, angle, delay+0.15],
          PROPERTIES: { SHOOT_SETTINGS: safeStats([...stats,{spray:1}]), TYPE:'bullet',
            COLOR:{BASE:17,BRIGHTNESS_SHIFT:10} } },
        { POSITION: [17, 4.5, 1, 0, 0, angle+12, delay+0.3],
          PROPERTIES: { SHOOT_SETTINGS: safeStats([...stats,{spray:2}]), TYPE:'bullet',
            COLOR:{BASE:-1,BRIGHTNESS_SHIFT:-15,SATURATION_SHIFT:0.7} } },
        { POSITION: [14, 7, -1.3, 0, 0, angle, 0],
          PROPERTIES: { COLOR:{BASE:4,BRIGHTNESS_SHIFT:8} } },
    ];
}

// RIFT GUN — ultra-long precision sniper, creates a visual "tear"
function riftGunZd(angle=0, delay=0, stats=[g.sniper]) {
    return [
        { POSITION: [28, 5, 1, 0, 0, angle, delay],
          PROPERTIES: { SHOOT_SETTINGS: safeStats([...stats,g.assass]), TYPE:'bullet',
            COLOR:{BASE:17,BRIGHTNESS_SHIFT:-5} } },
        { POSITION: [24, 3, -0.5, 0, 0, angle, delay],
          PROPERTIES: { SHOOT_SETTINGS: safeStats([...stats,g.fake]), TYPE:'bullet',
            COLOR:{BASE:-1,BRIGHTNESS_SHIFT:8,SATURATION_SHIFT:0.4}, BORDERLESS:true } },
        { POSITION: [9, 5.5, -1.7, 7, 2.5, angle, 0],
          PROPERTIES: { COLOR:{BASE:4,BRIGHTNESS_SHIFT:15} } },
        { POSITION: [9, 5.5, -1.7, 7, -2.5, angle, 0],
          PROPERTIES: { COLOR:{BASE:4,BRIGHTNESS_SHIFT:15} } },
        { POSITION: [4, 3.5, 0.5, 23, 0, angle, 0],
          PROPERTIES: { COLOR:{BASE:17,BRIGHTNESS_SHIFT:20} } },
    ];
}

// NEBULA GUN — wide explosive cloud burst
function nebulaGunZd(angle=0, delay=0, stats=[g.basic]) {
    return [
        { POSITION: [12, 13, 1.3, 0, 0, angle, delay],
          PROPERTIES: { SHOOT_SETTINGS: safeStats([...stats,g.pound,{spray:6,reload:1.5}]), TYPE:'bullet',
            COLOR:{BASE:-1,BRIGHTNESS_SHIFT:-10,SATURATION_SHIFT:0.5} } },
        { POSITION: [10, 10, -1.1, 0, 0, angle, delay],
          PROPERTIES: { SHOOT_SETTINGS: safeStats([...stats,g.pound,g.fake]), TYPE:'bullet',
            COLOR:{BASE:-1,BRIGHTNESS_SHIFT:5}, BORDERLESS:true } },
        { POSITION: [5.5, 15, 1.4, 0, 0, angle, 0],
          PROPERTIES: { COLOR:{BASE:5,BRIGHTNESS_SHIFT:-8} } },
        { POSITION: [3.5, 11, -1.6, 1.5, 0, angle, 0],
          PROPERTIES: { COLOR:{BASE:5,BRIGHTNESS_SHIFT:10} } },
    ];
}

// CORONA GUN — powerful solar burst with crown arrangement
function coronaGunZd(angle=0, delay=0, stats=[g.basic]) {
    return [
        { POSITION: [15, 10, 1.1, 0, 0, angle, delay],
          PROPERTIES: { SHOOT_SETTINGS: safeStats([...stats,g.pound,g.power]), TYPE:'bullet',
            COLOR:{BASE:3,BRIGHTNESS_SHIFT:-5} } },
        { POSITION: [12, 7.5, -0.9, 0, 0, angle, delay],
          PROPERTIES: { SHOOT_SETTINGS: safeStats([...stats,g.pound,g.fake]), TYPE:'bullet',
            COLOR:{BASE:6,BRIGHTNESS_SHIFT:8}, BORDERLESS:true } },
        { POSITION: [7.5, 11.5, 1.25, 0, 0, angle, 0],
          PROPERTIES: { COLOR:{BASE:6,BRIGHTNESS_SHIFT:16} } },
        { POSITION: [4, 8, 1.4, 0, 4, angle+18, 0],
          PROPERTIES: { COLOR:{BASE:3,BRIGHTNESS_SHIFT:5} } },
        { POSITION: [4, 8, 1.4, 0, -4, angle-18, 0],
          PROPERTIES: { COLOR:{BASE:3,BRIGHTNESS_SHIFT:5} } },
    ];
}

// SHARD GUN — angular crystal trap layer
function shardGunZd(angle=0, delay=0, stats=[g.trap]) {
    return [
        { POSITION: [15, 6.5, 1, 0, 0, angle, 0],
          PROPERTIES: { COLOR:{BASE:17,BRIGHTNESS_SHIFT:10} } },
        { POSITION: [10, 4.5, 0.65, 0, 0, angle, 0],
          PROPERTIES: { COLOR:{BASE:-1,BRIGHTNESS_SHIFT:-6} } },
        { POSITION: [4, 8.5, 1.65, 15, 0, angle, delay],
          PROPERTIES: { SHOOT_SETTINGS: safeStats([...stats,g.hexatrap]), TYPE:'trap',
            STAT_CALCULATOR: gunCalcNames.trap, COLOR:{BASE:-1,BRIGHTNESS_SHIFT:-14} } },
        { POSITION: [3.5, 6.5, -1.7, 12, 3, angle, 0],
          PROPERTIES: { COLOR:{BASE:4,BRIGHTNESS_SHIFT:12} } },
        { POSITION: [3.5, 6.5, -1.7, 12, -3, angle, 0],
          PROPERTIES: { COLOR:{BASE:4,BRIGHTNESS_SHIFT:12} } },
    ];
}

// CANNON GUN — heavy single-shot destroyer barrel
function cannonGunZd(angle=0, delay=0, stats=[g.basic]) {
    return [
        { POSITION: [17, 14, 1, 0, 0, angle, delay],
          PROPERTIES: { SHOOT_SETTINGS: safeStats([...stats,g.pound,{reload:1.7}]), TYPE:'bullet',
            COLOR:{BASE:-1,BRIGHTNESS_SHIFT:-18,SATURATION_SHIFT:0.5} } },
        { POSITION: [13, 11, -1.15, 0, 0, angle, delay],
          PROPERTIES: { SHOOT_SETTINGS: safeStats([...stats,g.pound,g.fake]), TYPE:'bullet',
            COLOR:{BASE:-1,BRIGHTNESS_SHIFT:-6}, BORDERLESS:true } },
        { POSITION: [8, 15.5, 1.25, 0, 0, angle, 0],
          PROPERTIES: { COLOR:{BASE:3,BRIGHTNESS_SHIFT:14} } },
        { POSITION: [5.5, 10, -1.55, 2, 0, angle, 0],
          PROPERTIES: { COLOR:{BASE:17,BRIGHTNESS_SHIFT:8} } },
    ];
}

module.exports = ({ Class }) => {

    // ── Decorative turret classes ────────────────────────────────────────────
    Class.crystalDecoZd = {
        PARENT: ['genericTank'], SHAPE: SHAPE_RING8,
        COLOR: 4, MIRROR_MASTER_ANGLE: true,
        CONTROLLERS: [['spin',{speed:0.035}]], INDEPENDENT: true,
        LABEL: '', GUNS: [],
    };
    Class.starDecoZd = {
        PARENT: ['genericTank'], SHAPE: SHAPE_HEXSTAR,
        COLOR: 17, MIRROR_MASTER_ANGLE: true,
        CONTROLLERS: [['spin',{speed:-0.025}]], INDEPENDENT: true,
        LABEL: '', GUNS: [],
    };
    Class.crownDecoZd = {
        PARENT: ['genericTank'], SHAPE: SHAPE_CROWN,
        COLOR: 3, MIRROR_MASTER_ANGLE: true,
        CONTROLLERS: [['spin',{speed:0.04}]], INDEPENDENT: true,
        LABEL: '', GUNS: [],
    };
    Class.bladeDecoZd = {
        PARENT: ['genericTank'], SHAPE: SHAPE_BLADE,
        COLOR: 12, MIRROR_MASTER_ANGLE: true,
        CONTROLLERS: [['spin',{speed:-0.045}]], INDEPENDENT: true,
        LABEL: '', GUNS: [],
    };
    Class.orbDecoZd = {
        PARENT: ['genericTank'], SHAPE: SHAPE_ORB,
        COLOR: 8, MIRROR_MASTER_ANGLE: true,
        CONTROLLERS: [['spin',{speed:0.03}]], INDEPENDENT: true,
        LABEL: '', GUNS: [],
    };

    // ── Generic body classes ─────────────────────────────────────────────────
    Class.genericCrystalZd = {
        PARENT: ['genericTank'], BODY: bodyT1Zd,
        SHAPE: SHAPE_CRYSTAL, COLOR: 4, SIZE: 14, DANGER: 8,
        SKILL_CAP: Array(10).fill(smshskl),
        REROOT_UPGRADE_TREE: ['weaponRootZd','bodyRootZd'],
    };
    Class.genericStarZd = {
        PARENT: ['genericTank'], BODY: bodyT2Zd,
        SHAPE: SHAPE_HEXSTAR, COLOR: 17, SIZE: 18, DANGER: 9,
        SKILL_CAP: Array(10).fill(smshskl),
        REROOT_UPGRADE_TREE: ['weaponRootZd','bodyRootZd'],
    };
    Class.genericCruxZd = {
        PARENT: ['genericTank'], BODY: bodyT3Zd,
        SHAPE: SHAPE_CRUX, COLOR: 12, SIZE: 22, DANGER: 10,
        SKILL_CAP: Array(10).fill(smshskl),
        REROOT_UPGRADE_TREE: ['weaponRootZd','bodyRootZd'],
    };
    Class.genericNovaZd = {
        PARENT: ['genericTank'], BODY: bodyT4Zd,
        SHAPE: SHAPE_NOVA, COLOR: 3, SIZE: 24, DANGER: 11,
        SKILL_CAP: Array(10).fill(smshskl),
        REROOT_UPGRADE_TREE: ['weaponRootZd','bodyRootZd'],
    };

    // ── Entry + branch roots ─────────────────────────────────────────────────
    Class.dreadZd = {
        PARENT: ['genericCrystalZd'],
        LABEL: 'Zenith Dreadnought', UPGRADE_LABEL: 'Zenith Dreads',
        LEVEL: 90, EXTRA_SKILL: 18, GUNS: [],
        TURRETS: [{ POSITION:[16,0,0,0,0,1], TYPE:'crystalDecoZd' }],
    };
    Class.weaponRootZd = { LABEL:'', COLOR:4, REROOT_UPGRADE_TREE:'weaponRootZd' };
    Class.bodyRootZd   = { LABEL:'', COLOR:4, REROOT_UPGRADE_TREE:'bodyRootZd' };

    // ════════════════════════════════════════════════════════════════════════
    //  ██████  ██████  ██ ███████ ███    ███     ███████  █████  ███    ███
    //  ██   ██ ██   ██ ██ ██      ████  ████     ██      ██   ██ ████  ████
    //  ██████  ██████  ██ ███████ ██ ████ ██     █████   ███████ ██ ████ ██
    //  ██      ██   ██ ██      ██ ██  ██  ██     ██      ██   ██ ██  ██  ██
    //  ██      ██   ██ ██ ███████ ██      ██     ██      ██   ██ ██      ██
    // ════════════════════════════════════════════════════════════════════════

    // ── PRISM FAMILY (spread/gunner) ─────────────────────────────────────────
    Class.prismZd = { PARENT:['genericCrystalZd'], LABEL:'Prism', GUNS:[...a2.flatMap(a=>prismGunZd(a,0,[g.basic]))],
        TURRETS:[{POSITION:[14,0,0,0,0,1],TYPE:'crystalDecoZd'}] };

    // T2 Prism
    Class.facetZd      = { PARENT:['genericStarZd'],  LABEL:'Facet',
        GUNS:[...a4.flatMap(a=>prismGunZd(a,0,[g.basic,g.flank]))],
        TURRETS:[{POSITION:[16,0,0,0,0,1],TYPE:'crystalDecoZd'}] };
    Class.rayZd        = { PARENT:['genericStarZd'],  LABEL:'Ray',
        GUNS:[...a2.flatMap(a=>prismGunZd(a,0,[g.basic,g.mach]))],
        TURRETS:[{POSITION:[16,0,0,0,0,1],TYPE:'starDecoZd'}] };
    Class.lensZd       = { PARENT:['genericStarZd'],  LABEL:'Lens',
        GUNS:[...a4.flatMap(a=>prismGunZd(a,0,[g.basic,g.gunner]))],
        TURRETS:[{POSITION:[16,0,0,0,0,1],TYPE:'crystalDecoZd'}] };
    Class.beamZd       = { PARENT:['genericStarZd'],  LABEL:'Beam',
        GUNS:[...a6.flatMap(a=>prismGunZd(a,0,[g.basic,{reload:0.75}]))],
        TURRETS:[{POSITION:[16,0,0,0,0,1],TYPE:'starDecoZd'}] };
    Class.angleZd      = { PARENT:['genericStarZd'],  LABEL:'Angle',
        GUNS:[...a2.flatMap(a=>[...prismGunZd(a,0,[g.basic,g.twin]),...prismGunZd(a+45,0.5,[g.basic,g.twin])])],
        TURRETS:[{POSITION:[16,0,0,0,0,1],TYPE:'crystalDecoZd'}] };

    // T3 Prism
    Class.spectrumZd   = { PARENT:['genericCruxZd'],  LABEL:'Spectrum',
        GUNS:[...a6.flatMap(a=>prismGunZd(a,0,[g.basic,g.flank,g.mach]))],
        TURRETS:[{POSITION:[20,0,0,0,0,1],TYPE:'starDecoZd'},{POSITION:[12,0,0,0,0,1],TYPE:'crystalDecoZd'}] };
    Class.chromeZd     = { PARENT:['genericCruxZd'],  LABEL:'Chrome',
        GUNS:[...a4.flatMap(a=>[...prismGunZd(a,0,[g.basic,g.gunner,g.mach]),...prismGunZd(a+45,0.4,[g.basic,g.gunner,g.mach])])],
        TURRETS:[{POSITION:[20,0,0,0,0,1],TYPE:'crystalDecoZd'}] };
    Class.prismaticZd  = { PARENT:['genericCruxZd'],  LABEL:'Prismatic',
        GUNS:[...a8.flatMap(a=>prismGunZd(a,0,[g.basic,g.twin,{reload:0.7}]))],
        TURRETS:[{POSITION:[20,0,0,0,0,1],TYPE:'starDecoZd'}] };
    Class.opalZd       = { PARENT:['genericCruxZd'],  LABEL:'Opal',
        GUNS:[...a3.flatMap(a=>[...prismGunZd(a,0,[g.basic,g.power,g.mach]),...prismGunZd(a+60,0.5,[g.basic,g.power,g.mach])])],
        TURRETS:[{POSITION:[20,0,0,0,0,1],TYPE:'orbDecoZd'}] };
    Class.iridZd       = { PARENT:['genericCruxZd'],  LABEL:'Iridescent',
        GUNS:[...a5.flatMap(a=>prismGunZd(a,0,[g.basic,g.flank,g.twin]))],
        TURRETS:[{POSITION:[20,0,0,0,0,1],TYPE:'starDecoZd'},{POSITION:[11,0,0,0,0,1],TYPE:'crystalDecoZd'}] };

    // T4 Prism finals
    Class.rainbowZd    = { PARENT:['genericNovaZd'], LABEL:'Rainbow',
        GUNS:[...a10.flatMap(a=>prismGunZd(a,0,[g.basic,g.twin,g.mach]))],
        TURRETS:[{POSITION:[22,0,0,0,0,1],TYPE:'starDecoZd'},{POSITION:[14,0,0,0,0,1],TYPE:'crystalDecoZd'}] };
    Class.kaleidoZd    = { PARENT:['genericNovaZd'], LABEL:'Kaleidoscope',
        GUNS:[...a5.flatMap(a=>[...prismGunZd(a,0,[g.basic,g.flank,g.power]),...prismGunZd(a+36,0.5,[g.basic,g.flank,g.power])])],
        TURRETS:[{POSITION:[22,0,0,0,0,1],TYPE:'orbDecoZd'}] };
    Class.shimmerZd    = { PARENT:['genericNovaZd'], LABEL:'Shimmer',
        GUNS:[...a8.flatMap(a=>[...prismGunZd(a,0,[g.basic,g.mach,g.gunner]),...prismGunZd(a+22.5,0.25,[g.basic,g.mach,g.gunner])])],
        TURRETS:[{POSITION:[22,0,0,0,0,1],TYPE:'crystalDecoZd'},{POSITION:[13,0,0,0,0,1],TYPE:'starDecoZd'}] };
    Class.lusterZd     = { PARENT:['genericNovaZd'], LABEL:'Luster',
        GUNS:[...a6.flatMap(a=>[...prismGunZd(a,0,[g.basic,g.twin,g.power,g.mach]),...prismGunZd(a+30,0.33,[g.basic,g.twin,g.power,g.mach])])],
        TURRETS:[{POSITION:[22,0,0,0,0,1],TYPE:'starDecoZd'}] };
    Class.holoZd       = { PARENT:['genericNovaZd'], LABEL:'Holo-Nova',
        GUNS:[...a10.flatMap(a=>prismGunZd(a,0,[g.basic,g.flank,g.mach,{spray:2}]))],
        TURRETS:[{POSITION:[22,0,0,0,0,1],TYPE:'starDecoZd'},{POSITION:[14,0,0,0,0,1],TYPE:'orbDecoZd'},{POSITION:[8,0,0,0,0,1],TYPE:'crystalDecoZd'}] };

    // ── RIFT FAMILY (sniper/precision) ────────────────────────────────────────
    Class.riftZd = { PARENT:['genericCrystalZd'], LABEL:'Rift',
        GUNS:[...a2.flatMap(a=>riftGunZd(a,0,[g.sniper]))],
        TURRETS:[{POSITION:[14,0,0,0,0,1],TYPE:'starDecoZd'}] };

    // T2 Rift
    Class.tearZd       = { PARENT:['genericStarZd'],  LABEL:'Tear',
        GUNS:[...a4.flatMap(a=>riftGunZd(a,0,[g.sniper,g.assass]))],
        TURRETS:[{POSITION:[16,0,0,0,0,1],TYPE:'starDecoZd'}] };
    Class.fissureZd    = { PARENT:['genericStarZd'],  LABEL:'Fissure',
        GUNS:[...a2.flatMap(a=>riftGunZd(a,0,[g.sniper,g.mach]))],
        TURRETS:[{POSITION:[16,0,0,0,0,1],TYPE:'crystalDecoZd'}] };
    Class.crackZd      = { PARENT:['genericStarZd'],  LABEL:'Crack',
        GUNS:[...a6.flatMap(a=>riftGunZd(a,0,[g.sniper,{reload:0.6}]))],
        TURRETS:[{POSITION:[16,0,0,0,0,1],TYPE:'starDecoZd'}] };
    Class.cleftZd      = { PARENT:['genericStarZd'],  LABEL:'Cleft',
        GUNS:[...a2.flatMap(a=>[...riftGunZd(a,0,[g.sniper,g.assass]),...riftGunZd(a+90,0.5,[g.sniper,g.assass])])],
        TURRETS:[{POSITION:[16,0,0,0,0,1],TYPE:'bladeDecoZd'}] };
    Class.spliceZd     = { PARENT:['genericStarZd'],  LABEL:'Splice',
        GUNS:[...a4.flatMap(a=>riftGunZd(a,0,[g.sniper,g.power]))],
        TURRETS:[{POSITION:[16,0,0,0,0,1],TYPE:'crystalDecoZd'}] };

    // T3 Rift
    Class.abyssZd      = { PARENT:['genericCruxZd'],  LABEL:'Abyss',
        GUNS:[...a5.flatMap(a=>riftGunZd(a,0,[g.sniper,g.assass,g.mach]))],
        TURRETS:[{POSITION:[20,0,0,0,0,1],TYPE:'bladeDecoZd'},{POSITION:[11,0,0,0,0,1],TYPE:'starDecoZd'}] };
    Class.chasmZd      = { PARENT:['genericCruxZd'],  LABEL:'Chasm',
        GUNS:[...a4.flatMap(a=>[...riftGunZd(a,0,[g.sniper,g.assass]),...riftGunZd(a+45,0.5,[g.sniper,g.assass])])],
        TURRETS:[{POSITION:[20,0,0,0,0,1],TYPE:'starDecoZd'}] };
    Class.gulchZd      = { PARENT:['genericCruxZd'],  LABEL:'Gulch',
        GUNS:[...a6.flatMap(a=>riftGunZd(a,0,[g.sniper,g.mach,{reload:0.65}]))],
        TURRETS:[{POSITION:[20,0,0,0,0,1],TYPE:'crystalDecoZd'}] };
    Class.gapZd        = { PARENT:['genericCruxZd'],  LABEL:'Gap',
        GUNS:[...a3.flatMap(a=>[...riftGunZd(a,0,[g.sniper,g.power,g.assass]),...riftGunZd(a+60,0.5,[g.sniper,g.power,g.assass])])],
        TURRETS:[{POSITION:[20,0,0,0,0,1],TYPE:'bladeDecoZd'}] };
    Class.schismZd     = { PARENT:['genericCruxZd'],  LABEL:'Schism',
        GUNS:[...a8.flatMap(a=>riftGunZd(a,0,[g.sniper,g.assass,{reload:0.7}]))],
        TURRETS:[{POSITION:[20,0,0,0,0,1],TYPE:'starDecoZd'},{POSITION:[11,0,0,0,0,1],TYPE:'bladeDecoZd'}] };

    // T4 Rift finals
    Class.riftNovaZd   = { PARENT:['genericNovaZd'], LABEL:'Rift Nova',
        GUNS:[...a10.flatMap(a=>riftGunZd(a,0,[g.sniper,g.assass,g.mach]))],
        TURRETS:[{POSITION:[22,0,0,0,0,1],TYPE:'bladeDecoZd'},{POSITION:[13,0,0,0,0,1],TYPE:'starDecoZd'}] };
    Class.fractureZd   = { PARENT:['genericNovaZd'], LABEL:'Fracture',
        GUNS:[...a5.flatMap(a=>[...riftGunZd(a,0,[g.sniper,g.assass,g.power]),...riftGunZd(a+36,0.5,[g.sniper,g.assass,g.power])])],
        TURRETS:[{POSITION:[22,0,0,0,0,1],TYPE:'starDecoZd'}] };
    Class.shatterZd    = { PARENT:['genericNovaZd'], LABEL:'Shatter',
        GUNS:[...a8.flatMap(a=>[...riftGunZd(a,0,[g.sniper,g.mach,g.assass]),...prismGunZd(a+22.5,0.25,[g.basic,g.twin,g.mach])])],
        TURRETS:[{POSITION:[22,0,0,0,0,1],TYPE:'bladeDecoZd'},{POSITION:[14,0,0,0,0,1],TYPE:'crystalDecoZd'}] };
    Class.splitNovaZd  = { PARENT:['genericNovaZd'], LABEL:'Split Nova',
        GUNS:[...a6.flatMap(a=>[...riftGunZd(a,0,[g.sniper,g.power,g.assass,g.mach]),...riftGunZd(a+30,0.4,[g.sniper,g.power,g.assass,g.mach])])],
        TURRETS:[{POSITION:[22,0,0,0,0,1],TYPE:'crystalDecoZd'}] };
    Class.voidlineZd   = { PARENT:['genericNovaZd'], LABEL:'Voidline',
        GUNS:[...a10.flatMap(a=>riftGunZd(a,0,[g.sniper,g.assass,g.power,{reload:0.55}]))],
        TURRETS:[{POSITION:[22,0,0,0,0,1],TYPE:'bladeDecoZd'},{POSITION:[14,0,0,0,0,1],TYPE:'starDecoZd'},{POSITION:[8,0,0,0,0,1],TYPE:'bladeDecoZd'}] };

    // ── NEBULA FAMILY (heavy/wide) ────────────────────────────────────────────
    Class.nebulaZd = { PARENT:['genericCrystalZd'], LABEL:'Nebula',
        GUNS:[...a2.flatMap(a=>nebulaGunZd(a,0,[g.basic,g.pound]))],
        TURRETS:[{POSITION:[14,0,0,0,0,1],TYPE:'orbDecoZd'}] };

    // T2 Nebula
    Class.gasZd        = { PARENT:['genericStarZd'],  LABEL:'Gas Cloud',
        GUNS:[...a4.flatMap(a=>nebulaGunZd(a,0,[g.basic,g.pound,g.power]))],
        TURRETS:[{POSITION:[16,0,0,0,0,1],TYPE:'orbDecoZd'}] };
    Class.plumeZd      = { PARENT:['genericStarZd'],  LABEL:'Plume',
        GUNS:[...a3.flatMap(a=>[...nebulaGunZd(a,0,[g.basic,g.pound]),...nebulaGunZd(a+60,0.5,[g.basic,g.pound])])],
        TURRETS:[{POSITION:[16,0,0,0,0,1],TYPE:'starDecoZd'}] };
    Class.cloudZd      = { PARENT:['genericStarZd'],  LABEL:'Cloud',
        GUNS:[...a6.flatMap(a=>nebulaGunZd(a,0,[g.basic,g.pound,{reload:1.3}]))],
        TURRETS:[{POSITION:[16,0,0,0,0,1],TYPE:'orbDecoZd'}] };
    Class.driftZd      = { PARENT:['genericStarZd'],  LABEL:'Drift',
        GUNS:[...a2.flatMap(a=>nebulaGunZd(a,0,[g.basic,g.pound,g.mach,{spray:4}]))],
        TURRETS:[{POSITION:[16,0,0,0,0,1],TYPE:'crystalDecoZd'}] };
    Class.dustZd       = { PARENT:['genericStarZd'],  LABEL:'Dust',
        GUNS:[...a5.flatMap(a=>nebulaGunZd(a,0,[g.basic,g.pound,{spray:8}]))],
        TURRETS:[{POSITION:[16,0,0,0,0,1],TYPE:'orbDecoZd'}] };

    // T3 Nebula
    Class.densityZd    = { PARENT:['genericCruxZd'],  LABEL:'Density',
        GUNS:[...a5.flatMap(a=>[...nebulaGunZd(a,0,[g.basic,g.pound,g.power]),...nebulaGunZd(a+36,0.5,[g.basic,g.pound,g.power])])],
        TURRETS:[{POSITION:[20,0,0,0,0,1],TYPE:'orbDecoZd'},{POSITION:[11,0,0,0,0,1],TYPE:'starDecoZd'}] };
    Class.coreZd       = { PARENT:['genericCruxZd'],  LABEL:'Core',
        GUNS:[...a4.flatMap(a=>[...nebulaGunZd(a,0,[g.basic,g.pound,g.power,{reload:1.4}]),...nebulaGunZd(a+45,0.5,[g.basic,g.pound,g.power,{reload:1.4}])])],
        TURRETS:[{POSITION:[20,0,0,0,0,1],TYPE:'orbDecoZd'}] };
    Class.collapseZd   = { PARENT:['genericCruxZd'],  LABEL:'Collapse',
        GUNS:[...a8.flatMap(a=>nebulaGunZd(a,0,[g.basic,g.pound,{spray:6,reload:1.4}]))],
        TURRETS:[{POSITION:[20,0,0,0,0,1],TYPE:'starDecoZd'}] };
    Class.pressureZd   = { PARENT:['genericCruxZd'],  LABEL:'Pressure',
        GUNS:[...a3.flatMap(a=>[...nebulaGunZd(a,0,[g.basic,g.pound,g.power,g.mach]),...nebulaGunZd(a+60,0.33,[g.basic,g.pound,g.power,g.mach])])],
        TURRETS:[{POSITION:[20,0,0,0,0,1],TYPE:'orbDecoZd'},{POSITION:[12,0,0,0,0,1],TYPE:'crownDecoZd'}] };
    Class.clusterZd    = { PARENT:['genericCruxZd'],  LABEL:'Cluster',
        GUNS:[...a6.flatMap(a=>[...nebulaGunZd(a,0,[g.basic,g.pound,g.power]),...nebulaGunZd(a+30,0.4,[g.basic,g.pound,g.power])])],
        TURRETS:[{POSITION:[20,0,0,0,0,1],TYPE:'orbDecoZd'}] };

    // T4 Nebula finals
    Class.superclusterZd={ PARENT:['genericNovaZd'], LABEL:'Supercluster',
        GUNS:[...a10.flatMap(a=>nebulaGunZd(a,0,[g.basic,g.pound,g.power,{spray:5}]))],
        TURRETS:[{POSITION:[22,0,0,0,0,1],TYPE:'orbDecoZd'},{POSITION:[14,0,0,0,0,1],TYPE:'starDecoZd'}] };
    Class.pulsar2Zd    = { PARENT:['genericNovaZd'], LABEL:'Pulsar',
        GUNS:[...a5.flatMap(a=>[...nebulaGunZd(a,0,[g.basic,g.pound,g.mach]),...nebulaGunZd(a+36,0.5,[g.basic,g.pound,g.mach])])],
        TURRETS:[{POSITION:[22,0,0,0,0,1],TYPE:'crownDecoZd'}] };
    Class.magnetarZd   = { PARENT:['genericNovaZd'], LABEL:'Magnetar',
        GUNS:[...a8.flatMap(a=>[...nebulaGunZd(a,0,[g.basic,g.pound,g.power,{reload:1.3}]),...prismGunZd(a+22.5,0.25,[g.basic,g.mach])])],
        TURRETS:[{POSITION:[22,0,0,0,0,1],TYPE:'orbDecoZd'},{POSITION:[13,0,0,0,0,1],TYPE:'crystalDecoZd'}] };
    Class.quasarZd     = { PARENT:['genericNovaZd'], LABEL:'Quasar',
        GUNS:[...a5.flatMap(a=>[...nebulaGunZd(a,0,[g.basic,g.pound,g.power,g.mach]),...nebulaGunZd(a+36,0.5,[g.basic,g.pound,g.power,g.mach]),...riftGunZd(a+18,0.25,[g.sniper,g.assass])])],
        TURRETS:[{POSITION:[22,0,0,0,0,1],TYPE:'crownDecoZd'},{POSITION:[14,0,0,0,0,1],TYPE:'orbDecoZd'}] };
    Class.hyperZd      = { PARENT:['genericNovaZd'], LABEL:'Hypernova',
        GUNS:[...a10.flatMap(a=>[...nebulaGunZd(a,0,[g.basic,g.pound,g.power,g.mach,{spray:4}]),...cannonGunZd(a+18,0.5,[g.basic,g.pound,g.power])])],
        TURRETS:[{POSITION:[22,0,0,0,0,1],TYPE:'orbDecoZd'},{POSITION:[14,0,0,0,0,1],TYPE:'starDecoZd'},{POSITION:[8,0,0,0,0,1],TYPE:'crownDecoZd'}] };

    // ── CORONA FAMILY (powerful burst) ────────────────────────────────────────
    Class.coronaZd = { PARENT:['genericCrystalZd'], LABEL:'Corona',
        GUNS:[...a2.flatMap(a=>coronaGunZd(a,0,[g.basic,g.pound]))],
        TURRETS:[{POSITION:[14,0,0,0,0,1],TYPE:'crownDecoZd'}] };

    // T2 Corona
    Class.flareZd      = { PARENT:['genericStarZd'],  LABEL:'Flare',
        GUNS:[...a4.flatMap(a=>coronaGunZd(a,0,[g.basic,g.pound,g.power]))],
        TURRETS:[{POSITION:[16,0,0,0,0,1],TYPE:'crownDecoZd'}] };
    Class.solarWindZd  = { PARENT:['genericStarZd'],  LABEL:'Solar Wind',
        GUNS:[...a6.flatMap(a=>coronaGunZd(a,0,[g.basic,g.pound,g.mach]))],
        TURRETS:[{POSITION:[16,0,0,0,0,1],TYPE:'orbDecoZd'}] };
    Class.radiantZd    = { PARENT:['genericStarZd'],  LABEL:'Radiant',
        GUNS:[...a2.flatMap(a=>[...coronaGunZd(a,0,[g.basic,g.pound,g.power]),...coronaGunZd(a+90,0.5,[g.basic,g.pound,g.power])])],
        TURRETS:[{POSITION:[16,0,0,0,0,1],TYPE:'crownDecoZd'}] };
    Class.scorchZd     = { PARENT:['genericStarZd'],  LABEL:'Scorch',
        GUNS:[...a3.flatMap(a=>coronaGunZd(a,0,[g.basic,g.pound,g.morerecoil]))],
        TURRETS:[{POSITION:[16,0,0,0,0,1],TYPE:'starDecoZd'}] };
    Class.ignitZd      = { PARENT:['genericStarZd'],  LABEL:'Ignite',
        GUNS:[...a4.flatMap(a=>[...coronaGunZd(a,0,[g.basic,g.pound]),...coronaGunZd(a+45,0.5,[g.basic,g.pound])])],
        TURRETS:[{POSITION:[16,0,0,0,0,1],TYPE:'crownDecoZd'}] };

    // T3 Corona
    Class.infernoZd    = { PARENT:['genericCruxZd'],  LABEL:'Inferno',
        GUNS:[...a5.flatMap(a=>coronaGunZd(a,0,[g.basic,g.pound,g.power,g.morerecoil]))],
        TURRETS:[{POSITION:[20,0,0,0,0,1],TYPE:'crownDecoZd'},{POSITION:[11,0,0,0,0,1],TYPE:'orbDecoZd'}] };
    Class.furnaceZd    = { PARENT:['genericCruxZd'],  LABEL:'Furnace',
        GUNS:[...a4.flatMap(a=>[...coronaGunZd(a,0,[g.basic,g.pound,g.power,g.mach]),...coronaGunZd(a+45,0.5,[g.basic,g.pound,g.power,g.mach])])],
        TURRETS:[{POSITION:[20,0,0,0,0,1],TYPE:'crownDecoZd'}] };
    Class.combustZd    = { PARENT:['genericCruxZd'],  LABEL:'Combustion',
        GUNS:[...a6.flatMap(a=>coronaGunZd(a,0,[g.basic,g.pound,g.power,{reload:1.4}]))],
        TURRETS:[{POSITION:[20,0,0,0,0,1],TYPE:'orbDecoZd'}] };
    Class.blazonZd     = { PARENT:['genericCruxZd'],  LABEL:'Blazon',
        GUNS:[...a8.flatMap(a=>coronaGunZd(a,0,[g.basic,g.pound,g.mach]))],
        TURRETS:[{POSITION:[20,0,0,0,0,1],TYPE:'crownDecoZd'},{POSITION:[11,0,0,0,0,1],TYPE:'starDecoZd'}] };
    Class.incineZd     = { PARENT:['genericCruxZd'],  LABEL:'Incinerator',
        GUNS:[...a3.flatMap(a=>[...coronaGunZd(a,0,[g.basic,g.pound,g.power,g.morerecoil]),...coronaGunZd(a+60,0.5,[g.basic,g.pound,g.power,g.morerecoil])])],
        TURRETS:[{POSITION:[20,0,0,0,0,1],TYPE:'crownDecoZd'}] };

    // T4 Corona finals
    Class.solarStormZd = { PARENT:['genericNovaZd'], LABEL:'Solar Storm',
        GUNS:[...a10.flatMap(a=>coronaGunZd(a,0,[g.basic,g.pound,g.power,g.mach]))],
        TURRETS:[{POSITION:[22,0,0,0,0,1],TYPE:'crownDecoZd'},{POSITION:[13,0,0,0,0,1],TYPE:'orbDecoZd'}] };
    Class.heliosZd     = { PARENT:['genericNovaZd'], LABEL:'Helios',
        GUNS:[...a5.flatMap(a=>[...coronaGunZd(a,0,[g.basic,g.pound,g.power,g.mach]),...coronaGunZd(a+36,0.5,[g.basic,g.pound,g.power,g.mach]),...cannonGunZd(a+18,0.25,[g.basic,g.pound,g.power])])],
        TURRETS:[{POSITION:[22,0,0,0,0,1],TYPE:'crownDecoZd'}] };
    Class.stellarCoreZd={ PARENT:['genericNovaZd'], LABEL:'Stellar Core',
        GUNS:[...a8.flatMap(a=>[...coronaGunZd(a,0,[g.basic,g.pound,g.power,g.morerecoil]),...nebulaGunZd(a+22.5,0.25,[g.basic,g.pound,{spray:4}])])],
        TURRETS:[{POSITION:[22,0,0,0,0,1],TYPE:'crownDecoZd'},{POSITION:[14,0,0,0,0,1],TYPE:'crownDecoZd'}] };
    Class.coronaMassZd = { PARENT:['genericNovaZd'], LABEL:'Coronal Mass',
        GUNS:[...a5.flatMap(a=>[...coronaGunZd(a,0,[g.basic,g.pound,g.power,g.mach,g.morerecoil]),...coronaGunZd(a+36,0.5,[g.basic,g.pound,g.power,g.mach,g.morerecoil]),...prismGunZd(a+18,0.25,[g.basic,g.mach])])],
        TURRETS:[{POSITION:[22,0,0,0,0,1],TYPE:'orbDecoZd'},{POSITION:[13,0,0,0,0,1],TYPE:'crownDecoZd'}] };
    Class.chromosphZd  = { PARENT:['genericNovaZd'], LABEL:'Chromosphere',
        GUNS:[...a10.flatMap(a=>[...coronaGunZd(a,0,[g.basic,g.pound,g.power,g.mach]),...coronaGunZd(a+18,0.4,[g.basic,g.pound,g.power,g.mach])])],
        TURRETS:[{POSITION:[22,0,0,0,0,1],TYPE:'crownDecoZd'},{POSITION:[14,0,0,0,0,1],TYPE:'starDecoZd'},{POSITION:[8,0,0,0,0,1],TYPE:'orbDecoZd'}] };

    // ── SHARD FAMILY (trap/crystal) ───────────────────────────────────────────
    Class.shardZd = { PARENT:['genericCrystalZd'], LABEL:'Shard',
        GUNS:[...a2.flatMap(a=>shardGunZd(a,0,[g.trap]))],
        TURRETS:[{POSITION:[14,0,0,0,0,1],TYPE:'bladeDecoZd'}] };

    // T2 Shard
    Class.shiveZd      = { PARENT:['genericStarZd'],  LABEL:'Shive',
        GUNS:[...a4.flatMap(a=>shardGunZd(a,0,[g.trap,g.hexatrap]))],
        TURRETS:[{POSITION:[16,0,0,0,0,1],TYPE:'bladeDecoZd'}] };
    Class.flakeZd      = { PARENT:['genericStarZd'],  LABEL:'Flake',
        GUNS:[...a6.flatMap(a=>shardGunZd(a,0,[g.trap,{health:1.4}]))],
        TURRETS:[{POSITION:[16,0,0,0,0,1],TYPE:'crystalDecoZd'}] };
    Class.splinterZd   = { PARENT:['genericStarZd'],  LABEL:'Splinter',
        GUNS:[...a2.flatMap(a=>[...shardGunZd(a,0,[g.trap,g.hexatrap]),...shardGunZd(a+90,0.5,[g.trap,g.hexatrap])])],
        TURRETS:[{POSITION:[16,0,0,0,0,1],TYPE:'bladeDecoZd'}] };
    Class.chipsZd      = { PARENT:['genericStarZd'],  LABEL:'Chips',
        GUNS:[...a3.flatMap(a=>shardGunZd(a,0,[g.trap,g.hexatrap,g.power]))],
        TURRETS:[{POSITION:[16,0,0,0,0,1],TYPE:'starDecoZd'}] };
    Class.fragmentZd   = { PARENT:['genericStarZd'],  LABEL:'Fragment',
        GUNS:[...a5.flatMap(a=>shardGunZd(a,0,[g.trap,{health:1.8}]))],
        TURRETS:[{POSITION:[16,0,0,0,0,1],TYPE:'bladeDecoZd'}] };

    // T3 Shard
    Class.geodeZd      = { PARENT:['genericCruxZd'],  LABEL:'Geode',
        GUNS:[...a5.flatMap(a=>[...shardGunZd(a,0,[g.trap,g.hexatrap,g.power]),...shardGunZd(a+36,0.5,[g.trap,g.hexatrap,g.power])])],
        TURRETS:[{POSITION:[20,0,0,0,0,1],TYPE:'bladeDecoZd'},{POSITION:[11,0,0,0,0,1],TYPE:'crystalDecoZd'}] };
    Class.crystalZd    = { PARENT:['genericCruxZd'],  LABEL:'Crystal',
        GUNS:[...a6.flatMap(a=>shardGunZd(a,0,[g.trap,g.hexatrap,{health:2}]))],
        TURRETS:[{POSITION:[20,0,0,0,0,1],TYPE:'crystalDecoZd'},{POSITION:[11,0,0,0,0,1],TYPE:'bladeDecoZd'}] };
    Class.latticeZd    = { PARENT:['genericCruxZd'],  LABEL:'Lattice',
        GUNS:[...a4.flatMap(a=>[...shardGunZd(a,0,[g.trap,g.hexatrap]),...shardGunZd(a+45,0.5,[g.trap,g.hexatrap])])],
        TURRETS:[{POSITION:[20,0,0,0,0,1],TYPE:'bladeDecoZd'}] };
    Class.mineralZd    = { PARENT:['genericCruxZd'],  LABEL:'Mineral',
        GUNS:[...a8.flatMap(a=>shardGunZd(a,0,[g.trap,g.hexatrap,{health:1.5}]))],
        TURRETS:[{POSITION:[20,0,0,0,0,1],TYPE:'starDecoZd'},{POSITION:[11,0,0,0,0,1],TYPE:'bladeDecoZd'}] };
    Class.quartzZd     = { PARENT:['genericCruxZd'],  LABEL:'Quartz',
        GUNS:[...a3.flatMap(a=>[...shardGunZd(a,0,[g.trap,g.hexatrap,g.power]),...shardGunZd(a+60,0.33,[g.trap,g.hexatrap,g.power]),...riftGunZd(a+30,0.66,[g.sniper,g.assass])])],
        TURRETS:[{POSITION:[20,0,0,0,0,1],TYPE:'bladeDecoZd'},{POSITION:[11,0,0,0,0,1],TYPE:'crystalDecoZd'}] };

    // T4 Shard finals
    Class.diamondZd    = { PARENT:['genericNovaZd'], LABEL:'Diamond',
        GUNS:[...a10.flatMap(a=>shardGunZd(a,0,[g.trap,g.hexatrap,g.power,{health:2}]))],
        TURRETS:[{POSITION:[22,0,0,0,0,1],TYPE:'bladeDecoZd'},{POSITION:[13,0,0,0,0,1],TYPE:'crystalDecoZd'}] };
    Class.gemZd        = { PARENT:['genericNovaZd'], LABEL:'Gem',
        GUNS:[...a5.flatMap(a=>[...shardGunZd(a,0,[g.trap,g.hexatrap,g.power,{health:2}]),...shardGunZd(a+36,0.5,[g.trap,g.hexatrap,g.power,{health:2}])])],
        TURRETS:[{POSITION:[22,0,0,0,0,1],TYPE:'crystalDecoZd'},{POSITION:[13,0,0,0,0,1],TYPE:'bladeDecoZd'}] };
    Class.jewelZd     = { PARENT:['genericNovaZd'], LABEL:'Jewel',
        GUNS:[...a8.flatMap(a=>[...shardGunZd(a,0,[g.trap,g.hexatrap,g.power]),...riftGunZd(a+22.5,0.25,[g.sniper,g.assass,g.power])])],
        TURRETS:[{POSITION:[22,0,0,0,0,1],TYPE:'bladeDecoZd'},{POSITION:[13,0,0,0,0,1],TYPE:'orbDecoZd'}] };
    Class.rubyZd       = { PARENT:['genericNovaZd'], LABEL:'Ruby',
        GUNS:[...a6.flatMap(a=>[...shardGunZd(a,0,[g.trap,g.hexatrap,g.power,{health:2.5}]),...shardGunZd(a+30,0.4,[g.trap,g.hexatrap,g.power,{health:2.5}]),...coronaGunZd(a+15,0.7,[g.basic,g.pound,g.power])])],
        TURRETS:[{POSITION:[22,0,0,0,0,1],TYPE:'crownDecoZd'},{POSITION:[13,0,0,0,0,1],TYPE:'bladeDecoZd'}] };
    Class.sapphireZd   = { PARENT:['genericNovaZd'], LABEL:'Sapphire',
        GUNS:[...a10.flatMap(a=>[...shardGunZd(a,0,[g.trap,g.hexatrap,g.power,{health:2}]),...shardGunZd(a+18,0.4,[g.trap,g.hexatrap,g.power,{health:2}])])],
        TURRETS:[{POSITION:[22,0,0,0,0,1],TYPE:'bladeDecoZd'},{POSITION:[14,0,0,0,0,1],TYPE:'crystalDecoZd'},{POSITION:[8,0,0,0,0,1],TYPE:'starDecoZd'}] };

    // ════════════════════════════════════════════════════════════════════════
    //  BODY TREE  (6 paths × 3 tiers + T0 options)
    // ════════════════════════════════════════════════════════════════════════
    const spin = (size,color,spd) => ({ POSITION:[size,0,0,0,360,1], TYPE:['egg',{COLOR:color,CONTROLLERS:[['spin',{speed:spd}]]}] });

    // T1 Body options (hexstar shape)
    Class.armorZd    = { PARENT:['genericStarZd'], LABEL:'Armor',      BODY:{HEALTH:1.6,SHIELD:2.2,REGEN:1.8,SPEED:0.84}, GUNS:[],
        TURRETS:[{POSITION:[16,0,0,0,0,1],TYPE:'starDecoZd'}] };
    Class.engineZd   = { PARENT:['genericStarZd'], LABEL:'Engine',     BODY:{SPEED:1.7,HEALTH:0.72}, GUNS:[],
        TURRETS:[{POSITION:[12,0,0,0,0,1],TYPE:'crystalDecoZd'},spin(8,6,0.07)] };
    Class.massiveZd  = { PARENT:['genericStarZd'], LABEL:'Massive',    SIZE:1.3, BODY:{HEALTH:2.2,SPEED:0.8}, GUNS:[],
        TURRETS:[{POSITION:[16,0,0,0,0,1],TYPE:'crystalDecoZd'}] };
    Class.coreBodyZd = { PARENT:['genericStarZd'], LABEL:'Core',       BODY:{HEALTH:1.4,SHIELD:1.8,REGEN:2.8,SPEED:0.88}, GUNS:[],
        TURRETS:[spin(14,4,0.04),spin(8,6,-0.06)] };
    Class.sensorZd   = { PARENT:['genericStarZd'], LABEL:'Sensor',     BODY:{FOV:1.4,SPEED:0.96}, GUNS:[],
        TURRETS:[{POSITION:[12,0,0,0,360,1],TYPE:['autoTankGun',{INDEPENDENT:true,CONTROLLERS:['nearestDifferentMaster']}]},{POSITION:[16,0,0,0,0,1],TYPE:'starDecoZd'}] };
    Class.swiftZd    = { PARENT:['genericStarZd'], LABEL:'Swift',      BODY:{SPEED:1.9,HEALTH:0.68,DENSITY:0.55}, GUNS:[],
        TURRETS:[spin(12,16,-0.05),spin(7,15,0.07)] };

    // T2 Body (crux shape)
    Class.bastionZd  = { PARENT:['genericCruxZd'], LABEL:'Bastion',    BODY:{HEALTH:2.2,SHIELD:2.8,REGEN:2.2,SPEED:0.74}, GUNS:[],
        TURRETS:[{POSITION:[20,0,0,0,0,1],TYPE:'starDecoZd'},spin(11,4,0.02)] };
    Class.turboZd    = { PARENT:['genericCruxZd'], LABEL:'Turbo',      BODY:{SPEED:2.1,HEALTH:0.62}, GUNS:[],
        TURRETS:[{POSITION:[14,0,0,0,0,1],TYPE:'crystalDecoZd'},spin(9,6,0.07),spin(6,3,-0.09)] };
    Class.titanZd    = { PARENT:['genericCruxZd'], LABEL:'Titan',      SIZE:1.4, BODY:{HEALTH:2.8,SPEED:0.74}, GUNS:[],
        TURRETS:[{POSITION:[20,0,0,0,0,1],TYPE:'cruxDecoZd'}] };
    Class.reactorZd  = { PARENT:['genericCruxZd'], LABEL:'Reactor',    BODY:{HEALTH:1.6,SHIELD:2.2,REGEN:3.5,SPEED:0.86}, GUNS:[],
        TURRETS:[spin(15,4,0.03),spin(9,6,-0.05),spin(5,12,0.07)] };
    Class.radarZd    = { PARENT:['genericCruxZd'], LABEL:'Radar',      BODY:{FOV:1.6,SPEED:0.93}, GUNS:[],
        TURRETS:[{POSITION:[11,0,0,0,360,1],TYPE:['autoTankGun',{INDEPENDENT:true,CONTROLLERS:['nearestDifferentMaster']}]},{POSITION:[13,0,0,0,360,1],TYPE:['autoTankGun',{INDEPENDENT:true,CONTROLLERS:['nearestDifferentMaster']}]}] };
    Class.wraith2Zd  = { PARENT:['genericCruxZd'], LABEL:'Wraith',     BODY:{SPEED:1.6,HEALTH:0.68,DENSITY:0.48}, GUNS:[],
        TURRETS:[spin(14,16,-0.065),spin(8,15,0.09),spin(5,17,-0.11)] };

    // T3 Body finals (nova shape)
    Class.citadelZd  = { PARENT:['genericNovaZd'], LABEL:'Citadel',    BODY:{HEALTH:3.2,SHIELD:3.8,REGEN:2.8,SPEED:0.62}, GUNS:[],
        TURRETS:[{POSITION:[22,0,0,0,0,1],TYPE:'starDecoZd'},{POSITION:[14,0,0,0,0,1],TYPE:'crownDecoZd'},spin(8,4,0.025)] };
    Class.warpDriveZd= { PARENT:['genericNovaZd'], LABEL:'Warp Drive', BODY:{SPEED:2.6,HEALTH:0.52}, GUNS:[],
        TURRETS:[{POSITION:[16,0,0,0,0,1],TYPE:'crystalDecoZd'},spin(11,6,0.08),spin(7,4,-0.1),spin(5,3,0.12)] };
    Class.leviZd     = { PARENT:['genericNovaZd'], LABEL:'Leviathan',  SIZE:1.55, BODY:{HEALTH:3.8,SPEED:0.58}, GUNS:[],
        TURRETS:[{POSITION:[22,0,0,0,0,1],TYPE:'crownDecoZd'},{POSITION:[14,0,0,0,0,1],TYPE:'bladeDecoZd'}] };
    Class.dysonZd    = { PARENT:['genericNovaZd'], LABEL:'Dyson',      BODY:{HEALTH:2.2,SHIELD:2.8,REGEN:4.5,SPEED:0.78}, GUNS:[],
        TURRETS:[spin(18,4,0.022),spin(12,6,-0.038),spin(7,12,0.055),spin(5,3,-0.07)] };
    Class.zenithScopeZd={ PARENT:['genericNovaZd'], LABEL:'Zenith Eye', BODY:{FOV:2.0,SPEED:0.91}, GUNS:[],
        TURRETS:[{POSITION:[12,0,0,0,360,1],TYPE:['autoTankGun',{INDEPENDENT:true,CONTROLLERS:['nearestDifferentMaster']}]},{POSITION:[14,0,0,0,360,1],TYPE:['autoTankGun',{INDEPENDENT:true,CONTROLLERS:['nearestDifferentMaster']}]},{POSITION:[16,0,0,0,360,1],TYPE:['autoTankGun',{INDEPENDENT:true,CONTROLLERS:['nearestDifferentMaster']}]}] };
    Class.phantomNovaZd={ PARENT:['genericNovaZd'], LABEL:'Phantom Nova',BODY:{SPEED:2.0,HEALTH:0.58,DENSITY:0.38}, GUNS:[],
        TURRETS:[spin(18,16,-0.072),spin(12,15,0.095),spin(7,17,-0.115),spin(4,5,0.14)] };

    // Make cruxDeco (needed for titanZd turret)
    Class.cruxDecoZd = {
        PARENT:['genericTank'], SHAPE: SHAPE_CRUX,
        COLOR:12, MIRROR_MASTER_ANGLE:true,
        CONTROLLERS:[['spin',{speed:0.03}]], INDEPENDENT:true,
        LABEL:'', GUNS:[],
    };

    // ════════════════════════════════════════════════════════════════════════
    //  UPGRADE TREE
    // ════════════════════════════════════════════════════════════════════════

    // Hook entry
    const _e = ['menu_addons','addons'].find(n=>Class[n]&&Array.isArray(Class[n].UPGRADES_TIER_0));
    if (_e) Class[_e].UPGRADES_TIER_0.push('dreadZd');
    else console.warn('[zenithDreads] Connect dreadZd to your addons menu manually.');

    Class.dreadZd.UPGRADES_TIER_0 = ['weaponRootZd','bodyRootZd'];

    // Weapon root → 5 families
    Class.weaponRootZd.UPGRADES_TIER_0 = ['prismZd','riftZd','nebulaZd','coronaZd','shardZd'];

    // ── Prism ────────────────────────────────────────────────────────────────
    Class.prismZd.UPGRADES_TIER_0   = ['facetZd','rayZd','lensZd','beamZd','angleZd'];
    Class.facetZd.UPGRADES_TIER_0   = ['spectrumZd'];
    Class.rayZd.UPGRADES_TIER_0     = ['chromeZd'];
    Class.lensZd.UPGRADES_TIER_0    = ['prismaticZd'];
    Class.beamZd.UPGRADES_TIER_0    = ['opalZd'];
    Class.angleZd.UPGRADES_TIER_0   = ['iridZd'];
    Class.spectrumZd.UPGRADES_TIER_0  = ['rainbowZd'];
    Class.chromeZd.UPGRADES_TIER_0    = ['kaleidoZd'];
    Class.prismaticZd.UPGRADES_TIER_0 = ['shimmerZd'];
    Class.opalZd.UPGRADES_TIER_0      = ['lusterZd'];
    Class.iridZd.UPGRADES_TIER_0      = ['holoZd'];
    ['rainbowZd','kaleidoZd','shimmerZd','lusterZd','holoZd'].forEach(n=>Class[n].UPGRADES_TIER_0=[]);

    // ── Rift ─────────────────────────────────────────────────────────────────
    Class.riftZd.UPGRADES_TIER_0    = ['tearZd','fissureZd','crackZd','cleftZd','spliceZd'];
    Class.tearZd.UPGRADES_TIER_0    = ['abyssZd'];
    Class.fissureZd.UPGRADES_TIER_0 = ['chasmZd'];
    Class.crackZd.UPGRADES_TIER_0   = ['gulchZd'];
    Class.cleftZd.UPGRADES_TIER_0   = ['gapZd'];
    Class.spliceZd.UPGRADES_TIER_0  = ['schismZd'];
    Class.abyssZd.UPGRADES_TIER_0     = ['riftNovaZd'];
    Class.chasmZd.UPGRADES_TIER_0     = ['fractureZd'];
    Class.gulchZd.UPGRADES_TIER_0     = ['shatterZd'];
    Class.gapZd.UPGRADES_TIER_0       = ['splitNovaZd'];
    Class.schismZd.UPGRADES_TIER_0    = ['voidlineZd'];
    ['riftNovaZd','fractureZd','shatterZd','splitNovaZd','voidlineZd'].forEach(n=>Class[n].UPGRADES_TIER_0=[]);

    // ── Nebula ───────────────────────────────────────────────────────────────
    Class.nebulaZd.UPGRADES_TIER_0  = ['gasZd','plumeZd','cloudZd','driftZd','dustZd'];
    Class.gasZd.UPGRADES_TIER_0     = ['densityZd'];
    Class.plumeZd.UPGRADES_TIER_0   = ['coreZd'];
    Class.cloudZd.UPGRADES_TIER_0   = ['collapseZd'];
    Class.driftZd.UPGRADES_TIER_0   = ['pressureZd'];
    Class.dustZd.UPGRADES_TIER_0    = ['clusterZd'];
    Class.densityZd.UPGRADES_TIER_0   = ['superclusterZd'];
    Class.coreZd.UPGRADES_TIER_0      = ['pulsar2Zd'];
    Class.collapseZd.UPGRADES_TIER_0  = ['magnetarZd'];
    Class.pressureZd.UPGRADES_TIER_0  = ['quasarZd'];
    Class.clusterZd.UPGRADES_TIER_0   = ['hyperZd'];
    ['superclusterZd','pulsar2Zd','magnetarZd','quasarZd','hyperZd'].forEach(n=>Class[n].UPGRADES_TIER_0=[]);

    // ── Corona ───────────────────────────────────────────────────────────────
    Class.coronaZd.UPGRADES_TIER_0  = ['flareZd','solarWindZd','radiantZd','scorchZd','ignitZd'];
    Class.flareZd.UPGRADES_TIER_0   = ['infernoZd'];
    Class.solarWindZd.UPGRADES_TIER_0= ['furnaceZd'];
    Class.radiantZd.UPGRADES_TIER_0 = ['combustZd'];
    Class.scorchZd.UPGRADES_TIER_0  = ['blazonZd'];
    Class.ignitZd.UPGRADES_TIER_0   = ['incineZd'];
    Class.infernoZd.UPGRADES_TIER_0   = ['solarStormZd'];
    Class.furnaceZd.UPGRADES_TIER_0   = ['heliosZd'];
    Class.combustZd.UPGRADES_TIER_0   = ['stellarCoreZd'];
    Class.blazonZd.UPGRADES_TIER_0    = ['coronaMassZd'];
    Class.incineZd.UPGRADES_TIER_0    = ['chromosphZd'];
    ['solarStormZd','heliosZd','stellarCoreZd','coronaMassZd','chromosphZd'].forEach(n=>Class[n].UPGRADES_TIER_0=[]);

    // ── Shard ────────────────────────────────────────────────────────────────
    Class.shardZd.UPGRADES_TIER_0   = ['shiveZd','flakeZd','splinterZd','chipsZd','fragmentZd'];
    Class.shiveZd.UPGRADES_TIER_0   = ['geodeZd'];
    Class.flakeZd.UPGRADES_TIER_0   = ['crystalZd'];
    Class.splinterZd.UPGRADES_TIER_0= ['latticeZd'];
    Class.chipsZd.UPGRADES_TIER_0   = ['mineralZd'];
    Class.fragmentZd.UPGRADES_TIER_0= ['quartzZd'];
    Class.geodeZd.UPGRADES_TIER_0     = ['diamondZd'];
    Class.crystalZd.UPGRADES_TIER_0   = ['gemZd'];
    Class.latticeZd.UPGRADES_TIER_0   = ['jewelZd'];
    Class.mineralZd.UPGRADES_TIER_0   = ['rubyZd'];
    Class.quartzZd.UPGRADES_TIER_0    = ['sapphireZd'];
    ['diamondZd','gemZd','jewelZd','rubyZd','sapphireZd'].forEach(n=>Class[n].UPGRADES_TIER_0=[]);

    // ── Body tree ────────────────────────────────────────────────────────────
    Class.bodyRootZd.UPGRADES_TIER_0 = ['armorZd','engineZd','massiveZd','coreBodyZd','sensorZd','swiftZd'];
    Class.armorZd.UPGRADES_TIER_0    = ['bastionZd'];
    Class.engineZd.UPGRADES_TIER_0   = ['turboZd'];
    Class.massiveZd.UPGRADES_TIER_0  = ['titanZd'];
    Class.coreBodyZd.UPGRADES_TIER_0 = ['reactorZd'];
    Class.sensorZd.UPGRADES_TIER_0   = ['radarZd'];
    Class.swiftZd.UPGRADES_TIER_0    = ['wraith2Zd'];
    Class.bastionZd.UPGRADES_TIER_0  = ['citadelZd'];
    Class.turboZd.UPGRADES_TIER_0    = ['warpDriveZd'];
    Class.titanZd.UPGRADES_TIER_0    = ['leviZd'];
    Class.reactorZd.UPGRADES_TIER_0  = ['dysonZd'];
    Class.radarZd.UPGRADES_TIER_0    = ['zenithScopeZd'];
    Class.wraith2Zd.UPGRADES_TIER_0  = ['phantomNovaZd'];
    ['citadelZd','warpDriveZd','leviZd','dysonZd','zenithScopeZd','phantomNovaZd'].forEach(n=>Class[n].UPGRADES_TIER_0=[]);

    const zdCount = Object.keys(Class).filter(k=>k.endsWith('Zd')||k.endsWith('Zd2')).length;
    console.log(`[zenithDreads] Loaded ${zdCount} Zenith Dread classes. Entry: dreadZd`);
};