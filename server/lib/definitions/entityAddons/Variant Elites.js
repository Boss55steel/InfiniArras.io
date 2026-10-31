const { combineStats, makeAura, makeAuto, makeOver, makeHat, dereference,  makeGuard, makeTurret, makeBird, LayeredBoss, weaponMirror, makeRadialAuto, weaponArray, skillSet, makeMenu, setTurretProjectileRecoil } = require('../facilitators.js');
const { base, statnames, dfltskl, smshskl } = require('../constants.js');
const g = require('../gunvals.js');

const OGg = {
// Bases
    basic: { reload: 10.5, recoil: 1.4, shudder: 0.1, damage: 0.75, speed: 5, spray: 15 },
    doublestats: {damage: 2, pen: 2, health: 2},
    triplestats: {damage: 10, pen: 10, health: 10},
    drone: { reload: 36, recoil: 0.25, shudder: 0.1, size: 0.6, speed: 1.5, spray: 0.1 },
    trap: { reload: 23, shudder: 0.25, size: 0.7, damage: 0.75, speed: 3.25, resist: 3, spray: 0 },
    swarm: { reload: 23, recoil: 0.25, shudder: 0.05, size: 0.4, damage: 0.75, speed: 4, spray: 5 },
    factory: { reload: 48, shudder: 0.1, size: 0.7, damage: 0.75, speed: 3, spray: 0.1 },
    productionist: { reload: 56, recoil: 0.25, shudder: 0.05, size: 0.7, damage: 0.75, speed: 4, range: 1.5, spray: 5 },



// Spammers
    bent: { reload: 1.1, shudder: 0.8, health: 0.9, pen: 0.8, density: 0.8, spray: 0.5 },
    desmos: { reload: 1.1, range: 1.2, shudder: 0, spray: 0, damage: 0.75, speed: 0.5 },
    single: { reload: 1.05, speed: 1.05 },
    twin: { recoil: 0.5, shudder: 0.9, health: 0.9, damage: 0.7, spray: 1.2 },
    doubleTwin: { damage: 1.1 },
    tripleTwin: { health: 1.1 },
    tri: { recoil: 0.9, health: 0.9, speed: 0.8, maxSpeed: 0.8, range: 0.6 },
    flank: { recoil: 1.2, health: 1.02, damage: 0.81, pen: 0.9, maxSpeed: 0.85, density: 1.2 },
    trifront: { recoil: 0.2, speed: 1.3, maxSpeed: 1.1, range: 1.5 },
    hewnDouble: { reload: 1.25, recoil: 1.5, health: 0.9, damage: 0.85, maxSpeed: 0.9 },
    tripleShot: { reload: 1.1, shudder: 0.8, health: 0.9, pen: 0.8, density: 0.8, spray: 0.5 },
    spreadshotMain: { reload: 0.781, recoil: 0.25, shudder: 0.5, health: 0.5, speed: 1.923, maxSpeed: 2.436 },
    spreadshot: { reload: 1.5, shudder: 0.25, speed: 0.7, maxSpeed: 0.7, spray: 0.25 },
    triplet: { reload: 1.2, recoil: 2/3, shudder: 0.9, health: 0.85, damage: 0.85, pen: 0.9, density: 1.1, spray: 0.9, resist: 0.95 },
    turret: { reload: 2, health: 0.8, damage: 0.6, pen: 0.7, density: 0.1 },
    autoTurret: { reload: 0.9, recoil: 0.75, shudder: 0.5, size: 0.8, health: 0.9, damage: 0.6, pen: 1.2, speed: 1.1, range: 0.8, density: 1.3, resist: 1.25 },
    quint: { reload: 1.5, recoil: 0.667, shudder: 0.9, pen: 0.9, density: 1.1, spray: 0.9, resist: 0.95 },
    machineShot: { reload: 0.3, recoil: 0.8, shudder: 0.4, health: 0.7, damage: 0.7, speed: 4.5, maxSpeed: 5.9, spray: 19 },


    //Reload 
    halfreload: { reload: 2 },
    veryslowreload: {reload: 1000},
    morereload: { reload: 0.7 },
    evenmorereload: {reload: 0.5},
    lessreload: {reload: 1.3},
    bitlessreload: {reload: 1.1},
    one_third_reload: { reload: 1.333 },
    doublereload: {reload: 0.5},
// Snipers
    sniper: { reload: 1.35, shudder: 0.25, damage: 0.8, pen: 1.1, speed: 1.5, maxSpeed: 1.5, density: 1.5, spray: 0.2, resist: 1.15 },
    crossbow: { reload: 2, health: 0.6, damage: 0.6, pen: 0.8 },
    assassin: { reload: 1.65, shudder: 0.25, health: 1.15, pen: 1.1, speed: 1.18, maxSpeed: 1.18, density: 3, resist: 1.3 },
    hunter: { reload: 1.5, recoil: 0.7, size: 0.95, damage: 0.9, speed: 1.1, maxSpeed: 0.8, density: 1.2, resist: 1.15 },
    hunterSecondary: { size: 0.9, health: 2, damage: 0.5, pen: 1.5, density: 1.2, resist: 1.1 },
    predator: { reload: 1.4, size: 0.8, health: 1.5, damage: 0.9, pen: 1.2, speed: 0.9, maxSpeed: 0.9 },
    dual: { reload: 2, shudder: 0.8, health: 1.5, speed: 1.3, maxSpeed: 1.1, resist: 1.25 },
    rifle: { reload: 0.8, recoil: 0.8, shudder: 1.5, health: 0.8, damage: 0.8, pen: 0.9, spray: 2 },
    blunderbuss: { recoil: 0.1, shudder: 0.5, health: 0.4, damage: 0.2, pen: 0.4, spray: 0.5 },
    railgun: { reload: 4.2, damage: 0.81, health: 3.06, resist: 2.3, density: 0.7, speed: 1.375, maxSpeed: 1.375 },
    marksman: { pen: 2, damage: 0.12, health: 25/3, reload: 1.75 },

// Machine guns
    machineGun: { reload: 0.5, recoil: 0.8, shudder: 1.7, health: 0.7, damage: 0.7, maxSpeed: 0.8, spray: 2.5 },
    minigun: { reload: 1.25, recoil: 0.6, size: 0.8, health: 0.55, damage: 0.45, pen: 1.25, speed: 1.33, density: 1.25, spray: 0.5, resist: 1.1 },
    streamliner: { reload: 1.1, recoil: 0.6, damage: 0.65, speed: 1.24 },
    nailgun: { reload: 0.85, recoil: 2.5, size: 0.8, damage: 0.7, density: 2 },
    pelleter: { reload: 1.25, recoil: 0.25, shudder: 1.5, size: 1.1, damage: 0.35, pen: 1.35, speed: 0.9, maxSpeed: 0.8, density: 1.5, spray: 1.5, resist: 1.2 },
    gunner: { recoil: 0.25, shudder: 1.5, size: 1.2, health: 1.35, damage: 0.25, pen: 1.25, speed: 0.8, maxSpeed: 0.65, density: 1.5, spray: 1.5, resist: 1.2 },
    machineGunner: { reload: 0.66, recoil: 0.8, shudder: 2, damage: 0.75, speed: 1.2, maxSpeed: 0.8, spray: 2.5 },
    blaster: { recoil: 1.2, shudder: 1.25, size: 1.1, health: 1.5, pen: 0.6, speed: 0.8, maxSpeed: 0.33, range: 0.6, density: 0.5, spray: 1.5, resist: 0.8 },
    focal: { reload: 1.25, recoil: 4/3, shudder: 0.8, health: 0.8, pen: 1.1, speed: 1.25, maxSpeed: 1.25, range: 1.1, density: 1.25, spray: 0.5, resist: 1.1 },
    atomizer: { reload: 0.3, recoil: 0.8, size: 0.5, damage: 0.75, speed: 1.2, maxSpeed: 0.8, spray: 2.25 },
    spam: { reload: 1.1, size: 1.05, damage: 1.1, speed: 0.9, maxSpeed: 0.7, resist: 1.05 },
    gunnerDominator: { reload: 1.1, recoil: 0, shudder: 1.1, size: 0.5, health: 0.5, damage: 0.5, speed: 1.1, density: 0.9, spray: 1.2, resist: 0.8 },

// Flanks
    flankGuard: { recoil: 1.2, health: 1.02, damage: 0.81, pen: 0.9, maxSpeed: 0.85, density: 1.2 },
    cyclone: { health: 1.3, damage: 1.3, pen: 1.1, speed: 1.5, maxSpeed: 1.15 },
    triAngle: { recoil: 0.9, health: 0.9, speed: 0.8, maxSpeed: 0.8, range: 0.6 },
    triAngleFront: { recoil: 0.2, speed: 1.3, maxSpeed: 1.1, range: 1.5 },
    thruster: { recoil: 1.5, shudder: 2, health: 0.5, damage: 0.5, pen: 0.7, spray: 0.5, resist: 0.7 },

// Drones
    overseer: { reload: 1.25, size: 0.85, health: 0.7, damage: 0.8, maxSpeed: 0.9, density: 2 },
    overdrive: { reload: 2.5, health: 0.8, damage: 0.8, pen: 0.8, speed: 0.9, maxSpeed: 0.9, range: 0.9, spray: 1.2 },
    commander: { reload: 1.5, health: 0.4, damage: 0.7 },
    baseProtector: { reload: 0.7, size: 1.5, recoil: 0.000001, health: 100, speed: 2.3, maxSpeed: 1.1, range: 0.5, density: 5, resist: 10 },
    battleship: { health: 1.25, damage: 1.15, maxSpeed: 0.85, resist: 1.1 },
    carrier: { reload: 1.5, damage: 0.8, speed: 1.3, maxSpeed: 1.2, range: 1.2 },
    bee: { reload: 1.3, size: 1.4, damage: 1.5, pen: 0.5, speed: 1.5, maxSpeed: 1.5, density: 0.25 },
    sunchip: { reload: 4, size: 1.4, health: 0.5, damage: 0.4, pen: 0.6, density: 0.8 },
    maleficitor: { reload: 0.25, size: 1.05, health: 1.15, damage: 1.15, pen: 1.15, speed: 0.8, maxSpeed: 0.8, density: 1.15 },
    summoner: { reload: 0.3, size: 1.125, health: 0.5, damage: 0.345, pen: 0.4, density: 0.8 },
    minionGun: { recoil: 0, shudder: 2, health: 0.4, damage: 0.4, pen: 1.2, range: 0.75, spray: 2 },
    babyfactory: { reload: 1.5, maxSpeed: 1.25 },
    bigCheese: { reload: 1.5, size: 1.8, health: 2.5, speed: 1.25 },
    mothership: { reload: 1.25, pen: 1.1, speed: 0.775, maxSpeed: 0.8, range: 15, resist: 1.15 },
    satellite: { size: 0.8, reload: 3, damage: 1.875 },

// Heavy cannons
    pounder: { reload: 2, recoil: 1.6, damage: 2, speed: 0.85, maxSpeed: 0.8, density: 1.5, resist: 1.15 },
    destroyer: { reload: 2, recoil: 1.8, shudder: 0.5, health: 2, damage: 0.90, pen: 1.2, speed: 0.50, maxSpeed: 0.6, density: 2, resist: 3 },
    annihilator: { reload: 1, recoil: 1.35, damage: 0.86 },
    hive: { reload: 1.5, recoil: 0.8, size: 0.8, health: 0.7, damage: 0.3, maxSpeed: 0.6 },
    artillery: { reload: 1.2, recoil: 0.7, size: 0.9, speed: 1.15, maxSpeed: 1.1, density: 1.5 },
    mortar: { reload: 1.2, health: 1.1, speed: 0.8, maxSpeed: 0.8 },
    shotgun: { reload: 8, recoil: 0.4, size: 1.5, damage: 0.4, pen: 0.8, speed: 1.8, maxSpeed: 0.6, density: 1.2, spray: 1.2 },
    destroyerDominator: { reload: 6.5, recoil: 0, size: 0.975, health: 5, damage: 5, pen: 5, speed: 0.575, maxSpeed: 0.475, spray: 0.5 },

// Missiles
    launcher: { reload: 1.5, recoil: 1.5, shudder: 0.1, size: 0.72, health: 1.05, damage: 0.925, speed: 0.9, maxSpeed: 1.2, range: 1.1, resist: 1.5 },
    skimmer: { recoil: 0.8, shudder: 0.8, size: 0.9, health: 1.35, damage: 0.8, pen: 2, speed: 0.85, maxSpeed: 0.85, resist: 1.1 },
    snake: { reload: 0.4, shudder: 4, health: 1.5, damage: 0.9, pen: 1.2, speed: 0.1, maxSpeed: 0.35, density: 3, spray: 6, resist: 0.5 },
    snakeskin: { reload: 0.6, shudder: 2, health: 0.5, damage: 0.5, speed: 2, maxSpeed: 0.2, range: 0.4, spray: 5 },
    sidewinder: { reload: 1.5, recoil: 2, health: 1.5, damage: 0.9, speed: 0.15, maxSpeed: 0.5 },
    rocketeer: { reload: 1.4, shudder: 0.9, size: 1.2, health: 1.5, damage: 1.4, pen: 1.4, speed: 0.3, range: 1.2, resist: 1.4 },
    missileTrail: { reload: 0.6, recoil: 0.25, shudder: 2, damage: 0.9, pen: 0.7, speed: 0.4, range: 0.5 },
    rocketeerMissileTrail: { reload: 0.5, recoil: 7, shudder: 1.5, size: 0.8, health: 0.8, damage: 0.7, speed: 0.9, maxSpeed: 0.8, spray: 5 },

// Traps and blocks
    setTrap: { reload: 1.1, recoil: 2, shudder: 0.1, size: 1.5, health: 2, pen: 1.25, speed: 2.2, maxSpeed: 2.15, range: 1.25, resist: 1.25 },
    construct: { reload: 1.3, size: 0.9, maxSpeed: 1.1 },
    boomerang: { reload: 0.8, health: 0.5, damage: 0.5, speed: 0.75, maxSpeed: 0.75, range: 4/3 },
    nestKeeper: { reload: 3, size: 0.75, health: 1.05, damage: 1.05, pen: 1.1, speed: 0.5, maxSpeed: 0.5, range: 0.5, density: 1.1 },
    hexaTrapper: { reload: 1.3, shudder: 1.25, speed: 0.8, range: 0.5 },
    trapperDominator: { reload: 1.46, recoil: 0, shudder: 0.25, health: 1.25, damage: 1.45, pen: 1.6, speed: 0.5, maxSpeed: 2, range: 1.1, spray: 0.5 },
    megaTrapper: { reload: 2, damage: 2, recoil: 2, size: 1.2 },
    barricade: { reload: 0.75, damage: 0.79, range: 0.5 },
        block: {//buffed - nerfed
        reload: 1.25,
        recoil: 2,
        shudder: .1,
        size: 1.5,
        health: 1.25,//1.875
        damage: 1.35,//1
        pen: .95,
        speed: 1.475,
        maxSpeed: 2.475,
        range: 1.215,
        density: 1.1,
        spray: 1,
        resist: 1.5
    },

    // Recoil
    tonsmorrecoil: { recoil: 4 },
    lotsmorrecoil: { recoil: 1.8 },
    muchmorerecoil: { recoil: 1.35 },
    morerecoil: { recoil: 1.15 },
    halfrecoil: { recoil: 0.5 },
    norecoil: { recoil: 0 },

// Speed
    fast: { speed: 1.2 },
    veryfast: { speed: 2.5 },
    morespeed: { speed: 1.3, maxSpeed: 1.3 },
    slow: { speed: 0.8 },

// Misc
    blank: { reload: 1, recoil: 1, shudder: 1, size: 1, health: 1, damage: 1, pen: 1, speed: 1, maxSpeed: 1, range: 1, density: 1, spray: 1, resist: 1 },
    weak: { reload: 2, health: 0.6, damage: 0.6, pen: 0.8, speed: 0.5, maxSpeed: 0.7, range: 0.25, density: 0.3 },
    power: { shudder: 0.6, size: 1.2, pen: 1.25, speed: 2, maxSpeed: 1.7, density: 2, spray: 0.5, resist: 1.5 },
    fake: { size: 0.00001, health: 0.0001, speed: 0, maxSpeed: 0, shudder: 0, spray: 0, recoil: 0, range: 0 },
    op: { reload: 0.5, recoil: 1.3, health: 4, damage: 4, pen: 4, speed: 3, maxSpeed: 2, density: 5, spray: 2 },
    arenaCloser: { reload: 0.80, recoil: 0.25, health: 1000, damage: 1000, pen: 1000, speed: 2.5, maxSpeed: 1.15, range: 1.8, density: 4, spray: 0.25 },
    healer: { damage: -1, speed: 0.5, maxSpeed: 0.5, recoil: 0.5 },
    lowPower: { shudder: 2, health: 0.5, damage: 0.5, pen: 0.7, spray: 0.5, resist: 0.7 },
    highPower: { shudder: 0.5, health: 2, damage: 2, pen: 1.4, spray: 2, resist: 1.3 },
    halfrange: { range: 0.5 },
    aura: { reload: 0.001, recoil: 0.001, shudder: 0.001, size: 6, speed: 0.001, maxSpeed: 0.001, spray: 0.001 },
    noSpread: { shudder: 0, spray: 0 },
    minion: { shudder: 2, health: 0.4, damage: 0.4, pen: 1.2, range: 0.75, spray: 2 },
        shrapnelExplosion: {//nerfed - buffed
        reload: 4.5,
        recoil: 3.2375000000000003,
        shudder: 0.5,
        size: 0.3,
        health: 40,
        damage: 0.5,
        pen: 1.32,
        speed: 0,
        maxSpeed: 0,
        range: 1,//1
        density: 2.5600000000000005,
        spray: 1,
        resist: 3.4499999999999997
    },
        smaller: {size: .75,},
        double_speed: {speed: 2, maxSpeed: 2},
        smole: { size: 0.00001, health: 1, speed: 0, maxSpeed: 0, shudder: 0, spray: 0, recoil: 0, range: 0 },
        quintuple_reload: {reload: .2},
            c4: {reload: 1000, recoil: 0, health: 3, damage: 6, pen: 3, speed: 0, maxSpeed: 0, range: .1, density: 2},
            half_damage: {health: .6, damage: .5},
            no_speed: {speed: 0.00001, maxSpeed: 0.00001},
            more_range: {range: 1.15},
            bigger: {size: 1.25},
                redistribute: {//buffed
        reload: 4.75,
        recoil: 3,
        shudder: 1,
        size: .4,
        health: 1.2,
        damage: 5.2,//2.4
        pen: 1.8,
        speed: 2,
        maxSpeed: 1.85,
        range: 1,
        density: 1.25,
        spray: 1.15,
        resist: 1.25
    },
    bitbigger: {size: 1.16},
        // Sigma
    sigma: {damage: 30, health: 30, pen:30, speed: 0.9, range: 3, reload: 0.7, },

// Shiny menu
    worstTank: { reload: 15, damage: 0.01, health: 0.01, pen: 0.01 },
    bigBalls: { reload: 4, damage: 4, health: 2, speed: 0.85, maxSpeed: 0.85, size: 2.5 },
    bacteria: { reload: 2, recoil: 0.25, shudder: 0.1, size: 0.62, speed: 2},

// Others
auto: { reload: 0.9, recoil: 0.75, shudder: 0.5, size: 0.8, health: 0.9, damage: 0.6, pen: 1.2, speed: 1.1, range: 0.8, density: 1.3, resist: 1.25 },











    celeslower: { size: 0.5 },
    summoner: { reload: 0.3, size: 1.125, health: 0.4, damage: 0.345, pen: 0.4, density: 0.8 },
        spread1: {reload: 2.2, recoil: .4375, shudder: .125, size: 1, health: .65, damage: 1.7, pen: .95, speed: 1.05, maxSpeed: .75, range: 1, density: 1.5, spray: .25, resist: 1.15},
    spread2: { reload: 1, recoil: .1, shudder: .345, size: 1, health: .835, damage: .495, pen: 1.2, speed: .825, maxSpeed: .775, range: 1, density: .9, spray: .5, resist: .8},
    double_size: {size: 2},
    bit_smaller: {size: .84},
    very_fast_launch: {speed: 2.2},
    faster: {speed: 1.1, maxSpeed: 1.1,},
    noreload: {reload: 0.001},
        bitlessspeed: { speed: 0.93, maxSpeed: 0.93 },
        bit_less_damage: {health: .95, damage: .9},
        less_damage: {health: .9, damage: .85},
        less_health: {health: .9},
        less_pen: {pen: .9}

}


// ADDING SOME RARITIES OF ELITES BOSSES SUCH AS SHINY/LEGENDARY/SHADOW/RAINBOW/TRANS/EPILEPSY/ALBINO.

Class.trappergunBDN = {
    PARENT: ["autoTankGun"],
    GUNS: [
        {
            POSITION: [15, 8, 1, 0, 0, 0, 0],
        },
        {
            POSITION: [3, 8, 1.7, 15, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.trap, OGg.setTrap, { range: 0.5 }, { reload: 2 }]),
                TYPE: "trap",
                STAT_CALCULATOR: "trap",
            },
        },
    ]
}
Class.autoTankGunBDN = {
    PARENT: ["autoTankGun"],
    GUNS: [
        {
            POSITION: [18, 7, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.autoTurret, { reload: 0.9, damage: 1.1, health: 1.2, pen: 1.2 }]),
                TYPE: "bullet",
            },
        },
    ]
}
Class.bossGunBDN = {
    PARENT: ["autoTankGun"],
    GUNS:
        [
            {
                POSITION: [18, 7, 1, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([OGg.basic, OGg.twin, OGg.tripleShot]),
                    TYPE: "bullet",
                },
            },
        ]
}
Class.singleGunBDN = {
    PARENT: ["autoTankGun"],
    GUNS: [
        {
            POSITION: [18, 8, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.single, OGg.single, { reload: 0.9, damage: 1.3, health: 1.3, pen: 1.3 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [5.5, 8, -1.8, 6.5, 0, 0, 0],
        },
    ]
}
Class.bruiserGunBDN = {
    PARENT: ["autoTankGun"],
    GUNS: [
        {
            POSITION: [18, 12, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.pounder, OGg.single, OGg.single, { recoil: 0.1, reload: 0.8, damage: 1.6, health: 1.6, pen: 1.6 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [5.5, 12, -1.3, 6.5, 0, 0, 0],
        },
    ]
}
Class.ExtinctionistGunBDN = {
    PARENT: ["autoTankGun"],
    GUNS: [
        {
            POSITION: [20, 13, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.pounder, OGg.destroyer, OGg.single, OGg.single, { recoil: 0.1, reload: 1, damage: 4, health: 4, pen: 4 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [9, 13, -1.3, 6, 0, 0, 0],
        },
    ]
}
Class.DoomsayerGunBDN = {
    PARENT: ["autoTankGun"],
    GUNS: [
        {
            POSITION: [20.5, 19.5, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.pounder, OGg.destroyer, OGg.annihilator, OGg.single, OGg.single, OGg.single, { recoil: 0.1, reload: 1, damage: 20, health: 20, pen: 20 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [13.5, 19.5, -1, 3, 0, 0, 0],
        },
    ]
}

Class.megaDoomsayerGunBDN = {
    PARENT: ["autoTankGun"],
    GUNS: [
        {
            POSITION: [20.5, 20, 1.2, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.pounder, OGg.pounder, OGg.destroyer, OGg.annihilator, OGg.single, OGg.single, OGg.single, { recoil: 0.1, reload: 1, damage: 300, health: 300, pen: 300 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [13.5, 22, -0.95, 3, 0, 0, 0],
        },
    ]
}
Class.gigaDoomsayerGunBDN = {
    PARENT: ["autoTankGun"],
    GUNS: [
        {
            POSITION: [20.5, 21, 1.2, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.pounder, OGg.pounder, OGg.pounder, OGg.destroyer, OGg.annihilator, OGg.single, OGg.single, OGg.single, { recoil: 0.1, reload: 1, damage: 900, health: 900, pen: 900 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [13.5, 23, -0.95, 3, 0, 0, 0],
        },
    ]
}
Class.gunGunBDN = {
    PARENT: ["autoTankGun"],
    GUNS:
        [
            {
                POSITION: [8, 8, 1.4, 7, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([OGg.basic, OGg.machineGun]),
                    TYPE: "bullet",
                },
            },
        ]
}
Class.sprayerGunBDN = {
    PARENT: ["autoTankGun"],
    GUNS:
        [
            {
                POSITION: [21, 6.3, 1.4, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([OGg.basic, OGg.machineGun, OGg.lowPower, { reload: 0.9, damage: 1.3, health: 1.3, pen: 1.3, recoil: 0 }]),
                    TYPE: "bullet",
                },
            }, {
                POSITION: [10, 9, 1.4, 7, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([OGg.basic, OGg.machineGun, { reload: 0.9, damage: 1.3, health: 1.3, pen: 1.3, recoil: 0 }]),
                    TYPE: "bullet",
                },
            },
        ]
}
Class.superSprayerGunBDN = {
    PARENT: ["autoTankGun"],
    GUNS:
        [
            {
                POSITION: [25, 6, 1.4, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([OGg.basic, OGg.machineGun, OGg.lowPower, { reload: 1.1, damage: 1.3, health: 1.3, pen: 1.3, recoil: 0 }]),
                    TYPE: "bullet",
                },
            },
            {
                POSITION: [21, 7.5, 1.4, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([OGg.basic, OGg.machineGun, OGg.lowPower, { reload: 1.1, damage: 1.3, health: 1.3, pen: 1.3, recoil: 0 }]),
                    TYPE: "bullet",
                },
            }, {
                POSITION: [10, 9, 1.4, 7, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([OGg.basic, OGg.machineGun, { reload: 1.1, damage: 1.3, health: 1.3, pen: 1.3, recoil: 0 }]),
                    TYPE: "bullet",
                },
            },
        ]
}
Class.ssuperSprayerGunBDN = {
    PARENT: ["autoTankGun"],
    GUNS:
        [
            {
                POSITION: [25, 5.4, 1.4, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([OGg.basic, OGg.machineGun, OGg.lowPower, { reload: 0.95, damage: 1.7, health: 1.7, pen: 1.7, recoil: 0 }]),
                    TYPE: "bullet",
                },
            },
            {
                POSITION: [23, 6.6, 1.4, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([OGg.basic, OGg.machineGun, OGg.lowPower, { reload: 0.95, damage: 1.7, health: 1.7, pen: 1.7, recoil: 0 }]),
                    TYPE: "bullet",
                },
            },
            {
                POSITION: [20, 7.8, 1.4, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([OGg.basic, OGg.machineGun, OGg.lowPower, { reload: 0.95, damage: 1.7, health: 1.7, pen: 1.7, recoil: 0 }]),
                    TYPE: "bullet",
                },
            }, {
                POSITION: [10, 9, 1.4, 7, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([OGg.basic, OGg.machineGun, { reload: 0.95, damage: 1.7, health: 1.7, pen: 1.7, recoil: 0 }]),
                    TYPE: "bullet",
                },
            },
        ]
}

Class.hyperSprayerGunBDN = {
    PARENT: ["autoTankGun"],
    GUNS:
        [
            {
                POSITION: [27, 4.2, 1.4, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([OGg.basic, OGg.machineGun, OGg.lowPower, { reload: 1.25, damage: 3.3, health: 3.3, pen: 3.3, recoil: 0 }]),
                    TYPE: "bullet",
                },
            },
            {
                POSITION: [25, 5.4, 1.4, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([OGg.basic, OGg.machineGun, OGg.lowPower, { reload: 1.25, damage: 3.3, health: 3.3, pen: 3.3, recoil: 0 }]),
                    TYPE: "bullet",
                },
            },
            {
                POSITION: [23, 6.6, 1.4, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([OGg.basic, OGg.machineGun, OGg.lowPower, { reload: 1.25, damage: 3.3, health: 3.3, pen: 3.3, recoil: 0 }]),
                    TYPE: "bullet",
                },
            },
            {
                POSITION: [20, 7.8, 1.4, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([OGg.basic, OGg.machineGun, OGg.lowPower, { reload: 1.25, damage: 3.3, health: 3.3, pen: 3.3, recoil: 0 }]),
                    TYPE: "bullet",
                },
            }, {
                POSITION: [10, 9, 1.4, 7, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([OGg.basic, OGg.machineGun, { reload: 1.25, damage: 3.3, health: 3.3, pen: 3.3, recoil: 0 }]),
                    TYPE: "bullet",
                },
            },
        ]
}
Class.shyperSprayerGunBDN = {
    PARENT: ["autoTankGun"],
    GUNS:
        [
            {
                POSITION: [27, 4.2, 1.4, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([OGg.basic, OGg.machineGun, OGg.lowPower, { reload: 1.5, damage: 4.5, health: 4.5, pen: 4.5, recoil: 0 }]),
                    TYPE: "bullet",
                },
            },
            {
                POSITION: [25, 5.4, 1.4, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([OGg.basic, OGg.machineGun, OGg.lowPower, { reload: 1.5, damage: 4.5, health: 4.5, pen: 4.5, recoil: 0 }]),
                    TYPE: "bullet",
                },
            },
            {
                POSITION: [23, 6.6, 1.4, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([OGg.basic, OGg.machineGun, OGg.lowPower, { reload: 1.5, damage: 4.5, health: 4.5, pen: 4.5, recoil: 0 }]),
                    TYPE: "bullet",
                },
            },
            {
                POSITION: [20, 7.8, 1.4, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([OGg.basic, OGg.machineGun, OGg.lowPower, { reload: 1.5, damage: 4.5, health: 4.5, pen: 4.5, recoil: 0 }]),
                    TYPE: "bullet",
                },
            }, {
                POSITION: [10, 9, 1.4, 7, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([OGg.basic, OGg.machineGun, { reload: 1.5, damage: 4.5, health: 4.5, pen: 4.5, recoil: 0 }]),
                    TYPE: "bullet",
                },
            },
        ]
}
Class.sshyperSprayerGunBDN = {
    PARENT: ["autoTankGun"],
    GUNS:
        [
            {
                POSITION: [25, 18.3, 1.4, 0, 0, 0, 0.5],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([OGg.basic, OGg.machineGun, OGg.pounder, OGg.destroyer, OGg.lowPower, { reload: 1, damage: 54, health: 54, pen: 54, recoil: 0 }]),
                    TYPE: "bullet",
                },
            },
            {
                POSITION: [20, 19.5, 1.4, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([OGg.basic, OGg.machineGun, OGg.pounder, OGg.destroyer, OGg.lowPower, { reload: 1, damage: 54, health: 54, pen: 54, recoil: 0 }]),
                    TYPE: "bullet",
                },
            },
        ],
};
Class.sshyperSprayerGunBDNception = {
    PARENT: ["autoTankGun"],
    GUNS:
        [
            {
                POSITION: [25, 18.3, 1.4, 0, 0, 0, 0.5],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([OGg.basic, OGg.machineGun, OGg.pounder, OGg.destroyer, OGg.lowPower, { reload: 1, damage: 54, health: 54, pen: 54, recoil: 0, speed: 10 }]),
                    TYPE: "bullet",
                },
            },
            {
                POSITION: [20, 19.5, 1.4, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([OGg.basic, OGg.machineGun, OGg.pounder, OGg.destroyer, OGg.lowPower, { reload: 1, damage: 54, health: 54, pen: 54, recoil: 0, speed: 10 }]),
                    TYPE: "bullet",
                },
            },
        ],
};

Class.sshyperSprayerGunBDNwithceptions = {
    PARENT: ["sshyperSprayerGunBDNception"],
    TURRETS:
        [{
            POSITION: [5, 6, 4, 0, 360, 1],
            TYPE: "sshyperSprayerGunBDNception",
        },

        {
            POSITION: [5, 6, -4, 0, 360, 1],
            TYPE: "sshyperSprayerGunBDNception",
        },
        {
            POSITION: [5, 0, -8, 0, 360, 1],
            TYPE: "sshyperSprayerGunBDNception",
        },
        {
            POSITION: [5, 0, 8, 0, 360, 1],
            TYPE: "sshyperSprayerGunBDNception",
        },
        ],
};
Class.ssshyperSprayerGunBDN = {
    PARENT: ["autoTankGun"],
    GUNS:
        [
            {
                POSITION: [25, 18.8, 1.4, 0, 0, 0, 0.5],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([OGg.basic, OGg.machineGun, OGg.pounder, OGg.destroyer, OGg.lowPower, { reload: 1.1, damage: 162, health: 162, pen: 162, recoil: 0 }]),
                    TYPE: "bullet",
                },
            },
            {
                POSITION: [20, 20, 1.4, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([OGg.basic, OGg.machineGun, OGg.pounder, OGg.destroyer, OGg.lowPower, { reload: 1.1, damage: 162, health: 162, pen: 162, recoil: 0 }]),
                    TYPE: "bullet",
                },
            },
        ],
};



Class.ssshyperSprayerGunBDNception = {
    PARENT: ["autoTankGun"],
    GUNS:
        [
            {
                POSITION: [25, 18.8, 1.4, 0, 0, 0, 0.5],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([OGg.basic, OGg.machineGun, OGg.pounder, OGg.destroyer, OGg.lowPower, { reload: 1.1, damage: 162, health: 162, pen: 162, recoil: 0, speed: 10 }]),
                    TYPE: "bullet",
                },
            },
            {
                POSITION: [20, 20, 1.4, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([OGg.basic, OGg.machineGun, OGg.pounder, OGg.destroyer, OGg.lowPower, { reload: 1.1, damage: 162, health: 162, pen: 162, recoil: 0, speed: 10 }]),
                    TYPE: "bullet",
                },
            },
        ],
};
Class.ssshyperSprayerGunBDNwithceptions = {
    PARENT: ["ssshyperSprayerGunBDNception"],
    SIZE: 124,
    TURRETS:
        [{
            POSITION: [4, 0.5, 5.3, 0, 360, 1],
            TYPE: "ssshyperSprayerGunBDNception",
        },

        {
            POSITION: [4, 0.5, -5.3, 0, 360, 1],
            TYPE: "ssshyperSprayerGunBDNception",
        },
        {
            POSITION: [4, -2.7, -8, 0, 360, 1],
            TYPE: "ssshyperSprayerGunBDNception",
        },
        {
            POSITION: [4, -2.7, 8, 0, 360, 1],
            TYPE: "ssshyperSprayerGunBDNception",
        },
        {
            POSITION: [4, -2.7, 2.7, 0, 360, 1],
            TYPE: "ssshyperSprayerGunBDNception",
        },
        {
            POSITION: [4, -2.7, -2.7, 0, 360, 1],
            TYPE: "ssshyperSprayerGunBDNception",
        },
        {
            POSITION: [4, 0.5, 0, 0, 360, 1],
            TYPE: "ssshyperSprayerGunBDNception",
        },
        {
            POSITION: [4, 3.8, 2.65, 0, 360, 1],
            TYPE: "ssshyperSprayerGunBDNception",
        },
        {
            POSITION: [4, 3.8, -2.65, 0, 360, 1],
            TYPE: "ssshyperSprayerGunBDNception",
        },
        {
            POSITION: [4, 7, 0, 0, 360, 1],
            TYPE: "ssshyperSprayerGunBDNception",
        },
        ],
}
Class.ultraSprayerGunBDN = {
    PARENT: ["autoTankGun"],
    GUNS:
        [
            {
                POSITION: [25, 18.8, 1.4, 0, 0, 0, 0.5],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([OGg.basic, OGg.machineGun, OGg.pounder, OGg.destroyer, OGg.lowPower, { reload: 1.1, damage: 486, health: 486, pen: 486, recoil: 0 }]),
                    TYPE: "bullet",
                },
            },
            {
                POSITION: [20, 20, 1.4, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([OGg.basic, OGg.machineGun, OGg.pounder, OGg.destroyer, OGg.lowPower, { reload: 1.1, damage: 486, health: 486, pen: 486, recoil: 0 }]),
                    TYPE: "bullet",
                },
            },
            {
                POSITION: [15, 20, 1.4, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([OGg.basic, OGg.machineGun, OGg.pounder, OGg.destroyer, OGg.lowPower, { reload: 1.1, damage: 486, health: 486, pen: 486, recoil: 0 }]),
                    TYPE: "bullet",
                },
            },
        ],
};
Class.rimfireGunBDN = {
    PARENT: ["autoTankGun"],
    GUNS: [
        {
            POSITION: [19, 2, 1, 0, -2.5, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.pelleter, OGg.power, OGg.twin, { reload: 0.5, damage: 1.3, health: 1.3, pen: 1.3 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [19, 2, 1, 0, 2.5, 0, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.pelleter, OGg.power, OGg.twin, { reload: 0.5, damage: 1.3, health: 1.3, pen: 1.3 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [12, 11, 1, 0, 0, 0, 0],
        },
        {
            POSITION: [15, 4, 1, 0, -6.5, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, { shudder: 0.5, spread: 0.5 }, { reload: 0.5, damage: 1.3, health: 1.3, pen: 1.3 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [15, 4, 1, 0, 6.5, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, { shudder: 0.5, spread: 0.5 }, { reload: 0.5, damage: 1.3, health: 1.3, pen: 1.3 }]),
                TYPE: "bullet",
            },
        },
    ]
};
Class.pinnerGunBDN = {
    PARENT: ["autoTankGun"],
    GUNS: [
        {
            POSITION: [19, 2, 1, 0, -2.5, 0, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.pelleter, OGg.power, OGg.twin, OGg.nailgun, { reload: 0.45, damage: 1.6, health: 1.6, pen: 1.6 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [19, 2, 1, 0, 2.5, 0, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.pelleter, OGg.power, OGg.twin, OGg.nailgun, { reload: 0.45, damage: 1.6, health: 1.6, pen: 1.6 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [20, 2, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.pelleter, OGg.power, OGg.twin, OGg.nailgun, { reload: 0.45, damage: 1.6, health: 1.6, pen: 1.6 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [12, 11, 1, 0, 0, 0, 0],
        },
        {
            POSITION: [15, 4, 1, 0, -6.5, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, { shudder: 0.5, spread: 0.5 }, { reload: 0.45, damage: 1.6, health: 1.6, pen: 1.6 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [15, 4, 1, 0, 6.5, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, { shudder: 0.5, spread: 0.5 }, { reload: 0.45, damage: 1.6, health: 1.6, pen: 1.6 }]),
                TYPE: "bullet",
            },
        },
    ]
};
Class.brimmerGunBDN = {
    PARENT: ["autoTankGun"],
    GUNS: [
        {
            POSITION: [18, 2, 1, 0, -2.5, 0, 2 / 3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.pelleter, OGg.power, OGg.twin, OGg.nailgun, OGg.nailgun, { reload: 0.4, damage: 1.9, health: 1.9, pen: 1.9 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [18, 2, 1, 0, 2.5, 0, 2 / 3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.pelleter, OGg.power, OGg.twin, OGg.nailgun, OGg.nailgun, { reload: 0.4, damage: 1.9, health: 1.9, pen: 1.9 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [19, 2, 1, 0, -1.25, 0, 1 / 3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.pelleter, OGg.power, OGg.twin, OGg.nailgun, OGg.nailgun, { reload: 0.4, damage: 1.9, health: 1.9, pen: 1.9 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [19, 2, 1, 0, 1.25, 0, 1 / 3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.pelleter, OGg.power, OGg.twin, OGg.nailgun, OGg.nailgun, { reload: 0.4, damage: 1.9, health: 1.9, pen: 1.9 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [20, 2, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.pelleter, OGg.power, OGg.twin, OGg.nailgun, OGg.nailgun, { reload: 0.4, damage: 1.9, health: 1.9, pen: 1.9 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [12, 11, 1, 0, 0, 0, 0],
        },
        {
            POSITION: [15, 6, 1, 0, -7, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, { shudder: 0.5, spread: 0.5 }, { reload: 0.6, damage: 2.5, health: 2.5, pen: 2.5 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [15, 6, 1, 0, 7, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, { shudder: 0.5, spread: 0.5 }, { reload: 0.6, damage: 2.5, health: 2.5, pen: 2.5 }]),
                TYPE: "bullet",
            },
        },
    ]
};
Class.superbrimmerGunBDN = {
    PARENT: ["autoTankGun"],
    GUNS: [
        {
            POSITION: [18, 2, 1, 0, -2.5, 0, 2 / 3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.pelleter, OGg.power, OGg.twin, OGg.nailgun, OGg.nailgun, { size: 2, reload: 1, damage: 4, health: 4, pen: 4 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [18, 2, 1, 0, 2.5, 0, 2 / 3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.pelleter, OGg.power, OGg.twin, OGg.nailgun, OGg.nailgun, { size: 2, reload: 1, damage: 4, health: 4, pen: 4 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [19, 2, 1, 0, -1.25, 0, 1 / 3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.pelleter, OGg.power, OGg.twin, OGg.nailgun, OGg.nailgun, { size: 2, reload: 1, damage: 4, health: 4, pen: 4 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [19, 2, 1, 0, 1.25, 0, 1 / 3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.pelleter, OGg.power, OGg.twin, OGg.nailgun, OGg.nailgun, { size: 2, reload: 1, damage: 3.5, health: 3.5, pen: 3.5 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [20, 2, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.pelleter, OGg.power, OGg.twin, OGg.nailgun, OGg.nailgun, { size: 2, reload: 0.4, damage: 3.5, health: 3.5, pen: 3.5 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [12, 11, 1, 0, 0, 0, 0],
        },
        {
            POSITION: [15, 6, 1, 0, -7, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, { shudder: 0.5, spread: 0.5 }, { size: 2, reload: 1, damage: 5, health: 5, pen: 5 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [15, 6, 1, 0, 7, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, { shudder: 0.5, spread: 0.5 }, { size: 2, reload: 1, damage: 5, health: 5, pen: 5 }]),
                TYPE: "bullet",
            },
        },
    ]
};
Class.ssuperbrimmerGunBDN = {
    PARENT: ["autoTankGun"],
    GUNS: [
        {
            POSITION: [18, 2, 1, 0, -2.5, 0, 2 / 3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.pelleter, OGg.power, OGg.twin, OGg.nailgun, OGg.nailgun, { speed: 2, maxspeed: 2 }, { size: 2, reload: 1, damage: 8, health: 8, pen: 8 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [18, 2, 1, 0, 2.5, 0, 2 / 3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.pelleter, OGg.power, OGg.twin, OGg.nailgun, OGg.nailgun, { speed: 2, maxspeed: 2 }, { size: 2, reload: 1, damage: 8, health: 8, pen: 8 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [19, 2, 1, 0, -1.25, 0, 1 / 3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.pelleter, OGg.power, OGg.twin, OGg.nailgun, OGg.nailgun, { speed: 2, maxspeed: 2 }, { size: 2, reload: 1, damage: 8, health: 8, pen: 8 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [19, 2, 1, 0, 1.25, 0, 1 / 3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.pelleter, OGg.power, OGg.twin, OGg.nailgun, OGg.nailgun, { speed: 2, maxspeed: 2 }, { size: 2, reload: 1, damage: 8, health: 8, pen: 8 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [20, 2, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.pelleter, OGg.power, OGg.twin, OGg.nailgun, OGg.nailgun, { speed: 2, maxspeed: 2 }, { size: 2, reload: 1, damage: 8, health: 8, pen: 8 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [12, 11, 1, 0, 0, 0, 0],
        },
        {
            POSITION: [15, 6, 1, 0, -7, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, { shudder: 0.5, spread: 0.5 }, { speed: 2, maxspeed: 2 }, { size: 2, reload: 1, damage: 10, health: 10, pen: 10 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [15, 6, 1, 0, 7, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, { shudder: 0.5, spread: 0.5 }, { speed: 2, maxspeed: 2 }, { size: 2, reload: 1, damage: 10, health: 10, pen: 10 }]),
                TYPE: "bullet",
            },
        },
    ]
}
Class.hyperbrimmerGunBDN = {
    PARENT: ["autoTankGun"],
    GUNS: [
        {
            POSITION: [23, 2, 1, 0, -2.5, 0, 2 / 3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.pelleter, OGg.power, OGg.twin, OGg.nailgun, OGg.nailgun, { speed: 8, maxspeed: 8 }, { size: 1.5, reload: 20, damage: 50, health: 50, pen: 50 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [23, 2, 1, 0, 2.5, 0, 2 / 3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.pelleter, OGg.power, OGg.twin, OGg.nailgun, OGg.nailgun, { speed: 8, maxspeed: 8 }, { size: 1.5, reload: 20, damage: 50, health: 50, pen: 50 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [24, 2, 1, 0, -1.25, 0, 1 / 3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.pelleter, OGg.power, OGg.twin, OGg.nailgun, OGg.nailgun, { speed: 8, maxspeed: 8 }, { size: 1.5, reload: 20, damage: 50, health: 50, pen: 50 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [24, 2, 1, 0, 1.25, 0, 1 / 3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.pelleter, OGg.power, OGg.twin, OGg.nailgun, OGg.nailgun, { speed: 8, maxspeed: 8 }, { size: 1.5, reload: 20, damage: 50, health: 50, pen: 50 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [25, 2, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.pelleter, OGg.power, OGg.twin, OGg.nailgun, OGg.nailgun, { speed: 8, maxspeed: 8 }, { size: 1.5, reload: 20, damage: 50, health: 50, pen: 50 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [12, 11, 1, 0, 0, 0, 0],
        },








        {
            POSITION: [15, 8, 1, 0, -5, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, { shudder: 0.5, spread: 0.5 }, { speed: 2, maxspeed: 2 }, { size: 1.5, reload: 1, damage: 30, health: 30, pen: 30 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [15, 8, 1, 0, 5, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, { shudder: 0.5, spread: 0.5 }, { speed: 2, maxspeed: 2 }, { size: 1.5, reload: 1, damage: 30, health: 30, pen: 30 }]),
                TYPE: "bullet",
            },
        },
    ]
};







Class.shyperbrimmerGunBDN = {
    PARENT: ["autoTankGun"],
    GUNS: [
        {
            POSITION: [23, 2, 1, 0, -2.5, 22.5, 2 / 3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.pelleter, OGg.power, OGg.twin, OGg.nailgun, OGg.nailgun, { speed: 8, maxspeed: 8 }, { size: 1.5, reload: 20, damage: 100, health: 100, pen: 100 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [23, 2, 1, 0, 2.5, 22.5, 2 / 3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.pelleter, OGg.power, OGg.twin, OGg.nailgun, OGg.nailgun, { speed: 8, maxspeed: 8 }, { size: 1.5, reload: 20, damage: 100, health: 100, pen: 100 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [24, 2, 1, 0, -1.25, 22.5, 1 / 3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.pelleter, OGg.power, OGg.twin, OGg.nailgun, OGg.nailgun, { speed: 8, maxspeed: 8 }, { size: 1.5, reload: 20, damage: 100, health: 100, pen: 100 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [24, 2, 1, 0, 1.25, 22.5, 1 / 3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.pelleter, OGg.power, OGg.twin, OGg.nailgun, OGg.nailgun, { speed: 8, maxspeed: 8 }, { size: 1.5, reload: 20, damage: 100, health: 100, pen: 100 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [25, 2, 1, 0, 0, 22.5, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.pelleter, OGg.power, OGg.twin, OGg.nailgun, OGg.nailgun, { speed: 8, maxspeed: 8 }, { size: 1.5, reload: 20, damage: 100, health: 100, pen: 100 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [12, 11, 1, 0, 0, 22.5, 0],
        },

        {
            POSITION: [23, 2, 1, 0, -2.5, -22.5, 2 / 3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.pelleter, OGg.power, OGg.twin, OGg.nailgun, OGg.nailgun, { speed: 8, maxspeed: 8 }, { size: 1.5, reload: 20, damage: 100, health: 100, pen: 100 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [23, 2, 1, 0, 2.5, -22.5, 2 / 3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.pelleter, OGg.power, OGg.twin, OGg.nailgun, OGg.nailgun, { speed: 8, maxspeed: 8 }, { size: 1.5, reload: 20, damage: 100, health: 100, pen: 100 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [24, 2, 1, 0, -1.25, -22.5, 1 / 3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.pelleter, OGg.power, OGg.twin, OGg.nailgun, OGg.nailgun, { speed: 8, maxspeed: 8 }, { size: 1.5, reload: 20, damage: 100, health: 100, pen: 100 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [24, 2, 1, 0, 1.25, -22.5, 1 / 3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.pelleter, OGg.power, OGg.twin, OGg.nailgun, OGg.nailgun, { speed: 8, maxspeed: 8 }, { size: 1.5, reload: 20, damage: 100, health: 100, pen: 100 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [25, 2, 1, 0, 0, -22.5, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.pelleter, OGg.power, OGg.twin, OGg.nailgun, OGg.nailgun, { speed: 8, maxspeed: 8 }, { size: 1.5, reload: 20, damage: 100, health: 100, pen: 100 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [12, 11, 1, 0, 0, -22.5, 0],
        },

        {
            POSITION: [23, 2, 1, 0, -2.5, 0, 2 / 3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.pelleter, OGg.power, OGg.twin, OGg.nailgun, OGg.nailgun, { speed: 8, maxspeed: 8 }, { size: 1.5, reload: 20, damage: 100, health: 100, pen: 100 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [23, 2, 1, 0, 2.5, 0, 2 / 3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.pelleter, OGg.power, OGg.twin, OGg.nailgun, OGg.nailgun, { speed: 8, maxspeed: 8 }, { size: 1.5, reload: 20, damage: 100, health: 100, pen: 100 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [24, 2, 1, 0, -1.25, 0, 1 / 3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.pelleter, OGg.power, OGg.twin, OGg.nailgun, OGg.nailgun, { speed: 8, maxspeed: 8 }, { size: 1.5, reload: 20, damage: 100, health: 100, pen: 100 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [24, 2, 1, 0, 1.25, 0, 1 / 3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.pelleter, OGg.power, OGg.twin, OGg.nailgun, OGg.nailgun, { speed: 8, maxspeed: 8 }, { size: 1.5, reload: 20, damage: 100, health: 100, pen: 100 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [25, 2, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.pelleter, OGg.power, OGg.twin, OGg.nailgun, OGg.nailgun, { speed: 8, maxspeed: 8 }, { size: 1.5, reload: 20, damage: 100, health: 100, pen: 100 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [12, 11, 1, 0, 0, 0, 0],
        },



        {
            POSITION: [23, 2, 1, 0, -2.5, 0, 2 / 3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.pelleter, OGg.power, OGg.twin, OGg.nailgun, OGg.nailgun, { speed: 8, maxspeed: 8 }, { size: 1.5, reload: 20, damage: 100, health: 100, pen: 100 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [23, 2, 1, 0, 2.5, 0, 2 / 3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.pelleter, OGg.power, OGg.twin, OGg.nailgun, OGg.nailgun, { speed: 8, maxspeed: 8 }, { size: 1.5, reload: 20, damage: 100, health: 100, pen: 100 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [24, 2, 1, 0, -1.25, 0, 1 / 3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.pelleter, OGg.power, OGg.twin, OGg.nailgun, OGg.nailgun, { speed: 8, maxspeed: 8 }, { size: 1.5, reload: 20, damage: 100, health: 100, pen: 100 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [24, 2, 1, 0, 1.25, 0, 1 / 3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.pelleter, OGg.power, OGg.twin, OGg.nailgun, OGg.nailgun, { speed: 8, maxspeed: 8 }, { size: 1.5, reload: 20, damage: 100, health: 100, pen: 100 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [25, 2, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.pelleter, OGg.power, OGg.twin, OGg.nailgun, OGg.nailgun, { speed: 8, maxspeed: 8 }, { size: 1.5, reload: 20, damage: 100, health: 100, pen: 100 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [12, 11, 1, 0, 0, 0, 0],
        },



        {
            POSITION: [15, 8, 1, 0, -5, -22.5, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, { shudder: 0.5, spread: 0.5 }, { speed: 2, maxspeed: 2 }, { size: 1.5, reload: 1, damage: 60, health: 60, pen: 60 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [15, 8, 1, 0, 5, 22.5, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, { shudder: 0.5, spread: 0.5 }, { speed: 2, maxspeed: 2 }, { size: 1.5, reload: 1, damage: 60, health: 60, pen: 60 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [15, 8, 1, 0, -5, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, { shudder: 0.5, spread: 0.5 }, { speed: 2, maxspeed: 2 }, { size: 1.5, reload: 1, damage: 60, health: 60, pen: 60 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [15, 8, 1, 0, 5, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, { shudder: 0.5, spread: 0.5 }, { speed: 2, maxspeed: 2 }, { size: 1.5, reload: 1, damage: 60, health: 60, pen: 60 }]),
                TYPE: "bullet",
            },
        },

    ]
};
Class.sprayerTripleTurretBDN = {
    PARENT: ["genericTank"],
    LABEL: "Sprayer",
    BODY: { FOV: 2 },
    CONTROLLERS: [["spin", { speed: 0.04 }]],
    INDEPENDENT: true,
    COLOR: -1,
    GUNS: [
        {
            POSITION: [16, 9, 1, 8, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.machineGun, OGg.lowPower, OGg.flankGuard, { reload: 0.9, damage: 1.3, health: 1.3, pen: 1.3 }]),
                TYPE: "bullet",
                AUTOFIRE: true,
            },
        }, {
            POSITION: [16, 9, 1, 8, 0, 120, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.machineGun, OGg.lowPower, OGg.flankGuard, { reload: 0.9, damage: 1.3, health: 1.3, pen: 1.3 }]),
                TYPE: "bullet",
                AUTOFIRE: true,
            },
        }, {
            POSITION: [16, 9, 1, 8, 0, 240, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.machineGun, OGg.lowPower, OGg.flankGuard, { reload: 0.9, damage: 1.3, health: 1.3, pen: 1.3 }]),
                TYPE: "bullet",
                AUTOFIRE: true,
            },
        },
        {
            POSITION: [12, 10, 1.4, 8, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.machineGun, OGg.flankGuard, { reload: 0.9, damage: 1.3, health: 1.3, pen: 1.3 }]),
                TYPE: "bullet",
                AUTOFIRE: true,
            },
        }, {
            POSITION: [12, 10, 1.4, 8, 0, 120, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.machineGun, OGg.flankGuard, { reload: 0.9, damage: 1.3, health: 1.3, pen: 1.3 }]),
                TYPE: "bullet",
                AUTOFIRE: true,
            },
        }, {
            POSITION: [12, 10, 1.4, 8, 0, 240, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.machineGun, OGg.flankGuard, { reload: 0.9, damage: 1.3, health: 1.3, pen: 1.3 }]),
                TYPE: "bullet",
                AUTOFIRE: true,
            },
        },
    ],
};
Class.sprayerHexaTurretBDN = {
    PARENT: ["genericTank"],
    LABEL: "Sprayer",
    BODY: { FOV: 2 },
    CONTROLLERS: [["spin", { speed: 0.04 }]],
    INDEPENDENT: true,
    COLOR: -1,
    GUNS: [
        {
            POSITION: [16, 9, 1, 8, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.machineGun, OGg.lowPower, OGg.flankGuard, { reload: 1, damage: 1.6, health: 1.6, pen: 1.6 }]),
                TYPE: "bullet",
                AUTOFIRE: true,
            },
        }, {
            POSITION: [16, 9, 1, 8, 0, 120, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.machineGun, OGg.lowPower, OGg.flankGuard, { reload: 1, damage: 1.6, health: 1.6, pen: 1.6 }]),
                TYPE: "bullet",
                AUTOFIRE: true,
            },
        }, {
            POSITION: [16, 9, 1, 8, 0, 240, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.machineGun, OGg.lowPower, OGg.flankGuard, { reload: 1, damage: 1.6, health: 1.6, pen: 1.6 }]),
                TYPE: "bullet",
                AUTOFIRE: true,
            },
        },
        {
            POSITION: [12, 10, 1.4, 8, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.machineGun, OGg.flankGuard, { reload: 1, damage: 1.6, health: 1.6, pen: 1.6 }]),
                TYPE: "bullet",
                AUTOFIRE: true,
            },
        }, {
            POSITION: [12, 10, 1.4, 8, 0, 120, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.machineGun, OGg.flankGuard, { reload: 1, damage: 1.6, health: 1.6, pen: 1.6 }]),
                TYPE: "bullet",
                AUTOFIRE: true,
            },
        }, {
            POSITION: [12, 10, 1.4, 8, 0, 240, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.machineGun, OGg.flankGuard, { reload: 1, damage: 1.6, health: 1.6, pen: 1.6 }]),
                TYPE: "bullet",
                AUTOFIRE: true,
            },
        },
        {
            POSITION: [16, 9, 1, 8, 0, 0 + 60, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.machineGun, OGg.lowPower, OGg.flankGuard, { reload: 1, damage: 1.6, health: 1.6, pen: 1.6 }]),
                TYPE: "bullet",
                AUTOFIRE: true,
            },
        }, {
            POSITION: [16, 9, 1, 8, 0, 120 + 60, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.machineGun, OGg.lowPower, OGg.flankGuard, { reload: 1, damage: 1.6, health: 1.6, pen: 1.6 }]),
                TYPE: "bullet",
                AUTOFIRE: true,
            },
        }, {
            POSITION: [16, 9, 1, 8, 0, 240 + 60, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.machineGun, OGg.lowPower, OGg.flankGuard, { reload: 1, damage: 1.6, health: 1.6, pen: 1.6 }]),
                TYPE: "bullet",
                AUTOFIRE: true,
            },
        },
        {
            POSITION: [12, 10, 1.4, 8, 0, 0 + 60, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.machineGun, OGg.flankGuard, { reload: 1, damage: 1.6, health: 1.6, pen: 1.6 }]),
                TYPE: "bullet",
                AUTOFIRE: true,
            },
        }, {
            POSITION: [12, 10, 1.4, 8, 0, 120 + 60, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.machineGun, OGg.flankGuard, { reload: 1, damage: 1.6, health: 1.6, pen: 1.6 }]),
                TYPE: "bullet",
                AUTOFIRE: true,
            },
        }, {
            POSITION: [12, 10, 1.4, 8, 0, 240 + 60, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.machineGun, OGg.flankGuard, { reload: 1, damage: 1.6, health: 1.6, pen: 1.6 }]),
                TYPE: "bullet",
                AUTOFIRE: true,
            },
        },
    ],
};

Class.sprayerDodecaTurretBDN = {
    PARENT: ["genericTank"],
    LABEL: "Sprayer",
    BODY: { FOV: 2 },
    CONTROLLERS: [["spin", { speed: 0.04 }]],
    INDEPENDENT: true,
    COLOR: -1,
    GUNS: [
        {
            POSITION: [16, 9, 1, 8, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.machineGun, OGg.lowPower, OGg.flankGuard, { reload: 1.1, damage: 1.9, health: 1.9, pen: 1.9 }]),
                TYPE: "bullet",
                AUTOFIRE: true,
            },
        }, {
            POSITION: [16, 9, 1, 8, 0, 90, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.machineGun, OGg.lowPower, OGg.flankGuard, { reload: 1.1, damage: 1.9, health: 1.9, pen: 1.9 }]),
                TYPE: "bullet",
                AUTOFIRE: true,
            },
        }, {
            POSITION: [16, 9, 1, 8, 0, 180, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.machineGun, OGg.lowPower, OGg.flankGuard, { reload: 1.1, damage: 1.9, health: 1.9, pen: 1.9 }]),
                TYPE: "bullet",
                AUTOFIRE: true,
            },
        }, {
            POSITION: [16, 9, 1, 8, 0, 270, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.machineGun, OGg.lowPower, OGg.flankGuard, { reload: 1.1, damage: 1.9, health: 1.9, pen: 1.9 }]),
                TYPE: "bullet",
                AUTOFIRE: true,
            },
        },
        {
            POSITION: [12, 10, 1.4, 8, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.machineGun, OGg.flankGuard, { reload: 1.1, damage: 1.9, health: 1.9, pen: 1.9 }]),
                TYPE: "bullet",
                AUTOFIRE: true,
            },
        }, {
            POSITION: [12, 10, 1.4, 8, 0, 90, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.machineGun, OGg.flankGuard, { reload: 1.1, damage: 1.9, health: 1.9, pen: 1.9 }]),
                TYPE: "bullet",
                AUTOFIRE: true,
            },
        }, {
            POSITION: [12, 10, 1.4, 8, 0, 180, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.machineGun, OGg.flankGuard, { reload: 1.1, damage: 1.9, health: 1.9, pen: 1.9 }]),
                TYPE: "bullet",
                AUTOFIRE: true,
            },
        }, {
            POSITION: [12, 10, 1.4, 8, 0, 270, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.machineGun, OGg.flankGuard, { reload: 1.1, damage: 1.9, health: 1.9, pen: 1.9 }]),
                TYPE: "bullet",
                AUTOFIRE: true,
            },
        },
        {
            POSITION: [16, 9, 1, 8, 0, 0 + 45, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.machineGun, OGg.lowPower, OGg.flankGuard, { reload: 1.1, damage: 1.9, health: 1.9, pen: 1.9 }]),
                TYPE: "bullet",
                AUTOFIRE: true,
            },
        }, {
            POSITION: [16, 9, 1, 8, 0, 90 + 45, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.machineGun, OGg.lowPower, OGg.flankGuard, { reload: 1.1, damage: 1.9, health: 1.9, pen: 1.9 }]),
                TYPE: "bullet",
                AUTOFIRE: true,
            },
        }, {
            POSITION: [16, 9, 1, 8, 0, 180 + 45, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.machineGun, OGg.lowPower, OGg.flankGuard, { reload: 1.1, damage: 1.9, health: 1.9, pen: 1.9 }]),
                TYPE: "bullet",
                AUTOFIRE: true,
            },
        }, {
            POSITION: [16, 9, 1, 8, 0, 270 + 45, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.machineGun, OGg.lowPower, OGg.flankGuard, { reload: 1.1, damage: 1.9, health: 1.9, pen: 1.9 }]),
                TYPE: "bullet",
                AUTOFIRE: true,
            },
        },
        {
            POSITION: [12, 10, 1.4, 8, 0, 0 + 45, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.machineGun, OGg.flankGuard, { reload: 1.1, damage: 1.9, health: 1.9, pen: 1.9 }]),
                TYPE: "bullet",
                AUTOFIRE: true,
            },
        }, {
            POSITION: [12, 10, 1.4, 8, 0, 90 + 45, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.machineGun, OGg.flankGuard, { reload: 1.1, damage: 1.9, health: 1.9, pen: 1.9 }]),
                TYPE: "bullet",
                AUTOFIRE: true,
            },
        }, {
            POSITION: [12, 10, 1.4, 8, 0, 180 + 45, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.machineGun, OGg.flankGuard, { reload: 1.1, damage: 1.9, health: 1.9, pen: 1.9 }]),
                TYPE: "bullet",
                AUTOFIRE: true,
            },
        }, {
            POSITION: [12, 10, 1.4, 8, 0, 270 + 45, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.machineGun, OGg.flankGuard, { reload: 1.1, damage: 1.9, health: 1.9, pen: 1.9 }]),
                TYPE: "bullet",
                AUTOFIRE: true,
            },
        },
    ],
};

Class.supersprayerDodecagrammataTurretBDN = {
    PARENT: ["genericTank"],
    LABEL: "Sprayer",
    BODY: { FOV: 2 },
    CONTROLLERS: [["spin", { speed: 0.04 }]],
    INDEPENDENT: true,
    COLOR: -1,
    GUNS: [
        {
            POSITION: [16, 9, 1, 8, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.machineGun, OGg.lowPower, OGg.flankGuard, { reload: 2, damage: 5, health: 5, pen: 5 }]),
                TYPE: "bullet",
                AUTOFIRE: true,
            },
        }, {
            POSITION: [16, 9, 1, 8, 0, 90, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.machineGun, OGg.lowPower, OGg.flankGuard, { reload: 2, damage: 5, health: 5, pen: 5 }]),
                TYPE: "bullet",
                AUTOFIRE: true,
            },
        }, {
            POSITION: [16, 9, 1, 8, 0, 180, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.machineGun, OGg.lowPower, OGg.flankGuard, { reload: 2, damage: 5, health: 5, pen: 5 }]),
                TYPE: "bullet",
                AUTOFIRE: true,
            },
        }, {
            POSITION: [16, 9, 1, 8, 0, 270, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.machineGun, OGg.lowPower, OGg.flankGuard, { reload: 2, damage: 5, health: 5, pen: 5 }]),
                TYPE: "bullet",
                AUTOFIRE: true,
            },
        },
        {
            POSITION: [12, 10, 1.4, 8, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.machineGun, OGg.flankGuard, { reload: 2, damage: 5, health: 5, pen: 5 }]),
                TYPE: "bullet",
                AUTOFIRE: true,
            },
        }, {
            POSITION: [12, 10, 1.4, 8, 0, 90, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.machineGun, OGg.flankGuard, { reload: 2, damage: 5, health: 5, pen: 5 }]),
                TYPE: "bullet",
                AUTOFIRE: true,
            },
        }, {
            POSITION: [12, 10, 1.4, 8, 0, 180, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.machineGun, OGg.flankGuard, { reload: 2, damage: 5, health: 5, pen: 5 }]),
                TYPE: "bullet",
                AUTOFIRE: true,
            },
        }, {
            POSITION: [12, 10, 1.4, 8, 0, 270, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.machineGun, OGg.flankGuard, { reload: 2, damage: 5, health: 5, pen: 5 }]),
                TYPE: "bullet",
                AUTOFIRE: true,
            },
        },
        {
            POSITION: [16, 9, 1, 8, 0, 0 + 45, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.machineGun, OGg.lowPower, OGg.flankGuard, { reload: 2, damage: 5, health: 5, pen: 5 }]),
                TYPE: "bullet",
                AUTOFIRE: true,
            },
        }, {
            POSITION: [16, 9, 1, 8, 0, 90 + 45, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.machineGun, OGg.lowPower, OGg.flankGuard, { reload: 2, damage: 5, health: 5, pen: 5 }]),
                TYPE: "bullet",
                AUTOFIRE: true,
            },
        }, {
            POSITION: [16, 9, 1, 8, 0, 180 + 45, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.machineGun, OGg.lowPower, OGg.flankGuard, { reload: 2, damage: 5, health: 5, pen: 5 }]),
                TYPE: "bullet",
                AUTOFIRE: true,
            },
        }, {
            POSITION: [16, 9, 1, 8, 0, 270 + 45, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.machineGun, OGg.lowPower, OGg.flankGuard, { reload: 2, damage: 5, health: 5, pen: 5 }]),
                TYPE: "bullet",
                AUTOFIRE: true,
            },
        },
        {
            POSITION: [12, 10, 1.4, 8, 0, 0 + 45, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.machineGun, OGg.flankGuard, { reload: 2, damage: 5, health: 5, pen: 5 }]),
                TYPE: "bullet",
                AUTOFIRE: true,
            },
        }, {
            POSITION: [12, 10, 1.4, 8, 0, 90 + 45, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.machineGun, OGg.flankGuard, { reload: 2, damage: 5, health: 5, pen: 5 }]),
                TYPE: "bullet",
                AUTOFIRE: true,
            },
        }, {
            POSITION: [12, 10, 1.4, 8, 0, 180 + 45, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.machineGun, OGg.flankGuard, { reload: 2, damage: 5, health: 5, pen: 5 }]),
                TYPE: "bullet",
                AUTOFIRE: true,
            },
        }, {
            POSITION: [12, 10, 1.4, 8, 0, 270 + 45, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.machineGun, OGg.flankGuard, { reload: 2, damage: 5, health: 5, pen: 5 }]),
                TYPE: "bullet",
                AUTOFIRE: true,
            },
        },
    ],
};
Class.ssupersprayerDodecagrammataTurretBDN = {
    PARENT: ["genericTank"],
    LABEL: "Sprayer",
    BODY: { FOV: 2 },
    CONTROLLERS: [["spin", { speed: 0.04 }]],
    INDEPENDENT: true,
    COLOR: -1,
    GUNS: [
        {
            POSITION: [20, 8, 0.6, 8, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.machineGun, OGg.lowPower, OGg.flankGuard, { reload: 1.8, damage: 10, health: 10, pen: 10 }]),
                TYPE: "bullet",
                AUTOFIRE: true,
            },
        }, {
            POSITION: [20, 8, 0.6, 8, 0, 90, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.machineGun, OGg.lowPower, OGg.flankGuard, { reload: 1.8, damage: 10, health: 10, pen: 10 }]),
                TYPE: "bullet",
                AUTOFIRE: true,
            },
        }, {
            POSITION: [20, 8, 0.6, 8, 0, 180, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.machineGun, OGg.lowPower, OGg.flankGuard, { reload: 1.8, damage: 10, health: 10, pen: 10 }]),
                TYPE: "bullet",
                AUTOFIRE: true,
            },
        }, {
            POSITION: [20, 8, 0.6, 8, 0, 270, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.machineGun, OGg.lowPower, OGg.flankGuard, { reload: 1.8, damage: 10, health: 10, pen: 10 }]),
                TYPE: "bullet",
                AUTOFIRE: true,
            },
        },
        {
            POSITION: [16, 9, 1, 8, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.machineGun, OGg.lowPower, OGg.flankGuard, { reload: 1.8, damage: 10, health: 10, pen: 10 }]),
                TYPE: "bullet",
                AUTOFIRE: true,
            },
        }, {
            POSITION: [16, 9, 1, 8, 0, 90, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.machineGun, OGg.lowPower, OGg.flankGuard, { reload: 1.8, damage: 10, health: 10, pen: 10 }]),
                TYPE: "bullet",
                AUTOFIRE: true,
            },
        }, {
            POSITION: [16, 9, 1, 8, 0, 180, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.machineGun, OGg.lowPower, OGg.flankGuard, { reload: 1.8, damage: 10, health: 10, pen: 10 }]),
                TYPE: "bullet",
                AUTOFIRE: true,
            },
        }, {
            POSITION: [16, 9, 1, 8, 0, 270, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.machineGun, OGg.lowPower, OGg.flankGuard, { reload: 1.8, damage: 10, health: 10, pen: 10 }]),
                TYPE: "bullet",
                AUTOFIRE: true,
            },
        },
        {
            POSITION: [12, 10, 1.4, 8, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.machineGun, OGg.flankGuard, { reload: 1.8, damage: 10, health: 10, pen: 10 }]),
                TYPE: "bullet",
                AUTOFIRE: true,
            },
        }, {
            POSITION: [12, 10, 1.4, 8, 0, 90, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.machineGun, OGg.flankGuard, { reload: 1.8, damage: 10, health: 10, pen: 10 }]),
                TYPE: "bullet",
                AUTOFIRE: true,
            },
        }, {
            POSITION: [12, 10, 1.4, 8, 0, 180, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.machineGun, OGg.flankGuard, { reload: 1.8, damage: 10, health: 10, pen: 10 }]),
                TYPE: "bullet",
                AUTOFIRE: true,
            },
        }, {
            POSITION: [12, 10, 1.4, 8, 0, 270, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.machineGun, OGg.flankGuard, { reload: 1.8, damage: 10, health: 10, pen: 10 }]),
                TYPE: "bullet",
                AUTOFIRE: true,
            },
        },
        {
            POSITION: [20, 8, 0.6, 8, 0, 0 + 45, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.machineGun, OGg.lowPower, OGg.flankGuard, { reload: 1.8, damage: 10, health: 10, pen: 10 }]),
                TYPE: "bullet",
                AUTOFIRE: true,
            },
        }, {
            POSITION: [20, 8, 0.6, 8, 0, 90 + 45, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.machineGun, OGg.lowPower, OGg.flankGuard, { reload: 1.8, damage: 10, health: 10, pen: 10 }]),
                TYPE: "bullet",
                AUTOFIRE: true,
            },
        }, {
            POSITION: [20, 8, 0.6, 8, 0, 180 + 45, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.machineGun, OGg.lowPower, OGg.flankGuard, { reload: 1.8, damage: 10, health: 10, pen: 10 }]),
                TYPE: "bullet",
                AUTOFIRE: true,
            },
        }, {
            POSITION: [20, 8, 0.6, 8, 0, 270 + 45, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.machineGun, OGg.lowPower, OGg.flankGuard, { reload: 1.8, damage: 10, health: 10, pen: 10 }]),
                TYPE: "bullet",
                AUTOFIRE: true,
            },
        },
        {
            POSITION: [16, 9, 1, 8, 0, 0 + 45, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.machineGun, OGg.lowPower, OGg.flankGuard, { reload: 1.8, damage: 10, health: 10, pen: 10 }]),
                TYPE: "bullet",
                AUTOFIRE: true,
            },
        }, {
            POSITION: [16, 9, 1, 8, 0, 90 + 45, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.machineGun, OGg.lowPower, OGg.flankGuard, { reload: 1.8, damage: 10, health: 10, pen: 10 }]),
                TYPE: "bullet",
                AUTOFIRE: true,
            },
        }, {
            POSITION: [16, 9, 1, 8, 0, 180 + 45, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.machineGun, OGg.lowPower, OGg.flankGuard, { reload: 1.8, damage: 10, health: 10, pen: 10 }]),
                TYPE: "bullet",
                AUTOFIRE: true,
            },
        }, {
            POSITION: [16, 9, 1, 8, 0, 270 + 45, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.machineGun, OGg.lowPower, OGg.flankGuard, { reload: 1.8, damage: 10, health: 10, pen: 10 }]),
                TYPE: "bullet",
                AUTOFIRE: true,
            },
        },
        {
            POSITION: [12, 10, 1.4, 8, 0, 0 + 45, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.machineGun, OGg.flankGuard, { reload: 1.8, damage: 10, health: 10, pen: 10 }]),
                TYPE: "bullet",
                AUTOFIRE: true,
            },
        }, {
            POSITION: [12, 10, 1.4, 8, 0, 90 + 45, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.machineGun, OGg.flankGuard, { reload: 1.8, damage: 10, health: 10, pen: 10 }]),
                TYPE: "bullet",
                AUTOFIRE: true,
            },
        }, {
            POSITION: [12, 10, 1.4, 8, 0, 180 + 45, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.machineGun, OGg.flankGuard, { reload: 1.8, damage: 10, health: 10, pen: 10 }]),
                TYPE: "bullet",
                AUTOFIRE: true,
            },
        }, {
            POSITION: [12, 10, 1.4, 8, 0, 270 + 45, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.machineGun, OGg.flankGuard, { reload: 1.8, damage: 10, health: 10, pen: 10 }]),
                TYPE: "bullet",
                AUTOFIRE: true,
            },
        },



    ],
};



Class.sssupersprayerDodecagrammataTurretBDN = {
    PARENT: ["genericTank"],
    LABEL: "Sprayer",
    BODY: { FOV: 2 },
    CONTROLLERS: [["spin", { speed: 0.04 }]],
    INDEPENDENT: true,
    COLOR: -1,
    GUNS: [
        {
            POSITION: [20, 11, 0.6, 8, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.machineGun, OGg.lowPower, OGg.flankGuard, { reload: 4, damage: 100, health: 100, pen: 100 }]),
                TYPE: "bullet",
                AUTOFIRE: true,
            },
        }, {
            POSITION: [20, 11, 0.6, 8, 0, 90, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.machineGun, OGg.lowPower, OGg.flankGuard, { reload: 4, damage: 100, health: 100, pen: 100 }]),
                TYPE: "bullet",
                AUTOFIRE: true,
            },
        }, {
            POSITION: [20, 11, 0.6, 8, 0, 180, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.machineGun, OGg.lowPower, OGg.flankGuard, { reload: 4, damage: 100, health: 100, pen: 100 }]),
                TYPE: "bullet",
                AUTOFIRE: true,
            },
        }, {
            POSITION: [20, 11, 0.6, 8, 0, 270, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.machineGun, OGg.lowPower, OGg.flankGuard, { reload: 4, damage: 100, health: 100, pen: 100 }]),
                TYPE: "bullet",
                AUTOFIRE: true,
            },
        },
        {
            POSITION: [16, 12, 1, 8, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.machineGun, OGg.lowPower, OGg.flankGuard, { reload: 4, damage: 100, health: 100, pen: 100 }]),
                TYPE: "bullet",
                AUTOFIRE: true,
            },
        }, {
            POSITION: [16, 12, 1, 8, 0, 90, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.machineGun, OGg.lowPower, OGg.flankGuard, { reload: 4, damage: 100, health: 100, pen: 100 }]),
                TYPE: "bullet",
                AUTOFIRE: true,
            },
        }, {
            POSITION: [16, 12, 1, 8, 0, 180, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.machineGun, OGg.lowPower, OGg.flankGuard, { reload: 4, damage: 100, health: 100, pen: 100 }]),
                TYPE: "bullet",
                AUTOFIRE: true,
            },
        }, {
            POSITION: [16, 12, 1, 8, 0, 270, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.machineGun, OGg.lowPower, OGg.flankGuard, { reload: 4, damage: 100, health: 100, pen: 100 }]),
                TYPE: "bullet",
                AUTOFIRE: true,
            },
        },
        {
            POSITION: [12, 13, 1.4, 8, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.machineGun, OGg.flankGuard, { reload: 4, damage: 100, health: 100, pen: 100 }]),
                TYPE: "bullet",
                AUTOFIRE: true,
            },
        }, {
            POSITION: [12, 13, 1.4, 8, 0, 90, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.machineGun, OGg.flankGuard, { reload: 4, damage: 100, health: 100, pen: 100 }]),
                TYPE: "bullet",
                AUTOFIRE: true,
            },
        }, {
            POSITION: [12, 13, 1.4, 8, 0, 180, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.machineGun, OGg.flankGuard, { reload: 4, damage: 100, health: 100, pen: 100 }]),
                TYPE: "bullet",
                AUTOFIRE: true,
            },
        }, {
            POSITION: [12, 13, 1.4, 8, 0, 270, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.machineGun, OGg.flankGuard, { reload: 4, damage: 100, health: 100, pen: 100 }]),
                TYPE: "bullet",
                AUTOFIRE: true,
            },
        },



    ],
};
Class.hypersprayerDodecagrammataTurretBDN = {
    PARENT: ["genericTank"],
    LABEL: "Sprayer",
    BODY: { FOV: 2 },
    CONTROLLERS: [["spin", { speed: 0.04 }]],
    INDEPENDENT: true,
    COLOR: -1,
    GUNS: [
        {
            POSITION: [20, 11, 0.6, 8, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.machineGun, OGg.lowPower, OGg.flankGuard, { reload: 4, damage: 200, health: 200, pen: 200 }]),
                TYPE: "bullet",
                AUTOFIRE: true,
            },
        }, {
            POSITION: [20, 11, 0.6, 8, 0, 90, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.machineGun, OGg.lowPower, OGg.flankGuard, { reload: 4, damage: 200, health: 200, pen: 200 }]),
                TYPE: "bullet",
                AUTOFIRE: true,
            },
        }, {
            POSITION: [20, 11, 0.6, 8, 0, 180, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.machineGun, OGg.lowPower, OGg.flankGuard, { reload: 4, damage: 200, health: 200, pen: 200 }]),
                TYPE: "bullet",
                AUTOFIRE: true,
            },
        }, {
            POSITION: [20, 11, 0.6, 8, 0, 270, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.machineGun, OGg.lowPower, OGg.flankGuard, { reload: 4, damage: 200, health: 200, pen: 200 }]),
                TYPE: "bullet",
                AUTOFIRE: true,
            },
        },
        {
            POSITION: [16, 12, 1, 8, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.machineGun, OGg.lowPower, OGg.flankGuard, { reload: 4, damage: 200, health: 200, pen: 200 }]),
                TYPE: "bullet",
                AUTOFIRE: true,
            },
        }, {
            POSITION: [16, 12, 1, 8, 0, 90, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.machineGun, OGg.lowPower, OGg.flankGuard, { reload: 4, damage: 200, health: 200, pen: 200 }]),
                TYPE: "bullet",
                AUTOFIRE: true,
            },
        }, {
            POSITION: [16, 12, 1, 8, 0, 180, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.machineGun, OGg.lowPower, OGg.flankGuard, { reload: 4, damage: 200, health: 200, pen: 200 }]),
                TYPE: "bullet",
                AUTOFIRE: true,
            },
        }, {
            POSITION: [16, 12, 1, 8, 0, 270, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.machineGun, OGg.lowPower, OGg.flankGuard, { reload: 4, damage: 200, health: 200, pen: 200 }]),
                TYPE: "bullet",
                AUTOFIRE: true,
            },
        },
        {
            POSITION: [12, 13, 1.4, 8, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.machineGun, OGg.flankGuard, { reload: 4, damage: 200, health: 200, pen: 200 }]),
                TYPE: "bullet",
                AUTOFIRE: true,
            },
        }, {
            POSITION: [12, 13, 1.4, 8, 0, 90, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.machineGun, OGg.flankGuard, { reload: 4, damage: 200, health: 200, pen: 200 }]),
                TYPE: "bullet",
                AUTOFIRE: true,
            },
        }, {
            POSITION: [12, 13, 1.4, 8, 0, 180, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.machineGun, OGg.flankGuard, { reload: 4, damage: 200, health: 200, pen: 200 }]),
                TYPE: "bullet",
                AUTOFIRE: true,
            },
        }, {
            POSITION: [12, 13, 1.4, 8, 0, 270, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.machineGun, OGg.flankGuard, { reload: 4, damage: 200, health: 200, pen: 200 }]),
                TYPE: "bullet",
                AUTOFIRE: true,
            },
        },

        {
            POSITION: [8, 15, 1.4, 8, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.machineGun, OGg.flankGuard, OGg.highPower, { reload: 4, damage: 200, health: 200, pen: 200 }]),
                TYPE: "bullet",
                AUTOFIRE: true,
            },
        }, {
            POSITION: [8, 15, 1.4, 8, 0, 90, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.machineGun, OGg.flankGuard, OGg.highPower, { reload: 4, damage: 200, health: 200, pen: 200 }]),
                TYPE: "bullet",
                AUTOFIRE: true,
            },
        }, {
            POSITION: [8, 15, 1.4, 8, 0, 180, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.machineGun, OGg.flankGuard, OGg.highPower, { reload: 4, damage: 200, health: 200, pen: 200 }]),
                TYPE: "bullet",
                AUTOFIRE: true,
            },
        }, {
            POSITION: [8, 15, 1.4, 8, 0, 270, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.machineGun, OGg.flankGuard, OGg.highPower, { reload: 4, damage: 200, health: 200, pen: 200 }]),
                TYPE: "bullet",
                AUTOFIRE: true,
            },
        },

    ],
};
Class.constructorTurretBDN = {
    PARENT: ["autoTankGun"],
    GUNS:
        [
            {
                POSITION: [18, 18, 1, 0, 0, 0, 0],
            },
            {
                POSITION: [2, 18, 1.2, 18, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([OGg.trap, OGg.setTrap, OGg.construct, OGg.construct, { damage: 1.1, reload: 2 }]),
                    TYPE: "setTrap",
                    STAT_CALCULATOR: "block",
                },
            },
        ]
}
Class.rangerTurretBDN = {
    PARENT: ["autoTankGun"],
    BODY: {
        FOV: 5,
    },
    GUNS:
        [
            {
                POSITION: [32, 8, 1, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([OGg.basic, OGg.sniper, OGg.assassin, OGg.pounder]),
                    TYPE: "bullet",
                },
            },
            {
                POSITION: [5, 8, -1.4, 8, 0, 0, 0],
            },
        ]
}
Class.driverPillboxTurretBDN = {
    PARENT: ["autoTurret"],
    LABEL: "",
    BODY: {
        FOV: 2,
    },
    HAS_NO_RECOIL: true,
    GUNS: [
        {
            POSITION: [22, 8, 1, 0, 5.5, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.minionGun, OGg.turret, OGg.power, OGg.autoTurret, { reload: 0.9, damage: 1.3, health: 1.3, pen: 1.3, recoil: 0, density: 0.1 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [22, 8, 1, 0, -5.5, 0, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.minionGun, OGg.turret, OGg.power, OGg.autoTurret, { reload: 0.9, damage: 1.3, health: 1.3, pen: 1.3, recoil: 0, density: 0.1 }]),
                TYPE: "bullet",
            },
        },
    ],
}
Class.superDriverPillboxTurretBDN = {
    PARENT: ["autoTurret"],
    LABEL: "",
    BODY: {
        FOV: 2,
    },
    HAS_NO_RECOIL: true,
    GUNS: [
        {
            POSITION: [20, 8, 1, 0, 6, 0, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.minionGun, OGg.turret, OGg.power, OGg.autoTurret, { reload: 0.8, damage: 1.6, health: 1.6, pen: 1.6, recoil: 0, density: 0.1 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [20, 8, 1, 0, -6, 0, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.minionGun, OGg.turret, OGg.power, OGg.autoTurret, { reload: 0.8, damage: 1.6, health: 1.6, pen: 1.6, recoil: 0, density: 0.1 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [22, 8, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.minionGun, OGg.turret, OGg.power, OGg.autoTurret, { reload: 0.8, damage: 1.6, health: 1.6, pen: 1.6, recoil: 0, density: 0.1 }]),
                TYPE: "bullet",
            },
        },
    ],
}

Class.hyperDriverPillboxTurretBDN = {
    PARENT: ["autoTurret"],
    LABEL: "",
    BODY: {
        FOV: 2,
    },
    HAS_NO_RECOIL: true,
    GUNS: [
        {
            POSITION: [20, 8, 1, 0, 6, 0, 2 / 3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.minionGun, OGg.turret, OGg.power, OGg.autoTurret, { reload: 0.7, damage: 1.9, health: 1.9, pen: 1.9, recoil: 0, density: 0.1 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [20, 8, 1, 0, -6, 0, 2 / 3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.minionGun, OGg.turret, OGg.power, OGg.autoTurret, { reload: 0.7, damage: 1.9, health: 1.9, pen: 1.9, recoil: 0, density: 0.1 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [21, 8, 1, 0, 3, 0, 1 / 3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.minionGun, OGg.turret, OGg.power, OGg.autoTurret, { reload: 0.7, damage: 1.9, health: 1.9, pen: 1.9, recoil: 0, density: 0.1 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [21, 8, 1, 0, -3, 0, 1 / 3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.minionGun, OGg.turret, OGg.power, OGg.autoTurret, { reload: 0.7, damage: 1.9, health: 1.9, pen: 1.9, recoil: 0, density: 0.1 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [22, 8, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.minionGun, OGg.turret, OGg.power, OGg.autoTurret, { reload: 0.7, damage: 1.9, health: 1.9, pen: 1.9, recoil: 0, density: 0.1 }]),
                TYPE: "bullet",
            },
        },
    ],
}
Class.shyperDriverPillboxTurretBDN = {
    PARENT: ["autoTurret"],
    LABEL: "",
    BODY: {
        FOV: 2,
    },
    HAS_NO_RECOIL: true,
    GUNS: [
        {
            POSITION: [19, 8, 1, 0, 6, 0, 3 / 4],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.minionGun, OGg.turret, OGg.power, OGg.autoTurret, { reload: 0.7, damage: 2.5, health: 2.5, pen: 2.5, recoil: 0, density: 0.1 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [19, 8, 1, 0, -6, 0, 3 / 4],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.minionGun, OGg.turret, OGg.power, OGg.autoTurret, { reload: 0.7, damage: 2.5, health: 2.5, pen: 2.5, recoil: 0, density: 0.1 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [20, 8, 1, 0, 4, 0, 2 / 4],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.minionGun, OGg.turret, OGg.power, OGg.autoTurret, { reload: 0.7, damage: 2.5, health: 2.5, pen: 2.5, recoil: 0, density: 0.1 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [20, 8, 1, 0, -4, 0, 2 / 4],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.minionGun, OGg.turret, OGg.power, OGg.autoTurret, { reload: 0.7, damage: 2.5, health: 2.5, pen: 2.5, recoil: 0, density: 0.1 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [21, 8, 1, 0, 2, 0, 1 / 4],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.minionGun, OGg.turret, OGg.power, OGg.autoTurret, { reload: 0.7, damage: 2.5, health: 2.5, pen: 2.5, recoil: 0, density: 0.1 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [21, 8, 1, 0, -2, 0, 1 / 4],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.minionGun, OGg.turret, OGg.power, OGg.autoTurret, { reload: 0.7, damage: 2.5, health: 2.5, pen: 2.5, recoil: 0, density: 0.1 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [22, 8, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.minionGun, OGg.turret, OGg.power, OGg.autoTurret, { reload: 0.7, damage: 2.5, health: 2.5, pen: 2.5, recoil: 0, density: 0.1 }]),
                TYPE: "bullet",
            },
        },
    ],
}

Class.sshyperDriverPillboxTurretBDN = {
    PARENT: ["autoTurret"],
    LABEL: "",
    BODY: {
        FOV: 2,
    },
    HAS_NO_RECOIL: true,
    GUNS: [
        {
            POSITION: [19, 8, 1, 0, 6, 0, 3 / 4],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.minionGun, OGg.turret, OGg.power, OGg.autoTurret, { speed: 2, maxspeed: 2 }, { reload: 1, damage: 5, health: 5, pen: 5, recoil: 0, density: 0.1 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [19, 8, 1, 0, -6, 0, 3 / 4],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.minionGun, OGg.turret, OGg.power, OGg.autoTurret, { speed: 2, maxspeed: 2 }, { reload: 1, damage: 5, health: 5, pen: 5, recoil: 0, density: 0.1 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [20, 8, 1, 0, 4, 0, 2 / 4],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.minionGun, OGg.turret, OGg.power, OGg.autoTurret, { speed: 2, maxspeed: 2 }, { reload: 1, damage: 5, health: 5, pen: 5, recoil: 0, density: 0.1 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [20, 8, 1, 0, -4, 0, 2 / 4],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.minionGun, OGg.turret, OGg.power, OGg.autoTurret, { speed: 2, maxspeed: 2 }, { reload: 1, damage: 5, health: 5, pen: 5, recoil: 0, density: 0.1 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [21, 8, 1, 0, 2, 0, 1 / 4],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.minionGun, OGg.turret, OGg.power, OGg.autoTurret, { speed: 2, maxspeed: 2 }, { reload: 1, damage: 5, health: 5, pen: 5, recoil: 0, density: 0.1 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [21, 8, 1, 0, -2, 0, 1 / 4],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.minionGun, OGg.turret, OGg.power, OGg.autoTurret, { speed: 2, maxspeed: 2 }, { reload: 1, damage: 5, health: 5, pen: 5, recoil: 0, density: 0.1 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [22, 8, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.minionGun, OGg.turret, OGg.power, OGg.autoTurret, { speed: 2, maxspeed: 2 }, { reload: 1, damage: 5, health: 5, pen: 5, recoil: 0, density: 0.1 }]),
                TYPE: "bullet",
            },
        },
    ],
}


Class.ssshyperDriverPillboxTurretBDN = {
    PARENT: ["autoTurret"],
    LABEL: "",
    BODY: {
        FOV: 2,
    },
    HAS_NO_RECOIL: true,
    GUNS: [
        {
            POSITION: [19, 9, 1, 0, 6, 0, 3 / 4],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.minionGun, OGg.turret, OGg.power, OGg.autoTurret, { speed: 2, maxspeed: 2 }, { reload: 2, damage: 20, health: 20, pen: 20, recoil: 0, density: 0.1 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [19, 9, 1, 0, -6, 0, 3 / 4],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.minionGun, OGg.turret, OGg.power, OGg.autoTurret, { speed: 2, maxspeed: 2 }, { reload: 2, damage: 20, health: 20, pen: 20, recoil: 0, density: 0.1 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [20, 9, 1, 0, 4, 0, 2 / 4],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.minionGun, OGg.turret, OGg.power, OGg.autoTurret, { speed: 2, maxspeed: 2 }, { reload: 2, damage: 20, health: 20, pen: 20, recoil: 0, density: 0.1 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [20, 9, 1, 0, -4, 0, 2 / 4],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.minionGun, OGg.turret, OGg.power, OGg.autoTurret, { speed: 2, maxspeed: 2 }, { reload: 2, damage: 20, health: 20, pen: 20, recoil: 0, density: 0.1 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [21, 9, 1, 0, 2, 0, 1 / 4],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.minionGun, OGg.turret, OGg.power, OGg.autoTurret, { speed: 2, maxspeed: 2 }, { reload: 2, damage: 20, health: 20, pen: 20, recoil: 0, density: 0.1 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [21, 9, 1, 0, -2, 0, 1 / 4],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.minionGun, OGg.turret, OGg.power, OGg.autoTurret, { speed: 2, maxspeed: 2 }, { reload: 2, damage: 20, health: 20, pen: 20, recoil: 0, density: 0.1 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [22, 9, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.minionGun, OGg.turret, OGg.power, OGg.autoTurret, { speed: 2, maxspeed: 2 }, { reload: 2, damage: 20, health: 20, pen: 20, recoil: 0, density: 0.1 }]),
                TYPE: "bullet",
            },
        },
    ],
}
Class.ultraDriverPillboxTurretBDN = {
    PARENT: ["autoTurret"],
    LABEL: "",
    BODY: {
        FOV: 2,
    },
    HAS_NO_RECOIL: true,
    GUNS: [
        {
            POSITION: [17, 5, 1, 0, 7.5, 0, 3 / 4],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.minionGun, OGg.turret, OGg.power, OGg.autoTurret, { speed: 2, maxspeed: 2 }, { reload: 2, damage: 60, health: 60, pen: 60, recoil: 0, density: 0.1 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [17, 5, 1, 0, -7.5, 0, 3 / 4],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.minionGun, OGg.turret, OGg.power, OGg.autoTurret, { speed: 2, maxspeed: 2 }, { reload: 2, damage: 60, health: 60, pen: 60, recoil: 0, density: 0.1 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [18, 5, 1, 0, 6, 0, 3 / 4],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.minionGun, OGg.turret, OGg.power, OGg.autoTurret, { speed: 2, maxspeed: 2 }, { reload: 2, damage: 60, health: 60, pen: 60, recoil: 0, density: 0.1 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [18, 5, 1, 0, -6, 0, 3 / 4],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.minionGun, OGg.turret, OGg.power, OGg.autoTurret, { speed: 2, maxspeed: 2 }, { reload: 2, damage: 60, health: 60, pen: 60, recoil: 0, density: 0.1 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [19, 5, 1, 0, 4.5, 0, 3 / 4],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.minionGun, OGg.turret, OGg.power, OGg.autoTurret, { speed: 2, maxspeed: 2 }, { reload: 2, damage: 60, health: 60, pen: 60, recoil: 0, density: 0.1 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [19, 5, 1, 0, -4.5, 0, 3 / 4],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.minionGun, OGg.turret, OGg.power, OGg.autoTurret, { speed: 2, maxspeed: 2 }, { reload: 2, damage: 60, health: 60, pen: 60, recoil: 0, density: 0.1 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [20, 5, 1, 0, 3, 0, 2 / 4],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.minionGun, OGg.turret, OGg.power, OGg.autoTurret, { speed: 2, maxspeed: 2 }, { reload: 2, damage: 60, health: 60, pen: 60, recoil: 0, density: 0.1 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [20, 5, 1, 0, -3, 0, 2 / 4],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.minionGun, OGg.turret, OGg.power, OGg.autoTurret, { speed: 2, maxspeed: 2 }, { reload: 2, damage: 60, health: 60, pen: 60, recoil: 0, density: 0.1 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [21, 5, 1, 0, 1.5, 0, 1 / 4],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.minionGun, OGg.turret, OGg.power, OGg.autoTurret, { speed: 2, maxspeed: 2 }, { reload: 2, damage: 60, health: 60, pen: 60, recoil: 0, density: 0.1 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [21, 5, 1, 0, -1.5, 0, 1 / 4],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.minionGun, OGg.turret, OGg.power, OGg.autoTurret, { speed: 2, maxspeed: 2 }, { reload: 2, damage: 60, health: 60, pen: 60, recoil: 0, density: 0.1 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [22, 5, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.minionGun, OGg.turret, OGg.power, OGg.autoTurret, { speed: 2, maxspeed: 2 }, { reload: 2, damage: 60, health: 60, pen: 60, recoil: 0, density: 0.1 }]),
                TYPE: "bullet",
            },
        },
    ],
}
Class.destroyerAutoTurretBDN = {
    PARENT: ["autoTurret"],
    LABEL: "",
    BODY: {
        FOV: 2,
    },
    HAS_NO_RECOIL: true,
    GUNS: [
        {
            POSITION: [22, 14, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.pounder, OGg.destroyer, OGg.minionGun, OGg.turret, OGg.power, OGg.autoTurret, { reload: 0.5, damage: 1.5, health: 1.5, pen: 1.5, recoil: 0, density: 0.1 }]),
                TYPE: "bullet",
            },
        },
    ],
}
Class.mountedBulletDESTROYERBDN = {
    PARENT: ["bullet"],
    TURRETS: [
        {
            POSITION: [11, 0, 0, 0, 360, 1],
            TYPE: "destroyerAutoTurretBDN",
            LABEL: "Destroyer"
        },
    ]
}
Class.driverPillboxBDN = {
    PARENT: ["setTrap"],
    LABEL: "Modified Pillbox",
    CONTROLLERS: ["nearestDifferentMaster"],
    INDEPENDENT: true,
    DIE_AT_RANGE: true,
    TURRETS: [
        {
            POSITION: [11, 0, 0, 0, 360, 1],
            TYPE: "driverPillboxTurretBDN",
        },
    ],
}
Class.unsetdriverPillboxBDN = {
    PARENT: ["unsetTrap"],
    LABEL: "Modified Pillbox",
    CONTROLLERS: ["nearestDifferentMaster"],
    INDEPENDENT: true,
    DIE_AT_RANGE: true,
    TURRETS: [
        {
            POSITION: [11, 0, 0, 0, 360, 1],
            TYPE: "driverPillboxTurretBDN",
        },
    ],
}
Class.superDriverPillboxBDN = {
    PARENT: ["setTrap"],
    LABEL: "Modified Pillbox",
    CONTROLLERS: ["nearestDifferentMaster"],
    INDEPENDENT: true,
    DIE_AT_RANGE: true,
    TURRETS: [
        {
            POSITION: [11, 0, 0, 0, 360, 1],
            TYPE: "superDriverPillboxTurretBDN",
        },
    ],
}

Class.unsetsuperDriverPillboxBDN = {
    PARENT: ["unsetTrap"],
    LABEL: "Modified Pillbox",
    CONTROLLERS: ["nearestDifferentMaster"],
    INDEPENDENT: true,
    DIE_AT_RANGE: true,
    TURRETS: [
        {
            POSITION: [11, 0, 0, 0, 360, 1],
            TYPE: "superDriverPillboxTurretBDN",
        },
    ],
}
Class.hyperDriverPillboxBDN = {
    PARENT: ["setTrap"],
    LABEL: "Modified Pillbox",
    CONTROLLERS: ["nearestDifferentMaster"],
    INDEPENDENT: true,
    DIE_AT_RANGE: true,
    TURRETS: [
        {
            POSITION: [11, 0, 0, 0, 360, 1],
            TYPE: "hyperDriverPillboxTurretBDN",
        },
    ],
}

Class.unsethyperDriverPillboxBDN = {
    PARENT: ["unsetTrap"],
    LABEL: "Modified Pillbox",
    CONTROLLERS: ["nearestDifferentMaster"],
    INDEPENDENT: true,
    DIE_AT_RANGE: true,
    TURRETS: [
        {
            POSITION: [11, 0, 0, 0, 360, 1],
            TYPE: "hyperDriverPillboxTurretBDN",
        },
    ],
}
Class.shyperDriverPillboxBDN = {
    PARENT: ["setTrap"],
    LABEL: "Modified Pillbox",
    CONTROLLERS: ["nearestDifferentMaster"],
    INDEPENDENT: true,
    DIE_AT_RANGE: true,
    TURRETS: [
        {
            POSITION: [11, 0, 0, 0, 360, 1],
            TYPE: "shyperDriverPillboxTurretBDN",
        },
    ],
}

Class.sunsethyperDriverPillboxBDN = {
    PARENT: ["unsetTrap"],
    LABEL: "Modified Pillbox",
    CONTROLLERS: ["nearestDifferentMaster"],
    INDEPENDENT: true,
    DIE_AT_RANGE: true,
    TURRETS: [
        {
            POSITION: [11, 0, 0, 0, 360, 1],
            TYPE: "shyperDriverPillboxTurretBDN",
        },
    ],
}

Class.sshyperDriverPillboxBDN = {
    PARENT: ["setTrap"],
    LABEL: "Modified Pillbox",
    CONTROLLERS: ["nearestDifferentMaster"],
    INDEPENDENT: true,
    DIE_AT_RANGE: true,
    TURRETS: [
        {
            POSITION: [11, 0, 0, 0, 360, 1],
            TYPE: "sshyperDriverPillboxTurretBDN",
        },
    ],
}

Class.ssunsethyperDriverPillboxBDN = {
    PARENT: ["unsetTrap"],
    LABEL: "Modified Pillbox",
    CONTROLLERS: ["nearestDifferentMaster"],
    INDEPENDENT: true,
    DIE_AT_RANGE: true,
    TURRETS: [
        {
            POSITION: [11, 0, 0, 0, 360, 1],
            TYPE: "sshyperDriverPillboxTurretBDN",
        },
    ],
}

Class.ssshyperDriverPillboxBDN = {
    PARENT: ["setTrap"],
    LABEL: "Modified Pillbox",
    CONTROLLERS: ["nearestDifferentMaster"],
    INDEPENDENT: true,
    DIE_AT_RANGE: true,
    TURRETS: [
        {
            POSITION: [11, 0, 0, 0, 360, 1],
            TYPE: "ssshyperDriverPillboxTurretBDN",
        },
    ],
}

Class.sssunsethyperDriverPillboxBDN = {
    PARENT: ["unsetTrap"],
    LABEL: "Modified Pillbox",
    CONTROLLERS: ["nearestDifferentMaster"],
    INDEPENDENT: true,
    DIE_AT_RANGE: true,
    TURRETS: [
        {
            POSITION: [11, 0, 0, 0, 360, 1],
            TYPE: "ssshyperDriverPillboxTurretBDN",
        },
    ],
}
Class.ultraDriverPillboxBDN = {
    PARENT: ["setTrap"],
    LABEL: "Modified Pillbox",
    CONTROLLERS: ["nearestDifferentMaster"],
    INDEPENDENT: true,
    DIE_AT_RANGE: true,
    TURRETS: [
        {
            POSITION: [11, 0, 0, 0, 360, 1],
            TYPE: "ultraDriverPillboxTurretBDN",
        },
    ],
}

Class.unsetultraDriverPillboxBDN = {
    PARENT: ["unsetTrap"],
    LABEL: "Modified Pillbox",
    CONTROLLERS: ["nearestDifferentMaster"],
    INDEPENDENT: true,
    DIE_AT_RANGE: true,
    TURRETS: [
        {
            POSITION: [11, 0, 0, 0, 360, 1],
            TYPE: "ultraDriverPillboxTurretBDN",
        },
    ],
}





Class.shinylegionaryPillbox = {
    PARENT: "unsetTrap",
    LABEL: "Pillbox",
    BODY: {
        SPEED: 1,
        DENSITY: 5,
    },
    DIE_AT_RANGE: true,
    TURRETS: [
        {
            POSITION: [11, 0, 0, 0, 360, 1],
            TYPE: "legionaryTriplet",
        },
    ],
}
Class.legendarylegionaryPillbox = {
    PARENT: "unsetTrap",
    LABEL: "Pillbox",
    BODY: {
        SPEED: 1,
        DENSITY: 5,
    },
    DIE_AT_RANGE: true,
    TURRETS: [
        {
            POSITION: [11, 0, 0, 0, 360, 1],
            TYPE: "legionaryQuintuplet",
        },
    ],
}
Class.shadowlegionaryPillbox = {
    PARENT: "unsetTrap",
    LABEL: "Pillbox",
    BODY: {
        SPEED: 1,
        DENSITY: 5,
    },
    DIE_AT_RANGE: true,
    TURRETS: [
        {
            POSITION: [11, 0, 0, 0, 360, 1],
            TYPE: "legionarySextuplet",
        },
    ],
}
Class.rainbowlegionaryPillbox = {
    PARENT: "unsetTrap",
    LABEL: "Pillbox",
    BODY: {
        SPEED: 1,
        DENSITY: 5,
    },
    DIE_AT_RANGE: true,
    TURRETS: [
        {
            POSITION: [11, 0, 0, 0, 360, 1],
            TYPE: "legionarySeptuplet",
        },
    ],
}
Class.translegionaryPillbox = {
    PARENT: "unsetTrap",
    LABEL: "Pillbox",
    BODY: {
        SPEED: 1,
        DENSITY: 5,
    },
    DIE_AT_RANGE: true,
    TURRETS: [
        {
            POSITION: [11, 0, 0, 0, 360, 1],
            TYPE: "legionaryNonuplet",
        },
    ],
}
Class.epilepsylegionaryPillbox = {
    PARENT: "unsetTrap",
    LABEL: "Pillbox",
    BODY: {
        SPEED: 1,
        DENSITY: 8,
    },
    DIE_AT_RANGE: true,
    TURRETS: [
        {
            POSITION: [11, 0, 0, 0, 360, 1],
            TYPE: "legionarymegaQuintuplet",
        },
    ],
}
Class.albinolegionaryPillbox = {
    PARENT: "unsetTrap",
    LABEL: "Pillbox",
    BODY: {
        SPEED: 1,
        DENSITY: 8,
    },
    DIE_AT_RANGE: true,
    TURRETS: [
        {
            POSITION: [11, 0, 0, 0, 360, 1],
            TYPE: "legionarysmegahextuplet",
        },
    ],
}
Class.legionaryTriplet = makeTurret({
    GUNS: [
        ...weaponMirror({
            POSITION: {
                LENGTH: 19,
                WIDTH: 8,
                Y: 2,
                ANGLE: 17.5,
                DELAY: 0.5
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.tripleShot]),
                TYPE: "bullet"
            }
        }, 0),
        {
            POSITION: {
                LENGTH: 22,
                WIDTH: 8
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.tripleShot]),
                TYPE: "bullet"
            }
        }
    ],
}, { fov: 5, independent: true, extraStats: [] })

Class.legionaryQuintuplet = makeTurret({
    GUNS: [
        ...weaponMirror({
            POSITION: {
                LENGTH: 19,
                WIDTH: 8,
                Y: 2,
                ANGLE: 17.5,
                DELAY: 0.5
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.tripleShot, { damage: 3, health: 3, pen: 3 }]),
                TYPE: "bullet"
            }
        }, 0),
        ...weaponMirror({
            POSITION: {
                LENGTH: 20.5,
                WIDTH: 8,
                Y: 2,
                ANGLE: 8.75,
                DELAY: 0.5
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.tripleShot, { damage: 3, health: 3, pen: 3 }]),
                TYPE: "bullet"
            }
        }, 0),
        {
            POSITION: {
                LENGTH: 22,
                WIDTH: 8
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.tripleShot, { damage: 3, health: 3, pen: 3 }]),
                TYPE: "bullet"
            }
        }
    ],
}, { fov: 5, independent: true, extraStats: [] })




Class.legionarySextuplet = makeTurret({
    GUNS: [
        ...weaponMirror({
            POSITION: {
                LENGTH: 17,
                WIDTH: 4,
                Y: 8,
                DELAY: 2 / 3
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.tripleShot, { damage: 12, health: 12, pen: 12 }]),
                TYPE: "bullet"
            }
        }, 0),
        ...weaponMirror({
            POSITION: {
                LENGTH: 18.5,
                WIDTH: 4,
                Y: 6,
                DELAY: 1 / 3
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.tripleShot, { damage: 12, health: 12, pen: 12 }]),
                TYPE: "bullet"
            }
        }, 0),
        ...weaponMirror({
            POSITION: {
                LENGTH: 20,
                WIDTH: 4,
                Y: 4,
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.tripleShot, { damage: 12, health: 12, pen: 12 }]),
                TYPE: "bullet"
            }
        }, 0),
    ],
}, { fov: 5, independent: true, extraStats: [] })

Class.legionarySeptuplet = makeTurret({
    GUNS: [
        ...weaponMirror({
            POSITION: {
                LENGTH: 17,
                WIDTH: 4,
                Y: 8,
                DELAY: 2 / 3
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.tripleShot, { damage: 36, health: 36, pen: 36 }]),
                TYPE: "bullet"
            }
        }, 0),
        ...weaponMirror({
            POSITION: {
                LENGTH: 18.5,
                WIDTH: 4,
                Y: 6,
                DELAY: 1 / 3
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.tripleShot, { damage: 36, health: 36, pen: 36 }]),
                TYPE: "bullet"
            }
        }, 0),
        ...weaponMirror({
            POSITION: {
                LENGTH: 20,
                WIDTH: 4,
                Y: 4,
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.tripleShot, { damage: 36, health: 36, pen: 36 }]),
                TYPE: "bullet"
            }
        }, 0),
        {
            POSITION: {
                LENGTH: 22,
                WIDTH: 8
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.tripleShot, { damage: 36, health: 36, pen: 36 }]),
                TYPE: "bullet"
            }
        }
    ],
}, { fov: 5, independent: true, extraStats: [] })
Class.legionaryNonuplet = makeTurret({
    GUNS: [
        ...weaponMirror({
            POSITION: {
                LENGTH: 14,
                WIDTH: 4,
                Y: 8,
                DELAY: 2 / 3
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.tripleShot, { damage: 108, health: 108, pen: 108 }]),
                TYPE: "bullet"
            }
        }, 0),
        ...weaponMirror({
            POSITION: {
                LENGTH: 16,
                WIDTH: 4,
                Y: 6,
                DELAY: 2 / 3
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.tripleShot, { damage: 108, health: 108, pen: 108 }]),
                TYPE: "bullet"
            }
        }, 0),
        ...weaponMirror({
            POSITION: {
                LENGTH: 18,
                WIDTH: 4,
                Y: 4,
                DELAY: 1 / 3
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.tripleShot, { damage: 108, health: 108, pen: 108 }]),
                TYPE: "bullet"
            }
        }, 0),
        ...weaponMirror({
            POSITION: {
                LENGTH: 20,
                WIDTH: 4,
                Y: 2,
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.tripleShot, { damage: 108, health: 108, pen: 108 }]),
                TYPE: "bullet"
            }
        }, 0),
        {
            POSITION: {
                LENGTH: 21,
                WIDTH: 8
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.tripleShot, { damage: 108, health: 108, pen: 108 }]),
                TYPE: "bullet"
            }
        }
    ],
}, { fov: 5, independent: true, extraStats: [] })
Class.legionarymegaQuintuplet = makeTurret({
    GUNS: [
        ...weaponMirror({
            POSITION: {
                LENGTH: 18,
                WIDTH: 7,
                Y: 6.5,
                DELAY: 2 / 3
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.tripleShot, { damage: 1080, health: 1080, pen: 1080 }]),
                TYPE: "bullet"
            }
        }, 0),
        ...weaponMirror({
            POSITION: {
                LENGTH: 20,
                WIDTH: 7,
                Y: 3.5,
                DELAY: 1 / 3
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.tripleShot, { damage: 1080, health: 1080, pen: 1080 }]),
                TYPE: "bullet"
            }
        }, 0),
        {
            POSITION: {
                LENGTH: 22,
                WIDTH: 7
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.tripleShot, { damage: 1080, health: 1080, pen: 1080 }]),
                TYPE: "bullet"
            }
        }
    ],
}, { fov: 5, independent: true, extraStats: [] })

Class.legionarysmegahextuplet = makeTurret({
    GUNS: [
        ...weaponMirror({
            POSITION: {
                LENGTH: 16,
                WIDTH: 7,
                Y: 6,
                DELAY: 3 / 4
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.tripleShot, { damage: 3240, health: 3240, pen: 3240 }]),
                TYPE: "bullet"
            }
        }, 0),
        ...weaponMirror({
            POSITION: {
                LENGTH: 18,
                WIDTH: 7,
                Y: 3.7,
                DELAY: 2 / 4
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.tripleShot, { damage: 3240, health: 3240, pen: 3240 }]),
                TYPE: "bullet"
            }
        }, 0),
        ...weaponMirror({
            POSITION: {
                LENGTH: 20,
                WIDTH: 7,
                Y: 1.3,
                DELAY: 1 / 4
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.tripleShot, { damage: 3240, health: 3240, pen: 3240 }]),
                TYPE: "bullet"
            }
        }, 0),
        {
            POSITION: {
                LENGTH: 22,
                WIDTH: 5
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.tripleShot, { damage: 3240, health: 3240, pen: 3240 }]),
                TYPE: "bullet"
            }
        }
    ],
}, { fov: 5, independent: true, extraStats: [] })

Class.nestProtectorBDN = {
    PARENT: ["miniboss"],
    LABEL: "Nest Protector",
    COLOR: "purple",
    UPGRADE_COLOR: "purple",
    SHAPE: 5,
    SIZE: 50,
    BODY: {
        FOV: 1.3,
        SPEED: base.SPEED * 0.25,
        HEALTH: base.HEALTH * 9,
        SHIELD: base.SHIELD * 1.5,
        REGEN: base.REGEN,
        DAMAGE: base.DAMAGE * 2.5,
    },
    MAX_CHILDREN: 5,
    VALUE: 3e5,
    GUNS: [],
    TURRETS: [
        {
            POSITION: [8, 9, 0, 72, 120, 0],
            TYPE: ["trappergunBDN", { INDEPENDENT: true, COLOR: -1 }],
        }, {
            POSITION: [8, 9, 0, 0, 120, 0],
            TYPE: ["trappergunBDN", { INDEPENDENT: true, COLOR: -1 }],
        }, {
            POSITION: [8, 9, 0, 144, 120, 0],
            TYPE: ["trappergunBDN", { INDEPENDENT: true, COLOR: -1 }],
        }, {
            POSITION: [8, 9, 0, 216, 120, 0],
            TYPE: ["trappergunBDN", { INDEPENDENT: true, COLOR: -1 }],
        }, {
            POSITION: [8, 9, 0, -72, 120, 0],
            TYPE: ["trappergunBDN", { INDEPENDENT: true, COLOR: -1 }],
        }, {
            POSITION: [9, 0, 0, 0, 360, 1],
            TYPE: ["constructorTurretBDN", { INDEPENDENT: true, COLOR: -1 }],
        },
    ],
};
for (let i = 0; i < 5; i++) {
    Class.nestProtectorBDN.GUNS.push(
        {
            POSITION: [4.75, 9, 1, 9, 0, 72 * i + 36, 0],
        },
        {
            POSITION: [1.5, 11, 1, 13.75, 0, 72 * i + 36, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.factory, { size: 0.5 }, { size: 0.7, reload: 0.5 }]),
                TYPE: "minion",
                STAT_CALCULATOR: "drone",
                AUTOFIRE: true,
                SYNCS_SKILLS: true,
            },
        },
        {
            POSITION: [11, 11, 1, 0, 0, 72 * i + 36, 0],
        },
    )
}
Class.nestProtectorBDN.GUNS[1].PROPERTIES.TYPE = "sentinelLauncher";
Class.nestProtectorBDN.GUNS[4].PROPERTIES.TYPE = "sentinelLauncher";
Class.nestProtectorBDN.GUNS[7].PROPERTIES.TYPE = "sentinelMinigun";
Class.nestProtectorBDN.GUNS[10].PROPERTIES.TYPE = "sentinelCrossbow";
Class.nestProtectorBDN.GUNS[13].PROPERTIES.TYPE = "sentinelCrossbow";
Class.nestDefenderBDN = {
    PARENT: ["miniboss"],
    LABEL: "Nest Defender",
    COLOR: "purple",
    UPGRADE_COLOR: "purple",
    SHAPE: 5,
    SIZE: 50,
    BODY: {
        FOV: 1.3,
        SPEED: base.SPEED * 0.25,
        HEALTH: base.HEALTH * 9,
        SHIELD: base.SHIELD * 1.5,
        REGEN: base.REGEN,
        DAMAGE: base.DAMAGE * 2.5,
    },
    MAX_CHILDREN: 5,
    VALUE: 3e5,
    GUNS: [],
    TURRETS: [
        {
            POSITION: [8, 9, 0, 72, 120, 0],
            TYPE: ["gunGunBDN", { INDEPENDENT: true, COLOR: -1 }],
        }, {
            POSITION: [8, 9, 0, 0, 120, 0],
            TYPE: ["gunGunBDN", { INDEPENDENT: true, COLOR: -1 }],
        }, {
            POSITION: [8, 9, 0, 144, 120, 0],
            TYPE: ["gunGunBDN", { INDEPENDENT: true, COLOR: -1 }],
        }, {
            POSITION: [8, 9, 0, 216, 120, 0],
            TYPE: ["gunGunBDN", { INDEPENDENT: true, COLOR: -1 }],
        }, {
            POSITION: [8, 9, 0, -72, 120, 0],
            TYPE: ["gunGunBDN", { INDEPENDENT: true, COLOR: -1 }],
        }, {
            POSITION: [9, 0, 0, 0, 360, 1],
            TYPE: ["rangerTurretBDN", { INDEPENDENT: true, COLOR: -1 }],
        },
    ],
};
for (let i = 0; i < 5; i++) {
    Class.nestDefenderBDN.GUNS.push(
        {
            POSITION: [11, 8, 1, 0, 0, 72 * i + 36, 0.5],
        },
        {
            POSITION: [3, 8, 1.5, 11, 0, 72 * i + 36, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.trap, OGg.setTrap, { reload: 1.4 }]),
                TYPE: "unsetTrap",
            }
        },
    )
}

Class.menu_nesters.UPGRADES_TIER_0.push("nestProtectorBDN")
Class.menu_nesters.UPGRADES_TIER_0.push("nestDefenderBDN")

// SHINY ELITES :fire: :fire: :fire: :fire: :fire: :fire:
Class.quintupletGunBDN = {
    PARENT: "autoTankGun",
    GUNS: [
        {
            POSITION: [14, 5, 1, 0, -4.5, 0, 0.8],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.autoTurret, OGg.twin, OGg.twin, OGg.power, { speed: 1.3, maxspeed: 1.3 }, { reload: 0.9, damage: 1.3, health: 1.3, pen: 1.3 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [14, 5, 1, 0, 4.5, 0, 0.6],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.autoTurret, OGg.twin, OGg.twin, OGg.power, { speed: 1.3, maxspeed: 1.3 }, { reload: 0.9, damage: 1.3, health: 1.3, pen: 1.3 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [15, 5, 1, 0, -2.25, 0, 0.4],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.autoTurret, OGg.twin, OGg.twin, OGg.power, { speed: 1.3, maxspeed: 1.3 }, { reload: 0.9, damage: 1.3, health: 1.3, pen: 1.3 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [15, 5, 1, 0, 2.25, 0, 0.2],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.autoTurret, OGg.twin, OGg.twin, OGg.power, { speed: 1.3, maxspeed: 1.3 }, { reload: 0.9, damage: 1.3, health: 1.3, pen: 1.3 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [16, 5, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.autoTurret, OGg.twin, OGg.twin, OGg.power, { reload: 2, speed: 1.3, maxspeed: 1.3 }, { reload: 0.9, damage: 1.3, health: 1.3, pen: 1.3 }]),
                TYPE: "bullet",
            },
        },
    ],
}
Class.shinyEliteBDN = {
    PARENT: ["miniboss"],
    LABEL: "Shiny Elite Crasher",
    COLOR: "lightGreen",
    SHAPE: 3,
    SIZE: 28,
    DANGER: 10,
    VARIES_IN_SIZE: true,
    VALUE: 30e4,
    BODY: {
        FOV: 1.25,
        SPEED: 0.125 * base.SPEED,
        HEALTH: 20 * base.HEALTH,
        DAMAGE: 5 * base.DAMAGE,
        REGEN: 1.5 * base.REGEN,
    },
};
Class.crasherSpawnerlimited = makeTurret({
    
    GUNS: [
        {
            POSITION: [6, 12, 1.2, 8, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.drone, g.weak, g.weak, {health: 1.1}]),
                TYPE: [
                    "drone",
                    {
                        LABEL: "Crasher",
                        DRAW_HEALTH: true,
                    },
                ],
                SYNCS_SKILLS: true,
                AUTOFIRE: true,
                STAT_CALCULATOR: "drone",
                MAX_CHILDREN: 4,
            },
        },
    ],
}, {independent: true, aiSettings: {chase: true}, label: 'Spawned', color: 'pink'})
Class.shinyEliteDestroyerBDN = {
    PARENT: ["shinyEliteBDN"],
    UPGRADE_LABEL: "Shiny Elite Destroyer",
    UPGRADE_COLOR: "lightGreen",
    GUNS: [],
    TURRETS: [
        {
            POSITION: [11, 0, 0, 180, 360, 0],
            TYPE: ["crasherSpawnerlimited"],
        }, {
            POSITION: [11, 0, 0, 60, 360, 0],
            TYPE: ["crasherSpawnerlimited"],
        }, {
            POSITION: [11, 0, 0, -60, 360, 0],
            TYPE: ["crasherSpawnerlimited"],
        }, {
            POSITION: [11, 0, 0, 240, 360, 0],
            TYPE: ["crasherSpawnerlimited"],
        }, {
            POSITION: [11, 0, 0, 120, 360, 0],
            TYPE: ["crasherSpawnerlimited"],
        }, {
            POSITION: [11, 0, 0, 0, 360, 0],
            TYPE: ["crasherSpawnerlimited"],
        }, {
            POSITION: [11, 0, 0, 0, 360, 1],
            TYPE: ["quintupletGunBDN", { INDEPENDENT: true, COLOR: -1 }],
        },
    ],
};
for (let i = 0; i < 3; i++) {
    Class.shinyEliteDestroyerBDN.GUNS.push(
        {
            POSITION: [7, 3, 1, 6, 8, i * 120 + 67, 0.25],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.artillery, OGg.pelleter, OGg.pounder, { reload: 0.3, damage: 2, health: 2, pen: 2 }]),
                TYPE: "bullet",
                LABEL: "Devastator Secondary",
            },
        },
        {
            POSITION: [7, 3, 1, 6, -8, i * 120 + 53, 0.75],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.artillery, OGg.pelleter, OGg.pounder, { reload: 0.3, damage: 2, health: 2, pen: 2 }]),
                TYPE: "bullet",
                LABEL: "Devastator Secondary",
            },
        },
    )
    Class.shinyEliteDestroyerBDN.GUNS.push(
        {
            POSITION: [7, 16, 1, 6, 0, i * 120 + 60, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.pounder, OGg.pounder, OGg.destroyer, { reload: 0.9, damage: 2, health: 2, pen: 2 }]),
                TYPE: "bullet",
                LABEL: "Devastator Primary",
            },
        },
    )
}
Class.shinyEliteGunnerBDN = {
    PARENT: ["shinyEliteBDN"],
    UPGRADE_LABEL: "Shiny Elite Gunner",
    UPGRADE_COLOR: "lightGreen",
    FACING_TYPE: "toTarget",
    GUNS: [
        {
            POSITION: [14, 16, 1, 0, 0, 180, 0],
        },
        {
            POSITION: [14, 13, 1, 0, 0, 180, 0],
        }, {
            POSITION: [4, 16, 1.5, 14, 0, 180, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.trap, OGg.hexaTrapper, { reload: 0.9, damage: 1.3, health: 1.3, pen: 1.3 }]),
                TYPE: ["unsetdriverPillboxBDN", { MOTION_TYPE: "glide" }],
                STAT_CALCULATOR: "trap",
            },
        },
        {
            POSITION: [4, 13, 1.5, 14, 0, 180, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.trap, OGg.hexaTrapper, { reload: 0.9, range: 0, damage: 0 }]),
                TYPE: "bullet",
            },
        }, {
            POSITION: [6, 14, -2, 2, 0, 60, 0],
        }, {
            POSITION: [6, 14, -2, 2, 0, 300, 0],
        }, {
            POSITION: [6, 14, -2, 2, 0, 55, 0],
        }, {
            POSITION: [6, 14, -2, 2, 0, 305, 0],
        },
    ],
    AI: { NO_LEAD: false },
    TURRETS: [
        {
            POSITION: [14, 8, 0, 60, 180, 0],
            TYPE: ["rimfireGunBDN"],
        }, {
            POSITION: [14, 8, 0, 300, 180, 0],
            TYPE: ["rimfireGunBDN"],
        },
    ],
};
Class.shinyEliteSprayerBDN = {
    PARENT: ["shinyEliteBDN"],
    UPGRADE_LABEL: "Shiny Elite Sprayer",
    UPGRADE_COLOR: "lightGreen",
    SKILL: skillSet({
        rld: 0.7,
        dam: 0.5,
        pen: 0.8,
        str: 0.8,
        spd: 0.2,
        atk: 0.3,
        hlt: 1,
        shi: 0.7,
        rgn: 0.7,
        mob: 1,
    }),
    AI: { NO_LEAD: false },
    HAS_NO_RECOIL: true,
    GUNS: [],
    TURRETS: [
        {
            /*    SIZE         X             Y         ANGLE        ARC */
            POSITION: [6.5, 0, 0, 0, 360, 1],
            TYPE: ["sprayerTripleTurretBDN", { INDEPENDENT: true }],
        }, {
            POSITION: [7, 6, -7.6, 180, 130, 0],
            TYPE: ["sprayerGunBDN", { COLOR: "grey" }],
        }, {
            POSITION: [7, 6, 7.6, 180, 130, 0],
            TYPE: ["sprayerGunBDN", { COLOR: "grey" }],
        }, {
            POSITION: [7, 6, 7.6, 60, 130, 0],
            TYPE: ["sprayerGunBDN", { COLOR: "grey" }],
        }, {
            POSITION: [7, 6, -7.6, 60, 130, 0],
            TYPE: ["sprayerGunBDN", { COLOR: "grey" }],
        }, {
            POSITION: [7, 6, 7.6, -60, 130, 0],
            TYPE: ["sprayerGunBDN", { COLOR: "grey" }],
        }, {
            POSITION: [7, 6, -7.6, -60, 130, 0],
            TYPE: ["sprayerGunBDN", { COLOR: "grey" }],
        }, {
            POSITION: [10, 6, 0, 180, 130, 0],
            TYPE: ["superSprayerGunBDN", { COLOR: "grey" }],
        }, {
            POSITION: [10, 6, 0, 60, 130, 0],
            TYPE: ["superSprayerGunBDN", { COLOR: "grey" }],
        }, {
            POSITION: [10, 6, 0, -60, 130, 0],
            TYPE: ["superSprayerGunBDN", { COLOR: "grey" }],
        },
    ],
};
Class.shinyEliteBattleshipBDN = {
    PARENT: ["shinyEliteBDN"],
    UPGRADE_LABEL: "Shiny Elite Battleship",
    UPGRADE_COLOR: "lightGreen",
    GUNS: [],
    TURRETS: [
        {
            POSITION: [5, 7.5, 0, 0, 360, 1],
            TYPE: ["autoTankGun", { INDEPENDENT: true, COLOR: -1, PARENT: "carrier" }],
        }, {
            POSITION: [5, 7.5, 0, 120, 360, 1],
            TYPE: ["autoTankGun", { INDEPENDENT: true, COLOR: -1, PARENT: "carrier" }],
        }, {
            POSITION: [5, 7.5, 0, 240, 360, 1],
            TYPE: ["autoTankGun", { INDEPENDENT: true, COLOR: -1, PARENT: "carrier" }],
        },
    ],
};
for (i = 0; i < 3; i++) {
    Class.shinyEliteBattleshipBDN.GUNS.push(
        {
            POSITION: [4, 5, 0.6, 7, -9.25, i * 120 - 60, 0.25],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.battleship, { reload: 0.75, damage: 1.3, health: 1.3, pen: 1.3 }]),
                TYPE: "autoswarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [4, 5, 0.6, 7, 9.25, i * 120 - 60, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.battleship, { reload: 0.75, damage: 1.3, health: 1.3, pen: 1.3 }]),
                TYPE: "autoswarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [4, 5, 0.6, 7, 5, i * 120 - 60, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.battleship, { reload: 0.75, damage: 1.3, health: 1.3, pen: 1.3 }]),
                TYPE: "autoswarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [4, 5, 0.6, 7, -5, i * 120 - 60, 0.75],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.battleship, { reload: 0.75, damage: 1.3, health: 1.3, pen: 1.3 }]),
                TYPE: "autoswarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [5, 7, 0.6, 7, 0, i * 120 - 60, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.battleship, { damage: 2, health: 2, pen: 2 }]),
                TYPE: "autoswarm",
                STAT_CALCULATOR: "swarm",
            },
        },
    )
}
Class.shinyEliteSpawnerBDN = {
    PARENT: ["shinyEliteBDN"],
    UPGRADE_LABEL: "Shiny Elite Spawner",
    UPGRADE_COLOR: "lightGreen",
    MAX_CHILDREN: 7,
    AI: { STRAFE: false },
    GUNS: [
        {
            POSITION: [11, 16, 1, 0, 0, 60, 0],
        },

        {
            POSITION: [11, 16, 1, 0, 0, 180, 0],
        },

        {
            POSITION: [11, 16, 1, 0, 0, 300, 0],
        }, {
            /*** LENGTH    WIDTH     ASPECT        X             Y         ANGLE     DELAY */
            POSITION: [2, 18, 1, 11, 0, 60, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.drone, OGg.weak, OGg.weak, OGg.weak, { size: 0.4 }, { health: 0.1, reload: 0.8 }]),
                TYPE: ["shinySentrySwarm", { GIVE_KILL_MESSAGE: false, VARIES_IN_SIZE: false }],
                SYNCS_SKILLS: true,
                AUTOFIRE: true,
                STAT_CALCULATOR: "drone",
            },
        }, {
            POSITION: [2, 18, 1, 11, 0, 180, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.drone, OGg.weak, OGg.weak, OGg.weak, { size: 0.4 }, { health: 0.1, reload: 0.8 }]),
                TYPE: ["shinySentryTrap", { GIVE_KILL_MESSAGE: false, VARIES_IN_SIZE: false }],
                SYNCS_SKILLS: true,
                AUTOFIRE: true,
                STAT_CALCULATOR: "drone",
            },
        }, {
            POSITION: [2, 18, 1, 11, 0, 300, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.drone, OGg.weak, OGg.weak, OGg.weak, { size: 0.4 }, { health: 0.1, reload: 0.8 }]),
                TYPE: ["shinySentryGun", { GIVE_KILL_MESSAGE: false, VARIES_IN_SIZE: false }],
                SYNCS_SKILLS: true,
                AUTOFIRE: true,
                STAT_CALCULATOR: "drone",
            },
        },
        {
            POSITION: [13, 10, 1, 0, 0, 60, 0],
        },
        {
            POSITION: [13, 3, 1, 0, -6, 55, 0],
        },
        {
            POSITION: [13, 3, 1, 0, 6, 65, 0],
        },


        {
            POSITION: [4, 5, 1.6, 10, 0, 180, 0],
        },
        {
            POSITION: [4, 5, 1.6, 9, 0, 180, 0],
        },
        {
            POSITION: [4, 5, 1.6, 8, 0, 180, 0],
        },

        {
            POSITION: [5, 6, 1.65, 8, 0, 300, 0],
        },
    ],
    TURRETS: [
        {
            POSITION: [11, 0, 0, 0, 360, 1],
            TYPE: ["quintupletGunBDN", { INDEPENDENT: false, COLOR: -1 }],
        },
    ],
};
Class.shinyEliteTrapGuardTopBDN = {
    PARENT: ["genericTank"],
    COLOR: -1,
    CONTROLLERS: [["spin", { independent: true }]],
    GUNS: [],
};
for (let i = 0; i < 3; i++) {
    Class.shinyEliteTrapGuardTopBDN.GUNS.push(
        {
            POSITION: [17, 8, 1, 0, 0, 120 * i, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.flankGuard, OGg.flankGuard, { reload: 0.9, damage: 1.4, health: 1.4, pen: 1.4 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [20, 8, 1, 0, 0, 120 * i + 60, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.flankGuard, OGg.flankGuard, { reload: 1.3, damage: 1.3, health: 1.3, pen: 1.3 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [4, 8, 1.7, 13, 0, 120 * i + 60, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.trap, { reload: 1.3, damage: 1.3, health: 1.3, pen: 1.3 }]),
                TYPE: "trap",
                STAT_CALCULATOR: "trap",
            },
        },
    )
};
Class.shinyEliteTrapGuardBDN = {
    PARENT: ["shinyEliteBDN"],
    UPGRADE_LABEL: "Shiny Elite Trap Guard",
    UPGRADE_COLOR: "lightGreen",
    AI: { STRAFE: false },
    GUNS: [],
    TURRETS: [
        {
            POSITION: [9.5, 0, 0, 0, 360, 1],
            TYPE: "shinyEliteTrapGuardTopBDN",
        },
    ],
};
for (let i = 0; i < 3; i++) {
    Class.shinyEliteTrapGuardBDN.GUNS.push(
        {
            POSITION: [10.5, 8, 1, 0, 0, 120 * i + 60, 0],
        }, {
        POSITION: [2, 8, 1.4, 10.5, 0, 120 * i + 60, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([OGg.trap, OGg.setTrap, { reload: 0.6, damage: 1.3, health: 1.3, pen: 1.3 }]),
            TYPE: "unsetTrap",
            STAT_CALCULATOR: "trap",
        },
    },
    )
    Class.shinyEliteTrapGuardBDN.TURRETS.push(
        {
            POSITION: [5.5, 8, -9, 120 * i + 60, 160, 0],
            TYPE: ["singleGunBDN", { INDEPENDENT: false, }],
        }, {
        POSITION: [5.5, 8, 9, 120 * i + 60, 160, 0],
        TYPE: ["singleGunBDN", { INDEPENDENT: false, }],
    },
    )
};
Class.shinyEliteSpinnerCycloneBDN = {
    PARENT: ["genericTank"],
    COLOR: -1,
    CONTROLLERS: [["spin", { speed: 0.1, independent: true }]],
    GUNS: [],
};
for (let i = 0; i < 3; i++) {
    Class.shinyEliteSpinnerCycloneBDN.GUNS.push(
        {
            POSITION: [15, 3, 1, 0, 0, (120 * i), 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.gunner, { reload: 0.5, speed: 2.5, maxSpeed: 1.3, damage: 1.3, health: 1.3, pen: 1.3 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [15, 3, 1, 0, 0, (120 * i) + 20, 1 / 6],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.gunner, { reload: 0.5, speed: 2.5, maxSpeed: 1.3, damage: 1.3, health: 1.3, pen: 1.3 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [15, 3, 1, 0, 0, (120 * i) + 40, 1 / 3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.gunner, { reload: 0.5, speed: 2.5, maxSpeed: 1.3, damage: 1.3, health: 1.3, pen: 1.3 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [15, 3, 1, 0, 0, (120 * i) + 60, 1 / 2],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.gunner, { reload: 0.5, speed: 2.5, maxSpeed: 1.3, damage: 1.3, health: 1.3, pen: 1.3 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [15, 3, 1, 0, 0, (120 * i) + 80, 2 / 3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.gunner, { reload: 0.5, speed: 2.5, maxSpeed: 1.3, damage: 1.3, health: 1.3, pen: 1.3 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [15, 3, 1, 0, 0, (120 * i) + 100, 5 / 6],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.gunner, { reload: 0.5, speed: 2.5, maxSpeed: 1.3, damage: 1.3, health: 1.3, pen: 1.3 }]),
                TYPE: "bullet",
            },
        },
    )
};
Class.shinyEliteSpinnerBDN = {
    PARENT: ["shinyEliteBDN"],
    UPGRADE_LABEL: "Shiny Elite Spinner",
    UPGRADE_COLOR: "lightGreen",
    SKILL: skillSet({
        rld: 0.7,
        dam: 0.5,
        pen: 0.8,
        str: 0.8,
        spd: 0.2,
        atk: 0.3,
        hlt: 1,
        shi: 0.7,
        rgn: 0.7,
        mob: 1,
    }),
    AI: { STRAFE: false },
    FACING_TYPE: ["spin", { speed: 0.1 }],
    GUNS: [],
    TURRETS: [
        {
            POSITION: [9.5, 0, 0, 0, 360, 1],
            TYPE: ["shinyEliteSpinnerCycloneBDN", { COLOR: -1 }],
        },
    ],
};
for (let i = 0; i < 3; i++) {
    Class.shinyEliteSpinnerBDN.GUNS.push(
        {
            POSITION: [9.5, 2, 1, -1.5, 11.5, 120 * i + 10, 4 / 5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.twin, OGg.gunner, { speed: 1.3, maxSpeed: 1.3, reload: 0.5, damage: 1.4, health: 1.4, pen: 1.4 }]),
                TYPE: "bullet",
            },
        }, {
        POSITION: [9.5, 2, 1, 2, 9, 120 * i + 10, 3 / 5],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([OGg.basic, OGg.twin, OGg.gunner, { speed: 1.3, maxSpeed: 1.3, reload: 0.5, damage: 1.4, health: 1.4, pen: 1.4 }]),
            TYPE: "bullet",
        },
    }, {
        POSITION: [9.5, 2, 1, 3.5, 6.5, 120 * i + 10, 2 / 5],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([OGg.basic, OGg.twin, OGg.gunner, { speed: 1.3, maxSpeed: 1.3, reload: 0.5, damage: 1.4, health: 1.4, pen: 1.4 }]),
            TYPE: "bullet",
        },
    }, {
        POSITION: [9.5, 2, 1, 6, 4, 120 * i + 10, 1 / 5],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([OGg.basic, OGg.twin, OGg.gunner, { speed: 1.3, maxSpeed: 1.3, reload: 0.5, damage: 1.4, health: 1.4, pen: 1.4 }]),
            TYPE: "bullet",
        },
    }, {
        POSITION: [9.5, 2, 1, 8.5, 1.5, 120 * i + 10, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([OGg.basic, OGg.twin, OGg.gunner, { speed: 1.3, maxSpeed: 1.3, reload: 0.5, damage: 1.4, health: 1.4, pen: 1.4 }]),
            TYPE: "bullet",
        },
    }, {
        POSITION: [2, 20, 0.75, 8, 0, 120 * i + 60, 0],
    },
    )
};

// Legions
Class.shinydestroyerLegion = {
    PARENT: ["shinyEliteBDN"],
    UPGRADE_LABEL: "Shiny Destroyer Legion",
    NAME: "Shiny Destroyer Legion",
    DISPLAY_NAME: false,
    UPGRADE_COLOR: "lightGreen",
    AI: { NO_LEAD: false },
    SIZE: 30,
    GUNS: [],
    BODY: {
        HEALTH: 12 * base.HEALTH,
    },
    TURRETS: [
        {
            POSITION: [11, 0, 0, 180, 360, 0],
            TYPE: ["crasherSpawnerlimited", { GUN_STAT_SCALE: { health: 1.1 } }],
        }, {
            POSITION: [11, 0, 0, 60, 360, 0],
            TYPE: ["crasherSpawnerlimited", { GUN_STAT_SCALE: { health: 1.1 } }],
        }, {
            POSITION: [11, 0, 0, -60, 360, 0],
            TYPE: ["crasherSpawnerlimited", { GUN_STAT_SCALE: { health: 1.1 } }],
        }, {
            POSITION: [11, 0, 0, 240, 360, 0],
            TYPE: ["crasherSpawnerlimited", { GUN_STAT_SCALE: { health: 1.1 } }],
        }, {
            POSITION: [11, 0, 0, 120, 360, 0],
            TYPE: ["crasherSpawnerlimited", { GUN_STAT_SCALE: { health: 1.1 } }],
        }, {
            POSITION: [11, 0, 0, 0, 360, 0],
            TYPE: ["crasherSpawnerlimited", { GUN_STAT_SCALE: { health: 1.1 } }],
        }, {
            POSITION: [11, 0, 0, 0, 360, 1],
            TYPE: ["quintupletGunBDN", { GUN_STAT_SCALE: { health: 1.1 }, INDEPENDENT: true, COLOR: -1 }],
        },
    ],
};
for (let i = 0; i < 3; i++) {
    Class.shinydestroyerLegion.GUNS.push(
        {
            POSITION: [7, 3, 1, 6, 8, i * 120 + 67, 0.25],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.artillery, OGg.pelleter, OGg.pounder, { reload: 0.3, damage: 2, health: 2.2, pen: 2 }]),
                TYPE: "bullet",
                LABEL: "Devastator Secondary",
            },
        },
        {
            POSITION: [7, 3, 1, 6, -8, i * 120 + 53, 0.75],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.artillery, OGg.pelleter, OGg.pounder, { reload: 0.3, damage: 2, health: 2.2, pen: 2 }]),
                TYPE: "bullet",
                LABEL: "Devastator Secondary",
            },
        },
    )
    Class.shinydestroyerLegion.GUNS.push(
        {
            POSITION: [7, 16, 1, 6, 0, i * 120 + 60, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.pounder, OGg.pounder, OGg.destroyer, { reload: 0.9, damage: 2, health: 2.2, pen: 2 }]),
                TYPE: "bullet",
                LABEL: "Devastator Primary",
            },
        },
    )
}
Class.shinygunnerLegion = {
    PARENT: ["shinyEliteBDN"],
    UPGRADE_LABEL: "Shiny Gunner Legion",
    NAME: "Shiny Gunner Legion",
    DISPLAY_NAME: false,
    UPGRADE_COLOR: "lightGreen",
    FACING_TYPE: "toTarget",
    AI: { NO_LEAD: false },
    SIZE: 30,
    BODY: {
        HEALTH: 12 * base.HEALTH,
    },
    GUNS: [
        {
            POSITION: [14, 16, 1, 0, 0, 180, 0],
        },
        {
            POSITION: [14, 13, 1, 0, 0, 180, 0],
        }, {
            POSITION: [4, 16, 1.5, 14, 0, 180, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.trap, OGg.hexaTrapper, { reload: 0.9, damage: 1.3, health: 1.4, pen: 1.3 }]),
                TYPE: ["unsetdriverPillboxBDN", { MOTION_TYPE: "glide" }],
                STAT_CALCULATOR: "trap",
            },
        },
        {
            POSITION: [4, 13, 1.5, 14, 0, 180, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.trap, OGg.hexaTrapper, { reload: 0.9, range: 0, damage: 0, health: 1.1 }]),
                TYPE: "bullet",
            },
        }, {
            POSITION: [6, 14, -2, 2, 0, 60, 0],
        }, {
            POSITION: [6, 14, -2, 2, 0, 300, 0],
        }, {
            POSITION: [6, 14, -2, 2, 0, 55, 0],
        }, {
            POSITION: [6, 14, -2, 2, 0, 305, 0],
        },
    ],
    AI: { NO_LEAD: false },
    TURRETS: [
        {
            POSITION: [14, 8, 0, 60, 180, 0],
            TYPE: ["rimfireGunBDN", { GUN_STAT_SCALE: { health: 1.15 } }],
        }, {
            POSITION: [14, 8, 0, 300, 180, 0],
            TYPE: ["rimfireGunBDN", { GUN_STAT_SCALE: { health: 1.15 } }],
        },
    ],
}
Class.shinysprayerLegion = {
    PARENT: ["shinyEliteBDN"],
    UPGRADE_LABEL: "Shiny Sprayer Legion",
    NAME: "Shiny Sprayer Legion",
    DISPLAY_NAME: false,
    UPGRADE_COLOR: "lightGreen",
    AI: { NO_LEAD: false },
    SIZE: 30,
    SKILL: [0, 9, 3, 9, 2, 9, 9, 9, 9, 0],
    HAS_NO_RECOIL: true,
    BODY: {
        HEALTH: 12 * base.HEALTH,
    },
    TURRETS: weaponArray({
        POSITION: [14, 6, 0, 60, 190, 0],
        TYPE: ["gunner", { GUN_STAT_SCALE: { health: 1.4, damage: 1.6, speed: 1.6, resist: 1.15 }, COLOR: -1 }],
    }, 3)
}
Class.shinybattleshipLegion = {
    PARENT: ["shinyEliteBDN"],
    UPGRADE_LABEL: "Shiny Battleship Legion",
    NAME: "Shiny Battleship Legion",
    DISPLAY_NAME: false,
    UPGRADE_COLOR: "lightGreen",
    AI: { NO_LEAD: false },
    SIZE: 30,
    BODY: {
        HEALTH: 12 * base.HEALTH,
    },
    GUNS: [],
    TURRETS: [
        {
            POSITION: [5, 7.5, 0, 0, 360, 1],
            TYPE: ["autoTankGun", { GUN_STAT_SCALE: { health: 1.1 }, INDEPENDENT: true, COLOR: -1, PARENT: "carrier" }],
        }, {
            POSITION: [5, 7.5, 0, 120, 360, 1],
            TYPE: ["autoTankGun", { GUN_STAT_SCALE: { health: 1.1 }, INDEPENDENT: true, COLOR: -1, PARENT: "carrier" }],
        }, {
            POSITION: [5, 7.5, 0, 240, 360, 1],
            TYPE: ["autoTankGun", { GUN_STAT_SCALE: { health: 1.1 }, INDEPENDENT: true, COLOR: -1, PARENT: "carrier" }],
        },
    ],
};
for (i = 0; i < 3; i++) {
    Class.shinybattleshipLegion.GUNS.push(
        {
            POSITION: [4, 5, 0.6, 7, -9.25, i * 120 - 60, 0.25],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.battleship, { reload: 0.7, damage: 1.4, health: 1.4, pen: 1.4 }]),
                TYPE: "autoswarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [4, 5, 0.6, 7, 9.25, i * 120 - 60, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.battleship, { reload: 0.7, damage: 1.4, health: 1.4, pen: 1.4 }]),
                TYPE: "autoswarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [4, 5, 0.6, 7, 5, i * 120 - 60, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.battleship, { reload: 0.7, damage: 1.4, health: 1.4, pen: 1.4 }]),
                TYPE: "autoswarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [4, 5, 0.6, 7, -5, i * 120 - 60, 0.75],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.battleship, { reload: 0.7, damage: 1.4, health: 1.4, pen: 1.4 }]),
                TYPE: "autoswarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [5, 7, 0.6, 7, 0, i * 120 - 60, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.battleship, { damage: 2.1, health: 2.1, pen: 2.1 }]),
                TYPE: "autoswarm",
                STAT_CALCULATOR: "swarm",
            },
        },
    )
}
Class.shinyspawnerLegion = {
    PARENT: ["shinyEliteBDN"],
    UPGRADE_LABEL: "Shiny Spawner Legion",
    NAME: "Shiny Spawner Legion",
    DISPLAY_NAME: false,
    UPGRADE_COLOR: "lightGreen",
    AI: { NO_LEAD: false },
    SIZE: 30,
    BODY: {
        HEALTH: 12 * base.HEALTH,
    },
    GUNS: [
        {
            POSITION: [11, 16, 1, 0, 0, 60, 0],
        },

        {
            POSITION: [11, 16, 1, 0, 0, 180, 0],
        },

        {
            POSITION: [11, 16, 1, 0, 0, 300, 0],
        }, {
            /*** LENGTH    WIDTH     ASPECT        X             Y         ANGLE     DELAY */
            POSITION: [2, 18, 1, 11, 0, 60, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.drone, OGg.weak, OGg.weak, OGg.weak, { size: 0.4 }, { health: 0.25, reload: 0.8 }]),
                TYPE: ["shinySentrySwarm", { GIVE_KILL_MESSAGE: false, VARIES_IN_SIZE: false }],
                SYNCS_SKILLS: true,
                AUTOFIRE: true,
                STAT_CALCULATOR: "drone",
            },
        }, {
            POSITION: [2, 18, 1, 11, 0, 180, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.drone, OGg.weak, OGg.weak, OGg.weak, { size: 0.4 }, { health: 0.25, reload: 0.8 }]),
                TYPE: ["shinySentryTrap", { GIVE_KILL_MESSAGE: false, VARIES_IN_SIZE: false }],
                SYNCS_SKILLS: true,
                AUTOFIRE: true,
                STAT_CALCULATOR: "drone",
            },
        }, {
            POSITION: [2, 18, 1, 11, 0, 300, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.drone, OGg.weak, OGg.weak, OGg.weak, { size: 0.4 }, { health: 0.25, reload: 0.8 }]),
                TYPE: ["shinySentryGun", { GIVE_KILL_MESSAGE: false, VARIES_IN_SIZE: false }],
                SYNCS_SKILLS: true,
                AUTOFIRE: true,
                STAT_CALCULATOR: "drone",
            },
        },
        {
            POSITION: [13, 10, 1, 0, 0, 60, 0],
        },
        {
            POSITION: [13, 3, 1, 0, -6, 55, 0],
        },
        {
            POSITION: [13, 3, 1, 0, 6, 65, 0],
        },


        {
            POSITION: [4, 5, 1.6, 10, 0, 180, 0],
        },
        {
            POSITION: [4, 5, 1.6, 9, 0, 180, 0],
        },
        {
            POSITION: [4, 5, 1.6, 8, 0, 180, 0],
        },

        {
            POSITION: [5, 6, 1.65, 8, 0, 300, 0],
        },
    ],
    TURRETS: [
        {
            POSITION: [11, 0, 0, 0, 360, 1],
            TYPE: ["quintupletGunBDN", { GUN_STAT_SCALE: { health: 1.15 }, INDEPENDENT: false, COLOR: -1 }],
        },
    ],
}
// Legionary Crasher
Class.shinylegionaryCrasherTop = {
    PARENT: ["shinyEliteBDN"],
    AI: { STRAFE: false, NO_LEAD: false },
    CONTROLLERS: [["spin", { independent: true, speed: -0.005 }]],
    INDEPENDENT: true,
    DISPLAY_NAME: false,
    GUNS: weaponArray([
        {
            POSITION: [4, 6, 0.7, 7, 5, 60, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.pounder, { speed: 2, maxSpeed: 1.7, size: 0.6, range: 2.8 }]),
                TYPE: ["swarm", { INDEPENDENT: true }],
                STAT_CALCULATOR: "swarm",
                AUTOFIRE: true,

            },
        }, {
            POSITION: [4, 6, 0.7, 7, -5, 60, 1 / 4],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.pounder, { speed: 2, maxSpeed: 1.7, size: 0.6, range: 2.8 }]),
                TYPE: ["swarm", { INDEPENDENT: true }],
                STAT_CALCULATOR: "swarm",
                AUTOFIRE: true,
            },
        }, {
            POSITION: [4, 6, 0.7, 7, -2.5, 60, 2 / 4],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.pounder, { speed: 2, maxSpeed: 1.7, size: 0.6, range: 2.8 }]),
                TYPE: ["swarm", { INDEPENDENT: true }],
                STAT_CALCULATOR: "swarm",
                AUTOFIRE: true,
            },
        }, {
            POSITION: [4, 6, 0.7, 7, 2.5, 60, 3 / 4],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.pounder, { speed: 2, maxSpeed: 1.7, size: 0.6, range: 2.8 }]),
                TYPE: ["swarm", { INDEPENDENT: true }],
                STAT_CALCULATOR: "swarm",
                AUTOFIRE: true,
            },
        },
    ], 3),
    TURRETS: weaponArray({
        POSITION: [9.5, 10, 0, 0, 190, 0],
        TYPE: ["quintupletGunBDN", { GUN_STAT_SCALE: { damage: 1.4, health: 1.1, speed: 1.2, maxSpeed: 1.2, resist: 1.1, range: 1.3 } }],
    }, 3),
}
Class.shinylegionaryCrasherSpawner = {
    PARENT: 'genericTank',
    SHAPE: "",
    INDEPENDENT: true,
    GUNS: [{
        POSITION: [0, 10, 0, 0, 0, 0, 10],
        PROPERTIES: {
            TYPE: 'shinydestroyerLegion',
            SHOOT_SETTINGS: combineStats([{ reload: 0.1 }]),
            NO_LIMITATIONS: true,
            INDEPENDENT_CHILDREN: true,
            MAX_CHILDREN: 1,
            IDENTIFIER: 1,
            AUTOFIRE: true,
        }
    }],
    ON: [{
        event: "fire",
        handler: ({ gun }) => {
            gun.setBulletType(["shinydestroyerLegion", "shinygunnerLegion", "shinysprayerLegion", "shinybattleshipLegion", "shinyspawnerLegion"][gun.identifier++ % 5]);
        }
    }],
}
Class.shinylegionaryCrasher = {
    PARENT: ["shinyEliteBDN"],
    LABEL: "Shiny Legionary Crasher",
    NAME: "Shiny Legionary Crasher",
    DISPLAY_NAME: false,
    UPGRADE_COLOR: "lightGreen",
    AI: { STRAFE: false, NO_LEAD: false },
    HAS_NO_RECOIL: true,
    VALUE: 2e7,
    SIZE: 80,
    BODY: {
        FOV: 1.5,
        SPEED: 0.1 * base.SPEED,
        HEALTH: 3000,
        DAMAGE: 7 * base.DAMAGE,
    },
    GUNS: [
        ...weaponArray([
            {
                POSITION: [14.5, 13, 1, 0, 0, 0, 0],
            }, {
                POSITION: [3, 13, 1.7, 14.5, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([OGg.trap, OGg.setTrap, OGg.pounder, { reload: 1.9, speed: 2.2, size: 0.7, maxSpeed: 2.1, range: 0.75 }]),
                    TYPE: "shinylegionaryPillbox",
                    NO_LIMITATIONS: true,
                    STAT_CALCULATOR: "trap",
                },
            },
        ], 3),
        ...weaponArray({
            POSITION: [5, 12, 1.6, -11, 0, 0, 0],
        }, 3),
    ],
    TURRETS: [
        {
            POSITION: [12, 0, 0, 0, 360, 1],
            TYPE: "shinylegionaryCrasherTop",
        },
        ...weaponArray({
            POSITION: [14, 8, 0, 60, 180, 0],
            TYPE: ["superSprayerGunBDN", { GUN_STAT_SCALE: { speed: 1.6, health: 1.8, damage: 1.7, resist: 1.5 }, COLOR: -1 }],
        }, 3),
        {
            POSITION: [12, 0, 0, 0, 0, 0],
            TYPE: 'shinylegionaryCrasherSpawner'
        }
    ],
}
Class.shinylegionaryCrasherSpawnerFix = {
    PARENT: 'genericTank',
    SHAPE: "",
    INDEPENDENT: true,
    GUNS: [{
        POSITION: [0, 10, 0, 0, 0, 0, 10],
        PROPERTIES: {
            TYPE: 'shinydestroyerLegion',
            SHOOT_SETTINGS: combineStats([{ reload: 0.1, size: 0.75 }]),
            NO_LIMITATIONS: true,
            INDEPENDENT_CHILDREN: false,
            MAX_CHILDREN: 3,
            IDENTIFIER: 1,
            AUTOFIRE: true,
        }
    }],
    ON: [{
        event: "fire",
        handler: ({ gun }) => {
            gun.setBulletType(["shinydestroyerLegion", "shinygunnerLegion", "shinysprayerLegion", "shinybattleshipLegion", "shinyspawnerLegion"][gun.identifier++ % 5]);
        }
    }],
}
Class.shinylegionaryCrasherFix = {
    PARENT: ["shinyEliteBDN"],
    LABEL: "Shiny Legionary Crasher",
    NAME: "Shiny Legionary Crasher",
    DISPLAY_NAME: false,
    UPGRADE_COLOR: "lightGreen",
    AI: { STRAFE: false, NO_LEAD: false },
    HAS_NO_RECOIL: true,
    VALUE: 2e7,
    SIZE: 80,
    BODY: {
        FOV: 1.5,
        SPEED: 0.1 * base.SPEED,
        HEALTH: 3000,
        DAMAGE: 7 * base.DAMAGE,
    },
    GUNS: [
        ...weaponArray([
            {
                POSITION: [14.5, 13, 1, 0, 0, 0, 0],
            }, {
                POSITION: [3, 13, 1.7, 14.5, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([OGg.trap, OGg.setTrap, OGg.pounder, { reload: 1.9, speed: 2.1, size: 0.75, maxSpeed: 2.1, range: 0.75 }]),
                    TYPE: "shinylegionaryPillbox",
                    NO_LIMITATIONS: true,
                    STAT_CALCULATOR: "trap",
                },
            },
        ], 3),
        ...weaponArray({
            POSITION: [5, 12, 1.6, -11, 0, 0, 0],
        }, 3),
    ],
    TURRETS: [
        {
            POSITION: [12, 0, 0, 0, 360, 1],
            TYPE: "shinylegionaryCrasherTop",
        },
        ...weaponArray({
            POSITION: [14, 8, 0, 60, 180, 0],
            TYPE: ["superSprayerGunBDN", { GUN_STAT_SCALE: { speed: 1.6, health: 1.8, damage: 1.7, resist: 1.5 }, COLOR: -1 }],
        }, 3),
        {
            POSITION: [12, 0, 0, 0, 0, 0],
            TYPE: 'shinylegionaryCrasherSpawnerFix'
        }
    ],
}




Class.shinyElitesBDN = makeMenu("Shiny Elites")
Class.shinyElitesBDN.COLOR = "lightGreen"
Class.shinyElitesBDN.UPGRADE_COLOR = "lightGreen"
Class.shinyElitesBDN.UPGRADES_TIER_0 = ["shinyEliteDestroyerBDN", "shinyEliteGunnerBDN", "shinyEliteSprayerBDN", "shinyEliteBattleshipBDN", "shinyEliteSpawnerBDN", "shinyEliteTrapGuardBDN", "shinyEliteSpinnerBDN", "shinysprayerLegion", "shinylegionaryCrasher", "shinylegionaryCrasherFix"]
Class.shinyElitesBDN.SHAPE = 3.5

// Legendary Elites :money_mouth:
Class.hextupletGunBDN = {
    PARENT: "autoTankGun",
    GUNS: [
        {
            POSITION: [14, 5, 1, 0, -7, 0, 5 / 6],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.autoTurret, OGg.twin, OGg.twin, OGg.power, { reload: 1.3, speed: 1.6, maxspeed: 1.6 }, { reload: 0.8, damage: 1.6, health: 1.6, pen: 1.6 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [14, 5, 1, 0, 7, 0, 2 / 6],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.autoTurret, OGg.twin, OGg.twin, OGg.power, { reload: 1.3, speed: 1.6, maxspeed: 1.6 }, { reload: 0.8, damage: 1.6, health: 1.6, pen: 1.6 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [15, 5, 1, 0, -5, 0, 4 / 6],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.autoTurret, OGg.twin, OGg.twin, OGg.power, { reload: 1.3, speed: 1.6, maxspeed: 1.6 }, { reload: 0.8, damage: 1.6, health: 1.6, pen: 1.6 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [15, 5, 1, 0, 5, 0, 1 / 6],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.autoTurret, OGg.twin, OGg.twin, OGg.power, { reload: 1.3, speed: 1.6, maxspeed: 1.6 }, { reload: 0.8, damage: 1.6, health: 1.6, pen: 1.6 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [16, 5, 1, 0, -3, 0, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.autoTurret, OGg.twin, OGg.twin, OGg.power, { reload: 1.3, speed: 1.6, maxspeed: 1.6 }, { reload: 0.8, damage: 1.6, health: 1.6, pen: 1.6 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [16, 5, 1, 0, 3, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.autoTurret, OGg.twin, OGg.twin, OGg.power, { reload: 1.3, speed: 1.6, maxspeed: 1.6 }, { reload: 0.8, damage: 1.6, health: 1.6, pen: 1.6 }]),
                TYPE: "bullet",
            },
        },
    ],
}
Class.legendaryEliteBDN = {
    PARENT: ["miniboss"],
    LABEL: "Legendary Elite Crasher",
    COLOR: "teal",
    SHAPE: 3,
    SIZE: 30,
    DANGER: 20,
    VARIES_IN_SIZE: true,
    VALUE: 75e4,
    BODY: {
        FOV: 1.25,
        SPEED: 0.125 * base.SPEED,
        HEALTH: 30 * base.HEALTH,
        DAMAGE: 7 * base.DAMAGE,
        REGEN: 2.25 * base.REGEN,
    },
};
Class.legendaryEliteDestroyerBDN = {
    PARENT: ["legendaryEliteBDN"],
    UPGRADE_LABEL: "Legendary Elite Destroyer",
    UPGRADE_COLOR: "teal",
    GUNS: [],
    TURRETS: [
        {
            POSITION: [11, 0, 0, 180, 360, 0],
            TYPE: ["crasherSpawnerlimited"],
        }, {
            POSITION: [11, 0, 0, 60, 360, 0],
            TYPE: ["crasherSpawnerlimited"],
        }, {
            POSITION: [11, 0, 0, -60, 360, 0],
            TYPE: ["crasherSpawnerlimited"],
        }, {
            POSITION: [11, 0, 0, 240, 360, 0],
            TYPE: ["crasherSpawnerlimited"],
        }, {
            POSITION: [11, 0, 0, 120, 360, 0],
            TYPE: ["crasherSpawnerlimited"],
        }, {
            POSITION: [11, 0, 0, 0, 360, 0],
            TYPE: ["crasherSpawnerlimited"],
        }, {
            POSITION: [11, 0, 0, 0, 360, 1],
            TYPE: ["hextupletGunBDN", { INDEPENDENT: true, COLOR: -1 }],
        },
    ],
};
for (let i = 0; i < 3; i++) {
    Class.legendaryEliteDestroyerBDN.GUNS.push(
        {
            POSITION: [6, 3, 1, 6, 9, i * 120 + 67, 2 / 3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.artillery, OGg.pelleter, OGg.twin, OGg.pounder, { reload: 0.3, damage: 3, health: 3, pen: 3 }]),
                TYPE: "bullet",
                LABEL: "Devastator Tertiary",
            },
        },
        {
            POSITION: [6, 3, 1, 6, -9, i * 120 + 53, 2 / 3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.artillery, OGg.pelleter, OGg.twin, OGg.pounder, { reload: 0.3, damage: 3, health: 3, pen: 3 }]),
                TYPE: "bullet",
                LABEL: "Devastator Tertiary",
            },
        },
        {
            POSITION: [7, 3, 1, 6, 8, i * 120 + 67, 1 / 3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.artillery, OGg.pelleter, OGg.twin, OGg.pounder, { reload: 0.3, damage: 3, health: 3, pen: 3 }]),
                TYPE: "bullet",
                LABEL: "Devastator Secondary",
            },
        },
        {
            POSITION: [7, 3, 1, 6, -8, i * 120 + 53, 1 / 3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.artillery, OGg.pelleter, OGg.twin, OGg.pounder, { reload: 0.3, damage: 3, health: 3, pen: 3 }]),
                TYPE: "bullet",
                LABEL: "Devastator Secondary",
            },
        },
    )
    Class.legendaryEliteDestroyerBDN.GUNS.push(
        {
            POSITION: [7, 16, 1, 6, 0, i * 120 + 60, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.pounder, OGg.pounder, OGg.destroyer, { reload: 0.65, damage: 2, health: 2, pen: 2 }]),
                TYPE: "bullet",
                LABEL: "Devastator Primary",
            },
        },
    )
}
Class.legendaryEliteGunnerBDN = {
    PARENT: ["legendaryEliteBDN"],
    UPGRADE_LABEL: "Legendary Elite Gunner",
    UPGRADE_COLOR: "teal",
    FACING_TYPE: "toTarget",
    GUNS: [
        {
            POSITION: [14, 16, 1, 0, 0, 180, 0],
        },
        {
            POSITION: [14, 13, 1, 0, 0, 180, 0],
        }, {
            POSITION: [4, 16, 1.5, 14, 0, 180, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.trap, OGg.hexaTrapper, OGg.setTrap, { reload: 0.8, damage: 1.6, health: 1.6, pen: 1.6 }]),
                TYPE: ["unsetsuperDriverPillboxBDN", { MOTION_TYPE: "glide" }],
                STAT_CALCULATOR: "trap",
            },
        },
        {
            POSITION: [4, 13, 1.5, 14, 0, 180, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.trap, OGg.hexaTrapper, OGg.setTrap, { reload: 0.8, range: 0, damage: 0 }]),
                TYPE: "bullet",
            },
        }, {
            POSITION: [6, 14, -2, 2, 0, 60, 0],
        }, {
            POSITION: [6, 14, -2, 2, 0, 300, 0],
        }, {
            POSITION: [6, 14, -2, 2, 0, 55, 0],
        }, {
            POSITION: [6, 14, -2, 2, 0, 305, 0],
        },
    ],
    AI: { NO_LEAD: false },
    TURRETS: [
        {
            POSITION: [14, 8, 0, 60, 180, 0],
            TYPE: ["pinnerGunBDN"],
        }, {
            POSITION: [14, 8, 0, 300, 180, 0],
            TYPE: ["pinnerGunBDN"],
        },
    ],
};
Class.legendaryEliteSprayerBDN = {
    PARENT: ["legendaryEliteBDN"],
    UPGRADE_LABEL: "Legendary Elite Sprayer",
    UPGRADE_COLOR: "teal",
    SKILL: skillSet({
        rld: 0.7,
        dam: 0.5,
        pen: 0.8,
        str: 0.8,
        spd: 0.2,
        atk: 0.3,
        hlt: 1,
        shi: 0.7,
        rgn: 0.7,
        mob: 1,
    }),
    AI: { NO_LEAD: false },
    HAS_NO_RECOIL: true,
    GUNS: [],
    TURRETS: [
        {
            /*    SIZE         X             Y         ANGLE        ARC */
            POSITION: [6.5, 0, 0, 0, 360, 1],
            TYPE: ["sprayerHexaTurretBDN", { INDEPENDENT: true }],
        }, {
            POSITION: [9, 6, -5, 180, 130, 0],
            TYPE: ["ssuperSprayerGunBDN", { COLOR: "grey" }],
        }, {
            POSITION: [9, 6, 5, 180, 130, 0],
            TYPE: ["ssuperSprayerGunBDN", { COLOR: "grey" }],
        }, {
            POSITION: [9, 6, 5, 60, 130, 0],
            TYPE: ["ssuperSprayerGunBDN", { COLOR: "grey" }],
        }, {
            POSITION: [9, 6, -5, 60, 130, 0],
            TYPE: ["ssuperSprayerGunBDN", { COLOR: "grey" }],
        }, {
            POSITION: [9, 6, 5, -60, 130, 0],
            TYPE: ["ssuperSprayerGunBDN", { COLOR: "grey" }],
        }, {
            POSITION: [9, 6, -5, -60, 130, 0],
            TYPE: ["ssuperSprayerGunBDN", { COLOR: "grey" }],
        },
    ],
};
Class.supercarrierBDN = {
    PARENT: "autoTankGun",
    LABEL: "",
    STAT_NAMES: statnames.swarm,
    FACING_TYPE: "locksFacing",
    BODY: {
        FOV: base.FOV * 1.2,
    },
    GUNS: [
        {
            POSITION: [7, 8, 0.6, 7, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.battleship, OGg.carrier, { reload: 0.8, damage: 1.6, health: 1.6, pen: 1.6 }]),
                TYPE: "swarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [7, 8, 0.6, 7, 2, 30, 0.333],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.battleship, OGg.carrier, { reload: 0.8, damage: 1.6, health: 1.6, pen: 1.6 }]),
                TYPE: "swarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [7, 8, 0.6, 7, -2, -30, 0.333],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.battleship, OGg.carrier, { reload: 0.8, damage: 1.6, health: 1.6, pen: 1.6 }]),
                TYPE: "swarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [7, 8, 0.6, 7, 4, 60, 0.667],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.battleship, OGg.carrier, { reload: 0.8, damage: 1.6, health: 1.6, pen: 1.6 }]),
                TYPE: "swarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [7, 8, 0.6, 7, -4, -60, 0.667],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.battleship, OGg.carrier, { reload: 0.8, damage: 1.6, health: 1.6, pen: 1.6 }]),
                TYPE: "swarm",
                STAT_CALCULATOR: "swarm",
            },
        },
    ],
}
Class.legendaryEliteBattleshipBDN = {
    PARENT: ["legendaryEliteBDN"],
    UPGRADE_LABEL: "Legendary Elite Battleship",
    UPGRADE_COLOR: "teal",
    GUNS: [],
    TURRETS: [
        {
            POSITION: [5, 7.5, 0, 0, 360, 1],
            TYPE: "supercarrierBDN",
        }, {
            POSITION: [5, 7.5, 0, 120, 360, 1],
            TYPE: "supercarrierBDN",
        }, {
            POSITION: [5, 7.5, 0, 240, 360, 1],
            TYPE: "supercarrierBDN",
        },
    ],
};
for (i = 0; i < 3; i++) {
    Class.legendaryEliteBattleshipBDN.GUNS.push(
        {
            POSITION: [4, 5, 0.6, 7, -7.25, i * 120 - 60, 0.25],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.battleship, { reload: 0.9, damage: 1.6, health: 1.6, pen: 1.6 }]),
                TYPE: "autoswarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [4, 5, 0.6, 7, 7.25, i * 120 - 60, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.battleship, { reload: 0.9, damage: 1.6, health: 1.6, pen: 1.6 }]),
                TYPE: "autoswarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [4, 5, 0.6, 7, 2, i * 120 - 60, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.battleship, { reload: 0.9, damage: 1.6, health: 1.6, pen: 1.6 }]),
                TYPE: "autoswarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [4, 5, 0.6, 7, -2, i * 120 - 60, 0.75],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.battleship, { reload: 0.9, damage: 1.6, health: 1.6, pen: 1.6 }]),
                TYPE: "autoswarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [5, 7, 0.6, 7, 0, i * 120 - 60, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.battleship, { reload: 1.1, damage: 2.5, health: 2.5, pen: 2.5 }]),
                TYPE: "autoswarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [5, 7, 0.6, 7, -9.25, i * 120 - 60, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.battleship, { reload: 1.1, damage: 2.5, health: 2.5, pen: 2.5 }]),
                TYPE: "autoswarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [5, 7, 0.6, 7, 9.25, i * 120 - 60, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.battleship, { reload: 1.1, damage: 2.5, health: 2.5, pen: 2.5 }]),
                TYPE: "autoswarm",
                STAT_CALCULATOR: "swarm",
            },
        },
    )
}
Class.legendarySentryBDN = {
    PARENT: ["sentry"],
    COLOR: "teal",
    UPGRADE_COLOR: "teal",
    DANGER: 4,
    SIZE: 12,
    VALUE: 1e5,
    SHAPE: 3,
    BODY: {
        HEALTH: 0.6 * base.HEALTH
    },
};
Class.legendarySentrySwarmBDN = {
    PARENT: ["legendarySentryBDN"],
    UPGRADE_LABEL: "Legendary Swarm Sentry",
    UPGRADE_COLOR: "teal",
    GUNS: [
        {
            POSITION: [7, 8, 0.6, 7, 0, 60, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, { recoil: 0.1 }, { reload: 0.9, damage: 1.1, health: 1.1, pen: 1.1 }]),
                TYPE: "swarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [7, 8, 0.6, 7, 0, 300, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, { recoil: 0.1 }, { reload: 0.9, damage: 1.1, health: 1.1, pen: 1.1 }]),
                TYPE: "swarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [6, 11, 1.3, 7, 0, 180, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, { recoil: 1.15 }, OGg.machineGun, { reload: 0.4, damage: 1.25, health: 1.25, pen: 1.25 }]),
                TYPE: "swarm",
                STAT_CALCULATOR: "swarm",
            },
        },
    ],
};
Class.barricaderAutoTankGunBDN = {
    PARENT: ["genericTank"],
    LABEL: "Turret",
    BODY: {
        FOV: 0.5,
    },
    INDEPENDENT: true,
    CONTROLLERS: ["nearestDifferentMaster"],
    COLOR: "grey",
    AI: {
        SKYNET: true,
        FULL_VIEW: true,
    },
    GUNS: [
        {
            POSITION: [24, 8, 1, 0, 0, 0, 0],
        },
        {
            POSITION: [4, 8, 1.3, 2, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.trap, OGg.minigun, { range: 0.4 }, { reload: 0.2, damage: 1.1, health: 1.1, pen: 1.1 }]),
                TYPE: "trap",
                STAT_CALCULATOR: "trap",
            },
        },
        {
            POSITION: [4, 8, 1.3, 22, 0, 0, 0.25],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.trap, OGg.minigun, { range: 0.4 }, { reload: 0.2, damage: 1.1, health: 1.1, pen: 1.1 }]),
                TYPE: "trap",
                STAT_CALCULATOR: "trap",
            },
        },
        {
            POSITION: [4, 8, 1.3, 18, 0, 0, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.trap, OGg.minigun, { range: 0.4 }, { reload: 0.2, damage: 1.1, health: 1.1, pen: 1.1 }]),
                TYPE: "trap",
                STAT_CALCULATOR: "trap",
            },
        },
        {
            POSITION: [4, 8, 1.3, 14, 0, 0, 0.75],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.trap, OGg.minigun, { range: 0.4 }, { reload: 0.2, damage: 1.1, health: 1.1, pen: 1.1 }]),
                TYPE: "trap",
                STAT_CALCULATOR: "trap",
            },
        },
    ],
};
Class.legendarySentryTrapBDN = makeAuto(Class.legendarySentryBDN, "Sentry", {
    type: Class.barricaderAutoTankGunBDN,
    size: 12,
});
Class.legendarySentryTrapBDN.UPGRADE_LABEL = "Legendary Trap Sentry";
Class.legendarySentryTrapBDN.GUNS = [
    {
        POSITION: [14, 11, 1, 0, 0, 180, 0],
    },
    {
        POSITION: [3, 11, 1.2, 14, 0, 180, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([OGg.trap, OGg.setTrap, { recoil: 1.15 }, { reload: 0.9, damage: 1, health: 1.2, pen: 1.2 }]),
            TYPE: "setTrap",
            STAT_CALCULATOR: "trap",
        },
    },
]
Class.mortarAutoTankgunBDN = {
    PARENT: ["genericTank"],
    LABEL: "Mortar",
    BODY: {
        FOV: 2,
    },
    CONTROLLERS: [
        "canRepel",
        "onlyAcceptInArc",
        "mapAltToFire",
        "nearestDifferentMaster",
    ],
    COLOR: "grey",
    GUNS: [
        {
            POSITION: [16, 3, 1, 0, -6.5, -9, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.pelleter, OGg.artillery, { reload: 0.25, damage: 1.3, health: 1.1, pen: 1.1 }]),
                TYPE: "bullet",
                LABEL: "Tetiary",
            },
        },
        {
            POSITION: [16, 3, 1, 0, 6.5, 9, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.pelleter, OGg.artillery, { reload: 0.25, damage: 1.3, health: 1.1, pen: 1.1 }]),
                TYPE: "bullet",
                LABEL: "Tetiary",
            },
        },
        {
            POSITION: [17, 3, 1, 0, -6, -7, 0.25],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.pelleter, OGg.artillery, { reload: 0.25, damage: 1.3, health: 1.1, pen: 1.1 }]),
                TYPE: "bullet",
                LABEL: "Secondary",
            },
        },
        {
            POSITION: [17, 3, 1, 0, 6, 7, 0.75],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.pelleter, OGg.artillery, { reload: 0.25, damage: 1.3, health: 1.1, pen: 1.1 }]),
                TYPE: "bullet",
                LABEL: "Secondary",
            },
        },
        {
            POSITION: [19, 12, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.pounder, OGg.artillery, { reload: 0.25, damage: 1.3, health: 1.1, pen: 1.1 }]),
                TYPE: "bullet",
                LABEL: "Heavy",
            },
        },
    ],
};
Class.legendarySentryGunBDN = makeAuto(Class.legendarySentryBDN, "Sentry", {
    type: Class.mortarAutoTankgunBDN,
    size: 12,
});
Class.legendarySentryGunBDN.UPGRADE_LABEL = "Legendary Gun Sentry";
Class.legendarySentryGunBDN.TURRETS.push(
    ...weaponArray({
        POSITION: [10, 10, 0, 0, 190, 0],
        TYPE: "ssuperSprayerGunBDN",
    }, 3),
)
Class.legendaryEliteSpawnerBDN = {
    PARENT: ["legendaryEliteBDN"],
    UPGRADE_LABEL: "Legendary Elite Spawner",
    UPGRADE_COLOR: "teal",
    MAX_CHILDREN: 5,
    AI: { STRAFE: false },
    GUNS: [
        {
            POSITION: [11, 16, 1, 0, 0, 60, 0],
        },

        {
            POSITION: [11, 16, 1, 0, 0, 180, 0],
        },

        {
            POSITION: [11, 16, 1, 0, 0, 300, 0],
        }, {
            /*** LENGTH    WIDTH     ASPECT        X             Y         ANGLE     DELAY */
            POSITION: [2, 18, 1, 11, 0, 60, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.drone, OGg.weak, OGg.weak, OGg.weak, { size: 0.4 }, { health: 0.1, reload: 0.75 }]),
                TYPE: ["legendarySentrySwarmBDN", { GIVE_KILL_MESSAGE: false, VARIES_IN_SIZE: false }],
                SYNCS_SKILLS: true,
                AUTOFIRE: true,
                STAT_CALCULATOR: "drone",
            },
        }, {
            POSITION: [2, 18, 1, 11, 0, 180, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.drone, OGg.weak, OGg.weak, OGg.weak, { size: 0.4 }, { health: 0.1, reload: 0.75 }]),
                TYPE: ["legendarySentryTrapBDN", { GIVE_KILL_MESSAGE: false, VARIES_IN_SIZE: false }],
                SYNCS_SKILLS: true,
                AUTOFIRE: true,
                STAT_CALCULATOR: "drone",
            },
        }, {
            POSITION: [2, 18, 1, 11, 0, 300, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.drone, OGg.weak, OGg.weak, OGg.weak, { size: 0.4 }, { health: 0.1, reload: 0.75 }]),
                TYPE: ["legendarySentryGunBDN", { GIVE_KILL_MESSAGE: false, VARIES_IN_SIZE: false }],
                SYNCS_SKILLS: true,
                AUTOFIRE: true,
                STAT_CALCULATOR: "drone",
            },
        },
        {
            POSITION: [13, 10, 1, 0, 0, 60, 0],
        },
        {
            POSITION: [10, 3, 1, 2, -6, 55, 0],
        },
        {
            POSITION: [10, 3, 1, 2, 6, 65, 0],
        },
        {
            POSITION: [7, 3, 1, 4, -8, 50, 0],
        },
        {
            POSITION: [7, 3, 1, 4, 8, 70, 0],
        },


        {
            POSITION: [4, 5, 1.6, 10.25, 0, 180, 0],
        },
        {
            POSITION: [4, 5, 1.6, 9.5, 0, 180, 0],
        },
        {
            POSITION: [4, 5, 1.6, 8.75, 0, 180, 0],
        },
        {
            POSITION: [4, 5, 1.6, 8, 0, 180, 0],
        },

        {
            POSITION: [5, 6, 1.65, 8, 0, 300, 0],
        },
        {
            POSITION: [6, 6, 0.6, 8, 0, 300, 0],
        },
    ],
    TURRETS: [
        {
            POSITION: [11, 0, 0, 0, 360, 1],
            TYPE: ["hextupletGunBDN", { INDEPENDENT: false, COLOR: -1 }],
        },
    ],
};
Class.legendaryEliteTrapGuardTopBDN = {
    PARENT: ["genericTank"],
    COLOR: -1,
    CONTROLLERS: [["spin", { independent: true }]],
    GUNS: [],
};
for (let i = 0; i < 3; i++) {
    Class.legendaryEliteTrapGuardTopBDN.GUNS.push(
        {
            POSITION: [17, 8, 1, 0, 0, 120 * i, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.flankGuard, OGg.minigun, OGg.flankGuard, { reload: 0.8, damage: 1.5, health: 1.5, pen: 1.5 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [15, 8, 1, 0, 0, 120 * i, 0.333],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.flankGuard, OGg.minigun, OGg.flankGuard, { reload: 0.8, damage: 1.5, health: 1.5, pen: 1.5 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [13, 8, 1, 0, 0, 120 * i, 0.667],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.flankGuard, OGg.minigun, OGg.flankGuard, { reload: 0.8, damage: 1.5, health: 1.5, pen: 1.5 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [20, 8, 1, 0, 0, 120 * i + 60, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.flankGuard, OGg.flankGuard, { reload: 1.1, damage: 1.35, health: 1.35, pen: 1.35 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [4, 8, 1.7, 13, 0, 120 * i + 60, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.trap, { reload: 1.1, damage: 1.35, health: 1.35, pen: 1.35 }]),
                TYPE: "trap",
                STAT_CALCULATOR: "trap",
            },
        },
    )
};
Class.legendaryEliteTrapGuardBDN = {
    PARENT: ["legendaryEliteBDN"],
    UPGRADE_LABEL: "Legendary Elite Trap Guard",
    UPGRADE_COLOR: "teal",
    AI: { STRAFE: false },
    GUNS: [],
    TURRETS: [
        {
            POSITION: [9.5, 0, 0, 0, 360, 1],
            TYPE: "legendaryEliteTrapGuardTopBDN",
        },
    ],
};
for (let i = 0; i < 3; i++) {
    Class.legendaryEliteTrapGuardBDN.GUNS.push(
        {
            POSITION: [10.5, 8, 1, 0, 0, 120 * i + 60, 0],
        },
        {
            POSITION: [2, 8, 1.4, 10.5, 0, 120 * i + 60, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.trap, OGg.setTrap, { reload: 1.5, damage: 1.6, health: 1.6, pen: 1.6 }]),
                TYPE: "unsetPillbox",
                MAX_CHILDREN: 5,
                STAT_CALCULATOR: "trap",
            },
        },
        {
            POSITION: [9, 10, 1, 0, 0, 120 * i + 60, 0],
        },
    )
    Class.legendaryEliteTrapGuardBDN.TURRETS.push(
        {
            POSITION: [5.5, 8, -9, 120 * i + 60, 160, 0],
            TYPE: ["bruiserGunBDN", { INDEPENDENT: false, }],
        }, {
        POSITION: [5.5, 8, 9, 120 * i + 60, 160, 0],
        TYPE: ["bruiserGunBDN", { INDEPENDENT: false, }],
    },
    )
};
Class.legendaryEliteSpinnerCycloneBDN = {
    PARENT: ["genericTank"],
    COLOR: -1,
    CONTROLLERS: [["spin", { speed: 0.1, independent: true }]],
    GUNS: [],
};
for (let i = 0; i < 8; i++) {
    Class.legendaryEliteSpinnerCycloneBDN.GUNS.push(
        {
            POSITION: [18, 8, 1, 0, 0, (45 * i), 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.flankGuard, { reload: 0.5, speed: 1.5, maxSpeed: 1.5, damage: 1.6, health: 1.6, pen: 1.6 }]),
                TYPE: "bullet",
            },
        },
    )
};
for (let i = 0; i < 4; i++) {
    Class.legendaryEliteSpinnerCycloneBDN.GUNS.push(
        {
            POSITION: [15, 3, 1, 0, 0, (90 * i) + 30, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.gunner, { reload: 0.7, speed: 2.5, maxSpeed: 1.3, damage: 1.6, health: 1.6, pen: 1.6 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [15, 3, 1, 0, 0, (90 * i) - 30, 1 / 2],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.gunner, { reload: 0.7, speed: 2.5, maxSpeed: 1.3, damage: 1.6, health: 1.6, pen: 1.6 }]),
                TYPE: "bullet",
            },
        },
    )
};
Class.legendaryEliteSpinnerBDN = {
    PARENT: ["legendaryEliteBDN"],
    UPGRADE_LABEL: "Legendary Elite Spinner",
    UPGRADE_COLOR: "teal",
    SKILL: skillSet({
        rld: 0.7,
        dam: 0.5,
        pen: 0.8,
        str: 0.8,
        spd: 0.2,
        atk: 0.3,
        hlt: 1,
        shi: 0.7,
        rgn: 0.7,
        mob: 1,
    }),
    AI: { STRAFE: false },
    FACING_TYPE: ["spin", { speed: 0.1 }],
    GUNS: [],
    TURRETS: [
        {
            POSITION: [9.5, 0, 0, 0, 360, 1],
            TYPE: ["legendaryEliteSpinnerCycloneBDN", { COLOR: -1 }],
        },
    ],
};
for (let i = 0; i < 3; i++) {
    Class.legendaryEliteSpinnerBDN.GUNS.push(
        {
            POSITION: [8.5, 1.25, 1, -1.5, 11.5, 120 * i + 10, 8 / 10],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.twin, OGg.gunner, { speed: 1.3, maxSpeed: 1.3, reload: 0.75, damage: 1.5, health: 1.5, pen: 1.5 }]),
                TYPE: "bullet",
            },
        }, {
        POSITION: [8.5, 1.25, 1, 2, 9, 120 * i + 10, 6 / 10],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([OGg.basic, OGg.twin, OGg.gunner, { speed: 1.3, maxSpeed: 1.3, reload: 0.75, damage: 1.5, health: 1.5, pen: 1.5 }]),
            TYPE: "bullet",
        },
    }, {
        POSITION: [8.5, 1.25, 1, 3.5, 6.5, 120 * i + 10, 4 / 10],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([OGg.basic, OGg.twin, OGg.gunner, { speed: 1.3, maxSpeed: 1.3, reload: 0.75, damage: 1.5, health: 1.5, pen: 1.5 }]),
            TYPE: "bullet",
        },
    }, {
        POSITION: [8.5, 1.25, 1, 6, 4, 120 * i + 10, 2 / 10],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([OGg.basic, OGg.twin, OGg.gunner, { speed: 1.3, maxSpeed: 1.3, reload: 0.75, damage: 1.5, health: 1.5, pen: 1.5 }]),
            TYPE: "bullet",
        },
    }, {
        POSITION: [8.5, 1.25, 1, 8.5, 1.5, 120 * i + 10, 0 / 10],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([OGg.basic, OGg.twin, OGg.gunner, { speed: 1.3, maxSpeed: 1.3, reload: 0.75, damage: 1.5, health: 1.5, pen: 1.5 }]),
            TYPE: "bullet",
        },
    },
        {
            POSITION: [7, 2, 1, -1.5, 11.5, 120 * i + 10, 1],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.twin, OGg.gunner, { speed: 1.3, maxSpeed: 1.3, reload: 0.75, damage: 1.5, health: 1.5, pen: 1.5 }]),
                TYPE: "bullet",
            },
        }, {
        POSITION: [7, 2, 1, 2, 9, 120 * i + 10, 4 / 5],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([OGg.basic, OGg.twin, OGg.gunner, { speed: 1.3, maxSpeed: 1.3, reload: 0.75, damage: 1.5, health: 1.5, pen: 1.5 }]),
            TYPE: "bullet",
        },
    }, {
        POSITION: [7, 2, 1, 3.5, 6.5, 120 * i + 10, 3 / 5],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([OGg.basic, OGg.twin, OGg.gunner, { speed: 1.3, maxSpeed: 1.3, reload: 0.75, damage: 1.5, health: 1.5, pen: 1.5 }]),
            TYPE: "bullet",
        },
    }, {
        POSITION: [7, 2, 1, 6, 4, 120 * i + 10, 2 / 5],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([OGg.basic, OGg.twin, OGg.gunner, { speed: 1.3, maxSpeed: 1.3, reload: 0.75, damage: 1.5, health: 1.5, pen: 1.5 }]),
            TYPE: "bullet",
        },
    }, {
        POSITION: [7, 2, 1, 8.5, 1.5, 120 * i + 10, 1 / 5],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([OGg.basic, OGg.twin, OGg.gunner, { speed: 1.3, maxSpeed: 1.3, reload: 0.75, damage: 1.5, health: 1.5, pen: 1.5 }]),
            TYPE: "bullet",
        },
    }, {
        POSITION: [2, 20, 0.75, 8, 0, 120 * i + 60, 0],
    },
    )
};







// Legions
Class.legendarydestroyerLegion = {
    PARENT: ["legendaryEliteBDN"],
    UPGRADE_LABEL: "Legendary Destroyer Legion",
    NAME: "Legendary Destroyer Legion",
    DISPLAY_NAME: false,
    UPGRADE_COLOR: "teal",
    AI: { NO_LEAD: false },
    SIZE: 30,
    GUNS: [],
    BODY: {
        HEALTH: 20 * base.HEALTH,
    },
    TURRETS: [
        {
            POSITION: [11, 0, 0, 180, 360, 0],
            TYPE: ["crasherSpawnerlimited", { GUN_STAT_SCALE: { health: 1.1 } }],
        }, {
            POSITION: [11, 0, 0, 60, 360, 0],
            TYPE: ["crasherSpawnerlimited", { GUN_STAT_SCALE: { health: 1.1 } }],
        }, {
            POSITION: [11, 0, 0, -60, 360, 0],
            TYPE: ["crasherSpawnerlimited", { GUN_STAT_SCALE: { health: 1.1 } }],
        }, {
            POSITION: [11, 0, 0, 240, 360, 0],
            TYPE: ["crasherSpawnerlimited", { GUN_STAT_SCALE: { health: 1.1 } }],
        }, {
            POSITION: [11, 0, 0, 120, 360, 0],
            TYPE: ["crasherSpawnerlimited", { GUN_STAT_SCALE: { health: 1.1 } }],
        }, {
            POSITION: [11, 0, 0, 0, 360, 0],
            TYPE: ["crasherSpawnerlimited", { GUN_STAT_SCALE: { health: 1.1 } }],
        }, {
            POSITION: [11, 0, 0, 0, 360, 1],
            TYPE: ["hextupletGunBDN", { GUN_STAT_SCALE: { health: 1.1 }, INDEPENDENT: true, COLOR: -1 }],
        },
    ],
};
for (let i = 0; i < 3; i++) {
    Class.legendarydestroyerLegion.GUNS.push(
        {
            POSITION: [6, 3, 1, 6, 9, i * 120 + 67, 2 / 3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.artillery, OGg.pelleter, OGg.pounder, { reload: 0.3, damage: 3, health: 3.3, pen: 3 }]),
                TYPE: "bullet",
                LABEL: "Devastator Secondary",
            },
        },
        {
            POSITION: [6, 3, 1, 6, -9, i * 120 + 53, 2 / 3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.artillery, OGg.pelleter, OGg.pounder, { reload: 0.3, damage: 3, health: 3.3, pen: 3 }]),
                TYPE: "bullet",
                LABEL: "Devastator Secondary",
            },
        },
        {
            POSITION: [7, 3, 1, 6, 8, i * 120 + 67, 1 / 3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.artillery, OGg.pelleter, OGg.pounder, { reload: 0.3, damage: 3, health: 3.3, pen: 3 }]),
                TYPE: "bullet",
                LABEL: "Devastator Secondary",
            },
        },
        {
            POSITION: [7, 3, 1, 6, -8, i * 120 + 53, 1 / 3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.artillery, OGg.pelleter, OGg.pounder, { reload: 0.3, damage: 3, health: 3.3, pen: 3 }]),
                TYPE: "bullet",
                LABEL: "Devastator Secondary",
            },
        },
    )
    Class.legendarydestroyerLegion.GUNS.push(
        {
            POSITION: [7, 16, 1, 6, 0, i * 120 + 60, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.pounder, OGg.pounder, OGg.destroyer, { reload: 0.9, damage: 2, health: 2.2, pen: 2 }]),
                TYPE: "bullet",
                LABEL: "Devastator Primary",
            },
        },
    )
}
Class.legendarygunnerLegion = {
    PARENT: ["legendaryEliteBDN"],
    UPGRADE_LABEL: "Legendary Gunner Legion",
    NAME: "Legendary Gunner Legion",
    DISPLAY_NAME: false,
    UPGRADE_COLOR: "teal",
    FACING_TYPE: "toTarget",
    AI: { NO_LEAD: false },
    SIZE: 30,
    BODY: {
        HEALTH: 20 * base.HEALTH,
    },
    GUNS: [
        {
            POSITION: [14, 16, 1, 0, 0, 180, 0],
        },
        {
            POSITION: [14, 13, 1, 0, 0, 180, 0],
        }, {
            POSITION: [4, 16, 1.5, 14, 0, 180, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.trap, OGg.hexaTrapper, OGg.setTrap, { reload: 0.8, damage: 1.6, health: 1.8, pen: 1.6 }]),
                TYPE: ["unsetsuperDriverPillboxBDN", { MOTION_TYPE: "glide" }],
                STAT_CALCULATOR: "trap",
            },
        },
        {
            POSITION: [4, 13, 1.5, 14, 0, 180, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.trap, OGg.hexaTrapper, OGg.setTrap, { reload: 0.8, range: 0, damage: 0, health: 1.1 }]),
                TYPE: "bullet",
            },
        }, {
            POSITION: [6, 14, -2, 2, 0, 60, 0],
        }, {
            POSITION: [6, 14, -2, 2, 0, 300, 0],
        }, {
            POSITION: [6, 14, -2, 2, 0, 55, 0],
        }, {
            POSITION: [6, 14, -2, 2, 0, 305, 0],
        },
    ],
    AI: { NO_LEAD: false },
    TURRETS: [
        {
            POSITION: [14, 8, 0, 60, 180, 0],
            TYPE: ["pinnerGunBDN", { GUN_STAT_SCALE: { health: 1.15 } }],
        }, {
            POSITION: [14, 8, 0, 300, 180, 0],
            TYPE: ["pinnerGunBDN", { GUN_STAT_SCALE: { health: 1.15 } }],
        },
    ],
}
Class.legendarysprayerLegion = {
    PARENT: ["legendaryEliteBDN"],
    UPGRADE_LABEL: "Legendary Sprayer Legion",
    NAME: "Legendary Sprayer Legion",
    DISPLAY_NAME: false,
    UPGRADE_COLOR: "teal",
    AI: { NO_LEAD: false },
    SIZE: 30,
    SKILL: [0, 9, 3, 9, 2, 9, 9, 9, 9, 0],
    HAS_NO_RECOIL: true,
    BODY: {
        HEALTH: 20 * base.HEALTH,
    },
    TURRETS: weaponArray({
        POSITION: [14, 6, 0, 60, 190, 0],
        TYPE: ["machineGunner", { GUN_STAT_SCALE: { health: 1.8, damage: 1.9, speed: 1.9, resist: 1.15 }, COLOR: -1 }],
    }, 3)
}
Class.legendarybattleshipLegion = {
    PARENT: ["legendaryEliteBDN"],
    UPGRADE_LABEL: "Legendary Battleship Legion",
    NAME: "Legendary Battleship Legion",
    DISPLAY_NAME: false,
    UPGRADE_COLOR: "teal",
    AI: { NO_LEAD: false },
    SIZE: 20,
    BODY: {
        HEALTH: 32 * base.HEALTH,
    },
    GUNS: [],
    TURRETS: [
        {
            POSITION: [5, 7.5, 0, 0, 360, 1],
            TYPE: ["autoTankGun", { GUN_STAT_SCALE: { health: 1.1 }, INDEPENDENT: true, COLOR: -1, PARENT: "carrier" }],
        }, {
            POSITION: [5, 7.5, 0, 120, 360, 1],
            TYPE: ["autoTankGun", { GUN_STAT_SCALE: { health: 1.1 }, INDEPENDENT: true, COLOR: -1, PARENT: "carrier" }],
        }, {
            POSITION: [5, 7.5, 0, 240, 360, 1],
            TYPE: ["autoTankGun", { GUN_STAT_SCALE: { health: 1.1 }, INDEPENDENT: true, COLOR: -1, PARENT: "carrier" }],
        },
    ],
};
for (i = 0; i < 3; i++) {
    Class.legendarybattleshipLegion.GUNS.push(
        {
            POSITION: [4, 5, 0.6, 7, -9.25, i * 120 - 60, 0.25],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.battleship, { reload: 0.85, damage: 1.7, health: 1.7, pen: 1.7 }]),
                TYPE: "autoswarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [4, 5, 0.6, 7, 9.25, i * 120 - 60, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.battleship, { reload: 0.85, damage: 1.7, health: 1.7, pen: 1.7 }]),
                TYPE: "autoswarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [4, 5, 0.6, 7, 5, i * 120 - 60, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.battleship, { reload: 0.85, damage: 1.7, health: 1.7, pen: 1.7 }]),
                TYPE: "autoswarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [4, 5, 0.6, 7, -5, i * 120 - 60, 0.75],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.battleship, { reload: 0.85, damage: 1.7, health: 1.7, pen: 1.7 }]),
                TYPE: "autoswarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [5, 7, 0.6, 7, 0, i * 120 - 60, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.battleship, { reload: 1.1, damage: 2.7, health: 2.7, pen: 2.7 }]),
                TYPE: "autoswarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [5, 7, 0.6, 7, -9.25, i * 120 - 60, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.battleship, { reload: 1.1, damage: 2.7, health: 2.7, pen: 2.7 }]),
                TYPE: "autoswarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [5, 7, 0.6, 7, 9.25, i * 120 - 60, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.battleship, { reload: 1.1, damage: 2.7, health: 2.7, pen: 2.7 }]),
                TYPE: "autoswarm",
                STAT_CALCULATOR: "swarm",
            },
        },
    )
}
Class.legendaryspawnerLegion = {
    PARENT: ["legendaryEliteBDN"],
    UPGRADE_LABEL: "Legendary Spawner Legion",
    NAME: "Legendary Spawner Legion",
    DISPLAY_NAME: false,
    UPGRADE_COLOR: "teal",
    AI: { NO_LEAD: false },
    SIZE: 30,
    BODY: {
        HEALTH: 20 * base.HEALTH,
    },
    GUNS: [
        {
            POSITION: [11, 16, 1, 0, 0, 60, 0],
        },

        {
            POSITION: [11, 16, 1, 0, 0, 180, 0],
        },

        {
            POSITION: [11, 16, 1, 0, 0, 300, 0],
        }, {
            /*** LENGTH    WIDTH     ASPECT        X             Y         ANGLE     DELAY */
            POSITION: [2, 18, 1, 11, 0, 60, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.drone, OGg.weak, OGg.weak, OGg.weak, { size: 0.4 }, { health: 0.25, reload: 0.75 }]),
                TYPE: ["legendarySentrySwarmBDN", { GIVE_KILL_MESSAGE: false, VARIES_IN_SIZE: false }],
                SYNCS_SKILLS: true,
                AUTOFIRE: true,
                STAT_CALCULATOR: "drone",
            },
        }, {
            POSITION: [2, 18, 1, 11, 0, 180, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.drone, OGg.weak, OGg.weak, OGg.weak, { size: 0.4 }, { health: 0.25, reload: 0.75 }]),
                TYPE: ["legendarySentryTrapBDN", { GIVE_KILL_MESSAGE: false, VARIES_IN_SIZE: false }],
                SYNCS_SKILLS: true,
                AUTOFIRE: true,
                STAT_CALCULATOR: "drone",
            },
        }, {
            POSITION: [2, 18, 1, 11, 0, 300, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.drone, OGg.weak, OGg.weak, OGg.weak, { size: 0.4 }, { health: 0.25, reload: 0.75 }]),
                TYPE: ["legendarySentryGunBDN", { GIVE_KILL_MESSAGE: false, VARIES_IN_SIZE: false }],
                SYNCS_SKILLS: true,
                AUTOFIRE: true,
                STAT_CALCULATOR: "drone",
            },
        },
        {
            POSITION: [13, 10, 1, 0, 0, 60, 0],
        },
        {
            POSITION: [10, 3, 1, 2, -6, 55, 0],
        },
        {
            POSITION: [10, 3, 1, 2, 6, 65, 0],
        },
        {
            POSITION: [7, 3, 1, 4, -8, 50, 0],
        },
        {
            POSITION: [7, 3, 1, 4, 8, 70, 0],
        },


        {
            POSITION: [4, 5, 1.6, 10.25, 0, 180, 0],
        },
        {
            POSITION: [4, 5, 1.6, 9.5, 0, 180, 0],
        },
        {
            POSITION: [4, 5, 1.6, 8.75, 0, 180, 0],
        },
        {
            POSITION: [4, 5, 1.6, 8, 0, 180, 0],
        },

        {
            POSITION: [5, 6, 1.65, 8, 0, 300, 0],
        },
        {
            POSITION: [6, 6, 0.6, 8, 0, 300, 0],
        },
    ],
    TURRETS: [
        {
            POSITION: [11, 0, 0, 0, 360, 1],
            TYPE: ["hextupletGunBDN", { GUN_STAT_SCALE: { health: 1.15 }, INDEPENDENT: false, COLOR: -1 }],
        },
    ],
}
// Legionary Crasher
Class.legendarylegionaryCrasherTop = {
    PARENT: ["legendaryEliteBDN"],
    AI: { STRAFE: false, NO_LEAD: false },
    CONTROLLERS: [["spin", { independent: true, speed: -0.005 }]],
    INDEPENDENT: true,
    DISPLAY_NAME: false,
    GUNS: weaponArray([
        {
            POSITION: [4, 6, 0.7, 7, 0, 60, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.pounder, { speed: 2.3, maxSpeed: 2, size: 0.9, range: 3 }]),
                TYPE: ["swarm", { INDEPENDENT: true }],
                STAT_CALCULATOR: "swarm",
                AUTOFIRE: true,

            },
        },
        {
            POSITION: [3.5, 6, 0.7, 7, 5, 60, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.pounder, { speed: 2.3, maxSpeed: 2, size: 0.9, range: 3 }]),
                TYPE: ["swarm", { INDEPENDENT: true }],
                STAT_CALCULATOR: "swarm",
                AUTOFIRE: true,

            },
        }, {
            POSITION: [3.5, 6, 0.7, 7, -5, 60, 1 / 4],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.pounder, { speed: 2.3, maxSpeed: 2, size: 0.9, range: 3 }]),
                TYPE: ["swarm", { INDEPENDENT: true }],
                STAT_CALCULATOR: "swarm",
                AUTOFIRE: true,
            },
        }, {
            POSITION: [3, 6, 0.7, 7, -2.5, 60, 2 / 4],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.pounder, { speed: 2.3, maxSpeed: 2, size: 0.9, range: 3 }]),
                TYPE: ["swarm", { INDEPENDENT: true }],
                STAT_CALCULATOR: "swarm",
                AUTOFIRE: true,
            },
        }, {
            POSITION: [3, 6, 0.7, 7, 2.5, 60, 3 / 4],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.pounder, { speed: 2.3, maxSpeed: 2, size: 0.9, range: 3 }]),
                TYPE: ["swarm", { INDEPENDENT: true }],
                STAT_CALCULATOR: "swarm",
                AUTOFIRE: true,
            },
        },
    ], 3),
    TURRETS: weaponArray({
        POSITION: [9.5, 10, 0, 0, 190, 0],
        TYPE: ["hextupletGunBDN", { GUN_STAT_SCALE: { damage: 1.7, health: 1.4, speed: 1.5, maxSpeed: 1.5, resist: 1.1, range: 1.6 } }],
    }, 3),
}
Class.legendarylegionaryCrasherSpawner = {
    PARENT: 'genericTank',
    SHAPE: "",
    INDEPENDENT: true,
    GUNS: [{
        POSITION: [0, 10, 0, 0, 0, 0, 10],
        PROPERTIES: {
            TYPE: 'legendarydestroyerLegion',
            SHOOT_SETTINGS: combineStats([{ reload: 0.1 }]),
            NO_LIMITATIONS: true,
            INDEPENDENT_CHILDREN: true,
            MAX_CHILDREN: 1,
            IDENTIFIER: 1,
            AUTOFIRE: true,
        }
    }],
    ON: [{
        event: "fire",
        handler: ({ gun }) => {
            gun.setBulletType(["legendarydestroyerLegion", "legendarygunnerLegion", "legendarysprayerLegion", "legendarybattleshipLegion", "legendaryspawnerLegion"][gun.identifier++ % 5]);
        }
    }],
}
Class.legendarylegionaryCrasher = {
    PARENT: ["legendaryEliteBDN"],
    LABEL: "Legendary Legionary Crasher",
    NAME: "Legendary Legionary Crasher",
    DISPLAY_NAME: false,
    UPGRADE_COLOR: "teal",
    AI: { STRAFE: false, NO_LEAD: false },
    HAS_NO_RECOIL: true,
    VALUE: 1e8,
    SIZE: 90,
    BODY: {
        FOV: 1.5,
        SPEED: 0.1 * base.SPEED,
        HEALTH: 5000,
        DAMAGE: 15 * base.DAMAGE,
    },
    GUNS: [
        ...weaponArray([
            {
                POSITION: [14.5, 13, 1, 0, 0, 0, 0],
            }, {
                POSITION: [3, 13, 1.7, 14.5, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([OGg.trap, OGg.setTrap, OGg.pounder, { reload: 1.9, speed: 2.5, size: 0.8, maxSpeed: 2.4, range: 0.9 }]),
                    TYPE: "legendarylegionaryPillbox",
                    NO_LIMITATIONS: true,
                    STAT_CALCULATOR: "trap",
                },
            },
        ], 3),
        ...weaponArray({
            POSITION: [5, 12, 1.6, -11, 0, 0, 0],
        }, 3),
    ],
    TURRETS: [
        {
            POSITION: [12, 0, 0, 0, 360, 1],
            TYPE: "legendarylegionaryCrasherTop",
        },
        ...weaponArray({
            POSITION: [14, 8, 0, 60, 180, 0],
            TYPE: ["ssuperSprayerGunBDN", { GUN_STAT_SCALE: { speed: 1.9, health: 2.2, damage: 2, resist: 1.5 }, COLOR: -1 }],
        }, 3),
        {
            POSITION: [12, 0, 0, 0, 0, 0],
            TYPE: 'legendarylegionaryCrasherSpawner'
        }
    ],
}
Class.legendarylegionaryCrasherSpawnerFix = {
    PARENT: 'genericTank',
    SHAPE: "",
    INDEPENDENT: true,
    GUNS: [{
        POSITION: [0, 10, 0, 0, 0, 0, 10],
        PROPERTIES: {
            TYPE: 'legendarydestroyerLegion',
            SHOOT_SETTINGS: combineStats([{ reload: 0.1, size: 0.75 }]),
            NO_LIMITATIONS: true,
            INDEPENDENT_CHILDREN: false,
            MAX_CHILDREN: 5,
            IDENTIFIER: 1,
            AUTOFIRE: true,
        }
    }],
    ON: [{
        event: "fire",
        handler: ({ gun }) => {
            gun.setBulletType(["legendarydestroyerLegion", "legendarygunnerLegion", "legendarysprayerLegion", "legendarybattleshipLegion", "legendaryspawnerLegion"][gun.identifier++ % 5]);
        }
    }],
}
Class.legendarylegionaryCrasherFix = {
    PARENT: ["legendaryEliteBDN"],
    LABEL: "Legendary Legionary Crasher",
    NAME: "Legendary Legionary Crasher",
    DISPLAY_NAME: false,
    UPGRADE_COLOR: "teal",
    AI: { STRAFE: false, NO_LEAD: false },
    HAS_NO_RECOIL: true,
    VALUE: 1e8,
    SIZE: 90,
    BODY: {
        FOV: 1.5,
        SPEED: 0.1 * base.SPEED,
        HEALTH: 5000,
        DAMAGE: 15 * base.DAMAGE,
    },
    GUNS: [
        ...weaponArray([
            {
                POSITION: [14.5, 13, 1, 0, 0, 0, 0],
            }, {
                POSITION: [3, 13, 1.7, 14.5, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([OGg.trap, OGg.setTrap, OGg.pounder, { reload: 1.9, speed: 2.4, size: 0.9, maxSpeed: 2.4, range: 0.9 }]),
                    TYPE: "legendarylegionaryPillbox",
                    NO_LIMITATIONS: true,
                    STAT_CALCULATOR: "trap",
                },
            },
        ], 3),
        ...weaponArray({
            POSITION: [5, 12, 1.6, -11, 0, 0, 0],
        }, 3),
    ],
    TURRETS: [
        {
            POSITION: [12, 0, 0, 0, 360, 1],
            TYPE: "legendarylegionaryCrasherTop",
        },
        ...weaponArray({
            POSITION: [14, 8, 0, 60, 180, 0],
            TYPE: ["ssuperSprayerGunBDN", { GUN_STAT_SCALE: { speed: 1.9, health: 2.1, damage: 2, resist: 1.5 }, COLOR: -1 }],
        }, 3),
        {
            POSITION: [12, 0, 0, 0, 0, 0],
            TYPE: 'legendarylegionaryCrasherSpawnerFix'
        }
    ],
}



Class.legendaryElitesBDN = makeMenu("Legendary Elites")
Class.legendaryElitesBDN.COLOR = "teal"
Class.legendaryElitesBDN.UPGRADE_COLOR = "teal"
Class.legendaryElitesBDN.UPGRADES_TIER_0 = ["legendaryEliteDestroyerBDN", "legendaryEliteGunnerBDN", "legendaryEliteSprayerBDN", "legendaryEliteBattleshipBDN", "legendaryEliteSpawnerBDN", "legendaryEliteTrapGuardBDN", "legendaryEliteSpinnerBDN", "legendarysprayerLegion", "legendarylegionaryCrasher", "legendarylegionaryCrasherFix"]
Class.legendaryElitesBDN.SHAPE = 3.5
Class.shinyElitesBDN.UPGRADES_TIER_0.push("legendaryElitesBDN")


















































































// Shadow Elites :money_mouth:
Class.heptupletGunBDN = {
    PARENT: "autoTankGun",
    GUNS: [
        {
            POSITION: [14, 5, 1, 0, -7, 0, 6 / 7],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.autoTurret, OGg.twin, OGg.twin, OGg.power, { reload: 1.3, speed: 1.9, maxspeed: 1.9 }, { reload: 0.7, damage: 1.9, health: 1.9, pen: 1.9 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [14, 5, 1, 0, 7, 0, 3 / 7],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.autoTurret, OGg.twin, OGg.twin, OGg.power, { reload: 1.3, speed: 1.9, maxspeed: 1.9 }, { reload: 0.7, damage: 1.9, health: 1.9, pen: 1.9 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [15, 5, 1, 0, -5, 0, 5 / 7],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.autoTurret, OGg.twin, OGg.twin, OGg.power, { reload: 1.3, speed: 1.9, maxspeed: 1.9 }, { reload: 0.7, damage: 1.9, health: 1.9, pen: 1.9 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [15, 5, 1, 0, 5, 0, 2 / 7],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.autoTurret, OGg.twin, OGg.twin, OGg.power, { reload: 1.3, speed: 1.9, maxspeed: 1.9 }, { reload: 0.7, damage: 1.9, health: 1.9, pen: 1.9 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [16, 5, 1, 0, -3, 0, 4 / 7],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.autoTurret, OGg.twin, OGg.twin, OGg.power, { reload: 1.3, speed: 1.9, maxspeed: 1.9 }, { reload: 0.7, damage: 1.9, health: 1.9, pen: 1.9 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [16, 5, 1, 0, 3, 0, 1 / 7],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.autoTurret, OGg.twin, OGg.twin, OGg.power, { reload: 1.3, speed: 1.9, maxspeed: 1.9 }, { reload: 0.7, damage: 1.9, health: 1.9, pen: 1.9 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [17, 6, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.autoTurret, OGg.twin, OGg.twin, OGg.power, { reload: 1.3, speed: 1.9, maxspeed: 1.9 }, { reload: 0.7, damage: 1.9, health: 1.9, pen: 1.9 }]),
                TYPE: "bullet",
            },
        },
    ],
}
Class.shadowEliteBDN = {
    PARENT: ["miniboss"],
    LABEL: "Shadow Elite Crasher",
    COLOR: "darkGrey",
    SHAPE: 3,
    ALPHA: 0.3,
    SIZE: 33,
    DANGER: 40,
    VARIES_IN_SIZE: true,
    VALUE: 13e5,
    BODY: {
        FOV: 1.25,
        SPEED: 0.125 * base.SPEED,
        HEALTH: 40 * base.HEALTH,
        DAMAGE: 9 * base.DAMAGE,
        REGEN: 3 * base.REGEN,
    },
};
Class.shadowEliteDestroyerBDN = {
    PARENT: ["shadowEliteBDN"],
    UPGRADE_LABEL: "Shadow Elite Destroyer",
    UPGRADE_COLOR: "darkGrey",
    GUNS: [],
    TURRETS: [
        {
            POSITION: [11, 0, 0, 180, 360, 0],
            TYPE: ["crasherSpawnerlimited"],
        }, {
            POSITION: [11, 0, 0, 60, 360, 0],
            TYPE: ["crasherSpawnerlimited"],
        }, {
            POSITION: [11, 0, 0, -60, 360, 0],
            TYPE: ["crasherSpawnerlimited"],
        }, {
            POSITION: [11, 0, 0, 240, 360, 0],
            TYPE: ["crasherSpawnerlimited"],
        }, {
            POSITION: [11, 0, 0, 120, 360, 0],
            TYPE: ["crasherSpawnerlimited"],
        }, {
            POSITION: [11, 0, 0, 0, 360, 0],
            TYPE: ["crasherSpawnerlimited"],
        }, {
            POSITION: [11, 0, 0, 0, 360, 1],
            TYPE: ["heptupletGunBDN", { INDEPENDENT: true, COLOR: -1 }],
        },
    ],
};
for (let i = 0; i < 3; i++) {
    Class.shadowEliteDestroyerBDN.GUNS.push(
        {
            POSITION: [6, 3, 1, 6, 9, i * 120 + 67, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.artillery, OGg.pelleter, OGg.twin, OGg.pounder, { reload: 0.3, damage: 4, health: 4, pen: 4 }]),
                TYPE: "bullet",
                LABEL: "Devastator Tertiary",
            },
        },
        {
            POSITION: [6, 3, 1, 6, -9, i * 120 + 53, 0.75],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.artillery, OGg.pelleter, OGg.twin, OGg.pounder, { reload: 0.3, damage: 4, health: 4, pen: 4 }]),
                TYPE: "bullet",
                LABEL: "Devastator Tertiary",
            },
        },
        {
            POSITION: [7, 3, 1, 6, 8, i * 120 + 67, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.artillery, OGg.pelleter, OGg.twin, OGg.pounder, { reload: 0.3, damage: 4, health: 4, pen: 4 }]),
                TYPE: "bullet",
                LABEL: "Devastator Secondary",
            },
        },
        {
            POSITION: [7, 3, 1, 6, -8, i * 120 + 53, 0.75],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.artillery, OGg.pelleter, OGg.twin, OGg.pounder, { reload: 0.3, damage: 4, health: 4, pen: 4 }]),
                TYPE: "bullet",
                LABEL: "Devastator Secondary",
            },
        },
        {
            POSITION: [8, 3, 1, 6, 7, i * 120 + 67, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.artillery, OGg.pelleter, OGg.twin, OGg.pounder, { reload: 0.3, damage: 4, health: 4, pen: 4 }]),
                TYPE: "bullet",
                LABEL: "Devastator Secondary",
            },
        },
        {
            POSITION: [8, 3, 1, 6, -7, i * 120 + 53, 0.75],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.artillery, OGg.pelleter, OGg.twin, OGg.pounder, { reload: 0.3, damage: 4, health: 4, pen: 4 }]),
                TYPE: "bullet",
                LABEL: "Devastator Secondary",
            },
        },
    )
    Class.shadowEliteDestroyerBDN.GUNS.push(
        {
            POSITION: [7, 16, 1, 6, 0, i * 120 + 60, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.pounder, OGg.pounder, OGg.destroyer, { reload: 0.55, damage: 2, health: 2, pen: 2 }]),
                TYPE: "bullet",
                LABEL: "Devastator Primary",
            },
        },
    )
}
Class.shadowEliteGunnerBDN = {
    PARENT: ["shadowEliteBDN"],
    UPGRADE_LABEL: "Shadow Elite Gunner",
    UPGRADE_COLOR: "darkGrey",
    FACING_TYPE: "toTarget",
    GUNS: [
        {
            POSITION: [14, 16, 1, 0, 0, 180, 0],
        },
        {
            POSITION: [14, 13, 1, 0, 0, 180, 0],
        }, {
            POSITION: [4, 16, 1.5, 14, 0, 180, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.trap, OGg.hexaTrapper, OGg.setTrap, OGg.setTrap, { reload: 0.8, damage: 2.2, health: 2.2, pen: 2.2 }]),
                TYPE: ["unsethyperDriverPillboxBDN", { MOTION_TYPE: "glide" }],
                STAT_CALCULATOR: "trap",
            },
        },
        {
            POSITION: [4, 13, 1.5, 14, 0, 180, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.trap, OGg.hexaTrapper, OGg.setTrap, { reload: 0.8, range: 0, damage: 0 }]),
                TYPE: "bullet",
            },
        }, {
            POSITION: [6, 14, -2, 2, 0, 60, 0],
        }, {
            POSITION: [6, 14, -2, 2, 0, 300, 0],
        }, {
            POSITION: [6, 14, -2, 2, 0, 55, 0],
        }, {
            POSITION: [6, 14, -2, 2, 0, 305, 0],
        },
    ],
    AI: { NO_LEAD: false },
    TURRETS: [
        {
            POSITION: [14, 8, 0, 60, 180, 0],
            TYPE: ["brimmerGunBDN"],
        }, {
            POSITION: [14, 8, 0, 300, 180, 0],
            TYPE: ["brimmerGunBDN"],
        },
    ],
};
Class.shadowEliteSprayerBDN = {
    PARENT: ["shadowEliteBDN"],
    UPGRADE_LABEL: "Shadow Elite Sprayer",
    UPGRADE_COLOR: "darkGrey",
    SKILL: skillSet({
        rld: 0.7,
        dam: 0.5,
        pen: 0.8,
        str: 0.8,
        spd: 0.2,
        atk: 0.3,
        hlt: 1,
        shi: 0.7,
        rgn: 0.7,
        mob: 1,
    }),
    AI: { NO_LEAD: false },
    HAS_NO_RECOIL: true,
    GUNS: [],
    TURRETS: [
        {
            /*    SIZE         X             Y         ANGLE        ARC */
            POSITION: [6.5, 0, 0, 0, 360, 1],
            TYPE: ["sprayerDodecaTurretBDN", { INDEPENDENT: true }],
        }, {
            POSITION: [9, 6, -5, 180, 130, 0],
            TYPE: ["hyperSprayerGunBDN", { COLOR: "grey" }],
        }, {
            POSITION: [9, 6, 5, 180, 130, 0],
            TYPE: ["hyperSprayerGunBDN", { COLOR: "grey" }],
        }, {
            POSITION: [9, 6, 5, 60, 130, 0],
            TYPE: ["hyperSprayerGunBDN", { COLOR: "grey" }],
        }, {
            POSITION: [9, 6, -5, 60, 130, 0],
            TYPE: ["hyperSprayerGunBDN", { COLOR: "grey" }],
        }, {
            POSITION: [9, 6, 5, -60, 130, 0],
            TYPE: ["hyperSprayerGunBDN", { COLOR: "grey" }],
        }, {
            POSITION: [9, 6, -5, -60, 130, 0],
            TYPE: ["hyperSprayerGunBDN", { COLOR: "grey" }],
        },
    ],
};
Class.hypercarrierBDN = {
    PARENT: "autoTankGun",
    LABEL: "",
    STAT_NAMES: statnames.swarm,
    FACING_TYPE: "locksFacing",
    BODY: {
        FOV: base.FOV * 1.2,
    },
    GUNS: [
        {
            POSITION: [7, 8, 1, 7, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.battleship, OGg.carrier, { reload: 1.2, damage: 2.4, health: 2.4, pen: 2.4 }]),
                TYPE: "swarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [7, 8, 1, 7, 2, 30, 0.333],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.battleship, OGg.carrier, { reload: 1.2, damage: 2.4, health: 2.4, pen: 2.4 }]),
                TYPE: "swarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [7, 8, 1, 7, -2, -30, 0.333],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.battleship, OGg.carrier, { reload: 1.2, damage: 2.4, health: 2.4, pen: 2.4 }]),
                TYPE: "swarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [7, 8, 1, 7, 4, 60, 0.667],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.battleship, OGg.carrier, { reload: 1.2, damage: 2.4, health: 2.4, pen: 2.4 }]),
                TYPE: "swarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [7, 8, 1, 7, -4, -60, 0.667],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.battleship, OGg.carrier, { reload: 0.8, damage: 1.6, health: 1.6, pen: 1.6 }]),
                TYPE: "swarm",
                STAT_CALCULATOR: "swarm",
            },
        },
    ],
}
Class.shadowEliteBattleshipBDN = {
    PARENT: ["shadowEliteBDN"],
    UPGRADE_LABEL: "Shadow Elite Battleship",
    UPGRADE_COLOR: "darkGrey",
    GUNS: [],
    TURRETS: [
        {
            POSITION: [5, 7.5, 0, 0, 360, 1],
            TYPE: "hypercarrierBDN",
        }, {
            POSITION: [5, 7.5, 0, 120, 360, 1],
            TYPE: "hypercarrierBDN",
        }, {
            POSITION: [5, 7.5, 0, 240, 360, 1],
            TYPE: "hypercarrierBDN",
        },
    ],
};
for (i = 0; i < 3; i++) {
    Class.shadowEliteBattleshipBDN.GUNS.push(
        {
            POSITION: [4, 5, 0.6, 7, -11.25, i * 120 - 60, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.battleship, { reload: 1, damage: 12, health: 12, pen: 12 }]),
                TYPE: "autoswarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [4, 5, 0.6, 7, 11.25, i * 120 - 60, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.battleship, { reload: 1, damage: 12, health: 12, pen: 12 }]),
                TYPE: "autoswarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [4, 5, 0.6, 7, -7.25, i * 120 - 60, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.battleship, { reload: 1, damage: 12, health: 12, pen: 12 }]),
                TYPE: "autoswarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [4, 5, 0.6, 7, 7.25, i * 120 - 60, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.battleship, { reload: 1, damage: 12, health: 12, pen: 12 }]),
                TYPE: "autoswarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [4, 5, 0.6, 7, 2, i * 120 - 60, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.battleship, { reload: 1, damage: 12, health: 12, pen: 12 }]),
                TYPE: "autoswarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [4, 5, 0.6, 7, -2, i * 120 - 60, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.battleship, { reload: 1, damage: 12, health: 12, pen: 12 }]),
                TYPE: "autoswarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [5, 7, 0.6, 7, 0, i * 120 - 60, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.battleship, { reload: 1, damage: 16, health: 16, pen: 16 }]),
                TYPE: "autoswarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [5, 7, 0.6, 7, -9.25, i * 120 - 60, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.battleship, { reload: 1, damage: 16, health: 16, pen: 16 }]),
                TYPE: "autoswarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [5, 7, 0.6, 7, 9.25, i * 120 - 60, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.battleship, { reload: 1, damage: 16, health: 16, pen: 16 }]),
                TYPE: "autoswarm",
                STAT_CALCULATOR: "swarm",
            },
        },
    )
}
Class.shadowSentryBDN = {
    PARENT: ["sentry"],
    COLOR: "shadow",
    UPGRADE_COLOR: "darkGrey",
    DANGER: 4,
    SIZE: 15,
    VALUE: 5e5,
    SHAPE: 3,
    BODY: {
        HEALTH: 1 * base.HEALTH
    },
};
Class.shadowSentrySwarmBDN = {
    PARENT: ["shadowSentryBDN"],
    UPGRADE_LABEL: "Shadow Swarm Sentry",
    UPGRADE_COLOR: "darkGrey",
    GUNS: [

        {
            POSITION: [7, 8, 0.6, 7, 2.5, 60, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, { recoil: 0.1 }, { reload: 0.8, damage: 1.5, health: 1.5, pen: 1.5 }]),
                TYPE: "swarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [7, 8, 0.6, 7, -2.5, 300, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, { recoil: 0.1 }, { reload: 0.8, damage: 1.5, health: 1.5, pen: 1.5 }]),
                TYPE: "swarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [7, 8, 0.6, 7, -2.5, 60, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, { recoil: 0.1 }, { reload: 0.8, damage: 1.5, health: 1.5, pen: 1.5 }]),
                TYPE: "swarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [7, 8, 0.6, 7, 2.5, 300, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, { recoil: 0.1 }, { reload: 0.8, damage: 1.5, health: 1.5, pen: 1.5 }]),
                TYPE: "swarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [7, 8, 0.6, 7, 0, 60, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, { recoil: 0.1 }, { reload: 0.8, damage: 1.5, health: 1.5, pen: 1.5 }]),
                TYPE: "swarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [7, 8, 0.6, 7, 0, 300, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, { recoil: 0.1 }, { reload: 0.8, damage: 1.5, health: 1.5, pen: 1.5 }]),
                TYPE: "swarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [6, 11, 1.3, 7, 0, 180, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, { recoil: 1.15 }, OGg.machineGun, { reload: 0.4, damage: 1.75, health: 1.75, pen: 1.75 }]),
                TYPE: "swarm",
                STAT_CALCULATOR: "swarm",
            },
        },
    ],
};
Class.superbarricaderAutoTankGunBDN = {
    PARENT: ["genericTank"],
    LABEL: "Turret",
    BODY: {
        FOV: 0.5,
    },
    INDEPENDENT: true,
    CONTROLLERS: ["nearestDifferentMaster"],
    COLOR: "grey",
    AI: {
        SKYNET: true,
        FULL_VIEW: true,
    },
    GUNS: [
        {
            POSITION: [24, 8, 1, 0, 0, 0, 0],
        },
        {
            POSITION: [4, 8, 1.3, 2, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.trap, OGg.minigun, { range: 0.6 }, { reload: 0.2, damage: 1.5, health: 1.5, pen: 1.5 }]),
                TYPE: "trap",
                STAT_CALCULATOR: "trap",
            },
        },

        {
            POSITION: [4, 8, 1.3, 30, 0, 0, 1 / 6],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.trap, OGg.minigun, { range: 0.6 }, { reload: 0.2, damage: 1.5, health: 1.5, pen: 1.5 }]),
                TYPE: "trap",
                STAT_CALCULATOR: "trap",
            },
        },
        {
            POSITION: [4, 8, 1.3, 26, 0, 0, 2 / 6],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.trap, OGg.minigun, { range: 0.6 }, { reload: 0.2, damage: 1.5, health: 1.5, pen: 1.5 }]),
                TYPE: "trap",
                STAT_CALCULATOR: "trap",
            },
        },
        {
            POSITION: [4, 8, 1.3, 22, 0, 0, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.trap, OGg.minigun, { range: 0.6 }, { reload: 0.2, damage: 1.5, health: 1.5, pen: 1.5 }]),
                TYPE: "trap",
                STAT_CALCULATOR: "trap",
            },
        },
        {
            POSITION: [4, 8, 1.3, 18, 0, 0, 4 / 6],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.trap, OGg.minigun, { range: 0.6 }, { reload: 0.2, damage: 1.5, health: 1.5, pen: 1.5 }]),
                TYPE: "trap",
                STAT_CALCULATOR: "trap",
            },
        },
        {
            POSITION: [4, 8, 1.3, 14, 0, 0, 5 / 6],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.trap, OGg.minigun, { range: 0.6 }, { reload: 0.2, damage: 1.5, health: 1.5, pen: 1.5 }]),
                TYPE: "trap",
                STAT_CALCULATOR: "trap",
            },
        },
    ],
};
Class.shadowSentryTrapBDN = makeAuto(Class.shadowSentryBDN, "Sentry", {
    type: Class.superbarricaderAutoTankGunBDN,
    size: 12,
});
Class.shadowSentryTrapBDN.UPGRADE_LABEL = "Shadow Trap Sentry";
Class.shadowSentryTrapBDN.GUNS = [
    {
        POSITION: [14, 11, 1, 0, 0, 180, 0],
    },
    {
        POSITION: [3, 11, 1.2, 14, 0, 180, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([OGg.trap, OGg.setTrap, { recoil: 1.15 }, { reload: 0.8, damage: 1.5, health: 1.7, pen: 1.7 }]),
            TYPE: "setTrap",
            STAT_CALCULATOR: "trap",
        },
    },
]
Class.supermortarAutoTankgunBDN = {
    PARENT: ["genericTank"],
    LABEL: "Mortar",
    BODY: {
        FOV: 2,
    },
    CONTROLLERS: [
        "canRepel",
        "onlyAcceptInArc",
        "mapAltToFire",
        "nearestDifferentMaster",
    ],
    COLOR: "grey",
    GUNS: [
        {
            POSITION: [16, 3, 1, 0, -6.5, -9, 1 / 4],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.pelleter, OGg.artillery, { reload: 0.25, damage: 1.6, health: 1.4, pen: 1.4 }]),
                TYPE: "bullet",
                LABEL: "Tetiary",
            },
        },
        {
            POSITION: [16, 3, 1, 0, 6.5, 9, 1 / 4],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.pelleter, OGg.artillery, { reload: 0.25, damage: 1.6, health: 1.4, pen: 1.4 }]),
                TYPE: "bullet",
                LABEL: "Tetiary",
            },
        },
        {
            POSITION: [17, 3, 1, 0, -6, -7, 2 / 4],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.pelleter, OGg.artillery, { reload: 0.25, damage: 1.6, health: 1.4, pen: 1.4 }]),
                TYPE: "bullet",
                LABEL: "Secondary",
            },
        },
        {
            POSITION: [17, 3, 1, 0, 6, 7, 2 / 4],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.pelleter, OGg.artillery, { reload: 0.25, damage: 1.6, health: 1.4, pen: 1.4 }]),
                TYPE: "bullet",
                LABEL: "Secondary",
            },
        },
        {
            POSITION: [18, 3, 1, 0, -5.5, -5, 3 / 4],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.pelleter, OGg.artillery, { reload: 0.25, damage: 1.6, health: 1.4, pen: 1.4 }]),
                TYPE: "bullet",
                LABEL: "Secondary",
            },
        },
        {
            POSITION: [18, 3, 1, 0, 5.5, 5, 3 / 4],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.pelleter, OGg.artillery, { reload: 0.25, damage: 1.6, health: 1.4, pen: 1.4 }]),
                TYPE: "bullet",
                LABEL: "Secondary",
            },
        },
        {
            POSITION: [19, 12, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.pounder, OGg.artillery, { reload: 0.25, damage: 1.6, health: 1.4, pen: 1.4 }]),
                TYPE: "bullet",
                LABEL: "Heavy",
            },
        },
    ],
};
Class.shadowSentryGunBDN = makeAuto(Class.shadowSentryBDN, "Sentry", {
    type: Class.supermortarAutoTankgunBDN,
    size: 12,
});
Class.shadowSentryGunBDN.UPGRADE_LABEL = "Shadow Gun Sentry";
Class.shadowSentryGunBDN.TURRETS.push(
    ...weaponArray({
        POSITION: [10, 10, 0, 0, 190, 0],
        TYPE: "hyperSprayerGunBDN",
    }, 3),
)
Class.shadowEliteSpawnerBDN = {
    PARENT: ["shadowEliteBDN"],
    UPGRADE_LABEL: "Shadow Elite Spawner",
    UPGRADE_COLOR: "darkGrey",
    MAX_CHILDREN: 5,
    AI: { STRAFE: false },
    GUNS: [
        {
            POSITION: [11, 16, 1, 0, 0, 60, 0],
        },

        {
            POSITION: [11, 16, 1, 0, 0, 180, 0],
        },

        {
            POSITION: [11, 16, 1, 0, 0, 300, 0],
        }, {
            /*** LENGTH    WIDTH     ASPECT        X             Y         ANGLE     DELAY */
            POSITION: [2, 18, 1, 11, 0, 60, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.drone, OGg.weak, OGg.weak, { size: 0.4 }, { health: 0.2, reload: 0.7 }]),
                TYPE: ["shadowSentrySwarmBDN", { GIVE_KILL_MESSAGE: false, VARIES_IN_SIZE: false }],
                SYNCS_SKILLS: true,
                AUTOFIRE: true,
                STAT_CALCULATOR: "drone",
            },
        }, {
            POSITION: [2, 18, 1, 11, 0, 180, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.drone, OGg.weak, OGg.weak, { size: 0.4 }, { health: 0.2, reload: 0.7 }]),
                TYPE: ["shadowSentryTrapBDN", { GIVE_KILL_MESSAGE: false, VARIES_IN_SIZE: false }],
                SYNCS_SKILLS: true,
                AUTOFIRE: true,
                STAT_CALCULATOR: "drone",
            },
        }, {
            POSITION: [2, 18, 1, 11, 0, 300, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.drone, OGg.weak, OGg.weak, { size: 0.4 }, { health: 0.2, reload: 0.7 }]),
                TYPE: ["shadowSentryGunBDN", { GIVE_KILL_MESSAGE: false, VARIES_IN_SIZE: false }],
                SYNCS_SKILLS: true,
                AUTOFIRE: true,
                STAT_CALCULATOR: "drone",
            },
        },
        {
            POSITION: [13, 10, 1, 0, 0, 60, 0],
        },
        {
            POSITION: [10, 3, 1, 2, -6, 55, 0],
        },
        {
            POSITION: [10, 3, 1, 2, 6, 65, 0],
        },
        {
            POSITION: [7, 3, 1, 4, -8, 50, 0],
        },
        {
            POSITION: [7, 3, 1, 4, 8, 70, 0],
        },


        {
            POSITION: [4, 5, 1.6, 10.25, 0, 180, 0],
        },
        {
            POSITION: [4, 5, 1.6, 9.5, 0, 180, 0],
        },
        {
            POSITION: [4, 5, 1.6, 8.75, 0, 180, 0],
        },
        {
            POSITION: [4, 5, 1.6, 8, 0, 180, 0],
        },

        {
            POSITION: [5, 6, 1.65, 8, 0, 300, 0],
        },
        {
            POSITION: [6, 6, 0.6, 8, 0, 300, 0],
        },
    ],
    TURRETS: [
        {
            POSITION: [11, 0, 0, 0, 360, 1],
            TYPE: ["heptupletGunBDN", { INDEPENDENT: false, COLOR: -1 }],
        },
    ],
};
Class.shadowEliteTrapGuardTopBDN = {
    PARENT: ["genericTank"],
    COLOR: -1,
    CONTROLLERS: [["spin", { independent: true }]],
    GUNS: [],
};
for (let i = 0; i < 4; i++) {
    Class.shadowEliteTrapGuardTopBDN.GUNS.push(
        {
            POSITION: [17, 8, 1, 0, 0, 90 * i, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.flankGuard, OGg.minigun, OGg.flankGuard, { reload: 0.8, damage: 2, health: 2, pen: 2 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [15, 8, 1, 0, 0, 90 * i, 0.25],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.flankGuard, OGg.minigun, OGg.flankGuard, { reload: 0.8, damage: 2, health: 2, pen: 2 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [13, 8, 1, 0, 0, 90 * i, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.flankGuard, OGg.minigun, OGg.flankGuard, { reload: 0.8, damage: 2, health: 2, pen: 2 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [13, 8, 1, 0, 0, 90 * i, 0.75],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.flankGuard, OGg.minigun, OGg.flankGuard, { reload: 0.8, damage: 2, health: 2, pen: 2 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [20, 8, 1, 0, 0, 90 * i + 45, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.flankGuard, OGg.flankGuard, { reload: 1.1, damage: 1.85, health: 1.85, pen: 1.85 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [4, 8, 1.7, 13, 0, 90 * i + 45, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.trap, { reload: 1.1, damage: 1.85, health: 1.85, pen: 1.85 }]),
                TYPE: "trap",
                STAT_CALCULATOR: "trap",
            },
        },
    )
};
Class.shadowEliteTrapGuardBDN = {
    PARENT: ["shadowEliteBDN"],
    UPGRADE_LABEL: "Shadow Elite Trap Guard",
    UPGRADE_COLOR: "darkGrey",
    AI: { STRAFE: false },
    GUNS: [],
    TURRETS: [
        {
            POSITION: [9.5, 0, 0, 0, 360, 1],
            TYPE: "shadowEliteTrapGuardTopBDN",
        },
    ],
};
for (let i = 0; i < 3; i++) {
    Class.shadowEliteTrapGuardBDN.GUNS.push(
        {
            POSITION: [10.5, 8, 1, 0, 0, 120 * i + 60, 0],
        },
        {
            POSITION: [2, 8, 1.4, 10.5, 0, 120 * i + 60, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.trap, OGg.setTrap, { reload: 2, damage: 3.5, health: 3.5, pen: 3.5 }]),
                TYPE: "unsetPillbox",
                MAX_CHILDREN: 5,
                STAT_CALCULATOR: "trap",
            },
        },
        {
            POSITION: [9, 10, 1, 0, 0, 120 * i + 60, 0],
        },
    )
    Class.shadowEliteTrapGuardBDN.TURRETS.push(
        {
            POSITION: [5.5, 8, -9, 120 * i + 60, 160, 0],
            TYPE: ["ExtinctionistGunBDN", { INDEPENDENT: false, }],
        }, {
        POSITION: [5.5, 8, 9, 120 * i + 60, 160, 0],
        TYPE: ["ExtinctionistGunBDN", { INDEPENDENT: false, }],
    },
    )
};
Class.shadowEliteSpinnerCycloneBDN = {
    PARENT: ["genericTank"],
    COLOR: -1,
    CONTROLLERS: [["spin", { speed: 0.1, independent: true }]],
    GUNS: [],
};
for (let i = 0; i < 16; i++) {
    Class.shadowEliteSpinnerCycloneBDN.GUNS.push(
        {
            POSITION: [18, 8, 1, 0, 0, (22.5 * i), 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.flankGuard, { reload: 0.5, speed: 1.7, maxSpeed: 1.7, damage: 1.9, health: 1.9, pen: 1.9 }]),
                TYPE: "bullet",
            },
        },
    )
};
for (let i = 0; i < 8; i++) {
    Class.shadowEliteSpinnerCycloneBDN.GUNS.push(
        {
            POSITION: [15, 3, 1, 0, 0, (45 * i) + 11.25, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.gunner, { reload: 0.9, speed: 2.5, maxSpeed: 1.3, damage: 1.9, health: 1.9, pen: 1.9 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [15, 3, 1, 0, 0, (45 * i) - 11.25, 1 / 2],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.gunner, { reload: 0.9, speed: 2.5, maxSpeed: 1.3, damage: 1.9, health: 1.9, pen: 1.9 }]),
                TYPE: "bullet",
            },
        },
    )
};
Class.shadowEliteSpinnerBDN = {
    PARENT: ["shadowEliteBDN"],
    UPGRADE_LABEL: "Shadow Elite Spinner",
    UPGRADE_COLOR: "darkGrey",
    SKILL: skillSet({
        rld: 0.7,
        dam: 0.5,
        pen: 0.8,
        str: 0.8,
        spd: 0.2,
        atk: 0.3,
        hlt: 1,
        shi: 0.7,
        rgn: 0.7,
        mob: 1,
    }),
    AI: { STRAFE: false },
    FACING_TYPE: ["spin", { speed: 0.1 }],
    GUNS: [],
    TURRETS: [
        {
            POSITION: [9.5, 0, 0, 0, 360, 1],
            TYPE: ["shadowEliteSpinnerCycloneBDN", { COLOR: -1 }],
        },
    ],
};
for (let i = 0; i < 3; i++) {
    Class.shadowEliteSpinnerBDN.GUNS.push(
        {
            POSITION: [8.5, 1.25, 1, -1.5, 11.5, 120 * i + 10, 8 / 10],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.twin, OGg.gunner, { speed: 1.3, maxSpeed: 1.3, reload: 1, damage: 1.6, health: 1.6, pen: 1.6 }]),
                TYPE: "bullet",
            },
        }, {
        POSITION: [8.5, 1.25, 1, 2, 9, 120 * i + 10, 6 / 10],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([OGg.basic, OGg.twin, OGg.gunner, { speed: 1.3, maxSpeed: 1.3, reload: 1, damage: 1.6, health: 1.6, pen: 1.6 }]),
            TYPE: "bullet",
        },
    }, {
        POSITION: [8.5, 1.25, 1, 3.5, 6.5, 120 * i + 10, 4 / 10],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([OGg.basic, OGg.twin, OGg.gunner, { speed: 1.3, maxSpeed: 1.3, reload: 1, damage: 1.6, health: 1.6, pen: 1.6 }]),
            TYPE: "bullet",
        },
    }, {
        POSITION: [8.5, 1.25, 1, 6, 4, 120 * i + 10, 2 / 10],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([OGg.basic, OGg.twin, OGg.gunner, { speed: 1.3, maxSpeed: 1.3, reload: 1, damage: 1.6, health: 1.6, pen: 1.6 }]),
            TYPE: "bullet",
        },
    }, {
        POSITION: [8.5, 1.25, 1, 8.5, 1.5, 120 * i + 10, 0 / 10],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([OGg.basic, OGg.twin, OGg.gunner, { speed: 1.3, maxSpeed: 1.3, reload: 1, damage: 1.6, health: 1.6, pen: 1.6 }]),
            TYPE: "bullet",
        },
    },
        {
            POSITION: [7.5, 2, 1, -1.5, 11.5, 120 * i + 10, 5 / 6],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.twin, OGg.gunner, { speed: 1.3, maxSpeed: 1.3, reload: 1, damage: 1.6, health: 1.6, pen: 1.6 }]),
                TYPE: "bullet",
            },
        }, {
        POSITION: [7.5, 2, 1, 2, 9, 120 * i + 10, 4 / 6],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([OGg.basic, OGg.twin, OGg.gunner, { speed: 1.3, maxSpeed: 1.3, reload: 1, damage: 1.6, health: 1.6, pen: 1.6 }]),
            TYPE: "bullet",
        },
    }, {
        POSITION: [7.5, 2, 1, 3.5, 6.5, 120 * i + 10, 3 / 6],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([OGg.basic, OGg.twin, OGg.gunner, { speed: 1.3, maxSpeed: 1.3, reload: 1, damage: 1.6, health: 1.6, pen: 1.6 }]),
            TYPE: "bullet",
        },
    }, {
        POSITION: [7.5, 2, 1, 6, 4, 120 * i + 10, 2 / 6],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([OGg.basic, OGg.twin, OGg.gunner, { speed: 1.3, maxSpeed: 1.3, reload: 1, damage: 1.6, health: 1.6, pen: 1.6 }]),
            TYPE: "bullet",
        },
    }, {
        POSITION: [7.5, 2, 1, 8.5, 1.5, 120 * i + 10, 1 / 6],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([OGg.basic, OGg.twin, OGg.gunner, { speed: 1.3, maxSpeed: 1.3, reload: 1, damage: 1.6, health: 1.6, pen: 1.6 }]),
            TYPE: "bullet",
        },
    },

        {
            POSITION: [6.5, 2, 1, -1.5, 11.5, 120 * i + 10, 6 / 7],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.twin, OGg.gunner, { speed: 1.3, maxSpeed: 1.3, reload: 1, damage: 1.6, health: 1.6, pen: 1.6 }]),
                TYPE: "bullet",
            },
        }, {
        POSITION: [6.5, 2, 1, 2, 9, 120 * i + 10, 5 / 7],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([OGg.basic, OGg.twin, OGg.gunner, { speed: 1.3, maxSpeed: 1.3, reload: 1, damage: 1.6, health: 1.6, pen: 1.6 }]),
            TYPE: "bullet",
        },
    }, {
        POSITION: [6.5, 2, 1, 3.5, 6.5, 120 * i + 10, 4 / 7],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([OGg.basic, OGg.twin, OGg.gunner, { speed: 1.3, maxSpeed: 1.3, reload: 1, damage: 1.6, health: 1.6, pen: 1.6 }]),
            TYPE: "bullet",
        },
    }, {
        POSITION: [6.5, 2, 1, 6, 4, 120 * i + 10, 3 / 7],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([OGg.basic, OGg.twin, OGg.gunner, { speed: 1.3, maxSpeed: 1.3, reload: 1, damage: 1.6, health: 1.6, pen: 1.6 }]),
            TYPE: "bullet",
        },
    }, {
        POSITION: [6.5, 2, 1, 8.5, 1.5, 120 * i + 10, 2 / 7],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([OGg.basic, OGg.twin, OGg.gunner, { speed: 1.3, maxSpeed: 1.3, reload: 1, damage: 1.6, health: 1.6, pen: 1.6 }]),
            TYPE: "bullet",
        },
    }, {
        POSITION: [2, 20, 0.75, 8, 0, 120 * i + 60, 0],
    },
    )
};

















// Legions
Class.shadowdestroyerLegion = {
    PARENT: ["shadowEliteBDN"],
    UPGRADE_LABEL: "Shadow Destroyer Legion",
    NAME: "Shadow Destroyer Legion",
    DISPLAY_NAME: false,
    UPGRADE_COLOR: "darkGrey",
    AI: { NO_LEAD: false },
    SIZE: 30,
    GUNS: [],
    BODY: {
        HEALTH: 28 * base.HEALTH,
    },
    TURRETS: [
        {
            POSITION: [11, 0, 0, 180, 360, 0],
            TYPE: ["crasherSpawnerlimited", { GUN_STAT_SCALE: { health: 1.1 } }],
        }, {
            POSITION: [11, 0, 0, 60, 360, 0],
            TYPE: ["crasherSpawnerlimited", { GUN_STAT_SCALE: { health: 1.1 } }],
        }, {
            POSITION: [11, 0, 0, -60, 360, 0],
            TYPE: ["crasherSpawnerlimited", { GUN_STAT_SCALE: { health: 1.1 } }],
        }, {
            POSITION: [11, 0, 0, 240, 360, 0],
            TYPE: ["crasherSpawnerlimited", { GUN_STAT_SCALE: { health: 1.1 } }],
        }, {
            POSITION: [11, 0, 0, 120, 360, 0],
            TYPE: ["crasherSpawnerlimited", { GUN_STAT_SCALE: { health: 1.1 } }],
        }, {
            POSITION: [11, 0, 0, 0, 360, 0],
            TYPE: ["crasherSpawnerlimited", { GUN_STAT_SCALE: { health: 1.1 } }],
        }, {
            POSITION: [11, 0, 0, 0, 360, 1],
            TYPE: ["heptupletGunBDN", { GUN_STAT_SCALE: { health: 1.1 }, INDEPENDENT: true, COLOR: -1 }],
        },
    ],
};
for (let i = 0; i < 3; i++) {
    Class.shadowdestroyerLegion.GUNS.push(
        {
            POSITION: [6, 3, 1, 6, 9, i * 120 + 67, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.artillery, OGg.pelleter, OGg.twin, OGg.pounder, { reload: 0.3, damage: 4, health: 4.4, pen: 4 }]),
                TYPE: "bullet",
                LABEL: "Devastator Tertiary",
            },
        },
        {
            POSITION: [6, 3, 1, 6, -9, i * 120 + 53, 0.75],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.artillery, OGg.pelleter, OGg.twin, OGg.pounder, { reload: 0.3, damage: 4, health: 4.4, pen: 4 }]),
                TYPE: "bullet",
                LABEL: "Devastator Tertiary",
            },
        },
        {
            POSITION: [7, 3, 1, 6, 8, i * 120 + 67, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.artillery, OGg.pelleter, OGg.twin, OGg.pounder, { reload: 0.3, damage: 4, health: 4.4, pen: 4 }]),
                TYPE: "bullet",
                LABEL: "Devastator Secondary",
            },
        },
        {
            POSITION: [7, 3, 1, 6, -8, i * 120 + 53, 0.75],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.artillery, OGg.pelleter, OGg.twin, OGg.pounder, { reload: 0.3, damage: 4, health: 4.4, pen: 4 }]),
                TYPE: "bullet",
                LABEL: "Devastator Secondary",
            },
        },
        {
            POSITION: [8, 3, 1, 6, 7, i * 120 + 67, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.artillery, OGg.pelleter, OGg.twin, OGg.pounder, { reload: 0.3, damage: 4, health: 4.4, pen: 4 }]),
                TYPE: "bullet",
                LABEL: "Devastator Secondary",
            },
        },
        {
            POSITION: [8, 3, 1, 6, -7, i * 120 + 53, 0.75],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.artillery, OGg.pelleter, OGg.twin, OGg.pounder, { reload: 0.3, damage: 4, health: 4.4, pen: 4 }]),
                TYPE: "bullet",
                LABEL: "Devastator Secondary",
            },
        },
    )
    Class.shadowdestroyerLegion.GUNS.push(
        {
            POSITION: [7, 16, 1, 6, 0, i * 120 + 60, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.pounder, OGg.pounder, OGg.destroyer, { reload: 0.5, damage: 2, health: 2.2, pen: 2 }]),
                TYPE: "bullet",
                LABEL: "Devastator Primary",
            },
        },
    )
}
Class.shadowgunnerLegion = {
    PARENT: ["shadowEliteBDN"],
    UPGRADE_LABEL: "Shadow Gunner Legion",
    NAME: "Shadow Gunner Legion",
    DISPLAY_NAME: false,
    UPGRADE_COLOR: "darkGrey",
    FACING_TYPE: "toTarget",
    AI: { NO_LEAD: false },
    SIZE: 30,
    BODY: {
        HEALTH: 28 * base.HEALTH,
    },
    GUNS: [
        {
            POSITION: [14, 16, 1, 0, 0, 180, 0],
        },
        {
            POSITION: [14, 13, 1, 0, 0, 180, 0],
        }, {
            POSITION: [4, 16, 1.5, 14, 0, 180, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.trap, OGg.hexaTrapper, OGg.setTrap, { reload: 0.8, damage: 2.2, health: 2.4, pen: 2.2 }]),
                TYPE: ["unsethyperDriverPillboxBDN", { MOTION_TYPE: "glide" }],
                STAT_CALCULATOR: "trap",
            },
        },
        {
            POSITION: [4, 13, 1.5, 14, 0, 180, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.trap, OGg.hexaTrapper, OGg.setTrap, { reload: 0.8, range: 0, damage: 0, health: 1.1 }]),
                TYPE: "bullet",
            },
        }, {
            POSITION: [6, 14, -2, 2, 0, 60, 0],
        }, {
            POSITION: [6, 14, -2, 2, 0, 300, 0],
        }, {
            POSITION: [6, 14, -2, 2, 0, 55, 0],
        }, {
            POSITION: [6, 14, -2, 2, 0, 305, 0],
        },
    ],
    AI: { NO_LEAD: false },
    TURRETS: [
        {
            POSITION: [14, 8, 0, 60, 180, 0],
            TYPE: ["brimmerGunBDN", { GUN_STAT_SCALE: { health: 1.15 } }],
        }, {
            POSITION: [14, 8, 0, 300, 180, 0],
            TYPE: ["brimmerGunBDN", { GUN_STAT_SCALE: { health: 1.15 } }],
        },
    ],
}
Class.shadowsprayerLegion = {
    PARENT: ["shadowEliteBDN"],
    UPGRADE_LABEL: "Shadow Sprayer Legion",
    NAME: "Shadow Sprayer Legion",
    DISPLAY_NAME: false,
    UPGRADE_COLOR: "darkGrey",
    AI: { NO_LEAD: false },
    SIZE: 30,
    SKILL: [0, 9, 3, 9, 2, 9, 9, 9, 9, 0],
    HAS_NO_RECOIL: true,
    BODY: {
        HEALTH: 28 * base.HEALTH,
    },
    TURRETS: weaponArray({
        POSITION: [14, 6, 0, 60, 190, 0],
        TYPE: ["superSprayerGunBDN", { GUN_STAT_SCALE: { health: 2.4, damage: 2.5, speed: 2.5, resist: 1.15 }, COLOR: -1 }],
    }, 3)
}
Class.shadowbattleshipLegion = {
    PARENT: ["shadowEliteBDN"],
    UPGRADE_LABEL: "Shadow Battleship Legion",
    NAME: "Shadow Battleship Legion",
    DISPLAY_NAME: false,
    UPGRADE_COLOR: "darkGrey",
    AI: { NO_LEAD: false },
    SIZE: 30,
    BODY: {
        HEALTH: 28 * base.HEALTH,
    },
    GUNS: [],
    TURRETS: [
        {
            POSITION: [5, 7.5, 0, 0, 360, 1],
            TYPE: ["autoTankGun", { GUN_STAT_SCALE: { health: 1.1 }, INDEPENDENT: true, COLOR: -1, PARENT: "hypercarrierBDN" }],
        }, {
            POSITION: [5, 7.5, 0, 120, 360, 1],
            TYPE: ["autoTankGun", { GUN_STAT_SCALE: { health: 1.1 }, INDEPENDENT: true, COLOR: -1, PARENT: "hypercarrierBDN" }],
        }, {
            POSITION: [5, 7.5, 0, 240, 360, 1],
            TYPE: ["autoTankGun", { GUN_STAT_SCALE: { health: 1.1 }, INDEPENDENT: true, COLOR: -1, PARENT: "hypercarrierBDN" }],
        },
    ],
};
for (i = 0; i < 3; i++) {
    Class.shadowbattleshipLegion.GUNS.push(
        {
            POSITION: [4, 5, 0.6, 7, -11.25, i * 120 - 60, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.battleship, { reload: 0.85, damage: 12, health: 12, pen: 12 }]),
                TYPE: "autoswarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [4, 5, 0.6, 7, 11.25, i * 120 - 60, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.battleship, { reload: 0.85, damage: 12, health: 12, pen: 12 }]),
                TYPE: "autoswarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [4, 5, 0.6, 7, -7.25, i * 120 - 60, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.battleship, { reload: 0.85, damage: 12, health: 12, pen: 12 }]),
                TYPE: "autoswarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [4, 5, 0.6, 7, 7.25, i * 120 - 60, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.battleship, { reload: 0.85, damage: 12, health: 12, pen: 12 }]),
                TYPE: "autoswarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [4, 5, 0.6, 7, 2, i * 120 - 60, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.battleship, { reload: 0.85, damage: 12, health: 12, pen: 12 }]),
                TYPE: "autoswarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [4, 5, 0.6, 7, -2, i * 120 - 60, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.battleship, { reload: 0.85, damage: 12, health: 12, pen: 12 }]),
                TYPE: "autoswarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [5, 7, 0.6, 7, 0, i * 120 - 60, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.battleship, { reload: 0.85, damage: 12, health: 12, pen: 12 }]),
                TYPE: "autoswarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [5, 7, 0.6, 7, -9.25, i * 120 - 60, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.battleship, { reload: 0.85, damage: 12, health: 12, pen: 12 }]),
                TYPE: "autoswarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [5, 7, 0.6, 7, 9.25, i * 120 - 60, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.battleship, { reload: 0.85, damage: 12, health: 12, pen: 12 }]),
                TYPE: "autoswarm",
                STAT_CALCULATOR: "swarm",
            },
        },
    )
}
Class.shadowspawnerLegion = {
    PARENT: ["shadowEliteBDN"],
    UPGRADE_LABEL: "Shadow Spawner Legion",
    NAME: "Shadow Spawner Legion",
    DISPLAY_NAME: false,
    UPGRADE_COLOR: "darkGrey",
    AI: { NO_LEAD: false },
    SIZE: 30,
    BODY: {
        HEALTH: 28 * base.HEALTH,
    },
    GUNS: [
        {
            POSITION: [11, 16, 1, 0, 0, 60, 0],
        },

        {
            POSITION: [11, 16, 1, 0, 0, 180, 0],
        },

        {
            POSITION: [11, 16, 1, 0, 0, 300, 0],
        }, {
            /*** LENGTH    WIDTH     ASPECT        X             Y         ANGLE     DELAY */
            POSITION: [2, 18, 1, 11, 0, 60, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.drone, OGg.weak, OGg.weak, OGg.weak, { size: 0.4 }, { health: 0.25, reload: 0.75 }]),
                TYPE: ["shadowSentrySwarmBDN", { GIVE_KILL_MESSAGE: false, VARIES_IN_SIZE: false }],
                SYNCS_SKILLS: true,
                AUTOFIRE: true,
                STAT_CALCULATOR: "drone",
            },
        }, {
            POSITION: [2, 18, 1, 11, 0, 180, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.drone, OGg.weak, OGg.weak, OGg.weak, { size: 0.4 }, { health: 0.25, reload: 0.75 }]),
                TYPE: ["shadowSentryTrapBDN", { GIVE_KILL_MESSAGE: false, VARIES_IN_SIZE: false }],
                SYNCS_SKILLS: true,
                AUTOFIRE: true,
                STAT_CALCULATOR: "drone",
            },
        }, {
            POSITION: [2, 18, 1, 11, 0, 300, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.drone, OGg.weak, OGg.weak, OGg.weak, { size: 0.4 }, { health: 0.25, reload: 0.75 }]),
                TYPE: ["shadowSentryGunBDN", { GIVE_KILL_MESSAGE: false, VARIES_IN_SIZE: false }],
                SYNCS_SKILLS: true,
                AUTOFIRE: true,
                STAT_CALCULATOR: "drone",
            },
        },
        {
            POSITION: [13, 10, 1, 0, 0, 60, 0],
        },
        {
            POSITION: [10, 3, 1, 2, -6, 55, 0],
        },
        {
            POSITION: [10, 3, 1, 2, 6, 65, 0],
        },
        {
            POSITION: [7, 3, 1, 4, -8, 50, 0],
        },
        {
            POSITION: [7, 3, 1, 4, 8, 70, 0],
        },


        {
            POSITION: [4, 5, 1.6, 10.25, 0, 180, 0],
        },
        {
            POSITION: [4, 5, 1.6, 9.5, 0, 180, 0],
        },
        {
            POSITION: [4, 5, 1.6, 8.75, 0, 180, 0],
        },
        {
            POSITION: [4, 5, 1.6, 8, 0, 180, 0],
        },

        {
            POSITION: [5, 6, 1.65, 8, 0, 300, 0],
        },
        {
            POSITION: [6, 6, 0.6, 8, 0, 300, 0],
        },
    ],
    TURRETS: [
        {
            POSITION: [11, 0, 0, 0, 360, 1],
            TYPE: ["heptupletGunBDN", { GUN_STAT_SCALE: { health: 1.15 }, INDEPENDENT: false, COLOR: -1 }],
        },
    ],
}
// Legionary Crasher
Class.shadowlegionaryCrasherTop = {
    PARENT: ["shadowEliteBDN"],
    AI: { STRAFE: false, NO_LEAD: false },
    CONTROLLERS: [["spin", { independent: true, speed: -0.005 }]],
    INDEPENDENT: true,
    DISPLAY_NAME: false,
    GUNS: weaponArray([
        {
            POSITION: [6, 3, 1, 6, 9, i * 120 + 67, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.artillery, OGg.pelleter, OGg.twin, OGg.pounder, { reload: 0.3, damage: 4, health: 4, pen: 4 }]),
                TYPE: "bullet",
                LABEL: "Devastator Tertiary",
            },
        },
        {
            POSITION: [6, 3, 1, 6, -9, i * 120 + 53, 0.75],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.artillery, OGg.pelleter, OGg.twin, OGg.pounder, { reload: 0.3, damage: 4, health: 4, pen: 4 }]),
                TYPE: "bullet",
                LABEL: "Devastator Tertiary",
            },
        },
        {
            POSITION: [7, 3, 1, 6, 8, i * 120 + 67, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.artillery, OGg.pelleter, OGg.twin, OGg.pounder, { reload: 0.3, damage: 4, health: 4, pen: 4 }]),
                TYPE: "bullet",
                LABEL: "Devastator Secondary",
            },
        },
        {
            POSITION: [7, 3, 1, 6, -8, i * 120 + 53, 0.75],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.artillery, OGg.pelleter, OGg.twin, OGg.pounder, { reload: 0.3, damage: 4, health: 4, pen: 4 }]),
                TYPE: "bullet",
                LABEL: "Devastator Secondary",
            },
        },
        {
            POSITION: [8, 3, 1, 6, 7, i * 120 + 67, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.artillery, OGg.pelleter, OGg.twin, OGg.pounder, { reload: 0.3, damage: 4, health: 4, pen: 4 }]),
                TYPE: "bullet",
                LABEL: "Devastator Secondary",
            },
        },
        {
            POSITION: [8, 3, 1, 6, -7, i * 120 + 53, 0.75],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.artillery, OGg.pelleter, OGg.twin, OGg.pounder, { reload: 0.3, damage: 4, health: 4, pen: 4 }]),
                TYPE: "bullet",
                LABEL: "Devastator Secondary",
            },
        },
        {
            POSITION: [7, 16, 1, 6, 0, i * 120 + 60, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.pounder, OGg.pounder, OGg.destroyer, { reload: 0.55, damage: 2, health: 2, pen: 2 }]),
                TYPE: "bullet",
                LABEL: "Devastator Primary",
            },
        },
        {
            POSITION: [4, 3, 0.7, 7, 0, 60, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.swarm, OGg.pounder, OGg.pounder, OGg.destroyer, { speed: 2.5, maxSpeed: 2.2, size: 1.1, range: 3.25 }]),
                TYPE: ["swarm", { INDEPENDENT: true }],
                STAT_CALCULATOR: "swarm",
                AUTOFIRE: true,

            },
        },
        {
            POSITION: [3.5, 3, 0.7, 7, 5, 60, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.swarm, OGg.pounder, OGg.pounder, OGg.destroyer, { speed: 2.5, maxSpeed: 2.2, size: 1.1, range: 3.25 }]),
                TYPE: ["swarm", { INDEPENDENT: true }],
                STAT_CALCULATOR: "swarm",
                AUTOFIRE: true,

            },
        }, {
            POSITION: [3.5, 3, 0.7, 7, -5, 60, 1 / 4],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.swarm, OGg.pounder, OGg.pounder, OGg.destroyer, { speed: 2.5, maxSpeed: 2.2, size: 1.1, range: 3.25 }]),
                TYPE: ["swarm", { INDEPENDENT: true }],
                STAT_CALCULATOR: "swarm",
                AUTOFIRE: true,
            },
        }, {
            POSITION: [3, 3, 0.7, 7, -2.5, 60, 2 / 4],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.swarm, OGg.pounder, OGg.pounder, OGg.destroyer, { speed: 2.5, maxSpeed: 2.2, size: 1.1, range: 3.25 }]),
                TYPE: ["swarm", { INDEPENDENT: true }],
                STAT_CALCULATOR: "swarm",
                AUTOFIRE: true,
            },
        }, {
            POSITION: [3, 3, 0.7, 7, 2.5, 60, 3 / 4],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.swarm, OGg.pounder, OGg.pounder, OGg.destroyer, { speed: 2.5, maxSpeed: 2.2, size: 1.1, range: 3.25 }]),
                TYPE: ["swarm", { INDEPENDENT: true }],
                STAT_CALCULATOR: "swarm",
                AUTOFIRE: true,
            },
        }, {
            POSITION: [3, 3, 0.7, 7, -7.5, 60, 2 / 4],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.pounder, OGg.pounder, OGg.destroyer, { speed: 2.5, maxSpeed: 2.2, size: 1.1, range: 3.25 }]),
                TYPE: ["swarm", { INDEPENDENT: true }],
                STAT_CALCULATOR: "swarm",
                AUTOFIRE: true,
            },
        }, {
            POSITION: [3, 3, 0.7, 7, 7.5, 60, 3 / 4],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.pounder, OGg.pounder, OGg.destroyer, { speed: 2.5, maxSpeed: 2.2, size: 1.1, range: 3.25 }]),
                TYPE: ["swarm", { INDEPENDENT: true }],
                STAT_CALCULATOR: "swarm",
                AUTOFIRE: true,
            },
        },
    ], 3),
    TURRETS: weaponArray({
        POSITION: [9.5, 10, 0, 0, 190, 0],
        TYPE: ["heptupletGunBDN", { GUN_STAT_SCALE: { damage: 2.5, health: 2.2, speed: 2.2, maxSpeed: 2, resist: 1.1, range: 2.3 } }],
    }, 3),
}
Class.shadowlegionaryCrasherSpawner = {
    PARENT: 'genericTank',
    SHAPE: "",
    INDEPENDENT: true,
    GUNS: [{
        POSITION: [0, 10, 0, 0, 0, 0, 10],
        PROPERTIES: {
            TYPE: 'shadowdestroyerLegion',
            SHOOT_SETTINGS: combineStats([{ reload: 0.1 }]),
            NO_LIMITATIONS: true,
            INDEPENDENT_CHILDREN: true,
            MAX_CHILDREN: 1,
            IDENTIFIER: 1,
            AUTOFIRE: true,
        }
    }],
    ON: [{
        event: "fire",
        handler: ({ gun }) => {
            gun.setBulletType(["shadowdestroyerLegion", "shadowgunnerLegion", "shadowsprayerLegion", "shadowbattleshipLegion", "shadowspawnerLegion"][gun.identifier++ % 5]);
        }
    }],
}
Class.shadowlegionaryCrasher = {
    PARENT: ["shadowEliteBDN"],
    LABEL: "Shadow Legionary Crasher",
    NAME: "Shadow Legionary Crasher",
    DISPLAY_NAME: false,
    UPGRADE_COLOR: "darkGrey",
    AI: { STRAFE: false, NO_LEAD: false },
    HAS_NO_RECOIL: true,
    VALUE: 5e8,
    SIZE: 100,
    BODY: {
        FOV: 1.5,
        SPEED: 0.1 * base.SPEED,
        HEALTH: 7000,
        DAMAGE: 20 * base.DAMAGE,
    },
    GUNS: [
        ...weaponArray([
            {
                POSITION: [14.5, 13, 1, 0, 0, 0, 0],
            }, {
                POSITION: [3, 13, 1.7, 14.5, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([OGg.trap, OGg.setTrap, OGg.pounder, { reload: 1.8, speed: 3.2, size: 0.9, maxSpeed: 2.5, range: 1.1 }, { damage: 3, health: 3, pen: 3 }]),
                    TYPE: "shadowlegionaryPillbox",
                    NO_LIMITATIONS: true,
                    STAT_CALCULATOR: "trap",
                },
            },
        ], 3),
        ...weaponArray({
            POSITION: [5, 12, 1.6, -11, 0, 0, 0],
        }, 3),
    ],
    TURRETS: [
        {
            POSITION: [12, 0, 0, 0, 360, 1],
            TYPE: "shadowlegionaryCrasherTop",
        },
        ...weaponArray({
            POSITION: [14, 8, 0, 60, 180, 0],
            TYPE: ["ssuperSprayerGunBDN", { GUN_STAT_SCALE: { speed: 2, health: 31.2, damage: 30, resist: 1.5 }, COLOR: -1 }],
        }, 3),
        {
            POSITION: [12, 0, 0, 0, 0, 0],
            TYPE: 'shadowlegionaryCrasherSpawner'
        }
    ],
}
Class.shadowlegionaryCrasherSpawnerFix = {
    PARENT: 'genericTank',
    SHAPE: "",
    INDEPENDENT: true,
    GUNS: [{
        POSITION: [0, 10, 0, 0, 0, 0, 10],
        PROPERTIES: {
            TYPE: 'shadowdestroyerLegion',
            SHOOT_SETTINGS: combineStats([{ reload: 0.1, size: 0.75 }]),
            NO_LIMITATIONS: true,
            INDEPENDENT_CHILDREN: false,
            MAX_CHILDREN: 5,
            IDENTIFIER: 1,
            AUTOFIRE: true,
        }
    }],
    ON: [{
        event: "fire",
        handler: ({ gun }) => {
            gun.setBulletType(["shadowdestroyerLegion", "shadowgunnerLegion", "shadowsprayerLegion", "shadowbattleshipLegion", "shadowspawnerLegion"][gun.identifier++ % 5]);
        }
    }],
}
Class.shadowlegionaryCrasherFix = {
    PARENT: ["shadowEliteBDN"],
    LABEL: "Shadow Legionary Crasher",
    NAME: "Shadow Legionary Crasher",
    DISPLAY_NAME: false,
    UPGRADE_COLOR: "darkGrey",
    AI: { STRAFE: false, NO_LEAD: false },
    HAS_NO_RECOIL: true,
    VALUE: 5e8,
    SIZE: 100,
    BODY: {
        FOV: 1.5,
        SPEED: 0.1 * base.SPEED,
        HEALTH: 7000,
        DAMAGE: 20 * base.DAMAGE,
    },
    GUNS: [
        ...weaponArray([
            {
                POSITION: [14.5, 13, 1, 0, 0, 0, 0],
            }, {
                POSITION: [3, 13, 1.7, 14.5, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([OGg.trap, OGg.setTrap, OGg.pounder, { reload: 1.8, speed: 3.2, size: 0.9, maxSpeed: 2.5, range: 1.1 }, { damage: 3, health: 3, pen: 3 }]),
                    TYPE: "shadowlegionaryPillbox",
                    NO_LIMITATIONS: true,
                    STAT_CALCULATOR: "trap",
                },
            },
        ], 3),
        ...weaponArray({
            POSITION: [5, 12, 1.6, -11, 0, 0, 0],
        }, 3),
    ],
    TURRETS: [
        {
            POSITION: [12, 0, 0, 0, 360, 1],
            TYPE: "shadowlegionaryCrasherTop",
        },
        ...weaponArray({
            POSITION: [14, 8, 0, 60, 180, 0],
            TYPE: ["ssuperSprayerGunBDN", { GUN_STAT_SCALE: { speed: 2, health: 31.2, damage: 30, resist: 1.5 }, COLOR: -1 }],
        }, 3),
        {
            POSITION: [12, 0, 0, 0, 0, 0],
            TYPE: 'shadowlegionaryCrasherSpawnerFix'
        }
    ],
}
Class.shadowElitesBDN = makeMenu("Shadow Elites")
Class.shadowElitesBDN.COLOR = "darkGrey"
Class.shadowElitesBDN.UPGRADE_COLOR = "darkGrey"
Class.shadowElitesBDN.UPGRADES_TIER_0 = ["shadowEliteDestroyerBDN", "shadowEliteGunnerBDN", "shadowEliteSprayerBDN", "shadowEliteBattleshipBDN", "shadowEliteSpawnerBDN", "shadowEliteTrapGuardBDN", "shadowEliteSpinnerBDN", "shadowsprayerLegion", "shadowlegionaryCrasher", "shadowlegionaryCrasherFix"]
Class.shadowElitesBDN.SHAPE = 3.5
Class.legendaryElitesBDN.UPGRADES_TIER_0.push("shadowElitesBDN")

































// Rainbow Elites :money_mouth:
Class.octupletGunBDN = {
    PARENT: "autoTankGun",
    GUNS: [
        {
            POSITION: [14, 3.5, 1, 0, -7.5, 0, 6 / 7],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.autoTurret, OGg.twin, OGg.twin, OGg.power, { reload: 1.5, speed: 2.2, maxspeed: 2.2 }, { reload: 1, damage: 3, health: 3, pen: 3 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [14, 3.5, 1, 0, 7.5, 0, 3 / 7],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.autoTurret, OGg.twin, OGg.twin, OGg.power, { reload: 1.5, speed: 2.2, maxspeed: 2.2 }, { reload: 1, damage: 3, health: 3, pen: 3 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [15, 3.5, 1, 0, -5.5, 0, 5 / 7],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.autoTurret, OGg.twin, OGg.twin, OGg.power, { reload: 1.5, speed: 2.2, maxspeed: 2.2 }, { reload: 1, damage: 3, health: 3, pen: 3 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [15, 3.5, 1, 0, 5.5, 0, 2 / 7],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.autoTurret, OGg.twin, OGg.twin, OGg.power, { reload: 1.5, speed: 2.2, maxspeed: 2.2 }, { reload: 1, damage: 3, health: 3, pen: 3 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [16, 3.5, 1, 0, -3.5, 0, 4 / 7],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.autoTurret, OGg.twin, OGg.twin, OGg.power, { reload: 1.5, speed: 2.2, maxspeed: 2.2 }, { reload: 1, damage: 3, health: 3, pen: 3 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [16, 3.5, 1, 0, 3.5, 0, 1 / 7],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.autoTurret, OGg.twin, OGg.twin, OGg.power, { reload: 1.5, speed: 2.2, maxspeed: 2.2 }, { reload: 1, damage: 3, health: 3, pen: 3 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [17, 3.5, 1, 0, -1.5, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.autoTurret, OGg.twin, OGg.twin, OGg.power, { reload: 1.5, speed: 2.2, maxspeed: 2.2 }, { reload: 1, damage: 3, health: 3, pen: 3 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [17, 3.5, 1, 0, 1.5, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.autoTurret, OGg.twin, OGg.twin, OGg.power, { reload: 1.5, speed: 2.2, maxspeed: 2.2 }, { reload: 1, damage: 3, health: 3, pen: 3 }]),
                TYPE: "bullet",
            },
        },
    ],
}
Class.rainbowEliteBDN = {
    PARENT: ["miniboss"],
    LABEL: "Rainbow Elite Crasher",
    COLOR: "rainbow",
    SHAPE: 3,
    SIZE: 37,
    DANGER: 80,
    VARIES_IN_SIZE: true,
    VALUE: 24e5,
    BODY: {
        FOV: 1.25,
        SPEED: 0.125 * base.SPEED,
        HEALTH: 50 * base.HEALTH,
        DAMAGE: 11 * base.DAMAGE,
        REGEN: 4 * base.REGEN,
    },
};
Class.rainbowEliteDestroyerBDN = {
    PARENT: ["rainbowEliteBDN"],
    UPGRADE_LABEL: "Rainbow Elite Destroyer",
    UPGRADE_COLOR: "rainbow",
    GUNS: [],
    TURRETS: [
        {
            POSITION: [11, 0, 0, 180, 360, 0],
            TYPE: ["crasherSpawnerlimited"],
        }, {
            POSITION: [11, 0, 0, 60, 360, 0],
            TYPE: ["crasherSpawnerlimited"],
        }, {
            POSITION: [11, 0, 0, -60, 360, 0],
            TYPE: ["crasherSpawnerlimited"],
        }, {
            POSITION: [11, 0, 0, 240, 360, 0],
            TYPE: ["crasherSpawnerlimited"],
        }, {
            POSITION: [11, 0, 0, 120, 360, 0],
            TYPE: ["crasherSpawnerlimited"],
        }, {
            POSITION: [11, 0, 0, 0, 360, 0],
            TYPE: ["crasherSpawnerlimited"],
        }, {
            POSITION: [11, 0, 0, 0, 360, 1],
            TYPE: ["octupletGunBDN", { INDEPENDENT: true, COLOR: -1 }],
        },
    ],
};
for (let i = 0; i < 3; i++) {
    Class.rainbowEliteDestroyerBDN.GUNS.push(
        {
            POSITION: [5, 3, 1, 6, 10, i * 120 + 67, 0.2],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.artillery, OGg.pelleter, OGg.twin, OGg.pounder, { reload: 0.3, damage: 5, health: 5, pen: 5 }]),
                TYPE: "bullet",
                LABEL: "Devastator Tertiary",
            },
        },
        {
            POSITION: [5, 3, 1, 6, -10, i * 120 + 53, 0.2],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.artillery, OGg.pelleter, OGg.twin, OGg.pounder, { reload: 0.3, damage: 5, health: 5, pen: 5 }]),
                TYPE: "bullet",
                LABEL: "Devastator Tertiary",
            },
        },
        {
            POSITION: [6, 3, 1, 6, 9, i * 120 + 67, 0.4],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.artillery, OGg.pelleter, OGg.twin, OGg.pounder, { reload: 0.3, damage: 5, health: 5, pen: 5 }]),
                TYPE: "bullet",
                LABEL: "Devastator Tertiary",
            },
        },
        {
            POSITION: [6, 3, 1, 6, -9, i * 120 + 53, 0.4],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.artillery, OGg.pelleter, OGg.twin, OGg.pounder, { reload: 0.3, damage: 5, health: 5, pen: 5 }]),
                TYPE: "bullet",
                LABEL: "Devastator Tertiary",
            },
        },
        {
            POSITION: [7, 3, 1, 6, 8, i * 120 + 67, 0.6],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.artillery, OGg.pelleter, OGg.twin, OGg.pounder, { reload: 0.3, damage: 5, health: 5, pen: 5 }]),
                TYPE: "bullet",
                LABEL: "Devastator Secondary",
            },
        },
        {
            POSITION: [7, 3, 1, 6, -8, i * 120 + 53, 0.6],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.artillery, OGg.pelleter, OGg.twin, OGg.pounder, { reload: 0.3, damage: 5, health: 5, pen: 5 }]),
                TYPE: "bullet",
                LABEL: "Devastator Secondary",
            },
        },
        {
            POSITION: [8, 3, 1, 6, 7, i * 120 + 67, 0.8],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.artillery, OGg.pelleter, OGg.twin, OGg.pounder, { reload: 0.3, damage: 5, health: 5, pen: 5 }]),
                TYPE: "bullet",
                LABEL: "Devastator Secondary",
            },
        },
        {
            POSITION: [8, 3, 1, 6, -7, i * 120 + 53, 0.8],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.artillery, OGg.pelleter, OGg.twin, OGg.pounder, { reload: 0.3, damage: 5, health: 5, pen: 5 }]),
                TYPE: "bullet",
                LABEL: "Devastator Secondary",
            },
        },
    )
    Class.rainbowEliteDestroyerBDN.GUNS.push(
        {
            POSITION: [8, 16, 1, 6, 0, i * 120 + 60, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.pounder, OGg.pounder, OGg.destroyer, { reload: 0.55, damage: 3, health: 3, pen: 3 }]),
                TYPE: "bullet",
                LABEL: "Devastator Primary",
            },
        },
    )
}
Class.rainbowEliteGunnerBDN = {
    PARENT: ["rainbowEliteBDN"],
    UPGRADE_LABEL: "Rainbow Elite Gunner",
    UPGRADE_COLOR: "rainbow",
    FACING_TYPE: "toTarget",
    GUNS: [
        {
            POSITION: [14, 16, 1, 0, 0, 180, 0],
        },
        {
            POSITION: [14, 13, 1, 0, 0, 180, 0],
        }, {
            POSITION: [4, 16, 1.5, 14, 0, 180, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.trap, OGg.hexaTrapper, OGg.setTrap, OGg.setTrap, { reload: 0.8, damage: 3, health: 3, pen: 3 }]),
                TYPE: ["sunsethyperDriverPillboxBDN", { MOTION_TYPE: "glide" }],
                STAT_CALCULATOR: "trap",
            },
        },
        {
            POSITION: [4, 13, 1.5, 14, 0, 180, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.trap, OGg.hexaTrapper, OGg.setTrap, { reload: 0.8, range: 0, damage: 0 }]),
                TYPE: "bullet",
            },
        }, {
            POSITION: [6, 14, -2, 2, 0, 60, 0],
        }, {
            POSITION: [6, 14, -2, 2, 0, 300, 0],
        }, {
            POSITION: [6, 14, -2, 2, 0, 55, 0],
        }, {
            POSITION: [6, 14, -2, 2, 0, 305, 0],
        },
    ],
    AI: { NO_LEAD: false },
    TURRETS: [
        {
            POSITION: [14, 8, 0, 60, 180, 0],
            TYPE: ["superbrimmerGunBDN"],
        }, {
            POSITION: [14, 8, 0, 300, 180, 0],
            TYPE: ["superbrimmerGunBDN"],
        },
    ],
};
Class.rainbowEliteSprayerBDN = {
    PARENT: ["rainbowEliteBDN"],
    UPGRADE_LABEL: "Rainbow Elite Sprayer",
    UPGRADE_COLOR: "rainbow",
    SKILL: skillSet({
        rld: 0.7,
        dam: 0.5,
        pen: 0.8,
        str: 0.8,
        spd: 0.2,
        atk: 0.3,
        hlt: 1,
        shi: 0.7,
        rgn: 0.7,
        mob: 1,
    }),
    AI: { NO_LEAD: false },
    HAS_NO_RECOIL: true,
    GUNS: [],
    TURRETS: [
        {
            /*    SIZE         X             Y         ANGLE        ARC */
            POSITION: [6.5, 0, 0, 0, 360, 1],
            TYPE: ["supersprayerDodecagrammataTurretBDN", { INDEPENDENT: true }],
        }, {
            POSITION: [9, 6, -5, 180, 130, 0],
            TYPE: ["shyperSprayerGunBDN", { COLOR: "grey" }],
        }, {
            POSITION: [9, 6, 5, 180, 130, 0],
            TYPE: ["shyperSprayerGunBDN", { COLOR: "grey" }],
        }, {
            POSITION: [9, 6, 5, 60, 130, 0],
            TYPE: ["shyperSprayerGunBDN", { COLOR: "grey" }],
        }, {
            POSITION: [9, 6, -5, 60, 130, 0],
            TYPE: ["shyperSprayerGunBDN", { COLOR: "grey" }],
        }, {
            POSITION: [9, 6, 5, -60, 130, 0],
            TYPE: ["shyperSprayerGunBDN", { COLOR: "grey" }],
        }, {
            POSITION: [9, 6, -5, -60, 130, 0],
            TYPE: ["shyperSprayerGunBDN", { COLOR: "grey" }],
        },
    ],
};
Class.shypercarrierBDN = {
    PARENT: "autoTankGun",
    LABEL: "",
    STAT_NAMES: statnames.swarm,
    FACING_TYPE: "locksFacing",
    BODY: {
        FOV: base.FOV * 1.2,
    },
    GUNS: [
        {
            POSITION: [7, 8, 1, 7, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.battleship, OGg.carrier, { size: 3, reload: 2, damage: 6, health: 6, pen: 6 }]),
                TYPE: "swarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [7, 8, 1, 7, 2, 30, 0.333],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.battleship, OGg.carrier, { size: 3, reload: 2, damage: 6, health: 6, pen: 6 }]),
                TYPE: "swarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [7, 8, 1, 7, -2, -30, 0.333],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.battleship, OGg.carrier, { size: 3, reload: 2, damage: 6, health: 6, pen: 6 }]),
                TYPE: "swarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [7, 8, 1, 7, 4, 60, 0.667],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.battleship, OGg.carrier, { size: 3, reload: 2, damage: 6, health: 6, pen: 6 }]),
                TYPE: "swarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [7, 8, 1, 7, -4, -60, 0.667],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.battleship, OGg.carrier, { size: 3, reload: 1.5, damage: 5, health: 5, pen: 5 }]),
                TYPE: "swarm",
                STAT_CALCULATOR: "swarm",
            },
        },
    ],
}
Class.rainbowEliteBattleshipBDN = {
    PARENT: ["rainbowEliteBDN"],
    UPGRADE_LABEL: "Rainbow Elite Battleship",
    UPGRADE_COLOR: "rainbow",
    GUNS: [],
    TURRETS: [
        {
            POSITION: [5, 7.5, 0, 0, 360, 1],
            TYPE: "shypercarrierBDN",
        }, {
            POSITION: [5, 7.5, 0, 120, 360, 1],
            TYPE: "shypercarrierBDN",
        }, {
            POSITION: [5, 7.5, 0, 240, 360, 1],
            TYPE: "shypercarrierBDN",
        },
    ],
};
for (i = 0; i < 3; i++) {
    Class.rainbowEliteBattleshipBDN.GUNS.push(
        {
            POSITION: [4, 3, 0.6, 7, -11.25, i * 120 - 60, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.battleship, { size: 3, reload: 2, damage: 30, health: 30, pen: 30 }]),
                TYPE: "autoswarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [4, 3, 0.6, 7, 11.25, i * 120 - 60, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.battleship, { size: 3, reload: 2, damage: 30, health: 30, pen: 30 }]),
                TYPE: "autoswarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [4, 3, 0.6, 7, -7.25, i * 120 - 60, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.battleship, { size: 3, reload: 2, damage: 30, health: 30, pen: 30 }]),
                TYPE: "autoswarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [4, 3, 0.6, 7, 7.25, i * 120 - 60, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.battleship, { size: 3, reload: 2, damage: 30, health: 30, pen: 30 }]),
                TYPE: "autoswarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [4, 3, 0.6, 7, 2, i * 120 - 60, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.battleship, { size: 3, reload: 2, damage: 30, health: 30, pen: 30 }]),
                TYPE: "autoswarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [4, 3, 0.6, 7, -2, i * 120 - 60, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.battleship, { size: 3, reload: 2, damage: 30, health: 30, pen: 30 }]),
                TYPE: "autoswarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [5, 5, 0.6, 7, 0, i * 120 - 60, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.battleship, { size: 3, reload: 2, damage: 40, health: 40, pen: 40 }]),
                TYPE: "autoswarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [5, 5, 0.6, 7, -9.25, i * 120 - 60, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.battleship, { size: 3, reload: 2, damage: 40, health: 40, pen: 40 }]),
                TYPE: "autoswarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [5, 5, 0.6, 7, 9.25, i * 120 - 60, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.battleship, { size: 3, reload: 2, damage: 40, health: 40, pen: 40 }]),
                TYPE: "autoswarm",
                STAT_CALCULATOR: "swarm",
            },
        },
    )
}
Class.rainbowSentryBDN = {
    PARENT: ["sentry"],
    COLOR: "rainbow",
    UPGRADE_COLOR: "rainbow",
    DANGER: 4,
    SIZE: 20,
    VALUE: 2e6,
    SHAPE: 3,
    BODY: {
        HEALTH: 5 * base.HEALTH
    },
};
Class.rainbowSentrySwarmBDN = {
    PARENT: ["rainbowSentryBDN"],
    UPGRADE_LABEL: "Rainbow Swarm Sentry",
    UPGRADE_COLOR: "rainbow",
    GUNS: [

        {
            POSITION: [7, 9, 0.6, 7, 2.5, 60, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, { recoil: 0.1 }, { reload: 0.8, damage: 3, health: 3, pen: 3 }]),
                TYPE: "swarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [7, 9, 0.6, 7, -2.5, 300, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, { recoil: 0.1 }, { reload: 0.8, damage: 3, health: 3, pen: 3 }]),
                TYPE: "swarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [7, 9, 0.6, 7, -2.5, 60, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, { recoil: 0.1 }, { reload: 0.8, damage: 3, health: 3, pen: 3 }]),
                TYPE: "swarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [7, 9, 0.6, 7, 2.5, 300, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, { recoil: 0.1 }, { reload: 0.8, damage: 3, health: 3, pen: 3 }]),
                TYPE: "swarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [7, 9, 0.6, 7, 0, 60, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, { recoil: 0.1 }, { reload: 0.8, damage: 3, health: 3, pen: 3 }]),
                TYPE: "swarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [7, 9, 0.6, 7, 0, 300, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, { recoil: 0.1 }, { reload: 0.8, damage: 3, health: 3, pen: 3 }]),
                TYPE: "swarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [6, 13, 1.3, 7, 0, 180, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, { recoil: 1.15 }, OGg.machineGun, { reload: 0.4, damage: 3.5, health: 3.5, pen: 3.5 }]),
                TYPE: "swarm",
                STAT_CALCULATOR: "swarm",
            },
        },
    ],
};
Class.supermegabarricaderAutoTankGunBDN = {
    PARENT: ["genericTank"],
    LABEL: "Turret",
    BODY: {
        FOV: 0.5,
    },
    INDEPENDENT: true,
    CONTROLLERS: ["nearestDifferentMaster"],
    COLOR: "grey",
    AI: {
        SKYNET: true,
        FULL_VIEW: true,
    },
    GUNS: [
        {
            POSITION: [24, 10, 1, 0, 0, 0, 0],
        },
        {
            POSITION: [4, 10, 1.3, 2, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.trap, OGg.minigun, { range: 0.6 }, { reload: 0.8, damage: 10, health: 10, pen: 10 }]),
                TYPE: "trap",
                STAT_CALCULATOR: "trap",
            },
        },

        {
            POSITION: [4, 10, 1.3, 30, 0, 0, 1 / 6],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.trap, OGg.minigun, { range: 0.6 }, { reload: 0.8, damage: 10, health: 10, pen: 10 }]),
                TYPE: "trap",
                STAT_CALCULATOR: "trap",
            },
        },
        {
            POSITION: [4, 10, 1.3, 26, 0, 0, 2 / 6],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.trap, OGg.minigun, { range: 0.6 }, { reload: 0.8, damage: 10, health: 10, pen: 10 }]),
                TYPE: "trap",
                STAT_CALCULATOR: "trap",
            },
        },
        {
            POSITION: [4, 10, 1.3, 22, 0, 0, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.trap, OGg.minigun, { range: 0.6 }, { reload: 0.8, damage: 10, health: 10, pen: 10 }]),
                TYPE: "trap",
                STAT_CALCULATOR: "trap",
            },
        },
        {
            POSITION: [4, 10, 1.3, 18, 0, 0, 4 / 6],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.trap, OGg.minigun, { range: 0.6 }, { reload: 0.8, damage: 10, health: 10, pen: 10 }]),
                TYPE: "trap",
                STAT_CALCULATOR: "trap",
            },
        },
        {
            POSITION: [4, 10, 1.3, 14, 0, 0, 5 / 6],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.trap, OGg.minigun, { range: 0.6 }, { reload: 0.8, damage: 10, health: 10, pen: 10 }]),
                TYPE: "trap",
                STAT_CALCULATOR: "trap",
            },
        },
    ],
};
Class.rainbowSentryTrapBDN = makeAuto(Class.rainbowSentryBDN, "Sentry", {
    type: Class.supermegabarricaderAutoTankGunBDN,
    size: 12,
});
Class.rainbowSentryTrapBDN.UPGRADE_LABEL = "Rainbow Trap Sentry";
Class.rainbowSentryTrapBDN.GUNS = [
    {
        POSITION: [14, 11, 1, 0, 0, 180, 0],
    },
    {
        POSITION: [3, 11, 1.2, 14, 0, 180, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([OGg.trap, OGg.setTrap, { recoil: 1.15 }, { reload: 0.8, damage: 2.5, health: 2.7, pen: 2.7 }]),
            TYPE: "setTrap",
            STAT_CALCULATOR: "trap",
        },
    },
]
Class.ssupermortarAutoTankgunBDN = {
    PARENT: ["genericTank"],
    LABEL: "Mortar",
    BODY: {
        FOV: 2,
    },
    CONTROLLERS: [
        "canRepel",
        "onlyAcceptInArc",
        "mapAltToFire",
        "nearestDifferentMaster",
    ],
    COLOR: "grey",
    GUNS: [
        {
            POSITION: [17, 3, 1, 0, -6.5, -9, 1 / 5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.pelleter, OGg.artillery, { reload: 0.25, damage: 2.2, health: 2, pen: 2 }]),
                TYPE: "bullet",
                LABEL: "Tetiary",
            },
        },
        {
            POSITION: [17, 3, 1, 0, 6.5, 9, 1 / 5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.pelleter, OGg.artillery, { reload: 0.25, damage: 2.2, health: 2, pen: 2 }]),
                TYPE: "bullet",
                LABEL: "Tetiary",
            },
        },
        {
            POSITION: [17.5, 3, 1, 0, -6, -7, 2 / 5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.pelleter, OGg.artillery, { reload: 0.25, damage: 2.2, health: 2, pen: 2 }]),
                TYPE: "bullet",
                LABEL: "Secondary",
            },
        },
        {
            POSITION: [17.5, 3, 1, 0, 6, 7, 2 / 5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.pelleter, OGg.artillery, { reload: 0.25, damage: 2.2, health: 2, pen: 2 }]),
                TYPE: "bullet",
                LABEL: "Secondary",
            },
        },
        {
            POSITION: [18, 3, 1, 0, -5.5, -5, 3 / 5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.pelleter, OGg.artillery, { reload: 0.25, damage: 2.2, health: 2, pen: 2 }]),
                TYPE: "bullet",
                LABEL: "Secondary",
            },
        },
        {
            POSITION: [18, 3, 1, 0, 5.5, 5, 3 / 5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.pelleter, OGg.artillery, { reload: 0.25, damage: 2.2, health: 2, pen: 2 }]),
                TYPE: "bullet",
                LABEL: "Secondary",
            },
        },
        {
            POSITION: [18.5, 3, 1, 0, -4.5, -5, 4 / 5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.pelleter, OGg.artillery, { reload: 0.25, damage: 2.2, health: 2, pen: 2 }]),
                TYPE: "bullet",
                LABEL: "Secondary",
            },
        },
        {
            POSITION: [18.5, 3, 1, 0, 4.5, 5, 4 / 5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.pelleter, OGg.artillery, { reload: 0.25, damage: 2.2, health: 2, pen: 2 }]),
                TYPE: "bullet",
                LABEL: "Secondary",
            },
        },
        {
            POSITION: [19, 12, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.pounder, OGg.artillery, { reload: 0.25, damage: 2.2, health: 2, pen: 2 }]),
                TYPE: "bullet",
                LABEL: "Heavy",
            },
        },
    ],
};
Class.rainbowSentryGunBDN = makeAuto(Class.rainbowSentryBDN, "Sentry", {
    type: Class.ssupermortarAutoTankgunBDN,
    size: 12,
});
Class.rainbowSentryGunBDN.UPGRADE_LABEL = "Rainbow Gun Sentry";
Class.rainbowSentryGunBDN.TURRETS.push(
    ...weaponArray({
        POSITION: [10, 10, 0, 0, 190, 0],
        TYPE: "shyperSprayerGunBDN",
    }, 3),
)
Class.rainbowEliteSpawnerBDN = {
    PARENT: ["rainbowEliteBDN"],
    UPGRADE_LABEL: "Rainbow Elite Spawner",
    UPGRADE_COLOR: "rainbow",
    MAX_CHILDREN: 5,
    AI: { STRAFE: false },
    GUNS: [
        {
            POSITION: [11, 16, 1, 0, 0, 60, 0],
        },

        {
            POSITION: [11, 16, 1, 0, 0, 180, 0],
        },

        {
            POSITION: [11, 16, 1, 0, 0, 300, 0],
        }, {
            /*** LENGTH    WIDTH     ASPECT        X             Y         ANGLE     DELAY */
            POSITION: [2, 18, 1, 11, 0, 60, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.drone, OGg.weak, { size: 0.4 }, { health: 0.5, reload: 0.6 }]),
                TYPE: ["rainbowSentrySwarmBDN", { GIVE_KILL_MESSAGE: false, VARIES_IN_SIZE: false }],
                SYNCS_SKILLS: true,
                AUTOFIRE: true,
                STAT_CALCULATOR: "drone",
            },
        }, {
            POSITION: [2, 18, 1, 11, 0, 180, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.drone, OGg.weak, { size: 0.4 }, { health: 0.5, reload: 0.6 }]),
                TYPE: ["rainbowSentryTrapBDN", { GIVE_KILL_MESSAGE: false, VARIES_IN_SIZE: false }],
                SYNCS_SKILLS: true,
                AUTOFIRE: true,
                STAT_CALCULATOR: "drone",
            },
        }, {
            POSITION: [2, 18, 1, 11, 0, 300, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.drone, OGg.weak, { size: 0.4 }, { health: 0.5, reload: 0.6 }]),
                TYPE: ["rainbowSentryGunBDN", { GIVE_KILL_MESSAGE: false, VARIES_IN_SIZE: false }],
                SYNCS_SKILLS: true,
                AUTOFIRE: true,
                STAT_CALCULATOR: "drone",
            },
        },
        {
            POSITION: [13, 10, 1, 0, 0, 60, 0],
        },
        {
            POSITION: [10, 3, 1, 2, -6, 55, 0],
        },
        {
            POSITION: [10, 3, 1, 2, 6, 65, 0],
        },
        {
            POSITION: [7, 3, 1, 4, -8, 50, 0],
        },
        {
            POSITION: [7, 3, 1, 4, 8, 70, 0],
        },


        {
            POSITION: [4, 5, 1.6, 10.25, 0, 180, 0],
        },
        {
            POSITION: [4, 5, 1.6, 9.5, 0, 180, 0],
        },
        {
            POSITION: [4, 5, 1.6, 8.75, 0, 180, 0],
        },
        {
            POSITION: [4, 5, 1.6, 8, 0, 180, 0],
        },

        {
            POSITION: [5, 6, 1.65, 8, 0, 300, 0],
        },
        {
            POSITION: [6, 6, 0.6, 8, 0, 300, 0],
        },
    ],
    TURRETS: [
        {
            POSITION: [11, 0, 0, 0, 360, 1],
            TYPE: ["octupletGunBDN", { INDEPENDENT: false, COLOR: -1 }],
        },
    ],
};
Class.rainbowEliteTrapGuardTopBDN = {
    PARENT: ["genericTank"],
    COLOR: -1,
    CONTROLLERS: [["spin", { independent: true }]],
    GUNS: [],
};
for (let i = 0; i < 4; i++) {
    Class.rainbowEliteTrapGuardTopBDN.GUNS.push(
        {
            POSITION: [19, 8, 1, 0, 0, 90 * i, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.flankGuard, OGg.minigun, OGg.flankGuard, { reload: 1, damage: 3.5, health: 3.5, pen: 3.5 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [17, 8, 1, 0, 0, 90 * i, 0.2],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.flankGuard, OGg.minigun, OGg.flankGuard, { reload: 1, damage: 3.5, health: 3.5, pen: 3.5 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [15, 8, 1, 0, 0, 90 * i, 0.4],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.flankGuard, OGg.minigun, OGg.flankGuard, { reload: 1, damage: 3.5, health: 3.5, pen: 3.5 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [13, 8, 1, 0, 0, 90 * i, 0.6],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.flankGuard, OGg.minigun, OGg.flankGuard, { reload: 1, damage: 3.5, health: 3.5, pen: 3.5 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [13, 8, 1, 0, 0, 90 * i, 0.8],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.flankGuard, OGg.minigun, OGg.flankGuard, { reload: 1, damage: 3.5, health: 3.5, pen: 3.5 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [20, 8, 1, 0, 0, 90 * i + 45, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.flankGuard, OGg.flankGuard, { reload: 1.3, damage: 3.35, health: 3.35, pen: 3.35 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [18, 8, 1, 0, 0, 90 * i + 45, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.flankGuard, OGg.flankGuard, { reload: 1.3, damage: 3.35, health: 3.35, pen: 3.35 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [4, 8, 1.7, 13, 0, 90 * i + 45, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.trap, { reload: 1.3, damage: 3.35, health: 3.35, pen: 3.35 }]),
                TYPE: "trap",
                STAT_CALCULATOR: "trap",
            },
        },
    )
};
Class.rainbowEliteTrapGuardBDN = {
    PARENT: ["rainbowEliteBDN"],
    UPGRADE_LABEL: "Rainbow Elite Trap Guard",
    UPGRADE_COLOR: "rainbow",
    AI: { STRAFE: false },
    GUNS: [],
    TURRETS: [
        {
            POSITION: [9.5, 0, 0, 0, 360, 1],
            TYPE: "rainbowEliteTrapGuardTopBDN",
        },
    ],
};
for (let i = 0; i < 3; i++) {
    Class.rainbowEliteTrapGuardBDN.GUNS.push(
        {
            POSITION: [10.5, 8, 1, 0, 0, 120 * i + 60, 0],
        },
        {
            POSITION: [2, 8, 1.4, 10.5, 0, 120 * i + 60, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.trap, OGg.setTrap, { reload: 2, damage: 8, health: 8, pen: 8 }]),
                TYPE: "unsetPillbox",
                MAX_CHILDREN: 5,
                STAT_CALCULATOR: "trap",
            },
        },
        {
            POSITION: [9, 10, 1, 0, 0, 120 * i + 60, 0],
        },
    )
    Class.rainbowEliteTrapGuardBDN.TURRETS.push(
        {
            POSITION: [5.5, 8, -9, 120 * i + 60, 160, 0],
            TYPE: ["DoomsayerGunBDN", { INDEPENDENT: false, }],
        }, {
        POSITION: [5.5, 8, 9, 120 * i + 60, 160, 0],
        TYPE: ["DoomsayerGunBDN", { INDEPENDENT: false, }],
    },
    )
};
Class.rainbowEliteSpinnerCycloneBDN = {
    PARENT: ["genericTank"],
    COLOR: -1,
    CONTROLLERS: [["spin", { speed: 0.1, independent: true }]],
    GUNS: [],
};
for (let i = 0; i < 32; i++) {
    Class.rainbowEliteSpinnerCycloneBDN.GUNS.push(
        {
            POSITION: [18, 8, 1, 0, 0, (11.25 * i), 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.flankGuard, { reload: 1, speed: 2, maxSpeed: 2.3, damage: 5.5, health: 5.5, pen: 5.5 }]),
                TYPE: "bullet",
            },
        },
    )
};
for (let i = 0; i < 16; i++) {
    Class.rainbowEliteSpinnerCycloneBDN.GUNS.push(
        {
            POSITION: [15, 3, 1, 0, 0, (22.5 * i) + 11.25, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.gunner, { reload: 1.8, speed: 2.8, maxSpeed: 1.9, damage: 5.5, health: 5.5, pen: 5.5 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [15, 3, 1, 0, 0, (22.5 * i) - 11.25, 1 / 2],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.gunner, { reload: 1.8, speed: 2.8, maxSpeed: 1.9, damage: 5.5, health: 5.5, pen: 5.5 }]),
                TYPE: "bullet",
            },
        },
    )
};
Class.rainbowEliteSpinnerBDN = {
    PARENT: ["rainbowEliteBDN"],
    UPGRADE_LABEL: "Rainbow Elite Spinner",
    UPGRADE_COLOR: "rainbow",
    SKILL: skillSet({
        rld: 0.7,
        dam: 0.5,
        pen: 0.8,
        str: 0.8,
        spd: 0.2,
        atk: 0.3,
        hlt: 1,
        shi: 0.7,
        rgn: 0.7,
        mob: 1,
    }),
    AI: { STRAFE: false },
    FACING_TYPE: ["spin", { speed: 0.1 }],
    GUNS: [],
    TURRETS: [
        {
            POSITION: [9.5, 0, 0, 0, 360, 1],
            TYPE: ["rainbowEliteSpinnerCycloneBDN", { COLOR: -1 }],
        },
    ],
};
for (let i = 0; i < 3; i++) {
    Class.rainbowEliteSpinnerBDN.GUNS.push(
        {
            POSITION: [8.5, 1.25, 1, -1.5, 11.5, 120 * i + 10, 8 / 10],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.twin, OGg.gunner, { speed: 1.3, maxSpeed: 1.3, reload: 2, damage: 5, health: 5, pen: 5 }]),
                TYPE: "bullet",
            },
        }, {
        POSITION: [8.5, 1.25, 1, 2, 9, 120 * i + 10, 6 / 10],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([OGg.basic, OGg.twin, OGg.gunner, { speed: 1.3, maxSpeed: 1.3, reload: 2, damage: 5, health: 5, pen: 5 }]),
            TYPE: "bullet",
        },
    }, {
        POSITION: [8.5, 1.25, 1, 3.5, 6.5, 120 * i + 10, 4 / 10],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([OGg.basic, OGg.twin, OGg.gunner, { speed: 1.3, maxSpeed: 1.3, reload: 2, damage: 5, health: 5, pen: 5 }]),
            TYPE: "bullet",
        },
    }, {
        POSITION: [8.5, 1.25, 1, 6, 4, 120 * i + 10, 2 / 10],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([OGg.basic, OGg.twin, OGg.gunner, { speed: 1.3, maxSpeed: 1.3, reload: 2, damage: 5, health: 5, pen: 5 }]),
            TYPE: "bullet",
        },
    }, {
        POSITION: [8.5, 1.25, 1, 8.5, 1.5, 120 * i + 10, 0 / 10],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([OGg.basic, OGg.twin, OGg.gunner, { speed: 1.3, maxSpeed: 1.3, reload: 2, damage: 5, health: 5, pen: 5 }]),
            TYPE: "bullet",
        },
    },
        {
            POSITION: [7.5, 2, 1, -1.5, 11.5, 120 * i + 10, 5 / 6],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.twin, OGg.gunner, { speed: 1.3, maxSpeed: 1.3, reload: 2, damage: 5, health: 5, pen: 5 }]),
                TYPE: "bullet",
            },
        }, {
        POSITION: [7.5, 2, 1, 2, 9, 120 * i + 10, 4 / 6],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([OGg.basic, OGg.twin, OGg.gunner, { speed: 1.3, maxSpeed: 1.3, reload: 2, damage: 5, health: 5, pen: 5 }]),
            TYPE: "bullet",
        },
    }, {
        POSITION: [7.5, 2, 1, 3.5, 6.5, 120 * i + 10, 3 / 6],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([OGg.basic, OGg.twin, OGg.gunner, { speed: 1.3, maxSpeed: 1.3, reload: 2, damage: 5, health: 5, pen: 5 }]),
            TYPE: "bullet",
        },
    }, {
        POSITION: [7.5, 2, 1, 6, 4, 120 * i + 10, 2 / 6],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([OGg.basic, OGg.twin, OGg.gunner, { speed: 1.3, maxSpeed: 1.3, reload: 2, damage: 5, health: 5, pen: 5 }]),
            TYPE: "bullet",
        },
    }, {
        POSITION: [7.5, 2, 1, 8.5, 1.5, 120 * i + 10, 1 / 6],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([OGg.basic, OGg.twin, OGg.gunner, { speed: 1.3, maxSpeed: 1.3, reload: 2, damage: 5, health: 5, pen: 5 }]),
            TYPE: "bullet",
        },
    },

        {
            POSITION: [6.5, 2, 1, -1.5, 11.5, 120 * i + 10, 6 / 7],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.twin, OGg.gunner, { speed: 1.3, maxSpeed: 1.3, reload: 2, damage: 5, health: 5, pen: 5 }]),
                TYPE: "bullet",
            },
        }, {
        POSITION: [6.5, 2, 1, 2, 9, 120 * i + 10, 5 / 7],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([OGg.basic, OGg.twin, OGg.gunner, { speed: 1.3, maxSpeed: 1.3, reload: 2, damage: 5, health: 5, pen: 5 }]),
            TYPE: "bullet",
        },
    }, {
        POSITION: [6.5, 2, 1, 3.5, 6.5, 120 * i + 10, 4 / 7],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([OGg.basic, OGg.twin, OGg.gunner, { speed: 1.3, maxSpeed: 1.3, reload: 2, damage: 5, health: 5, pen: 5 }]),
            TYPE: "bullet",
        },
    }, {
        POSITION: [6.5, 2, 1, 6, 4, 120 * i + 10, 3 / 7],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([OGg.basic, OGg.twin, OGg.gunner, { speed: 1.3, maxSpeed: 1.3, reload: 2, damage: 5, health: 5, pen: 5 }]),
            TYPE: "bullet",
        },
    }, {
        POSITION: [6.5, 2, 1, 8.5, 1.5, 120 * i + 10, 2 / 7],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([OGg.basic, OGg.twin, OGg.gunner, { speed: 1.3, maxSpeed: 1.3, reload: 2, damage: 5, health: 5, pen: 5 }]),
            TYPE: "bullet",
        },
    },

        {
            POSITION: [5.5, 2, 1, -1.5, 11.5, 120 * i + 10, 7 / 8],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.twin, OGg.gunner, { speed: 1.3, maxSpeed: 1.3, reload: 2, damage: 5, health: 5, pen: 5 }]),
                TYPE: "bullet",
            },
        }, {
        POSITION: [5.5, 2, 1, 2, 9, 120 * i + 10, 6 / 8],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([OGg.basic, OGg.twin, OGg.gunner, { speed: 1.3, maxSpeed: 1.3, reload: 2, damage: 5, health: 5, pen: 5 }]),
            TYPE: "bullet",
        },
    }, {
        POSITION: [5.5, 2, 1, 3.5, 6.5, 120 * i + 10, 5 / 8],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([OGg.basic, OGg.twin, OGg.gunner, { speed: 1.3, maxSpeed: 1.3, reload: 2, damage: 5, health: 5, pen: 5 }]),
            TYPE: "bullet",
        },
    }, {
        POSITION: [5.5, 2, 1, 6, 4, 120 * i + 10, 4 / 8],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([OGg.basic, OGg.twin, OGg.gunner, { speed: 1.3, maxSpeed: 1.3, reload: 2, damage: 5, health: 5, pen: 5 }]),
            TYPE: "bullet",
        },
    }, {
        POSITION: [5.5, 2, 1, 8.5, 1.5, 120 * i + 10, 3 / 8],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([OGg.basic, OGg.twin, OGg.gunner, { speed: 1.3, maxSpeed: 1.3, reload: 2, damage: 5, health: 5, pen: 5 }]),
            TYPE: "bullet",
        },
    }, {
        POSITION: [2, 20, 0.75, 8, 0, 120 * i + 60, 0],
    },
    )
};


















// Legions
Class.rainbowdestroyerLegion = {
    PARENT: ["rainbowEliteBDN"],
    UPGRADE_LABEL: "Rainbow Destroyer Legion",
    NAME: "Rainbow Destroyer Legion",
    DISPLAY_NAME: false,
    UPGRADE_COLOR: "rainbow",
    AI: { NO_LEAD: false },
    SIZE: 30,
    GUNS: [],
    BODY: {
        HEALTH: 100 * base.HEALTH,
    },
    TURRETS: [
        {
            POSITION: [11, 0, 0, 180, 360, 0],
            TYPE: ["crasherSpawnerlimited", { GUN_STAT_SCALE: { health: 1.1 } }],
        }, {
            POSITION: [11, 0, 0, 60, 360, 0],
            TYPE: ["crasherSpawnerlimited", { GUN_STAT_SCALE: { health: 1.1 } }],
        }, {
            POSITION: [11, 0, 0, -60, 360, 0],
            TYPE: ["crasherSpawnerlimited", { GUN_STAT_SCALE: { health: 1.1 } }],
        }, {
            POSITION: [11, 0, 0, 240, 360, 0],
            TYPE: ["crasherSpawnerlimited", { GUN_STAT_SCALE: { health: 1.1 } }],
        }, {
            POSITION: [11, 0, 0, 120, 360, 0],
            TYPE: ["crasherSpawnerlimited", { GUN_STAT_SCALE: { health: 1.1 } }],
        }, {
            POSITION: [11, 0, 0, 0, 360, 0],
            TYPE: ["crasherSpawnerlimited", { GUN_STAT_SCALE: { health: 1.1 } }],
        }, {
            POSITION: [11, 0, 0, 0, 360, 1],
            TYPE: ["octupletGunBDN", { GUN_STAT_SCALE: { health: 1.1 }, INDEPENDENT: true, COLOR: -1 }],
        },
    ],
};
for (let i = 0; i < 3; i++) {
    Class.rainbowdestroyerLegion.GUNS.push(
        {
            POSITION: [5, 3, 1, 6, 10, i * 120 + 67, 0.2],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.artillery, OGg.pelleter, OGg.twin, OGg.pounder, { reload: 0.3, damage: 5, health: 5.5, pen: 5 }]),
                TYPE: "bullet",
                LABEL: "Devastator Tertiary",
            },
        },
        {
            POSITION: [5, 3, 1, 6, -10, i * 120 + 53, 0.2],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.artillery, OGg.pelleter, OGg.twin, OGg.pounder, { reload: 0.3, damage: 5, health: 5.5, pen: 5 }]),
                TYPE: "bullet",
                LABEL: "Devastator Tertiary",
            },
        },
        {
            POSITION: [6, 3, 1, 6, 9, i * 120 + 67, 0.4],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.artillery, OGg.pelleter, OGg.twin, OGg.pounder, { reload: 0.3, damage: 5, health: 5.5, pen: 5 }]),
                TYPE: "bullet",
                LABEL: "Devastator Tertiary",
            },
        },
        {
            POSITION: [6, 3, 1, 6, -9, i * 120 + 53, 0.4],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.artillery, OGg.pelleter, OGg.twin, OGg.pounder, { reload: 0.3, damage: 5, health: 5.5, pen: 5 }]),
                TYPE: "bullet",
                LABEL: "Devastator Tertiary",
            },
        },
        {
            POSITION: [7, 3, 1, 6, 8, i * 120 + 67, 0.6],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.artillery, OGg.pelleter, OGg.twin, OGg.pounder, { reload: 0.3, damage: 5, health: 5.5, pen: 5 }]),
                TYPE: "bullet",
                LABEL: "Devastator Secondary",
            },
        },
        {
            POSITION: [7, 3, 1, 6, -8, i * 120 + 53, 0.6],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.artillery, OGg.pelleter, OGg.twin, OGg.pounder, { reload: 0.3, damage: 5, health: 5.5, pen: 5 }]),
                TYPE: "bullet",
                LABEL: "Devastator Secondary",
            },
        },
        {
            POSITION: [8, 3, 1, 6, 7, i * 120 + 67, 0.8],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.artillery, OGg.pelleter, OGg.twin, OGg.pounder, { reload: 0.3, damage: 5, health: 5.5, pen: 5 }]),
                TYPE: "bullet",
                LABEL: "Devastator Secondary",
            },
        },
        {
            POSITION: [8, 3, 1, 6, -7, i * 120 + 53, 0.8],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.artillery, OGg.pelleter, OGg.twin, OGg.pounder, { reload: 0.3, damage: 5, health: 5.5, pen: 5 }]),
                TYPE: "bullet",
                LABEL: "Devastator Secondary",
            },
        },
    )
    Class.rainbowdestroyerLegion.GUNS.push(
        {
            POSITION: [8, 16, 1, 6, 0, i * 120 + 60, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.pounder, OGg.pounder, OGg.destroyer, { reload: 0.5, damage: 3, health: 3.3, pen: 3 }]),
                TYPE: "bullet",
                LABEL: "Devastator Primary",
            },
        },
    )
}
Class.rainbowgunnerLegion = {
    PARENT: ["rainbowEliteBDN"],
    UPGRADE_LABEL: "Rainbow Gunner Legion",
    NAME: "Rainbow Gunner Legion",
    DISPLAY_NAME: false,
    UPGRADE_COLOR: "rainbow",
    FACING_TYPE: "toTarget",
    AI: { NO_LEAD: false },
    SIZE: 30,
    BODY: {
        HEALTH: 100 * base.HEALTH,
    },
    GUNS: [
        {
            POSITION: [14, 16, 1, 0, 0, 180, 0],
        },
        {
            POSITION: [14, 13, 1, 0, 0, 180, 0],
        }, {
            POSITION: [4, 16, 1.5, 14, 0, 180, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.trap, OGg.hexaTrapper, OGg.setTrap, { reload: 0.8, damage: 3, health: 3.5, pen: 3 }]),
                TYPE: ["sunsethyperDriverPillboxBDN", { MOTION_TYPE: "glide" }],
                STAT_CALCULATOR: "trap",
            },
        },
        {
            POSITION: [4, 13, 1.5, 14, 0, 180, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.trap, OGg.hexaTrapper, OGg.setTrap, { reload: 0.8, range: 0, damage: 0, health: 1.1 }]),
                TYPE: "bullet",
            },
        }, {
            POSITION: [6, 14, -2, 2, 0, 60, 0],
        }, {
            POSITION: [6, 14, -2, 2, 0, 300, 0],
        }, {
            POSITION: [6, 14, -2, 2, 0, 55, 0],
        }, {
            POSITION: [6, 14, -2, 2, 0, 305, 0],
        },
    ],
    AI: { NO_LEAD: false },
    TURRETS: [
        {
            POSITION: [14, 8, 0, 60, 180, 0],
            TYPE: ["superbrimmerGunBDN", { GUN_STAT_SCALE: { health: 1.15 } }],
        }, {
            POSITION: [14, 8, 0, 300, 180, 0],
            TYPE: ["superbrimmerGunBDN", { GUN_STAT_SCALE: { health: 1.15 } }],
        },
    ],
}
Class.rainbowsprayerLegion = {
    PARENT: ["rainbowEliteBDN"],
    UPGRADE_LABEL: "Rainbow Sprayer Legion",
    NAME: "Rainbow Sprayer Legion",
    DISPLAY_NAME: false,
    UPGRADE_COLOR: "rainbow",
    AI: { NO_LEAD: false },
    SIZE: 30,
    SKILL: [0, 9, 3, 9, 2, 9, 9, 9, 9, 0],
    HAS_NO_RECOIL: true,
    BODY: {
        HEALTH: 100 * base.HEALTH,
    },
    TURRETS: weaponArray({
        POSITION: [14, 6, 0, 60, 190, 0],
        TYPE: ["hyperSprayerGunBDN", { GUN_STAT_SCALE: { health: 3.2, damage: 3.3, speed: 3.3, resist: 1.15 }, COLOR: -1 }],
    }, 3)
}
Class.rainbowbattleshipLegion = {
    PARENT: ["rainbowEliteBDN"],
    UPGRADE_LABEL: "Rainbow Battleship Legion",
    NAME: "Rainbow Battleship Legion",
    DISPLAY_NAME: false,
    UPGRADE_COLOR: "rainbow",
    AI: { NO_LEAD: false },
    SIZE: 30,
    BODY: {
        HEALTH: 100 * base.HEALTH,
    },
    GUNS: [],
    TURRETS: [
        {
            POSITION: [5, 7.5, 0, 0, 360, 1],
            TYPE: ["shypercarrierBDN", { GUN_STAT_SCALE: { health: 1.1 }, INDEPENDENT: true, COLOR: -1, PARENT: "shypercarrierBDN" }],
        }, {
            POSITION: [5, 7.5, 0, 120, 360, 1],
            TYPE: ["shypercarrierBDN", { GUN_STAT_SCALE: { health: 1.1 }, INDEPENDENT: true, COLOR: -1, PARENT: "shypercarrierBDN" }],
        }, {
            POSITION: [5, 7.5, 0, 240, 360, 1],
            TYPE: ["shypercarrierBDN", { GUN_STAT_SCALE: { health: 1.1 }, INDEPENDENT: true, COLOR: -1, PARENT: "shypercarrierBDN" }],
        },
    ],
};
for (i = 0; i < 3; i++) {
    Class.rainbowbattleshipLegion.GUNS.push(
        {
            POSITION: [4, 3, 0.6, 7, -11.25, i * 120 - 60, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.battleship, { size: 3, reload: 2, damage: 30, health: 30, pen: 30 }]),
                TYPE: "autoswarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [4, 3, 0.6, 7, 11.25, i * 120 - 60, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.battleship, { size: 3, reload: 2, damage: 30, health: 30, pen: 30 }]),
                TYPE: "autoswarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [4, 3, 0.6, 7, -7.25, i * 120 - 60, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.battleship, { size: 3, reload: 2, damage: 30, health: 30, pen: 30 }]),
                TYPE: "autoswarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [4, 3, 0.6, 7, 7.25, i * 120 - 60, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.battleship, { size: 3, reload: 2, damage: 30, health: 30, pen: 30 }]),
                TYPE: "autoswarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [4, 3, 0.6, 7, 2, i * 120 - 60, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.battleship, { size: 3, reload: 2, damage: 30, health: 30, pen: 30 }]),
                TYPE: "autoswarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [4, 3, 0.6, 7, -2, i * 120 - 60, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.battleship, { size: 3, reload: 2, damage: 30, health: 30, pen: 30 }]),
                TYPE: "autoswarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [5, 5, 0.6, 7, 0, i * 120 - 60, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.battleship, { size: 3, reload: 2, damage: 40, health: 40, pen: 40 }]),
                TYPE: "autoswarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [5, 5, 0.6, 7, -9.25, i * 120 - 60, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.battleship, { size: 3, reload: 2, damage: 40, health: 40, pen: 40 }]),
                TYPE: "autoswarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [5, 5, 0.6, 7, 9.25, i * 120 - 60, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.battleship, { size: 3, reload: 2, damage: 40, health: 40, pen: 40 }]),
                TYPE: "autoswarm",
                STAT_CALCULATOR: "swarm",
            },
        },
    )
}
Class.rainbowspawnerLegion = {
    PARENT: ["rainbowEliteBDN"],
    UPGRADE_LABEL: "Rainbow Spawner Legion",
    NAME: "Rainbow Spawner Legion",
    DISPLAY_NAME: false,
    UPGRADE_COLOR: "rainbow",
    AI: { NO_LEAD: false },
    SIZE: 30,
    BODY: {
        HEALTH: 100 * base.HEALTH,
    },
    GUNS: [
        {
            POSITION: [11, 16, 1, 0, 0, 60, 0],
        },

        {
            POSITION: [11, 16, 1, 0, 0, 180, 0],
        },

        {
            POSITION: [11, 16, 1, 0, 0, 300, 0],
        }, {
            /*** LENGTH    WIDTH     ASPECT        X             Y         ANGLE     DELAY */
            POSITION: [2, 18, 1, 11, 0, 60, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.drone, OGg.weak, OGg.weak, OGg.weak, { size: 0.4 }, { health: 0.25, reload: 0.75 }]),
                TYPE: ["rainbowSentrySwarmBDN", { GIVE_KILL_MESSAGE: false, VARIES_IN_SIZE: false }],
                SYNCS_SKILLS: true,
                AUTOFIRE: true,
                STAT_CALCULATOR: "drone",
            },
        }, {
            POSITION: [2, 18, 1, 11, 0, 180, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.drone, OGg.weak, OGg.weak, OGg.weak, { size: 0.4 }, { health: 0.25, reload: 0.75 }]),
                TYPE: ["rainbowSentryTrapBDN", { GIVE_KILL_MESSAGE: false, VARIES_IN_SIZE: false }],
                SYNCS_SKILLS: true,
                AUTOFIRE: true,
                STAT_CALCULATOR: "drone",
            },
        }, {
            POSITION: [2, 18, 1, 11, 0, 300, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.drone, OGg.weak, OGg.weak, OGg.weak, { size: 0.4 }, { health: 0.25, reload: 0.75 }]),
                TYPE: ["rainbowSentryGunBDN", { GIVE_KILL_MESSAGE: false, VARIES_IN_SIZE: false }],
                SYNCS_SKILLS: true,
                AUTOFIRE: true,
                STAT_CALCULATOR: "drone",
            },
        },
        {
            POSITION: [13, 10, 1, 0, 0, 60, 0],
        },
        {
            POSITION: [10, 3, 1, 2, -6, 55, 0],
        },
        {
            POSITION: [10, 3, 1, 2, 6, 65, 0],
        },
        {
            POSITION: [7, 3, 1, 4, -8, 50, 0],
        },
        {
            POSITION: [7, 3, 1, 4, 8, 70, 0],
        },


        {
            POSITION: [4, 5, 1.6, 10.25, 0, 180, 0],
        },
        {
            POSITION: [4, 5, 1.6, 9.5, 0, 180, 0],
        },
        {
            POSITION: [4, 5, 1.6, 8.75, 0, 180, 0],
        },
        {
            POSITION: [4, 5, 1.6, 8, 0, 180, 0],
        },

        {
            POSITION: [5, 6, 1.65, 8, 0, 300, 0],
        },
        {
            POSITION: [6, 6, 0.6, 8, 0, 300, 0],
        },
    ],
    TURRETS: [
        {
            POSITION: [11, 0, 0, 0, 360, 1],
            TYPE: ["octupletGunBDN", { GUN_STAT_SCALE: { health: 1.15 }, INDEPENDENT: false, COLOR: -1 }],
        },
    ],
}
// Legionary Crasher
Class.rainbowlegionaryCrasherTop = {
    PARENT: ["rainbowEliteBDN"],
    AI: { STRAFE: false, NO_LEAD: false },
    INDEPENDENT: true,
    DISPLAY_NAME: false,
    GUNS: [
        {
            /*** LENGTH    WIDTH     ASPECT        X             Y         ANGLE     DELAY */
            POSITION: [2, 18, 1, 11, 0, 60, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.drone, OGg.weak, { size: 0.4 }, { health: 0.5, reload: 0.6 }]),
                TYPE: ["rainbowSentrySwarmBDN", { GIVE_KILL_MESSAGE: false, VARIES_IN_SIZE: false }],
                SYNCS_SKILLS: true,
                AUTOFIRE: true,
                STAT_CALCULATOR: "drone",
                MAX_CHILDREN: 1,
            },
        }, {
            POSITION: [2, 18, 1, 11, 0, 180, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.drone, OGg.weak, { size: 0.4 }, { health: 0.5, reload: 0.6 }]),
                TYPE: ["rainbowSentryTrapBDN", { GIVE_KILL_MESSAGE: false, VARIES_IN_SIZE: false }],
                SYNCS_SKILLS: true,
                AUTOFIRE: true,
                STAT_CALCULATOR: "drone",
                MAX_CHILDREN: 1,
            },
        }, {
            POSITION: [2, 18, 1, 11, 0, 300, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.drone, OGg.weak, { size: 0.4 }, { health: 0.5, reload: 0.6 }]),
                TYPE: ["rainbowSentryGunBDN", { GIVE_KILL_MESSAGE: false, VARIES_IN_SIZE: false }],
                SYNCS_SKILLS: true,
                AUTOFIRE: true,
                STAT_CALCULATOR: "drone",
                MAX_CHILDREN: 1,
            },
        },



        ...weaponArray([
            {
                POSITION: [5, 3, 1, 6, 10, i * 120 + 67, 0.2],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([OGg.basic, OGg.artillery, OGg.pelleter, OGg.twin, OGg.pounder, { reload: 0.3, damage: 5, health: 5, pen: 5 }]),
                    TYPE: "bullet",
                    LABEL: "Devastator Tertiary",
                },
            },
            {
                POSITION: [5, 3, 1, 6, -10, i * 120 + 53, 0.2],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([OGg.basic, OGg.artillery, OGg.pelleter, OGg.twin, OGg.pounder, { reload: 0.3, damage: 5, health: 5, pen: 5 }]),
                    TYPE: "bullet",
                    LABEL: "Devastator Tertiary",
                },
            },
            {
                POSITION: [6, 3, 1, 6, 9, i * 120 + 67, 0.4],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([OGg.basic, OGg.artillery, OGg.pelleter, OGg.twin, OGg.pounder, { reload: 0.3, damage: 5, health: 5, pen: 5 }]),
                    TYPE: "bullet",
                    LABEL: "Devastator Tertiary",
                },
            },
            {
                POSITION: [6, 3, 1, 6, -9, i * 120 + 53, 0.4],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([OGg.basic, OGg.artillery, OGg.pelleter, OGg.twin, OGg.pounder, { reload: 0.3, damage: 5, health: 5, pen: 5 }]),
                    TYPE: "bullet",
                    LABEL: "Devastator Tertiary",
                },
            },
            {
                POSITION: [7, 3, 1, 6, 8, i * 120 + 67, 0.6],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([OGg.basic, OGg.artillery, OGg.pelleter, OGg.twin, OGg.pounder, { reload: 0.3, damage: 5, health: 5, pen: 5 }]),
                    TYPE: "bullet",
                    LABEL: "Devastator Secondary",
                },
            },
            {
                POSITION: [7, 3, 1, 6, -8, i * 120 + 53, 0.6],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([OGg.basic, OGg.artillery, OGg.pelleter, OGg.twin, OGg.pounder, { reload: 0.3, damage: 5, health: 5, pen: 5 }]),
                    TYPE: "bullet",
                    LABEL: "Devastator Secondary",
                },
            },
            {
                POSITION: [8, 3, 1, 6, 7, i * 120 + 67, 0.8],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([OGg.basic, OGg.artillery, OGg.pelleter, OGg.twin, OGg.pounder, { reload: 0.3, damage: 5, health: 5, pen: 5 }]),
                    TYPE: "bullet",
                    LABEL: "Devastator Secondary",
                },
            },
            {
                POSITION: [8, 3, 1, 6, -7, i * 120 + 53, 0.8],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([OGg.basic, OGg.artillery, OGg.pelleter, OGg.twin, OGg.pounder, { reload: 0.3, damage: 5, health: 5, pen: 5 }]),
                    LABEL: "Devastator Secondary",
                },
            },
            {
                POSITION: [8, 16, 1, 6, 0, i * 120 + 60, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([OGg.basic, OGg.pounder, OGg.pounder, OGg.destroyer, { reload: 0.55, damage: 3, health: 3, pen: 3 }]),
                    TYPE: "bullet",
                    LABEL: "Devastator Primary",
                },
            },
                        {
                POSITION: [4.5, 3, 0.7, 7, 0, 60, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.pounder, OGg.pounder, OGg.destroyer, { damage: 1.5, health: 1.5, pen: 1.5 }, { speed: 2.5, maxSpeed: 2.2, size: 1.1, range: 3.25 }]),
                    TYPE: ["swarm", { INDEPENDENT: true }],
                    STAT_CALCULATOR: "swarm",
                    AUTOFIRE: true,

                },
            },
            {
                POSITION: [4, 3, 0.7, 7, 5, 60, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.pounder, OGg.pounder, OGg.destroyer, { damage: 1.5, health: 1.5, pen: 1.5 }, { speed: 2.5, maxSpeed: 2.2, size: 1.1, range: 3.25 }]),
                    TYPE: ["swarm", { INDEPENDENT: true }],
                    STAT_CALCULATOR: "swarm",
                    AUTOFIRE: true,

                },
            }, {
                POSITION: [4, 3, 0.7, 7, -5, 60, 1 / 4],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.pounder, OGg.pounder, OGg.destroyer, { damage: 1.5, health: 1.5, pen: 1.5 }, { speed: 2.5, maxSpeed: 2.2, size: 1.1, range: 3.25 }]),
                    TYPE: ["swarm", { INDEPENDENT: true }],
                    STAT_CALCULATOR: "swarm",
                    AUTOFIRE: true,
                },
            }, {
                POSITION: [3.5, 3, 0.7, 7, -2.5, 60, 2 / 4],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.pounder, OGg.pounder, OGg.destroyer, { damage: 1.5, health: 1.5, pen: 1.5 }, { speed: 2.5, maxSpeed: 2.2, size: 1.1, range: 3.25 }]),
                    TYPE: ["swarm", { INDEPENDENT: true }],
                    STAT_CALCULATOR: "swarm",
                    AUTOFIRE: true,
                },
            }, {
                POSITION: [3.5, 3, 0.7, 7, 2.5, 60, 3 / 4],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.pounder, OGg.pounder, OGg.destroyer, { damage: 1.5, health: 1.5, pen: 1.5 }, { speed: 2.5, maxSpeed: 2.2, size: 1.1, range: 3.25 }]),
                    TYPE: ["swarm", { INDEPENDENT: true }],
                    STAT_CALCULATOR: "swarm",
                    AUTOFIRE: true,
                },
            }, {
                POSITION: [3.5, 3, 0.7, 7, -7.5, 60, 2 / 4],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.pounder, OGg.pounder, OGg.destroyer, { damage: 1.5, health: 1.5, pen: 1.5 }, { speed: 2.5, maxSpeed: 2.2, size: 1.1, range: 3.25 }]),
                    TYPE: ["swarm", { INDEPENDENT: true }],
                    STAT_CALCULATOR: "swarm",
                    AUTOFIRE: true,
                },
            }, {
                POSITION: [3.5, 3, 0.7, 7, 7.5, 60, 3 / 4],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.pounder, OGg.pounder, OGg.destroyer, { damage: 1.5, health: 1.5, pen: 1.5 }, { speed: 2.5, maxSpeed: 2.2, size: 1.1, range: 3.25 }]),
                    TYPE: ["swarm", { INDEPENDENT: true }],
                    STAT_CALCULATOR: "swarm",
                    AUTOFIRE: true,
                },
            },
        ], 3),
    ],
    TURRETS: weaponArray({
        POSITION: [9.5, 10, 0, 0, 190, 0],
        TYPE: ["octupletGunBDN", { GUN_STAT_SCALE: { damage: 3.2, health: 3, speed: 3, maxSpeed: 2, resist: 1.1, range: 2.3 } }],
    }, 3),
}
Class.rainbowlegionaryCrasherSpawner = {
    PARENT: 'genericTank',
    SHAPE: "",
    INDEPENDENT: true,
    GUNS: [{
        POSITION: [0, 10, 0, 0, 0, 0, 10],
        PROPERTIES: {
            TYPE: 'rainbowdestroyerLegion',
            SHOOT_SETTINGS: combineStats([{ reload: 0.1 }]),
            NO_LIMITATIONS: true,
            INDEPENDENT_CHILDREN: true,
            MAX_CHILDREN: 1,
            IDENTIFIER: 1,
            AUTOFIRE: true,
        }
    }],
    ON: [{
        event: "fire",
        handler: ({ gun }) => {
            gun.setBulletType(["rainbowdestroyerLegion", "rainbowgunnerLegion", "rainbowsprayerLegion", "rainbowbattleshipLegion", "rainbowspawnerLegion"][gun.identifier++ % 5]);
        }
    }],
}
Class.rainbowlegionaryCrasher = {
    PARENT: ["rainbowEliteBDN"],
    LABEL: "Rainbow Legionary Crasher",
    NAME: "Rainbow Legionary Crasher",
    DISPLAY_NAME: false,
    UPGRADE_COLOR: "rainbow",
    AI: { STRAFE: false, NO_LEAD: false },
    HAS_NO_RECOIL: true,
    VALUE: 1e10,
    SIZE: 130,
    BODY: {
        FOV: 1.5,
        SPEED: 0.1 * base.SPEED,
        HEALTH: 25000,
        DAMAGE: 100 * base.DAMAGE,
    },
    GUNS: [
        ...weaponArray([
            {
                POSITION: [14.5, 13, 1, 0, 0, 0, 0],
            }, {
                POSITION: [3, 13, 1.7, 14.5, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([OGg.trap, OGg.setTrap, OGg.pounder, { reload: 1.8, speed: 3.2, size: 0.9, maxSpeed: 2.5, range: 1.1 }, { damage: 9, health: 9, pen: 9 }]),
                    TYPE: "rainbowlegionaryPillbox",
                    NO_LIMITATIONS: true,
                    STAT_CALCULATOR: "trap",
                },
            },
        ], 3),
        ...weaponArray({
            POSITION: [5, 12, 1.6, -11, 0, 0, 0],
        }, 3),
    ],
    TURRETS: [
        {
            POSITION: [12, 0, 0, 0, 360, 1],
            TYPE: "rainbowlegionaryCrasherTop",
        },
        ...weaponArray({
            POSITION: [14, 8, 0, 60, 180, 0],
            TYPE: ["hyperSprayerGunBDN", { GUN_STAT_SCALE: { speed: 2, health: 93.6, damage: 90, resist: 1.5 }, COLOR: -1 }],
        }, 3),
        {
            POSITION: [12, 0, 0, 0, 0, 0],
            TYPE: 'rainbowlegionaryCrasherSpawner'
        }
    ],
}
Class.rainbowlegionaryCrasherSpawnerFix = {
    PARENT: 'genericTank',
    SHAPE: "",
    INDEPENDENT: true,
    GUNS: [{
        POSITION: [0, 10, 0, 0, 0, 0, 10],
        PROPERTIES: {
            TYPE: 'rainbowdestroyerLegion',
            SHOOT_SETTINGS: combineStats([{ reload: 0.1, size: 0.75 }]),
            NO_LIMITATIONS: true,
            INDEPENDENT_CHILDREN: false,
            MAX_CHILDREN: 5,
            IDENTIFIER: 1,
            AUTOFIRE: true,
        }
    }],
    ON: [{
        event: "fire",
        handler: ({ gun }) => {
            gun.setBulletType(["rainbowdestroyerLegion", "rainbowgunnerLegion", "rainbowsprayerLegion", "rainbowbattleshipLegion", "rainbowspawnerLegion"][gun.identifier++ % 5]);
        }
    }],
}
Class.rainbowlegionaryCrasherFix = {
    PARENT: ["rainbowEliteBDN"],
    LABEL: "Rainbow Legionary Crasher",
    NAME: "Rainbow Legionary Crasher",
    DISPLAY_NAME: false,
    UPGRADE_COLOR: "rainbow",
    AI: { STRAFE: false, NO_LEAD: false },
    HAS_NO_RECOIL: true,
    VALUE: 1e10,
    SIZE: 130,
    BODY: {
        FOV: 1.5,
        SPEED: 0.1 * base.SPEED,
        HEALTH: 25000,
        DAMAGE: 100 * base.DAMAGE,
    },
    GUNS: [
        ...weaponArray([
            {
                POSITION: [14.5, 13, 1, 0, 0, 0, 0],
            }, {
                POSITION: [3, 13, 1.7, 14.5, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([OGg.trap, OGg.setTrap, OGg.pounder, { reload: 1.8, speed: 3.2, size: 0.9, maxSpeed: 2.5, range: 1.1 }, { damage: 9, health: 9, pen: 9 }]),
                    TYPE: "rainbowlegionaryPillbox",
                    NO_LIMITATIONS: true,
                    STAT_CALCULATOR: "trap",
                },
            },
        ], 3),
        ...weaponArray({
            POSITION: [5, 12, 1.6, -11, 0, 0, 0],
        }, 3),
    ],
    TURRETS: [
        {
            POSITION: [12, 0, 0, 0, 360, 1],
            TYPE: "rainbowlegionaryCrasherTop",
        },
        ...weaponArray({
            POSITION: [14, 8, 0, 60, 180, 0],
            TYPE: ["hyperSprayerGunBDN", { GUN_STAT_SCALE: { speed: 2, health: 31.2, damage: 30, resist: 1.5 }, COLOR: -1 }],
        }, 3),
        {
            POSITION: [12, 0, 0, 0, 0, 0],
            TYPE: 'rainbowlegionaryCrasherSpawnerFix'
        }
    ],
}
Class.rainbowElitesBDN = makeMenu("Rainbow Elites")
Class.rainbowElitesBDN.COLOR = "rainbow"
Class.rainbowElitesBDN.UPGRADE_COLOR = "rainbow"
Class.rainbowElitesBDN.UPGRADES_TIER_0 = ["rainbowEliteDestroyerBDN", "rainbowEliteGunnerBDN", "rainbowEliteSprayerBDN", "rainbowEliteBattleshipBDN", "rainbowEliteSpawnerBDN", "rainbowEliteTrapGuardBDN", "rainbowEliteSpinnerBDN", "rainbowsprayerLegion", "rainbowlegionaryCrasher", "rainbowlegionaryCrasherFix"]
Class.rainbowElitesBDN.SHAPE = 3.5
Class.shadowElitesBDN.UPGRADES_TIER_0.push("rainbowElitesBDN")

















// Trans Elites :money_mouth:
Class.nonupletGunBDN = {
    PARENT: "autoTankGun",
    GUNS: [
        {
            POSITION: [14, 3.5, 1, 0, -7.5, 0, 8 / 9],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.autoTurret, OGg.twin, OGg.twin, OGg.power, { reload: 2, speed: 3, maxspeed: 3 }, { size: 2, reload: 1, damage: 6, health: 6, pen: 6 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [14, 3.5, 1, 0, 7.5, 0, 5 / 9],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.autoTurret, OGg.twin, OGg.twin, OGg.power, { reload: 2, speed: 3, maxspeed: 3 }, { size: 2, reload: 1, damage: 6, health: 6, pen: 6 }]),
            },
        },
        {
            POSITION: [15, 3.5, 1, 0, -5.5, 0, 7 / 9],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.autoTurret, OGg.twin, OGg.twin, OGg.power, { reload: 2, speed: 3, maxspeed: 3 }, { size: 2, reload: 1, damage: 6, health: 6, pen: 6 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [15, 3.5, 1, 0, 5.5, 0, 4 / 9],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.autoTurret, OGg.twin, OGg.twin, OGg.power, { reload: 2, speed: 3, maxspeed: 3 }, { size: 2, reload: 1, damage: 6, health: 6, pen: 6 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [16, 3.5, 1, 0, -3.5, 0, 6 / 9],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.autoTurret, OGg.twin, OGg.twin, OGg.power, { reload: 2, speed: 3, maxspeed: 3 }, { size: 2, reload: 1, damage: 6, health: 6, pen: 6 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [16, 3.5, 1, 0, 3.5, 0, 3 / 9],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.autoTurret, OGg.twin, OGg.twin, OGg.power, { reload: 2, speed: 3, maxspeed: 3 }, { size: 2, reload: 1, damage: 6, health: 6, pen: 6 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [17, 3.5, 1, 0, -1.5, 0, 1 / 9],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.autoTurret, OGg.twin, OGg.twin, OGg.power, { reload: 2, speed: 3, maxspeed: 3 }, { size: 2, reload: 1, damage: 6, health: 6, pen: 6 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [17, 3.5, 1, 0, 1.5, 0, 2 / 9],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.autoTurret, OGg.twin, OGg.twin, OGg.power, { reload: 2, speed: 3, maxspeed: 3 }, { size: 2, reload: 1, damage: 6, health: 6, pen: 6 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [18, 3.5, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.autoTurret, OGg.twin, OGg.twin, OGg.power, { reload: 2, speed: 3, maxspeed: 3 }, { size: 2, reload: 1, damage: 6, health: 6, pen: 6 }]),
                TYPE: "bullet",
            },
        },
    ],
}
Class.transEliteBDN = {
    PARENT: ["miniboss"],
    LABEL: "Trans Elite Crasher",
    COLOR: "trans",
    SHAPE: 3,
    SIZE: 42,
    DANGER: 160,
    VARIES_IN_SIZE: true,
    VALUE: 46e5,
    BODY: {
        FOV: 1.25,
        SPEED: 0.125 * base.SPEED,
        HEALTH: 60 * base.HEALTH,
        DAMAGE: 13 * base.DAMAGE,
        REGEN: 5 * base.REGEN,
    },
};
Class.transEliteDestroyerBDN = {
    PARENT: ["transEliteBDN"],
    UPGRADE_LABEL: "Trans Elite Destroyer",
    UPGRADE_COLOR: "trans",
    GUNS: [],
    TURRETS: [
        {
            POSITION: [11, 0, 0, 180, 360, 0],
            TYPE: ["crasherSpawnerlimited"],
        }, {
            POSITION: [11, 0, 0, 60, 360, 0],
            TYPE: ["crasherSpawnerlimited"],
        }, {
            POSITION: [11, 0, 0, -60, 360, 0],
            TYPE: ["crasherSpawnerlimited"],
        }, {
            POSITION: [11, 0, 0, 240, 360, 0],
            TYPE: ["crasherSpawnerlimited"],
        }, {
            POSITION: [11, 0, 0, 120, 360, 0],
            TYPE: ["crasherSpawnerlimited"],
        }, {
            POSITION: [11, 0, 0, 0, 360, 0],
            TYPE: ["crasherSpawnerlimited"],
        }, {
            POSITION: [11, 0, 0, 0, 360, 1],
            TYPE: ["nonupletGunBDN", { INDEPENDENT: true, COLOR: -1 }],
        },
    ],
};

for (let i = 0; i < 3; i++) {
    Class.transEliteDestroyerBDN.GUNS.push(
        {
            POSITION: [7, 16, 1, 6, 3, i * 120 + 67, 0.25],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.pounder, OGg.pounder, OGg.destroyer, { reload: 0.9, damage: 10, health: 10, pen: 10 }]),
                TYPE: "bullet",
                LABEL: "Devastator Secondary",
            },
        },
        {
            POSITION: [7, 16, 1, 6, -3, i * 120 + 53, 0.25],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.pounder, OGg.pounder, OGg.destroyer, { reload: 0.9, damage: 10, health: 10, pen: 10 }]),
                TYPE: "bullet",
                LABEL: "Devastator Secondary",
            },
        },
    )
    Class.transEliteDestroyerBDN.GUNS.push(
        {
            POSITION: [7, 16, 1, 6, 0, i * 120 + 60, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.pounder, OGg.pounder, OGg.destroyer, { reload: 0.9, damage: 10, health: 10, pen: 10 }]),
                TYPE: "bullet",
                LABEL: "Devastator Primary",
            },
        },
    )
}
Class.transEliteGunnerBDN = {
    PARENT: ["transEliteBDN"],
    UPGRADE_LABEL: "Trans Elite Gunner",
    UPGRADE_COLOR: "trans",
    FACING_TYPE: "toTarget",
    GUNS: [
        {
            POSITION: [14, 16, 1, 0, 0, 180, 0],
        },
        {
            POSITION: [14, 13, 1, 0, 0, 180, 0],
        }, {
            POSITION: [4, 16, 1.5, 14, 0, 180, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.trap, OGg.hexaTrapper, OGg.setTrap, OGg.setTrap, { reload: 0.8, damage: 6, health: 6, pen: 6 }]),
                TYPE: ["ssunsethyperDriverPillboxBDN", { MOTION_TYPE: "glide" }],
                STAT_CALCULATOR: "trap",
            },
        },
        {
            POSITION: [4, 13, 1.5, 14, 0, 180, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.trap, OGg.hexaTrapper, OGg.setTrap, { reload: 0.8, range: 0, damage: 0 }]),
                TYPE: "bullet",
            },
        }, {
            POSITION: [6, 14, -2, 2, 0, 60, 0],
        }, {
            POSITION: [6, 14, -2, 2, 0, 300, 0],
        }, {
            POSITION: [6, 14, -2, 2, 0, 55, 0],
        }, {
            POSITION: [6, 14, -2, 2, 0, 305, 0],
        },
    ],
    AI: { NO_LEAD: false },
    TURRETS: [
        {
            POSITION: [14, 8, 0, 60, 180, 0],
            TYPE: ["ssuperbrimmerGunBDN"],
        }, {
            POSITION: [14, 8, 0, 300, 180, 0],
            TYPE: ["ssuperbrimmerGunBDN"],
        },
    ],
};
Class.transEliteSprayerBDN = {
    PARENT: ["transEliteBDN"],
    UPGRADE_LABEL: "Trans Elite Sprayer",
    UPGRADE_COLOR: "trans",
    SKILL: skillSet({
        rld: 0.7,
        dam: 0.5,
        pen: 0.8,
        str: 0.8,
        spd: 0.2,
        atk: 0.3,
        hlt: 1,
        shi: 0.7,
        rgn: 0.7,
        mob: 1,
    }),
    AI: { NO_LEAD: false },
    HAS_NO_RECOIL: true,
    GUNS: [],
    TURRETS: [
        {
            /*    SIZE         X             Y         ANGLE        ARC */
            POSITION: [6.5, 0, 0, 0, 360, 1],
            TYPE: ["ssupersprayerDodecagrammataTurretBDN", { INDEPENDENT: true }],
        }, {
            POSITION: [9, 6, -7, 180, 130, 0],
            TYPE: ["sshyperSprayerGunBDN", { COLOR: "grey" }],
        }, {
            POSITION: [9, 6, 7, 180, 130, 0],
            TYPE: ["sshyperSprayerGunBDN", { COLOR: "grey" }],
        }, {
            POSITION: [9, 6, 7, 60, 130, 0],
            TYPE: ["sshyperSprayerGunBDN", { COLOR: "grey" }],
        }, {
            POSITION: [9, 6, -7, 60, 130, 0],
            TYPE: ["sshyperSprayerGunBDN", { COLOR: "grey" }],
        }, {
            POSITION: [9, 6, 7, -60, 130, 0],
            TYPE: ["sshyperSprayerGunBDN", { COLOR: "grey" }],
        }, {
            POSITION: [9, 6, -7, -60, 130, 0],
            TYPE: ["sshyperSprayerGunBDN", { COLOR: "grey" }],
        },
    ],
};
Class.sshypercarrierBDN = {
    PARENT: "autoTankGun",
    LABEL: "",
    STAT_NAMES: statnames.swarm,
    FACING_TYPE: "locksFacing",
    BODY: {
        FOV: base.FOV * 1.2,
    },
    GUNS: [

        {
            POSITION: [7, 8, 1, 7, 0, 30, 1 / 6],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.battleship, OGg.carrier, { size: 3, reload: 2, damage: 18, health: 18, pen: 18 }]),
                TYPE: "swarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [7, 8, 1, 7, 0, -30, 1 / 6],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.battleship, OGg.carrier, { size: 3, reload: 2, damage: 18, health: 18, pen: 18 }]),
                TYPE: "swarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [7, 8, 1, 7, 0, 60, 2 / 6],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.battleship, OGg.carrier, { size: 3, reload: 2, damage: 18, health: 18, pen: 18 }]),
                TYPE: "swarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [7, 8, 1, 7, 0, -60, 2 / 6],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.battleship, OGg.carrier, { size: 3, reload: 1.5, damage: 18, health: 18, pen: 18 }]),
                TYPE: "swarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [7, 8, 1, 7, 0, 90, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.battleship, OGg.carrier, { size: 3, reload: 2, damage: 18, health: 18, pen: 18 }]),
                TYPE: "swarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [7, 8, 1, 7, 0, -90, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.battleship, OGg.carrier, { size: 3, reload: 1.5, damage: 18, health: 18, pen: 18 }]),
                TYPE: "swarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [7, 8, 1, 7, 0, 120, 4 / 6],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.battleship, OGg.carrier, { size: 3, reload: 2, damage: 18, health: 18, pen: 18 }]),
                TYPE: "swarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [7, 8, 1, 7, 0, -120, 4 / 6],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.battleship, OGg.carrier, { size: 3, reload: 1.5, damage: 18, health: 18, pen: 18 }]),
                TYPE: "swarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [7, 8, 1, 7, 0, 150, 5 / 6],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.battleship, OGg.carrier, { size: 3, reload: 2, damage: 18, health: 18, pen: 18 }]),
                TYPE: "swarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [7, 8, 1, 7, 0, -150, 5 / 6],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.battleship, OGg.carrier, { size: 3, reload: 1.5, damage: 18, health: 18, pen: 18 }]),
                TYPE: "swarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [7, 8, 1, 7, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.battleship, OGg.carrier, { size: 3, reload: 2, damage: 18, health: 18, pen: 18 }]),
                TYPE: "swarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [7, 8, 1, 7, 0, 180, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.battleship, OGg.carrier, { size: 3, reload: 1.5, damage: 18, health: 18, pen: 18 }]),
                TYPE: "swarm",
                STAT_CALCULATOR: "swarm",
            },
        },
    ],
}
Class.transEliteBattleshipBDN = {
    PARENT: ["transEliteBDN"],
    UPGRADE_LABEL: "Trans Elite Battleship",
    UPGRADE_COLOR: "trans",
    GUNS: [],
    TURRETS: [
        {
            POSITION: [5, 7.5, 0, 0, 360, 1],
            TYPE: "sshypercarrierBDN",
        }, {
            POSITION: [5, 7.5, 0, 120, 360, 1],
            TYPE: "sshypercarrierBDN",
        }, {
            POSITION: [5, 7.5, 0, 240, 360, 1],
            TYPE: "sshypercarrierBDN",
        },
    ],
};
for (i = 0; i < 3; i++) {
    Class.transEliteBattleshipBDN.GUNS.push(

        {
            POSITION: [3, 1, 0.6, 7, -13.25, i * 120 - 60, 2 / 3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.battleship, { size: 3, reload: 2, damage: 500, health: 500, pen: 500 }]),
                TYPE: "autoswarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [3, 1, 0.6, 7, 13.25, i * 120 - 60, 2 / 3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.battleship, { size: 3, reload: 2, damage: 500, health: 500, pen: 500 }]),
                TYPE: "autoswarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [3, 1, 0.6, 7, -5.25, i * 120 - 60, 2 / 3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.battleship, { size: 3, reload: 2, damage: 500, health: 500, pen: 500 }]),
                TYPE: "autoswarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [3, 1, 0.6, 7, 5.25, i * 120 - 60, 2 / 3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.battleship, { size: 3, reload: 2, damage: 500, health: 500, pen: 500 }]),
                TYPE: "autoswarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [3, 1, 0.6, 7, 4, i * 120 - 60, 2 / 3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.battleship, { size: 3, reload: 2, damage: 500, health: 500, pen: 500 }]),
                TYPE: "autoswarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [3, 1, 0.6, 7, -4, i * 120 - 60, 2 / 3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.battleship, { size: 3, reload: 2, damage: 500, health: 500, pen: 500 }]),
                TYPE: "autoswarm",
                STAT_CALCULATOR: "swarm",
            },
        },






        {
            POSITION: [4, 3, 0.6, 7, -11.25, i * 120 - 60, 1 / 3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.battleship, { size: 3, reload: 2, damage: 750, health: 750, pen: 750 }]),
                TYPE: "autoswarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [4, 3, 0.6, 7, 11.25, i * 120 - 60, 1 / 3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.battleship, { size: 3, reload: 2, damage: 750, health: 750, pen: 750 }]),
                TYPE: "autoswarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [4, 3, 0.6, 7, -7.25, i * 120 - 60, 1 / 3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.battleship, { size: 3, reload: 2, damage: 750, health: 750, pen: 750 }]),
                TYPE: "autoswarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [4, 3, 0.6, 7, 7.25, i * 120 - 60, 1 / 3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.battleship, { size: 3, reload: 2, damage: 750, health: 750, pen: 750 }]),
                TYPE: "autoswarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [4, 3, 0.6, 7, 2, i * 120 - 60, 1 / 3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.battleship, { size: 3, reload: 2, damage: 750, health: 750, pen: 750 }]),
                TYPE: "autoswarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [4, 3, 0.6, 7, -2, i * 120 - 60, 1 / 3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.battleship, { size: 3, reload: 2, damage: 750, health: 750, pen: 750 }]),
                TYPE: "autoswarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [5, 5, 0.6, 7, 0, i * 120 - 60, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.battleship, { size: 3, reload: 2, damage: 1000, health: 1000, pen: 1000 }]),
                TYPE: "autoswarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [5, 5, 0.6, 7, -9.25, i * 120 - 60, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.battleship, { size: 3, reload: 2, damage: 1000, health: 1000, pen: 1000 }]),
                TYPE: "autoswarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [5, 5, 0.6, 7, 9.25, i * 120 - 60, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.battleship, { size: 3, reload: 2, damage: 1000, health: 1000, pen: 1000 }]),
                STAT_CALCULATOR: "swarm",
            },
        },
    )
}
Class.transSentryBDN = {
    PARENT: ["sentry"],
    COLOR: "trans",
    UPGRADE_COLOR: "trans",
    DANGER: 4,
    SIZE: 25,
    VALUE: 1e8,
    SHAPE: 3,
    BODY: {
        HEALTH: 15 * base.HEALTH
    },
};
Class.transSentrySwarmBDN = {
    PARENT: ["transSentryBDN"],
    UPGRADE_LABEL: "Trans Swarm Sentry",
    UPGRADE_COLOR: "trans",
    GUNS: [

        {
            POSITION: [7, 9, 0.6, 7, 2.5, 60, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, { recoil: 0.1 }, { reload: 0.8, damage: 9, health: 9, pen: 9 }]),
                TYPE: "swarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [7, 9, 0.6, 7, -2.5, 300, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, { recoil: 0.1 }, { reload: 0.8, damage: 9, health: 9, pen: 9 }]),
                TYPE: "swarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [7, 9, 0.6, 7, -2.5, 60, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, { recoil: 0.1 }, { reload: 0.8, damage: 9, health: 9, pen: 9 }]),
                TYPE: "swarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [7, 9, 0.6, 7, 2.5, 300, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, { recoil: 0.1 }, { reload: 0.8, damage: 9, health: 9, pen: 9 }]),
                TYPE: "swarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [7, 9, 0.6, 7, 0, 60, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, { recoil: 0.1 }, { reload: 0.8, damage: 9, health: 9, pen: 9 }]),
                TYPE: "swarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [7, 9, 0.6, 7, 0, 300, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, { recoil: 0.1 }, { reload: 0.8, damage: 9, health: 9, pen: 9 }]),
                TYPE: "swarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [6, 13, 1.3, 7, 0, 180, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, { recoil: 1.15 }, OGg.machineGun, { reload: 0.4, damage: 10.5, health: 10.5, pen: 10.5 }]),
                TYPE: "swarm",
                STAT_CALCULATOR: "swarm",
            },
        },
    ],
};
Class.supergigabarricaderAutoTankGunBDN = {
    PARENT: ["genericTank"],
    LABEL: "Turret",
    BODY: {
        FOV: 0.5,
    },
    INDEPENDENT: true,
    CONTROLLERS: ["nearestDifferentMaster"],
    COLOR: "grey",
    AI: {
        SKYNET: true,
        FULL_VIEW: true,
    },
    GUNS: [
        {
            POSITION: [24, 15, 1, 0, 0, 0, 0],
        },
        {
            POSITION: [4, 15, 1.3, 2, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.trap, OGg.minigun, { range: 0.6 }, { reload: 1, damage: 40, health: 40, pen: 40 }]),
                TYPE: "trap",
                STAT_CALCULATOR: "trap",
            },
        },

        {
            POSITION: [4, 15, 1.3, 30, 0, 0, 1 / 6],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.trap, OGg.minigun, { range: 0.6 }, { reload: 1, damage: 40, health: 40, pen: 40 }]),
                TYPE: "trap",
                STAT_CALCULATOR: "trap",
            },
        },
        {
            POSITION: [4, 15, 1.3, 26, 0, 0, 2 / 6],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.trap, OGg.minigun, { range: 0.6 }, { reload: 1, damage: 40, health: 40, pen: 40 }]),
                TYPE: "trap",
                STAT_CALCULATOR: "trap",
            },
        },
        {
            POSITION: [4, 15, 1.3, 22, 0, 0, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.trap, OGg.minigun, { range: 0.6 }, { reload: 1, damage: 40, health: 40, pen: 40 }]),
                TYPE: "trap",
                STAT_CALCULATOR: "trap",
            },
        },
        {
            POSITION: [4, 15, 1.3, 18, 0, 0, 4 / 6],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.trap, OGg.minigun, { range: 0.6 }, { reload: 1, damage: 40, health: 40, pen: 40 }]),
                TYPE: "trap",
                STAT_CALCULATOR: "trap",
            },
        },
        {
            POSITION: [4, 15, 1.3, 14, 0, 0, 5 / 6],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.trap, OGg.minigun, { range: 0.6 }, { reload: 1, damage: 40, health: 40, pen: 40 }]),
                TYPE: "trap",
                STAT_CALCULATOR: "trap",
            },
        },
    ],
};
Class.transSentryTrapBDN = makeAuto(Class.transSentryBDN, "Sentry", {
    type: Class.supergigabarricaderAutoTankGunBDN,
    size: 12,
});
Class.transSentryTrapBDN.UPGRADE_LABEL = "Trans Trap Sentry";
Class.transSentryTrapBDN.GUNS = [
    {
        POSITION: [14, 11, 1, 0, 0, 180, 0],
    },
    {
        POSITION: [3, 11, 1.2, 14, 0, 180, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([OGg.trap, OGg.setTrap, { recoil: 1.15 }, { reload: 1, damage: 10, health: 11.8, pen: 11.8 }]),
            TYPE: "setTrap",
            STAT_CALCULATOR: "trap",
        },
    },
]
Class.hypermortarAutoTankgunBDN = {
    PARENT: ["genericTank"],
    LABEL: "Mortar",
    BODY: {
        FOV: 2,
    },
    CONTROLLERS: [
        "canRepel",
        "onlyAcceptInArc",
        "mapAltToFire",
        "nearestDifferentMaster",
    ],
    COLOR: "grey",
    GUNS: [
        {
            POSITION: [16.5, 3, 1, 0, -7, -11, 1 / 5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.pelleter, OGg.artillery, { reload: 0.4, damage: 10, health: 9, pen: 9 }]),
                TYPE: "bullet",
                LABEL: "Tetiary",
            },
        },
        {
            POSITION: [16.5, 3, 1, 0, 7, 11, 1 / 5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.pelleter, OGg.artillery, { reload: 0.4, damage: 10, health: 9, pen: 9 }]),
                TYPE: "bullet",
                LABEL: "Tetiary",
            },
        },
        {
            POSITION: [17, 3, 1, 0, -6.5, -9, 1 / 5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.pelleter, OGg.artillery, { reload: 0.4, damage: 10, health: 9, pen: 9 }]),
                TYPE: "bullet",
                LABEL: "Tetiary",
            },
        },
        {
            POSITION: [17, 3, 1, 0, 6.5, 9, 1 / 5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.pelleter, OGg.artillery, { reload: 0.4, damage: 10, health: 9, pen: 9 }]),
                TYPE: "bullet",
                LABEL: "Tetiary",
            },
        },
        {
            POSITION: [17.5, 3, 1, 0, -6, -7, 2 / 5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.pelleter, OGg.artillery, { reload: 0.4, damage: 10, health: 9, pen: 9 }]),
                TYPE: "bullet",
                LABEL: "Secondary",
            },
        },
        {
            POSITION: [17.5, 3, 1, 0, 6, 7, 2 / 5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.pelleter, OGg.artillery, { reload: 0.4, damage: 10, health: 9, pen: 9 }]),
                TYPE: "bullet",
                LABEL: "Secondary",
            },
        },
        {
            POSITION: [18, 3, 1, 0, -5.5, -5, 3 / 5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.pelleter, OGg.artillery, { reload: 0.4, damage: 10, health: 9, pen: 9 }]),
                TYPE: "bullet",
                LABEL: "Secondary",
            },
        },
        {
            POSITION: [18, 3, 1, 0, 5.5, 5, 3 / 5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.pelleter, OGg.artillery, { reload: 0.4, damage: 10, health: 9, pen: 9 }]),
                TYPE: "bullet",
                LABEL: "Secondary",
            },
        },
        {
            POSITION: [18.5, 3, 1, 0, -4.5, -5, 4 / 5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.pelleter, OGg.artillery, { reload: 0.4, damage: 10, health: 9, pen: 9 }]),
                TYPE: "bullet",
                LABEL: "Secondary",
            },
        },
        {
            POSITION: [18.5, 3, 1, 0, 4.5, 5, 4 / 5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.pelleter, OGg.artillery, { reload: 0.4, damage: 10, health: 9, pen: 9 }]),
                TYPE: "bullet",
                LABEL: "Secondary",
            },
        },
        {
            POSITION: [19, 12, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.pounder, OGg.artillery, { reload: 0.4, damage: 10, health: 9, pen: 9 }]),
                TYPE: "bullet",
                LABEL: "Heavy",
            },
        },
    ],
};
Class.transSentryGunBDN = makeAuto(Class.transSentryBDN, "Sentry", {
    type: Class.hypermortarAutoTankgunBDN,
    size: 12,
});
Class.transSentryGunBDN.UPGRADE_LABEL = "Trans Gun Sentry";
Class.transSentryGunBDN.TURRETS.push(
    ...weaponArray({
        POSITION: [10, 10, 0, 0, 190, 0],
        TYPE: "sshyperSprayerGunBDN",
    }, 3),
)
Class.transEliteSpawnerBDN = {
    PARENT: ["transEliteBDN"],
    UPGRADE_LABEL: "Trans Elite Spawner",
    UPGRADE_COLOR: "trans",
    MAX_CHILDREN: 5,
    AI: { STRAFE: false },
    GUNS: [
        {
            POSITION: [11, 16, 1, 0, 0, 60, 0],
        },

        {
            POSITION: [11, 16, 1, 0, 0, 180, 0],
        },

        {
            POSITION: [11, 16, 1, 0, 0, 300, 0],
        }, {
            /*** LENGTH    WIDTH     ASPECT        X             Y         ANGLE     DELAY */
            POSITION: [2, 18, 1, 11, 0, 60, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.drone, OGg.weak, { size: 0.4 }, { health: 0.5, reload: 0.6 }]),
                TYPE: ["transSentrySwarmBDN", { GIVE_KILL_MESSAGE: false, VARIES_IN_SIZE: false }],
                SYNCS_SKILLS: true,
                AUTOFIRE: true,
                STAT_CALCULATOR: "drone",
            },
        }, {
            POSITION: [2, 18, 1, 11, 0, 180, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.drone, OGg.weak, { size: 0.4 }, { health: 0.5, reload: 0.6 }]),
                TYPE: ["transSentryTrapBDN", { GIVE_KILL_MESSAGE: false, VARIES_IN_SIZE: false }],
                SYNCS_SKILLS: true,
                AUTOFIRE: true,
                STAT_CALCULATOR: "drone",
            },
        }, {
            POSITION: [2, 18, 1, 11, 0, 300, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.drone, OGg.weak, { size: 0.4 }, { health: 0.5, reload: 0.6 }]),
                TYPE: ["transSentryGunBDN", { GIVE_KILL_MESSAGE: false, VARIES_IN_SIZE: false }],
                SYNCS_SKILLS: true,
                AUTOFIRE: true,
                STAT_CALCULATOR: "drone",
            },
        },
        {
            POSITION: [13, 10, 1, 0, 0, 60, 0],
        },
        {
            POSITION: [10, 3, 1, 2, -6, 55, 0],
        },
        {
            POSITION: [10, 3, 1, 2, 6, 65, 0],
        },
        {
            POSITION: [7, 3, 1, 4, -8, 50, 0],
        },
        {
            POSITION: [7, 3, 1, 4, 8, 70, 0],
        },


        {
            POSITION: [4, 5, 1.6, 10.25, 0, 180, 0],
        },
        {
            POSITION: [4, 5, 1.6, 9.5, 0, 180, 0],
        },
        {
            POSITION: [4, 5, 1.6, 8.75, 0, 180, 0],
        },
        {
            POSITION: [4, 5, 1.6, 8, 0, 180, 0],
        },

        {
            POSITION: [5, 6, 1.65, 8, 0, 300, 0],
        },
        {
            POSITION: [6, 6, 0.6, 8, 0, 300, 0],
        },
    ],
    TURRETS: [
        {
            POSITION: [11, 0, 0, 0, 360, 1],
            TYPE: ["nonupletGunBDN", { INDEPENDENT: false, COLOR: -1 }],
        },
    ],
};
Class.transEliteTrapGuardTopBDN = {
    PARENT: ["genericTank"],
    COLOR: -1,
    CONTROLLERS: [["spin", { independent: true }]],
    GUNS: [],
};
for (let i = 0; i < 5; i++) {
    Class.transEliteTrapGuardTopBDN.GUNS.push(
        {
            POSITION: [19, 8, 1, 0, 0, 72 * i, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.flankGuard, OGg.minigun, OGg.flankGuard, { reload: 1.3, damage: 10.5, health: 10.5, pen: 10.5 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [17, 8, 1, 0, 0, 72 * i, 0.2],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.flankGuard, OGg.minigun, OGg.flankGuard, { reload: 1.3, damage: 10.5, health: 10.5, pen: 10.5 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [15, 8, 1, 0, 0, 72 * i, 0.4],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.flankGuard, OGg.minigun, OGg.flankGuard, { reload: 1.3, damage: 10.5, health: 10.5, pen: 10.5 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [13, 8, 1, 0, 0, 72 * i, 0.6],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.flankGuard, OGg.minigun, OGg.flankGuard, { reload: 1.3, damage: 10.5, health: 10.5, pen: 10.5 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [13, 8, 1, 0, 0, 72 * i, 0.8],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.flankGuard, OGg.minigun, OGg.flankGuard, { reload: 1.3, damage: 10.5, health: 10.5, pen: 10.5 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [20, 8, 1, 0, 0, 72 * i + 36, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.flankGuard, OGg.flankGuard, { reload: 1.6, damage: 10.05, health: 10.05, pen: 10.05 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [18, 8, 1, 0, 0, 72 * i + 36, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.flankGuard, OGg.flankGuard, { reload: 1.6, damage: 10.05, health: 10.05, pen: 10.05 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [4, 8, 1.7, 13, 0, 72 * i + 36, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.trap, { reload: 1.6, damage: 10.05, health: 10.05, pen: 10.05 }]),
                TYPE: "trap",
                STAT_CALCULATOR: "trap",
            },
        },
    )
};
Class.transEliteTrapGuardBDN = {
    PARENT: ["transEliteBDN"],
    UPGRADE_LABEL: "Trans Elite Trap Guard",
    UPGRADE_COLOR: "trans",
    AI: { STRAFE: false },
    GUNS: [],
    TURRETS: [
        {
            POSITION: [9.5, 0, 0, 0, 360, 1],
            TYPE: "transEliteTrapGuardTopBDN",
        },
    ],
};
for (let i = 0; i < 3; i++) {
    Class.transEliteTrapGuardBDN.GUNS.push(
        {
            POSITION: [10.5, 8, 1, 0, 0, 120 * i + 60, 0],
        },
        {
            POSITION: [2, 8, 1.4, 10.5, 0, 120 * i + 60, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.trap, OGg.setTrap, { reload: 2, damage: 8, health: 8, pen: 8 }]),
                TYPE: "unsetPillbox",
                MAX_CHILDREN: 5,
                STAT_CALCULATOR: "trap",
            },
        },
        {
            POSITION: [9, 10, 1, 0, 0, 120 * i + 60, 0],
        },
    )
    Class.transEliteTrapGuardBDN.TURRETS.push(
        {
            POSITION: [5.5, 8, -9, 120 * i + 60, 160, 2 / 3],
            TYPE: ["DoomsayerGunBDN", { INDEPENDENT: false, }],
        },
        {
            POSITION: [5.5, 8, 9, 120 * i + 60, 160, 2 / 3],
            TYPE: ["DoomsayerGunBDN", { INDEPENDENT: false, }],
        },
        {
            POSITION: [5.5, 8, -6, 120 * i + 60, 160, 1 / 3],
            TYPE: ["DoomsayerGunBDN", { INDEPENDENT: false, }],
        },
        {
            POSITION: [5.5, 8, 6, 120 * i + 60, 160, 1 / 3],
            TYPE: ["DoomsayerGunBDN", { INDEPENDENT: false, }],
        },
        {
            POSITION: [5.5, 8, -3, 120 * i + 60, 160, 0],
            TYPE: ["DoomsayerGunBDN", { INDEPENDENT: false, }],
        },
        {
            POSITION: [5.5, 8, 3, 120 * i + 60, 160, 0],
            TYPE: ["DoomsayerGunBDN", { INDEPENDENT: false, }],
        },
    )
};
Class.transEliteSuperSpinnerCycloneBDN = {
    PARENT: ["genericTank"],
    COLOR: -1,
    CONTROLLERS: [["spin", { speed: 0.1, independent: true }]],
    GUNS: [],
};
for (let i = 0; i < 32; i++) {
    Class.transEliteSuperSpinnerCycloneBDN.GUNS.push(
        {
            POSITION: [18, 8, 1, 0, 0, (11.25 * i), 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.flankGuard, { reload: 1.5, speed: 3, maxSpeed: 3, damage: 16.5, health: 16.5, pen: 16.5 }]),
                TYPE: "bullet",
            },
        },
    )
};
for (let i = 0; i < 16; i++) {
    Class.transEliteSuperSpinnerCycloneBDN.GUNS.push(
        {
            POSITION: [15, 3, 1, 0, 0, (22.5 * i) + 11.25, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.gunner, { reload: 2.3, speed: 3.5, maxSpeed: 1.9, damage: 16.5, health: 16.5, pen: 16.5 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [15, 3, 1, 0, 0, (22.5 * i) - 11.25, 1 / 2],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.gunner, { reload: 2.3, speed: 3.5, maxSpeed: 1.9, damage: 16.5, health: 16.5, pen: 16.5 }]),
                TYPE: "bullet",
            },
        },
    )
};
Class.transEliteSpinnerBDN = {
    PARENT: ["transEliteBDN"],
    UPGRADE_LABEL: "Trans Elite Spinner",
    UPGRADE_COLOR: "trans",
    SKILL: skillSet({
        rld: 0.7,
        dam: 0.5,
        pen: 0.8,
        str: 0.8,
        spd: 0.2,
        atk: 0.3,
        hlt: 1,
        shi: 0.7,
        rgn: 0.7,
        mob: 1,
    }),
    AI: { STRAFE: false },
    FACING_TYPE: ["spin", { speed: 0.1 }],
    GUNS: [],
    TURRETS: [
        {
            POSITION: [9.5, 0, 0, 0, 360, 1],
            TYPE: ["transEliteSuperSpinnerCycloneBDN", { COLOR: -1 }],
        },
    ],
};
for (let i = 0; i < 3; i++) {
    Class.transEliteSpinnerBDN.GUNS.push(
        {
            POSITION: [8.5, 1.25, 1, -1.5, 11.5, 120 * i + 10, 8 / 10],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.twin, OGg.gunner, { speed: 1.3, maxSpeed: 1.3, reload: 2, damage: 15, health: 15, pen: 15 }]),
                TYPE: "bullet",
            },
        }, {
        POSITION: [8.5, 1.25, 1, 2, 9, 120 * i + 10, 6 / 10],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([OGg.basic, OGg.twin, OGg.gunner, { speed: 1.3, maxSpeed: 1.3, reload: 2, damage: 15, health: 15, pen: 15 }]),
            TYPE: "bullet",
        },
    }, {
        POSITION: [8.5, 1.25, 1, 3.5, 6.5, 120 * i + 10, 4 / 10],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([OGg.basic, OGg.twin, OGg.gunner, { speed: 1.3, maxSpeed: 1.3, reload: 2, damage: 15, health: 15, pen: 15 }]),
            TYPE: "bullet",
        },
    }, {
        POSITION: [8.5, 1.25, 1, 6, 4, 120 * i + 10, 2 / 10],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([OGg.basic, OGg.twin, OGg.gunner, { speed: 1.3, maxSpeed: 1.3, reload: 2, damage: 15, health: 15, pen: 15 }]),
            TYPE: "bullet",
        },
    }, {
        POSITION: [8.5, 1.25, 1, 8.5, 1.5, 120 * i + 10, 0 / 10],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([OGg.basic, OGg.twin, OGg.gunner, { speed: 1.3, maxSpeed: 1.3, reload: 2, damage: 15, health: 15, pen: 15 }]),
            TYPE: "bullet",
        },
    },
        {
            POSITION: [7.5, 2, 1, -1.5, 11.5, 120 * i + 10, 5 / 6],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.twin, OGg.gunner, { speed: 1.3, maxSpeed: 1.3, reload: 2, damage: 15, health: 15, pen: 15 }]),
                TYPE: "bullet",
            },
        }, {
        POSITION: [7.5, 2, 1, 2, 9, 120 * i + 10, 4 / 6],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([OGg.basic, OGg.twin, OGg.gunner, { speed: 1.3, maxSpeed: 1.3, reload: 2, damage: 15, health: 15, pen: 15 }]),
            TYPE: "bullet",
        },
    }, {
        POSITION: [7.5, 2, 1, 3.5, 6.5, 120 * i + 10, 3 / 6],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([OGg.basic, OGg.twin, OGg.gunner, { speed: 1.3, maxSpeed: 1.3, reload: 2, damage: 15, health: 15, pen: 15 }]),
            TYPE: "bullet",
        },
    }, {
        POSITION: [7.5, 2, 1, 6, 4, 120 * i + 10, 2 / 6],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([OGg.basic, OGg.twin, OGg.gunner, { speed: 1.3, maxSpeed: 1.3, reload: 2, damage: 15, health: 15, pen: 15 }]),
            TYPE: "bullet",
        },
    }, {
        POSITION: [7.5, 2, 1, 8.5, 1.5, 120 * i + 10, 1 / 6],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([OGg.basic, OGg.twin, OGg.gunner, { speed: 1.3, maxSpeed: 1.3, reload: 2, damage: 15, health: 15, pen: 15 }]),
            TYPE: "bullet",
        },
    },
        {
            POSITION: [6.5, 2, 1, -1.5, 11.5, 120 * i + 10, 6 / 7],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.twin, OGg.gunner, { speed: 1.3, maxSpeed: 1.3, reload: 2, damage: 15, health: 15, pen: 15 }]),
                TYPE: "bullet",
            },
        }, {
        POSITION: [6.5, 2, 1, 2, 9, 120 * i + 10, 5 / 7],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([OGg.basic, OGg.twin, OGg.gunner, { speed: 1.3, maxSpeed: 1.3, reload: 2, damage: 15, health: 15, pen: 15 }]),
            TYPE: "bullet",
        },
    }, {
        POSITION: [6.5, 2, 1, 3.5, 6.5, 120 * i + 10, 4 / 7],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([OGg.basic, OGg.twin, OGg.gunner, { speed: 1.3, maxSpeed: 1.3, reload: 2, damage: 15, health: 15, pen: 15 }]),
            TYPE: "bullet",
        },
    }, {
        POSITION: [6.5, 2, 1, 6, 4, 120 * i + 10, 3 / 7],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([OGg.basic, OGg.twin, OGg.gunner, { speed: 1.3, maxSpeed: 1.3, reload: 2, damage: 15, health: 15, pen: 15 }]),
            TYPE: "bullet",
        },
    }, {
        POSITION: [6.5, 2, 1, 8.5, 1.5, 120 * i + 10, 2 / 7],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([OGg.basic, OGg.twin, OGg.gunner, { speed: 1.3, maxSpeed: 1.3, reload: 2, damage: 15, health: 15, pen: 15 }]),
            TYPE: "bullet",
        },
    },
        {
            POSITION: [5.5, 2, 1, -1.5, 11.5, 120 * i + 10, 7 / 8],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.twin, OGg.gunner, { speed: 1.3, maxSpeed: 1.3, reload: 2, damage: 15, health: 15, pen: 15 }]),
                TYPE: "bullet",
            },
        }, {
        POSITION: [5.5, 2, 1, 2, 9, 120 * i + 10, 6 / 8],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([OGg.basic, OGg.twin, OGg.gunner, { speed: 1.3, maxSpeed: 1.3, reload: 2, damage: 15, health: 15, pen: 15 }]),
            TYPE: "bullet",
        },
    }, {
        POSITION: [5.5, 2, 1, 3.5, 6.5, 120 * i + 10, 5 / 8],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([OGg.basic, OGg.twin, OGg.gunner, { speed: 1.3, maxSpeed: 1.3, reload: 2, damage: 15, health: 15, pen: 15 }]),
            TYPE: "bullet",
        },
    }, {
        POSITION: [5.5, 2, 1, 6, 4, 120 * i + 10, 4 / 8],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([OGg.basic, OGg.twin, OGg.gunner, { speed: 1.3, maxSpeed: 1.3, reload: 2, damage: 15, health: 15, pen: 15 }]),
            TYPE: "bullet",
        },
    }, {
        POSITION: [5.5, 2, 1, 8.5, 1.5, 120 * i + 10, 3 / 8],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([OGg.basic, OGg.twin, OGg.gunner, { speed: 1.3, maxSpeed: 1.3, reload: 2, damage: 15, health: 15, pen: 15 }]),
            TYPE: "bullet",
        },
    },
        {
            POSITION: [4.5, 2, 1, -1.5, 11.5, 120 * i + 10, 8 / 9],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.twin, OGg.gunner, { speed: 1.3, maxSpeed: 1.3, reload: 2, damage: 15, health: 15, pen: 15 }]),
                TYPE: "bullet",
            },
        }, {
        POSITION: [4.5, 2, 1, 2, 9, 120 * i + 10, 7 / 9],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([OGg.basic, OGg.twin, OGg.gunner, { speed: 1.3, maxSpeed: 1.3, reload: 2, damage: 15, health: 15, pen: 15 }]),
            TYPE: "bullet",
        },
    }, {
        POSITION: [4.5, 2, 1, 3.5, 6.5, 120 * i + 10, 6 / 9],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([OGg.basic, OGg.twin, OGg.gunner, { speed: 1.3, maxSpeed: 1.3, reload: 2, damage: 15, health: 15, pen: 15 }]),
            TYPE: "bullet",
        },
    }, {
        POSITION: [4.5, 2, 1, 6, 4, 120 * i + 10, 5 / 9],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([OGg.basic, OGg.twin, OGg.gunner, { speed: 1.3, maxSpeed: 1.3, reload: 2, damage: 15, health: 15, pen: 15 }]),
            TYPE: "bullet",
        },
    }, {
        POSITION: [4.5, 2, 1, 8.5, 1.5, 120 * i + 10, 4 / 9],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([OGg.basic, OGg.twin, OGg.gunner, { speed: 1.3, maxSpeed: 1.3, reload: 2, damage: 15, health: 15, pen: 15 }]),
            TYPE: "bullet",
        },
    }, {
        POSITION: [2, 20, 0.75, 8, 0, 120 * i + 60, 0],
    },
    )
};














// Legions
Class.transdestroyerLegion = {
    PARENT: ["transEliteBDN"],
    UPGRADE_LABEL: "Trans Destroyer Legion",
    NAME: "Trans Destroyer Legion",
    DISPLAY_NAME: false,
    UPGRADE_COLOR: "trans",
    AI: { NO_LEAD: false },
    SIZE: 30,
    GUNS: [],
    BODY: {
        HEALTH: 400 * base.HEALTH,
    },
    TURRETS: [
        {
            POSITION: [11, 0, 0, 180, 360, 0],
            TYPE: ["crasherSpawnerlimited", { GUN_STAT_SCALE: { health: 1.1 } }],
        }, {
            POSITION: [11, 0, 0, 60, 360, 0],
            TYPE: ["crasherSpawnerlimited", { GUN_STAT_SCALE: { health: 1.1 } }],
        }, {
            POSITION: [11, 0, 0, -60, 360, 0],
            TYPE: ["crasherSpawnerlimited", { GUN_STAT_SCALE: { health: 1.1 } }],
        }, {
            POSITION: [11, 0, 0, 240, 360, 0],
            TYPE: ["crasherSpawnerlimited", { GUN_STAT_SCALE: { health: 1.1 } }],
        }, {
            POSITION: [11, 0, 0, 120, 360, 0],
            TYPE: ["crasherSpawnerlimited", { GUN_STAT_SCALE: { health: 1.1 } }],
        }, {
            POSITION: [11, 0, 0, 0, 360, 0],
            TYPE: ["crasherSpawnerlimited", { GUN_STAT_SCALE: { health: 1.1 } }],
        }, {
            POSITION: [11, 0, 0, 0, 360, 1],
            TYPE: ["nonupletGunBDN", { GUN_STAT_SCALE: { health: 1.1 }, INDEPENDENT: true, COLOR: -1 }],
        },
    ],
};
for (let i = 0; i < 3; i++) {
    Class.transdestroyerLegion.GUNS.push(
        {
            POSITION: [7, 16, 1, 6, 3, i * 120 + 67, 0.25],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.pounder, OGg.pounder, OGg.destroyer, { reload: 0.85, damage: 10, health: 11, pen: 10 }]),
                TYPE: "bullet",
                LABEL: "Devastator Secondary",
            },
        },
        {
            POSITION: [7, 16, 1, 6, -3, i * 120 + 53, 0.25],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.pounder, OGg.pounder, OGg.destroyer, { reload: 0.85, damage: 10, health: 11, pen: 10 }]),
                TYPE: "bullet",
                LABEL: "Devastator Secondary",
            },
        },
    )
    Class.transdestroyerLegion.GUNS.push(
        {
            POSITION: [7, 16, 1, 6, 0, i * 120 + 60, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.pounder, OGg.pounder, OGg.destroyer, { reload: 0.85, damage: 10, health: 11, pen: 10 }]),
                TYPE: "bullet",
                LABEL: "Devastator Primary",
            },
        },
    )
}
Class.transgunnerLegion = {
    PARENT: ["transEliteBDN"],
    UPGRADE_LABEL: "Trans Gunner Legion",
    NAME: "Trans Gunner Legion",
    DISPLAY_NAME: false,
    UPGRADE_COLOR: "trans",
    FACING_TYPE: "toTarget",
    AI: { NO_LEAD: false },
    SIZE: 30,
    BODY: {
        HEALTH: 400 * base.HEALTH,
    },
    GUNS: [
        {
            POSITION: [14, 16, 1, 0, 0, 180, 0],
        },
        {
            POSITION: [14, 13, 1, 0, 0, 180, 0],
        }, {
            POSITION: [4, 16, 1.5, 14, 0, 180, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.trap, OGg.hexaTrapper, OGg.setTrap, { reload: 0.8, damage: 6, health: 7, pen: 6 }]),
                TYPE: ["ssunsethyperDriverPillboxBDN", { MOTION_TYPE: "glide" }],
                STAT_CALCULATOR: "trap",
            },
        },
        {
            POSITION: [4, 13, 1.5, 14, 0, 180, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.trap, OGg.hexaTrapper, OGg.setTrap, { reload: 0.8, range: 0, damage: 0, health: 1.1 }]),
                TYPE: "bullet",
            },
        }, {
            POSITION: [6, 14, -2, 2, 0, 60, 0],
        }, {
            POSITION: [6, 14, -2, 2, 0, 300, 0],
        }, {
            POSITION: [6, 14, -2, 2, 0, 55, 0],
        }, {
            POSITION: [6, 14, -2, 2, 0, 305, 0],
        },
    ],
    AI: { NO_LEAD: false },
    TURRETS: [
        {
            POSITION: [14, 8, 0, 60, 180, 0],
            TYPE: ["ssuperbrimmerGunBDN", { GUN_STAT_SCALE: { health: 1.15 } }],
        }, {
            POSITION: [14, 8, 0, 300, 180, 0],
            TYPE: ["ssuperbrimmerGunBDN", { GUN_STAT_SCALE: { health: 1.15 } }],
        },
    ],
}
Class.transsprayerLegion = {
    PARENT: ["transEliteBDN"],
    UPGRADE_LABEL: "Trans Sprayer Legion",
    NAME: "Trans Sprayer Legion",
    DISPLAY_NAME: false,
    UPGRADE_COLOR: "trans",
    AI: { NO_LEAD: false },
    SIZE: 30,
    SKILL: [0, 9, 3, 9, 2, 9, 9, 9, 9, 0],
    HAS_NO_RECOIL: true,
    BODY: {
        HEALTH: 400 * base.HEALTH,
    },
    TURRETS: weaponArray({
        POSITION: [14, 6, 0, 60, 190, 0],
        TYPE: ["shyperSprayerGunBDN", { GUN_STAT_SCALE: { health: 7, damage: 7.3, speed: 7.3, resist: 1.15 }, COLOR: -1 }],
    }, 3)
}
Class.transbattleshipLegion = {
    PARENT: ["transEliteBDN"],
    UPGRADE_LABEL: "Trans Battleship Legion",
    NAME: "Trans Battleship Legion",
    DISPLAY_NAME: false,
    UPGRADE_COLOR: "trans",
    AI: { NO_LEAD: false },
    SIZE: 30,
    BODY: {
        HEALTH: 400 * base.HEALTH,
    },
    GUNS: [],
    TURRETS: [
        {
            POSITION: [5, 7.5, 0, 0, 360, 1],
            TYPE: ["sshypercarrierBDN", { GUN_STAT_SCALE: { health: 1.1 }, INDEPENDENT: true, COLOR: -1, PARENT: "sshypercarrierBDN" }],
        }, {
            POSITION: [5, 7.5, 0, 120, 360, 1],
            TYPE: ["sshypercarrierBDN", { GUN_STAT_SCALE: { health: 1.1 }, INDEPENDENT: true, COLOR: -1, PARENT: "sshypercarrierBDN" }],
        }, {
            POSITION: [5, 7.5, 0, 240, 360, 1],
            TYPE: ["sshypercarrierBDN", { GUN_STAT_SCALE: { health: 1.1 }, INDEPENDENT: true, COLOR: -1, PARENT: "sshypercarrierBDN" }],
        },
    ],
};
for (i = 0; i < 3; i++) {
    Class.transbattleshipLegion.GUNS.push(
        {
            POSITION: [3, 1, 0.6, 7, -13.25, i * 120 - 60, 2 / 3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.battleship, { size: 3, reload: 2, damage: 500, health: 500, pen: 500 }]),
                TYPE: "autoswarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [3, 1, 0.6, 7, 13.25, i * 120 - 60, 2 / 3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.battleship, { size: 3, reload: 2, damage: 500, health: 500, pen: 500 }]),
                TYPE: "autoswarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [3, 1, 0.6, 7, -5.25, i * 120 - 60, 2 / 3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.battleship, { size: 3, reload: 2, damage: 500, health: 500, pen: 500 }]),
                TYPE: "autoswarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [3, 1, 0.6, 7, 5.25, i * 120 - 60, 2 / 3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.battleship, { size: 3, reload: 2, damage: 500, health: 500, pen: 500 }]),
                TYPE: "autoswarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [3, 1, 0.6, 7, 4, i * 120 - 60, 2 / 3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.battleship, { size: 3, reload: 2, damage: 500, health: 500, pen: 500 }]),
                TYPE: "autoswarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [3, 1, 0.6, 7, -4, i * 120 - 60, 2 / 3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.battleship, { size: 3, reload: 2, damage: 500, health: 500, pen: 500 }]),
                TYPE: "autoswarm",
                STAT_CALCULATOR: "swarm",
            },
        },






        {
            POSITION: [4, 3, 0.6, 7, -11.25, i * 120 - 60, 1 / 3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.battleship, { size: 3, reload: 2, damage: 750, health: 750, pen: 750 }]),
                TYPE: "autoswarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [4, 3, 0.6, 7, 11.25, i * 120 - 60, 1 / 3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.battleship, { size: 3, reload: 2, damage: 750, health: 750, pen: 750 }]),
                TYPE: "autoswarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [4, 3, 0.6, 7, -7.25, i * 120 - 60, 1 / 3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.battleship, { size: 3, reload: 2, damage: 750, health: 750, pen: 750 }]),
                TYPE: "autoswarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [4, 3, 0.6, 7, 7.25, i * 120 - 60, 1 / 3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.battleship, { size: 3, reload: 2, damage: 750, health: 750, pen: 750 }]),
                TYPE: "autoswarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [4, 3, 0.6, 7, 2, i * 120 - 60, 1 / 3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.battleship, { size: 3, reload: 2, damage: 750, health: 750, pen: 750 }]),
                TYPE: "autoswarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [4, 3, 0.6, 7, -2, i * 120 - 60, 1 / 3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.battleship, { size: 3, reload: 2, damage: 750, health: 750, pen: 750 }]),
                TYPE: "autoswarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [5, 5, 0.6, 7, 0, i * 120 - 60, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.battleship, { size: 3, reload: 2, damage: 1000, health: 1000, pen: 1000 }]),
                TYPE: "autoswarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [5, 5, 0.6, 7, -9.25, i * 120 - 60, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.battleship, { size: 3, reload: 2, damage: 1000, health: 1000, pen: 1000 }]),
                TYPE: "autoswarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [5, 5, 0.6, 7, 9.25, i * 120 - 60, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.battleship, { size: 3, reload: 2, damage: 1000, health: 1000, pen: 1000 }]),
                STAT_CALCULATOR: "swarm",
            },
        },
    )
}
Class.transspawnerLegion = {
    PARENT: ["transEliteBDN"],
    UPGRADE_LABEL: "Trans Spawner Legion",
    NAME: "Trans Spawner Legion",
    DISPLAY_NAME: false,
    UPGRADE_COLOR: "trans",
    AI: { NO_LEAD: false },
    SIZE: 30,
    BODY: {
        HEALTH: 400 * base.HEALTH,
    },
    GUNS: [
        {
            POSITION: [11, 16, 1, 0, 0, 60, 0],
        },

        {
            POSITION: [11, 16, 1, 0, 0, 180, 0],
        },

        {
            POSITION: [11, 16, 1, 0, 0, 300, 0],
        }, {
            /*** LENGTH    WIDTH     ASPECT        X             Y         ANGLE     DELAY */
            POSITION: [2, 18, 1, 11, 0, 60, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.drone, OGg.weak, OGg.weak, OGg.weak, { size: 0.4 }, { health: 0.25, reload: 0.75 }]),
                TYPE: ["transSentrySwarmBDN", { GIVE_KILL_MESSAGE: false, VARIES_IN_SIZE: false }],
                SYNCS_SKILLS: true,
                AUTOFIRE: true,
                STAT_CALCULATOR: "drone",
            },
        }, {
            POSITION: [2, 18, 1, 11, 0, 180, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.drone, OGg.weak, OGg.weak, OGg.weak, { size: 0.4 }, { health: 0.25, reload: 0.75 }]),
                TYPE: ["transSentryTrapBDN", { GIVE_KILL_MESSAGE: false, VARIES_IN_SIZE: false }],
                SYNCS_SKILLS: true,
                AUTOFIRE: true,
                STAT_CALCULATOR: "drone",
            },
        }, {
            POSITION: [2, 18, 1, 11, 0, 300, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.drone, OGg.weak, OGg.weak, OGg.weak, { size: 0.4 }, { health: 0.25, reload: 0.75 }]),
                TYPE: ["transSentryGunBDN", { GIVE_KILL_MESSAGE: false, VARIES_IN_SIZE: false }],
                SYNCS_SKILLS: true,
                AUTOFIRE: true,
                STAT_CALCULATOR: "drone",
            },
        },
        {
            POSITION: [13, 10, 1, 0, 0, 60, 0],
        },
        {
            POSITION: [10, 3, 1, 2, -6, 55, 0],
        },
        {
            POSITION: [10, 3, 1, 2, 6, 65, 0],
        },
        {
            POSITION: [7, 3, 1, 4, -8, 50, 0],
        },
        {
            POSITION: [7, 3, 1, 4, 8, 70, 0],
        },


        {
            POSITION: [4, 5, 1.6, 10.25, 0, 180, 0],
        },
        {
            POSITION: [4, 5, 1.6, 9.5, 0, 180, 0],
        },
        {
            POSITION: [4, 5, 1.6, 8.75, 0, 180, 0],
        },
        {
            POSITION: [4, 5, 1.6, 8, 0, 180, 0],
        },

        {
            POSITION: [5, 6, 1.65, 8, 0, 300, 0],
        },
        {
            POSITION: [6, 6, 0.6, 8, 0, 300, 0],
        },
    ],
    TURRETS: [
        {
            POSITION: [11, 0, 0, 0, 360, 1],
            TYPE: ["nonupletGunBDN", { GUN_STAT_SCALE: { health: 1.15 }, INDEPENDENT: false, COLOR: -1 }],
        },
    ],
}
// Legionary Crasher
Class.translegionaryCrasherTop = {
    PARENT: ["transEliteBDN"],
    AI: { STRAFE: false, NO_LEAD: false },
    INDEPENDENT: true,
    DISPLAY_NAME: false,
    GUNS: [
        {
            /*** LENGTH    WIDTH     ASPECT        X             Y         ANGLE     DELAY */
            POSITION: [2, 18, 1, 11, 0, 60, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.drone, OGg.weak, { size: 0.4 }, { health: 0.5, reload: 0.6 }]),
                TYPE: ["transSentrySwarmBDN", { GIVE_KILL_MESSAGE: false, VARIES_IN_SIZE: false }],
                SYNCS_SKILLS: true,
                AUTOFIRE: true,
                STAT_CALCULATOR: "drone",
                MAX_CHILDREN: 1,
            },
        }, {
            POSITION: [2, 18, 1, 11, 0, 180, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.drone, OGg.weak, { size: 0.4 }, { health: 0.5, reload: 0.6 }]),
                TYPE: ["transSentryTrapBDN", { GIVE_KILL_MESSAGE: false, VARIES_IN_SIZE: false }],
                SYNCS_SKILLS: true,
                AUTOFIRE: true,
                STAT_CALCULATOR: "drone",
                MAX_CHILDREN: 1,
            },
        }, {
            POSITION: [2, 18, 1, 11, 0, 300, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.drone, OGg.weak, { size: 0.4 }, { health: 0.5, reload: 0.6 }]),
                TYPE: ["transSentryGunBDN", { GIVE_KILL_MESSAGE: false, VARIES_IN_SIZE: false }],
                SYNCS_SKILLS: true,
                AUTOFIRE: true,
                STAT_CALCULATOR: "drone",
                MAX_CHILDREN: 1,
            },
        },



        ...weaponArray([
            {
                POSITION: [7, 16, 1, 6, 3, i * 120 + 67, 0.25],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([OGg.basic, OGg.pounder, OGg.pounder, OGg.destroyer, { reload: 0.9, damage: 10, health: 10, pen: 10 }]),
                    TYPE: "bullet",
                    LABEL: "Devastator Secondary",
                },
            },
            {
                POSITION: [7, 16, 1, 6, -3, i * 120 + 53, 0.25],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([OGg.basic, OGg.pounder, OGg.pounder, OGg.destroyer, { reload: 0.9, damage: 10, health: 10, pen: 10 }]),
                    TYPE: "bullet",
                    LABEL: "Devastator Secondary",
                },
            },
            {
                POSITION: [7, 16, 1, 6, 0, i * 120 + 60, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([OGg.basic, OGg.pounder, OGg.pounder, OGg.destroyer, { reload: 0.9, damage: 10, health: 10, pen: 10 }]),
                    TYPE: "bullet",
                    LABEL: "Devastator Primary",
                },
            },
                        {
                POSITION: [4.5, 5, 0.7, 7, 0, 60, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.pounder, OGg.pounder, OGg.destroyer, { damage: 8, health: 8, pen: 8, reload: 2.5 }, { speed: 2.5, maxSpeed: 2.2, size: 1.1, range: 7 }]),
                    TYPE: ["swarm", { INDEPENDENT: true }],
                    STAT_CALCULATOR: "swarm",
                    AUTOFIRE: true,

                },
            },
            {
                POSITION: [4, 5, 0.7, 7, 5, 60, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.pounder, OGg.pounder, OGg.destroyer, { damage: 8, health: 8, pen: 8, reload: 2.5 }, { speed: 2.5, maxSpeed: 2.2, size: 1.1, range: 7 }]),
                    TYPE: ["swarm", { INDEPENDENT: true }],
                    STAT_CALCULATOR: "swarm",
                    AUTOFIRE: true,

                },
            }, {
                POSITION: [4, 5, 0.7, 7, -5, 60, 1 / 4],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.pounder, OGg.pounder, OGg.destroyer, { damage: 8, health: 8, pen: 8, reload: 2.5 }, { speed: 2.5, maxSpeed: 2.2, size: 1.1, range: 7 }]),
                    TYPE: ["swarm", { INDEPENDENT: true }],
                    STAT_CALCULATOR: "swarm",
                    AUTOFIRE: true,
                },
            }, {
                POSITION: [3.5, 5, 0.7, 7, -2.5, 60, 2 / 4],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.pounder, OGg.pounder, OGg.destroyer, { damage: 8, health: 8, pen: 8, reload: 2.5 }, { speed: 2.5, maxSpeed: 2.2, size: 1.1, range: 7 }]),
                    TYPE: ["swarm", { INDEPENDENT: true }],
                    STAT_CALCULATOR: "swarm",
                    AUTOFIRE: true,
                },
            }, {
                POSITION: [3.5, 5, 0.7, 7, 2.5, 60, 3 / 4],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.pounder, OGg.pounder, OGg.destroyer, { damage: 8, health: 8, pen: 8, reload: 2.5 }, { speed: 2.5, maxSpeed: 2.2, size: 1.1, range: 7 }]),
                    TYPE: ["swarm", { INDEPENDENT: true }],
                    STAT_CALCULATOR: "swarm",
                    AUTOFIRE: true,
                },
            }
        ], 3),
    ],
    TURRETS: [
        {
            POSITION: [11, 0, 0, 0, 360, 1],
            TYPE: ["nonupletGunBDN", { INDEPENDENT: true, COLOR: -1 }],
        },
        ...weaponArray([
            {
                POSITION: [9.5, 10, 0, 0, 190, 0],
                TYPE: ["nonupletGunBDN", { GUN_STAT_SCALE: { damage: 3.2, health: 3, speed: 3, maxSpeed: 2, resist: 1.1, range: 2.3 } }],
            }], 3),
    ]
}
Class.translegionaryCrasherSpawner = {
    PARENT: 'genericTank',
    SHAPE: "",
    INDEPENDENT: true,
    GUNS: [{
        POSITION: [0, 10, 0, 0, 0, 0, 10],
        PROPERTIES: {
            TYPE: 'transdestroyerLegion',
            SHOOT_SETTINGS: combineStats([{ reload: 0.1 }]),
            NO_LIMITATIONS: true,
            INDEPENDENT_CHILDREN: true,
            MAX_CHILDREN: 1,
            IDENTIFIER: 1,
            AUTOFIRE: true,
        }
    }],
    ON: [{
        event: "fire",
        handler: ({ gun }) => {
            gun.setBulletType(["transdestroyerLegion", "transgunnerLegion", "transsprayerLegion", "transbattleshipLegion", "transspawnerLegion"][gun.identifier++ % 5]);
        }
    }],
}
Class.translegionaryCrasher = {
    PARENT: ["transEliteBDN"],
    LABEL: "Trans Legionary Crasher",
    NAME: "Trans Legionary Crasher",
    DISPLAY_NAME: false,
    UPGRADE_COLOR: "trans",
    AI: { STRAFE: false, NO_LEAD: false },
    HAS_NO_RECOIL: true,
    VALUE: 1e11,
    SIZE: 160,
    BODY: {
        FOV: 1.5,
        SPEED: 0.1 * base.SPEED,
        HEALTH: 100000,
        DAMAGE: 250 * base.DAMAGE,
    },
    GUNS: [
        ...weaponArray([
            {
                POSITION: [14.5, 13, 1, 0, 0, 0, 0],
            }, {
                POSITION: [3, 13, 1.7, 14.5, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([OGg.trap, OGg.setTrap, OGg.pounder, { reload: 1.8, speed: 3.2, size: 0.9, maxSpeed: 2.5, range: 1.1 }, { damage: 27, health: 27, pen: 27 }]),
                    TYPE: "translegionaryPillbox",
                    NO_LIMITATIONS: true,
                    STAT_CALCULATOR: "trap",
                },
            },
        ], 3),
        ...weaponArray({
            POSITION: [5, 12, 1.6, -11, 0, 0, 0],
        }, 3),
    ],
    TURRETS: [
        {
            POSITION: [12, 0, 0, 0, 360, 1],
            TYPE: "translegionaryCrasherTop",
        },
        ...weaponArray({
            POSITION: [14, 8, 0, 60, 180, 0],
            TYPE: ["shyperSprayerGunBDN", { GUN_STAT_SCALE: { speed: 2, health: 280.8, damage: 270, resist: 1.5 }, COLOR: -1 }],
        }, 3),
        {
            POSITION: [12, 0, 0, 0, 0, 0],
            TYPE: 'translegionaryCrasherSpawner'
        }
    ],
}
Class.translegionaryCrasherSpawnerFix = {
    PARENT: 'genericTank',
    SHAPE: "",
    INDEPENDENT: true,
    GUNS: [{
        POSITION: [0, 10, 0, 0, 0, 0, 10],
        PROPERTIES: {
            TYPE: 'transdestroyerLegion',
            SHOOT_SETTINGS: combineStats([{ reload: 0.1, size: 0.75 }]),
            NO_LIMITATIONS: true,
            INDEPENDENT_CHILDREN: false,
            MAX_CHILDREN: 5,
            IDENTIFIER: 1,
            AUTOFIRE: true,
        }
    }],
    ON: [{
        event: "fire",
        handler: ({ gun }) => {
            gun.setBulletType(["transdestroyerLegion", "transgunnerLegion", "transsprayerLegion", "transbattleshipLegion", "transspawnerLegion"][gun.identifier++ % 5]);
        }
    }],
}
Class.translegionaryCrasherFix = {
    PARENT: ["transEliteBDN"],
    LABEL: "Trans Legionary Crasher",
    NAME: "Trans Legionary Crasher",
    DISPLAY_NAME: false,
    UPGRADE_COLOR: "trans",
    AI: { STRAFE: false, NO_LEAD: false },
    HAS_NO_RECOIL: true,
    VALUE: 1e11,
    SIZE: 160,
    BODY: {
        FOV: 1.5,
        SPEED: 0.1 * base.SPEED,
        HEALTH: 100000,
        DAMAGE: 250 * base.DAMAGE,
    },
    GUNS: [
        ...weaponArray([
            {
                POSITION: [14.5, 13, 1, 0, 0, 0, 0],
            }, {
                POSITION: [3, 13, 1.7, 14.5, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([OGg.trap, OGg.setTrap, OGg.pounder, { reload: 1.8, speed: 3.2, size: 0.9, maxSpeed: 2.5, range: 1.1 }, { damage: 216, health: 216, pen: 216 }]),
                    TYPE: "translegionaryPillbox",
                    NO_LIMITATIONS: true,
                    STAT_CALCULATOR: "trap",
                },
            },
        ], 3),
        ...weaponArray({
            POSITION: [5, 12, 1.6, -11, 0, 0, 0],
        }, 3),
    ],
    TURRETS: [
        {
            POSITION: [12, 0, 0, 0, 360, 1],
            TYPE: "translegionaryCrasherTop",
        },
        ...weaponArray({
            POSITION: [14, 8, 0, 60, 180, 0],
            TYPE: ["shyperSprayerGunBDN", { GUN_STAT_SCALE: { speed: 2, health: 93.6, damage: 90, resist: 1.5 }, COLOR: -1 }],
        }, 3),
        {
            POSITION: [12, 0, 0, 0, 0, 0],
            TYPE: 'translegionaryCrasherSpawnerFix'
        }
    ],
}
Class.transElitesBDN = makeMenu("Trans Elites")
Class.transElitesBDN.COLOR = "trans"
Class.transElitesBDN.UPGRADE_COLOR = "trans"
Class.transElitesBDN.UPGRADES_TIER_0 = ["transEliteDestroyerBDN", "transEliteGunnerBDN", "transEliteSprayerBDN", "transEliteBattleshipBDN", "transEliteSpawnerBDN", "transEliteTrapGuardBDN", "transEliteSpinnerBDN", "transsprayerLegion", "translegionaryCrasher", "translegionaryCrasherFix"]
Class.transElitesBDN.SHAPE = 3.5
Class.rainbowElitesBDN.UPGRADES_TIER_0.push("transElitesBDN")
























// Epilepsy Elites :money_mouth:
Class.megaquintupletGunBDN = {
    PARENT: "autoTankGun",
    GUNS: [
        {
            POSITION: [14, 7, 1, 0, -4.5, 0, 0.8],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.autoTurret, OGg.twin, OGg.twin, OGg.power, { reload: 1.5, speed: 3, maxspeed: 3 }, { size: 2, reload: 2, damage: 40, health: 40, pen: 40 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [14, 7, 1, 0, 4.5, 0, 0.6],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.autoTurret, OGg.twin, OGg.twin, OGg.power, { reload: 1.5, speed: 3, maxspeed: 3 }, { size: 2, reload: 2, damage: 40, health: 40, pen: 40 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [15, 7, 1, 0, -2.25, 0, 0.4],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.autoTurret, OGg.twin, OGg.twin, OGg.power, { reload: 1.5, speed: 3, maxspeed: 3 }, { size: 2, reload: 2, damage: 40, health: 40, pen: 40 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [15, 7, 1, 0, 2.25, 0, 0.2],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.autoTurret, OGg.twin, OGg.twin, OGg.power, { reload: 1.5, speed: 3, maxspeed: 3 }, { size: 2, reload: 2, damage: 40, health: 40, pen: 40 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [16, 7, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.autoTurret, OGg.twin, OGg.twin, OGg.power, { reload: 1.5, speed: 3, maxspeed: 3 }, { size: 2, reload: 2, damage: 40, health: 40, pen: 40 }]),
                TYPE: "bullet",
            },
        },
    ],
}
Class.epilepsyEliteBDN = {
    PARENT: ["miniboss"],
    LABEL: "Epilepsy Elite Crasher",
    COLOR: 20,
    SHAPE: 3,
    SIZE: 48,
    DANGER: 320,
    VARIES_IN_SIZE: true,
    VALUE: 46e6,
    BODY: {
        FOV: 1.25,
        SPEED: 0.125 * base.SPEED,
        HEALTH: 600 * base.HEALTH,
        DAMAGE: 20 * base.DAMAGE,
        REGEN: 10 * base.REGEN,
    },
};
Class.epilepsyEliteDestroyerBDN = {
    PARENT: ["epilepsyEliteBDN"],
    UPGRADE_LABEL: "Epilepsy Elite Destroyer",
    UPGRADE_COLOR: 20,
    GUNS: [],
    TURRETS: [
        {
            POSITION: [11, 0, 0, 180, 360, 0],
            TYPE: ["crasherSpawnerlimited"],
        }, {
            POSITION: [11, 0, 0, 60, 360, 0],
            TYPE: ["crasherSpawnerlimited"],
        }, {
            POSITION: [11, 0, 0, -60, 360, 0],
            TYPE: ["crasherSpawnerlimited"],
        }, {
            POSITION: [11, 0, 0, 240, 360, 0],
            TYPE: ["crasherSpawnerlimited"],
        }, {
            POSITION: [11, 0, 0, 120, 360, 0],
            TYPE: ["crasherSpawnerlimited"],
        }, {
            POSITION: [11, 0, 0, 0, 360, 0],
            TYPE: ["crasherSpawnerlimited"],
        }, {
            POSITION: [11, 0, 0, 0, 360, 1],
            TYPE: ["megaquintupletGunBDN", { INDEPENDENT: true, COLOR: -1 }],
        },
    ],
};

for (let i = 0; i < 3; i++) {
    Class.epilepsyEliteDestroyerBDN.GUNS.push(
        {
            POSITION: [7, 16, 1, 6, 5, i * 120 + 74, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.pounder, OGg.pounder, OGg.destroyer, { reload: 0.9, damage: 50, health: 50, pen: 50 }]),
                TYPE: "bullet",
                LABEL: "Devastator Secondary",
            },
        },
        {
            POSITION: [7, 16, 1, 6, -5, i * 120 + 44, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.pounder, OGg.pounder, OGg.destroyer, { reload: 0.9, damage: 50, health: 50, pen: 50 }]),
                TYPE: "bullet",
                LABEL: "Devastator Secondary",
            },
        },
        {
            POSITION: [7, 16, 1, 6, 3, i * 120 + 67, 0.25],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.pounder, OGg.pounder, OGg.destroyer, { reload: 0.9, damage: 50, health: 50, pen: 50 }]),
                TYPE: "bullet",
                LABEL: "Devastator Secondary",
            },
        },
        {
            POSITION: [7, 16, 1, 6, -3, i * 120 + 53, 0.25],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.pounder, OGg.pounder, OGg.destroyer, { reload: 0.9, damage: 50, health: 50, pen: 50 }]),
                TYPE: "bullet",
                LABEL: "Devastator Secondary",
            },
        },
    )
    Class.epilepsyEliteDestroyerBDN.GUNS.push(
        {
            POSITION: [7, 16, 1, 6, 0, i * 120 + 60, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.pounder, OGg.pounder, OGg.destroyer, { reload: 0.9, damage: 50, health: 50, pen: 50 }]),
                TYPE: "bullet",
                LABEL: "Devastator Primary",
            },
        },
    )
}
Class.epilepsyEliteGunnerBDN = {
    PARENT: ["epilepsyEliteBDN"],
    UPGRADE_LABEL: "Epilepsy Elite Gunner",
    UPGRADE_COLOR: 20,
    FACING_TYPE: "toTarget",
    GUNS: [
        {
            POSITION: [14, 16, 1, 0, 0, 180, 0],
        },
        {
            POSITION: [14, 13, 1, 0, 0, 180, 0],
        }, {
            POSITION: [4, 16, 1.5, 14, 0, 180, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.trap, OGg.hexaTrapper, OGg.setTrap, OGg.setTrap, { reload: 0.8, damage: 12, health: 12, pen: 12 }]),
                TYPE: ["sssunsethyperDriverPillboxBDN", { MOTION_TYPE: "glide" }],
                STAT_CALCULATOR: "trap",
            },
        },
        {
            POSITION: [4, 13, 1.5, 14, 0, 180, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.trap, OGg.hexaTrapper, OGg.setTrap, { reload: 0.8, range: 0, damage: 0 }]),
                TYPE: "bullet",
            },
        }, {
            POSITION: [6, 14, -2, 2, 0, 60, 0],
        }, {
            POSITION: [6, 14, -2, 2, 0, 300, 0],
        }, {
            POSITION: [6, 14, -2, 2, 0, 55, 0],
        }, {
            POSITION: [6, 14, -2, 2, 0, 305, 0],
        },
    ],
    AI: { NO_LEAD: false },
    TURRETS: [
        {
            POSITION: [14, 8, 0, 60, 180, 0],
            TYPE: ["hyperbrimmerGunBDN"],
        }, {
            POSITION: [14, 8, 0, 300, 180, 0],
            TYPE: ["hyperbrimmerGunBDN"],
        },
    ],
};
Class.epilepsyEliteSprayerBDN = {
    PARENT: ["epilepsyEliteBDN"],
    UPGRADE_LABEL: "Epilepsy Elite Sprayer",
    UPGRADE_COLOR: 20,
    SKILL: skillSet({
        rld: 0.7,
        dam: 0.5,
        pen: 0.8,
        str: 0.8,
        spd: 0.2,
        atk: 0.3,
        hlt: 1,
        shi: 0.7,
        rgn: 0.7,
        mob: 1,
    }),
    AI: { NO_LEAD: false },
    HAS_NO_RECOIL: true,
    GUNS: [],
    TURRETS: [
        {
            /*    SIZE         X             Y         ANGLE        ARC */
            POSITION: [6.5, 0, 0, 0, 360, 1],
            TYPE: ["sssupersprayerDodecagrammataTurretBDN", { INDEPENDENT: true }],
        }, {
            POSITION: [9, 6, -7, 180, 130, 0],
            TYPE: ["ssshyperSprayerGunBDN", { COLOR: "grey" }],
        }, {
            POSITION: [9, 6, 7, 180, 130, 0],
            TYPE: ["ssshyperSprayerGunBDN", { COLOR: "grey" }],
        }, {
            POSITION: [9, 6, 7, 60, 130, 0],
            TYPE: ["ssshyperSprayerGunBDN", { COLOR: "grey" }],
        }, {
            POSITION: [9, 6, -7, 60, 130, 0],
            TYPE: ["ssshyperSprayerGunBDN", { COLOR: "grey" }],
        }, {
            POSITION: [9, 6, 7, -60, 130, 0],
            TYPE: ["ssshyperSprayerGunBDN", { COLOR: "grey" }],
        }, {
            POSITION: [9, 6, -7, -60, 130, 0],
            TYPE: ["ssshyperSprayerGunBDN", { COLOR: "grey" }],
        },
    ],
};
Class.ssshypercarrierBDN = {
    PARENT: "autoTankGun",
    LABEL: "",
    STAT_NAMES: statnames.swarm,
    FACING_TYPE: "locksFacing",
    BODY: {
        FOV: base.FOV * 1.2,
    },
    GUNS: [

        {
            POSITION: [16, 16, 1.4, 7, 0, 90, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.battleship, OGg.carrier, { size: 3, reload: 5, damage: 180, health: 180, pen: 180 }]),
                TYPE: "swarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [16, 16, 1.4, 7, 0, -90, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.battleship, OGg.carrier, { size: 3, reload: 5, damage: 180, health: 180, pen: 180 }]),
                TYPE: "swarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [16, 16, 1.4, 7, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.battleship, OGg.carrier, { size: 3, reload: 5, damage: 180, health: 180, pen: 180 }]),
                TYPE: "swarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [16, 16, 1.4, 7, 0, 180, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.battleship, OGg.carrier, { size: 3, reload: 5, damage: 180, health: 180, pen: 180 }]),
                TYPE: "swarm",
                STAT_CALCULATOR: "swarm",
            },
        },
    ],
}
Class.epilepsyEliteBattleshipBDN = {
    PARENT: ["epilepsyEliteBDN"],
    UPGRADE_LABEL: "Epilepsy Elite Battleship",
    UPGRADE_COLOR: 20,
    GUNS: [],
    TURRETS: [
        {
            POSITION: [5, 7.5, 0, 0, 360, 1],
            TYPE: "ssshypercarrierBDN",
        }, {
            POSITION: [5, 7.5, 0, 120, 360, 1],
            TYPE: "ssshypercarrierBDN",
        }, {
            POSITION: [5, 7.5, 0, 240, 360, 1],
            TYPE: "ssshypercarrierBDN",
        },
        ...weaponArray({
            POSITION: [5, 25, 0, 0, 190, 1],
            TYPE: ["ssshypercarrierBDN", { GUN_STAT_SCALE: { size: 3, reload: 3, health: 1000, damage: 1000, pen: 1000 }, COLOR: -1 }],
        }, 3)
    ],
};
for (i = 0; i < 3; i++) {
    Class.epilepsyEliteBattleshipBDN.GUNS.push(

        {
            POSITION: [3, 2, 0.6, 7, -13, i * 120 - 60, 2 / 3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.battleship, { size: 3, reload: 3, damage: 1000, health: 1000, pen: 1000 }]),
                TYPE: "autoswarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [3, 2, 0.6, 7, 13, i * 120 - 60, 2 / 3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.battleship, { size: 3, reload: 3, damage: 1000, health: 1000, pen: 1000 }]),
                TYPE: "autoswarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [3, 2, 0.6, 7, -5, i * 120 - 60, 2 / 3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.battleship, { size: 3, reload: 3, damage: 1000, health: 1000, pen: 1000 }]),
                TYPE: "autoswarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [3, 2, 0.6, 7, 5, i * 120 - 60, 2 / 3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.battleship, { size: 3, reload: 3, damage: 1000, health: 1000, pen: 1000 }]),
                TYPE: "autoswarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [3, 2, 0.6, 7, 3.75, i * 120 - 60, 2 / 3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.battleship, { size: 3, reload: 3, damage: 1000, health: 1000, pen: 1000 }]),
                TYPE: "autoswarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [3, 2, 0.6, 7, -3.75, i * 120 - 60, 2 / 3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.battleship, { size: 3, reload: 3, damage: 1000, health: 1000, pen: 1000 }]),
                TYPE: "autoswarm",
                STAT_CALCULATOR: "swarm",
            },
        },






        {
            POSITION: [4, 4, 0.6, 7, -11, i * 120 - 60, 1 / 3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.battleship, { size: 3, reload: 3, damage: 1500, health: 1500, pen: 1500 }]),
                TYPE: "autoswarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [4, 4, 0.6, 7, 11, i * 120 - 60, 1 / 3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.battleship, { size: 3, reload: 3, damage: 1500, health: 1500, pen: 1500 }]),
                TYPE: "autoswarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [4, 4, 0.6, 7, -7, i * 120 - 60, 1 / 3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.battleship, { size: 3, reload: 3, damage: 1500, health: 1500, pen: 1500 }]),
                TYPE: "autoswarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [4, 4, 0.6, 7, 7, i * 120 - 60, 1 / 3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.battleship, { size: 3, reload: 3, damage: 1500, health: 1500, pen: 1500 }]),
                TYPE: "autoswarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [4, 4, 0.6, 7, 1.5, i * 120 - 60, 1 / 3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.battleship, { size: 3, reload: 3, damage: 1500, health: 1500, pen: 1500 }]),
                TYPE: "autoswarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [4, 4, 0.6, 7, -1.5, i * 120 - 60, 1 / 3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.battleship, { size: 3, reload: 3, damage: 1500, health: 1500, pen: 1500 }]),
                TYPE: "autoswarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [5, 5, 0.6, 7, 0, i * 120 - 60, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.battleship, { size: 3, reload: 3, damage: 2000, health: 2000, pen: 2000 }]),
                TYPE: "autoswarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [5, 5, 0.6, 7, -9, i * 120 - 60, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.battleship, { size: 3, reload: 3, damage: 2000, health: 2000, pen: 2000 }]),
                TYPE: "autoswarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [5, 5, 0.6, 7, 9, i * 120 - 60, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.battleship, { size: 3, reload: 3, damage: 2000, health: 2000, pen: 2000 }]),
                STAT_CALCULATOR: "swarm",
            },
        },
    )
}
Class.epilepsySentryBDN = {
    PARENT: ["sentry"],
    COLOR: 20,
    UPGRADE_COLOR: 20,
    DANGER: 4,
    SIZE: 30,
    VALUE: 5e8,
    SHAPE: 3,
    BODY: {
        HEALTH: 50 * base.HEALTH
    },
};
Class.epilepsySentrySwarmBDN = {
    PARENT: ["epilepsySentryBDN"],
    UPGRADE_LABEL: "Epilepsy Swarm Sentry",
    UPGRADE_COLOR: 20,
    GUNS: [
        {
            POSITION: [7, 9, 0.6, 7, -5, 60, 2 / 3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, { recoil: 0.1 }, { reload: 1, damage: 90, health: 90, pen: 90 }]),
                TYPE: "swarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [7, 9, 0.6, 7, 5, 300, 2 / 3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, { recoil: 0.1 }, { reload: 1, damage: 90, health: 90, pen: 90 }]),
                TYPE: "swarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [7, 9, 0.6, 7, 5, 60, 2 / 3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, { recoil: 0.1 }, { reload: 1, damage: 90, health: 90, pen: 90 }]),
                TYPE: "swarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [7, 9, 0.6, 7, -5, 300, 2 / 3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, { recoil: 0.1 }, { reload: 1, damage: 90, health: 90, pen: 90 }]),
                TYPE: "swarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [7, 9, 0.6, 7, 2.5, 60, 1 / 3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, { recoil: 0.1 }, { reload: 1, damage: 90, health: 90, pen: 90 }]),
                TYPE: "swarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [7, 9, 0.6, 7, -2.5, 300, 1 / 3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, { recoil: 0.1 }, { reload: 1, damage: 90, health: 90, pen: 90 }]),
                TYPE: "swarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [7, 9, 0.6, 7, -2.5, 60, 1 / 3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, { recoil: 0.1 }, { reload: 1, damage: 90, health: 90, pen: 90 }]),
                TYPE: "swarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [7, 9, 0.6, 7, 2.5, 300, 1 / 3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, { recoil: 0.1 }, { reload: 1, damage: 90, health: 90, pen: 90 }]),
                TYPE: "swarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [7, 9, 0.6, 7, 0, 60, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, { recoil: 0.1 }, { reload: 1, damage: 90, health: 90, pen: 90 }]),
                TYPE: "swarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [7, 9, 0.6, 7, 0, 300, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, { recoil: 0.1 }, { reload: 1, damage: 90, health: 90, pen: 90 }]),
                TYPE: "swarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [6, 13, 1.3, 7, -2.5, 180, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, { recoil: 1.15 }, OGg.machineGun, { reload: 0.6, damage: 105, health: 105, pen: 105 }]),
                TYPE: "swarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [6, 13, 1.3, 7, 2.5, 180, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, { recoil: 1.15 }, OGg.machineGun, { reload: 0.6, damage: 105, health: 105, pen: 105 }]),
                TYPE: "swarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [6, 13, 1.3, 7, 0, 180, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, { recoil: 1.15 }, OGg.machineGun, { reload: 0.6, damage: 105, health: 105, pen: 105 }]),
                TYPE: "swarm",
                STAT_CALCULATOR: "swarm",
            },
        },

    ],
};
Class.superterabarricaderAutoTankGunBDN = {
    PARENT: ["genericTank"],
    LABEL: "Turret",
    BODY: {
        FOV: 0.5,
    },
    INDEPENDENT: true,
    CONTROLLERS: ["nearestDifferentMaster"],
    COLOR: "grey",
    AI: {
        SKYNET: true,
        FULL_VIEW: true,
    },
    GUNS: [
        {
            POSITION: [24, 18, 1, 0, 0, 0, 0],
        },
        {
            POSITION: [4, 18, 1.3, 2, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.trap, OGg.minigun, { range: 0.6 }, { reload: 2, damage: 120, health: 120, pen: 120 }]),
                TYPE: "trap",
                STAT_CALCULATOR: "trap",
            },
        },

        {
            POSITION: [4, 18, 1.3, 30, 0, 0, 1 / 6],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.trap, OGg.minigun, { range: 0.6 }, { reload: 2, damage: 120, health: 120, pen: 120 }]),
                TYPE: "trap",
                STAT_CALCULATOR: "trap",
            },
        },
        {
            POSITION: [4, 18, 1.3, 26, 0, 0, 2 / 6],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.trap, OGg.minigun, { range: 0.6 }, { reload: 2, damage: 120, health: 120, pen: 120 }]),
                TYPE: "trap",
                STAT_CALCULATOR: "trap",
            },
        },
        {
            POSITION: [4, 18, 1.3, 22, 0, 0, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.trap, OGg.minigun, { range: 0.6 }, { reload: 2, damage: 120, health: 120, pen: 120 }]),
                TYPE: "trap",
                STAT_CALCULATOR: "trap",
            },
        },
        {
            POSITION: [4, 18, 1.3, 18, 0, 0, 4 / 6],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.trap, OGg.minigun, { range: 0.6 }, { reload: 2, damage: 120, health: 120, pen: 120 }]),
                TYPE: "trap",
                STAT_CALCULATOR: "trap",
            },
        },
        {
            POSITION: [4, 18, 1.3, 14, 0, 0, 5 / 6],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.trap, OGg.minigun, { range: 0.6 }, { reload: 2, damage: 120, health: 120, pen: 120 }]),
                TYPE: "trap",
                STAT_CALCULATOR: "trap",
            },
        },
    ],
};
Class.epilepsySentryTrapBDN = makeAuto(Class.epilepsySentryBDN, "Sentry", {
    type: Class.superterabarricaderAutoTankGunBDN,
    size: 12,
});
Class.epilepsySentryTrapBDN.UPGRADE_LABEL = "Epilepsy Trap Sentry";
Class.epilepsySentryTrapBDN.GUNS = [
    {
        POSITION: [14, 11, 1, 0, 0, 180, 0],
    },
    {
        POSITION: [3, 11, 1.2, 14, 0, 180, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([OGg.trap, OGg.setTrap, { recoil: 1.15 }, { reload: 2, damage: 100, health: 118, pen: 118 }]),
            TYPE: "setTrap",
            STAT_CALCULATOR: "trap",
        },
    },
]
Class.shypermortarAutoTankgunBDN = {
    PARENT: ["genericTank"],
    LABEL: "Mortar",
    BODY: {
        FOV: 2,
    },
    CONTROLLERS: [
        "canRepel",
        "onlyAcceptInArc",
        "mapAltToFire",
        "nearestDifferentMaster",
    ],
    COLOR: "grey",
    GUNS: [
        {
            POSITION: [16, 3, 1, 0, -7.5, -13, 1 / 7],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.pelleter, OGg.artillery, { reload: 0.7, damage: 50, health: 45, pen: 45 }]),
                TYPE: "bullet",
                LABEL: "Tetiary",
            },
        },
        {
            POSITION: [16, 3, 1, 0, 7.5, 13, 1 / 7],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.pelleter, OGg.artillery, { reload: 0.7, damage: 50, health: 45, pen: 45 }]),
                TYPE: "bullet",
                LABEL: "Tetiary",
            },
        },
        {
            POSITION: [16.5, 3, 1, 0, -7, -11, 2 / 7],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.pelleter, OGg.artillery, { reload: 0.7, damage: 50, health: 45, pen: 45 }]),
                TYPE: "bullet",
                LABEL: "Tetiary",
            },
        },
        {
            POSITION: [16.5, 3, 1, 0, 7, 11, 2 / 7],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.pelleter, OGg.artillery, { reload: 0.7, damage: 50, health: 45, pen: 45 }]),
                TYPE: "bullet",
                LABEL: "Tetiary",
            },
        },
        {
            POSITION: [17, 3, 1, 0, -6.5, -9, 3 / 7],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.pelleter, OGg.artillery, { reload: 0.7, damage: 50, health: 45, pen: 45 }]),
                TYPE: "bullet",
                LABEL: "Tetiary",
            },
        },
        {
            POSITION: [17, 3, 1, 0, 6.5, 9, 3 / 7],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.pelleter, OGg.artillery, { reload: 0.7, damage: 50, health: 45, pen: 45 }]),
                TYPE: "bullet",
                LABEL: "Tetiary",
            },
        },
        {
            POSITION: [17.5, 3, 1, 0, -6, -7, 4 / 7],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.pelleter, OGg.artillery, { reload: 0.7, damage: 50, health: 45, pen: 45 }]),
                TYPE: "bullet",
                LABEL: "Secondary",
            },
        },
        {
            POSITION: [17.5, 3, 1, 0, 6, 7, 4 / 7],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.pelleter, OGg.artillery, { reload: 0.7, damage: 50, health: 45, pen: 45 }]),
                TYPE: "bullet",
                LABEL: "Secondary",
            },
        },
        {
            POSITION: [18, 3, 1, 0, -5.5, -5, 5 / 7],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.pelleter, OGg.artillery, { reload: 0.7, damage: 50, health: 45, pen: 45 }]),
                TYPE: "bullet",
                LABEL: "Secondary",
            },
        },
        {
            POSITION: [18, 3, 1, 0, 5.5, 5, 5 / 7],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.pelleter, OGg.artillery, { reload: 0.7, damage: 50, health: 45, pen: 45 }]),
                TYPE: "bullet",
                LABEL: "Secondary",
            },
        },
        {
            POSITION: [18.5, 3, 1, 0, -4.5, -5, 5 / 7],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.pelleter, OGg.artillery, { reload: 0.7, damage: 50, health: 45, pen: 45 }]),
                TYPE: "bullet",
                LABEL: "Secondary",
            },
        },
        {
            POSITION: [18.5, 3, 1, 0, 4.5, 5, 5 / 7],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.pelleter, OGg.artillery, { reload: 0.7, damage: 50, health: 45, pen: 45 }]),
                TYPE: "bullet",
                LABEL: "Secondary",
            },
        },
        {
            POSITION: [19, 12, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.pounder, OGg.artillery, { reload: 0.7, damage: 50, health: 45, pen: 45 }]),
                TYPE: "bullet",
                LABEL: "Heavy",
            },
        },
    ],
};
Class.epilepsySentryGunBDN = makeAuto(Class.epilepsySentryBDN, "Sentry", {
    type: Class.shypermortarAutoTankgunBDN,
    size: 12,
});
Class.epilepsySentryGunBDN.UPGRADE_LABEL = "Epilepsy Gun Sentry";
Class.epilepsySentryGunBDN.TURRETS.push(
    ...weaponArray({
        POSITION: [10, 10, 0, 0, 190, 0],
        TYPE: "ssshyperSprayerGunBDN",
    }, 3),
)
Class.epilepsyEliteSpawnerBDN = {
    PARENT: ["epilepsyEliteBDN"],
    UPGRADE_LABEL: "Epilepsy Elite Spawner",
    UPGRADE_COLOR: 20,
    MAX_CHILDREN: 5,
    AI: { STRAFE: false },
    GUNS: [
        {
            POSITION: [11, 16, 1, 0, 0, 60, 0],
        },

        {
            POSITION: [11, 16, 1, 0, 0, 180, 0],
        },

        {
            POSITION: [11, 16, 1, 0, 0, 300, 0],
        }, {
            /*** LENGTH    WIDTH     ASPECT        X             Y         ANGLE     DELAY */
            POSITION: [2, 18, 1, 11, 0, 60, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.drone, OGg.weak, { size: 0.5 }, { health: 0.7, reload: 0.6 }]),
                TYPE: ["epilepsySentrySwarmBDN", { GIVE_KILL_MESSAGE: false, VARIES_IN_SIZE: false }],
                SYNCS_SKILLS: true,
                AUTOFIRE: true,
                STAT_CALCULATOR: "drone",
            },
        }, {
            POSITION: [2, 18, 1, 11, 0, 180, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.drone, OGg.weak, { size: 0.5 }, { health: 0.7, reload: 0.6 }]),
                TYPE: ["epilepsySentryTrapBDN", { GIVE_KILL_MESSAGE: false, VARIES_IN_SIZE: false }],
                SYNCS_SKILLS: true,
                AUTOFIRE: true,
                STAT_CALCULATOR: "drone",
            },
        }, {
            POSITION: [2, 18, 1, 11, 0, 300, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.drone, OGg.weak, { size: 0.5 }, { health: 0.7, reload: 0.6 }]),
                TYPE: ["epilepsySentryGunBDN", { GIVE_KILL_MESSAGE: false, VARIES_IN_SIZE: false }],
                SYNCS_SKILLS: true,
                AUTOFIRE: true,
                STAT_CALCULATOR: "drone",
            },
        },
        {
            POSITION: [13, 10, 1, 0, 0, 60, 0],
        },
        {
            POSITION: [10, 3, 1, 2, -6, 55, 0],
        },
        {
            POSITION: [10, 3, 1, 2, 6, 65, 0],
        },
        {
            POSITION: [7, 3, 1, 4, -8, 50, 0],
        },
        {
            POSITION: [7, 3, 1, 4, 8, 70, 0],
        },


        {
            POSITION: [4, 5, 1.6, 10.25, 0, 180, 0],
        },
        {
            POSITION: [4, 5, 1.6, 9.5, 0, 180, 0],
        },
        {
            POSITION: [4, 5, 1.6, 8.75, 0, 180, 0],
        },
        {
            POSITION: [4, 5, 1.6, 8, 0, 180, 0],
        },

        {
            POSITION: [5, 6, 1.65, 8, 0, 300, 0],
        },
        {
            POSITION: [6, 6, 0.6, 8, 0, 300, 0],
        },
    ],
    TURRETS: [
        {
            POSITION: [11, 0, 0, 0, 360, 1],
            TYPE: ["megaquintupletGunBDN", { INDEPENDENT: false, COLOR: -1 }],
        },
    ],
};
Class.epilepsyEliteTrapGuardTopBDN = {
    PARENT: ["genericTank"],
    COLOR: -1,
    CONTROLLERS: [["spin", { independent: true }]],
    GUNS: [],
};
for (let i = 0; i < 6; i++) {
    Class.epilepsyEliteTrapGuardTopBDN.GUNS.push(
        {
            POSITION: [19, 8, 1, 0, 0, 60 * i, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.flankGuard, OGg.minigun, OGg.flankGuard, { reload: 2.6, damage: 105, health: 105, pen: 105 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [17, 8, 1, 0, 0, 60 * i, 0.2],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.flankGuard, OGg.minigun, OGg.flankGuard, { reload: 2.6, damage: 105, health: 105, pen: 105 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [15, 8, 1, 0, 0, 60 * i, 0.4],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.flankGuard, OGg.minigun, OGg.flankGuard, { reload: 2.6, damage: 105, health: 105, pen: 105 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [13, 8, 1, 0, 0, 60 * i, 0.6],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.flankGuard, OGg.minigun, OGg.flankGuard, { reload: 2.6, damage: 105, health: 105, pen: 105 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [13, 8, 1, 0, 0, 60 * i, 0.8],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.flankGuard, OGg.minigun, OGg.flankGuard, { reload: 2.6, damage: 105, health: 105, pen: 105 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [20, 8, 1, 0, 0, 60 * i + 30, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.flankGuard, OGg.flankGuard, { reload: 3.2, damage: 100.5, health: 100.5, pen: 100.5 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [18, 8, 1, 0, 0, 60 * i + 30, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.flankGuard, OGg.flankGuard, { reload: 3.2, damage: 100.5, health: 100.5, pen: 100.5 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [4, 8, 1.7, 13, 0, 60 * i + 30, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.trap, { reload: 3.2, damage: 100.5, health: 100.5, pen: 100.5 }]),
                TYPE: "trap",
                STAT_CALCULATOR: "trap",
            },
        },
    )
};
Class.epilepsyEliteTrapGuardBDN = {
    PARENT: ["epilepsyEliteBDN"],
    UPGRADE_LABEL: "Epilepsy Elite Trap Guard",
    UPGRADE_COLOR: 20,
    AI: { STRAFE: false },
    GUNS: [],
    TURRETS: [
        {
            POSITION: [9.5, 0, 0, 0, 360, 1],
            TYPE: "epilepsyEliteTrapGuardTopBDN",
        },
    ],
};
for (let i = 0; i < 3; i++) {
    Class.epilepsyEliteTrapGuardBDN.GUNS.push(
        {
            POSITION: [10.5, 8, 1, 0, 0, 120 * i + 60, 0],
        },
        {
            POSITION: [2, 8, 1.4, 10.5, 0, 120 * i + 60, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.trap, OGg.setTrap, { reload: 2, damage: 8, health: 8, pen: 8 }]),
                TYPE: "unsetPillbox",
                MAX_CHILDREN: 5,
                STAT_CALCULATOR: "trap",
            },
        },
        {
            POSITION: [9, 10, 1, 0, 0, 120 * i + 60, 0],
        },
    )
    Class.epilepsyEliteTrapGuardBDN.TURRETS.push(
        {
            POSITION: [5.5, 8, -9, 120 * i + 60, 160, 0],
            TYPE: ["megaDoomsayerGunBDN", { INDEPENDENT: false, }],
        }, {
        POSITION: [5.5, 8, 9, 120 * i + 60, 160, 0],
        TYPE: ["megaDoomsayerGunBDN", { INDEPENDENT: false, }],
    },
    )
};
Class.epilepsyEliteSuperSpinnerCycloneBDN = {
    PARENT: ["genericTank"],
    COLOR: -1,
    CONTROLLERS: [["spin", { speed: 0.1, independent: true }]],
    GUNS: [],
};

for (let i = 0; i < 16; i++) {
    Class.epilepsyEliteSuperSpinnerCycloneBDN.GUNS.push(
        {
            POSITION: [21, 13, 1, 0, 0, (22.5 * i), 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.flankGuard, OGg.pounder, OGg.destroyer, { reload: 1.5, speed: 3, maxSpeed: 3, damage: 25, health: 25, pen: 25 }]),
                TYPE: "bullet",
            },
        },
    )
};
for (let i = 0; i < 32; i++) {
    Class.epilepsyEliteSuperSpinnerCycloneBDN.GUNS.push(
        {
            POSITION: [18, 8, 1, 0, 0, (11.25 * i), 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.flankGuard, { reload: 1.5, speed: 3, maxSpeed: 3, damage: 25, health: 25, pen: 25 }]),
                TYPE: "bullet",
            },
        },

    )
};
for (let i = 0; i < 16; i++) {
    Class.epilepsyEliteSuperSpinnerCycloneBDN.GUNS.push(
        {
            POSITION: [15, 3, 1, 0, 0, (22.5 * i) + 11.25, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.gunner, { reload: 4, speed: 3.5, maxSpeed: 1.9, damage: 25, health: 25, pen: 25 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [15, 3, 1, 0, 0, (22.5 * i) - 11.25, 1 / 2],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.gunner, { reload: 4, speed: 3.5, maxSpeed: 1.9, damage: 25, health: 25, pen: 25 }]),
                TYPE: "bullet",
            },
        },
    )
};
Class.epilepsyEliteSpinnerBDN = {
    PARENT: ["epilepsyEliteBDN"],
    UPGRADE_LABEL: "Epilepsy Elite Spinner",
    UPGRADE_COLOR: 20,
    SKILL: skillSet({
        rld: 0.7,
        dam: 0.5,
        pen: 0.8,
        str: 0.8,
        spd: 0.2,
        atk: 0.3,
        hlt: 1,
        shi: 0.7,
        rgn: 0.7,
        mob: 1,
    }),
    AI: { STRAFE: false },
    FACING_TYPE: ["spin", { speed: 0.1 }],
    GUNS: [],
    TURRETS: [
        {
            POSITION: [9.5, 0, 0, 0, 360, 1],
            TYPE: ["epilepsyEliteSuperSpinnerCycloneBDN", { COLOR: -1 }],
        },
        ...weaponArray({
            POSITION: [5, 12.5, 0, 0, 190, 0],
            TYPE: "baseTrapTurret",
            SHOOT_SETTINGS: combineStats([{ health: 50, damage: 50, pen: 50 }]),
        }, 3)
    ],
};
for (let i = 0; i < 3; i++) {
    Class.epilepsyEliteSpinnerBDN.GUNS.push(
        {
            POSITION: [8.5, 1.25, 1, -1.5, 11.5, 120 * i + 10, 8 / 10],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.twin, OGg.gunner, { speed: 1.3, maxSpeed: 1.3, reload: 2, damage: 50, health: 50, pen: 50 }]),
                TYPE: "bullet",
            },
        }, {
        POSITION: [8.5, 1.25, 1, 2, 9, 120 * i + 10, 6 / 10],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([OGg.basic, OGg.twin, OGg.gunner, { speed: 1.3, maxSpeed: 1.3, reload: 2, damage: 50, health: 50, pen: 50 }]),
            TYPE: "bullet",
        },
    }, {
        POSITION: [8.5, 1.25, 1, 3.5, 6.5, 120 * i + 10, 4 / 10],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([OGg.basic, OGg.twin, OGg.gunner, { speed: 1.3, maxSpeed: 1.3, reload: 2, damage: 50, health: 50, pen: 50 }]),
            TYPE: "bullet",
        },
    }, {
        POSITION: [8.5, 1.25, 1, 6, 4, 120 * i + 10, 2 / 10],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([OGg.basic, OGg.twin, OGg.gunner, { speed: 1.3, maxSpeed: 1.3, reload: 2, damage: 50, health: 50, pen: 50 }]),
            TYPE: "bullet",
        },
    }, {
        POSITION: [8.5, 1.25, 1, 8.5, 1.5, 120 * i + 10, 0 / 10],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([OGg.basic, OGg.twin, OGg.gunner, { speed: 1.3, maxSpeed: 1.3, reload: 2, damage: 50, health: 50, pen: 50 }]),
            TYPE: "bullet",
        },
    },
        {
            POSITION: [7.5, 2, 1, -1.5, 11.5, 120 * i + 10, 5 / 6],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.twin, OGg.gunner, { speed: 1.3, maxSpeed: 1.3, reload: 2, damage: 50, health: 50, pen: 50 }]),
                TYPE: "bullet",
            },
        }, {
        POSITION: [7.5, 2, 1, 2, 9, 120 * i + 10, 4 / 6],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([OGg.basic, OGg.twin, OGg.gunner, { speed: 1.3, maxSpeed: 1.3, reload: 2, damage: 50, health: 50, pen: 50 }]),
            TYPE: "bullet",
        },
    }, {
        POSITION: [7.5, 2, 1, 3.5, 6.5, 120 * i + 10, 3 / 6],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([OGg.basic, OGg.twin, OGg.gunner, { speed: 1.3, maxSpeed: 1.3, reload: 2, damage: 50, health: 50, pen: 50 }]),
            TYPE: "bullet",
        },
    }, {
        POSITION: [7.5, 2, 1, 6, 4, 120 * i + 10, 2 / 6],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([OGg.basic, OGg.twin, OGg.gunner, { speed: 1.3, maxSpeed: 1.3, reload: 2, damage: 50, health: 50, pen: 50 }]),
            TYPE: "bullet",
        },
    }, {
        POSITION: [7.5, 2, 1, 8.5, 1.5, 120 * i + 10, 1 / 6],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([OGg.basic, OGg.twin, OGg.gunner, { speed: 1.3, maxSpeed: 1.3, reload: 2, damage: 50, health: 50, pen: 50 }]),
            TYPE: "bullet",
        },
    },
        {
            POSITION: [6.5, 2, 1, -1.5, 11.5, 120 * i + 10, 6 / 7],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.twin, OGg.gunner, { speed: 1.3, maxSpeed: 1.3, reload: 2, damage: 50, health: 50, pen: 50 }]),
                TYPE: "bullet",
            },
        }, {
        POSITION: [6.5, 2, 1, 2, 9, 120 * i + 10, 5 / 7],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([OGg.basic, OGg.twin, OGg.gunner, { speed: 1.3, maxSpeed: 1.3, reload: 2, damage: 50, health: 50, pen: 50 }]),
            TYPE: "bullet",
        },
    }, {
        POSITION: [6.5, 2, 1, 3.5, 6.5, 120 * i + 10, 4 / 7],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([OGg.basic, OGg.twin, OGg.gunner, { speed: 1.3, maxSpeed: 1.3, reload: 2, damage: 50, health: 50, pen: 50 }]),
            TYPE: "bullet",
        },
    }, {
        POSITION: [6.5, 2, 1, 6, 4, 120 * i + 10, 3 / 7],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([OGg.basic, OGg.twin, OGg.gunner, { speed: 1.3, maxSpeed: 1.3, reload: 2, damage: 50, health: 50, pen: 50 }]),
            TYPE: "bullet",
        },
    }, {
        POSITION: [6.5, 2, 1, 8.5, 1.5, 120 * i + 10, 2 / 7],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([OGg.basic, OGg.twin, OGg.gunner, { speed: 1.3, maxSpeed: 1.3, reload: 2, damage: 50, health: 50, pen: 50 }]),
            TYPE: "bullet",
        },
    },
        {
            POSITION: [5.5, 2, 1, -1.5, 11.5, 120 * i + 10, 7 / 8],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.twin, OGg.gunner, { speed: 1.3, maxSpeed: 1.3, reload: 2, damage: 50, health: 50, pen: 50 }]),
                TYPE: "bullet",
            },
        }, {
        POSITION: [5.5, 2, 1, 2, 9, 120 * i + 10, 6 / 8],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([OGg.basic, OGg.twin, OGg.gunner, { speed: 1.3, maxSpeed: 1.3, reload: 2, damage: 50, health: 50, pen: 50 }]),
            TYPE: "bullet",
        },
    }, {
        POSITION: [5.5, 2, 1, 3.5, 6.5, 120 * i + 10, 5 / 8],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([OGg.basic, OGg.twin, OGg.gunner, { speed: 1.3, maxSpeed: 1.3, reload: 2, damage: 50, health: 50, pen: 50 }]),
            TYPE: "bullet",
        },
    }, {
        POSITION: [5.5, 2, 1, 6, 4, 120 * i + 10, 4 / 8],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([OGg.basic, OGg.twin, OGg.gunner, { speed: 1.3, maxSpeed: 1.3, reload: 2, damage: 50, health: 50, pen: 50 }]),
            TYPE: "bullet",
        },
    }, {
        POSITION: [5.5, 2, 1, 8.5, 1.5, 120 * i + 10, 3 / 8],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([OGg.basic, OGg.twin, OGg.gunner, { speed: 1.3, maxSpeed: 1.3, reload: 2, damage: 50, health: 50, pen: 50 }]),
            TYPE: "bullet",
        },
    },
        {
            POSITION: [4.5, 2, 1, -1.5, 11.5, 120 * i + 10, 8 / 9],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.twin, OGg.gunner, { speed: 1.3, maxSpeed: 1.3, reload: 2, damage: 50, health: 50, pen: 50 }]),
                TYPE: "bullet",
            },
        }, {
        POSITION: [4.5, 2, 1, 2, 9, 120 * i + 10, 7 / 9],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([OGg.basic, OGg.twin, OGg.gunner, { speed: 1.3, maxSpeed: 1.3, reload: 2, damage: 50, health: 50, pen: 50 }]),
            TYPE: "bullet",
        },
    }, {
        POSITION: [4.5, 2, 1, 3.5, 6.5, 120 * i + 10, 6 / 9],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([OGg.basic, OGg.twin, OGg.gunner, { speed: 1.3, maxSpeed: 1.3, reload: 2, damage: 50, health: 50, pen: 50 }]),
            TYPE: "bullet",
        },
    }, {
        POSITION: [4.5, 2, 1, 6, 4, 120 * i + 10, 5 / 9],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([OGg.basic, OGg.twin, OGg.gunner, { speed: 1.3, maxSpeed: 1.3, reload: 2, damage: 50, health: 50, pen: 50 }]),
            TYPE: "bullet",
        },
    }, {
        POSITION: [4.5, 2, 1, 8.5, 1.5, 120 * i + 10, 4 / 9],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([OGg.basic, OGg.twin, OGg.gunner, { speed: 1.3, maxSpeed: 1.3, reload: 2, damage: 50, health: 50, pen: 50 }]),
            TYPE: "bullet",
        },
    }, {
        POSITION: [2, 20, 0.75, 8, 0, 120 * i + 60, 0],
    },
    )
};

















// Legions
Class.epilepsydestroyerLegion = {
    PARENT: ["epilepsyEliteBDN"],
    UPGRADE_LABEL: "Epilepsy Destroyer Legion",
    NAME: "Epilepsy Destroyer Legion",
    DISPLAY_NAME: false,
    UPGRADE_COLOR: 20,
    AI: { NO_LEAD: false },
    SIZE: 30,
    GUNS: [],
    BODY: {
        HEALTH: 8000 * base.HEALTH,
    },
    TURRETS: [
        {
            POSITION: [11, 0, 0, 180, 360, 0],
            TYPE: ["crasherSpawnerlimited", { GUN_STAT_SCALE: { health: 1.1 } }],
        }, {
            POSITION: [11, 0, 0, 60, 360, 0],
            TYPE: ["crasherSpawnerlimited", { GUN_STAT_SCALE: { health: 1.1 } }],
        }, {
            POSITION: [11, 0, 0, -60, 360, 0],
            TYPE: ["crasherSpawnerlimited", { GUN_STAT_SCALE: { health: 1.1 } }],
        }, {
            POSITION: [11, 0, 0, 240, 360, 0],
            TYPE: ["crasherSpawnerlimited", { GUN_STAT_SCALE: { health: 1.1 } }],
        }, {
            POSITION: [11, 0, 0, 120, 360, 0],
            TYPE: ["crasherSpawnerlimited", { GUN_STAT_SCALE: { health: 1.1 } }],
        }, {
            POSITION: [11, 0, 0, 0, 360, 0],
            TYPE: ["crasherSpawnerlimited", { GUN_STAT_SCALE: { health: 1.1 } }],
        }, {
            POSITION: [11, 0, 0, 0, 360, 1],
            TYPE: ["megaquintupletGunBDN", { GUN_STAT_SCALE: { health: 1.1 }, INDEPENDENT: true, COLOR: -1 }],
        },
    ],
};
for (let i = 0; i < 3; i++) {
    Class.epilepsydestroyerLegion.GUNS.push(
        {
            POSITION: [7, 16, 1, 6, 5, i * 120 + 74, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.pounder, OGg.pounder, OGg.destroyer, { reload: 0.9, damage: 50, health: 55, pen: 50 }]),
                TYPE: "bullet",
                LABEL: "Devastator Secondary",
            },
        },
        {
            POSITION: [7, 16, 1, 6, -5, i * 120 + 44, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.pounder, OGg.pounder, OGg.destroyer, { reload: 0.9, damage: 50, health: 55, pen: 50 }]),
                TYPE: "bullet",
                LABEL: "Devastator Secondary",
            },
        },
        {
            POSITION: [7, 16, 1, 6, 3, i * 120 + 67, 0.25],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.pounder, OGg.pounder, OGg.destroyer, { reload: 0.85, damage: 50, health: 55, pen: 50 }]),
                TYPE: "bullet",
                LABEL: "Devastator Secondary",
            },
        },
        {
            POSITION: [7, 16, 1, 6, -3, i * 120 + 53, 0.25],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.pounder, OGg.pounder, OGg.destroyer, { reload: 0.85, damage: 50, health: 55, pen: 50 }]),
                TYPE: "bullet",
                TYPE: "bullet",
                LABEL: "Devastator Secondary",
            },
        },
    )
    Class.epilepsydestroyerLegion.GUNS.push(
        {
            POSITION: [7, 16, 1, 6, 0, i * 120 + 60, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.pounder, OGg.pounder, OGg.destroyer, { reload: 0.85, damage: 50, health: 55, pen: 50 }]),
                TYPE: "bullet",
                TYPE: "bullet",
                LABEL: "Devastator Primary",
            },
        },
    )
}
Class.epilepsygunnerLegion = {
    PARENT: ["epilepsyEliteBDN"],
    UPGRADE_LABEL: "Epilepsy Gunner Legion",
    NAME: "Epilepsy Gunner Legion",
    DISPLAY_NAME: false,
    UPGRADE_COLOR: 20,
    FACING_TYPE: "toTarget",
    AI: { NO_LEAD: false },
    SIZE: 30,
    BODY: {
        HEALTH: 8000 * base.HEALTH,
    },
    GUNS: [
        {
            POSITION: [14, 16, 1, 0, 0, 180, 0],
        },
        {
            POSITION: [14, 13, 1, 0, 0, 180, 0],
        }, {
            POSITION: [4, 16, 1.5, 14, 0, 180, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.trap, OGg.hexaTrapper, OGg.setTrap, { reload: 0.8, damage: 6, health: 7, pen: 6 }]),
                TYPE: ["sssunsethyperDriverPillboxBDN", { MOTION_TYPE: "glide" }],
                STAT_CALCULATOR: "trap",
            },
        },
        {
            POSITION: [4, 13, 1.5, 14, 0, 180, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.trap, OGg.hexaTrapper, OGg.setTrap, { reload: 0.8, range: 0, damage: 0, health: 1.1 }]),
                TYPE: "bullet",
            },
        }, {
            POSITION: [6, 14, -2, 2, 0, 60, 0],
        }, {
            POSITION: [6, 14, -2, 2, 0, 300, 0],
        }, {
            POSITION: [6, 14, -2, 2, 0, 55, 0],
        }, {
            POSITION: [6, 14, -2, 2, 0, 305, 0],
        },
    ],
    AI: { NO_LEAD: false },
    TURRETS: [
        {
            POSITION: [14, 8, 0, 60, 180, 0],
            TYPE: ["hyperbrimmerGunBDN", { GUN_STAT_SCALE: { health: 1.15 } }],
        }, {
            POSITION: [14, 8, 0, 300, 180, 0],
            TYPE: ["hyperbrimmerGunBDN", { GUN_STAT_SCALE: { health: 1.15 } }],
        },
    ],
}
Class.epilepsysprayerLegion = {
    PARENT: ["epilepsyEliteBDN"],
    UPGRADE_LABEL: "Epilepsy Sprayer Legion",
    NAME: "Epilepsy Sprayer Legion",
    DISPLAY_NAME: false,
    UPGRADE_COLOR: 20,
    AI: { NO_LEAD: false },
    SIZE: 30,
    SKILL: [0, 9, 3, 9, 2, 9, 9, 9, 9, 0],
    HAS_NO_RECOIL: true,
    BODY: {
        HEALTH: 8000 * base.HEALTH,
    },
    TURRETS: weaponArray({
        POSITION: [14, 6, 0, 60, 190, 0],
        TYPE: ["sshyperSprayerGunBDN", { GUN_STAT_SCALE: { health: 28, damage: 29.2, speed: 29.2, resist: 1.15 }, COLOR: -1 }],
    }, 3)
}
Class.epilepsybattleshipLegion = {
    PARENT: ["epilepsyEliteBDN"],
    UPGRADE_LABEL: "Epilepsy Battleship Legion",
    NAME: "Epilepsy Battleship Legion",
    DISPLAY_NAME: false,
    UPGRADE_COLOR: 20,
    AI: { NO_LEAD: false },
    SIZE: 30,
    BODY: {
        HEALTH: 8000 * base.HEALTH,
    },
    GUNS: [],
    TURRETS: [
        {
            POSITION: [5, 7.5, 0, 0, 360, 1],
            TYPE: ["ssshypercarrierBDN", { GUN_STAT_SCALE: { health: 1.1 }, INDEPENDENT: true, COLOR: -1, PARENT: "ssshypercarrierBDN" }],
        }, {
            POSITION: [5, 7.5, 0, 120, 360, 1],
            TYPE: ["ssshypercarrierBDN", { GUN_STAT_SCALE: { health: 1.1 }, INDEPENDENT: true, COLOR: -1, PARENT: "ssshypercarrierBDN" }],
        }, {
            POSITION: [5, 7.5, 0, 240, 360, 1],
            TYPE: ["ssshypercarrierBDN", { GUN_STAT_SCALE: { health: 1.1 }, INDEPENDENT: true, COLOR: -1, PARENT: "ssshypercarrierBDN" }],
        },
        ...weaponArray({
            POSITION: [5, 25, 0, 0, 190, 1],
            TYPE: ["ssshypercarrierBDN", { GUN_STAT_SCALE: { size: 3, reload: 3, health: 1000, damage: 1000, pen: 1000 }, COLOR: -1 }],
        }, 3)
    ],
};
for (i = 0; i < 3; i++) {
    Class.epilepsybattleshipLegion.GUNS.push(

        {
            POSITION: [3, 2, 0.6, 7, -13, i * 120 - 60, 2 / 3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.battleship, { size: 3, reload: 3, damage: 1000, health: 1000, pen: 1000 }]),
                TYPE: "autoswarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [3, 2, 0.6, 7, 13, i * 120 - 60, 2 / 3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.battleship, { size: 3, reload: 3, damage: 1000, health: 1000, pen: 1000 }]),
                TYPE: "autoswarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [3, 2, 0.6, 7, -5, i * 120 - 60, 2 / 3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.battleship, { size: 3, reload: 3, damage: 1000, health: 1000, pen: 1000 }]),
                TYPE: "autoswarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [3, 2, 0.6, 7, 5, i * 120 - 60, 2 / 3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.battleship, { size: 3, reload: 3, damage: 1000, health: 1000, pen: 1000 }]),
                TYPE: "autoswarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [3, 2, 0.6, 7, 3.75, i * 120 - 60, 2 / 3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.battleship, { size: 3, reload: 3, damage: 1000, health: 1000, pen: 1000 }]),
                TYPE: "autoswarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [3, 2, 0.6, 7, -3.75, i * 120 - 60, 2 / 3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.battleship, { size: 3, reload: 3, damage: 1000, health: 1000, pen: 1000 }]),
                TYPE: "autoswarm",
                STAT_CALCULATOR: "swarm",
            },
        },






        {
            POSITION: [4, 4, 0.6, 7, -11, i * 120 - 60, 1 / 3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.battleship, { size: 3, reload: 3, damage: 1500, health: 1500, pen: 1500 }]),
                TYPE: "autoswarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [4, 4, 0.6, 7, 11, i * 120 - 60, 1 / 3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.battleship, { size: 3, reload: 3, damage: 1500, health: 1500, pen: 1500 }]),
                TYPE: "autoswarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [4, 4, 0.6, 7, -7, i * 120 - 60, 1 / 3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.battleship, { size: 3, reload: 3, damage: 1500, health: 1500, pen: 1500 }]),
                TYPE: "autoswarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [4, 4, 0.6, 7, 7, i * 120 - 60, 1 / 3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.battleship, { size: 3, reload: 3, damage: 1500, health: 1500, pen: 1500 }]),
                TYPE: "autoswarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [4, 4, 0.6, 7, 1.5, i * 120 - 60, 1 / 3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.battleship, { size: 3, reload: 3, damage: 1500, health: 1500, pen: 1500 }]),
                TYPE: "autoswarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [4, 4, 0.6, 7, -1.5, i * 120 - 60, 1 / 3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.battleship, { size: 3, reload: 3, damage: 1500, health: 1500, pen: 1500 }]),
                TYPE: "autoswarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [5, 5, 0.6, 7, 0, i * 120 - 60, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.battleship, { size: 3, reload: 3, damage: 2000, health: 2000, pen: 2000 }]),
                TYPE: "autoswarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [5, 5, 0.6, 7, -9, i * 120 - 60, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.battleship, { size: 3, reload: 3, damage: 2000, health: 2000, pen: 2000 }]),
                TYPE: "autoswarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [5, 5, 0.6, 7, 9, i * 120 - 60, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.battleship, { size: 3, reload: 3, damage: 2000, health: 2000, pen: 2000 }]),
                STAT_CALCULATOR: "swarm",
            },
        },
    )
}
Class.epilepsyspawnerLegion = {
    PARENT: ["epilepsyEliteBDN"],
    UPGRADE_LABEL: "Epilepsy Spawner Legion",
    NAME: "Epilepsy Spawner Legion",
    DISPLAY_NAME: false,
    UPGRADE_COLOR: 20,
    AI: { NO_LEAD: false },
    SIZE: 30,
    BODY: {
        HEALTH: 8000 * base.HEALTH,
    },
    GUNS: [
        {
            POSITION: [11, 16, 1, 0, 0, 60, 0],
        },

        {
            POSITION: [11, 16, 1, 0, 0, 180, 0],
        },

        {
            POSITION: [11, 16, 1, 0, 0, 300, 0],
        }, {
            /*** LENGTH    WIDTH     ASPECT        X             Y         ANGLE     DELAY */
            POSITION: [2, 18, 1, 11, 0, 60, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.drone, OGg.weak, OGg.weak, OGg.weak, { size: 0.4 }, { health: 0.3, reload: 0.75 }]),
                TYPE: ["epilepsySentrySwarmBDN", { GIVE_KILL_MESSAGE: false, VARIES_IN_SIZE: false }],
                SYNCS_SKILLS: true,
                AUTOFIRE: true,
                STAT_CALCULATOR: "drone",
            },
        }, {
            POSITION: [2, 18, 1, 11, 0, 180, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.drone, OGg.weak, OGg.weak, OGg.weak, { size: 0.4 }, { health: 0.3, reload: 0.75 }]),
                TYPE: ["epilepsySentryTrapBDN", { GIVE_KILL_MESSAGE: false, VARIES_IN_SIZE: false }],
                SYNCS_SKILLS: true,
                AUTOFIRE: true,
                STAT_CALCULATOR: "drone",
            },
        }, {
            POSITION: [2, 18, 1, 11, 0, 300, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.drone, OGg.weak, OGg.weak, OGg.weak, { size: 0.4 }, { health: 0.3, reload: 0.75 }]),
                TYPE: ["epilepsySentryGunBDN", { GIVE_KILL_MESSAGE: false, VARIES_IN_SIZE: false }],
                SYNCS_SKILLS: true,
                AUTOFIRE: true,
                STAT_CALCULATOR: "drone",
            },
        },
        {
            POSITION: [13, 10, 1, 0, 0, 60, 0],
        },
        {
            POSITION: [10, 3, 1, 2, -6, 55, 0],
        },
        {
            POSITION: [10, 3, 1, 2, 6, 65, 0],
        },
        {
            POSITION: [7, 3, 1, 4, -8, 50, 0],
        },
        {
            POSITION: [7, 3, 1, 4, 8, 70, 0],
        },


        {
            POSITION: [4, 5, 1.6, 10.25, 0, 180, 0],
        },
        {
            POSITION: [4, 5, 1.6, 9.5, 0, 180, 0],
        },
        {
            POSITION: [4, 5, 1.6, 8.75, 0, 180, 0],
        },
        {
            POSITION: [4, 5, 1.6, 8, 0, 180, 0],
        },

        {
            POSITION: [5, 6, 1.65, 8, 0, 300, 0],
        },
        {
            POSITION: [6, 6, 0.6, 8, 0, 300, 0],
        },
    ],
    TURRETS: [
        {
            POSITION: [11, 0, 0, 0, 360, 1],
            TYPE: ["megaquintupletGunBDN", { GUN_STAT_SCALE: { health: 1.15 }, INDEPENDENT: false, COLOR: -1 }],
        },
    ],
}
// Legionary Crasher
Class.epilepsylegionaryCrasherTop = {
    PARENT: ["epilepsyEliteBDN"],
    AI: { STRAFE: false, NO_LEAD: false },
    INDEPENDENT: true,
    DISPLAY_NAME: false,
    GUNS: [
        {
            /*** LENGTH    WIDTH     ASPECT        X             Y         ANGLE     DELAY */
            POSITION: [2, 18, 1, 11, 0, 60, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.drone, OGg.weak, { size: 0.4 }, { health: 0.6, reload: 0.6 }]),
                TYPE: ["epilepsySentrySwarmBDN", { GIVE_KILL_MESSAGE: false, VARIES_IN_SIZE: false }],
                SYNCS_SKILLS: true,
                AUTOFIRE: true,
                STAT_CALCULATOR: "drone",
                MAX_CHILDREN: 1,
            },
        }, {
            POSITION: [2, 18, 1, 11, 0, 180, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.drone, OGg.weak, { size: 0.4 }, { health: 0.6, reload: 0.6 }]),
                TYPE: ["epilepsySentryTrapBDN", { GIVE_KILL_MESSAGE: false, VARIES_IN_SIZE: false }],
                SYNCS_SKILLS: true,
                AUTOFIRE: true,
                STAT_CALCULATOR: "drone",
                MAX_CHILDREN: 1,
            },
        }, {
            POSITION: [2, 18, 1, 11, 0, 300, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.drone, OGg.weak, { size: 0.4 }, { health: 0.6, reload: 0.6 }]),
                TYPE: ["epilepsySentryGunBDN", { GIVE_KILL_MESSAGE: false, VARIES_IN_SIZE: false }],
                SYNCS_SKILLS: true,
                AUTOFIRE: true,
                STAT_CALCULATOR: "drone",
                MAX_CHILDREN: 1,
            },
        },



        ...weaponArray([
            {
                POSITION: [7, 16, 1, 6, 5, i * 120 + 74, 0.5],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([OGg.basic, OGg.pounder, OGg.pounder, OGg.destroyer, { reload: 0.9, damage: 50, health: 50, pen: 50 }]),
                    TYPE: "bullet",
                    LABEL: "Devastator Secondary",
                },
            },
            {
                POSITION: [7, 16, 1, 6, -5, i * 120 + 44, 0.5],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([OGg.basic, OGg.pounder, OGg.pounder, OGg.destroyer, { reload: 0.9, damage: 50, health: 50, pen: 50 }]),
                    TYPE: "bullet",
                    LABEL: "Devastator Secondary",
                },
            },
            {
                POSITION: [7, 16, 1, 6, 3, i * 120 + 67, 0.25],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([OGg.basic, OGg.pounder, OGg.pounder, OGg.destroyer, { reload: 0.9, damage: 50, health: 50, pen: 50 }]),
                    TYPE: "bullet",
                    LABEL: "Devastator Secondary",
                },
            },
            {
                POSITION: [7, 16, 1, 6, -3, i * 120 + 53, 0.25],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([OGg.basic, OGg.pounder, OGg.pounder, OGg.destroyer, { reload: 0.9, damage: 50, health: 50, pen: 50 }]),
                    TYPE: "bullet",
                    LABEL: "Devastator Secondary",
                },
            },
            {
                POSITION: [7, 16, 1, 6, 0, i * 120 + 60, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([OGg.basic, OGg.pounder, OGg.pounder, OGg.destroyer, { reload: 0.9, damage: 50, health: 50, pen: 50 }]),
                    TYPE: "bullet",
                    LABEL: "Devastator Primary",
                },
            },
                        {
                POSITION: [4.5, 5, 0.7, 7, 0, 60, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.pounder, OGg.pounder, OGg.destroyer, { damage: 40, health: 40, pen: 40, reload: 2 }, { speed: 2.5, maxSpeed: 2.2, size: 1.1, range: 14 }]),
                    TYPE: ["swarm", { INDEPENDENT: true }],
                    STAT_CALCULATOR: "swarm",
                    AUTOFIRE: true,

                },
            },
            {
                POSITION: [4, 5, 0.7, 7, 5, 60, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.pounder, OGg.pounder, OGg.destroyer, { damage: 40, health: 40, pen: 40, reload: 2 }, { speed: 2.5, maxSpeed: 2.2, size: 1.1, range: 14 }]),
                    TYPE: ["swarm", { INDEPENDENT: true }],
                    STAT_CALCULATOR: "swarm",
                    AUTOFIRE: true,

                },
            }, {
                POSITION: [4, 5, 0.7, 7, -5, 60, 1 / 4],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.pounder, OGg.pounder, OGg.destroyer, { damage: 40, health: 40, pen: 40, reload: 2 }, { speed: 2.5, maxSpeed: 2.2, size: 1.1, range: 14 }]),
                    TYPE: ["swarm", { INDEPENDENT: true }],
                    STAT_CALCULATOR: "swarm",
                    AUTOFIRE: true,
                },
            }, {
                POSITION: [3.5, 5, 0.7, 7, -2.5, 60, 2 / 4],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.pounder, OGg.pounder, OGg.destroyer, { damage: 40, health: 40, pen: 40, reload: 2 }, { speed: 2.5, maxSpeed: 2.2, size: 1.1, range: 14 }]),
                    TYPE: ["swarm", { INDEPENDENT: true }],
                    STAT_CALCULATOR: "swarm",
                    AUTOFIRE: true,
                },
            }, {
                POSITION: [3.5, 5, 0.7, 7, 2.5, 60, 3 / 4],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.pounder, OGg.pounder, OGg.destroyer, { damage: 40, health: 40, pen: 40, reload: 2 }, { speed: 2.5, maxSpeed: 2.2, size: 1.1, range: 14 }]),
                    TYPE: ["swarm", { INDEPENDENT: true }],
                    STAT_CALCULATOR: "swarm",
                    AUTOFIRE: true,
                },
            }, {
                POSITION: [3.5, 5, 0.7, 7, -7.5, 60, 2 / 4],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.pounder, OGg.pounder, OGg.destroyer, { damage: 40, health: 40, pen: 40, reload: 2 }, { speed: 2.5, maxSpeed: 2.2, size: 1.1, range: 14 }]),
                    TYPE: ["swarm", { INDEPENDENT: true }],
                    STAT_CALCULATOR: "swarm",
                    AUTOFIRE: true,
                },
            }, {
                POSITION: [3.5, 5, 0.7, 7, 7.5, 60, 3 / 4],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.pounder, OGg.pounder, OGg.destroyer, { damage: 40, health: 40, pen: 40, reload: 2 }, { speed: 2.5, maxSpeed: 2.2, size: 1.1, range: 14 }]),
                    TYPE: ["swarm", { INDEPENDENT: true }],
                    STAT_CALCULATOR: "swarm",
                    AUTOFIRE: true,
                },
            },
        ], 3),
    ],
    TURRETS: [
        {
            POSITION: [5, 0, 0, 0, 360, 1],
            TYPE: ["megaquintupletGunBDN", { INDEPENDENT: true, COLOR: -1 }],
        },
        {
            POSITION: [5, 4, 7, 180, 360, 1],
            TYPE: ["megaquintupletGunBDN", { INDEPENDENT: true, COLOR: -1 }],
        },
        {
            POSITION: [5, 4, -7, 60, 360, 1],
            TYPE: ["megaquintupletGunBDN", { INDEPENDENT: true, COLOR: -1 }],
        },
        {
            POSITION: [5, -4, -7, -120, 360, 1],
            TYPE: ["megaquintupletGunBDN", { INDEPENDENT: true, COLOR: -1 }],
        },
        ...weaponArray([
            {
                POSITION: [9.5, 12, 0, 0, 190, 0],
                TYPE: ["megaquintupletGunBDN", { GUN_STAT_SCALE: { damage: 9.6, health: 9, speed: 9, maxSpeed: 2, resist: 1.1, range: 2.3 } }],
            }], 3),
    ]
}
Class.epilepsylegionaryCrasherSpawner = {
    PARENT: 'genericTank',
    SHAPE: "",
    INDEPENDENT: true,
    GUNS: [{
        POSITION: [0, 10, 0, 0, 0, 0, 10],
        PROPERTIES: {
            TYPE: 'epilepsydestroyerLegion',
            SHOOT_SETTINGS: combineStats([{ reload: 0.1 }]),
            NO_LIMITATIONS: true,
            INDEPENDENT_CHILDREN: true,
            MAX_CHILDREN: 1,
            IDENTIFIER: 1,
            AUTOFIRE: true,
        }
    }],
    ON: [{
        event: "fire",
        handler: ({ gun }) => {
            gun.setBulletType(["epilepsydestroyerLegion", "epilepsygunnerLegion", "epilepsysprayerLegion", "epilepsybattleshipLegion", "epilepsyspawnerLegion"][gun.identifier++ % 5]);
        }
    }],
}
Class.epilepsylegionaryCrasher = {
    PARENT: ["epilepsyEliteBDN"],
    LABEL: "Epilepsy Legionary Crasher",
    NAME: "Epilepsy Legionary Crasher",
    DISPLAY_NAME: false,
    UPGRADE_COLOR: 20,
    AI: { STRAFE: false, NO_LEAD: false },
    HAS_NO_RECOIL: true,
    VALUE: 5e13,
    SIZE: 190,
    BODY: {
        FOV: 1.5,
        SPEED: 0.1 * base.SPEED,
        HEALTH: 2000000,
        DAMAGE: 400 * base.DAMAGE,
    },
    GUNS: [
        ...weaponArray([
            {
                POSITION: [14.5, 13, 1, 0, 0, 0, 0],
            }, {
                POSITION: [3, 13, 1.7, 14.5, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([OGg.trap, OGg.setTrap, OGg.pounder, { reload: 1.8, speed: 3.2, size: 0.9, maxSpeed: 2.5, range: 1.1 }, { damage: 162, health: 162, pen: 162 }]),
                    TYPE: "epilepsylegionaryPillbox",
                    NO_LIMITATIONS: true,
                    STAT_CALCULATOR: "trap",
                },
            },
        ], 3),
        ...weaponArray({
            POSITION: [5, 12, 1.6, -11, 0, 0, 0],
        }, 3),
    ],
    TURRETS: [
        {
            POSITION: [12, 0, 0, 0, 360, 1],
            TYPE: "epilepsylegionaryCrasherTop",
        },
        ...weaponArray({
            POSITION: [14, 8, 0, 60, 180, 0],
            TYPE: ["sshyperSprayerGunBDNwithceptions", { GUN_STAT_SCALE: { speed: 2, health: 1404, damage: 1350, resist: 1.5 }, COLOR: -1 }],
        }, 3),

        {
            POSITION: [12, 0, 0, 0, 0, 0],
            TYPE: 'epilepsylegionaryCrasherSpawner'
        }
    ],
}
Class.epilepsylegionaryCrasherSpawnerFix = {
    PARENT: 'genericTank',
    SHAPE: "",
    INDEPENDENT: true,
    GUNS: [{
        POSITION: [0, 10, 0, 0, 0, 0, 10],
        PROPERTIES: {
            TYPE: 'epilepsydestroyerLegion',
            SHOOT_SETTINGS: combineStats([{ reload: 0.1, size: 0.75 }]),
            NO_LIMITATIONS: true,
            INDEPENDENT_CHILDREN: false,
            MAX_CHILDREN: 5,
            IDENTIFIER: 1,
            AUTOFIRE: true,
        }
    }],
    ON: [{
        event: "fire",
        handler: ({ gun }) => {
            gun.setBulletType(["epilepsydestroyerLegion", "epilepsygunnerLegion", "epilepsysprayerLegion", "epilepsybattleshipLegion", "epilepsyspawnerLegion"][gun.identifier++ % 5]);
        }
    }],
}
Class.epilepsylegionaryCrasherFix = {
    PARENT: ["epilepsyEliteBDN"],
    LABEL: "Epilepsy Legionary Crasher",
    NAME: "Epilepsy Legionary Crasher",
    DISPLAY_NAME: false,
    UPGRADE_COLOR: 20,
    AI: { STRAFE: false, NO_LEAD: false },
    HAS_NO_RECOIL: true,
    VALUE: 5e13,
    SIZE: 190,
    BODY: {
        FOV: 1.5,
        SPEED: 0.1 * base.SPEED,
        HEALTH: 2000000,
        DAMAGE: 400 * base.DAMAGE,
    },
    GUNS: [
        ...weaponArray([
            {
                POSITION: [14.5, 13, 1, 0, 0, 0, 0],
            }, {
                POSITION: [3, 13, 1.7, 14.5, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([OGg.trap, OGg.setTrap, OGg.pounder, { reload: 1.8, speed: 3.2, size: 0.9, maxSpeed: 2.5, range: 1.1 }, { damage: 162, health: 162, pen: 162 }]),
                    TYPE: "epilepsylegionaryPillbox",
                    NO_LIMITATIONS: true,
                    STAT_CALCULATOR: "trap",
                },
            },
        ], 3),
        ...weaponArray({
            POSITION: [5, 12, 1.6, -11, 0, 0, 0],
        }, 3),
    ],
    TURRETS: [
        {
            POSITION: [12, 0, 0, 0, 360, 1],
            TYPE: "epilepsylegionaryCrasherTop",
        },
        ...weaponArray({
            POSITION: [14, 8, 0, 60, 180, 0],
            TYPE: ["sshyperSprayerGunBDNwithceptions", { GUN_STAT_SCALE: { speed: 2, health: 1404, damage: 1350, resist: 1.5 }, COLOR: -1 }],
        }, 3),
        {
            POSITION: [12, 0, 0, 0, 0, 0],
            TYPE: 'epilepsylegionaryCrasherSpawnerFix'
        }
    ],
}
Class.epilepsyElitesBDN = makeMenu("Epilepsy Elites")
Class.epilepsyElitesBDN.COLOR = 20
Class.epilepsyElitesBDN.UPGRADE_COLOR = 20
Class.epilepsyElitesBDN.UPGRADES_TIER_0 = ["epilepsyEliteDestroyerBDN", "epilepsyEliteGunnerBDN", "epilepsyEliteSprayerBDN", "epilepsyEliteBattleshipBDN", "epilepsyEliteSpawnerBDN", "epilepsyEliteTrapGuardBDN", "epilepsyEliteSpinnerBDN", "epilepsysprayerLegion", "epilepsylegionaryCrasher", "epilepsylegionaryCrasherFix"]
Class.epilepsyElitesBDN.SHAPE = 3.5
Class.transElitesBDN.UPGRADES_TIER_0.push("epilepsyElitesBDN")






















// Albino Elites :money_mouth:

Class.megahextupletGunBDN = {
    PARENT: "autoTankGun",
    GUNS: [
        {
            POSITION: [13, 7, 1, 0, -6.5, 0, 0.8],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.autoTurret, OGg.twin, OGg.twin, OGg.power, { reload: 1.5, speed: 3, maxspeed: 3 }, { size: 2, reload: 2, damage: 60, health: 60, pen: 60 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [13, 7, 1, 0, 6.5, 0, 0.6],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.autoTurret, OGg.twin, OGg.twin, OGg.power, { reload: 1.5, speed: 3, maxspeed: 3 }, { size: 2, reload: 2, damage: 60, health: 60, pen: 60 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [14, 7, 1, 0, -4.5, 0, 0.8],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.autoTurret, OGg.twin, OGg.twin, OGg.power, { reload: 1.5, speed: 3, maxspeed: 3 }, { size: 2, reload: 2, damage: 60, health: 60, pen: 60 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [14, 7, 1, 0, 4.5, 0, 0.6],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.autoTurret, OGg.twin, OGg.twin, OGg.power, { reload: 1.5, speed: 3, maxspeed: 3 }, { size: 2, reload: 2, damage: 60, health: 60, pen: 60 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [15, 7, 1, 0, -2.25, 0, 0.4],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.autoTurret, OGg.twin, OGg.twin, OGg.power, { reload: 1.5, speed: 3, maxspeed: 3 }, { size: 2, reload: 2, damage: 60, health: 60, pen: 60 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [15, 7, 1, 0, 2.25, 0, 0.2],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.autoTurret, OGg.twin, OGg.twin, OGg.power, { reload: 1.5, speed: 3, maxspeed: 3 }, { size: 2, reload: 2, damage: 60, health: 60, pen: 60 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [16, 7, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.autoTurret, OGg.twin, OGg.twin, OGg.power, { reload: 1.5, speed: 3, maxspeed: 3 }, { size: 2, reload: 2, damage: 60, health: 60, pen: 60 }]),
                TYPE: "bullet",
            },
        },

    ],
}

Class.albinoEliteBDN = {
    PARENT: ["miniboss"],
    LABEL: "Albino Elite Crasher",
    COLOR: "white",
    SHAPE: 3,
    SIZE: 55,
    DANGER: 640,
    VARIES_IN_SIZE: true,
    VALUE: 92e7,
    BODY: {
        FOV: 1.25,
        SPEED: 0.125 * base.SPEED,
        HEALTH: 3000 * base.HEALTH,
        DAMAGE: 40 * base.DAMAGE,
        REGEN: 20 * base.REGEN,
    },
};
Class.albinoEliteDestroyerBDN = {
    PARENT: ["albinoEliteBDN"],
    UPGRADE_LABEL: "Albino Elite Destroyer",
    UPGRADE_COLOR: "white",
    GUNS: [],
    TURRETS: [
        {
            POSITION: [11, 0, 0, 180, 360, 0],
            TYPE: ["crasherSpawnerlimited"],
        }, {
            POSITION: [11, 0, 0, 60, 360, 0],
            TYPE: ["crasherSpawnerlimited"],
        }, {
            POSITION: [11, 0, 0, -60, 360, 0],
            TYPE: ["crasherSpawnerlimited"],
        }, {
            POSITION: [11, 0, 0, 240, 360, 0],
            TYPE: ["crasherSpawnerlimited"],
        }, {
            POSITION: [11, 0, 0, 120, 360, 0],
            TYPE: ["crasherSpawnerlimited"],
        }, {
            POSITION: [11, 0, 0, 0, 360, 0],
            TYPE: ["crasherSpawnerlimited"],
        }, {
            POSITION: [11, 0, 0, 0, 360, 1],
            TYPE: ["megahextupletGunBDN", { INDEPENDENT: true, COLOR: -1 }],
        },
    ],
};

for (let i = 0; i < 3; i++) {
    Class.albinoEliteDestroyerBDN.GUNS.push(
        {
            POSITION: [7, 16, 1, 6, 5, i * 120 + 74, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.pounder, OGg.pounder, OGg.destroyer, { reload: 0.9, damage: 100, health: 100, pen: 100 }]),
                TYPE: "bullet",
                LABEL: "Devastator Secondary",
            },
        },
        {
            POSITION: [7, 16, 1, 6, -5, i * 120 + 44, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.pounder, OGg.pounder, OGg.destroyer, { reload: 0.9, damage: 100, health: 100, pen: 100 }]),
                TYPE: "bullet",
                LABEL: "Devastator Secondary",
            },
        },
        {
            POSITION: [7, 16, 1, 6, 3, i * 120 + 67, 0.25],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.pounder, OGg.pounder, OGg.destroyer, { reload: 0.9, damage: 100, health: 100, pen: 100 }]),
                TYPE: "bullet",
                LABEL: "Devastator Secondary",
            },
        },
        {
            POSITION: [7, 16, 1, 6, -3, i * 120 + 53, 0.25],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.pounder, OGg.pounder, OGg.destroyer, { reload: 0.9, damage: 100, health: 100, pen: 100 }]),
                TYPE: "bullet",
                LABEL: "Devastator Secondary",
            },
        },
        {
            POSITION: [7, 13, 1, 6, 5, i * 120 + 74, 0.75],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.pounder, OGg.pounder, OGg.destroyer, { reload: 0.9, damage: 50, health: 50, pen: 50 }]),
                TYPE: "bullet",
                LABEL: "Devastator Secondary",
            },
        },
        {
            POSITION: [7, 13, 1, 6, -5, i * 120 + 44, 0.75],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.pounder, OGg.pounder, OGg.destroyer, { reload: 0.9, damage: 50, health: 50, pen: 50 }]),
                TYPE: "bullet",
                LABEL: "Devastator Secondary",
            },
        },
        {
            POSITION: [7, 13, 1, 6, 3, i * 120 + 67, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.pounder, OGg.pounder, OGg.destroyer, { reload: 0.9, damage: 50, health: 50, pen: 50 }]),
                TYPE: "bullet",
                LABEL: "Devastator Secondary",
            },
        },
        {
            POSITION: [7, 13, 1, 6, -3, i * 120 + 53, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.pounder, OGg.pounder, OGg.destroyer, { reload: 0.9, damage: 50, health: 50, pen: 50 }]),
                TYPE: "bullet",
                LABEL: "Devastator Secondary",
            },
        },


    )
    Class.albinoEliteDestroyerBDN.GUNS.push(
        {
            POSITION: [7, 16, 1, 6, 0, i * 120 + 60, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.pounder, OGg.pounder, OGg.destroyer, { reload: 0.9, damage: 100, health: 100, pen: 100 }]),
                TYPE: "bullet",
                LABEL: "Devastator Primary",
            },
        },
        {
            POSITION: [7, 13, 1, 6, 0, i * 120 + 60, 0.25],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.pounder, OGg.pounder, OGg.destroyer, { reload: 0.9, damage: 50, health: 50, pen: 50 }]),
                TYPE: "bullet",
                LABEL: "Devastator Primary",
            },
        },
    )
}
Class.albinoEliteGunnerBDN = {
    PARENT: ["albinoEliteBDN"],
    UPGRADE_LABEL: "Albino Elite Gunner",
    UPGRADE_COLOR: "white",
    FACING_TYPE: "toTarget",
    GUNS: [
        {
            POSITION: [14, 16, 1, 0, 0, 180, 0],
        },
        {
            POSITION: [14, 13, 1, 0, 0, 180, 0],
        }, {
            POSITION: [4, 16, 1.5, 14, 0, 180, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.trap, OGg.hexaTrapper, OGg.setTrap, OGg.setTrap, { reload: 0.8, damage: 36, health: 36, pen: 36 }]),
                TYPE: ["unsetultraDriverPillboxBDN", { MOTION_TYPE: "glide" }],
                STAT_CALCULATOR: "trap",
            },
        },
        {
            POSITION: [4, 13, 1.5, 14, 0, 180, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.trap, OGg.hexaTrapper, OGg.setTrap, { reload: 0.8, range: 0, damage: 0 }]),
                TYPE: "bullet",
            },
        }, {
            POSITION: [6, 14, -2, 2, 0, 60, 0],
        }, {
            POSITION: [6, 14, -2, 2, 0, 300, 0],
        }, {
            POSITION: [6, 14, -2, 2, 0, 55, 0],
        }, {
            POSITION: [6, 14, -2, 2, 0, 305, 0],
        },
    ],
    AI: { NO_LEAD: false },
    TURRETS: [
        {
            POSITION: [14, 8, 0, 60, 180, 0],
            TYPE: ["shyperbrimmerGunBDN"],
        }, {
            POSITION: [14, 8, 0, 300, 180, 0],
            TYPE: ["shyperbrimmerGunBDN"],
        },
    ],
};
Class.albinoEliteSprayerBDN = {
    PARENT: ["albinoEliteBDN"],
    UPGRADE_LABEL: "Albino Elite Sprayer",
    UPGRADE_COLOR: "white",
    SKILL: skillSet({
        rld: 0.7,
        dam: 0.5,
        pen: 0.8,
        str: 0.8,
        spd: 0.2,
        atk: 0.3,
        hlt: 1,
        shi: 0.7,
        rgn: 0.7,
        mob: 1,
    }),
    AI: { NO_LEAD: false },
    HAS_NO_RECOIL: true,
    GUNS: [],
    TURRETS: [
        {
            /*    SIZE         X             Y         ANGLE        ARC */
            POSITION: [6.5, 0, 0, 0, 360, 1],
            TYPE: ["hypersprayerDodecagrammataTurretBDN", { INDEPENDENT: true }],
        }, {
            POSITION: [9, 6, -7, 180, 130, 0],
            TYPE: ["ultraSprayerGunBDN", { COLOR: "grey" }],
        }, {
            POSITION: [9, 6, 7, 180, 130, 0],
            TYPE: ["ultraSprayerGunBDN", { COLOR: "grey" }],
        }, {
            POSITION: [9, 6, 7, 60, 130, 0],
            TYPE: ["ultraSprayerGunBDN", { COLOR: "grey" }],
        }, {
            POSITION: [9, 6, -7, 60, 130, 0],
            TYPE: ["ultraSprayerGunBDN", { COLOR: "grey" }],
        }, {
            POSITION: [9, 6, 7, -60, 130, 0],
            TYPE: ["ultraSprayerGunBDN", { COLOR: "grey" }],
        }, {
            POSITION: [9, 6, -7, -60, 130, 0],
            TYPE: ["ultraSprayerGunBDN", { COLOR: "grey" }],
        },
    ],
};
Class.ultracarrierBDN = {
    PARENT: "autoTankGun",
    LABEL: "",
    STAT_NAMES: statnames.swarm,
    FACING_TYPE: "locksFacing",
    BODY: {
        FOV: base.FOV * 1.2,
    },
    GUNS: [
        {
            POSITION: [16, 16, 1.4, 7, 0, 45, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.battleship, OGg.carrier, { size: 3, reload: 5, damage: 360, health: 360, pen: 360 }]),
                TYPE: "swarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [16, 16, 1.4, 7, 0, 135, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.battleship, OGg.carrier, { size: 3, reload: 5, damage: 360, health: 360, pen: 360 }]),
                TYPE: "swarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [16, 16, 1.4, 7, 0, 225, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.battleship, OGg.carrier, { size: 3, reload: 5, damage: 360, health: 360, pen: 360 }]),
                TYPE: "swarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [16, 16, 1.4, 7, 0, 315, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.battleship, OGg.carrier, { size: 3, reload: 5, damage: 360, health: 360, pen: 360 }]),
                TYPE: "swarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [16, 16, 1.4, 7, 0, 90, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.battleship, OGg.carrier, { size: 3, reload: 5, damage: 360, health: 360, pen: 360 }]),
                TYPE: "swarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [16, 16, 1.4, 7, 0, -90, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.battleship, OGg.carrier, { size: 3, reload: 5, damage: 360, health: 360, pen: 360 }]),
                TYPE: "swarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [16, 16, 1.4, 7, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.battleship, OGg.carrier, { size: 3, reload: 5, damage: 360, health: 360, pen: 360 }]),
                TYPE: "swarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [16, 16, 1.4, 7, 0, 180, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.battleship, OGg.carrier, { size: 3, reload: 5, damage: 360, health: 360, pen: 360 }]),
                TYPE: "swarm",
                STAT_CALCULATOR: "swarm",
            },
        },

    ],
}
Class.albinoEliteBattleshipBDN = {
    PARENT: ["albinoEliteBDN"],
    UPGRADE_LABEL: "Albino Elite Battleship",
    UPGRADE_COLOR: "white",
    GUNS: [],
    TURRETS: [
        {
            POSITION: [5, 7.5, 0, 0, 360, 1],
            TYPE: "ultracarrierBDN",
        }, {
            POSITION: [5, 7.5, 0, 120, 360, 1],
            TYPE: "ultracarrierBDN",
        }, {
            POSITION: [5, 7.5, 0, 240, 360, 1],
            TYPE: "ultracarrierBDN",
        },
        ...weaponArray({
            POSITION: [5, 25, 0, 0, 190, 1],
            TYPE: ["ultracarrierBDN", { GUN_STAT_SCALE: { size: 3, reload: 3, health: 1000, damage: 1000, pen: 1000 }, COLOR: -1 }],
        }, 3)
    ],
};
for (i = 0; i < 3; i++) {
    Class.albinoEliteBattleshipBDN.GUNS.push(

        {
            POSITION: [3, 2, 0.6, 7, -13, i * 120 - 60, 2 / 3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.battleship, { size: 3, reload: 3, damage: 3000, health: 3000, pen: 3000 }]),
                TYPE: "autoswarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [3, 2, 0.6, 7, 13, i * 120 - 60, 2 / 3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.battleship, { size: 3, reload: 3, damage: 3000, health: 3000, pen: 3000 }]),
                TYPE: "autoswarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [3, 2, 0.6, 7, -5, i * 120 - 60, 2 / 3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.battleship, { size: 3, reload: 3, damage: 3000, health: 3000, pen: 3000 }]),
                TYPE: "autoswarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [3, 2, 0.6, 7, 5, i * 120 - 60, 2 / 3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.battleship, { size: 3, reload: 3, damage: 3000, health: 3000, pen: 3000 }]),
                TYPE: "autoswarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [3, 2, 0.6, 7, 3.75, i * 120 - 60, 2 / 3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.battleship, { size: 3, reload: 3, damage: 3000, health: 3000, pen: 3000 }]),
                TYPE: "autoswarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [3, 2, 0.6, 7, -3.75, i * 120 - 60, 2 / 3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.battleship, { size: 3, reload: 3, damage: 3000, health: 3000, pen: 3000 }]),
                TYPE: "autoswarm",
                STAT_CALCULATOR: "swarm",
            },
        },






        {
            POSITION: [4, 4, 0.6, 7, -11, i * 120 - 60, 1 / 3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.battleship, { size: 3, reload: 3, damage: 4500, health: 4500, pen: 4500 }]),
                TYPE: "autoswarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [4, 4, 0.6, 7, 11, i * 120 - 60, 1 / 3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.battleship, { size: 3, reload: 3, damage: 4500, health: 4500, pen: 4500 }]),
                TYPE: "autoswarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [4, 4, 0.6, 7, -7, i * 120 - 60, 1 / 3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.battleship, { size: 3, reload: 3, damage: 4500, health: 4500, pen: 4500 }]),
                TYPE: "autoswarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [4, 4, 0.6, 7, 7, i * 120 - 60, 1 / 3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.battleship, { size: 3, reload: 3, damage: 4500, health: 4500, pen: 4500 }]),
                TYPE: "autoswarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [4, 4, 0.6, 7, 1.5, i * 120 - 60, 1 / 3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.battleship, { size: 3, reload: 3, damage: 4500, health: 4500, pen: 4500 }]),
                TYPE: "autoswarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [4, 4, 0.6, 7, -1.5, i * 120 - 60, 1 / 3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.battleship, { size: 3, reload: 3, damage: 4500, health: 4500, pen: 4500 }]),
                TYPE: "autoswarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [5, 5, 0.6, 7, 0, i * 120 - 60, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.battleship, { size: 3, reload: 3, damage: 6000, health: 6000, pen: 6000 }]),
                TYPE: "autoswarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [5, 5, 0.6, 7, -9, i * 120 - 60, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.battleship, { size: 3, reload: 3, damage: 6000, health: 6000, pen: 6000 }]),
                TYPE: "autoswarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [5, 5, 0.6, 7, 9, i * 120 - 60, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.battleship, { size: 3, reload: 3, damage: 6000, health: 6000, pen: 6000 }]),
                STAT_CALCULATOR: "swarm",
            },
        },
    )
}
Class.albinoSentryBDN = {
    PARENT: ["sentry"],
    COLOR: "white",
    UPGRADE_COLOR: "white",
    DANGER: 4,
    SIZE: 50,
    VALUE: 2e9,
    SHAPE: 3,
    BODY: {
        HEALTH: 100 * base.HEALTH
    },
};
Class.albinoSentrySwarmBDN = {
    PARENT: ["albinoSentryBDN"],
    UPGRADE_LABEL: "Albino Swarm Sentry",
    UPGRADE_COLOR: "white",
    GUNS: [
        {
            POSITION: [7, 9, 0.6, 7, -7.5, 60, 3 / 4],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, { recoil: 0.1 }, { reload: 1, damage: 370, health: 370, pen: 370 }]),
                TYPE: "swarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [7, 9, 0.6, 7, 7.5, 300, 3 / 4],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, { recoil: 0.1 }, { reload: 1, damage: 370, health: 370, pen: 370 }]),
                TYPE: "swarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [7, 9, 0.6, 7, 7.5, 60, 3 / 4],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, { recoil: 0.1 }, { reload: 1, damage: 370, health: 370, pen: 370 }]),
                TYPE: "swarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [7, 9, 0.6, 7, -7.5, 300, 3 / 4],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, { recoil: 0.1 }, { reload: 1, damage: 370, health: 370, pen: 370 }]),
                TYPE: "swarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [7, 9, 0.6, 7, -5, 60, 2 / 4],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, { recoil: 0.1 }, { reload: 1, damage: 370, health: 370, pen: 370 }]),
                TYPE: "swarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [7, 9, 0.6, 7, 5, 300, 2 / 4],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, { recoil: 0.1 }, { reload: 1, damage: 370, health: 370, pen: 370 }]),
                TYPE: "swarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [7, 9, 0.6, 7, 5, 60, 2 / 4],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, { recoil: 0.1 }, { reload: 1, damage: 370, health: 370, pen: 370 }]),
                TYPE: "swarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [7, 9, 0.6, 7, -5, 300, 2 / 4],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, { recoil: 0.1 }, { reload: 1, damage: 370, health: 370, pen: 370 }]),
                TYPE: "swarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [7, 9, 0.6, 7, 2.5, 60, 1 / 4],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, { recoil: 0.1 }, { reload: 1, damage: 370, health: 370, pen: 370 }]),
                TYPE: "swarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [7, 9, 0.6, 7, -2.5, 300, 1 / 4],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, { recoil: 0.1 }, { reload: 1, damage: 370, health: 370, pen: 370 }]),
                TYPE: "swarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [7, 9, 0.6, 7, -2.5, 60, 1 / 4],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, { recoil: 0.1 }, { reload: 1, damage: 370, health: 370, pen: 370 }]),
                TYPE: "swarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [7, 9, 0.6, 7, 2.5, 300, 1 / 4],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, { recoil: 0.1 }, { reload: 1, damage: 370, health: 370, pen: 370 }]),
                TYPE: "swarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [7, 9, 0.6, 7, 0, 60, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, { recoil: 0.1 }, { reload: 1, damage: 370, health: 370, pen: 370 }]),
                TYPE: "swarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [7, 9, 0.6, 7, 0, 300, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, { recoil: 0.1 }, { reload: 1, damage: 370, health: 370, pen: 370 }]),
                TYPE: "swarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [6, 13, 1.3, 7, -5, 180, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, { recoil: 1.15 }, OGg.machineGun, { reload: 0.6, damage: 315, health: 315, pen: 315 }]),
                TYPE: "swarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [6, 13, 1.3, 7, 5, 180, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, { recoil: 1.15 }, OGg.machineGun, { reload: 0.6, damage: 315, health: 315, pen: 315 }]),
                TYPE: "swarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [6, 13, 1.3, 7, -2.5, 180, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, { recoil: 1.15 }, OGg.machineGun, { reload: 0.6, damage: 315, health: 315, pen: 315 }]),
                TYPE: "swarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [6, 13, 1.3, 7, 2.5, 180, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, { recoil: 1.15 }, OGg.machineGun, { reload: 0.6, damage: 315, health: 315, pen: 315 }]),
                TYPE: "swarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [6, 13, 1.3, 7, 0, 180, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, { recoil: 1.15 }, OGg.machineGun, { reload: 0.6, damage: 315, health: 315, pen: 315 }]),
                TYPE: "swarm",
                STAT_CALCULATOR: "swarm",
            },
        },

    ],
};
Class.superpetabarricaderAutoTankGunBDN = {
    PARENT: ["genericTank"],
    LABEL: "Turret",
    BODY: {
        FOV: 0.5,
    },
    INDEPENDENT: true,
    CONTROLLERS: ["nearestDifferentMaster"],
    COLOR: "grey",
    AI: {
        SKYNET: true,
        FULL_VIEW: true,
    },
    GUNS: [
        {
            POSITION: [24, 18, 1, 0, 0, 0, 0],
        },
        {
            POSITION: [4, 18, 1, 2, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.trap, OGg.minigun, { range: 0.6 }, { reload: 2, damage: 250, health: 250, pen: 250 }]),
                TYPE: "trap",
                STAT_CALCULATOR: "trap",
            },
        },

        {
            POSITION: [4, 18, 1.3, 30, 0, 0, 1 / 6],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.trap, OGg.minigun, { range: 0.6 }, { reload: 2, damage: 250, health: 250, pen: 250 }]),
                TYPE: "trap",
                STAT_CALCULATOR: "trap",
            },
        },
        {
            POSITION: [4, 18, 1.3, 28, 0, 0, 5 / 6],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.trap, OGg.minigun, { range: 0.6 }, { reload: 2, damage: 250, health: 250, pen: 250 }]),
                TYPE: "trap",
                STAT_CALCULATOR: "trap",
            },
        },
        {
            POSITION: [4, 18, 1.3, 26, 0, 0, 2 / 6],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.trap, OGg.minigun, { range: 0.6 }, { reload: 2, damage: 250, health: 250, pen: 250 }]),
                TYPE: "trap",
                STAT_CALCULATOR: "trap",
            },
        },
        {
            POSITION: [4, 18, 1.3, 24, 0, 0, 5 / 6],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.trap, OGg.minigun, { range: 0.6 }, { reload: 2, damage: 250, health: 250, pen: 250 }]),
                TYPE: "trap",
                STAT_CALCULATOR: "trap",
            },
        },
        {
            POSITION: [4, 18, 1.3, 22, 0, 0, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.trap, OGg.minigun, { range: 0.6 }, { reload: 2, damage: 250, health: 250, pen: 250 }]),
                TYPE: "trap",
                STAT_CALCULATOR: "trap",
            },
        },
        {
            POSITION: [4, 18, 1.3, 20, 0, 0, 5 / 6],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.trap, OGg.minigun, { range: 0.6 }, { reload: 2, damage: 250, health: 250, pen: 250 }]),
                TYPE: "trap",
                STAT_CALCULATOR: "trap",
            },
        },
        {
            POSITION: [4, 18, 1.3, 18, 0, 0, 4 / 6],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.trap, OGg.minigun, { range: 0.6 }, { reload: 2, damage: 250, health: 250, pen: 250 }]),
                TYPE: "trap",
                STAT_CALCULATOR: "trap",
            },
        },
        {
            POSITION: [4, 18, 1.3, 16, 0, 0, 5 / 6],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.trap, OGg.minigun, { range: 0.6 }, { reload: 2, damage: 250, health: 250, pen: 250 }]),
                TYPE: "trap",
                STAT_CALCULATOR: "trap",
            },
        },
        {
            POSITION: [4, 18, 1.3, 14, 0, 0, 5 / 6],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.trap, OGg.minigun, { range: 0.6 }, { reload: 2, damage: 250, health: 250, pen: 250 }]),
                TYPE: "trap",
                STAT_CALCULATOR: "trap",
            },
        },
        {
            POSITION: [4, 18, 1.3, 12, 0, 0, 5 / 6],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.trap, OGg.minigun, { range: 0.6 }, { reload: 2, damage: 250, health: 250, pen: 250 }]),
                TYPE: "trap",
                STAT_CALCULATOR: "trap",
            },
        },
        {
            POSITION: [4, 18, 1.3, 10, 0, 0, 5 / 6],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.trap, OGg.minigun, { range: 0.6 }, { reload: 2, damage: 250, health: 250, pen: 250 }]),
                TYPE: "trap",
                STAT_CALCULATOR: "trap",
            },
        },
    ],
};
Class.albinoSentryTrapBDN = makeAuto(Class.albinoSentryBDN, "Sentry", {
    type: Class.superpetabarricaderAutoTankGunBDN,
    size: 12,
});
Class.albinoSentryTrapBDN.UPGRADE_LABEL = "Albino Trap Sentry";
Class.albinoSentryTrapBDN.GUNS = [
    {
        POSITION: [14, 11, 1, 0, 0, 180, 0],
    },
    {
        POSITION: [3, 11, 1.2, 14, 0, 180, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([OGg.trap, OGg.setTrap, { recoil: 1.15 }, { reload: 2, damage: 300, health: 354, pen: 354 }]),
            TYPE: "setTrap",
            STAT_CALCULATOR: "trap",
        },
    },
]
Class.sshypermortarAutoTankgunBDN = {
    PARENT: ["genericTank"],
    LABEL: "Mortar",
    BODY: {
        FOV: 2,
    },
    CONTROLLERS: [
        "canRepel",
        "onlyAcceptInArc",
        "mapAltToFire",
        "nearestDifferentMaster",
    ],
    COLOR: "grey",
    GUNS: [
        {
            POSITION: [15, 3, 1, 0, -8.5, -13, 1 / 7],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.pelleter, OGg.artillery, { reload: 0.7, damage: 125, health: 100, pen: 100 }]),
                TYPE: "bullet",
                LABEL: "Tetiary",
            },
        },
        {
            POSITION: [15, 3, 1, 0, 8.5, 13, 1 / 7],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.pelleter, OGg.artillery, { reload: 0.7, damage: 125, health: 100, pen: 100 }]),
                TYPE: "bullet",
                LABEL: "Tetiary",
            },
        },
        {
            POSITION: [15, 3, 1, 0, -8, -13, 1 / 7],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.pelleter, OGg.artillery, { reload: 0.7, damage: 125, health: 100, pen: 100 }]),
                TYPE: "bullet",
                LABEL: "Tetiary",
            },
        },
        {
            POSITION: [15.5, 3, 1, 0, 8, 13, 1 / 7],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.pelleter, OGg.artillery, { reload: 0.7, damage: 125, health: 100, pen: 100 }]),
                TYPE: "bullet",
                LABEL: "Tetiary",
            },
        },
        {
            POSITION: [16, 3, 1, 0, -7.5, -13, 1 / 7],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.pelleter, OGg.artillery, { reload: 0.7, damage: 125, health: 100, pen: 100 }]),
                TYPE: "bullet",
                LABEL: "Tetiary",
            },
        },
        {
            POSITION: [16, 3, 1, 0, 7.5, 13, 1 / 7],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.pelleter, OGg.artillery, { reload: 0.7, damage: 125, health: 100, pen: 100 }]),
                TYPE: "bullet",
                LABEL: "Tetiary",
            },
        },
        {
            POSITION: [16.5, 3, 1, 0, -7, -11, 2 / 7],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.pelleter, OGg.artillery, { reload: 0.7, damage: 125, health: 100, pen: 100 }]),
                TYPE: "bullet",
                LABEL: "Tetiary",
            },
        },
        {
            POSITION: [16.5, 3, 1, 0, 7, 11, 2 / 7],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.pelleter, OGg.artillery, { reload: 0.7, damage: 125, health: 100, pen: 100 }]),
                TYPE: "bullet",
                LABEL: "Tetiary",
            },
        },
        {
            POSITION: [17, 3, 1, 0, -6.5, -9, 3 / 7],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.pelleter, OGg.artillery, { reload: 0.7, damage: 125, health: 100, pen: 100 }]),
                TYPE: "bullet",
                LABEL: "Tetiary",
            },
        },
        {
            POSITION: [17, 3, 1, 0, 6.5, 9, 3 / 7],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.pelleter, OGg.artillery, { reload: 0.7, damage: 125, health: 100, pen: 100 }]),
                TYPE: "bullet",
                LABEL: "Tetiary",
            },
        },
        {
            POSITION: [17.5, 3, 1, 0, -6, -7, 4 / 7],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.pelleter, OGg.artillery, { reload: 0.7, damage: 125, health: 100, pen: 100 }]),
                TYPE: "bullet",
                LABEL: "Secondary",
            },
        },
        {
            POSITION: [17.5, 3, 1, 0, 6, 7, 4 / 7],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.pelleter, OGg.artillery, { reload: 0.7, damage: 125, health: 100, pen: 100 }]),
                TYPE: "bullet",
                LABEL: "Secondary",
            },
        },
        {
            POSITION: [18, 3, 1, 0, -5.5, -5, 5 / 7],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.pelleter, OGg.artillery, { reload: 0.7, damage: 125, health: 100, pen: 100 }]),
                TYPE: "bullet",
                LABEL: "Secondary",
            },
        },
        {
            POSITION: [18, 3, 1, 0, 5.5, 5, 5 / 7],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.pelleter, OGg.artillery, { reload: 0.7, damage: 125, health: 100, pen: 100 }]),
                TYPE: "bullet",
                LABEL: "Secondary",
            },
        },
        {
            POSITION: [18.5, 3, 1, 0, -4.5, -5, 5 / 7],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.pelleter, OGg.artillery, { reload: 0.7, damage: 125, health: 100, pen: 100 }]),
                TYPE: "bullet",
                LABEL: "Secondary",
            },
        },
        {
            POSITION: [18.5, 3, 1, 0, 4.5, 5, 5 / 7],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.pelleter, OGg.artillery, { reload: 0.7, damage: 125, health: 100, pen: 100 }]),
                TYPE: "bullet",
                LABEL: "Secondary",
            },
        },
        {
            POSITION: [19, 12, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.pounder, OGg.artillery, { reload: 0.7, damage: 125, health: 100, pen: 100 }]),
                TYPE: "bullet",
                LABEL: "Heavy",
            },
        },
    ],
};
Class.albinoSentryGunBDN = makeAuto(Class.albinoSentryBDN, "Sentry", {
    type: Class.sshypermortarAutoTankgunBDN,
    size: 12,
});
Class.albinoSentryGunBDN.UPGRADE_LABEL = "Albino Gun Sentry";
Class.albinoSentryGunBDN.TURRETS.push(
    ...weaponArray({
        POSITION: [10, 10, 0, 0, 190, 0],
        TYPE: "ultraSprayerGunBDN",
    }, 3),
)
Class.albinoEliteSpawnerBDN = {
    PARENT: ["albinoEliteBDN"],
    UPGRADE_LABEL: "Albino Elite Spawner",
    UPGRADE_COLOR: "white",
    MAX_CHILDREN: 5,
    AI: { STRAFE: false },
    GUNS: [
        {
            POSITION: [11, 16, 1, 0, 0, 60, 0],
        },

        {
            POSITION: [11, 16, 1, 0, 0, 180, 0],
        },

        {
            POSITION: [11, 16, 1, 0, 0, 300, 0],
        }, {
            /*** LENGTH    WIDTH     ASPECT        X             Y         ANGLE     DELAY */
            POSITION: [2, 18, 1, 11, 0, 60, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.drone, OGg.weak, { size: 0.5 }, { health: 0.7, reload: 0.6 }]),
                TYPE: ["albinoSentrySwarmBDN", { GIVE_KILL_MESSAGE: false, VARIES_IN_SIZE: false }],
                SYNCS_SKILLS: true,
                AUTOFIRE: true,
                STAT_CALCULATOR: "drone",
            },
        }, {
            POSITION: [2, 18, 1, 11, 0, 180, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.drone, OGg.weak, { size: 0.5 }, { health: 0.7, reload: 0.6 }]),
                TYPE: ["albinoSentryTrapBDN", { GIVE_KILL_MESSAGE: false, VARIES_IN_SIZE: false }],
                SYNCS_SKILLS: true,
                AUTOFIRE: true,
                STAT_CALCULATOR: "drone",
            },
        }, {
            POSITION: [2, 18, 1, 11, 0, 300, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.drone, OGg.weak, { size: 0.5 }, { health: 0.7, reload: 0.6 }]),
                TYPE: ["albinoSentryGunBDN", { GIVE_KILL_MESSAGE: false, VARIES_IN_SIZE: false }],
                SYNCS_SKILLS: true,
                AUTOFIRE: true,
                STAT_CALCULATOR: "drone",
            },
        },
        {
            POSITION: [13, 10, 1, 0, 0, 60, 0],
        },
        {
            POSITION: [11, 4, 1, 2, -6, 55, 0],
        },
        {
            POSITION: [11, 4, 1, 2, 6, 65, 0],
        },
        {
            POSITION: [9, 4, 1, 4, -8, 50, 0],
        },
        {
            POSITION: [9, 4, 1, 4, 8, 70, 0],
        },


        {
            POSITION: [4, 10, 1.6, 10.25, 0, 180, 0],
        },
        {
            POSITION: [4, 10, 1.6, 9.5, 0, 180, 0],
        },
        {
            POSITION: [4, 10, 1.6, 8.75, 0, 180, 0],
        },
        {
            POSITION: [4, 10, 1.6, 8, 0, 180, 0],
        },

        {
            POSITION: [5, 9, 1.65, 8, 0, 300, 0],
        },
        {
            POSITION: [4, 10, 0.6, 9, 0, 300, 0],
        },
    ],
    TURRETS: [
        {
            POSITION: [11, 0, 0, 0, 360, 1],
            TYPE: ["megahextupletGunBDN", { INDEPENDENT: false, COLOR: -1 }],
        },
    ],
};
Class.albinoEliteTrapGuardTopBDN = {
    PARENT: ["genericTank"],
    COLOR: -1,
    CONTROLLERS: [["spin", { independent: true }]],
    GUNS: [],
};
for (let i = 0; i < 12; i++) {
    Class.albinoEliteTrapGuardTopBDN.GUNS.push(
        {
            POSITION: [19, 8, 1, 0, 0, 30 * i, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.flankGuard, OGg.minigun, OGg.flankGuard, { reload: 2.6, damage: 105, health: 105, pen: 105 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [17, 8, 1, 0, 0, 30 * i, 0.2],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.flankGuard, OGg.minigun, OGg.flankGuard, { reload: 2.6, damage: 105, health: 105, pen: 105 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [15, 8, 1, 0, 0, 30 * i, 0.4],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.flankGuard, OGg.minigun, OGg.flankGuard, { reload: 2.6, damage: 105, health: 105, pen: 105 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [13, 8, 1, 0, 0, 30 * i, 0.6],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.flankGuard, OGg.minigun, OGg.flankGuard, { reload: 2.6, damage: 105, health: 105, pen: 105 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [13, 8, 1, 0, 0, 30 * i, 0.8],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.flankGuard, OGg.minigun, OGg.flankGuard, { reload: 2.6, damage: 105, health: 105, pen: 105 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [20, 8, 1, 0, 0, 30 * i + 15, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.flankGuard, OGg.flankGuard, { reload: 3.2, damage: 100.5, health: 100.5, pen: 100.5 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [18, 8, 1, 0, 0, 30 * i + 15, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.flankGuard, OGg.flankGuard, { reload: 3.2, damage: 100.5, health: 100.5, pen: 100.5 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [4, 8, 1.7, 13, 0, 30 * i + 15, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.trap, { reload: 3.2, damage: 100.5, health: 100.5, pen: 100.5 }]),
                TYPE: "trap",
                STAT_CALCULATOR: "trap",
            },
        },
    )
};
Class.albinoEliteTrapGuardBDN = {
    PARENT: ["albinoEliteBDN"],
    UPGRADE_LABEL: "Albino Elite Trap Guard",
    UPGRADE_COLOR: "white",
    AI: { STRAFE: false },
    GUNS: [],
    TURRETS: [
        {
            POSITION: [9.5, 0, 0, 0, 360, 1],
            TYPE: "albinoEliteTrapGuardTopBDN",
        },
    ],
};
for (let i = 0; i < 3; i++) {
    Class.albinoEliteTrapGuardBDN.GUNS.push(
        {
            POSITION: [10.5, 8, 1, 0, 0, 120 * i + 60, 0],
        },
        {
            POSITION: [2, 8, 1.4, 10.5, 0, 120 * i + 60, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.trap, OGg.setTrap, { reload: 2, damage: 8, health: 8, pen: 8 }]),
                TYPE: "unsetPillbox",
                MAX_CHILDREN: 5,
                STAT_CALCULATOR: "trap",
            },
        },
        {
            POSITION: [9, 10, 1, 0, 0, 120 * i + 60, 0],
        },
    )
    Class.albinoEliteTrapGuardBDN.TURRETS.push(
        {
            POSITION: [5.5, 8, -9, 120 * i + 60, 160, 0],
            TYPE: ["gigaDoomsayerGunBDN", { INDEPENDENT: false, }],
        }, {
        POSITION: [5.5, 8, 9, 120 * i + 60, 160, 0],
        TYPE: ["gigaDoomsayerGunBDN", { INDEPENDENT: false, }],
    },
    )
};
Class.albinoEliteSuperSpinnerCycloneBDN = {
    PARENT: ["genericTank"],
    COLOR: -1,
    CONTROLLERS: [["spin", { speed: 0.1, independent: true }]],
    GUNS: [],
};

for (let i = 0; i < 24; i++) {
    Class.albinoEliteSuperSpinnerCycloneBDN.GUNS.push(
        {
            POSITION: [21, 13, 1, 0, 0, (15 * i), 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.flankGuard, OGg.pounder, OGg.destroyer, { reload: 1.5, speed: 3, maxSpeed: 3, damage: 100, health: 100, pen: 100 }]),
                TYPE: "bullet",
            },
        },
    )
};
for (let i = 0; i < 48; i++) {
    Class.albinoEliteSuperSpinnerCycloneBDN.GUNS.push(
        {
            POSITION: [18, 8, 1, 0, 0, (7.5 * i), 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.flankGuard, { reload: 1.5, speed: 3, maxSpeed: 3, damage: 100, health: 100, pen: 100 }]),
                TYPE: "bullet",
            },
        },

    )
};
for (let i = 0; i < 24; i++) {
    Class.albinoEliteSuperSpinnerCycloneBDN.GUNS.push(
        {
            POSITION: [15, 3, 1, 0, 0, (15 * i) + 7.5, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.gunner, { reload: 4, speed: 3.5, maxSpeed: 1.9, damage: 100, health: 100, pen: 100 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [15, 3, 1, 0, 0, (15 * i) - 7.5, 1 / 2],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.gunner, { reload: 4, speed: 3.5, maxSpeed: 1.9, damage: 100, health: 100, pen: 100 }]),
                TYPE: "bullet",
            },
        },
    )
};
Class.albinoEliteSpinnerBDN = {
    PARENT: ["albinoEliteBDN"],
    UPGRADE_LABEL: "Albino Elite Spinner",
    UPGRADE_COLOR: "white",
    SKILL: skillSet({
        rld: 0.7,
        dam: 0.5,
        pen: 0.8,
        str: 0.8,
        spd: 0.2,
        atk: 0.3,
        hlt: 1,
        shi: 0.7,
        rgn: 0.7,
        mob: 1,
    }),
    AI: { STRAFE: false },
    FACING_TYPE: ["spin", { speed: 0.1 }],
    GUNS: [],
    TURRETS: [
        {
            POSITION: [9.5, 0, 0, 0, 360, 1],
            TYPE: ["albinoEliteSuperSpinnerCycloneBDN", { COLOR: -1 }],
        },
        ...weaponArray({
            POSITION: [5, 12.5, 0, 0, 190, 0],
            TYPE: "baseTrapTurret",
            SHOOT_SETTINGS: combineStats([{ health: 50, damage: 50, pen: 50 }]),
        }, 3)
    ],
};
for (let i = 0; i < 3; i++) {
    Class.albinoEliteSpinnerBDN.GUNS.push(
        {
            POSITION: [10.5, 2, 1, -1.5, 11.5, 120 * i + 10, 8 / 10],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.twin, OGg.gunner, { speed: 1.3, maxSpeed: 1.3, reload: 2, damage: 120, health: 120, pen: 120 }]),
                TYPE: "bullet",
            },
        }, {
        POSITION: [10.5, 2, 1, 2, 9, 120 * i + 10, 6 / 10],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([OGg.basic, OGg.twin, OGg.gunner, { speed: 1.3, maxSpeed: 1.3, reload: 2, damage: 120, health: 120, pen: 120 }]),
            TYPE: "bullet",
        },
    }, {
        POSITION: [10.5, 2, 1, 3.5, 6.5, 120 * i + 10, 4 / 10],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([OGg.basic, OGg.twin, OGg.gunner, { speed: 1.3, maxSpeed: 1.3, reload: 2, damage: 120, health: 120, pen: 120 }]),
            TYPE: "bullet",
        },
    }, {
        POSITION: [10.5, 2, 1, 6, 4, 120 * i + 10, 2 / 10],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([OGg.basic, OGg.twin, OGg.gunner, { speed: 1.3, maxSpeed: 1.3, reload: 2, damage: 120, health: 120, pen: 120 }]),
            TYPE: "bullet",
        },
    }, {
        POSITION: [10.5, 2, 1, 8.5, 1.5, 120 * i + 10, 0 / 10],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([OGg.basic, OGg.twin, OGg.gunner, { speed: 1.3, maxSpeed: 1.3, reload: 2, damage: 120, health: 120, pen: 120 }]),
            TYPE: "bullet",
        },
    },
        {
            POSITION: [9.5, 2, 1, -1.5, 11.5, 120 * i + 10, 8 / 10],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.twin, OGg.gunner, { speed: 1.3, maxSpeed: 1.3, reload: 2, damage: 120, health: 120, pen: 120 }]),
                TYPE: "bullet",
            },
        }, {
        POSITION: [9.5, 2, 1, 2, 9, 120 * i + 10, 6 / 10],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([OGg.basic, OGg.twin, OGg.gunner, { speed: 1.3, maxSpeed: 1.3, reload: 2, damage: 120, health: 120, pen: 120 }]),
            TYPE: "bullet",
        },
    }, {
        POSITION: [9.5, 2, 1, 3.5, 6.5, 120 * i + 10, 4 / 10],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([OGg.basic, OGg.twin, OGg.gunner, { speed: 1.3, maxSpeed: 1.3, reload: 2, damage: 120, health: 120, pen: 120 }]),
            TYPE: "bullet",
        },
    }, {
        POSITION: [9.5, 2, 1, 6, 4, 120 * i + 10, 2 / 10],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([OGg.basic, OGg.twin, OGg.gunner, { speed: 1.3, maxSpeed: 1.3, reload: 2, damage: 120, health: 120, pen: 120 }]),
            TYPE: "bullet",
        },
    }, {
        POSITION: [9.5, 2, 1, 8.5, 1.5, 120 * i + 10, 0 / 10],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([OGg.basic, OGg.twin, OGg.gunner, { speed: 1.3, maxSpeed: 1.3, reload: 2, damage: 120, health: 120, pen: 120 }]),
            TYPE: "bullet",
        },
    },
        {
            POSITION: [8.5, 2, 1, -1.5, 11.5, 120 * i + 10, 8 / 10],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.twin, OGg.gunner, { speed: 1.3, maxSpeed: 1.3, reload: 2, damage: 120, health: 120, pen: 120 }]),
                TYPE: "bullet",
            },
        }, {
        POSITION: [8.5, 2, 1, 2, 9, 120 * i + 10, 6 / 10],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([OGg.basic, OGg.twin, OGg.gunner, { speed: 1.3, maxSpeed: 1.3, reload: 2, damage: 120, health: 120, pen: 120 }]),
            TYPE: "bullet",
        },
    }, {
        POSITION: [8.5, 2, 1, 3.5, 6.5, 120 * i + 10, 4 / 10],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([OGg.basic, OGg.twin, OGg.gunner, { speed: 1.3, maxSpeed: 1.3, reload: 2, damage: 120, health: 120, pen: 120 }]),
            TYPE: "bullet",
        },
    }, {
        POSITION: [8.5, 2, 1, 6, 4, 120 * i + 10, 2 / 10],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([OGg.basic, OGg.twin, OGg.gunner, { speed: 1.3, maxSpeed: 1.3, reload: 2, damage: 120, health: 120, pen: 120 }]),
            TYPE: "bullet",
        },
    }, {
        POSITION: [8.5, 2, 1, 8.5, 1.5, 120 * i + 10, 0 / 10],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([OGg.basic, OGg.twin, OGg.gunner, { speed: 1.3, maxSpeed: 1.3, reload: 2, damage: 120, health: 120, pen: 120 }]),
            TYPE: "bullet",
        },
    },
        {
            POSITION: [7.5, 2, 1, -1.5, 11.5, 120 * i + 10, 5 / 6],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.twin, OGg.gunner, { speed: 1.3, maxSpeed: 1.3, reload: 2, damage: 120, health: 120, pen: 120 }]),
                TYPE: "bullet",
            },
        }, {
        POSITION: [7.5, 2, 1, 2, 9, 120 * i + 10, 4 / 6],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([OGg.basic, OGg.twin, OGg.gunner, { speed: 1.3, maxSpeed: 1.3, reload: 2, damage: 120, health: 120, pen: 120 }]),
            TYPE: "bullet",
        },
    }, {
        POSITION: [7.5, 2, 1, 3.5, 6.5, 120 * i + 10, 3 / 6],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([OGg.basic, OGg.twin, OGg.gunner, { speed: 1.3, maxSpeed: 1.3, reload: 2, damage: 120, health: 120, pen: 120 }]),
            TYPE: "bullet",
        },
    }, {
        POSITION: [7.5, 2, 1, 6, 4, 120 * i + 10, 2 / 6],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([OGg.basic, OGg.twin, OGg.gunner, { speed: 1.3, maxSpeed: 1.3, reload: 2, damage: 120, health: 120, pen: 120 }]),
            TYPE: "bullet",
        },
    }, {
        POSITION: [7.5, 2, 1, 8.5, 1.5, 120 * i + 10, 1 / 6],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([OGg.basic, OGg.twin, OGg.gunner, { speed: 1.3, maxSpeed: 1.3, reload: 2, damage: 120, health: 120, pen: 120 }]),
            TYPE: "bullet",
        },
    },
        {
            POSITION: [6.5, 2, 1, -1.5, 11.5, 120 * i + 10, 6 / 7],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.twin, OGg.gunner, { speed: 1.3, maxSpeed: 1.3, reload: 2, damage: 120, health: 120, pen: 120 }]),
                TYPE: "bullet",
            },
        }, {
        POSITION: [6.5, 2, 1, 2, 9, 120 * i + 10, 5 / 7],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([OGg.basic, OGg.twin, OGg.gunner, { speed: 1.3, maxSpeed: 1.3, reload: 2, damage: 120, health: 120, pen: 120 }]),
            TYPE: "bullet",
        },
    }, {
        POSITION: [6.5, 2, 1, 3.5, 6.5, 120 * i + 10, 4 / 7],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([OGg.basic, OGg.twin, OGg.gunner, { speed: 1.3, maxSpeed: 1.3, reload: 2, damage: 120, health: 120, pen: 120 }]),
            TYPE: "bullet",
        },
    }, {
        POSITION: [6.5, 2, 1, 6, 4, 120 * i + 10, 3 / 7],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([OGg.basic, OGg.twin, OGg.gunner, { speed: 1.3, maxSpeed: 1.3, reload: 2, damage: 120, health: 120, pen: 120 }]),
            TYPE: "bullet",
        },
    }, {
        POSITION: [6.5, 2, 1, 8.5, 1.5, 120 * i + 10, 2 / 7],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([OGg.basic, OGg.twin, OGg.gunner, { speed: 1.3, maxSpeed: 1.3, reload: 2, damage: 120, health: 120, pen: 120 }]),
            TYPE: "bullet",
        },
    },
        {
            POSITION: [5.5, 2, 1, -1.5, 11.5, 120 * i + 10, 7 / 8],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.twin, OGg.gunner, { speed: 1.3, maxSpeed: 1.3, reload: 2, damage: 120, health: 120, pen: 120 }]),
                TYPE: "bullet",
            },
        }, {
        POSITION: [5.5, 2, 1, 2, 9, 120 * i + 10, 6 / 8],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([OGg.basic, OGg.twin, OGg.gunner, { speed: 1.3, maxSpeed: 1.3, reload: 2, damage: 120, health: 120, pen: 120 }]),
            TYPE: "bullet",
        },
    }, {
        POSITION: [5.5, 2, 1, 3.5, 6.5, 120 * i + 10, 5 / 8],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([OGg.basic, OGg.twin, OGg.gunner, { speed: 1.3, maxSpeed: 1.3, reload: 2, damage: 120, health: 120, pen: 120 }]),
            TYPE: "bullet",
        },
    }, {
        POSITION: [5.5, 2, 1, 6, 4, 120 * i + 10, 4 / 8],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([OGg.basic, OGg.twin, OGg.gunner, { speed: 1.3, maxSpeed: 1.3, reload: 2, damage: 120, health: 120, pen: 120 }]),
            TYPE: "bullet",
        },
    }, {
        POSITION: [5.5, 2, 1, 8.5, 1.5, 120 * i + 10, 3 / 8],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([OGg.basic, OGg.twin, OGg.gunner, { speed: 1.3, maxSpeed: 1.3, reload: 2, damage: 120, health: 120, pen: 120 }]),
            TYPE: "bullet",
        },
    },
        {
            POSITION: [4.5, 2, 1, -1.5, 11.5, 120 * i + 10, 8 / 9],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.twin, OGg.gunner, { speed: 1.3, maxSpeed: 1.3, reload: 2, damage: 120, health: 120, pen: 120 }]),
                TYPE: "bullet",
            },
        }, {
        POSITION: [4.5, 2, 1, 2, 9, 120 * i + 10, 7 / 9],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([OGg.basic, OGg.twin, OGg.gunner, { speed: 1.3, maxSpeed: 1.3, reload: 2, damage: 120, health: 120, pen: 120 }]),
            TYPE: "bullet",
        },
    }, {
        POSITION: [4.5, 2, 1, 3.5, 6.5, 120 * i + 10, 6 / 9],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([OGg.basic, OGg.twin, OGg.gunner, { speed: 1.3, maxSpeed: 1.3, reload: 2, damage: 120, health: 120, pen: 120 }]),
            TYPE: "bullet",
        },
    }, {
        POSITION: [4.5, 2, 1, 6, 4, 120 * i + 10, 5 / 9],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([OGg.basic, OGg.twin, OGg.gunner, { speed: 1.3, maxSpeed: 1.3, reload: 2, damage: 120, health: 120, pen: 120 }]),
            TYPE: "bullet",
        },
    }, {
        POSITION: [4.5, 2, 1, 8.5, 1.5, 120 * i + 10, 4 / 9],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([OGg.basic, OGg.twin, OGg.gunner, { speed: 1.3, maxSpeed: 1.3, reload: 2, damage: 120, health: 120, pen: 120 }]),
            TYPE: "bullet",
        },
    }, {
        POSITION: [2, 20, 0.75, 8, 0, 120 * i + 60, 0],
    },
    )
};





































// Legions
Class.albinodestroyerLegion = {
    PARENT: ["albinoEliteBDN"],
    UPGRADE_LABEL: "Albino Destroyer Legion",
    NAME: "Albino Destroyer Legion",
    DISPLAY_NAME: false,
    UPGRADE_COLOR: "white",
    AI: { NO_LEAD: false },
    SIZE: 30,
    GUNS: [],
    BODY: {
        HEALTH: 400000 * base.HEALTH,
    },
    TURRETS: [
        {
            POSITION: [11, 0, 0, 180, 360, 0],
            TYPE: ["crasherSpawnerlimited", { GUN_STAT_SCALE: { health: 1.1 } }],
        }, {
            POSITION: [11, 0, 0, 60, 360, 0],
            TYPE: ["crasherSpawnerlimited", { GUN_STAT_SCALE: { health: 1.1 } }],
        }, {
            POSITION: [11, 0, 0, -60, 360, 0],
            TYPE: ["crasherSpawnerlimited", { GUN_STAT_SCALE: { health: 1.1 } }],
        }, {
            POSITION: [11, 0, 0, 240, 360, 0],
            TYPE: ["crasherSpawnerlimited", { GUN_STAT_SCALE: { health: 1.1 } }],
        }, {
            POSITION: [11, 0, 0, 120, 360, 0],
            TYPE: ["crasherSpawnerlimited", { GUN_STAT_SCALE: { health: 1.1 } }],
        }, {
            POSITION: [11, 0, 0, 0, 360, 0],
            TYPE: ["crasherSpawnerlimited", { GUN_STAT_SCALE: { health: 1.1 } }],
        }, {
            POSITION: [11, 0, 0, 0, 360, 1],
            TYPE: ["megahextupletGunBDN", { GUN_STAT_SCALE: { health: 1.1 }, INDEPENDENT: true, COLOR: -1 }],
        },
    ],
};
for (let i = 0; i < 3; i++) {
    Class.albinodestroyerLegion.GUNS.push(
        {
            POSITION: [7, 16, 1, 6, 5, i * 120 + 74, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.pounder, OGg.pounder, OGg.destroyer, { reload: 0.9, damage: 100, health: 110, pen: 100 }]),
                TYPE: "bullet",
                LABEL: "Devastator Secondary",
            },
        },
        {
            POSITION: [7, 16, 1, 6, -5, i * 120 + 44, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.pounder, OGg.pounder, OGg.destroyer, { reload: 0.9, damage: 100, health: 110, pen: 100 }]),
                TYPE: "bullet",
                LABEL: "Devastator Secondary",
            },
        },
        {
            POSITION: [7, 16, 1, 6, 3, i * 120 + 67, 0.25],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.pounder, OGg.pounder, OGg.destroyer, { reload: 0.9, damage: 100, health: 110, pen: 100 }]),
                TYPE: "bullet",
                LABEL: "Devastator Secondary",
            },
        },
        {
            POSITION: [7, 16, 1, 6, -3, i * 120 + 53, 0.25],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.pounder, OGg.pounder, OGg.destroyer, { reload: 0.9, damage: 100, health: 110, pen: 100 }]),
                TYPE: "bullet",
                LABEL: "Devastator Secondary",
            },
        },
        {
            POSITION: [7, 13, 1, 6, 5, i * 120 + 74, 0.75],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.pounder, OGg.pounder, OGg.destroyer, { reload: 0.9, damage: 50, health: 55, pen: 50 }]),
                TYPE: "bullet",
                LABEL: "Devastator Secondary",
            },
        },
        {
            POSITION: [7, 13, 1, 6, -5, i * 120 + 44, 0.75],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.pounder, OGg.pounder, OGg.destroyer, { reload: 0.9, damage: 50, health: 55, pen: 50 }]),
                TYPE: "bullet",
                LABEL: "Devastator Secondary",
            },
        },
        {
            POSITION: [7, 13, 1, 6, 3, i * 120 + 67, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.pounder, OGg.pounder, OGg.destroyer, { reload: 0.9, damage: 50, health: 55, pen: 50 }]),
                TYPE: "bullet",
                LABEL: "Devastator Secondary",
            },
        },
        {
            POSITION: [7, 13, 1, 6, -3, i * 120 + 53, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.pounder, OGg.pounder, OGg.destroyer, { reload: 0.9, damage: 50, health: 55, pen: 50 }]),
                TYPE: "bullet",
                LABEL: "Devastator Secondary",
            },
        },
    )
    Class.albinodestroyerLegion.GUNS.push(
        {
            POSITION: [7, 16, 1, 6, 0, i * 120 + 60, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.pounder, OGg.pounder, OGg.destroyer, { reload: 0.9, damage: 100, health: 110, pen: 100 }]),
                TYPE: "bullet",
                LABEL: "Devastator Primary",
            },
        },
        {
            POSITION: [7, 13, 1, 6, 0, i * 120 + 60, 0.25],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.pounder, OGg.pounder, OGg.destroyer, { reload: 0.9, damage: 50, health: 55, pen: 50 }]),
                TYPE: "bullet",
                LABEL: "Devastator Primary",
            },
        },
    )
}
Class.albinogunnerLegion = {
    PARENT: ["albinoEliteBDN"],
    UPGRADE_LABEL: "Albino Gunner Legion",
    NAME: "Albino Gunner Legion",
    DISPLAY_NAME: false,
    UPGRADE_COLOR: "white",
    FACING_TYPE: "toTarget",
    AI: { NO_LEAD: false },
    SIZE: 30,
    BODY: {
        HEALTH: 400000 * base.HEALTH,
    },
    GUNS: [
        {
            POSITION: [14, 16, 1, 0, 0, 180, 0],
        },
        {
            POSITION: [14, 13, 1, 0, 0, 180, 0],
        }, {
            POSITION: [4, 16, 1.5, 14, 0, 180, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.trap, OGg.hexaTrapper, OGg.setTrap, { reload: 0.8, damage: 18, health: 21, pen: 18 }]),
                TYPE: ["sssunsethyperDriverPillboxBDN", { MOTION_TYPE: "glide" }],
                STAT_CALCULATOR: "trap",
            },
        },
        {
            POSITION: [4, 13, 1.5, 14, 0, 180, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.trap, OGg.hexaTrapper, OGg.setTrap, { reload: 0.8, range: 0, damage: 0, health: 1.1 }]),
                TYPE: "bullet",
            },
        }, {
            POSITION: [6, 14, -2, 2, 0, 60, 0],
        }, {
            POSITION: [6, 14, -2, 2, 0, 300, 0],
        }, {
            POSITION: [6, 14, -2, 2, 0, 55, 0],
        }, {
            POSITION: [6, 14, -2, 2, 0, 305, 0],
        },
    ],
    AI: { NO_LEAD: false },
    TURRETS: [
        {
            POSITION: [14, 8, 0, 60, 180, 0],
            TYPE: ["shyperbrimmerGunBDN", { GUN_STAT_SCALE: { health: 1.15 } }],
        }, {
            POSITION: [14, 8, 0, 300, 180, 0],
            TYPE: ["shyperbrimmerGunBDN", { GUN_STAT_SCALE: { health: 1.15 } }],
        },
    ],
}
Class.albinosprayerLegion = {
    PARENT: ["albinoEliteBDN"],
    UPGRADE_LABEL: "Albino Sprayer Legion",
    NAME: "Albino Sprayer Legion",
    DISPLAY_NAME: false,
    UPGRADE_COLOR: "white",
    AI: { NO_LEAD: false },
    SIZE: 30,
    SKILL: [0, 9, 3, 9, 2, 9, 9, 9, 9, 0],
    HAS_NO_RECOIL: true,
    BODY: {
        HEALTH: 400000 * base.HEALTH,
    },
    TURRETS: weaponArray({
        POSITION: [14, 6, 0, 60, 190, 0],
        TYPE: ["ssshyperSprayerGunBDN", { GUN_STAT_SCALE: { health: 28, damage: 29.2, speed: 29.2, resist: 1.15 }, COLOR: -1 }],
    }, 3)
}
Class.albinobattleshipLegion = {
    PARENT: ["albinoEliteBDN"],
    UPGRADE_LABEL: "Albino Battleship Legion",
    NAME: "Albino Battleship Legion",
    DISPLAY_NAME: false,
    UPGRADE_COLOR: "white",
    AI: { NO_LEAD: false },
    SIZE: 30,
    BODY: {
        HEALTH: 400000 * base.HEALTH,
    },
    GUNS: [],
    TURRETS: [
        {
            POSITION: [5, 7.5, 0, 0, 360, 1],
            TYPE: ["ultracarrierBDN", { GUN_STAT_SCALE: { health: 1.1 }, INDEPENDENT: true, COLOR: -1, PARENT: "ultracarrierBDN" }],
        }, {
            POSITION: [5, 7.5, 0, 120, 360, 1],
            TYPE: ["ultracarrierBDN", { GUN_STAT_SCALE: { health: 1.1 }, INDEPENDENT: true, COLOR: -1, PARENT: "ultracarrierBDN" }],
        }, {
            POSITION: [5, 7.5, 0, 240, 360, 1],
            TYPE: ["ultracarrierBDN", { GUN_STAT_SCALE: { health: 1.1 }, INDEPENDENT: true, COLOR: -1, PARENT: "ultracarrierBDN" }],
        },
        ...weaponArray({
            POSITION: [5, 25, 0, 0, 190, 1],
            TYPE: ["ultracarrierBDN", { GUN_STAT_SCALE: { size: 3, reload: 3, health: 1000, damage: 1000, pen: 1000 }, COLOR: -1 }],
        }, 3)
    ],
};
for (i = 0; i < 3; i++) {
    Class.albinobattleshipLegion.GUNS.push(

        {
            POSITION: [3, 2, 0.6, 7, -13, i * 120 - 60, 2 / 3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.battleship, { size: 3, reload: 3, damage: 3000, health: 3000, pen: 3000 }]),
                TYPE: "autoswarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [3, 2, 0.6, 7, 13, i * 120 - 60, 2 / 3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.battleship, { size: 3, reload: 3, damage: 3000, health: 3000, pen: 3000 }]),
                TYPE: "autoswarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [3, 2, 0.6, 7, -5, i * 120 - 60, 2 / 3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.battleship, { size: 3, reload: 3, damage: 3000, health: 3000, pen: 3000 }]),
                TYPE: "autoswarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [3, 2, 0.6, 7, 5, i * 120 - 60, 2 / 3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.battleship, { size: 3, reload: 3, damage: 3000, health: 3000, pen: 3000 }]),
                TYPE: "autoswarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [3, 2, 0.6, 7, 3.75, i * 120 - 60, 2 / 3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.battleship, { size: 3, reload: 3, damage: 3000, health: 3000, pen: 3000 }]),
                TYPE: "autoswarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [3, 2, 0.6, 7, -3.75, i * 120 - 60, 2 / 3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.battleship, { size: 3, reload: 3, damage: 3000, health: 3000, pen: 3000 }]),
                TYPE: "autoswarm",
                STAT_CALCULATOR: "swarm",
            },
        },






        {
            POSITION: [4, 4, 0.6, 7, -11, i * 120 - 60, 1 / 3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.battleship, { size: 3, reload: 3, damage: 4500, health: 4500, pen: 4500 }]),
                TYPE: "autoswarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [4, 4, 0.6, 7, 11, i * 120 - 60, 1 / 3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.battleship, { size: 3, reload: 3, damage: 4500, health: 4500, pen: 4500 }]),
                TYPE: "autoswarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [4, 4, 0.6, 7, -7, i * 120 - 60, 1 / 3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.battleship, { size: 3, reload: 3, damage: 4500, health: 4500, pen: 4500 }]),
                TYPE: "autoswarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [4, 4, 0.6, 7, 7, i * 120 - 60, 1 / 3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.battleship, { size: 3, reload: 3, damage: 4500, health: 4500, pen: 4500 }]),
                TYPE: "autoswarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [4, 4, 0.6, 7, 1.5, i * 120 - 60, 1 / 3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.battleship, { size: 3, reload: 3, damage: 4500, health: 4500, pen: 4500 }]),
                TYPE: "autoswarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [4, 4, 0.6, 7, -1.5, i * 120 - 60, 1 / 3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.battleship, { size: 3, reload: 3, damage: 4500, health: 4500, pen: 4500 }]),
                TYPE: "autoswarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [5, 5, 0.6, 7, 0, i * 120 - 60, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.battleship, { size: 3, reload: 3, damage: 6000, health: 6000, pen: 6000 }]),
                TYPE: "autoswarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [5, 5, 0.6, 7, -9, i * 120 - 60, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.battleship, { size: 3, reload: 3, damage: 6000, health: 6000, pen: 6000 }]),
                TYPE: "autoswarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [5, 5, 0.6, 7, 9, i * 120 - 60, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.battleship, { size: 3, reload: 3, damage: 6000, health: 6000, pen: 6000 }]),
                STAT_CALCULATOR: "swarm",
            },
        },
    )
}
Class.albinospawnerLegion = {
    PARENT: ["albinoEliteBDN"],
    UPGRADE_LABEL: "Albino Spawner Legion",
    NAME: "Albino Spawner Legion",
    DISPLAY_NAME: false,
    UPGRADE_COLOR: "white",
    AI: { NO_LEAD: false },
    SIZE: 30,
    BODY: {
        HEALTH: 400000 * base.HEALTH,
    },
    GUNS: [
        {
            POSITION: [11, 16, 1, 0, 0, 60, 0],
        },

        {
            POSITION: [11, 16, 1, 0, 0, 180, 0],
        },

        {
            POSITION: [11, 16, 1, 0, 0, 300, 0],
        }, {
            /*** LENGTH    WIDTH     ASPECT        X             Y         ANGLE     DELAY */
            POSITION: [2, 18, 1, 11, 0, 60, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.drone, OGg.weak, OGg.weak, OGg.weak, { size: 0.4 }, { health: 0.3, reload: 0.75 }]),
                TYPE: ["albinoSentrySwarmBDN", { GIVE_KILL_MESSAGE: false, VARIES_IN_SIZE: false }],
                SYNCS_SKILLS: true,
                AUTOFIRE: true,
                STAT_CALCULATOR: "drone",
            },
        }, {
            POSITION: [2, 18, 1, 11, 0, 180, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.drone, OGg.weak, OGg.weak, OGg.weak, { size: 0.4 }, { health: 0.3, reload: 0.75 }]),
                TYPE: ["albinoSentryTrapBDN", { GIVE_KILL_MESSAGE: false, VARIES_IN_SIZE: false }],
                SYNCS_SKILLS: true,
                AUTOFIRE: true,
                STAT_CALCULATOR: "drone",
            },
        }, {
            POSITION: [2, 18, 1, 11, 0, 300, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.drone, OGg.weak, OGg.weak, OGg.weak, { size: 0.4 }, { health: 0.3, reload: 0.75 }]),
                TYPE: ["albinoSentryGunBDN", { GIVE_KILL_MESSAGE: false, VARIES_IN_SIZE: false }],
                SYNCS_SKILLS: true,
                AUTOFIRE: true,
                STAT_CALCULATOR: "drone",
            },
        },
        {
            POSITION: [13, 10, 1, 0, 0, 60, 0],
        },
        {
            POSITION: [11, 4, 1, 2, -6, 55, 0],
        },
        {
            POSITION: [11, 4, 1, 2, 6, 65, 0],
        },
        {
            POSITION: [9, 4, 1, 4, -8, 50, 0],
        },
        {
            POSITION: [9, 4, 1, 4, 8, 70, 0],
        },


        {
            POSITION: [4, 10, 1.6, 10.25, 0, 180, 0],
        },
        {
            POSITION: [4, 10, 1.6, 9.5, 0, 180, 0],
        },
        {
            POSITION: [4, 10, 1.6, 8.75, 0, 180, 0],
        },
        {
            POSITION: [4, 10, 1.6, 8, 0, 180, 0],
        },

        {
            POSITION: [5, 9, 1.65, 8, 0, 300, 0],
        },
        {
            POSITION: [4, 10, 0.6, 9, 0, 300, 0],
        },
    ],
    TURRETS: [
        {
            POSITION: [11, 0, 0, 0, 360, 1],
            TYPE: ["megahextupletGunBDN", { GUN_STAT_SCALE: { health: 1.15 }, INDEPENDENT: false, COLOR: -1 }],
        },
    ],
}
// Legionary Crasher
Class.albinolegionaryCrasherTop = {
    PARENT: ["albinoEliteBDN"],
    AI: { STRAFE: false, NO_LEAD: false },
    INDEPENDENT: true,
    DISPLAY_NAME: false,
    GUNS: [
        {
            /*** LENGTH    WIDTH     ASPECT        X             Y         ANGLE     DELAY */
            POSITION: [2, 18, 1, 11, 0, 60, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.drone, OGg.weak, { size: 0.4 }, { health: 0.6, reload: 0.6 }]),
                TYPE: ["albinoSentrySwarmBDN", { GIVE_KILL_MESSAGE: false, VARIES_IN_SIZE: false }],
                SYNCS_SKILLS: true,
                AUTOFIRE: true,
                STAT_CALCULATOR: "drone",
                MAX_CHILDREN: 1,
            },
        }, {
            POSITION: [2, 18, 1, 11, 0, 180, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.drone, OGg.weak, { size: 0.4 }, { health: 0.6, reload: 0.6 }]),
                TYPE: ["albinoSentryTrapBDN", { GIVE_KILL_MESSAGE: false, VARIES_IN_SIZE: false }],
                SYNCS_SKILLS: true,
                AUTOFIRE: true,
                STAT_CALCULATOR: "drone",
                MAX_CHILDREN: 1,
            },
        }, {
            POSITION: [2, 18, 1, 11, 0, 300, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.drone, OGg.weak, { size: 0.4 }, { health: 0.6, reload: 0.6 }]),
                TYPE: ["albinoSentryGunBDN", { GIVE_KILL_MESSAGE: false, VARIES_IN_SIZE: false }],
                SYNCS_SKILLS: true,
                AUTOFIRE: true,
                STAT_CALCULATOR: "drone",
                MAX_CHILDREN: 1,
            },
        },



        ...weaponArray([

            {
                POSITION: [4, 3, 0.7, 7, 0, 60, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.pounder, { damage: 3, pen: 3, health: 3 }, { speed: 2.5, maxSpeed: 2.2, size: 1.1, range: 3.25 }]),
                    TYPE: ["swarm", { INDEPENDENT: true }],
                    STAT_CALCULATOR: "swarm",
                    AUTOFIRE: true,

                },
            },
            {
                POSITION: [3.5, 3, 0.7, 7, 5, 60, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.pounder, { damage: 3, pen: 3, health: 3 }, { speed: 2.5, maxSpeed: 2.2, size: 1.1, range: 3.25 }]),
                    TYPE: ["swarm", { INDEPENDENT: true }],
                    STAT_CALCULATOR: "swarm",
                    AUTOFIRE: true,

                },
            }, {
                POSITION: [3.5, 3, 0.7, 7, -5, 60, 1 / 4],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.pounder, { damage: 3, pen: 3, health: 3 }, { speed: 2.5, maxSpeed: 2.2, size: 1.1, range: 3.25 }]),
                    TYPE: ["swarm", { INDEPENDENT: true }],
                    STAT_CALCULATOR: "swarm",
                    AUTOFIRE: true,
                },
            }, {
                POSITION: [3, 3, 0.7, 7, -2.5, 60, 2 / 4],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.pounder, { damage: 3, pen: 3, health: 3 }, { speed: 2.5, maxSpeed: 2.2, size: 1.1, range: 3.25 }]),
                    TYPE: ["swarm", { INDEPENDENT: true }],
                    STAT_CALCULATOR: "swarm",
                    AUTOFIRE: true,
                },
            }, {
                POSITION: [3, 3, 0.7, 7, 2.5, 60, 3 / 4],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.pounder, { damage: 3, pen: 3, health: 3 }, { speed: 2.5, maxSpeed: 2.2, size: 1.1, range: 3.25 }]),
                    TYPE: ["swarm", { INDEPENDENT: true }],
                    STAT_CALCULATOR: "swarm",
                    AUTOFIRE: true,
                },
            },



            {
                POSITION: [7, 16, 1, 6, 5, i * 120 + 74, 0.5],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([OGg.basic, OGg.pounder, OGg.pounder, OGg.destroyer, { reload: 0.9, damage: 150, health: 150, pen: 150 }]),
                    TYPE: "bullet",
                    LABEL: "Devastator Secondary",
                },
            },
            {
                POSITION: [7, 16, 1, 6, -5, i * 120 + 44, 0.5],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([OGg.basic, OGg.pounder, OGg.pounder, OGg.destroyer, { reload: 0.9, damage: 150, health: 150, pen: 150 }]),
                    TYPE: "bullet",
                    LABEL: "Devastator Secondary",
                },
            },
            {
                POSITION: [7, 16, 1, 6, 3, i * 120 + 67, 0.25],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([OGg.basic, OGg.pounder, OGg.pounder, OGg.destroyer, { reload: 0.9, damage: 150, health: 150, pen: 150 }]),
                    TYPE: "bullet",
                    LABEL: "Devastator Secondary",
                },
            },
            {
                POSITION: [7, 16, 1, 6, -3, i * 120 + 53, 0.25],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([OGg.basic, OGg.pounder, OGg.pounder, OGg.destroyer, { reload: 0.9, damage: 150, health: 150, pen: 150 }]),
                    TYPE: "bullet",
                    LABEL: "Devastator Secondary",
                },
            },
            {
                POSITION: [7, 13, 1, 6, 5, i * 120 + 74, 0.75],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([OGg.basic, OGg.pounder, OGg.pounder, OGg.destroyer, { reload: 0.9, damage: 75, health: 75, pen: 75 }]),
                    TYPE: "bullet",
                    LABEL: "Devastator Secondary",
                },
            },
            {
                POSITION: [7, 13, 1, 6, -5, i * 120 + 44, 0.75],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([OGg.basic, OGg.pounder, OGg.pounder, OGg.destroyer, { reload: 0.9, damage: 75, health: 75, pen: 75 }]),
                    TYPE: "bullet",
                    LABEL: "Devastator Secondary",
                },
            },
            {
                POSITION: [7, 13, 1, 6, 3, i * 120 + 67, 0.5],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([OGg.basic, OGg.pounder, OGg.pounder, OGg.destroyer, { reload: 0.9, damage: 75, health: 75, pen: 75 }]),
                    TYPE: "bullet",
                    LABEL: "Devastator Secondary",
                },
            },
            {
                POSITION: [7, 13, 1, 6, -3, i * 120 + 53, 0.5],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([OGg.basic, OGg.pounder, OGg.pounder, OGg.destroyer, { reload: 0.9, damage: 75, health: 75, pen: 75 }]),
                    TYPE: "bullet",
                    LABEL: "Devastator Secondary",
                },
            },
            {
                POSITION: [7, 16, 1, 6, 0, i * 120 + 60, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([OGg.basic, OGg.pounder, OGg.pounder, OGg.destroyer, { reload: 0.9, damage: 150, health: 150, pen: 150 }]),
                    TYPE: "bullet",
                    LABEL: "Devastator Primary",
                },
            },
            {
                POSITION: [7, 13, 1, 6, 0, i * 120 + 60, 0.25],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([OGg.basic, OGg.pounder, OGg.pounder, OGg.destroyer, { reload: 0.9, damage: 75, health: 75, pen: 75 }]),
                    TYPE: "bullet",
                    LABEL: "Devastator Primary",
                },
            },
                        {
                POSITION: [4.5, 5, 0.7, 7, 0, 60, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.pounder, OGg.pounder, OGg.destroyer, { damage: 65, health: 65, pen: 65, reload: 2 }, { speed: 2.5, maxSpeed: 2.2, size: 1.1, range: 30 }]),
                    TYPE: ["swarm", { INDEPENDENT: true }],
                    STAT_CALCULATOR: "swarm",
                    AUTOFIRE: true,

                },
            },
            {
                POSITION: [4, 5, 0.7, 7, 5, 60, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.pounder, OGg.pounder, OGg.destroyer, { damage: 65, health: 65, pen: 65, reload: 2 }, { speed: 2.5, maxSpeed: 2.2, size: 1.1, range: 30 }]),
                    TYPE: ["swarm", { INDEPENDENT: true }],
                    STAT_CALCULATOR: "swarm",
                    AUTOFIRE: true,

                },
            }, {
                POSITION: [4, 5, 0.7, 7, -5, 60, 1 / 4],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.pounder, OGg.pounder, OGg.destroyer, { damage: 65, health: 65, pen: 65, reload: 2 }, { speed: 2.5, maxSpeed: 2.2, size: 1.1, range: 30 }]),
                    TYPE: ["swarm", { INDEPENDENT: true }],
                    STAT_CALCULATOR: "swarm",
                    AUTOFIRE: true,
                },
            }, {
                POSITION: [3.5, 5, 0.7, 7, -2.5, 60, 2 / 4],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.pounder, OGg.pounder, OGg.destroyer, { damage: 65, health: 65, pen: 65, reload: 2 }, { speed: 2.5, maxSpeed: 2.2, size: 1.1, range: 30 }]),
                    TYPE: ["swarm", { INDEPENDENT: true }],
                    STAT_CALCULATOR: "swarm",
                    AUTOFIRE: true,
                },
            }, {
                POSITION: [3.5, 5, 0.7, 7, 2.5, 60, 3 / 4],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.pounder, OGg.pounder, OGg.destroyer, { damage: 65, health: 65, pen: 65, reload: 2 }, { speed: 2.5, maxSpeed: 2.2, size: 1.1, range: 30 }]),
                    TYPE: ["swarm", { INDEPENDENT: true }],
                    STAT_CALCULATOR: "swarm",
                    AUTOFIRE: true,
                },
            }, {
                POSITION: [3.5, 5, 0.7, 7, -7.5, 60, 2 / 4],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.pounder, OGg.pounder, OGg.destroyer, { damage: 65, health: 65, pen: 65, reload: 2 }, { speed: 2.5, maxSpeed: 2.2, size: 1.1, range: 30 }]),
                    TYPE: ["swarm", { INDEPENDENT: true }],
                    STAT_CALCULATOR: "swarm",
                    AUTOFIRE: true,
                },
            }, {
                POSITION: [3.5, 5, 0.7, 7, 7.5, 60, 3 / 4],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.pounder, OGg.pounder, OGg.destroyer, { damage: 65, health: 65, pen: 65, reload: 2 }, { speed: 2.5, maxSpeed: 2.2, size: 1.1, range: 30 }]),
                    TYPE: ["swarm", { INDEPENDENT: true }],
                    STAT_CALCULATOR: "swarm",
                    AUTOFIRE: true,
                },
            },


            {
                POSITION: [3.5, 5, 0.7, 7, 0, 60, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.pounder, OGg.pounder, OGg.destroyer, { damage: 32.5, health: 32.5, pen: 32.5, reload: 2 }, { speed: 2.5, maxSpeed: 2.2, size: 1.1, range: 30 }]),
                    TYPE: ["swarm", { INDEPENDENT: true }],
                    STAT_CALCULATOR: "swarm",
                    AUTOFIRE: true,

                },
            },
            {
                POSITION: [3, 5, 0.7, 7, 5, 60, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.pounder, OGg.pounder, OGg.destroyer, { damage: 32.5, health: 32.5, pen: 32.5, reload: 2 }, { speed: 2.5, maxSpeed: 2.2, size: 1.1, range: 30 }]),
                    TYPE: ["swarm", { INDEPENDENT: true }],
                    STAT_CALCULATOR: "swarm",
                    AUTOFIRE: true,

                },
            }, {
                POSITION: [3, 5, 0.7, 7, -5, 60, 1 / 4],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.pounder, OGg.pounder, OGg.destroyer, { damage: 32.5, health: 32.5, pen: 32.5, reload: 2 }, { speed: 2.5, maxSpeed: 2.2, size: 1.1, range: 30 }]),
                    TYPE: ["swarm", { INDEPENDENT: true }],
                    STAT_CALCULATOR: "swarm",
                    AUTOFIRE: true,
                },
            }, {
                POSITION: [2.5, 5, 0.7, 7, -2.5, 60, 2 / 4],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.pounder, OGg.pounder, OGg.destroyer, { damage: 32.5, health: 32.5, pen: 32.5, reload: 2 }, { speed: 2.5, maxSpeed: 2.2, size: 1.1, range: 30 }]),
                    TYPE: ["swarm", { INDEPENDENT: true }],
                    STAT_CALCULATOR: "swarm",
                    AUTOFIRE: true,
                },
            }, {
                POSITION: [2.5, 5, 0.7, 7, 2.5, 60, 3 / 4],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.pounder, OGg.pounder, OGg.destroyer, { damage: 32.5, health: 32.5, pen: 32.5, reload: 2 }, { speed: 2.5, maxSpeed: 2.2, size: 1.1, range: 30 }]),
                    TYPE: ["swarm", { INDEPENDENT: true }],
                    STAT_CALCULATOR: "swarm",
                    AUTOFIRE: true,
                },
            }, {
                POSITION: [2.5, 5, 0.7, 7, -7.5, 60, 2 / 4],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.pounder, OGg.pounder, OGg.destroyer, { damage: 32.5, health: 32.5, pen: 32.5, reload: 2 }, { speed: 2.5, maxSpeed: 2.2, size: 1.1, range: 30 }]),
                    TYPE: ["swarm", { INDEPENDENT: true }],
                    STAT_CALCULATOR: "swarm",
                    AUTOFIRE: true,
                },
            }, {
                POSITION: [2.5, 5, 0.7, 7, 7.5, 60, 3 / 4],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.pounder, OGg.pounder, OGg.destroyer, { damage: 32.5, health: 32.5, pen: 32.5, reload: 2 }, { speed: 2.5, maxSpeed: 2.2, size: 1.1, range: 30 }]),
                    TYPE: ["swarm", { INDEPENDENT: true }],
                    STAT_CALCULATOR: "swarm",
                    AUTOFIRE: true,
                },
            }
        ], 3),
    ],
    TURRETS: [
        {
            POSITION: [3, 0, 0, 0, 360, 1],
            TYPE: ["megahextupletGunBDN", { INDEPENDENT: true, COLOR: -1 }],
        },
        {
            POSITION: [3, 5, 8.7, 180, 360, 1],
            TYPE: ["megahextupletGunBDN", { INDEPENDENT: true, COLOR: -1 }],
        },
        {
            POSITION: [3, 5, -8.7, 60, 360, 1],
            TYPE: ["megahextupletGunBDN", { INDEPENDENT: true, COLOR: -1 }],
        },
        {
            POSITION: [3, -5, -8.7, -120, 360, 1],
            TYPE: ["megahextupletGunBDN", { INDEPENDENT: true, COLOR: -1 }],
        },
        {
            POSITION: [3, -2.2, -3.4, -60, 360, 1],
            TYPE: ["megahextupletGunBDN", { INDEPENDENT: true, COLOR: -1 }],
        },
        {
            POSITION: [3, -2.2, -3.4, 60, 360, 1],
            TYPE: ["megahextupletGunBDN", { INDEPENDENT: true, COLOR: -1 }],
        },
        {
            POSITION: [3, -2.2, -3.4, -180, 360, 1],
            TYPE: ["megahextupletGunBDN", { INDEPENDENT: true, COLOR: -1 }],
        },
        {
            POSITION: [3, -2.25, -3.5, -120, 360, 1],
            TYPE: ["megahextupletGunBDN", { INDEPENDENT: true, COLOR: -1 }],
        },
        {
            POSITION: [3, -2.25, -3.5, 120, 360, 1],
            TYPE: ["megahextupletGunBDN", { INDEPENDENT: true, COLOR: -1 }],
        },
        {
            POSITION: [3, -2.25, -3.5, 0, 360, 1],
            TYPE: ["megahextupletGunBDN", { INDEPENDENT: true, COLOR: -1 }],
        },
        {
            POSITION: [3, -6.1, -3.6, -120, 360, 1],
            TYPE: ["megahextupletGunBDN", { INDEPENDENT: true, COLOR: -1 }],
        },
        {
            POSITION: [3, -6.1, -3.6, 120, 360, 1],
            TYPE: ["megahextupletGunBDN", { INDEPENDENT: true, COLOR: -1 }],
        },
        {
            POSITION: [3, -6.1, -3.6, 0, 360, 1],
            TYPE: ["megahextupletGunBDN", { INDEPENDENT: true, COLOR: -1 }],
        },
        {
            POSITION: [3, -5.2, -4.7, 45, 360, 1],
            TYPE: ["megahextupletGunBDN", { INDEPENDENT: true, COLOR: -1 }],
        },
        {
            POSITION: [3, -5.2, -4.7, 165, 360, 1],
            TYPE: ["megahextupletGunBDN", { INDEPENDENT: true, COLOR: -1 }],
        },
        {
            POSITION: [3, -5.2, -4.7, -75, 360, 1],
            TYPE: ["megahextupletGunBDN", { INDEPENDENT: true, COLOR: -1 }],
        },
        ...weaponArray([
            {
                POSITION: [9.5, 12, 0, 0, 190, 0],
                TYPE: ["megahextupletGunBDN", { GUN_STAT_SCALE: { damage: 9.6, health: 9, speed: 9, maxSpeed: 2, resist: 1.1, range: 2.3 } }],
            }], 3),
    ]
}
Class.albinolegionaryCrasherSpawner = {
    PARENT: 'genericTank',
    SHAPE: "",
    INDEPENDENT: true,
    GUNS: [{
        POSITION: [0, 10, 0, 0, 0, 0, 10],
        PROPERTIES: {
            TYPE: 'albinodestroyerLegion',
            SHOOT_SETTINGS: combineStats([{ reload: 0.1 }]),
            NO_LIMITATIONS: true,
            INDEPENDENT_CHILDREN: true,
            MAX_CHILDREN: 1,
            IDENTIFIER: 1,
            AUTOFIRE: true,
        }
    }],
    ON: [{
        event: "fire",
        handler: ({ gun }) => {
            gun.setBulletType(["albinodestroyerLegion", "albinogunnerLegion", "albinosprayerLegion", "albinobattleshipLegion", "albinospawnerLegion"][gun.identifier++ % 5]);
        }
    }],
}
Class.albinolegionaryCrasher = {
    PARENT: ["albinoEliteBDN"],
    LABEL: "Albino Legionary Crasher",
    NAME: "Albino Legionary Crasher",
    DISPLAY_NAME: false,
    UPGRADE_COLOR: "white",
    AI: { STRAFE: false, NO_LEAD: false },
    HAS_NO_RECOIL: true,
    VALUE: 3e15,
    SIZE: 205,
    BODY: {
        FOV: 1.5,
        SPEED: 0.1 * base.SPEED,
        HEALTH: 100000000,
        DAMAGE: 2000 * base.DAMAGE,
    },
    GUNS: [
        ...weaponArray([
            {
                POSITION: [14.5, 13, 1, 0, 0, 0, 0],
            }, {
                POSITION: [3, 13, 1.7, 14.5, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([OGg.trap, OGg.setTrap, OGg.pounder, { reload: 1.8, speed: 3.2, size: 0.9, maxSpeed: 2.5, range: 1.1 }, { damage: 1458, health: 1458, pen: 1458 }]),
                    TYPE: "albinolegionaryPillbox",
                    NO_LIMITATIONS: true,
                    STAT_CALCULATOR: "trap",
                },
            },
        ], 3),
        ...weaponArray({
            POSITION: [5, 12, 1.6, -11, 0, 0, 0],
        }, 3),
    ],
    TURRETS: [
        {
            POSITION: [12, 0, 0, 0, 360, 1],
            TYPE: "albinolegionaryCrasherTop",
        },
        ...weaponArray({
            POSITION: [14, 8, 0, 60, 180, 0],
            TYPE: ["ssshyperSprayerGunBDNwithceptions", { GUN_STAT_SCALE: { speed: 2, health: 70200, damage: 6750, resist: 1.5 }, COLOR: -1 }],
        }, 3),

        {
            POSITION: [12, 0, 0, 0, 0, 0],
            TYPE: 'albinolegionaryCrasherSpawner'
        }
    ],
}
Class.albinolegionaryCrasherSpawnerFix = {
    PARENT: 'genericTank',
    SHAPE: "",
    INDEPENDENT: true,
    GUNS: [{
        POSITION: [0, 10, 0, 0, 0, 0, 10],
        PROPERTIES: {
            TYPE: 'albinodestroyerLegion',
            SHOOT_SETTINGS: combineStats([{ reload: 0.1, size: 0.75 }]),
            NO_LIMITATIONS: true,
            INDEPENDENT_CHILDREN: false,
            MAX_CHILDREN: 5,
            IDENTIFIER: 1,
            AUTOFIRE: true,
        }
    }],
    ON: [{
        event: "fire",
        handler: ({ gun }) => {
            gun.setBulletType(["albinodestroyerLegion", "albinogunnerLegion", "albinosprayerLegion", "albinobattleshipLegion", "albinospawnerLegion"][gun.identifier++ % 5]);
        }
    }],
}
Class.albinolegionaryCrasherFix = {
    PARENT: ["albinoEliteBDN"],
    LABEL: "Albino Legionary Crasher",
    NAME: "Albino Legionary Crasher",
    DISPLAY_NAME: false,
    UPGRADE_COLOR: "white",
    AI: { STRAFE: false, NO_LEAD: false },
    HAS_NO_RECOIL: true,
    VALUE: 3e15,
    SIZE: 205,
    BODY: {
        FOV: 1.5,
        SPEED: 0.1 * base.SPEED,
        HEALTH: 100000000,
        DAMAGE: 2000 * base.DAMAGE,
    },
    GUNS: [
        ...weaponArray([
            {
                POSITION: [14.5, 13, 1, 0, 0, 0, 0],
            }, {
                POSITION: [3, 13, 1.7, 14.5, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([OGg.trap, OGg.setTrap, OGg.pounder, { reload: 1.8, speed: 3.2, size: 0.9, maxSpeed: 2.5, range: 1.1 }, { damage: 1458, health: 1458, pen: 1458 }]),
                    TYPE: "albinolegionaryPillbox",
                    NO_LIMITATIONS: true,
                    STAT_CALCULATOR: "trap",
                },
            },
        ], 3),
        ...weaponArray({
            POSITION: [5, 12, 1.6, -11, 0, 0, 0],
        }, 3),
    ],
    TURRETS: [
        {
            POSITION: [12, 0, 0, 0, 360, 1],
            TYPE: "albinolegionaryCrasherTop",
        },
        ...weaponArray({
            POSITION: [14, 8, 0, 60, 180, 0],
            TYPE: ["ssshyperSprayerGunBDNwithceptions", { GUN_STAT_SCALE: { speed: 2, health: 70200, damage: 6750, resist: 1.5 }, COLOR: -1 }],
        }, 3),
        {
            POSITION: [12, 0, 0, 0, 0, 0],
            TYPE: 'albinolegionaryCrasherSpawnerFix'
        }
    ],
}
Class.albinoElitesBDN = makeMenu("Albino Elites")
Class.albinoElitesBDN.COLOR = "white"
Class.albinoElitesBDN.UPGRADE_COLOR = "white"
Class.albinoElitesBDN.UPGRADES_TIER_0 = ["albinoEliteDestroyerBDN", "albinoEliteGunnerBDN", "albinoEliteSprayerBDN", "albinoEliteBattleshipBDN", "albinoEliteSpawnerBDN", "albinoEliteTrapGuardBDN", "albinoEliteSpinnerBDN", "albinosprayerLegion", "albinolegionaryCrasher", "albinolegionaryCrasherFix"]
Class.albinoElitesBDN.SHAPE = 3.5
Class.epilepsyElitesBDN.UPGRADES_TIER_0.push("albinoElitesBDN") 

// Melanism Elites :money_mouth:

Class.megaoctupletGunBDN = {
    PARENT: "autoTankGun",
    SIZE: 50,
    GUNS: [
        {
            POSITION: [12, 7, 1, 0, -6, 0, 0.8],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.autoTurret, OGg.twin, OGg.twin, OGg.power, { reload: 1.5, speed: 3, maxspeed: 3 }, { size: 2, reload: 2, damage: 100, health: 100, pen: 100 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [12, 7, 1, 0, 6, 0, 0.8],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.autoTurret, OGg.twin, OGg.twin, OGg.power, { reload: 1.5, speed: 3, maxspeed: 3 }, { size: 2, reload: 2, damage: 100, health: 100, pen: 100 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [13, 7, 1, 0, -4.5, 0, 0.6],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.autoTurret, OGg.twin, OGg.twin, OGg.power, { reload: 1.5, speed: 3, maxspeed: 3 }, { size: 2, reload: 2, damage: 100, health: 100, pen: 100 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [13, 7, 1, 0, 4.5, 0, 0.6],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.autoTurret, OGg.twin, OGg.twin, OGg.power, { reload: 1.5, speed: 3, maxspeed: 3 }, { size: 2, reload: 2, damage: 100, health: 100, pen: 100 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [14, 7, 1, 0, -3, 0, 0.4],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.autoTurret, OGg.twin, OGg.twin, OGg.power, { reload: 1.5, speed: 3, maxspeed: 3 }, { size: 2, reload: 2, damage: 100, health: 100, pen: 100 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [14, 7, 1, 0, 3, 0, 0.4],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.autoTurret, OGg.twin, OGg.twin, OGg.power, { reload: 1.5, speed: 3, maxspeed: 3 }, { size: 2, reload: 2, damage: 100, health: 100, pen: 100 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [15, 7, 1, 0, -1.5, 0, 0.2],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.autoTurret, OGg.twin, OGg.twin, OGg.power, { reload: 1.5, speed: 3, maxspeed: 3 }, { size: 2, reload: 2, damage: 100, health: 100, pen: 100 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [15, 7, 1, 0, 1.5, 0, 0.2],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.autoTurret, OGg.twin, OGg.twin, OGg.power, { reload: 1.5, speed: 3, maxspeed: 3 }, { size: 2, reload: 2, damage: 100, health: 100, pen: 100 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [16, 7, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.autoTurret, OGg.twin, OGg.twin, OGg.power, { reload: 1.5, speed: 3, maxspeed: 3 }, { size: 2, reload: 2, damage: 100, health: 100, pen: 100 }]),
                TYPE: "bullet",
            },
        },

    ],
}

Class.melanismEliteBDN = {
    PARENT: ["miniboss"],
    LABEL: "Melanism Elite Crasher",
    COLOR: "black",
    SHAPE: 3,
    SIZE: 70,
    DANGER: 640,
    VARIES_IN_SIZE: true,
    VALUE: 1.84e10,
    BODY: {
        FOV: 1.25,
        SPEED: 0.125 * base.SPEED,
        HEALTH: 15000 * base.HEALTH,
        DAMAGE: 100 * base.DAMAGE,
        REGEN: 50 * base.REGEN,
    },
};
Class.melanismEliteDestroyerBDN = {
    PARENT: ["melanismEliteBDN"],
    UPGRADE_LABEL: "Melanism Elite Destroyer",
    UPGRADE_COLOR: "black",
    GUNS: [],
    TURRETS: [
        {
            POSITION: [11, 0, 0, 180, 360, 0],
            TYPE: ["crasherSpawnerlimited"],
        }, {
            POSITION: [11, 0, 0, 60, 360, 0],
            TYPE: ["crasherSpawnerlimited"],
        }, {
            POSITION: [11, 0, 0, -60, 360, 0],
            TYPE: ["crasherSpawnerlimited"],
        }, {
            POSITION: [11, 0, 0, 240, 360, 0],
            TYPE: ["crasherSpawnerlimited"],
        }, {
            POSITION: [11, 0, 0, 120, 360, 0],
            TYPE: ["crasherSpawnerlimited"],
        }, {
            POSITION: [11, 0, 0, 0, 360, 0],
            TYPE: ["crasherSpawnerlimited"],
        }, {
            POSITION: [11, 0, 0, 0, 360, 1],
            TYPE: ["megaoctupletGunBDN", { INDEPENDENT: true, COLOR: -1 }],
        },
    ],
};

for (let i = 0; i < 3; i++) {
    Class.melanismEliteDestroyerBDN.GUNS.push(
        {
            POSITION: [7, 16, 1, 6, 5, i * 120 + 74, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.pounder, OGg.pounder, OGg.destroyer, { reload: 0.9, damage: 250, health: 250, pen: 250 }]),
                TYPE: "bullet",
                LABEL: "Devastator Secondary",
            },
        },
        {
            POSITION: [7, 16, 1, 6, -5, i * 120 + 44, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.pounder, OGg.pounder, OGg.destroyer, { reload: 0.9, damage: 250, health: 250, pen: 250 }]),
                TYPE: "bullet",
                LABEL: "Devastator Secondary",
            },
        },
        {
            POSITION: [7, 16, 1, 6, 3, i * 120 + 67, 0.25],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.pounder, OGg.pounder, OGg.destroyer, { reload: 0.9, damage: 250, health: 250, pen: 250 }]),
                TYPE: "bullet",
                LABEL: "Devastator Secondary",
            },
        },
        {
            POSITION: [7, 16, 1, 6, -3, i * 120 + 53, 0.25],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.pounder, OGg.pounder, OGg.destroyer, { reload: 0.9, damage: 250, health: 250, pen: 250 }]),
                TYPE: "bullet",
                LABEL: "Devastator Secondary",
            },
        },
        {
            POSITION: [7, 13, 1, 6, 5, i * 120 + 74, 0.75],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.pounder, OGg.pounder, OGg.destroyer, { reload: 0.9, damage: 125, health: 125, pen: 125 }]),
                TYPE: "bullet",
                LABEL: "Devastator Secondary",
            },
        },
        {
            POSITION: [7, 13, 1, 6, -5, i * 120 + 44, 0.75],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.pounder, OGg.pounder, OGg.destroyer, { reload: 0.9, damage: 125, health: 125, pen: 125 }]),
                TYPE: "bullet",
                LABEL: "Devastator Secondary",
            },
        },
        {
            POSITION: [7, 13, 1, 6, 3, i * 120 + 67, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.pounder, OGg.pounder, OGg.destroyer, { reload: 0.9, damage: 125, health: 125, pen: 125 }]),
                TYPE: "bullet",
                LABEL: "Devastator Secondary",
            },
        },
        {
            POSITION: [7, 13, 1, 6, -3, i * 120 + 53, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.pounder, OGg.pounder, OGg.destroyer, { reload: 0.9, damage: 125, health: 125, pen: 125 }]),
                TYPE: "bullet",
                LABEL: "Devastator Secondary",
            },
        },
        {
            POSITION: [7, 13, 1, 6, 5, i * 120 + 74, 1],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.pounder, OGg.pounder, OGg.destroyer, { reload: 0.9, damage: 62.5, health: 62.5, pen: 62.5 }]),
                TYPE: "bullet",
                LABEL: "Devastator Secondary",
            },
        },
        {
            POSITION: [7, 13, 1, 6, -5, i * 120 + 44, 1],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.pounder, OGg.pounder, OGg.destroyer, { reload: 0.9, damage: 62.5, health: 62.5, pen: 62.5 }]),
                TYPE: "bullet",
                LABEL: "Devastator Secondary",
            },
        },
        {
            POSITION: [7, 13, 1, 6, 3, i * 120 + 67, 0.75],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.pounder, OGg.pounder, OGg.destroyer, { reload: 0.9, damage: 62.5, health: 62.5, pen: 62.5 }]),
                TYPE: "bullet",
                LABEL: "Devastator Secondary",
            },
        },
        {
            POSITION: [7, 13, 1, 6, -3, i * 120 + 53, 0.75],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.pounder, OGg.pounder, OGg.destroyer, { reload: 0.9, damage: 62.5, health: 62.5, pen: 62.5 }]),
                TYPE: "bullet",
                LABEL: "Devastator Secondary",
            },
        },


    )
    Class.melanismEliteDestroyerBDN.GUNS.push(
        {
            POSITION: [7, 16, 1, 6, 0, i * 120 + 60, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.pounder, OGg.pounder, OGg.destroyer, { reload: 0.9, damage: 250, health: 250, pen: 250 }]),
                TYPE: "bullet",
                LABEL: "Devastator Primary",
            },
        },
        {
            POSITION: [7, 13, 1, 6, 0, i * 120 + 60, 0.25],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.pounder, OGg.pounder, OGg.destroyer, { reload: 0.9, damage: 125, health: 125, pen: 125 }]),
                TYPE: "bullet",
                LABEL: "Devastator Primary",
            },
        },
        {
            POSITION: [7, 13, 1, 6, 0, i * 120 + 60, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.pounder, OGg.pounder, OGg.destroyer, { reload: 0.9, damage: 62.5, health: 62.5, pen: 62.5 }]),
                TYPE: "bullet",
                LABEL: "Devastator Primary",
            },
        },
    )
}






Class.sultraDriverPillboxBDN = {
    PARENT: ["setTrap"],
    LABEL: "Modified Pillbox",
    CONTROLLERS: ["nearestDifferentMaster"],
    INDEPENDENT: true,
    DIE_AT_RANGE: true,
    TURRETS: [
        {
            POSITION: [11, 0, 0, 0, 360, 1],
            TYPE: "sultraDriverPillboxTurretBDN",
        },
    ],
}

Class.sunsetultraDriverPillboxBDN = {
    PARENT: ["unsetTrap"],
    LABEL: "Modified Pillbox",
    CONTROLLERS: ["nearestDifferentMaster"],
    INDEPENDENT: true,
    DIE_AT_RANGE: true,
    TURRETS: [
        {
            POSITION: [11, 0, 0, 0, 360, 1],
            TYPE: "sultraDriverPillboxTurretBDN",
        },
    ],
}

Class.sultraDriverPillboxTurretBDN = {
    PARENT: ["autoTurret"],
    LABEL: "",
    SIZE: 100,
    BODY: {
        FOV: 2,
    },
    HAS_NO_RECOIL: true,
    GUNS: [
        {
            POSITION: [17, 7, 1, 0, 6.25, 0, 3 / 4],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.minionGun, OGg.turret, OGg.power, OGg.autoTurret, { speed: 2, maxspeed: 2 }, { reload: 2, damage: 90, health: 90, pen: 90, recoil: 0, density: 0.1 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [17, 7, 1, 0, -6.25, 0, 3 / 4],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.minionGun, OGg.turret, OGg.power, OGg.autoTurret, { speed: 2, maxspeed: 2 }, { reload: 2, damage: 90, health: 90, pen: 90, recoil: 0, density: 0.1 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [18, 7, 1, 0, 5, 0, 3 / 4],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.minionGun, OGg.turret, OGg.power, OGg.autoTurret, { speed: 2, maxspeed: 2 }, { reload: 2, damage: 90, health: 90, pen: 90, recoil: 0, density: 0.1 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [18, 7, 1, 0, -5, 0, 3 / 4],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.minionGun, OGg.turret, OGg.power, OGg.autoTurret, { speed: 2, maxspeed: 2 }, { reload: 2, damage: 90, health: 90, pen: 90, recoil: 0, density: 0.1 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [19, 7, 1, 0, 3.75, 0, 3 / 4],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.minionGun, OGg.turret, OGg.power, OGg.autoTurret, { speed: 2, maxspeed: 2 }, { reload: 2, damage: 90, health: 90, pen: 90, recoil: 0, density: 0.1 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [19, 7, 1, 0, -3.75, 0, 3 / 4],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.minionGun, OGg.turret, OGg.power, OGg.autoTurret, { speed: 2, maxspeed: 2 }, { reload: 2, damage: 90, health: 90, pen: 90, recoil: 0, density: 0.1 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [20, 7, 1, 0, 2.5, 0, 2 / 4],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.minionGun, OGg.turret, OGg.power, OGg.autoTurret, { speed: 2, maxspeed: 2 }, { reload: 2, damage: 90, health: 90, pen: 90, recoil: 0, density: 0.1 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [20, 7, 1, 0, -2.5, 0, 2 / 4],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.minionGun, OGg.turret, OGg.power, OGg.autoTurret, { speed: 2, maxspeed: 2 }, { reload: 2, damage: 90, health: 90, pen: 90, recoil: 0, density: 0.1 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [21, 7, 1, 0, 1.25, 0, 1 / 4],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.minionGun, OGg.turret, OGg.power, OGg.autoTurret, { speed: 2, maxspeed: 2 }, { reload: 2, damage: 90, health: 90, pen: 90, recoil: 0, density: 0.1 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [21, 7, 1, 0, -1.25, 0, 1 / 4],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.minionGun, OGg.turret, OGg.power, OGg.autoTurret, { speed: 2, maxspeed: 2 }, { reload: 2, damage: 90, health: 90, pen: 90, recoil: 0, density: 0.1 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [22, 7, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.minionGun, OGg.turret, OGg.power, OGg.autoTurret, { speed: 2, maxspeed: 2 }, { reload: 2, damage: 90, health: 90, pen: 90, recoil: 0, density: 0.1 }]),
                TYPE: "bullet",
            },
        },
    ],
}
Class.sshyperbrimmerGunBDN = {
    SIZE: 100,
    PARENT: ["autoTankGun"],
    GUNS: [
...weaponMirror([
        {
            POSITION: [23, 2, 1, 0, -2.5, 22.5, 2 / 3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.pelleter, OGg.power, OGg.twin, OGg.nailgun, OGg.nailgun, { speed: 8, maxspeed: 8 }, { size: 1.5, reload: 20, damage: 150, health: 150, pen: 150 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [23, 2, 1, 0, 2.5, 22.5, 2 / 3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.pelleter, OGg.power, OGg.twin, OGg.nailgun, OGg.nailgun, { speed: 8, maxspeed: 8 }, { size: 1.5, reload: 20, damage: 150, health: 150, pen: 150 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [24, 2, 1, 0, -1.25, 22.5, 1 / 3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.pelleter, OGg.power, OGg.twin, OGg.nailgun, OGg.nailgun, { speed: 8, maxspeed: 8 }, { size: 1.5, reload: 20, damage: 150, health: 150, pen: 150 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [24, 2, 1, 0, 1.25, 22.5, 1 / 3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.pelleter, OGg.power, OGg.twin, OGg.nailgun, OGg.nailgun, { speed: 8, maxspeed: 8 }, { size: 1.5, reload: 20, damage: 150, health: 150, pen: 150 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [25, 2, 1, 0, 0, 22.5, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.pelleter, OGg.power, OGg.twin, OGg.nailgun, OGg.nailgun, { speed: 8, maxspeed: 8 }, { size: 1.5, reload: 20, damage: 150, health: 150, pen: 150 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [12, 11, 1, 0, 0, 22.5, 0],
        },

        {
            POSITION: [23, 2, 1, 0, -2.5, -22.5, 2 / 3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.pelleter, OGg.power, OGg.twin, OGg.nailgun, OGg.nailgun, { speed: 8, maxspeed: 8 }, { size: 1.5, reload: 20, damage: 150, health: 150, pen: 150 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [23, 2, 1, 0, 2.5, -22.5, 2 / 3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.pelleter, OGg.power, OGg.twin, OGg.nailgun, OGg.nailgun, { speed: 8, maxspeed: 8 }, { size: 1.5, reload: 20, damage: 150, health: 150, pen: 150 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [24, 2, 1, 0, -1.25, -22.5, 1 / 3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.pelleter, OGg.power, OGg.twin, OGg.nailgun, OGg.nailgun, { speed: 8, maxspeed: 8 }, { size: 1.5, reload: 20, damage: 150, health: 150, pen: 150 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [24, 2, 1, 0, 1.25, -22.5, 1 / 3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.pelleter, OGg.power, OGg.twin, OGg.nailgun, OGg.nailgun, { speed: 8, maxspeed: 8 }, { size: 1.5, reload: 20, damage: 150, health: 150, pen: 150 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [25, 2, 1, 0, 0, -22.5, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.pelleter, OGg.power, OGg.twin, OGg.nailgun, OGg.nailgun, { speed: 8, maxspeed: 8 }, { size: 1.5, reload: 20, damage: 150, health: 150, pen: 150 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [12, 11, 1, 0, 0, -22.5, 0],
        },

        {
            POSITION: [23, 2, 1, 0, -2.5, 0, 2 / 3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.pelleter, OGg.power, OGg.twin, OGg.nailgun, OGg.nailgun, { speed: 8, maxspeed: 8 }, { size: 1.5, reload: 20, damage: 150, health: 150, pen: 150 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [23, 2, 1, 0, 2.5, 0, 2 / 3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.pelleter, OGg.power, OGg.twin, OGg.nailgun, OGg.nailgun, { speed: 8, maxspeed: 8 }, { size: 1.5, reload: 20, damage: 150, health: 150, pen: 150 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [24, 2, 1, 0, -1.25, 0, 1 / 3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.pelleter, OGg.power, OGg.twin, OGg.nailgun, OGg.nailgun, { speed: 8, maxspeed: 8 }, { size: 1.5, reload: 20, damage: 150, health: 150, pen: 150 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [24, 2, 1, 0, 1.25, 0, 1 / 3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.pelleter, OGg.power, OGg.twin, OGg.nailgun, OGg.nailgun, { speed: 8, maxspeed: 8 }, { size: 1.5, reload: 20, damage: 150, health: 150, pen: 150 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [25, 2, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.pelleter, OGg.power, OGg.twin, OGg.nailgun, OGg.nailgun, { speed: 8, maxspeed: 8 }, { size: 1.5, reload: 20, damage: 150, health: 150, pen: 150 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [12, 11, 1, 0, 0, 0, 0],
        },



        {
            POSITION: [23, 2, 1, 0, -2.5, 45, 2 / 3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.pelleter, OGg.power, OGg.twin, OGg.nailgun, OGg.nailgun, { speed: 8, maxspeed: 8 }, { size: 1.5, reload: 20, damage: 150, health: 150, pen: 150 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [23, 2, 1, 0, 2.5, 45, 2 / 3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.pelleter, OGg.power, OGg.twin, OGg.nailgun, OGg.nailgun, { speed: 8, maxspeed: 8 }, { size: 1.5, reload: 20, damage: 150, health: 150, pen: 150 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [24, 2, 1, 0, -1.25, 45, 1 / 3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.pelleter, OGg.power, OGg.twin, OGg.nailgun, OGg.nailgun, { speed: 8, maxspeed: 8 }, { size: 1.5, reload: 20, damage: 150, health: 150, pen: 150 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [24, 2, 1, 0, 1.25, 45, 1 / 3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.pelleter, OGg.power, OGg.twin, OGg.nailgun, OGg.nailgun, { speed: 8, maxspeed: 8 }, { size: 1.5, reload: 20, damage: 150, health: 150, pen: 150 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [25, 2, 1, 0, 0, 45, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.pelleter, OGg.power, OGg.twin, OGg.nailgun, OGg.nailgun, { speed: 8, maxspeed: 8 }, { size: 1.5, reload: 20, damage: 150, health: 150, pen: 150 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [12, 11, 1, 0, 0, 0, 0],
        },



        {
            POSITION: [15, 8, 1, 0, -5, -22.5, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, { shudder: 0.5, spread: 0.5 }, { speed: 2, maxspeed: 2 }, { size: 1.5, reload: 1, damage: 90, health: 90, pen: 90 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [15, 8, 1, 0, 5, 22.5, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, { shudder: 0.5, spread: 0.5 }, { speed: 2, maxspeed: 2 }, { size: 1.5, reload: 1, damage: 90, health: 90, pen: 90 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [15, 8, 1, 0, -5, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, { shudder: 0.5, spread: 0.5 }, { speed: 2, maxspeed: 2 }, { size: 1.5, reload: 1, damage: 90, health: 90, pen: 90 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [15, 8, 1, 0, 5, 11, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, { shudder: 0.5, spread: 0.5 }, { speed: 2, maxspeed: 2 }, { size: 1.5, reload: 1, damage: 90, health: 90, pen: 90 }]),
                TYPE: "bullet",
            },
        },

    ])]
}
Class.melanismEliteGunnerBDN = {
    PARENT: ["melanismEliteBDN"],
    UPGRADE_LABEL: "Albino Elite Gunner",
    UPGRADE_COLOR: "black",
    FACING_TYPE: "toTarget",
    GUNS: [
        {
            POSITION: [14, 16, 1, 0, 0, 180, 0],
        },
        {
            POSITION: [14, 13, 1, 0, 0, 180, 0],
        }, {
            POSITION: [4, 16, 1.5, 14, 0, 180, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.trap, OGg.hexaTrapper, OGg.setTrap, OGg.setTrap, { reload: 0.8, damage: 108, health: 108, pen: 108 }]),
                TYPE: ["sunsetultraDriverPillboxBDN", { MOTION_TYPE: "glide" }],
                STAT_CALCULATOR: "trap",
            },
        },
        {
            POSITION: [4, 13, 1.5, 14, 0, 180, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.trap, OGg.hexaTrapper, OGg.setTrap, { reload: 0.8, range: 0, damage: 0 }]),
                TYPE: "bullet",
            },
        }, {
            POSITION: [6, 14, -2, 2, 0, 60, 0],
        }, {
            POSITION: [6, 14, -2, 2, 0, 300, 0],
        }, {
            POSITION: [6, 14, -2, 2, 0, 55, 0],
        }, {
            POSITION: [6, 14, -2, 2, 0, 305, 0],
        },
    ],
    AI: { NO_LEAD: false },
    TURRETS: [
        {
            POSITION: [14, 8, 0, 60, 180, 0],
            TYPE: ["sshyperbrimmerGunBDN"],
        }, {
            POSITION: [14, 8, 0, 300, 180, 0],
            TYPE: ["sshyperbrimmerGunBDN"],
        },
    ],
};
Class.shypersprayerDodecagrammataTurretBDN = {
    PARENT: ["genericTank"],
    LABEL: "Sprayer",
    BODY: { FOV: 2 },
    CONTROLLERS: [["spin", { speed: 0.04 }]],
    INDEPENDENT: true,
    COLOR: -1,
    GUNS: [
        {
            POSITION: [20, 11, 0.6, 8, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.machineGun, OGg.lowPower, OGg.flankGuard, { reload: 4, damage: 200, health: 200, pen: 200 }]),
                TYPE: "bullet",
                AUTOFIRE: true,
            },
        }, {
            POSITION: [20, 11, 0.6, 8, 0, 90, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.machineGun, OGg.lowPower, OGg.flankGuard, { reload: 4, damage: 200, health: 200, pen: 200 }]),
                TYPE: "bullet",
                AUTOFIRE: true,
            },
        }, {
            POSITION: [20, 11, 0.6, 8, 0, 180, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.machineGun, OGg.lowPower, OGg.flankGuard, { reload: 4, damage: 200, health: 200, pen: 200 }]),
                TYPE: "bullet",
                AUTOFIRE: true,
            },
        }, {
            POSITION: [20, 11, 0.6, 8, 0, 270, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.machineGun, OGg.lowPower, OGg.flankGuard, { reload: 4, damage: 200, health: 200, pen: 200 }]),
                TYPE: "bullet",
                AUTOFIRE: true,
            },
        },
        {
            POSITION: [16, 12, 1, 8, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.machineGun, OGg.lowPower, OGg.flankGuard, { reload: 4, damage: 200, health: 200, pen: 200 }]),
                TYPE: "bullet",
                AUTOFIRE: true,
            },
        }, {
            POSITION: [16, 12, 1, 8, 0, 90, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.machineGun, OGg.lowPower, OGg.flankGuard, { reload: 4, damage: 200, health: 200, pen: 200 }]),
                TYPE: "bullet",
                AUTOFIRE: true,
            },
        }, {
            POSITION: [16, 12, 1, 8, 0, 180, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.machineGun, OGg.lowPower, OGg.flankGuard, { reload: 4, damage: 200, health: 200, pen: 200 }]),
                TYPE: "bullet",
                AUTOFIRE: true,
            },
        }, {
            POSITION: [16, 12, 1, 8, 0, 270, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.machineGun, OGg.lowPower, OGg.flankGuard, { reload: 4, damage: 200, health: 200, pen: 200 }]),
                TYPE: "bullet",
                AUTOFIRE: true,
            },
        },
        {
            POSITION: [12, 13, 1.4, 8, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.machineGun, OGg.flankGuard, { reload: 4, damage: 200, health: 200, pen: 200 }]),
                TYPE: "bullet",
                AUTOFIRE: true,
            },
        }, {
            POSITION: [12, 13, 1.4, 8, 0, 90, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.machineGun, OGg.flankGuard, { reload: 4, damage: 200, health: 200, pen: 200 }]),
                TYPE: "bullet",
                AUTOFIRE: true,
            },
        }, {
            POSITION: [12, 13, 1.4, 8, 0, 180, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.machineGun, OGg.flankGuard, { reload: 4, damage: 200, health: 200, pen: 200 }]),
                TYPE: "bullet",
                AUTOFIRE: true,
            },
        }, {
            POSITION: [12, 13, 1.4, 8, 0, 270, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.machineGun, OGg.flankGuard, { reload: 4, damage: 200, health: 200, pen: 200 }]),
                TYPE: "bullet",
                AUTOFIRE: true,
            },
        },

        {
            POSITION: [8, 15, 1.4, 8, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.machineGun, OGg.flankGuard, OGg.highPower, { reload: 4, damage: 200, health: 200, pen: 200}]),
                TYPE: "bullet",
                AUTOFIRE: true,
            },
        }, {
            POSITION: [8, 15, 1.4, 8, 0, 90, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.machineGun, OGg.flankGuard, OGg.highPower, { reload: 4, damage: 200, health: 200, pen: 200 }]),
                TYPE: "bullet",
                AUTOFIRE: true,
            },
        }, {
            POSITION: [8, 15, 1.4, 8, 0, 180, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.machineGun, OGg.flankGuard, OGg.highPower, { reload: 4, damage: 200, health: 200, pen: 200 }]),
                TYPE: "bullet",
                AUTOFIRE: true,
            },
        }, {
            POSITION: [8, 15, 1.4, 8, 0, 270, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.machineGun, OGg.flankGuard, OGg.highPower, { reload: 4, damage: 200, health: 200, pen: 200 }]),
                TYPE: "bullet",
                AUTOFIRE: true,
            },
        },
        {
            POSITION: [20, 11, 0.6, 8, 0, 45, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.machineGun, OGg.lowPower, OGg.flankGuard, { reload: 4, damage: 200, health: 200, pen: 200 }]),
                TYPE: "bullet",
                AUTOFIRE: true,
            },
        }, {
            POSITION: [20, 11, 0.6, 8, 0, 135, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.machineGun, OGg.lowPower, OGg.flankGuard, { reload: 4, damage: 200, health: 200, pen: 200 }]),
                TYPE: "bullet",
                AUTOFIRE: true,
            },
        }, {
            POSITION: [20, 11, 0.6, 8, 0, 225, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.machineGun, OGg.lowPower, OGg.flankGuard, { reload: 4, damage: 200, health: 200, pen: 200 }]),
                TYPE: "bullet",
                AUTOFIRE: true,
            },
        }, {
            POSITION: [20, 11, 0.6, 8, 0, 315, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.machineGun, OGg.lowPower, OGg.flankGuard, { reload: 4, damage: 200, health: 200, pen: 200 }]),
                TYPE: "bullet",
                AUTOFIRE: true,
            },
        },
        {
            POSITION: [16, 12, 1, 8, 0, 45, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.machineGun, OGg.lowPower, OGg.flankGuard, { reload: 4, damage: 200, health: 200, pen: 200 }]),
                TYPE: "bullet",
                AUTOFIRE: true,
            },
        }, {
            POSITION: [16, 12, 1, 8, 0, 135, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.machineGun, OGg.lowPower, OGg.flankGuard, { reload: 4, damage: 200, health: 200, pen: 200 }]),
                TYPE: "bullet",
                AUTOFIRE: true,
            },
        }, {
            POSITION: [16, 12, 1, 8, 0, 225, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.machineGun, OGg.lowPower, OGg.flankGuard, { reload: 4, damage: 200, health: 200, pen: 200 }]),
                TYPE: "bullet",
                AUTOFIRE: true,
            },
        }, {
            POSITION: [16, 12, 1, 8, 0, 315, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.machineGun, OGg.lowPower, OGg.flankGuard, { reload: 4, damage: 200, health: 200, pen: 200 }]),
                TYPE: "bullet",
                AUTOFIRE: true,
            },
        },
        {
            POSITION: [12, 13, 1.4, 8, 0, 45, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.machineGun, OGg.flankGuard, { reload: 4, damage: 200, health: 200, pen: 200 }]),
                TYPE: "bullet",
                AUTOFIRE: true,
            },
        }, {
            POSITION: [12, 13, 1.4, 8, 0, 135, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.machineGun, OGg.flankGuard, { reload: 4, damage: 200, health: 200, pen: 200 }]),
                TYPE: "bullet",
                AUTOFIRE: true,
            },
        }, {
            POSITION: [12, 13, 1.4, 8, 0, 225, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.machineGun, OGg.flankGuard, { reload: 4, damage: 200, health: 200, pen: 200 }]),
                TYPE: "bullet",
                AUTOFIRE: true,
            },
        }, {
            POSITION: [12, 13, 1.4, 8, 0, 315, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.machineGun, OGg.flankGuard, { reload: 4, damage: 200, health: 200, pen: 200 }]),
                TYPE: "bullet",
                AUTOFIRE: true,
            },
        },

        {
            POSITION: [8, 15, 1.4, 8, 0, 45, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.machineGun, OGg.flankGuard, OGg.highPower, { reload: 4, damage: 200, health: 200, pen: 200}]),
                TYPE: "bullet",
                AUTOFIRE: true,
            },
        }, {
            POSITION: [8, 15, 1.4, 8, 0, 135, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.machineGun, OGg.flankGuard, OGg.highPower, { reload: 4, damage: 200, health: 200, pen: 200 }]),
                TYPE: "bullet",
                AUTOFIRE: true,
            },
        }, {
            POSITION: [8, 15, 1.4, 8, 0, 225, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.machineGun, OGg.flankGuard, OGg.highPower, { reload: 4, damage: 200, health: 200, pen: 200 }]),
                TYPE: "bullet",
                AUTOFIRE: true,
            },
        }, {
            POSITION: [8, 15, 1.4, 8, 0, 315, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.machineGun, OGg.flankGuard, OGg.highPower, { reload: 4, damage: 200, health: 200, pen: 200 }]),
                TYPE: "bullet",
                AUTOFIRE: true,
            },
        },
    ],
}
Class.sultraSprayerGunBDN = {
    PARENT: ["autoTankGun"],
    GUNS:
        [
            {
                POSITION: [35, 12.2, 1.4, 0, 0, 0, 0.5],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([OGg.basic, OGg.machineGun, OGg.pounder, OGg.destroyer, OGg.lowPower, { reload: 1.1, damage: 324, health: 324, pen: 324, recoil: 0 }]),
                    TYPE: "bullet",
                },
            },
            {
                POSITION: [30, 14.4, 1.4, 0, 0, 0, 0.5],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([OGg.basic, OGg.machineGun, OGg.pounder, OGg.destroyer, OGg.lowPower, { reload: 1.1, damage: 388.8, health: 388.8, pen: 388.8, recoil: 0 }]),
                    TYPE: "bullet",
                },
            },
            {
                POSITION: [25, 16.6, 1.4, 0, 0, 0, 0.5],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([OGg.basic, OGg.machineGun, OGg.pounder, OGg.destroyer, OGg.lowPower, { reload: 1.1, damage: 466.56, health: 466.56, pen: 466.56, recoil: 0 }]),
                    TYPE: "bullet",
                },
            },
            {
                POSITION: [20, 18.8, 1.4, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([OGg.basic, OGg.machineGun, OGg.pounder, OGg.destroyer, OGg.lowPower, { reload: 1.1, damage: 559.872, health: 559.872, pen: 559.872, recoil: 0 }]),
                    TYPE: "bullet",
                },
            },
            {
                POSITION: [15, 20, 1.4, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([OGg.basic, OGg.machineGun, OGg.pounder, OGg.destroyer, OGg.lowPower, { reload: 1.1, damage: 671.85, health: 671.85, pen: 671.85, recoil: 0 }]),
                    TYPE: "bullet",
                },
            },
        ],
};
Class.melanismEliteSprayerBDN = {
    PARENT: ["melanismEliteBDN"],
    UPGRADE_LABEL: "Melanism Elite Sprayer",
    UPGRADE_COLOR: "black",
    SKILL: skillSet({
        rld: 0.7,
        dam: 0.5,
        pen: 0.8,
        str: 0.8,
        spd: 0.2,
        atk: 0.3,
        hlt: 1,
        shi: 0.7,
        rgn: 0.7,
        mob: 1,
    }),
    AI: { NO_LEAD: false },
    HAS_NO_RECOIL: true,
    GUNS: [],
    TURRETS: [
        {
            /*    SIZE         X             Y         ANGLE        ARC */
            POSITION: [6.5, 0, 0, 0, 360, 1],
            TYPE: ["shypersprayerDodecagrammataTurretBDN", { INDEPENDENT: true }],
        }, {
            POSITION: [9, 6, -7, 180, 130, 0],
            TYPE: ["sultraSprayerGunBDN", { COLOR: "grey" }],
        }, {
            POSITION: [9, 6, 7, 180, 130, 0],
            TYPE: ["sultraSprayerGunBDN", { COLOR: "grey" }],
        }, {
            POSITION: [9, 6, 7, 60, 130, 0],
            TYPE: ["sultraSprayerGunBDN", { COLOR: "grey" }],
        }, {
            POSITION: [9, 6, -7, 60, 130, 0],
            TYPE: ["sultraSprayerGunBDN", { COLOR: "grey" }],
        }, {
            POSITION: [9, 6, 7, -60, 130, 0],
            TYPE: ["sultraSprayerGunBDN", { COLOR: "grey" }],
        }, {
            POSITION: [9, 6, -7, -60, 130, 0],
            TYPE: ["sultraSprayerGunBDN", { COLOR: "grey" }],
        },
    ],
};
Class.sultracarrierBDN = {
    PARENT: "autoTankGun",
    LABEL: "",
    STAT_NAMES: statnames.swarm,
    FACING_TYPE: "locksFacing",
    BODY: {
        FOV: base.FOV * 1.2,
    },
    GUNS: [
        {
            POSITION: [16, 8, 1.4, 7, 0, 45, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.battleship, OGg.carrier, { size: 3, reload: 3, damage: 1440, health: 1440, pen: 1440 }]),
                TYPE: "swarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [16, 8, 1.4, 7, 0, 135, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.battleship, OGg.carrier, { size: 3, reload: 3, damage: 1440, health: 1440, pen: 1440 }]),
                TYPE: "swarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [16, 8, 1.4, 7, 0, -135, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.battleship, OGg.carrier, { size: 3, reload: 3, damage: 1440, health: 1440, pen: 1440 }]),
                TYPE: "swarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [16, 8, 1.4, 7, 0, -45, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.battleship, OGg.carrier, { size: 3, reload: 3, damage: 1440, health: 1440, pen: 1440 }]),
                TYPE: "swarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [16, 8, 1.4, 7, 0, 90, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.battleship, OGg.carrier, { size: 3, reload: 3, damage: 1440, health: 1440, pen: 1440 }]),
                TYPE: "swarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [16, 8, 1.4, 7, 0, -90, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.battleship, OGg.carrier, { size: 3, reload: 3, damage: 1440, health: 1440, pen: 1440 }]),
                TYPE: "swarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [16, 8, 1.4, 7, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.battleship, OGg.carrier, { size: 3, reload: 3, damage: 1440, health: 1440, pen: 1440 }]),
                TYPE: "swarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [16, 8, 1.4, 7, 0, 180, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.battleship, OGg.carrier, { size: 3, reload: 3, damage: 1440, health: 1440, pen: 1440 }]),
                TYPE: "swarm",
                STAT_CALCULATOR: "swarm",
            },
        },




        {
            POSITION: [16, 8, 1.4, 7, 0, 67.5, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.battleship, OGg.carrier, { size: 3, reload: 3, damage: 1440, health: 1440, pen: 1440 }]),
                TYPE: "swarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [16, 8, 1.4, 7, 0, 157.5, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.battleship, OGg.carrier, { size: 3, reload: 3, damage: 1440, health: 1440, pen: 1440 }]),
                TYPE: "swarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [16, 8, 1.4, 7, 0, -157.5, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.battleship, OGg.carrier, { size: 3, reload: 3, damage: 1440, health: 1440, pen: 1440 }]),
                TYPE: "swarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [16, 8, 1.4, 7, 0, -67.5, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.battleship, OGg.carrier, { size: 3, reload: 3, damage: 1440, health: 1440, pen: 1440 }]),
                TYPE: "swarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [16, 8, 1.4, 7, 0, 112.5, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.battleship, OGg.carrier, { size: 3, reload: 3, damage: 1440, health: 1440, pen: 1440 }]),
                TYPE: "swarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [16, 8, 1.4, 7, 0, -112.5, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.battleship, OGg.carrier, { size: 3, reload: 3, damage: 1440, health: 1440, pen: 1440 }]),
                TYPE: "swarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [16, 8, 1.4, 7, 0, 22.5, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.battleship, OGg.carrier, { size: 3, reload: 3, damage: 1440, health: 1440, pen: 1440 }]),
                TYPE: "swarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [16, 8, 1.4, 7, 0, -22.5, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.battleship, OGg.carrier, { size: 3, reload: 3, damage: 1440, health: 1440, pen: 1440 }]),
                TYPE: "swarm",
                STAT_CALCULATOR: "swarm",
            },
        },

    ],
}
Class.melanismEliteBattleshipBDN = {
    PARENT: ["melanismEliteBDN"],
    UPGRADE_LABEL: "Melanism Elite Battleship",
    UPGRADE_COLOR: "black",
    GUNS: [],
    TURRETS: [
        {
            POSITION: [5, 7.5, 0, 0, 360, 1],
            TYPE: "sultracarrierBDN",
        }, {
            POSITION: [5, 7.5, 0, 120, 360, 1],
            TYPE: "sultracarrierBDN",
        }, {
            POSITION: [5, 7.5, 0, 240, 360, 1],
            TYPE: "sultracarrierBDN",
        },
        ...weaponArray({
            POSITION: [5, 25, 0, 0, 190, 1],
            TYPE: ["sultracarrierBDN", { GUN_STAT_SCALE: { size: 3, reload: 3, health: 3000, damage: 3000, pen: 3000 }, COLOR: -1 }],
        }, 6)
    ],
};
for (i = 0; i < 3; i++) {
    Class.melanismEliteBattleshipBDN.GUNS.push(

        {
            POSITION: [3, 2, 0.6, 7, -13, i * 120 - 60, 2 / 3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.battleship, { size: 3, reload: 3, damage: 15000, health: 15000, pen: 15000 }]),
                TYPE: "autoswarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [3, 2, 0.6, 7, 13, i * 120 - 60, 2 / 3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.battleship, { size: 3, reload: 3, damage: 15000, health: 15000, pen: 15000 }]),
                TYPE: "autoswarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [3, 2, 0.6, 7, -5, i * 120 - 60, 2 / 3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.battleship, { size: 3, reload: 3, damage: 15000, health: 15000, pen: 15000 }]),
                TYPE: "autoswarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [3, 2, 0.6, 7, 5, i * 120 - 60, 2 / 3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.battleship, { size: 3, reload: 3, damage: 15000, health: 15000, pen: 15000 }]),
                TYPE: "autoswarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [3, 2, 0.6, 7, 3.75, i * 120 - 60, 2 / 3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.battleship, { size: 3, reload: 3, damage: 15000, health: 15000, pen: 15000 }]),
                TYPE: "autoswarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [3, 2, 0.6, 7, -3.75, i * 120 - 60, 2 / 3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.battleship, { size: 3, reload: 3, damage: 15000, health: 15000, pen: 15000 }]),
                TYPE: "autoswarm",
                STAT_CALCULATOR: "swarm",
            },
        },






        {
            POSITION: [4, 4, 0.6, 7, -11, i * 120 - 60, 1 / 3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.battleship, { size: 3, reload: 3, damage: 22500, health: 22500, pen: 22500 }]),
                TYPE: "autoswarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [4, 4, 0.6, 7, 11, i * 120 - 60, 1 / 3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.battleship, { size: 3, reload: 3, damage: 22500, health: 22500, pen: 22500 }]),
                TYPE: "autoswarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [4, 4, 0.6, 7, -7, i * 120 - 60, 1 / 3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.battleship, { size: 3, reload: 3, damage: 22500, health: 22500, pen: 22500 }]),
                TYPE: "autoswarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [4, 4, 0.6, 7, 7, i * 120 - 60, 1 / 3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.battleship, { size: 3, reload: 3, damage: 22500, health: 22500, pen: 22500 }]),
                TYPE: "autoswarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [4, 4, 0.6, 7, 1.5, i * 120 - 60, 1 / 3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.battleship, { size: 3, reload: 3, damage: 22500, health: 22500, pen: 22500 }]),
                TYPE: "autoswarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [4, 4, 0.6, 7, -1.5, i * 120 - 60, 1 / 3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.battleship, { size: 3, reload: 3, damage: 22500, health: 22500, pen: 22500 }]),
                TYPE: "autoswarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [5, 5, 0.6, 7, 0, i * 120 - 60, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.battleship, { size: 3, reload: 3, damage: 30000, health: 30000, pen: 30000 }]),
                TYPE: "autoswarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [5, 5, 0.6, 7, -9, i * 120 - 60, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.battleship, { size: 3, reload: 3, damage: 30000, health: 30000, pen: 30000 }]),
                TYPE: "autoswarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [5, 5, 0.6, 7, 9, i * 120 - 60, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.battleship, { size: 3, reload: 3, damage: 30000, health: 30000, pen: 30000 }]),
                STAT_CALCULATOR: "swarm",
            },
        },
    )
}
Class.melanismSentryBDN = {
    PARENT: ["sentry"],
    COLOR: "black",
    UPGRADE_COLOR: "black",
    DANGER: 4,
    SIZE: 60,
    VALUE: 2e10,
    SHAPE: 3,
    BODY: {
        HEALTH: 500 * base.HEALTH
    },
};
Class.melanismSentrySwarmBDN = {
    PARENT: ["melanismSentryBDN"],
    UPGRADE_LABEL: "Melanism Swarm Sentry",
    UPGRADE_COLOR: "black",
    GUNS: [
        {
            POSITION: [7, 9, 0.6, 7, -7.5, 60, 3 / 4],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, { recoil: 0.1 }, { reload: 1, damage: 1020, health: 1020, pen: 1020 }]),
                TYPE: "swarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [7, 9, 0.6, 7, 7.5, 300, 3 / 4],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, { recoil: 0.1 }, { reload: 1, damage: 1020, health: 1020, pen: 1020 }]),
                TYPE: "swarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [7, 9, 0.6, 7, -5.75, 60, 3 / 4],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, { recoil: 0.1 }, { reload: 1, damage: 1020, health: 1020, pen: 1020 }]),
                TYPE: "swarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [7, 9, 0.6, 7, 5.75, 300, 3 / 4],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, { recoil: 0.1 }, { reload: 1, damage: 1020, health: 1020, pen: 1020 }]),
                TYPE: "swarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [7, 9, 0.6, 7, 7.5, 60, 3 / 4],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, { recoil: 0.1 }, { reload: 1, damage: 1020, health: 1020, pen: 1020 }]),
                TYPE: "swarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [7, 9, 0.6, 7, -7.5, 300, 3 / 4],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, { recoil: 0.1 }, { reload: 1, damage: 1020, health: 1020, pen: 1020 }]),
                TYPE: "swarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [7, 9, 0.6, 7, 5.75, 60, 3 / 4],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, { recoil: 0.1 }, { reload: 1, damage: 1020, health: 1020, pen: 1020 }]),
                TYPE: "swarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [7, 9, 0.6, 7, -5.75, 300, 3 / 4],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, { recoil: 0.1 }, { reload: 1, damage: 1020, health: 1020, pen: 1020 }]),
                TYPE: "swarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [7, 9, 0.6, 7, -4, 60, 2 / 4],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, { recoil: 0.1 }, { reload: 1, damage: 1020, health: 1020, pen: 1020 }]),
                TYPE: "swarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [7, 9, 0.6, 7, 4, 300, 2 / 4],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, { recoil: 0.1 }, { reload: 1, damage: 1020, health: 1020, pen: 1020 }]),
                TYPE: "swarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [7, 9, 0.6, 7, 3.75, 60, 2 / 4],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, { recoil: 0.1 }, { reload: 1, damage: 1020, health: 1020, pen: 1020 }]),
                TYPE: "swarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [7, 9, 0.6, 7, -3.75, 300, 2 / 4],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, { recoil: 0.1 }, { reload: 1, damage: 1020, health: 1020, pen: 1020 }]),
                TYPE: "swarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [7, 9, 0.6, 7, 4, 60, 2 / 4],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, { recoil: 0.1 }, { reload: 1, damage: 1020, health: 1020, pen: 1020 }]),
                TYPE: "swarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [7, 9, 0.6, 7, -4, 300, 2 / 4],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, { recoil: 0.1 }, { reload: 1, damage: 1020, health: 1020, pen: 1020 }]),
                TYPE: "swarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [7, 9, 0.6, 7, 2.5, 60, 1 / 4],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, { recoil: 0.1 }, { reload: 1, damage: 1020, health: 1020, pen: 1020 }]),
                TYPE: "swarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [7, 9, 0.6, 7, -2.5, 300, 1 / 4],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, { recoil: 0.1 }, { reload: 1, damage: 1020, health: 1020, pen: 1020 }]),
                TYPE: "swarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [7, 9, 0.6, 7, 1.25, 60, 1 / 4],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, { recoil: 0.1 }, { reload: 1, damage: 1020, health: 1020, pen: 1020 }]),
                TYPE: "swarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [7, 9, 0.6, 7, -1.25, 300, 1 / 4],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, { recoil: 0.1 }, { reload: 1, damage: 1020, health: 1020, pen: 1020 }]),
                TYPE: "swarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [7, 9, 0.6, 7, -2.5, 60, 1 / 4],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, { recoil: 0.1 }, { reload: 1, damage: 1020, health: 1020, pen: 1020 }]),
                TYPE: "swarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [7, 9, 0.6, 7, 2.5, 300, 1 / 4],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, { recoil: 0.1 }, { reload: 1, damage: 1020, health: 1020, pen: 1020 }]),
                TYPE: "swarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [7, 9, 0.6, 7, -1.25, 60, 1 / 4],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, { recoil: 0.1 }, { reload: 1, damage: 1020, health: 1020, pen: 1020 }]),
                TYPE: "swarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [7, 9, 0.6, 7, 1.25, 300, 1 / 4],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, { recoil: 0.1 }, { reload: 1, damage: 1020, health: 1020, pen: 1020 }]),
                TYPE: "swarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [7, 9, 0.6, 7, 0, 60, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, { recoil: 0.1 }, { reload: 1, damage: 1020, health: 1020, pen: 1020 }]),
                TYPE: "swarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [7, 9, 0.6, 7, 0, 300, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, { recoil: 0.1 }, { reload: 1, damage: 1020, health: 1020, pen: 1020 }]),
                TYPE: "swarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [6, 13, 1.3, 7, -5, 180, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, { recoil: 1.15 }, OGg.machineGun, { reload: 0.6, damage: 945, health: 945, pen: 945 }]),
                TYPE: "swarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [6, 13, 1.3, 7, 5, 180, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, { recoil: 1.15 }, OGg.machineGun, { reload: 0.6, damage: 945, health: 945, pen: 945 }]),
                TYPE: "swarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [6, 13, 1.3, 7, -3.75, 180, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, { recoil: 1.15 }, OGg.machineGun, { reload: 0.6, damage: 945, health: 945, pen: 945 }]),
                TYPE: "swarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [6, 13, 1.3, 7, 3.75, 180, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, { recoil: 1.15 }, OGg.machineGun, { reload: 0.6, damage: 945, health: 945, pen: 945 }]),
                TYPE: "swarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [6, 13, 1.3, 7, -2.5, 180, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, { recoil: 1.15 }, OGg.machineGun, { reload: 0.6, damage: 945, health: 945, pen: 945 }]),
                TYPE: "swarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [6, 13, 1.3, 7, 2.5, 180, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, { recoil: 1.15 }, OGg.machineGun, { reload: 0.6, damage: 945, health: 945, pen: 945 }]),
                TYPE: "swarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [6, 13, 1.3, 7, -1.25, 180, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, { recoil: 1.15 }, OGg.machineGun, { reload: 0.6, damage: 945, health: 945, pen: 945 }]),
                TYPE: "swarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [6, 13, 1.3, 7, 1.25, 180, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, { recoil: 1.15 }, OGg.machineGun, { reload: 0.6, damage: 945, health: 945, pen: 945 }]),
                TYPE: "swarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [6, 13, 1.3, 7, 0, 180, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, { recoil: 1.15 }, OGg.machineGun, { reload: 0.6, damage: 945, health: 945, pen: 945 }]),
                TYPE: "swarm",
                STAT_CALCULATOR: "swarm",
            },
        },

    ],
};
Class.ssuperpetabarricaderAutoTankGunBDN = {
    PARENT: ["genericTank"],
    LABEL: "Turret",
    BODY: {
        FOV: 0.5,
    },
    INDEPENDENT: true,
    CONTROLLERS: ["nearestDifferentMaster"],
    COLOR: "grey",
    AI: {
        SKYNET: true,
        FULL_VIEW: true,
    },
    GUNS: [
        {
            POSITION: [24, 18, 1, 0, 0, 0, 0],
        },
        {
            POSITION: [4, 18, 1, 2, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.trap, OGg.minigun, { range: 0.6 }, { reload: 2, damage: 750, health: 750, pen: 750 }]),
                TYPE: "trap",
                STAT_CALCULATOR: "trap",
            },
        },
        {
            POSITION: [4, 18, 1.3, 36, 0, 0, 1 / 6],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.trap, OGg.minigun, { range: 0.6 }, { reload: 2, damage: 750, health: 750, pen: 750 }]),
                TYPE: "trap",
                STAT_CALCULATOR: "trap",
            },
        },
        {
            POSITION: [4, 18, 1.3, 34, 0, 0, 1 / 6],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.trap, OGg.minigun, { range: 0.6 }, { reload: 2, damage: 750, health: 750, pen: 750 }]),
                TYPE: "trap",
                STAT_CALCULATOR: "trap",
            },
        },
        {
            POSITION: [4, 18, 1.3, 32, 0, 0, 1 / 6],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.trap, OGg.minigun, { range: 0.6 }, { reload: 2, damage: 750, health: 750, pen: 750 }]),
                TYPE: "trap",
                STAT_CALCULATOR: "trap",
            },
        },
        {
            POSITION: [4, 18, 1.3, 30, 0, 0, 1 / 6],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.trap, OGg.minigun, { range: 0.6 }, { reload: 2, damage: 750, health: 750, pen: 750 }]),
                TYPE: "trap",
                STAT_CALCULATOR: "trap",
            },
        },
        {
            POSITION: [4, 18, 1.3, 28, 0, 0, 5 / 6],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.trap, OGg.minigun, { range: 0.6 }, { reload: 2, damage: 750, health: 750, pen: 750 }]),
                TYPE: "trap",
                STAT_CALCULATOR: "trap",
            },
        },
        {
            POSITION: [4, 18, 1.3, 26, 0, 0, 2 / 6],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.trap, OGg.minigun, { range: 0.6 }, { reload: 2, damage: 750, health: 750, pen: 750 }]),
                TYPE: "trap",
                STAT_CALCULATOR: "trap",
            },
        },
        {
            POSITION: [4, 18, 1.3, 24, 0, 0, 5 / 6],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.trap, OGg.minigun, { range: 0.6 }, { reload: 2, damage: 750, health: 750, pen: 750 }]),
                TYPE: "trap",
                STAT_CALCULATOR: "trap",
            },
        },
        {
            POSITION: [4, 18, 1.3, 22, 0, 0, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.trap, OGg.minigun, { range: 0.6 }, { reload: 2, damage: 750, health: 750, pen: 750 }]),
                TYPE: "trap",
                STAT_CALCULATOR: "trap",
            },
        },
        {
            POSITION: [4, 18, 1.3, 20, 0, 0, 5 / 6],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.trap, OGg.minigun, { range: 0.6 }, { reload: 2, damage: 750, health: 750, pen: 750 }]),
                TYPE: "trap",
                STAT_CALCULATOR: "trap",
            },
        },
        {
            POSITION: [4, 18, 1.3, 18, 0, 0, 4 / 6],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.trap, OGg.minigun, { range: 0.6 }, { reload: 2, damage: 750, health: 750, pen: 750 }]),
                TYPE: "trap",
                STAT_CALCULATOR: "trap",
            },
        },
        {
            POSITION: [4, 18, 1.3, 16, 0, 0, 5 / 6],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.trap, OGg.minigun, { range: 0.6 }, { reload: 2, damage: 750, health: 750, pen: 750 }]),
                TYPE: "trap",
                STAT_CALCULATOR: "trap",
            },
        },
        {
            POSITION: [4, 18, 1.3, 14, 0, 0, 5 / 6],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.trap, OGg.minigun, { range: 0.6 }, { reload: 2, damage: 750, health: 750, pen: 750 }]),
                TYPE: "trap",
                STAT_CALCULATOR: "trap",
            },
        },
        {
            POSITION: [4, 18, 1.3, 12, 0, 0, 5 / 6],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.trap, OGg.minigun, { range: 0.6 }, { reload: 2, damage: 750, health: 750, pen: 750 }]),
                TYPE: "trap",
                STAT_CALCULATOR: "trap",
            },
        },
        {
            POSITION: [4, 18, 1.3, 10, 0, 0, 5 / 6],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.trap, OGg.minigun, { range: 0.6 }, { reload: 2, damage: 750, health: 750, pen: 750 }]),
                TYPE: "trap",
                STAT_CALCULATOR: "trap",
            },
        },
    ],
};
Class.melanismSentryTrapBDN = makeAuto(Class.melanismSentryBDN, "Sentry", {
    type: Class.ssuperpetabarricaderAutoTankGunBDN,
    size: 12,
});
Class.melanismSentryTrapBDN.UPGRADE_LABEL = "Melanism Trap Sentry";
Class.melanismSentryTrapBDN.GUNS = [
    {
        POSITION: [14, 11, 1, 0, 0, 180, 0],
    },
    {
        POSITION: [3, 11, 1.2, 14, 0, 180, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([OGg.trap, OGg.setTrap, { recoil: 1.15 }, { reload: 2, damage: 900, health: 1062, pen: 1062 }]),
            TYPE: "setTrap",
            STAT_CALCULATOR: "trap",
        },
    },
]
Class.ssshypermortarAutoTankgunBDN = {
    PARENT: ["genericTank"],
    LABEL: "Mortar",
    BODY: {
        FOV: 2,
    },
    CONTROLLERS: [
        "canRepel",
        "onlyAcceptInArc",
        "mapAltToFire",
        "nearestDifferentMaster",
    ],
    COLOR: "grey",
    GUNS: [
        {
            POSITION: [14, 3, 1, 0, -8.5, -20, 1 / 7],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.pelleter, OGg.artillery, { reload: 0.7, damage: 375, health: 300, pen: 300 }]),
                TYPE: "bullet",
                LABEL: "Tetiary",
            },
        },
        {
            POSITION: [14, 3, 1, 0, 8.5, 20, 1 / 7],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.pelleter, OGg.artillery, { reload: 0.7, damage: 375, health: 300, pen: 300 }]),
                TYPE: "bullet",
                LABEL: "Tetiary",
            },
        },
        {
            POSITION: [14.5, 3, 1, 0, -8.5, -17, 1 / 7],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.pelleter, OGg.artillery, { reload: 0.7, damage: 375, health: 300, pen: 300 }]),
                TYPE: "bullet",
                LABEL: "Tetiary",
            },
        },
        {
            POSITION: [14.5, 3, 1, 0, 8.5, 17, 1 / 7],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.pelleter, OGg.artillery, { reload: 0.7, damage: 375, health: 300, pen: 300 }]),
                TYPE: "bullet",
                LABEL: "Tetiary",
            },
        },
        {
            POSITION: [15, 3, 1, 0, -8.5, -14, 1 / 7],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.pelleter, OGg.artillery, { reload: 0.7, damage: 375, health: 300, pen: 300 }]),
                TYPE: "bullet",
                LABEL: "Tetiary",
            },
        },
        {
            POSITION: [15, 3, 1, 0, 8.5, 14, 1 / 7],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.pelleter, OGg.artillery, { reload: 0.7, damage: 375, health: 300, pen: 300 }]),
                TYPE: "bullet",
                LABEL: "Tetiary",
            },
        },
        {
            POSITION: [15.5, 3, 1, 0, -8, -12, 1 / 7],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.pelleter, OGg.artillery, { reload: 0.7, damage: 375, health: 300, pen: 300 }]),
                TYPE: "bullet",
                LABEL: "Tetiary",
            },
        },
        {
            POSITION: [15.5, 3, 1, 0, 8, 12, 1 / 7],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.pelleter, OGg.artillery, { reload: 0.7, damage: 375, health: 300, pen: 300 }]),
                TYPE: "bullet",
                LABEL: "Tetiary",
            },
        },
        {
            POSITION: [16, 3, 1, 0, -7.5, -10, 1 / 7],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.pelleter, OGg.artillery, { reload: 0.7, damage: 375, health: 300, pen: 300 }]),
                TYPE: "bullet",
                LABEL: "Tetiary",
            },
        },
        {
            POSITION: [16, 3, 1, 0, 7.5, 10, 1 / 7],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.pelleter, OGg.artillery, { reload: 0.7, damage: 375, health: 300, pen: 300 }]),
                TYPE: "bullet",
                LABEL: "Tetiary",
            },
        },
        {
            POSITION: [16.5, 3, 1, 0, -7, -8, 2 / 7],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.pelleter, OGg.artillery, { reload: 0.7, damage: 375, health: 300, pen: 300 }]),
                TYPE: "bullet",
                LABEL: "Tetiary",
            },
        },
        {
            POSITION: [16.5, 3, 1, 0, 7, 8, 2 / 7],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.pelleter, OGg.artillery, { reload: 0.7, damage: 375, health: 300, pen: 300 }]),
                TYPE: "bullet",
                LABEL: "Tetiary",
            },
        },
        {
            POSITION: [17, 3, 1, 0, -6.5, -6, 3 / 7],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.pelleter, OGg.artillery, { reload: 0.7, damage: 375, health: 300, pen: 300 }]),
                TYPE: "bullet",
                LABEL: "Tetiary",
            },
        },
        {
            POSITION: [17, 3, 1, 0, 6.5, 6, 3 / 7],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.pelleter, OGg.artillery, { reload: 0.7, damage: 375, health: 300, pen: 300 }]),
                TYPE: "bullet",
                LABEL: "Tetiary",
            },
        },
        {
            POSITION: [17.5, 3, 1, 0, -6, -4, 4 / 7],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.pelleter, OGg.artillery, { reload: 0.7, damage: 375, health: 300, pen: 300 }]),
                TYPE: "bullet",
                LABEL: "Secondary",
            },
        },
        {
            POSITION: [17.5, 3, 1, 0, 6, 4, 4 / 7],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.pelleter, OGg.artillery, { reload: 0.7, damage: 375, health: 300, pen: 300 }]),
                TYPE: "bullet",
                LABEL: "Secondary",
            },
        },
        {
            POSITION: [18, 3, 1, 0, -5.5, -2, 5 / 7],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.pelleter, OGg.artillery, { reload: 0.7, damage: 375, health: 300, pen: 300 }]),
                TYPE: "bullet",
                LABEL: "Secondary",
            },
        },
        {
            POSITION: [18, 3, 1, 0, 5.5, 2, 5 / 7],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.pelleter, OGg.artillery, { reload: 0.7, damage: 375, health: 300, pen: 300 }]),
                TYPE: "bullet",
                LABEL: "Secondary",
            },
        },
        {
            POSITION: [18.5, 3, 1, 0, -4.5, -2, 5 / 7],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.pelleter, OGg.artillery, { reload: 0.7, damage: 375, health: 300, pen: 300 }]),
                TYPE: "bullet",
                LABEL: "Secondary",
            },
        },
        {
            POSITION: [18.5, 3, 1, 0, 4.5, 2, 5 / 7],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.pelleter, OGg.artillery, { reload: 0.7, damage: 375, health: 300, pen: 300 }]),
                TYPE: "bullet",
                LABEL: "Secondary",
            },
        },
        {
            POSITION: [19, 12, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.pounder, OGg.artillery, { reload: 0.7, damage: 375, health: 300, pen: 300 }]),
                TYPE: "bullet",
                LABEL: "Heavy",
            },
        },
    ],
};
Class.melanismSentryGunBDN = makeAuto(Class.melanismSentryBDN, "Sentry", {
    type: Class.ssshypermortarAutoTankgunBDN,
    size: 12,
});
Class.melanismSentryGunBDN.UPGRADE_LABEL = "Melanism Gun Sentry";
Class.melanismSentryGunBDN.TURRETS.push(
    ...weaponArray({
        POSITION: [10, 10, 0, 0, 190, 0],
        TYPE: "sultraSprayerGunBDN",
    }, 3),
)
Class.melanismEliteSpawnerBDN = {
    PARENT: ["melanismEliteBDN"],
    UPGRADE_LABEL: "Melanism Elite Spawner",
    UPGRADE_COLOR: "black",
    MAX_CHILDREN: 5,
    AI: { STRAFE: false },
    GUNS: [
        {
            POSITION: [11, 16, 1, 0, 0, 60, 0],
        },

        {
            POSITION: [11, 16, 1, 0, 0, 180, 0],
        },

        {
            POSITION: [11, 16, 1, 0, 0, 300, 0],
        }, {
            /*** LENGTH    WIDTH     ASPECT        X             Y         ANGLE     DELAY */
            POSITION: [2, 18, 1, 11, 0, 60, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.drone, OGg.weak, { size: 0.5 }, { health: 0.7, reload: 0.6 }]),
                TYPE: ["melanismSentrySwarmBDN", { GIVE_KILL_MESSAGE: false, VARIES_IN_SIZE: false }],
                SYNCS_SKILLS: true,
                AUTOFIRE: true,
                STAT_CALCULATOR: "drone",
            },
        }, {
            POSITION: [2, 18, 1, 11, 0, 180, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.drone, OGg.weak, { size: 0.5 }, { health: 0.7, reload: 0.6 }]),
                TYPE: ["melanismSentryTrapBDN", { GIVE_KILL_MESSAGE: false, VARIES_IN_SIZE: false }],
                SYNCS_SKILLS: true,
                AUTOFIRE: true,
                STAT_CALCULATOR: "drone",
            },
        }, {
            POSITION: [2, 18, 1, 11, 0, 300, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.drone, OGg.weak, { size: 0.5 }, { health: 0.7, reload: 0.6 }]),
                TYPE: ["melanismSentryGunBDN", { GIVE_KILL_MESSAGE: false, VARIES_IN_SIZE: false }],
                SYNCS_SKILLS: true,
                AUTOFIRE: true,
                STAT_CALCULATOR: "drone",
            },
        },
        {
            POSITION: [13, 10, 1, 0, 0, 60, 0],
        },
        {
            POSITION: [11, 4, 1, 2, -6, 55, 0],
        },
        {
            POSITION: [11, 4, 1, 2, 6, 65, 0],
        },
        {
            POSITION: [9, 4, 1, 4, -8, 50, 0],
        },
        {
            POSITION: [9, 4, 1, 4, 8, 70, 0],
        },


        {
            POSITION: [4, 10, 1.6, 10.25, 0, 180, 0],
        },
        {
            POSITION: [4, 10, 1.6, 9.5, 0, 180, 0],
        },
        {
            POSITION: [4, 10, 1.6, 8.75, 0, 180, 0],
        },
        {
            POSITION: [4, 10, 1.6, 8, 0, 180, 0],
        },

        {
            POSITION: [5, 9, 1.65, 8, 0, 300, 0],
        },
        {
            POSITION: [4, 10, 0.6, 9, 0, 300, 0],
        },
    ],
    TURRETS: [
        {
            POSITION: [11, 0, 0, 0, 360, 1],
            TYPE: ["megaoctupletGunBDN", { INDEPENDENT: false, COLOR: -1 }],
        },
    ],
};
Class.melanismEliteTrapGuardTopBDN = {
    PARENT: ["genericTank"],
    COLOR: -1,
    CONTROLLERS: [["spin", { independent: true }]],
    GUNS: [],
};
for (let i = 0; i < 24; i++) {
    Class.melanismEliteTrapGuardTopBDN.GUNS.push(
        {
            POSITION: [19, 8, 1, 0, 0, 15 * i, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.flankGuard, OGg.minigun, OGg.flankGuard, { reload: 5.2, damage: 525, health: 525, pen: 525 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [17, 8, 1, 0, 0, 15 * i, 0.2],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.flankGuard, OGg.minigun, OGg.flankGuard, { reload: 5.2, damage: 525, health: 525, pen: 525 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [15, 8, 1, 0, 0, 15 * i, 0.4],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.flankGuard, OGg.minigun, OGg.flankGuard, { reload: 5.2, damage: 525, health: 525, pen: 525 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [13, 8, 1, 0, 0, 15 * i, 0.6],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.flankGuard, OGg.minigun, OGg.flankGuard, { reload: 5.2, damage: 525, health: 525, pen: 525 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [13, 8, 1, 0, 0, 15 * i, 0.8],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.flankGuard, OGg.minigun, OGg.flankGuard, { reload: 5.2, damage: 525, health: 525, pen: 525 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [20, 8, 1, 0, 0, 15 * i + 15, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.flankGuard, OGg.flankGuard, { reload: 6.4, damage: 502.5, health: 502.5, pen: 502.5 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [18, 8, 1, 0, 0, 15 * i + 15, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.flankGuard, OGg.flankGuard, { reload: 6.4, damage: 502.5, health: 502.5, pen: 502.5 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [4, 8, 1.7, 13, 0, 15 * i + 15, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.trap, { reload: 6.4, damage: 502.5, health: 502.5, pen: 502.5 }]),
                TYPE: "trap",
                STAT_CALCULATOR: "trap",
            },
        },
    )
};
Class.melanismEliteTrapGuardBDN = {
    PARENT: ["melanismEliteBDN"],
    UPGRADE_LABEL: "Melanism Elite Trap Guard",
    UPGRADE_COLOR: "black",
    AI: { STRAFE: false },
    GUNS: [],
    TURRETS: [
        {
            POSITION: [9.5, 0, 0, 0, 360, 1],
            TYPE: "melanismEliteTrapGuardTopBDN",
        },
    ],
};
for (let i = 0; i < 3; i++) {
    Class.melanismEliteTrapGuardBDN.GUNS.push(
        {
            POSITION: [10.5, 8, 1, 0, 0, 120 * i + 60, 0],
        },
        {
            POSITION: [2, 8, 1.4, 10.5, 0, 120 * i + 60, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.trap, OGg.setTrap, { reload: 2, damage: 256, health: 256, pen: 256 }]),
                TYPE: "sunsetultraDriverPillboxBDN",
                MAX_CHILDREN: 5,
                STAT_CALCULATOR: "trap",
            },
        },
        {
            POSITION: [9, 10, 1, 0, 0, 120 * i + 60, 0],
        },
    )
    Class.melanismEliteTrapGuardBDN.TURRETS.push(
        {
            POSITION: [5.5, 8, -9, 120 * i + 60, 160, 0],
            TYPE: ["teraDoomsayerGunBDN", { INDEPENDENT: false, }],
        }, {
        POSITION: [5.5, 8, 9, 120 * i + 60, 160, 0],
        TYPE: ["teraDoomsayerGunBDN", { INDEPENDENT: false, }],
    },
    )
};
Class.teraDoomsayerGunBDN = {
    PARENT: ["autoTankGun"],
    GUNS: [
        {
            POSITION: [27.5, 21, 1.3, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.pounder, OGg.pounder, OGg.pounder, OGg.destroyer, OGg.annihilator, OGg.single, OGg.single, OGg.single, { recoil: 0.1, reload: 2, damage: 9000, health: 9000, pen: 9000 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [13.5, 23, -0.95, 3, 0, 0, 0],
        },
    ]
}
Class.melanismEliteSuperSpinnerCycloneBDN = {
    PARENT: ["genericTank"],
    COLOR: -1,
    CONTROLLERS: [["spin", { speed: 0.1, independent: true }]],
    GUNS: [],
};

for (let i = 0; i < 48; i++) {
    Class.melanismEliteSuperSpinnerCycloneBDN.GUNS.push(
        {
            POSITION: [21, 13, 1, 0, 0, (7.5 * i), 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.flankGuard, OGg.pounder, OGg.destroyer, { reload: 3, speed: 3, maxSpeed: 3, damage: 500, health: 500, pen: 500 }]),
                TYPE: "bullet",
            },
        },
    )
};
for (let i = 0; i < 96; i++) {
    Class.melanismEliteSuperSpinnerCycloneBDN.GUNS.push(
        {
            POSITION: [18, 8, 1, 0, 0, (3.75 * i), 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.flankGuard, { reload: 3, speed: 3, maxSpeed: 3, damage: 500, health: 500, pen: 500 }]),
                TYPE: "bullet",
            },
        },

    )
};
for (let i = 0; i < 48; i++) {
    Class.melanismEliteSuperSpinnerCycloneBDN.GUNS.push(
        {
            POSITION: [15, 3, 1, 0, 0, (7.5 * i) + 7.5, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.gunner, { reload: 8, speed: 3.5, maxSpeed: 1.9, damage: 500, health: 500, pen: 500 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [15, 3, 1, 0, 0, (7.5 * i) - 7.5, 1 / 2],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.gunner, { reload: 8, speed: 3.5, maxSpeed: 1.9, damage: 500, health: 500, pen: 500 }]),
                TYPE: "bullet",
            },
        },
    )
};
Class.melanismEliteSpinnerBDN = {
    PARENT: ["melanismEliteBDN"],
    UPGRADE_LABEL: "Melanism Elite Spinner",
    UPGRADE_COLOR: "black",
    SKILL: skillSet({
        rld: 0.7,
        dam: 0.5,
        pen: 0.8,
        str: 0.8,
        spd: 0.2,
        atk: 0.3,
        hlt: 1,
        shi: 0.7,
        rgn: 0.7,
        mob: 1,
    }),
    AI: { STRAFE: false },
    FACING_TYPE: ["spin", { speed: 0.1 }],
    GUNS: [],
    TURRETS: [
        {
            POSITION: [9.5, 0, 0, 0, 360, 1],
            TYPE: ["melanismEliteSuperSpinnerCycloneBDN", { COLOR: -1 }],
        },
        ...weaponArray({
            POSITION: [5, 12.5, 0, 0, 190, 0],
            TYPE: "baseTrapTurret",
            SHOOT_SETTINGS: combineStats([{ health: 750, damage: 750, pen: 750 }]),
        }, 3)
    ],
};
for (let i = 0; i < 3; i++) {
    Class.melanismEliteSpinnerBDN.GUNS.push(
                {
            POSITION: [13.5, 2, 1, -1.5, 11.5, 120 * i + 10, 8 / 10],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.twin, OGg.gunner, { speed: 1.3, maxSpeed: 1.3, reload: 2, damage: 360, health: 360, pen: 360 }]),
                TYPE: "bullet",
            },
        }, {
        POSITION: [13.5, 2, 1, 2, 9, 120 * i + 10, 6 / 10],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([OGg.basic, OGg.twin, OGg.gunner, { speed: 1.3, maxSpeed: 1.3, reload: 2, damage: 360, health: 360, pen: 360 }]),
            TYPE: "bullet",
        },
    }, {
        POSITION: [13.5, 2, 1, 3.5, 6.5, 120 * i + 10, 4 / 10],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([OGg.basic, OGg.twin, OGg.gunner, { speed: 1.3, maxSpeed: 1.3, reload: 2, damage: 360, health: 360, pen: 360 }]),
            TYPE: "bullet",
        },
    }, {
        POSITION: [13.5, 2, 1, 6, 4, 120 * i + 10, 2 / 10],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([OGg.basic, OGg.twin, OGg.gunner, { speed: 1.3, maxSpeed: 1.3, reload: 2, damage: 360, health: 360, pen: 360 }]),
            TYPE: "bullet",
        },
    }, {
        POSITION: [13.5, 2, 1, 8.5, 1.5, 120 * i + 10, 0 / 10],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([OGg.basic, OGg.twin, OGg.gunner, { speed: 1.3, maxSpeed: 1.3, reload: 2, damage: 360, health: 360, pen: 360 }]),
            TYPE: "bullet",
        },
    },
                {
            POSITION: [12.5, 2, 1, -1.5, 11.5, 120 * i + 10, 8 / 10],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.twin, OGg.gunner, { speed: 1.3, maxSpeed: 1.3, reload: 2, damage: 360, health: 360, pen: 360 }]),
                TYPE: "bullet",
            },
        }, {
        POSITION: [12.5, 2, 1, 2, 9, 120 * i + 10, 6 / 10],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([OGg.basic, OGg.twin, OGg.gunner, { speed: 1.3, maxSpeed: 1.3, reload: 2, damage: 360, health: 360, pen: 360 }]),
            TYPE: "bullet",
        },
    }, {
        POSITION: [12.5, 2, 1, 3.5, 6.5, 120 * i + 10, 4 / 10],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([OGg.basic, OGg.twin, OGg.gunner, { speed: 1.3, maxSpeed: 1.3, reload: 2, damage: 360, health: 360, pen: 360 }]),
            TYPE: "bullet",
        },
    }, {
        POSITION: [12.5, 2, 1, 6, 4, 120 * i + 10, 2 / 10],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([OGg.basic, OGg.twin, OGg.gunner, { speed: 1.3, maxSpeed: 1.3, reload: 2, damage: 360, health: 360, pen: 360 }]),
            TYPE: "bullet",
        },
    }, {
        POSITION: [12.5, 2, 1, 8.5, 1.5, 120 * i + 10, 0 / 10],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([OGg.basic, OGg.twin, OGg.gunner, { speed: 1.3, maxSpeed: 1.3, reload: 2, damage: 360, health: 360, pen: 360 }]),
            TYPE: "bullet",
        },
    },
                {
            POSITION: [11.5, 2, 1, -1.5, 11.5, 120 * i + 10, 8 / 10],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.twin, OGg.gunner, { speed: 1.3, maxSpeed: 1.3, reload: 2, damage: 360, health: 360, pen: 360 }]),
                TYPE: "bullet",
            },
        }, {
        POSITION: [11.5, 2, 1, 2, 9, 120 * i + 10, 6 / 10],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([OGg.basic, OGg.twin, OGg.gunner, { speed: 1.3, maxSpeed: 1.3, reload: 2, damage: 360, health: 360, pen: 360 }]),
            TYPE: "bullet",
        },
    }, {
        POSITION: [11.5, 2, 1, 3.5, 6.5, 120 * i + 10, 4 / 10],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([OGg.basic, OGg.twin, OGg.gunner, { speed: 1.3, maxSpeed: 1.3, reload: 2, damage: 360, health: 360, pen: 360 }]),
            TYPE: "bullet",
        },
    }, {
        POSITION: [11.5, 2, 1, 6, 4, 120 * i + 10, 2 / 10],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([OGg.basic, OGg.twin, OGg.gunner, { speed: 1.3, maxSpeed: 1.3, reload: 2, damage: 360, health: 360, pen: 360 }]),
            TYPE: "bullet",
        },
    }, {
        POSITION: [11.5, 2, 1, 8.5, 1.5, 120 * i + 10, 0 / 10],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([OGg.basic, OGg.twin, OGg.gunner, { speed: 1.3, maxSpeed: 1.3, reload: 2, damage: 360, health: 360, pen: 360 }]),
            TYPE: "bullet",
        },
    },
        {
            POSITION: [10.5, 2, 1, -1.5, 11.5, 120 * i + 10, 8 / 10],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.twin, OGg.gunner, { speed: 1.3, maxSpeed: 1.3, reload: 2, damage: 360, health: 360, pen: 360 }]),
                TYPE: "bullet",
            },
        }, {
        POSITION: [10.5, 2, 1, 2, 9, 120 * i + 10, 6 / 10],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([OGg.basic, OGg.twin, OGg.gunner, { speed: 1.3, maxSpeed: 1.3, reload: 2, damage: 360, health: 360, pen: 360 }]),
            TYPE: "bullet",
        },
    }, {
        POSITION: [10.5, 2, 1, 3.5, 6.5, 120 * i + 10, 4 / 10],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([OGg.basic, OGg.twin, OGg.gunner, { speed: 1.3, maxSpeed: 1.3, reload: 2, damage: 360, health: 360, pen: 360 }]),
            TYPE: "bullet",
        },
    }, {
        POSITION: [10.5, 2, 1, 6, 4, 120 * i + 10, 2 / 10],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([OGg.basic, OGg.twin, OGg.gunner, { speed: 1.3, maxSpeed: 1.3, reload: 2, damage: 360, health: 360, pen: 360 }]),
            TYPE: "bullet",
        },
    }, {
        POSITION: [10.5, 2, 1, 8.5, 1.5, 120 * i + 10, 0 / 10],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([OGg.basic, OGg.twin, OGg.gunner, { speed: 1.3, maxSpeed: 1.3, reload: 2, damage: 360, health: 360, pen: 360 }]),
            TYPE: "bullet",
        },
    },
        {
            POSITION: [9.5, 2, 1, -1.5, 11.5, 120 * i + 10, 8 / 10],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.twin, OGg.gunner, { speed: 1.3, maxSpeed: 1.3, reload: 2, damage: 360, health: 360, pen: 360 }]),
                TYPE: "bullet",
            },
        }, {
        POSITION: [9.5, 2, 1, 2, 9, 120 * i + 10, 6 / 10],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([OGg.basic, OGg.twin, OGg.gunner, { speed: 1.3, maxSpeed: 1.3, reload: 2, damage: 360, health: 360, pen: 360 }]),
            TYPE: "bullet",
        },
    }, {
        POSITION: [9.5, 2, 1, 3.5, 6.5, 120 * i + 10, 4 / 10],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([OGg.basic, OGg.twin, OGg.gunner, { speed: 1.3, maxSpeed: 1.3, reload: 2, damage: 360, health: 360, pen: 360 }]),
            TYPE: "bullet",
        },
    }, {
        POSITION: [9.5, 2, 1, 6, 4, 120 * i + 10, 2 / 10],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([OGg.basic, OGg.twin, OGg.gunner, { speed: 1.3, maxSpeed: 1.3, reload: 2, damage: 360, health: 360, pen: 360 }]),
            TYPE: "bullet",
        },
    }, {
        POSITION: [9.5, 2, 1, 8.5, 1.5, 120 * i + 10, 0 / 10],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([OGg.basic, OGg.twin, OGg.gunner, { speed: 1.3, maxSpeed: 1.3, reload: 2, damage: 360, health: 360, pen: 360 }]),
            TYPE: "bullet",
        },
    },
        {
            POSITION: [8.5, 2, 1, -1.5, 11.5, 120 * i + 10, 8 / 10],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.twin, OGg.gunner, { speed: 1.3, maxSpeed: 1.3, reload: 2, damage: 360, health: 360, pen: 360 }]),
                TYPE: "bullet",
            },
        }, {
        POSITION: [8.5, 2, 1, 2, 9, 120 * i + 10, 6 / 10],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([OGg.basic, OGg.twin, OGg.gunner, { speed: 1.3, maxSpeed: 1.3, reload: 2, damage: 360, health: 360, pen: 360 }]),
            TYPE: "bullet",
        },
    }, {
        POSITION: [8.5, 2, 1, 3.5, 6.5, 120 * i + 10, 4 / 10],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([OGg.basic, OGg.twin, OGg.gunner, { speed: 1.3, maxSpeed: 1.3, reload: 2, damage: 360, health: 360, pen: 360 }]),
            TYPE: "bullet",
        },
    }, {
        POSITION: [8.5, 2, 1, 6, 4, 120 * i + 10, 2 / 10],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([OGg.basic, OGg.twin, OGg.gunner, { speed: 1.3, maxSpeed: 1.3, reload: 2, damage: 360, health: 360, pen: 360 }]),
            TYPE: "bullet",
        },
    }, {
        POSITION: [8.5, 2, 1, 8.5, 1.5, 120 * i + 10, 0 / 10],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([OGg.basic, OGg.twin, OGg.gunner, { speed: 1.3, maxSpeed: 1.3, reload: 2, damage: 360, health: 360, pen: 360 }]),
            TYPE: "bullet",
        },
    },
        {
            POSITION: [7.5, 2, 1, -1.5, 11.5, 120 * i + 10, 5 / 6],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.twin, OGg.gunner, { speed: 1.3, maxSpeed: 1.3, reload: 2, damage: 360, health: 360, pen: 360 }]),
                TYPE: "bullet",
            },
        }, {
        POSITION: [7.5, 2, 1, 2, 9, 120 * i + 10, 4 / 6],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([OGg.basic, OGg.twin, OGg.gunner, { speed: 1.3, maxSpeed: 1.3, reload: 2, damage: 360, health: 360, pen: 360 }]),
            TYPE: "bullet",
        },
    }, {
        POSITION: [7.5, 2, 1, 3.5, 6.5, 120 * i + 10, 3 / 6],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([OGg.basic, OGg.twin, OGg.gunner, { speed: 1.3, maxSpeed: 1.3, reload: 2, damage: 360, health: 360, pen: 360 }]),
            TYPE: "bullet",
        },
    }, {
        POSITION: [7.5, 2, 1, 6, 4, 120 * i + 10, 2 / 6],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([OGg.basic, OGg.twin, OGg.gunner, { speed: 1.3, maxSpeed: 1.3, reload: 2, damage: 360, health: 360, pen: 360 }]),
            TYPE: "bullet",
        },
    }, {
        POSITION: [7.5, 2, 1, 8.5, 1.5, 120 * i + 10, 1 / 6],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([OGg.basic, OGg.twin, OGg.gunner, { speed: 1.3, maxSpeed: 1.3, reload: 2, damage: 360, health: 360, pen: 360 }]),
            TYPE: "bullet",
        },
    },
        {
            POSITION: [6.5, 2, 1, -1.5, 11.5, 120 * i + 10, 6 / 7],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.twin, OGg.gunner, { speed: 1.3, maxSpeed: 1.3, reload: 2, damage: 360, health: 360, pen: 360 }]),
                TYPE: "bullet",
            },
        }, {
        POSITION: [6.5, 2, 1, 2, 9, 120 * i + 10, 5 / 7],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([OGg.basic, OGg.twin, OGg.gunner, { speed: 1.3, maxSpeed: 1.3, reload: 2, damage: 360, health: 360, pen: 360 }]),
            TYPE: "bullet",
        },
    }, {
        POSITION: [6.5, 2, 1, 3.5, 6.5, 120 * i + 10, 4 / 7],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([OGg.basic, OGg.twin, OGg.gunner, { speed: 1.3, maxSpeed: 1.3, reload: 2, damage: 360, health: 360, pen: 360 }]),
            TYPE: "bullet",
        },
    }, {
        POSITION: [6.5, 2, 1, 6, 4, 120 * i + 10, 3 / 7],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([OGg.basic, OGg.twin, OGg.gunner, { speed: 1.3, maxSpeed: 1.3, reload: 2, damage: 360, health: 360, pen: 360 }]),
            TYPE: "bullet",
        },
    }, {
        POSITION: [6.5, 2, 1, 8.5, 1.5, 120 * i + 10, 2 / 7],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([OGg.basic, OGg.twin, OGg.gunner, { speed: 1.3, maxSpeed: 1.3, reload: 2, damage: 360, health: 360, pen: 360 }]),
            TYPE: "bullet",
        },
    },
        {
            POSITION: [5.5, 2, 1, -1.5, 11.5, 120 * i + 10, 7 / 8],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.twin, OGg.gunner, { speed: 1.3, maxSpeed: 1.3, reload: 2, damage: 360, health: 360, pen: 360 }]),
                TYPE: "bullet",
            },
        }, {
        POSITION: [5.5, 2, 1, 2, 9, 120 * i + 10, 6 / 8],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([OGg.basic, OGg.twin, OGg.gunner, { speed: 1.3, maxSpeed: 1.3, reload: 2, damage: 360, health: 360, pen: 360 }]),
            TYPE: "bullet",
        },
    }, {
        POSITION: [5.5, 2, 1, 3.5, 6.5, 120 * i + 10, 5 / 8],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([OGg.basic, OGg.twin, OGg.gunner, { speed: 1.3, maxSpeed: 1.3, reload: 2, damage: 360, health: 360, pen: 360 }]),
            TYPE: "bullet",
        },
    }, {
        POSITION: [5.5, 2, 1, 6, 4, 120 * i + 10, 4 / 8],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([OGg.basic, OGg.twin, OGg.gunner, { speed: 1.3, maxSpeed: 1.3, reload: 2, damage: 360, health: 360, pen: 360 }]),
            TYPE: "bullet",
        },
    }, {
        POSITION: [5.5, 2, 1, 8.5, 1.5, 120 * i + 10, 3 / 8],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([OGg.basic, OGg.twin, OGg.gunner, { speed: 1.3, maxSpeed: 1.3, reload: 2, damage: 360, health: 360, pen: 360 }]),
            TYPE: "bullet",
        },
    },
        {
            POSITION: [4.5, 2, 1, -1.5, 11.5, 120 * i + 10, 8 / 9],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.twin, OGg.gunner, { speed: 1.3, maxSpeed: 1.3, reload: 2, damage: 360, health: 360, pen: 360 }]),
                TYPE: "bullet",
            },
        }, {
        POSITION: [4.5, 2, 1, 2, 9, 120 * i + 10, 7 / 9],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([OGg.basic, OGg.twin, OGg.gunner, { speed: 1.3, maxSpeed: 1.3, reload: 2, damage: 360, health: 360, pen: 360 }]),
            TYPE: "bullet",
        },
    }, {
        POSITION: [4.5, 2, 1, 3.5, 6.5, 120 * i + 10, 6 / 9],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([OGg.basic, OGg.twin, OGg.gunner, { speed: 1.3, maxSpeed: 1.3, reload: 2, damage: 360, health: 360, pen: 360 }]),
            TYPE: "bullet",
        },
    }, {
        POSITION: [4.5, 2, 1, 6, 4, 120 * i + 10, 5 / 9],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([OGg.basic, OGg.twin, OGg.gunner, { speed: 1.3, maxSpeed: 1.3, reload: 2, damage: 360, health: 360, pen: 360 }]),
            TYPE: "bullet",
        },
    }, {
        POSITION: [4.5, 2, 1, 8.5, 1.5, 120 * i + 10, 4 / 9],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([OGg.basic, OGg.twin, OGg.gunner, { speed: 1.3, maxSpeed: 1.3, reload: 2, damage: 360, health: 360, pen: 360 }]),
            TYPE: "bullet",
        },
    }, {
        POSITION: [2, 20, 0.75, 8, 0, 120 * i + 60, 0],
    },
    )
};





































// Legions
Class.melanismdestroyerLegion = {
    PARENT: ["melanismEliteBDN"],
    UPGRADE_LABEL: "Melanism Destroyer Legion",
    NAME: "Melanism Destroyer Legion",
    DISPLAY_NAME: false,
    UPGRADE_COLOR: "black",
    AI: { NO_LEAD: false },
    SIZE: 70,
    GUNS: [],
    BODY: {
        HEALTH: 2000000 * base.HEALTH,
    },
    TURRETS: [
        {
            POSITION: [11, 0, 0, 180, 360, 0],
            TYPE: ["crasherSpawnerlimited", { GUN_STAT_SCALE: { health: 1.1 } }],
        }, {
            POSITION: [11, 0, 0, 60, 360, 0],
            TYPE: ["crasherSpawnerlimited", { GUN_STAT_SCALE: { health: 1.1 } }],
        }, {
            POSITION: [11, 0, 0, -60, 360, 0],
            TYPE: ["crasherSpawnerlimited", { GUN_STAT_SCALE: { health: 1.1 } }],
        }, {
            POSITION: [11, 0, 0, 240, 360, 0],
            TYPE: ["crasherSpawnerlimited", { GUN_STAT_SCALE: { health: 1.1 } }],
        }, {
            POSITION: [11, 0, 0, 120, 360, 0],
            TYPE: ["crasherSpawnerlimited", { GUN_STAT_SCALE: { health: 1.1 } }],
        }, {
            POSITION: [11, 0, 0, 0, 360, 0],
            TYPE: ["crasherSpawnerlimited", { GUN_STAT_SCALE: { health: 1.1 } }],
        }, {
            POSITION: [11, 0, 0, 0, 360, 1],
            TYPE: ["megaoctupletGunBDN", { GUN_STAT_SCALE: { health: 1.1 }, INDEPENDENT: true, COLOR: -1 }],
        },
    ],
};
for (let i = 0; i < 3; i++) {
    Class.melanismdestroyerLegion.GUNS.push(
        {
            POSITION: [7, 16, 1, 6, 5, i * 120 + 74, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.pounder, OGg.pounder, OGg.destroyer, { reload: 0.9, damage: 250, health: 275, pen: 250 }]),
                TYPE: "bullet",
                LABEL: "Devastator Secondary",
            },
        },
        {
            POSITION: [7, 16, 1, 6, -5, i * 120 + 44, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.pounder, OGg.pounder, OGg.destroyer, { reload: 0.9, damage: 250, health: 275, pen: 250 }]),
                TYPE: "bullet",
                LABEL: "Devastator Secondary",
            },
        },
        {
            POSITION: [7, 16, 1, 6, 3, i * 120 + 67, 0.25],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.pounder, OGg.pounder, OGg.destroyer, { reload: 0.9, damage: 250, health: 275, pen: 250 }]),
                TYPE: "bullet",
                LABEL: "Devastator Secondary",
            },
        },
        {
            POSITION: [7, 16, 1, 6, -3, i * 120 + 53, 0.25],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.pounder, OGg.pounder, OGg.destroyer, { reload: 0.9, damage: 250, health: 275, pen: 250 }]),
                TYPE: "bullet",
                LABEL: "Devastator Secondary",
            },
        },
        {
            POSITION: [7, 13, 1, 6, 5, i * 120 + 74, 0.75],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.pounder, OGg.pounder, OGg.destroyer, { reload: 0.9, damage: 125, health: 137.5, pen: 125 }]),
                TYPE: "bullet",
                LABEL: "Devastator Secondary",
            },
        },
        {
            POSITION: [7, 13, 1, 6, -5, i * 120 + 44, 0.75],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.pounder, OGg.pounder, OGg.destroyer, { reload: 0.9, damage: 125, health: 137.5, pen: 125 }]),
                TYPE: "bullet",
                LABEL: "Devastator Secondary",
            },
        },
        {
            POSITION: [7, 13, 1, 6, 3, i * 120 + 67, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.pounder, OGg.pounder, OGg.destroyer, { reload: 0.9, damage: 125, health: 137.5, pen: 125 }]),
                TYPE: "bullet",
                LABEL: "Devastator Secondary",
            },
        },
        {
            POSITION: [7, 13, 1, 6, -3, i * 120 + 53, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.pounder, OGg.pounder, OGg.destroyer, { reload: 0.9, damage: 125, health: 137.5, pen: 125 }]),
                TYPE: "bullet",
                LABEL: "Devastator Secondary",
            },
        },
        {
            POSITION: [7, 13, 1, 6, 5, i * 120 + 74, 1],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.pounder, OGg.pounder, OGg.destroyer, { reload: 0.9, damage: 62.5, health: 68.75, pen: 62.5 }]),
                TYPE: "bullet",
                LABEL: "Devastator Secondary",
            },
        },
        {
            POSITION: [7, 13, 1, 6, -5, i * 120 + 44, 1],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.pounder, OGg.pounder, OGg.destroyer, { reload: 0.9, damage: 62.5, health: 68.75, pen: 62.5 }]),
                TYPE: "bullet",
                LABEL: "Devastator Secondary",
            },
        },
        {
            POSITION: [7, 13, 1, 6, 3, i * 120 + 67, 0.75],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.pounder, OGg.pounder, OGg.destroyer, { reload: 0.9, damage: 62.5, health: 68.75, pen: 62.5 }]),
                TYPE: "bullet",
                LABEL: "Devastator Secondary",
            },
        },
        {
            POSITION: [7, 13, 1, 6, -3, i * 120 + 53, 0.75],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.pounder, OGg.pounder, OGg.destroyer, { reload: 0.9, damage: 62.5, health: 68.75, pen: 62.5 }]),
                TYPE: "bullet",
                LABEL: "Devastator Secondary",
            },
        },
    )
    Class.melanismdestroyerLegion.GUNS.push(
        {
            POSITION: [7, 16, 1, 6, 0, i * 120 + 60, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.pounder, OGg.pounder, OGg.destroyer, { reload: 0.9, damage: 250, health: 275, pen: 250 }]),
                TYPE: "bullet",
                LABEL: "Devastator Primary",
            },
        },
        {
            POSITION: [7, 13, 1, 6, 0, i * 120 + 60, 0.25],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.pounder, OGg.pounder, OGg.destroyer, { reload: 0.9, damage: 125, health: 137.5, pen: 125 }]),
                TYPE: "bullet",
                LABEL: "Devastator Primary",
            },
        },
        {
            POSITION: [7, 13, 1, 6, 0, i * 120 + 60, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.pounder, OGg.pounder, OGg.destroyer, { reload: 0.9, damage: 62.5, health: 68.75, pen: 62.5 }]),
                TYPE: "bullet",
                LABEL: "Devastator Primary",
            },
        },
    )
}
Class.melanismgunnerLegion = {
    PARENT: ["melanismEliteBDN"],
    UPGRADE_LABEL: "Melanism Gunner Legion",
    NAME: "Melanism Gunner Legion",
    DISPLAY_NAME: false,
    UPGRADE_COLOR: "black",
    FACING_TYPE: "toTarget",
    AI: { NO_LEAD: false },
    SIZE: 90,
    BODY: {
        HEALTH: 2000000 * base.HEALTH,
    },
    GUNS: [
        {
            POSITION: [14, 16, 1, 0, 0, 180, 0],
        },
        {
            POSITION: [14, 13, 1, 0, 0, 180, 0],
        }, {
            POSITION: [4, 16, 1.5, 14, 0, 180, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.trap, OGg.hexaTrapper, OGg.setTrap, { reload: 0.8, damage: 108, health: 126, pen: 108 }]),
                TYPE: ["sunsetultraDriverPillboxBDN", { MOTION_TYPE: "glide" }],
                STAT_CALCULATOR: "trap",
            },
        },
        {
            POSITION: [4, 13, 1.5, 14, 0, 180, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.trap, OGg.hexaTrapper, OGg.setTrap, { reload: 0.8, range: 0, damage: 0, health: 1.1 }]),
                TYPE: "bullet",
            },
        }, {
            POSITION: [6, 14, -2, 2, 0, 60, 0],
        }, {
            POSITION: [6, 14, -2, 2, 0, 300, 0],
        }, {
            POSITION: [6, 14, -2, 2, 0, 55, 0],
        }, {
            POSITION: [6, 14, -2, 2, 0, 305, 0],
        },
    ],
    AI: { NO_LEAD: false },
    TURRETS: [
        {
            POSITION: [14, 8, 0, 60, 180, 0],
            TYPE: ["sshyperbrimmerGunBDN", { GUN_STAT_SCALE: { health: 1.15 } }],
        }, {
            POSITION: [14, 8, 0, 300, 180, 0],
            TYPE: ["sshyperbrimmerGunBDN", { GUN_STAT_SCALE: { health: 1.15 } }],
        },
    ],
}
Class.melanismsprayerLegion = {
    PARENT: ["melanismEliteBDN"],
    UPGRADE_LABEL: "Melanism Sprayer Legion",
    NAME: "Melanism Sprayer Legion",
    DISPLAY_NAME: false,
    UPGRADE_COLOR: "black",
    AI: { NO_LEAD: false },
    SIZE: 90,
    SKILL: [0, 9, 3, 9, 2, 9, 9, 9, 9, 0],
    HAS_NO_RECOIL: true,
    BODY: {
        HEALTH: 2000000 * base.HEALTH,
    },
    TURRETS: weaponArray({
        POSITION: [14, 6, 0, 60, 190, 0],
        TYPE: ["ultraSprayerGunBDN", { GUN_STAT_SCALE: { health: 112, damage: 116.8, speed: 116.8, resist: 1.15 }, COLOR: -1 }],
    }, 3)
}
Class.melanismbattleshipLegion = {
    PARENT: ["melanismEliteBDN"],
    UPGRADE_LABEL: "Melanism Battleship Legion",
    NAME: "Melanism Battleship Legion",
    DISPLAY_NAME: false,
    UPGRADE_COLOR: "black",
    AI: { NO_LEAD: false },
    SIZE: 70,
    BODY: {
        HEALTH: 2000000 * base.HEALTH,
    },
    GUNS: [],
    TURRETS: [
        {
            POSITION: [5, 7.5, 0, 0, 360, 1],
            TYPE: ["sultracarrierBDN", { GUN_STAT_SCALE: { health: 1.1 }, INDEPENDENT: true, COLOR: -1, PARENT: "sultracarrierBDN" }],
        }, {
            POSITION: [5, 7.5, 0, 120, 360, 1],
            TYPE: ["ultracarrierBDN", { GUN_STAT_SCALE: { health: 1.1 }, INDEPENDENT: true, COLOR: -1, PARENT: "sultracarrierBDN" }],
        }, {
            POSITION: [5, 7.5, 0, 240, 360, 1],
            TYPE: ["sultracarrierBDN", { GUN_STAT_SCALE: { health: 1.1 }, INDEPENDENT: true, COLOR: -1, PARENT: "sultracarrierBDN" }],
        },
        ...weaponArray({
            POSITION: [5, 25, 0, 0, 190, 1],
            TYPE: ["sultracarrierBDN", { GUN_STAT_SCALE: { size: 3, reload: 3, health: 3000, damage: 3000, pen: 3000 }, COLOR: -1 }],
        }, 3)
    ],
};
for (i = 0; i < 3; i++) {
    Class.melanismbattleshipLegion.GUNS.push(

        {
            POSITION: [3, 2, 0.6, 7, -13, i * 120 - 60, 2 / 3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.battleship, { size: 3, reload: 3, damage: 15000, health: 15000, pen: 15000 }]),
                TYPE: "autoswarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [3, 2, 0.6, 7, 13, i * 120 - 60, 2 / 3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.battleship, { size: 3, reload: 3, damage: 15000, health: 15000, pen: 15000 }]),
                TYPE: "autoswarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [3, 2, 0.6, 7, -5, i * 120 - 60, 2 / 3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.battleship, { size: 3, reload: 3, damage: 15000, health: 15000, pen: 15000 }]),
                TYPE: "autoswarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [3, 2, 0.6, 7, 5, i * 120 - 60, 2 / 3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.battleship, { size: 3, reload: 3, damage: 15000, health: 15000, pen: 15000 }]),
                TYPE: "autoswarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [3, 2, 0.6, 7, 3.75, i * 120 - 60, 2 / 3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.battleship, { size: 3, reload: 3, damage: 15000, health: 15000, pen: 15000 }]),
                TYPE: "autoswarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [3, 2, 0.6, 7, -3.75, i * 120 - 60, 2 / 3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.battleship, { size: 3, reload: 3, damage: 15000, health: 15000, pen: 15000 }]),
                TYPE: "autoswarm",
                STAT_CALCULATOR: "swarm",
            },
        },






        {
            POSITION: [4, 4, 0.6, 7, -11, i * 120 - 60, 1 / 3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.battleship, { size: 3, reload: 3, damage: 22500, health: 22500, pen: 22500 }]),
                TYPE: "autoswarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [4, 4, 0.6, 7, 11, i * 120 - 60, 1 / 3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.battleship, { size: 3, reload: 3, damage: 22500, health: 22500, pen: 22500 }]),
                TYPE: "autoswarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [4, 4, 0.6, 7, -7, i * 120 - 60, 1 / 3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.battleship, { size: 3, reload: 3, damage: 22500, health: 22500, pen: 22500 }]),
                TYPE: "autoswarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [4, 4, 0.6, 7, 7, i * 120 - 60, 1 / 3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.battleship, { size: 3, reload: 3, damage: 22500, health: 22500, pen: 22500 }]),
                TYPE: "autoswarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [4, 4, 0.6, 7, 1.5, i * 120 - 60, 1 / 3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.battleship, { size: 3, reload: 3, damage: 22500, health: 22500, pen: 22500 }]),
                TYPE: "autoswarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [4, 4, 0.6, 7, -1.5, i * 120 - 60, 1 / 3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.battleship, { size: 3, reload: 3, damage: 22500, health: 22500, pen: 22500 }]),
                TYPE: "autoswarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [5, 5, 0.6, 7, 0, i * 120 - 60, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.battleship, { size: 3, reload: 3, damage: 30000, health: 30000, pen: 30000 }]),
                TYPE: "autoswarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [5, 5, 0.6, 7, -9, i * 120 - 60, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.battleship, { size: 3, reload: 3, damage: 30000, health: 30000, pen: 30000 }]),
                TYPE: "autoswarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [5, 5, 0.6, 7, 9, i * 120 - 60, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.battleship, { size: 3, reload: 3, damage: 30000, health: 30000, pen: 30000 }]),
                STAT_CALCULATOR: "swarm",
            },
        },
    )
}
Class.melanismspawnerLegion = {
    PARENT: ["melanismEliteBDN"],
    UPGRADE_LABEL: "Melanism Spawner Legion",
    NAME: "Melanism Spawner Legion",
    DISPLAY_NAME: false,
    UPGRADE_COLOR: "black",
    AI: { NO_LEAD: false },
    SIZE: 90,
    BODY: {
        HEALTH: 2000000 * base.HEALTH,
    },
    GUNS: [
        {
            POSITION: [11, 16, 1, 0, 0, 60, 0],
        },

        {
            POSITION: [11, 16, 1, 0, 0, 180, 0],
        },

        {
            POSITION: [11, 16, 1, 0, 0, 300, 0],
        }, {
            /*** LENGTH    WIDTH     ASPECT        X             Y         ANGLE     DELAY */
            POSITION: [2, 18, 1, 11, 0, 60, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.drone, OGg.weak, OGg.weak, OGg.weak, { size: 0.4 }, { health: 0.3, reload: 0.75 }]),
                TYPE: ["melanismSentrySwarmBDN", { GIVE_KILL_MESSAGE: false, VARIES_IN_SIZE: false }],
                SYNCS_SKILLS: true,
                AUTOFIRE: true,
                STAT_CALCULATOR: "drone",
            },
        }, {
            POSITION: [2, 18, 1, 11, 0, 180, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.drone, OGg.weak, OGg.weak, OGg.weak, { size: 0.4 }, { health: 0.3, reload: 0.75 }]),
                TYPE: ["melanismSentryTrapBDN", { GIVE_KILL_MESSAGE: false, VARIES_IN_SIZE: false }],
                SYNCS_SKILLS: true,
                AUTOFIRE: true,
                STAT_CALCULATOR: "drone",
            },
        }, {
            POSITION: [2, 18, 1, 11, 0, 300, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.drone, OGg.weak, OGg.weak, OGg.weak, { size: 0.4 }, { health: 0.3, reload: 0.75 }]),
                TYPE: ["melanismSentryGunBDN", { GIVE_KILL_MESSAGE: false, VARIES_IN_SIZE: false }],
                SYNCS_SKILLS: true,
                AUTOFIRE: true,
                STAT_CALCULATOR: "drone",
            },
        },
        {
            POSITION: [13, 10, 1, 0, 0, 60, 0],
        },
        {
            POSITION: [11, 4, 1, 2, -6, 55, 0],
        },
        {
            POSITION: [11, 4, 1, 2, 6, 65, 0],
        },
        {
            POSITION: [9, 4, 1, 4, -8, 50, 0],
        },
        {
            POSITION: [9, 4, 1, 4, 8, 70, 0],
        },


        {
            POSITION: [4, 10, 1.6, 10.25, 0, 180, 0],
        },
        {
            POSITION: [4, 10, 1.6, 9.5, 0, 180, 0],
        },
        {
            POSITION: [4, 10, 1.6, 8.75, 0, 180, 0],
        },
        {
            POSITION: [4, 10, 1.6, 8, 0, 180, 0],
        },

        {
            POSITION: [5, 9, 1.65, 8, 0, 300, 0],
        },
        {
            POSITION: [4, 10, 0.6, 9, 0, 300, 0],
        },
    ],
    TURRETS: [
        {
            POSITION: [11, 0, 0, 0, 360, 1],
            TYPE: ["megaoctupletGunBDN", { GUN_STAT_SCALE: { health: 1.15 }, INDEPENDENT: false, COLOR: -1 }],
        },
    ],
}
// Legionary Crasher
Class.melanismlegionaryCrasherTop = {
    PARENT: ["melanismEliteBDN"],
    AI: { STRAFE: false, NO_LEAD: false },
    INDEPENDENT: true,
    DISPLAY_NAME: false,
    GUNS: [
        {
            /*** LENGTH    WIDTH     ASPECT        X             Y         ANGLE     DELAY */
            POSITION: [2, 18, 1, 11, 0, 60, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.drone, OGg.weak, { size: 0.4 }, { health: 0.6, reload: 0.6 }]),
                TYPE: ["melanismSentrySwarmBDN", { GIVE_KILL_MESSAGE: false, VARIES_IN_SIZE: false }],
                SYNCS_SKILLS: true,
                AUTOFIRE: true,
                STAT_CALCULATOR: "drone",
                MAX_CHILDREN: 1,
            },
        }, {
            POSITION: [2, 18, 1, 11, 0, 180, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.drone, OGg.weak, { size: 0.4 }, { health: 0.6, reload: 0.6 }]),
                TYPE: ["melanismSentryTrapBDN", { GIVE_KILL_MESSAGE: false, VARIES_IN_SIZE: false }],
                SYNCS_SKILLS: true,
                AUTOFIRE: true,
                STAT_CALCULATOR: "drone",
                MAX_CHILDREN: 1,
            },
        }, {
            POSITION: [2, 18, 1, 11, 0, 300, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.drone, OGg.weak, { size: 0.4 }, { health: 0.6, reload: 0.6 }]),
                TYPE: ["melanismSentryGunBDN", { GIVE_KILL_MESSAGE: false, VARIES_IN_SIZE: false }],
                SYNCS_SKILLS: true,
                AUTOFIRE: true,
                STAT_CALCULATOR: "drone",
                MAX_CHILDREN: 1,
            },
        },



        ...weaponArray([

            {
                POSITION: [4, 3, 0.7, 7, 0, 60, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.pounder, { damage: 3, pen: 3, health: 3 }, { speed: 2.5, maxSpeed: 2.2, size: 1.1, range: 3.25 }]),
                    TYPE: ["swarm", { INDEPENDENT: true }],
                    STAT_CALCULATOR: "swarm",
                    AUTOFIRE: true,

                },
            },
            {
                POSITION: [3.5, 3, 0.7, 7, 5, 60, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.pounder, { damage: 3, pen: 3, health: 3 }, { speed: 2.5, maxSpeed: 2.2, size: 1.1, range: 3.25 }]),
                    TYPE: ["swarm", { INDEPENDENT: true }],
                    STAT_CALCULATOR: "swarm",
                    AUTOFIRE: true,

                },
            }, {
                POSITION: [3.5, 3, 0.7, 7, -5, 60, 1 / 4],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.pounder, { damage: 3, pen: 3, health: 3 }, { speed: 2.5, maxSpeed: 2.2, size: 1.1, range: 3.25 }]),
                    TYPE: ["swarm", { INDEPENDENT: true }],
                    STAT_CALCULATOR: "swarm",
                    AUTOFIRE: true,
                },
            }, {
                POSITION: [3, 3, 0.7, 7, -2.5, 60, 2 / 4],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.pounder, { damage: 3, pen: 3, health: 3 }, { speed: 2.5, maxSpeed: 2.2, size: 1.1, range: 3.25 }]),
                    TYPE: ["swarm", { INDEPENDENT: true }],
                    STAT_CALCULATOR: "swarm",
                    AUTOFIRE: true,
                },
            }, {
                POSITION: [3, 3, 0.7, 7, 2.5, 60, 3 / 4],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([OGg.swarm, OGg.pounder, { damage: 3, pen: 3, health: 3 }, { speed: 2.5, maxSpeed: 2.2, size: 1.1, range: 3.25 }]),
                    TYPE: ["swarm", { INDEPENDENT: true }],
                    STAT_CALCULATOR: "swarm",
                    AUTOFIRE: true,
                },
            },



        {
            POSITION: [7, 16, 1, 6, 5, i * 120 + 74, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.pounder, OGg.pounder, OGg.destroyer, { reload: 0.9, damage: 250, health: 250, pen: 250 }]),
                TYPE: "bullet",
                LABEL: "Devastator Secondary",
            },
        },
        {
            POSITION: [7, 16, 1, 6, -5, i * 120 + 44, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.pounder, OGg.pounder, OGg.destroyer, { reload: 0.9, damage: 250, health: 250, pen: 250 }]),
                TYPE: "bullet",
                LABEL: "Devastator Secondary",
            },
        },
        {
            POSITION: [7, 16, 1, 6, 3, i * 120 + 67, 0.25],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.pounder, OGg.pounder, OGg.destroyer, { reload: 0.9, damage: 250, health: 250, pen: 250 }]),
                TYPE: "bullet",
                LABEL: "Devastator Secondary",
            },
        },
        {
            POSITION: [7, 16, 1, 6, -3, i * 120 + 53, 0.25],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.pounder, OGg.pounder, OGg.destroyer, { reload: 0.9, damage: 250, health: 250, pen: 250 }]),
                TYPE: "bullet",
                LABEL: "Devastator Secondary",
            },
        },
        {
            POSITION: [7, 13, 1, 6, 5, i * 120 + 74, 0.75],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.pounder, OGg.pounder, OGg.destroyer, { reload: 0.9, damage: 125, health: 125, pen: 125 }]),
                TYPE: "bullet",
                LABEL: "Devastator Secondary",
            },
        },
        {
            POSITION: [7, 13, 1, 6, -5, i * 120 + 44, 0.75],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.pounder, OGg.pounder, OGg.destroyer, { reload: 0.9, damage: 125, health: 125, pen: 125 }]),
                TYPE: "bullet",
                LABEL: "Devastator Secondary",
            },
        },
        {
            POSITION: [7, 13, 1, 6, 3, i * 120 + 67, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.pounder, OGg.pounder, OGg.destroyer, { reload: 0.9, damage: 125, health: 125, pen: 125 }]),
                TYPE: "bullet",
                LABEL: "Devastator Secondary",
            },
        },
        {
            POSITION: [7, 13, 1, 6, -3, i * 120 + 53, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.pounder, OGg.pounder, OGg.destroyer, { reload: 0.9, damage: 125, health: 125, pen: 125 }]),
                TYPE: "bullet",
                LABEL: "Devastator Secondary",
            },
        },
        {
            POSITION: [7, 13, 1, 6, 5, i * 120 + 74, 1],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.pounder, OGg.pounder, OGg.destroyer, { reload: 0.9, damage: 62.5, health: 62.5, pen: 62.5 }]),
                TYPE: "bullet",
                LABEL: "Devastator Secondary",
            },
        },
        {
            POSITION: [7, 13, 1, 6, -5, i * 120 + 44, 1],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.pounder, OGg.pounder, OGg.destroyer, { reload: 0.9, damage: 62.5, health: 62.5, pen: 62.5 }]),
                TYPE: "bullet",
                LABEL: "Devastator Secondary",
            },
        },
        {
            POSITION: [7, 13, 1, 6, 3, i * 120 + 67, 0.75],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.pounder, OGg.pounder, OGg.destroyer, { reload: 0.9, damage: 62.5, health: 62.5, pen: 62.5 }]),
                TYPE: "bullet",
                LABEL: "Devastator Secondary",
            },
        },
        {
            POSITION: [7, 13, 1, 6, -3, i * 120 + 53, 0.75],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.pounder, OGg.pounder, OGg.destroyer, { reload: 0.9, damage: 62.5, health: 62.5, pen: 62.5 }]),
                TYPE: "bullet",
                LABEL: "Devastator Secondary",
            },
        },
        {
            POSITION: [7, 16, 1, 6, 0, i * 120 + 60, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.pounder, OGg.pounder, OGg.destroyer, { reload: 0.9, damage: 250, health: 250, pen: 250 }]),
                TYPE: "bullet",
                LABEL: "Devastator Primary",
            },
        },
        {
            POSITION: [7, 13, 1, 6, 0, i * 120 + 60, 0.25],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.pounder, OGg.pounder, OGg.destroyer, { reload: 0.9, damage: 125, health: 125, pen: 125 }]),
                TYPE: "bullet",
                LABEL: "Devastator Primary",
            },
        },
        {
            POSITION: [7, 13, 1, 6, 0, i * 120 + 60, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.pounder, OGg.pounder, OGg.destroyer, { reload: 0.9, damage: 62.5, health: 62.5, pen: 62.5 }]),
                TYPE: "bullet",
                LABEL: "Devastator Primary",
            },
        },
        ], 3),
    ],
    TURRETS: [
        {
            POSITION: [2, 0, 0, 0, 360, 1],
            TYPE: ["megaoctupletGunBDN", { INDEPENDENT: true, COLOR: -1 }],
        },
        {
            POSITION: [2, 2.3, 0, 0, 360, 1],
            TYPE: ["megaoctupletGunBDN", { INDEPENDENT: true, COLOR: -1 }],
        },
        {
            POSITION: [2, 4.6, 0, 0, 360, 1],
            TYPE: ["megaoctupletGunBDN", { INDEPENDENT: true, COLOR: -1 }],
        },
        {
            POSITION: [2, 6.9, 0, 0, 360, 1],
            TYPE: ["megaoctupletGunBDN", { INDEPENDENT: true, COLOR: -1 }],
        },
        {
            POSITION: [2, 9.2, 0, 0, 360, 1],
            TYPE: ["megaoctupletGunBDN", { INDEPENDENT: true, COLOR: -1 }],
        },
        {
            POSITION: [2, 11.5, 0, 0, 360, 1],
            TYPE: ["megaoctupletGunBDN", { INDEPENDENT: true, COLOR: -1 }],
        },
        {
            POSITION: [2, 13.8, 0, 0, 360, 1],
            TYPE: ["megaoctupletGunBDN", { INDEPENDENT: true, COLOR: -1 }],
        },
        {
            POSITION: [2, 0, 2, 0, 360, 1],
            TYPE: ["megaoctupletGunBDN", { INDEPENDENT: true, COLOR: -1 }],
        },
        {
            POSITION: [2, -2.3, 0, 0, 360, 1],
            TYPE: ["megaoctupletGunBDN", { INDEPENDENT: true, COLOR: -1 }],
        },
        {
            POSITION: [2, -4.6, 0, 0, 360, 1],
            TYPE: ["megaoctupletGunBDN", { INDEPENDENT: true, COLOR: -1 }],
        },
        {
            POSITION: [2, -6.9, 0, 0, 360, 1],
            TYPE: ["megaoctupletGunBDN", { INDEPENDENT: true, COLOR: -1 }],
        },
        {
            POSITION: [2, 2.3, 2, 0, 360, 1],
            TYPE: ["megaoctupletGunBDN", { INDEPENDENT: true, COLOR: -1 }],
        },
        {
            POSITION: [2, 4.6, 2, 0, 360, 1],
            TYPE: ["megaoctupletGunBDN", { INDEPENDENT: true, COLOR: -1 }],
        },
        {
            POSITION: [2, 6.9, 2, 0, 360, 1],
            TYPE: ["megaoctupletGunBDN", { INDEPENDENT: true, COLOR: -1 }],
        },
        {
            POSITION: [2, 9.2, 2, 0, 360, 1],
            TYPE: ["megaoctupletGunBDN", { INDEPENDENT: true, COLOR: -1 }],
        },
        {
            POSITION: [2, 11.5, 2, 0, 360, 1],
            TYPE: ["megaoctupletGunBDN", { INDEPENDENT: true, COLOR: -1 }],
        },
        {
            POSITION: [2, -2.3, 2, 0, 360, 1],
            TYPE: ["megaoctupletGunBDN", { INDEPENDENT: true, COLOR: -1 }],
        },
        {
            POSITION: [2, -4.6, 2, 0, 360, 1],
            TYPE: ["megaoctupletGunBDN", { INDEPENDENT: true, COLOR: -1 }],
        },
        {
            POSITION: [2, -6.9, 2, 0, 360, 1],
            TYPE: ["megaoctupletGunBDN", { INDEPENDENT: true, COLOR: -1 }],
        },
        {
            POSITION: [2, 2.3, 4, 0, 360, 1],
            TYPE: ["megaoctupletGunBDN", { INDEPENDENT: true, COLOR: -1 }],
        },
        {
            POSITION: [2, 4.6, 4, 0, 360, 1],
            TYPE: ["megaoctupletGunBDN", { INDEPENDENT: true, COLOR: -1 }],
        },
        {
            POSITION: [2, 4.6, 6, 0, 360, 1],
            TYPE: ["megaoctupletGunBDN", { INDEPENDENT: true, COLOR: -1 }],
        },
        {
            POSITION: [2, 6.9, 4, 0, 360, 1],
            TYPE: ["megaoctupletGunBDN", { INDEPENDENT: true, COLOR: -1 }],
        },
        {
            POSITION: [2, 0, 4, 0, 360, 1],
            TYPE: ["megaoctupletGunBDN", { INDEPENDENT: true, COLOR: -1 }],
        },
        {
            POSITION: [2, -2.3, 4, 0, 360, 1],
            TYPE: ["megaoctupletGunBDN", { INDEPENDENT: true, COLOR: -1 }],
        },
        {
            POSITION: [2, -4.6, 4, 0, 360, 1],
            TYPE: ["megaoctupletGunBDN", { INDEPENDENT: true, COLOR: -1 }],
        },
        {
            POSITION: [2, -6.9, 4, 0, 360, 1],
            TYPE: ["megaoctupletGunBDN", { INDEPENDENT: true, COLOR: -1 }],
        },
        {
            POSITION: [2, 2.3, 6, 0, 360, 1],
            TYPE: ["megaoctupletGunBDN", { INDEPENDENT: true, COLOR: -1 }],
        },
        {
            POSITION: [2, 0, 6, 0, 360, 1],
            TYPE: ["megaoctupletGunBDN", { INDEPENDENT: true, COLOR: -1 }],
        },
        {
            POSITION: [2, 0, 8, 0, 360, 1],
            TYPE: ["megaoctupletGunBDN", { INDEPENDENT: true, COLOR: -1 }],
        },
        {
            POSITION: [2, -2.3, 6, 0, 360, 1],
            TYPE: ["megaoctupletGunBDN", { INDEPENDENT: true, COLOR: -1 }],
        },
        {
            POSITION: [2, -4.6, 6, 0, 360, 1],
            TYPE: ["megaoctupletGunBDN", { INDEPENDENT: true, COLOR: -1 }],
        },
        {
            POSITION: [2, -6.9, 6, 0, 360, 1],
            TYPE: ["megaoctupletGunBDN", { INDEPENDENT: true, COLOR: -1 }],
        },
        {
            POSITION: [2, -2.3, 8, 0, 360, 1],
            TYPE: ["megaoctupletGunBDN", { INDEPENDENT: true, COLOR: -1 }],
        },
        {
            POSITION: [2, -4.6, 8, 0, 360, 1],
            TYPE: ["megaoctupletGunBDN", { INDEPENDENT: true, COLOR: -1 }],
        },
        {
            POSITION: [2, -6.9, 8, 0, 360, 1],
            TYPE: ["megaoctupletGunBDN", { INDEPENDENT: true, COLOR: -1 }],
        },
        {
            POSITION: [2, -4.6, 10, 0, 360, 1],
            TYPE: ["megaoctupletGunBDN", { INDEPENDENT: true, COLOR: -1 }],
        },
        {
            POSITION: [2, -6.9, 10, 0, 360, 1],
            TYPE: ["megaoctupletGunBDN", { INDEPENDENT: true, COLOR: -1 }],
        },
        {
            POSITION: [2, -6.9, 12, 0, 360, 1],
            TYPE: ["megaoctupletGunBDN", { INDEPENDENT: true, COLOR: -1 }],
        },
        {
            POSITION: [2, 2.3, -2, 0, 360, 1],
            TYPE: ["megaoctupletGunBDN", { INDEPENDENT: true, COLOR: -1 }],
        },
        {
            POSITION: [2, 4.6, -2, 0, 360, 1],
            TYPE: ["megaoctupletGunBDN", { INDEPENDENT: true, COLOR: -1 }],
        },
        {
            POSITION: [2, 6.9, -2, 0, 360, 1],
            TYPE: ["megaoctupletGunBDN", { INDEPENDENT: true, COLOR: -1 }],
        },
        {
            POSITION: [2, 9.2, -2, 0, 360, 1],
            TYPE: ["megaoctupletGunBDN", { INDEPENDENT: true, COLOR: -1 }],
        },
        {
            POSITION: [2, 11.5, -2, 0, 360, 1],
            TYPE: ["megaoctupletGunBDN", { INDEPENDENT: true, COLOR: -1 }],
        },
        {
            POSITION: [2, 0, -2, 0, 360, 1],
            TYPE: ["megaoctupletGunBDN", { INDEPENDENT: true, COLOR: -1 }],
        },
        {
            POSITION: [2, -2.3, -2, 0, 360, 1],
            TYPE: ["megaoctupletGunBDN", { INDEPENDENT: true, COLOR: -1 }],
        },
        {
            POSITION: [2, -4.6, -2, 0, 360, 1],
            TYPE: ["megaoctupletGunBDN", { INDEPENDENT: true, COLOR: -1 }],
        },
        {
            POSITION: [2, -6.9, -2, 0, 360, 1],
            TYPE: ["megaoctupletGunBDN", { INDEPENDENT: true, COLOR: -1 }],
        },
        {
            POSITION: [2, 0, -4, 0, 360, 1],
            TYPE: ["megaoctupletGunBDN", { INDEPENDENT: true, COLOR: -1 }],
        },
        {
            POSITION: [2, 2.3, -4, 0, 360, 1],
            TYPE: ["megaoctupletGunBDN", { INDEPENDENT: true, COLOR: -1 }],
        },
        {
            POSITION: [2, 4.6, -4, 0, 360, 1],
            TYPE: ["megaoctupletGunBDN", { INDEPENDENT: true, COLOR: -1 }],
        },
        {
            POSITION: [2, 4.6, -6, 0, 360, 1],
            TYPE: ["megaoctupletGunBDN", { INDEPENDENT: true, COLOR: -1 }],
        },
        {
            POSITION: [2, 6.9, -4, 0, 360, 1],
            TYPE: ["megaoctupletGunBDN", { INDEPENDENT: true, COLOR: -1 }],
        },
        {
            POSITION: [2, -2.3, -4, 0, 360, 1],
            TYPE: ["megaoctupletGunBDN", { INDEPENDENT: true, COLOR: -1 }],
        },
        {
            POSITION: [2, -4.6, -4, 0, 360, 1],
            TYPE: ["megaoctupletGunBDN", { INDEPENDENT: true, COLOR: -1 }],
        },
        {
            POSITION: [2, -6.9, -4, 0, 360, 1],
            TYPE: ["megaoctupletGunBDN", { INDEPENDENT: true, COLOR: -1 }],
        },
        {
            POSITION: [2, 2.3, -6, 0, 360, 1],
            TYPE: ["megaoctupletGunBDN", { INDEPENDENT: true, COLOR: -1 }],
        },
        {
            POSITION: [2, 0, -6, 0, 360, 1],
            TYPE: ["megaoctupletGunBDN", { INDEPENDENT: true, COLOR: -1 }],
        },
        {
            POSITION: [2, -2.3, -6, 0, 360, 1],
            TYPE: ["megaoctupletGunBDN", { INDEPENDENT: true, COLOR: -1 }],
        },
        {
            POSITION: [2, -4.6, -6, 0, 360, 1],
            TYPE: ["megaoctupletGunBDN", { INDEPENDENT: true, COLOR: -1 }],
        },
        {
            POSITION: [2, -6.9, -6, 0, 360, 1],
            TYPE: ["megaoctupletGunBDN", { INDEPENDENT: true, COLOR: -1 }],
        },
        {
            POSITION: [2, 0, -8, 0, 360, 1],
            TYPE: ["megaoctupletGunBDN", { INDEPENDENT: true, COLOR: -1 }],
        },
        {
            POSITION: [2, -2.3, -8, 0, 360, 1],
            TYPE: ["megaoctupletGunBDN", { INDEPENDENT: true, COLOR: -1 }],
        },
        {
            POSITION: [2, -4.6, -8, 0, 360, 1],
            TYPE: ["megaoctupletGunBDN", { INDEPENDENT: true, COLOR: -1 }],
        },
        {
            POSITION: [2, -6.9, -8, 0, 360, 1],
            TYPE: ["megaoctupletGunBDN", { INDEPENDENT: true, COLOR: -1 }],
        },
        {
            POSITION: [2, -4.6, -10, 0, 360, 1],
            TYPE: ["megaoctupletGunBDN", { INDEPENDENT: true, COLOR: -1 }],
        },
        {
            POSITION: [2, -6.9, -10, 0, 360, 1],
            TYPE: ["megaoctupletGunBDN", { INDEPENDENT: true, COLOR: -1 }],
        },
        {
            POSITION: [2, -6.9, -12, 0, 360, 1],
            TYPE: ["megaoctupletGunBDN", { INDEPENDENT: true, COLOR: -1 }],
        },
        ...weaponArray([
            {
                POSITION: [9.5, 12, 0, 0, 190, 0],
                TYPE: ["supermegaoctupletGunBDN", { GUN_STAT_SCALE: { damage: 9.6, health: 9, speed: 9, maxSpeed: 2, resist: 1.1, range: 2.3 } }],
            }], 3),
    ]
}
Class.supermegaoctupletGunBDN = {
    PARENT: "autoTankGun",
    SIZE: 50,
    GUNS: [
        {
            POSITION: [12, 7, 1, 0, -6, 0, 0.8],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.autoTurret, g.twin, g.twin, g.power, { reload: 1.5, speed: 3, maxspeed: 3 }, { size: 2, reload: 2, damage: 5000, health: 5000, pen: 5000 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [12, 7, 1, 0, 6, 0, 0.8],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.autoTurret, g.twin, g.twin, g.power, { reload: 1.5, speed: 3, maxspeed: 3 }, { size: 2, reload: 2, damage: 5000, health: 5000, pen: 5000 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [13, 7, 1, 0, -4.5, 0, 0.6],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.autoTurret, g.twin, g.twin, g.power, { reload: 1.5, speed: 3, maxspeed: 3 }, { size: 2, reload: 2, damage: 5000, health: 5000, pen: 5000 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [13, 7, 1, 0, 4.5, 0, 0.6],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.autoTurret, g.twin, g.twin, g.power, { reload: 1.5, speed: 3, maxspeed: 3 }, { size: 2, reload: 2, damage: 5000, health: 5000, pen: 5000 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [14, 7, 1, 0, -3, 0, 0.4],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.autoTurret, g.twin, g.twin, g.power, { reload: 1.5, speed: 3, maxspeed: 3 }, { size: 2, reload: 2, damage: 5000, health: 5000, pen: 5000 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [14, 7, 1, 0, 3, 0, 0.4],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.autoTurret, g.twin, g.twin, g.power, { reload: 1.5, speed: 3, maxspeed: 3 }, { size: 2, reload: 2, damage: 5000, health: 5000, pen: 5000 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [15, 7, 1, 0, -1.5, 0, 0.2],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.autoTurret, g.twin, g.twin, g.power, { reload: 1.5, speed: 3, maxspeed: 3 }, { size: 2, reload: 2, damage: 5000, health: 5000, pen: 5000 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [15, 7, 1, 0, 1.5, 0, 0.2],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.autoTurret, g.twin, g.twin, g.power, { reload: 1.5, speed: 3, maxspeed: 3 }, { size: 2, reload: 2, damage: 5000, health: 5000, pen: 5000 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [16, 7, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.autoTurret, g.twin, g.twin, g.power, { reload: 1.5, speed: 3, maxspeed: 3 }, { size: 2, reload: 2, damage: 5000, health: 5000, pen: 5000 }]),
                TYPE: "bullet",
            },
        },

    ],
}
Class.melanismlegionaryCrasherSpawner = {
    PARENT: 'genericTank',
    SHAPE: "",
    INDEPENDENT: true,
    GUNS: [{
        POSITION: [0, 10, 0, 0, 0, 0, 10],
        PROPERTIES: {
            TYPE: 'melanismdestroyerLegion',
            SHOOT_SETTINGS: combineStats([{ reload: 0.1 }]),
            NO_LIMITATIONS: true,
            INDEPENDENT_CHILDREN: true,
            MAX_CHILDREN: 1,
            IDENTIFIER: 1,
            AUTOFIRE: true,
        }
    }],
    ON: [{
        event: "fire",
        handler: ({ gun }) => {
            gun.setBulletType(["melanismdestroyerLegion", "melanismgunnerLegion", "melanismsprayerLegion", "melanismbattleshipLegion", "melanismspawnerLegion"][gun.identifier++ % 5]);
        }
    }],
}
Class.ultraSprayerGunBDNwithceptions = {
    PARENT: ["autoTankGun"],
    SIZE: 124,
    TURRETS:
        [
                    {
            POSITION: [3, -2.7, 0, 0, 360, 1],
            TYPE: ["ultraSprayerGunBDNception", { INDEPENDENT: true }]
        },
        {
            POSITION: [3, 0.5, 2.65, 0, 360, 1],
            TYPE: ["ultraSprayerGunBDNception", { INDEPENDENT: true}],
        },
       {
            POSITION: [3, 0.5, -2.65, 0, 360, 1],
            TYPE: ["ultraSprayerGunBDNception", { INDEPENDENT: true}],
        },
        {
            POSITION: [3, 0.5, 5.3, 0, 360, 1],
            TYPE: ["ultraSprayerGunBDNception", { INDEPENDENT: true}],
        },

        {
            POSITION: [3, 0.5, -5.3, 0, 360, 1],
            TYPE: ["ultraSprayerGunBDNception", { INDEPENDENT: true }]
        },
        {
            POSITION: [3, -2.7, -5.35, 0, 360, 1],
            TYPE: ["ultraSprayerGunBDNception", { INDEPENDENT: true }]
        },
        {
            POSITION: [3, -2.7, -8, 0, 360, 1],
            TYPE: ["ultraSprayerGunBDNception", { INDEPENDENT: true }]
        },
        {
            POSITION: [3, -2.7, 5.35, 0, 360, 1],
            TYPE: ["ultraSprayerGunBDNception", { INDEPENDENT: true }]
        },
        {
            POSITION: [3, -2.7, 8, 0, 360, 1],
            TYPE: ["ultraSprayerGunBDNception", { INDEPENDENT: true }]
        },

        {
            POSITION: [3, -2.7, 2.7, 0, 360, 1],
            TYPE: ["ultraSprayerGunBDNception", { INDEPENDENT: true }]
        },
        {
            POSITION: [3, -2.7, -2.7, 0, 360, 1],
            TYPE: ["ultraSprayerGunBDNception", { INDEPENDENT: true }]
        },
        {
            POSITION: [3, 0.5, 0, 0, 360, 1],
            TYPE: ["ultraSprayerGunBDNception", { INDEPENDENT: true }]
        },
        {
            POSITION: [3, 3.8, 0, 0, 360, 1],
            TYPE: ["ultraSprayerGunBDNception", { INDEPENDENT: true }]
        },
        {
            POSITION: [3, 3.8, 2.65, 0, 360, 1],
            TYPE: ["ultraSprayerGunBDNception", { INDEPENDENT: true }]
        },
        {
            POSITION: [3, 3.8, -2.65, 0, 360, 1],
            TYPE: ["ultraSprayerGunBDNception", { INDEPENDENT: true }]
        },
        {
            POSITION: [3, 7, 0, 0, 360, 1],
            TYPE: ["ultraSprayerGunBDNception", { INDEPENDENT: true }],
        },
    ],
    GUNS: [
            {
                POSITION: [25, 18.8, 1.4, 0, 0, 0, 0.5],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([OGg.basic, OGg.machineGun, OGg.pounder, OGg.destroyer, OGg.lowPower, { reload: 1.1, damage: 4860, health: 4860, pen: 4860, recoil: 0 }]),
                    TYPE: "bullet",
                },
            },
            {
                POSITION: [20, 20, 1.4, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([OGg.basic, OGg.machineGun, OGg.pounder, OGg.destroyer, OGg.lowPower, { reload: 1.1, damage: 4860, health: 4860, pen: 4860, recoil: 0 }]),
                    TYPE: "bullet",
                },
            },
            {
                POSITION: [15, 20, 1.4, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([OGg.basic, OGg.machineGun, OGg.pounder, OGg.destroyer, OGg.lowPower, { reload: 1.1, damage: 4860, health: 4860, pen: 4860, recoil: 0 }]),
                    TYPE: "bullet",
                },
            },
    ],
}
Class.ultraSprayerGunBDNception = {
    PARENT: ["autoTankGun"],
    GUNS:
        [
            {
                POSITION: [25, 18.8, 1.4, 0, 0, 0, 0.5],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([OGg.basic, OGg.machineGun, OGg.pounder, OGg.destroyer, OGg.lowPower, { reload: 1.1, damage: 486, health: 486, pen: 486, recoil: 0, speed: 15 }]),
                    TYPE: "bullet",
                },
            },
            {
                POSITION: [20, 20, 1.4, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([OGg.basic, OGg.machineGun, OGg.pounder, OGg.destroyer, OGg.lowPower, { reload: 1.1, damage: 486, health: 486, pen: 486, recoil: 0, speed: 15 }]),
                    TYPE: "bullet",
                },
            },
            {
                POSITION: [15, 20, 1.4, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([OGg.basic, OGg.machineGun, OGg.pounder, OGg.destroyer, OGg.lowPower, { reload: 1.1, damage: 486, health: 486, pen: 486, recoil: 0, speed: 15 }]),
                    TYPE: "bullet",
                },
            },
        ],
};
Class.melanismlegionaryPillbox = {
    PARENT: "unsetTrap",
    LABEL: "Pillbox",
    BODY: {
        SPEED: 1,
        DENSITY: 8,
    },
    DIE_AT_RANGE: true,
    TURRETS: [
        {
            POSITION: [11, 0, 0, 0, 360, 1],
            TYPE: "legionarysmegaoctuplet",
        },
    ],
}
Class.legionarysmegaoctuplet = makeTurret({
    GUNS: [
        ...weaponMirror({
            POSITION: {
                LENGTH: 14,
                WIDTH: 7,
                Y: 6,
                DELAY: 3 / 4
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.twin, OGg.tripleShot, { damage: 9410, health: 9410, pen: 9410 }]),
                TYPE: "bullet"
            }
        }, 0),
        ...weaponMirror({
            POSITION: {
                LENGTH: 16,
                WIDTH: 7,
                Y: 4.3,
                DELAY: 3 / 4
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.twin, OGg.tripleShot, { damage: 9410, health: 9410, pen: 9410 }]),
                TYPE: "bullet"
            }
        }, 0),
        ...weaponMirror({
            POSITION: {
                LENGTH: 18,
                WIDTH: 7,
                Y: 2.6,
                DELAY: 2 / 4
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.twin, OGg.tripleShot, { damage: 9410, health: 9410, pen: 9410 }]),
                TYPE: "bullet"
            }
        }, 0),
        ...weaponMirror({
            POSITION: {
                LENGTH: 20,
                WIDTH: 7,
                Y: 0.8,
                DELAY: 1 / 4
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.twin, OGg.tripleShot, { damage: 9410, health: 9410, pen: 9410 }]),
                TYPE: "bullet"
            }
        }, 0),
        {
            POSITION: {
                LENGTH: 22,
                WIDTH: 5
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([OGg.basic, OGg.twin, OGg.tripleShot, { damage: 9410, health: 9410, pen: 9410 }]),
                TYPE: "bullet"
            }
        }
    ],
}, { fov: 5, independent: true, extraStats: [] })
Class.melanismlegionaryCrasher = {
    PARENT: ["melanismEliteBDN"],
    LABEL: "Melanism Legionary Crasher",
    NAME: "Melanism Legionary Crasher",
    DISPLAY_NAME: false,
    UPGRADE_COLOR: "black",
    AI: { STRAFE: false, NO_LEAD: false },
    HAS_NO_RECOIL: true,
    VALUE: 6e16,
    SIZE: 225,
    BODY: {
        FOV: 1.5,
        SPEED: 0.075 * base.SPEED,
        HEALTH: 500000000,
        DAMAGE: 10000 * base.DAMAGE,
    },
    GUNS: [
        ...weaponArray([
            {
                POSITION: [14.5, 13, 1, 0, 0, 0, 0],
            }, {
                POSITION: [3, 13, 1.7, 14.5, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([OGg.trap, OGg.setTrap, OGg.pounder, { reload: 1.8, speed: 3.2, size: 0.9, maxSpeed: 2.5, range: 1.1 }, { damage: 4374, health: 4374, pen: 4374 }]),
                    TYPE: "melanismlegionaryPillbox",
                    NO_LIMITATIONS: true,
                    STAT_CALCULATOR: "trap",
                },
            },
        ], 3),
        ...weaponArray({
            POSITION: [5, 12, 1.6, -11, 0, 0, 0],
        }, 3),
    ],
    TURRETS: [
        {
            POSITION: [12, 0, 0, 0, 360, 1],
            TYPE: "melanismlegionaryCrasherTop",
        },
        ...weaponArray({
            POSITION: [14, 8, 0, 60, 180, 0],
            TYPE: ["ultraSprayerGunBDNwithceptions", { GUN_STAT_SCALE: { speed: 2, health: 210600, damage: 20250, resist: 1.5 }, COLOR: -1 }],
        }, 3),

        {
            POSITION: [12, 0, 0, 0, 0, 0],
            TYPE: 'melanismlegionaryCrasherSpawner'
        }
    ],
}
Class.melanismlegionaryCrasherSpawnerFix = {
    PARENT: 'genericTank',
    SHAPE: "",
    INDEPENDENT: true,
    GUNS: [{
        POSITION: [0, 10, 0, 0, 0, 0, 10],
        PROPERTIES: {
            TYPE: 'melanismdestroyerLegion',
            SHOOT_SETTINGS: combineStats([{ reload: 0.1, size: 0.75 }]),
            NO_LIMITATIONS: true,
            INDEPENDENT_CHILDREN: false,
            MAX_CHILDREN: 5,
            IDENTIFIER: 1,
            AUTOFIRE: true,
        }
    }],
    ON: [{
        event: "fire",
        handler: ({ gun }) => {
            gun.setBulletType(["melanismdestroyerLegion", "melanismgunnerLegion", "melanismsprayerLegion", "melanismbattleshipLegion", "melanismspawnerLegion"][gun.identifier++ % 5]);
        }
    }],
}
Class.melanismlegionaryCrasherFix = {
    PARENT: ["melanismEliteBDN"],
    LABEL: "Melanism Legionary Crasher",
    NAME: "Melanism Legionary Crasher",
    DISPLAY_NAME: false,
    UPGRADE_COLOR: "black",
    AI: { STRAFE: false, NO_LEAD: false },
    HAS_NO_RECOIL: true,
    VALUE: 6e16,
    SIZE: 225,
    BODY: {
        FOV: 1.5,
        SPEED: 0.075 * base.SPEED,
        HEALTH: 500000000,
        DAMAGE: 10000 * base.DAMAGE,
    },
    GUNS: [
        ...weaponArray([
            {
                POSITION: [14.5, 13, 1, 0, 0, 0, 0],
            }, {
                POSITION: [3, 13, 1.7, 14.5, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([OGg.trap, OGg.setTrap, OGg.pounder, { reload: 1.8, speed: 3.2, size: 0.9, maxSpeed: 2.5, range: 1.1 }, { damage: 4374, health: 4374, pen: 4374 }]),
                    TYPE: "melanismlegionaryPillbox",
                    NO_LIMITATIONS: true,
                    STAT_CALCULATOR: "trap",
                },
            },
        ], 3),
        ...weaponArray({
            POSITION: [5, 12, 1.6, -11, 0, 0, 0],
        }, 3),
    ],
    TURRETS: [
        {
            POSITION: [12, 0, 0, 0, 360, 1],
            TYPE: "melanismlegionaryCrasherTop",
        },
        ...weaponArray({
            POSITION: [14, 8, 0, 60, 180, 0],
            TYPE: ["ultraSprayerGunBDNwithceptions", { GUN_STAT_SCALE: { speed: 2, health: 210600, damage: 20250, resist: 1.5 }, COLOR: -1 }],
        }, 3),
        {
            POSITION: [12, 0, 0, 0, 0, 0],
            TYPE: 'melanismlegionaryCrasherSpawnerFix'
        }
    ],
}
Class.melanismElitesBDN = makeMenu("Melanism Elites")
Class.melanismElitesBDN.COLOR = "black"
Class.melanismElitesBDN.UPGRADE_COLOR = "black"
Class.melanismElitesBDN.UPGRADES_TIER_0 = ["melanismEliteDestroyerBDN", "melanismEliteGunnerBDN", "melanismEliteSprayerBDN", "melanismEliteBattleshipBDN", "melanismEliteSpawnerBDN", "melanismEliteTrapGuardBDN", "melanismEliteSpinnerBDN", "melanismsprayerLegion", "melanismlegionaryCrasher", "melanismlegionaryCrasherFix"]
Class.melanismElitesBDN.SHAPE = 3.5
Class.albinoElitesBDN.UPGRADES_TIER_0.push("melanismElitesBDN")
setImmediate(() => {
    if (Class.menu_addons) {
        if (!Class.menu_addons.UPGRADES_TIER_0) Class.menu_addons.UPGRADES_TIER_0 = [];
        Class.menu_addons.UPGRADES_TIER_0.push("shinyElitesBDN");
        return;
    }
})


















