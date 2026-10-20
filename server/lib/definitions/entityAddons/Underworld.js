// ═══════════════════════════════════════════════════════════════════════════════
//  U N D E R W O R L D   A D D O N
//  A dark/spooky themed addon for Open Source Arras (OSA)
//
//  Contents:
//    • Playable tanks  — 10 tanks across 2 branches (Wraith & Lich branches)
//    • Boss            — The Revenant (miniboss) + Phantom King (true boss)
//    • Projectiles     — soul bullets, spectral drones, cursed traps, grave shards
//    • Menu            — accessible via dev/addons menu
//
//  Drop this file into your server/entityAddons/ (or tankAddons/) folder.
//  OSA will auto-load it.
// ═══════════════════════════════════════════════════════════════════════════════

const { combineStats } = require('../facilitators.js');
const _facs   = require('../facilitators.js');
const _consts = require('../constants.js');
const { base, statnames } = _consts;
const g = require('../gunvals.js');

// ── facilitator shims ─────────────────────────────────────────────────────────
const makeMenu = _facs.makeMenu || _facs.menu || ((label, color, danger) => ({
    PARENT: ['genericTank'], LABEL: label || '', COLOR: color || 'white',
    DANGER: danger || 9, SIZE: 14, GUNS: [], TURRETS: [], UPGRADES_TIER_0: [],
}));

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

// ── Stat multiplier sets ──────────────────────────────────────────────────────
// "soul" bullets — fast, fade through, medium damage
const uw = {
    soul:        { speed: 1.4, maxSpeed: 1.4, health: 0.6,  damage: 1.1, range: 1.2, reload: 1.1 },
    specter:     { speed: 0.9, maxSpeed: 0.9, health: 1.8,  damage: 0.8, range: 0.8, reload: 0.9, pen: 1.5 },
    grave:       { speed: 0.5, maxSpeed: 0.6, health: 2.5,  damage: 1.6, range: 0.6, reload: 1.4, size: 1.3 },
    curse:       { reload: 0.7, damage: 1.2, resist: 1.3, density: 1.2 },
    phantom:     { speed: 1.6, maxSpeed: 1.8, health: 0.4,  damage: 0.9, range: 1.5, reload: 0.8 },
    lich:        { damage: 1.35, health: 1.35, reload: 1.2, speed: 1.1, pen: 1.2 },
    revenant:    { damage: 1.8, health: 1.8, reload: 1.3, speed: 1.2, resist: 1.2 },
};

// ── Color palette (dark/spooky) ───────────────────────────────────────────────
// OSA uses named colors OR hex strings
const COL = {
    wraith:  '#9b59b6', // pale violet
    lich:    '#1abc9c', // sickly teal
    bone:    '#c8c8a0', // aged bone
    void:    '#2c2c54', // deep void
    blood:   '#8b0000', // dark crimson
    soul:    '#7ed6df', // ghostly cyan
    grave:   '#4a4a4a', // dark stone grey
    phantom: '#d6a2e8', // lavender phantom
    king:    '#f8c291', // pale gold (Phantom King)
};

module.exports = ({ Class }) => {
    console.log('[underworld] Loading Underworld addon...');

    // ══════════════════════════════════════════════════════════════════════════
    //  P R O J E C T I L E S
    // ══════════════════════════════════════════════════════════════════════════

    // Soul bullet — fast, slightly transparent, haunting blue
    Class.soulBullet_UW = {
        PARENT: 'bullet',
        COLOR:  COL.soul,
        ALPHA:  0.75,
        SHAPE:  0,
    };

    // Grave shard — slow, heavy, bony spike
    Class.graveShard_UW = {
        PARENT: 'bullet',
        COLOR:  COL.bone,
        ALPHA:  0.9,
        SHAPE:  3, // triangle
    };

    // Spectral drone — follows enemies, slightly transparent
    Class.spectralDrone_UW = {
        PARENT: 'drone',
        COLOR:  COL.wraith,
        ALPHA:  0.6,
        SHAPE:  -5, // star-like
    };

    // Cursed trap — dark purple trap with high penetration
    Class.cursedTrap_UW = {
        PARENT: 'trap',
        COLOR:  COL.void,
        ALPHA:  0.85,
    };

    // Phantom missile — leaves a ghostly trail
    Class.phantomMissile_UW = {
        PARENT: 'missile',
        COLOR:  COL.phantom,
        ALPHA:  0.7,
        GUNS: [
            {
                POSITION: [12, 5, 1, 0, 0, 180, 0],
                PROPERTIES: {
                    AUTOFIRE: true,
                    SHOOT_SETTINGS: combineStats([g.basic, g.lowPower, uw.phantom, { recoil: 0.5 }]),
                    TYPE: ['soulBullet_UW', { PERSISTS_AFTER_DEATH: true }],
                    STAT_CALCULATOR: 'thruster',
                }
            }
        ],
    };

    // Wraith swarm — ghostly orbiting swarm
    Class.wraithSwarm_UW = {
        PARENT: 'swarm',
        COLOR:  COL.wraith,
        ALPHA:  0.55,
        SHAPE:  0,
    };

    // ══════════════════════════════════════════════════════════════════════════
    //  P L A Y A B L E   T A N K S
    //
    //  WRAITH BRANCH  (stealth/speed/spectral bullets)
    //    Tier 0  →  Wraith
    //    Tier 1  →  Poltergeist | Banshee
    //    Tier 2  →  Haunt | Revenant | Specter | Wail
    //
    //  LICH BRANCH  (traps/drones/grave weapons)
    //    Tier 0  →  Lich
    //    Tier 1  →  Gravedigger | Necromancer
    //    Tier 2  →  Tombstone | Bone Archer | Soul Warden | Cursed Eye
    // ══════════════════════════════════════════════════════════════════════════

    // ─── TIER 0 ───────────────────────────────────────────────────────────────

    // Wraith — base ghost tank, fires pale soul bullets
    Class.wraith_UW = {
        PARENT: ['genericTank'],
        LABEL:  'Wraith',
        COLOR:  COL.wraith,
        DANGER: 5,
        UPGRADE_COLOR: COL.wraith,
        BODY: {
            FOV: base.FOV * 1.1,
            SPEED: base.SPEED * 1.1,
        },
        GUNS: [
            {
                POSITION: [20, 9, 1, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, uw.soul]),
                    TYPE: 'soulBullet_UW',
                }
            }
        ],
        UPGRADES_TIER_0: [],
    };

    // Lich — base undead tank, fires grave shards
    Class.lich_UW = {
        PARENT: ['genericTank'],
        LABEL:  'Lich',
        COLOR:  COL.lich,
        DANGER: 5,
        UPGRADE_COLOR: COL.lich,
        BODY: {
            FOV: base.FOV * 1.05,
            HEALTH: base.HEALTH * 1.1,
        },
        GUNS: [
            {
                POSITION: [18, 11, 1, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, uw.grave]),
                    TYPE: 'graveShard_UW',
                }
            }
        ],
        UPGRADES_TIER_0: [],
    };

    // ─── WRAITH BRANCH — TIER 1 ───────────────────────────────────────────────

    // Poltergeist — twin fast ghost bullets, high FOV
    Class.poltergeist_UW = {
        PARENT: ['wraith_UW'],
        LABEL:  'Poltergeist',
        COLOR:  COL.phantom,
        BODY: { FOV: base.FOV * 1.2 },
        GUNS: [
            {
                POSITION: [20, 7, 1, 0, 4, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.twin, uw.soul, uw.phantom]),
                    TYPE: 'soulBullet_UW',
                }
            },
            {
                POSITION: [20, 7, 1, 0, -4, 0, 0.5],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.twin, uw.soul, uw.phantom]),
                    TYPE: 'soulBullet_UW',
                }
            }
        ],
        UPGRADES_TIER_0: [],
    };

    // Banshee — fires a spread of wailing soul bullets + rear ghost burst
    Class.banshee_UW = {
        PARENT: ['wraith_UW'],
        LABEL:  'Banshee',
        COLOR:  COL.void,
        BODY: { SPEED: base.SPEED * 1.15 },
        GUNS: [
            {
                POSITION: [19, 8, 1, 0, -2, -22, 0.5],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.tripleShot, uw.soul]),
                    TYPE: 'soulBullet_UW',
                }
            },
            {
                POSITION: [19, 8, 1, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.tripleShot, uw.soul]),
                    TYPE: 'soulBullet_UW',
                }
            },
            {
                POSITION: [19, 8, 1, 0, 2, 22, 0.5],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.tripleShot, uw.soul]),
                    TYPE: 'soulBullet_UW',
                }
            },
            // rear wail
            {
                POSITION: [14, 6, 1, 0, 0, 180, 0.75],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.lowPower, uw.soul, { damage: 0.6 }]),
                    TYPE: 'soulBullet_UW',
                }
            },
        ],
        UPGRADES_TIER_0: [],
    };

    // ─── WRAITH BRANCH — TIER 2 ───────────────────────────────────────────────

    // Haunt — sniper-range soul bullet, huge FOV, near-invisible
    Class.haunt_UW = {
        PARENT: ['poltergeist_UW'],
        LABEL:  'Haunt',
        COLOR:  COL.soul,
        INVISIBLE: [0.03, 0.07], // fades in/out slowly
        BODY: {
            FOV:   base.FOV * 1.6,
            SPEED: base.SPEED * 1.05,
        },
        GUNS: [
            {
                POSITION: [30, 7, 1, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.assassin, uw.soul, uw.phantom]),
                    TYPE: 'soulBullet_UW',
                }
            },
            {
                POSITION: [8, 7, -1.2, 8, 0, 0, 0], // barrel decoration
            }
        ],
        UPGRADES_TIER_0: [],
    };

    // Revenant (playable) — heavy twin pounder soul, slow but hits hard
    Class.revenantTank_UW = {
        PARENT: ['poltergeist_UW'],
        LABEL:  'Revenant',
        COLOR:  COL.blood,
        BODY: {
            HEALTH: base.HEALTH * 1.3,
            SPEED:  base.SPEED * 0.9,
            FOV:    base.FOV  * 1.1,
        },
        GUNS: [
            {
                POSITION: [22, 14, 1, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.pounder, uw.soul, uw.specter]),
                    TYPE: 'soulBullet_UW',
                }
            },
            {
                POSITION: [17, 14, 1, 0, 0, 0, 0], // barrel
            }
        ],
        UPGRADES_TIER_0: [],
    };

    // Specter — auto-turret on top, invisible, orbiting wraithswarms
    Class.specter_UW = {
        PARENT: ['banshee_UW'],
        LABEL:  'Specter',
        COLOR:  COL.wraith,
        INVISIBLE: [0.05, 0.1],
        BODY: { FOV: base.FOV * 1.2 },
        GUNS: [
            {
                POSITION: [19, 7, 1, 0, -2, -22, 0.5],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.tripleShot, uw.soul, uw.phantom]),
                    TYPE: 'soulBullet_UW',
                }
            },
            {
                POSITION: [19, 7, 1, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.tripleShot, uw.soul, uw.phantom]),
                    TYPE: 'soulBullet_UW',
                }
            },
            {
                POSITION: [19, 7, 1, 0, 2, 22, 0.5],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.tripleShot, uw.soul, uw.phantom]),
                    TYPE: 'soulBullet_UW',
                }
            },
            // side wraithswarm launchers
            {
                POSITION: [7, 7, 0.6, 7, 0, 90, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.swarm, uw.curse]),
                    TYPE: 'wraithSwarm_UW',
                    STAT_CALCULATOR: 'swarm',
                }
            },
            {
                POSITION: [7, 7, 0.6, 7, 0, -90, 0.5],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.swarm, uw.curse]),
                    TYPE: 'wraithSwarm_UW',
                    STAT_CALCULATOR: 'swarm',
                }
            },
        ],
        TURRETS: [
            {
                POSITION: [9, 0, 0, 0, 360, 1],
                TYPE: ['autoTurret', { GUN_STAT_SCALE: combineStats([g.autoTurret, uw.soul]) }],
            }
        ],
        UPGRADES_TIER_0: [],
    };

    // Wail — rapid-fire soul machinegun + phantom missile launcher
    Class.wail_UW = {
        PARENT: ['banshee_UW'],
        LABEL:  'Wail',
        COLOR:  COL.blood,
        BODY: { FOV: base.FOV * 1.15 },
        GUNS: [
            {
                POSITION: [20, 8, 1, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, uw.soul, uw.phantom]),
                    TYPE: 'soulBullet_UW',
                }
            },
            {
                POSITION: [12, 6, 1, 0, 0, 180, 0.5],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.lowPower, uw.soul, { damage: 0.5, reload: 0.6 }]),
                    TYPE: 'soulBullet_UW',
                }
            },
            // phantom missile on side
            {
                POSITION: [11, 10, -0.7, 9, 0, 90, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.pounder, y_launcher, uw.soul]),
                    TYPE: 'phantomMissile_UW',
                    STAT_CALCULATOR: 'sustained',
                }
            },
        ],
        UPGRADES_TIER_0: [],
    };

    // ─── LICH BRANCH — TIER 1 ─────────────────────────────────────────────────

    // Gravedigger — dual grave shard barrels, slow reload
    Class.gravedigger_UW = {
        PARENT: ['lich_UW'],
        LABEL:  'Gravedigger',
        COLOR:  COL.grave,
        BODY: {
            HEALTH: base.HEALTH * 1.15,
            SPEED:  base.SPEED * 0.95,
        },
        GUNS: [
            {
                POSITION: [19, 12, 1, 0, 5, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.twin, uw.grave]),
                    TYPE: 'graveShard_UW',
                }
            },
            {
                POSITION: [19, 12, 1, 0, -5, 0, 0.5],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.twin, uw.grave]),
                    TYPE: 'graveShard_UW',
                }
            },
        ],
        UPGRADES_TIER_0: [],
    };

    // Necromancer — spawns spectral drones from two side barrels
    Class.necromancer_UW = {
        PARENT: ['lich_UW'],
        LABEL:  'Necromancer',
        COLOR:  COL.void,
        BODY: { FOV: base.FOV * 1.15 },
        GUNS: [
            {
                POSITION: [8, 11, 1.2, 6, 0, 45, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.drone, g.overseer, uw.curse]),
                    TYPE: 'spectralDrone_UW',
                    AUTOFIRE: true,
                    SYNCS_SKILLS: true,
                    STAT_CALCULATOR: 'drone',
                    MAX_CHILDREN: 6,
                }
            },
            {
                POSITION: [8, 11, 1.2, 6, 0, -45, 0.5],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.drone, g.overseer, uw.curse]),
                    TYPE: 'spectralDrone_UW',
                    AUTOFIRE: true,
                    SYNCS_SKILLS: true,
                    STAT_CALCULATOR: 'drone',
                    MAX_CHILDREN: 6,
                }
            },
        ],
        UPGRADES_TIER_0: [],
    };

    // ─── LICH BRANCH — TIER 2 ─────────────────────────────────────────────────

    // Tombstone — places cursed traps in a ring around itself
    Class.tombstone_UW = {
        PARENT: ['gravedigger_UW'],
        LABEL:  'Tombstone',
        COLOR:  COL.grave,
        BODY: {
            HEALTH: base.HEALTH * 1.25,
            SPEED:  base.SPEED * 0.85,
        },
        GUNS: [
            // front grave shard
            {
                POSITION: [18, 11, 1, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, uw.grave]),
                    TYPE: 'graveShard_UW',
                }
            },
            // ring of cursed traps (6 directions)
            ...weaponArray({
                POSITION: [3, 9, 1.6, 12, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.trap, uw.curse, { range: 0.6 }]),
                    TYPE: 'cursedTrap_UW',
                    STAT_CALCULATOR: 'trap',
                }
            }, 6),
        ],
        UPGRADES_TIER_0: [],
    };

    // Bone Archer — long-range grave shard sniper with crossbow-style offset barrels
    Class.boneArcher_UW = {
        PARENT: ['gravedigger_UW'],
        LABEL:  'Bone Archer',
        COLOR:  COL.bone,
        BODY: {
            FOV:   base.FOV   * 1.5,
            SPEED: base.SPEED * 1.0,
        },
        GUNS: [
            { POSITION: [7, 3, 1, 0, 3.5, 30, 0.5] },
            { POSITION: [7, 3, 1, 0, -3.5, -30, 0.5] },
            {
                POSITION: [28, 7, 1, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.rifle, uw.grave, uw.lich]),
                    TYPE: 'graveShard_UW',
                }
            },
            {
                POSITION: [22, 4, 1, 0, 3, 15, 0.5],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.crossbow, uw.grave, { damage: 0.7 }]),
                    TYPE: 'graveShard_UW',
                }
            },
            {
                POSITION: [22, 4, 1, 0, -3, -15, 0.5],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.crossbow, uw.grave, { damage: 0.7 }]),
                    TYPE: 'graveShard_UW',
                }
            },
        ],
        UPGRADES_TIER_0: [],
    };

    // Soul Warden — mass spectral drone commander with a front grave shard burst
    Class.soulWarden_UW = {
        PARENT: ['necromancer_UW'],
        LABEL:  'Soul Warden',
        COLOR:  COL.wraith,
        BODY: {
            FOV:    base.FOV    * 1.2,
            HEALTH: base.HEALTH * 1.1,
        },
        GUNS: [
            // four drone spawners in a cross
            {
                POSITION: [8, 11, 1.2, 6, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.drone, g.overseer, uw.curse, uw.lich]),
                    TYPE: 'spectralDrone_UW',
                    AUTOFIRE: true,
                    SYNCS_SKILLS: true,
                    STAT_CALCULATOR: 'drone',
                    MAX_CHILDREN: 8,
                }
            },
            {
                POSITION: [8, 11, 1.2, 6, 0, 90, 0.25],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.drone, g.overseer, uw.curse, uw.lich]),
                    TYPE: 'spectralDrone_UW',
                    AUTOFIRE: true,
                    SYNCS_SKILLS: true,
                    STAT_CALCULATOR: 'drone',
                    MAX_CHILDREN: 8,
                }
            },
            {
                POSITION: [8, 11, 1.2, 6, 0, 180, 0.5],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.drone, g.overseer, uw.curse, uw.lich]),
                    TYPE: 'spectralDrone_UW',
                    AUTOFIRE: true,
                    SYNCS_SKILLS: true,
                    STAT_CALCULATOR: 'drone',
                    MAX_CHILDREN: 8,
                }
            },
            {
                POSITION: [8, 11, 1.2, 6, 0, 270, 0.75],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.drone, g.overseer, uw.curse, uw.lich]),
                    TYPE: 'spectralDrone_UW',
                    AUTOFIRE: true,
                    SYNCS_SKILLS: true,
                    STAT_CALCULATOR: 'drone',
                    MAX_CHILDREN: 8,
                }
            },
        ],
        UPGRADES_TIER_0: [],
    };

    // Cursed Eye — a sentry-style tank; plants cursed traps AND fires soul bullets from auto-turret eye
    Class.cursedEye_UW = {
        PARENT: ['necromancer_UW'],
        LABEL:  'Cursed Eye',
        COLOR:  COL.blood,
        BODY: {
            FOV:    base.FOV    * 1.3,
            HEALTH: base.HEALTH * 1.05,
        },
        // "pupil" auto-turret on top
        TURRETS: [
            {
                POSITION: [10, 0, 0, 0, 360, 1],
                TYPE: ['autoTurret', {
                    GUN_STAT_SCALE: combineStats([g.autoTurret, uw.soul, uw.lich]),
                    COLOR: COL.blood,
                }],
            }
        ],
        GUNS: [
            // forward cursed trap launcher
            {
                POSITION: [14, 9, 1, 0, 0, 0, 0],
            },
            {
                POSITION: [3, 9, 1.6, 14, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.trap, uw.curse, uw.lich]),
                    TYPE: 'cursedTrap_UW',
                    STAT_CALCULATOR: 'trap',
                }
            },
            // spectral drones on both sides
            {
                POSITION: [7, 9, 1.1, 5, 0, 60, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.drone, g.overseer, uw.curse]),
                    TYPE: 'spectralDrone_UW',
                    AUTOFIRE: true,
                    SYNCS_SKILLS: true,
                    STAT_CALCULATOR: 'drone',
                    MAX_CHILDREN: 4,
                }
            },
            {
                POSITION: [7, 9, 1.1, 5, 0, -60, 0.5],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.drone, g.overseer, uw.curse]),
                    TYPE: 'spectralDrone_UW',
                    AUTOFIRE: true,
                    SYNCS_SKILLS: true,
                    STAT_CALCULATOR: 'drone',
                    MAX_CHILDREN: 4,
                }
            },
        ],
        UPGRADES_TIER_0: [],
    };

    // ══════════════════════════════════════════════════════════════════════════
    //  B O S S E S
    // ══════════════════════════════════════════════════════════════════════════

    // ─── The Revenant (miniboss) ──────────────────────────────────────────────
    // A haunted 7-sided entity that fires rings of soul bullets and drops cursed
    // traps. Slower than a normal tank but extremely tanky. Orbits the center.

    // Revenant soul-burst auto-turret (used on its body)
    Class.revenantTurret_UW = {
        PARENT: 'autoTurret',
        LABEL: 'Soul Eye',
        INDEPENDENT: true,
        COLOR: COL.soul,
        BODY: { FOV: base.FOV * 1.4 },
        GUNS: [
            {
                POSITION: [22, 7, 1, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.sniper, uw.soul, uw.revenant]),
                    TYPE: 'soulBullet_UW',
                }
            },
            { POSITION: [10, 9, 1, 0, 0, 0, 0] },
        ],
    };

    Class.theRevenant_UW = {
        PARENT: 'miniboss',
        LABEL:  'The Revenant',
        COLOR:  COL.void,
        SHAPE:  7,
        DANGER: 8,
        SIZE:   35,
        VALUE:  5e4,
        ALPHA:  0.88,
        CONTROLLERS: [['minion', { orbit: 200 }]],
        FACING_TYPE: ['spin', { speed: 0.015 / (Config.runSpeed || 1) }],
        BROADCAST_MESSAGE: 'The Revenant stirs from its grave...',
        BODY: {
            FOV:    1.2,
            HEALTH: 600,
            SHIELD: 80,
            REGEN:  base.REGEN * 0.08,
            SPEED:  base.SPEED * 0.25,
            DAMAGE: 5,
        },
        // Ring of grave-shard barrels around the body
        GUNS: [
            ...weaponArray([
                { POSITION: [10, 4, 1, 0, 0, 180, 0] },
                {
                    POSITION: [1, 4, 1.6, 10, 0, 180, 0],
                    PROPERTIES: {
                        SHOOT_SETTINGS: combineStats([g.trap, uw.curse, uw.revenant, { reload: 1.5 }]),
                        TYPE: 'cursedTrap_UW',
                        STAT_CALCULATOR: 'trap',
                        AUTOFIRE: true,
                    }
                }
            ], 7),
        ],
        TURRETS: [
            // 3 soul-sniper auto-turrets around the body
            { POSITION: [9, 7.5, 0, 0,   180, 1], TYPE: 'revenantTurret_UW' },
            { POSITION: [9, 7.5, 0, 120, 180, 1], TYPE: 'revenantTurret_UW' },
            { POSITION: [9, 7.5, 0, 240, 180, 1], TYPE: 'revenantTurret_UW' },
        ],
    };

    // ─── Phantom King (true boss) ─────────────────────────────────────────────
    // An 11-sided pale entity surrounded by spirits. Three weapon rings:
    //   Inner  — spawns spectral drones in all directions
    //   Middle — fires phantom missiles
    //   Outer  — auto-targeting soul snipers
    // Slow, massive, devastating. Broadcasts a dramatic message on death.

    // Phantom King weapon turrets
    Class.pkDroneTurret_UW = {
        PARENT: 'autoTurret',
        LABEL: 'Spirit Well',
        INDEPENDENT: true,
        COLOR: COL.phantom,
        BODY: { FOV: base.FOV * 1.0 },
        GUNS: [
            {
                POSITION: [8, 10, 1.1, 5, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.drone, g.summoner, uw.curse, uw.revenant, { density: 1.5 }]),
                    TYPE: 'spectralDrone_UW',
                    AUTOFIRE: true,
                    SYNCS_SKILLS: true,
                    STAT_CALCULATOR: 'drone',
                    MAX_CHILDREN: 12,
                    WAIT_TO_CYCLE: true,
                }
            }
        ],
    };

    Class.pkMissileTurret_UW = {
        PARENT: 'autoTurret',
        LABEL: 'Phantom Cannon',
        INDEPENDENT: true,
        COLOR: COL.wraith,
        BODY: { FOV: base.FOV * 1.3 },
        GUNS: [
            { POSITION: [10, 12, -0.6, 8, 0, 0, 0] },
            {
                POSITION: [18, 14, 1, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.pounder, { reload: 1.5, speed: 0.7, maxSpeed: 1.3, health: 1.8, damage: 1.5, resist: 1.2 }, uw.revenant]),
                    TYPE: 'phantomMissile_UW',
                    STAT_CALCULATOR: 'sustained',
                }
            },
        ],
    };

    Class.pkSniperTurret_UW = {
        PARENT: 'autoTurret',
        LABEL: 'Wailing Eye',
        INDEPENDENT: true,
        COLOR: COL.soul,
        BODY: { FOV: base.FOV * 1.8 },
        GUNS: [
            { POSITION: [8, 12, 1, 0, 0, 0, 0] },
            {
                POSITION: [26, 7, 1, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.assassin, uw.soul, uw.revenant, { damage: 1.4, reload: 1.3 }]),
                    TYPE: 'soulBullet_UW',
                }
            },
        ],
    };

    Class.phantomKing_UW = {
        PARENT: 'miniboss',
        LABEL:  'Phantom King',
        COLOR:  COL.king,
        SHAPE:  11,
        DANGER: 11,
        SIZE:   55,
        VALUE:  5e5,
        ALPHA:  0.92,
        CONTROLLERS: [['minion', { orbit: 300 }]],
        FACING_TYPE: ['spin', { speed: 0.008 / (Config.runSpeed || 1) }],
        BROADCAST_MESSAGE: 'The Phantom King has been banished... for now.',
        BODY: {
            FOV:    1.5,
            HEALTH: 2200,
            SHIELD: 350,
            REGEN:  base.REGEN * 0.12,
            SPEED:  base.SPEED * 0.12,
            DAMAGE: 10,
        },
        SKILL: [12, 12, 12, 12, 12, 12, 12, 12, 12, 12],
        // Body ring of grave shards (fired backward as a defensive ring)
        GUNS: weaponArray([
            { POSITION: [12, 4, 1, 0, 0, 180, 0] },
            {
                POSITION: [1.5, 4, 1.6, 12, 0, 180, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.trap, uw.curse, uw.revenant, { reload: 2.2, health: 2, damage: 2 }]),
                    TYPE: 'cursedTrap_UW',
                    STAT_CALCULATOR: 'trap',
                    AUTOFIRE: true,
                }
            }
        ], 11),
        TURRETS: [
            // Inner ring — spirit wells (drone spawners)
            { POSITION: [7,  8.5, 0,  0,   180, 0], TYPE: 'pkDroneTurret_UW'  },
            { POSITION: [7,  8.5, 0,  60,  180, 0], TYPE: 'pkDroneTurret_UW'  },
            { POSITION: [7,  8.5, 0,  120, 180, 0], TYPE: 'pkDroneTurret_UW'  },
            { POSITION: [7,  8.5, 0,  180, 180, 0], TYPE: 'pkDroneTurret_UW'  },
            { POSITION: [7,  8.5, 0,  240, 180, 0], TYPE: 'pkDroneTurret_UW'  },
            { POSITION: [7,  8.5, 0,  300, 180, 0], TYPE: 'pkDroneTurret_UW'  },
            // Middle ring — phantom missile cannons
            { POSITION: [8.5, 8.5, 0,  30,  180, 1], TYPE: 'pkMissileTurret_UW' },
            { POSITION: [8.5, 8.5, 0,  90,  180, 1], TYPE: 'pkMissileTurret_UW' },
            { POSITION: [8.5, 8.5, 0,  150, 180, 1], TYPE: 'pkMissileTurret_UW' },
            { POSITION: [8.5, 8.5, 0,  210, 180, 1], TYPE: 'pkMissileTurret_UW' },
            { POSITION: [8.5, 8.5, 0,  270, 180, 1], TYPE: 'pkMissileTurret_UW' },
            { POSITION: [8.5, 8.5, 0,  330, 180, 1], TYPE: 'pkMissileTurret_UW' },
            // Outer ring — wailing eye snipers (independent auto-targeting)
            { POSITION: [9.5, 8.5, 0,  0,   180, 1], TYPE: 'pkSniperTurret_UW' },
            { POSITION: [9.5, 8.5, 0,  45,  180, 1], TYPE: 'pkSniperTurret_UW' },
            { POSITION: [9.5, 8.5, 0,  90,  180, 1], TYPE: 'pkSniperTurret_UW' },
            { POSITION: [9.5, 8.5, 0,  135, 180, 1], TYPE: 'pkSniperTurret_UW' },
            { POSITION: [9.5, 8.5, 0,  180, 180, 1], TYPE: 'pkSniperTurret_UW' },
            { POSITION: [9.5, 8.5, 0,  225, 180, 1], TYPE: 'pkSniperTurret_UW' },
            { POSITION: [9.5, 8.5, 0,  270, 180, 1], TYPE: 'pkSniperTurret_UW' },
            { POSITION: [9.5, 8.5, 0,  315, 180, 1], TYPE: 'pkSniperTurret_UW' },
        ],
    };

    // ══════════════════════════════════════════════════════════════════════════
    //  U P G R A D E   T R E E S
    // ══════════════════════════════════════════════════════════════════════════

    // Wraith branch
    Class.wraith_UW.UPGRADES_TIER_0     = ['poltergeist_UW', 'banshee_UW'];
    Class.poltergeist_UW.UPGRADES_TIER_0 = ['haunt_UW', 'revenantTank_UW'];
    Class.banshee_UW.UPGRADES_TIER_0     = ['specter_UW', 'wail_UW'];

    // Lich branch
    Class.lich_UW.UPGRADES_TIER_0        = ['gravedigger_UW', 'necromancer_UW'];
    Class.gravedigger_UW.UPGRADES_TIER_0  = ['tombstone_UW', 'boneArcher_UW'];
    Class.necromancer_UW.UPGRADES_TIER_0  = ['soulWarden_UW', 'cursedEye_UW'];

    // ══════════════════════════════════════════════════════════════════════════
    //  M E N U
    // ══════════════════════════════════════════════════════════════════════════

    Class.menu_UW = makeMenu('☠ Underworld', COL.void, 7);
    Class.menu_UW.UPGRADES_TIER_0 = [
        'wraith_UW', 'lich_UW',
        'theRevenant_UW', 'phantomKing_UW',
    ];
    Class.menu_UW.UPGRADE_TOOLTIP = 'Playable tanks, bosses & more from the Underworld.';

    // Colour-code upgrade arrows on the menu itself
    for (const name of [
        'wraith_UW', 'poltergeist_UW', 'banshee_UW',
        'haunt_UW', 'revenantTank_UW', 'specter_UW', 'wail_UW',
        'lich_UW', 'gravedigger_UW', 'necromancer_UW',
        'tombstone_UW', 'boneArcher_UW', 'soulWarden_UW', 'cursedEye_UW',
    ]) {
        if (Class[name]) Class[name].UPGRADE_COLOR = Class[name].COLOR;
    }

    // Hook into the addon/developer menu
    const entry = ['menu_addons', 'addons', 'developer']
        .find(n => Class[n] && Array.isArray(Class[n].UPGRADES_TIER_0));
    if (entry) {
        Class[entry].UPGRADES_TIER_0.push('menu_UW');
        console.log('[underworld] Connected to ' + entry);
    } else {
        console.warn('[underworld] Could not find addons menu — connect menu_UW manually.');
    }

    console.log('[underworld] Underworld addon loaded. 10 tanks, 2 bosses, 6 projectiles ready.');
};

// ── helper referenced inside wail_UW (launcher stat set) ─────────────────────
const y_launcher = { reload: 1.5, range: 1.1, speed: 0.6, maxSpeed: 1.4, recoil: 0.6, size: 0.95 };