// ═══════════════════════════════════════════════════════════════════════════
//  U N D E R W O R L D   G A M E M O D E
//  File: server/gamemodeconfigs/underworld.js
//
//  Game concept — "Soul Surge":
//    • Massive 32+ player FFA on a huge dark map
//    • The map is laced with maze-like bone walls and fog pillars
//    • Three "Soul Altars" pulse at fixed map positions — standing near one
//      steadily restores your HP like a regen shrine
//    • Periodically, a "Phantom Wave" is announced: every 3 minutes,
//      2–4 Revenants and one Phantom King spawn simultaneously,
//      dropping big score bonuses when killed
//    • Players killed by bosses respawn as half-health "Wraith" class
//      for 20 seconds before reverting — reinforced by the Underworld addon
//    • Background is pitch black with dark purple borders
//    • All shapes are tinted dark / desaturated
// ═══════════════════════════════════════════════════════════════════════════

'use strict';

module.exports = {
    // ── Identity ─────────────────────────────────────────────────────────────
    name:        'underworld',
    displayName: '☠ Underworld — Soul Surge',

    // ── Map & visual ─────────────────────────────────────────────────────────
    // OSA reads these from the gamemode config and applies them to the room.
    WIDTH:  14000,   // large enough for 32+ players to roam
    HEIGHT: 14000,

    // Background & border colours (hex string or OSA named colour)
    BACKGROUND_COLOR: '#0d0d1a',   // near-black midnight blue
    BORDER_COLOR:     '#1a0033',   // deep void purple border

    // Grid line colour — barely visible in the dark
    GRID_COLOR: '#1c1c2e',

    // ── Spawning ──────────────────────────────────────────────────────────────
    // Players start as the Wraith class from the Underworld addon.
    // Falls back to genericTank if the addon isn't loaded.
    SPAWN_CLASS: 'wraith_UW',
    REROOT_UPGRADE_TREE: 'wraith_UW',

    // ── Shape colours (desaturated/spooky) ───────────────────────────────────
    // OSA lets gamemodes override the palette used for shapes.
    SHAPE_COLORS: {
        square:   '#3d2b4a',   // dark violet square
        triangle: '#2b3d2b',   // dead green triangle
        pentagon: '#1a1a3d',   // deep navy pentagon
        crasher:  '#4a0000',   // blood red crasher
        gem:      '#4a3d00',   // bone gold gem
    },

    // ── Boss / event settings ─────────────────────────────────────────────────
    // Phantom Wave: every 3 minutes (in ms) — announce + mass boss spawn.
    PHANTOM_WAVE_INTERVAL: 3 * 60 * 1000,
    PHANTOM_WAVE_MESSAGE:  '⚠ A Phantom Wave rises from the abyss...',
    PHANTOM_WAVE_END_MESSAGE: 'The wave has been repelled... for now.',

    // How many Revenants spawn per wave
    PHANTOM_WAVE_REVENANTS: 3,
    // Whether a Phantom King spawns each wave (true = always, false = 50% chance)
    PHANTOM_WAVE_KING: true,

    // Regular boss spawn chance multiplier on top of normal boss spawning
    BOSS_RATE_MULTIPLIER: 1.4,

    // Soul Altar positions (normalised 0–1 of map width/height).
    // Three altars form a triangle across the map.
    SOUL_ALTARS: [
        { x: 0.5,  y: 0.15 },   // top-centre
        { x: 0.15, y: 0.82 },   // bottom-left
        { x: 0.85, y: 0.82 },   // bottom-right
    ],
    // Altar regen rate — HP per second while inside altar radius
    ALTAR_REGEN: 12,
    // Altar radius (in map units)
    ALTAR_RADIUS: 420,

    // ── Scoring ───────────────────────────────────────────────────────────────
    // Bonus score multiplier for kills during a Phantom Wave
    WAVE_KILL_BONUS: 2.5,

    // ── Player limits ─────────────────────────────────────────────────────────
    MAX_PLAYERS: 64,

    // ── Extra maze walls (bone walls) ────────────────────────────────────────
    // OSA maze walls are toggled by setting MAZE: true.
    // We use a custom sparse maze so the map isn't fully gridded —
    // just enough corridors to feel like catacombs.
    MAZE: false,          // don't use the full maze generator
    CUSTOM_WALLS: true,   // signal our room setup script to place walls

    // ── Leaderboard ───────────────────────────────────────────────────────────
    LEADERBOARD_SIZE: 10,
    LEADERBOARD_LABEL: 'Soul Reapers',
};