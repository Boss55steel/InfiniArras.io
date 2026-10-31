const { combineStats, makeAuto, makeOver, makeGuard, makeBird, makeRadialAuto, weaponArray, skillSet } = require('../facilitators.js');
const { base, statnames, dfltskl, smshskl } = require('../constants.js');
const g = require('../gunvals.js');

g.minorReload = { reload: 2.5 };
g.minorRecoil = { recoil: 0.25 };
g.minorShudder = { shudder: 0.25 };
g.minorDamage = { damage: 0.25 };
g.minorSpeed = { speed: 0.25 };
g.minorSpray = { spray: 0.25 };
g.minorSize = { size: 0.25 };
g.minorHealth = { health: 0.25 };
g.minorPenetration = { pen: 0.25 };
g.minorResist = { resist: 0.25 };
g.minorMaxSpeed = { maxSpeed: 0.25 };
g.minorDensity = { density: 0.25 };

g.halfReload = { reload: 2 };
g.halfRecoil = { recoil: 0.5 };
g.halfShudder = { shudder: 0.5 };
g.halfDamage = { damage: 0.5 };
g.halfSpeed = { speed: 0.5 };
g.halfSpray = { spray: 0.5 };
g.halfSize = { size: 0.5 };
g.halfHealth = { health: 0.5 };
g.halfPenetration = { pen: 0.5 };
g.halfResist = { resist: 0.5 };
g.halfMaxSpeed = { maxSpeed: 0.5 };
g.halfDensity = { density: 0.5 };

g.lesserReload = { reload: 1.5 };
g.lesserRecoil = { recoil: 0.75 };
g.lesserShudder = { shudder: 0.75 };
g.lesserDamage = { damage: 0.75 };
g.lesserSpeed = { speed: 0.75 };
g.lesserSpray = { spray: 0.75 };
g.lesserSize = { size: 0.75 };
g.lesserHealth = { health: 0.75 };
g.lesserPenetration = { pen: 0.75 };
g.lesserResist = { resist: 0.75 };
g.lesserMaxSpeed = { maxSpeed: 0.75 };
g.lesserDensity = { density: 0.75 };

g.bitLessReload = { reload: 1.25 };
g.bitLessRecoil = { recoil: 0.875 };
g.bitLessShudder = { shudder: 0.875 };
g.bitLessDamage = { damage: 0.875 };
g.bitLessSpeed = { speed: 0.875 };
g.bitLessSpray = { spray: 0.875 };
g.bitLessSize = { size: 0.875 };
g.bitLessHealth = { health: 0.875 };
g.bitLessPenetration = { pen: 0.875 };
g.bitLessResist = { resist: 0.875 };
g.bitLessMaxSpeed = { maxSpeed: 0.875 };
g.bitLessDensity = { density: 0.875 };

g.bitMoreReload = { reload: 0.875 };
g.bitMoreRecoil = { recoil: 1.25 };
g.bitMoreShudder = { shudder: 1.25 };
g.bitMoreDamage = { damage: 1.25 };
g.bitMoreSpeed = { speed: 1.25 };
g.bitMoreSpray = { spray: 1.25 };
g.bitMoreSize = { size: 1.25 };
g.bitMoreHealth = { health: 1.25 };
g.bitMorePenetration = { pen: 1.25 };
g.bitMoreResist = { resist: 1.25 };
g.bitMoreMaxSpeed = { maxSpeed: 1.25 };
g.bitMoreDensity = { density: 1.25 };

g.greaterReload = { reload: 0.75 };
g.greaterRecoil = { recoil: 1.5 };
g.greaterShudder = { shudder: 1.5 };
g.greaterDamage = { damage: 1.5 };
g.greaterSpeed = { speed: 1.5 };
g.greaterSpray = { spray: 1.5 };
g.greaterSize = { size: 1.5 };
g.greaterHealth = { health: 1.5 };
g.greaterPenetration = { pen: 1.5 };
g.greaterResist = { resist: 1.5 };
g.greaterMaxSpeed = { maxSpeed: 1.5 };
g.greaterDensity = { density: 1.5 };

g.doubleReload = { reload: 0.5 };
g.doubleRecoil = { recoil: 2 };
g.doubleShudder = { shudder: 2 };
g.doubleDamage = { damage: 2 };
g.doubleSpeed = { speed: 2 };
g.doubleSpray = { spray: 2 };
g.doubleSize = { size: 2 };
g.doubleHealth = { health: 2 };
g.doublePenetration = { pen: 2 };
g.doubleResist = { resist: 2 };
g.doubleMaxSpeed = { maxSpeed: 2 };
g.doubleDensity = { density: 2 };

g.superReload = { reload: 0.25 };
g.superRecoil = { recoil: 2.5 };
g.superShudder = { shudder: 2.5 };
g.superDamage = { damage: 2.5 };
g.superSpeed = { speed: 2.5 };
g.superSpray = { spray: 2.5 };
g.superSize = { size: 2.5 };
g.superHealth = { health: 2.5 };
g.superPenetration = { pen: 2.5 };
g.superResist = { resist: 2.5 };
g.superMaxSpeed = { maxSpeed: 2.5 };
g.superDensity = { density: 2.5 };

g.uberReload = { reload: 0.0001 };
g.uberRecoil = { recoil: 99 };
g.uberShudder = { shudder: 99 };
g.uberDamage = { damage: 99 };
g.uberSpeed = { speed: 99 };
g.uberSpray = { spray: 99 };
g.uberSize = { size: 99 };
g.uberHealth = { health: 99 };
g.uberPenetration = { pen: 99 };
g.uberResist = { resist: 99 };
g.uberMaxSpeed = { maxSpeed: 99 };
g.uberDensity = { density: 99 };

g.weakReload = { reload: 99 };
g.weakRecoil = { recoil: 0.0001 };
g.weakShudder = { shudder: 0.0001 };
g.weakDamage = { damage: 0.0001 };
g.weakSpeed = { speed: 0.0001 };
g.weakSpray = { spray: 0.0001 };
g.weakSize = { size: 0.0001 };
g.weakHealth = { health: 0.0001 };
g.weakPenetration = { pen: 0.0001 };
g.weakResist = { resist: 0.0001 };
g.weakMaxSpeed = { maxSpeed: 0.0001 };
g.weakDensity = { density: 0.0001 };

g.minorRange = { range: 0.25 };
g.halfRange = { range: 0.5 };
g.lesserRange = { range: 0.75 };
g.bitLessRange = { range: 0.875 };
g.bitMoreRange = { range: 1.25 };
g.greaterRange = { range: 1.5 };
g.doubleRange = { range: 2 };
g.superRange = { range: 2.5 };
g.uberRange = { range: 99 };
g.weakRange = { range: 0.0001 };

g.minorStats = { pen: 0.25, damage: 0.25, health: 0.25 };
g.halfStats = { pen: 0.5, damage: 0.5, health: 0.5 };
g.lesserStats = { pen: 0.75, damage: 0.75, health: 0.75 };
g.bitLessStats = { pen: 0.875, damage: 0.875, health: 0.875 };
g.bitMoreStats = { pen: 1.25, damage: 1.25, health: 1.25 };
g.greaterStats = { pen: 1.5, damage: 1.5, health: 1.5 };
g.doubleStats = { pen: 2, damage: 2, health: 2 };
g.superStats = { pen: 2.5, damage: 2.5, health: 2.5 };
g.uberStats = { pen: 99, damage: 99, health: 99 };
g.weakStats = { pen: 0.0001, damage: 0.0001, health: 0.0001 };

g.bounce = { reload: 25, recoil: 25, health: 0.01, damage: 0.01, speed: 0.01, maxSpeed: 0.01, range: 0.01 };
g.bang = { reload: 6.5, recoil: 0.1, health: 999, speed: 0.5, range: 0.75 };
g.nuke = { health: 999999, speed: 0, damage: 1000000 };
//OPPORATIONS
Class.genericActualTank = {
    LABEL: "Unknown Tank",
    TYPE: "tank",
    DAMAGE_CLASS: 2,
    DANGER: 5,
    COLOR: {
        BASE: "mirror",
        HUE_SHIFT: 0,
        SATURATION_SHIFT: 1,
        BRIGHTNESS_SHIFT: 0,
        ALLOW_BRIGHTNESS_INVERT: true,
    },
    SHAPE: "M -1 -1 H 0 C 1 -1 1 0 1 0 C 1 0 1 1 0 1 H -1 V -1",
    MOTION_TYPE: "motor",
    FACING_TYPE: "toTarget",
    SIZE: 17, 
    MAX_CHILDREN: 0,
    DAMAGE_EFFECTS: false,
    IGNORED_BY_AI: false,
    SYNC_WITH_TANK: false,
    HAS_NO_RECOIL: true,
    IS_IMMUNE_TO_TILES: false,
    REROOT_UPGRADE_TREE: "basic",
    BODY: {
        ACCELERATION: base.ACCEL,
        SPEED: base.SPEED * 0.8,
        HEALTH: base.HEALTH * 2,
        DAMAGE: base.DAMAGE,
        PENETRATION: base.PENETRATION,
        SHIELD: base.SHIELD * 5,
        REGEN: base.REGEN * 1.3,
        FOV: base.FOV * 2,
        DENSITY: base.DENSITY,
        PUSHABILITY: 0.5,
        HETERO: 3,
    },
    GUNS: [],
    TURRETS: [],
    PROPS: [],
    ON: [],
    GIVE_KILL_MESSAGE: true,
    IGNORE_COLLISION: false, 
    DRAW_HEALTH: true,
    RESET_EVENTS: true,
    HITS_OWN_TYPE: "hardOnlyTanks"
}
Class.genericActualHeli = {
    LABEL: "Unknown Helicopter",
    TYPE: "tank",
    DAMAGE_CLASS: 2,
    DANGER: 5,
    COLOR: {
        BASE: "mirror",
        HUE_SHIFT: 0,
        SATURATION_SHIFT: 1,
        BRIGHTNESS_SHIFT: 0,
        ALLOW_BRIGHTNESS_INVERT: true,
    },
    SHAPE: "M -1 -1 H 0 C 1 -1 1 0 1 0 C 1 0 1 1 0 1 H -1 V -1",
    MOTION_TYPE: "motor",
    FACING_TYPE: "toTarget",
    SIZE: 12, 
    MAX_CHILDREN: 0,
    DAMAGE_EFFECTS: false,
    IGNORED_BY_AI: false,
    SYNC_WITH_TANK: false,
    HAS_NO_RECOIL: true,
    IS_IMMUNE_TO_TILES: false,
    REROOT_UPGRADE_TREE: "basic",
    BODY: {
        ACCELERATION: base.ACCEL,
        SPEED: base.SPEED * 1.3,
        HEALTH: base.HEALTH * 1.75,
        DAMAGE: base.DAMAGE,
        PENETRATION: base.PENETRATION,
        SHIELD: base.SHIELD * 2,
        REGEN: base.REGEN * 1.3,
        FOV: base.FOV * 2.5,
        DENSITY: base.DENSITY,
        PUSHABILITY: 1,
        HETERO: 3,
    },
    GUNS: [],
    TURRETS: [],
    PROPS: [],
    ON: [],
    GIVE_KILL_MESSAGE: true,
    DRAW_HEALTH: true,
    IGNORE_COLLISION: true, 
    RESET_EVENTS: true,
    HITS_OWN_TYPE: "never"
}
Class.genericActualJet = {
    LABEL: "Unknown Jet",
    TYPE: "tank",
    LAYER: 35,
    DAMAGE_CLASS: 2,
    DANGER: 5,
    COLOR: {
        BASE: "mirror",
        HUE_SHIFT: 0,
        SATURATION_SHIFT: 1,
        BRIGHTNESS_SHIFT: 0,
        ALLOW_BRIGHTNESS_INVERT: true,
    },
    SHAPE: "M -1 -1 H 0 C 1 -1 1 0 1 0 C 1 0 1 1 0 1 H -1 V -1",
    MOTION_TYPE: "motor",
    FACING_TYPE: "toTarget",
    SIZE: 15, 
    MAX_CHILDREN: 0,
    DAMAGE_EFFECTS: false,
    IGNORED_BY_AI: false,
    SYNC_WITH_TANK: false,
    IS_IMMUNE_TO_TILES: false,
    REROOT_UPGRADE_TREE: "basic",
    BODY: {
        ACCELERATION: base.ACCEL,
        SPEED: base.SPEED / 2,
        HEALTH: base.HEALTH * 1.6,
        DAMAGE: base.DAMAGE,
        PENETRATION: base.PENETRATION,
        SHIELD: base.SHIELD * 1.5,
        REGEN: base.REGEN * 2,
        FOV: base.FOV * 2.5,
        DENSITY: base.DENSITY,
        PUSHABILITY: 1,
        HETERO: 3,
    },
    GUNS: [],
    TURRETS: [],
    PROPS: [],
    ON: [],
    GIVE_KILL_MESSAGE: true,
    DRAW_HEALTH: true,
    RESET_EVENTS: true,
    HITS_OWN_TYPE: "never"
}
//TANK DECORATIONS
//TANK DECORATIONS

Class.uncoloredCircle = (0)
Class.electricTankTop = {
SHAPE: "M -1 -1 H 0 C 1 0 1 0 1 0 C 1 0 2 1 2 1 H -1 V -1",
MIRROR_MASTER_ANGLE: true,
}
Class.TankDeco1 = {
    PARENT: "genericTank",
    LABEL: "Tank Deco",
    FACING_TYPE: ["turnWithSpeed"],
    COLOR: "grey",
    SHAPE: "M -1 -2 V 2 C -1 3 -1 2 -1 2 V -2 C -0.6667 -2.3333 -0.3333 -2.6667 0 -3 C 0.3333 -2.6667 0.6667 -2.3333 1 -2 C 1 -0.3333 1 1.3333 1 3 C 0.6667 3.3333 0.3333 3.6667 0 4 C -0.3333 3.6667 -0.6667 3.3333 -1 3",
    MIRROR_MASTER_ANGLE: true,
}
Class.TankDeco2 = {
    PARENT: "genericTank",
    LABEL: "Tank Deco",
    FACING_TYPE: ["turnWithSpeed"],
    COLOR: "grey",
    SHAPE: "M -2 0 H 2 C 2 0 2 -1 2 -1 C 2 -1 3 0 3 0 L 0 2 L -3 0 C -2.6667 -0.3333 -2.3333 -0.6667 -2 -1 C -2 -0.6667 -2 -0.3333 -2 0",
    MIRROR_MASTER_ANGLE: true,
}
Class.TankDeco3 = {
    PARENT: "genericTank",
    LABEL: "Tank Deco",
    FACING_TYPE: ["turnWithSpeed"],
    COLOR: "darkGrey",
    SHAPE: "M -10 -1 L 10 -1 L 8 0 C 10 1 10 1 10 1 L -10 1 C -9.3333 0.6667 -8.6667 0.3333 -8 0 L -10 -1",
    MIRROR_MASTER_ANGLE: true,
}
Class.TankDeco4 = {
    PARENT: "genericTank",
    LABEL: "Tank Deco",
    FACING_TYPE: ["turnWithSpeed"],
    COLOR: "darkGrey",
    SHAPE: [[1.7,0],[1.1,-1],[0,-0.6],[-1.1,-1],[-1,0],[-1.1,1],[0,0.6],[1.1,1]],
    MIRROR_MASTER_ANGLE: true,
}
Class.TankRight = {
    PARENT: "genericTank",
    LABEL: "Tank Side",
    FACING_TYPE: ["turnWithSpeed"],
    COLOR: "darkGrey",
    SHAPE: "M -6 0 H 5 V 1 C 4 2 4 2 4 2 H -5 V 2 C -5 2 -5 2 -6 1 C -6 0.6667 -6 0.3333 -6 0",
    MIRROR_MASTER_ANGLE: true,
    TURRETS: [
        {
            POSITION: [4.8, 31, 10, 0, 0, 1],
            TYPE: "TankDeco1",
        },
        {
            POSITION: [4.8, 24, 10, 0, 0, 1],
            TYPE: "TankDeco1",
        },
        {
            POSITION: [4.8, 17, 10, 0, 0, 1],
            TYPE: "TankDeco1",
        },
        {
            POSITION: [4.8, -42, 10, 0, 0, 1],
            TYPE: "TankDeco1",
        },
        {
            POSITION: [4.8, -35, 10, 0, 0, 1],
            TYPE: "TankDeco1",
        },
        {
            POSITION: [4.8, -28, 10, 0, 0, 1],
            TYPE: "TankDeco1",
        },
        {
            POSITION: [18, -5, 0, 0, 0, 1],
            TYPE: "TankDeco2",
        },
    ]
}
Class.TankLeft = {
    PARENT: "genericTank",
    LABEL: "Tank Side",
    FACING_TYPE: ["turnWithSpeed"],
    COLOR: "darkGrey",
    SHAPE: "M -5 0 H 6 V 1 C 5 2 5 2 5 2 H -4 C -5 1 -5 1 -5 1 V 0",
    MIRROR_MASTER_ANGLE: true,
    TURRETS: [
        {
            POSITION: [4.8, -31, 10, 0, 0, 1],
            TYPE: "TankDeco1",
        },
        {
            POSITION: [4.8, -24, 10, 0, 0, 1],
            TYPE: "TankDeco1",
        },
        {
            POSITION: [4.8, -17, 10, 0, 0, 1],
            TYPE: "TankDeco1",
        },
        {
            POSITION: [4.8, 42, 10, 0, 0, 1],
            TYPE: "TankDeco1",
        },
        {
            POSITION: [4.8, 35, 10, 0, 0, 1],
            TYPE: "TankDeco1",
        },
        {
            POSITION: [4.8, 28, 10, 0, 0, 1],
            TYPE: "TankDeco1",
        },
        {
            POSITION: [18, 5, 0, 0, 0, 1],
            TYPE: "TankDeco2",
        },
    ]
}
Class.TankBase = {
    PARENT: "genericTank",
    LABEL: "Electric Base",
    CONTROLLERS: ["turretWithMotion"],
    SHAPE: [[1.7,0],[1.1,-1],[0,-0.6],[-1.1,-1],[-1,0],[-1.1,1],[0,0.6],[1.1,1]],
    GUNS: [
        {
            POSITION: [16, 5.5, 1, 1, 6.5, 0, 0]
        },
        {
            POSITION: [14.5, 5.5, 1, 1, 6.5, 0, 0]
        },
        {
            POSITION: [13, 5.5, 1, 1, 6.5, 0, 0]
        },
        {
            POSITION: [16, 5.5, 1, 1, -6.5, 0, 0]
        },
        {
            POSITION: [14.5, 5.5, 1, 1, -6.5, 0, 0]
        },
        {
            POSITION: [13, 5.5, 1, 1, -6.5, 0, 0]
        },
        {
            POSITION: [13, 5.5, 1, 1, 6.5, 180, 0]
        },
        {
            POSITION: [11.5, 5.5, 1, 1, 6.5, 180, 0]
        },
        {
            POSITION: [10, 5.5, 1, 1, 6.5, 180, 0]
        },
        {
            POSITION: [8.5, 5.5, 1, 1, 6.5, 180, 0]
        },
        {
            POSITION: [13, 5.5, 1, 1, -6.5, 180, 0]
        },
        {
            POSITION: [11.5, 5.5, 1, 1, -6.5, 180, 0]
        },
        {
            POSITION: [10, 5.5, 1, 1, -6.5, 180, 0]
        },
        {
            POSITION: [8.5, 5.5, 1, 1, -6.5, 180, 0]
        },
    ],
    TURRETS: [
        {
            POSITION: [18.5, 0, 0, 0, 0, 1],
            TYPE: "TankDeco4",
        },
        {
            POSITION: [5.3, 0, -10, 0, 0, 1],
            TYPE: "TankLeft",
        },
        {
            POSITION: [5.3, 0, -10, 180, 0, 1],
            TYPE: "TankRight",
        },
        {
            POSITION: [2, 0, -1.4, 90, 0, 1],
            TYPE: "TankDeco3",
        },
    ]
}
Class.JetBase = {
    PARENT: "genericTank",
    LABEL: "Basic Jet Base",
    CONTROLLERS: ["turretWithMotion"],
    SHAPE: "M 0 0 C 0 -1 0 -2 0 -3 C 0.6667 -2 1.3333 -1 2 0 C 1.3333 1 0.6667 2 0 3 C 0 2 0 1 0 0 C 0 1 0 2 0 3 C -1.6667 2.3333 -3.3333 1.6667 -5 1 C -3.8333 1 -2.6667 1 -1.5 1 C -1.3333 0.8333 -1.1667 0.6667 -1 0.5 C -1 0.1667 -1 -0.1667 -1 -0.5 C -1 -0.5 -1.5 -1 -1.5 -1 C -2.6667 -1 -3.8333 -1 -5 -1 C -5 -1 0 -3 0 -3",
  GUNS: [
        {
            POSITION: [0.1, 2, 1, -1, 0, 180, 0],
            PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.basic, {range: 0.0001, reload: 0.1, speed: 0, recoil: 4.25}]),
            TYPE: [ "bullet", { PERSISTS_AFTER_DEATH: true } ],
            BORDERLESS: true,
            AUTOFIRE: true,
            ALPHA: 0
            }
        },
    {
         POSITION: [50, 20, 1, 0, 0, 180, 0],
            PROPERTIES: {
            COLOR: "blue",
            BORDERLESS: true,
            ALPHA: 0.2
            }
        },
    {
         POSITION: [55, 20, 1, 0, 0, 180, 0],
            PROPERTIES: {
            COLOR: "blue",
            BORDERLESS: true,
            ALPHA: 0.2
            }
        },
{
         POSITION: [60, 20, 1, 0, 0, 180, 0],
            PROPERTIES: {
            COLOR: "blue",
            BORDERLESS: true,
            ALPHA: 0.2
            }
        },
{
         POSITION: [65, 20, 1, 0, 0, 180, 0],
            PROPERTIES: {
            COLOR: "blue",
            BORDERLESS: true,
            ALPHA: 0.2
            }
        },
{
  POSITION: [70, 20, 1, 0, 0, 180, 0],
            PROPERTIES: {
            COLOR: "blue",
            BORDERLESS: true,
            ALPHA: 0.2
            }
        },
{
         POSITION: [75, 20, 1, 0, 0, 180, 0],
            PROPERTIES: {
            COLOR: "blue",
            BORDERLESS: true,
            ALPHA: 0.2
            }
        }
    ],
}
//GUNASSETS
Class.flankMissileBody = {
  SHAPE: [[-0.8,0],[-0.8,-0.4],[0.6,-0.4],[0.6,0],[0.6,0.4],[-0.8,0.4],[-0.8,0]],
  COLOR: "#736245",
};
Class.VolatileMissileBody = {
  SHAPE: [[-0.8,0],[-0.8,-0.4],[0.6,-0.4],[0.6,0],[0.6,0.4],[-0.8,0.4],[-0.8,0]],
  COLOR: "red",
};
Class.BomberShellsBody = {
  SHAPE: [[-1.5,-0.8],[-0.8,-0.4],[0.6,-0.4],[1.5,0],[0.6,0.4],[-0.8,0.4],[-1.5,0.8]],
  COLOR: "darkGrey",
};
//BULLETS
Class.NukeBoom = {
    PARENT: "bullet",
    MOTION_TYPE: ['grow', {growSpeed: 100}],
}
Class.railgunShot = {
    PARENT: "genericTank",
    LABEL: "Tank Deco",
    FACING_TYPE: ["turnWithSpeed"],
    COLOR: "grey",
    SHAPE: [[4,0],[-2,0.5],[-2.3,-0],[-2,-0.5]],
    MIRROR_MASTER_ANGLE: true,
}
//MISSILES
Class.BomberShells = {
    PARENT: "missile",
    AUTOFIRE: true,
    SHAPE: [[-1.5,-0.8],[-0.8,-0.4],[0.6,-0.4],[1.5,0],[0.6,0.4],[-0.8,0.4],[-1.5,0.8]],
    TURRETS: [
      {
      POSITION: [17, 0, 0, 0, 0, 1],
      TYPE: [ "flankMissileBody", ],
        },
      ],
    GUNS: weaponArray([
        {
            POSITION: [0.1, 2, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.flankGuard, g.flankGuard, g.doubleReload, g.minorReload, g.minorSpeed]),
                TYPE: [ "growBullet", { PERSISTS_AFTER_DEATH: true } ],
                SHOOT_ON_DEATH: true,
            }
        },
        {
          POSITION: [0.1, 2, 1, 0, 0, 180, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.flankGuard, g.flankGuard, g.doubleReload, g.minorReload, g.greaterDamage, g.minorSpeed]),
                TYPE: [ "growBullet", { PERSISTS_AFTER_DEATH: true } ],
                SHOOT_ON_DEATH: true,
            }
        },
        {
            POSITION: [0.1, 2, 1, 0, 0, -90, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.flankGuard, g.flankGuard, g.doubleReload, g.minorReload, g.greaterDamage, g.minorSpeed]),
                TYPE: [ "growBullet", { PERSISTS_AFTER_DEATH: true } ],
                INTANGIBLE: true,
                SHOOT_ON_DEATH: true,
            }
        },
        {
            POSITION: [0.1, 2, 1, 0, 0, 90, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.flankGuard, g.flankGuard, g.doubleReload, g.minorReload, g.greaterDamage, g.minorSpeed]),
                TYPE: [ "growBullet", { PERSISTS_AFTER_DEATH: true } ],
                INTANGIBLE: true,
                SHOOT_ON_DEATH: true,
            }
        }
    ], 2)
}
Class.flankMissile = {
    PARENT: "missile",
    LABEL: "Flank Missile",
    SHAPE: [[-1.5,-0.8],[-0.8,-0.4],[0.6,-0.4],[1.5,0],[0.6,0.4],[-0.8,0.4],[-1.5,0.8]],
    TURRETS: [
      {
      POSITION: [20, 0, 0, 0, 0, 1],
      TYPE: [ "flankMissileBody", ],
        },
      ],
    GUNS: [
        {
            POSITION: [14, 6, 2, 0, -2, 180, 0],
            PROPERTIES: {
                AUTOFIRE: true,
                SHOOT_SETTINGS: combineStats([g.basic, g.weakHealth, g.doubleSpray, g.greaterSpray, {speed: 1.3, recoil: 0.05}]),
                TYPE: [ "bullet", { PERSISTS_AFTER_DEATH: true } ],
                STAT_CALCULATOR: "thruster",
                COLOR: "darkGrey",
                WAIT_TO_CYCLE: true,
            }
        },
        {
            POSITION: [14, 6, 2, 0, 2, 180, 0],
            PROPERTIES: {
                AUTOFIRE: true,
                SHOOT_SETTINGS: combineStats([g.basic, g.weakHealth, g.doubleSpray, g.greaterSpray, {speed: 1.3, recoil: 0.05}]),
                TYPE: [ "bullet", { PERSISTS_AFTER_DEATH: true } ],
                STAT_CALCULATOR: "thruster",
                COLOR: "darkGrey",
                WAIT_TO_CYCLE: true,
            }
        }
    ]
}
Class.homingflankMissile = {
    LABEL: "Swarm Drone",
    TYPE: "swarm",
    ACCEPTS_SCORE: false,
    SHAPE: [[-1.5,-0.8],[-0.8,-0.4],[0.6,-0.4],[1.5,0],[0.6,0.4],[-0.8,0.4],[-1.5,0.8]],
    INDEPENDENT: true,
    MOTION_TYPE: "swarm",
    FACING_TYPE: "smoothWithMotion",
    CONTROLLERS: ["nearestDifferentMaster", "mapTargetToGoal"],
    COLOR: 'mirror',
    BODY: {
        ACCELERATION: 10,
        PENETRATION: 1,
        HEALTH: 0.1,
        DAMAGE: 2.25,
        SPEED: 20.5,
        RESIST: 1.6,
        RANGE: 225,
        DENSITY: 12,
        PUSHABILITY: 0.6,
        FOV: 1.5,
    },
    DIE_AT_RANGE: true,
    BUFF_VS_FOOD: true,
TURRETS: [
      {
      POSITION: [20, 0, 0, 0, 0, 1],
      TYPE: [ "flankMissileBody", ],
        },
      ],
    GUNS: [
        {
            POSITION: [14, 6, 2, 0, -2, 180, 0],
            PROPERTIES: {
                AUTOFIRE: true,
                SHOOT_SETTINGS: combineStats([g.basic, g.weakHealth, g.doubleSpray, g.greaterSpray, {speed: 1.3, recoil: 0.05}]),
                TYPE: [ "bullet", { PERSISTS_AFTER_DEATH: true } ],
                STAT_CALCULATOR: "thruster",
                COLOR: "darkGrey",
                WAIT_TO_CYCLE: true,
            }
        },
        {
            POSITION: [14, 6, 2, 0, 2, 180, 0],
            PROPERTIES: {
                AUTOFIRE: true,
                SHOOT_SETTINGS: combineStats([g.basic, g.weakHealth, g.doubleSpray, g.greaterSpray, {speed: 1.3, recoil: 0.05}]),
                TYPE: [ "bullet", { PERSISTS_AFTER_DEATH: true } ],
                STAT_CALCULATOR: "thruster",
                COLOR: "darkGrey",
                WAIT_TO_CYCLE: true,
            }
        }
    ]
}
Class.volatileShells = {
    PARENT: "missile",
    LABEL: "Volatile Shell",
    SHOOT_ON_DEATH: true,
    SHAPE: [[-1.5,-0.8],[-0.8,-0.4],[0.6,-0.4],[1.5,0],[0.6,0.4],[-0.8,0.4],[-1.5,0.8]],
    TURRETS: [
      {
      POSITION: [20, 0, 0, 0, 0, 1],
      TYPE: [ "flankMissileBody", ],
        },
      {
      POSITION: [15, 0, 0, 0, 90, 1],
      TYPE: [ "VolatileMissileBody", ],
        },
      ],
    GUNS: weaponArray([
        {
            POSITION: [0.1, 2, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.flankGuard, g.flankGuard, g.greaterDamage, g.minorSpeed]),
                TYPE: [ "growBullet", { PERSISTS_AFTER_DEATH: true } ],
                SHOOT_ON_DEATH: true,
            }
        },
        {
          POSITION: [0.1, 2, 1, 0, 0, 180, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.flankGuard, g.flankGuard, g.greaterDamage, g.minorSpeed]),
                TYPE: [ "growBullet", { PERSISTS_AFTER_DEATH: true } ],
                SHOOT_ON_DEATH: true,
            }
        },
        {
            POSITION: [0.1, 2, 1, 0, 0, -90, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.flankGuard, g.flankGuard, g.greaterDamage, g.minorSpeed]),
                TYPE: [ "growBullet", { PERSISTS_AFTER_DEATH: true } ],
                INTANGIBLE: true,
                SHOOT_ON_DEATH: true,
            }
        },
        {
            POSITION: [0.1, 2, 1, 0, 0, 90, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.flankGuard, g.flankGuard, g.greaterDamage, g.minorSpeed]),
                TYPE: [ "growBullet", { PERSISTS_AFTER_DEATH: true } ],
                INTANGIBLE: true,
                SHOOT_ON_DEATH: true,
            }
        }
    ], 2)
}
Class.veryVolatileShells = {
    PARENT: "missile",
    LABEL: "Volatile Shell",
    SHOOT_ON_DEATH: true,
    SHAPE: [[-1.5,-0.8],[-0.8,-0.4],[0.6,-0.4],[2.5,0],[0.6,0.4],[-0.8,0.4],[-1.5,0.8],[-2,0.8],[-1.5,0],[-2,-0.8]],
    TURRETS: [
      {
      POSITION: [20, 0, 0, 0, 0, 1],
      TYPE: [ "flankMissileBody", ],
        },
      {
      POSITION: [15, 0, 0, 0, 90, 1],
      TYPE: [ "VolatileMissileBody", ],
        },
      ],
    GUNS: weaponArray([
        {
            POSITION: [0.1, 2, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.flankGuard, g.flankGuard, g.superHealth, g.greaterDamage, g.minorSpeed]),
                TYPE: [ "growBullet", { PERSISTS_AFTER_DEATH: true } ],
                INTANGIBLE: true,
                SHOOT_ON_DEATH: true,
            }
        },
        {
          POSITION: [0.1, 2, 1, 0, 0, 180, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.flankGuard, g.flankGuard, g.superHealth, g.greaterDamage, g.minorSpeed]),
                TYPE: [ "growBullet", { PERSISTS_AFTER_DEATH: true } ],
                INTANGIBLE: true,
                SHOOT_ON_DEATH: true,
            }
        },
        {
            POSITION: [0.1, 2, 1, 0, 0, -90, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.flankGuard, g.flankGuard, g.superHealth, g.greaterDamage, g.minorSpeed]),
                TYPE: [ "growBullet", { PERSISTS_AFTER_DEATH: true } ],
                INTANGIBLE: true,
                SHOOT_ON_DEATH: true,
            }
        },
        {
            POSITION: [0.1, 2, 1, 0, 0, 90, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.flankGuard, g.flankGuard, g.superHealth, g.greaterDamage, g.minorSpeed]),
                TYPE: [ "growBullet", { PERSISTS_AFTER_DEATH: true } ],
                INTANGIBLE: true,
                SHOOT_ON_DEATH: true,
            }
        }
    ], 7)
}
Class.nuclearmissile = {
    PARENT: "missile",
    LABEL: "Actual Fcuking Nuke",
    SHOOT_ON_DEATH: true,
    SHAPE: "M -1 -1 H 1 A 1 1 0 0 0 1 -1 C 2 0 2 0 2 0 C 2 0 2 0 1 1 H -1 V -1 C -1 -1 -4 0 -4 0 C -4.3333 0.3333 -4.6667 0.6667 -5 1 C -1 1 -3 0 -1 1 C -1 0.3333 -1 -0.3333 -1 -1 C -3 0 -1 -1 -5 -1 C -4.6667 -0.6667 -4.3333 -0.3333 -4 0",
    TURRETS: [
      {
      POSITION: [20, 0, 0, 0, 0, 1],
      TYPE: [ "flankMissileBody", ],
        },
      {
      POSITION: [15, 0, 0, 0, 90, 1],
      TYPE: [ "VolatileMissileBody", ],
        },
      ],
    GUNS: weaponArray([
        {
            POSITION: [0.1, 2, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.nuke]),
                TYPE: [ "NukeBoom", { PERSISTS_AFTER_DEATH: true } ],
                INTANGIBLE: true,
                SHOOT_ON_DEATH: true,
            }
        }
    ], 1)
}
Class.tank5mmRound = {
    PARENT: "bullet",
    INTANGIBLE: true,
    SHAPE: [[-1.2,0.5],[-1.2,-0.5],[2,0]]
};
//TURRETS
Class.tankAutoTurret1 = {
	PARENT: "autoTankGun",
	INDEPENDENT: true,
  COLOR: "#736245",
  HAS_NO_RECOIL: true,
	GUNS: [
		{
          POSITION: [30, 9, 0.6, 0, 0, 0, 0],
            PROPERTIES: {
                COLOR: "darkGrey",
            }
        },
        {
          POSITION: [40, 6, 1.3, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, { reload: 0.1, damage: 0.01, speed: 20, shudder: 0, spread: 0, }]),
                TYPE: "tank5mmRound",
            }
        },
        {
            POSITION: [2, 9, 1, 25, 0, 0, 0]
        },
	],
}
Class.tankAutoTurret2 = {
	PARENT: "autoTankGun",
	INDEPENDENT: true,
  COLOR: "#736245",
  HAS_NO_RECOIL: true,
	GUNS: [
		{
          POSITION: [30, 5, 1.3, -2, 4, 0, 0],
            PROPERTIES: {
                COLOR: "darkGrey",
            }
        },
        {
          POSITION: [30, 5, 1.3, -2, -4, 0, 0.5],
            PROPERTIES: {
                COLOR: "darkGrey",
            },
        },
      {
          POSITION: [40, 3, 1.3, -2, 4, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, { reload: 0.1, damage: 0.015, speed: 20, shudder: 0, spread: 0, }]),
                TYPE: "tank5mmRound",
            }
        },
        {
          POSITION: [40, 3, 1.3, -2, -4, 0, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, { reload: 0.1, damage: 0.015, speed: 20, shudder: 0, spread: 0, }]),
                TYPE: "tank5mmRound",
            },
          },
        {
            POSITION: [2, 18, 1, 25, 0, 0, 0]
        },
	],
}
Class.tankAutoTurret3 = {
	PARENT: "autoTankGun",
	INDEPENDENT: true,
  SHAPE: 0,
  COLOR: "darkGrey",
  HAS_NO_RECOIL: true,
  TURRETS: [
    {
      POSITION: [17, 0, 0, 0, 0, 1],
      TYPE: "uncoloredCircle",
      COLOR: "darkGrey",
      },
    ],
	GUNS: [
		{
			POSITION: [22, 5, 1, 0, 5, 0, 0.5],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic, g.flankGuard, g.flankGuard, g.autoTurret, {recoil: 0.2}]),
				TYPE: "bullet",
			},
		},
    {
			POSITION: [22, 5, 1, 0, -5, 0, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic, g.flankGuard, g.flankGuard, g.autoTurret, {recoil: 0.2}]),
				TYPE: "bullet",
			},
		},
	],
}
Class.tankAutoTurret4 = {
	PARENT: "autoTankGun",
	INDEPENDENT: true,
  SHAPE: 0,
  COLOR: "#736245",
  HAS_NO_RECOIL: true,
	GUNS: [
			{
          POSITION: [30, 9, 0.6, 0, 0, 0, 0],
            PROPERTIES: {
                COLOR: "darkGrey",
            }
        },
        {
          POSITION: [40, 6, 1.3, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, { reload: 0.1, damage: 0.01, speed: 20, shudder: 0, spread: 0, }]),
                TYPE: "tank5mmRound",
            }
        },
        {
            POSITION: [2, 9, 1, 25, 0, 0, 0]
        },
	],
}
Class.tankAutoTurret5 = {
	PARENT: "autoTankGun",
	INDEPENDENT: false,
  SHAPE: 0,
  COLOR: "#736245",
  HAS_NO_RECOIL: true,
  TURRETS: [
    {
      POSITION: [17, 0, 0, 0, 0, 1],
      TYPE: "uncoloredCircle",
      COLOR: "darkGrey",
      },
    {
      POSITION: [15, 0, 0, 0, 0, 1],
      TYPE: "uncoloredCircle",
      },
    ],
	GUNS: [
        {
            POSITION: [25, 8, 1, 0, 0, 0, 0]
        },
        {
            POSITION: [4, 10, 1, 8, 0, 0, 0]
        },
        {
            POSITION: [12, 10, 1, 25, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, { reload: 3, speed: 5, health: 2, damage: 2.2, shudder: 0.5, }]),
                TYPE: "BomberShells"
            }
        },
        {
            POSITION: [2, 11, 1, 34, 0, 0, 0]
        }
    ],
}
Class.tankAutoTurret6 = {
	PARENT: "autoTankGun",
	INDEPENDENT: false,
  COLOR: "#736245",
  HAS_NO_RECOIL: true,
  TURRETS: [
    {
      POSITION: [17, 0, 0, 0, 0, 1],
      TYPE: "uncoloredCircle",
      COLOR: "darkGrey",
      },
    {
      POSITION: [15, 0, 0, 0, 0, 1],
      TYPE: "uncoloredCircle",
      },
    ],
	GUNS: [
		{
          POSITION: [30, 5, 1.3, -2, 4, 0, 0],
            PROPERTIES: {
              COLOR: "darkGrey",
            }
        },
        {
          POSITION: [30, 5, 1.3, -2, -4, 0, 0.5],
            PROPERTIES: {
                COLOR: "darkGrey",
            },
        },
      {
          POSITION: [40, 3, 1.3, -2, 4, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, { reload: 0.1, damage: 0.015, speed: 20, shudder: 0, spread: 0, }]),
                TYPE: "tank5mmRound",
            }
        },
        {
          POSITION: [40, 3, 1.3, -2, -4, 0, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, { reload: 0.1, damage: 0.015, speed: 20, shudder: 0, spread: 0, }]),
                TYPE: "tank5mmRound",
            },
          },
        {
            POSITION: [2, 18, 1, 25, 0, 0, 0]
        },
	],
}
Class.krisTankTurret1 = {
	PARENT: "autoTankGun",
	INDEPENDENT: true,
  SHAPE: "M 0 0 C -0.4 0 -0.8 0 -1.2 0 C -1.2 -0.2 -1.2 -0.4 -1.2 -0.6 C -1.0333 -0.7333 -0.8667 -0.8667 -0.7 -1 C -0.0333 -1 0.6333 -1 1.3 -1 C 1.3 -0.9 1.3 -0.8 1.3 -0.7 C 1.2 -0.6333 1.1 -0.5667 1 -0.5 C 1 -0.1667 1 0.1667 1 0.5 C 1 0.5 1.3 0.7 1.3 0.7 C 1.3 0.8 1.3 0.9 1.3 1 C 0.6333 1 -0.0333 1 -0.7 1 C -0.8667 0.8667 -1.0333 0.7333 -1.2 0.6 C -1.2 0.4 -1.2 0.2 -1.2 0",
  COLOR: "darkGrey",
  HAS_NO_RECOIL: true,
  TURRETS: [
    {
      POSITION: [17, 0, 0, 0, 0, 1],
      TYPE: "uncoloredCircle",
      COLOR: "darkGrey",
      },
    {
      POSITION: [15, 0, 0, 0, 0, 1],
      TYPE: "uncoloredCircle",
      },
    ],
	GUNS: [
		{
          POSITION: [30, 5, 1.3, -2, 4, 0, 0],
            PROPERTIES: {
              COLOR: "darkGrey",
            }
        },
        {
          POSITION: [30, 5, 1.3, -2, -4, 0, 0.5],
            PROPERTIES: {
                COLOR: "darkGrey",
            },
        },
      {
          POSITION: [40, 3, 1.3, -2, 4, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, { reload: 0.1, damage: 0.015, speed: 20, shudder: 0, spread: 0, }]),
                TYPE: "tank5mmRound",
            }
        },
        {
          POSITION: [40, 3, 1.3, -2, -4, 0, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, { reload: 0.1, damage: 0.015, speed: 20, shudder: 0, spread: 0, }]),
                TYPE: "tank5mmRound",
            },
          },
        {
            POSITION: [2, 18, 1, 25, 0, 0, 0]
        },
	],
}
//BODIES
Class.attackPropellerBody1 = {
  COLOR: "grey",
  SHAPE: "M 0 0 C 1.4667 0 2.9333 0 4.4 0 C 4.6333 0.2 4.8667 0.4 5.1 0.6 C 3.4667 0.5 1.8333 0.4 0.2 0.3 C 0.1333 0.2 0.0667 0.1 0 0",
  MIRROR_MASTER_ANGLE: true,
};
Class.attackPropeller = {
    LABEL: "",
    COLOR: "darkGrey",
    SHAPE: 6,
    FACING_TYPE: "turnWithSpeed",
    CONTROLLERS: [['spin', { speed: 1 }]],
    INDEPENDENT: true,
    TURRETS: [
        {
            POSITION: [25, 0, 0, 0, 0, 0],
            TYPE: [ "attackPropellerBody1", ],
        },
        {
            POSITION: [25, 0, 0, 60, 0, 0],
            TYPE: [ "attackPropellerBody1", ],
        },
        {
            POSITION: [25, 0, 0, -60, 0, 0],
            TYPE: [ "attackPropellerBody1", ],
        },
        {
            POSITION: [25, 0, 0, -120, 0, 0],
            TYPE: [ "attackPropellerBody1", ],
        },
        {
            POSITION: [25, 0, 0, 120, 0, 0],
            TYPE: [ "attackPropellerBody1", ],
        },
        {
            POSITION: [25, 0, 0, 180, 0, 0],
            TYPE: [ "attackPropellerBody1", ],
        },
    ]
}
Class.propeller = {
  LABEL: "",
  FACING_TYPE: "turnWithSpeed",
  CONTROLLERS: [['spin', { speed: 3 }]],
  INDEPENDENT: true,
  GUNS: [
    {
      /*** LENGTH  WIDTH   ASPECT    X       Y     ANGLE   DELAY */
      POSITION: [50, 7, 1, 0, 0, 120, 0],
    },
    {
      POSITION: [50, 7, 1, 0, 0, -120, 0],
    },
    {
      POSITION: [50, 7, 1, 0, 0, 0, 0],
    },
    {
      /*** LENGTH  WIDTH   ASPECT    X       Y     ANGLE   DELAY */
      POSITION: [50, 7, 1, 0, 0, 60, 0],
    },
    {
      POSITION: [50, 7, 1, 0, 0, -60, 0],
    },
    {
      POSITION: [50, 7, 1, 0, 0, 180, 0],
    },
  ],
};
//MINIONS
Class.tankMinion = {
    PARENT: "minion",
    DANGER: 6,
    HAS_NO_RECOIL: true,
    BODY: {
        HEALTH: base.HEALTH * 2,
    },
    LABEL: "M.M.T",
    SHAPE: "M -1 -1 H 0 C 1 -1 1 0 1 0 C 1 0 1 1 0 1 H -1 V -1",
    GUNS: [
        {
            POSITION: [30, 8, 1, 0, 0, 0, 0]
        },
        {
            POSITION: [4, 8, -1.4, 8, 0, 0, 0]
        },
        {
            POSITION: [12, 8, 1.3, 30, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, { reload: 3, damage: 1.2, shudder: 0.5, }]),
                TYPE: "developerBullet"
            }
        },
        {
            POSITION: [2, 11, 1, 34, 0, 0, 0]
        }
    ],
    TURRETS: [
        {
            POSITION: [15, 0, 0, 0, 360, 1],
            TYPE: [ "latTop", { COLOR: "darkGrey", SHAPE: "M -1 -1 H 0 C 1 -1 1 0 1 0 C 1 0 1 1 0 1 H -1 V -1", } ],
        },
        {
            POSITION: [10, 0, 0, 0, 360, 1],
            TYPE: [ "latTop", { COLOR: "mirror", SHAPE: "M -1 -1 H 0 C 1 -1 1 0 1 0 C 1 0 1 1 0 1 H -1 V -1", } ],
        },
        {
            POSITION: [35, 0, 0, 0, 360, 0],
            TYPE: [ "TankBase", { COLOR: "mirror" } ],
        },
    ]
}
Class.literallyATankMinion = {
    PARENT: "minion",
    DANGER: 6,
    LAYER: 15,
    LABEL: "Literally a Tank",
    SHAPE: "M -1 -1 H 0 C 1 -1 1 0 1 0 C 1 0 1 1 0 1 H -1 V -1",
    GUNS: [
        {
            POSITION: [10, 8, 1, 0, 0, 0, 0]
        },
        {
            POSITION: [4, 8, -1.4, 8, 0, 0, 0]
        },
        {
            POSITION: [12, 8, 1.3, 10, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, { reload: 3, damage: 1.2, shudder: 0.5 }]),
                TYPE: "developerBullet"
            }
        },
        {
            POSITION: [2, 11, 1, 12, 0, 0, 0]
        }
    ],
    TURRETS: [
        {
            POSITION: [15, 0, 0, 0, 360, 1],
            TYPE: [ "propeller", { COLOR: "#5C533F" } ],
        },
    ]
}
//ENEMEIS
//BOSSES
Class.electricTankTop = {
SHAPE: "M -1 -1 H 0 C 1 0 1 0 1 0 C 1 0 2 1 2 1 H -1 V -1",
MIRROR_MASTER_ANGLE: true,
}
Class.electricTankDeco1 = {
    PARENT: "genericTank",
    LABEL: "Tank Deco",
    FACING_TYPE: ["turnWithSpeed"],
    COLOR: "grey",
    SHAPE: "M -1 -2 V 2 C -1 3 -1 2 -1 2 V -2 C -0.6667 -2.3333 -0.3333 -2.6667 0 -3 C 0.3333 -2.6667 0.6667 -2.3333 1 -2 C 1 -0.3333 1 1.3333 1 3 C 0.6667 3.3333 0.3333 3.6667 0 4 C -0.3333 3.6667 -0.6667 3.3333 -1 3",
    MIRROR_MASTER_ANGLE: true,
}
Class.electricTankDeco2 = {
    PARENT: "genericTank",
    LABEL: "Tank Deco",
    FACING_TYPE: ["turnWithSpeed"],
    COLOR: "grey",
    SHAPE: "M -2 0 H 2 C 2 0 2 -1 2 -1 C 2 -1 3 0 3 0 L 0 2 L -3 0 C -2.6667 -0.3333 -2.3333 -0.6667 -2 -1 C -2 -0.6667 -2 -0.3333 -2 0",
    MIRROR_MASTER_ANGLE: true,
}
Class.electricTankDeco3 = {
    PARENT: "genericTank",
    LABEL: "Tank Deco",
    FACING_TYPE: ["turnWithSpeed"],
    COLOR: "darkGrey",
    SHAPE: "M -10 -1 L 10 -1 L 8 0 C 10 1 10 1 10 1 L -10 1 C -9.3333 0.6667 -8.6667 0.3333 -8 0 L -10 -1",
    MIRROR_MASTER_ANGLE: true,
}
Class.electricTankDeco4 = {
    PARENT: "genericTank",
    LABEL: "Tank Deco",
    FACING_TYPE: ["turnWithSpeed"],
    COLOR: "darkGrey",
    SHAPE: [[1.7,0],[1.1,-1],[0,-0.6],[-1.1,-1],[-1,0],[-1.1,1],[0,0.6],[1.1,1]],
    MIRROR_MASTER_ANGLE: true,
}
Class.electricTankRight = {
    PARENT: "genericTank",
    LABEL: "Tank Side",
    FACING_TYPE: ["turnWithSpeed"],
    COLOR: "darkGrey",
    SHAPE: "M -6 0 H 5 V 1 C 4 2 4 2 4 2 H -5 V 2 C -5 2 -5 2 -6 1 C -6 0.6667 -6 0.3333 -6 0",
    MIRROR_MASTER_ANGLE: true,
    TURRETS: [
        {
            POSITION: [4.8, 31, 10, 0, 0, 1],
            TYPE: "electricTankDeco1",
        },
        {
            POSITION: [4.8, 24, 10, 0, 0, 1],
            TYPE: "electricTankDeco1",
        },
        {
            POSITION: [4.8, 17, 10, 0, 0, 1],
            TYPE: "electricTankDeco1",
        },
        {
            POSITION: [4.8, -42, 10, 0, 0, 1],
            TYPE: "electricTankDeco1",
        },
        {
            POSITION: [4.8, -35, 10, 0, 0, 1],
            TYPE: "electricTankDeco1",
        },
        {
            POSITION: [4.8, -28, 10, 0, 0, 1],
            TYPE: "electricTankDeco1",
        },
        {
            POSITION: [18, -5, 0, 0, 0, 1],
            TYPE: "electricTankDeco2",
        },
    ]
}
Class.electricTankLeft = {
    PARENT: "genericTank",
    LABEL: "Tank Side",
    FACING_TYPE: ["turnWithSpeed"],
    COLOR: "darkGrey",
    SHAPE: "M -5 0 H 6 V 1 C 5 2 5 2 5 2 H -4 C -5 1 -5 1 -5 1 V 0",
    MIRROR_MASTER_ANGLE: true,
    TURRETS: [
        {
            POSITION: [4.8, -31, 10, 0, 0, 1],
            TYPE: "electricTankDeco1",
        },
        {
            POSITION: [4.8, -24, 10, 0, 0, 1],
            TYPE: "electricTankDeco1",
        },
        {
            POSITION: [4.8, -17, 10, 0, 0, 1],
            TYPE: "electricTankDeco1",
        },
        {
            POSITION: [4.8, 42, 10, 0, 0, 1],
            TYPE: "electricTankDeco1",
        },
        {
            POSITION: [4.8, 35, 10, 0, 0, 1],
            TYPE: "electricTankDeco1",
        },
        {
            POSITION: [4.8, 28, 10, 0, 0, 1],
            TYPE: "electricTankDeco1",
        },
        {
            POSITION: [18, 5, 0, 0, 0, 1],
            TYPE: "electricTankDeco2",
        },
    ]
}
Class.electricTankBase = {
    PARENT: "genericTank",
    LABEL: "Electric Base",
    CONTROLLERS: ["turretWithMotion"],
    SHAPE: [[1.7,0],[1.1,-1],[0,-0.6],[-1.1,-1],[-1,0],[-1.1,1],[0,0.6],[1.1,1]],
    GUNS: [
        {
            POSITION: [16, 5.5, 1, 1, 6.5, 0, 0]
        },
        {
            POSITION: [14.5, 5.5, 1, 1, 6.5, 0, 0]
        },
        {
            POSITION: [13, 5.5, 1, 1, 6.5, 0, 0]
        },
        {
            POSITION: [16, 5.5, 1, 1, -6.5, 0, 0]
        },
        {
            POSITION: [14.5, 5.5, 1, 1, -6.5, 0, 0]
        },
        {
            POSITION: [13, 5.5, 1, 1, -6.5, 0, 0]
        },
        {
            POSITION: [13, 5.5, 1, 1, 6.5, 180, 0]
        },
        {
            POSITION: [11.5, 5.5, 1, 1, 6.5, 180, 0]
        },
        {
            POSITION: [10, 5.5, 1, 1, 6.5, 180, 0]
        },
        {
            POSITION: [8.5, 5.5, 1, 1, 6.5, 180, 0]
        },
        {
            POSITION: [13, 5.5, 1, 1, -6.5, 180, 0]
        },
        {
            POSITION: [11.5, 5.5, 1, 1, -6.5, 180, 0]
        },
        {
            POSITION: [10, 5.5, 1, 1, -6.5, 180, 0]
        },
        {
            POSITION: [8.5, 5.5, 1, 1, -6.5, 180, 0]
        },
    ],
    TURRETS: [
        {
            POSITION: [9, 10, -1.25, 90, 140, 1],
            TYPE: "tankAutoTurret3",
        },
        {
            POSITION: [9, 10, 1.25, -90, 140, 1],
            TYPE: "tankAutoTurret3",
        },
        {
            POSITION: [17, 0, 0, 0, 0, 1],
            TYPE: "electricTankDeco4",
        },
        {
            POSITION: [5.3, 0, -10, 0, 0, 1],
            TYPE: "electricTankLeft",
        },
        {
            POSITION: [5.3, 0, -10, 180, 0, 1],
            TYPE: "electricTankRight",
        },
        {
            POSITION: [2, 0, -1.4, 90, 0, 1],
            TYPE: "electricTankDeco3",
        },
    ]
}
Class.Daze = {
    PARENT: "genericTank",
    DANGER: 6,
    SIZE: 25,
    HAS_NO_RECOIL: true,
    BODY: {
        HEALTH: base.HEALTH * 100,
    },
    LABEL: "Daze",
    SHAPE: "M -1 -1 H 0 C 1 0 1 0 1 0 C 1 0 2 1 2 1 H -1 V -1",
    GUNS: [
        {
            POSITION: [30, 8, 1, 0, 6, 0, 0]
        },
        {
            POSITION: [12, 8, 1.3, 30, 6, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, { reload: 20, damage: 1.2, speed: 2, shudder: 0.5, }]),
                TYPE: "veryVolatileShells"
            }
        },
        {
            POSITION: [2, 11, 1, 34, 6, 0, 0]
        },
      {
      POSITION: [27, 8, 1, -5, -6, 0, 0]
        },
        {
            POSITION: [12, 8, 1.3, 20, -6, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, { reload: 4, damage: 1.2, speed: 2, shudder: 0.5, }]),
                TYPE: "tank5mmRound"
            }
        },
        {
            POSITION: [2, 11, 1, 24, -6, 0, 0]
        }
    ],
    TURRETS: [
        {
            POSITION: [15, 0, 0, 0, 360, 1],
            TYPE: [ "electricTankTop", { COLOR: "darkGrey",} ],
        },
        {
            POSITION: [10, 0, 0, 0, 360, 1],
            TYPE: [ "electricTankTop", ],
        },
        {
            POSITION: [35, 0, 0, 0, 360, 0],
            TYPE: [ "electricTankBase", ],
        },
    ]
}
Class.autoLatBase = {
    PARENT: "genericTank",
    LABEL: "Tank Base",
    CONTROLLERS: ["turretWithMotion"],
    COLOR: "#96794E",
    SHAPE: [
        [1.1, 1],
        [1.4, 0],
        [1.1, -1],
        [-1.1, -1],
        [-0.8, 0],
        [-1.1, 1]
    ],
    GUNS: [
      {
			POSITION: [10, 3, 0, 1, 0, -90, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.trap, g.greaterSize, g.superHealth, g.halfDamage, g.lesserDamage, {recoil: 150.2, reload: 5, speed: 0.2,}]),
				TYPE: "trap",
        AUTOFIRE: true,
        COLOR: "#5C533F",
			  },
        }, 
        {
      POSITION: [10, 3, 0, 1, 8, -90, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.trap, g.greaterSize, g.superHealth, g.halfDamage, g.lesserDamage, {recoil: 150.2, reload: 5, speed: 0.2,}]),
				TYPE: "trap",
        AUTOFIRE: true,
        COLOR: "#5C533F",
			  },
        }, 
        {
      POSITION: [10, 3, 0, 1, 4, -90, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.trap, g.greaterSize, g.superHealth, g.halfDamage, g.lesserDamage, {recoil: 150.2, reload: 5, speed: 0.2,}]),
				TYPE: "trap",
        AUTOFIRE: true,
        COLOR: "#5C533F",
			  },
        }, 
        {
      POSITION: [10, 3, 0, 1, 0, 90, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.trap, g.greaterSize, g.superHealth, g.halfDamage, g.lesserDamage, {recoil: 150.2, reload: 5, speed: 0.2,}]),
				TYPE: "trap",
        AUTOFIRE: true,
        COLOR: "#5C533F",
			  },
        }, 
        {
      POSITION: [10, 3, 0, 1, 8, 90, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.trap, g.greaterSize, g.superHealth, g.halfDamage, g.lesserDamage, {recoil: 150.2, reload: 5, speed: 0.2,}]),
				TYPE: "trap",
        AUTOFIRE: true,
        COLOR: "#5C533F",
			  },
        }, 
        {
      POSITION: [10, 3, 0, 1, 4, 90, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.trap, g.greaterSize, g.superHealth, g.halfDamage, g.lesserDamage, {recoil: 150.2, reload: 5, speed: 0.2,}]),
				TYPE: "trap",
        AUTOFIRE: true,
        COLOR: "#5C533F",
			  },
        }, 
        {
      POSITION: [10, 3, 0, 1, -8, 90, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.trap, g.greaterSize, g.superHealth, g.halfDamage, g.lesserDamage, {recoil: 150.2, reload: 5, speed: 0.2,}]),
				TYPE: "trap",
        AUTOFIRE: true,
        COLOR: "#5C533F",
			  },
        }, 
        {
      POSITION: [10, 3, 0, 1, -4, 90, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.trap, g.greaterSize, g.superHealth, g.halfDamage, g.lesserDamage, {recoil: 150.2, reload: 5, speed: 0.2,}]),
				TYPE: "trap",
        AUTOFIRE: true,
        COLOR: "#5C533F",
			  },
        }, 
        {
      POSITION: [10, 3, 0, 1, -8, -90, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.trap, g.greaterSize, g.superHealth, g.halfDamage, g.lesserDamage, {recoil: 150.2, reload: 5, speed: 0.2,}]),
				TYPE: "trap",
        AUTOFIRE: true,
        COLOR: "#5C533F",
			  },
        }, 
        {
      POSITION: [10, 3, 0, 1, -4, -90, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.trap, g.greaterSize, g.superHealth, g.halfDamage, g.lesserDamage, {recoil: 150.2, reload: 5, speed: 0.2,}]),
				TYPE: "trap",
        AUTOFIRE: true,
        COLOR: "#5C533F",
			  },
        }, 
        {
            POSITION: [16, 5.5, 1, 1, 6.5, 0, 0]
        },
        {
            POSITION: [14.5, 5.5, 1, 1, 6.5, 0, 0]
        },
        {
            POSITION: [13, 5.5, 1, 1, 6.5, 0, 0]
        },
        {
            POSITION: [16, 5.5, 1, 1, -6.5, 0, 0]
        },
        {
            POSITION: [14.5, 5.5, 1, 1, -6.5, 0, 0]
        },
        {
            POSITION: [13, 5.5, 1, 1, -6.5, 0, 0]
        },
        {
            POSITION: [13, 5.5, 1, 1, 6.5, 180, 0]
        },
        {
            POSITION: [11.5, 5.5, 1, 1, 6.5, 180, 0]
        },
        {
            POSITION: [10, 5.5, 1, 1, 6.5, 180, 0]
        },
        {
            POSITION: [8.5, 5.5, 1, 1, 6.5, 180, 0]
        },
        {
            POSITION: [13, 5.5, 1, 1, -6.5, 180, 0]
        },
        {
            POSITION: [11.5, 5.5, 1, 1, -6.5, 180, 0]
        },
        {
            POSITION: [10, 5.5, 1, 1, -6.5, 180, 0]
        },
        {
            POSITION: [8.5, 5.5, 1, 1, -6.5, 180, 0]
        },
    ],
    TURRETS: [
        {
            POSITION: [5.3, 0, -10, 0, 0, 1],
            TYPE: "latLeft",
        },
        {
            POSITION: [5.3, 0, -10, 180, 0, 1],
            TYPE: "latRight",
        },
        {
            POSITION: [2, 0, -1.4, 90, 0, 1],
            TYPE: "latDeco3",
        },
        {
          POSITION: [4, 12.5, 7.75, 180, 180, 1],
            TYPE: "tankAutoTurret1",
        },
        {
            POSITION: [4, 12.5, -7.75, 180, 180, 1],
            TYPE: "tankAutoTurret1",
        },
        {
            POSITION: [4, 15, 7.75, 0, 180, 1],
            TYPE: "tankAutoTurret1",
        },
        {
            POSITION: [4, 15, -7.75, 0, 180, 1],
            TYPE: "tankAutoTurret1",
        },
        {
            POSITION: [6, 10, 0, 180, 180, 1],
            TYPE: "tankAutoTurret2",
        },
        {
          POSITION: [6, 10, 0, 0, 260, 1],
            TYPE: "tankAutoTurret2",
        },
    ]
}
Class.HAGU = {
PARENT: "genericTank",
DANGER: 6,
SIZE: 30,
HAS_NO_RECOIL: true,
LAYER: 10,
BODY: {
HEALTH: base.HEALTH * 400,
},
LABEL: "H.A.G.U",
SHAPE: "M -1 -1 H 0 C 1 -1 1 0 1 0 C 1 0 1 1 0 1 H -1 V -1",
GUNS: [
    {
        POSITION: [0, 10, 0, 1, 0, 180, 0], // <-- Added a comma here
        PROPERTIES: {                       // <-- Removed the }, that was right above this
            SHOOT_SETTINGS: combineStats([g.spawner, {recoil: 150.2, health: 1, reload: 5, speed: 1,}]),
            TYPE: "literallyATankMinion",
            MAX_CHILDREN: 2,
            COLOR: "#5C533F",
        }, 
    },
      {
        POSITION: [0, 10, 0, 1, 0, 180, 0],
       PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.spawner, {recoil: 150.2, health: 5, reload: 5, speed: 1,}]),
          TYPE: "tankMinion",
          MAX_CHILDREN: 3,
          COLOR: "#5C533F",
    },
    }, 
      {
       POSITION: [40, 3, 1.3, -2, 3, 0, 0],
          PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.basic, { reload: 0.1, damage: 1, speed: 20, shudder: 0, spread: 0, }]),
          TYPE: "tank5mmRound",
          COLOR: "darkGrey",
    }
    },
    {
       POSITION: [40, 3, 1.3, -2, -3, 0, 0.5],
          PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.basic, { reload: 0.1, damage: 1, speed: 20, shudder: 0, spread: 0, }]),
          TYPE: "tank5mmRound",
          COLOR: "darkGrey",
    },
    },
    {
            POSITION: [2, 12, 1, 25, 0, 0, 0]
},
{
POSITION: [30, 8, 1, 0, 0, 0, 0]
},
{
POSITION: [4, 8, -1.4, 8, 0, 0, 0]
},
{
POSITION: [4, 6, -1.4, 8, 0, 0, 0],
PROPERTIES: { 
COLOR: "darkGrey",
},
},
{
POSITION: [12, 8, 1.3, 30, 0, 0, 0],
PROPERTIES: {
SHOOT_SETTINGS: combineStats([g.basic, { reload: 6, speed: 2, health: 25, damage: 11.2, shudder: 0.5 }]),
TYPE: "flankMissile"
}
},
{
POSITION: [2, 11, 1, 34, 0, 0, 0]
},
{
POSITION: [2, 11, 1, 34, 0, 0, 0],
PROPERTIES: { 
COLOR: "darkGrey",
},
}
],
TURRETS: [
{
POSITION: [15, 0, 0, 0, 360, 1],
TYPE: [ "latTop", { COLOR: "#5C533F" } ],
},
{
POSITION: [10, 0, 0, 0, 360, 1],
TYPE: [ "latTop", { COLOR: "#736245" } ],
},
{
POSITION: [5, 0, 0, 0, 360, 1],
TYPE: [ "latTop", ],
},
{
POSITION: [35, 0, 0, 0, 360, 0],
TYPE: [ "autoLatBase", { COLOR: "#96794E" } ],
},
]
}
Class.TTV1 = {
    PARENT: "genericTank",
    DANGER: 6,
    HAS_NO_RECOIL: true,
    BODY: {
        HEALTH: base.HEALTH * 1.2,
    },
    LABEL: "TT V1",
    SHAPE: "M -1 -1 H 0 C 1 -1 1 0 1 0 C 1 0 1 1 0 1 H -1 V -1",
    GUNS: [
        {
            POSITION: [30, 5, 1, 0, 5, 0, 0]
        },
        {
            POSITION: [4, 5, -1.4, 8, 5, 0, 0]
        },
        {
            POSITION: [12, 5, 1.3, 30, 5, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, { reload: 3, damage: 1.2, shudder: 0.5 }]),
                TYPE: "developerBullet"
            }
        },
        {
            POSITION: [2, 9, 1, 34, 5, 0, 0]
        },
      {
            POSITION: [30, 5, 1, 0, -5, 0, 0]
        },
        {
            POSITION: [4, 5, -1.4, 8, -5, 0, 0]
        },
        {
            POSITION: [12, 5, 1.3, 30, -5, 0, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, { reload: 3, damage: 1.2, shudder: 0.5 }]),
                TYPE: "developerBullet"
            }
        },
        {
            POSITION: [2, 9, 1, 34, -5, 0, 0]
        }
    ],
    TURRETS: [
        {
            POSITION: [15, 0, 0, 0, 360, 1],
            TYPE: [ "latTop", { COLOR: "darkGrey" } ],
        },
        {
            POSITION: [10, 0, 0, 0, 360, 1],
            TYPE: [ "latTop", { COLOR: "grey" } ],
        },
        {
            POSITION: [35, 0, 0, 0, 360, 0],
            TYPE: [ "TankBase", { COLOR: "#96794E" } ],
        },
    ]
}
Class.krisTankTop = {
SHAPE: "M -1 -1 H 2 C 2 -1 2 -1 2 -1 C 1.9 -0.9 1.8 -0.8 1.7 -0.7 C 1.7 -0.2333 1.7 0.2333 1.7 0.7 C 1.8 0.8 1.9 0.9 2 1 C 2 1 2 1 2 1 H -1 C -1.1667 0.8667 -1.3333 0.7333 -1.5 0.6 V -0.7 C -1.3333 -0.8 -1.1667 -0.9 -1 -1",
MIRROR_MASTER_ANGLE: true,
}
Class.krisTankDeco1 = {
    PARENT: "genericTank",
    LABEL: "Tank Deco",
    FACING_TYPE: ["turnWithSpeed"],
    COLOR: "orange",
    SHAPE: "M 0 0 C 0 4 0 4 0 4 C -5 3 -5 3 -5 3 C -5.3333 2 -5.6667 1 -6 0 C -5.6667 -0.6667 -5.3333 -1.3333 -5 -2 C -5 -2 0 -4 0 -4 C 0 -0.6667 0 1.6667 0 4 C 0 4 5 3 5 3 C 5 3 6 0 6 0 C 5.6667 -0.6667 5.3333 -1.3333 5 -2 C 5 -2 0 -4 0 -4",
    MIRROR_MASTER_ANGLE: true,
}
Class.krisTankDeco2 = {
    PARENT: "genericTank",
    LABEL: "Tank Deco",
    FACING_TYPE: ["turnWithSpeed"],
    COLOR: "darkGrey",
    SHAPE: "M -2 0 H 2 C 2 0 8 0 8 0 C 8 0 2 1 2 1 L 0 2 L -2 1 C -8 0 -8 0 -8 0 C -8 0 -2 0 -2 0 C -1.3333 -0.3333 -0.6667 -0.6667 0 -1 C 0.6667 -0.6667 1.3333 -0.3333 2 0",
    MIRROR_MASTER_ANGLE: true,
}
Class.krisTankDeco3 = {
    PARENT: "genericTank",
    LABEL: "Tank Deco",
    FACING_TYPE: ["turnWithSpeed"],
    COLOR: "orange",
    SHAPE: "M -10 -1 L 10 -1 L 8 0 C 10 1 10 1 10 1 C 6.6667 1.6667 3.3333 2.3333 0 3 L -10 1 C -9.3333 0.6667 -8.6667 0.3333 -8 0 L -10 -1 C -10 -1 0 -3 0 -3 C 0 -3 10 -1 10 -1 C 3.3333 -1 -3.3333 -1 -10 -1",
    MIRROR_MASTER_ANGLE: true,
}
Class.krisTankDeco4 = {
    PARENT: "genericTank",
    LABEL: "Tank Deco",
    FACING_TYPE: ["turnWithSpeed"],
    COLOR: "darkGrey",
    SHAPE: [[2.5,0],[2,-1],[0,-0.6],[-1.1,-1],[-1.25,0],[-1.1,1],[0,0.6],[2,1]],
    MIRROR_MASTER_ANGLE: true,
}
Class.krisTankRight = {
    PARENT: "genericTank",
    LABEL: "Tank Side",
    FACING_TYPE: ["turnWithSpeed"],
    COLOR: "darkGrey",
    SHAPE: "M -6 0 H 5 V 1 C 4 2 4 2 4 2 H -5 V 2 C -5 2 -5 2 -6 1 C -6 0.6667 -6 0.3333 -6 0 C -6 0 -6 -1 -6 -1 C -5.6667 -0.6667 -5.3333 -0.3333 -5 0 C -1.6667 0 1.6667 0 5 0 C 5 -0.3333 5 -0.6667 5 -1 C 4.6667 -0.6667 4.3333 -0.3333 4 0",
    MIRROR_MASTER_ANGLE: true,
    TURRETS: [
        {
            POSITION: [4.8, 31, 10, 0, 0, 1],
            TYPE: "krisTankDeco1",
        },
        {
            POSITION: [4.8, 24, 10, 0, 0, 1],
            TYPE: "krisTankDeco1",
        },
        {
            POSITION: [4.8, 17, 10, 0, 0, 1],
            TYPE: "krisTankDeco1",
        },
        {
            POSITION: [4.8, -42, 10, 0, 0, 1],
            TYPE: "krisTankDeco1",
        },
        {
            POSITION: [4.8, -35, 10, 0, 0, 1],
            TYPE: "krisTankDeco1",
        },
        {
            POSITION: [4.8, -28, 10, 0, 0, 1],
            TYPE: "krisTankDeco1",
        },
        {
            POSITION: [18, -5, 0, 0, 0, 1],
            TYPE: "krisTankDeco2",
        },
    ]
}
Class.krisTankLeft = {
    PARENT: "genericTank",
    LABEL: "Tank Side",
    FACING_TYPE: ["turnWithSpeed"],
    COLOR: "darkGrey",
    SHAPE: "M -5 0 H 6 V 1 C 5 2 5 2 5 2 H -4 C -5 1 -5 1 -5 1 V 0 C -5 -0.3333 -5 -0.6667 -5 -1 C -4.6667 -0.6667 -4.3333 -0.3333 -4 0 C -1 0 2 0 5 0 C 5.3333 -0.3333 5.6667 -0.6667 6 -1 C 6 -0.6667 6 -0.3333 6 0",
    MIRROR_MASTER_ANGLE: true,
    TURRETS: [
        {
            POSITION: [4.8, -31, 10, 0, 0, 1],
            TYPE: "krisTankDeco1",
        },
        {
            POSITION: [4.8, -24, 10, 0, 0, 1],
            TYPE: "krisTankDeco1",
        },
        {
            POSITION: [4.8, -17, 10, 0, 0, 1],
            TYPE: "krisTankDeco1",
        },
        {
            POSITION: [4.8, 42, 10, 0, 0, 1],
            TYPE: "krisTankDeco1",
        },
        {
            POSITION: [4.8, 35, 10, 0, 0, 1],
            TYPE: "krisTankDeco1",
        },
        {
            POSITION: [4.8, 28, 10, 0, 0, 1],
            TYPE: "krisTankDeco1",
        },
        {
            POSITION: [18, 5, 0, 0, 0, 1],
            TYPE: "krisTankDeco2",
        },
    ]
}
Class.krisTankBase = {
    PARENT: "genericTank",
    LABEL: "Electric Base",
    CONTROLLERS: ["turretWithMotion"],
    SHAPE: [[1.25,0],[1.1,-1],[0,-0.6],[-1.1,-1],[-1.5,0],[-1.1,1],[0,0.6],[1.1,1]],
    GUNS: [
        {
            POSITION: [16, 5.5, 1, 1, 6.5, 0, 0]
        },
        {
            POSITION: [14.5, 5.5, 1, 1, 6.5, 0, 0]
        },
        {
            POSITION: [13, 5.5, 1, 1, 6.5, 0, 0]
        },
        {
            POSITION: [16, 5.5, 1, 1, -6.5, 0, 0]
        },
        {
            POSITION: [14.5, 5.5, 1, 1, -6.5, 0, 0]
        },
        {
            POSITION: [13, 5.5, 1, 1, -6.5, 0, 0]
        },
        {
            POSITION: [13, 5.5, 1, 1, 6.5, 180, 0]
        },
        {
            POSITION: [11.5, 5.5, 1, 1, 6.5, 180, 0]
        },
        {
            POSITION: [10, 5.5, 1, 1, 6.5, 180, 0]
        },
        {
            POSITION: [8.5, 5.5, 1, 1, 6.5, 180, 0]
        },
        {
          POSITION: [8.5, 5.5, 1, 1, 6.5, 180, 0, 1]
        },
        {
            POSITION: [13, 5.5, 1, 1, -6.5, 180, 0]
        },
        {
            POSITION: [11.5, 5.5, 1, 1, -6.5, 180, 0]
        },
        {
            POSITION: [10, 5.5, 1, 1, -6.5, 180, 0]
        },
        {
            POSITION: [8.5, 5.5, 1, 1, -6.5, 180, 0]
        },
    ],
    TURRETS: [
        {
            POSITION: [17, 0, 0, 0, 0, 1],
            TYPE: "krisTankDeco4",
        },
        {
            POSITION: [5.3, 0, -10, 0, 0, 1],
            TYPE: "krisTankLeft",
        },
        {
            POSITION: [5.3, 0, -10, 180, 0, 1],
            TYPE: "krisTankRight",
        },
        {
            POSITION: [2, 0, -1.4, 90, 0, 1],
            TYPE: "krisTankDeco3",
        },
      {
            POSITION: [8, 13, 0, 0, 360, 1],
            TYPE: "krisTankTurret1",
        },
    ]
}
Class.krisButTank = {
    PARENT: "genericTank",
    HAS_NO_RECOIL: true,
    DANGER: 6,
    SIZE: 30,
    BODY: {
        HEALTH: base.HEALTH * 200,
    },
    LABEL: "Kris's Hellbringer",
    SHAPE: "M -1 -1 H 2 C 2 -1 2 -1 2 -1 C 1.9 -0.9 1.8 -0.8 1.7 -0.7 C 1.7 -0.2333 1.7 0.2333 1.7 0.7 C 1.8 0.8 1.9 0.9 2 1 C 2 1 2 1 2 1 H -1 C -1.1667 0.8667 -1.3333 0.7333 -1.5 0.6 V -0.7 C -1.3333 -0.8 -1.1667 -0.9 -1 -1",
    GUNS: [
        {
          POSITION: [0, 10, 0, 1, 0, 180, 0],
       PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.spawner, {recoil: 0, health: 100, reload: 1, speed: 2, size: 2,}]),
          TYPE: "krisMinion",
          MAX_CHILDREN: 1,
    },
    }, 
      {
          POSITION: [17, 2, 1, 0, 5, 180, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, { reload: 4, damage: 3, speed: 6, shudder: 0.5 }]),
                TYPE: "homingflankMissile"
            }
        },
        {
          POSITION: [17, 2, 1, 0, -5, 180, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, { reload: 1, damage: 3, speed: 6, shudder: 0.5 }]),
                TYPE: "homingflankMissile"
            }
        },
        {
            POSITION: [30, 5, 1, 0, 6, 0, 0],
            PROPERTIES: {
                COLOR: "darkGrey",
        },
        },
        {
            POSITION: [12, 6, 1, 30, 6, 0, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, { reload: 7, damage: 3, speed: 2, shudder: 0.5 }]),
                TYPE: "volatileShells"
            }
        },
        {
            POSITION: [2, 7, 1, 34, 6, 0, 0]
        },
      {
            POSITION: [30, 5, 1, 0, -6, 0, 0],
            PROPERTIES: {
                COLOR: "darkGrey",
        },
        },
        {
            POSITION: [12, 6, 1, 30, -6, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, { reload: 7, damage: 3, speed: 2, shudder: 0.5 }]),
                TYPE: "volatileShells"
            }
        },
        {
            POSITION: [2, 7, 1, 34, -6, 0, 0],
          },
        {
            POSITION: [15, 6, 1, 8, -6, 0, 0]
          },
        {
            POSITION: [15, 6, 1, 8, 6, 0, 0]
        }
    ],
    TURRETS: [
        {
            POSITION: [15, 0, 0, 0, 360, 1],
            TYPE: [ "krisTankTop", { COLOR: "darkGrey" } ],
        },
        {
            POSITION: [10, 0, 0, 0, 360, 1],
            TYPE: [ "krisTankTop", { COLOR: "mirror" } ],
        },
        {
            POSITION: [35, 0, 0, 0, 360, 0],
            TYPE: [ "krisTankBase", { COLOR: "mirror" } ],
        },
    ]
}
//Playable Tanks
Class.TTV2 = {
    PARENT: "genericActualTank",
    HAS_NO_RECOIL: true,
    DANGER: 6,
    BODY: {
        HEALTH: base.HEALTH * 1.2,
    },
    LABEL: "TT V2",
    SHAPE: "M -1 -1 H 0 C 1 -1 1 0 1 0 C 1 0 1 1 0 1 H -1 V -1",
    GUNS: [
        {
            POSITION: [30, 5, 1, 0, 5, 0, 0]
        },
        {
            POSITION: [4, 5, -1.4, 8, 5, 0, 0]
        },
        {
            POSITION: [12, 5, 1.3, 30, 5, 0, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.triplet, { reload: 3, damage: 1.2, shudder: 0.5 }]),
                TYPE: "developerBullet"
            }
        },
        {
            POSITION: [2, 9, 1, 34, 5, 0, 0]
        },
      {
            POSITION: [30, 5, 1, 0, -5, 0, 0]
        },
        {
            POSITION: [4, 5, -1.4, 8, -5, 0, 0]
        },
        {
            POSITION: [12, 5, 1.3, 30, -5, 0, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.triplet, { reload: 3, damage: 1.2, shudder: 0.5 }]),
                TYPE: "developerBullet"
            }
        },
        {
            POSITION: [2, 9, 1, 34, -5, 0, 0]
          },
      {
            POSITION: [35, 5, 1, 0, 0, 0, 0]
        },
        {
            POSITION: [4, 5, -1.4, 8, 0, 0, 0]
        },
        {
            POSITION: [12, 5, 1.3, 35, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.triplet, { reload: 3, damage: 1.2, shudder: 0.5 }]),
                TYPE: "developerBullet"
            }
        },
        {
            POSITION: [2, 9, 1, 39, 0, 0, 0]
        }
    ],
    TURRETS: [
        {
            POSITION: [15, 0, 0, 0, 360, 1],
            TYPE: [ "latTop", { COLOR: "darkGrey" } ],
        },
        {
            POSITION: [10, 0, 0, 0, 360, 1],
            TYPE: [ "latTop", { COLOR: "grey" } ],
        },
        {
            POSITION: [35, 0, 0, 0, 360, 0],
            TYPE: [ "TankBase", { COLOR: "mirror" } ],
        },
    ]
}
Class.TM = {
    PARENT: "genericActualTank",
    DANGER: 6,
    HAS_NO_RECOIL: true,
    LABEL: "T.M",
    SHAPE: "M -1 -1 H 0 C 1 -1 1 0 1 0 C 1 0 1 1 0 1 H -1 V -1",
    GUNS: [
        {
          POSITION: [30, 5, 1.3, -2, 4, 0, 0],
            PROPERTIES: {
                COLOR: "darkGrey",
            }
        },
        {
          POSITION: [30, 5, 1.3, -2, -4, 0, 0.5],
            PROPERTIES: {
                COLOR: "darkGrey",
            },
        },
      {
          POSITION: [40, 3, 1.3, -2, 4, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, { reload: 0.1, damage: 0.015, speed: 20, shudder: 0, spread: 0, }]),
                TYPE: "tank5mmRound",
            }
        },
        {
          POSITION: [40, 3, 1.3, -2, -4, 0, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, { reload: 0.1, damage: 0.015, speed: 20, shudder: 0, spread: 0, }]),
                TYPE: "tank5mmRound",
            },
          },
        {
            POSITION: [2, 18, 1, 25, 0, 0, 0]
        },
    ],
    TURRETS: [
        {
            POSITION: [15, 0, 0, 0, 360, 1],
            TYPE: [ "latTop", { COLOR: "darkGrey" } ],
        },
        {
            POSITION: [10, 0, 0, 0, 360, 1],
            TYPE: [ "latTop", { COLOR: "grey" } ],
        },
        {
            POSITION: [35, 0, 0, 0, 360, 0],
            TYPE: [ "TankBase", { COLOR: "mirror" } ],
        },
    ]
}
Class.PT = {
    PARENT: "genericActualTank",
    DANGER: 6,
    HAS_NO_RECOIL: true,
    SIZE: 20,
    BODY: {
        HEALTH: base.HEALTH * 1.2,
    },
    LABEL: "P.T",
    SHAPE: "M -1 -1 H 0 C 1 -1 1 0 1 0 C 1 0 1 1 0 1 H -1 V -1",
    GUNS: [
        {
            POSITION: [20, 8, 1, 0, 0, 0, 0]
        },
        {
            POSITION: [4, 8, -1.4, 8, 0, 0, 0]
        },
        {
          POSITION: [16, 14, 1.7, 0, 0, 180, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, { reload: 10, size: 0.8, damage: 1.2, shudder: 0.5, }]),
                TYPE: "tankMinion",
                MAX_CHILDREN: 3,
            }
        },
        {
            POSITION: [12, 8, 1.5, 25, 0, 0, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, { reload: 3, size: 1.2, speed: 3, damage: 1.2, shudder: 0.5, }]),
                TYPE: "developerBullet"
            }
        },
        {
          POSITION: [12, 8, 1.3, 20, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, { reload: 3, damage: 1.2, speed: 3, shudder: 0.5, }]),
                TYPE: "developerBullet"
            }
        },
        {
            POSITION: [2, 11, 1, 24, 0, 0, 0]
        }
    ],
    TURRETS: [
        {
            POSITION: [15, 0, 0, 0, 360, 1],
            TYPE: [ "latTop", { COLOR: "darkGrey" } ],
        },
        {
            POSITION: [10, 0, 0, 0, 360, 1],
            TYPE: [ "latTop", { COLOR: "grey" } ],
        },
        {
            POSITION: [35, 0, 0, 0, 360, 0],
            TYPE: [ "TankBase", { COLOR: "mirror" } ],
        },
    ]
}
Class.MG = {
    PARENT: "genericActualTank",
    DANGER: 6,
    HAS_NO_RECOIL: true,
    BODY: {
        HEALTH: base.HEALTH * 1.2,
    },
    LABEL: "M.G",
    SHAPE: "M -1 -1 H 0 C 1 -1 1 0 1 0 C 1 0 1 1 0 1 H -1 V -1",
    GUNS: [
        {
          POSITION: [20, 2, 1.3, -5, 8, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, { reload: 0.1, damage: 0.01, speed: 20, shudder: 0, spread: 0, }]),
                TYPE: "tank5mmRound",
                COLOR: "darkGrey",
            }
        },
        {
            POSITION: [30, 8, 1, 0, 0, 0, 0]
        },
        {
            POSITION: [4, 8, -1.4, 8, 0, 0, 0]
        },
        {
            POSITION: [12, 8, 1.3, 30, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, { reload: 3, damage: 1.2, shudder: 0.5, }]),
                TYPE: "developerBullet"
            }
        },
        {
            POSITION: [2, 11, 1, 34, 0, 0, 0]
        }
    ],
    TURRETS: [
        {
            POSITION: [15, 0, 0, 0, 360, 1],
            TYPE: [ "latTop", { COLOR: "darkGrey" } ],
        },
        {
            POSITION: [10, 0, 0, 0, 360, 1],
            TYPE: [ "latTop", { COLOR: "grey" } ],
        },
        {
            POSITION: [35, 0, 0, 0, 360, 0],
            TYPE: [ "TankBase", { COLOR: "mirror" } ],
        },
    ]
}
Class.Legalizenuclearbombs = {
    PARENT: "genericActualTank",
    DANGER: 6,
    HAS_NO_RECOIL: true,
    BODY: {
        HEALTH: base.HEALTH * 1.2,
    },
    LABEL: "Legalizenuclearbombs",
    SHAPE: "M -1 -1 H 0 C 1 -1 1 0 1 0 C 1 0 1 1 0 1 H -1 V -1",
    GUNS: [
        {
            POSITION: [30, 15, 1, 0, 0, 0, 0]
        },
        {
            POSITION: [4, 15, -1.4, 8, 0, 0, 0]
        },
        {
            POSITION: [12, 15, 1.3, 30, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, { reload: 3, damage: 1.2, shudder: 0.5, }]),
                TYPE: "nuclearmissile"
            }
        },
        {
            POSITION: [2, 20, 1, 34, 0, 0, 0]
        }
    ],
    TURRETS: [
        {
            POSITION: [15, 0, 0, 0, 360, 1],
            TYPE: [ "latTop", { COLOR: "darkGrey" } ],
        },
        {
            POSITION: [10, 0, 0, 0, 360, 1],
            TYPE: [ "tankAutoTurret4", { COLOR: "grey" } ],
        },
        {
            POSITION: [35, 0, 0, 0, 360, 0],
            TYPE: [ "TankBase", { COLOR: "mirror" } ],
        },
    ]
}
// This creates the missing decorative circle so the server doesn't crash!
Class.latTop = {
    PARENT: "genericEntity",
    SHAPE: 0,
};

Class.MMT = {
    PARENT: "genericActualTank",
    DANGER: 6,
    HAS_NO_RECOIL: true,
    BODY: {
        HEALTH: base.HEALTH * 1.2,
    },
    LABEL: "M.M.T",
    SHAPE: "M -1 -1 H 0 C 1 -1 1 0 1 0 C 1 0 1 1 0 1 H -1 V -1",
    GUNS: [
        {
          POSITION: [20, 2, 1.3, -5, 8, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, { reload: 0.1, damage: 0.01, speed: 20, shudder: 0, spread: 0, }]),
                TYPE: "tank5mmRound",
                COLOR: "darkGrey",
            }
        },
        {
            POSITION: [30, 8, 1, 0, 0, 0, 0],
        },
        {
            POSITION: [4, 8, -1.4, 8, 0, 0, 0],
        },
        {
            POSITION: [12, 8, 1.3, 30, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, { reload: 3, damage: 1.2, shudder: 0.5, }]),
                TYPE: "developerBullet"
            }
        },
        {
            POSITION: [2, 11, 1, 34, 0, 0, 0]
        }
    ],
    TURRETS: [
        {
            POSITION: [15, 0, 0, 0, 360, 1],
            TYPE: [ "latTop", { COLOR: "darkGrey" } ],
        },
        {
            POSITION: [10, 0, 0, 0, 360, 1],
            TYPE: [ "latTop", { COLOR: "grey" } ],
        },
        {
            POSITION: [35, 0, 0, 0, 360, 0],
            TYPE: [ "TankBase", { COLOR: "mirror" } ],
        },
    ]
}
Class.ES = {
    PARENT: "genericActualTank",
    DANGER: 6,
    HAS_NO_RECOIL: true,
    BODY: {
        HEALTH: base.HEALTH * 1.2,
    },
    LABEL: "E.S",
    SHAPE: "M -1 -1 H 0 C 1 -1 1 0 1 0 C 1 0 1 1 0 1 H -1 V -1",
    GUNS: [
        {
            POSITION: [30, 8, 1, 0, 0, 0, 0]
        },
        {
          POSITION: [30, 2, 1, 0, 0, 0, 0],
          COLOR: "red",
        },
        {
            POSITION: [4, 8, -1.4, 8, 0, 0, 0]
        },
        {
            POSITION: [12, 8, 1.3, 30, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, { reload: 3, damage: 1.2, speed: 2, shudder: 0.5, }]),
                TYPE: "volatileShells"
            }
        },
        {
            POSITION: [2, 11, 1, 34, 0, 0, 0]
        }
    ],
    TURRETS: [
        {
            POSITION: [15, 0, 0, 0, 360, 1],
            TYPE: [ "latTop", { COLOR: "darkGrey" } ],
        },
        {
            POSITION: [10, 0, 0, 0, 360, 1],
            TYPE: [ "latTop", { COLOR: "grey" } ],
        },
        {
            POSITION: [35, 0, 0, 0, 360, 0],
            TYPE: [ "TankBase", { COLOR: "mirror" } ],
        },
    ]
}
//HELE
Class.HeliDeco1 = {
    PARENT: "genericTank",
    LABEL: "Copter Deco",
    FACING_TYPE: ["turnWithSpeed"],
    SHAPE: "M 0.2 -0.8 C 0.2 0.8 0.2 0.8 0.2 0.8 V -0.8 C 0.6 -0.8 1 -0.8 1.4 -0.8 C 1.4 -0.8 2 0 2 0 C 2 0 2 0 2 0 C 2 0 1.4 0.8 1.4 0.8 C 1 0.8 0.6 0.8 0.2 0.8",
    MIRROR_MASTER_ANGLE: true,
}
Class.HeliDeco2 = {
    PARENT: "genericTank",
    LABEL: "Copter Deco",
    COLOR: "grey",
    FACING_TYPE: ["turnWithSpeed"],
    SHAPE: "M -1 -0.7 C 1 -0.7 1 -0.7 1 -0.7 C 1 -0.7 1 0.7 1 0.7 C -1 0.7 -1 0.7 -1 0.7 C -1.4333 1.0667 -1.8667 1.4333 -2.3 1.8 C -2.3 1.8 -1 -0.7 -1 -0.7 Z C -0.5 -0.9 0 -1.1 0 -1.1 C 0 -1.1 0.5 -0.9 1 -0.7 C 1 -0.2333 1 0.2333 1 0.7 C 0.5 0.9 0 1.1 0 1.1 C 0 1.1 -0.5 0.9 -1 0.7 C -1 0.7 -2.3 -1.8 -2.3 -1.8 C -1.8667 -1.4333 -1.4333 -1.0667 -1 -0.7",
    MIRROR_MASTER_ANGLE: true,
}
Class.HeliDeco3 = {
    PARENT: "genericTank",
    LABEL: "Copter Deco",
    COLOR: "darkGrey",
    FACING_TYPE: ["turnWithSpeed"],
    SHAPE: "M 0 -0.5 C 0 -0.2 0 0.1 0 0.4 C 0 0.4 0 0.4 0.4 0.4 C 0.4 0.4 -1 0.7 -1 0.7 C -1 0.7 -2.5 0 -2.5 0 C -2.5 0 -1 -0.7 -1 -0.7 C -1 -0.7 0.4 -0.5 0.4 -0.5 C 0.2667 -0.5 0.1333 -0.5 0 -0.5",
    MIRROR_MASTER_ANGLE: true,
}
Class.HeliDeco4 = {
    PARENT: "genericTank",
    LABEL: "Copter Deco",
    FACING_TYPE: ["turnWithSpeed"],
    SHAPE: "M -0.2 0 C -0.2 0 -1.4 1.4 -1.4 1.4 C -1.4 -0.5 -1.4 -0.8 -1.4 -1.4 C -1.4 -1.4 -0.2 0 -0.2 0 C -0.4 0.2333 -0.6 0.4667 -0.8 0.7 C -0.8 0.7 0.9 0 0.9 0 C 0.3333 -0.2333 -0.2333 -0.4667 -0.8 -0.7 C -0.6 -0.4667 -0.4 -0.2333 -0.2 0",
    MIRROR_MASTER_ANGLE: true,
}
Class.HeliDeco5 = {
    PARENT: "genericTank",
    LABEL: "Copter Deco",
    COLOR: "darkGrey",
    FACING_TYPE: ["turnWithSpeed"],
    SHAPE: "M -1 -1 C 1.5 -1.2 1.5 -1.2 1.5 -1.2 C 3.7 0 3.7 0 3.7 0 C 3.7 0 1.5 1.2 1.5 1.2 C -1 1 -1 1 -1 1 V -1 C -1 -1 -4 -0.2 -4 -0.2 C -4.7 -1 -4.7 -1 -4.7 -1 C -4.7 -0.3333 -4.7 0.3333 -4.7 1 C -4 0.2 -4 0.2 -4 0.2 C -4 0.2 -1 1 -1 1",
    MIRROR_MASTER_ANGLE: true,
}

Class.HeliDeco6 = {
    PARENT: "genericTank",
    LABEL: "Copter Deco",
    COLOR: "mirror",
    FACING_TYPE: ["turnWithSpeed"],
    SHAPE: "M -1 -0.7 C 1 -0.7 1 -0.7 1 -0.7 C 1 -0.7 1 0.7 1 0.7 C -1 0.7 -1 0.7 -1 0.7 C -1.4333 1.0667 -1.8667 1.4333 -2.3 1.8 C -2.3 1.8 -1 -0.7 -1 -0.7 Z C -0.5 -0.9 0 -1.1 0 -1.1 C 0 -1.1 0.5 -0.9 1 -0.7 C 1 -0.2333 1 0.2333 1 0.7 C 0.5 0.9 0 1.1 0 1.1 C 0 1.1 -0.5 0.9 -1 0.7 C -1 0.7 -2.3 -1.8 -2.3 -1.8 C -1.8667 -1.4333 -1.4333 -1.0667 -1 -0.7",
    MIRROR_MASTER_ANGLE: true,
}
Class.HeliDeco7 = {
    PARENT: "genericTank",
    LABEL: "Copter Deco",
    COLOR: "darkGrey",
    FACING_TYPE: ["turnWithSpeed"],
    SHAPE: "M 0 -1 C 0 -1 0 -2 0 -3 C -0.3333 -3.3333 -0.6667 -3.6667 -1 -4 C -1 -2.3333 -1 -0.6667 -1 4 C -1 4 0 3 0 3 C 0 1 0 -1 0 -3",
    MIRROR_MASTER_ANGLE: true,
}
//HELIMINIONS

Class.krisMinion = {
    PARENT: "minion",
    DANGER: 6,
    LAYER: 29,
    HAS_NO_RECOIL: true,
    INTANGIBLE: true,
    IGNORE_COLLISION: true,
    LABEL: "Nex",
    SHAPE: "M -1 -1 C 1.5 -1.2 1.5 -1.2 1.5 -1.2 C 3.7 0 3.7 0 3.7 0 C 3.7 0 1.5 1.2 1.5 1.2 C -1 1 -1 1 -1 1 V -1 C -1 -1 -4 -0.2 -4 -0.2 C -4.7 -1 -4.7 -1 -4.7 -1 C -4.7 -0.3333 -4.7 0.3333 -4.7 1 C -4 0.2 -4 0.2 -4 0.2 C -4 0.2 -1 1 -1 1",
    GUNS: [
      {
            POSITION: [38, 14, 1, 0, 0, 0, 0],
            PROPERTIES: {
            COLOR: "darkGrey",
        },
        },
			{
            POSITION: [40, 3, 1, 0, 4, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, { reload: 0.1, damage: 0.01, speed: 20, shudder: 0, spread: 0, }]),
                TYPE: "tank5mmRound",
            }
        },
        {
            POSITION: [40, 3, 1, 0, 0, 0, 1/3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, { reload: 0.1, damage: 0.01, speed: 20, shudder: 0, spread: 0, }]),
                TYPE: "tank5mmRound",
            }
        },
        {
            POSITION: [40, 3, 1, 0, -4, 0, 2/3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, { reload: 0.1, damage: 0.01, speed: 20, shudder: 0, spread: 0, }]),
                TYPE: "tank5mmRound",
            }
        },
        {
            POSITION: [2, 15, 1, 35, 0, 0, 0],
        },
	],
    TURRETS: [
      {
        
            POSITION: [12, -4, 20, 0, 360, 0],
            TYPE: [ "tankAutoTurret5", { COLOR: "mirror" } ],
        },
        {
            POSITION: [12, -4, -20, 0, 360, 0],
            TYPE: [ "tankAutoTurret5", { COLOR: "mirror" } ],
        },
        {
            POSITION: [20, 2, 0, 0, 360, 1],
            TYPE: [ "HeliDeco7", { COLOR: "darkGrey" } ],
        },
        {
            POSITION: [20, 1, 0, 0, 360, 1],
            TYPE: [ "HeliDeco1", { COLOR: "grey" } ],
        },
        {
            POSITION: [24, 1, 0, 0, 360, 1],
            TYPE: [ "HeliDeco2", ],
        },
        {
            POSITION: [20, -36, 0, 0, 360, 1],
            TYPE: [ "HeliDeco4", ],
        },
        {
            POSITION: [22, 0, 0, 0, 360, 0],
            TYPE: [ "HeliDeco5", ],
        },
        {
            POSITION: [18, 0, 0, 0, 360, 1],
            TYPE: [ "HeliDeco5", ],
        },
        {
            POSITION: [20, -4, 0, 0, 360, 1],
            TYPE: [ "HeliDeco3", ],
        },
        {
            POSITION: [20, 1, 0, 0, 360, 1],
            TYPE: [ "HeliDeco6", ],
        },
        {
            POSITION: [15, 0, 0, 0, 360, 1],
            TYPE: [ "attackPropeller", ],
        },
    ]
}
//HELIBOSSES
Class.apacheGunshipDeco1 = {
    PARENT: "genericTank",
    LABEL: "Copter Deco",
    FACING_TYPE: ["turnWithSpeed"],
    SHAPE: "M 0.8 -0.8 C 0.8 -0.8 1.8 0 1.8 0 C 1.8 0 1.8 0 0.8 0.8 C 0.2 0.8 0.2 0.8 0.2 0.8 V -0.8 C 0.8 -0.8 0.8 -0.8 0.8 -0.8 C 1.1333 -0.5333 1.4667 -0.2667 1.8 0",
    MIRROR_MASTER_ANGLE: true,
}
Class.apacheGunshipDeco2 = {
    PARENT: "genericTank",
    LABEL: "Copter Deco",
    COLOR: "grey",
    FACING_TYPE: ["turnWithSpeed"],
    SHAPE: "M -1 -0.7 C 1 -0.7 1 -0.7 1 -0.7 C 1 -0.7 1 0.7 1 0.7 C -1 0.7 -1 0.7 -1 0.7 Z C -1 -0.7 0 -1.4 0 -1.4 C 0 -1.4 1 -0.7 1 -0.7 C 1 -0.2333 1 0.2333 1 0.7 C 1 0.7 0 1.4 0 1.4 C 0 1.4 -1 0.7 -1 0.7",
    MIRROR_MASTER_ANGLE: true,
}
Class.apacheGunshipDeco3 = {
    PARENT: "genericTank",
    LABEL: "Copter Deco",
    COLOR: "darkGrey",
    FACING_TYPE: ["turnWithSpeed"],
    SHAPE: "M 0 -1 C 0 -0.2 0 0.1 0 0.4 C 0 0.5667 0 0.7333 0 1 C 0 1 -1 0.3 -1 0.3 C -1 0.3 -1 0.3 -3.1 0 C -1 -0.3 -1 -0.3 -1 -0.3 C 0 -1 0 -1 0 -1",
    MIRROR_MASTER_ANGLE: true,
}
Class.apacheGunshipDeco4 = {
    PARENT: "genericTank",
    LABEL: "Copter Deco",
    COLOR: "grey",
    FACING_TYPE: ["turnWithSpeed"],
    SHAPE: "M -0.1 0.7 C -0.1 0.7 -1.4 1.4 -1.4 1.4 C -1.6667 1.4 -1.9333 1.4 -2.2 1.4 C -1.9333 1.1 -1.6667 0.8 -1.4 0.5 C -1.4 -0.5 -1.4 -0.5 -1.4 -0.5 C -2.2 -1.5 -2.2 -1.5 -2.2 -1.5 C -1.4 -1.5 -1.4 -1.5 -1.4 -1.5 C -1.4 -1.5 -0.1 -0.7 -0.1 -0.7 C -0.1 -0.3 -0.1 0.2 -0.1 0.7",
    MIRROR_MASTER_ANGLE: true,
}
Class.apacheGunshipDeco5 = {
    PARENT: "genericTank",
    LABEL: "Copter Deco",
    COLOR: "darkGrey",
    FACING_TYPE: ["turnWithSpeed"],
    SHAPE: "M -1 -1 C 1 -1 1 -1 1 -1 C 1 -1 1 -1 2.3 -0.3 C 2.3 0.3 2.3 0.3 2.3 0.3 C 1 1 1 1 1 1 C -1 1 -0.9 1 -1 1 V -1 C -2.2 -0.4 -2.2 -0.4 -2.2 -0.4 C -4 -0.4 -4 -0.4 -4 -0.4 C -4 -0.4 -4.3 -1 -4.3 -1 C -4.7 -1 -4.7 -1 -4.7 -1 C -4.7 -0.3333 -4.7 0.3333 -4.7 1 C -4.5667 1 -4.4333 1 -4.3 1 C -4 0.4 -4 0.4 -4 0.4 C -4 0.4 -2.2 0.4 -2.2 0.4 C -2.2 0.4 -2.2 0.4 -1 1",
    MIRROR_MASTER_ANGLE: true,
}

Class.apacheGunshipDeco6 = {
    PARENT: "genericTank",
    LABEL: "Copter Deco",
    COLOR: "black",
    FACING_TYPE: ["turnWithSpeed"],
    SHAPE: "M -1 -0.7 C 1 -0.7 1 -0.7 1 -0.7 C 1 -0.7 1 0.7 1 0.7 C -1 0.7 -1 0.7 -1 0.7 Z C -1 -0.7 0 -1.4 0 -1.4 C 0 -1.4 1 -0.7 1 -0.7 C 1 -0.2333 1 0.2333 1 0.7 C 1 0.7 0 1.4 0 1.4 C 0 1.4 -1 0.7 -1 0.7",
    MIRROR_MASTER_ANGLE: true,
}
Class.apacheGunshipDeco7 = {
    PARENT: "genericTank",
    LABEL: "Copter Deco",
    COLOR: "darkGrey",
    FACING_TYPE: ["turnWithSpeed"],
    SHAPE: "M 0 -1 C 0 -1 0 -2 0 -3 C -0.3333 -3.3333 -0.6667 -3.6667 -1 -4 C -1 -2.3333 -1 -0.6667 -1 4 C -1 4 0 3 0 3 C 0 1 0 -1 0 -3",
    MIRROR_MASTER_ANGLE: true,
}
Class.apacheGunship = {
    PARENT: "genericTank",
    DANGER: 6,
    LAYER: 29,
    HAS_NO_RECOIL: true,
    SIZE: 30,
    BODY: {
        HEALTH: base.HEALTH * 150,
    },
    INTANGIBLE: true,
    IGNORE_COLLISION: true,
    LABEL: "Attack Helicopter",
    SHAPE: "M -1 -1 C 1 -1 1 -1 1 -1 C 1 -1 1 -1 2.3 -0.3 C 2.3 0.3 2.3 0.3 2.3 0.3 C 1 1 1 1 1 1 C -1 1 -0.9 1 -1 1 V -1 C -2.2 -0.4 -2.2 -0.4 -2.2 -0.4 C -4 -0.4 -4 -0.4 -4 -0.4 C -4 -0.4 -4.3 -1 -4.3 -1 C -4.7 -1 -4.7 -1 -4.7 -1 C -4.7 -0.3333 -4.7 0.3333 -4.7 1 C -4.5667 1 -4.4333 1 -4.3 1 C -4 0.4 -4 0.4 -4 0.4 C -4 0.4 -2.2 0.4 -2.2 0.4 C -2.2 0.4 -2.2 0.4 -1 1",
    GUNS: [
      {
            POSITION: [32, 14, 1, 0, 0, 0, 0],
            PROPERTIES: {
            COLOR: "darkGrey",
        },
        },
			{
            POSITION: [36, 3, 1, 0, 4, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, { reload: 0.1, damage: 0.05, speed: 20, shudder: 0, spread: 0, }]),
                TYPE: "tank5mmRound",
            }
        },
        {
            POSITION: [36, 3, 1, 0, 0, 0, 1/3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, { reload: 0.1, damage: 0.05, speed: 20, shudder: 0, spread: 0, }]),
                TYPE: "tank5mmRound",
            }
        },
        {
            POSITION: [36, 3, 1, 0, -4, 0, 2/3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, { reload: 0.1, damage: 0.05, speed: 20, shudder: 0, spread: 0, }]),
                TYPE: "tank5mmRound",
            }
        },
        {
            POSITION: [2, 15, 1, 30, 0, 0, 0],
        },
	],
    TURRETS: [
      {
            POSITION: [12, -4, 20, 0, 360, 1],
            TYPE: [ "tankAutoTurret5", { COLOR: "mirror" } ],
        },
        {
            POSITION: [12, -4, -20, 0, 360, 1],
            TYPE: [ "tankAutoTurret5", { COLOR: "mirror" } ],
        },
        {
            POSITION: [20, 2, 0, 0, 360, 1],
            TYPE: [ "apacheGunshipDeco7", { COLOR: "grey" } ],
        },
        {
            POSITION: [20, 1, 0, 0, 360, 1],
            TYPE: [ "apacheGunshipDeco1", { COLOR: "grey" } ],
        },
        {
            POSITION: [24, 1, 0, 0, 360, 1],
            TYPE: [ "apacheGunshipDeco2", ],
        },
        {
            POSITION: [20, -4, 0, 0, 360, 1],
            TYPE: [ "apacheGunshipDeco3", ],
        },
        {
            POSITION: [20, -36, 0, 0, 360, 1],
            TYPE: [ "apacheGunshipDeco4", ],
        },
        {
          POSITION: [22, 0, 0, 0, 360, 0],
            TYPE: [ "apacheGunshipDeco5", ],
        },
        {
          POSITION: [18, 0, 0, 0, 360, 1],
            TYPE: [ "apacheGunshipDeco5", ],
        },
        {
            POSITION: [20, 1, 0, 0, 360, 1],
            TYPE: [ "apacheGunshipDeco6", ],
        },
        {
            POSITION: [12, -4, 30, 0, 360, 1],
            TYPE: [ "tankAutoTurret6", { independant: false, SHAPE: 0, COLOR: "mirror" } ],
        },
        {
            POSITION: [12, -4, -30, 0, 360, 1],
            TYPE: [ "tankAutoTurret6", { independant: false, SHAPE: 0, COLOR: "mirror" } ],
        },
        {
            POSITION: [15, 0, 0, 0, 360, 1],
            TYPE: [ "attackPropeller", ],
        },
    ]
}
//HELITANKS
Class.literallyAHelicopter = {
    PARENT: "genericTank",
    DANGER: 6,
    LAYER: 29,
    HAS_NO_RECOIL: true,
    SIZE: 12,
    INTANGIBLE: true,
    IGNORE_COLLISION: true,
    LABEL: "Helicopter",
    SHAPE: "M -1 -1 C 1.5 -1.2 1.5 -1.2 1.5 -1.2 C 3.7 0 3.7 0 3.7 0 C 3.7 0 1.5 1.2 1.5 1.2 C -1 1 -1 1 -1 1 V -1 C -1 -1 -4 -0.2 -4 -0.2 C -4.7 -1 -4.7 -1 -4.7 -1 C -4.7 -0.3333 -4.7 0.3333 -4.7 1 C -4 0.2 -4 0.2 -4 0.2 C -4 0.2 -1 1 -1 1",
    GUNS: [
      {
            POSITION: [32, 14, 1, 0, 0, 0, 0],
            PROPERTIES: {
            COLOR: "darkGrey",
        },
        },
			{
            POSITION: [36, 3, 1, 0, 4, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, { reload: 0.1, damage: 0.01, speed: 20, shudder: 0, spread: 0, }]),
                TYPE: "tank5mmRound",
            }
        },
        {
            POSITION: [36, 3, 1, 0, -4, 0, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, { reload: 0.1, damage: 0.01, speed: 20, shudder: 0, spread: 0, }]),
                TYPE: "tank5mmRound",
            }
        },
        {
            POSITION: [2, 15, 1, 30, 0, 0, 0],
        },
	],
    TURRETS: [
      {
            POSITION: [20, 1, 0, 0, 360, 1],
            TYPE: [ "HeliDeco1", { COLOR: "#42b4ec" } ],
        },
        {
            POSITION: [24, 1, 0, 0, 360, 1],
            TYPE: [ "HeliDeco2", ],
        },
        {
            POSITION: [20, -4, 0, 0, 360, 1],
            TYPE: [ "HeliDeco3", ],
        },
        {
            POSITION: [20, -36, 0, 0, 360, 1],
            TYPE: [ "HeliDeco4", ],
        },
        {
          POSITION: [22, 0, 0, 0, 360, 0],
            TYPE: [ "HeliDeco5", ],
        },
        {
          POSITION: [18, 0, 0, 0, 360, 1],
            TYPE: [ "HeliDeco5", ],
        },
        {
            POSITION: [20, 1, 0, 0, 360, 1],
            TYPE: [ "HeliDeco6", ],
        },
        {
            POSITION: [15, 0, 0, 0, 360, 1],
            TYPE: [ "attackPropeller", { COLOR: "darkGrey" } ],
        },
    ]
}
//Fuck you gay people
Class.skyraider = {
    PARENT: "genericActualHeli",
    DANGER: 6,
    LAYER: 29,
    HAS_NO_RECOIL: true,
    SIZE: 12,
    INTANGIBLE: true,
    IGNORE_COLLISION: true,
    LABEL: "Sky Raider",
    SHAPE: "M -1 -1 C 1.5 -1.2 1.5 -1.2 1.5 -1.2 C 3.7 0 3.7 0 3.7 0 C 3.7 0 1.5 1.2 1.5 1.2 C -1 1 -1 1 -1 1 V -1 C -1 -1 -4 -0.2 -4 -0.2 C -4.7 -1 -4.7 -1 -4.7 -1 C -4.7 -0.3333 -4.7 0.3333 -4.7 1 C -4 0.2 -4 0.2 -4 0.2 C -4 0.2 -1 1 -1 1",
    GUNS: [
      {
            POSITION: [32, 14, 1, 0, 0, 0, 0],
            PROPERTIES: {
            COLOR: "darkGrey",
        },
        },
			{
            POSITION: [36, 3, 1, 0, 4, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, { reload: 0.1, damage: 0.01, speed: 20, shudder: 0, spread: 0, }]),
                TYPE: "tank5mmRound",
            }
        },
        {
            POSITION: [36, 3, 1, 0, 0, 0, 1/3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, { reload: 0.1, damage: 0.01, speed: 20, shudder: 0, spread: 0, }]),
                TYPE: "tank5mmRound",
            }
        },
        {
            POSITION: [36, 3, 1, 0, -4, 0, 2/3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, { reload: 0.1, damage: 0.01, speed: 20, shudder: 0, spread: 0, }]),
                TYPE: "tank5mmRound",
            }
        },
        {
            POSITION: [2, 15, 1, 30, 0, 0, 0],
        },
	],
    TURRETS: [
      {
            POSITION: [20, 1, 0, 0, 360, 1],
            TYPE: [ "HeliDeco1", { COLOR: "#42b4ec" } ],
        },
        {
            POSITION: [24, 1, 0, 0, 360, 1],
            TYPE: [ "HeliDeco2", ],
        },
        {
            POSITION: [20, -4, 0, 0, 360, 1],
            TYPE: [ "HeliDeco3", ],
        },
        {
            POSITION: [20, -36, 0, 0, 360, 1],
            TYPE: [ "HeliDeco4", ],
        },
        {
          POSITION: [22, 0, 0, 0, 360, 0],
            TYPE: [ "HeliDeco5", ],
        },
        {
          POSITION: [18, 0, 0, 0, 360, 1],
            TYPE: [ "HeliDeco5", ],
        },
        {
            POSITION: [20, 1, 0, 0, 360, 1],
            TYPE: [ "HeliDeco6", ],
        },
        {
            POSITION: [15, 0, 0, 0, 360, 1],
            TYPE: [ "attackPropeller", { COLOR: "darkGrey" } ],
        },
    ]
}
Class.eliteraider = {
    PARENT: "genericActualHeli",
    DANGER: 6,
    LAYER: 29,
    HAS_NO_RECOIL: true,
    SIZE: 12,
    INTANGIBLE: true,
    IGNORE_COLLISION: true,
    LABEL: "Elite Raider",
    SHAPE: "M -1 -1 C 1.5 -1.2 1.5 -1.2 1.5 -1.2 C 3.7 0 3.7 0 3.7 0 C 3.7 0 1.5 1.2 1.5 1.2 C -1 1 -1 1 -1 1 V -1 C -1 -1 -4 -0.2 -4 -0.2 C -4.7 -1 -4.7 -1 -4.7 -1 C -4.7 -0.3333 -4.7 0.3333 -4.7 1 C -4 0.2 -4 0.2 -4 0.2 C -4 0.2 -1 1 -1 1",
    GUNS: [
      {
            POSITION: [32, 14, 1, 0, -8, 0, 0],
            PROPERTIES: {
            COLOR: "darkGrey",
        },
        },
			{
            POSITION: [36, 3, 1, 0, -12, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, { reload: 0.1, damage: 0.01, speed: 20, shudder: 0, spread: 0, }]),
                TYPE: "tank5mmRound",
            }
        },
        {
            POSITION: [36, 3, 1, 0, -8, 0, 1/3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, { reload: 0.1, damage: 0.01, speed: 20, shudder: 0, spread: 0, }]),
                TYPE: "tank5mmRound",
            }
        },
        {
            POSITION: [36, 3, 1, 0, -4, 0, 2/3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, { reload: 0.1, damage: 0.01, speed: 20, shudder: 0, spread: 0, }]),
                TYPE: "tank5mmRound",
            }
        },
        {
            POSITION: [2, 15, 1, 30, 0, 0, 0],
        },
      //
      {
            POSITION: [32, 14, 1, 0, 8, 0, 0],
            PROPERTIES: {
            COLOR: "darkGrey",
        },
        },
			{
            POSITION: [36, 3, 1, 0, 12, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, { reload: 0.1, damage: 0.01, speed: 20, shudder: 0, spread: 0, }]),
                TYPE: "tank5mmRound",
            }
        },
        {
            POSITION: [36, 3, 1, 0, 8, 0, 1/3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, { reload: 0.1, damage: 0.01, speed: 20, shudder: 0, spread: 0, }]),
                TYPE: "tank5mmRound",
            }
        },
        {
            POSITION: [36, 3, 1, 0, 4, 0, 2/3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, { reload: 0.1, damage: 0.01, speed: 20, shudder: 0, spread: 0, }]),
                TYPE: "tank5mmRound",
            }
        },
        {
            POSITION: [2, 15, 1, 30, 0, 0, 0],
        },
	],
    TURRETS: [
      {
            POSITION: [20, 1, 0, 0, 360, 1],
            TYPE: [ "HeliDeco1", { COLOR: "#42b4ec" } ],
        },
        {
            POSITION: [24, 1, 0, 0, 360, 1],
            TYPE: [ "HeliDeco2", ],
        },
        {
            POSITION: [20, -4, 0, 0, 360, 1],
            TYPE: [ "HeliDeco3", ],
        },
        {
            POSITION: [20, -36, 0, 0, 360, 1],
            TYPE: [ "HeliDeco4", ],
        },
        {
          POSITION: [22, 0, 0, 0, 360, 0],
            TYPE: [ "HeliDeco5", ],
        },
        {
          POSITION: [18, 0, 0, 0, 360, 1],
            TYPE: [ "HeliDeco5", ],
        },
        {
            POSITION: [20, 1, 0, 0, 360, 1],
            TYPE: [ "HeliDeco6", ],
        },
        {
            POSITION: [15, 0, 0, 0, 360, 1],
            TYPE: [ "attackPropeller", { COLOR: "darkGrey" } ],
        },
    ]
}
//JETS
Class.JetDeco1 = {
SHAPE: "M 0 0 C 0 -1 0 -2 0 -3 C 0.6667 -2.3333 1.3333 -1.6667 2 -1 C 2 -0.3333 2 0.3333 2 1 C 1.3333 1.6667 0.6667 2.3333 0 3 C -0.3333 2.6667 -0.6667 2.3333 -1 2 C -1.6667 2 -2.3333 2 -3 2 C -3.3333 1.6667 -3.6667 1.3333 -4 1 C -4.3333 1 -4.6667 1 -5 1 C -4.6667 0.8333 -4.3333 0.6667 -4 0.5 C -3.1667 0.5 -2.3333 0.5 -1.5 0.5 C -1.3333 0.3333 -1.1667 0.1667 -1 0 C -1.1667 -0.1667 -1.3333 -0.3333 -1.5 -0.5 C -2.3333 -0.5 -3.1667 -0.5 -4 -0.5 C -4.3333 -0.6667 -4.6667 -0.8333 -5 -1 C -4.6667 -1 -4.3333 -1 -4 -1 C -3.6667 -1.3333 -3.3333 -1.6667 -3 -2 C -2.3333 -2 -1.6667 -2 -1 -2 C -0.6667 -2.3333 -0.3333 -2.6667 0 -3",
MIRROR_MASTER_ANGLE: true,
}
Class.JetDeco2 = {
SHAPE: "M 0 0 C 0 0 2 1 2 1 C 1.3333 1.6667 0.6667 2.3333 0 3 C -0.3333 2.6667 -0.6667 2.3333 -1 2 C -1.6667 2 -2.3333 2 -3 2 C -3.3333 1.6667 -3.6667 1.3333 -4 1 C -4.3333 1 -4.6667 1 -5 1 C -4.6667 0.8333 -4.3333 0.6667 -4 0.5 C -3.1667 0.5 -2.3333 0.5 -1.5 0.5 C -1.3333 0.3333 -1.1667 0.1667 -1 0 C -0.6667 0 -0.3333 0 0 0",
MIRROR_MASTER_ANGLE: true,
}
Class.JetDeco3 = {
SHAPE: "M 0 0 C 0 -1 0 -2 0 -3 C 0.6667 -2.3333 1.3333 -1.6667 2 -1 C 2 -1 0 0 0 0 C 0 0 -1 0 -1 0 C -1.1667 -0.1667 -1.3333 -0.3333 -1.5 -0.5 C -2.3333 -0.5 -3.1667 -0.5 -4 -0.5 C -4.3333 -0.6667 -4.6667 -0.8333 -5 -1 C -4.6667 -1 -4.3333 -1 -4 -1 C -3.6667 -1.3333 -3.3333 -1.6667 -3 -2 C -2.3333 -2 -1.6667 -2 -1 -2 C -0.6667 -2.3333 -0.3333 -2.6667 0 -3",
MIRROR_MASTER_ANGLE: true,
}
Class.JetAimer = {
    PARENT: "genericTank",
    LABEL: "Electric Base",
    SHAPE: "M 0 0 C 0 -1 0 -2 0 -3 C 0.6667 -2 1.3333 -1 2 0 C 1.3333 1 0.6667 2 0 3 C 0 2 0 1 0 0 C 0 1 0 2 0 3 C -1.6667 2.3333 -3.3333 1.6667 -5 1 C -3.8333 1 -2.6667 1 -1.5 1 C -1.3333 0.8333 -1.1667 0.6667 -1 0.5 C -1 0.1667 -1 -0.1667 -1 -0.5 C -1 -0.5 -1.5 -1 -1.5 -1 C -2.6667 -1 -3.8333 -1 -5 -1 C -5 -1 0 -3 0 -3",
  GUNS: [
        {
            POSITION: [0.1, 2, 1, 0, 0, 180, 0],
            PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.basic, {range: 0.0001, reload: 0.1, speed: 0, recoil: 10}]),
            TYPE: [ "bullet", { PERSISTS_AFTER_DEATH: true } ],
            BORDERLESS: true,
            ALPHA: 0
            }
        }
    ],
}
Class.StealthBomberAimer = {
    PARENT: "genericTank",
    LABEL: "Electric Base",
    SHAPE: "M 0 0 C 0 -1 0 -2 0 -3 C 0.6667 -2 1.3333 -1 2 0 C 1.3333 1 0.6667 2 0 3 C 0 2 0 1 0 0 C 0 1 0 2 0 3 C -1.6667 2.3333 -3.3333 1.6667 -5 1 C -3.8333 1 -2.6667 1 -1.5 1 C -1.3333 0.8333 -1.1667 0.6667 -1 0.5 C -1 0.1667 -1 -0.1667 -1 -0.5 C -1 -0.5 -1.5 -1 -1.5 -1 C -2.6667 -1 -3.8333 -1 -5 -1 C -5 -1 0 -3 0 -3",
  GUNS: [
        {
            POSITION: [0.1, 2, 1, 0, 0, 180, 0],
            PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.basic, {range: 0.0001, reload: 0.1, speed: 0, recoil: 8}]),
            TYPE: [ "bullet", { PERSISTS_AFTER_DEATH: true } ],
            BORDERLESS: true,
            ALPHA: 0
            }
        }
    ],
}
Class.VulcanBase = {
    PARENT: "genericTank",
    LABEL: "Basic Jet Base",
    CONTROLLERS: ["turretWithMotion"],
    SHAPE: "M 0 0 C 0 -1 0 -2 0 -3 C 0.6667 -2.3333 1.3333 -1.6667 2 -1 C 2 -0.3333 2 0.3333 2 1 C 1.3333 1.6667 0.6667 2.3333 0 3 C -0.3333 2.6667 -0.6667 2.3333 -1 2 C -1.6667 2 -2.3333 2 -3 2 C -3.3333 1.6667 -3.6667 1.3333 -4 1 C -4.3333 1 -4.6667 1 -5 1 C -4.6667 0.8333 -4.3333 0.6667 -4 0.5 C -3.1667 0.5 -2.3333 0.5 -1.5 0.5 C -1.3333 0.3333 -1.1667 0.1667 -1 0 C -1.1667 -0.1667 -1.3333 -0.3333 -1.5 -0.5 C -2.3333 -0.5 -3.1667 -0.5 -4 -0.5 C -4.3333 -0.6667 -4.6667 -0.8333 -5 -1 C -4.6667 -1 -4.3333 -1 -4 -1 C -3.6667 -1.3333 -3.3333 -1.6667 -3 -2 C -2.3333 -2 -1.6667 -2 -1 -2 C -0.6667 -2.3333 -0.3333 -2.6667 0 -3",
  TURRETS: [
        {
            POSITION: [22, 0, 0, 0, 0, 0],
            TYPE: [ "JetDeco1", { COLOR: "darkGrey" } ],
        },
    {
            POSITION: [18, 0, 0, 0, 0, 1],
            TYPE: [ "JetDeco1", { COLOR: "darkGrey" } ],
      },
    {
            POSITION: [14, 0, 2, 0, 0, 1],
            TYPE: [ "JetDeco2", { COLOR: "mirror" } ],
      },
    {
            POSITION: [14, 0, -2, 0, 0, 1],
            TYPE: [ "JetDeco3", { COLOR: "mirror" } ],
      },
    {
            POSITION: [12, 0, 2, 0, 0, 1],
            TYPE: [ "JetDeco2", { COLOR: "darkGrey" } ],
      },
    {
            POSITION: [12, 0, -2, 0, 0, 1],
            TYPE: [ "JetDeco3", { COLOR: "darkGrey" } ],
        },
    ],
  GUNS: [
    {
          POSITION: [30, 5, 1.3, -2, 20, 0, 0],
            PROPERTIES: {
                COLOR: "darkGrey",
            }
        },
        {
          POSITION: [30, 5, 1.3, -2, 12, 0, 0.5],
            PROPERTIES: {
                COLOR: "darkGrey",
            },
        },
      {
          POSITION: [35, 3, 1.3, -2, 20, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, { reload: 0.1, recoil: 0, damage: 0.03, speed: 20, shudder: 0, spread: 0, }]),
                TYPE: "tank5mmRound",
                ALT_FIRE: true,
            }
        },
        {
          POSITION: [35, 3, 1.3, -2, 12, 0, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, { reload: 0.1, recoil: 0, damage: 0.03, speed: 20, shudder: 0, spread: 0, }]),
                TYPE: "tank5mmRound",
                ALT_FIRE: true,
            },
          },
        {
            POSITION: [2, 16, 1, 25, 16, 0, 0]
        },
        {
          POSITION: [30, 5, 1.3, -2, -20, 0, 0.5],
            PROPERTIES: {
                COLOR: "darkGrey",
            }
        },
        {
          POSITION: [30, 5, 1.3, -2, -12, 0, 0],
            PROPERTIES: {
                COLOR: "darkGrey",
            },
        },
      {
          POSITION: [35, 3, 1.3, -2, -20, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, { reload: 0.1, recoil: 0, damage: 0.03, speed: 20, shudder: 0, spread: 0, }]),
                TYPE: "tank5mmRound",
                ALT_FIRE: true,
            }
        },
        {
          POSITION: [35, 3, 1.3, -2, -12, 0, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, { reload: 0.1, recoil: 0, damage: 0.03, speed: 20, shudder: 0, spread: 0, }]),
                TYPE: "tank5mmRound",
                ALT_FIRE: true,
            },
          },
        {
            POSITION: [2, 16, 1, 25, -16, 0, 0]
        },
          {
            POSITION: [0.1, 2, 1, -1, 0, 180, 0],
            PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.basic, {range: 0.0001, reload: 0.1, speed: 0, recoil: 10}]),
            TYPE: [ "bullet", { PERSISTS_AFTER_DEATH: true } ],
            BORDERLESS: true,
            ALPHA: 0
            }
        },
    {
         POSITION: [50, 20, 1, 0, 0, 180, 0],
            PROPERTIES: {
            COLOR: "blue",
            BORDERLESS: true,
            ALPHA: 0.2
            }
        },
    {
         POSITION: [55, 20, 1, 0, 0, 180, 0],
            PROPERTIES: {
            COLOR: "blue",
            BORDERLESS: true,
            ALPHA: 0.2
            }
        },
{
         POSITION: [60, 20, 1, 0, 0, 180, 0],
            PROPERTIES: {
            COLOR: "blue",
            BORDERLESS: true,
            ALPHA: 0.2
            }
        },
{
         POSITION: [65, 20, 1, 0, 0, 180, 0],
            PROPERTIES: {
            COLOR: "blue",
            BORDERLESS: true,
            ALPHA: 0.2
            }
        },
{
  POSITION: [70, 20, 1, 0, 0, 180, 0],
            PROPERTIES: {
            COLOR: "blue",
            BORDERLESS: true,
            ALPHA: 0.2
            }
        },
{
         POSITION: [75, 20, 1, 0, 0, 180, 0],
            PROPERTIES: {
            COLOR: "blue",
            BORDERLESS: true,
            ALPHA: 0.2
            }
        }
    ],
}
Class.StealthJetDeco1 = {
SHAPE: "M 0 0 C 1 0 2 0 2.8 0 C 2.7 0 0.8 2 0.8 2 C 0.5333 1.2 0.2667 0.6 0 0 C 0.2667 -0.6 0.5333 -1.2 0.8 -2 C 0.8 -2 2.8 0 2.8 0",
MIRROR_MASTER_ANGLE: true,
}
Class.StealthJetDeco2 = {
COLOR: "black",
SHAPE: "M 0 0 C 1 0 2 0 3 0 C 1.3333 1.6667 -0.3333 3.3333 -2 5 C -2.3333 4.6667 -2.6667 4.3333 -3 4 C -2.3667 3.3333 -1.7333 2.6667 -1.1 2 C -1.4 1.6667 -1.7 1.3333 -2 1 C -1.6667 0.6667 -1.3333 0.3333 -1 0 C -1.3333 -0.3333 -1.6667 -0.6667 -2 -1 C -1.6667 -1.3333 -1.3333 -1.6667 -1 -2 C -1.6667 -2.6667 -2.3333 -3.3333 -3 -4 C -2.6667 -4.3333 -2.3333 -4.6667 -2 -5 C -0.3333 -3.3333 1.3333 -1.6667 3 0",
MIRROR_MASTER_ANGLE: true,
}
Class.StealthJetBase = {
    PARENT: "genericTank",
    LABEL: "Basic Jet Base",
    CONTROLLERS: ["turretWithMotion"],
    SHAPE: "M 0 0 C 1 0 2 0 3 0 C 1.3333 1.6667 -0.3333 3.3333 -2 5 C -2.3333 4.6667 -2.6667 4.3333 -3 4 C -2.3667 3.3333 -1.7333 2.6667 -1.1 2 C -1.4 1.6667 -1.7 1.3333 -2 1 C -1.6667 0.6667 -1.3333 0.3333 -1 0 C -1.3333 -0.3333 -1.6667 -0.6667 -2 -1 C -1.6667 -1.3333 -1.3333 -1.6667 -1 -2 C -1.6667 -2.6667 -2.3333 -3.3333 -3 -4 C -2.6667 -4.3333 -2.3333 -4.6667 -2 -5 C -0.3333 -3.3333 1.3333 -1.6667 3 0",
  TURRETS: [
    {
            POSITION: [19, 0, 0, 0, 0, 1],
            TYPE: [ "StealthJetDeco2", ],
        },
    {
            POSITION: [21, 0, 0, 0, 0, 0],
            TYPE: [ "StealthJetDeco2", ],
        },
    {
            POSITION: [17, 0, 0, 0, 0, 1],
            TYPE: [ "StealthJetDeco1", { COLOR: "mirror" } ],
        },
    ],
  GUNS: [
    {
          POSITION: [0.1, 6, 0, 0, -2, 90, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, {speed: 1, reload: 20, health: 100, damage: 1.5, recoil: 0}]),
                TYPE: [ "growBullet", ],
                STAT_CALCULATOR: "thruster",
                COLOR: "darkGrey",
                MOTION_TYPE: ['grow', {growSpeed: 7}],
                ALT_FIRE: true,
            }
        },
    {
          POSITION: [0.1, 6, 0, 0, -2, 90, 0.02],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, {speed: 1, reload: 20, health: 100, damage: 1.5, recoil: 0}]),
                TYPE: [ "growBullet", ],
                STAT_CALCULATOR: "thruster",
                COLOR: "darkGrey",
                MOTION_TYPE: ['grow', {growSpeed: 7}],
                ALT_FIRE: true,
            }
        },
    {
          POSITION: [0.1, 6, 0, 0, -2, 90, 0.04],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, {speed: 1, reload: 20, health: 100, damage: 1.5, recoil: 0}]),
                TYPE: [ "growBullet", ],
                STAT_CALCULATOR: "thruster",
                COLOR: "darkGrey",
                MOTION_TYPE: ['grow', {growSpeed: 7}],
                ALT_FIRE: true,
            }
        },
    {
          POSITION: [0.1, 6, 0, 0, -2, 90, 0.06],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, {speed: 1, reload: 20, health: 100, damage: 1.5, recoil: 0}]),
                TYPE: [ "growBullet", ],
                STAT_CALCULATOR: "thruster",
                COLOR: "darkGrey",
                MOTION_TYPE: ['grow', {growSpeed: 7}],
                ALT_FIRE: true,
            }
        },
    {
          POSITION: [0.1, 6, 0, 0, -2, 90, 0.08],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, {speed: 1, reload: 20, health: 100, damage: 1.5, recoil: 0}]),
                TYPE: [ "growBullet", ],
                STAT_CALCULATOR: "thruster",
                COLOR: "darkGrey",
                MOTION_TYPE: ['grow', {growSpeed: 7}],
                ALT_FIRE: true,
            }
        },
    {
          POSITION: [0.1, 6, 0, 0, -2, -90, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, {speed: 1, reload: 20, health: 100, damage: 1.5, recoil: 0}]),
                TYPE: [ "growBullet", ],
                STAT_CALCULATOR: "thruster",
                COLOR: "darkGrey",
                MOTION_TYPE: ['grow', {growSpeed: 7}],
                ALT_FIRE: true,
            }
        },
    {
          POSITION: [0.1, 6, 0, 0, -2, -90, 0.02],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, {speed: 1, reload: 20, health: 100, damage: 1.5, recoil: 0}]),
                TYPE: [ "growBullet", ],
                STAT_CALCULATOR: "thruster",
                COLOR: "darkGrey",
                MOTION_TYPE: ['grow', {growSpeed: 7}],
                ALT_FIRE: true,
            }
        },
    {
          POSITION: [0.1, 6, 0, 0, -2, -90, 0.04],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, {speed: 1, reload: 20, health: 100, damage: 1.5, recoil: 0}]),
                TYPE: [ "growBullet", ],
                STAT_CALCULATOR: "thruster",
                COLOR: "darkGrey",
                MOTION_TYPE: ['grow', {growSpeed: 7}],
                ALT_FIRE: true,
            }
        },
    {
          POSITION: [0.1, 6, 0, 0, -2, -90, 0.06],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, {speed: 1, reload: 20, health: 100, damage: 1.5, recoil: 0}]),
                TYPE: [ "growBullet", ],
                STAT_CALCULATOR: "thruster",
                COLOR: "darkGrey",
                MOTION_TYPE: ['grow', {growSpeed: 7}],
                ALT_FIRE: true,
            }
        },
    {
          POSITION: [0.1, 6, 0, 0, -2, -90, 0.08],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, {speed: 1, reload: 20, health: 100, damage: 1.5, recoil: 0}]),
                TYPE: [ "growBullet", ],
                STAT_CALCULATOR: "thruster",
                COLOR: "darkGrey",
                MOTION_TYPE: ['grow', {growSpeed: 7}],
                ALT_FIRE: true,
              
            }
        },
          {
            POSITION: [0.1, 2, 1, -1, 0, 180, 0],
            PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.basic, {range: 0.0001, reload: 0.1, speed: 0, recoil: 8}]),
            TYPE: [ "bullet", { PERSISTS_AFTER_DEATH: true } ],
            BORDERLESS: true,
            ALPHA: 0
            }
        },
    ],
}
//PLAYABLEJETS
Class.VulcanCarrier = {
    PARENT: "genericActualJet",
    DANGER: 6,
    BODY: {
        HEALTH: base.HEALTH * 1.2,
        SPEED: 1,
    },
    LABEL: "Sky Shreader",
    SHAPE: 1,
    TURRETS: [
      {
            POSITION: [1, 0, 0, 0, 360, 0],
            TYPE: [ "JetAimer", { COLOR: "grey", SHAPE: "M -1 -1 H 0 C 1 -1 1 0 1 0 C 1 0 1 1 0 1 H -1 V -1", } ],
        },
        {
            POSITION: [21, 0, 0, 0, 360, 0],
            TYPE: [ "VulcanBase", { COLOR: "mirror" } ],
        }
    ]
}
Class.StealthBomber = {
    PARENT: "genericActualJet",
    DANGER: 6,
    BODY: {
        HEALTH: base.HEALTH * 1.2,
        SPEED: 1,
    },
    LABEL: "Stealth Bomber",
    SHAPE: 1,
    TURRETS: [
      {
            POSITION: [1, 0, 0, 0, 360, 0],
            TYPE: [ "StealthBomberAimer", { COLOR: "grey", SHAPE: "M -1 -1 H 0 C 1 -1 1 0 1 0 C 1 0 1 1 0 1 H -1 V -1", } ],
        },
        {
            POSITION: [21, 0, 0, 0, 360, 0],
            TYPE: [ "StealthJetBase", { COLOR: "mirror" } ],
        }
    ]
}
//DEV
Class.skynuker = {
    PARENT: "genericTank",
    DANGER: 6,
    LAYER: 29,
    HAS_NO_RECOIL: true,
    SIZE: 12,
    INTANGIBLE: true,
    IGNORE_COLLISION: true,
    LABEL: "Sky OHGOD",
    SHAPE: "M -1 -1 C 1 -1 1 -1 1 -1 C 2.7 -0.7 2.7 0.7 1 1 C -1 1 -0.9 1 -1 1 V -1 C -2.2 -0.5 -2.5 -0.3 -4 -0.2 C -4 -0.2 -4.3 -0.2 -4.3 -1 C -4.7 -1 -4.7 -1 -4.7 -1 C -4.7 -0.3333 -4.7 0.3333 -4.7 1 C -4.5667 1 -4.4333 1 -4.3 1 C -4.3 0.2 -4 0.2 -4 0.2 C -2.5 0.3 -2.3 0.4 -1 1",
    GUNS: [
      {
            POSITION: [32, 14, 1, 0, 0, 0, 0],
            PROPERTIES: {
            COLOR: "darkGrey",
        },
        },
			{
            POSITION: [36, 3, 1, 0, 4, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, { reload: 0.1, damage: 0.01, speed: 20, shudder: 0, spread: 0, }]),
                TYPE: "nuclearmissile",
            }
        },
        {
            POSITION: [36, 3, 1, 0, 0, 0, 1/3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, { reload: 0.1, damage: 0.01, speed: 20, shudder: 0, spread: 0, }]),
                TYPE: "nuclearmissile",
            }
        },
        {
            POSITION: [36, 3, 1, 0, -4, 0, 2/3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, { reload: 0.1, health: 0.001, damage: 0.01, speed: 20, shudder: 0, spread: 0, }]),
                TYPE: "nuclearmissile",
            }
        },
        {
            POSITION: [2, 15, 1, 30, 0, 0, 0],
        },
	],
    TURRETS: [
      {
            POSITION: [20, 1, 0, 0, 360, 1],
            TYPE: [ "HeliDeco1", { COLOR: "#42b4ec" } ],
        },
        {
            POSITION: [24, 1, 0, 0, 360, 1],
            TYPE: [ "HeliDeco2", ],
        },
        {
            POSITION: [20, -4, 0, 0, 360, 1],
            TYPE: [ "HeliDeco3", ],
        },
        {
            POSITION: [20, -36, 0, 0, 360, 1],
            TYPE: [ "HeliDeco4", ],
        },
        {
          POSITION: [22, 0, 0, 0, 360, 0],
            TYPE: [ "HeliDeco5", ],
        },
        {
          POSITION: [18, 0, 0, 0, 360, 1],
            TYPE: [ "HeliDeco5", ],
        },
        {
            POSITION: [20, 1, 0, 0, 360, 1],
            TYPE: [ "HeliDeco6", ],
        },
        {
            POSITION: [15, 0, 0, 0, 360, 1],
            TYPE: [ "propeller", { COLOR: "#5C533F" } ],
        },
    ]
}
Class.superBomber = {
    PARENT: "genericTank",
    DANGER: 6,
    LAYER: 29,
    HAS_NO_RECOIL: true,
    SIZE: 12,
    INTANGIBLE: true,
    IGNORE_COLLISION: true,
    LABEL: "Super Bomber",
    SHAPE: "M -1 -1 C 1 -1 1 -1 1 -1 C 2.7 -0.7 2.7 0.7 1 1 C -1 1 -0.9 1 -1 1 V -1 C -2.2 -0.5 -2.5 -0.3 -4 -0.2 C -4 -0.2 -4.3 -0.2 -4.3 -1 C -4.7 -1 -4.7 -1 -4.7 -1 C -4.7 -0.3333 -4.7 0.3333 -4.7 1 C -4.5667 1 -4.4333 1 -4.3 1 C -4.3 0.2 -4 0.2 -4 0.2 C -2.5 0.3 -2.3 0.4 -1 1",
    GUNS: [
      {
            POSITION: [32, 14, 1, 0, 0, 0, 0],
            PROPERTIES: {
            COLOR: "darkGrey",
        },
        },
			{
            POSITION: [36, 3, 1, 0, 4, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, { reload: 0.1, damage: 0.01, speed: 20, shudder: 0, spread: 0, }]),
                TYPE: "veryVolatileShells",
            }
        },
        {
            POSITION: [36, 3, 1, 0, 0, 0, 1/3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, { reload: 0.1, damage: 0.01, speed: 20, shudder: 0, spread: 0, }]),
                TYPE: "veryVolatileShells",
            }
        },
        {
            POSITION: [36, 3, 1, 0, -4, 0, 2/3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, { reload: 0.1, health: 0.001, damage: 0.01, speed: 20, shudder: 0, spread: 0, }]),
                TYPE: "veryVolatileShells",
            }
        },
        {
            POSITION: [2, 15, 1, 30, 0, 0, 0],
        },
	],
    TURRETS: [
      {
            POSITION: [20, 1, 0, 0, 360, 1],
            TYPE: [ "HeliDeco1", { COLOR: "#42b4ec" } ],
        },
        {
            POSITION: [24, 1, 0, 0, 360, 1],
            TYPE: [ "HeliDeco2", ],
        },
        {
            POSITION: [20, -4, 0, 0, 360, 1],
            TYPE: [ "HeliDeco3", ],
        },
        {
            POSITION: [20, -36, 0, 0, 360, 1],
            TYPE: [ "HeliDeco4", ],
        },
        {
          POSITION: [22, 0, 0, 0, 360, 0],
            TYPE: [ "HeliDeco5", ],
        },
        {
          POSITION: [18, 0, 0, 0, 360, 1],
            TYPE: [ "HeliDeco5", ],
        },
        {
            POSITION: [20, 1, 0, 0, 360, 1],
            TYPE: [ "HeliDeco6", ],
        },
        {
            POSITION: [15, 0, 0, 0, 360, 1],
            TYPE: [ "propeller", { COLOR: "#5C533F" } ],
        },
    ]
}
Class.JJstestbed = {
    PARENT: "genericTank",
    LABEL: "J.J.'s Military menu",
    BODY: {
        SHIELD: 1000,
        REGEN: 10,
        HEALTH: 100,
        DAMAGE: 10,
        DENSITY: 20,
        FOV: 2,
    },
    SKILL_CAP: Array(10).fill(dfltskl),
    IGNORED_BY_AI: true,
    RESET_CHILDREN: true,
    ACCEPTS_SCORE: true,
    CAN_BE_ON_LEADERBOARD: true,
    CAN_GO_OUTSIDE_ROOM: false,
    IS_IMMUNE_TO_TILES: false,
    DRAW_HEALTH: true,
    IGNORE_COLLISION: true,
    INVISIBLE: [0, 0],
    COLOR: "#ff9900",
    ALPHA: [0, 1],
    HITS_OWN_TYPE: "hardOnlyTanks",
    SHAPE: 6,
    GUNS: [
        {
            POSITION: [18, 10, -1.4, 0, 4, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.op, g.greaterDamage]),
                TYPE: "developerBullet"
            },
        },
      {
        POSITION: [18, 10, -1.4, 0, -4, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.op, g.greaterDamage]),
                TYPE: "developerBullet"
            },
        },
      {
              POSITION: [20, 10, -1.4, 0, 0, 0, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.op, g.greaterDamage]),
                TYPE: "developerBullet"
            }
        }
    ]
};
Class.tanksnshit = {
    PARENT: "genericTank",
    LABEL: "Military",
};
Class.ActualTanks = {
    PARENT: "genericTank",
    LABEL: "Tanks",
};
Class.ActualTanks2 = {
    PARENT: "genericTank",
    LABEL: "Tanks - Page 2",
};
Class.ActualunrealTanks = {
    PARENT: "genericTank",
    LABEL: "DumpstrFire",
    TOOLTIP: 'I done fucked up.',
};
Class.ActualCopters = {
    PARENT: "genericTank",
    LABEL:  "Helicopters",
};
Class.ActualMechs = {
    PARENT: "genericTank",
    LABEL:  "Mechs (comming soon)",
};
Class.ActualJets = {
    PARENT: "genericTank",
    LABEL:  "Jets",
};
Class.tanksnshit.UPGRADES_TIER_0 = ["ActualTanks", "ActualunrealTanks", "ActualCopters", "ActualMechs", "ActualJets",]
Class.ActualTanks.UPGRADES_TIER_0 = ["literallyATank", "MMT", "HAGU", "TTV1", "TTV2", "TM", "ES", "PT", "Daze", "MG","ActualTanks2"]
Class.ActualTanks2.UPGRADES_TIER_0 = ["krisButTank"]
Class.ActualJets.UPGRADES_TIER_0 = ["VulcanCarrier", "StealthBomber"]
Class.ActualCopters.UPGRADES_TIER_0 = ["literallyAHelicopter", "skyraider", "eliteraider", "apacheGunship",]
Class.ActualunrealTanks.UPGRADES_TIER_0 = ["Legalizenuclearbombs", "skynuker", "superBomber",]