const { combineStats, makeHat, makeTurret } = require('../facilitators.js');
const { base } = require('../constants.js');
const g = require('../gunvals.js');

class io_rotOnRightClick extends IO {
    constructor(body, opts = {}) {
        super(body);
        this.speed = opts.speed ?? 0.16;
    }
    think(input) {
        if (input.alt) {
            this.body.facingType = "spin";
            this.body.facingTypeArgs = {speed: this.speed};
        } else {
            this.body.facingType = null
        }
    }
}
ioTypes.rotOnRightClick = io_rotOnRightClick

class io_rotOnLeftClick extends IO {
    constructor(body, opts = {}) {
        super(body);
        this.speed = opts.speed ?? -0.16;
    }
    think(input) {
        if (input.alt) {
            this.body.facingType = "spin";
            this.body.facingTypeArgs = {speed: this.speed};
        } else {
            this.body.facingType = null
        }
    }
}
ioTypes.rotOnLeftClick = io_rotOnLeftClick

Class.wranchHat = makeHat("M -0.4 0.1 L -0.4 -0.1 L -0.1 -0.1 L -0.1 -0.4 L 0.1 -0.4 L 0.1 -0.1 L 0.4 -0.1 L 0.4 0.1 L 0.1 0.1 L 0.1 0.4 L -0.1 0.4 L -0.1 0.1 Z", {color: "#333333", rotationSpeed: 0.06})

Class.wranchTurret = makeTurret("twin")
Class.wranchTurret.CONTROLLERS = [["rotOnRightClick"]]

Class.wranchTurret.TURRETS = [
    {
        POSITION: [15, 0, 0, 0, 0, 1],
        TYPE: "genericEntity"
    },
    {
        POSITION: [15, 0, 0, 0, 0, 1],
        TYPE: "wranchHat"
    }
]

Class.wranch = {
    PARENT: "genericTank",
    LABEL: "Wranch",
    GUNS: [
        {
            POSITION: {
                LENGTH: 55,
                WIDTH: 7
            }
        },
        {
            POSITION: {
                LENGTH: 55,
                WIDTH: 6.5
            }
        },
        {
            POSITION: {
                LENGTH: 55,
                WIDTH: 6
            }
        },
        {
            POSITION: {
                LENGTH: 55,
                WIDTH: 5.5
            }
        },
        {
            POSITION: {
                LENGTH: 15,
                WIDTH: 9,
                ASPECT: -2
            }
        }
    ],
    TURRETS: [
        {
            POSITION: [15, 55, 0, 0, 360, 1],
            TYPE: "wranchTurret"
        }
    ]
}

Class.menu_addons.UPGRADES_TIER_0.push("wranch")

Class.hcnarwTurret = makeTurret("twin")
Class.hcnarwTurret.CONTROLLERS = [["rotOnLeftClick"]]

Class.hcnarwTurret.TURRETS = [
    {
        POSITION: [15, 0, 0, 0, 0, 1],
        TYPE: "genericEntity"
    },
    {
        POSITION: [15, 0, 0, 0, 0, 1],
        TYPE: "wranchHat"
    }
]

Class.hcnarw = {
    PARENT: "genericTank",
    LABEL: "hcnarW",
    GUNS: [
        {
            POSITION: {
                LENGTH: 55,
                WIDTH: 7
            }
        },
        {
            POSITION: {
                LENGTH: 55,
                WIDTH: 6.5
            }
        },
        {
            POSITION: {
                LENGTH: 55,
                WIDTH: 6
            }
        },
        {
            POSITION: {
                LENGTH: 55,
                WIDTH: 5.5
            }
        },
        {
            POSITION: {
                LENGTH: 15,
                WIDTH: 9,
                ASPECT: -2
            }
        }
    ],
    TURRETS: [
        {
            POSITION: [15, 55, 0, 0, 360, 1],
            TYPE: "hcnarwTurret"
        }
    ]
}
// Ranger
Class.wranchTurretSniper = makeTurret("ranger");
Class.wranchTurretSniper.CONTROLLERS = [["rotOnRightClick", { speed: 0.08 }]];
Class.wranchTurretSniper.TURRETS = [
    { POSITION: [13, 0, 0, 0, 0, 1], TYPE: "genericEntity" },
    { POSITION: [13, 0, 0, 0, 0, 1], TYPE: "wranchHat" },
];

// Assassin
Class.wranchTurretAssassin = makeTurret("assassin");
Class.wranchTurretAssassin.CONTROLLERS = [["rotOnRightClick", { speed: 0.05 }]];
Class.wranchTurretAssassin.TURRETS = [
    { POSITION: [13, 0, 0, 0, 0, 1], TYPE: "genericEntity" },
    { POSITION: [13, 0, 0, 0, 0, 1], TYPE: "wranchHat" },
];

// Gunner
Class.wranchTurretGunner = makeTurret("autoGunner");
Class.wranchTurretGunner.CONTROLLERS = [["rotOnRightClick", { speed: 0.22 }]];
Class.wranchTurretGunner.TURRETS = [
    { POSITION: [11, 0, 0, 0, 0, 1], TYPE: "genericEntity" },
    { POSITION: [11, 0, 0, 0, 0, 1], TYPE: "wranchHat" },
];

// Overseer
Class.wranchTurretDrone = makeTurret("overseer");
Class.wranchTurretDrone.CONTROLLERS = [["rotOnRightClick", { speed: 0.12 }]];
Class.wranchTurretDrone.TURRETS = [
    { POSITION: [13, 0, 0, 0, 0, 1], TYPE: "genericEntity" },
    { POSITION: [13, 0, 0, 0, 0, 1], TYPE: "wranchHat" },
];

// Overlord
Class.wranchTurretOverlord = makeTurret("overlord");
Class.wranchTurretOverlord.CONTROLLERS = [["rotOnRightClick", { speed: 0.10 }]];
Class.wranchTurretOverlord.TURRETS = [
    { POSITION: [13, 0, 0, 0, 0, 1], TYPE: "genericEntity" },
    { POSITION: [13, 0, 0, 0, 0, 1], TYPE: "wranchHat" },
];

// Battleship
Class.wranchTurretBattleship = makeTurret("battleship");
Class.wranchTurretBattleship.CONTROLLERS = [["rotOnRightClick", { speed: 0.14 }]];
Class.wranchTurretBattleship.TURRETS = [
    { POSITION: [13, 0, 0, 0, 0, 1], TYPE: "genericEntity" },
    { POSITION: [13, 0, 0, 0, 0, 1], TYPE: "wranchHat" },
];

// Cyclone
Class.wranchTurretCyclone = makeTurret("cyclone");
Class.wranchTurretCyclone.CONTROLLERS = [["rotOnRightClick", { speed: 0.25 }]];
Class.wranchTurretCyclone.CONTROLLERS = [["rotOnLeftClick", { speed: -0.25 }]];
Class.wranchTurretCyclone.TURRETS = [
    { POSITION: [13, 0, 0, 0, 0, 1], TYPE: "genericEntity" },
    { POSITION: [13, 0, 0, 0, 0, 1], TYPE: "wranchHat" },
];
Class.doubleWranch = {
    PARENT: ["genericTank"],
    LABEL:  "Double Wranch",
    GUNS: [
        // Upper barrel
        { POSITION: { LENGTH: 55, WIDTH: 7,   Y: -8 } },
        { POSITION: { LENGTH: 55, WIDTH: 6.5, Y: -8 } },
        { POSITION: { LENGTH: 15, WIDTH: 9,   Y: -8, ASPECT: -2 } },
        // Lower barrel
        { POSITION: { LENGTH: 55, WIDTH: 7,   Y: 8 } },
        { POSITION: { LENGTH: 55, WIDTH: 6.5, Y: 8 } },
        { POSITION: { LENGTH: 15, WIDTH: 9,   Y: 8,  ASPECT: -2 } },
    ],
    TURRETS: [
        { POSITION: [14, 55, -8, 0, 360, 1], TYPE: "wranchTurret" },
        { POSITION: [14, 55,  8, 0, 360, 1], TYPE: "wranchTurret" },
    ],
};

Class.wranchSniper = {
    PARENT: ["genericTank"],
    LABEL:  "Boxxer",
    GUNS: [
        { POSITION: { LENGTH: 70, WIDTH: 6   } },
        { POSITION: { LENGTH: 70, WIDTH: 5.5 } },
        { POSITION: { LENGTH: 70, WIDTH: 5   } },
        { POSITION: { LENGTH: 70, WIDTH: 4.5 } },
        { POSITION: { LENGTH: 15, WIDTH: 8,   ASPECT: -2 } },
    ],
    TURRETS: [
        { POSITION: [15, 70, 0, 0, 360, 1], TYPE: "wranchTurretSniper" },
    ],
};

Class.wranchDroner = {
    PARENT: ["genericTank"],
    LABEL:  "Fighter",
    GUNS: [
        { POSITION: { LENGTH: 55, WIDTH: 7   } },
        { POSITION: { LENGTH: 55, WIDTH: 6.5 } },
        { POSITION: { LENGTH: 55, WIDTH: 6   } },
        { POSITION: { LENGTH: 55, WIDTH: 5.5 } },
        { POSITION: { LENGTH: 15, WIDTH: 9,   ASPECT: -2 } },
    ],
    TURRETS: [
        { POSITION: [15, 55, 0, 0, 360, 1], TYPE: "wranchTurretDrone" },
    ],
};

Class.triWranch = {
    PARENT: ["genericTank"],
    LABEL:  "Tri-Wranch",
    GUNS: [
        // Centre barrel
        { POSITION: { LENGTH: 55, WIDTH: 7,   Y:   0 } },
        { POSITION: { LENGTH: 55, WIDTH: 6.5, Y:   0 } },
        { POSITION: { LENGTH: 15, WIDTH: 9,   Y:   0, ASPECT: -2 } },
        // Upper barrel
        { POSITION: { LENGTH: 55, WIDTH: 7,   Y: -16 } },
        { POSITION: { LENGTH: 55, WIDTH: 6.5, Y: -16 } },
        { POSITION: { LENGTH: 15, WIDTH: 9,   Y: -16, ASPECT: -2 } },
        // Lower barrel
        { POSITION: { LENGTH: 55, WIDTH: 7,   Y:  16 } },
        { POSITION: { LENGTH: 55, WIDTH: 6.5, Y:  16 } },
        { POSITION: { LENGTH: 15, WIDTH: 9,   Y:  16, ASPECT: -2 } },
    ],
    TURRETS: [
        { POSITION: [13, 55,   0, 0, 360, 1], TYPE: "wranchTurret" },
        { POSITION: [13, 55, -16, 0, 360, 1], TYPE: "wranchTurret" },
        { POSITION: [13, 55,  16, 0, 360, 1], TYPE: "wranchTurret" },
    ],
};

Class.crossWranch = {
    PARENT: ["genericTank"],
    LABEL:  "Hailer",
    GUNS: [
        // North
        { POSITION: { LENGTH: 50, WIDTH: 7,   ANGLE:   0 } },
        { POSITION: { LENGTH: 50, WIDTH: 6.5, ANGLE:   0 } },
        { POSITION: { LENGTH: 13, WIDTH: 9,   ANGLE:   0, ASPECT: -2 } },
        // East
        { POSITION: { LENGTH: 50, WIDTH: 7,   ANGLE:  90 } },
        { POSITION: { LENGTH: 50, WIDTH: 6.5, ANGLE:  90 } },
        { POSITION: { LENGTH: 13, WIDTH: 9,   ANGLE:  90, ASPECT: -2 } },
        // South
        { POSITION: { LENGTH: 50, WIDTH: 7,   ANGLE: 180 } },
        { POSITION: { LENGTH: 50, WIDTH: 6.5, ANGLE: 180 } },
        { POSITION: { LENGTH: 13, WIDTH: 9,   ANGLE: 180, ASPECT: -2 } },
        // West
        { POSITION: { LENGTH: 50, WIDTH: 7,   ANGLE: 270 } },
        { POSITION: { LENGTH: 50, WIDTH: 6.5, ANGLE: 270 } },
        { POSITION: { LENGTH: 13, WIDTH: 9,   ANGLE: 270, ASPECT: -2 } },
    ],
    TURRETS: [
        { POSITION: [13, 50,   0,   0, 360, 1], TYPE: "wranchTurret" },
        { POSITION: [13,  0,  50,  90, 360, 1], TYPE: "wranchTurret" },
        { POSITION: [13,-50,   0, 180, 360, 1], TYPE: "wranchTurret" },
        { POSITION: [13,  0, -50, 270, 360, 1], TYPE: "wranchTurret" },
    ],
};

Class.wranchAssassin = {
    PARENT: ["genericTank"],
    LABEL:  "Uppercut",
    GUNS: [
        { POSITION: { LENGTH: 90, WIDTH: 5.5 } },
        { POSITION: { LENGTH: 90, WIDTH: 5   } },
        { POSITION: { LENGTH: 90, WIDTH: 4.5 } },
        { POSITION: { LENGTH: 90, WIDTH: 4   } },
        { POSITION: { LENGTH: 15, WIDTH: 7,   ASPECT: -2 } },
        // Rear counterweight cosmetic
        { POSITION: { LENGTH: 18, WIDTH: 10,  ANGLE: 180 } },
    ],
    TURRETS: [
        { POSITION: [14, 90, 0, 0, 360, 1], TYPE: "wranchTurretAssassin" },
    ],
};

Class.wranchGunner = {
    PARENT: ["genericTank"],
    LABEL:  "Grappler",
    GUNS: [
        { POSITION: { LENGTH: 38, WIDTH: 9   } },
        { POSITION: { LENGTH: 38, WIDTH: 8.5 } },
        { POSITION: { LENGTH: 38, WIDTH: 8   } },
        { POSITION: { LENGTH: 10, WIDTH: 11,  ASPECT: -2 } },
    ],
    TURRETS: [
        { POSITION: [15, 38, 0, 0, 360, 1], TYPE: "wranchTurretGunner" },
    ],
};

Class.wranchOverlord = {
    PARENT: ["genericTank"],
    LABEL:  "Overmind",
    GUNS: [
        { POSITION: { LENGTH: 55, WIDTH: 8   } },
        { POSITION: { LENGTH: 55, WIDTH: 7.5 } },
        { POSITION: { LENGTH: 55, WIDTH: 7   } },
        { POSITION: { LENGTH: 55, WIDTH: 6.5 } },
        { POSITION: { LENGTH: 15, WIDTH: 10,  ASPECT: -2 } },
    ],
    TURRETS: [
        { POSITION: [16, 55, 0, 0, 360, 1], TYPE: "wranchTurretOverlord" },
    ],
};

Class.wranchBattleship = {
    PARENT: ["genericTank"],
    LABEL:  "Destroyer",
    GUNS: [
        { POSITION: { LENGTH: 52, WIDTH: 8   } },
        { POSITION: { LENGTH: 52, WIDTH: 7.5 } },
        { POSITION: { LENGTH: 52, WIDTH: 7   } },
        { POSITION: { LENGTH: 52, WIDTH: 6.5 } },
        { POSITION: { LENGTH: 14, WIDTH: 10,  ASPECT: -2 } },
    ],
    TURRETS: [
        { POSITION: [16, 52, 0, 0, 360, 1], TYPE: "wranchTurretBattleship" },
    ],
};

Class.wranchCyclone = {
    PARENT: ["genericTank"],
    LABEL:  "Hailstorm",
    GUNS: [
        { POSITION: { LENGTH: 52, WIDTH: 8   } },
        { POSITION: { LENGTH: 52, WIDTH: 7.5 } },
        { POSITION: { LENGTH: 52, WIDTH: 7   } },
        { POSITION: { LENGTH: 52, WIDTH: 6.5 } },
        { POSITION: { LENGTH: 14, WIDTH: 10,  ASPECT: -2 } },
    ],
    TURRETS: [
        { POSITION: [16, 52, 0, 0, 360, 1], TYPE: "wranchTurretCyclone" },
    ],
};

// Tier 1
Class.wranch.UPGRADES_TIER_0 = ["doubleWranch", "wranchSniper", "wranchDroner", "hcnarw"];

// Tier 2
Class.doubleWranch.UPGRADES_TIER_0 = ["triWranch", "crossWranch"];

// Tier 2
Class.wranchSniper.UPGRADES_TIER_0 = ["wranchCyclone", "wranchAssassin", "wranchGunner"];

// Tier 2
Class.wranchDroner.UPGRADES_TIER_0 = ["wranchOverlord", "wranchBattleship"];