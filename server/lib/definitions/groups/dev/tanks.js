const {combineStats, LayeredBoss, makeAura, makeAuto, makeMenu, makeRadialAuto, makeTurret, weaponMirror} = require('../../facilitators.js')
const {base, basePolygonDamage, basePolygonHealth, dfltskl, statnames} = require('../../constants.js')
const g = require('../../gunvals.js')

// Main Developer Tank
Class.developer = {
    PARENT: 'genericTank',
    LABEL: "Developer",
    BODY: {
        SHIELD: 1000,
        REGEN: 10,
        HEALTH: 100,
        DAMAGE: 10,
        DENSITY: 20,
        FOV: 2,
    },
    //COLOR: "mirror", // todo: make sure mirror colour doesnt grey out your leaderboard
    SKILL_CAP: Array(10).fill(dfltskl),
    IGNORED_BY_AI: true,
    RESET_CHILDREN: true,
    ACCEPTS_SCORE: true,
    CAN_BE_ON_LEADERBOARD: true,
    CAN_GO_OUTSIDE_ROOM: false,
    IS_IMMUNE_TO_TILES: false,
    DRAW_HEALTH: true,
    ARENA_CLOSER: true,
    INVISIBLE: [0, 0],
    ALPHA: [0, 1],
    HITS_OWN_TYPE: 'hardOnlyTanks',
    NECRO: false,
    SHAPE: [
        [-1, -0.8],
        [-0.8, -1],
        [0.8, -1],
        [1, -0.8],
        [0.2, 0],
        [1, 0.8],
        [0.8, 1],
        [-0.8, 1],
        [-1, 0.8],
    ],
    GUNS: [
        {
            POSITION: [18, 10, -1.4, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.op]),
                TYPE: 'developerBullet'
            }
        }
    ],
    UPGRADES_TIER_0: [
        'menu_tanks',
        'menu_bosses',
        'spectator',
        'menu_addons',
        'menu_testing',
        'eggGen',
    ]
}

// Spectator
Class.spectator = {
    PARENT: "genericTank",
    LABEL: "Spectator",
    ALPHA: 0,
    CAN_BE_ON_LEADERBOARD: false,
    ACCEPTS_SCORE: false,
    DRAW_HEALTH: false,
    HITS_OWN_TYPE: "never",
    IGNORED_BY_AI: true,
    ARENA_CLOSER: true,
    IS_IMMUNE_TO_TILES: true,
    FULL_INVISIBLE: true,
    CAN_SEE_INVISIBLE_ENTITIES: true,
    TOOLTIP: "Left click to teleport, Right click above or below the screen to change FOV",
    SKILL_CAP: [0, 0, 0, 0, 0, 0, 0, 0, 0, 255],
    BODY: {
        PUSHABILITY: 0,
        SPEED: 5,
        FOV: 2.5,
        DAMAGE: 0,
        HEALTH: 1e100,
        SHIELD: 1e100,
        REGEN: 1e100,
    },
    GUNS: [{
        POSITION: [0,0,0,0,0,0,0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.basic, {reload: 0.2}, g.fake]),
            TYPE: "bullet",
            ALPHA: 0
        }
    }, {
        POSITION: [0, 0, 0, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.basic, { reload: 0.25 }, g.fake]),
            TYPE: "bullet",
            ALPHA: 0,
            ALT_FIRE: true,
        }
    }],
    ON: [{
        event: "fire",
        handler: ({ body }) => {
            body.x = body.x + body.control.target.x
            body.y = body.y + body.control.target.y
        }
    }, {
        event: "altFire",
        handler: ({ body }) => body.FOV = body.y + body.control.target.y < body.y ? body.FOV + 0.5 : Math.max(body.FOV - 0.5, 0.2)
    }]
}

// Moderation
Class.guillotine = {
    PARENT: "spectator",
    LABEL: "Guillotine",
    CAN_GO_OUTSIDE_ROOM: true,
    TOOLTIP: "Use left click to inspect and right click to teleport. Press F to kill the selected entity.",
    GUNS: [
        {
            POSITION: {
                LENGTH: 8,
                WIDTH: 12,
                X: 31
            }
        },
        {
            POSITION: {
                LENGTH: 10,
                WIDTH: 10,
                ASPECT: 1.6,
                X: -5,
                Y: -8,
                ANGLE: 90
            }
        },
        ...weaponMirror({
            POSITION: {
                LENGTH: 40,
                WIDTH: 2,
                Y: 7
            }
        })
    ],
    TURRETS: [
        {
            POSITION: {
                SIZE: 2,
                X: 35,
                LAYER: 1
            },
            TYPE: ["circleHat", {COLOR: "grey"}]
        }
    ]
}
Class.pinballBounceAura2INVIS = {
    PARENT:'aura',
    SHAPE:"",
    BODY:{DAMAGE:0},
    ON: [
        {
            event: "collide",
            handler: ({ instance, other }) => {


                if (other.id != instance.id && other.id != instance.master.id && other.id != instance.source.id && other.LABEL != 'Flail' && instance.master.master.master.socket.player.command.autofire) {

                    let ax0 = instance.x - instance.vx;
                    let ay0 = instance.y - instance.vy;

                    let bx0 = other.x - other.velocity.x;
                    let by0 = other.y - other.velocity.y;

                    let radius = other.size + instance.size * 0.2;
                    let radius2 = radius * radius;

                    let hitLo = -1;
                    let hitHi = -1;

                    for (let i = 1; i < 5; i++) {

                        let t0 = (i - 1) / 4;
                        let t1 = i / 4;

                        let ax = ax0 + instance.vx * t1;
                        let ay = ay0 + instance.vy * t1;

                        let bx = bx0 + other.velocity.x * t1;
                        let by = by0 + other.velocity.y * t1;

                        let dx = bx - ax;
                        let dy = by - ay;

                        if (dx*dx + dy*dy <= radius2) {
                            hitLo = t0;
                            hitHi = t1;
                            break;
                        }
                    }

                    if (hitLo >= 0) {

                        for (let iter = 0; iter < 4; iter++) {

                            let mid = (hitLo + hitHi) * 0.5;

                            let ax = ax0 + instance.vx * mid;
                            let ay = ay0 + instance.vy * mid;

                            let bx = bx0 + other.velocity.x * mid;
                            let by = by0 + other.velocity.y * mid;

                            let dx = bx - ax;
                            let dy = by - ay;

                            if (dx*dx + dy*dy <= radius2)
                                hitHi = mid;
                            else
                                hitLo = mid;
                        }

                        let t = hitHi;

                        let ax = ax0 + instance.vx * t;
                        let ay = ay0 + instance.vy * t;

                        let bx = bx0 + other.velocity.x * t;
                        let by = by0 + other.velocity.y * t;

                        let dx = bx - ax;
                        let dy = by - ay;

                        let len = Math.sqrt(dx*dx + dy*dy) || 1;
                        dx /= len;
                        dy /= len;

                        let rvx = other.velocity.x - instance.vx;
                        let rvy = other.velocity.y - instance.vy;
                        let vn = rvx*dx + rvy*dy;

                        if (vn < 0) {

                            let e = [0, 1, 3][instance.master.master.master.master.golfClubMode ?? 0];

                            bx = ax + dx * radius;
                            by = ay + dy * radius;

                            other.x = bx;
                            other.y = by;

                            let impulse = (1 + e) * vn;
                            other.velocity.x -= impulse * dx;
                            other.velocity.y -= impulse * dy;

                            let remain = 1 - t;
                            other.x += other.velocity.x * remain;
                            other.y += other.velocity.y * remain;
                        }
                    }
                }
            }
        },
        {
            event: 'tick',
            handler: ({ body }) => {
                if (!body.px) {
                     body._size = body.size / body.source.size;
                    Object.defineProperties(body, {
                        x: {
                            get:()=>{return body.source.x},
                            set:(v)=>{},
                            // configurable: true
                        },
                        y: {
                            get:()=>{return body.source.y},
                            set:(v)=>{},
                            // configurable: true
                        },
                        size: {
                            get:() => {return body.source.size * body._size},
                            set:(v)=>{}
                        }
                    });
                   

                }
                body.px ??= body.x;
                body.py ??= body.y;
                body.vx = body.x - body.px;
                body.vy = body.y - body.py;


                body.px = body.x;
                body.py = body.y;
            }
        }
    ]
},
function combineStats(stats) {
    try {
        // Build a blank array of the appropiate length
        let data = {
            reload: 1,
            recoil: 1,
            shudder: 1,
            size: 1,
            health: 1,
            damage: 1,
            pen: 1,
            speed: 1,
            maxSpeed: 1,
            range: 1,
            density: 1,
            spray: 1,
            resist: 1
        };

        for (let object = 0; object < stats.length; object++) {
            let gStat = stats[object];
            if (Array.isArray(gStat)) {
                gStat = {
                    reload: gStat[0], recoil: gStat[1], shudder: gStat[2],
                    size: gStat[3], health: gStat[4], damage: gStat[5],
                    pen: gStat[6], speed: gStat[7], maxSpeed: gStat[8],
                    range: gStat[9], density: gStat[10], spray: gStat[11],
                    resist: gStat[12]
                };
            }
            data.reload *= gStat?.reload ?? 1;
            data.recoil *= gStat?.recoil ?? 1;
            data.shudder *= gStat?.shudder ?? 1;
            data.size *= gStat?.size ?? 1;
            data.health *= gStat?.health ?? 1;
            data.damage *= gStat?.damage ?? 1;
            data.pen *= gStat?.pen ?? 1;
            data.speed *= gStat?.speed ?? 1;
            data.maxSpeed *= gStat?.maxSpeed ?? 1;
            data.range *= gStat?.range ?? 1;
            data.density *= gStat?.density ?? 1;
            data.spray *= gStat?.spray ?? 1;
            data.resist *= gStat?.resist ?? 1;
        }
        return data;
    } catch (err) {
        console.log(err);
        throw JSON.stringify(stats);
    }
}
Class.banHammerHitboxThing = {
    PARENT:'genericTank',
    COLOR:'grey',
    SIZE:24,
    SHAPE:'',
    GUNS: [
        {
            POSITION: [0, 100, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, {recoil:0}]),
                TYPE: "pinballBounceAura2INVIS",
                MAX_CHILDREN:1,
                NO_LIMITATIONS: true,
                AUTOFIRE: true,
                BORDERLESS:true,
                DRAW_FILL:false,
            }
        },
    ],
    ON: [
        {
       event: "tick",
         handler: ({ body }) => {
            body.noclip = true;
         }
        }
     ],
}
Class.hhHitboxThing = {
    PARENT:'genericTank',
    COLOR:'grey',
    SIZE:24,
    SHAPE:'',
    GUNS: [
        {
            POSITION: [0, 100, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, {recoil:0}]),
                TYPE: "pinballBounceAura2INVIS",
                MAX_CHILDREN:1,
                NO_LIMITATIONS: true,
                AUTOFIRE: true,
                BORDERLESS:true,
                DRAW_FILL:false,
            }
        },
    ],
    ON: [
        {
       event: "tick",
         handler: ({ body }) => {
            body.noclip = true;
         }
        }
     ],
}
Class.golf = {
    PARENT: "genericTank",
    LABEL: "Ban Hammer",
    ALPHA: 0,
    CAN_BE_ON_LEADERBOARD: false,
    CAN_GO_OUTSIDE_ROOM: true,
    ACCEPTS_SCORE: false,
    DRAW_HEALTH: false,
    HITS_OWN_TYPE: "never",
    IGNORED_BY_AI: true,
    ARENA_CLOSER: true,
    IS_IMMUNE_TO_TILES: true,
    CAN_SEE_INVISIBLE_ENTITIES: true,
    TOOLTIP: "Use left click to inspect and right click to teleport. Press F to ban the selected player.",
    SKILL_CAP: [0, 0, 0, 0, 0, 0, 0, 0, 0, 255],
    BODY: {
        PUSHABILITY: 0,
        SPEED: 5,
        FOV: 2.5,
        DAMAGE: 0,
        HEALTH: 1e100,
        SHIELD: 1e100,
        REGEN: 1e100,
    },
    GUNS: [
        {POSITION: [30, 7, 1.3, 0, 0, 0, 0]},
        {POSITION: [3, 11, 0.75, 7.5, -36, 90, 0]},
        {POSITION: [3, 11, 0.75, 7.5, 36, -90, 0]},
        {POSITION: [11, 14, 1, 30.5, 0, 0, 0]},
        {POSITION: [13, 10.5, -1.2, 0, 0, 0, 0]},
        /*{
            POSITION: [0,0,0,0,0,0,0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, {reload: 0.25}, g.fake]),
                TYPE: "bullet",
                ALPHA: 0
            }
        },*/
        {
            POSITION: [0, 0, 0, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, {reload: 0.2}, g.fake]),
                TYPE: "bullet",
                ALPHA: 0,
                ALT_FIRE: true
            }
        }
    ],
    ON: [{
        event: "altFire",
        handler: ({ body }) => {
            body.x = body.x + body.control.target.x
            body.y = body.y + body.control.target.y
        }
    },
       {
        event: "tick",
        handler: ({ body }) => {
            body.golfClubMode ??= 0;
            if (body?.socket?.player?.command?.autofire) {
                let mode = "";
                if (!body.lmb && body.socket.player.command.lmb) {
                    body.golfClubMode = (body.golfClubMode + 1) % 3;
                    body.lmb = true;
                }
                if (body.lmb && !body.socket.player.command.lmb) {
                    body.lmb = false;
                }
                switch (body.golfClubMode) {
                    case 0:
                        mode = "Putter";
                        break;
                    case 1:
                        mode = "Chipper";
                        break;
                    case 2: 
                        mode = "Driver";
                }
                body.label = "Golf Club (" + mode + ")";
            } else {
                body.label = "Ban Hammer";
            }
       }
    }],
    TURRETS: [
       {
            POSITION: [11, 36, 5, 0, 361, 1],
            TYPE: "banHammerHitboxThing"
        },
        {
            POSITION: [11, 36, -5, 0, 361, 1],
            TYPE: "banHammerHitboxThing"
        },
        {
            POSITION: [11, 36, 0, 0, 361, 1],
            TYPE: "banHammerHitboxThing"
        }
    ],
}
Class.hh = {
    PARENT: "genericTank",
    LABEL: "Heavy Hitter",
    ALPHA: 0,
    CAN_BE_ON_LEADERBOARD: false,
    CAN_GO_OUTSIDE_ROOM: true,
    ACCEPTS_SCORE: false,
    DRAW_HEALTH: false,
    HITS_OWN_TYPE: "never",
    IGNORED_BY_AI: true,
    ARENA_CLOSER: true,
    IS_IMMUNE_TO_TILES: true,
    CAN_SEE_INVISIBLE_ENTITIES: true,
    TOOLTIP: "Use left click to inspect and right click to teleport. Press F to ban the selected player.",
    SKILL_CAP: [0, 0, 0, 0, 0, 0, 0, 0, 0, 255],
    BODY: {
        PUSHABILITY: 0,
        SPEED: 5,
        FOV: 2.5,
        DAMAGE: 0,
        HEALTH: 1e100,
        SHIELD: 1e100,
        REGEN: 1e100,
    },
    GUNS: [
        {POSITION: [30, 7, 1.3, 0, 0, 0, 0]},
        {POSITION: [3, 11, 0.75, 7.5, -36, 90, 0]},
        {POSITION: [3, 11, 0.75, 7.5, 36, -90, 0]},
        {POSITION: [11, 14, 1, 30.5, 0, 0, 0]},
        {POSITION: [13, 10.5, -1.2, 0, 0, 0, 0]},
        /*{
            POSITION: [0,0,0,0,0,0,0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, {reload: 0.25}, g.fake]),
                TYPE: "bullet",
                ALPHA: 0
            }
        },*/
        {
            POSITION: [0,2,0,0,0,180,0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.destroyer, {reload: 2.5, speed: 0.01, range: 50, damage: 200000, size: 10, recoil: 0}, g.annihilator]),
                TYPE: "bullet",
                ALPHA: 0.3
            }
        },
        {
            POSITION: [0, 0, 0, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, {reload: 0.2}, g.fake]),
                TYPE: "bullet",
                ALPHA: 0,
                ALT_FIRE: true
            }
        }
    ],
    ON: [{
        event: "altFire",
        handler: ({ body }) => {
            body.x = body.x + body.control.target.x
            body.y = body.y + body.control.target.y
        }
    },
       {
        event: "tick",
        handler: ({ body }) => {
            body.golfClubMode ??= 0;
            if (body?.socket?.player?.command?.autofire) {
                let mode = "";
                if (!body.lmb && body.socket.player.command.lmb) {
                    body.golfClubMode = (body.golfClubMode + 1) % 3;
                    body.lmb = true;
                }
                if (body.lmb && !body.socket.player.command.lmb) {
                    body.lmb = false;
                }
                switch (body.golfClubMode) {
                    case 0:
                        mode = "Putter";
                        break;
                    case 1:
                        mode = "Chipper";
                        break;
                    case 2: 
                        mode = "Driver";
                }
                body.label = "Golf Club (" + mode + ")";
            } else {
                body.label = "Heavy Hitter";
            }
       }
    }],
    TURRETS: [
       {
            POSITION: [11, 36, 5, 0, 361, 1],
            TYPE: "hhHitboxThing"
        },
        {
            POSITION: [11, 36, -5, 0, 361, 1],
            TYPE: "hhHitboxThing"
        },
        {
            POSITION: [11, 36, 0, 0, 361, 1],
            TYPE: "hhHitboxThing"
        }
    ],
}
Class.banHammer = {
    PARENT: "genericTank",
    LABEL: "Ban Hammer",
    ALPHA: 0,
    CAN_BE_ON_LEADERBOARD: false,
    CAN_GO_OUTSIDE_ROOM: true,
    ACCEPTS_SCORE: false,
    DRAW_HEALTH: false,
    HITS_OWN_TYPE: "never",
    IGNORED_BY_AI: true,
    ARENA_CLOSER: true,
    IS_IMMUNE_TO_TILES: true,
    CAN_SEE_INVISIBLE_ENTITIES: true,
    TOOLTIP: "Use left click to inspect and right click to teleport. Press F to ban the selected player.",
    SKILL_CAP: [0, 0, 0, 0, 0, 0, 0, 0, 0, 255],
    BODY: {
        PUSHABILITY: 0,
        SPEED: 5,
        FOV: 2.5,
        DAMAGE: 0,
        HEALTH: 1e100,
        SHIELD: 1e100,
        REGEN: 1e100,
    },
    GUNS: [
        {POSITION: [30, 7, 1.3, 0, 0, 0, 0]},
        {POSITION: [3, 11, 0.75, 7.5, -36, 90, 0]},
        {POSITION: [3, 11, 0.75, 7.5, 36, -90, 0]},
        {POSITION: [11, 14, 1, 30.5, 0, 0, 0]},
        {POSITION: [13, 10.5, -1.2, 0, 0, 0, 0]},
        /*{
            POSITION: [0,0,0,0,0,0,0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, {reload: 0.25}, g.fake]),
                TYPE: "bullet",
                ALPHA: 0
            }
        },*/
        {
            POSITION: [0, 0, 0, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, {reload: 0.2}, g.fake]),
                TYPE: "bullet",
                ALPHA: 0,
                ALT_FIRE: true
            }
        }
    ],
    ON: [{
        event: "altFire",
        handler: ({ body }) => {
            body.x = body.x + body.control.target.x
            body.y = body.y + body.control.target.y
        }
    }]
}

// Tank Menu(s)
if (Config.siege) {
    unavailable_tanks = ['smasher', 'underseer']
} else {
    unavailable_tanks = ['healer']
}
Class.menu_tanks = makeMenu("Tanks", {upgrades: [Config.spawn_class, "menu_unused", "menu_removed", "menu_mapEntities", "menu_motherships", "menu_fun", "arenaCloser", ...unavailable_tanks]})

Class.menu_unused = makeMenu("Unused", {upgrades: ["1", "2", "3"].map(x => "menu_unused_T" + x), tooltip: "Tanks that were fully created and likely intended to be added, but never were."})
Class.menu_unused_T1 = makeMenu("Unused (Tier 1)", {upgrades: [
    'flail',
    'whirlwind_bent',
], boxLabel: "Tier 1 (Lv.15)"})
Class.menu_unused_T2 = makeMenu("Unused (Tier 2)", {upgrades: [
    'autoTrapper',
    'repeater',
    'spiral',
    "volute",
    'whirlwind_old',
], boxLabel: "Tier 2 (Lv.30)"})
Class.menu_unused_T3 = makeMenu("Unused (Tier 3)", {upgrades: [
    'blunderbuss',
    'cocci',
    'dreadnought_old',
    'mender',
    'oroboros',
    'prodigy',
    'quadBuilder',
    'rimfire_old',
    'rocket',
    'wrangler',
], boxLabel: "Tier 3 (Lv.45)"})

Class.menu_removed = makeMenu("Removed", {upgrades: ["menu_dailyTanks", "menu_legacy"], tooltip: "Tanks that were previously accessible in-game in some form before being removed."})
Class.menu_dailyTanks = makeMenu("Daily Tanks", {upgrades: [
    'whirlwind',
    'master',
    'undertow',
    'literallyAMachineGun',
    'literallyATank',
    'rocketeer',
    'jumpSmasher',
    'rapture',
], boxColor: "rainbow", tooltip: "Tanks that were part of arras.io's December 2023 Daily Tanks event, in the order they were first made available.\n" + "The Daily Tank for a server can be added or changed in config."})
Class.menu_legacy = makeMenu("Legacy Tanks", {upgrades: [
    'boomer_old',
    'commander_old',
    'bulwark_old',
    'auto4_old',
    'rifle_old',
    'septaTrapper_old',
    'spike_old',
    'sprayer_old',
    'spreadshot_old',
], tooltip: "The original versions of certain tanks."})

Class.menu_mapEntities = makeMenu("Map Entities", {upgrades: ["menu_dominators", "baseProtector", "antiTankMachineGun", "menu_sanctuaries"], props: [{TYPE: "dominationBody", POSITION: {SIZE: 22}}], tooltip: "Tanks that spawn as part of the map layout."})
Class.menu_dominators = makeMenu("Dominators", {upgrades: ["destroyer", "gunner", "trapper"].map(x => x + "Dominator"), props: [{TYPE: "dominationBody", POSITION: {SIZE: 22}}]})
Class.menu_sanctuaries = makeMenu("Sanctuaries", {upgrades: ["1", "2", "3", "4", "5", "6"].map(x => "sanctuaryTier" + x), props: [{TYPE: "dominationBody", POSITION: {SIZE: 22}}, {TYPE: "healerHat", POSITION:  {SIZE: 13, LAYER: 1}}]})

Class.menu_motherships = makeMenu("Motherships", {upgrades: ["mothership", "flagship", "turkey"], shape: 16, tooltip: "Giant Enemy Tanks that you attack the weak points of for massive damage."})
Class.menu_fun = makeMenu("Fun", {upgrades: [
    "tanksnshit",
    "alas",
    //"average4tdmScore",
    //"averageL39Hunt",
    //"beeman",
    "bigBalls",
    "cxATMG",
    "damoclone",
    "fat456",
    "heptaAutoBasic",
    "machineShot",
    "meDoingYourMom",
    "meOnMyWayToDoYourMom",
    "protector",
    //"quadCyclone",
    "rapture",
    "riptide",
    //"schoolShooter",
    "smasher3",
    "tetraGunner",
    //"theAmalgamation",
    //"theConglomerate",
    "tracker3",
    "undercoverCop",
    "wifeBeater",
    "worstTank",
], tooltip: "Tanks that, let's be honest, aren't used for a good reason.\n" + "DISCLAIMER: Some of the content in here may be in poor taste. Blame the arras.io devs, not us."})
Class.menu_bosses = makeMenu("Bosses", {upgrades: ["sentries", "elites", "mysticals", "nesters", "rogues", "rammers", "terrestrials", "celestials", "eternals", "devBosses"].map(x => "menu_" + x), rerootTree: "menu_bosses"})
Class.menu_addons = makeMenu("Addons", {tooltip: "Content that is (usually) not part of Open Source Arras but was added by someone else."})
