
const { combineStats } = require('../facilitators.js');
const _facs = require('../facilitators.js');
const _constants = require('../constants.js');
const { base, statnames, dfltskl, smshskl } = _constants;
const g = require('../gunvals.js');
const safeCS = stats => combineStats(stats.filter(s => s != null));
const weaponArray = _facs.weaponArray || ((weapon, count) => {
    const arr = Array.isArray(weapon) ? weapon : [weapon];
    if (!count || count === 1) return arr;
    const out = [];
    for (let i = 0; i < count; i++) {
        const rot = (360 / count) * i;
        for (const w of arr) {
            const c = JSON.parse(JSON.stringify(w));
            if (c.POSITION && Array.isArray(c.POSITION)) c.POSITION[5] = (c.POSITION[5]||0) + rot;
            out.push(c);
        }
    }
    return out;
});
const makeTurret = _facs.makeTurret || ((def, opts={}) => ({
    PARENT:['genericTank'], LABEL:opts.label||'', INDEPENDENT:true,
    BODY:{FOV:opts.fov||3},
    CONTROLLERS:['canRepel','onlyAcceptInArc','mapAltToFire','nearestDifferentMaster'],
    COLOR:opts.color||'grey', GUNS:def.GUNS||[], TURRETS:def.TURRETS||[],
}));

// ── Gunval shims ────────────────────────────────────────────────────────────
if (!g.noRecoil)   g.noRecoil   = { recoil: 0 };
if (!g.hexaTrapper)g.hexaTrapper= { reload:0.7, health:1.5, speed:0.3, maxSpeed:0.3 };
if (!g.pounder)    g.pounder    = { reload:1.5, recoil:1.4, speed:0.65, maxSpeed:0.65, size:1.25, damage:1.5 };
if (!g.summoner)   g.summoner   = { reload:3, speed:0.5, maxSpeed:0.5, health:3, damage:3, size:1.5 };

// ── Shared constants (mirror celestia pattern) ──────────────────────────────
const _cGs  = { damage:1.4, health:1.5, reload:1.1, speed:1.2 }; // celestialGuns equiv
const _cSz  = { size: 0.8*(2/4.5) };                             // celestialSize equiv
const _eSz  = { size: 0.8*(2/6) };                               // eternalSize equiv
const l0S   = 6, l1S = 7, l2S = 8.5;

module.exports = ({ Class }) => {
    console.log('[celestia2] Loading...');

// ══════════════════════════════════════════════════════════════════════════════
//  SPECIAL PROJECTILE CLASSES
// ══════════════════════════════════════════════════════════════════════════════

    // Nova burst bullet — expands and deals area damage
    Class.novaBurst_C2 = {
        PARENT: ['bullet'],
        LABEL: 'Nova',
        INDEPENDENT: true,
        COLOR: 'lightBlue',
        BODY: { SPEED:2, HEALTH:5, DAMAGE:8, PENETRATION:6, RANGE:180, DENSITY:0.5 },
        GUNS: weaponArray({
            POSITION:[3,5,1,0,0,0,0],
            PROPERTIES:{
                SHOOT_SETTINGS: safeCS([g.basic,{reload:0.8,damage:0.5,speed:1.8,range:0.4,spray:0}]),
                TYPE:'bullet', AUTOFIRE:true,
            },
        }, 8),
    };

    // Voidrift bullet — dark, heavy, leaves a trail
    Class.voidBullet_C2 = {
        PARENT: ['bullet'],
        LABEL: '',
        COLOR: 'darkGrey',
        BODY: { SPEED:3.5, HEALTH:12, DAMAGE:15, PENETRATION:8, RANGE:300, DENSITY:1.5 },
        GUNS: [],
    };

    // Starfire missile — homing, fast, explodes
    Class.starfireMissile_C2 = {
        PARENT: ['missile'],
        LABEL: 'Starfire',
        COLOR: 'gold',
        FACING_TYPE: ['smoothToTarget'],
        CONTROLLERS: ['nearestDifferentMaster'],
        BODY: { SPEED:5, HEALTH:8, DAMAGE:12, PENETRATION:5, RANGE:400, DENSITY:0.4 },
        GUNS: [{
            POSITION:[12,6,1,0,0,180,0],
            PROPERTIES:{
                SHOOT_SETTINGS: safeCS([g.basic,{reload:0.1,recoil:8,speed:4,damage:0.001,range:0.1,spray:4}]),
                TYPE:['bullet',{PERSISTS_AFTER_DEATH:true}],
                STAT_CALCULATOR:'thruster', AUTOFIRE:true,
            },
        }],
    };

    // Plasma orb — slow, enormous, huge health
    Class.plasmaOrb_C2 = {
        PARENT: ['bullet'],
        LABEL: 'Plasma',
        COLOR: 'magenta',
        BODY: { SPEED:1.2, HEALTH:35, DAMAGE:20, PENETRATION:15, RANGE:220, DENSITY:4 },
        GUNS: [],
    };

    // Shockwave ring — pure radius damage
    Class.shockwaveRing_C2 = {
        PARENT: ['bullet'],
        LABEL: '',
        COLOR: 'white',
        SHAPE: 0,
        INDEPENDENT: true,
        BODY: { SPEED:0, HEALTH:1, DAMAGE:25, PENETRATION:12, RANGE:5, DENSITY:0.1 },
        GUNS: weaponArray({
            POSITION:[0,30,0.3,0,0,0,0],
            PROPERTIES:{
                SHOOT_SETTINGS: safeCS([g.basic,{reload:0.2,damage:0.4,speed:2.5,range:0.7,spray:0,health:0.5}]),
                TYPE:'bullet', AUTOFIRE:true,
            },
        }, 16),
    };

// ══════════════════════════════════════════════════════════════════════════════
//  MINI-BOSS
// ══════════════════════════════════════════════════════════════════════════════

    Class.miniCelestial_C2 = {
        PARENT: ['miniboss'],
        LABEL: 'Mini-Celestial',
        TYPE: 'tank',
        IGNORED_BY_AI: false,
        SKILL: [12,12,12,12,12,12,12,12,12,12],
        UPGRADE_COLOR: 'mirror',
        VALUE: 3e5,
        SHAPE: 7,
        DANGER: 18,
        SIZE: 28,
        CONTROLLERS: [['minion',{orbit:160}]],
        FACING_TYPE: ['spin',{speed:0.035}],
        BODY: {
            FOV:1, HEALTH:300, SHIELD:60,
            REGEN: base.REGEN*0.12,
            SPEED: base.SPEED*0.55,
            DAMAGE:4,
        },
        BROADCAST_MESSAGE: 'A Mini-Celestial has been vanquished!',
        GUNS: [],
    };

    // ── Comet (mini-boss 1) — high speed, sniper beams ────────────────────
    Class.comet_lowTurret_C2 = {
        PARENT: ['autoTurret'], LABEL:'Comet Beam', INDEPENDENT:true,
        BODY:{ FOV: base.FOV*1.3 },
        GUNS:[
            { POSITION:[22,6,1,0,0,0,0],
              PROPERTIES:{ SHOOT_SETTINGS:safeCS([g.basic,g.sniper,{damage:1.3,speed:1.4,reload:1.2},_cGs,g.noRecoil]), TYPE:'bullet' } },
            { POSITION:[18,10,1,0,0,0,0.4],
              PROPERTIES:{ SHOOT_SETTINGS:safeCS([g.basic,g.sniper,{damage:1.1,speed:1.3,reload:1.1},_cGs,g.noRecoil]), TYPE:'bullet' } },
        ],
    };
    Class.comet_C2 = {
        PARENT: ['miniCelestial_C2'],
        LABEL: 'Comet', COLOR: '#88ccff',
        SIZE: 26,
        BODY:{ SPEED: base.SPEED*0.7, HEALTH:250, SHIELD:40, DAMAGE:3 },
        BROADCAST_MESSAGE: 'A Comet flashed past...',
        TURRETS:[
            { POSITION:[l1S,7,0,0,180,0], TYPE:'comet_lowTurret_C2' },
            { POSITION:[l1S,7,0,120,180,0], TYPE:'comet_lowTurret_C2' },
            { POSITION:[l1S,7,0,240,180,0], TYPE:'comet_lowTurret_C2' },
        ],
    };

    // ── Pulsar (mini-boss 2) — rapid fire gunner ───────────────────────────
    Class.pulsar_turret_C2 = {
        PARENT: ['autoTurret'], LABEL:'Pulse Cannon', INDEPENDENT:true,
        BODY:{ FOV: base.FOV*1.2 },
        GUNS: weaponArray({
            POSITION:[14,4,1,0,0,0,0],
            PROPERTIES:{ SHOOT_SETTINGS:safeCS([g.basic,g.minigun,{damage:1.2,reload:0.6,speed:1.3},_cGs,g.noRecoil]), TYPE:'bullet' },
        }, 3),
    };
    Class.pulsar_C2 = {
        PARENT: ['miniCelestial_C2'],
        LABEL: 'Pulsar', COLOR: '#ff9966',
        BODY:{ HEALTH:280, SHIELD:50, DAMAGE:4 },
        BROADCAST_MESSAGE: 'The Pulsar fades...',
        GUNS: weaponArray({
            POSITION:[14,5,1,0,0,0,0],
            PROPERTIES:{ SHOOT_SETTINGS:safeCS([g.basic,g.minigun,{reload:0.5,spray:1},_cGs,g.noRecoil]), TYPE:'bullet', AUTOFIRE:true },
        }, 7),
        TURRETS:[{ POSITION:[l1S,7,0,0,180,0], TYPE:'pulsar_turret_C2' }],
    };

    // ── Void Shard (mini-boss 3) — trap layer fortress ────────────────────
    Class.voidShard_C2 = {
        PARENT: ['miniCelestial_C2'],
        LABEL: 'Void Shard', COLOR: '#553377',
        BODY:{ HEALTH:350, SHIELD:80, SPEED: base.SPEED*0.4, DAMAGE:5 },
        BROADCAST_MESSAGE: 'A Void Shard shatters into darkness...',
        GUNS: weaponArray([
            { POSITION:[12,4,1,0,0,180,0] },
            { POSITION:[1.5,4,1.6,12,0,180,0],
              PROPERTIES:{ SHOOT_SETTINGS:safeCS([g.trap,g.pounder,g.hexaTrapper,{reload:1.4,damage:1.5,health:1.5},g.noRecoil]),
                TYPE:'trap', STAT_CALCULATOR:'trap', AUTOFIRE:true } },
        ], 7),
    };

    // ── Flare Knight (mini-boss 4) — launcher + bullet combo ──────────────
    Class.flareKnight_turret_C2 = {
        PARENT: ['autoTurret'], LABEL:'Flare Lance', INDEPENDENT:true,
        BODY:{ FOV: base.FOV*1.1 },
        GUNS:[
            { POSITION:[16,10,1,0,0,0,0],
              PROPERTIES:{ SHOOT_SETTINGS:safeCS([g.basic,g.pounder,{damage:1.4,reload:1.3,speed:0.8},_cGs,g.noRecoil]),
                TYPE:'starfireMissile_C2', STAT_CALCULATOR:'sustained' } },
        ],
    };
    Class.flareKnight_C2 = {
        PARENT: ['miniCelestial_C2'],
        LABEL: 'Flare Knight', COLOR: '#ffaa33',
        BODY:{ HEALTH:320, SHIELD:55, DAMAGE:5 },
        BROADCAST_MESSAGE: 'The Flare Knight has fallen!',
        TURRETS:[
            { POSITION:[l1S,7,0,0,180,0], TYPE:'flareKnight_turret_C2' },
            { POSITION:[l1S,7,0,72,180,0], TYPE:'flareKnight_turret_C2' },
            { POSITION:[l1S,7,0,144,180,0], TYPE:'flareKnight_turret_C2' },
            { POSITION:[l1S,7,0,216,180,0], TYPE:'flareKnight_turret_C2' },
            { POSITION:[l1S,7,0,288,180,0], TYPE:'flareKnight_turret_C2' },
        ],
    };

    // ── Nebula Wisp (mini-boss 5) — drone cloud ───────────────────────────
    Class.nebulaWisp_C2 = {
        PARENT: ['miniCelestial_C2'],
        LABEL: 'Nebula Wisp', COLOR: '#66bbff',
        BODY:{ HEALTH:200, SHIELD:90, SPEED: base.SPEED*0.65, DAMAGE:3 },
        BROADCAST_MESSAGE: 'The Nebula Wisp dissipates...',
        GUNS: weaponArray({
            POSITION:[5,8,1.2,8,0,0,0],
            PROPERTIES:{
                SHOOT_SETTINGS:safeCS([g.drone,g.summoner,{health:1.3,damage:1.2,size:1.1},_cGs,g.noRecoil]),
                TYPE:['drone',{INDEPENDENT:true}], AUTOFIRE:true, SYNCS_SKILLS:true,
                STAT_CALCULATOR:'drone', WAIT_TO_CYCLE:true, MAX_CHILDREN:4,
            },
        }, 4),
    };

    // ── Storm Eye (mini-boss 6) — spinning destroyer ───────────────────────
    Class.stormEye_C2 = {
        PARENT: ['miniCelestial_C2'],
        LABEL: 'Storm Eye', COLOR: '#aaddff',
        FACING_TYPE: ['spin',{speed:0.07}],
        BODY:{ HEALTH:260, SHIELD:45, DAMAGE:6 },
        BROADCAST_MESSAGE: 'The Storm Eye has been quelled!',
        GUNS: weaponArray({
            POSITION:[18,12,1,0,0,0,0],
            PROPERTIES:{ SHOOT_SETTINGS:safeCS([g.basic,g.pounder,{reload:1.5,damage:1.6,size:1.3},_cGs,g.noRecoil]),
                TYPE:'bullet', AUTOFIRE:true },
        }, 5),
    };

// ══════════════════════════════════════════════════════════════════════════════
//  FULL CELESTIALS (9-sided, size 45)
// ══════════════════════════════════════════════════════════════════════════════

    // ── Selene — moonbeam celestial, precision + healing aura ─────────────
    Class.selene_innerTurret_C2 = {
        PARENT:['autoTurret'], LABEL:'Moonbeam', INDEPENDENT:true,
        BODY:{ FOV: base.FOV*1.4 },
        GUNS:[
            { POSITION:[26,7,1,0,0,0,0],
              PROPERTIES:{ SHOOT_SETTINGS:safeCS([g.basic,g.sniper,{reload:1.4,damage:1.3,speed:1.5,pen:1.2},_cGs,g.noRecoil]), TYPE:'bullet' } },
            { POSITION:[22,11,1,0,0,0,0.2],
              PROPERTIES:{ SHOOT_SETTINGS:safeCS([g.basic,g.sniper,{reload:1.3,damage:1.1,speed:1.4},_cGs,g.noRecoil]), TYPE:'bullet' } },
        ],
    };
    Class.selene_outerTurret_C2 = {
        PARENT:['autoTurret'], LABEL:'Lunar Pulse', INDEPENDENT:true,
        BODY:{ FOV: base.FOV*1.2 },
        GUNS: weaponArray({
            POSITION:[14,4,1,0,0,0,0],
            PROPERTIES:{ SHOOT_SETTINGS:safeCS([g.basic,{reload:0.6,speed:1.3,damage:0.8},_cGs,g.noRecoil]), TYPE:'bullet' },
        }, 4),
    };
    Class.selene_C2 = {
        PARENT:['celestial_CLSTL'],
        LABEL:'Selene', COLOR:'#c8e8ff',
        UPGRADE_COLOR:'#c8e8ff',
        BROADCAST_MESSAGE:'Selene, the Moon Celestial, retreats into the dark...',
        TURRETS:[
            ...Array.from({length:9},(_,i)=>({ POSITION:[l1S,7.5,0,i*40,180,0], TYPE:'selene_innerTurret_C2' })),
            ...Array.from({length:9},(_,i)=>({ POSITION:[l2S,8.5,0,i*40+20,180,0], TYPE:'selene_outerTurret_C2' })),
        ],
    };

    // ── Vulcan — volcanic celestial, destroyer + plasma bombs ─────────────
    Class.vulcan_barrelTurret_C2 = {
        PARENT:['autoTurret'], LABEL:'Magma Cannon', INDEPENDENT:true,
        BODY:{ FOV: base.FOV*1.1 },
        GUNS:[
            { POSITION:[20,14,1,0,0,0,0],
              PROPERTIES:{ SHOOT_SETTINGS:safeCS([g.basic,g.pounder,{reload:1.6,damage:1.8,size:1.4},_cGs,g.noRecoil]), TYPE:'bullet' } },
            { POSITION:[16,11,-1.15,0,0,0,0],
              PROPERTIES:{ SHOOT_SETTINGS:safeCS([g.basic,g.pounder,{damage:0.001},g.noRecoil]), TYPE:'bullet', BORDERLESS:true } },
        ],
    };
    Class.vulcan_bombTurret_C2 = {
        PARENT:['autoTurret'], LABEL:'Ember Launch', INDEPENDENT:true,
        BODY:{ FOV: base.FOV*1.0 },
        GUNS:[
            { POSITION:[14,10,1,0,0,0,0],
              PROPERTIES:{ SHOOT_SETTINGS:safeCS([g.basic,g.pounder,{reload:1.4,damage:1.3,speed:0.9},_cGs,g.noRecoil]),
                TYPE:'novaBurst_C2', STAT_CALCULATOR:'sustained' } },
        ],
    };
    Class.vulcan_C2 = {
        PARENT:['celestial_CLSTL'],
        LABEL:'Vulcan', COLOR:'#ff5533',
        UPGRADE_COLOR:'#ff5533',
        BROADCAST_MESSAGE:'Vulcan erupts in a final inferno!',
        TURRETS:[
            ...Array.from({length:9},(_,i)=>({ POSITION:[l1S,7.5,0,i*40,180,0], TYPE:'vulcan_barrelTurret_C2' })),
            ...Array.from({length:9},(_,i)=>({ POSITION:[l2S,8.5,0,i*40+20,180,0], TYPE:'vulcan_bombTurret_C2' })),
        ],
    };

    // ── Zephyr — wind celestial, rapid spread + missiles ─────────────────
    Class.zephyr_spreadTurret_C2 = {
        PARENT:['autoTurret'], LABEL:'Gust', INDEPENDENT:true,
        BODY:{ FOV: base.FOV*1.15 },
        GUNS:[
            ...[-16,-8,0,8,16].map((off,i)=>({
                POSITION:[14,4.5,1,0,0,0,i*0.1],
                PROPERTIES:{ SHOOT_SETTINGS:safeCS([g.basic,{spray:3+Math.abs(off)*0.3,reload:0.55,damage:0.9},_cGs,g.noRecoil]),
                    TYPE:'bullet' },
            })),
        ],
    };
    Class.zephyr_missileTurret_C2 = {
        PARENT:['autoTurret'], LABEL:'Windlance', INDEPENDENT:true,
        BODY:{ FOV: base.FOV*1.2 },
        GUNS:[
            { POSITION:[18,9,1,0,0,0,0],
              PROPERTIES:{ SHOOT_SETTINGS:safeCS([g.basic,{reload:1.5,speed:1.3,damage:1.4},_cGs,g.noRecoil]),
                TYPE:'starfireMissile_C2', STAT_CALCULATOR:'sustained' } },
        ],
    };
    Class.zephyr_C2 = {
        PARENT:['celestial_CLSTL'],
        LABEL:'Zephyr', COLOR:'#99eebb',
        UPGRADE_COLOR:'#99eebb',
        BODY:{ SPEED: base.SPEED*0.38 },
        BROADCAST_MESSAGE:'The winds of Zephyr calm at last...',
        TURRETS:[
            ...Array.from({length:9},(_,i)=>({ POSITION:[l1S,7.5,0,i*40,180,0], TYPE:'zephyr_spreadTurret_C2' })),
            ...Array.from({length:9},(_,i)=>({ POSITION:[l2S,8.5,0,i*40+20,180,0], TYPE:'zephyr_missileTurret_C2' })),
        ],
    };

    Class.abyss_droneTurret_C2 = {
        PARENT:['autoTurret'], LABEL:'Voidspawn', INDEPENDENT:true,
        BODY:{ FOV: base.FOV*1.0 },
        GUNS:[{
            POSITION:[6,10,1.2,8,0,0,0],
            PROPERTIES:{
                SHOOT_SETTINGS:safeCS([g.drone,g.summoner,{health:1.6,damage:1.4,density:1.3,size:1.2},_cGs,g.noRecoil]),
                TYPE:['voidBullet_C2',{INDEPENDENT:true}], AUTOFIRE:true, SYNCS_SKILLS:true,
                STAT_CALCULATOR:'drone', WAIT_TO_CYCLE:true, MAX_CHILDREN:3,
            },
        }],
    };
    Class.abyss_shockTurret_C2 = {
        PARENT:['autoTurret'], LABEL:'Shockwave', INDEPENDENT:true,
        BODY:{ FOV: base.FOV*0.9 },
        FACING_TYPE: ["turnWithSpeed", { speed: 0.9, independent: true }],
        GUNS:[{
            POSITION:[6,6,1.1,6,0,0,0],
            PROPERTIES:{ SHOOT_SETTINGS:safeCS([g.basic,{reload:3,damage:1.8,size:2,speed:0.5,range:5.9},_cGs,g.noRecoil]),
                TYPE:'shockwaveRing_C2' },
        }],
    };
    Class.abyss_C2 = {
        PARENT:['celestial_CLSTL'],
        LABEL:'Abyss', COLOR:'#221133',
        UPGRADE_COLOR:'#221133',
        BODY:{ HEALTH:1100, SHIELD:200, SPEED: base.SPEED*0.25, DAMAGE:7 },
        BROADCAST_MESSAGE:'The Abyss closes... for now.',
        TURRETS:[
            ...Array.from({length:9},(_,i)=>({ POSITION:[l1S,7.5,0,i*40,180,0], TYPE:'abyss_droneTurret_C2' })),
            ...Array.from({length:9},(_,i)=>({ POSITION:[l2S,8.5,0,i*40+20,180,0], TYPE:'abyss_shockTurret_C2' })),
        ],
    };

    // ── Solstice — sun+moon duality, alternating guns ─────────────────────
    Class.solstice_sunTurret_C2 = {
        PARENT:['autoTurret'], LABEL:'Solar Flare', INDEPENDENT:true,
        BODY:{ FOV: base.FOV*1.2 },
        GUNS:[
            { POSITION:[20,8,1,0,0,0,0],
              PROPERTIES:{ SHOOT_SETTINGS:safeCS([g.basic,g.pounder,{damage:1.5,speed:0.9,reload:1.4},_cGs,g.noRecoil]),
                TYPE:'plasmaOrb_C2' } },
        ],
    };
    Class.solstice_moonTurret_C2 = {
        PARENT:['autoTurret'], LABEL:'Lunar Ray', INDEPENDENT:true,
        BODY:{ FOV: base.FOV*1.4 },
        GUNS:[
            { POSITION:[24,6,1,0,0,0,0],
              PROPERTIES:{ SHOOT_SETTINGS:safeCS([g.basic,g.sniper,{damage:1.4,speed:1.6,reload:1.3,pen:1.3},_cGs,g.noRecoil]),
                TYPE:'bullet' } },
            { POSITION:[20,9,1,0,0,0,0.25],
              PROPERTIES:{ SHOOT_SETTINGS:safeCS([g.basic,g.sniper,{damage:1.2,speed:1.4,reload:1.1},_cGs,g.noRecoil]),
                TYPE:'bullet' } },
        ],
    };
    Class.solstice_C2 = {
        PARENT:['celestial_CLSTL'],
        LABEL:'Solstice', COLOR:'#ffffaa',
        UPGRADE_COLOR:'#ffffaa',
        BROADCAST_MESSAGE:'The Solstice passes into night...',
        TURRETS:[
            ...Array.from({length:9},(_,i)=>({
                POSITION:[l1S,7.5,0,i*40,180,0],
                TYPE: i%2===0 ? 'solstice_sunTurret_C2' : 'solstice_moonTurret_C2',
            })),
            ...Array.from({length:9},(_,i)=>({
                POSITION:[l2S,8.5,0,i*40+20,180,0],
                TYPE: i%2===0 ? 'solstice_moonTurret_C2' : 'solstice_sunTurret_C2',
            })),
        ],
    };

    // ── Tempest — storm celestial, machinegun barrage ─────────────────────
    Class.tempest_gunTurret_C2 = {
        PARENT:['autoTurret'], LABEL:'Thunder', INDEPENDENT:true,
        BODY:{ FOV: base.FOV*1.1 },
        GUNS: weaponArray({
            POSITION:[16,3.5,1,0,0,0,0],
            PROPERTIES:{ SHOOT_SETTINGS:safeCS([g.basic,g.minigun,{reload:0.4,damage:1.1,spray:1.5},_cGs,g.noRecoil]),
                TYPE:'bullet' },
        }, 4),
    };
    Class.tempest_launTurret_C2 = {
        PARENT:['autoTurret'], LABEL:'Thunderstrike', INDEPENDENT:true,
        BODY:{ FOV: base.FOV*1.2 },
        GUNS:[{
            POSITION:[18,11,1,0,0,0,0],
            PROPERTIES:{ SHOOT_SETTINGS:safeCS([g.basic,g.pounder,{reload:1.3,damage:1.5,speed:1.1},_cGs,g.noRecoil]),
                TYPE:'starfireMissile_C2', STAT_CALCULATOR:'sustained' },
        }],
    };
    Class.tempest_C2 = {
        PARENT:['celestial_CLSTL'],
        LABEL:'Tempest', COLOR:'#4499dd',
        UPGRADE_COLOR:'#4499dd',
        BODY:{ HEALTH:950, SHIELD:130, SPEED: base.SPEED*0.32 },
        BROADCAST_MESSAGE:'The Tempest is calmed!',
        TURRETS:[
            ...Array.from({length:9},(_,i)=>({ POSITION:[l1S,7.5,0,i*40,180,0], TYPE:'tempest_gunTurret_C2' })),
            ...Array.from({length:9},(_,i)=>({ POSITION:[l2S,8.5,0,i*40+20,180,0], TYPE:'tempest_launTurret_C2' })),
        ],
    };

    // ── Aurora — ice celestial, slow + trap net ───────────────────────────
    Class.aurora_trapTurret_C2 = {
        PARENT:['autoTurret'], LABEL:'Ice Net', INDEPENDENT:true,
        BODY:{ FOV: base.FOV*1.0 },
        GUNS:[
            { POSITION:[14,5,1,0,0,180,0] },
            { POSITION:[1.5,5,1.6,14,0,180,0],
              PROPERTIES:{ SHOOT_SETTINGS:safeCS([g.trap,g.hexaTrapper,{reload:1.5,health:1.6,damage:1.3,speed:0.85},_cGs,g.noRecoil]),
                TYPE:'trap', STAT_CALCULATOR:'trap', AUTOFIRE:true } },
        ],
    };
    Class.aurora_beamTurret_C2 = {
        PARENT:['autoTurret'], LABEL:'Aurora Beam', INDEPENDENT:true,
        BODY:{ FOV: base.FOV*1.3 },
        GUNS:[
            { POSITION:[24,7,1,0,0,0,0],
              PROPERTIES:{ SHOOT_SETTINGS:safeCS([g.basic,g.sniper,{damage:1.2,speed:1.5,reload:1.2,pen:1.1},_cGs,g.noRecoil]),
                TYPE:'bullet' } },
        ],
    };
    Class.aurora_C2 = {
        PARENT:['celestial_CLSTL'],
        LABEL:'Aurora', COLOR:'#88ffee',
        UPGRADE_COLOR:'#88ffee',
        BODY:{ HEALTH:850, SHIELD:170, SPEED: base.SPEED*0.28 },
        BROADCAST_MESSAGE:'The Aurora dims...',
        TURRETS:[
            ...Array.from({length:9},(_,i)=>({ POSITION:[l1S,7.5,0,i*40,180,0], TYPE:'aurora_trapTurret_C2' })),
            ...Array.from({length:9},(_,i)=>({ POSITION:[l2S,8.5,0,i*40+20,180,0], TYPE:'aurora_beamTurret_C2' })),
        ],
    };

    Class.cascade_gunTurret_C2 = {
        PARENT:['autoTurret'], LABEL:'Cascade Fire', INDEPENDENT:true,
        BODY:{ FOV: base.FOV*1.15 },
        GUNS:[
            { POSITION:[16,3,1,0,5,0,0], PROPERTIES:{ SHOOT_SETTINGS:safeCS([g.basic,g.minigun,{reload:0.5,damage:1.0},_cGs,g.noRecoil]), TYPE:'bullet' } },
            { POSITION:[16,3,1,0,-5,0,0.25], PROPERTIES:{ SHOOT_SETTINGS:safeCS([g.basic,g.minigun,{reload:0.5,damage:1.0},_cGs,g.noRecoil]), TYPE:'bullet' } },
            { POSITION:[18,3,1,0,0,0,0.5], PROPERTIES:{ SHOOT_SETTINGS:safeCS([g.basic,g.minigun,{reload:0.5,damage:1.1},_cGs,g.noRecoil]), TYPE:'bullet' } },
        ],
    };
    Class.cascade_waveTurret_C2 = {
        PARENT:['autoTurret'], LABEL:'Tidal', INDEPENDENT:true,
        BODY:{ FOV: base.FOV*1.0 },
        GUNS:[{
            POSITION:[12,12,1,0,0,0,0],
            PROPERTIES:{ SHOOT_SETTINGS:safeCS([g.basic,g.pounder,{reload:1.3,damage:1.4,size:1.2,spray:2},_cGs,g.noRecoil]),
                TYPE:'novaBurst_C2' },
        }],
    };
    Class.cascade_C2 = {
        PARENT:['celestial_CLSTL'],
        LABEL:'Cascade', COLOR:'#3399ff',
        UPGRADE_COLOR:'#3399ff',
        BROADCAST_MESSAGE:'The Cascade flows no more...',
        TURRETS:[
            ...Array.from({length:9},(_,i)=>({ POSITION:[l1S,7.5,0,i*40,180,0], TYPE:'cascade_gunTurret_C2' })),
            ...Array.from({length:9},(_,i)=>({ POSITION:[l2S,8.5,0,i*40+20,180,0], TYPE:'cascade_waveTurret_C2' })),
        ],
    };

// ══════════════════════════════════════════════════════════════════════════════
//  ETERNALS
// ══════════════════════════════════════════════════════════════════════════════

    const eternalSize = 90;

    Class.ragnarok_ring1Turret_C2 = {
        PARENT:['autoTurret'], LABEL:'Destruction', INDEPENDENT:true,
        BODY:{ FOV: base.FOV*1.0 },
        GUNS:[{
            POSITION:[20,14,1,0,0,0,0],
            PROPERTIES:{ SHOOT_SETTINGS:safeCS([g.basic,g.pounder,{reload:1.8,damage:2.1,size:1.5},_cGs,g.noRecoil]), TYPE:'bullet' },
        }],
    };
    Class.ragnarok_ring2Turret_C2 = {
        PARENT:['autoTurret'], LABEL:'Ruin', INDEPENDENT:true,
        BODY:{ FOV: base.FOV*1.1 },
        GUNS:[{
            POSITION:[18,12,1,0,0,0,0],
            PROPERTIES:{ SHOOT_SETTINGS:safeCS([g.basic,g.pounder,{reload:1.5,damage:1.8,size:1.3},_cGs,{damage:1.3},g.noRecoil]),
                TYPE:'plasmaOrb_C2' },
        }],
    };
    Class.ragnarok_ring3Turret_C2 = {
        PARENT:['autoTurret'], LABEL:'Annihilation', INDEPENDENT:true,
        BODY:{ FOV: base.FOV*1.3 },
        GUNS: weaponArray({
            POSITION:[16,4,1,0,0,0,0],
            PROPERTIES:{ SHOOT_SETTINGS:safeCS([g.basic,g.minigun,{reload:0.4,damage:1.3,speed:1.4},_cGs,g.noRecoil]), TYPE:'bullet' },
        }, 3),
    };
    Class.ragnarok_C2 = {
        PARENT:['eternal_CLSTL'],
        LABEL:'Ragnarök', COLOR:'#cc2200',
        UPGRADE_COLOR:'#cc2200',
        SIZE: eternalSize,
        BODY:{ HEALTH:2200, SHIELD:280, SPEED: base.SPEED*0.16, DAMAGE:10 },
        BROADCAST_MESSAGE:'Ragnarök has been averted... for now.',
        TURRETS:[
            ...Array.from({length:11},(_,i)=>({ POSITION:[l0S,7,0,i*(360/11),180,0], TYPE:'ragnarok_ring1Turret_C2' })),
            ...Array.from({length:11},(_,i)=>({ POSITION:[l1S,7.5,0,i*(360/11)+16,180,0], TYPE:'ragnarok_ring2Turret_C2' })),
            ...Array.from({length:11},(_,i)=>({ POSITION:[l2S,8.5,0,i*(360/11)+32,180,0], TYPE:'ragnarok_ring3Turret_C2' })),
        ],
    };

    Class.nirvana_healTurret_C2 = {
        PARENT:['autoTurret'], LABEL:'Blessing', INDEPENDENT:true,
        BODY:{ FOV: base.FOV*1.0 },
        GUNS:[{
            POSITION:[10,8,1,8,0,0,0],
            PROPERTIES:{
                SHOOT_SETTINGS:safeCS([g.drone,g.summoner,{health:2,damage:0.3,size:1.2},_cGs,g.noRecoil]),
                TYPE:['healerDrone_CLSTL',{INDEPENDENT:true}], AUTOFIRE:true, SYNCS_SKILLS:true,
                STAT_CALCULATOR:'drone', WAIT_TO_CYCLE:true, MAX_CHILDREN:3,
            },
        }],
    };
    Class.nirvana_beamTurret_C2 = {
        PARENT:['autoTurret'], LABEL:'Transcendence', INDEPENDENT:true,
        BODY:{ FOV: base.FOV*1.5 },
        GUNS:[
            { POSITION:[28,6,1,0,0,0,0],
              PROPERTIES:{ SHOOT_SETTINGS:safeCS([g.basic,g.sniper,{damage:1.6,speed:1.8,reload:1.5,pen:1.4},_cGs,{damage:1.4},g.noRecoil]), TYPE:'bullet' } },
            { POSITION:[24,9,1,0,0,0,0.2],
              PROPERTIES:{ SHOOT_SETTINGS:safeCS([g.basic,g.sniper,{damage:1.4,speed:1.6,reload:1.3,pen:1.2},_cGs,g.noRecoil]), TYPE:'bullet' } },
        ],
    };
    Class.nirvana_C2 = {
        PARENT:['eternal_CLSTL'],
        LABEL:'Nirvana', COLOR:'#eeffcc',
        UPGRADE_COLOR:'#eeffcc',
        SIZE: eternalSize,
        BODY:{ HEALTH:1800, SHIELD:350, REGEN: base.REGEN*0.15, SPEED: base.SPEED*0.18, DAMAGE:7 },
        BROADCAST_MESSAGE:'Nirvana achieves its final rest...',
        TURRETS:[
            ...Array.from({length:11},(_,i)=>({ POSITION:[l0S,7,0,i*(360/11),180,0], TYPE:'nirvana_healTurret_C2' })),
            ...Array.from({length:11},(_,i)=>({ POSITION:[l1S,7.5,0,i*(360/11)+16,180,0], TYPE:'nirvana_beamTurret_C2' })),
            ...Array.from({length:11},(_,i)=>({ POSITION:[l2S,8.5,0,i*(360/11)+32,180,0], TYPE:'nirvana_healTurret_C2' })),
        ],
    };

    Class.oblivion_droneTurret_C2 = {
        PARENT:['autoTurret'], LABEL:'Entropy', INDEPENDENT:true,
        BODY:{ FOV: base.FOV*1.0 },
        GUNS:[{
            POSITION:[6,10,1.2,8,0,0,0],
            PROPERTIES:{
                SHOOT_SETTINGS:safeCS([g.drone,g.summoner,{health:2,damage:1.6,density:1.5,size:1.3},_cGs,g.noRecoil]),
                TYPE:['voidBullet_C2',{INDEPENDENT:true}], AUTOFIRE:true, SYNCS_SKILLS:true,
                STAT_CALCULATOR:'drone', WAIT_TO_CYCLE:true, MAX_CHILDREN:4,
            },
        }],
    };
    Class.oblivion_missileTurret_C2 = {
        PARENT:['autoTurret'], LABEL:'Oblivion Strike', INDEPENDENT:true,
        BODY:{ FOV: base.FOV*1.2 },
        GUNS:[{
            POSITION:[18,10,1,0,0,0,0],
            PROPERTIES:{ SHOOT_SETTINGS:safeCS([g.basic,g.pounder,{reload:1.4,damage:1.7,speed:1.2},_cGs,{damage:1.3},g.noRecoil]),
                TYPE:'starfireMissile_C2', STAT_CALCULATOR:'sustained' },
        }],
    };
    Class.oblivion_C2 = {
        PARENT:['eternal_CLSTL'],
        LABEL:'Oblivion', COLOR:'#110022',
        UPGRADE_COLOR:'#110022',
        SIZE: eternalSize,
        BODY:{ HEALTH:2400, SHIELD:300, SPEED: base.SPEED*0.15, DAMAGE:9 },
        BROADCAST_MESSAGE:'Oblivion fades... the void recedes.',
        TURRETS:[
            ...Array.from({length:11},(_,i)=>({ POSITION:[l0S,7,0,i*(360/11),180,0], TYPE:'oblivion_droneTurret_C2' })),
            ...Array.from({length:11},(_,i)=>({ POSITION:[l1S,7.5,0,i*(360/11)+16,180,0], TYPE:'oblivion_missileTurret_C2' })),
            ...Array.from({length:11},(_,i)=>({ POSITION:[l2S,8.5,0,i*(360/11)+32,180,0], TYPE:'abyss_shockTurret_C2' })),
        ],
    };

    Class.elysium_C2 = {
        PARENT:['eternal_CLSTL'],
        LABEL:'Elysium', COLOR:'#ffeeaa',
        UPGRADE_COLOR:'#ffeeaa',
        SIZE: eternalSize,
        BODY:{ HEALTH:2000, SHIELD:400, REGEN: base.REGEN*0.2, SPEED: base.SPEED*0.17, DAMAGE:8 },
        BROADCAST_MESSAGE:'Elysium has been disturbed...',
        TURRETS:[
            ...Array.from({length:11},(_,i)=>({
                POSITION:[l0S,7,0,i*(360/11),180,0],
                TYPE: ['selene_innerTurret_C2','vulcan_bombTurret_C2','zephyr_missileTurret_C2',
                       'aurora_beamTurret_C2','cascade_waveTurret_C2'][i%5],
            })),
            ...Array.from({length:11},(_,i)=>({
                POSITION:[l1S,7.5,0,i*(360/11)+16,180,0],
                TYPE: ['tempest_launTurret_C2','solstice_moonTurret_C2','nirvana_beamTurret_C2',
                       'ragnarok_ring2Turret_C2','abyss_droneTurret_C2'][i%5],
            })),
            ...Array.from({length:11},(_,i)=>({
                POSITION:[l2S,8.5,0,i*(360/11)+32,180,0],
                TYPE: ['cascade_gunTurret_C2','zephyr_spreadTurret_C2','tempest_gunTurret_C2',
                       'vulcan_barrelTurret_C2','pulsar_turret_C2'][i%5],
            })),
        ],
    };

    Class.rogueSelene_C2    = { PARENT:['selene_C2'],   LABEL:'Rogue Selene',   COLOR:'#445566', SIZE:40, BODY:{SPEED:base.SPEED*0.35}, BROADCAST_MESSAGE:'A Rogue Selene has been defeated!' };
    Class.rogueVulcan_C2   = { PARENT:['vulcan_C2'],   LABEL:'Rogue Vulcan',   COLOR:'#552211', SIZE:40, BODY:{SPEED:base.SPEED*0.38}, BROADCAST_MESSAGE:'A Rogue Vulcan extinguished!' };
    Class.rogueZephyr_C2   = { PARENT:['zephyr_C2'],   LABEL:'Rogue Zephyr',   COLOR:'#334433', SIZE:40, BODY:{SPEED:base.SPEED*0.42}, BROADCAST_MESSAGE:'A Rogue Zephyr silenced!' };
    Class.rogueAbyss_C2    = { PARENT:['abyss_C2'],    LABEL:'Rogue Abyss',    COLOR:'#110011', SIZE:40, BODY:{SPEED:base.SPEED*0.28}, BROADCAST_MESSAGE:'A Rogue Abyss sealed!' };
    Class.rogueTempest_C2  = { PARENT:['tempest_C2'],  LABEL:'Rogue Tempest',  COLOR:'#223344', SIZE:40, BODY:{SPEED:base.SPEED*0.35}, BROADCAST_MESSAGE:'A Rogue Tempest calmed!' };

    Class.menu_C2 = {
        PARENT:['genericTank'], LABEL:'Celestia II', COLOR:'lightGrey',
        DANGER:9, SIZE:14, GUNS:[], TURRETS:[], UPGRADES_TIER_0:[],
    };
    Class.celestials_C2 = {
        PARENT:['genericTank'], LABEL:'New Celestials', COLOR:'white',
        DANGER:9, SIZE:12, GUNS:[], TURRETS:[], UPGRADES_TIER_0:[],
    };
    Class.eternals_C2 = {
        PARENT:['genericTank'], LABEL:'New Eternals', COLOR:'veryLightGrey',
        DANGER:11, SIZE:12, GUNS:[], TURRETS:[], UPGRADES_TIER_0:[],
    };
    Class.miniBosses_C2 = {
        PARENT:['genericTank'], LABEL:'Mini-Bosses', COLOR:'grey',
        DANGER:8, SIZE:12, GUNS:[], TURRETS:[], UPGRADES_TIER_0:[],
    };
    Class.rogues_C2 = {
        PARENT:['genericTank'], LABEL:'Rogues', COLOR:'darkGrey',
        DANGER:9, SIZE:12, GUNS:[], TURRETS:[], UPGRADES_TIER_0:[],
    };

    Class.celestials_C2.UPGRADES_TIER_0 = [
        'selene_C2','vulcan_C2','zephyr_C2','abyss_C2',
        'solstice_C2','tempest_C2','aurora_C2','cascade_C2',
    ];
    Class.eternals_C2.UPGRADES_TIER_0 = [
        'ragnarok_C2','nirvana_C2','oblivion_C2','elysium_C2',
    ];
    Class.miniBosses_C2.UPGRADES_TIER_0 = [
        'comet_C2','pulsar_C2','voidShard_C2',
        'flareKnight_C2','nebulaWisp_C2','stormEye_C2',
    ];
    Class.rogues_C2.UPGRADES_TIER_0 = [
        'rogueSelene_C2','rogueVulcan_C2','rogueZephyr_C2',
        'rogueAbyss_C2','rogueTempest_C2',
    ];
    Class.menu_C2.UPGRADES_TIER_0 = [
        'celestials_C2','eternals_C2','miniBosses_C2','rogues_C2',
    ];

    for (const name of Class.celestials_C2.UPGRADES_TIER_0) {
        if (Class[name]) Class[name].UPGRADE_COLOR = Class[name].COLOR;
    }
    for (const name of Class.eternals_C2.UPGRADES_TIER_0) {
        if (Class[name]) Class[name].UPGRADE_COLOR = Class[name].COLOR;
    }


    const _entry = ['menu_addons']
        .find(n => Class[n] && Array.isArray(Class[n].UPGRADES_TIER_0));
    if (_entry) {
        Class[_entry].UPGRADES_TIER_0.push('menu_C2');
        console.log('[celestia2] Connected to ' + _entry);
    } else {
        console.warn('[celestia2] Connect menu_C2 to your addons menu manually.');
    }

    console.log('[celestia2] Loaded — 8 Celestials, 4 Eternals, 6 Mini-Bosses, 5 Rogues.');
};