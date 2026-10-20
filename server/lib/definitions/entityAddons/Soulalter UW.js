// ═══════════════════════════════════════════════════════════════════════════
//  S O U L   A L T A R   E N T I T Y
//  File: server/entityAddons/soulAltar_UW.js
//
//  The Soul Altar is a large, slow-spinning, invincible shrine that
//  marks regen zones in the Underworld map. It's purely visual/gameplay
//  marker — the actual regen is handled in underworld_room.js.
//
//  It looks like a large pale-cyan 12-sided polygon with a spinning
//  inner glow turret and a ring of stationary bone-colored auto-turrets.
// ═══════════════════════════════════════════════════════════════════════════

'use strict';

const { combineStats } = require('../facilitators.js');
const _facs   = require('../facilitators.js');
const _consts = require('../constants.js');
const { base } = _consts;
const g = require('../gunvals.js');

const weaponArray = _facs.weaponArray || ((weapon, count) => {
    const arr = Array.isArray(weapon) ? weapon : [weapon];
    if (!count || count === 1) return arr;
    const out = [];
    for (let i = 0; i < count; i++) {
        const angle = (360 / count) * i;
        for (const w of arr) {
            const copy = JSON.parse(JSON.stringify(w));
            if (copy.POSITION && Array.isArray(copy.POSITION))
                copy.POSITION[5] = (copy.POSITION[5] || 0) + angle;
            out.push(copy);
        }
    }
    return out;
});

module.exports = ({ Class }) => {
    console.log('[soulAltar_UW] Loading Soul Altar entity...');

    // ── Inner glow core (the spinning heart of the altar) ────────────────────
    Class.soulAltarCore_UW = {
        PARENT: 'autoTurret',
        LABEL:  '',
        COLOR:  '#7ed6df',   // ghostly cyan
        ALPHA:  0.5,
        SHAPE:  6,           // hexagon glow core
        INDEPENDENT: true,
        BODY: { FOV: 0 },
        GUNS: [],
        CONTROLLERS: [['spin2', { speed: 0.04 / (Config.runSpeed || 1) }]],
    };

    // ── Altar beacon entity ───────────────────────────────────────────────────
    Class.soulAltar_UW = {
        PARENT: 'miniboss',      // use miniboss as base so it doesn't despawn
        LABEL:  '✦ Soul Altar',
        COLOR:  '#4a2060',       // dark violet body
        ALPHA:  0.85,
        SHAPE:  12,              // 12-sided for an eerie circle-like look
        DANGER: 0,
        SIZE:   38,
        VALUE:  0,               // no score for interacting with it

        // Completely invincible — it is a shrine, not a target
        BODY: {
            HEALTH: 1e9,
            SHIELD: 1e9,
            REGEN:  1e9,
            SPEED:  0,           // stationary
            DAMAGE: 0,           // does not damage players on contact
            FOV:    0,
        },
        SKILL: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],

        // Slow spin so it looks alive
        FACING_TYPE: ['spin', { speed: 0.008 / (Config.runSpeed || 1) }],

        // No AI — it just sits there
        CONTROLLERS: [],
        IGNORED_BY_AI: true,

        // Cannot be targeted or damaged
        INVINCIBLE: true,

        TURRETS: [
            // Inner spinning glow core
            {
                POSITION: [18, 0, 0, 0, 360, 1],
                TYPE: 'soulAltarCore_UW',
            },
            // Outer ring of 6 small bone-coloured ornament discs (decorative)
            ...weaponArray({
                POSITION: [5, 22, 0, 0, 0, 0],
                TYPE: ['autoTurret', {
                    COLOR: '#c8c8a0',  // bone ivory
                    ALPHA: 0.7,
                    SHAPE: 0,
                    GUNS: [],
                    BODY: { FOV: 0 },
                    INDEPENDENT: true,
                    CONTROLLERS: [],
                    SIZE: 7,
                }],
            }, 6),
        ],

        GUNS: [],

        // No upgrades, no broadcast
        UPGRADES_TIER_0: [],
    };

    console.log('[soulAltar_UW] Soul Altar entity loaded.');
};