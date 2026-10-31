const { combineStats, skillSet, makeAuto, makemakeMenu, addAura, LayeredBoss, makeDeco, weaponArray, setTurretProjectileRecoil, makeMenu } = require('../facilitators.js');
const { smshskl, base } = require('../constants.js');
const g = require('../gunvals.js');
const {makeTurret} = require("../facilitators");

Class.EKMenu = makeMenu("EK makeMenu", "veryLightGrey", 0)
Class.EKMenu.UPGRADES_TIER_0 = []

g.half_reload = {reload: 2}
g.half_recoil = {recoil: 0.5}
g.less_power = {health: 0.9, damage: 0.9, pen: 0.9}
g.less_damage = {health: 0.9, damage: 0.85}
g.auto = g.autoTurret
g.flank = g.flankGuard
g.pure_gunner = {recoil: 0.25, size: 1.1, health: 1.45, damage: 0.3, pen: 1.25, speed: 0.9, density: 1.5, resist: 1.2}
g.fast = {speed: 1.2}
g.bit_more_damage = {health: 1.05, damage: 1.1}
g.more_speed = {speed: 1.3, maxSpeed: 1.3}
g.one_fourth_reload = {reload: 1.25}
g.over = g.overseer
g.meta = {reload: 1.25, health: 0.85, damage: 0.8}
g.bigger = {size: 1.25}
g.hunter2 = g.hunterSecondary
g.more_reload = {reload: 0.85}
g.fast_launch = {speed: 1.4}
g.double_size = {size: 2}
g.pound = g.pounder
g.nail = g.nailgun
g.one_third_reload = {reload: 4/3}
g.bent = g.tripleShot
g.minion = g.minionGun
g.no_recoil = {recoil: 0}
g.tri = g.triAngle
g.less_reload = {reload: 1.5}
g.bit_smaller = {size: 0.84}
g.bit_bigger = {size: 1.16}
g.very_fast_launch = {speed: 2.2}
g.preda = g.predator
g.dem_mach = {reload: 2.85, recoil: 0, shudder: 1.25, size: 0.55, health: 0.75, damage: 0.25, pen: 0.75, maxSpeed: 0.85, spray: 1.25}
g.dual2 = {shudder: 0.8, health: 0.5, damage: 0.55, pen: 0.7, resist: 0.75}
g.bit_less_damage = {health: 0.95, damage: 0.9}
g.mach = g.machineGun
g.arty = g.artillery
g.spread = g.spreadshot
g.spread_main = g.spreadshotMain

// Controllable
Class.bulletLayer6 = {
    PARENT: ["bullet"],
    LAYER: 6
};
Class.tripletAutoGun3 = {
    LABEL: 'Triplet',
    BODY: {
        FOV: 1.05
    },
    CONTROLLERS: ['nearestDifferentMaster'],
    COLOR: "grey",
    HAS_NO_RECOIL: true,
    GUNS: [
        {
            POSITION: [16.5, 8, 1, 0, 5.4, 0, .5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.triplet, g.half_reload, g.less_power, g.less_damage, g.auto, g.flank]),
                TYPE: "bulletLayer6"
            }
        },
        {
            POSITION: [16.5, 8, 1, 0, -5.4, 0, .5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.triplet, g.half_reload, g.less_power, g.less_damage, g.auto, g.flank]),
                TYPE: "bulletLayer6"
            }
        },
        {
            POSITION: [18.5, 8, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.triplet, g.half_reload, g.less_power, g.less_damage, g.auto, g.flank]),
                TYPE: "bulletLayer6"
            }
        }
    ]
}
Class.eggBossTank = makeAuto("auto3", 'EK-0', {
    type: "tripletAutoGun3"
})
Class.eggBossCircleProp = {
    SHAPE: 0,
    COLOR: "veryLightGrey",
}
Class.auto3gun = {
    LABEL: '',
    BODY: {
        FOV: 2.5
    },
    CONTROLLERS: ['canRepel', 'onlyAcceptInArc', 'mapAltToFire', 'nearestDifferentMaster'],
    COLOR: 16,
    GUNS: [
        {
            POSITION: [22, 10, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.flank, g.auto]),
                TYPE: "bullet"
            }
        }
    ]
}
Class.eggBossAuto3gun = {
    PARENT: ["auto3gun"],
    GUNS: [
        {
            POSITION: [22, 10, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.flank, g.auto, g.half_recoil]),
                TYPE: ["bullet", {COLOR: "veryLightGrey"}],
            }
        }
    ]
}
Class.weirdGunnerAuto1 = {
    LABEL: '',
    BODY: {
        FOV: 2
    },
    COLOR: "grey",
    CONTROLLERS: ['nearestDifferentMaster'],
    HAS_NO_RECOIL: true,
    GUNS: [
        {
            POSITION: [15, 5, 1, 0, 6, 0, .5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.pure_gunner, g.fast, g.half_reload]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: [15, 5, 1, 0, -6, 0, .5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.pure_gunner, g.fast, g.half_reload]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: [18, 5, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.pure_gunner, g.fast, g.half_reload]),
                TYPE: "bullet"
            }
        }
    ]
};
Class.weirdGunnerAuto4 = {
    PARENT: ["weirdGunnerAuto1"],
    GUNS: [
        {
            POSITION: [15, 5, 1, 0, 6, 0, .5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.pure_gunner, g.fast, g.half_reload, g.half_recoil]),
                TYPE: ["bullet", {COLOR: "veryLightGrey"}],
            }
        },
        {
            POSITION: [15, 5, 1, 0, -6, 0, .5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.pure_gunner, g.fast, g.half_reload, g.half_recoil]),
                TYPE: ["bullet", {COLOR: "veryLightGrey"}],
            }
        },
        {
            POSITION: [18, 5, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.pure_gunner, g.fast, g.half_reload, g.half_recoil]),
                TYPE: ["bullet", {COLOR: "veryLightGrey"}],
            }
        }
    ]
}
Class.eggBossTier1 = {
    PARENT: ["genericTank"],
    LABEL: 'EK-1',
    DANGER: 8,
    COLOR: "black",
    UPGRADE_COLOR: "veryLightGrey",
    SHAPE: 6,
    SIZE: 25,
    FACING_TYPE: 'autospin',
    HITS_OWN_TYPE: "hardOnlyBosses",
    BODY: {
        FOV: 0.85,
        SPEED: 1.3,
        ACCELERATION: 0.3,
        HEALTH: 500,
        DENSITY: base.DENSITY * 2,
        PUSHABILITY: 0.05,
    },
    TURRETS: [
        {
            POSITION: [16.5, 0, 0, 0, 360, 1],
            TYPE: "eggBossCircleProp"
        },
        {
            POSITION: [7.5, 9, 0, 0, 190, 0],
            TYPE: "eggBossAuto3gun"
        },
        {
            POSITION: [7.5, 9, 0, 60, 190, 0],
            TYPE: "eggBossAuto3gun"
        },
        {
            POSITION: [7.5, 9, 0, 120, 190, 0],
            TYPE: "eggBossAuto3gun"
        },
        {
            POSITION: [7.5, 9, 0, 180, 190, 0],
            TYPE: "eggBossAuto3gun"
        },
        {
            POSITION: [7.5, 9, 0, 240, 190, 0],
            TYPE: "eggBossAuto3gun"
        },
        {
            POSITION: [7.5, 9, 0, 300, 190, 0],
            TYPE: "eggBossAuto3gun"
        },
        {
            POSITION: [7.5, 0, 0, 30, 360, 1],
            TYPE: "weirdGunnerAuto4"
        }
    ],
}
Class.weirdGunnerAuto3 = {
    LABEL: 'Gunner',
    BODY: {
        FOV: 1.5
    },
    COLOR: "veryLightGrey",
    CONTROLLERS: ['canRepel', 'onlyAcceptInArc', 'mapAltToFire', 'nearestDifferentMaster'],
    GUNS: [
        {
            POSITION: [14, 2, 1, 0, 9, 0, .5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.pure_gunner, g.more_speed, g.half_reload]),
                TYPE: ["bullet", {COLOR: "veryLightGrey"}],
            }
        },
        {
            POSITION: [14, 2, 1, 0, -9, 0, .75],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.pure_gunner, g.more_speed, g.half_reload]),
                TYPE: ["bullet", {COLOR: "veryLightGrey"}],
            }
        },
        {
            POSITION: [16, 3.5, 1, 0, 2.65, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.pure_gunner, g.more_speed, g.half_reload]),
                TYPE: ["bullet", {COLOR: "veryLightGrey"}],
            }
        },
        {
            POSITION: [16, 3.5, 1, 0, -2.65, 0, .25],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.pure_gunner, g.more_speed, g.half_reload]),
                TYPE: ["bullet", {COLOR: "veryLightGrey"}],
            }
        }
    ],
    HAS_NO_RECOIL: true
}
Class.eggBossTier2 = {
    PARENT: ["genericTank"],
    LABEL: 'EK-2',
    DANGER: 8,
    LEVEL: 60,
    VALUE: 59212,
    COLOR: "black",
    UPGRADE_COLOR: "veryLightGrey",
    SHAPE: 6,
    SIZE: 32,
    FACING_TYPE: 'autospin',
    HITS_OWN_TYPE: "hardOnlyBosses",
    BODY: {
        FOV: .85,
        SPEED: 1.25,
        ACCELERATION: .25,
        HEALTH: 1000,
        DAMAGE: 6,
        REGEN: .015,
        DENSITY: base.DENSITY * 2,
        PUSHABILITY: 0.05,
    },
    GUNS: [
        ...weaponArray({
            POSITION: [6, 3, .5, 8, 0, 60, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.swarm, g.bit_more_damage]),
                TYPE: ["swarm", {LAYER: 6, COLOR: "veryLightGrey"}],
                STAT_CALCULATOR: "swarm",
            }
        }, 3)
    ],
    TURRETS: [
        {
            POSITION: [16, 0, 0, 0, 360, 1],
            TYPE: "eggBossCircleProp"
        },
        ...weaponArray([
            {
                POSITION: [2.5, 10, 3.7, 60, 190, 0],
                TYPE: "eggBossAuto3gun"
            },
            {
                POSITION: [2.5, 10, -3.7, 60, 190, 0],
                TYPE: "eggBossAuto3gun"
            },
        ], 3),
        ...weaponArray({
            POSITION: [10.2, 9.6, 0, 0, 190, 0],
            TYPE: "weirdGunnerAuto3"
        }, 3),
        {
            POSITION: [5.6, 0, 0, 0, 360, 1],
            TYPE: ["autoTurret", {CONTROLLERS: ['nearestDifferentMaster']}]
        }
    ]
}
Class.directorAutoGun = {
    LABEL: 'Director',
    BODY: {
        FOV: 2.5
    },
    CONTROLLERS: ['onlyAcceptInArc', 'nearestDifferentMaster'],
    COLOR: 16,
    MAX_CHILDREN: 3,
    GUNS: [
        {
            POSITION: [6.1, 12, 1.25, 8, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.drone, g.over, g.meta, g.bigger, g.half_reload]),
                TYPE: ["bullet", {LAYER: 6}],
                AUTOFIRE: true,
                SYNCS_SKILLS: true,
                STAT_CALCULATOR: "drone",
            }
        }
    ]
};
Class.directorAutoGun2 = {
    PARENT: ["directorAutoGun"],
    MAX_CHILDREN: 5,
    GUNS: [
        {
            POSITION: [6.1, 12, 1.25, 8, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.drone, g.over, g.meta, g.bigger, g.half_reload]),
                TYPE: ["drone", {LAYER: 6, COLOR: "veryLightGrey"}],
                AUTOFIRE: true,
                SYNCS_SKILLS: true,
                STAT_CALCULATOR: "drone",
            }
        }
    ]
}
Class.twinAutoGun3 = {
    LABEL: 'Twin',
    BODY: {
        FOV: 2
    },
    CONTROLLERS: ['canRepel', 'onlyAcceptInArc', 'mapAltToFire', 'nearestDifferentMaster'],
    COLOR: 16,
    HAS_NO_RECOIL: true,
    GUNS: [
        {
            POSITION: [22, 7, 1, 0, 6, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.half_reload, g.one_fourth_reload]),
                TYPE: ["bullet", {COLOR: "veryLightGrey"}],
            }
        },
        {
            POSITION: [22, 7, 1, 0, -6, 0, .5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.half_reload, g.one_fourth_reload]),
                TYPE: ["bullet", {COLOR: "veryLightGrey"}],
            }
        }
    ]
}
Class.shifterAutoGun2 = {
    LABEL: 'Shifter',
    BODY: {
        FOV: 2
    },
    CONTROLLERS: ['nearestDifferentMaster'],
    COLOR: 16,
    HAS_NO_RECOIL: true,
    GUNS: [
        {
            POSITION: [20, 11, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.hunter, g.hunter2, g.half_reload, g.more_reload]),
                TYPE: "bulletLayer6",
            }
        },
        {
            POSITION: [17.5, 15, 1, 0, 0, 0, .25],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.hunter, g.half_reload, g.more_reload]),
                TYPE: "bulletLayer6",
            }
        }
    ]
}
Class.shifterAutoGun3 = {
    PARENT: ["shifterAutoGun2"],
    GUNS: [
        {
            POSITION: [20, 11, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.hunter, g.hunter2, g.half_reload, g.more_reload]),
                TYPE: ["bulletLayer6", {COLOR: "veryLightGrey"}],
            }
        },
        {
            POSITION: [17.5, 15, 1, 0, 0, 0, .25],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.hunter, g.half_reload, g.more_reload]),
                TYPE: ["bulletLayer6", {COLOR: "veryLightGrey"}],
            }
        }
    ]
}
Class.eggBossTier3 = {
    PARENT: ["genericTank"],
    LABEL: 'EK-3',
    DANGER: 8,
    LEVEL: 60,
    VALUE: 59212,
    COLOR: "black",
    UPGRADE_COLOR: "veryLightGrey",
    SHAPE: 12,
    SIZE: 42,
    HITS_OWN_TYPE: "hardOnlyBosses",
    BODY: {
        FOV: 0.78,
        SPEED: 1.15,
        ACCELERATION: 0.2,
        HEALTH: 825,
        DAMAGE: 6,
        REGEN: 0.015,
        DENSITY: base.DENSITY * 2,
        PUSHABILITY: 0.05,
    },
    FACING_TYPE: 'autospin',
    GUNS: [
        ...weaponArray([
            {
                POSITION: [8, 2.3, .46, 7, 1.3, 30, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.swarm, g.bit_more_damage]),
                    TYPE: ["autoswarm", {LAYER: 6, COLOR: "veryLightGrey"}],
                    STAT_CALCULATOR: "swarm",
                }
            },
            {
                POSITION: [8, 2.3, .46, 7, -1.3, 30, 0.5],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.swarm, g.bit_more_damage]),
                    TYPE: ["autoswarm", {LAYER: 6, COLOR: "veryLightGrey"}],
                    STAT_CALCULATOR: "swarm",
                }
            },
        ], 6)
    ],
    TURRETS: [
        {
            POSITION: [16.6, 0, 0, 0, 360, 1],
            TYPE: "eggBossCircleProp"
        },
        ...weaponArray({
            POSITION: [3.5, 5.5, 0, 0, 361, 1],
            TYPE: "directorAutoGun2"
        }, 3),
        ...weaponArray([
            {
                POSITION: [2, 10.2, 1.5, 0, 190, 0],
                TYPE: "twinAutoGun3"
            },
            {
                POSITION: [2, 10.2, -1.5, 0, 190, 0],
                TYPE: "twinAutoGun3"
            },
        ], 6),
        {
            POSITION: [6.4, 0, 0, 180, 361, 1],
            TYPE: "shifterAutoGun3"
        }
    ]
}
const eggBossProps1 = {
    SHOOT_SETTINGS: combineStats([g.basic, g.gunner, g.power, g.twin, g.nail, g.one_fourth_reload]),
    TYPE: ["bullet", {COLOR: "veryLightGrey"}],
}
Class.pentaAutoGun = {
    LABEL: 'Penta Shot',
    BODY: {
        FOV: 1.9
    },
    CONTROLLERS: ['canRepel', 'onlyAcceptInArc', 'mapAltToFire', 'nearestDifferentMaster'],
    COLOR: 16,
    HAS_NO_RECOIL: true,
    GUNS: [
        {
            POSITION: [16, 8, 1, 0, -3, -30, 2 / 3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.bent, g.minion, g.half_reload, g.one_third_reload]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: [16, 8, 1, 0, 3, 30, 2 / 3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.bent, g.minion, g.half_reload, g.one_third_reload]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: [19, 8, 1, 0, -2, -15, 1 / 3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.bent, g.minion, g.half_reload, g.one_third_reload]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: [19, 8, 1, 0, 2, 15, 1 / 3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.bent, g.minion, g.half_reload, g.one_third_reload]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: [22, 8, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.bent, g.minion, g.half_reload, g.one_third_reload]),
                TYPE: "bullet"
            }
        }
    ]
}
Class.weirdGunnerAuto2 = {
    LABEL: '',
    BODY: {
        FOV: 1.5
    },
    COLOR: 16,
    CONTROLLERS: ['nearestDifferentMaster'],
    GUNS: [
        {
            POSITION: [11, 2.5, 1, 0, 8.7, 0, .75],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.pure_gunner, g.fast, g.half_reload]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: [11, 2.5, 1, 0, -8.7, 0, .75],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.pure_gunner, g.fast, g.half_reload]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: [12.5, 2.5, 1, 0, 7.25, 0, .5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.pure_gunner, g.fast, g.half_reload, g.no_recoil]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: [12.5, 2.5, 1, 0, -7.25, 0, .5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.pure_gunner, g.fast, g.half_reload, g.no_recoil]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: [14, 2.5, 1, 0, 5.5, 0, .25],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.pure_gunner, g.fast, g.half_reload]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: [14, 2.5, 1, 0, -5.5, 0, .25],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.pure_gunner, g.fast, g.half_reload]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: [16.5, 2.4, 1, 0, 3.2, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.pure_gunner, g.fast, g.half_reload, g.no_recoil]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: [16.5, 2.4, 1, 0, -3.2, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.pure_gunner, g.fast, g.half_reload, g.no_recoil]),
                TYPE: "bullet"
            }
        }
    ]
}
Class.EK4_Minion = {
    PARENT: ["minion"],
    LABEL: 'Mega Minion',
    DRAW_HEALTH: true,
    SHAPE: 8,
    COLOR: "veryLightGrey",
    SIZE: 26,
    BODY: {
        FOV: 0.6,
        SPEED: 0.6,
        ACCELERATION: 0.26,
        HEALTH: 25,
        SHIELD: 1,
        DAMAGE: 1.5,
        RESIST: 1,
        PENETRATION: 1,
        DENSITY: 0.5,
        RANGE: 150
    },
    HAS_NO_RECOIL: true,
    FACING_TYPE: 'autospin',
    GUNS: [
        ...weaponArray([
            {
                POSITION: [7, 2.3, .46, 7, 1.3, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.swarm, g.one_third_reload]),
                    TYPE: ["swarm", {LAYER: 5.5, CONTROLLERS: ['canRepel']}],
                    STAT_CALCULATOR: "swarm",
                }
            },
            {
                POSITION: [7, 2.3, .46, 7, -1.3, 0, .5],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.swarm, g.one_third_reload]),
                    TYPE: ["autoswarm", {LAYER: 5.5}],
                    STAT_CALCULATOR: "swarm",
                }
            },
        ], 4),
    ],
    TURRETS: [
        ...weaponArray({
            POSITION: [2.5, 10.6, 0, 22.5, 190, 0],
            TYPE: "auto3gun"
        }, 8),
        ...weaponArray({
            POSITION: [5.1, 10, 0, 45, 180, 0],
            TYPE: "pentaAutoGun"
        }, 4),
        {
            POSITION: [12, 0, 0, 22.5, 361, 1],
            TYPE: "weirdGunnerAuto2"
        }
    ]
}
Class.falconMinion = {
    PARENT: ["minion"],
    LABEL: 'Falcon Minion',
    GUNS: [
        {
            POSITION: [27, 8.5, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.assassin, g.less_reload]),
                TYPE: "bullet",
            }
        },
        {
            POSITION: [5, 8.5, -1.6, 8, 0, 0, 0]
        },
        {
            POSITION: [16, 8, 1, 0, 0, 150, .1],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.flank, g.tri, g.thruster, g.half_recoil]),
                TYPE: "bullet",
                STAT_CALCULATOR: "thruster"
            }
        },
        {
            POSITION: [16, 8, 1, 0, 0, 210, .1],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.flank, g.tri, g.thruster, g.half_recoil]),
                TYPE: "bullet",
                STAT_CALCULATOR: "thruster"
            }
        },
        {
            POSITION: [18, 8, 1, 0, 0, 180, .6],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.flank, g.tri, g.thruster, g.half_recoil]),
                TYPE: "bullet",
                STAT_CALCULATOR: "thruster"
            }
        }
    ]
}
Class.eagleMinion = {
    PARENT: ["minion"],
    LABEL: 'Eagle Minion',
    GUNS: [
        {
            POSITION: [20, 12, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pound, g.one_fourth_reload]),
                TYPE: "bullet",
                LABEL: 'Pounder'
            }
        },
        {
            POSITION: [16, 8, 1, 0, 0, 150, .1],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.flank, g.tri, g.thruster, g.half_recoil]),
                TYPE: "bullet",
                STAT_CALCULATOR: "thruster"
            }
        },
        {
            POSITION: [16, 8, 1, 0, 0, 210, .1],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.flank, g.tri, g.thruster, g.half_recoil]),
                TYPE: "bullet",
                STAT_CALCULATOR: "thruster"
            }
        },
        {
            POSITION: [18, 8, 1, 0, 0, 180, .6],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.flank, g.tri, g.thruster, g.half_recoil]),
                TYPE: "bullet",
                STAT_CALCULATOR: "thruster"
            }
        }
    ]
}
Class.weirdTwinAutoGun = {
    LABEL: 'Dual Single',
    BODY: {
        FOV: 1.9
    },
    CONTROLLERS: ['nearestDifferentMaster'],
    COLOR: "grey",
    HAS_NO_RECOIL: true,
    GUNS: [
        {
            POSITION: [19.4, 5, 1, 0, 6, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.single, g.half_reload, g.half_recoil]),
                TYPE: "bulletLayer6"
            }
        },
        {
            POSITION: [9.5, 7.5, .65, 2, 6, 0, 0]
        },
        {
            POSITION: [19.4, 5, 1, 0, -6, 0, .5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.single, g.half_reload, g.half_recoil]),
                TYPE: "bulletLayer6"
            }
        },
        {
            POSITION: [9.5, 7.5, .65, 2, -6, 0, 0]
        }
    ]
}
Class.weirdTwinAutoGun2 = {
    PARENT: ["weirdTwinAutoGun"],
    GUNS: [
        {
            POSITION: [19.4, 5, 1, 0, 6, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.single, g.half_reload, g.half_recoil]),
                TYPE: ["bulletLayer6", {COLOR: "veryLightGrey"}],
            }
        },
        {
            POSITION: [9.5, 7.5, .65, 2, 6, 0, 0]
        },
        {
            POSITION: [19.4, 5, 1, 0, -6, 0, .5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.single, g.half_reload, g.half_recoil]),
                TYPE: ["bulletLayer6", {COLOR: "veryLightGrey"}],
            }
        },
        {
            POSITION: [9.5, 7.5, .65, 2, -6, 0, 0]
        }
    ]
}
Class.eggBossTier4 = {
    PARENT: ["genericTank"],
    LABEL: 'EK-4',
    DANGER: 8,
    LEVEL: 60,
    VALUE: 59212,
    COLOR: "black",
    UPGRADE_COLOR: "veryLightGrey",
    SHAPE: 12,
    SIZE: 56,
    HITS_OWN_TYPE: "hardOnlyBosses",
    BODY: {
        FOV: 0.75,
        SPEED: 1.1,
        ACCELERATION: 0.15,
        HEALTH: 2000,
        DAMAGE: 4,
        REGEN: 0.015,
        DENSITY: base.DENSITY * 2,
        PUSHABILITY: 0.05,
    },
    FACING_TYPE: 'autospin',
    GUNS: [
        ...weaponArray({
            POSITION: [6, 3, .5, 8, 0, 60, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.swarm, g.pound]),
                TYPE: ["swarm", {LAYER: 6, COLOR: "veryLightGrey"}],
                STAT_CALCULATOR: "swarm",
            }
        }, 4),
        ...weaponArray([
            {
                POSITION: [12.5, .39, 1, 0, 1.91, 30, 2 / 3],
                PROPERTIES: eggBossProps1
            },
            {
                POSITION: [12.5, .39, 1, 0, .9, 30, 1 / 3],
                PROPERTIES: eggBossProps1
            },
            {
                POSITION: [12.833, .39, 1, 0, 1.4, 30, 0],
                PROPERTIES: eggBossProps1
            },
            {
                POSITION: [2.4, 1.6, -2.5, 8.5, 1.4, 30, 0]
            },
            {
                POSITION: [12.5, .39, 1, 0, -1.91, 30, 2 / 3],
                PROPERTIES: eggBossProps1
            },
            {
                POSITION: [12.5, .39, 1, 0, -0.9, 30, 1 / 3],
                PROPERTIES: eggBossProps1
            },
            {
                POSITION: [12.833, .39, 1, 0, -1.4, 30, 0],
                PROPERTIES: eggBossProps1
            },
            {
                POSITION: [2.4, 1.6, -2.5, 8.5, -1.4, 30, 0]
            },
        ], 4),
        ...weaponArray([
            {
                POSITION: [1.79, 3, 1, 10.71, 0, 0, 0]
            },
            {
                POSITION: [3.31, 4, 1, 7.94, 0, 0, 0]
            },
        ], 4),
        {
            POSITION: [1, 4.31, 1, 12.2, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.spawner, g.double_size, g.bigger, g.bigger, g.fast_launch]),
                TYPE: ["EK4_Minion", {COLOR: "veryLightGrey"}],
                STAT_CALCULATOR: "drone",
                AUTOFIRE: true,
                SYNCS_SKILLS: true,
                MAX_CHILDREN: 1,
            }
        },
        {
            POSITION: [1, 4.31, 1, 12.2, 0, 180, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.spawner, g.double_size, g.bigger, g.bigger, g.fast_launch]),
                TYPE: ["EK4_Minion", {COLOR: "veryLightGrey"}],
                STAT_CALCULATOR: "drone",
                AUTOFIRE: true,
                SYNCS_SKILLS: true,
                MAX_CHILDREN: 1,
            }
        },
        {
            POSITION: [1, 4.31, 1, 12.2, 0, 90, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.spawner, g.bigger, g.fast_launch]),
                TYPE: ["falconMinion", {COLOR: "veryLightGrey"}],
                STAT_CALCULATOR: "drone",
                AUTOFIRE: true,
                SYNCS_SKILLS: true,
                MAX_CHILDREN: 1,
            }
        },
        {
            POSITION: [1, 4.31, 1, 12.2, 0, 270, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.spawner, g.bigger, g.fast_launch]),
                TYPE: ["eagleMinion", {COLOR: "veryLightGrey"}],
                STAT_CALCULATOR: "drone",
                AUTOFIRE: true,
                SYNCS_SKILLS: true,
                MAX_CHILDREN: 1,
            }
        },
    ],
    TURRETS: [
        {
            POSITION: [18, 0, 0, 0, 360, 1],
            TYPE: "eggBossCircleProp"
        },
        ...weaponArray({
            POSITION: [4.7, 6.1, 0, 45, 190, 1],
            TYPE: "weirdTwinAutoGun2"
        }, 4),
    ]
}
Class.ultraSmasherBody = {
    COLOR: "black",
    SHAPE: 6,
    INDEPENDENT: true
};
Class.ultraSmasherMinion = {
    PARENT: ["minion"],
    LABEL: 'Ultra Smasher Minion',
    DRAW_HEALTH: true,
    SHAPE: 6,
    BODY: {
        FOV: 0.5,
        SPEED: 1.25,
        ACCELERATION: 0.25,
        HEALTH: 50,
        SHIELD: 1,
        DAMAGE: 2,
        RESIST: 1,
        PENETRATION: 1,
        DENSITY: 0.5,
        RANGE: 150
    },
    FACING_TYPE: 'autospin',
    GUNS: [],
    TURRETS: [
        {
            POSITION: [20.1, 0, 0, 0, 360, 1],
            TYPE: "ultraSmasherBody"
        },
        {
            POSITION: [16.5, 0, 0, 0, 360, 1],
            TYPE: "eggBossCircleProp"
        },
        ...weaponArray({
            POSITION: [7.5, 9, 0, 0, 190, 0],
            TYPE: "auto3gun"
        }, 6),
        {
            POSITION: [7.5, 0, 0, 30, 360, 1],
            TYPE: "weirdGunnerAuto1"
        }
    ]
}
Class.superHeavyMach = {
    LABEL: '',
    BODY: {
        FOV: 2.25
    },
    CONTROLLERS: ['canRepel', 'onlyAcceptInArc', 'mapAltToFire', 'nearestDifferentMaster'],
    COLOR: "grey",
    GUNS: [
        {
            POSITION: [14.25, 5, 1, 3, -3.25, 0, .5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.dem_mach]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: [14.25, 5, 1, 3, 3.25, 0, .5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.dem_mach]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: [15.85, 5, 1, 3, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.dem_mach]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: [12.25, 14, -1.35, 0, 0, 0, 0]
        }
    ]
}
Class.carnivoreAutoGun = {
    LABEL: '',
    BODY: {
        FOV: 2.5
    },
    CONTROLLERS: ['canRepel', 'onlyAcceptInArc', 'mapAltToFire', 'nearestDifferentMaster'],
    COLOR: "grey",
    GUNS: [
        {
            POSITION: [26, 7, 1, 4, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.hunter, g.hunter2, g.sniper, g.less_damage, g.one_fourth_reload, g.half_reload]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: [23, 11, 1, 4, 0, 0, .15],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.hunter, g.sniper, g.less_damage, g.one_fourth_reload, g.half_reload]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: [7, 10.5, -1.6, 6, 0, 0, 0]
        }
    ]
}
Class.autoRangerGun2 = {
    LABEL: 'Ranger',
    BODY: {
        FOV: 2.25
    },
    CONTROLLERS: ['nearestDifferentMaster'],
    COLOR: "grey",
    GUNS: [
        {
            POSITION: [28, 8.5, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.assassin, g.half_reload]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: [5, 8.5, -1.6, 8, 0, 0, 0]
        }
    ]
};
Class.ultraCannonMinion = {
    PARENT: ["minion"],
    LABEL: 'Ultra Cannon Minion',
    HAS_NO_RECOIL: true,
    DRAW_HEALTH: true,
    BODY: {
        FOV: 0.6,
        SPEED: 1,
        ACCELERATION: 0.2,
        HEALTH: 45,
        SHIELD: 1,
        DAMAGE: 1.5,
        RESIST: 1,
        PENETRATION: 1,
        DENSITY: 0.5,
        RANGE: 150
    },
    GUNS: [
        {
            POSITION: [26, 4, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.hunter, g.hunter2, g.hunter2, g.hunter2, g.hunter2, g.preda, g.minion]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: [24, 7, 1, 0, 0, 0, .15],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.hunter, g.hunter2, g.hunter2, g.hunter2, g.preda, g.minion]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: [22, 10, 1, 0, 0, 0, .3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.hunter, g.hunter2, g.hunter2, g.preda, g.minion]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: [20, 13, 1, 0, 0, 0, .45],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.hunter, g.hunter2, g.preda, g.minion]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: [18, 16, 1, 0, 0, 0, .6],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.hunter, g.preda, g.minion]),
                TYPE: "bullet"
            }
        }
    ],
    TURRETS: [
        ...weaponArray({
            POSITION: [4.5, 7.5, 0, 60, 180, 1],
            TYPE: "superHeavyMach"
        }, 3),
        ...weaponArray({
            POSITION: [5.5, 6.5, 0, 0, 120, 1],
            TYPE: "carnivoreAutoGun"
        }, 3),
        {
            POSITION: [5.5, 9.5, 0, 72, 180, 0],
            TYPE: ["autoRangerGun2", {CONTROLLERS: ['canRepel', 'onlyAcceptInArc', 'mapAltToFire', 'nearestDifferentMaster']}]
        },
        {
            POSITION: [5.5, 9.5, 0, 144, 120, 0],
            TYPE: ["autoRangerGun2", {CONTROLLERS: ['canRepel', 'onlyAcceptInArc', 'mapAltToFire', 'nearestDifferentMaster']}]
        },
        {
            POSITION: [5.5, 9.5, 0, -72, 180, 0],
            TYPE: ["autoRangerGun2", {CONTROLLERS: ['canRepel', 'onlyAcceptInArc', 'mapAltToFire', 'nearestDifferentMaster']}]
        },
        {
            POSITION: [5.5, 9.5, 0, -144, 120, 0],
            TYPE: ["autoRangerGun2", {CONTROLLERS: ['canRepel', 'onlyAcceptInArc', 'mapAltToFire', 'nearestDifferentMaster']}]
        }
    ]
}
Class.OPPredatorAutoGun2 = {
    LABEL: 'Aggressor',
    BODY: {
        FOV: 2.1
    },
    CONTROLLERS: ['canRepel', 'onlyAcceptInArc', 'mapAltToFire', 'nearestDifferentMaster'],
    COLOR: "grey",
    HAS_NO_RECOIL: true,
    GUNS: [
        {
            POSITION: [22, 3, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.hunter, g.hunter2, g.hunter2, g.hunter2, g.hunter2, g.hunter2, g.hunter2, g.preda, g.more_speed, g.half_reload, g.less_reload]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: [20.5, 5.5, 1, 0, 0, 0, .11],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.hunter, g.hunter2, g.hunter2, g.hunter2, g.hunter2, g.hunter2, g.preda, g.more_speed, g.half_reload, g.less_reload]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: [19, 8, 1, 0, 0, 0, .22],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.hunter, g.hunter2, g.hunter2, g.hunter2, g.hunter2, g.preda, g.more_speed, g.half_reload, g.less_reload]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: [17.5, 10.5, 1, 0, 0, 0, .33],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.hunter, g.hunter2, g.hunter2, g.hunter2, g.preda, g.more_speed, g.half_reload, g.less_reload]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: [16, 13, 1, 0, 0, 0, .44],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.hunter, g.hunter2, g.hunter2, g.preda, g.more_speed, g.half_reload, g.less_reload]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: [14.5, 15.5, 1, 0, 0, 0, .55],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.hunter, g.hunter2, g.preda, g.more_speed, g.half_reload, g.less_reload]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: [13, 18, 1, 0, 0, 0, .66],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.hunter, g.preda, g.more_speed, g.half_reload, g.less_reload]),
                TYPE: "bullet"
            }
        }
    ]
}
Class.OPPredatorAutoGun1 = {
    LABEL: 'Predator',
    BODY: {
        FOV: 2
    },
    CONTROLLERS: ['canRepel', 'onlyAcceptInArc', 'mapAltToFire', 'nearestDifferentMaster'],
    COLOR: "grey",
    HAS_NO_RECOIL: true,
    GUNS: [
        {
            POSITION: [19, 11, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.hunter, g.hunter2, g.hunter2, g.preda, g.half_reload]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: [17, 15, 1, 0, 0, 0, .15],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.hunter, g.hunter2, g.preda, g.half_reload]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: [13.5, 19, 1, 0, 0, 0, .3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.hunter, g.preda, g.half_reload]),
                TYPE: "bullet"
            }
        }
    ]
}
Class.scalerAutoGun = {
    LABEL: 'Scaler',
    BODY: {
        FOV: 1.9
    },
    CONTROLLERS: ['nearestDifferentMaster'],
    COLOR: "grey",
    HAS_NO_RECOIL: true,
    GUNS: [
        {
            POSITION: [16, 3, 1, 0, 7.9, 0, 2 / 3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.one_fourth_reload, g.half_reload, g.more_reload]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: [16, 3, 1, 0, -7.9, 0, 2 / 3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.one_fourth_reload, g.half_reload, g.more_reload]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: [21, 4, 1, 0, 5.1, 0, 1 / 3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.gunner, g.half_reload, g.more_reload]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: [21, 4, 1, 0, -5.1, 0, 1 / 3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.gunner, g.half_reload, g.more_reload]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: [26, 8, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.one_fourth_reload, g.half_reload, g.more_reload]),
                TYPE: "bullet",
            }
        }
    ]
}
Class.octoAutoGun = {
    LABEL: 'Octo Tank',
    BODY: {
        FOV: 2
    },
    CONTROLLERS: ['nearestDifferentMaster'],
    COLOR: 16,
    HAS_NO_RECOIL: true,
    GUNS: [
        {
            POSITION: [18, 8, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.flank, g.flank, g.spam, g.half_reload]),
                TYPE: "bulletLayer6"
            }
        },
        {
            POSITION: [18, 8, 1, 0, 0, 90, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.flank, g.flank, g.spam, g.half_reload]),
                TYPE: "bulletLayer6"
            }
        },
        {
            POSITION: [18, 8, 1, 0, 0, 180, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.flank, g.flank, g.spam, g.half_reload]),
                TYPE: "bulletLayer6"
            }
        },
        {
            POSITION: [18, 8, 1, 0, 0, 270, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.flank, g.flank, g.spam, g.half_reload]),
                TYPE: "bulletLayer6"
            }
        },
        {
            POSITION: [18, 8, 1, 0, 0, 45, .5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.flank, g.flank, g.spam, g.half_reload]),
                TYPE: "bulletLayer6"
            }
        },
        {
            POSITION: [18, 8, 1, 0, 0, 135, .5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.flank, g.flank, g.spam, g.half_reload]),
                TYPE: "bulletLayer6"
            }
        },
        {
            POSITION: [18, 8, 1, 0, 0, 225, .5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.flank, g.flank, g.spam, g.half_reload]),
                TYPE: "bulletLayer6"
            }
        },
        {
            POSITION: [18, 8, 1, 0, 0, 315, .5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.flank, g.flank, g.spam, g.half_reload]),
                TYPE: "bulletLayer6"
            }
        }
    ]
}
Class.OPDualAutoGun1 = {
    LABEL: 'OP Dual',
    BODY: {
        FOV: 1.75
    },
    CONTROLLERS: ['nearestDifferentMaster'],
    COLOR: 16,
    HAS_NO_RECOIL: true,
    GUNS: [
        {
            POSITION: [13.2, 5.3, 1, 0, 5.75, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.dual, g.dual2, g.bit_less_damage, g.half_reload, g.less_reload]),
                TYPE: "bulletLayer6"
            }
        },
        {
            POSITION: [11.6, 6.9, 1, 0, 5.75, 0, .1],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.dual, g.dual2, g.half_reload, g.less_reload]),
                TYPE: "bulletLayer6"
            }
        },
        {
            POSITION: [10, 8.5, 1, 0, 5.75, 0, .2],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.dual, g.half_reload, g.less_reload]),
                TYPE: "bulletLayer6"
            }
        },
        {
            POSITION: [13.2, 5.3, 1, 0, -5.75, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.dual, g.dual2, g.bit_less_damage, g.half_reload, g.less_reload]),
                TYPE: "bulletLayer6"
            }
        },
        {
            POSITION: [11.6, 6.9, 1, 0, -5.75, 0, .1],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.dual, g.dual2, g.half_reload, g.less_reload]),
                TYPE: "bulletLayer6"
            }
        },
        {
            POSITION: [10, 8.5, 1, 0, -5.75, 0, .2],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.dual, g.half_reload, g.less_reload]),
                TYPE: "bulletLayer6"
            }
        },
        {
            POSITION: [14.8, 5.3, 1, 0, 0, 0, .5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.dual, g.dual2, g.bit_less_damage, g.half_reload, g.less_reload]),
                TYPE: "bulletLayer6"
            }
        },
        {
            POSITION: [13.2, 6.9, 1, 0, 0, 0, .6],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.dual, g.dual2, g.half_reload, g.less_reload]),
                TYPE: "bulletLayer6"
            }
        },
        {
            POSITION: [11.6, 8.5, 1, 0, 0, 0, .7],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.dual, g.half_reload, g.less_reload]),
                TYPE: "bulletLayer6"
            }
        }
    ]
}
Class.OPDualAutoGun2 = {
    LABEL: 'Mega Dual',
    BODY: {
        FOV: 1.75
    },
    CONTROLLERS: ['nearestDifferentMaster'],
    COLOR: 16,
    HAS_NO_RECOIL: true,
    GUNS: [
        {
            POSITION: [13.2, 5.3, 1, 0, 5.75, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.dual, g.dual2, g.bit_less_damage, g.half_reload, g.less_reload]),
                TYPE: "bulletLayer6"
            }
        },
        {
            POSITION: [11.6, 6.9, 1, 0, 5.75, 0, .1],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.dual, g.dual2, g.half_reload, g.less_reload]),
                TYPE: "bulletLayer6"
            }
        },
        {
            POSITION: [10, 8.5, 1, 0, 5.75, 0, .2],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.dual, g.half_reload, g.less_reload]),
                TYPE: "bulletLayer6"
            }
        },
        {
            POSITION: [13.2, 5.3, 1, 0, -5.75, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.dual, g.dual2, g.bit_less_damage, g.half_reload, g.less_reload]),
                TYPE: "bulletLayer6"
            }
        },
        {
            POSITION: [11.6, 6.9, 1, 0, -5.75, 0, .1],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.dual, g.dual2, g.half_reload, g.less_reload]),
                TYPE: "bulletLayer6"
            }
        },
        {
            POSITION: [10, 8.5, 1, 0, -5.75, 0, .2],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.dual, g.half_reload, g.less_reload]),
                TYPE: "bulletLayer6"
            }
        },
        {
            POSITION: [21.8, 2.5, 1, 0, 0, 0, .5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.dual, g.dual2, g.bit_less_damage, g.half_reload, g.less_reload]),
                TYPE: "bulletLayer6"
            }
        },
        {
            POSITION: [20.6, 4, 1, 0, 0, 0, .55],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.dual, g.dual2, g.bit_less_damage, g.half_reload, g.less_reload]),
                TYPE: "bulletLayer6"
            }
        },
        {
            POSITION: [19.4, 5.5, 1, 0, 0, 0, .6],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.dual, g.dual2, g.bit_less_damage, g.half_reload, g.less_reload]),
                TYPE: "bulletLayer6"
            }
        },
        {
            POSITION: [18.2, 7, 1, 0, 0, 0, .65],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.dual, g.dual2, g.half_reload, g.less_reload]),
                TYPE: "bulletLayer6"
            }
        },
        {
            POSITION: [17, 8.5, 1, 0, 0, 0, .7],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.dual, g.half_reload, g.less_reload]),
                TYPE: "bulletLayer6"
            }
        },
        {
            POSITION: [8.2, 3, 1.56, 8, 3.2, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.mach, g.half_reload, g.less_reload]),
                TYPE: "bulletLayer6"
            }
        },
        {
            POSITION: [8.2, 3, 1.56, 8, -3.2, 0, .5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.mach, g.half_reload, g.less_reload]),
                TYPE: "bulletLayer6"
            }
        }
    ]
}
Class.eggBossTier5 = {
    PARENT: ["genericTank"],
    LABEL: 'EK-5',
    DANGER: 9,
    SHAPE: 16,
    COLOR: "veryLightGrey",
    UPGRADE_COLOR: "veryLightGrey",
    SIZE: 100,
    LEVEL: 60,
    VALUE: 59212,
    FACING_TYPE: 'autospin',
    HAS_NO_RECOIL: true,
    HITS_OWN_TYPE: "hardOnlyBosses",
    BODY: {
        FOV: 0.74,
        SPEED: 0.9,
        ACCELERATION: 0.1,
        HEALTH: 3500,
        DAMAGE: 6,
        REGEN: 0.015,
        PUSHABILITY: 0.05,
    },
    GUNS: [
        {
            POSITION: [1.67, 2.45, 1, 10.48, 0, 180, 0]
        },
        {
            POSITION: [1, 3.7, 1.01, 12.2, 0, 180, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.spawner, g.double_size, g.bit_smaller, g.half_reload, g.very_fast_launch]),
                TYPE: "ultraSmasherMinion",
                STAT_CALCULATOR: "drone",
                AUTOFIRE: true,
                SYNCS_SKILLS: true,
                MAX_CHILDREN: 2
            }
        },
        {
            POSITION: [3.4, 3.4, 1, 8, 0, 180, 0]
        },
        {
            POSITION: [1.67, 2.45, 1, 10.48, 0, 0, 0]
        },
        {
            POSITION: [1, 3.7, 1.01, 12.2, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.spawner, g.double_size, g.bit_bigger, g.half_reload, g.very_fast_launch]),
                TYPE: "ultraCannonMinion",
                STAT_CALCULATOR: "drone",
                AUTOFIRE: true,
                SYNCS_SKILLS: true,
                MAX_CHILDREN: 1
            }
        },
        {
            POSITION: [3.4, 3.4, 1, 8, 0, 0, 0]
        },
        {
            POSITION: [.815, 1.25, 1, 10.11, .98, 90, 0]
        },
        {
            POSITION: [.49, 1.81, 1.01, 11, .98, 90, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.spawner, g.double_size, g.half_reload, g.very_fast_launch]),
                TYPE: "eagleMinion",
                STAT_CALCULATOR: "drone",
                AUTOFIRE: true,
                SYNCS_SKILLS: true,
                MAX_CHILDREN: 2
            }
        },
        {
            POSITION: [1.66, 1.66, 1, 8.9, .98, 90, 0]
        },
        {
            POSITION: [.815, 1.25, 1, 10.11, -0.98, 90, 0]
        },
        {
            POSITION: [.49, 1.81, 1.01, 11, -0.98, 90, .5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.spawner, g.double_size, g.half_reload, g.very_fast_launch]),
                TYPE: "falconMinion",
                STAT_CALCULATOR: "drone",
                AUTOFIRE: true,
                SYNCS_SKILLS: true,
                MAX_CHILDREN: 2
            }
        },
        {
            POSITION: [1.66, 1.66, 1, 8.9, -0.98, 90, 0]
        },
        {
            POSITION: [.815, 1.25, 1, 10.11, .98, 270, 0]
        },
        {
            POSITION: [.49, 1.81, 1.01, 11, .98, 270, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.spawner, g.double_size, g.half_reload, g.very_fast_launch]),
                TYPE: "eagleMinion",
                STAT_CALCULATOR: "drone",
                AUTOFIRE: true,
                SYNCS_SKILLS: true,
                MAX_CHILDREN: 2
            }
        },
        {
            POSITION: [1.66, 1.66, 1, 8.9, .98, 270, 0]
        },
        {
            POSITION: [.815, 1.25, 1, 10.11, -0.98, 270, 0]
        },
        {
            POSITION: [.49, 1.81, 1.01, 11, -0.98, 270, .5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.spawner, g.double_size, g.half_reload, g.very_fast_launch]),
                TYPE: "falconMinion",
                STAT_CALCULATOR: "drone",
                AUTOFIRE: true,
                SYNCS_SKILLS: true,
                MAX_CHILDREN: 2
            }
        },
        {
            POSITION: [1.66, 1.66, 1, 8.9, -0.98, 270, 0]
        }
    ],
    TURRETS: [
        ...weaponArray({
            POSITION: [4.6, 10, 0, 22.5, 190, 0],
            TYPE: "OPPredatorAutoGun2"
        }, 8),
        ...weaponArray({
            POSITION: [3.1, 10, 0, 45, 190, 0],
            TYPE: "OPPredatorAutoGun1"
        }, 4),
        {
            POSITION: [2.2, 6.8, 0, 90, 220, 1],
            TYPE: "scalerAutoGun"
        },
        {
            POSITION: [2.2, 6.8, 0, 270, 220, 1],
            TYPE: "scalerAutoGun"
        },
        {
            POSITION: [2.1, 6.2, 4.1, 0, 360, 1],
            TYPE: "octoAutoGun"
        },
        {
            POSITION: [2.1, 6.2, -4.1, 0, 360, 1],
            TYPE: "octoAutoGun"
        },
        {
            POSITION: [2.1, -6.2, 4.1, 0, 360, 1],
            TYPE: "octoAutoGun"
        },
        {
            POSITION: [2.1, -6.2, -4.1, 0, 360, 1],
            TYPE: "octoAutoGun"
        },
        {
            POSITION: [4.75, 6.5, 0, 0, 220, 1],
            TYPE: "OPDualAutoGun1"
        },
        {
            POSITION: [4.75, 6.5, 0, 180, 220, 1],
            TYPE: "OPDualAutoGun1"
        },
        {
            POSITION: [6.2, 0, 0, 90, 361, 1],
            TYPE: "OPDualAutoGun2"
        }
    ]
}
Class.bentAutoGun = {
    LABEL: 'Triple Shot',
    BODY: {
        FOV: 1.1
    },
    CONTROLLERS: ['canRepel', 'onlyAcceptInArc', 'mapAltToFire', 'nearestDifferentMaster'],
    COLOR: "grey",
    HAS_NO_RECOIL: true,
    GUNS: [
        {
            POSITION: [19, 8, 1, 0, -2, -20, .5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.bent, g.half_reload]),
                TYPE: "bulletLayer6"
            }
        },
        {
            POSITION: [19, 8, 1, 0, 2, 20, .5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.bent, g.half_reload]),
                TYPE: "bulletLayer6"
            }
        },
        {
            POSITION: [22, 8, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.bent, g.half_reload]),
                TYPE: "bulletLayer6"
            }
        }
    ]
}
const spreadshotProps3 = {
    SHOOT_SETTINGS: combineStats([g.basic, g.gunner, g.arty, g.twin, g.spread, g.half_reload]),
    TYPE: "bulletLayer6"
}
Class.spreadSnipeAutoGun = {
    LABEL: 'Snipeling',
    BODY: {
        FOV: 1.2
    },
    CONTROLLERS: ['canRepel', 'onlyAcceptInArc', 'mapAltToFire', 'nearestDifferentMaster'],
    COLOR: "grey",
    HAS_NO_RECOIL: true,
    GUNS: [
        {
            POSITION: [16, 4, 1, 0, -1, -45, .75],
            PROPERTIES: spreadshotProps3
        },
        {
            POSITION: [17.5, 4, 1, 0, -1.75, -30, .5],
            PROPERTIES: spreadshotProps3
        },
        {
            POSITION: [19, 4, 1, 0, -2, -15, .25],
            PROPERTIES: spreadshotProps3
        },
        {
            POSITION: [16, 4, 1, 0, 1, 45, .75],
            PROPERTIES: spreadshotProps3
        },
        {
            POSITION: [17.5, 4, 1, 0, 1.75, 30, .5],
            PROPERTIES: spreadshotProps3
        },
        {
            POSITION: [19, 4, 1, 0, 2, 15, .25],
            PROPERTIES: spreadshotProps3
        },
        {
            POSITION: [24, 8.5, 1, 8, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pound, g.spread_main, g.spread, g.sniper, g.half_reload]),
                TYPE: "bulletLayer6",
                LABEL: 'Primary'
            }
        }
    ]
}
Class.OPDualAutoGun2 = {
    LABEL: 'Mega Dual',
    BODY: {
        FOV: 1.75
    },
    CONTROLLERS: ['nearestDifferentMaster'],
    COLOR: "16",
    HAS_NO_RECOIL: true,
    GUNS: [
        {
            POSITION: [13.2, 5.3, 1, 0, 5.75, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.dual, g.dual2, g.bit_less_damage, g.half_reload, g.less_reload]),
                TYPE: "bulletLayer6"
            }
        },
        {
            POSITION: [11.6, 6.9, 1, 0, 5.75, 0, .1],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.dual, g.dual2, g.half_reload, g.less_reload]),
                TYPE: "bulletLayer6"
            }
        },
        {
            POSITION: [10, 8.5, 1, 0, 5.75, 0, .2],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.dual, g.half_reload, g.less_reload]),
                TYPE: "bulletLayer6"
            }
        },
        {
            POSITION: [13.2, 5.3, 1, 0, -5.75, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.dual, g.dual2, g.bit_less_damage, g.half_reload, g.less_reload]),
                TYPE: "bulletLayer6"
            }
        },
        {
            POSITION: [11.6, 6.9, 1, 0, -5.75, 0, .1],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.dual, g.dual2, g.half_reload, g.less_reload]),
                TYPE: "bulletLayer6"
            }
        },
        {
            POSITION: [10, 8.5, 1, 0, -5.75, 0, .2],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.dual, g.half_reload, g.less_reload]),
                TYPE: "bulletLayer6"
            }
        },
        {
            POSITION: [21.8, 2.5, 1, 0, 0, 0, .5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.dual, g.dual2, g.bit_less_damage, g.half_reload, g.less_reload]),
                TYPE: "bulletLayer6"
            }
        },
        {
            POSITION: [20.6, 4, 1, 0, 0, 0, .55],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.dual, g.dual2, g.bit_less_damage, g.half_reload, g.less_reload]),
                TYPE: "bulletLayer6"
            }
        },
        {
            POSITION: [19.4, 5.5, 1, 0, 0, 0, .6],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.dual, g.dual2, g.bit_less_damage, g.half_reload, g.less_reload]),
                TYPE: "bulletLayer6"
            }
        },
        {
            POSITION: [18.2, 7, 1, 0, 0, 0, .65],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.dual, g.dual2, g.half_reload, g.less_reload]),
                TYPE: "bulletLayer6"
            }
        },
        {
            POSITION: [17, 8.5, 1, 0, 0, 0, .7],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.dual, g.half_reload, g.less_reload]),
                TYPE: "bulletLayer6"
            }
        },
        {
            POSITION: [8.2, 3, 1.56, 8, 3.2, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.mach, g.half_reload, g.less_reload]),
                TYPE: "bulletLayer6"
            }
        },
        {
            POSITION: [8.2, 3, 1.56, 8, -3.2, 0, .5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.mach, g.half_reload, g.less_reload]),
                TYPE: "bulletLayer6"
            }
        }
    ]
}
Class.insaneHunterAutoGun = {
    LABEL: 'Panultimate Hunter',
    BODY: {
        FOV: 1.25
    },
    CONTROLLERS: ['canRepel', 'onlyAcceptInArc', 'mapAltToFire', 'nearestDifferentMaster'],
    COLOR: 16,
    HAS_NO_RECOIL: true,
    SYNC_TURRET_SKILLS: true,
    GUNS: [
        {
            POSITION: [33, 3.25, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.hunter, g.hunter2, g.hunter2, g.hunter2, g.preda, g.half_reload, g.half_reload]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: [31.5, 4.5, 1, 0, 0, 0, .05],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.hunter, g.hunter2, g.hunter2, g.hunter2, g.preda, g.half_reload, g.half_reload]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: [30, 6, 1, 0, 0, 0, .1],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.hunter, g.hunter2, g.hunter2, g.hunter2, g.preda, g.half_reload, g.half_reload]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: [28.5, 7.5, 1, 0, 0, 0, .15],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.hunter, g.hunter2, g.hunter2, g.hunter2, g.preda, g.half_reload, g.half_reload]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: [27, 9, 1, 0, 0, 0, .2],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.hunter, g.hunter2, g.hunter2, g.hunter2, g.preda, g.half_reload, g.half_reload]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: [25.5, 10.5, 1, 0, 0, 0, .25],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.hunter, g.hunter2, g.hunter2, g.hunter2, g.preda, g.half_reload, g.half_reload]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: [24, 12, 1, 0, 0, 0, .3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.hunter, g.hunter2, g.hunter2, g.hunter2, g.preda, g.half_reload, g.half_reload]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: [22.5, 13.5, 1, 0, 0, 0, .35],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.hunter, g.hunter2, g.hunter2, g.hunter2, g.preda, g.half_reload, g.half_reload]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: [21, 15, 1, 0, 0, 0, .4],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.hunter, g.hunter2, g.hunter2, g.preda, g.half_reload, g.half_reload]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: [19.5, 16.5, 1, 0, 0, 0, .45],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.hunter, g.hunter2, g.preda, g.half_reload, g.half_reload]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: [18, 18, 1, 0, 0, 0, .5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.hunter, g.preda, g.half_reload, g.half_reload]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: [13, 18, -1.111, 0, 0, 0, 0]
        }
    ],
    TURRETS: [
        {
            POSITION: [14.25, 0, 0, 0, 360, 1],
            TYPE: "eggBossCircleProp"
        }
    ]
}
Class.ek4_minion_2 = {
    PARENT: ["eggBossTier4"],
    LABEL: 'EK-4 Minion',
    TYPE: 'minion',
    DAMAGE_CLASS: 0,
    HITS_OWN_TYPE: 'hardWithBuffer',
    FACING_TYPE: 'autospin',
    BODY: {
        FOV: .8,
        SPEED: 1.2,
        ACCELERATION: .35,
        HEALTH: 600,
        DENSITY: base.DENSITY * 2
    },
    DRAW_HEALTH: false,
    CLEAR_ON_MASTER_UPGRADE: true,
    GIVE_KILL_MESSAGE: false,
    CONTROLLERS: ['nearestDifferentMaster', 'mapAltToFire', 'minion', 'canRepel', 'hangOutNearMaster'],
    ALWAYS_ACTIVE: true
}
Class.eggBossTier6_base = {
    LABEL: 'Base',
    SYNC_TURRET_SKILLS: true,
    MIRROR_MASTER_ANGLE: true,
    COLOR: "black",
    SHAPE: 6,
    TURRETS: [],
    GUNS: []
}
for (let i = 0; i < 6; i++) {
    let angle = i * 60;
    Class.eggBossTier6_base.TURRETS.push(
        {
            POSITION: [3.425, 9.625, 2, angle + 30, 145, 0],
            TYPE: "insaneHunterAutoGun"
        },
        {
            POSITION: [3.425, 9.625, -2, angle + 30, 145, 0],
            TYPE: "insaneHunterAutoGun"
        }
    );
    Class.eggBossTier6_base.GUNS.push(
        {
            POSITION: [1.25, 2.15, 1, 9.71, 0, angle, 0]
        },
        {
            POSITION: [.725, 3.4, 1, 10.7, 0, angle, i],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.spawner, g.very_fast_launch, g.half_reload, g.half_reload, g.half_reload]),
                TYPE: ["ek4_minion_2", {COLOR: "black"}],
                STAT_CALCULATOR: "drone",
                AUTOFIRE: true,
                SYNCS_SKILLS: true,
                MAX_CHILDREN: 1,
            }
        },
        {
            POSITION: [3.31, 3.15, 1, 6.94, 0, angle, 0]
        }
    );
}
Class.eggBossTier6 = {
    PARENT: ["genericTank"],
    LABEL: 'EK-6',
    DANGER: 9,
    LEVEL: 60,
    VALUE: 59212,
    COLOR: "veryLightGrey",
    UPGRADE_COLOR: "veryLightGrey",
    SHAPE: 6,
    SIZE: 175,
    HAS_NO_RECOIL: true,
    HITS_OWN_TYPE: "hardOnlyBosses",
    BODY: {
        FOV: .66,
        SPEED: 1,
        ACCELERATION: .15,
        HEALTH: 2250,
        DAMAGE: 6,
        REGEN: .015,
        DENSITY: base.DENSITY * 2,
        PUSHABILITY: 0.05,
    },
    FACING_TYPE: 'autospin',
    TURRETS: [
        {
            POSITION: [.71, 8.5, 0, 180, 135, 1],
            TYPE: "bentAutoGun"
        },
        {
            POSITION: [.71, 8.5, 1.625, 180, 135, 1],
            TYPE: "bentAutoGun"
        },
        {
            POSITION: [.71, 8.5, -1.625, 180, 135, 1],
            TYPE: "bentAutoGun"
        },
        {
            POSITION: [.71, 8.5, 0, 240, 135, 1],
            TYPE: "bentAutoGun"
        },
        {
            POSITION: [.71, 8.5, 1.625, 240, 135, 1],
            TYPE: "bentAutoGun"
        },
        {
            POSITION: [.71, 8.5, -1.625, 240, 135, 1],
            TYPE: "bentAutoGun"
        },
        {
            POSITION: [.71, 8.5, 0, 0, 135, 1],
            TYPE: "bentAutoGun"
        },
        {
            POSITION: [.71, 8.5, 1.625, 0, 135, 1],
            TYPE: "bentAutoGun"
        },
        {
            POSITION: [.71, 8.5, -1.625, 0, 135, 1],
            TYPE: "bentAutoGun"
        },
        {
            POSITION: [.71, 8.5, 0, 60, 135, 1],
            TYPE: "bentAutoGun"
        },
        {
            POSITION: [.71, 8.5, 1.625, 60, 135, 1],
            TYPE: "bentAutoGun"
        },
        {
            POSITION: [.71, 8.5, -1.625, 60, 135, 1],
            TYPE: "bentAutoGun"
        },
        {
            POSITION: [1.2, 6, -.9, 0, 135, 1],
            TYPE: "spreadSnipeAutoGun"
        },
        {
            POSITION: [1.2, 6, .9, 60, 135, 1],
            TYPE: "spreadSnipeAutoGun"
        },
        {
            POSITION: [1.2, 6, -.9, 180, 135, 1],
            TYPE: "spreadSnipeAutoGun"
        },
        {
            POSITION: [1.2, 6, .9, 240, 135, 1],
            TYPE: "spreadSnipeAutoGun"
        },
        {
            POSITION: [2.55, 4.85, 1.45, 30, 165, 1],
            TYPE: ["OPDualAutoGun2", {COLOR: "veryLightGrey"}]
        },
        {
            POSITION: [2.55, 4.85, -1.45, 30, 165, 1],
            TYPE: ["OPDualAutoGun2", {COLOR: "veryLightGrey"}]
        },
        {
            POSITION: [2.55, 4.85, 1.45, 210, 165, 1],
            TYPE: ["OPDualAutoGun2", {COLOR: "veryLightGrey"}]
        },
        {
            POSITION: [2.55, 4.85, -1.45, 210, 165, 1],
            TYPE: ["OPDualAutoGun2", {COLOR: "veryLightGrey"}]
        },
        {
            POSITION: [2.55, 4.85, 2.5, 120, 165, 1],
            TYPE: ["OPDualAutoGun2", {COLOR: "veryLightGrey"}]
        },
        {
            POSITION: [2.55, 4.85, -2.5, 120, 165, 1],
            TYPE: ["OPDualAutoGun2", {COLOR: "veryLightGrey"}]
        },
        {
            POSITION: [2.55, 4.85, 2.5, 300, 165, 1],
            TYPE: ["OPDualAutoGun2", {COLOR: "veryLightGrey"}]
        },
        {
            POSITION: [2.55, 4.85, -2.5, 300, 165, 1],
            TYPE: ["OPDualAutoGun2", {COLOR: "veryLightGrey"}]
        },
        {
            POSITION: [2.55, 7.25, 0, 120, 165, 1],
            TYPE: ["OPDualAutoGun2", {COLOR: "veryLightGrey"}]
        },
        {
            POSITION: [2.55, 7.25, 0, 300, 165, 1],
            TYPE: ["OPDualAutoGun2", {COLOR: "veryLightGrey"}]
        },
        {
            POSITION: [21.15, 0, 0, 0, 0, 0],
            TYPE: "eggBossTier6_base"
        }
    ]
}
Class.ek1_minion = {
    PARENT: ["eggBossTier1"],
    LABEL: 'EK-1 Minion',
    TYPE: 'minion',
    DAMAGE_CLASS: 0,
    HITS_OWN_TYPE: 'hardWithBuffer',
    FACING_TYPE: 'autospin',
    BODY: {
        FOV: .9,
        SPEED: 1.35,
        ACCELERATION: .35,
        HEALTH: 300,
        DENSITY: base.DENSITY * 2
    },
    DRAW_HEALTH: false,
    CLEAR_ON_MASTER_UPGRADE: true,
    GIVE_KILL_MESSAGE: false,
    CONTROLLERS: ['nearestDifferentMaster', 'mapAltToFire', 'minion', 'canRepel', 'hangOutNearMaster'],
    ALWAYS_ACTIVE: true
}
Class.ek1_factory = {
    LABEL: 'Spawner',
    BODY: {
        FOV: 1.25
    },
    CONTROLLERS: ['canRepel', 'onlyAcceptInArc', 'mapAltToFire', 'nearestDifferentMaster'],
    COLOR: "veryLightGrey",
    MAX_CHILDREN: 1,
    GUNS: [
        {
            POSITION: [4.5, 10, 1, 10.85, 0, 0, 0]
        },
        {
            POSITION: [1.3, 12.75, 1.025, 15.2, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.spawner, g.half_reload, g.half_reload, g.very_fast_launch, g.double_size, g.bigger, g.bigger]),
                TYPE: "ek1_minion",
                STAT_CALCULATOR: "drone",
                AUTOFIRE: true,
                SYNCS_SKILLS: true,
                COLOR_OVERRIDE: 34
            }
        },
        {
            POSITION: [6, 12, -1.3, 6, 0, 0, 0]
        }
    ]
}
Class.ultraCannonFactory = {
    LABEL: 'Factory',
    BODY: {
        FOV: 1.2
    },
    CONTROLLERS: ['canRepel', 'onlyAcceptInArc', 'mapAltToFire', 'nearestDifferentMaster'],
    COLOR: "veryLightGrey",
    MAX_CHILDREN: 1,
    GUNS: [
        {
            POSITION: [7, 10, 1, 10.85, 0, 0, 0]
        },
        {
            POSITION: [2, 12, 1, 13.95, 0, 0, 0]
        },
        {
            POSITION: [2.1, 13.5, 1, 18, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.spawner, g.half_reload, g.half_reload, g.less_reload, g.very_fast_launch, g.double_size]),
                TYPE: "ultraCannonMinion",
                STAT_CALCULATOR: "drone",
                AUTOFIRE: true,
                SYNCS_SKILLS: true
            }
        },
        {
            POSITION: [6, 12, -1.3, 6, 0, 0, 0]
        }
    ]
}
for (let i = 0; i < 6; i++) {
    Class.eggBossTier6.TURRETS.push(
        {
            POSITION: [1.325, 9.1, 1.75, 30 + i * 60, 145, 1],
            TYPE: "ek1_factory"
        },
        {
            POSITION: [1.325, 9.1, -1.75, 30 + i * 60, 145, 1],
            TYPE: "ek1_factory"
        },
        {
            POSITION: [1.775, 9.4, 0, 30 + i * 60, 145, 1],
            TYPE: "ultraCannonFactory"
        }
    );
}
Class.ungodlyDualAutoGun = {
    LABEL: 'Panultimate Dual',
    BODY: {
        FOV: 1.2
    },
    CONTROLLERS: ['nearestDifferentMaster'],
    COLOR: 16,
    HAS_NO_RECOIL: true,
    SYNC_TURRET_SKILLS: true,
    GUNS: [
        {
            POSITION: [14, 2, 1, 0, 7, 0, 2 / 3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.dual, g.dual2, g.half_reload, g.less_reload]),
                TYPE: "bulletLayer6"
            }
        },
        {
            POSITION: [13, 3, 1, 0, 7, 0, 9 / 12],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.dual, g.dual2, g.half_reload, g.less_reload]),
                TYPE: "bulletLayer6"
            }
        },
        {
            POSITION: [12, 4, 1, 0, 7, 0, 5 / 6],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.dual, g.dual2, g.half_reload, g.less_reload]),
                TYPE: "bulletLayer6"
            }
        },
        {
            POSITION: [11, 5, 1, 0, 7, 0, 11 / 12],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.dual, g.half_reload, g.less_reload]),
                TYPE: "bulletLayer6"
            }
        },
        {
            POSITION: [17, 2, 1, 0, 4.75, 0, 1 / 3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.dual, g.dual2, g.half_reload, g.less_reload]),
                TYPE: "bulletLayer6"
            }
        },
        {
            POSITION: [16, 3, 1, 0, 4.75, 0, 5 / 12],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.dual, g.dual2, g.half_reload, g.less_reload]),
                TYPE: "bulletLayer6"
            }
        },
        {
            POSITION: [15, 4, 1, 0, 4.75, 0, .5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.dual, g.dual2, g.half_reload, g.less_reload]),
                TYPE: "bulletLayer6"
            }
        },
        {
            POSITION: [14, 5, 1, 0, 4.75, 0, 7 / 12],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.dual, g.half_reload, g.less_reload]),
                TYPE: "bulletLayer6"
            }
        },
        {
            POSITION: [20, 2, 1, 0, 2.5, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.dual, g.dual2, g.half_reload, g.less_reload]),
                TYPE: "bulletLayer6"
            }
        },
        {
            POSITION: [19, 3, 1, 0, 2.5, 0, 1 / 12],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.dual, g.dual2, g.half_reload, g.less_reload]),
                TYPE: "bulletLayer6"
            }
        },
        {
            POSITION: [18, 4, 1, 0, 2.5, 0, 1 / 6],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.dual, g.dual2, g.half_reload, g.less_reload]),
                TYPE: "bulletLayer6"
            }
        },
        {
            POSITION: [17, 5, 1, 0, 2.5, 0, .25],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.dual, g.half_reload, g.less_reload]),
                TYPE: "bulletLayer6"
            }
        },
        {
            POSITION: [14, 2, 1, 0, -7, 0, 2 / 3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.dual, g.dual2, g.half_reload, g.less_reload]),
                TYPE: "bulletLayer6"
            }
        },
        {
            POSITION: [13, 3, 1, 0, -7, 0, 9 / 12],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.dual, g.dual2, g.half_reload, g.less_reload]),
                TYPE: "bulletLayer6"
            }
        },
        {
            POSITION: [12, 4, 1, 0, -7, 0, 5 / 6],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.dual, g.dual2, g.half_reload, g.less_reload]),
                TYPE: "bulletLayer6"
            }
        },
        {
            POSITION: [11, 5, 1, 0, -7, 0, 11 / 12],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.dual, g.half_reload, g.less_reload]),
                TYPE: "bulletLayer6"
            }
        },
        {
            POSITION: [17, 2, 1, 0, -4.75, 0, 1 / 3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.dual, g.dual2, g.half_reload, g.less_reload]),
                TYPE: "bulletLayer6"
            }
        },
        {
            POSITION: [16, 3, 1, 0, -4.75, 0, 5 / 12],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.dual, g.dual2, g.half_reload, g.less_reload]),
                TYPE: "bulletLayer6"
            }
        },
        {
            POSITION: [15, 4, 1, 0, -4.75, 0, .5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.dual, g.dual2, g.half_reload, g.less_reload]),
                TYPE: "bulletLayer6"
            }
        },
        {
            POSITION: [14, 5, 1, 0, -4.75, 0, 7 / 12],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.dual, g.half_reload, g.less_reload]),
                TYPE: "bulletLayer6"
            }
        },
        {
            POSITION: [20, 2, 1, 0, -2.5, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.dual, g.dual2, g.half_reload, g.less_reload]),
                TYPE: "bulletLayer6"
            }
        },
        {
            POSITION: [19, 3, 1, 0, -2.5, 0, 1 / 12],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.dual, g.dual2, g.half_reload, g.less_reload]),
                TYPE: "bulletLayer6"
            }
        },
        {
            POSITION: [18, 4, 1, 0, -2.5, 0, 1 / 6],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.dual, g.dual2, g.half_reload, g.less_reload]),
                TYPE: "bulletLayer6"
            }
        },
        {
            POSITION: [17, 5, 1, 0, -2.5, 0, .25],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.dual, g.half_reload, g.less_reload]),
                TYPE: "bulletLayer6"
            }
        },
        {
            POSITION: [14.75, 4.4, 1.5, 8, 0, 0, 1 / 3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.mach, g.half_reload, g.half_reload, g.less_reload]),
                TYPE: "bulletLayer6"
            }
        },
        {
            POSITION: [14.25, 5.2, 1.5, 8, 0, 0, 1 / 3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.mach, g.half_reload, g.half_reload, g.less_reload]),
                TYPE: "bulletLayer6"
            }
        },
        {
            POSITION: [13.75, 6, 1.5, 8, 0, 0, 2 / 3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.mach, g.half_reload, g.half_reload, g.less_reload]),
                TYPE: "bulletLayer6"
            }
        }
    ],
    TURRETS: [
        {
            POSITION: [14.25, 0, 0, 0, 360, 1],
            TYPE: "eggBossCircleProp"
        }
    ]
}
Class.eggBossTier6.TURRETS.push(
    {
        POSITION: [4.5, 0, 0, 30, 360, 1],
        TYPE: "ungodlyDualAutoGun"
    }
);

// AI
Class.eggBossTier1AI = {
    PARENT: ["eggBossTier1"],
    TYPE: 'miniboss',
    VARIES_IN_SIZE: true,
    LEVEL: 45,
    VALUE: 4e5,
    CONTROLLERS: ['nearestDifferentMaster', 'mapTargetToGoal', 'fleeAtLowHealth'],
    AI: {
        NO_LEAD: true
    },
    SKILL: [0, 5, 5, 6, 6, 6, 6, 1, 0, 0],
    BROADCAST_MESSAGE: 'An EK-1 has been defeated!',
    UPGRADES_TIER_0: []
}
Class.eggBossTier2AI = {
    PARENT: ["eggBossTier2"],
    TYPE: 'miniboss',
    VARIES_IN_SIZE: true,
    LEVEL: 45,
    VALUE: 6e5,
    CONTROLLERS: ['nearestDifferentMaster', 'mapTargetToGoal', 'fleeAtLowHealth'],
    AI: {
        NO_LEAD: true
    },
    SKILL: [0, 4, 6, 3, 4, 5, 3, 0, 0, 0],
    BROADCAST_MESSAGE: 'An EK-2 has been defeated!',
    UPGRADES_TIER_0: []
}
Class.eggBossTier3AI = {
    PARENT: ["eggBossTier3"],
    TYPE: 'miniboss',
    VARIES_IN_SIZE: true,
    LEVEL: 45,
    VALUE: 400000,
    CONTROLLERS: ['nearestDifferentMaster', 'mapTargetToGoal', 'fleeAtLowHealth'],
    AI: {
        NO_LEAD: true
    },
    SKILL: [5, 12, 4, 8, 8, 9, 9, 1, 2, 2],
    BROADCAST_MESSAGE: 'An EK-3 has been defeated!',
    UPGRADES_TIER_0: []
}
Class.eggBossTier4AI = {
    PARENT: ["eggBossTier4"],
    TYPE: 'miniboss',
    VARIES_IN_SIZE: true,
    LEVEL: 45,
    VALUE: 1e6,
    CONTROLLERS: ['nearestDifferentMaster', 'mapTargetToGoal', 'fleeAtLowHealth'],
    AI: {
        NO_LEAD: true
    },
    SKILL: [0, 5, 5, 6, 6, 6, 6, 1, 0, 0],
    BROADCAST_MESSAGE: 'An EK-4 has been defeated!',
    UPGRADES_TIER_0: []
}
Class.eggBossTier5AI = {
    PARENT: ["eggBossTier5"],
    TYPE: 'miniboss',
    VARIES_IN_SIZE: true,
    LEVEL: 60,
    VALUE: 5e6,
    CONTROLLERS: ['nearestDifferentMaster', 'mapTargetToGoal', 'fleeAtLowHealth'],
    AI: {
        NO_LEAD: true
    },
    SKILL: [0, 5, 5, 6, 6, 6, 6, 1, 0, 0],
    BROADCAST_MESSAGE: 'An EK-5 has been defeated!',
    UPGRADES_TIER_0: []
}
Class.eggBossTier6AI = {
    PARENT: ["eggBossTier6"],
    TYPE: 'miniboss',
    VARIES_IN_SIZE: true,
    LEVEL: 60,
    VALUE: 15e6,
    CONTROLLERS: ['nearestDifferentMaster', 'mapTargetToGoal', 'fleeAtLowHealth'],
    AI: {
        NO_LEAD: true
    },
    SKILL: [0, 5, 5, 7, 7, 6, 0, 1, 0, 0],
    BROADCAST_MESSAGE: 'An EK-6 has been defeated!',
    UPGRADES_TIER_0: []
}

// makeMenus
Class.SpawnedEKMenu = makeMenu("Spawned EK Menu", "veryLightGrey", 0)
Class.MenuEKMenu = makeMenu("Dev Menu EK Menu", "veryLightGrey", 0)

Class.EKMenu.UPGRADES_TIER_0 = ["eggBossTank", "MenuEKMenu", "SpawnedEKMenu"]

Class.MenuEKMenu.UPGRADES_TIER_0 = ["EK Menu", "eggBossTier1", "eggBossTier2", "eggBossTier3", "eggBossTier4", "eggBossTier5", "eggBossTier6"]
Class.SpawnedEKMenu.UPGRADES_TIER_0 = ["EK Menu", "eggBossTier1AI", "eggBossTier2AI", "eggBossTier3AI", "eggBossTier4AI", "eggBossTier5AI", "eggBossTier6AI"]

Class.eggBossTier1.UPGRADES_TIER_0 = ["eggBossTier2"]
Class.menu_addons.UPGRADES_TIER_0.push("EKMenu");