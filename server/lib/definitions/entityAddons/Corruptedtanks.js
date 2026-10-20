module.exports = ({ Class, Config }) => {

    const CFG = {
        usedTanks:      3,
        maxChildren:    8,    // low cap prevents entity spam, make it higher if u want
        labelLength:    20,
        gunsPerTank:    3,
        turretsPerTank: 1,
        propsPerTank:   2,
        tanksPerPage:   7,
        totalPages:     50,   // 50 pages × 7 tanks = 350 tanks
        get poolSize()  { return this.tanksPerPage * this.totalPages; },
    };

    const STRIP_KEYS = new Set([
        'UPGRADES_TIER_0','UPGRADES_TIER_1','UPGRADES_TIER_2','UPGRADES_TIER_3',
        'UPGRADES_TIER_4','UPGRADES_TIER_5','UPGRADES_TIER_6','UPGRADES_TIER_7',
        'ON','CONTROLLERS','AI','LEVEL','LEVEL_CAP','REROOT_UPGRADE_TREE',
        'BATCH_UPGRADES','SPAWN_CLASS','SPAWN_RATE','SPAWNS','MINIONS','SQUAD',
        'BOSS_TYPE','RANDOM_TYPE','SANCTUARY_TYPE','DANGER',
        'FACING_TYPE','MOTION_TYPE','DRAW_HEALTH','DRAW_SHIELD',
        'STAT_NAMES','HITS_OWN_TYPE','CLEAR_ON_MASTER_UPGRADE',
    ]);

    const BOSS_PATTERNS = [
        /boss/i, /legion/i, /destroyer/i, /guardian/i, /summoner/i,
        /fallen/i, /rogue/i, /elite/i, /nest/i, /altar/i, /enemy/i,
        /miniboss/i, /fortress/i, /mothership/i, /carrier/i,
    ];

    const SPAWNER_TYPES = new Set([
        'drone','swarm','minion','trap','autotrap','pillbox','mine',
        'skimmer','thruster','rocketeer','rocket','missile','boomerang',
        'satellite','sat','necro','undead','spawner','legion',
        'factory','engineer','builder','construct',
    ]);

    const isSpawnerType = str => {
        if (!str || typeof str !== 'string') return false;
        const s = str.toLowerCase();
        if (SPAWNER_TYPES.has(s)) return true;
        return s.includes('minion') || s.includes('drone') || s.includes('swarm') ||
               s.includes('spawn')  || s.includes('trap')  || s.includes('mine')  ||
               s.includes('legion') || s.includes('squad') || s.includes('thruster') ||
               s.includes('skimmer')|| s.includes('satellite');
    };

    const getTypeStr = t => {
        if (!t) return '';
        if (typeof t === 'string') return t;
        if (Array.isArray(t) && typeof t[0] === 'string') return t[0];
        return '';
    };

    const collectTypes = obj => {
        if (!obj || typeof obj !== 'object') return [];
        let out = [];
        if (Array.isArray(obj)) {
            if (typeof obj[0] === 'string') out.push(obj[0]);
            for (const v of obj) out.push(...collectTypes(v));
        } else {
            for (const k in obj) {
                if (!Object.prototype.hasOwnProperty.call(obj, k)) continue;
                if (k === 'TYPE') out.push(getTypeStr(obj[k]));
                else out.push(...collectTypes(obj[k]));
            }
        }
        return out.filter(Boolean);
    };

    const isSafeForUse = obj => {
        const types = collectTypes(obj);
        return types.every(t => {
            if (!Class[t] && t !== 'bullet' && t !== 'bullet2') return false;
            if (isSpawnerType(t)) return false;
            return true;
        });
    };

    const deepCopy = (obj, stripMode = false) => {
        if (obj == null || typeof obj !== 'object') return obj;
        if (Array.isArray(obj)) return obj.map(v => deepCopy(v, stripMode));
        let out = {};
        for (let k in obj) {
            if (!Object.prototype.hasOwnProperty.call(obj, k)) continue;
            if (stripMode && STRIP_KEYS.has(k)) continue;
            out[k] = deepCopy(obj[k], stripMode);
        }
        return out;
    };

    const FALLBACKS = [
        'thrusterMinion','skimmerMinion','minionMinion','miniBossMinion',
        'rocketMinion','boomerangMinion','droneMinion','swarmMinion',
        'megaswarm','miniswarm','ultraswarm','hyperdrone','ultradrone',
        'megadrone','minidrone','fastDrone','slowDrone','heavyDrone',
        'poisonBullet','fireBullet','iceBullet','laserBullet',
        'explosiveBullet','shockBullet','megaBullet','miniBullet',
        'autoTrap','pillbox','unsetTrap','auraTrap','auraBlock',
    ];
    for (const fb of FALLBACKS) {
        if (!Class[fb]) Class[fb] = { PARENT: ['bullet'], LABEL: '', GUNS: [] };
    }

    const defs = Object.entries(Class).filter(([name, v]) => {
        if (!v || typeof v !== 'object' || Array.isArray(v)) return false;
        if (!Array.isArray(v.GUNS) && !Array.isArray(v.TURRETS)) return false;
        if (name.startsWith('corrupted')) return false;
        if (BOSS_PATTERNS.some(p => p.test(name))) return false;
        if (v.BOSS_TYPE && v.BOSS_TYPE !== 'None') return false;
        if (v.RANDOM_TYPE && v.RANDOM_TYPE !== 'None') return false;
        if (v.DANGER && v.DANGER >= 6) return false;
        return true;
    });
    if (!defs.length) { console.warn('[corruptedTanks] No valid defs.'); return; }
    console.log(`[corruptedTanks] Source pool: ${defs.length} non-boss definitions`);

    const seededRand = seed => {
        let s = (seed >>> 0) || 0xDEADBEEF;
        return () => { s ^= s << 13; s ^= s >> 17; s ^= s << 5; return (s >>> 0) / 4294967296; };
    };

    const generateTank = (rng, index) => {
        let label = '';
        let base  = deepCopy(defs[rng() * defs.length | 0][1], true);
        base.GUNS    = [];
        base.TURRETS = [];
        base.PROPS   = [];

        for (let i = 0; i < CFG.usedTanks; i++) {
            const entity = defs[rng() * defs.length | 0][1];

            if (typeof entity.LABEL === 'string' && entity.LABEL.length) {
                const chunk = entity.LABEL.substring(0, rng() * entity.LABEL.length | 0);
                if (label.length + chunk.length < CFG.labelLength) label += chunk;
            }


            if (Array.isArray(entity.GUNS)) {
                for (let a = 0; a < CFG.gunsPerTank; a++) {
                    const gun = entity.GUNS[rng() * entity.GUNS.length | 0];
                    if (!gun) continue;
                    if (!isSafeForUse(gun)) continue;
                    if (gun.PROPERTIES) {
                        const sc = gun.PROPERTIES.STAT_CALCULATOR;
                        if (sc && (String(sc).includes('drone') || String(sc).includes('trap'))) continue;
                        if (gun.PROPERTIES.AUTOFIRE && gun.PROPERTIES.MAX_CHILDREN) continue;
                    }
                    const g = deepCopy(gun, false);
                    if (g.PROPERTIES) {
                        g.PROPERTIES.MAX_CHILDREN = 8;
                        g.PROPERTIES.DESTROY_OLDEST_CHILD = true;
                    }
                    base.GUNS.push(g);
                }
            }

            if (Array.isArray(entity.TURRETS)) {
                for (let a = 0; a < CFG.turretsPerTank; a++) {
                    const turret = entity.TURRETS[rng() * entity.TURRETS.length | 0];
                    if (!turret) continue;
                    if (!isSafeForUse(turret)) continue;
                    const t = deepCopy(turret, true);
                    t.MAX_CHILDREN = 8;
                    if (Array.isArray(t.GUNS)) {
                        t.GUNS = t.GUNS.filter(g => g && isSafeForUse(g));
                        for (const g of t.GUNS) {
                            if (g.PROPERTIES) {
                                g.PROPERTIES.MAX_CHILDREN = 8;
                                g.PROPERTIES.DESTROY_OLDEST_CHILD = true;
                            }
                        }
                    }
                    base.TURRETS.push(t);
                }
            }

            if (Array.isArray(entity.PROPS)) {
                for (let a = 0; a < CFG.propsPerTank; a++) {
                    const prop = entity.PROPS[rng() * entity.PROPS.length | 0];
                    if (prop) base.PROPS.push(deepCopy(prop, false));
                }
            }
        }
        base.LABEL                  = label.trim() || `Corrupted #${index}`;
        base.CONTROLLERS            = [];
        base.ON                     = [];
        base.TYPE                   = 'tank';
        base.PARENT                 = ['genericTank'];
        base.DIE_AT_LOW_SPEED       = false;
        base.DIE_AT_RANGE           = false;
        base.INDEPENDENT            = false;
        base.ACCEPTS_SCORE          = true;
        base.CAN_BE_ON_LEADERBOARD  = true;
        base.PASSIVE                = false;
        base.SKILL_CAP              = [9,9,9,9,9,9,9,9,9,9];
        base.MAX_CHILDREN           = 8;
        base.UPGRADES_TIER_0        = [];
        base.BOSS_TYPE              = 'None';
        base.RANDOM_TYPE            = 'None';
        base.SANCTUARY_TYPE         = 'None';
        base.IS_BOSS                = false;
        base.IS_ARENA_CLOSER        = false;
        base.UNKILLABLE             = false;
        base.GOD_MODE               = false;
        base.ARENA_CLOSER           = false;
        base.FACING_TYPE            = 'toTarget';
        base.MOTION_TYPE            = 'motor';
        for (const key of Object.keys(base)) {
            if (/^UPGRADES_TIER_[1-9]/.test(key)) delete base[key];
        }

        return base;
    };

    const globalRng = seededRand(0xC0FFEE42);
    const tankPool  = [];
    console.log(`[corruptedTanks] Generating ${CFG.poolSize} tanks...`);
    for (let i = 0; i < CFG.poolSize; i++) {
        const name = `corruptedTank_${i}`;
        Class[name] = generateTank(globalRng, i);
        tankPool.push(name);
    }
    console.log(`[corruptedTanks] Pool generated.`);

    //Pages
    for (let p = 0; p < CFG.totalPages; p++) {
        const nextPage = `corruptedPage_${(p + 1) % CFG.totalPages}`;
        const prevPage = `corruptedPage_${(p - 1 + CFG.totalPages) % CFG.totalPages}`;
        const navPrev  = `corruptedNav_prev_${p}`;
        const navNext  = `corruptedNav_next_${p}`;
        const slice    = tankPool.slice(p * CFG.tanksPerPage, (p + 1) * CFG.tanksPerPage);

        Class[navPrev] = {
            PARENT: ['genericTank'], LABEL: `◄ Page ${p === 0 ? CFG.totalPages : p}`,
            COLOR: 14, SIZE: 8, GUNS: [], TURRETS: [], CONTROLLERS: [], ON: [],
            UPGRADES_TIER_0: [prevPage],
        };
        Class[navNext] = {
            PARENT: ['genericTank'], LABEL: `Page ${(p + 2 > CFG.totalPages ? 1 : p + 2)} ►`,
            COLOR: 2,  SIZE: 8, GUNS: [], TURRETS: [], CONTROLLERS: [], ON: [],
            UPGRADES_TIER_0: [nextPage],
        };
        Class[`corruptedPage_${p}`] = {
            PARENT: ['genericTank'],
            LABEL: `Corrupted Tanks — Page ${p + 1} / ${CFG.totalPages}`,
            COLOR: 0, SIZE: 12, GUNS: [], TURRETS: [], CONTROLLERS: [], ON: [],
            UPGRADES_TIER_0: [navPrev, navNext, ...slice],
        };
    }

    Class.corruptedLobby = {
        PARENT: ['genericTank'],
        LABEL: 'Corrupted Tanks',
        UPGRADE_LABEL: 'Corrupted',
        COLOR: 8, SIZE: 20, LEVEL: 45,
        GUNS: [], TURRETS: [], CONTROLLERS: [],
        SKILL_CAP: Array(10).fill(0),
        UPGRADES_TIER_0: ['corruptedPage_0'],
        ON: [{
            event: 'define',
            handler: ({ body }) => {
                try {
                    const startPage = ((body.id || 0) >>> 0) % CFG.totalPages;
                    body.UPGRADES_TIER_0 = [`corruptedPage_${startPage}`];
                } catch(e) {}
            },
        }],
    };

    const BOSS_TYPE_VALS = new Set(['miniboss','boss','mothership']);
    Class.corruptedBossKiller = {
        PARENT: ['genericTank'],
        LABEL: '',
        SIZE: 0,
        ALPHA: 0,
        INDEPENDENT: true,
        GUNS: [],
        TURRETS: [],
        CONTROLLERS: [],
        ON: [{
            event: 'define',
            handler: ({ body }) => { body._bossKillTick = 0; },
        }, {
            event: 'tick',
            handler: ({ body }) => {
                body._bossKillTick = (body._bossKillTick || 0) + 1;
                if (body._bossKillTick % 300 !== 0) return;
                try {
                    if (typeof entities === 'undefined') return;
                    for (const e of entities) {
                        if (!e || !e.type || e.isPlayer) continue;
                        const t = String(e.type).toLowerCase();
                        if (t === 'miniboss' || t === 'boss' ||
                            t.includes('legion') || t.includes('guardian') ||
                            (e.isBoss === true)) {
                            try { e.kill(); } catch(_) {}
                        }
                    }
                } catch(_) {}
            },
        }],
    };

    const entry = ['menu_addons']
        .find(n => Class[n] && Array.isArray(Class[n].UPGRADES_TIER_0));
    if (entry) {
        Class[entry].UPGRADES_TIER_0.push('corruptedLobby');
        console.log(`[corruptedTanks] Attached to ${entry}`);
    } else {
        console.warn('[corruptedTanks] Could not find addons menu — connect corruptedLobby manually');
    }

    //Config.SPAWN_CLASS = 'corruptedLobby';

    // ── 24-hour restart (hopefully) ──────────────────────
    const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;
    const restartTimer = setTimeout(() => {
        try {
            const currentSpawn = Config.SPAWN_CLASS || '';
            if (currentSpawn !== 'corruptedLobby') {
                console.log('[corruptedTanks] Restart skipped — not in Corrupted Tanks mode.');
                return;
            }
            console.log('[corruptedTanks] 24 hours elapsed — restarting server for fresh tank pool...');
            setTimeout(() => process.exit(0), 3000);
        } catch(e) {
            console.warn('[corruptedTanks] Restart error:', e.message);
            process.exit(0);
        }
    }, TWENTY_FOUR_HOURS);

    if (restartTimer.unref) restartTimer.unref();

    console.log('[corruptedTanks] ══════════════════════════════════════════════');
    console.log(`[corruptedTanks] ${CFG.poolSize} tanks | ${CFG.totalPages} pages | ${CFG.tanksPerPage}/page`);
    console.log('[corruptedTanks] Auto-restart: every 24h (Corrupted Tanks mode only)');
    const restartAt = new Date(Date.now() + TWENTY_FOUR_HOURS);
    console.log(`[corruptedTanks] Next restart scheduled: ${restartAt.toLocaleString()}`);
    console.log('[corruptedTanks] ══════════════════════════════════════════════');
};