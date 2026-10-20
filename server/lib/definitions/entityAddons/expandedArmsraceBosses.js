const {combineStats, deleteUpgrades, dereference, makeAuto, makeAutoArray, makeBird, makeDrive, makeFlank, makeGuard, makeHat, makeMenu, makeOver, makeRadialAuto, makeSnake, makeGunner, makeTurret, makeWhirlwind, weaponArray, weaponMirror, weaponStack} = require('../facilitators.js')
const {base, statnames} = require('../constants.js')
const g = require('../gunvals.js')
const preset = require('../presets.js')
const doper = {speed: 1.5, maxSpeed: 1.5, pen: 1.25, health: 0.8, damage: 0.95}
Class.EAB3_crasherSpawner = makeTurret({
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
Class.EAB3_turretedCrasherSpawner = makeTurret({
    GUNS: [
        {
            POSITION: [6, 12, 1.2, 8, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.drone, g.weak, g.weak, {health: 1.1}]),
                TYPE: [
                    "turretedDrone",
                    {
                        LABEL: "Auto-Crasher",
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
Class.EAB3_megaCrasherSpawner = makeTurret({
    GUNS: [
        {
            POSITION: [6, 16, 1.2, 8, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.drone, g.weak, g.weak, g.pounder, {health: 1.1}]),
                TYPE: [
                    "drone",
                    {
                        LABEL: "Mega Crasher",
                        DRAW_HEALTH: true,
                    },
                ],
                SYNCS_SKILLS: true,
                AUTOFIRE: true,
                STAT_CALCULATOR: "drone",
                MAX_CHILDREN: 2,
            },
        },
    ],
}, {independent: true, aiSettings: {chase: true}, label: 'Spawned', color: 'pink'})
Class.EAB3_fastCrasherSpawner = makeTurret({
    GUNS: [
        {
            POSITION: [6, 12, 1.2, 8, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.drone, g.weak, g.weak, {health: 1.1}, doper]),
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
                MAX_CHILDREN: 3,
            },
        },
    ],
}, {independent: true, aiSettings: {chase: true}, label: 'Spawned', color: 'pink'})
Class.EAB3_biggerauto4gun = makeTurret({
    GUNS: [
        {
            POSITION: [12, 5, 1, 0, -5, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.twin, g.twin, g.twin, g.power, { reload: 2 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [12, 5, 1, 0, 5, 0, 0.2],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.twin, g.twin, g.twin, g.power, { reload: 2 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [14, 5, 1, 0, -2.5, 0, 0.4],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.twin, g.twin, g.twin, g.power, { reload: 2 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [14, 5, 1, 0, 2.5, 0, 0.6],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.twin, g.twin, g.twin, g.power, { reload: 2 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [16, 5, 1, 0, 0, 0, 0.8],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.twin, g.twin, g.twin, g.power, { reload: 2 }]),
                TYPE: "bullet",
            },
        },
    ],
}, {canRepel: true, limitFov: true, fov: 3})
Class.EAB3_twinPillboxTurret = makeTurret({
    HAS_NO_RECOIL: true,
    GUNS: [
        {
            POSITION: [18, 7, 1, 0, 5, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.minionGun, g.turret, g.power, g.autoTurret, { density: 0.1, speed: 0.5, range: 1.5 }]),
                TYPE: "bullet",
                WAIT_TO_CYCLE: true
            }
        },
        {
            POSITION: [18, 7, 1, 0, -5, 0, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.minionGun, g.turret, g.power, g.autoTurret, { density: 0.1, speed: 0.5, range: 1.5 }]),
                TYPE: "bullet",
                WAIT_TO_CYCLE: true
            }
        }
    ],
}, {independent: true, extraStats: []})
Class.EAB3_unsetTwinPillbox = {
    PARENT: "unsetTrap",
    LABEL: "Pillbox",
    INDEPENDENT: true,
    DIE_AT_RANGE: true,
    TURRETS: [
        {
            POSITION: [11, 0, 0, 0, 360, 1],
            TYPE: "EAB3_twinPillboxTurret",
        },
    ],
}
Class.EAB3_swarmPillboxTurret = makeTurret({
    HAS_NO_RECOIL: true,
    GUNS: [
        {
            POSITION: [7, 7.5, 0.6, 7, 0, 90, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.swarm, g.minionGun, g.turret, g.power, g.autoTurret, { reload: 2/3, density: 0.1, speed: 0.5, range: 1.5 }]),
                TYPE: ["swarm", {INDEPENDENT: true}],
                STAT_CALCULATOR: "swarm",
                WAIT_TO_CYCLE: true
            }
        },
        {
            POSITION: [7, 7.5, 0.6, 7, 0, 270, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.swarm, g.minionGun, g.turret, g.power, g.autoTurret, { reload: 2/3, density: 0.1, speed: 0.5, range: 1.5 }]),
                TYPE: ["swarm", {INDEPENDENT: true}],
                STAT_CALCULATOR: "swarm",
                WAIT_TO_CYCLE: true
            }
        },
    ],
}, {independent: true, extraStats: []})
Class.EAB3_unsetSwarmPillbox = {
    PARENT: "unsetTrap",
    LABEL: "Pillbox",
    INDEPENDENT: true,
    DIE_AT_RANGE: true,
    TURRETS: [
        {
            POSITION: [11, 0, 0, 0, 360, 1],
            TYPE: "EAB3_swarmPillboxTurret",
        },
    ],
}
Class.EAB3_machineHexaTurret = {
    PARENT: "genericTank",
    FACING_TYPE: ["spin", {speed: 0.06}],
    INDEPENDENT: true,
    COLOR: -1,
    GUNS: weaponArray({
        POSITION: [12, 9.75, 1.4, 8, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.flankGuard, g.flankGuard]),
            TYPE: "bullet",
            AUTOFIRE: true,
        },
    }, 6)
}
Class.EAB3_sprayerTripleTurret = {
    PARENT: "genericTank",
    FACING_TYPE: ["spin", {speed: 0.06}],
    INDEPENDENT: true,
    COLOR: -1,
    GUNS: weaponArray([
        {
            POSITION: [23, 7, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.lowPower, g.pelleter, { recoil: 1.15 }, g.flankGuard]),
                TYPE: 'bullet',
                AUTOFIRE: true,
            }
        },
        {
            POSITION: [12, 10, 1.4, 8, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.flankGuard]),
                TYPE: 'bullet',
                AUTOFIRE: true,
            }
        }
    ], 3)
}
Class.EAB3_turretedTrap = makeAuto('trap', "Auto-Trap", {type: 'droneAutoTurret'})
Class.EAB3_triPeashooterTurret = {
    PARENT: "genericTank",
    COLOR: -1,
    FACING_TYPE: ["spin", { independent: true }],
    GUNS: weaponArray([
        {
            POSITION: [17, 8, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.flankGuard, g.flankGuard]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [9, 7.5, 0.6, 5, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.swarm, g.flankGuard, g.flankGuard]),
                TYPE: "autoswarm",
            },
        },
        {
            POSITION: [13, 8, 1, 0, 0, 60, 0],
        },
        {
            POSITION: [4, 8, 1.7, 13, 0, 60, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap]),
                TYPE: "trap",
                STAT_CALCULATOR: "trap",
            },
        },
    ], 3),
}
Class.EAB3_eliteSpinnerGaleTurret = {
    PARENT: "genericTank",
    COLOR: -1,
    FACING_TYPE: ["spin", { speed: -0.1, independent: true }],
    GUNS: [
        ...weaponArray([
                {
                    POSITION: [18, 8, 1, 0, 0, 45, 0.5],
                    PROPERTIES: {
                        SHOOT_SETTINGS: combineStats([g.basic, g.flankGuard, g.flankGuard, g.spam]),
                        TYPE: 'bullet'
                    }
                },
                {
                    POSITION: [18, 8, 1, 0, 0, 0, 0],
                    PROPERTIES: {
                        SHOOT_SETTINGS: combineStats([g.basic, g.flankGuard, g.flankGuard, g.spam]),
                        TYPE: 'bullet'
                    }
                }
            ], 4),
        ...weaponArray([
            {
                POSITION: [14, 3.5, 1, 0, 0, -15, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.gunner, g.cyclone]),
                    TYPE: "bullet"
                }
            },
            {
                POSITION: [14, 3.5, 1, 0, 0, 15, 0.5],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.gunner, g.cyclone]),
                    TYPE: "bullet"
                }
            },
        ], 4)
    ]
}
Class.EAB3_eliteSpinnerTroveTurret = {
    PARENT: "genericTank",
    COLOR: -1,
    FACING_TYPE: ["spin", { speed: -0.1, independent: true }],
    GUNS: weaponArray([
        {
            POSITION: [14, 3.5, 1, 0, 0, -15, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.gunner, g.cyclone]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: [14, 3.5, 1, 0, 0, 15, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.gunner, g.cyclone]),
                TYPE: "bullet"
            }
        },
    ], 4),
    TURRETS: weaponArray({
        POSITION: [11, 7, 0, 45, 180, 0],
        TYPE: [ "auto4gun", { INDEPENDENT: true } ],
    }, 4)
}
Class.EAB3_ultramissile = {
    PARENT: "missile",
    GUNS: [
        {
            POSITION: [12.5, 6, 1, 0, -2, 135, 1/3],
            PROPERTIES: {
                AUTOFIRE: true,
                SHOOT_SETTINGS: combineStats([g.basic, {reload: 3}]),
                TYPE: [ "bullet", { PERSISTS_AFTER_DEATH: true } ],
                STAT_CALCULATOR: "thruster",
            },
        },
        {
            POSITION: [12.5, 6, 1, 0, 2, 225, 1/3],
            PROPERTIES: {
                AUTOFIRE: true,
                SHOOT_SETTINGS: combineStats([g.basic, {reload: 3}]),
                TYPE: [ "bullet", { PERSISTS_AFTER_DEATH: true } ],
                STAT_CALCULATOR: "thruster",
            },
        },
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
                AUTOFIRE: true,
                SHOOT_SETTINGS: combineStats([g.basic, {reload: 3}]),
                TYPE: [ "bullet", { PERSISTS_AFTER_DEATH: true } ],
            },
        },
    ],
}
Class.EAB3_ultraSkimmerTurret = makeTurret({
    GUNS: [
        {
            POSITION: [10, 14, -0.5, 9, 0, 0, 0],
        },
        {
            POSITION: [17, 15, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.artillery, g.artillery, g.skimmer]),
                TYPE: "EAB3_ultramissile",
                STAT_CALCULATOR: "sustained",
            },
        },
        {
            POSITION: [3, 9.5, 0.775, 15.75, 0, 0, 0],
        },
        {
            POSITION: [17, 5, 2, 0, 0, 0, 0],
        },
    ],
}, {canRepel: true, limitFov: true, extraStats: [], color: 'mirror'})
Class.EAB3_bazookaTurret = makeTurret({
    GUNS: [
        {
            POSITION: [10, 16, -0.75, 9, 0, 0, 0],
        },
        {
            POSITION: [17, 17, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.destroyer, g.artillery, g.artillery, g.skimmer]),
                TYPE: "hypermissile",
                STAT_CALCULATOR: "sustained",
            },
        },
    ],
}, {canRepel: true, limitFov: true, extraStats: [], color: 'mirror'})
Class.EAB3_skidderTurret = makeTurret({
    GUNS: [
        ...weaponMirror({
            POSITION: [15, 5, 1, 0, -6, -7, 0.25],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.artillery]),
                TYPE: 'bullet',
                LABEL: "Secondary"
            }
        }, {delayIncrement: 0.5}),
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
}, {canRepel: true, limitFov: true, extraStats: [], color: 'mirror'})
Class.EAB3_explosiveHypermissile = {
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
            POSITION: [14, 6, 1, 0, -2, 90, 0.5],
            PROPERTIES: {
                AUTOFIRE: true,
                SHOOT_SETTINGS: combineStats([g.basic, {reload: 3}]),
                TYPE: [ "bullet", { PERSISTS_AFTER_DEATH: true } ],
            },
        },
        {
            POSITION: [14, 6, 1, 0, 2, 270, 0.5],
            PROPERTIES: {
                AUTOFIRE: true,
                AUTOFIRE: true,
                SHOOT_SETTINGS: combineStats([g.basic, {reload: 3}]),
                TYPE: [ "bullet", { PERSISTS_AFTER_DEATH: true } ],
            },
        },
        ...weaponArray([
            {
                POSITION: [0, 4, 0, 0, 0, 0, 9999],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, {reload: 999}]),
                    TYPE: ["bullet", {PERSISTS_AFTER_DEATH: true}],
                    SHOOT_ON_DEATH: true,
                    WAIT_TO_CYCLE: true,
                }
            }
        ], 12)
    ],
    TURRETS: [
        {
            POSITION: [9, 0, 0, 0, 0, 1],
            TYPE: "genericTank",
        }
    ]
}
Class.EAB3_tickerTurret = makeTurret({
    GUNS: [
        {
            POSITION: [10, 15, -0.75, 9, 0, 0, 0],
        },
        {
            POSITION: [17, 14, 1.25, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.artillery, g.artillery, g.skimmer]),
                TYPE: "EAB3_explosiveHypermissile",
                STAT_CALCULATOR: "sustained",
            },
        },
    ],
}, {canRepel: true, limitFov: true, extraStats: [], color: 'mirror'})
Class.EAB3_recoilerTurret = makeTurret({
    GUNS: [
        {
            POSITION: [18, 14, 1, 0, 0, 0, 0],
        },
        {
            POSITION: [13, 14, -1.425, 0, 0, 0, 0],
        },
        {
            POSITION: [2, 14, 1.2, 18, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, g.pounder, g.setTrap, g.boomerang]),
                TYPE: 'boomerang',
                STAT_CALCULATOR: 'block'
            }
        }
    ],
},{canRepel: true, limitFov: true, color: 'mirror', extraStats: []})
Class.EAB3_bentBoomerTurret = makeTurret({
    GUNS: [
        {
            POSITION: [18, 9, 1, 0, 2, 20, 0],
        },
        {
            POSITION: [13, 9, -1.7, 0, 2, 20, 0],
        },
        {
            POSITION: [2, 9, 1.3, 18, 2, 20, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, g.setTrap, g.boomerang]),
                TYPE: 'boomerang',
                STAT_CALCULATOR: 'block'
            }
        },
        {
            POSITION: [18, 9, 1, 0, -2, -20, 0.5],
        },
        {
            POSITION: [13, 9, -1.7, 0, -2, -20, 0.5],
        },
        {
            POSITION: [2, 9, 1.3, 18, -2, -20, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, g.setTrap, g.boomerang]),
                TYPE: 'boomerang',
                STAT_CALCULATOR: 'block'
            }
        }
    ],
},{canRepel: true, limitFov: true, color: 'mirror', extraStats: []})
Class.EAB3_parryerTurret = makeTurret({
    GUNS: [
        {
            POSITION: [18, 8, 1, 0, 0, 0, 0],
        },
        {
            POSITION: [2, 10, 1, 15.75, 0, 0, 0],
        },
        {
            POSITION: [13, 10, -1.9, 0, 0, 0, 0],
        },
        {
            POSITION: [2, 10, 1.3, 18, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, g.setTrap, g.boomerang]),
                TYPE: 'boomerang',
                STAT_CALCULATOR: 'block'
            }
        }
    ],
},{canRepel: true, limitFov: true, color: 'mirror', extraStats: []})
Class.EAB3_baseBuilderTurret = makeTurret({
    GUNS: [
        {
            POSITION: [17, 15, 1, 0, 0, 0, 0],
        },
        {
            POSITION: [3, 15, 1.3, 17, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, g.setTrap, g.pounder, g.hexaTrapper, {reload: 1.3, health: 1.35, damage: 1.4, speed: 0.9, shudder: 0.1}]),
                TYPE: "unsetTrap",
                STAT_CALCULATOR: "trap",
                AUTOFIRE: true,
            },
        },
    ],
}, {independent: true, hasAI: false, extraStats: []})
Class.EAB3_baseMechTurret = makeTurret({
    GUNS: [
        {
            POSITION: [16, 14, 1, 0, 0, 0, 0],
        },
        {
            POSITION: [4, 14, 1.8, 16, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, g.pounder, g.hexaTrapper, {reload: 1.3, size: 1.2, health: 1.35, damage: 1.4, speed: 0.9, shudder: 0.1}]),
                TYPE: "turretedTrap",
                STAT_CALCULATOR: "trap",
                AUTOFIRE: true,
            },
        },
        {
            POSITION: [11, 19, 1, 0, 0, 0, 0],
        },
    ],
}, {independent: true, hasAI: false, extraStats: []})
const shotconstrTurretProperties = {
    SHOOT_SETTINGS: combineStats([g.trap, g.setTrap, g.pounder, g.shotgun, g.machineGun, { size: 3, reload: 0.65, speed: 0.7, maxSpeed: 0.1, damage: 0.7, range: 0.5 }]),
    AUTOFIRE: true,
    TYPE: "shotTrapBox",
    STAT_CALCULATOR: "block",
}
Class.EAB3_shotconstructorTurret = makeTurret({
    GUNS: [
        {
            POSITION: [ 4, 3, 1, 11, -3, 0, 0 ], PROPERTIES: shotconstrTurretProperties,
        },
        {
            POSITION: [ 4, 4, 1, 11, 3, 0, 0 ], PROPERTIES: shotconstrTurretProperties,
        },
        {
            POSITION: [ 1, 4, 1, 11, 1, 0, 0 ], PROPERTIES: shotconstrTurretProperties,
        },
        {
            POSITION: [ 1, 4, 1, 12, -1, 0, 0 ], PROPERTIES: shotconstrTurretProperties,
        },
        {
            POSITION: [ 1, 3, 1, 11, 1, 0, 0 ], PROPERTIES: shotconstrTurretProperties,
        },
        {
            POSITION: [ 1, 4, 1, 13, -1, 0, 0 ], PROPERTIES: shotconstrTurretProperties,
        },
        {
            POSITION: [ 1, 5, 1, 13, 1, 0, 0 ], PROPERTIES: shotconstrTurretProperties,
        },
        {
            POSITION: [ 1, 4, 1, 13, 2, 0, 0 ], PROPERTIES: shotconstrTurretProperties,
        },
        {
            POSITION: [ 1, 4, 1, 13, -2, 0, 0 ], PROPERTIES: shotconstrTurretProperties,
        },
        {
            POSITION: [ 16, 16.75, -1.2, 0, 0, 0, 0 ],
        },
        {
            POSITION: [ 6, 16.75, 1.4, 16, 0, 0, 0 ],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, g.setTrap, g.pounder, g.shotgun, g.machineGun, {reload: 0.65}, g.fake]),
                AUTOFIRE: true,
                TYPE: "bullet"
            }
        }
    ]
}, {limitFov: true, aiSettings: {SKYNET: true, FULL_VIEW: true, independent: true, extraStats: []}})
Class.EAB3_shotMechBox = {
    PARENT: 'unsetPillbox',
    MOTION_TYPE: "glide",
    TURRETS: [
        {
            POSITION: [11, 0, 0, 0, 360, 1],
            TYPE: "pillboxTurret",
        },
    ],
}
const shotmechTurretProperties = {
    SHOOT_SETTINGS: combineStats([g.trap, g.setTrap, g.shotgun, g.machineGun, { size: 4, reload: 0.65, speed: 0.7, maxSpeed: 0.1, damage: 0.7, range: 0.5 }]),
    AUTOFIRE: true,
    TYPE: "EAB3_shotMechBox",
    STAT_CALCULATOR: "block",
}
Class.EAB3_shotmechTurret = makeTurret({
    GUNS: [
        {
            POSITION: [ 1, 2, 1, 12, -1, 0, 0 ], PROPERTIES: shotmechTurretProperties,
        },
        {
            POSITION: [ 1, 2, 1, 11, 1, 0, 0 ], PROPERTIES: shotmechTurretProperties,
        },
        {
            POSITION: [ 1, 1.5, 1, 13, -1, 0, 0 ], PROPERTIES: shotmechTurretProperties,
        },
        {
            POSITION: [ 1, 1.5, 1, 13, 1, 0, 0 ], PROPERTIES: shotmechTurretProperties,
        },
        {
            POSITION: [ 1, 2, 1, 13, 2, 0, 0 ], PROPERTIES: shotmechTurretProperties,
        },
        {
            POSITION: [ 1, 2, 1, 13, 2, 0, 0 ], PROPERTIES: shotmechTurretProperties,
        },
        {
            POSITION: [ 1, 2, 1, 13, -2, 0, 0 ], PROPERTIES: shotmechTurretProperties,
        },
        {
            POSITION: [ 16, 14, -1.4, 0, 0, 0, 0 ],
        },
        {
            POSITION: [ 6, 14, 1.6, 16, 0, 0, 0 ],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, g.setTrap, g.shotgun, g.machineGun, {reload: 0.65}, g.fake]),
                AUTOFIRE: true,
                TYPE: "bullet"
            }
        },
        {
            POSITION: [ 11.5, 20, 1, 0, 0, 0, 0 ],
        }
    ]
}, {limitFov: true, aiSettings: {SKYNET: true, FULL_VIEW: true, independent: true, extraStats: []}})
Class.EAB3_baltimoreTurret = makeTurret({
    GUNS: weaponMirror({
        POSITION: [10, 9.25, 0.75, 4, 4.5, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.swarm, g.pounder]),
            TYPE: 'swarm',
            STAT_CALCULATOR: 'swarm'
        }
    }, {delayIncrement: 0.5}),
}, {canRepel: true, limitFov: true, extraStats: []})
Class.EAB3_moseyTurret = makeTurret({
    GUNS: [
        ...weaponMirror({
            POSITION: [9, 8.2, 0.6, 5, 4, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.swarm, doper]),
                TYPE: 'swarm',
                STAT_CALCULATOR: 'swarm'
            }
        }, {delayIncrement: 0.5}),
        ...weaponMirror({
            POSITION: [10, 0.5, -5, 5, 4, 0, 0],
        }, {delayIncrement: 0.5}),
    ]
}, {canRepel: true, limitFov: true, extraStats: []})
Class.EAB3_blockadeTurret = makeTurret({
    GUNS: [
        {
            POSITION: [24, 12, 1, 0, 0, 0, 0],
        },
        ...weaponStack({
            POSITION: [4, 12, 1.1, 22, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, g.setTrap, g.minigun, g.barricade]),
                TYPE: 'setTrap',
                STAT_CALCULATOR: 'trap'
            }
        }, 3, {xPosOffset: 4, delayIncrement: 1/3})
    ]
}, {aiSettings: {SKYNET: true, FULL_VIEW: true, independent: true, extraStats: []}})
Class.EAB3_barrierTurret = makeTurret({
    GUNS: [
        {
            POSITION: [32, 8, 1, 0, 0, 0, 0],
        },
        ...weaponStack({
            POSITION: [4, 8, 1.3, 30, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, g.minigun, g.barricade]),
                TYPE: 'trap',
                STAT_CALCULATOR: 'trap'
            }
        }, 5, {xPosOffset: 4, delayIncrement: 1/5})
    ]
}, {aiSettings: {SKYNET: true, FULL_VIEW: true, independent: true, extraStats: []}})
Class.EAB3_propperTurret = makeTurret({
    GUNS: [
        {
            POSITION: [26, 8, 1, 0, 0, 0, 0],
        },
        ...weaponStack({
            POSITION: [4, 8, 1.3, 24, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, g.minigun, g.barricade]),
                TYPE: 'turretedTrap',
                STAT_CALCULATOR: 'trap'
            }
        }, 3, {xPosOffset: 4, delayIncrement: 1/3}),
        {
            POSITION: [13, 8*1.3, 1, 0, 0, 0, 0],
        },
    ]
}, {aiSettings: {SKYNET: true, FULL_VIEW: true, independent: true, extraStats: []}})
Class.EAB3_myriadTurret = makeTurret({
    GUNS: [
        {
            POSITION: [15, 15.5, -1.2, 4, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.pounder, g.destroyer, g.hive]),
                TYPE: 'hive'
            }
        },
        {
            POSITION: [15, 14.5, 1, 5, 0, 0, 0],
        }
    ]
}, {canRepel: true, limitFov: true, extraStats: []})
Class.EAB3_explosiveHive = {
    PARENT: "hive",
    GUNS: [
        ...weaponArray({
                POSITION: [7, 9.5, 0.6, 7, 0, 108, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.swarm, g.hive, g.bee]),
                    TYPE: ["bee", { PERSISTS_AFTER_DEATH: true }],
                    STAT_CALCULATOR: "swarm",
                    AUTOFIRE: true
                },
            }, 5, {delayIncrement: 0.2}),
        ...weaponArray([
            {
                POSITION: [0, 4, 0, 0, 0, 0, 9999],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, {reload: 999}]),
                    TYPE: ["bullet", {PERSISTS_AFTER_DEATH: true}],
                    SHOOT_ON_DEATH: true,
                    WAIT_TO_CYCLE: true,
                }
            }
        ], 12)
    ],
    TURRETS: [
        {
            POSITION: [9, 0, 0, 0, 0, 1],
            TYPE: "genericTank",
        }
    ]
}
Class.EAB3_molotovTurret = makeTurret({
    GUNS: [
        {
            POSITION: [13, 13, 1.2, 5, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.destroyer, g.hive]),
                TYPE: 'EAB3_explosiveHive'
            }
        },
        {
            POSITION: [15, 8, 1, 5, 0, 0, 0],
        },
        {
            POSITION: [13, 12, 1, 5, 0, 0, 0],
        }
    ]
}, {canRepel: true, limitFov: true, extraStats: []})
Class.EAB3_catapultTurret = makeTurret({
    GUNS: [
        {
            POSITION: [10, 16, -0.5, 9, 0, 0, 0],
        },
        {
            POSITION: [17, 16.5, -1.2, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.destroyer, g.artillery, g.artillery, g.skimmer, {speed: 0.6, reload: 4/3, shudder: 0.1}]),
                TYPE: 'spinmissile',
                STAT_CALCULATOR: 'sustained+lowspeed'
            }
        }
    ]
}, {canRepel: true, limitFov: true, color: 'mirror', extraStats: [{speed: 1.3, maxSpeed: 1.3}]})
Class.EAB3_hyperTwisterTurret = makeTurret({
    GUNS: [
        {
            POSITION: [10, 13, -0.5, 9, 0, 0, 0],
        },
        {
            POSITION: [17, 14, -1.4, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.artillery, g.artillery, g.skimmer, {speed: 0.6, reload: 4/3, shudder: 0.1}]),
                TYPE: 'hyperspinmissile',
                STAT_CALCULATOR: 'sustained+lowspeed'
            }
        },
        {
            POSITION: [10, 7, -0.5, 9, 0, 0, 0],
        },
        {
            POSITION: [10, 14, 0.5, 7, 0, 0, 0],
        },
    ]
}, {canRepel: true, limitFov: true, color: 'mirror', extraStats: [{speed: 1.3, maxSpeed: 1.3}]})
// ELITES
// Elite Destroyer
/*
guns: big mac, constructor, launcher
turrets: penta, drive, honcho, doper
*/
Class.EAB3_eliteDestroyerBigMac = {
    PARENT: "elite",
    UPGRADE_LABEL: "Elite Destroyer",
    UPGRADE_TOOLTIP: "(Big Mac)",
    UPGRADE_COLOR: "pink",
    GUNS: [
        ...weaponArray({
            POSITION: [5, 25, -0.7, 4, 0, 60, 0],
        }, 3),
        ...weaponArray({
            POSITION: [5, 25, 1, 9, 0, 60, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.pounder, g.destroyer, g.destroyer]),
                TYPE: "bullet",
                LABEL: "Obliterator",
            },
        }, 3),
    ],
    TURRETS: [
        ...weaponArray({
            POSITION: [11, 0, 0, 60, 360, 0],
            TYPE: "EAB3_crasherSpawner",
        }, 3),
        {
            POSITION: [11, 0, 0, 0, 360, 1],
            TYPE: [ "bigauto4gun", { INDEPENDENT: true, COLOR: -1 } ],
        },
    ],
}
Class.EAB3_eliteDestroyerConstructor = {
    PARENT: "elite",
    UPGRADE_LABEL: "Elite Destroyer",
    UPGRADE_TOOLTIP: "(Constructor)",
    UPGRADE_COLOR: "pink",
    GUNS: [
        ...weaponArray({
            POSITION: [5, 15.5, 1, 6, 0, 60, 0],
        }, 3),
        ...weaponArray({
            POSITION: [1.5, 15.5, 1.05, 11, 0, 60, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.setTrap, g.pounder, g.pounder, g.destroyer]),
                TYPE: "unsetTrap",
                LABEL: "Producer",
            },
        }, 3),
    ],
    TURRETS: [
        ...weaponArray({
            POSITION: [11, 0, 0, 60, 360, 0],
            TYPE: "EAB3_crasherSpawner",
        }, 3),
        {
            POSITION: [11, 0, 0, 0, 360, 1],
            TYPE: [ "bigauto4gun", { INDEPENDENT: true, COLOR: -1 } ],
        },
    ],
}
Class.EAB3_eliteDestroyerLauncher = {
    PARENT: "elite",
    UPGRADE_LABEL: "Elite Destroyer",
    UPGRADE_TOOLTIP: "(Launcher)",
    UPGRADE_COLOR: "pink",
    GUNS: [
        ...weaponArray({
            POSITION: [6.5, 14, 1, 6, 0, 60, 0],
        }, 3),
        ...weaponArray({
            POSITION: [5, 16.5, 1, 6, 0, 60, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.pounder, g.destroyer, g.launcher]),
                TYPE: "minimissile",
                LABEL: "Diluter",
            },
        }, 3),
    ],
    TURRETS: [
        ...weaponArray({
            POSITION: [11, 0, 0, 60, 360, 0],
            TYPE: "EAB3_crasherSpawner",
        }, 3),
        {
            POSITION: [11, 0, 0, 0, 360, 1],
            TYPE: [ "bigauto4gun", { INDEPENDENT: true, COLOR: -1 } ],
        },
    ],
}
Class.EAB3_eliteDestroyerPenta = {
    PARENT: "elite",
    UPGRADE_LABEL: "Elite Destroyer",
    UPGRADE_TOOLTIP: "(Penta)",
    UPGRADE_COLOR: "pink",
    GUNS: [
        ...weaponArray({
            POSITION: [5, 16, 1, 6, 0, 60, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.pounder, g.destroyer]),
                TYPE: "bullet",
                LABEL: "Devastator",
            },
        }, 3),
    ],
    TURRETS: [
        ...weaponArray({
            POSITION: [11, 0, 0, 60, 360, 0],
            TYPE: "EAB3_crasherSpawner",
        }, 3),
        {
            POSITION: [12, 0, 0, 0, 360, 1],
            TYPE: [ "EAB3_biggerauto4gun", { INDEPENDENT: true, COLOR: -1 } ],
        },
    ],
}
Class.EAB3_eliteDestroyerDrive = {
    PARENT: "elite",
    UPGRADE_LABEL: "Elite Destroyer",
    UPGRADE_TOOLTIP: "(Drive)",
    UPGRADE_COLOR: "pink",
    GUNS: [
        ...weaponArray({
            POSITION: [5, 16, 1, 6, 0, 60, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.pounder, g.destroyer]),
                TYPE: "bullet",
                LABEL: "Devastator",
            },
        }, 3),
    ],
    TURRETS: [
        ...weaponArray({
            POSITION: [11, 0, 0, 60, 360, 0],
            TYPE: "EAB3_turretedCrasherSpawner",
        }, 3),
        {
            POSITION: [11, 0, 0, 0, 360, 1],
            TYPE: [ "triangle", { INDEPENDENT: true, MIRROR_MASTER_ANGLE: true, COLOR: "grey" } ],
        },
        {
            POSITION: [11, 0, 0, 0, 360, 1],
            TYPE: [ "bigauto4gun", { INDEPENDENT: true, COLOR: -1 } ],
        },
    ],
}
Class.EAB3_eliteDestroyerHoncho = {
    PARENT: "elite",
    UPGRADE_LABEL: "Elite Destroyer",
    UPGRADE_TOOLTIP: "(Honcho)",
    UPGRADE_COLOR: "pink",
    GUNS: [
        ...weaponArray({
            POSITION: [5, 16, 1, 6, 0, 60, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.pounder, g.destroyer]),
                TYPE: "bullet",
                LABEL: "Devastator",
            },
        }, 3),
        ...weaponArray({
            POSITION: [8, 11, 0.5, 6, 0, 0, 0],
        }, 3),
    ],
    TURRETS: [
        ...weaponArray({
            POSITION: [11, 0, 0, 60, 360, 0],
            TYPE: "EAB3_megaCrasherSpawner",
        }, 3),
        {
            POSITION: [11, 0, 0, 0, 360, 1],
            TYPE: [ "bigauto4gun", { INDEPENDENT: true, COLOR: -1 } ],
        },
    ],
}
Class.EAB3_eliteDestroyerDoper = {
    PARENT: "elite",
    UPGRADE_LABEL: "Elite Destroyer",
    UPGRADE_TOOLTIP: "(Doper)",
    UPGRADE_COLOR: "pink",
    GUNS: [
        ...weaponArray({
            POSITION: [5, 16, 1, 6, 0, 60, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.pounder, g.destroyer]),
                TYPE: "bullet",
                LABEL: "Devastator",
            },
        }, 3),
        ...weaponArray({
            POSITION: [4, 2, 0.5, 14, 0, 0, 0],
        }, 3),
    ],
    TURRETS: [
        ...weaponArray({
            POSITION: [11, 0, 0, 60, 360, 0],
            TYPE: "EAB3_fastCrasherSpawner",
        }, 3),
        {
            POSITION: [11, 0, 0, 0, 360, 1],
            TYPE: [ "bigauto4gun", { INDEPENDENT: true, COLOR: -1 } ],
        },
    ],
}

// Elite Gunner
/*
guns: mechanic, driver, specialist
turrets: triplet
*/
Class.EAB3_eliteGunnerMechanic = {
    PARENT: "elite",
    UPGRADE_LABEL: "Elite Gunner",
    UPGRADE_TOOLTIP: "(Mechanic)",
    UPGRADE_COLOR: "pink",
    FACING_TYPE: "toTarget",
    AI: { NO_LEAD: false },
    GUNS: [
        {
            POSITION: [12, 19, 1, 2, 0, 180, 0],
        },
        {
            POSITION: [4, 19, 1.25, 14, 0, 180, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, g.setTrap, g.pounder, g.destroyer, {speed: 1.5, range: 0.3}]),
                TYPE: "unsetPillbox",
                NO_LIMITATIONS: true,
                STAT_CALCULATOR: "trap",
            },
        },
        {
            POSITION: [5, 14, -2, 3, 0, 60, 0],
        },
        {
            POSITION: [5, 14, -2, 3, 0, 300, 0],
        },
    ],
    TURRETS: [
        {
            POSITION: [14, 8, 0, 60, 180, 0],
            TYPE: "auto4gun",
        },
        {
            POSITION: [14, 8, 0, 300, 180, 0],
            TYPE: "auto4gun",
        },
    ],
}
Class.EAB3_eliteGunnerDriver = {
    PARENT: "elite",
    UPGRADE_LABEL: "Elite Gunner",
    UPGRADE_TOOLTIP: "(Driver)",
    UPGRADE_COLOR: "pink",
    FACING_TYPE: "toTarget",
    AI: { NO_LEAD: false },
    GUNS: [
        {
            POSITION: [14, 16, 1, 0, 0, 180, 0],
        },
        {
            POSITION: [4, 16, 1.5, 14, 0, 180, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, g.setTrap, g.pounder, {speed: 1.5, range: 0.3}]),
                TYPE: "EAB3_unsetTwinPillbox",
                NO_LIMITATIONS: true,
                STAT_CALCULATOR: "trap",
            },
        },
        {
            POSITION: [14, 6, 1, 0, 0, 180, 0],
        },
        {
            POSITION: [6, 14, -2, 2, 0, 60, 0],
        },
        {
            POSITION: [6, 14, -2, 2, 0, 300, 0],
        },
    ],
    TURRETS: [
        {
            POSITION: [14, 8, 0, 60, 180, 0],
            TYPE: "auto4gun",
        },
        {
            POSITION: [14, 8, 0, 300, 180, 0],
            TYPE: "auto4gun",
        },
    ],
}
Class.EAB3_eliteGunnerSpecialist = {
    PARENT: "elite",
    UPGRADE_LABEL: "Elite Gunner",
    UPGRADE_TOOLTIP: "(Specialist)",
    UPGRADE_COLOR: "pink",
    FACING_TYPE: "toTarget",
    AI: { NO_LEAD: false },
    GUNS: [
        {
            POSITION: [14, 16, 1, 0, 0, 180, 0],
        },
        {
            POSITION: [14, 6, 0.5, 0, 0, 180, 0],
        },
        {
            POSITION: [4, 16, 1.5, 14, 0, 180, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, g.setTrap, g.pounder, {speed: 1.5, range: 0.3}]),
                TYPE: "EAB3_unsetSwarmPillbox",
                NO_LIMITATIONS: true,
                STAT_CALCULATOR: "trap",
            },
        },
        {
            POSITION: [6, 14, -2, 2, 0, 60, 0],
        },
        {
            POSITION: [6, 14, -2, 2, 0, 300, 0],
        },
    ],
    TURRETS: [
        {
            POSITION: [14, 8, 0, 60, 180, 0],
            TYPE: "auto4gun",
        },
        {
            POSITION: [14, 8, 0, 300, 180, 0],
            TYPE: "auto4gun",
        },
    ],
}
Class.EAB3_eliteGunnerTriplet = {
    PARENT: "elite",
    UPGRADE_LABEL: "Elite Gunner",
    UPGRADE_TOOLTIP: "(Triplet)",
    UPGRADE_COLOR: "pink",
    FACING_TYPE: "toTarget",
    AI: { NO_LEAD: false },
    GUNS: [
        {
            POSITION: [14, 16, 1, 0, 0, 180, 0],
        },
        {
            POSITION: [4, 16, 1.5, 14, 0, 180, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, g.setTrap, g.pounder, {speed: 1.5, range: 0.3}]),
                TYPE: "unsetPillbox",
                NO_LIMITATIONS: true,
                STAT_CALCULATOR: "trap",
            },
        },
        {
            POSITION: [6, 14, -2, 2, 0, 60, 0],
        },
        {
            POSITION: [6, 14, -2, 2, 0, 300, 0],
        },
    ],
    TURRETS: [
        {
            POSITION: [14, 8, 0, 60, 180, 0],
            TYPE: "bigauto4gun",
        },
        {
            POSITION: [14, 8, 0, 300, 180, 0],
            TYPE: "bigauto4gun",
        },
    ],
}

// Elite Sprayer
/*
turrets: redist, atomizer, focal, hexa-machine, tri-sprayer
*/
Class.EAB3_eliteSprayerRedistributor = {
    PARENT: "elite",
    UPGRADE_LABEL: "Elite Sprayer",
    UPGRADE_TOOLTIP: "(Redistributor)",
    UPGRADE_COLOR: "pink",
    SKILL: [3, 5, 5, 5, 3, 1, 0, 9, 1, 0],
    AI: { NO_LEAD: false },
    HAS_NO_RECOIL: true,
    TURRETS: [
        {
            POSITION: [6, 0, 0, 0, 360, 1],
            TYPE: ["machineTripleTurret", { INDEPENDENT: true }],
        },
        ...weaponArray([
            {
                POSITION: [9, 6, -5, 60, 130, 0],
                TYPE: ["redistributor", { COLOR: "grey", GUN_STAT_SCALE: {damage: 0.9, resist: 0.95} }],
            },
            {
                POSITION: [9, 6, 5, 60, 130, 0],
                TYPE: ["redistributor", { COLOR: "grey", GUN_STAT_SCALE: {damage: 0.9, resist: 0.95} }],
            },
        ], 3)
    ],
}
Class.EAB3_eliteSprayerAtomizer = {
    PARENT: "elite",
    UPGRADE_LABEL: "Elite Sprayer",
    UPGRADE_TOOLTIP: "(Atomizer)",
    UPGRADE_COLOR: "pink",
    SKILL: [3, 5, 5, 5, 3, 1, 0, 9, 1, 0],
    AI: { NO_LEAD: false },
    HAS_NO_RECOIL: true,
    TURRETS: [
        {
            POSITION: [6, 0, 0, 0, 360, 1],
            TYPE: ["machineTripleTurret", { INDEPENDENT: true }],
        },
        ...weaponArray([
            {
                POSITION: [9, 6, -5, 60, 130, 0],
                TYPE: ["atomizer", { COLOR: "grey", GUN_STAT_SCALE: {damage: 0.9, resist: 0.95} }],
            },
            {
                POSITION: [9, 6, 5, 60, 130, 0],
                TYPE: ["atomizer", { COLOR: "grey", GUN_STAT_SCALE: {damage: 0.9, resist: 0.95} }],
            },
        ], 3)
    ],
}
Class.EAB3_eliteSprayerFocal = {
    PARENT: "elite",
    UPGRADE_LABEL: "Elite Sprayer",
    UPGRADE_TOOLTIP: "(Focal)",
    UPGRADE_COLOR: "pink",
    SKILL: [3, 5, 5, 5, 3, 1, 0, 9, 1, 0],
    AI: { NO_LEAD: false },
    HAS_NO_RECOIL: true,
    TURRETS: [
        {
            POSITION: [6, 0, 0, 0, 360, 1],
            TYPE: ["machineTripleTurret", { INDEPENDENT: true }],
        },
        ...weaponArray([
            {
                POSITION: [9, 6, -5, 60, 130, 0],
                TYPE: ["focal", { COLOR: "grey", GUN_STAT_SCALE: {damage: 0.9, resist: 0.95} }],
            },
            {
                POSITION: [9, 6, 5, 60, 130, 0],
                TYPE: ["focal", { COLOR: "grey", GUN_STAT_SCALE: {damage: 0.9, resist: 0.95} }],
            },
        ], 3)
    ],
}
Class.EAB3_eliteSprayerHexaMachine = {
    PARENT: "elite",
    UPGRADE_LABEL: "Elite Sprayer",
    UPGRADE_TOOLTIP: "(Hexa Machine)",
    UPGRADE_COLOR: "pink",
    SKILL: [3, 5, 5, 5, 3, 1, 0, 9, 1, 0],
    AI: { NO_LEAD: false },
    HAS_NO_RECOIL: true,
    TURRETS: [
        {
            POSITION: [6, 0, 0, 0, 360, 1],
            TYPE: ["EAB3_machineHexaTurret", { INDEPENDENT: true }],
        },
        ...weaponArray([
            {
                POSITION: [9, 6, -5, 60, 130, 0],
                TYPE: ["sprayer", { COLOR: "grey", GUN_STAT_SCALE: {damage: 0.9, resist: 0.95} }],
            },
            {
                POSITION: [9, 6, 5, 60, 130, 0],
                TYPE: ["sprayer", { COLOR: "grey", GUN_STAT_SCALE: {damage: 0.9, resist: 0.95} }],
            },
        ], 3)
    ],
}
Class.EAB3_eliteSprayerTripleSprayer = {
    PARENT: "elite",
    UPGRADE_LABEL: "Elite Sprayer",
    UPGRADE_TOOLTIP: "(Triple Sprayer)",
    UPGRADE_COLOR: "pink",
    SKILL: [3, 5, 5, 5, 3, 1, 0, 9, 1, 0],
    AI: { NO_LEAD: false },
    HAS_NO_RECOIL: true,
    TURRETS: [
        {
            POSITION: [6, 0, 0, 0, 360, 1],
            TYPE: ["EAB3_sprayerTripleTurret", { INDEPENDENT: true }],
        },
        ...weaponArray([
            {
                POSITION: [9, 6, -5, 60, 130, 0],
                TYPE: ["sprayer", { COLOR: "grey", GUN_STAT_SCALE: {damage: 0.9, resist: 0.95} }],
            },
            {
                POSITION: [9, 6, 5, 60, 130, 0],
                TYPE: ["sprayer", { COLOR: "grey", GUN_STAT_SCALE: {damage: 0.9, resist: 0.95} }],
            },
        ], 3)
    ],
}

// Elite Battleship
/*
guns: carrier, honcho, doper
turrets: more, twin, mega
*/
Class.EAB3_eliteBattleshipCarrier = {
    PARENT: "elite",
    UPGRADE_LABEL: "Elite Battleship",
    UPGRADE_TOOLTIP: "(Carrier)",
    UPGRADE_COLOR: "pink",
    GUNS: weaponArray([
        {
            POSITION: [3.75, 5.5, 0.6, 7, -8, 60, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.swarm, g.battleship, {speed: 0.95, maxSpeed: 0.95, health: 1.1, resist: 1.05}]),
                TYPE: "autoswarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [3.75, 5.5, 0.6, 7, -2.666, 60, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.swarm, g.battleship, {speed: 0.95, maxSpeed: 0.95, health: 1.1, resist: 1.05}]),
                TYPE: "autoswarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [3.75, 5.5, 0.6, 7, 2.666, 60, 0.25],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.swarm, g.battleship, {speed: 0.95, maxSpeed: 0.95, health: 1.1, resist: 1.05}]),
                TYPE: "autoswarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [3.75, 5.5, 0.6, 7, 8, 60, 0.75],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.swarm, g.battleship, {speed: 0.95, maxSpeed: 0.95, health: 1.1, resist: 1.05}]),
                TYPE: "autoswarm",
                STAT_CALCULATOR: "swarm",
            },
        },
    ], 3),
    TURRETS: weaponArray({
        POSITION: [5, 7, 0, 0, 360, 1],
        TYPE: [ "autoTankGun", { INDEPENDENT: true, COLOR: -1 } ],
    }, 3)
}
Class.EAB3_eliteBattleshipHoncho = {
    PARENT: "elite",
    UPGRADE_LABEL: "Elite Battleship",
    UPGRADE_TOOLTIP: "(Honcho)",
    UPGRADE_COLOR: "pink",
    GUNS: weaponArray([
        {
            POSITION: [4, 7, 0.7, 7, -8, 60, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.swarm, g.pounder, g.battleship, {speed: 0.95, maxSpeed: 0.95, health: 1.1, resist: 1.05}]),
                TYPE: "autoswarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [4, 7, 0.7, 7, 0, 60, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.swarm, g.pounder, g.battleship, {speed: 0.95, maxSpeed: 0.95, health: 1.1, resist: 1.05}]),
                TYPE: "autoswarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [4, 7, 0.7, 7, 8, 60, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.swarm, g.pounder, g.battleship, {speed: 0.95, maxSpeed: 0.95, health: 1.1, resist: 1.05}]),
                TYPE: "autoswarm",
                STAT_CALCULATOR: "swarm",
            },
        },
    ], 3),
    TURRETS: weaponArray({
        POSITION: [5, 7, 0, 0, 360, 1],
        TYPE: [ "autoTankGun", { INDEPENDENT: true, COLOR: -1 } ],
    }, 3)
}
Class.EAB3_eliteBattleshipDoper = {
    PARENT: "elite",
    UPGRADE_LABEL: "Elite Battleship",
    UPGRADE_TOOLTIP: "(Doper)",
    UPGRADE_COLOR: "pink",
    GUNS: weaponArray([
        {
            POSITION: [4, 6, 0.6, 7, -8, 60, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.swarm, g.battleship, {speed: 0.95, maxSpeed: 0.95, health: 1.1, resist: 1.05}, doper]),
                TYPE: "autoswarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [4, 6, 0.6, 7, 0, 60, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.swarm, g.battleship, {speed: 0.95, maxSpeed: 0.95, health: 1.1, resist: 1.05}, doper]),
                TYPE: "autoswarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [4, 6, 0.6, 7, 8, 60, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.swarm, g.battleship, {speed: 0.95, maxSpeed: 0.95, health: 1.1, resist: 1.05}, doper]),
                TYPE: "autoswarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [4.8, 6/11, -5, 7, -8, 60, 0],
        },
        {
            POSITION: [4.8, 6/11, -5, 7, 0, 60, 0],
        },
        {
            POSITION: [4.8, 6/11, -5, 7, 8, 60, 0],
        },
    ], 3),
    TURRETS: weaponArray({
        POSITION: [5, 7, 0, 0, 360, 1],
        TYPE: [ "autoTankGun", { INDEPENDENT: true, COLOR: -1 } ],
    }, 3)
}
Class.EAB3_eliteBattleshipMore = {
    PARENT: "elite",
    UPGRADE_LABEL: "Elite Battleship",
    UPGRADE_TOOLTIP: "(More)",
    UPGRADE_COLOR: "pink",
    GUNS: weaponArray([
        {
            POSITION: [4, 6, 0.6, 7, -8, 60, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.swarm, g.battleship, {speed: 0.95, maxSpeed: 0.95, health: 1.1, resist: 1.05}]),
                TYPE: "autoswarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [4, 6, 0.6, 7, 0, 60, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.swarm, g.battleship, {speed: 0.95, maxSpeed: 0.95, health: 1.1, resist: 1.05}]),
                TYPE: "autoswarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [4, 6, 0.6, 7, 8, 60, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.swarm, g.battleship, {speed: 0.95, maxSpeed: 0.95, health: 1.1, resist: 1.05}]),
                TYPE: "autoswarm",
                STAT_CALCULATOR: "swarm",
            },
        },
    ], 3),
    TURRETS: [
        ...weaponArray({
            POSITION: [5, 7, 0, 0, 360, 1],
            TYPE: [ "autoTankGun", { INDEPENDENT: true, COLOR: -1 } ],
        }, 3),
        ...weaponArray({
            POSITION: [5, 3.5, 0, 60, 360, 1],
            TYPE: [ "autoTankGun", { INDEPENDENT: true, COLOR: -1 } ],
        }, 3)
    ]
}
Class.EAB3_eliteBattleshipTwin = {
    PARENT: "elite",
    UPGRADE_LABEL: "Elite Battleship",
    UPGRADE_TOOLTIP: "(Twin)",
    UPGRADE_COLOR: "pink",
    GUNS: weaponArray([
        {
            POSITION: [4, 6, 0.6, 7, -8, 60, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.swarm, g.battleship, {speed: 0.95, maxSpeed: 0.95, health: 1.1, resist: 1.05}]),
                TYPE: "autoswarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [4, 6, 0.6, 7, 0, 60, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.swarm, g.battleship, {speed: 0.95, maxSpeed: 0.95, health: 1.1, resist: 1.05}]),
                TYPE: "autoswarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [4, 6, 0.6, 7, 8, 60, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.swarm, g.battleship, {speed: 0.95, maxSpeed: 0.95, health: 1.1, resist: 1.05}]),
                TYPE: "autoswarm",
                STAT_CALCULATOR: "swarm",
            },
        },
    ], 3),
    TURRETS: weaponArray({
        POSITION: [7, 7, 0, 0, 360, 1],
        TYPE: [ "auto4gun", { INDEPENDENT: true, COLOR: -1 } ],
    }, 3)
}
Class.EAB3_eliteBattleshipMega = {
    PARENT: "elite",
    UPGRADE_LABEL: "Elite Battleship",
    UPGRADE_TOOLTIP: "(Mega)",
    UPGRADE_COLOR: "pink",
    GUNS: weaponArray([
        {
            POSITION: [4, 6, 0.6, 7, -8, 60, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.swarm, g.battleship, {speed: 0.95, maxSpeed: 0.95, health: 1.1, resist: 1.05}]),
                TYPE: "autoswarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [4, 6, 0.6, 7, 0, 60, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.swarm, g.battleship, {speed: 0.95, maxSpeed: 0.95, health: 1.1, resist: 1.05}]),
                TYPE: "autoswarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [4, 6, 0.6, 7, 8, 60, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.swarm, g.battleship, {speed: 0.95, maxSpeed: 0.95, health: 1.1, resist: 1.05}]),
                TYPE: "autoswarm",
                STAT_CALCULATOR: "swarm",
            },
        },
    ], 3),
    TURRETS: weaponArray({
        POSITION: [6, 7, 0, 0, 360, 1],
        TYPE: [ "megaAutoTankGun", { INDEPENDENT: true, COLOR: -1 } ],
    }, 3)
}

// Elite Spawner
/*
guns: factory, honcho, doper
turrets: triplet
*/
Class.EAB3_superSentrySwarmMinion = {
    PARENT: 'sentrySwarmMinion',
    GUNS: weaponMirror({
        POSITION: [7, 10, 0.6, 7, 5.5, 180, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.swarm, { recoil: 1.15, range: 0.9 }]),
            TYPE: "swarm",
            STAT_CALCULATOR: "swarm",
        },
    }, {delayIncrement: 0.5})
}
Class.EAB3_superSentryGunMinion = {
    PARENT: 'sentryGunMinion',
    TURRETS: [
        {
            POSITION: [12, 0, 0, 0, 360, 1],
            TYPE: ['ultraAutoTankGun', {GUN_STAT_SCALE: {health: 0.8}}]
        }
    ]
}
Class.EAB3_superSentryTrapMinion = {
    PARENT: 'sentryTrapMinion',
    TURRETS: [
        {
            POSITION: [12, 0, 0, 0, 360, 1],
            TYPE: 'megaTrapTurret'
        }
    ]
}
Class.EAB3_eliteSpawnerFactory = {
    PARENT: "elite",
    UPGRADE_LABEL: "Elite Spawner",
    UPGRADE_TOOLTIP: "(Factory)",
    UPGRADE_COLOR: "pink",
    MAX_CHILDREN: 9,
    AI: { STRAFE: false },
    SKILL_CAP: Array(10).fill(15),
    SKILL: [15, 8, 8, 8, 5, 1, 0, 9, 1, 0],
    GUNS: [
        ...weaponArray([
            {
                POSITION: [11.5, 16, 1, 0, 0, 60, 0],
            },
        ], 3),
        ...weaponArray([
            {
                POSITION: [9.675, 18, 1, 0, 0, 60, 0],
            },
        ], 3),
        {
            POSITION: [1.8, 18, 1, 11.5, 0, 60, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.drone, {reload: 2, size: 0.5, speed: 0.6, maxSpeed: 0.6, heath: 1.35}]),
                TYPE: "EAB3_superSentrySwarmMinion",
                NO_LIMITATIONS: true,
                SYNCS_SKILLS: true,
                AUTOFIRE: true,
                STAT_CALCULATOR: "drone",
            },
        },
        {
            POSITION: [1.8, 18, 1, 11.5, 0, 180, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.drone, {reload: 2, size: 0.5, speed: 0.6, maxSpeed: 0.6, heath: 1.35}]),
                TYPE: "EAB3_superSentryTrapMinion",
                NO_LIMITATIONS: true,
                SYNCS_SKILLS: true,
                AUTOFIRE: true,
                STAT_CALCULATOR: "drone",
            },
        },
        {
            POSITION: [1.8, 18, 1, 11.5, 0, 300, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.drone, {reload: 2, size: 0.5, speed: 0.6, maxSpeed: 0.6, heath: 1.35}]),
                TYPE: "EAB3_superSentryGunMinion",
                NO_LIMITATIONS: true,
                SYNCS_SKILLS: true,
                AUTOFIRE: true,
                STAT_CALCULATOR: "drone",
            },
        },
    ],
    TURRETS: [
        {
            POSITION: [11, 0, 0, 0, 360, 1],
            TYPE: ["auto4gun", { INDEPENDENT: false, COLOR: -1 }],
        },
    ],
}
Class.EAB3_eliteSpawnerHoncho = {
    PARENT: "elite",
    UPGRADE_LABEL: "Elite Spawner",
    UPGRADE_TOOLTIP: "(Honcho)",
    UPGRADE_COLOR: "pink",
    MAX_CHILDREN: 6,
    AI: { STRAFE: false },
    SKILL_CAP: Array(10).fill(15),
    SKILL: [15, 8, 8, 8, 5, 1, 0, 9, 1, 0],
    GUNS: [
        ...weaponArray([
            {
                POSITION: [10, 18.5, 1, 1, 0, 60, 0],
            },
        ], 3),
        {
            POSITION: [2, 20, 1, 11, 0, 60, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.drone, g.pounder, {reload: 2, size: 0.5, speed: 0.6, maxSpeed: 0.6, heath: 1.35}]),
                TYPE: "sentrySwarmMinion",
                NO_LIMITATIONS: true,
                SYNCS_SKILLS: true,
                AUTOFIRE: true,
                STAT_CALCULATOR: "drone",
            },
        },
        {
            POSITION: [2, 20, 1, 11, 0, 180, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.drone, g.pounder, {reload: 2, size: 0.5, speed: 0.6, maxSpeed: 0.6, heath: 1.35}]),
                TYPE: "sentryTrapMinion",
                NO_LIMITATIONS: true,
                SYNCS_SKILLS: true,
                AUTOFIRE: true,
                STAT_CALCULATOR: "drone",
            },
        },
        {
            POSITION: [2, 20, 1, 11, 0, 300, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.drone, g.pounder, {reload: 2, size: 0.5, speed: 0.6, maxSpeed: 0.6, heath: 1.35}]),
                TYPE: "sentryGunMinion",
                NO_LIMITATIONS: true,
                SYNCS_SKILLS: true,
                AUTOFIRE: true,
                STAT_CALCULATOR: "drone",
            },
        },
    ],
    TURRETS: [
        {
            POSITION: [11, 0, 0, 0, 360, 1],
            TYPE: ["auto4gun", { INDEPENDENT: false, COLOR: -1 }],
        },
    ],
}
Class.EAB3_eliteSpawnerDoper = {
    PARENT: "elite",
    UPGRADE_LABEL: "Elite Spawner",
    UPGRADE_TOOLTIP: "(Doper)",
    UPGRADE_COLOR: "pink",
    MAX_CHILDREN: 6,
    AI: { STRAFE: false },
    SKILL_CAP: Array(10).fill(15),
    SKILL: [15, 8, 8, 8, 5, 1, 0, 9, 1, 0],
    GUNS: [
        ...weaponArray([
            {
                POSITION: [11, 16, 1, 0, 0, 60, 0],
            },
        ], 3),
        {
            POSITION: [2, 18, 1, 11, 0, 60, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.drone, {reload: 2, size: 0.5, speed: 0.6, maxSpeed: 0.6, heath: 1.35}, doper]),
                TYPE: "sentrySwarmMinion",
                NO_LIMITATIONS: true,
                SYNCS_SKILLS: true,
                AUTOFIRE: true,
                STAT_CALCULATOR: "drone",
            },
        },
        {
            POSITION: [2, 18, 1, 11, 0, 180, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.drone, {reload: 2, size: 0.5, speed: 0.6, maxSpeed: 0.6, heath: 1.35}, doper]),
                TYPE: "sentryTrapMinion",
                NO_LIMITATIONS: true,
                SYNCS_SKILLS: true,
                AUTOFIRE: true,
                STAT_CALCULATOR: "drone",
            },
        },
        {
            POSITION: [2, 18, 1, 11, 0, 300, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.drone, {reload: 2, size: 0.5, speed: 0.6, maxSpeed: 0.6, heath: 1.35}, doper]),
                TYPE: "sentryGunMinion",
                NO_LIMITATIONS: true,
                SYNCS_SKILLS: true,
                AUTOFIRE: true,
                STAT_CALCULATOR: "drone",
            },
        },
        ...weaponArray([
            {
                POSITION: [14, 7/11, -5, 0, 0, 60, 0],
            },
        ], 3),
    ],
    TURRETS: [
        {
            POSITION: [11, 0, 0, 0, 360, 1],
            TYPE: ["auto4gun", { INDEPENDENT: false, COLOR: -1 }],
        },
    ],
}
Class.EAB3_eliteSpawnerTriplet = {
    PARENT: "elite",
    UPGRADE_LABEL: "Elite Spawner",
    UPGRADE_TOOLTIP: "(Triplet)",
    UPGRADE_COLOR: "pink",
    MAX_CHILDREN: 9,
    AI: { STRAFE: false },
    SKILL_CAP: Array(10).fill(15),
    SKILL: [15, 8, 8, 8, 5, 1, 0, 9, 1, 0],
    GUNS: [
        ...weaponArray([
            {
                POSITION: [11, 16, 1, 0, 0, 60, 0],
            },
        ], 3),
        {
            POSITION: [2, 18, 1, 11, 0, 60, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.drone, {reload: 2, size: 0.5, speed: 0.6, maxSpeed: 0.6, heath: 1.35}]),
                TYPE: "sentrySwarmMinion",
                NO_LIMITATIONS: true,
                SYNCS_SKILLS: true,
                AUTOFIRE: true,
                STAT_CALCULATOR: "drone",
            },
        },
        {
            POSITION: [2, 18, 1, 11, 0, 180, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.drone, {reload: 2, size: 0.5, speed: 0.6, maxSpeed: 0.6, heath: 1.35}]),
                TYPE: "sentryTrapMinion",
                NO_LIMITATIONS: true,
                SYNCS_SKILLS: true,
                AUTOFIRE: true,
                STAT_CALCULATOR: "drone",
            },
        },
        {
            POSITION: [2, 18, 1, 11, 0, 300, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.drone, {reload: 2, size: 0.5, speed: 0.6, maxSpeed: 0.6, heath: 1.35}]),
                TYPE: "sentryGunMinion",
                NO_LIMITATIONS: true,
                SYNCS_SKILLS: true,
                AUTOFIRE: true,
                STAT_CALCULATOR: "drone",
            },
        },
    ],
    TURRETS: [
        {
            POSITION: [11, 0, 0, 0, 360, 1],
            TYPE: ["bigauto4gun", { INDEPENDENT: false, COLOR: -1 }],
        },
    ],
}

// Elite Trap Guard
/*
guns: builder, mech
turrets: twin, mega, coop, tri-peashooter
*/
Class.EAB3_eliteTrapGuardBuilder = {
    PARENT: "elite",
    UPGRADE_LABEL: "Elite Trap Guard",
    UPGRADE_TOOLTIP: "(Builder)",
    UPGRADE_COLOR: "pink",
    AI: { STRAFE: false },
    GUNS: weaponArray([
        {
            POSITION: [12, 6, 1, 0, 0, 60, 0],
        },
        {
            POSITION: [1.5, 6, 1.2, 12, 0, 60, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, g.setTrap, {speed: 1.1, maxSpeed: 1.1, reload: 1.5, damage: 1.6}]),
                TYPE: "unsetTrap",
                STAT_CALCULATOR: "trap",
            },
        },
    ], 3),
    TURRETS: [
        {
            POSITION: [9.5, 0, 0, 0, 360, 1],
            TYPE: "triTrapGuardTurret",
        },
        ...weaponArray([
            {
                POSITION: [5, 8, -7, 60, 160, 0],
                TYPE: ["autoTurret", { INDEPENDENT: false, GUN_STAT_SCALE: {health: 1.1} }],
            },
            {
                POSITION: [5, 8, 7, 60, 160, 0],
                TYPE: ["autoTurret", { INDEPENDENT: false, GUN_STAT_SCALE: {health: 1.1} }],
            },
        ], 3)
    ],
}
Class.EAB3_eliteTrapGuardMech = {
    PARENT: "elite",
    UPGRADE_LABEL: "Elite Trap Guard",
    UPGRADE_TOOLTIP: "(Mech)",
    UPGRADE_COLOR: "pink",
    AI: { STRAFE: false },
    GUNS: weaponArray([
        {
            POSITION: [11, 6, 1, 0, 0, 60, 0],
        },
        {
            POSITION: [3, 6, 1.7, 11, 0, 60, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, {speed: 1.1, maxSpeed: 1.1, reload: 1.5, damage: 1.6}]),
                TYPE: "EAB3_turretedTrap",
                STAT_CALCULATOR: "trap",
            },
        },
        {
            POSITION: [10, 8, 1, 0, 0, 60, 0],
        },
    ], 3),
    TURRETS: [
        {
            POSITION: [9.5, 0, 0, 0, 360, 1],
            TYPE: "triTrapGuardTurret",
        },
        ...weaponArray([
            {
                POSITION: [5, 8, -7, 60, 160, 0],
                TYPE: ["autoTurret", { INDEPENDENT: false, GUN_STAT_SCALE: {health: 1.1} }],
            },
            {
                POSITION: [5, 8, 7, 60, 160, 0],
                TYPE: ["autoTurret", { INDEPENDENT: false, GUN_STAT_SCALE: {health: 1.1} }],
            },
        ], 3)
    ],
}
Class.EAB3_eliteTrapGuardTwin = {
    PARENT: "elite",
    UPGRADE_LABEL: "Elite Trap Guard",
    UPGRADE_TOOLTIP: "(Twin)",
    UPGRADE_COLOR: "pink",
    AI: { STRAFE: false },
    GUNS: weaponArray([
        {
            POSITION: [10.5, 6, 1, 0, 0, 60, 0],
        },
        {
            POSITION: [3, 6, 1.7, 10.5, 0, 60, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, {speed: 1.1, maxSpeed: 1.1, reload: 1.5, damage: 1.6}]),
                TYPE: "trap",
                STAT_CALCULATOR: "trap",
            },
        },
    ], 3),
    TURRETS: [
        {
            POSITION: [9.5, 0, 0, 0, 360, 1],
            TYPE: "triTrapGuardTurret",
        },
        ...weaponArray([
            {
                POSITION: [6.5, 8, -7, 60, 160, 0],
                TYPE: ["auto4gun", { INDEPENDENT: false, GUN_STAT_SCALE: {health: 1.1} }],
            },
            {
                POSITION: [6.5, 8, 7, 60, 160, 0],
                TYPE: ["auto4gun", { INDEPENDENT: false, GUN_STAT_SCALE: {health: 1.1} }],
            },
        ], 3)
    ],
}
Class.EAB3_eliteTrapGuardMega = {
    PARENT: "elite",
    UPGRADE_LABEL: "Elite Trap Guard",
    UPGRADE_TOOLTIP: "(Mega)",
    UPGRADE_COLOR: "pink",
    AI: { STRAFE: false },
    GUNS: weaponArray([
        {
            POSITION: [10.5, 6, 1, 0, 0, 60, 0],
        },
        {
            POSITION: [3, 6, 1.7, 10.5, 0, 60, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, {speed: 1.1, maxSpeed: 1.1, reload: 1.5, damage: 1.6}]),
                TYPE: "trap",
                STAT_CALCULATOR: "trap",
            },
        },
    ], 3),
    TURRETS: [
        {
            POSITION: [9.5, 0, 0, 0, 360, 1],
            TYPE: "triTrapGuardTurret",
        },
        ...weaponArray([
            {
                POSITION: [6, 8, -7.7, 60, 160, 0],
                TYPE: ["megaAutoTankGun", { INDEPENDENT: false, GUN_STAT_SCALE: {health: 1.1} }],
            },
            {
                POSITION: [6, 8, 7.7, 60, 160, 0],
                TYPE: ["megaAutoTankGun", { INDEPENDENT: false, GUN_STAT_SCALE: {health: 1.1} }],
            },
        ], 3)
    ],
}
Class.EAB3_eliteTrapGuardPeashooter = {
    PARENT: "elite",
    UPGRADE_LABEL: "Elite Trap Guard",
    UPGRADE_TOOLTIP: "(Peashooter)",
    UPGRADE_COLOR: "pink",
    AI: { STRAFE: false },
    GUNS: weaponArray([
        {
            POSITION: [10.5, 6, 1, 0, 0, 60, 0],
        },
        {
            POSITION: [3, 6, 1.7, 10.5, 0, 60, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, {speed: 1.1, maxSpeed: 1.1, reload: 1.5, damage: 1.6}]),
                TYPE: "trap",
                STAT_CALCULATOR: "trap",
            },
        },
    ], 3),
    TURRETS: [
        {
            POSITION: [9.5, 0, 0, 0, 360, 1],
            TYPE: "EAB3_triPeashooterTurret",
        },
        ...weaponArray([
            {
                POSITION: [5, 8, -7, 60, 160, 0],
                TYPE: ["autoTurret", { INDEPENDENT: false, GUN_STAT_SCALE: {health: 1.1} }],
            },
            {
                POSITION: [5, 8, 7, 60, 160, 0],
                TYPE: ["autoTurret", { INDEPENDENT: false, GUN_STAT_SCALE: {health: 1.1} }],
            },
        ], 3)
    ],
}

// Elite Spinner
/*
guns: tornado, tempest, whirlwind
turrets: gale, trove
*/
Class.EAB3_eliteSpinnerTornado = {
    PARENT: "elite",
    UPGRADE_LABEL: "Elite Spinner",
    UPGRADE_TOOLTIP: "(Tornado)",
    UPGRADE_COLOR: "pink",
    AI: { STRAFE: false },
    FACING_TYPE: ["spin", {speed: 0.08}],
    GUNS: weaponArray([
        {
            POSITION: [9.5, 3.5, 1, -1.5, 10.7, 10, 2/3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.gunner, { speed: 1.5, maxSpeed: 1.25 }, g.pounder]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [9.5, 3.5, 1, 3.5, 5.95, 10, 1/3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.gunner, { speed: 1.5, maxSpeed: 1.25 }, g.pounder]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [9.5, 3.5, 1, 8.5, 1, 10, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.gunner, { speed: 1.5, maxSpeed: 1.25 }, g.pounder]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [2, 20, 0.75, 8, 0, 60, 0],
        },
    ], 3),
    TURRETS: [
        {
            POSITION: [9.5, 0, 0, 0, 360, 1],
            TYPE: ["eliteSpinnerCyclone", {COLOR: -1}],
        },
    ],
}
Class.EAB3_eliteSpinnerTempest = {
    PARENT: "elite",
    UPGRADE_LABEL: "Elite Spinner",
    UPGRADE_TOOLTIP: "(Tempest)",
    UPGRADE_COLOR: "pink",
    AI: { STRAFE: false },
    FACING_TYPE: ["spin", {speed: 0.08}],
    GUNS: weaponArray([
        {
            POSITION: [9.5, 2, 1, -1.5, 11.5, 10, 4/5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.gunner, { speed: 1.5, maxSpeed: 1.25 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [9.5, 2, 1, 1, 9, 10, 3/5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.gunner, { speed: 1.5, maxSpeed: 1.25 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [9.5, 2, 1, 3.5, 6.5, 10, 2/5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.gunner, { speed: 1.5, maxSpeed: 1.25 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [9.5, 2, 1, 6, 4, 10, 1/5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.gunner, { speed: 1.5, maxSpeed: 1.25 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [9.5, 2, 1, 8.5, 1.5, 10, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.gunner, { speed: 1.5, maxSpeed: 1.25 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [2, 20, 0.75, 8, 0, 60, 0],
        },
    ], 3),
    TURRETS: [
        {
            POSITION: [9.5, 0, 0, 0, 360, 1],
            TYPE: ["eliteSpinnerCyclone", {COLOR: -1}],
        },
    ],
}
Class.EAB3_eliteSpinnerWhirlwind = {
    PARENT: "elite",
    UPGRADE_LABEL: "Elite Spinner",
    UPGRADE_TOOLTIP: "(Whirlwind)",
    UPGRADE_COLOR: "pink",
    AI: { STRAFE: false },
    FACING_TYPE: ["spin", {speed: 0.08}],
    GUNS: weaponArray([
        {
            POSITION: [8.5, 2, 1, -1.5, 11.5, 10, 2/3],
        },
        {
            POSITION: [8.5, 2, 1, 3.5, 6.5, 10, 1/3],
        },
        {
            POSITION: [8.5, 2, 1, 8.5, 1.5, 10, 0],
        },
        {
            POSITION: [1.5, 2, 1.3, 7, 11.5, 10, 2/3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, g.twin, g.gunner, { speed: 1.5, maxSpeed: 1.25 }]),
                TYPE: "trap",
            },
        },
        {
            POSITION: [1.5, 2, 1.3, 12, 6.5, 10, 1/3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, g.twin, g.gunner, { speed: 1.5, maxSpeed: 1.25 }]),
                TYPE: "trap",
            },
        },
        {
            POSITION: [1.5, 2, 1.3, 17, 1.5, 10, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, g.twin, g.gunner, { speed: 1.5, maxSpeed: 1.25 }]),
                TYPE: "trap",
            },
        },
        {
            POSITION: [2, 20, 0.75, 8, 0, 60, 0],
        },
    ], 3),
    TURRETS: [
        {
            POSITION: [9.5, 0, 0, 0, 360, 1],
            TYPE: ["eliteSpinnerCyclone", {COLOR: -1}],
        },
    ],
}
Class.EAB3_eliteSpinnerGale = {
    PARENT: "elite",
    UPGRADE_LABEL: "Elite Spinner",
    UPGRADE_TOOLTIP: "(Gale)",
    UPGRADE_COLOR: "pink",
    AI: { STRAFE: false },
    FACING_TYPE: ["spin", {speed: 0.08}],
    GUNS: weaponArray([
        {
            POSITION: [9.5, 2, 1, -1.5, 11.5, 10, 2/3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.gunner, { speed: 1.5, maxSpeed: 1.25 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [9.5, 2, 1, 3.5, 6.5, 10, 1/3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.gunner, { speed: 1.5, maxSpeed: 1.25 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [9.5, 2, 1, 8.5, 1.5, 10, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.gunner, { speed: 1.5, maxSpeed: 1.25 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [2, 20, 0.75, 8, 0, 60, 0],
        },
    ], 3),
    TURRETS: [
        {
            POSITION: [9.5, 0, 0, 0, 360, 1],
            TYPE: ["EAB3_eliteSpinnerGaleTurret", {COLOR: -1}],
        },
    ],
}
Class.EAB3_eliteSpinnerTrove = {
    PARENT: "elite",
    UPGRADE_LABEL: "Elite Spinner",
    UPGRADE_TOOLTIP: "(Trove)",
    UPGRADE_COLOR: "pink",
    AI: { STRAFE: false },
    FACING_TYPE: ["spin", {speed: 0.08}],
    GUNS: weaponArray([
        {
            POSITION: [9.5, 2, 1, -1.5, 11.5, 10, 2/3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.gunner, { speed: 1.5, maxSpeed: 1.25 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [9.5, 2, 1, 3.5, 6.5, 10, 1/3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.gunner, { speed: 1.5, maxSpeed: 1.25 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [9.5, 2, 1, 8.5, 1.5, 10, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.gunner, { speed: 1.5, maxSpeed: 1.25 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [2, 20, 0.75, 8, 0, 60, 0],
        },
    ], 3),
    TURRETS: [
        {
            POSITION: [9.5, 0, 0, 0, 360, 1],
            TYPE: ["EAB3_eliteSpinnerTroveTurret", {COLOR: -1}],
        },
    ],
}

// Elite Skimmer
/*
turrets: hyperskimmer, bazooka, skidder, ticker
*/
Class.EAB3_eliteSkimmerHyperSkimmer = {
    PARENT: "elite",
    LABEL: "Elite Skimmer",
    UPGRADE_TOOLTIP: "(Hyper Skimmer)",
    COLOR: "triangle",
    UPGRADE_COLOR: "triangle",
    TURRETS: weaponArray({
        TYPE: "EAB3_ultraSkimmerTurret",
        POSITION: [15, 5, 0, 60, 170, 0]
    }, 3)
}
Class.EAB3_eliteSkimmerBazooka = {
    PARENT: "elite",
    LABEL: "Elite Skimmer",
    UPGRADE_TOOLTIP: "(Bazooka)",
    COLOR: "triangle",
    UPGRADE_COLOR: "triangle",
    TURRETS: weaponArray({
        TYPE: "EAB3_bazookaTurret",
        POSITION: [15, 5, 0, 60, 170, 0]
    }, 3)
}
Class.EAB3_eliteSkimmerSkidder = {
    PARENT: "elite",
    LABEL: "Elite Skimmer",
    UPGRADE_TOOLTIP: "(Skidder)",
    COLOR: "triangle",
    UPGRADE_COLOR: "triangle",
    TURRETS: weaponArray({
        TYPE: "EAB3_skidderTurret",
        POSITION: [15, 5, 0, 60, 170, 0]
    }, 3)
}
Class.EAB3_eliteSkimmerTicker = {
    PARENT: "elite",
    LABEL: "Elite Skimmer",
    UPGRADE_TOOLTIP: "(Ticker)",
    COLOR: "triangle",
    UPGRADE_COLOR: "triangle",
    TURRETS: weaponArray({
        TYPE: "EAB3_tickerTurret",
        POSITION: [15, 5, 0, 60, 170, 0]
    }, 3)
}


// LEGIONARY CRASHER

// MYSTICALS
/*drive, honcho, doper*/
const mystical_gun_position = {
    LENGTH: 3.5,
    WIDTH: 8.65,
    ASPECT: 1.2,
    X: 8
}
const mystical_gun_position_honcho = {
    LENGTH: 4,
    WIDTH: 10,
    ASPECT: 1.15,
    X: 8
}
const mystical_gun_position_doper = {
    LENGTH: 4.2,
    WIDTH: 0.78636363636,
    ASPECT: -5,
    X: 8
}
// Sorcerer
Class.EAB3_sorcererBase = {
    PARENT: "miniboss",
    LABEL: "Sorcerer",
    DANGER: 7,
    SHAPE: 0,
    COLOR: "egg",
    UPGRADE_COLOR: "egg",
    SIZE: 26,
    MAX_CHILDREN: 50,
    VALUE: 2e5,
    BODY: {
        FOV: 0.5,
        SPEED: 0.12 * base.SPEED,
        HEALTH: 6 * base.HEALTH,
        DAMAGE: 2 * base.DAMAGE,
    },
}
Class.EAB3_turretedEggchip = makeAuto('sorcererDrone', "Auto-Drone", {type: 'droneAutoTurret'})
Class.EAB3_sorcererdrive = {
    PARENT: "EAB3_sorcererBase",
    LABEL: "Sorcererdrive",
    UPGRADE_TOOLTIP: "(Drive)",
    BODY: {
        FOV: 0.75,
    },
    GUNS: weaponArray({
        POSITION: mystical_gun_position,
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.drone, g.summoner, g.machineGun, g.machineGunner, { damage: 1.8, size: 0.4, spray: 150, speed: 2, shudder: 1.75 }]),
            TYPE: "EAB3_turretedEggchip",
            AUTOFIRE: true,
            SYNCS_SKILLS: true,
            STAT_CALCULATOR: "drone",
            WAIT_TO_CYCLE: true,
        },
    }, 2),
    TURRETS: [
        {
            POSITION: [9, 0, 0, 0, 360, 1],
            TYPE: ["genericTank", {INDEPENDENT: true, MIRROR_MASTER_ANGLE: true, COLOR: "grey"}],
        },
    ],
}
Class.EAB3_sorcererHoncho = {
    PARENT: "EAB3_sorcererBase",
    LABEL: "Sorcerer",
    UPGRADE_TOOLTIP: "(Honcho)",
    MAX_CHILDREN: 30,
    GUNS: weaponArray({
        POSITION: mystical_gun_position_honcho,
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.drone, g.pounder, g.summoner, g.machineGun, g.machineGunner, { damage: 1.8, size: 0.4, spray: 150, speed: 2, shudder: 1.75 }]),
            TYPE: "sorcererDrone",
            AUTOFIRE: true,
            SYNCS_SKILLS: true,
            STAT_CALCULATOR: "drone",
            WAIT_TO_CYCLE: true,
        },
    }, 2),
}
Class.EAB3_sorcererDoper = {
    PARENT: "EAB3_sorcererBase",
    LABEL: "Sorcerer",
    UPGRADE_TOOLTIP: "(Doper)",
    MAX_CHILDREN: 45,
    GUNS: [
        ...weaponArray({
            POSITION: mystical_gun_position,
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.drone, g.summoner, g.machineGun, g.machineGunner, { damage: 1.8, size: 0.4, spray: 150, speed: 2, shudder: 1.75 }, doper]),
                TYPE: "sorcererDrone",
                AUTOFIRE: true,
                SYNCS_SKILLS: true,
                STAT_CALCULATOR: "drone",
                WAIT_TO_CYCLE: true,
            },
        }, 2),
        ...weaponArray({
            POSITION: mystical_gun_position_doper,
        }, 2),
    ]
}
// Summoner
Class.EAB3_summonerBase = {
    PARENT: "miniboss",
    LABEL: "Summoner",
    DANGER: 8,
    SHAPE: 4,
    COLOR: "square",
    UPGRADE_COLOR: "square",
    SIZE: 26,
    MAX_CHILDREN: 28,
    VALUE: 3e5,
    BODY: {
        FOV: 0.5,
        SPEED: 0.1 * base.SPEED,
        HEALTH: 7 * base.HEALTH,
        DAMAGE: 2.6 * base.DAMAGE,
    },
}
Class.EAB3_turretedSunchip = makeAuto('summonerDrone', "Auto-Drone", {type: 'droneAutoTurret'})
Class.EAB3_summonerdrive = {
    PARENT: "EAB3_summonerBase",
    LABEL: "Summonerdrive",
    UPGRADE_TOOLTIP: "(Drive)",
    BODY: {
        FOV: 0.75,
    },
    GUNS: weaponArray({
        POSITION: mystical_gun_position,
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.drone, g.summoner, { size: 0.8 }]),
            TYPE: "EAB3_turretedSunchip",
            AUTOFIRE: true,
            SYNCS_SKILLS: true,
            STAT_CALCULATOR: "drone",
            WAIT_TO_CYCLE: true,
        },
    }, 4),
    TURRETS: [
        {
            POSITION: [9, 0, 0, 0, 360, 1],
            TYPE: ["square", {INDEPENDENT: true, MIRROR_MASTER_ANGLE: true, COLOR: "grey"}],
        },
    ],
}
Class.EAB3_summonerHoncho = {
    PARENT: "EAB3_summonerBase",
    LABEL: "Summoner",
    UPGRADE_TOOLTIP: "(Honcho)",
    MAX_CHILDREN: 17,
    GUNS: weaponArray({
        POSITION: mystical_gun_position_honcho,
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.drone, g.pounder, g.summoner, { size: 0.8 }]),
            TYPE: "summonerDrone",
            AUTOFIRE: true,
            SYNCS_SKILLS: true,
            STAT_CALCULATOR: "drone",
            WAIT_TO_CYCLE: true,
        },
    }, 4)
}
Class.EAB3_summonerDoper = {
    PARENT: "EAB3_summonerBase",
    LABEL: "Summoner",
    UPGRADE_TOOLTIP: "(Doper)",
    MAX_CHILDREN: 25,
    GUNS: [
        ...weaponArray({
            POSITION: mystical_gun_position,
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.drone, g.summoner, { size: 0.8 }, doper]),
                TYPE: "summonerDrone",
                AUTOFIRE: true,
                SYNCS_SKILLS: true,
                STAT_CALCULATOR: "drone",
                WAIT_TO_CYCLE: true,
            },
        }, 4),
        ...weaponArray({
            POSITION: mystical_gun_position_doper,
        }, 4),
    ]
}

// Enchantress
Class.EAB3_enchantressBase = {
    PARENT: "miniboss",
    LABEL: "Enchantress",
    DANGER: 8,
    SHAPE: 3.5,
    COLOR: "triangle",
    UPGRADE_COLOR: "triangle",
    SIZE: 26,
    MAX_CHILDREN: 28,
    VALUE: 4e5,
    BODY: {
        FOV: 0.5,
        SPEED: 0.09 * base.SPEED,
        HEALTH: 10 * base.HEALTH,
        DAMAGE: 3 * base.DAMAGE,
    },
}
Class.EAB3_turretedDorito = makeAuto('enchantressDrone', "Auto-Drone", {type: 'droneAutoTurret'})
Class.EAB3_enchantressdrive = {
    PARENT: "EAB3_enchantressBase",
    LABEL: "Enchantressdrive",
    UPGRADE_TOOLTIP: "(Drive)",
    BODY: {
        FOV: 0.75,
    },
    GUNS: weaponArray({
        POSITION: mystical_gun_position,
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.drone, g.summoner, { size: 0.9, damage: 1.1 }]),
            TYPE: "EAB3_turretedDorito",
            AUTOFIRE: true,
            SYNCS_SKILLS: true,
            STAT_CALCULATOR: "drone",
            WAIT_TO_CYCLE: true,
        },
    }, 3),
    TURRETS: [
        {
            POSITION: [9, 0, 0, 180, 360, 1],
            TYPE: ["triangle", {INDEPENDENT: true, MIRROR_MASTER_ANGLE: true, COLOR: "grey"}],
        },
    ],
}
Class.EAB3_enchantressHoncho = {
    PARENT: "EAB3_enchantressBase",
    LABEL: "Enchantress",
    UPGRADE_TOOLTIP: "(Honcho)",
    MAX_CHILDREN: 17,
    GUNS: weaponArray({
        POSITION: mystical_gun_position_honcho,
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.drone, g.pounder, g.summoner, { size: 0.9, damage: 1.1 }]),
            TYPE: "enchantressDrone",
            AUTOFIRE: true,
            SYNCS_SKILLS: true,
            STAT_CALCULATOR: "drone",
            WAIT_TO_CYCLE: true,
        },
    }, 3)
}
Class.EAB3_enchantressDoper = {
    PARENT: "EAB3_enchantressBase",
    LABEL: "Enchantress",
    UPGRADE_TOOLTIP: "(Doper)",
    MAX_CHILDREN: 25,
    GUNS: [
        ...weaponArray({
            POSITION: mystical_gun_position,
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.drone, g.summoner, { size: 0.9, damage: 1.1 }, doper]),
                TYPE: "enchantressDrone",
                AUTOFIRE: true,
                SYNCS_SKILLS: true,
                STAT_CALCULATOR: "drone",
                WAIT_TO_CYCLE: true,
            },
        }, 3),
        ...weaponArray({
            POSITION: mystical_gun_position_doper,
        }, 3),
    ]
}

// Exorcistor
Class.EAB3_exorcistorBase = {
    PARENT: "miniboss",
    LABEL: "Exorcistor",
    DANGER: 8,
    SHAPE: 5.5,
    COLOR: "pentagon",
    UPGRADE_COLOR: "pentagon",
    SIZE: 26,
    MAX_CHILDREN: 20,
    VALUE: 5e5,
    BODY: {
        FOV: 0.5,
        SPEED: 0.08 * base.SPEED,
        HEALTH: 15 * base.HEALTH,
        DAMAGE: 4 * base.DAMAGE,
    },
}
Class.EAB3_turretedDemonchip = makeAuto('exorcistorDrone', "Auto-Drone", {type: 'droneAutoTurret'})
Class.EAB3_exorcistordrive = {
    PARENT: "EAB3_exorcistorBase",
    LABEL: "Exorcistordrive",
    UPGRADE_TOOLTIP: "(Drive)",
    BODY: {
        FOV: 0.75,
    },
    GUNS: weaponArray({
        POSITION: mystical_gun_position,
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.drone, g.summoner, g.destroyer, { maxSpeed: 1.2, reload: 5, size: 1.15, damage: 4 }]),
            TYPE: "EAB3_turretedDemonchip",
            AUTOFIRE: true,
            SYNCS_SKILLS: true,
            STAT_CALCULATOR: "drone",
            WAIT_TO_CYCLE: true,
        },
    }, 5),
    TURRETS: [
        {
            POSITION: [9, 0, 0, 180, 360, 1],
            TYPE: ["pentagon", {INDEPENDENT: true, MIRROR_MASTER_ANGLE: true, COLOR: "grey"}],
        },
    ],
}
Class.EAB3_exorcistorHoncho = {
    PARENT: "EAB3_exorcistorBase",
    LABEL: "Exorcistor",
    UPGRADE_TOOLTIP: "(Honcho)",
    MAX_CHILDREN: 12,
    GUNS: weaponArray({
        POSITION: mystical_gun_position_honcho,
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.drone, g.pounder, g.summoner, g.destroyer, { maxSpeed: 1.2, reload: 5, size: 1.15, damage: 4 }]),
            TYPE: "exorcistorDrone",
            AUTOFIRE: true,
            SYNCS_SKILLS: true,
            STAT_CALCULATOR: "drone",
            WAIT_TO_CYCLE: true,
        },
    }, 5)
}
Class.EAB3_exorcistorDoper = {
    PARENT: "EAB3_exorcistorBase",
    LABEL: "Exorcistor",
    UPGRADE_TOOLTIP: "(Doper)",
    MAX_CHILDREN: 18,
    GUNS: [
        ...weaponArray({
            POSITION: mystical_gun_position,
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.drone, g.summoner, g.destroyer, { maxSpeed: 1.2, reload: 5, size: 1.15, damage: 4 }, doper]),
                TYPE: "exorcistorDrone",
                AUTOFIRE: true,
                SYNCS_SKILLS: true,
                STAT_CALCULATOR: "drone",
                WAIT_TO_CYCLE: true,
            },
        }, 5),
        ...weaponArray({
            POSITION: mystical_gun_position_doper,
        }, 5),
    ]
}

// Shaman
Class.EAB3_shamanBase = {
    PARENT: "miniboss",
    LABEL: "Shaman",
    DANGER: 8,
    SHAPE: 6,
    COLOR: "hexagon",
    UPGRADE_COLOR: "hexagon",
    SIZE: 26,
    MAX_CHILDREN: 20,
    VALUE: 6e5,
    BODY: {
        FOV: 0.5,
        SPEED: 0.07 * base.SPEED,
        HEALTH: 20 * base.HEALTH,
        DAMAGE: 5 * base.DAMAGE,
    },
}
Class.EAB3_turretedRealchip = makeAuto('shamanDrone', "Auto-Drone", {type: 'droneAutoTurret'})
Class.EAB3_shamandrive = {
    PARENT: "EAB3_shamanBase",
    LABEL: "Shamandrive",
    UPGRADE_TOOLTIP: "(Drive)",
    BODY: {
        FOV: 0.75,
    },
    GUNS: weaponArray({
        POSITION: mystical_gun_position,
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.drone, g.summoner, g.destroyer, { size: 1.25, maxSpeed: 1.2, damage: 1.1, reload: 3, damage: 4 }]),
            TYPE: "EAB3_turretedRealchip",
            AUTOFIRE: true,
            SYNCS_SKILLS: true,
            STAT_CALCULATOR: "drone",
            WAIT_TO_CYCLE: true,
        },
    }, 6),
    TURRETS: [
        {
            POSITION: [9, 0, 0, 0, 360, 1],
            TYPE: ["hexagon", {INDEPENDENT: true, MIRROR_MASTER_ANGLE: true, COLOR: "grey"}],
        },
    ],
}
Class.EAB3_shamanHoncho = {
    PARENT: "EAB3_shamanBase",
    LABEL: "Shaman",
    UPGRADE_TOOLTIP: "(Honcho)",
    MAX_CHILDREN: 12,
    GUNS: weaponArray({
        POSITION: mystical_gun_position_honcho,
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.drone, g.pounder, g.summoner, g.destroyer, { size: 1.25, maxSpeed: 1.2, damage: 1.1, reload: 3, damage: 4 }]),
            TYPE: "shamanDrone",
            AUTOFIRE: true,
            SYNCS_SKILLS: true,
            STAT_CALCULATOR: "drone",
            WAIT_TO_CYCLE: true,
        },
    }, 6)
}
Class.EAB3_shamanDoper = {
    PARENT: "EAB3_shamanBase",
    LABEL: "Shaman",
    UPGRADE_TOOLTIP: "(Doper)",
    MAX_CHILDREN: 18,
    GUNS: [
        ...weaponArray({
            POSITION: mystical_gun_position,
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.drone, g.summoner, g.destroyer, { size: 1.25, maxSpeed: 1.2, damage: 1.1, reload: 3, damage: 4 }, doper]),
                TYPE: "shamanDrone",
                AUTOFIRE: true,
                SYNCS_SKILLS: true,
                STAT_CALCULATOR: "drone",
                WAIT_TO_CYCLE: true,
            },
        }, 6),
        ...weaponArray({
            POSITION: mystical_gun_position_doper,
        }, 6),
    ]
}


// NESTERS
// Nest Keeper
/*
guns: drive, honcho, doper
turrets: triplet, recoiler, bent boomer, parryer
*/
Class.EAB3_nestKeeperDrive = {
    PARENT: "nester",
    LABEL: "Nest Keeper",
    UPGRADE_TOOLTIP: "(Drive)",
    MAX_CHILDREN: 15,
    GUNS: [
        ...weaponArray({
            POSITION: [3.5, 6.65, 1.2, 8, 0, 36, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.drone, g.nestKeeper]),
                TYPE: "turretedDrone",
                AUTOFIRE: true,
                LABEL: "Mega Crasher",
                STAT_CALCULATOR: "drone",
            },
        }, 5),
        ...weaponArray({
            POSITION: [3.75, 3.5, , 8, 0, 36, 0],
        }, 5),
    ],
    TURRETS: [
        ...weaponArray({
            POSITION: [8, 9, 0, 0, 120, 0],
            TYPE: [ "auto4gun", { INDEPENDENT: true, COLOR: "purple" } ],
        }, 5),
        {
            POSITION: [9, 0, 0, 0, 360, 1],
            TYPE: [ "boomerTurret", { INDEPENDENT: true, COLOR: -1 } ],
        },
    ],
}
Class.EAB3_nestKeeperHoncho = {
    PARENT: "nester",
    LABEL: "Nest Keeper",
    UPGRADE_TOOLTIP: "(Honcho)",
    MAX_CHILDREN: 10,
    GUNS: weaponArray({
        POSITION: [3.5, 8.5, 1.1, 8, 0, 36, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.drone, g.nestKeeper, g.pounder]),
            TYPE: "drone",
            AUTOFIRE: true,
            LABEL: "Ultra Crasher",
            STAT_CALCULATOR: "drone",
        },
    }, 5),
    TURRETS: [
        ...weaponArray({
            POSITION: [8, 9, 0, 0, 120, 0],
            TYPE: [ "auto4gun", { INDEPENDENT: true, COLOR: "purple" } ],
        }, 5),
        {
            POSITION: [9, 0, 0, 0, 360, 1],
            TYPE: [ "boomerTurret", { INDEPENDENT: true, COLOR: -1 } ],
        },
    ],
}
Class.EAB3_nestKeeperDoper = {
    PARENT: "nester",
    LABEL: "Nest Keeper",
    UPGRADE_TOOLTIP: "(Doper)",
    MAX_CHILDREN: 10,
    GUNS: [
        ...weaponArray({
            POSITION: [3.5, 6.65, 1.2, 8, 0, 36, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.drone, g.nestKeeper, doper]),
                TYPE: "drone",
                AUTOFIRE: true,
                LABEL: "Mega Crasher",
                STAT_CALCULATOR: "drone",
            },
        }, 5),
        ...weaponArray({
            POSITION: [5, 0.5, -5, 7, 0, 36, 0],
        }, 5),
    ],
    TURRETS: [
        ...weaponArray({
            POSITION: [8, 9, 0, 0, 120, 0],
            TYPE: [ "auto4gun", { INDEPENDENT: true, COLOR: "purple" } ],
        }, 5),
        {
            POSITION: [9, 0, 0, 0, 360, 1],
            TYPE: [ "boomerTurret", { INDEPENDENT: true, COLOR: -1 } ],
        },
    ],
}
Class.EAB3_nestKeeperTriplet = {
    PARENT: "nester",
    LABEL: "Nest Keeper",
    UPGRADE_TOOLTIP: "(Triplet)",
    MAX_CHILDREN: 15,
    GUNS: weaponArray({
        POSITION: [3.5, 6.65, 1.2, 8, 0, 36, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.drone, g.nestKeeper]),
            TYPE: "drone",
            AUTOFIRE: true,
            LABEL: "Mega Crasher",
            STAT_CALCULATOR: "drone",
        },
    }, 5),
    TURRETS: [
        ...weaponArray({
            POSITION: [8, 9, 0, 0, 120, 0],
            TYPE: [ "bigauto4gun", { INDEPENDENT: true, COLOR: "purple" } ],
        }, 5),
        {
            POSITION: [9, 0, 0, 0, 360, 1],
            TYPE: [ "boomerTurret", { INDEPENDENT: true, COLOR: -1 } ],
        },
    ],
}
Class.EAB3_nestKeeperRecoiler = {
    PARENT: "nester",
    LABEL: "Nest Keeper",
    UPGRADE_TOOLTIP: "(Recoiler)",
    MAX_CHILDREN: 15,
    GUNS: weaponArray({
        POSITION: [3.5, 6.65, 1.2, 8, 0, 36, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.drone, g.nestKeeper]),
            TYPE: "drone",
            AUTOFIRE: true,
            LABEL: "Mega Crasher",
            STAT_CALCULATOR: "drone",
        },
    }, 5),
    TURRETS: [
        ...weaponArray({
            POSITION: [8, 9, 0, 0, 120, 0],
            TYPE: [ "auto4gun", { INDEPENDENT: true, COLOR: "purple" } ],
        }, 5),
        {
            POSITION: [10, 0, 0, 0, 360, 1],
            TYPE: [ "EAB3_recoilerTurret", { INDEPENDENT: true, COLOR: -1 } ],
        },
    ],
}
Class.EAB3_nestKeeperBentBoomer = {
    PARENT: "nester",
    LABEL: "Nest Keeper",
    UPGRADE_TOOLTIP: "(Bent Boomer)",
    MAX_CHILDREN: 15,
    GUNS: weaponArray({
        POSITION: [3.5, 6.65, 1.2, 8, 0, 36, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.drone, g.nestKeeper]),
            TYPE: "drone",
            AUTOFIRE: true,
            LABEL: "Mega Crasher",
            STAT_CALCULATOR: "drone",
        },
    }, 5),
    TURRETS: [
        ...weaponArray({
            POSITION: [8, 9, 0, 0, 120, 0],
            TYPE: [ "auto4gun", { INDEPENDENT: true, COLOR: "purple" } ],
        }, 5),
        {
            POSITION: [9, 0, 0, 0, 360, 1],
            TYPE: [ "EAB3_bentBoomerTurret", { INDEPENDENT: true, COLOR: -1 } ],
        },
    ],
}
Class.EAB3_nestKeeperParryer = {
    PARENT: "nester",
    LABEL: "Nest Keeper",
    UPGRADE_TOOLTIP: "(Parryer)",
    MAX_CHILDREN: 15,
    GUNS: weaponArray({
        POSITION: [3.5, 6.65, 1.2, 8, 0, 36, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.drone, g.nestKeeper]),
            TYPE: "drone",
            AUTOFIRE: true,
            LABEL: "Mega Crasher",
            STAT_CALCULATOR: "drone",
        },
    }, 5),
    TURRETS: [
        ...weaponArray({
            POSITION: [8, 9, 0, 0, 120, 0],
            TYPE: [ "auto4gun", { INDEPENDENT: true, COLOR: "purple" } ],
        }, 5),
        {
            POSITION: [9, 0, 0, 0, 360, 1],
            TYPE: [ "EAB3_parryerTurret", { INDEPENDENT: true, COLOR: -1 } ],
        },
    ],
}

// Nest Warden
/*
guns: constructor, engineer
turrets: carrier, honcho, doper, blockade, barrier, proper
*/
Class.EAB3_nestWardenCarrier = {
    PARENT: "nester",
    LABEL: "Nest Warden",
    UPGRADE_TOOLTIP: "(Carrier)",
    GUNS: weaponArray([
        {
            POSITION: [10.7, 8, 1, 0, 0, 36, 0],
        },
        {
            POSITION: [1.5, 8, 1.2, 10.7, 0, 36, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, { speed: 1.2 }, g.setTrap, g.constructor]),
                TYPE: "unsetTrap",
                STAT_CALCULATOR: "block"
            },
        }
    ], 5),
    TURRETS: [
        {
            POSITION: [9, 0, 0, 0, 360, 1],
            TYPE: [ "barricadeTurret", { INDEPENDENT: true, COLOR: -1 } ],
        },
        ...weaponArray({
            POSITION: [8, 9, 0, 0, 120, 0],
            TYPE: [ "carrierTurret", { INDEPENDENT: true, COLOR: -1 } ],
        }, 5)
    ],
}
Class.EAB3_nestWardenHoncho = {
    PARENT: "nester",
    LABEL: "Nest Warden",
    UPGRADE_TOOLTIP: "(Honcho)",
    GUNS: weaponArray([
        {
            POSITION: [10.7, 8, 1, 0, 0, 36, 0],
        },
        {
            POSITION: [1.5, 8, 1.2, 10.7, 0, 36, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, { speed: 1.2 }, g.setTrap, g.constructor]),
                TYPE: "unsetTrap",
                STAT_CALCULATOR: "block"
            },
        }
    ], 5),
    TURRETS: [
        {
            POSITION: [9, 0, 0, 0, 360, 1],
            TYPE: [ "barricadeTurret", { INDEPENDENT: true, COLOR: -1 } ],
        },
        ...weaponArray({
            POSITION: [8, 9, 0, 0, 120, 0],
            TYPE: [ "EAB3_baltimoreTurret", { INDEPENDENT: true, COLOR: -1 } ],
        }, 5)
    ],
}
Class.EAB3_nestWardenDoper = {
    PARENT: "nester",
    LABEL: "Nest Warden",
    UPGRADE_TOOLTIP: "(Doper)",
    GUNS: weaponArray([
        {
            POSITION: [10.7, 8, 1, 0, 0, 36, 0],
        },
        {
            POSITION: [1.5, 8, 1.2, 10.7, 0, 36, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, { speed: 1.2 }, g.setTrap, g.constructor]),
                TYPE: "unsetTrap",
                STAT_CALCULATOR: "block"
            },
        }
    ], 5),
    TURRETS: [
        {
            POSITION: [9, 0, 0, 0, 360, 1],
            TYPE: [ "barricadeTurret", { INDEPENDENT: true, COLOR: -1 } ],
        },
        ...weaponArray({
            POSITION: [8, 9, 0, 0, 120, 0],
            TYPE: [ "EAB3_moseyTurret", { INDEPENDENT: true, COLOR: -1 } ],
        }, 5)
    ],
}
Class.EAB3_nestWardenConstructor = {
    PARENT: "nester",
    LABEL: "Nest Warden",
    UPGRADE_TOOLTIP: "(Constructor)",
    GUNS: weaponArray([
        {
            POSITION: [10.7, 10, 1, 0, 0, 36, 0],
        },
        {
            POSITION: [1.5, 10, 1.1, 10.7, 0, 36, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, g.pounder, { speed: 1.2 }, g.setTrap, g.constructor]),
                TYPE: "unsetTrap",
                STAT_CALCULATOR: "block"
            },
        }
    ], 5),
    TURRETS: [
        {
            POSITION: [9, 0, 0, 0, 360, 1],
            TYPE: [ "barricadeTurret", { INDEPENDENT: true, COLOR: -1 } ],
        },
        ...weaponArray({
            POSITION: [8, 9, 0, 0, 120, 0],
            TYPE: [ "cruiserTurret", { INDEPENDENT: true, COLOR: -1 } ],
        }, 5)
    ],
}
Class.EAB3_nestWardenEngineer = {
    PARENT: "nester",
    LABEL: "Nest Warden",
    UPGRADE_TOOLTIP: "(Engineer)",
    GUNS: weaponArray([
        {
            POSITION: [10.75, 7, 1, 0, 0, 36, 0],
        },
        {
            POSITION: [10, 8, 1, 0, 0, 36, 0],
        },
        {
            POSITION: [0.75, 8, 1, 10.75, 0, 36, 0],
        },
        {
            POSITION: [0.75, 8, 1.2, 11.5, 0, 36, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, { speed: 1.2 }, g.setTrap, g.constructor]),
                TYPE: "unsetPillbox",
                STAT_CALCULATOR: "block"
            },
        }
    ], 5),
    TURRETS: [
        {
            POSITION: [9, 0, 0, 0, 360, 1],
            TYPE: [ "barricadeTurret", { INDEPENDENT: true, COLOR: -1 } ],
        },
        ...weaponArray({
            POSITION: [8, 9, 0, 0, 120, 0],
            TYPE: [ "cruiserTurret", { INDEPENDENT: true, COLOR: -1 } ],
        }, 5)
    ],
}
Class.EAB3_nestWardenBlockade = {
    PARENT: "nester",
    LABEL: "Nest Warden",
    UPGRADE_TOOLTIP: "(Blockade)",
    GUNS: weaponArray([
        {
            POSITION: [10.7, 8, 1, 0, 0, 36, 0],
        },
        {
            POSITION: [1.5, 8, 1.2, 10.7, 0, 36, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, { speed: 1.2 }, g.setTrap, g.constructor]),
                TYPE: "unsetTrap",
                STAT_CALCULATOR: "block"
            },
        }
    ], 5),
    TURRETS: [
        {
            POSITION: [9, 0, 0, 0, 360, 1],
            TYPE: [ "EAB3_blockadeTurret", { INDEPENDENT: true, COLOR: -1 } ],
        },
        ...weaponArray({
            POSITION: [8, 9, 0, 0, 120, 0],
            TYPE: [ "cruiserTurret", { INDEPENDENT: true, COLOR: -1 } ],
        }, 5)
    ],
}
Class.EAB3_nestWardenBarrier = {
    PARENT: "nester",
    LABEL: "Nest Warden",
    UPGRADE_TOOLTIP: "(Barrier)",
    GUNS: weaponArray([
        {
            POSITION: [10.7, 8, 1, 0, 0, 36, 0],
        },
        {
            POSITION: [1.5, 8, 1.2, 10.7, 0, 36, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, { speed: 1.2 }, g.setTrap, g.constructor]),
                TYPE: "unsetTrap",
                STAT_CALCULATOR: "block"
            },
        }
    ], 5),
    TURRETS: [
        {
            POSITION: [9, 0, 0, 0, 360, 1],
            TYPE: [ "EAB3_barrierTurret", { INDEPENDENT: true, COLOR: -1 } ],
        },
        ...weaponArray({
            POSITION: [8, 9, 0, 0, 120, 0],
            TYPE: [ "cruiserTurret", { INDEPENDENT: true, COLOR: -1 } ],
        }, 5)
    ],
}
Class.EAB3_nestWardenPropper = {
    PARENT: "nester",
    LABEL: "Nest Warden",
    UPGRADE_TOOLTIP: "(Propper)",
    GUNS: weaponArray([
        {
            POSITION: [10.7, 8, 1, 0, 0, 36, 0],
        },
        {
            POSITION: [1.5, 8, 1.2, 10.7, 0, 36, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, { speed: 1.2 }, g.setTrap, g.constructor]),
                TYPE: "unsetTrap",
                STAT_CALCULATOR: "block"
            },
        }
    ], 5),
    TURRETS: [
        {
            POSITION: [9, 0, 0, 0, 360, 1],
            TYPE: [ "EAB3_propperTurret", { INDEPENDENT: true, COLOR: -1 } ],
        },
        ...weaponArray({
            POSITION: [8, 9, 0, 0, 120, 0],
            TYPE: [ "cruiserTurret", { INDEPENDENT: true, COLOR: -1 } ],
        }, 5)
    ],
}

// Nest Guardian
/*
guns: big mac, stomper, launcher
turrets: myriad, molotov, catapult, hypertwister
*/
Class.EAB3_nestGuardianBigMac = {
    PARENT: "nester",
    LABEL: "Nest Guardian",
    UPGRADE_TOOLTIP: "(Big Mac)",
    GUNS: [
        ...weaponArray({
            POSITION: [4, 7, 1.5, 6, 0, 36, 0],
        }, 5),
        ...weaponArray({
            POSITION: [2.5, 10.5, 1, 10, 0, 36, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.pounder, g.destroyer, g.destroyer]),
                TYPE: "bullet",
                LABEL: "Obliterator",
            },
        }, 5),
    ],
    TURRETS: [
        {
            POSITION: [9, 0, 0, 0, 360, 1],
            TYPE: [ "twisterTurret", { INDEPENDENT: true, COLOR: -1 } ],
        },
        ...weaponArray({
            POSITION: [8, 9, 0, 0, 120, 0],
            TYPE: [ "swarmerTurret", { INDEPENDENT: true, COLOR: -1 } ],
        }, 5)
    ],
}
Class.EAB3_nestGuardianStomper = {
    PARENT: "nester",
    LABEL: "Nest Guardian",
    UPGRADE_TOOLTIP: "(Stomper)",
    GUNS: [
        ...weaponArray({
            POSITION: [6, 2, 1, 5.5, 2.5, 40, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.artillery]),
                TYPE: "bullet",
                LABEL: "Secondary",
            },
        }, 5),
        ...weaponArray({
            POSITION: [6, 2, 1, 5.5, -2.5, -40, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.artillery]),
                TYPE: "bullet",
                LABEL: "Secondary",
            },
        }, 5),
        ...weaponArray({
            POSITION: [5.5, 7, 1, 6, 0, 36, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.pounder, g.destroyer]),
                TYPE: "bullet",
                LABEL: "Devastator",
            },
        }, 5),
    ],
    TURRETS: [
        {
            POSITION: [9, 0, 0, 0, 360, 1],
            TYPE: [ "twisterTurret", { INDEPENDENT: true, COLOR: -1 } ],
        },
        ...weaponArray({
            POSITION: [8, 9, 0, 0, 120, 0],
            TYPE: [ "swarmerTurret", { INDEPENDENT: true, COLOR: -1 } ],
        }, 5)
    ],
}
Class.EAB3_nestGuardianLauncher = {
    PARENT: "nester",
    LABEL: "Nest Guardian",
    UPGRADE_TOOLTIP: "(Launcher)",
    GUNS: [
        ...weaponArray({
            POSITION: [6.25, 5, 1, 6, 0, 36, 0],
        }, 5),
        ...weaponArray({
            POSITION: [5.5, 7, 1, 6, 0, 36, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.pounder, g.destroyer, g.launcher]),
                TYPE: "minimissile",
                LABEL: "Diluter",
            },
        }, 5),
    ],
    TURRETS: [
        {
            POSITION: [9, 0, 0, 0, 360, 1],
            TYPE: [ "twisterTurret", { INDEPENDENT: true, COLOR: -1 } ],
        },
        ...weaponArray({
            POSITION: [8, 9, 0, 0, 120, 0],
            TYPE: [ "swarmerTurret", { INDEPENDENT: true, COLOR: -1 } ],
        }, 5)
    ],
}
Class.EAB3_nestGuardianMyriad = {
    PARENT: "nester",
    LABEL: "Nest Guardian",
    UPGRADE_TOOLTIP: "(Myriad)",
    GUNS: weaponArray({
        POSITION: [5.5, 7, 1, 6, 0, 36, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.pounder, g.destroyer]),
            TYPE: "bullet",
            LABEL: "Devastator",
        },
    }, 5),
    TURRETS: [
        {
            POSITION: [9, 0, 0, 0, 360, 1],
            TYPE: [ "twisterTurret", { INDEPENDENT: true, COLOR: -1 } ],
        },
        ...weaponArray({
            POSITION: [8, 9, 0, 0, 120, 0],
            TYPE: [ "EAB3_myriadTurret", { INDEPENDENT: true, COLOR: -1 } ],
        }, 5)
    ],
}
Class.EAB3_nestGuardianMolotov = {
    PARENT: "nester",
    LABEL: "Nest Guardian",
    UPGRADE_TOOLTIP: "(Molotov)",
    GUNS: weaponArray({
        POSITION: [5.5, 7, 1, 6, 0, 36, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.pounder, g.destroyer]),
            TYPE: "bullet",
            LABEL: "Devastator",
        },
    }, 5),
    TURRETS: [
        {
            POSITION: [9, 0, 0, 0, 360, 1],
            TYPE: [ "twisterTurret", { INDEPENDENT: true, COLOR: -1 } ],
        },
        ...weaponArray({
            POSITION: [8, 9, 0, 0, 120, 0],
            TYPE: [ "EAB3_molotovTurret", { INDEPENDENT: true, COLOR: -1 } ],
        }, 5)
    ],
}
Class.EAB3_nestGuardianCatapult = {
    PARENT: "nester",
    LABEL: "Nest Guardian",
    UPGRADE_TOOLTIP: "(Catapult)",
    GUNS: weaponArray({
        POSITION: [5.5, 7, 1, 6, 0, 36, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.pounder, g.destroyer]),
            TYPE: "bullet",
            LABEL: "Devastator",
        },
    }, 5),
    TURRETS: [
        {
            POSITION: [9, 0, 0, 0, 360, 1],
            TYPE: [ "EAB3_catapultTurret", { INDEPENDENT: true, COLOR: -1 } ],
        },
        ...weaponArray({
            POSITION: [8, 9, 0, 0, 120, 0],
            TYPE: [ "swarmerTurret", { INDEPENDENT: true, COLOR: -1 } ],
        }, 5)
    ],
}
Class.EAB3_nestGuardianHyperTwister = {
    PARENT: "nester",
    LABEL: "Nest Guardian",
    UPGRADE_TOOLTIP: "(Hyper Twister)",
    GUNS: weaponArray({
        POSITION: [5.5, 7, 1, 6, 0, 36, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.pounder, g.destroyer]),
            TYPE: "bullet",
            LABEL: "Devastator",
        },
    }, 5),
    TURRETS: [
        {
            POSITION: [9, 0, 0, 0, 360, 1],
            TYPE: [ "EAB3_hyperTwisterTurret", { INDEPENDENT: true, COLOR: -1 } ],
        },
        ...weaponArray({
            POSITION: [8, 9, 0, 0, 120, 0],
            TYPE: [ "swarmerTurret", { INDEPENDENT: true, COLOR: -1 } ],
        }, 5)
    ],
}


// ROGUES
// Rogue Palisade
/*
guns: megaspawner, honcho, doper
turrets: builder, mech
*/
Class.EAB3_roguePalisadeMegaSpawner = {
    PARENT: 'miniboss',
    LABEL: "Rogue Palisade",
    UPGRADE_TOOLTIP: "(Mega Spawner)",
    COLOR: 'darkGrey',
    UPGRADE_COLOR: 'darkGrey',
    SHAPE: 6,
    SIZE: 30,
    VALUE: 5e5,
    SKILL: [2, 6, 6, 6, 2, 0, 0, 9, 0, 0],
    CONTROLLERS: ['nearestDifferentMaster', 'onlyAcceptInArc'],
    BODY: {
        FOV: 1.4,
        SPEED: 0.05 * base.SPEED,
        HEALTH: 16 * base.HEALTH,
        SHIELD: 3 * base.SHIELD,
        DAMAGE: 3 * base.DAMAGE,
    },
    GUNS: weaponArray({
        POSITION: [4, 6, -2, 8, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([ g.minion, g.pounder, { reload: 2, damage: 0.7, density: 0.6 }]),
            TYPE: ['megaMinion', {INDEPENDENT: true}],
            STAT_CALCULATOR: 'drone',
            AUTOFIRE: true,
            MAX_CHILDREN: 3,
            SYNCS_SKILLS: true,
            WAIT_TO_CYCLE: true
        }
    }, 6),
    TURRETS: weaponArray({
        POSITION: [5, 10, 0, 30, 110, 0],
        TYPE: ['baseTrapTurret', {GUN_STAT_SCALE: {health: 0.7, damage: 0.8}}]
    }, 6)
}
Class.EAB3_roguePalisadeHoncho = {
    PARENT: 'miniboss',
    LABEL: "Rogue Palisade",
    UPGRADE_TOOLTIP: "(Honcho)",
    COLOR: 'darkGrey',
    UPGRADE_COLOR: 'darkGrey',
    SHAPE: 6,
    SIZE: 30,
    VALUE: 5e5,
    SKILL: [2, 6, 6, 6, 2, 0, 0, 9, 0, 0],
    CONTROLLERS: ['nearestDifferentMaster', 'onlyAcceptInArc'],
    BODY: {
        FOV: 1.4,
        SPEED: 0.05 * base.SPEED,
        HEALTH: 16 * base.HEALTH,
        SHIELD: 3 * base.SHIELD,
        DAMAGE: 3 * base.DAMAGE,
    },
    GUNS: weaponArray({
        POSITION: [4, 7.75, -1.4, 8, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([ g.minion, g.pounder, g.destroyer, { reload: 2, damage: 0.7, density: 0.6 }]),
            TYPE: ['minion', {INDEPENDENT: true}],
            STAT_CALCULATOR: 'drone',
            AUTOFIRE: true,
            MAX_CHILDREN: 2,
            SYNCS_SKILLS: true,
            WAIT_TO_CYCLE: true
        }
    }, 6),
    TURRETS: weaponArray({
        POSITION: [5, 10, 0, 30, 110, 0],
        TYPE: ['baseTrapTurret', {GUN_STAT_SCALE: {health: 0.7, damage: 0.8}}]
    }, 6)
}
Class.EAB3_roguePalisadeDoper = {
    PARENT: 'miniboss',
    LABEL: "Rogue Palisade",
    UPGRADE_TOOLTIP: "(Doper)",
    COLOR: 'darkGrey',
    UPGRADE_COLOR: 'darkGrey',
    SHAPE: 6,
    SIZE: 30,
    VALUE: 5e5,
    SKILL: [2, 6, 6, 6, 2, 0, 0, 9, 0, 0],
    CONTROLLERS: ['nearestDifferentMaster', 'onlyAcceptInArc'],
    BODY: {
        FOV: 1.4,
        SPEED: 0.05 * base.SPEED,
        HEALTH: 16 * base.HEALTH,
        SHIELD: 3 * base.SHIELD,
        DAMAGE: 3 * base.DAMAGE,
    },
    GUNS: [
        ...weaponArray({
            POSITION: [4, 6, -1.6, 8, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([ g.minion, g.pounder, { reload: 2, damage: 0.7, density: 0.6 }, doper]),
                TYPE: ['minion', {INDEPENDENT: true}],
                STAT_CALCULATOR: 'drone',
                AUTOFIRE: true,
                MAX_CHILDREN: 3,
                SYNCS_SKILLS: true,
                WAIT_TO_CYCLE: true
            }
        }, 6),
        ...weaponArray({
            POSITION: [4.75, 0.3, -5, 8, 0, 0, 0],
            PROPERTIES: {
            }
        }, 6),
    ],
    TURRETS: weaponArray({
        POSITION: [5, 10, 0, 30, 110, 0],
        TYPE: ['baseTrapTurret', {GUN_STAT_SCALE: {health: 0.7, damage: 0.8}}]
    }, 6)
}
Class.EAB3_roguePalisadeBuilder = {
    PARENT: 'miniboss',
    LABEL: "Rogue Palisade",
    UPGRADE_TOOLTIP: "(Builder)",
    COLOR: 'darkGrey',
    UPGRADE_COLOR: 'darkGrey',
    SHAPE: 6,
    SIZE: 30,
    VALUE: 5e5,
    SKILL: [2, 6, 6, 6, 2, 0, 0, 9, 0, 0],
    CONTROLLERS: ['nearestDifferentMaster', 'onlyAcceptInArc'],
    BODY: {
        FOV: 1.4,
        SPEED: 0.05 * base.SPEED,
        HEALTH: 16 * base.HEALTH,
        SHIELD: 3 * base.SHIELD,
        DAMAGE: 3 * base.DAMAGE,
    },
    GUNS: weaponArray({
        POSITION: [4, 6, -1.6, 8, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([ g.minion, g.pounder, { reload: 2, damage: 0.7, density: 0.6 }]),
            TYPE: ['minion', {INDEPENDENT: true}],
            STAT_CALCULATOR: 'drone',
            AUTOFIRE: true,
            MAX_CHILDREN: 3,
            SYNCS_SKILLS: true,
            WAIT_TO_CYCLE: true
        }
    }, 6),
    TURRETS: weaponArray({
        POSITION: [5, 10, 0, 30, 110, 0],
        TYPE: ['EAB3_baseBuilderTurret', {GUN_STAT_SCALE: {health: 0.7, damage: 0.8}}]
    }, 6)
}
Class.EAB3_roguePalisadeMech = {
    PARENT: 'miniboss',
    LABEL: "Rogue Palisade",
    UPGRADE_TOOLTIP: "(Mech)",
    COLOR: 'darkGrey',
    UPGRADE_COLOR: 'darkGrey',
    SHAPE: 6,
    SIZE: 30,
    VALUE: 5e5,
    SKILL: [2, 6, 6, 6, 2, 0, 0, 9, 0, 0],
    CONTROLLERS: ['nearestDifferentMaster', 'onlyAcceptInArc'],
    BODY: {
        FOV: 1.4,
        SPEED: 0.05 * base.SPEED,
        HEALTH: 16 * base.HEALTH,
        SHIELD: 3 * base.SHIELD,
        DAMAGE: 3 * base.DAMAGE,
    },
    GUNS: weaponArray({
        POSITION: [4, 6, -1.6, 8, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([ g.minion, g.pounder, { reload: 2, damage: 0.7, density: 0.6 }]),
            TYPE: ['minion', {INDEPENDENT: true}],
            STAT_CALCULATOR: 'drone',
            AUTOFIRE: true,
            MAX_CHILDREN: 3,
            SYNCS_SKILLS: true,
            WAIT_TO_CYCLE: true
        }
    }, 6),
    TURRETS: weaponArray({
        POSITION: [5, 10, 0, 30, 110, 0],
        TYPE: ['EAB3_baseMechTurret', {GUN_STAT_SCALE: {health: 0.7, damage: 0.8}}]
    }, 6)
}

// Rogue Armada
/*
guns: boomstick, pumper
turrets: constructor, engineer
*/
Class.EAB3_rogueArmadaBoomstick = {
    PARENT: 'miniboss',
    LABEL: "Rogue Armada",
    UPGRADE_TOOLTIP: "(Boomstick)",
    COLOR: 'darkGrey',
    UPGRADE_COLOR: 'darkGrey',
    SHAPE: 7,
    SIZE: 28,
    VALUE: 5e5,
    SKILL: [2, 6, 6, 6, 2, 0, 0, 9, 0, 0],
    BODY: {
        FOV: 1.3,
        SPEED: base.SPEED * 0.1,
        HEALTH: base.HEALTH * 16,
        SHIELD: base.SHIELD * 3,
        REGEN: base.REGEN,
        DAMAGE: base.DAMAGE * 3,
    },
    GUNS: weaponArray([
        {
            POSITION: [8, 2, 1, 0, -2, 360 / 14, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.shotgun, g.pounder, {reload: 2, damage: 1.5, health: 1.5, resist: 1.25}]),
                TYPE: 'casing'
            }
        },
        {
            POSITION: [8, 2, 1, 0, -1.5, 360 / 14, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.shotgun, g.pounder, {reload: 2, damage: 1.5, health: 1.5, resist: 1.25}]),
                TYPE: 'casing'
            }
        },
        {
            POSITION: [8, 2, 1, 0, -1.5, 360 / 14, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.shotgun, g.pounder, {reload: 2, damage: 1.5, health: 1.5, resist: 1.25}]),
                TYPE: 'casing'
            }
        },
        {
            POSITION: [8, 2, 1, 0, -1, 360 / 14, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.shotgun, g.pounder, {reload: 2, damage: 1.5, health: 1.5, resist: 1.25}]),
                TYPE: 'bullet'
            }
        },
        {
            POSITION: [8, 3, 1, 0, 0.5, 360 / 14, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.shotgun, g.pounder, {reload: 2, damage: 1.5, health: 1.5, resist: 1.25}]),
                TYPE: 'bullet'
            }
        },
        {
            POSITION: [8, 3, 1, 0, 0, 360 / 14, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.shotgun, g.pounder, {reload: 2, damage: 1.5, health: 1.5, resist: 1.25}]),
                TYPE: 'bullet'
            }
        },
        {
            POSITION: [8, 3, 1, 0, 0.5, 360 / 14, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.shotgun, g.pounder, {reload: 2, damage: 1.5, health: 1.5, resist: 1.25}]),
                TYPE: 'bullet'
            }
        },
        {
            POSITION: [8, 3, 1, 0, 0.5, 360 / 14, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.shotgun, g.pounder, {reload: 2, damage: 1.5, health: 1.5, resist: 1.25}]),
                TYPE: 'bullet'
            }
        },
        {
            POSITION: [8, 3, 1, 0, 0, 360 / 14, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.shotgun, g.pounder, {reload: 2, damage: 1.5, health: 1.5, resist: 1.25}]),
                TYPE: 'bullet'
            }
        },
        {
            POSITION: [8, 3, 1, 0, 0, 360 / 14, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.shotgun, g.pounder, {reload: 2, damage: 1.5, health: 1.5, resist: 1.25}]),
                TYPE: 'bullet'
            }
        },
        {
            POSITION: [8, 3, 1, 0, 0.5, 360 / 14, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.shotgun, g.pounder, {reload: 2, damage: 1.5, health: 1.5, resist: 1.25}]),
                TYPE: 'bullet'
            }
        },
        {
            POSITION: [8, 4, 1, 0, 1, 360 / 14, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.shotgun, g.pounder, {reload: 2, damage: 1.5, health: 1.5, resist: 1.25}]),
                TYPE: 'bullet'
            }
        },
        {
            POSITION: [8, 4, 1, 0, 1.5, 360 / 14, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.shotgun, g.pounder, {reload: 2, damage: 1.5, health: 1.5, resist: 1.25}]),
                TYPE: 'casing'
            }
        },
        {
            POSITION: [8, 4, 1, 0, 1.5, 360 / 14, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.shotgun, g.pounder, {reload: 2, damage: 1.5, health: 1.5, resist: 1.25}]),
                TYPE: 'casing'
            }
        },
        {
            POSITION: [8, 2, 1, 0, 2, 360 / 14, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.shotgun, g.pounder, {reload: 2, damage: 1.5, health: 1.5, resist: 1.25}]),
                TYPE: 'casing'
            }
        },
        {
            POSITION: [8.5, 7.25, 1, 4, 0, 360 / 14, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.shotgun, g.pounder, {reload: 2}, g.fake]),
                TYPE: 'casing'
            }
        },
        {
            POSITION: [7, 7.25, -1.2, 4, 0, 360 / 14, 0]
        }
    ], 7),
    TURRETS: weaponArray({
        POSITION: [5, 10, 0, 0, 110, 0],
        TYPE: 'shottrapTurret'
    }, 7),
}
Class.EAB3_rogueArmadaPumper = {
    PARENT: 'miniboss',
    LABEL: "Rogue Armada",
    UPGRADE_TOOLTIP: "(Pumper)",
    COLOR: 'darkGrey',
    UPGRADE_COLOR: 'darkGrey',
    SHAPE: 7,
    SIZE: 28,
    VALUE: 5e5,
    SKILL: [2, 6, 6, 6, 2, 0, 0, 9, 0, 0],
    BODY: {
        FOV: 1.3,
        SPEED: base.SPEED * 0.1,
        HEALTH: base.HEALTH * 16,
        SHIELD: base.SHIELD * 3,
        REGEN: base.REGEN,
        DAMAGE: base.DAMAGE * 3,
    },
    GUNS: weaponArray([
        {
            POSITION: [8, 2, 1, 0, -1.5, 360 / 14, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.shotgun, g.pounder, g.launcher, {shuder: 8}, {reload: 2, damage: 1.5, health: 1.5, resist: 1.25}]),
                TYPE: 'minimissile'
            }
        },
        {
            POSITION: [8, 2, 1, 0, -1, 360 / 14, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.shotgun, g.pounder, g.launcher, {shuder: 8}, {reload: 2, damage: 1.5, health: 1.5, resist: 1.25}]),
                TYPE: 'minimissile'
            }
        },
        {
            POSITION: [8, 3, 1, 0, 0.5, 360 / 14, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.shotgun, g.pounder, g.launcher, {shuder: 8}, {reload: 2, damage: 1.5, health: 1.5, resist: 1.25}]),
                TYPE: 'minimissile'
            }
        },
        {
            POSITION: [8, 3, 1, 0, 0.5, 360 / 14, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.shotgun, g.pounder, g.launcher, {shuder: 8}, {reload: 2, damage: 1.5, health: 1.5, resist: 1.25}]),
                TYPE: 'minimissile'
            }
        },
        {
            POSITION: [8, 4, 1, 0, 1, 360 / 14, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.shotgun, g.pounder, g.launcher, {shuder: 8}, {reload: 2, damage: 1.5, health: 1.5, resist: 1.25}]),
                TYPE: 'minimissile'
            }
        },
        {
            POSITION: [8, 4, 1, 0, 1.5, 360 / 14, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.shotgun, g.pounder, g.launcher, {shuder: 8}, {reload: 2, damage: 1.5, health: 1.5, resist: 1.25}]),
                TYPE: 'minimissile'
            }
        },
        {
            POSITION: [9.25, 4, 1, 4, 0, 360 / 14, 0],
        },
        {
            POSITION: [8.5, 6, 1, 4, 0, 360 / 14, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.shotgun, g.pounder, g.launcher, {shuder: 8}, {reload: 2}, g.fake]),
                TYPE: 'minimissile'
            }
        },
        {
            POSITION: [7, 6, -1.6, 4, 0, 360 / 14, 0]
        }
    ], 7),
    TURRETS: weaponArray({
        POSITION: [5, 10, 0, 0, 110, 0],
        TYPE: 'shottrapTurret'
    }, 7),
}
Class.EAB3_rogueArmadaConstructor = {
    PARENT: 'miniboss',
    LABEL: "Rogue Armada",
    UPGRADE_TOOLTIP: "(Constructor)",
    COLOR: 'darkGrey',
    UPGRADE_COLOR: 'darkGrey',
    SHAPE: 7,
    SIZE: 28,
    VALUE: 5e5,
    SKILL: [2, 6, 6, 6, 2, 0, 0, 9, 0, 0],
    BODY: {
        FOV: 1.3,
        SPEED: base.SPEED * 0.1,
        HEALTH: base.HEALTH * 16,
        SHIELD: base.SHIELD * 3,
        REGEN: base.REGEN,
        DAMAGE: base.DAMAGE * 3,
    },
    GUNS: weaponArray([
        {
            POSITION: [8, 2, 1, 0, -2, 360 / 14, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.shotgun, g.pounder, {reload: 2, damage: 1.5, health: 1.5, resist: 1.25}]),
                TYPE: 'casing'
            }
        },
        {
            POSITION: [8, 2, 1, 0, -1.5, 360 / 14, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.shotgun, g.pounder, {reload: 2, damage: 1.5, health: 1.5, resist: 1.25}]),
                TYPE: 'casing'
            }
        },
        {
            POSITION: [8, 2, 1, 0, -1, 360 / 14, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.shotgun, g.pounder, {reload: 2, damage: 1.5, health: 1.5, resist: 1.25}]),
                TYPE: 'bullet'
            }
        },
        {
            POSITION: [8, 3, 1, 0, 0.5, 360 / 14, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.shotgun, g.pounder, {reload: 2, damage: 1.5, health: 1.5, resist: 1.25}]),
                TYPE: 'bullet'
            }
        },
        {
            POSITION: [8, 3, 1, 0, 0, 360 / 14, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.shotgun, g.pounder, {reload: 2, damage: 1.5, health: 1.5, resist: 1.25}]),
                TYPE: 'bullet'
            }
        },
        {
            POSITION: [8, 3, 1, 0, 0.5, 360 / 14, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.shotgun, g.pounder, {reload: 2, damage: 1.5, health: 1.5, resist: 1.25}]),
                TYPE: 'bullet'
            }
        },
        {
            POSITION: [8, 4, 1, 0, 1, 360 / 14, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.shotgun, g.pounder, {reload: 2, damage: 1.5, health: 1.5, resist: 1.25}]),
                TYPE: 'bullet'
            }
        },
        {
            POSITION: [8, 4, 1, 0, 1.5, 360 / 14, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.shotgun, g.pounder, {reload: 2, damage: 1.5, health: 1.5, resist: 1.25}]),
                TYPE: 'casing'
            }
        },
        {
            POSITION: [8.5, 6, 1, 4, 0, 360 / 14, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.shotgun, g.pounder, {reload: 2}, g.fake]),
                TYPE: 'casing'
            }
        },
        {
            POSITION: [7, 6, -1.6, 4, 0, 360 / 14, 0]
        }
    ], 7),
    TURRETS: weaponArray({
        POSITION: [5, 10, 0, 0, 110, 0],
        TYPE: 'EAB3_shotconstructorTurret'
    }, 7),
}
Class.EAB3_rogueArmadaEngineer = {
    PARENT: 'miniboss',
    LABEL: "Rogue Armada",
    UPGRADE_TOOLTIP: "(Engineer)",
    COLOR: 'darkGrey',
    UPGRADE_COLOR: 'darkGrey',
    SHAPE: 7,
    SIZE: 28,
    VALUE: 5e5,
    SKILL: [2, 6, 6, 6, 2, 0, 0, 9, 0, 0],
    BODY: {
        FOV: 1.3,
        SPEED: base.SPEED * 0.1,
        HEALTH: base.HEALTH * 16,
        SHIELD: base.SHIELD * 3,
        REGEN: base.REGEN,
        DAMAGE: base.DAMAGE * 3,
    },
    GUNS: weaponArray([
        {
            POSITION: [8, 2, 1, 0, -2, 360 / 14, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.shotgun, g.pounder, {reload: 2, damage: 1.5, health: 1.5, resist: 1.25}]),
                TYPE: 'casing'
            }
        },
        {
            POSITION: [8, 2, 1, 0, -1.5, 360 / 14, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.shotgun, g.pounder, {reload: 2, damage: 1.5, health: 1.5, resist: 1.25}]),
                TYPE: 'casing'
            }
        },
        {
            POSITION: [8, 2, 1, 0, -1, 360 / 14, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.shotgun, g.pounder, {reload: 2, damage: 1.5, health: 1.5, resist: 1.25}]),
                TYPE: 'bullet'
            }
        },
        {
            POSITION: [8, 3, 1, 0, 0.5, 360 / 14, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.shotgun, g.pounder, {reload: 2, damage: 1.5, health: 1.5, resist: 1.25}]),
                TYPE: 'bullet'
            }
        },
        {
            POSITION: [8, 3, 1, 0, 0, 360 / 14, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.shotgun, g.pounder, {reload: 2, damage: 1.5, health: 1.5, resist: 1.25}]),
                TYPE: 'bullet'
            }
        },
        {
            POSITION: [8, 3, 1, 0, 0.5, 360 / 14, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.shotgun, g.pounder, {reload: 2, damage: 1.5, health: 1.5, resist: 1.25}]),
                TYPE: 'bullet'
            }
        },
        {
            POSITION: [8, 4, 1, 0, 1, 360 / 14, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.shotgun, g.pounder, {reload: 2, damage: 1.5, health: 1.5, resist: 1.25}]),
                TYPE: 'bullet'
            }
        },
        {
            POSITION: [8, 4, 1, 0, 1.5, 360 / 14, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.shotgun, g.pounder, {reload: 2, damage: 1.5, health: 1.5, resist: 1.25}]),
                TYPE: 'casing'
            }
        },
        {
            POSITION: [8.5, 6, 1, 4, 0, 360 / 14, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.shotgun, g.pounder, {reload: 2}, g.fake]),
                TYPE: 'casing'
            }
        },
        {
            POSITION: [7, 6, -1.6, 4, 0, 360 / 14, 0]
        }
    ], 7),
    TURRETS: weaponArray({
        POSITION: [5, 10, 0, 0, 110, 0],
        TYPE: 'EAB3_shotmechTurret'
    }, 7),
}


// RAMMERS
/*
mega, spike, auto, bonker, banger
*/
// Bob
Class.EAB3_megaBob = {
    PARENT: "ramMiniboss",
    LABEL: "Mega Bob",
    UPGRADE_TOOLTIP: "(Mega)",
    SHAPE: 0,
    COLOR: "aqua",
    UPGRADE_COLOR: "aqua",
    SIZE: 18,
    BODY: {
        SPEED: 1.8 * base.SPEED,
        HEALTH: 10 * base.HEALTH,
        DAMAGE: 4.5 * base.DAMAGE,
        REGEN: 8 * base.REGEN,
        FOV: 0.5 * base.FOV,
        DENSITY: 7.5 * base.DENSITY,
    },
    CONTROLLERS: ["nearestDifferentMaster", "mapTargetToGoal"],
    TURRETS: [
        {
            POSITION: [24.5, 0, 0, 0, 360, 0],
            TYPE: ["hexagonHat_spin", { COLOR: "black" }],
        },
        {
            POSITION: [24.5, 0, 0, 30, 360, 0],
            TYPE: ["hexagonHat_spinFaster", { COLOR: "black" }],
        },
        {
            POSITION: [23.75, 0, 0, 0, 360, 0],
            TYPE: ["triangleHat_spin", { COLOR: "black" }],
        }
    ]
}
Class.EAB3_bobby = {
    PARENT: "ramMiniboss",
    LABEL: "Bobby",
    UPGRADE_TOOLTIP: "(Spike)",
    SHAPE: 0,
    COLOR: "aqua",
    UPGRADE_COLOR: "aqua",
    SIZE: 18,
    BODY: {
        SPEED: 1.8 * base.SPEED,
        HEALTH: 4.5 * base.HEALTH,
        DAMAGE: 10 * base.DAMAGE,
        REGEN: 7 * base.REGEN,
        FOV: 0.5 * base.FOV,
        DENSITY: 6 * base.DENSITY,
    },
    CONTROLLERS: ["nearestDifferentMaster", "mapTargetToGoal"],
    TURRETS: [
        {
            POSITION: [21.5, 0, 0, 0, 360, 0],
            TYPE: ["hexagonHat_spin", { COLOR: "black" }],
        },
        {
            POSITION: [21.5, 0, 0, 30, 360, 0],
            TYPE: ["hexagonHat_spinFaster", { COLOR: "black" }],
        },
        {
            POSITION: [24, 0, 0, 0, 360, 0],
            TYPE: ["triangleHat_spin", { COLOR: "black" }],
        },
        {
            POSITION: [24, 0, 0, 60, 360, 0],
            TYPE: ["triangleHat_spinFast", { COLOR: "black" }],
        }
    ]
}
Class.EAB3_autoBob = {
    PARENT: "ramMiniboss",
    LABEL: "Auto-Bob",
    UPGRADE_TOOLTIP: "(Auto)",
    SHAPE: 0,
    COLOR: "aqua",
    UPGRADE_COLOR: "aqua",
    SIZE: 18,
    BODY: {
        SPEED: 1.9 * base.SPEED,
        HEALTH: 4.8 * base.HEALTH,
        DAMAGE: 4.8 * base.DAMAGE,
        REGEN: 8 * base.REGEN,
        FOV: 0.65 * base.FOV,
        DENSITY: 6 * base.DENSITY,
    },
    CONTROLLERS: ["nearestDifferentMaster", "mapTargetToGoal"],
    TURRETS: [
        {
            POSITION: [21.5, 0, 0, 0, 360, 0],
            TYPE: ["hexagonHat_spin", { COLOR: "black" }],
        },
        {
            POSITION: [21.5, 0, 0, 30, 360, 0],
            TYPE: ["hexagonHat_spinFaster", { COLOR: "black" }],
        },
        {
            POSITION: [23.75, 0, 0, 0, 360, 0],
            TYPE: ["triangleHat_spin", { COLOR: "black" }],
        },
        {
            POSITION: [11, 0, 0, 0, 360, 1],
            TYPE: [ "autoSmasherTurret", { INDEPENDENT: false } ],
        }
    ]
}
Class.EAB3_hob = {
    PARENT: "ramMiniboss",
    LABEL: "Hob",
    UPGRADE_TOOLTIP: "(Bonker)",
    SHAPE: 0,
    COLOR: "aqua",
    UPGRADE_COLOR: "aqua",
    SIZE: 12.5,
    BODY: {
        SPEED: 2.5 * base.SPEED,
        HEALTH: 3.5 * base.HEALTH,
        DAMAGE: 5.5 * base.DAMAGE,
        REGEN: 8 * base.REGEN,
        FOV: 0.45 * base.FOV,
        DENSITY: 4 * base.DENSITY,
    },
    CONTROLLERS: ["nearestDifferentMaster", "mapTargetToGoal"],
    TURRETS: [
        {
            POSITION: [21.5, 0, 0, 0, 360, 0],
            TYPE: ["hexagonHat_spin", { COLOR: "black" }],
        },
        {
            POSITION: [21.5, 0, 0, 30, 360, 0],
            TYPE: ["hexagonHat_spinFaster", { COLOR: "black" }],
        },
        {
            POSITION: [24, 0, 0, 0, 360, 0],
            TYPE: ["triangleHat_spin", { COLOR: "black" }],
        }
    ]
}
Class.EAB3_rupert = {
    PARENT: "ramMiniboss",
    LABEL: "Rupert",
    UPGRADE_TOOLTIP: "(Banger)",
    SHAPE: 0,
    COLOR: "aqua",
    UPGRADE_COLOR: "aqua",
    SIZE: 28,
    BODY: {
        SPEED: 2 * base.SPEED,
        HEALTH: 7 * base.HEALTH,
        DAMAGE: 4 * base.DAMAGE,
        REGEN: 8 * base.REGEN,
        FOV: 0.5 * base.FOV,
        DENSITY: 12 * base.DENSITY,
    },
    CONTROLLERS: ["nearestDifferentMaster", "mapTargetToGoal"],
    TURRETS: [
        {
            POSITION: [21.5, 0, 0, 0, 360, 0],
            TYPE: ["hexagonHat_spin", { COLOR: "black" }],
        },
        {
            POSITION: [21.5, 0, 0, 30, 360, 0],
            TYPE: ["hexagonHat_spinFaster", { COLOR: "black" }],
        },
        {
            POSITION: [23, 0, 0, 0, 360, 0],
            TYPE: ["triangleHat_spin", { COLOR: "black" }],
        }
    ]
}
// Nemesis
/*
mega, spike, auto, bonker, banger
*/
Class.EAB3_megaNemesis = {
    PARENT: "ramMiniboss",
    LABEL: "Mega Nemesis",
    UPGRADE_TOOLTIP: "(Mega)",
    SHAPE: 0,
    COLOR: "red",
    UPGRADE_COLOR: "red",
    SIZE: 18,
    BODY: {
        SPEED: 1.8 * base.SPEED,
        HEALTH: 1e6 * 2,
        DAMAGE: 1e5 * 0.9,
        REGEN: 1e5,
        FOV: 5,
        DENSITY: 30 * 1.25,
    },
    CONTROLLERS: ["nearestDifferentMaster", "mapTargetToGoal"],
    TURRETS: [
        {
            POSITION: [24.5, 0, 0, 0, 360, 0],
            TYPE: ["hexagonHat_spin", { COLOR: "black" }],
        },
        {
            POSITION: [24.5, 0, 0, 30, 360, 0],
            TYPE: ["hexagonHat_spinFaster", { COLOR: "black" }],
        },
        {
            POSITION: [23.75, 0, 0, 0, 360, 0],
            TYPE: ["triangleHat_spin", { COLOR: "black" }],
        }
    ]
}
Class.EAB3_antagonist = {
    PARENT: "ramMiniboss",
    LABEL: "Antagonist",
    UPGRADE_TOOLTIP: "(Spike)",
    SHAPE: 0,
    COLOR: "red",
    UPGRADE_COLOR: "red",
    SIZE: 18,
    BODY: {
        SPEED: 1.8 * base.SPEED,
        HEALTH: 1e6 * 0.9,
        DAMAGE: 1e5 * 2,
        REGEN: 1e5 * 0.875,
        FOV: 5,
        DENSITY: 30,
    },
    CONTROLLERS: ["nearestDifferentMaster", "mapTargetToGoal"],
    TURRETS: [
        {
            POSITION: [21.5, 0, 0, 0, 360, 0],
            TYPE: ["hexagonHat_spin", { COLOR: "black" }],
        },
        {
            POSITION: [21.5, 0, 0, 30, 360, 0],
            TYPE: ["hexagonHat_spinFaster", { COLOR: "black" }],
        },
        {
            POSITION: [24, 0, 0, 0, 360, 0],
            TYPE: ["triangleHat_spin", { COLOR: "black" }],
        },
        {
            POSITION: [24, 0, 0, 60, 360, 0],
            TYPE: ["triangleHat_spinFast", { COLOR: "black" }],
        }
    ]
}
Class.EAB3_autoNemesis = {
    PARENT: "ramMiniboss",
    LABEL: "Auto-Nemesis",
    UPGRADE_TOOLTIP: "(Auto)",
    SHAPE: 0,
    COLOR: "red",
    UPGRADE_COLOR: "red",
    SIZE: 18,
    BODY: {
        SPEED: 1.9 * base.SPEED,
        HEALTH: 1e6 * 0.96,
        DAMAGE: 1e5 * 0.96,
        REGEN: 1e5,
        FOV: 5 * 1.3,
        DENSITY: 30,
    },
    CONTROLLERS: ["nearestDifferentMaster", "mapTargetToGoal"],
    TURRETS: [
        {
            POSITION: [21.5, 0, 0, 0, 360, 0],
            TYPE: ["hexagonHat_spin", { COLOR: "black" }],
        },
        {
            POSITION: [21.5, 0, 0, 30, 360, 0],
            TYPE: ["hexagonHat_spinFaster", { COLOR: "black" }],
        },
        {
            POSITION: [23.75, 0, 0, 0, 360, 0],
            TYPE: ["triangleHat_spin", { COLOR: "black" }],
        },
        {
            POSITION: [11, 0, 0, 0, 360, 1],
            TYPE: [ "autoSmasherTurret", { INDEPENDENT: false } ],
        }
    ]
}
Class.EAB3_rival = {
    PARENT: "ramMiniboss",
    LABEL: "Rival",
    UPGRADE_TOOLTIP: "(Bonker)",
    SHAPE: 0,
    COLOR: "red",
    UPGRADE_COLOR: "red",
    SIZE: 12.5,
    BODY: {
        SPEED: 2.5 * base.SPEED,
        HEALTH: 1e6 * 0.7,
        DAMAGE: 1e5 * 1.1,
        REGEN: 1e5,
        FOV: 5 * 0.9,
        DENSITY: 30 * 0.6666666666666666,
    },
    CONTROLLERS: ["nearestDifferentMaster", "mapTargetToGoal"],
    TURRETS: [
        {
            POSITION: [21.5, 0, 0, 0, 360, 0],
            TYPE: ["hexagonHat_spin", { COLOR: "black" }],
        },
        {
            POSITION: [21.5, 0, 0, 30, 360, 0],
            TYPE: ["hexagonHat_spinFaster", { COLOR: "black" }],
        },
        {
            POSITION: [24, 0, 0, 0, 360, 0],
            TYPE: ["triangleHat_spin", { COLOR: "black" }],
        }
    ]
}
Class.EAB3_bandit = {
    PARENT: "ramMiniboss",
    LABEL: "Bandit",
    UPGRADE_TOOLTIP: "(Banger)",
    SHAPE: 0,
    COLOR: "red",
    UPGRADE_COLOR: "red",
    SIZE: 28,
    BODY: {
        SPEED: 2 * base.SPEED,
        HEALTH: 1e6 * 1.4,
        DAMAGE: 1e5 * 0.8,
        REGEN: 1e5,
        FOV: 5,
        DENSITY: 30 * 2,
    },
    CONTROLLERS: ["nearestDifferentMaster", "mapTargetToGoal"],
    TURRETS: [
        {
            POSITION: [21.5, 0, 0, 0, 360, 0],
            TYPE: ["hexagonHat_spin", { COLOR: "black" }],
        },
        {
            POSITION: [21.5, 0, 0, 30, 360, 0],
            TYPE: ["hexagonHat_spinFaster", { COLOR: "black" }],
        },
        {
            POSITION: [23, 0, 0, 0, 360, 0],
            TYPE: ["triangleHat_spin", { COLOR: "black" }],
        }
    ]
}


// TERRESTRIALS
// Ares

// Gersemi

// Ezekiel

// Eris

// Selene

// CELESTIALS
// Paladin
/*
builder, mech
drive, honcho, doper
myriad, molotov
*/

// Freyja
/*
builder, mech
drive, honcho, doper
triplet, protovolley
*/

// Zaphkiel
/*
builder, mech
drive, honcho, doper
hyperskimmer, ticker
*/

// Nyx
/*
builder, mech
drive, honcho, doper
leviathan, pyromaniac
*/

// Theia
/*
builder, mech
drive, honcho, doper
hypertwister, squaller
*/

// ETERNALS
// Kronos
/*
builder, mech
builder missile, skimmer trapper missile
honcho, doper, conveyor
machine quintuplet, diesel triplet
*/

// Odin
/*
builder, mech
drive, honcho, doper
auto-spike launcher, mega-auto smasher launcher
battery-cruiser, gunner-carrier
*/

// DEV
Class.EAB3Menu ??= makeMenu("Extended Armsrace Bosses", {rerootTree: "EAB3Menu"})
Class.EAB3_elites ??= makeMenu("Elites", {color: "pink", boxColor: "pink", shape: 3.5})
Class.EAB3_mysticals ??= makeMenu("Mysticals", {color: "gold", boxColor: "gold", shape: 4})
Class.EAB3_nesters ??= makeMenu("Nesters", {color: "purple", boxColor: "purple", shape: 5.5})
Class.EAB3_rogues ??= makeMenu("Rogues", {color: "darkGrey", boxColor: "darkGrey", shape: 6})
Class.EAB3_rammers ??= makeMenu("Rammers", {color: "aqua", boxColor: "aqua", shape: 0, props: [{TYPE: "dominationBody", POSITION: {SIZE: 21.5, ARC: 360 }}]})
Class.EAB3_terrestrials ??= makeMenu("Terrestrials", {color: "orange", boxColor: "orange", shape: 7.5})
Class.EAB3_celestials ??= makeMenu("Celestials", {color: "lightGreen", boxColor: "lightGreen", shape: 9.5})
Class.EAB3_eternals ??= makeMenu("Eternals", {color: "veryLightGrey", boxColor: "veryLightGrey", shape: 11.5})

Class.EAB3Menu.UPGRADES_TIER_0 = ["EAB3_elites", "EAB3_mysticals", "EAB3_nesters", "EAB3_rogues", "EAB3_rammers", "EAB3_terrestrials", "EAB3_celestials", "EAB3_eternals"]
Class.EAB3_elites.UPGRADES_TIER_0 = [
    "EAB3_eliteDestroyerBigMac", "EAB3_eliteDestroyerConstructor", "EAB3_eliteDestroyerLauncher", "EAB3_eliteDestroyerPenta", "EAB3_eliteDestroyerDrive", "EAB3_eliteDestroyerHoncho", "EAB3_eliteDestroyerDoper",
    "EAB3_eliteGunnerMechanic", "EAB3_eliteGunnerDriver", "EAB3_eliteGunnerSpecialist", "EAB3_eliteGunnerTriplet",
    "EAB3_eliteSprayerRedistributor", "EAB3_eliteSprayerAtomizer", "EAB3_eliteSprayerFocal", "EAB3_eliteSprayerHexaMachine", "EAB3_eliteSprayerTripleSprayer",
    "EAB3_eliteBattleshipCarrier", "EAB3_eliteBattleshipHoncho", "EAB3_eliteBattleshipDoper", "EAB3_eliteBattleshipMore", "EAB3_eliteBattleshipTwin", "EAB3_eliteBattleshipMega",
    "EAB3_eliteSpawnerFactory", "EAB3_eliteSpawnerHoncho", "EAB3_eliteSpawnerDoper", "EAB3_eliteSpawnerTriplet",
    "EAB3_eliteTrapGuardBuilder", "EAB3_eliteTrapGuardMech", "EAB3_eliteTrapGuardTwin", "EAB3_eliteTrapGuardMega", "EAB3_eliteTrapGuardPeashooter",
    "EAB3_eliteSpinnerTornado", "EAB3_eliteSpinnerTempest", "EAB3_eliteSpinnerWhirlwind", "EAB3_eliteSpinnerGale", "EAB3_eliteSpinnerTrove",
    "EAB3_eliteSkimmerHyperSkimmer", "EAB3_eliteSkimmerBazooka", "EAB3_eliteSkimmerSkidder", "EAB3_eliteSkimmerTicker",
]
Class.EAB3_mysticals.UPGRADES_TIER_0 = [
    "EAB3_sorcererdrive", "EAB3_sorcererHoncho", "EAB3_sorcererDoper",
    "EAB3_summonerdrive", "EAB3_summonerHoncho", "EAB3_summonerDoper",
    "EAB3_enchantressdrive", "EAB3_enchantressHoncho", "EAB3_enchantressDoper",
    "EAB3_exorcistordrive", "EAB3_exorcistorHoncho", "EAB3_exorcistorDoper",
    "EAB3_shamandrive", "EAB3_shamanHoncho", "EAB3_shamanDoper",
]
Class.EAB3_nesters.UPGRADES_TIER_0 = [
    "EAB3_nestKeeperDrive", "EAB3_nestKeeperHoncho", "EAB3_nestKeeperDoper", "EAB3_nestKeeperTriplet", "EAB3_nestKeeperRecoiler", "EAB3_nestKeeperBentBoomer", "EAB3_nestKeeperParryer",
    "EAB3_nestWardenCarrier", "EAB3_nestWardenHoncho", "EAB3_nestWardenDoper", "EAB3_nestWardenConstructor", "EAB3_nestWardenEngineer", "EAB3_nestWardenBlockade", "EAB3_nestWardenBarrier", "EAB3_nestWardenPropper",
    "EAB3_nestGuardianBigMac", "EAB3_nestGuardianStomper", "EAB3_nestGuardianLauncher", "EAB3_nestGuardianMyriad", "EAB3_nestGuardianMolotov", "EAB3_nestGuardianCatapult", "EAB3_nestGuardianHyperTwister",
]
Class.EAB3_rogues.UPGRADES_TIER_0 = [
    "EAB3_roguePalisadeMegaSpawner", "EAB3_roguePalisadeHoncho", "EAB3_roguePalisadeDoper", "EAB3_roguePalisadeBuilder", "EAB3_roguePalisadeMech",
    "EAB3_rogueArmadaBoomstick", "EAB3_rogueArmadaPumper", "EAB3_rogueArmadaConstructor", "EAB3_rogueArmadaEngineer"
]
Class.EAB3_rammers.UPGRADES_TIER_0 = [
    "EAB3_megaBob", "EAB3_bobby", "EAB3_autoBob", "EAB3_hob", "EAB3_rupert",
    "EAB3_megaNemesis", "EAB3_antagonist", "EAB3_autoNemesis", "EAB3_rival", "EAB3_bandit",
]
Class.EAB3_terrestrials.UPGRADES_TIER_0 = []
Class.EAB3_celestials.UPGRADES_TIER_0 = []
Class.EAB3_eternals.UPGRADES_TIER_0 = []

Class.menu_addons.UPGRADES_TIER_0.push("EAB3Menu");

if (true) {
    Class.eliteDestroyer.UPGRADES_TIER_0 = ["EAB3_eliteDestroyerBigMac", "EAB3_eliteDestroyerConstructor", "EAB3_eliteDestroyerLauncher", "EAB3_eliteDestroyerPenta", "EAB3_eliteDestroyerDrive", "EAB3_eliteDestroyerHoncho", "EAB3_eliteDestroyerDoper"]
    Class.eliteGunner.UPGRADES_TIER_0 = ["EAB3_eliteGunnerMechanic", "EAB3_eliteGunnerDriver", "EAB3_eliteGunnerSpecialist", "EAB3_eliteGunnerTriplet"]
    Class.eliteSprayer.UPGRADES_TIER_0 = ["EAB3_eliteSprayerRedistributor", "EAB3_eliteSprayerAtomizer", "EAB3_eliteSprayerFocal", "EAB3_eliteSprayerHexaMachine", "EAB3_eliteSprayerTripleSprayer"]
    Class.eliteBattleship.UPGRADES_TIER_0 = ["EAB3_eliteBattleshipCarrier", "EAB3_eliteBattleshipHoncho", "EAB3_eliteBattleshipDoper", "EAB3_eliteBattleshipMore", "EAB3_eliteBattleshipTwin", "EAB3_eliteBattleshipMega"]
    Class.eliteSpawner.UPGRADES_TIER_0 = ["EAB3_eliteSpawnerFactory", "EAB3_eliteSpawnerHoncho", "EAB3_eliteSpawnerDoper", "EAB3_eliteSpawnerTriplet"]
    Class.eliteTrapGuard.UPGRADES_TIER_0 = ["EAB3_eliteTrapGuardBuilder", "EAB3_eliteTrapGuardMech", "EAB3_eliteTrapGuardTwin", "EAB3_eliteTrapGuardMega", "EAB3_eliteTrapGuardPeashooter"]
    Class.eliteSpinner.UPGRADES_TIER_0 = ["EAB3_eliteSpinnerTornado", "EAB3_eliteSpinnerTempest", "EAB3_eliteSpinnerWhirlwind", "EAB3_eliteSpinnerGale", "EAB3_eliteSpinnerTrove"]
    Class.eliteSkimmer.UPGRADES_TIER_0 = ["EAB3_eliteSkimmerHyperSkimmer", "EAB3_eliteSkimmerBazooka", "EAB3_eliteSkimmerSkidder", "EAB3_eliteSkimmerTicker"]

    Class.sorcerer.UPGRADES_TIER_0 = ["EAB3_sorcererdrive", "EAB3_sorcererHoncho", "EAB3_sorcererDoper"]
    Class.summoner.UPGRADES_TIER_0 = ["EAB3_summonerdrive", "EAB3_summonerHoncho", "EAB3_summonerDoper"]
    Class.enchantress.UPGRADES_TIER_0 = ["EAB3_enchantressdrive", "EAB3_enchantressHoncho", "EAB3_enchantressDoper"]
    Class.exorcistor.UPGRADES_TIER_0 = ["EAB3_exorcistordrive", "EAB3_exorcistorHoncho", "EAB3_exorcistorDoper"]
    Class.shaman.UPGRADES_TIER_0 = ["EAB3_shamandrive", "EAB3_shamanHoncho", "EAB3_shamanDoper"]

    Class.nestKeeper.UPGRADES_TIER_0 = ["EAB3_nestKeeperDrive", "EAB3_nestKeeperHoncho", "EAB3_nestKeeperDoper", "EAB3_nestKeeperTriplet", "EAB3_nestKeeperRecoiler", "EAB3_nestKeeperBentBoomer", "EAB3_nestKeeperParryer"]
    Class.nestWarden.UPGRADES_TIER_0 = ["EAB3_nestWardenCarrier", "EAB3_nestWardenHoncho", "EAB3_nestWardenDoper", "EAB3_nestWardenConstructor", "EAB3_nestWardenEngineer", "EAB3_nestWardenBlockade", "EAB3_nestWardenBarrier", "EAB3_nestWardenPropper"]
    Class.nestGuardian.UPGRADES_TIER_0 = ["EAB3_nestGuardianBigMac", "EAB3_nestGuardianStomper", "EAB3_nestGuardianLauncher", "EAB3_nestGuardianMyriad", "EAB3_nestGuardianMolotov", "EAB3_nestGuardianCatapult", "EAB3_nestGuardianHyperTwister"]

    Class.roguePalisade.UPGRADES_TIER_0 = ["EAB3_roguePalisadeMegaSpawner", "EAB3_roguePalisadeHoncho", "EAB3_roguePalisadeDoper", "EAB3_roguePalisadeBuilder", "EAB3_roguePalisadeMech"]
    Class.rogueArmada.UPGRADES_TIER_0 = ["EAB3_rogueArmadaBoomstick", "EAB3_rogueArmadaPumper", "EAB3_rogueArmadaConstructor", "EAB3_rogueArmadaEngineer"]

    Class.bob.UPGRADES_TIER_0 = ["EAB3_megaBob", "EAB3_bobby", "EAB3_autoBob", "EAB3_hob", "EAB3_rupert"]
    Class.nemesis.UPGRADES_TIER_0 = ["EAB3_megaNemesis", "EAB3_antagonist", "EAB3_autoNemesis", "EAB3_rival", "EAB3_bandit"]
}