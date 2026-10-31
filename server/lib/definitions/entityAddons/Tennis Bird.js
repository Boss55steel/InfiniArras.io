const { combineStats, menu, menuvar2, addAura, makeDeco, LayeredBoss, newWeapon, weaponArray, makeRadialAuto, makeTurret } = require('../facilitators.js');
const { base, basePolygonDamage, basePolygonHealth, dfltskl, statnames } = require('../constants.js');
const g = require('../gunvals.js');

Class.tennisBird = {
	PARENT: "genericTank",
	LABEL: "Tennis Bird",
	UPGRADE_TOOLTIP: '"1447472307663802479.webp"',
	SHAPE: "https://cdn.discordapp.com/emojis/1447472307663802479.webp?size=40", // offical emoji in arrascord, wont break anytime soon :)
	HITS_OWN_TYPE: 'hard',
}
Class.bullet23 = {
    COLOR: "48",
    PARENT: "bullet",
},
Class.myTank = {
    PARENT: "genericTank",
    LABEL: "MyTank",
    BODY: {
        DAMAGE: 1798754323,
        SPEED: 40.425,
        HEALTH: 499999909.5,
        SHIELD: 999972.5,
        REGEN: 0.196667,
        FOV: 1.326,
        PUSHABILITY: 1
    },
    SIZE: 15,
    SHAPE: 0,
    COLOR: "blue",
    HEALTH_WITH_LEVEL: true,
    GUNS: [
        {
            POSITION: [27.749495, 1.92, -10, 0, 0, -60, 0],
            PROPERTIES: {}
        },
        {
            POSITION: [27.749495, 1.92, -10, 0, 0, 60, 0],
            PROPERTIES: {}
        },
        {
            POSITION: [23.511111, 9.984, 3, 0, 0, 180, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: {
                    reload: 0.2,
                    recoil: 0.7,
                    shudder: 0.1,
                    size: 0.5,
                    health: 0.6,
                    damage: 0,
                    pen: 0,
                    speed: 2,
                    maxSpeed: 2.1,
                    range: 3,
                    density: 1,
                    spray: 100,
                    resist: 1
                },
                TYPE: "bullet23",
                FACING_TYPE: "toTarget",
                _iStrongMeta: {
                    v: 1,
                    id: "e7ad8f0f-19e9-40dc-828b-583c119e8d1a",
                    alwaysAbove: false,
                    autoTargetPriority: "nearest",
                    maxTurnSpeed: 4.5,
                    autoFireDelay: 0,
                    manualControl: false,
                    wifiRange: false,
                    wifiRangeValue: 50,
                    visualLayers: [],
                    renderLayer: 0
                },
                _iStrongProj: {
                    v: 1,
                    growRate: 1,
                    trapCurved: false,
                    useMuzzleSize: true,
                    bouncy: true,
                    bounciness: 0.9,
                    friction: 0,
                    dieAtRange: false,
                    hitsOwnType: "none",
                    density: 1,
                    cycleProjectilesEnabled: false,
                    shape: 0,
                    size: 1,
                    color: "inherit",
                    useTankColor: true
                }
            }
        },
        {
            POSITION: [27.749495, 1.92, -10, 0, 0, 180, 0],
            PROPERTIES: {}
        }
    ],
    SKILL_CAP: [
        10,
        10,
        10,
        10,
        10,
        10,
        10,
        10,
        10,
        10
    ],
    SKILL: [
        10,
        10,
        10,
        10,
        10,
        10,
        10,
        10,
        10,
        10
    ],
    INVISIBLE: [0.08, 0.03],
    _iStrongMeta: {
        v: 1,
        tankShapeCurved: false,
        statNamesType: "generic",
        primaryTurretId: "c6617000-284c-4de8-ae8c-4a353746ebb5",
        mirrorMode: false,
        autoPlacement: false,
        autoPlacementCount: 3,
        snapPlacement: true,
        snapPlacementCount: 0,
        maxSkillPoints: 42,
        maxPointsPerSkill: 10,
        fovMultiplier: 1.3
    }
}
Class.menu_addons.UPGRADES_TIER_0.push("tennisBird", "myTank");