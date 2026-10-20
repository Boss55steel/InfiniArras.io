const {combineStats, skillSet, makeCrasher, makeLaby, makePolychoron, makePolyhedron, makePresent, makeRarities, makeRelic} = require('../facilitators.js')
const {base, dfltskl, smshskl, statnames} = require('../constants.js')
const g = require('../gunvals.js')

// Entities
Class.genericEntity = {
    NAME: "",
    LABEL: "Unknown Entity",
    TYPE: "unknown",
    DAMAGE_CLASS: 0,
    DANGER: 0,
    VALUE: 0,
    SHAPE: 0,
    COLOR: {
        BASE: 16, // ID
        HUE_SHIFT: 0, // Additive, degrees
        SATURATION_SHIFT: 1, // Multiplicative
        BRIGHTNESS_SHIFT: 0, // Additive, ranges from -100 to 100
        ALLOW_BRIGHTNESS_INVERT: false, // Toggles offset invert if exceeding normal color bounds
    },
    INDEPENDENT: false,
    CONTROLLERS: [],
    HAS_NO_MASTER: false,
    MOTION_TYPE: "glide",
    FACING_TYPE: "toTarget",
    DRAW_HEALTH: false,
    DRAW_SELF: true,
    IS_IMMUNE_TO_TILES: false,
    DAMAGE_EFFECTS: true,
    RATEFFECTS: true,
    MOTION_EFFECTS: true,
    INTANGIBLE: false,
    CAN_GO_OUTSIDE_ROOM: false,
    CAN_SEE_INVISIBLE_ENTITIES: false,
    CONNECT_CHILDREN_ON_CAMERA: false,
    ACCEPTS_SCORE: true,
    GIVE_KILL_MESSAGE: false,
    HITS_OWN_TYPE: "normal",
    DIE_AT_LOW_SPEED: false,
    DIE_AT_RANGE: false,
    CLEAR_ON_MASTER_UPGRADE: false,
    PERSISTS_AFTER_DEATH: false,
    VARIES_IN_SIZE: false,
    HEALTH_WITH_LEVEL: true,
    CAN_BE_ON_LEADERBOARD: true,
    HAS_NO_RECOIL: false,
    SYNC_WITH_TANK: false,
    BUFF_VS_FOOD: false,
    OBSTACLE: false,
    CRAVES_ATTENTION: false,
    NECRO: false,
    UPGRADES_TIER_0: [],
    UPGRADES_TIER_1: [],
    UPGRADES_TIER_2: [],
    UPGRADES_TIER_3: [],
    UPGRADES_TIER_4: [],
    UPGRADES_TIER_5: [],
    UPGRADES_TIER_6: [],
    UPGRADES_TIER_7: [],
    UPGRADES_TIER_8: [],
    UPGRADES_TIER_9: [],
    SKILL: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    LEVEL: 0,
    SKILL_CAP: Array(10).fill(dfltskl),
    GUNS: [],
    MAX_CHILDREN: 0,
    BORDERLESS: false,
    DRAW_FILL: true,
    REROOT_UPGRADE_TREE: null,
    DISPLAY_NAME: true,
    ON: [],
    BODY: {
        ACCELERATION: 1,
        SPEED: 0,
        HEALTH: 1,
        RESIST: 1,
        SHIELD: 0,
        REGEN: 0,
        DAMAGE: 1,
        PENETRATION: 1,
        RANGE: 0,
        FOV: 1,
        SHOCK_ABSORB: 1,
        RECOIL_MULTIPLIER: 1,
        DENSITY: 1,
        STEALTH: 1,
        PUSHABILITY: 1,
        HETERO: 2
    },
    FOOD: {
        LEVEL: -1
    }
}
Class.cnx3DTank = {
    PARENT: ["genericTank"], 
    LABEL: "Mega 3D Tank",
    COLOR: "grey", 
    SIZE: 25, // MASSIVELY bigger base size
    SHAPE: (function() {
        const faces = [];
        
        // Builder function for true 3D geometry
        function addBox(cx, cy, cz, dx, dy, dz) {
            let top1 = [cx+dx, cy-dy, cz+dz], top2 = [cx-dx, cy-dy, cz+dz];
            let top3 = [cx-dx, cy+dy, cz+dz], top4 = [cx+dx, cy+dy, cz+dz];
            
            let bot1 = [cx+dx, cy-dy, cz-dz], bot2 = [cx-dx, cy-dy, cz-dz];
            let bot3 = [cx-dx, cy+dy, cz-dz], bot4 = [cx+dx, cy+dy, cz-dz];

            faces.push([top1, top2, top3, top4]); // Top
            faces.push([bot4, bot3, bot2, bot1]); // Bottom
            faces.push([top4, bot4, bot1, top1]); // Front (Faces X+)
            faces.push([top2, bot2, bot3, top3]); // Back (Faces X-)
            faces.push([top3, bot3, bot4, top4]); // Right side
            faces.push([top1, bot1, bot2, top2]); // Left side
        }

        // --- EXTREME 3D TANK GEOMETRY ---
        // 1. Left & Right Tracks (Thick and heavy)
        addBox(0, 10, -5, 15, 3, 3);
        addBox(0, -10, -5, 15, 3, 3);
        
        // 2. Track Fenders (Overhangs that create deep shadows over the treads)
        addBox(0, 10, -1.5, 16, 3.5, 0.5);
        addBox(0, -10, -1.5, 16, 3.5, 0.5);
        
        // 3. Lower Hull
        addBox(0, 0, -3, 14, 7, 2.5);
        
        // 4. Upper Hull / Engine Deck (Stepped up for depth)
        addBox(-2, 0, 0, 12, 7, 1.5);
        
        // 5. Main Turret
        addBox(-2, 0, 3, 6, 6, 1.5);
        
        // 6. Commander's Cupola (Small raised hatch on top of the turret)
        addBox(-4, 0, 5, 2, 2, 1);
        
        // 7. Gun Mantlet (Thick armor block connecting barrel to turret)
        addBox(5, 0, 3, 2, 3, 2);
        
        // 8. Main Cannon Barrel
        addBox(14, 0, 3, 8, 0.8, 0.8);
        
        // 9. Muzzle Brake (Thickened tip at the very end of the barrel)
        addBox(22, 0, 3, 1.5, 1.2, 1.2);

        return makePolyhedron({
            FACES: faces,
            SCALE: 3, // Doubled the 3D projection scale!
            VERTEXES_SCALE: 0.1 
        });
    })(),
    BODY: {
        HEALTH: 2000, // Gave it a bit more health to match its massive size
        DAMAGE: 5,
        SPEED: 0.8, // Slightly slower because it's so huge
        FOV: 1.5 // Zooms your camera out a bit so you can see your massive tank
    },
    GUNS: [
        {
            // Pushed the bullet spawn point all the way out to the end of the new massive barrel
            POSITION: [30, 4, 1, 0, 0, 0, 0], 
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.destroyer]), // Shoots massive destroyer bullets now!
                TYPE: "bullet"
            }
        }
    ]
};
// Tanks
Class.genericTank = {
    LABEL: "Unknown Class",
    TYPE: "tank",
    DAMAGE_CLASS: 2,
    DANGER: 5,
    SHAPE: 0,
    SIZE: 12,
    MOTION_TYPE: "motor",
    FACING_TYPE: "toTarget",
    ARENA_CLOSER: false,
    FULL_INVISIBLE: false,
    CAN_SEE_INVISIBLE_ENTITIES: false,
    CONNECT_CHILDREN_ON_CAMERA: false,
    DAMAGE_EFFECTS: false,
    DRAW_HEALTH: true,
    GIVE_KILL_MESSAGE: true,
    HAS_NO_RECOIL: false,
    HITS_OWN_TYPE: "hardOnlyTanks",
    IGNORED_BY_AI: false,
    IS_IMMUNE_TO_TILES: false,
    MAX_CHILDREN: 0,
    NO_SIZE_ANIMATION: false,
    RENDER_ON_LEADERBOARD: true,
    REROOT_UPGRADE_TREE: Config.spawn_class,
    RESET_EVENTS: true,
    SYNC_WITH_TANK: false,
    BODY: {
        ACCELERATION: base.ACCEL,
        SPEED: base.SPEED,
        HEALTH: base.HEALTH,
        DAMAGE: base.DAMAGE,
        PENETRATION: base.PENETRATION,
        SHIELD: base.SHIELD,
        REGEN: base.REGEN,
        FOV: base.FOV,
        DENSITY: base.DENSITY,
        PUSHABILITY: 1,
        HETERO: 3,
    },
    GUNS: [],
    TURRETS: [],
    PROPS: [],
    ON: [],
}
Class.genericFlail = {
    PARENT: "genericTank",
    STAT_NAMES: statnames.flail,
    SYNC_WITH_TANK: true,
    SKILL_CAP: {
        BODY_DAMAGE: dfltskl,
        MAX_HEALTH: dfltskl,
        BULLET_SPEED: 0,
        BULLET_HEALTH: 0,
        PENETRATION: dfltskl,
        BULLET_DAMAGE: dfltskl,
        RELOAD: dfltskl,
        MOVEMENT_SPEED: dfltskl,
        SHIELD_REGENERATION: dfltskl,
        SHIELD_CAPACITY: dfltskl
    },
}
Class.genericHealer = {
    PARENT: "genericTank",
    HEALING_TANK: true, // Mainly for bots to recognize the tank
    STAT_NAMES: statnames.healer,
    TURRETS: [
        {
            TYPE: "healerHat",
            POSITION: {
                SIZE: 13,
                LAYER: 1
            }
        }
    ]
}
Class.genericSmasher = {
    PARENT: "genericTank",
    DANGER: 7,
    IS_SMASHER: true,
    SKILL_CAP: {
        RELOAD: smshskl,
        PENETRATION: 0,
        BULLET_HEALTH: 0,
        BULLET_DAMAGE: 0,
        BULLET_SPEED: 0,
        SHIELD_CAPACITY: smshskl,
        BODY_DAMAGE: smshskl,
        MAX_HEALTH: smshskl,
        SHIELD_REGENERATION: smshskl,
        MOVEMENT_SPEED: smshskl
    },
    STAT_NAMES: statnames.smasher,
    BODY: {
        FOV: 1.05 * base.FOV,
        DENSITY: 2 * base.DENSITY
    }
}

// Map Objects
Class.food = {
    TYPE: "food",
    DAMAGE_CLASS: 1,
    CONTROLLERS: ["moveInCircles"],
    HITS_OWN_TYPE: "repel",
    MOTION_TYPE: "drift",
    FACING_TYPE: "turnWithSpeed",
    IS_IMMUNE_TO_TILES: false,
    LEVEL_CAP: 1,
    BODY: {
        STEALTH: 30,
        PUSHABILITY: 1,
        REGEN: 0
    },
    DAMAGE_EFFECTS: false,
    RATEFFECTS: false,
    HEALTH_WITH_LEVEL: false,
}
Class.genericObstacle = {
    TYPE: "wall",
    DAMAGE_CLASS: 1,
    FACING_TYPE: "turnWithSpeed",
    CAN_GO_OUTSIDE_ROOM: true,
    BODY: {
        PUSHABILITY: 0,
        HEALTH: 10000,
        SHIELD: 10000,
        REGEN: 1000,
        DAMAGE: 1,
        RESIST: 100,
        STEALTH: 1,
    },
    VALUE: 0,
    COLOR: "lightGray",
    ACCEPTS_SCORE: false,
    VARIES_IN_SIZE: true
}

// Projectiles
Class.bullet = {
    LABEL: "Bullet",
    TYPE: "bullet",
    ACCEPTS_SCORE: false,
    BODY: {
        PENETRATION: 1,
        SPEED: 3.75,
        RANGE: 90,
        DENSITY: 1.25,
        HEALTH: 0.165,
        DAMAGE: 6,
        PUSHABILITY: 0.3,
    },
    FACING_TYPE: "smoothWithMotion",
    CAN_GO_OUTSIDE_ROOM: true,
    HITS_OWN_TYPE: "never",
    DIE_AT_RANGE: true,
}
Class.drone = {
    LABEL: "Drone",
    TYPE: "drone",
    ACCEPTS_SCORE: false,
    DANGER: 2,
    CONTROL_RANGE: 0,
    SHAPE: 3,
    MOTION_TYPE: "chase",
    FACING_TYPE: "smoothToTarget",
    CONTROLLERS: [
        "nearestDifferentMaster",
        "canRepel",
        "mapTargetToGoal",
        "hangOutNearMaster",
    ],
    AI: {
        BLIND: true,
    },
    BODY: {
        PENETRATION: 1.2,
        PUSHABILITY: 0.6,
        ACCELERATION: 0.085,
        HEALTH: 0.3,
        DAMAGE: 3.375,
        SPEED: 3.8,
        RANGE: 200,
        DENSITY: 0.03,
        RESIST: 1.5,
        FOV: 0.5,
    },
    HITS_OWN_TYPE: "droneCollision",
    DRAW_HEALTH: false,
    CLEAR_ON_MASTER_UPGRADE: true,
    BUFF_VS_FOOD: true,
}
Class.satellite = { 
    LABEL: "Satellite",
    TYPE: "satellite",
    ACCEPTS_SCORE: false,
    DANGER: 2,
    SHAPE: 0,
    LAYER: 13,
    CONTROLLERS: ['orbit'],
    FACING_TYPE: "spin",
    BODY: {
        PENETRATION: 1.2,
        PUSHABILITY: 0.6,
        ACCELERATION: 0.75,
        HEALTH: 0.3,
        DAMAGE: 3.375,
        SPEED: 10,
        RANGE: 200,
        DENSITY: 0.03,
        RESIST: 1.5,
        FOV: 0.5,
    },
    DRAW_HEALTH: false,
    CLEAR_ON_MASTER_UPGRADE: true,
    BUFF_VS_FOOD: true,
    MOTION_TYPE: 'motor'
}
Class.swarm = {
    LABEL: "Swarm Drone",
    TYPE: "swarm",
    ACCEPTS_SCORE: false,
    SHAPE: 3,
    MOTION_TYPE: "swarm",
    FACING_TYPE: "smoothWithMotion",
    CONTROLLERS: ["nearestDifferentMaster", "mapTargetToGoal"],
    CRAVES_ATTENTION: true,
    BODY: {
        ACCELERATION: 3,
        PENETRATION: 1.5,
        HEALTH: 0.175,
        DAMAGE: 2.25,
        SPEED: 4.5,
        RESIST: 1.6,
        RANGE: 225,
        DENSITY: 12,
        PUSHABILITY: 0.6,
        FOV: 1.5,
    },
    DIE_AT_RANGE: true,
    BUFF_VS_FOOD: true,
}
Class.trap = {
    LABEL: "Thrown Trap",
    TYPE: "trap",
    ACCEPTS_SCORE: false,
    SHAPE: -3,
    MOTION_TYPE: "glide",
    FACING_TYPE: "turnWithSpeed",
    HITS_OWN_TYPE: "push",
    DIE_AT_RANGE: true,
    BODY: {
        HEALTH: 0.5,
        DAMAGE: 3,
        RANGE: 450,
        DENSITY: 2.5,
        RESIST: 2.5,
        SPEED: 0,
    },
}
{
    tetrahedron_shape = makePolyhedron({
        FACES: [
            [[1, 1, 1], [-1, 1, -1], [1, -1, -1]],
            [[-1, 1, -1], [-1, -1, 1], [1, -1, -1]],
            [[1, 1, 1], [1, -1, -1], [-1, -1, 1]],
            [[1, 1, 1], [-1, -1, 1], [-1, 1, -1]]
        ],
        SCALE: 5,
        VERTEXES_SCALE: 0.1
    })
    octahedron_shape = makePolyhedron({
        FACES: (function () {
            const x = 3 / (2 * Math.sqrt(2));
            const y = 3 / 2;
            return [
                [[-x, 0, x], [-x, 0, -x], [0, y, 0]],
                [[-x, 0, -x], [x, 0, -x], [0, y, 0]],
                [[x, 0, -x], [x, 0, x], [0, y, 0]],
                [[x, 0, x], [-x, 0, x], [0, y, 0]],
                [[x, 0, -x], [-x, 0, -x], [0, -y, 0]],
                [[-x, 0, -x], [-x, 0, x], [0, -y, 0]],
                [[x, 0, x], [x, 0, -x], [0, -y, 0]],
                [[-x, 0, x], [x, 0, x], [0, -y, 0]]
            ];
        })(),
        SCALE: 7.5,
        VERTEXES_SCALE: 0.1
    })
    cube_shape = makePolyhedron({
        VERTEXES: [
            [1, 1, 1],
            [-1, 1, 1],
            [-1, -1, 1],
            [1, -1, 1],
            [1, 1, -1],
            [-1, 1, -1],
            [-1, -1, -1],
            [1, -1, -1]
        ],
        FACES: [
            [0, 1, 2, 3],
            [4, 5, 6, 7],
            [1, 2, 6, 5],
            [0, 3, 7, 4],
            [0, 1, 5, 4],
            [2, 3, 7, 6]
        ],
        SCALE: 7.5,
        VERTEXES_SCALE: 0.1
    })
    dodecahedron_shape = makePolyhedron({
        FACES: (function () {
            let phi = (1 + Math.sqrt(5)) / 2,
                x = 1,
                y = 1 / phi,
                z = 2 - phi;

            x *= 1.5;
            y *= 1.5;
            z *= 1.5;

            return [
                [
                    [z, 0, x],
                    [-z, 0, x],
                    [-y, y, y],
                    [0, x, z],
                    [y, y, y]
                ],
                [
                    [-z, 0, x],
                    [z, 0, x],
                    [y, -y, y],
                    [0, -x, z],
                    [-y, -y, y]
                ],
                [
                    [z, 0, -x],
                    [-z, 0, -x],
                    [-y, -y, -y],
                    [0, -x, -z],
                    [y, -y, -y]
                ],
                [
                    [-z, 0, -x],
                    [z, 0, -x],
                    [y, y, -y],
                    [0, x, -z],
                    [-y, y, -y]
                ],
                [
                    [0, x, -z],
                    [0, x, z],
                    [y, y, y],
                    [x, z, 0],
                    [y, y, -y]
                ],
                [
                    [0, x, z],
                    [0, x, -z],
                    [-y, y, -y],
                    [-x, z, 0],
                    [-y, y, y]
                ],
                [
                    [0, -x, -z],
                    [0, -x, z],
                    [-y, -y, y],
                    [-x, -z, 0],
                    [-y, -y, -y]
                ],
                [
                    [0, -x, z],
                    [0, -x, -z],
                    [y, -y, -y],
                    [x, -z, 0],
                    [y, -y, y]
                ],
                [
                    [x, z, 0],
                    [x, -z, 0],
                    [y, -y, y],
                    [z, 0, x],
                    [y, y, y]
                ],
                [
                    [x, -z, 0],
                    [x, z, 0],
                    [y, y, -y],
                    [z, 0, -x],
                    [y, -y, -y]
                ],
                [
                    [-x, z, 0],
                    [-x, -z, 0],
                    [-y, -y, -y],
                    [-z, 0, -x],
                    [-y, y, -y]
                ],
                [
                    [-x, -z, 0],
                    [-x, z, 0],
                    [-y, y, y],
                    [-z, 0, x],
                    [-y, -y, y]
                ]
            ];
        })(),
        SCALE: 6.5,
        VERTEXES_SCALE: 0.1
    })
    icosahedron_shape = makePolyhedron({
        FACES: (function () {
            let phi = (1 + Math.sqrt(5)) / 2, // golden ratio
                x = 1 / 2,
                y = 1 / (2 * phi);
            x *= 3;
            y *= 3;

            return [
                [
                    [0, y, -x],
                    [y, x, 0],
                    [-y, x, 0]
                ],
                [
                    [0, y, x],
                    [-y, x, 0],
                    [y, x, 0]
                ],
                [
                    [0, y, x],
                    [0, -y, x],
                    [-x, 0, y]
                ],
                [
                    [0, y, x],
                    [x, 0, y],
                    [0, -y, x]
                ],
                [
                    [0, y, -x],
                    [0, -y, -x],
                    [x, 0, -y]
                ],
                [
                    [0, y, -x],
                    [-x, 0, -y],
                    [0, -y, -x]
                ],
                [
                    [0, -y, x],
                    [y, -x, 0],
                    [-y, -x, 0]
                ],
                [
                    [0, -y, -x],
                    [-y, -x, 0],
                    [y, -x, 0]
                ],
                [
                    [-y, x, 0],
                    [-x, 0, y],
                    [-x, 0, -y]
                ],
                [
                    [-y, -x, 0],
                    [-x, 0, -y],
                    [-x, 0, y]
                ],
                [
                    [y, x, 0],
                    [x, 0, -y],
                    [x, 0, y]
                ],
                [
                    [y, -x, 0],
                    [x, 0, y],
                    [x, 0, -y]
                ],
                [
                    [0, y, x],
                    [-x, 0, y],
                    [-y, x, 0]
                ],
                [
                    [0, y, x],
                    [y, x, 0],
                    [x, 0, y]
                ],
                [
                    [0, y, -x],
                    [-y, x, 0],
                    [-x, 0, -y]
                ],
                [
                    [0, y, -x],
                    [x, 0, -y],
                    [y, x, 0]
                ],
                [
                    [0, -y, -x],
                    [-x, 0, -y],
                    [-y, -x, 0]
                ],
                [
                    [0, -y, -x],
                    [y, -x, 0],
                    [x, 0, -y]
                ],
                [
                    [0, -y, x],
                    [-y, -x, 0],
                    [-x, 0, y]
                ],
                [
                    [0, -y, x],
                    [x, 0, y],
                    [y, -x, 0]
                ]
            ];
        })(),
        SCALE: 20,
        VERTEXES_SCALE: 0.03
    })
    tesseract_shape = makePolychoron({
        VERTEXES: [
            [ -1, 1, 1, 1 ],   [ 1, 1, 1, 1 ],
            [ 1, -1, 1, 1 ],   [ -1, -1, 1, 1 ],
            [ -1, 1, -1, 1 ],  [ 1, 1, -1, 1 ],
            [ 1, -1, -1, 1 ],  [ -1, -1, -1, 1 ],
            [ -1, 1, 1, -1 ],  [ 1, 1, 1, -1 ],
            [ 1, -1, 1, -1 ],  [ -1, -1, 1, -1 ],
            [ -1, 1, -1, -1 ], [ 1, 1, -1, -1 ],
            [ 1, -1, -1, -1 ], [ -1, -1, -1, -1 ]
        ],
        FACES: [
            // broken
            [0,1,2,3], [7,6,5,4], [0,1,5,4], [1,2,6,5], [2,3,7,6], [3,0,4,7],
            [8,9,10,11], [15,14,13,12], [8,9,13,12], [9,10,14,13], [10,11,15,14], [11,8,12,15],
            [0,1,9,8],
            [4,5,13,12],
            [1,2,10,9],
            [3,0,8,11],
            [2,3,11,10],
            [7,6,14,15],[5,6,14,13], [4,7,15,12]
        ],
        VERTEXES_SCALE: 0.1,
        SCALE: 6
    })
}
Class.fakecube = {
    LABEL: "Fake Cube",
    COLOR: "white",
    PARENT: "cube",
    SIZE: 10,
    TYPE: "cube",
    ACCEPTS_SCORE: false,
    SHAPE: cube_shape,
    MOTION_TYPE: "spin",
    HITS_OWN_TYPE: "push",
    DIE_AT_RANGE: true,
    BODY: {
        HEALTH: 1000000000000000000000000000000000000000000000000000000000000000000,
        DAMAGE: 0.01,
        RANGE: 450,
        DENSITY: 1000000000000000000000000000000000000000000000000000000000000000000,
        RESIST: 1000000000000000000000000000000000000000000000000000000000000000000,
        SPEED: 0,
        RESIST: 1.25,
        PENETRATION: 17.5,
        ACCELERATION: 0.002,
        SPIN: 2,
        DRAW_HEALTH: true
    },
}
Class.faketetrahedron = {
    LABEL: "Fake Tetrahedron",
    COLOR: "white",
    PARENT: "tetrahedron",
    SIZE: 12,
    TYPE: "tetrahedron",
    ACCEPTS_SCORE: false,
    SHAPE: tetrahedron_shape,
    MOTION_TYPE: "spin",
    HITS_OWN_TYPE: "push",
    DIE_AT_RANGE: true,
    BODY: {
        HEALTH: 1000000000000000000000000000000000000000000000000000000000000000000,
        DAMAGE: 0.01,
        RANGE: 450,
        DENSITY: 1000000000000000000000000000000000000000000000000000000000000000000,
        RESIST: 1000000000000000000000000000000000000000000000000000000000000000000,
        SPEED: 0,
        RESIST: 1.25,
        PENETRATION: 17.5,
        ACCELERATION: 0.002,
        SPIN: 2,
        DRAW_HEALTH: true
    },
}
Class.fakeoctahedron = {
    LABEL: "Fake Octahedron",
    COLOR: "white",
    PARENT: "octahedron",
    SIZE: 13,
    TYPE: "octahedron",
    ACCEPTS_SCORE: false,
    SHAPE: octahedron_shape,
    MOTION_TYPE: "spin",
    HITS_OWN_TYPE: "push",
    DIE_AT_RANGE: true,
    BODY: {
        HEALTH: 1000000000000000000000000000000000000000000000000000000000000000000,
        DAMAGE: 0.01,
        RANGE: 450,
        DENSITY: 1000000000000000000000000000000000000000000000000000000000000000000,
        RESIST: 1000000000000000000000000000000000000000000000000000000000000000000,
        SPEED: 0,
        RESIST: 1.25,
        PENETRATION: 17.5,
        ACCELERATION: 0.002,
        SPIN: 2,
        DRAW_HEALTH: true
    },
}
Class.fakedodecahedron = {
    LABEL: "Fake Dodecahedron",
    COLOR: "white",
    PARENT: "dodecahedron",
    SIZE: 18,
    TYPE: "dodecahedron",
    ACCEPTS_SCORE: false,
    SHAPE: dodecahedron_shape,
    MOTION_TYPE: "spin",
    HITS_OWN_TYPE: "push",
    DIE_AT_RANGE: true,
    BODY: {
        HEALTH: 1000000000000000000000000000000000000000000000000000000000000000000,
        DAMAGE: 0.01,
        RANGE: 450,
        DENSITY: 1000000000000000000000000000000000000000000000000000000000000000000,
        RESIST: 1000000000000000000000000000000000000000000000000000000000000000000,
        SPEED: 0,
        RESIST: 1.25,
        PENETRATION: 17.5,
        ACCELERATION: 0.002,
        SPIN: 2,
        DRAW_HEALTH: true
    },
}
Class.fakeicosahedron = {
    LABEL: "Fake Icosahedron",
    COLOR: "white",
    PARENT: "icosahedron",
    SIZE: 20,
    TYPE: "icosahedron",
    ACCEPTS_SCORE: false,
    SHAPE: icosahedron_shape,
    MOTION_TYPE: "spin",
    HITS_OWN_TYPE: "push",
    DIE_AT_RANGE: true,
    BODY: {
        HEALTH: 1000000000000000000000000000000000000000000000000000000000000000000,
        DAMAGE: 0.01,
        RANGE: 450,
        DENSITY: 1000000000000000000000000000000000000000000000000000000000000000000,
        RESIST: 1000000000000000000000000000000000000000000000000000000000000000000,
        SPEED: 0,
        RESIST: 1.25,
        PENETRATION: 17.5,
        ACCELERATION: 0.002,
        SPIN: 2,
        DRAW_HEALTH: true
    },
}
Class.faketesseract = {
    LABEL: "Fake Tesseract",
    COLOR: "white",
    PARENT: "tesseract",
    SIZE: 25,
    TYPE: "tesseract",
    ACCEPTS_SCORE: false,
    SHAPE: tesseract_shape,
    MOTION_TYPE: "spin",
    HITS_OWN_TYPE: "push",
    DIE_AT_RANGE: true,
    BODY: {
        HEALTH: 1000000000000000000000000000000000000000000000000000000000000000000,
        DAMAGE: 0.01,
        RANGE: 450,
        DENSITY: 1000000000000000000000000000000000000000000000000000000000000000000,
        RESIST: 1000000000000000000000000000000000000000000000000000000000000000000,
        SPEED: 0,
        RESIST: 1.25,
        PENETRATION: 17.5,
        ACCELERATION: 0.002,
        SPIN: 2,
        DRAW_HEALTH: true
    },
}
// Bosses
Class.genericBoss = {
    PARENT: "genericTank",
    TYPE: "miniboss",
    DANGER: 6,
    SKILL: skillSet({
        rld: 0.7,
        dam: 0.5,
        pen: 0.8,
        str: 0.8,
        spd: 0.2,
        atk: 0.3,
        hlt: 1,
        shi: 0.7,
        rgn: 0.7,
        mob: 0,
    }),
    LEVEL: 45,
    CONTROLLERS: [["nearestDifferentMaster", { lockThroughWalls: true }], "canRepel"],
    FACING_TYPE: ['spin', {speed: 0.02}],
    HITS_OWN_TYPE: "hardOnlyBosses",
    BROADCAST_MESSAGE: "A visitor has left!",
    BODY: { PUSHABILITY: 0.05 }
}
Class.miniboss = {
    PARENT: "genericBoss",
    RENDER_ON_LEADERBOARD: true,
    CONTROLLERS: ["nearestDifferentMaster", ["minion", {turnwiserange: 360}], "canRepel"],
    AI: { NO_LEAD: true },
}

// Aura Components
Class.auraBase = {
    TYPE: "aura",
    ACCEPTS_SCORE: false,
    FACING_TYPE: "smoothWithMotion",
    MOTION_TYPE: "withMaster",
    HITS_OWN_TYPE: "never",
    DAMAGE_EFFECTS: false,
    DIE_AT_RANGE: false,
    ALPHA: 0.3,
    CLEAR_ON_MASTER_UPGRADE: true,
    CAN_GO_OUTSIDE_ROOM: true,
    CONTROLLERS: ["disableOnOverride", "scaleWithMaster"],
    BODY: {
        SHIELD: 1e9,
        REGEN: 1e6,
        HEALTH: 1e9,
        DENSITY: 0,
        SPEED: 0,
        PUSHABILITY: 0,
    }
}
Class.aura = {
    PARENT: "auraBase",
    LABEL: "Aura",
    COLOR: "teal",
    BODY: {
        DAMAGE: 0.4,
    },
}
Class.healAura = {
    PARENT: "auraBase",
    LABEL: "Heal Aura",
    HEALER: true,
    COLOR: "red",
    BODY: {
        DAMAGE: 0.4 / 3,
    },
}
Class.auraSymbol = {
    PARENT: "genericTank",
    CONTROLLERS: [["spin", {speed: -0.04}]],
    INDEPENDENT: true,
    COLOR: "teal",
    SHAPE: [[-0.598,-0.7796],[-0.3817,-0.9053],[0.9688,-0.1275],[0.97,0.125],[-0.3732,0.9116],[-0.593,0.785]]
}

// Server Travel Portal
Class.portalAura = {
    PARENT: "bullet",
    MOTION_TYPE: "withMaster",
    CLEAR_ON_MASTER_UPGRADE: true,
    ALPHA: 0.4,
    NO_COLLISIONS: true,
    BODY: {
        HEALTH: base.HEALTH * 1000,
        DAMAGE: 0,
        DENSITY: 0,
        SPEED: 0,
        PUSHABILITY: 0,
    },
    DIE_AT_RANGE: false,
    ON: [
        {
            event: 'tick',
            handler: ({ body }) => {
                if (body.growing) {
                    body.SIZE += 1.2;
                    if (body.SIZE > 45) body.growing = false;
                } else {
                    body.SIZE -= 1.2;
                    if (body.SIZE < 32) body.growing = true;
                }
            }
        },
    ],
}
Class.serverPortal = {
    PARENT: "genericTank",
    LABEL: "Travel Portal",
    UPGRADE_LABEL: "Portal",
    NAME: "Portal",
    COLOR: "#000000",
    BODY: {
        FOV: 2.5,
        DAMAGE: 0,
        HEALTH: 1e100,
        SHIELD: 1e100,
        REGEN: 1e100,
        PUSHABILITY: 0,
        DENSITY: 0,
    },
    FACING_TYPE: "spin",
    HITS_OWN_TYPE: "never",
    ARENA_CLOSER: true,
    IGNORED_BY_AI: true,
    CAN_BE_ON_LEADERBOARD: false,
    GIVE_KILL_MESSAGE: false,
    ACCEPTS_SCORE: false,
    DISPLAY_NAME: true,
    FULL_INVISIBLE: true,
    SIZE: 25,
    GUNS: [],
    ALPHA: 1,
    TURRETS: [
        {
            TYPE: ["circleHat", {COLOR: "#000000"}],
            POSITION: {
                SIZE: 20.1,
                LAYER: 1
            }
        }
    ],
    ON: [
        {
            event: "tick",
            handler: ({ body }) => {
                for (let instance of entities.values()) {
                    let diffX = instance.x - body.x,
                        diffY = instance.y - body.y,
                        dist2 = diffX ** 2 + diffY ** 2;
                    if (dist2 <= ((body.size / 12)*250) ** 1.9) {
                        let forceMulti = (0.2 / instance.size);
                        if (instance.isPlayer && instance.socket) {
                            if (dist2 < body.size ** 2.5 + instance.size ** 2.5) forceMulti = (3 / instance.size);
                            instance.velocity.x += util.clamp(body.x - instance.x, -90, 90) * instance.damp * forceMulti;//0.05
                            instance.velocity.y += util.clamp(body.y - instance.y, -90, 90) * instance.damp * forceMulti;//0.05
                        } else if (
                            !instance.isDominator && 
                            !instance.isArenaCloser && 
                            !instance.godmode && 
                            !instance.invuln && 
                            instance.id != body.id && 
                            instance.type !== "wall" &&
                            instance.team != body.team && 
                            instance.type === "bullet" ||
                            instance.type === "drone" ||
                            instance.type === "trap" ||
                            instance.type === "minion")
                        {
                            forceMulti = (3 / instance.size);
                            instance.velocity.x -= util.clamp(body.x - instance.x, -90, 90) * instance.damp * forceMulti;//0.05
                            instance.velocity.y -= util.clamp(body.y - instance.y, -90, 90) * instance.damp * forceMulti;//0.05
                        }
                    }
                }
            }
        }
    ]
}
for (let i = 0; i < 60; i++) {
    let spawnDelay = Math.random() * 252;
    if (spawnDelay < 20) spawnDelay = Math.random() * 4;
    Class.serverPortal.GUNS.push({
        POSITION: [2, 8, 1, -150, 0, 360 / 60 * i, spawnDelay],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([
                g.basic,
                { shudder: 0, speed: 2.7, spray: 0, reload: 0.8, recoil: 0, range: 0.15 },
            ]),
            SYNCS_SKILLS: true,
            AUTOFIRE: true,
            DRAW_FILL: false,
            BORDERLESS: true,
            NO_LIMITATIONS: true,
            TYPE: [
                Class.bullet,
                {
                    NO_COLLISIONS: true,
                    ALPHA: 0,
                    FULL_INVISIBLE: true,
                    ON: [
                        {
                            event: "tick",
                            handler: ({ body }) => {
                                if (body.alpha < 0.9) body.alpha += 0.06; else body.alpha = 0;
                            }
                        }
                    ]
                },
            ],
        },
    });
}
for (let i = 0; i < 2; i++) {
    if (i & 1) i++;
    Class.serverPortal.GUNS.push({
        POSITION: [2, 14, 1, 2.5, 0, 0, i],
        PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic,{damage: 0, speed: 0, maxSpeed: 0, reload: 0.4, recoil: 0, size: 3}]),
            TYPE: "portalAura",
            SYNCS_SKILLS: true,
            AUTOFIRE: true,
            NO_LIMITATIONS: true,
            MAX_CHILDREN: 1,
        },
    });
}

// Technical
Class.bot = {
    FACING_TYPE: 'looseToTarget',
    CONTROLLERS: [
        "nearestDifferentMaster",
        "mapAltToFire",
        "minion",
        "fleeAtLowHealth",
        ["mapFireToAlt", {onlyIfHasAltFireGun: true}],
        ["wanderAroundMap", {replicatePlayerMovement: true, lookAtGoal: true}]
    ],
    AI: {IGNORE_SHAPES: true}
}
Class.hp = { // HP for mothership or your custom gamemodes
    SHAPE: [],
    LABEL: "##% HP"
}
Class.tagMode = {
    SHAPE: "",
    LABEL: "Players"
}
