const {combineStats, skillSet, makeFlank, weaponStack, makeGuard, makeAutoArray, makeWhirlwind, makeAuto, weaponArray, makeMenu, weaponMirror} = require('../../facilitators.js')
const {base, statnames, dfltskl, smshskl} = require('../../constants.js')
const g = require('../../gunvals.js')

// Dev Menus
Class.menu_sentries = makeMenu("Sentries", {upgrades: [
	"sentrySwarm",
	"sentryGun",
	"sentryTrap",
	"sentinelSwarm",
	"sentinelGun",
	"sentinelTrap",
	"shinySentrySwarm",
	"shinySentryGun",
	"shinySentryTrap",
	"sentinelMinigun",
	"sentinelLauncher",
	"sentinelCrossbow",
], color: "pink", boxColor: "pink", shape: 3.5, props: [{POSITION: [12, 0, 0, 0, 360, 1], TYPE: ["circleHat", {COLOR: "grey"}]}]})

// Sentries
Class.sentry = {
    PARENT: "genericTank",
    TYPE: "crasher",
    LABEL: "Sentry",
    DANGER: 3,
    COLOR: "pink",
    UPGRADE_COLOR: "pink",
    SHAPE: 3,
    SIZE: 10,
    SKILL: skillSet({
        rld: 0.5,
        dam: 0.8,
        pen: 0.8,
        str: 0.1,
        spd: 1,
        atk: 0.5,
        hlt: 0,
        shi: 0,
        rgn: 0.7,
        mob: 0,
    }),
    VALUE: 1500,
    VARIES_IN_SIZE: true,
    CONTROLLERS: ["nearestDifferentMaster", "mapTargetToGoal"],
    AI: {
        NO_LEAD: true,
    },
    BODY: {
        FOV: 0.5,
        ACCELERATION: 0.75,
        DAMAGE: base.DAMAGE,
        SPEED: 0.5 * base.SPEED,
        HEALTH: 0.3 * base.HEALTH,
    },
    MOTION_TYPE: "motor",
    FACING_TYPE: "smoothToTarget",
    HITS_OWN_TYPE: "hard",
    HAS_NO_MASTER: true,
    DRAW_HEALTH: true,
    GIVE_KILL_MESSAGE: true,
}
Class.sentrySwarm = {
    PARENT: "sentry",
    UPGRADE_LABEL: "Swarm Sentry",
    UPGRADE_COLOR: "pink",
    GUNS: [
        {
            POSITION: [7, 14, 0.6, 7, 0, 180, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.swarm, { recoil: 1.15, range: 0.9 }]),
                TYPE: "swarm",
                STAT_CALCULATOR: "swarm",
            },
        },
    ],
}
Class.sentryGun = makeAuto("sentry", "Sentry", {
    type: "megaAutoTankGun",
    size: 12,
})
Class.sentryGun.UPGRADE_LABEL = "Gun Sentry"
Class.sentryTrap = makeAuto("sentry", "Sentry", {
    type: "trapTurret",
    size: 12,
})
Class.sentryTrap.UPGRADE_LABEL = "Trap Sentry"

// Shiny Sentries
Class.shinySentry = {
    PARENT: "sentry",
    COLOR: "lime",
    UPGRADE_COLOR: "lime",
    DANGER: 4,
    SIZE: 12,
    VALUE: 50000,
    SHAPE: 3,
    BODY: {
        HEALTH: 0.6 * base.HEALTH
    },
}
Class.shinySentrySwarm = {
    PARENT: "shinySentry",
    UPGRADE_LABEL: "Shiny Swarm Sentry",
    UPGRADE_COLOR: "lime",
    GUNS: [
        {
            POSITION: [6, 11, 1.3, 7, 0, 180, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.swarm, { recoil: 1.15 }, g.machineGun, { reload: 0.25 }]),
                TYPE: "swarm",
                STAT_CALCULATOR: "swarm",
            },
        },
    ],
}
Class.shinySentryGun = makeAuto("shinySentry", "Sentry", {
    type: "artilleryTurret",
    size: 12,
})
Class.shinySentryGun.UPGRADE_LABEL = "Shiny Gun Sentry"
Class.shinySentryTrap = makeAuto("shinySentry", "Sentry", {
    type: "barricadeTurret",
    size: 12,
})
Class.shinySentryTrap.UPGRADE_LABEL = "Shiny Trap Sentry"

// Sentinels
Class.sentinel = {
    PARENT: "genericTank",
    TYPE: "crasher",
    LABEL: "Sentinel",
    DANGER: 7,
    COLOR: "purple",
    SHAPE: 5,
    SIZE: 16,
    SKILL: skillSet({
        rld: 0.7, //reload
        dam: 0.45, //bullet damage
        pen: 0.6, //bullet penetration
        str: 0.6, //bullet health
        atk: 0.5, //bullet speed
        spd: 0.6, //body damage
        hlt: 0.85, //max health
        shi: 0.45, //shield capacity
        rgn: 0.35, //shield regeneration
        mob: 0, //movement speed
    }),
    VALUE: 26668,
    VARIES_IN_SIZE: false,
    CONTROLLERS: ["nearestDifferentMaster", "mapTargetToGoal", "minion"],
    AI: { NO_LEAD: true },
    BODY: {
        FOV: 0.8,
        ACCEL: 0.003,
        DAMAGE: base.DAMAGE * 2.1,
        SPEED: base.SPEED * 0.4,
        HEALTH: base.HEALTH * 2.1,
        SHIELD: base.SHIELD * 2.1,
        REGEN: base.REGEN * 0.15,
    },
    MOTION_TYPE: "motor",
    FACING_TYPE: "smoothToTarget",
    HITS_OWN_TYPE: "hard",
}
Class.sentinelLauncher = {
    PARENT: "sentinel",
    UPGRADE_LABEL: "Missile Sentinel",
    UPGRADE_COLOR: "purple",
    GUNS: [
        {
            POSITION: [3, 12.45, -1.35, 17.2, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.launcher]),
                TYPE: "sentinelMissile",
                NO_LIMITATIONS: true,
            },
        }, {
            POSITION: [17.5, 13, 1.25, 0, 0, 0, 0],
        }, {
            POSITION: [18.55, 20.25, 0.25, 1, 0, 0, 0],
        },
    ],
}
Class.fallenBasic = {
    PARENT: 'genericTank',
    CONTROLLERS: ["nearestDifferentMaster", "mapTargetToGoal", "minion"],
    LABEL: "Fallen Basic", // Tank Label
    DANGER: 9, // AI priority target level
    SIZE: 32,
    SKILL: [6, 9, 9, 9, 4, 9, 9, 9, 5, 8],
    VALUE: 3e4,
    COLOR: "dgrey",
    BODY: {
        ACCELERATION: base.ACCEL * 1.3,
        SPEED: base.SPEED * 1.7,
        HEALTH: base.HEALTH * 3,
        DAMAGE: base.DAMAGE * 3,
        PENETRATION: base.PENETRATION * 1.1,
        SHIELD: base.SHIELD * 3,
        REGEN: base.REGEN * 2.3,
        FOV: base.FOV * 1.3,
        DENSITY: base.DENSITY * 10,
        PUSHABILITY: 0,
        HETERO: 3
    },
    GUNS: [
        {
            POSITION: {
                LENGTH: 18,
                WIDTH: 8,
                ASPECT: 1,
                X: 0,
                Y: 0,
                ANGLE: 0,
                DELAY: 0
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic]), // Gun/projectile stats
                TYPE: 'bullet', // What the gun shoots
                COLOR: 'grey', // Gun colour
                LABEL: "", // Gun label (shows up in death messages)
                STAT_CALCULATOR: 0,
                WAIT_TO_CYCLE: false, // Whether the gun waits a full reload cycle before firing
                AUTOFIRE: false, // Whether the gun fires on its own
                SYNCS_SKILLS: false,
                DAMAGE: 1.2,
                MAX_CHILDREN: 0, // Number of projectiles from this gun that can be alive at once
                ALT_FIRE: false, // Whether the gun requires RMB/Shift to fire instead of LMB/Space
                NEGATIVE_RECOIL: false // Whether the gun pulls instead of pushes when firing
            }
        }
    ]
}
Class.fallenDesmos = {
    PARENT: 'genericTank',
    LABEL: " Fallen Desmos",
    DANGER: 9,
    SIZE: 32,
    SKILL: [6, 9, 9, 9, 4, 9, 9, 9, 5, 8],
    CONTROLLERS: ["nearestDifferentMaster", "mapTargetToGoal", "minion"],
    VALUE: 3e4,
    COLOR: "dgrey",
    BODY: {
        ACCELERATION: base.ACCEL * 1.3,
        SPEED: base.SPEED * 1.7,
        HEALTH: base.HEALTH * 3,
        DAMAGE: base.DAMAGE * 3,
        PENETRATION: base.PENETRATION * 1.1,
        SHIELD: base.SHIELD * 3,
        REGEN: base.REGEN * 2.3,
        FOV: base.FOV * 1.3,
        DENSITY: base.DENSITY * 10,
        PUSHABILITY: 0,
        HETERO: 3
    },
    GUNS: [
        {
            POSITION: {
                LENGTH: 20,
                WIDTH: 8,
                ASPECT: -1.5
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.desmos, {damage: 1.2}]),
                TYPE: ['bullet', {CONTROLLERS: ['snake']}]
            }
        },
        ...weaponMirror({
            POSITION: {
                LENGTH: 5,
                WIDTH: 5,
                ASPECT: -4,
                X: -5.25,
                Y: -7,
                ANGLE: 90
            }
        })
    ]
}
Class.fallenDirector = {
    PARENT: 'genericTank',
    LABEL: "Fallen Director",
    DANGER: 9, // AI priority target level
    SIZE: 32,
    SKILL: [6, 9, 9, 9, 4, 9, 9, 9, 5, 8],
    CONTROLLERS: ["nearestDifferentMaster", "mapTargetToGoal", "minion"],
    VALUE: 3e4,
    COLOR: "dgrey",
    BODY: {
        ACCELERATION: base.ACCEL * 1.3,
        SPEED: base.SPEED * 1.7,
        HEALTH: base.HEALTH * 3,
        DAMAGE: base.DAMAGE * 3,
        PENETRATION: base.PENETRATION * 1.1,
        SHIELD: base.SHIELD * 3,
        REGEN: base.REGEN * 2.3,
        FOV: base.FOV * 1.3,
        DENSITY: base.DENSITY * 10,
        PUSHABILITY: 0,
        HETERO: 3
    },
    BODY: {
        FOV: base.FOV * 1.1
    },
    GUNS: [
        {
            POSITION: {
                LENGTH: 5,
                WIDTH: 11,
                ASPECT: 1.3,
                X: 8
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.drone, {damage: 1.2}]),
                TYPE: 'drone',
                AUTOFIRE: true,
                SYNCS_SKILLS: true,
                STAT_CALCULATOR: 'drone',
                MAX_CHILDREN: 6,
                WAIT_TO_CYCLE: true
            }
        }
    ]
}
Class.fallenFlail = {
    PARENT: 'genericFlail',
    LABEL: "Fallen Flail",
    DANGER: 9, // AI priority target level
    SIZE: 32,
    SKILL: [6, 9, 9, 9, 4, 9, 9, 9, 5, 8],
    CONTROLLERS: ["nearestDifferentMaster", "mapTargetToGoal", "minion"],
    VALUE: 3e4,
    COLOR: "dgrey",
    BODY: {
        ACCELERATION: base.ACCEL * 1.3,
        SPEED: base.SPEED * 1.7,
        HEALTH: base.HEALTH * 3,
        DAMAGE: base.DAMAGE * 3,
        PENETRATION: base.PENETRATION * 1.1,
        SHIELD: base.SHIELD * 3,
        REGEN: base.REGEN * 2.3,
        FOV: base.FOV * 1.3,
        DENSITY: base.DENSITY * 10,
        PUSHABILITY: 0,
        HETERO: 3
    },
    TURRETS: [{
        TYPE: ['flailBolt3', {
            INDEPENDENT: true
        }],
        POSITION: {
            SIZE: 6,
            X: 10,
            ARC: 190
        }
    }]
}
Class.flankGuard = makeFlank('basic', 3, "Flank Guard", {extraStats: [g.flankGuard]})
Class.flankGuard.BODY = {SPEED: 1.1 * base.SPEED}
Class.fallenMachineGun = {
    PARENT: 'genericTank',
    LABEL: "Fallen Machine Gun",
    DANGER: 9, // AI priority target level
    SIZE: 32,
    SKILL: [6, 9, 9, 9, 4, 9, 9, 9, 5, 8],
    CONTROLLERS: ["nearestDifferentMaster", "mapTargetToGoal", "minion"],
    VALUE: 3e4,
    COLOR: "dgrey",
    BODY: {
        ACCELERATION: base.ACCEL * 1.3,
        SPEED: base.SPEED * 1.7,
        HEALTH: base.HEALTH * 3,
        DAMAGE: base.DAMAGE * 3,
        PENETRATION: base.PENETRATION * 1.1,
        SHIELD: base.SHIELD * 3,
        REGEN: base.REGEN * 2.3,
        FOV: base.FOV * 1.3,
        DENSITY: base.DENSITY * 10,
        PUSHABILITY: 0,
        HETERO: 3
    },
    GUNS: [
        {
            POSITION: {
                LENGTH: 12,
                WIDTH: 10,
                ASPECT: 1.4,
                X: 8
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, {size: 0.92, damage: 1.2}]),
                TYPE: 'bullet'
            }
        }
    ]
}
Class.fallenPounder = {
    PARENT: 'genericTank',
    LABEL: "Fallen Pounder",
    DANGER: 9, // AI priority target level
    SIZE: 32,
    SKILL: [6, 9, 9, 9, 4, 9, 9, 9, 5, 8],
    CONTROLLERS: ["nearestDifferentMaster", "mapTargetToGoal", "minion"],
    VALUE: 3e4,
    COLOR: "dgrey",
    BODY: {
        ACCELERATION: base.ACCEL * 1.3,
        SPEED: base.SPEED * 1.7,
        HEALTH: base.HEALTH * 3,
        DAMAGE: base.DAMAGE * 3,
        PENETRATION: base.PENETRATION * 1.1,
        SHIELD: base.SHIELD * 3,
        REGEN: base.REGEN * 2.3,
        FOV: base.FOV * 1.3,
        DENSITY: base.DENSITY * 10,
        PUSHABILITY: 0,
        HETERO: 3
    },
    GUNS: [
        {
            POSITION: {
                LENGTH: 20.5,
                WIDTH: 12
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pounder, {damage: 1.2}]),
                TYPE: 'bullet'
            }
        }
    ]
}
Class.fallenSniper = {
    PARENT: 'genericTank',
    LABEL: "Fallen Sniper",
    DANGER: 9, // AI priority target level
    SIZE: 32,
    SKILL: [6, 9, 9, 9, 4, 9, 9, 9, 5, 8],
    CONTROLLERS: ["nearestDifferentMaster", "mapTargetToGoal", "minion"],
    VALUE: 3e4,
    COLOR: "dgrey",
    BODY: {
        ACCELERATION: base.ACCEL * 1.3,
        SPEED: base.SPEED * 1.7,
        HEALTH: base.HEALTH * 3,
        DAMAGE: base.DAMAGE * 3,
        PENETRATION: base.PENETRATION * 1.1,
        SHIELD: base.SHIELD * 3,
        REGEN: base.REGEN * 2.3,
        FOV: base.FOV * 1.3,
        DENSITY: base.DENSITY * 10,
        PUSHABILITY: 0,
        HETERO: 3
    },
    BODY: {
        FOV: 1.2 * base.FOV
    },
    GUNS: [
        {
            POSITION: {
                LENGTH: 24,
                WIDTH: 8
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.sniper, {damage: 1.2}]),
                TYPE: 'bullet'
            }
        }
    ]
}
Class.fallenTrapper = {
    PARENT: 'genericTank',
    LABEL: "Fallen Trapper",
    DANGER: 9, // AI priority target level
    SIZE: 32,
    SKILL: [6, 9, 9, 9, 4, 9, 9, 9, 5, 8],
    CONTROLLERS: ["nearestDifferentMaster", "mapTargetToGoal", "minion"],
    VALUE: 3e4,
    COLOR: "dgrey",
    BODY: {
        ACCELERATION: base.ACCEL * 1.3,
        SPEED: base.SPEED * 1.7,
        HEALTH: base.HEALTH * 3,
        DAMAGE: base.DAMAGE * 3,
        PENETRATION: base.PENETRATION * 1.1,
        SHIELD: base.SHIELD * 3,
        REGEN: base.REGEN * 2.3,
        FOV: base.FOV * 1.3,
        DENSITY: base.DENSITY * 10,
        PUSHABILITY: 0,
        HETERO: 3
    },
    GUNS: [
        {
            POSITION: {
                LENGTH: 15,
                WIDTH: 7
            }
        },
        {
            POSITION: {
                LENGTH: 3,
                WIDTH: 7,
                ASPECT: 1.7,
                X: 15
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, {damage: 1.2}]),
                TYPE: 'trap',
                STAT_CALCULATOR: 'trap'
            }
        }
    ]
}
Class.fallenTwin = {
    PARENT: 'genericTank',
    LABEL: "Fallen Twin",
    DANGER: 9, // AI priority target level
    SIZE: 32,
    SKILL: [6, 9, 9, 9, 4, 9, 9, 9, 5, 8],
    CONTROLLERS: ["nearestDifferentMaster", "mapTargetToGoal", "minion"],
    VALUE: 3e4,
    COLOR: "dgrey",
    BODY: {
        ACCELERATION: base.ACCEL * 1.3,
        SPEED: base.SPEED * 1.7,
        HEALTH: base.HEALTH * 3,
        DAMAGE: base.DAMAGE * 3,
        PENETRATION: base.PENETRATION * 1.1,
        SHIELD: base.SHIELD * 3,
        REGEN: base.REGEN * 2.3,
        FOV: base.FOV * 1.3,
        DENSITY: base.DENSITY * 10,
        PUSHABILITY: 0,
        HETERO: 3
    },
    GUNS: weaponMirror({
        POSITION: {
            LENGTH: 20,
            WIDTH: 8,
            Y: 5.5
        },
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.basic, g.twin, {damage: 1.2}]),
            TYPE: 'bullet'
        }
    }, {delayIncrement: 0.5})
}
Class.fallenWhirlwind = makeWhirlwind('genericTank', {label: "Whirlwind", satellites: 6, hat: 'hexagonHat_spin', danger: 5})
Class.fallenWhirlwind_bent = {
    PARENT: 'genericTank',
    LABEL: "Fallen Whirlwind",
    UPGRADE_LABEL: "Fallen Bent Whirlwind",
    DANGER: 9, // AI priority target level
    SIZE: 32,
    SKILL: [6, 9, 9, 9, 4, 9, 9, 9, 5, 8],
    CONTROLLERS: ["nearestDifferentMaster", "mapTargetToGoal", "minion"],
    VALUE: 3e4,
    COLOR: "dgrey",
    BODY: {
        ACCELERATION: base.ACCEL * 1.3,
        SPEED: base.SPEED * 1.7,
        HEALTH: base.HEALTH * 3,
        DAMAGE: base.DAMAGE * 3,
        PENETRATION: base.PENETRATION * 1.1,
        SHIELD: base.SHIELD * 3,
        REGEN: base.REGEN * 2.3,
        FOV: base.FOV * 1.3,
        DENSITY: base.DENSITY * 10,
        PUSHABILITY: 0,
        HETERO: 3
    },
    GUNS: weaponMirror([
        {
            POSITION: {
                LENGTH: 15,
                WIDTH: 8,
                Y: 4.5,
                ANGLE: 15
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, {damage: 0.4}]),
                TYPE: 'satelliteBullet',
                INDEPENDENT_MASTER: true,
            }
        },
        {
            POSITION: {
                LENGTH: 16,
                WIDTH: 4,
                ASPECT: -1.5,
                Y: 4.5,
                ANGLE: 15
            }
        }
    ], {delayIncrement: 0.5}),
    UPGRADES_TIER_2: [
        'maelstrom',
        'hurricane',
        'monsoon',
        'typhoon',
        'tempest',
    ].map(x => x + '_bent')
}
// Tier 2
Class.fallenArtillery = {
    PARENT: 'genericTank',
    LABEL: "Fallen Artillery",
    DANGER: 10, // AI priority target level
    SIZE: 36,
    SKILL: [6, 9, 9, 9, 6, 9, 9, 9, 6, 8],
    CONTROLLERS: ["nearestDifferentMaster", "mapTargetToGoal", "minion"],
    VALUE: 4e5,
    COLOR: "dgrey",
    BODY: {
        ACCELERATION: base.ACCEL * 1.2,
        SPEED: base.SPEED * 1.4,
        HEALTH: base.HEALTH * 4,
        DAMAGE: base.DAMAGE * 3.4,
        PENETRATION: base.PENETRATION * 1.2,
        SHIELD: base.SHIELD * 3.3,
        REGEN: base.REGEN * 2.5,
        FOV: base.FOV * 1.4,
        DENSITY: base.DENSITY * 20,
        PUSHABILITY: 0,
        HETERO: 3
    },
    GUNS: [
        ...weaponMirror({
            POSITION: {
                LENGTH: 17,
                WIDTH: 5,
                Y: -5,
                ANGLE: -7,
                DELAY: 0.25
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.artillery]),
                TYPE: 'bullet',
                LABEL: "Secondary"
            }
        }, {delayIncrement: 0.5}),
        {
            POSITION: {
                LENGTH: 19,
                WIDTH: 12
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.artillery]),
                TYPE: 'bullet',
                LABEL: "Heavy"
            }
        }
    ]
}
Class.fallenAssassin = {
    PARENT: 'genericTank',
    LABEL: "Fallen Assassin",
    DANGER: 10, // AI priority target level
    SIZE: 36,
    SKILL: [6, 9, 9, 9, 6, 9, 9, 9, 6, 8],
    CONTROLLERS: ["nearestDifferentMaster", "mapTargetToGoal", "minion"],
    VALUE: 4e5,
    COLOR: "dgrey",
    BODY: {
        ACCELERATION: base.ACCEL * 1.2,
        SPEED: base.SPEED * 1.4,
        HEALTH: base.HEALTH * 4,
        DAMAGE: base.DAMAGE * 3.4,
        PENETRATION: base.PENETRATION * 1.2,
        SHIELD: base.SHIELD * 3.3,
        REGEN: base.REGEN * 2.5,
        FOV: base.FOV * 1.4,
        DENSITY: base.DENSITY * 20,
        PUSHABILITY: 0,
        HETERO: 3
    },
    GUNS: [
        {
            POSITION: {
                LENGTH: 27,
                WIDTH: 8
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.assassin]),
                TYPE: 'bullet'
            }
        },
        {
            POSITION: {
                LENGTH: 13,
                WIDTH: 8,
                ASPECT: -2.2
            }
        }
    ]
}
Class.fallenBlaster = {
    PARENT: 'genericTank',
    LABEL: "Fallen Blaster",
    DANGER: 10, // AI priority target level
    SIZE: 36,
    SKILL: [6, 9, 9, 9, 6, 9, 9, 9, 6, 8],
    CONTROLLERS: ["nearestDifferentMaster", "mapTargetToGoal", "minion"],
    VALUE: 4e5,
    COLOR: "dgrey",
    BODY: {
        ACCELERATION: base.ACCEL * 1.2,
        SPEED: base.SPEED * 1.4,
        HEALTH: base.HEALTH * 4,
        DAMAGE: base.DAMAGE * 3.4,
        PENETRATION: base.PENETRATION * 1.2,
        SHIELD: base.SHIELD * 3.3,
        REGEN: base.REGEN * 2.5,
        FOV: base.FOV * 1.4,
        DENSITY: base.DENSITY * 20,
        PUSHABILITY: 0,
        HETERO: 3
    },
    GUNS: [
        {
            POSITION: {
                LENGTH: 13,
                WIDTH: 8,
                ASPECT: 1.9,
                X: 4
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.blaster]),
                TYPE: 'bullet'
            }
        }
    ]
}
Class.fallenBuilder = {
    PARENT: 'genericTank',
    LABEL: "Fallen Builder",
    DANGER: 10, // AI priority target level
    SIZE: 36,
    SKILL: [6, 9, 9, 9, 6, 9, 9, 9, 6, 8],
    CONTROLLERS: ["nearestDifferentMaster", "mapTargetToGoal", "minion"],
    VALUE: 4e5,
    COLOR: "dgrey",
    BODY: {
        ACCELERATION: base.ACCEL * 1.2,
        SPEED: base.SPEED * 1.4,
        HEALTH: base.HEALTH * 4,
        DAMAGE: base.DAMAGE * 3.4,
        PENETRATION: base.PENETRATION * 1.2,
        SHIELD: base.SHIELD * 3.3,
        REGEN: base.REGEN * 2.5,
        FOV: base.FOV * 1.4,
        DENSITY: base.DENSITY * 20,
        PUSHABILITY: 0,
        HETERO: 3
    },
    GUNS: [
        {
            POSITION: {
                LENGTH: 18,
                WIDTH: 12
            },
        },
        {
            POSITION: {
                LENGTH: 2,
                WIDTH: 12,
                ASPECT: 1.1,
                X: 18
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, g.setTrap]),
                TYPE: 'setTrap',
                STAT_CALCULATOR: 'block'
            }
        }
    ]
}
Class.fallenCruiser = {
    PARENT: 'genericTank',
    LABEL: "Fallen Cruiser",
    DANGER: 10, // AI priority target level
    SIZE: 36,
    SKILL: [6, 9, 9, 9, 6, 9, 9, 9, 6, 8],
    CONTROLLERS: ["nearestDifferentMaster", "mapTargetToGoal", "minion"],
    VALUE: 4e5,
    COLOR: "dgrey",
    BODY: {
        ACCELERATION: base.ACCEL * 1.2,
        SPEED: base.SPEED * 1.4,
        HEALTH: base.HEALTH * 4,
        DAMAGE: base.DAMAGE * 3.4,
        PENETRATION: base.PENETRATION * 1.2,
        SHIELD: base.SHIELD * 3.3,
        REGEN: base.REGEN * 2.5,
        FOV: base.FOV * 1.4,
        DENSITY: base.DENSITY * 20,
        PUSHABILITY: 0,
        HETERO: 3
    },
    FACING_TYPE: 'locksFacing',
    GUNS: weaponMirror({
        POSITION: {
            LENGTH: 9,
            WIDTH: 8.2,
            ASPECT: 0.6,
            X: 5,
            Y: 4
        },
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.swarm]),
            TYPE: 'swarm',
            STAT_CALCULATOR: 'swarm'
        }
    }, {delayIncrement: 0.5})
}
Class.fallenDestroyer = {
    PARENT: 'genericTank',
    LABEL: "Fallen Destroyer",
    DANGER: 10, // AI priority target level
    SIZE: 36,
    SKILL: [6, 9, 9, 9, 6, 9, 9, 9, 6, 8],
    CONTROLLERS: ["nearestDifferentMaster", "mapTargetToGoal", "minion"],
    VALUE: 4e5,
    COLOR: "dgrey",
    BODY: {
        ACCELERATION: base.ACCEL * 1.2,
        SPEED: base.SPEED * 1.4,
        HEALTH: base.HEALTH * 4,
        DAMAGE: base.DAMAGE * 3.4,
        PENETRATION: base.PENETRATION * 1.2,
        SHIELD: base.SHIELD * 3.3,
        REGEN: base.REGEN * 2.5,
        FOV: base.FOV * 1.4,
        DENSITY: base.DENSITY * 20,
        PUSHABILITY: 0,
        HETERO: 3
    },
    GUNS: [
        {
            POSITION: {
                LENGTH: 20.5,
                WIDTH: 14
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.destroyer]),
                TYPE: 'bullet'
            }
        }
    ]
}
Class.fallenDoubleFlail = {
    PARENT: 'genericFlail',
    LABEL: "Fallen Double Flail",
    DANGER: 10, // AI priority target level
    SIZE: 36,
    SKILL: [6, 9, 9, 9, 6, 9, 9, 9, 6, 8],
    CONTROLLERS: ["nearestDifferentMaster", "mapTargetToGoal", "minion"],
    VALUE: 4e5,
    COLOR: "dgrey",
    BODY: {
        ACCELERATION: base.ACCEL * 1.2,
        SPEED: base.SPEED * 1.4,
        HEALTH: base.HEALTH * 4,
        DAMAGE: base.DAMAGE * 3.4,
        PENETRATION: base.PENETRATION * 1.2,
        SHIELD: base.SHIELD * 3.3,
        REGEN: base.REGEN * 2.5,
        FOV: base.FOV * 1.4,
        DENSITY: base.DENSITY * 20,
        PUSHABILITY: 0,
        HETERO: 3
    },
    TURRETS: weaponArray(Class.flail.TURRETS, 2)
}
Class.fallenFlangle = {
    PARENT: 'genericFlail',
    LABEL: "Fallen Flangle",
    DANGER: 10, // AI priority target level
    SIZE: 36,
    SKILL: [6, 9, 9, 9, 6, 9, 9, 9, 6, 8],
    CONTROLLERS: ["nearestDifferentMaster", "mapTargetToGoal", "minion"],
    VALUE: 4e5,
    COLOR: "dgrey",
    BODY: {
        ACCELERATION: base.ACCEL * 1.2,
        SPEED: base.SPEED * 1.4,
        HEALTH: base.HEALTH * 4,
        DAMAGE: base.DAMAGE * 3.4,
        PENETRATION: base.PENETRATION * 1.2,
        SHIELD: base.SHIELD * 3.3,
        REGEN: base.REGEN * 2.5,
        FOV: base.FOV * 1.4,
        DENSITY: base.DENSITY * 20,
        PUSHABILITY: 0,
        HETERO: 3
    },
    GUNS: weaponMirror({
        POSITION: {
            LENGTH: 16,
            WIDTH: 8,
            ANGLE: 150,
            DELAY: 0.1
        },
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.basic, g.flankGuard, g.triAngle, g.thruster]),
            TYPE: 'bullet',
            LABEL: "Thruster"
        }
    }),
    TURRETS: Class.flail.TURRETS,
    SKILL_CAP: [dfltskl, dfltskl, dfltskl, dfltskl, dfltskl, dfltskl, dfltskl, dfltskl, dfltskl, dfltskl]
}
Class.fallenGatlingGun = {
    PARENT: 'genericTank',
    LABEL: "Fallen Gatling Gun",
    DANGER: 10, // AI priority target level
    SIZE: 36,
    SKILL: [6, 9, 9, 9, 6, 9, 9, 9, 6, 8],
    CONTROLLERS: ["nearestDifferentMaster", "mapTargetToGoal", "minion"],
    VALUE: 4e5,
    COLOR: "dgrey",
    BODY: {
        ACCELERATION: base.ACCEL * 1.2,
        SPEED: base.SPEED * 1.4,
        HEALTH: base.HEALTH * 4,
        DAMAGE: base.DAMAGE * 3.4,
        PENETRATION: base.PENETRATION * 1.2,
        SHIELD: base.SHIELD * 3.3,
        REGEN: base.REGEN * 2.5,
        FOV: base.FOV * 1.4,
        DENSITY: base.DENSITY * 20,
        PUSHABILITY: 0,
        HETERO: 3
    },
    GUNS: [
        {
            POSITION: {
                LENGTH: 14,
                WIDTH: 9.5,
                ASPECT: 1.25,
                X: 8
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.gatlingGun]),
                TYPE: 'bullet'
            }
        }
    ]
}
Class.fallenGunner = {
    PARENT: 'genericTank',
    LABEL: "Fallen Gunner",
    DANGER: 10, // AI priority target level
    SIZE: 36,
    SKILL: [6, 9, 9, 9, 6, 9, 9, 9, 6, 8],
    CONTROLLERS: ["nearestDifferentMaster", "mapTargetToGoal", "minion"],
    VALUE: 4e5,
    COLOR: "dgrey",
    BODY: {
        ACCELERATION: base.ACCEL * 1.2,
        SPEED: base.SPEED * 1.4,
        HEALTH: base.HEALTH * 4,
        DAMAGE: base.DAMAGE * 3.4,
        PENETRATION: base.PENETRATION * 1.2,
        SHIELD: base.SHIELD * 3.3,
        REGEN: base.REGEN * 2.5,
        FOV: base.FOV * 1.4,
        DENSITY: base.DENSITY * 20,
        PUSHABILITY: 0,
        HETERO: 3
    },
    GUNS: weaponMirror([
        {
            POSITION: {
                LENGTH: 12,
                WIDTH: 3.5,
                Y: 7.25,
                DELAY: 0.5
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.gunner, {speed: 1.2}]),
                TYPE: 'bullet'
            }
        },
        {
            POSITION: {
                LENGTH: 16,
                WIDTH: 3.5,
                Y: 3.75
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.gunner, {speed: 1.2}]),
                TYPE: 'bullet'
            }
        }
    ], {delayIncrement: 0.25})
}
Class.fallenHealer = {
    PARENT: 'genericHealer',
    LABEL: "Fallen Healer",
    DANGER: 10, // AI priority target level
    SIZE: 36,
    SKILL: [6, 9, 9, 9, 6, 9, 9, 9, 6, 8],
    CONTROLLERS: ["nearestDifferentMaster", "mapTargetToGoal", "minion"],
    VALUE: 4e5,
    COLOR: "dgrey",
    BODY: {
        ACCELERATION: base.ACCEL * 1.2,
        SPEED: base.SPEED * 1.4,
        HEALTH: base.HEALTH * 4,
        DAMAGE: base.DAMAGE * 3.4,
        PENETRATION: base.PENETRATION * 1.2,
        SHIELD: base.SHIELD * 3.3,
        REGEN: base.REGEN * 2.5,
        FOV: base.FOV * 1.4,
        DENSITY: base.DENSITY * 20,
        PUSHABILITY: 0,
        HETERO: 3
    },
    GUNS: [
        {
            POSITION: {
                LENGTH: 11,
                WIDTH: 9,
                ASPECT: -0.4,
                X: 9.5
            }
        },
        {
            POSITION: {
                LENGTH: 18,
                WIDTH: 10
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.healer]),
                TYPE: 'healerBullet'
            }
        }
    ]
}
Class.fallenHelix = {
    PARENT: 'genericTank',
    LABEL: "Fallen Helix",
    DANGER: 10, // AI priority target level
    SIZE: 36,
    SKILL: [6, 9, 9, 9, 6, 9, 9, 9, 6, 8],
    CONTROLLERS: ["nearestDifferentMaster", "mapTargetToGoal", "minion"],
    VALUE: 4e5,
    COLOR: "dgrey",
    BODY: {
        ACCELERATION: base.ACCEL * 1.2,
        SPEED: base.SPEED * 1.4,
        HEALTH: base.HEALTH * 4,
        DAMAGE: base.DAMAGE * 3.4,
        PENETRATION: base.PENETRATION * 1.2,
        SHIELD: base.SHIELD * 3.3,
        REGEN: base.REGEN * 2.5,
        FOV: base.FOV * 1.4,
        DENSITY: base.DENSITY * 20,
        PUSHABILITY: 0,
        HETERO: 3
    },
    GUNS: [
        {
            POSITION: {
                LENGTH: 20,
                WIDTH: 6,
                ASPECT: -1.5,
                Y: -5
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.desmos]),
                TYPE: ['bullet', {CONTROLLERS: ['snake']}]
            },
        },
        {
            POSITION: {
                LENGTH: 20,
                WIDTH: 6,
                ASPECT: -1.5,
                Y: 5
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.desmos]),
                TYPE: ['bullet', {CONTROLLERS: [['snake', {invert: true}]]}]
            },
        },
        {
            POSITION: {
                LENGTH: 16.5,
                WIDTH: 2,
                ASPECT: -9.25
            }
        },
        ...weaponMirror({
            POSITION: {
                LENGTH: 4,
                WIDTH: 5,
                ASPECT: -4,
                X: -9.5,
                Y: -7,
                ANGLE: 90
            }
        })
    ]
}
Class.fallenHunter = {
    PARENT: 'genericTank',
    LABEL: "Fallen Hunter",
    DANGER: 10, // AI priority target level
    SIZE: 36,
    SKILL: [6, 9, 9, 9, 6, 9, 9, 9, 6, 8],
    CONTROLLERS: ["nearestDifferentMaster", "mapTargetToGoal", "minion"],
    VALUE: 4e5,
    COLOR: "dgrey",
    BODY: {
        ACCELERATION: base.ACCEL * 1.2,
        SPEED: base.SPEED * 1.4,
        HEALTH: base.HEALTH * 4,
        DAMAGE: base.DAMAGE * 3.4,
        PENETRATION: base.PENETRATION * 1.2,
        SHIELD: base.SHIELD * 3.3,
        REGEN: base.REGEN * 2.5,
        FOV: base.FOV * 1.4,
        DENSITY: base.DENSITY * 20,
        PUSHABILITY: 0,
        HETERO: 3
    },
    BODY: {
        SPEED: base.SPEED * 0.9,
        FOV: base.FOV * 1.25
    },
    CONTROLLERS: ['zoom'],
    TOOLTIP: "Hold right click to zoom.",
    GUNS: [
        {
            POSITION: {
                LENGTH: 24,
                WIDTH: 8
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.hunter, g.hunterSecondary]),
                TYPE: 'bullet'
            }
        },
        {
            POSITION: {
                LENGTH: 21,
                WIDTH: 11,
                DELAY: 0.25
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.hunter]),
                TYPE: 'bullet'
            }
        }
    ]
}
Class.fallenHurricane_bent = {
    PARENT: 'genericTank',
    LABEL: "Fallen Hurricane",
    DANGER: 10, // AI priority target level
    SIZE: 36,
    SKILL: [6, 9, 9, 9, 6, 9, 9, 9, 6, 8],
    CONTROLLERS: ["nearestDifferentMaster", "mapTargetToGoal", "minion"],
    VALUE: 4e5,
    COLOR: "dgrey",
    BODY: {
        ACCELERATION: base.ACCEL * 1.2,
        SPEED: base.SPEED * 1.4,
        HEALTH: base.HEALTH * 4,
        DAMAGE: base.DAMAGE * 3.4,
        PENETRATION: base.PENETRATION * 1.2,
        SHIELD: base.SHIELD * 3.3,
        REGEN: base.REGEN * 2.5,
        FOV: base.FOV * 1.4,
        DENSITY: base.DENSITY * 20,
        PUSHABILITY: 0,
        HETERO: 3
    },
    GUNS: weaponArray([{
        POSITION: {
            LENGTH: 15,
            WIDTH: 8,
            ANGLE: 45
        },
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.twin]),
            TYPE: 'satelliteBullet',
            INDEPENDENT_MASTER: true,
        }
    },
    {
        POSITION: {
            LENGTH: 16,
            WIDTH: 4,
            ASPECT: -1.5,
            ANGLE: 45
        }
    }], 4)
}
Class.fallenLauncher = {
    PARENT: 'genericTank',
    LABEL: "Fallen Launcher",
    DANGER: 10, // AI priority target level
    SIZE: 36,
    SKILL: [6, 9, 9, 9, 6, 9, 9, 9, 6, 8],
    CONTROLLERS: ["nearestDifferentMaster", "mapTargetToGoal", "minion"],
    VALUE: 4e5,
    COLOR: "dgrey",
    BODY: {
        ACCELERATION: base.ACCEL * 1.2,
        SPEED: base.SPEED * 1.4,
        HEALTH: base.HEALTH * 4,
        DAMAGE: base.DAMAGE * 3.4,
        PENETRATION: base.PENETRATION * 1.2,
        SHIELD: base.SHIELD * 3.3,
        REGEN: base.REGEN * 2.5,
        FOV: base.FOV * 1.4,
        DENSITY: base.DENSITY * 20,
        PUSHABILITY: 0,
        HETERO: 3
    },
    GUNS: [
        {
            POSITION: {
                LENGTH: 19.2,
                WIDTH: 13,
                ASPECT: 0.7
            }
        },
        {
            POSITION: {
                LENGTH: 17,
                WIDTH: 13
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.launcher]),
                TYPE: 'minimissile',
                STAT_CALCULATOR: 'sustained'
            }
        }
    ]
}
Class.fallenMace = {
    PARENT: 'genericFlail',
    LABEL: "Fallen Mace",
    DANGER: 10, // AI priority target level
    SIZE: 36,
    SKILL: [6, 9, 9, 9, 6, 9, 9, 9, 6, 8],
    CONTROLLERS: ["nearestDifferentMaster", "mapTargetToGoal", "minion"],
    VALUE: 4e5,
    COLOR: "dgrey",
    BODY: {
        ACCELERATION: base.ACCEL * 1.2,
        SPEED: base.SPEED * 1.4,
        HEALTH: base.HEALTH * 4,
        DAMAGE: base.DAMAGE * 3.4,
        PENETRATION: base.PENETRATION * 1.2,
        SHIELD: base.SHIELD * 3.3,
        REGEN: base.REGEN * 2.5,
        FOV: base.FOV * 1.4,
        DENSITY: base.DENSITY * 20,
        PUSHABILITY: 0,
        HETERO: 3
    },
    TURRETS: [{
        POSITION: [6, 10, 0, 0, 190, 0],
        TYPE: ["maceBolt3", {
            INDEPENDENT: true
        }]
    }]
}
Class.fallenMaelstrom_bent = {
    PARENT: 'genericTank',
    LABEL: "Fallen Maelstrom",
    DANGER: 10, // AI priority target level
    SIZE: 36,
    SKILL: [6, 9, 9, 9, 6, 9, 9, 9, 6, 8],
    CONTROLLERS: ["nearestDifferentMaster", "mapTargetToGoal", "minion"],
    VALUE: 4e5,
    COLOR: "dgrey",
    BODY: {
        ACCELERATION: base.ACCEL * 1.2,
        SPEED: base.SPEED * 1.4,
        HEALTH: base.HEALTH * 4,
        DAMAGE: base.DAMAGE * 3.4,
        PENETRATION: base.PENETRATION * 1.2,
        SHIELD: base.SHIELD * 3.3,
        REGEN: base.REGEN * 2.5,
        FOV: base.FOV * 1.4,
        DENSITY: base.DENSITY * 20,
        PUSHABILITY: 0,
        HETERO: 3
    },
    GUNS: [
        ...weaponMirror([{
            POSITION: {
                LENGTH: 15,
                WIDTH: 8,
                ANGLE: 45,
                DELAY: 0.5
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.tripleShot]),
                TYPE: 'satelliteBullet',
                INDEPENDENT_MASTER: true,
            }
        },
        {
            POSITION: {
                LENGTH: 16,
                WIDTH: 4,
                ASPECT: -1.5,
                ANGLE: 45
            }
        }]),
        {
            POSITION: {
                LENGTH: 17,
                WIDTH: 8,
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.tripleShot]),
                TYPE: 'satelliteBullet',
                INDEPENDENT_MASTER: true,
            }
        },
        {
            POSITION: {
                LENGTH: 18,
                WIDTH: 4,
                ASPECT: -1.5
            }
        }
    ]
}
Class.fallenMarksman = {
    PARENT: 'genericTank',
    LABEL: "Fallen Marksman",
    DANGER: 10, // AI priority target level
    SIZE: 36,
    SKILL: [6, 9, 9, 9, 6, 9, 9, 9, 6, 8],
    CONTROLLERS: ["nearestDifferentMaster", "mapTargetToGoal", "minion"],
    VALUE: 4e5,
    COLOR: "dgrey",
    BODY: {
        ACCELERATION: base.ACCEL * 1.2,
        SPEED: base.SPEED * 1.4,
        HEALTH: base.HEALTH * 4,
        DAMAGE: base.DAMAGE * 3.4,
        PENETRATION: base.PENETRATION * 1.2,
        SHIELD: base.SHIELD * 3.3,
        REGEN: base.REGEN * 2.5,
        FOV: base.FOV * 1.4,
        DENSITY: base.DENSITY * 20,
        PUSHABILITY: 0,
        HETERO: 3
    },
    GUNS: [
        ...weaponStack({
            POSITION: {
                LENGTH: 13,
                WIDTH: 5,
                ASPECT: 2.2,
                X: 10
            }
        }, 3, {xPosOffset: 5}),
        {
            POSITION: {
                LENGTH: 24,
                WIDTH: 8
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.marksman]),
                TYPE: 'bullet'
            }
        }
    ]
}
Class.fallenMinigun = {
    PARENT: 'genericTank',
    LABEL: "Fallen Minigun",
    DANGER: 10, // AI priority target level
    SIZE: 36,
    SKILL: [6, 9, 9, 9, 6, 9, 9, 9, 6, 8],
    CONTROLLERS: ["nearestDifferentMaster", "mapTargetToGoal", "minion"],
    VALUE: 4e5,
    COLOR: "dgrey",
    BODY: {
        ACCELERATION: base.ACCEL * 1.2,
        SPEED: base.SPEED * 1.4,
        HEALTH: base.HEALTH * 4,
        DAMAGE: base.DAMAGE * 3.4,
        PENETRATION: base.PENETRATION * 1.2,
        SHIELD: base.SHIELD * 3.3,
        REGEN: base.REGEN * 2.5,
        FOV: base.FOV * 1.4,
        DENSITY: base.DENSITY * 20,
        PUSHABILITY: 0,
        HETERO: 3
    },
    GUNS: weaponStack({
        POSITION: {
            LENGTH: 21,
            WIDTH: 8
        },
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.basic, g.minigun]),
            TYPE: 'bullet'
        }
    }, 3, {lengthOffset: 2, delayIncrement: 1/3})
}
Class.fallenMonsoon_bent = {
    PARENT: 'genericTank',
    LABEL: "Fallen Monsoon",
    DANGER: 10, // AI priority target level
    SIZE: 36,
    SKILL: [6, 9, 9, 9, 6, 9, 9, 9, 6, 8],
    CONTROLLERS: ["nearestDifferentMaster", "mapTargetToGoal", "minion"],
    VALUE: 4e5,
    COLOR: "dgrey",
    BODY: {
        ACCELERATION: base.ACCEL * 1.2,
        SPEED: base.SPEED * 1.4,
        HEALTH: base.HEALTH * 4,
        DAMAGE: base.DAMAGE * 3.4,
        PENETRATION: base.PENETRATION * 1.2,
        SHIELD: base.SHIELD * 3.3,
        REGEN: base.REGEN * 2.5,
        FOV: base.FOV * 1.4,
        DENSITY: base.DENSITY * 20,
        PUSHABILITY: 0,
        HETERO: 3
    },
    GUNS: weaponMirror([
        {
            POSITION: {
                LENGTH: 15,
                WIDTH: 8,
                Y: 2,
                ANGLE: 30
            }
        },
        {
            POSITION: {
                LENGTH: 2,
                WIDTH: 8,
                ASPECT: 1.25,
                X: 14,
                Y: 2,
                ANGLE: 30
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap]),
                TYPE: "satelliteTrap",
                STAT_CALCULATOR: 'trap',
                INDEPENDENT_MASTER: true
            }
        },
        {
            POSITION: {
                LENGTH: 17,
                WIDTH: 4,
                ASPECT: -1.5,
                Y: 2,
                ANGLE: 30
            }
        }
    ], {delayIncrement: 0.5})
}
Class.fallenOverseer = {
    PARENT: 'genericTank',
    LABEL: "Fallen Overseer",
    DANGER: 10, // AI priority target level
    SIZE: 36,
    SKILL: [6, 9, 9, 9, 6, 9, 9, 9, 6, 8],
    CONTROLLERS: ["nearestDifferentMaster", "mapTargetToGoal", "minion"],
    VALUE: 4e5,
    COLOR: "dgrey",
    BODY: {
        ACCELERATION: base.ACCEL * 1.2,
        SPEED: base.SPEED * 1.4,
        HEALTH: base.HEALTH * 4,
        DAMAGE: base.DAMAGE * 3.4,
        PENETRATION: base.PENETRATION * 1.2,
        SHIELD: base.SHIELD * 3.3,
        REGEN: base.REGEN * 2.5,
        FOV: base.FOV * 1.4,
        DENSITY: base.DENSITY * 20,
        PUSHABILITY: 0,
        HETERO: 3
    },
    GUNS: weaponMirror({
        POSITION: {
            LENGTH: 6,
            WIDTH: 12,
            ASPECT: 1.2,
            X: 8,
            ANGLE: 90
        },
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.drone, g.overseer]),
            TYPE: 'drone',
            AUTOFIRE: true,
            SYNCS_SKILLS: true,
            STAT_CALCULATOR: 'drone',
            WAIT_TO_CYCLE: true,
            MAX_CHILDREN: 4
        }
    })
}
Class.fallenRepeater = {
    PARENT: 'genericTank',
    LABEL: "Fallen Repeater",
    DANGER: 10, // AI priority target level
    SIZE: 36,
    SKILL: [6, 9, 9, 9, 6, 9, 9, 9, 6, 8],
    CONTROLLERS: ["nearestDifferentMaster", "mapTargetToGoal", "minion"],
    VALUE: 4e5,
    COLOR: "dgrey",
    BODY: {
        ACCELERATION: base.ACCEL * 1.2,
        SPEED: base.SPEED * 1.4,
        HEALTH: base.HEALTH * 4,
        DAMAGE: base.DAMAGE * 3.4,
        PENETRATION: base.PENETRATION * 1.2,
        SHIELD: base.SHIELD * 3.3,
        REGEN: base.REGEN * 2.5,
        FOV: base.FOV * 1.4,
        DENSITY: base.DENSITY * 20,
        PUSHABILITY: 0,
        HETERO: 3
    },
    GUNS: [
        {
            POSITION: {
                LENGTH: 20,
                WIDTH: 8,
                ASPECT: -1.5
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.desmos]),
                TYPE: ['splitterBullet', {CONTROLLERS: ['snake']}]
            }
        },
        ...weaponMirror([
            {
                POSITION: {
                    LENGTH: 5,
                    WIDTH: 5,
                    ASPECT: -3,
                    X: -5.5,
                    Y: -10,
                    ANGLE: 90
                }
            },
            {
                POSITION: {
                    LENGTH: 5,
                    WIDTH: 5,
                    ASPECT: -4,
                    X: -5.25,
                    Y: -5,
                    ANGLE: 82.5
                }
            }
        ])
    ]
}
Class.fallenRifle = {
    PARENT: 'genericTank',
    LABEL: "Fallen Rifle",
    DANGER: 10, // AI priority target level
    SIZE: 36,
    SKILL: [6, 9, 9, 9, 6, 9, 9, 9, 6, 8],
    CONTROLLERS: ["nearestDifferentMaster", "mapTargetToGoal", "minion"],
    VALUE: 4e5,
    COLOR: "dgrey",
    BODY: {
        ACCELERATION: base.ACCEL * 1.2,
        SPEED: base.SPEED * 1.4,
        HEALTH: base.HEALTH * 4,
        DAMAGE: base.DAMAGE * 3.4,
        PENETRATION: base.PENETRATION * 1.2,
        SHIELD: base.SHIELD * 3.3,
        REGEN: base.REGEN * 2.5,
        FOV: base.FOV * 1.4,
        DENSITY: base.DENSITY * 20,
        PUSHABILITY: 0,
        HETERO: 3
    },
    GUNS: [
        {
            POSITION: {
                LENGTH: 20,
                WIDTH: 12
            }
        },
        {
            POSITION: {
                LENGTH: 24,
                WIDTH: 7
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.rifle]),
                TYPE: 'bullet'
            }
        }
    ]
}
Class.fallenRifle_old = {
    PARENT: 'genericTank',
    LABEL: "Fallen Rifle",
    UPGRADE_LABEL: "Old Rifle",
    DANGER: 10, // AI priority target level
    SIZE: 36,
    SKILL: [6, 9, 9, 9, 6, 9, 9, 9, 6, 8],
    CONTROLLERS: ["nearestDifferentMaster", "mapTargetToGoal", "minion"],
    VALUE: 4e5,
    COLOR: "dgrey",
    BODY: {
        ACCELERATION: base.ACCEL * 1.2,
        SPEED: base.SPEED * 1.4,
        HEALTH: base.HEALTH * 4,
        DAMAGE: base.DAMAGE * 3.4,
        PENETRATION: base.PENETRATION * 1.2,
        SHIELD: base.SHIELD * 3.3,
        REGEN: base.REGEN * 2.5,
        FOV: base.FOV * 1.4,
        DENSITY: base.DENSITY * 20,
        PUSHABILITY: 0,
        HETERO: 3
    },
    GUNS: [
        {
            POSITION: {
                LENGTH: 25,
                WIDTH: 7
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.rifle]),
                TYPE: 'bullet'
            }
        },
        {
            POSITION: {
                LENGTH: 14,
                WIDTH: 9.5
            }
        }
    ],
    UPGRADES_TIER_3: [
        "sniperRifle",
        "ransacker_old",
        "spreadRifle",,
    ]
}
Class.fallenSmasher = {
    PARENT: 'genericSmasher',
    LABEL: "Fallen Smasher",
    DANGER: 10, // AI priority target level
    SIZE: 36,
    SKILL: [12, 12, 12, 12, 12, 12, 12, 12, 12, 12],
    CONTROLLERS: ["nearestDifferentMaster", "mapTargetToGoal"],
    VALUE: 4e5,
    COLOR: "dgrey",
    BODY: {
        ACCELERATION: base.ACCEL * 1.5,
        SPEED: base.SPEED * 1.8,
        HEALTH: base.HEALTH * 6,
        DAMAGE: base.DAMAGE * 3.4,
        PENETRATION: base.PENETRATION * 1.2,
        SHIELD: base.SHIELD * 4,
        REGEN: base.REGEN * 3,
        FOV: base.FOV * 1.4,
        DENSITY: base.DENSITY * 200,
        PUSHABILITY: 0,
        HETERO: 3
    },
    TURRETS: [
        {
            TYPE: ['hexagonHat_spin', {COLOR: 'black'}],
            POSITION: {
                SIZE: 21.5
            }
        }
    ]
}
Class.fallenSpawner = {
    PARENT: 'genericTank',
    LABEL: "Fallen Spawner",
    DANGER: 10, // AI priority target level
    SIZE: 36,
    SKILL: [6, 9, 9, 9, 6, 9, 9, 9, 6, 8],
    CONTROLLERS: ["nearestDifferentMaster", "mapTargetToGoal", "minion"],
    VALUE: 4e5,
    COLOR: "dgrey",
    BODY: {
        ACCELERATION: base.ACCEL * 1.2,
        SPEED: base.SPEED * 1.4,
        HEALTH: base.HEALTH * 4,
        DAMAGE: base.DAMAGE * 3.4,
        PENETRATION: base.PENETRATION * 1.2,
        SHIELD: base.SHIELD * 3.3,
        REGEN: base.REGEN * 2.5,
        FOV: base.FOV * 1.4,
        DENSITY: base.DENSITY * 20,
        PUSHABILITY: 0,
        HETERO: 3
    },
    GUNS: [
        {
            POSITION: {
                LENGTH: 4.5,
                WIDTH: 10,
                X: 10.5
            }
        },
        {
            POSITION: {
                LENGTH: 1,
                WIDTH: 12,
                X: 15
            },
            PROPERTIES: {
                MAX_CHILDREN: 4,
                SHOOT_SETTINGS: combineStats([g.minion, g.spawner]),
                TYPE: 'minion',
                STAT_CALCULATOR: 'drone',
                AUTOFIRE: true,
                SYNCS_SKILLS: true,
            },
        },
        {
            POSITION: {
                LENGTH: 11.5,
                WIDTH: 12
            }
        }
    ]
}
Class.fallenSpiral = {
    PARENT: 'genericTank',
    LABEL: "Fallen Spiral",
    DANGER: 10, // AI priority target level
    SIZE: 36,
    SKILL: [6, 9, 9, 9, 6, 9, 9, 9, 6, 8],
    CONTROLLERS: ["nearestDifferentMaster", "mapTargetToGoal", "minion"],
    VALUE: 4e5,
    COLOR: "dgrey",
    BODY: {
        ACCELERATION: base.ACCEL * 1.2,
        SPEED: base.SPEED * 1.4,
        HEALTH: base.HEALTH * 4,
        DAMAGE: base.DAMAGE * 3.4,
        PENETRATION: base.PENETRATION * 1.2,
        SHIELD: base.SHIELD * 3.3,
        REGEN: base.REGEN * 2.5,
        FOV: base.FOV * 1.4,
        DENSITY: base.DENSITY * 20,
        PUSHABILITY: 0,
        HETERO: 3
    },
    GUNS: [
        {
            POSITION: {
                LENGTH: 17,
                WIDTH: 12
            }
        },
        {
            POSITION: {
                LENGTH: 20,
                WIDTH: 8,
                ASPECT: -1.5
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.desmos]),
                TYPE: ['spiralBullet', {CONTROLLERS: ['snake']}]
            }
        },
        ...weaponMirror({
            POSITION: {
                LENGTH: 6,
                WIDTH: 5,
                ASPECT: -4,
                X: -6.5,
                Y: -5,
                ANGLE: 87.5
            }
        })
    ]
}
Class.fallenSprayer = {
    PARENT: 'genericTank',
    LABEL: "Fallen Sprayer",
    DANGER: 10, // AI priority target level
    SIZE: 36,
    SKILL: [6, 9, 9, 9, 6, 9, 9, 9, 6, 8],
    CONTROLLERS: ["nearestDifferentMaster", "mapTargetToGoal", "minion"],
    VALUE: 4e5,
    COLOR: "dgrey",
    BODY: {
        ACCELERATION: base.ACCEL * 1.2,
        SPEED: base.SPEED * 1.4,
        HEALTH: base.HEALTH * 4,
        DAMAGE: base.DAMAGE * 3.4,
        PENETRATION: base.PENETRATION * 1.2,
        SHIELD: base.SHIELD * 3.3,
        REGEN: base.REGEN * 2.5,
        FOV: base.FOV * 1.4,
        DENSITY: base.DENSITY * 20,
        PUSHABILITY: 0,
        HETERO: 3
    },
    GUNS: [
        {
            POSITION: {
                LENGTH: 23,
                WIDTH: 7
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.lowPower, g.pelleter, { recoil: 1.15 }]),
                TYPE: 'bullet'
            }
        },
        {
            POSITION: {
                LENGTH: 12,
                WIDTH: 10,
                ASPECT: 1.4,
                X: 8
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.machineGun]),
                TYPE: 'bullet'
            }
        }
    ]
}
Class.fallenTempest_bent = {
    PARENT: 'genericTank',
    LABEL: "Fallen Tempest",
    DANGER: 10, // AI priority target level
    SIZE: 36,
    SKILL: [6, 9, 9, 9, 6, 9, 9, 9, 6, 8],
    CONTROLLERS: ["nearestDifferentMaster", "mapTargetToGoal", "minion"],
    VALUE: 4e5,
    COLOR: "dgrey",
    BODY: {
        ACCELERATION: base.ACCEL * 1.2,
        SPEED: base.SPEED * 1.4,
        HEALTH: base.HEALTH * 4,
        DAMAGE: base.DAMAGE * 3.4,
        PENETRATION: base.PENETRATION * 1.2,
        SHIELD: base.SHIELD * 3.3,
        REGEN: base.REGEN * 2.5,
        FOV: base.FOV * 1.4,
        DENSITY: base.DENSITY * 20,
        PUSHABILITY: 0,
        HETERO: 3
    },
    GUNS: [
        {
            POSITION: {
                LENGTH: 5,
                WIDTH: 12,
                ASPECT: 1.2,
                X: 8
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, { size: 0.92 }]), // guess, if it turns out to use satelliteDrones i'll change it
                TYPE: 'satelliteBullet',
                INDEPENDENT_MASTER: true,
            }
        },
        {
            POSITION: {
                LENGTH: 16,
                WIDTH: 6,
                ASPECT: -2
            }
        }
    ]
}
Class.fallenTrapGuard = makeGuard({
    PARENT: 'genericTank',
    DANGER: 10, // AI priority target level
    SIZE: 36,
    SKILL: [6, 9, 9, 9, 6, 9, 9, 9, 6, 8],
    CONTROLLERS: ["nearestDifferentMaster", "mapTargetToGoal", "minion"],
    VALUE: 4e5,
    COLOR: "dgrey",
    BODY: {
        ACCELERATION: base.ACCEL * 1.2,
        SPEED: base.SPEED * 1.4,
        HEALTH: base.HEALTH * 4,
        DAMAGE: base.DAMAGE * 3.4,
        PENETRATION: base.PENETRATION * 1.2,
        SHIELD: base.SHIELD * 3.3,
        REGEN: base.REGEN * 2.5,
        FOV: base.FOV * 1.4,
        DENSITY: base.DENSITY * 20,
        PUSHABILITY: 0,
        HETERO: 3
    },
    GUNS: [
        {
            POSITION: {
                LENGTH: 20,
                WIDTH: 8
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic]),
                TYPE: 'bullet'
            }
        }
    ]
}, "Fallen Trap Guard")
Class.fallenTriAngle = {
    PARENT: 'genericTank',
    LABEL: "Fallen Tri-Angle",
    DANGER: 10, // AI priority target level
    SIZE: 36,
    SKILL: [6, 9, 9, 9, 6, 9, 9, 9, 6, 8],
    CONTROLLERS: ["nearestDifferentMaster", "mapTargetToGoal", "minion"],
    VALUE: 4e5,
    COLOR: "dgrey",
    BODY: {
        ACCELERATION: base.ACCEL * 1.2,
        SPEED: base.SPEED * 1.4,
        HEALTH: base.HEALTH * 4,
        DAMAGE: base.DAMAGE * 3.4,
        PENETRATION: base.PENETRATION * 1.2,
        SHIELD: base.SHIELD * 3.3,
        REGEN: base.REGEN * 2.5,
        FOV: base.FOV * 1.4,
        DENSITY: base.DENSITY * 20,
        PUSHABILITY: 0,
        HETERO: 3
    },
    GUNS: [
        {
            POSITION: {
                LENGTH: 18,
                WIDTH: 8
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.flankGuard, g.triAngle, g.triAngleFront, { recoil: 4 }]),
                TYPE: 'bullet',
                LABEL: "Front"
            }
        },
        ...weaponMirror({
            POSITION: {
                LENGTH: 16,
                WIDTH: 8,
                ANGLE: 150,
                DELAY: 0.1
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.flankGuard, g.triAngle, g.thruster]),
                TYPE: 'bullet',
                LABEL: "Thruster"
            }
        })
    ]
}
Class.fallenTripleShot = {
    PARENT: 'genericTank',
    LABEL: "Fallen Triple Shot",
    DANGER: 10, // AI priority target level
    SIZE: 36,
    SKILL: [6, 9, 9, 9, 6, 9, 9, 9, 6, 8],
    CONTROLLERS: ["nearestDifferentMaster", "mapTargetToGoal", "minion"],
    VALUE: 4e5,
    COLOR: "dgrey",
    BODY: {
        ACCELERATION: base.ACCEL * 1.2,
        SPEED: base.SPEED * 1.4,
        HEALTH: base.HEALTH * 4,
        DAMAGE: base.DAMAGE * 3.4,
        PENETRATION: base.PENETRATION * 1.2,
        SHIELD: base.SHIELD * 3.3,
        REGEN: base.REGEN * 2.5,
        FOV: base.FOV * 1.4,
        DENSITY: base.DENSITY * 20,
        PUSHABILITY: 0,
        HETERO: 3
    },
    GUNS: [
        ...weaponMirror({
            POSITION: {
                LENGTH: 19,
                WIDTH: 8,
                Y: 2,
                ANGLE: 18,
                DELAY: 0.5
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.tripleShot]),
                TYPE: 'bullet'
            }
        }),
        {
            POSITION: {
                LENGTH: 22,
                WIDTH: 8
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.tripleShot]),
                TYPE: 'bullet'
            }
        }
    ]
}
Class.fallenTyphoon_bent = {
    PARENT: 'genericTank',
    LABEL: "Fallen Typhoon",
    DANGER: 10, // AI priority target level
    SIZE: 36,
    SKILL: [6, 9, 9, 9, 6, 9, 9, 9, 6, 8],
    CONTROLLERS: ["nearestDifferentMaster", "mapTargetToGoal", "minion"],
    VALUE: 4e5,
    COLOR: "dgrey",
    BODY: {
        ACCELERATION: base.ACCEL * 1.2,
        SPEED: base.SPEED * 1.4,
        HEALTH: base.HEALTH * 4,
        DAMAGE: base.DAMAGE * 3.4,
        PENETRATION: base.PENETRATION * 1.2,
        SHIELD: base.SHIELD * 3.3,
        REGEN: base.REGEN * 2.5,
        FOV: base.FOV * 1.4,
        DENSITY: base.DENSITY * 20,
        PUSHABILITY: 0,
        HETERO: 3
    },
    GUNS: [
        {
            POSITION: {
                LENGTH: 15,
                WIDTH: 12,
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pounder]),
                TYPE: 'satelliteBullet',
                INDEPENDENT_MASTER: true,
            }
        },
        {
            POSITION: {
                LENGTH: 16,
                WIDTH: 8,
                ASPECT: -1.5
            }
        }
    ]
}
Class.fallenUnderseer = {
    PARENT: 'genericTank',
    LABEL: "Fallen Underseer",
    DANGER: 10, // AI priority target level
    SIZE: 36,
    SKILL: [6, 9, 9, 9, 6, 9, 9, 9, 6, 8],
    CONTROLLERS: ["nearestDifferentMaster", "mapTargetToGoal", "minion"],
    VALUE: 4e5,
    COLOR: "dgrey",
    BODY: {
        ACCELERATION: base.ACCEL * 1.2,
        SPEED: base.SPEED * 1.4,
        HEALTH: base.HEALTH * 4,
        DAMAGE: base.DAMAGE * 3.4,
        PENETRATION: base.PENETRATION * 1.2,
        SHIELD: base.SHIELD * 3.3,
        REGEN: base.REGEN * 2.5,
        FOV: base.FOV * 1.4,
        DENSITY: base.DENSITY * 20,
        PUSHABILITY: 0,
        HETERO: 3
    },
    NECRO: [4],
    SHAPE: 4,
    MAX_CHILDREN: 15,
    GUNS: weaponArray({
        POSITION: {
            LENGTH: 6,
            WIDTH: 12,
            ASPECT: 1.2,
            X: 7.4,
            ANGLE: 90
        },
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.drone, g.sunchip, {reload: 0.8}]),
            TYPE: 'sunchip',
            AUTOFIRE: true,
            SYNCS_SKILLS: true,
            STAT_CALCULATOR: 'necro',
            WAIT_TO_CYCLE: true,
            DELAY_SPAWN: false
        }
    }, 2)
}
Class.fallenUndertow = {
    PARENT: 'genericTank',
    LABEL: "Fallen Undertow",
    DANGER: 10, // AI priority target level
    SIZE: 36,
    SKILL: [6, 9, 9, 9, 6, 9, 9, 9, 6, 8],
    CONTROLLERS: ["nearestDifferentMaster", "mapTargetToGoal", "minion"],
    VALUE: 4e5,
    COLOR: "dgrey",
    BODY: {
        ACCELERATION: base.ACCEL * 1.2,
        SPEED: base.SPEED * 1.4,
        HEALTH: base.HEALTH * 4,
        DAMAGE: base.DAMAGE * 3.4,
        PENETRATION: base.PENETRATION * 1.2,
        SHIELD: base.SHIELD * 3.3,
        REGEN: base.REGEN * 2.5,
        FOV: base.FOV * 1.4,
        DENSITY: base.DENSITY * 20,
        PUSHABILITY: 0,
        HETERO: 3
    },
    GUNS: [
        {
           POSITION: [14, 12, 0.8, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, { size: 0.8, reload: 1.2 }]),
                TYPE: 'undertowBullet'
            }
        },
        ...weaponMirror({
            POSITION: [11.25, 8, 0.15, 4.25, 4, 13.5, 0]
        })
    ]
}
Class.fallenVolute = {
    PARENT: 'genericTank',
    LABEL: "Fallen Volute",
    DANGER: 10, // AI priority target level
    SIZE: 36,
    SKILL: [6, 9, 9, 9, 6, 9, 9, 9, 6, 8],
    CONTROLLERS: ["nearestDifferentMaster", "mapTargetToGoal", "minion"],
    VALUE: 4e5,
    COLOR: "dgrey",
    BODY: {
        ACCELERATION: base.ACCEL * 1.2,
        SPEED: base.SPEED * 1.4,
        HEALTH: base.HEALTH * 4,
        DAMAGE: base.DAMAGE * 3.4,
        PENETRATION: base.PENETRATION * 1.2,
        SHIELD: base.SHIELD * 3.3,
        REGEN: base.REGEN * 2.5,
        FOV: base.FOV * 1.4,
        DENSITY: base.DENSITY * 20,
        PUSHABILITY: 0,
        HETERO: 3
    },
    GUNS: [
        {
            POSITION: {
                LENGTH: 20,
                WIDTH: 11,
                ASPECT: -1.2
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.desmos]),
                TYPE: ['bullet', {CONTROLLERS: ['snake']}]
            }
        },
        ...weaponMirror({
            POSITION: {
                LENGTH: 6.25,
                WIDTH: 5,
                ASPECT: -4,
                X: -6.5,
                Y: -7,
                ANGLE: 90
            }
        })
    ]
}
Class.sentinelCrossbow = {
    PARENT: "sentinel",
    UPGRADE_LABEL: "Crossbow Sentinel",
    UPGRADE_COLOR: "purple",
    GUNS: [
        {
            POSITION: [15, 2.5, 1, 0, 3.5, 35/2, 2/3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.rifle, { speed: 0.7, maxSpeed: 0.7 }, g.crossbow, { recoil: 0.5 }]),
                TYPE: "bullet",
            },
        }, {
            POSITION: [15, 2.5, 1, 0, -3.5, -35/2, 2/3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.rifle, { speed: 0.7, maxSpeed: 0.7 }, g.crossbow, { recoil: 0.5 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [20, 3.5, 1, 0, 4, 0, 1/3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.rifle, { speed: 0.7, maxSpeed: 0.7 }, g.crossbow, { recoil: 0.5 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [20, 3.5, 1, 0, -4, 0, 1/3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.rifle, { speed: 0.7, maxSpeed: 0.7 }, g.crossbow, { recoil: 0.5 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [24, 7, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.rifle, { speed: 0.7, maxSpeed: 0.7, reload: 2, recoil: 0.5 }]),
                TYPE: "bullet",
            },
        },
    ],
}
Class.sentinelMinigun = {
    PARENT: "sentinel",
    UPGRADE_LABEL: "Minigun Sentinel",
    UPGRADE_COLOR: "purple",
    GUNS: [
        {
            POSITION: [16, 7.5, 1, 0, 4.5, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.minigun, g.twin, g.spam, g.spam]),
                TYPE: "bullet",
            },
        }, {
            POSITION: [11.5, 7.5, -1.33, 1, 4.5, 0, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.minigun, g.twin, g.spam, g.spam]),
                TYPE: "bullet",
            },
        }, {
            POSITION: [16, 7.5, 1, 0, -4.5, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.minigun, g.twin, g.spam, g.spam]),
                TYPE: "bullet",
            },
        }, {
            POSITION: [11.5, 7.5, -1.33, 1, -4.5, 0, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.minigun, g.twin, g.spam, g.spam]),
                TYPE: "bullet",
            },
        }, {
            POSITION: [22.5, 9, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.minigun, g.twin, g.spam, g.spam]),
                TYPE: "bullet",
            },
        }, {
            POSITION: [20.4, 9, 1, 0, 0, 0, 1/3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.minigun, g.twin, g.spam, g.spam]),
                TYPE: "bullet",
            },
        }, {
            POSITION: [18.3, 9, 1, 0, 0, 0, 2/3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.minigun, g.twin, g.spam, g.spam]),
                TYPE: "bullet",
            },
        },
    ],
}

// Sentinels (Arms Race)
Class.sentinelSwarm = {
    PARENT: "sentry",
    LABEL: "Sentinel",
    UPGRADE_LABEL: "Swarm Sentinel",
    UPGRADE_COLOR: "pink",
    GUNS: weaponMirror({
        POSITION: [7, 10, 0.6, 7, 5.5, 180, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.swarm, { recoil: 1.15, range: 0.9 }]),
            TYPE: "swarm",
            STAT_CALCULATOR: "swarm",
        },
    }, {delayIncrement: 0.5})
}
Class.sentinelGun = makeAuto("sentry", "Sentinel", {
    type: "ultraAutoTankGun",
    size: 12,
})
Class.sentinelGun.UPGRADE_LABEL = "Gun Sentinel"
Class.sentinelTrap = makeAuto("sentry", "Sentinel", {
    type: "megaTrapTurret",
    size: 12,
})
Class.sentinelTrap.UPGRADE_LABEL = "Trap Sentinel"
