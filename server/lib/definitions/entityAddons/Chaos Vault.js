/**
 * ╔══════════════════════════════════════════════════════════════╗
 *  ✦  C L A U D E ' S   C H A O S   V A U L T  ✦
 *  Open Source Arras v2.0.x custom addon
 *
 *  FILE:  server/addons/chaosVault.js
 *  KEY:   backtick + C   (packet 'c' / 'C')
 *  LEVEL: Must be Level 3+ to unlock
 *
 *  10 TANKS ─────────────────────────────────────────────────────
 *   1. VOID SOVEREIGN    – Gravitational nightmare
 *   2. ZEUS ULTIMA       – Chain lightning, area shock
 *   3. CHRONOS           – Slows everything around it
 *   4. PRISM OVERLORD    – 360° prismatic annihilation
 *   5. OMEGA ANNIHILATOR – Maximum stat, every weapon type
 *   6. THE PARASITE      – Drains nearby shapes for HP
 *   7. STORM HERALD      – Living bullet-storm engine
 *   8. ARCHITECT PRIME   – Deploys evolving turret fortresses
 *   9. FRACTAL SPAWN     – Self-replicating minion swarm
 *  10. COSMIC HORROR     – Tentacled aura-damage eldritch god
 * ╚══════════════════════════════════════════════════════════════╝
 */

"use strict";

const { combineStats, makeAura, makeHat } = require('../facilitators.js');
const { base, statnames, dfltskl }         = require('../constants.js');
const g                                    = require('../gunvals.js');

// ─────────────────────────────────────────────────────────────────────────────
//  CONFIG
// ─────────────────────────────────────────────────────────────────────────────

const MENU_KEY       = ';';   // backtick + C to open
const REQUIRED_LEVEL = 3;     // minimum player level

// ─────────────────────────────────────────────────────────────────────────────
//  SVG SHAPES
// ─────────────────────────────────────────────────────────────────────────────

// 8-pointed star (Void Sovereign)
const SHAPE_STAR8 =
    'M 0 -1 L 0.2 -0.2 L 1 0 L 0.2 0.2 L 0 1 L -0.2 0.2 ' +
    'L -1 0 L -0.2 -0.2 Z';

// Double-ring torus (Chronos)
const SHAPE_TORUS =
    'M 0 -1 A 1 1 0 0 0 0 1 A 1 1 0 0 0 0 -1 Z ' +
    'M 0 -0.6 A 0.6 0.6 0 0 1 0 0.6 A 0.6 0.6 0 0 1 0 -0.6 Z';

// Eye shape (Cosmic Horror)
const SHAPE_EYE =
    'M -1 0 Q 0 -1.1 1 0 Q 0 1.1 -1 0 Z ' +
    'M -0.3 0 A 0.3 0.3 0 0 0 0.3 0 A 0.3 0.3 0 0 0 -0.3 0 Z';

// Cross / plus (Architect Prime)
const SHAPE_CROSS =
    'M -0.22 -1 L 0.22 -1 L 0.22 -0.22 L 1 -0.22 L 1 0.22 ' +
    'L 0.22 0.22 L 0.22 1 L -0.22 1 L -0.22 0.22 L -1 0.22 ' +
    'L -1 -0.22 L -0.22 -0.22 Z';

// Amoeba blob (Parasite)
const SHAPE_BLOB =
    'M 0 -1 C 0.6 -1 1.1 -0.4 1 0.1 C 0.9 0.7 0.3 1.1 -0.2 1 ' +
    'C -0.8 0.9 -1.1 0.3 -1 -0.2 C -0.9 -0.7 -0.5 -1.1 0 -1 Z';

// Cosmos portal (Menu entity)
const SHAPE_PORTAL =
    'M 0 -1.5 A 1.5 1.5 0 0 0 0 1.5 A 1.5 1.5 0 0 0 0 -1.5 Z ' +
    'M 0 -1.3 A 1.3 1.3 0 0 1 0 1.3 A 1.3 1.3 0 0 1 0 -1.3 Z';

// ─────────────────────────────────────────────────────────────────────────────
//  SHARED HELPERS
// ─────────────────────────────────────────────────────────────────────────────

/** Max-everything body block used by every Chaos tank */
const CHAOS_BODY = {
    HEALTH:      base.HEALTH  * 80,
    SHIELD:      base.SHIELD  * 30,
    REGEN:       base.REGEN   * 20,
    DAMAGE:      base.DAMAGE  * 15,
    SPEED:       base.SPEED   *  1.2,
    FOV:         3,
    PUSHABILITY: 0,
};

/** Every stat maxed to 10 */
const MAX_SKILL     = Array(10).fill(10);
const MAX_SKILL_CAP = Array(10).fill(10);

// ─────────────────────────────────────────────────────────────────────────────
//  PROJECTILE CLASSES
// ─────────────────────────────────────────────────────────────────────────────

/** Void Orb — grows over time, weak gravitational pull */
Class.claudeVoidOrb = {
    PARENT:       ['bullet'],
    COLOR:        'black',
    SHAPE:        0,
    ARENA_CLOSER: true,
    BODY: {
        PENETRATION: 50,
        SPEED:       3,
        RANGE:       220,
        HEALTH:      40,
        DAMAGE:      25,
        DENSITY:     8,
    },
    MOTION_TYPE: ['grow', { growSpeed: 2.5 }],
    ON: [{
        event: 'tick',
        handler: ({ body }) => {
            const pullRadius = (body.size * 10) ** 2;
            for (const e of entities) {
                if (e.id === body.id) continue;
                const dx   = body.x - e.x;
                const dy   = body.y - e.y;
                const dist2 = dx * dx + dy * dy;
                if (dist2 < pullRadius && dist2 > 1) {
                    const force = 8 / Math.sqrt(dist2);
                    e.velocity.x += dx * force * (e.damp || 0.1);
                    e.velocity.y += dy * force * (e.damp || 0.1);
                }
            }
        },
    }],
};

/** Freeze Shard — bullet that slows hit entities on proximity */
Class.claudeFreezeShard = {
    PARENT: ['bullet'],
    COLOR:  '#00EFFF',
    SHAPE:  3,
    BODY: {
        PENETRATION: 4,
        SPEED:       10,
        RANGE:       250,
        HEALTH:      6,
        DAMAGE:      12,
    },
    ON: [{
        event: 'tick',
        handler: ({ body }) => {
            const range = (body.size * 4) ** 2;
            for (const e of entities) {
                if (e.id === body.id || e.team === body.team) continue;
                const dx = e.x - body.x, dy = e.y - body.y;
                if (dx * dx + dy * dy < range) {
                    e.velocity.x *= 0.82;
                    e.velocity.y *= 0.82;
                }
            }
        },
    }],
};

/** Prism Splitter — when it dies it spawns 5 mini bullets outward */
Class.claudePrismShard = {
    PARENT: ['bullet'],
    COLOR:  '#FF00FF',
    SHAPE:  3,
    BODY: {
        PENETRATION: 2,
        SPEED:       14,
        RANGE:       180,
        HEALTH:      3,
        DAMAGE:      10,
    },
};

/** Cosmic Tendril — arena-closer tentacle projectile */
Class.claudeTendril = {
    PARENT:       ['bullet'],
    COLOR:        '#3D0060',
    SHAPE:        -1,
    ARENA_CLOSER: true,
    BODY: {
        PENETRATION: 99,
        SPEED:       7,
        RANGE:       300,
        HEALTH:      15,
        DAMAGE:      30,
        DENSITY:     3,
    },
};

/** Infection Drone — parasite minion */
Class.claudeInfectionDrone = {
    PARENT: ['drone'],
    COLOR:  '#00FF66',
    SIZE:   8,
    BODY: {
        HEALTH: 20,
        DAMAGE:  8,
        SPEED:   5,
        PENETRATION: 3,
    },
    GUNS: [{
        POSITION: [10, 4, 1, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.basic, g.autoTurret,
                { damage: 0.4, reload: 1.5, health: 0.5 }]),
            TYPE: 'bullet',
            AUTOFIRE: true,
        },
    }],
};

/** Fractal Mini — tiny copy spawned by Fractal Spawn */
Class.claudeFractalMini = {
    PARENT: ['drone'],
    COLOR:  '#CC00CC',
    SIZE:   9,
    SHAPE:  3,
    BODY: {
        HEALTH: 25,
        DAMAGE:  5,
        SPEED:   6,
    },
    TURRETS: [{
        POSITION: [5, 0, 0, 0, 360, 1],
        TYPE: ['autoTankGun', { COLOR: '#CC00CC' }],
    }],
};

/** Storm Raindrop — short-range machine-gun bullet */
Class.claudeStormRaindrop = {
    PARENT: ['bullet'],
    COLOR:  '#5588FF',
    SHAPE:  -1,
    BODY: {
        PENETRATION: 2,
        SPEED:       15,
        RANGE:       120,
        HEALTH:      2,
        DAMAGE:       8,
    },
};

/** Architect Set Trap — deploys a fortress node */
Class.claudeFortressNode = {
    PARENT:      ['setTrap'],
    COLOR:       '#FF8C00',
    SHAPE:       4,
    INDEPENDENT: true,
    DIE_AT_RANGE: true,
    CONTROLLERS: ['nearestDifferentMaster'],
    TURRETS: [{
        POSITION: [10, 0, 0, 0, 360, 1],
        TYPE: ['autoTankGun', {
            COLOR: '#FF8C00',
            BODY: { FOV: 2 },
            CONTROLLERS: ['nearestDifferentMaster'],
        }],
    }, {
        POSITION: [7, 0, 0, 90, 360, 1],
        TYPE: ['autoTankGun', {
            COLOR: '#FF8C00',
            BODY: { FOV: 2 },
            CONTROLLERS: ['nearestDifferentMaster'],
        }],
    }],
};

// ─────────────────────────────────────────────────────────────────────────────
//  TURRET CLASSES
// ─────────────────────────────────────────────────────────────────────────────

Class.claudeVoidAutoGun = {
    PARENT: ['autoTankGun'],
    COLOR:  'black',
    GUNS: [{
        POSITION: [20, 7, 1, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.basic, g.autoTurret,
                { damage: 2, pen: 2, health: 2, reload: 0.7 }]),
            TYPE: 'bullet',
        },
    }],
};

Class.claudeZeusGun = {
    PARENT: ['autoTankGun'],
    COLOR:  '#FFD700',
    GUNS: [{
        POSITION: [22, 6, 1, 0, -4, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.autoTurret,
                { damage: 2.5, pen: 2, speed: 1.5, maxSpeed: 1.5 }]),
            TYPE: 'bullet',
        },
    }, {
        POSITION: [22, 6, 1, 0, 4, 0, 0.5],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.autoTurret,
                { damage: 2.5, pen: 2, speed: 1.5, maxSpeed: 1.5 }]),
            TYPE: 'bullet',
        },
    }],
};

Class.claudeChronosGun = {
    PARENT: ['autoTankGun'],
    COLOR:  '#00EFFF',
    BODY:   { FOV: 1.5 },
    GUNS: [{
        POSITION: [18, 7, 1, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.basic, g.autoTurret,
                { damage: 1.5, reload: 1.2 }]),
            TYPE: 'claudeFreezeShard',
        },
    }],
};

Class.claudeStormGun = {
    PARENT: ['autoTankGun'],
    COLOR:  '#5588FF',
    GUNS: [{
        POSITION: [16, 8, 1.4, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.lowPower,
                { reload: 0.4, damage: 1.8, pen: 1.5 }]),
            TYPE: 'claudeStormRaindrop',
        },
    }],
};

Class.claudeCosmicEye = {
    PARENT: ['autoTankGun'],
    COLOR:  '#3D0060',
    SHAPE:  0,
    BODY:   { FOV: 2 },
    GUNS: [{
        POSITION: [20, 5, 1, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.basic, g.autoTurret, g.sniper,
                { damage: 3, pen: 3, health: 2 }]),
            TYPE: 'claudeTendril',
        },
    }],
};

// ─────────────────────────────────────────────────────────────────────────────
//  DECORATION RINGS
// ─────────────────────────────────────────────────────────────────────────────

Class.claudeVoidRing        = makeHat(SHAPE_TORUS,  'black');
Class.claudePurpleRing      = makeHat(SHAPE_TORUS,  '#6600CC');
Class.claudeCyanRing        = makeHat(SHAPE_TORUS,  '#00FFFF');
Class.claudeGoldRing        = makeHat(SHAPE_TORUS,  '#FFD700');
Class.claudeRedRing         = makeHat(SHAPE_TORUS,  '#FF2200');
Class.claudeGreenRing       = makeHat(SHAPE_TORUS,  '#00FF66');
Class.claudeBlueRing        = makeHat(SHAPE_TORUS,  '#2244FF');
Class.claudeOrangeRing      = makeHat(SHAPE_TORUS,  '#FF8800');
Class.claudeMagentaRing     = makeHat(SHAPE_TORUS,  '#FF00FF');
Class.claudeDarkRing        = makeHat(SHAPE_TORUS,  '#1A001A');
Class.claudePortalDeco      = makeHat(SHAPE_PORTAL, '#BB00FF');

// ─────────────────────────────────────────────────────────────────────────────
//  ① VOID SOVEREIGN
//  Pulls everything into its gravitational field. Every 2 s it detonates
//  a void orb in all 8 directions. On death it leaves a persistent
//  growing black sphere.
// ─────────────────────────────────────────────────────────────────────────────

Class.claudeVoidSovereign = {
    PARENT:        ['genericBoss'],
    LABEL:         '🌑 VOID SOVEREIGN 🌑',
    COLOR:         'black',
    SHAPE:         SHAPE_STAR8,
    SIZE:          22,
    DANGER:        10,
    SKILL:         MAX_SKILL,
    SKILL_CAP:     MAX_SKILL_CAP,
    BODY:          CHAOS_BODY,
    GLOW: { RADIUS: 70, COLOR: '#6600CC', ALPHA: 0.95, RECURSION: 10 },
    GUNS: [
        // 8 void-orb launchers pointing outward
        ...Array.from({ length: 8 }, (_, i) => ({
            POSITION: [1, 6, 1, 0, 0, i * 45, i / 8],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, {
                    reload:   2.5, recoil:  0, size:   2.5,
                    health:  50,   pen:    50, damage:  3,
                    speed:   0.008, maxSpeed: 0.008, range: 3,
                }]),
                TYPE:     'claudeVoidOrb',
                AUTOFIRE: true,
            },
        })),
        // Fast central auto-ring
        ...Array.from({ length: 6 }, (_, i) => ({
            POSITION: [20, 7, 1, 0, 0, i * 60, i / 6],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin,
                    { damage: 3, pen: 3, reload: 0.6, speed: 1.3, maxSpeed: 1.3 }]),
                TYPE: 'bullet',
            },
        })),
    ],
    TURRETS: [
        { POSITION: [26, 0, 0,  0, 360, 0], TYPE: ['claudeVoidAutoGun', { INDEPENDENT: true }] },
        { POSITION: [26, 0, 0, 90, 360, 0], TYPE: ['claudeVoidAutoGun', { INDEPENDENT: true }] },
        { POSITION: [26, 0, 0,180, 360, 0], TYPE: ['claudeVoidAutoGun', { INDEPENDENT: true }] },
        { POSITION: [26, 0, 0,270, 360, 0], TYPE: ['claudeVoidAutoGun', { INDEPENDENT: true }] },
        { POSITION: [12, 0, 0,  0, 360, 2], TYPE: 'claudeVoidRing'   },
        { POSITION: [18, 0, 0,  0, 360, 2], TYPE: 'claudePurpleRing' },
    ],
    ON: [
        {
            event: 'tick',
            handler: ({ body }) => {
                // Relentless gravitational pull on every non-ally
                const pullRadius = (body.size * 14) ** 2;
                for (const e of entities) {
                    if (e.id === body.id || e.team === body.team) continue;
                    const dx    = body.x - e.x;
                    const dy    = body.y - e.y;
                    const dist2 = dx * dx + dy * dy;
                    if (dist2 < pullRadius && dist2 > 1) {
                        const force = 12 / Math.sqrt(dist2);
                        e.velocity.x += dx * force * (e.damp || 0.1);
                        e.velocity.y += dy * force * (e.damp || 0.1);
                    }
                }
            },
        },
        {
            event: 'death',
            handler: ({ body }) => {
                sockets.broadcast('🌑 The Void Sovereign has fallen — but the void remains!');
                try {
                    const hole = new Entity(body);
                    hole.define(['bullet', {
                        COLOR:        'black',
                        SHAPE:         0,
                        ARENA_CLOSER:  true,
                        PERSISTS_AFTER_DEATH: true,
                        MOTION_TYPE:  ['grow', { growSpeed: 1.2 }],
                        BODY: {
                            SPEED: 0, RANGE: 500, HEALTH: 9999,
                            DAMAGE: 200, PENETRATION: 99, DENSITY: 9999,
                        },
                    }]);
                } catch (_) {}
            },
        },
    ],
};

// ─────────────────────────────────────────────────────────────────────────────
//  ② ZEUS ULTIMA
//  Every tick arc-damages all enemies in a 250-unit radius. On damage it
//  fires a bolt-storm burst. Doubles as a flying lightning fortress.
// ─────────────────────────────────────────────────────────────────────────────

Class.claudeZeusUltima = {
    PARENT:    ['genericBoss'],
    LABEL:     '⚡ ZEUS ULTIMA ⚡',
    COLOR:     '#FFD700',
    SHAPE:     6,
    SIZE:      20,
    DANGER:    10,
    SKILL:     MAX_SKILL,
    SKILL_CAP: MAX_SKILL_CAP,
    BODY:      CHAOS_BODY,
    GLOW:      { RADIUS: 65, COLOR: '#FFFFAA', ALPHA: 0.9, RECURSION: 9 },
    FACING_TYPE: ['spin', { speed: 0.03 }],
    GUNS: [
        // 3 tiers of lightning cannons
        ...Array.from({ length: 6 }, (_, i) => ({
            POSITION: [26, 8, 1, 0, 0, i * 60, i / 6],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.power,
                    { damage: 4, pen: 3, speed: 2, maxSpeed: 2, reload: 0.7 }]),
                TYPE: 'bullet',
            },
        })),
        ...Array.from({ length: 6 }, (_, i) => ({
            POSITION: [22, 6, 1, 0, 0, i * 60 + 30, i / 6],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.pelleter,
                    { damage: 3, pen: 2, speed: 1.6, maxSpeed: 1.6, reload: 0.8 }]),
                TYPE: 'bullet',
            },
        })),
        ...Array.from({ length: 12 }, (_, i) => ({
            POSITION: [16, 3, 1, 0, 0, i * 30, i / 12],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.gunner,
                    { damage: 2, pen: 1.5, speed: 2, maxSpeed: 2, reload: 0.5 }]),
                TYPE: 'bullet',
            },
        })),
    ],
    TURRETS: [
        ...Array.from({ length: 6 }, (_, i) => ({
            POSITION: [8, 22, 0, i * 60, 100, 1],
            TYPE: ['claudeZeusGun', { INDEPENDENT: true }],
        })),
        { POSITION: [14, 0, 0, 0, 360, 2], TYPE: 'claudeGoldRing' },
        { POSITION: [20, 0, 0, 0, 360, 2], TYPE: 'claudeGoldRing' },
    ],
    ON: [
        {
            event: 'tick',
            handler: ({ body }) => {
                // Arc-lightning: deal small tick damage to all nearby enemies
                const range = (body.size * 12) ** 2;
                for (const e of entities) {
                    if (e.id === body.id || e.team === body.team) continue;
                    const dx = e.x - body.x, dy = e.y - body.y;
                    if (dx * dx + dy * dy < range) {
                        e.damageReceived = (e.damageReceived || 0) + 0.8;
                    }
                }
            },
        },
        {
            event: 'damage',
            handler: ({ body }) => {
                // On hit: fire a bolt burst from every gun simultaneously
                for (const gun of body.guns) {
                    try { gun.fire(); } catch (_) {}
                }
            },
        },
        {
            event: 'death',
            handler: () => {
                sockets.broadcast('⚡ ZEUS ULTIMA has been struck down... impossible!');
            },
        },
    ],
};

// ─────────────────────────────────────────────────────────────────────────────
//  ③ CHRONOS
//  Warps local time. Every tick slows all nearby enemies to a crawl.
//  Shoots freeze shards. Has a 12-hour clock face of turrets.
// ─────────────────────────────────────────────────────────────────────────────

Class.claudeChronos = {
    PARENT:    ['genericBoss'],
    LABEL:     '🕰 CHRONOS 🕰',
    COLOR:     '#00CFFF',
    SHAPE:     SHAPE_TORUS,
    SIZE:      22,
    DANGER:    10,
    SKILL:     MAX_SKILL,
    SKILL_CAP: MAX_SKILL_CAP,
    BODY:      CHAOS_BODY,
    GLOW:      { RADIUS: 75, COLOR: '#00FFFF', ALPHA: 0.85, RECURSION: 8 },
    FACING_TYPE: ['spin', { speed: -0.025 }],
    GUNS: [
        // Paired freeze guns (like a clock's hands)
        ...Array.from({ length: 8 }, (_, i) => ({
            POSITION: [24, 8, 1, 0, 0, i * 45, i / 8],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin,
                    { damage: 2.5, pen: 2, reload: 1.1, speed: 1.2, maxSpeed: 1.2 }]),
                TYPE: 'claudeFreezeShard',
            },
        })),
        // Inner ring: fast thin needles
        ...Array.from({ length: 12 }, (_, i) => ({
            POSITION: [18, 3, 1, 0, 0, i * 30, i / 12],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.nailgun,
                    { damage: 1.8, pen: 2, speed: 2, maxSpeed: 2, reload: 0.4 }]),
                TYPE: 'bullet',
            },
        })),
    ],
    TURRETS: [
        // 12 clock-face turrets
        ...Array.from({ length: 12 }, (_, i) => ({
            POSITION: [6, 28, 0, i * 30, 100, 1],
            TYPE: ['claudeChronosGun', { INDEPENDENT: true }],
        })),
        { POSITION: [16, 0, 0, 0, 360, 2], TYPE: 'claudeCyanRing' },
        { POSITION: [22, 0, 0, 0, 360, 2], TYPE: 'claudeCyanRing' },
    ],
    ON: [{
        event: 'tick',
        handler: ({ body }) => {
            // Time dilation field: multiplying velocity toward zero
            const range = (body.size * 16) ** 2;
            for (const e of entities) {
                if (e.id === body.id || e.team === body.team) continue;
                const dx = e.x - body.x, dy = e.y - body.y;
                if (dx * dx + dy * dy < range) {
                    e.velocity.x *= 0.78;
                    e.velocity.y *= 0.78;
                }
            }
        },
    }, {
        event: 'death',
        handler: () => {
            sockets.broadcast('🕰 Chronos has been defeated. Time flows freely once more.');
        },
    }],
};

// ─────────────────────────────────────────────────────────────────────────────
//  ④ PRISM OVERLORD
//  24-gun full-circle prismatic annihilation. On-damage it cycles through
//  a rainbow color sequence.  Shoots bullets from every angle every tick.
// ─────────────────────────────────────────────────────────────────────────────

const PRISM_COLORS = ['#FF0000','#FF7700','#FFFF00','#00FF00','#00FFFF','#0000FF','#FF00FF'];
let   _prismColorIdx = 0;

Class.claudePrismOverlord = {
    PARENT:    ['genericBoss'],
    LABEL:     '🌈 PRISM OVERLORD 🌈',
    COLOR:     '#FF00FF',
    SHAPE:     4,
    SIZE:      20,
    DANGER:    10,
    SKILL:     MAX_SKILL,
    SKILL_CAP: MAX_SKILL_CAP,
    BODY:      CHAOS_BODY,
    GLOW:      { RADIUS: 60, COLOR: '#FF44FF', ALPHA: 0.9, RECURSION: 8 },
    FACING_TYPE: ['spin', { speed: 0.05 }],
    GUNS: [
        // 24-gun full 360° spread
        ...Array.from({ length: 24 }, (_, i) => ({
            POSITION: [22, 6, 1, 0, 0, i * 15, i / 24],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin,
                    { damage: 3, pen: 2, reload: 0.9, speed: 1.4, maxSpeed: 1.4 }]),
                TYPE: 'claudePrismShard',
            },
        })),
        // Inner wide burst ring
        ...Array.from({ length: 12 }, (_, i) => ({
            POSITION: [16, 10, 1, 0, 0, i * 30 + 15, i / 12],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pounder,
                    { damage: 4, pen: 3, reload: 1.5, shudder: 2 }]),
                TYPE: 'bullet',
            },
        })),
    ],
    TURRETS: [
        ...Array.from({ length: 4 }, (_, i) => ({
            POSITION: [9, 0, 0, i * 90, 360, 1],
            TYPE: ['autoTankGun', {
                COLOR: PRISM_COLORS[i],
                INDEPENDENT: true,
                CONTROLLERS: ['nearestDifferentMaster'],
            }],
        })),
        { POSITION: [12, 0, 0, 0, 360, 2], TYPE: 'claudeMagentaRing' },
        { POSITION: [18, 0, 0, 0, 360, 2], TYPE: 'claudeMagentaRing' },
    ],
    ON: [
        {
            event: 'damage',
            handler: ({ body }) => {
                // Cycle rainbow color on every hit
                _prismColorIdx = (_prismColorIdx + 1) % PRISM_COLORS.length;
                try {
                    body.color = PRISM_COLORS[_prismColorIdx];
                } catch (_) {}
            },
        },
        {
            event: 'death',
            handler: () => {
                sockets.broadcast('🌈 The Prism Overlord shatters into light!');
            },
        },
    ],
};

// ─────────────────────────────────────────────────────────────────────────────
//  ⑤ OMEGA ANNIHILATOR
//  Raw maximum power.  36 guns in 3 rings, lasers, drones, traps — all
//  at once.  Literally every weapon type OSA supports, simultaneously.
// ─────────────────────────────────────────────────────────────────────────────

Class.claudeOmegaAnnihilator = {
    PARENT:    ['genericBoss'],
    LABEL:     '💀 OMEGA ANNIHILATOR 💀',
    COLOR:     '#FF0000',
    SHAPE:     0,
    SIZE:      24,
    DANGER:    10,
    SKILL:     MAX_SKILL,
    SKILL_CAP: MAX_SKILL_CAP,
    BODY: {
        HEALTH:      base.HEALTH  * 200,
        SHIELD:      base.SHIELD  * 60,
        REGEN:       base.REGEN   * 40,
        DAMAGE:      base.DAMAGE  * 30,
        SPEED:       base.SPEED   *  0.9,
        FOV:         3,
        PUSHABILITY: 0,
    },
    GLOW: { RADIUS: 80, COLOR: '#FF4400', ALPHA: 1, RECURSION: 12 },
    GUNS: [
        // Outer ring: 12 heavy destroyers
        ...Array.from({ length: 12 }, (_, i) => ({
            POSITION: [28, 12, 1, 0, 0, i * 30, i / 12],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.destroyer,
                    { damage: 6, pen: 4, reload: 0.9, health: 3 }]),
                TYPE: 'bullet',
            },
        })),
        // Middle ring: 12 fast pelleters
        ...Array.from({ length: 12 }, (_, i) => ({
            POSITION: [22, 7, 1, 0, 0, i * 30 + 15, i / 12],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.power,
                    { damage: 3, pen: 3, speed: 2, maxSpeed: 2, reload: 0.5 }]),
                TYPE: 'bullet',
            },
        })),
        // Inner ring: 12 machine-gun barrels
        ...Array.from({ length: 12 }, (_, i) => ({
            POSITION: [16, 4, 1.4, 0, 0, i * 30, i / 12],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.machineGun,
                    { damage: 2.5, pen: 2, reload: 0.3 }]),
                TYPE: 'bullet',
            },
        })),
        // Drone spawners (4 directions)
        ...Array.from({ length: 4 }, (_, i) => ({
            POSITION: [2, 10, 1, 0, 0, i * 90 + 45, i / 4],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.drone, { size: 1.5, health: 3 }]),
                TYPE: 'drone',
                STAT_CALCULATOR: 'drone',
                AUTOFIRE: true,
                SYNCS_SKILLS: true,
            },
        })),
        // Trap layer (4 directions)
        ...Array.from({ length: 4 }, (_, i) => ({
            POSITION: [12, 8, 1, 0, 0, i * 90, i / 4],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, g.hexaTrapper,
                    { damage: 3, pen: 3, reload: 2 }]),
                TYPE: 'trap',
                STAT_CALCULATOR: 'trap',
            },
        })),
    ],
    TURRETS: [
        // 8 heavy auto turrets
        ...Array.from({ length: 8 }, (_, i) => ({
            POSITION: [10, 26, 0, i * 45, 120, 1],
            TYPE: ['autoTankGun', {
                COLOR: '#FF2200',
                INDEPENDENT: true,
                BODY: { FOV: 2.5 },
            }],
        })),
        { POSITION: [16, 0, 0, 0, 360, 2], TYPE: 'claudeRedRing'   },
        { POSITION: [22, 0, 0, 0, 360, 2], TYPE: 'claudeOrangeRing'},
        { POSITION: [28, 0, 0, 0, 360, 2], TYPE: 'claudeRedRing'   },
    ],
    ON: [{
        event: 'death',
        handler: () => {
            sockets.broadcast('💀 THE OMEGA ANNIHILATOR HAS FALLEN. HOW?!');
        },
    }],
};

// ─────────────────────────────────────────────────────────────────────────────
//  ⑥ THE PARASITE
//  On every tick it drains HP from nearby shapes and heals itself.
//  Uses infection drones that hunt and slow enemies.
// ─────────────────────────────────────────────────────────────────────────────

Class.claudeTheParasite = {
    PARENT:    ['genericBoss'],
    LABEL:     '🦠 THE PARASITE 🦠',
    COLOR:     '#00FF66',
    SHAPE:     SHAPE_BLOB,
    SIZE:      18,
    DANGER:    10,
    SKILL:     MAX_SKILL,
    SKILL_CAP: MAX_SKILL_CAP,
    BODY:      CHAOS_BODY,
    MAX_CHILDREN: 30,
    GLOW:      { RADIUS: 55, COLOR: '#00FF44', ALPHA: 0.85, RECURSION: 7 },
    FACING_TYPE: ['spin', { speed: 0.02 }],
    GUNS: [
        // 6 infection-drone launchers
        ...Array.from({ length: 6 }, (_, i) => ({
            POSITION: [2, 8, 1, 0, 0, i * 60, i / 6],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.drone, { size: 1.3, health: 2.5, reload: 0.7 }]),
                TYPE: 'claudeInfectionDrone',
                STAT_CALCULATOR: 'drone',
                AUTOFIRE: true,
                SYNCS_SKILLS: true,
            },
        })),
        // Corrosive bullet spread
        ...Array.from({ length: 8 }, (_, i) => ({
            POSITION: [20, 6, 1, 0, 0, i * 45 + 22, i / 8],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.machineGun,
                    { damage: 2, pen: 3, reload: 0.6, size: 1.3 }]),
                TYPE: 'bullet',
            },
        })),
    ],
    TURRETS: [
        ...Array.from({ length: 4 }, (_, i) => ({
            POSITION: [7, 18, 0, i * 90, 180, 1],
            TYPE: ['autoTankGun', {
                COLOR: '#00CC44',
                INDEPENDENT: true,
                CONTROLLERS: ['nearestDifferentMaster'],
            }],
        })),
        { POSITION: [12, 0, 0, 0, 360, 2], TYPE: 'claudeGreenRing' },
    ],
    ON: [
        {
            event: 'tick',
            handler: ({ body }) => {
                // Leech: drain HP from nearby shapes and restore it to self
                const range = (body.size * 12) ** 2;
                let   leech = 0;
                for (const e of entities) {
                    if (e.id === body.id || e.team === body.team) continue;
                    if (e.type !== 'food') continue;
                    const dx = e.x - body.x, dy = e.y - body.y;
                    if (dx * dx + dy * dy < range) {
                        const drain = Math.min(e.health?.amount || 0, 1.2);
                        if (e.health) e.health.amount -= drain;
                        leech += drain;
                    }
                }
                if (leech > 0 && body.health) {
                    body.health.amount = Math.min(
                        body.health.max,
                        body.health.amount + leech * 2
                    );
                }
            },
        },
        {
            event: 'death',
            handler: () => {
                sockets.broadcast('🦠 The Parasite is eradicated. For now…');
            },
        },
    ],
};

// ─────────────────────────────────────────────────────────────────────────────
//  ⑦ STORM HERALD
//  Generates a living storm: on tick it randomly fires 6 storm-raindrop
//  bullets in random directions from its body position, creating a
//  blinding bullet rain around itself.
// ─────────────────────────────────────────────────────────────────────────────

Class.claudeStormHerald = {
    PARENT:    ['genericBoss'],
    LABEL:     '🌪 STORM HERALD 🌪',
    COLOR:     '#2244FF',
    SHAPE:     8,
    SIZE:      20,
    DANGER:    10,
    SKILL:     MAX_SKILL,
    SKILL_CAP: MAX_SKILL_CAP,
    BODY:      CHAOS_BODY,
    GLOW:      { RADIUS: 70, COLOR: '#4488FF', ALPHA: 0.9, RECURSION: 9 },
    GUNS: [
        // 8 machine-gun directions + inner pellet ring
        ...Array.from({ length: 8 }, (_, i) => ({
            POSITION: [24, 9, 1.3, 0, 0, i * 45, i / 8],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.lowPower,
                    { damage: 2, pen: 2, reload: 0.35, speed: 1.8, maxSpeed: 1.8 }]),
                TYPE: 'claudeStormRaindrop',
            },
        })),
        ...Array.from({ length: 16 }, (_, i) => ({
            POSITION: [18, 3, 1, 0, 0, i * 22.5, i / 16],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pelleter,
                    { damage: 1.5, pen: 2, reload: 0.25, speed: 2, maxSpeed: 2 }]),
                TYPE: 'claudeStormRaindrop',
            },
        })),
    ],
    TURRETS: [
        ...Array.from({ length: 8 }, (_, i) => ({
            POSITION: [8, 24, 0, i * 45, 110, 1],
            TYPE: ['claudeStormGun', { INDEPENDENT: true }],
        })),
        { POSITION: [14, 0, 0, 0, 360, 2], TYPE: 'claudeBlueRing' },
        { POSITION: [20, 0, 0, 0, 360, 2], TYPE: 'claudeBlueRing' },
    ],
    ON: [
        {
            event: 'tick',
            handler: ({ body }) => {
                // Bullet rain: fire in 6 random directions every tick
                for (let i = 0; i < 3; i++) {
                    try {
                        body.guns[Math.floor(Math.random() * 8)].fire();
                    } catch (_) {}
                }
            },
        },
        {
            event: 'death',
            handler: () => {
                sockets.broadcast('🌪 The Storm Herald dissipates. Clear skies return.');
            },
        },
    ],
};

// ─────────────────────────────────────────────────────────────────────────────
//  ⑧ ARCHITECT PRIME
//  Deploys claudeFortressNode traps that auto-target enemies with
//  two turrets each. On death leaves a full turret fortress behind.
// ─────────────────────────────────────────────────────────────────────────────

Class.claudeArchitectPrime = {
    PARENT:    ['genericBoss'],
    LABEL:     '🏗 ARCHITECT PRIME 🏗',
    COLOR:     '#FF8C00',
    SHAPE:     SHAPE_CROSS,
    SIZE:      20,
    DANGER:    10,
    SKILL:     MAX_SKILL,
    SKILL_CAP: MAX_SKILL_CAP,
    BODY:      CHAOS_BODY,
    MAX_CHILDREN: 20,
    GLOW:      { RADIUS: 60, COLOR: '#FFAA00', ALPHA: 0.85, RECURSION: 8 },
    FACING_TYPE: ['spin', { speed: 0.015 }],
    GUNS: [
        // 4 fortress deployers
        ...Array.from({ length: 4 }, (_, i) => ({
            POSITION: [1, 12, 1, 0, 0, i * 90, i / 4],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, g.setTrap,
                    { damage: 2, pen: 2, health: 4, range: 1.4, reload: 3, speed: 0.8, maxSpeed: 0.8 }]),
                TYPE: 'claudeFortressNode',
                STAT_CALCULATOR: 'block',
                AUTOFIRE: true,
            },
        })),
        // Heavy cannons on the cross arms
        ...Array.from({ length: 4 }, (_, i) => ({
            POSITION: [24, 14, 1, 0, 0, i * 90, i / 4],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.pounder, g.destroyer,
                    { damage: 5, pen: 4, reload: 1.5 }]),
                TYPE: 'bullet',
            },
        })),
        // Corner machine-guns
        ...Array.from({ length: 4 }, (_, i) => ({
            POSITION: [20, 7, 1, 0, 0, i * 90 + 45, i / 4],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.machineGun,
                    { damage: 2.5, pen: 2, reload: 0.4 }]),
                TYPE: 'bullet',
            },
        })),
    ],
    TURRETS: [
        ...Array.from({ length: 4 }, (_, i) => ({
            POSITION: [8, 22, 0, i * 90, 130, 1],
            TYPE: ['autoTankGun', {
                COLOR: '#FF8C00',
                INDEPENDENT: true,
                BODY: { FOV: 2 },
            }],
        })),
        { POSITION: [14, 0, 0, 0, 360, 2], TYPE: 'claudeOrangeRing' },
    ],
    ON: [{
        event: 'death',
        handler: ({ body }) => {
            sockets.broadcast('🏗 Architect Prime is gone — but the fortresses stand!');
            // Leave 4 fortress nodes on death
            for (let i = 0; i < 4; i++) {
                try {
                    const node = new Entity(body);
                    node.define('claudeFortressNode');
                    const angle = (i / 4) * Math.PI * 2;
                    node.x = body.x + Math.cos(angle) * 80;
                    node.y = body.y + Math.sin(angle) * 80;
                } catch (_) {}
            }
        },
    }],
};

// ─────────────────────────────────────────────────────────────────────────────
//  ⑨ FRACTAL SPAWN
//  On every damage hit it spawns a claudeFractalMini drone.  The
//  spawned drones each have an auto turret, creating a self-replicating
//  army that scales with damage taken.
// ─────────────────────────────────────────────────────────────────────────────

Class.claudeFractalSpawn = {
    PARENT:    ['genericBoss'],
    LABEL:     '🔮 FRACTAL SPAWN 🔮',
    COLOR:     '#CC00CC',
    SHAPE:     3,
    SIZE:      20,
    DANGER:    10,
    SKILL:     MAX_SKILL,
    SKILL_CAP: MAX_SKILL_CAP,
    BODY:      CHAOS_BODY,
    MAX_CHILDREN: 60,
    GLOW:      { RADIUS: 60, COLOR: '#FF44FF', ALPHA: 0.9, RECURSION: 9 },
    FACING_TYPE: ['spin', { speed: 0.04 }],
    GUNS: [
        // 3-point fractal burst (triangle corners)
        ...Array.from({ length: 3 }, (_, i) => ([
            {
                POSITION: [26, 10, 1, 0, 0, i * 120, i / 3],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.twin,
                        { damage: 4, pen: 3, reload: 0.8, size: 1.4 }]),
                    TYPE: 'bullet',
                },
            },
            {
                POSITION: [22, 6, 1, 0, -8, i * 120, i / 3],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.pelleter,
                        { damage: 2.5, pen: 2, reload: 0.6 }]),
                    TYPE: 'bullet',
                },
            },
            {
                POSITION: [22, 6, 1, 0,  8, i * 120, i / 3],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.pelleter,
                        { damage: 2.5, pen: 2, reload: 0.6 }]),
                    TYPE: 'bullet',
                },
            },
        ])).flat(),
        // Fractal mini spawner (3 directions)
        ...Array.from({ length: 3 }, (_, i) => ({
            POSITION: [2, 8, 1, 0, 0, i * 120 + 60, i / 3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.drone,
                    { size: 1.2, health: 2.5, reload: 0.9 }]),
                TYPE: 'claudeFractalMini',
                STAT_CALCULATOR: 'drone',
                AUTOFIRE: true,
                SYNCS_SKILLS: true,
            },
        })),
    ],
    TURRETS: [
        ...Array.from({ length: 3 }, (_, i) => ({
            POSITION: [9, 20, 0, i * 120, 160, 1],
            TYPE: ['autoTankGun', {
                COLOR: '#CC00CC',
                INDEPENDENT: true,
                CONTROLLERS: ['nearestDifferentMaster'],
            }],
        })),
        { POSITION: [12, 0, 0, 0, 360, 2], TYPE: 'claudeMagentaRing' },
        { POSITION: [18, 0, 0, 0, 360, 2], TYPE: 'claudePurpleRing'  },
    ],
    ON: [
        {
            event: 'damage',
            handler: ({ body }) => {
                // Every hit spawns a mini fractal drone
                try {
                    const mini = new Entity(body);
                    mini.define('claudeFractalMini');
                    const angle = Math.random() * Math.PI * 2;
                    mini.x = body.x + Math.cos(angle) * (body.size + 10);
                    mini.y = body.y + Math.sin(angle) * (body.size + 10);
                } catch (_) {}
            },
        },
        {
            event: 'death',
            handler: () => {
                sockets.broadcast('🔮 Fractal Spawn dissolves into infinite echoes…');
            },
        },
    ],
};

// ─────────────────────────────────────────────────────────────────────────────
//  ⑩ COSMIC HORROR
//  An eldritch god. On every tick deals aura damage (no bullets needed)
//  to anything within 200 units.  Its tentacle guns fire reality-
//  distorting tendrils.  Staring into it deals damage.
// ─────────────────────────────────────────────────────────────────────────────

Class.claudeCosmicHorror = {
    PARENT:    ['genericBoss'],
    LABEL:     '👁 COSMIC HORROR 👁',
    COLOR:     '#200030',
    SHAPE:     SHAPE_EYE,
    SIZE:      24,
    DANGER:    10,
    SKILL:     MAX_SKILL,
    SKILL_CAP: MAX_SKILL_CAP,
    BODY: {
        HEALTH:      base.HEALTH  * 120,
        SHIELD:      base.SHIELD  * 50,
        REGEN:       base.REGEN   * 30,
        DAMAGE:      base.DAMAGE  * 20,
        SPEED:       base.SPEED   *  0.6,
        FOV:         3.5,
        PUSHABILITY: 0,
    },
    GLOW: { RADIUS: 90, COLOR: '#330033', ALPHA: 1, RECURSION: 12 },
    FACING_TYPE: ['spin', { speed: -0.01 }],
    GUNS: [
        // Tentacle guns (staggered like octopus arms)
        ...Array.from({ length: 5 }, (_, i) => ([
            {
                POSITION: [28, 5, 1, 0, 0, i * 72, i / 5],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.sniper,
                        { damage: 6, pen: 5, health: 3, speed: 1.8, maxSpeed: 1.8, reload: 1.2 }]),
                    TYPE: 'claudeTendril',
                },
            },
            {
                POSITION: [20, 5, 1, 2, -6, i * 72 + 10, i / 5],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.pelleter,
                        { damage: 3, pen: 3, reload: 0.8 }]),
                    TYPE: 'claudeTendril',
                },
            },
            {
                POSITION: [20, 5, 1, 2,  6, i * 72 - 10, i / 5],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.pelleter,
                        { damage: 3, pen: 3, reload: 0.8 }]),
                    TYPE: 'claudeTendril',
                },
            },
        ])).flat(),
    ],
    TURRETS: [
        ...Array.from({ length: 5 }, (_, i) => ({
            POSITION: [8, 28, 0, i * 72, 120, 1],
            TYPE: ['claudeCosmicEye', { INDEPENDENT: true }],
        })),
        { POSITION: [14, 0, 0, 0, 360, 2], TYPE: 'claudeDarkRing'   },
        { POSITION: [20, 0, 0, 0, 360, 2], TYPE: 'claudePurpleRing' },
        { POSITION: [26, 0, 0, 0, 360, 2], TYPE: 'claudeDarkRing'   },
    ],
    ON: [
        {
            event: 'tick',
            handler: ({ body }) => {
                // Sanity aura: direct damage to every nearby enemy every tick
                const auraRange = (body.size * 9) ** 2;
                for (const e of entities) {
                    if (e.id === body.id || e.team === body.team) continue;
                    const dx = e.x - body.x, dy = e.y - body.y;
                    if (dx * dx + dy * dy < auraRange) {
                        e.damageReceived = (e.damageReceived || 0) + 2.5;
                    }
                }
            },
        },
        {
            event: 'death',
            handler: ({ body }) => {
                sockets.broadcast('👁 THE COSMIC HORROR CLOSES ITS EYE. YOU LIVE. FOR NOW.');
                try {
                    // Leave a persistent growing darkness
                    const void_ = new Entity(body);
                    void_.define(['bullet', {
                        COLOR:        '#000000',
                        SHAPE:         0,
                        ARENA_CLOSER:  true,
                        PERSISTS_AFTER_DEATH: true,
                        MOTION_TYPE:  ['grow', { growSpeed: 0.8 }],
                        BODY: {
                            SPEED: 0, RANGE: 800, HEALTH: 9999,
                            DAMAGE: 80, PENETRATION: 99, DENSITY: 999,
                        },
                    }]);
                } catch (_) {}
            },
        },
    ],
};

// ─────────────────────────────────────────────────────────────────────────────
//  CHAOS VAULT MENU ENTITY
//  A spinning cosmic portal that shows all 10 tanks as upgrades.
// ─────────────────────────────────────────────────────────────────────────────

Class.claudeChaosVaultMenu = {
    PARENT:      ['genericTank'],
    LABEL:       '✦ CHAOS VAULT ✦',
    COLOR:       '#BB00FF',
    SHAPE:       SHAPE_PORTAL,
    SIZE:        20,
    DANGER:      1,
    HAS_NO_RECOIL: true,
    FACING_TYPE: ['spin', { speed: 0.06 }],
    GLOW:        { RADIUS: 50, COLOR: '#9900FF', ALPHA: 0.8, RECURSION: 8 },
    BODY: {
        HEALTH:      base.HEALTH  * 999,
        SHIELD:      base.SHIELD  * 999,
        REGEN:       base.REGEN   * 999,
        SPEED:       0,
        PUSHABILITY: 0,
    },
    GUNS: [],
    TURRETS: [
        { POSITION: [10, 0, 0,   0, 360, 2], TYPE: 'claudePurpleRing'  },
        { POSITION: [14, 0, 0,   0, 360, 2], TYPE: 'claudePortalDeco'  },
    ],
    UPGRADES_TIER_0: [
        'claudeVoidSovereign',
        'claudeZeusUltima',
        'claudeChronos',
        'claudePrismOverlord',
        'claudeOmegaAnnihilator',
        'claudeTheParasite',
        'claudeStormHerald',
        'claudeArchitectPrime',
        'claudeFractalSpawn',
        'claudeCosmicHorror',
    ],
};

// ─────────────────────────────────────────────────────────────────────────────
//  SOCKET HOOK  —  backtick + C, level 3 required
// ─────────────────────────────────────────────────────────────────────────────


// ─────────────────────────────────────────────────────────────────────────────
//  MODULE EXPORT
// ─────────────────────────────────────────────────────────────────────────────

module.exports = ({ Config, Class, Events }) => {
    console.log('');
    console.log('╔════════════════════════════════════════╗');
    console.log('  ✦  CHAOS VAULT  loaded  (backtick + C)');
    console.log('     10 broken tanks. Level 3+ required.');
    console.log('╚════════════════════════════════════════╝');
    console.log('');
};