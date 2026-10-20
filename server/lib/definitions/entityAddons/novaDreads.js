// ============================================================
//  NOVA DREADS - A new dreadnought addon for Open Source Arras
//  Space/cosmic theme. All classes use _ND suffix.
//  No collisions with snowDreads or vanilla classes.
// ============================================================

const { combineStats } = require('../facilitators.js');
const _constants = require('../constants.js');
const { smshskl, base } = _constants;
const g = require('../gunvals.js');

const _combineStats = combineStats;
const safeStats = stats => _combineStats(stats.filter(s => s != null));

const gunCalcNames = _constants.gunCalcNames || _constants.GunCalcNames || {};
if (!gunCalcNames.drone)     gunCalcNames.drone     = 'drone';
if (!gunCalcNames.trap)      gunCalcNames.trap       = 'trap';
if (!gunCalcNames.sustained) gunCalcNames.sustained  = 'sustained';
if (!gunCalcNames.swarm)     gunCalcNames.swarm       = 'swarm';

// ── Body stat blocks ─────────────────────────────────────────────────────────
const eggBodyND = {
    SPEED: base.SPEED * 0.82, HEALTH: base.HEALTH * 1.8,
    SHIELD: base.SHIELD * 1.5, REGEN: base.REGEN * 1.5,
    FOV: base.FOV, RESIST: base.RESIST, DENSITY: base.DENSITY * 1.5,
};
const squareBodyND = {
    SPEED: base.SPEED * 0.67, HEALTH: base.HEALTH * 2.6,
    SHIELD: base.SHIELD * 2, REGEN: base.REGEN * 2,
    FOV: base.FOV * 0.95, RESIST: base.RESIST, DENSITY: base.DENSITY * 2,
};
const triBodyND = {
    SPEED: base.SPEED * 0.54, HEALTH: base.HEALTH * 3.6,
    SHIELD: base.SHIELD * 2.6, REGEN: base.REGEN * 2.6,
    FOV: base.FOV * 0.93, RESIST: base.RESIST, DENSITY: base.DENSITY * 2.6,
};
const pentBodyND = {
    SPEED: base.SPEED * 0.41, HEALTH: base.HEALTH * 4.4,
    SHIELD: base.SHIELD * 3.1, REGEN: base.REGEN * 3.1,
    FOV: base.FOV * 0.9, RESIST: base.RESIST, DENSITY: base.DENSITY * 3.1,
};

// ── Gun builder helpers ───────────────────────────────────────────────────────
// Each returns an array of gun objects for GUNS: []

// Sniper-style: long single barrel with decorative rings
function sniperGunND(angle = 0, delay = 0, stats = [g.sniper]) {
    return [
        { POSITION: [22, 7, 1, 0, 0, angle, delay],
          PROPERTIES: { SHOOT_SETTINGS: safeStats(stats), TYPE: 'bullet',
            COLOR: { BASE: -1, BRIGHTNESS_SHIFT: -18, SATURATION_SHIFT: 0.5 } } },
        { POSITION: [20, 5.5, -0.6, 0, 0, angle, delay],
          PROPERTIES: { SHOOT_SETTINGS: safeStats([...stats, g.fake]), TYPE: 'bullet',
            COLOR: { BASE: -1, BRIGHTNESS_SHIFT: -8, SATURATION_SHIFT: 0.5 }, BORDERLESS: true } },
        { POSITION: [0.8, 6, 0.9, 17, 0, angle, delay],
          PROPERTIES: { SHOOT_SETTINGS: safeStats([...stats, g.fake]), TYPE: 'bullet',
            COLOR: { BASE: 17, BRIGHTNESS_SHIFT: 8 } } },
    ];
}

// Normal twin: two side-by-side barrels
function normalGunND(angle = 0, delay = 0, stats = [g.basic]) {
    return [
        { POSITION: [16, 6, 1, 0, 3.5, angle, delay],
          PROPERTIES: { SHOOT_SETTINGS: safeStats(stats), TYPE: 'bullet',
            COLOR: { BASE: -1, BRIGHTNESS_SHIFT: -20, SATURATION_SHIFT: 0.5 } } },
        { POSITION: [16, 6, 1, 0, -3.5, angle, delay + 0.5],
          PROPERTIES: { SHOOT_SETTINGS: safeStats(stats), TYPE: 'bullet',
            COLOR: { BASE: -1, BRIGHTNESS_SHIFT: -20, SATURATION_SHIFT: 0.5 } } },
        { POSITION: [14, 4.5, -0.7, 0, 3.5, angle, delay],
          PROPERTIES: { SHOOT_SETTINGS: safeStats([...stats, g.fake]), TYPE: 'bullet',
            COLOR: { BASE: 17, BRIGHTNESS_SHIFT: 10 }, BORDERLESS: true } },
        { POSITION: [14, 4.5, -0.7, 0, -3.5, angle, delay + 0.5],
          PROPERTIES: { SHOOT_SETTINGS: safeStats([...stats, g.fake]), TYPE: 'bullet',
            COLOR: { BASE: 17, BRIGHTNESS_SHIFT: 10 }, BORDERLESS: true } },
    ];
}

// Heavy: wide powerful single barrel
function heavyGunND(angle = 0, delay = 0, stats = [g.basic]) {
    return [
        { POSITION: [13, 12, 1.2, 0, 0, angle, delay],
          PROPERTIES: { SHOOT_SETTINGS: safeStats(stats), TYPE: 'bullet',
            COLOR: { BASE: -1, BRIGHTNESS_SHIFT: -15, SATURATION_SHIFT: 0.5 } } },
        { POSITION: [10, 9, -1.1, 0, 0, angle, delay],
          PROPERTIES: { SHOOT_SETTINGS: safeStats([...stats, g.fake]), TYPE: 'bullet',
            COLOR: { BASE: -1, BRIGHTNESS_SHIFT: -5, SATURATION_SHIFT: 0.6 }, BORDERLESS: true } },
        { POSITION: [8, 13, 1.25, 0, 0, angle, 0],
          PROPERTIES: { COLOR: { BASE: 17, BRIGHTNESS_SHIFT: 12 } } },
    ];
}

// Rapid-fire gunner style: 3 thin stacked barrels
function gunnerGunND(angle = 0, delay = 0, stats = [g.basic]) {
    const delays = [0, 0.33, 0.67];
    const ys = [4, 0, -4];
    return ys.map((y, i) => ({
        POSITION: [15, 4, 1, 0, y, angle, delay + delays[i]],
        PROPERTIES: { SHOOT_SETTINGS: safeStats([...stats, g.gunner]),
            TYPE: 'bullet', COLOR: { BASE: 17, BRIGHTNESS_SHIFT: 8 + i * 3 } },
    }));
}

// Launcher: missile barrel with fins
function launcherGunND(angle = 0, delay = 0, stats = [g.basic]) {
    return [
        { POSITION: [14, 9, 1, 0, 0, angle, delay],
          PROPERTIES: { SHOOT_SETTINGS: safeStats([...stats, { reload: 1.4 }]),
            TYPE: 'missile', STAT_CALCULATOR: gunCalcNames.sustained,
            COLOR: { BASE: -1, BRIGHTNESS_SHIFT: -12 } } },
        { POSITION: [9, 6, 1, 3, 0, angle, 0],
          PROPERTIES: { COLOR: { BASE: 17, BRIGHTNESS_SHIFT: 6 } } },
        { POSITION: [5, 9, -1.4, 0, 0, angle, 0],
          PROPERTIES: { COLOR: { BASE: -1, BRIGHTNESS_SHIFT: -8, SATURATION_SHIFT: 0.6 } } },
    ];
}

// Trap: rear-facing trap layer
function trapGunND(angle = 0, delay = 0, stats = [g.trap]) {
    return [
        { POSITION: [13, 7, 1, 0, 0, angle, 0],
          PROPERTIES: { COLOR: { BASE: -1, BRIGHTNESS_SHIFT: -10 } } },
        { POSITION: [4, 8, 1.6, 13, 0, angle, delay],
          PROPERTIES: { SHOOT_SETTINGS: safeStats(stats),
            TYPE: 'trap', STAT_CALCULATOR: gunCalcNames.trap,
            COLOR: { BASE: -1, BRIGHTNESS_SHIFT: -12 } } },
        { POSITION: [11, 5, 0.7, 0, 0, angle, 0],
          PROPERTIES: { COLOR: { BASE: 17, BRIGHTNESS_SHIFT: 10 } } },
    ];
}

// Destroyer: huge single barrel
function destroyerGunND(angle = 0, delay = 0, stats = [g.basic]) {
    return [
        { POSITION: [16, 14, 1, 0, 0, angle, delay],
          PROPERTIES: { SHOOT_SETTINGS: safeStats([...stats, g.pounder, { reload: 1.6 }]),
            TYPE: 'bullet', COLOR: { BASE: -1, BRIGHTNESS_SHIFT: -20, SATURATION_SHIFT: 0.4 } } },
        { POSITION: [13, 11, -1.15, 0, 0, angle, delay],
          PROPERTIES: { SHOOT_SETTINGS: safeStats([...stats, g.pounder, g.fake]),
            TYPE: 'bullet', COLOR: { BASE: -1, BRIGHTNESS_SHIFT: -8 }, BORDERLESS: true } },
        { POSITION: [7, 15, 1.2, 0, 0, angle, 0],
          PROPERTIES: { COLOR: { BASE: 17, BRIGHTNESS_SHIFT: 14 } } },
    ];
}

// Spread: wide-angle shotgun fan
function spreadGunND(angle = 0, delay = 0, stats = [g.basic]) {
    return [-20, -8, 0, 8, 20].map((spread, i) => ({
        POSITION: [13, 5.5, 1, 0, 0, angle + spread, delay + i * 0.1],
        PROPERTIES: { SHOOT_SETTINGS: safeStats([...stats, { spray: 3 }]),
            TYPE: 'bullet', COLOR: { BASE: -1, BRIGHTNESS_SHIFT: -16 + i * 2 } },
    }));
}

// Flank: guns on opposite sides
function flankGunND(angle = 0, delay = 0, stats = [g.basic]) {
    return [
        ...normalGunND(angle, delay, stats),
        ...normalGunND(angle + 180, delay + 0.5, stats),
    ];
}

// Auto turret mounted on top
function autoTurretGunND(scale = 10) {
    return [{
        POSITION: [scale, 0, 0, 0, 360, 1],
        TYPE: ['autoTankGun', { INDEPENDENT: true, CONTROLLERS: ['nearestDifferentMaster'] }],
    }];
}

module.exports = ({ Class }) => {

    // ── Generic base classes ─────────────────────────────────────────────────
    Class.genericDreadND = {
        PARENT: ['genericTank'],
        SKILL_CAP: Array(10).fill(smshskl),
        REROOT_UPGRADE_TREE: ['weaponBranchND', 'bodyBranchND'],
    };
    Class.genericEggND   = { PARENT: ['genericDreadND'], BODY: eggBodyND,    SHAPE: 0,   COLOR: 6,  SIZE: 14, DANGER: 8 };
    Class.genericSquareND= { PARENT: ['genericDreadND'], BODY: squareBodyND, SHAPE: 4,   COLOR: 13, SIZE: 18, DANGER: 9 };
    Class.genericTriND   = { PARENT: ['genericDreadND'], BODY: triBodyND,    SHAPE: 3.5, COLOR: 2,  SIZE: 21, DANGER: 10 };
    Class.genericPentND  = { PARENT: ['genericDreadND'], BODY: pentBodyND,   SHAPE: 5.5, COLOR: 14, SIZE: 23, DANGER: 11 };

    // ── Entry point ──────────────────────────────────────────────────────────
    Class.dreadND = {
        PARENT: ['genericEggND'],
        LABEL: 'Nova Dreadnought',
        UPGRADE_LABEL: 'Nova Dreads',
        LEVEL: 90,
        EXTRA_SKILL: 18,
        GUNS: [],
    };

    // Branch roots
    Class.weaponBranchND = { LABEL: '', COLOR: 6, REROOT_UPGRADE_TREE: 'weaponBranchND' };
    Class.bodyBranchND   = { LABEL: '', COLOR: 6, REROOT_UPGRADE_TREE: 'bodyBranchND' };

    // ════════════════════════════════════════════════════════════════════════
    //  WEAPON TREE  (5 families × 5 branches × 2 deep + finals = ~75 classes)
    // ════════════════════════════════════════════════════════════════════════

    // ── T1: Comet family (sniper) ─────────────────────────────────────────
    Class.cometND = { PARENT: ['genericEggND'], LABEL: 'Comet',
        GUNS: [...sniperGunND(0), ...sniperGunND(180)] };

    // T2 Comet branches (square)
    Class.meteorND = { PARENT: ['genericSquareND'], LABEL: 'Meteor',
        GUNS: [...sniperGunND(0, 0, [g.sniper, g.assass]), ...sniperGunND(90, 0.5, [g.sniper, g.assass]),
                ...sniperGunND(180, 0, [g.sniper, g.assass]), ...sniperGunND(270, 0.5, [g.sniper, g.assass])] };
    Class.bolideND = { PARENT: ['genericSquareND'], LABEL: 'Bolide',
        GUNS: [...sniperGunND(0, 0, [g.sniper, g.mach]), ...sniperGunND(180, 0.5, [g.sniper, g.mach])] };
    Class.streakND = { PARENT: ['genericSquareND'], LABEL: 'Streak',
        GUNS: [...sniperGunND(0, 0, [g.sniper, {reload: 0.6}]), ...sniperGunND(60, 0.33, [g.sniper, {reload: 0.6}]),
                ...sniperGunND(120, 0.66, [g.sniper, {reload: 0.6}])] };
    Class.blazeND = { PARENT: ['genericSquareND'], LABEL: 'Blaze',
        GUNS: [...sniperGunND(0, 0, [g.sniper, g.power]), ...sniperGunND(180, 0, [g.sniper, g.power]),
                ...heavyGunND(90, 0, [g.basic, g.pound])] };
    Class.tailND = { PARENT: ['genericSquareND'], LABEL: 'Comet Tail',
        GUNS: [...sniperGunND(0, 0, [g.sniper]), ...sniperGunND(180, 0.5, [g.sniper]),
                ...normalGunND(90, 0, [g.basic, g.twin]), ...normalGunND(270, 0.5, [g.basic, g.twin])] };

    // T3 Comet (triangle)
    Class.meteoriteND    = { PARENT: ['genericTriND'], LABEL: 'Meteorite',
        GUNS: [...[0,72,144,216,288].flatMap(a => sniperGunND(a, 0, [g.sniper, g.assass, {reload: 0.8}]))] };
    Class.impactND       = { PARENT: ['genericTriND'], LABEL: 'Impact',
        GUNS: [...sniperGunND(0,0,[g.sniper,g.mach,g.morespeed]),...sniperGunND(120,0.33,[g.sniper,g.mach,g.morespeed]),...sniperGunND(240,0.66,[g.sniper,g.mach,g.morespeed])] };
    Class.shootingStarND = { PARENT: ['genericTriND'], LABEL: 'Shooting Star',
        GUNS: [...[0,60,120,180,240,300].flatMap(a => sniperGunND(a, 0, [g.sniper, {reload: 0.5}]))] };
    Class.infernoND      = { PARENT: ['genericTriND'], LABEL: 'Inferno',
        GUNS: [...sniperGunND(0,0,[g.sniper,g.power,g.morerecoil]),...heavyGunND(120,0,[g.basic,g.pound,g.morerecoil]),...heavyGunND(240,0,[g.basic,g.pound,g.morerecoil])] };
    Class.trainND        = { PARENT: ['genericTriND'], LABEL: 'Train',
        GUNS: [...normalGunND(0,0,[g.basic,g.mach,g.twin]),...normalGunND(120,0.33,[g.basic,g.mach,g.twin]),...normalGunND(240,0.66,[g.basic,g.mach,g.twin])] };

    // T4 Comet finals (pentagon)
    Class.supernovaND    = { PARENT: ['genericPentND'], LABEL: 'Supernova',
        GUNS: [...[0,45,90,135,180,225,270,315].flatMap(a => sniperGunND(a,0,[g.sniper,g.assass,{reload:0.7}]))] };
    Class.craterND       = { PARENT: ['genericPentND'], LABEL: 'Crater',
        GUNS: [...[0,72,144,216,288].flatMap(a => [...sniperGunND(a,0,[g.sniper,g.mach]),  ...heavyGunND(a+36,0,[g.basic,g.pound])])] };
    Class.novaShowerND   = { PARENT: ['genericPentND'], LABEL: 'Nova Shower',
        GUNS: [...[0,36,72,108,144,180,216,252,288,324].flatMap(a => sniperGunND(a,0,[g.sniper,{reload:0.4,spray:2}]))] };
    Class.novaFlareND    = { PARENT: ['genericPentND'], LABEL: 'Nova Flare',
        GUNS: [...[0,72,144,216,288].flatMap(a => [...sniperGunND(a,0,[g.sniper,g.power]),...destroyerGunND(a+36,0.5,[g.basic,g.pound,g.power])])] };
    Class.cometTrailND   = { PARENT: ['genericPentND'], LABEL: 'Comet Trail',
        GUNS: [...[0,72,144,216,288].flatMap(a => [...sniperGunND(a,0,[g.sniper]),...normalGunND(a+36,0.25,[g.basic,g.twin]),...normalGunND(a+36,0.75,[g.basic,g.twin])])] };

    // ── T1: Pulsar family (rapid/normal) ──────────────────────────────────
    Class.pulsarND = { PARENT: ['genericEggND'], LABEL: 'Pulsar',
        GUNS: [...normalGunND(0, 0, [g.basic, g.twin]), ...normalGunND(180, 0.5, [g.basic, g.twin])] };

    Class.strobeND    = { PARENT: ['genericSquareND'], LABEL: 'Strobe',
        GUNS: [...[0,90,180,270].flatMap(a => normalGunND(a, 0, [g.basic, g.twin, {reload:0.7}]))] };
    Class.surgeND     = { PARENT: ['genericSquareND'], LABEL: 'Surge',
        GUNS: [...normalGunND(0,0,[g.basic,g.mach,g.twin]),...normalGunND(90,0.25,[g.basic,g.mach,g.twin]),
                ...normalGunND(180,0.5,[g.basic,g.mach,g.twin]),...normalGunND(270,0.75,[g.basic,g.mach,g.twin])] };
    Class.flashND     = { PARENT: ['genericSquareND'], LABEL: 'Flash',
        GUNS: [...gunnerGunND(0,0,[g.basic,g.gunner,g.mach]),...gunnerGunND(90,0,[g.basic,g.gunner,g.mach]),
                ...gunnerGunND(180,0,[g.basic,g.gunner,g.mach]),...gunnerGunND(270,0,[g.basic,g.gunner,g.mach])] };
    Class.flickerND   = { PARENT: ['genericSquareND'], LABEL: 'Flicker',
        GUNS: [...normalGunND(0,0,[g.basic,g.twin]),...normalGunND(45,0.125,[g.basic,g.twin]),
                ...normalGunND(90,0.25,[g.basic,g.twin]),...normalGunND(135,0.375,[g.basic,g.twin]),
                ...normalGunND(180,0.5,[g.basic,g.twin]),...normalGunND(225,0.625,[g.basic,g.twin]),
                ...normalGunND(270,0.75,[g.basic,g.twin]),...normalGunND(315,0.875,[g.basic,g.twin])] };
    Class.zapND       = { PARENT: ['genericSquareND'], LABEL: 'Zap',
        GUNS: [...spreadGunND(0,0,[g.basic,{spray:4}]),...spreadGunND(180,0.5,[g.basic,{spray:4}])] };

    // T3 Pulsar
    Class.pulseBeamND  = { PARENT: ['genericTriND'], LABEL: 'Pulse Beam',
        GUNS: [...[0,120,240].flatMap(a => [...normalGunND(a,0,[g.basic,g.twin,g.mach]),...gunnerGunND(a+60,0,[g.basic,g.gunner,g.mach])])] };
    Class.powerSurgeND = { PARENT: ['genericTriND'], LABEL: 'Power Surge',
        GUNS: [...[0,120,240].flatMap(a => [...normalGunND(a,0,[g.basic,g.twin,g.power]),...normalGunND(a+60,0.5,[g.basic,g.twin,g.power])])] };
    Class.lightningND  = { PARENT: ['genericTriND'], LABEL: 'Lightning',
        GUNS: [...[0,40,80,120,160,200,240,280,320].flatMap(a => normalGunND(a,0,[g.basic,g.mach,{spray:2}]))] };
    Class.oscillatorND = { PARENT: ['genericTriND'], LABEL: 'Oscillator',
        GUNS: [...[0,60,120,180,240,300].flatMap(a => gunnerGunND(a,0,[g.basic,g.gunner,{reload:0.6}]))] };
    Class.arcND        = { PARENT: ['genericTriND'], LABEL: 'Arc',
        GUNS: [...[0,120,240].flatMap(a => [...spreadGunND(a,0,[g.basic,{spray:6}]),...spreadGunND(a+60,0.5,[g.basic,{spray:6}])])] };

    // T4 Pulsar finals
    Class.xrayND       = { PARENT: ['genericPentND'], LABEL: 'X-Ray',
        GUNS: [...[0,36,72,108,144,180,216,252,288,324].flatMap(a => normalGunND(a,0,[g.basic,g.twin,g.mach]))] };
    Class.overchargeND = { PARENT: ['genericPentND'], LABEL: 'Overcharge',
        GUNS: [...[0,72,144,216,288].flatMap(a => [...normalGunND(a,0,[g.basic,g.twin,g.power,g.mach]),...gunnerGunND(a+36,0,[g.basic,g.gunner,g.power,g.mach])])] };
    Class.thunderboltND= { PARENT: ['genericPentND'], LABEL: 'Thunderbolt',
        GUNS: [...[0,72,144,216,288].flatMap(a => [...gunnerGunND(a,0,[g.basic,g.gunner,g.mach,{reload:0.5}]),...gunnerGunND(a+36,0.5,[g.basic,g.gunner,g.mach,{reload:0.5}])])] };
    Class.frequencyND  = { PARENT: ['genericPentND'], LABEL: 'Frequency',
        GUNS: [...[0,30,60,90,120,150,180,210,240,270,300,330].flatMap(a => gunnerGunND(a,0,[g.basic,g.gunner]))] };
    Class.plasmaND     = { PARENT: ['genericPentND'], LABEL: 'Plasma',
        GUNS: [...[0,72,144,216,288].flatMap(a => [...spreadGunND(a,0,[g.basic,g.power,{spray:5}]),...spreadGunND(a+36,0.5,[g.basic,g.power,{spray:5}])])] };

    // ── T1: Quasar family (heavy/destroyer) ───────────────────────────────
    Class.quasarND = { PARENT: ['genericEggND'], LABEL: 'Quasar',
        GUNS: [...heavyGunND(0,0,[g.basic,g.pound]),...heavyGunND(180,0,[g.basic,g.pound])] };

    Class.crusherND  = { PARENT: ['genericSquareND'], LABEL: 'Crusher',
        GUNS: [...[0,90,180,270].flatMap(a => heavyGunND(a,0,[g.basic,g.pound,g.power]))] };
    Class.masherND   = { PARENT: ['genericSquareND'], LABEL: 'Masher',
        GUNS: [...[0,90,180,270].flatMap(a => destroyerGunND(a,0,[g.basic,g.pound]))] };
    Class.hammerND   = { PARENT: ['genericSquareND'], LABEL: 'Hammer',
        GUNS: [...heavyGunND(0,0,[g.basic,g.pound,{reload:1.8,size:1.4}]),...heavyGunND(180,0,[g.basic,g.pound,{reload:1.8,size:1.4}])] };
    Class.anvilND    = { PARENT: ['genericSquareND'], LABEL: 'Anvil',
        GUNS: [...[0,60,120,180,240,300].flatMap(a => heavyGunND(a,0,[g.basic,g.pound]))] };
    Class.driverND   = { PARENT: ['genericSquareND'], LABEL: 'Driver',
        GUNS: [...destroyerGunND(0,0,[g.basic,g.pound,g.power]),...destroyerGunND(180,0,[g.basic,g.pound,g.power]),
                ...heavyGunND(90,0,[g.basic,g.pound]),...heavyGunND(270,0,[g.basic,g.pound])] };

    // T3 Quasar
    Class.grinderND    = { PARENT: ['genericTriND'], LABEL: 'Grinder',
        GUNS: [...[0,120,240].flatMap(a => [...destroyerGunND(a,0,[g.basic,g.pound,g.power]),...heavyGunND(a+60,0,[g.basic,g.pound])])] };
    Class.pulverizerND = { PARENT: ['genericTriND'], LABEL: 'Pulverizer',
        GUNS: [...[0,72,144,216,288].flatMap(a => destroyerGunND(a,0,[g.basic,g.pound,g.power,{reload:1.5}]))] };
    Class.malletND     = { PARENT: ['genericTriND'], LABEL: 'Mallet',
        GUNS: [...[0,60,120,180,240,300].flatMap(a => heavyGunND(a,0,[g.basic,g.pound,{size:1.3}]))] };
    Class.forgeND      = { PARENT: ['genericTriND'], LABEL: 'Forge',
        GUNS: [...[0,120,240].flatMap(a => [...destroyerGunND(a,0,[g.basic,g.pound]),...destroyerGunND(a+60,0.5,[g.basic,g.pound])])] };
    Class.pistonND     = { PARENT: ['genericTriND'], LABEL: 'Piston',
        GUNS: [...[0,90,180,270].flatMap(a => [...heavyGunND(a,0,[g.basic,g.pound,g.morerecoil]),...heavyGunND(a+45,0.5,[g.basic,g.pound,g.morerecoil])])] };

    // T4 Quasar finals
    Class.millstoneND  = { PARENT: ['genericPentND'], LABEL: 'Millstone',
        GUNS: [...[0,72,144,216,288].flatMap(a => [...destroyerGunND(a,0,[g.basic,g.pound,g.power]),...destroyerGunND(a+36,0.5,[g.basic,g.pound,g.power])])] };
    Class.devastatorND = { PARENT: ['genericPentND'], LABEL: 'Devastator',
        GUNS: [...[0,36,72,108,144,180,216,252,288,324].flatMap(a => destroyerGunND(a,0,[g.basic,g.pound,g.power,{reload:1.4}]))] };
    Class.wreckerND    = { PARENT: ['genericPentND'], LABEL: 'Wrecker',
        GUNS: [...[0,72,144,216,288].flatMap(a => [...destroyerGunND(a,0,[g.basic,g.pound,{size:1.5}]),...heavyGunND(a+36,0.25,[g.basic,g.pound,{size:1.2}])])] };
    Class.smelterND    = { PARENT: ['genericPentND'], LABEL: 'Smelter',
        GUNS: [...[0,72,144,216,288].flatMap(a => [...heavyGunND(a,0,[g.basic,g.pound,g.power,g.mach]),...heavyGunND(a+36,0.5,[g.basic,g.pound,g.power,g.mach])])] };
    Class.hydraulicND  = { PARENT: ['genericPentND'], LABEL: 'Hydraulic',
        GUNS: [...[0,40,80,120,160,200,240,280,320].flatMap(a => destroyerGunND(a,0,[g.basic,g.pound,g.morerecoil]))] };

    // ── T1: Vortex family (launcher) ──────────────────────────────────────
    Class.vortexND = { PARENT: ['genericEggND'], LABEL: 'Vortex',
        GUNS: [...launcherGunND(0,0,[g.basic,{reload:1.3}]),...launcherGunND(180,0.5,[g.basic,{reload:1.3}])] };

    Class.whirlND     = { PARENT: ['genericSquareND'], LABEL: 'Whirl',
        GUNS: [...[0,90,180,270].flatMap(a => launcherGunND(a,0,[g.basic,{reload:1.2}]))] };
    Class.spiralND    = { PARENT: ['genericSquareND'], LABEL: 'Spiral',
        GUNS: [...[0,60,120,180,240,300].flatMap(a => launcherGunND(a,0,[g.basic,g.skim]))] };
    Class.cycloneND   = { PARENT: ['genericSquareND'], LABEL: 'Cyclone',
        GUNS: [...[0,90,180,270].flatMap(a => [...launcherGunND(a,0,[g.basic,g.power]),...sniperGunND(a+45,0.25,[g.sniper])])] };
    Class.funnelND    = { PARENT: ['genericSquareND'], LABEL: 'Funnel',
        GUNS: [...[0,45,90,135,180,225,270,315].flatMap(a => launcherGunND(a,0,[g.basic,{reload:1.5}]))] };
    Class.maelstromND = { PARENT: ['genericSquareND'], LABEL: 'Maelstrom',
        GUNS: [...[0,90,180,270].flatMap(a => [...launcherGunND(a,0,[g.basic,g.mach]),...launcherGunND(a+45,0.5,[g.basic,g.mach])])] };

    // T3 Vortex
    Class.tornadoND   = { PARENT: ['genericTriND'], LABEL: 'Tornado',
        GUNS: [...[0,120,240].flatMap(a => [...launcherGunND(a,0,[g.basic,g.power,g.skim]),...launcherGunND(a+60,0.5,[g.basic,g.power,g.skim])])] };
    Class.augerND     = { PARENT: ['genericTriND'], LABEL: 'Auger',
        GUNS: [...[0,72,144,216,288].flatMap(a => launcherGunND(a,0,[g.basic,g.skim,g.morerecoil]))] };
    Class.hurricaneND = { PARENT: ['genericTriND'], LABEL: 'Hurricane',
        GUNS: [...[0,60,120,180,240,300].flatMap(a => launcherGunND(a,0,[g.basic,g.power]))] };
    Class.siphonND    = { PARENT: ['genericTriND'], LABEL: 'Siphon',
        GUNS: [...[0,120,240].flatMap(a => [...launcherGunND(a,0,[g.basic,g.mach]),...launcherGunND(a+40,0.33,[g.basic,g.mach]),...launcherGunND(a+80,0.66,[g.basic,g.mach])])] };
    Class.tempestND   = { PARENT: ['genericTriND'], LABEL: 'Tempest',
        GUNS: [...[0,90,180,270].flatMap(a => [...launcherGunND(a,0,[g.basic,g.power,g.mach]),...sniperGunND(a+45,0.25,[g.sniper,g.mach])])] };

    // T4 Vortex finals
    Class.typhoonND   = { PARENT: ['genericPentND'], LABEL: 'Typhoon',
        GUNS: [...[0,72,144,216,288].flatMap(a => [...launcherGunND(a,0,[g.basic,g.power,g.skim,g.morerecoil]),...launcherGunND(a+36,0.5,[g.basic,g.power,g.skim,g.morerecoil])])] };
    Class.drillboreND = { PARENT: ['genericPentND'], LABEL: 'Drillbore',
        GUNS: [...[0,36,72,108,144,180,216,252,288,324].flatMap(a => launcherGunND(a,0,[g.basic,g.skim,g.morerecoil]))] };
    Class.galeND      = { PARENT: ['genericPentND'], LABEL: 'Gale',
        GUNS: [...[0,72,144,216,288].flatMap(a => [...launcherGunND(a,0,[g.basic,g.power,g.mach]),...launcherGunND(a+36,0.25,[g.basic,g.power,g.mach]),...sniperGunND(a+18,0.5,[g.sniper,g.mach])])] };
    Class.absorbND    = { PARENT: ['genericPentND'], LABEL: 'Absorb',
        GUNS: [...[0,72,144,216,288].flatMap(a => [...launcherGunND(a,0,[g.basic,g.power,{reload:1.6}]),...heavyGunND(a+36,0,[g.basic,g.pound,g.power])])] };
    Class.stormND     = { PARENT: ['genericPentND'], LABEL: 'Storm',
        GUNS: [...[0,36,72,108,144,180,216,252,288,324].flatMap(a => [...launcherGunND(a,0,[g.basic,g.mach]),...normalGunND(a+18,0.25,[g.basic,g.twin,g.mach])])] };

    // ── T1: Eclipse family (trap) ─────────────────────────────────────────
    Class.eclipseND = { PARENT: ['genericEggND'], LABEL: 'Eclipse',
        GUNS: [...trapGunND(0,0,[g.trap]),...trapGunND(180,0.5,[g.trap])] };

    Class.shadowND   = { PARENT: ['genericSquareND'], LABEL: 'Shadow',
        GUNS: [...[0,90,180,270].flatMap(a => trapGunND(a,0,[g.trap,g.hexatrap]))] };
    Class.umbraND    = { PARENT: ['genericSquareND'], LABEL: 'Umbra',
        GUNS: [...[0,90,180,270].flatMap(a => [...trapGunND(a,0,[g.trap]),...trapGunND(a+45,0.5,[g.trap])])] };
    Class.penumbraND = { PARENT: ['genericSquareND'], LABEL: 'Penumbra',
        GUNS: [...trapGunND(0,0,[g.trap,g.hexatrap,g.power]),...trapGunND(90,0,[g.trap,g.hexatrap,g.power]),
                ...trapGunND(180,0.5,[g.trap,g.hexatrap,g.power]),...trapGunND(270,0.5,[g.trap,g.hexatrap,g.power])] };
    Class.shadeND    = { PARENT: ['genericSquareND'], LABEL: 'Shade',
        GUNS: [...[0,60,120,180,240,300].flatMap(a => trapGunND(a,0,[g.trap,{health:1.5}]))] };
    Class.duskND     = { PARENT: ['genericSquareND'], LABEL: 'Dusk',
        GUNS: [...trapGunND(0,0,[g.trap,g.hexatrap]),...trapGunND(90,0,[g.trap,g.hexatrap]),
                ...trapGunND(180,0,[g.trap,g.hexatrap]),...trapGunND(270,0,[g.trap,g.hexatrap]),
                ...sniperGunND(45,0.25,[g.sniper]),...sniperGunND(225,0.25,[g.sniper])] };

    // T3 Eclipse
    Class.phantomND    = { PARENT: ['genericTriND'], LABEL: 'Phantom',
        GUNS: [...[0,120,240].flatMap(a => [...trapGunND(a,0,[g.trap,g.hexatrap,g.power]),...trapGunND(a+60,0.5,[g.trap,g.hexatrap,g.power])])] };
    Class.darkMatterND = { PARENT: ['genericTriND'], LABEL: 'Dark Matter',
        GUNS: [...[0,72,144,216,288].flatMap(a => trapGunND(a,0,[g.trap,g.hexatrap,{health:2}]))] };
    Class.halfLightND  = { PARENT: ['genericTriND'], LABEL: 'Half-Light',
        GUNS: [...[0,120,240].flatMap(a => [...trapGunND(a,0,[g.trap,g.hexatrap]),...normalGunND(a+60,0,[g.basic,g.twin])])] };
    Class.twilightND   = { PARENT: ['genericTriND'], LABEL: 'Twilight',
        GUNS: [...[0,60,120,180,240,300].flatMap(a => trapGunND(a,0,[g.trap,g.power,{health:1.3}]))] };
    Class.midnightND   = { PARENT: ['genericTriND'], LABEL: 'Midnight',
        GUNS: [...[0,120,240].flatMap(a => [...trapGunND(a,0,[g.trap,g.hexatrap,g.power]),...trapGunND(a+40,0.33,[g.trap,g.hexatrap,g.power]),...trapGunND(a+80,0.66,[g.trap,g.hexatrap,g.power])])] };

    // T4 Eclipse finals
    Class.wraithND       = { PARENT: ['genericPentND'], LABEL: 'Wraith',
        GUNS: [...[0,72,144,216,288].flatMap(a => [...trapGunND(a,0,[g.trap,g.hexatrap,g.power]),...trapGunND(a+36,0.5,[g.trap,g.hexatrap,g.power])])] };
    Class.singularityND  = { PARENT: ['genericPentND'], LABEL: 'Singularity',
        GUNS: [...[0,36,72,108,144,180,216,252,288,324].flatMap(a => trapGunND(a,0,[g.trap,g.hexatrap,{health:1.8}]))] };
    Class.dawnND         = { PARENT: ['genericPentND'], LABEL: 'Dawn',
        GUNS: [...[0,72,144,216,288].flatMap(a => [...trapGunND(a,0,[g.trap,g.power,{health:2}]),...sniperGunND(a+36,0.25,[g.sniper,g.power])])] };
    Class.eventHorizonND = { PARENT: ['genericPentND'], LABEL: 'Event Horizon',
        GUNS: [...[0,72,144,216,288].flatMap(a => [...trapGunND(a,0,[g.trap,g.hexatrap,g.power,{health:2}]),...trapGunND(a+36,0.5,[g.trap,g.hexatrap,g.power,{health:2}]),...heavyGunND(a+18,0.25,[g.basic,g.pound])])] };
    Class.voidND         = { PARENT: ['genericPentND'], LABEL: 'Void',
        GUNS: [...[0,40,80,120,160,200,240,280,320].flatMap(a => trapGunND(a,0,[g.trap,g.hexatrap,g.power,{health:1.5,reload:1.2}]))] };

    // ════════════════════════════════════════════════════════════════════════
    //  BODY TREE  (6 paths, triangle shape, then pentagon)
    // ════════════════════════════════════════════════════════════════════════
    // Body deco helpers
    const spinTurret = (size, color, speed=0.03) => ({
        POSITION: [size, 0, 0, 0, 360, 1],
        TYPE: ['egg', { COLOR: color, CONTROLLERS: [['spin', {speed}]] }],
    });

    // T1 Body options (square)
    Class.shieldND = { PARENT: ['genericSquareND'], LABEL: 'Shield',
        BODY: { HEALTH: 1.5, SHIELD: 2, REGEN: 1.8, SPEED: 0.85 }, GUNS: [],
        TURRETS: [{ POSITION: [14, 0, 0, 0, 0, 1], TYPE: ['square', { COLOR: 13 }] }] };
    Class.thrusterND = { PARENT: ['genericSquareND'], LABEL: 'Thruster',
        BODY: { SPEED: 1.6, HEALTH: 0.75 }, GUNS: [],
        TURRETS: [{ POSITION: [10, 0, 0, 0, 0, 1], TYPE: ['egg', { COLOR: 6 }] }] };
    Class.titanND2 = { PARENT: ['genericSquareND'], LABEL: 'Titan',
        SIZE: 1.25, BODY: { HEALTH: 2, SPEED: 0.82 }, GUNS: [],
        TURRETS: [{ POSITION: [16, 0, 0, 0, 0, 1], TYPE: ['square', { COLOR: 9 }] }] };
    Class.reactorND = { PARENT: ['genericSquareND'], LABEL: 'Reactor',
        BODY: { HEALTH: 1.3, SHIELD: 1.5, REGEN: 2.5, SPEED: 0.9 }, GUNS: [],
        TURRETS: [spinTurret(12, 4, 0.04)] };
    Class.sentinelND = { PARENT: ['genericSquareND'], LABEL: 'Sentinel',
        BODY: { FOV: 1.3, SPEED: 0.95 }, GUNS: [],
        TURRETS: [{ POSITION: [12, 0, 0, 0, 360, 1], TYPE: ['autoTankGun', { INDEPENDENT: true, CONTROLLERS: ['nearestDifferentMaster'] }] }] };
    Class.phantomBodyND = { PARENT: ['genericSquareND'], LABEL: 'Phantom',
        BODY: { SPEED: 1.3, HEALTH: 0.85, DENSITY: 0.6 }, GUNS: [],
        TURRETS: [spinTurret(10, 16, -0.05)] };

    // T2 Body (triangle)
    Class.bastionND     = { PARENT: ['genericTriND'], LABEL: 'Bastion',
        BODY: { HEALTH: 2, SHIELD: 2.5, REGEN: 2, SPEED: 0.75 }, GUNS: [],
        TURRETS: [{ POSITION: [18, 0, 0, 0, 0, 1], TYPE: ['triangle', { COLOR: 2 }] },
                  spinTurret(10, 4, 0.02)] };
    Class.afterburnerND = { PARENT: ['genericTriND'], LABEL: 'Afterburner',
        BODY: { SPEED: 2, HEALTH: 0.65 }, GUNS: [],
        TURRETS: [{ POSITION: [14, 0, 0, 0, 0, 1], TYPE: ['egg', { COLOR: 6 }] },
                  spinTurret(8, 6, 0.06)] };
    Class.colossusND    = { PARENT: ['genericTriND'], LABEL: 'Colossus',
        SIZE: 1.35, BODY: { HEALTH: 2.5, SPEED: 0.75 }, GUNS: [],
        TURRETS: [{ POSITION: [20, 0, 0, 0, 0, 1], TYPE: ['triangle', { COLOR: 9 }] }] };
    Class.generatorND   = { PARENT: ['genericTriND'], LABEL: 'Generator',
        BODY: { HEALTH: 1.5, SHIELD: 2, REGEN: 3, SPEED: 0.85 }, GUNS: [],
        TURRETS: [spinTurret(14, 4, 0.03), spinTurret(8, 6, -0.05)] };
    Class.radarND       = { PARENT: ['genericTriND'], LABEL: 'Radar',
        BODY: { FOV: 1.5, SPEED: 0.92 }, GUNS: [],
        TURRETS: [{ POSITION: [10, 0, 0, 0, 360, 1], TYPE: ['autoTankGun', { INDEPENDENT: true, CONTROLLERS: ['nearestDifferentMaster'] }] },
                  { POSITION: [12, 0, 0, 0, 360, 1], TYPE: ['autoTankGun', { INDEPENDENT: true, CONTROLLERS: ['nearestDifferentMaster'] }] }] };
    Class.ghostND       = { PARENT: ['genericTriND'], LABEL: 'Ghost',
        BODY: { SPEED: 1.5, HEALTH: 0.7, DENSITY: 0.5 }, GUNS: [],
        TURRETS: [spinTurret(12, 16, -0.06), spinTurret(7, 15, 0.08)] };

    // T3 Body (pentagon)
    Class.rampartND     = { PARENT: ['genericPentND'], LABEL: 'Rampart',
        BODY: { HEALTH: 3, SHIELD: 3.5, REGEN: 2.5, SPEED: 0.65 }, GUNS: [],
        TURRETS: [{ POSITION: [21, 0, 0, 0, 0, 1], TYPE: ['pentagon', { COLOR: 14 }] },
                  spinTurret(12, 4, 0.02), spinTurret(7, 13, -0.03)] };
    Class.warpND        = { PARENT: ['genericPentND'], LABEL: 'Warp',
        BODY: { SPEED: 2.4, HEALTH: 0.55 }, GUNS: [],
        TURRETS: [{ POSITION: [16, 0, 0, 0, 0, 1], TYPE: ['egg', { COLOR: 6 }] },
                  spinTurret(10, 6, 0.08), spinTurret(6, 4, -0.1)] };
    Class.leviathanND   = { PARENT: ['genericPentND'], LABEL: 'Leviathan',
        SIZE: 1.5, BODY: { HEALTH: 3.5, SPEED: 0.6 }, GUNS: [],
        TURRETS: [{ POSITION: [22, 0, 0, 0, 0, 1], TYPE: ['pentagon', { COLOR: 9 }] },
                  spinTurret(14, 13, 0.02)] };
    Class.capacitorND   = { PARENT: ['genericPentND'], LABEL: 'Capacitor',
        BODY: { HEALTH: 2, SHIELD: 2.5, REGEN: 4, SPEED: 0.8 }, GUNS: [],
        TURRETS: [spinTurret(16, 4, 0.025), spinTurret(10, 6, -0.04), spinTurret(6, 12, 0.06)] };
    Class.observatoryND = { PARENT: ['genericPentND'], LABEL: 'Observatory',
        BODY: { FOV: 1.8, SPEED: 0.88 }, GUNS: [],
        TURRETS: [{ POSITION: [12, 0, 0, 0, 360, 1], TYPE: ['autoTankGun', { INDEPENDENT: true, CONTROLLERS: ['nearestDifferentMaster'] }] },
                  { POSITION: [14, 0, 0, 0, 360, 1], TYPE: ['autoTankGun', { INDEPENDENT: true, CONTROLLERS: ['nearestDifferentMaster'] }] },
                  { POSITION: [16, 0, 0, 0, 360, 1], TYPE: ['autoTankGun', { INDEPENDENT: true, CONTROLLERS: ['nearestDifferentMaster'] }] }] };
    Class.spectreND     = { PARENT: ['genericPentND'], LABEL: 'Spectre',
        BODY: { SPEED: 1.8, HEALTH: 0.6, DENSITY: 0.4 }, GUNS: [],
        TURRETS: [spinTurret(16, 16, -0.07), spinTurret(10, 15, 0.09), spinTurret(6, 17, -0.11)] };

    // ════════════════════════════════════════════════════════════════════════
    //  UPGRADE TREE
    // ════════════════════════════════════════════════════════════════════════

    // Hook entry into addons menu
    const _entry = ['menu_addons', 'addons']
        .find(n => Class[n] && Array.isArray(Class[n].UPGRADES_TIER_0));
    if (_entry) Class[_entry].UPGRADES_TIER_0.push('dreadND');
    else console.warn('[novaDreads] Could not find addons menu - connect dreadND manually');

    // Entry → weapon + body split
    Class.dreadND.UPGRADES_TIER_0 = ['weaponBranchND', 'bodyBranchND'];

    // Weapon branch → 5 T1 families
    Class.weaponBranchND.UPGRADES_TIER_0 = ['cometND', 'pulsarND', 'quasarND', 'vortexND', 'eclipseND'];

    // ── Comet tree ───────────────────────────────────────────────────────────
    Class.cometND.UPGRADES_TIER_0    = ['meteorND', 'bolideND', 'streakND', 'blazeND', 'tailND'];
    Class.meteorND.UPGRADES_TIER_0   = ['meteoriteND'];
    Class.bolideND.UPGRADES_TIER_0   = ['impactND'];
    Class.streakND.UPGRADES_TIER_0   = ['shootingStarND'];
    Class.blazeND.UPGRADES_TIER_0    = ['infernoND'];
    Class.tailND.UPGRADES_TIER_0     = ['trainND'];
    Class.meteoriteND.UPGRADES_TIER_0   = ['supernovaND'];
    Class.impactND.UPGRADES_TIER_0      = ['craterND'];
    Class.shootingStarND.UPGRADES_TIER_0= ['novaShowerND'];
    Class.infernoND.UPGRADES_TIER_0     = ['novaFlareND'];
    Class.trainND.UPGRADES_TIER_0       = ['cometTrailND'];
    Class.supernovaND.UPGRADES_TIER_0   = [];
    Class.craterND.UPGRADES_TIER_0      = [];
    Class.novaShowerND.UPGRADES_TIER_0  = [];
    Class.novaFlareND.UPGRADES_TIER_0   = [];
    Class.cometTrailND.UPGRADES_TIER_0  = [];

    // ── Pulsar tree ──────────────────────────────────────────────────────────
    Class.pulsarND.UPGRADES_TIER_0   = ['strobeND', 'surgeND', 'flashND', 'flickerND', 'zapND'];
    Class.strobeND.UPGRADES_TIER_0   = ['pulseBeamND'];
    Class.surgeND.UPGRADES_TIER_0    = ['powerSurgeND'];
    Class.flashND.UPGRADES_TIER_0    = ['lightningND'];
    Class.flickerND.UPGRADES_TIER_0  = ['oscillatorND'];
    Class.zapND.UPGRADES_TIER_0      = ['arcND'];
    Class.pulseBeamND.UPGRADES_TIER_0  = ['xrayND'];
    Class.powerSurgeND.UPGRADES_TIER_0 = ['overchargeND'];
    Class.lightningND.UPGRADES_TIER_0  = ['thunderboltND'];
    Class.oscillatorND.UPGRADES_TIER_0 = ['frequencyND'];
    Class.arcND.UPGRADES_TIER_0        = ['plasmaND'];
    Class.xrayND.UPGRADES_TIER_0       = [];
    Class.overchargeND.UPGRADES_TIER_0 = [];
    Class.thunderboltND.UPGRADES_TIER_0= [];
    Class.frequencyND.UPGRADES_TIER_0  = [];
    Class.plasmaND.UPGRADES_TIER_0     = [];

    // ── Quasar tree ──────────────────────────────────────────────────────────
    Class.quasarND.UPGRADES_TIER_0   = ['crusherND', 'masherND', 'hammerND', 'anvilND', 'driverND'];
    Class.crusherND.UPGRADES_TIER_0  = ['grinderND'];
    Class.masherND.UPGRADES_TIER_0   = ['pulverizerND'];
    Class.hammerND.UPGRADES_TIER_0   = ['malletND'];
    Class.anvilND.UPGRADES_TIER_0    = ['forgeND'];
    Class.driverND.UPGRADES_TIER_0   = ['pistonND'];
    Class.grinderND.UPGRADES_TIER_0    = ['millstoneND'];
    Class.pulverizerND.UPGRADES_TIER_0 = ['devastatorND'];
    Class.malletND.UPGRADES_TIER_0     = ['wreckerND'];
    Class.forgeND.UPGRADES_TIER_0      = ['smelterND'];
    Class.pistonND.UPGRADES_TIER_0     = ['hydraulicND'];
    Class.millstoneND.UPGRADES_TIER_0  = [];
    Class.devastatorND.UPGRADES_TIER_0 = [];
    Class.wreckerND.UPGRADES_TIER_0    = [];
    Class.smelterND.UPGRADES_TIER_0    = [];
    Class.hydraulicND.UPGRADES_TIER_0  = [];

    // ── Vortex tree ──────────────────────────────────────────────────────────
    Class.vortexND.UPGRADES_TIER_0   = ['whirlND', 'spiralND', 'cycloneND', 'funnelND', 'maelstromND'];
    Class.whirlND.UPGRADES_TIER_0    = ['tornadoND'];
    Class.spiralND.UPGRADES_TIER_0   = ['augerND'];
    Class.cycloneND.UPGRADES_TIER_0  = ['hurricaneND'];
    Class.funnelND.UPGRADES_TIER_0   = ['siphonND'];
    Class.maelstromND.UPGRADES_TIER_0= ['tempestND'];
    Class.tornadoND.UPGRADES_TIER_0   = ['typhoonND'];
    Class.augerND.UPGRADES_TIER_0     = ['drillboreND'];
    Class.hurricaneND.UPGRADES_TIER_0 = ['galeND'];
    Class.siphonND.UPGRADES_TIER_0    = ['absorbND'];
    Class.tempestND.UPGRADES_TIER_0   = ['stormND'];
    Class.typhoonND.UPGRADES_TIER_0   = [];
    Class.drillboreND.UPGRADES_TIER_0 = [];
    Class.galeND.UPGRADES_TIER_0      = [];
    Class.absorbND.UPGRADES_TIER_0    = [];
    Class.stormND.UPGRADES_TIER_0     = [];

    // ── Eclipse tree ─────────────────────────────────────────────────────────
    Class.eclipseND.UPGRADES_TIER_0  = ['shadowND', 'umbraND', 'penumbraND', 'shadeND', 'duskND'];
    Class.shadowND.UPGRADES_TIER_0   = ['phantomND'];
    Class.umbraND.UPGRADES_TIER_0    = ['darkMatterND'];
    Class.penumbraND.UPGRADES_TIER_0 = ['halfLightND'];
    Class.shadeND.UPGRADES_TIER_0    = ['twilightND'];
    Class.duskND.UPGRADES_TIER_0     = ['midnightND'];
    Class.phantomND.UPGRADES_TIER_0    = ['wraithND'];
    Class.darkMatterND.UPGRADES_TIER_0 = ['singularityND'];
    Class.halfLightND.UPGRADES_TIER_0  = ['dawnND'];
    Class.twilightND.UPGRADES_TIER_0   = ['eventHorizonND'];
    Class.midnightND.UPGRADES_TIER_0   = ['voidND'];
    Class.wraithND.UPGRADES_TIER_0       = [];
    Class.singularityND.UPGRADES_TIER_0  = [];
    Class.dawnND.UPGRADES_TIER_0         = [];
    Class.eventHorizonND.UPGRADES_TIER_0 = [];
    Class.voidND.UPGRADES_TIER_0         = [];

    // ── Body tree ────────────────────────────────────────────────────────────
    Class.bodyBranchND.UPGRADES_TIER_0  = ['shieldND', 'thrusterND', 'titanND2', 'reactorND', 'sentinelND', 'phantomBodyND'];
    Class.shieldND.UPGRADES_TIER_0      = ['bastionND'];
    Class.thrusterND.UPGRADES_TIER_0    = ['afterburnerND'];
    Class.titanND2.UPGRADES_TIER_0      = ['colossusND'];
    Class.reactorND.UPGRADES_TIER_0     = ['generatorND'];
    Class.sentinelND.UPGRADES_TIER_0    = ['radarND'];
    Class.phantomBodyND.UPGRADES_TIER_0 = ['ghostND'];
    Class.bastionND.UPGRADES_TIER_0     = ['rampartND'];
    Class.afterburnerND.UPGRADES_TIER_0 = ['warpND'];
    Class.colossusND.UPGRADES_TIER_0    = ['leviathanND'];
    Class.generatorND.UPGRADES_TIER_0   = ['capacitorND'];
    Class.radarND.UPGRADES_TIER_0       = ['observatoryND'];
    Class.ghostND.UPGRADES_TIER_0       = ['spectreND'];
    Class.rampartND.UPGRADES_TIER_0     = [];
    Class.warpND.UPGRADES_TIER_0        = [];
    Class.leviathanND.UPGRADES_TIER_0   = [];
    Class.capacitorND.UPGRADES_TIER_0   = [];
    Class.observatoryND.UPGRADES_TIER_0 = [];
    Class.spectreND.UPGRADES_TIER_0     = [];

    // Count total classes
    const ndClasses = Object.keys(Class).filter(k => k.endsWith('ND') || k.endsWith('ND2')).length;
    console.log(`[novaDreads] Loaded ${ndClasses} Nova Dread classes. Entry: dreadND`);
};