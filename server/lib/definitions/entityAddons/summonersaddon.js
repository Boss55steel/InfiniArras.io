const { combineStats, addAura, makeAuto, weaponArray, dereference } = require('../facilitators.js');
const { base } = require('../constants.js');
const g = require('../gunvals.js');

// SORC
Class.betaminichip = {
    PARENT: "minichip",
    PROPS: [
        {
            POSITION: [10, 0, 0, 0, 360, 1],
            TYPE: "egg",
        },
    ],
}
Class.alphaminichip = {
    PARENT: "minichip",
    PROPS: [
        {
            POSITION: [11, 0, 0, 0, 360, 1],
            TYPE: "egg",
        },
        {
            POSITION: [6, 0, 0, 0, 360, 1],
            TYPE: "egg",
        },
    ],
}
Class.omegaminichip = {
    PARENT: "minichip",
    PROPS: [
        {
            POSITION: [10, 0, 0, 0, 360, 1],
            TYPE: "egg",
        },
        {
            POSITION: [5, 0, 0, 0, 360, 1],
            TYPE: "egg",
        },
        {
            POSITION: [2.5, 0, 0, 0, 360, 1],
            TYPE: "egg",
        },
    ],
}
// SUM
Class.betaSummonerDrone = {
    PARENT: "summonerDrone",
    PROPS: [
        {
            POSITION: [14, 0, 0, 45, 360, 1],
            TYPE: "square",
        },
    ],
}
Class.alphaSummonerDrone = {
    PARENT: "summonerDrone",
    PROPS: [
        {
            POSITION: [14, 0, 0, 45, 360, 1],
            TYPE: "square",
        },
        {
            POSITION: [9.5, 0, 0, 0, 360, 1],
            TYPE: "square",
        },
    ],
}
Class.omegaSummonerDrone = {
    PARENT: "summonerDrone",
    PROPS: [
        {
            POSITION: [14, 0, 0, 45, 360, 1],
            TYPE: "square",
        },
        {
            POSITION: [9.5, 0, 0, 0, 360, 1],
            TYPE: "square",
        },
        {
            POSITION: [6.7, 0, 0, 45, 360, 1],
            TYPE: "square",
        },
    ],
}
//ENCHAN
Class.betaDorito = {
    PARENT: "dorito",
    PROPS: [
        {
            POSITION: [10, 0, 0, 60, 360, 1],
            TYPE: "triangle",
        },
    ],
}
Class.alphaDorito = {
    PARENT: "dorito",
    PROPS: [
        {
            POSITION: [10, 0, 0, 60, 360, 1],
            TYPE: "triangle",
        },
        {
            POSITION: [5, 0, 0, 0, 360, 1],
            TYPE: "triangle",
        },
    ],
}
Class.omegaDorito = {
    PARENT: "dorito",
    PROPS: [
        {
            POSITION: [10, 0, 0, 60, 360, 1],
            TYPE: "triangle",
        },
        {
            POSITION: [5, 0, 0, 0, 360, 1],
            TYPE: "triangle",
        },
        {
            POSITION: [2.5, 0, 0, 60, 360, 1],
            TYPE: "triangle",
        },
    ],
}
// EXSOR
Class.betademonchip = {
    PARENT: "demonchip",
    PROPS: [
        {
            POSITION: [16, 0, 0, 35, 360, 1],
            TYPE: "pentagon",
        },
    ],
}
Class.alphademonchip = {
    PARENT: "demonchip",
    PROPS: [
        {
            POSITION: [16, 0, 0, 35, 360, 1],
            TYPE: "pentagon",
        },
        {
            POSITION: [13, 0, 0, 0, 360, 1],
            TYPE: "pentagon",
        },
    ],
}
Class.omegademonchip = {
    PARENT: "demonchip",
    PROPS: [
        {
            POSITION: [16, 0, 0, 35, 360, 1],
            TYPE: "pentagon",
        },
        {
            POSITION: [13, 0, 0, 0, 360, 1],
            TYPE: "pentagon",
        },
        {
            POSITION: [10.5, 0, 0, 35, 360, 1],
            TYPE: "pentagon",
        },
    ],
}
// SHAM
Class.betarealchip = {
    PARENT: "realchip",
    PROPS: [
        {
            POSITION: [17, 0, 0, 90, 360, 1],
            TYPE: "hexagon",
        },
    ],
}
Class.alpharealchip = {
    PARENT: "realchip",
    PROPS: [
        {
            POSITION: [17, 0, 0, 90, 360, 1],
            TYPE: "hexagon",
        },
        {
            POSITION: [14.5, 0, 0, 0, 360, 1],
            TYPE: "hexagon",
        },
    ],
}
Class.omegarealchip = {
    PARENT: "realchip",
    PROPS: [
        {
            POSITION: [17, 0, 0, 90, 360, 1],
            TYPE: "hexagon",
        },
        {
            POSITION: [14.5, 0, 0, 0, 360, 1],
            TYPE: "hexagon",
        },
        {
            POSITION: [12.5, 0, 0, 90, 360, 1],
            TYPE: "hexagon",
        },
    ],
}

// BOSSES
Class.betasorcerer = {
    PARENT: "miniboss",
    LABEL: "Beta Sorcerer",
    DANGER: 7,
    SHAPE: 0,
    COLOR: "veryLightGrey",
    UPGRADE_COLOR: "veryLightGrey",
    SIZE: 30,
    MAX_CHILDREN: 58,
    VALUE: 2e5,
    PROPS: [
        {
            POSITION: [10, 0, 0, 0, 360, 1],
            TYPE: "egg",
        },
    ],
    BODY: {
        FOV: 0.5,
        SPEED: 0.12 * base.SPEED,
        HEALTH: 10.5 * base.HEALTH,
        DAMAGE: 2.3 * base.DAMAGE,
    },
   GUNS: weaponArray([
         {
         POSITION: [ 2.3, 6.65, 1.2, 8, -2.5, 0, 0, ],
         PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.drone, g.summoner, { damage: 1.8, size: 0.4, spray: 150, speed: 2, shudder: 1.75 }]),
            TYPE: "minichip",
            AUTOFIRE: true,
            SYNCS_SKILLS: true,
            STAT_CALCULATOR: "drone",
            WAIT_TO_CYCLE: true,
         }, }, {
         POSITION: [ 2.3, 6.65, 1.2, 8, 2.5, 0, 0, ],
         PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.drone, g.summoner, { damage: 1.8, size: 0.4, spray: 150, speed: 2, shudder: 1.75 }]),
            TYPE: "minichip",
            AUTOFIRE: true,
            SYNCS_SKILLS: true,
            STAT_CALCULATOR: "drone",
            WAIT_TO_CYCLE: true,
         }, }, {
         POSITION: [ 3.5, 8.65, 1.2, 8, 0, 0, 0, ],
         PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.drone, g.summoner, { damage: 2, health: 1.1, size: 0.5, spray: 150, speed: 2.2, shudder: 1.75, reload: 1.1 }]),
            TYPE: "betaminichip",
            AUTOFIRE: true,
            SYNCS_SKILLS: true,
            STAT_CALCULATOR: "drone",
            WAIT_TO_CYCLE: true,
         }, }, 
     ], 2)
};
Class.alphasorcerer = {
    PARENT: "miniboss",
    LABEL: "Alpha Sorcerer",
    DANGER: 7,
    SHAPE: 0,
    COLOR: "veryLightGrey",
    UPGRADE_COLOR: "veryLightGrey",
    SIZE: 36,
    MAX_CHILDREN: 64,
    VALUE: 2e5,
    PROPS: [
        {
            POSITION: [11, 0, 0, 0, 360, 1],
            TYPE: "egg",
        },
        {
            POSITION: [6, 0, 0, 0, 360, 1],
            TYPE: "egg",
        },
    ],
    BODY: {
        FOV: 0.5,
        SPEED: 0.12 * base.SPEED,
        HEALTH: 14.5 * base.HEALTH,
        DAMAGE: 2.75 * base.DAMAGE,
    },
   GUNS: weaponArray([
         {
         POSITION: [ 1.75, 6.65, 1.2, 8, -3.35, 0, 0, ],
         PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.drone, g.summoner, { damage: 1.8, size: 0.25, spray: 150, speed: 2, shudder: 1.75 }]),
            TYPE: "minichip",
            AUTOFIRE: true,
            SYNCS_SKILLS: true,
            STAT_CALCULATOR: "drone",
            WAIT_TO_CYCLE: true,
         }, }, {
         POSITION: [ 1.75, 6.65, 1.2, 8, 3.35, 0, 0, ],
         PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.drone, g.summoner, { damage: 1.8, size: 0.25, spray: 150, speed: 2, shudder: 1.75 }]),
            TYPE: "minichip",
            AUTOFIRE: true,
            SYNCS_SKILLS: true,
            STAT_CALCULATOR: "drone",
            WAIT_TO_CYCLE: true,
         }, }, {
         POSITION: [ 2.3, 6.65, 1.2, 8, -2.5, 0, 0, ],
         PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.drone, g.summoner, { damage: 2, health: 1.1, size: 0.55, spray: 150, speed: 2.2, shudder: 1.75, reload: 1.1 }]),
            TYPE: "betaminichip",
            AUTOFIRE: true,
            SYNCS_SKILLS: true,
            STAT_CALCULATOR: "drone",
            WAIT_TO_CYCLE: true,
         }, }, {
         POSITION: [ 2.3, 6.65, 1.2, 8, 2.5, 0, 0, ],
         PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.drone, g.summoner, { damage: 2, health: 1.1, size: 0.55, spray: 150, speed: 2.2, shudder: 1.75, reload: 1.1 }]),
            TYPE: "betaminichip",
            AUTOFIRE: true,
            SYNCS_SKILLS: true,
            STAT_CALCULATOR: "drone",
            WAIT_TO_CYCLE: true,
         }, }, {
         POSITION: [ 3.5, 8.65, 1.2, 8, 0, 0, 0, ],
         PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.drone, g.summoner, { damage: 2.25, health: 1.2, size: 0.75, spray: 150, speed: 2.25, shudder: 1.75, reload: 1.15 }]),
            TYPE: "alphaminichip",
            AUTOFIRE: true,
            SYNCS_SKILLS: true,
            STAT_CALCULATOR: "drone",
            WAIT_TO_CYCLE: true,
         }, }, 
     ], 2)
};
Class.omegasorcerer = {
    PARENT: "miniboss",
    LABEL: "Omega Sorcerer",
    DANGER: 7,
    SHAPE: 0,
    COLOR: "veryLightGrey",
    UPGRADE_COLOR: "veryLightGrey",
    SIZE: 47,
    MAX_CHILDREN: 76,
    VALUE: 2e5,
    PROPS: [
        {
            POSITION: [10, 0, 0, 0, 360, 1],
            TYPE: "egg",
        },
        {
            POSITION: [5, 0, 0, 0, 360, 1],
            TYPE: "egg",
        },
        {
            POSITION: [2.5, 0, 0, 0, 360, 1],
            TYPE: "egg",
        },
    ],
    BODY: {
        FOV: 0.5,
        SPEED: 0.12 * base.SPEED,
        HEALTH: 20 * base.HEALTH,
        DAMAGE: 3 * base.DAMAGE,
    },
   GUNS: weaponArray([
         {
         POSITION: [ 1.75, 6.65, 1.2, 8, -3.35, 0, 0, ],
         PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.drone, g.summoner, { damage: 2, health: 1.1, size: 0.45, spray: 150, speed: 2.2, shudder: 1.75, reload: 1.1 }]),
            TYPE: "betaminichip",
            AUTOFIRE: true,
            SYNCS_SKILLS: true,
            STAT_CALCULATOR: "drone",
            WAIT_TO_CYCLE: true,
         }, }, {
         POSITION: [ 1.75, 6.65, 1.2, 8, 3.35, 0, 0, ],
         PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.drone, g.summoner, { damage: 2, health: 1.1, size: 0.45, spray: 150, speed: 2.2, shudder: 1.75, reload: 1.1 }]),
            TYPE: "betaminichip",
            AUTOFIRE: true,
            SYNCS_SKILLS: true,
            STAT_CALCULATOR: "drone",
            WAIT_TO_CYCLE: true,
         }, }, {
         POSITION: [ 2.3, 6.65, 1.2, 8, -2.5, 0, 0, ],
         PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.drone, g.summoner, { damage: 2.25, health: 1.2, size: 0.8, spray: 150, speed: 2.25, shudder: 1.75, reload: 1.15 }]),
            TYPE: "alphaminichip",
            AUTOFIRE: true,
            SYNCS_SKILLS: true,
            STAT_CALCULATOR: "drone",
            WAIT_TO_CYCLE: true,
         }, }, {
         POSITION: [ 2.3, 6.65, 1.2, 8, 2.5, 0, 0, ],
         PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.drone, g.summoner, { damage: 2.25, health: 1.2, size: 0.8, spray: 150, speed: 2.25, shudder: 1.75, reload: 1.15 }]),
            TYPE: "alphaminichip",
            AUTOFIRE: true,
            SYNCS_SKILLS: true,
            STAT_CALCULATOR: "drone",
            WAIT_TO_CYCLE: true,
         }, }, {
         POSITION: [ 3.5, 8.65, 1.2, 8, 0, 0, 0, ],
         PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.drone, g.summoner, { damage: 2.65, health: 1.45, size: 0.85, spray: 150, speed: 2.45, shudder: 1.9, reload: 1.25 }]),
            TYPE: "omegaminichip",
            AUTOFIRE: true,
            SYNCS_SKILLS: true,
            STAT_CALCULATOR: "drone",
            WAIT_TO_CYCLE: true,
         }, }, 
     ], 2)
};
// SUM
Class.betaSummoner = {
   PARENT: "miniboss",
   LABEL: "Beta Summoner",
   DANGER: 8,
   SHAPE: 4,
   COLOR: "gold",
   UPGRADE_COLOR: "gold",
   SIZE: 29.5,
   MAX_CHILDREN: 38,
   VALUE: 3e5,
   PROPS: [
        {
            POSITION: [14, 0, 0, 45, 360, 1],
            TYPE: "square",
        },
   ],
   BODY: {
        FOV: 0.5,
        SPEED: 0.1 * base.SPEED,
        HEALTH: 13.5 * base.HEALTH,
        DAMAGE: 2.95 * base.DAMAGE,
   },
   GUNS: weaponArray([
         {
         POSITION: [ 2.75, 6.65, 1.2, 8, -2.5, 0, 0, ],
         PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.drone, g.summoner, { size: 0.9, damage: 0.9, health: 0.85 }]),
            TYPE: "summonerDrone",
            AUTOFIRE: true,
            SYNCS_SKILLS: true,
            STAT_CALCULATOR: "drone",
            WAIT_TO_CYCLE: true,
         }, }, {
         POSITION: [ 2.75, 6.65, 1.2, 8, 2.5, 0, 0, ],
         PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.drone, g.summoner, { size: 0.9, damage: 0.9, health: 0.85 }]),
            TYPE: "summonerDrone",
            AUTOFIRE: true,
            SYNCS_SKILLS: true,
            STAT_CALCULATOR: "drone",
            WAIT_TO_CYCLE: true,
         }, }, {
         POSITION: [ 3.5, 8.65, 1.2, 8, 0, 0, 0, ],
         PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.drone, g.summoner, { size: 1, damage: 1.2, health: 1.1, reload: 1.1 }]),
            TYPE: "betaSummonerDrone",
            AUTOFIRE: true,
            SYNCS_SKILLS: true,
            STAT_CALCULATOR: "drone",
            WAIT_TO_CYCLE: true,
         }, }, 
     ], 4)
};
Class.alphaSummoner = {
   PARENT: "miniboss",
   LABEL: "Alpha Summoner",
   DANGER: 8,
   SHAPE: 4,
   COLOR: "gold",
   UPGRADE_COLOR: "gold",
   SIZE: 37.5,
   MAX_CHILDREN: 46,
   VALUE: 3e5,
   PROPS: [
        {
            POSITION: [14, 0, 0, 45, 360, 1],
            TYPE: "square",
        },
        {
            POSITION: [9.5, 0, 0, 0, 360, 1],
            TYPE: "square",
        },
   ],
   BODY: {
        FOV: 0.5,
        SPEED: 0.1 * base.SPEED,
        HEALTH: 19.85 * base.HEALTH,
        DAMAGE: 3.1 * base.DAMAGE,
   },
   GUNS: weaponArray([
         {
         POSITION: [ 2.1, 6.65, 1.2, 8, -3.35, 0, 0, ],
         PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.drone, g.summoner, { size: 0.75, damage: 0.9, health: 0.85 }]),
            TYPE: "summonerDrone",
            AUTOFIRE: true,
            SYNCS_SKILLS: true,
            STAT_CALCULATOR: "drone",
            WAIT_TO_CYCLE: true,
         }, }, {
         POSITION: [ 2.1, 6.65, 1.2, 8, 3.35, 0, 0, ],
         PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.drone, g.summoner, { size: 0.75, damage: 0.9, health: 0.85 }]),
            TYPE: "summonerDrone",
            AUTOFIRE: true,
            SYNCS_SKILLS: true,
            STAT_CALCULATOR: "drone",
            WAIT_TO_CYCLE: true,
         }, }, {
         POSITION: [ 2.75, 6.65, 1.2, 8, -2.5, 0, 0, ],
         PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.drone, g.summoner, { size: 0.9, damage: 1.2, health: 1.1, reload: 1.1 }]),
            TYPE: "betaSummonerDrone",
            AUTOFIRE: true,
            SYNCS_SKILLS: true,
            STAT_CALCULATOR: "drone",
            WAIT_TO_CYCLE: true,
         }, }, {
         POSITION: [ 2.75, 6.65, 1.2, 8, 2.5, 0, 0, ],
         PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.drone, g.summoner, { size: 0.9, damage: 1.2, health: 1.1, reload: 1.1 }]),
            TYPE: "betaSummonerDrone",
            AUTOFIRE: true,
            SYNCS_SKILLS: true,
            STAT_CALCULATOR: "drone",
            WAIT_TO_CYCLE: true,
         }, }, {
         POSITION: [ 3.5, 8.65, 1.2, 8, 0, 0, 0, ],
         PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.drone, g.summoner, { size: 0.95, damage: 1.385, health: 1.25, reload: 1.2 }]),
            TYPE: "alphaSummonerDrone",
            AUTOFIRE: true,
            SYNCS_SKILLS: true,
            STAT_CALCULATOR: "drone",
            WAIT_TO_CYCLE: true,
         }, }, 
     ], 4)
};
Class.omegaSummoner = {
   PARENT: "miniboss",
   LABEL: "Omega Summoner",
   DANGER: 8,
   SHAPE: 4,
   COLOR: "gold",
   UPGRADE_COLOR: "gold",
   SIZE: 44.5,
   MAX_CHILDREN: 51,
   VALUE: 3e5,
   PROPS: [
        {
            POSITION: [14, 0, 0, 45, 360, 1],
            TYPE: "square",
        },
        {
            POSITION: [9.5, 0, 0, 0, 360, 1],
            TYPE: "square",
        },
        {
            POSITION: [6.7, 0, 0, 45, 360, 1],
            TYPE: "square",
        },
   ],
   BODY: {
        FOV: 0.5,
        SPEED: 0.1 * base.SPEED,
        HEALTH: 19.85 * base.HEALTH,
        DAMAGE: 3.1 * base.DAMAGE,
   },
   GUNS: weaponArray([
         {
         POSITION: [ 2.1, 6.65, 1.2, 8, -3.35, 0, 0, ],
         PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.drone, g.summoner, { size: 0.85, damage: 1.2, health: 1.1, reload: 1.1 }]),
            TYPE: "betaSummonerDrone",
            AUTOFIRE: true,
            SYNCS_SKILLS: true,
            STAT_CALCULATOR: "drone",
            WAIT_TO_CYCLE: true,
         }, }, {
         POSITION: [ 2.1, 6.65, 1.2, 8, 3.35, 0, 0, ],
         PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.drone, g.summoner, { size: 0.85, damage: 1.2, health: 1.1, reload: 1.1 }]),
            TYPE: "betaSummonerDrone",
            AUTOFIRE: true,
            SYNCS_SKILLS: true,
            STAT_CALCULATOR: "drone",
            WAIT_TO_CYCLE: true,
         }, }, {
         POSITION: [ 2.75, 6.65, 1.2, 8, -2.5, 0, 0, ],
         PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.drone, g.summoner, { size: 1.1, damage: 1.385, health: 1.25, reload: 1.2 }]),
            TYPE: "alphaSummonerDrone",
            AUTOFIRE: true,
            SYNCS_SKILLS: true,
            STAT_CALCULATOR: "drone",
            WAIT_TO_CYCLE: true,
         }, }, {
         POSITION: [ 2.75, 6.65, 1.2, 8, 2.5, 0, 0, ],
         PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.drone, g.summoner, { size: 1.1, damage: 1.385, health: 1.25, reload: 1.2 }]),
            TYPE: "alphaSummonerDrone",
            AUTOFIRE: true,
            SYNCS_SKILLS: true,
            STAT_CALCULATOR: "drone",
            WAIT_TO_CYCLE: true,
         }, }, {
         POSITION: [ 3.5, 8.65, 1.2, 8, 0, 0, 0, ],
         PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.drone, g.summoner, { size: 1.1, damage: 1.55, health: 1.4, reload: 1.35 }]),
            TYPE: "omegaSummonerDrone",
            AUTOFIRE: true,
            SYNCS_SKILLS: true,
            STAT_CALCULATOR: "drone",
            WAIT_TO_CYCLE: true,
         }, }, 
     ], 4)
};
// ENCHAN
Class.betaEnchantress = {
    PARENT: "miniboss",
    LABEL: "Beta Enchantress",
    DANGER: 8,
    SHAPE: 3.5,
    COLOR: "orange",
    UPGRADE_COLOR: "orange",
    SIZE: 31,
    MAX_CHILDREN: 34,
    VALUE: 4e5,
    PROPS: [
        {
            POSITION: [10, 0, 0, 120, 360, 1],
            TYPE: "triangle",
        },
    ],
    BODY: {
        FOV: 0.5,
        SPEED: 0.09 * base.SPEED,
        HEALTH: 16.5 * base.HEALTH,
        DAMAGE: 3.2 * base.DAMAGE,
    },
   GUNS: weaponArray([
         {
         POSITION: [ 2.5, 8.65, 1.2, 8, -2, 0, 0, ],
         PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.drone, g.summoner, { size: 0.5, damage: 1.1 }]),
            TYPE: "dorito",
            AUTOFIRE: true,
            SYNCS_SKILLS: true,
            STAT_CALCULATOR: "drone",
            WAIT_TO_CYCLE: true,
         }, }, {
         POSITION: [ 2.5, 8.65, 1.2, 8, 2, 0, 0, ],
         PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.drone, g.summoner, { size: 0.5, damage: 1.1 }]),
            TYPE: "dorito",
            AUTOFIRE: true,
            SYNCS_SKILLS: true,
            STAT_CALCULATOR: "drone",
            WAIT_TO_CYCLE: true,
         }, }, {
         POSITION: [ 3.5, 8.65, 1.2, 8, 0, 0, 0, ],
         PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.drone, g.summoner, { size: 0.65, damage: 1.25, health: 1.15, reload: 1.1 }]),
            TYPE: "betaDorito",
            AUTOFIRE: true,
            SYNCS_SKILLS: true,
            STAT_CALCULATOR: "drone",
            WAIT_TO_CYCLE: true,
         }, }, 
     ], 3)
};
Class.alphaEnchantress = {
    PARENT: "miniboss",
    LABEL: "Alpha Enchantress",
    DANGER: 8,
    SHAPE: 3.5,
    COLOR: "orange",
    UPGRADE_COLOR: "orange",
    SIZE: 39,
    MAX_CHILDREN: 38,
    VALUE: 4e5,
    PROPS: [
        {
            POSITION: [10, 0, 0, 120, 360, 1],
            TYPE: "triangle",
        },
        {
            POSITION: [5, 0, 0, 60, 360, 1],
            TYPE: "triangle",
        },
    ],
    BODY: {
        FOV: 0.5,
        SPEED: 0.09 * base.SPEED,
        HEALTH: 23.5 * base.HEALTH,
        DAMAGE: 3.55 * base.DAMAGE,
    },
   GUNS: weaponArray([
         {
         POSITION: [ 1.75, 8.65, 1.2, 8, -3.25, 0, 0, ],
         PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.drone, g.summoner, { size: 0.35, damage: 1.1 }]),
            TYPE: "dorito",
            AUTOFIRE: true,
            SYNCS_SKILLS: true,
            STAT_CALCULATOR: "drone",
            WAIT_TO_CYCLE: true,
         }, }, {
         POSITION: [ 1.75, 8.65, 1.2, 8, 3.25, 0, 0, ],
         PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.drone, g.summoner, { size: 0.35, damage: 1.1 }]),
            TYPE: "dorito",
            AUTOFIRE: true,
            SYNCS_SKILLS: true,
            STAT_CALCULATOR: "drone",
            WAIT_TO_CYCLE: true,
         }, }, {
         POSITION: [ 2.5, 8.65, 1.2, 8, -2, 0, 0, ],
         PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.drone, g.summoner, { size: 0.55, damage: 1.25, health: 1.15, reload: 1.1 }]),
            TYPE: "betaDorito",
            AUTOFIRE: true,
            SYNCS_SKILLS: true,
            STAT_CALCULATOR: "drone",
            WAIT_TO_CYCLE: true,
         }, }, {
         POSITION: [ 2.5, 8.65, 1.2, 8, 2, 0, 0, ],
         PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.drone, g.summoner, { size: 0.55, damage: 1.25, health: 1.15, reload: 1.1 }]),
            TYPE: "betaDorito",
            AUTOFIRE: true,
            SYNCS_SKILLS: true,
            STAT_CALCULATOR: "drone",
            WAIT_TO_CYCLE: true,
         }, }, {
         POSITION: [ 3.5, 8.65, 1.2, 8, 0, 0, 0, ],
         PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.drone, g.summoner, { size: 1.05, damage: 1.45, health: 1.35, reload: 1.235 }]),
            TYPE: "alphaDorito",
            AUTOFIRE: true,
            SYNCS_SKILLS: true,
            STAT_CALCULATOR: "drone",
            WAIT_TO_CYCLE: true,
         }, }, 
     ], 3)
};
Class.omegaEnchantress = {
    PARENT: "miniboss",
    LABEL: "Omega Enchantress",
    DANGER: 8,
    SHAPE: 3.5,
    COLOR: "orange",
    UPGRADE_COLOR: "orange",
    SIZE: 49.5,
    MAX_CHILDREN: 46,
    VALUE: 4e5,
    BODY: {
        FOV: 0.5,
        SPEED: 0.09 * base.SPEED,
        HEALTH: 36.5 * base.HEALTH,
        DAMAGE: 4 * base.DAMAGE,
    },
    PROPS: [
        {
            POSITION: [10, 0, 0, 120, 360, 1],
            TYPE: "triangle",
        },
        {
            POSITION: [5, 0, 0, 60, 360, 1],
            TYPE: "triangle",
        },
        {
            POSITION: [2.5, 0, 0, 120, 360, 1],
            TYPE: "triangle",
        },
    ],
    GUNS: weaponArray([
         {
         POSITION: [ 1.75, 8.65, 1.2, 8, -3.25, 0, 0, ],
         PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.drone, g.summoner, { size: 0.45, damage: 1.25, health: 1.15, reload: 1.1 }]),
            TYPE: "betaDorito",
            AUTOFIRE: true,
            SYNCS_SKILLS: true,
            STAT_CALCULATOR: "drone",
            WAIT_TO_CYCLE: true,
         }, }, {
         POSITION: [ 1.75, 8.65, 1.2, 8, 3.25, 0, 0, ],
         PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.drone, g.summoner, { size: 0.45, damage: 1.25, health: 1.15, reload: 1.1 }]),
            TYPE: "betaDorito",
            AUTOFIRE: true,
            SYNCS_SKILLS: true,
            STAT_CALCULATOR: "drone",
            WAIT_TO_CYCLE: true,
         }, }, {
         POSITION: [ 2.5, 8.65, 1.2, 8, -2, 0, 0, ],
         PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.drone, g.summoner, { size: 0.8, damage: 1.45, health: 1.35, reload: 1.235 }]),
            TYPE: "alphaDorito",
            AUTOFIRE: true,
            SYNCS_SKILLS: true,
            STAT_CALCULATOR: "drone",
            WAIT_TO_CYCLE: true,
         }, }, {
         POSITION: [ 2.5, 8.65, 1.2, 8, 2, 0, 0, ],
         PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.drone, g.summoner, { size: 0.8, damage: 1.45, health: 1.35, reload: 1.235 }]),
            TYPE: "alphaDorito",
            AUTOFIRE: true,
            SYNCS_SKILLS: true,
            STAT_CALCULATOR: "drone",
            WAIT_TO_CYCLE: true,
         }, }, {
         POSITION: [ 3.5, 8.65, 1.2, 8, 0, 0, 0, ],
         PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.drone, g.summoner, { size: 1.45, damage: 1.8, health: 1.85, reload: 1.36 }]),
            TYPE: "omegaDorito",
            AUTOFIRE: true,
            SYNCS_SKILLS: true,
            STAT_CALCULATOR: "drone",
            WAIT_TO_CYCLE: true,
         }, }, 
     ], 3)
};
// EXSOR
Class.betaexorcistor = {
    PARENT: "miniboss",
    LABEL: "Beta Exorcistor",
    DANGER: 8,
    SHAPE: 5.5,
    COLOR: "purple",
    UPGRADE_COLOR: "purple",
    SIZE: 31.5,
    MAX_CHILDREN: 27,
    VALUE: 5e5,
    PROPS: [
        {
            POSITION: [16, 0, 0, 70, 360, 1],
            TYPE: "pentagon",
        },
    ],
    BODY: {
        FOV: 0.5,
        SPEED: 0.08 * base.SPEED,
        HEALTH: 23.5 * base.HEALTH,
        DAMAGE: 4.35 * base.DAMAGE,
    },
    GUNS: weaponArray([
         {
         POSITION: [ 3, 8.65, 1.2, 8, 1, 0, 0, ],
         PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.drone, g.summoner, g.destroyer, {maxSpeed: 1.2}]),
            TYPE: "demonchip",
            AUTOFIRE: true,
            SYNCS_SKILLS: true,
            STAT_CALCULATOR: "drone",
            WAIT_TO_CYCLE: true,
         }, }, {
         POSITION: [ 3, 8.65, 1.2, 8, -1, 0, 0, ],
         PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.drone, g.summoner, g.destroyer, {maxSpeed: 1.2}]),
            TYPE: "demonchip",
            AUTOFIRE: true,
            SYNCS_SKILLS: true,
            STAT_CALCULATOR: "drone",
            WAIT_TO_CYCLE: true,
         }, }, {
         POSITION: [ 3.5, 8.65, 1.2, 8, 0, 0, 0, ],
         PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.drone, g.summoner, g.destroyer, {maxSpeed: 1.2, damage: 1.15, health: 1.2, reload: 1.1, size: 1.25}]),
            TYPE: "betademonchip",
            AUTOFIRE: true,
            SYNCS_SKILLS: true,
            STAT_CALCULATOR: "drone",
            WAIT_TO_CYCLE: true,
         }, }, 
     ], 5)
};
Class.alphaexorcistor = {
    PARENT: "miniboss",
    LABEL: "Alpha Exorcistor",
    DANGER: 8,
    SHAPE: 5.5,
    COLOR: "purple",
    UPGRADE_COLOR: "purple",
    SIZE: 38.5,
    MAX_CHILDREN: 34,
    VALUE: 5e5,
    PROPS: [
        {
            POSITION: [16, 0, 0, 70, 360, 1],
            TYPE: "pentagon",
        },
        {
            POSITION: [13, 0, 0, 35, 360, 1],
            TYPE: "pentagon",
        },
    ],
    BODY: {
        FOV: 0.5,
        SPEED: 0.08 * base.SPEED,
        HEALTH: 31.5 * base.HEALTH,
        DAMAGE: 4.65 * base.DAMAGE,
    },
    GUNS: weaponArray([
         {
         POSITION: [ 2.35, 8.65, 1.2, 8, 1.5, 0, 0, ],
         PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.drone, g.summoner, g.destroyer, {maxSpeed: 1.2, size: 0.9}]),
            TYPE: "demonchip",
            AUTOFIRE: true,
            SYNCS_SKILLS: true,
            STAT_CALCULATOR: "drone",
            WAIT_TO_CYCLE: true,
         }, }, {
         POSITION: [ 2.35, 8.65, 1.2, 8, -1.5, 0, 0, ],
         PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.drone, g.summoner, g.destroyer, {maxSpeed: 1.2, size: 0.9}]),
            TYPE: "demonchip",
            AUTOFIRE: true,
            SYNCS_SKILLS: true,
            STAT_CALCULATOR: "drone",
            WAIT_TO_CYCLE: true,
         }, }, {
         POSITION: [ 3, 8.65, 1.2, 8, 1, 0, 0, ],
         PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.drone, g.summoner, g.destroyer, {maxSpeed: 1.2, damage: 1.15, health: 1.2, reload: 1.1, size: 1}]),
            TYPE: "betademonchip",
            AUTOFIRE: true,
            SYNCS_SKILLS: true,
            STAT_CALCULATOR: "drone",
            WAIT_TO_CYCLE: true,
         }, }, {
         POSITION: [ 3, 8.65, 1.2, 8, -1, 0, 0, ],
         PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.drone, g.summoner, g.destroyer, {maxSpeed: 1.2, damage: 1.15, health: 1.2, reload: 1.1, size: 1}]),
            TYPE: "betademonchip",
            AUTOFIRE: true,
            SYNCS_SKILLS: true,
            STAT_CALCULATOR: "drone",
            WAIT_TO_CYCLE: true,
         }, }, {
         POSITION: [ 3.5, 8.65, 1.2, 8, 0, 0, 0, ],
         PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.drone, g.summoner, g.destroyer, {maxSpeed: 1.2, damage: 1.35, health: 1.45, reload: 1.3, size: 1.25}]),
            TYPE: "alphademonchip",
            AUTOFIRE: true,
            SYNCS_SKILLS: true,
            STAT_CALCULATOR: "drone",
            WAIT_TO_CYCLE: true,
         }, }, 
     ], 5)
};
Class.omegaexorcistor = {
    PARENT: "miniboss",
    LABEL: "Omega Exorcistor",
    DANGER: 8,
    SHAPE: 5.5,
    COLOR: "purple",
    UPGRADE_COLOR: "purple",
    SIZE: 48.5,
    MAX_CHILDREN: 42,
    VALUE: 5e5,
    PROPS: [
        {
            POSITION: [16, 0, 0, 70, 360, 1],
            TYPE: "pentagon",
        },
        {
            POSITION: [13, 0, 0, 35, 360, 1],
            TYPE: "pentagon",
        },
        {
            POSITION: [10.5, 0, 0, 70, 360, 1],
            TYPE: "pentagon",
        },
    ],
    BODY: {
        FOV: 0.5,
        SPEED: 0.08 * base.SPEED,
        HEALTH: 49.5 * base.HEALTH,
        DAMAGE: 5.15 * base.DAMAGE,
    },
    GUNS: weaponArray([
         {
         POSITION: [ 2.35, 8.65, 1.2, 8, 1.5, 0, 0, ],
         PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.drone, g.summoner, g.destroyer, {maxSpeed: 1.2, damage: 1.15, health: 1.2, reload: 1.1, size: 0.8}]),
            TYPE: "betademonchip",
            AUTOFIRE: true,
            SYNCS_SKILLS: true,
            STAT_CALCULATOR: "drone",
            WAIT_TO_CYCLE: true,
         }, }, {
         POSITION: [ 2.35, 8.65, 1.2, 8, -1.5, 0, 0, ],
         PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.drone, g.summoner, g.destroyer, {maxSpeed: 1.2, damage: 1.15, health: 1.2, reload: 1.1, size: 0.8}]),
            TYPE: "betademonchip",
            AUTOFIRE: true,
            SYNCS_SKILLS: true,
            STAT_CALCULATOR: "drone",
            WAIT_TO_CYCLE: true,
         }, }, {
         POSITION: [ 3, 8.65, 1.2, 8, 1, 0, 0, ],
         PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.drone, g.summoner, g.destroyer, {maxSpeed: 1.2, damage: 1.35, health: 1.45, reload: 1.3, size: 1}]),
            TYPE: "alphademonchip",
            AUTOFIRE: true,
            SYNCS_SKILLS: true,
            STAT_CALCULATOR: "drone",
            WAIT_TO_CYCLE: true,
         }, }, {
         POSITION: [ 3, 8.65, 1.2, 8, -1, 0, 0, ],
         PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.drone, g.summoner, g.destroyer, {maxSpeed: 1.2, damage: 1.35, health: 1.45, reload: 1.3, size: 1}]),
            TYPE: "alphademonchip",
            AUTOFIRE: true,
            SYNCS_SKILLS: true,
            STAT_CALCULATOR: "drone",
            WAIT_TO_CYCLE: true,
         }, }, {
         POSITION: [ 3.5, 8.65, 1.2, 8, 0, 0, 0, ],
         PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.drone, g.summoner, g.destroyer, {maxSpeed: 1.2, damage: 1.85, health: 1.95, reload: 1.35, size: 1.25}]),
            TYPE: "omegademonchip",
            AUTOFIRE: true,
            SYNCS_SKILLS: true,
            STAT_CALCULATOR: "drone",
            WAIT_TO_CYCLE: true,
         }, }, 
     ], 5)
};
// SHAM
Class.betashaman = {
    PARENT: "miniboss",
    LABEL: "Beta Shaman",
    DANGER: 8,
    SHAPE: 6,
    COLOR: "hexagon",
    UPGRADE_COLOR: "hexagon",
    SIZE: 31.5,
    MAX_CHILDREN: 24,
    VALUE: 6e5,
    PROPS: [
        {
            POSITION: [17, 0, 0, 90, 360, 1],
            TYPE: "hexagon",
        },
    ],
    BODY: {
        FOV: 0.5,
        SPEED: 0.07 * base.SPEED,
        HEALTH: 32.5 * base.HEALTH,
        DAMAGE: 5.25 * base.DAMAGE,
    },
    GUNS: weaponArray([
         {
         POSITION: [ 3, 8, 1.2, 8, 0.75, 0, 0, ],
         PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.drone, g.summoner, g.destroyer, {size: 1.2, maxSpeed: 1.2, damage: 1.1}]),
            TYPE: "realchip",
            AUTOFIRE: true,
            SYNCS_SKILLS: true,
            STAT_CALCULATOR: "drone",
            WAIT_TO_CYCLE: true,
         }, }, {
         POSITION: [ 3, 8, 1.2, 8, -0.75, 0, 0, ],
         PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.drone, g.summoner, g.destroyer, {size: 1.2, maxSpeed: 1.2, damage: 1.1}]),
            TYPE: "realchip",
            AUTOFIRE: true,
            SYNCS_SKILLS: true,
            STAT_CALCULATOR: "drone",
            WAIT_TO_CYCLE: true,
         }, }, {
         POSITION: [ 3.5, 8, 1.2, 8, 0, 0, 0, ],
         PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.drone, g.summoner, g.destroyer, {size: 1.335, maxSpeed: 1.2, damage: 1.3, health: 1.2, reload: 1.15}]),
            TYPE: "betarealchip",
            AUTOFIRE: true,
            SYNCS_SKILLS: true,
            STAT_CALCULATOR: "drone",
            WAIT_TO_CYCLE: true,
         }, }, 
     ], 6)
};
Class.alphashaman = {
    PARENT: "miniboss",
    LABEL: "Alpha Shaman",
    DANGER: 8,
    SHAPE: 6,
    COLOR: "hexagon",
    UPGRADE_COLOR: "hexagon",
    SIZE: 37.5,
    MAX_CHILDREN: 24,
    VALUE: 6e5,
    PROPS: [
        {
            POSITION: [17, 0, 0, 90, 360, 1],
            TYPE: "hexagon",
        },
        {
            POSITION: [14.5, 0, 0, 0, 360, 1],
            TYPE: "hexagon",
        },
    ],
    BODY: {
        FOV: 0.5,
        SPEED: 0.07 * base.SPEED,
        HEALTH: 46.5 * base.HEALTH,
        DAMAGE: 5.7 * base.DAMAGE,
    },
    GUNS: weaponArray([
         {
         POSITION: [ 3, 8, 1.2, 8, 0.75, 0, 0, ],
         PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.drone, g.summoner, g.destroyer, {size: 1.2, maxSpeed: 1.2, damage: 1.3, health: 1.2, reload: 1.15}]),
            TYPE: "betarealchip",
            AUTOFIRE: true,
            SYNCS_SKILLS: true,
            STAT_CALCULATOR: "drone",
            WAIT_TO_CYCLE: true,
         }, }, {
         POSITION: [ 3, 8, 1.2, 8, -0.75, 0, 0, ],
         PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.drone, g.summoner, g.destroyer, {size: 1.2, maxSpeed: 1.2, damage: 1.3, health: 1.2, reload: 1.15}]),
            TYPE: "betarealchip",
            AUTOFIRE: true,
            SYNCS_SKILLS: true,
            STAT_CALCULATOR: "drone",
            WAIT_TO_CYCLE: true,
         }, }, {
         POSITION: [ 3.5, 8, 1.2, 8, 0, 0, 0, ],
         PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.drone, g.summoner, g.destroyer, {size: 1.4, maxSpeed: 1.2, damage: 1.55, health: 1.56, reload: 1.295}]),
            TYPE: "alpharealchip",
            AUTOFIRE: true,
            SYNCS_SKILLS: true,
            STAT_CALCULATOR: "drone",
            WAIT_TO_CYCLE: true,
         }, }, 
     ], 6)
};
Class.omegashaman = {
    PARENT: "miniboss",
    LABEL: "Omega Shaman",
    DANGER: 8,
    SHAPE: 6,
    COLOR: "hexagon",
    UPGRADE_COLOR: "hexagon",
    SIZE: 37.5,
    MAX_CHILDREN: 24,
    VALUE: 6e5,
    PROPS: [
        {
            POSITION: [17, 0, 0, 90, 360, 1],
            TYPE: "hexagon",
        },
        {
            POSITION: [14.5, 0, 0, 0, 360, 1],
            TYPE: "hexagon",
        },
        {
            POSITION: [12.5, 0, 0, 90, 360, 1],
            TYPE: "hexagon",
        },
    ],
    BODY: {
        FOV: 0.5,
        SPEED: 0.07 * base.SPEED,
        HEALTH: 65.5 * base.HEALTH,
        DAMAGE: 6.25 * base.DAMAGE,
    },
    GUNS: weaponArray([
         {
         POSITION: [ 3, 8, 1.2, 8, 0.75, 0, 0, ],
         PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.drone, g.summoner, g.destroyer, {size: 1.45, maxSpeed: 1.2, damage: 1.55, health: 1.56, reload: 1.295}]),
            TYPE: "alpharealchip",
            AUTOFIRE: true,
            SYNCS_SKILLS: true,
            STAT_CALCULATOR: "drone",
            WAIT_TO_CYCLE: true,
         }, }, {
         POSITION: [ 3, 8, 1.2, 8, -0.75, 0, 0, ],
         PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.drone, g.summoner, g.destroyer, {size: 1.45, maxSpeed: 1.2, damage: 1.55, health: 1.56, reload: 1.295}]),
            TYPE: "alpharealchip",
            AUTOFIRE: true,
            SYNCS_SKILLS: true,
            STAT_CALCULATOR: "drone",
            WAIT_TO_CYCLE: true,
         }, }, {
         POSITION: [ 3.5, 8, 1.2, 8, 0, 0, 0, ],
         PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.drone, g.summoner, g.destroyer, {size: 1.75, maxSpeed: 1.2, damage: 1.95, health: 2.05, reload: 1.39}]),
            TYPE: "omegarealchip",
            AUTOFIRE: true,
            SYNCS_SKILLS: true,
            STAT_CALCULATOR: "drone",
            WAIT_TO_CYCLE: true,
         }, }, 
     ], 6)
};

Class.sorcerer.UPGRADES_TIER_0 = ["betasorcerer"]
Class.betasorcerer.UPGRADES_TIER_0 = ["alphasorcerer"]
Class.alphasorcerer.UPGRADES_TIER_0 = ["omegasorcerer"]
Class.summoner.UPGRADES_TIER_0 = ["betaSummoner"]
Class.betaSummoner.UPGRADES_TIER_0 = ["alphaSummoner"]
Class.alphaSummoner.UPGRADES_TIER_0 = ["omegaSummoner"]
Class.enchantress.UPGRADES_TIER_0 = ["betaEnchantress"]
Class.betaEnchantress.UPGRADES_TIER_0 = ["alphaEnchantress"]
Class.alphaEnchantress.UPGRADES_TIER_0 = ["omegaEnchantress"]
Class.exorcistor.UPGRADES_TIER_0 = ["betaexorcistor"]
Class.betaexorcistor.UPGRADES_TIER_0 = ["alphaexorcistor"]
Class.alphaexorcistor.UPGRADES_TIER_0 = ["omegaexorcistor"]
Class.shaman.UPGRADES_TIER_0 = ["betashaman"]
Class.betashaman.UPGRADES_TIER_0 = ["alphashaman"]
Class.alphashaman.UPGRADES_TIER_0 = ["omegashaman"]