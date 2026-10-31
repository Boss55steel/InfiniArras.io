// ============================================================
//  BOSSES — Ultimate Twin-MKX + Zeus
//  Fixed for open-source-arras-main
//  All exports.* → Class.*, module.exports wrapper added,
//  skillSet removed, autospin fixed, array gunvals shimmed
// ============================================================

const { combineStats } = require('../facilitators.js');
const _facs = require('../facilitators.js');
const _constants = require('../constants.js');
const { base, dfltskl, smshskl, statnames } = _constants;
const g = require('../gunvals.js');

// ── Safe combineStats — filters nulls AND converts raw arrays to objects ──────
// OSA's combineStats may not accept raw [r,rc,sh,sz,sp,ms,h,p,d,dn,spr,rng,res] arrays
// Convert them to stat objects first.
const STAT_KEYS = ['reload','recoil','shudder','size','speed','maxSpeed','health',
                   'pen','damage','density','spray','range','resist'];
const safeCS = (stats) => {
    const cleaned = stats.filter(s => s != null).map(s => {
        if (Array.isArray(s)) {
            const obj = {};
            STAT_KEYS.forEach((k, i) => { if (s[i] != null) obj[k] = s[i]; });
            return obj;
        }
        return s;
    });
    return combineStats(cleaned);
};

// ── Weapon array shim ─────────────────────────────────────────────────────────
const weaponArray = _facs.weaponArray || ((w, n) => {
    const arr = Array.isArray(w) ? w : [w];
    if (!n || n === 1) return arr;
    const out = [];
    for (let i = 0; i < n; i++) {
        const angle = (360/n)*i;
        for (const item of arr) {
            const c = JSON.parse(JSON.stringify(item));
            if (c.POSITION && Array.isArray(c.POSITION)) c.POSITION[5] = (c.POSITION[5]||0)+angle;
            out.push(c);
        }
    }
    return out;
});

// ── skillSet shim ─────────────────────────────────────────────────────────────
const skillSet = _facs.skillSet || (() => undefined);

// ── Gunval shims ──────────────────────────────────────────────────────────────
if (!g.turret)   g.turret   = { reload:0.8, damage:0.85, pen:0.75, speed:1.1, maxSpeed:1.1, recoil:0 };
if (!g.power)    g.power    = { damage:1.5, pen:1.5, health:1.5 };
if (!g.pounder)  g.pounder  = { reload:1.5, recoil:1.4, speed:0.65, maxSpeed:0.65, size:1.25, damage:1.5 };
if (!g.assassin) g.assassin = { speed:1.6, maxSpeed:1.6, reload:0.55, recoil:0 };
if (!g.rifle)    g.rifle    = { reload:0.8, recoil:0.8, shudder:1.5, health:0.8, damage:0.8, pen:0.9, spray:2 };
if (!g.artillery)g.artillery= { reload:1.8, spray:2, size:1.2, damage:1.4 };
if (!g.skimmer)  g.skimmer  = { reload:2, recoil:1, speed:0.8, maxSpeed:0.8 };
if (!g.hive)     g.hive     = { reload:0.5, size:1.2, damage:0.8 };
if (!g.bee)      g.bee      = { reload:0.6, size:0.8, speed:1.4, maxSpeed:1.4, damage:0.7 };
if (!g.carrier)  g.carrier  = { reload:0.7, size:0.7 };
if (!g.battleship)g.battleship={ reload:0.7, size:0.7 };
if (!g.bent)     g.bent     = { spray:2.5 };
if (!g.halfreload)g.halfreload={ reload:2 };
if (!g.fake)     g.fake     = { size:0.00001, health:0.0001, speed:0, maxSpeed:0, shudder:0, spray:0, recoil:0, range:0 };

// ── Helper functions (mirrors original file) ──────────────────────────────────
function makeGun(height, width, aspect, x, y, angle, delay, stats, type, autofire, maxchildren) {
    return {
        POSITION: [height, width, aspect, x, y, angle, delay],
        PROPERTIES: {
            SHOOT_SETTINGS: safeCS(stats),
            TYPE: type,
            AUTOFIRE: autofire || false,
            ...(maxchildren ? { MAX_CHILDREN: maxchildren } : {}),
        },
    };
}
function makeEmptyGun(height, width, aspect, x, y, angle, delay) {
    return { POSITION: [height, width, aspect, x, y, angle, delay] };
}

module.exports = ({ Class }) => {
    console.log('[bosses] Loading Ultimate Twin-MKX and Zeus...');

// ════════════════════════════════════════════════════════════════════════
//  ULTIMATE TWIN-MKX
// ════════════════════════════════════════════════════════════════════════

    Class.twinDelta2 = {
        PARENT: 'autoTurret', LABEL: 'Twin Delta', COLOR: 33,
        GUNS: [
            makeGun(28,5,1,0,3.25,0,0,     [g.basic,g.twin,g.gunner,g.turret,g.sniper],'bullet',false),
            makeGun(28,5,1,0,-3.25,0,0.5,  [g.basic,g.twin,g.gunner,g.turret,g.sniper],'bullet',false),
            makeEmptyGun(14,13.333,-1.5,0,0,0,0),
        ],
    };

    Class.twinTurret2 = {
        PARENT: 'autoTurret', LABEL: 'Twin',
        GUNS: [
            makeGun(20,8,1,0,5.5,0,0,   [g.basic,g.twin,g.turret],'bullet',false),
            makeGun(20,8,1,0,-5.5,0,0.5,[g.basic,g.twin,g.turret],'bullet',false),
        ],
    };

    Class.megaTwinMinion2 = {
        PARENT: 'minion', LABEL: 'Mega Twin',
        BODY: { HEALTH:30, DAMAGE:2, SPEED:6.8 },
        SHAPE: 8,
        HAS_NO_RECOIL: true,
        // autospin → spin controller (new OSA doesn't accept "autospin" string)
        CONTROLLERS: [['spin', { speed: 0.05 }]],
        FACING_TYPE: ['spin', { speed: 0.05 }],
        GUNS: [],
        TURRETS: (() => {
            const out = [];
            for (let i = 0; i < 8; i++) {
                out.push(
                    { POSITION:[3.2,9,1.6, i*(360/8),180,0], TYPE:'twinDelta2' },
                    { POSITION:[3.2,9,-1.6,i*(360/8),180,0], TYPE:'twinDelta2' }
                );
            }
            out.push({ POSITION:[10,0,0,0,360,1], TYPE:'twinTurret2' });
            return out;
        })(),
    };

    Class.twinSprout2 = {
        PARENT: 'autoTurret', LABEL: 'Twin Sprout', COLOR: 33,
        GUNS: [
            makeGun(40,8,1,0,5.5,0,0,  [g.basic,g.twin,g.sniper,g.assassin,g.turret],'bullet',false),
            makeGun(40,8,1,0,-5.5,0,0.5,[g.basic,g.twin,g.sniper,g.assassin,g.turret],'bullet',false),
        ],
    };

    Class.infectTurret2 = {
        PARENT: 'auto4gun', LABEL: 'Infector',
        GUNS: [
            { POSITION:[20,8,1,0,5.5,0,0],    PROPERTIES:{ SHOOT_SETTINGS:safeCS([g.basic,g.twin,g.turret,g.power]), TYPE:'bullet' } },
            { POSITION:[20,8,1,0,-5.5,0,0.25], PROPERTIES:{ SHOOT_SETTINGS:safeCS([g.basic,g.twin,g.turret,g.power]), TYPE:'bullet' } },
            { POSITION:[17,8,1,0,5.5,0,0.5],  PROPERTIES:{ SHOOT_SETTINGS:safeCS([g.basic,g.twin,g.turret,g.power]), TYPE:'bullet' } },
            { POSITION:[17,8,1,0,-5.5,0,0.75], PROPERTIES:{ SHOOT_SETTINGS:safeCS([g.basic,g.twin,g.turret,g.power]), TYPE:'bullet' } },
        ],
    };

    Class.megaTwinSpawner2 = {
        PARENT: 'autoTurret', LABEL: 'Mega Twin Spawner', COLOR: 33,
        GUNS: [
            makeGun(9,14,1,5,0,0,0, [g.factory,g.turret,{size:7}],'megaTwinMinion2',true,1),
            makeEmptyGun(8,13,1,5,0,0,0),
            makeEmptyGun(7,14,0.8,5,0,0,0),
            makeEmptyGun(6,14,0.5,5,0,0,0),
        ],
    };

    Class.twinSpout2 = {
        PARENT: 'autoTurret', LABEL: 'Twin Spout', COLOR: 33,
        GUNS: [
            makeGun(18,8,1,0,5.5,0,0,  [g.basic,g.pounder,g.sniper,g.assassin,g.twin,g.turret,{health:2}],'bullet',false),
            makeGun(18,8,1,0,-5.5,0,0.5,[g.basic,g.pounder,g.sniper,g.assassin,g.twin,g.turret,{health:2}],'bullet',false),
        ],
    };

    Class.twinCircle2 = {
        PARENT: 'genericTank',
        COLOR: 33,
        SHAPE: 20,
        SKILL_CAP: Array(10).fill(9),
        TURRETS: (() => {
            const out = Array.from({length:20},(_,i)=>({
                POSITION:[2,10,0,i*(360/20),180,0], TYPE:'twinTurret2',
            }));
            for (let i = 0.5; i < 10; i++) {
                out.push({ POSITION:[3,8,0,i*(360/10),90,1], TYPE:'infectTurret2' });
            }
            out.push({ POSITION:[6,2,0,0,180,1], TYPE:'twinDelta2' });
            return out;
        })(),
    };

    Class.megaRifle2 = {
        PARENT: 'autoTurret', LABEL: 'Mega Rifle', COLOR: 33,
        GUNS: (() => {
            const out = [];
            for (let i = 0; i < 2; i++)
                out.push({ POSITION:[40,4,1,0,[6,-6][i%2],0,0] });
            const delays = [0,1/6,2/6,3/6,4/6,5/6];
            for (let k = 0; k < 6; k++) {
                out.push({
                    POSITION:[2,18,1,38-4*k,0,0,delays[k]],
                    PROPERTIES:{
                        SHOOT_SETTINGS:safeCS([g.basic,g.sniper,g.rifle,g.assassin,g.turret,
                            {reload:3,speed:1.8,maxSpeed:1.8,health:1.8,pen:1.8}]),
                        TYPE:'bullet',
                    },
                });
            }
            return out;
        })(),
    };

    Class.ultimateTwinMKX = {
        PARENT: 'miniboss',
        LABEL: 'Ultimate Twin-MKX',
        VALUE: 1820000,
        SIZE: 180, SHAPE: 6, COLOR: 33,
        BODY: {
            HEALTH: 1899, DAMAGE: 8,
            REGEN: base.REGEN * 0.25,
            SPEED: base.SPEED * 0.1,
        },
        TURRETS: (() => {
            const out = [];
            for (let i = 0; i < 6; i++)
                out.push({ POSITION:[10,8,0,i*(360/6),0,0], TYPE:'twinCircle2' });
            for (let i = 0; i < 6; i++) {
                const a = i*(360/6);
                const a2 = (i+0.5)*(360/6);
                out.push(
                    {POSITION:[1,9,0,a,180,1],TYPE:'twinDelta2'},
                    {POSITION:[1,9,1.25,a,180,1],TYPE:'twinDelta2'},
                    {POSITION:[1,9,2.5,a,180,1],TYPE:'twinDelta2'},
                    {POSITION:[1,9,-1.25,a,180,1],TYPE:'twinDelta2'},
                    {POSITION:[1,9,-2.5,a,180,1],TYPE:'twinDelta2'},
                    {POSITION:[1,7.8,0,a,180,1],TYPE:'twinDelta2'},
                    {POSITION:[1,7.8,1.25,a,180,1],TYPE:'twinDelta2'},
                    {POSITION:[1,7.8,2.5,a,180,1],TYPE:'twinDelta2'},
                    {POSITION:[1,7.8,-1.25,a,180,1],TYPE:'twinDelta2'},
                    {POSITION:[1,7.8,-2.5,a,180,1],TYPE:'twinDelta2'},
                    {POSITION:[1,6.6,0,a,180,1],TYPE:'twinDelta2'},
                    {POSITION:[1,6.6,1.25,a,180,1],TYPE:'twinDelta2'},
                    {POSITION:[1,6.6,2.5,a,180,1],TYPE:'twinDelta2'},
                    {POSITION:[1,6.6,-1.25,a,180,1],TYPE:'twinDelta2'},
                    {POSITION:[1,6.6,-2.5,a,180,1],TYPE:'twinDelta2'},
                    {POSITION:[2,9,0,a2,180,1],TYPE:'twinSprout2'},
                    {POSITION:[2,5.7,0,a2,360,1],TYPE:'megaTwinSpawner2'},
                    {POSITION:[1,4.4,0,a,180,1],TYPE:'twinSpout2'},
                    {POSITION:[1,4.4,1.25,a,180,1],TYPE:'twinSpout2'},
                    {POSITION:[1,4.4,-1.25,a,180,1],TYPE:'twinSpout2'}
                );
            }
            out.push({ POSITION:[6,0,0,0,360,1], TYPE:'megaRifle2' });
            return out;
        })(),
    };

// ════════════════════════════════════════════════════════════════════════
//  ZEUS
// ════════════════════════════════════════════════════════════════════════

    // Zeus layer helper
    function zeusLayer(number, color, controller, sk, TURRETS, GUNS) {
        return {
            PARENT: 'genericTank',
            LABEL: '',
            SHAPE: 3 + 2*number,
            COLOR: color,
            CONTROLLERS: [[controller === 'spin' ? 'spin' : controller, { speed: 0.02 }]],
            SKILL_CAP: Array(10).fill(sk),
            TURRETS: TURRETS || [],
            GUNS: GUNS || [],
        };
    }

    // Zeus gunval arrays → objects
    g.zeusDrone         = { reload:6, speed:4.3, maxSpeed:1.4, health:1.22 };
    g.zeusSwarmDrone    = { reload:5.5, speed:2.2, maxSpeed:3.2, health:1.2 };
    g.zeusMinion        = { reload:2.5, pen:2, speed:11, maxSpeed:2, health:1.8, density:1.2 };
    g.phobosSwarm       = { reload:4, speed:1.2, maxSpeed:1.33, health:1.211 };
    g.nepheleMissile    = { reload:1.5, speed:2, maxSpeed:1.4, health:1.22, pen:3 };
    g.phobosMissile     = { reload:2.5, speed:1.5, maxSpeed:2.5, damage:2, pen:3 };
    g.nepheleSwarm      = { reload:4, speed:1.2, maxSpeed:1.33, health:1.211 };
    g.zeusBuffedMissile = { reload:5.55, speed:1.55, maxSpeed:1.145, health:1.255 };

    // Zyraethos base — the parent of Zeus
    Class.zyraethos = {
        PARENT: 'genericTank',
        TYPE: 'miniboss',
        LABEL: 'Zyraethos',
        DANGER: 500,
        SKILL_CAP: Array(10).fill(dfltskl || 7),
        SIZE: 280, SHAPE: 17,
        CONTROLLERS: ['nearestDifferentMaster','canRepel'],
        AI: { NO_LEAD: true },
        BODY: {
            HEALTH: 9000, DAMAGE: 18.4,
            SPEED: base.SPEED * 0.006,
            FOV: 2.5,
            REGEN: base.REGEN * 0.001,
        },
        VALUE: 5e11,
        FACING_TYPE: ['spin', { speed: 0.005 }],
        HITS_OWN_TYPE: 'boss',
        BROADCAST_MESSAGE: 'A Zyraethos has fallen!',
        GUNS: [], TURRETS: [],
    };

    // Munitions
    Class.zeusDrone = { PARENT:'drone', SHAPE:10, COLOR:19, INDEPENDENT:true, GUNS:[] };
    Class.zeusPentagonSwarm = { SHAPE:5, PARENT:'swarm', GUNS:[] };
    Class.phobosPentaSwarm  = { PARENT:'swarm', SHAPE:5, GUNS:[] };

    Class.zeusMinion1 = {
        PARENT: 'minion', INDEPENDENT:true,
        GUNS: [], DRAW_HEALTH:true,
        FACING_TYPE: ['spin',{speed:0.04}],
        CONTROLLERS: ['hangOutNearMaster'],
        SHAPE: 3,
        TURRETS: (() => {
            const tr = [];
            for (let i = 0.5; i < 3; i++) {
                tr.push({ POSITION:[12,6,0,(360*i)/3,190,0], TYPE:['autoTurret',{PARENT:'pounder'}] });
            }
            return tr;
        })(),
    };

    // Turrets
    Class.zeusCarrier = {
        PARENT: 'auto4gun', LABEL: '',
        GUNS: [
            { POSITION:[7,7.5,0.6,7,0,0,0], PROPERTIES:{ SHOOT_SETTINGS:safeCS([g.swarm,g.battleship,g.carrier]), TYPE:'swarm', STAT_CALCULATOR:'swarm' } },
            { POSITION:[7,7.5,0.6,7,2,40,0],  PROPERTIES:{ SHOOT_SETTINGS:safeCS([g.swarm,g.battleship,g.carrier,g.zeusSwarmDrone,g.power]), TYPE:'zeusPentagonSwarm', STAT_CALCULATOR:'swarm' } },
            { POSITION:[7,7.5,0.6,7,-2,-40,0], PROPERTIES:{ SHOOT_SETTINGS:safeCS([g.swarm,g.battleship,g.carrier,g.zeusSwarmDrone,g.power]), TYPE:'zeusPentagonSwarm', STAT_CALCULATOR:'swarm' } },
        ],
    };

    Class.zeusMissileTurret = {
        PARENT:'autoTurret', HAS_NO_RECOIL:true, LABEL:'',
        GUNS: [
            { POSITION:[21,10,1.5,0,0,0,0], PROPERTIES:{ SHOOT_SETTINGS:safeCS([g.basic,g.pounder,g.artillery,g.skimmer,g.nepheleMissile,g.zeusBuffedMissile,g.fake]), TYPE:'bullet' } },
            { POSITION:[19,16,1,0,0,0,0],   PROPERTIES:{ SHOOT_SETTINGS:safeCS([g.basic,g.pounder,g.artillery,g.skimmer,g.nepheleMissile,g.zeusBuffedMissile]), TYPE:'nepheleMissile' } },
            { POSITION:[19,15,0.01,0,0,0,0],PROPERTIES:{ SHOOT_SETTINGS:safeCS([g.basic,g.pounder,g.artillery,g.skimmer,g.nepheleMissile,g.zeusBuffedMissile,g.fake]), TYPE:'bullet' } },
        ],
    };

    Class.zeusMissileTurret2 = {
        PARENT:'autoTurret', LABEL:'',
        GUNS: [
            { POSITION:[21,10,1.5,0,0,0,0], PROPERTIES:{ SHOOT_SETTINGS:safeCS([g.basic,g.pounder,g.artillery,g.skimmer,g.phobosMissile,g.zeusBuffedMissile,g.fake]), TYPE:'bullet' } },
            { POSITION:[19,16,1,0,0,0,0],   PROPERTIES:{ SHOOT_SETTINGS:safeCS([g.basic,g.pounder,g.artillery,g.skimmer,g.phobosMissile,g.zeusBuffedMissile]), TYPE:'phobosMissile' } },
            { POSITION:[17,0.15,100,0,0,0,0],PROPERTIES:{ SHOOT_SETTINGS:safeCS([g.basic,g.pounder,g.artillery,g.skimmer,g.phobosMissile,g.zeusBuffedMissile,g.fake]), TYPE:'bullet' } },
        ],
    };

    Class.aresHive = {
        PARENT:'hive', LABEL:'Mini Hive',
        MOTION_TYPE:'slowdown',
        GUNS: (() => {
            const gs = [];
            for (let i = 0; i < 3; i++) {
                gs.push({
                    POSITION:[14,9.5,0.6,0,0,(360*i)/3, i===0?0:1/i],
                    PROPERTIES:{ SHOOT_SETTINGS:safeCS([g.swarm,g.hive,g.bee]), TYPE:'bee', AUTOFIRE:true },
                });
            }
            return gs;
        })(),
    };

    Class.zeusHiveTurret1 = {
        PARENT:'genericTank', LABEL:'Mini Swarmer',
        BODY:{ FOV:2 },
        CONTROLLERS:['canRepel','onlyAcceptInArc','mapAltToFire','nearestDifferentMaster'],
        GUNS: [
            { POSITION:[14,14,-1.2,0,0,0,0], PROPERTIES:{ SHOOT_SETTINGS:safeCS([g.basic,g.halfreload,g.halfreload,g.power,g.power,g.pounder,{reload:1.5,recoil:1.5,size:1.5,damage:1.5},g.hive,g.zeusBuffedMissile]), TYPE:'aresHive' } },
            { POSITION:[15,12,1,0,0,0,0] },
        ],
    };

    // Zeus body layers
    Class.zeusBody1 = zeusLayer(1, 31, 'spin', 9, (() => {
        const tr = [];
        for (let i = 0.5; i < 5; i++) tr.push({ POSITION:[8,8.5,0,(360*i)/5,180,0], TYPE:'zeusCarrier' });
        return tr;
    })(), []);

    Class.zeusBody2 = zeusLayer(2, 31, 'spin', 9, [], (() => {
        const gs = [];
        for (let i = 0.5; i < 7; i++) {
            gs.push({ POSITION:[6,6,1.25,5.5,0,(360*i)/7,6], PROPERTIES:{ SHOOT_SETTINGS:safeCS([g.drone,g.zeusDrone]), TYPE:'zeusDrone', AUTOFIRE:true, MAX_CHILDREN:1 } });
        }
        return gs;
    })());

    Class.zeusBody3 = zeusLayer(3, 31, 'spin', 9, (() => {
        const tr = [];
        for (let i = 0.5; i < 9; i++) tr.push({ POSITION:[7,8.5,0,(360*i)/9,180,0], TYPE:'zeusHiveTurret1' });
        return tr;
    })(), []);

    Class.zeusBody4 = zeusLayer(4, 31, 'spin', 5, [], (() => {
        const gs = [];
        for (let i = 0.5; i < 11; i++) {
            gs.push({ POSITION:[5.5,4,1.25,5.5,0,(360*i)/11,6], PROPERTIES:{ SHOOT_SETTINGS:safeCS([g.drone,g.zeusMinion]), TYPE:'zeusMinion1', AUTOFIRE:true, MAX_CHILDREN:1 } });
        }
        return gs;
    })());

    Class.zeusBody5 = zeusLayer(5, 31, 'spin', 9, (() => {
        const tr = [];
        for (let i = 0.5; i < 13; i++) tr.push({ POSITION:[5.7,8.5,0,(360*i)/13,180,0], TYPE:'zeusMissileTurret' });
        return tr;
    })(), []);

    Class.zeusBody6 = zeusLayer(6, 31, 'spin', 9, (() => {
        const tr = [];
        for (let i = 0.5; i < 15; i++) tr.push({ POSITION:[4.85,8.5,0,(360*i)/15,180,0], TYPE:'zeusMissileTurret2' });
        return tr;
    })(), []);

    // Missile projectiles (defined after turrets so they can reference Class entries)
    Class.nepheleSwarmLauncher = {
        PARENT:'autoTurret', INDEPENDENT:true, LABEL:'',
        GUNS:[{ POSITION:[15,12,0.6,0,0,0,0], PROPERTIES:{ SHOOT_SETTINGS:safeCS([g.swarm,g.nepheleSwarm]), TYPE:'swarm', AUTOFIRE:true } }],
    };
    Class.nepheleMissile = {
        PARENT:'missile',
        TURRETS:[{ POSITION:[10,0,0,0,360,1], TYPE:'nepheleSwarmLauncher' }],
        GUNS:[],
    };
    Class.phobosMissile = {
        PARENT:'missile',
        GUNS:[
            { POSITION:[16,8,0.6,0,-3,-210,0.667], PROPERTIES:{ SHOOT_SETTINGS:safeCS([g.swarm,g.twin,g.bent,g.halfreload,g.halfreload,g.halfreload]), TYPE:['phobosPentaSwarm',{PERSISTS_AFTER_DEATH:true}], AUTOFIRE:true } },
            { POSITION:[16,8,0.6,0,3,210,0.667],   PROPERTIES:{ SHOOT_SETTINGS:safeCS([g.swarm,g.twin,g.bent,g.halfreload,g.halfreload,g.halfreload]), TYPE:['phobosPentaSwarm',{PERSISTS_AFTER_DEATH:true}], AUTOFIRE:true } },
            { POSITION:[19,8,0.6,0,-2,-195,0.333],  PROPERTIES:{ SHOOT_SETTINGS:safeCS([g.swarm,g.twin,g.bent,g.halfreload,g.halfreload,g.halfreload]), TYPE:['phobosPentaSwarm',{PERSISTS_AFTER_DEATH:true}], AUTOFIRE:true } },
            { POSITION:[19,8,0.6,0,2,195,0.333],    PROPERTIES:{ SHOOT_SETTINGS:safeCS([g.swarm,g.twin,g.bent,g.halfreload,g.halfreload,g.halfreload]), TYPE:['phobosPentaSwarm',{PERSISTS_AFTER_DEATH:true}], AUTOFIRE:true } },
            { POSITION:[22,8,0.6,0,0,180,0],        PROPERTIES:{ SHOOT_SETTINGS:safeCS([g.swarm,g.twin,g.bent,g.halfreload,g.halfreload,g.halfreload]), TYPE:['phobosPentaSwarm',{PERSISTS_AFTER_DEATH:true}], AUTOFIRE:true } },
        ],
    };

    // Zeus main boss
    Class.zeus = {
        PARENT: 'zyraethos',
        LABEL: 'Zeus',
        FACING_TYPE: ['spin', { speed: 0.008 }],
        COLOR: 31,
        TURRETS: (() => {
            const tr = [
                { POSITION:[16.94,0,0,0,360,1], TYPE:'zeusBody6' },
                { POSITION:[14.94,0,0,0,360,1], TYPE:'zeusBody5' },
                { POSITION:[12.94,0,0,0,360,1], TYPE:'zeusBody4' },
                { POSITION:[10.94,0,0,0,360,1], TYPE:'zeusBody3' },
                { POSITION:[8.94,0,0,0,360,1],  TYPE:'zeusBody2' },
                { POSITION:[6.94,0,0,0,360,1],  TYPE:'zeusBody1' },
            ];
            for (let i = 0.5; i < 17; i++) {
                tr.push({ POSITION:[4,9,0,(360*i)/17,0,0], TYPE:['baseTrapTurret',{INDEPENDENT:true,AUTOFIRE:true}] });
            }
            return tr;
        })(),
        GUNS: [],
    };

// ════════════════════════════════════════════════════════════════════════
//  MENU + HOOK
// ════════════════════════════════════════════════════════════════════════

    Class.bossMenu_BOSSES = {
        PARENT: ['genericTank'],
        LABEL: 'Super Bosses',
        COLOR: 'darkGrey',
        SIZE: 16, GUNS: [], TURRETS: [],
        UPGRADES_TIER_0: ['ultimateTwinMKX', 'zeus'],
    };

    const _entry = ['menu_addons','addons','developer']
        .find(n => Class[n] && Array.isArray(Class[n].UPGRADES_TIER_0));
    if (_entry) {
        Class[_entry].UPGRADES_TIER_0.push('bossMenu_BOSSES');
        console.log('[bosses] Connected to ' + _entry);
    } else {
        console.warn('[bosses] Connect bossMenu_BOSSES manually.');
    }

    console.log('[bosses] Ultimate Twin-MKX and Zeus loaded!');
};