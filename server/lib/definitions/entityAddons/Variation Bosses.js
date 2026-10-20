// An addon is guaranteed to run only after all groups are loaded.
// This is helpful, if your group relies on all other definitions already being loaded.
// Addons that are dependant on other addons should be named something like
// '[PARENT ADDON NAME]-[EXTENSION NAME].js', to make sure that it would run after that addon ran.

const { combineStats, makeAuto, skillSet } = require('../facilitators.js');
const { base, gunCalcNames } = require('../constants.js');
const g = require('../gunvals.js');

module.exports = ({ Class }) => {

	// This addon is disabled by default.
	// You can also disable addons by not making them end with '.js'
	// If you want to enable, simply make the line below just not run.
	//return console.log('[variatonBosses.js] Addon disabled by default');

	let MAX_CHILDREN = 0,
		GUNS = [],
		TURRETS = [];

	// This adds the tank to the definitions and to the fun menu
	Class.variatonEggImperial = {
    PARENT: 'eggBossBody',
    LABEL: 'Fighter',
    AI: {
        NO_LEAD: false,
    },
    TURRETS: [
        {
            POSITION: [9, 0, 0, 0, 360, 1],
            TYPE: ['megaAutoTankGun', { INDEPENDENT: false, CONTROLLERS: [ 'canRepel', 'onlyAcceptInArc', 'mapAltToFire', 'nearestDifferentMaster', ], }],
        },
    ],
};
for (let i = 0; i < 6; i++) {
    Class.variatonEggImperial.TURRETS.push(
        {
            POSITION: [6, 9, 0, 60*i+60, 160, 0],
            TYPE: ['minigun', { INDEPENDENT: false }],
        },
    )
};
Class.eggBossBody = {
    PARENT: 'genericTank',
    SHAPE: 0,
    CONTROLLERS: ["nearestDifferentMaster", "minion"],
    COLOR: 'white',
    DANGER: 3,
    VALUE: 1e5,
    SKILL: [3, 6, 7, 7, 2, 6, 6, 0, 3, 3],
    SKILL_CAP: [3, 6, 7, 7, 2, 6, 6, 0, 3, 3],
    SIZE: 10,
    BODY:{ SPEED: 4 },
},  
Class.squareBossBody = {
    PARENT: 'genericTank',
    SHAPE: 4,
    CONTROLLERS: ["nearestDifferentMaster", "minion"],
    COLOR: 'yellow',
    DANGER: 4,
    VALUE: 2e5,
    SKILL: [4, 7, 7, 8, 3, 7, 7, 1, 4, 4],
    SKILL_CAP: [4, 7, 7, 8, 3, 7, 7, 1, 4, 4],
    SIZE: 12,
    BODY:{ SPEED: 3 },
},
Class.triangleBossBody = {
    PARENT: 'genericTank',
    SHAPE: 3,
    CONTROLLERS: ["nearestDifferentMaster", "minion"],
    COLOR: 'red',
    DANGER: 5,
    VALUE: 3e6,
    SKILL: [5, 7, 6, 8, 9, 8, 7, 2, 4, 4],
    SKILL_CAP: [5, 7, 6, 8, 9, 8, 7, 2, 4, 4],
    SIZE: 16,
    BODY:{ SPEED: 2 },
},
Class.pentagonBossBody = {
    PARENT: 'genericTank',
    SHAPE: 5,
    CONTROLLERS: ["nearestDifferentMaster", "minion"],
    COLOR: 'purple',
    DANGER: 6,
    VALUE: 3e7,
    SKILL: [6, 8, 7, 9, 9, 9, 8, 3, 5, 5],
    SKILL_CAP: [6, 8, 7, 9, 9, 9, 8, 3, 5, 5],
    SIZE: 20,
    BODY:{ SPEED: 1 },
},
Class.hexagonBossBody = {
    PARENT: 'genericTank',
    SHAPE: 6,
    CONTROLLERS: ["nearestDifferentMaster", "minion"],
    COLOR: 'aqua',
    DANGER: 7,
    VALUE: 4e7,
    SKILL: [7, 9, 8, 9, 9, 9, 9, 4, 6, 6],
    SKILL_CAP: [7, 9, 8, 9, 9, 9, 9, 4, 6, 6],
    SIZE: 25,
    BODY:{ SPEED: 0.5 },
},
Class.variatonEggTerritorial = {
    PARENT: 'eggBossBody',
    LABEL: 'Avenger',
    GUNS: [
        {
            POSITION: [15, 7, 1, -3, 0, 60, 0],
        },
        {
            POSITION: [3, 7, 1.7, 12, 0, 60, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, g.flank]),
                TYPE: 'trap',
            },
        },
        {
            POSITION: [15, 7, 1, -3, 0, 180, 0],
        },
        {
            POSITION: [3, 7, 1.7, 12, 0, 180, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, g.flank]),
                TYPE: 'trap',
            },
        },
        {
            POSITION: [15, 7, 1, -3, 0, 300, 0],
        },
        {
            POSITION: [3, 7, 1.7, 12, 0, 300, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, g.flank]),
                TYPE: 'trap',
            },
        },
    ],
    TURRETS: [
        {
            POSITION: [6, 9, 0, 120, 160, 0],
            TYPE: ['minigun', { INDEPENDENT: false }],
        },
        {
            POSITION: [6, 9, 0, 240, 160, 0],
            TYPE: ['minigun', { INDEPENDENT: false }],
        },
        {
            POSITION: [6, 9, 0, 0, 160, 0],
            TYPE: ['minigun', { INDEPENDENT: false }],
        },
    ],
    AI: {
        NO_LEAD: false,
    },
};
Class.variatonSquareImperial = {
    PARENT: 'squareBossBody',
    LABEL: 'Squatter',
    AI: {
        NO_LEAD: false,
    },
    TURRETS: [
        {
            POSITION: [9, 0, 0, 0, 360, 1],
            TYPE: ['megaAutoTankGun', { INDEPENDENT: false, CONTROLLERS: [ 'canRepel', 'onlyAcceptInArc', 'mapAltToFire', 'nearestDifferentMaster', ], }],
        },
    ],
};
for (let i = 0; i < 4; i++) {
    Class.variatonSquareImperial.TURRETS.push(
        {
            POSITION: [6, 8, 5, 90*i+90, 160, 0],
            TYPE: ['minigun', { INDEPENDENT: false, }],
        }, {
            POSITION: [6, 8, -5, 90*i+90, 160, 0],
            TYPE: ['minigun', { INDEPENDENT: false, }],
        },
    )
};
Class.variatonSquareTerritorial = {
    PARENT: 'squareBossBody',
    LABEL: 'Crusader',
    GUNS: [
        {
            POSITION: [15, 7, 1, -3, 5.5, 5, 0],
        },
        {
            POSITION: [3, 7, 1.7, 12, 5.5, 5, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, g.twin]),
                TYPE: 'trap',
            },
        },
        {
            POSITION: [15, 7, 1, -3, -5.5, -5, 0],
        },
        {
            POSITION: [3, 7, 1.7, 12, -5.5, -5, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, g.twin]),
                TYPE: 'trap',
            },
        },
        {
            POSITION: [15, 7, 1, -3, 5.5, 185, 0],
        },
        {
            POSITION: [3, 7, 1.7, 12, 5.5, 185, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, g.twin]),
                TYPE: 'trap',
            },
        },
        {
            POSITION: [15, 7, 1, -3, -5.5, 175, 0],
        },
        {
            POSITION: [3, 7, 1.7, 12, -5.5, 175, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, g.twin]),
                TYPE: 'trap',
            },
        },
    ],
    TURRETS: [
        {
            POSITION: [9, 7, 0, 90, 160, 0],
            TYPE: ['twin', { INDEPENDENT: false }],
        },
        {
            POSITION: [9, 7, 0, 270, 160, 0],
            TYPE: ['twin', { INDEPENDENT: false }],
        },
    ],
    AI: {
        NO_LEAD: false,
    },
};
Class.variatonTriangleImperial = {
    PARENT: 'triangleBossBody',
    LABEL: 'Wrangler',
    AI: {
        NO_LEAD: false,
    },
    TURRETS: [],
};
for (let i = 0; i < 3; i++) {
    Class.variatonTriangleImperial.TURRETS.push(
        {
            POSITION: [4, 8, -8, 120*i+120, 160, 0],
            TYPE: ['minigun', { INDEPENDENT: false, }],
        }, {
            POSITION: [4, 8, 8, 120*i+120, 160, 0],
            TYPE: ['minigun', { INDEPENDENT: false, }],
        }, {
            POSITION: [8, 8, 0, 120*i+120, 160, 0],
            TYPE: ['twin', { INDEPENDENT: false, }],
        },
    )
};
Class.variatonPentagonImperial = {
    PARENT: 'pentagonBossBody',
    LABEL: 'Combatant',
    TURRETS: [],
};
for (let i = 0; i < 5; i++) {
    Class.variatonPentagonImperial.TURRETS.push(
        {
            POSITION: [4, 10, 0, 72*i+36, 160, 0],
            TYPE: ['autoTankGun', { INDEPENDENT: false, }],
        }, {
            POSITION: [8, 8, 0, 72*i+72, 160, 0],
            TYPE: ['megaAutoTankGun', { INDEPENDENT: false, }],
        },
    )
};
Class.variatonPentagonTerritorial = {
    PARENT: 'pentagonBossBody',
    LABEL: 'Protector',
    GUNS: [],
    TURRETS: [],
};
for(let i = 0; i < 5; i++) {
    Class.variatonPentagonTerritorial.GUNS.push(
        {
            POSITION: [15, 7, 1, -3, 0, 72*i, 0],
        },
        {
            POSITION: [3, 7, 1.7, 12, 0, 72*i, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, g.flank]),
                TYPE: 'trap',
            },
        },
    );
    Class.variatonPentagonTerritorial.TURRETS.push(
        {
            POSITION: [6, 9, 0, 72*i+36, 120, 0],
            TYPE: [
                'autoTankGun',
                {
                    INDEPENDENT: false,
                },
            ],
        }
    );
};
Class.variatonHexagonImperial = {
    PARENT: 'hexagonBossBody',
    LABEL: 'Spartan',
    GUNS: [],
    TURRETS: [],
};
for(let i = 0; i < 6; i++) {
    Class.variatonHexagonImperial.TURRETS.push(
        {
            POSITION: [7, 9, 0, 60*i, 160, 0],
            TYPE: [ 'megaAutoTankGun', { CONTROLLERS: [ 'canRepel', 'onlyAcceptInArc', 'mapAltToFire', 'nearestDifferentMaster', ], }, ],
        }, {
            POSITION: [4, 6, 0, 60*i+30, 180, 1],
            TYPE: [ 'autoTankGun', { INDEPENDENT: false, }, ],
        },
    );
};
Class.variatonHexagonTerritorial = {
    PARENT: 'hexagonBossBody',
    LABEL: 'Gatekeeper',
    GUNS: [],
    TURRETS: [],
};
for(let i = 0; i < 6; i++) {
    Class.variatonHexagonTerritorial.GUNS.push(
        {
            POSITION: [15, 7, 1, -3, 0, 60*i, 0],
        },
        {
            POSITION: [3, 7, 1.7, 12, 0, 60*i, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, g.flank]),
                TYPE: 'trap',
            },
        },
    );
    Class.variatonHexagonTerritorial.TURRETS.push(
        {
            POSITION: [4, 7, 0, 60*i+30, 240, 1],
            TYPE: [
                'autoTankGun',
                {
                    INDEPENDENT: false,
                },
            ],
        }
    );
};
Class.variatonbosses = {
    PARENT: 'menu',
    LABEL: 'Variaton Bosses',
};
	Class.specialTanks = {
            UPGRADES_TIER_0:['variatonbosses'],
            }
	    Class.variatonbosses = {
            UPGRADES_TIER_0:['variatonEggImperial', 'variatonSquareImperial', 'variatonTriangleImperial', 'variatonPentagonImperial', 'variatonEggTerritorial', 'variatonSquareTerritorial', 'variatonPentagonTerritorial', 'variatonHexagonImperial', 'variatonHexagonTerritorial']
            };

	console.log('[variatonBosses] A bunch of bosses has arrived!');
};