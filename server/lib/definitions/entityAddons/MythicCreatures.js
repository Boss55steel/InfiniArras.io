const { combineStats } = require('../facilitators.js');
const _constants = require('../constants.js');
const { smshskl, base } = _constants;
const g = require('../gunvals.js');

// Safe combineStats wrapper
const safeStats = (stats) => combineStats(Array.isArray(stats) ? stats.filter(s => s != null) : [stats].filter(s => s != null));

// Gunval fallbacks
if (!g.satellite) g.satellite = { reload: 0.5, recoil: 0, speed: 2, maxSpeed: 2, health: 10, damage: 0.5, range: 0.8 };
if (!g.pounder)   g.pounder   = { reload: 1.5, recoil: 1.5, speed: 0.7, maxSpeed: 0.7, health: 2, damage: 2, size: 1.3 };
if (!g.power)     g.power     = { damage: 1.5, pen: 1.5, health: 1.5 };

const MC_base = {
    ACCEL: 0.0001 * base.ACCEL,
    SPEED: 1.8 * base.SPEED,
    HEALTH: 4 * base.HEALTH,
    DAMAGE: 3 * base.DAMAGE,
    RESIST: 2.4 * base.RESIST,
    PENETRATION: 0.8 * base.PENETRATION,
    SHIELD: 0.4 * base.SHIELD,
    REGEN: 2.6 * base.REGEN,
    FOV: 1.3 * base.FOV,
    DENSITY: 1.2 * base.DENSITY,
};

const MC_stats = {
    statMain:    g.basic,
    statPounder: g.pounder,
    statPower:   g.power,
    statPetal:   g.satellite,
    statNoRecoil: { recoil: 0 },
    statNoRange:  { range: 0.2 },
    statHealth:   { health: 1e6 },
    reloadStat: stat => ({ reload: stat }),
    sizeStat:   stat => ({ size: stat }),
    sprayStat:  stat => ({ spray: stat, shudder: stat }),
    weakStat:   stat => ({ health: stat, damage: stat }),
    speedStat:  stat => ({ maxSpeed: stat, speed: stat }),
};

const MC_names = {
    assets: {},
    differentTeam: true,
    addonAsBase: false,
    color: "black",
    bodyScale: 5.4,
    ticks: 100,
    petals: ["Power", "Space", "Reality", "Soul", "Time", "Mind"],
    existingCodes: [],
    codeLength: 8,
    poisonLength: 60,
    posionDamage: 1,
    defaultSize: 20,
    maxSize: 60,
    gunsCount: 16,
    timeout: 4,
    animation: { INSIDE: -8, OUT: 0 },
};

// ── Helper: safe runtime globals ─────────────────────────────────────────────
const safeEntities   = () => (typeof entities   !== 'undefined' ? entities   : []);
const safeSetTimeout = (fn, t) => { if (typeof setSyncedTimeout !== 'undefined') setSyncedTimeout(fn, t); };
const safeBroadcast  = msg => { try { if (typeof sockets !== 'undefined') sockets.broadcast(msg); } catch(e) {} };
const safeNewEntity  = (body) => { if (typeof Entity !== 'undefined') return new Entity(body); return null; };

module.exports = ({ Class }) => {

    // ── Register custom IO controllers ────────────────────────────────────────
    // Guard: only register if the ioTypes global exists (OSA server exposes this)
    if (typeof ioTypes !== 'undefined') {
        if (!ioTypes['MC_orbitEntity']) {
            ioTypes['MC_orbitEntity'] = class {
                constructor(body) {
                    this.body = body;
                    this.norDistance = 2;
                    this.body.dist = this.norDistance * this.body.size;
                    this.body.inverseDist = this.norDistance * this.body.size - this.body.dist + this.norDistance * this.body.size;
                    this.body.angle = 0;
                }
                think() {
                    this.body.angle += (this.body.skill.spd * 2 + (this.body.aiSettings.SPEED || 1)) * Math.PI / 180;
                    this.body.dist = this.norDistance * this.body.size;
                }
            };
        }
        if (!ioTypes['MC_orbit']) {
            ioTypes['MC_orbit'] = class {
                constructor(body) {
                    this.body = body;
                    this.realDist = 0;
                    this.invert = false;
                }
                think() {
                    let invertFactor = this.invert ? -1 : 1,
                        master = this.body.master && this.body.master.master,
                        dist = master ? (this.invert ? master.inverseDist : master.dist) : 0,
                        angle = (this.body.angle * Math.PI / 180 + (master ? master.angle : 0)) * invertFactor;
                    if (this.realDist > dist) this.realDist -= Math.min(10, Math.abs(this.realDist - dist));
                    else if (this.realDist < dist) this.realDist += Math.min(10, Math.abs(dist - this.realDist));
                    if (master) {
                        this.body.x = master.x + Math.cos(angle) * this.realDist;
                        this.body.y = master.y + Math.sin(angle) * this.realDist;
                    }
                    this.body.facing = angle;
                }
            };
        }
    }

    // ── MC_functions ──────────────────────────────────────────────────────────
    const MC_functions = {
        clamp: (value, min, max) => Math.min(Math.max(value, min), max),

        deepCopy: obj => {
            if (obj == null || typeof obj !== 'object') return obj;
            if (Array.isArray(obj)) return obj.map(MC_functions.deepCopy);
            let out = {};
            for (let key in obj) if (obj.hasOwnProperty(key)) out[key] = MC_functions.deepCopy(obj[key]);
            return out;
        },

        generateCode: () => {
            let chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789", code;
            do {
                code = "";
                for (let i = 0; i < MC_names.codeLength; i++)
                    code += chars[Math.floor(Math.random() * chars.length)];
            } while (MC_names.existingCodes.includes(code));
            MC_names.existingCodes.push(code);
            return code;
        },

        // body.guns may be an array, object, Map, or Set depending on OSA version
        toGunArray: guns => {
            if (!guns) return [];
            if (Array.isArray(guns)) return guns;
            if (guns instanceof Map) return Array.from(guns.values());
            if (guns instanceof Set) return Array.from(guns);
            if (typeof guns === 'object') return Object.values(guns);
            return [];
        },
        enableGuns:    (guns, tag = false) => {
            let arr = MC_functions.toGunArray(guns);
            (tag ? arr.filter(g => g._tag == tag) : arr).forEach(g => g._charged = true);
        },
        disableGuns:   (guns, tag = false) => {
            let arr = MC_functions.toGunArray(guns);
            (tag ? arr.filter(g => g._tag == tag) : arr).forEach(g => g._charged = false);
        },
        isGunsDisabled:(guns, tag = false) => {
            let arr = MC_functions.toGunArray(guns);
            return arr.filter(g => g._charged && (tag ? g._tag == tag : true)).length === 0;
        },

        initGuns: (guns, ...tags) => {
            let arr = MC_functions.toGunArray(guns);
            for (let i = 0; i < tags.length; i++) {
                let tag = tags[i];
                if (Array.isArray(tag)) {
                    let expanded = [];
                    for (let j = 0; j < tag[1]; j++) expanded.push(tag[0]);
                    tags.splice(tags.indexOf(tag), 1, ...expanded);
                }
            }
            for (let i = 0; i < arr.length; i++) {
                let gun = arr[i];
                if (!gun) continue;
                if (tags.length) gun._tag = tags[i] || tags[tags.length - 1];
                gun._fire = gun.fire || (() => {});
                gun._charged = true;
                gun.fire = (gx, gy, sk) => { if (gun._charged && gun._fire) gun._fire(gx, gy, sk); };
            }
        },

        handler: name => safeBroadcast(`A ${name} has arrived!`),

        onComponent: charge => ({
            fire: body => {
                if (charge) {
                    body._charges--;
                    if (!body._charges) MC_functions.disableGuns(body.guns);
                } else {
                    if (MC_functions.isGunsDisabled(body.guns, "secondary") && body._tickTime) body._tickTime--;
                }
            },
            tick: body => {
                if (charge) {
                    if (MC_functions.isGunsDisabled(body.guns)) {
                        if (body._charges < body._maxCharges && !body._tickTime) {
                            body._tickTime = MC_names.ticks * body._maxCharges;
                            body._charges++;
                            if (body._charges >= body._maxCharges) MC_functions.enableGuns(body.guns);
                        }
                        if (body._tickTime) body._tickTime--;
                    }
                } else {
                    if (MC_functions.isGunsDisabled(body.guns, "main") && body._tickTime) body._tickTime--;
                    if (!body._tickTime) {
                        if (MC_functions.isGunsDisabled(body.guns, "main")) {
                            body._tickTime = MC_names.ticks;
                            MC_functions.disableGuns(body.guns, "secondary");
                            MC_functions.enableGuns(body.guns, "main");
                        } else {
                            body._tickTime = MC_names.ticks * 10;
                            MC_functions.enableGuns(body.guns, "secondary");
                            MC_functions.disableGuns(body.guns, "main");
                        }
                    }
                }
            },
            define: body => {
                body._tickTime = 0;
                if (charge) {
                    body._maxCharges = charge;
                    body._charges = body._maxCharges;
                    MC_functions.initGuns(body.guns);
                } else {
                    MC_functions.initGuns(body.guns, "main", ["secondary", MC_names.gunsCount], "main");
                    MC_functions.disableGuns(body.guns, "main");
                }
            },
        }),

        typeComponent: type => {
            switch (type) {
                case "Blast":    return [MC_stats.statMain, MC_stats.statPounder, MC_stats.statNoRange, MC_stats.sprayStat(0), MC_stats.speedStat(6.8)];
                case "NoBlast":  return [MC_stats.statMain, MC_stats.statNoRange, MC_stats.speedStat(0.1), MC_stats.reloadStat(8)];
                case "BigBlast": return [MC_stats.statMain, MC_stats.statPounder, MC_stats.statPower, MC_stats.sizeStat(1.2)];
                case "Short":    return [MC_stats.statMain, MC_stats.statPounder, MC_stats.statNoRange];
                case "Long":     return [MC_stats.statMain, MC_stats.statNoRange, MC_stats.statNoRecoil, MC_stats.reloadStat(0.1), MC_stats.sprayStat(0.1), MC_stats.speedStat(6)];
                default: throw new Error(`Unsupported type: ${type}`);
            }
        },

        gunArray: (callback, count) => {
            let out = [];
            for (let i = 0; i < count; i++) {
                let w = callback(i);
                if (!Array.isArray(w)) w = [w];
                out.push(...w);
            }
            return out;
        },

        isCompatible: def => {
            let number = 0;
            for (let key in def.BODY) if (def.BODY.hasOwnProperty(key)) number += def.BODY[key];
            return number >= 1 && number <= MC_names.maxSize / MC_names.defaultSize ? number : false;
        },

        // ── Class creators ──────────────────────────────────────────────────
        createClassBase: base => ({
            PARENT: ["genericTank"],
            UPGRADE_TOOLTIP: `${base.UPGRADE_TOOLTIP ? base.UPGRADE_TOOLTIP + " " : ""}Art by Felyn_de_fens`,
            SHAPE: base.name
                ? (MC_names.assets[base.name]
                    ? `${MC_names.assets[base.name]}.png`
                    : `https://raw.githubusercontent.com/ClashTest311/MC-addon/main/assets/${base.name}.png`)
                : 0,
            SIZE: MC_names.defaultSize * (base.sizeFactor ?? 1),
            COLOR: base.COLOR ?? MC_names.color,
            BODY: base.BODY ?? MC_base,
            LABEL: base.name ?? "",
            LEVEL_CAP: 120,
            SKILL_CAP: Array(10).fill(smshskl),
            GUNS: [{
                POSITION: [1, 3, 1, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: safeStats(base.stats),
                    TYPE: base.type,
                },
            }],
            ON: [],
        }),

        createClassLaser: laser => ({
            PARENT: ["bullet"],
            COLOR: (laser && laser.COLOR) ?? MC_names.color,
            SHAPE: "M -4 0.5 L -4 -0.5 L 3 -1 L 3 1",
            BORDERLESS: true,
            ON: [{
                event: "tick",
                handler: ({ body }) => { body.SIZE += 1.2; },
            }],
        }),

        createClassPetal: petal => ({
            TYPE: "satellite",
            CONTROLLERS: ["MC_orbit"],
            MOTION_TYPE: "motor",
            FACING_TYPE: "spin",
            COLOR: `${petal.toLowerCase()}Stone`,
            CLEAR_ON_MASTER_UPGRADE: true,
            ACCEPTS_SCORE: false,
            DRAW_HEALTH: false,
            LAYER: 13,
            SHAPE: 6,
            BODY: { PUSHABILITY: 0.6, ACCELERATION: 0.75, HEALTH: 1e6, DAMAGE: 0, SPEED: 10, RANGE: 200 },
        }),

        createClassDeveloper: name => {
            let turret = { PARENT: ["genericTank"] };
            let output = Object.assign(MC_functions.deepCopy(Class[name] || {}), {
                CONTROLLERS: ["MC_orbitEntity"],
                HAS_NO_RECOIL: true,
                LEVEL: 120,
                AI: { SPEED: 2 },
                TURRETS: [{
                    POSITION: [8, 0, 0, 0, 0, 0],  // array format instead of object
                    TYPE: turret,
                }],
            });
            for (let i = 0; i < 6; i++) MC_functions.create({ gun: "Petal" }, i, turret);
            return output;
        },

        // ── Gun creators ────────────────────────────────────────────────────
        createGunPetal: petal => [{
            POSITION: [1, 12, 1, 0, 0, 0, petal * 0.25],
            PROPERTIES: {
                SHOOT_SETTINGS: safeStats([MC_stats.statPetal]),
                TYPE: [`MC_petal${MC_names.petals[petal]}`, { ANGLE: petal * 60 }],
                SYNCS_SKILLS: false,
                WAIT_TO_CYCLE: true,
                AUTOFIRE: true,
                MAX_CHILDREN: 1,
            },
        }],

        createGunTail: tail => [{
            POSITION: [1, 18, 1, 0, 0, 180, (tail && tail.TIMEOUT != null ? tail.TIMEOUT : MC_names.timeout)],
            PROPERTIES: {
                SHOOT_SETTINGS: safeStats([MC_stats.statMain, MC_stats.statNoRange, MC_stats.reloadStat(0.2)]),
                TYPE: ["bullet", { COLOR: (tail && tail.COLOR) ?? MC_names.color }],
                AUTOFIRE: true,
            },
        }],

        createGunFireRange: fireRange => [{
            POSITION: [1, 18, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: safeStats([MC_stats.statMain, MC_stats.statPounder, MC_stats.statPower, MC_stats.reloadStat(0.2), MC_stats.sprayStat(2)]),
                TYPE: MC_functions.create({ gun: "Tail" }, {
                    TIMEOUT: (fireRange && fireRange.TIMEOUT) ?? MC_names.timeout,
                    COLOR: (fireRange && fireRange.COLOR) ?? MC_names.color,
                }, {
                    PARENT: ["bullet"],
                    COLOR: (fireRange && fireRange.COLOR) ?? MC_names.color,
                }),
                AUTOFIRE: true,
            },
        }],

        createGunAnimation: animation => MC_functions.gunArray(angle => ({
            POSITION: [1, 1.3, 1, MC_names.animation[animation.TYPE ?? 0] ?? 0, 0, 360 / MC_names.gunsCount * angle, Math.random()],
            PROPERTIES: {
                SHOOT_SETTINGS: safeStats([MC_stats.statMain, MC_stats.statNoRange, MC_stats.statNoRecoil, MC_stats.statHealth, MC_stats.sprayStat(0), MC_stats.reloadStat(6), MC_stats.speedStat(0.5)]),
                ALPHA: 0,
                TYPE: ["bullet", { COLOR: (animation && animation.COLOR) ?? MC_names.color, ALPHA: 0.6 }],
                AUTOFIRE: (animation && animation.AUTOFIRE != null) ? animation.AUTOFIRE : true,
            },
        }), MC_names.gunsCount),

        // ── Event creators ──────────────────────────────────────────────────
        createEventPoison: poison => ({
            event: "death",
            handler: ({ body }) => {
                let instances = [];
                for (let instance of safeEntities()) {
                    let dx = instance.x - body.x, dy = instance.y - body.y, d2 = dx*dx + dy*dy;
                    if (!instance.isArenaCloser && !instance.poisoned && !instance.invuln &&
                        instance.id != body.id && instance.team != body.team &&
                        d2 <= (body.size / 12 * 100) ** 2 &&
                        (instance.type == "miniboss" || instance.type == "tank" || instance.type == "food")) {
                        instance.poisoned = true;
                        instances.push(instance);
                    }
                }
                if (instances.length) {
                    for (let i = 1; i < (poison && poison.POISON != null ? poison.POISON : MC_names.poisonLength); i += 10) {
                        safeSetTimeout(() => {
                            instances.forEach(e => {
                                if (i + 10 >= (poison && poison.POISON != null ? poison.POISON : MC_names.poisonLength)) e.poisoned = false;
                                e.damageReceived += ((poison && poison.DAMAGE != null ? poison.DAMAGE : MC_names.posionDamage)) * 3;
                            });
                        }, i);
                    }
                }
            },
        }),

        createEventFirework: firework => ({
            event: "death",
            handler: ({ body }) => {
                let e = safeNewEntity(body);
                if (!e) return;
                e.define && MC_functions.define(e, {
                    PARENT: ["genericTank"],
                    COLOR: (firework && firework.COLOR) ?? MC_names.color,
                    SIZE: body.SIZE,
                    ALPHA: 0,
                    BODY: { HEALTH: 1e6, DAMAGE: 0 },
                    GUNS: MC_functions.gunArray(angle => [{
                        POSITION: [1, 18, 1, 0, 0, 360 / MC_names.gunsCount * angle, 0],
                        PROPERTIES: { SHOOT_SETTINGS: safeStats([MC_stats.statMain, MC_stats.statPounder, MC_stats.statPower, MC_stats.statHealth, MC_stats.speedStat(1.2)]), TYPE: "bullet", AUTOFIRE: true },
                    }, {
                        POSITION: [1, 18, 1, 0, 0, 360 / MC_names.gunsCount * angle, 0],
                        PROPERTIES: { SHOOT_SETTINGS: safeStats([MC_stats.statMain, MC_stats.statPounder, MC_stats.statPower, MC_stats.statHealth, MC_stats.speedStat(0.8)]), TYPE: "bullet", AUTOFIRE: true },
                    }], MC_names.gunsCount),
                });
                e.team = body.team;
                safeSetTimeout(() => e.kill(), 12);
            },
        }),

        createEventWhirlpool: () => ({
            event: "death",
            handler: ({ body }) => {
                let e = safeNewEntity(body);
                if (!e) return;
                e.define && MC_functions.define(e, {
                    PARENT: ["genericTank"],
                    ARENA_CLOSER: true,
                    SIZE: body.SIZE * 24,
                    COLOR: "blue",
                    ALPHA: 0.4,
                    BODY: { HEALTH: 1e6, DAMAGE: 0 },
                    ON: [MC_functions.createEventDrag()],
                });
                e.team = body.team;
                safeSetTimeout(() => e.kill(), 24);
            },
        }),

        createEventDrag: () => ({
            event: "tick",
            handler: ({ body }) => {
                for (let instance of safeEntities()) {
                    let dx = instance.x - body.x, dy = instance.y - body.y, d2 = dx*dx + dy*dy;
                    if (!instance.isDominator && !instance.isArenaCloser && !instance.invuln &&
                        instance.id != body.id && instance.team != body.team &&
                        d2 <= (body.size / 12 * 20) ** 2 &&
                        (instance.type == "miniboss" || instance.type == "tank" || instance.type == "food")) {
                        let force = (1 - (1 / (15000 / d2 ** (1/20)))) + 0.001;
                        instance.velocity.x += MC_functions.clamp(body.x - instance.x, -90, 90) * instance.damp * force;
                        instance.velocity.y += MC_functions.clamp(body.y - instance.y, -90, 90) * instance.damp * force;
                    }
                }
            },
        }),

        createEventKill: () => ({
            event: "tick",
            handler: ({ body }) => {
                for (let instance of safeEntities()) {
                    let dx = instance.x - body.x, dy = instance.y - body.y, d2 = dx*dx + dy*dy;
                    if (!instance.isDominator && !instance.isArenaCloser && !instance.invuln &&
                        instance.id != body.id && instance.team != body.team &&
                        d2 <= (body.size / 12 * 100) ** 2 &&
                        (instance.type == "miniboss" || instance.type == "tank")) body.kill();
                }
            },
        }),

        define: (object, definition) => {
            if (typeof definition === "string" && definition in Class) definition = Class[definition];
            if (typeof definition !== "object") throw new Error(`${definition} doesn't exist`);
            let output = {};
            if (definition.PARENT) {
                let parents = Array.isArray(definition.PARENT) ? definition.PARENT : [definition.PARENT];
                for (let p of parents) MC_functions.define(object, p);
            }
            for (let key in definition) {
                if (definition.hasOwnProperty(key) && key !== "PARENT") output[key] = definition[key];
            }
            if (object.define) object.define(output);
        },

        create: (type, args, parent = { PARENT: ["bullet"] }) => {
            if (typeof parent === "string") parent = Class[parent] || { PARENT: ["bullet"] };
            let name = MC_functions.generateCode(), funcType = "", func;

            if (type.event) { funcType = "event"; func = MC_functions[`createEvent${type.event}`]; }
            if (type.class) { funcType = "class"; func = MC_functions[`createClass${type.class}`]; }
            if (type.gun)   { funcType = "gun";   func = MC_functions[`createGun${type.gun}`]; }
            if (!funcType)  return parent;
            if (typeof func !== "function") { console.warn(`[MC] Unknown type: ${JSON.stringify(type)}`); return parent; }

            switch (funcType) {
                case "gun":
                    if (!parent.GUNS) parent.GUNS = [];
                    try { parent.GUNS.push(...func(args)); } catch(e) { try { parent.GUNS.push(...func()); } catch(e2) {} }
                    break;
                case "event":
                    if (!parent.ON) parent.ON = [];
                    try { parent.ON.push(func(args)); } catch(e) { try { parent.ON.push(func()); } catch(e2) {} }
                    break;
                case "class":
                    try { parent = func(args); } catch(e) { try { parent = func(); } catch(e2) {} }
                    break;
            }
            Class[name] = parent;
            return name;
        },

        parse: (def, defName) => {
            if (!Array.isArray(def.TYPE)) def.TYPE = [def.TYPE];
            let args = { COLOR: def.COLOR, TIMEOUT: def.TIMEOUT, POISON: 60, DAMAGE: MC_names.bodyScale },
                sizeFactor = MC_functions.isCompatible(def),
                type = MC_functions.create(def.TYPE[1] ? def.TYPE[1] : {}, args),
                stats = MC_functions.typeComponent(def.TYPE[0]);

            if (!sizeFactor) { console.warn(`[MC] BODY in ${defName} isn't compatible, defaulting to 1`); sizeFactor = 1; }

            for (let key in MC_base) {
                if (MC_base.hasOwnProperty(key)) {
                    def.BODY[key] = def.BODY.hasOwnProperty(key)
                        ? def.BODY[key] * MC_base[key] * MC_names.bodyScale
                        : MC_base[key];
                }
            }

            Class[defName] = Class[MC_functions.create({ class: "Base" }, {
                UPGRADE_TOOLTIP: def.UPGRADE_TOOLTIP,
                COLOR: def.COLOR,
                BODY: def.BODY,
                sizeFactor, stats,
                name: defName,
                type,
            })];

            if (MC_names.differentTeam) Class[defName].TEAM = -10;

            for (let gun of def.GUNS) MC_functions.create(gun, args, type);

            for (let item of def.ANIMATION) {
                MC_functions.create({ gun: "Animation" }, {
                    AUTOFIRE: item.AUTOFIRE,
                    TYPE: item.TYPE,
                    COLOR: def.COLOR,
                }, defName);
            }

            for (let key in def.ON) {
                if (!def.ON.hasOwnProperty(key)) continue;
                if (key === "fire" || key === "tick" || key === "define" || key === "death") {
                    if (!Class[defName].ON) Class[defName].ON = [];
                    Class[defName].ON.push({
                        event: key,
                        handler: ({ body }) => {
                            def.ON[key](body);
                            if (key === "define") MC_functions.handler(defName);
                        },
                    });
                } else {
                    // onComponent returns an object with fire/tick/define — register each
                    let comp = def.ON;
                    if (!Class[defName].ON) Class[defName].ON = [];
                    if (comp.fire)   Class[defName].ON.push({ event: "fire",   handler: ({ body }) => comp.fire(body) });
                    if (comp.tick)   Class[defName].ON.push({ event: "tick",   handler: ({ body }) => comp.tick(body) });
                    if (comp.define) Class[defName].ON.push({ event: "define", handler: ({ body }) => comp.define(body) });
                    break; // onComponent covers all keys at once
                }
            }
        },

        log: (...msg) => console.log(`[MC] ${msg.join(', ')}`),
    };

    // ── Creature definitions ──────────────────────────────────────────────────
    const MC_definitions = {
        Toothless: {
            UPGRADE_TOOLTIP: "The unholy offspring of lightning and death itself.",
            GUNS: [{ gun: "Tail" }, { event: "Firework" }],
            TYPE: ["Blast", { event: "Kill" }],
            BODY: { SPEED: 1 },
            ON: MC_functions.onComponent(6),
            COLOR: "purple",
            ANIMATION: [],
            TIMEOUT: 4,
        },
        Stormfly: {
            UPGRADE_TOOLTIP: "I don't know what I would do without Stormfly.",
            GUNS: [{ gun: "FireRange" }],
            TYPE: "Short",
            BODY: { HEALTH: 0.6, DAMAGE: 0.4 },
            ON: MC_functions.onComponent(8),
            COLOR: "#fff242",
            ANIMATION: [],
            TIMEOUT: 4,
        },
        Hookfang: {
            UPGRADE_TOOLTIP: "Five-thousand pounds of flaming muscle coming through!",
            GUNS: [{ gun: "FireRange" }],
            TYPE: "Short",
            BODY: { HEALTH: 0.4, DAMAGE: 0.6 },
            ON: MC_functions.onComponent(8),
            COLOR: "red",
            ANIMATION: [],
            TIMEOUT: 4,
        },
        Meatlug: {
            UPGRADE_TOOLTIP: "Who's my little princess?",
            GUNS: [{ gun: "Tail" }],
            TYPE: "BigBlast",
            BODY: { HEALTH: 0.5, DAMAGE: 0.5 },
            ON: MC_functions.onComponent(6),
            COLOR: "brown",
            ANIMATION: [],
            TIMEOUT: 15,
        },
        Phoenix: {
            UPGRADE_TOOLTIP: "You haven't seen anything like this before...",
            GUNS: [{ gun: "Tail" }, { event: "Poison" }],
            TYPE: "BigBlast",
            BODY: { HEALTH: 0.5, DAMAGE: 0.5 },
            ON: MC_functions.onComponent(6),
            COLOR: "#ff6200",
            ANIMATION: [],
            TIMEOUT: 15,
        },
        Kraken: {
            UPGRADE_TOOLTIP: "The danger of the seas.",
            GUNS: [],
            TYPE: ["NoBlast", { event: "Whirlpool" }],
            BODY: { DAMAGE: 0.5, HEALTH: 0.5 },
            ON: MC_functions.onComponent(6),
            COLOR: "green",
            ANIMATION: [],
            TIMEOUT: 0,
        },
        Yeti: {
            UPGRADE_TOOLTIP: "The Yeti?",
            GUNS: [],
            TYPE: "BigBlast",
            BODY: { HEALTH: 0.6, DAMAGE: 0.4 },
            ON: MC_functions.onComponent(10),
            COLOR: "gray",
            ANIMATION: [],
            TIMEOUT: 0,
        },
        Skrill: {
            UPGRADE_TOOLTIP: "I would never torture that dragon.",
            GUNS: [],
            TYPE: ["Blast", { class: "Laser" }],
            BODY: { DAMAGE: 0.4, HEALTH: 0.4, SPEED: 0.2 },
            ON: MC_functions.onComponent(10),
            COLOR: "blue",
            ANIMATION: [],
            TIMEOUT: 0,
        },
        Godzilla: {
            UPGRADE_TOOLTIP: "Godzilla have been awakened.",
            GUNS: [],
            TYPE: ["Long", { class: "Laser" }],
            BODY: { HEALTH: 1, DAMAGE: 0.8 },
            ON: MC_functions.onComponent(0),
            COLOR: "#cb42f5",
            ANIMATION: [{ TYPE: "INSIDE", AUTOFIRE: true }, { TYPE: "OUT", AUTOFIRE: false }],
            TIMEOUT: 0,
        },
        Shimu: {
            UPGRADE_TOOLTIP: "Not as strong as you might think...",
            GUNS: [{ event: "Poison" }],
            TYPE: ["Long", { class: "Laser" }],
            BODY: { HEALTH: 1.2, DAMAGE: 0.6 },
            ON: MC_functions.onComponent(0),
            COLOR: "#b0ceff",
            ANIMATION: [{ TYPE: "INSIDE", AUTOFIRE: true }, { TYPE: "OUT", AUTOFIRE: false }],
            TIMEOUT: 0,
        },
    };

    // ── Build petal classes ───────────────────────────────────────────────────
    for (let i = 0; i < MC_names.petals.length; i++) {
        let petal = MC_names.petals[i];
        Class[`MC_petal${petal}`] = Class[MC_functions.create({ class: "Petal" }, petal)];
    }

    // ── Build MC menu nodes ───────────────────────────────────────────────────
    Class.MC_developer = {
        PARENT: ["genericTank"],
        LABEL: "MC Developer Edition",
        COLOR: "black",
        LEVEL: 0,
        UPGRADES_TIER_0: [],
    };
    Class.MC = {
        PARENT: ["genericTank"],
        LABEL: "MC",
        COLOR: "black",
        LEVEL: 0,
        UPGRADES_TIER_0: [],
    };

    // ── Parse all creatures ───────────────────────────────────────────────────
    for (let key in MC_definitions) {
        if (!MC_definitions.hasOwnProperty(key)) continue;
        try {
            MC_functions.parse(MC_definitions[key], key);
            Class[`${key}_developer`] = Class[MC_functions.create({ class: "Developer" }, key)];
            Class.MC_developer.UPGRADES_TIER_0.push(`${key}_developer`);
            Class.MC.UPGRADES_TIER_0.push(key);
        } catch(e) {
            console.warn(`[MC] Failed to parse ${key}: ${e.message}`);
        }
    }

    // ── Build upgrade tiers by size ───────────────────────────────────────────
    let sizes = [];
    for (let key in MC_definitions) if (MC_definitions.hasOwnProperty(key) && Class[key]) sizes.push(Class[key].SIZE);
    sizes = [...new Set(sizes)].sort((a, b) => a - b);

    const addSize = (index, name) => {
        if (index >= sizes.length || !Class[name]) return;
        Class[name][`UPGRADES_TIER_${(index + 1) * 2}`] = [];
        for (let key in MC_definitions) {
            if (MC_definitions.hasOwnProperty(key) && Class[key] && Class[key].SIZE === sizes[index]) {
                Class[name][`UPGRADES_TIER_${(index + 1) * 2}`].push(key);
                addSize(index + 1, key);
            }
        }
    };

    // ── Hook into arenaCloser upgrade tree ────────────────────────────────────
    const _entry = ["arenaCloser", "arena_closer", "menu_addons"]
        .find(n => Class[n] && Class[n].UPGRADES_TIER_0);
    if (_entry) {
        Class[_entry].UPGRADES_TIER_0.push("MC");
        Class[_entry].UPGRADES_TIER_0.push("MC_developer");
    } else if (Class.arenaCloser) {
        Class.arenaCloser.UPGRADES_TIER_0 = ["MC", "MC_developer"];
    } else {
        console.warn("[MC] Could not find arenaCloser to attach MC menu — connect manually");
    }

    MC_functions.log('Mythic Creatures addon registered successfully.');
};