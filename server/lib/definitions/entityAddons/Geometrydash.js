const { combineStats, makeDeco } = require('../facilitators');
const g = require('../gunvals');

module.exports = ({ Class }) => {
    if (typeof makeDeco === 'function') {
        Class.geometryDash_square = makeDeco(4, 'blue');
    } else {
        Class.geometryDash_square = {
            PARENT: ['genericTank'],
            SHAPE: 4,
            COLOR: 'blue',
            LABEL: '',
            GUNS: [],
        };
    }
    Class.geometryDash_square.MIRROR_MASTER_ANGLE = true;

    Class.geometryDash_longRect = {
        PARENT: ['genericTank'],
        SHAPE: 'M -2.5 -0.5 L 2.5 -0.5 L 2.5 0.5 L -2.5 0.5 Z',
        COLOR: 'blue',
        MIRROR_MASTER_ANGLE: true,
        LABEL: '',
        GUNS: [],
    };

    Class.geometryDash = {
        PARENT: ['genericTank'],
        LABEL: 'Geometry Dash',
        SHAPE: 4,
        BODY: {
            HEALTH: 1e7,
            SHIELD: 0,
            DAMAGE: 0,
            ACCELERATION: 10,
            SPEED: 20,
            PUSHABILITY: 0,
        },
        COLOR: '#FFFF00',
        SIZE: 20,
        SKILL_CAP: Array(10).fill(10),
        EXTRA_SKILL: 10,
        CONTROLLERS: [['spin', { speed: 0.03 }]],
        TURRETS: [
            {
                POSITION: [5, 4, 0, 0, 0, 1],
                TYPE: 'geometryDash_square',
            },
            {
                POSITION: [5, 4, 0, 0, 0, 1],
                TYPE: 'geometryDash_square',
            },
            {
                POSITION: [5, -6.1, 0, 90, 0, 1],
                TYPE: 'geometryDash_longRect',
            },
        ],
        UPGRADES_TIER_0: ['geometryDashWave'],
    };

    Class.geometryDashWave = {
        PARENT: ['genericTank'],
        LABEL: 'Wave',
        SHAPE: 3,
        BODY: {
            HEALTH: 1e7,
            DAMAGE: 1e7,
            SHIELD: 0,
            ACCELERATION: 0,
            SPEED: 0,
            PUSHABILITY: 0,
        },
        COLOR: '#FFFF00',
        SIZE: 20,
        GUNS: [{
            POSITION: [13, 8, 2, 0, 0, 180, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    g.basic,
                    g.mach,
                    { recoil: 25 },
                    { speed: 3, maxSpeed: 3 },
                    { reload: 0.05, range: 0.2 },
                ].filter(s => s != null)),
                TYPE: 'bullet',
                COLOR: 'blue',
            },
        }],
    };

    if (Class.menu_addons && Class.menu_addons.UPGRADES_TIER_0) {
        Class.menu_addons.UPGRADES_TIER_0.push('geometryDash');
    } else {
        console.warn('[geometryDash] Could not attach to menu_addons - add manually');
    }
};