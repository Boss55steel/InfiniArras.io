const { combineStats, makeAura, makeAuto, weaponArray, dereference } = require('../facilitators.js');
const { smshskl, base } = require('../constants.js');
const g = require('../gunvals.js');
const {makeMenu, weaponMirror, makeTurret} = require("../facilitators");

// getPolygonNameFromString made by Wait What!?
function getPolygonNameFromString(nStr) {
    if (nStr === Infinity) return "apeirogon";
    if (nStr === "Infinity") return "apeirogon";
    if (!/^\d+$/.test(nStr) || nStr === "0") return "invalid";

    const units = ["", "hen", "di", "tri", "tetra", "penta", "hexa", "hepta", "octa", "ennea"];
    const teens = ["deca", "hendeca", "dodeca", "trideca", "tetradeca", "pentadeca", "hexadeca", "heptadeca", "octadeca", "enneadeca"];
    const tens = ["", "", "icosi", "triaconta", "tetraconta", "pentaconta", "hexaconta", "heptaconta", "octaconta", "enneaconta"];
    const hundreds = ["", "hecta", "dihecta", "trihecta", "tetrahecta", "pentahecta", "hexahecta", "heptahecta", "octahecta", "enneahecta"];

    const bigUnits = [
        "",        // 10^0
        "chilia",  // 10^3
        "mega",    // 10^6
        "giga",    // 10^9
        "tera",    // 10^12
        "peta",    // 10^15
        "exa",     // 10^18
        "zetta",   // 10^21
        "yotta",   // 10^24
        "ronna",   // 10^27
        "quetta",  // 10^30
        "hella",   // 10^33 (proposed, widely known)
        "bronto",  // 10^36 (used in humor, often cited)
        "geop",    // 10^39 (circulated online)
        "xona",    // 10^42
        "weka",    // 10^45
        "vunda",   // 10^48
        "uda",     // 10^51
        "treda",   // 10^54
        "sorta",   // 10^57 (last one we'll support here)
    ];

    function numberToPrefix(groupStr, isLastGroup = false) {
        const val = parseInt(groupStr, 10);
        if (val === 0) return "";
        if (val === 1 && !isLastGroup) return "";

        const h = Math.floor(val / 100);
        const t = Math.floor((val % 100) / 10);
        const u = val % 10;

        let name = "";
        if (h) name += hundreds[h];
        if (t === 1) {
            name += teens[u];
        } else {
            if (t) name += tens[t];
            if (u) {
                if (t) name += "kai";
                name += units[u];
            }
        }
        return name;
    }

    // Pad string to multiple of 3
    const padded = nStr.padStart(Math.ceil(nStr.length / 3) * 3, "0");
    const groups = [];
    for (let i = 0; i < padded.length; i += 3) {
        groups.push(padded.slice(i, i + 3));
    }

    if (groups.length > bigUnits.length) return "unsupported";

    const nameParts = [];
    for (let i = 0; i < groups.length; i++) {
        const group = groups[i];
        if (group === "000") continue;
        const prefix = numberToPrefix(group, i === groups.length - 1);
        const unit = bigUnits[groups.length - 1 - i];
        nameParts.push(prefix + unit);
    }

    return nameParts.join("kai");
}
function fixPolyName(nStr) {
    return getPolygonNameFromString(nStr).charAt(0).toUpperCase() + getPolygonNameFromString(nStr).slice(1)
}


Class.CSDFallback = {
    PARENT: "genericTank",
    LABEL: "JJFJjk",
    UPGRADE_TOOLTIP: "if you're seeing this, I messed up.\nAllan, please add details.",
    GUNS: [
        {
            POSITION: [18, 8, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic]),
                TYPE: "bullet",
            }
        }
    ],
}
function combineTanks(weapon, body, extraThings = {}, fovFix = 2) {
    let fixedWeapon = weapon
    if (typeof weapon === "string") {
        fixedWeapon = Class[weapon]
    }
    let fixedBody = body
    if (typeof body !== "string") {
        fixedBody = "CSDFallback"
    }
    let fixedWeaponStats = {...Class.genericTank.BODY, ...Class[weapon].BODY}
    let fixedBodyStats = {...Class.genericTank.BODY, ...Class[body].BODY}
    let fixedStats = fixedBodyStats
    if (fovFix === 1) {
        fixedStats.FOV = Math.max(fixedWeaponStats.FOV, fixedBodyStats.FOV)
    }
    if (fovFix === 2) {
        fixedStats.FOV = fixedWeaponStats.FOV * fixedBodyStats.FOV
    }
    let output = {
        PARENT: body,
        LABEL: fixedWeapon.LABEL + "-" + Class[fixedBody].LABEL,
        GUNS: fixedWeapon.GUNS || [],
        BODY: fixedStats,
        TURRETS: Class[fixedBody].TURRETS,
        PROPS: Class[fixedBody].PROPS,
        ...extraThings,
    }
    for(let l = 0; l < 20; l++){
        output["UPGRADES_TIER_" + l] = []
        for (let i = 0; i < fixedWeapon["UPGRADES_TIER_" + l]?.length; i++) {
            for (let j = 0; j < Class[fixedBody]["UPGRADES_TIER_" + l]?.length; j++) {
                let nextIndex = Object.values(Class).length+(Math.floor(Math.random()*100000));
                Class[fixedWeapon["UPGRADES_TIER_" + l][i] + Class[fixedBody]["UPGRADES_TIER_" + l][j]] = combineTanks(fixedWeapon["UPGRADES_TIER_" + l][i], Class[fixedBody]["UPGRADES_TIER_" + l][j], {})
                Class[fixedWeapon["UPGRADES_TIER_" + l][i] + Class[fixedBody]["UPGRADES_TIER_" + l][j]].index = nextIndex
                output["UPGRADES_TIER_" + l].push(fixedWeapon["UPGRADES_TIER_" + l][i] + Class[fixedBody]["UPGRADES_TIER_" + l][j])
            }
        }
    }
    return output
}


Class.canxADreadsAddon = makeMenu("canxA's Dreadnoughts")
Class.canxADreadsAddon.UPGRADES_TIER_0 = []
Class.menu_addons.UPGRADES_TIER_0.push('canxADreadsAddon');

function getDreadColor(sides) {
    let polygonColors = ["veryLightGrey", "gold", "orange", "purple", "hexagon", "yellow", "lavender"]
    return {BASE: polygonColors[(sides-2)%polygonColors.length], BRIGHTNESS_SHIFT: Math.floor(sides/polygonColors.length)*-4}
}
function getDreadSize(sides) {
    return ((sides**1.1)*4)+16
}
Class.CSDGenericDreadnought = {
    PARENT: "genericTank",
    SKILL_CAP: Array(10).fill(smshskl),
    REROOT_UPGRADE_TREE: ["CSDBaseDreadnoughtW", "CSDBaseDreadnoughtB"],
}
function getDreadName(sides) {
    return (sides === 0 ? "Egg" : fixPolyName(sides.toString())) + "nought"
}
function makeDreadBody(sides, buffs = {}) {
    let sidesFixed = sides
    if (sides >= 3) {
        sidesFixed = sides-2
    }
    let buffsGeneric = {
        ACCELERATION: 1,
        SPEED: 1,
        HEALTH: 1,
        RESIST: 1,
        SHIELD: 1,
        REGEN: 1,
        DAMAGE: 1,
        PENETRATION: 1,
        RANGE: 1,
        FOV: 1,
        SHOCK_ABSORB: 1,
        RECOIL_MULTIPLIER: 1,
        DENSITY: 1,
        STEALTH: 1,
        PUSHABILITY: 1,
        HETERO: 1
    }
    let buffsFixed = {...buffsGeneric, ...buffs}
    return {
        SPEED: (base.SPEED * Math.max((0.75 - (sidesFixed * 0.05)), 0.15)) * buffsFixed.SPEED,
        HEALTH: (base.HEALTH * ((sidesFixed*0.8)+1.75)) * buffsFixed.HEALTH,
        SHIELD: (base.SHIELD * (2.5+(sidesFixed*0.2))) * buffsFixed.SHIELD,
        REGEN: (base.REGEN * (1.25+((sidesFixed**0.7)*0.16))) * buffsFixed.REGEN,
        FOV: (base.FOV) * buffsFixed.FOV,
        RESIST: (base.RESIST) * buffsFixed.RESIST,
        DENSITY: (base.DENSITY * (2.5+(sidesFixed*0.25))) * buffsFixed.DENSITY,
        ACCELERATION: (base.ACCEL * Math.max((0.8 - (sidesFixed * 0.05)), 0.15)) * buffsFixed.ACCELERATION,
    }
}
function makeDreadnought(sides, labelOverride = false) {
    let sidesFixed = sides
    if (sides >= 3) {
        sidesFixed = sides-2
    }
    return {
        PARENT: "CSDGenericDreadnought",
        LABEL: labelOverride || getDreadName(sides),
        BODY: makeDreadBody(sides),
        SHAPE: sides%2 === 0 ? sides : sides+0.5,
        COLOR: sidesFixed === 0 ? 'egg' : getDreadColor(Math.abs(sides)),
        SIZE: ((sidesFixed**1.1)*4)+16,
        DANGER: 8+sidesFixed,
    }
}
for (let i = 0; i <= 20; i++) {
    if (i !== 1 && i !== 2) {
        Class["CSDGeneric" + getDreadName(i)] = makeDreadnought(i)
//        Class.canxADreadsAddon.UPGRADES_TIER_0.push("CSDGeneric" + getDreadName(i));
    }
}

Class.CSDBaseDreadnoughtW = makeDreadnought(0, "Weapon")
Class.CSDBaseDreadnoughtW.REROOT_UPGRADE_TREE = "CSDBaseDreadnoughtW"
Class.CSDBaseDreadnoughtB = {
    LABEL: "Body",
    COLOR: 'egg',
    REROOT_UPGRADE_TREE: "CSDBaseDreadnoughtB",
}
Class.canxADreadsAddon.UPGRADES_TIER_0.push("CSDBaseDreadnoughtW", "CSDBaseDreadnoughtB");

// Egg
// Weapons
Class.CSDPacifier = {
    PARENT: "CSDGenericEggnought",
    LABEL: "Pacifier",
    GUNS: weaponArray({
        POSITION: [15, 7, 1, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.basic, {speed: 0.9, maxSpeed: 0.9, health: 1.15}]),
            TYPE: "bullet",
        },
    }, 2),
}
Class.CSDInvader = {
    PARENT: "CSDGenericEggnought",
    LABEL: "Invader",
    GUNS: weaponArray({
        POSITION: [5, 9, 1.2, 8, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.drone, g.overseer, {reload: 0.85, health: 1.08, maxSpeed: 0.95}]),
            TYPE: "drone",
            MAX_CHILDREN: 4,
            AUTOFIRE: true,
            SYNCS_SKILLS: true,
            STAT_CALCULATOR: "drone",
            WAIT_TO_CYCLE: true,
        },
    }, 2),
}
Class.CSDCentaur = {
    PARENT: "CSDGenericEggnought",
    LABEL: "Centaur",
    GUNS: weaponArray([
        {
            POSITION: [13, 7, 1, 0, 0, 0, 0],
        },
        {
            POSITION: [3, 7, 1.5, 13, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, g.pounder, {health: 1.15, shudder: 0.4, speed: 0.85, range: 0.85}]),
                TYPE: "trap",
                STAT_CALCULATOR: "trap",
            },
        },
    ], 2),
}
// Bodies
Class.CSDByteTurret = {
    PARENT: "autoTankGun",
    INDEPENDENT: true,
    GUNS: [
        {
            POSITION: [22, 10, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.power, g.turret, {size: 0.9, health: 1.3, speed: 0.85, recoil: 0.8, range: 0.45}]),
                TYPE: "bullet",
            },
        },
    ],
}
Class.CSDByte = {
    PARENT: "CSDGenericEggnought",
    LABEL: "Byte",
    TURRETS: [
        {
            POSITION: [15, 0, 0, 0, 360, 1],
            TYPE: ['egg', {COLOR: 'mirror', MIRROR_MASTER_ANGLE: true}]
        },
        {
            POSITION: [9, 0, 0, 0, 360, 1],
            TYPE: 'CSDByteTurret',
        },
    ],
}
Class.CSDAtmosphereAura = makeAura(1, 1, 0.3);
Class.CSDAtmosphere = {
    PARENT: "CSDGenericEggnought",
    LABEL: "Atmosphere",
    TURRETS: [
        {
            POSITION: [14, 0, 0, 0, 360, 1],
            TYPE: ['egg', {COLOR: 'mirror', MIRROR_MASTER_ANGLE: true}]
        },
        {
            POSITION: [9, 0, 0, 0, 360, 1],
            TYPE: 'CSDAtmosphereAura',
        },
    ],
}
Class.CSDJuggernaut = {
    PARENT: "CSDGenericEggnought",
    LABEL: "Juggernaut",
    BODY: makeDreadBody(0, {HEALTH: 1.3, SPEED: 0.8}),
    TURRETS: [
        {
            POSITION: [15, 0, 0, 0, 360, 1],
            TYPE: ['egg', {COLOR: 'mirror', MIRROR_MASTER_ANGLE: true}]
        },
        {
            POSITION: [24, 0, 0, 0, 360, 0],
            TYPE: ['egg', {COLOR: 9, MIRROR_MASTER_ANGLE: true}]
        },
    ],
}

// Triangle
// Weapons
// Pacifier Upgrades
Class.CSDMediator = {
    PARENT: "CSDGenericTrinought",
    LABEL: "Mediator",
    GUNS: weaponArray({
        POSITION: [15.25, 11, 1, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.basic, {speed: 0.9, maxSpeed: 0.9, health: 1.15}, g.pounder]),
            TYPE: "bullet",
        },
    }, 3),
}
Class.CSDNegotiator = {
    PARENT: "CSDGenericTrinought",
    LABEL: "Negotiator",
    GUNS: weaponArray(weaponMirror({
        POSITION: [14, 7, 1, 0, 4, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.basic, {speed: 0.9, maxSpeed: 0.9, health: 1.15}, g.twin]),
            TYPE: "bullet",
        },
    }), 3),
}
// Invader Upgrades
Class.CSDInquisitor = {
    PARENT: "CSDGenericTrinought",
    LABEL: "Inquisitor",
    GUNS: weaponArray({
        POSITION: [5, 10, 1.4, 8, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.drone, g.overseer, {reload: 0.85, health: 1.08, maxSpeed: 0.95}, g.machineGun]),
            TYPE: "drone",
            MAX_CHILDREN: 5,
            AUTOFIRE: true,
            SYNCS_SKILLS: true,
            STAT_CALCULATOR: "drone",
            WAIT_TO_CYCLE: true,
        },
    }, 3),
}
Class.CSDAssailant = {
    PARENT: "CSDGenericTrinought",
    LABEL: "Assailant",
    GUNS: weaponArray([
        {
            POSITION: [5, 11, 1, 9, 0, 0, 0],
        },
        {
            POSITION: [2, 14, 1, 13, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.spawner, {reload: 0.85, health: 1.08, maxSpeed: 0.95, size: 0.75}]),
                TYPE: "minion",
                MAX_CHILDREN: 3,
                STAT_CALCULATOR: "drone",
                AUTOFIRE: true,
                SYNCS_SKILLS: true,
            },
        },
        {
            POSITION: [10.5, 14, 1, 0, 0, 0, 0],
        }
    ], 3),
}
// Centaur Upgrades
Class.CSDMinotaur = {
    PARENT: "CSDGenericTrinought",
    LABEL: "Minotaur",
    GUNS: weaponArray(weaponMirror([
        {
            POSITION: [12, 6, 1, 0, 5, 0, 0],
        },
        {
            POSITION: [3, 6, 1.5, 12, 5, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, g.pounder, {health: 1.15, shudder: 0.4, speed: 0.85, range: 0.85}, g.twin]),
                TYPE: "trap",
                STAT_CALCULATOR: "trap",
            },
        },
    ]), 3),
}
Class.CSDDaemon = {
    PARENT: "CSDGenericTrinought",
    LABEL: "Daemon",
    GUNS: weaponArray([
        {
            POSITION: [12, 10, 1, 0, 0, 0, 0],
        },
        {
            POSITION: [4, 10, 1.5, 12, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, g.pounder, {health: 1.15, shudder: 0.4, speed: 0.85, range: 0.85}, g.pounder]),
                TYPE: "trap",
                STAT_CALCULATOR: "trap",
            },
        },
    ], 3),
}
// Bodies
// Byte Upgrades
Class.CSDSpamAutoTurret = {
    PARENT: "autoTankGun",
    INDEPENDENT: true,
    GUNS: [
        {
            POSITION: [22, 10, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.flankGuard, g.flankGuard, g.flankGuard, g.autoTurret, {recoil: 0.125}]),
                TYPE: "bullet",
            },
        },
    ],
}
Class.CSDKilobyte = {
    PARENT: "CSDGenericTrinought",
    LABEL: "Kilobyte",
    TURRETS: [
        ...weaponArray({
            POSITION: [4, 10, 0, 60, 180, 1],
            TYPE: ["CSDSpamAutoTurret", {GUN_STAT_SCALE: {reload: 0.9, health: 1.2}}],
        }, 3),
        {
            POSITION: [9, 0, 0, 60, 360, 1],
            TYPE: ['triangle', {COLOR: 'mirror', MIRROR_MASTER_ANGLE: true}]
        },
    ],
}
Class.CSDUnitTurret = {
    PARENT: "autoTankGun",
    INDEPENDENT: true,
    GUNS: [
        {
            POSITION: [26, 10, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.power, g.turret, g.assassin, {size: 0.9, health: 1.39, speed: 0.63, recoil: 1.25, range: 0.5}]),
                TYPE: "bullet",
            },
        },
    ],
}
Class.CSDUnit = {
    PARENT: "CSDGenericTrinought",
    LABEL: "Unit",
    TURRETS: [
        {
            POSITION: [14.5, 0, 0, 60, 360, 1],
            TYPE: ['triangle', {COLOR: 'mirror', MIRROR_MASTER_ANGLE: true}]
        },
        {
            POSITION: [10.5, 0, 0, 0, 360, 1],
            TYPE: 'CSDUnitTurret',
        },
    ],
}

// Atmosphere Upgrades
Class.CSDCoronaAura = makeAura(1.15, 0.8, 0.4);
Class.CSDCorona = {
    PARENT: "CSDGenericTrinought",
    LABEL: "Corona",
    TURRETS: [
        {
            POSITION: [14, 0, 0, 60, 360, 1],
            TYPE: ['triangle', {COLOR: 'mirror', MIRROR_MASTER_ANGLE: true}]
        },
        {
            POSITION: [10, 0, 0, 0, 360, 1],
            TYPE: 'CSDCoronaAura',
        },
    ],
}
Class.CSDThermosphereAura = makeAura(-1, 1.5, 0.25);
Class.CSDThermosphere = {
    PARENT: "CSDGenericTrinought",
    LABEL: "Thermosphere",
    TURRETS: [
        {
            POSITION: [14, 0, 0, 60, 360, 1],
            TYPE: ['triangle', {COLOR: 'mirror', MIRROR_MASTER_ANGLE: true}]
        },
        {
            POSITION: [10, 0, 0, 0, 360, 1],
            TYPE: 'CSDThermosphereAura',
        },
    ],
}
// Juggernaut Upgrades
Class.CSDColossus = {
    PARENT: "CSDGenericTrinought",
    LABEL: "Colossus",
    BODY: makeDreadBody(3, {DAMAGE: 0.9, HEALTH: 1.5, SPEED: 0.7}),
    TURRETS: [
        {
            POSITION: [13, 0, 0, 60, 360, 1],
            TYPE: ['triangle', {COLOR: 'mirror', MIRROR_MASTER_ANGLE: true}]
        },
        {
            POSITION: [26, 0, 0, 60, 360, 0],
            TYPE: ['triangle', {COLOR: 9, MIRROR_MASTER_ANGLE: true}]
        },
    ],
}
Class.CSDJunket = {
    PARENT: "CSDGenericTrinought",
    LABEL: "Junket",
    BODY: makeDreadBody(3, {DAMAGE: 1.3, HEALTH: 0.9, SPEED: 0.7}),
    TURRETS: [
        {
            POSITION: [13, 0, 0, 60, 360, 1],
            TYPE: ['triangle', {COLOR: 'mirror', MIRROR_MASTER_ANGLE: true}]
        },
        {
            POSITION: [23, 0, 0, 60, 360, 0],
            TYPE: ['triangle', {COLOR: 9, MIRROR_MASTER_ANGLE: true}]
        },
        ...weaponArray({
            POSITION: [13, -8, 0, 0, 360, 0],
            TYPE: ['triangle', {COLOR: 9, MIRROR_MASTER_ANGLE: true}]
        }, 3),
    ],
}

// Square
// Weapons
// Mediator Upgrades
Class.CSDExecutor = {
    PARENT: "CSDGenericTetranought",
    LABEL: "Executor",
    GUNS: weaponArray([
        {
            POSITION: [6, 6, 1.4, 8, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.artillery, g.artillery, g.skimmer, {reload: 1.1, health: 1.35, speed: 0.7, maxSpeed: 0.65, range: 0.33}]),
                TYPE: ["missile", {GUN_STAT_SCALE: {recoil: 0.6}}],
                STAT_CALCULATOR: "sustained",
            },
        },
        {
            POSITION: [12, 9, 1, 0, 0, 0, 0],
        },
    ], 4),
}
Class.CSDEnforcer = {
    PARENT: "CSDGenericTetranought",
    LABEL: "Enforcer",
    GUNS: weaponArray({
        POSITION: [13, 11, 1, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.basic, {speed: 0.9, maxSpeed: 0.9, health: 1.15}, g.pounder, g.destroyer]),
            TYPE: "bullet",
        },
    }, 4),
}
// Negotiator Upgrades
Class.CSDAppeaser = {
    PARENT: "CSDGenericTetranought",
    LABEL: "Appeaser",
    GUNS: weaponArray([
        {
            POSITION: [12, 6, 1, 0, 4, 0, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, {speed: 0.9, maxSpeed: 0.9, health: 1.15}, g.twin, g.triplet]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [12, 6, 1, 0, -4, 0, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, {speed: 0.9, maxSpeed: 0.9, health: 1.15}, g.twin, g.triplet]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [14, 6, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, {speed: 0.9, maxSpeed: 0.9, health: 1.15}, g.twin, g.triplet]),
                TYPE: "bullet",
            },
        },
    ], 4),
}
Class.CSDSword = {
    PARENT: "CSDGenericTetranought",
    LABEL: "Sword",
    GUNS: weaponArray([
        {
            POSITION: [15.5, 7, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, {speed: 0.9, maxSpeed: 0.9, health: 1.15}, g.twin, g.minigun]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [14, 7, 1, 0, 0, 0, 0.25],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, {speed: 0.9, maxSpeed: 0.9, health: 1.15}, g.twin, g.minigun]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [12.5, 7, 1, 0, 0, 0, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, {speed: 0.9, maxSpeed: 0.9, health: 1.15}, g.twin, g.minigun]),
                TYPE: "bullet",
            },
        },
    ], 4),
}
// Inquisitor Upgrades
Class.CSDInfiltrator = {
    PARENT: "CSDGenericTetranought",
    LABEL: "Infiltrator",
    GUNS: weaponArray({
        POSITION: [4, 12, 1.2, 8, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.drone, g.overseer, {reload: 0.85, health: 1.08, maxSpeed: 0.95}]),
            TYPE: "drone",
            MAX_CHILDREN: 3,
            AUTOFIRE: true,
            SYNCS_SKILLS: true,
            STAT_CALCULATOR: "drone",
            WAIT_TO_CYCLE: true,
        },
    }, 4),
}
Class.CSDInterrogator = {
    PARENT: "CSDGenericTetranought",
    LABEL: "Interrogator",
    GUNS: [
        ...weaponArray(weaponMirror(
            {
                POSITION: [4, 5, -1.3, 8, 4, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.swarm, {reload: 0.85, health: 1.08, maxSpeed: 0.95}]),
                    TYPE: "swarm",
                    SYNCS_SKILLS: true,
                    STAT_CALCULATOR: "drone",
                    WAIT_TO_CYCLE: true,
                },
            },
        ), 2),
        ...weaponArray(weaponMirror(
            {
                POSITION: [4, 5, -1.3, 8, 4, 90, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.swarm, {reload: 0.85, health: 1.08, maxSpeed: 0.95}]),
                    TYPE: "autoswarm",
                    SYNCS_SKILLS: true,
                    STAT_CALCULATOR: "drone",
                    WAIT_TO_CYCLE: true,
                },
            },
        ), 2),
    ]
}
// Assailant Upgrades
Class.CSDAggressorMinion = {
    PARENT: "minion",
    SHAPE: 3.5,
    GUNS: weaponArray({
        POSITION: [16, 8.5, 1, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.basic, g.assassin, g.minionGun, {speed: 1.06, maxSpeed: 1.06, reload: 1.75, health: 1.25}]),
            WAIT_TO_CYCLE: true,
            TYPE: "bullet",
        },
    }, 3),
}
Class.CSDAggressor = {
    PARENT: "CSDGenericTetranought",
    LABEL: "Aggressor",
    GUNS: weaponArray([
        {
            POSITION: [5, 10, -1.2, 7, 0, 0, 0],
        },
        {
            POSITION: [1.5, 12, 1, 12, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.spawner, {reload: 0.85, health: 1.08, maxSpeed: 0.95, size: 0.75}]),
                TYPE: "CSDAggressorMinion",
                MAX_CHILDREN: 2,
                STAT_CALCULATOR: "drone",
                AUTOFIRE: true,
                SYNCS_SKILLS: true,
            },
        },
        {
            POSITION: [2.5, 12, -1.3, 8, 0, 0, 0],
        }
    ], 4),
}
Class.CSDMugger = {
    PARENT: "CSDGenericTetranought",
    LABEL: "Mugger",
    GUNS: weaponArray([
        {
            POSITION: [5, 11, 1, 9, 0, 0, 0],
        },
        {
            POSITION: [1.5, 14, 1, 13, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.spawner, {reload: 0.85, health: 1.08, maxSpeed: 0.95, size: 1.25}, { reload: 1.5, recoil: 1.3, damage: 1.5, speed: 0.975, maxSpeed: 0.9, density: 1.25, resist: 1.075 }]),
                TYPE: "minion",
                MAX_CHILDREN: 1,
                STAT_CALCULATOR: "drone",
                AUTOFIRE: true,
                SYNCS_SKILLS: true,
            },
        },
        {
            POSITION: [11, 14, 1, 0, 0, 0, 0],
        }
    ], 4),
}
// Minotaur Upgrades
Class.CSDHydra = {
    PARENT: "CSDGenericTetranought",
    LABEL: "Hydra",
    GUNS: weaponArray([
        ...weaponMirror([
            {
                POSITION: [11, 4, 1, 0, 5, 0, 0],
            },
            {
                POSITION: [2, 4, 1.5, 11, 5, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.trap, g.pounder, {health: 1.15, shudder: 0.4, speed: 0.85, range: 0.85}, g.twin, g.triplet]),
                    TYPE: "trap",
                    STAT_CALCULATOR: "trap",
                },
            },
        ]),
        {
            POSITION: [12, 4, 1, 0, 0, 0, 0.25],
        },
        {
            POSITION: [2, 4, 1.5, 12, 0, 0, 0.25],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, g.pounder, {health: 1.15, shudder: 0.4, speed: 0.85, range: 0.85}, g.twin, g.triplet]),
                TYPE: "trap",
                STAT_CALCULATOR: "trap",
            },
        },
    ], 4),
}
Class.CSDChargedTrap = {
    PARENT: "trap",
    INDEPENDENT: true,
    GUNS: weaponArray([
        {
            POSITION: [0, 7, 0, 0, 0, 0, 9999],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, g.machineGun, g.twin, {spray: 0}]),
                TYPE: ["trap", {PERSISTS_AFTER_DEATH: true}],
                STAT_CALCULATOR: "trap",
                SHOOT_ON_DEATH: true,
            }
        }
    ], 3),
    TURRETS: [
        {
            POSITION: [6, 0, 0, 0, 360, 1],
            TYPE: ["genericTank", {COLOR: "grey"}],
        },
    ],
}
Class.CSDVagary = {
    PARENT: "CSDGenericTetranought",
    LABEL: "Vagary",
    GUNS: weaponArray([
        {
            POSITION: [12, 9, 1, 0, 0, 0, 0],
        },
        {
            POSITION: [4, 9, 1.5, 12, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, g.pounder, {health: 1.15, shudder: 0.4, speed: 0.85, range: 0.85}, {reload: 1.5, range: 0.25}]),
                TYPE: "CSDChargedTrap",
                STAT_CALCULATOR: "trap",
            },
        },
        {
            POSITION: [4, 9, 0.01, 12, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, g.pounder, {health: 1.15, shudder: 0.4, speed: 0.85, range: 0.85}, {reload: 1.5, range: 0.25}, g.fake]),
                TYPE: "bullet",
                STAT_CALCULATOR: "trap",
            },
        },
    ], 4),
}
// Daemon Upgrades
Class.CSDAutoTrapTurret = makeTurret({
    GUNS: [
        {
            POSITION: [22, 10, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.power, { recoil: 1.15 }, g.turret, {recoil: 0}]),
                TYPE: "bullet",
            },
        },
    ],
}, {label: "Turret", fov: 0.8, extraStats: []})
Class.CSDAutoTrap = makeAuto("trap", "Auto-Trap", {type: "CSDAutoTrapTurret"})
Class.CSDBeelzebub = {
    PARENT: "CSDGenericTetranought",
    LABEL: "Beelzebub",
    GUNS: weaponArray([
        {
            POSITION: [13, 9, 1, 0, 0, 0, 0],
        },
        {
            POSITION: [3, 9, 1.5, 13, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, g.pounder, {health: 1.15, shudder: 0.4, speed: 0.85, range: 0.85}, {reload: 1.35}]),
                TYPE: "CSDAutoTrap",
                STAT_CALCULATOR: "trap",
            },
        },
        {
            POSITION: [11, 11, 1, 0, 0, 0, 0],
        },
    ], 4),
}
Class.CSDWraith = {
    PARENT: "CSDGenericTetranought",
    LABEL: "Wraith",
    GUNS: weaponArray([
        {
            POSITION: [12, 12.5, 1, 0, 0, 0, 0],
        },
        {
            POSITION: [5, 12.5, 1.5, 12, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, g.pounder, {health: 1.15, shudder: 0.4, speed: 0.85, range: 0.85}, g.pounder, {reload: 1.3, damage: 1.4, health: 1.2, speed: 0.8}]),
                TYPE: "trap",
                STAT_CALCULATOR: "trap",
            },
        },
    ], 4),
}
// Bodies
// Kilobyte Upgrades
Class.CSDMegabyte = {
    PARENT: "CSDGenericTetranought",
    LABEL: "Megabyte",
    TURRETS: [
        ...weaponArray({
            POSITION: [3, 9, 0, 45, 180, 1],
            TYPE: ["CSDSpamAutoTurret", {GUN_STAT_SCALE: {reload: 0.9, health: 1.2}}],
        }, 4),
        ...weaponArray({
            POSITION: [3, 6.85, 0, 0, 180, 1],
            TYPE: ["CSDSpamAutoTurret", {GUN_STAT_SCALE: {reload: 0.9, health: 1.2}}],
        }, 4),
        {
            POSITION: [10, 0, 0, 0, 360, 1],
            TYPE: ['square', {COLOR: 'mirror', MIRROR_MASTER_ANGLE: true}]
        },
    ],
}
// Unit Upgrades
Class.CSDSegmentTurret = {
    PARENT: "autoTankGun",
    INDEPENDENT: true,
    GUNS: [
        {
            POSITION: [26, 13, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.power, g.turret, g.assassin, g.pounder, {size: 0.85, health: 1.31, speed: 0.62, recoil: 1.4, range: 0.52}]),
                TYPE: "bullet",
            },
        },
    ],
}
Class.CSDSegment = {
    PARENT: "CSDGenericTetranought",
    LABEL: "Segment",
    TURRETS: [
        {
            POSITION: [15, 0, 0, 0, 360, 1],
            TYPE: ['square', {COLOR: 'mirror', MIRROR_MASTER_ANGLE: true}]
        },
        {
            POSITION: [12, 0, 0, 0, 360, 1],
            TYPE: 'CSDSegmentTurret',
        },
    ],
}
Class.CSDAgentTurret = {
    PARENT: "autoTankGun",
    INDEPENDENT: true,
    GUNS: [
        {
            POSITION: [4, 8, 1.2, 22, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.pounder, g.artillery, g.artillery, g.skimmer, {reload: 1.2, health: 1.35, speed: 0.7, maxSpeed: 0.65, range: 0.45}]),
                TYPE: "minimissile",
            },
        },
        {
            POSITION: [24, 10, 1, 0, 0, 0, 0],
        },
    ],
}
Class.CSDAgent = {
    PARENT: "CSDGenericTetranought",
    LABEL: "Agent",
    TURRETS: [
        {
            POSITION: [14.5, 0, 0, 0, 360, 1],
            TYPE: ['square', {COLOR: 'mirror', MIRROR_MASTER_ANGLE: true}]
        },
        {
            POSITION: [10.5, 0, 0, 0, 360, 1],
            TYPE: 'CSDAgentTurret',
        },
    ],
}
// Corona Upgrades
Class.CSDChromosphereAura = makeAura(1.3, 0.6, 0.5);
Class.CSDChromosphere = {
    PARENT: "CSDGenericTetranought",
    LABEL: "Chromosphere",
    TURRETS: [
        {
            POSITION: [14, 0, 0, 0, 360, 1],
            TYPE: ['square', {COLOR: 'mirror', MIRROR_MASTER_ANGLE: true}]
        },
        {
            POSITION: [12, 0, 0, 0, 360, 1],
            TYPE: 'CSDChromosphereAura',
        },
    ],
}
Class.CSDFusion = {
    PARENT: "CSDGenericTetranought",
    LABEL: "Fusion",
    TURRETS: [
        ...weaponArray({
            POSITION: [3, 9.5, 0, 45, 180, 1],
            TYPE: ["CSDSpamAutoTurret", {GUN_STAT_SCALE: {reload: 0.9, health: 1.2}}],
        }, 4),
        {
            POSITION: [11, 0, 0, 0, 360, 1],
            TYPE: ['square', {COLOR: 'mirror', MIRROR_MASTER_ANGLE: true}]
        },
        {
            POSITION: [9, 0, 0, 0, 360, 1],
            TYPE: 'CSDCoronaAura',
        },
    ],
}
// purely to make the upgrade tree look better
Class.CSDFusion2 = {
    PARENT: "CSDGenericTetranought",
    LABEL: "Fusion",
    TURRETS: [
        ...weaponArray({
            POSITION: [3, 9.5, 0, 45, 180, 1],
            TYPE: ["CSDSpamAutoTurret", {GUN_STAT_SCALE: {reload: 0.9, health: 1.2}}],
        }, 4),
        {
            POSITION: [11, 0, 0, 0, 360, 1],
            TYPE: ['square', {COLOR: 'mirror', MIRROR_MASTER_ANGLE: true}]
        },
        {
            POSITION: [9, 0, 0, 0, 360, 1],
            TYPE: 'CSDCoronaAura',
        },
    ],
}
// Thermosphere Upgrades
Class.CSDMesosphereAura = makeAura(-1.15, 1.4, 0.275);
Class.CSDMesosphere = {
    PARENT: "CSDGenericTetranought",
    LABEL: "Mesosphere",
    TURRETS: [
        {
            POSITION: [14, 0, 0, 0, 360, 1],
            TYPE: ['square', {COLOR: 'mirror', MIRROR_MASTER_ANGLE: true}]
        },
        {
            POSITION: [10, 0, 0, 0, 360, 1],
            TYPE: 'CSDMesosphereAura',
        },
    ],
}
// Colossus Upgrades
Class.CSDGoliath = {
    PARENT: "CSDGenericTetranought",
    LABEL: "Goliath",
    BODY: makeDreadBody(4, {DAMAGE: 0.8, HEALTH: 2, SPEED: 0.6}),
    TURRETS: [
        {
            POSITION: [14, 0, 0, 0, 360, 1],
            TYPE: ['square', {COLOR: 9, MIRROR_MASTER_ANGLE: true}]
        },
        {
            POSITION: [10, 0, 0, 0, 360, 1],
            TYPE: ['square', {COLOR: 'mirror', MIRROR_MASTER_ANGLE: true}]
        },
        {
            POSITION: [28, 0, 0, 0, 360, 0],
            TYPE: ['square', {COLOR: 9, MIRROR_MASTER_ANGLE: true}]
        },
    ],
}
Class.CSDMoon = {
    PARENT: "CSDGenericTetranought",
    LABEL: "Moon",
    BODY: makeDreadBody(4, {DAMAGE: 0.9, HEALTH: 1.5, SPEED: 0.7}),
    TURRETS: [
        {
            POSITION: [13, 0, 0, 0, 360, 1],
            TYPE: ['square', {COLOR: 'mirror', MIRROR_MASTER_ANGLE: true}]
        },
        {
            POSITION: [10, 0, 0, 0, 360, 1],
            TYPE: 'CSDThermosphereAura',
        },
        {
            POSITION: [26, 0, 0, 0, 360, 0],
            TYPE: ['square', {COLOR: 9, MIRROR_MASTER_ANGLE: true}]
        },
    ],
}
// Junket Upgrades
Class.CSDPinCushion = {
    PARENT: "CSDGenericTetranought",
    LABEL: "Pin Cushion",
    BODY: makeDreadBody(4, {DAMAGE: 1.6, HEALTH: 0.7, SPEED: 0.6}),
    TURRETS: [
        {
            POSITION: [14, 0, 0, 45, 360, 1],
            TYPE: ['square', {COLOR: 9, MIRROR_MASTER_ANGLE: true}]
        },
        {
            POSITION: [13, 0, 0, 0, 360, 1],
            TYPE: ['square', {COLOR: 'mirror', MIRROR_MASTER_ANGLE: true}]
        },
        {
            POSITION: [23, 0, 0, 0, 360, 0],
            TYPE: ['square', {COLOR: 9, MIRROR_MASTER_ANGLE: true}]
        },
        ...weaponArray({
            POSITION: [13, -7, 0, 45, 360, 0],
            TYPE: ['square', {COLOR: 9, MIRROR_MASTER_ANGLE: true}]
        }, 4),
    ],
}
Class.CSDAsteroid = {
    PARENT: "CSDGenericTetranought",
    LABEL: "Asteroid",
    BODY: makeDreadBody(4, {DAMAGE: 1.3, HEALTH: 0.6, SPEED: 1.225}),
    TURRETS: [
        {
            POSITION: [14, 0, 0, 45, 360, 1],
            TYPE: ['square', {COLOR: 'mirror', MIRROR_MASTER_ANGLE: true}]
        },
        {
            POSITION: [23, 0, 0, 0, 360, 0],
            TYPE: ['square', {COLOR: 9, MIRROR_MASTER_ANGLE: true}]
        },
        ...weaponArray({
            POSITION: [15, -5, 0, 45, 360, 0],
            TYPE: ['square', {COLOR: 9, MIRROR_MASTER_ANGLE: true}]
        }, 4),
    ],
}

// Pentagon
// Weapons
// Executor Upgrades
Class.CSDInhibitorMissile = {
    PARENT: "bullet",
    LABEL: "Missile",
    INDEPENDENT: true,
    BODY: { RANGE: 120 },
    GUNS: [
        {
            POSITION: [14, 6, 1, 0, -2, 130, 0],
            PROPERTIES: {
                AUTOFIRE: true,
                SHOOT_SETTINGS: combineStats([g.basic, g.lowPower, {speed: 1.3, maxSpeed: 1.3}]),
                TYPE: [ "bullet", { PERSISTS_AFTER_DEATH: true } ],
                STAT_CALCULATOR: "thruster",
                WAIT_TO_CYCLE: true,
            }
        },
        {
            POSITION: [14, 6, 1, 0, 2, 230, 0],
            PROPERTIES: {
                AUTOFIRE: true,
                SHOOT_SETTINGS: combineStats([g.basic, g.lowPower, {speed: 1.3, maxSpeed: 1.3}]),
                TYPE: [ "bullet", { PERSISTS_AFTER_DEATH: true } ],
                STAT_CALCULATOR: "thruster",
                WAIT_TO_CYCLE: true,
            }
        },
        {
            POSITION: [14, 6, 1, 0, 0, 180, 0.5],
            PROPERTIES: {
                AUTOFIRE: true,
                SHOOT_SETTINGS: combineStats([g.basic, g.lowPower, {speed: 1.3, maxSpeed: 1.3}]),
                TYPE: [ "bullet", { PERSISTS_AFTER_DEATH: true } ],
                STAT_CALCULATOR: "thruster",
                WAIT_TO_CYCLE: true,
            }
        }
    ]
}
Class.CSDInhibitor = {
    PARENT: "CSDGenericPentanought",
    LABEL: "Inhibitor",
    GUNS: weaponArray([
        {
            POSITION: [6, 6, 1.4, 8, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.artillery, g.artillery, g.skimmer, {reload: 1.2, health: 1.45, damage: 1.15, speed: 0.7, maxSpeed: 0.8, range: 0.33}]),
                TYPE: ["CSDInhibitorMissile", {GUN_STAT_SCALE: {recoil: 0.6}}],
                STAT_CALCULATOR: "sustained",
            },
        },
        {
            POSITION: [12.5, 9, 1, 0, 0, 0, 0],
        },
    ], 5),
}
Class.CSDInterceptionMissile = {
    PARENT: "bullet",
    LABEL: "Missile",
    INDEPENDENT: true,
    BODY: { RANGE: 120 },
    FACING_TYPE: ["spin", {speed: 0.2}],
    GUNS: weaponArray({
        POSITION: [14, 8, 1, 0, 0, 0, 0.5],
        PROPERTIES: {
            AUTOFIRE: !0,
            SHOOT_SETTINGS: combineStats([g.basic, g.lowPower, {reload: 0.6, size: 1.1, shudder: 0.3}]),
            TYPE: ["bullet", { PERSISTS_AFTER_DEATH: true }],
            STAT_CALCULATOR: "thruster",
            WAIT_TO_CYCLE: true,
        },
    }, 2),
}
Class.CSDInterception = {
    PARENT: "CSDGenericPentanought",
    LABEL: "Interception",
    GUNS: weaponArray([
        {
            POSITION: [6, 6, 1.3, 8, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.artillery, g.artillery, g.skimmer, {reload: 1.1, health: 1.35, speed: 0.7, maxSpeed: 0.65, range: 0.33}, { speed: 0.6, reload: 4/3, shudder: 0.1, }]),
                TYPE: ["CSDInterceptionMissile", {GUN_STAT_SCALE: {recoil: 0.6}}],
                STAT_CALCULATOR: "sustained",
            },
        },
        {
            POSITION: [12.75, 9, -1.8, 0, 0, 0, 0],
        },
    ], 5),
}
// Enforcer Upgrades
Class.CSDSuppressor = {
    PARENT: "CSDGenericPentanought",
    LABEL: "Suppressor",
    GUNS: weaponArray({
        POSITION: [13, 11, 1, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.basic, {speed: 0.9, maxSpeed: 0.9, health: 1.15}, g.pounder, g.destroyer, {reload: 1.2, damage: 1.4, speed: 0.8, health: 1.5}]),
            TYPE: "bullet",
        },
    }, 5),
}
// Appeaser Upgrades
Class.CSDArbitrator = {
    PARENT: "CSDGenericPentanought",
    LABEL: "Arbitrator",
    GUNS: weaponArray([
        {
            POSITION: [12, 5, 1, 0, 4, 0, 2/3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, {speed: 0.9, maxSpeed: 0.9, health: 1.15}, g.twin, g.triplet, {reload: 1.1, damage: 0.9}]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [12, 5, 1, 0, -4, 0, 2/3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, {speed: 0.9, maxSpeed: 0.9, health: 1.15}, g.twin, g.triplet, {reload: 1.1, damage: 0.9}]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [13, 5, 1, 0, 2, 0, 1/3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, {speed: 0.9, maxSpeed: 0.9, health: 1.15}, g.twin, g.triplet, {reload: 1.1, damage: 0.9}]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [13, 5, 1, 0, -2, 0, 1/3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, {speed: 0.9, maxSpeed: 0.9, health: 1.15}, g.twin, g.triplet, {reload: 1.1, damage: 0.9}]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [14, 5, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, {speed: 0.9, maxSpeed: 0.9, health: 1.15}, g.twin, g.triplet, {reload: 1.1, damage: 0.9}]),
                TYPE: "bullet",
            },
        },
    ], 5),
}
// Sword Upgrades
Class.CSDSabre = {
    PARENT: "CSDGenericPentanought",
    LABEL: "Sabre",
    GUNS: weaponArray([
        {
            POSITION: [18.5, 6, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, {speed: 0.9, maxSpeed: 0.9, health: 1.15}, g.twin, g.minigun, g.streamliner]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [17, 6, 1, 0, 0, 0, 0.15],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, {speed: 0.9, maxSpeed: 0.9, health: 1.15}, g.twin, g.minigun, g.streamliner]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [15.5, 6, 1, 0, 0, 0, 0.3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, {speed: 0.9, maxSpeed: 0.9, health: 1.15}, g.twin, g.minigun, g.streamliner]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [14, 6, 1, 0, 0, 0, 0.45],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, {speed: 0.9, maxSpeed: 0.9, health: 1.15}, g.twin, g.minigun, g.streamliner]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [12.5, 6, 1, 0, 0, 0, 0.6],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, {speed: 0.9, maxSpeed: 0.9, health: 1.15}, g.twin, g.minigun, g.streamliner]),
                TYPE: "bullet",
            },
        },
    ], 5),
}
Class.CSDGladius = {
    PARENT: "CSDGenericPentanought",
    LABEL: "Gladius",
    GUNS: weaponArray([
        {
            POSITION: [12, 5, 1, 0, 3, 0, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, {speed: 0.9, maxSpeed: 0.9, health: 1.15}, g.twin, g.triplet]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [12, 5, 1, 0, -3, 0, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, {speed: 0.9, maxSpeed: 0.9, health: 1.15}, g.twin, g.triplet]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [15.5, 5, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, {speed: 0.9, maxSpeed: 0.9, health: 1.15}, g.twin, g.minigun, g.triplet]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [14, 5, 1, 0, 0, 0, 0.25],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, {speed: 0.9, maxSpeed: 0.9, health: 1.15}, g.twin, g.minigun, g.triplet]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [12.5, 5, 1, 0, 0, 0, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, {speed: 0.9, maxSpeed: 0.9, health: 1.15}, g.twin, g.minigun, g.triplet]),
                TYPE: "bullet",
            },
        },
    ], 5),
}
// Infiltrator Upgrades
Class.CSDRaider = {
    PARENT: "CSDGenericPentanought",
    LABEL: "Raider",
    GUNS: weaponArray({
        POSITION: [4, 12, 1.1, 8, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.drone, g.overseer, {reload: 0.85, health: 1.08, maxSpeed: 0.95}, {reload: 1.2, damage: 1.5, maxSpeed: 0.8}]),
            TYPE: "drone",
            MAX_CHILDREN: 2,
            AUTOFIRE: true,
            SYNCS_SKILLS: true,
            STAT_CALCULATOR: "drone",
            WAIT_TO_CYCLE: true,
        },
    }, 5),
}
// Interrogator Upgrades
Class.CSDAnalyst = {
    PARENT: "CSDGenericPentanought",
    LABEL: "Analyst",
    GUNS: [
        ...weaponArray([
            ...weaponMirror(
                {
                    POSITION: [3, 4, -1.3, 8, 3, 0, 0],
                    PROPERTIES: {
                        SHOOT_SETTINGS: combineStats([g.swarm, {reload: 0.85, health: 1.08, maxSpeed: 0.95}, g.triplet]),
                        TYPE: "swarm",
                        SYNCS_SKILLS: true,
                        STAT_CALCULATOR: "drone",
                        WAIT_TO_CYCLE: true,
                    },
                },
            ),
            {
                POSITION: [3, 4, -1.3, 9.5, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.swarm, {reload: 0.85, health: 1.08, maxSpeed: 0.95}, g.triplet]),
                    TYPE: "swarm",
                    SYNCS_SKILLS: true,
                    STAT_CALCULATOR: "drone",
                    WAIT_TO_CYCLE: true,
                },
            },
        ], 5),
    ]
}
Class.CSDProber = {
    PARENT: "CSDGenericPentanought",
    LABEL: "Prober",
    GUNS: [
        ...weaponArray({
            POSITION: [3, 6, -1.3, 9, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.swarm, {reload: 0.85, health: 1.08, maxSpeed: 0.95}, g.pounder]),
                TYPE: "swarm",
                SYNCS_SKILLS: true,
                STAT_CALCULATOR: "drone",
                WAIT_TO_CYCLE: true,
            },
        }, 5),
    ]
}
// Aggressor Upgrades
Class.CSDProvokerMinion = {
    PARENT: "minion",
    SHAPE: 4,
    GUNS: weaponArray({
        POSITION: [16, 8.5, 1, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.basic, g.assassin, g.minionGun, {speed: 1.06, maxSpeed: 1.06, reload: 1.75, health: 1.25}]),
            WAIT_TO_CYCLE: true,
            TYPE: "bullet",
        },
    }, 4),
}
Class.CSDProvoker = {
    PARENT: "CSDGenericPentanought",
    LABEL: "Provoker",
    GUNS: weaponArray([
        {
            POSITION: [5, 10, -1.2, 7, 0, 0, 0],
        },
        {
            POSITION: [1.5, 12, 1.2, 13, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.spawner, {reload: 0.85, health: 1.08, maxSpeed: 0.95, size: 0.75}]),
                TYPE: "CSDProvokerMinion",
                MAX_CHILDREN: 2,
                STAT_CALCULATOR: "drone",
                AUTOFIRE: true,
                SYNCS_SKILLS: true,
            },
        },
        {
            POSITION: [2.5, 12, 0.9, 12, 0, 0, 0],
        },
        {
            POSITION: [2.5, 12, -1.2, 8, 0, 0, 0],
        }
    ], 5),
}
// Mugger Upgrades
Class.CSDLarcenist = {
    PARENT: "CSDGenericPentanought",
    LABEL: "Larcenist",
    GUNS: weaponArray([
        {
            POSITION: [5, 11, 1, 9, 0, 0, 0],
        },
        {
            POSITION: [1.5, 13, 1, 13, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.spawner, {reload: 0.85, health: 1.08, maxSpeed: 0.95, size: 1.375}, { reload: 1.5, recoil: 1.3, damage: 1.5, speed: 0.975, maxSpeed: 0.9, density: 1.25, resist: 1.075 }, { reload: 1.5, recoil: 1.3, damage: 1.5, speed: 0.975, maxSpeed: 0.9, density: 1.25, resist: 1.075 }]),
                TYPE: "minion",
                MAX_CHILDREN: 1,
                STAT_CALCULATOR: "drone",
                AUTOFIRE: true,
                SYNCS_SKILLS: true,
            },
        },
        {
            POSITION: [11, 13, 1, 0, 0, 0, 0],
        }
    ], 5),
}
Class.CSDGladiatorMinion = {
    PARENT: "minion",
    SHAPE: 3.5,
    GUNS: weaponArray({
        POSITION: [16, 10, 1, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.basic, g.assassin, g.minionGun, {speed: 1.06, maxSpeed: 1.06, reload: 1.75, health: 1.25}, {reload: 1.2, damage: 1.2, health: 1.1, speed: 0.8}]),
            WAIT_TO_CYCLE: true,
            TYPE: "bullet",
        },
    }, 3),
}
Class.CSDGladiator = {
    PARENT: "CSDGenericPentanought",
    LABEL: "Gladiator",
    GUNS: weaponArray([
        {
            POSITION: [5, 10.5, -1.1, 7, 0, 0, 0],
        },
        {
            POSITION: [1.5, 11, 1, 12, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.spawner, {reload: 0.85, health: 1.08, maxSpeed: 0.95}, {health: 1.2, speed: 0.9, maxSpeed: 0.8}]),
                TYPE: "CSDGladiatorMinion",
                MAX_CHILDREN: 2,
                STAT_CALCULATOR: "drone",
                AUTOFIRE: true,
                SYNCS_SKILLS: true,
            },
        },
        {
            POSITION: [2.5, 12, -1.2, 8, 0, 0, 0],
        }
    ], 5),
}
// Hydra Upgrades
Class.CSDCerberus = {
    PARENT: "CSDGenericPentanought",
    LABEL: "Cerberus",
    GUNS: weaponArray([
        {
            POSITION: [11, 2, 1, 0, 4.5, 0, 0],
        },
        {
            POSITION: [1.5, 2, 1.5, 11, 4.5, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, g.pounder, {health: 1.15, shudder: 0.4, speed: 0.85, range: 0.85}, g.twin, g.triplet, {reload: 1.15, damage: 0.9, pen: 0.8}]),
                TYPE: "trap",
                STAT_CALCULATOR: "trap",
            },
        },
        {
            POSITION: [11, 2, 1, 0, -4.5, 0, 0.5],
        },
        {
            POSITION: [1.5, 2, 1.5, 11, -4.5, 0, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, g.pounder, {health: 1.15, shudder: 0.4, speed: 0.85, range: 0.85}, g.twin, g.triplet, {reload: 1.15, damage: 0.9, pen: 0.8}]),
                TYPE: "trap",
                STAT_CALCULATOR: "trap",
            },
        },
        {
            POSITION: [12, 2, 1, 0, 1.75, 0, 0.25],
        },
        {
            POSITION: [1.5, 2, 1.5, 12, 1.75, 0, 0.25],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, g.pounder, {health: 1.15, shudder: 0.4, speed: 0.85, range: 0.85}, g.twin, g.triplet, {reload: 1.15, damage: 0.9, pen: 0.8}]),
                TYPE: "trap",
                STAT_CALCULATOR: "trap",
            },
        },
        {
            POSITION: [12, 2, 1, 0, -1.75, 0, 0.75],
        },
        {
            POSITION: [1.5, 2, 1.5, 12, -1.75, 0, 0.75],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, g.pounder, {health: 1.15, shudder: 0.4, speed: 0.85, range: 0.85}, g.twin, g.triplet, {reload: 1.15, damage: 0.9, pen: 0.8}]),
                TYPE: "trap",
                STAT_CALCULATOR: "trap",
            },
        },
    ], 5),
}
// Vagary Upgrades
Class.CSDMiniChargedTrap = {
    PARENT: "trap",
    INDEPENDENT: true,
    GUNS: weaponArray([
        {
            POSITION: [0, 7, 0, 0, 0, 0, 9999],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, g.machineGun, g.twin, {spray: 0}]),
                TYPE: ["trap", {PERSISTS_AFTER_DEATH: true}],
                STAT_CALCULATOR: "trap",
                SHOOT_ON_DEATH: true,
            }
        }
    ], 2),
    TURRETS: [
        {
            POSITION: [3, 0, 0, 0, 360, 1],
            TYPE: ["genericTank", {COLOR: "grey"}],
        },
    ],
}
Class.CSDCrotchet = {
    PARENT: "CSDGenericPentanought",
    LABEL: "Crotchet",
    GUNS: weaponArray([
        ...weaponMirror([
            {
                POSITION: [12, 5, 1, 0, 4, 0, 0],
            },
            {
                POSITION: [2.5, 5, 1.5, 12, 4, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.trap, g.pounder, {health: 1.15, shudder: 0.4, speed: 0.85, range: 0.85}, {reload: 1.5, range: 0.25}]),
                    TYPE: "CSDMiniChargedTrap",
                    STAT_CALCULATOR: "trap",
                },
            },
            {
                POSITION: [2.5, 3, 0.01, 12, 4, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.trap, g.pounder, {health: 1.15, shudder: 0.4, speed: 0.85, range: 0.85}, {reload: 1.5, range: 0.25}, g.fake]),
                    TYPE: "bullet",
                    STAT_CALCULATOR: "trap",
                },
            },
        ]),
    ], 5),
}
Class.CSDMegaChargedTrap = {
    PARENT: "trap",
    INDEPENDENT: true,
    GUNS: weaponArray([
        {
            POSITION: [0, 7, 0, 0, 0, 0, 9999],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, g.machineGun, g.twin, {spray: 0}]),
                TYPE: ["trap", {PERSISTS_AFTER_DEATH: true}],
                STAT_CALCULATOR: "trap",
                SHOOT_ON_DEATH: true,
            }
        }
    ], 4),
    TURRETS: [
        {
            POSITION: [10, 0, 0, 0, 360, 1],
            TYPE: ["genericTank", {COLOR: "grey"}],
        },
    ],
}
Class.CSDPhantasma = {
    PARENT: "CSDGenericPentanought",
    LABEL: "Phantasma",
    GUNS: weaponArray([
        {
            POSITION: [12, 9, 1, 0, 0, 0, 0],
        },
        {
            POSITION: [4, 9, 1.5, 12, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, g.pounder, {health: 1.15, shudder: 0.4, speed: 0.85, range: 0.85}, {reload: 1.7, health: 0.8, range: 0.25}]),
                TYPE: "CSDMegaChargedTrap",
                STAT_CALCULATOR: "trap",
            },
        },
        {
            POSITION: [4, 9, 0.01, 12, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, g.pounder, {health: 1.15, shudder: 0.4, speed: 0.85, range: 0.85}, {reload: 1.7, health: 0.8, range: 0.25}, g.fake]),
                TYPE: "bullet",
                STAT_CALCULATOR: "trap",
            },
        },
        {
            POSITION: [2, 4.5, -0.01, 12, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, g.pounder, {health: 1.15, shudder: 0.4, speed: 0.85, range: 0.85}, {reload: 1.7, health: 0.8, range: 0.25}, g.fake]),
                TYPE: "bullet",
                STAT_CALCULATOR: "trap",
            },
        },
    ], 5),
}
// Beelzebub Upgrades
Class.CSDTwinAutoTrapTurret = makeTurret({
    GUNS: [
        {
            POSITION: [20, 6, 1, 0, -5, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.power, { recoil: 1.15 }, g.turret, {recoil: 0}, g.twin]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [20, 6, 1, 0, 5, 0, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.power, { recoil: 1.15 }, g.turret, {recoil: 0}, g.twin]),
                TYPE: "bullet",
            },
        },
    ],
}, {label: "Turret", fov: 0.8, extraStats: []})
Class.CSDTwinAutoTrap = makeAuto("trap", "Twin Auto-Trap", {type: "CSDTwinAutoTrapTurret"})
Class.CSDFiend = {
    PARENT: "CSDGenericPentanought",
    LABEL: "Fiend",
    GUNS: weaponArray([
        {
            POSITION: [15, 10, 1, 0, 0, 0, 0],
        },
        {
            POSITION: [13, 8, 1, 0, 0, 0, 0],
        },
        {
            POSITION: [3, 8, 1.5, 13, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, g.pounder, {health: 1.15, shudder: 0.4, speed: 0.85, range: 0.85}, {reload: 1.55}]),
                TYPE: "CSDTwinAutoTrap",
                STAT_CALCULATOR: "trap",
            },
        },
        {
            POSITION: [11, 11, 1, 0, 0, 0, 0],
        },
    ], 5),
}
// Wraith Upgrades
Class.CSDLucifer = {
    PARENT: "CSDGenericPentanought",
    LABEL: "Lucifer",
    GUNS: weaponArray([
        {
            POSITION: [12, 13, 1, 0, 0, 0, 0],
        },
        {
            POSITION: [6, 13, 1.5, 12, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, g.pounder, {health: 1.15, shudder: 0.4, speed: 0.85, range: 0.85}, g.pounder, g.destroyer, {size: 1.5}]),
                TYPE: "trap",
                STAT_CALCULATOR: "trap",
            },
        },
    ], 5),
}
Class.CSDPhantom = {
    PARENT: "CSDGenericPentanought",
    LABEL: "Phantom",
    GUNS: weaponArray([
        {
            POSITION: [13, 10, 1, 0, 0, 0, 0],
        },
        {
            POSITION: [3, 10, 1.5, 13, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, g.pounder, {health: 1.15, shudder: 0.4, speed: 0.85, range: 0.85}, {reload: 1.3}, {reload: 1.3, damage: 1.4, health: 1.2, speed: 0.8}]),
                TYPE: "CSDAutoTrap",
                STAT_CALCULATOR: "trap",
            },
        },
        {
            POSITION: [11, 11, 1, 0, 0, 0, 0],
        },
    ], 5),
}
// Bodies
// Megabyte Upgrades
Class.CSDGigabyte = {
    PARENT: "CSDGenericPentanought",
    LABEL: "Gigabyte",
    TURRETS: [
        ...weaponArray({
            POSITION: [3, 9, 0, 36, 180, 1],
            TYPE: ["CSDSpamAutoTurret", {GUN_STAT_SCALE: {reload: 0.9, health: 1.2}}],
        }, 5),
        ...weaponArray({
            POSITION: [3, 7.35, 0, 0, 180, 1],
            TYPE: ["CSDSpamAutoTurret", {GUN_STAT_SCALE: {reload: 0.9, health: 1.2}}],
        }, 5),
        {
            POSITION: [10, 0, 0, 36, 360, 1],
            TYPE: ['pentagon', {COLOR: 'mirror', MIRROR_MASTER_ANGLE: true}]
        },
        {
            POSITION: [4, 0, 0, 0, 180, 1],
            TYPE: ["CSDSpamAutoTurret", {GUN_STAT_SCALE: {reload: 0.9, health: 1.2}}],
        }
    ],
}
// Segment Upgrades
Class.CSDSectorTurret = {
    PARENT: "autoTankGun",
    INDEPENDENT: true,
    GUNS: [
        {
            POSITION: [26, 16, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.power, g.turret, g.assassin, g.pounder, g.destroyer, {size: 0.75, health: 1.24, speed: 0.9, recoil: 1.4, range: 0.9}]),
                TYPE: "bullet",
            },
        },
    ],
}
Class.CSDSector = {
    PARENT: "CSDGenericPentanought",
    LABEL: "Sector",
    TURRETS: [
        {
            POSITION: [16, 0, 0, 36, 360, 1],
            TYPE: ['pentagon', {COLOR: 'mirror', MIRROR_MASTER_ANGLE: true}]
        },
        {
            POSITION: [13, 0, 0, 0, 360, 1],
            TYPE: 'CSDSectorTurret',
        },
    ],
}
// Agent Upgrades
Class.CSDAbettorTurretMissile = {
    PARENT: "missile",
    GUNS: [
        {
            POSITION: [16.5, 8, 1.5, 0, 0, 180, 3],
            PROPERTIES: {
                AUTOFIRE: true,
                SHOOT_SETTINGS: combineStats([g.basic, g.missileTrail, g.rocketeerMissileTrail, g.lowPower]),
                TYPE: ["bullet", { PERSISTS_AFTER_DEATH: true }],
                STAT_CALCULATOR: "thruster",
            },
        },
    ],
}
Class.CSDAbettorTurret = {
    PARENT: "autoTankGun",
    INDEPENDENT: true,
    GUNS: [
        {
            POSITION: [3, 9, 1.2, 23, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.pounder, g.artillery, g.artillery, g.skimmer, {reload: 1.2, health: 1.35, speed: 0.7, maxSpeed: 0.65, range: 0.45}]),
                TYPE: "CSDAbettorTurretMissile",
            },
        },
        {
            POSITION: [24, 14, 0.7, 0, 0, 0, 0],
        },
    ],
}
Class.CSDAbettor = {
    PARENT: "CSDGenericPentanought",
    LABEL: "Abettor",
    TURRETS: [
        {
            POSITION: [14.5, 0, 0, 36, 360, 1],
            TYPE: ['pentagon', {COLOR: 'mirror', MIRROR_MASTER_ANGLE: true}]
        },
        {
            POSITION: [11, 0, 0, 0, 360, 1],
            TYPE: 'CSDAbettorTurret',
        },
    ],
}
Class.CSDBrokerTurret = {
    PARENT: "autoTankGun",
    INDEPENDENT: true,
    GUNS: [
        {
            POSITION: [4, 10, 1.2, 22, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.pounder, g.artillery, g.artillery, g.skimmer, {reload: 1.2, health: 1.35, speed: 0.7, maxSpeed: 0.65, range: 0.45}, {reload: 1.2, damage: 1.5, health: 1.2, maxSpeed: 0.7, speed: 1.2}]),
                TYPE: "missile",
            },
        },
        {
            POSITION: [24, 12, 1, 0, 0, 0, 0],
        },
    ],
}
Class.CSDBroker = {
    PARENT: "CSDGenericPentanought",
    LABEL: "Broker",
    TURRETS: [
        {
            POSITION: [14.5, 0, 0, 36, 360, 1],
            TYPE: ['pentagon', {COLOR: 'mirror', MIRROR_MASTER_ANGLE: true}]
        },
        {
            POSITION: [11.5, 0, 0, 0, 360, 1],
            TYPE: 'CSDBrokerTurret',
        },
    ],
}
// Chromosphere Upgrades
Class.CSDPhotosphere = {
    PARENT: "CSDGenericPentanought",
    LABEL: "Photosphere",
    TURRETS: [
        ...weaponArray({
            POSITION: [2.2, 9.75, 0, 36, 180, 1],
            TYPE: ["CSDAtmosphereAura", {GUN_STAT_SCALE: {reload: 0.9, health: 1.2}}],
        }, 5),
        {
            POSITION: [14, 0, 0, 36, 360, 1],
            TYPE: ['pentagon', {COLOR: 'mirror', MIRROR_MASTER_ANGLE: true}]
        },
        {
            POSITION: [12, 0, 0, 0, 360, 1],
            TYPE: 'CSDChromosphereAura',
        },
    ],
}
// Fusion Upgrades
Class.CSDSupernovaAura = makeAura(1.2, 0.6, 0.5);
Class.CSDSupernova = {
    PARENT: "CSDGenericPentanought",
    LABEL: "Supernova",
    TURRETS: [
        ...weaponArray({
            POSITION: [3, 9.5, 0, 36, 180, 1],
            TYPE: ["CSDSpamAutoTurret", {GUN_STAT_SCALE: {reload: 0.9, health: 1.2}}],
        }, 5),
        {
            POSITION: [13, 0, 0, 36, 360, 1],
            TYPE: ['pentagon', {COLOR: 'mirror', MIRROR_MASTER_ANGLE: true}]
        },
        {
            POSITION: [10.25, 0, 0, 0, 360, 1],
            TYPE: 'CSDSupernovaAura',
        },
    ],
}
Class.CSDSpammierAutoTurret = {
    PARENT: "autoTankGun",
    INDEPENDENT: true,
    GUNS: [
        {
            POSITION: [20, 8, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.flankGuard, g.flankGuard, g.flankGuard, g.autoTurret, g.autoTurret, {recoil: 0.125}]),
                TYPE: "bullet",
            },
        },
    ],
}
Class.CSDMixture = {
    PARENT: "CSDGenericPentanought",
    LABEL: "Mixture",
    TURRETS: [
        ...weaponArray({
            POSITION: [2.5, 9.4, 0, 36, 180, 1],
            TYPE: ["CSDSpammierAutoTurret", {GUN_STAT_SCALE: {reload: 0.9, health: 1.2}}],
        }, 5),
        ...weaponArray({
            POSITION: [2.5, 7.8, 0, 0, 180, 1],
            TYPE: ["CSDSpammierAutoTurret", {GUN_STAT_SCALE: {reload: 0.9, health: 1.2}}],
        }, 5),
        {
            POSITION: [13, 0, 0, 36, 360, 1],
            TYPE: ['pentagon', {COLOR: 'mirror', MIRROR_MASTER_ANGLE: true}]
        },
        {
            POSITION: [9.75, 0, 0, 0, 360, 1],
            TYPE: 'CSDCoronaAura',
        },
    ],
}
// Mesosphere Upgrades
Class.CSDStratosphereAura = makeAura(-1, 1.5, 0.25)
Class.CSDStratosphere = {
    PARENT: "CSDGenericPentanought",
    LABEL: "Stratosphere",
    TURRETS: [
        {
            POSITION: [14, 0, 0, 36, 360, 1],
            TYPE: ['pentagon', {COLOR: 'mirror', MIRROR_MASTER_ANGLE: true}]
        },
        {
            POSITION: [12, 0, 0, 0, 360, 1],
            TYPE: 'CSDStratosphereAura',
        },
    ],
}
// Goliath Upgrades
Class.CSBehemoth = {
    PARENT: "CSDGenericPentanought",
    LABEL: "Behemoth",
    BODY: makeDreadBody(5, {DAMAGE: 0.4, HEALTH: 2.5, SPEED: 0.35}),
    TURRETS: [
        {
            POSITION: [17, 0, 0, 36, 360, 1],
            TYPE: ['pentagon', {COLOR: 9, MIRROR_MASTER_ANGLE: true}]
        },
        {
            POSITION: [12, 0, 0, 36, 360, 1],
            TYPE: ['pentagon', {COLOR: 'mirror', MIRROR_MASTER_ANGLE: true}]
        },
        {
            POSITION: [30, 0, 0, 36, 360, 0],
            TYPE: ['pentagon', {COLOR: 9, MIRROR_MASTER_ANGLE: true}]
        },
    ],
}
// Moon Upgrades
Class.CSDGrandiose = {
    PARENT: "CSDGenericPentanought",
    LABEL: "Grandiose",
    BODY: makeDreadBody(5, {DAMAGE: 0.9, HEALTH: 1.5, SPEED: 0.7}),
    TURRETS: [
        {
            POSITION: [13, 0, 0, 36, 360, 1],
            TYPE: ['pentagon', {COLOR: 'mirror', MIRROR_MASTER_ANGLE: true}]
        },
        {
            POSITION: [11, 0, 0, 0, 360, 1],
            TYPE: 'CSDMesosphereAura',
        },
        {
            POSITION: [26, 0, 0, 36, 360, 0],
            TYPE: ['pentagon', {COLOR: 9, MIRROR_MASTER_ANGLE: true}]
        },
    ],
}
Class.CSDPlanet = {
    PARENT: "CSDGenericPentanought",
    LABEL: "Planet",
    BODY: makeDreadBody(5, {DAMAGE: 0.8, HEALTH: 2, SPEED: 0.6}),
    TURRETS: [
        {
            POSITION: [15, 0, 0, 36, 360, 1],
            TYPE: ['pentagon', {COLOR: 9, MIRROR_MASTER_ANGLE: true}]
        },
        {
            POSITION: [13, 0, 0, 36, 360, 1],
            TYPE: ['pentagon', {COLOR: 'mirror', MIRROR_MASTER_ANGLE: true}]
        },
        {
            POSITION: [10, 0, 0, 0, 360, 1],
            TYPE: 'CSDThermosphereAura',
        },
        {
            POSITION: [28, 0, 0, 36, 360, 0],
            TYPE: ['pentagon', {COLOR: 9, MIRROR_MASTER_ANGLE: true}]
        },
    ],
}
// Pin Cushion Upgrades
Class.CSDAcumination = {
    PARENT: "CSDGenericPentanought",
    LABEL: "Acumination",
    BODY: makeDreadBody(5, {DAMAGE: 1.6, HEALTH: 0.7, SPEED: 0.6}),
    TURRETS: [
        {
            POSITION: [14, 0, 0, 0, 360, 1],
            TYPE: ['pentagon', {COLOR: 9, MIRROR_MASTER_ANGLE: true}]
        },
        {
            POSITION: [13, 0, 0, 36, 360, 1],
            TYPE: ['pentagon', {COLOR: 'mirror', MIRROR_MASTER_ANGLE: true}]
        },
        {
            POSITION: [23, 0, 0, 36, 360, 0],
            TYPE: ['pentagon', {COLOR: 9, MIRROR_MASTER_ANGLE: true}]
        },
        ...weaponArray([
            {
                POSITION: [5, 10, -4, 45, 360, 0],
                TYPE: ['square', {COLOR: 9, MIRROR_MASTER_ANGLE: true}]
            },
            {
                POSITION: [5, 10, 4, -45, 360, 0],
                TYPE: ['square', {COLOR: 9, MIRROR_MASTER_ANGLE: true}]
            },
            {
                POSITION: [5, 6.25, 6.25, -45, 360, 0],
                TYPE: ['square', {COLOR: 9, MIRROR_MASTER_ANGLE: true}]
            }
        ], 5),
    ],
}
// Asteroid Upgrades
Class.CSDBolide = {
    PARENT: "CSDGenericPentanought",
    LABEL: "Bolide",
    BODY: makeDreadBody(5, {DAMAGE: 1.3, HEALTH: 0.4, SPEED: 1.5}),
    TURRETS: [
        {
            POSITION: [16, 0, 0, 0, 360, 1],
            TYPE: ['pentagon', {COLOR: 'mirror', MIRROR_MASTER_ANGLE: true}]
        },
        {
            POSITION: [10, 0, 0, 36, 360, 1],
            TYPE: ['pentagon', {COLOR: 'mirror', MIRROR_MASTER_ANGLE: true}]
        },
        {
            POSITION: [23, 0, 0, 36, 360, 0],
            TYPE: ['pentagon', {COLOR: 9, MIRROR_MASTER_ANGLE: true}]
        },
        ...weaponArray({
            POSITION: [11, -7, 0, 0, 360, 0],
            TYPE: ['square', {COLOR: 9, MIRROR_MASTER_ANGLE: true}]
        }, 5),
    ],
}
Class.CSDMeteor = {
    PARENT: "CSDGenericPentanought",
    LABEL: "Meteor",
    BODY: makeDreadBody(5, {DAMAGE: 1.4, HEALTH: 0.45, SPEED: 1.15}),
    TURRETS: [
        {
            POSITION: [16, 0, 0, 36, 360, 1],
            TYPE: ['pentagon', {COLOR: 9, MIRROR_MASTER_ANGLE: true}]
        },
        {
            POSITION: [16, 0, 0, 0, 360, 1],
            TYPE: ['pentagon', {COLOR: 'mirror', MIRROR_MASTER_ANGLE: true}]
        },
        {
            POSITION: [23, 0, 0, 36, 360, 0],
            TYPE: ['pentagon', {COLOR: 9, MIRROR_MASTER_ANGLE: true}]
        },
        ...weaponArray({
            POSITION: [14.75, -5, 0, 0, 360, 0],
            TYPE: ['pentagon', {COLOR: 9, MIRROR_MASTER_ANGLE: true}]
        }, 5),
    ],
}
// Hexagon
// Weapons
// Upgrades
Class.CSDTyrantMissile = {
    PARENT: "bullet",
    LABEL: "Missile",
    INDEPENDENT: true,
    BODY: { RANGE: 120 },
    GUNS: [
        {
            POSITION: [14, 6, 1, 0, -2, 130, 0],
            PROPERTIES: {
                AUTOFIRE: true,
                SHOOT_SETTINGS: combineStats([g.basic, g.lowPower, {speed: 1.3, maxSpeed: 1.3}]),
                TYPE: [ "bullet", { PERSISTS_AFTER_DEATH: true } ],
                STAT_CALCULATOR: "thruster",
                WAIT_TO_CYCLE: true,
            }
        },
        {
            POSITION: [14, 6, 1, 0, 2, 230, 0],
            PROPERTIES: {
                AUTOFIRE: true,
                SHOOT_SETTINGS: combineStats([g.basic, g.lowPower, {speed: 1.3, maxSpeed: 1.3}]),
                TYPE: [ "bullet", { PERSISTS_AFTER_DEATH: true } ],
                STAT_CALCULATOR: "thruster",
                WAIT_TO_CYCLE: true,
            }
        },
        {
            POSITION: [14, 6, 1, 0, 2, 200, 0.5],
            PROPERTIES: {
                AUTOFIRE: true,
                SHOOT_SETTINGS: combineStats([g.basic, g.lowPower, {speed: 1.3, maxSpeed: 1.3}]),
                TYPE: [ "bullet", { PERSISTS_AFTER_DEATH: true } ],
                STAT_CALCULATOR: "thruster",
                WAIT_TO_CYCLE: true,
            }
        },
        {
            POSITION: [14, 6, 1, 0, -2, -200, 0.5],
            PROPERTIES: {
                AUTOFIRE: true,
                SHOOT_SETTINGS: combineStats([g.basic, g.lowPower, {speed: 1.3, maxSpeed: 1.3}]),
                TYPE: [ "bullet", { PERSISTS_AFTER_DEATH: true } ],
                STAT_CALCULATOR: "thruster",
                WAIT_TO_CYCLE: true,
            }
        }
    ]
}
Class.CSDTyrant = {
    PARENT: "CSDGenericHexanought",
    LABEL: "Tyrant",
    GUNS: weaponArray([
        {
            POSITION: [6, 6, 1.4, 8, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.artillery, g.artillery, g.skimmer, {reload: 1.2, health: 1.45, damage: 1.15, speed: 0.7, maxSpeed: 0.8, range: 0.33}]),
                TYPE: ["CSDTyrantMissile", {GUN_STAT_SCALE: {recoil: 0.6}}],
                STAT_CALCULATOR: "sustained",
            },
        },
        {
            POSITION: [12.5, 9, 1, 0, 0, 0, 0],
        },
    ], 6),
}
Class.CSDObviationMissile = {
    PARENT: "bullet",
    LABEL: "Missile",
    INDEPENDENT: true,
    BODY: { RANGE: 120 },
    FACING_TYPE: ["spin", {speed: 0.2}],
    GUNS: weaponArray({
        POSITION: [14, 8, 1, 0, 0, 0, 0.5],
        PROPERTIES: {
            AUTOFIRE: !0,
            SHOOT_SETTINGS: combineStats([g.basic, g.lowPower, {reload: 0.6, size: 1.1, shudder: 0.3}]),
            TYPE: ["bullet", { PERSISTS_AFTER_DEATH: true }],
            STAT_CALCULATOR: "thruster",
            WAIT_TO_CYCLE: true,
        },
    }, 3),
}
Class.CSDObviation = {
    PARENT: "CSDGenericHexanought",
    LABEL: "Obviation",
    GUNS: weaponArray([
        {
            POSITION: [6, 6, 1.3, 8, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.artillery, g.artillery, g.skimmer, {reload: 1.1, health: 1.35, speed: 0.7, maxSpeed: 0.65, range: 0.33}, { speed: 0.6, reload: 4/3, shudder: 0.1, }]),
                TYPE: ["CSDObviationMissile", {GUN_STAT_SCALE: {recoil: 0.6}}],
                STAT_CALCULATOR: "sustained",
            },
        },
        {
            POSITION: [12.75, 9, -1.8, 0, 0, 0, 0],
        },
    ], 6),
}
Class.CSDRetardant = {
    PARENT: "CSDGenericHexanought",
    LABEL: "Retardant",
    GUNS: weaponArray({
        POSITION: [13, 10.9, 1, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.basic, {speed: 0.9, maxSpeed: 0.9, health: 1.15}, g.pounder, g.destroyer, {reload: 1.2, damage: 1.4, speed: 0.8, health: 1.5}, {reload: 1.25, damage: 1.25, pen: 1.2, speed: 0.8, spray: 0.5}]),
            TYPE: "bullet",
        },
    }, 6),
}
Class.CSDMitigator = {
    PARENT: "CSDGenericHexanought",
    LABEL: "Mitigator",
    GUNS: weaponArray([
        {
            POSITION: [12, 3, 1, 0, 3.5, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, {speed: 0.9, maxSpeed: 0.9, health: 1.15}, g.twin, g.triplet, {reload: 1.1, damage: 0.9}]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [12, 3, 1, 0, -3.5, 0, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, {speed: 0.9, maxSpeed: 0.9, health: 1.15}, g.twin, g.triplet, {reload: 1.1, damage: 0.9}]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [13, 3, 1, 0, 2.75, 0, 0.2],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, {speed: 0.9, maxSpeed: 0.9, health: 1.15}, g.twin, g.triplet, {reload: 1.1, damage: 0.9}]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [13, 3, 1, 0, -2.75, 0, 0.7],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, {speed: 0.9, maxSpeed: 0.9, health: 1.15}, g.twin, g.triplet, {reload: 1.1, damage: 0.9}]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [14, 3, 1, 0, 2, 0, 0.4],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, {speed: 0.9, maxSpeed: 0.9, health: 1.15}, g.twin, g.triplet, {reload: 1.1, damage: 0.9}]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [14, 3, 1, 0, -2, 0, 0.9],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, {speed: 0.9, maxSpeed: 0.9, health: 1.15}, g.twin, g.triplet, {reload: 1.1, damage: 0.9}]),
                TYPE: "bullet",
            },
        },
    ], 6),
}
Class.CSDBayonet = {
    PARENT: "CSDGenericHexanought",
    LABEL: "Bayonet",
    GUNS: weaponArray([
        {
            POSITION: [20, 6, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, {speed: 0.9, maxSpeed: 0.9, health: 1.15}, g.twin, g.minigun, g.streamliner, {reload: 1.2, damage: 0.8, speed: 1.225, maxSpeed: 1.5}]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [18.75, 6, 1, 0, 0, 0, 0.1],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, {speed: 0.9, maxSpeed: 0.9, health: 1.15}, g.twin, g.minigun, g.streamliner, {reload: 1.2, damage: 0.8, speed: 1.225, maxSpeed: 1.5}]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [17.5, 6, 1, 0, 0, 0, 0.2],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, {speed: 0.9, maxSpeed: 0.9, health: 1.15}, g.twin, g.minigun, g.streamliner, {reload: 1.2, damage: 0.8, speed: 1.225, maxSpeed: 1.5}]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [16.25, 6, 1, 0, 0, 0, 0.3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, {speed: 0.9, maxSpeed: 0.9, health: 1.15}, g.twin, g.minigun, g.streamliner, {reload: 1.2, damage: 0.8, speed: 1.225, maxSpeed: 1.5}]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [15, 6, 1, 0, 0, 0, 0.4],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, {speed: 0.9, maxSpeed: 0.9, health: 1.15}, g.twin, g.minigun, g.streamliner, {reload: 1.2, damage: 0.8, speed: 1.225, maxSpeed: 1.5}]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [13.75, 6, 1, 0, 0, 0, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, {speed: 0.9, maxSpeed: 0.9, health: 1.15}, g.twin, g.minigun, g.streamliner, {reload: 1.2, damage: 0.8, speed: 1.225, maxSpeed: 1.5}]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [12.5, 6, 1, 0, 0, 0, 0.6],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, {speed: 0.9, maxSpeed: 0.9, health: 1.15}, g.twin, g.minigun, g.streamliner, {reload: 1.2, damage: 0.8, speed: 1.225, maxSpeed: 1.5}]),
                TYPE: "bullet",
            },
        },
    ], 6),
}
Class.CSDBlade = {
    PARENT: "CSDGenericHexanought",
    LABEL: "Blade",
    GUNS: weaponArray([
        {
            POSITION: [12, 5, 1, 0, 3, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, {speed: 0.9, maxSpeed: 0.9, health: 1.15}, g.twin, g.triplet]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [12, 5, 1, 0, -3, 0, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, {speed: 0.9, maxSpeed: 0.9, health: 1.15}, g.twin, g.triplet]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [13, 5, 1, 0, 2, 0, 0.25],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, {speed: 0.9, maxSpeed: 0.9, health: 1.15}, g.twin, g.triplet]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [13, 5, 1, 0, -2, 0, 0.75],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, {speed: 0.9, maxSpeed: 0.9, health: 1.15}, g.twin, g.triplet]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [15.5, 5, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, {speed: 0.9, maxSpeed: 0.9, health: 1.15}, g.twin, g.minigun, g.triplet]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [14, 5, 1, 0, 0, 0, 0.25],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, {speed: 0.9, maxSpeed: 0.9, health: 1.15}, g.twin, g.minigun, g.triplet]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [12.5, 5, 1, 0, 0, 0, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, {speed: 0.9, maxSpeed: 0.9, health: 1.15}, g.twin, g.minigun, g.triplet]),
                TYPE: "bullet",
            },
        },
    ], 6),
}
Class.CSDMarauder = {
    PARENT: "CSDGenericHexanought",
    LABEL: "Marauder",
    GUNS: weaponArray({
        POSITION: [4, 10, 1.1, 8, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.drone, g.overseer, {reload: 0.85, health: 1.08, maxSpeed: 0.95}, g.pounder]),
            TYPE: "drone",
            MAX_CHILDREN: 1,
            AUTOFIRE: true,
            SYNCS_SKILLS: true,
            STAT_CALCULATOR: "drone",
            WAIT_TO_CYCLE: true,
        },
    }, 6),
}
Class.CSDQuester = {
    PARENT: "CSDGenericHexanought",
    LABEL: "Quester",
    GUNS: [
        ...weaponArray([
            ...weaponMirror(
                {
                    POSITION: [3, 3, -1.3, 8.5, 3, 0, 0],
                    PROPERTIES: {
                        SHOOT_SETTINGS: combineStats([g.swarm, {reload: 0.85, health: 1.08, maxSpeed: 0.95}, g.triplet, {damage: 0.8, reload: 0.9}]),
                        TYPE: "swarm",
                        SYNCS_SKILLS: true,
                        STAT_CALCULATOR: "drone",
                        WAIT_TO_CYCLE: true,
                    },
                },
            ),
            {
                POSITION: [3, 3, -1.3, 9.5, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.swarm, {reload: 0.85, health: 1.08, maxSpeed: 0.95}, g.triplet, {damage: 0.8, reload: 0.9}]),
                    TYPE: "autoswarm",
                    SYNCS_SKILLS: true,
                    STAT_CALCULATOR: "drone",
                    WAIT_TO_CYCLE: true,
                },
            },
        ], 6),
    ]
}
Class.CSDCatechizer = {
    PARENT: "CSDGenericHexanought",
    LABEL: "Catechizer",
    GUNS: [
        ...weaponArray({
            POSITION: [3, 6.5, -1.3, 9, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.swarm, {reload: 0.85, health: 1.08, maxSpeed: 0.95}, g.pounder, {reload: 1.2, damage: 1.2, pen: 1.2, maxSpeed: 0.8}]),
                TYPE: "swarm",
                SYNCS_SKILLS: true,
                STAT_CALCULATOR: "drone",
                WAIT_TO_CYCLE: true,
            },
        }, 6),
    ]
}
Class.CSDOffenderMinion = {
    PARENT: "minion",
    SHAPE: 5.5,
    GUNS: weaponArray({
        POSITION: [16, 8.5, 1, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.basic, g.assassin, g.minionGun, {speed: 1.06, maxSpeed: 1.06, reload: 1.75, health: 1.25}]),
            WAIT_TO_CYCLE: true,
            TYPE: "bullet",
        },
    }, 5),
}
Class.CSDOffender = {
    PARENT: "CSDGenericHexanought",
    LABEL: "Offender",
    GUNS: weaponArray([
        {
            POSITION: [5, 8.25, -1.5, 7, 0, 0, 0],
        },
        {
            POSITION: [1.5, 10, 1.2, 13, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.spawner, {reload: 0.85, health: 1.08, maxSpeed: 0.95, size: 0.75}, {reload: 1.2}]),
                TYPE: "CSDOffenderMinion",
                MAX_CHILDREN: 2,
                STAT_CALCULATOR: "drone",
                AUTOFIRE: true,
                SYNCS_SKILLS: true,
            },
        },
        {
            POSITION: [2.5, 10, 0.8, 12, 0, 0, 0],
        },
        {
            POSITION: [2.5, 10, -1.2, 8, 0, 0, 0],
        }
    ], 6),
}
Class.CSDDefalcator = {
    PARENT: "CSDGenericHexanought",
    LABEL: "Defalcator",
    GUNS: weaponArray([
        {
            POSITION: [5, 10, 1, 9, 0, 0, 0],
        },
        {
            POSITION: [1.5, 11, 1, 13, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.spawner, {reload: 0.85, health: 1.08, maxSpeed: 0.95, size: 1.375}, { reload: 1.5, recoil: 1.3, damage: 1.5, speed: 0.975, maxSpeed: 0.9, density: 1.25, resist: 1.075 }, { reload: 1.5, recoil: 1.3, damage: 1.5, speed: 0.975, maxSpeed: 0.9, density: 1.25, resist: 1.075 }, { reload: 1.5, recoil: 1.3, damage: 1.5, speed: 0.975, maxSpeed: 0.9, density: 1.25, resist: 1.075 }]),
                TYPE: "minion",
                MAX_CHILDREN: 1,
                STAT_CALCULATOR: "drone",
                AUTOFIRE: true,
                SYNCS_SKILLS: true,
            },
        },
        {
            POSITION: [11, 11, 1, 0, 0, 0, 0],
        }
    ], 6),
}
Class.CSDChampionMinion = {
    PARENT: "minion",
    SHAPE: 3.5,
    GUNS: weaponArray({
        POSITION: [16, 12, 1, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.basic, g.assassin, g.minionGun, {speed: 1.06, maxSpeed: 1.06, reload: 1.75, health: 1.25}, g.pounder]),
            WAIT_TO_CYCLE: true,
            TYPE: "bullet",
        },
    }, 3),
}
Class.CSDChampion = {
    PARENT: "CSDGenericHexanought",
    LABEL: "Champion",
    GUNS: weaponArray([
        {
            POSITION: [5, 9, -1.1, 7, 0, 0, 0],
        },
        {
            POSITION: [1.5, 10, 1, 12, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.spawner, {reload: 0.85, health: 1.08, maxSpeed: 0.95}, {health: 1.2, speed: 0.9, maxSpeed: 0.8}]),
                TYPE: "CSDChampionMinion",
                MAX_CHILDREN: 1,
                STAT_CALCULATOR: "drone",
                AUTOFIRE: true,
                SYNCS_SKILLS: true,
            },
        },
        {
            POSITION: [2.5, 10, -1.2, 8, 0, 0, 0],
        }
    ], 6),
}
Class.CSDWyvern = {
    PARENT: "CSDGenericHexanought",
    LABEL: "Wyvern",
    GUNS: weaponArray([
        {
            POSITION: [11, 2, 1, 0, 4, 0, 0],
        },
        {
            POSITION: [1.5, 2, 1.5, 11, 4, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, g.pounder, {health: 1.15, shudder: 0.4, speed: 0.85, range: 0.85}, g.twin, g.triplet, {reload: 1.15, damage: 0.9, pen: 0.8}]),
                TYPE: "trap",
                STAT_CALCULATOR: "trap",
            },
        },
        {
            POSITION: [11, 2, 1, 0, -4, 0, 0.2],
        },
        {
            POSITION: [1.5, 2, 1.5, 11, -4, 0, 0.2],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, g.pounder, {health: 1.15, shudder: 0.4, speed: 0.85, range: 0.85}, g.twin, g.triplet, {reload: 1.15, damage: 0.9, pen: 0.8}]),
                TYPE: "trap",
                STAT_CALCULATOR: "trap",
            },
        },
        {
            POSITION: [12, 2, 1, 0, 2, 0, 0.4],
        },
        {
            POSITION: [1.5, 2, 1.5, 12, 2, 0, 0.4],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, g.pounder, {health: 1.15, shudder: 0.4, speed: 0.85, range: 0.85}, g.twin, g.triplet, {reload: 1.15, damage: 0.9, pen: 0.8}]),
                TYPE: "trap",
                STAT_CALCULATOR: "trap",
            },
        },
        {
            POSITION: [12, 2, 1, 0, -2, 0, 0.6],
        },
        {
            POSITION: [1.5, 2, 1.5, 12, -2, 0, 0.6],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, g.pounder, {health: 1.15, shudder: 0.4, speed: 0.85, range: 0.85}, g.twin, g.triplet, {reload: 1.15, damage: 0.9, pen: 0.8}]),
                TYPE: "trap",
                STAT_CALCULATOR: "trap",
            },
        },
        {
            POSITION: [13, 2, 1, 0, 0, 0, 0.8],
        },
        {
            POSITION: [1.5, 2, 1.5, 13, 0, 0, 0.8],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, g.pounder, {health: 1.15, shudder: 0.4, speed: 0.85, range: 0.85}, g.twin, g.triplet, {reload: 1.15, damage: 0.9, pen: 0.8}]),
                TYPE: "trap",
                STAT_CALCULATOR: "trap",
            },
        },
    ], 6),
}
Class.CSDWhim = {
    PARENT: "CSDGenericHexanought",
    LABEL: "Whim",
    GUNS: weaponArray([
        ...weaponMirror([
            {
                POSITION: [12, 4, 1, 0, 3, 0, 0],
            },
            {
                POSITION: [2, 4, 1.5, 12, 3, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.trap, g.pounder, {health: 1.15, shudder: 0.4, speed: 0.85, range: 0.85}, {reload: 1.5, range: 0.25}]),
                    TYPE: "CSDMiniChargedTrap",
                    STAT_CALCULATOR: "trap",
                },
            },
            {
                POSITION: [2, 2, 0.01, 12, 3, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.trap, g.pounder, {health: 1.15, shudder: 0.4, speed: 0.85, range: 0.85}, {reload: 1.5, range: 0.25}, g.fake]),
                    TYPE: "bullet",
                    STAT_CALCULATOR: "trap",
                },
            },
        ]),
        {
            POSITION: [13, 4, 1, 0, 0, 0, 0.25],
        },
        {
            POSITION: [2, 4, 1.5, 13, 0, 0, 0.25],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, g.pounder, {health: 1.15, shudder: 0.4, speed: 0.85, range: 0.85}, {reload: 1.5, range: 0.25}]),
                TYPE: "CSDMiniChargedTrap",
                STAT_CALCULATOR: "trap",
            },
        },
        {
            POSITION: [2, 2, 0.01, 13, 0, 0, 0.25],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, g.pounder, {health: 1.15, shudder: 0.4, speed: 0.85, range: 0.85}, {reload: 1.5, range: 0.25}, g.fake]),
                TYPE: "bullet",
                STAT_CALCULATOR: "trap",
            },
        },
    ], 6),
}
Class.CSDGigaChargedTrap = {
    PARENT: "trap",
    INDEPENDENT: true,
    GUNS: [
        ...weaponArray([
            {
                POSITION: [0, 8, 0, 0, 0, 0, 9999],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.trap, g.machineGun, g.twin, {spray: 0, damage: 1.2, range: 0.5}]),
                    TYPE: ["CSDChargedTrap", {PERSISTS_AFTER_DEATH: true}],
                    STAT_CALCULATOR: "trap",
                    SHOOT_ON_DEATH: true,
                }
            }
        ], 3),
    ],
    TURRETS: [
        {
            POSITION: [10, 0, 0, 0, 360, 1],
            TYPE: ["genericTank", {COLOR: "grey"}],
        },
        {
            POSITION: [5, 0, 0, 0, 360, 1],
            TYPE: ["genericTank", {COLOR: "grey"}],
        },
    ],
}
Class.CSDNightmare = {
    PARENT: "CSDGenericHexanought",
    LABEL: "Nightmare",
    GUNS: weaponArray([
        {
            POSITION: [12, 9, 1, 0, 0, 0, 0],
        },
        {
            POSITION: [4, 9, 1.5, 12, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, g.pounder, {health: 1.15, shudder: 0.4, speed: 0.85, range: 0.85}, {reload: 1.7, health: 0.8, range: 0.25}, {reload: 1.4, damage: 1.4, health: 0.8}]),
                TYPE: "CSDGigaChargedTrap",
                STAT_CALCULATOR: "trap",
            },
        },
        {
            POSITION: [4, 3, 0.01, 12, 3, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, g.pounder, {health: 1.15, shudder: 0.4, speed: 0.85, range: 0.85}, {reload: 1.7, health: 0.8, range: 0.25}, {reload: 1.4, damage: 1.4, health: 0.8}, g.fake]),
                TYPE: "bullet",
                STAT_CALCULATOR: "trap",
            },
        },
        {
            POSITION: [4, 3, 0.01, 12, -3, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, g.pounder, {health: 1.15, shudder: 0.4, speed: 0.85, range: 0.85}, {reload: 1.7, health: 0.8, range: 0.25}, {reload: 1.4, damage: 1.4, health: 0.8}, g.fake]),
                TYPE: "bullet",
                STAT_CALCULATOR: "trap",
            },
        },
        {
            POSITION: [4, 9, 0.01, 12, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, g.pounder, {health: 1.15, shudder: 0.4, speed: 0.85, range: 0.85}, {reload: 1.7, health: 0.8, range: 0.25}, {reload: 1.4, damage: 1.4, health: 0.8}, g.fake]),
                TYPE: "bullet",
                STAT_CALCULATOR: "trap",
            },
        },
        {
            POSITION: [2, 3, 0.01, 14, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, g.pounder, {health: 1.15, shudder: 0.4, speed: 0.85, range: 0.85}, {reload: 1.7, health: 0.8, range: 0.25}, {reload: 1.4, damage: 1.4, health: 0.8}, g.fake]),
                TYPE: "bullet",
                STAT_CALCULATOR: "trap",
            },
        },
        {
            POSITION: [2, 4.5, -0.01, 12, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, g.pounder, {health: 1.15, shudder: 0.4, speed: 0.85, range: 0.85}, {reload: 1.7, health: 0.8, range: 0.25}, {reload: 1.4, damage: 1.4, health: 0.8}, g.fake]),
                TYPE: "bullet",
                STAT_CALCULATOR: "trap",
            },
        },
    ], 6),
}
Class.CSDTripleAutoTrapTurret = makeTurret({
    GUNS: [
        {
            POSITION: [17, 6, 1, 0, -5, 0, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.power, { recoil: 1.15 }, g.turret, {recoil: 0}, g.twin]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [17, 6, 1, 0, 5, 0, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.power, { recoil: 1.15 }, g.turret, {recoil: 0}, g.twin]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [20, 6, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.power, { recoil: 1.15 }, g.turret, {recoil: 0}, g.twin]),
                TYPE: "bullet",
            },
        },
    ],
}, {label: "Turret", fov: 0.8, extraStats: []})
Class.CSDTripleAutoTrap = makeAuto("trap", "Triple Auto-Trap", {type: "CSDTripleAutoTrapTurret"})
Class.CSDOgre = {
    PARENT: "CSDGenericHexanought",
    LABEL: "Ogre",
    GUNS: weaponArray([
        {
            POSITION: [15, 9, 1, 0, 0, 0, 0],
        },
        {
            POSITION: [15, 8, 1, 0, 0, 0, 0],
        },
        {
            POSITION: [13, 7, 1, 0, 0, 0, 0],
        },
        {
            POSITION: [3, 7, 1.5, 13, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, g.pounder, {health: 1.15, shudder: 0.4, speed: 0.85, range: 0.85}, {reload: 1.55}]),
                TYPE: "CSDTripleAutoTrap",
                STAT_CALCULATOR: "trap",
            },
        },
        {
            POSITION: [11, 10, 1, 0, 0, 0, 0],
        },
    ], 6),
}
Class.CSDSatan = {
    PARENT: "CSDGenericHexanought",
    LABEL: "Satan",
    GUNS: weaponArray([
        {
            POSITION: [11, 10.8, 1, 0, 0, 0, 0],
        },
        {
            POSITION: [8, 10.8, 1.75, 11, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, g.pounder, {health: 1.15, shudder: 0.4, speed: 0.85, range: 0.85}, g.pounder, g.destroyer, {damage: 1.75, health: 1.5, pen: 1.675, speed: 0.75, reload: 1.5, size: 1.75}]),
                TYPE: "trap",
                STAT_CALCULATOR: "trap",
            },
        },
    ], 6),
}
Class.CSDRevenant = {
    PARENT: "CSDGenericHexanought",
    LABEL: "Revenant",
    GUNS: weaponArray([
        {
            POSITION: [13, 10, 1, 0, 0, 0, 0],
        },
        {
            POSITION: [3, 10, 1.5, 13, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, g.pounder, {health: 1.15, shudder: 0.4, speed: 0.85, range: 0.85}, {reload: 1.3}, {reload: 1.3, damage: 1.4, health: 1.2, speed: 0.8}, {reload: 1.2, damage: 1.35, health: 1.2, speed: 0.85}]),
                TYPE: "CSDAutoTrap",
                STAT_CALCULATOR: "trap",
            },
        },
        {
            POSITION: [11, 11, 1, 0, 0, 0, 0],
        },
    ], 6),
}
// Combos
// Bullets-Drones
Class.CSDGuild = {
    PARENT: "CSDGenericHexanought",
    LABEL: "Guild",
    GUNS: [
        ...weaponArray([
            {
                POSITION: [6, 5.75, 1.3, 8, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.artillery, g.artillery, g.skimmer, {reload: 1.1, health: 1.35, speed: 0.7, maxSpeed: 0.65, range: 0.33}, { speed: 0.6, reload: 4/3, shudder: 0.1, }]),
                    TYPE: ["CSDInterceptionMissile", {GUN_STAT_SCALE: {recoil: 0.6}}],
                    STAT_CALCULATOR: "sustained",
                },
            },
            {
                POSITION: [12.75, 8, -1.8, 0, 0, 0, 0],
            },
        ], 3),
        ...weaponArray([
            {
                POSITION: [5, 8.5, -1.1, 7, 0, 60, 0],
            },
            {
                POSITION: [1.5, 9, 1, 12, 0, 60, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.spawner, {reload: 0.85, health: 1.08, maxSpeed: 0.95}, {health: 1.2, speed: 0.9, maxSpeed: 0.8}]),
                    TYPE: "CSDGladiatorMinion",
                    MAX_CHILDREN: 2,
                    STAT_CALCULATOR: "drone",
                    AUTOFIRE: true,
                    SYNCS_SKILLS: true,
                },
            },
            {
                POSITION: [2.5, 10, -1.2, 8, 0, 60, 0],
            }
        ], 3),
    ]
}
Class.CSDMingler = {
    PARENT: "CSDGenericHexanought",
    LABEL: "Mingler",
    GUNS: [
        ...weaponArray([
            {
                POSITION: [6, 5.75, 1.4, 8, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.artillery, g.artillery, g.skimmer, {reload: 1.2, health: 1.45, damage: 1.15, speed: 0.7, maxSpeed: 0.8, range: 0.33}]),
                    TYPE: ["CSDInhibitorMissile", {GUN_STAT_SCALE: {recoil: 0.6}}],
                    STAT_CALCULATOR: "sustained",
                },
            },
            {
                POSITION: [12.5, 8.5, 1, 0, 0, 0, 0],
            },
        ], 3),
        ...weaponArray([
            ...weaponMirror(
                {
                    POSITION: [3, 4, -1.3, 8.75, 3, 60, 0],
                    PROPERTIES: {
                        SHOOT_SETTINGS: combineStats([g.swarm, {reload: 0.85, health: 1.08, maxSpeed: 0.95}, g.triplet]),
                        TYPE: "swarm",
                        SYNCS_SKILLS: true,
                        STAT_CALCULATOR: "drone",
                        WAIT_TO_CYCLE: true,
                    },
                },
            ),
            {
                POSITION: [3, 4, -1.3, 9.5, 0, 60, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.swarm, {reload: 0.85, health: 1.08, maxSpeed: 0.95}, g.triplet]),
                    TYPE: "swarm",
                    SYNCS_SKILLS: true,
                    STAT_CALCULATOR: "drone",
                    WAIT_TO_CYCLE: true,
                },
            },
        ], 3),
    ]
}
Class.CSDQueller = {
    PARENT: "CSDGenericHexanought",
    LABEL: "Queller",
    GUNS: [
        ...weaponArray([
            {
                POSITION: [13, 10, 1, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, {speed: 0.9, maxSpeed: 0.9, health: 1.15}, g.pounder, g.destroyer, {reload: 1.2, damage: 1.4, speed: 0.8, health: 1.5}]),
                    TYPE: "bullet",
                },
            },
        ], 3),
        ...weaponArray({
            POSITION: [3, 5, -1.3, 9, 0, 60, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.swarm, {reload: 0.85, health: 1.08, maxSpeed: 0.95}, g.pounder]),
                TYPE: "swarm",
                SYNCS_SKILLS: true,
                STAT_CALCULATOR: "drone",
                WAIT_TO_CYCLE: true,
            },
        }, 3),
    ]
}
Class.CSDAssuasive = {
    PARENT: "CSDGenericHexanought",
    LABEL: "Assuasive",
    GUNS: [
        ...weaponArray([
            {
                POSITION: [12, 5, 1, 0, 3, 0, 2/3],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, {speed: 0.9, maxSpeed: 0.9, health: 1.15}, g.twin, g.triplet, {reload: 1.1, damage: 0.9}]),
                    TYPE: "bullet",
                },
            },
            {
                POSITION: [12, 5, 1, 0, -3, 0, 2/3],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, {speed: 0.9, maxSpeed: 0.9, health: 1.15}, g.twin, g.triplet, {reload: 1.1, damage: 0.9}]),
                    TYPE: "bullet",
                },
            },
            {
                POSITION: [13, 5, 1, 0, 1.5, 0, 1/3],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, {speed: 0.9, maxSpeed: 0.9, health: 1.15}, g.twin, g.triplet, {reload: 1.1, damage: 0.9}]),
                    TYPE: "bullet",
                },
            },
            {
                POSITION: [13, 5, 1, 0, -1.5, 0, 1/3],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, {speed: 0.9, maxSpeed: 0.9, health: 1.15}, g.twin, g.triplet, {reload: 1.1, damage: 0.9}]),
                    TYPE: "bullet",
                },
            },
            {
                POSITION: [14, 5, 1, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, {speed: 0.9, maxSpeed: 0.9, health: 1.15}, g.twin, g.triplet, {reload: 1.1, damage: 0.9}]),
                    TYPE: "bullet",
                },
            },
        ], 3),
        ...weaponArray([
            {
                POSITION: [5, 10, 1, 9, 0, 60, 0],
            },
            {
                POSITION: [1.5, 11, 1, 13, 0, 60, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.spawner, {reload: 0.85, health: 1.08, maxSpeed: 0.95, size: 1.375}, { reload: 1.5, recoil: 1.3, damage: 1.5, speed: 0.975, maxSpeed: 0.9, density: 1.25, resist: 1.075 }, { reload: 1.5, recoil: 1.3, damage: 1.5, speed: 0.975, maxSpeed: 0.9, density: 1.25, resist: 1.075 }]),
                    TYPE: "minion",
                    MAX_CHILDREN: 1,
                    STAT_CALCULATOR: "drone",
                    AUTOFIRE: true,
                    SYNCS_SKILLS: true,
                },
            },
            {
                POSITION: [11, 11, 1, 0, 0, 60, 0],
            }
        ], 3),
    ]
}
Class.CSDEmissary = {
    PARENT: "CSDGenericHexanought",
    LABEL: "Emissary",
    GUNS: [
        ...weaponArray([
            {
                POSITION: [12, 5, 1, 0, 3, 0, 0.5],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, {speed: 0.9, maxSpeed: 0.9, health: 1.15}, g.twin, g.triplet]),
                    TYPE: "bullet",
                },
            },
            {
                POSITION: [12, 5, 1, 0, -3, 0, 0.5],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, {speed: 0.9, maxSpeed: 0.9, health: 1.15}, g.twin, g.triplet]),
                    TYPE: "bullet",
                },
            },
            {
                POSITION: [15.5, 5, 1, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, {speed: 0.9, maxSpeed: 0.9, health: 1.15}, g.twin, g.minigun, g.triplet]),
                    TYPE: "bullet",
                },
            },
            {
                POSITION: [14, 5, 1, 0, 0, 0, 0.25],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, {speed: 0.9, maxSpeed: 0.9, health: 1.15}, g.twin, g.minigun, g.triplet]),
                    TYPE: "bullet",
                },
            },
            {
                POSITION: [12.5, 5, 1, 0, 0, 0, 0.5],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, {speed: 0.9, maxSpeed: 0.9, health: 1.15}, g.twin, g.minigun, g.triplet]),
                    TYPE: "bullet",
                },
            },
        ], 3),
        ...weaponArray({
            POSITION: [4, 9, 1.1, 8, 0, 60, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.drone, g.overseer, {reload: 0.85, health: 1.08, maxSpeed: 0.95}, {reload: 1.2, damage: 1.5, maxSpeed: 0.8}]),
                TYPE: "drone",
                MAX_CHILDREN: 2,
                AUTOFIRE: true,
                SYNCS_SKILLS: true,
                STAT_CALCULATOR: "drone",
                WAIT_TO_CYCLE: true,
            },
        }, 3),
    ]
}
Class.CSDLance = {
    PARENT: "CSDGenericHexanought",
    LABEL: "Lance",
    GUNS: [
        ...weaponArray([
            {
                POSITION: [18.5, 6, 1, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, {speed: 0.9, maxSpeed: 0.9, health: 1.15}, g.twin, g.minigun, g.streamliner]),
                    TYPE: "bullet",
                },
            },
            {
                POSITION: [17, 6, 1, 0, 0, 0, 0.15],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, {speed: 0.9, maxSpeed: 0.9, health: 1.15}, g.twin, g.minigun, g.streamliner]),
                    TYPE: "bullet",
                },
            },
            {
                POSITION: [15.5, 6, 1, 0, 0, 0, 0.3],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, {speed: 0.9, maxSpeed: 0.9, health: 1.15}, g.twin, g.minigun, g.streamliner]),
                    TYPE: "bullet",
                },
            },
            {
                POSITION: [14, 6, 1, 0, 0, 0, 0.45],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, {speed: 0.9, maxSpeed: 0.9, health: 1.15}, g.twin, g.minigun, g.streamliner]),
                    TYPE: "bullet",
                },
            },
            {
                POSITION: [12.5, 6, 1, 0, 0, 0, 0.6],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, {speed: 0.9, maxSpeed: 0.9, health: 1.15}, g.twin, g.minigun, g.streamliner]),
                    TYPE: "bullet",
                },
            },
        ], 3),
        ...weaponArray([
            {
                POSITION: [5, 9, -1.2, 7, 0, 60, 0],
            },
            {
                POSITION: [1.5, 10, 1.2, 13, 0, 60, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.spawner, {reload: 0.85, health: 1.08, maxSpeed: 0.95, size: 0.75}]),
                    TYPE: "CSDProvokerMinion",
                    MAX_CHILDREN: 2,
                    STAT_CALCULATOR: "drone",
                    AUTOFIRE: true,
                    SYNCS_SKILLS: true,
                },
            },
            {
                POSITION: [2.5, 10, 0.9, 12, 0, 60, 0],
            },
            {
                POSITION: [2.5, 10, -1.2, 8, 0, 60, 0],
            }
        ], 3),
    ]
}

// Bullets-Traps
Class.CSDFuse = {
    PARENT: "CSDGenericHexanought",
    LABEL: "Fuse",
    GUNS: [
        ...weaponArray([
            {
                POSITION: [6, 5.75, 1.3, 8, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.artillery, g.artillery, g.skimmer, {reload: 1.1, health: 1.35, speed: 0.7, maxSpeed: 0.65, range: 0.33}, { speed: 0.6, reload: 4/3, shudder: 0.1, }]),
                    TYPE: ["CSDInterceptionMissile", {GUN_STAT_SCALE: {recoil: 0.6}}],
                    STAT_CALCULATOR: "sustained",
                },
            },
            {
                POSITION: [12.75, 8, -1.8, 0, 0, 0, 0],
            },
        ], 3),
        ...weaponArray([
            {
                POSITION: [15, 9, 1, 0, 0, 60, 0],
            },
            {
                POSITION: [13, 7.5, 1, 0, 0, 60, 0],
            },
            {
                POSITION: [3, 7.5, 1.5, 13, 0, 60, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.trap, g.pounder, {health: 1.15, shudder: 0.4, speed: 0.85, range: 0.85}, {reload: 1.55}]),
                    TYPE: "CSDTwinAutoTrap",
                    STAT_CALCULATOR: "trap",
                },
            },
            {
                POSITION: [11, 10, 1, 0, 0, 60, 0],
            },
        ], 3),
    ]
}
Class.CSDMartinet = {
    PARENT: "CSDGenericHexanought",
    LABEL: "Martinet",
    GUNS: [
        ...weaponArray([
            {
                POSITION: [6, 5.75, 1.4, 8, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.artillery, g.artillery, g.skimmer, {reload: 1.2, health: 1.45, damage: 1.15, speed: 0.7, maxSpeed: 0.8, range: 0.33}]),
                    TYPE: ["CSDInhibitorMissile", {GUN_STAT_SCALE: {recoil: 0.6}}],
                    STAT_CALCULATOR: "sustained",
                },
            },
            {
                POSITION: [12.5, 8.5, 1, 0, 0, 0, 0],
            },
        ], 3),
        ...weaponArray([
            ...weaponMirror([
                {
                    POSITION: [12, 4, 1, 0, 3.2, 60, 0],
                },
                {
                    POSITION: [2, 4, 1.5, 12, 3.25, 60, 0],
                    PROPERTIES: {
                        SHOOT_SETTINGS: combineStats([g.trap, g.pounder, {health: 1.15, shudder: 0.4, speed: 0.85, range: 0.85}, {reload: 1.5, range: 0.25}]),
                        TYPE: "CSDMiniChargedTrap",
                        STAT_CALCULATOR: "trap",
                    },
                },
                {
                    POSITION: [2, 2, 0.01, 12, 3.25, 60, 0],
                    PROPERTIES: {
                        SHOOT_SETTINGS: combineStats([g.trap, g.pounder, {health: 1.15, shudder: 0.4, speed: 0.85, range: 0.85}, {reload: 1.5, range: 0.25}, g.fake]),
                        TYPE: "bullet",
                        STAT_CALCULATOR: "trap",
                    },
                },
            ]),
        ], 3),
    ]
}
Class.CSDVisitant = {
    PARENT: "CSDGenericHexanought",
    LABEL: "Visitant",
    GUNS: [
        ...weaponArray([
            {
                POSITION: [13, 10, 1, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, {speed: 0.9, maxSpeed: 0.9, health: 1.15}, g.pounder, g.destroyer, {reload: 1.2, damage: 1.4, speed: 0.8, health: 1.5}]),
                    TYPE: "bullet",
                },
            },
        ], 3),
        ...weaponArray([
            {
                POSITION: [13, 9, 1, 0, 0, 60, 0],
            },
            {
                POSITION: [3, 9, 1.5, 13, 0, 60, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.trap, g.pounder, {health: 1.15, shudder: 0.4, speed: 0.85, range: 0.85}, {reload: 1.3}, {reload: 1.3, damage: 1.4, health: 1.2, speed: 0.8}]),
                    TYPE: "CSDAutoTrap",
                    STAT_CALCULATOR: "trap",
                },
            },
            {
                POSITION: [11, 10, 1, 0, 0, 60, 0],
            },
        ], 3),
    ]
}
Class.CSDBenign = {
    PARENT: "CSDGenericHexanought",
    LABEL: "Benign",
    GUNS: [
        ...weaponArray([
            {
                POSITION: [12, 5, 1, 0, 3, 0, 2/3],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, {speed: 0.9, maxSpeed: 0.9, health: 1.15}, g.twin, g.triplet, {reload: 1.1, damage: 0.9}]),
                    TYPE: "bullet",
                },
            },
            {
                POSITION: [12, 5, 1, 0, -3, 0, 2/3],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, {speed: 0.9, maxSpeed: 0.9, health: 1.15}, g.twin, g.triplet, {reload: 1.1, damage: 0.9}]),
                    TYPE: "bullet",
                },
            },
            {
                POSITION: [13, 5, 1, 0, 1.5, 0, 1/3],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, {speed: 0.9, maxSpeed: 0.9, health: 1.15}, g.twin, g.triplet, {reload: 1.1, damage: 0.9}]),
                    TYPE: "bullet",
                },
            },
            {
                POSITION: [13, 5, 1, 0, -1.5, 0, 1/3],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, {speed: 0.9, maxSpeed: 0.9, health: 1.15}, g.twin, g.triplet, {reload: 1.1, damage: 0.9}]),
                    TYPE: "bullet",
                },
            },
            {
                POSITION: [14, 5, 1, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, {speed: 0.9, maxSpeed: 0.9, health: 1.15}, g.twin, g.triplet, {reload: 1.1, damage: 0.9}]),
                    TYPE: "bullet",
                },
            },
        ], 3),
        ...weaponArray([
            {
                POSITION: [12, 9, 1, 0, 0, 60, 0],
            },
            {
                POSITION: [4, 9, 1.5, 12, 0, 60, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.trap, g.pounder, {health: 1.15, shudder: 0.4, speed: 0.85, range: 0.85}, {reload: 1.7, health: 0.8, range: 0.25}]),
                    TYPE: "CSDMegaChargedTrap",
                    STAT_CALCULATOR: "trap",
                },
            },
            {
                POSITION: [4, 9, 0.01, 12, 0, 60, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.trap, g.pounder, {health: 1.15, shudder: 0.4, speed: 0.85, range: 0.85}, {reload: 1.7, health: 0.8, range: 0.25}, g.fake]),
                    TYPE: "bullet",
                    STAT_CALCULATOR: "trap",
                },
            },
            {
                POSITION: [2, 4.5, -0.01, 12, 0, 60, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.trap, g.pounder, {health: 1.15, shudder: 0.4, speed: 0.85, range: 0.85}, {reload: 1.7, health: 0.8, range: 0.25}, g.fake]),
                    TYPE: "bullet",
                    STAT_CALCULATOR: "trap",
                },
            },
        ], 3),
    ]
}
Class.CSDGallant = {
    PARENT: "CSDGenericHexanought",
    LABEL: "Gallant",
    GUNS: [
        ...weaponArray([
            {
                POSITION: [12, 5, 1, 0, 3, 0, 0.5],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, {speed: 0.9, maxSpeed: 0.9, health: 1.15}, g.twin, g.triplet]),
                    TYPE: "bullet",
                },
            },
            {
                POSITION: [12, 5, 1, 0, -3, 0, 0.5],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, {speed: 0.9, maxSpeed: 0.9, health: 1.15}, g.twin, g.triplet]),
                    TYPE: "bullet",
                },
            },
            {
                POSITION: [15.5, 5, 1, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, {speed: 0.9, maxSpeed: 0.9, health: 1.15}, g.twin, g.minigun, g.triplet]),
                    TYPE: "bullet",
                },
            },
            {
                POSITION: [14, 5, 1, 0, 0, 0, 0.25],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, {speed: 0.9, maxSpeed: 0.9, health: 1.15}, g.twin, g.minigun, g.triplet]),
                    TYPE: "bullet",
                },
            },
            {
                POSITION: [12.5, 5, 1, 0, 0, 0, 0.5],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, {speed: 0.9, maxSpeed: 0.9, health: 1.15}, g.twin, g.minigun, g.triplet]),
                    TYPE: "bullet",
                },
            },
        ], 3),
        ...weaponArray([
            {
                POSITION: [11, 2, 1, 0, 4.25, 60, 0],
            },
            {
                POSITION: [1.5, 2, 1.5, 11, 4.25, 60, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.trap, g.pounder, {health: 1.15, shudder: 0.4, speed: 0.85, range: 0.85}, g.twin, g.triplet, {reload: 1.15, damage: 0.9, pen: 0.8}]),
                    TYPE: "trap",
                    STAT_CALCULATOR: "trap",
                },
            },
            {
                POSITION: [11, 2, 1, 0, -4.25, 60, 0.5],
            },
            {
                POSITION: [1.5, 2, 1.5, 11, -4.25, 60, 0.5],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.trap, g.pounder, {health: 1.15, shudder: 0.4, speed: 0.85, range: 0.85}, g.twin, g.triplet, {reload: 1.15, damage: 0.9, pen: 0.8}]),
                    TYPE: "trap",
                    STAT_CALCULATOR: "trap",
                },
            },
            {
                POSITION: [12, 2, 1, 0, 1.75, 60, 0.25],
            },
            {
                POSITION: [1.5, 2, 1.5, 12, 1.75, 60, 0.25],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.trap, g.pounder, {health: 1.15, shudder: 0.4, speed: 0.85, range: 0.85}, g.twin, g.triplet, {reload: 1.15, damage: 0.9, pen: 0.8}]),
                    TYPE: "trap",
                    STAT_CALCULATOR: "trap",
                },
            },
            {
                POSITION: [12, 2, 1, 0, -1.75, 60, 0.75],
            },
            {
                POSITION: [1.5, 2, 1.5, 12, -1.75, 60, 0.75],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.trap, g.pounder, {health: 1.15, shudder: 0.4, speed: 0.85, range: 0.85}, g.twin, g.triplet, {reload: 1.15, damage: 0.9, pen: 0.8}]),
                    TYPE: "trap",
                    STAT_CALCULATOR: "trap",
                },
            },
        ], 3),
    ]
}
Class.CSDDevil = {
    PARENT: "CSDGenericHexanought",
    LABEL: "Devil",
    GUNS: [
        ...weaponArray([
            {
                POSITION: [18.5, 6, 1, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, {speed: 0.9, maxSpeed: 0.9, health: 1.15}, g.twin, g.minigun, g.streamliner]),
                    TYPE: "bullet",
                },
            },
            {
                POSITION: [17, 6, 1, 0, 0, 0, 0.15],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, {speed: 0.9, maxSpeed: 0.9, health: 1.15}, g.twin, g.minigun, g.streamliner]),
                    TYPE: "bullet",
                },
            },
            {
                POSITION: [15.5, 6, 1, 0, 0, 0, 0.3],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, {speed: 0.9, maxSpeed: 0.9, health: 1.15}, g.twin, g.minigun, g.streamliner]),
                    TYPE: "bullet",
                },
            },
            {
                POSITION: [14, 6, 1, 0, 0, 0, 0.45],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, {speed: 0.9, maxSpeed: 0.9, health: 1.15}, g.twin, g.minigun, g.streamliner]),
                    TYPE: "bullet",
                },
            },
            {
                POSITION: [12.5, 6, 1, 0, 0, 0, 0.6],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, {speed: 0.9, maxSpeed: 0.9, health: 1.15}, g.twin, g.minigun, g.streamliner]),
                    TYPE: "bullet",
                },
            },
        ], 3),
        ...weaponArray([
            {
                POSITION: [12, 10, 1, 0, 0, 60, 0],
            },
            {
                POSITION: [5, 10, 1.5, 12, 0, 60, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.trap, g.pounder, {health: 1.15, shudder: 0.4, speed: 0.85, range: 0.85}, g.pounder, g.destroyer, {size: 1.5}]),
                    TYPE: "trap",
                    STAT_CALCULATOR: "trap",
                },
            },
        ], 3),
    ]
}

// Drones-Traps
Class.CSDBuccaneer = {
    PARENT: "CSDGenericHexanought",
    LABEL: "Buccaneer",
    GUNS: [
        ...weaponArray([
            ...weaponMirror([
                {
                    POSITION: [12, 4, 1, 0, 3.2, 0, 0],
                },
                {
                    POSITION: [2, 4, 1.5, 12, 3.25, 0, 0],
                    PROPERTIES: {
                        SHOOT_SETTINGS: combineStats([g.trap, g.pounder, {health: 1.15, shudder: 0.4, speed: 0.85, range: 0.85}, {reload: 1.5, range: 0.25}]),
                        TYPE: "CSDMiniChargedTrap",
                        STAT_CALCULATOR: "trap",
                    },
                },
                {
                    POSITION: [2, 2, 0.01, 12, 3.25, 0, 0],
                    PROPERTIES: {
                        SHOOT_SETTINGS: combineStats([g.trap, g.pounder, {health: 1.15, shudder: 0.4, speed: 0.85, range: 0.85}, {reload: 1.5, range: 0.25}, g.fake]),
                        TYPE: "bullet",
                        STAT_CALCULATOR: "trap",
                    },
                },
            ]),
        ], 3),
        ...weaponArray({
            POSITION: [4, 9, 1.1, 8, 0, 60, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.drone, g.overseer, {reload: 0.85, health: 1.08, maxSpeed: 0.95}, {reload: 1.2, damage: 1.5, maxSpeed: 0.8}]),
                TYPE: "drone",
                MAX_CHILDREN: 2,
                AUTOFIRE: true,
                SYNCS_SKILLS: true,
                STAT_CALCULATOR: "drone",
                WAIT_TO_CYCLE: true,
            },
        }, 3),
    ]
}
Class.CSDInquester = {
    PARENT: "CSDGenericHexanought",
    LABEL: "Inquester",
    GUNS: [
        ...weaponArray([
            {
                POSITION: [11, 2, 1, 0, 4.25, 0, 0],
            },
            {
                POSITION: [1.5, 2, 1.5, 11, 4.25, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.trap, g.pounder, {health: 1.15, shudder: 0.4, speed: 0.85, range: 0.85}, g.twin, g.triplet, {reload: 1.15, damage: 0.9, pen: 0.8}]),
                    TYPE: "trap",
                    STAT_CALCULATOR: "trap",
                },
            },
            {
                POSITION: [11, 2, 1, 0, -4.25, 0, 0.5],
            },
            {
                POSITION: [1.5, 2, 1.5, 11, -4.25, 0, 0.5],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.trap, g.pounder, {health: 1.15, shudder: 0.4, speed: 0.85, range: 0.85}, g.twin, g.triplet, {reload: 1.15, damage: 0.9, pen: 0.8}]),
                    TYPE: "trap",
                    STAT_CALCULATOR: "trap",
                },
            },
            {
                POSITION: [12, 2, 1, 0, 1.75, 0, 0.25],
            },
            {
                POSITION: [1.5, 2, 1.5, 12, 1.75, 0, 0.25],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.trap, g.pounder, {health: 1.15, shudder: 0.4, speed: 0.85, range: 0.85}, g.twin, g.triplet, {reload: 1.15, damage: 0.9, pen: 0.8}]),
                    TYPE: "trap",
                    STAT_CALCULATOR: "trap",
                },
            },
            {
                POSITION: [12, 2, 1, 0, -1.75, 0, 0.75],
            },
            {
                POSITION: [1.5, 2, 1.5, 12, -1.75, 0, 0.75],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.trap, g.pounder, {health: 1.15, shudder: 0.4, speed: 0.85, range: 0.85}, g.twin, g.triplet, {reload: 1.15, damage: 0.9, pen: 0.8}]),
                    TYPE: "trap",
                    STAT_CALCULATOR: "trap",
                },
            },
        ], 3),
        ...weaponArray({
            POSITION: [3, 5, -1.3, 9, 0, 60, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.swarm, {reload: 0.85, health: 1.08, maxSpeed: 0.95}, g.pounder]),
                TYPE: "swarm",
                SYNCS_SKILLS: true,
                STAT_CALCULATOR: "drone",
                WAIT_TO_CYCLE: true,
            },
        }, 3),
    ]
}
Class.CSDHellion = {
    PARENT: "CSDGenericHexanought",
    LABEL: "Hellion",
    GUNS: [
        ...weaponArray([
            {
                POSITION: [15, 9, 1, 0, 0, 0, 0],
            },
            {
                POSITION: [13, 7.5, 1, 0, 0, 0, 0],
            },
            {
                POSITION: [3, 7.5, 1.5, 13, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.trap, g.pounder, {health: 1.15, shudder: 0.4, speed: 0.85, range: 0.85}, {reload: 1.55}]),
                    TYPE: "CSDTwinAutoTrap",
                    STAT_CALCULATOR: "trap",
                },
            },
            {
                POSITION: [11, 10, 1, 0, 0, 0, 0],
            },
        ], 3),
        ...weaponArray([
            ...weaponMirror(
                {
                    POSITION: [3, 4, -1.3, 8.75, 3, 60, 0],
                    PROPERTIES: {
                        SHOOT_SETTINGS: combineStats([g.swarm, {reload: 0.85, health: 1.08, maxSpeed: 0.95}, g.triplet]),
                        TYPE: "swarm",
                        SYNCS_SKILLS: true,
                        STAT_CALCULATOR: "drone",
                        WAIT_TO_CYCLE: true,
                    },
                },
            ),
            {
                POSITION: [3, 4, -1.3, 9.5, 0, 60, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.swarm, {reload: 0.85, health: 1.08, maxSpeed: 0.95}, g.triplet]),
                    TYPE: "swarm",
                    SYNCS_SKILLS: true,
                    STAT_CALCULATOR: "drone",
                    WAIT_TO_CYCLE: true,
                },
            },
        ], 3),
    ]
}
Class.CSDPoltergeist = {
    PARENT: "CSDGenericHexanought",
    LABEL: "Poltergeist",
    GUNS: [
        ...weaponArray([
            {
                POSITION: [13, 9, 1, 0, 0, 0, 0],
            },
            {
                POSITION: [3, 9, 1.5, 13, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.trap, g.pounder, {health: 1.15, shudder: 0.4, speed: 0.85, range: 0.85}, {reload: 1.3}, {reload: 1.3, damage: 1.4, health: 1.2, speed: 0.8}]),
                    TYPE: "CSDAutoTrap",
                    STAT_CALCULATOR: "trap",
                },
            },
            {
                POSITION: [11, 10, 1, 0, 0, 0, 0],
            },
        ], 3),
        ...weaponArray([
            {
                POSITION: [5, 9, -1.2, 7, 0, 60, 0],
            },
            {
                POSITION: [1.5, 10, 1.2, 13, 0, 60, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.spawner, {reload: 0.85, health: 1.08, maxSpeed: 0.95, size: 0.75}]),
                    TYPE: "CSDProvokerMinion",
                    MAX_CHILDREN: 2,
                    STAT_CALCULATOR: "drone",
                    AUTOFIRE: true,
                    SYNCS_SKILLS: true,
                },
            },
            {
                POSITION: [2.5, 10, 0.9, 12, 0, 60, 0],
            },
            {
                POSITION: [2.5, 10, -1.2, 8, 0, 60, 0],
            }
        ], 3),
    ]
}
Class.CSDBrute = {
    PARENT: "CSDGenericHexanought",
    LABEL: "Brute",
    GUNS: [
        ...weaponArray([
            {
                POSITION: [12, 9, 1, 0, 0, 0, 0],
            },
            {
                POSITION: [4, 9, 1.5, 12, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.trap, g.pounder, {health: 1.15, shudder: 0.4, speed: 0.85, range: 0.85}, {reload: 1.7, health: 0.8, range: 0.25}]),
                    TYPE: "CSDMegaChargedTrap",
                    STAT_CALCULATOR: "trap",
                },
            },
            {
                POSITION: [4, 9, 0.01, 12, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.trap, g.pounder, {health: 1.15, shudder: 0.4, speed: 0.85, range: 0.85}, {reload: 1.7, health: 0.8, range: 0.25}, g.fake]),
                    TYPE: "bullet",
                    STAT_CALCULATOR: "trap",
                },
            },
            {
                POSITION: [2, 4.5, -0.01, 12, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.trap, g.pounder, {health: 1.15, shudder: 0.4, speed: 0.85, range: 0.85}, {reload: 1.7, health: 0.8, range: 0.25}, g.fake]),
                    TYPE: "bullet",
                    STAT_CALCULATOR: "trap",
                },
            },
        ], 3),
        ...weaponArray([
            {
                POSITION: [5, 8.5, -1.1, 7, 0, 60, 0],
            },
            {
                POSITION: [1.5, 9, 1, 12, 0, 60, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.spawner, {reload: 0.85, health: 1.08, maxSpeed: 0.95}, {health: 1.2, speed: 0.9, maxSpeed: 0.8}]),
                    TYPE: "CSDGladiatorMinion",
                    MAX_CHILDREN: 2,
                    STAT_CALCULATOR: "drone",
                    AUTOFIRE: true,
                    SYNCS_SKILLS: true,
                },
            },
            {
                POSITION: [2.5, 10, -1.2, 8, 0, 60, 0],
            }
        ], 3),
    ]
}
Class.CSDArchangel = {
    PARENT: "CSDGenericHexanought",
    LABEL: "Archangel",
    GUNS: [
        ...weaponArray([
            {
                POSITION: [12, 10, 1, 0, 0, 0, 0],
            },
            {
                POSITION: [5, 10, 1.5, 12, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.trap, g.pounder, {health: 1.15, shudder: 0.4, speed: 0.85, range: 0.85}, g.pounder, g.destroyer, {size: 1.5}]),
                    TYPE: "trap",
                    STAT_CALCULATOR: "trap",
                },
            },
        ], 3),
        ...weaponArray([
            {
                POSITION: [5, 10, 1, 9, 0, 60, 0],
            },
            {
                POSITION: [1.5, 11, 1, 13, 0, 60, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.spawner, {reload: 0.85, health: 1.08, maxSpeed: 0.95, size: 1.375}, { reload: 1.5, recoil: 1.3, damage: 1.5, speed: 0.975, maxSpeed: 0.9, density: 1.25, resist: 1.075 }, { reload: 1.5, recoil: 1.3, damage: 1.5, speed: 0.975, maxSpeed: 0.9, density: 1.25, resist: 1.075 }]),
                    TYPE: "minion",
                    MAX_CHILDREN: 1,
                    STAT_CALCULATOR: "drone",
                    AUTOFIRE: true,
                    SYNCS_SKILLS: true,
                },
            },
            {
                POSITION: [11, 11, 1, 0, 0, 60, 0],
            }
        ], 3),
    ]
}

// Bodies
// Gigabyte Upgrades
Class.CSDTerabyte = {
    PARENT: "CSDGenericHexanought",
    LABEL: "Terabyte",
    TURRETS: [
        ...weaponArray({
            POSITION: [3, 9, 0, 30, 180, 1],
            TYPE: ["CSDSpamAutoTurret", {GUN_STAT_SCALE: {reload: 0.9, health: 1.2}}],
        }, 6),
        ...weaponArray({
            POSITION: [3, 7.7, 0, 0, 180, 1],
            TYPE: ["CSDSpamAutoTurret", {GUN_STAT_SCALE: {reload: 0.9, health: 1.2}}],
        }, 6),
        {
            POSITION: [10, 0, 0, 0, 360, 1],
            TYPE: ['hexagon', {COLOR: 'mirror', MIRROR_MASTER_ANGLE: true}]
        },
        ...weaponArray({
            POSITION: [3, 3, 0, 0, 180, 1],
            TYPE: ["CSDSpamAutoTurret", {GUN_STAT_SCALE: {reload: 0.9, health: 1.2}}],
        }, 3),
    ],
}
// Sector Upgrades
Class.CSDDistrictTurret = {
    PARENT: "autoTankGun",
    INDEPENDENT: true,
    GUNS: [
        {
            POSITION: [28, 18.5, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.power, g.turret, g.assassin, g.pounder, g.destroyer, {size: 0.75, health: 1.24, speed: 0.9, recoil: 1.4, range: 0.9}, {reload: 1.2, damage: 1.5, health: 1.1, speed: 0.8}]),
                TYPE: "bullet",
            },
        },
    ],
}
Class.CSDDistrict = {
    PARENT: "CSDGenericHexanought",
    LABEL: "District",
    TURRETS: [
        {
            POSITION: [16, 0, 0, 0, 360, 1],
            TYPE: ['hexagon', {COLOR: 'mirror', MIRROR_MASTER_ANGLE: true}]
        },
        {
            POSITION: [15, 0, 0, 0, 360, 1],
            TYPE: 'CSDDistrictTurret',
        },
    ],
}
// Abettor Upgrades
Class.CSDLieutenantTurret = {
    PARENT: "autoTankGun",
    INDEPENDENT: true,
    GUNS: [
        {
            POSITION: [3, 10.4, 1.1, 23, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.pounder, g.artillery, g.artillery, g.skimmer, {reload: 1.2, health: 1.35, speed: 0.7, maxSpeed: 0.65, range: 0.45}, {pen: 1.25, maxSpeed: 1.675}]),
                TYPE: "rocketeerMissile",
            },
        },
        {
            POSITION: [24, 20, 0.55, 0, 0, 0, 0],
        },
    ],
}
Class.CSDLieutenant = {
    PARENT: "CSDGenericHexanought",
    LABEL: "Lieutenant",
    TURRETS: [
        {
            POSITION: [14.5, 0, 0, 0, 360, 1],
            TYPE: ['hexagon', {COLOR: 'mirror', MIRROR_MASTER_ANGLE: true}]
        },
        {
            POSITION: [11.5, 0, 0, 0, 360, 1],
            TYPE: 'CSDLieutenantTurret',
        },
    ],
}
Class.CSDAideTurret = {
    PARENT: "autoTankGun",
    INDEPENDENT: true,
    GUNS: [
        {
            POSITION: [3, 10, 1.2, 23, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.pounder, g.artillery, g.artillery, g.skimmer, {reload: 1.2, health: 1.35, speed: 0.7, maxSpeed: 0.65, range: 0.45}, {reload: 1.2, damage: 1.3, maxSpeed: 0.8}]),
                TYPE: "CSDAbettorTurretMissile",
            },
        },
        {
            POSITION: [24, 16, 0.7, 0, 0, 0, 0],
        },
    ],
}
Class.CSDAAide = {
    PARENT: "CSDGenericHexanought",
    LABEL: "Aide",
    TURRETS: [
        {
            POSITION: [14.5, 0, 0, 0, 360, 1],
            TYPE: ['hexagon', {COLOR: 'mirror', MIRROR_MASTER_ANGLE: true}]
        },
        {
            POSITION: [12, 0, 0, 0, 360, 1],
            TYPE: 'CSDAideTurret',
        },
    ],
}
// Broker Upgrades
Class.CSDIntercederTurret = {
    PARENT: "autoTankGun",
    INDEPENDENT: true,
    GUNS: [
        {
            POSITION: [4, 12, 1.2, 22, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.pounder, g.artillery, g.artillery, g.skimmer, {reload: 1.2, health: 1.35, speed: 0.7, maxSpeed: 0.65, range: 0.45}, {reload: 1.2, damage: 1.5, health: 1.2, maxSpeed: 0.7, speed: 1.2}, {reload: 1.15, damage: 1.2, health: 1.2}]),
                TYPE: "CSDInhibitorMissile",
            },
        },
        {
            POSITION: [24, 14, 1, 0, 0, 0, 0],
        },
    ],
}
Class.CSDInterceder = {
    PARENT: "CSDGenericHexanought",
    LABEL: "Interceder",
    TURRETS: [
        {
            POSITION: [14.5, 0, 0, 0, 360, 1],
            TYPE: ['hexagon', {COLOR: 'mirror', MIRROR_MASTER_ANGLE: true}]
        },
        {
            POSITION: [12, 0, 0, 0, 360, 1],
            TYPE: 'CSDIntercederTurret',
        },
    ],
}
// Photosphere Upgrades
Class.CSDErgosphereAura = makeAura(1.3, 0.8, 0.4);
Class.CSDErgosphere = {
    PARENT: "CSDGenericHexanought",
    LABEL: "Ergosphere",
    TURRETS: [
        ...weaponArray({
            POSITION: [2.8, 9, 0, 30, 180, 1],
            TYPE: ["CSDCoronaAura", {GUN_STAT_SCALE: {reload: 0.9, health: 1.2}}],
        }, 6),
        {
            POSITION: [12.5, 0, 0, 0, 360, 1],
            TYPE: ['hexagon', {COLOR: 'mirror', MIRROR_MASTER_ANGLE: true}]
        },
        {
            POSITION: [12, 0, 0, 0, 360, 1],
            TYPE: 'CSDErgosphereAura',
        },
    ],
}
// Supernova Upgrades
Class.CSDHypernova = {
    PARENT: "CSDGenericHexanought",
    LABEL: "Hypernova ",
    TURRETS: [
        ...weaponArray({
            POSITION: [2.8, 9, 0, 30, 180, 1],
            TYPE: ["CSDSpamAutoTurret", {GUN_STAT_SCALE: {reload: 0.9, health: 1.2}}],
        }, 6),
        {
            POSITION: [13, 0, 0, 0, 360, 1],
            TYPE: ['hexagon', {COLOR: 'mirror', MIRROR_MASTER_ANGLE: true}]
        },
        {
            POSITION: [11.5, 0, 0, 0, 360, 1],
            TYPE: 'CSDChromosphereAura',
        },
    ],
}
// Mixture Upgrades
Class.CSDMedley = {
    PARENT: "CSDGenericHexanought",
    LABEL: "Medley",
    TURRETS: [
        ...weaponArray({
            POSITION: [2.5, 9.2, 0, 30, 180, 1],
            TYPE: ["CSDSpamAutoTurret", {GUN_STAT_SCALE: {reload: 0.9, health: 1.2}}],
        }, 6),
        ...weaponArray({
            POSITION: [2, 8, 0, 0, 180, 1],
            TYPE: ["CSDSpammierAutoTurret", {GUN_STAT_SCALE: {reload: 0.9, health: 1.2}}],
        }, 6),
        {
            POSITION: [13, 0, 0, 0, 360, 1],
            TYPE: ['hexagon', {COLOR: 'mirror', MIRROR_MASTER_ANGLE: true}]
        },
        {
            POSITION: [10, 0, 0, 0, 360, 1],
            TYPE: 'CSDCoronaAura',
        },
    ],
}
Class.CSDSpammiestAutoTurret = {
    PARENT: "autoTankGun",
    INDEPENDENT: true,
    GUNS: [
        {
            POSITION: [18, 7, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.flankGuard, g.flankGuard, g.flankGuard, g.autoTurret, g.autoTurret, g.autoTurret, {recoil: 0.125}]),
                TYPE: "bullet",
            },
        },
    ],
}
Class.CSDCombine = {
    PARENT: "CSDGenericHexanought",
    LABEL: "Combine",
    TURRETS: [
        ...weaponArray({
            POSITION: [2, 9.2, 0, 30, 180, 1],
            TYPE: ["CSDSpammierAutoTurret", {GUN_STAT_SCALE: {reload: 0.9, health: 1.2}}],
        }, 6),
        ...weaponArray({
            POSITION: [1.5, 8, 0, 0, 180, 1],
            TYPE: ["CSDSpammiestAutoTurret", {GUN_STAT_SCALE: {reload: 0.9, health: 1.2}}],
        }, 6),
        {
            POSITION: [13, 0, 0, 0, 360, 1],
            TYPE: ['hexagon', {COLOR: 'mirror', MIRROR_MASTER_ANGLE: true}]
        },
        {
            POSITION: [9, 0, 0, 0, 360, 1],
            TYPE: 'CSDCoronaAura',
        },
    ],
}
// Stratosphere Upgrades
Class.CSDTroposphereAura = makeAura(-1, 1.75, 0.225)
Class.CSDTroposphere = {
    PARENT: "CSDGenericHexanought",
    LABEL: "Troposphere",
    TURRETS: [
        {
            POSITION: [14.75, 0, 0, 0, 360, 1],
            TYPE: ['hexagon', {COLOR: 'mirror', MIRROR_MASTER_ANGLE: true}]
        },
        {
            POSITION: [13.5, 0, 0, 0, 360, 1],
            TYPE: 'CSDTroposphereAura',
        },
    ],
}
// Behemoth Upgrades
Class.CSDLeviathan = {
    PARENT: "CSDGenericHexanought",
    LABEL: "Leviathan",
    BODY: makeDreadBody(6, {DAMAGE: 0.25, HEALTH: 3.45, SPEED: 0.2}),
    TURRETS: [
        {
            POSITION: [18, 0, 0, 0, 360, 1],
            TYPE: ['hexagon', {COLOR: 9, MIRROR_MASTER_ANGLE: true}]
        },
        {
            POSITION: [13, 0, 0, 0, 360, 1],
            TYPE: ['hexagon', {COLOR: 'mirror', MIRROR_MASTER_ANGLE: true}]
        },
        {
            POSITION: [7, 0, 0, 0, 360, 1],
            TYPE: ['hexagon', {COLOR: 9, MIRROR_MASTER_ANGLE: true}]
        },
        {
            POSITION: [32, 0, 0, 0, 360, 0],
            TYPE: ['hexagon', {COLOR: 9, MIRROR_MASTER_ANGLE: true}]
        },
    ],
}
// Grandiose Upgrades
Class.CSDMonument = {
    PARENT: "CSDGenericHexanought",
    LABEL: "Monument",
    BODY: makeDreadBody(6, {DAMAGE: 0.9, HEALTH: 1.5, SPEED: 0.7}),
    TURRETS: [
        {
            POSITION: [13, 0, 0, 0, 360, 1],
            TYPE: ['hexagon', {COLOR: 'mirror', MIRROR_MASTER_ANGLE: true}]
        },
        {
            POSITION: [12, 0, 0, 0, 360, 1],
            TYPE: 'CSDStratosphereAura',
        },
        {
            POSITION: [26, 0, 0, 0, 360, 0],
            TYPE: ['hexagon', {COLOR: 9, MIRROR_MASTER_ANGLE: true}]
        },
    ],
}
// Planet Upgrades
Class.CSDOrion = {
    PARENT: "CSDGenericHexanought",
    LABEL: "Orion",
    BODY: makeDreadBody(5, {DAMAGE: 0.8, HEALTH: 2, SPEED: 0.6}),
    TURRETS: [
        {
            POSITION: [15, 0, 0, 0, 360, 1],
            TYPE: ['hexagon', {COLOR: 9, MIRROR_MASTER_ANGLE: true}]
        },
        {
            POSITION: [13, 0, 0, 0, 360, 1],
            TYPE: ['hexagon', {COLOR: 'mirror', MIRROR_MASTER_ANGLE: true}]
        },
        {
            POSITION: [11, 0, 0, 0, 360, 1],
            TYPE: 'CSDMesosphereAura',
        },
        {
            POSITION: [28, 0, 0, 0, 360, 0],
            TYPE: ['hexagon', {COLOR: 9, MIRROR_MASTER_ANGLE: true}]
        },
    ],
}
Class.CSDStellar = {
    PARENT: "CSDGenericHexanought",
    LABEL: "Stellar",
    BODY: makeDreadBody(6, {DAMAGE: 0.4, HEALTH: 2.5, SPEED: 0.35}),
    TURRETS: [
        {
            POSITION: [17, 0, 0, 0, 360, 1],
            TYPE: ['hexagon', {COLOR: 9, MIRROR_MASTER_ANGLE: true}]
        },
        {
            POSITION: [12, 0, 0, 0, 360, 1],
            TYPE: ['hexagon', {COLOR: 'mirror', MIRROR_MASTER_ANGLE: true}]
        },
        {
            POSITION: [10, 0, 0, 0, 360, 1],
            TYPE: 'CSDThermosphereAura',
        },
        {
            POSITION: [30, 0, 0, 0, 360, 0],
            TYPE: ['hexagon', {COLOR: 9, MIRROR_MASTER_ANGLE: true}]
        },
    ],
}
// Acumination Upgrades
Class.CSDApex = {
    PARENT: "CSDGenericHexanought",
    LABEL: "Apex",
    BODY: makeDreadBody(6, {DAMAGE: 2, HEALTH: 0.5, SPEED: 0.5}),
    TURRETS: [
        {
            POSITION: [14, 0, 0, 30, 360, 1],
            TYPE: ['hexagon', {COLOR: 9, MIRROR_MASTER_ANGLE: true}]
        },
        ...weaponArray([
            {
                POSITION: [4, 5.5, 1.5, 3, 360, 1],
                TYPE: ['triangle', {COLOR: 9, MIRROR_MASTER_ANGLE: true}]
            },
            {
                POSITION: [4, 5.5, -1.5, -3, 360, 1],
                TYPE: ['triangle', {COLOR: 9, MIRROR_MASTER_ANGLE: true}]
            }
        ], 6),
        {
            POSITION: [13, 0, 0, 0, 360, 1],
            TYPE: ['hexagon', {COLOR: 'mirror', MIRROR_MASTER_ANGLE: true}]
        },
        {
            POSITION: [23, 0, 0, 0, 360, 0],
            TYPE: ['hexagon', {COLOR: 9, MIRROR_MASTER_ANGLE: true}]
        },
        ...weaponArray([
            {
                POSITION: [5, 10, -2, 30, 360, 0],
                TYPE: ['triangle', {COLOR: 9, MIRROR_MASTER_ANGLE: true}]
            },
            {
                POSITION: [5, 10, 2, -30, 360, 0],
                TYPE: ['triangle', {COLOR: 9, MIRROR_MASTER_ANGLE: true}]
            },
            {
                POSITION: [5, 6.5, 6.5, -45, 360, 0],
                TYPE: ['square', {COLOR: 9, MIRROR_MASTER_ANGLE: true}]
            }
        ], 6),
    ],
}
// Bolide Upgrades
Class.CSDFireball = {
    PARENT: "CSDGenericHexanought",
    LABEL: "Fireball",
    BODY: makeDreadBody(6, {DAMAGE: 1, HEALTH: 0.3, SPEED: 2}),
    TURRETS: [
        {
            POSITION: [17, 0, 0, 30, 360, 1],
            TYPE: ['hexagon', {COLOR: 'mirror', MIRROR_MASTER_ANGLE: true}]
        },
        {
            POSITION: [13, 0, 0, 0, 360, 1],
            TYPE: ['hexagon', {COLOR: 'mirror', MIRROR_MASTER_ANGLE: true}]
        },
        {
            POSITION: [9, 0, 0, 30, 360, 1],
            TYPE: ['hexagon', {COLOR: 'mirror', MIRROR_MASTER_ANGLE: true}]
        },
        {
            POSITION: [23, 0, 0, 0, 360, 0],
            TYPE: ['hexagon', {COLOR: 9, MIRROR_MASTER_ANGLE: true}]
        },
        ...weaponArray({
            POSITION: [13, -6, 0, 30, 360, 0],
            TYPE: ['hexagon', {COLOR: 9, MIRROR_MASTER_ANGLE: true}]
        }, 6),
    ],
}
// Meteor Upgrades
Class.CSDComet = {
    PARENT: "CSDGenericHexanought",
    LABEL: "Comet",
    BODY: makeDreadBody(5, {DAMAGE: 1.6, HEALTH: 0.45, SPEED: 1.15}),
    TURRETS: [
        {
            POSITION: [17, 0, 0, 0, 360, 1],
            TYPE: ['hexagon', {COLOR: 9, MIRROR_MASTER_ANGLE: true}]
        },
        {
            POSITION: [17, 0, 0, 30, 360, 1],
            TYPE: ['hexagon', {COLOR: 'mirror', MIRROR_MASTER_ANGLE: true}]
        },
        {
            POSITION: [23, 0, 0, 0, 360, 0],
            TYPE: ['hexagon', {COLOR: 9, MIRROR_MASTER_ANGLE: true}]
        },
        ...weaponArray({
            POSITION: [12, -6.5, 0, 30, 360, 0],
            TYPE: ['pentagon', {COLOR: 9, MIRROR_MASTER_ANGLE: true}]
        }, 6),
        ...weaponArray({
            POSITION: [10, 6.5, 0, 0, 360, 0],
            TYPE: ['pentagon', {COLOR: 9, MIRROR_MASTER_ANGLE: true}]
        }, 6),
    ],
}
Class.CSDStreaker = {
    PARENT: "CSDGenericHexanought",
    LABEL: "Streaker",
    BODY: makeDreadBody(5, {DAMAGE: 1.4, HEALTH: 0.45, SPEED: 1.4}),
    TURRETS: [
        {
            POSITION: [17, 0, 0, 0, 360, 1],
            TYPE: ['hexagon', {COLOR: 9, MIRROR_MASTER_ANGLE: true}]
        },
        {
            POSITION: [17, 0, 0, 30, 360, 1],
            TYPE: ['hexagon', {COLOR: 'mirror', MIRROR_MASTER_ANGLE: true}]
        },
        {
            POSITION: [8, 0, 0, 0, 360, 1],
            TYPE: ['hexagon', {COLOR: 'mirror', MIRROR_MASTER_ANGLE: true}]
        },
        {
            POSITION: [23, 0, 0, 0, 360, 0],
            TYPE: ['hexagon', {COLOR: 9, MIRROR_MASTER_ANGLE: true}]
        },
        ...weaponArray({
            POSITION: [14.75, -5, 0, 30, 360, 0],
            TYPE: ['hexagon', {COLOR: 9, MIRROR_MASTER_ANGLE: true}]
        }, 6),
    ],
}
// Upgrades
Class.CSDBaseDreadnoughtW.UPGRADES_TIER_5 = ["CSDPacifier", "CSDInvader", "CSDCentaur"]
    Class.CSDPacifier.UPGRADES_TIER_6 = ["CSDMediator", "CSDNegotiator"]
        Class.CSDMediator.UPGRADES_TIER_7 = ["CSDExecutor", "CSDEnforcer"]
            Class.CSDExecutor.UPGRADES_TIER_8 = ["CSDInterception", "CSDInhibitor"]
                Class.CSDInterception.UPGRADES_TIER_9 = ["CSDObviation", "CSDGuild", "CSDFuse"]
                Class.CSDInhibitor.UPGRADES_TIER_9 = ["CSDTyrant", "CSDMingler", "CSDMartinet"]

            Class.CSDEnforcer.UPGRADES_TIER_8 = ["CSDSuppressor", "CSDInhibitor"]
                Class.CSDSuppressor.UPGRADES_TIER_9 = ["CSDRetardant", "CSDQueller", "CSDVisitant"]

        Class.CSDNegotiator.UPGRADES_TIER_7 = ["CSDAppeaser", "CSDSword"]
            Class.CSDAppeaser.UPGRADES_TIER_8 = ["CSDArbitrator", "CSDGladius"]
                Class.CSDArbitrator.UPGRADES_TIER_9 = ["CSDMitigator", "CSDAssuasive", "CSDBenign"]

            Class.CSDSword.UPGRADES_TIER_8 = ["CSDSabre", "CSDGladius"]
                Class.CSDSabre.UPGRADES_TIER_9 = ["CSDBayonet", "CSDLance", "CSDDevil"]
                Class.CSDGladius.UPGRADES_TIER_9 = ["CSDBlade", "CSDEmissary", "CSDGallant"]

    Class.CSDInvader.UPGRADES_TIER_6 = ["CSDInquisitor", "CSDAssailant"]
        Class.CSDInquisitor.UPGRADES_TIER_7 = ["CSDInfiltrator", "CSDInterrogator"]
            Class.CSDInfiltrator.UPGRADES_TIER_8 = ["CSDRaider", "CSDProber"]
                Class.CSDRaider.UPGRADES_TIER_9 = ["CSDMarauder", "CSDEmissary", "CSDBuccaneer"]

            Class.CSDInterrogator.UPGRADES_TIER_8 = ["CSDAnalyst", "CSDProber"]
                Class.CSDAnalyst.UPGRADES_TIER_9 = ["CSDQuester", "CSDMingler", "CSDHellion"]
                Class.CSDProber.UPGRADES_TIER_9 = ["CSDCatechizer", "CSDQueller", "CSDInquester"]

        Class.CSDAssailant.UPGRADES_TIER_7 = ["CSDAggressor", "CSDMugger"]
            Class.CSDAggressor.UPGRADES_TIER_8 = ["CSDProvoker", "CSDGladiator"]
                Class.CSDProvoker.UPGRADES_TIER_9 = ["CSDOffender", "CSDLance", "CSDPoltergeist"]

            Class.CSDMugger.UPGRADES_TIER_8 = ["CSDLarcenist", "CSDGladiator"]
                Class.CSDLarcenist.UPGRADES_TIER_9 = ["CSDDefalcator", "CSDAssuasive", "CSDArchangel"]
                Class.CSDGladiator.UPGRADES_TIER_9 = ["CSDChampion", "CSDGuild", "CSDBrute"]

    Class.CSDCentaur.UPGRADES_TIER_6 = ["CSDMinotaur", "CSDDaemon"]
        Class.CSDMinotaur.UPGRADES_TIER_7 = ["CSDHydra", "CSDVagary"]
            Class.CSDHydra.UPGRADES_TIER_8 = ["CSDCerberus", "CSDCrotchet"]
                Class.CSDCerberus.UPGRADES_TIER_9 = ["CSDWyvern", "CSDGallant", "CSDInquester"]

            Class.CSDVagary.UPGRADES_TIER_8 = ["CSDPhantasma", "CSDCrotchet"]
                Class.CSDCrotchet.UPGRADES_TIER_9 = ["CSDWhim", "CSDMartinet", "CSDBuccaneer"]
                Class.CSDPhantasma.UPGRADES_TIER_9 = ["CSDNightmare", "CSDBenign", "CSDBrute"]

        Class.CSDDaemon.UPGRADES_TIER_7 = ["CSDBeelzebub", "CSDWraith"]
            Class.CSDBeelzebub.UPGRADES_TIER_8 = ["CSDFiend", "CSDPhantom"]
                Class.CSDFiend.UPGRADES_TIER_9 = ["CSDOgre", "CSDFuse", "CSDHellion"]

            Class.CSDWraith.UPGRADES_TIER_8 = ["CSDLucifer", "CSDPhantom"]
                Class.CSDLucifer.UPGRADES_TIER_9 = ["CSDSatan", "CSDDevil", "CSDArchangel"]
                Class.CSDPhantom.UPGRADES_TIER_9 = ["CSDRevenant", "CSDVisitant", "CSDPoltergeist"]

Class.CSDBaseDreadnoughtB.UPGRADES_TIER_5 = ["CSDByte", "CSDAtmosphere", "CSDJuggernaut"]
    Class.CSDByte.UPGRADES_TIER_6 = ["CSDKilobyte", "CSDUnit"]
        Class.CSDKilobyte.UPGRADES_TIER_7 = ["CSDMegabyte", "CSDFusion"]
            Class.CSDMegabyte.UPGRADES_TIER_8 = ["CSDGigabyte", "CSDMixture"]
                Class.CSDGigabyte.UPGRADES_TIER_9 = ["CSDTerabyte", "CSDMedley"]

            Class.CSDFusion.UPGRADES_TIER_8 = ["CSDSupernova", "CSDMixture"]

        Class.CSDUnit.UPGRADES_TIER_7 = ["CSDSegment", "CSDAgent"]
            Class.CSDSegment.UPGRADES_TIER_8 = ["CSDSector", "CSDBroker"]
                Class.CSDSector.UPGRADES_TIER_9 = ["CSDDistrict", "CSDInterceder"]

            Class.CSDAgent.UPGRADES_TIER_8 = ["CSDAbettor", "CSDBroker"]
                Class.CSDAbettor.UPGRADES_TIER_9 = ["CSDLieutenant", "CSDAAide"]
                Class.CSDBroker.UPGRADES_TIER_9 = ["CSDInterceder", "CSDAAide"]

    Class.CSDAtmosphere.UPGRADES_TIER_6 = ["CSDCorona", "CSDThermosphere"]
        Class.CSDCorona.UPGRADES_TIER_7 = ["CSDChromosphere", "CSDFusion2"]
            Class.CSDChromosphere.UPGRADES_TIER_8 = ["CSDPhotosphere", "CSDSupernova"]
                Class.CSDPhotosphere.UPGRADES_TIER_9 = ["CSDErgosphere", "CSDHypernova"]
                Class.CSDSupernova.UPGRADES_TIER_9 = ["CSDHypernova", "CSDCombine"]

            Class.CSDFusion2.UPGRADES_TIER_8 = ["CSDMixture", "CSDSupernova"]
                Class.CSDMixture.UPGRADES_TIER_9 = ["CSDMedley", "CSDCombine"]

        Class.CSDThermosphere.UPGRADES_TIER_7 = ["CSDMesosphere", "CSDMoon"]
            Class.CSDMesosphere.UPGRADES_TIER_8 = ["CSDStratosphere", "CSDPlanet"]
                Class.CSDStratosphere.UPGRADES_TIER_9 = ["CSDTroposphere", "CSDMonument"]

            Class.CSDMoon.UPGRADES_TIER_8 = ["CSDGrandiose", "CSDPlanet"]
                Class.CSDGrandiose.UPGRADES_TIER_9 = ["CSDMonument", "CSDOrion"]
                Class.CSDPlanet.UPGRADES_TIER_9 = ["CSDStellar", "CSDOrion"]

    Class.CSDJuggernaut.UPGRADES_TIER_6 = ["CSDColossus", "CSDJunket"]
        Class.CSDColossus.UPGRADES_TIER_7 = ["CSDGoliath", "CSDMoon"]
            Class.CSDGoliath.UPGRADES_TIER_8 = ["CSBehemoth", "CSDPlanet"]
                Class.CSBehemoth.UPGRADES_TIER_9 = ["CSDLeviathan", "CSDStellar"]

        Class.CSDJunket.UPGRADES_TIER_7 = ["CSDPinCushion", "CSDAsteroid"]
            Class.CSDPinCushion.UPGRADES_TIER_8 = ["CSDAcumination", "CSDMeteor"]
                Class.CSDAcumination.UPGRADES_TIER_9 = ["CSDApex", "CSDComet"]

            Class.CSDAsteroid.UPGRADES_TIER_8 = ["CSDBolide", "CSDMeteor"]
                Class.CSDBolide.UPGRADES_TIER_9 = ["CSDFireball", "CSDStreaker"]
                Class.CSDMeteor.UPGRADES_TIER_9 = ["CSDComet", "CSDStreaker"]


// Fixed Upgrades
Class.CSDDreadnought = combineTanks("CSDBaseDreadnoughtW", "CSDBaseDreadnoughtB", {})
Class.CSDDreadnought.REROOT_UPGRADE_TREE = ["CSDBaseDreadnoughtW", "CSDBaseDreadnoughtB"]
Class.canxADreadsAddon.UPGRADES_TIER_0.unshift("CSDDreadnought");
Class.canxADreadsAddon.UPGRADES_TIER_0.unshift("menu_addons");
