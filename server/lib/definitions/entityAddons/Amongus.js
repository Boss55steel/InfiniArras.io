// ============================================================
//  AMONG US CREWMATES  —  OSA compatible
//  SVG crewmate, invisible base, homing sus missile
// ============================================================

const { combineStats } = require('../facilitators.js');
const _constants = require('../constants.js');
const g = require('../gunvals.js');

// Safe gunval shims — define anything that might be missing
if (!g.basic)      g.basic      = { reload:1,    recoil:1,   speed:1,   maxSpeed:1,   size:1,    damage:1,  pen:1, health:1, range:1,  spray:3,  shudder:0 };
if (!g.mach)       g.mach       = { speed:1.5,   maxSpeed:1.5, reload:0.5 };
if (!g.power)      g.power      = { damage:1.5,  pen:1.5,    health:1.5 };
if (!g.morerecoil) g.morerecoil = { recoil:1.6 };

module.exports = ({ Class }) => {
    console.log('[AMONG US] Addon loading...');

    // ── SVG body part classes ─────────────────────────────────────────────────
    Class.OSAmongus_basebody = {
        PARENT: ['genericTank'], LABEL: '', GUNS: [], TURRETS: [],
        SHAPE: 'M -0.731 1.979 Q -1.279 -2.215 -0.005 -2.244 Q 1.635 -2.31 1.485 0 Q 1.415 1.801 0.992 1.822 Q 0.599 1.847 0.591 1.342 Q 0.888 1.29 1.078 1.056 Q 0.551 1.132 0.03 1.073 L -0.008 1.871 Q -0.304 2.162 -0.727 1.982',
    };
    Class.OSAmongus_basebodyshadow = {
        PARENT: ['genericTank'], LABEL: '', BORDERLESS: true, GUNS: [], TURRETS: [],
        SHAPE: 'M 0.431 0.765 C -0.809 0.861 -0.8 -0.981 -0.573 -1.968 C -0.451 -2.449 1.348 -2.396 1.331 -1.051 C 1.829 0.495 0.85 0.826 0.423 0.774',
    };
    Class.OSAmongus_backpack = {
        PARENT: ['genericTank'], LABEL: '', GUNS: [], TURRETS: [],
        SHAPE: 'M -0.6 0.9 L -1 1 Q -1.615 1.258 -1.567 -0.014 Q -1.581 -1.214 -1.094 -1.014 L -1.095 -1.009 L -0.7 -0.9',
    };
    Class.OSAmongus_backpackshadow = {
        PARENT: ['genericTank'], LABEL: '', BORDERLESS: true, GUNS: [], TURRETS: [],
        SHAPE: 'M -1.11 -0.781 C -1.125 -0.812 -1.481 -0.806 -1.532 -0.734 C -1.507 -0.874 -1.517 -1.033 -1.316 -1.033 C -1.073 -1.069 -1.053 -1.028 -1.11 -0.791',
    };
    Class.OSAmongus_visor = {
        PARENT: ['genericTank'], LABEL: '', GUNS: [], TURRETS: [],
        SHAPE: 'M 0.004 -1.131 C -0.007 -0.231 1.655 -0.524 1.649 -1.097 C 1.741 -1.807 0.027 -1.962 -0.001 -1.131',
    };
    Class.OSAmongus_visorshadow = {
        PARENT: ['genericTank'], LABEL: '', BORDERLESS: true, GUNS: [], TURRETS: [],
        SHAPE: 'M 0.178 -1.402 C 0.05 -0.851 1.667 -0.668 1.642 -1.374 C 1.654 -1.609 0.251 -1.785 0.175 -1.411',
    };
    Class.OSAmongus_visorhighlight = {
        PARENT: ['genericTank'], LABEL: '', BORDERLESS: true, GUNS: [], TURRETS: [],
        SHAPE: 'M 0.3 -1.5 C 0.18 -1.05 0.85 -0.82 0.95 -1.25 C 0.96 -1.5 0.42 -1.68 0.3 -1.5',
    };

    // ── Missile SVG — nose cone + body + 4 fins ───────────────────────────────
    const MISSILE_SHAPE =
        'M 0 -1 L 0.13 -0.5 L 0.13 0.25 L -0.13 0.25 L -0.13 -0.5 Z ' +
        'M 0.13 -0.5 L 0.2 -0.25 L 0.2 0.55 L -0.2 0.55 L -0.2 -0.25 L -0.13 -0.5 Z ' +
        'M -0.2 0.2 L -0.6 0.8 L -0.6 1.0 L -0.2 0.7 Z ' +
        'M 0.2 0.2 L 0.6 0.8 L 0.6 1.0 L 0.2 0.7 Z ' +
        'M -0.08 0.55 L -0.08 1.0 L 0.08 1.0 L 0.08 0.55 Z';

    // ── Sus missile — homing bullet with thruster + big damage ────────────────
    Class.OSAmongus_susMissile = {
        PARENT: ['bullet'],
        LABEL: 'sus',
        INDEPENDENT: true,
        COLOR: 3,
        SHAPE: MISSILE_SHAPE,
        // Homing: track nearest enemy
        CONTROLLERS: ['nearestDifferentMaster'],
        FACING_TYPE: 'smoothToTarget',
        BODY: {
            SPEED: 3.5,
            ACCELERATION: 0.08,
            HEALTH: 10,
            DAMAGE: 60,
            PENETRATION: 4,
            RANGE: 500,
            DENSITY: 0.6,
        },
        // Thruster gun — fires backward to push missile forward
        GUNS: [{
            POSITION: [4, 3.5, 1, 0, 0, 180, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, {
                    reload: 0.1,
                    recoil: 10,
                    speed: 4,
                    maxSpeed: 4,
                    size: 0.3,
                    damage: 0.001,
                    pen: 0.001,
                    health: 0.001,
                    range: 0.08,
                    spray: 5,
                    shudder: 0,
                }]),
                TYPE: ['bullet', { COLOR: 6, ALPHA: 0.65, BORDERLESS: true }],
                AUTOFIRE: true,
            },
        }],
    };

    // ── Sus explosion bullet — spawned on impact, fans outward ────────────────
    // Instead of runtime Entity creation (which crashes), we use a pre-defined
    // explosion class that the missile spawns via a SHOOT_ON_DEATH gun trick.
    // We achieve this by making the missile spawn a spread of fast heavy bullets
    // using a second gun that fires all at once on spawn.
    Class.OSAmongus_blastBullet = {
        PARENT: ['bullet'],
        LABEL: '',
        COLOR: 3,
        INDEPENDENT: true,
        BODY: {
            SPEED: 6,
            HEALTH: 2,
            DAMAGE: 40,
            PENETRATION: 3,
            RANGE: 80,
            DENSITY: 0.2,
        },
        GUNS: [],
    };

    // ── Add explosion guns to the missile (fire on spawn = instant burst) ─────
    // 12 blast bullets spread in all directions for the explosion effect
    for (let i = 0; i < 12; i++) {
        Class.OSAmongus_susMissile.GUNS.push({
            POSITION: [2, 2, 1, 0, 0, i * 30, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, {
                    reload: 999,   // only fires once on spawn effectively
                    recoil: 0.5,
                    speed: 6,
                    maxSpeed: 6,
                    size: 1.2,
                    damage: 40,
                    pen: 3,
                    health: 2,
                    range: 0.5,
                    spray: 0,
                    shudder: 0,
                }]),
                TYPE: 'OSAmongus_blastBullet',
                AUTOFIRE: true,
            },
        });
    }

    // ── Crewmate base ─────────────────────────────────────────────────────────
    Class.OSAmongus_crewmatebase = {
        PARENT: ['genericTank'],
        LABEL: 'Among Us',
        SHAPE: [[0,0],[0,0],[0,0]],   // degenerate triangle — effectively invisible
        BORDERLESS: true,
        COLOR: 12,
        SIZE: 18,
        // The hidden sus gun — zero-length barrel, invisible, auto-fires missiles
        GUNS: [{
            POSITION: [0, 0.001, 1, 0, 0, 0, 0],  // near-zero size = invisible
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, {
                    reload: 4,
                    recoil: 0,
                    speed: 4,
                    maxSpeed: 4,
                    size: 1.3,
                    damage: 60,
                    pen: 4,
                    health: 10,
                    range: 4.5,
                    spray: 0,
                    shudder: 0,
                }]),
                TYPE: 'OSAmongus_susMissile',
                AUTOFIRE: true,
                SYNCS_SKILLS: false,
            },
        }],
        TURRETS: [
            { POSITION:[10,0,0,0,0,1], TYPE:['OSAmongus_backpack',       {MIRROR_MASTER_ANGLE:true, COLOR:{BASE:-1,BRIGHTNESS_SHIFT:-15}}] },
            { POSITION:[10,0,0,0,0,1], TYPE:['OSAmongus_backpackshadow', {MIRROR_MASTER_ANGLE:true, COLOR:{BASE:-1,BRIGHTNESS_SHIFT:0}}] },
            { POSITION:[10,0,0,0,0,1], TYPE:['OSAmongus_basebody',       {MIRROR_MASTER_ANGLE:true, COLOR:{BASE:-1,BRIGHTNESS_SHIFT:-15}}] },
            { POSITION:[10,0,0,0,0,1], TYPE:['OSAmongus_basebodyshadow', {MIRROR_MASTER_ANGLE:true, COLOR:{BASE:-1,BRIGHTNESS_SHIFT:0}}] },
            { POSITION:[10,0,0,0,0,1], TYPE:['OSAmongus_visor',          {MIRROR_MASTER_ANGLE:true, COLOR:{BASE:10,BRIGHTNESS_SHIFT:-15}}] },
            { POSITION:[10,0,0,0,0,1], TYPE:['OSAmongus_visorshadow',    {MIRROR_MASTER_ANGLE:true, COLOR:{BASE:10,BRIGHTNESS_SHIFT:0}}] },
            { POSITION:[5,2.75,-4,0,0,1], TYPE:['OSAmongus_visorhighlight',{MIRROR_MASTER_ANGLE:true,COLOR:{BASE:8,BRIGHTNESS_SHIFT:0}}] },
        ],
        UPGRADES_TIER_0: [],
    };

    // ── 16 color variants ─────────────────────────────────────────────────────
    const COLORS = [
        'red','orange','gold','brown','green','blue','cyan','teal',
        'pink','purple','magenta','white','gray',
        'animatedLesbian','animatedTrans','rainbow',
    ];
    for (const color of COLORS) {
        const n = `OSAmongus_${color}crewmate`;
        Class[n] = {
            PARENT: ['OSAmongus_crewmatebase'],
            LABEL: `${color.charAt(0).toUpperCase()+color.slice(1)} Crewmate`,
            COLOR: color,
        };
        Class.OSAmongus_crewmatebase.UPGRADES_TIER_0.push(n);
    }

    // ── Menu entry ────────────────────────────────────────────────────────────
    Class.OSAmongus_menu = {
        PARENT: ['genericTank'],
        LABEL: 'Among Us',
        UPGRADE_LABEL: 'Among Us',
        COLOR: 12, SIZE: 16,
        GUNS: [], TURRETS: [],
        UPGRADES_TIER_0: ['OSAmongus_crewmatebase'],
    };

    const _entry = ['menu_addons','addons','developer']
        .find(n => Class[n] && Array.isArray(Class[n].UPGRADES_TIER_0));
    if (_entry) {
        Class[_entry].UPGRADES_TIER_0.push('OSAmongus_menu');
        console.log(`[Among Us] Connected to ${_entry}.`);
    } else {
        console.warn('[Among Us] Could not find addons menu — connect OSAmongus_menu manually.');
    }

    console.log(`[Among Us] ${COLORS.length} crewmates loaded. Missiles armed. 🚀`);
};