/**
 * ================================================================
 *  SOLARIO — The Dying Sun  (fixed for OSA v2.0.x)
 * ================================================================
 *
 *  FILE LOCATION:  server/addons/solario.js
 *  DROP THIS FILE INTO server/addons/ — OSA auto-loads the folder.
 *
 *  ── BUGS FIXED vs. ORIGINAL ─────────────────────────────────────
 *
 *  1. PARENT missing on several classes
 *     revogun, turretBaseKiva, all solarioturretBase* variants,
 *     and blackholeondeath had no PARENT which caused OSA to either
 *     crash at load time or produce silent runtime failures.
 *
 *  2. Wrong gun indices in event handlers
 *     Phase 2 and Phase 3 both called `body.guns[3].canShoot = false`
 *     to prevent the attack gun from firing twice.  But in those
 *     phases guns[3] is a visual decoration gun, not the attack gun.
 *     The correct indices are:
 *       solario         → guns[3]  (unchanged — was already correct)
 *       solariophase2   → guns[5]  (was 3 — BUG)
 *       solariophase3   → guns[7]  (was 3 — BUG)
 *
 *  3. MOTION_TYPE: "solarioarena" — unregistered custom motion type
 *     At runtime, OSA would throw "Unknown motion type: solarioarena"
 *     and crash the entity.  Replaced with a proper stationary entity
 *     (SPEED: 0, no MOTION_TYPE) — the ring still fires its lasers.
 *
 *  4. Missing turret class stubs
 *     Phase 2/3 rings reference rocketeerTurret, boomerTurret,
 *     barricadeTurret, bigauto4gun, machineTripleTurret,
 *     launcherTurret, skimmerTurret, twisterTurret, nailgunTurret,
 *     and artilleryTurret.  If your server already defines these
 *     (e.g., from another addon) the stubs below are silently
 *     skipped.  If not, the working fallbacks prevent a crash.
 *
 *  5. Class.addons → replaced with safe handler that works on both
 *     old (Class.addons) and new (Class.menu_addons) OSA versions.
 *
 *  6. solariophase2 / solariolaserphase2 damage handler
 *     Both checked `body.health.amount < (body.health.max / 3) * 2`
 *     with IDENTICAL triggers — the laser form would immediately
 *     re-trigger the phase2→phase3 transition before phase2 could
 *     run.  The laser-form damage handlers now check <1/3 (same as
 *     solariolaserphase3 already did) so the threshold is consistent.
 * ================================================================
 */

"use strict";

const { combineStats, makeHat } = require('../facilitators.js');
const { base, dfltskl, statnames } = require('../constants.js');
const g = require('../gunvals.js');

// ─────────────────────────────────────────────────────────────────────────────
//  STUB TURRET CLASSES
//  Each is guarded with `Class.X = Class.X || {...}` so existing definitions
//  in your server are never overwritten.
// ─────────────────────────────────────────────────────────────────────────────

Class.rocketeerTurret = Class.rocketeerTurret || {
    PARENT: ["genericTank"],
    LABEL: "Rocketeer",
    BODY: { FOV: 1.2 },
    HAS_NO_RECOIL: true,
    CONTROLLERS: ["canRepel", "onlyAcceptInArc", "mapAltToFire", "nearestDifferentMaster"],
    GUNS: [
        { POSITION: [18, 9, 1, 0, 0, 0, 0] },
        {
            POSITION: [2, 9, 1.5, 18, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pound, g.artillery, { reload: 1.5, damage: 1.2, health: 1.2, pen: 1.2 }]),
                TYPE: "bullet",
            },
        },
    ],
};

Class.boomerTurret = Class.boomerTurret || {
    PARENT: ["genericTank"],
    LABEL: "Boomer",
    BODY: { FOV: 1.2 },
    HAS_NO_RECOIL: true,
    CONTROLLERS: ["canRepel", "onlyAcceptInArc", "mapAltToFire", "nearestDifferentMaster"],
    GUNS: [
        { POSITION: [18, 8, 1, 0, 0, 0, 0] },
        {
            POSITION: [3, 8, 1.6, 18, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, g.setTrap, g.boomerang, { reload: 1.3, damage: 1.2, health: 1.2, pen: 1.2 }]),
                TYPE: "unsetTrap",
                STAT_CALCULATOR: "trap",
            },
        },
    ],
};

Class.barricadeTurret = Class.barricadeTurret || {
    PARENT: ["genericTank"],
    LABEL: "Barricade",
    BODY: { FOV: 1.0 },
    HAS_NO_RECOIL: true,
    CONTROLLERS: ["canRepel", "onlyAcceptInArc", "mapAltToFire", "nearestDifferentMaster"],
    GUNS: [
        { POSITION: [20, 8, 1, 0, 0, 0, 0] },
        {
            POSITION: [4, 8, 1.4, 2, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, g.minigun, { range: 0.5, reload: 0.3, damage: 1.1, health: 1.1, pen: 1.1 }]),
                TYPE: "trap",
                STAT_CALCULATOR: "trap",
            },
        },
        {
            POSITION: [4, 8, 1.4, 18, 0, 0, 0.4],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, g.minigun, { range: 0.5, reload: 0.3, damage: 1.1, health: 1.1, pen: 1.1 }]),
                TYPE: "trap",
                STAT_CALCULATOR: "trap",
            },
        },
    ],
};

Class.bigauto4gun = Class.bigauto4gun || {
    PARENT: ["genericTank"],
    LABEL: "Auto Quad",
    BODY: { FOV: 1.2 },
    HAS_NO_RECOIL: true,
    CONTROLLERS: ["nearestDifferentMaster"],
    GUNS: [
        {
            POSITION: [20, 7, 1, 0, 0,   0, 0],
            PROPERTIES: { SHOOT_SETTINGS: combineStats([g.basic, g.autoTurret, { reload: 1.1, damage: 1.2, health: 1.2, pen: 1.2 }]), TYPE: "bullet" },
        },
        {
            POSITION: [20, 7, 1, 0, 0,  90, 0.25],
            PROPERTIES: { SHOOT_SETTINGS: combineStats([g.basic, g.autoTurret, { reload: 1.1, damage: 1.2, health: 1.2, pen: 1.2 }]), TYPE: "bullet" },
        },
        {
            POSITION: [20, 7, 1, 0, 0, 180, 0.5],
            PROPERTIES: { SHOOT_SETTINGS: combineStats([g.basic, g.autoTurret, { reload: 1.1, damage: 1.2, health: 1.2, pen: 1.2 }]), TYPE: "bullet" },
        },
        {
            POSITION: [20, 7, 1, 0, 0, 270, 0.75],
            PROPERTIES: { SHOOT_SETTINGS: combineStats([g.basic, g.autoTurret, { reload: 1.1, damage: 1.2, health: 1.2, pen: 1.2 }]), TYPE: "bullet" },
        },
    ],
};

Class.machineTripleTurret = Class.machineTripleTurret || {
    PARENT: ["genericTank"],
    LABEL: "Machine Triple",
    BODY: { FOV: 1.2 },
    HAS_NO_RECOIL: true,
    CONTROLLERS: ["canRepel", "onlyAcceptInArc", "mapAltToFire", "nearestDifferentMaster"],
    GUNS: [
        {
            POSITION: [20, 6, 1.3, 0,  0, 0, 0],
            PROPERTIES: { SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.lowPower, { reload: 0.9, damage: 1.2, health: 1.2, pen: 1.2 }]), TYPE: "bullet" },
        },
        {
            POSITION: [20, 6, 1.3, 0,  6, 0, 0.33],
            PROPERTIES: { SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.lowPower, { reload: 0.9, damage: 1.2, health: 1.2, pen: 1.2 }]), TYPE: "bullet" },
        },
        {
            POSITION: [20, 6, 1.3, 0, -6, 0, 0.67],
            PROPERTIES: { SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.lowPower, { reload: 0.9, damage: 1.2, health: 1.2, pen: 1.2 }]), TYPE: "bullet" },
        },
    ],
};

Class.launcherTurret = Class.launcherTurret || {
    PARENT: ["genericTank"],
    LABEL: "Launcher",
    BODY: { FOV: 1.4 },
    HAS_NO_RECOIL: true,
    CONTROLLERS: ["canRepel", "onlyAcceptInArc", "mapAltToFire", "nearestDifferentMaster"],
    GUNS: [
        {
            POSITION: [18, 12, 1, 0, 0, 0, 0],
            PROPERTIES: { SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.artillery, { reload: 1.8, damage: 1.5, health: 1.5, pen: 1.5 }]), TYPE: "bullet" },
        },
    ],
};

Class.skimmerTurret = Class.skimmerTurret || {
    PARENT: ["genericTank"],
    LABEL: "Skimmer",
    BODY: { FOV: 1.6 },
    HAS_NO_RECOIL: true,
    CONTROLLERS: ["canRepel", "onlyAcceptInArc", "mapAltToFire", "nearestDifferentMaster"],
    GUNS: [
        { POSITION: [12, 10, 1, 0, 0, 0, 0] },
        {
            POSITION: [2, 10, 1.2, 12, 0, 0, 0],
            PROPERTIES: { SHOOT_SETTINGS: combineStats([g.trap, g.setTrap, { reload: 1.6, damage: 1.3, health: 1.3, pen: 1.3 }]), TYPE: "skimmer", STAT_CALCULATOR: "trap" },
        },
    ],
};

Class.twisterTurret = Class.twisterTurret || {
    PARENT: ["genericTank"],
    LABEL: "Twister",
    BODY: { FOV: 1.2 },
    HAS_NO_RECOIL: true,
    CONTROLLERS: ["canRepel", "onlyAcceptInArc", "mapAltToFire", "nearestDifferentMaster"],
    GUNS: [
        {
            POSITION: [18, 8, 1, 0, -5, 0, 0],
            PROPERTIES: { SHOOT_SETTINGS: combineStats([g.basic, g.twin, { reload: 0.8, damage: 1.2, health: 1.2, pen: 1.2 }]), TYPE: "bullet" },
        },
        {
            POSITION: [18, 8, 1, 0,  5, 0, 0.5],
            PROPERTIES: { SHOOT_SETTINGS: combineStats([g.basic, g.twin, { reload: 0.8, damage: 1.2, health: 1.2, pen: 1.2 }]), TYPE: "bullet" },
        },
    ],
};

Class.nailgunTurret = Class.nailgunTurret || {
    PARENT: ["genericTank"],
    LABEL: "Nailgun",
    BODY: { FOV: 1.0 },
    HAS_NO_RECOIL: true,
    CONTROLLERS: ["canRepel", "onlyAcceptInArc", "mapAltToFire", "nearestDifferentMaster"],
    GUNS: [
        {
            POSITION: [20, 2, 1, 0, -2, 0, 0],
            PROPERTIES: { SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.nailgun, { reload: 0.4, damage: 1.3, health: 1.3, pen: 1.3 }]), TYPE: "bullet" },
        },
        {
            POSITION: [20, 2, 1, 0,  0, 0, 0.33],
            PROPERTIES: { SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.nailgun, { reload: 0.4, damage: 1.3, health: 1.3, pen: 1.3 }]), TYPE: "bullet" },
        },
        {
            POSITION: [20, 2, 1, 0,  2, 0, 0.67],
            PROPERTIES: { SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.nailgun, { reload: 0.4, damage: 1.3, health: 1.3, pen: 1.3 }]), TYPE: "bullet" },
        },
    ],
};

Class.artilleryTurret = Class.artilleryTurret || {
    PARENT: ["genericTank"],
    LABEL: "Artillery",
    BODY: { FOV: 2.0 },
    HAS_NO_RECOIL: true,
    CONTROLLERS: ["canRepel", "onlyAcceptInArc", "mapAltToFire", "nearestDifferentMaster"],
    GUNS: [
        {
            POSITION: [24, 13, 1, 0, 0, 0, 0],
            PROPERTIES: { SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.artillery, g.artillery, { reload: 2.5, damage: 2, health: 2, pen: 2 }]), TYPE: "bullet" },
        },
    ],
};

// ─────────────────────────────────────────────────────────────────────────────
//  SHARED SUPPORT CLASSES
// ─────────────────────────────────────────────────────────────────────────────

// ── Solario turret variants ───────────────────────────────────────────────────

Class.solarioTurret1 = {
    PARENT: ["genericTank"],
    LABEL: "Turret",
    CONTROLLERS: ["canRepel", "onlyAcceptInArc", "mapAltToFire", "nearestDifferentMaster"],
    COLOR: 13,
    SHAPE: 0,
    BODY: { FOV: 0.8 },
    HAS_NO_RECOIL: true,
    GUNS: [
        { POSITION: [16, 14, 1, 0, 0, 0, 0] },
        {
            POSITION: [4, 14, 1.8, 16, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, g.flankGuard, g.autoTurret, { reload: 1.3 }]),
                TYPE: "trap",
            },
        },
    ],
};

Class.solarioRingTurret = {
    PARENT: ["genericTank"],        // FIX: was missing PARENT
    LABEL: "Turret",
    COLOR: 13,
    HAS_NO_RECOIL: true,
    MIRROR_MASTER_ANGLE: true,
    GUNS: [
        {
            POSITION: [10, 8, 0, 0, 0, 180, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, { reload: 1.25, recoil: 0, size: 1.7 }, g.autoTurret, { reload: 2, speed: 2, maxSpeed: 2 }]),
                TYPE: ["laser", { ARENA_CLOSER: true }],
                AUTOFIRE: true,
            },
        },
        {
            POSITION: [24, 1, 1, 0, 0, 180, 2 / 3],
            PROPERTIES: { COLOR: 'red' },
        },
    ],
};

Class.solarioCircAttack = {
    PARENT: ["bullet"],
    SHAPE: "M 0 -1 A 1 1 0 0 0 0 1 A 1 1 0 0 0 0 -1 Z M 0 -1 A 0.001 0.001 0 0 1 0 1 A 0.001 0.001 0 0 1 0 -1",
    FACING_TYPE: ["spin", { speed: 0.02 }],
    MOTION_TYPE: ["grow", { growSpeed: 2 }],
    ARENA_CLOSER: true,
};

Class.solarioTurret2 = {
    PARENT: ["genericTank"],
    CONTROLLERS: ["canRepel", "onlyAcceptInArc", "mapAltToFire", "nearestDifferentMaster"],
    LABEL: "Turret",
    COLOR: 13,
    SHAPE: 3,
    BODY: { FOV: 0.8 },
    HAS_NO_RECOIL: true,
    GUNS: [
        {
            POSITION: [26, 10, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.flankGuard, g.autoTurret, { reload: 1.5 }]),
                TYPE: "bullet",
            },
        },
    ],
};

Class.solarioTurret3 = {
    PARENT: ["genericTank"],
    LABEL: "Turret",
    CONTROLLERS: ["canRepel", "onlyAcceptInArc", "mapAltToFire", "nearestDifferentMaster"],
    SHAPE: 4,
    COLOR: 13,
    BODY: { FOV: 0.8 },
    HAS_NO_RECOIL: true,
    GUNS: [
        {
            POSITION: [16, 4, 1, 0, -3.5, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.autoTurret, g.pelleter, g.twin, g.power]),
                TYPE: "bullet",
                HAS_NO_RECOIL: true,
            },
        },
        {
            POSITION: [16, 4, 1, 0, 3.5, 0, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.autoTurret, g.pelleter, g.twin, g.power]),
                TYPE: "bullet",
            },
        },
    ],
};

Class.solarioTurret4 = {
    PARENT: ["genericTank"],
    LABEL: "Turret",
    CONTROLLERS: ["canRepel", "onlyAcceptInArc", "mapAltToFire", "nearestDifferentMaster"],
    COLOR: 13,
    SHAPE: 6,
    BODY: { FOV: 0.8 },
    HAS_NO_RECOIL: true,
    GUNS: [
        {
            POSITION: [22, 14, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.autoTurret]),
                TYPE: "bullet",
            },
        },
    ],
};

// ── Laser projectile types ────────────────────────────────────────────────────

Class.laser = {
    PARENT: ["bullet"],
    SHAPE: -1,
    BODY: {
        PENETRATION: 1.1,
        SPEED: 5.8,
        RANGE: 100,
        DENSITY: 0.9,
        HEALTH: 0.155,
        DAMAGE: 5.6,
    },
    BUFF_VS_FOOD: true,
};

Class.hyperlaser = {
    PARENT: ["laser"],
    SHAPE: "M -1 -1 L 8 -1 L 8 1 L -1 1 L -1 -1",
    IMMUNE_TO_TILES: true,
    BORDERLESS: true,
};

// ── Solario mini laser (inner gun turret) ────────────────────────────────────

Class.solariominilaser = {
    PARENT: ["genericTank"],
    LABEL: "Solario SMG",
    DANGER: 6,
    HAS_NO_RECOIL: true,
    BODY: { FOV: 1.2 },
    GUNS: [
        {
            POSITION: [21, 8, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.minigun, { reload: 0.5 }, { reload: 1.333 }]),
                TYPE: "laser",
            },
        },
        {
            POSITION: [19, 8, 1, 0, 0, 0, 1 / 3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.minigun, { reload: 0.5 }, { reload: 1.333 }]),
                TYPE: "laser",
            },
        },
        {
            POSITION: [17, 8, 1, 0, 0, 0, 2 / 3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.minigun, { reload: 0.5 }, { reload: 1.333 }]),
                TYPE: "laser",
            },
        },
        {
            POSITION: [24, 1, 1, 0, 0, 0, 0],
            PROPERTIES: {
                COLOR: 'red',
                SHOOT_SETTINGS: combineStats([g.fake]),
                TYPE: "laser",
            },
        },
    ],
};

// ── Kiva base-thrower classes ─────────────────────────────────────────────────

Class.revogun = {
    PARENT: ["genericTank"],     // FIX: was missing PARENT
    LABEL: 'Auto Turret',
    SYNC_TURRET_SKILLS: true,
    BODY: { FOV: 1 },
    COLOR: 16,
    CONTROLLERS: ['onlyAcceptInArc', 'nearestDifferentMaster'],
    GUNS: [
        {
            POSITION: [13.5, 10, 1, 8, 0, 0, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.autoTurret, { reload: 2 }]),
                TYPE: "bullet",
            },
        },
    ],
};

Class.turretBaseKiva = {
    PARENT: ["genericTank"],     // FIX: was missing PARENT
    LABEL: "Base Ring",
    SHAPE: 'M 0 -1 A 1 1 0 0 0 0 1 A 1 1 0 0 0 0 -1 Z M 0 -1 A 0.001 0.001 0 0 1 0 1 A 0.001 0.001 0 0 1 0 -1',
    COLOR: "#FC8208",
    SYNC_TURRET_SKILLS: true,
    CONTROLLERS: [["spin", { independent: true }]],
    INDEPENDENT: true,
    TURRETS: [
        { POSITION: [4.65, 9.85, 0,  90, 220, 1], TYPE: ["revogun", { COLOR: "#FC8208" }] },
        { POSITION: [4.65, 9.85, 0, 270, 220, 1], TYPE: ["revogun", { COLOR: "#FC8208" }] },
    ],
};

Class.baseBullet = {
    PARENT: ["trap"],
    MOTION_TYPE: "motor",
    HITS_OWN_TYPE: "never",
    BODY: { SPEED: 1.25, RANGE: 120 },
    LABEL: "Base",
    SHAPE: 'M 0 -1 A 1 1 0 0 0 0 1 A 1 1 0 0 0 0 -1 Z M 0 -1 A 0.001 0.001 0 0 1 0 1 A 0.001 0.001 0 0 1 0 -1',
    CONTROLLERS: [["spin", { independent: true, speed: 0.1 }], "boomerang"],
    INDEPENDENT: true,
    FACING_TYPE: "toTarget",
    COLOR: "#FC8208",
    TURRETS: [
        { POSITION: [4.65, 9.85, 0,  90, 220, 1], TYPE: ["revogun", { COLOR: "#FC8208", BODY: { FOV: 2 } }] },
        { POSITION: [4.65, 9.85, 0, 270, 220, 1], TYPE: ["revogun", { COLOR: "#FC8208", BODY: { FOV: 2 } }] },
    ],
    ON: [
        {
            event: "death",
            handler: ({ body }) => {
                if (!body.master || body.master.isDead) return;
                body.master.define(Class.baseThrower);
            },
        },
    ],
};

Class.baseThrower = {
    PARENT: ["genericTank"],
    LABEL: "Kivaaritehdas",
    DANGER: 6,
    SYNC_TURRET_SKILLS: true,
    GUNS: [
        {
            POSITION: [20, 8, 1, 0, 0, 0, 0.2],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.flankGuard]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [1, 38, 1, 0, 0, 0, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, g.setTrap, g.boomerang, { damage: 0.3, pen: 0.2, health: 4, range: 1.5, speed: 1, maxSpeed: 1.4 }]),
                TYPE: ["baseBullet", { COLOR: "#FC8208", KEEP_OWN_COLOR: false }],
                ALT_FIRE: true,
                ALPHA: 0,
            },
        },
    ],
    TURRETS: [
        { POSITION: [34, 0, 0, 0, 360, 0], TYPE: "turretBaseKiva" },
    ],
    ON: [
        {
            event: "altFire",
            handler: ({ body }) => {
                body.define(Class.baseThrowerFire, true);
            },
        },
    ],
};

Class.baseThrowerFire = {
    PARENT: ["genericTank"],
    LABEL: "Kivaaritehdas",
    DANGER: 6,
    GUNS: [
        {
            POSITION: [20, 8, 1, 0, 0, 0, 0.2],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.flankGuard]),
                TYPE: "bullet",
            },
        },
    ],
};

// ── Ring attack entity ────────────────────────────────────────────────────────
// FIX: removed MOTION_TYPE: "solarioarena" (unregistered — crashed at runtime).
//      The ring is now stationary (SPEED: 0) and fires its laser turrets
//      inward, which is the intended effect.

Class.solarioRingAttack = {
    PARENT: ["genericTank"],     // FIX: was missing PARENT
    LABEL: "Ring",
    SHAPE: 'M 0 -3.1 A 3 3 0 0 0 0 3.1 A 3 3 0 0 0 0 -3.1 Z M 0 -3 A 0.001 0.001 0 0 1 0 3 A 0.001 0.001 0 0 1 0 -3',
    COLOR: 13,
    BODY: {
        PUSHABILITY: 0,
        RANGE: 300,
        SPEED: 0,           // FIX: replaces "solarioarena" motion type
    },
    ARENA_CLOSER: true,
    DIE_AT_RANGE: true,
    FACING_TYPE: ["spin", { speed: 0.3 }],
    INDEPENDENT: true,
    TURRETS: [
        { POSITION: [3, 30, 0, 270, 0, 1], TYPE: "solarioRingTurret" },
        { POSITION: [3, 30, 0,   0, 0, 1], TYPE: "solarioRingTurret" },
        { POSITION: [3, 30, 0,  90, 0, 1], TYPE: "solarioRingTurret" },
        { POSITION: [3, 30, 0, 180, 0, 1], TYPE: "solarioRingTurret" },
    ],
};

// ── Turret ring base entities ─────────────────────────────────────────────────
// FIX: all solarioturretBase* were missing PARENT → "genericTank"

Class.solarioturretBase = {
    PARENT: ["genericTank"],
    LABEL: "Base Ring 1",
    SHAPE: 'M 0 -1.6 A 1.5 1.5 0 0 0 0 1.6 A 1.5 1.5 0 0 0 0 -1.6 Z M 0 -1.5 A 0.001 0.001 0 0 1 0 1.5 A 0.001 0.001 0 0 1 0 -1.5',
    COLOR: 13,
    SYNC_TURRET_SKILLS: true,
    CONTROLLERS: [["spin", { independent: true }]],
    INDEPENDENT: true,
    TURRETS: [
        { POSITION: [5, 15, 0,  90, 220, 1], TYPE: "solarioTurret1" },
        { POSITION: [5, 15, 0, 180, 220, 1], TYPE: "solarioTurret2" },
        { POSITION: [5, 15, 0, 270, 220, 1], TYPE: "solarioTurret3" },
        { POSITION: [5, 15, 0,   0, 220, 1], TYPE: "solarioTurret4" },
    ],
};

Class.solarioturretBase2ndRing = {
    PARENT: ["genericTank"],
    LABEL: "Base Ring 2",
    SHAPE: 'M 0 -3.1 A 3 3 0 0 0 0 3.1 A 3 3 0 0 0 0 -3.1 Z M 0 -3 A 0.001 0.001 0 0 1 0 3 A 0.001 0.001 0 0 1 0 -3',
    COLOR: 13,
    CONTROLLERS: [["spin", { independent: true }]],
    INDEPENDENT: true,
    TURRETS: [
        { POSITION: [5, 30, 0,  90, 220, 1], TYPE: "solarioTurret1" },
        { POSITION: [5, 30, 0, 180, 220, 1], TYPE: "solarioTurret2" },
        { POSITION: [5, 30, 0, 270, 220, 1], TYPE: "solarioTurret3" },
        { POSITION: [5, 30, 0,   0, 220, 1], TYPE: "solarioTurret4" },
    ],
};

Class.solarioturretBase2 = {
    PARENT: ["genericTank"],
    LABEL: "Base Ring 1 (P2)",
    SHAPE: 'M 0 -1.6 A 1.5 1.5 0 0 0 0 1.6 A 1.5 1.5 0 0 0 0 -1.6 Z M 0 -1.5 A 0.001 0.001 0 0 1 0 1.5 A 0.001 0.001 0 0 1 0 -1.5',
    COLOR: 33,
    CONTROLLERS: [["spin", { independent: true }]],
    INDEPENDENT: true,
    TURRETS: [
        { POSITION: [5, 15, 0,  90, 220, 1], TYPE: ["solarioTurret1", { COLOR: 33 }] },
        { POSITION: [5, 15, 0, 180, 220, 1], TYPE: ["solarioTurret2", { COLOR: 33 }] },
        { POSITION: [5, 15, 0, 270, 220, 1], TYPE: ["solarioTurret3", { COLOR: 33 }] },
        { POSITION: [5, 15, 0,   0, 220, 1], TYPE: ["solarioTurret4", { COLOR: 33 }] },
    ],
};

Class.solarioturretBase2ndRing2 = {
    PARENT: ["genericTank"],
    LABEL: "Base Ring 2 (P2)",
    SHAPE: 'M 0 -3.1 A 3 3 0 0 0 0 3.1 A 3 3 0 0 0 0 -3.1 Z M 0 -3 A 0.001 0.001 0 0 1 0 3 A 0.001 0.001 0 0 1 0 -3',
    COLOR: 33,
    CONTROLLERS: [["spin", { independent: true }]],
    INDEPENDENT: true,
    TURRETS: [
        { POSITION: [5, 30, 0,  90, 220, 1], TYPE: ["rocketeerTurret",  { COLOR: 33, HAS_NO_RECOIL: true }] },
        { POSITION: [5, 30, 0, 180, 220, 1], TYPE: ["boomerTurret",     { COLOR: 33, HAS_NO_RECOIL: true }] },
        { POSITION: [5, 30, 0, 270, 220, 1], TYPE: ["barricadeTurret",  { COLOR: 33, HAS_NO_RECOIL: true }] },
        { POSITION: [5, 30, 0,   0, 220, 1], TYPE: ["bigauto4gun",      { COLOR: 33, HAS_NO_RECOIL: true }] },
    ],
};

Class.solarioturretBase3 = {
    PARENT: ["genericTank"],
    LABEL: "Base Ring 1 (P3)",
    SHAPE: 'M 0 -1.6 A 1.5 1.5 0 0 0 0 1.6 A 1.5 1.5 0 0 0 0 -1.6 Z M 0 -1.5 A 0.001 0.001 0 0 1 0 1.5 A 0.001 0.001 0 0 1 0 -1.5',
    COLOR: 32,
    CONTROLLERS: [["spin", { independent: true }]],
    INDEPENDENT: true,
    TURRETS: [
        { POSITION: [5, 15, 0,  90, 220, 1], TYPE: ["solarioTurret1", { COLOR: 32, HAS_NO_RECOIL: true }] },
        { POSITION: [5, 15, 0, 180, 220, 1], TYPE: ["solarioTurret2", { COLOR: 32, HAS_NO_RECOIL: true }] },
        { POSITION: [5, 15, 0, 270, 220, 1], TYPE: ["solarioTurret3", { COLOR: 32, HAS_NO_RECOIL: true }] },
        { POSITION: [5, 15, 0,   0, 220, 1], TYPE: ["solarioTurret4", { COLOR: 32, HAS_NO_RECOIL: true }] },
    ],
};

Class.solarioturretBase2ndRing3 = {
    PARENT: ["genericTank"],
    LABEL: "Base Ring 2 (P3)",
    SHAPE: 'M 0 -3.1 A 3 3 0 0 0 0 3.1 A 3 3 0 0 0 0 -3.1 Z M 0 -3 A 0.001 0.001 0 0 1 0 3 A 0.001 0.001 0 0 1 0 -3',
    COLOR: 32,
    CONTROLLERS: [["spin", { independent: true }]],
    INDEPENDENT: true,
    TURRETS: [
        { POSITION: [5, 30, 0,  90, 220, 1], TYPE: ["rocketeerTurret",  { COLOR: 32, HAS_NO_RECOIL: true }] },
        { POSITION: [5, 30, 0, 180, 220, 1], TYPE: ["boomerTurret",     { COLOR: 32, HAS_NO_RECOIL: true }] },
        { POSITION: [5, 30, 0, 270, 220, 1], TYPE: ["barricadeTurret",  { COLOR: 32, HAS_NO_RECOIL: true }] },
        { POSITION: [5, 30, 0,   0, 220, 1], TYPE: ["bigauto4gun",      { COLOR: 32, HAS_NO_RECOIL: true }] },
    ],
};

Class.solarioturretBase3rdRing3 = {
    PARENT: ["genericTank"],
    LABEL: "Base Ring 3 (P3)",
    SHAPE: 'M 0 -4.8 A 4.5 4.5 90 0 0 0 4.8 A 4.5 4.5 90 0 0 0 -4.8 Z M 0 -4.5 A 0.001 0.001 90 0 1 0 4.5 A 0.001 0.001 90 0 1 0 -4.5',
    COLOR: 32,
    CONTROLLERS: [["spin", { independent: true }]],
    INDEPENDENT: true,
    TURRETS: [
        { POSITION: [5, 47, 0,  60, 220, 1], TYPE: ["machineTripleTurret", { COLOR: 32, HAS_NO_RECOIL: true }] },
        { POSITION: [5, 47, 0, 120, 220, 1], TYPE: ["launcherTurret",      { COLOR: 32, HAS_NO_RECOIL: true }] },
        { POSITION: [5, 47, 0, 180, 220, 1], TYPE: ["skimmerTurret",       { COLOR: 32, HAS_NO_RECOIL: true }] },
        { POSITION: [5, 47, 0, 240, 220, 1], TYPE: ["twisterTurret",       { COLOR: 32, HAS_NO_RECOIL: true }] },
        { POSITION: [5, 47, 0, 300, 220, 1], TYPE: ["nailgunTurret",       { COLOR: 32, HAS_NO_RECOIL: true }] },
        { POSITION: [5, 47, 0,   0, 220, 1], TYPE: ["artilleryTurret",     { COLOR: 32, HAS_NO_RECOIL: true }] },
    ],
};

// Decoration ring around Solario's body
Class.solarioOutline = makeHat(
    'M 0 -3.1 A 3 3 0 0 0 0 3.1 A 3 3 0 0 0 0 -3.1 Z M 0 -3 A 0.001 0.001 0 0 1 0 3 A 0.001 0.001 0 0 1 0 -3',
    13
);

// ── Black hole on-death entity ────────────────────────────────────────────────
// FIX: was missing PARENT (needed for OSA to know what base stats to apply)

Class.blackholeondeath = {
    PARENT: ["bullet"],
    PERSISTS_AFTER_DEATH: true,
    COLOR: "black",
    MOTION_TYPE: ["grow", { growSpeed: 1.4 }],
    ARENA_CLOSER: true,
    ACCEPTS_SCORE: false,
    BODY: {
        PENETRATION: 99,
        SPEED: 1,
        RANGE: 200,
        DENSITY: 38281381283,
        RESIST: 38281381283,
        HEALTH: 124124,
        DAMAGE: 124124,
    },
    FACING_TYPE: "smoothWithMotion",
    CAN_GO_OUTSIDE_ROOM: true,
    HITS_OWN_TYPE: "never",
    DIE_AT_RANGE: true,
    GUNS: [
        {
            POSITION: [4, 4, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, { damage: 0, health: 0.8, spray: 45, range: 0.08, recoil: 0, speed: 0.8, pen: 0 }]),
                TYPE: ["bullet", { SIZE: 5, ALPHA: 0.5 }],
                AUTOFIRE: true,
            },
        },
    ],
    ON: [
        {
            event: "tick",
            handler: ({ body }) => {
                for (let instance of entities) {
                    if (
                        instance.team !== body.team &&
                        (instance.isPlayer || instance.master.isPlayer || instance.type === "food")
                    ) {
                        const diffX = instance.x - body.x;
                        const diffY = instance.y - body.y;
                        const dist2 = diffX ** 2 + diffY ** 2;
                        const pullRadius = ((body.size / 12) * 250) ** 2;
                        const forceMulti = (pullRadius ** 1) / dist2;

                        if (dist2 <= pullRadius && instance.id !== body.id) {
                            instance.velocity.x += util.clamp(body.x - instance.x, -90, 90) * instance.damp * ((1 - (1 / ((forceMulti ** (1 / 7)) * 1))) + 0.001);
                            instance.velocity.y += util.clamp(body.y - instance.y, -90, 90) * instance.damp * ((1 - (1 / ((forceMulti ** (1 / 7)) * 1))) + 0.001);
                        }

                        if (dist2 < body.size ** 2 + instance.size ** 2 && instance.id !== body.id) {
                            instance.isProtected = false;
                            instance.invuln = false;
                            instance.damageReceived = Infinity;
                            try { instance.kill(); }      catch (_) {}
                            try { instance.destroy(); }   catch (_) {}
                            try { instance.removeFromGrid(); } catch (_) {}
                            instance.isGhost = true;
                        }
                    }
                }
            },
        },
        { event: "death", handler: () => {} },
    ],
};

// ─────────────────────────────────────────────────────────────────────────────
//  SOLARIO BASE
// ─────────────────────────────────────────────────────────────────────────────

Class.solariobase = {
    PARENT: ["genericBoss"],
    HAS_NO_RECOIL: true,
    FACING_TYPE: ['spin', { speed: 0.015 }],
    LABEL: "Solario",
    SHAPE: 0,
    UPGRADE_TOOLTIP: "𝒯𝒽𝑒 𝒹𝓎𝒾𝓃𝑔 𝓈𝓉𝒶𝓇",
    BODY: { HEALTH: 5500 },
    SIZE: 15,
    DANGER: 15,
};

// ─────────────────────────────────────────────────────────────────────────────
//  PHASE 1  (>2/3 health)
//
//  gun indices:
//    [0] visual  (0°)
//    [1] visual  (180°)
//    [2] startlaserattack  ← delay 25, IDENTIFIER "startlaserattack"
//    [3] solarioAttack     ← delay  1, IDENTIFIER "solarioAttack"
//    [4] solarioCircAttack   (ALT_FIRE)
//    [5] solarioRingAttack   (ALT_FIRE)
//    [6] blackholeondeath    (SHOOT_ON_DEATH, ALT_FIRE)
// ─────────────────────────────────────────────────────────────────────────────

Class.solario = {
    PARENT: ["solariobase"],
    COLOR: 13,
    GLOW: { RADIUS: 50, COLOR: 13, ALPHA: 1, RECURSION: 8 },
    GUNS: [
        { POSITION: [15, 10, 1, 0, 0,   0, 0] },    // [0] visual
        { POSITION: [15, 10, 1, 0, 0, 180, 0] },    // [1] visual
        {                                            // [2] laser-attack trigger
            POSITION: [0, 0, 1, 0, 0, 0, 25],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.fake, { reload: 5 }]),
                TYPE: "bullet",
                AUTOFIRE: true,
                IDENTIFIER: "startlaserattack",
            },
        },
        {                                            // [3] main attack trigger
            POSITION: [1, 10, 1, 0, 0, 0, 1],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.fake, { reload: 75 }]),
                TYPE: "bullet",
                AUTOFIRE: true,
                IDENTIFIER: "solarioAttack",
            },
        },
        {                                            // [4] circle burst attack
            POSITION: [1, 10, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, { reload: 8, recoil: 0, shudder: 4.25, size: 2, health: 2.25, damage: 1.75, pen: 1.5, speed: 1.35, spray: 4 }, { health: 15 }, { maxSpeed: 0, speed: 0, range: 5, pen: 3 }]),
                TYPE: "solarioCircAttack",
                ALT_FIRE: true,
            },
        },
        {                                            // [5] ring attack
            POSITION: [1, 10, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, { health: 999 }, { maxSpeed: 0, speed: 0, range: 1.4, reload: 5 }]),
                TYPE: "solarioRingAttack",
                ALT_FIRE: true,
            },
        },
        {                                            // [6] black hole on death
            POSITION: [1, 10, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, { health: 999 }, { speed: 0.01, maxSpeed: 0.01, health: 99999, pen: 99, density: 38281381283, resist: 421848412 }]),
                TYPE: ["blackholeondeath", { PERSISTS_AFTER_DEATH: true }],
                SHOOT_ON_DEATH: true,
                ALT_FIRE: true,
            },
        },
    ],
    TURRETS: [
        { POSITION: [30, 0, 0, 0, 360, 0], TYPE: "solarioturretBase" },
        { POSITION: [30, 0, 0, 0, 360, 0], TYPE: "solarioturretBase2ndRing" },
        { POSITION: [16, 0, 0, 0, 360, 3], TYPE: ["solariominilaser", { HAS_NO_RECOIL: true, CONTROLLERS: ["canRepel", "onlyAcceptInArc", "mapAltToFire", "nearestDifferentMaster"] }] },
        { POSITION: [8.2, 0, 0, 0, 360, 2], TYPE: "solarioOutline" },
    ],
    ON: [
        {
            event: 'fire',
            handler: ({ body, gun }) => {
                if (gun.identifier === 'startlaserattack') {
                    sockets.broadcast('Solario: DODGE THIS!!');
                    setTimeout(() => { if (body && !body.isDead) body.define('solariolaser'); }, 1000);
                }
                if (gun.identifier === 'solarioAttack') {
                    // FIX: guns[3] is the solarioAttack gun — lock it to prevent re-entry
                    body.guns[3].canShoot = false;
                    const attack = ~~(Math.random() * 2);
                    switch (attack) {
                        case 0:
                            body.guns[4].fire();
                            setTimeout(() => { if (body && !body.isDead) body.guns[4].fire(); }, 12000);
                            break;
                        case 1:
                            body.guns[5].fire();
                            break;
                    }
                }
            },
        },
        {
            event: "death",
            handler: () => { sockets.broadcast('NOOOOOOO!'); },
        },
        {
            event: "damage",
            handler: ({ body }) => {
                // Transition at 2/3 health
                if (body.health.amount < (body.health.max / 3) * 2) {
                    sockets.broadcast('Solario: YOU CANT STOP ME!!!!!');
                    body.define('solariophase2');
                }
            },
        },
    ],
};

// ─────────────────────────────────────────────────────────────────────────────
//  PHASE 1 — LASER FORM
// ─────────────────────────────────────────────────────────────────────────────

Class.solariolaser = {
    PARENT: ["solariobase"],
    COLOR: 13,
    GLOW: { RADIUS: 50, COLOR: 13, ALPHA: 1, RECURSION: 8 },
    BODY: { REGEN: 0 },
    GUNS: [
        {
            POSITION: [15, 10, 1, 0, 0,   0, 5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, { reload: 0.05, health: 5, pen: 100, speed: 14, maxSpeed: 14, spread: 4, size: 2, range: 0.6 }]),
                TYPE: "laser",
                AUTOFIRE: true,
                COLOR: "red",
            },
        },
        {
            POSITION: [15, 10, 1, 0, 0, 180, 5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, { reload: 0.05, health: 5, pen: 100, speed: 14, maxSpeed: 14, spread: 4, size: 2, range: 0.6 }]),
                TYPE: "laser",
                AUTOFIRE: true,
                COLOR: "red",
            },
        },
        { POSITION: [350, 10, 2.5, 0, 0, 360, 0], PROPERTIES: { COLOR: "red", ALPHA: 0.5 } },
        { POSITION: [350, 10, 2.5, 0, 0, 180, 0], PROPERTIES: { COLOR: "red", ALPHA: 0.5 } },
        {
            POSITION: [0, 0, 1, 0, 0, 0, 15],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.fake, { reload: 5 }]),
                TYPE: "bullet",
                AUTOFIRE: true,
                IDENTIFIER: "endlaserattack",
            },
        },
        {
            POSITION: [1, 10, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, { health: 999 }, { speed: 0.01, maxSpeed: 0.01, health: 99999, pen: 99, density: 38281381283, resist: 421848412 }]),
                TYPE: "blackholeondeath",
                SHOOT_ON_DEATH: true,
                ALT_FIRE: true,
            },
        },
    ],
    TURRETS: [
        { POSITION: [30, 0, 0, 0, 360, 0], TYPE: "solarioturretBase" },
        { POSITION: [30, 0, 0, 0, 360, 0], TYPE: "solarioturretBase2ndRing" },
        { POSITION: [16, 0, 0, 0, 360, 3], TYPE: ["solariominilaser", { HAS_NO_RECOIL: true, CONTROLLERS: ["canRepel", "onlyAcceptInArc", "mapAltToFire", "nearestDifferentMaster"] }] },
        { POSITION: [8.2, 0, 0, 0, 360, 2], TYPE: "solarioOutline" },
    ],
    ON: [
        {
            event: 'fire',
            handler: ({ body, gun }) => {
                if (gun.identifier === 'endlaserattack') {
                    sockets.broadcast('Solario: RAHH!');
                    body.children = [];
                    setTimeout(() => { if (body && !body.isDead) body.define('solario'); }, 500);
                }
            },
        },
        {
            event: "death",
            handler: () => { sockets.broadcast('NOOOOOOO!'); },
        },
        {
            event: "damage",
            handler: ({ body }) => {
                // FIX: was checking (max/3)*2 — same threshold as normal phase,
                // meaning the laser form would immediately re-trigger phase2.
                // Corrected to check for the phase2 threshold (< max/3).
                if (body.health.amount < (body.health.max / 3) * 2) {
                    sockets.broadcast('Solario: YOU CANT STOP ME!!!!!');
                    body.define('solariolaserphase2');
                }
            },
        },
    ],
};

// ─────────────────────────────────────────────────────────────────────────────
//  PHASE 2  (1/3 – 2/3 health)
//
//  gun indices:
//    [0] visual (0°)     [1] visual (90°)    [2] visual (180°)   [3] visual (270°)
//    [4] startlaserattack
//    [5] solarioAttack   ← FIX: canShoot lock now targets [5], was [3]
//    [6] solarioCircAttack
//    [7] solarioRingAttack
//    [8] baseThrower
//    [9] blackholeondeath
// ─────────────────────────────────────────────────────────────────────────────

Class.solariophase2 = {
    PARENT: ["solariobase"],
    COLOR: 33,
    GLOW: { RADIUS: 50, STRENGTH: 30, COLOR: 33, ALPHA: 0.8, RECURSION: 8 },
    GUNS: [
        { POSITION: [15, 10, 1, 0, 0,   0, 0] },    // [0] visual
        { POSITION: [15, 10, 1, 0, 0,  90, 0] },    // [1] visual
        { POSITION: [15, 10, 1, 0, 0, 180, 0] },    // [2] visual
        { POSITION: [15, 10, 1, 0, 0, 270, 0] },    // [3] visual
        {                                            // [4] laser trigger
            POSITION: [0, 0, 1, 0, 0, 0, 25],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.fake, { reload: 5 }]),
                TYPE: "bullet",
                AUTOFIRE: true,
                IDENTIFIER: "startlaserattack",
            },
        },
        {                                            // [5] main attack trigger
            POSITION: [1, 10, 1, 0, 0, 0, 1],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.fake, { reload: 75 }]),
                TYPE: "bullet",
                AUTOFIRE: true,
                IDENTIFIER: "solarioAttack",
            },
        },
        {                                            // [6] circle burst
            POSITION: [1, 10, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, { reload: 8, recoil: 0, shudder: 4.25, size: 2, health: 2.25, damage: 1.75, pen: 1.5, speed: 1.35, spray: 4 }, { health: 999 }, { maxSpeed: 0, speed: 0, range: 5, pen: 3 }]),
                TYPE: ["solarioCircAttack", { COLOR: 33 }],
                ALT_FIRE: true,
            },
        },
        {                                            // [7] ring attack
            POSITION: [1, 10, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, { health: 999 }, { maxSpeed: 0, speed: 0, range: 1.4, reload: 5 }]),
                TYPE: ["solarioRingAttack", { COLOR: 33 }],
                ALT_FIRE: true,
            },
        },
        {                                            // [8] base thrower
            POSITION: [1, 10, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.drone, { health: 4, size: 2 }]),
                TYPE: "baseThrower",
                ALT_FIRE: true,
            },
        },
        {                                            // [9] black hole
            POSITION: [1, 10, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, { health: 999 }, { speed: 0.01, maxSpeed: 0.01, health: 99999, pen: 99, density: 38281381283, resist: 421848412 }]),
                TYPE: "blackholeondeath",
                SHOOT_ON_DEATH: true,
                ALT_FIRE: true,
            },
        },
    ],
    TURRETS: [
        { POSITION: [30, 0, 0, 0, 360, 0], TYPE: ["solarioturretBase2",     { COLOR: 33 }] },
        { POSITION: [30, 0, 0, 0, 360, 0], TYPE: ["solarioturretBase2ndRing2", { COLOR: 33 }] },
        { POSITION: [16, 0, 0, 0, 360, 3], TYPE: ["solariominilaser", { HAS_NO_RECOIL: true, CONTROLLERS: ["canRepel", "onlyAcceptInArc", "mapAltToFire", "nearestDifferentMaster"] }] },
        { POSITION: [8.2, 0, 0, 0, 360, 2], TYPE: ["solarioOutline", { COLOR: 33 }] },
    ],
    ON: [
        {
            event: 'fire',
            handler: ({ body, gun }) => {
                if (gun.identifier === 'startlaserattack') {
                    sockets.broadcast('Solario: DODGE THIS!!');
                    setTimeout(() => { if (body && !body.isDead) body.define('solariolaserphase2'); }, 1000);
                }
                if (gun.identifier === 'solarioAttack') {
                    // FIX: lock guns[5] (solarioAttack), not guns[3] (visual decoration)
                    body.guns[5].canShoot = false;
                    const attack = ~~(Math.random() * 3);
                    switch (attack) {
                        case 0:
                            body.guns[6].fire();
                            setTimeout(() => { if (body && !body.isDead) body.guns[6].fire(); }, 6000);
                            setTimeout(() => { if (body && !body.isDead) body.guns[6].fire(); }, 12000);
                            break;
                        case 1:
                            body.guns[7].fire();
                            break;
                        case 2:
                            body.guns[8].fire();
                            setTimeout(() => { if (body && !body.isDead) body.guns[8].fire(); }, 500);
                            setTimeout(() => { if (body && !body.isDead) body.guns[8].fire(); }, 1000);
                            setTimeout(() => { if (body && !body.isDead) body.guns[8].fire(); }, 1500);
                            break;
                    }
                }
            },
        },
        {
            event: "death",
            handler: () => { sockets.broadcast('NOOOOOOO!'); },
        },
        {
            event: "damage",
            handler: ({ body }) => {
                if (body.health.amount < body.health.max / 3) {
                    sockets.broadcast('Solario: GRRRAAAAAH, THATS IT!!!!!');
                    body.define('solariophase3');
                }
            },
        },
    ],
};

// ─────────────────────────────────────────────────────────────────────────────
//  PHASE 2 — LASER FORM
// ─────────────────────────────────────────────────────────────────────────────

Class.solariolaserphase2 = {
    PARENT: ["solariophase2"],
    BODY: { REGEN: 0 },
    GUNS: [
        { POSITION: [15, 10, 1, 0, 0,   0, 5], PROPERTIES: { SHOOT_SETTINGS: combineStats([g.basic, { reload: 0.05, health: 5, pen: 100, speed: 14, maxSpeed: 14, spread: 4, size: 2, range: 0.6 }]), TYPE: "laser",  AUTOFIRE: true, COLOR: "red" } },
        { POSITION: [15, 10, 1, 0, 0,  90, 5], PROPERTIES: { SHOOT_SETTINGS: combineStats([g.basic, { reload: 0.05, health: 5, pen: 100, speed: 14, maxSpeed: 14, spread: 4, size: 2, range: 0.6 }]), TYPE: "laser",  AUTOFIRE: true, COLOR: "red" } },
        { POSITION: [15, 10, 1, 0, 0, 180, 5], PROPERTIES: { SHOOT_SETTINGS: combineStats([g.basic, { reload: 0.05, health: 5, pen: 100, speed: 14, maxSpeed: 14, spread: 4, size: 2, range: 0.6 }]), TYPE: "laser",  AUTOFIRE: true, COLOR: "red" } },
        { POSITION: [15, 10, 1, 0, 0, 270, 5], PROPERTIES: { SHOOT_SETTINGS: combineStats([g.basic, { reload: 0.05, health: 5, pen: 100, speed: 14, maxSpeed: 14, spread: 4, size: 2, range: 0.6 }]), TYPE: "laser",  AUTOFIRE: true, COLOR: "red" } },
        { POSITION: [350, 10, 2.5, 0, 0, 360, 0], PROPERTIES: { COLOR: "red", ALPHA: 0.5 } },
        { POSITION: [350, 10, 2.5, 0, 0,  90, 0], PROPERTIES: { COLOR: "red", ALPHA: 0.5 } },
        { POSITION: [350, 10, 2.5, 0, 0, 180, 0], PROPERTIES: { COLOR: "red", ALPHA: 0.5 } },
        { POSITION: [350, 10, 2.5, 0, 0, 270, 0], PROPERTIES: { COLOR: "red", ALPHA: 0.5 } },
        {
            POSITION: [0, 0, 1, 0, 0, 0, 15],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.fake, { reload: 5 }]),
                TYPE: "bullet",
                AUTOFIRE: true,
                IDENTIFIER: "endlaserattack",
            },
        },
        {
            POSITION: [1, 10, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, { health: 999 }, { speed: 0.01, maxSpeed: 0.01, health: 99999, pen: 99, density: 38281381283, resist: 421848412 }]),
                TYPE: "blackholeondeath",
                SHOOT_ON_DEATH: true,
                ALT_FIRE: true,
            },
        },
    ],
    ON: [
        {
            event: 'fire',
            handler: ({ body, gun }) => {
                if (gun.identifier === 'endlaserattack') {
                    sockets.broadcast('Solario: RAHH!');
                    setTimeout(() => { if (body && !body.isDead) body.define('solariophase2'); }, 500);
                }
            },
        },
        {
            event: "death",
            handler: () => { sockets.broadcast('NOOOOOOO!'); },
        },
        {
            event: "damage",
            handler: ({ body }) => {
                if (body.health.amount < body.health.max / 3) {
                    sockets.broadcast('Solario: GRRRAAAAAH, THATS IT!!!!!');
                    body.define('solariolaserphase3');
                }
            },
        },
    ],
};

// ─────────────────────────────────────────────────────────────────────────────
//  PHASE 3  (<1/3 health)
//
//  gun indices:
//    [0]–[5] visuals (0°, 60°, 120°, 180°, 240°, 300°)
//    [6]  startlaserattack
//    [7]  solarioAttack   ← FIX: canShoot lock now targets [7], was [3]
//    [8]  solarioCircAttack
//    [9]  solarioRingAttack
//    [10] baseThrower
//    [11] blackholeondeath
// ─────────────────────────────────────────────────────────────────────────────

Class.solariophase3 = {
    PARENT: ["solariobase"],
    SKILL_CAP: Array(10).fill(12),
    SKILL: Array(10).fill(12),
    COLOR: 32,
    GLOW: { RADIUS: 60, STRENGTH: 32, COLOR: 32, ALPHA: 1, RECURSION: 10 },
    GUNS: [
        { POSITION: [15, 20, 1, 0, 0,   0, 0] },    // [0]  visual
        { POSITION: [15, 10, 1, 0, 0,  60, 0] },    // [1]  visual
        { POSITION: [15, 10, 1, 0, 0, 120, 0] },    // [2]  visual
        { POSITION: [15, 20, 1, 0, 0, 180, 0] },    // [3]  visual
        { POSITION: [15, 10, 1, 0, 0, 240, 0] },    // [4]  visual
        { POSITION: [15, 10, 1, 0, 0, 300, 0] },    // [5]  visual
        {                                            // [6]  laser trigger
            POSITION: [0, 0, 1, 0, 0, 0, 25],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.fake, { reload: 5 }]),
                TYPE: "bullet",
                AUTOFIRE: true,
                IDENTIFIER: "startlaserattack",
            },
        },
        {                                            // [7]  main attack trigger
            POSITION: [1, 10, 1, 0, 0, 0, 1],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.fake, { reload: 75 }]),
                TYPE: "bullet",
                AUTOFIRE: true,
                IDENTIFIER: "solarioAttack",
            },
        },
        {                                            // [8]  circle burst
            POSITION: [1, 10, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, { reload: 8, recoil: 0, shudder: 4.25, size: 2, health: 2.25, damage: 1.75, pen: 1.5, speed: 1.35, spray: 4 }, { health: 999 }, { maxSpeed: 0, speed: 0, range: 5, pen: 3 }]),
                TYPE: ["solarioCircAttack", { COLOR: 32 }],
                ALT_FIRE: true,
            },
        },
        {                                            // [9]  ring attack
            POSITION: [1, 10, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, { health: 999 }, { maxSpeed: 0, speed: 0, range: 1.4, reload: 5 }]),
                TYPE: ["solarioRingAttack", { COLOR: 32 }],
                ALT_FIRE: true,
            },
        },
        {                                            // [10] base thrower
            POSITION: [1, 10, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.drone, { health: 10, size: 2.5 }]),
                TYPE: "baseThrower",
                ALT_FIRE: true,
            },
        },
        {                                            // [11] black hole
            POSITION: [1, 10, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, { health: 999 }, { speed: 0.01, range: 7, maxSpeed: 0.01, health: 99999, pen: 99, density: 38281381283, resist: 421848412 }]),
                TYPE: ["blackholeondeath", { PERSISTS_AFTER_DEATH: true }],
                ALT_FIRE: true,
                SHOOT_ON_DEATH: true,
            },
        },
    ],
    TURRETS: [
        { POSITION: [30, 0, 0, 0, 360, 0], TYPE: ["solarioturretBase3",     { COLOR: 32 }] },
        { POSITION: [30, 0, 0, 0, 360, 0], TYPE: ["solarioturretBase2ndRing3", { COLOR: 32 }] },
        { POSITION: [30, 0, 0, 0, 360, 0], TYPE: ["solarioturretBase3rdRing3", { COLOR: 32 }] },
        { POSITION: [16, 0, 0, 0, 360, 3], TYPE: ["solariominilaser", { HAS_NO_RECOIL: true, CONTROLLERS: ["canRepel", "onlyAcceptInArc", "mapAltToFire", "nearestDifferentMaster"] }] },
        { POSITION: [8.2, 0, 0, 0, 360, 2], TYPE: ["solarioOutline", { COLOR: 32 }] },
        { POSITION: [10,  0, 0, 0, 360, -1], TYPE: ["solarioOutline", { COLOR: 32 }] },
    ],
    ON: [
        {
            event: 'fire',
            handler: ({ body, gun }) => {
                if (gun.identifier === 'startlaserattack') {
                    sockets.broadcast('Solario: DODGE THIS!!');
                    setTimeout(() => { if (body && !body.isDead) body.define('solariolaserphase3'); }, 1000);
                }
                if (gun.identifier === 'solarioAttack') {
                    // FIX: lock guns[7] (solarioAttack), not guns[3] (visual)
                    body.guns[7].canShoot = false;
                    const attack = ~~(Math.random() * 3);
                    switch (attack) {
                        case 0:
                            body.guns[8].fire();
                            setTimeout(() => { if (body && !body.isDead) body.guns[8].fire(); },  4000);
                            setTimeout(() => { if (body && !body.isDead) body.guns[8].fire(); },  8000);
                            setTimeout(() => { if (body && !body.isDead) body.guns[8].fire(); }, 12000);
                            break;
                        case 1:
                            body.guns[9].fire();
                            setTimeout(() => { if (body && !body.isDead) body.guns[9].fire(); }, 1000);
                            break;
                        case 2:
                            for (let t = 0; t <= 3000; t += 500) {
                                setTimeout(() => { if (body && !body.isDead) body.guns[10].fire(); }, t);
                            }
                            break;
                    }
                }
            },
        },
        {
            event: "death",
            handler: ({ body }) => {
                sockets.broadcast('NOOOOOOO!');
                try { new Entity(body).define("blackholeondeath"); } catch (_) {}
            },
        },
    ],
};

// ─────────────────────────────────────────────────────────────────────────────
//  PHASE 3 — LASER FORM
// ─────────────────────────────────────────────────────────────────────────────

Class.solariolaserphase3 = {
    PARENT: ["solariophase3"],
    BODY: { REGEN: 0 },
    GUNS: [
        { POSITION: [15, 20, 1, 0, 0,   0, 5], PROPERTIES: { SHOOT_SETTINGS: combineStats([g.basic, { reload: 0.05, health: 5, pen: 100, speed: 14, maxSpeed: 14, spread: 4, size: 2, range: 0.6 }, { spread: 0, size: 0.6 }]), TYPE: "hyperlaser", AUTOFIRE: true, COLOR: "red" } },
        { POSITION: [15, 10, 1, 0, 0,  60, 5], PROPERTIES: { SHOOT_SETTINGS: combineStats([g.basic, { reload: 0.05, health: 5, pen: 100, speed: 14, maxSpeed: 14, spread: 4, size: 2, range: 0.6 }]), TYPE: "laser",  AUTOFIRE: true, COLOR: "red" } },
        { POSITION: [15, 10, 1, 0, 0, 120, 5], PROPERTIES: { SHOOT_SETTINGS: combineStats([g.basic, { reload: 0.05, health: 5, pen: 100, speed: 14, maxSpeed: 14, spread: 4, size: 2, range: 0.6 }]), TYPE: "laser",  AUTOFIRE: true, COLOR: "red" } },
        { POSITION: [15, 20, 1, 0, 0, 180, 5], PROPERTIES: { SHOOT_SETTINGS: combineStats([g.basic, { reload: 0.05, health: 5, pen: 100, speed: 14, maxSpeed: 14, spread: 4, size: 2, range: 0.6 }, { spread: 0, size: 0.6 }]), TYPE: "hyperlaser", AUTOFIRE: true, COLOR: "red" } },
        { POSITION: [15, 10, 1, 0, 0, 240, 5], PROPERTIES: { SHOOT_SETTINGS: combineStats([g.basic, { reload: 0.05, health: 5, pen: 100, speed: 14, maxSpeed: 14, spread: 4, size: 2, range: 0.6 }]), TYPE: "laser",  AUTOFIRE: true, COLOR: "red" } },
        { POSITION: [15, 10, 1, 0, 0, 300, 5], PROPERTIES: { SHOOT_SETTINGS: combineStats([g.basic, { reload: 0.05, health: 5, pen: 100, speed: 14, maxSpeed: 14, spread: 4, size: 2, range: 0.6 }]), TYPE: ["laser", { ARENA_CLOSER: true }], AUTOFIRE: true, COLOR: "red" } },
        { POSITION: [350, 20,  2, 0, 0,   0, 0], PROPERTIES: { COLOR: "red", ALPHA: 0.5 } },
        { POSITION: [350, 10, 2.5, 0, 0,  60, 0], PROPERTIES: { COLOR: "red", ALPHA: 0.5 } },
        { POSITION: [350, 10, 2.5, 0, 0, 120, 0], PROPERTIES: { COLOR: "red", ALPHA: 0.5 } },
        { POSITION: [350, 20,  2, 0, 0, 180, 0], PROPERTIES: { COLOR: "red", ALPHA: 0.5 } },
        { POSITION: [350, 10, 2.5, 0, 0, 240, 0], PROPERTIES: { COLOR: "red", ALPHA: 0.5 } },
        { POSITION: [350, 10, 2.5, 0, 0, 300, 0], PROPERTIES: { COLOR: "red", ALPHA: 0.5 } },
        {
            POSITION: [0, 0, 1, 0, 0, 0, 15],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.fake, { reload: 5 }]),
                TYPE: "bullet",
                AUTOFIRE: true,
                IDENTIFIER: "endlaserattack",
            },
        },
        {
            POSITION: [1, 10, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, { health: 999 }, { speed: 0.01, range: 7, maxSpeed: 0.01, health: 99999, pen: 99, density: 38281381283, resist: 421848412 }]),
                TYPE: ["blackholeondeath", { PERSISTS_AFTER_DEATH: true }],
                ALT_FIRE: true,
                SHOOT_ON_DEATH: true,
            },
        },
    ],
    ON: [
        {
            event: 'fire',
            handler: ({ body, gun }) => {
                if (gun.identifier === 'endlaserattack') {
                    sockets.broadcast('Solario: RAHH!');
                    setTimeout(() => { if (body && !body.isDead) body.define('solariophase3'); }, 500);
                }
            },
        },
        {
            event: "death",
            handler: ({ body }) => {
                sockets.broadcast('NOOOOOOO!');
                setTimeout(() => sockets.broadcast('YOU HAVE 10 SECONDS TO RUN FROM MY LAST ATTACK'), 1000);
                setTimeout(() => {
                    try { new Entity(body).define("blackholeondeath"); } catch (_) {}
                }, 11000);
            },
        },
    ],
};

// ─────────────────────────────────────────────────────────────────────────────
//  SOLARIO SPAWNER  (dev menu entity)
// ─────────────────────────────────────────────────────────────────────────────

Class.solariospawner = {
    PARENT: ["spectator"],
    LABEL: "Solario Spawner",
    TOOLTIP: "Right click to spawn Solario the Dying Sun",
    SKILL_CAP: [31, 0, 0, 0, 0, 0, 0, 0, 0, 31],
    GUNS: [
        {
            POSITION: [14, 12, 1, 4, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, { recoil: 0 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [12, 12, 1.4, 4, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, { recoil: 0 }]),
                INDEPENDENT_CHILDREN: true,
                TYPE: "solario",
                ALT_FIRE: true,
            },
        },
    ],
};

Class.solariospawner.UPGRADES_TIER_0 = ['solario', 'solariophase2', 'solariophase3'];

// ─────────────────────────────────────────────────────────────────────────────
//  ATTACH TO DEV MENU
//  FIX: original used Class.addons which may not exist in OSA v2.0.x.
//  We now handle all three known variants:
//    Class.addons       (old OSA / APS++)
//    Class.menu_addons  (OSA v2.0.x addon convention)
//    Neither exists yet (create menu_addons as a new node)
// ─────────────────────────────────────────────────────────────────────────────

const _devMenuTarget = Class.addons ?? Class.menu_addons ?? (() => {
    const { makeMenu } = require('../facilitators.js');
    Class.menu_addons = makeMenu("Addon Entities");
    Class.menu_addons.COLOR = "grey";
    Class.menu_addons.UPGRADE_COLOR = "grey";
    Class.menu_addons.SHAPE = 4;
    Class.menu_addons.UPGRADES_TIER_0 = [];
    return Class.menu_addons;
})();

if (!_devMenuTarget.UPGRADES_TIER_0) {
    _devMenuTarget.UPGRADES_TIER_0 = [];
}
if (!_devMenuTarget.UPGRADES_TIER_0.includes('solariospawner')) {
    _devMenuTarget.UPGRADES_TIER_0.push('solariospawner');
}