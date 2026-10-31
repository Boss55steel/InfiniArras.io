// ── Black Hole Addon ──────────────────────────────────────────────────────────
// Adds a black hole with gravitational attraction into the addons menu.
// Fixed for open-source-arras (AE0hello/open-source-arras latest).
// ─────────────────────────────────────────────────────────────────────────────

const { combineStats } = require('../facilitators.js');
const { base } = require('../constants.js');
const g = require('../gunvals.js');

// ── Black hole physics settings ───────────────────────────────────────────────
const range              = 1e5;   // gravitational pull radius (world units)
const mass               = 1e13;  // black hole mass
const G                  = 6.67e-11;
const sizeChangeRate     = 2;     // how fast absorbed entities shrink
const ignoredTypes       = ['wall'];
const rangeSquared       = range ** 2;
const attraction         = G * mass;

// ── Visual layer classes ──────────────────────────────────────────────────────
// Outermost ring — deep orange accretion disk, fast spin
Class.blackHoleDisk1 = {
    LABEL: '',
    SHAPE: 0,
    COLOR: '#ff6600',
    INDEPENDENT: true,
    DRAW_HEALTH: false,
    FACING_TYPE: ['spin', { speed: 0.18, independent: true }],
    BODY: { HEALTH: 9999, DAMAGE: 0 },
    TURRETS: [
        // Bright arc segments forming the disk
        ...Array(12).fill(0).map((_, i) => ({
            POSITION: [3.5, 12, 0, (360/12)*i, 20, 1],
            TYPE: ['genericEntity', {
                SHAPE: 0, COLOR: i % 2 === 0 ? '#ff8800' : '#ffaa00',
                FACING_TYPE: 'bound', INDEPENDENT: true, DRAW_HEALTH: false,
                BODY: { HEALTH: 9999, DAMAGE: 0 },
            }],
        })),
    ],
};
// Middle ring — blue-violet hot gas, counter-spin
Class.blackHoleDisk2 = {
    LABEL: '',
    SHAPE: 0,
    COLOR: '#6600ff',
    INDEPENDENT: true,
    DRAW_HEALTH: false,
    FACING_TYPE: ['spin', { speed: -0.28, independent: true }],
    BODY: { HEALTH: 9999, DAMAGE: 0 },
    TURRETS: [
        ...Array(8).fill(0).map((_, i) => ({
            POSITION: [2.5, 8, 0, (360/8)*i + 22, 28, 1],
            TYPE: ['genericEntity', {
                SHAPE: 0, COLOR: i % 2 === 0 ? '#9933ff' : '#cc66ff',
                FACING_TYPE: 'bound', INDEPENDENT: true, DRAW_HEALTH: false,
                BODY: { HEALTH: 9999, DAMAGE: 0 },
            }],
        })),
    ],
};
// Inner ring — bright white-blue photon sphere
Class.blackHoleDisk3 = {
    LABEL: '',
    SHAPE: 0,
    COLOR: '#aaaaff',
    INDEPENDENT: true,
    DRAW_HEALTH: false,
    FACING_TYPE: ['spin', { speed: 0.45, independent: true }],
    BODY: { HEALTH: 9999, DAMAGE: 0 },
    TURRETS: [
        ...Array(6).fill(0).map((_, i) => ({
            POSITION: [2, 5.5, 0, (360/6)*i, 35, 1],
            TYPE: ['genericEntity', {
                SHAPE: 0, COLOR: i % 2 === 0 ? '#ffffff' : '#ccccff',
                FACING_TYPE: 'bound', INDEPENDENT: true, DRAW_HEALTH: false,
                BODY: { HEALTH: 9999, DAMAGE: 0 },
            }],
        })),
    ],
};
// Core — the event horizon, pure black
Class.blackHoleCore = {
    LABEL: '',
    SHAPE: 0,
    COLOR: 'black',
    INDEPENDENT: true,
    DRAW_HEALTH: false,
    BODY: { HEALTH: 9999, DAMAGE: 0 },
};

// ── The black hole tank ───────────────────────────────────────────────────────
Class.blackHole = {
    PARENT: 'genericTank',
    LABEL: 'Black Hole',
    COLOR: 'black',
    SHAPE: 0,
    SIZE: 18,
    DANGER: 9,
    BODY: {
        DAMAGE:       0,
        HEALTH:       9999,
        SPEED:        base.SPEED * 0.6,
        FOV:          base.FOV   * 3,
        PUSHABILITY:  0,
        DENSITY:      9999,
    },
    SKILL: [9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
    DRAW_HEALTH: false,
    // Visual layers (outermost → innermost)
    TURRETS: [
        { POSITION: [14,  0, 0, 0, 360, 0], TYPE: 'blackHoleDisk1' },
        { POSITION: [9.5, 0, 0, 0, 360, 0], TYPE: 'blackHoleDisk2' },
        { POSITION: [6,   0, 0, 0, 360, 0], TYPE: 'blackHoleDisk3' },
        { POSITION: [3.5, 0, 0, 0, 360, 1], TYPE: 'blackHoleCore'  },
    ],
    ON: [
        {
            // Every tick: pull nearby entities toward the black hole and shrink them
            event: 'tick',
            handler: ({ body }) => {
                const { x: bx, y: by } = body;
                // entities is a Map in OSA — iterate its values
                const allEntities = (typeof entities !== 'undefined') ? entities
                    : (global.entities || null);
                if (!allEntities) return;

                const iter = typeof allEntities.values === 'function'
                    ? allEntities.values()
                    : Object.values(allEntities);

                for (const e of iter) {
                    if (!e || e === body)               continue;
                    if (ignoredTypes.includes(e.type))  continue;
                    if (e.team === body.team)           continue; // don't pull allies

                    const dx = e.x - bx;
                    const dy = e.y - by;
                    const dist2 = dx * dx + dy * dy;

                    if (dist2 > rangeSquared || dist2 === 0) continue;

                    const F = attraction / dist2;

                    // Apply velocity pull toward the black hole
                    if (e.velocity) {
                        e.velocity.x -= F * dx;
                        e.velocity.y -= F * dy;
                    } else if (e.ax !== undefined) {
                        // Some OSA versions use ax/ay acceleration
                        e.ax = (e.ax || 0) - F * dx;
                        e.ay = (e.ay || 0) - F * dy;
                    }

                    // Shrink the entity
                    if (e.sizeMultiplier !== undefined) {
                        e.sizeMultiplier -= F * sizeChangeRate;
                        if (e.sizeMultiplier <= 0) {
                            // Kill it: try multiple OSA kill patterns
                            if (typeof e.kill === 'function') e.kill();
                            else if (e.health) e.health.amount = -1;
                        }
                    }
                }
            },
        },
        {
            // On spawn: make sure the black hole doesn't get pushed around
            event: 'define',
            handler: ({ body }) => {
                if (typeof body.removeFromGrid === 'function') body.removeFromGrid();
                body.skipLife    = true;
                body.PUSHABILITY = 0;
            },
        },
    ],
};

// ── Hook into upgrade tree ─────────────────────────────────────────────────────
if (Class.menu_addons && Array.isArray(Class.menu_addons.UPGRADES_TIER_0)) {
    Class.menu_addons.UPGRADES_TIER_0.push('blackHole');
} else if (Class.addons && Array.isArray(Class.addons.UPGRADES_TIER_0)) {
    Class.addons.UPGRADES_TIER_0.push('blackHole');
} else if (Class.basic) {
    if (!Class.basic.UPGRADES_TIER_1) Class.basic.UPGRADES_TIER_1 = [];
    Class.basic.UPGRADES_TIER_1.push('blackHole');
}