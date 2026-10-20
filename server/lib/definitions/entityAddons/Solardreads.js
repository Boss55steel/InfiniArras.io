// ============================================================
//  SOLAR DREADS  —  The Solar System as Dreadnoughts
//  All classes use _SD suffix — zero collisions.
//
//  TIER STRUCTURE:
//  T1 (Sun/egg)    → 8 weapon families
//  T2 (Inner/sq)   → 5 branches per family (25 T2 weapon paths)
//  T3 (Outer/tri)  → 1 per T2 branch (25 T3 classes)
//  T4 (Belt/penta) → 1 per T3 class  (25 T4 finals)
//  GALAXIANS (hex) → 10 mega classes with custom SVG galaxy shapes
//
//  BODY TREE:
//  Mercury/Venus/Earth/Mars (T1) → Jupiter/Saturn/Uranus/Neptune (T2)
//  → Sun/BlackHole/Neutron/Pulsar/RedGiant/WhiteDwarf/DarkMatter/Quasar (T3)
// ============================================================

const { combineStats } = require('../facilitators.js');
const _constants = require('../constants.js');
const { smshskl, base } = _constants;
const g = require('../gunvals.js');

const safeStats = stats => combineStats(stats.filter(s => s != null));

const gunCalcNames = _constants.gunCalcNames || {};
if (!gunCalcNames.trap)      gunCalcNames.trap      = 'trap';
if (!gunCalcNames.drone)     gunCalcNames.drone     = 'drone';
if (!gunCalcNames.sustained) gunCalcNames.sustained = 'sustained';
if (!gunCalcNames.swarm)     gunCalcNames.swarm     = 'swarm';

// ── Gunval shims ──────────────────────────────────────────────────────────────
if (!g.pound) g.pound = { reload:1.6, recoil:1.8, speed:0.6, maxSpeed:0.6, size:1.3, damage:1.6, pen:1.4 };
if (!g.morerecoil) g.morerecoil = { recoil:1.6 };
if (!g.assass) g.assass = { speed:1.6, maxSpeed:1.6, reload:0.55, recoil:0 };
if (!g.hexatrap) g.hexatrap = { reload:0.7, health:1.5, speed:0.3, maxSpeed:0.3 };
if (!g.pounder) g.pounder = { reload:1.5, recoil:1.4, speed:0.65, maxSpeed:0.65, size:1.25, damage:1.5 };
if (!g.mach) g.mach = { speed:1.5, maxSpeed:1.5, reload:0.5 };
if (!g.flank) g.flank = { reload:0.85, recoil:0.85 };
if (!g.twin) g.twin = { reload:0.75 };
if (!g.gunner) g.gunner = { reload:0.5, size:0.6, speed:1.2, maxSpeed:1.2 };
if (!g.power) g.power = { damage:1.5, pen:1.5, health:1.5 };
if (!g.fake) g.fake = { size:0.00001, health:0.0001, speed:0, maxSpeed:0, shudder:0, spray:0, recoil:0, range:0 };
if (!g.sniper) g.sniper = { reload:0.5, recoil:0.5, speed:2, maxSpeed:2, range:1.5, spray:0.3, damage:1.5, pen:1.2 };
if (!g.skim) g.skim = { reload:1.2, recoil:2, speed:0.8, maxSpeed:0.8 };

// ── Custom SVG shapes ─────────────────────────────────────────────────────────

// SUN — 16-ray corona star
const SHAPE_SUN_SD =
    'M 0 -1 L 0.06 -0.5 L 0.31 -0.95 L 0.19 -0.46 L 0.71 -0.71 L 0.42 -0.31 ' +
    'L 0.95 -0.31 L 0.5 -0.06 L 1 0 L 0.5 0.06 L 0.95 0.31 L 0.42 0.31 ' +
    'L 0.71 0.71 L 0.19 0.46 L 0.31 0.95 L 0.06 0.5 L 0 1 L -0.06 0.5 ' +
    'L -0.31 0.95 L -0.19 0.46 L -0.71 0.71 L -0.42 0.31 L -0.95 0.31 ' +
    'L -0.5 0.06 L -1 0 L -0.5 -0.06 L -0.95 -0.31 L -0.42 -0.31 ' +
    'L -0.71 -0.71 L -0.19 -0.46 L -0.31 -0.95 L -0.06 -0.5 Z';

// INNER PLANET (square tier) — smooth octagon with crater marks
const SHAPE_INNER_SD =
    'M 0 -1 L 0.383 -0.924 L 0.707 -0.707 L 0.924 -0.383 L 1 0 ' +
    'L 0.924 0.383 L 0.707 0.707 L 0.383 0.924 L 0 1 ' +
    'L -0.383 0.924 L -0.707 0.707 L -0.924 0.383 L -1 0 ' +
    'L -0.924 -0.383 L -0.707 -0.707 L -0.383 -0.924 Z ' +
    'M -0.3 -0.5 L -0.18 -0.44 L -0.12 -0.3 L -0.18 -0.16 L -0.3 -0.1 L -0.42 -0.16 L -0.48 -0.3 L -0.42 -0.44 Z ' +
    'M 0.35 0.25 L 0.42 0.3 L 0.44 0.38 L 0.38 0.44 L 0.3 0.46 L 0.22 0.4 L 0.2 0.32 L 0.26 0.26 Z';

// OUTER PLANET (triangle tier) — gas giant with band lines
const SHAPE_OUTER_SD =
    'M 0 -1 L 0.5 -0.866 L 0.866 -0.5 L 1 0 L 0.866 0.5 L 0.5 0.866 ' +
    'L 0 1 L -0.5 0.866 L -0.866 0.5 L -1 0 L -0.866 -0.5 L -0.5 -0.866 Z ' +
    'M -0.9 -0.12 L 0.9 -0.12 M -0.85 0.08 L 0.85 0.08 M -0.7 0.28 L 0.7 0.28 M -0.5 0.45 L 0.5 0.45';

// BELT (pentagon tier) — irregular asteroid cluster
const SHAPE_BELT_SD =
    'M 0 -1 L 0.22 -0.72 L 0.6 -0.8 L 0.42 -0.45 L 0.95 -0.31 L 0.62 -0.05 ' +
    'L 0.95 0.31 L 0.55 0.3 L 0.6 0.8 L 0.22 0.58 L 0 1 ' +
    'L -0.22 0.58 L -0.6 0.8 L -0.55 0.3 L -0.95 0.31 ' +
    'L -0.62 -0.05 L -0.95 -0.31 L -0.42 -0.45 L -0.6 -0.8 L -0.22 -0.72 Z';

// SATURN ring body
const SHAPE_SATURN_SD =
    'M 0 -0.5 L 0.24 -0.43 L 0.43 -0.24 L 0.5 0 L 0.43 0.24 L 0.24 0.43 ' +
    'L 0 0.5 L -0.24 0.43 L -0.43 0.24 L -0.5 0 L -0.43 -0.24 L -0.24 -0.43 Z ' +
    'M -1.0 0.14 L -0.7 0.2 L -0.4 0.24 L 0 0.26 L 0.4 0.24 L 0.7 0.2 L 1.0 0.14 ' +
    'L 0.7 0.06 L 0.4 0.02 L 0 0 L -0.4 0.02 L -0.7 0.06 Z';

// ── GALAXY SHAPES FOR HEXAGONAL TIER ─────────────────────────────────────────

// MILKY WAY — two-arm barred spiral
const SHAPE_MILKYWAY_SD =
    'M 0 -0.18 L 0.08 -0.14 L 0.18 0 L 0.08 0.14 L 0 0.18 L -0.08 0.14 L -0.18 0 L -0.08 -0.14 Z ' +
    'M 0.14 -0.06 L 0.38 -0.28 L 0.65 -0.44 L 0.9 -0.32 L 1.0 -0.05 L 0.92 0.28 ' +
    'L 0.68 0.52 L 0.38 0.62 L 0.1 0.55 L -0.08 0.35 ' +
    'M -0.14 0.06 L -0.38 0.28 L -0.65 0.44 L -0.9 0.32 L -1.0 0.05 L -0.92 -0.28 ' +
    'L -0.68 -0.52 L -0.38 -0.62 L -0.1 -0.55 L 0.08 -0.35 ' +
    'M -0.38 -0.08 L 0.38 0.08';

// ANDROMEDA — tilted elliptical galaxy with dust lane
const SHAPE_ANDROMEDA_SD =
    'M 0 -0.88 L 0.2 -0.82 L 0.45 -0.62 L 0.68 -0.32 L 0.8 0 L 0.68 0.32 ' +
    'L 0.45 0.62 L 0.2 0.82 L 0 0.88 L -0.2 0.82 L -0.45 0.62 L -0.68 0.32 ' +
    'L -0.8 0 L -0.68 -0.32 L -0.45 -0.62 L -0.2 -0.82 Z ' +
    'M 0 -0.35 L 0.1 -0.3 L 0.22 -0.18 L 0.26 0 L 0.22 0.18 L 0.1 0.3 ' +
    'L 0 0.35 L -0.1 0.3 L -0.22 0.18 L -0.26 0 L -0.22 -0.18 L -0.1 -0.3 Z ' +
    'M -0.72 0.07 L 0.72 -0.07';

// WHIRLPOOL GALAXY — tight symmetric spiral
const SHAPE_WHIRLPOOL_SD =
    'M 0 -0.15 L 0.07 -0.12 L 0.15 0 L 0.07 0.12 L 0 0.15 L -0.07 0.12 L -0.15 0 L -0.07 -0.12 Z ' +
    'M 0.12 0 L 0.32 -0.2 L 0.58 -0.24 L 0.78 -0.1 L 0.84 0.18 L 0.72 0.44 ' +
    'L 0.5 0.6 L 0.22 0.64 L -0.05 0.54 L -0.22 0.36 L -0.26 0.12 ' +
    'M -0.12 0 L -0.32 0.2 L -0.58 0.24 L -0.78 0.1 L -0.84 -0.18 L -0.72 -0.44 ' +
    'L -0.5 -0.6 L -0.22 -0.64 L 0.05 -0.54 L 0.22 -0.36 L 0.26 -0.12 ' +
    'M 0.15 0 L 0.42 0.08 L 0.62 0.32 L 0.58 0.6 ' +
    'M -0.15 0 L -0.42 -0.08 L -0.62 -0.32 L -0.58 -0.6';

// SOMBRERO GALAXY — edge-on with prominent disk
const SHAPE_SOMBRERO_SD =
    'M 0 -0.48 L 0.16 -0.44 L 0.38 -0.32 L 0.52 -0.14 L 0.55 0 L 0.52 0.14 ' +
    'L 0.38 0.32 L 0.16 0.44 L 0 0.48 L -0.16 0.44 L -0.38 0.32 L -0.52 0.14 ' +
    'L -0.55 0 L -0.52 -0.14 L -0.38 -0.32 L -0.16 -0.44 Z ' +
    'M -1.0 0.1 L -0.72 0.18 L -0.45 0.22 L 0 0.24 L 0.45 0.22 L 0.72 0.18 ' +
    'L 1.0 0.1 L 0.72 0.02 L 0.45 -0.02 L 0 -0.04 L -0.45 -0.02 L -0.72 0.02 Z ' +
    'M -0.95 0.06 L 0.95 0.06';

// RING NEBULA — glowing concentric rings
const SHAPE_RINGNEBULA_SD =
    'M 1 0 L 0.924 0.383 L 0.707 0.707 L 0.383 0.924 L 0 1 L -0.383 0.924 ' +
    'L -0.707 0.707 L -0.924 0.383 L -1 0 L -0.924 -0.383 L -0.707 -0.707 ' +
    'L -0.383 -0.924 L 0 -1 L 0.383 -0.924 L 0.707 -0.707 L 0.924 -0.383 Z ' +
    'M 0.7 0 L 0.647 0.268 L 0.495 0.495 L 0.268 0.647 L 0 0.7 L -0.268 0.647 ' +
    'L -0.495 0.495 L -0.647 0.268 L -0.7 0 L -0.647 -0.268 L -0.495 -0.495 ' +
    'L -0.268 -0.647 L 0 -0.7 L 0.268 -0.647 L 0.495 -0.495 L 0.647 -0.268 Z ' +
    'M 0.35 0 L 0.32 0.134 L 0.247 0.247 L 0.134 0.32 L 0 0.35 ' +
    'L -0.134 0.32 L -0.247 0.247 L -0.32 0.134 L -0.35 0 ' +
    'L -0.32 -0.134 L -0.247 -0.247 L -0.134 -0.32 L 0 -0.35 ' +
    'L 0.134 -0.32 L 0.247 -0.247 L 0.32 -0.134 Z ' +
    'M 0 -0.12 L 0.05 -0.08 L 0.12 0 L 0.05 0.08 L 0 0.12 L -0.05 0.08 L -0.12 0 L -0.05 -0.08 Z';

// CRAB NEBULA — jagged filament explosion
const SHAPE_CRAB_SD =
    'M 0 -1.0 L 0.14 -0.82 L 0.32 -0.68 L 0.2 -0.48 L 0.52 -0.42 L 0.42 -0.2 ' +
    'L 0.72 -0.1 L 0.58 0.12 L 0.78 0.34 L 0.52 0.42 L 0.62 0.65 ' +
    'L 0.36 0.6 L 0.22 0.84 L 0.04 0.7 L 0 1.0 ' +
    'L -0.04 0.7 L -0.22 0.84 L -0.36 0.6 L -0.62 0.65 ' +
    'L -0.52 0.42 L -0.78 0.34 L -0.58 0.12 L -0.72 -0.1 ' +
    'L -0.42 -0.2 L -0.52 -0.42 L -0.2 -0.48 L -0.32 -0.68 L -0.14 -0.82 Z ' +
    'M 0 -0.38 L 0.16 -0.24 L 0.28 0 L 0.16 0.24 L 0 0.38 L -0.16 0.24 L -0.28 0 L -0.16 -0.24 Z';

// BLACK HOLE — accretion disk with relativistic jets
const SHAPE_BLACKHOLE_SD =
    'M 0 -0.14 L 0.06 -0.1 L 0.14 0 L 0.06 0.1 L 0 0.14 L -0.06 0.1 L -0.14 0 L -0.06 -0.1 Z ' +
    'M -0.88 0.22 L -0.55 0.34 L -0.2 0.4 L 0 0.42 L 0.2 0.4 L 0.55 0.34 L 0.88 0.22 ' +
    'L 0.88 0.06 L 0.55 0.12 L 0.2 0.16 L 0 0.18 L -0.2 0.16 L -0.55 0.12 L -0.88 0.06 Z ' +
    'M -0.88 -0.22 L -0.55 -0.34 L -0.2 -0.4 L 0 -0.42 L 0.2 -0.4 L 0.55 -0.34 L 0.88 -0.22 ' +
    'L 0.88 -0.06 L 0.55 -0.12 L 0.2 -0.16 L 0 -0.18 L -0.2 -0.16 L -0.55 -0.12 L -0.88 -0.06 Z ' +
    'M -0.05 -0.16 L 0.05 -0.16 L 0.07 -0.55 L 0.05 -1.0 L -0.05 -1.0 L -0.07 -0.55 Z ' +
    'M -0.05 0.16 L 0.05 0.16 L 0.07 0.55 L 0.05 1.0 L -0.05 1.0 L -0.07 0.55 Z';

// HELIX NEBULA (Eye of God) — nested glowing rings with spokes
const SHAPE_HELIX_SD =
    'M 1 0 L 0.951 0.309 L 0.809 0.588 L 0.588 0.809 L 0.309 0.951 L 0 1 ' +
    'L -0.309 0.951 L -0.588 0.809 L -0.809 0.588 L -0.951 0.309 L -1 0 ' +
    'L -0.951 -0.309 L -0.809 -0.588 L -0.588 -0.809 L -0.309 -0.951 L 0 -1 ' +
    'L 0.309 -0.951 L 0.588 -0.809 L 0.809 -0.588 L 0.951 -0.309 Z ' +
    'M 0.62 0 L 0.59 0.192 L 0.5 0.364 L 0.364 0.5 L 0.192 0.59 L 0 0.62 ' +
    'L -0.192 0.59 L -0.364 0.5 L -0.5 0.364 L -0.59 0.192 L -0.62 0 ' +
    'L -0.59 -0.192 L -0.5 -0.364 L -0.364 -0.5 L -0.192 -0.59 L 0 -0.62 ' +
    'L 0.192 -0.59 L 0.364 -0.5 L 0.5 -0.364 L 0.59 -0.192 Z ' +
    'M 0 1 L 0 0.62 M 0.951 0.309 L 0.59 0.192 M 0.588 0.809 L 0.364 0.5 ' +
    'M -0.588 0.809 L -0.364 0.5 M -0.951 0.309 L -0.59 0.192 ' +
    'M -1 0 L -0.62 0 M -0.951 -0.309 L -0.59 -0.192 M -0.588 -0.809 L -0.364 -0.5 ' +
    'M 0.588 -0.809 L 0.364 -0.5 M 0.951 -0.309 L 0.59 -0.192 ' +
    'M 0 -0.14 L 0.06 -0.1 L 0.14 0 L 0.06 0.1 L 0 0.14 L -0.06 0.1 L -0.14 0 L -0.06 -0.1 Z';

// STARBURST GALAXY — intense star-formation with radiating super-bright regions
const SHAPE_STARBURST_SD =
    'M 0 -0.22 L 0.1 -0.19 L 0.22 0 L 0.1 0.19 L 0 0.22 L -0.1 0.19 L -0.22 0 L -0.1 -0.19 Z ' +
    'M 0 -1 L 0.08 -0.5 L 0.38 -0.92 L 0.22 -0.44 L 0.71 -0.71 L 0.38 -0.26 ' +
    'L 0.95 -0.31 L 0.46 -0.06 L 1 0 L 0.46 0.06 L 0.95 0.31 L 0.38 0.26 ' +
    'L 0.71 0.71 L 0.22 0.44 L 0.38 0.92 L 0.08 0.5 L 0 1 ' +
    'L -0.08 0.5 L -0.38 0.92 L -0.22 0.44 L -0.71 0.71 L -0.38 0.26 ' +
    'L -0.95 0.31 L -0.46 0.06 L -1 0 L -0.46 -0.06 L -0.95 -0.31 ' +
    'L -0.38 -0.26 L -0.71 -0.71 L -0.22 -0.44 L -0.38 -0.92 L -0.08 -0.5 Z';

// COLLISION GALAXY — two merging galaxies with tidal tails
const SHAPE_COLLISION_SD =
    'M -0.35 -0.35 L -0.15 -0.42 L 0.02 -0.4 L 0.15 -0.3 L 0.2 -0.15 L 0.14 0 ' +
    'L 0.2 0.15 L 0.15 0.3 L 0.02 0.4 L -0.15 0.42 L -0.35 0.35 ' +
    'L -0.46 0.2 L -0.5 0 L -0.46 -0.2 Z ' +
    'M 0.35 -0.15 L 0.5 -0.08 L 0.6 0.05 L 0.55 0.2 L 0.42 0.3 L 0.28 0.3 ' +
    'L 0.18 0.22 L 0.18 0.08 L 0.28 -0.02 L 0.35 -0.15 Z ' +
    'M -0.5 -0.4 L -0.7 -0.65 L -0.85 -0.95 L -0.6 -0.82 L -0.35 -0.55 ' +
    'M 0.55 0.45 L 0.72 0.7 L 0.85 0.95 L 0.6 0.78 L 0.42 0.52 ' +
    'M 0 -0.38 L 0.22 -0.35 L 0.35 -0.2 L 0.3 0 L 0.14 0.1';

// ── Body stat blocks ──────────────────────────────────────────────────────────
const bodyT1_SD = { SPEED:base.SPEED*0.82, HEALTH:base.HEALTH*1.85, SHIELD:base.SHIELD*1.55,
                    REGEN:base.REGEN*1.55,  FOV:base.FOV,            RESIST:base.RESIST,
                    DENSITY:base.DENSITY*1.55 };
const bodyT2_SD = { SPEED:base.SPEED*0.64, HEALTH:base.HEALTH*2.8,  SHIELD:base.SHIELD*2.2,
                    REGEN:base.REGEN*2.2,   FOV:base.FOV*0.95,       RESIST:base.RESIST,
                    DENSITY:base.DENSITY*2.2 };
const bodyT3_SD = { SPEED:base.SPEED*0.5,  HEALTH:base.HEALTH*4.0,  SHIELD:base.SHIELD*2.8,
                    REGEN:base.REGEN*2.8,   FOV:base.FOV*0.93,       RESIST:base.RESIST,
                    DENSITY:base.DENSITY*2.8 };
const bodyT4_SD = { SPEED:base.SPEED*0.36, HEALTH:base.HEALTH*5.2,  SHIELD:base.SHIELD*3.5,
                    REGEN:base.REGEN*3.5,   FOV:base.FOV*0.9,        RESIST:base.RESIST,
                    DENSITY:base.DENSITY*3.5 };
const bodyHex_SD= { SPEED:base.SPEED*0.28, HEALTH:base.HEALTH*7.0,  SHIELD:base.SHIELD*4.5,
                    REGEN:base.REGEN*4.5,   FOV:base.FOV*0.88,       RESIST:base.RESIST*1.2,
                    DENSITY:base.DENSITY*4.5 };

// ── Angle arrays ──────────────────────────────────────────────────────────────
const a2_SD  = [0,180];
const a3_SD  = [0,120,240];
const a4_SD  = [0,90,180,270];
const a5_SD  = [0,72,144,216,288];
const a5o_SD = [36,108,180,252,324];
const a6_SD  = [0,60,120,180,240,300];
const a8_SD  = [0,45,90,135,180,225,270,315];
const a10_SD = [0,36,72,108,144,180,216,252,288,324];
const a12_SD = [0,30,60,90,120,150,180,210,240,270,300,330];

// ═══════════════════════════════════════════════════════════════════════════
// GUN BUILDER FUNCTIONS
// Each returns an array of gun objects. Elaborate multi-barrel designs.
// ═══════════════════════════════════════════════════════════════════════════

// SOLAR FLARE — three-barrel corona fan, bright orange with halo ring
function solarFlareGun_SD(angle=0, delay=0, stats=[g.basic]) {
    return [
        { POSITION:[19, 7.5, 1.1, 0, 0, angle, delay],
          PROPERTIES:{ SHOOT_SETTINGS:safeStats([...stats,{spray:2}]), TYPE:'bullet',
            COLOR:{BASE:3, BRIGHTNESS_SHIFT:8} } },
        { POSITION:[17, 5.5, 1.0, 0, 0, angle-18, delay+0.15],
          PROPERTIES:{ SHOOT_SETTINGS:safeStats([...stats,{spray:4,damage:0.75}]), TYPE:'bullet',
            COLOR:{BASE:6, BRIGHTNESS_SHIFT:12} } },
        { POSITION:[17, 5.5, 1.0, 0, 0, angle+18, delay+0.3],
          PROPERTIES:{ SHOOT_SETTINGS:safeStats([...stats,{spray:4,damage:0.75}]), TYPE:'bullet',
            COLOR:{BASE:6, BRIGHTNESS_SHIFT:12} } },
        { POSITION:[7.5, 11, -1.4, 0, 0, angle, 0],
          PROPERTIES:{ COLOR:{BASE:3, BRIGHTNESS_SHIFT:-8} } },
        { POSITION:[5, 8.5, -1.6, 1, 0, angle, 0],
          PROPERTIES:{ COLOR:{BASE:6, BRIGHTNESS_SHIFT:5} } },
    ];
}

// CORONA BLAST — wide aperture explosive, solar crown burst
function coronaBlastGun_SD(angle=0, delay=0, stats=[g.basic]) {
    return [
        { POSITION:[13, 14, 1.25, 0, 0, angle, delay],
          PROPERTIES:{ SHOOT_SETTINGS:safeStats([...stats,g.pound,{spray:5,reload:1.4}]), TYPE:'bullet',
            COLOR:{BASE:3, BRIGHTNESS_SHIFT:-6, SATURATION_SHIFT:0.6} } },
        { POSITION:[11, 11, -1.1, 0, 0, angle, delay],
          PROPERTIES:{ SHOOT_SETTINGS:safeStats([...stats,g.pound,g.fake]), TYPE:'bullet',
            COLOR:{BASE:6, BRIGHTNESS_SHIFT:8}, BORDERLESS:true } },
        { POSITION:[5.5, 16, 1.4, 0, 0, angle, 0],
          PROPERTIES:{ COLOR:{BASE:6, BRIGHTNESS_SHIFT:-4} } },
        { POSITION:[3.5, 12, -1.6, 1.5, 0, angle, 0],
          PROPERTIES:{ COLOR:{BASE:3, BRIGHTNESS_SHIFT:10} } },
        { POSITION:[3, 10, -1.65, 1, 0, angle+15, 0],
          PROPERTIES:{ COLOR:{BASE:3, BRIGHTNESS_SHIFT:6} } },
        { POSITION:[3, 10, -1.65, 1, 0, angle-15, 0],
          PROPERTIES:{ COLOR:{BASE:3, BRIGHTNESS_SHIFT:6} } },
    ];
}

// GRAVITY WELL — massive destroyer barrel, gravitational distortion aesthetics
function gravityWellGun_SD(angle=0, delay=0, stats=[g.basic]) {
    return [
        { POSITION:[17, 15, 1, 0, 0, angle, delay],
          PROPERTIES:{ SHOOT_SETTINGS:safeStats([...stats,g.pound,g.pounder,{reload:1.8}]), TYPE:'bullet',
            COLOR:{BASE:-1, BRIGHTNESS_SHIFT:-22, SATURATION_SHIFT:0.4} } },
        { POSITION:[14, 12, -1.15, 0, 0, angle, delay],
          PROPERTIES:{ SHOOT_SETTINGS:safeStats([...stats,g.pound,g.fake]), TYPE:'bullet',
            COLOR:{BASE:-1, BRIGHTNESS_SHIFT:-8}, BORDERLESS:true } },
        { POSITION:[8, 16.5, 1.28, 0, 0, angle, 0],
          PROPERTIES:{ COLOR:{BASE:16, BRIGHTNESS_SHIFT:-5} } },
        { POSITION:[5.5, 11, -1.55, 2, 0, angle, 0],
          PROPERTIES:{ COLOR:{BASE:17, BRIGHTNESS_SHIFT:-12} } },
        { POSITION:[4, 8, 1.3, 0, 6, angle+22, 0],
          PROPERTIES:{ COLOR:{BASE:16, BRIGHTNESS_SHIFT:-8} } },
        { POSITION:[4, 8, 1.3, 0, -6, angle-22, 0],
          PROPERTIES:{ COLOR:{BASE:16, BRIGHTNESS_SHIFT:-8} } },
    ];
}

// ORBITAL RING — 5-barrel orbital spread, planets-in-orbit aesthetic
function orbitalRingGun_SD(angle=0, delay=0, stats=[g.basic]) {
    const spread = [-24, -12, 0, 12, 24];
    const delays = [0.4, 0.2, 0, 0.2, 0.4];
    const out = [];
    for (let i = 0; i < 5; i++) {
        out.push({
            POSITION:[14+Math.abs(spread[i])*0.1, 4.5-Math.abs(i-2)*0.4, 1, 0, 0, angle+spread[i], delay+delays[i]],
            PROPERTIES:{ SHOOT_SETTINGS:safeStats([...stats,{spray:1.5+Math.abs(i-2)}]), TYPE:'bullet',
              COLOR:{BASE:4, BRIGHTNESS_SHIFT:5-Math.abs(i-2)*3} },
        });
    }
    out.push({ POSITION:[8, 10, -1.4, 0, 0, angle, 0], PROPERTIES:{ COLOR:{BASE:4, BRIGHTNESS_SHIFT:-8} } });
    out.push({ POSITION:[5, 7.5, -1.6, 2, 0, angle, 0], PROPERTIES:{ COLOR:{BASE:17, BRIGHTNESS_SHIFT:5} } });
    return out;
}

// COMET STREAM — ultra-long sniper with icy comet trail decoration
function cometStreamGun_SD(angle=0, delay=0, stats=[g.sniper]) {
    return [
        { POSITION:[28, 5.5, 1, 0, 0, angle, delay],
          PROPERTIES:{ SHOOT_SETTINGS:safeStats([...stats,g.assass]), TYPE:'bullet',
            COLOR:{BASE:17, BRIGHTNESS_SHIFT:-5} } },
        { POSITION:[24, 3.5, -0.5, 0, 0, angle, delay],
          PROPERTIES:{ SHOOT_SETTINGS:safeStats([...stats,g.fake]), TYPE:'bullet',
            COLOR:{BASE:-1, BRIGHTNESS_SHIFT:10, SATURATION_SHIFT:0.3}, BORDERLESS:true } },
        { POSITION:[9.5, 6, -1.7, 6, 2.5, angle, 0],
          PROPERTIES:{ COLOR:{BASE:4, BRIGHTNESS_SHIFT:14} } },
        { POSITION:[9.5, 6, -1.7, 6, -2.5, angle, 0],
          PROPERTIES:{ COLOR:{BASE:4, BRIGHTNESS_SHIFT:14} } },
        { POSITION:[4.5, 4, 0.55, 23, 0, angle, 0],
          PROPERTIES:{ COLOR:{BASE:17, BRIGHTNESS_SHIFT:18} } },
        { POSITION:[3, 3, 0.5, 19, 1.5, angle, 0],
          PROPERTIES:{ COLOR:{BASE:17, BRIGHTNESS_SHIFT:8}, BORDERLESS:true } },
        { POSITION:[3, 3, 0.5, 19, -1.5, angle, 0],
          PROPERTIES:{ COLOR:{BASE:17, BRIGHTNESS_SHIFT:8}, BORDERLESS:true } },
    ];
}

// RADIATION PULSE — rapid-fire thin barrel with ionizing particle glow
function radiationPulseGun_SD(angle=0, delay=0, stats=[g.basic]) {
    return [
        { POSITION:[16, 3.5, 1, 0, 0, angle, delay],
          PROPERTIES:{ SHOOT_SETTINGS:safeStats([...stats,g.gunner,g.mach]), TYPE:'bullet',
            COLOR:{BASE:12, BRIGHTNESS_SHIFT:8} } },
        { POSITION:[14, 2.8, -0.75, 0, 0, angle, delay],
          PROPERTIES:{ SHOOT_SETTINGS:safeStats([...stats,g.gunner,g.fake]), TYPE:'bullet',
            COLOR:{BASE:12, BRIGHTNESS_SHIFT:-4}, BORDERLESS:true } },
        { POSITION:[12, 3, 1, 0, 3.5, angle, delay+0.25],
          PROPERTIES:{ SHOOT_SETTINGS:safeStats([...stats,g.gunner,g.mach,{damage:0.6}]), TYPE:'bullet',
            COLOR:{BASE:12, BRIGHTNESS_SHIFT:4} } },
        { POSITION:[12, 3, 1, 0, -3.5, angle, delay+0.5],
          PROPERTIES:{ SHOOT_SETTINGS:safeStats([...stats,g.gunner,g.mach,{damage:0.6}]), TYPE:'bullet',
            COLOR:{BASE:12, BRIGHTNESS_SHIFT:4} } },
        { POSITION:[8, 6, -1.35, 0, 0, angle, 0],
          PROPERTIES:{ COLOR:{BASE:12, BRIGHTNESS_SHIFT:-10} } },
    ];
}

// NEBULA CLOUD — sweeping wide-aperture burst, dark nebula purple
function nebulaCloudGun_SD(angle=0, delay=0, stats=[g.basic]) {
    return [
        { POSITION:[12, 13.5, 1.3, 0, 0, angle, delay],
          PROPERTIES:{ SHOOT_SETTINGS:safeStats([...stats,g.pound,{spray:7,reload:1.5}]), TYPE:'bullet',
            COLOR:{BASE:8, BRIGHTNESS_SHIFT:-8, SATURATION_SHIFT:0.5} } },
        { POSITION:[10, 10.5, -1.1, 0, 0, angle, delay],
          PROPERTIES:{ SHOOT_SETTINGS:safeStats([...stats,g.pound,g.fake]), TYPE:'bullet',
            COLOR:{BASE:8, BRIGHTNESS_SHIFT:6}, BORDERLESS:true } },
        { POSITION:[5.5, 15.5, 1.4, 0, 0, angle, 0],
          PROPERTIES:{ COLOR:{BASE:8, BRIGHTNESS_SHIFT:-6} } },
        { POSITION:[3.5, 11, -1.6, 1.5, 0, angle, 0],
          PROPERTIES:{ COLOR:{BASE:8, BRIGHTNESS_SHIFT:8} } },
        { POSITION:[3, 9, 1.35, 0, 8, angle+14, 0],
          PROPERTIES:{ COLOR:{BASE:8, BRIGHTNESS_SHIFT:-12} } },
        { POSITION:[3, 9, 1.35, 0, -8, angle-14, 0],
          PROPERTIES:{ COLOR:{BASE:8, BRIGHTNESS_SHIFT:-12} } },
    ];
}

// PLASMA TRAP — crystal-faceted trap layer with prism decorations
function plasmaTrapGun_SD(angle=0, delay=0, stats=[g.trap]) {
    return [
        { POSITION:[15, 7, 1, 0, 0, angle, 0],
          PROPERTIES:{ COLOR:{BASE:17, BRIGHTNESS_SHIFT:8} } },
        { POSITION:[10, 5, 0.65, 0, 0, angle, 0],
          PROPERTIES:{ COLOR:{BASE:-1, BRIGHTNESS_SHIFT:-6} } },
        { POSITION:[4.5, 9, 1.65, 15, 0, angle, delay],
          PROPERTIES:{ SHOOT_SETTINGS:safeStats([...stats,g.hexatrap]), TYPE:'trap',
            STAT_CALCULATOR:gunCalcNames.trap, COLOR:{BASE:-1, BRIGHTNESS_SHIFT:-14} } },
        { POSITION:[3.5, 7, -1.7, 12, 3.5, angle, 0],
          PROPERTIES:{ COLOR:{BASE:4, BRIGHTNESS_SHIFT:12} } },
        { POSITION:[3.5, 7, -1.7, 12, -3.5, angle, 0],
          PROPERTIES:{ COLOR:{BASE:4, BRIGHTNESS_SHIFT:12} } },
        { POSITION:[2.5, 5, -1.7, 9, 2, angle+8, 0],
          PROPERTIES:{ COLOR:{BASE:17, BRIGHTNESS_SHIFT:6} } },
        { POSITION:[2.5, 5, -1.7, 9, -2, angle-8, 0],
          PROPERTIES:{ COLOR:{BASE:17, BRIGHTNESS_SHIFT:6} } },
    ];
}

// MAGNETAR PULSE — extreme magnetic pole burst, electric arc aesthetics
function magnetarPulseGun_SD(angle=0, delay=0, stats=[g.basic]) {
    return [
        { POSITION:[20, 9, 1, 0, 0, angle, delay],
          PROPERTIES:{ SHOOT_SETTINGS:safeStats([...stats,g.sniper,g.assass,g.power]), TYPE:'bullet',
            COLOR:{BASE:14, BRIGHTNESS_SHIFT:-5} } },
        { POSITION:[17, 6.5, -0.55, 0, 0, angle, delay],
          PROPERTIES:{ SHOOT_SETTINGS:safeStats([...stats,g.sniper,g.fake]), TYPE:'bullet',
            COLOR:{BASE:-1, BRIGHTNESS_SHIFT:6, SATURATION_SHIFT:0.4}, BORDERLESS:true } },
        { POSITION:[11, 6.5, -1.7, 7, 3, angle, 0],
          PROPERTIES:{ COLOR:{BASE:14, BRIGHTNESS_SHIFT:14} } },
        { POSITION:[11, 6.5, -1.7, 7, -3, angle, 0],
          PROPERTIES:{ COLOR:{BASE:14, BRIGHTNESS_SHIFT:14} } },
        { POSITION:[5, 4, 0.5, 17, 0, angle, 0],
          PROPERTIES:{ COLOR:{BASE:17, BRIGHTNESS_SHIFT:18} } },
        { POSITION:[3, 3, 0.4, 14, 2, angle, 0],
          PROPERTIES:{ COLOR:{BASE:14, BRIGHTNESS_SHIFT:6}, BORDERLESS:true } },
        { POSITION:[3, 3, 0.4, 14, -2, angle, 0],
          PROPERTIES:{ COLOR:{BASE:14, BRIGHTNESS_SHIFT:6}, BORDERLESS:true } },
    ];
}

// SOLAR WIND — dual-sided rapid-spray barrels, particle wind effect
function solarWindGun_SD(angle=0, delay=0, stats=[g.basic]) {
    return [
        { POSITION:[15, 5, 1, 0, 5.5, angle, delay],
          PROPERTIES:{ SHOOT_SETTINGS:safeStats([...stats,g.twin,g.mach,{spray:3}]), TYPE:'bullet',
            COLOR:{BASE:3, BRIGHTNESS_SHIFT:6} } },
        { POSITION:[15, 5, 1, 0, -5.5, angle, delay+0.5],
          PROPERTIES:{ SHOOT_SETTINGS:safeStats([...stats,g.twin,g.mach,{spray:3}]), TYPE:'bullet',
            COLOR:{BASE:3, BRIGHTNESS_SHIFT:6} } },
        { POSITION:[13, 4, 1, 0, 10, angle, delay+0.25],
          PROPERTIES:{ SHOOT_SETTINGS:safeStats([...stats,g.twin,g.mach,{spray:5,damage:0.7}]), TYPE:'bullet',
            COLOR:{BASE:6, BRIGHTNESS_SHIFT:10} } },
        { POSITION:[13, 4, 1, 0, -10, angle, delay+0.75],
          PROPERTIES:{ SHOOT_SETTINGS:safeStats([...stats,g.twin,g.mach,{spray:5,damage:0.7}]), TYPE:'bullet',
            COLOR:{BASE:6, BRIGHTNESS_SHIFT:10} } },
        { POSITION:[9, 9, -1.35, 0, 0, angle, 0],
          PROPERTIES:{ COLOR:{BASE:6, BRIGHTNESS_SHIFT:-5} } },
    ];
}

// ASTEROID CANNON — heavy irregular chunk shot, asteroid belt feel
function asteroidCannonGun_SD(angle=0, delay=0, stats=[g.basic]) {
    return [
        { POSITION:[15, 11, 1.15, 0, 0, angle, delay],
          PROPERTIES:{ SHOOT_SETTINGS:safeStats([...stats,g.pound,g.power,{reload:1.5}]), TYPE:'bullet',
            COLOR:{BASE:13, BRIGHTNESS_SHIFT:-10, SATURATION_SHIFT:0.6} } },
        { POSITION:[13, 8.5, -1.05, 0, 0, angle, delay],
          PROPERTIES:{ SHOOT_SETTINGS:safeStats([...stats,g.pound,g.fake]), TYPE:'bullet',
            COLOR:{BASE:13, BRIGHTNESS_SHIFT:5}, BORDERLESS:true } },
        { POSITION:[7, 13, 1.2, 0, 0, angle, 0],
          PROPERTIES:{ COLOR:{BASE:13, BRIGHTNESS_SHIFT:14} } },
        { POSITION:[5.5, 9, -1.5, 2, 3, angle+14, 0],
          PROPERTIES:{ COLOR:{BASE:13, BRIGHTNESS_SHIFT:5} } },
        { POSITION:[5.5, 9, -1.5, 2, -3, angle-14, 0],
          PROPERTIES:{ COLOR:{BASE:13, BRIGHTNESS_SHIFT:5} } },
    ];
}

// ═══════════════════════════════════════════════════════════════════════════
// MODULE EXPORTS
// ═══════════════════════════════════════════════════════════════════════════

module.exports = ({ Class }) => {
    console.log('[solarDreads] Loading Solar System Dreadnoughts...');

    // ── Decorative turret classes ────────────────────────────────────────────
    Class.sunDecoSD = {
        PARENT:['genericTank'], SHAPE:SHAPE_SUN_SD, COLOR:3, MIRROR_MASTER_ANGLE:true,
        CONTROLLERS:[['spin',{speed:0.045}]], INDEPENDENT:true, LABEL:'', GUNS:[],
    };
    Class.innerDecoSD = {
        PARENT:['genericTank'], SHAPE:SHAPE_INNER_SD, COLOR:-1, MIRROR_MASTER_ANGLE:true,
        CONTROLLERS:[['spin',{speed:-0.03}]], INDEPENDENT:true, LABEL:'', GUNS:[],
    };
    Class.outerDecoSD = {
        PARENT:['genericTank'], SHAPE:SHAPE_OUTER_SD, COLOR:13, MIRROR_MASTER_ANGLE:true,
        CONTROLLERS:[['spin',{speed:0.025}]], INDEPENDENT:true, LABEL:'', GUNS:[],
    };
    Class.beltDecoSD = {
        PARENT:['genericTank'], SHAPE:SHAPE_BELT_SD, COLOR:14, MIRROR_MASTER_ANGLE:true,
        CONTROLLERS:[['spin',{speed:-0.035}]], INDEPENDENT:true, LABEL:'', GUNS:[],
    };
    Class.saturnDecoSD = {
        PARENT:['genericTank'], SHAPE:SHAPE_SATURN_SD, COLOR:-1, MIRROR_MASTER_ANGLE:true,
        CONTROLLERS:[['spin',{speed:0.02}]], INDEPENDENT:true, LABEL:'', GUNS:[],
    };
    Class.galaxyDecoSD = {
        PARENT:['genericTank'], SHAPE:SHAPE_MILKYWAY_SD, COLOR:8, MIRROR_MASTER_ANGLE:true,
        CONTROLLERS:[['spin',{speed:0.015}]], INDEPENDENT:true, LABEL:'', GUNS:[],
    };
    Class.ringDecoSD = {
        PARENT:['genericTank'], SHAPE:SHAPE_RINGNEBULA_SD, COLOR:4, MIRROR_MASTER_ANGLE:true,
        CONTROLLERS:[['spin',{speed:-0.04}]], INDEPENDENT:true, LABEL:'', GUNS:[],
    };
    Class.starbDecoSD = {
        PARENT:['genericTank'], SHAPE:SHAPE_STARBURST_SD, COLOR:3, MIRROR_MASTER_ANGLE:true,
        CONTROLLERS:[['spin',{speed:0.05}]], INDEPENDENT:true, LABEL:'', GUNS:[],
    };

    // ── Generic tier body classes ────────────────────────────────────────────
    Class.genericSunSD = {
        PARENT:['genericTank'], BODY:bodyT1_SD, SHAPE:SHAPE_SUN_SD, COLOR:3,
        SIZE:14, DANGER:8, SKILL_CAP:Array(10).fill(smshskl),
        REROOT_UPGRADE_TREE:['weaponRootSD','bodyRootSD'],
    };
    Class.genericInnerSD = {
        PARENT:['genericTank'], BODY:bodyT2_SD, SHAPE:SHAPE_INNER_SD, COLOR:13,
        SIZE:18, DANGER:9, SKILL_CAP:Array(10).fill(smshskl),
        REROOT_UPGRADE_TREE:['weaponRootSD','bodyRootSD'],
    };
    Class.genericOuterSD = {
        PARENT:['genericTank'], BODY:bodyT3_SD, SHAPE:SHAPE_OUTER_SD, COLOR:2,
        SIZE:22, DANGER:10, SKILL_CAP:Array(10).fill(smshskl),
        REROOT_UPGRADE_TREE:['weaponRootSD','bodyRootSD'],
    };
    Class.genericBeltSD = {
        PARENT:['genericTank'], BODY:bodyT4_SD, SHAPE:SHAPE_BELT_SD, COLOR:14,
        SIZE:25, DANGER:11, SKILL_CAP:Array(10).fill(smshskl),
        REROOT_UPGRADE_TREE:['weaponRootSD','bodyRootSD'],
    };

    // ── Entry point ──────────────────────────────────────────────────────────
    Class.dreadSD = {
        PARENT:['genericSunSD'],
        LABEL:'Solar Dreadnought', UPGRADE_LABEL:'Solar Dreads',
        LEVEL:90, EXTRA_SKILL:18, GUNS:[],
        TURRETS:[{ POSITION:[16,0,0,0,360,1], TYPE:'sunDecoSD' }],
    };
    Class.weaponRootSD = { LABEL:'', COLOR:3, REROOT_UPGRADE_TREE:'weaponRootSD' };
    Class.bodyRootSD   = { LABEL:'', COLOR:3, REROOT_UPGRADE_TREE:'bodyRootSD' };

    // ── SOLAR FAMILY ─────────────────────────────────────────────────────────
    Class.solarSD = {
        PARENT:['genericSunSD'], LABEL:'Solar',
        GUNS:[...a2_SD.flatMap(a=>solarFlareGun_SD(a,0,[g.basic]))],
        TURRETS:[{POSITION:[14,0,0,0,0,1],TYPE:'sunDecoSD'}],
    };

    Class.flameSD = {
        PARENT:['genericInnerSD'], LABEL:'Solar Flame',
        GUNS:[...a4_SD.flatMap(a=>solarFlareGun_SD(a,0,[g.basic,g.flank]))],
        TURRETS:[{POSITION:[16,0,0,0,0,1],TYPE:'innerDecoSD'}],
    };
    Class.eruptSD = {
        PARENT:['genericInnerSD'], LABEL:'Solar Erupt',
        GUNS:[...a6_SD.flatMap(a=>solarFlareGun_SD(a,0,[g.basic,g.mach]))],
        TURRETS:[{POSITION:[16,0,0,0,0,1],TYPE:'sunDecoSD'}],
    };
    Class.protoSD = {
        PARENT:['genericInnerSD'], LABEL:'Protoflare',
        GUNS:[...a3_SD.flatMap(a=>solarFlareGun_SD(a,0,[g.basic,g.twin]))],
        TURRETS:[{POSITION:[16,0,0,0,0,1],TYPE:'innerDecoSD'}],
    };
    Class.heliSD = {
        PARENT:['genericInnerSD'], LABEL:'Heliosphere',
        GUNS:[...a4_SD.flatMap(a=>solarFlareGun_SD(a,0,[g.basic,g.power]))],
        TURRETS:[{POSITION:[16,0,0,0,0,1],TYPE:'outerDecoSD'}],
    };
    Class.photonSD = {
        PARENT:['genericInnerSD'], LABEL:'Photon Blast',
        GUNS:[...a2_SD.flatMap(a=>solarFlareGun_SD(a,0,[g.basic,g.mach,g.twin]))],
        TURRETS:[{POSITION:[16,0,0,0,0,1],TYPE:'beltDecoSD'}],
    };

    Class.infernoSD = {
        PARENT:['genericOuterSD'], LABEL:'Solar Inferno',
        GUNS:[...a6_SD.flatMap(a=>solarFlareGun_SD(a,0,[...[g.basic,g.flank],g.power]))],
        TURRETS:[{POSITION:[20,0,0,0,0,1],TYPE:'outerDecoSD'},{POSITION:[12,0,0,0,0,1],TYPE:'innerDecoSD'}],
    };
    Class.novaFlareSD = {
        PARENT:['genericOuterSD'], LABEL:'Nova Flare',
        GUNS:[...a5_SD.flatMap(a=>solarFlareGun_SD(a,0,[...[g.basic,g.mach],g.mach]))],
        TURRETS:[{POSITION:[20,0,0,0,0,1],TYPE:'innerDecoSD'},{POSITION:[12,0,0,0,0,1],TYPE:'sunDecoSD'}],
    };
    Class.prominenceSD = {
        PARENT:['genericOuterSD'], LABEL:'Prominence',
        GUNS:[...a8_SD.flatMap(a=>solarFlareGun_SD(a,0,[...[g.basic,g.twin],g.twin]))],
        TURRETS:[{POSITION:[20,0,0,0,0,1],TYPE:'outerDecoSD'},{POSITION:[12,0,0,0,0,1],TYPE:'innerDecoSD'}],
    };
    Class.coroBurstSD = {
        PARENT:['genericOuterSD'], LABEL:'Corona Burst',
        GUNS:[...a6_SD.flatMap(a=>solarFlareGun_SD(a,0,[...[g.basic,g.power],g.flank]))],
        TURRETS:[{POSITION:[20,0,0,0,0,1],TYPE:'beltDecoSD'},{POSITION:[12,0,0,0,0,1],TYPE:'outerDecoSD'}],
    };
    Class.solarMaxSD = {
        PARENT:['genericOuterSD'], LABEL:'Solar Maximum',
        GUNS:[...a4_SD.flatMap(a=>solarFlareGun_SD(a,0,[...[g.basic,g.mach,g.twin],g.assass]))],
        TURRETS:[{POSITION:[20,0,0,0,0,1],TYPE:'outerDecoSD'},{POSITION:[12,0,0,0,0,1],TYPE:'innerDecoSD'}],
    };

    Class.solarStormSD = {
        PARENT:['genericBeltSD'], LABEL:'Solar Storm',
        GUNS:[...a10_SD.flatMap(a=>solarFlareGun_SD(a,0,[...[g.basic,g.flank],g.power,g.power]))],
        TURRETS:[{POSITION:[23,0,0,0,0,1],TYPE:'beltDecoSD'},
                 {POSITION:[15,0,0,0,0,1],TYPE:'outerDecoSD'},
                 {POSITION:[8,0,0,0,0,1], TYPE:'innerDecoSD'}],
    };
    Class.grandEruptSD = {
        PARENT:['genericBeltSD'], LABEL:'Grand Eruption',
        GUNS:[...a8_SD.flatMap(a=>solarFlareGun_SD(a,0,[...[g.basic,g.mach],g.mach,g.flank]))],
        TURRETS:[{POSITION:[23,0,0,0,0,1],TYPE:'outerDecoSD'},
                 {POSITION:[15,0,0,0,0,1],TYPE:'beltDecoSD'},
                 {POSITION:[8,0,0,0,0,1], TYPE:'sunDecoSD'}],
    };
    Class.megaFlareSD = {
        PARENT:['genericBeltSD'], LABEL:'Mega Flare',
        GUNS:[...a6_SD.flatMap(a=>solarFlareGun_SD(a,0,[...[g.basic,g.twin],g.twin,g.twin]))],
        TURRETS:[{POSITION:[23,0,0,0,0,1],TYPE:'beltDecoSD'},
                 {POSITION:[15,0,0,0,0,1],TYPE:'innerDecoSD'},
                 {POSITION:[8,0,0,0,0,1], TYPE:'outerDecoSD'}],
    };
    Class.coronalSD = {
        PARENT:['genericBeltSD'], LABEL:'Coronal Mass',
        GUNS:[...a10_SD.flatMap(a=>solarFlareGun_SD(a,0,[...[g.basic,g.power],g.flank,g.mach]))],
        TURRETS:[{POSITION:[23,0,0,0,0,1],TYPE:'outerDecoSD'},
                 {POSITION:[15,0,0,0,0,1],TYPE:'innerDecoSD'},
                 {POSITION:[8,0,0,0,0,1], TYPE:'beltDecoSD'}],
    };
    Class.xClassSD = {
        PARENT:['genericBeltSD'], LABEL:'X-Class Flare',
        GUNS:[...a8_SD.flatMap(a=>solarFlareGun_SD(a,0,[...[g.basic,g.mach,g.twin],g.assass,g.mach]))],
        TURRETS:[{POSITION:[23,0,0,0,0,1],TYPE:'beltDecoSD'},
                 {POSITION:[15,0,0,0,0,1],TYPE:'outerDecoSD'},
                 {POSITION:[8,0,0,0,0,1], TYPE:'sunDecoSD'}],
    };

    // ── CORONA FAMILY ─────────────────────────────────────────────────────────
    Class.coronaSD = {
        PARENT:['genericSunSD'], LABEL:'Corona',
        GUNS:[...a2_SD.flatMap(a=>coronaBlastGun_SD(a,0,[g.basic]))],
        TURRETS:[{POSITION:[14,0,0,0,0,1],TYPE:'sunDecoSD'}],
    };

    Class.archSD = {
        PARENT:['genericInnerSD'], LABEL:'Arch',
        GUNS:[...a4_SD.flatMap(a=>coronaBlastGun_SD(a,0,[g.basic,g.pound]))],
        TURRETS:[{POSITION:[16,0,0,0,0,1],TYPE:'innerDecoSD'}],
    };
    Class.plasmoSD = {
        PARENT:['genericInnerSD'], LABEL:'Plasmoid',
        GUNS:[...a6_SD.flatMap(a=>coronaBlastGun_SD(a,0,[g.basic,g.pound,g.power]))],
        TURRETS:[{POSITION:[16,0,0,0,0,1],TYPE:'sunDecoSD'}],
    };
    Class.sunspotSD = {
        PARENT:['genericInnerSD'], LABEL:'Sunspot',
        GUNS:[...a3_SD.flatMap(a=>coronaBlastGun_SD(a,0,[g.basic,g.pound,g.mach]))],
        TURRETS:[{POSITION:[16,0,0,0,0,1],TYPE:'innerDecoSD'}],
    };
    Class.helmSD = {
        PARENT:['genericInnerSD'], LABEL:'Helmet Streamer',
        GUNS:[...a4_SD.flatMap(a=>coronaBlastGun_SD(a,0,[g.basic,g.pound,g.flank]))],
        TURRETS:[{POSITION:[16,0,0,0,0,1],TYPE:'outerDecoSD'}],
    };
    Class.dipoleSD = {
        PARENT:['genericInnerSD'], LABEL:'Dipole',
        GUNS:[...a2_SD.flatMap(a=>coronaBlastGun_SD(a,0,[g.basic,g.pounder]))],
        TURRETS:[{POSITION:[16,0,0,0,0,1],TYPE:'beltDecoSD'}],
    };

    Class.solarBlastSD = {
        PARENT:['genericOuterSD'], LABEL:'Solar Blast',
        GUNS:[...a6_SD.flatMap(a=>coronaBlastGun_SD(a,0,[...[g.basic,g.pound],g.power]))],
        TURRETS:[{POSITION:[20,0,0,0,0,1],TYPE:'outerDecoSD'},{POSITION:[12,0,0,0,0,1],TYPE:'innerDecoSD'}],
    };
    Class.explosSD = {
        PARENT:['genericOuterSD'], LABEL:'Solar Explosion',
        GUNS:[...a5_SD.flatMap(a=>coronaBlastGun_SD(a,0,[...[g.basic,g.pound,g.power],g.mach]))],
        TURRETS:[{POSITION:[20,0,0,0,0,1],TYPE:'innerDecoSD'},{POSITION:[12,0,0,0,0,1],TYPE:'sunDecoSD'}],
    };
    Class.plasmojetSD = {
        PARENT:['genericOuterSD'], LABEL:'Plasmojet',
        GUNS:[...a8_SD.flatMap(a=>coronaBlastGun_SD(a,0,[...[g.basic,g.pound,g.mach],g.twin]))],
        TURRETS:[{POSITION:[20,0,0,0,0,1],TYPE:'outerDecoSD'},{POSITION:[12,0,0,0,0,1],TYPE:'innerDecoSD'}],
    };
    Class.sunshockSD = {
        PARENT:['genericOuterSD'], LABEL:'Sun Shock',
        GUNS:[...a6_SD.flatMap(a=>coronaBlastGun_SD(a,0,[...[g.basic,g.pound,g.flank],g.flank]))],
        TURRETS:[{POSITION:[20,0,0,0,0,1],TYPE:'beltDecoSD'},{POSITION:[12,0,0,0,0,1],TYPE:'outerDecoSD'}],
    };
    Class.giantSD = {
        PARENT:['genericOuterSD'], LABEL:'Giant Flare',
        GUNS:[...a4_SD.flatMap(a=>coronaBlastGun_SD(a,0,[...[g.basic,g.pounder],g.assass]))],
        TURRETS:[{POSITION:[20,0,0,0,0,1],TYPE:'outerDecoSD'},{POSITION:[12,0,0,0,0,1],TYPE:'innerDecoSD'}],
    };

    Class.solarGodSD2 = {
        PARENT:['genericBeltSD'], LABEL:'solarGod ',
        GUNS:[...a10_SD.flatMap(a=>coronaBlastGun_SD(a,0,[...[g.basic,g.pound],g.power,g.power]))],
        TURRETS:[{POSITION:[23,0,0,0,0,1],TYPE:'beltDecoSD'},
                 {POSITION:[15,0,0,0,0,1],TYPE:'outerDecoSD'},
                 {POSITION:[8,0,0,0,0,1], TYPE:'innerDecoSD'}],
    };
    Class.whiteLightSD = {
        PARENT:['genericBeltSD'], LABEL:'White-Light Flare',
        GUNS:[...a8_SD.flatMap(a=>coronaBlastGun_SD(a,0,[...[g.basic,g.pound,g.power],g.mach,g.flank]))],
        TURRETS:[{POSITION:[23,0,0,0,0,1],TYPE:'outerDecoSD'},
                 {POSITION:[15,0,0,0,0,1],TYPE:'beltDecoSD'},
                 {POSITION:[8,0,0,0,0,1], TYPE:'sunDecoSD'}],
    };
    Class.protonSD = {
        PARENT:['genericBeltSD'], LABEL:'Proton Storm',
        GUNS:[...a6_SD.flatMap(a=>coronaBlastGun_SD(a,0,[...[g.basic,g.pound,g.mach],g.twin,g.twin]))],
        TURRETS:[{POSITION:[23,0,0,0,0,1],TYPE:'beltDecoSD'},
                 {POSITION:[15,0,0,0,0,1],TYPE:'innerDecoSD'},
                 {POSITION:[8,0,0,0,0,1], TYPE:'outerDecoSD'}],
    };
    Class.solarGodSD = {
        PARENT:['genericBeltSD'], LABEL:'Solar God',
        GUNS:[...a10_SD.flatMap(a=>coronaBlastGun_SD(a,0,[...[g.basic,g.pound,g.flank],g.flank,g.mach]))],
        TURRETS:[{POSITION:[23,0,0,0,0,1],TYPE:'outerDecoSD'},
                 {POSITION:[15,0,0,0,0,1],TYPE:'innerDecoSD'},
                 {POSITION:[8,0,0,0,0,1], TYPE:'beltDecoSD'}],
    };
    Class.helioBlastSD = {
        PARENT:['genericBeltSD'], LABEL:'Helio Blast',
        GUNS:[...a8_SD.flatMap(a=>coronaBlastGun_SD(a,0,[...[g.basic,g.pounder],g.assass,g.mach]))],
        TURRETS:[{POSITION:[23,0,0,0,0,1],TYPE:'beltDecoSD'},
                 {POSITION:[15,0,0,0,0,1],TYPE:'outerDecoSD'},
                 {POSITION:[8,0,0,0,0,1], TYPE:'sunDecoSD'}],
    };

    // ── GRAVITY FAMILY ─────────────────────────────────────────────────────────
    Class.gravitySD = {
        PARENT:['genericSunSD'], LABEL:'Gravity',
        GUNS:[...a2_SD.flatMap(a=>gravityWellGun_SD(a,0,[g.basic]))],
        TURRETS:[{POSITION:[14,0,0,0,0,1],TYPE:'sunDecoSD'}],
    };

    Class.tidSD = {
        PARENT:['genericInnerSD'], LABEL:'Tidal Force',
        GUNS:[...a4_SD.flatMap(a=>gravityWellGun_SD(a,0,[g.basic,g.pound,g.pounder]))],
        TURRETS:[{POSITION:[16,0,0,0,0,1],TYPE:'innerDecoSD'}],
    };
    Class.singuSD = {
        PARENT:['genericInnerSD'], LABEL:'Singularity',
        GUNS:[...a6_SD.flatMap(a=>gravityWellGun_SD(a,0,[g.basic,g.pound,{reload:1.6}]))],
        TURRETS:[{POSITION:[16,0,0,0,0,1],TYPE:'sunDecoSD'}],
    };
    Class.eventSD = {
        PARENT:['genericInnerSD'], LABEL:'Event Horizon',
        GUNS:[...a3_SD.flatMap(a=>gravityWellGun_SD(a,0,[g.basic,g.pounder,g.power]))],
        TURRETS:[{POSITION:[16,0,0,0,0,1],TYPE:'innerDecoSD'}],
    };
    Class.accretSD = {
        PARENT:['genericInnerSD'], LABEL:'Accretion',
        GUNS:[...a4_SD.flatMap(a=>gravityWellGun_SD(a,0,[g.basic,g.pound,g.morerecoil]))],
        TURRETS:[{POSITION:[16,0,0,0,0,1],TYPE:'outerDecoSD'}],
    };
    Class.warpSD = {
        PARENT:['genericInnerSD'], LABEL:'Warp Field',
        GUNS:[...a2_SD.flatMap(a=>gravityWellGun_SD(a,0,[g.basic,g.pounder,g.mach]))],
        TURRETS:[{POSITION:[16,0,0,0,0,1],TYPE:'beltDecoSD'}],
    };

    Class.crushSD = {
        PARENT:['genericOuterSD'], LABEL:'Crush',
        GUNS:[...a6_SD.flatMap(a=>gravityWellGun_SD(a,0,[...[g.basic,g.pound,g.pounder],g.power]))],
        TURRETS:[{POSITION:[20,0,0,0,0,1],TYPE:'outerDecoSD'},{POSITION:[12,0,0,0,0,1],TYPE:'innerDecoSD'}],
    };
    Class.collapseSD = {
        PARENT:['genericOuterSD'], LABEL:'Gravitational Collapse',
        GUNS:[...a5_SD.flatMap(a=>gravityWellGun_SD(a,0,[...[g.basic,g.pound,{reload:1.6}],g.mach]))],
        TURRETS:[{POSITION:[20,0,0,0,0,1],TYPE:'innerDecoSD'},{POSITION:[12,0,0,0,0,1],TYPE:'sunDecoSD'}],
    };
    Class.massiveSD = {
        PARENT:['genericOuterSD'], LABEL:'Massive Pull',
        GUNS:[...a8_SD.flatMap(a=>gravityWellGun_SD(a,0,[...[g.basic,g.pounder,g.power],g.twin]))],
        TURRETS:[{POSITION:[20,0,0,0,0,1],TYPE:'outerDecoSD'},{POSITION:[12,0,0,0,0,1],TYPE:'innerDecoSD'}],
    };
    Class.horizonSD = {
        PARENT:['genericOuterSD'], LABEL:'Horizon',
        GUNS:[...a6_SD.flatMap(a=>gravityWellGun_SD(a,0,[...[g.basic,g.pound,g.morerecoil],g.flank]))],
        TURRETS:[{POSITION:[20,0,0,0,0,1],TYPE:'beltDecoSD'},{POSITION:[12,0,0,0,0,1],TYPE:'outerDecoSD'}],
    };
    Class.breakSD = {
        PARENT:['genericOuterSD'], LABEL:'Gravity Break',
        GUNS:[...a4_SD.flatMap(a=>gravityWellGun_SD(a,0,[...[g.basic,g.pounder,g.mach],g.assass]))],
        TURRETS:[{POSITION:[20,0,0,0,0,1],TYPE:'outerDecoSD'},{POSITION:[12,0,0,0,0,1],TYPE:'innerDecoSD'}],
    };

    Class.blackDwarfSD = {
        PARENT:['genericBeltSD'], LABEL:'Black Dwarf',
        GUNS:[...a10_SD.flatMap(a=>gravityWellGun_SD(a,0,[...[g.basic,g.pound,g.pounder],g.power,g.power]))],
        TURRETS:[{POSITION:[23,0,0,0,0,1],TYPE:'beltDecoSD'},
                 {POSITION:[15,0,0,0,0,1],TYPE:'outerDecoSD'},
                 {POSITION:[8,0,0,0,0,1], TYPE:'innerDecoSD'}],
    };
    Class.neutronShotSD = {
        PARENT:['genericBeltSD'], LABEL:'Neutron Shot',
        GUNS:[...a8_SD.flatMap(a=>gravityWellGun_SD(a,0,[...[g.basic,g.pound,{reload:1.6}],g.mach,g.flank]))],
        TURRETS:[{POSITION:[23,0,0,0,0,1],TYPE:'outerDecoSD'},
                 {POSITION:[15,0,0,0,0,1],TYPE:'beltDecoSD'},
                 {POSITION:[8,0,0,0,0,1], TYPE:'sunDecoSD'}],
    };
    Class.darkmassSD = {
        PARENT:['genericBeltSD'], LABEL:'Dark Mass',
        GUNS:[...a6_SD.flatMap(a=>gravityWellGun_SD(a,0,[...[g.basic,g.pounder,g.power],g.twin,g.twin]))],
        TURRETS:[{POSITION:[23,0,0,0,0,1],TYPE:'beltDecoSD'},
                 {POSITION:[15,0,0,0,0,1],TYPE:'innerDecoSD'},
                 {POSITION:[8,0,0,0,0,1], TYPE:'outerDecoSD'}],
    };
    Class.gravitonSD = {
        PARENT:['genericBeltSD'], LABEL:'Graviton',
        GUNS:[...a10_SD.flatMap(a=>gravityWellGun_SD(a,0,[...[g.basic,g.pound,g.morerecoil],g.flank,g.mach]))],
        TURRETS:[{POSITION:[23,0,0,0,0,1],TYPE:'outerDecoSD'},
                 {POSITION:[15,0,0,0,0,1],TYPE:'innerDecoSD'},
                 {POSITION:[8,0,0,0,0,1], TYPE:'beltDecoSD'}],
    };
    Class.spacetimeSD = {
        PARENT:['genericBeltSD'], LABEL:'Spacetime Rift',
        GUNS:[...a8_SD.flatMap(a=>gravityWellGun_SD(a,0,[...[g.basic,g.pounder,g.mach],g.assass,g.mach]))],
        TURRETS:[{POSITION:[23,0,0,0,0,1],TYPE:'beltDecoSD'},
                 {POSITION:[15,0,0,0,0,1],TYPE:'outerDecoSD'},
                 {POSITION:[8,0,0,0,0,1], TYPE:'sunDecoSD'}],
    };

    // ── ORBITAL FAMILY ─────────────────────────────────────────────────────────
    Class.orbitalSD = {
        PARENT:['genericSunSD'], LABEL:'Orbital',
        GUNS:[...a2_SD.flatMap(a=>orbitalRingGun_SD(a,0,[g.basic]))],
        TURRETS:[{POSITION:[14,0,0,0,0,1],TYPE:'sunDecoSD'}],
    };

    Class.orb1SD = {
        PARENT:['genericInnerSD'], LABEL:'Ellipse',
        GUNS:[...a4_SD.flatMap(a=>orbitalRingGun_SD(a,0,[g.basic,g.flank,{spray:2}]))],
        TURRETS:[{POSITION:[16,0,0,0,0,1],TYPE:'innerDecoSD'}],
    };
    Class.orb2SD = {
        PARENT:['genericInnerSD'], LABEL:'Perihelion',
        GUNS:[...a6_SD.flatMap(a=>orbitalRingGun_SD(a,0,[g.basic,g.twin,g.mach]))],
        TURRETS:[{POSITION:[16,0,0,0,0,1],TYPE:'sunDecoSD'}],
    };
    Class.orb3SD = {
        PARENT:['genericInnerSD'], LABEL:'Aphelion',
        GUNS:[...a3_SD.flatMap(a=>orbitalRingGun_SD(a,0,[g.basic,g.power]))],
        TURRETS:[{POSITION:[16,0,0,0,0,1],TYPE:'innerDecoSD'}],
    };
    Class.orb4SD = {
        PARENT:['genericInnerSD'], LABEL:'Resonance',
        GUNS:[...a4_SD.flatMap(a=>orbitalRingGun_SD(a,0,[g.basic,g.flank,g.twin]))],
        TURRETS:[{POSITION:[16,0,0,0,0,1],TYPE:'outerDecoSD'}],
    };
    Class.orb5SD = {
        PARENT:['genericInnerSD'], LABEL:'Precession',
        GUNS:[...a2_SD.flatMap(a=>orbitalRingGun_SD(a,0,[g.basic,g.mach,g.flank]))],
        TURRETS:[{POSITION:[16,0,0,0,0,1],TYPE:'beltDecoSD'}],
    };

    Class.retroSD = {
        PARENT:['genericOuterSD'], LABEL:'Retrograde',
        GUNS:[...a6_SD.flatMap(a=>orbitalRingGun_SD(a,0,[...[g.basic,g.flank,{spray:2}],g.power]))],
        TURRETS:[{POSITION:[20,0,0,0,0,1],TYPE:'outerDecoSD'},{POSITION:[12,0,0,0,0,1],TYPE:'innerDecoSD'}],
    };
    Class.progrSD = {
        PARENT:['genericOuterSD'], LABEL:'Prograde',
        GUNS:[...a5_SD.flatMap(a=>orbitalRingGun_SD(a,0,[...[g.basic,g.twin,g.mach],g.mach]))],
        TURRETS:[{POSITION:[20,0,0,0,0,1],TYPE:'innerDecoSD'},{POSITION:[12,0,0,0,0,1],TYPE:'sunDecoSD'}],
    };
    Class.inclinSD = {
        PARENT:['genericOuterSD'], LABEL:'Inclination',
        GUNS:[...a8_SD.flatMap(a=>orbitalRingGun_SD(a,0,[...[g.basic,g.power],g.twin]))],
        TURRETS:[{POSITION:[20,0,0,0,0,1],TYPE:'outerDecoSD'},{POSITION:[12,0,0,0,0,1],TYPE:'innerDecoSD'}],
    };
    Class.nodSD = {
        PARENT:['genericOuterSD'], LABEL:'Ascending Node',
        GUNS:[...a6_SD.flatMap(a=>orbitalRingGun_SD(a,0,[...[g.basic,g.flank,g.twin],g.flank]))],
        TURRETS:[{POSITION:[20,0,0,0,0,1],TYPE:'beltDecoSD'},{POSITION:[12,0,0,0,0,1],TYPE:'outerDecoSD'}],
    };
    Class.eccentSD = {
        PARENT:['genericOuterSD'], LABEL:'Eccentric Orbit',
        GUNS:[...a4_SD.flatMap(a=>orbitalRingGun_SD(a,0,[...[g.basic,g.mach,g.flank],g.assass]))],
        TURRETS:[{POSITION:[20,0,0,0,0,1],TYPE:'outerDecoSD'},{POSITION:[12,0,0,0,0,1],TYPE:'innerDecoSD'}],
    };

    Class.geosyncSD = {
        PARENT:['genericBeltSD'], LABEL:'Geosynchronous',
        GUNS:[...a10_SD.flatMap(a=>orbitalRingGun_SD(a,0,[...[g.basic,g.flank,{spray:2}],g.power,g.power]))],
        TURRETS:[{POSITION:[23,0,0,0,0,1],TYPE:'beltDecoSD'},
                 {POSITION:[15,0,0,0,0,1],TYPE:'outerDecoSD'},
                 {POSITION:[8,0,0,0,0,1], TYPE:'innerDecoSD'}],
    };
    Class.haloOrbitSD = {
        PARENT:['genericBeltSD'], LABEL:'Halo Orbit',
        GUNS:[...a8_SD.flatMap(a=>orbitalRingGun_SD(a,0,[...[g.basic,g.twin,g.mach],g.mach,g.flank]))],
        TURRETS:[{POSITION:[23,0,0,0,0,1],TYPE:'outerDecoSD'},
                 {POSITION:[15,0,0,0,0,1],TYPE:'beltDecoSD'},
                 {POSITION:[8,0,0,0,0,1], TYPE:'sunDecoSD'}],
    };
    Class.lagrangeSD = {
        PARENT:['genericBeltSD'], LABEL:'Lagrange',
        GUNS:[...a6_SD.flatMap(a=>orbitalRingGun_SD(a,0,[...[g.basic,g.power],g.twin,g.twin]))],
        TURRETS:[{POSITION:[23,0,0,0,0,1],TYPE:'beltDecoSD'},
                 {POSITION:[15,0,0,0,0,1],TYPE:'innerDecoSD'},
                 {POSITION:[8,0,0,0,0,1], TYPE:'outerDecoSD'}],
    };
    Class.transferSD = {
        PARENT:['genericBeltSD'], LABEL:'Hohmann Transfer',
        GUNS:[...a10_SD.flatMap(a=>orbitalRingGun_SD(a,0,[...[g.basic,g.flank,g.twin],g.flank,g.mach]))],
        TURRETS:[{POSITION:[23,0,0,0,0,1],TYPE:'outerDecoSD'},
                 {POSITION:[15,0,0,0,0,1],TYPE:'innerDecoSD'},
                 {POSITION:[8,0,0,0,0,1], TYPE:'beltDecoSD'}],
    };
    Class.slingSD = {
        PARENT:['genericBeltSD'], LABEL:'Slingshot',
        GUNS:[...a8_SD.flatMap(a=>orbitalRingGun_SD(a,0,[...[g.basic,g.mach,g.flank],g.assass,g.mach]))],
        TURRETS:[{POSITION:[23,0,0,0,0,1],TYPE:'beltDecoSD'},
                 {POSITION:[15,0,0,0,0,1],TYPE:'outerDecoSD'},
                 {POSITION:[8,0,0,0,0,1], TYPE:'sunDecoSD'}],
    };

    // ── COMET FAMILY ─────────────────────────────────────────────────────────
    Class.cometSD = {
        PARENT:['genericSunSD'], LABEL:'Comet',
        GUNS:[...a2_SD.flatMap(a=>cometStreamGun_SD(a,0,[g.basic]))],
        TURRETS:[{POSITION:[14,0,0,0,0,1],TYPE:'sunDecoSD'}],
    };

    Class.halleySD = {
        PARENT:['genericInnerSD'], LABEL:'Halley',
        GUNS:[...a4_SD.flatMap(a=>cometStreamGun_SD(a,0,[g.sniper,g.assass]))],
        TURRETS:[{POSITION:[16,0,0,0,0,1],TYPE:'innerDecoSD'}],
    };
    Class.haleSD = {
        PARENT:['genericInnerSD'], LABEL:'Hale-Bopp',
        GUNS:[...a6_SD.flatMap(a=>cometStreamGun_SD(a,0,[g.sniper,g.mach]))],
        TURRETS:[{POSITION:[16,0,0,0,0,1],TYPE:'sunDecoSD'}],
    };
    Class.shoeSD = {
        PARENT:['genericInnerSD'], LABEL:'Shoemaker',
        GUNS:[...a3_SD.flatMap(a=>cometStreamGun_SD(a,0,[g.sniper,g.power]))],
        TURRETS:[{POSITION:[16,0,0,0,0,1],TYPE:'innerDecoSD'}],
    };
    Class.oortSD = {
        PARENT:['genericInnerSD'], LABEL:'Oort Cloud',
        GUNS:[...a4_SD.flatMap(a=>cometStreamGun_SD(a,0,[g.sniper,{reload:0.6}]))],
        TURRETS:[{POSITION:[16,0,0,0,0,1],TYPE:'outerDecoSD'}],
    };
    Class.kuiperSD = {
        PARENT:['genericInnerSD'], LABEL:'Kuiper',
        GUNS:[...a2_SD.flatMap(a=>cometStreamGun_SD(a,0,[g.sniper,g.assass,g.mach]))],
        TURRETS:[{POSITION:[16,0,0,0,0,1],TYPE:'beltDecoSD'}],
    };

    Class.cometTrailSD = {
        PARENT:['genericOuterSD'], LABEL:'Comet Trail',
        GUNS:[...a6_SD.flatMap(a=>cometStreamGun_SD(a,0,[...[g.sniper,g.assass],g.power]))],
        TURRETS:[{POSITION:[20,0,0,0,0,1],TYPE:'outerDecoSD'},{POSITION:[12,0,0,0,0,1],TYPE:'innerDecoSD'}],
    };
    Class.cometBurstSD = {
        PARENT:['genericOuterSD'], LABEL:'Comet Burst',
        GUNS:[...a5_SD.flatMap(a=>cometStreamGun_SD(a,0,[...[g.sniper,g.mach],g.mach]))],
        TURRETS:[{POSITION:[20,0,0,0,0,1],TYPE:'innerDecoSD'},{POSITION:[12,0,0,0,0,1],TYPE:'sunDecoSD'}],
    };
    Class.cometionSD = {
        PARENT:['genericOuterSD'], LABEL:'Cometion',
        GUNS:[...a8_SD.flatMap(a=>cometStreamGun_SD(a,0,[...[g.sniper,g.power],g.twin]))],
        TURRETS:[{POSITION:[20,0,0,0,0,1],TYPE:'outerDecoSD'},{POSITION:[12,0,0,0,0,1],TYPE:'innerDecoSD'}],
    };
    Class.nucleusSD = {
        PARENT:['genericOuterSD'], LABEL:'Nucleus',
        GUNS:[...a6_SD.flatMap(a=>cometStreamGun_SD(a,0,[...[g.sniper,{reload:0.6}],g.flank]))],
        TURRETS:[{POSITION:[20,0,0,0,0,1],TYPE:'beltDecoSD'},{POSITION:[12,0,0,0,0,1],TYPE:'outerDecoSD'}],
    };
    Class.comaSD = {
        PARENT:['genericOuterSD'], LABEL:'Coma',
        GUNS:[...a4_SD.flatMap(a=>cometStreamGun_SD(a,0,[...[g.sniper,g.assass,g.mach],g.assass]))],
        TURRETS:[{POSITION:[20,0,0,0,0,1],TYPE:'outerDecoSD'},{POSITION:[12,0,0,0,0,1],TYPE:'innerDecoSD'}],
    };

    Class.superCometSD = {
        PARENT:['genericBeltSD'], LABEL:'Super Comet',
        GUNS:[...a10_SD.flatMap(a=>cometStreamGun_SD(a,0,[...[g.sniper,g.assass],g.power,g.power]))],
        TURRETS:[{POSITION:[23,0,0,0,0,1],TYPE:'beltDecoSD'},
                 {POSITION:[15,0,0,0,0,1],TYPE:'outerDecoSD'},
                 {POSITION:[8,0,0,0,0,1], TYPE:'innerDecoSD'}],
    };
    Class.hypercometSD = {
        PARENT:['genericBeltSD'], LABEL:'Hypercomet',
        GUNS:[...a8_SD.flatMap(a=>cometStreamGun_SD(a,0,[...[g.sniper,g.mach],g.mach,g.flank]))],
        TURRETS:[{POSITION:[23,0,0,0,0,1],TYPE:'outerDecoSD'},
                 {POSITION:[15,0,0,0,0,1],TYPE:'beltDecoSD'},
                 {POSITION:[8,0,0,0,0,1], TYPE:'sunDecoSD'}],
    };
    Class.sungrazerSD = {
        PARENT:['genericBeltSD'], LABEL:'Sungrazer',
        GUNS:[...a6_SD.flatMap(a=>cometStreamGun_SD(a,0,[...[g.sniper,g.power],g.twin,g.twin]))],
        TURRETS:[{POSITION:[23,0,0,0,0,1],TYPE:'beltDecoSD'},
                 {POSITION:[15,0,0,0,0,1],TYPE:'innerDecoSD'},
                 {POSITION:[8,0,0,0,0,1], TYPE:'outerDecoSD'}],
    };
    Class.interstellarSD = {
        PARENT:['genericBeltSD'], LABEL:'Interstellar',
        GUNS:[...a10_SD.flatMap(a=>cometStreamGun_SD(a,0,[...[g.sniper,{reload:0.6}],g.flank,g.mach]))],
        TURRETS:[{POSITION:[23,0,0,0,0,1],TYPE:'outerDecoSD'},
                 {POSITION:[15,0,0,0,0,1],TYPE:'innerDecoSD'},
                 {POSITION:[8,0,0,0,0,1], TYPE:'beltDecoSD'}],
    };
    Class.longPeriodSD = {
        PARENT:['genericBeltSD'], LABEL:'Long-Period',
        GUNS:[...a8_SD.flatMap(a=>cometStreamGun_SD(a,0,[...[g.sniper,g.assass,g.mach],g.assass,g.mach]))],
        TURRETS:[{POSITION:[23,0,0,0,0,1],TYPE:'beltDecoSD'},
                 {POSITION:[15,0,0,0,0,1],TYPE:'outerDecoSD'},
                 {POSITION:[8,0,0,0,0,1], TYPE:'sunDecoSD'}],
    };

    // ── RADIATION FAMILY ─────────────────────────────────────────────────────────
    Class.radiationSD = {
        PARENT:['genericSunSD'], LABEL:'Radiation',
        GUNS:[...a2_SD.flatMap(a=>radiationPulseGun_SD(a,0,[g.basic]))],
        TURRETS:[{POSITION:[14,0,0,0,0,1],TYPE:'sunDecoSD'}],
    };

    Class.gammaSD = {
        PARENT:['genericInnerSD'], LABEL:'Gamma Ray',
        GUNS:[...a4_SD.flatMap(a=>radiationPulseGun_SD(a,0,[g.basic,g.gunner,g.mach]))],
        TURRETS:[{POSITION:[16,0,0,0,0,1],TYPE:'innerDecoSD'}],
    };
    Class.xraySD = {
        PARENT:['genericInnerSD'], LABEL:'X-Ray',
        GUNS:[...a6_SD.flatMap(a=>radiationPulseGun_SD(a,0,[g.basic,g.gunner,g.twin]))],
        TURRETS:[{POSITION:[16,0,0,0,0,1],TYPE:'sunDecoSD'}],
    };
    Class.uvSD = {
        PARENT:['genericInnerSD'], LABEL:'Ultraviolet',
        GUNS:[...a3_SD.flatMap(a=>radiationPulseGun_SD(a,0,[g.basic,g.mach,g.twin]))],
        TURRETS:[{POSITION:[16,0,0,0,0,1],TYPE:'innerDecoSD'}],
    };
    Class.infraSD = {
        PARENT:['genericInnerSD'], LABEL:'Infrared',
        GUNS:[...a4_SD.flatMap(a=>radiationPulseGun_SD(a,0,[g.basic,g.mach,{reload:0.6}]))],
        TURRETS:[{POSITION:[16,0,0,0,0,1],TYPE:'outerDecoSD'}],
    };
    Class.particSD = {
        PARENT:['genericInnerSD'], LABEL:'Particle Beam',
        GUNS:[...a2_SD.flatMap(a=>radiationPulseGun_SD(a,0,[g.basic,g.gunner,g.power]))],
        TURRETS:[{POSITION:[16,0,0,0,0,1],TYPE:'beltDecoSD'}],
    };

    Class.ionizeSD = {
        PARENT:['genericOuterSD'], LABEL:'Ionize',
        GUNS:[...a6_SD.flatMap(a=>radiationPulseGun_SD(a,0,[...[g.basic,g.gunner,g.mach],g.power]))],
        TURRETS:[{POSITION:[20,0,0,0,0,1],TYPE:'outerDecoSD'},{POSITION:[12,0,0,0,0,1],TYPE:'innerDecoSD'}],
    };
    Class.irradSD = {
        PARENT:['genericOuterSD'], LABEL:'Irradiate',
        GUNS:[...a5_SD.flatMap(a=>radiationPulseGun_SD(a,0,[...[g.basic,g.gunner,g.twin],g.mach]))],
        TURRETS:[{POSITION:[20,0,0,0,0,1],TYPE:'innerDecoSD'},{POSITION:[12,0,0,0,0,1],TYPE:'sunDecoSD'}],
    };
    Class.solarPartSD = {
        PARENT:['genericOuterSD'], LABEL:'Solar Particle',
        GUNS:[...a8_SD.flatMap(a=>radiationPulseGun_SD(a,0,[...[g.basic,g.mach,g.twin],g.twin]))],
        TURRETS:[{POSITION:[20,0,0,0,0,1],TYPE:'outerDecoSD'},{POSITION:[12,0,0,0,0,1],TYPE:'innerDecoSD'}],
    };
    Class.emisSD = {
        PARENT:['genericOuterSD'], LABEL:'Emission',
        GUNS:[...a6_SD.flatMap(a=>radiationPulseGun_SD(a,0,[...[g.basic,g.mach,{reload:0.6}],g.flank]))],
        TURRETS:[{POSITION:[20,0,0,0,0,1],TYPE:'beltDecoSD'},{POSITION:[12,0,0,0,0,1],TYPE:'outerDecoSD'}],
    };
    Class.photonSD2 = {
        PARENT:['genericOuterSD'], LABEL:'Photon Stream',
        GUNS:[...a4_SD.flatMap(a=>radiationPulseGun_SD(a,0,[...[g.basic,g.gunner,g.power],g.assass]))],
        TURRETS:[{POSITION:[20,0,0,0,0,1],TYPE:'outerDecoSD'},{POSITION:[12,0,0,0,0,1],TYPE:'innerDecoSD'}],
    };

    Class.gammaRaySD = {
        PARENT:['genericBeltSD'], LABEL:'Gamma Ray Burst',
        GUNS:[...a10_SD.flatMap(a=>radiationPulseGun_SD(a,0,[...[g.basic,g.gunner,g.mach],g.power,g.power]))],
        TURRETS:[{POSITION:[23,0,0,0,0,1],TYPE:'beltDecoSD'},
                 {POSITION:[15,0,0,0,0,1],TYPE:'outerDecoSD'},
                 {POSITION:[8,0,0,0,0,1], TYPE:'innerDecoSD'}],
    };
    Class.pulseJetSD = {
        PARENT:['genericBeltSD'], LABEL:'Pulse Jet',
        GUNS:[...a8_SD.flatMap(a=>radiationPulseGun_SD(a,0,[...[g.basic,g.gunner,g.twin],g.mach,g.flank]))],
        TURRETS:[{POSITION:[23,0,0,0,0,1],TYPE:'outerDecoSD'},
                 {POSITION:[15,0,0,0,0,1],TYPE:'beltDecoSD'},
                 {POSITION:[8,0,0,0,0,1], TYPE:'sunDecoSD'}],
    };
    Class.radStormSD = {
        PARENT:['genericBeltSD'], LABEL:'Radiation Storm',
        GUNS:[...a6_SD.flatMap(a=>radiationPulseGun_SD(a,0,[...[g.basic,g.mach,g.twin],g.twin,g.twin]))],
        TURRETS:[{POSITION:[23,0,0,0,0,1],TYPE:'beltDecoSD'},
                 {POSITION:[15,0,0,0,0,1],TYPE:'innerDecoSD'},
                 {POSITION:[8,0,0,0,0,1], TYPE:'outerDecoSD'}],
    };
    Class.radfluxSD = {
        PARENT:['genericBeltSD'], LABEL:'Radiant Flux',
        GUNS:[...a10_SD.flatMap(a=>radiationPulseGun_SD(a,0,[...[g.basic,g.mach,{reload:0.6}],g.flank,g.mach]))],
        TURRETS:[{POSITION:[23,0,0,0,0,1],TYPE:'outerDecoSD'},
                 {POSITION:[15,0,0,0,0,1],TYPE:'innerDecoSD'},
                 {POSITION:[8,0,0,0,0,1], TYPE:'beltDecoSD'}],
    };
    Class.solarProbeSD = {
        PARENT:['genericBeltSD'], LABEL:'Solar Probe',
        GUNS:[...a8_SD.flatMap(a=>radiationPulseGun_SD(a,0,[...[g.basic,g.gunner,g.power],g.assass,g.mach]))],
        TURRETS:[{POSITION:[23,0,0,0,0,1],TYPE:'beltDecoSD'},
                 {POSITION:[15,0,0,0,0,1],TYPE:'outerDecoSD'},
                 {POSITION:[8,0,0,0,0,1], TYPE:'sunDecoSD'}],
    };

    // ── NEBULA FAMILY ─────────────────────────────────────────────────────────
    Class.nebulaSD = {
        PARENT:['genericSunSD'], LABEL:'Nebula',
        GUNS:[...a2_SD.flatMap(a=>nebulaCloudGun_SD(a,0,[g.basic]))],
        TURRETS:[{POSITION:[14,0,0,0,0,1],TYPE:'sunDecoSD'}],
    };

    Class.emissSD = {
        PARENT:['genericInnerSD'], LABEL:'Emission',
        GUNS:[...a4_SD.flatMap(a=>nebulaCloudGun_SD(a,0,[g.basic,g.pound,{spray:5}]))],
        TURRETS:[{POSITION:[16,0,0,0,0,1],TYPE:'innerDecoSD'}],
    };
    Class.reflSD = {
        PARENT:['genericInnerSD'], LABEL:'Reflection',
        GUNS:[...a6_SD.flatMap(a=>nebulaCloudGun_SD(a,0,[g.basic,g.pound,g.power]))],
        TURRETS:[{POSITION:[16,0,0,0,0,1],TYPE:'sunDecoSD'}],
    };
    Class.darkNebSD = {
        PARENT:['genericInnerSD'], LABEL:'Dark Nebula',
        GUNS:[...a3_SD.flatMap(a=>nebulaCloudGun_SD(a,0,[g.basic,g.pound,g.morerecoil]))],
        TURRETS:[{POSITION:[16,0,0,0,0,1],TYPE:'innerDecoSD'}],
    };
    Class.protoNeSD = {
        PARENT:['genericInnerSD'], LABEL:'Protostellar',
        GUNS:[...a4_SD.flatMap(a=>nebulaCloudGun_SD(a,0,[g.basic,g.pound,g.mach]))],
        TURRETS:[{POSITION:[16,0,0,0,0,1],TYPE:'outerDecoSD'}],
    };
    Class.pillarsSD = {
        PARENT:['genericInnerSD'], LABEL:'Pillars',
        GUNS:[...a2_SD.flatMap(a=>nebulaCloudGun_SD(a,0,[g.basic,g.pounder,{spray:4}]))],
        TURRETS:[{POSITION:[16,0,0,0,0,1],TYPE:'beltDecoSD'}],
    };

    Class.molecSD = {
        PARENT:['genericOuterSD'], LABEL:'Molecular Cloud',
        GUNS:[...a6_SD.flatMap(a=>nebulaCloudGun_SD(a,0,[...[g.basic,g.pound,{spray:5}],g.power]))],
        TURRETS:[{POSITION:[20,0,0,0,0,1],TYPE:'outerDecoSD'},{POSITION:[12,0,0,0,0,1],TYPE:'innerDecoSD'}],
    };
    Class.starFormSD = {
        PARENT:['genericOuterSD'], LABEL:'Star-Forming',
        GUNS:[...a5_SD.flatMap(a=>nebulaCloudGun_SD(a,0,[...[g.basic,g.pound,g.power],g.mach]))],
        TURRETS:[{POSITION:[20,0,0,0,0,1],TYPE:'innerDecoSD'},{POSITION:[12,0,0,0,0,1],TYPE:'sunDecoSD'}],
    };
    Class.dustLaneSD = {
        PARENT:['genericOuterSD'], LABEL:'Dust Lane',
        GUNS:[...a8_SD.flatMap(a=>nebulaCloudGun_SD(a,0,[...[g.basic,g.pound,g.morerecoil],g.twin]))],
        TURRETS:[{POSITION:[20,0,0,0,0,1],TYPE:'outerDecoSD'},{POSITION:[12,0,0,0,0,1],TYPE:'innerDecoSD'}],
    };
    Class.shockwaveSD = {
        PARENT:['genericOuterSD'], LABEL:'Nebula Shockwave',
        GUNS:[...a6_SD.flatMap(a=>nebulaCloudGun_SD(a,0,[...[g.basic,g.pound,g.mach],g.flank]))],
        TURRETS:[{POSITION:[20,0,0,0,0,1],TYPE:'beltDecoSD'},{POSITION:[12,0,0,0,0,1],TYPE:'outerDecoSD'}],
    };
    Class.nebulaBlastSD = {
        PARENT:['genericOuterSD'], LABEL:'Nebula Blast',
        GUNS:[...a4_SD.flatMap(a=>nebulaCloudGun_SD(a,0,[...[g.basic,g.pounder,{spray:4}],g.assass]))],
        TURRETS:[{POSITION:[20,0,0,0,0,1],TYPE:'outerDecoSD'},{POSITION:[12,0,0,0,0,1],TYPE:'innerDecoSD'}],
    };

    Class.nebCoreSD = {
        PARENT:['genericBeltSD'], LABEL:'Nebula Core',
        GUNS:[...a10_SD.flatMap(a=>nebulaCloudGun_SD(a,0,[...[g.basic,g.pound,{spray:5}],g.power,g.power]))],
        TURRETS:[{POSITION:[23,0,0,0,0,1],TYPE:'beltDecoSD'},
                 {POSITION:[15,0,0,0,0,1],TYPE:'outerDecoSD'},
                 {POSITION:[8,0,0,0,0,1], TYPE:'innerDecoSD'}],
    };
    Class.protostarSD = {
        PARENT:['genericBeltSD'], LABEL:'Protostar',
        GUNS:[...a8_SD.flatMap(a=>nebulaCloudGun_SD(a,0,[...[g.basic,g.pound,g.power],g.mach,g.flank]))],
        TURRETS:[{POSITION:[23,0,0,0,0,1],TYPE:'outerDecoSD'},
                 {POSITION:[15,0,0,0,0,1],TYPE:'beltDecoSD'},
                 {POSITION:[8,0,0,0,0,1], TYPE:'sunDecoSD'}],
    };
    Class.stellarNursSD = {
        PARENT:['genericBeltSD'], LABEL:'Stellar Nursery',
        GUNS:[...a6_SD.flatMap(a=>nebulaCloudGun_SD(a,0,[...[g.basic,g.pound,g.morerecoil],g.twin,g.twin]))],
        TURRETS:[{POSITION:[23,0,0,0,0,1],TYPE:'beltDecoSD'},
                 {POSITION:[15,0,0,0,0,1],TYPE:'innerDecoSD'},
                 {POSITION:[8,0,0,0,0,1], TYPE:'outerDecoSD'}],
    };
    Class.dustStormSD = {
        PARENT:['genericBeltSD'], LABEL:'Dust Storm',
        GUNS:[...a10_SD.flatMap(a=>nebulaCloudGun_SD(a,0,[...[g.basic,g.pound,g.mach],g.flank,g.mach]))],
        TURRETS:[{POSITION:[23,0,0,0,0,1],TYPE:'outerDecoSD'},
                 {POSITION:[15,0,0,0,0,1],TYPE:'innerDecoSD'},
                 {POSITION:[8,0,0,0,0,1], TYPE:'beltDecoSD'}],
    };
    Class.nebulaCrushSD = {
        PARENT:['genericBeltSD'], LABEL:'Nebula Crush',
        GUNS:[...a8_SD.flatMap(a=>nebulaCloudGun_SD(a,0,[...[g.basic,g.pounder,{spray:4}],g.assass,g.mach]))],
        TURRETS:[{POSITION:[23,0,0,0,0,1],TYPE:'beltDecoSD'},
                 {POSITION:[15,0,0,0,0,1],TYPE:'outerDecoSD'},
                 {POSITION:[8,0,0,0,0,1], TYPE:'sunDecoSD'}],
    };

    // ── PLASMA FAMILY ─────────────────────────────────────────────────────────
    Class.plasmaSD = {
        PARENT:['genericSunSD'], LABEL:'Plasma',
        GUNS:[...a2_SD.flatMap(a=>plasmaTrapGun_SD(a,0,[g.basic]))],
        TURRETS:[{POSITION:[14,0,0,0,0,1],TYPE:'sunDecoSD'}],
    };

    Class.ionSD = {
        PARENT:['genericInnerSD'], LABEL:'Ion Trap',
        GUNS:[...a4_SD.flatMap(a=>plasmaTrapGun_SD(a,0,[g.trap,g.hexatrap]))],
        TURRETS:[{POSITION:[16,0,0,0,0,1],TYPE:'innerDecoSD'}],
    };
    Class.magSD = {
        PARENT:['genericInnerSD'], LABEL:'Magnetic Trap',
        GUNS:[...a6_SD.flatMap(a=>plasmaTrapGun_SD(a,0,[g.trap,g.hexatrap,g.power]))],
        TURRETS:[{POSITION:[16,0,0,0,0,1],TYPE:'sunDecoSD'}],
    };
    Class.fieldSD = {
        PARENT:['genericInnerSD'], LABEL:'Plasma Field',
        GUNS:[...a3_SD.flatMap(a=>plasmaTrapGun_SD(a,0,[g.trap,{health:1.4}]))],
        TURRETS:[{POSITION:[16,0,0,0,0,1],TYPE:'innerDecoSD'}],
    };
    Class.sheathSD = {
        PARENT:['genericInnerSD'], LABEL:'Plasma Sheath',
        GUNS:[...a4_SD.flatMap(a=>plasmaTrapGun_SD(a,0,[g.trap,g.hexatrap,g.mach]))],
        TURRETS:[{POSITION:[16,0,0,0,0,1],TYPE:'outerDecoSD'}],
    };
    Class.vortexSD = {
        PARENT:['genericInnerSD'], LABEL:'Plasma Vortex',
        GUNS:[...a2_SD.flatMap(a=>plasmaTrapGun_SD(a,0,[g.trap,g.hexatrap,{reload:0.8}]))],
        TURRETS:[{POSITION:[16,0,0,0,0,1],TYPE:'beltDecoSD'}],
    };

    Class.crystalTSD = {
        PARENT:['genericOuterSD'], LABEL:'Crystal Trap',
        GUNS:[...a6_SD.flatMap(a=>plasmaTrapGun_SD(a,0,[...[g.trap,g.hexatrap],g.power]))],
        TURRETS:[{POSITION:[20,0,0,0,0,1],TYPE:'outerDecoSD'},{POSITION:[12,0,0,0,0,1],TYPE:'innerDecoSD'}],
    };
    Class.shieldTSD = {
        PARENT:['genericOuterSD'], LABEL:'Plasma Shield',
        GUNS:[...a5_SD.flatMap(a=>plasmaTrapGun_SD(a,0,[...[g.trap,g.hexatrap,g.power],g.mach]))],
        TURRETS:[{POSITION:[20,0,0,0,0,1],TYPE:'innerDecoSD'},{POSITION:[12,0,0,0,0,1],TYPE:'sunDecoSD'}],
    };
    Class.cageTSD = {
        PARENT:['genericOuterSD'], LABEL:'Plasma Cage',
        GUNS:[...a8_SD.flatMap(a=>plasmaTrapGun_SD(a,0,[...[g.trap,{health:1.4}],g.twin]))],
        TURRETS:[{POSITION:[20,0,0,0,0,1],TYPE:'outerDecoSD'},{POSITION:[12,0,0,0,0,1],TYPE:'innerDecoSD'}],
    };
    Class.sphereSD = {
        PARENT:['genericOuterSD'], LABEL:'Plasma Sphere',
        GUNS:[...a6_SD.flatMap(a=>plasmaTrapGun_SD(a,0,[...[g.trap,g.hexatrap,g.mach],g.flank]))],
        TURRETS:[{POSITION:[20,0,0,0,0,1],TYPE:'beltDecoSD'},{POSITION:[12,0,0,0,0,1],TYPE:'outerDecoSD'}],
    };
    Class.torusSD = {
        PARENT:['genericOuterSD'], LABEL:'Plasma Torus',
        GUNS:[...a4_SD.flatMap(a=>plasmaTrapGun_SD(a,0,[...[g.trap,g.hexatrap,{reload:0.8}],g.assass]))],
        TURRETS:[{POSITION:[20,0,0,0,0,1],TYPE:'outerDecoSD'},{POSITION:[12,0,0,0,0,1],TYPE:'innerDecoSD'}],
    };

    Class.fusionTSD = {
        PARENT:['genericBeltSD'], LABEL:'Fusion Trap',
        GUNS:[...a10_SD.flatMap(a=>plasmaTrapGun_SD(a,0,[...[g.trap,g.hexatrap],g.power,g.power]))],
        TURRETS:[{POSITION:[23,0,0,0,0,1],TYPE:'beltDecoSD'},
                 {POSITION:[15,0,0,0,0,1],TYPE:'outerDecoSD'},
                 {POSITION:[8,0,0,0,0,1], TYPE:'innerDecoSD'}],
    };
    Class.confineTSD = {
        PARENT:['genericBeltSD'], LABEL:'Confinement',
        GUNS:[...a8_SD.flatMap(a=>plasmaTrapGun_SD(a,0,[...[g.trap,g.hexatrap,g.power],g.mach,g.flank]))],
        TURRETS:[{POSITION:[23,0,0,0,0,1],TYPE:'outerDecoSD'},
                 {POSITION:[15,0,0,0,0,1],TYPE:'beltDecoSD'},
                 {POSITION:[8,0,0,0,0,1], TYPE:'sunDecoSD'}],
    };
    Class.magnetCSD = {
        PARENT:['genericBeltSD'], LABEL:'Magnetic Cage',
        GUNS:[...a6_SD.flatMap(a=>plasmaTrapGun_SD(a,0,[...[g.trap,{health:1.4}],g.twin,g.twin]))],
        TURRETS:[{POSITION:[23,0,0,0,0,1],TYPE:'beltDecoSD'},
                 {POSITION:[15,0,0,0,0,1],TYPE:'innerDecoSD'},
                 {POSITION:[8,0,0,0,0,1], TYPE:'outerDecoSD'}],
    };
    Class.pinchSD = {
        PARENT:['genericBeltSD'], LABEL:'Z-Pinch',
        GUNS:[...a10_SD.flatMap(a=>plasmaTrapGun_SD(a,0,[...[g.trap,g.hexatrap,g.mach],g.flank,g.mach]))],
        TURRETS:[{POSITION:[23,0,0,0,0,1],TYPE:'outerDecoSD'},
                 {POSITION:[15,0,0,0,0,1],TYPE:'innerDecoSD'},
                 {POSITION:[8,0,0,0,0,1], TYPE:'beltDecoSD'}],
    };
    Class.tokamakSD = {
        PARENT:['genericBeltSD'], LABEL:'Tokamak',
        GUNS:[...a8_SD.flatMap(a=>plasmaTrapGun_SD(a,0,[...[g.trap,g.hexatrap,{reload:0.8}],g.assass,g.mach]))],
        TURRETS:[{POSITION:[23,0,0,0,0,1],TYPE:'beltDecoSD'},
                 {POSITION:[15,0,0,0,0,1],TYPE:'outerDecoSD'},
                 {POSITION:[8,0,0,0,0,1], TYPE:'sunDecoSD'}],
    };

    // ── MEGA COMBINATION FINALS (combining weapon types) ───────────────────────
    Class.solarSystemSD = {
        PARENT:['genericBeltSD'], LABEL:'Solar System',
        GUNS:[a5_SD.flatMap(a=>[...solarFlareGun_SD(a,0,[g.basic,g.power,g.mach]),...coronaBlastGun_SD(a+36,0.5,[g.basic,g.pound,g.mach])])],
        TURRETS:[{POSITION:[22,0,0,0,0,1],TYPE:'beltDecoSD'},
                 {POSITION:[19,0,0,0,0,1],TYPE:'saturnDecoSD'},
                 {POSITION:[16,0,0,0,0,1],TYPE:'outerDecoSD'},
                 {POSITION:[13,0,0,0,0,1],TYPE:'innerDecoSD'}],
    };

    Class.cosmicSunSD = {
        PARENT:['genericBeltSD'], LABEL:'Cosmic Sun',
        GUNS:[a8_SD.flatMap(a=>[...solarFlareGun_SD(a,0,[g.basic,g.power]),...gravityWellGun_SD(a+22.5,0.5,[g.basic,g.pound,g.power])])],
        TURRETS:[{POSITION:[22,0,0,0,0,1],TYPE:'beltDecoSD'},
                 {POSITION:[19,0,0,0,0,1],TYPE:'sunDecoSD'},
                 {POSITION:[16,0,0,0,0,1],TYPE:'outerDecoSD'},
                 {POSITION:[13,0,0,0,0,1],TYPE:'innerDecoSD'}],
    };

    Class.stellarCoreSD = {
        PARENT:['genericBeltSD'], LABEL:'Stellar Core',
        GUNS:[a10_SD.flatMap(a=>[...radiationPulseGun_SD(a,0,[g.basic,g.gunner,g.mach]),...solarWindGun_SD(a+18,0.25,[g.basic,g.twin,g.mach])])],
        TURRETS:[{POSITION:[22,0,0,0,0,1],TYPE:'beltDecoSD'},
                 {POSITION:[19,0,0,0,0,1],TYPE:'ringDecoSD'},
                 {POSITION:[16,0,0,0,0,1],TYPE:'outerDecoSD'},
                 {POSITION:[13,0,0,0,0,1],TYPE:'innerDecoSD'}],
    };

    Class.starClusterSD = {
        PARENT:['genericBeltSD'], LABEL:'Star Cluster',
        GUNS:[a6_SD.flatMap(a=>[...coronaBlastGun_SD(a,0,[g.basic,g.pound,g.power]),...nebulaCloudGun_SD(a+30,0.5,[g.basic,g.pound,{spray:5}])])],
        TURRETS:[{POSITION:[22,0,0,0,0,1],TYPE:'beltDecoSD'},
                 {POSITION:[19,0,0,0,0,1],TYPE:'galaxyDecoSD'},
                 {POSITION:[16,0,0,0,0,1],TYPE:'outerDecoSD'},
                 {POSITION:[13,0,0,0,0,1],TYPE:'innerDecoSD'}],
    };

    Class.cosmosSD = {
        PARENT:['genericBeltSD'], LABEL:'Cosmos',
        GUNS:[a8_SD.flatMap(a=>[...magnetarPulseGun_SD(a,0,[g.basic,g.sniper,g.power]),...orbitalRingGun_SD(a+22.5,0.5,[g.basic,g.flank,g.power])])],
        TURRETS:[{POSITION:[22,0,0,0,0,1],TYPE:'beltDecoSD'},
                 {POSITION:[19,0,0,0,0,1],TYPE:'starbDecoSD'},
                 {POSITION:[16,0,0,0,0,1],TYPE:'saturnDecoSD'},
                 {POSITION:[13,0,0,0,0,1],TYPE:'outerDecoSD'}],
    };

    Class.sunGodSD = {
        PARENT:['genericBeltSD'], LABEL:'Sun God',
        GUNS:[[...a12_SD.flatMap(a=>solarFlareGun_SD(a,0,[g.basic,g.power,g.mach,g.flank])),...a12_SD.flatMap(a=>coronaBlastGun_SD(a+15,0.5,[g.basic,g.pound,g.power,g.mach]))]],
        TURRETS:[{POSITION:[22,0,0,0,0,1],TYPE:'beltDecoSD'},
                 {POSITION:[19,0,0,0,0,1],TYPE:'sunDecoSD'},
                 {POSITION:[16,0,0,0,0,1],TYPE:'saturnDecoSD'},
                 {POSITION:[13,0,0,0,0,1],TYPE:'outerDecoSD'},
                 {POSITION:[10,0,0,0,0,1],TYPE:'starbDecoSD'}],
    };

    Class.supernovaSD = {
        PARENT:['genericBeltSD'], LABEL:'Supernova',
        GUNS:[[...a10_SD.flatMap(a=>gravityWellGun_SD(a,0,[g.basic,g.pound,g.power,g.morerecoil])),...a10_SD.flatMap(a=>coronaBlastGun_SD(a+18,0.5,[g.basic,g.pound,g.power,g.mach]))]],
        TURRETS:[{POSITION:[22,0,0,0,0,1],TYPE:'beltDecoSD'},
                 {POSITION:[19,0,0,0,0,1],TYPE:'starbDecoSD'},
                 {POSITION:[16,0,0,0,0,1],TYPE:'ringDecoSD'},
                 {POSITION:[13,0,0,0,0,1],TYPE:'outerDecoSD'}],
    };

    Class.hypernovaSD = {
        PARENT:['genericBeltSD'], LABEL:'Hypernova',
        GUNS:[[...a10_SD.flatMap(a=>asteroidCannonGun_SD(a,0,[g.basic,g.pound,g.pounder,g.power])),...a10_SD.flatMap(a=>plasmaTrapGun_SD(a+18,0.5,[g.trap,g.hexatrap,g.power,{health:2}]))]],
        TURRETS:[{POSITION:[22,0,0,0,0,1],TYPE:'beltDecoSD'},
                 {POSITION:[19,0,0,0,0,1],TYPE:'galaxyDecoSD'},
                 {POSITION:[16,0,0,0,0,1],TYPE:'saturnDecoSD'},
                 {POSITION:[13,0,0,0,0,1],TYPE:'outerDecoSD'}],
    };

    Class.heliosPrimeSD = {
        PARENT:['genericBeltSD'], LABEL:'Helios Prime',
        GUNS:[[...a12_SD.flatMap(a=>solarWindGun_SD(a,0,[g.basic,g.twin,g.mach,g.power])),...a12_SD.flatMap(a=>cometStreamGun_SD(a+15,0.5,[g.sniper,g.assass,g.power,g.mach]))]],
        TURRETS:[{POSITION:[22,0,0,0,0,1],TYPE:'beltDecoSD'},
                 {POSITION:[19,0,0,0,0,1],TYPE:'innerDecoSD'},
                 {POSITION:[16,0,0,0,0,1],TYPE:'saturnDecoSD'},
                 {POSITION:[13,0,0,0,0,1],TYPE:'outerDecoSD'},
                 {POSITION:[10,0,0,0,0,1],TYPE:'ringDecoSD'}],
    };

    Class.universalSD = {
        PARENT:['genericBeltSD'], LABEL:'Universal',
        GUNS:[[...a10_SD.flatMap(a=>magnetarPulseGun_SD(a,0,[g.basic,g.sniper,g.power,g.mach])),...a10_SD.flatMap(a=>solarFlareGun_SD(a+18,0.25,[g.basic,g.power,g.mach,g.flank])),...a10_SD.flatMap(a=>nebulaCloudGun_SD(a+36,0.5,[g.basic,g.pound,g.power,g.mach]))]],
        TURRETS:[{POSITION:[22,0,0,0,0,1],TYPE:'beltDecoSD'},
                 {POSITION:[19,0,0,0,0,1],TYPE:'starbDecoSD'},
                 {POSITION:[16,0,0,0,0,1],TYPE:'galaxyDecoSD'},
                 {POSITION:[13,0,0,0,0,1],TYPE:'ringDecoSD'},
                 {POSITION:[10,0,0,0,0,1],TYPE:'saturnDecoSD'}],
    };

    // ═══════════════════════════════════════════════════════════════════════════
    // BODY UPGRADE TREE — Planets, Stars, and Cosmic Objects
    // ═══════════════════════════════════════════════════════════════════════════

    // T1 Body (inner planets — square shape)
    Class.mercurySD = {
        PARENT:['genericInnerSD'], LABEL:'Mercury',
        SHAPE:SHAPE_INNER_SD, COLOR:-1, SIZE:12,
        BODY:{SPEED:1.7,HEALTH:0.68}, GUNS:[],
        TURRETS:[{POSITION:[9,0,0,0,360,1],TYPE:['egg',{COLOR:6,CONTROLLERS:[['spin',{speed:0.08}]]}]}],
    };
    Class.venusSD = {
        PARENT:['genericInnerSD'], LABEL:'Venus',
        SHAPE:SHAPE_INNER_SD, COLOR:3, SIZE:12,
        BODY:{HEALTH:1.55,SHIELD:2.0,REGEN:1.8,SPEED:0.82}, GUNS:[],
        TURRETS:[{POSITION:[10,0,0,0,360,1],TYPE:['egg',{COLOR:3,CONTROLLERS:[['spin',{speed:0.03}]]}]}],
    };
    Class.earthSD = {
        PARENT:['genericInnerSD'], LABEL:'Earth',
        SHAPE:SHAPE_INNER_SD, COLOR:4, SIZE:12,
        BODY:{HEALTH:1.35,SHIELD:1.6,FOV:1.3,SPEED:0.92}, GUNS:[],
        TURRETS:[{POSITION:[11,0,0,0,360,1],TYPE:['egg',{COLOR:4,CONTROLLERS:[['spin',{speed:0.035}]]}]}],
    };
    Class.marsSD = {
        PARENT:['genericInnerSD'], LABEL:'Mars',
        SHAPE:SHAPE_INNER_SD, COLOR:2, SIZE:12,
        BODY:{SPEED:1.4,HEALTH:0.85,DAMAGE:1.4}, GUNS:[],
        TURRETS:[{POSITION:[9,0,0,0,360,1],TYPE:['egg',{COLOR:2,CONTROLLERS:[['spin',{speed:0.06}]]}]}],
    };
    Class.ioSD = {
        PARENT:['genericInnerSD'], LABEL:'Io',
        SHAPE:SHAPE_INNER_SD, COLOR:3, SIZE:12,
        BODY:{SPEED:1.55,HEALTH:0.72,DAMAGE:1.2}, GUNS:[],
        TURRETS:[{POSITION:[8,0,0,0,360,1],TYPE:['egg',{COLOR:3,CONTROLLERS:[['spin',{speed:0.07}]]}]}],
    };
    Class.europaSD = {
        PARENT:['genericInnerSD'], LABEL:'Europa',
        SHAPE:SHAPE_INNER_SD, COLOR:4, SIZE:12,
        BODY:{HEALTH:1.4,SHIELD:2.2,REGEN:2.0,SPEED:0.86}, GUNS:[],
        TURRETS:[{POSITION:[10,0,0,0,360,1],TYPE:['egg',{COLOR:4,CONTROLLERS:[['spin',{speed:-0.04}]]}]}],
    };
    Class.titanSD = {
        PARENT:['genericInnerSD'], LABEL:'Titan',
        SHAPE:SHAPE_SATURN_SD, COLOR:-1, SIZE:14,
        BODY:{HEALTH:2.0,SPEED:0.8,DENSITY:1.2}, GUNS:[],
        TURRETS:[{POSITION:[13,0,0,0,360,1],TYPE:['egg',{COLOR:-1,CONTROLLERS:[['spin',{speed:0.025}]]}]}],
    };
    Class.tritonSD = {
        PARENT:['genericInnerSD'], LABEL:'Triton',
        SHAPE:SHAPE_INNER_SD, COLOR:14, SIZE:12,
        BODY:{SPEED:1.6,HEALTH:0.7,FOV:1.2}, GUNS:[],
        TURRETS:[{POSITION:[9,0,0,0,360,1],TYPE:['egg',{COLOR:14,CONTROLLERS:[['spin',{speed:-0.065}]]}]}],
    };

    // T2 Body (outer planets — triangle shape)
    Class.jupiterSD = {
        PARENT:['genericOuterSD'], LABEL:'Jupiter',
        COLOR:2,
        BODY:{HEALTH:2.5,SHIELD:2.8,SPEED:0.72}, GUNS:[],
        TURRETS:[{POSITION:[18,0,0,0,360,1],TYPE:['egg',{COLOR:2,CONTROLLERS:[['spin',{speed:0.022}]]}]},
            {POSITION:[11,0,0,0,360,1],TYPE:['egg',{COLOR:3,CONTROLLERS:[['spin',{speed:0.035}]]}]}],
    };
    Class.saturnBodySD = {
        PARENT:['genericOuterSD'], LABEL:'Saturn',
        COLOR:-1,
        BODY:{HEALTH:2.2,SPEED:0.76}, GUNS:[],
        TURRETS:[{POSITION:[20,0,0,0,0,1],TYPE:'saturnDecoSD'},
            {POSITION:[10,0,0,0,360,1],TYPE:['egg',{COLOR:13,CONTROLLERS:[['spin',{speed:0.03}]]}]}],
    };
    Class.uranusSD = {
        PARENT:['genericOuterSD'], LABEL:'Uranus',
        COLOR:14,
        BODY:{SPEED:1.5,HEALTH:0.78}, GUNS:[],
        TURRETS:[{POSITION:[16,0,0,0,360,1],TYPE:['egg',{COLOR:14,CONTROLLERS:[['spin',{speed:-0.055}]]}]},
            {POSITION:[9,0,0,0,360,1],TYPE:['egg',{COLOR:4,CONTROLLERS:[['spin',{speed:0.07}]]}]}],
    };
    Class.neptuneSD = {
        PARENT:['genericOuterSD'], LABEL:'Neptune',
        COLOR:4,
        BODY:{HEALTH:2.0,SHIELD:2.4,FOV:1.45,SPEED:0.88}, GUNS:[],
        TURRETS:[{POSITION:[17,0,0,0,360,1],TYPE:['egg',{COLOR:4,CONTROLLERS:[['spin',{speed:0.028}]]}]},
            {POSITION:[10,0,0,0,360,1],TYPE:['egg',{COLOR:8,CONTROLLERS:[['spin',{speed:-0.04}]]}]}],
    };
    Class.plutoSD = {
        PARENT:['genericOuterSD'], LABEL:'Pluto',
        COLOR:13,
        BODY:{SPEED:2.2,HEALTH:0.55,FOV:1.3}, GUNS:[],
        TURRETS:[{POSITION:[12,0,0,0,360,1],TYPE:['egg',{COLOR:13,CONTROLLERS:[['spin',{speed:-0.07}]]}]},
            {POSITION:[7,0,0,0,360,1],TYPE:['egg',{COLOR:14,CONTROLLERS:[['spin',{speed:0.09}]]}]}],
    };
    Class.ceresSD = {
        PARENT:['genericOuterSD'], LABEL:'Ceres',
        COLOR:-1,
        BODY:{HEALTH:1.8,SHIELD:1.6,REGEN:2.2,SPEED:0.9}, GUNS:[],
        TURRETS:[{POSITION:[15,0,0,0,360,1],TYPE:['egg',{COLOR:-1,CONTROLLERS:[['spin',{speed:0.02}]]}]},
            {POSITION:[9,0,0,0,360,1],TYPE:['egg',{COLOR:6,CONTROLLERS:[['spin',{speed:0.05}]]}]}],
    };
    Class.erisSD = {
        PARENT:['genericOuterSD'], LABEL:'Eris',
        COLOR:14,
        BODY:{SPEED:1.8,HEALTH:0.72,FOV:1.35}, GUNS:[],
        TURRETS:[{POSITION:[14,0,0,0,360,1],TYPE:['egg',{COLOR:14,CONTROLLERS:[['spin',{speed:0.065}]]}]},
            {POSITION:[8,0,0,0,360,1],TYPE:['egg',{COLOR:17,CONTROLLERS:[['spin',{speed:-0.08}]]}]}],
    };
    Class.makemakeSD = {
        PARENT:['genericOuterSD'], LABEL:'Makemake',
        COLOR:2,
        BODY:{HEALTH:2.3,SHIELD:2.0,SPEED:0.78}, GUNS:[],
        TURRETS:[{POSITION:[16,0,0,0,360,1],TYPE:['egg',{COLOR:2,CONTROLLERS:[['spin',{speed:0.025}]]}]},
            {POSITION:[10,0,0,0,360,1],TYPE:['egg',{COLOR:12,CONTROLLERS:[['spin',{speed:-0.04}]]}]}],
    };

    // T3 Body finals (pentagon)
    Class.theSunSD = {
        PARENT:['genericBeltSD'], LABEL:'The Sun',
        COLOR:3,
        BODY:{HEALTH:3.5,SHIELD:3.8,REGEN:3.0,SPEED:0.65}, GUNS:[],
        TURRETS:[{POSITION:[22,0,0,0,0,1],TYPE:'sunDecoSD'},
            {POSITION:[14,0,0,0,360,1],TYPE:['egg',{COLOR:6,CONTROLLERS:[['spin',{speed:-0.03}]]}]},
            {POSITION:[9,0,0,0,360,1],TYPE:['egg',{COLOR:3,CONTROLLERS:[['spin',{speed:0.05}]]}]}],
    };
    Class.blackHoleBodySD = {
        PARENT:['genericBeltSD'], LABEL:'Black Hole',
        COLOR:16,
        BODY:{HEALTH:5.0,SHIELD:5.5,SPEED:0.4,DENSITY:2.0}, GUNS:[],
        TURRETS:[{POSITION:[22,0,0,0,0,1],TYPE:'beltDecoSD'},
            {POSITION:[13,0,0,0,360,1],TYPE:['egg',{COLOR:16,CONTROLLERS:[['spin',{speed:-0.025}]]}]},
            {POSITION:[8,0,0,0,360,1],TYPE:['egg',{COLOR:8,CONTROLLERS:[['spin',{speed:0.04}]]}]}],
    };
    Class.neutronStarSD = {
        PARENT:['genericBeltSD'], LABEL:'Neutron Star',
        COLOR:14,
        BODY:{HEALTH:4.0,SPEED:1.8,DAMAGE:2.0,DENSITY:3.0}, GUNS:[],
        TURRETS:[{POSITION:[22,0,0,0,0,1],TYPE:'starbDecoSD'},
            {POSITION:[12,0,0,0,360,1],TYPE:['egg',{COLOR:14,CONTROLLERS:[['spin',{speed:0.065}]]}]},
            {POSITION:[7,0,0,0,360,1],TYPE:['egg',{COLOR:17,CONTROLLERS:[['spin',{speed:-0.09}]]}]}],
    };
    Class.pulsarBodySD = {
        PARENT:['genericBeltSD'], LABEL:'Pulsar',
        COLOR:8,
        BODY:{HEALTH:3.2,SPEED:1.5,REGEN:3.5}, GUNS:[],
        TURRETS:[{POSITION:[22,0,0,0,0,1],TYPE:'ringDecoSD'},
            {POSITION:[13,0,0,0,360,1],TYPE:['egg',{COLOR:8,CONTROLLERS:[['spin',{speed:-0.055}]]}]},
            {POSITION:[8,0,0,0,360,1],TYPE:['egg',{COLOR:12,CONTROLLERS:[['spin',{speed:0.07}]]}]}],
    };
    Class.redGiantSD = {
        PARENT:['genericBeltSD'], LABEL:'Red Giant',
        COLOR:2,
        SIZE:25*1.6|0,
        BODY:{HEALTH:4.5,SHIELD:3.5,SPEED:0.5,DENSITY:1.2}, GUNS:[],
        TURRETS:[{POSITION:[24,0,0,0,0,1],TYPE:'sunDecoSD'},
            {POSITION:[15,0,0,0,360,1],TYPE:['egg',{COLOR:3,CONTROLLERS:[['spin',{speed:-0.022}]]}]},
            {POSITION:[10,0,0,0,360,1],TYPE:['egg',{COLOR:2,CONTROLLERS:[['spin',{speed:0.04}]]}]}],
    };
    Class.whiteDwarfSD = {
        PARENT:['genericBeltSD'], LABEL:'White Dwarf',
        COLOR:17,
        BODY:{HEALTH:3.8,SPEED:2.0,DENSITY:2.8}, GUNS:[],
        TURRETS:[{POSITION:[18,0,0,0,0,1],TYPE:'innerDecoSD'},
            {POSITION:[11,0,0,0,360,1],TYPE:['egg',{COLOR:17,CONTROLLERS:[['spin',{speed:0.07}]]}]},
            {POSITION:[7,0,0,0,360,1],TYPE:['egg',{COLOR:4,CONTROLLERS:[['spin',{speed:-0.09}]]}]}],
    };
    Class.darkMatterSD = {
        PARENT:['genericBeltSD'], LABEL:'Dark Matter',
        COLOR:-1,
        BODY:{HEALTH:3.5,SHIELD:4.0,SPEED:1.3,DENSITY:0.4}, GUNS:[],
        TURRETS:[{POSITION:[22,0,0,0,0,1],TYPE:'beltDecoSD'},
            {POSITION:[14,0,0,0,360,1],TYPE:['egg',{COLOR:-1,CONTROLLERS:[['spin',{speed:-0.04}]]}]},
            {POSITION:[9,0,0,0,360,1],TYPE:['egg',{COLOR:16,CONTROLLERS:[['spin',{speed:0.055}]]}]}],
    };
    Class.quasarBodySD = {
        PARENT:['genericBeltSD'], LABEL:'Quasar',
        COLOR:6,
        BODY:{HEALTH:3.0,FOV:2.0,SPEED:1.6,DAMAGE:1.5}, GUNS:[],
        TURRETS:[{POSITION:[22,0,0,0,0,1],TYPE:'galaxyDecoSD'},
            {POSITION:[13,0,0,0,360,1],TYPE:['egg',{COLOR:6,CONTROLLERS:[['spin',{speed:0.05}]]}]},
            {POSITION:[8,0,0,0,360,1],TYPE:['egg',{COLOR:3,CONTROLLERS:[['spin',{speed:-0.07}]]}]}],
    };

    // ═══════════════════════════════════════════════════════════════════════════
    // GALAXIANS — Hexagonal tier, the apex of Solar Dreads
    // Full SVG galaxy shapes + insane gun combinations
    // ═══════════════════════════════════════════════════════════════════════════

    Class.genericGalaxianSD = {
        PARENT:['genericTank'], BODY:bodyHex_SD,
        SHAPE:SHAPE_MILKYWAY_SD, COLOR:8, SIZE:26, DANGER:12,
        SKILL_CAP:Array(10).fill(smshskl),
        REROOT_UPGRADE_TREE:['weaponRootSD','bodyRootSD'],
    };

    // The home galaxy — balanced dominance in all directions
    Class.milkyWaySD = {
        PARENT:['genericGalaxianSD'],
        LABEL:'Milky Way',
        SHAPE:SHAPE_MILKYWAY_SD, COLOR:8,
        BODY:{...bodyHex_SD},
        GUNS:[a10_SD.flatMap(a=>[...solarFlareGun_SD(a,0,[g.basic,g.power,g.mach,g.flank]),...coronaBlastGun_SD(a+18,0.25,[g.basic,g.pound,g.power,g.mach]),...radiationPulseGun_SD(a+36,0.5,[g.basic,g.gunner,g.mach,g.twin])])],
        TURRETS:[{POSITION:[22,0,0,0,0,1],TYPE:'galaxyDecoSD'}, {POSITION:[20,0,0,0,0,1],TYPE:'beltDecoSD'}, {POSITION:[18,0,0,0,0,1],TYPE:'saturnDecoSD'}, {POSITION:[16,0,0,0,0,1],TYPE:'outerDecoSD'}, {POSITION:[14,0,0,0,0,1],TYPE:'innerDecoSD'}, {POSITION:[12,0,0,0,0,1],TYPE:'starbDecoSD'}],
    };

    // Long-range precision galaxy — extreme sniper dominance
    Class.andromedaSD = {
        PARENT:['genericGalaxianSD'],
        LABEL:'Andromeda',
        SHAPE:SHAPE_ANDROMEDA_SD, COLOR:4,
        BODY:{...bodyHex_SD},
        GUNS:[a12_SD.flatMap(a=>[...cometStreamGun_SD(a,0,[g.sniper,g.assass,g.power,g.mach]),...magnetarPulseGun_SD(a+15,0.33,[g.basic,g.sniper,g.power,g.mach])])],
        TURRETS:[{POSITION:[22,0,0,0,0,1],TYPE:'ringDecoSD'}, {POSITION:[20,0,0,0,0,1],TYPE:'beltDecoSD'}, {POSITION:[18,0,0,0,0,1],TYPE:'galaxyDecoSD'}, {POSITION:[16,0,0,0,0,1],TYPE:'outerDecoSD'}, {POSITION:[14,0,0,0,0,1],TYPE:'innerDecoSD'}],
    };

    // Spinning storm galaxy — all-around rapid-fire coverage
    Class.whirlpoolSD = {
        PARENT:['genericGalaxianSD'],
        LABEL:'Whirlpool',
        SHAPE:SHAPE_WHIRLPOOL_SD, COLOR:14,
        BODY:{...bodyHex_SD},
        GUNS:[a12_SD.flatMap(a=>[...orbitalRingGun_SD(a,0,[g.basic,g.flank,g.twin,g.mach,g.power]),...solarWindGun_SD(a+15,0.5,[g.basic,g.twin,g.mach,g.flank,g.power])])],
        TURRETS:[{POSITION:[22,0,0,0,0,1],TYPE:'saturnDecoSD'}, {POSITION:[20,0,0,0,0,1],TYPE:'ringDecoSD'}, {POSITION:[18,0,0,0,0,1],TYPE:'galaxyDecoSD'}, {POSITION:[16,0,0,0,0,1],TYPE:'outerDecoSD'}, {POSITION:[14,0,0,0,0,1],TYPE:'innerDecoSD'}],
    };

    // Edge-on edge-destroyer galaxy — maximum heavy firepower
    Class.sombreroSD = {
        PARENT:['genericGalaxianSD'],
        LABEL:'Sombrero',
        SHAPE:SHAPE_SOMBRERO_SD, COLOR:-1,
        BODY:{...bodyHex_SD},
        GUNS:[a10_SD.flatMap(a=>[...gravityWellGun_SD(a,0,[g.basic,g.pound,g.pounder,g.power,g.morerecoil]),...asteroidCannonGun_SD(a+18,0.5,[g.basic,g.pound,g.pounder,g.power])])],
        TURRETS:[{POSITION:[22,0,0,0,0,1],TYPE:'beltDecoSD'}, {POSITION:[20,0,0,0,0,1],TYPE:'saturnDecoSD'}, {POSITION:[18,0,0,0,0,1],TYPE:'outerDecoSD'}, {POSITION:[16,0,0,0,0,1],TYPE:'innerDecoSD'}, {POSITION:[14,0,0,0,0,1],TYPE:'galaxyDecoSD'}],
    };

    // Ring fortress galaxy — traps and precision combined
    Class.ringNebulaSD = {
        PARENT:['genericGalaxianSD'],
        LABEL:'Ring Nebula',
        SHAPE:SHAPE_RINGNEBULA_SD, COLOR:4,
        BODY:{...bodyHex_SD},
        GUNS:[a12_SD.flatMap(a=>[...plasmaTrapGun_SD(a,0,[g.trap,g.hexatrap,g.power,{health:2.5}]),...magnetarPulseGun_SD(a+15,0.5,[g.basic,g.sniper,g.assass,g.power])])],
        TURRETS:[{POSITION:[22,0,0,0,0,1],TYPE:'ringDecoSD'}, {POSITION:[20,0,0,0,0,1],TYPE:'beltDecoSD'}, {POSITION:[18,0,0,0,0,1],TYPE:'innerDecoSD'}, {POSITION:[16,0,0,0,0,1],TYPE:'galaxyDecoSD'}, {POSITION:[14,0,0,0,0,1],TYPE:'saturnDecoSD'}],
    };

    // Explosive remnant galaxy — burst damage in every direction
    Class.crabNebulaSD = {
        PARENT:['genericGalaxianSD'],
        LABEL:'Crab Nebula',
        SHAPE:SHAPE_CRAB_SD, COLOR:3,
        BODY:{...bodyHex_SD},
        GUNS:[[...a10_SD.flatMap(a=>coronaBlastGun_SD(a,0,[g.basic,g.pound,g.power,g.mach,{spray:6}])),...a10_SD.flatMap(a=>nebulaCloudGun_SD(a+18,0.5,[g.basic,g.pound,g.power,g.mach,{spray:5}])),...a10_SD.flatMap(a=>solarFlareGun_SD(a+36,0.75,[g.basic,g.power,g.mach,g.flank]))]],
        TURRETS:[{POSITION:[22,0,0,0,0,1],TYPE:'starbDecoSD'}, {POSITION:[20,0,0,0,0,1],TYPE:'beltDecoSD'}, {POSITION:[18,0,0,0,0,1],TYPE:'sunDecoSD'}, {POSITION:[16,0,0,0,0,1],TYPE:'outerDecoSD'}, {POSITION:[14,0,0,0,0,1],TYPE:'galaxyDecoSD'}, {POSITION:[12,0,0,0,0,1],TYPE:'innerDecoSD'}],
    };

    // Ultimate gravity — destroys everything with crushingly heavy shots
    Class.blackHoleGalSD = {
        PARENT:['genericGalaxianSD'],
        LABEL:'Black Hole Galaxy',
        SHAPE:SHAPE_BLACKHOLE_SD, COLOR:16,
        BODY:{...bodyHex_SD},
        GUNS:[[...a12_SD.flatMap(a=>gravityWellGun_SD(a,0,[g.basic,g.pound,g.pounder,g.power,g.morerecoil,{reload:1.3}])),...a6_SD.flatMap(a=>magnetarPulseGun_SD(a+30,0.5,[g.basic,g.sniper,g.power,g.mach,g.assass]))]],
        TURRETS:[{POSITION:[22,0,0,0,0,1],TYPE:'beltDecoSD'}, {POSITION:[20,0,0,0,0,1],TYPE:'galaxyDecoSD'}, {POSITION:[18,0,0,0,0,1],TYPE:'saturnDecoSD'}, {POSITION:[16,0,0,0,0,1],TYPE:'outerDecoSD'}, {POSITION:[14,0,0,0,0,1],TYPE:'innerDecoSD'}],
    };

    // Eye of God — omnidirectional trap and radiation coverage
    Class.helixSD = {
        PARENT:['genericGalaxianSD'],
        LABEL:'Helix Nebula',
        SHAPE:SHAPE_HELIX_SD, COLOR:4,
        BODY:{...bodyHex_SD},
        GUNS:[[...a12_SD.flatMap(a=>plasmaTrapGun_SD(a,0,[g.trap,g.hexatrap,g.power,{health:3}])),...a12_SD.flatMap(a=>orbitalRingGun_SD(a+15,0.25,[g.basic,g.flank,g.twin,g.mach,g.power])),...a12_SD.flatMap(a=>radiationPulseGun_SD(a+30,0.5,[g.basic,g.gunner,g.mach,g.twin,g.power]))]],
        TURRETS:[{POSITION:[22,0,0,0,0,1],TYPE:'ringDecoSD'}, {POSITION:[20,0,0,0,0,1],TYPE:'galaxyDecoSD'}, {POSITION:[18,0,0,0,0,1],TYPE:'saturnDecoSD'}, {POSITION:[16,0,0,0,0,1],TYPE:'beltDecoSD'}, {POSITION:[14,0,0,0,0,1],TYPE:'innerDecoSD'}, {POSITION:[12,0,0,0,0,1],TYPE:'outerDecoSD'}],
    };

    // Intense star-formation — the densest offensive galaxy
    Class.starburstGalSD = {
        PARENT:['genericGalaxianSD'],
        LABEL:'Starburst Galaxy',
        SHAPE:SHAPE_STARBURST_SD, COLOR:3,
        BODY:{...bodyHex_SD},
        GUNS:[[...a12_SD.flatMap(a=>solarFlareGun_SD(a,0,[g.basic,g.power,g.mach,g.flank,g.twin])),...a12_SD.flatMap(a=>coronaBlastGun_SD(a+15,0.33,[g.basic,g.pound,g.power,g.mach,{spray:4}])),...a6_SD.flatMap(a=>gravityWellGun_SD(a+30,0.66,[g.basic,g.pound,g.pounder,g.power,g.morerecoil]))]],
        TURRETS:[{POSITION:[22,0,0,0,0,1],TYPE:'starbDecoSD'}, {POSITION:[20,0,0,0,0,1],TYPE:'sunDecoSD'}, {POSITION:[18,0,0,0,0,1],TYPE:'beltDecoSD'}, {POSITION:[16,0,0,0,0,1],TYPE:'outerDecoSD'}, {POSITION:[14,0,0,0,0,1],TYPE:'galaxyDecoSD'}, {POSITION:[12,0,0,0,0,1],TYPE:'innerDecoSD'}],
    };

    // Two galaxies colliding — every weapon type simultaneously
    Class.collisionGalSD = {
        PARENT:['genericGalaxianSD'],
        LABEL:'Collision Galaxy',
        SHAPE:SHAPE_COLLISION_SD, COLOR:8,
        BODY:{...bodyHex_SD},
        GUNS:[[...a10_SD.flatMap(a=>solarFlareGun_SD(a,0,[g.basic,g.power,g.mach,g.flank,g.twin])),...a10_SD.flatMap(a=>gravityWellGun_SD(a+18,0.2,[g.basic,g.pound,g.pounder,g.power,g.morerecoil])),...a10_SD.flatMap(a=>nebulaCloudGun_SD(a+36,0.4,[g.basic,g.pound,g.power,g.mach,{spray:5}])),...a10_SD.flatMap(a=>plasmaTrapGun_SD(a+54,0.6,[g.trap,g.hexatrap,g.power,{health:2}]))]],
        TURRETS:[{POSITION:[22,0,0,0,0,1],TYPE:'galaxyDecoSD'}, {POSITION:[20,0,0,0,0,1],TYPE:'starbDecoSD'}, {POSITION:[18,0,0,0,0,1],TYPE:'beltDecoSD'}, {POSITION:[16,0,0,0,0,1],TYPE:'ringDecoSD'}, {POSITION:[14,0,0,0,0,1],TYPE:'saturnDecoSD'}, {POSITION:[12,0,0,0,0,1],TYPE:'outerDecoSD'}, {POSITION:[10,0,0,0,0,1],TYPE:'innerDecoSD'}],
    };

    // ═══════════════════════════════════════════════════════════════════════════
    // UPGRADE TREE
    // ═══════════════════════════════════════════════════════════════════════════

    // Entry
    Class.dreadSD.UPGRADES_TIER_0 = ['weaponRootSD','bodyRootSD'];

    // Weapon root → 8 T1 families
    Class.weaponRootSD.UPGRADES_TIER_0 = ['solarSD', 'coronaSD', 'gravitySD', 'orbitalSD', 'cometSD', 'radiationSD', 'nebulaSD', 'plasmaSD'];

    // Solar tree
    Class.solarSD.UPGRADES_TIER_0 = ['flameSD', 'eruptSD', 'protoSD', 'heliSD', 'photonSD'];
    Class.flameSD.UPGRADES_TIER_0 = ['infernoSD'];
    Class.eruptSD.UPGRADES_TIER_0 = ['novaFlareSD'];
    Class.protoSD.UPGRADES_TIER_0 = ['prominenceSD'];
    Class.heliSD.UPGRADES_TIER_0 = ['coroBurstSD'];
    Class.photonSD.UPGRADES_TIER_0 = ['solarMaxSD'];
    Class.infernoSD.UPGRADES_TIER_0 = ['solarStormSD'];
    Class.novaFlareSD.UPGRADES_TIER_0 = ['grandEruptSD'];
    Class.prominenceSD.UPGRADES_TIER_0 = ['megaFlareSD'];
    Class.coroBurstSD.UPGRADES_TIER_0 = ['coronalSD'];
    Class.solarMaxSD.UPGRADES_TIER_0 = ['xClassSD'];
    Class.solarStormSD.UPGRADES_TIER_0 = [];
    Class.grandEruptSD.UPGRADES_TIER_0 = [];
    Class.megaFlareSD.UPGRADES_TIER_0 = [];
    Class.coronalSD.UPGRADES_TIER_0 = [];
    Class.xClassSD.UPGRADES_TIER_0 = [];

    // Corona tree
    Class.coronaSD.UPGRADES_TIER_0 = ['archSD', 'plasmoSD', 'sunspotSD', 'helmSD', 'dipoleSD'];
    Class.archSD.UPGRADES_TIER_0 = ['solarBlastSD'];
    Class.plasmoSD.UPGRADES_TIER_0 = ['explosSD'];
    Class.sunspotSD.UPGRADES_TIER_0 = ['plasmojetSD'];
    Class.helmSD.UPGRADES_TIER_0 = ['sunshockSD'];
    Class.dipoleSD.UPGRADES_TIER_0 = ['giantSD'];
    Class.solarBlastSD.UPGRADES_TIER_0 = ['solarGod SD'];
    Class.explosSD.UPGRADES_TIER_0 = ['whiteLightSD'];
    Class.plasmojetSD.UPGRADES_TIER_0 = ['protonSD'];
    Class.sunshockSD.UPGRADES_TIER_0 = ['solarGodSD'];
    Class.giantSD.UPGRADES_TIER_0 = ['helioBlastSD'];
    Class.solarGodSD2.UPGRADES_TIER_0 = [];
    Class.whiteLightSD.UPGRADES_TIER_0 = [];
    Class.protonSD.UPGRADES_TIER_0 = [];
    Class.solarGodSD.UPGRADES_TIER_0 = [];
    Class.helioBlastSD.UPGRADES_TIER_0 = [];

    // Gravity tree
    Class.gravitySD.UPGRADES_TIER_0 = ['tidSD', 'singuSD', 'eventSD', 'accretSD', 'warpSD'];
    Class.tidSD.UPGRADES_TIER_0 = ['crushSD'];
    Class.singuSD.UPGRADES_TIER_0 = ['collapseSD'];
    Class.eventSD.UPGRADES_TIER_0 = ['massiveSD'];
    Class.accretSD.UPGRADES_TIER_0 = ['horizonSD'];
    Class.warpSD.UPGRADES_TIER_0 = ['breakSD'];
    Class.crushSD.UPGRADES_TIER_0 = ['blackDwarfSD'];
    Class.collapseSD.UPGRADES_TIER_0 = ['neutronShotSD'];
    Class.massiveSD.UPGRADES_TIER_0 = ['darkmassSD'];
    Class.horizonSD.UPGRADES_TIER_0 = ['gravitonSD'];
    Class.breakSD.UPGRADES_TIER_0 = ['spacetimeSD'];
    Class.blackDwarfSD.UPGRADES_TIER_0 = [];
    Class.neutronShotSD.UPGRADES_TIER_0 = [];
    Class.darkmassSD.UPGRADES_TIER_0 = [];
    Class.gravitonSD.UPGRADES_TIER_0 = [];
    Class.spacetimeSD.UPGRADES_TIER_0 = [];

    // Orbital tree
    Class.orbitalSD.UPGRADES_TIER_0 = ['orb1SD', 'orb2SD', 'orb3SD', 'orb4SD', 'orb5SD'];
    Class.orb1SD.UPGRADES_TIER_0 = ['retroSD'];
    Class.orb2SD.UPGRADES_TIER_0 = ['progrSD'];
    Class.orb3SD.UPGRADES_TIER_0 = ['inclinSD'];
    Class.orb4SD.UPGRADES_TIER_0 = ['nodSD'];
    Class.orb5SD.UPGRADES_TIER_0 = ['eccentSD'];
    Class.retroSD.UPGRADES_TIER_0 = ['geosyncSD'];
    Class.progrSD.UPGRADES_TIER_0 = ['haloOrbitSD'];
    Class.inclinSD.UPGRADES_TIER_0 = ['lagrangeSD'];
    Class.nodSD.UPGRADES_TIER_0 = ['transferSD'];
    Class.eccentSD.UPGRADES_TIER_0 = ['slingSD'];
    Class.geosyncSD.UPGRADES_TIER_0 = [];
    Class.haloOrbitSD.UPGRADES_TIER_0 = [];
    Class.lagrangeSD.UPGRADES_TIER_0 = [];
    Class.transferSD.UPGRADES_TIER_0 = [];
    Class.slingSD.UPGRADES_TIER_0 = [];

    // Comet tree
    Class.cometSD.UPGRADES_TIER_0 = ['halleySD', 'haleSD', 'shoeSD', 'oortSD', 'kuiperSD'];
    Class.halleySD.UPGRADES_TIER_0 = ['cometTrailSD'];
    Class.haleSD.UPGRADES_TIER_0 = ['cometBurstSD'];
    Class.shoeSD.UPGRADES_TIER_0 = ['cometionSD'];
    Class.oortSD.UPGRADES_TIER_0 = ['nucleusSD'];
    Class.kuiperSD.UPGRADES_TIER_0 = ['comaSD'];
    Class.cometTrailSD.UPGRADES_TIER_0 = ['superCometSD'];
    Class.cometBurstSD.UPGRADES_TIER_0 = ['hypercometSD'];
    Class.cometionSD.UPGRADES_TIER_0 = ['sungrazerSD'];
    Class.nucleusSD.UPGRADES_TIER_0 = ['interstellarSD'];
    Class.comaSD.UPGRADES_TIER_0 = ['longPeriodSD'];
    Class.superCometSD.UPGRADES_TIER_0 = [];
    Class.hypercometSD.UPGRADES_TIER_0 = [];
    Class.sungrazerSD.UPGRADES_TIER_0 = [];
    Class.interstellarSD.UPGRADES_TIER_0 = [];
    Class.longPeriodSD.UPGRADES_TIER_0 = [];

    // Radiation tree
    Class.radiationSD.UPGRADES_TIER_0 = ['gammaSD', 'xraySD', 'uvSD', 'infraSD', 'particSD'];
    Class.gammaSD.UPGRADES_TIER_0 = ['ionizeSD'];
    Class.xraySD.UPGRADES_TIER_0 = ['irradSD'];
    Class.uvSD.UPGRADES_TIER_0 = ['solarPartSD'];
    Class.infraSD.UPGRADES_TIER_0 = ['emisSD'];
    Class.particSD.UPGRADES_TIER_0 = ['photonSD2'];
    Class.ionizeSD.UPGRADES_TIER_0 = ['gammaRaySD'];
    Class.irradSD.UPGRADES_TIER_0 = ['pulseJetSD'];
    Class.solarPartSD.UPGRADES_TIER_0 = ['radStormSD'];
    Class.emisSD.UPGRADES_TIER_0 = ['radfluxSD'];
    Class.photonSD2.UPGRADES_TIER_0 = ['solarProbeSD'];
    Class.gammaRaySD.UPGRADES_TIER_0 = [];
    Class.pulseJetSD.UPGRADES_TIER_0 = [];
    Class.radStormSD.UPGRADES_TIER_0 = [];
    Class.radfluxSD.UPGRADES_TIER_0 = [];
    Class.solarProbeSD.UPGRADES_TIER_0 = [];

    // Nebula tree
    Class.nebulaSD.UPGRADES_TIER_0 = ['emissSD', 'reflSD', 'darkNebSD', 'protoNeSD', 'pillarsSD'];
    Class.emissSD.UPGRADES_TIER_0 = ['molecSD'];
    Class.reflSD.UPGRADES_TIER_0 = ['starFormSD'];
    Class.darkNebSD.UPGRADES_TIER_0 = ['dustLaneSD'];
    Class.protoNeSD.UPGRADES_TIER_0 = ['shockwaveSD'];
    Class.pillarsSD.UPGRADES_TIER_0 = ['nebulaBlastSD'];
    Class.molecSD.UPGRADES_TIER_0 = ['nebCoreSD'];
    Class.starFormSD.UPGRADES_TIER_0 = ['protostarSD'];
    Class.dustLaneSD.UPGRADES_TIER_0 = ['stellarNursSD'];
    Class.shockwaveSD.UPGRADES_TIER_0 = ['dustStormSD'];
    Class.nebulaBlastSD.UPGRADES_TIER_0 = ['nebulaCrushSD'];
    Class.nebCoreSD.UPGRADES_TIER_0 = [];
    Class.protostarSD.UPGRADES_TIER_0 = [];
    Class.stellarNursSD.UPGRADES_TIER_0 = [];
    Class.dustStormSD.UPGRADES_TIER_0 = [];
    Class.nebulaCrushSD.UPGRADES_TIER_0 = [];

    // Plasma tree
    Class.plasmaSD.UPGRADES_TIER_0 = ['ionSD', 'magSD', 'fieldSD', 'sheathSD', 'vortexSD'];
    Class.ionSD.UPGRADES_TIER_0 = ['crystalTSD'];
    Class.magSD.UPGRADES_TIER_0 = ['shieldTSD'];
    Class.fieldSD.UPGRADES_TIER_0 = ['cageTSD'];
    Class.sheathSD.UPGRADES_TIER_0 = ['sphereSD'];
    Class.vortexSD.UPGRADES_TIER_0 = ['torusSD'];
    Class.crystalTSD.UPGRADES_TIER_0 = ['fusionTSD'];
    Class.shieldTSD.UPGRADES_TIER_0 = ['confineTSD'];
    Class.cageTSD.UPGRADES_TIER_0 = ['magnetCSD'];
    Class.sphereSD.UPGRADES_TIER_0 = ['pinchSD'];
    Class.torusSD.UPGRADES_TIER_0 = ['tokamakSD'];
    Class.fusionTSD.UPGRADES_TIER_0 = [];
    Class.confineTSD.UPGRADES_TIER_0 = [];
    Class.magnetCSD.UPGRADES_TIER_0 = [];
    Class.pinchSD.UPGRADES_TIER_0 = [];
    Class.tokamakSD.UPGRADES_TIER_0 = [];

    // Mega combination finals — upgrades from select T4 finals
    Class.xClassSD.UPGRADES_TIER_0 = ['solarSystemSD'];
    Class.solarSystemSD.UPGRADES_TIER_0 = [];
    Class.solarMaxSD.UPGRADES_TIER_0 = ['cosmicSunSD'];
    Class.cosmicSunSD.UPGRADES_TIER_0 = [];
    Class.helioBlastSD.UPGRADES_TIER_0 = ['stellarCoreSD'];
    Class.stellarCoreSD.UPGRADES_TIER_0 = [];
    Class.spacetimeSD.UPGRADES_TIER_0 = ['starClusterSD'];
    Class.starClusterSD.UPGRADES_TIER_0 = [];
    Class.longPeriodSD.UPGRADES_TIER_0 = ['cosmosSD'];
    Class.cosmosSD.UPGRADES_TIER_0 = [];
    Class.pinchSD.UPGRADES_TIER_0 = ['sunGodSD'];
    Class.sunGodSD.UPGRADES_TIER_0 = [];
    Class.nebulaCrushSD.UPGRADES_TIER_0 = ['supernovaSD'];
    Class.supernovaSD.UPGRADES_TIER_0 = [];
    Class.dustStormSD.UPGRADES_TIER_0 = ['hypernovaSD'];
    Class.hypernovaSD.UPGRADES_TIER_0 = [];
    Class.radfluxSD.UPGRADES_TIER_0 = ['heliosPrimeSD'];
    Class.heliosPrimeSD.UPGRADES_TIER_0 = [];
    Class.tokamakSD.UPGRADES_TIER_0 = ['universalSD'];
    Class.universalSD.UPGRADES_TIER_0 = [];

    // Galaxians — accessible from the top mega-finals
    Class.milkyWaySD.UPGRADES_TIER_0 = [];
    Class.andromedaSD.UPGRADES_TIER_0 = [];
    Class.whirlpoolSD.UPGRADES_TIER_0 = [];
    Class.sombreroSD.UPGRADES_TIER_0 = [];
    Class.ringNebulaSD.UPGRADES_TIER_0 = [];
    Class.crabNebulaSD.UPGRADES_TIER_0 = [];
    Class.blackHoleGalSD.UPGRADES_TIER_0 = [];
    Class.helixSD.UPGRADES_TIER_0 = [];
    Class.starburstGalSD.UPGRADES_TIER_0 = [];
    Class.collisionGalSD.UPGRADES_TIER_0 = [];

    // Body tree
    Class.bodyRootSD.UPGRADES_TIER_0 = ['mercurySD', 'venusSD', 'earthSD', 'marsSD', 'ioSD', 'europaSD', 'titanSD', 'tritonSD'];
    Class.mercurySD.UPGRADES_TIER_0 = ['jupiterSD'];
    Class.venusSD.UPGRADES_TIER_0 = ['saturnBodySD'];
    Class.earthSD.UPGRADES_TIER_0 = ['uranusSD'];
    Class.marsSD.UPGRADES_TIER_0 = ['neptuneSD'];
    Class.ioSD.UPGRADES_TIER_0 = ['plutoSD'];
    Class.europaSD.UPGRADES_TIER_0 = ['ceresSD'];
    Class.titanSD.UPGRADES_TIER_0 = ['erisSD'];
    Class.tritonSD.UPGRADES_TIER_0 = ['makemakeSD'];
    Class.jupiterSD.UPGRADES_TIER_0 = ['theSunSD'];
    Class.saturnBodySD.UPGRADES_TIER_0 = ['blackHoleBodySD'];
    Class.uranusSD.UPGRADES_TIER_0 = ['neutronStarSD'];
    Class.neptuneSD.UPGRADES_TIER_0 = ['pulsarBodySD'];
    Class.plutoSD.UPGRADES_TIER_0 = ['redGiantSD'];
    Class.ceresSD.UPGRADES_TIER_0 = ['whiteDwarfSD'];
    Class.erisSD.UPGRADES_TIER_0 = ['darkMatterSD'];
    Class.makemakeSD.UPGRADES_TIER_0 = ['quasarBodySD'];
    Class.theSunSD.UPGRADES_TIER_0 = ['milkyWaySD'];
    Class.blackHoleBodySD.UPGRADES_TIER_0 = ['andromedaSD'];
    Class.neutronStarSD.UPGRADES_TIER_0 = ['whirlpoolSD'];
    Class.pulsarBodySD.UPGRADES_TIER_0 = ['sombreroSD'];
    Class.redGiantSD.UPGRADES_TIER_0 = ['ringNebulaSD'];
    Class.whiteDwarfSD.UPGRADES_TIER_0 = ['crabNebulaSD'];
    Class.darkMatterSD.UPGRADES_TIER_0 = ['blackHoleGalSD'];
    Class.quasarBodySD.UPGRADES_TIER_0 = ['helixSD'];

    // ── Hook into addons menu ─────────────────────────────────────────────────
    const _entrySD = ['menu_addons','addons']
        .find(n => Class[n] && Array.isArray(Class[n].UPGRADES_TIER_0));
    if (_entrySD) {
        Class[_entrySD].UPGRADES_TIER_0.push('dreadSD');
        console.log('[solarDreads] Connected to ' + _entrySD);
    } else {
        console.warn('[solarDreads] Could not find addons menu — connect dreadSD manually.');
    }

    const sdCount = Object.keys(Class).filter(k=>k.endsWith('SD')).length;
    console.log('[solarDreads] Loaded ' + sdCount + ' Solar Dread classes. Entry: dreadSD');
};