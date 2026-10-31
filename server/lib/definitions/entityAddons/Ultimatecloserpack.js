const { combineStats } = require('../facilitators.js');
const _constants = require('../constants.js');
const { base } = _constants;
const g = require('../gunvals.js');

// Safe combineStats - drops any null/undefined gunval entries
const _combineStats = combineStats;
const safeStats = (stats) => _combineStats(stats.filter(s => s != null));

// Compat shims for values that may be missing in this OSA version
const gunCalcNames = _constants.gunCalcNames || _constants.GunCalcNames || {};
if (!gunCalcNames.drone)     gunCalcNames.drone     = 'drone';
if (!gunCalcNames.thruster)  gunCalcNames.thruster  = gunCalcNames.sustained || 'sustained';
const statnames    = _constants.statnames    || { drone: 'drone', smasher: 'smasher' };
const dfltskl      = _constants.dfltskl      != null ? _constants.dfltskl : 7;
const smshskl      = _constants.smshskl      != null ? _constants.smshskl : 10;

// Inline replacements for g.* values that may not exist
if (!g.tonsmorrecoil) g.tonsmorrecoil = { recoil: 12 };
if (!g.veryfast)      g.veryfast      = { speed: 3, maxSpeed: 3 };
if (!g.evenmorereload)g.evenmorereload= { reload: 1.5 };
if (!g.morereload)    g.morereload    = { reload: 1.25 };
if (!g.op)            g.op            = { damage: 2, pen: 2, health: 2 };
if (!g.five)          g.five          = { reload: 5 };

// Standard AC bullet stats - used everywhere
const acStats = { reload: 0.4, recoil: 0, health: 4, damage: 4, pen: 4, speed: 5, maxSpeed: 3, density: 5, spray: 2 };

module.exports = ({ Class }) => {

    // ── ACbody: base for all closers ────────────────────────────────────────
    Class.ACbody = {
        LABEL: "Unknown Class",
        ARENA_CLOSER: true,
        TYPE: "tank",
        DAMAGE_CLASS: 2,
        SKILL: [9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
        DANGER: 5,
        COLOR: 3,
        SNAPSIZE: true,
        MOTION_TYPE: "motor",
        FACING_TYPE: "toTarget",
        UPGRADE_COLOR: "gold",
        SIZE: 40,
        MAX_CHILDREN: 0,
        ACCEPTS_SCORE: false,
        DAMAGE_EFFECTS: false,
        BODY: {
            ACCELERATION: base.ACCELERATION || base.ACCEL || 1,
            SPEED: base.SPEED * 3,
            HEALTH: base.HEALTH * 3000,
            DAMAGE: base.DAMAGE * 5,
            PENETRATION: base.PENETRATION,
            SHIELD: base.SHIELD * 300,
            REGEN: base.REGEN,
            FOV: base.FOV * 2,
            DENSITY: base.DENSITY,
            PUSHABILITY: 0.4,
            HETERO: 3,
        },
        GUNS: [],
        TURRETS: [],
        GIVE_KILL_MESSAGE: true,
        DRAW_HEALTH: true,
    };

    // ── Arena Closer ────────────────────────────────────────────────────────
    Class.ac = {
        PARENT: ["ACbody"],
        LABEL: "Arena Closer",
        UPGRADE_COLOR: "gold",
        GUNS: [{
            POSITION: [14, 10, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: safeStats([g.basic, acStats]),
                TYPE: ["bullet", { ARENA_CLOSER: true }],
            },
        }],
    };

    // ac_ception - makeCeption may not exist, build manually
    Class.ac_ception = {
        PARENT: ["ac"],
        LABEL: "Arena Closer-ception",
        UPGRADE_COLOR: "gold",
        TURRETS: [{
            POSITION: [14, 0, 0, 0, 360, 1],
            TYPE: "ac",
        }],
    };

    // ── Baby Arena Closer ───────────────────────────────────────────────────
    Class.babyac = {
        PARENT: ["ACbody"],
        LABEL: "Baby Arena Closer",
        UPGRADE_COLOR: "gold",
        SIZE: 12,
        GUNS: [{
            POSITION: [14, 10, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: safeStats([g.basic, acStats]),
                TYPE: ["bullet", { ARENA_CLOSER: true }],
            },
        }],
    };

    // ── Flank Closer ────────────────────────────────────────────────────────
    Class.flankac = {
        PARENT: ["ACbody"],
        LABEL: "Flank Closer",
        UPGRADE_COLOR: "gold",
        GUNS: [],
    };
    for (let i = 0; i < 3; i++) {
        Class.flankac.GUNS.push({
            POSITION: [14, 10, 1, 0, 0, 120 * i, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: safeStats([g.basic, acStats]),
                TYPE: ["bullet", { ARENA_CLOSER: true }],
            },
        });
    }

    // ── Sniper Closer ───────────────────────────────────────────────────────
    Class.sniperac = {
        PARENT: ["ACbody"],
        LABEL: "Sniper Closer",
        UPGRADE_COLOR: "gold",
        GUNS: [
            {
                POSITION: [27, 10, 1, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: safeStats([g.basic, acStats, g.lessreload, g.veryfast]),
                    TYPE: ["bullet", { ARENA_CLOSER: true }],
                },
            },
            { POSITION: [10, 10, -1.7, 3, 0, 0, 0] },
        ],
    };

    // ── Big Chungus ─────────────────────────────────────────────────────────
    Class.bigchungus = {
        PARENT: ["ACbody"],
        LABEL: "Big Chungus",
        UPGRADE_COLOR: "gold",
        GUNS: [{
            POSITION: [7, 2, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: safeStats([g.basic, acStats, g.doublereload]),
                TYPE: ["bullet", { ARENA_CLOSER: true }],
            },
        }],
    };

    // ── Machine Closer ──────────────────────────────────────────────────────
    Class.machac = {
        PARENT: ["ACbody"],
        LABEL: "Machine Closer",
        UPGRADE_COLOR: "gold",
        GUNS: [{
            POSITION: [12, 10, 1.4, 8, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: safeStats([g.basic, acStats]),
                TYPE: ["bullet", { ARENA_CLOSER: true }],
            },
        }],
    };

    // ── 360 Machine Closer ──────────────────────────────────────────────────
    Class.machac360 = {
        PARENT: ["ACbody"],
        LABEL: "360 Machine Closer",
        UPGRADE_COLOR: "gold",
        GUNS: [],
    };
    for (let i = 0; i < 50; i++) {
        Class.machac360.GUNS.push({
            POSITION: [12, 10, 1.4, 8, 0, (360 / 50) * i, 0],
            PROPERTIES: {                                          // was missing PROPERTIES wrapper
                SHOOT_SETTINGS: safeStats([g.basic, acStats, g.mach]),
                TYPE: ["bullet", { ARENA_CLOSER: true }],
            },
        });
    }

    // ── Hybrid Closer ───────────────────────────────────────────────────────
    Class.hybridcloser = {
        PARENT: ["ACbody"],
        LABEL: "Hybrid Closer",
        UPGRADE_COLOR: "gold",
        GUNS: [
            {
                POSITION: [18, 15, 1, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: safeStats([g.basic, acStats, g.lessreload]),
                    TYPE: ["bullet", { ARENA_CLOSER: true }],
                },
            },
            {
                POSITION: [7, 12, 1.2, 8, 0, 180, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: safeStats([g.drone, g.over]),
                    TYPE: ["drone", { INDEPENDENT: true }],
                    AUTOFIRE: true,
                    SYNCS_SKILLS: true,
                    STAT_CALCULATOR: gunCalcNames.drone,
                    WAIT_TO_CYCLE: false,
                    MAX_CHILDREN: 10,
                },
            },
        ],
    };

    // ── Omega Closer ────────────────────────────────────────────────────────
    Class.omegacloser = {
        PARENT: ["ACbody"],
        LABEL: "Omega Closer",
        UPGRADE_COLOR: "gold",
        SIZE: 75,
        BODY: {
            SPEED: base.SPEED * 3,
            HEALTH: base.HEALTH * 10000,
            SHIELD: base.SHIELD * 300,
            DAMAGE: base.DAMAGE * 5,
            DENSITY: base.DENSITY,
            PUSHABILITY: 0.4,
            HETERO: 3,
        },
        GUNS: [{
            POSITION: [14, 10, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: safeStats([g.basic, acStats, g.morereload, g.fast]),
                TYPE: ["bullet", { ARENA_CLOSER: true }],
            },
        }],
    };

// ── Smasher Closer ──────────────────────────────────────────────────────
Class.smashac = {
    PARENT: ["ACbody"],
    LABEL: "Smasher Closer",
    UPGRADE_COLOR: "gold",
    DANGER: 6,
    BODY: {
        FOV: base.FOV * 2,
        DENSITY: base.DENSITY * 2,
        HEALTH: base.HEALTH * 1000,
        SPEED: base.SPEED * 5,
        ACCELERATION: (base.ACCELERATION || base.ACCEL || 1) * 10,
        DAMAGE: base.DAMAGE * 50,
    },
    TURRETS: [{
        POSITION: [23, 0, 0, 0, 360, 0],
        TYPE: "smasher",    // string reference - safer than Class.smasher
    }],
    IS_SMASHER: true,
    SKILL:     [smshskl, 0, 0, 0, 0, smshskl, smshskl, smshskl, smshskl, smshskl],
    STAT_NAMES: statnames.smasher,
};

    // ── Minion (for factory) ────────────────────────────────────────────────
    Class.minionac = {
        PARENT: ["genericTank"],
        LABEL: "Minion",
        TYPE: "minion",
        DAMAGE_CLASS: 0,
        ARENA_CLOSER: true,
        HITS_OWN_TYPE: "hardWithBuffer",
        FACING_TYPE: "smoothToTarget",
        BODY: {
            FOV: 2, SPEED: 5, ACCELERATION: 0.4, HEALTH: 5,
            SHIELD: 0, DAMAGE: 1.2, RESIST: 1, PENETRATION: 1, DENSITY: 0.4,
        },
        AI: { BLIND: true },
        DRAW_HEALTH: false,
        CLEAR_ON_MASTER_UPGRADE: true,
        GIVE_KILL_MESSAGE: false,
        CONTROLLERS: ["nearestDifferentMaster","mapAltToFire","minion","canRepel","hangOutNearMaster"],
        GUNS: [{
            POSITION: [14, 10, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: safeStats([g.basic, acStats]),
                TYPE: ["bullet", { ARENA_CLOSER: true }],
            },
        }],
    };

    // ── Factory Closer ──────────────────────────────────────────────────────
    Class.factoryac = {
        PARENT: ["ACbody"],
        LABEL: "Factory Closer",
        UPGRADE_COLOR: "gold",
        DANGER: 7,
        STAT_NAMES: statnames.drone,
        BODY: { SPEED: base.SPEED * 2, FOV: base.FOV * 2 },
        MAX_CHILDREN: 10,
        GUNS: [
            { POSITION: [5, 15, 1, 10.5, 0, 0, 0] },
            {
                POSITION: [2, 17, 1, 15.5, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: safeStats([g.factory, g.evenmorereload, g.morereload]),
                    TYPE: "minionac",
                    STAT_CALCULATOR: gunCalcNames.drone,
                    AUTOFIRE: true,
                    SYNCS_SKILLS: true,
                },
            },
            { POSITION: [7, 17, 1, 5, 0, 0, 0] },
        ],
    };

    // ── OP Drone (for overac) ───────────────────────────────────────────────
    Class.opdrone = {
        PARENT: ["drone"],
        BODY: {
            PENETRATION: 5, PUSHABILITY: 0.1, ACCELERATION: 0.05,
            HEALTH: 15, DAMAGE: 15, SPEED: 20, RANGE: 200,
            DENSITY: 0.03, RESIST: 1.5, FOV: 2,
        },
    };

    // ── Overcloser ──────────────────────────────────────────────────────────
    Class.overac = {
        PARENT: ["ACbody"],
        LABEL: "Overcloser",
        UPGRADE_COLOR: "gold",
        DANGER: 7,
        STAT_NAMES: statnames.drone,
        BODY: {
            ACCELERATION: (base.ACCELERATION || base.ACCEL || 1) * 0.75,
            SPEED: base.SPEED * 2,
            FOV: base.FOV * 2,
        },
        MAX_CHILDREN: 16,
        GUNS: [],
    };
    for (let i = 0; i < 4; i++) {
        Class.overac.GUNS.push({
            POSITION: [6, 12, 1.2, 8, 0, 90 * i, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: safeStats([g.drone, g.over, g.evenmorereload, g.morereload]),
                TYPE: "opdrone",
                AUTOFIRE: true,
                SYNCS_SKILLS: true,
                STAT_CALCULATOR: gunCalcNames.drone,
                WAIT_TO_CYCLE: true,
            },
        });
    }

    // ── Bomb (for acThrower) ────────────────────────────────────────────────
    Class.bombac = {
        PARENT: ["bullet"],
        LABEL: "Bomb",
        INDEPENDENT: true,
        FACING_TYPE: "turnWithSpeed",
        GUNS: [{
            POSITION: [14, 10, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: safeStats([g.basic, acStats, g.doublereload]),
                TYPE: ["bullet", { PERSISTS_AFTER_DEATH: false }],
                SHOOT_ON_DEATH: false,
                AUTOFIRE: true,
            },
        }],
    };

    // ── Arena Closer Thrower ────────────────────────────────────────────────
    Class.acThrower = {
        PARENT: ["ACbody"],
        LABEL: "Arena Closer Thrower",
        UPGRADE_COLOR: "gold",
        GUNS: [
            {
                POSITION: [12, 13, -1.4, 4, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: safeStats([g.basic, g.halfreload, { health: 3, damage: 3, pen: 3 }]),
                    TYPE: "bombac",
                },
            },
            { POSITION: [10, 0.5, -20, 5, 0, 0, 0] },
        ],
    };

// ── Redist bullet +  Closer ───────────────────────────────────────
Class.redistbullet = {
    PARENT: ["bullet"],
    SHAPE: 6,
    TURRETS: [
        { POSITION: [18.5, 0, 0, 0,   360, 0], TYPE: "spike" },
        { POSITION: [18.5, 0, 0, 90,  360, 0], TYPE: "spike" },
        { POSITION: [18.5, 0, 0, 180, 360, 0], TYPE: "spike" },
        { POSITION: [18.5, 0, 0, 270, 360, 0], TYPE: "spike" },
    ],
};
Class.redistcloser = {
    PARENT: ["ACbody"],
    LABEL: "Redist Closer",
    UPGRADE_COLOR: "gold",
    GUNS: [
        { POSITION: [8, 12.2, 1.3, 8.5, 0, 0, 0] },
        {
            POSITION: [18, 12.2, 1, 0, 0, 0, 0.15],
            PROPERTIES: {
                SHOOT_SETTINGS: safeStats([
                    g.basic, g.op, g.tonsmorrecoil, g.tonsmorrecoil,
                    g.halfreload, g.halfreload, g.halfreload,
                    { size: 0.4 }, g.slow, g.slow, acStats, { damage: 15, pen: 15 },
                ]),
                TYPE: "redistbullet",
            },
        },
        { POSITION: [8, 12.2, -1.4, 4.8, 0, 0, 0] },
    ],
};
 
// ── Lancer Closer ───────────────────────────────────────────────────────
Class.lancercloser = {
    PARENT: ["ACbody"],
    LABEL: "Lancer Closer",
    UPGRADE_COLOR: "gold",
    SKILL_CAP: [dfltskl, dfltskl, dfltskl, dfltskl, 0, dfltskl, dfltskl, dfltskl, dfltskl, dfltskl],
    BODY: {
        SPEED: base.SPEED * 3,
        DAMAGE: 3,
        ACCELERATION: (base.ACCELERATION || base.ACCEL || 1) + 4,
        HEALTH: base.HEALTH * 1000,
    },
    GUNS: [
        {
            POSITION: [20, 0.3, -55, 0, 0, 0, 0],
            PROPERTIES: {
                AUTOFIRE: true,
                SHOOT_SETTINGS: safeStats([[2, 0, 0.1, 1.3, 0.05, 50, 20, 0.7 * 3, 3, 0.05, 1, 45, 1]]),
                TYPE: [["bullet"], { LABEL: "Lance" }],
            },
        },
        { POSITION: [25, 0.3, -55, 0, 0, 0, 0] },
    ],
};

    // ── Auto AC gun (turret for auto5ac) ────────────────────────────────────
    Class.autoACgun = {
        PARENT: ["genericTank"],
        LABEL: "",
        BODY: { FOV: 3 },
        CONTROLLERS: ["canRepel","onlyAcceptInArc","mapAltToFire","nearestDifferentMaster"],
        COLOR: 16,
        GUNS: [{
            POSITION: [14, 11, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: safeStats([g.basic, g.halfreload, acStats, g.five, g.morereload]),
                TYPE: ["bullet", { ARENA_CLOSER: true }],
            },
        }],
    };

    // ── Auto-AC-5 ───────────────────────────────────────────────────────────
    Class.auto5ac = {
        PARENT: ["ACbody"],
        LABEL: "Auto-AC-5",
        UPGRADE_COLOR: "gold",
        DANGER: 7,
        CONTROLLERS: [["spin", { speed: 0.03 }]],   // FACING_TYPE:"autospin" → spin controller
        TURRETS: [],
    };
    for (let i = 0; i < 5; i++) {
        Class.auto5ac.TURRETS.push({
            POSITION: [11, 8, 0, 72 * i, 190, 0],
            TYPE: "autoACgun",
        });
    }

    // ── Penta Closer ────────────────────────────────────────────────────────
    Class.pentacloser = {
        PARENT: ["ACbody"],
        LABEL: "Penta Closer",
        UPGRADE_COLOR: "gold",
        GUNS: [
            { POSITION: [12, 8, 1, 0, -3, -30, 0.667], PROPERTIES: { SHOOT_SETTINGS: safeStats([g.basic, acStats]), TYPE: ["bullet", { ARENA_CLOSER: true }] } },
            { POSITION: [12, 8, 1, 0,  3,  30, 0.667], PROPERTIES: { SHOOT_SETTINGS: safeStats([g.basic, acStats]), TYPE: ["bullet", { ARENA_CLOSER: true }] } },
            { POSITION: [14, 8, 1, 0, -2, -15, 0.333], PROPERTIES: { SHOOT_SETTINGS: safeStats([g.basic, acStats]), TYPE: ["bullet", { ARENA_CLOSER: true }] } },
            { POSITION: [14, 8, 1, 0,  2,  15, 0.333], PROPERTIES: { SHOOT_SETTINGS: safeStats([g.basic, acStats]), TYPE: ["bullet", { ARENA_CLOSER: true }] } },
            { POSITION: [16, 8, 1, 0,  0,   0, 0],     PROPERTIES: { SHOOT_SETTINGS: safeStats([g.basic, acStats]), TYPE: ["bullet", { ARENA_CLOSER: true }] } },
        ],
    };

    // ── Gunner Closer ───────────────────────────────────────────────────────
    Class.gunnercloser = {
        PARENT: ["ACbody"],
        LABEL: "Gunner Closer",
        UPGRADE_COLOR: "gold",
        GUNS: [
            { POSITION: [12, 3.5, 1, 0,  7.25, 0, 0.50], PROPERTIES: { SHOOT_SETTINGS: safeStats([g.basic, acStats, g.fast]), TYPE: ["bullet", { ARENA_CLOSER: true }] } },
            { POSITION: [12, 3.5, 1, 0, -7.25, 0, 0.75], PROPERTIES: { SHOOT_SETTINGS: safeStats([g.basic, acStats, g.fast]), TYPE: ["bullet", { ARENA_CLOSER: true }] } },
            { POSITION: [16, 3.5, 1, 0,  2.75, 0, 0.00], PROPERTIES: { SHOOT_SETTINGS: safeStats([g.basic, acStats, g.fast]), TYPE: ["bullet", { ARENA_CLOSER: true }] } },
            { POSITION: [16, 3.5, 1, 0, -2.75, 0, 0.25], PROPERTIES: { SHOOT_SETTINGS: safeStats([g.basic, acStats, g.fast]), TYPE: ["bullet", { ARENA_CLOSER: true }] } },
        ],
    };

    // ── Nailgun Closer ──────────────────────────────────────────────────────
    Class.nailcloser = {
        PARENT: ["ACbody"],
        LABEL: "Nailgun Closer",
        UPGRADE_COLOR: "gold",
        GUNS: [
            { POSITION: [19, 2, 1, 0, -2.5, 0, 0.25], PROPERTIES: { SHOOT_SETTINGS: safeStats([g.basic, acStats, g.fast, g.fast]), TYPE: "bullet" } },
            { POSITION: [19, 2, 1, 0,  2.5, 0, 0.75], PROPERTIES: { SHOOT_SETTINGS: safeStats([g.basic, acStats, g.fast, g.fast]), TYPE: "bullet" } },
            { POSITION: [20, 2, 1, 0,  0,   0, 0],    PROPERTIES: { SHOOT_SETTINGS: safeStats([g.basic, acStats, g.fast, g.fast]), TYPE: "bullet" } },
            { POSITION: [5.5, 7, -1.8, 6.5, 0, 0, 0] },
        ],
    };

    // ── Mecha Closer ────────────────────────────────────────────────────────
    Class.mechacloser = {
        PARENT: ["ACbody"],
        LABEL: "Mecha Closer",
        UPGRADE_COLOR: "gold",
        TURRETS: [
            { POSITION: [11, 8, 0, 270, 360, 0], TYPE: "ac" },
            { POSITION: [11, 8, 0,  90, 360, 0], TYPE: "ac" },
        ],
        GUNS: [{
            POSITION: [14, 10, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: safeStats([g.basic, acStats]),
                TYPE: ["bullet", { ARENA_CLOSER: true }],
            },
        }],
    };

    // ── SSJ hair deco ───────────────────────────────────────────────────────
    Class.ssjhair = {
        PARENT: ["genericTank"],
        LABEL: "",
        SHAPE: [[-0.6,2.53],[-0.77,1.92],[-0.73,1.455],[-1.24,1.9],[-0.95,1.005],[-1.4,1.18],[-1.27,0.74],[-0.974,0.51],[-1.1,0.296],[-1.15,-0.11],[-0.846,0.18],[-0.57,0.3],[-0.58,-0.18],[-0.38,0.2],[-0.01,0.36],[0.28,0.22],[0.54,-0.29],[0.69,0.1],[0.646,0.43],[0.9,0.284],[1.147,-0.08],[1.167,0.33],[1.02,0.51],[1.3,0.72],[1.5,1.055],[0.94,0.86],[1.32,1.31],[1.325,1.87],[0.81,1.45],[0.93,2.525],[0.374,1.814],[0.15,2.89],[-0.18,2.14],[-0.21,1.78],[-0.38,2.086]],
        INDEPENDENT: true,
        GUNS: [],
    };

    // ── SSJ aura (addAura may not exist - build directly as a spinning ring) ─
    Class.ssjacAura = {
        PARENT: ["genericTank"],
        INDEPENDENT: true,
        LABEL: "",
        COLOR: "gold",
        ALPHA: 0.08,
        DRAW_FILL: true,
        LAYER: 30,
        CONTROLLERS: [["spin", { speed: 0.025 }]],
        BODY: { DAMAGE: 0, PENETRATION: 0, RANGE: 300, SPEED: 0, HEALTH: 1e9 },
        SHAPE: 0,
        GUNS: [],
    };

    // ── Super Saiyan Closer ─────────────────────────────────────────────────
    Class.ssjac = {
        PARENT: ["ACbody"],
        LABEL: "Super Saiyan Closer",
        UPGRADE_COLOR: "gold",
        TURRETS: [
            { POSITION: [22, 0, 0, 90, 0, 1], TYPE: ["ssjhair", { COLOR: 13 }] },
        ],
        GUNS: [{
            POSITION: [14, 10, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: safeStats([g.basic, acStats]),
                TYPE: ["bullet", { ARENA_CLOSER: true }],
            },
        }],
    };
    // Stacked aura rings (outside the hair turret loop - was incorrectly inside it before)
    for (let i = 1; i < 20; i++) {
        Class.ssjac.TURRETS.push({
            POSITION: [4 * i / 5, 0, 0, 0, 360, 0],
            TYPE: "ssjacAura",
        });
    }

    // ── ACmenu: the upgrade menu shown after arenaCloser ────────────────────
    Class.ACmenu = {
        PARENT: ["menu_addons"],
        LABEL: "Arena Closers",
        LEVEL: 45,
        COLOR: 3,
        UPGRADE_COLOR: "gold",
        UPGRADES_TIER_3: [
            "ac", "ac_ception", "babyac", "machac", "flankac", "sniperac",
            "hybridcloser", "bigchungus", "omegacloser", "smashac", "factoryac",
            "overac", "acThrower", "redistcloser", "auto5ac", "pentacloser",
            "nailcloser", "gunnercloser", "mechacloser", "ssjac", "lancercloser",
        ],
    };

    // ── Hook ACmenu into arenaCloser's upgrade tree ─────────────────────────
    const _entryClass = ["arenaCloser", "arena_closer", "ac", "ACbody"]
        .find(n => Class[n] && Class[n].UPGRADES_TIER_0);
    if (_entryClass) {
        Class[_entryClass].UPGRADES_TIER_0.push("ACmenu");
    } else if (Class.arenaCloser) {
        // arenaCloser exists but has no UPGRADES_TIER_0 yet - create it
        Class.arenaCloser.UPGRADES_TIER_0 = ["ACmenu"];
    } else if (Class.menu_addons && Class.menu_addons.UPGRADES_TIER_0) {
        Class.menu_addons.UPGRADES_TIER_0.push("ACmenu");
    } else {
        console.warn('[ultimateCloserPack] Could not attach ACmenu - connect manually');
    }
};