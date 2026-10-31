const { combineStats, skillSet, makeAuto, addAura, LayeredBoss, makeHat, weaponArray, setTurretProjectileRecoil, makeMenu } = require('../facilitators.js');
const { smshskl, base } = require('../constants.js');
const g = require('../gunvals.js');
const {makeTurret} = require("../facilitators");
g.babyfactory = { reload: 1.5, maxSpeed: 1.25 }
g.focal = { reload: 1.25, recoil: 4/3, shudder: 0.8, health: 0.8, pen: 1.1, speed: 1.25, maxSpeed: 1.25, range: 1.1, density: 1.25, spray: 0.5, resist: 1.1 }

Class.overdriveDeco = makeHat(4, {color: "grey"})
Class.moarCelestials = makeMenu("Moar Celestials", "rainbow", 9)
Class.moarCelestials.UPGRADES_TIER_0 = []
Class.stupidBullet = {
    PARENT: "bullet",
    // ONLY exists because turrets take into account their weapon's bullet's range when targeting
    BODY: {
        PENETRATION: 0,
        SPEED: 100,
        RANGE: 100,
        DENSITY: 0,
        HEALTH: 0,
        DAMAGE: 0,
        PUSHABILITY: 0,
    },
    INTANGIBLE: true,
    ON: [
        {
            event: "tick",
            handler: ({ body }) => {
                body.kill()
            }
        },
        {
            event: "fire",
            handler: ({ body, gun }) => {
                switch (gun.identifier) {
                    case 'spawn':
                        body.kill()
                        break;
                }
            }
        }
    ],
    GUNS: [
        {
            POSITION: [0, 0, 0, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, {reload: 9995531791}, g.fake, {range: 0}]),
                TYPE: "bullet",
                AUTOFIRE: true,
                IDENTIFIER: 'spawn',
            },
        },
    ],
}
// Comment out the line below to enable this addon, uncomment it to disable this addon.
// return console.log("--- canxA's Moar Celestials addon is disabled. See line 51-52 to enable it ---");
let createAstrals = true;
let createTerrestrials = true;
let createCelestials = true;
let createEternals = true;
let createPrimordials = true;

if (createAstrals === true) {
    Class.moarCelestialsAstrals = makeMenu("Astrals", "rainbow", 5)
    Class.moarCelestialsAstrals.UPGRADES_TIER_0 = []
    Class.CMCAstral = {
        PARENT: "miniboss",
        LABEL: "Astral",
        SKILL: [7, 7, 7, 7, 7, 7, 7, 7, 7, 7],
        VALUE: 2.5e5,
        SHAPE: 5,
        SIZE: 11.25,
        CONTROLLERS: [["minion", {turnwiserange: 360}]],
        DANGER: 9,
        BODY: {
            FOV: 1,
            HEALTH: 250,
            SHIELD: 1,
            REGEN: base.REGEN * 0.05,
            SPEED: 1.75,
            DAMAGE: 3,
        },
    };

    Class.paladinAstralPrimalSwarmerTurretHive = {
        PARENT: "bullet",
        LABEL: "Primal-Hive",
        BODY: {
            RANGE: 90,
            FOV: 0.5,
        },
        INDEPENDENT: true,
        CONTROLLERS: ["nearestDifferentMaster", "targetSelf"],
        AI: { NO_LEAD: true },
        GUNS: [
            {
                POSITION: [7, 9.5, 0.6, 7, 0, 180, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.swarm, g.hive, g.bee]),
                    TYPE: ["bee", { PERSISTS_AFTER_DEATH: true }],
                    STAT_CALCULATOR: "swarm",
                    AUTOFIRE: true
                },
            },
        ],
    }
    Class.paladinAstralPrimalSwarmerTurret = makeTurret({
        GUNS: [
            {
                POSITION: [10, 10, 0, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, {range: 0.0005, speed: 0.0005, maxSpeed: 0.0005, recoil: 0}]),
                    TYPE: "stupidBullet",
                    DRAW_FILL: false,
                    BORDERLESS: true,
                },
            },
            {
                POSITION: [7, 14, -1.2, 5, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.destroyer, g.hive, {speed: 1.3, maxSpeed: 0.5, health: 1.3, range: 1.3}]),
                    TYPE: "paladinAstralPrimalSwarmerTurretHive",
                },
            },
            {
                POSITION: [9, 12, 1, 5, 0, 0, 0],
            },
        ],
    }, {limitFov: true, fov: 10, extraStats: [], label: "Primal Swarmer"})
    let paladinAstral = new LayeredBoss("paladinAstral", "Paladin", "CMCAstral", 5, "purple", "baseTrapTurret", 7, 5.5);
    paladinAstral.addLayer({gun: {
            POSITION: [3.8, 6, 1.4, 8, 0, null, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.drone, g.summoner, g.destroyer, {health: 1.4, damage: 1.4, resist: 1.2, density: 1.8, maxSpeed: 1.325}]),
                TYPE: ["demonchip", {INDEPENDENT: true}],
                AUTOFIRE: true,
                SYNCS_SKILLS: true,
                STAT_CALCULATOR: "drone",
                WAIT_TO_CYCLE: true,
            },
        }
    }, true, 8, 7);
    Class["paladinAstral"].TURRETS.push({
        POSITION: [7, 0, 0, 0, 360, 1],
        TYPE: ["paladinAstralPrimalSwarmerTurret", { INDEPENDENT: true, }],
    })

    Class.freyjaAstralProtoAerosolTurret = makeTurret({
        GUNS: [
            {
                POSITION: [10, 10, 0, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, {range: 0.0005, speed: 0.0005, maxSpeed: 0.0005, recoil: 0}]),
                    TYPE: "stupidBullet",
                    DRAW_FILL: false,
                    BORDERLESS: true,
                },
            },
            {
                POSITION: [5.75, 6, 0.6, 7, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.swarm, {reload: 1.1, damage: 0.8, pen: 0.8, health: 0.8}]),
                    TYPE: "autoswarm",
                    STAT_CALCULATOR: "swarm",
                },
            },
        ],
    }, {limitFov: true, fov: 10, extraStats: [], label: "Proto Aerosol"})
    Class.freyjaAstralProtoBasicTurret = makeTurret({
        GUNS: [
            {
                POSITION: [10, 10, 0, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, {range: 0.0005, speed: 0.0005, maxSpeed: 0.0005, recoil: 0}]),
                    TYPE: "stupidBullet",
                    DRAW_FILL: false,
                    BORDERLESS: true,
                },
            },
            {
                POSITION: [13, 4, 1, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.twin, g.power, { speed: 0.7, maxSpeed: 0.7 }, {reload: 1.1, damage: 0.8, pen: 0.8, health: 0.8}]),
                    TYPE: "bullet",
                },
            },
        ],
    }, {limitFov: true, fov: 10, extraStats: [], label: "Proto Basic"})
    let freyjaAstral = new LayeredBoss("freyjaAstral", "Frejya", "CMCAstral", 5, "lightGreen", "baseTrapTurret", 7, 5.5);
    freyjaAstral.addLayer({turret: {
            POSITION: [9, 8, 0, null, 160, 0],
            TYPE: ["freyjaAstralProtoAerosolTurret", {GUN_STAT_SCALE: {health: 1.2, damage: 1.3, speed: 1.1, maxSpeed: 1.1, resist: 1.05, reload: 0.8}}],
        }
    }, true, 8);
    Class["freyjaAstral"].TURRETS.push({
        POSITION: [7, 0, 0, 0, 360, 1],
        TYPE: ["freyjaAstralProtoBasicTurret", { INDEPENDENT: true, }],
    })

    Class.zaphkielAstralPounderTurret = makeTurret({
        GUNS: [
            {
                POSITION: [10, 10, 0, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, {range: 0.0005, speed: 0.0005, maxSpeed: 0.0005, recoil: 0}]),
                    TYPE: "stupidBullet",
                    DRAW_FILL: false,
                    BORDERLESS: true,
                },
            },
            {
                POSITION: [20.5, 12, 1, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.pounder]),
                    TYPE: "bullet"
                }
            }
        ],
    }, {limitFov: true, fov: 10, extraStats: [], label: "Launcher"})
    let zaphkielAstral = new LayeredBoss("zaphkielAstral", "Zaphkiel", "CMCAstral", 5, "orange", "baseTrapTurret", 7, 5.5);
    zaphkielAstral.addLayer({gun: {
            POSITION: [3.8, 6, 1.4, 8, 0, null, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.drone, g.summoner, g.destroyer, {health: 1.4, damage: 1.4, resist: 1.2, density: 1.8, maxSpeed: 1.325}]),
                TYPE: ["dorito", {INDEPENDENT: true}],
                AUTOFIRE: true,
                SYNCS_SKILLS: true,
            },
        },
    }, true, 8, 7);
    Class["zaphkielAstral"].TURRETS.push({
        POSITION: [7, 0, 0, 0, 360, 1],
        TYPE: ["zaphkielAstralPounderTurret", { INDEPENDENT: true, }],
    })

    Class.nyxAstralPrimalRocketeerTurretMissile = {
        PARENT: "missile",
        LABEL: "Primal-Missile",
        GUNS: [
            {
                POSITION: [15.5, 7, 1.1, 0, 0, 180, 3],
                PROPERTIES: {
                    AUTOFIRE: true,
                    SHOOT_SETTINGS: combineStats([g.basic, g.missileTrail, g.rocketeerMissileTrail, {reload: 1.1, damage: 0.8, health: 0.9, pen: 0.95, spray: 0.5}, {reload: 1.1, damage: 0.8, health: 0.9, pen: 0.95, spray: 0.5}]),
                    TYPE: ["bullet", { PERSISTS_AFTER_DEATH: true }],
                    STAT_CALCULATOR: "thruster",
                },
            },
        ],
    }
    Class.nyxAstralPrimalRocketeerTurret = makeTurret({
        GUNS: [
            {
                POSITION: [10, 10, 0, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, {range: 0.0005, speed: 0.0005, maxSpeed: 0.0005, recoil: 0}]),
                    TYPE: "stupidBullet",
                    DRAW_FILL: false,
                    BORDERLESS: true,
                },
            },
            {
                POSITION: [8, 12.5, -0.875, 8, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.launcher, g.rocketeer, {reload: 1.2, damage: 0.9, speed: 0.8}, {reload: 1.2, damage: 0.9, speed: 0.8}]),
                    TYPE: "nyxAstralPrimalRocketeerTurretMissile",
                    STAT_CALCULATOR: "sustained",
                },
            },
            {
                POSITION: [13, 18, 0.845, 0, 0, 0, 0],
            },
        ],
    }, {limitFov: true, fov: 10, extraStats: [], label: "Primal Rocketeer"})
    let nyxAstral = new LayeredBoss("nyxAstral", "Nyx", "CMCAstral", 5, "pink", "baseTrapTurret", 7, 5.5);
    nyxAstral.addLayer({gun: {
            POSITION: [3.8, 7, -1.4, 8, 0, null, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.spawner, { size: 0.7, maxSpeed: 0.85, damage: 0.8 }]),
                TYPE: ["minion", {INDEPENDENT: true,}],
                AUTOFIRE: true,
                SYNCS_SKILLS: true,
            },
        }
    }, true, 8, 7);
    Class["nyxAstral"].TURRETS.push({
        POSITION: [7, 0, 0, 0, 360, 1],
        TYPE: ["nyxAstralPrimalRocketeerTurret", { INDEPENDENT: true, GUN_STAT_SCALE: {maxSpeed: 0.5} }],
    })

    Class.theiaAstralPrimalTwisterTurretMissile = {
        PARENT: "missile",
        LABEL: "Primal-Missile",
        CONTROLLERS: [["spin2", {speed: 0.06}]],
        GUNS: [
            {
                POSITION: [14, 6, 1, 0, 0, 0, 0],
                PROPERTIES: {
                    AUTOFIRE: !0,
                    SHOOT_SETTINGS: combineStats([g.basic, g.lowPower, {size: 1.1, recoil: 0.1}, {damage: 0.8, health: 0.9, pen: 0.7}]),
                    TYPE: ["bullet", { PERSISTS_AFTER_DEATH: true }],
                    STAT_CALCULATOR: "thruster",
                    WAIT_TO_CYCLE: true,
                },
            },
        ],
    }
    Class.theiaAstralPrimalTwisterTurret = makeTurret({
        GUNS: [
            {
                POSITION: [10, 10, 0, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, {range: 0.0005, speed: 0.0005, maxSpeed: 0.0005, recoil: 0}]),
                    TYPE: "stupidBullet",
                    DRAW_FILL: false,
                    BORDERLESS: true,
                },
            },
            {
                POSITION: [8, 13, -0.75, 7, 0, 0, 0],
            },
            {
                POSITION: [13, 14, -1.2, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.artillery, g.artillery, g.skimmer, { reload: 4/3 }, {reload: 0.8}]),
                    TYPE: "theiaAstralPrimalTwisterTurretMissile",
                    STAT_CALCULATOR: "sustained",
                },
            },
        ],
    }, {limitFov: true, fov: 10, extraStats: [], label: "Primal Twister"})
    let theiaAstral = new LayeredBoss("theiaAstral", "Thiea", "CMCAstral", 5, "gold", "baseTrapTurret", 7, 5.5);
    theiaAstral.addLayer({gun: {
            POSITION: [3.8, 6, 1.4, 8, 0, null, 1],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.drone, g.summoner, g.destroyer, {health: 1.4, damage: 1.4, resist: 1.2, density: 1.8, maxSpeed: 1.325}]),
                TYPE: ["summonerDrone", {INDEPENDENT: true}],
                AUTOFIRE: true,
                WAIT_TO_CYCLE: true,
                SYNCS_SKILLS: true,
            },
        }
    }, true, 8, 15);
    Class["theiaAstral"].TURRETS.push({
        POSITION: [7, 0, 0, 0, 360, 1],
        TYPE: ["theiaAstralPrimalTwisterTurret", { INDEPENDENT: true, }],
    })

    Class.kronosAstralPrimalPaverTurretMissile = {
        PARENT: "missile",
        LABEL: "Primal-Missile",
        GUNS: [
            {
                POSITION: [13, 6, 1, 0, 0, 180, 0],
            },
            {
                POSITION: [2, 6, 1.7, 13, 0, 180, 0],
                PROPERTIES: {
                    AUTOFIRE: true,
                    SHOOT_SETTINGS: combineStats([g.trap, { recoil: 0.5 }, g.lowPower, {reload: 1.25, speed: 1.1, damage: 0.8}, {reload: 1.25, speed: 1.1, damage: 0.8}]),
                    TYPE: ["trap", { PERSISTS_AFTER_DEATH: true }],
                    STAT_CALCULATOR: "thruster",
                },
            },
        ],
    }
    Class.kronosAstralPrimalPaverTurret = makeTurret({
        GUNS: [
            {
                POSITION: [10, 10, 0, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, {range: 0.0005, speed: 0.0005, maxSpeed: 0.0005, recoil: 0}]),
                    TYPE: "stupidBullet",
                    DRAW_FILL: false,
                    BORDERLESS: true,
                },
            },
            {
                POSITION: [10, 9, 1.1, 5, 0, 0, 0],
            },
            {
                POSITION: [3, 13, 1.25, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.artillery, g.artillery, g.skimmer, { reload: 2, health: 1.7, damage: 1.4, resist: 1.2 }, {speed: 0.8, maxSpeed: 0.6}, {speed: 0.8, maxSpeed: 0.6}]),
                    TYPE: "kronosAstralPrimalPaverTurretMissile",
                },
            },
            {
                POSITION: [6, 6, 1.4, 5, 0, 0, 0],
            },
        ],
    }, {limitFov: true, fov: 10, extraStats: [], label: "Proto Paver"})
    Class.kronosAstralProtoMachinosal = makeTurret({
        GUNS: [
            {
                POSITION: [10, 10, 0, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, {range: 0.0005, speed: 0.0005, maxSpeed: 0.0005, recoil: 0}]),
                    TYPE: "stupidBullet",
                    DRAW_FILL: false,
                    BORDERLESS: true,
                },
            },
            {
                POSITION: [7, 4, 0.8, 7, 0, 0, 0.5],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.swarm, g.machineGun, {reload: 1.125, speed: 1.5, maxSpeed: 1.5, spray: 2}]),
                    TYPE: "swarm",
                    STAT_CALCULATOR: "swarm",
                },
            },
        ],
    }, {limitFov: true, fov: 10, extraStats: [], label: "Proto Machinosal"})
    let kronosAstral = new LayeredBoss("kronosAstral", "Kronos", "CMCAstral", 5, "veryLightGrey", "baseTrapTurret", 7, 5.5);
    kronosAstral.addLayer({turret: {
            POSITION: [8.5, 9, 0, null, 180, 0],
            TYPE: ["kronosAstralProtoMachinosal", {GUN_STAT_SCALE: g.battleship}]
        }
    }, true, 8);
    Class["kronosAstral"].TURRETS.push({
        POSITION: [7, 0, 0, 0, 360, 1],
        TYPE: ["kronosAstralPrimalPaverTurret", { INDEPENDENT: true, }],
    })

    Class.ragnarokTerrestrialPrimalInceptionTurretMissileTurret = makeTurret({
        GUNS: [
            {
                POSITION: [20, 8, 1, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.power, { recoil: 1.15 }, g.turret, g.overdrive, {reload: 1.1, damage: 0.75, health: 0.8, pen: 0.5, range: 0.75}]),
                    TYPE: "bullet",
                },
            },
        ],
    }, {label: "Turret", fov: 0.8, extraStats: []})
    Class.ragnarokTerrestrialPrimalInceptionTurretMissile = {
        PARENT: "minimissile",
        LABEL: "Proto-Missile",
        TURRETS: [
            {
                POSITION: [10, 0, 0, 0, 360, 1],
                TYPE: "ragnarokTerrestrialPrimalInceptionTurretMissileTurret",
            },
        ],
    }
    Class.ragnarokTerrestrialPrimalInceptionTurret = makeTurret({
        GUNS: [
            {
                POSITION: [10, 10, 0, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, {range: 0.0005, speed: 0.0005, maxSpeed: 0.0005, recoil: 0}]),
                    TYPE: "stupidBullet",
                    DRAW_FILL: false,
                    BORDERLESS: true,
                },
            },
            {
                POSITION: [10, 9, 1, 9, 0, 0, 0],
            },
            {
                POSITION: [13, 13, 1, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.artillery, g.artillery]),
                    TYPE: "ragnarokTerrestrialPrimalInceptionTurretMissile",
                    STAT_CALCULATOR: "sustained",
                },
            },
            {
                POSITION: [2, 8, 1, 11, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.artillery, g.artillery, g.fake]),
                    TYPE: "bullet",
                }
            },
        ],
    }, {limitFov: true, fov: 10, extraStats: [], label: "Proto Inception"})
    let ragnarokAstral = new LayeredBoss("ragnarokAstral", "Odin", "CMCAstral", 5, "hexagon", "baseTrapTurret", 7, 5.5);
    ragnarokAstral.addLayer({gun: {
            POSITION: [2.25, 3.25, -1.6, 9, 0, null, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.drone, g.summoner, g.pounder, g.destroyer, {speed: 1.25, maxSpeed: 1.25}]),
                TYPE: ["realchip", {INDEPENDENT: true, DRAW_HEALTH: true, COLOR: 'hexagon'}],
                AUTOFIRE: true,
                SYNCS_SKILLS: true,
            },
        }
    }, true, 8, 6);
    Class["ragnarokAstral"].TURRETS.push({
        POSITION: [7, 0, 0, 0, 360, 1],
        TYPE: ["ragnarokTerrestrialPrimalInceptionTurret", { INDEPENDENT: true, }],
    })

    Class.atlasAstralProtoPollinatorTurret = makeTurret({
        GUNS: [
            {
                POSITION: [10, 10, 0, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, {range: 0.0005, speed: 0.0005, maxSpeed: 0.0005, recoil: 0}]),
                    TYPE: "stupidBullet",
                    DRAW_FILL: false,
                    BORDERLESS: true,
                },
            },
            {
                POSITION: [14, 3, 1, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.swarm, g.bee, {recoil: 0}]),
                    TYPE: ["bee", { INDEPENDENT: false }],
                    SYNCS_SKILLS: true,
                    STAT_CALCULATOR: "drone",
                    WAIT_TO_CYCLE: true,
                },
            },
        ],
    }, {limitFov: true, fov: 10, extraStats: [], label: "Pollinator"})
    Class.atlasAstralPrimalNailgunTurret = makeTurret({
        GUNS: [
            {
                POSITION: [10, 10, 0, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, {range: 0.0005, speed: 0.0005, maxSpeed: 0.0005, recoil: 0}]),
                    TYPE: "stupidBullet",
                    DRAW_FILL: false,
                    BORDERLESS: true,
                },
            },
            {
                POSITION: [19, 2, 1, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.power, g.twin, g.nailgun, {recoil: 0}]),
                    TYPE: "bullet",
                },
            },
            {
                POSITION: [5.5, 7, -1.8, 6.5, 0, 0, 0],
            },
        ],
    }, {limitFov: true, fov: 10, extraStats: [], label: "Primal Nailgun"})
    let atlasAstral = new LayeredBoss("atlasAstral", "Atlas", "CMCAstral", 5, "lavender", "baseTrapTurret", 7, 5.5);
    atlasAstral.addLayer({turret: {
            POSITION: [8.5, 9, 0, null, 180, 0],
            TYPE: "atlasAstralProtoPollinatorTurret"
        }
    }, true, 8);
    Class["atlasAstral"].TURRETS.push({
        POSITION: [7, 0, 0, 0, 360, 1],
        TYPE: ["atlasAstralPrimalNailgunTurret", { INDEPENDENT: true, }],
    })

    Class.rheaAstralProtoMicrophoneTurret = makeTurret({
        GUNS: [
            {
                POSITION: [47, 6.5, 1, 0, 0, 0, 0],
            },
            {
                POSITION: [5, 8.5, -1.5, 8, 0, 0, 0],
            },
        ],
        TURRETS: [
            {
                POSITION: [8, 40, 0, 0, 360, 0],
                TYPE: [ "rheaCelestialMegaphoneTurretHangar", { GUN_STAT_SCALE: g.flankGuard, INDEPENDENT: false, HAS_NO_RECOIL: true } ],
            },
        ],
    }, {limitFov: true, fov: 10, extraStats: [], label: "Proto Microphone"})
    Class.rheaAstralProtoChiselTurret = makeTurret({
        GUNS: [
            {
                POSITION: [17, 6.5, 1, 0, 0, 0, 0],
            },
            {
                POSITION: [5, 8.5, -1.5, 8, 0, 0, 0],
            },
        ],
        TURRETS: [
            {
                POSITION: [6, 18, 0, 0, 360, 1],
                TYPE: [ "autoTankGun", { GUN_STAT_SCALE: g.flankGuard, INDEPENDENT: false, HAS_NO_RECOIL: true } ],
            },
        ],
    }, {limitFov: true, fov: 10, extraStats: [], label: "Proto Chisel"})
    let rheaAstral = new LayeredBoss("rheaAstral", "Rhea", "CMCAstral", 5, "yellow", "baseTrapTurret", 7, 5.5);
    rheaAstral.addLayer({turret: {
            POSITION: [8.5, 9, 0, null, 180, 0],
            TYPE: "rheaAstralProtoMicrophoneTurret"
        }
    }, true, 8);
    Class["rheaAstral"].TURRETS.push({
        POSITION: [7, 0, 0, 0, 360, 1],
        TYPE: ["rheaAstralProtoChiselTurret", { INDEPENDENT: true, }],
    })

    Class.juliusAstralHomingMicroBasicTurret = makeTurret({
        GUNS: [
            {
                POSITION: [10, 10, 0, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, {range: 0.0005, speed: 0.0005, maxSpeed: 0.0005, recoil: 0}]),
                    TYPE: "stupidBullet",
                    DRAW_FILL: false,
                    BORDERLESS: true,
                },
            },
            {
                POSITION: [18, 4, 1, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, {reload: 1.5, maxSpeed: 1.25, range: 1.5}, {reload: 1.1, damage: 0.9, health: 0.9, pen: 0.9}, {reload: 1.1, damage: 0.9, health: 0.9, pen: 0.9}]),
                    TYPE: "homingBullet",
                }
            },
            {
                POSITION: [4, 5, 0.8, 12, 0, 0, 0],
            },
        ],
    }, {limitFov: true, fov: 10, extraStats: [], label: "Homing-Micro Basic"})
    Class.juliusAstralBasicTurret = makeTurret({
        GUNS: [
            {
                POSITION: [10, 10, 0, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, {range: 0.0005, speed: 0.0005, maxSpeed: 0.0005, recoil: 0}]),
                    TYPE: "stupidBullet",
                    DRAW_FILL: false,
                    BORDERLESS: true,
                },
            },
            {
                POSITION: [18, 8, 1, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic]),
                    TYPE: "bullet"
                }
            },
        ],
    }, {limitFov: true, fov: 10, extraStats: [], label: "Basic"})
    let juliusAstral = new LayeredBoss("juliusAstral", "Julius", "CMCAstral", 5, "darkGrey", "baseTrapTurret", 7, 5.5);
    Class["juliusAstral"].LABEL = "Rogue Astral"
    juliusAstral.addLayer({turret: {
            POSITION: [8.5, 9, 0, null, 180, 0],
            TYPE: "juliusAstralHomingMicroBasicTurret"
        }
    }, true, 8);
    Class["juliusAstral"].TURRETS.push({
        POSITION: [7, 0, 0, 0, 360, 1],
        TYPE: ["juliusAstralBasicTurret", { INDEPENDENT: true, }],
    })

    Class.genghisAstralProtoAerosolTurret = makeTurret({
        GUNS: [
            {
                POSITION: [10, 10, 0, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, {range: 0.0005, speed: 0.0005, maxSpeed: 0.0005, recoil: 0}]),
                    TYPE: "stupidBullet",
                    DRAW_FILL: false,
                    BORDERLESS: true,
                },
            },
            {
                POSITION: [7, 6, 0.6, 7, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.swarm, {reload: 1.2, damage: 0.8}]),
                    TYPE: "swarm",
                    STAT_CALCULATOR: "swarm",
                },
            },
        ],
    }, {limitFov: true, fov: 10, extraStats: [], label: "Proto-Aerosol"})
    Class.genghisAstralProtoBasicTurret = makeTurret({
        GUNS: [
            {
                POSITION: [10, 10, 0, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, {range: 0.0005, speed: 0.0005, maxSpeed: 0.0005, recoil: 0}]),
                    TYPE: "stupidBullet",
                    DRAW_FILL: false,
                    BORDERLESS: true,
                },
            },
            {
                POSITION: [18, 8, 1, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic]),
                    TYPE: "bullet"
                }
            },
        ],
    }, {limitFov: true, fov: 10, extraStats: [], label: "Proto-Basic"})
    let genghisAstral = new LayeredBoss("genghisAstral", "Genghis", "CMCAstral", 5, "darkGrey", "baseTrapTurret", 7, 5.5);
    Class["genghisAstral"].LABEL = "Rogue Astral"
    genghisAstral.addLayer({turret: {
            POSITION: [8.5, 9, 0, null, 180, 0],
            TYPE: "genghisAstralProtoAerosolTurret"
        }
    }, true, 8);
    Class["genghisAstral"].TURRETS.push({
        POSITION: [7, 0, 0, 0, 360, 1],
        TYPE: ["genghisAstralProtoBasicTurret", { INDEPENDENT: true, }],
    })

    Class.napoleonAstralAerosolTurret = makeTurret({
        GUNS: [
            {
                POSITION: [10, 10, 0, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, {range: 0.0005, speed: 0.0005, maxSpeed: 0.0005, recoil: 0}]),
                    TYPE: "stupidBullet",
                    DRAW_FILL: false,
                    BORDERLESS: true,
                },
            },
            {
                POSITION: [7, 7.5, 0.6, 7, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.swarm]),
                    TYPE: "swarm",
                    STAT_CALCULATOR: "swarm",
                },
            },
        ],
    }, {limitFov: true, fov: 10, extraStats: [], label: "Aeerosol"})
    Class.napoleonAstralProtoBasicDriveTurretBulletTurret = makeTurret({
        GUNS: [
            {
                POSITION: [22, 10, 1, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.flankGuard, {recoil: 0}]),
                    TYPE: "bullet",
                },
            },
        ],
    }, {canRepel: true, limitFov: true, fov: 3})
    Class.napoleonAstralProtoBasicDriveTurretBullet = makeAuto('bullet', "Auto-Bullet", {type: 'napoleonAstralProtoBasicDriveTurretBulletTurret'})
    Class.napoleonAstralProtoBasicDriveTurret = makeTurret({
        TURRETS: [
            {
                POSITION: [9, 0, 0, 0, 360, 1],
                TYPE: ["overdriveDeco", {MIRROR_MASTER_ANGLE: true}],
            },
        ],
        GUNS: [
            {
                POSITION: [10, 10, 0, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, {range: 0.0005, speed: 0.0005, maxSpeed: 0.0005, recoil: 0}]),
                    TYPE: "stupidBullet",
                    DRAW_FILL: false,
                    BORDERLESS: true,
                },
            },
            {
                POSITION: [17, 6, 1, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, {reload: 1.5, health: 0.8}]),
                    TYPE: "napoleonAstralProtoBasicDriveTurretBullet",
                }
            },
        ],
    }, {limitFov: true, fov: 10, extraStats: [], label: "Proto-Basic-Drive"})
    let napoleonAstral = new LayeredBoss("napoleonAstral", "Napoleon", "CMCAstral", 5, "darkGrey", "baseTrapTurret", 7, 5.5);
    Class["napoleonAstral"].LABEL = "Rogue Astral"
    napoleonAstral.addLayer({turret: {
            POSITION: [8.5, 9, 0, null, 180, 0],
            TYPE: "napoleonAstralAerosolTurret"
        }
    }, true, 8);
    Class["napoleonAstral"].TURRETS.push({
        POSITION: [7, 0, 0, 0, 360, 1],
        TYPE: ["napoleonAstralProtoBasicDriveTurret", { INDEPENDENT: true, }],
    })

    Class.moarCelestials.UPGRADES_TIER_0.push("moarCelestialsAstrals");
    Class.moarCelestialsAstrals.UPGRADES_TIER_0 = ["moarCelestials", "paladinAstral", "freyjaAstral", "zaphkielAstral", "nyxAstral", "theiaAstral", "kronosAstral", "ragnarokAstral", "atlasAstral", "rheaAstral", "juliusAstral", "genghisAstral", "napoleonAstral"]
}

if (createTerrestrials === true) {
    Class.moarCelestialsTerrestrials = makeMenu("Terrestrials", "rainbow", 7)
    Class.moarCelestialsTerrestrials.UPGRADES_TIER_0 = []

    Class.CMCTerrestrial = {
        PARENT: "miniboss",
        LABEL: "Terrestrial",
        SKILL: [8, 8, 8, 8, 8, 8, 8, 8, 8, 8],
        VALUE: 5e5,
        SHAPE: 7,
        SIZE: 35,
        CONTROLLERS: [["minion", {turnwiserange: 360}]],
        DANGER: 10,
        BODY: {
            FOV: 1,
            HEALTH: 1000,
            SHIELD: 50,
            REGEN: base.REGEN * 0.1,
            SPEED: base.SPEED * 0.3,
            DAMAGE: 9,
        },
    };
    Class.paladinTerrestrialProtoSwarmerTurret = makeTurret({
        GUNS: [
            {
                POSITION: [10, 10, 0, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, {range: 0.0005, speed: 0.0005, maxSpeed: 0.0005, recoil: 0}]),
                    TYPE: "stupidBullet",
                    DRAW_FILL: false,
                    BORDERLESS: true,
                },
            },
            {
                POSITION: [10, 14, -1.2, 5, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.destroyer, g.hive, {speed: 1.3, maxSpeed: 0.5, health: 1.3, range: 1.3}]),
                    TYPE: "protoHive",
                },
            },
            {
                POSITION: [11, 12, 1, 5, 0, 0, 0],
            },
        ],
    }, {limitFov: true, fov: 10, extraStats: [], label: "Proto Swarmer"})
    let paladinTerrestrial = new LayeredBoss("paladinTerrestrial", "Paladin", "CMCTerrestrial", 7, "purple", "baseTrapTurret", 7, 5.5);
    paladinTerrestrial.addLayer({gun: {
            POSITION: [3.8, 6, 1.4, 8, 0, null, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.drone, g.summoner, g.destroyer, {health: 1.4, damage: 1.4, resist: 1.2, density: 1.8, maxSpeed: 1.325}]),
                TYPE: ["demonchip", {INDEPENDENT: true}],
                AUTOFIRE: true,
                SYNCS_SKILLS: true,
                STAT_CALCULATOR: "drone",
                WAIT_TO_CYCLE: true,
            },
        }
    }, true, null, 11);
    paladinTerrestrial.addLayer({turret: {
            POSITION: [10, 7.5, 0, null, 160, 0],
            TYPE: ["paladinTerrestrialProtoSwarmerTurret", {GUN_STAT_SCALE: {speed: 1.45, maxSpeed: 0.675, health: 1.3, range: 2}}],
        }
    }, true, 6.5);

    Class.freyjaTerrestrialAerosolTurret = makeTurret({
        GUNS: [
            {
                POSITION: [10, 10, 0, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, {range: 0.0005, speed: 0.0005, maxSpeed: 0.0005, recoil: 0}]),
                    TYPE: "stupidBullet",
                    DRAW_FILL: false,
                    BORDERLESS: true,
                },
            },
            {
                POSITION: [7, 7.5, 0.6, 7, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.swarm]),
                    TYPE: "swarm",
                    STAT_CALCULATOR: "swarm",
                },
            },
        ],
    }, {limitFov: true, fov: 10, extraStats: [], label: "Aerosol"})
    Class.freyjaTerrestrialBasicTurret = makeTurret({
        GUNS: [
            {
                POSITION: [10, 10, 0, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, {range: 0.0005, speed: 0.0005, maxSpeed: 0.0005, recoil: 0}]),
                    TYPE: "stupidBullet",
                    DRAW_FILL: false,
                    BORDERLESS: true,
                },
            },
            {
                POSITION: [16, 4, 1, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.twin, g.power, { speed: 0.7, maxSpeed: 0.7 }]),
                    TYPE: "bullet",
                },
            },
        ],
    }, {limitFov: true, fov: 10, extraStats: [], label: "Basic"})
    let freyjaTerrestrial = new LayeredBoss("freyjaTerrestrial", "Freyja", "CMCTerrestrial", 7, "lightGreen", "baseTrapTurret", 7, 5.5);
    freyjaTerrestrial.addLayer({turret: {
            POSITION: [9, 8, 0, null, 160, 0],
            TYPE: ["freyjaTerrestrialAerosolTurret", {GUN_STAT_SCALE: {health: 1.2, damage: 1.3, speed: 1.1, maxSpeed: 1.1, resist: 1.05, reload: 0.8}}],
        }
    });
    freyjaTerrestrial.addLayer({turret: {
            POSITION: [10, 7.5, 0, null, 160, 0],
            TYPE: ["freyjaTerrestrialBasicTurret", {GUN_STAT_SCALE: {health: 1.2, damage: 1.2, speed: 1.15, maxSpeed: 0.9, resist: 1.2, reload: 0.8}}],
        }
    }, true, 6.5);

    Class.zaphkielTerrestrialLauncherTurret = makeTurret({
        GUNS: [
            {
                POSITION: [10, 10, 0, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, {range: 0.0005, speed: 0.0005, maxSpeed: 0.0005, recoil: 0}]),
                    TYPE: "stupidBullet",
                    DRAW_FILL: false,
                    BORDERLESS: true,
                },
            },
            {
                POSITION: [10, 9, 1, 9, 0, 0, 0],
            },
            {
                POSITION: [17, 13, 1, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.launcher]),
                    TYPE: "minimissile",
                    STAT_CALCULATOR: "sustained",
                },
            },
        ],
    }, {limitFov: true, fov: 10, extraStats: [], label: "Launcher"})
    let zaphkielTerrestrial = new LayeredBoss("zaphkielTerrestrial", "Zaphkiel", "CMCTerrestrial", 7, "orange", "baseTrapTurret", 7, 5.5);
    zaphkielTerrestrial.addLayer({gun: {
            POSITION: [3.8, 6, 1.4, 8, 0, null, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.drone, g.summoner, g.destroyer, {health: 1.4, damage: 1.4, resist: 1.2, density: 1.8, maxSpeed: 1.325}]),
                TYPE: ["dorito", {INDEPENDENT: true}],
                AUTOFIRE: true,
                SYNCS_SKILLS: true,
            },
        }
    }, true, null, 11);
    zaphkielTerrestrial.addLayer({turret: {
            POSITION: [10, 7.5, 0, null, 160, 0],
            TYPE: ["zaphkielTerrestrialLauncherTurret", {GUN_STAT_SCALE: {health: 1.1, range: 1.3}}],
        }
    }, true, 6.5);

    Class.nyxTerrestrialProtoRocketeerMissile = {
        PARENT: "missile",
        LABEL: "Proto-Missile",
        GUNS: [
            {
                POSITION: [15.5, 8, 1.25, 0, 0, 180, 3],
                PROPERTIES: {
                    AUTOFIRE: true,
                    SHOOT_SETTINGS: combineStats([g.basic, g.missileTrail, g.rocketeerMissileTrail, {reload: 1.1, damage: 0.8, health: 0.9, pen: 0.95, spray: 0.5}]),
                    TYPE: ["bullet", { PERSISTS_AFTER_DEATH: true }],
                    STAT_CALCULATOR: "thruster",
                },
            },
        ],
    }
    Class.nyxTerrestrialProtoRocketeer = makeTurret({
        GUNS: [
            {
                POSITION: [10, 10, 0, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, {range: 0.0005, speed: 0.0005, maxSpeed: 0.0005, recoil: 0}]),
                    TYPE: "stupidBullet",
                    DRAW_FILL: false,
                    BORDERLESS: true,
                },
            },
            {
                POSITION: [10, 12.5, -0.7, 8, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.launcher, g.rocketeer, {reload: 1.2, damage: 0.9, speed: 0.8}]),
                    TYPE: "nyxTerrestrialProtoRocketeerMissile",
                    STAT_CALCULATOR: "sustained",
                },
            },
            {
                POSITION: [15, 18, 0.65, 0, 0, 0, 0],
            },
        ],
    }, {limitFov: true, fov: 10, extraStats: [], label: "Proto Rocketeer"})
    let nyxTerrestrial = new LayeredBoss("nyxTerrestrial", "Nyx", "CMCTerrestrial", 7, "pink", "baseTrapTurret", 7, 5.5);
    nyxTerrestrial.addLayer({gun: {
            POSITION: [3.8, 7, -1.4, 8, 0, null, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.spawner, { size: 0.7, maxSpeed: 0.85, damage: 0.8 }]),
                TYPE: ["minion", {INDEPENDENT: true,}],
                AUTOFIRE: true,
                SYNCS_SKILLS: true,
            },
        }
    }, true, null, 11);
    nyxTerrestrial.addLayer({turret: {
            POSITION: [10, 7.5, 0, null, 160, 0],
            TYPE: ["nyxTerrestrialProtoRocketeer", {GUN_STAT_SCALE: {maxSpeed: 0.5}}],
        }
    }, true, 6.5);

    Class.theiaTerrestrialProtoTwisterTurretMissile = {
        PARENT: "missile",
        LABEL: "Proto-Missile",
        CONTROLLERS: [["spin2", {speed: 0.08}]],
        GUNS: [
            {
                POSITION: [14, 8, 1, 0, 0, 0, 0],
                PROPERTIES: {
                    AUTOFIRE: !0,
                    SHOOT_SETTINGS: combineStats([g.basic, g.lowPower, {size: 1.1, recoil: 0.1}]),
                    TYPE: ["bullet", { PERSISTS_AFTER_DEATH: true }],
                    STAT_CALCULATOR: "thruster",
                    WAIT_TO_CYCLE: true,
                },
            },
        ],
    }
    Class.theiaTerrestrialProtoTwisterTurret = makeTurret({
        GUNS: [
            {
                POSITION: [10, 10, 0, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, {range: 0.0005, speed: 0.0005, maxSpeed: 0.0005, recoil: 0}]),
                    TYPE: "stupidBullet",
                    DRAW_FILL: false,
                    BORDERLESS: true,
                },
            },
            {
                POSITION: [10, 13, -0.675, 7, 0, 0, 0],
            },
            {
                POSITION: [15, 14, -1.3, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.artillery, g.artillery, g.skimmer, { reload: 4/3 }]),
                    TYPE: "theiaTerrestrialProtoTwisterTurretMissile",
                    STAT_CALCULATOR: "sustained",
                },
            },
        ],
    }, {limitFov: true, fov: 10, extraStats: [], label: "Proto Twister"})
    let theiaTerrestrial = new LayeredBoss("theiaTerrestrial", "Theia", "CMCTerrestrial", 7, "gold", "baseTrapTurret", 7, 5.5);
    theiaTerrestrial.addLayer({gun: {
            POSITION: [3.8, 6, 1.4, 8, 0, null, 1],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.drone, g.summoner, g.destroyer, {health: 1.4, damage: 1.4, resist: 1.2, density: 1.8, maxSpeed: 1.325}]),
                TYPE: ["summonerDrone", {INDEPENDENT: true}],
                AUTOFIRE: true,
                WAIT_TO_CYCLE: true,
                SYNCS_SKILLS: true,
            },
        }
    }, true, null, 25);
    theiaTerrestrial.addLayer({turret: {
            POSITION: [10, 7.5, 0, null, 160, 0],
            TYPE: ["theiaTerrestrialProtoTwisterTurret", {GUN_STAT_SCALE: {health: 1.3, damage: 1.1, resist: 1.2, speed: 1.1, maxSpeed: 0.8}}],
        }
    }, true, 6.5);

    Class.kronosTerrestrialProtoPaverTurretMissile = {
        PARENT: "missile",
        LABEL: "Proto-Missile",
        GUNS: [
            {
                POSITION: [13, 6, 1, 0, 0, 180, 0],
            },
            {
                POSITION: [2, 6, 1.7, 13, 0, 180, 0],
                PROPERTIES: {
                    AUTOFIRE: true,
                    SHOOT_SETTINGS: combineStats([g.trap, { recoil: 0.5 }, g.lowPower, {reload: 1.25, speed: 1.1, damage: 0.8}]),
                    TYPE: ["trap", { PERSISTS_AFTER_DEATH: true }],
                    STAT_CALCULATOR: "thruster",
                },
            },
        ],
    }
    Class.kronosTerrestrialProtoPaverTurret = makeTurret({
        GUNS: [
            {
                POSITION: [10, 10, 0, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, {range: 0.0005, speed: 0.0005, maxSpeed: 0.0005, recoil: 0}]),
                    TYPE: "stupidBullet",
                    DRAW_FILL: false,
                    BORDERLESS: true,
                },
            },
            {
                POSITION: [10, 9, 1.1, 7, 0, 0, 0],
            },
            {
                POSITION: [5, 13, 1.25, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.artillery, g.artillery, g.skimmer, { reload: 2, health: 1.7, damage: 1.4, resist: 1.2 }, {speed: 0.8, maxSpeed: 0.6}]),
                    TYPE: "kronosTerrestrialProtoPaverTurretMissile",
                },
            },
            {
                POSITION: [6, 6, 1.4, 7, 0, 0, 0],
            },
        ],
    }, {limitFov: true, fov: 10, extraStats: [], label: "Proto Paver"})
    Class.kronosTerrestrialMachinosal = makeTurret({
        GUNS: [
            {
                POSITION: [10, 10, 0, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, {range: 0.0005, speed: 0.0005, maxSpeed: 0.0005, recoil: 0}]),
                    TYPE: "stupidBullet",
                    DRAW_FILL: false,
                    BORDERLESS: true,
                },
            },
            {
                POSITION: [7, 8, 0.8, 7, 0, 0, 0.5],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.swarm, g.machineGun, {reload: 1.125, speed: 1.5, maxSpeed: 1.5, spray: 2}]),
                    TYPE: "swarm",
                    STAT_CALCULATOR: "swarm",
                },
            },
        ],
    }, {limitFov: true, fov: 10, extraStats: [], label: "Machinosal"})
    let kronosTerrestrial = new LayeredBoss("kronosTerrestrial", "Kronos", "CMCTerrestrial", 7, "veryLightGrey", "baseTrapTurret", 7, 5.5);
    kronosTerrestrial.addLayer({turret: {
            POSITION: [8.5, 9, 0, null, 180, 0],
            TYPE: ["kronosTerrestrialMachinosal", {GUN_STAT_SCALE: g.battleship}]
        }
    });
    kronosTerrestrial.addLayer({turret: {
            POSITION: [10.6, 7.5, 0, null, 160, 0],
            TYPE: "kronosTerrestrialProtoPaverTurret",
        }
    }, true, 6.5);

    Class.ragnarokTerrestrialProtoInceptionTurretMissile = {
        PARENT: "minimissile",
        LABEL: "Proto-Missile",
        TURRETS: [
            {
                POSITION: [12, 0, 0, 0, 360, 1],
                TYPE: "droneAutoTurret",
            },
        ],
    }
    Class.ragnarokTerrestrialProtoInceptionTurret = makeTurret({
        GUNS: [
            {
                POSITION: [10, 10, 0, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, {range: 0.0005, speed: 0.0005, maxSpeed: 0.0005, recoil: 0}]),
                    TYPE: "stupidBullet",
                    DRAW_FILL: false,
                    BORDERLESS: true,
                },
            },
            {
                POSITION: [10, 9, 1, 9, 0, 0, 0],
            },
            {
                POSITION: [15, 13, 1, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.artillery, g.artillery]),
                    TYPE: "ragnarokTerrestrialProtoInceptionTurretMissile",
                    STAT_CALCULATOR: "sustained",
                },
            },
            {
                POSITION: [3, 8, 1, 12, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.artillery, g.artillery, g.fake]),
                    TYPE: "bullet",
                }
            },
        ],
    }, {limitFov: true, fov: 10, extraStats: [], label: "Proto Inception"})
    let ragnarokTerrestrial = new LayeredBoss("ragnarokTerrestrial", "Odin", "CMCTerrestrial", 7, "hexagon", "baseTrapTurret", 7, 5.5);
    ragnarokTerrestrial.addLayer({gun: {
            POSITION: [2.25, 3.25, -1.6, 9, 0, null, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.drone, g.summoner, g.pounder, g.destroyer, {speed: 1.25, maxSpeed: 1.25}]),
                TYPE: ["realchip", {INDEPENDENT: true, DRAW_HEALTH: true, COLOR: 'hexagon'}],
                AUTOFIRE: true,
                SYNCS_SKILLS: true,
            },
        }
    }, true, null, 10);
    ragnarokTerrestrial.addLayer({turret: {
            POSITION: [10.6, 7.5, 0, null, 160, 0],
            TYPE: "ragnarokTerrestrialProtoInceptionTurret",
        }
    }, true, 6.5);

    Class.atlasTerrestrialPollinatorTurret = makeTurret({
        GUNS: [
            {
                POSITION: [10, 10, 0, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, {range: 0.0005, speed: 0.0005, maxSpeed: 0.0005, recoil: 0}]),
                    TYPE: "stupidBullet",
                    DRAW_FILL: false,
                    BORDERLESS: true,
                },
            },
            {
                POSITION: [14, 3, 1, 0, -6, -7, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.swarm, g.bee, {recoil: 0}]),
                    TYPE: ["bee", { INDEPENDENT: false }],
                    SYNCS_SKILLS: true,
                    STAT_CALCULATOR: "drone",
                    WAIT_TO_CYCLE: true,
                },
            },
            {
                POSITION: [14, 3, 1, 0, 6, 7, 0.55],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.swarm, g.bee, {recoil: 0}]),
                    TYPE: ["bee", { INDEPENDENT: false }],
                    SYNCS_SKILLS: true,
                    STAT_CALCULATOR: "drone",
                    WAIT_TO_CYCLE: true,
                },
            },
        ],
    }, {limitFov: true, fov: 10, extraStats: [], label: "Pollinator"})
    Class.atlasTerrestrialProtoNailgunTurret = makeTurret({
        GUNS: [
            {
                POSITION: [10, 10, 0, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, {range: 0.0005, speed: 0.0005, maxSpeed: 0.0005, recoil: 0}]),
                    TYPE: "stupidBullet",
                    DRAW_FILL: false,
                    BORDERLESS: true,
                },
            },
            {
                POSITION: [19, 2, 1, 0, -2.5, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.power, g.twin, g.nailgun, {recoil: 0}]),
                    TYPE: "bullet",
                },
            },
            {
                POSITION: [19, 2, 1, 0, 2.5, 0, 0.5],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.power, g.twin, g.nailgun, {recoil: 0}]),
                    TYPE: "bullet",
                },
            },
            {
                POSITION: [5.5, 7, -1.8, 6.5, 0, 0, 0],
            },
        ],
    }, {limitFov: true, fov: 10, extraStats: [], label: "Proto Nailgun"})
    let atlasTerrestrial = new LayeredBoss("atlasTerrestrial", "Atlas", "CMCTerrestrial", 7, "lavender", "baseTrapTurret", 7, 5.5);
    atlasTerrestrial.addLayer({turret: {
            POSITION: [8.5, 9, 0, null, 180, 0],
            TYPE: "atlasTerrestrialPollinatorTurret",
        }
    });
    atlasTerrestrial.addLayer({turret: {
            POSITION: [10.6, 7.5, 0, null, 160, 0],
            TYPE: ["atlasTerrestrialProtoNailgunTurret", {GUN_STAT_SCALE: {speed: 1.1, maxSpeed: 1.1, resist: 1.3}}],
        }
    }, true, 6.5);

    Class.rheaCelestialMicrophoneTurret = makeTurret({
        GUNS: [
            {
                POSITION: [57, 6.5, 1, 0, 0, 0, 0],
            },
            {
                POSITION: [5, 8.5, -1.5, 8, 0, 0, 0],
            },
        ],
        TURRETS: [
            {
                POSITION: [8, 50, 0, 0, 360, 0],
                TYPE: [ "rheaCelestialMegaphoneTurretHangar", { GUN_STAT_SCALE: g.flankGuard, INDEPENDENT: false, HAS_NO_RECOIL: true } ],
            },
            {
                POSITION: [8, 40, 0, 0, 360, 0],
                TYPE: [ "rheaCelestialMegaphoneTurretHangar", { GUN_STAT_SCALE: g.flankGuard, INDEPENDENT: false, HAS_NO_RECOIL: true } ],
            },
        ],
    }, {limitFov: true, fov: 10, extraStats: [], label: "Microphone"})
    Class.rheaTerrestrialChiselTurret = makeTurret({
        GUNS: [
            {
                POSITION: [27, 6.5, 1, 0, 0, 0, 0],
            },
            {
                POSITION: [5, 8.5, -1.5, 8, 0, 0, 0],
            },
        ],
        TURRETS: [
            {
                POSITION: [6, 28, 0, 0, 360, 1],
                TYPE: [ "autoTankGun", { GUN_STAT_SCALE: g.flankGuard, INDEPENDENT: false, HAS_NO_RECOIL: true } ],
            },
            {
                POSITION: [6, 18, 0, 0, 360, 1],
                TYPE: [ "autoTankGun", { GUN_STAT_SCALE: g.flankGuard, INDEPENDENT: true, HAS_NO_RECOIL: true } ],
            },
        ],
    }, {limitFov: true, fov: 10, extraStats: [], label: "Chisel"})
    let rheaTerrestrial = new LayeredBoss("rheaTerrestrial", "Rhea", "CMCTerrestrial", 7, "yellow", "baseTrapTurret", 7, 5.5);
    rheaTerrestrial.addLayer({turret: {
            POSITION: [8.5, 9, 0, null, 180, 0],
            TYPE: "rheaCelestialMicrophoneTurret",
        }
    });
    rheaTerrestrial.addLayer({turret: {
            POSITION: [10.6, 7.5, 0, null, 160, 0],
            TYPE: "rheaTerrestrialChiselTurret",
        }
    }, true, 6.5);

    Class.juliusTerrestrialHomingProtoBasicTurret = makeTurret({
        GUNS: [
            {
                POSITION: [10, 10, 0, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, {range: 0.0005, speed: 0.0005, maxSpeed: 0.0005, recoil: 0}]),
                    TYPE: "stupidBullet",
                    DRAW_FILL: false,
                    BORDERLESS: true,
                },
            },
            {
                POSITION: [18, 6, 1, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, {reload: 1.5, maxSpeed: 1.25, range: 1.5}, {reload: 1.1, damage: 0.9, health: 0.9, pen: 0.9}]),
                    TYPE: "homingBullet",
                }
            },
            {
                POSITION: [4, 7.5, 0.8, 12, 0, 0, 0],
            },
        ],
    }, {limitFov: true, fov: 10, extraStats: [], label: "Homing-Proto Basic"})
    Class.juliusTerrestrialPounderTurret = makeTurret({
        GUNS: [
            {
                POSITION: [10, 10, 0, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, {range: 0.0005, speed: 0.0005, maxSpeed: 0.0005, recoil: 0}]),
                    TYPE: "stupidBullet",
                    DRAW_FILL: false,
                    BORDERLESS: true,
                },
            },
            {
                POSITION: [20.5, 12, 1, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.pounder]),
                    TYPE: "bullet"
                }
            },
        ],
    }, {limitFov: true, fov: 10, extraStats: [], label: "Launcher"})
    let juliusTerrestrial = new LayeredBoss("juliusTerrestrial", "Julius", "CMCTerrestrial", 7, "darkGrey", "baseTrapTurret", 7, 5.5);
    Class["juliusTerrestrial"].LABEL = "Rogue Terrestrial"
    juliusTerrestrial.addLayer({turret: {
            POSITION: [8.5, 9, 0, null, 180, 0],
            TYPE: "juliusTerrestrialHomingProtoBasicTurret",
        }
    });
    juliusTerrestrial.addLayer({turret: {
            POSITION: [10.6, 7.5, 0, null, 160, 0],
            TYPE: "juliusTerrestrialPounderTurret",
        }
    }, true, 6.5);

    Class.genghisTerrestrialAerosolTurret = makeTurret({
        GUNS: [
            {
                POSITION: [10, 10, 0, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, {range: 0.0005, speed: 0.0005, maxSpeed: 0.0005, recoil: 0}]),
                    TYPE: "stupidBullet",
                    DRAW_FILL: false,
                    BORDERLESS: true,
                },
            },
            {
                POSITION: [7, 7.5, 0.6, 7, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.swarm]),
                    TYPE: "swarm",
                    STAT_CALCULATOR: "swarm",
                },
            },
        ],
    }, {limitFov: true, fov: 10, extraStats: [], label: "Aerosol"})
    Class.genghisTerrestrialBasicTurret = makeTurret({
        GUNS: [
            {
                POSITION: [10, 10, 0, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, {range: 0.0005, speed: 0.0005, maxSpeed: 0.0005, recoil: 0}]),
                    TYPE: "stupidBullet",
                    DRAW_FILL: false,
                    BORDERLESS: true,
                },
            },
            {
                POSITION: [20, 8, 1, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.doubleTwin]),
                    TYPE: "bullet"
                }
            },
        ],
    }, {limitFov: true, fov: 10, extraStats: [], label: "Basic"})
    let genghisTerrestrial = new LayeredBoss("genghisTerrestrial", "Genghis", "CMCTerrestrial", 7, "darkGrey", "baseTrapTurret", 7, 5.5);
    Class["genghisTerrestrial"].LABEL = "Rogue Terrestrial"
    genghisTerrestrial.addLayer({turret: {
            POSITION: [8.5, 9, 0, null, 180, 0],
            TYPE: "genghisTerrestrialAerosolTurret",
        }
    });
    genghisTerrestrial.addLayer({turret: {
            POSITION: [10.6, 7.5, 0, null, 160, 0],
            TYPE: "genghisTerrestrialBasicTurret",
        }
    }, true, 6.5);

    Class.napoleonTerrestrialHiverTurret = makeTurret({
        GUNS: [
            {
                POSITION: [10, 10, 0, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, {range: 0.0005, speed: 0.0005, maxSpeed: 0.0005, recoil: 0}]),
                    TYPE: "stupidBullet",
                    DRAW_FILL: false,
                    BORDERLESS: true,
                },
            },
            {
                POSITION: [14, 6, 0.8, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.swarm, g.bee]),
                    TYPE: ["bee", { INDEPENDENT: true }],
                    SYNCS_SKILLS: true,
                    STAT_CALCULATOR: "drone",
                    WAIT_TO_CYCLE: true,
                },
            },
        ],
    }, {limitFov: true, fov: 10, extraStats: [], label: "Hiver"})
    Class.napoleonTerrestrialBasicDriveTurretBulletTurret = makeTurret({
        GUNS: [
            {
                POSITION: [22, 10, 1, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.flankGuard, {recoil: 0}]),
                    TYPE: "bullet",
                },
            },
        ],
    }, {canRepel: true, limitFov: true, fov: 3})
    Class.napoleonTerrestrialBasicDriveTurretBullet = makeAuto('bullet', "Auto-Bullet", {type: 'napoleonTerrestrialBasicDriveTurretBulletTurret'})
    Class.napoleonTerrestrialBasicDriveTurret = makeTurret({
        TURRETS: [
            {
                POSITION: [9, 0, 0, 0, 360, 1],
                TYPE: ["overdriveDeco", {MIRROR_MASTER_ANGLE: true}],
            },
        ],
        GUNS: [
            {
                POSITION: [10, 10, 0, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, {range: 0.0005, speed: 0.0005, maxSpeed: 0.0005, recoil: 0}]),
                    TYPE: "stupidBullet",
                    DRAW_FILL: false,
                    BORDERLESS: true,
                },
            },
            {
                POSITION: [18, 8, 1, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic]),
                    TYPE: "napoleonTerrestrialBasicDriveTurretBullet",
                }
            },
        ],
    }, {limitFov: true, fov: 10, extraStats: [], label: "Basic-Drive"})
    let napoleonTerrestrial = new LayeredBoss("napoleonTerrestrial", "Napoleon", "CMCTerrestrial", 7, "darkGrey", "baseTrapTurret", 7, 5.5);
    Class["napoleonTerrestrial"].LABEL = "Rogue Terrestrial"
    napoleonTerrestrial.addLayer({turret: {
            POSITION: [8.5, 9, 0, null, 180, 0],
            TYPE: "napoleonTerrestrialHiverTurret",
        }
    });
    napoleonTerrestrial.addLayer({turret: {
            POSITION: [10.6, 7.5, 0, null, 160, 0],
            TYPE: "napoleonTerrestrialBasicDriveTurret",
        }
    }, true, 6.5);

    Class.moarCelestials.UPGRADES_TIER_0.push("moarCelestialsTerrestrials");
    Class.moarCelestialsTerrestrials.UPGRADES_TIER_0 = ["moarCelestials", "paladinTerrestrial", "freyjaTerrestrial", "zaphkielTerrestrial", "nyxTerrestrial", "theiaTerrestrial", "kronosTerrestrial", "ragnarokTerrestrial", "atlasTerrestrial", "rheaTerrestrial", "juliusTerrestrial", "genghisTerrestrial", "napoleonTerrestrial"]
}

if (createCelestials === true) {
    Class.moarCelestialsCelestials = makeMenu("Celestials", "rainbow", 9)
    Class.moarCelestialsCelestials.UPGRADES_TIER_0 = []

    Class.CMCCelestial = {
        PARENT: "miniboss",
        LABEL: "Celestial",
        SKILL: [9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
        VALUE: 1e6,
        SHAPE: 9,
        SIZE: 45,
        CONTROLLERS: [["minion", {turnwiserange: 360}]],
        DANGER: 11,
        BODY: {
            FOV: 1,
            HEALTH: 1500,
            SHIELD: 75,
            REGEN: base.REGEN * 0.1,
            SPEED: base.SPEED * 0.2,
            DAMAGE: 12,
        },
    };
    Class.paladinCelestialSwarmerTurret = makeTurret({
        GUNS: [
            {
                POSITION: [10, 10, 0, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, {range: 0.0005, speed: 0.0005, maxSpeed: 0.0005, recoil: 0}]),
                    TYPE: "stupidBullet",
                    DRAW_FILL: false,
                    BORDERLESS: true,
                },
            },
            {
                POSITION: [15, 14, -1.2, 5, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.destroyer, g.hive]),
                    TYPE: "hive",
                },
            },
            {
                POSITION: [15, 12, 1, 5, 0, 0, 0],
            },
        ],
    }, {limitFov: true, fov: 10, extraStats: [], label: "Swarmer"})
    let paladinCelestial = new LayeredBoss("paladinCelestial", "Paladin", "CMCCelestial", 9, "purple", "baseTrapTurret", 6.5, 5.5);
    paladinCelestial.addLayer({gun: {
            POSITION: [3.8, 6, 1.4, 8, 0, null, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.drone, g.summoner, g.destroyer, {health: 1.4, damage: 1.4, resist: 1.2, density: 1.8, maxSpeed: 1.325}]),
                TYPE: ["demonchip", {INDEPENDENT: true}],
                AUTOFIRE: true,
                SYNCS_SKILLS: true,
                STAT_CALCULATOR: "drone",
                WAIT_TO_CYCLE: true,
            },
        }
    }, true, null, 16);
    paladinCelestial.addLayer({turret: {
            POSITION: [10, 7.5, 0, null, 160, 0],
            TYPE: ["paladinCelestialSwarmerTurret", {GUN_STAT_SCALE: {speed: 1.45, maxSpeed: 0.5, health: 1.3, range: 2}}],
        }
    }, true, 6);

    Class.freyjaCelestialCruiserTurret = makeTurret({
        GUNS: [
            {
                POSITION: [10, 10, 0, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, {range: 0.0005, speed: 0.0005, maxSpeed: 0.0005, recoil: 0}]),
                    TYPE: "stupidBullet",
                    DRAW_FILL: false,
                    BORDERLESS: true,
                },
            },
            {
                POSITION: [7, 7.5, 0.6, 7, 4, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.swarm]),
                    TYPE: "swarm",
                    STAT_CALCULATOR: "swarm",
                },
            },
            {
                POSITION: [7, 7.5, 0.6, 7, -4, 0, 0.5],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.swarm]),
                    TYPE: "swarm",
                    STAT_CALCULATOR: "swarm",
                },
            },
        ],
    }, {limitFov: true, fov: 10, extraStats: [], label: "Cruiser"})
    Class.freyjaCelestialTwinTurret = makeTurret({
        GUNS: [
            {
                POSITION: [10, 10, 0, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, {range: 0.0005, speed: 0.0005, maxSpeed: 0.0005, recoil: 0}]),
                    TYPE: "stupidBullet",
                    DRAW_FILL: false,
                    BORDERLESS: true,
                },
            },
            {
                POSITION: [16, 4, 1, 0, -3.5, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.twin, g.power, { speed: 0.7, maxSpeed: 0.7 }]),
                    TYPE: "bullet",
                },
            },
            {
                POSITION: [16, 4, 1, 0, 3.5, 0, 0.5],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.twin, g.power, { speed: 0.7, maxSpeed: 0.7 }]),
                    TYPE: "bullet",
                },
            },
        ],
    }, {limitFov: true, fov: 10, extraStats: [], label: "Twin"})
    let freyjaCelestial = new LayeredBoss("freyjaCelestial", "Freyja", "CMCCelestial", 9, "lightGreen", "baseTrapTurret", 6.5, 5.5);
    freyjaCelestial.addLayer({turret: {
            POSITION: [8.5, 9, 0, null, 180, 0],
            TYPE: ["freyjaCelestialCruiserTurret", {GUN_STAT_SCALE: {health: 1.2, damage: 1.3, speed: 1.1, maxSpeed: 1.1, resist: 1.05}}],
        }
    });
    freyjaCelestial.addLayer({turret: {
            POSITION: [10.6, 7.5, 0, null, 160, 0],
            TYPE: ["freyjaCelestialTwinTurret", {GUN_STAT_SCALE: {health: 1.2, damage: 1.2, speed: 1.15, maxSpeed: 0.9, resist: 1.2}}],
        }
    }, true, 6);

    Class.zaphkielCelestialSkimmerTurret = makeTurret({
        GUNS: [
            {
                POSITION: [10, 10, 0, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, {range: 0.0005, speed: 0.0005, maxSpeed: 0.0005, recoil: 0}]),
                    TYPE: "stupidBullet",
                    DRAW_FILL: false,
                    BORDERLESS: true,
                },
            },
            {
                POSITION: [10, 14, -0.5, 9, 0, 0, 0],
            },
            {
                POSITION: [17, 15, 1, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.artillery, g.artillery, g.skimmer]),
                    TYPE: "missile",
                    STAT_CALCULATOR: "sustained",
                },
            },
        ],
    }, {limitFov: true, fov: 10, extraStats: [], label: "Skimmer"})
    let zaphkielCelestial = new LayeredBoss("zaphkielCelestial", "Zaphkiel", "CMCCelestial", 9, "orange", "baseTrapTurret", 6.5, 5.5);
    zaphkielCelestial.addLayer({gun: {
            POSITION: [3.8, 6, 1.4, 8, 0, null, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.drone, g.summoner, g.destroyer, {health: 1.4, damage: 1.4, resist: 1.2, density: 1.8, maxSpeed: 1.325}]),
                TYPE: ["dorito", {INDEPENDENT: true}],
                AUTOFIRE: true,
                SYNCS_SKILLS: true,
            },
        }
    }, true, null, 16);
    zaphkielCelestial.addLayer({turret: {
            POSITION: [10, 7.5, 0, null, 160, 0],
            TYPE: ["zaphkielCelestialSkimmerTurret", {GUN_STAT_SCALE: {health: 1.2, range: 1.4}}],
        }
    }, true, 6);

    Class.nyxCelestialRocketeerTurret = makeTurret({
        GUNS: [
            {
                POSITION: [10, 10, 0, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, {range: 0.0005, speed: 0.0005, maxSpeed: 0.0005, recoil: 0}]),
                    TYPE: "stupidBullet",
                    DRAW_FILL: false,
                    BORDERLESS: true,
                },
            },
            {
                POSITION: [10, 12.5, -0.7, 10, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.launcher, g.rocketeer]),
                    TYPE: "rocketeerMissile",
                    STAT_CALCULATOR: "sustained",
                },
            },
            {
                POSITION: [17, 18, 0.65, 0, 0, 0, 0],
            },
        ],
    }, {limitFov: true, fov: 10, extraStats: [], label: "Rocketeer"})
    let nyxCelestial = new LayeredBoss("nyxCelestial", "Nyx", "CMCCelestial", 9, "pink", "baseTrapTurret", 6.5, 5.5);
    nyxCelestial.addLayer({gun: {
            POSITION: [3.8, 7, -1.4, 8, 0, null, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.spawner, { size: 0.7, maxSpeed: 0.85, damage: 0.8 }]),
                TYPE: ["minion", {INDEPENDENT: true,}],
                AUTOFIRE: true,
                SYNCS_SKILLS: true,
            },
        }
    }, true, null, 16);
    nyxCelestial.addLayer({turret: {
            POSITION: [10, 7.5, 0, null, 160, 0],
            TYPE: ["nyxCelestialRocketeerTurret", {GUN_STAT_SCALE: {maxSpeed: 0.5}}],
        }
    }, true, 6);

    Class.theiaCelestialTwisterTurret = makeTurret({
        GUNS: [
            {
                POSITION: [10, 10, 0, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, {range: 0.0005, speed: 0.0005, maxSpeed: 0.0005, recoil: 0}]),
                    TYPE: "stupidBullet",
                    DRAW_FILL: false,
                    BORDERLESS: true,
                },
            },
            {
                POSITION: [10, 13, -0.5, 9, 0, 0, 0],
            },
            {
                POSITION: [17, 14, -1.4, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.artillery, g.artillery, g.skimmer, { reload: 4/3 }]),
                    TYPE: "spinmissile",
                    STAT_CALCULATOR: "sustained",
                },
            },
        ],
    }, {limitFov: true, fov: 10, extraStats: [], label: "Twister"})
    let theiaCelestial = new LayeredBoss("theiaCelestial", "Theia", "CMCCelestial", 9, "gold", "baseTrapTurret", 6.5, 5.5);
    theiaCelestial.addLayer({gun: {
            POSITION: [3.8, 6, 1.4, 8, 0, null, 1],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.drone, g.summoner, g.destroyer, {health: 1.4, damage: 1.4, resist: 1.2, density: 1.8, maxSpeed: 1.325}]),
                TYPE: ["summonerDrone", {INDEPENDENT: true}],
                AUTOFIRE: true,
                WAIT_TO_CYCLE: true,
                SYNCS_SKILLS: true,
            },
        }
    }, true, null, 35);
    theiaCelestial.addLayer({turret: {
            POSITION: [10, 7.5, 0, null, 160, 0],
            TYPE: ["theiaCelestialTwisterTurret", {GUN_STAT_SCALE: {health: 1.3, damage: 1.1, resist: 1.2, speed: 1.1, maxSpeed: 0.8}}],
        }
    }, true, 6);

    Class.kronosCelestialPaverTurretMissile = {
        PARENT: "missile",
        GUNS: [
            {
                POSITION: [13, 6, 1, 0, 0, 180, 0],
            },
            {
                POSITION: [2, 6, 1.7, 13, 0, 180, 0],
                PROPERTIES: {
                    AUTOFIRE: true,
                    SHOOT_SETTINGS: combineStats([g.trap, { recoil: 0.5 }, g.lowPower]),
                    TYPE: ["trap", { PERSISTS_AFTER_DEATH: true }],
                    STAT_CALCULATOR: "thruster",
                },
            },
        ],
    }
    Class.kronosCelestialPaverTurret = makeTurret({
        GUNS: [
            {
                POSITION: [10, 10, 0, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, {range: 0.0005, speed: 0.0005, maxSpeed: 0.0005, recoil: 0}]),
                    TYPE: "stupidBullet",
                    DRAW_FILL: false,
                    BORDERLESS: true,
                },
            },
            {
                POSITION: [10, 9, 1.1, 9, 0, 0, 0],
            },
            {
                POSITION: [17, 13, 1.25, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.artillery, g.artillery, g.skimmer, { reload: 2, health: 1.7, damage: 1.4, resist: 1.2 }, {speed: 0.8, maxSpeed: 0.6}]),
                    TYPE: "kronosCelestialPaverTurretMissile",
                },
            },
            {
                POSITION: [6, 6, 1.4, 9, 0, 0, 0],
            },
        ],
    }, {limitFov: true, fov: 10, extraStats: [], label: "Paver"})
    Class.kronosCelestialBentCruiserTurret = makeTurret({
        GUNS: [
            {
                POSITION: [10, 10, 0, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, {range: 0.0005, speed: 0.0005, maxSpeed: 0.0005, recoil: 0}]),
                    TYPE: "stupidBullet",
                    DRAW_FILL: false,
                    BORDERLESS: true,
                },
            },
            {
                POSITION: [7, 8, 0.6, 7, 2, 30, 0.5],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.swarm, g.battleship, g.carrier]),
                    TYPE: "swarm",
                    STAT_CALCULATOR: "swarm",
                },
            },
            {
                POSITION: [7, 8, 0.6, 7, -2, -30, 0.5],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.swarm, g.battleship, g.carrier]),
                    TYPE: "swarm",
                    STAT_CALCULATOR: "swarm",
                },
            },
        ],
    }, {limitFov: true, fov: 10, extraStats: [], label: "Bent Cruiser"})
    let kronosCelestial = new LayeredBoss("kronosCelestial", "Kronos", "CMCCelestial", 9, "veryLightGrey", "baseTrapTurret", 6.5, 5.5);
    kronosCelestial.addLayer({turret: {
            POSITION: [8.5, 9, 0, null, 180, 0],
            TYPE: ["kronosCelestialBentCruiserTurret", {GUN_STAT_SCALE: g.battleship}]
        }
    });
    kronosCelestial.addLayer({turret: {
            POSITION: [10.6, 7.5, 0, null, 160, 0],
            TYPE: "kronosCelestialPaverTurret",
        }
    }, true, 6);

    Class.ragnarokCelestialInceptionTurretMissile = {
        PARENT: "minimissile",
        TURRETS: [
            {
                POSITION: [14, 0, 0, 0, 360, 1],
                TYPE: "autoTankGun",
            },
        ],
    }
    Class.ragnarokCelestialInceptionTurret = makeTurret({
        GUNS: [
            {
                POSITION: [10, 10, 0, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, {range: 0.0005, speed: 0.0005, maxSpeed: 0.0005, recoil: 0}]),
                    TYPE: "stupidBullet",
                    DRAW_FILL: false,
                    BORDERLESS: true,
                },
            },
            {
                POSITION: [10, 9, 1, 9, 0, 0, 0],
            },
            {
                POSITION: [17, 13, 1, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.artillery, g.artillery]),
                    TYPE: "ragnarokCelestialInceptionTurretMissile",
                    STAT_CALCULATOR: "sustained",
                },
            },
            {
                POSITION: [4, 8, 1, 13, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.artillery, g.artillery, g.fake]),
                    TYPE: "bullet",
                }
            },
        ],
    }, {limitFov: true, fov: 10, extraStats: [], label: "Inception"})
    let ragnarokCelestial = new LayeredBoss("ragnarokCelestial", "Odin", "CMCCelestial", 9, "hexagon", "baseTrapTurret", 6.5, 5.5);
    ragnarokCelestial.addLayer({gun: {
            POSITION: [2.25, 3.25, -1.6, 9, 0, null, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.drone, g.summoner, g.pounder, g.destroyer, {speed: 1.25, maxSpeed: 1.25}]),
                TYPE: ["realchip", {INDEPENDENT: true, DRAW_HEALTH: true, COLOR: 'hexagon'}],
                AUTOFIRE: true,
                SYNCS_SKILLS: true,
            },
        }
    }, true, null, 14);
    ragnarokCelestial.addLayer({turret: {
            POSITION: [10.6, 7.5, 0, null, 160, 0],
            TYPE: "ragnarokCelestialInceptionTurret",
        }
    }, true, 6);

    Class.atlasCelestialBeekeeperTurret = makeTurret({
        GUNS: [
            {
                POSITION: [10, 10, 0, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, {range: 0.0005, speed: 0.0005, maxSpeed: 0.0005, recoil: 0}]),
                    TYPE: "stupidBullet",
                    DRAW_FILL: false,
                    BORDERLESS: true,
                },
            },
            {
                POSITION: [14, 3, 1, 0, -6, -7, 0.25],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.swarm, g.bee, {recoil: 0}]),
                    TYPE: ["bee", { INDEPENDENT: false }],
                    SYNCS_SKILLS: true,
                    STAT_CALCULATOR: "drone",
                    WAIT_TO_CYCLE: true,
                    LABEL: "Secondary",
                },
            },
            {
                POSITION: [14, 3, 1, 0, 6, 7, 0.75],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.swarm, g.bee, {recoil: 0}]),
                    TYPE: ["bee", { INDEPENDENT: false }],
                    SYNCS_SKILLS: true,
                    STAT_CALCULATOR: "drone",
                    WAIT_TO_CYCLE: true,
                    LABEL: "Secondary",
                },
            },
            {
                POSITION: [19, 12, 1, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.artillery, {recoil: 0}]),
                    TYPE: "bullet",
                    LABEL: "Heavy",
                },
            },
        ],
    }, {limitFov: true, fov: 10, extraStats: [], label: "Beekeeper"})
    Class.atlasCelestialNailgunTurret = makeTurret({
        GUNS: [
            {
                POSITION: [10, 10, 0, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, {range: 0.0005, speed: 0.0005, maxSpeed: 0.0005, recoil: 0}]),
                    TYPE: "stupidBullet",
                    DRAW_FILL: false,
                    BORDERLESS: true,
                },
            },
            {
                POSITION: [19, 2, 1, 0, -2.5, 0, 0.25],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.power, g.twin, g.nailgun, {recoil: 0}]),
                    TYPE: "bullet",
                },
            },
            {
                POSITION: [19, 2, 1, 0, 2.5, 0, 0.75],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.power, g.twin, g.nailgun, {recoil: 0}]),
                    TYPE: "bullet",
                },
            },
            {
                POSITION: [20, 2, 1, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.power, g.twin, g.nailgun, {recoil: 0}]),
                    TYPE: "bullet",
                },
            },
            {
                POSITION: [5.5, 7, -1.8, 6.5, 0, 0, 0],
            },
        ],
    }, {limitFov: true, fov: 10, extraStats: [], label: "Nailgun"})
    let atlasCelestial = new LayeredBoss("atlasCelestial", "Atlas", "CMCCelestial", 9, "lavender", "baseTrapTurret", 6.5, 5.5);
    atlasCelestial.addLayer({turret: {
            POSITION: [8.5, 9, 0, null, 180, 0],
            TYPE: "atlasCelestialBeekeeperTurret",
        }
    });
    atlasCelestial.addLayer({turret: {
            POSITION: [10.6, 7.5, 0, null, 160, 0],
            TYPE: ["atlasCelestialNailgunTurret", {GUN_STAT_SCALE: {speed: 1.1, maxSpeed: 1.1, resist: 1.3}}],
        }
    }, true, 6);

    Class.rheaCelestialMegaphoneTurretHangar = {
        PARENT: "genericTank",
        LABEL: "Hangar",
        SHAPE: 'M 0 0',
        MIRROR_MASTER_ANGLE: true,
        INDEPENDENT: true,
        GUNS: weaponArray({
            POSITION: [6, 12, 1.2, 8, 0, 90, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.drone, g.overseer, {damage: 0.5, health: 0.5, speed: 1.5, maxSpeed: 1.5}]),
                TYPE: "drone",
                AUTOFIRE: true,
                SYNCS_SKILLS: true,
                STAT_CALCULATOR: "drone",
                WAIT_TO_CYCLE: true,
                MAX_CHILDREN: 4,
            }
        }, 2)
    }
    Class.rheaCelestialMegaphoneTurret = makeTurret({
        GUNS: [
            {
                POSITION: [67, 6.5, 1, 0, 0, 0, 0],
            },
            {
                POSITION: [5, 8.5, -1.5, 8, 0, 0, 0],
            },
        ],
        TURRETS: [
            {
                POSITION: [8, 60, 0, 0, 360, 0],
                TYPE: [ "rheaCelestialMegaphoneTurretHangar", { GUN_STAT_SCALE: g.flankGuard, INDEPENDENT: false, HAS_NO_RECOIL: true } ],
            },
            {
                POSITION: [8, 50, 0, 0, 360, 0],
                TYPE: [ "rheaCelestialMegaphoneTurretHangar", { GUN_STAT_SCALE: g.flankGuard, INDEPENDENT: false, HAS_NO_RECOIL: true } ],
            },
            {
                POSITION: [8, 40, 0, 0, 360, 0],
                TYPE: [ "rheaCelestialMegaphoneTurretHangar", { GUN_STAT_SCALE: g.flankGuard, INDEPENDENT: false, HAS_NO_RECOIL: true } ],
            },
        ],
    }, {limitFov: true, fov: 10, extraStats: [], label: "Megaphone"})
    Class.rheaCelestialCrowbarTurret = makeTurret({
        GUNS: [
            {
                POSITION: [37, 6.5, 1, 0, 0, 0, 0],
            },
            {
                POSITION: [5, 8.5, -1.5, 8, 0, 0, 0],
            },
        ],
        TURRETS: [
            {
                POSITION: [6, 38, 0, 0, 360, 1],
                TYPE: [ "autoTankGun", { GUN_STAT_SCALE: g.flankGuard, INDEPENDENT: false, HAS_NO_RECOIL: true } ],
            },
            {
                POSITION: [6, 28, 0, 0, 360, 1],
                TYPE: [ "autoTankGun", { GUN_STAT_SCALE: g.flankGuard, INDEPENDENT: true, HAS_NO_RECOIL: true } ],
            },
            {
                POSITION: [6, 18, 0, 0, 360, 1],
                TYPE: [ "autoTankGun", { GUN_STAT_SCALE: g.flankGuard, INDEPENDENT: false, HAS_NO_RECOIL: true } ],
            },
        ],
    }, {limitFov: true, fov: 10, extraStats: [], label: "Crowbar"})
    let rheaCelestial = new LayeredBoss("rheaCelestial", "Rhea", "CMCCelestial", 9, "yellow", "baseTrapTurret", 6.5, 5.5);
    rheaCelestial.addLayer({turret: {
            POSITION: [8.5, 9, 0, null, 180, 0],
            TYPE: "rheaCelestialMegaphoneTurret",
        }
    });
    rheaCelestial.addLayer({turret: {
            POSITION: [10.6, 7.5, 0, null, 160, 0],
            TYPE: "rheaCelestialCrowbarTurret",
        }
    }, true, 6);

    Class.juliusCelestialHomingBasicTurret = makeTurret({
        GUNS: [
            {
                POSITION: [10, 10, 0, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, {range: 0.0005, speed: 0.0005, maxSpeed: 0.0005, recoil: 0}]),
                    TYPE: "stupidBullet",
                    DRAW_FILL: false,
                    BORDERLESS: true,
                },
            },
            {
                POSITION: [18, 8, 1, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, {reload: 1.5, maxSpeed: 1.25, range: 1.5}]),
                    TYPE: "homingBullet",
                }
            },
            {
                POSITION: [4, 10, 0.8, 12, 0, 0, 0],
            },
        ],
    }, {limitFov: true, fov: 10, extraStats: [], label: "Homing-Basic"})
    Class.juliusCelestialLauncherTurret = makeTurret({
        GUNS: [
            {
                POSITION: [10, 10, 0, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, {range: 0.0005, speed: 0.0005, maxSpeed: 0.0005, recoil: 0}]),
                    TYPE: "stupidBullet",
                    DRAW_FILL: false,
                    BORDERLESS: true,
                },
            },
            {
                POSITION: [10, 9, 1, 9, 0, 0, 0],
            },
            {
                POSITION: [17, 13, 1, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.launcher]),
                    TYPE: "minimissile",
                    STAT_CALCULATOR: "sustained",
                },
            },
        ],
    }, {limitFov: true, fov: 10, extraStats: [], label: "Launcher"})
    let juliusCelestial = new LayeredBoss("juliusCelestial", "Julius", "CMCCelestial", 9, "darkGrey", "baseTrapTurret", 6.5, 5.5);
    Class["juliusCelestial"].LABEL = "Rogue Celestial"
    juliusCelestial.addLayer({turret: {
            POSITION: [8.5, 9, 0, null, 180, 0],
            TYPE: "juliusCelestialHomingBasicTurret",
        }
    });
    juliusCelestial.addLayer({turret: {
            POSITION: [10.6, 7.5, 0, null, 160, 0],
            TYPE: "juliusCelestialLauncherTurret",
        }
    }, true, 6);

    Class.genghisCelestialProductionerTurret = makeTurret({
        GUNS: [
            {
                POSITION: [10, 10, 0, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, {range: 0.0005, speed: 0.0005, maxSpeed: 0.0005, recoil: 0}]),
                    TYPE: "stupidBullet",
                    DRAW_FILL: false,
                    BORDERLESS: true,
                },
            },
            {
                POSITION: [4, 6, 1, 10, 0, 0, 0],
            },
            {
                POSITION: [1, 8, 1, 15, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.swarm, g.babyfactory, { size: 1.2, reload: 1.5 }]),
                    TYPE: "tinyMinion",
                    STAT_CALCULATOR: "drone",
                    SYNCS_SKILLS: true,
                },
            },
            {
                POSITION: [11.5, 8, -2, 0, 0, 0, 0],
            },
        ],
    }, {limitFov: true, fov: 10, extraStats: [], label: "Productioner"})
    Class.genghisCelestialTwinTurret = makeTurret({
        GUNS: [
            {
                POSITION: [10, 10, 0, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, {range: 0.0005, speed: 0.0005, maxSpeed: 0.0005, recoil: 0}]),
                    TYPE: "stupidBullet",
                    DRAW_FILL: false,
                    BORDERLESS: true,
                },
            },
            {
                POSITION: [20, 8, 1, 0, 5.5, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.doubleTwin]),
                    TYPE: "bullet"
                }
            },
            {
                POSITION: [20, 8, 1, 0, -5.5, 0, 0.5],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.doubleTwin]),
                    TYPE: "bullet"
                }
            }
        ],
    }, {limitFov: true, fov: 10, extraStats: [], label: "Twin"})
    let genghisCelestial = new LayeredBoss("genghisCelestial", "Genghis", "CMCCelestial", 9, "darkGrey", "baseTrapTurret", 6.5, 5.5);
    Class["genghisCelestial"].LABEL = "Rogue Celestial"
    genghisCelestial.addLayer({turret: {
            POSITION: [8.5, 9, 0, null, 180, 0],
            TYPE: "genghisCelestialProductionerTurret",
        }
    });
    genghisCelestial.addLayer({turret: {
            POSITION: [10.6, 7.5, 0, null, 160, 0],
            TYPE: "genghisCelestialTwinTurret",
        }
    }, true, 6);

    Class.napoleonCelestialBeekeeperTurret = makeTurret({
        GUNS: [
            {
                POSITION: [10, 10, 0, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, {range: 0.0005, speed: 0.0005, maxSpeed: 0.0005, recoil: 0}]),
                    TYPE: "stupidBullet",
                    DRAW_FILL: false,
                    BORDERLESS: true,
                },
            },
            {
                POSITION: [14, 6, 0.8, 0, -6, -7, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.swarm, g.bee]),
                    TYPE: ["bee", { INDEPENDENT: true }],
                    SYNCS_SKILLS: true,
                    STAT_CALCULATOR: "drone",
                    WAIT_TO_CYCLE: true,
                },
            },
            {
                POSITION: [14, 6, 0.8, 0, 6, 7, 0.5],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.swarm, g.bee]),
                    TYPE: ["bee", { INDEPENDENT: true }],
                    SYNCS_SKILLS: true,
                    STAT_CALCULATOR: "drone",
                    WAIT_TO_CYCLE: true,
                },
            },
        ],
    }, {limitFov: true, fov: 10, extraStats: [], label: "Beekeeper"})
    Class.napoleonCelestialPounderDriveTurretBulletTurret = makeTurret({
        GUNS: [
            {
                POSITION: [22, 10, 1, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.flankGuard, {recoil: 0}]),
                    TYPE: "bullet",
                },
            },
        ],
    }, {canRepel: true, limitFov: true, fov: 3})
    Class.napoleonCelestialPounderDriveTurretBullet = makeAuto('bullet', "Auto-Bullet", {type: 'napoleonCelestialPounderDriveTurretBulletTurret'})
    Class.napoleonCelestialPounderDriveTurret = makeTurret({
        TURRETS: [
            {
                POSITION: [9, 0, 0, 0, 360, 1],
                TYPE: ["overdriveDeco", {MIRROR_MASTER_ANGLE: true}],
            },
        ],
        GUNS: [
            {
                POSITION: [10, 10, 0, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, {range: 0.0005, speed: 0.0005, maxSpeed: 0.0005, recoil: 0}]),
                    TYPE: "stupidBullet",
                    DRAW_FILL: false,
                    BORDERLESS: true,
                },
            },
            {
                POSITION: [20, 12, 1, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.pounder]),
                    TYPE: "napoleonCelestialPounderDriveTurretBullet",
                }
            },
        ],
    }, {limitFov: true, fov: 10, extraStats: [], label: "Pounder-Drive"})
    let napoleonCelestial = new LayeredBoss("napoleonCelestial", "Napoleon", "CMCCelestial", 9, "darkGrey", "baseTrapTurret", 6.5, 5.5);
    Class["napoleonCelestial"].LABEL = "Rogue Celestial"
    napoleonCelestial.addLayer({turret: {
            POSITION: [8.5, 9, 0, null, 180, 0],
            TYPE: "napoleonCelestialBeekeeperTurret",
        }
    });
    napoleonCelestial.addLayer({turret: {
            POSITION: [10.6, 7.5, 0, null, 160, 0],
            TYPE: "napoleonCelestialPounderDriveTurret",
        }
    }, true, 6);

    Class.moarCelestials.UPGRADES_TIER_0.push("moarCelestialsCelestials");
    Class.moarCelestialsCelestials.UPGRADES_TIER_0 = ["moarCelestials", "paladinCelestial", "freyjaCelestial", "zaphkielCelestial", "nyxCelestial", "theiaCelestial", "kronosCelestial", "ragnarokCelestial", "atlasCelestial", "rheaCelestial", "juliusCelestial", "genghisCelestial", "napoleonCelestial"]
}

if (createEternals === true) {
    Class.moarCelestialsEternals = makeMenu("Eternals", "rainbow", 11)
    Class.moarCelestialsEternals.UPGRADES_TIER_0 = []

    Class.CMCEternal = {
        PARENT: "miniboss",
        LABEL: "Eternal",
        SKILL: [9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
        VALUE: 4e6,
        SHAPE: 11,
        SIZE: 90,
        CONTROLLERS: [["minion", {turnwiserange: 360}]],
        DANGER: 12,
        BODY: {
            FOV: 1,
            HEALTH: 3000,
            SHIELD: 150,
            REGEN: base.REGEN * 0.1,
            SPEED: base.SPEED * 0.15,
            DAMAGE: 18,
        },
    };
    Class.paladinEternalBeekeeperTurret = makeTurret('beekeeper', {canRepel: true, limitFov: true, fov: 10, extraStats: []})
    Class.paladinEternalHyperSwarmerTurretHive = {
        PARENT: "bullet",
        LABEL: "Hyper-Hive",
        BODY: {
            RANGE: 90,
            FOV: 0.5,
        },
        FACING_TYPE: "turnWithSpeed",
        INDEPENDENT: true,
        CONTROLLERS: ["nearestDifferentMaster", "targetSelf"],
        AI: { NO_LEAD: true },
        GUNS: weaponArray({
            POSITION: [7, 8, 0.6, 7, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.swarm, g.hive, g.bee]),
                TYPE: ["bee", { PERSISTS_AFTER_DEATH: true }],
                STAT_CALCULATOR: "swarm",
                AUTOFIRE: true
            },
        }, 7, 1/7)
    }
    Class.paladinEternalHyperSwarmerTurret = makeTurret({
        GUNS: [
            {
                POSITION: [10, 10, 0, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, {range: 0.0005, speed: 0.0005, maxSpeed: 0.0005, recoil: 0}]),
                    TYPE: "stupidBullet",
                    DRAW_FILL: false,
                    BORDERLESS: true,
                },
            },
            {
                POSITION: [20, 14, -1.2, 5, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.destroyer, g.hive]),
                    TYPE: "paladinEternalHyperSwarmerTurretHive",
                },
            },
            {
                POSITION: [20, 12, 1, 5, 0, 0, 0],
            },
        ],
    }, {limitFov: true, fov: 10, extraStats: [], label: "Hyper Swarmer"})

    let paladinEternal = new LayeredBoss("paladinEternal", "Paladin", "CMCEternal", 11, "purple", "baseTrapTurret", 4.5, 5.5);
    paladinEternal.addLayer({gun: {
            POSITION: [3.8, 5, 1.4, 8, 0, null, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.drone, g.summoner, g.destroyer, {health: 1.4, damage: 1.4, resist: 1.2, density: 1.8, maxSpeed: 1.325}, {reload: 1.1, damage: 1.1, health: 1.1, pen: 1.1, speed: 1.1, maxSpeed: 1.1}]),
                TYPE: ["demonchip", {INDEPENDENT: true}],
                AUTOFIRE: true,
                SYNCS_SKILLS: true,
                STAT_CALCULATOR: "drone",
                WAIT_TO_CYCLE: true,
            },
        }
    }, true, null, 20);
    paladinEternal.addLayer({turret: {
            POSITION: [6.5, 9, 0, null, 160, 0],
            TYPE: ["paladinEternalHyperSwarmerTurret", {GUN_STAT_SCALE: {speed: 2, maxSpeed: 0.3, health: 1.3, range: 2}}],
        }
    }, true, 4);
    paladinEternal.addLayer({turret: {
            POSITION: [8.5, 9, 0, null, 160, 0],
            TYPE: ["paladinEternalBeekeeperTurret", {GUN_STAT_SCALE: {speed: 1.2, maxSpeed: 1.2, health: 1.15, range: 0.8}}],
        }
    }, true, 4);

    Class.freyjaEternalCarrierTurret = makeTurret({
        GUNS: [
            {
                POSITION: [10, 10, 0, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, {range: 0.0005, speed: 0.0005, maxSpeed: 0.0005, recoil: 0}]),
                    TYPE: "stupidBullet",
                    DRAW_FILL: false,
                    BORDERLESS: true,
                },
            },
            {
                POSITION: [7, 8, 0.6, 7, 2, 30, 0.5],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.swarm, g.carrier]),
                    TYPE: "autoswarm",
                    STAT_CALCULATOR: "swarm",
                    LABEL: "Autonomous"
                },
            },
            {
                POSITION: [7, 8, 0.6, 7, -2, -30, 0.5],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.swarm, g.carrier]),
                    TYPE: "autoswarm",
                    STAT_CALCULATOR: "swarm",
                    LABEL: "Autonomous"
                },
            },
            {
                POSITION: [7, 8, 0.6, 7, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.swarm, g.battleship, g.carrier]),
                    TYPE: "swarm",
                    STAT_CALCULATOR: "swarm",
                    LABEL: "Guided"
                },
            },
        ],
    }, {limitFov: true, fov: 10, extraStats: [], label: "Carrier"})
    Class.freyjaEternalTripletTurret = makeTurret({
        GUNS: [
            {
                POSITION: [10, 10, 0, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, {range: 0.0005, speed: 0.0005, maxSpeed: 0.0005, recoil: 0}]),
                    TYPE: "stupidBullet",
                    DRAW_FILL: false,
                    BORDERLESS: true,
                },
            },
            {
                POSITION: [14, 5, 1, 0, -4.5, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.twin, g.twin, g.power, { reload: 2 }]),
                    TYPE: "bullet",
                },
            },
            {
                POSITION: [14, 5, 1, 0, 4.5, 0, 0.33],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.twin, g.twin, g.power, { reload: 2 }]),
                    TYPE: "bullet",
                },
            },
            {
                POSITION: [16, 5, 1, 0, 0, 0, 0.67],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.twin, g.twin, g.power, { reload: 2 }]),
                    TYPE: "bullet",
                },
            },
        ],
    }, {limitFov: true, fov: 10, extraStats: [], label: "Triplet"})
    Class.freyjaEternalAerodriveTurretedSwarm = {
        PARENT: 'swarm',
        LABEL: 'Auto-Swarm',
        TURRETS: [
            {
                POSITION: [10, 0, 0, 0, 360, 1],
                TYPE: ['autoTankGun', {GUN_STAT_SCALE: {health: 0.8}, HAS_NO_RECOIL: true}]
            }
        ],
    }
    Class.freyjaEternalAerodriveTurret = makeTurret({
        TURRETS: [
            {
                POSITION: [9, 0, 0, 0, 360, 1],
                TYPE: ["overdriveDeco", {MIRROR_MASTER_ANGLE: true}],
            },
        ],
        GUNS: [
            {
                POSITION: [10, 10, 0, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, {range: 0.0005, speed: 0.0005, maxSpeed: 0.0005, recoil: 0}]),
                    TYPE: "stupidBullet",
                    DRAW_FILL: false,
                    BORDERLESS: true,
                },
            },
            {
                POSITION: [7, 7.5, 0.6, 7, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.swarm, {reload: 0.8, damage: 0.9, health: 1.2, speed: 0.9, maxSpeed: 0.8, range: 1.1, density: 1.215}]),
                    TYPE: "freyjaEternalAerodriveTurretedSwarm",
                    STAT_CALCULATOR: "swarm",
                },
            },
        ],
    }, {limitFov: true, fov: 10, extraStats: [], label: "Aerodrive"})
    let freyjaEternal = new LayeredBoss("freyjaEternal", "Freyja", "CMCEternal", 11, "lightGreen", "baseTrapTurret", 4.5, 5.5);
    freyjaEternal.addLayer({turret: {
            POSITION: [6.5, 9, 0, null, 160, 0],
            TYPE: ["freyjaEternalCarrierTurret", {GUN_STAT_SCALE: {health: 1.2, damage: 1.3, speed: 1.1, maxSpeed: 1.1, resist: 1.05}}],
        }
    }, true, null, 20);
    freyjaEternal.addLayer({turret: {
            POSITION: [6.5, 9, 0, null, 160, 0],
            TYPE: ["freyjaEternalTripletTurret", {GUN_STAT_SCALE: {health: 1.2, damage: 1.2, speed: 1.15, maxSpeed: 0.9, resist: 1.2}}],
        }
    }, true, 4);
    freyjaEternal.addLayer({turret: {
            POSITION: [8.5, 9, 0, null, 160, 0],
            TYPE: ["freyjaEternalAerodriveTurret", {GUN_STAT_SCALE: {health: 1.2, damage: 1.2, speed: 2, maxSpeed: 1.5, resist: 1.2}}],
        }
    }, true, 4);

    Class.zaphkielEternalHyperSkimmerTurret = makeTurret({
        GUNS: [
            {
                POSITION: [10, 10, 0, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, {range: 0.0005, speed: 0.0005, maxSpeed: 0.0005, recoil: 0}]),
                    TYPE: "stupidBullet",
                    DRAW_FILL: false,
                    BORDERLESS: true,
                },
            },
            {
                POSITION: [10, 13, -0.5, 11, 0, 0, 0],
            },
            {
                POSITION: [10, 14, -0.5, 9, 0, 0, 0],
            },
            {
                POSITION: [17, 15, 1, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.artillery, g.artillery, g.skimmer]),
                    TYPE: "hypermissile",
                    STAT_CALCULATOR: "sustained",
                },
            },
        ],
    }, {limitFov: true, fov: 10, extraStats: [], label: "Hyper Skimmer"})
    Class.zaphkielEternalAnnihilatorTurret = makeTurret({
        GUNS: [
            {
                POSITION: [10, 10, 0, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, {range: 0.0005, speed: 0.0005, maxSpeed: 0.0005, recoil: 0}]),
                    TYPE: "stupidBullet",
                    DRAW_FILL: false,
                    BORDERLESS: true,
                },
            },
            {
                POSITION: [20.5, 19.5, 1, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.destroyer, g.annihilator]),
                    TYPE: "bullet",
                },
            },
        ],
    }, {limitFov: true, fov: 10, extraStats: [], label: "Annihilator"})
    let zaphkielEternal = new LayeredBoss("zaphkielEternal", "Zaphkiel", "CMCEternal", 11, "orange", "baseTrapTurret", 4.5, 5.5);
    zaphkielEternal.addLayer({gun: {
            POSITION: [3.8, 5, 1.4, 8, 0, null, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.drone, g.summoner, g.destroyer, {health: 1.4, damage: 1.4, resist: 1.2, density: 1.8, maxSpeed: 1.325}]),
                TYPE: ["dorito", {INDEPENDENT: true}],
                AUTOFIRE: true,
                SYNCS_SKILLS: true,
            },
        }
    }, true, null, 20);
    zaphkielEternal.addLayer({turret: {
            POSITION: [6.5, 9, 0, null, 160, 0],
            TYPE: ["zaphkielEternalHyperSkimmerTurret", {GUN_STAT_SCALE: {health: 1.3, range: 1.5}}],
        }
    }, true, 4);
    zaphkielEternal.addLayer({turret: {
            POSITION: [8.5, 9, 0, null, 160, 0],
            TYPE: ["zaphkielEternalAnnihilatorTurret", {GUN_STAT_SCALE: {health: 1.2, damage: 1.2, speed: 3, maxSpeed: 1, resist: 1.2}}],
        }
    }, true, 4);

    Class.nyxEternalLeviathanTurret = makeTurret({
        GUNS: [
            {
                POSITION: [10, 10, 0, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, {range: 0.0005, speed: 0.0005, maxSpeed: 0.0005, recoil: 0}]),
                    TYPE: "stupidBullet",
                    DRAW_FILL: false,
                    BORDERLESS: true,
                },
            },
            {
                POSITION: [10, 14.25, -0.7, 10, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.destroyer, g.launcher, g.rocketeer]),
                    TYPE: "rocketeerMissile",
                    STAT_CALCULATOR: "sustained",
                },
            },
            {
                POSITION: [17, 20, 0.75, 0, 0, 0, 0],
            },
        ],
    }, {limitFov: true, fov: 10, extraStats: [], label: "Leviathan"})
    Class.nyxEternalProducerTurret = makeTurret({
        GUNS: [
            {
                POSITION: [10, 10, 0, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, {range: 0.0005, speed: 0.0005, maxSpeed: 0.0005, recoil: 0}]),
                    TYPE: "stupidBullet",
                    DRAW_FILL: false,
                    BORDERLESS: true,
                },
            },
            {
                POSITION: [4, 6, 1, 10, 0, 0, 0.5],
            },
            {
                POSITION: [1, 8, 1, 15, 0, 0, 0.5],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.swarm, g.babyfactory, { size: 1.2, reload: 1.5 }]),
                    TYPE: "tinyMinion",
                    STAT_CALCULATOR: "drone",
                    SYNCS_SKILLS: true,
                },
            },
            {
                POSITION: [11, 10, 0.8, 0, 0, 0, 0.5],
            },
        ],
    }, {limitFov: true, fov: 10, extraStats: [], label: "Producer"})
    Class.nyxEternalMegaMinion = {
        PARENT: 'minion',
        LABEL: 'Mega Minion',
        GUNS: [
            {
                POSITION: [17.5, 11.75, 1, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.minionGun]),
                    WAIT_TO_CYCLE: true,
                    TYPE: "bullet",
                },
            },
        ],
    }
    let nyxEternal = new LayeredBoss("nyxEternal", "Nyx", "CMCEternal", 11, "pink", "baseTrapTurret", 4.5, 5.5);
    nyxEternal.addLayer({gun: {
            POSITION: [3.8, 5, -1.4, 8, 0, null, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.spawner, { size: 0.7, maxSpeed: 0.85, damage: 0.8 }, {reload: 1.2}]),
                TYPE: ["nyxEternalMegaMinion", {INDEPENDENT: true,}],
                AUTOFIRE: true,
                SYNCS_SKILLS: true,
            },
        }
    }, true, null, 20);
    nyxEternal.addLayer({turret: {
            POSITION: [6.5, 9, 0, null, 160, 0],
            TYPE: ["nyxEternalLeviathanTurret", {GUN_STAT_SCALE: {maxSpeed: 0.5}}],
        }
    }, true, 4);
    nyxEternal.addLayer({turret: {
            POSITION: [8.5, 9, 0, null, 160, 0],
            TYPE: ["nyxEternalProducerTurret", {GUN_STAT_SCALE: {maxSpeed: 0.5}}],
        }
    }, true, 4);

    Class.theiaEternalHyperTwisterTurret = makeTurret({
        GUNS: [
            {
                POSITION: [10, 10, 0, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, {range: 0.0005, speed: 0.0005, maxSpeed: 0.0005, recoil: 0}]),
                    TYPE: "stupidBullet",
                    DRAW_FILL: false,
                    BORDERLESS: true,
                },
            },
            {
                POSITION: [10, 12, -0.5, 11, 0, 0, 0],
            },
            {
                POSITION: [10, 13, -0.5, 9, 0, 0, 0],
            },
            {
                POSITION: [17, 14, -1.4, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.artillery, g.artillery, g.skimmer, { reload: 4/3 }, { reload: 4/3 }]),
                    TYPE: "hyperspinmissile",
                    STAT_CALCULATOR: "sustained",
                },
            },
        ],
    }, {limitFov: true, fov: 10, extraStats: [], label: "Hyper Twister"})
    Class.theiaEternalSprayerTurret = makeTurret({
        GUNS: [
            {
                POSITION: [10, 10, 0, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, {range: 0.0005, speed: 0.0005, maxSpeed: 0.0005, recoil: 0}]),
                    TYPE: "stupidBullet",
                    DRAW_FILL: false,
                    BORDERLESS: true,
                },
            },
            {
                POSITION: [23, 7, 1, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.lowPower, g.pelleter, { recoil: 1.15 }]),
                    TYPE: "bullet"
                }
            },
            {
                POSITION: [12, 10, 1.4, 8, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.machineGun]),
                    TYPE: "bullet"
                }
            }
        ],
    }, {limitFov: true, fov: 10, extraStats: [], label: "Sprayer"})
    let theiaEternal = new LayeredBoss("theiaEternal", "Theia", "CMCEternal", 11, "gold", "baseTrapTurret", 4.5, 5.5);
    theiaEternal.addLayer({gun: {
            POSITION: [3.8, 5, 1.4, 8, 0, null, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.drone, g.summoner, g.destroyer, {health: 1.4, damage: 1.4, resist: 1.2, density: 1.8, maxSpeed: 1.325}]),
                TYPE: ["summonerDrone", {INDEPENDENT: true}],
                AUTOFIRE: true,
                WAIT_TO_CYCLE: true,
                SYNCS_SKILLS: true,
            },
        }
    }, true, null, 45);
    theiaEternal.addLayer({turret: {
            POSITION: [6.5, 9, 0, null, 160, 0],
            TYPE: ["theiaEternalHyperTwisterTurret", {GUN_STAT_SCALE: {maxSpeed: 0.5}}],
        }
    }, true, 4);
    theiaEternal.addLayer({turret: {
            POSITION: [8.5, 9, 0, null, 160, 0],
            TYPE: ["theiaEternalSprayerTurret", {GUN_STAT_SCALE: {maxSpeed: 0.5}}],
        }
    }, true, 4);

    Class.kronosEternalHyperPaverTurretMissile = {
        PARENT: "missile",
        GUNS: [
            {
                POSITION: [13, 6, 1, 0, 0, 90, 0],
            },
            {
                POSITION: [13, 6, 1, 0, 0, -90, 0],
            },
            {
                POSITION: [4, 6, 1.7, 13, 0, 90, 0.5],
                PROPERTIES: {
                    AUTOFIRE: true,
                    SHOOT_SETTINGS: combineStats([g.trap, { recoil: 0.5 }, g.lowPower]),
                    TYPE: ["trap", { PERSISTS_AFTER_DEATH: true }],
                    STAT_CALCULATOR: "thruster",
                },
            },
            {
                POSITION: [4, 6, 1.7, 13, 0, -90, 0.5],
                PROPERTIES: {
                    AUTOFIRE: true,
                    SHOOT_SETTINGS: combineStats([g.trap, { recoil: 0.5 }, g.lowPower]),
                    TYPE: ["trap", { PERSISTS_AFTER_DEATH: true }],
                    STAT_CALCULATOR: "thruster",
                },
            },
            {
                POSITION: [14, 6, 1, 0, 0, 180, 0],
                PROPERTIES: {
                    AUTOFIRE: true,
                    SHOOT_SETTINGS: combineStats([g.basic, { recoil: 0.5 }, g.lowPower]),
                    TYPE: ["bullet", { PERSISTS_AFTER_DEATH: true }],
                    STAT_CALCULATOR: "thruster",
                },
            },
        ],
    }
    Class.kronosEternalHyperPaverTurret = makeTurret({
        GUNS: [
            {
                POSITION: [10, 10, 0, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, {range: 0.0005, speed: 0.0005, maxSpeed: 0.0005, recoil: 0}]),
                    TYPE: "stupidBullet",
                    DRAW_FILL: false,
                    BORDERLESS: true,
                },
            },
            {
                POSITION: [10, 9, 1.1, 9, 0, 0, 0],
            },
            {
                POSITION: [20, 11, 1.25, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.artillery, g.artillery, g.skimmer, { reload: 2, health: 1.7, damage: 1.4, resist: 1.2 }, {speed: 0.8, maxSpeed: 0.6}, g.fake]),
                    TYPE: "bullet",
                },
            },
            {
                POSITION: [17, 13, 1.25, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.artillery, g.artillery, g.skimmer, { reload: 2, health: 1.7, damage: 1.4, resist: 1.2 }, {speed: 0.8, maxSpeed: 0.6}]),
                    TYPE: "kronosEternalHyperPaverTurretMissile",
                },
            },
            {
                POSITION: [9, 4, 1.4, 9, 0, 0, 0],
            },
            {
                POSITION: [6, 6, 1.4, 9, 0, 0, 0],
            },
        ],
    }, {limitFov: true, fov: 10, extraStats: [], label: "Hyper-Paver"})
    Class.kronosEternalCarrierTurret = makeTurret({
        GUNS: [
            {
                POSITION: [10, 10, 0, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, {range: 0.0005, speed: 0.0005, maxSpeed: 0.0005, recoil: 0}]),
                    TYPE: "stupidBullet",
                    DRAW_FILL: false,
                    BORDERLESS: true,
                },
            },
            {
                POSITION: [7, 8, 0.6, 7, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.swarm, g.battleship, g.carrier]),
                    TYPE: "swarm",
                    STAT_CALCULATOR: "swarm",
                },
            },
            {
                POSITION: [7, 8, 0.6, 7, 2, 30, 0.5],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.swarm, g.battleship, g.carrier]),
                    TYPE: "swarm",
                    STAT_CALCULATOR: "swarm",
                },
            },
            {
                POSITION: [7, 8, 0.6, 7, -2, -30, 0.5],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.swarm, g.battleship, g.carrier]),
                    TYPE: "swarm",
                    STAT_CALCULATOR: "swarm",
                },
            },
        ],
    }, {limitFov: true, fov: 10, extraStats: [], label: "Carrier"})
    Class.kronosEternalZipperTurret = makeTurret({
        GUNS: [
            {
                POSITION: [10, 10, 0, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, {range: 0.0005, speed: 0.0005, maxSpeed: 0.0005, recoil: 0}]),
                    TYPE: "stupidBullet",
                    DRAW_FILL: false,
                    BORDERLESS: true,
                },
            },
            {
                POSITION: [18, 10, 1, 0, 5, 0, 0.5],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.triplet]),
                    TYPE: "bullet"
                }
            },
            {
                POSITION: [18, 10, 1, 0, -5, 0, 0.5],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.triplet]),
                    TYPE: "bullet"
                }
            },
            {
                POSITION: [7, 7.5, 0.6, 7, 5, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.swarm]),
                    TYPE: "autoswarm",
                    STAT_CALCULATOR: "swarm",
                },
            },
            {
                POSITION: [7, 7.5, 0.6, 7, -5, 0, 0.5],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.swarm]),
                    TYPE: "autoswarm",
                    STAT_CALCULATOR: "swarm",
                },
            },
            {
                POSITION: [21, 10, 1, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.triplet]),
                    TYPE: "bullet"
                }
            }
        ],
    }, {limitFov: true, fov: 10, extraStats: [], label: "Zipper"})
    let kronosEternal = new LayeredBoss("kronosEternal", "Kronos", "CMCEternal", 11, "veryLightGrey", "baseTrapTurret", 4.5, 5.5);
    kronosEternal.addLayer({turret: {
            POSITION: [6.5, 9, 0, null, 160, 0],
            TYPE: ["kronosEternalCarrierTurret", {GUN_STAT_SCALE: g.battleship}]
        }
    });
    kronosEternal.addLayer({turret: {
            POSITION: [6.5, 9, 0, null, 160, 0],
            TYPE: "kronosEternalHyperPaverTurret",
        }
    }, true, 4);
    kronosEternal.addLayer({turret: {
            POSITION: [8.5, 9, 0, null, 160, 0],
            TYPE: ["kronosEternalZipperTurret", {GUN_STAT_SCALE: {health: 1.15, damage: 1.1, resist: 1.3, speed: 1.1, maxSpeed: 0.9}}],
        }
    }, true, 4);

    Class.ragnarokEternalHyperInceptionTurretMissile = {
        PARENT: "minimissile",
        TURRETS: [
            {
                POSITION: [14, 0, 0, 0, 360, 1],
                TYPE: "auto4gun",
            },
        ],
    }
    Class.ragnarokEternalHyperInceptionTurret = makeTurret({
        GUNS: [
            {
                POSITION: [10, 10, 0, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, {range: 0.0005, speed: 0.0005, maxSpeed: 0.0005, recoil: 0}]),
                    TYPE: "stupidBullet",
                    DRAW_FILL: false,
                    BORDERLESS: true,
                },
            },
            {
                POSITION: [10, 9, 1, 9, 0, 0, 0],
            },
            {
                POSITION: [17, 13, 1, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.artillery, g.artillery]),
                    TYPE: "ragnarokEternalHyperInceptionTurretMissile",
                    STAT_CALCULATOR: "sustained",
                },
            },
            {
                POSITION: [4, 8, 1, 13, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.artillery, g.artillery, g.fake]),
                    TYPE: "bullet",
                }
            },
            {
                POSITION: [4, 4, 1, 13, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.artillery, g.artillery, g.fake]),
                    TYPE: "bullet",
                }
            },
        ],
    }, {limitFov: true, fov: 10, extraStats: [], label: "Hyper Inception"})
    Class.ragnarokEternalCruiseGunnerTurret = makeTurret({
        GUNS: [
            {
                POSITION: [10, 10, 0, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, {range: 0.0005, speed: 0.0005, maxSpeed: 0.0005, recoil: 0}]),
                    TYPE: "stupidBullet",
                    DRAW_FILL: false,
                    BORDERLESS: true,
                },
            },
            {
                POSITION: [12, 3.5, 1, 0, 7.25, 0, 0.25],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.gunner, { speed: 1.2 }]),
                    TYPE: "bullet"
                }
            },
            {
                POSITION: [12, 3.5, 1, 0, -7.25, 0, 0.75],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.gunner, { speed: 1.2 }]),
                    TYPE: "bullet"
                }
            },
            {
                POSITION: [7, 7.5, 0.6, 7, 4, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.swarm]),
                    TYPE: "swarm",
                    STAT_CALCULATOR: "swarm",
                },
            },
            {
                POSITION: [7, 7.5, 0.6, 7, -4, 0, 0.5],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.swarm]),
                    TYPE: "swarm",
                    STAT_CALCULATOR: "swarm",
                },
            },
        ],
    }, {limitFov: true, fov: 10, extraStats: [], label: "Cruise Gunner"})
    let ragnarokEternal = new LayeredBoss("ragnarokEternal", "Odin", "CMCEternal", 11, "hexagon", "baseTrapTurret", 4.5, 5.5);
    ragnarokEternal.addLayer({gun: {
            POSITION: [2.25, 3.25, -1.6, 9, 0, null, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.drone, g.summoner, g.pounder, g.destroyer, {speed: 1.25, maxSpeed: 1.25}]),
                TYPE: ["realchip", {INDEPENDENT: true, DRAW_HEALTH: true, COLOR: 'hexagon'}],
                AUTOFIRE: true,
                SYNCS_SKILLS: true,
            },
        }
    }, true, null, 18);
    ragnarokEternal.addLayer({turret: {
            POSITION: [6.5, 9, 0, null, 160, 0],
            TYPE: "ragnarokEternalHyperInceptionTurret",
        }
    }, true, 4);
    ragnarokEternal.addLayer({turret: {
            POSITION: [8.5, 9, 0, null, 160, 0],
            TYPE: ["ragnarokEternalCruiseGunnerTurret", {GUN_STAT_SCALE: {health: 1.15, damage: 1.1, resist: 1.3, speed: 1.1, maxSpeed: 0.9}}],
        }
    }, true, 4);

    Class.atlasEternalBeedriveTurretTurretedBee = {
        PARENT: 'bee',
        LABEL: 'Auto-Bee',
        TURRETS: [
            {
                POSITION: [10, 0, 0, 0, 360, 1],
                TYPE: ['droneAutoTurret', {GUN_STAT_SCALE: {reload: 1.35, damage: 0.8}, HAS_NO_RECOIL: true}]
            }
        ],
    }
    Class.atlasEternalBeedriveTurret = makeTurret({
        GUNS: [
            {
                POSITION: [10, 10, 0, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, {range: 0.0005, speed: 0.0005, maxSpeed: 0.0005, recoil: 0}]),
                    TYPE: "stupidBullet",
                    DRAW_FILL: false,
                    BORDERLESS: true,
                },
            },
            {
                POSITION: [14, 3, 1, 0, -6, -7, 0.25],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.swarm, g.bee, {recoil: 0}]),
                    TYPE: ["atlasEternalBeedriveTurretTurretedBee", { INDEPENDENT: false }],
                    SYNCS_SKILLS: true,
                    STAT_CALCULATOR: "drone",
                    WAIT_TO_CYCLE: true,
                    LABEL: "Secondary",
                },
            },
            {
                POSITION: [14, 3, 1, 0, 6, 7, 0.75],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.swarm, g.bee, {recoil: 0}]),
                    TYPE: ["atlasEternalBeedriveTurretTurretedBee", { INDEPENDENT: false }],
                    SYNCS_SKILLS: true,
                    STAT_CALCULATOR: "drone",
                    WAIT_TO_CYCLE: true,
                    LABEL: "Secondary",
                },
            },
            {
                POSITION: [19, 12, 1, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.artillery, {recoil: 0}]),
                    TYPE: "bullet",
                    LABEL: "Heavy",
                },
            },
        ],
        TURRETS: [
            {
                POSITION: [11, 0, 0, 0, 360, 1],
                TYPE: ["overdriveDeco", {MIRROR_MASTER_ANGLE: true}],
            },
        ],
    }, {limitFov: true, fov: 10, extraStats: [], label: "Beedrive"})
    Class.atlasEternalPincerTurret = makeTurret({
        GUNS: [
            {
                POSITION: [10, 10, 0, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, {range: 0.0005, speed: 0.0005, maxSpeed: 0.0005, recoil: 0}]),
                    TYPE: "stupidBullet",
                    DRAW_FILL: false,
                    BORDERLESS: true,
                },
            },
            {
                POSITION: [24, 2, 1, 0, -2.5, 0, 0.25],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.power, g.twin, g.nailgun, {recoil: 0}, g.sniper, {pen: 1.25}]),
                    TYPE: "bullet",
                },
            },
            {
                POSITION: [24, 2, 1, 0, 2.5, 0, 0.75],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.power, g.twin, g.nailgun, {recoil: 0}, g.sniper, {pen: 1.25}]),
                    TYPE: "bullet",
                },
            },
            {
                POSITION: [26, 2, 1, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.power, g.twin, g.nailgun, {recoil: 0}, g.sniper, {pen: 1.25}]),
                    TYPE: "bullet",
                },
            },
            {
                POSITION: [5.5, 7, -1.8, 6.5, 0, 0, 0],
            },
        ],
    }, {limitFov: true, fov: 10, extraStats: [], label: "Pincer"})
    Class.atlasEternalBrioTurret = makeTurret({
        GUNS: [
            {
                POSITION: [10, 10, 0, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, {range: 0.0005, speed: 0.0005, maxSpeed: 0.0005, recoil: 0}]),
                    TYPE: "stupidBullet",
                    DRAW_FILL: false,
                    BORDERLESS: true,
                },
            },
            {
                POSITION: [19, 8, 1, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.minigun]),
                    TYPE: "bullet",
                    WAIT_TO_CYCLE: true,
                }
            },
            {
                POSITION: [17, 8, 1, 0, 0, 0, 0.5],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.minigun]),
                    TYPE: "bullet",
                    WAIT_TO_CYCLE: true,
                }
            },
            {
                POSITION: [7, 7.5, 0.6, 7, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.swarm]),
                    TYPE: "swarm",
                    STAT_CALCULATOR: "swarm",
                },
            },
        ],
    }, {limitFov: true, fov: 10, extraStats: [], label: "Brio"})
    let atlasEternal = new LayeredBoss("atlasEternal", "Atlas", "CMCEternal", 11, "lavender", "baseTrapTurret", 4.5, 5.5);
    atlasEternal.addLayer({turret: {
            POSITION: [6.5, 9, 0, null, 160, 0],
            TYPE: "atlasEternalBeedriveTurret"
        }
    });
    atlasEternal.addLayer({turret: {
            POSITION: [6.5, 9, 0, null, 160, 0],
            TYPE: ["atlasEternalPincerTurret", {GUN_STAT_SCALE: {speed: 1.1, maxSpeed: 1.1, resist: 1.3}}],
        }
    }, true, 4);
    atlasEternal.addLayer({turret: {
            POSITION: [8.5, 9, 0, null, 160, 0],
            TYPE: ["atlasEternalBrioTurret", {GUN_STAT_SCALE: {speed: 1.1, maxSpeed: 1.1, resist: 1.3}}],
        }
    }, true, 4);

    Class.rheaEternalOratorTurret = makeTurret({
        GUNS: [
            {
                POSITION: [67, 6.5, 1, 0, 0, 0, 0],
            },
            {
                POSITION: [5, 8.5, -1.5, 8, 0, 0, 0],
            },
        ],
        TURRETS: [
            {
                POSITION: [8, 60, 0, 0, 360, 0],
                TYPE: [ "rheaCelestialMegaphoneTurretHangar", { GUN_STAT_SCALE: g.flankGuard, INDEPENDENT: false, HAS_NO_RECOIL: true } ],
            },
            {
                POSITION: [8, 50, 0, 0, 360, 0],
                TYPE: [ "rheaCelestialMegaphoneTurretHangar", { GUN_STAT_SCALE: g.flankGuard, INDEPENDENT: false, HAS_NO_RECOIL: true } ],
            },
            {
                POSITION: [8, 40, 0, 0, 360, 0],
                TYPE: [ "rheaCelestialMegaphoneTurretHangar", { GUN_STAT_SCALE: g.flankGuard, INDEPENDENT: false, HAS_NO_RECOIL: true } ],
            },
            {
                POSITION: [8, 30, 0, 0, 360, 0],
                TYPE: [ "rheaCelestialMegaphoneTurretHangar", { GUN_STAT_SCALE: g.flankGuard, INDEPENDENT: false, HAS_NO_RECOIL: true } ],
            },
            {
                POSITION: [8, 20, 0, 0, 360, 0],
                TYPE: [ "rheaCelestialMegaphoneTurretHangar", { GUN_STAT_SCALE: g.flankGuard, INDEPENDENT: false, HAS_NO_RECOIL: true } ],
            },
        ],
    }, {limitFov: true, fov: 10, extraStats: [], label: "Orator"})
    Class.rheaEternalPryerTurret = makeTurret({
        GUNS: [
            {
                POSITION: [57, 6.5, 1, 0, 0, 0, 0],
            },
            {
                POSITION: [5, 8.5, -1.5, 8, 0, 0, 0],
            },
        ],
        TURRETS: [
            {
                POSITION: [6, 58, 0, 0, 360, 1],
                TYPE: [ "autoTankGun", { GUN_STAT_SCALE: g.flankGuard, INDEPENDENT: false, HAS_NO_RECOIL: true } ],
            },
            {
                POSITION: [6, 48, 0, 0, 360, 1],
                TYPE: [ "autoTankGun", { GUN_STAT_SCALE: g.flankGuard, INDEPENDENT: false, HAS_NO_RECOIL: true } ],
            },
            {
                POSITION: [6, 38, 0, 0, 360, 1],
                TYPE: [ "autoTankGun", { GUN_STAT_SCALE: g.flankGuard, INDEPENDENT: false, HAS_NO_RECOIL: true } ],
            },
            {
                POSITION: [6, 28, 0, 0, 360, 1],
                TYPE: [ "autoTankGun", { GUN_STAT_SCALE: g.flankGuard, INDEPENDENT: true, HAS_NO_RECOIL: true } ],
            },
            {
                POSITION: [6, 18, 0, 0, 360, 1],
                TYPE: [ "autoTankGun", { GUN_STAT_SCALE: g.flankGuard, INDEPENDENT: false, HAS_NO_RECOIL: true } ],
            },
        ],
    }, {limitFov: true, fov: 10, extraStats: [], label: "Pryer"})
    Class.rheaEternalSpeakerTurretHangar1 = {
        PARENT: "genericTank",
        LABEL: "Hangar",
        SHAPE: 'M 0 0',
        MIRROR_MASTER_ANGLE: true,
        GUNS: weaponArray({
            POSITION: [7, 12, 0.6, 7, 0, 90, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.swarm, {damage: 0.5, health: 0.5, speed: 1.5, maxSpeed: 1.5}]),
                TYPE: "swarm",
                STAT_CALCULATOR: "swarm",
            },
        }, 2)
    }
    Class.rheaEternalSpeakerTurretHangar2 = {
        PARENT: "genericTank",
        LABEL: "Hangar",
        SHAPE: 'M 0 0',
        MIRROR_MASTER_ANGLE: true,
        GUNS: weaponArray({
            POSITION: [7, 12, 0.6, 7, 0, 90, 1/3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.swarm, {damage: 0.5, health: 0.5, speed: 1.5, maxSpeed: 1.5}]),
                TYPE: "swarm",
                STAT_CALCULATOR: "swarm",
            },
        }, 2)
    }
    Class.rheaEternalSpeakerTurretHangar3 = {
        PARENT: "genericTank",
        LABEL: "Hangar",
        SHAPE: 'M 0 0',
        MIRROR_MASTER_ANGLE: true,
        GUNS: weaponArray({
            POSITION: [7, 12, 0.6, 7, 0, 90, 2/3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.swarm, {damage: 0.5, health: 0.5, speed: 1.5, maxSpeed: 1.5}]),
                TYPE: "swarm",
                STAT_CALCULATOR: "swarm",
            },
        }, 2)
    }
    Class.rheaEternalSpeakerTurret = makeTurret({
        GUNS: [
            {
                POSITION: [67, 6.5, 1, 0, 0, 0, 0],
            },
            {
                POSITION: [5, 8.5, -1.5, 8, 0, 0, 0],
            },
        ],
        TURRETS: [
            {
                POSITION: [8, 60, 0, 0, 360, 0],
                TYPE: [ "rheaEternalSpeakerTurretHangar1", { GUN_STAT_SCALE: g.flankGuard, INDEPENDENT: false, HAS_NO_RECOIL: true } ],
            },
            {
                POSITION: [8, 50, 0, 0, 360, 0],
                TYPE: [ "rheaEternalSpeakerTurretHangar2", { GUN_STAT_SCALE: g.flankGuard, INDEPENDENT: false, HAS_NO_RECOIL: true } ],
            },
            {
                POSITION: [8, 40, 0, 0, 360, 0],
                TYPE: [ "rheaEternalSpeakerTurretHangar3", { GUN_STAT_SCALE: g.flankGuard, INDEPENDENT: false, HAS_NO_RECOIL: true } ],
            },
        ],
    }, {limitFov: true, fov: 10, extraStats: [], label: "Speaker"})
    let rheaEternal = new LayeredBoss("rheaEternal", "Rhea", "CMCEternal", 11, "yellow", "baseTrapTurret", 4.5, 5.5);
    rheaEternal.addLayer({turret: {
            POSITION: [6.5, 9, 0, null, 160, 0],
            TYPE: "rheaEternalOratorTurret"
        }
    });
    rheaEternal.addLayer({turret: {
            POSITION: [6.5, 9, 0, null, 160, 0],
            TYPE: "rheaEternalPryerTurret",
        }
    }, true, 4);
    rheaEternal.addLayer({turret: {
            POSITION: [8.5, 9, 0, null, 160, 0],
            TYPE: "rheaEternalSpeakerTurret",
        }
    }, true, 4);

    Class.juliusEternalHomingPounderTurret = makeTurret({
        GUNS: [
            {
                POSITION: [10, 10, 0, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, {range: 0.0005, speed: 0.0005, maxSpeed: 0.0005, recoil: 0}]),
                    TYPE: "stupidBullet",
                    DRAW_FILL: false,
                    BORDERLESS: true,
                },
            },
            {
                POSITION: [20.5, 12, 1, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.pounder, {reload: 1.5, maxSpeed: 1.25, range: 1.5}]),
                    TYPE: "homingBullet",
                }
            },
            {
                POSITION: [4, 15, 0.8, 14.5, 0, 0, 0],
            },
        ],
    }, {limitFov: true, fov: 10, extraStats: [], label: "Homing-Pounder"})
    Class.juliusEternalLaunchdriveTurretMissileTurret = makeTurret({
        GUNS: [
            {
                POSITION: [22, 10, 1, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.flankGuard, {recoil: 0}]),
                    TYPE: "bullet",
                },
            },
        ],
    }, {canRepel: true, limitFov: true, fov: 3})
    Class.juliusEternalLaunchdriveTurretMissile = makeAuto('minimissile', "Auto-Missile", {type: 'juliusEternalLaunchdriveTurretMissileTurret'})
    Class.juliusEternalLaunchdriveTurret = makeTurret({
        TURRETS: [
            {
                POSITION: [9, 0, 0, 0, 360, 1],
                TYPE: ["overdriveDeco", {MIRROR_MASTER_ANGLE: true}],
            },
        ],
        GUNS: [
            {
                POSITION: [10, 10, 0, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, {range: 0.0005, speed: 0.0005, maxSpeed: 0.0005, recoil: 0}]),
                    TYPE: "stupidBullet",
                    DRAW_FILL: false,
                    BORDERLESS: true,
                },
            },
            {
                POSITION: [10, 9, 1, 9, 0, 0, 0],
            },
            {
                POSITION: [17, 13, 1, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.launcher]),
                    TYPE: "juliusEternalLaunchdriveTurretMissile",
                    STAT_CALCULATOR: "sustained",
                },
            },
        ],
    }, {limitFov: true, fov: 10, extraStats: [], label: "Launchdrive"})
    let juliusEternal = new LayeredBoss("juliusEternal", "Julius", "CMCEternal", 11, "darkGrey", "baseTrapTurret", 4.5, 5.5);
    Class["juliusEternal"].LABEL = "Rogue Eternal"
    juliusEternal.addLayer({turret: {
            POSITION: [6.5, 9, 0, null, 160, 0],
            TYPE: "juliusEternalHomingPounderTurret"
        }
    });
    juliusEternal.addLayer({turret: {
            POSITION: [6.5, 9, 0, null, 160, 0],
            TYPE: "juliusEternalLaunchdriveTurret",
        }
    }, true, 4);
    juliusEternal.addLayer({gun: {
            POSITION: [4, 5, 1.4, 7.5, 0, null, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.drone]),
                TYPE: ["drone", {INDEPENDENT: true}],
                AUTOFIRE: true,
                SYNCS_SKILLS: true,
            },
        }
    }, true, 4, 10);

    Class.genghisEternalProductionistTurret = makeTurret({
        GUNS: [
            {
                POSITION: [10, 10, 0, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, {range: 0.0005, speed: 0.0005, maxSpeed: 0.0005, recoil: 0}]),
                    TYPE: "stupidBullet",
                    DRAW_FILL: false,
                    BORDERLESS: true,
                },
            },
            {
                POSITION: [5, 6, 1, 10, 5, 0, 0],
            },
            {
                POSITION: [1, 8, 1, 15, 5, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.swarm, g.babyfactory, { size: 1.2, reload: 1.5 }]),
                    TYPE: "tinyMinion",
                    STAT_CALCULATOR: "drone",
                    SYNCS_SKILLS: true,
                },
            },
            {
                POSITION: [11, 10, 0.8, 0, 5, 0, 0],
            },
            {
                POSITION: [5, 6, 1, 10, -5, 0, 0.5],
            },
            {
                POSITION: [1, 8, 1, 15, -5, 0, 0.5],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.swarm, g.babyfactory, { size: 1.2, reload: 1.5 }]),
                    TYPE: "tinyMinion",
                    STAT_CALCULATOR: "drone",
                    SYNCS_SKILLS: true,
                },
            },
            {
                POSITION: [11, 10, 0.8, 0, -5, 0, 0.5],
            },
        ],
    }, {limitFov: true, fov: 10, extraStats: [], label: "Productionist"})
    Class.genghisEternalTripletTurret = makeTurret({
        GUNS: [
            {
                POSITION: [10, 10, 0, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, {range: 0.0005, speed: 0.0005, maxSpeed: 0.0005, recoil: 0}]),
                    TYPE: "stupidBullet",
                    DRAW_FILL: false,
                    BORDERLESS: true,
                },
            },
            {
                POSITION: [18, 10, 1, 0, 5, 0, 0.5],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.triplet]),
                    TYPE: "bullet"
                }
            },
            {
                POSITION: [18, 10, 1, 0, -5, 0, 0.5],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.triplet]),
                    TYPE: "bullet"
                }
            },
            {
                POSITION: [21, 10, 1, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.triplet]),
                    TYPE: "bullet"
                }
            }
        ],
    }, {limitFov: true, fov: 10, extraStats: [], label: "Triplet"})
    Class.genghisEternalMasonTurretMinion = {
        PARENT: 'tinyMinion',
        LABEL: 'Mega Swarm Minion',
        GUNS: [
            {
                POSITION: [17.5, 11.75, 1, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.minionGun, g.lowPower, g.pounder]),
                    WAIT_TO_CYCLE: true,
                    TYPE: "bullet",
                },
            },
        ],
    }
    Class.genghisEternalMasonTurret = makeTurret({
        GUNS: [
            {
                POSITION: [10, 10, 0, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, {range: 0.0005, speed: 0.0005, maxSpeed: 0.0005, recoil: 0}]),
                    TYPE: "stupidBullet",
                    DRAW_FILL: false,
                    BORDERLESS: true,
                },
            },
            {
                POSITION: [4, 8, 1, 10, 0, 0, 0],
            },
            {
                POSITION: [1, 10, 1, 15, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.swarm, g.babyfactory, { size: 1.2, reload: 1.5 }, g.pounder, {size: 1.5}]),
                    TYPE: "genghisEternalMasonTurretMinion",
                    STAT_CALCULATOR: "drone",
                    SYNCS_SKILLS: true,
                },
            },
            {
                POSITION: [11.5, 10, -2, 0, 0, 0, 0],
            },
        ],
    }, {limitFov: true, fov: 10, extraStats: [], label: "Mason"})
    let genghisEternal = new LayeredBoss("genghisEternal", "Genghis", "CMCEternal", 11, "darkGrey", "baseTrapTurret", 4.5, 5.5);
    Class["genghisEternal"].LABEL = "Rogue Eternal"
    genghisEternal.addLayer({turret: {
            POSITION: [6.5, 9, 0, null, 160, 0],
            TYPE: "genghisEternalProductionistTurret"
        }
    });
    genghisEternal.addLayer({turret: {
            POSITION: [6.5, 9, 0, null, 160, 0],
            TYPE: "genghisEternalTripletTurret",
        }
    }, true, 4);
    genghisEternal.addLayer({turret: {
            POSITION: [8.5, 9, 0, null, 160, 0],
            TYPE: ["genghisEternalMasonTurret"],
        }
    }, true, 4);

    Class.napoleonEternalAttendantTurret = makeTurret({
        GUNS: [
            {
                POSITION: [10, 10, 0, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, {range: 0.0005, speed: 0.0005, maxSpeed: 0.0005, recoil: 0}]),
                    TYPE: "stupidBullet",
                    DRAW_FILL: false,
                    BORDERLESS: true,
                },
            },
            {
                POSITION: [14, 6, 0.8, 0, -6, -7, 0.5],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.swarm, g.bee]),
                    TYPE: ["bee", { INDEPENDENT: true }],
                    SYNCS_SKILLS: true,
                    STAT_CALCULATOR: "drone",
                    WAIT_TO_CYCLE: true,
                },
            },
            {
                POSITION: [14, 6, 0.8, 0, 6, 7, 0.5],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.swarm, g.bee]),
                    TYPE: ["bee", { INDEPENDENT: true }],
                    SYNCS_SKILLS: true,
                    STAT_CALCULATOR: "drone",
                    WAIT_TO_CYCLE: true,
                },
            },
            {
                POSITION: [16, 6, 0.8, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.swarm, g.bee]),
                    TYPE: ["bee", { INDEPENDENT: true }],
                    SYNCS_SKILLS: true,
                    STAT_CALCULATOR: "drone",
                    WAIT_TO_CYCLE: true,
                },
            },
        ],
    }, {limitFov: true, fov: 10, extraStats: [], label: "Attendant"})
    Class.napoleonEternalDestroyerDriveTurretBulletTurret = makeTurret({
        GUNS: [
            {
                POSITION: [22, 10, 1, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.flankGuard, {recoil: 0}]),
                    TYPE: "bullet",
                },
            },
        ],
    }, {canRepel: true, limitFov: true, fov: 3})
    Class.napoleonEternalDestroyerDriveTurretBullet = makeAuto('bullet', "Auto-Bullet", {type: 'napoleonEternalDestroyerDriveTurretBulletTurret'})
    Class.napoleonEternalDestroyerDriveTurret = makeTurret({
        TURRETS: [
            {
                POSITION: [9, 0, 0, 0, 360, 1],
                TYPE: ["overdriveDeco", {MIRROR_MASTER_ANGLE: true}],
            },
        ],
        GUNS: [
            {
                POSITION: [10, 10, 0, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, {range: 0.0005, speed: 0.0005, maxSpeed: 0.0005, recoil: 0}]),
                    TYPE: "stupidBullet",
                    DRAW_FILL: false,
                    BORDERLESS: true,
                },
            },
            {
                POSITION: [21, 14, 1, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.destroyer]),
                    TYPE: "napoleonEternalDestroyerDriveTurretBullet",
                },
            },
        ],
    }, {limitFov: true, fov: 10, extraStats: [], label: "Destroyer-Drive"})
    Class.napoleonEternalProtoSwarmerTurret = makeTurret({
        GUNS: [
            {
                POSITION: [10, 10, 0, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, {range: 0.0005, speed: 0.0005, maxSpeed: 0.0005, recoil: 0}]),
                    TYPE: "stupidBullet",
                    DRAW_FILL: false,
                    BORDERLESS: true,
                },
            },
            {
                POSITION: [10, 14, -1.2, 5, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.destroyer, g.hive, {speed: 1.3, maxSpeed: 0.5, health: 1.3, range: 1.3}]),
                    TYPE: "protoHive",
                },
            },
            {
                POSITION: [11, 12, 1, 5, 0, 0, 0],
            },
        ],
    }, {limitFov: true, fov: 10, extraStats: [], label: "Proto-Swarmer"})
    let napoleonEternal = new LayeredBoss("napoleonEternal", "Napoleon", "CMCEternal", 11, "darkGrey", "baseTrapTurret", 4.5, 5.5);
    Class["napoleonEternal"].LABEL = "Rogue Eternal"
    napoleonEternal.addLayer({turret: {
            POSITION: [6.5, 9, 0, null, 160, 0],
            TYPE: "napoleonEternalAttendantTurret"
        }
    });
    napoleonEternal.addLayer({turret: {
            POSITION: [6.5, 9, 0, null, 160, 0],
            TYPE: "napoleonEternalDestroyerDriveTurret",
        }
    }, true, 4);
    napoleonEternal.addLayer({turret: {
            POSITION: [8.5, 9, 0, null, 160, 0],
            TYPE: ["napoleonEternalProtoSwarmerTurret"],
        }
    }, true, 4);

    Class.moarCelestials.UPGRADES_TIER_0.push("moarCelestialsEternals");
    Class.moarCelestialsEternals.UPGRADES_TIER_0 = ["moarCelestials", "paladinEternal", "freyjaEternal", "zaphkielEternal", "nyxEternal", "theiaEternal", "kronosEternal", "ragnarokEternal", "atlasEternal", "rheaEternal", "juliusEternal", "genghisEternal", "napoleonEternal"]
}

if (createPrimordials === true) {
    Class.moarCelestialsPrimordials = makeMenu("Primordials", "rainbow", 13)
    Class.moarCelestialsPrimordials.UPGRADES_TIER_0 = []

    Class.CMCPrimordial = {
        PARENT: "miniboss",
        LABEL: "Primordial",
        SKILL: [10, 10, 10, 10, 10, 10, 10, 10, 10, 10],
        SKILL_CAP: [10, 10, 10, 10, 10, 10, 10, 10, 10, 10],
        VALUE: 1.6e7,
        SHAPE: 13,
        SIZE: 180,
        CONTROLLERS: [["minion", {turnwiserange: 360}]],
        DANGER: 13,
        BODY: {
            FOV: 1,
            HEALTH: 9000,
            SHIELD: 2,
            REGEN: base.REGEN * 0.1,
            SPEED: 0.1875,
            DAMAGE: 24,
        },
    };
    Class.paladinPrimordialGigaSwarmerTurretHive = {
        PARENT: "bullet",
        LABEL: "Giga-Hive",
        BODY: {
            RANGE: 90,
            FOV: 0.5,
        },
        FACING_TYPE: "turnWithSpeed",
        INDEPENDENT: true,
        CONTROLLERS: ["nearestDifferentMaster", "targetSelf"],
        AI: { NO_LEAD: true },
        GUNS: weaponArray({
            POSITION: [6, 6.675, 0.6, 7, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.swarm, g.hive, g.bee]),
                TYPE: ["bee", { PERSISTS_AFTER_DEATH: true }],
                STAT_CALCULATOR: "swarm",
                AUTOFIRE: true
            },
        }, 9, 1/9)
    }
    Class.paladinPrimordialGigaSwarmerTurret = makeTurret({
        GUNS: [
            {
                POSITION: [10, 10, 0, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, {range: 0.0005, speed: 0.0005, maxSpeed: 0.0005, recoil: 0}]),
                    TYPE: "stupidBullet",
                    DRAW_FILL: false,
                    BORDERLESS: true,
                },
            },
            {
                POSITION: [25, 14, -1.2, 5, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.destroyer, g.hive]),
                    TYPE: "paladinPrimordialGigaSwarmerTurretHive",
                },
            },
            {
                POSITION: [25, 12, 1, 5, 0, 0, 0],
            },
        ],
    }, {limitFov: true, fov: 10, extraStats: [], label: "Giga Swarmer"})
    Class.paladinPrimordialApairistTurret = makeTurret({
        GUNS: [
            {
                POSITION: [11, 3, 1, 0, -8, -7, 0.6],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.swarm, g.bee]),
                    TYPE: ["bee", { INDEPENDENT: true }],
                    SYNCS_SKILLS: true,
                    STAT_CALCULATOR: "drone",
                    WAIT_TO_CYCLE: true,
                    LABEL: "Secondary",
                },
            },
            {
                POSITION: [11, 3, 1, 0, 8, 7, 0.8],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.swarm, g.bee]),
                    TYPE: ["bee", { INDEPENDENT: true }],
                    SYNCS_SKILLS: true,
                    STAT_CALCULATOR: "drone",
                    WAIT_TO_CYCLE: true,
                    LABEL: "Secondary",
                },
            },
            {
                POSITION: [14, 3, 1, 0, -6, -7, 0.2],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.swarm, g.bee]),
                    TYPE: ["bee", { INDEPENDENT: true }],
                    SYNCS_SKILLS: true,
                    STAT_CALCULATOR: "drone",
                    WAIT_TO_CYCLE: true,
                    LABEL: "Secondary",
                },
            },
            {
                POSITION: [14, 3, 1, 0, 6, 7, 0.4],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.swarm, g.bee]),
                    TYPE: ["bee", { INDEPENDENT: true }],
                    SYNCS_SKILLS: true,
                    STAT_CALCULATOR: "drone",
                    WAIT_TO_CYCLE: true,
                    LABEL: "Secondary",
                },
            },
            {
                POSITION: [19, 12, 1, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.artillery]),
                    TYPE: "bullet",
                    LABEL: "Heavy",
                },
            },
        ],
    }, {limitFov: true, fov: 10, extraStats: [], label: "Giga Swarmer"})
    Class.paladinPrimordialBoomerTurret = makeTurret('boomer', {canRepel: true, limitFov: true, extraStats: []})
    let paladinPrimordial = new LayeredBoss("paladinPrimordial", "Paladin", "CMCPrimordial", 13, "purple", "baseTrapTurret", 4.5, 5.5);
    paladinPrimordial.addLayer({gun: {
            POSITION: [3.8, 3.5, 1.4, 8, 0, null, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.drone, g.summoner, g.destroyer, {health: 1.4, damage: 1.4, resist: 1.2, density: 1.8, maxSpeed: 1.325}, {reload: 1.1, damage: 1.1, health: 1.1, pen: 1.1, speed: 1.1, maxSpeed: 1.1}, {reload: 1.1, damage: 1.1, health: 1.1, pen: 1.1, speed: 1.1, maxSpeed: 1.1}]),
                TYPE: ["demonchip", {INDEPENDENT: true}],
                AUTOFIRE: true,
                SYNCS_SKILLS: true,
                STAT_CALCULATOR: "drone",
                WAIT_TO_CYCLE: true,
            },
        }
    }, true, null, 25);
    paladinPrimordial.addLayer({turret: {
            POSITION: [6.5, 9, 0, null, 160, 0],
            TYPE: ["paladinPrimordialGigaSwarmerTurret", {GUN_STAT_SCALE: {speed: 3, maxSpeed: 0.3, health: 1.3, range: 2, damage: 1.1}}],
        }
    }, true, 3.35);
    paladinPrimordial.addLayer({turret: {
            POSITION: [7, 9, 0, null, 160, 0],
            TYPE: ["paladinPrimordialApairistTurret", {GUN_STAT_SCALE: {speed: 1.2, maxSpeed: 1.2, health: 1.15, range: 0.8, damage: 1.1}}],
        }
    }, true, 3.35);
    paladinPrimordial.addLayer({turret: {
            POSITION: [8.5, 9, 0, null, 160, 0],
            TYPE: ["paladinPrimordialBoomerTurret", {GUN_STAT_SCALE: {speed: 2, maxSpeed: 2, pen: 1.5, damage: 2, health: 0.55}}],
        }
    }, true, 3.35);

    Class.freyjaPrimordialConveyorTurret = makeTurret({
        GUNS: [
            {
                POSITION: [10, 10, 0, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, {range: 0.0005, speed: 0.0005, maxSpeed: 0.0005, recoil: 0}]),
                    TYPE: "stupidBullet",
                    DRAW_FILL: false,
                    BORDERLESS: true,
                },
            },
            {
                POSITION: [7, 8, 0.6, 7, 3, 40, 0.5],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.swarm, g.battleship, g.carrier]),
                    TYPE: "swarm",
                    STAT_CALCULATOR: "swarm",
                    LABEL: "Guided"
                },
            },
            {
                POSITION: [7, 8, 0.6, 7, -3, -40, 0.5],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.swarm, g.battleship, g.carrier]),
                    TYPE: "swarm",
                    STAT_CALCULATOR: "swarm",
                    LABEL: "Guided"
                },
            },
            {
                POSITION: [7, 8, 0.6, 7, 1.5, 20, 0.25],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.swarm, g.carrier]),
                    TYPE: "autoswarm",
                    STAT_CALCULATOR: "swarm",
                    LABEL: "Autonomous"
                },
            },
            {
                POSITION: [7, 8, 0.6, 7, -1.5, -20, 0.25],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.swarm, g.carrier]),
                    TYPE: "autoswarm",
                    STAT_CALCULATOR: "swarm",
                    LABEL: "Autonomous"
                },
            },
            {
                POSITION: [7, 8, 0.6, 7, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.swarm, g.battleship, g.carrier]),
                    TYPE: "swarm",
                    STAT_CALCULATOR: "swarm",
                    LABEL: "Guided"
                },
            },
        ],
    }, {limitFov: true, fov: 10, extraStats: [], label: "Conveyor"})
    Class.freyjaPrimordialPentupletTurret = makeTurret({
        GUNS: [
            {
                POSITION: [10, 10, 0, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, {range: 0.0005, speed: 0.0005, maxSpeed: 0.0005, recoil: 0}]),
                    TYPE: "stupidBullet",
                    DRAW_FILL: false,
                    BORDERLESS: true,
                },
            },
            {
                POSITION: [12, 5, 1, 0, -6, 0, 0.8],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.twin, g.twin, g.power, { reload: 2 }]),
                    TYPE: "bullet",
                },
            },
            {
                POSITION: [12, 5, 1, 0, 6, 0, 0.6],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.twin, g.twin, g.power, { reload: 2 }]),
                    TYPE: "bullet",
                },
            },
            {
                POSITION: [14, 5, 1, 0, -3, 0, 0.4],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.twin, g.twin, g.power, { reload: 2 }]),
                    TYPE: "bullet",
                },
            },
            {
                POSITION: [14, 5, 1, 0, 3, 0, 0.2],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.twin, g.twin, g.power, { reload: 2 }]),
                    TYPE: "bullet",
                },
            },
            {
                POSITION: [16, 5, 1, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.twin, g.twin, g.power, { reload: 2 }]),
                    TYPE: "bullet",
                },
            },
        ],
    }, {limitFov: true, fov: 10, extraStats: [], label: "Pentuplet"})
    Class.freyjaEternalAerostomperTurretedSwarm = {
        PARENT: 'swarm',
        LABEL: 'Mega Auto-Swarm',
        TURRETS: [
            {
                POSITION: [12, 0, 0, 0, 360, 1],
                TYPE: ['megaAutoTankGun', {GUN_STAT_SCALE: {health: 0.8}, HAS_NO_RECOIL: true}]
            }
        ],
    }
    Class.freyjaPrimordialAerostomperTurret = makeTurret({
        TURRETS: [
            {
                POSITION: [11, 0, 0, 0, 360, 1],
                TYPE: ["overdriveDeco", {MIRROR_MASTER_ANGLE: true}],
            },
        ],
        GUNS: [
            {
                POSITION: [10, 10, 0, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, {range: 0.0005, speed: 0.0005, maxSpeed: 0.0005, recoil: 0}]),
                    TYPE: "stupidBullet",
                    DRAW_FILL: false,
                    BORDERLESS: true,
                },
            },
            {
                POSITION: [14, 15, 0.6, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.swarm, {reload: 0.8, damage: 0.9, health: 1.2, speed: 0.9, maxSpeed: 0.8, range: 1.1, density: 1.215}, g.pounder]),
                    TYPE: "freyjaEternalAerostomperTurretedSwarm",
                    STAT_CALCULATOR: "swarm",
                },
            },
        ],
    }, {limitFov: true, fov: 10, extraStats: [], label: "Aerostomper"})
    Class.freyjaPrimordialNailgunTurret = makeTurret({
        GUNS: [
            {
                POSITION: [10, 10, 0, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, {range: 0.0005, speed: 0.0005, maxSpeed: 0.0005, recoil: 0}]),
                    TYPE: "stupidBullet",
                    DRAW_FILL: false,
                    BORDERLESS: true,
                },
            },
            {
                POSITION: [19, 2, 1, 0, -2.5, 0, 0.25],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.power, g.twin, g.nailgun]),
                    TYPE: "bullet",
                },
            },
            {
                POSITION: [19, 2, 1, 0, 2.5, 0, 0.75],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.power, g.twin, g.nailgun]),
                    TYPE: "bullet",
                },
            },
            {
                POSITION: [20, 2, 1, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.power, g.twin, g.nailgun]),
                    TYPE: "bullet",
                },
            },
            {
                POSITION: [5.5, 7, -1.8, 6.5, 0, 0, 0],
            },
        ],
    }, {limitFov: true, fov: 10, extraStats: [], label: "Nailgun"})
    let freyjaPrimordial = new LayeredBoss("freyjaPrimordial", "Freyja", "CMCPrimordial", 13, "lightGreen", "baseTrapTurret", 4.5, 5.5);
    freyjaPrimordial.addLayer({turret: {
            POSITION: [5.375, 9, 0, null, 160, 0],
            TYPE: ["freyjaPrimordialConveyorTurret", {GUN_STAT_SCALE: {health: 1.2, damage: 1.2, speed: 1.15, maxSpeed: 0.9, resist: 1.2}}],
        }
    }, true, null, 25);
    freyjaPrimordial.addLayer({turret: {
            POSITION: [6.5, 9, 0, null, 160, 0],
            TYPE: ["freyjaPrimordialPentupletTurret", {GUN_STAT_SCALE: {health: 1.2, damage: 1.2, speed: 1.15, maxSpeed: 0.9, resist: 1.2}}],
        }
    }, true, 3.35);
    freyjaPrimordial.addLayer({turret: {
            POSITION: [7, 9, 0, null, 160, 0],
            TYPE: ["freyjaEternalAerodriveTurret", {GUN_STAT_SCALE: {health: 1.2, damage: 1.2, speed: 2, maxSpeed: 1.5, resist: 1.2}}],
        }
    }, true, 3.35);
    freyjaPrimordial.addLayer({turret: {
            POSITION: [8.5, 9, 0, null, 160, 0],
            TYPE: ["freyjaPrimordialNailgunTurret", {GUN_STAT_SCALE: {health: 1.2, damage: 1.2, speed: 1.15, maxSpeed: 0.9, resist: 1.2}}],
        }
    }, true, 3.35);

    Class.zaphkielPrimordialGigaSkimmerTurretMissile = {
        PARENT: "missile",
        GUNS: [
            {
                POSITION: [14, 6, 1, 0, -2, 150, 0],
                PROPERTIES: {
                    AUTOFIRE: true,
                    SHOOT_SETTINGS: combineStats([g.basic, {reload: 3}]),
                    TYPE: [ "bullet", { PERSISTS_AFTER_DEATH: true } ],
                    STAT_CALCULATOR: "thruster",
                },
            },
            {
                POSITION: [14, 6, 1, 0, 2, 210, 0],
                PROPERTIES: {
                    AUTOFIRE: true,
                    SHOOT_SETTINGS: combineStats([g.basic, {reload: 3}]),
                    TYPE: [ "bullet", { PERSISTS_AFTER_DEATH: true } ],
                    STAT_CALCULATOR: "thruster",
                },
            },
            {
                POSITION: [14, 6, 1, 0, -2, 120, 1/3],
                PROPERTIES: {
                    AUTOFIRE: true,
                    SHOOT_SETTINGS: combineStats([g.basic, {reload: 3}]),
                    TYPE: [ "bullet", { PERSISTS_AFTER_DEATH: true } ],
                },
            },
            {
                POSITION: [14, 6, 1, 0, 2, 240, 1/3],
                PROPERTIES: {
                    AUTOFIRE: true,
                    SHOOT_SETTINGS: combineStats([g.basic, {reload: 3}]),
                    TYPE: [ "bullet", { PERSISTS_AFTER_DEATH: true } ],
                },
            },
            {
                POSITION: [14, 6, 1, 0, -2, 90, 2/3],
                PROPERTIES: {
                    AUTOFIRE: true,
                    SHOOT_SETTINGS: combineStats([g.basic, {reload: 3}]),
                    TYPE: [ "bullet", { PERSISTS_AFTER_DEATH: true } ],
                },
            },
            {
                POSITION: [14, 6, 1, 0, 2, 270, 2/3],
                PROPERTIES: {
                    AUTOFIRE: true,
                    SHOOT_SETTINGS: combineStats([g.basic, {reload: 3}]),
                    TYPE: [ "bullet", { PERSISTS_AFTER_DEATH: true } ],
                },
            },
        ],
    }
    Class.zaphkielPrimordialGigaSkimmerTurret = makeTurret({
        GUNS: [
            {
                POSITION: [10, 10, 0, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, {range: 0.0005, speed: 0.0005, maxSpeed: 0.0005, recoil: 0}]),
                    TYPE: "stupidBullet",
                    DRAW_FILL: false,
                    BORDERLESS: true,
                },
            },
            {
                POSITION: [10, 12, -0.5, 13, 0, 0, 0],
            },
            {
                POSITION: [10, 13, -0.5, 11, 0, 0, 0],
            },
            {
                POSITION: [10, 14, -0.5, 9, 0, 0, 0],
            },
            {
                POSITION: [17, 15, 1, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.artillery, g.artillery, g.skimmer]),
                    TYPE: "zaphkielPrimordialGigaSkimmerTurretMissile",
                    STAT_CALCULATOR: "sustained",
                },
            },
        ],
    }, {limitFov: true, fov: 10, extraStats: [], label: "Giga Skimmer"})
    Class.zaphkielPrimordialBigMacTurret = makeTurret({
        GUNS: [
            {
                POSITION: [10, 10, 0, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, {range: 0.0005, speed: 0.0005, maxSpeed: 0.0005, recoil: 0}]),
                    TYPE: "stupidBullet",
                    DRAW_FILL: false,
                    BORDERLESS: true,
                },
            },
            {
                POSITION: [20.5, 27.5, 1, 3, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.destroyer, g.annihilator, g.pounder]),
                    TYPE: "bullet",
                },
            },
            {
                POSITION: [12.5, 27.5, 0.25, -3, 0, 180, 0],
            },
        ],
    }, {limitFov: true, fov: 10, extraStats: [], label: "Big Mac"})
    Class.zaphkielPrimordialHybridTurret = makeTurret({
        GUNS: [
            {
                POSITION: [10, 10, 0, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, {range: 0.0005, speed: 0.0005, maxSpeed: 0.0005, recoil: 0}]),
                    TYPE: "stupidBullet",
                    DRAW_FILL: false,
                    BORDERLESS: true,
                },
            },
            {
                POSITION: [21, 14, 1, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.destroyer]),
                    TYPE: "bullet",
                },
            },
            {
                POSITION: [6, 14, 1.2, 8, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.drone, g.overseer, {reload: 1.2, damage: 1.2, pen: 1.2, speed: 0.8, maxSpeed: 0.8}]),
                    TYPE: "drone",
                    AUTOFIRE: true,
                    SYNCS_SKILLS: true,
                    STAT_CALCULATOR: "drone",
                    WAIT_TO_CYCLE: true
                }
            }
        ],
    }, {limitFov: true, fov: 10, extraStats: [], label: "Hybrid"})
    let zaphkielPrimordial = new LayeredBoss("zaphkielPrimordial", "Zaphkiel", "CMCPrimordial", 13, "orange", "baseTrapTurret", 4.5, 5.5);
    zaphkielPrimordial.addLayer({gun: {
            POSITION: [3.8, 3.5, 1.4, 8, 0, null, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.drone, g.summoner, g.destroyer, {health: 1.4, damage: 1.4, resist: 1.2, density: 1.8, maxSpeed: 1.325}]),
                TYPE: ["dorito", {INDEPENDENT: true}],
                AUTOFIRE: true,
                SYNCS_SKILLS: true,
            },
        }
    }, true, null, 25);
    zaphkielPrimordial.addLayer({turret: {
            POSITION: [6.5, 9, 0, null, 160, 0],
            TYPE: ["zaphkielPrimordialGigaSkimmerTurret", {GUN_STAT_SCALE: {health: 1.4, range: 1.6}}],
        }
    }, true, 3.35);
    zaphkielPrimordial.addLayer({turret: {
            POSITION: [7, 9, 0, null, 160, 0],
            TYPE: ["zaphkielPrimordialBigMacTurret", {GUN_STAT_SCALE: {health: 1.2, damage: 1.2, speed: 3, maxSpeed: 1, resist: 1.2}}],
        }
    }, true, 3.35);
    zaphkielPrimordial.addLayer({turret: {
            POSITION: [8.5, 9, 0, null, 160, 0],
            TYPE: ["zaphkielPrimordialHybridTurret", {GUN_STAT_SCALE: {speed: 2, maxSpeed: 2, pen: 1.5, damage: 2, health: 0.55}}],
        }
    }, true, 3.35);

    Class.nyxPrimordialBehemothTurretMissile = {
        PARENT: "missile",
        GUNS: [
            {
                POSITION: [19, 9, 1.5, 0, 0, 180, 1.5],
                PROPERTIES: {
                    AUTOFIRE: true,
                    SHOOT_SETTINGS: combineStats([g.basic, g.missileTrail, g.rocketeerMissileTrail, g.pounder]),
                    TYPE: ["bullet", { PERSISTS_AFTER_DEATH: true }],
                    STAT_CALCULATOR: "thruster",
                },
            },
            {
                POSITION: [16, 12, 1.5, 0, 0, 180, 1],
                PROPERTIES: {
                    AUTOFIRE: true,
                    SHOOT_SETTINGS: combineStats([g.basic, g.missileTrail, g.rocketeerMissileTrail, g.pounder]),
                    TYPE: ["bullet", { PERSISTS_AFTER_DEATH: true }],
                    STAT_CALCULATOR: "thruster",
                },
            },
        ],
    }
    Class.nyxPrimordialBehemothTurret = makeTurret({
        GUNS: [
            {
                POSITION: [10, 10, 0, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, {range: 0.0005, speed: 0.0005, maxSpeed: 0.0005, recoil: 0}]),
                    TYPE: "stupidBullet",
                    DRAW_FILL: false,
                    BORDERLESS: true,
                },
            },
            {
                POSITION: [15, 14.25, -0.7, 10, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.destroyer, g.launcher, g.rocketeer]),
                    TYPE: "nyxPrimordialBehemothTurretMissile",
                    STAT_CALCULATOR: "sustained",
                },
            },
            {
                POSITION: [22, 20, 0.75, 0, 0, 0, 0],
            },
        ],
    }, {limitFov: true, fov: 10, extraStats: [], label: "Behemoth"})
    Class.nyxPrimordialProdutionistTurret = makeTurret({
        GUNS: [
            {
                POSITION: [10, 10, 0, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, {range: 0.0005, speed: 0.0005, maxSpeed: 0.0005, recoil: 0}]),
                    TYPE: "stupidBullet",
                    DRAW_FILL: false,
                    BORDERLESS: true,
                },
            },
            {
                POSITION: [4, 6, 1, 10, 5, 0, 0],
            },
            {
                POSITION: [1, 8, 1, 14, 5, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.swarm, g.babyfactory, { size: 1.2, reload: 1.675 }]),
                    TYPE: "tinyMinion",
                    STAT_CALCULATOR: "drone",
                    SYNCS_SKILLS: true,
                },
            },
            {
                POSITION: [11, 10, 0.8, 0, 5, 0, 0],
            },
            {
                POSITION: [4, 6, 1, 10, -5, 0, 0.5],
            },
            {
                POSITION: [1, 8, 1, 14, -5, 0, 0.5],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.swarm, g.babyfactory, { size: 1.2, reload: 1.675 }]),
                    TYPE: "tinyMinion",
                    STAT_CALCULATOR: "drone",
                    SYNCS_SKILLS: true,
                },
            },
            {
                POSITION: [11, 10, 0.8, 0, -5, 0, 0.5],
            },
        ],
    }, {limitFov: true, fov: 10, extraStats: [], label: "Produtionist"})
    Class.nyxPrimordialForkTurret = makeTurret({
        GUNS: [
            {
                POSITION: [10, 10, 0, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, {range: 0.0005, speed: 0.0005, maxSpeed: 0.0005, recoil: 0}]),
                    TYPE: "stupidBullet",
                    DRAW_FILL: false,
                    BORDERLESS: true,
                },
            },
            {
                POSITION: [5, 8.5, 1.3, 8, 0, 0, 0],
            },
            {
                POSITION: [5, 8.5, 1.3, 13, 0, 0, 0],
            },
            {
                POSITION: [5, 8.5, 1.3, 18, 0, 0, 0],
            },
            {
                POSITION: [5, 8.5, 1.3, 23, 0, 0, 0],
            },
            {
                POSITION: [29, 8.5, 1, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.sniper, { pen: 2, reload: 3.5 }]),
                    TYPE: "forkSplitterBullet"
                },
            },
        ],
    }, {limitFov: true, fov: 10, extraStats: [], label: "Fork"})
    Class.nyxPrimordialGigaMinion = {
        PARENT: 'minion',
        LABEL: 'Giga Minion',
        GUNS: [
            {
                POSITION: [18, 14, 1, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.destroyer, g.minionGun]),
                    WAIT_TO_CYCLE: true,
                    TYPE: "bullet",
                },
            },
        ],
    }
    let nyxPrimordial = new LayeredBoss("nyxPrimordial", "Nyx", "CMCPrimordial", 13, "pink", "baseTrapTurret", 4.5, 5.5);
    nyxPrimordial.addLayer({gun: {
            POSITION: [3.8, 4.5, -1.4, 8, 0, null, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.spawner, { size: 0.7, maxSpeed: 0.85, damage: 0.8 }, {reload: 1.2}]),
                TYPE: ["nyxPrimordialGigaMinion", {INDEPENDENT: true,}],
                AUTOFIRE: true,
                SYNCS_SKILLS: true,
            },
        }
    }, true, null, 25);
    nyxPrimordial.addLayer({turret: {
            POSITION: [6.5, 9, 0, null, 160, 0],
            TYPE: ["nyxPrimordialBehemothTurret", {GUN_STAT_SCALE: {maxSpeed: 0.5}}],
        }
    }, true, 3.35);
    nyxPrimordial.addLayer({turret: {
            POSITION: [7, 9, 0, null, 160, 0],
            TYPE: ["nyxPrimordialProdutionistTurret", {GUN_STAT_SCALE: {health: 1.2, damage: 1.3, speed: 1.1, maxSpeed: 1.1, resist: 1.05}}],
        }
    }, true, 3.35);
    nyxPrimordial.addLayer({turret: {
            POSITION: [8.5, 9, 0, null, 160, 0],
            TYPE: ["nyxPrimordialForkTurret", {GUN_STAT_SCALE: {damage: 0.5}}],
        }
    }, true, 3.35);

    Class.theiaPrimordialGigaTwisterTurretMissile = {
        PARENT: "spinmissile",
        GUNS: weaponArray({
            POSITION: [14, 6, 1, 0, 0, 0, 0],
            PROPERTIES: {
                AUTOFIRE: !0,
                SHOOT_SETTINGS: combineStats([g.basic, g.lowPower, {size: 1.1}]),
                TYPE: ["bullet", { PERSISTS_AFTER_DEATH: true }],
                STAT_CALCULATOR: "thruster",
            },
        }, 6),
    }
    Class.theiaPrimordialGigaTwisterTurret = makeTurret({
        GUNS: [
            {
                POSITION: [10, 10, 0, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, {range: 0.0005, speed: 0.0005, maxSpeed: 0.0005, recoil: 0}]),
                    TYPE: "stupidBullet",
                    DRAW_FILL: false,
                    BORDERLESS: true,
                },
            },
            {
                POSITION: [10, 11, -0.5, 13, 0, 0, 0],
            },
            {
                POSITION: [10, 12, -0.5, 11, 0, 0, 0],
            },
            {
                POSITION: [10, 13, -0.5, 9, 0, 0, 0],
            },
            {
                POSITION: [17, 14, -1.4, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.artillery, g.artillery, g.skimmer, { reload: 4/3 }, { reload: 4/3 }, { reload: 4/3 }]),
                    TYPE: "theiaPrimordialGigaTwisterTurretMissile",
                    STAT_CALCULATOR: "sustained",
                },
            },
        ],
    }, {limitFov: true, fov: 10, extraStats: [], label: "Giga Twister"})
    Class.theiaPrimordialFocalTurret = makeTurret({
        GUNS: [
            {
                POSITION: [10, 10, 0, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, {range: 0.0005, speed: 0.0005, maxSpeed: 0.0005, recoil: 0}]),
                    TYPE: "stupidBullet",
                    DRAW_FILL: false,
                    BORDERLESS: true,
                },
            },
            {
                POSITION: [25, 7, 1, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.lowPower, g.machineGun, { recoil: 1.15 }]),
                    TYPE: "bullet",
                },
            },
            {
                POSITION: [14, 10, 1.3, 8, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.focal]),
                    TYPE: "bullet",
                },
            },
        ],
    }, {limitFov: true, fov: 10, extraStats: [], label: "Focal"})
    Class.theiaPrimordialHarvesterTurret = makeTurret({
        GUNS: [
            {
                POSITION: [10, 10, 0, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, {range: 0.0005, speed: 0.0005, maxSpeed: 0.0005, recoil: 0}]),
                    TYPE: "stupidBullet",
                    DRAW_FILL: false,
                    BORDERLESS: true,
                },
            },
            {
                POSITION: [16, 4, 1, 0, -3, -6, 0.25],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.swarm, g.bee]),
                    TYPE: ["bee", { INDEPENDENT: true }],
                    SYNCS_SKILLS: true,
                    STAT_CALCULATOR: "drone",
                    WAIT_TO_CYCLE: true,
                },
            },
            {
                POSITION: [16, 4, 1, 0, 3, 6, 0.75],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.swarm, g.bee]),
                    TYPE: ["bee", { INDEPENDENT: true }],
                    SYNCS_SKILLS: true,
                    STAT_CALCULATOR: "drone",
                    WAIT_TO_CYCLE: true,
                },
            },
            {
                POSITION: [17, 4, 1, 0, 0, 0, 0.5],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.swarm, g.bee]),
                    TYPE: ["bee", { INDEPENDENT: true }],
                    SYNCS_SKILLS: true,
                    STAT_CALCULATOR: "drone",
                    WAIT_TO_CYCLE: true,
                },
            },
        ],
    }, {limitFov: true, fov: 10, extraStats: [], label: "Harvester"})
    let theiaPrimordial = new LayeredBoss("theiaPrimordial", "Theia", "CMCPrimordial", 13, "gold", "baseTrapTurret", 4.5, 5.5);
    theiaPrimordial.addLayer({gun: {
            POSITION: [3.8, 5, 1.4, 8, 0, null, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.drone, g.summoner, g.destroyer, {health: 1.4, damage: 1.4, resist: 1.2, density: 1.8, maxSpeed: 1.325}]),
                TYPE: ["summonerDrone", {INDEPENDENT: true}],
                AUTOFIRE: true,
                WAIT_TO_CYCLE: true,
                SYNCS_SKILLS: true,
            },
        }
    }, true, null, 55);
    theiaPrimordial.addLayer({turret: {
            POSITION: [6.5, 9, 0, null, 160, 0],
            TYPE: ["theiaPrimordialGigaTwisterTurret", {GUN_STAT_SCALE: {maxSpeed: 0.5}}],
        }
    }, true, 3.35);
    theiaPrimordial.addLayer({turret: {
            POSITION: [7, 9, 0, null, 160, 0],
            TYPE: ["theiaPrimordialFocalTurret", {GUN_STAT_SCALE: {maxSpeed: 0.5}}],
        }
    }, true, 3.35);
    theiaPrimordial.addLayer({turret: {
            POSITION: [8.5, 9, 0, null, 160, 0],
            TYPE: ["theiaPrimordialHarvesterTurret", {GUN_STAT_SCALE: {maxSpeed: 0.5}}],
        }
    }, true, 3.35);

    Class.kronosPrimordialGigaPaverTurretMissile = {
        PARENT: "missile",
        GUNS: [
            {
                POSITION: [13, 6, 1, 0, 0, 90, 0],
            },
            {
                POSITION: [13, 6, 1, 0, 0, -90, 0],
            },
            {
                POSITION: [4, 6, 1.7, 13, 0, 90, 0.5],
                PROPERTIES: {
                    AUTOFIRE: true,
                    SHOOT_SETTINGS: combineStats([g.trap, { recoil: 0.5 }, g.lowPower]),
                    TYPE: ["trap", { PERSISTS_AFTER_DEATH: true }],
                    STAT_CALCULATOR: "thruster",
                },
            },
            {
                POSITION: [4, 6, 1.7, 13, 0, -90, 0.5],
                PROPERTIES: {
                    AUTOFIRE: true,
                    SHOOT_SETTINGS: combineStats([g.trap, { recoil: 0.5 }, g.lowPower]),
                    TYPE: ["trap", { PERSISTS_AFTER_DEATH: true }],
                    STAT_CALCULATOR: "thruster",
                },
            },
            {
                POSITION: [13, 6, 1, 0, 0, 180, 0],
            },
            {
                POSITION: [4, 6, 1.7, 13, 0, 180, 0.5],
                PROPERTIES: {
                    AUTOFIRE: true,
                    SHOOT_SETTINGS: combineStats([g.trap, { recoil: 0.5 }, g.lowPower]),
                    TYPE: ["trap", { PERSISTS_AFTER_DEATH: true }],
                    STAT_CALCULATOR: "thruster",
                },
            },
        ],
    }
    Class.kronosPrimordialGigaPaverTurret = makeTurret({
        GUNS: [
            {
                POSITION: [10, 10, 0, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, {range: 0.0005, speed: 0.0005, maxSpeed: 0.0005, recoil: 0}]),
                    TYPE: "stupidBullet",
                    DRAW_FILL: false,
                    BORDERLESS: true,
                },
            },
            {
                POSITION: [10, 9, 1.1, 9, 0, 0, 0],
            },
            {
                POSITION: [23, 9, 1.25, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.artillery, g.artillery, g.skimmer, { reload: 2, health: 1.7, damage: 1.4, resist: 1.2 }, {speed: 0.8, maxSpeed: 0.6}, g.fake]),
                    TYPE: "bullet",
                },
            },
            {
                POSITION: [20, 11, 1.25, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.artillery, g.artillery, g.skimmer, { reload: 2, health: 1.7, damage: 1.4, resist: 1.2 }, {speed: 0.8, maxSpeed: 0.6}, g.fake]),
                    TYPE: "bullet",
                },
            },
            {
                POSITION: [17, 13, 1.25, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.artillery, g.artillery, g.skimmer, { reload: 2, health: 1.7, damage: 1.4, resist: 1.2 }, {speed: 0.8, maxSpeed: 0.6}]),
                    TYPE: "kronosPrimordialGigaPaverTurretMissile",
                },
            },
            {
                POSITION: [11, 2, 1.4, 9, 0, 0, 0],
            },
            {
                POSITION: [9, 4, 1.4, 9, 0, 0, 0],
            },
            {
                POSITION: [6, 6, 1.4, 9, 0, 0, 0],
            },
        ],
    }, {limitFov: true, fov: 10, extraStats: [], label: "Giga-Paver"})
    Class.kronosPrimordialBentBattleshipTurret = makeTurret({
        GUNS: [
            {
                POSITION: [10, 10, 0, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, {range: 0.0005, speed: 0.0005, maxSpeed: 0.0005, recoil: 0}]),
                    TYPE: "stupidBullet",
                    DRAW_FILL: false,
                    BORDERLESS: true,
                },
            },
            {
                POSITION: [7, 7.5, 0.6, 7, 0, 60, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.swarm, g.battleship]),
                    TYPE: "swarm",
                    STAT_CALCULATOR: "swarm",
                    LABEL: "Guided"
                }
            },
            {
                POSITION: [7, 7.5, 0.6, 7, 0, 60-40, 0.5],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.swarm]),
                    TYPE: "autoswarm",
                    STAT_CALCULATOR: "swarm",
                    LABEL: "Autonomous"
                }
            },
            {
                POSITION: [7, 7.5, 0.6, 7, 0, 300, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.swarm]),
                    TYPE: "autoswarm",
                    STAT_CALCULATOR: "swarm",
                    LABEL: "Autonomous"
                }
            },
            {
                POSITION: [7, 7.5, 0.6, 7, 0, 300+40, 0.5],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.swarm, g.battleship]),
                    TYPE: "swarm",
                    STAT_CALCULATOR: "swarm",
                    LABEL: "Guided"
                }
            }
        ],
    }, {limitFov: true, fov: 10, extraStats: [], label: "Bent Battleship"})
    Class.kronosPrimordialFetterTurret = makeTurret({
        GUNS: [
            {
                POSITION: [10, 10, 0, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, {range: 0.0005, speed: 0.0005, maxSpeed: 0.0005, recoil: 0}]),
                    TYPE: "stupidBullet",
                    DRAW_FILL: false,
                    BORDERLESS: true,
                },
            },
            {
                POSITION: [15, 10, 1, 0, 5, 0, 2/3],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.triplet]),
                    TYPE: "bullet"
                }
            },
            {
                POSITION: [15, 10, 1, 0, -5, 0, 2/3],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.triplet]),
                    TYPE: "bullet"
                }
            },
            {
                POSITION: [18, 10, 1, 0, 2.5, 0, 1/3],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.triplet]),
                    TYPE: "bullet"
                }
            },
            {
                POSITION: [18, 10, 1, 0, -2.5, 0, 1/3],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.triplet]),
                    TYPE: "bullet"
                }
            },
            {
                POSITION: [7, 7.5, 0.6, 7, 2.5, 0, 0.5],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.swarm]),
                    TYPE: "autoswarm",
                    STAT_CALCULATOR: "swarm",
                },
            },
            {
                POSITION: [7, 7.5, 0.6, 7, -2.5, 0, 0.5],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.swarm]),
                    TYPE: "autoswarm",
                    STAT_CALCULATOR: "swarm",
                },
            },
            {
                POSITION: [21, 10, 1, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.triplet]),
                    TYPE: "bullet"
                }
            },
            {
                POSITION: [10, 7.5, 0.6, 7, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.swarm]),
                    TYPE: "autoswarm",
                    STAT_CALCULATOR: "swarm",
                },
            },
        ],
    }, {limitFov: true, fov: 10, extraStats: [], label: "Fetter"})
    Class.kronosPrimordialPentaShotTurret = makeTurret({
        GUNS: [
            {
                POSITION: [10, 10, 0, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, {range: 0.0005, speed: 0.0005, maxSpeed: 0.0005, recoil: 0}]),
                    TYPE: "stupidBullet",
                    DRAW_FILL: false,
                    BORDERLESS: true,
                },
            },
            {
                POSITION: [16, 8, 1, 0, -3, -30, 2/3],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.tripleShot]),
                    TYPE: "bullet"
                }
            },
            {
                POSITION: [16, 8, 1, 0, 3, 30, 2/3],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.tripleShot]),
                    TYPE: "bullet"
                }
            },
            {
                POSITION: [19, 8, 1, 0, -2, -15, 1/3],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.tripleShot]),
                    TYPE: "bullet"
                }
            },
            {
                POSITION: [19, 8, 1, 0, 2, 15, 1/3],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.tripleShot]),
                    TYPE: "bullet"
                }
            },
            {
                POSITION: [22, 8, 1, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.tripleShot]),
                    TYPE: "bullet"
                }
            }
        ],
    }, {limitFov: true, fov: 10, extraStats: [], label: "Penta Shot"})
    let kronosPrimordial = new LayeredBoss("kronosPrimordial", "Kronos", "CMCPrimordial", 13, "veryLightGrey", "baseTrapTurret", 4.5, 5.5);
    kronosPrimordial.addLayer({turret: {
            POSITION: [5.375, 9, 0, null, 160, 0],
            TYPE: ["kronosPrimordialBentBattleshipTurret", {GUN_STAT_SCALE: g.battleship}]
        }
    }, true, null);
    kronosPrimordial.addLayer({turret: {
            POSITION: [6.5, 9, 0, null, 160, 0],
            TYPE: "kronosPrimordialGigaPaverTurret",
        }
    }, true, 3.35);
    kronosPrimordial.addLayer({turret: {
            POSITION: [7, 9, 0, null, 160, 0],
            TYPE: ["kronosPrimordialFetterTurret", {GUN_STAT_SCALE: {health: 1.15, damage: 1.1, resist: 1.3, speed: 1.1, maxSpeed: 0.9}}],
        }
    }, true, 3.35);
    kronosPrimordial.addLayer({turret: {
            POSITION: [8.5, 9, 0, null, 160, 0],
            TYPE: ["kronosPrimordialPentaShotTurret", {GUN_STAT_SCALE: {health: 1.2, damage: 1.2, speed: 1.15, maxSpeed: 0.9, resist: 1.2}}],
        }
    }, true, 3.35);

    Class.ragnarokPrimordialGigaInceptionTurretMissile = {
        PARENT: "minimissile",
        TURRETS: [
            {
                POSITION: [15, 0, 0, 0, 360, 1],
                TYPE: "bigauto4gun",
            },
        ],
    }
    Class.ragnarokPrimordialGigaInceptionTurret = makeTurret({
        GUNS: [
            {
                POSITION: [10, 10, 0, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, {range: 0.0005, speed: 0.0005, maxSpeed: 0.0005, recoil: 0}]),
                    TYPE: "stupidBullet",
                    DRAW_FILL: false,
                    BORDERLESS: true,
                },
            },
            {
                POSITION: [10, 9, 1, 9, 0, 0, 0],
            },
            {
                POSITION: [17, 13, 1, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.artillery, g.artillery]),
                    TYPE: "ragnarokPrimordialGigaInceptionTurretMissile",
                    STAT_CALCULATOR: "sustained",
                },
            },
            {
                POSITION: [4, 8, 1, 13, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.artillery, g.artillery, g.fake]),
                    TYPE: "bullet",
                }
            },
            {
                POSITION: [4, 4, 1, 13, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.artillery, g.artillery, g.fake]),
                    TYPE: "bullet",
                }
            },
            {
                POSITION: [4, 2, 1, 13, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.artillery, g.artillery, g.fake]),
                    TYPE: "bullet",
                }
            },
        ],
    }, {limitFov: true, fov: 10, extraStats: [], label: "Giga Inception"})
    Class.ragnarokPrimordialCarryBatteryTurret = makeTurret({
        GUNS: [
            {
                POSITION: [10, 10, 0, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, {range: 0.0005, speed: 0.0005, maxSpeed: 0.0005, recoil: 0}]),
                    TYPE: "stupidBullet",
                    DRAW_FILL: false,
                    BORDERLESS: true,
                },
            },
            {
                POSITION: [7, 7.5, 0.6, 7, 4, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.swarm]),
                    TYPE: "swarm",
                    STAT_CALCULATOR: "swarm",
                },
            },
            {
                POSITION: [7, 7.5, 0.6, 7, -4, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.swarm]),
                    TYPE: "swarm",
                    STAT_CALCULATOR: "swarm",
                },
            },
            {
                POSITION: [14, 3.5, 1, 0, 7.5, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.gunner, { speed: 1.2 }]),
                    TYPE: "bullet"
                }
            },
            {
                POSITION: [14, 3.5, 1, 0, -7.5, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.gunner, { speed: 1.2 }]),
                    TYPE: "bullet"
                }
            },
            {
                POSITION: [18, 3.5, 1, 0, 0, 0, 0.5],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.gunner, { speed: 1.2 }]),
                    TYPE: "bullet"
                }
            },
            {
                POSITION: [8, 7.5, 0.6, 7, 0, 0, 0.5],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.swarm]),
                    TYPE: "swarm",
                    STAT_CALCULATOR: "swarm",
                },
            },
        ],
    }, {limitFov: true, fov: 10, extraStats: [], label: "Carry Battery"})
    Class.ragnarokPrimordialOrdnanceTurret = makeTurret({
        GUNS: [
            {
                POSITION: [10, 10, 0, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, {range: 0.0005, speed: 0.0005, maxSpeed: 0.0005, recoil: 0}]),
                    TYPE: "stupidBullet",
                    DRAW_FILL: false,
                    BORDERLESS: true,
                },
            },
            {
                POSITION: [17, 3, 1, 0, -5.75, -6, 0.25],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.artillery]),
                    TYPE: "bullet",
                    LABEL: "Secondary",
                },
            },
            {
                POSITION: [17, 3, 1, 0, 5.75, 6, 0.75],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.artillery]),
                    TYPE: "bullet",
                    LABEL: "Secondary",
                },
            },
            {
                POSITION: [24, 8, 1, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.hunter, g.hunterSecondary]),
                    TYPE: "bullet",
                },
            },
            {
                POSITION: [21, 11, 1, 0, 0, 0, 0.25],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.hunter]),
                    TYPE: "bullet",
                },
            },
        ],
    }, {limitFov: true, fov: 10, extraStats: [], label: "Ordnance"})
    let ragnarokPrimordial = new LayeredBoss("ragnarokPrimordial", "Odin", "CMCPrimordial", 13, "hexagon", "baseTrapTurret", 4.5, 5.5);
    ragnarokPrimordial.addLayer({gun: {
            POSITION: [2.25, 3.25, -1.6, 9, 0, null, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.drone, g.summoner, g.pounder, g.destroyer, {speed: 1.25, maxSpeed: 1.25}]),
                TYPE: ["realchip", {INDEPENDENT: true, DRAW_HEALTH: true, COLOR: 'hexagon'}],
                AUTOFIRE: true,
                SYNCS_SKILLS: true,
            },
        }
    }, true, null, 22);
    ragnarokPrimordial.addLayer({turret: {
            POSITION: [6.5, 9, 0, null, 160, 0],
            TYPE: "ragnarokPrimordialGigaInceptionTurret",
        }
    }, true, 3.35);
    ragnarokPrimordial.addLayer({turret: {
            POSITION: [7, 9, 0, null, 160, 0],
            TYPE: ["ragnarokPrimordialCarryBatteryTurret", {GUN_STAT_SCALE: {health: 1.15, damage: 1.1, resist: 1.3, speed: 1.1, maxSpeed: 0.9}}],
        }
    }, true, 3.35);
    ragnarokPrimordial.addLayer({turret: {
            POSITION: [8.5, 9, 0, null, 160, 0],
            TYPE: "ragnarokPrimordialOrdnanceTurret",
        }
    }, true, 3.35);

    Class.atlasPrimordialApidriveTurret = makeTurret({
        GUNS: [
            {
                POSITION: [10, 10, 0, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, {range: 0.0005, speed: 0.0005, maxSpeed: 0.0005, recoil: 0}]),
                    TYPE: "stupidBullet",
                    DRAW_FILL: false,
                    BORDERLESS: true,
                },
            },
            {
                POSITION: [11, 3, 1, 0, -8, -7, 0.6],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.swarm, g.bee, {recoil: 0}]),
                    TYPE: ["atlasEternalBeedriveTurretTurretedBee", { INDEPENDENT: false }],
                    SYNCS_SKILLS: true,
                    STAT_CALCULATOR: "drone",
                    WAIT_TO_CYCLE: true,
                    LABEL: "Secondary",
                },
            },
            {
                POSITION: [11, 3, 1, 0, 8, 7, 0.8],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.swarm, g.bee, {recoil: 0}]),
                    TYPE: ["atlasEternalBeedriveTurretTurretedBee", { INDEPENDENT: false }],
                    SYNCS_SKILLS: true,
                    STAT_CALCULATOR: "drone",
                    WAIT_TO_CYCLE: true,
                    LABEL: "Secondary",
                },
            },
            {
                POSITION: [14, 3, 1, 0, -6, -7, 0.2],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.swarm, g.bee, {recoil: 0}]),
                    TYPE: ["atlasEternalBeedriveTurretTurretedBee", { INDEPENDENT: false }],
                    SYNCS_SKILLS: true,
                    STAT_CALCULATOR: "drone",
                    WAIT_TO_CYCLE: true,
                    LABEL: "Secondary",
                },
            },
            {
                POSITION: [14, 3, 1, 0, 6, 7, 0.4],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.swarm, g.bee, {recoil: 0}]),
                    TYPE: ["atlasEternalBeedriveTurretTurretedBee", { INDEPENDENT: false }],
                    SYNCS_SKILLS: true,
                    STAT_CALCULATOR: "drone",
                    WAIT_TO_CYCLE: true,
                    LABEL: "Secondary",
                },
            },
            {
                POSITION: [19, 12, 1, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.artillery, {recoil: 0}]),
                    TYPE: "bullet",
                    LABEL: "Heavy",
                },
            },
        ],
        TURRETS: [
            {
                POSITION: [11, 0, 0, 0, 360, 1],
                TYPE: ["overdriveDeco", {MIRROR_MASTER_ANGLE: true}],
            },
        ],
    }, {limitFov: true, fov: 10, extraStats: [], label: "Apidrive"})
    Class.atlasPrimordialFibrilatorTurret = makeTurret({
        GUNS: [
            {
                POSITION: [10, 10, 0, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, {range: 0.0005, speed: 0.0005, maxSpeed: 0.0005, recoil: 0}]),
                    TYPE: "stupidBullet",
                    DRAW_FILL: false,
                    BORDERLESS: true,
                },
            },
            {
                POSITION: [22, 2, 1, 0, -5, 0, (1/5)],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.power, g.twin, g.nailgun, {recoil: 0}, g.sniper, {pen: 1.25}]),
                    TYPE: "bullet",
                },
            },
            {
                POSITION: [22, 2, 1, 0, 5, 0, (4/5)],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.power, g.twin, g.nailgun, {recoil: 0}, g.sniper, {pen: 1.25}]),
                    TYPE: "bullet",
                },
            },
            {
                POSITION: [24, 2, 1, 0, -2.5, 0, (2/5)],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.power, g.twin, g.nailgun, {recoil: 0}, g.sniper, {pen: 1.25}]),
                    TYPE: "bullet",
                },
            },
            {
                POSITION: [24, 2, 1, 0, 2.5, 0, (3/5)],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.power, g.twin, g.nailgun, {recoil: 0}, g.sniper, {pen: 1.25}]),
                    TYPE: "bullet",
                },
            },
            {
                POSITION: [26, 2, 1, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.power, g.twin, g.nailgun, {recoil: 0}, g.sniper, {pen: 1.25}]),
                    TYPE: "bullet",
                },
            },
            {
                POSITION: [5.5, 12, -1.3, 6.5, 0, 0, 0],
            },
        ],
    }, {limitFov: true, fov: 10, extraStats: [], label: "Fibrilator"})
    Class.atlasPrimordialSizzlerTurret = makeTurret({
        GUNS: [
            {
                POSITION: [10, 10, 0, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, {range: 0.0005, speed: 0.0005, maxSpeed: 0.0005, recoil: 0}]),
                    TYPE: "stupidBullet",
                    DRAW_FILL: false,
                    BORDERLESS: true,
                },
            },
            {
                POSITION: [19, 8, 1, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.minigun]),
                    TYPE: "bullet",
                    WAIT_TO_CYCLE: true,
                }
            },
            {
                POSITION: [17, 8, 1, 0, 0, 0, 0.5],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.minigun]),
                    TYPE: "bullet",
                    WAIT_TO_CYCLE: true,
                }
            },
            {
                POSITION: [7, 8, 0.6, 7, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.swarm, g.battleship, g.carrier, {reload: 1.75}]),
                    TYPE: "swarm",
                    STAT_CALCULATOR: "swarm",
                },
            },
            {
                POSITION: [7, 8, 0.6, 7, 2, 30, 0.5],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.swarm, g.battleship, g.carrier, {reload: 1.75}]),
                    TYPE: "swarm",
                    STAT_CALCULATOR: "swarm",
                },
            },
            {
                POSITION: [7, 8, 0.6, 7, -2, -30, 0.5],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.swarm, g.battleship, g.carrier, {reload: 1.75}]),
                    TYPE: "swarm",
                    STAT_CALCULATOR: "swarm",
                },
            },
        ],
    }, {limitFov: true, fov: 10, extraStats: [], label: "Sizzler"})
    Class.atlasPrimordialRangerTurret = makeTurret({
        GUNS: [
            {
                POSITION: [10, 10, 0, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, {range: 0.0005, speed: 0.0005, maxSpeed: 0.0005, recoil: 0}]),
                    TYPE: "stupidBullet",
                    DRAW_FILL: false,
                    BORDERLESS: true,
                },
            },
            {
                POSITION: [32, 8, 1, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.assassin]),
                    TYPE: "bullet",
                },
            },
            {
                POSITION: [5, 8, -1.4, 8, 0, 0, 0],
            },
        ],
    }, {limitFov: true, fov: 10, extraStats: [], label: "Ranger"})
    let atlasPrimordial = new LayeredBoss("atlasPrimordial", "Atlas", "CMCPrimordial", 13, "lavender", "baseTrapTurret", 4.5, 5.5);
    atlasPrimordial.addLayer({turret: {
            POSITION: [5.375, 9, 0, null, 160, 0],
            TYPE: "atlasPrimordialApidriveTurret"
        }
    }, true, null);
    atlasPrimordial.addLayer({turret: {
            POSITION: [6.5, 9, 0, null, 160, 0],
            TYPE: ["atlasPrimordialFibrilatorTurret", {GUN_STAT_SCALE: {speed: 1.1, maxSpeed: 1.1, resist: 1.3}}],
        }
    }, true, 3.35);
    atlasPrimordial.addLayer({turret: {
            POSITION: [7, 9, 0, null, 160, 0],
            TYPE: ["atlasPrimordialSizzlerTurret", {GUN_STAT_SCALE: {speed: 1.1, maxSpeed: 1.1, resist: 1.3}}],
        }
    }, true, 3.35);
    atlasPrimordial.addLayer({turret: {
            POSITION: [8.5, 9, 0, null, 160, 0],
            TYPE: ["atlasPrimordialRangerTurret", {GUN_STAT_SCALE: {speed: 1.1, maxSpeed: 1.1, resist: 1.3}}],
        }
    }, true, 3.35);

    Class.rheaPrimordialHaranguerTurret = makeTurret({
        GUNS: [
            {
                POSITION: [87, 6.5, 1, 0, 0, 0, 0],
            },
            {
                POSITION: [5, 8.5, -1.5, 8, 0, 0, 0],
            },
        ],
        TURRETS: [
            {
                POSITION: [8, 80, 0, 0, 360, 0],
                TYPE: [ "rheaCelestialMegaphoneTurretHangar", { GUN_STAT_SCALE: g.flankGuard, INDEPENDENT: false, HAS_NO_RECOIL: true } ],
            },
            {
                POSITION: [8, 70, 0, 0, 360, 0],
                TYPE: [ "rheaCelestialMegaphoneTurretHangar", { GUN_STAT_SCALE: g.flankGuard, INDEPENDENT: false, HAS_NO_RECOIL: true } ],
            },
            {
                POSITION: [8, 60, 0, 0, 360, 0],
                TYPE: [ "rheaCelestialMegaphoneTurretHangar", { GUN_STAT_SCALE: g.flankGuard, INDEPENDENT: false, HAS_NO_RECOIL: true } ],
            },
            {
                POSITION: [8, 50, 0, 0, 360, 0],
                TYPE: [ "rheaCelestialMegaphoneTurretHangar", { GUN_STAT_SCALE: g.flankGuard, INDEPENDENT: false, HAS_NO_RECOIL: true } ],
            },
            {
                POSITION: [8, 40, 0, 0, 360, 0],
                TYPE: [ "rheaCelestialMegaphoneTurretHangar", { GUN_STAT_SCALE: g.flankGuard, INDEPENDENT: false, HAS_NO_RECOIL: true } ],
            },
            {
                POSITION: [8, 30, 0, 0, 360, 0],
                TYPE: [ "rheaCelestialMegaphoneTurretHangar", { GUN_STAT_SCALE: g.flankGuard, INDEPENDENT: false, HAS_NO_RECOIL: true } ],
            },
            {
                POSITION: [8, 20, 0, 0, 360, 0],
                TYPE: [ "rheaCelestialMegaphoneTurretHangar", { GUN_STAT_SCALE: g.flankGuard, INDEPENDENT: false, HAS_NO_RECOIL: true } ],
            },
        ],
    }, {limitFov: true, fov: 10, extraStats: [], label: "Haranguer"})
    Class.rheaPrimordialMeddlerTurret = makeTurret({
        GUNS: [
            {
                POSITION: [77, 6.5, 1, 0, 0, 0, 0],
            },
            {
                POSITION: [5, 8.5, -1.5, 8, 0, 0, 0],
            },
        ],
        TURRETS: [
            {
                POSITION: [6, 78, 0, 0, 360, 1],
                TYPE: [ "autoTankGun", { GUN_STAT_SCALE: g.flankGuard, INDEPENDENT: false, HAS_NO_RECOIL: true } ],
            },
            {
                POSITION: [6, 68, 0, 0, 360, 1],
                TYPE: [ "autoTankGun", { GUN_STAT_SCALE: g.flankGuard, INDEPENDENT: false, HAS_NO_RECOIL: true } ],
            },
            {
                POSITION: [6, 58, 0, 0, 360, 1],
                TYPE: [ "autoTankGun", { GUN_STAT_SCALE: g.flankGuard, INDEPENDENT: false, HAS_NO_RECOIL: true } ],
            },
            {
                POSITION: [6, 48, 0, 0, 360, 1],
                TYPE: [ "autoTankGun", { GUN_STAT_SCALE: g.flankGuard, INDEPENDENT: false, HAS_NO_RECOIL: true } ],
            },
            {
                POSITION: [6, 38, 0, 0, 360, 1],
                TYPE: [ "autoTankGun", { GUN_STAT_SCALE: g.flankGuard, INDEPENDENT: false, HAS_NO_RECOIL: true } ],
            },
            {
                POSITION: [6, 28, 0, 0, 360, 1],
                TYPE: [ "autoTankGun", { GUN_STAT_SCALE: g.flankGuard, INDEPENDENT: true, HAS_NO_RECOIL: true } ],
            },
            {
                POSITION: [6, 18, 0, 0, 360, 1],
                TYPE: [ "autoTankGun", { GUN_STAT_SCALE: g.flankGuard, INDEPENDENT: false, HAS_NO_RECOIL: true } ],
            },
        ],
    }, {limitFov: true, fov: 10, extraStats: [], label: "Meddler"})
    Class.rheaPrimordialRhetoricianTurretHangar1 = {
        PARENT: "genericTank",
        LABEL: "Hangar",
        SHAPE: 'M 0 0',
        MIRROR_MASTER_ANGLE: true,
        GUNS: weaponArray({
            POSITION: [7, 12, 0.6, 7, 0, 90, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.swarm, {damage: 0.5, health: 0.5, speed: 1.5, maxSpeed: 1.5}]),
                TYPE: "swarm",
                STAT_CALCULATOR: "swarm",
            },
        }, 2)
    }
    Class.rheaPrimordialRhetoricianTurretHangar2 = {
        PARENT: "genericTank",
        LABEL: "Hangar",
        SHAPE: 'M 0 0',
        MIRROR_MASTER_ANGLE: true,
        GUNS: weaponArray({
            POSITION: [7, 12, 0.6, 7, 0, 90, 1/5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.swarm, {damage: 0.5, health: 0.5, speed: 1.5, maxSpeed: 1.5}]),
                TYPE: "swarm",
                STAT_CALCULATOR: "swarm",
            },
        }, 2)
    }
    Class.rheaPrimordialRhetoricianTurretHangar3 = {
        PARENT: "genericTank",
        LABEL: "Hangar",
        SHAPE: 'M 0 0',
        MIRROR_MASTER_ANGLE: true,
        GUNS: weaponArray({
            POSITION: [7, 12, 0.6, 7, 0, 90, 2/5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.swarm, {damage: 0.5, health: 0.5, speed: 1.5, maxSpeed: 1.5}]),
                TYPE: "swarm",
                STAT_CALCULATOR: "swarm",
            },
        }, 2)
    }
    Class.rheaPrimordialRhetoricianTurretHangar4 = {
        PARENT: "genericTank",
        LABEL: "Hangar",
        SHAPE: 'M 0 0',
        MIRROR_MASTER_ANGLE: true,
        GUNS: weaponArray({
            POSITION: [7, 12, 0.6, 7, 0, 90, 3/5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.swarm, {damage: 0.5, health: 0.5, speed: 1.5, maxSpeed: 1.5}]),
                TYPE: "swarm",
                STAT_CALCULATOR: "swarm",
            },
        }, 2)
    }
    Class.rheaPrimordialRhetoricianTurretHangar5 = {
        PARENT: "genericTank",
        LABEL: "Hangar",
        SHAPE: 'M 0 0',
        MIRROR_MASTER_ANGLE: true,
        GUNS: weaponArray({
            POSITION: [7, 12, 0.6, 7, 0, 90, 4/5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.swarm, {damage: 0.5, health: 0.5, speed: 1.5, maxSpeed: 1.5}]),
                TYPE: "swarm",
                STAT_CALCULATOR: "swarm",
            },
        }, 2)
    }
    Class.rheaPrimordialRhetoricianTurret = makeTurret({
        GUNS: [
            {
                POSITION: [87, 6.5, 1, 0, 0, 0, 0],
            },
            {
                POSITION: [5, 8.5, -1.5, 8, 0, 0, 0],
            },
        ],
        TURRETS: [
            {
                POSITION: [8, 80, 0, 0, 360, 0],
                TYPE: [ "rheaPrimordialRhetoricianTurretHangar1", { GUN_STAT_SCALE: g.flankGuard, INDEPENDENT: false, HAS_NO_RECOIL: true } ],
            },
            {
                POSITION: [8, 70, 0, 0, 360, 0],
                TYPE: [ "rheaPrimordialRhetoricianTurretHangar2", { GUN_STAT_SCALE: g.flankGuard, INDEPENDENT: false, HAS_NO_RECOIL: true } ],
            },
            {
                POSITION: [8, 60, 0, 0, 360, 0],
                TYPE: [ "rheaPrimordialRhetoricianTurretHangar3", { GUN_STAT_SCALE: g.flankGuard, INDEPENDENT: false, HAS_NO_RECOIL: true } ],
            },
            {
                POSITION: [8, 50, 0, 0, 360, 0],
                TYPE: [ "rheaPrimordialRhetoricianTurretHangar4", { GUN_STAT_SCALE: g.flankGuard, INDEPENDENT: false, HAS_NO_RECOIL: true } ],
            },
            {
                POSITION: [8, 40, 0, 0, 360, 0],
                TYPE: [ "rheaPrimordialRhetoricianTurretHangar5", { GUN_STAT_SCALE: g.flankGuard, INDEPENDENT: false, HAS_NO_RECOIL: true } ],
            },
        ],
    }, {limitFov: true, fov: 10, extraStats: [], label: "Rhetorician"})
    Class.rheaCelestialCrankerTurret = makeTurret({
        GUNS: [
            {
                POSITION: [37, 6.5, 1, 0, 0, 0, 0],
            },
            {
                POSITION: [5, 8.5, -1.5, 8, 0, 0, 0],
            },
        ],
        TURRETS: [
            {
                POSITION: [6, 38, 0, 0, 360, 1],
                TYPE: [ "megaAutoTankGun", { GUN_STAT_SCALE: g.flankGuard, INDEPENDENT: false, HAS_NO_RECOIL: true } ],
            },
            {
                POSITION: [6, 28, 0, 0, 360, 1],
                TYPE: [ "megaAutoTankGun", { GUN_STAT_SCALE: g.flankGuard, INDEPENDENT: true, HAS_NO_RECOIL: true } ],
            },
            {
                POSITION: [6, 18, 0, 0, 360, 1],
                TYPE: [ "megaAutoTankGun", { GUN_STAT_SCALE: g.flankGuard, INDEPENDENT: false, HAS_NO_RECOIL: true } ],
            },
        ],
    }, {limitFov: true, fov: 10, extraStats: [], label: "Cranker"})
    let rheaPrimordial = new LayeredBoss("rheaPrimordial", "Rhea", "CMCPrimordial", 13, "yellow", "baseTrapTurret", 4.5, 5.5);
    rheaPrimordial.addLayer({turret: {
            POSITION: [5.375, 9, 0, null, 160, 0],
            TYPE: "rheaPrimordialHaranguerTurret",
        }
    }, true, null);
    rheaPrimordial.addLayer({turret: {
            POSITION: [6.5, 9, 0, null, 160, 0],
            TYPE: "rheaPrimordialMeddlerTurret",
        }
    }, true, 3.35);
    rheaPrimordial.addLayer({turret: {
            POSITION: [7, 9, 0, null, 160, 0],
            TYPE: "rheaPrimordialRhetoricianTurret",
        }
    }, true, 3.35);
    rheaPrimordial.addLayer({turret: {
            POSITION: [8.5, 9, 0, null, 160, 0],
            TYPE: "rheaCelestialCrankerTurret",
        }
    }, true, 3.35);

    Class.juliusPrimordialHomingLauncherTurretMissile = {
        PARENT: "homingBullet",
        LABEL: "Missile",
        INDEPENDENT: true,
        BODY: { RANGE: 120 },
        GUNS: [
            {
                POSITION: [14, 6, 1, 0, 0, 180, 0],
                PROPERTIES: {
                    AUTOFIRE: true,
                    SHOOT_SETTINGS: combineStats([g.basic, { recoil: 0.5 }, g.lowPower]),
                    TYPE: ["bullet", { PERSISTS_AFTER_DEATH: true }],
                    STAT_CALCULATOR: "thruster",
                },
            },
        ],
    }
    Class.juliusPrimordialHomingLauncherTurret = makeTurret({
        GUNS: [
            {
                POSITION: [10, 10, 0, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, {range: 0.0005, speed: 0.0005, maxSpeed: 0.0005, recoil: 0}]),
                    TYPE: "stupidBullet",
                    DRAW_FILL: false,
                    BORDERLESS: true,
                },
            },
            {
                POSITION: [10, 9, 1, 9, 0, 0, 0],
            },
            {
                POSITION: [17, 13, 1, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.launcher]),
                    TYPE: "juliusPrimordialHomingLauncherTurretMissile",
                    STAT_CALCULATOR: "sustained",
                },
            },
            {
                POSITION: [4, 16.25, 0.8, 11, 0, 0, 0],
            },
        ],
    }, {limitFov: true, fov: 10, extraStats: [], label: "Homing-Launcher"})
    Class.juliusPrimordialLaunchdriveTurretMissileTurret = makeTurret({
        GUNS: [
            {
                POSITION: [22, 8.5, 1, 0, -5, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.flankGuard, {recoil: 0}, g.twin]),
                    TYPE: "bullet",
                },
            },
            {
                POSITION: [22, 8.5, 1, 0, 5, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.flankGuard, {recoil: 0}, g.twin]),
                    TYPE: "bullet",
                },
            },
        ],
    }, {canRepel: true, limitFov: true, fov: 3})
    Class.juliusPrimordialLaunchdriveTurretMissile = makeAuto('minimissile', "Twin Auto-Missile", {type: 'juliusPrimordialLaunchdriveTurretMissileTurret'})
    Class.juliusPrimordialLaunchdriveTurret = makeTurret({
        TURRETS: [
            {
                POSITION: [9, 0, 0, 0, 360, 1],
                TYPE: ["overdriveDeco", {MIRROR_MASTER_ANGLE: true}],
            },
            {
                POSITION: [9*(1/Math.sqrt(2)), 0, 0, 45, 360, 1],
                TYPE: ["overdriveDeco", {MIRROR_MASTER_ANGLE: true}],
            },
        ],
        GUNS: [
            {
                POSITION: [10, 10, 0, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, {range: 0.0005, speed: 0.0005, maxSpeed: 0.0005, recoil: 0}]),
                    TYPE: "stupidBullet",
                    DRAW_FILL: false,
                    BORDERLESS: true,
                },
            },
            {
                POSITION: [10, 9, 1, 9, 0, 0, 0],
            },
            {
                POSITION: [17, 13, 1, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.launcher]),
                    TYPE: "juliusEternalLaunchdriveTurretMissile",
                    STAT_CALCULATOR: "sustained",
                },
            },
        ],
    }, {limitFov: true, fov: 10, extraStats: [], label: "Launchdrive"})
    Class.juliusPrimordialPredatorTurret = makeTurret({
        GUNS: [
            {
                POSITION: [24, 8, 1, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.hunter, g.hunterSecondary, g.hunterSecondary, g.predator]),
                    TYPE: "bullet"
                }
            },
            {
                POSITION: [21, 12, 1, 0, 0, 0, 0.15],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.hunter, g.hunterSecondary, g.predator]),
                    TYPE: "bullet"
                }
            },
            {
                POSITION: [18, 16, 1, 0, 0, 0, 0.3],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.hunter, g.predator]),
                    TYPE: "bullet"
                }
            }
        ]
    }, {limitFov: true, fov: 10, extraStats: [], label: "Launchdrive"})
    let juliusPrimordial = new LayeredBoss("juliusPrimordial", "Julius", "CMCPrimordial", 13, "darkGrey", "baseTrapTurret", 4.5, 5.5);
    Class["juliusEternal"].LABEL = "Rogue Eternal"
    juliusPrimordial.addLayer({turret: {
            POSITION: [5.375, 9, 0, null, 160, 0],
            TYPE: "juliusPrimordialHomingLauncherTurret",
        }
    }, true, null);
    juliusPrimordial.addLayer({turret: {
            POSITION: [6.5, 9, 0, null, 160, 0],
            TYPE: "juliusPrimordialLaunchdriveTurret",
        }
    }, true, 3.35);
    juliusPrimordial.addLayer({gun: {
            POSITION: [4, 5, 1.4, 7.5, 0, null, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.drone, g.sniper]),
                TYPE: ["drone", {INDEPENDENT: true}],
                AUTOFIRE: true,
                SYNCS_SKILLS: true,
            },
        }
    }, true, 3.35, 14);
    Class["juliusPrimordialLayer3"].GUNS.push(
        ...weaponArray(
            {
                POSITION: [5, 3, 0.4, 7.5, 0, 360/7/2, 0],
            }, 7
        )
    )
    juliusPrimordial.addLayer({turret: {
            POSITION: [8.5, 9, 0, null, 160, 0],
            TYPE: "juliusPrimordialPredatorTurret",
        }
    }, true, 3.35);

    Class.genghisPrimordialInitiatorTurret = makeTurret({
        GUNS: [
            {
                POSITION: [10, 10, 0, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, {range: 0.0005, speed: 0.0005, maxSpeed: 0.0005, recoil: 0}]),
                    TYPE: "stupidBullet",
                    DRAW_FILL: false,
                    BORDERLESS: true,
                },
            },
            {
                POSITION: [5, 6, 1, 10, 5, 5, 0.5],
            },
            {
                POSITION: [1, 8, 1, 15, 5, 5, 0.5],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.swarm, g.babyfactory, { size: 1.2, reload: 1.5 }, g.battleship, g.carrier]),
                    TYPE: "tinyMinion",
                    STAT_CALCULATOR: "drone",
                    SYNCS_SKILLS: true,
                },
            },
            {
                POSITION: [11, 10, 0.8, 0, 5, 5, 0.5],
            },
            {
                POSITION: [5, 6, 1, 10, -5, -5, 0.5],
            },
            {
                POSITION: [1, 8, 1, 15, -5, -5, 0.5],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.swarm, g.babyfactory, { size: 1.2, reload: 1.5 }, g.battleship, g.carrier]),
                    TYPE: "tinyMinion",
                    STAT_CALCULATOR: "drone",
                    SYNCS_SKILLS: true,
                },
            },
            {
                POSITION: [11, 10, 0.8, 0, -5, -5, 0.5],
            },
            {
                POSITION: [5, 6, 1, 12, 0, 0, 0],
            },
            {
                POSITION: [1, 8, 1, 17, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.swarm, g.babyfactory, { size: 1.2, reload: 1.5 }, g.battleship, g.carrier]),
                    TYPE: "tinyMinion",
                    STAT_CALCULATOR: "drone",
                    SYNCS_SKILLS: true,
                },
            },
            {
                POSITION: [11, 10, 0.8, 2, 0, 0, 0],
            },
        ],
    }, {limitFov: true, fov: 10, extraStats: [], label: "Initiator"})
    Class.genghisPrimordialPentupletTurret = makeTurret({
        GUNS: [
            {
                POSITION: [10, 10, 0, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, {range: 0.0005, speed: 0.0005, maxSpeed: 0.0005, recoil: 0}]),
                    TYPE: "stupidBullet",
                    DRAW_FILL: false,
                    BORDERLESS: true,
                },
            },
            {
                POSITION: [18, 10, 1, 0, 5, 0, 2/3],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.triplet]),
                    TYPE: "bullet"
                }
            },
            {
                POSITION: [18, 10, 1, 0, -5, 0, 2/3],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.triplet]),
                    TYPE: "bullet"
                }
            },
            {
                POSITION: [21, 10, 1, 0, 2.5, 0, 1/3],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.triplet]),
                    TYPE: "bullet"
                }
            },
            {
                POSITION: [21, 10, 1, 0, -2.5, 0, 1/3],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.triplet]),
                    TYPE: "bullet"
                }
            },
            {
                POSITION: [24, 10, 1, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.triplet]),
                    TYPE: "bullet"
                }
            }
        ],
    }, {limitFov: true, fov: 10, extraStats: [], label: "Pentuplet"})
    Class.genghisPrimordialMasonistTurretMinion = {
        PARENT: 'tinyMinion',
        LABEL: 'Mega Swarm Minion',
        GUNS: [
            {
                POSITION: [17.5, 11.75, 1, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.minionGun, g.lowPower, g.pounder]),
                    WAIT_TO_CYCLE: true,
                    TYPE: "bullet",
                },
            },
        ],
    }
    Class.genghisPrimordialMasonistTurret = makeTurret({
        GUNS: [
            {
                POSITION: [10, 10, 0, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, {range: 0.0005, speed: 0.0005, maxSpeed: 0.0005, recoil: 0}]),
                    TYPE: "stupidBullet",
                    DRAW_FILL: false,
                    BORDERLESS: true,
                },
            },
            {
                POSITION: [5, 8, 1, 10, 4, 10, 0],
            },
            {
                POSITION: [1, 10, 1, 15, 4, 10, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.swarm, g.babyfactory, { size: 1.2, reload: 1.5 }, g.pounder, {size: 1.5}]),
                    TYPE: "genghisPrimordialMasonistTurretMinion",
                    STAT_CALCULATOR: "drone",
                    SYNCS_SKILLS: true,
                },
            },
            {
                POSITION: [11, 12, 0.8, 0, 4, 10, 0],
            },
            {
                POSITION: [5, 8, 1, 10, -4, -10, 0.5],
            },
            {
                POSITION: [1, 10, 1, 15, -4, -10, 0.5],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.swarm, g.babyfactory, { size: 1.2, reload: 1.5 }, g.pounder, {size: 1.5}]),
                    TYPE: "genghisPrimordialMasonistTurretMinion",
                    STAT_CALCULATOR: "drone",
                    SYNCS_SKILLS: true,
                },
            },
            {
                POSITION: [11, 12, 0.8, 0, -4, -10, 0.5],
            },
        ],
    }, {limitFov: true, fov: 10, extraStats: [], label: "Masonist"})
    Class.genghisPrimordialGunnerTurret = makeTurret({
        GUNS: [
            {
                POSITION: [10, 10, 0, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, {range: 0.0005, speed: 0.0005, maxSpeed: 0.0005, recoil: 0}]),
                    TYPE: "stupidBullet",
                    DRAW_FILL: false,
                    BORDERLESS: true,
                },
            },
            {
                POSITION: [12, 3.5, 1, 0, 7.25, 0, 0.5],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.gunner, { speed: 1.2 }]),
                    TYPE: "bullet"
                }
            },
            {
                POSITION: [12, 3.5, 1, 0, -7.25, 0, 0.75],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.gunner, { speed: 1.2 }]),
                    TYPE: "bullet"
                }
            },
            {
                POSITION: [16, 3.5, 1, 0, 3.75, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.gunner, { speed: 1.2 }]),
                    TYPE: "bullet"
                }
            },
            {
                POSITION: [16, 3.5, 1, 0, -3.75, 0, 0.25],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.gunner, { speed: 1.2 }]),
                    TYPE: "bullet"
                }
            }
        ],
    }, {limitFov: true, fov: 10, extraStats: [], label: "Gunner"})
    let genghisPrimordial = new LayeredBoss("genghisPrimordial", "Genghis", "CMCPrimordial", 13, "darkGrey", "baseTrapTurret", 4.5, 5.5);
    Class["genghisPrimordial"].LABEL = "Rogue Primordial"
    genghisPrimordial.addLayer({turret: {
            POSITION: [5.375, 9, 0, null, 160, 0],
            TYPE: "genghisPrimordialInitiatorTurret",
        }
    }, true, null);
    genghisPrimordial.addLayer({turret: {
            POSITION: [6.5, 9, 0, null, 160, 0],
            TYPE: "genghisPrimordialPentupletTurret",
        }
    }, true, 3.35);
    genghisPrimordial.addLayer({turret: {
            POSITION: [7, 9, 0, null, 160, 0],
            TYPE: "genghisPrimordialMasonistTurret",
        }
    }, true, 3.35);
    genghisPrimordial.addLayer({turret: {
            POSITION: [8.5, 9, 0, null, 160, 0],
            TYPE: "genghisPrimordialGunnerTurret",
        }
    }, true, 3.35);


    Class.napoleonPrimordialMegaAttendantTurret = makeTurret({
        GUNS: [
            {
                POSITION: [10, 10, 0, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, {range: 0.0005, speed: 0.0005, maxSpeed: 0.0005, recoil: 0}]),
                    TYPE: "stupidBullet",
                    DRAW_FILL: false,
                    BORDERLESS: true,
                },
            },
            {
                POSITION: [14, 10, 0.8, 0, -5, -7, 0.5],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.swarm, g.bee, g.pounder]),
                    TYPE: ["bee", { INDEPENDENT: true }],
                    SYNCS_SKILLS: true,
                    STAT_CALCULATOR: "drone",
                    WAIT_TO_CYCLE: true,
                },
            },
            {
                POSITION: [14, 10, 0.8, 0, 5, 7, 0.5],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.swarm, g.bee, g.pounder]),
                    TYPE: ["bee", { INDEPENDENT: true }],
                    SYNCS_SKILLS: true,
                    STAT_CALCULATOR: "drone",
                    WAIT_TO_CYCLE: true,
                },
            },
            {
                POSITION: [16, 10, 0.8, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.swarm, g.bee, g.pounder]),
                    TYPE: ["bee", { INDEPENDENT: true }],
                    SYNCS_SKILLS: true,
                    STAT_CALCULATOR: "drone",
                    WAIT_TO_CYCLE: true,
                },
            },
        ],
    }, {limitFov: true, fov: 10, extraStats: [], label: "Mega-Attendant"})
    Class.napoleonPrimordialDestroyerMegadriveTurretBulletTurret = makeTurret({
        GUNS: [
            {
                POSITION: [23.5, 13, 1, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.flankGuard, {recoil: 0}, g.pounder]),
                    TYPE: "bullet",
                },
            },
        ],
    }, {canRepel: true, limitFov: true, fov: 3})
    Class.napoleonPrimordialDestroyerMegadriveTurretBullet = makeAuto('bullet', "Mega Auto-Bullet", {type: 'napoleonPrimordialDestroyerMegadriveTurretBulletTurret'})
    Class.napoleonPrimordialDestroyerMegadriveTurret = makeTurret({
        TURRETS: [
            {
                POSITION: [13, 0, 0, 0, 360, 1],
                TYPE: ["overdriveDeco", {MIRROR_MASTER_ANGLE: true}],
            },
        ],
        GUNS: [
            {
                POSITION: [10, 10, 0, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, {range: 0.0005, speed: 0.0005, maxSpeed: 0.0005, recoil: 0}]),
                    TYPE: "stupidBullet",
                    DRAW_FILL: false,
                    BORDERLESS: true,
                },
            },
            {
                POSITION: [21, 14, 1, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.destroyer]),
                    TYPE: "napoleonPrimordialDestroyerMegadriveTurretBullet",
                },
            },
        ],
    }, {limitFov: true, fov: 10, extraStats: [], label: "Destroyer-Megadrive"})
    Class.napoleonPrimordialUziSwarmerTurret = makeTurret({
        GUNS: [
            {
                POSITION: [10, 10, 0, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, {range: 0.0005, speed: 0.0005, maxSpeed: 0.0005, recoil: 0}]),
                    TYPE: "stupidBullet",
                    DRAW_FILL: false,
                    BORDERLESS: true,
                },
            },
            {
                POSITION: [14, 14, -1.2, 5, 0, 0, 0.5],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.destroyer, g.hive, {speed: 1.3, maxSpeed: 0.5, health: 1.3, range: 1.3}]),
                    TYPE: "protoHive",
                },
            },
            {
                POSITION: [10, 14, -1.2, 5, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.destroyer, g.hive, {speed: 1.3, maxSpeed: 0.5, health: 1.3, range: 1.3}]),
                    TYPE: "protoHive",
                },
            },
            {
                POSITION: [15, 12, 1, 5, 0, 0, 0.5],
            },
            {
                POSITION: [11, 12, 1, 5, 0, 0, 0],
            },
        ],
    }, {limitFov: true, fov: 10, extraStats: [], label: "Uzi-Swarmer"})
    Class.napoleonPrimordialCrossbowTurret = makeTurret({
        GUNS: [
            {
                POSITION: [10, 10, 0, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, {range: 0.0005, speed: 0.0005, maxSpeed: 0.0005, recoil: 0}]),
                    TYPE: "stupidBullet",
                    DRAW_FILL: false,
                    BORDERLESS: true,
                },
            },
            {
                POSITION: [12.5, 2.5, 1, 0, 3.5, 35, 1],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.rifle, g.crossbow, { recoil: 0.5 }]),
                    TYPE: "bullet"
                }
            },
            {
                POSITION: [12.5, 2.5, 1, 0, -3.5, -35, 1],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.rifle, g.crossbow, { recoil: 0.5 }]),
                    TYPE: "bullet"
                }
            },
            {
                POSITION: [15, 2.5, 1, 0, 3.5, 35/2, 2/3],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.rifle, g.crossbow, { recoil: 0.5 }]),
                    TYPE: "bullet"
                }
            },
            {
                POSITION: [15, 2.5, 1, 0, -3.5, -35/2, 2/3],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.rifle, g.crossbow, { speed: 0.7, maxSpeed: 0.7 }, { recoil: 0.5 }]),
                    TYPE: "bullet"
                }
            },
            {
                POSITION: [20, 3.5, 1, 0, 4, 0, 1/3],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.rifle, g.crossbow, { speed: 0.7, maxSpeed: 0.7 }, { recoil: 0.5 }]),
                    TYPE: "bullet"
                }
            },
            {
                POSITION: [20, 3.5, 1, 0, -4, 0, 1/3],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.rifle, g.crossbow, { speed: 0.7, maxSpeed: 0.7 }, { recoil: 0.5 }]),
                    TYPE: "bullet"
                }
            },
            {
                POSITION: [24, 7, 1, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.rifle, g.crossbow, { speed: 0.7, maxSpeed: 0.7 }, { recoil: 0.5 }]),
                    TYPE: "bullet"
                }
            }
        ],
    }, {limitFov: true, fov: 10, extraStats: [], label: "Crossbow"})
    let napoleonPrimordial = new LayeredBoss("napoleonPrimordial", "Napoleon", "CMCPrimordial", 13, "darkGrey", "baseTrapTurret", 4.5, 5.5);
    Class["napoleonPrimordial"].LABEL = "Rogue Primordial"
    napoleonPrimordial.addLayer({turret: {
            POSITION: [5.375, 9, 0, null, 160, 0],
            TYPE: "napoleonPrimordialMegaAttendantTurret",
        }
    }, true, null);
    napoleonPrimordial.addLayer({turret: {
            POSITION: [6.5, 9, 0, null, 160, 0],
            TYPE: "napoleonPrimordialDestroyerMegadriveTurret",
        }
    }, true, 3.35);
    napoleonPrimordial.addLayer({turret: {
            POSITION: [7, 9, 0, null, 160, 0],
            TYPE: "napoleonPrimordialUziSwarmerTurret",
        }
    }, true, 3.35);
    napoleonPrimordial.addLayer({turret: {
            POSITION: [8.5, 9, 0, null, 160, 0],
            TYPE: "napoleonPrimordialCrossbowTurret",
        }
    }, true, 3.35);

    Class.moarCelestials.UPGRADES_TIER_0.push("moarCelestialsPrimordials");
    Class.moarCelestialsPrimordials.UPGRADES_TIER_0 = ["moarCelestials", "paladinPrimordial", "freyjaPrimordial", "zaphkielPrimordial", "nyxPrimordial", "theiaPrimordial", "kronosPrimordial", "ragnarokPrimordial", "atlasPrimordial", "rheaPrimordial", "juliusPrimordial", "genghisPrimordial", "napoleonPrimordial"]
}

Class.menu_addons.UPGRADES_TIER_0.push("moarCelestials");

