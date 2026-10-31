// ═══════════════════════════════════════════════════════════════════════════
//  RandomAddon.js  —  OSA entity addon
//  File location: server/entityaddons/RandomAddon.js
//
//  Defines: dumBoss ("braincell killer"), dumBoosterMinion, dumBossLayer2,
//           dumBossLayer2Type2, dumBlockTurret, dumPillbox,
//           dumPillboxTurretTurret, dumPillboxTurret, dumSpawnerTurret,
//           dumStarHat, dumCircleDeco, dumCircleDecoR, dumShrapnel
// ═══════════════════════════════════════════════════════════════════════════
"use strict";

const { combineStats, makeHat } = require('../facilitators.js');
const { base } = require('../constants.js');
const g = require('../gunvals.js');

// Gunval shims for names that differ across OSA versions
g.pound    = g.pound    || g.pounder    || {};
g.thruster = g.thruster || g.booster    || {};
g.setTrap  = g.setTrap  || g.settledTrap || {};

module.exports = ({ Class }) => {

    // ── dumStarHat ─────────────────────────────────────────────────────────
    Class.dumStarHat = {
        PARENT: ["genericTank"],
        SHAPE:  -5,
    };

    // ── dumBoosterMinion ───────────────────────────────────────────────────
    Class.dumBoosterMinion = {
        PARENT: ["minion"],
        LABEL:  "anti-braincell rocket",
        BODY: {
            ACCELERATION: base.ACCEL * 1.2,
        },
        GUNS: [
            {   /*** LENGTH  WIDTH  ASPECT   X      Y    ANGLE  DELAY */
                POSITION: [18, 8, 1, 0, -5.5, 0, 0.5],
                PROPERTIES: { SHOOT_SETTINGS: combineStats([g.basic]), TYPE: "bullet", LABEL: "Front" },
            },
            {
                POSITION: [18, 8, 1, 0, 5.5, 0, 0],
                PROPERTIES: { SHOOT_SETTINGS: combineStats([g.basic]), TYPE: "bullet", LABEL: "Front" },
            },
            {
                POSITION: [13, 8, 1, 0, -1, 140, 0.6],
                PROPERTIES: { SHOOT_SETTINGS: combineStats([g.basic, g.thruster]), TYPE: "bullet" },
            },
            {
                POSITION: [13, 8, 1, 0, 1, 220, 0.6],
                PROPERTIES: { SHOOT_SETTINGS: combineStats([g.basic, g.thruster]), TYPE: "bullet" },
            },
            {
                POSITION: [16, 8, 1, 0, 0, 150, 0.1],
                PROPERTIES: { SHOOT_SETTINGS: combineStats([g.basic, g.thruster]), TYPE: "bullet" },
            },
            {
                POSITION: [16, 8, 1, 0, 0, 210, 0.1],
                PROPERTIES: { SHOOT_SETTINGS: combineStats([g.basic, g.thruster]), TYPE: "bullet" },
            },
        ],
        TURRETS: [
            { POSITION: [9, 0, 0, 0, 360, 1], TYPE: "dumStarHat" },
        ],
    };

    // ── dumCircleDeco / dumCircleDecoR ─────────────────────────────────────
    Class.dumCircleDeco        = makeHat(0);
    Class.dumCircleDeco.COLOR  = "#e1e6a1";
    Class.dumCircleDecoR       = makeHat(0);
    Class.dumCircleDecoR.COLOR = "#1cb514";

    // ── dumSpawnerTurret ───────────────────────────────────────────────────
    Class.dumSpawnerTurret = {
        PARENT:       ["genericTank"],
        MAX_CHILDREN: 4,
        HAS_NO_RECOIL: true,
        GUNS: [
            { POSITION: [5,  11, 1,    10.5, 0, 0, 0] },
            {
                POSITION: [2, 14, 1, 15.5, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.spawner, g.pounder, g.destroyer, { size: 2.5 }]),
                    TYPE:           "minion",
                    AUTOFIRE:       true,
                    SYNCS_SKILLS:   true,
                },
            },
            { POSITION: [12, 14, 1, 0, 0, 0, 0] },
        ],
    };

    // ── dumShrapnel ────────────────────────────────────────────────────────
    Class.dumShrapnel = {
        PARENT: ["bullet"],
        LABEL:  "Shrapnel",
        COLOR:  16,
        SHAPE:  "M -3 0.5 L 9 -0 L -3 -0.5 L -3 0.5",
    };

    // ── dumPillboxTurret (built by loop) ───────────────────────────────────
    Class.dumPillboxTurret = {
        PARENT:      ["genericTank"],
        CONTROLLERS: [["spin", { independent: true, speed: 0.4 }]],
        GUNS:        [],
    };
    for (let i = 0; i < 8; i++) {
        const ang = 360 / 8 * i;
        Class.dumPillboxTurret.GUNS.push(
            {
                POSITION: [85, 15, 0.01, 0, 0, ang, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, { reload: 0.4, speed: 0.1, maxSpeed: 0.1, range: 0.1 }]),
                    TYPE: ["bullet", { ALPHA: 0 }], AUTOFIRE: true,
                },
            },
            {
                POSITION: [65, 15, 0.01, 0, 0, ang, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, { reload: 0.4, speed: 0.1, maxSpeed: 0.1, range: 0.1 }]),
                    TYPE: ["bullet", { ALPHA: 0 }], AUTOFIRE: true,
                },
            },
            {
                POSITION: [45, 15, 0.01, 0, 0, ang, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, { reload: 0.4, speed: 0.1, maxSpeed: 0.1, range: 0.1 }]),
                    TYPE: ["bullet", { ALPHA: 0 }], AUTOFIRE: true,
                },
            },
            {
                POSITION: [25, 15, 0.01, 0, 0, ang, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, { reload: 0.4, speed: 0.1, maxSpeed: 0.1, range: 0.1 }]),
                    TYPE: ["bullet", { ALPHA: 0 }], AUTOFIRE: true,
                },
            },
            {
                POSITION: [0, 15, 1, 0, 0, ang, 999999999],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.assassin, g.pounder]),
                    TYPE:           ["dumShrapnel", { PERSISTS_AFTER_DEATH: true }],
                    SHOOT_ON_DEATH: true,
                },
            },
            {
                POSITION: [90, 15, 0.0001, 0, 0, ang, 0],
            },
        );
    }

    // ── dumPillboxTurretTurret ─────────────────────────────────────────────
    Class.dumPillboxTurretTurret = {
        PARENT:      ["genericTank"],
        CONTROLLERS: [["spin", { independent: true, speed: 0.2 }]],
        GUNS: [
            { POSITION: [60, 7, 1, 0, 0,   0, 0] },
            { POSITION: [60, 7, 1, 0, 0,  90, 0] },
            { POSITION: [60, 7, 1, 0, 0, 180, 0] },
            { POSITION: [60, 7, 1, 0, 0, 270, 0] },
        ],
        TURRETS: [
            { POSITION: [7, 60, 0,   0, 360, 1], TYPE: "dumPillboxTurret" },
            { POSITION: [7, 60, 0,  90, 360, 1], TYPE: "dumPillboxTurret" },
            { POSITION: [7, 60, 0, 180, 360, 1], TYPE: "dumPillboxTurret" },
            { POSITION: [7, 60, 0, 270, 360, 1], TYPE: "dumPillboxTurret" },
        ],
    };

    // ── dumPillbox ─────────────────────────────────────────────────────────
    Class.dumPillbox = {
        LABEL:       "Spike",
        PARENT:      ["trap"],
        SHAPE:       -4,
        MOTION_TYPE: "motor",
        CONTROLLERS: ["goToMasterTarget", "nearestDifferentMaster"],
        INDEPENDENT: true,
        BODY: { SPEED: 4, DENSITY: 5 },
        DIE_AT_RANGE: true,
        TURRETS: [
            { POSITION: [12, 0, 0, 0, 360, 1], TYPE: "dumPillboxTurretTurret" },
            { POSITION: [12, 0, 0, 0, 360, 1], TYPE: "dumSpawnerTurret"       },
        ],
    };

    // ── dumBlockTurret ─────────────────────────────────────────────────────
    Class.dumBlockTurret = {
        PARENT: ["genericTank"],
        LABEL:  "Spike Launcher Turret",
        BODY:   { FOV: 0.8 },
        COLOR:  16,
        GUNS: [
            { POSITION: [5,  11, 1,    10.5, 0, 0, 0] },
            { POSITION: [3,  14, 1,    15.5, 0, 0, 0] },
            { POSITION: [3,  14, 0,    15.5, 0, 0, 0] },
            {
                POSITION: [2, 14, 1.3, 18, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.trap, g.setTrap, g.destroyer]),
                    TYPE:           "dumPillbox",
                    SYNCS_SKILLS:   true,
                },
            },
            { POSITION: [4, 14, 1, 8, 0, 0, 0] },
        ],
        TURRETS: [],
    };

    // ── dumBossLayer2Type2 ─────────────────────────────────────────────────
    Class.dumBossLayer2Type2 = {
        PARENT:        ["genericTank"],
        CONTROLLERS:   [["spin", { independent: true, speed: 0.02 }]],
        SHAPE:         4,
        GUNS:          [],
        HAS_NO_RECOIL: true,
        TURRETS: [
            { POSITION: [4, 10, 0,  45, 360, 1], TYPE: "autoTurret"    },
            { POSITION: [4, 10, 0, 135, 360, 1], TYPE: "autoTurret"    },
            { POSITION: [4, 10, 0, 225, 360, 1], TYPE: "autoTurret"    },
            { POSITION: [4, 10, 0, 315, 360, 1], TYPE: "autoTurret"    },
            { POSITION: [12,  0, 0,   0, 360, 1], TYPE: "dumBlockTurret" },
        ],
    };

    // ── dumBossLayer2 ──────────────────────────────────────────────────────
    Class.dumBossLayer2 = {
        PARENT: ["genericTank"],
        SHAPE:  -3,
        COLOR:  "#faffb5",
        GUNS: [
            {
                POSITION: [38, 4, 1, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, {
                        reload: 6, shudder: 0.0001, damage: 1.25, pen: 1,
                        speed: 2, maxSpeed: 2, density: 2, spray: 0.001, resist: 0.5,
                    }]),
                    TYPE: ["rocketeerMissile", { COLOR: "#ff0000" }],
                },
            },
            { POSITION: [30, 6, -2, 0, 0,   0, 0] },
            { POSITION: [ 8, 5.5, 1, 0, 0,  60, 0] },
            {
                POSITION: [2, 5.5, 1.7, 8, 0, 60, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.trap, g.setTrap, g.pounder, g.destroyer]),
                    TYPE: "unsetTrap", AUTOFIRE: true,
                },
            },
            { POSITION: [8, 5.5, 1, 0, 0, 180, 0] },
            {
                POSITION: [2, 5.5, 1.7, 8, 0, 180, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.trap, g.setTrap, g.pounder, g.destroyer]),
                    TYPE: "unsetTrap", AUTOFIRE: true,
                },
            },
            { POSITION: [8, 5.5, 1, 0, 0, 300, 0] },
            {
                POSITION: [2, 5.5, 1.7, 8, 0, 300, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.trap, g.setTrap, g.pounder, g.destroyer]),
                    TYPE: "unsetTrap", AUTOFIRE: true,
                },
            },
        ],
        TURRETS: [
            { POSITION: [9, 14, 0,   0, 360, 1], TYPE: "dumCircleDecoR" },
            { POSITION: [9, 14, 0, 120, 360, 1], TYPE: "dumCircleDeco"  },
            { POSITION: [9, 14, 0, 240, 360, 1], TYPE: "dumCircleDeco"  },
        ],
    };

    // ── dumBoss ────────────────────────────────────────────────────────────
    Class.dumBoss = {
        PARENT: ["miniboss"],
        LABEL:  "braincell killer",
        COLOR:  "#e1e6a1",
        SKILL:  [9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
        VALUE:  5e5,
        SHAPE:  -6,
        SIZE:   25,
        BODY: {
            FOV:    1,
            HEALTH: 900,
            SHIELD: 4,
            REGEN:  base.REGEN * 0.05,
            SPEED:  1.75,
            DAMAGE: 4,
        },
        GUNS: [
            { POSITION: [32, 4,  1, 0, 0,   0, 0] },
            { POSITION: [ 5, 4, -2, 8, 0,   0, 0] },
            { POSITION: [32, 4,  1, 0, 0, 120, 0] },
            { POSITION: [ 5, 4, -2, 8, 0, 120, 0] },
            { POSITION: [32, 4,  1, 0, 0, 240, 0] },
            { POSITION: [ 5, 4, -2, 8, 0, 240, 0] },
        ],
        TURRETS: [
            { POSITION: [ 9, 32, 0,   0, 360, 1], TYPE: "dumBossLayer2"      },
            { POSITION: [ 9, 32, 0, 120, 360, 1], TYPE: "dumBossLayer2"      },
            { POSITION: [ 9, 32, 0, 240, 360, 1], TYPE: "dumBossLayer2"      },
            { POSITION: [14,  0, 0,   0, 360, 1], TYPE: "dumBossLayer2Type2" },
        ],
    };
    // Add the 6 booster-minion spawn guns evenly around the boss
    for (let i = 0; i < 6; i++) {
        Class.dumBoss.GUNS.push({
            POSITION: [4, 6, 1.7, -12, 0, 360 / 6 * i + 30 + 180, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pound]),
                TYPE:           "dumBoosterMinion",
                MAX_CHILDREN:   2,
                AUTOFIRE:       true,
            },
        });
    }

    console.log("[RandomAddon] Loaded: dumBoss + 12 supporting classes.");
};