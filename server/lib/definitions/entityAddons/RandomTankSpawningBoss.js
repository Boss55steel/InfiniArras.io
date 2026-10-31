// ══════════════════════════════════════════════════════════════════════════════
//  RANDOM SPAWNER BOSS — v3
//  File: server/entityaddons/randomSpawnerBoss.js   (or server/addons/)
//
//  What's new vs v2:
//   • Scans ALL classes in global.Class at load time — picks up every tank
//     defined in definitions/tanks.js, definitions/bosses.js, other addons,
//     and any custom definition files automatically.
//   • Filters intelligently: only real playable tanks with functional guns,
//     skips bosses / projectiles / abstract bases / system entities.
//   • Max 25 children, evenly distributed across 8 randomly chosen types.
//   • CURSOR FOLLOWING ACTUALLY WORKS: each spawned minion gets an ON:tick
//     handler that directly sets body.control.goal to the boss owner's cursor
//     position every frame, regardless of the master chain.
//   • No cursor anchor entity needed — simpler and more reliable.
//   • No hardcoded tank list — works with any OSA build, forks, or custom
//     definition files without changing a line.
// ══════════════════════════════════════════════════════════════════════════════
"use strict";

const { combineStats } = require('../facilitators.js');
const { base }         = require('../constants.js');
const g                = require('../gunvals.js');

// ── Gunval shims (handle renamed properties across OSA versions) ──────────────
g.pound   = g.pound   || g.pounder    || {};
g.destroy = g.destroy || g.destroyer  || {};
g.anni    = g.anni    || g.annihilator || {};
g.mini    = g.mini    || g.minigun    || {};
g.over    = g.over    || g.overseer   || {};
g.stream  = g.stream  || g.streamliner || {};
g.hunter2 = g.hunter2 || g.hunterSecondary || {};
g.spread  = g.spread  || g.spreadshot || {};
g.arty    = g.arty    || g.artillery  || {};
g.skim    = g.skim    || g.skimmer    || {};

const safeCS = (...parts) => combineStats(parts.flat().filter(x => x != null && typeof x === 'object'));

// ═════════════════════════════════════════════════════════════════════════════
//  TUNEABLE CONSTANTS
// ═════════════════════════════════════════════════════════════════════════════
const MAX_CHILDREN = 25;   // hard cap — total minions across all types
const POOL_SIZE    = 8;    // how many different tank types to pick each restart

// ═════════════════════════════════════════════════════════════════════════════
//  CLASS FILTER — determines which classes from global.Class are usable as
//  minions. Runs once at addon load, after all definition files have executed.
// ═════════════════════════════════════════════════════════════════════════════

// Exact class names to always skip
const CLASS_BLACKLIST = new Set([
    // Abstract bases
    'genericTank','genericEntity','genericBullet','genericMinion',
    // Projectile / child entity types
    'bullet','drone','trap','missile','swarm','autoswarm','mineDrone',
    'skimmerMissile','rocketMissile','rocket','parachuteMine',
    // Polygon / food entities
    'food','square','triangle','pentagon','hexagon','superHexagon',
    'alpha','beta','gamma','delta','epsilon','crasher','egg',
    'landmine','wall','rock','gem','crystal','shard',
    // Boss abstract bases
    'miniboss','bosstank','boss','dominatorBase','celestialBase',
    // Sub-component bodies / turrets
    'smasherBody','autoTurret','turret','basicTurret','cannons',
    // Game-mode objects
    'dominator','sanctuary','portal','base','flag','skull',
    // Misc system
    'annihilatorBoss',
]);

// Regex patterns applied to the class NAME
const NAME_SKIP_PATTERNS = [
    /^spwn/i,           // our own boss system classes
    /^shareCode_/,      // share-code-loaded tanks
    /Body$/,            // e.g. smasherBody sub-classes
    /Turret$/,          // sub-turret classes
    /Ring\d/,           // decorative ring turrets
    /Barrel/,           // cosmetic barrels
    /Anchor/,           // cursor anchors
    /^base/i,           // base protectors
    /protector/i,       // base protectors
    /^menu/i,           // menu entries
    /tier_/i,           // upgrade tree internal names
    /^fallen/i,         // fallen bosses
    /^elite/i,          // elite bosses
    /^rogue/i,          // rogue bosses
    /^guardian/i,       // guardian bosses
//    /^dread/i,          // dreadnoughts
    /^celestial/i,      // celestials
    /^dev/i,            // dev-only tanks
    /sentinel/i,        // sentinels
    /^crasher/i,        // crashers
    /^polygon/i,        // polygon entities
    /^alpha/i,          // alpha polygon entities
];

// PARENT values that mark an abstract / non-tank class
const BAD_PARENTS = new Set([
    'genericEntity','genericBullet','food','bullet','drone','trap',
    'missile','swarm','wall','dominator','miniboss','bosstank','boss',
]);

/**
 * Returns true if `name` / `def` describes a real, playable tank that can be
 * meaningfully used as a cursor-controlled minion.
 */
function isUsableMinion(name, def) {
    if (!def || typeof def !== 'object') return false;

    // ── Name filters ──────────────────────────────────────────────────────────
    if (CLASS_BLACKLIST.has(name)) return false;
    if (NAME_SKIP_PATTERNS.some(rx => rx.test(name))) return false;

    // ── Must have a PARENT (real definition, not just a stub) ─────────────────
    const parent = def.PARENT;
    if (!parent) return false;
    const parents = Array.isArray(parent) ? parent : [parent];

    // Reject if any parent is in the bad list
    for (const p of parents) {
        const ps = (typeof p === 'string' ? p : JSON.stringify(p)).toLowerCase();
        for (const bp of BAD_PARENTS) {
            if (ps.includes(bp)) return false;
        }
    }

    // ── Must have a visible label (no unnamed sub-entities) ───────────────────
    const label = def.LABEL;
    if (!label || label.trim() === '') return false;

    // ── Skip high-danger entities (actual bosses / elites) ────────────────────
    if ((def.DANGER || 0) >= 5) return false;

    // ── Must have either functional guns OR a smasher body ────────────────────
    const guns    = def.GUNS    || [];
    const turrets = def.TURRETS || [];

    const hasFunctionalGun = guns.some(gun =>
        gun?.PROPERTIES &&
        (gun.PROPERTIES.SHOOT_SETTINGS || gun.PROPERTIES.TYPE != null)
    );

    const hasSmasherBody = turrets.some(t => {
        if (!t) return false;
        const tt = t.TYPE;
        if (typeof tt === 'string') return tt === 'smasherBody';
        if (Array.isArray(tt))      return tt[0] === 'smasherBody';
        return false;
    });

    const hasUsefulTurret = turrets.some(t => {
        if (!t) return false;
        const tt = t.TYPE;
        if (typeof tt === 'string') return tt !== 'smasherBody';
        if (Array.isArray(tt))      return tt[0] !== 'smasherBody';
        return false;
    });

    if (!hasFunctionalGun && !hasSmasherBody && !hasUsefulTurret) return false;

    return true;
}

// ═════════════════════════════════════════════════════════════════════════════
//  CURSOR FOLLOWING — the core mechanic
//
//  Every spawned minion receives this ON:tick handler as an override.
//  Each tick it reads body.master.control.target (the player's mouse offset
//  relative to their own tank), and sets body.control.goal to that world
//  position. Because goal is set before the movement tick, the minion steers
//  toward the cursor every frame.
//
//  The combat controllers (nearestDifferentMaster + mapAltToFire) still handle
//  attack targeting independently — they write body.control.target (aim
//  direction) not body.control.goal, so there's no interference.
// ═════════════════════════════════════════════════════════════════════════════

const CURSOR_TICK_HANDLER = {
    event: 'tick',
    handler({ body }) {
        try {
            const boss = body.master;
            if (!boss?.control?.target) return;
            // Set movement goal to the boss owner's cursor world position
            body.control.goal = {
                x: boss.x + boss.control.target.x,
                y: boss.y + boss.control.target.y,
            };
        } catch (_) {}
    },
};

// Combat controllers — handle aiming + firing at nearby enemies while moving
const COMBAT_CONTROLLERS = [
    'nearestDifferentMaster',
    'mapAltToFire',
    'canRepel',
];

// ── Build a TYPE array for a spawn gun that wraps an existing class ───────────
// We overlay CONTROLLERS + ON so the base tank's guns/turrets/stats are
// inherited unchanged, but movement is cursor-driven and skills are maxed.
function buildMinionType(className, classDef) {
    // Preserve any existing ON handlers the class already has
    const baseON = Array.isArray(classDef.ON) ? classDef.ON : [];

    return [className, {
        INDEPENDENT:  true,
        DRAW_HEALTH:  true,
        SKILL:        [7, 7, 7, 7, 7, 7, 7, 7, 7, 7],
        CONTROLLERS:  COMBAT_CONTROLLERS,   // attack; movement from ON:tick below
        ON: [...baseON, CURSOR_TICK_HANDLER],
    }];
}

// ═════════════════════════════════════════════════════════════════════════════
//  HELPERS
// ═════════════════════════════════════════════════════════════════════════════

function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

// Distribute `total` children across `n` slots as evenly as possible.
// The first `total % n` slots get one extra child.
function distribute(total, n) {
    const base = Math.floor(total / n);
    const bonus = total % n;
    return Array.from({ length: n }, (_, i) => base + (i < bonus ? 1 : 0));
}

// ═════════════════════════════════════════════════════════════════════════════
//  DECORATIVE SHAPES
// ═════════════════════════════════════════════════════════════════════════════

const STAR8 =
    'M 0 -1 L 0.19 -0.19 L 1 0 L 0.19 0.19 L 0 1 ' +
    'L -0.19 0.19 L -1 0 L -0.19 -0.19 Z';

const SMOOTH_RING =
    'M 0 -1 L 0.22 -0.97 L 0.43 -0.9 L 0.62 -0.78 L 0.78 -0.62 ' +
    'L 0.9 -0.43 L 0.97 -0.22 L 1 0 L 0.97 0.22 L 0.9 0.43 ' +
    'L 0.78 0.62 L 0.62 0.78 L 0.43 0.9 L 0.22 0.97 L 0 1 ' +
    'L -0.22 0.97 L -0.43 0.9 L -0.62 0.78 L -0.78 0.62 ' +
    'L -0.9 0.43 L -0.97 0.22 L -1 0 L -0.97 -0.22 L -0.9 -0.43 ' +
    'L -0.78 -0.62 L -0.62 -0.78 L -0.43 -0.9 L -0.22 -0.97 Z';

// 16-pointed star / spiky octagon for the boss body
const BOSS_SHAPE =
    'M 0 -1 L 0.18 -0.45 L 0.71 -0.71 L 0.45 -0.18 L 1 0 ' +
    'L 0.45 0.18 L 0.71 0.71 L 0.18 0.45 L 0 1 ' +
    'L -0.18 0.45 L -0.71 0.71 L -0.45 0.18 L -1 0 ' +
    'L -0.45 -0.18 L -0.71 -0.71 L -0.18 -0.45 Z';

// ═════════════════════════════════════════════════════════════════════════════
//  MODULE EXPORT — runs after ALL definition files have loaded
// ═════════════════════════════════════════════════════════════════════════════

module.exports = ({ Class }) => {
    console.log('[RandomSpawnerBoss] Loading v3...');

    // ── 1. Scan every class registered so far ─────────────────────────────────
    //  This catches tanks.js, bosses.js, minibosses.js, entityaddons, custom
    //  definition files — everything, because they all write into global.Class.
    const usable = Object.keys(Class).filter(name => isUsableMinion(name, Class[name]));

    console.log(`[RandomSpawnerBoss] Scanned ${Object.keys(Class).length} classes, ` +
        `${usable.length} are usable as minions.`);

    if (usable.length === 0) {
        console.error('[RandomSpawnerBoss] No usable minion classes found — ' +
            'check filter or load order. Aborting.');
        return;
    }

    // ── 2. Pick a random session pool ─────────────────────────────────────────
    const poolSize = Math.min(POOL_SIZE, usable.length);
    const pool     = shuffle(usable).slice(0, poolSize);
    const counts   = distribute(MAX_CHILDREN, poolSize);

    console.log('[RandomSpawnerBoss] Session pool:');
    pool.forEach((name, i) => {
        console.log(`  [${i + 1}] ${Class[name].LABEL || name} (${name})  ×${counts[i]}`);
    });

    // ── 3. Define decorative deco turret classes ───────────────────────────────
    Class.spwnBossRing_fast = {
        PARENT: 'genericTank', LABEL: '',
        SHAPE: STAR8, COLOR: '#cc2200',
        INDEPENDENT: true, DRAW_HEALTH: false,
        CONTROLLERS: [['spin', { speed: 0.08 }]],
        GUNS: [], TURRETS: [],
    };
    Class.spwnBossRing_mid = {
        PARENT: 'genericTank', LABEL: '',
        SHAPE: SMOOTH_RING, COLOR: '#440000',
        INDEPENDENT: true, DRAW_HEALTH: false,
        CONTROLLERS: [['spin', { speed: -0.045 }]],
        GUNS: [], TURRETS: [],
    };
    Class.spwnBossRing_slow = {
        PARENT: 'genericTank', LABEL: '',
        SHAPE: STAR8, COLOR: '#ff4400',
        INDEPENDENT: true, DRAW_HEALTH: false,
        CONTROLLERS: [['spin', { speed: 0.025 }]],
        GUNS: [], TURRETS: [],
    };
    Class.spwnBossBarrelStub = {
        PARENT: 'genericTank', LABEL: '',
        SHAPE: 0, COLOR: '#551111',
        INDEPENDENT: true, DRAW_HEALTH: false,
        CONTROLLERS: [], GUNS: [], TURRETS: [],
    };

    // ── 4. Build the spawn gun list ────────────────────────────────────────────
    //  One gun entry per pool type, each limited to its share of MAX_CHILDREN.
    //  The TYPE is `[className, overrides]` — OSA spawns the real tank class
    //  then applies the overrides (cursor ON:tick + maxed skills + INDEPENDENT).
    const spawnShootSettings = safeCS(
        g.minion ?? { reload: 2, health: 2, size: 1.2 },
        { reload: 1.8, size: 1.1, damage: 0.8, speed: 1 }
    );

    const spawnGuns = pool.map((className, i) => ({
        POSITION: [4, 12, 1.3, 14, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS:   spawnShootSettings,
            TYPE:             buildMinionType(className, Class[className]),
            STAT_CALCULATOR:  'drone',
            AUTOFIRE:         true,
            SYNCS_SKILLS:     true,
            WAIT_TO_CYCLE:    true,
            MAX_CHILDREN:     counts[i],
        },
    }));

    // ── 5. Define the boss ─────────────────────────────────────────────────────
    Class.randomSpawnerBoss = {
        PARENT: 'miniboss',
        LABEL:  'The Spawner',
        COLOR:  '#1a0000',
        SHAPE:  BOSS_SHAPE,
        SIZE:   42,
        DANGER: 14,
        VALUE:  1_000_000,
        SKILL:  [9, 9, 9, 9, 9, 9, 9, 9, 9, 9],

        BODY: {
            FOV:    base.FOV   * 1.8,
            HEALTH: 1400,
            SHIELD: 300,
            REGEN:  base.REGEN * 0.08,
            SPEED:  base.SPEED * 0.22,
            DAMAGE: 10,
        },

        CONTROLLERS: [['minion', { orbit: 220 }]],
        FACING_TYPE: ['spin', { speed: 0.018 }],
        BROADCAST_MESSAGE:
            '⚠  The Spawner has arrived!  Aim your cursor to direct minions!  ⚠',

        // ── Decorative spinning rings + 8 barrel stubs ────────────────────────
        TURRETS: [
            { POSITION: [42, 0, 0, 0, 0, 1], TYPE: 'spwnBossRing_slow' },
            { POSITION: [33, 0, 0, 0, 0, 1], TYPE: 'spwnBossRing_mid'  },
            { POSITION: [23, 0, 0, 0, 0, 1], TYPE: 'spwnBossRing_fast' },
            // 8 evenly-spaced barrel stubs around the body perimeter
            ...Array.from({ length: 8 }, (_, i) => ({
                POSITION: [5, 14, 0, (360 / 8) * i, 20, 0],
                TYPE: 'spwnBossBarrelStub',
            })),
        ],

        GUNS: [
            // 8 cosmetic cannon housings that rotate with the body
            ...Array.from({ length: 8 }, (_, i) => ({
                POSITION: [16, 10, -1.4, 5, 0, (360 / 8) * i, 0],
                PROPERTIES: { COLOR: '#330000' },
            })),
            // The actual spawn guns — one per pool type
            ...spawnGuns,
        ],
    };

    // ── 6. Register in the dev / addons menu ───────────────────────────────────
    //  Tries common menu class names used across different OSA versions/forks.
    const menuNames = ['menu_addons', 'addons', 'menu_bosses', 'devMenu'];
    const menuHit   = menuNames.find(n => Array.isArray(Class[n]?.UPGRADES_TIER_0));

    if (menuHit) {
        Class[menuHit].UPGRADES_TIER_0.push('randomSpawnerBoss');
        console.log(`[RandomSpawnerBoss] Registered in Class.${menuHit}.UPGRADES_TIER_0`);
    } else {
        console.warn(
            '[RandomSpawnerBoss] Could not find a menu class to auto-register into.\n' +
            '  Add "randomSpawnerBoss" to your desired UPGRADES_TIER_0 array manually.'
        );
    }

    console.log(
        `[RandomSpawnerBoss] Ready. ` +
        `${poolSize} types, ${MAX_CHILDREN} max children total.`
    );
};