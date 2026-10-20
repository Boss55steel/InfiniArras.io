const { combineStats, skillSet, makeAuto, addAura, LayeredBoss, makeHat, weaponArray, setTurretProjectileRecoil, makeMenu } = require('../facilitators.js');
const { smshskl, base } = require('../constants.js');
const g = require('../gunvals.js');
const {makeTurret} = require("../facilitators");

require('./canxAsMoarCelestials.js');
Class.evenMoarCelestials = makeMenu("Even Moar Celestials", "rainbow", 9)
Class.evenMoarCelestials.UPGRADES_TIER_0 = ["moarCelestials"]
Class.overdriveDeco = makeHat(4, {color: "grey"})

// Comment out the line below to enable this addon, uncomment it to disable this addon.
// return console.log("--- canxA's Even Moar Celestials addon is disabled. See line 9-10 to enable it ---");
let createPrimals = true;
let createLegionaries = true;
let addJanus = true;
if (createLegionaries === false) {
    addJanus = false
}
let createSolars = true;
let createAntediluvian  = true;

if (createPrimals === true) {
    Class.moarCelestialsPrimals = makeMenu("Primals", "rainbow", 3)
    Class.moarCelestialsPrimals.UPGRADES_TIER_0 = []
    Class.CMCPrimal = {
        PARENT: "miniboss",
        LABEL: "Primal",
        SKILL: [4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
        VALUE: 9e4,
        SHAPE: 3,
        SIZE: 7.25,
        CONTROLLERS: [["minion", {turnwiserange: 200}]],
        DANGER: 8,
        BODY: {
            FOV: 1,
            HEALTH: 100,
            SHIELD: 0.8,
            REGEN: base.REGEN * 0.1,
            SPEED: 2.5,
            DAMAGE: 1.5,
        },
    };
    let paladinPrimal = new LayeredBoss("paladinPrimal", "Paladin", "CMCPrimal", 3, "purple", "baseTrapTurret", 10, 5.5);
    Class["paladinPrimal"].TURRETS.push({
        POSITION: [9, 0, 0, 0, 360, 1],
        TYPE: ["paladinAstralPrimalSwarmerTurret", { INDEPENDENT: true, }],
    })
    let freyjaPrimal = new LayeredBoss("freyjaPrimal", "Freyja", "CMCPrimal", 3, "lightGreen", "baseTrapTurret", 10, 5.5);
    Class["freyjaPrimal"].TURRETS.push({
        POSITION: [9, 0, 0, 0, 360, 1],
        TYPE: ["freyjaAstralProtoBasicTurret", { INDEPENDENT: true, }],
    })
    let zaphkielPrimal = new LayeredBoss("zaphkielPrimal", "Zaphkiel", "CMCPrimal", 3, "orange", "baseTrapTurret", 10, 5.5);
    Class["zaphkielPrimal"].TURRETS.push({
        POSITION: [9, 0, 0, 0, 360, 1],
        TYPE: ["zaphkielAstralPounderTurret", { INDEPENDENT: true, }],
    })
    let nyxPrimal = new LayeredBoss("nyxPrimal", "Nyx", "CMCPrimal", 3, "pink", "baseTrapTurret", 10, 5.5);
    Class["nyxPrimal"].TURRETS.push({
        POSITION: [9, 0, 0, 0, 360, 1],
        TYPE: ["nyxAstralPrimalRocketeerTurret", { INDEPENDENT: true, }],
    })
    let theiaPrimal = new LayeredBoss("theiaPrimal", "Theia", "CMCPrimal", 3, "gold", "baseTrapTurret", 10, 5.5);
    Class["theiaPrimal"].TURRETS.push({
        POSITION: [9, 0, 0, 0, 360, 1],
        TYPE: ["theiaAstralPrimalTwisterTurret", { INDEPENDENT: true, }],
    })
    let kronosPrimal = new LayeredBoss("kronosPrimal", "Kronos", "CMCPrimal", 3, "veryLightGrey", "baseTrapTurret", 10, 5.5);
    Class["kronosPrimal"].TURRETS.push({
        POSITION: [9, 0, 0, 0, 360, 1],
        TYPE: ["kronosAstralPrimalPaverTurret", { INDEPENDENT: true, }],
    })
    let ragnarokPrimal = new LayeredBoss("ragnarokPrimal", "Odin", "CMCPrimal", 3, "hexagon", "baseTrapTurret", 10, 5.5);
    Class["ragnarokPrimal"].TURRETS.push({
        POSITION: [9, 0, 0, 0, 360, 1],
        TYPE: ["ragnarokTerrestrialPrimalInceptionTurret", { INDEPENDENT: true, }],
    })
    let atlasPrimal = new LayeredBoss("atlasPrimal", "Atlas", "CMCPrimal", 3, "lavender", "baseTrapTurret", 10, 5.5);
    Class["atlasPrimal"].TURRETS.push({
        POSITION: [9, 0, 0, 0, 360, 1],
        TYPE: ["atlasAstralPrimalNailgunTurret", { INDEPENDENT: true, }],
    })
    let rheaPrimal = new LayeredBoss("rheaPrimal", "Rhea", "CMCPrimal", 3, "yellow", "baseTrapTurret", 10, 5.5);
    Class["rheaPrimal"].TURRETS.push({
        POSITION: [9, 0, 0, 0, 360, 1],
        TYPE: ["rheaAstralProtoChiselTurret", { INDEPENDENT: true, }],
    })
    let juliusPrimal = new LayeredBoss("juliusPrimal", "Julius", "CMCPrimal", 3, "darkGrey", "baseTrapTurret", 10, 5.5);
    Class["juliusPrimal"].LABEL = "Rogue Primal"
    Class["juliusPrimal"].TURRETS.push({
        POSITION: [9, 0, 0, 0, 360, 1],
        TYPE: ["juliusAstralBasicTurret", { INDEPENDENT: true, }],
    })

    let genghisPrimal = new LayeredBoss("genghisPrimal", "Genghis", "CMCPrimal", 3, "darkGrey", "baseTrapTurret", 10, 5.5);
    Class["genghisPrimal"].LABEL = "Rogue Primal"
    Class["genghisPrimal"].TURRETS.push({
        POSITION: [9, 0, 0, 0, 360, 1],
        TYPE: ["genghisAstralProtoBasicTurret", { INDEPENDENT: true, }],
    })
    let napoleonPrimal = new LayeredBoss("napoleonPrimal", "Napoleon", "CMCPrimal", 3, "darkGrey", "baseTrapTurret", 10, 5.5);
    Class["napoleonPrimal"].LABEL = "Rogue Primal"
    Class["napoleonPrimal"].TURRETS.push({
        POSITION: [9, 0, 0, 0, 360, 1],
        TYPE: ["napoleonAstralProtoBasicDriveTurret", { INDEPENDENT: true, }],
    })
    Class.evenMoarCelestials.UPGRADES_TIER_0.push("moarCelestialsPrimals");
    Class.moarCelestialsPrimals.UPGRADES_TIER_0 = ["evenMoarCelestials", "paladinPrimal", "freyjaPrimal", "zaphkielPrimal", "nyxPrimal", "theiaPrimal", "kronosPrimal", "ragnarokPrimal", "atlasPrimal", "rheaPrimal", "juliusPrimal", "genghisPrimal", "napoleonPrimal"]
}
if (createLegionaries === true) {
    Class.moarCelestialsLegionaries = makeMenu("Legionaries", "rainbow", 3)
    Class.moarCelestialsLegionaries.UPGRADES_TIER_0 = []
    Class.CMCLegionary = {
        PARENT: "miniboss",
        LABEL: "Legionary",
        VALUE: 5e6,
        SHAPE: 3,
        SIZE: 75,
        CONTROLLERS: [["minion", {turnwiserange: 360}]],
        DANGER: 8,
        BODY: {
            FOV: 1.5,
            HEALTH: 2000,
            REGEN: 0.5 * base.REGEN,
            SPEED: 0.1 * base.SPEED,
            DAMAGE: 5 * base.DAMAGE,
        },
        GUNS: [
            ...weaponArray([
                {
                    POSITION: [14.5, 13, 1, 0, 0, 0, 0],
                }, {
                    POSITION: [3, 13, 1.7, 14.5, 0, 0, 0],
                    PROPERTIES: {
                        SHOOT_SETTINGS: combineStats([g.trap, g.setTrap, g.pounder, { reload: 2, speed: 2, size: 0.65, maxSpeed: 2, range: 0.65 }]),
                        TYPE: "legionaryPillbox",
                        STAT_CALCULATOR: "trap",
                    },
                },
            ], 3),
            ...weaponArray({
                POSITION: [5, 12, 1.6, -11, 0, 0, 0],
            }, 3),
        ],
    };
    Class.CMCLegionaryTop = {
        PARENT: "elite",
        AI: { STRAFE: false, NO_LEAD: false },
        FACING_TYPE: ["spin", { speed: -0.05}],
        INDEPENDENT: true,
        TYPE: 'layer',
        COLOR: -1,
        GUNS: [],
        TURRETS: [],
    }
    Class.paladinLegionaryCruiserTurret = makeTurret({
        GUNS: [
            {
                POSITION: [8, 7.5, 0.6, 6, 4, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.swarm]),
                    TYPE: "swarm",
                    STAT_CALCULATOR: "swarm",
                    AUTOFIRE: true,
                },
            },
            {
                POSITION: [8, 7.5, 0.6, 6, -4, 0, 0.5],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.swarm]),
                    TYPE: "swarm",
                    STAT_CALCULATOR: "swarm",
                    AUTOFIRE: true,
                },
            },
        ],
    }, {limitFov: true, fov: 10, extraStats: [], label: "Cruiser"})
    Class.paladinLegionaryTop = {
        PARENT: "CMCLegionaryTop",
        GUNS: weaponArray([
            {
                POSITION: [3.8, 14, 1.2, 8, 0, 60, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.drone, g.summoner, g.destroyer, {health: 2, damage: 1.4, resist: 1.8, density: 2}]),
                    TYPE: ["demonchip", {INDEPENDENT: true}],
                    AUTOFIRE: true,
                    SYNCS_SKILLS: true,
                    STAT_CALCULATOR: "drone",
                    WAIT_TO_CYCLE: true,
                    MAX_CHILDREN: 4,
                },
            },
        ], 3),
        TURRETS: weaponArray({
            POSITION: [9.5, 10, 0, 0, 190, 0],
            TYPE: ["paladinLegionaryCruiserTurret", {GUN_STAT_SCALE: {damage: 1.4, health: 1.1, speed: 1.2, maxSpeed: 1.2, resist: 1.1, range: 1.3}}],
        }, 3),
    }
    Class.paladinLegionaryMyriadTurret = {
        PARENT: "genericTank",
        DANGER: 7,
        LABEL: "Myriad",
        GUNS: [
            {
                POSITION: [15, 16.7, -1.2, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.pounder, g.destroyer, g.hive]),
                    TYPE: "hive",
                },
            },
            {
                POSITION: [15, 15, 1, 0, 0, 0, 0],
            },
        ],
    }
    Class.paladinLegionary = {
        PARENT: "CMCLegionary",
        NAME: "Paladin",
        UPGRADE_LABEL: "Paladin",
        COLOR: "purple",
        UPGRADE_COLOR: "purple",
        TURRETS: [
            {
                POSITION: [12, 0, 0, 0, 360, 1],
                TYPE: "paladinLegionaryTop",
            },
            ...weaponArray({
                POSITION: [13, 8.5, 0, 60, 180, 0],
                TYPE: [ "paladinLegionaryMyriadTurret", { GUN_STAT_SCALE: {speed: 2, health: 1.5, damage: 1.4, maxSpeed: 0.175}, COLOR: -1 } ],
            }, 3),
        ],
    }
    Class.freyjaLegionaryMachineGunnerTurret = makeTurret({
        GUNS: [
            {
                POSITION: [14, 3, 4, -3, 5, 0, 0.6],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.gunner, g.machineGunner]),
                    TYPE: "bullet",
                },
            },
            {
                POSITION: [14, 3, 4, -3, -5, 0, 0.8],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.gunner, g.machineGunner]),
                    TYPE: "bullet",
                },
            },
            {
                POSITION: [14, 3, 4, 0, 2.5, 0, 0.4],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.gunner, g.machineGunner]),
                    TYPE: "bullet",
                },
            },
            {
                POSITION: [14, 3, 4, 0, -2.5, 0, 0.2],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.gunner, g.machineGunner]),
                    TYPE: "bullet",
                },
            },
            {
                POSITION: [14, 3, 4, 3, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.gunner, g.machineGunner]),
                    TYPE: "bullet",
                },
            },
        ],
    }, {limitFov: true, fov: 10, extraStats: [], label: "Machine Gunner"})
    Class.freyjaLegionaryTop = {
        PARENT: "CMCLegionaryTop",
        GUNS: weaponArray([
            {
                POSITION: [4, 9.5, 0.7, 7, 5, 60, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.swarm, g.pounder, { speed: 2, maxSpeed: 1.7, size: 0.6, range: 2.8}]),
                    TYPE: [ "swarm", { INDEPENDENT: true } ],
                    STAT_CALCULATOR: "swarm",
                    AUTOFIRE: true,
                },
            },
            {
                POSITION: [4, 9.5, 0.7, 7, -5, 60, 0.5],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.swarm, g.pounder, { speed: 2, maxSpeed: 1.7, size: 0.6, range: 2.8}]),
                    TYPE: [ "swarm", { INDEPENDENT: true } ],
                    STAT_CALCULATOR: "swarm",
                    AUTOFIRE: true,
                },
            },
        ], 3),
        TURRETS: weaponArray({
            POSITION: [9.5, 10, 0, 0, 190, 0],
            TYPE: ["freyjaLegionaryMachineGunnerTurret", {GUN_STAT_SCALE: {damage: 1.4, health: 1.1, speed: 1.2, maxSpeed: 1.2, resist: 1.1, range: 1.3}}],
        }, 3),
    }
    Class.freyjaLegionaryConveyorTurret = {
        PARENT: "genericTank",
        DANGER: 7,
        LABEL: "Conveyor",
        GUNS: [
            {
                POSITION: [10, 3.5, 0.6, 0, 7.25, 0, 0.5],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.swarm, g.battleship, g.carrier]),
                    TYPE: "swarm",
                    STAT_CALCULATOR: "swarm",
                }
            },
            {
                POSITION: [10, 3.5, 0.6, 0, -7.25, 0, 0.75],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.swarm, g.battleship, g.carrier]),
                    TYPE: "swarm",
                    STAT_CALCULATOR: "swarm",
                }
            },
            {
                POSITION: [14, 3.5, 0.6, 0, 3.75, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.swarm, g.battleship, g.carrier]),
                    TYPE: "swarm",
                    STAT_CALCULATOR: "swarm",
                }
            },
            {
                POSITION: [14, 3.5, 0.6, 0, -3.75, 0, 0.25],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.swarm, g.battleship, g.carrier]),
                    TYPE: "swarm",
                    STAT_CALCULATOR: "swarm",
                }
            }
        ],
    }
    Class.freyjaLegionary = {
        PARENT: "CMCLegionary",
        NAME: "Freyja",
        UPGRADE_LABEL: "Freyja",
        COLOR: "lightGreen",
        UPGRADE_COLOR: "lightGreen",
        TURRETS: [
            {
                POSITION: [12, 0, 0, 0, 360, 1],
                TYPE: "freyjaLegionaryTop",
            },
            ...weaponArray({
                POSITION: [13, 8.5, 0, 60, 180, 0],
                TYPE: [ "freyjaLegionaryConveyorTurret", { GUN_STAT_SCALE: {speed: 1.3, health: 1.5, damage: 1.4, resist: 1.2}, COLOR: -1 } ],
            }, 3),
        ],
    }
    Class.zaphkielLegionaryDestroyerTurret = makeTurret({
        GUNS: [
            {
                POSITION: [21, 14, 1, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.destroyer]),
                    TYPE: "bullet",
                },
            },
        ],
    }, {limitFov: true, fov: 10, extraStats: [], label: "Destroyer"})
    Class.zaphkielLegionaryTop = {
        PARENT: "CMCLegionaryTop",
        GUNS: weaponArray([
            {
                POSITION: [3.8, 14, 1.2, 8, 0, 60, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.drone, g.summoner, g.destroyer, {health: 1.4, damage: 1.4, resist: 1.2, density: 1.8, maxSpeed: 1.325}]),
                    TYPE: ["dorito", {INDEPENDENT: true}],
                    AUTOFIRE: true,
                    SYNCS_SKILLS: true,
                    STAT_CALCULATOR: "drone",
                    WAIT_TO_CYCLE: true,
                    MAX_CHILDREN: 5,
                },
            },
        ], 3),
        TURRETS: weaponArray({
            POSITION: [9.5, 10, 0, 0, 190, 0],
            TYPE: ["zaphkielLegionaryDestroyerTurret", {GUN_STAT_SCALE: {damage: 1.4, health: 1.1, speed: 1.2, maxSpeed: 1.2, resist: 1.1, range: 1.3}}],
        }, 3),
    }
    Class.zaphkielLegionarySkimmerTurret = {
        PARENT: "genericTank",
        DANGER: 7,
        LABEL: "Skimmer",
        GUNS: [
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
    }
    Class.zaphkielLegionary = {
        PARENT: "CMCLegionary",
        NAME: "Zaphkiel",
        UPGRADE_LABEL: "Zaphkiel",
        COLOR: "orange",
        UPGRADE_COLOR: "orange",
        TURRETS: [
            {
                POSITION: [12, 0, 0, 0, 360, 1],
                TYPE: "zaphkielLegionaryTop",
            },
            ...weaponArray({
                POSITION: [13, 8.5, 0, 60, 180, 0],
                TYPE: [ "zaphkielLegionarySkimmerTurret", { GUN_STAT_SCALE: {speed: 1.3, health: 1.5, damage: 1.4, resist: 1.2}, COLOR: -1 } ],
            }, 3),
        ],
    }
    Class.nyxLegionaryMarksmanTurret = makeTurret({
        GUNS: [
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
                POSITION: [24, 8.5, 1, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.sniper, { pen: 2 }]),
                    TYPE: "bullet"
                }
            }
        ],
    }, {limitFov: true, fov: 10, extraStats: [], label: "Fork"})
    Class.nyxLegionaryTop = {
        PARENT: "CMCLegionaryTop",
        GUNS: weaponArray([
            {
                POSITION: [3.8, 12, -1.4, 8, 0, 60, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.spawner, { size: 0.7, maxSpeed: 0.85, damage: 0.8 }]),
                    TYPE: ["minion", {INDEPENDENT: true,}],
                    AUTOFIRE: true,
                    SYNCS_SKILLS: true,
                    MAX_CHILDREN: 5,
                },
            },
        ], 3),
        TURRETS: weaponArray({
            POSITION: [9.5, 10, 0, 0, 190, 0],
            TYPE: ["nyxLegionaryMarksmanTurret", {GUN_STAT_SCALE: {damage: 1.4, health: 1.1, speed: 1.2, maxSpeed: 1.2, resist: 1.1, range: 1.3}}],
        }, 3),
    }
    Class.nyxLegionaryLeviathanTurret = {
        PARENT: "genericTank",
        DANGER: 7,
        LABEL: "Leviathan",
        GUNS: [
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
    }
    Class.nyxLegionary = {
        PARENT: "CMCLegionary",
        NAME: "Nyx",
        UPGRADE_LABEL: "Nyx",
        COLOR: "pink",
        UPGRADE_COLOR: "pink",
        TURRETS: [
            {
                POSITION: [12, 0, 0, 0, 360, 1],
                TYPE: "nyxLegionaryTop",
            },
            ...weaponArray({
                POSITION: [13, 8.5, 0, 60, 180, 0],
                TYPE: [ "nyxLegionaryLeviathanTurret", { GUN_STAT_SCALE: {speed: 1.3, health: 1.5, damage: 1.4, resist: 1.2}, COLOR: -1 } ],
            }, 3),
        ],
    }
    Class.theiaLegionaryBlasterTurret = makeTurret({
        GUNS: [
            {
                POSITION: [12.5, 12.5, 1.4, 8, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.pounder]),
                    TYPE: "bullet"
                }
            }
        ],
    }, {limitFov: true, fov: 10, extraStats: [], label: "Blaster"})
    Class.theiaLegionaryTop = {
        PARENT: "CMCLegionaryTop",
        GUNS: weaponArray([
            {
                POSITION: [3.8, 14, 1.2, 8, 0, 60, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.drone, g.summoner, g.destroyer, {health: 1.4, damage: 1.4, resist: 1.2, density: 1.8, maxSpeed: 1.325}]),
                    TYPE: ["summonerDrone", {INDEPENDENT: true}],
                    AUTOFIRE: true,
                    SYNCS_SKILLS: true,
                    STAT_CALCULATOR: "drone",
                    WAIT_TO_CYCLE: true,
                    MAX_CHILDREN: 7,
                },
            },
        ], 3),
        TURRETS: weaponArray({
            POSITION: [9.5, 10, 0, 0, 190, 0],
            TYPE: ["theiaLegionaryBlasterTurret", {GUN_STAT_SCALE: {damage: 1.4, health: 1.1, speed: 1.2, maxSpeed: 1.2, resist: 1.1, range: 1.3}}],
        }, 3),
    }
    Class.theiaLegionaryHyperTwisterTurret = {
        PARENT: "genericTank",
        DANGER: 7,
        LABEL: "Hyper-Twister",
        GUNS: [
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
    }
    Class.theiaLegionary = {
        PARENT: "CMCLegionary",
        NAME: "Theia",
        UPGRADE_LABEL: "Theia",
        COLOR: "gold",
        UPGRADE_COLOR: "gold",
        TURRETS: [
            {
                POSITION: [12, 0, 0, 0, 360, 1],
                TYPE: "theiaLegionaryTop",
            },
            ...weaponArray({
                POSITION: [13, 8.5, 0, 60, 180, 0],
                TYPE: [ "theiaLegionaryHyperTwisterTurret", { GUN_STAT_SCALE: {speed: 1.3, health: 1.5, damage: 1.4, resist: 1.2}, COLOR: -1 } ],
            }, 3),
        ],
    }
    Class.kronosLegionaryTripletTurret = makeTurret({
        GUNS: [
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
    Class.kronosLegionaryTop = {
        PARENT: "CMCLegionaryTop",
        GUNS: weaponArray([
            {
                POSITION: [4, 9.5, 0.7, 7, 5, 60, 0.5],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.swarm, g.battleship, g.carrier]),
                    TYPE: [ "swarm", { INDEPENDENT: true } ],
                    STAT_CALCULATOR: "swarm",
                    AUTOFIRE: true,
                },
            },
            {
                POSITION: [4, 9.5, 0.7, 7, -5, 60, 0.5],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.swarm, g.battleship, g.carrier]),
                    TYPE: [ "swarm", { INDEPENDENT: true } ],
                    STAT_CALCULATOR: "swarm",
                    AUTOFIRE: true,
                },
            },
            {
                POSITION: [6, 9.5, 0.7, 7, 0, 60, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.swarm, g.battleship, g.carrier]),
                    TYPE: [ "swarm", { INDEPENDENT: true } ],
                    STAT_CALCULATOR: "swarm",
                    AUTOFIRE: true,
                },
            },
        ], 3),
        TURRETS: weaponArray({
            POSITION: [9.5, 10, 0, 0, 190, 0],
            TYPE: ["kronosLegionaryTripletTurret", {GUN_STAT_SCALE: {damage: 1.4, health: 1.1, speed: 1.2, maxSpeed: 1.2, resist: 1.1, range: 1.3}}],
        }, 3),
    }
    Class.kronosLegionaryHyperPaverTurretMissile = {
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
    Class.kronosLegionaryHyperPaverTurret = {
        PARENT: "genericTank",
        DANGER: 7,
        LABEL: "Hyper-Paver",
        GUNS: [
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
                    TYPE: "kronosLegionaryHyperPaverTurretMissile",
                },
            },
            {
                POSITION: [9, 4, 1.4, 9, 0, 0, 0],
            },
            {
                POSITION: [6, 6, 1.4, 9, 0, 0, 0],
            },
        ],
    }
    Class.kronosLegionary = {
        PARENT: "CMCLegionary",
        NAME: "Kronos",
        UPGRADE_LABEL: "Kronos",
        COLOR: "veryLightGrey",
        UPGRADE_COLOR: "veryLightGrey",
        TURRETS: [
            {
                POSITION: [12, 0, 0, 0, 360, 1],
                TYPE: "kronosLegionaryTop",
            },
            ...weaponArray({
                POSITION: [13, 8.5, 0, 60, 180, 0],
                TYPE: [ "kronosLegionaryHyperPaverTurret", { GUN_STAT_SCALE: {speed: 1.3, health: 1.5, damage: 1.4, resist: 1.2}, COLOR: -1 } ],
            }, 3),
        ],
    }
    Class.ragnarokLegionaryCorderTurret = makeTurret({
        GUNS: [
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
            {
                POSITION: [21, 10, 1, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.triplet]),
                    TYPE: "bullet"
                }
            }
        ],
    }, {limitFov: true, fov: 10, extraStats: [], label: "Corder"})
    Class.ragnarokLegionaryTop = {
        PARENT: "CMCLegionaryTop",
        GUNS: weaponArray([
            {
                POSITION: [3.8, 12, -1.4, 8, 0, 60, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.drone, g.summoner, g.pounder, g.destroyer, {speed: 1.25, maxSpeed: 1.25}]),
                    TYPE: ["realchip", {INDEPENDENT: true, DRAW_HEALTH: true, COLOR: 'hexagon'}],
                    AUTOFIRE: true,
                    SYNCS_SKILLS: true,
                    MAX_CHILDREN: 4,
                },
            },
        ], 3),
        TURRETS: weaponArray({
            POSITION: [9.5, 10, 0, 0, 190, 0],
            TYPE: ["ragnarokLegionaryCorderTurret", {GUN_STAT_SCALE: {damage: 1.4, health: 1.1, speed: 1.2, maxSpeed: 1.2, resist: 1.1, range: 1.3}}],
        }, 3),
    }
    Class.ragnarokLegionaryHyperInceptionTurretMissile = {
        PARENT: "minimissile",
        TURRETS: [
            {
                POSITION: [14, 0, 0, 0, 360, 1],
                TYPE: "auto4gun",
            },
        ],
    }
    Class.ragnarokLegionaryHyperInceptionTurret = {
        PARENT: "genericTank",
        DANGER: 7,
        LABEL: "Hyper-Inception",
        GUNS: [
            {
                POSITION: [10, 9, 1, 9, 0, 0, 0],
            },
            {
                POSITION: [17, 13, 1, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.artillery, g.artillery]),
                    TYPE: "ragnarokLegionaryHyperInceptionTurretMissile",
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
    }
    Class.ragnarokLegionary = {
        PARENT: "CMCLegionary",
        NAME: "Odin",
        UPGRADE_LABEL: "Odin",
        COLOR: "hexagon",
        UPGRADE_COLOR: "hexagon",
        TURRETS: [
            {
                POSITION: [12, 0, 0, 0, 360, 1],
                TYPE: "ragnarokLegionaryTop",
            },
            ...weaponArray({
                POSITION: [13, 8.5, 0, 60, 180, 0],
                TYPE: [ "ragnarokLegionaryHyperInceptionTurret", { GUN_STAT_SCALE: {speed: 1.3, health: 1.5, damage: 1.4, resist: 1.2}, COLOR: -1 } ],
            }, 3),
        ],
    }
    Class.atlasLegionaryRangerTurret = makeTurret({
        GUNS: [
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
    Class.atlasLegionaryTop = {
        PARENT: "CMCLegionaryTop",
        GUNS: weaponArray([
            {
                POSITION: [4, 9.5, 0.4, 7, 5, 60, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.swarm, g.pounder, { speed: 1, maxSpeed: 1.7, size: 0.4, range: 2.8, reload: 0.6, damage: 0.8}]),
                    TYPE: [ "bee", { INDEPENDENT: true } ],
                    STAT_CALCULATOR: "swarm",
                    AUTOFIRE: true,
                },
            },
            {
                POSITION: [4, 9.5, 0.4, 7, -5, 60, 0.5],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.swarm, g.pounder, { speed: 1, maxSpeed: 1.7, size: 0.4, range: 2.8, reload: 0.6, damage: 0.8}]),
                    TYPE: [ "bee", { INDEPENDENT: true } ],
                    STAT_CALCULATOR: "swarm",
                    AUTOFIRE: true,
                },
            },
        ], 3),
        TURRETS: weaponArray({
            POSITION: [9.5, 10, 0, 0, 190, 0],
            TYPE: ["atlasLegionaryRangerTurret", {GUN_STAT_SCALE: {damage: 1.4, health: 1.1, speed: 1.2, maxSpeed: 1.2, resist: 1.1, range: 1.3}}],
        }, 3),
    }
    Class.atlasLegionaryStaplerTurret = {
        PARENT: "genericTank",
        DANGER: 7,
        LABEL: "Stapler",
        GUNS: [
            {
                POSITION: [19, 5, 1, 0, -4.35, 0, 0.25],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.power, g.twin, g.nailgun, g.pounder]),
                    TYPE: "bullet",
                },
            },
            {
                POSITION: [19, 5, 1, 0, 4.35, 0, 0.75],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.power, g.twin, g.nailgun, g.pounder]),
                    TYPE: "bullet",
                },
            },
            {
                POSITION: [20, 5, 1, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.power, g.twin, g.nailgun, g.pounder]),
                    TYPE: "bullet",
                },
            },
            {
                POSITION: [7, 14, -1.2, 5, 0, 0, 0],
            },
        ],
    }
    Class.atlasLegionary = {
        PARENT: "CMCLegionary",
        NAME: "Atlas",
        UPGRADE_LABEL: "Atlas",
        COLOR: "lavender",
        UPGRADE_COLOR: "lavender",
        TURRETS: [
            {
                POSITION: [12, 0, 0, 0, 360, 1],
                TYPE: "atlasLegionaryTop",
            },
            ...weaponArray({
                POSITION: [13, 8.5, 0, 60, 180, 0],
                TYPE: [ "atlasLegionaryStaplerTurret", { GUN_STAT_SCALE: {speed: 1.3, health: 1.5, damage: 1.4, resist: 1.2}, COLOR: -1 } ],
            }, 3),
        ],
    }
    Class.rheaLegionaryChiselTurret = makeTurret({
        GUNS: [
            {
                POSITION: [37, 5, 1, 0, 0, 0, 0],
            },
            {
                POSITION: [7, 5, -3, 6, 0, 0, 0],
            },
        ],
        TURRETS: [
            {
                POSITION: [5, 37, 0, 0, 360, 1],
                TYPE: [ "auto4gun", { GUN_STAT_SCALE: g.flankGuard, INDEPENDENT: false, HAS_NO_RECOIL: true } ],
            },
            {
                POSITION: [5, 30, 0, 0, 360, 1],
                TYPE: [ "auto4gun", { GUN_STAT_SCALE: g.flankGuard, INDEPENDENT: false, HAS_NO_RECOIL: true } ],
            },
            {
                POSITION: [5, 23, 0, 0, 360, 1],
                TYPE: [ "auto4gun", { GUN_STAT_SCALE: g.flankGuard, INDEPENDENT: false, HAS_NO_RECOIL: true } ],
            },
            {
                POSITION: [5, 16, 0, 0, 360, 1],
                TYPE: [ "auto4gun", { GUN_STAT_SCALE: g.flankGuard, INDEPENDENT: false, HAS_NO_RECOIL: true } ],
            },
        ],
    }, {limitFov: true, fov: 10, extraStats: [], label: "Chisel"})
    Class.rheaLegionaryTopHangar1 = {
        PARENT: "genericTank",
        LABEL: "Hangar",
        SHAPE: 'M 0 0',
        MIRROR_MASTER_ANGLE: true,
        GUNS: weaponArray({
            POSITION: [7, 12, 0.6, 7, 0, 90, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.swarm, {damage: 0.5, health: 0.5, speed: 1.5, maxSpeed: 1.5}]),
                TYPE: "autoswarm",
                STAT_CALCULATOR: "swarm",
                AUTOFIRE: true
            },
        }, 2)
    }
    Class.rheaLegionaryTopHangar2 = {
        PARENT: "genericTank",
        LABEL: "Hangar",
        SHAPE: 'M 0 0',
        MIRROR_MASTER_ANGLE: true,
        GUNS: weaponArray({
            POSITION: [7, 12, 0.6, 7, 0, 90, 1/3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.swarm, {damage: 0.5, health: 0.5, speed: 1.5, maxSpeed: 1.5}]),
                TYPE: "autoswarm",
                STAT_CALCULATOR: "swarm",
                AUTOFIRE: true
            },
        }, 2)
    }
    Class.rheaLegionaryTopHangar3 = {
        PARENT: "genericTank",
        LABEL: "Hangar",
        SHAPE: 'M 0 0',
        MIRROR_MASTER_ANGLE: true,
        GUNS: weaponArray({
            POSITION: [7, 12, 0.6, 7, 0, 90, 2/3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.swarm, {damage: 0.5, health: 0.5, speed: 1.5, maxSpeed: 1.5}]),
                TYPE: "autoswarm",
                STAT_CALCULATOR: "swarm",
                AUTOFIRE: true
            },
        }, 2)
    }
    Class.rheaLegionaryTop = {
        PARENT: "CMCLegionaryTop",
        GUNS: weaponArray([
            {
                POSITION: [37, 6.5, 1, 0, 0, 60, 0],
            },
            {
                POSITION: [7, 6.5, -2.2, 6, 0, 60, 0],
            },
        ], 3),
        TURRETS: weaponArray([
            {
                POSITION: [9.5, 10, 0, 0, 190, 0],
                TYPE: ["rheaLegionaryChiselTurret", {GUN_STAT_SCALE: {damage: 1.4, health: 1.1, speed: 1.2, maxSpeed: 1.2, resist: 1.1, range: 1.3}}],
            },
            {
                POSITION: [8, 33, 0, 60, 360, 0],
                TYPE: [ "rheaLegionaryTopHangar1", { GUN_STAT_SCALE: g.flankGuard, INDEPENDENT: false, HAS_NO_RECOIL: true } ],
            },
            {
                POSITION: [8, 25, 0, 60, 360, 0],
                TYPE: [ "rheaLegionaryTopHangar2", { GUN_STAT_SCALE: g.flankGuard, INDEPENDENT: false, HAS_NO_RECOIL: true } ],
            },
            {
                POSITION: [8, 16, 0, 60, 360, 0],
                TYPE: [ "rheaLegionaryTopHangar3", { GUN_STAT_SCALE: g.flankGuard, INDEPENDENT: false, HAS_NO_RECOIL: true } ],
            },
        ], 3),
    }
    Class.rheaLegionaryCrankTurret = {
        PARENT: "genericTank",
        DANGER: 7,
        LABEL: "Crank",
        GUNS: [
            {
                POSITION: [37, 6.5, 1, 0, 0, 0, 0],
            },
            {
                POSITION: [7, 6.5, -2, 6, 0, 0, 0],
            },
        ],
        TURRETS: [
            {
                POSITION: [6.5, 37, 0, 0, 360, 1],
                TYPE: [ "megaAutoTankGun", { GUN_STAT_SCALE: g.flankGuard, INDEPENDENT: true, HAS_NO_RECOIL: true } ],
            },
            {
                POSITION: [6.5, 26.75, 0, 0, 360, 1],
                TYPE: [ "megaAutoTankGun", { GUN_STAT_SCALE: g.flankGuard, INDEPENDENT: false, HAS_NO_RECOIL: true } ],
            },
            {
                POSITION: [6.5, 16.5, 0, 0, 360, 1],
                TYPE: [ "megaAutoTankGun", { GUN_STAT_SCALE: g.flankGuard, INDEPENDENT: true, HAS_NO_RECOIL: true } ],
            },
        ],
    }
    Class.rheaLegionary = {
        PARENT: "CMCLegionary",
        NAME: "Rhea",
        UPGRADE_LABEL: "Rhea",
        COLOR: "yellow",
        UPGRADE_COLOR: "yellow",
        TURRETS: [
            {
                POSITION: [12, 0, 0, 0, 360, 1],
                TYPE: "rheaLegionaryTop",
            },
            ...weaponArray({
                POSITION: [13, 8.5, 0, 60, 180, 0],
                TYPE: [ "rheaLegionaryCrankTurret", { GUN_STAT_SCALE: {speed: 1.3, health: 1.5, damage: 1.4, resist: 1.2}, COLOR: -1 } ],
            }, 3),
        ],
    }
    Class.juliusLegionaryInceptionTurretMissile = {
        PARENT: "minimissile",
        HAS_NO_RECOIL: true,
        TURRETS: [
            {
                POSITION: [14, 0, 0, 0, 360, 1],
                TYPE: ["autoTankGun", {HAS_NO_RECOIL: true}],
            },
        ],
    }
    Class.juliusLegionaryInceptionTurret = makeTurret({
        GUNS: [
            {
                POSITION: [10, 9, 1, 9, 0, 0, 0],
            },
            {
                POSITION: [17, 13, 1, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.artillery, g.artillery]),
                    TYPE: "juliusLegionaryInceptionTurretMissile",
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
    Class.juliusLegionaryTop = {
        PARENT: "CMCLegionaryTop",
        GUNS: weaponArray([
            {
                POSITION: [14, 6, 1, 0, 5, 60, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.pounder, {reload: 1.5, maxSpeed: 1.25, range: 1.5}]),
                    TYPE: "homingBullet",
                    AUTOFIRE: true,
                }
            },
            {
                POSITION: [4, 7.6, 0.8, 9, 5, 60, 0],
            },
            {
                POSITION: [14, 6, 1, 0, -5, 60, 0.5],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.pounder, {reload: 1.5, maxSpeed: 1.25, range: 1.5}]),
                    TYPE: "homingBullet",
                    AUTOFIRE: true,
                }
            },
            {
                POSITION: [4, 7.6, 0.8, 9, -5, 60, 0.5],
            },
        ], 3),
        TURRETS: weaponArray({
            POSITION: [9.5, 10, 0, 0, 190, 0],
            TYPE: ["juliusLegionaryInceptionTurret", {GUN_STAT_SCALE: {damage: 1.4, health: 1.1, speed: 1.2, maxSpeed: 1.2, resist: 1.1, range: 1.3}}],
        }, 3),
    }
    Class.juliusLegionarySkimmerTurret = {
        PARENT: "genericTank",
        DANGER: 7,
        LABEL: "Skimmer",
        GUNS: [
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
    }
    Class.juliusLegionary = {
        PARENT: "CMCLegionary",
        NAME: "Julius",
        UPGRADE_LABEL: "Julius",
        LABEL: "Rogue Legionary",
        COLOR: "darkGrey",
        UPGRADE_COLOR: "darkGrey",
        TURRETS: [
            {
                POSITION: [12, 0, 0, 0, 360, 1],
                TYPE: "juliusLegionaryTop",
            },
            ...weaponArray({
                POSITION: [13, 8.5, 0, 60, 180, 0],
                TYPE: [ "juliusLegionarySkimmerTurret", { GUN_STAT_SCALE: {speed: 1.3, health: 1.5, damage: 1.4, resist: 1.2}, COLOR: -1 } ],
            }, 3),
        ],
    }
    Class.genghisLegionaryGunnerTurret = makeTurret({
        GUNS: [
            {
                POSITION: [12, 3.5, 1, 0, 6, 0, 2/3],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.gunner, { speed: 1.2 }]),
                    TYPE: "bullet"
                }
            },
            {
                POSITION: [12, 3.5, 1, 0, -6, 0, 1/3],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.gunner, { speed: 1.2 }]),
                    TYPE: "bullet"
                }
            },
            {
                POSITION: [16, 3.5, 1, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.gunner, { speed: 1.2 }]),
                    TYPE: "bullet"
                }
            }
        ],
    }, {limitFov: true, fov: 10, extraStats: [], label: "Gunner"})
    Class.genghisLegionaryTop = {
        PARENT: "CMCLegionaryTop",
        GUNS: weaponArray([
            {
                POSITION: [5, 8, 1, 10, 0, 60, 0.5],
            },
            {
                POSITION: [1, 9.5, 1.1, 15, 0, 60, 0.5],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.swarm, g.babyfactory, { reload: 0.8, spray: 4, speed: 3 }]),
                    TYPE: ["tinyMinion", {INDEPENDENT: true}],
                    STAT_CALCULATOR: "drone",
                    SYNCS_SKILLS: true,
                },
            },
            {
                POSITION: [9, 19, 0.5, 3, 0, 60, 0.5],
            },
        ], 3),
        TURRETS: weaponArray({
            POSITION: [9.5, 10, 0, 0, 190, 0],
            TYPE: ["genghisLegionaryGunnerTurret", {GUN_STAT_SCALE: {damage: 1.4, health: 1.1, speed: 1.2, maxSpeed: 1.2, resist: 1.1, range: 1.3}}],
        }, 3),
    }
    Class.genghisLegionaryBentGunnerTurret = {
        PARENT: "genericTank",
        DANGER: 7,
        LABEL: "Bent Gunner",
        GUNS: [
            {
                POSITION: [12, 3.5, 1, 0, 8, 30, 0.5+(2/3)],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.gunner, { speed: 1.2 }]),
                    TYPE: "bullet"
                }
            },
            {
                POSITION: [12, 3.5, 1, 0, -8, -30, 2/3],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.gunner, { speed: 1.2 }]),
                    TYPE: "bullet"
                }
            },
            {
                POSITION: [14, 3.5, 1, 0, 3, 30, 0.5+(1/3)],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.gunner, { speed: 1.2 }]),
                    TYPE: "bullet"
                }
            },
            {
                POSITION: [14, 3.5, 1, 0, -3, -30, 1/3],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.gunner, { speed: 1.2 }]),
                    TYPE: "bullet"
                }
            },
            {
                POSITION: [16, 3.5, 1, 0, 3.75, 0, 0.5],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.gunner, { speed: 1.2 }]),
                    TYPE: "bullet"
                }
            },
            {
                POSITION: [16, 3.5, 1, 0, -3.75, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.gunner, { speed: 1.2 }]),
                    TYPE: "bullet"
                }
            }
        ],
    }
    Class.genghisLegionary = {
        PARENT: "CMCLegionary",
        NAME: "Genghis",
        UPGRADE_LABEL: "Genghis",
        LABEL: "Rogue Legionary",
        COLOR: "darkGrey",
        UPGRADE_COLOR: "darkGrey",
        TURRETS: [
            {
                POSITION: [12, 0, 0, 0, 360, 1],
                TYPE: "genghisLegionaryTop",
            },
            ...weaponArray({
                POSITION: [13, 8.5, 0, 60, 180, 0],
                TYPE: [ "genghisLegionaryBentGunnerTurret", { GUN_STAT_SCALE: {speed: 1.3, health: 1.5, damage: 1.4, resist: 1.2}, COLOR: -1 } ],
            }, 3),
        ],
    }
    Class.napoleonLegionaryDestroyerTurret = makeTurret({
        GUNS: [
            {
                POSITION: [21, 14, 1, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.destroyer]),
                    TYPE: "bullet",
                },
            },
        ],
    }, {limitFov: true, fov: 10, extraStats: [], label: "Destroyer"})
    Class.napoleonLegionaryTop = {
        PARENT: "CMCLegionaryTop",
        GUNS: weaponArray([
            {
                POSITION: [4, 4.25, 0.7, 7, 7, 60, 0.25],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.swarm, g.bee]),
                    TYPE: [ "bee", { INDEPENDENT: true } ],
                    STAT_CALCULATOR: "swarm",
                    AUTOFIRE: true,
                },
            },
            {
                POSITION: [4, 4.25, 0.7, 7, -7, 60, 0.75],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.swarm, g.bee]),
                    TYPE: [ "bee", { INDEPENDENT: true } ],
                    STAT_CALCULATOR: "swarm",
                    AUTOFIRE: true,
                },
            },
            {
                POSITION: [4, 4.25, 0.7, 7, 2.35, 60, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.swarm, g.bee]),
                    TYPE: [ "bee", { INDEPENDENT: true } ],
                    STAT_CALCULATOR: "swarm",
                    AUTOFIRE: true,
                },
            },
            {
                POSITION: [4, 4.25, 0.7, 7, -2.35, 60, 0.5],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.swarm, g.bee]),
                    TYPE: [ "bee", { INDEPENDENT: true } ],
                    STAT_CALCULATOR: "swarm",
                    AUTOFIRE: true,
                },
            },
        ], 3),
        TURRETS: weaponArray({
            POSITION: [9.5, 10, 0, 0, 190, 0],
            TYPE: ["napoleonLegionaryDestroyerTurret", {GUN_STAT_SCALE: {damage: 1.4, health: 1.1, speed: 1.2, maxSpeed: 1.2, resist: 1.1, range: 1.3}}],
        }, 3),
    }
    Class.napoleonLegionaryBeekeeperDriveTurretTurret = makeTurret({
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
    Class.napoleonLegionaryBeekeeperDriveTurretBullet = makeAuto('bullet', "Auto-Bullet", {type: 'napoleonLegionaryBeekeeperDriveTurretTurret'})
    Class.napoleonLegionaryBeekeeperDriveTurretBee = makeAuto('bee', "Auto-Bee", {type: 'napoleonLegionaryBeekeeperDriveTurretTurret'})
    Class.napoleonLegionaryBeekeeperDriveTurret = {
        PARENT: "genericTank",
        DANGER: 7,
        LABEL: "Beekeeper-Drive",
        TURRETS: [
            {
                POSITION: [9, 0, 0, 0, 360, 1],
                TYPE: ["overdriveDeco", {MIRROR_MASTER_ANGLE: true}],
            },
        ],
        GUNS: [
            {
                POSITION: [14, 3, 1, 0, -6, -7, 0.25],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.swarm, g.bee]),
                    TYPE: ["napoleonLegionaryBeekeeperDriveTurretBee", { INDEPENDENT: true }],
                    SYNCS_SKILLS: true,
                    STAT_CALCULATOR: "drone",
                    WAIT_TO_CYCLE: true,
                    LABEL: "Secondary",
                },
            },
            {
                POSITION: [14, 3, 1, 0, 6, 7, 0.75],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.swarm, g.bee]),
                    TYPE: ["napoleonLegionaryBeekeeperDriveTurretBee", { INDEPENDENT: true }],
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
                    TYPE: "napoleonLegionaryBeekeeperDriveTurretBullet",
                    LABEL: "Heavy",
                },
            },
        ],
    }
    Class.napoleonLegionary = {
        PARENT: "CMCLegionary",
        NAME: "Napoleon",
        UPGRADE_LABEL: "Napoleon",
        LABEL: "Rogue Legionary",
        COLOR: "darkGrey",
        UPGRADE_COLOR: "darkGrey",
        TURRETS: [
            {
                POSITION: [12, 0, 0, 0, 360, 1],
                TYPE: "napoleonLegionaryTop",
            },
            ...weaponArray({
                POSITION: [13, 8.5, 0, 60, 180, 0],
                TYPE: [ "napoleonLegionaryBeekeeperDriveTurret", { GUN_STAT_SCALE: {speed: 1.3, health: 1.5, damage: 1.4, resist: 1.2}, COLOR: -1 } ],
            }, 3),
        ],
    }
    Class.evenMoarCelestials.UPGRADES_TIER_0.push("moarCelestialsLegionaries");
    Class.moarCelestialsLegionaries.UPGRADES_TIER_0 = ["evenMoarCelestials", "paladinLegionary", "freyjaLegionary", "zaphkielLegionary", "nyxLegionary", "theiaLegionary", "kronosLegionary", "ragnarokLegionary", "atlasLegionary", "rheaLegionary", "juliusLegionary", "genghisLegionary", "napoleonLegionary"]
}
if (addJanus === true) {
    Class.janusAstralBasicTurret = makeTurret({
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
    let janusAstral = new LayeredBoss("janusAstral", "Janus", "CMCAstral", 5, "pink", "baseTrapTurret", 7, 5.5);
    janusAstral.addLayer({gun: {
            POSITION: [3.8, 7, -1.4, 8, 0, null, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.spawner, { size: 0.7, maxSpeed: 0.85, damage: 0.8 }]),
                TYPE: ["minion", {INDEPENDENT: true,}],
                AUTOFIRE: true,
                SYNCS_SKILLS: true,
            },
        }
    }, true, 8, 7);
    Class["janusAstral"].TURRETS.push({
        POSITION: [7, 0, 0, 0, 360, 1],
        TYPE: ["janusAstralBasicTurret", { INDEPENDENT: true, }],
    })
    if (createPrimals === true) {
        let janusPrimal = new LayeredBoss("janusPrimal", "Janus", "CMCPrimal", 3, "pink", "baseTrapTurret", 10, 5.5);
        Class["janusPrimal"].TURRETS.push({
            POSITION: [9, 0, 0, 0, 360, 1],
            TYPE: ["janusAstralBasicTurret", { INDEPENDENT: true, }],
        })
    }
    Class.janusTerrestrialMachineGunTurret = makeTurret({
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
                POSITION: [12, 10, 1.4, 8, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.machineGun]),
                    TYPE: "bullet"
                }
            },
        ],
    }, {limitFov: true, fov: 10, extraStats: [], label: "Machine Gun"})
    let janusTerrestrial = new LayeredBoss("janusTerrestrial", "Janus", "CMCTerrestrial", 7, "pink", "baseTrapTurret", 7, 5.5);
    janusTerrestrial.addLayer({gun: {
            POSITION: [3.8, 7, -1.4, 8, 0, null, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.spawner, { size: 0.7, maxSpeed: 0.85, damage: 0.8 }]),
                TYPE: ["minion", {INDEPENDENT: true}],
                AUTOFIRE: true,
                SYNCS_SKILLS: true,
            },
        }
    }, true, null, 7);
    janusTerrestrial.addLayer({turret: {
            POSITION: [10, 7.5, 0, null, 160, 0],
            TYPE: ["janusTerrestrialMachineGunTurret", {GUN_STAT_SCALE: {maxSpeed: 0.5}}],
        }
    }, true, 6.5);
    Class.janusMegaMinion = {
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
    Class.janusCelestialSprayerTurret = makeTurret({
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
    let janusCelestial = new LayeredBoss("janusCelestial", "Janus", "CMCCelestial", 9, "pink", "baseTrapTurret", 6.5, 5.5);
    janusCelestial.addLayer({gun: {
            POSITION: [3.8, 7, -1.4, 8, 0, null, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.spawner, { size: 0.7, maxSpeed: 0.85, damage: 0.8 }]),
                TYPE: ["janusMegaMinion", {INDEPENDENT: true,}],
                AUTOFIRE: true,
                SYNCS_SKILLS: true,
            },
        }
    }, true, null, 9);
    janusCelestial.addLayer({turret: {
            POSITION: [10, 7.5, 0, null, 160, 0],
            TYPE: ["janusCelestialSprayerTurret", {GUN_STAT_SCALE: {maxSpeed: 0.5}}],
        }
    }, true, 6);
    Class.janusGigaMinion = {
        PARENT: 'minion',
        LABEL: 'Giga Minion',
        GUNS: [
            {
                POSITION: [19, 13, 1, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.destroyer, g.minionGun]),
                    WAIT_TO_CYCLE: true,
                    TYPE: "bullet",
                },
            },
        ],
    }
    Class.janusEternalAtomizerTurret = makeTurret({
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
                POSITION: [5, 7.5, 1.3, 18.5, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.lowPower, g.machineGun, { recoil: 1.15 }, g.atomizer]),
                    TYPE: "bullet",
                },
            },
            {
                POSITION: [12, 10, 1.4, 8, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.machineGun]),
                    TYPE: "bullet",
                },
            },
        ],
    }, {limitFov: true, fov: 10, extraStats: [], label: "Atomizer"})
    Class.janusTwinMinion = {
        PARENT: 'minion',
        LABEL: 'Twin Minion',
        GUNS: [
            {
                POSITION: [18, 7, 1, 0, 5.25, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.minionGun]),
                    TYPE: "bullet"
                }
            },
            {
                POSITION: [18, 7, 1, 0, -5.25, 0, 0.5],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.minionGun]),
                    TYPE: "bullet"
                }
            }
        ],
    }
    let janusEternal = new LayeredBoss("janusEternal", "Janus", "CMCEternal", 11, "pink", "baseTrapTurret", 4.5, 5.5);
    janusEternal.addLayer({gun: {
            POSITION: [3.8, 5, -1.4, 8, 0, null, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.spawner, { size: 0.7, maxSpeed: 0.85, damage: 0.8 }, {reload: 1.2}]),
                TYPE: ["janusGigaMinion", {INDEPENDENT: true,}],
                AUTOFIRE: true,
                SYNCS_SKILLS: true,
            },
        }
    }, true, null, 11);
    janusEternal.addLayer({turret: {
            POSITION: [6.5, 9, 0, null, 160, 0],
            TYPE: ["janusEternalAtomizerTurret", {GUN_STAT_SCALE: {maxSpeed: 0.5}}],
        }
    }, true, 4);
    janusEternal.addLayer({gun: {
            POSITION: [3.8, 7, -1.4, 8, 0, null, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.spawner, { size: 0.7, maxSpeed: 0.85, damage: 0.8 }]),
                TYPE: ["janusTwinMinion", {INDEPENDENT: true}],
                AUTOFIRE: true,
                SYNCS_SKILLS: true,
            },
        }
    }, true, 4, 7);
    Class.janusTeraMinion = {
        PARENT: 'minion',
        LABEL: 'Tera Minion',
        GUNS: [
            {
                POSITION: [20, 19, 1, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.pounder, g.destroyer, g.minionGun]),
                    WAIT_TO_CYCLE: true,
                    TYPE: "bullet",
                },
            },
        ],
    }
    Class.janusPrimordialVaporizerTurret = makeTurret({
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
                POSITION: [14, 5, 1.2, 12, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.pelleter, g.lowPower, g.lowPower, g.machineGun, { recoil: 1.15 }, g.atomizer, g.atomizer]),
                    TYPE: "bullet",
                },
            },
            {
                POSITION: [13, 7.5, 1.4, 10, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.lowPower, g.machineGun, { recoil: 1.15 }, g.atomizer]),
                    TYPE: "bullet",
                },
            },
            {
                POSITION: [12, 10, 1.6, 8, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.machineGun]),
                    TYPE: "bullet",
                },
            },
        ],
    }, {limitFov: true, fov: 10, extraStats: [], label: "Vaporizer"})
    Class.janusTripleMinion = {
        PARENT: 'minion',
        LABEL: 'Triple Minion',
        GUNS: [
            {
                POSITION: [16, 7, 1, 0, 5.25, 0, 0.5],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.triplet, g.minionGun]),
                    TYPE: "bullet"
                }
            },
            {
                POSITION: [16, 7, 1, 0, -5.25, 0, 0.5],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.triplet, g.minionGun]),
                    TYPE: "bullet"
                }
            },
            {
                POSITION: [19, 7, 1, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.triplet, g.minionGun]),
                    TYPE: "bullet"
                }
            }
        ],
    }
    Class.janusPrimordialBreakerTurret = makeTurret({
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
                POSITION: [5, 10, 1.3, 18.5, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.pelleter, g.lowPower, g.machineGun, { recoil: 1.15 }, g.atomizer]),
                    TYPE: "bullet",
                },
            },
            {
                POSITION: [12, 12.5, 1.4, 8, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.machineGun]),
                    TYPE: "bullet",
                },
            },
        ],
    }, {limitFov: true, fov: 10, extraStats: [], label: "Breaker"})
    let janusPrimordial = new LayeredBoss("janusPrimordial", "Janus", "CMCPrimordial", 13, "pink", "baseTrapTurret", 4.5, 5.5);
    janusPrimordial.addLayer({gun: {
            POSITION: [3.8, 4.5, -1.4, 8, 0, null, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.spawner, { size: 0.7, maxSpeed: 0.85, damage: 0.8 }, {reload: 1.2}]),
                TYPE: ["janusTeraMinion", {INDEPENDENT: true,}],
                AUTOFIRE: true,
                SYNCS_SKILLS: true,
            },
        }
    }, true, null, 13);
    janusPrimordial.addLayer({turret: {
            POSITION: [6.5, 9, 0, null, 160, 0],
            TYPE: ["janusPrimordialVaporizerTurret", {GUN_STAT_SCALE: {maxSpeed: 0.5}}],
        }
    }, true, 3.35);
    janusPrimordial.addLayer({gun: {
            POSITION: [3.8, 7, -1.4, 8, 0, null, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.spawner, { size: 0.7, maxSpeed: 0.85, damage: 0.8 }]),
                TYPE: ["janusTripleMinion", {INDEPENDENT: true}],
                AUTOFIRE: true,
                SYNCS_SKILLS: true,
            },
        }
    }, true, 3.35, 9);
    janusPrimordial.addLayer({turret: {
            POSITION: [8.5, 9, 0, null, 160, 0],
            TYPE: ["janusPrimordialBreakerTurret", {GUN_STAT_SCALE: {damage: 0.5}}],
        }
    }, true, 3.35);
    if (createLegionaries === true) {
        Class.janusLegionaryTwinTurret = makeTurret({
            GUNS: [
                {
                    POSITION: [20, 8, 1, 0, 5.5, 0, 0],
                    PROPERTIES: {
                        SHOOT_SETTINGS: combineStats([g.basic, g.twin]),
                        TYPE: "bullet"
                    }
                },
                {
                    POSITION: [20, 8, 1, 0, -5.5, 0, 0.5],
                    PROPERTIES: {
                        SHOOT_SETTINGS: combineStats([g.basic, g.twin]),
                        TYPE: "bullet"
                    }
                }
            ],
        }, {limitFov: true, fov: 10, extraStats: [], label: "Cruiser"})
        Class.janusLegionaryTop = {
            PARENT: "CMCLegionaryTop",
            GUNS: weaponArray([
                {
                    POSITION: [4, 9.5, 0.7, 7, 5, 60, 0],
                    PROPERTIES: {
                        SHOOT_SETTINGS: combineStats([g.swarm, g.pounder, { speed: 2, maxSpeed: 1.7, size: 0.6, range: 2.8}]),
                        TYPE: [ "swarm", { INDEPENDENT: true } ],
                        STAT_CALCULATOR: "swarm",
                        AUTOFIRE: true,
                    },
                },
                {
                    POSITION: [4, 9.5, 0.7, 7, -5, 60, 0.5],
                    PROPERTIES: {
                        SHOOT_SETTINGS: combineStats([g.swarm, g.pounder, { speed: 2, maxSpeed: 1.7, size: 0.6, range: 2.8}]),
                        TYPE: [ "swarm", { INDEPENDENT: true } ],
                        STAT_CALCULATOR: "swarm",
                        AUTOFIRE: true,
                    },
                },
            ], 3),
            TURRETS: weaponArray({
                POSITION: [9.5, 10, 0, 0, 190, 0],
                TYPE: ["janusLegionaryTwinTurret", {GUN_STAT_SCALE: {damage: 1.4, health: 1.1, speed: 1.2, maxSpeed: 1.2, resist: 1.1, range: 1.3}}],
            }, 3),
        }
        Class.janusLegionarySprayerTurret = {
            PARENT: "genericTank",
            DANGER: 7,
            LABEL: "Sprayer",
            GUNS: [
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
        }
        Class.janusLegionary = {
            PARENT: "CMCLegionary",
            NAME: "Janus",
            UPGRADE_LABEL: "Janus",
            COLOR: "pink",
            UPGRADE_COLOR: "pink",
            TURRETS: [
                {
                    POSITION: [12, 0, 0, 0, 360, 1],
                    TYPE: "janusLegionaryTop",
                },
                ...weaponArray({
                    POSITION: [13, 8.5, 0, 60, 180, 0],
                    TYPE: [ "janusLegionarySprayerTurret", { GUN_STAT_SCALE: {speed: 2, health: 1.5, damage: 1.4, maxSpeed: 0.175}, COLOR: -1 } ],
                }, 3),
            ],
        }
    }
    Class.moarCelestialsPrimals.UPGRADES_TIER_0.push("janusPrimal");
    Class.moarCelestialsAstrals.UPGRADES_TIER_0.push("janusAstral");
    Class.moarCelestialsTerrestrials.UPGRADES_TIER_0.push("janusTerrestrial");
    Class.moarCelestialsCelestials.UPGRADES_TIER_0.push("janusCelestial");
    Class.moarCelestialsEternals.UPGRADES_TIER_0.push("janusEternal");
    Class.moarCelestialsPrimordials.UPGRADES_TIER_0.push("janusPrimordial");
    Class.moarCelestialsLegionaries.UPGRADES_TIER_0.push("janusLegionary");
}
if (createSolars === true) {
    Class.moarCelestialsSolars = makeMenu("Solars", "rainbow", 15)
    Class.moarCelestialsSolars.UPGRADES_TIER_0 = []
    Class.CMCSolar = {
        PARENT: "miniboss",
        LABEL: "Solar",
        SKILL: [11, 11, 11, 11, 11, 11, 11, 11, 11, 11],
        SKILL_CAP: [11, 11, 11, 11, 11, 11, 11, 11, 11, 11],
        VALUE: 3e7,
        SHAPE: 15,
        SIZE: 200,
        CONTROLLERS: [["minion", {turnwiserange: 360}]],
        DANGER: 15,
        BODY: {
            FOV: 1,
            HEALTH: 12500,
            SHIELD: 2.5,
            REGEN: base.REGEN * 0.1,
            SPEED: 0.1,
            DAMAGE: 39,
        },
    };
    Class.evenMoarCelestials.UPGRADES_TIER_0.push("moarCelestialsSolars");
    Class.moarCelestialsSolars.UPGRADES_TIER_0 = ["evenMoarCelestials"]
}
if (createAntediluvian === true) {
    Class.moarCelestialsAntediluvians = makeMenu("Antediluvians", "rainbow", 17)
    Class.moarCelestialsAntediluvians.UPGRADES_TIER_0 = []
    Class.CMCAntediluvian = {
        PARENT: "miniboss",
        LABEL: "Antediluvian",
        SKILL: [13, 13, 13, 13, 13, 13, 13, 13, 13, 13],
        SKILL_CAP: [13, 13, 13, 13, 13, 13, 13, 13, 13, 13],
        VALUE: 5.875e7,
        SHAPE: 17,
        SIZE: 250,
        CONTROLLERS: [["minion", {turnwiserange: 360}]],
        DANGER: 17,
        BODY: {
            FOV: 1,
            HEALTH: 35000,
            SHIELD: 2.75,
            REGEN: base.REGEN * 0.1,
            SPEED: 0.08,
            DAMAGE: 50,
        },
    };
    Class.evenMoarCelestials.UPGRADES_TIER_0.push("moarCelestialsAntediluvians");
    Class.moarCelestialsAntediluvians.UPGRADES_TIER_0 = ["evenMoarCelestials"]
}

Class.moarCelestials.UPGRADES_TIER_0.push("evenMoarCelestials");