const _facs = require('../facilitators.js');
const { combineStats, weaponArray } = _facs;
const { base } = require('../constants.js');
const g = require('../gunvals.js');

// ── Compat shims for facilitators that may not exist in this OSA build ────────
const makeAuto = _facs.makeAuto || ((type, name, opts={}) => {
    const b = typeof type==='string' ? {PARENT:[type],LABEL:name||type,GUNS:[],TURRETS:[]} : type;
    return Object.assign({},b,{LABEL:name||b.LABEL});
});
const makeDeco      = _facs.makeDeco      || (() => ({}));
const makeMulti     = _facs.makeMulti     || (() => ({}));
const addAura       = _facs.addAura       || (() => {});
const skillSet      = _facs.skillSet      || (() => undefined);
const makeTurret    = _facs.makeTurret    || ((def, opts={}) => ({
    PARENT:['genericTank'], LABEL:opts.label||'', INDEPENDENT:true,
    BODY:{FOV:opts.fov||3},
    CONTROLLERS:['canRepel','onlyAcceptInArc','mapAltToFire','nearestDifferentMaster'],
    COLOR:opts.color||'grey', GUNS:def.GUNS||[], TURRETS:def.TURRETS||[],
    HAS_NO_RECOIL:def.HAS_NO_RECOIL||false,
}));
const setTurretProjectileRecoil = _facs.setTurretProjectileRecoil || (() => {});
const LayeredBoss   = _facs.LayeredBoss   || (function(){
    function LB(className,label,parentClass,sides,color,shape,rotation,ringScale){
        this.className=className;
        if(typeof Class!=='undefined'){
            Class[className]={PARENT:[parentClass||'genericTank'],LABEL:label||className,
                COLOR:color||'white',SHAPE:sides||9,GUNS:[],TURRETS:[],SIZE:45,DANGER:10};
        }
    }
    LB.prototype.addLayer=function(layer){
        if(typeof Class==='undefined')return this;
        const cls=Class[this.className];
        if(!cls)return this;
        if(layer.gun){if(!cls.GUNS)cls.GUNS=[];cls.GUNS.push(Object.assign({},layer.gun));}
        if(layer.turret){if(!cls.TURRETS)cls.TURRETS=[];cls.TURRETS.push(Object.assign({},layer.turret));}
        return this;
    };
    return LB;
}());
const menu = _facs.makeMenu || ((label,color,danger) => ({
    PARENT:['genericTank'],LABEL:label||'',COLOR:color||'white',DANGER:danger||9,
    SIZE:14,GUNS:[],TURRETS:[],UPGRADES_TIER_0:[],
}));

// ── Compat for constants that may be missing ──────────────────────────────────
const statnames = require('../constants.js').statnames || {drone:'drone',necro:'necro',bulletHeal:'bulletHeal'};
const dfltskl   = require('../constants.js').dfltskl   ?? 7;
const smshskl   = require('../constants.js').smshskl   ?? 10;

// ── Missing gunval aliases ─────────────────────────────────────────────────────
g.dual        = g.dual        || g.twin       || { reload: 0.8, damage: 0.9, speed: 1.1, maxSpeed: 1.1 };
g.maleficitor = g.maleficitor || g.necromancer || { size: 1.2, reload: 0.6, health: 1.1, damage: 0.8 };
g.minionGun   = g.minionGun   || g.factory    || { reload: 1.5, damage: 0.8, health: 0.8 };
g.spawner     = g.spawner     || g.factory;
g.turret      = g.turret      || g.autoTurret || {};
g.power       = g.power       || { damage: 1.2, health: 1.2 };
g.honcho      = g.honcho      || { reload: 1.8, size: 1.4, health: 1.9, speed: 1.125 };
g.dopeMod     = g.dopeMod     || { reload: 1.3, damage: 0.9, resist: 1.025, speed: 1.1, maxSpeed: 1.5 };
g.babyfactory = g.babyfactory || g.factory    || { size: 0.5, reload: 0.7 };
g.commander   = g.commander   || g.battleship || {};
g.boomerang   = g.boomerang   || { reload: 0.7, speed: 0.5, maxSpeed: 0.5, range: 1.5 };
g.crossbow    = g.crossbow    || g.predator   || { reload: 1.2, damage: 1.1, speed: 1.1, maxSpeed: 1.1 };
g.single      = g.single      || g.pounder   || { damage: 1.4, pen: 1.2, health: 1.3 };
g.thruster    = g.thruster    || { speed: 2, maxSpeed: 2, damage: 0.3, health: 0.5, recoil: 2 };
g.machineGunner = g.machineGunner || g.machineGun || {};
g.productionist = g.productionist || g.factory || { reload: 1.5, size: 0.8 };
g.hive        = g.hive        || { reload: 0.5, damage: 0.6, health: 0.8, size: 0.7 };

const showcase = true; //ignore, i don't remember what this does
const arrasScale = true; 
const extraCeles = false;
let adjust = -2.5;
	const fiveSidedShapeScale = 30 + adjust;
	const sevenSidedShapeScale = 40 + adjust;
	const nineSidedShapeScale = 50 + adjust;
    const elevenSidedShapeScale = 60 + adjust;
    const thirteenSidedShapeScale = 70 + adjust;
    const l0Size = 6;
    const l1Size = 7;
    const l2Size = 8.5;
const y = {
    genericLauncher: {reload: 1.5, range: 1.1, speed: 0.6, maxSpeed: 1.4, recoil: 0.6, size: 0.95},
     hyperlaunch: {reload: 1.21},
     launchTrails: {reload: 1.6, recoil: 0.8, shudder: 0.2, spray: 0.2, damage: 1.8, resist: 1.5},
     skimmerG: {speed: 1.1, resist: 1.2, health: 1.3},
      skimmerSkim: {recoil: 1.2, damage: 1.2, resist: 1.1},
     twisterG: {speed: 1.1, maxSpeed: 0.5, range: 0.7, health: 1.1},
      twisterCloud: {reload: 0.8, recoil: 0.9, damage: 1.2, resist: 1.1},
     sidewindG: {speed: 1.2, maxSpeed: 0.8, range: 0.7, resist: 1.2, health: 0.8},
      sidewindSnake: {reload: 0.7, shudder: 0.2, spray: 0.2, maxSpeed: 0.15, speed: 0.15, range: 0.5, recoil: 0.1, damage: 0.5},
     rocketeerG: {speed: 0.6, maxSpeed: 1.4, resist: 1.2},
      rocketeerExhuast: {reload: 0.5, recoil: 1.4, spray: 10},
     projectorG: {speed: 0.9, resist: 0.7},
      projectorProjection: {recoil: 0.25, damage: 0.8},
     pitcherG: {speed: 1.1},
     inceptionG: {speed: 1.1, maxSpeed: 1.1, resist: 0.3},
      inceptionCeption: {damage: 0.7, speed: 0.9},
     clusterG: {speed: 1.1, maxSpeed: 0.8, range: 0.5},
      clusterFrags: {damage: 0.4, resist: 0.001, speed: 2, range: 0.5},
     hurler: {reload: 2.2, speed: 0.9, maxSpeed: 0.9, resist: 2, damage: 2, health: 1.3, recoil: 1.5},
      hurlerTrail: {speed: 0.8, damage: 2, reload: 1.3, resist: 1.3, recoil: 1.3},

    marksman: {pen: 2, health: 8.5, damage: 0.175, speed: 1.1, range: 0.9, reload: 1.4, recoil: 1.2, resist: 1.2, density: 1.5},
     deadeye: { health: 1.1, damage: 1.4 },
     nimrod: { damage: 1.3 },
     revolver: { damage: 1.4 },
     fork: { health: 0.7, reload: 1.2, speed: 0.9 },
     carbine: { damage: 0.9, pen: 0.4 },

    doper: {reload: 1.3, damage: 0.9, resist: 1.025, speed: 1.1, maxSpeed: 1.5},
    honcho: {reload: 1.8, size: 1.4, health: 1.9, speed: 1.125},

    celestialSize: {size: 0.8 * (2/4.5)},
    eternalSize: {size: 0.8 * (2/6)},

    celestialGuns: {damage: 1.4, health: 1.5, reload: 1.1, speed: 1.2},
    railgun: {damage: 0.75, health: 0.75, reload: 3.3, speed: 2, maxSpeed: 3, recoil: 0.5, shudder: 0.1, spray: 0.1},
}

g.noRecoil = {recoil: 0}
g.diesel = { reload: 0.6, recoil: 0.85, shudder: 1.3, health: 0.8, damage: 0.6, maxSpeed: 0.95, range: 0.9, spray: 1.1 }
g.jalopy = { reload: 0.65, recoil: 0.85, shudder: 1.1, health: 0.7, damage: 0.6, maxSpeed: 0.95, range: 0.9, spray: 1.1 }

g.sprayer = { damage: 0.8, spray: 1.2, speed: 0.85, recoil: 0.65 }
 g.spray = { damage: 0.5, health: 0.7, spray: 0.9, recoil: 0.8, shudder: 1.1, speed: 1.2, reload: 1.25 }
 g.sprayer_Atomizer = { reload: 0.4, damage: 0.5, pen: 0.8, resist: 0.8, density: 0.9, spray: 1.6, size: 0.8 }
 g.sprayer_Focal = { reload: 1.15, damage: 1, pen: 1.4, resist: 0.8, density: 1.2, spray: 0.4, maxSpeed: 1.4 }
g.volley = {reload: 1.7, damage: 1.8, pen: 1.3, speed: 0.9, maxSpeed: 0.925, recoil: 1.4, density: 1.3, resist: 2}
g.battery = {reload: 1.1, damage: 0.95, pen: 1.1, speed: 1.025, recoil: 0.95, spray: 0.5, shudder: 0.7}

Class.speedBullet_CLSTL = {
    PARENT: "bullet",
    GUNS: [
        {
            POSITION: [0, 20, 0, 0, 0, 180, 0],
            PROPERTIES: {
                STAT_CALCULATOR: "fixedReload",
                SHOOT_SETTINGS: combineStats([g.basic, {range: 0, damage: 0, reload: 0.1, recoil: 1}]),
                ALPHA: 0,
                TYPE: "bullet",
            }
        }
    ],
}
Class.healerBulletHeal_CLSTL = {
    PARENT: "bullet",
    HEALER: true,
    SHAPE: 0,
    MOTION_TYPE: "withMaster",
    BODY: {
        HEALTH: 1e9,
    },
    ALPHA: 0,
    DIE_AT_RANGE: false,
}
Class.healerTrapHeal_CLSTL = {
    PARENT: "trap",
    HEALER: true,
    SHAPE: 0,
    MOTION_TYPE: "withMaster",
    BODY: {
        HEALTH: 1e9,
    },
    ALPHA: 0,
    DIE_AT_RANGE: false,
}
Class.healerDroneHeal_CLSTL = {
    PARENT: "drone",
    HEALER: true,
    SHAPE: 0,
    MOTION_TYPE: "withMaster",
    BODY: {
        HEALTH: 1e9,
    },
    ALPHA: 0,
    DIE_AT_RANGE: false,
}
Class.healerSwarmHeal_CLSTL = {
    PARENT: "swarm",
    HEALER: true,
    SHAPE: 0,
    MOTION_TYPE: "withMaster",
    BODY: {
        HEALTH: 1e9,
    },
    ALPHA: 0,
    DIE_AT_RANGE: false,
}
Class.healerSatelliteHeal_CLSTL = {
    PARENT: "satellite",
    HEALER: true,
    SHAPE: 0,
    MOTION_TYPE: "withMaster",
    BODY: {
        HEALTH: 1e9,
    },
    ALPHA: 0,
    DIE_AT_RANGE: false,
}
Class.healerBullet_CLSTL = {
    PARENT: "bullet",
    HEALER: true,
    GUNS: [
        {
            POSITION: [1, 20, 0, 0, 0, 180, 1],
            PROPERTIES: {
                TYPE: "healerBulletHeal_CLSTL",
                SHOOT_SETTINGS: combineStats([{reload: 1, damage: -1, recoil: 0}]),
                MAX_CHILDREN: 1,
                AUTOFIRE: true,
                ALPHA: 0,
            }
        }
    ],
    TURRETS: [
        {
            POSITION: [10, 0, 0, 0, 0, 1],
            TYPE: "healerSymbol"
        }
    ]
}
Class.healerTrap_CLSTL = {
    PARENT: "trap",
    HEALER: true,
    GUNS: [
        {
            POSITION: [1, 20, 0, 0, 0, 180, 1],
            PROPERTIES: {
                TYPE: "healerTrapHeal_CLSTL",
                SHOOT_SETTINGS: combineStats([{reload: 1, damage: -1, recoil: 0}]),
                MAX_CHILDREN: 1,
                AUTOFIRE: true,
                ALPHA: 0,
                STAT_CALCULATOR: "trap"
            }
        }
    ],
    TURRETS: [
        {
            POSITION: [10, 0, 0, 0, 0, 1],
            TYPE: "healerSymbol"
        }
    ]
}
Class.healerDrone_CLSTL = {
    PARENT: "drone",
    HEALER: true,
    GUNS: [
        {
            POSITION: [1, 20, 0, 0, 0, 180, 1],
            PROPERTIES: {
                TYPE: "healerDroneHeal_CLSTL",
                SHOOT_SETTINGS: combineStats([{reload: 1, damage: -1, recoil: 0}]),
                MAX_CHILDREN: 1,
                AUTOFIRE: true,
                ALPHA: 0,
                STAT_CALCULATOR: "drone"
            }
        }
    ],
    TURRETS: [
        {
            POSITION: [10, 0, 0, 0, 0, 1],
            TYPE: "healerSymbol"
        }
    ]
}
Class.healerSwarm_CLSTL = {
    PARENT: "swarm",
    HEALER: true,
    GUNS: [
        {
            POSITION: [1, 20, 0, 0, 0, 180, 1],
            PROPERTIES: {
                TYPE: "healerSwarmHeal_CLSTL",
                SHOOT_SETTINGS: combineStats([{reload: 1, damage: -1, recoil: 0}]),
                MAX_CHILDREN: 1,
                AUTOFIRE: true,
                ALPHA: 0,
                STAT_CALCULATOR: "drone"
            }
        }
    ],
    TURRETS: [
        {
            POSITION: [10, 0, 0, 0, 0, 1],
            TYPE: "healerSymbol"
        }
    ]
}
Class.healerSatellite_CLSTL = {
    PARENT: "satellite",
    HEALER: true,
    GUNS: [
        {
            POSITION: [1, 20, 0, 0, 0, 180, 1],
            PROPERTIES: {
                TYPE: "healerSatelliteHeal_CLSTL",
                SHOOT_SETTINGS: combineStats([{reload: 1, damage: -1, recoil: 0}]),
                MAX_CHILDREN: 1,
                AUTOFIRE: true,
                ALPHA: 0,
            }
        }
    ],
    TURRETS: [
        {
            POSITION: [10, 0, 0, 0, 0, 1],
            TYPE: "healerSymbol"
        }
    ]
}
Class.megaMinion_CLSTL = {
    PARENT: "minion",
    GUNS: [
        {
            POSITION: [20, 13, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pounder, {damage: 1.2, health: 1.2, reload: 1.2}]),
                WAIT_TO_CYCLE: true,
                TYPE: "bullet",
            },
        },
    ],
}
Class.minimissile_CLSTL = {
    PARENT: "missile",
    GUNS: [
        {
            POSITION: [14, 6, 1, 0, 0, 180, 0],
            PROPERTIES: {
                AUTOFIRE: true,
                SHOOT_SETTINGS: combineStats([g.basic, g.lowPower, y.launchTrails]),
                TYPE: [ "bullet", { PERSISTS_AFTER_DEATH: true } ],
            }
        }
    ]
}
Class.snake_CLSTL = {
    PARENT: "missile",
    LABEL: "Snake",
    GUNS: [
        {
            POSITION: [6, 12, 1.4, 8, 0, 180, 0],
            PROPERTIES: {
                AUTOFIRE: true,
                STAT_CALCULATOR: "thruster",
                SHOOT_SETTINGS: combineStats([g.basic, g.lowPower, y.launchTrails, y.sidewindSnake]),
                TYPE: ["bullet", { PERSISTS_AFTER_DEATH: true }],
            },
        },
        {
            POSITION: [10, 12, 0.8, 8, 0, 180, 0.5],
            PROPERTIES: {
                AUTOFIRE: true,
                NEGATIVE_RECOIL: true,
                STAT_CALCULATOR: "thruster",
                SHOOT_SETTINGS: combineStats([g.basic, g.lowPower, y.launchTrails, y.sidewindSnake]),
                TYPE: ["bullet", { PERSISTS_AFTER_DEATH: true }],
            },
        },
    ],
}
Class.twinmissile_CLSTL = {
    PARENT: "missile",
    GUNS: [
        {
            POSITION: [15, 6, 1, 0, 4, 180, 0.5],
            PROPERTIES: {
                AUTOFIRE: true,
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.lowPower, y.launchTrails]),
                TYPE: ["bullet", { PERSISTS_AFTER_DEATH: true }],
                STAT_CALCULATOR: "thruster",
            },
        },
        {
            POSITION: [15, 6, 1, 0, -4, 180, 0],
            PROPERTIES: {
                AUTOFIRE: true,
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.lowPower, y.launchTrails]),
                TYPE: ["bullet", { PERSISTS_AFTER_DEATH: true }],
                STAT_CALCULATOR: "thruster",
            },
        },
    ],
}
Class.hyperspinmissile_CLSTL = {
    PARENT: "missile",
    LABEL: "Hyperspinmissile",
    CONTROLLERS: [["spin2", {speed: 0.1}]],
    GUNS: weaponArray({
        POSITION: [14, 8, 1, 0, 0, 0, 0],
        PROPERTIES: {
            AUTOFIRE: !0,
            SHOOT_SETTINGS: combineStats([g.basic, g.lowPower, y.launchTrails, y.twisterCloud, y.hyperlaunch]),
            TYPE: ["bullet", { PERSISTS_AFTER_DEATH: true }],
            STAT_CALCULATOR: "thruster",
            WAIT_TO_CYCLE: true,
        },
    }, 5),
}
Class.hypermissile_CLSTL = {
    PARENT: "missile",
    GUNS: [
        {
            POSITION: [14, 6, 1, 0, -2, 130, 0],
            PROPERTIES: {
                AUTOFIRE: true,
                SHOOT_SETTINGS: combineStats([g.basic, g.lowPower, y.launchTrails, y.skimmerSkim, y.hyperlaunch]),
                TYPE: [ "bullet", { PERSISTS_AFTER_DEATH: true } ],
                STAT_CALCULATOR: "thruster",
            }
        },
        {
            POSITION: [14, 6, 1, 0, 2, 230, 0],
            PROPERTIES: {
                AUTOFIRE: true,
                SHOOT_SETTINGS: combineStats([g.basic, g.lowPower, y.launchTrails, y.skimmerSkim, y.hyperlaunch]),
                TYPE: [ "bullet", { PERSISTS_AFTER_DEATH: true } ],
                STAT_CALCULATOR: "thruster",
            }
        },
        {
            POSITION: [14, 6, 1, 0, -3, 90, 0],
            PROPERTIES: {
                AUTOFIRE: true,
                SHOOT_SETTINGS: combineStats([g.basic, g.lowPower, y.launchTrails, y.skimmerSkim, y.hyperlaunch]),
                TYPE: [ "bullet", { PERSISTS_AFTER_DEATH: true } ],
            }
        },
        {
            POSITION: [14, 6, 1, 0, 3, -90, 0],
            PROPERTIES: {
                AUTOFIRE: true,
                SHOOT_SETTINGS: combineStats([g.basic, g.lowPower, y.launchTrails, y.skimmerSkim, y.hyperlaunch]),
                TYPE: [ "bullet", { PERSISTS_AFTER_DEATH: true } ],
            }
        }
    ]
}
Class.hyperladlemissile_CLSTL = {
    PARENT: "missile",
    LABEL: "Hypermissile",
    GUNS: [
        {
            POSITION: [14, 6, 1, 0, -2, 150, 0],
            PROPERTIES: {
                AUTOFIRE: true,
                SHOOT_SETTINGS: combineStats([g.basic, g.lowPower, y.launchTrails, y.skimmerSkim, y.hyperlaunch, y.hyperlaunch]),
                TYPE: [ "bullet", { PERSISTS_AFTER_DEATH: true } ],
                STAT_CALCULATOR: "thruster",
            },
        },
        {
            POSITION: [14, 6, 1, 0, 2, 210, 0],
            PROPERTIES: {
                AUTOFIRE: true,
                SHOOT_SETTINGS: combineStats([g.basic, g.lowPower, y.launchTrails, y.skimmerSkim, y.hyperlaunch, y.hyperlaunch]),
                TYPE: [ "bullet", { PERSISTS_AFTER_DEATH: true } ],
                STAT_CALCULATOR: "thruster",
            },
        },
        {
            POSITION: [14, 6, 1, 0, -2, 90, 0.5],
            PROPERTIES: {
                AUTOFIRE: true,
                SHOOT_SETTINGS: combineStats([g.basic, g.lowPower, y.launchTrails, y.skimmerSkim, y.hyperlaunch, y.hyperlaunch]),
                TYPE: [ "bullet", { PERSISTS_AFTER_DEATH: true } ],
            },
        },
        {
            POSITION: [14, 6, 1, 0, 2, 270, 0.5],
            PROPERTIES: {
                AUTOFIRE: true,
                SHOOT_SETTINGS: combineStats([g.basic, g.lowPower, y.launchTrails, y.skimmerSkim, y.hyperlaunch, y.hyperlaunch]),
                TYPE: [ "bullet", { PERSISTS_AFTER_DEATH: true } ],
            },
        },
        {
            POSITION: [14, 6, 1, 0, 0, 0, 0],
            PROPERTIES: {
                AUTOFIRE: true,
                SHOOT_SETTINGS: combineStats([g.basic, g.lowPower, y.launchTrails, y.projectorProjection, y.hyperlaunch, y.hyperlaunch]),
                TYPE: ["bullet", { PERSISTS_AFTER_DEATH: true }],
                STAT_CALCULATOR: "thruster",
            },
        },
    ],
}
Class.hive_CLSTL = {
    PARENT: "missile",
    LABEL: "Hive",
    CONTROLLERS: [["spin2", {speed: 0.3}]],
    GUNS: weaponArray({
        POSITION: [7, 9.5, 0.6, 7, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.swarm, g.hive, g.bee, y.launchTrails, y.twisterCloud, y.hyperlaunch]),
            TYPE: ["bee", { PERSISTS_AFTER_DEATH: true }],
            STAT_CALCULATOR: "swarm",
            AUTOFIRE: true
        },
    }, 5, 1/5)
}
Class.rocketeerMissile_CLSTL = {
    PARENT: "missile",
    LABEL: "Rocket",
    GUNS: [
        {
            POSITION: [16.5, 10, 1.5, 0, 0, 180, 3],
            PROPERTIES: {
                AUTOFIRE: true,
                SHOOT_SETTINGS: combineStats([g.basic, y.launchTrails, y.rocketeerExhuast]),
                TYPE: ["bullet", { PERSISTS_AFTER_DEATH: true }],
                STAT_CALCULATOR: "thruster",
            },
        },
    ],
}
Class.kronosMissile_CLSTL = {
    PARENT: "missile",
    GUNS: [
        {
            POSITION: [4, 6, 1.6, 13, 0, 90, 0.5],
            PROPERTIES: {
                AUTOFIRE: true,
                SHOOT_SETTINGS: combineStats([g.trap, g.lowPower, y.launchTrails, y.celestialGuns, {speed: 1.3, maxSpeed: 1.3, range: 0.5}]),
                TYPE: [ "trap", { PERSISTS_AFTER_DEATH: true } ],
                STAT_CALCULATOR: "trap",
            },
        }, {
            POSITION: [4, 6, 1.6, 13, 0, -90, 0.5],
            PROPERTIES: {
                AUTOFIRE: true,
                SHOOT_SETTINGS: combineStats([g.trap, g.lowPower, y.launchTrails, y.celestialGuns, {speed: 1.3, maxSpeed: 1.3, range: 0.5}]),
                TYPE: [ "trap", { PERSISTS_AFTER_DEATH: true } ],
                STAT_CALCULATOR: "trap",
            },
        }, {
            POSITION: [14, 6, 1, 0, -2, 150, 0],
            PROPERTIES: {
                AUTOFIRE: true,
                SHOOT_SETTINGS: combineStats([g.basic, g.lowPower, y.launchTrails, y.celestialGuns, {speed: 1.3, maxSpeed: 1.3}]),
                TYPE: [ "bullet", { PERSISTS_AFTER_DEATH: true } ],
                STAT_CALCULATOR: "thruster",
            },
        }, {
            POSITION: [14, 6, 1, 0, 2, 210, 0],
            PROPERTIES: {
                AUTOFIRE: true,
                SHOOT_SETTINGS: combineStats([g.basic, g.lowPower, y.launchTrails, y.celestialGuns, {speed: 1.3, maxSpeed: 1.3}]),
                TYPE: [ "bullet", { PERSISTS_AFTER_DEATH: true } ],
                STAT_CALCULATOR: "thruster",
            },
        }, {
            POSITION: [13, 6, 1, 0, 0, 90, 0],
        }, {
            POSITION: [13, 6, 1, 0, 0, -90, 0],
        },
    ],
}
Class.projectormissile_CLSTL = {
    PARENT: "missile",
    GUNS: [
        {
            POSITION: [14, 6, 1, 0, 0, 180, 0],
            PROPERTIES: {
                AUTOFIRE: true,
                SHOOT_SETTINGS: combineStats([g.basic, g.lowPower, y.launchTrails]),
                TYPE: ["bullet", { PERSISTS_AFTER_DEATH: true }],
                STAT_CALCULATOR: "thruster",
            },
        },
        {
            POSITION: [14, 6, 1, 0, 0, 0, 0],
            PROPERTIES: {
                AUTOFIRE: true,
                SHOOT_SETTINGS: combineStats([g.basic, g.lowPower, y.launchTrails, y.projectorProjection]),
                TYPE: ["bullet", { PERSISTS_AFTER_DEATH: true }],
                STAT_CALCULATOR: "thruster",
            },
        },
    ],
}
Class.conceptionmissile_CLSTL = {
    PARENT: "minimissile",
    LABEL: "Shelled Missile",
    TURRETS: [
        {
            POSITION: [10, 0, 0, 180, 360, 1],
            TYPE: ['autoSmasherTurret', {GUN_STAT_SCALE: y.inceptionCeption, INDEPENDENT: true}]
        },
        {
            POSITION: [21.5, 0, 0, 0, 360, 0],
            TYPE: "smasher"
        }
    ],
    GUNS: []
}
Class.forkBullet_CLSTL = {
    PARENT: "bullet",
    GUNS: [
        {
            POSITION: [2, 18, 1, 0, 0, -30, 999999999999],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.sniper, {range: 0.2, health: 0.5, damage: 0.7}]),
                TYPE: ["bullet", {PERSISTS_AFTER_DEATH: true}],
                SHOOT_ON_DEATH: true,
            },
        }, {
            POSITION: [2, 18, 1, 0, 0, 30, 999999999999],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.sniper, {range: 0.2, health: 0.5, damage: 0.7}]),
                TYPE: ["bullet", {PERSISTS_AFTER_DEATH: true}],
                SHOOT_ON_DEATH: true,
            },
        }, {
            POSITION: [2, 18, 1, 0, 0, 0, 999999999999],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.sniper, {range: 0.2, health: 0.5, damage: 0.7}]),
                TYPE: ["bullet", {PERSISTS_AFTER_DEATH: true}],
                SHOOT_ON_DEATH: true,
            },
        },
    ],
};
Class.etamissile_CLSTL = {
    PARENT: "missile",
    LABEL: "Etamissile",
    GUNS: [
        {
            POSITION: [14, 6, 1, 0, -2, 150, 0],
            PROPERTIES: {
                AUTOFIRE: true,
                SHOOT_SETTINGS: combineStats([g.basic, g.lowPower, y.launchTrails, y.skimmerSkim, y.hyperlaunch, y.celestialGuns]),
                TYPE: [ "bullet", { PERSISTS_AFTER_DEATH: true } ],
                STAT_CALCULATOR: "thruster",
            },
        },
        {
            POSITION: [14, 6, 1, 0, 2, 210, 0],
            PROPERTIES: {
                AUTOFIRE: true,
                SHOOT_SETTINGS: combineStats([g.basic, g.lowPower, y.launchTrails, y.skimmerSkim, y.hyperlaunch, y.celestialGuns]),
                TYPE: [ "bullet", { PERSISTS_AFTER_DEATH: true } ],
                STAT_CALCULATOR: "thruster",
            },
        },
        {
            POSITION: [7, 7.5, 0.6, 7, -1, 90, 0],
            PROPERTIES: {
                AUTOFIRE: true,
                SHOOT_SETTINGS: combineStats([g.swarm, y.launchTrails, y.celestialGuns]),
                TYPE: "autoswarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [7, 7.5, 0.6, 7, 1, -90, 0],
            PROPERTIES: {
                AUTOFIRE: true,
                SHOOT_SETTINGS: combineStats([g.swarm, y.launchTrails, y.celestialGuns]),
                TYPE: "autoswarm",
                STAT_CALCULATOR: "swarm",
            },
        },
    ],
}
Class.hecubaMissile_CLSTL = {
    PARENT: "missile",
    HITS_OWN_TYPE: "never",
    GUNS: [
        {
            POSITION: [4, 6, 1.6, 13, 0, 90, 0.5],
            PROPERTIES: {
                AUTOFIRE: true,
                SHOOT_SETTINGS: combineStats([g.trap, g.lowPower, {reload: 2, speed: 1.3, maxSpeed: 1.3, range: 0.5}, y.celestialGuns, y.celestialGuns, {reload: 2}]),
                TYPE: [ "trap", { PERSISTS_AFTER_DEATH: true } ],
                STAT_CALCULATOR: "trap",
            },
        }, {
            POSITION: [4, 6, 1.6, 13, 0, -90, 0.5],
            PROPERTIES: {
                AUTOFIRE: true,
                SHOOT_SETTINGS: combineStats([g.trap, g.lowPower, {reload: 2, speed: 1.3, maxSpeed: 1.3, range: 0.5}, y.celestialGuns, y.celestialGuns, {reload: 2}]),
                TYPE: [ "trap", { PERSISTS_AFTER_DEATH: true } ],
                STAT_CALCULATOR: "trap",
            },
        }, {
            POSITION: [14, 6, 1, 0, -2, 150, 0],
            PROPERTIES: {
                AUTOFIRE: true,
                SHOOT_SETTINGS: combineStats([g.basic, g.lowPower, {speed: 1.3, maxSpeed: 1.3}, y.celestialGuns, y.celestialGuns, {reload: 2}]),
                TYPE: [ "bullet", { PERSISTS_AFTER_DEATH: true } ],
                STAT_CALCULATOR: "thruster",
            },
        }, {
            POSITION: [14, 6, 1, 0, 2, 210, 0],
            PROPERTIES: {
                AUTOFIRE: true,
                SHOOT_SETTINGS: combineStats([g.basic, g.lowPower, {speed: 1.3, maxSpeed: 1.3}, y.celestialGuns, y.celestialGuns, {reload: 2}]),
                TYPE: [ "bullet", { PERSISTS_AFTER_DEATH: true } ],
                STAT_CALCULATOR: "thruster",
            },
        }, {
            POSITION: [13, 6, 1, 0, 0, 90, 0],
        }, {
            POSITION: [13, 6, 1, 0, 0, -90, 0],
        },
    ],
    TURRETS: [
        {
            POSITION: [21.5, 0, 0, 0, 360, 0],
            TYPE: "spike2",
        }, {
            POSITION: [12, 0, 0, 0, 360, 1],
            TYPE: "autoSmasherMissileTurret",
        },
    ],
}
const makeWarhead = (count, ammo, size, stats) => {
    let warhead = {
        PARENT: "genericTank",
        GUNS: weaponArray({
            POSITION: [1, size*20, 1, 20, 0, 0, 1e9999],
            PROPERTIES: {
                TYPE: [ammo, {PERSISTS_AFTER_DEATH: true}],
                SHOOT_SETTINGS: combineStats([g.basic, g.lowPower, {shudder: 0.001, spray: 0.2, range: 0.4}, {stats}]),
                SHOOT_ON_DEATH: true,
                ALPHA: 0,
            },
        }, count),
    };
    return warhead;
}
Class.flockWarhead_CLSTL = makeWarhead(12, ["bee", {INDEPENDENT: true}], 0.5, {range: 3})
Class.flockmissile_CLSTL = {
    PARENT: "minimissile",
    TURRETS: [
        {
            POSITION: [10, 0, 0, 0, 0, 1],
            TYPE: 'flockWarhead_CLSTL'
        }
    ],
}

Class.driverTurret_CLSTL = makeTurret({
    HAS_NO_RECOIL: true,
    GUNS: [
        {
            POSITION: [22, 8, 1, 0, 5.5, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.minionGun, g.twin, g.turret, g.power, g.autoTurret, { density: 0.1 }, y.celestialGuns, g.noRecoil]),
                TYPE: "bullet",
                WAIT_TO_CYCLE: true
            },
        },
        {
            POSITION: [22, 8, 1, 0, -5.5, 0, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.minionGun, g.twin, g.turret, g.power, g.autoTurret, { density: 0.1 }, y.celestialGuns, g.noRecoil]),
                TYPE: "bullet",
                WAIT_TO_CYCLE: true
            },
        },
    ],
}, {independent: true, extraStats: []})
Class.specialistTurret_CLSTL = makeTurret({
    HAS_NO_RECOIL: true,
    GUNS: [
        {
            POSITION: [7, 7.5, 0.6, 8.5, 0, 90, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.swarm, {maxSpeed: 1.75}, g.minionGun, g.turret, g.power, g.autoTurret, { density: 0.1 }, y.celestialGuns, g.noRecoil]),
                TYPE: "autoswarm",
                STAT_CALCULATOR: "swarm",
                WAIT_TO_CYCLE: true
            },
        },
        {
            POSITION: [7, 7.5, 0.6, 8.5, 0, -90, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.swarm, {maxSpeed: 1.75}, g.minionGun, g.turret, g.power, g.autoTurret, { density: 0.1 }, y.celestialGuns, g.noRecoil]),
                TYPE: "autoswarm",
                STAT_CALCULATOR: "swarm",
                WAIT_TO_CYCLE: true
            },
        },
    ],
}, {independent: true, extraStats: []})
Class.unsetDriverPillbox_CLSTL = {
    PARENT: "unsetTrap",
    LABEL: "Pillbox",
    INDEPENDENT: true,
    DIE_AT_RANGE: true,
    TURRETS: [
        {
            POSITION: [11, 0, 0, 0, 360, 1],
            TYPE: "driverTurret_CLSTL",
        },
    ],
}
Class.unsetSpecialistPillbox_CLSTL = {
    PARENT: "unsetTrap",
    LABEL: "Pillbox",
    INDEPENDENT: true,
    DIE_AT_RANGE: true,
    TURRETS: [
        {
            POSITION: [11, 0, 0, 0, 360, 1],
            TYPE: "specialistTurret_ARMRACE",
        },
    ],
}
// ── Missing drone/chip/special bullet classes ─────────────────────────────────
// These are standard arras.io classes that must be defined here if not in your
// OSA build's tanks.js/turrets.js. Using PARENT inheritance from core types.

// Summoner drone chips — shape-based drones fired by summoner-family tanks
if (!Class.sunchip) Class.sunchip = {
    PARENT: 'drone',
    LABEL: 'Sunchip',
    SHAPE: 4,
    COLOR: 'gold',
};
if (!Class.demonchip) Class.demonchip = {
    PARENT: 'drone',
    LABEL: 'Demonchip',
    SHAPE: 5,
    COLOR: 'purple',
};
if (!Class.dorito) Class.dorito = {
    PARENT: 'drone',
    LABEL: 'Dorito',
    SHAPE: 3,
    COLOR: 'orange',
};
if (!Class.realchip) Class.realchip = {
    PARENT: 'drone',
    LABEL: 'Realchip',
    SHAPE: 6,
    COLOR: 'teal',
};
if (!Class.eggchip) Class.eggchip = {
    PARENT: 'drone',
    LABEL: 'Eggchip',
    SHAPE: 0,
    COLOR: 'white',
    BODY: { SIZE: 0.7 },
};
if (!Class.waferbread) Class.waferbread = {
    PARENT: 'swarm',
    LABEL: 'Waferbread',
    SHAPE: 4,
    COLOR: 'gold',
    BODY: { SIZE: 0.5 },
};
if (!Class.summonerDrone) Class.summonerDrone = {
    PARENT: 'drone',
    LABEL: 'Drone',
    SHAPE: 4,
    COLOR: 'gold',
};
if (!Class.bee) Class.bee = {
    PARENT: 'swarm',
    LABEL: 'Bee',
    SHAPE: 3,
    COLOR: 'gold',
    BODY: {
        SPEED: 1.5,
        DAMAGE: 1.2,
        HEALTH: 1.2,
    },
};
if (!Class.hive) Class.hive = {
    PARENT: 'missile',
    LABEL: 'Hive',
    SHAPE: 5,
    COLOR: 'gold',
};
if (!Class.turretedDrone) Class.turretedDrone = {
    PARENT: 'drone',
    LABEL: 'Auto-Drone',
    SHAPE: 4,
    COLOR: 'grey',
    TURRETS: [{
        POSITION: [7, 0, 0, 0, 360, 1],
        TYPE: 'autoTurret',
    }],
};
if (!Class.healerSymbol) Class.healerSymbol = {
    PARENT: 'genericTank',
    LABEL: '',
    SHAPE: -4,
    COLOR: 'white',
    INDEPENDENT: true,
    DRAW_HEALTH: false,
    BODY: { HEALTH: 9999, DAMAGE: 0 },
    GUNS: [],
};
if (!Class.tinyMinion) Class.tinyMinion = {
    PARENT: 'minion',
    LABEL: 'Minion',
    SIZE: 7,
};
if (!Class.surgeonPillbox) Class.surgeonPillbox = {
    PARENT: 'setTrap',
    LABEL: 'Medkit',
    INDEPENDENT: true,
    DIE_AT_RANGE: true,
    TURRETS: [{
        POSITION: [9, 0, 0, 0, 360, 1],
        TYPE: 'healerSymbol',
    }],
    GUNS: [],
};
if (!Class.autoSmasherMissileTurret) Class.autoSmasherMissileTurret = {
    PARENT: 'autoTurret',
    LABEL: 'Smasher',
    INDEPENDENT: true,
    BODY: { FOV: 2 },
    CONTROLLERS: ['canRepel','onlyAcceptInArc','mapAltToFire','nearestDifferentMaster'],
    GUNS: [{
        POSITION: [15, 12, 1, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.destroyer]),
            TYPE: 'bullet',
        },
    }],
};
// specialistTurret_ARMRACE is referenced in unsetSpecialistPillbox_CLSTL
// It should be the specialistTurret_CLSTL (typo in original file)
if (!Class.specialistTurret_ARMRACE) Class.specialistTurret_ARMRACE = Class.specialistTurret_CLSTL || {
    PARENT: 'autoTurret',
    LABEL: 'Specialist',
    INDEPENDENT: true,
    BODY: { FOV: 3 },
    CONTROLLERS: ['canRepel','onlyAcceptInArc','mapAltToFire','nearestDifferentMaster'],
    GUNS: [{
        POSITION: [7, 7.5, 0.6, 8.5, 0, 90, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.swarm, g.autoTurret]),
            TYPE: 'autoswarm',
            STAT_CALCULATOR: 'swarm',
        },
    },{
        POSITION: [7, 7.5, 0.6, 8.5, 0, -90, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.swarm, g.autoTurret]),
            TYPE: 'autoswarm',
            STAT_CALCULATOR: 'swarm',
        },
    }],
};

Class.minichip = {
    PARENT: "drone",
    LABEL: "Minichip",
    SHAPE: 4,
};
Class.turretedBullet_CLSTL = makeAuto('bullet', "Auto-Bullet", {type: ["bulletAutoTurret", {GUN_STAT_SCALE: [y.celestialGuns]}], size: 14, color: "veryLightGrey", angle: 0});
Class.twinAutoMinichip_CLSTL = makeAuto("minichip", "Twin Auto-Sunchip", {size: 7.5, type: ['autoSmasherTurret', {GUN_STAT_SCALE: {reload: 2}}], color: "veryLightGrey", angle: 0});
Class.celestial_CLSTL = {
    PARENT: "miniboss",
    LABEL: "Celestial",
    TYPE: "tank",
    IGNORED_BY_AI: false,
    INVISIBLE: [0, 0],
    ALPHA: 1,
    SKILL: [12, 12, 12, 12, 12, 12, 12, 12, 12, 12],
    UPGRADE_COLOR: "mirror",
    VALUE: 1e6,
    SHAPE: 9,
    DANGER: 25,
    SIZE: 45,
    CONTROLLERS: [["minion", {orbit: 240}]],
    FACING_TYPE: ["spin", { speed: 0.02 / ((typeof Config !== "undefined" && Config.runSpeed) || 1) }],
    BODY: {
        FOV: 1,
        HEALTH: 900,
        SHIELD: 150,
        REGEN: base.REGEN * 0.1,
        SPEED: base.SPEED * 0.3,
        DAMAGE: 6,
    },
    BROADCAST_MESSAGE: "A celestial has departed!",
    GUNS: weaponArray([
        {
            POSITION: [12, 4, 1, 0, 0, 180, 0],
        }, {
            POSITION: [1.25, 4, 1.6, 12, 0, 180, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, g.pounder, g.hexaTrapper, {reload: 1.3, size: 1.2, health: 1.35, damage: 1.4, speed: 0.9, shudder: 0.1}, {reload: 1.4, damage: 1.4, health: 1.4}, g.noRecoil]),
                TYPE: "trap",
                STAT_CALCULATOR: "trap",
                AUTOFIRE: true,
            },
        },
    ], 9)
};
Class.rogueCelestial_CLSTL = {
    PARENT: "celestial_CLSTL",
    LABEL: "Rogue Celestial",
    COLOR: "darkGrey",
    INVISIBLE: [0, 0],
    ALPHA: 1,
    SIZE: 40,
    BODY: {
        SPEED: base.SPEED * 0.35,
    },
    BROADCAST_MESSAGE: "A Rogue Celestial has been slain in battle...",
};
Class.eternal_CLSTL = {
    PARENT: "miniboss",
    LABEL: "Eternal",
    TYPE: "tank",
    IGNORED_BY_AI: false,
    INVISIBLE: [0, 0],
    ALPHA: 1,
    SKILL: [12, 12, 12, 12, 12, 12, 12, 12, 12, 12],
    UPGRADE_COLOR: "mirror",
    VALUE: 4e6,
    SHAPE: 11,
    DANGER: 35,
    SIZE: (arrasScale) ? 90 : 60,
    CONTROLLERS: [["minion", {orbit: 260}]],
    FACING_TYPE: ["spin", { speed: 0.02 / ((typeof Config !== "undefined" && Config.runSpeed) || 1) }],
    BODY: {
        FOV: 1,
        HEALTH: 1800,
        SHIELD: 200,
        REGEN: base.REGEN * 0.1,
        SPEED: base.SPEED * 0.175,
        DAMAGE: 9,
    },
    BROADCAST_MESSAGE: "An eternal has been put to rest...",
    GUNS: weaponArray([
        {
            POSITION: [12, 4, 1, 0, 0, 180, 0],
        }, {
            POSITION: [1.25, 4, 1.6, 12, 0, 180, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, g.pounder, g.hexaTrapper, {reload: 1.3, size: 1.2, health: 1.35, damage: 1.4, speed: 0.9, shudder: 0.1}, {reload: 2, damage: 2, health: 2}, g.noRecoil]),
                TYPE: "trap",
                STAT_CALCULATOR: "trap",
                AUTOFIRE: true,
            },
        },
    ], 11)
};
Class.rogueEternal_CLSTL = {
    PARENT: "eternal_CLSTL",
    LABEL: "Rogue Eternal",
    COLOR: "darkGrey",
    SIZE: (arrasScale) ? 80 : 55,
    BODY: {
        SPEED: base.SPEED * 0.2,
    },
    BROADCAST_MESSAGE: "A Rogue Eternal has been slain in battle...",
};
// Celestials
/// Paladin
Class.paladin_topTurret_CLSTL = {
    PARENT: "autoTurret",
    LABEL: "Swarmer",
    INDEPENDENT: true,
    BODY: {
        FOV: base.FOV * 1.1,
    },
    GUNS: [
        {
            POSITION: [15, 12, -1.2, 5, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pounder, y.genericLauncher, y.twisterG,{speed: 1.2, maxSpeed: 0.4}, y.hyperlaunch, g.noRecoil, y.celestialGuns]),
                TYPE: "hive",
            },
        },
        {
            POSITION: [15, 12*6/7, 1, 5, 0, 0, 0],
        },
    ],
}
let paladin_ = new LayeredBoss('paladin_CLSTL', "Paladin", "celestial_CLSTL", 9, "#8d6adf", null, 0, 0.5+20*(nineSidedShapeScale-sevenSidedShapeScale)/nineSidedShapeScale);
Class.paladin_CLSTL.TURRETS = []
paladin_.addLayer({gun: {
    POSITION: [3.8, 6, 1.3, 8, 0, null, 0],
    PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.drone, g.summoner, g.destroyer, {health: 1.5, damage: 1.5, resist: 1.2, density: 1.5, maxSpeed: 1.325, size: 15/4.5}, y.celestialSize, y.celestialGuns, g.noRecoil]),
        TYPE: ["demonchip", {INDEPENDENT: true}],
        AUTOFIRE: true,
        SYNCS_SKILLS: true,
        STAT_CALCULATOR: "drone",
        WAIT_TO_CYCLE: true,
    },
}}, true, null, 28)
paladin_.addLayer({turret: {
    POSITION: [l2Size, 8.5, 0, null, 180, 0],
    TYPE: ["paladin_topTurret_CLSTL", {GUN_STAT_SCALE: combineStats([{damage: 1.4, health: 1.4, reload: 1.3}]) }],
}})
/// Hera
Class.hera_lowTurret_CLSTL = {
    PARENT: "autoTurret",
    LABEL: "Barricade",
    INDEPENDENT: true,
    BODY: {
        FOV: base.FOV * 1.15,
    },
    GUNS: [
        {
            POSITION: [24, 8, 1, 0, 0, 0, 0],
        },
        {
            POSITION: [4, 8, 1.3, 22, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, {shudder: 0.6, health: 1.4, speed: 1.3}, g.minigun, {damage: 1.05, maxSpeed: 1.3, speed: 1.3}, { range: 0.5 }, y.celestialGuns, g.noRecoil]),
                TYPE: "trap",
                STAT_CALCULATOR: "trap",
            },
        },
        {
            POSITION: [4, 8, 1.3, 18, 0, 0, 1/3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, {shudder: 0.6, health: 1.4, speed: 1.3}, g.minigun, {damage: 1.05, maxSpeed: 1.3, speed: 1.3}, { range: 0.5 }, y.celestialGuns, g.noRecoil]),
                TYPE: "trap",
                STAT_CALCULATOR: "trap",
            },
        },
        {
            POSITION: [4, 8, 1.3, 14, 0, 0, 2/3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, {shudder: 0.6, health: 1.4, speed: 1.3}, g.minigun, {damage: 1.05, maxSpeed: 1.3, speed: 1.3}, { range: 0.5 }, y.celestialGuns, g.noRecoil]),
                TYPE: "trap",
                STAT_CALCULATOR: "trap",
            },
        },
    ],
}
Class.hera_topTurret_CLSTL = {
    PARENT: "autoTurret",
    LABEL: "Engineer",
    INDEPENDENT: true,
    BODY: {
        FOV: base.FOV * 1.15,
    },
    GUNS: [
        {
            POSITION: [5, 11, 1, 10.5, 0, 0, 0],
        },
        {
            POSITION: [3, 14, 1, 15.5, 0, 0, 0],
        },
        {
            POSITION: [2, 14, 1.3, 18, 0, 0, 0],
            PROPERTIES: {
                MAX_CHILDREN: 6,
                SHOOT_SETTINGS: combineStats([g.trap, {shudder: 0.6, health: 1.4, speed: 1.4}, g.setTrap, {speed: 0.8, damage: 0.6}, {reload: 1.3, speed: 0.9, damage: 0.85}, y.celestialGuns, g.noRecoil]),
                TYPE: "unsetPillbox",
                SYNCS_SKILLS: true,
                DESTROY_OLDEST_CHILD: true,
                STAT_CALCULATOR: "block"
            },
        },
        {
            POSITION: [4, 14, 1, 8, 0, 0, 0],
        },
    ],
}
let hera_ = new LayeredBoss('hera_CLSTL', "Hera", "celestial_CLSTL", 9, "#a472c3", null, 0, 0.5+20*(nineSidedShapeScale-sevenSidedShapeScale)/nineSidedShapeScale);
Class.hera_CLSTL.TURRETS = []
hera_.addLayer({turret: {
    POSITION: [l1Size, 7.5, 0, null, 180, 0],
    TYPE: "hera_lowTurret_CLSTL",
}})
hera_.addLayer({turret: {
    POSITION: [l2Size, 8.5, 0, null, 180, 0],
    TYPE: ["hera_topTurret_CLSTL", {GUN_STAT_SCALE: combineStats([{damage: 1.4, health: 1.4, reload: 1.3}]) }],
}})
/// Gersemi
Class.gersemi_lowTurret_CLSTL = {
    PARENT: "autoTurret",
    LABEL: "Triple Shot",
    INDEPENDENT: true,
    BODY: {
        FOV: base.FOV * 1,
    },
    GUNS: [
        {
            POSITION: [19, 8, 1, 0, -2, -17.5, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.tripleShot, y.celestialGuns, g.noRecoil]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: [19, 8, 1, 0, +2, +17.5, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.tripleShot, y.celestialGuns, g.noRecoil]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: [22, 8, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.tripleShot, y.celestialGuns, g.noRecoil]),
                TYPE: "bullet"
            }
        }
    ],
}
Class.gersemi_topTurret_CLSTL = {
    PARENT: "autoTurret",
    LABEL: "Constructor",
    INDEPENDENT: true,
    BODY: {
        FOV: base.FOV * 1.15,
    },
    GUNS: [
        {
            POSITION: [18, 18, 1, 0, 0, 0, 0],
        },
        {
            POSITION: [2, 18, 1.2, 18, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, {shudder: 0.6, health: 1.4, speed: 1.4}, g.setTrap, {speed: 0.8, damage: 0.6}, g.construct, y.celestialGuns, g.noRecoil]),
                TYPE: "setTrap",
                STAT_CALCULATOR: "block"
            }
        }
    ],
}
let gersemi_ = new LayeredBoss('gersemi_CLSTL', "Gersemi", "celestial_CLSTL", 9, "#988ac7", null, 0, 0.5+20*(nineSidedShapeScale-sevenSidedShapeScale)/nineSidedShapeScale);
Class.gersemi_CLSTL.TURRETS = []
gersemi_.addLayer({turret: {
    POSITION: [l1Size, 7.5, 0, null, 180, 0],
    TYPE: "gersemi_lowTurret_CLSTL",
}})
gersemi_.addLayer({turret: {
    POSITION: [l2Size, 8.5, 0, null, 180, 0],
    TYPE: ["gersemi_topTurret_CLSTL", {GUN_STAT_SCALE: combineStats([{damage: 1.4, health: 1.4, reload: 1.3}]) }],
}})
/// Kratos
Class.kratos_lowTurret_CLSTL = {
    PARENT: "autoTurret",
    LABEL: "Subverter",
    INDEPENDENT: true,
    BODY: {
        FOV: base.FOV * 1,
    },
    GUNS: [
        {
            POSITION: [21, 12, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.minigun, {damage: 1.05, maxSpeed: 1.3, speed: 1.3}, y.celestialGuns, g.noRecoil]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: [19, 12, 1, 0, 0, 0, 1/3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.minigun, {damage: 1.05, maxSpeed: 1.3, speed: 1.3}, y.celestialGuns, g.noRecoil]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: [17, 12, 1, 0, 0, 0, 2/3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.minigun, {damage: 1.05, maxSpeed: 1.3, speed: 1.3}, y.celestialGuns, g.noRecoil]),
                TYPE: "bullet"
            }
        }
    ],
}
Class.kratos_topTurret_CLSTL = {
    PARENT: "autoTurret",
    LABEL: "Sniper Rifle",
    INDEPENDENT: true,
    BODY: {
        FOV: base.FOV * 1.425,
    },
    GUNS: [
        {
            POSITION: [27, 7, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.sniper, {reload: 1.2, damage: 1.2, speed: 1.15, maxSpeed: 1.2}, g.sniper, g.rifle, {damage: 1.35}, y.celestialGuns, g.noRecoil]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: [12, 12, 1, 0, 0, 0, 0]
        },
    ],
}
let kratos_ = new LayeredBoss('kratos_CLSTL', "Kratos", "celestial_CLSTL", 9, "#b962dc", null, 0, 0.5+20*(nineSidedShapeScale-sevenSidedShapeScale)/nineSidedShapeScale);
Class.kratos_CLSTL.TURRETS = []
kratos_.addLayer({turret: {
    POSITION: [l1Size, 7.5, 0, null, 180, 0],
    TYPE: "kratos_lowTurret_CLSTL",
}})
kratos_.addLayer({turret: {
    POSITION: [l2Size, 8.5, 0, null, 180, 0],
    TYPE: ["kratos_topTurret_CLSTL", {GUN_STAT_SCALE: combineStats([{damage: 1.4, health: 1.4, reload: 1.3}]) }],
}})
/// Heimdall
Class.heimdall_lowTurret_CLSTL = {
    PARENT: "autoTurret",
    LABEL: "Builder",
    INDEPENDENT: true,
    BODY: {
        FOV: base.FOV * 1.15,
    },
    GUNS: [
        {
            POSITION: [18, 12, 1, 0, 0, 0, 0],
        },
        {
            POSITION: [2, 12, 1.1, 18, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, {shudder: 0.6, health: 1.4, speed: 1.3}, g.setTrap, {speed: 0.8, damage: 0.6}, y.celestialGuns]),
                TYPE: "setTrap",
                STAT_CALCULATOR: "block"
            }
        }
    ],
}
Class.heimdall_topTurret_CLSTL = {
    PARENT: "autoTurret",
    LABEL: "Accurator",
    INDEPENDENT: true,
    BODY: {
        FOV: base.FOV * 1.2,
    },
    GUNS: [
        {
            POSITION: [10, 10, 0.001, 21, 0, 0, 0],
        },
        {
            POSITION: [18, 10, 1.3, 8, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.sniper, {maxSpeed: 10}, y.celestialGuns]),
                TYPE: "speedBullet_CLSTL",
            }
        },
    ],
}
let heimdall_ = new LayeredBoss('heimdall_CLSTL', "Heimdall", "celestial_CLSTL", 9, "#baa2c6", null, 0, 0.5+20*(nineSidedShapeScale-sevenSidedShapeScale)/nineSidedShapeScale);
Class.heimdall_CLSTL.TURRETS = []
heimdall_.addLayer({turret: {
    POSITION: [l1Size, 7.5, 0, null, 180, 0],
    TYPE: "heimdall_lowTurret_CLSTL",
}})
heimdall_.addLayer({turret: {
    POSITION: [l2Size, 8.5, 0, null, 180, 0],
    TYPE: ["heimdall_topTurret_CLSTL", {GUN_STAT_SCALE: combineStats([{damage: 1.4, health: 1.4, reload: 1.3}]) }],
}})

/// Freyja
Class.freyja_lowTurret_CLSTL = {
    PARENT: "autoTurret",
    LABEL: "Cruiser",
    INDEPENDENT: true,
    BODY: {
        FOV: base.FOV * 1.1,
    },
    GUNS: [
        {
            POSITION: [7, 7.5, 0.6, 7, 4, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.swarm, {speed: 1.15, maxSpeed: 1.3, health: 1.2}, y.celestialGuns, g.noRecoil]),
                TYPE: "swarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [7, 7.5, 0.6, 7, -4, 0, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.swarm, {speed: 1.15, maxSpeed: 1.3, health: 1.2}, y.celestialGuns, g.noRecoil]),
                TYPE: "swarm",
                STAT_CALCULATOR: "swarm",
            },
        },
    ],
}
Class.freyja_topTurret_CLSTL = {
    PARENT: "autoTurret",
    LABEL: "Gunner",
    INDEPENDENT: true,
    BODY: {
        FOV: base.FOV * 1.2,
    },
    GUNS: [
        {
            POSITION: [16, 4, 1, 0, -3.5, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.twin, g.power, y.celestialGuns, g.noRecoil]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [16, 4, 1, 0, 3.5, 0, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.twin, g.power, y.celestialGuns, g.noRecoil]),
                TYPE: "bullet",
            },
        },
    ],
}
let freyja_ = new LayeredBoss('freyja_CLSTL', "Freyja", "celestial_CLSTL", 9, "#b9e87e", null, 0, 0.5+20*(nineSidedShapeScale-sevenSidedShapeScale)/nineSidedShapeScale);
Class.freyja_CLSTL.TURRETS = []
freyja_.addLayer({turret: {
    POSITION: [l1Size, 7.5, 0, null, 180, 0],
    TYPE: "freyja_lowTurret_CLSTL",
}})
freyja_.addLayer({turret: {
    POSITION: [l2Size, 8.5, 0, null, 180, 0],
    TYPE: ["freyja_topTurret_CLSTL", {GUN_STAT_SCALE: combineStats([{damage: 1.4, health: 1.4, reload: 1.3}]) }],
}})
/// Hyperion
Class.hyperion_lowTurret_CLSTL = {
    PARENT: "autoTurret",
    LABEL: "Pounders",
    INDEPENDENT: true,
    BODY: {
        FOV: base.FOV * 1,
    },
    GUNS: [
        {
            POSITION: [20.5, 12, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pounder, {health: 1.44}, y.celestialGuns]),
                TYPE: "bullet"
            }
        }
    ],
}
Class.hyperion_topTurret_CLSTL = {
    PARENT: "autoTurret",
    LABEL: "Sidewinder",
    INDEPENDENT: true,
    BODY: {
        FOV: base.FOV * 1.25,
    },
    GUNS: [
        {
            POSITION: [10, 8, 1, 13, 0, 0, 0],
        },
        {
            POSITION: [21, 12, -1.1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pounder, y.genericLauncher, y.sidewindG, y.hyperlaunch, y.celestialGuns, g.noRecoil]),
                TYPE: "snake_CLSTL",
                STAT_CALCULATOR: "sustained",
            },
        },
    ],
}
let hyperion_ = new LayeredBoss('hyperion_CLSTL', "Hyperion", "celestial_CLSTL", 9, "#aec996", null, 0, 0.5+20*(nineSidedShapeScale-sevenSidedShapeScale)/nineSidedShapeScale);
Class.hyperion_CLSTL.TURRETS = []
hyperion_.addLayer({turret: {
    POSITION: [l1Size, 7.5, 0, null, 180, 0],
    TYPE: "hyperion_lowTurret_CLSTL",
}})
hyperion_.addLayer({turret: {
    POSITION: [l2Size, 8.5, 0, null, 180, 0],
    TYPE: ["hyperion_topTurret_CLSTL", {GUN_STAT_SCALE: combineStats([{damage: 1.4, health: 1.4, reload: 1.3}]) }],
}})
/// Apollo
Class.apollo_lowTurret_CLSTL = {
    PARENT: "autoTurret",
    LABEL: "Blunderbuss",
    INDEPENDENT: true,
    BODY: {
        FOV: base.FOV * 1.225,
    },
    GUNS: [
        {
            POSITION: [11, 3, 1, 0, -(8-2.5), -13, 0.75],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.sniper, {reload: 1.2, damage: 0.7}, g.rifle, g.crossbow, y.celestialGuns, g.noRecoil]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [11, 3, 1, 0, (8-2.5), 13, 0.75],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.sniper, {reload: 1.2, damage: 0.7}, g.rifle, g.crossbow, y.celestialGuns, g.noRecoil]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [12, 3, 1, 0, -(7-2.5), -10, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.sniper, {reload: 1.2, damage: 0.7}, g.rifle, g.crossbow, y.celestialGuns, g.noRecoil]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [12, 3, 1, 0, (7-2.5), 10, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.sniper, {reload: 1.2, damage: 0.7}, g.rifle, g.crossbow, y.celestialGuns, g.noRecoil]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [14, 3, 1, 0, -(6-2.5), -7, 0.25],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.sniper, {reload: 1.2, damage: 0.7}, g.rifle, g.crossbow, y.celestialGuns, g.noRecoil]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [14, 3, 1, 0, (6-2.5), 7, 0.25],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.sniper, {reload: 1.2, damage: 0.7}, g.rifle, g.crossbow, y.celestialGuns, g.noRecoil]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [24, 7, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.sniper, {reload: 1.2, damage: 1.2, speed: 1.15, maxSpeed: 1.2}, g.rifle, g.crossbow, {damage: 1.35}, y.celestialGuns, g.noRecoil]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: [12, 12, 1, 0, 0, 0, 0]
        },
    ],
}
Class.apollo_topTurret_CLSTL = {
    PARENT: "autoTurret",
    LABEL: "Shotgun",
    INDEPENDENT: true,
    BODY: {
        FOV: base.FOV * 1.2,
    },
    GUNS: [
        {
            POSITION: [4, 3, 1, 11, -3, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.shotgun, y.celestialGuns, g.noRecoil]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [4, 3, 1, 11, 3, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.shotgun, y.celestialGuns, g.noRecoil]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [4, 4, 1, 13, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.shotgun, y.celestialGuns, g.noRecoil]),
                TYPE: "casing",
            },
        },
        {
            POSITION: [1, 4, 1, 12, -1, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.shotgun, y.celestialGuns, g.noRecoil]),
                TYPE: "casing",
            },
        },
        {
            POSITION: [1, 4, 1, 11, 1, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.shotgun, y.celestialGuns, g.noRecoil]),
                TYPE: "casing",
            },
        },
        {
            POSITION: [1, 3, 1, 13, -1, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.shotgun, y.celestialGuns, g.noRecoil]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [1, 3, 1, 13, 1, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.shotgun, y.celestialGuns, g.noRecoil]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [1, 2, 1, 13, 2, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.shotgun, y.celestialGuns, g.noRecoil]),
                TYPE: "casing",
            },
        },
        {
            POSITION: [1, 2, 1, 13, -2, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.shotgun, y.celestialGuns, g.noRecoil]),
                TYPE: "casing",
            },
        },
        {
            POSITION: [15, 14, 1, 6, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.shotgun, y.celestialGuns, g.noRecoil, g.fake]),
                TYPE: "casing",
            },
        },
        {
            POSITION: [8, 14, -1.3, 4, 0, 0, 0],
        },
    ],
}
let apollo_ = new LayeredBoss('apollo_CLSTL', "Apollo", "celestial_CLSTL", 9, "#d4c1a1", null, 0, 0.5+20*(nineSidedShapeScale-sevenSidedShapeScale)/nineSidedShapeScale);
Class.apollo_CLSTL.TURRETS = []
apollo_.addLayer({turret: {
    POSITION: [l1Size, 7.5, 0, null, 180, 0],
    TYPE: "apollo_lowTurret_CLSTL",
}})
apollo_.addLayer({turret: {
    POSITION: [l2Size, 8.5, 0, null, 180, 0],
    TYPE: ["apollo_topTurret_CLSTL", {GUN_STAT_SCALE: combineStats([{damage: 1.4, health: 1.4, reload: 1.3}]) }],
}})
/// Sif
Class.sif_lowTurret_CLSTL = {
    PARENT: "autoTurret",
    LABEL: "Wark",
    INDEPENDENT: true,
    BODY: {
        FOV: base.FOV * 1,
    },
    GUNS: [
        {
            POSITION: [14, 8, 1, 0, 5.5, +5, 0],
        },
        {
            POSITION: [3, 9, 1.5, 14, 5.5, +5, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, {shudder: 0.6, health: 1.4, speed: 1.3}, g.twin, y.celestialGuns, g.noRecoil]),
                TYPE: "trap",
                STAT_CALCULATOR: "trap",
            },
        },
        {
            POSITION: [14, 8, 1, 0, -5.5, -5, 0],
        },
        {
            POSITION: [3, 9, 1.5, 14, -5.5, -5, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, {shudder: 0.6, health: 1.4, speed: 1.3}, g.twin, y.celestialGuns, g.noRecoil]),
                TYPE: "trap",
                STAT_CALCULATOR: "trap",
            },
        },
    ],
}
Class.sif_topTurret_CLSTL = {
    PARENT: "autoTurret",
    LABEL: "Crossbow",
    INDEPENDENT: true,
    BODY: {
        FOV: base.FOV * 1.2,
    },
    GUNS: [
        {
            POSITION: [12.5, 2.5, 1, 0, 3.5, 35, 1],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.sniper, {reload: 1.5, damage: 1.2, speed: 1.15, maxSpeed: 1.2}, g.rifle,{damage: 1.35}, g.crossbow, y.celestialGuns, g.noRecoil]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: [12.5, 2.5, 1, 0, -3.5, -35, 1],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.sniper, {reload: 1.5, damage: 1.2, speed: 1.15, maxSpeed: 1.2}, g.rifle,{damage: 1.35}, g.crossbow, y.celestialGuns, g.noRecoil, { speed: 0.7, maxSpeed: 0.7 }]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: [15, 2.5, 1, 0, 3.5, 35/2, 2/3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.sniper, {reload: 1.5, damage: 1.2, speed: 1.15, maxSpeed: 1.2}, g.rifle,{damage: 1.35}, g.crossbow, y.celestialGuns, g.noRecoil, { speed: 0.7, maxSpeed: 0.7 }]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: [15, 2.5, 1, 0, -3.5, -35/2, 2/3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.sniper, {reload: 1.5, damage: 1.2, speed: 1.15, maxSpeed: 1.2}, g.rifle,{damage: 1.35}, g.crossbow, y.celestialGuns, g.noRecoil, { speed: 0.7, maxSpeed: 0.7 }]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: [20, 3.5, 1, 0, 4, 0, 1/3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.sniper, {reload: 1.5, damage: 1.2, speed: 1.15, maxSpeed: 1.2}, g.rifle,{damage: 1.35}, g.crossbow, y.celestialGuns, g.noRecoil, { speed: 0.7, maxSpeed: 0.7 }]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: [20, 3.5, 1, 0, -4, 0, 1/3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.sniper, {reload: 1.5, damage: 1.2, speed: 1.15, maxSpeed: 1.2}, g.rifle,{damage: 1.35}, g.crossbow, y.celestialGuns, g.noRecoil, { speed: 0.7, maxSpeed: 0.7 }]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: [24, 7, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.sniper, {reload: 1.5, damage: 1.2, speed: 1.15, maxSpeed: 1.2}, g.rifle,{damage: 1.35}, g.crossbow, y.celestialGuns, g.noRecoil, { speed: 0.7, maxSpeed: 0.7 }]),
                TYPE: "bullet"
            }
        }
    ],
}
let sif_ = new LayeredBoss('sif_CLSTL', "Sif", "celestial_CLSTL", 9, "#c7e071", null, 0, 0.5+20*(nineSidedShapeScale-sevenSidedShapeScale)/nineSidedShapeScale);
Class.sif_CLSTL.TURRETS = []
sif_.addLayer({turret: {
    POSITION: [l1Size, 7.5, 0, null, 180, 0],
    TYPE: "sif_lowTurret_CLSTL",
}})
sif_.addLayer({turret: {
    POSITION: [l2Size, 8.5, 0, null, 180, 0],
    TYPE: ["sif_topTurret_CLSTL", {GUN_STAT_SCALE: combineStats([{damage: 1.4, health: 1.4, reload: 1.3}]) }],
}})
/// Vor
Class.vor_lowTurret_CLSTL = {
    PARENT: "autoTurret",
    LABEL: "Triplet",
    INDEPENDENT: true,
    BODY: {
        FOV: base.FOV * 1.05,
    },
    GUNS: [
        {
            POSITION: [18, 10, 1, 0, 5, 0, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.triplet, {reload: 0.9}, g.noRecoil, y.celestialGuns]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: [18, 10, 1, 0, -5, 0, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.triplet, {reload: 0.9}, g.noRecoil, y.celestialGuns]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: [21, 10, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.triplet, {reload: 0.9}, g.noRecoil, y.celestialGuns]),
                TYPE: "bullet"
            }
        }
    ],
}
Class.vor_topTurret_CLSTL = {
    PARENT: "autoTurret",
    LABEL: "Builder",
    INDEPENDENT: true,
    BODY: {
        FOV: base.FOV * 1.15,
    },
    GUNS: [
        {
            POSITION: [18, 12, 1, 0, 0, 0, 0],
        },
        {
            POSITION: [2, 12, 1.1, 18, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, {shudder: 0.6, health: 1.4, speed: 1.3}, g.setTrap, {speed: 0.8, damage: 0.6}, y.celestialGuns, g.noRecoil]),
                TYPE: "unsetTrap",
                STAT_CALCULATOR: "block"
            }
        }
    ],
}
let vor_ = new LayeredBoss('vor_CLSTL', "Vor", "celestial_CLSTL", 9, "#c5d07a", null, 0, 0.5+20*(nineSidedShapeScale-sevenSidedShapeScale)/nineSidedShapeScale);
Class.vor_CLSTL.TURRETS = []
vor_.addLayer({turret: {
    POSITION: [l1Size, 7.5, 0, null, 180, 0],
    TYPE: "vor_lowTurret_CLSTL",
}})
vor_.addLayer({turret: {
    POSITION: [l2Size, 8.5, 0, null, 180, 0],
    TYPE: ["vor_topTurret_CLSTL", {GUN_STAT_SCALE: combineStats([{damage: 1.4, health: 1.4, reload: 1.3}]) }],
}})

/// Zaphkiel
Class.zaphkiel_topTurret_CLSTL = {
    PARENT: "autoTurret",
    LABEL: "Hyperskimmer",
    INDEPENDENT: true,
    BODY: {
        FOV: base.FOV * 1.15,
    },
    GUNS: [
        {
            POSITION: [10, 11, -0.5, 9, 0, 0, 0],
        },
        {
            POSITION: [10, 5.5, -0.5, 9, 0, 0, 0],
        },
        {
            POSITION: [17, 12, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pounder, y.genericLauncher, y.skimmerG, y.hyperlaunch, y.hyperlaunch, y.celestialGuns, g.noRecoil]),
                TYPE: "hypermissile_CLSTL",
                STAT_CALCULATOR: "sustained",
            },
        },
        {
            POSITION: [17, 6, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.fake, g.pounder, y.genericLauncher, y.skimmerG, y.hyperlaunch, y.hyperlaunch, y.celestialGuns, g.noRecoil]),
                TYPE: "bullet",
                STAT_CALCULATOR: "sustained",
            },
        },
    ],
}
let zaphkiel_ = new LayeredBoss('zaphkiel_CLSTL', "Zaphkiel", "celestial_CLSTL", 9, "#e7896d", null, 0, 0.5+20*(nineSidedShapeScale-sevenSidedShapeScale)/nineSidedShapeScale);
Class.zaphkiel_CLSTL.TURRETS = []
zaphkiel_.addLayer({gun: {
    POSITION: [3.8, 6, 1.3, 8, 0, null, 0],
    PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.drone, g.summoner, g.destroyer, {reload: 0.8, health: 1.25, damage: 1.3, resist: 1.3, density: 1.4, maxSpeed: 1.375, size: 10/4.5}, y.celestialGuns, {damage: 1.45, health: 1.45, reload: 2}, g.noRecoil]),
        TYPE: ["dorito", {INDEPENDENT: true}],
        AUTOFIRE: true,
        SYNCS_SKILLS: true,
        STAT_CALCULATOR: "drone",
        WAIT_TO_CYCLE: true,
    },
}}, true, null, 49)
zaphkiel_.addLayer({turret: {
    POSITION: [l2Size, 8.5, 0, null, 180, 0],
    TYPE: ["zaphkiel_topTurret_CLSTL", {GUN_STAT_SCALE: combineStats([{damage: 1.4, health: 1.4, reload: 1.3}]) }],
}})
/// Aether
Class.aether_lowTurret_CLSTL = {
    PARENT: "autoTurret",
    LABEL: "Rifle",
    INDEPENDENT: true,
    BODY: {
        FOV: base.FOV * 1.225,
    },
    GUNS: [
        {
            POSITION: [20, 12, 1, 0, 0, 0, 0]
        },
        {
            POSITION: [24, 7, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.sniper, {reload: 1.5, damage: 1.2, speed: 1.15, maxSpeed: 1.2}, g.rifle,{damage: 1.35}, y.celestialGuns, g.noRecoil]),
                TYPE: "bullet"
            }
        }
    ],
}
Class.aether_topTurret_CLSTL = {
    PARENT: "autoTurret",
    LABEL: "Streamliner",
    INDEPENDENT: true,
    BODY: {
        FOV: base.FOV * 1.3,
    },
    GUNS: [
        {
            POSITION: [25, 8, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.minigun, {damage: 1.05, maxSpeed: 1.3, speed: 1.3}, g.streamliner, y.celestialGuns, g.noRecoil]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [23, 8, 1, 0, 0, 0, 0.2],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.minigun, {damage: 1.05, maxSpeed: 1.3, speed: 1.3}, g.streamliner, y.celestialGuns, g.noRecoil]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [21, 8, 1, 0, 0, 0, 0.4],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.minigun, {damage: 1.05, maxSpeed: 1.3, speed: 1.3}, g.streamliner, y.celestialGuns, g.noRecoil]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [19, 8, 1, 0, 0, 0, 0.6],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.minigun, {damage: 1.05, maxSpeed: 1.3, speed: 1.3}, g.streamliner, y.celestialGuns, g.noRecoil]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [17, 8, 1, 0, 0, 0, 0.8],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.minigun, {damage: 1.05, maxSpeed: 1.3, speed: 1.3}, g.streamliner, y.celestialGuns, g.noRecoil]),
                TYPE: "bullet",
            },
        },
    ],
}
let aether_ = new LayeredBoss('aether_CLSTL', "Aether", "celestial_CLSTL", 9, "#dca171", null, 0, 0.5+20*(nineSidedShapeScale-sevenSidedShapeScale)/nineSidedShapeScale);
Class.aether_CLSTL.TURRETS = []
aether_.addLayer({turret: {
    POSITION: [l1Size, 7.5, 0, null, 180, 0],
    TYPE: "aether_lowTurret_CLSTL",
}})
aether_.addLayer({turret: {
    POSITION: [l2Size, 8.5, 0, null, 180, 0],
    TYPE: ["aether_topTurret_CLSTL", {GUN_STAT_SCALE: combineStats([{damage: 1.4, health: 1.4, reload: 1.3}]) }],
}})
/// Eros
Class.eros_lowTurret_CLSTL = {
    PARENT: "autoTurret",
    LABEL: "Sprayer",
    INDEPENDENT: true,
    BODY: {
        FOV: base.FOV * 1,
    },
    GUNS: [
        {
            POSITION: [23, 7, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.lowPower, g.pelleter, { recoil: 1.15 }, g.sprayer, y.celestialGuns, g.noRecoil]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: [12, 10, 1.4, 8, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.sprayer, y.celestialGuns, g.noRecoil]),
                TYPE: "bullet"
            }
        }
    ],
}
Class.eros_topTurret_CLSTL = {
    PARENT: "autoTurret",
    LABEL: "Single",
    INDEPENDENT: true,
    BODY: {
        FOV: base.FOV * 1,
    },
    GUNS: [
        {
            POSITION: [19, 8, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.single, {damage: 1.1, health: 1.1, pen: 1.1}, y.celestialGuns, g.noRecoil]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: [5.5, 8, -1.8, 6.5, 0, 0, 0]
        }
    ],
}
let eros_ = new LayeredBoss('eros_CLSTL', "Eros", "celestial_CLSTL", 9, "#d1818a", null, 0, 0.5+20*(nineSidedShapeScale-sevenSidedShapeScale)/nineSidedShapeScale);
Class.eros_CLSTL.TURRETS = []
eros_.addLayer({turret: {
    POSITION: [l1Size, 7.5, 0, null, 180, 0],
    TYPE: "eros_lowTurret_CLSTL",
}})
eros_.addLayer({turret: {
    POSITION: [l2Size, 8.5, 0, null, 180, 0],
    TYPE: ["eros_topTurret_CLSTL", {GUN_STAT_SCALE: combineStats([{damage: 1.4, health: 1.4, reload: 1.3}]) }],
}})
/// Freyr
Class.freyr_topTurret_CLSTL = {
    PARENT: "autoTurret",
    LABEL: "Carrier",
    INDEPENDENT: true,
    BODY: {
        FOV: base.FOV * 1.1,
    },
    GUNS: [
        {
            POSITION: [7, 8, 0.6, 7, 2, 30, 0.667],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.swarm, {speed: 1.15, maxSpeed: 1.3}, g.battleship, g.carrier, y.celestialGuns, g.noRecoil]),
                TYPE: "swarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [7, 8, 0.6, 7, -2, -30, 0.667],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.swarm, {speed: 1.15, maxSpeed: 1.3}, g.battleship, g.carrier, y.celestialGuns, g.noRecoil]),
                TYPE: "swarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [7, 8, 0.6, 7, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.swarm, {speed: 1.15, maxSpeed: 1.3}, g.battleship, g.carrier, y.celestialGuns, g.noRecoil]),
                TYPE: "swarm",
                STAT_CALCULATOR: "swarm",
            },
        },
    ],
}
let freyr_ = new LayeredBoss('freyr_CLSTL', "Freyr", "celestial_CLSTL", 9, "#e98d83", null, 0, 0.5+20*(nineSidedShapeScale-sevenSidedShapeScale)/nineSidedShapeScale);
Class.freyr_CLSTL.TURRETS = []
freyr_.addLayer({gun: {
    POSITION: [3.8, 6, 1.3, 8, 0, null, 0],
    PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.drone, y.celestialGuns, g.noRecoil]),
        TYPE: ["turretedDrone", {INDEPENDENT: true}],
        AUTOFIRE: true,
        SYNCS_SKILLS: true,
        STAT_CALCULATOR: "drone",
        WAIT_TO_CYCLE: true,
    },
}}, true, null, 21)
freyr_.addLayer({turret: {
    POSITION: [l2Size, 8.5, 0, null, 180, 0],
    TYPE: ["freyr_topTurret_CLSTL", {GUN_STAT_SCALE: combineStats([{damage: 1.4, health: 1.4, reload: 1.3}]) }],
}})
/// Alcis
Class.alcis_lowTurret_CLSTL = {
    PARENT: "autoTurret",
    LABEL: "Trapper",
    INDEPENDENT: true,
    BODY: {
        FOV: base.FOV * 1,
    },
    GUNS: [
        {
            POSITION: [15, 8, 1, 0, 0, 0, 0],
        },
        {
            POSITION: [3, 8, 1.7, 15, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, {shudder: 0.6, health: 1.4, speed: 1.3}, y.celestialGuns, g.noRecoil]),
                TYPE: "trap",
                STAT_CALCULATOR: "trap"
            }
        }
    ],
}
Class.alcis_topTurret_CLSTL = {
    PARENT: "autoTurret",
    LABEL: "Spreadshot",
    INDEPENDENT: true,
    BODY: {
        FOV: base.FOV * 1,
    },
    GUNS: [
        {
            POSITION: [13, 4, 1, 0, -0.5, -75, 5 / 6],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.artillery, g.twin, g.spreadshot, y.celestialGuns, g.noRecoil]),
                TYPE: "bullet",
                LABEL: "Spread"
            }
        },
        {
            POSITION: [13, 4, 1, 0, 0.5, 75, 5 / 6],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.artillery, g.twin, g.spreadshot, y.celestialGuns, g.noRecoil]),
                TYPE: "bullet",
                LABEL: "Spread"
            }
        },
        {
            POSITION: [14.5, 4, 1, 0, -0.5, -60, 4 / 6],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.artillery, g.twin, g.spreadshot, y.celestialGuns, g.noRecoil]),
                TYPE: "bullet",
                LABEL: "Spread"
            }
        },
        {
            POSITION: [14.5, 4, 1, 0, 0.5, 60, 4 / 6],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.artillery, g.twin, g.spreadshot, y.celestialGuns, g.noRecoil]),
                TYPE: "bullet",
                LABEL: "Spread"
            }
        },
        {
            POSITION: [16, 4, 1, 0, -0.5, -45, 3 / 6],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.artillery, g.twin, g.spreadshot, y.celestialGuns, g.noRecoil]),
                TYPE: "bullet",
                LABEL: "Spread"
            }
        },
        {
            POSITION: [16, 4, 1, 0, 0.5, 45, 3 / 6],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.artillery, g.twin, g.spreadshot, y.celestialGuns, g.noRecoil]),
                TYPE: "bullet",
                LABEL: "Spread"
            }
        },
        {
            POSITION: [17.5, 4, 1, 0, -0.5, -30, 2 / 6],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.artillery, g.twin, g.spreadshot, y.celestialGuns, g.noRecoil]),
                TYPE: "bullet",
                LABEL: "Spread"
            }
        },
        {
            POSITION: [17.5, 4, 1, 0, 0.5, 30, 2 / 6],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.artillery, g.twin, g.spreadshot, y.celestialGuns, g.noRecoil]),
                TYPE: "bullet",
                LABEL: "Spread"
            }
        },
        {
            POSITION: [19, 4, 1, 0, -1, -15, 1 / 6],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.artillery, g.twin, g.spreadshot, y.celestialGuns, g.noRecoil]),
                TYPE: "bullet",
                LABEL: "Spread"
            }
        },
        {
            POSITION: [19, 4, 1, 0, 1, 15, 1 / 6],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.artillery, g.twin, g.spreadshot, y.celestialGuns, g.noRecoil]),
                TYPE: "bullet",
                LABEL: "Spread"
            }
        },
        {
            POSITION: [12, 8, 1, 8, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.spreadshotMain, g.spreadshot, y.celestialGuns, g.noRecoil]),
                TYPE: "bullet"
            }
        }
    ],
}
let alcis_ = new LayeredBoss('alcis_CLSTL', "Alcis", "celestial_CLSTL", 9, "#e99965", null, 0, 0.5+20*(nineSidedShapeScale-sevenSidedShapeScale)/nineSidedShapeScale);
Class.alcis_CLSTL.TURRETS = []
alcis_.addLayer({turret: {
    POSITION: [l1Size, 7.5, 0, null, 180, 0],
    TYPE: "alcis_lowTurret_CLSTL",
}})
alcis_.addLayer({turret: {
    POSITION: [l2Size, 8.5, 0, null, 180, 0],
    TYPE: ["alcis_topTurret_CLSTL", {GUN_STAT_SCALE: combineStats([{damage: 1.4, health: 1.4, reload: 1.3}]) }],
}})

// Theia
Class.theia_topTurret_CLSTL = {
    PARENT: "autoTurret",
    LABEL: "Hypertwister",
    INDEPENDENT: true,
    BODY: {
        FOV: base.FOV * 1.1,
    },
    GUNS: [
        {
            POSITION: [10, 11, -0.5, 9, 0, 0, 0],
        },
        {
            POSITION: [10, 5.5, -0.5, 9, 0, 0, 0],
        },
        {
            POSITION: [17, 12, -1.4, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pounder, y.genericLauncher, y.twisterG, y.hyperlaunch, y.hyperlaunch, y.celestialGuns, g.noRecoil]),
                TYPE: "hyperspinmissile_CLSTL",
                STAT_CALCULATOR: "sustained",
            },
        },
        {
            POSITION: [17, 6, -1.4, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.fake, g.pounder, y.genericLauncher, y.twisterG, y.hyperlaunch, y.hyperlaunch, y.celestialGuns, g.noRecoil]),
                TYPE: "bullet",
                STAT_CALCULATOR: "sustained",
            },
        },
    ],
}
let theia_ = new LayeredBoss('theia_CLSTL', "Theia", "celestial_CLSTL", 9, "#efc74b", null, 0, 0.5+20*(nineSidedShapeScale-sevenSidedShapeScale)/nineSidedShapeScale);
Class.theia_CLSTL.TURRETS = []
theia_.addLayer({gun: {
    POSITION: [3.8, 6, 1.3, 8, 0, 180, 0],
    PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.drone, g.summoner, g.destroyer, {reload: 0.4, health: 0.8, damage: 0.9, resist: 1.3, density: 1.3, maxSpeed: 1.45, size: 10/4.5}, y.celestialSize, y.celestialGuns, g.noRecoil]),
        TYPE: ["summonerDrone", {INDEPENDENT: true}],
        AUTOFIRE: true,
        SYNCS_SKILLS: true,
        STAT_CALCULATOR: "drone",
        WAIT_TO_CYCLE: true,
    },
}}, true, null, 84)
theia_.addLayer({turret: {
    POSITION: [l2Size, 8.5, 0, null, 180, 0],
    TYPE: ["theia_topTurret_CLSTL", {GUN_STAT_SCALE: combineStats([{damage: 1.4, health: 1.4, reload: 1.3}]) }],
}})
/// Atlas
Class.atlas_lowTurret_CLSTL = {
    PARENT: "autoTurret",
    LABEL: "Artillery",
    INDEPENDENT: true,
    BODY: {
        FOV: base.FOV * 1,
    },
    GUNS: [
        {
            POSITION: [17, 3, 1, 0, -6, -7, 0.25],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.artillery, y.celestialGuns, g.noRecoil]),
                TYPE: "bullet",
                LABEL: "Secondary",
            },
        },
        {
            POSITION: [17, 3, 1, 0, 6, 7, 0.75],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.artillery, y.celestialGuns, g.noRecoil]),
                TYPE: "bullet",
                LABEL: "Secondary",
            },
        },
        {
            POSITION: [19, 12, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.artillery, y.celestialGuns, g.noRecoil]),
                TYPE: "bullet",
                LABEL: "Heavy",
            },
        },
    ],
}
Class.atlas_topTurret_CLSTL = {
    PARENT: "autoTurret",
    LABEL: "Nailgun",
    INDEPENDENT: true,
    BODY: {
        FOV: base.FOV * 1.1,
    },
    GUNS: [
        {
            POSITION: [19, 2, 1, 0, -2.5, 0, 0.25],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.power, g.twin, g.nailgun, y.celestialGuns, g.noRecoil]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [19, 2, 1, 0, 2.5, 0, 0.75],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.power, g.twin, g.nailgun, y.celestialGuns, g.noRecoil]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [20, 2, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.power, g.twin, g.nailgun, y.celestialGuns, g.noRecoil]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [5.5, 7, -1.8, 6.5, 0, 0, 0],
        },
    ],
}
let atlas_ = new LayeredBoss('atlas_CLSTL', "Atlas", "celestial_CLSTL", 9, "#edb854", null, 0, 0.5+20*(nineSidedShapeScale-sevenSidedShapeScale)/nineSidedShapeScale);
Class.atlas_CLSTL.TURRETS = []
atlas_.addLayer({turret: {
    POSITION: [l1Size, 7.5, 0, null, 180, 0],
    TYPE: "atlas_lowTurret_CLSTL",
}})
atlas_.addLayer({turret: {
    POSITION: [l2Size, 8.5, 0, null, 180, 0],
    TYPE: ["atlas_topTurret_CLSTL", {GUN_STAT_SCALE: combineStats([{damage: 1.4, health: 1.4, reload: 1.3}]) }],
}})
/// Tethys
Class.tethys_lowTurret_CLSTL = {
    PARENT: "autoTurret",
    LABEL: "Bent Builder",
    INDEPENDENT: true,
    BODY: {
        FOV: base.FOV * 1.15,
    },
    GUNS: [
        {
            POSITION: [18, 12, 1, 0, 0, 35, 0],
        },
        {
            POSITION: [2, 12, 1.1, 18, 0, 35, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, g.tripleShot, {shudder: 0.6, health: 1.4, speed: 1.3}, g.setTrap, {speed: 0.8, damage: 0.6}, y.celestialGuns, g.noRecoil]),
                TYPE: "unsetTrap",
                STAT_CALCULATOR: "block"
            }
        },
        {
            POSITION: [18, 12, 1, 0, 0, -35, 0.5],
        },
        {
            POSITION: [2, 12, 1.1, 18, 0, -35, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, g.tripleShot, {shudder: 0.6, health: 1.4, speed: 1.3}, g.setTrap, {speed: 0.8, damage: 0.6}, y.celestialGuns, g.noRecoil]),
                TYPE: "unsetTrap",
                STAT_CALCULATOR: "block"
            }
        }
    ]
}
Class.tethys_topTurret_CLSTL = {
    PARENT: "autoTurret",
    LABEL: "Boomer",
    INDEPENDENT: true,
    BODY: {
        FOV: base.FOV * 1.15,
    },
    CONTROLLERS: ["targetSelf"],
    GUNS: [
        {
            POSITION: [5, 10, 1, 13, 0, 0, 0],
        },
        {
            POSITION: [6, 10, -1.5, 7, 0, 0, 0],
        },
        {
            POSITION: [2, 10, 1.3, 18, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, {shudder: 0.6, health: 1.4, speed: 1.3}, g.setTrap, {speed: 0.8, damage: 0.6}, g.boomerang, y.celestialGuns, g.noRecoil]),
                TYPE: ["boomerang", {BODY: {SPEED: 2, ACCEL: 4} }],
                STAT_CALCULATOR: "block"
            },
        },
    ],
}
let tethys_ = new LayeredBoss('tethys_CLSTL', "Tethys", "celestial_CLSTL", 9, "#e2cf58", null, 0, 0.5+20*(nineSidedShapeScale-sevenSidedShapeScale)/nineSidedShapeScale);
Class.tethys_CLSTL.TURRETS = []
tethys_.addLayer({turret: {
    POSITION: [l1Size, 8.5, 0, null, 20, 0],
    TYPE: "tethys_lowTurret_CLSTL",
}})
tethys_.addLayer({turret: {
    POSITION: [l2Size, 8.5, 0, null, 180, 0],
    TYPE: ["tethys_topTurret_CLSTL", {GUN_STAT_SCALE: combineStats([{damage: 1.4, health: 1.4, reload: 1.3}]) }],
}})
/// Rhea
Class.rhea_lowTurret_CLSTL = {
    PARENT: "autoTurret",
    LABEL: "Wrench",
    INDEPENDENT: true,
    BODY: {
        FOV: base.FOV * 1,
    },
    GUNS: [
        {
            POSITION: [67, 6.5, 1, 0, 0, 0, 0],
        }, {
            POSITION: [5, 8.5, -1.5, 8, 0, 0, 0],
        },
    ],
    TURRETS: [
        {
            POSITION: [6, 68, 0, 0, 180, 1],
            TYPE: [ "autoTankGun", { GUN_STAT_SCALE: combineStats([g.flankGuard, y.celestialGuns]), INDEPENDENT: true, HAS_NO_RECOIL: true } ],
        }, {
            POSITION: [6, 58, 0, 0, 180, 1],
            TYPE: [ "autoTankGun", { GUN_STAT_SCALE: combineStats([g.flankGuard, y.celestialGuns]), INDEPENDENT: true, HAS_NO_RECOIL: true } ],
        }, {
            POSITION: [6, 48, 0, 0, 180, 1],
            TYPE: [ "autoTankGun", { GUN_STAT_SCALE: combineStats([g.flankGuard, y.celestialGuns]), INDEPENDENT: true, HAS_NO_RECOIL: true } ],
        },
    ],
}
Class.rhea_topTurret_CLSTL = {
    PARENT: "autoTurret",
    LABEL: "Crowbar",
    INDEPENDENT: true,
    BODY: {
        FOV: base.FOV * 1,
    },
    GUNS: [
        {
            POSITION: [37, 6.5, 1, 0, 0, 0, 0],
        }, {
            POSITION: [5, 8.5, -1.5, 8, 0, 0, 0],
        },
    ],
    TURRETS: [
        {
            POSITION: [6, 38, 0, 0, 180, 1],
            TYPE: [ "autoTankGun", { GUN_STAT_SCALE: combineStats([g.flankGuard, y.celestialGuns, {damage: 1.4, health: 1.4, reload: 1.3}]), INDEPENDENT: true, HAS_NO_RECOIL: true } ],
        }, {
            POSITION: [6, 28, 0, 0, 180, 1],
            TYPE: [ "autoTankGun", { GUN_STAT_SCALE: combineStats([g.flankGuard, y.celestialGuns, {damage: 1.4, health: 1.4, reload: 1.3}]), INDEPENDENT: true, HAS_NO_RECOIL: true } ],
        }, {
            POSITION: [6, 18, 0, 0, 180, 1],
            TYPE: [ "autoTankGun", { GUN_STAT_SCALE: combineStats([g.flankGuard, y.celestialGuns, {damage: 1.4, health: 1.4, reload: 1.3}]), INDEPENDENT: true, HAS_NO_RECOIL: true } ],
        },
    ],
}
let rhea_ = new LayeredBoss('rhea_CLSTL', "Rhea", "celestial_CLSTL", 9, "#d7b070", null, 0, 0.5+20*(nineSidedShapeScale-sevenSidedShapeScale)/nineSidedShapeScale);
Class.rhea_CLSTL.TURRETS = []
rhea_.addLayer({turret: {
    POSITION: [l1Size, 7.5, 0, null, 180, 0],
    TYPE: "rhea_lowTurret_CLSTL",
}})
rhea_.addLayer({turret: {
    POSITION: [l2Size, 8.5, 0, null, 180, 0],
    TYPE: ["rhea_topTurret_CLSTL", {GUN_STAT_SCALE: combineStats([{damage: 1.4, health: 1.4, reload: 1.3}]) }],
}})
/// Baldr
Class.baldr_lowTurret_CLSTL = {
    PARENT: "autoTurret",
    LABEL: "Minigun",
    INDEPENDENT: true,
    BODY: {
        FOV: base.FOV * 1,
    },
    GUNS: [
        {
            POSITION: [21, 8, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.minigun, {damage: 1.05, maxSpeed: 1.3, speed: 1.3}, y.celestialGuns, g.noRecoil]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: [19, 8, 1, 0, 0, 0, 1/3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.minigun, {damage: 1.05, maxSpeed: 1.3, speed: 1.3}, y.celestialGuns, g.noRecoil]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: [17, 8, 1, 0, 0, 0, 2/3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.minigun, {damage: 1.05, maxSpeed: 1.3, speed: 1.3}, y.celestialGuns, g.noRecoil]),
                TYPE: "bullet"
            }
        }
    ],
}
Class.baldr_topTurret_CLSTL = {
    PARENT: "autoTurret",
    LABEL: "Ranger",
    INDEPENDENT: true,
    BODY: {
        FOV: base.FOV * 1,
    },
    GUNS: [
        {
            POSITION: [32, 8, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.sniper, {reload: 1.5, damage: 1.2, speed: 1.15, maxSpeed: 1.2}, g.assassin, {reload: 1.2, damage: 1.1, speed: 1.125, maxSpeed: 1.15}, y.celestialGuns, g.noRecoil]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [5, 8, -1.4, 8, 0, 0, 0],
        },
    ],
}
let baldr_ = new LayeredBoss('baldr_CLSTL', "Baldr", "celestial_CLSTL", 9, "#efbc69", null, 0, 0.5+20*(nineSidedShapeScale-sevenSidedShapeScale)/nineSidedShapeScale);
Class.baldr_CLSTL.TURRETS = []
baldr_.addLayer({turret: {
    POSITION: [l1Size, 7.5, 0, null, 180, 0],
    TYPE: "baldr_lowTurret_CLSTL",
}})
baldr_.addLayer({turret: {
    POSITION: [l2Size, 8.5, 0, null, 180, 0],
    TYPE: ["baldr_topTurret_CLSTL", {GUN_STAT_SCALE: combineStats([{damage: 1.4, health: 1.4, reload: 1.3}]) }],
}})

// Nyx
Class.nyx_topTurret_CLSTL = {
    PARENT: "autoTurret",
    LABEL: "Rocketeer",
    INDEPENDENT: true,
    BODY: {
        FOV: base.FOV * 1.1,
    },
    GUNS: [
        {
            POSITION: [10, 12.5, -0.7, 10, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pounder, y.genericLauncher, y.rocketeerG, y.hyperlaunch, y.celestialGuns, g.noRecoil]),
                TYPE: "rocketeerMissile_CLSTL",
                STAT_CALCULATOR: "sustained",
            },
        },
        {
            POSITION: [17, 18, 0.65, 0, 0, 0, 0],
        },
    ],
}
let nyx_ = new LayeredBoss('nyx_CLSTL', "Nyx", "celestial_CLSTL", 9, "#ef99c3", null, 0, 0.5+20*(nineSidedShapeScale-sevenSidedShapeScale)/nineSidedShapeScale);
Class.nyx_CLSTL.TURRETS = []
nyx_.addLayer({gun: {
    POSITION: [3.8, 6, 1.3, 8, 0, null, 0],
    PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.spawner, y.celestialGuns, g.noRecoil]),
        TYPE: ["minion", {INDEPENDENT: true}],
        AUTOFIRE: true,
        SYNCS_SKILLS: true,
        STAT_CALCULATOR: "drone",
        WAIT_TO_CYCLE: true,
    },
}}, true, null, 14)
nyx_.addLayer({turret: {
    POSITION: [l2Size, 8.5, 0, null, 180, 0],
    TYPE: ["nyx_topTurret_CLSTL", {GUN_STAT_SCALE: combineStats([{damage: 1.4, health: 1.4, reload: 1.3}]) }],
}})
/// Styx
Class.styx_lowTurret_CLSTL = {
    PARENT: "autoTurret",
    LABEL: "Gunner",
    INDEPENDENT: true,
    BODY: {
        FOV: base.FOV * 1,
    },
    GUNS: [
        {
            POSITION: [12, 3.5, 1, 0, 7.25, 0, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.gunner, { speed: 1.2 }, y.celestialGuns, g.noRecoil]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: [12, 3.5, 1, 0, -7.25, 0, 0.75],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.gunner, { speed: 1.2 }, y.celestialGuns, g.noRecoil]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: [16, 3.5, 1, 0, 3.75, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.gunner, { speed: 1.2 }, y.celestialGuns, g.noRecoil]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: [16, 3.5, 1, 0, -3.75, 0, 0.25],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.gunner, { speed: 1.2 }, y.celestialGuns, g.noRecoil]),
                TYPE: "bullet"
            }
        }
    ],
}
Class.styx_topTurret_CLSTL = {
    PARENT: "autoTurret",
    LABEL: "Hunter",
    INDEPENDENT: true,
    BODY: {
        FOV: base.FOV * 1.25,
    },
    GUNS: [
        {
            POSITION: [24, 8, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.sniper, {reload: 1.5, damage: 1.2, speed: 1.15, maxSpeed: 1.2}, g.hunter, g.hunterSecondary, y.celestialGuns, g.noRecoil]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: [21, 12, 1, 0, 0, 0, 0.25],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.sniper, {reload: 1.5, damage: 1.2, speed: 1.15, maxSpeed: 1.2}, g.hunter, y.celestialGuns, g.noRecoil]),
                TYPE: "bullet"
            }
        }
    ],
}
let styx_ = new LayeredBoss('styx_CLSTL', "Styx", "celestial_CLSTL", 9, "#efa5a5", null, 0, 0.5+20*(nineSidedShapeScale-sevenSidedShapeScale)/nineSidedShapeScale);
Class.styx_CLSTL.TURRETS = []
styx_.addLayer({turret: {
    POSITION: [l1Size, 7.5, 0, null, 180, 0],
    TYPE: "styx_lowTurret_CLSTL",
}})
styx_.addLayer({turret: {
    POSITION: [l2Size, 8.5, 0, null, 180, 0],
    TYPE: ["styx_topTurret_CLSTL", {GUN_STAT_SCALE: combineStats([{damage: 1.4, health: 1.4, reload: 1.3}]) }],
}})
/// Iapetus
Class.iapetus_lowTurret_CLSTL = {
    PARENT: "autoTurret",
    LABEL: "Volley",
    INDEPENDENT: true,
    BODY: {
        FOV: base.FOV * 1,
    },
    GUNS: [
        {
            POSITION: [12, 4.5, 1, 0, 7.25, 0, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.gunner, g.volley, { speed: 1.2 }, y.celestialGuns, g.noRecoil]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: [12, 4.5, 1, 0, -7.25, 0, 0.75],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.gunner, g.volley, { speed: 1.2 }, y.celestialGuns, g.noRecoil]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: [16, 4.5, 1, 0, 3.75, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.gunner, g.volley, { speed: 1.2 }, y.celestialGuns, g.noRecoil]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: [16, 4.5, 1, 0, -3.75, 0, 0.25],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.gunner, g.volley, { speed: 1.2 }, y.celestialGuns, g.noRecoil]),
                TYPE: "bullet"
            }
        }
    ],
}
Class.iapetus_topTurret_CLSTL = {
    PARENT: "autoTurret",
    LABEL: "Rimfire",
    INDEPENDENT: true,
    BODY: {
        FOV: base.FOV * 1,
    },
    GUNS: [
        {
            POSITION: [12, 3.5, 1, 0, 7.25, 0, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.gunner, { speed: 1.2 }, y.celestialGuns, g.noRecoil]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: [12, 3.5, 1, 0, -7.25, 0, 0.75],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.gunner, { speed: 1.2 }, y.celestialGuns, g.noRecoil]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: [19, 2, 1, 0, -2.5, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.power, g.twin, y.celestialGuns, g.noRecoil]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [19, 2, 1, 0, 2.5, 0, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.power, g.twin, y.celestialGuns, g.noRecoil]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [12, 11, 1, 0, 0, 0, 0],
        },
    ],
}
let iapetus_ = new LayeredBoss('iapetus_CLSTL', "Iapetus", "celestial_CLSTL", 9, "#ed95ae", null, 0, 0.5+20*(nineSidedShapeScale-sevenSidedShapeScale)/nineSidedShapeScale);
Class.iapetus_CLSTL.TURRETS = []
iapetus_.addLayer({turret: {
    POSITION: [l1Size, 7.5, 0, null, 180, 0],
    TYPE: "iapetus_lowTurret_CLSTL",
}})
iapetus_.addLayer({turret: {
    POSITION: [l2Size, 8.5, 0, null, 180, 0],
    TYPE: ["iapetus_topTurret_CLSTL", {GUN_STAT_SCALE: combineStats([{damage: 1.4, health: 1.4, reload: 1.3}]) }],
}})
/// Tyr
Class.tyr_lowTurret_CLSTL = {
    PARENT: "autoTurret",
    LABEL: "Volley",
    INDEPENDENT: true,
    BODY: {
        FOV: base.FOV * 1,
    },
    GUNS: [
        {
            POSITION: [12, 10, 1.4, 8, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, y.celestialGuns, g.noRecoil]),
                TYPE: "bullet"
            }
        }
    ],
}
Class.tyr_topTurret_CLSTL = {
    PARENT: "autoTurret",
    LABEL: "Rimfire",
    INDEPENDENT: true,
    BODY: {
        FOV: base.FOV * 1.225,
    },
    GUNS: [
        {
            POSITION: [16, 19, 1, 0, 0, 0, 0],
        },
        {
            POSITION: [18, 7, 1, 0, 4, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.sniper, {reload: 1.5, damage: 1.2, speed: 1.15, maxSpeed: 1.2}, g.rifle,{damage: 1.35}, g.twin, y.celestialGuns, g.noRecoil]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: [18, 7, 1, 0, -4, 0, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.sniper, {reload: 1.5, damage: 1.2, speed: 1.15, maxSpeed: 1.2}, g.rifle,{damage: 1.35}, g.twin, y.celestialGuns, g.noRecoil]),
                TYPE: "bullet"
            }
        }
    ],
}
let tyr_ = new LayeredBoss('tyr_CLSTL', "Tyr", "celestial_CLSTL", 9, "#d78dca", null, 0, 0.5+20*(nineSidedShapeScale-sevenSidedShapeScale)/nineSidedShapeScale);
Class.tyr_CLSTL.TURRETS = []
tyr_.addLayer({turret: {
    POSITION: [l1Size, 7.5, 0, null, 180, 0],
    TYPE: "tyr_lowTurret_CLSTL",
}})
tyr_.addLayer({turret: {
    POSITION: [l2Size, 8.5, 0, null, 180, 0],
    TYPE: ["tyr_topTurret_CLSTL", {GUN_STAT_SCALE: combineStats([{damage: 1.4, health: 1.4, reload: 1.3}]) }],
}})
/// Dellingr
Class.dellingr_lowTurret_CLSTL = {
    PARENT: "autoTurret",
    LABEL: "Sniper",
    INDEPENDENT: true,
    BODY: {
        FOV: base.FOV * 1,
    },
    GUNS: [
        {
            POSITION: [24, 8.5, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.sniper, {reload: 1.5, damage: 1.2, speed: 1.15, maxSpeed: 1.2}, y.celestialGuns, g.noRecoil]),
                TYPE: "bullet"
            }
        }
    ],
}
Class.dellingr_topTurret_CLSTL = {
    PARENT: "autoTurret",
    LABEL: "Pentashot",
    INDEPENDENT: true,
    BODY: {
        FOV: base.FOV * 1,
    },
    GUNS: [
        {
            POSITION: [16, 8, 1, 0, -3, -30, 2/3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.tripleShot, {damage: 0.85}, y.celestialGuns, g.noRecoil]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: [16, 8, 1, 0, 3, 30, 2/3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.tripleShot, {damage: 0.85}, y.celestialGuns, g.noRecoil]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: [19, 8, 1, 0, -2, -15, 1/3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.tripleShot, {damage: 0.85}, y.celestialGuns, g.noRecoil]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: [19, 8, 1, 0, 2, 15, 1/3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.tripleShot, {damage: 0.85}, y.celestialGuns, g.noRecoil]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: [22, 8, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.tripleShot, {damage: 0.85}, y.celestialGuns, g.noRecoil]),
                TYPE: "bullet"
            }
        }
    ],
}
let dellingr_ = new LayeredBoss('dellingr_CLSTL', "Dellingr", "celestial_CLSTL", 9, "#be82d1", null, 0, 0.5+20*(nineSidedShapeScale-sevenSidedShapeScale)/nineSidedShapeScale);
Class.dellingr_CLSTL.TURRETS = []
dellingr_.addLayer({turret: {
    POSITION: [l1Size, 7.5, 0, null, 180, 0],
    TYPE: "dellingr_lowTurret_CLSTL",
}})
dellingr_.addLayer({turret: {
    POSITION: [l2Size, 8.5, 0, null, 180, 0],
    TYPE: ["dellingr_topTurret_CLSTL", {GUN_STAT_SCALE: combineStats([{damage: 1.4, health: 1.4, reload: 1.3}]) }],
}})

// Nephthys
Class.nephthys_topTurret_CLSTL = {
    PARENT: "autoTurret",
    LABEL: "Assassin",
    INDEPENDENT: true,
    BODY: {
        FOV: base.FOV * 1.4,
    },
    GUNS: [
        {
            POSITION: [27, 8, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.sniper, {reload: 1.5, damage: 1.2, speed: 1.15, maxSpeed: 1.2}, g.assassin, {reload: 1.2, damage: 1.1, speed: 1.125, maxSpeed: 1.15}, y.celestialGuns, g.noRecoil]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [5, 8, -1.4, 8, 0, 0, 0],
        },
    ],
}
let nephthys_ = new LayeredBoss('nephthys_CLSTL', "Nephthys", "celestial_CLSTL", 9, "#679db4", null, 0, 0.5+20*(nineSidedShapeScale-sevenSidedShapeScale)/nineSidedShapeScale);
Class.nephthys_CLSTL.TURRETS = []
nephthys_.addLayer({gun: {
    POSITION: [6, 7, 1.3, 7.5, 0, null, 0],
    PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.drone, y.honcho, y.honcho, y.celestialGuns, g.noRecoil]),
        TYPE: ["dorito", {INDEPENDENT: true}],
        AUTOFIRE: true,
        SYNCS_SKILLS: true,
        STAT_CALCULATOR: "drone",
        WAIT_TO_CYCLE: true,
    },
}}, true, null, 7)
nephthys_.addLayer({turret: {
    POSITION: [l2Size, 8.5, 0, null, 180, 0],
    TYPE: ["nephthys_topTurret_CLSTL", {GUN_STAT_SCALE: combineStats([{damage: 1.4, health: 1.4, reload: 1.3}]) }],
}})
/// Ptah
Class.ptah_lowTurret_CLSTL = {
    PARENT: "autoTurret",
    LABEL: "Ordnance",
    INDEPENDENT: true,
    BODY: {
        FOV: base.FOV * 1.25,
    },
    GUNS: [
        {
            POSITION: [17, 3, 1, 0, -5.75, -6, 0.25],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.artillery, y.celestialGuns, g.noRecoil]),
                TYPE: "bullet",
                LABEL: "Secondary",
            },
        },
        {
            POSITION: [17, 3, 1, 0, 5.75, 6, 0.75],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.artillery, y.celestialGuns, g.noRecoil]),
                TYPE: "bullet",
                LABEL: "Secondary",
            },
        },
        {
            POSITION: [24, 8, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.sniper, {reload: 1.5, damage: 1.2, speed: 1.15, maxSpeed: 1.2}, g.hunter, g.hunterSecondary, y.celestialGuns, g.noRecoil]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [21, 11, 1, 0, 0, 0, 0.25],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.sniper, {reload: 1.5, damage: 1.2, speed: 1.15, maxSpeed: 1.2}, g.hunter, y.celestialGuns, g.noRecoil]),
                TYPE: "bullet",
            },
        },
    ],
}
Class.ptah_topTurret_CLSTL = {
    PARENT: "autoTurret",
    LABEL: "Focal",
    INDEPENDENT: true,
    BODY: {
        FOV: base.FOV * 1,
    },
    GUNS: [
        {
            POSITION: [23, 7, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.lowPower, g.machineGun, { recoil: 1.15 }, g.sprayer, g.sprayer_Focal, y.celestialGuns, g.noRecoil]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [12, 10, 1.4, 8, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.sprayer, g.sprayer_Focal, y.celestialGuns, g.noRecoil]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [10, 10, 0.001, 6, 0, 0, 0],
        },
    ],
}
let ptah_ = new LayeredBoss('ptah_CLSTL', "Ptah", "celestial_CLSTL", 9, "#69a1c9", null, 0, 0.5+20*(nineSidedShapeScale-sevenSidedShapeScale)/nineSidedShapeScale);
Class.ptah_CLSTL.TURRETS = []
ptah_.addLayer({turret: {
    POSITION: [l1Size, 7.5, 0, null, 180, 0],
    TYPE: "ptah_lowTurret_CLSTL",
}}, true, null, 7)
ptah_.addLayer({turret: {
    POSITION: [l2Size, 8.5, 0, null, 180, 0],
    TYPE: ["ptah_topTurret_CLSTL", {GUN_STAT_SCALE: combineStats([{damage: 1.4, health: 1.4, reload: 1.3}]) }],
}})
/// Thor
Class.thor_lowTurret_CLSTL = {
    PARENT: "autoTurret",
    LABEL: "Engineer",
    INDEPENDENT: true,
    BODY: {
        FOV: base.FOV * 1.15,
    },
    GUNS: [
        {
            POSITION: [5, 11, 1, 10.5, 0, 0, 0],
        },
        {
            POSITION: [3, 14, 1, 15.5, 0, 0, 0],
        },
        {
            POSITION: [2, 14, 1.3, 18, 0, 0, 0],
            PROPERTIES: {
                MAX_CHILDREN: 6,
                SHOOT_SETTINGS: combineStats([g.trap, {shudder: 0.6, health: 1.4, speed: 1.3}, g.setTrap, {speed: 0.8, damage: 0.6}, {reload: 1.3, speed: 0.9, damage: 0.85}, y.celestialGuns, g.noRecoil]),
                TYPE: "unsetPillbox",
                SYNCS_SKILLS: true,
                DESTROY_OLDEST_CHILD: true,
                STAT_CALCULATOR: "block"
            },
        },
        {
            POSITION: [4, 14, 1, 8, 0, 0, 0],
        },
    ],
}
Class.thor_topTurret_CLSTL = {
    PARENT: "autoTurret",
    LABEL: "Battery",
    INDEPENDENT: true,
    BODY: {
        FOV: base.FOV * 1,
    },
    GUNS: [
        {
            POSITION: [12, 3.5, 1, 0, 7.25, 0, 4/6],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.gunner, g.battery, { speed: 1.2 }, y.celestialGuns, g.noRecoil]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: [12, 3.5, 1, 0, -7.25, 0, 5/6],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.gunner, g.battery, { speed: 1.2 }, y.celestialGuns, g.noRecoil]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: [15, 3.5, 1, 0, 5.5, 0, 2/6],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.gunner, g.battery, { speed: 1.2 }, y.celestialGuns, g.noRecoil]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: [15, 3.5, 1, 0, -5.5, 0, 3/6],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.gunner, g.battery, { speed: 1.2 }, y.celestialGuns, g.noRecoil]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: [18, 3.5, 1, 0, 2.75, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.gunner, g.battery, { speed: 1.2 }, y.celestialGuns, g.noRecoil]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: [18, 3.5, 1, 0, -2.75, 0, 1/6],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.gunner, g.battery, { speed: 1.2 }, y.celestialGuns, g.noRecoil]),
                TYPE: "bullet"
            }
        }
    ],
}
let thor_ = new LayeredBoss('thor_CLSTL', "Thor", "celestial_CLSTL", 9, "#0782fd", null, 0, 0.5+20*(nineSidedShapeScale-sevenSidedShapeScale)/nineSidedShapeScale);
Class.thor_CLSTL.TURRETS = []
thor_.addLayer({turret: {
    POSITION: [l1Size, 7.5, 0, null, 180, 0],
    TYPE: "thor_lowTurret_CLSTL",
}}, true, null, 7)
thor_.addLayer({turret: {
    POSITION: [l2Size, 8.5, 0, null, 180, 0],
    TYPE: ["thor_topTurret_CLSTL", {GUN_STAT_SCALE: combineStats([{damage: 1.4, health: 1.4, reload: 1.3}]) }],
}})

// Ullr
Class.ullr_lowTurret_CLSTL = {
    PARENT: "autoTurret",
    LABEL: "Productionist",
    INDEPENDENT: true,
    BODY: {
        FOV: base.FOV * 1.1,
    },
    GUNS: [
        {
            POSITION: [4.5, 6, 1, 10.5, 5, 0, 0],
        },
        {
            POSITION: [1, 7, 1, 15, 5, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.productionist, {health: 0.65}, y.celestialGuns, g.noRecoil]),
                TYPE: "tinyMinion",
                STAT_CALCULATOR: "drone",
                AUTOFIRE: true,
                SYNCS_SKILLS: true,
                MAX_CHILDREN: 23,
            },
        },
        {
            POSITION: [11.5, 7, -1.25, 0, 5, 0, 0],
        },

        {
            POSITION: [4.5, 6, 1, 10.5, -5, 0, 0],
        },
        {
            POSITION: [1, 7, 1, 15, -5, 0, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.productionist, {health: 0.65}, y.celestialGuns, g.noRecoil]),
                TYPE: "tinyMinion",
                STAT_CALCULATOR: "drone",
                AUTOFIRE: true,
                SYNCS_SKILLS: true,
                MAX_CHILDREN: 23,
            },
        },
        {
            POSITION: [11.5, 7, -1.25, 0, -5, 0, 0],
        },
    ],
}
Class.ullr_topTurret_CLSTL = {
    PARENT: "autoTurret",
    LABEL: "Dual",
    INDEPENDENT: true,
    BODY: {
        FOV: base.FOV * 1.25,
    },
    GUNS: [
        {
            POSITION: [18, 7, 1, 0, 5.5, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.dual, g.lowPower, y.celestialGuns, g.noRecoil]),
                TYPE: "bullet",
                LABEL: "Small"
            }
        },
        {
            POSITION: [18, 7, 1, 0, -5.5, 0, .5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.dual, g.lowPower, y.celestialGuns, g.noRecoil]),
                TYPE: "bullet",
                LABEL: "Small"
            }
        },
        {
            POSITION: [16, 8.5, 1, 0, 5.5, 0, 0.25],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.dual, y.celestialGuns, g.noRecoil]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: [16, 8.5, 1, 0, -5.5, 0, .75],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.dual, y.celestialGuns, g.noRecoil]),
                TYPE: "bullet"
            }
        }
    ],
}
let ullr_ = new LayeredBoss('ullr_CLSTL', "Ullr", "celestial_CLSTL", 9, "#cb4969", null, 0, 0.5+20*(nineSidedShapeScale-sevenSidedShapeScale)/nineSidedShapeScale);
Class.ullr_CLSTL.TURRETS = []
ullr_.addLayer({turret: {
    POSITION: [l1Size, 7.5, 0, null, 180, 0],
    TYPE: "ullr_lowTurret_CLSTL",
}}, true, null, 7)
ullr_.addLayer({turret: {
    POSITION: [l2Size, 8.5, 0, null, 180, 0],
    TYPE: ["ullr_topTurret_CLSTL", {GUN_STAT_SCALE: combineStats([{damage: 1.4, health: 1.4, reload: 1.3}]) }],
}})
/// Anubis
Class.anubis_lowTurret_CLSTL = {
    PARENT: "autoTurret",
    LABEL: "Basic",
    INDEPENDENT: true,
    BODY: {
        FOV: base.FOV * 1,
    },
    GUNS: [
        {
            POSITION: [18, 8, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, y.celestialGuns, g.noRecoil]),
                TYPE: "bullet",
            },
        },
    ],
}
Class.anubis_topTurret_CLSTL = {
    PARENT: "autoTurret",
    LABEL: "Annihilator",
    INDEPENDENT: true,
    BODY: {
        FOV: base.FOV * 1,
    },
    GUNS: [
        {
            POSITION: [20.5, 19.5, 1, 0, 0, 0, 0.1],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.destroyer, g.annihilator, {reload: 1.4, recoil: 1.05, damage: 1.3}, y.celestialGuns, g.noRecoil]),
                TYPE: "bullet",
            },
        },
    ],
}
let anubis_ = new LayeredBoss('anubis_CLSTL', "Anubis", "celestial_CLSTL", 9, "#d66950", null, 0, 0.5+20*(nineSidedShapeScale-sevenSidedShapeScale)/nineSidedShapeScale);
Class.anubis_CLSTL.TURRETS = []
anubis_.addLayer({turret: {
    POSITION: [l1Size, 7.5, 0, null, 180, 0],
    TYPE: "anubis_lowTurret_CLSTL",
}}, true, null, 7)
anubis_.addLayer({turret: {
    POSITION: [l2Size, 8.5, 0, null, 180, 0],
    TYPE: ["anubis_topTurret_CLSTL", {GUN_STAT_SCALE: combineStats([{damage: 1.4, health: 1.4, reload: 1.3}]) }],
}})
/// Sekhmet
Class.sekhmet_lowTurret_CLSTL = {
    PARENT: "autoTurret",
    LABEL: "Machine Gunner",
    INDEPENDENT: true,
    BODY: {
        FOV: base.FOV * 1,
    },
    GUNS: [
        {
            POSITION: [14, 3, 4, -3, 5, 0, 0.6],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.gunner, g.machineGunner, y.celestialGuns, g.noRecoil]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [14, 3, 4, -3, -5, 0, 0.8],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.gunner, g.machineGunner, y.celestialGuns, g.noRecoil]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [14, 3, 4, 0, 2.5, 0, 0.4],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.gunner, g.machineGunner, y.celestialGuns, g.noRecoil]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [14, 3, 4, 0, -2.5, 0, 0.2],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.gunner, g.machineGunner, y.celestialGuns, g.noRecoil]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [14, 3, 4, 3, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.gunner, g.machineGunner, y.celestialGuns, g.noRecoil]),
                TYPE: "bullet",
            },
        },
    ],
}
Class.sekhmet_topTurret_CLSTL = {
    PARENT: "autoTurret",
    LABEL: "Basic",
    INDEPENDENT: true,
    BODY: {
        FOV: base.FOV * 1,
    },
    GUNS: [
        {
            POSITION: [18, 8, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, y.celestialGuns, g.noRecoil]),
                TYPE: "bullet",
            },
        },
    ],
}
let sekhmet_ = new LayeredBoss('sekhmet_CLSTL', "Sekhmet", "celestial_CLSTL", 9, "#ba363f", null, 0, 0.5+20*(nineSidedShapeScale-sevenSidedShapeScale)/nineSidedShapeScale);
Class.sekhmet_CLSTL.TURRETS = []
sekhmet_.addLayer({turret: {
    POSITION: [l1Size, 7.5, 0, null, 180, 0],
    TYPE: "sekhmet_lowTurret_CLSTL",
}}, true, null, 7)
sekhmet_.addLayer({turret: {
    POSITION: [l2Size, 8.5, 0, null, 180, 0],
    TYPE: ["sekhmet_topTurret_CLSTL", {GUN_STAT_SCALE: combineStats([{damage: 1.4, health: 1.4, reload: 1.3}]) }],
}})

// Osiris
Class.osiris_lowTurret_CLSTL = {
    PARENT: "autoTurret",
    LABEL: "Field Gun",
    INDEPENDENT: true,
    BODY: {
        FOV: base.FOV * 1.1,
    },
    GUNS: [
        {
            POSITION: [15, 3, 1, 0, -6, -7, 0.25],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.artillery, y.celestialGuns, g.noRecoil]),
                TYPE: "bullet",
                LABEL: "Secondary",
            },
        },
        {
            POSITION: [15, 3, 1, 0, 6, 7, 0.75],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.artillery, y.celestialGuns, g.noRecoil]),
                TYPE: "bullet",
                LABEL: "Secondary",
            },
        },
        {
            POSITION: [10, 8, 1, 9, 0, 0, 0],
        },
        {
            POSITION: [17, 12, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pounder, y.genericLauncher, g.artillery, y.celestialGuns, g.noRecoil]),
                TYPE: "minimissile",
                STAT_CALCULATOR: "sustained",
            },
        },
    ],
}
Class.osiris_topTurret_CLSTL = {
    PARENT: "autoTurret",
    LABEL: "Beekeeper",
    INDEPENDENT: true,
    BODY: {
        FOV: base.FOV * 1,
    },
    GUNS: [
        {
            POSITION: [14, 3, 1, 0, -6, -7, 0.25],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.swarm, g.bee, g.artillery, y.celestialGuns, g.noRecoil]),
                TYPE: ["bee", { INDEPENDENT: true }],
                SYNCS_SKILLS: true,
                STAT_CALCULATOR: "drone",
                WAIT_TO_CYCLE: true,
                LABEL: "Secondary",
            },
        },
        {
            POSITION: [14, 3, 1, 0, 6, 7, 0.75],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.swarm, g.bee, g.artillery, y.celestialGuns, g.noRecoil]),
                TYPE: ["bee", { INDEPENDENT: true }],
                SYNCS_SKILLS: true,
                STAT_CALCULATOR: "drone",
                WAIT_TO_CYCLE: true,
                LABEL: "Secondary",
            },
        },
        {
            POSITION: [19, 12, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.artillery, y.celestialGuns, g.noRecoil]),
                TYPE: "bullet",
                LABEL: "Heavy",
            },
        },
    ],
}
let osiris_ = new LayeredBoss('osiris_CLSTL', "Osiris", "celestial_CLSTL", 9, "#a3bf42", null, 0, 0.5+20*(nineSidedShapeScale-sevenSidedShapeScale)/nineSidedShapeScale);
Class.osiris_CLSTL.TURRETS = []
osiris_.addLayer({turret: {
    POSITION: [l1Size, 7.5, 0, null, 180, 0],
    TYPE: "osiris_lowTurret_CLSTL",
}}, true, null, 7)
osiris_.addLayer({turret: {
    POSITION: [l2Size, 8.5, 0, null, 180, 0],
    TYPE: ["osiris_topTurret_CLSTL", {GUN_STAT_SCALE: combineStats([{damage: 1.4, health: 1.4, reload: 1.3}]) }],
}})
/// Horus
Class.horus_lowTurret_CLSTL = {
    PARENT: "autoTurret",
    LABEL: "Basic",
    INDEPENDENT: true,
    BODY: {
        FOV: base.FOV * 1,
    },
    GUNS: [
        {
            POSITION: [18, 8, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, y.celestialGuns, g.noRecoil]),
                TYPE: "bullet",
            },
        },
    ],
}
Class.horus_topTurret_CLSTL = {
    PARENT: "autoTurret",
    LABEL: "Basic",
    INDEPENDENT: true,
    BODY: {
        FOV: base.FOV * 1,
    },
    GUNS: [
        {
            POSITION: [18, 8, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, y.celestialGuns, g.noRecoil]),
                TYPE: "bullet",
            },
        },
    ],
}
let horus_ = new LayeredBoss('horus_CLSTL', "Horus", "celestial_CLSTL", 9, "#8ba867", null, 0, 0.5+20*(nineSidedShapeScale-sevenSidedShapeScale)/nineSidedShapeScale);
Class.horus_CLSTL.TURRETS = []
horus_.addLayer({turret: {
    POSITION: [l1Size, 7.5, 0, null, 180, 0],
    TYPE: "horus_lowTurret_CLSTL",
}}, true, null, 7)
horus_.addLayer({turret: {
    POSITION: [l2Size, 8.5, 0, null, 180, 0],
    TYPE: ["horus_topTurret_CLSTL", {GUN_STAT_SCALE: combineStats([{damage: 1.4, health: 1.4, reload: 1.3}]) }],
}})
/// Loki
Class.loki_lowTurret_CLSTL = {
    PARENT: "autoTurret",
    LABEL: "Sniper Rifle",
    INDEPENDENT: true,
    BODY: {
        FOV: base.FOV * 1.425,
    },
    GUNS: [
        {
            POSITION: [27, 7, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.sniper, {reload: 1.2, damage: 1.2, speed: 1.15, maxSpeed: 1.2}, g.sniper, g.rifle, {damage: 1.35}, y.celestialGuns, g.noRecoil]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: [12, 12, 1, 0, 0, 0, 0]
        },
    ],
}
Class.loki_topTurret_CLSTL = {
    PARENT: "autoTurret",
    LABEL: "Destroyer",
    INDEPENDENT: true,
    BODY: {
        FOV: base.FOV * 1,
    },
    GUNS: [
        {
            POSITION: [21, 14, 1, 0, 0, 0, 0.1],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.destroyer, y.celestialGuns, g.noRecoil]),
                TYPE: "bullet",
            },
        },
    ],
}
let loki_ = new LayeredBoss('loki_CLSTL', "Loki", "celestial_CLSTL", 9, "#8ba867", null, 0, 0.5+20*(nineSidedShapeScale-sevenSidedShapeScale)/nineSidedShapeScale);
Class.loki_CLSTL.TURRETS = []
loki_.addLayer({turret: {
    POSITION: [l1Size, 7.5, 0, null, 180, 0],
    TYPE: "loki_lowTurret_CLSTL",
}}, true, null, 7)
loki_.addLayer({turret: {
    POSITION: [l2Size, 8.5, 0, null, 180, 0],
    TYPE: ["loki_topTurret_CLSTL", {GUN_STAT_SCALE: combineStats([{damage: 1.4, health: 1.4, reload: 1.3}]) }],
}})

/// Isis
Class.isis_lowTurret_CLSTL = {
    PARENT: "autoTurret",
    LABEL: "Launcher",
    INDEPENDENT: true,
    BODY: {
        FOV: base.FOV * 1,
    },
    GUNS: [
        {
            POSITION: [10, 8, 1, 9, 0, 0, 0],
        },
        {
            POSITION: [17, 12, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pounder, y.genericLauncher, y.celestialGuns, g.noRecoil]),
                TYPE: "minimissile_CLSTL",
                STAT_CALCULATOR: "sustained",
            },
        },
    ],
}
Class.isis_topTurret_CLSTL = {
    PARENT: "autoTurret",
    LABEL: "Predator",
    INDEPENDENT: true,
    BODY: {
        FOV: base.FOV * 1.25,
    },
    GUNS: [
        {
            POSITION: [24, 8, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.sniper, {reload: 1.5, damage: 1.2, speed: 1.15, maxSpeed: 1.2}, g.hunter, g.hunterSecondary, g.hunterSecondary, g.predator, y.celestialGuns, g.noRecoil]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: [21, 12, 1, 0, 0, 0, 0.15],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.sniper, {reload: 1.5, damage: 1.2, speed: 1.15, maxSpeed: 1.2}, g.hunter, g.hunterSecondary, g.predator, y.celestialGuns, g.noRecoil]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: [18, 16, 1, 0, 0, 0, 0.3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.sniper, {reload: 1.5, damage: 1.2, speed: 1.15, maxSpeed: 1.2}, g.hunter, g.predator, y.celestialGuns, g.noRecoil]),
                TYPE: "bullet"
            }
        }
    ],
}
let isis_ = new LayeredBoss('isis_CLSTL', "Isis", "celestial_CLSTL", 9, "#c78795", null, 0, 0.5+20*(nineSidedShapeScale-sevenSidedShapeScale)/nineSidedShapeScale);
Class.isis_CLSTL.TURRETS = []
isis_.addLayer({turret: {
    POSITION: [l1Size, 7.5, 0, null, 180, 0],
    TYPE: "isis_lowTurret_CLSTL",
}}, true, null, 7)
isis_.addLayer({turret: {
    POSITION: [l2Size, 8.5, 0, null, 180, 0],
    TYPE: ["isis_topTurret_CLSTL", {GUN_STAT_SCALE: combineStats([{damage: 1.4, health: 1.4, reload: 1.3}]) }],
}})
/// Khonsu
Class.khonsu_lowTurret_CLSTL = {
    PARENT: "autoTurret",
    LABEL: "Atomizer",
    INDEPENDENT: true,
    BODY: {
        FOV: base.FOV * 1.1,
    },
    GUNS: [
        {
            POSITION: [5, 7.5, 1.3, 18.5, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.lowPower, g.machineGun, { recoil: 1.15 }, g.sprayer, g.sprayer_Atomizer, y.celestialGuns, g.noRecoil]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [12, 10, 1.4, 8, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.sprayer, y.celestialGuns, g.noRecoil]),
                TYPE: "bullet",
            },
        },
    ],
}
Class.khonsu_topTurret_CLSTL = {
    PARENT: "autoTurret",
    LABEL: "Mortar",
    INDEPENDENT: true,
    BODY: {
        FOV: base.FOV * 1,
    },
    GUNS: [
        {
            POSITION: [13, 3, 1, 0, -8, -7, 0.6],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.artillery, g.twin, y.celestialGuns, g.noRecoil]),
                TYPE: "bullet",
                LABEL: "Secondary",
            },
        },
        {
            POSITION: [13, 3, 1, 0, 8, 7, 0.8],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.artillery, g.twin, y.celestialGuns, g.noRecoil]),
                TYPE: "bullet",
                LABEL: "Secondary",
            },
        },
        {
            POSITION: [17, 3, 1, 0, -6, -7, 0.2],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.artillery, g.twin, y.celestialGuns, g.noRecoil]),
                TYPE: "bullet",
                LABEL: "Secondary",
            },
        },
        {
            POSITION: [17, 3, 1, 0, 6, 7, 0.4],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.artillery, g.twin, y.celestialGuns, g.noRecoil]),
                TYPE: "bullet",
                LABEL: "Secondary",
            },
        },
        {
            POSITION: [19, 12, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.artillery, y.celestialGuns, g.noRecoil]),
                TYPE: "bullet",
                LABEL: "Heavy",
            },
        },
    ],
}
let khonsu_ = new LayeredBoss('khonsu_CLSTL', "Khonsu", "celestial_CLSTL", 9, "#d36f90", null, 0, 0.5+20*(nineSidedShapeScale-sevenSidedShapeScale)/nineSidedShapeScale);
Class.khonsu_CLSTL.TURRETS = []
khonsu_.addLayer({turret: {
    POSITION: [l1Size, 7.5, 0, null, 180, 0],
    TYPE: "khonsu_lowTurret_CLSTL",
}}, true, null, 7)
khonsu_.addLayer({turret: {
    POSITION: [l2Size, 8.5, 0, null, 180, 0],
    TYPE: ["khonsu_topTurret_CLSTL", {GUN_STAT_SCALE: combineStats([{damage: 1.4, health: 1.4, reload: 1.3}]) }],
}})
/// Helios
Class.helios_lowTurret_CLSTL = {
    PARENT: "autoTurret",
    LABEL: "Phoenix",
    INDEPENDENT: true,
    BODY: {
        FOV: base.FOV * 1,
    },
    GUNS: [
        {
            POSITION: [24, 7, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.lowPower, g.machineGun, { recoil: 1.15 }, g.sprayer, y.celestialGuns, g.noRecoil]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [12, 10, 1.4, 8, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.sprayer, y.celestialGuns, g.noRecoil]),
                TYPE: "bullet",
            },
        }, {
            POSITION: [16, 8, 1, 0, 0, 150, 0.1],
            PROPERTIES: {SHOOT_SETTINGS: combineStats([g.basic, g.flankGuard, g.triAngle, g.thruster]), TYPE: "bullet", LABEL: "thruster"},
        }, {
            POSITION: [16, 8, 1, 0, 0, -150, 0.1],
            PROPERTIES: {SHOOT_SETTINGS: combineStats([g.basic, g.flankGuard, g.triAngle, g.thruster]), TYPE: "bullet", LABEL: "thruster"},
        }, {
            POSITION: [18, 8, 1, 0, 0, 180, 0.6],
            PROPERTIES: {SHOOT_SETTINGS: combineStats([g.basic, g.flankGuard, g.triAngle, g.thruster]), TYPE: "bullet", LABEL: "thruster"},
        }
    ],
}
Class.helios_topTurret_CLSTL = {
    PARENT: "autoTurret",
    LABEL: "Machine Gun",
    INDEPENDENT: true,
    BODY: {
        FOV: base.FOV * 1,
    },
    GUNS: [
        {
            POSITION: [12, 10, 1.4, 8, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, y.celestialGuns]),
                NEGATIVE_RECOIL: true,
                TYPE: "bullet",
            }
        }
    ],
}
let helios_ = new LayeredBoss('helios_CLSTL', "Helios", "celestial_CLSTL", 9, "#d36f90", null, 0, 0.5+20*(nineSidedShapeScale-sevenSidedShapeScale)/nineSidedShapeScale);
Class.helios_CLSTL.TURRETS = []
helios_.addLayer({turret: {
    POSITION: [l1Size, 7.5, 0, null, 180, 0],
    TYPE: "helios_lowTurret_CLSTL",
}}, true, null, 7)
helios_.addLayer({turret: {
    POSITION: [l2Size, 8.5, 0, null, 180, 0],
    TYPE: ["helios_topTurret_CLSTL", {GUN_STAT_SCALE: combineStats([{damage: 1.4, health: 1.4, reload: 1.3}]) }],
}})

// Eternals
/// Kronos
Class.kronos_lowTurret_CLSTL = {
    PARENT: "autoTurret",
    LABEL: "Alphaskimmer",
    INDEPENDENT: true,
    BODY: {
        FOV: base.FOV * 1.1 * 2,
    },
    GUNS: [
        {
            POSITION: [8, 20, -0.25, 11, 0, 0, 0],
        }, {
            POSITION: [15, 18, -0.8, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pounder, y.genericLauncher, y.skimmerG, { reload: 1.6, health: 1.7, damage: 1.4, resist: 1.2 }, y.celestialGuns, y.celestialGuns, g.noRecoil]),
                TYPE: "kronosMissile_CLSTL",
            },
        },
    ],
}
Class.kronos_midTurret_CLSTL = {
    PARENT: "autoTurret",
    LABEL: "Carrier",
    INDEPENDENT: true,
    BODY: {
        FOV: base.FOV * 1.1 * 2,
    },
    GUNS: [
        {
            POSITION: [7, 8, 0.6, 7, 2, 30, 0.667],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.swarm, {speed: 1.15, maxSpeed: 1.1}, g.battleship, g.carrier, y.celestialGuns, y.celestialGuns, g.noRecoil]),
                TYPE: "swarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [7, 8, 0.6, 7, -2, -30, 0.667],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.swarm, {speed: 1.15, maxSpeed: 1.1}, g.battleship, g.carrier, y.celestialGuns, y.celestialGuns, g.noRecoil]),
                TYPE: "swarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [7, 8, 0.6, 7, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.swarm, {speed: 1.15, maxSpeed: 1.1}, g.battleship, g.carrier, y.celestialGuns, y.celestialGuns, g.noRecoil]),
                TYPE: "swarm",
                STAT_CALCULATOR: "swarm",
            },
        },
    ],
}
Class.kronos_topTurret_CLSTL = {
    PARENT: "autoTurret",
    LABEL: "Triplet",
    INDEPENDENT: true,
    BODY: {
        FOV: base.FOV * 1 * 2,
    },
    GUNS: [
        {
            POSITION: [18, 10, 1, 0, 5, 0, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.triplet, {reload: 0.9}, g.noRecoil, y.celestialGuns, y.celestialGuns]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: [18, 10, 1, 0, -5, 0, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.triplet, {reload: 0.9}, g.noRecoil, y.celestialGuns, y.celestialGuns]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: [21, 10, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.triplet, {reload: 0.9}, g.noRecoil, y.celestialGuns, y.celestialGuns]),
                TYPE: "bullet"
            }
        }
    ],
}
let kronos_ = new LayeredBoss('kronos_CLSTL', "Kronos", "eternal_CLSTL", 11, "#e8ebf7", null, 0, 20*(elevenSidedShapeScale-nineSidedShapeScale)/elevenSidedShapeScale);
Class.kronos_CLSTL.TURRETS = []
kronos_.addLayer({turret: {
    POSITION: [l0Size * 1, 7.5, 0, null, 180, 0],
    TYPE: "kronos_lowTurret_CLSTL",
}}, true, null, 7)
kronos_.addLayer({turret: {
    POSITION: [l2Size * 1, 8, 0, null, 180, 0],
    TYPE: ["kronos_midTurret_CLSTL", {GUN_STAT_SCALE: combineStats([{damage: 1.4, health: 1.4, reload: 1.15, speed: 1.1}]) }],
}})
kronos_.addLayer({turret: {
    POSITION: [l2Size, 8.5, 0, null, 180, 0],
    TYPE: ["kronos_topTurret_CLSTL", {GUN_STAT_SCALE: combineStats([{damage: 1.8, health: 1.8, reload: 1.3, speed: 1.2}]) }],
}})
Class.kronos_CLSTL.SIZE = Class.eternal_CLSTL.SIZE * 4/3
/// Odin
Class.odin_midTurret_CLSTL = {
    PARENT: "autoTurret",
    LABEL: "Conception",
    INDEPENDENT: true,
    BODY: {
        FOV: base.FOV * 1.1 * 2,
    },
    GUNS: [
        {
            POSITION: [4, 12, 1.2, 16, 0, 0, 0],
        }, {
            POSITION: [18, 20, -0.7, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pounder, y.genericLauncher, y.skimmerG, { reload: 1.7, health: 1.9, damage: 1.2, resist: 1.2 }, y.celestialGuns, y.celestialGuns, g.noRecoil]),
                TYPE: "conceptionmissile_CLSTL",
            },
        },
    ],
}
Class.odin_topTurret_CLSTL = {
    PARENT: "autoTurret",
    LABEL: "Gunner Cruiser",
    INDEPENDENT: true,
    BODY: {
        FOV: base.FOV * 1 * 2,
    },
    GUNS: [
        {
            POSITION: [4, 7.5, 0.6, 6, 4.5, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.swarm, g.battleship, {maxSpeed: 1.1}, y.celestialGuns, y.celestialGuns, g.noRecoil]),
                TYPE: "swarm",
                STAT_CALCULATOR: "swarm",
            },
        }, {
            POSITION: [4, 7.5, 0.6, 6, -4.5, 0, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.swarm, g.battleship, {maxSpeed: 1.1}, y.celestialGuns, y.celestialGuns, g.noRecoil]),
                TYPE: "swarm",
                STAT_CALCULATOR: "swarm",
            },
        }, {
            POSITION: [16, 3, 1, 0, -3, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.power, g.twin, {health: 1.2, damage: 1.2, speed: 1.2, maxSpeed: 0.9}, y.celestialGuns, y.celestialGuns, g.noRecoil]),
                TYPE: "bullet",
            },
        }, {
            POSITION: [16, 3, 1, 0, 3, 0, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.power, g.twin, {health: 1.2, damage: 1.2, speed: 1.2, maxSpeed: 0.9}, y.celestialGuns, y.celestialGuns, g.noRecoil]),
                TYPE: "bullet",
            },
        },
    ],
}
let odin_ = new LayeredBoss('odin_CLSTL', "Odin", "eternal_CLSTL", 11, "#7ad3db", null, 0, 20*(elevenSidedShapeScale-nineSidedShapeScale)/elevenSidedShapeScale);
Class.odin_CLSTL.TURRETS = []
odin_.addLayer({gun: {
        POSITION: [2.25, 3.5, 0.6, 9, 0, null, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.drone, g.summoner, g.destroyer, {reload: 1.4, health: 2, damage: 2, resist: 1.3, density: 1.8, maxSpeed: 1.2875, size: 17/4.5}, y.celestialSize, y.celestialGuns, y.celestialGuns, g.noRecoil]),
            TYPE: ["realchip", {INDEPENDENT: true}],
            AUTOFIRE: true,
            SYNCS_SKILLS: true,
            STAT_CALCULATOR: "drone",
            WAIT_TO_CYCLE: true,
        },
    }}, true, null, 27)
odin_.addLayer({turret: {
    POSITION: [l1Size, 8.5, 0, null, 180, 0],
    TYPE: ["odin_midTurret_CLSTL", {GUN_STAT_SCALE: combineStats([{damage: 1.4, health: 1.4, reload: 1.15, speed: 1.1}]) }],
}})
odin_.addLayer({turret: {
    POSITION: [l2Size, 8.5, 0, null, 180, 0],
    TYPE: ["odin_topTurret_CLSTL", {GUN_STAT_SCALE: combineStats([{damage: 1.8, health: 1.8, reload: 1.3, speed: 1.2}]) }],
}})
/// Amun
Class.amun_lowTurret_CLSTL = {
    PARENT: "autoTurret",
    LABEL: "Desmos",
    INDEPENDENT: true,
    BODY: {
        FOV: base.FOV * 1.1 * 2,
    },
    GUNS: [
        {
            POSITION: [20, 8, -4/3, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, y.celestialGuns, y.celestialGuns, g.noRecoil]),
                TYPE: ["bullet", {ALPHA: 0.1, INVISIBLE: [0.02, 0]}]
            }
        },
        {
            POSITION: [3.75, 10, 2.125, 1.5, -6.25, 90, 0]
        },
        {
            POSITION: [3.75, 10, 2.125, 1.5, 6.25, -90, 0]
        }
    ],
}
Class.amun_topTurret_CLSTL = {
    PARENT: "autoTurret",
    LABEL: "Fork",
    INDEPENDENT: true,
    BODY: {
        FOV: base.FOV * 1.2 * 2,
    },
    GUNS: [
        {
            POSITION: [5, 8, 1.3, 8, 0, 0, 0]
        },
        {
            POSITION: [5, 8, 1.3, 13, 0, 0, 0]
        },
        {
            POSITION: [5, 8, 1.3, 18, 0, 0, 0]
        },
        {
            POSITION: [5, 8, 1.3, 23, 0, 0, 0]
        },
        {
            POSITION: [29, 8, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.sniper, {reload: 1.5, damage: 1.2, speed: 1.15, maxSpeed: 1.2}, y.marksman, y.fork, y.celestialGuns, y.celestialGuns, g.noRecoil]),
                TYPE: ["forkBullet_CLSTL", {GUN_STAT_SCALE: combineStats([y.marksman, g.lowPower, {speed: 0.6}, y.celestialGuns, g.noRecoil]), ALPHA: 0.1, INVISIBLE: [0.02, 0]}],
            }
        }
    ],
}
let amun_ = new LayeredBoss('amun_CLSTL', "Amun", "eternal_CLSTL", 11, "#726f6f", null, 0, 20*(elevenSidedShapeScale-nineSidedShapeScale)/elevenSidedShapeScale);
Class.amun_CLSTL.TURRETS = []
amun_.addLayer({turret: {
    POSITION: [l0Size, 8.5, 0, null, 180, 0],
    TYPE: "amun_lowTurret_CLSTL",
}})
amun_.addLayer({gun: {
    POSITION: [2.3, 4, 0.8, 9, 0, null, 0],
    PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, { size: 0.8, reload: 1.2 }, y.celestialGuns, y.celestialGuns]),
        TYPE: ['undertowBullet', {ALPHA: 0.05, INVISIBLE: [0.01, 0]}],
        AUTOFIRE: true,
    }
}})
amun_.addLayer({turret: {
    POSITION: [l2Size, 8.5, 0, null, 180, 0],
    TYPE: ["amun_topTurret_CLSTL", {GUN_STAT_SCALE: combineStats([{damage: 1.8, health: 1.8, reload: 1.3, speed: 1.2}]) }],
}})
Class.amun_CLSTL.ALPHA = 0.1
Class.amun_CLSTL.GUNS = weaponArray([
        {
            POSITION: [12, 4, 1, 0, 0, 180, 0],
        }, {
            POSITION: [1.25, 4, 1.6, 12, 0, 180, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, g.pounder, g.hexaTrapper, {reload: 1.3, size: 1.2, health: 1.35, damage: 1.4, speed: 0.9, shudder: 0.1}, {reload: 2, damage: 2, health: 2}, g.noRecoil]),
                TYPE: ["trap", {ALPHA: 0.1, INVISIBLE: [0.02, 0]}],
                STAT_CALCULATOR: "trap",
                AUTOFIRE: true,
            },
        },
    ], 11)
/// Sleipnir
Class.sleipnir_lowTurret_CLSTL = {
    PARENT: "autoTurret",
    LABEL: "Machgun",
    INDEPENDENT: true,
    BODY: {
        FOV: base.FOV * 1 * 2,
    },
    GUNS: [
        {
            POSITION: [23, 8, 1, 0, 0, 0, 0]
        },
        {
            POSITION: [27, 4, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.minigun, {reload: 1.5, damage: 1.2, speed: 1.15, maxSpeed: 1.2}, g.rifle, y.railgun, y.celestialGuns, y.celestialGuns, g.noRecoil]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [24, 4, 1, 0, 0, 0, 0.333],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.minigun, {reload: 1.5, damage: 1.2, speed: 1.15, maxSpeed: 1.2}, g.rifle, y.railgun, y.celestialGuns, y.celestialGuns, g.noRecoil]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [21, 4, 1, 0, 0, 0, 0.667],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.minigun, {reload: 1.5, damage: 1.2, speed: 1.15, maxSpeed: 1.2}, g.rifle, y.railgun, y.celestialGuns, y.celestialGuns, g.noRecoil]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [5, 8, -1.4, 8, 0, 0, 0],
        },
    ],
}
Class.sleipnir_midTurret_CLSTL = {
    PARENT: "autoTurret",
    LABEL: "Thunderclap",
    INDEPENDENT: true,
    BODY: {
        FOV: base.FOV * 1.225 * 2,
    },
    GUNS: [
        {
            POSITION: [23, 13, 1, 0, 0, 0, 0]
        },
        {
            POSITION: [23, 8, 1, 0, 0, 0, 0]
        },
        {
            POSITION: [27, 4, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.sniper, {reload: 1.5, damage: 1.2, speed: 1.15, maxSpeed: 1.2}, g.rifle, y.railgun, y.celestialGuns, y.celestialGuns, g.noRecoil]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [5, 8, -1.4, 8, 0, 0, 0],
        },
    ],
}
Class.sleipnir_topTurret_CLSTL = {
    PARENT: "autoTurret",
    LABEL: "Grazer",
    INDEPENDENT: true,
    BODY: {
        FOV: base.FOV * 1.15 * 2,
    },
    GUNS: [
        {
            POSITION: [7, 7.5, 0.6, 15, -1, 0, 0],
        },
        {
            POSITION: [10, 11, -0.5, 9, 0, 0, 0],
        },
        {
            POSITION: [17, 12, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pounder, y.genericLauncher, y.skimmerG, y.hyperlaunch, y.hyperlaunch, y.celestialGuns, y.celestialGuns, g.noRecoil]),
                TYPE: "etamissile_CLSTL",
                STAT_CALCULATOR: "sustained",
            },
        },
    ],
}
let sleipnir_ = new LayeredBoss('sleipnir_CLSTL', "Sleipnir", "eternal_CLSTL", 11, "#7adbba", null, 0, 20*(elevenSidedShapeScale-nineSidedShapeScale)/elevenSidedShapeScale);
Class.sleipnir_CLSTL.TURRETS = []
sleipnir_.addLayer({turret: {
    POSITION: [l0Size, 7.5, 0, null, 180, 0],
    TYPE: ["sleipnir_lowTurret_CLSTL", {GUN_STAT_SCALE: combineStats([{damage: 1.4, health: 1.4, reload: 1.15, speed: 1.1}]) }],
}})
sleipnir_.addLayer({turret: {
    POSITION: [l1Size, 7.5, 0, null, 160, 0],
    TYPE: ["sleipnir_midTurret_CLSTL", {GUN_STAT_SCALE: combineStats([{damage: 1.4, health: 1.4, reload: 1.15, speed: 1.1}]) }],
}})
sleipnir_.addLayer({turret: {
    POSITION: [l2Size, 8.5, 0, null, 180, 0],
    TYPE: ["sleipnir_topTurret_CLSTL", {GUN_STAT_SCALE: combineStats([{damage: 1.8, health: 1.8, reload: 1.3, speed: 1.2}]) }],
}})
Class.sleipnir_CLSTL.SIZE = Class.eternal_CLSTL.SIZE * 2/3

// Rogues
/// Julius
Class.julius_lowTurret_CLSTL = {
    PARENT: "autoTurret",
    LABEL: "Frigate",
    INDEPENDENT: true,
    BODY: {
        FOV: base.FOV * 1.2,
    },
    GUNS: [
        {
            POSITION: [10.5, 8, 0.7, 7, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.swarm, g.machineGun, y.celestialGuns, {recoil: 0.1}]),
                TYPE: ["eggchip", {COLOR: "veryLightGrey"}],
                MAX_CHILDREN: 6,
            },
        },
        {
            POSITION: [7, 8, 0.8, 7, 0, 0, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.swarm, g.machineGun, y.celestialGuns, {recoil: 0.1}]),
                TYPE: ["eggchip", {COLOR: "veryLightGrey"}],
                MAX_CHILDREN: 6,
            },
        },
    ],
}
Class.julius_topTurret_CLSTL = {
    PARENT: "autoTurret",
    LABEL: "Hurler",
    INDEPENDENT: true,
    BODY: {
        FOV: base.FOV * 1.1,
    },
    GUNS: [
        {
            POSITION: [10, 8, 1, 10, 0, 0, 0],
        },
        {
            POSITION: [18, 14, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pounder, y.genericLauncher, y.hurler, y.celestialGuns, {recoil: 0.1}]),
                TYPE: "minimissile_CLSTL",
                STAT_CALCULATOR: "sustained",
            },
        },
    ],
}
let julius_ = new LayeredBoss('julius_CLSTL', "Julius", "rogueCelestial_CLSTL", 9, "darkGrey", null, 0, 0.5+20*(nineSidedShapeScale-sevenSidedShapeScale)/nineSidedShapeScale);
Class.julius_CLSTL.TURRETS = []
julius_.addLayer({turret: {
    POSITION: [l1Size, 8.5, 0, null, 180, 0],
    TYPE: "julius_lowTurret_CLSTL",
}})
julius_.addLayer({turret: {
    POSITION: [l2Size, 8.5, 0, null, 180, 0],
    TYPE: ["julius_topTurret_CLSTL", {GUN_STAT_SCALE: combineStats([{damage: 1.4, health: 1.4, reload: 1.3}]) }],
}})
/// Genghis
Class.genghis_lowTurret_CLSTL = {
    PARENT: "autoTurret",
    LABEL: "Submarine",
    INDEPENDENT: true,
    BODY: {
        FOV: base.FOV * 1.2,
    },
    GUNS: [
        {
            POSITION: [4.5, 6, 1, 12, 0, 0, 0],
        },
        {
            POSITION: [1, 7, 1, 16.5, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.productionist, y.celestialGuns, {recoil: 0.1}]),
                TYPE: ["tinyMinion", {GUN_STAT_SCALE: [y.celestialGuns]}],
                STAT_CALCULATOR: "drone",
                SYNCS_SKILLS: true,
            },
        },
        {
            POSITION: [13, 7, -1.25, 0, 0, 0, 0],
        },
    ],
}
Class.genghis_topTurret_CLSTL = {
    PARENT: "autoTurret",
    LABEL: "Gunner",
    INDEPENDENT: true,
    BODY: {
        FOV: base.FOV * 1,
    },
    GUNS: [
        {
            POSITION: [16, 4, 1, 0, -3.5, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.twin, g.power, y.celestialGuns, {recoil: 0.1}]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [16, 4, 1, 0, 3.5, 0, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.twin, g.power, y.celestialGuns, {recoil: 0.1}]),
                TYPE: "bullet",
            },
        },
    ],
}
let genghis_ = new LayeredBoss('genghis_CLSTL', "Genghis", "rogueCelestial_CLSTL", 9, "darkGrey", null, 0, 0.5+20*(nineSidedShapeScale-sevenSidedShapeScale)/nineSidedShapeScale);
Class.genghis_CLSTL.TURRETS = []
genghis_.addLayer({turret: {
    POSITION: [l1Size, 8.5, 0, null, 180, 0],
    TYPE: "genghis_lowTurret_CLSTL",
}})
genghis_.addLayer({turret: {
    POSITION: [l2Size, 8.5, 0, null, 180, 0],
    TYPE: ["genghis_topTurret_CLSTL", {GUN_STAT_SCALE: combineStats([{damage: 1.4, health: 1.4, reload: 1.3}]) }],
}})
/// Napoleon
Class.napoleon_lowTurret_CLSTL = {
    PARENT: "autoTurret",
    LABEL: "Melittidae",
    INDEPENDENT: true,
    BODY: {
        FOV: base.FOV * 1.2,
    },
    GUNS: [
        {
            POSITION: [8, 8, 0.6, 6, 0, 30, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.swarm, g.bee, g.pounder, y.celestialGuns, {recoil: 0.1}]),
                TYPE: ["bee", { INDEPENDENT: true }],
                STAT_CALCULATOR: "swarm",
            },
        }, {
            POSITION: [8, 8, 0.6, 6, 0, -30, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.swarm, g.bee, g.pounder, y.celestialGuns, {recoil: 0.1}]),
                TYPE: ["bee", { INDEPENDENT: true }],
                STAT_CALCULATOR: "swarm",
            },
        },
    ],
}
Class.napoleon_topTurret_CLSTL = {
    PARENT: "autoTurret",
    LABEL: "Preception",
    INDEPENDENT: true,
    BODY: {
        FOV: base.FOV * 1,
    },
    GUNS: [
        {
            POSITION: [12, 17, -0.6, 0, 0, 0, 0],
        }, {
            POSITION: [16, 12, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pounder, { reload: 1.2, health: 1.2, damage: 1.2, speed: 0.93, maxSpeed: 0.93, range: 1.5 }, y.celestialGuns, {recoil: 0.1}]),
                TYPE: ["turretedBullet", {COLOR: "veryLightGrey"}],
            },
        },
    ],
}
let napoleon_ = new LayeredBoss('napoleon_CLSTL', "Napoleon", "rogueCelestial_CLSTL", 9, "darkGrey", null, 0, 0.5+20*(nineSidedShapeScale-sevenSidedShapeScale)/nineSidedShapeScale);
Class.napoleon_CLSTL.TURRETS = []
napoleon_.addLayer({turret: {
    POSITION: [l1Size, 8.5, 0, null, 180, 0],
    TYPE: "napoleon_lowTurret_CLSTL",
}})
napoleon_.addLayer({turret: {
    POSITION: [l2Size, 8.5, 0, null, 180, 0],
    TYPE: ["napoleon_topTurret_CLSTL", {GUN_STAT_SCALE: combineStats([{damage: 1.4, health: 1.4, reload: 1.3}]) }],
}})
/// George
Class.george_lowTurret_CLSTL = {
    PARENT: "autoTurret",
    LABEL: "Boat",
    INDEPENDENT: true,
    BODY: {
        FOV: base.FOV * 1.15,
    },
    GUNS: [
        {
            POSITION: [7, 8, 0.6, 8, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.swarm, g.pounder, y.celestialGuns, {recoil: 0.1}]),
                TYPE: makeAuto("autoswarm", "Auto-Swarm", {type: ["droneAutoTurret", {GUN_STAT_SCALE: [y.celestialGuns]}], size: 10}),
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [6, 4, 0.6, 7, 0, 0, 0],
        },
    ],
}
Class.george_topTurret_CLSTL = {
    PARENT: "autoTurret",
    LABEL: "Gatling Gun",
    INDEPENDENT: true,
    BODY: {
        FOV: base.FOV * 1.1,
    },
    GUNS: [
        {
            POSITION: [18, 10, 1.3, 8, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.sniper, y.celestialGuns, {recoil: 0.1}]),
                TYPE: "bullet"
            }
        }
    ],
}
let george_ = new LayeredBoss('george_CLSTL', "George", "rogueCelestial_CLSTL", 9, "darkGrey", null, 0, 0.5+20*(nineSidedShapeScale-sevenSidedShapeScale)/nineSidedShapeScale);
Class.george_CLSTL.TURRETS = []
george_.addLayer({turret: {
    POSITION: [l1Size, 8.5, 0, null, 180, 0],
    TYPE: "george_lowTurret_CLSTL",
}})
george_.addLayer({turret: {
    POSITION: [l2Size, 8.5, 0, null, 180, 0],
    TYPE: ["george_topTurret_CLSTL", {GUN_STAT_SCALE: combineStats([{damage: 1.4, health: 1.4, reload: 1.3}]) }],
}})
/// Winston
Class.winston_lowTurret_CLSTL = {
    PARENT: "autoTurret",
    LABEL: "Cruiser",
    INDEPENDENT: true,
    BODY: {
        FOV: base.FOV * 1.2,
    },
    GUNS: [
        {
            POSITION: [7, 7, 0.6, 6.75, 4, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.swarm, g.pounder, y.celestialGuns, {recoil: 0.1}]),
                TYPE: "autoswarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [7, 7, 0.6, 6.75, -4, 0, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.swarm, g.pounder, y.celestialGuns, {recoil: 0.1}]),
                TYPE: "autoswarm",
                STAT_CALCULATOR: "swarm",
            },
        },
    ],
}
Class.winston_topTurret_CLSTL = {
    PARENT: "autoTurret",
    LABEL: "Coalition",
    INDEPENDENT: true,
    BODY: {
        FOV: base.FOV * 1.1,
    },
    GUNS: [
        {
            POSITION: [7, 7.5, 0.6, 7, +4, +7, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.swarm, g.commander, y.celestialGuns, {recoil: 0.1}]),
                TYPE: "autoswarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [7, 7.5, 0.6, 7, -4, -7, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.swarm, g.commander, y.celestialGuns, {recoil: 0.1}]),
                TYPE: "autoswarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [6, 11, 1.2, 8, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.drone, {damage: 0.75}, g.overseer, y.celestialGuns, {recoil: 0.1}]),
                TYPE: "drone",
                AUTOFIRE: true,
                SYNCS_SKILLS: true,
                MAX_CHILDREN: 2,
                STAT_CALCULATOR: "drone",
            },
        }
    ],
}
let winston_ = new LayeredBoss('winston_CLSTL', "Winston", "rogueCelestial_CLSTL", 9, "darkGrey", null, 0, 0.5+20*(nineSidedShapeScale-sevenSidedShapeScale)/nineSidedShapeScale);
Class.winston_CLSTL.TURRETS = []
winston_.addLayer({turret: {
    POSITION: [l1Size, 8.5, 0, null, 180, 0],
    TYPE: "winston_lowTurret_CLSTL",
}})
winston_.addLayer({turret: {
    POSITION: [l2Size, 8.5, 0, null, 180, 0],
    TYPE: ["winston_topTurret_CLSTL", {GUN_STAT_SCALE: combineStats([{damage: 1.4, health: 1.4, reload: 1.3}]) }],
}})
/// Joseph
Class.joseph_lowTurret_CLSTL = {
    PARENT: "autoTurret",
    LABEL: "Underseer",
    INDEPENDENT: true,
    BODY: {
        FOV: base.FOV * 1.1,
    },
    GUNS: [
        {
            POSITION: [5.25, 10, 1.2, 8, 0, 30, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.drone, g.sunchip, {reload: 0.4, size: 1.2}, g.maleficitor, y.celestialGuns, {recoil: 0.1}]),
                TYPE: "sunchip",
                AUTOFIRE: true,
                SYNCS_SKILLS: true,
                STAT_CALCULATOR: "necro",
                WAIT_TO_CYCLE: true,
                DELAY_SPAWN: false,
                MAX_CHILDREN: 5,
            },
        },
        {
            POSITION: [5.25, 10, 1.2, 8, 0, -30, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.drone, g.sunchip, {reload: 0.4, size: 1.2}, g.maleficitor, y.celestialGuns, {recoil: 0.1}]),
                TYPE: "sunchip",
                AUTOFIRE: true,
                SYNCS_SKILLS: true,
                STAT_CALCULATOR: "necro",
                WAIT_TO_CYCLE: true,
                DELAY_SPAWN: false,
                MAX_CHILDREN: 5,
            },
        },
    ],
}
Class.joseph_topTurret_CLSTL = {
    PARENT: "autoTurret",
    LABEL: "Beartrapper",
    INDEPENDENT: true,
    BODY: {
        FOV: base.FOV * 1.1,
    },
    GUNS: [
        {
            POSITION: [14, 11, 1, 0, 0, 0, 0],
        },
        {
            POSITION: [4, 11, 1.7, 14, 0, 0, 0.1],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap,{shudder: 0.1, speed: 1.025}, { speed: 1.2 }, y.celestialGuns, { recoil: 0.1 }]),
                TYPE: "trap",
                STAT_CALCULATOR: "trap",
            },
        },
    ],
}
let joseph_ = new LayeredBoss('joseph_CLSTL', "Joseph", "rogueCelestial_CLSTL", 9, "darkGrey", null, 0, 0.5+20*(nineSidedShapeScale-sevenSidedShapeScale)/nineSidedShapeScale);
Class.joseph_CLSTL.TURRETS = []
joseph_.addLayer({turret: {
    POSITION: [l1Size, 8.5, 0, null, 180, 0],
    TYPE: "joseph_lowTurret_CLSTL",
}})
joseph_.addLayer({turret: {
    POSITION: [l2Size, 8.5, 0, null, 180, 0],
    TYPE: ["joseph_topTurret_CLSTL", {GUN_STAT_SCALE: combineStats([{damage: 1.4, health: 1.4, reload: 1.3}]) }],
}})
/// Sun
Class.sun_lowTurret_CLSTL = {
    PARENT: "autoTurret",
    LABEL: "Corvette",
    INDEPENDENT: true,
    BODY: {
        FOV: base.FOV * 1.2,
    },
    GUNS: [
        {
            POSITION: [7, 3, 0.6, 7, 4, 0, 0.75],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.swarm, {speed: 1.15, maxSpeed: 1.1}, y.celestialGuns, {recoil: 0.1}]),
                TYPE: "swarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [7, 3, 0.6, 7, -4, 0, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.swarm, {speed: 1.15, maxSpeed: 1.1}, y.celestialGuns, {recoil: 0.1}]),
                TYPE: "swarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [7, 3, 0.6, 8.5, 2, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.swarm, {speed: 1.15, maxSpeed: 1.1}, y.celestialGuns, {recoil: 0.1}]),
                TYPE: "swarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [7, 3, 0.6, 8.5, -2, 0, 0.25],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.swarm, {speed: 1.15, maxSpeed: 1.1}, y.celestialGuns, {recoil: 0.1}]),
                TYPE: "swarm",
                STAT_CALCULATOR: "swarm",
            },
        },
    ],
}
Class.sun_topTurret_CLSTL = {
    PARENT: "autoTurret",
    LABEL: "Pelleter",
    INDEPENDENT: true,
    BODY: {
        FOV: base.FOV * 1.2,
    },
    GUNS: [
        {
            POSITION: [19, 2, 1, 0, -2.5, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.power, g.twin, { speed: 0.7, maxSpeed: 0.7 }, g.flankGuard, y.celestialGuns, { recoil: 0.1 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [19, 2, 1, 0, 2.5, 0, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.power, g.twin, { speed: 0.7, maxSpeed: 0.7 }, g.flankGuard, y.celestialGuns, { recoil: 0.1 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [12, 11, 1, 0, 0, 0, 0],
        },
    ],
}
let sun_ = new LayeredBoss('sun_CLSTL', "Sun", "rogueCelestial_CLSTL", 9, "darkGrey", null, 0, 0.5+20*(nineSidedShapeScale-sevenSidedShapeScale)/nineSidedShapeScale);
Class.sun_CLSTL.TURRETS = []
sun_.addLayer({turret: {
    POSITION: [l1Size, 8.5, 0, null, 180, 0],
    TYPE: "sun_lowTurret_CLSTL",
}})
sun_.addLayer({turret: {
    POSITION: [l2Size, 8.5, 0, null, 180, 0],
    TYPE: ["sun_topTurret_CLSTL", {GUN_STAT_SCALE: combineStats([{damage: 1.4, health: 1.4, reload: 1.3}]) }],
}})
/// Augustus
Class.augustus_lowTurret_CLSTL = {
    PARENT: "autoTurret",
    LABEL: "Corvette",
    INDEPENDENT: true,
    BODY: {
        FOV: base.FOV * 1.2,
    },
    GUNS: [
        {
            POSITION: [6, 10, 0.6, 8, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.swarm, g.bee, g.machineGun, {size: 0.667, reload: 0.8}, y.celestialGuns, {recoil: 0.1}]),
                TYPE: ["bee", {COLOR: "veryLightGrey"}],
            },
        },
    ],
}
Class.augustus_topTurret_CLSTL = {
    PARENT: "autoTurret",
    LABEL: "Projector",
    INDEPENDENT: true,
    BODY: {
        FOV: base.FOV * 1.1,
    },
    GUNS: [
        {
            POSITION: [10, 16, -0.5, 6, 0, 0, 0],
        },
        {
            POSITION: [14, 16, 1, 0, 0, 0, 0],
        },
        {
            POSITION: [10, 8, 1, 9, 0, 0, 0],
        },
        {
            POSITION: [17, 12, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pounder, y.genericLauncher, y.projectorG, y.hyperlaunch, y.celestialGuns, {recoil: 0.1}]),
                TYPE: "projectormissile_CLSTL",
                STAT_CALCULATOR: "sustained",
            },
        },
    ],
}
let augustus_ = new LayeredBoss('augustus_CLSTL', "Augustus", "rogueCelestial_CLSTL", 9, "darkGrey", null, 0, 0.5+20*(nineSidedShapeScale-sevenSidedShapeScale)/nineSidedShapeScale);
Class.augustus_CLSTL.TURRETS = []
augustus_.addLayer({turret: {
    POSITION: [l1Size, 8.5, 0, null, 180, 0],
    TYPE: "augustus_lowTurret_CLSTL",
}})
augustus_.addLayer({turret: {
    POSITION: [l2Size, 8.5, 0, null, 180, 0],
    TYPE: ["augustus_topTurret_CLSTL", {GUN_STAT_SCALE: combineStats([{damage: 1.4, health: 1.4, reload: 1.3}]) }],
}})
/// Alexander
Class.alexander_lowTurret_CLSTL = {
    PARENT: "autoTurret",
    LABEL: "Protozoa",
    INDEPENDENT: true,
    BODY: {
        FOV: base.FOV * 1.1,
    },
    GUNS: [
        {
            POSITION: [18, 7, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, {reload: 2.5}, y.celestialGuns, {recoil: 0.1}]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: [4.5, 10, 1, 10.5, 0, 0, 0],
        },
        {
            POSITION: [1, 12, 1, 15, 0, 0, 0],
            PROPERTIES: {
                MAX_CHILDREN: 2,
                SHOOT_SETTINGS: combineStats([g.spawner, {health: 0.6}, y.celestialGuns, {recoil: 0.1}]),
                TYPE: ["minion", {GUN_STAT_SCALE: [y.celestialGuns]}],
                STAT_CALCULATOR: "drone",
                AUTOFIRE: true,
                SYNCS_SKILLS: true,
            },
        },
        {
            POSITION: [11.5, 12, 1, 0, 0, 0, 0],
        },
    ],
}
Class.alexander_topTurret_CLSTL = {
    PARENT: "autoTurret",
    LABEL: "Slice Shot",
    INDEPENDENT: true,
    BODY: {
        FOV: base.FOV * 1,
    },
    GUNS: [
        {
            POSITION: [20, 8, 1, 0, 5.5, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.flankGuard, {recoil: 19/24}, y.celestialGuns, {recoil: 0.1}]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: [20, 8, 1, 0, -5.5, 0, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.flankGuard, {recoil: 19/24}, y.celestialGuns, {recoil: 0.1}]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: [17, 3, 1, 0, 0, 0, 0.25],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.flankGuard, {recoil: 19/24}, g.lowPower, {recoil: 0.25}, y.celestialGuns, {recoil: 0.1}]),
                TYPE: "bullet",
                LABEL: "Sliced",
            }
        },
    ],
}
let alexander_ = new LayeredBoss('alexander_CLSTL', "Alexander", "rogueCelestial_CLSTL", 9, "darkGrey", null, 0, 0.5+20*(nineSidedShapeScale-sevenSidedShapeScale)/nineSidedShapeScale);
Class.alexander_CLSTL.TURRETS = []
alexander_.addLayer({turret: {
    POSITION: [l1Size, 8.5, 0, null, 180, 0],
    TYPE: "alexander_lowTurret_CLSTL",
}})
alexander_.addLayer({turret: {
    POSITION: [l2Size, 8.5, 0, null, 180, 0],
    TYPE: ["alexander_topTurret_CLSTL", {GUN_STAT_SCALE: combineStats([{damage: 1.4, health: 1.4, reload: 1.3}]) }],
}})
/// Charles
Class.charles_lowTurret_CLSTL = {
    PARENT: "autoTurret",
    LABEL: "Dust Devil",
    INDEPENDENT: true,
    BODY: {
        FOV: base.FOV * 1.1,
    },
    GUNS: [
        {
            POSITION: [15, 3.5, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.gunner, g.flankGuard, y.celestialGuns, {recoil: 0.1}]),
                TYPE: "bullet",
                STAT_CALCULATOR: "thruster",
            },
        },
        {
            POSITION: [4, 6, 0.6, 9, 0, 36, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.swarm, g.bee, g.flankGuard, {size: 0.5}, y.celestialGuns, {recoil: 0.1}]),
                TYPE: ["bee", {INDEPENDENT: true}]
            }
        },
        {
            POSITION: [4, 6, 0.6, 9, 0, -36, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.swarm, g.bee, g.flankGuard, {size: 0.5}, y.celestialGuns, {recoil: 0.1}]),
                TYPE: ["bee", {INDEPENDENT: true}]
            }
        },
    ],
}
Class.charles_topTurret_CLSTL = {
    PARENT: "autoTurret",
    LABEL: "Automation",
    INDEPENDENT: true,
    BODY: {
        FOV: base.FOV * 1,
    },
    GUNS: [],
    TURRETS: [
        {
            POSITION: [8, 9, 0, 45, 190, 0],
            TYPE: ["autoTankGun", {GUN_STAT_SCALE: [g.autoTurret, y.celestialGuns, {recoil: 0.1}], INDEPENDENT: true}],
        },
        {
            POSITION: [8, 9, 0, -45, 190, 0],
            TYPE: ["autoTankGun", {GUN_STAT_SCALE: [g.autoTurret, y.celestialGuns, {recoil: 0.1}], INDEPENDENT: true}],
        },
    ],
}
let charles_ = new LayeredBoss('charles_CLSTL', "Charles", "rogueCelestial_CLSTL", 9, "darkGrey", null, 0, 0.5+20*(nineSidedShapeScale-sevenSidedShapeScale)/nineSidedShapeScale);
Class.charles_CLSTL.TURRETS = []
charles_.addLayer({turret: {
    POSITION: [l1Size, 8.5, 0, null, 180, 0],
    TYPE: "charles_lowTurret_CLSTL",
}})
charles_.addLayer({turret: {
    POSITION: [l2Size, 8.5, 0, null, 180, 0],
    TYPE: ["charles_topTurret_CLSTL", {GUN_STAT_SCALE: combineStats([{damage: 1.4, health: 1.4, reload: 1.3}]) }],
}})
/// Arthur
Class.arthur_lowTurret_CLSTL = {
    PARENT: "autoTurret",
    LABEL: "Spawner",
    INDEPENDENT: true,
    BODY: {
        FOV: base.FOV * 1.1,
    },
    GUNS: [
        {
            POSITION: [4.5, 10, 1, 10.5, 0, 0, 0],
        },
        {
            POSITION: [1, 12, 1, 15, 0, 0, 0],
            PROPERTIES: {
                MAX_CHILDREN: 2,
                SHOOT_SETTINGS: combineStats([g.spawner, {health: 0.6}, y.celestialGuns, {recoil: 0.1, size: 0.8}]),
                TYPE: ["minion", {GUN_STAT_SCALE: [y.celestialGuns]}],
                STAT_CALCULATOR: "drone",
                AUTOFIRE: true,
                SYNCS_SKILLS: true,
            },
        },
        {
            POSITION: [11.5, 12, 1, 0, 0, 0, 0],
        },
    ],
}
Class.arthur_topTurret_CLSTL = {
    PARENT: "autoTurret",
    LABEL: "Triple Shot",
    INDEPENDENT: true,
    BODY: {
        FOV: base.FOV * 1,
    },
    GUNS: [
        {
            POSITION: [19, 8, 1, 0, -2, -17.5, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.tripleShot, y.celestialGuns, {recoil: 0.1}]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: [19, 8, 1, 0, +2, +17.5, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.tripleShot, y.celestialGuns, {recoil: 0.1}]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: [22, 8, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.tripleShot, y.celestialGuns, {recoil: 0.1}]),
                TYPE: "bullet"
            }
        }
    ],
}
let arthur_ = new LayeredBoss('arthur_CLSTL', "Arthur", "rogueCelestial_CLSTL", 9, "darkGrey", null, 0, 0.5+20*(nineSidedShapeScale-sevenSidedShapeScale)/nineSidedShapeScale);
Class.arthur_CLSTL.TURRETS = []
arthur_.addLayer({turret: {
    POSITION: [l1Size, 8.5, 0, null, 180, 0],
    TYPE: "arthur_lowTurret_CLSTL",
}})
arthur_.addLayer({turret: {
    POSITION: [l2Size, 8.5, 0, null, 180, 0],
    TYPE: ["arthur_topTurret_CLSTL", {GUN_STAT_SCALE: combineStats([{damage: 1.4, health: 1.4, reload: 1.3}]) }],
}})
/// Suiko
Class.suiko_lowTurret_CLSTL = {
    PARENT: "autoTurret",
    LABEL: "Medic",
    INDEPENDENT: true,
    BODY: {
        FOV: base.FOV * 1.2,
    },
    TURRETS: [
        {
            POSITION: [13, 0, 0, 0, 360, 1],
            TYPE: "healerSymbol",
        },
    ],
    GUNS: [
        {
            POSITION: [8, 9, -0.5, 16.5, 0, 0, 0],
        },
        {
            POSITION: [22, 10, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.healer, {damage: -1}, g.sniper,{reload: 1.5, damage: 1.2, speed: 1.15, maxSpeed: 1.2}, {size: 0.8}]),
                TYPE: ["healerBullet_CLSTL", {GUN_STAT_SCALE: [g.sniper, {reload: 1.5, damage: 1.2, speed: 1.15, maxSpeed: 1.2}]}],
            },
        },
    ],
    STAT_NAMES: statnames.bulletHeal,
}
Class.suiko_topTurret_CLSTL = {
    PARENT: "autoTurret",
    LABEL: "Hewn Twin",
    INDEPENDENT: true,
    BODY: {
        FOV: base.FOV * 1,
    },
    GUNS: [
        {
            POSITION: [15, 3, 1, 0, -6, -7, 0.25],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.artillery, y.celestialGuns, {recoil: 0.1}]),
                TYPE: "bullet",
                LABEL: "Secondary",
            },
        },
        {
            POSITION: [15, 3, 1, 0, 6, 7, 0.75],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.artillery, y.celestialGuns, {recoil: 0.1}]),
                TYPE: "bullet",
                LABEL: "Secondary",
            },
        },
        {
            POSITION: [10, 12, -0.5, 9, 0, 0, 0],
        },
        {
            POSITION: [17, 13, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.artillery, g.artillery, y.celestialGuns, {recoil: 0.1}]),
                TYPE: ["missile", {GUN_STAT_SCALE: [y.celestialGuns]}],
                STAT_CALCULATOR: "sustained",
            },
        },
    ],
}
let suiko_ = new LayeredBoss('suiko_CLSTL', "Suiko", "rogueCelestial_CLSTL", 9, "darkGrey", null, 0, 0.5+20*(nineSidedShapeScale-sevenSidedShapeScale)/nineSidedShapeScale);
Class.suiko_CLSTL.TURRETS = []
suiko_.addLayer({turret: {
    POSITION: [l1Size, 8.5, 0, null, 180, 0],
    TYPE: "suiko_lowTurret_CLSTL",
}})
suiko_.addLayer({turret: {
    POSITION: [l2Size, 8.5, 0, null, 180, 0],
    TYPE: ["suiko_topTurret_CLSTL", {GUN_STAT_SCALE: combineStats([{damage: 1.4, health: 1.4, reload: 1.3}]) }],
}})
/// Hirohito
Class.hirohito_lowTurret_CLSTL = {
    PARENT: "autoTurret",
    LABEL: "Entropy",
    INDEPENDENT: true,
    BODY: {
        FOV: base.FOV * 1.2,
    },
    GUNS: [
        {
            POSITION: [7, 8, 0.6, 8, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.swarm, g.pounder, y.celestialGuns, {recoil: 0.1}]),
                TYPE: "autoswarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [4, 6, 0.6, 9, 0, 36, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.swarm, g.bee, g.flankGuard, {size: 0.5}, y.celestialGuns, {recoil: 0.1}]),
                TYPE: ["bee", {INDEPENDENT: true}]
            }
        },
        {
            POSITION: [4, 6, 0.6, 9, 0, -36, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.swarm, g.bee, g.flankGuard, {size: 0.5}, y.celestialGuns, {recoil: 0.1}]),
                TYPE: ["bee", {INDEPENDENT: true}]
            }
        },
    ],
}
Class.hirohito_topTurret_CLSTL = {
    PARENT: "autoTurret",
    LABEL: "Artillery",
    INDEPENDENT: true,
    BODY: {
        FOV: base.FOV * 1,
    },
    GUNS: [
        {
            POSITION: [17, 3, 1, 0, -6, -7, 0.2],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.artillery, y.celestialGuns, {recoil: 0.1}]),
                TYPE: "bullet",
                LABEL: "Secondary",
            },
        },
        {
            POSITION: [17, 3, 1, 0, 6, 7, 0.4],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.artillery, y.celestialGuns, {recoil: 0.1}]),
                TYPE: "bullet",
                LABEL: "Secondary",
            },
        },
        {
            POSITION: [19, 12, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.artillery, y.celestialGuns, {recoil: 0.1}]),
                TYPE: "bullet",
                LABEL: "Heavy",
            },
        },
    ],
}
let hirohito_ = new LayeredBoss('hirohito_CLSTL', "Hirohito", "rogueCelestial_CLSTL", 9, "darkGrey", null, 0, 0.5+20*(nineSidedShapeScale-sevenSidedShapeScale)/nineSidedShapeScale);
Class.hirohito_CLSTL.TURRETS = []
hirohito_.addLayer({turret: {
    POSITION: [l1Size, 8.5, 0, null, 180, 0],
    TYPE: "hirohito_lowTurret_CLSTL",
}})
hirohito_.addLayer({turret: {
    POSITION: [l2Size, 8.5, 0, null, 180, 0],
    TYPE: ["hirohito_topTurret_CLSTL", {GUN_STAT_SCALE: combineStats([{damage: 1.4, health: 1.4, reload: 1.3}]) }],
}})
/// Gaius
Class.gaius_lowTurret_CLSTL = {
    PARENT: "autoTurret",
    LABEL: "Trireme",
    INDEPENDENT: true,
    BODY: {
        FOV: base.FOV * 1.2,
    },
    GUNS: [
        {
            POSITION: [7 * 1.25, 10, 0.8, 7, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.swarm, g.pounder, g.destroyer, {maxSpeed: 1.5, size: 1.5}, y.celestialGuns, {recoil: 0.1}]),
                TYPE: ["swarm", {COLOR: "veryLightGrey"}],
                MAX_CHILDREN: 6,
            },
        },
    ],
}
Class.gaius_topTurret_CLSTL = {
    PARENT: "autoTurret",
    LABEL: "Pitcher",
    INDEPENDENT: true,
    BODY: {
        FOV: base.FOV * 1.1,
    },
    GUNS: [
        {
            POSITION: [10, 8, 1, 9, 0, 0, 0],
        },
        {
            POSITION: [17, 12, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pounder, y.genericLauncher, y.pitcherG, y.hyperlaunch, y.celestialGuns, {recoil: 0.1}]),
                TYPE: ["twinmissile_CLSTL", {GUN_STAT_SCALE: [y.celestialGuns]}],
                STAT_CALCULATOR: "sustained",
            },
        },
        {
            POSITION: [12, 4, 1, 0, 3.5, 0, 0],
        },
        {
            POSITION: [12, 4, 1, 0, -3.5, 0, 0],
        },
    ],
}
let gaius_ = new LayeredBoss('gaius_CLSTL', "Gaius", "rogueCelestial_CLSTL", 9, "darkGrey", null, 0, 0.5+20*(nineSidedShapeScale-sevenSidedShapeScale)/nineSidedShapeScale);
Class.gaius_CLSTL.TURRETS = []
gaius_.addLayer({turret: {
    POSITION: [l1Size, 8.5, 0, null, 180, 0],
    TYPE: "gaius_lowTurret_CLSTL",
}})
gaius_.addLayer({turret: {
    POSITION: [l2Size, 8.5, 0, null, 180, 0],
    TYPE: ["gaius_topTurret_CLSTL", {GUN_STAT_SCALE: combineStats([{damage: 1.4, health: 1.4, reload: 1.3}]) }],
}})
/// Tutakhamun
Class.tutakhamun_lowTurret_CLSTL = {
    PARENT: "autoTurret",
    LABEL: "Waarrk",
    INDEPENDENT: true,
    BODY: {
        FOV: base.FOV * 1,
    },
    GUNS: [
        {
            POSITION: [16, 8, 1, 0, 2, 17.5, 0],
        },
        {
            POSITION: [3, 8, 1.5, 16, 2, 17.5, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap,{shudder: 0.1, health: 1.1, speed: 1.025}, g.twin, g.tripleShot, y.celestialGuns, {recoil: 0.1}]),
                TYPE: "trap",
                STAT_CALCULATOR: "trap",
            },
        },
        {
            POSITION: [16, 8, 1, 0, -2, -17.5, 0],
        },
        {
            POSITION: [3, 8, 1.5, 16, -2, -17.5, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap,{shudder: 0.1, health: 1.1, speed: 1.025}, g.twin, g.tripleShot, y.celestialGuns, {recoil: 0.1}]),
                TYPE: "trap",
                STAT_CALCULATOR: "trap",
            },
        },
        {
            POSITION: [18, 8, 1, 0, 0, 0, 0],
        },
        {
            POSITION: [3, 8, 1.5, 18, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap,{shudder: 0.1, health: 1.1, speed: 1.025}, g.twin, g.tripleShot, y.celestialGuns, {recoil: 0.1}]),
                TYPE: "trap",
                STAT_CALCULATOR: "trap",
            },
        },
    ],
}
Class.tutakhamun_topTurret_CLSTL = {
    PARENT: "autoTurret",
    LABEL: "Trapper",
    INDEPENDENT: true,
    BODY: {
        FOV: base.FOV * 1.1,
    },
    GUNS: [
        {
            POSITION: [15, 8, 1, 0, 0, 0, 0],
        },
        {
            POSITION: [3, 8, 1.7, 15, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap,{shudder: 0.1, health: 1.1, speed: 1.025}, y.celestialGuns, {recoil: 0.1}]),
                TYPE: "trap",
                STAT_CALCULATOR: "trap"
            }
        }
    ],
}
let tutakhamun_ = new LayeredBoss('tutakhamun_CLSTL', "Tutakhamun", "rogueCelestial_CLSTL", 9, "darkGrey", null, 0, 0.5+20*(nineSidedShapeScale-sevenSidedShapeScale)/nineSidedShapeScale);
Class.tutakhamun_CLSTL.TURRETS = []
tutakhamun_.addLayer({turret: {
    POSITION: [l1Size, 8.5, 0, null, 180, 0],
    TYPE: "tutakhamun_lowTurret_CLSTL",
}})
tutakhamun_.addLayer({turret: {
    POSITION: [l2Size, 8.5, 0, null, 180, 0],
    TYPE: ["tutakhamun_topTurret_CLSTL", {GUN_STAT_SCALE: combineStats([{damage: 1.4, health: 1.4, reload: 1.3}]) }],
}})
/// Cleopatra
Class.cleopatra_lowTurret_CLSTL = {
    PARENT: "autoTurret",
    LABEL: "Scientist",
    INDEPENDENT: true,
    BODY: {
        FOV: base.FOV * 1,
    },
    TURRETS: [
        {
            POSITION: [13, 0, 0, 0, 360, 1],
            TYPE: "healerSymbol"
        }
    ],
    GUNS: [
        {
            POSITION: [15, 8, 1, 0, 0, 0, 0],
        },
        {
            POSITION: [3, 8, 1.7, 15, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap,{shudder: 0.1, health: 1.1, speed: 1.025}, g.healer, {damage: -1}, y.celestialGuns, {recoil: 0.1}]),
                TYPE: "healerTrap_CLSTL",
                STAT_CALCULATOR: "trap"
            }
        },
        {
            POSITION: [13, 10, 1, 0, 0, 0, 0],
        },
    ]
}
Class.cleopatra_topTurret_CLSTL = {
    PARENT: "autoTurret",
    LABEL: "Barricade",
    INDEPENDENT: true,
    BODY: {
        FOV: base.FOV * 1.1,
    },
    GUNS: [
        {
            POSITION: [24, 8, 1, 0, 0, 0, 0],
        },
        {
            POSITION: [4, 8, 1.3, 22, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap,{shudder: 0.1, health: 1.1, speed: 1.025}, g.minigun,{damage: 0.8, reload: 0.8, speed: 1.25, density: 0.25}, { range: 0.5 }, y.celestialGuns, {recoil: 0.1}]),
                TYPE: "trap",
                STAT_CALCULATOR: "trap",
            },
        },
        {
            POSITION: [4, 8, 1.3, 18, 0, 0, 1/3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap,{shudder: 0.1, health: 1.1, speed: 1.025}, g.minigun,{damage: 0.8, reload: 0.8, speed: 1.25, density: 0.25}, { range: 0.5 }, y.celestialGuns, {recoil: 0.1}]),
                TYPE: "trap",
                STAT_CALCULATOR: "trap",
            },
        },
        {
            POSITION: [4, 8, 1.3, 14, 0, 0, 2/3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap,{shudder: 0.1, health: 1.1, speed: 1.025}, g.minigun,{damage: 0.8, reload: 0.8, speed: 1.25, density: 0.25}, { range: 0.5 }, y.celestialGuns, {recoil: 0.1}]),
                TYPE: "trap",
                STAT_CALCULATOR: "trap",
            },
        },
    ],
}
let cleopatra_ = new LayeredBoss('cleopatra_CLSTL', "Cleopatra", "rogueCelestial_CLSTL", 9, "darkGrey", null, 0, 0.5+20*(nineSidedShapeScale-sevenSidedShapeScale)/nineSidedShapeScale);
Class.cleopatra_CLSTL.TURRETS = []
cleopatra_.addLayer({turret: {
    POSITION: [l1Size, 8.5, 0, null, 180, 0],
    TYPE: "cleopatra_lowTurret_CLSTL",
}})
cleopatra_.addLayer({turret: {
    POSITION: [l2Size, 8.5, 0, null, 180, 0],
    TYPE: ["cleopatra_topTurret_CLSTL", {GUN_STAT_SCALE: combineStats([{damage: 1.4, health: 1.4, reload: 1.3}]) }],
}})
/// Elizabeth
Class.elizabeth_lowTurret_CLSTL = {
    PARENT: "autoTurret",
    LABEL: "Colletidae",
    INDEPENDENT: true,
    BODY: {
        FOV: base.FOV * 1,
    },
    GUNS: [
        {
            POSITION: [8, 7, 0.6, 6, 0, 45, 0.667],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.swarm, g.bee, g.machineGun, {reload: 0.8, damage: 0.75}, y.celestialGuns, {recoil: 0.1}]),
                TYPE: ["bee", { INDEPENDENT: true }],
                STAT_CALCULATOR: "swarm",
            },
        }, {
            POSITION: [8, 7, 0.6, 6, 0, -45, 0.333],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.swarm, g.bee, g.machineGun, {reload: 0.8, damage: 0.75}, y.celestialGuns, {recoil: 0.1}]),
                TYPE: ["bee", { INDEPENDENT: true }],
                STAT_CALCULATOR: "swarm",
            },
        }, {
            POSITION: [8, 7, 0.6, 6, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.swarm, g.bee, g.machineGun, {reload: 0.8, damage: 0.75}, y.celestialGuns, {recoil: 0.1}]),
                TYPE: ["bee", { INDEPENDENT: true }],
                STAT_CALCULATOR: "swarm",
            },
        },
    ],
}
Class.elizabeth_topTurret_CLSTL = {
    PARENT: "autoTurret",
    LABEL: "Disinfector",
    INDEPENDENT: true,
    BODY: {
        FOV: base.FOV * 1.1,
    },
    TURRETS: [
        {
            POSITION: [13, 0, 0, 0, 360, 1],
            TYPE: "healerSymbol"
        }
    ],
    GUNS: [
        {
            POSITION: [8, 7, -0.5, 18.5, 0, 0, 0],
        },
        {
            POSITION: [24, 8, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.sprayer, g.spray, g.healer, {damage: -1}, {size: 0.8, speed: 1.5, maxSpeed: 0.5}, y.celestialGuns, {recoil: 0.1}]),
                TYPE: ["healerBullet_CLSTL", {GUN_STAT_SCALE: [g.machineGun, g.sprayer, g.spray]}]
            }
        },
        {
            POSITION: [8, 11, -0.5, 14.5, 0, 0, 0],
        },
        {
            POSITION: [12, 10, 1.4, 8, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.sprayer, g.healer, {damage: -1}, {size: 0.8, speed: 1.5, maxSpeed: 0.5}, y.celestialGuns, {recoil: 0.1}]),
                TYPE: ["healerBullet_CLSTL", {GUN_STAT_SCALE: [g.machineGun, g.sprayer]}]
            }
        },
    ]
}
let elizabeth_ = new LayeredBoss('elizabeth_CLSTL', "Elizabeth", "rogueCelestial_CLSTL", 9, "darkGrey", null, 0, 0.5+20*(nineSidedShapeScale-sevenSidedShapeScale)/nineSidedShapeScale);
Class.elizabeth_CLSTL.TURRETS = []
elizabeth_.addLayer({turret: {
    POSITION: [l1Size, 8.5, 0, null, 180, 0],
    TYPE: "elizabeth_lowTurret_CLSTL",
}})
elizabeth_.addLayer({turret: {
    POSITION: [l2Size, 8.5, 0, null, 180, 0],
    TYPE: ["elizabeth_topTurret_CLSTL", {GUN_STAT_SCALE: combineStats([{damage: 1.4, health: 1.4, reload: 1.3}]) }],
}})
/// Margaret
Class.margaret_lowTurret_CLSTL = {
    PARENT: "autoTurret",
    LABEL: "Analyzer",
    INDEPENDENT: true,
    BODY: {
        FOV: base.FOV * 1,
    },
    TURRETS: [
        {
            POSITION: [13, 0, 0, 0, 360, 1],
            TYPE: "healerSymbol"
        }
    ],
    GUNS: [
        {
            POSITION: [8, 11, -0.5, 13.5, 0, 0, 0],
        },
        {
            POSITION: [19, 12, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.healer, {damage: -1}, {maxSpeed: 1.2}, y.celestialGuns, {recoil: 0.1}]),
                TYPE: ["healerBullet_CLSTL", {GUN_STAT_SCALE: [g.pounder]}]
            }
        }
    ]
}
Class.margaret_topTurret_CLSTL = {
    PARENT: "autoTurret",
    LABEL: "Pen",
    INDEPENDENT: true,
    BODY: {
        FOV: base.FOV * 1,
    },
    GUNS: [
        {
            POSITION: [21, 7, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, {reload: 2}, y.celestialGuns, {recoil: 0.1}]),
                TYPE: "bullet",
            }
        },
        {
            POSITION: [15, 8, 1, 0, 0, 0, 0],
        },
        {
            POSITION: [3, 8, 1.7, 15, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap,{shudder: 0.1, health: 1.1, speed: 1.025}, {reload: 2}, y.celestialGuns, {recoil: 0.1}]),
                TYPE: "trap",
                STAT_CALCULATOR: "trap"
            }
        }
    ]
}
let margaret_ = new LayeredBoss('margaret_CLSTL', "Margaret", "rogueCelestial_CLSTL", 9, "darkGrey", null, 0, 0.5+20*(nineSidedShapeScale-sevenSidedShapeScale)/nineSidedShapeScale);
Class.margaret_CLSTL.TURRETS = []
margaret_.addLayer({turret: {
    POSITION: [l1Size, 8.5, 0, null, 180, 0],
    TYPE: "margaret_lowTurret_CLSTL",
}})
margaret_.addLayer({turret: {
    POSITION: [l2Size, 8.5, 0, null, 180, 0],
    TYPE: ["margaret_topTurret_CLSTL", {GUN_STAT_SCALE: combineStats([{damage: 1.4, health: 1.4, reload: 1.3}]) }],
}})
/// Theodore
Class.theodore_lowTurret_CLSTL = {
    PARENT: "autoTurret",
    LABEL: "Director",
    INDEPENDENT: true,
    BODY: {
        FOV: base.FOV * 1,
    },
    GUNS: [
        {
            POSITION: [6, 11, 1.3, 8, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.drone, {damage: 0.75}, y.celestialGuns, {recoil: 0.1}]),
                TYPE: "drone",
                AUTOFIRE: true,
                SYNCS_SKILLS: true,
                STAT_CALCULATOR: "drone",
                MAX_CHILDREN: 3,
                WAIT_TO_CYCLE: true
            }
        }
    ]
}
Class.theodore_topTurret_CLSTL = {
    PARENT: "autoTurret",
    LABEL: "Howitzer",
    INDEPENDENT: true,
    BODY: {
        FOV: base.FOV * 1,
    },
    GUNS: [
        {
            POSITION: [17, 3, 1, 0, -4.25, -7, 0.25],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.artillery, y.celestialGuns, {recoil: 0.1}]),
                TYPE: "bullet",
                LABEL: "Secondary",
            },
        },
        {
            POSITION: [17, 3, 1, 0, 4.25, 7, 0.75],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.artillery, y.celestialGuns, {recoil: 0.1}]),
                TYPE: "bullet",
                LABEL: "Secondary",
            },
        },
        {
            POSITION: [24, 8.5, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.sniper,{reload: 1.5, damage: 1.2, speed: 1.15, maxSpeed: 1.2}, g.artillery, y.celestialGuns, {recoil: 0.1}]),
                TYPE: "bullet"
            }
        },
    ]
}
let theodore_ = new LayeredBoss('theodore_CLSTL', "Theodore", "rogueCelestial_CLSTL", 9, "darkGrey", null, 0, 0.5+20*(nineSidedShapeScale-sevenSidedShapeScale)/nineSidedShapeScale);
Class.theodore_CLSTL.TURRETS = []
theodore_.addLayer({turret: {
    POSITION: [l1Size, 8.5, 0, null, 180, 0],
    TYPE: "theodore_lowTurret_CLSTL",
}})
theodore_.addLayer({turret: {
    POSITION: [l2Size, 8.5, 0, null, 180, 0],
    TYPE: ["theodore_topTurret_CLSTL", {GUN_STAT_SCALE: combineStats([{damage: 1.4, health: 1.4, reload: 1.3}]) }],
}})
/// Hammurabi
Class.hammurabi_lowTurret_CLSTL = {
    PARENT: "autoTurret",
    LABEL: "Tackgun",
    INDEPENDENT: true,
    BODY: {
        FOV: base.FOV * 1,
    },
    GUNS: [
        {
            POSITION: [19, 2.5, 1, 0, -2.5, 0, 0.25],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.power, g.twin, g.nailgun, { speed: 0.7, maxSpeed: 0.7 }, y.celestialGuns, {recoil: 0.1}]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [19, 2.5, 1, 0, 2.5, 0, 0.75],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.power, g.twin, g.nailgun, { speed: 0.7, maxSpeed: 0.7 }, y.celestialGuns, {recoil: 0.1}]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [5.5, 7.5, -1.8, 6.5, 0, 0, 0],
        },
    ]
}
Class.hammurabi_topTurret_CLSTL = {
    PARENT: "autoTurret",
    LABEL: "Basic",
    INDEPENDENT: true,
    BODY: {
        FOV: base.FOV * 1,
    },
    GUNS: [
        {
            POSITION: [18, 8, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.artillery, y.celestialGuns, {recoil: 0.1}]),
                TYPE: "bullet"
            }
        },
    ]
}
let hammurabi_ = new LayeredBoss('hammurabi_CLSTL', "Hammurabi", "rogueCelestial_CLSTL", 9, "darkGrey", null, 0, 0.5+20*(nineSidedShapeScale-sevenSidedShapeScale)/nineSidedShapeScale);
Class.hammurabi_CLSTL.TURRETS = []
hammurabi_.addLayer({turret: {
    POSITION: [l1Size, 8.5, 0, null, 180, 0],
    TYPE: "hammurabi_lowTurret_CLSTL",
}})
hammurabi_.addLayer({turret: {
    POSITION: [l2Size, 8.5, 0, null, 180, 0],
    TYPE: ["hammurabi_topTurret_CLSTL", {GUN_STAT_SCALE: combineStats([{damage: 1.4, health: 1.4, reload: 1.3}]) }],
}})
/// Cyrus
Class.cyrus_lowTurret_CLSTL = {
    PARENT: "autoTurret",
    LABEL: "Fungus",
    INDEPENDENT: true,
    BODY: {
        FOV: base.FOV * 1,
    },
    GUNS: [
        {
            POSITION: [18.25, 7, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, {reload: 2}]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: [5.25, 10, 1.2, 8, 0, 0, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.drone, g.sunchip, {reload: 0.4, size: 1.2}, g.maleficitor, y.celestialGuns, {recoil: 0.1}]),
                TYPE: "sunchip",
                AUTOFIRE: true,
                SYNCS_SKILLS: true,
                STAT_CALCULATOR: "necro",
                WAIT_TO_CYCLE: true,
                DELAY_SPAWN: false,
                MAX_CHILDREN: 5,
            },
        },
    ]
}
Class.cyrus_topTurret_CLSTL = {
    PARENT: "autoTurret",
    LABEL: "Triplet",
    INDEPENDENT: true,
    BODY: {
        FOV: base.FOV * 1.1,
    },
    GUNS: [
        {
            POSITION: [18, 9, 1, 0, 5, 0, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.triplet, {reload: 0.9, damage: 1.1, health: 1.1}, y.celestialGuns, {recoil: 0.1}]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: [18, 9, 1, 0, -5, 0, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.triplet, {reload: 0.9, damage: 1.1, health: 1.1}, y.celestialGuns, {recoil: 0.1}]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: [21, 9, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.triplet, {reload: 0.9, damage: 1.1, health: 1.1}, y.celestialGuns, {recoil: 0.1}]),
                TYPE: "bullet"
            }
        }
    ]
}
let cyrus_ = new LayeredBoss('cyrus_CLSTL', "Cyrus", "rogueCelestial_CLSTL", 9, "darkGrey", null, 0, 0.5+20*(nineSidedShapeScale-sevenSidedShapeScale)/nineSidedShapeScale);
Class.cyrus_CLSTL.TURRETS = []
cyrus_.addLayer({turret: {
    POSITION: [l1Size, 8.5, 0, null, 180, 0],
    TYPE: "cyrus_lowTurret_CLSTL",
}})
cyrus_.addLayer({turret: {
    POSITION: [l2Size, 8.5, 0, null, 180, 0],
    TYPE: ["cyrus_topTurret_CLSTL", {GUN_STAT_SCALE: combineStats([{damage: 1.4, health: 1.4, reload: 1.3}]) }],
}})
/// Abraham
Class.abraham_lowTurret_CLSTL = {
    PARENT: "autoTurret",
    LABEL: "Assassin",
    INDEPENDENT: true,
    BODY: {
        FOV: base.FOV * 1.4,
    },
    GUNS: [
        {
            POSITION: [27, 8, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.sniper,{reload: 1.5, damage: 1.2, speed: 1.15, maxSpeed: 1.2}, g.assassin, y.celestialGuns, {recoil: 0.1}]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: [5, 8, -1.4, 8, 0, 0, 0]
        }
    ]
}
Class.abraham_topTurret_CLSTL = {
    PARENT: "autoTurret",
    LABEL: "Subvulcan",
    INDEPENDENT: true,
    BODY: {
        FOV: base.FOV * 0.85,
    },
    GUNS: [
        {
            POSITION: [23, 2, 1, 0, -3, 0, 0.833],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, {recoil: 0.0001}, g.pelleter, g.power, g.twin, g.nailgun, {damage: 0.1, health: 5, speed: 1.1, maxspeed: 1.5}, y.celestialGuns]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [23, 2, 1, 0, 3, 0, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, {recoil: 0.0001}, g.pelleter, g.power, g.twin, g.nailgun, {damage: 0.1, health: 5, speed: 1.1, maxspeed: 1.5}, y.celestialGuns]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [23, 2, 1, 0, 0, 0, 0.667],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, {recoil: 0.0001}, g.pelleter, g.power, g.twin, g.nailgun, {damage: 0.1, health: 5, speed: 1.1, maxspeed: 1.5}, y.celestialGuns]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [23, 2, 1, 0, -3, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, {recoil: 0.0001}, g.pelleter, g.power, g.twin, g.nailgun, {damage: 0.1, health: 5, speed: 1.1, maxspeed: 1.5}, y.celestialGuns]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [23, 2, 1, 0, 3, 0, 0.333],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, {recoil: 0.0001}, g.pelleter, g.power, g.twin, g.nailgun, {damage: 0.1, health: 5, speed: 1.1, maxspeed: 1.5}, y.celestialGuns]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [23, 2, 1, 0, 0, 0, 0.166],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, {recoil: 0.0001}, g.pelleter, g.power, g.twin, g.nailgun, {damage: 0.1, health: 5, speed: 1.1, maxspeed: 1.5}, y.celestialGuns]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [10, 12, 1, 3, 0, 0, 0],
        },
        {
            POSITION: [3, 12, 1, 19, 0, 0, 0],
        },
    ]
}
let abraham_ = new LayeredBoss('abraham_CLSTL', "Abraham", "rogueCelestial_CLSTL", 9, "darkGrey", null, 0, 0.5+20*(nineSidedShapeScale-sevenSidedShapeScale)/nineSidedShapeScale);
Class.abraham_CLSTL.TURRETS = []
abraham_.addLayer({turret: {
    POSITION: [l1Size, 8.5, 0, null, 180, 0],
    TYPE: "abraham_lowTurret_CLSTL",
}})
abraham_.addLayer({turret: {
    POSITION: [l2Size, 8.5, 0, null, 180, 0],
    TYPE: ["abraham_topTurret_CLSTL", {GUN_STAT_SCALE: combineStats([{damage: 1.4, health: 1.4, reload: 1.3}]) }],
}})
/// Batu
Class.batu_lowTurret_CLSTL = {
    PARENT: "autoTurret",
    LABEL: "Foundation",
    INDEPENDENT: true,
    BODY: {
        FOV: base.FOV * 1.2,
    },
    GUNS: [
        {
            POSITION: [4.5, 14, 1, 10, 0, 0, 0],
        },
        {
            POSITION: [1, 16, 1, 14.5, 0, 0, 0.5],
            PROPERTIES: {
                MAX_CHILDREN: 1,
                SHOOT_SETTINGS: combineStats([g.spawner, {health: 0.6}, g.honcho, {size: 3/4}, y.celestialGuns, {recoil: 0.1}]),
                TYPE: ["megaMinion_CLSTL", {GUN_STAT_SCALE: [y.celestialGuns]}],
                STAT_CALCULATOR: "drone",
                AUTOFIRE: true,
                SYNCS_SKILLS: true,
            },
        },
        {
            POSITION: [11.5, 16, 1, 0, 0, 0, 0],
        },
    ],
}
Class.batu_topTurret_CLSTL = {
    PARENT: "autoTurret",
    LABEL: "Pounder",
    INDEPENDENT: true,
    BODY: {
        FOV: base.FOV * 1,
    },
    GUNS: [
        {
            POSITION: [22, 14, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.flankGuard, y.celestialGuns, {recoil: 0.1}]),
                TYPE: "bullet",
            },
        },
    ],
}
let batu_ = new LayeredBoss('batu_CLSTL', "Batu", "rogueCelestial_CLSTL", 9, "darkGrey", null, 0, 0.5+20*(nineSidedShapeScale-sevenSidedShapeScale)/nineSidedShapeScale);
Class.batu_CLSTL.TURRETS = []
batu_.addLayer({turret: {
    POSITION: [l1Size, 8.5, 0, null, 180, 0],
    TYPE: "batu_lowTurret_CLSTL",
}})
batu_.addLayer({turret: {
    POSITION: [l2Size, 8.5, 0, null, 180, 0],
    TYPE: ["batu_topTurret_CLSTL", {GUN_STAT_SCALE: combineStats([{damage: 1.4, health: 1.4, reload: 1.3}]) }],
}})
/// Meiji
Class.meiji_lowTurret_CLSTL = {
    PARENT: "autoTurret",
    LABEL: "Shotgun",
    INDEPENDENT: true,
    BODY: {
        FOV: base.FOV * 1.2,
    },
    GUNS: [
        {
            POSITION: [4, 3, 1, 11, -3, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.shotgun, y.celestialGuns]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [4, 3, 1, 11, 3, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.shotgun, y.celestialGuns]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [4, 4, 1, 13, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.shotgun, y.celestialGuns]),
                TYPE: "casing",
            },
        },
        {
            POSITION: [1, 4, 1, 12, -1, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.shotgun, y.celestialGuns]),
                TYPE: "casing",
            },
        },
        {
            POSITION: [1, 4, 1, 11, 1, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.shotgun, y.celestialGuns]),
                TYPE: "casing",
            },
        },
        {
            POSITION: [1, 3, 1, 13, -1, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.shotgun, y.celestialGuns]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [1, 3, 1, 13, 1, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.shotgun, y.celestialGuns]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [1, 2, 1, 13, 2, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.shotgun, y.celestialGuns]),
                TYPE: "casing",
            },
        },
        {
            POSITION: [1, 2, 1, 13, -2, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.shotgun, y.celestialGuns]),
                TYPE: "casing",
            },
        },
        {
            POSITION: [15, 14, 1, 6, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.shotgun, y.celestialGuns, g.fake]),
                TYPE: "casing",
            },
        },
        {
            POSITION: [8, 14, -1.3, 4, 0, 0, 0],
        },
    ],
}
Class.meiji_topTurret_CLSTL = {
    PARENT: "autoTurret",
    LABEL: "Dreadnought",
    INDEPENDENT: true,
    BODY: {
        FOV: base.FOV * 1.4,
    },
    GUNS: [
        {
            POSITION: [12.25, 7.5 * 0.6, 1, 0, 0, 0, 0],
        },
        {
            POSITION: [2, 7.5, 0.6, 12, 0, 0, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.swarm, {damage: 2}, y.celestialGuns, {recoil: 0.1}]),
                TYPE: "swarm",
                STAT_CALCULATOR: "swarm",
            },
        },
    ],
}
let meiji_ = new LayeredBoss('meiji_CLSTL', "Meiji", "rogueCelestial_CLSTL", 9, "darkGrey", null, 0, 0.5+20*(nineSidedShapeScale-sevenSidedShapeScale)/nineSidedShapeScale);
Class.meiji_CLSTL.TURRETS = []
meiji_.addLayer({turret: {
    POSITION: [l1Size, 8.5, 0, null, 180, 0],
    TYPE: "meiji_lowTurret_CLSTL",
}})
meiji_.addLayer({turret: {
    POSITION: [l2Size, 8.5, 0, null, 180, 0],
    TYPE: ["meiji_topTurret_CLSTL", {GUN_STAT_SCALE: combineStats([{damage: 1.4, health: 1.4, reload: 1.3}]) }],
}})
/// Tokugawa
Class.tokugawa_lowTurret_CLSTL = {
    PARENT: "autoTurret",
    LABEL: "Dreadnought",
    INDEPENDENT: true,
    BODY: {
        FOV: base.FOV * 1.4,
    },
    GUNS: [
        {
            POSITION: [12.25, 7.5 * 0.6, 1, 0, 0, 0, 0],
        },
        {
            POSITION: [2, 7.5, 0.6, 12, 0, 0, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.swarm, {damage: 2}, y.celestialGuns, {recoil: 0.1}]),
                TYPE: "swarm",
                STAT_CALCULATOR: "swarm",
            },
        },
    ],
}
Class.tokugawa_topTurret_CLSTL = {
    PARENT: "autoTurret",
    LABEL: "Musket",
    INDEPENDENT: true,
    BODY: {
        FOV: base.FOV * 1.2,
    },
    GUNS: [
        {
            POSITION: [16, 19, 1, 0, 0, 0, 0],
        },
        {
            POSITION: [18, 7, 1, 0, 4, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.rifle, g.twin, y.celestialGuns]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: [18, 7, 1, 0, -4, 0, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.rifle, g.twin, y.celestialGuns]),
                TYPE: "bullet"
            }
        }
    ],
}
let tokugawa_ = new LayeredBoss('tokugawa_CLSTL', "Tokugawa", "rogueCelestial_CLSTL", 9, "darkGrey", null, 0, 0.5+20*(nineSidedShapeScale-sevenSidedShapeScale)/nineSidedShapeScale);
Class.tokugawa_CLSTL.TURRETS = []
tokugawa_.addLayer({turret: {
    POSITION: [l1Size, 8.5, 0, null, 180, 0],
    TYPE: "tokugawa_lowTurret_CLSTL",
}})
tokugawa_.addLayer({turret: {
    POSITION: [l2Size, 8.5, 0, null, 180, 0],
    TYPE: ["tokugawa_topTurret_CLSTL", {GUN_STAT_SCALE: combineStats([{damage: 1.4, health: 1.4, reload: 1.3}]) }],
}})
/// Soekarno
Class.soekarno_lowTurret_CLSTL = {
    PARENT: "autoTurret",
    LABEL: "Scattershot",
    INDEPENDENT: true,
    BODY: {
        FOV: base.FOV * 1.4,
    },
    GUNS: [
        {
            POSITION: [13, 4, 1, 0, -0.5, -50, 5 / 6],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.artillery, g.twin, g.spreadshot, y.celestialGuns, {recoil: 0.1}]),
                TYPE: "bullet",
                LABEL: "Spread"
            }
        },
        {
            POSITION: [13, 4, 1, 0, 0.5, 50, 5 / 6],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.artillery, g.twin, g.spreadshot, y.celestialGuns, {recoil: 0.1}]),
                TYPE: "bullet",
                LABEL: "Spread"
            }
        },
        {
            POSITION: [14.5, 4, 1, 0, -0.5, -40, 4 / 6],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.artillery, g.twin, g.spreadshot, y.celestialGuns, {recoil: 0.1}]),
                TYPE: "bullet",
                LABEL: "Spread"
            }
        },
        {
            POSITION: [14.5, 4, 1, 0, 0.5, 40, 4 / 6],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.artillery, g.twin, g.spreadshot, y.celestialGuns, {recoil: 0.1}]),
                TYPE: "bullet",
                LABEL: "Spread"
            }
        },
        {
            POSITION: [16, 4, 1, 0, -0.5, -30, 3 / 6],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.artillery, g.twin, g.spreadshot, y.celestialGuns, {recoil: 0.1}]),
                TYPE: "bullet",
                LABEL: "Spread"
            }
        },
        {
            POSITION: [16, 4, 1, 0, 0.5, 30, 3 / 6],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.artillery, g.twin, g.spreadshot, y.celestialGuns, {recoil: 0.1}]),
                TYPE: "bullet",
                LABEL: "Spread"
            }
        },
        {
            POSITION: [17.5, 4, 1, 0, -0.5, -20, 2 / 6],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.artillery, g.twin, g.spreadshot, y.celestialGuns, {recoil: 0.1}]),
                TYPE: "bullet",
                LABEL: "Spread"
            }
        },
        {
            POSITION: [17.5, 4, 1, 0, 0.5, 20, 2 / 6],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.artillery, g.twin, g.spreadshot, y.celestialGuns, {recoil: 0.1}]),
                TYPE: "bullet",
                LABEL: "Spread"
            }
        },
        {
            POSITION: [19, 4, 1, 0, -1, -10, 1 / 6],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.artillery, g.twin, g.spreadshot, y.celestialGuns, {recoil: 0.1}]),
                TYPE: "bullet",
                LABEL: "Spread"
            }
        },
        {
            POSITION: [19, 4, 1, 0, 1, 10, 1 / 6],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.artillery, g.twin, g.spreadshot, y.celestialGuns, {recoil: 0.1}]),
                TYPE: "bullet",
                LABEL: "Spread"
            }
        },
        {
            POSITION: [12, 8, 1, 8, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pounder, {damage: 0.5, speed: 0.5}, g.spreadshotMain, g.spreadshot, y.celestialGuns, {recoil: 0.1}]),
                TYPE: "bullet"
            }
        }
    ]
}
Class.soekarno_topTurret_CLSTL = {
    PARENT: "autoTurret",
    LABEL: "Engineer",
    INDEPENDENT: true,
    BODY: {
        FOV: base.FOV * 1,
    },
    GUNS: [
        {
            POSITION: [5, 11, 1, 10.5, 0, 0, 0],
        },
        {
            POSITION: [3, 14, 1, 15.5, 0, 0, 0],
        },
        {
            POSITION: [2, 14, 1.3, 18, 0, 0, 0],
            PROPERTIES: {
                MAX_CHILDREN: 3,
                SHOOT_SETTINGS: combineStats([g.trap,{shudder: 0.1, health: 1.1, speed: 1.025}, g.setTrap,{speed: 0.9, damage: 0.8}, {reload: 1.3, speed: 0.9, damage: 0.85}, y.celestialGuns, {recoil: 0.1}]),
                TYPE: "pillbox",
                SYNCS_SKILLS: true,
                DESTROY_OLDEST_CHILD: true,
                STAT_CALCULATOR: "block"
            },
        },
        {
            POSITION: [4, 14, 1, 8, 0, 0, 0],
        },
    ]
}
let soekarno_ = new LayeredBoss('soekarno_CLSTL', "Soekarno", "rogueCelestial_CLSTL", 9, "darkGrey", null, 0, 0.5+20*(nineSidedShapeScale-sevenSidedShapeScale)/nineSidedShapeScale);
Class.soekarno_CLSTL.TURRETS = []
soekarno_.addLayer({turret: {
    POSITION: [l1Size, 8.5, 0, null, 180, 0],
    TYPE: "soekarno_lowTurret_CLSTL",
}})
soekarno_.addLayer({turret: {
    POSITION: [l2Size, 8.5, 0, null, 90, 0],
    TYPE: ["soekarno_topTurret_CLSTL", {GUN_STAT_SCALE: combineStats([{damage: 1.4, health: 1.4, reload: 1.3}]) }],
}})
/// Sejong
Class.sejong_lowTurret_CLSTL = {
    PARENT: "autoTurret",
    LABEL: "Spore",
    INDEPENDENT: true,
    BODY: {
        FOV: base.FOV * 1.2,
    },
    GUNS: [
        {
            POSITION: [18, 7, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, {reload: 2}, y.celestialGuns, {recoil: 0.1}]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: [7, 7.5, 0.6, 7, 4, 0, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.swarm, {speed: 1.15, maxSpeed: 1.1}, {reload: 2}, y.celestialGuns, {recoil: 0.1}]),
                TYPE: "swarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [7, 7.5, 0.6, 7, -4, 0, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.swarm, {speed: 1.15, maxSpeed: 1.1}, {reload: 2}, y.celestialGuns, {recoil: 0.1}]),
                TYPE: "swarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [7, 7.5, 0.6, 8.5, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.swarm, {speed: 1.15, maxSpeed: 1.1}, {reload: 2}, y.celestialGuns, {recoil: 0.1}]),
                TYPE: "swarm",
                STAT_CALCULATOR: "swarm",
            },
        },
    ]
}
Class.sejong_topTurret_CLSTL = {
    PARENT: "autoTurret",
    LABEL: "Gunner",
    INDEPENDENT: true,
    BODY: {
        FOV: base.FOV * 1,
    },
    GUNS: [
        {
            POSITION: [12, 3.5, 1, 0, 7.25, 0, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.gunner, { speed: 1.2 }, y.celestialGuns, {recoil: 0.1}]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: [12, 3.5, 1, 0, -7.25, 0, 0.75],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.gunner, { speed: 1.2 }, y.celestialGuns, {recoil: 0.1}]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: [16, 3.5, 1, 0, 3.75, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.gunner, { speed: 1.2 }, y.celestialGuns, {recoil: 0.1}]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: [16, 3.5, 1, 0, -3.75, 0, 0.25],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.gunner, { speed: 1.2 }, y.celestialGuns, {recoil: 0.1}]),
                TYPE: "bullet"
            }
        }
    ]
}
let sejong_ = new LayeredBoss('sejong_CLSTL', "Sejong", "rogueCelestial_CLSTL", 9, "darkGrey", null, 0, 0.5+20*(nineSidedShapeScale-sevenSidedShapeScale)/nineSidedShapeScale);
Class.sejong_CLSTL.TURRETS = []
sejong_.addLayer({turret: {
    POSITION: [l1Size, 8.5, 0, null, 180, 0],
    TYPE: "sejong_lowTurret_CLSTL",
}})
sejong_.addLayer({turret: {
    POSITION: [l2Size, 8.5, 0, null, 90, 0],
    TYPE: ["sejong_topTurret_CLSTL", {GUN_STAT_SCALE: combineStats([{damage: 1.4, health: 1.4, reload: 1.3}]) }],
}})
/// Darius
Class.darius_lowTurret_CLSTL = {
    PARENT: "autoTurret",
    LABEL: "Bacteria",
    INDEPENDENT: true,
    BODY: {
        FOV: base.FOV * 1.1,
    },
    GUNS: [
        {
            POSITION: [18, 7, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, {reload: 2}, y.celestialGuns, {recoil: 0.1}]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: [12, 14, 1.36, 3, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.drone, {damage: 0.75}, g.honcho, y.celestialGuns, {recoil: 0.1}]),
                TYPE: "drone",
                AUTOFIRE: true,
                SYNCS_SKILLS: true,
                STAT_CALCULATOR: "drone",
                MAX_CHILDREN: 1,
                WAIT_TO_CYCLE: true
            },
        },
    ]
}
Class.darius_topTurret_CLSTL = {
    PARENT: "autoTurret",
    LABEL: "Submortar",
    INDEPENDENT: true,
    BODY: {
        FOV: base.FOV * 1,
    },
    GUNS: [
        {
            POSITION: [13, 3, 1, 0, -6, -7, 0.6],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.artillery, g.twin, y.celestialGuns, {recoil: 0.1}]),
                TYPE: "bullet",
                LABEL: "Secondary",
            },
        },
        {
            POSITION: [13, 3, 1, 0, 6, 7, 0.8],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.artillery, g.twin, y.celestialGuns, {recoil: 0.1}]),
                TYPE: "bullet",
                LABEL: "Secondary",
            },
        },
        {
            POSITION: [17, 3, 1, 0, -4, -7, 0.2],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.artillery, g.twin, y.celestialGuns, {recoil: 0.1}]),
                TYPE: "bullet",
                LABEL: "Secondary",
            },
        },
        {
            POSITION: [17, 3, 1, 0, 4, 7, 0.4],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.artillery, g.twin, y.celestialGuns, {recoil: 0.1}]),
                TYPE: "bullet",
                LABEL: "Secondary",
            },
        },
        {
            POSITION: [18, 8, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.artillery, y.celestialGuns, {recoil: 0.1}]),
                TYPE: "bullet",
                LABEL: "Heavy",
            },
        },
    ]
}
let darius_ = new LayeredBoss('darius_CLSTL', "Darius", "rogueCelestial_CLSTL", 9, "darkGrey", null, 0, 0.5+20*(nineSidedShapeScale-sevenSidedShapeScale)/nineSidedShapeScale);
Class.darius_CLSTL.TURRETS = []
darius_.addLayer({turret: {
    POSITION: [l1Size, 8.5, 0, null, 180, 0],
    TYPE: "darius_lowTurret_CLSTL",
}})
darius_.addLayer({turret: {
    POSITION: [l2Size, 8.5, 0, null, 90, 0],
    TYPE: ["darius_topTurret_CLSTL", {GUN_STAT_SCALE: combineStats([{damage: 1.4, health: 1.4, reload: 1.3}]) }],
}})
/// Xerxes
Class.xerxes_lowTurret_CLSTL = {
    PARENT: "autoTurret",
    LABEL: "Prion",
    INDEPENDENT: true,
    BODY: {
        FOV: base.FOV * 1.125,
    },
    GUNS: [
        {
            POSITION: [18, 7, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, {reload: 2}, y.celestialGuns, {recoil: 0.1}]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: [6, 11, 1.3, 8, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.drone, {damage: 0.75}, y.celestialGuns, {recoil: 0.1}]),
                TYPE: "drone",
                AUTOFIRE: true,
                SYNCS_SKILLS: true,
                STAT_CALCULATOR: "drone",
                MAX_CHILDREN: 2,
                WAIT_TO_CYCLE: true
            }
        },
        {
            POSITION: [8, 1, -4, 8, 0, 0, 0],
        },
    ]
}
Class.xerxes_topTurret_CLSTL = {
    PARENT: "autoTurret",
    LABEL: "Railgun",
    INDEPENDENT: true,
    BODY: {
        FOV: base.FOV * 1,
    },
    GUNS: [
        {
            POSITION: [22, 7, 1, 0, 0, 0, 0]
        },
        {
            POSITION: [25, 5, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.sniper,{reload: 1.5, damage: 1.2, speed: 1.15, maxSpeed: 1.2}, y.railgun, y.celestialGuns, {recoil: 0.1}]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [5, 7, -2, 7, 0, 0, 0],
        },
    ]
}
let xerxes_ = new LayeredBoss('xerxes_CLSTL', "Xerxes", "rogueCelestial_CLSTL", 9, "darkGrey", null, 0, 0.5+20*(nineSidedShapeScale-sevenSidedShapeScale)/nineSidedShapeScale);
Class.xerxes_CLSTL.TURRETS = []
xerxes_.addLayer({turret: {
    POSITION: [l1Size, 8.5, 0, null, 180, 0],
    TYPE: "xerxes_lowTurret_CLSTL",
}})
xerxes_.addLayer({turret: {
    POSITION: [l2Size, 8.5, 0, null, 90, 0],
    TYPE: ["xerxes_topTurret_CLSTL", {GUN_STAT_SCALE: combineStats([{damage: 1.4, health: 1.4, reload: 1.3}]) }],
}})
/// Ada
Class.ada_lowTurret1_CLSTL = {
    PARENT: "autoTurret",
    LABEL: "Constructor",
    INDEPENDENT: true,
    BODY: {
        FOV: base.FOV * 1,
    },
    GUNS: [
        {
            POSITION: [18, 18, 1, 0, 0, 0, 0],
        },
        {
            POSITION: [2, 18, 1.2, 18, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap,{shudder: 0.1, health: 1.1, speed: 1.025}, g.setTrap,{speed: 0.9, damage: 0.8}, g.construct, {reload: 1.2, health: 1.3}]),
                TYPE: "setTrap",
                STAT_CALCULATOR: "block"
            }
        }
    ]
}
Class.ada_lowTurret2_CLSTL = {
    PARENT: "autoTurret",
    LABEL: "Engineer",
    INDEPENDENT: true,
    BODY: {
        FOV: base.FOV * 1.15,
    },
    GUNS: [
        {
            POSITION: [5, 11, 1, 10.5, 0, 0, 0],
        },
        {
            POSITION: [3, 14, 1, 15.5, 0, 0, 0],
        },
        {
            POSITION: [2, 14, 1.3, 18, 0, 0, 0],
            PROPERTIES: {
                MAX_CHILDREN: 3,
                SHOOT_SETTINGS: combineStats([g.trap,{shudder: 0.1, health: 1.1, speed: 1.025}, g.setTrap,{speed: 0.9, damage: 0.8}, {reload: 1.3, speed: 0.9, damage: 0.85}]),
                TYPE: "pillbox",
                SYNCS_SKILLS: true,
                DESTROY_OLDEST_CHILD: true,
                STAT_CALCULATOR: "block"
            },
        },
        {
            POSITION: [4, 14, 1, 8, 0, 0, 0],
        },
    ]
}
Class.ada_lowTurret3_CLSTL = {
    PARENT: "autoTurret",
    LABEL: "Boomer",
    INDEPENDENT: true,
    BODY: {
        FOV: base.FOV * 1.25,
    },
    GUNS: [
        {
            POSITION: [5, 10, 1, 13, 0, 0, 0],
        },
        {
            POSITION: [6, 10, -1.5, 7, 0, 0, 0],
        },
        {
            POSITION: [2, 10, 1.3, 18, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap,{shudder: 0.1, health: 1.1, speed: 1.025}, g.setTrap,{speed: 0.9, damage: 0.8}, g.boomerang]),
                TYPE: "boomerang",
                STAT_CALCULATOR: "block"
            },
        },
    ]
}
Class.ada_lowTurret4_CLSTL = {
    PARENT: "autoTurret",
    LABEL: "Stall",
    INDEPENDENT: true,
    BODY: {
        FOV: base.FOV * 1.15,
    },
    GUNS: [
        {
            POSITION: [23, 7, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, {reload: 2}]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: [18, 12, 1, 0, 0, 0, 0],
        },
        {
            POSITION: [2, 12, 1.1, 18, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap,{shudder: 0.1, health: 1.1, speed: 1.025}, g.setTrap,{speed: 0.9, damage: 0.8}, {reload: 2}]),
                TYPE: "setTrap",
                STAT_CALCULATOR: "block"
            }
        }
    ]
}
Class.ada_lowTurret5_CLSTL = {
    PARENT: "autoTurret",
    LABEL: "Forger",
    INDEPENDENT: true,
    BODY: {
        FOV: base.FOV * 1.15,
    },
    GUNS: [
        {
            POSITION: [17, 3, 1, 0, -6, -7, 0.25],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.artillery]),
                TYPE: "bullet",
                LABEL: "Secondary",
            },
        },
        {
            POSITION: [17, 3, 1, 0, 6, 7, 0.75],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.artillery]),
                TYPE: "bullet",
                LABEL: "Secondary",
            },
        },
        {
            POSITION: [18, 12, 1, 0, 0, 0, 0],
        },
        {
            POSITION: [2, 12, 1.1, 18, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap,{shudder: 0.1, health: 1.1, speed: 1.025}, g.setTrap,{speed: 0.9, damage: 0.8}, g.artillery]),
                TYPE: "setTrap",
                STAT_CALCULATOR: "block",
                LABEL: "Primary",
            }
        }
    ]
}
Class.ada_lowTurret6_CLSTL = {
    PARENT: "autoTurret",
    LABEL: "Erector",
    INDEPENDENT: true,
    BODY: {
        FOV: base.FOV * 1.125,
    },
    GUNS: [
        {
            POSITION: [24, 12, 1, 0, 0, 0, 0],
        },
        {
            POSITION: [2, 12, 1.1, 24, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap,{shudder: 0.1, health: 1.1, speed: 1.025}, g.setTrap,{speed: 0.9, damage: 0.8}, g.sniper]),
                TYPE: "setTrap",
                STAT_CALCULATOR: "block",
                LABEL: "Primary",
            }
        }
    ]
}
Class.ada_lowTurret7_CLSTL = {
    PARENT: "autoTurret",
    LABEL: "Bent Builder",
    INDEPENDENT: true,
    BODY: {
        FOV: base.FOV * 1.15,
    },
    GUNS: [
        {
            POSITION: [18, 12, 1, 0, 0, 45, 0],
        },
        {
            POSITION: [2, 12, 1.1, 18, 0, 45, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap,{shudder: 0.1, health: 1.1, speed: 1.025}, g.setTrap,{speed: 0.9, damage: 0.8}, g.twin]),
                TYPE: "setTrap",
                STAT_CALCULATOR: "block",
                LABEL: "Primary",
            }
        },
        {
            POSITION: [18, 12, 1, 0, 0, -45, 0],
        },
        {
            POSITION: [2, 12, 1.1, 18, 0, -45, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap,{shudder: 0.1, health: 1.1, speed: 1.025}, g.setTrap,{speed: 0.9, damage: 0.8}, g.twin]),
                TYPE: "setTrap",
                STAT_CALCULATOR: "block",
                LABEL: "Primary",
            }
        }
    ]
}
Class.ada_topTurret_CLSTL = {
    PARENT: "autoTurret",
    LABEL: "Surgeon",
    INDEPENDENT: true,
    BODY: {
        FOV: base.FOV * 1.15,
    },
    TURRETS: [
        {
            POSITION: [13, 0, 0, 0, 360, 1],
            TYPE: "healerSymbol",
        },
    ],
    GUNS: [
        {
            POSITION: [5, 11, 1, 10.5, 0, 0, 0],
        },
        {
            POSITION: [3, 14, 1, 15.5, 0, 0, 0],
        },
        {
            POSITION: [2, 14, 1.3, 18, 0, 0, 0],
            PROPERTIES: {
                MAX_CHILDREN: 3,
                SHOOT_SETTINGS: combineStats([g.trap,{shudder: 0.1, health: 1.1, speed: 1.025}, g.setTrap,{speed: 0.9, damage: 0.8}, { speed: 0.7, maxSpeed: 0.7 }, y.celestialGuns, {recoil: 0.1}]),
                TYPE: "surgeonPillbox",
                SYNCS_SKILLS: true,
                STAT_CALCULATOR: "block",
                DESTROY_OLDEST_CHILD: true,
            },
        },
        {
            POSITION: [4, 14, 1, 8, 0, 0, 0],
        },
    ]
}
let ada_ = new LayeredBoss('ada_CLSTL', "Ada", "rogueCelestial_CLSTL", 9, "darkGrey", null, 0, 0.5+20*(nineSidedShapeScale-sevenSidedShapeScale)/nineSidedShapeScale);
Class.ada_CLSTL.TURRETS = []
ada_.addLayer({turret: {
    POSITION: [l1Size, 8.5, 0, null, 180, 0],
    TYPE: "autoTurret",
}})
ada_.addLayer({turret: {
    POSITION: [l2Size, 8.5, 0, null, 90, 0],
    TYPE: ["ada_topTurret_CLSTL", {GUN_STAT_SCALE: combineStats([{damage: 1.4, health: 1.4, reload: 1.3}]) }],
}})
Class.ada_CLSTLLayer1.TURRETS[0].TYPE = "ada_lowTurret1_CLSTL"
Class.ada_CLSTLLayer1.TURRETS[1].TYPE = "ada_lowTurret2_CLSTL"
Class.ada_CLSTLLayer1.TURRETS[2].TYPE = "ada_lowTurret3_CLSTL"
Class.ada_CLSTLLayer1.TURRETS[3].TYPE = "ada_lowTurret4_CLSTL"
Class.ada_CLSTLLayer1.TURRETS[4].TYPE = "ada_lowTurret5_CLSTL"
Class.ada_CLSTLLayer1.TURRETS[5].TYPE = "ada_lowTurret6_CLSTL"
Class.ada_CLSTLLayer1.TURRETS[6].TYPE = "ada_lowTurret7_CLSTL"
// Rogue Eternals
/// Hecuba
Class.hecuba_lowTurret_CLSTL = {
    PARENT: "autoTurret",
    LABEL: "Alphaconcoction",
    INDEPENDENT: true,
    BODY: {
        FOV: base.FOV * 1.15 * 2,
    },
    GUNS: [
        {
            POSITION: [4, 12, 1.2, 16, 0, 0, 0],
        }, {
            POSITION: [8, 20, -0.25, 11, 0, 0, 0],
        }, {
            POSITION: [15, 18, -0.8, 0, 0, 0, 0],
        }, {
            POSITION: [18, 20, -0.7, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.artillery, g.artillery, g.skimmer, { reload: 2, health: 1.9, damage: 1.2, resist: 1.2, speed: 1.3, maxSpeed: 1.3, range: 2.5 }, y.celestialGuns]),
                TYPE: "hecubaMissile_CLSTL",
            },
        },
    ],
}
Class.hecuba_midTurret_CLSTL = {
    PARENT: "autoTurret",
    LABEL: "Dreadnoughtdrive",
    INDEPENDENT: true,
    BODY: {
        FOV: base.FOV * 1.2 * 2,
    },
    GUNS: [
        {
            POSITION: [8.5, 15, 0.6, 8, 0, 0, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.drone, g.sunchip, {size: 0.8, health: 1.5, damage: 1.5, density: 1.2, maxSpeed: 0.8}, y.celestialGuns, y.celestialGuns]),
                TYPE: "twinAutoMinichip_CLSTL",
                STAT_CALCULATOR: "drone",
            },
        },
        {
            POSITION: [8, 9, 1, 6, 0, 0, 0],
        },
    ],
}
Class.hecuba_topTurret_CLSTL = {
    PARENT: "autoTurret",
    LABEL: "Split Shot",
    INDEPENDENT: true,
    BODY: {
        FOV: base.FOV * 1 * 2,
    },
    GUNS: [
        {
            POSITION: [19, 8, 1, 0, -2, -17.5, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.flankGuard, {recoil: 19/24}, g.tripleShot, y.celestialGuns, y.celestialGuns, {recoil: 0.1}]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: [19, 8, 1, 0, +2, +17.5, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.flankGuard, {recoil: 19/24}, g.tripleShot, y.celestialGuns, y.celestialGuns, {recoil: 0.1}]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: [20, 3, 1, 0, -2, -10, 0.75],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.flankGuard, {recoil: 19/24}, g.tripleShot, g.lowPower, y.celestialGuns, y.celestialGuns, {recoil: 0.1}]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: [20, 3, 1, 0, +2, +10, 0.25],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.flankGuard, {recoil: 19/24}, g.tripleShot, g.lowPower, y.celestialGuns, y.celestialGuns, {recoil: 0.1}]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: [22, 8, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.flankGuard, {recoil: 19/24}, g.tripleShot, y.celestialGuns, y.celestialGuns, {recoil: 0.1}]),
                TYPE: "bullet"
            }
        }
    ],
}
let hecuba_ = new LayeredBoss('hecuba_CLSTL', "Hecuba", "rogueEternal_CLSTL", 11, "darkGrey", null, 0, 1+20*(elevenSidedShapeScale-nineSidedShapeScale)/elevenSidedShapeScale);
Class.hecuba_CLSTL.TURRETS = []
hecuba_.addLayer({turret: {
    POSITION: [l0Size, 8.5, 0, null, 180, 0],
    TYPE: ["hecuba_lowTurret_CLSTL", {GUN_STAT_SCALE: combineStats([{damage: 1.4, health: 1.4, reload: 1.15, speed: 1.1}]) }],
}})
hecuba_.addLayer({turret: {
    POSITION: [l1Size, 8.5, 0, null, 160, 0],
    TYPE: ["hecuba_midTurret_CLSTL", {GUN_STAT_SCALE: combineStats([{damage: 1.4, health: 1.4, reload: 1.15, speed: 1.1}]) }],
}})
hecuba_.addLayer({turret: {
    POSITION: [l2Size, 8.5, 0, null, 180, 0],
    TYPE: ["hecuba_topTurret_CLSTL", {GUN_STAT_SCALE: combineStats([{damage: 1.8, health: 1.8, reload: 1.3, speed: 1.2}]) }],
}})
/// Odysseus
Class.odysseus_lowTurret_CLSTL = {
    PARENT: "autoTurret",
    LABEL: "Beemaster",
    INDEPENDENT: true,
    BODY: {
        FOV: base.FOV * 1.1 * 2,
    },
    GUNS: [
        {
            POSITION: [12, 3, 1, 0, -8, -7, 0.2],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.swarm, g.bee, g.artillery, y.celestialGuns, y.celestialGuns, {recoil: 0.1}]),
                TYPE: ["bee", { INDEPENDENT: true }],
                SYNCS_SKILLS: true,
                STAT_CALCULATOR: "drone",
                WAIT_TO_CYCLE: true,
                LABEL: "Secondary",
            },
        },
        {
            POSITION: [12, 3, 1, 0, 8, 7, 0.4],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.swarm, g.bee, g.artillery, y.celestialGuns, y.celestialGuns, {recoil: 0.1}]),
                TYPE: ["bee", { INDEPENDENT: true }],
                SYNCS_SKILLS: true,
                STAT_CALCULATOR: "drone",
                WAIT_TO_CYCLE: true,
                LABEL: "Secondary",
            },
        },
        {
            POSITION: [14, 3, 1, 0, -6, -7, 0.6],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.swarm, g.bee, g.artillery, y.celestialGuns, y.celestialGuns, {recoil: 0.1}]),
                TYPE: ["bee", { INDEPENDENT: true }],
                SYNCS_SKILLS: true,
                STAT_CALCULATOR: "drone",
                WAIT_TO_CYCLE: true,
                LABEL: "Secondary",
            },
        },
        {
            POSITION: [14, 3, 1, 0, 6, 7, 0.8],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.swarm, g.bee, g.artillery, y.celestialGuns, y.celestialGuns, {recoil: 0.1}]),
                TYPE: ["bee", { INDEPENDENT: true }],
                SYNCS_SKILLS: true,
                STAT_CALCULATOR: "drone",
                WAIT_TO_CYCLE: true,
                LABEL: "Secondary",
            },
        },
        {
            POSITION: [19, 12, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.artillery, y.celestialGuns, y.celestialGuns, {recoil: 0.1}]),
                TYPE: "bullet",
                LABEL: "Heavy",
            },
        },
    ],
}
Class.odysseus_midTurret_CLSTL = {
    PARENT: "autoTurret",
    LABEL: "Colletidae",
    INDEPENDENT: true,
    BODY: {
        FOV: base.FOV * 1.2 * 2,
    },
    GUNS: [
        {
            POSITION: [7, 9.5, 0.6, 7, 0, 45, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.swarm, g.bee, y.celestialGuns, y.celestialGuns, {recoil: 0.1}]),
                TYPE: ["bee", { PERSISTS_AFTER_DEATH: true }],
                STAT_CALCULATOR: "swarm",
                AUTOFIRE: true
            },
        },
        {
            POSITION: [7, 9.5, 0.6, 7, 0, -45, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.swarm, g.bee, y.celestialGuns, y.celestialGuns, {recoil: 0.1}]),
                TYPE: ["bee", { PERSISTS_AFTER_DEATH: true }],
                STAT_CALCULATOR: "swarm",
                AUTOFIRE: true
            },
        },
        {
            POSITION: [7, 9.5, 0.6, 7, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.swarm, g.bee, y.celestialGuns, y.celestialGuns, {recoil: 0.1}]),
                TYPE: ["bee", { PERSISTS_AFTER_DEATH: true }],
                STAT_CALCULATOR: "swarm",
                AUTOFIRE: true
            },
        },
    ],
}
Class.odysseus_topTurret_CLSTL = {
    PARENT: "autoTurret",
    LABEL: "Flock",
    INDEPENDENT: true,
    BODY: {
        FOV: base.FOV * 1.1 * 2,
    },
    GUNS: [
        {
            POSITION: [10, 8, 0.6, 9, 0, 0, 0],
        },
        {
            POSITION: [17, 12, 1.4, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pounder, y.genericLauncher, y.clusterG, y.hyperlaunch, y.celestialGuns, y.celestialGuns, {recoil: 0.1}]),
                TYPE: "flockmissile_CLSTL",
                STAT_CALCULATOR: "sustained",
            },
        },
    ],
}
let odysseus_ = new LayeredBoss('odysseus_CLSTL', "Odysseus", "rogueEternal_CLSTL", 11, "darkGrey", null, 0, 1+20*(elevenSidedShapeScale-nineSidedShapeScale)/elevenSidedShapeScale);
Class.odysseus_CLSTL.TURRETS = []
odysseus_.addLayer({turret: {
    POSITION: [l0Size, 8.5, 0, null, 180, 0],
    TYPE: ["odysseus_lowTurret_CLSTL", {GUN_STAT_SCALE: combineStats([{damage: 1.4, health: 1.4, reload: 1.15, speed: 1.1}]) }],
}})
odysseus_.addLayer({turret: {
    POSITION: [l1Size, 8.5, 0, null, 160, 0],
    TYPE: ["odysseus_midTurret_CLSTL", {GUN_STAT_SCALE: combineStats([{damage: 1.4, health: 1.4, reload: 1.15, speed: 1.1}]) }],
}})
odysseus_.addLayer({turret: {
    POSITION: [l2Size, 8.5, 0, null, 180, 0],
    TYPE: ["odysseus_topTurret_CLSTL", {GUN_STAT_SCALE: combineStats([{damage: 1.8, health: 1.8, reload: 1.3, speed: 1.2}]) }],
}})
/// Leviticus
Class.leviticus_lowTurret_CLSTL = {
    PARENT: "autoTurret",
    LABEL: "Lifesaver",
    INDEPENDENT: true,
    BODY: {
        FOV: base.FOV * 1 * 2,
    },
    TURRETS: [
        {
            POSITION: [13, 0, 0, 0, 360, 1],
            TYPE: "healerSymbol",
        },
    ],
    GUNS: [
        {
            POSITION: [8, 9, -0.5, 8, -3, -30, 2/3],
        },
        {
            POSITION: [13.5, 10, 1, 0, -3, -30, 2/3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.tripleShot, g.healer, {damage: -1}, {size: 0.8}, y.celestialGuns, y.celestialGuns, {recoil: 0.1}]),
                TYPE: ["healerBullet_CLSTL", {GUN_STAT_SCALE: [g.twin, g.tripleShot, y.celestialGuns, y.celestialGuns]}],
            },
        },
        {
            POSITION: [8, 9, -0.5, 8, 3, 30, 2/3],
        },
        {
            POSITION: [13.5, 10, 1, 0, 3, 30, 2/3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.tripleShot, g.healer, {damage: -1}, {size: 0.8}, y.celestialGuns, y.celestialGuns, {recoil: 0.1}]),
                TYPE: ["healerBullet_CLSTL", {GUN_STAT_SCALE: [g.twin, g.tripleShot, y.celestialGuns, y.celestialGuns]}],
            },
        },
        {
            POSITION: [8, 9, -0.5, 10, -2, -15, 1/3],
        },
        {
            POSITION: [15.5, 10, 1, 0, -2, -15, 1/3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.tripleShot, g.healer, {damage: -1}, {size: 0.8}, y.celestialGuns, y.celestialGuns, {recoil: 0.1}]),
                TYPE: ["healerBullet_CLSTL", {GUN_STAT_SCALE: [g.twin, g.tripleShot, y.celestialGuns, y.celestialGuns]}],
            },
        },
        {
            POSITION: [8, 9, -0.5, 10, 2, 15, 1/3],
        },
        {
            POSITION: [15.5, 10, 1, 0, 2, 15, 1/3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.tripleShot, g.healer, {damage: -1}, {size: 0.8}, y.celestialGuns, y.celestialGuns, {recoil: 0.1}]),
                TYPE: ["healerBullet_CLSTL", {GUN_STAT_SCALE: [g.twin, g.tripleShot, y.celestialGuns, y.celestialGuns]}],
            },
        },
        {
            POSITION: [8, 9, -0.5, 12.5, 0, 0, 0],
        },
        {
            POSITION: [18, 10, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.tripleShot, g.healer, {damage: -1}, {size: 0.8}, y.celestialGuns, y.celestialGuns, {recoil: 0.1}]),
                TYPE: ["healerBullet_CLSTL", {GUN_STAT_SCALE: [g.twin, g.tripleShot, y.celestialGuns, y.celestialGuns]}],
            },
        },
    ],
}
Class.leviticus_midTurret_CLSTL = {
    PARENT: "autoTurret",
    LABEL: "Crossbow",
    INDEPENDENT: true,
    BODY: {
        FOV: base.FOV * 1.225 * 2,
    },
    GUNS: [
        {
            POSITION: [12.5, 2.5, 1, 0, 3.5, 35, 1],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.sniper,{reload: 1.5, damage: 1.2, speed: 1.15, maxSpeed: 1.2}, g.rifle,{damage: 1.35, spray: 0.55, shudder: 0.6, speed: 1.05}, g.crossbow, { recoil: 0.5 }, y.celestialGuns, y.celestialGuns, {recoil: 0.1}]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: [12.5, 2.5, 1, 0, -3.5, -35, 1],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.sniper,{reload: 1.5, damage: 1.2, speed: 1.15, maxSpeed: 1.2}, g.rifle,{damage: 1.35, spray: 0.55, shudder: 0.6, speed: 1.05}, g.crossbow, { recoil: 0.5 }, y.celestialGuns, y.celestialGuns, {recoil: 0.1}]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: [15, 2.5, 1, 0, 3.5, 35/2, 2/3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.sniper,{reload: 1.5, damage: 1.2, speed: 1.15, maxSpeed: 1.2}, g.rifle,{damage: 1.35, spray: 0.55, shudder: 0.6, speed: 1.05}, g.crossbow, { recoil: 0.5 }, y.celestialGuns, y.celestialGuns, {recoil: 0.1}]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: [15, 2.5, 1, 0, -3.5, -35/2, 2/3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.sniper,{reload: 1.5, damage: 1.2, speed: 1.15, maxSpeed: 1.2}, g.rifle,{damage: 1.35, spray: 0.55, shudder: 0.6, speed: 1.05}, g.crossbow, { recoil: 0.5 }, y.celestialGuns, y.celestialGuns, {recoil: 0.1}]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: [20, 3.5, 1, 0, 4, 0, 1/3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.sniper,{reload: 1.5, damage: 1.2, speed: 1.15, maxSpeed: 1.2}, g.rifle,{damage: 1.35, spray: 0.55, shudder: 0.6, speed: 1.05}, g.crossbow, { recoil: 0.5 }, y.celestialGuns, y.celestialGuns, {recoil: 0.1}]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: [20, 3.5, 1, 0, -4, 0, 1/3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.sniper,{reload: 1.5, damage: 1.2, speed: 1.15, maxSpeed: 1.2}, g.rifle,{damage: 1.35, spray: 0.55, shudder: 0.6, speed: 1.05}, g.crossbow, { recoil: 0.5 }, y.celestialGuns, y.celestialGuns, {recoil: 0.1}]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: [24, 7, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.sniper,{reload: 1.5, damage: 1.2, speed: 1.15, maxSpeed: 1.2}, g.rifle,{damage: 1.35, spray: 0.55, shudder: 0.6, speed: 1.05}, g.crossbow, { recoil: 0.5 }, y.celestialGuns, y.celestialGuns, {recoil: 0.1}]),
                TYPE: "bullet"
            }
        }
    ],
}
Class.leviticus_topTurret_CLSTL = {
    PARENT: "autoTurret",
    LABEL: "Assault Rifle",
    INDEPENDENT: true,
    BODY: {
        FOV: base.FOV * 1.2 * 2,
    },
    GUNS: [
        {
            POSITION: [21, 12, 1, 0, 0, 0, 0]
        },
        {
            POSITION: [23, 7, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.rifle,{damage: 1.35, spray: 0.55, shudder: 0.6, speed: 1.05}, g.minigun,{damage: 1.0125, reload: 0.8, maxSpeed: 1.3, speed: 1.2, density: 0.25}, y.celestialGuns, y.celestialGuns, {recoil: 0.1}]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: [21, 7, 1, 0, 0, 0, 1/3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.rifle,{damage: 1.35, spray: 0.55, shudder: 0.6, speed: 1.05}, g.minigun,{damage: 1.0125, reload: 0.8, maxSpeed: 1.3, speed: 1.2, density: 0.25}, y.celestialGuns, y.celestialGuns, {recoil: 0.1}]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: [19, 7, 1, 0, 0, 0, 2/3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.rifle,{damage: 1.35, spray: 0.55, shudder: 0.6, speed: 1.05}, g.minigun,{damage: 1.0125, reload: 0.8, maxSpeed: 1.3, speed: 1.2, density: 0.25}, y.celestialGuns, y.celestialGuns, {recoil: 0.1}]),
                TYPE: "bullet"
            }
        }
    ],
}
let leviticus_ = new LayeredBoss('leviticus_CLSTL', "Leviticus", "rogueEternal_CLSTL", 11, "darkGrey", null, 0, 1+20*(elevenSidedShapeScale-nineSidedShapeScale)/elevenSidedShapeScale);
Class.leviticus_CLSTL.TURRETS = []
leviticus_.addLayer({turret: {
    POSITION: [l0Size, 8.5, 0, null, 180, 0],
    TYPE: ["leviticus_lowTurret_CLSTL", {GUN_STAT_SCALE: combineStats([{damage: 1.4, health: 1.4, reload: 1.15, speed: 1.1}]) }],
}})
leviticus_.addLayer({turret: {
    POSITION: [l1Size, 8.5, 0, null, 160, 0],
    TYPE: ["leviticus_midTurret_CLSTL", {GUN_STAT_SCALE: combineStats([{damage: 1.4, health: 1.4, reload: 1.15, speed: 1.1}]) }],
}})
leviticus_.addLayer({turret: {
    POSITION: [l2Size, 8.5, 0, null, 180, 0],
    TYPE: ["leviticus_topTurret_CLSTL", {GUN_STAT_SCALE: combineStats([{damage: 1.8, health: 1.8, reload: 1.3, speed: 1.2}]) }],
}})
/// Siddharta
Class.siddharta_lowTurret_CLSTL = {
    PARENT: "autoTurret",
    LABEL: "Ironclad",
    INDEPENDENT: true,
    BODY: {
        FOV: base.FOV * 1 * 2,
    },
    GUNS: [
        {
            POSITION: [7, 8, 0.8, 7, 0, 60, 2/3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.swarm, g.machineGun, y.celestialGuns, y.celestialGuns, {recoil: 0.1}]),
                TYPE: ["eggchip", {COLOR: "veryLightGrey"}],
                MAX_CHILDREN: 4,
            },
        },
        {
            POSITION: [7, 8, 0.8, 7, 0, -60, 2/3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.swarm, g.machineGun, y.celestialGuns, y.celestialGuns, {recoil: 0.1}]),
                TYPE: ["eggchip", {COLOR: "veryLightGrey"}],
                MAX_CHILDREN: 4,
            },
        },
        {
            POSITION: [7, 8, 0.8, 7, 0, 30, 1/3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.swarm, g.machineGun, y.celestialGuns, y.celestialGuns, {recoil: 0.1}]),
                TYPE: ["eggchip", {COLOR: "veryLightGrey"}],
                MAX_CHILDREN: 4,
            },
        },
        {
            POSITION: [7, 8, 0.8, 7, 0, -30, 1/3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.swarm, g.machineGun, y.celestialGuns, y.celestialGuns, {recoil: 0.1}]),
                TYPE: ["eggchip", {COLOR: "veryLightGrey"}],
                MAX_CHILDREN: 4,
            },
        },
        {
            POSITION: [7, 8, 0.8, 7, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.swarm, g.machineGun, y.celestialGuns, y.celestialGuns, {recoil: 0.1}]),
                TYPE: ["eggchip", {COLOR: "veryLightGrey"}],
                MAX_CHILDREN: 4,
            },
        },
    ],
}
Class.siddharta_midTurret_CLSTL = {
    PARENT: "autoTurret",
    LABEL: "Actuary",
    INDEPENDENT: true,
    BODY: {
        FOV: base.FOV * 1.225 * 2,
    },
    TURRETS: [
        {
            POSITION: [13, 0, 0, 0, 360, 1],
            TYPE: "healerSymbol",
        },
    ],
    GUNS: [
        {
            POSITION: [8, 8, -0.5, 16.5, 0, 0, 0],
        },
        {
            POSITION: [22, 10, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.minigun,{damage: 1.0125, reload: 0.8, maxSpeed: 1.3, speed: 1.2, density: 0.25}, g.healer, {damage: -1}, {size: 0.9}, y.celestialGuns, y.celestialGuns]),
                TYPE: ["healerBullet_CLSTL", {GUN_STAT_SCALE: [g.minigun, {damage: 1.05}, y.celestialGuns, y.celestialGuns]}],
            },
        },
        {
            POSITION: [19, 10, 1, 0, 0, 0, 0.333],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.minigun,{damage: 1.0125, reload: 0.8, maxSpeed: 1.3, speed: 1.2, density: 0.25}, g.healer, {damage: -1}, {size: 0.9}, y.celestialGuns, y.celestialGuns]),
                TYPE: ["healerBullet_CLSTL", {GUN_STAT_SCALE: [g.minigun, {damage: 1.05}, y.celestialGuns, y.celestialGuns]}],
            },
        },
        {
            POSITION: [16, 10, 1, 0, 0, 0, 0.667],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.minigun,{damage: 1.0125, reload: 0.8, maxSpeed: 1.3, speed: 1.2, density: 0.25}, g.healer, {damage: -1}, {size: 0.9}, y.celestialGuns, y.celestialGuns]),
                TYPE: ["healerBullet_CLSTL", {GUN_STAT_SCALE: [g.minigun, {damage: 1.05}, y.celestialGuns, y.celestialGuns]}],
            },
        },
    ],
}
Class.siddharta_topTurret_CLSTL = {
    PARENT: "autoTurret",
    LABEL: "Assembler",
    INDEPENDENT: true,
    BODY: {
        FOV: base.FOV * 1.15 * 2,
    },
    GUNS: [
        {
            POSITION: [18, 12, 1, 0, 0, 0, 0],
        },
        {
            POSITION: [2, 12, 1.1, 18, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap,{shudder: 0.1, health: 1.1, speed: 1.025}, g.setTrap,{speed: 0.9, damage: 0.8}, y.celestialGuns, y.celestialGuns, {reload: 0.8, damage: 0.7}]),
                TYPE: 'assembler',
                MAX_CHILDREN: 8,
                STAT_CALCULATOR: "block",
            }
        }
    ],
    TURRETS: [
        {
            POSITION: [2.5, 14, 0, 0,    360, 1],
            TYPE: 'assembler'
        }
    ]
}
let siddharta_ = new LayeredBoss('siddharta_CLSTL', "Siddharta", "rogueEternal_CLSTL", 11, "darkGrey", null, 0, 1+20*(elevenSidedShapeScale-nineSidedShapeScale)/elevenSidedShapeScale);
Class.siddharta_CLSTL.TURRETS = []
siddharta_.addLayer({turret: {
    POSITION: [l0Size, 8.5, 0, null, 180, 0],
    TYPE: ["siddharta_lowTurret_CLSTL", {GUN_STAT_SCALE: combineStats([{damage: 1.4, health: 1.4, reload: 1.15, speed: 1.1}]) }],
}})
siddharta_.addLayer({turret: {
    POSITION: [l1Size, 8.5, 0, null, 160, 0],
    TYPE: ["siddharta_midTurret_CLSTL", {GUN_STAT_SCALE: combineStats([{damage: 1.4, health: 1.4, reload: 1.15, speed: 1.1}]) }],
}})
siddharta_.addLayer({turret: {
    POSITION: [l2Size, 8.5, 0, null, 180, 0],
    TYPE: ["siddharta_topTurret_CLSTL", {GUN_STAT_SCALE: combineStats([{damage: 1.8, health: 1.8, reload: 1.3, speed: 1.2}]) }],
}})

Class.menu_CLSTL = menu("More Celestials", "lightGrey", 9)
	Class.fullList_CLSTL = menu("Full Main List", "white", 9)
    Class.purple_CLSTL = menu("Paladin's \"extended family\"", "purple", 9)
    Class.lightGreen_CLSTL = menu("Freyja's \"extended family\"", "lightGreen", 9)
    Class.orange_CLSTL = menu("Zaphkiel's \"extended family\"", "orange", 9)
    Class.gold_CLSTL = menu("Theia's \"extended family\"", "gold", 9)
    Class.pink_CLSTL = menu("Nyx's \"extended family\"", "pink", 9)
    Class.red_CLSTL = menu("Rouge", "red", 9)
    Class.blue_CLSTL = menu("Bleu", "blue", 9)
    Class.green_CLSTL = menu("Vert", "green", 9)
    Class.magenta_CLSTL = menu("Violet", "magenta", 9)
    Class.eternalMenu_CLSTL = menu("President", "veryLightGrey", 11)
    Class.rogueCeleList_CLSTL = menu("Rogue List", "darkGrey", 9)
    Class.rogueCeleList_CLSTL.UPGRADE_TOOLTIP = "has fanon content."
        Class.rogueCeleFullList_CLSTL = menu("Full Rogue List", "darkGrey", 9)
        Class.rogueEternalist_CLSTL = menu("Rogue Eternals", "darkGrey", 9)

	Class.fullList_CLSTL.UPGRADES_TIER_0 = ["paladin_CLSTL", "freyja_CLSTL", "zaphkiel_CLSTL", "theia_CLSTL", "nyx_CLSTL", "hyperion_CLSTL", "aether_CLSTL", "atlas_CLSTL", "styx_CLSTL", "eros_CLSTL", "tethys_CLSTL", "iapetus_CLSTL", "rhea_CLSTL", "apollo_CLSTL", "hera_CLSTL", "sif_CLSTL", "freyr_CLSTL", "tyr_CLSTL", "gersemi_CLSTL", "vor_CLSTL", "alcis_CLSTL", "baldr_CLSTL", "dellingr_CLSTL", "ullr_CLSTL", "isis_CLSTL", "nephthys_CLSTL", "osiris_CLSTL", "horus_CLSTL", "anubis_CLSTL", "khonsu_CLSTL", "ptah_CLSTL", "odin_CLSTL", "kronos_CLSTL", "amun_CLSTL"]
	Class.purple_CLSTL.UPGRADES_TIER_0 = ["paladin_CLSTL", "hera_CLSTL", "gersemi_CLSTL"]
    Class.lightGreen_CLSTL.UPGRADES_TIER_0 = ["freyja_CLSTL", "hyperion_CLSTL", "apollo_CLSTL", "sif_CLSTL", "vor_CLSTL"]
    Class.orange_CLSTL.UPGRADES_TIER_0 = ["zaphkiel_CLSTL", "aether_CLSTL", "eros_CLSTL", "freyr_CLSTL", "alcis_CLSTL"]
    Class.gold_CLSTL.UPGRADES_TIER_0 = ["theia_CLSTL", "atlas_CLSTL", "tethys_CLSTL", "rhea_CLSTL", "baldr_CLSTL"]
    Class.pink_CLSTL.UPGRADES_TIER_0 = ["nyx_CLSTL", "styx_CLSTL", "iapetus_CLSTL", "tyr_CLSTL", "dellingr_CLSTL"]
    Class.red_CLSTL.UPGRADES_TIER_0 = ["ullr_CLSTL", "anubis_CLSTL"]
    Class.blue_CLSTL.UPGRADES_TIER_0 = ["nephthys_CLSTL", "ptah_CLSTL"]
    Class.green_CLSTL.UPGRADES_TIER_0 = ["osiris_CLSTL", "horus_CLSTL"]
    Class.magenta_CLSTL.UPGRADES_TIER_0 = ["isis_CLSTL", "khonsu_CLSTL"]
    Class.eternalMenu_CLSTL.UPGRADES_TIER_0 = ["odin_CLSTL", "kronos_CLSTL", "amun_CLSTL"]
    if (extraCeles == true) {
        Class.fullList_CLSTL.UPGRADES_TIER_0.push("sleipnir_CLSTL", "kratos_CLSTL", "heimdall_CLSTL", "thor_CLSTL", "sekhmet_CLSTL", "loki_CLSTL", "helios_CLSTL")
        Class.purple_CLSTL.UPGRADES_TIER_0.push("kratos_CLSTL", "heimdall_CLSTL")
        Class.red_CLSTL.UPGRADES_TIER_0.push("sekhmet_CLSTL")
        Class.blue_CLSTL.UPGRADES_TIER_0.push("thor_CLSTL")
        Class.green_CLSTL.UPGRADES_TIER_0.push("loki_CLSTL")
        Class.magenta_CLSTL.UPGRADES_TIER_0.push("helios_CLSTL")
        Class.eternalMenu_CLSTL.UPGRADES_TIER_0.push("sleipnir_CLSTL")
    }

    Class.rogueCeleFullList_CLSTL.UPGRADES_TIER_0 = ["julius_CLSTL", "genghis_CLSTL", "napoleon_CLSTL", "george_CLSTL", "winston_CLSTL", "joseph_CLSTL", "sun_CLSTL", "augustus_CLSTL", "alexander_CLSTL", "charles_CLSTL", "arthur_CLSTL", "suiko_CLSTL", "hirohito_CLSTL", "gaius_CLSTL", "tutakhamun_CLSTL", "cleopatra_CLSTL", "elizabeth_CLSTL", "margaret_CLSTL", "theodore_CLSTL", "hammurabi_CLSTL", "cyrus_CLSTL", "abraham_CLSTL", "batu_CLSTL", "meiji_CLSTL", "tokugawa_CLSTL", "soekarno_CLSTL", "sejong_CLSTL", "darius_CLSTL", "xerxes_CLSTL", "ada_CLSTL", "hecuba_CLSTL", "odysseus_CLSTL", "leviticus_CLSTL", "siddharta_CLSTL"]
    Class.rogueEternalist_CLSTL.UPGRADES_TIER_0 = ["hecuba_CLSTL", "odysseus_CLSTL", "leviticus_CLSTL", "siddharta_CLSTL"]
    Class.rogueCeleList_CLSTL.UPGRADES_TIER_0 = ["rogueCeleFullList_CLSTL", "rogueEternalist_CLSTL"]
Class.menu_CLSTL.UPGRADES_TIER_0 = ["fullList_CLSTL", "purple_CLSTL", "lightGreen_CLSTL", "orange_CLSTL", "gold_CLSTL", "pink_CLSTL", "blue_CLSTL", "green_CLSTL", "red_CLSTL", "magenta_CLSTL", "eternalMenu_CLSTL"]
// Hook into upgrade tree safely
const _celestiaEntry = ['menu_addons','addons','developer']
    .find(n => Class[n] && Array.isArray(Class[n].UPGRADES_TIER_0));
if (_celestiaEntry) {
    Class[_celestiaEntry].UPGRADES_TIER_0.push('menu_CLSTL');
} else {
    console.warn('[unofficial-celestia] Could not find addons menu — attach menu_CLSTL manually');
}
    Class.menu_CLSTL.UPGRADES_TIER_0.push("rogueCeleList_CLSTL")

for (let i of Class.fullList_CLSTL.UPGRADES_TIER_0) {
    Class[i].UPGRADE_COLOR = Class[i].COLOR
}