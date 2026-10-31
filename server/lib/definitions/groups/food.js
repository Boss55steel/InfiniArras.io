const {makeCrasher, makeLaby, makePolychoron, makePolyhedron, makePresent, makeRarities, makeRelic} = require('../facilitators.js')
const {basePolygonDamage, basePolygonHealth} = require('../constants.js')

// Set the below variable to true to enable the flat 3D shapes from Old Dreadnoughts.
const classic_3D_shapes = false

// Eggs
Class.egg = {
    PARENT: "food",
    LABEL: "Egg",
    VALUE: 5,
    SHAPE: 0,
    SIZE: 4.5,
    COLOR: "veryLightGrey",
    INTANGIBLE: true,
    VISIBLE_ON_BLACKOUT: true,
    BODY: {
        DAMAGE: 0,
        DENSITY: 2,
        HEALTH: 0.5 * basePolygonHealth,
        PENETRATION: 1,
        PUSHABILITY: 0,
        ACCELERATION: 0.015
    },
    DRAW_HEALTH: false
}
Class.gem = {
    PARENT: "food",
    LABEL: "Gem",
    VALUE: 2e3,
    SHAPE: 6,
    SIZE: 4.5,
    COLOR: "aqua",
    BODY: {
        DAMAGE: basePolygonDamage / 4,
        DENSITY: 4,
        HEALTH: 10,
        PENETRATION: 2,
        RESIST: 2,
        PUSHABILITY: 0.25,
        ACCELERATION: 0.015
    },
    DRAW_HEALTH: true,
    INTANGIBLE: false,
    GIVE_KILL_MESSAGE: true
}
Class.jewel = {
    PARENT: "food",
    LABEL: "Jewel",
    VALUE: 1e5,
    SHAPE: 6,
    SIZE: 8,
    COLOR: "yellow",
    BODY: {
        DAMAGE: basePolygonDamage / 4,
        DENSITY: 4,
        HEALTH: 50,
        PENETRATION: 2,
        RESIST: 2,
        PUSHABILITY: 0.25,
        ACCELERATION: 0.015
    },
    DRAW_HEALTH: true,
    INTANGIBLE: false,
    GIVE_KILL_MESSAGE: true
}
makeRarities("egg")
// --- START OF MORE POLYHEDRA ADDON INTEGRATION ---

const ensureIsClass = (Class, str) => {
    if ("object" == typeof str) return str;
    if (str in Class) return Class[str];
    throw Error(`Definition ${str} is attempted to be gotten but does not exist!`);
};

// 1 for OG hp, 0.1 for nerfed (0.05 default)
const ThreeDHealthMutli = 0.05;
// 1 for OG value, 0.25 for nerfed (0.25 default)
const ThreeDValueMutli = 0.25;
Class.threeDFood = {
    TYPE: "food",
    DAMAGE_CLASS: 1,
    LEVEL_CAP: 1,
    CONTROLLERS: ["moveInCircles"],
    HITS_OWN_TYPE: "repel",
    MOTION_TYPE: "drift",
    FACING_TYPE: "turnWithSpeed",
    COLOR: "white",
    BODY: { STEALTH: 30, PUSHABILITY: 1 },
    DAMAGE_EFFECTS: false,
    RATEFFECTS: false,
    HEALTH_WITH_LEVEL: false,
};

// Core Platonic Solids
Class.cnxTetrahedron = {
    PARENT: ["threeDFood"],
    LABEL: "Tetrahedron",
    VALUE: (2e7) * ThreeDValueMutli,
    SIZE: 10,
    SHAPE: "M -0.13 0.07 L -0.87 -0.35 L -0.13 0.92 Z M 0.13 0.07 L 0.13 0.92 L 0.87 -0.35 Z M 0 -0.15 L 0.74 -0.57 L -0.74 -0.57 Z",
    BODY: { DAMAGE: 12, DENSITY: 20, HEALTH: 500 * ThreeDHealthMutli, PENETRATION: 17.5, ACCELERATION: 0.002 },
    DRAW_HEALTH: true,
    GIVE_KILL_MESSAGE: true
};

Class.cnxCube = {
    PARENT: ["threeDFood"],
    LABEL: "Cube",
    VALUE: (3e7) * ThreeDValueMutli,
    SIZE: 15,
    SHAPE: "M -0.13 0.07 L -0.87 -0.35 L -0.87 0.5 L -0.13 0.93 Z M 0.13 0.07 L 0.13 0.93 L 0.87 0.5 L 0.87 -0.35 Z M 0 -0.15 L 0.74 -0.57 L 0 -1 L -0.74 -0.57 Z",
    BODY: { DAMAGE: 15, DENSITY: 23, HEALTH: 666 * ThreeDHealthMutli, PENETRATION: 22.5, ACCELERATION: 0.002 },
    DRAW_HEALTH: true,
    GIVE_KILL_MESSAGE: true,
};
Class.cnxOctahedron = {
    PARENT: ["threeDFood"],
    LABEL: "Octahedron",
    VALUE: (4e7) * ThreeDValueMutli,
    SIZE: 8*2.5,
    SHAPE: "M -0.12 -0.12 L -0.12 -0.88 L -0.88 -0.12 Z M -0.12 0.12 L -0.88 0.12 L -0.12 0.88 Z M 0.12 0.12 L 0.12 0.88 L 0.88 0.12 Z M 0.12 -0.12 L 0.88 -0.12 L 0.12 -0.88 Z",
    BODY: {
        DAMAGE: 18,
        DENSITY: 26,
        HEALTH: 866 * ThreeDHealthMutli,
        PENETRATION: 30,
        ACCELERATION: 0.002
    },
    DRAW_HEALTH: true,
    GIVE_KILL_MESSAGE: true
};
Class.cnxDodecahedron = {
    PARENT: ["threeDFood"],
    LABEL: "Dodecahedron",
    VALUE: (5e7) * ThreeDValueMutli,
    SIZE: 12*2.5,
    SHAPE: "M -0.28 -0.39 H 0.28 L 0.455 0.15 L 0 0.48 L -0.455 0.15 Z M -0.951 -0.309 L -0.957 0.194 L -0.659 0.102 L -0.473 -0.469 L -0.66 -0.719 Z M -0.588 0.809 L -0.111 0.97 L -0.107 0.658 L -0.592 0.305 L -0.888 0.406 Z M 0.588 0.809 L 0.888 0.406 L 0.593 0.305 L 0.107 0.658 L 0.111 0.97 Z M 0.951 -0.309 L 0.66 -0.719 L 0.473 -0.469 L 0.659 0.102 L 0.957 0.194 Z M 0 -1 L -0.48 -0.85 L -0.3 -0.595 H 0.3 L 0.48 -0.85 Z",
    BODY: {
        DAMAGE: 22.5,
        DENSITY: 30,
        HEALTH: 1000 * ThreeDHealthMutli,
        RESIST: 10,
        PENETRATION: 35,
        ACCELERATION: 0.002
    },
    DRAW_HEALTH: true,
    GIVE_KILL_MESSAGE: true,
};
Class.cnxIcosahedron = {
    PARENT: ["threeDFood"],
    LABEL: "Icosahedron",
    VALUE: (1e8) * ThreeDValueMutli,
    SIZE: 20*2.5,
    SHAPE: "M -0.84 0.485 L -0.196 0.621 L -0.636 -0.141 Z M 0.733 -0.319 L 0.912 0.27 L 0.911 -0.422 Z M 0.643 -0.475 L 0.222 -0.925 L 0.821 -0.578 Z M 0.84 0.485 L 0.636 -0.141 L 0.196 0.621 Z M -0.643 -0.475 L -0.222 -0.925 L -0.821 -0.578 Z M -0.733 -0.319 L -0.912 0.27 L -0.911 -0.422 Z M 0 -0.97 L -0.44 -0.48 L 0.44 -0.48 Z M -0.09 0.794 L -0.69 0.655 L -0.09 1 Z M 0.09 0.794 L 0.69 0.655 L 0.09 1 Z M 0 0.62 L -0.537 -0.31 L 0.537 -0.31 Z",
    BODY: {
        DAMAGE: 17.5,
        DENSITY: 25,
        HEALTH: 1200 * ThreeDHealthMutli,
        RESIST: 7.5,
        PENETRATION: 22.5,
        ACCELERATION: 0.002
    },
    DRAW_HEALTH: true,
    GIVE_KILL_MESSAGE: true,
};
// ARCHIMEDIAN
Class.cnxCuboctahedron = {
    PARENT: ["threeDFood"],
    LABEL: "Cuboctahedon",
    VALUE: (6e7) * ThreeDValueMutli,
    SIZE: 8*2.5,
    SHAPE: "M -0.27 0.47 L -0.27 -0.4677 L 0.542 0.0012 Z M -0.1934 0.5851 L 0.0516 1.0094 L 0.8484 0.5494 L 0.6034 0.1251 Z M -0.32 -0.5543 L -0.8397 -0.5544 L -0.0603 -1.0044 Z M 0.6034 -0.1251 L 0.8484 -0.5494 L 0.0516 -1.0094 L -0.1934 -0.5851 Z M -0.32 0.5543 L -0.0603 1.0044 L -0.8397 0.5544 Z M -0.41 -0.46 L -0.9 -0.46 L -0.9 0.46 L -0.41 0.46 Z M 0.64 -0 L 0.9 -0.45 L 0.9 0.45 Z",
    BODY: {
        DAMAGE: 20,
        DENSITY: 46,
        HEALTH: 1366 * ThreeDHealthMutli,
        PENETRATION: 47.5,
        ACCELERATION: 0.002
    },
    DRAW_HEALTH: true,
    INTANGIBLE: false,
    GIVE_KILL_MESSAGE: true,
};
Class.cnxIcosidodecahedron = {
    PARENT: ["threeDFood"],
    LABEL: "Icosidodecahedron",
    VALUE: (1.5e8) * ThreeDValueMutli,
    SIZE: 30*2.5,
    SHAPE: "M -0.1095 -0.1902 L 0.2196 -0.0003 L -0.1095 0.1903 Z M -0.16 -0.2 L -0.47 -0.33 L -0.67 0 L -0.47 0.33 L -0.16 0.2 Z M -0.68 0.06 L -0.51 0.35 L -0.65 0.36 Z M -0.43 0.37 L -0.15 0.25 L -0.11 0.56 Z M -0.53 -0.35 L -0.68 -0.08 L -0.65 -0.36 Z M -0.6 0.4 L -0.49 0.4 L -0.1101 0.62 L -0.06 0.71 L -0.35 0.59 Z M -0.0932 0.2386 L -0.0508 0.572 L 0.335 0.5802 L 0.5208 0.242 L 0.2532 0.0386 Z M 0.392 0.5589 L 0.5581 0.2667 L 0.6368 0.3829 Z M 0.5354 0.1874 L 0.2915 0.0049 L 0.54 -0.1847 Z M -0.0381 0.634 L 0.2707 0.6289 L 0.0132 0.7429 Z M 0.6464 0.3196 L 0.5914 0.2244 L 0.592 -0.2147 L 0.6449 -0.303 L 0.686 0.0081 Z M 0.2532 -0.0386 L 0.5208 -0.242 L 0.335 -0.5802 L -0.0508 -0.572 L -0.0932 -0.2386 Z M 0.288 -0.6189 L -0.0481 -0.6167 L 0.0132 -0.7429 Z M -0.1054 -0.5574 L -0.1415 -0.2549 L -0.43 -0.3753 Z M 0.5681 -0.284 L 0.4093 -0.5489 L 0.6368 -0.3829 Z M -0.0464 -0.7196 L -0.1014 -0.6244 L -0.4819 -0.4053 L -0.5849 -0.407 L -0.336 -0.5981 Z",
    BODY: {
        DAMAGE: 40,
        DENSITY: 55,
        HEALTH: 2200 * ThreeDHealthMutli,
        RESIST: 17.5,
        PENETRATION: 57.5,
        ACCELERATION: 0.002
    },
    DRAW_HEALTH: true,
    INTANGIBLE: false,
    GIVE_KILL_MESSAGE: true,
};
Class.cnxGreatRhombicosidodecahedron = {
    PARENT: ["threeDFood"],
    LABEL: "Great Rhombicosidodecahedron",
    VALUE: (6e8) * ThreeDValueMutli,
    SIZE: 62*2.5,
    SHAPE: "M 0.2977 -0.2163 L 0.1137 -0.35 L -0.1137 -0.35 L -0.2977 -0.2163 L -0.368 -0 L -0.2977 0.2163 L -0.1137 0.35 L 0.1137 0.35 L 0.1137 0.35 L 0.2977 0.2163 L 0.368 0 Z M 0.0999 0.4099 L 0.1 0.5699 L -0.09 0.57 L -0.09 0.4101 Z M 0.3183 0.2823 L 0.1699 0.39 L 0.17 0.5699 L 0.3399 0.62 L 0.4846 0.5149 L 0.4895 0.338 Z M 0.2828 0.6904 L 0.1079 0.6361 L -0.1081 0.6361 L -0.2828 0.6904 L -0.3496 0.7779 L -0.2827 0.8655 L -0.1079 0.9198 L 0.1082 0.9197 L 0.108 0.9198 L 0.2828 0.8657 L 0.3496 0.7781 Z M 0.37 0.67 L 0.4201 0.74 L 0.574 0.628 L 0.5229 0.5588 Z M 0.4199 0.79 L 0.3799 0.85 L 0.46 0.82 L 0.6376 0.6908 L 0.691 0.624 L 0.6216 0.6436 Z M -0.359 0.2217 L -0.5111 0.2712 L -0.5699 0.0905 L -0.4178 0.0411 Z M -0.1701 0.39 L -0.3184 0.2821 L -0.4895 0.3378 L -0.4846 0.5148 L -0.3399 0.62 L -0.1702 0.57 Z M -0.5692 0.4823 L -0.5716 0.2992 L -0.6384 0.0938 L -0.744 -0.0556 L -0.8479 -0.0921 L -0.9105 -0.0014 L -0.9081 0.1816 L -0.8413 0.3871 L -0.8414 0.3869 L -0.7359 0.5365 L -0.632 0.5729 Z M -0.5229 0.5589 L -0.574 0.6282 L -0.4199 0.74 L -0.3699 0.67 Z M -0.6216 0.6435 L -0.691 0.624 L -0.6377 0.6909 L -0.46 0.8199 L -0.3799 0.85 L -0.42 0.7901 Z M -0.3218 -0.2729 L -0.4159 -0.4023 L -0.2622 -0.514 L -0.1682 -0.3846 Z M -0.4235 -0.0412 L -0.3667 -0.2156 L -0.4725 -0.3612 L -0.6394 -0.3018 L -0.6947 -0.1317 L -0.5947 0.0143 Z M -0.6346 -0.3923 L -0.4612 -0.4512 L -0.2865 -0.5782 L -0.177 -0.7248 L -0.1744 -0.8349 L -0.28 -0.8664 L -0.4533 -0.8075 L -0.6281 -0.6805 L -0.628 -0.6806 L -0.7376 -0.5341 L -0.7402 -0.424 Z M -0.6931 -0.3246 L -0.7748 -0.3518 L -0.8335 -0.1707 L -0.7515 -0.1448 Z M -0.8041 -0.3923 L -0.807 -0.4643 L -0.8542 -0.393 L -0.9219 -0.1841 L -0.9258 -0.0986 L -0.8812 -0.1553 Z M 0.1601 -0.3904 L 0.2541 -0.5199 L 0.4078 -0.4082 L 0.3138 -0.2788 Z M -0.0917 -0.4155 L 0.0917 -0.4154 L 0.1975 -0.561 L 0.0894 -0.7014 L -0.0894 -0.7014 L -0.1974 -0.5612 Z M 0.177 -0.7248 L 0.2866 -0.5781 L 0.4614 -0.4512 L 0.6346 -0.3923 L 0.7401 -0.4239 L 0.7375 -0.534 L 0.6279 -0.6806 L 0.4531 -0.8076 L 0.4532 -0.8076 L 0.28 -0.8665 L 0.1745 -0.835 Z M 0.0945 -0.7595 L 0.0952 -0.8456 L -0.0952 -0.8455 L -0.0945 -0.7595 Z M 0.1246 -0.886 L 0.1922 -0.911 L 0.1098 -0.9338 L -0.1098 -0.9337 L -0.1923 -0.911 L -0.1246 -0.8861 Z M 0.4208 0.0316 L 0.573 0.081 L 0.5142 0.2617 L 0.3621 0.2123 Z M 0.3668 -0.2156 L 0.4234 -0.0412 L 0.5946 0.0145 L 0.6947 -0.1317 L 0.6394 -0.3018 L 0.4727 -0.3612 Z M 0.744 -0.0556 L 0.6384 0.0939 L 0.5717 0.2994 L 0.5692 0.4823 L 0.6319 0.5729 L 0.7358 0.5364 L 0.8413 0.3869 L 0.9081 0.1814 L 0.9081 0.1815 L 0.9106 -0.0015 L 0.848 -0.0921 Z M 0.7515 -0.1448 L 0.8336 -0.1708 L 0.7747 -0.3518 L 0.6931 -0.3246 Z M 0.8811 -0.1553 L 0.9258 -0.0987 L 0.922 -0.1841 L 0.8541 -0.393 L 0.807 -0.4644 L 0.8042 -0.3923 Z",
    BODY: {
        DAMAGE: 50,
        DENSITY: 65,
        HEALTH: 5200 * ThreeDHealthMutli,
        RESIST: 21.5,
        PENETRATION: 75,
        ACCELERATION: 0.002
    },
    DRAW_HEALTH: true,
    INTANGIBLE: false,
    GIVE_KILL_MESSAGE: true,
};
// TRUNCATED(ARCHIMEDIAN)
Class.cnxTruncatedTetrahedron = {
    PARENT: ["threeDFood"],
    LABEL: "Truncated Tetrahedron",
    VALUE: (2e7) * ThreeDValueMutli * 2.25,
    SIZE: 8*2.5,
    SHAPE: "M 0.1 -0.2 L -0.2 0.1 L -0.88 0.11 L -0.9 -0.1599 L -0.1599 -0.9 L 0.11 -0.88 Z M 0.25 -0.27 L 0.25 -0.77 L 0.77 -0.25 Z M -0.1 0.2 L 0.2 -0.1 L 0.88 -0.11 L 0.9 0.1599 L 0.1599 0.9 L -0.11 0.88 Z M -0.25 0.27 L -0.25 0.77 L -0.77 0.25 Z",
    BODY: {
        DAMAGE: 12 * 1.2,
        DENSITY: 20 * 1.6,
        HEALTH: 500 * ThreeDHealthMutli * 1.5,
        PENETRATION: 17.5 * 1.3,
        ACCELERATION: 0.002
    },
    DRAW_HEALTH: true,
    GIVE_KILL_MESSAGE: true
};
Class.cnxTruncatedCube = {
    PARENT: ["threeDFood"],
    LABEL: "Truncated Cube",
    VALUE: (3e7) * ThreeDValueMutli * 2.25,
    SIZE: 14*2.5,
    SHAPE: "M 0.66 0.6701 L 0.35 0.69 L 0.69 0.35 Z M -0.6701 0.66 L -0.69 0.35 L -0.35 0.69 Z M -0.66 -0.6701 L -0.35 -0.69 L -0.69 -0.35 Z M 0.6701 -0.66 L 0.69 -0.35 L 0.35 -0.69 Z M 0.2 0.68 L -0.2 0.68 L -0.68 0.2 L -0.68 -0.2 L -0.68 -0.2 L -0.2 -0.68 L 0.2 -0.68 L 0.2 -0.68 L 0.68 -0.2 L 0.68 0.2 Z",
    BODY: {
        DAMAGE: 15 * 1.2,
        DENSITY: 23 * 1.6,
        HEALTH: 666 * ThreeDHealthMutli * 1.5,
        PENETRATION: 22.5 * 1.3,
        ACCELERATION: 0.002
    },
    DRAW_HEALTH: true,
    INTANGIBLE: false,
    GIVE_KILL_MESSAGE: true,
};
Class.cnxTruncatedOctahedron = {
    PARENT: ["threeDFood"],
    LABEL: "Truncated Octahedron",
    VALUE: (4e7) * ThreeDValueMutli * 2.25,
    SIZE: 14*2.5,
    SHAPE: "M -0.06 -0.54 L -0.07 -0.74 L -0.45 -0.72 L -0.72 -0.45 L -0.7401 -0.07 L -0.54 -0.06 Z M -0.54 0.06 L -0.74 0.07 L -0.72 0.45 L -0.45 0.72 L -0.07 0.7401 L -0.06 0.54 Z M 0.06 0.54 L 0.07 0.74 L 0.45 0.72 L 0.72 0.45 L 0.7401 0.07 L 0.54 0.06 Z M 0.54 -0.06 L 0.74 -0.07 L 0.72 -0.45 L 0.45 -0.72 L 0.07 -0.7401 L 0.06 -0.54 Z M 0 -0.42 L 0.42 0 L 0 0.42 L -0.42 0 Z",
    BODY: {
        DAMAGE: 18 * 1.2,
        DENSITY: 26 * 1.6,
        HEALTH: 866 * ThreeDHealthMutli * 1.5,
        PENETRATION: 30 * 1.3,
        ACCELERATION: 0.002
    },
    DRAW_HEALTH: true,
    GIVE_KILL_MESSAGE: true
};
Class.cnxTruncatedDodecahedron = {
    PARENT: ["threeDFood"],
    LABEL: "Truncated Dodecahedron",
    VALUE: (5e7) * ThreeDValueMutli * 2.25,
    SIZE: 32*2.5,
    SHAPE: "M -0.1 -0.1732 L -0.1 0.1732 L 0.2 -0 Z M 0.24 -0.05 L 0.44 -0.05 L 0.67 -0.22 L 0.69 -0.38 L 0.51 -0.66 L 0.3166 -0.7717 L -0.0159 -0.7876 L -0.1445 -0.6902 L -0.1767 -0.4061 L -0.0767 -0.2328 Z M 0.5 -0 L 0.69 -0.15 L 0.69 0.15 Z M 0.73 -0.42 L 0.76 -0.4901 L 0.6 -0.63 Z M 0.74 -0.2 L 0.75 -0.38 L 0.78 -0.47 L 0.81 -0.41 L 0.84 -0.13 L 0.84 0.13 L 0.81 0.41 L 0.78 0.47 L 0.75 0.38 L 0.74 0.2 Z M 0.72 0.4401 L 0.76 0.51 L 0.5901 0.66 Z M -0.1633 -0.1828 L -0.2633 -0.3561 L -0.5255 -0.4702 L -0.6741 -0.4076 L -0.8266 -0.1117 L -0.8266 0.1117 L -0.6741 0.4076 L -0.5255 0.4702 L -0.2633 0.3561 L -0.1633 0.1828 Z M -0.25 -0.433 L -0.4749 -0.5226 L -0.2151 -0.6726 Z M -0.7287 -0.4222 L -0.8044 -0.4131 L -0.8456 -0.2046 Z M -0.5432 -0.5409 L -0.7041 -0.4595 L -0.797 -0.4405 L -0.7601 -0.4965 L -0.5326 -0.6625 L -0.3074 -0.7925 L -0.0499 -0.9065 L 0.017 -0.9105 L -0.0459 -0.8395 L -0.1968 -0.7409 Z M 0.0211 -0.8436 L 0.0617 -0.9132 L 0.2765 -0.841 Z M -0.0767 0.2328 L -0.1767 0.4061 L -0.1445 0.6902 L -0.0159 0.7876 L 0.3166 0.7717 L 0.51 0.66 L 0.69 0.38 L 0.67 0.22 L 0.44 0.05 L 0.24 0.05 Z M -0.25 0.433 L -0.2151 0.6726 L -0.4749 0.5226 Z M -0.0013 0.8422 L 0.0444 0.9032 L 0.2456 0.8346 Z M -0.1968 0.7409 L -0.0459 0.8395 L 0.017 0.9105 L -0.0499 0.9065 L -0.3074 0.7925 L -0.5326 0.6625 L -0.7601 0.4965 L -0.797 0.4405 L -0.7041 0.4595 L -0.5432 0.5409 Z M -0.7411 0.4035 L -0.8217 0.4032 L -0.8666 0.181 Z",
    BODY: {
        DAMAGE: 22.5 * 1.2,
        DENSITY: 30 * 1.6,
        HEALTH: 1000 * ThreeDHealthMutli * 1.5,
        RESIST: 10,
        PENETRATION: 35 * 1.3,
        ACCELERATION: 0.002
    },
    DRAW_HEALTH: true,
    GIVE_KILL_MESSAGE: true,
};
Class.cnxTruncatedIcosahedron = {
    PARENT: ["threeDFood"],
    LABEL: "Truncated Icosahedron",
    VALUE: (1e8) * ThreeDValueMutli * 2.25,
    SIZE: 32*2.5,
    SHAPE: "M 0.3 0 L 0.0927 -0.2853 L -0.2427 -0.1763 L -0.2427 0.1763 L 0.0927 0.2853 Z M 0.37 0.05 L 0.61 0.05 L 0.6899 0.32 L 0.5174 0.5573 L 0.2361 0.5647 L 0.1619 0.3364 Z M 0.76 0.35 L 0.86 0.2499 L 0.8 0.36 L 0.5895 0.6496 L 0.5035 0.7406 L 0.5677 0.6146 Z M 0.68 -0 L 0.76 -0.2599 L 0.8501 -0.1699 L 0.8501 0.17 L 0.7599 0.26 Z M 0.1619 -0.3364 L 0.2361 -0.5647 L 0.5175 -0.5573 L 0.6899 -0.3199 L 0.61 -0.05 L 0.37 -0.05 Z M 0.5677 -0.6147 L 0.5034 -0.7407 L 0.5896 -0.6496 L 0.8 -0.3599 L 0.8599 -0.25 L 0.76 -0.35 Z M 0.2101 -0.6467 L -0.0123 -0.8031 L 0.1011 -0.861 L 0.4244 -0.7559 L 0.4821 -0.6424 Z M -0.2699 -0.2579 L -0.4641 -0.399 L -0.3701 -0.6644 L -0.0911 -0.755 L 0.1409 -0.5956 L 0.0668 -0.3673 Z M -0.4092 -0.7299 L -0.5489 -0.7077 L -0.4356 -0.7615 L -0.0951 -0.8721 L 0.028 -0.8951 L -0.098 -0.831 Z M -0.5501 -0.3997 L -0.7676 -0.2365 L -0.7876 -0.3622 L -0.5878 -0.6372 L -0.462 -0.657 Z M -0.3287 0.177 L -0.5229 0.3181 L -0.7463 0.1467 L -0.7462 -0.1467 L -0.5229 -0.3181 L -0.3287 -0.177 Z M -0.8206 0.1636 L -0.8427 0.3033 L -0.8588 0.179 L -0.8588 -0.179 L -0.8427 -0.3032 L -0.8206 -0.1636 Z M -0.5501 0.3997 L -0.4621 0.657 L -0.5878 0.6371 L -0.7876 0.3621 L -0.7676 0.2364 Z M 0.0668 0.3673 L 0.1409 0.5956 L -0.0911 0.7551 L -0.3701 0.6644 L -0.4641 0.399 L -0.2699 0.2579 Z M -0.098 0.831 L 0.028 0.8952 L -0.0952 0.8721 L -0.4356 0.7615 L -0.5488 0.7077 L -0.4092 0.7299 Z M 0.2101 0.6467 L 0.4821 0.6425 L 0.4243 0.7559 L 0.101 0.8609 L -0.0124 0.8031 Z",
    BODY: {
        DAMAGE: 17.5 * 1.2,
        DENSITY: 25 * 1.6,
        HEALTH: 1200 * ThreeDHealthMutli * 1.5,
        RESIST: 7.5,
        PENETRATION: 22.5 * 1.3,
        ACCELERATION: 0.002
    },
    DRAW_HEALTH: true,
    GIVE_KILL_MESSAGE: true,
};
// CATALAN
Class.cnxTriacontahedron = {
    PARENT: ["threeDFood"],
    LABEL: "Triacontahedron",
    VALUE: (2.5e8) * ThreeDValueMutli,
    SIZE: 30*2.5,
    SHAPE: "M 0.0501 -0.0001 L 0.4699 0.2901 L 0.79 0.0101 L 0.4699 -0.2899 Z M 0.4901 0.3601 L 0.33 0.72 L 0.62 0.46 L 0.7868 0.0915 Z M 0.0154 -0.0477 L 0.4211 -0.3573 L 0.2537 -0.7482 L -0.1305 -0.5365 Z M 0.4939 -0.3548 L 0.7867 -0.0914 L 0.6291 -0.4475 L 0.33 -0.7199 Z M -0.0406 -0.0294 L -0.2097 -0.5109 L -0.6332 -0.4725 L -0.5506 -0.0417 Z M -0.1848 -0.5794 L 0.1562 -0.7764 L -0.2312 -0.7366 L -0.5827 -0.5363 Z M -0.0405 0.0295 L -0.5507 0.0416 L -0.645 0.4562 L -0.2098 0.5108 Z M -0.6081 -0.0033 L -0.6901 -0.3885 L -0.772 -0.0077 L -0.6901 0.3885 Z M 0.0155 0.0476 L -0.1306 0.5366 L 0.2346 0.7544 L 0.421 0.3574 Z M -0.191 0.5773 L -0.5828 0.5363 L -0.2459 0.7318 L 0.1562 0.7764 Z",
    BODY: {
        DAMAGE: 22,
        DENSITY: 35,
        HEALTH: 1850 * ThreeDHealthMutli,
        RESIST: 9.25,
        PENETRATION: 34,
        ACCELERATION: 0.002
    },
    DRAW_HEALTH: true,
    GIVE_KILL_MESSAGE: true,
};
Class.cnxDisdyakisTriacontahedron = {
    PARENT: ["threeDFood"],
    LABEL: "Disdyakis Triacontahedron",
    VALUE: (2.5e8) * ThreeDValueMutli * 5,
    SIZE: 120*2.5,
    SHAPE: "M 0.03 0.01 L 0.4 0.28 L 0.43 0.01 Z M 0.4501 0.0101 L 0.7 0.0101 L 0.4201 0.28 Z M 0.43 0.2999 L 0.71 0.0199 L 0.52 0.37 Z M 0.5399 0.3799 L 0.7099 0.0501 L 0.57 0.4 Z M 0.03 -0.0101 L 0.4 -0.28 L 0.43 -0.0101 Z M 0.4499 -0.01 L 0.6999 -0.01 L 0.42 -0.2801 Z M 0.4299 -0.2999 L 0.7101 -0.02 L 0.52 -0.37 Z M 0.54 -0.38 L 0.71 -0.05 L 0.57 -0.4 Z M 0.0188 -0.0254 L 0.3899 -0.2939 L 0.1424 -0.4059 Z M 0.1487 -0.4249 L 0.2259 -0.6626 L 0.3961 -0.313 Z M 0.4181 -0.3163 L 0.2383 -0.6691 L 0.5126 -0.3802 Z M 0.5282 -0.3961 L 0.267 -0.6597 L 0.5566 -0.4185 Z M -0.0003 -0.0316 L -0.1427 -0.4669 L 0.1233 -0.4121 Z M 0.1295 -0.431 L 0.2068 -0.6687 L -0.1366 -0.486 Z M -0.1524 -0.5015 L 0.2004 -0.6815 L -0.1912 -0.6089 Z M -0.1945 -0.631 L 0.1719 -0.6907 L -0.2043 -0.6657 Z M -0.0184 -0.0257 L -0.159 -0.4616 L -0.342 -0.2608 Z M -0.3582 -0.2727 L -0.5604 -0.4196 L -0.1753 -0.4734 Z M -0.1716 -0.4954 L -0.5627 -0.4334 L -0.2032 -0.605 Z M -0.2135 -0.6248 L -0.5449 -0.4578 L -0.226 -0.6587 Z M -0.0301 -0.0095 L -0.4881 -0.0086 L -0.3538 -0.2446 Z M -0.3699 -0.2564 L -0.5721 -0.4033 L -0.5044 -0.0203 Z M -0.5241 -0.01 L -0.5862 -0.4012 L -0.6382 -0.0063 Z M -0.6602 -0.01 L -0.6038 -0.3769 L -0.6963 -0.0114 Z M -0.0301 0.0096 L -0.4881 0.0086 L -0.3537 0.2447 Z M -0.37 0.2564 L -0.5722 0.4033 L -0.5044 0.0204 Z M -0.5242 0.0101 L -0.5861 0.4012 L -0.6382 0.0063 Z M -0.6602 0.01 L -0.6038 0.3768 L -0.6963 0.0114 Z M -0.0183 0.0257 L -0.159 0.4616 L -0.342 0.2609 Z M -0.3582 0.2726 L -0.5604 0.4195 L -0.1752 0.4734 Z M -0.1715 0.4954 L -0.5627 0.4335 L -0.2032 0.605 Z M -0.2135 0.6248 L -0.545 0.4578 L -0.226 0.6587 Z M -0.0002 0.0316 L -0.1427 0.4669 L 0.1234 0.412 Z M 0.1295 0.4311 L 0.2068 0.6688 L -0.1365 0.486 Z M -0.1524 0.5017 L 0.2004 0.6814 L -0.1912 0.6089 Z M -0.1945 0.631 L 0.1718 0.6907 L -0.2043 0.6657 Z M 0.0188 0.0254 L 0.3899 0.2939 L 0.1424 0.4059 Z M 0.1486 0.4249 L 0.2258 0.6626 L 0.3961 0.3129 Z M 0.4182 0.3162 L 0.2384 0.6691 L 0.5126 0.3802 Z M 0.5283 0.3961 L 0.267 0.6598 L 0.5566 0.4185 Z",
    BODY: {
        DAMAGE: 25,
        DENSITY: 40,
        HEALTH: 5600 * ThreeDHealthMutli,
        RESIST: 10,
        PENETRATION: 45,
        ACCELERATION: 0.002
    },
    DRAW_HEALTH: true,
    GIVE_KILL_MESSAGE: true,
};
// TRIAKIS
Class.cnxTriakisTetrahedron = {
    PARENT: ["threeDFood"],
    LABEL: "Triakis Tetrahedron",
    VALUE: (2e7) * ThreeDValueMutli * 3.75,
    SIZE: 12*2.5,
    SHAPE: "M -0.12 0.06 L -0.36 0.5401 L -0.42 0.05 Z M -0.12 -0.06 L -0.36 -0.5401 L -0.42 -0.05 Z M 0.112 0.0739 L 0.6477 0.0417 L 0.2533 0.3387 Z M 0.008 0.1339 L -0.2877 0.5818 L 0.1667 0.3887 Z M 0.008 -0.1339 L -0.2877 -0.5818 L 0.1667 -0.3887 Z M 0.112 -0.0739 L 0.6477 -0.0418 L 0.2533 -0.3387 Z",
    BODY: {
        DAMAGE: 12 * 1.25,
        DENSITY: 20 * 1.65,
        HEALTH: 500 * ThreeDHealthMutli * 1.75,
        PENETRATION: 17.5 * 1.425,
        ACCELERATION: 0.002
    },
    DRAW_HEALTH: true,
    GIVE_KILL_MESSAGE: true
};
Class.cnxTriakisCube = {
    PARENT: ["threeDFood"],
    LABEL: "Triakis Cube",
    VALUE: (3e7) * ThreeDValueMutli * 3.75,
    SIZE: 24*2.5,
    SHAPE: "M 0.06 -0.06 L 0.54 -0.06 L 0.6 -0.59 L 0.06 -0.54 Z M -0 -0.61 L 0.58 -0.63 L -0 -0.63 L -0.58 -0.63 Z M -0.06 -0.06 L -0.06 -0.54 L -0.59 -0.6 L -0.54 -0.06 Z M -0.61 0 L -0.63 -0.58 L -0.63 0 L -0.63 0.58 Z M -0.06 0.06 L -0.54 0.06 L -0.6 0.59 L -0.06 0.54 Z M 0 0.61 L -0.58 0.63 L 0 0.63 L 0.58 0.63 Z M 0.06 0.06 L 0.06 0.54 L 0.59 0.6 L 0.54 0.06 Z M 0.61 -0 L 0.63 0.58 L 0.63 -0 L 0.63 -0.58 Z",
    BODY: {
        DAMAGE: 15 * 1.25,
        DENSITY: 23 * 1.65,
        HEALTH: 666 * ThreeDHealthMutli * 1.75,
        PENETRATION: 22.5 * 1.425,
        ACCELERATION: 0.002
    },
    DRAW_HEALTH: true,
    INTANGIBLE: false,
    GIVE_KILL_MESSAGE: true,
};
Class.cnxTriakisOctahedron = {
    PARENT: ["threeDFood"],
    LABEL: "Triakis Octahedron",
    VALUE: (4e7) * ThreeDValueMutli * 3.75,
    SIZE: 24*2.5,
    SHAPE: "M 0.06 0.05 L 0.2709 0.4153 L 0.75 0.05 Z M 0.0133 0.077 L 0.2242 0.4423 L -0.3317 0.6745 Z M 0.2717 0.5494 L -0.2788 0.7628 L 0.3412 0.6697 Z M 0.3399 0.51 L 0.8 0.14 L 0.4094 0.6303 Z M 0.0133 -0.077 L 0.2242 -0.4423 L -0.3317 -0.6745 Z M 0.06 -0.05 L 0.2709 -0.4153 L 0.75 -0.05 Z M 0.3399 -0.51 L 0.8 -0.14 L 0.4094 -0.6303 Z M 0.2717 -0.5494 L -0.2788 -0.7628 L 0.3412 -0.6697 Z M -0.0733 0.027 L -0.4951 0.027 L -0.4183 0.6245 Z M -0.0733 -0.027 L -0.4951 -0.027 L -0.4183 -0.6245 Z M -0.6116 -0.0394 L -0.5212 -0.6228 L -0.7506 -0.0394 Z M -0.6117 0.0394 L -0.5212 0.6228 L -0.7506 0.0394 Z",
    BODY: {
        DAMAGE: 18 * 1.25,
        DENSITY: 26 * 1.65,
        HEALTH: 866 * ThreeDHealthMutli * 1.75,
        PENETRATION: 30 * 1.425,
        ACCELERATION: 0.002
    },
    DRAW_HEALTH: true,
    GIVE_KILL_MESSAGE: true
};
Class.cnxTriakisDodecahedron = {
    PARENT: ["threeDFood"],
    LABEL: "Triakis Dodecahedron",
    VALUE: (5e7) * ThreeDValueMutli * 3.75,
    SIZE: 60*2.5,
    SHAPE: "M 0.1 0 L 0.53 -0.33 L 0.5299 0.3301 Z M 0.6 0.3399 L 0.6 -0.34 L 0.7699 0.0001 Z M 0.63 -0.4101 L 0.7799 -0.1099 L 0.73 -0.4801 Z M 0.63 0.41 L 0.7801 0.11 L 0.7301 0.48 Z M 0.0309 -0.0951 L -0.1501 -0.606 L 0.4777 -0.402 Z M 0.5087 -0.4656 L -0.138 -0.6757 L 0.238 -0.7322 Z M -0.1953 -0.7259 L 0.1365 -0.7757 L -0.231 -0.8426 Z M 0.5846 -0.4725 L 0.3457 -0.7079 L 0.6821 -0.546 Z M -0.0809 -0.0588 L -0.6227 -0.0445 L -0.2347 -0.5785 Z M -0.2856 -0.6277 L -0.6853 -0.0776 L -0.6228 -0.4526 Z M -0.7507 -0.0386 L -0.6956 -0.3695 L -0.8727 -0.0407 Z M -0.2687 -0.702 L -0.5664 -0.5475 L -0.3085 -0.8174 Z M -0.0809 0.0588 L -0.2348 0.5785 L -0.6227 0.0445 Z M -0.6852 0.0777 L -0.2856 0.6278 L -0.6229 0.4525 Z M -0.2687 0.702 L -0.5664 0.5474 L -0.3084 0.8174 Z M -0.7507 0.0386 L -0.6957 0.3695 L -0.8727 0.0408 Z M 0.0309 0.0951 L 0.4776 0.4021 L -0.1501 0.606 Z M -0.1379 0.6757 L 0.5088 0.4656 L 0.2379 0.7323 Z M 0.5846 0.4725 L 0.3456 0.7078 L 0.6821 0.5459 Z M -0.1953 0.7259 L 0.1364 0.7758 L -0.2309 0.8426 Z",
    BODY: {
        DAMAGE: 22.5 * 1.25,
        DENSITY: 30 * 1.65,
        HEALTH: 1000 * ThreeDHealthMutli * 1.75,
        RESIST: 10,
        PENETRATION: 35 * 1.425,
        ACCELERATION: 0.002
    },
    DRAW_HEALTH: true,
    GIVE_KILL_MESSAGE: true,
};
Class.cnxTriakisIcosahedron = {
    PARENT: ["threeDFood"],
    LABEL: "Triakis Icosahedron",
    VALUE: (1e8) * ThreeDValueMutli * 3.75,
    SIZE: 60*2.5,
    SHAPE: "M -0.035 -0.0606 L -0.6103 -0.0171 L 0.2903 -0.5371 Z M -0.644 -0.0554 L -0.28 -0.485 L 0.269 -0.5941 Z M -0.3027 -0.5643 L 0.2677 -0.6164 L -0.4127 -0.7548 Z M -0.3373 -0.5443 L -0.6677 -0.0764 L -0.4473 -0.7348 Z M -0.6986 -0.0701 L -0.5226 -0.6451 L -0.6811 -0.2996 Z M -0.7319 -0.0278 L -0.7227 -0.1716 L -0.7816 -0.0337 Z M 0.2886 -0.6401 L -0.2974 -0.7751 L 0.0811 -0.7396 Z M 0.342 -0.6477 L 0.2127 -0.7117 L 0.3616 -0.6937 Z M -0.035 0.0606 L 0.2903 0.5371 L -0.6103 0.0171 Z M 0.274 0.5854 L -0.28 0.485 L -0.649 0.0641 Z M -0.3373 0.5443 L -0.6677 0.0764 L -0.4473 0.7348 Z M -0.3027 0.5643 L 0.2677 0.6164 L -0.4127 0.7548 Z M 0.2886 0.6401 L -0.2974 0.7751 L 0.0811 0.7396 Z M 0.3419 0.6477 L 0.2127 0.7117 L 0.3616 0.6937 Z M -0.6986 0.0701 L -0.5226 0.6451 L -0.6811 0.2996 Z M -0.7319 0.0277 L -0.7227 0.1717 L -0.7816 0.0337 ZM 0.07 0 L 0.32 -0.52 L 0.32 0.52 Z M 0.37 -0.53 L 0.56 0 L 0.38 0.53 Z M 0.64 0.02 L 0.4 0.54 L 0.86 0.02 Z M 0.64 -0.02 L 0.4 -0.54 L 0.86 -0.02 Z M 0.41 -0.57 L 0.82 -0.13 L 0.6 -0.44 Z M 0.39 -0.62 L 0.51 -0.54 L 0.42 -0.66 ZM 0.41 0.57 L 0.82 0.13 L 0.6 0.44 Z M 0.39 0.62 L 0.51 0.54 L 0.42 0.66 Z",
    BODY: {
        DAMAGE: 17.5 * 1.25,
        DENSITY: 25 * 1.65,
        HEALTH: 1200 * ThreeDHealthMutli * 1.75,
        RESIST: 7.5,
        PENETRATION: 22.5 * 1.425,
        ACCELERATION: 0.002
    },
    DRAW_HEALTH: true,
    GIVE_KILL_MESSAGE: true,
};
// IRREGULAR
Class.cnxRectangularPrism = {
    PARENT: ["threeDFood"],
    LABEL: "Rectangular Prism",
    VALUE: (4e7) * ThreeDValueMutli,
    SIZE: (6*2.5)*2,
    SHAPE: "M 0.2272 0.24 L -0.9772 -0.45 L -0.9772 0.1875 L 0.2272 0.885 Z M 0.4223 0.24 L 0.4223 0.885 L 0.9772 0.5625 L 0.9772 -0.075 Z M 0.3248 0.075 L 0.8798 -0.24 L -0.3248 -0.9375 L -0.8798 -0.615 Z",
    BODY: {
        DAMAGE: 24,
        DENSITY: 40,
        HEALTH: 1000 * ThreeDHealthMutli,
        PENETRATION: 35,
        ACCELERATION: 0.002
    },
    DRAW_HEALTH: true,
    INTANGIBLE: false,
    GIVE_KILL_MESSAGE: true,
};
Class.cnxSlab = {
    PARENT: ["threeDFood"],
    LABEL: "Slab",
    VALUE: (1e7) * ThreeDValueMutli,
    SIZE: 6*2.5,
    SHAPE: "M -0.3675 -0.2063 V 0.82 L 0.46 0.36 V -0.6806 L -0.3675 -0.2063 Z M -0.47 -0.2 V 0.82 L -0.8869 0.5159 V -0.4306 L -0.47 -0.2 Z M -0.42 -0.29 L 0.4 -0.78 L 0 -1 L -0.8254 -0.527 Z",
    BODY: {
        DAMAGE: 6,
        DENSITY: 10,
        HEALTH: 250 * ThreeDHealthMutli,
        PENETRATION: 8.75,
        ACCELERATION: 0.002
    },
    DRAW_HEALTH: true,
    INTANGIBLE: false,
    GIVE_KILL_MESSAGE: true,
};
// MISC
Class.cnxSphere = {
    PARENT: ["threeDFood"],
    LABEL: "Sphere",
    FACING_TYPE: "noFacing",
    VALUE: (1e7) * ThreeDValueMutli,
    SHAPE: 0,
    SIZE: 15,
    BODY: {
        DAMAGE: 10,
        DENSITY: 15,
        HEALTH: 300 * ThreeDHealthMutli,
        PENETRATION: 15,
        ACCELERATION: 0.002
    },
    DRAW_HEALTH: true,
    GIVE_KILL_MESSAGE: true,
    TURRETS: [{
        POSITION: [17, 0, 0, 0, 0, 1],
        TYPE: ["egg", { COLOR: { BASE: "white", BRIGHTNESS_SHIFT: 1 }, BORDERLESS: true }]
    }, {
        POSITION: [15, 1, -1, 0, 0, 1],
        TYPE: ["egg", { COLOR: { BASE: "white", BRIGHTNESS_SHIFT: 6 }, BORDERLESS: true }]
    }, {
        POSITION: [13, 2, -2, 0, 0, 1],
        TYPE: ["egg", { COLOR: { BASE: "white", BRIGHTNESS_SHIFT: 7 }, BORDERLESS: true }]
    }, {
        POSITION: [11, 3, -3, 0, 0, 1],
        TYPE: ["egg", { COLOR: { BASE: "white", BRIGHTNESS_SHIFT: 12 }, BORDERLESS: true }]
    }, {
        POSITION: [8, 3.25, -3.25, 0, 0, 1],
        TYPE: ["egg", { COLOR: { BASE: "white", BRIGHTNESS_SHIFT: 18 }, BORDERLESS: true }]
    }, {
        POSITION: [6, 3, -3, 0, 0, 1],
        TYPE: ["egg", { COLOR: { BASE: "white", BRIGHTNESS_SHIFT: 24 }, BORDERLESS: true }]
    }]
};
Class.cnxCylinderShine3 = {
    LABEL: "",
    MIRROR_MASTER_ANGLE: true,
    COLOR: { BASE: "white", BRIGHTNESS_SHIFT: 12 },
    BORDERLESS: true, 
//    SHAPE: 'M 0.695 -0.222 A 1 1 0 0 1 0.724 -0.33 L 0.876 -0.33 A 1 1 0 0 1 0.905 -0.222 Z M 0.523 -0.33 A 1 1 0 0 0 0.495 -0.222 L -0.705 -0.222 A 1 1 0 0 1 -0.676 -0.33 Z',
    SHAPE: 'M 0.523 -0.33 A 1 1 0 0 0 0.495 -0.222 L -0.705 -0.222 A 1 1 0 0 1 -0.676 -0.33 Z',
    INDEPENDENT: true,
};
Class.cnxCylinderShine2 = {
    LABEL: "",
    MIRROR_MASTER_ANGLE: true,
    COLOR: { BASE: "white", BRIGHTNESS_SHIFT: 7 },
    BORDERLESS: true, 
//    SHAPE: 'M 0.68 -0.13 A 1 1 0 0 1 0.75 -0.4 L 0.85 -0.4 A 1 1 0 0 1 0.92 -0.13 Z M 0.55 -0.4 A 1 1 0 0 0 0.48 -0.13 L -0.72 -0.13 A 1 1 0 0 1 -0.65 -0.4 Z',
    SHAPE: 'M 0.55 -0.4 A 1 1 0 0 0 0.48 -0.13 L -0.72 -0.13 A 1 1 0 0 1 -0.65 -0.4 Z',
    INDEPENDENT: true,
};
Class.cnxCylinderShine = {
    LABEL: "",
    MIRROR_MASTER_ANGLE: true,
    COLOR: { BASE: "white", BRIGHTNESS_SHIFT: 3 },
    BORDERLESS: true, 
//    SHAPE: 'M 0.67 0 A 1 1 0 0 1 0.8 -0.5 A 1 1 0 0 1 0.93 0 Z M 0.6 -0.5 A 1 1 0 0 0 0.47 0 L -0.73 0 A 1 1 0 0 1 -0.6 -0.5 Z',
    SHAPE: 'M 0.67 0 A 1 1 0 0 1 0.8 -0.5 A 1 1 0 0 1 0.93 0 Z M 0.6 -0.5 A 1 1 0 0 0 0.47 0 L -0.73 0 A 1 1 0 0 1 -0.6 -0.5 Z',
    INDEPENDENT: true,
};
Class.cnxCylinder = {
    PARENT: ["threeDFood"],
    LABEL: "Cylinder",
    VALUE: (2e7) * ThreeDValueMutli,
    SHAPE: 'M 0.8 -0.5 A 1 1 0 0 0 0.8 0.5 A 1 1 0 0 0 0.8 -0.5 Z M 0.6 -0.5 A 1 1 0 0 0 0.6 0.5 L -0.6 0.5 A 1 1 0 0 1 -0.6 -0.5 Z',
    SIZE: 15,
    BODY: {
        DAMAGE: 12.5,
        DENSITY: 17.5,
        HEALTH: 350 * ThreeDHealthMutli,
        PENETRATION: 20,
        ACCELERATION: 0.002
    },
    DRAW_HEALTH: true,
    GIVE_KILL_MESSAGE: true,
    TURRETS: [
        {
            POSITION: [20, 0, 0, 0, 360, 1],
            TYPE: "cnxCylinderShine",
        },
        {
            POSITION: [20, 0, 0, 0, 360, 1],
            TYPE: "cnxCylinderShine2",
        },
        {
            POSITION: [20, 0, 0, 0, 360, 1],
            TYPE: "cnxCylinderShine3",
        },
    ],
};
Class.cnxConeShine3 = {
    LABEL: "",
    MIRROR_MASTER_ANGLE: true,
    COLOR: { BASE: "white", BRIGHTNESS_SHIFT: 12 },
    BORDERLESS: true, 
    SHAPE: 'M 0.8 0 L -0.761 -0.279 A 1 1 0 0 1 -0.71 -0.413 Z',
    INDEPENDENT: true,
};
Class.cnxConeShine2 = {
    LABEL: "",
    MIRROR_MASTER_ANGLE: true,
    COLOR: { BASE: "white", BRIGHTNESS_SHIFT: 7 },
    BORDERLESS: true, 
    SHAPE: 'M 0.8 0 L -0.786 -0.168 A 1 1 0 0 1 -0.674 -0.485 Z',
    INDEPENDENT: true,
};
Class.cnxConeShine = {
    LABEL: "",
    MIRROR_MASTER_ANGLE: true,
    COLOR: { BASE: "white", BRIGHTNESS_SHIFT: 3 },
    BORDERLESS: true, 
    SHAPE: 'M 0.8 0 L -0.8 0 A 1 1 0 0 1 -0.6 -0.6 Z',
    INDEPENDENT: true,
};
Class.cnxCone = {
    PARENT: ["threeDFood"],
    LABEL: "Cone",
    VALUE: (1.5e7) * ThreeDValueMutli,
    SHAPE: 'M 0.8 0 L -0.6 0.6 A 1 1 0 0 1 -0.6 -0.6 Z',
    SIZE: 15,
    BODY: {
        DAMAGE: 20,
        DENSITY: 20,
        HEALTH: 400 * ThreeDHealthMutli,
        PENETRATION: 40,
        ACCELERATION: 0.002
    },
    DRAW_HEALTH: true,
    GIVE_KILL_MESSAGE: true,
    TURRETS: [
        {
            POSITION: [20, 0, 0, 0, 360, 1],
            TYPE: "cnxConeShine",
        },
        {
            POSITION: [20, 0, 0, 0, 360, 1],
            TYPE: "cnxConeShine2",
        },
        {
            POSITION: [20, 0, 0, 0, 360, 1],
            TYPE: "cnxConeShine3",
        },
    ],
};
// HOSOHEDRA
Class.cnxLune = {
    PARENT: ["threeDFood"],
    LABEL: "Lune",
    VALUE: (1e6) * ThreeDValueMutli,
    SHAPE: 'M 0 1 A 2 2 90 0 0 0 -1 A 2 2 90 0 0 0 1',
    SIZE: 10,
    BODY: {
        DAMAGE: 2,
        DENSITY: 5,
        HEALTH: 100 * ThreeDHealthMutli,
        PENETRATION: 5,
        ACCELERATION: 0.002
    },
    DRAW_HEALTH: true,
    GIVE_KILL_MESSAGE: true,
};
Class.cnxDigonalHosohedron = {
    PARENT: ["threeDFood"],
    LABEL: "Digonal Hosohedron",
    VALUE: (1e6)*2 * ThreeDValueMutli,
    SHAPE: 'M 0.15 1 A 1 1 0 0 0 0.15 -1 Z M -0.15 -1 A 1 1 180 0 0 -0.15 1 Z',
    SIZE: 15,
    BODY: {
        DAMAGE: 2*2,
        DENSITY: 5*(2*0.75),
        HEALTH: 100*(2*0.675) * ThreeDHealthMutli,
        PENETRATION: 5*(2*0.675),
        ACCELERATION: 0.002
    },
    DRAW_HEALTH: true,
    GIVE_KILL_MESSAGE: true,
};
// PYRAMIDS
Class.cnxSquarePyramid = {
    PARENT: ["threeDFood"],
    LABEL: "Square Pyramid",
    VALUE: (2.25e7) * ThreeDValueMutli,
    SIZE: 5*2.5,
    SHAPE: "M 0.05 -0.05 L 0.05 -0.95 L 0.95 -0.05 Z M -0.05 -0.05 L -0.95 -0.05 L -0.05 -0.95 Z M -0.05 0.05 L -0.05 0.95 L -0.95 0.05 Z M 0.05 0.05 L 0.95 0.05 L 0.05 0.95 Z",
    BODY: {
        DAMAGE: 12 * 1.25,
        DENSITY: 20 * 1.25,
        HEALTH: 500 * 1.25 * ThreeDHealthMutli,
        PENETRATION: 17.5 * 1.25,
        ACCELERATION: 0.002
    },
    DRAW_HEALTH: true,
    GIVE_KILL_MESSAGE: true
};
Class.cnxPentagonalPyramid = {
    PARENT: ["threeDFood"],
    LABEL: "Pentagonal Pyramid",
    VALUE: (2.5e7) * ThreeDValueMutli,
    SIZE: 6*2.5,
    SHAPE: "M 0.057 0.0186 L 0.8773 -0.2406 L 0.5682 0.7104 Z M 0.0353 -0.0485 L 0.0423 -0.9087 L 0.8512 -0.3209 Z M -0.0352 -0.0486 L -0.8512 -0.321 L -0.0422 -0.9087 Z M -0.0571 0.0185 L -0.5683 0.7104 L -0.8773 -0.2407 Z M 0 0.06 L 0.5 0.76 L -0.5 0.76 Z",
    BODY: {
        DAMAGE: 12 * 1.25 * 1.25,
        DENSITY: 20 * 1.25 * 1.25,
        HEALTH: 500 * 1.25 * 1.25 * ThreeDHealthMutli,
        PENETRATION: 17.5 * 1.25 * 1.25,
        ACCELERATION: 0.002
    },
    DRAW_HEALTH: true,
    GIVE_KILL_MESSAGE: true
};
Class.cnxHexagonalPyramid = {
    PARENT: ["threeDFood"],
    LABEL: "Hexagonal Pyramid",
    VALUE: (2.75e7) * ThreeDValueMutli,
    SIZE: 7*2.5,
    SHAPE: "M 0.03 0.052 L 0.8114 0.5146 L 0.04 0.96 Z M 0.06 -0 L 0.8514 -0.4454 L 0.8514 0.4454 Z M 0.03 -0.052 L 0.04 -0.96 L 0.8114 -0.5146 Z M -0.03 -0.052 L -0.8114 -0.5146 L -0.04 -0.96 Z M -0.06 0 L -0.8514 0.4454 L -0.8514 -0.4454 ZM -0.03 0.052 L -0.04 0.96 L -0.8114 0.5146 Z ",
    BODY: {
        DAMAGE: 12 * 1.25 * 1.25 * 1.25,
        DENSITY: 20 * 1.25 * 1.25 * 1.25,
        HEALTH: 500 * 1.25 * 1.25 * 1.25 * ThreeDHealthMutli,
        PENETRATION: 17.5 * 1.25 * 1.25 * 1.25,
        ACCELERATION: 0.002
    },
    DRAW_HEALTH: true,
    GIVE_KILL_MESSAGE: true
};
// Squares
Class.square = {
    PARENT: "food",
    LABEL: "Square",
    VALUE: 30,
    SHAPE: 4,
    SIZE: 14,
    COLOR: "gold",
    BODY: {
        DAMAGE: basePolygonDamage,
        DENSITY: 4,
        HEALTH: basePolygonHealth,
        PENETRATION: 2,
        ACCELERATION: 0.0075
    },
    DRAW_HEALTH: true,
    INTANGIBLE: false
}
makeRarities("square")

// Triangles
Class.triangle = {
    PARENT: "food",
    LABEL: "Triangle",
    VALUE: 120,
    SHAPE: 3,
    SIZE: 10,
    COLOR: "orange",
    BODY: {
        DAMAGE: basePolygonDamage,
        DENSITY: 6,
        HEALTH: 3 * basePolygonHealth,
        RESIST: 1.15,
        PENETRATION: 1.5,
        ACCELERATION: 0.005
    },
    DRAW_HEALTH: true
}
makeRarities("triangle")

// Pentagons
Class.pentagon = {
    PARENT: "food",
    LABEL: "Pentagon",
    VALUE: 400,
    SHAPE: 5,
    SIZE: 21,
    COLOR: "purple",
    BODY: {
        DAMAGE: 1.5 * basePolygonDamage,
        DENSITY: 8,
        HEALTH: 10 * basePolygonHealth,
        RESIST: 1.25,
        PENETRATION: 1.1,
        ACCELERATION: 0.0035
    },
    DRAW_HEALTH: true
}
Class.betaPentagon = {
    PARENT: "food",
    LABEL: "Beta Pentagon",
    VALUE: 2500,
    SHAPE: 5,
    SIZE: 30,
    COLOR: "purple",
    BODY: {
        DAMAGE: 2 * basePolygonDamage,
        DENSITY: 30,
        HEALTH: 75 * basePolygonHealth,
        RESIST: Math.pow(1.25, 2),
        PENETRATION: 1.1,
        SHIELD: 20 * basePolygonHealth,
        ACCELERATION: 0.003
    },
    DRAW_HEALTH: true,
    GIVE_KILL_MESSAGE: true
}
Class.alphaPentagon = {
    PARENT: "food",
    LABEL: "Alpha Pentagon",
    VALUE: 15e3,
    SHAPE: 5,
    SIZE: 58,
    COLOR: "purple",
    BODY: {
        DAMAGE: 2 * basePolygonDamage,
        DENSITY: 80,
        HEALTH: 562.5 * basePolygonHealth,
        RESIST: Math.pow(1.25, 3),
        PENETRATION: 1.1,
        SHIELD: 40 * basePolygonHealth,
        ACCELERATION: 0.0025
    },
    DRAW_HEALTH: true,
    GIVE_KILL_MESSAGE: true
}
makeRarities("pentagon")
makeRarities("betaPentagon")
makeRarities("alphaPentagon")

// Hexagons
Class.hexagon = {
    PARENT: "food",
    LABEL: "Hexagon",
    VALUE: 500,
    SHAPE: 6,
    SIZE: 25,
    COLOR: "hexagon",
    BODY: {
        DAMAGE: 3 * basePolygonDamage,
        DENSITY: 8,
        HEALTH: 20 * basePolygonHealth,
        RESIST: 1.3,
        SHIELD: 50 * basePolygonHealth,
        PENETRATION: 1.1,
        ACCELERATION: 0.003
    },
    DRAW_HEALTH: true
}
makeRarities("hexagon")

// Crashers
Class.crasher = {
    TYPE: "crasher",
    LABEL: "Crasher",
    COLOR: "pink",
    SHAPE: 3,
    SIZE: 5,
    VARIES_IN_SIZE: true,
    CONTROLLERS: ["nearestDifferentMaster", "mapTargetToGoal"],
    AI: {
        NO_LEAD: true,
    },
    BODY: {
        SPEED: 5,
        ACCELERATION: 1.4,
        HEALTH: 0.5,
        DAMAGE: 5,
        PENETRATION: 2,
        PUSHABILITY: 0.5,
        DENSITY: 10,
        RESIST: 2,
    },
    MOTION_TYPE: "motor",
    FACING_TYPE: "smoothWithMotion",
    HITS_OWN_TYPE: "hard",
    HAS_NO_MASTER: true,
    DRAW_HEALTH: true,
}

// Old Dreadnoughts Polygons
Class.hexagon_old = {
    PARENT: "food",
    LABEL: "Hexagon",
    VALUE: 21000,
    SHAPE: 6,
    SIZE: 70,
    COLOR: "magenta",
    BODY: {
        DAMAGE: 2 * basePolygonDamage,
        DENSITY: 80,
        HEALTH: 600 * basePolygonHealth,
        RESIST: Math.pow(1.25, 3),
        PENETRATION: 1.1,
        SHIELD: 40 * basePolygonHealth,
        ACCELERATION: 0.0025
    },
    DRAW_HEALTH: true,
    GIVE_KILL_MESSAGE: true
}
Class.septagon = {
    PARENT: "food",
    LABEL: "Septagon",
    VALUE: 28000,
    SHAPE: 7,
    SIZE: 80,
    COLOR: "green",
    BODY: {
        DAMAGE: 2 * basePolygonDamage,
        DENSITY: 80,
        HEALTH: 750 * basePolygonHealth,
        RESIST: Math.pow(1.25, 3),
        PENETRATION: 1.1,
        SHIELD: 50 * basePolygonHealth,
        ACCELERATION: 0.0025
    },
    DRAW_HEALTH: true,
    GIVE_KILL_MESSAGE: true
}
Class.octagon = {
    PARENT: "food",
    LABEL: "Octagon",
    VALUE: 35000,
    SHAPE: 8,
    SIZE: 90,
    COLOR: "lavender",
    BODY: {
        DAMAGE: 2 * basePolygonDamage,
        DENSITY: 80,
        HEALTH: 900 * basePolygonHealth,
        RESIST: Math.pow(1.25, 3),
        PENETRATION: 1.1,
        SHIELD: 60 * basePolygonHealth,
        ACCELERATION: 0.0025
    },
    DRAW_HEALTH: true,
    GIVE_KILL_MESSAGE: true
}
Class.nonagon = {
    PARENT: "food",
    LABEL: "Nonagon",
    VALUE: 42000,
    SHAPE: 9,
    SIZE: 100,
    COLOR: "white",
    BODY: {
        DAMAGE: 2 * basePolygonDamage,
        DENSITY: 80,
        HEALTH: 1050 * basePolygonHealth,
        RESIST: Math.pow(1.25, 3),
        PENETRATION: 1.1,
        SHIELD: 70 * basePolygonHealth,
        ACCELERATION: 0.0025
    },
    DRAW_HEALTH: true,
    GIVE_KILL_MESSAGE: true,
}
makeRarities("hexagon_old")
makeRarities("septagon")
makeRarities("octagon")
makeRarities("nonagon")

// 3D
if (!classic_3D_shapes) {
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
    confusing_shape = makePolyhedron({
        VERTEXES: [
            [2, 3, 5],
            [-5, 4, 4],
            [-6, -4, 5],
            [2, -6, 9],
            [6, 5, -4],
            [-6, 7, -8],
            [-3, -7, -5],
            [3, -2, -3]
        ],
        FACES: [
            [3, 4, 5, 2],
            [6, 2, 3, 4],
            [4, 1, 5, 6],
            [1, 6, 5, 4],
            [1, 2, 4, 6],
            [1, 2, 5, 4]
        ],
        SCALE: 8.9,
        VERTEXES_SCALE: 0.5
    })
star_shape = makePolyhedron({
    VERTEXES: [
        [0, 0, 1.2],
        [0, 0, -1.2],
        [2, 0, 0],
        [0.728, 0.529, 0],
        [0.618, 1.902, 0],
        [-0.278, 0.856, 0],
        [-1.618, 1.176, 0],
        [-0.9, 0, 0],
        [-1.618, -1.176, 0],
        [-0.278, -0.856, 0],
        [0.618, -1.902, 0],
        [0.728, -0.529, 0]
    ],
    FACES: [
        [2, 3, 0],
        [3, 4, 0],
        [4, 5, 0],
        [5, 6, 0],
        [6, 7, 0],
        [7, 8, 0],
        [8, 9, 0],
        [9, 10, 0],
        [10, 11, 0],
        [11, 2, 0],
        [3, 2, 1],
        [4, 3, 1],
        [5, 4, 1],
        [6, 5, 1],
        [7, 6, 1],
        [8, 7, 1],
        [9, 8, 1],
        [10, 9, 1],
        [11, 10, 1],
        [2, 11, 1]
    ],
    SCALE: 7.5,
    VERTEXES_SCALE: 0.1
});
cone_shape = makePolyhedron({
    VERTEXES: [
        [0, 0, 2.5], // Index 0: The Top Point (Apex)

        // Indexes 1 to 60: The 60 points making up the perfectly smooth circular base
        [1.500, 0.000, -1.5], [1.492, 0.157, -1.5], [1.468, 0.312, -1.5], [1.427, 0.464, -1.5], [1.370, 0.609, -1.5], [1.299, 0.750, -1.5],
        [1.214, 0.882, -1.5], [1.115, 1.004, -1.5], [1.004, 1.115, -1.5], [0.882, 1.214, -1.5], [0.750, 1.299, -1.5], [0.609, 1.370, -1.5],
        [0.464, 1.427, -1.5], [0.312, 1.468, -1.5], [0.157, 1.492, -1.5], [0.000, 1.500, -1.5], [-0.157, 1.492, -1.5], [-0.312, 1.468, -1.5],
        [-0.464, 1.427, -1.5], [-0.609, 1.370, -1.5], [-0.750, 1.299, -1.5], [-0.882, 1.214, -1.5], [-1.004, 1.115, -1.5], [-1.115, 1.004, -1.5],
        [-1.214, 0.882, -1.5], [-1.299, 0.750, -1.5], [-1.370, 0.609, -1.5], [-1.427, 0.464, -1.5], [-1.468, 0.312, -1.5], [-1.492, 0.157, -1.5],
        [-1.500, 0.000, -1.5], [-1.492, -0.157, -1.5], [-1.468, -0.312, -1.5], [-1.427, -0.464, -1.5], [-1.370, -0.609, -1.5], [-1.299, -0.750, -1.5],
        [-1.214, -0.882, -1.5], [-1.115, -1.004, -1.5], [-1.004, -1.115, -1.5], [-0.882, -1.214, -1.5], [-0.750, -1.299, -1.5], [-0.609, -1.370, -1.5],
        [-0.464, -1.427, -1.5], [-0.312, -1.468, -1.5], [-0.157, -1.492, -1.5], [-0.000, -1.500, -1.5], [0.157, -1.492, -1.5], [0.312, -1.468, -1.5],
        [0.464, -1.427, -1.5], [0.609, -1.370, -1.5], [0.750, -1.299, -1.5], [0.882, -1.214, -1.5], [1.004, -1.115, -1.5], [1.115, -1.004, -1.5],
        [1.214, -0.882, -1.5], [1.299, -0.750, -1.5], [1.370, -0.609, -1.5], [1.427, -0.464, -1.5], [1.468, -0.312, -1.5], [1.492, -0.157, -1.5]
    ],
    FACES: [
        // The solid, flat bottom base (60 points mapped in reverse order)
        [60, 59, 58, 57, 56, 55, 54, 53, 52, 51, 50, 49, 48, 47, 46, 45, 44, 43, 42, 41, 40, 39, 38, 37, 36, 35, 34, 33, 32, 31, 30, 29, 28, 27, 26, 25, 24, 23, 22, 21, 20, 19, 18, 17, 16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1],
        
        // The 60 ultra-smooth side panels connecting the base to the single top point (0)
        [1, 2, 0], [2, 3, 0], [3, 4, 0], [4, 5, 0], [5, 6, 0], [6, 7, 0], [7, 8, 0], [8, 9, 0], [9, 10, 0], [10, 11, 0],
        [11, 12, 0], [12, 13, 0], [13, 14, 0], [14, 15, 0], [15, 16, 0], [16, 17, 0], [17, 18, 0], [18, 19, 0], [19, 20, 0], [20, 21, 0],
        [21, 22, 0], [22, 23, 0], [23, 24, 0], [24, 25, 0], [25, 26, 0], [26, 27, 0], [27, 28, 0], [28, 29, 0], [29, 30, 0], [30, 31, 0],
        [31, 32, 0], [32, 33, 0], [33, 34, 0], [34, 35, 0], [35, 36, 0], [36, 37, 0], [37, 38, 0], [38, 39, 0], [39, 40, 0], [40, 41, 0],
        [41, 42, 0], [42, 43, 0], [43, 44, 0], [44, 45, 0], [45, 46, 0], [46, 47, 0], [47, 48, 0], [48, 49, 0], [49, 50, 0], [50, 51, 0],
        [51, 52, 0], [52, 53, 0], [53, 54, 0], [54, 55, 0], [55, 56, 0], [56, 57, 0], [57, 58, 0], [58, 59, 0], [59, 60, 0], [60, 1, 0]
    ],
    SCALE: 7.5,
    VERTEXES_SCALE: 0.1
});
inkling_head_shape = makePolyhedron({
    VERTEXES: [
        // Core Head Box
        [ 1.5,  2.0,  3.0], [-1.5,  2.0,  3.0], [-1.5, -2.0,  3.0], [ 1.5, -2.0,  3.0], // Top
        [ 1.5,  2.0,  0.0], [-1.5,  2.0,  0.0], [-1.5, -2.0,  0.0], [ 1.5, -2.0,  0.0], // Base
        // Left Tentacle (Hanging down front-left)
        [ 2.5,  2.5, -4.0], // Tip
        [ 2.5,  1.5, -4.0], [ 1.5,  2.5, -4.0], // Thickness
        // Right Tentacle (Hanging down front-right)
        [ 2.5, -2.5, -4.0], // Tip
        [ 2.5, -1.5, -4.0], [ 1.5, -2.5, -4.0]  // Thickness
    ],
    FACES: [
        // Head Base
        [0, 1, 2, 3], [4, 5, 6, 7],
        [0, 1, 5, 4], [1, 2, 6, 5], [2, 3, 7, 6], [3, 0, 4, 7],
        // Left Tentacle Pyramids
        [8, 0, 4], [8, 4, 1], [8, 1, 0],
        [9, 0, 4], [10, 4, 1], // Volume
        // Right Tentacle Pyramids
        [11, 3, 7], [11, 7, 2], [11, 2, 3],
        [12, 3, 7], [13, 7, 2] // Volume
    ],
    SCALE: 10,
    VERTEXES_SCALE: 0.1
});
inkling_tank_shape = makePolyhedron({
    VERTEXES: [
        [ 1.0,  1.0,  3.0], [-1.0,  1.0,  3.0], [-1.0, -1.0,  3.0], [ 1.0, -1.0,  3.0], // Top
        [ 1.0,  1.0, -2.0], [-1.0,  1.0, -2.0], [-1.0, -1.0, -2.0], [ 1.0, -1.0, -2.0]  // Bottom
    ],
    FACES: [
        [0, 1, 2, 3], [4, 5, 6, 7],
        [0, 1, 5, 4], [1, 2, 6, 5], [2, 3, 7, 6], [3, 0, 4, 7]
    ],
    SCALE: 8,
    VERTEXES_SCALE: 0.1
});

Class.inkling_tank = {
    SHAPE: inkling_tank_shape,
    COLOR: "#00FFFF", // Cyan Ink
    INDEPENDENT: true 
};
inkling_body_shape = makePolyhedron({
    VERTEXES: [
        [ 1.0,  1.5,  1.5], [-1.0,  1.5,  1.5], [-1.0, -1.5,  1.5], [ 1.0, -1.5,  1.5], // Shoulders
        [ 1.0,  1.5, -1.5], [-1.0,  1.5, -1.5], [-1.0, -1.5, -1.5], [ 1.0, -1.5, -1.5]  // Hips
    ],
    FACES: [
        [0, 1, 2, 3], [4, 5, 6, 7],
        [0, 1, 5, 4], [1, 2, 6, 5], [2, 3, 7, 6], [3, 0, 4, 7]
    ],
    SCALE: 10,
    VERTEXES_SCALE: 0.1
});
heart_shape = makePolyhedron({
    VERTEXES: [
        // --- Front Face (Z = 0.5) ---
        [0.0, -2.0, 0.5],   // 0: Bottom tip
        [-1.5, -0.8, 0.5],  // 1: Lower left
        [-2.0, 0.6, 0.5],   // 2: Outer left
        [-1.0, 1.6, 0.5],   // 3: Top left peak
        [0.0, 0.6, 0.5],    // 4: Center dip
        [1.0, 1.6, 0.5],    // 5: Top right peak
        [2.0, 0.6, 0.5],    // 6: Outer right
        [1.5, -0.8, 0.5],   // 7: Lower right

        // --- Back Face (Z = -0.5) ---
        [0.0, -2.0, -0.5],  // 8: Bottom tip
        [-1.5, -0.8, -0.5], // 9: Lower left
        [-2.0, 0.6, -0.5],  // 10: Outer left
        [-1.0, 1.6, -0.5],  // 11: Top left peak
        [0.0, 0.6, -0.5],   // 12: Center dip
        [1.0, 1.6, -0.5],   // 13: Top right peak
        [2.0, 0.6, -0.5],   // 14: Outer right
        [1.5, -0.8, -0.5]   // 15: Lower right
    ],
    FACES: [
        // --- Front Faces (Split into left and right halves for stability) ---
        [0, 1, 2, 3, 4],    // Front left half
        [0, 4, 5, 6, 7],    // Front right half

        // --- Back Faces (Reversed order to face outward properly) ---
        [8, 12, 11, 10, 9], // Back left half
        [8, 15, 14, 13, 12],// Back right half

        // --- Side Panels (Wrapping all the way around the outside) ---
        [0, 1, 9, 8],       // Bottom left edge
        [1, 2, 10, 9],      // Mid left edge
        [2, 3, 11, 10],     // Top left outer edge
        [3, 4, 12, 11],     // Top left inner dip
        [4, 5, 13, 12],     // Top right inner dip
        [5, 6, 14, 13],     // Top right outer edge
        [6, 7, 15, 14],     // Mid right edge
        [7, 0, 8, 15]       // Bottom right edge
    ],
    SCALE: 7.5,
    VERTEXES_SCALE: 0.1
});
cat_shape = makePolyhedron({
    VERTEXES: [
        // --- 1. BODY (Indexes 0 to 7) ---
        [-1.6, -1.0, -0.6], [1.0, -1.0, -0.6], [1.0, 1.0, -0.6], [-1.6, 1.0, -0.6], // Bottom
        [-1.6, -1.0, 0.6], [1.0, -1.0, 0.6], [1.0, 1.0, 0.6], [-1.6, 1.0, 0.6],     // Top

        // --- 2. HEAD (Indexes 8 to 15) ---
        [0.0, -0.8, 0.6], [1.1, -0.8, 0.6], [1.1, 0.8, 0.6], [0.0, 0.8, 0.6],       // Bottom
        [0.0, -0.8, 1.7], [1.1, -0.8, 1.7], [1.1, 0.8, 1.7], [0.0, 0.8, 1.7],       // Top

        // --- 3. LEFT EAR (Indexes 16 to 23) ---
        [0.0, 0.3, 1.7], [0.4, 0.3, 1.7], [0.4, 0.7, 1.7], [0.0, 0.7, 1.7],         // Bottom
        [0.0, 0.3, 2.1], [0.4, 0.3, 2.1], [0.4, 0.7, 2.1], [0.0, 0.7, 2.1],         // Top

        // --- 4. RIGHT EAR (Indexes 24 to 31) ---
        [0.0, -0.7, 1.7], [0.4, -0.7, 1.7], [0.4, -0.3, 1.7], [0.0, -0.3, 1.7],     // Bottom
        [0.0, -0.7, 2.1], [0.4, -0.7, 2.1], [0.4, -0.3, 2.1], [0.0, -0.3, 2.1],     // Top

        // --- 5. FRONT LEFT LEG (Indexes 32 to 39) ---
        [0.4, 0.5, -1.4], [0.9, 0.5, -1.4], [0.9, 0.9, -1.4], [0.4, 0.9, -1.4],     // Bottom
        [0.4, 0.5, -0.6], [0.9, 0.5, -0.6], [0.9, 0.9, -0.6], [0.4, 0.9, -0.6],     // Top

        // --- 6. FRONT RIGHT LEG (Indexes 40 to 47) ---
        [0.4, -0.9, -1.4], [0.9, -0.9, -1.4], [0.9, -0.5, -1.4], [0.4, -0.5, -1.4], // Bottom
        [0.4, -0.9, -0.6], [0.9, -0.9, -0.6], [0.9, -0.5, -0.6], [0.4, -0.5, -0.6], // Top

        // --- 7. BACK LEFT LEG (Indexes 48 to 55) ---
        [-1.5, 0.5, -1.4], [-1.0, 0.5, -1.4], [-1.0, 0.9, -1.4], [-1.5, 0.9, -1.4], // Bottom
        [-1.5, 0.5, -0.6], [-1.0, 0.5, -0.6], [-1.0, 0.9, -0.6], [-1.5, 0.9, -0.6], // Top

        // --- 8. BACK RIGHT LEG (Indexes 56 to 63) ---
        [-1.5, -0.9, -1.4], [-1.0, -0.9, -1.4], [-1.0, -0.5, -1.4], [-1.5, -0.5, -1.4], // Bottom
        [-1.5, -0.9, -0.6], [-1.0, -0.9, -0.6], [-1.0, -0.5, -0.6], [-1.5, -0.5, -0.6], // Top

        // --- 9. TAIL (Indexes 64 to 71) Sticking up! ---
        [-1.9, -0.2, 0.2], [-1.5, -0.2, 0.2], [-1.5, 0.2, 0.2], [-1.9, 0.2, 0.2],   // Base
        [-1.9, -0.2, 1.4], [-1.5, -0.2, 1.4], [-1.5, 0.2, 1.4], [-1.9, 0.2, 1.4]    // Tip
    ],
    FACES: [
        // Body
        [3, 2, 1, 0], [4, 5, 6, 7], [0, 1, 5, 4], [2, 3, 7, 6], [1, 2, 6, 5], [3, 0, 4, 7],
        // Head
        [15, 14, 13, 12], [8, 9, 13, 12], [10, 11, 15, 14], [9, 10, 14, 13], [11, 8, 12, 15],
        // Left Ear
        [19, 18, 17, 16], [23, 22, 21, 20], [16, 17, 21, 20], [18, 19, 23, 22], [17, 18, 22, 21], [19, 16, 20, 23],
        // Right Ear
        [27, 26, 25, 24], [31, 30, 29, 28], [24, 25, 29, 28], [26, 27, 31, 30], [25, 26, 30, 29], [27, 24, 28, 31],
        // Front Left Leg
        [35, 34, 33, 32], [36, 37, 38, 39], [32, 33, 37, 36], [34, 35, 39, 38], [33, 34, 38, 37], [35, 32, 36, 39],
        // Front Right Leg
        [43, 42, 41, 40], [44, 45, 46, 47], [40, 41, 45, 44], [42, 43, 47, 46], [41, 42, 46, 45], [43, 40, 44, 47],
        // Back Left Leg
        [51, 50, 49, 48], [52, 53, 54, 55], [48, 49, 53, 52], [50, 51, 55, 54], [49, 50, 54, 53], [51, 48, 52, 55],
        // Back Right Leg
        [59, 58, 57, 56], [60, 61, 62, 63], [56, 57, 61, 60], [58, 59, 63, 62], [57, 58, 62, 61], [59, 56, 60, 63],
        // Tail
        [67, 66, 65, 64], [68, 69, 70, 71], [64, 65, 69, 68], [66, 67, 71, 70], [65, 66, 70, 69], [67, 64, 68, 71]
    ],
    SCALE: 7.5,
    VERTEXES_SCALE: 0.1
});
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
    wedge_shape = (function() {
        const vertices = [
            [1, -1, 1],    // 0: Front Bottom Right
            [-1, -1, 1],   // 1: Front Bottom Left
            [0, 1, 1],     // 2: Front Top Point
            [1, -1, -1],   // 3: Back Bottom Right
            [-1, -1, -1],  // 4: Back Bottom Left
            [0, 1, -1]     // 5: Back Top Point
        ];
        
        const faceIndices = [
            [0, 1, 2],     // Front triangle
            [3, 4, 5],     // Back triangle
            [0, 1, 4, 3],  // Bottom flat face
            [1, 2, 5, 4],  // Left slanted face
            [2, 0, 3, 5]   // Right slanted face
        ];

        const formattedFaces = faceIndices.map(face => face.map(i => vertices[i]));

        return makePolyhedron({
            FACES: formattedFaces,
            SCALE: 7.5,
            VERTEXES_SCALE: 0.1
        });
    })();
octahedron3_shape = makePolyhedron({
    VERTEXES: [
        [ 0.0,  0.0,  2.0], // 0: Top point
        [ 0.0,  0.0, -2.0], // 1: Bottom point
        [ 2.0,  0.0,  0.0], // 2: Right point
        [-2.0,  0.0,  0.0], // 3: Left point
        [ 0.0,  2.0,  0.0], // 4: Front point
        [ 0.0, -2.0,  0.0]  // 5: Back point
    ],
    FACES: [
        // Top pyramid halves
        [0, 4, 2], [0, 3, 4], [0, 5, 3], [0, 2, 5],
        // Bottom pyramid halves
        [1, 2, 4], [1, 4, 3], [1, 3, 5], [1, 5, 2]
    ],
    SCALE: 10,
    VERTEXES_SCALE: 0.1
});
    pyramid_shape = (function() {
        const vertices = [
            [1.5, 1.5, -1],    // 0: Base corner 1
            [-1.5, 1.5, -1],   // 1: Base corner 2
            [-1.5, -1.5, -1],  // 2: Base corner 3
            [1.5, -1.5, -1],   // 3: Base corner 4
            [0, 0, 1.5]        // 4: Apex (top point)
        ];
        
        const faceIndices = [
            [0, 1, 2, 3],  // Flat square base (Quad)
            [0, 1, 4],     // Side 1 (Triangle)
            [1, 2, 4],     // Side 2 (Triangle)
            [2, 3, 4],     // Side 3 (Triangle)
            [3, 0, 4]      // Side 4 (Triangle)
        ];

        const formattedFaces = faceIndices.map(face => face.map(i => vertices[i]));

        return makePolyhedron({
            FACES: formattedFaces,
            SCALE: 7.5,
            VERTEXES_SCALE: 0.1
        });
    })();
world_ender_shape = makePolyhedron({
    VERTEXES: [
        // --- THE PENTA-STAR HYPER SPIKES ---
        [0.0, 0.0, 4.5],      // 0: Top Apex Spike (Massive)
        [0.0, 0.0, -4.5],     // 1: Bottom Apex Spike (Massive)
        
        // Equator Points (Alternating Spikes and Valleys around the center)
        [4.5, 0.0, 0.0],      // 2: Spike 1
        [0.607, 0.441, 0.0],  // 3: Valley 1
        [1.391, 4.279, 0.0],  // 4: Spike 2
        [-0.232, 0.713, 0.0], // 5: Valley 2
        [-3.640, 2.645, 0.0], // 6: Spike 3
        [-0.750, 0.0, 0.0],   // 7: Valley 3
        [-3.640, -2.645, 0.0],// 8: Spike 4
        [-0.232, -0.713, 0.0],// 9: Valley 4
        [1.391, -4.279, 0.0], // 10: Spike 5
        [0.607, -0.441, 0.0], // 11: Valley 5

        // --- THE TESSERACT CUBE CORE (Intersecting the star) ---
        [1.2, 1.2, 1.2],      // 12: Top Front Right
        [-1.2, 1.2, 1.2],     // 13: Top Front Left
        [-1.2, -1.2, 1.2],    // 14: Top Back Left
        [1.2, -1.2, 1.2],     // 15: Top Back Right
        [1.2, 1.2, -1.2],     // 16: Bottom Front Right
        [-1.2, 1.2, -1.2],    // 17: Bottom Front Left
        [-1.2, -1.2, -1.2],   // 18: Bottom Back Left
        [1.2, -1.2, -1.2]     // 19: Bottom Back Right
    ],
    FACES: [
        // --- Penta-Star Top Halves ---
        [2, 3, 0], [3, 4, 0], [4, 5, 0], [5, 6, 0], [6, 7, 0], 
        [7, 8, 0], [8, 9, 0], [9, 10, 0], [10, 11, 0], [11, 2, 0],

        // --- Penta-Star Bottom Halves (Reversed winding to face out) ---
        [3, 2, 1], [4, 3, 1], [5, 4, 1], [6, 5, 1], [7, 6, 1], 
        [8, 7, 1], [9, 8, 1], [10, 9, 1], [11, 10, 1], [2, 11, 1],

        // --- Tesseract Cube Core Faces ---
        [12, 13, 14, 15],     // Cube Top
        [19, 18, 17, 16],     // Cube Bottom
        [12, 13, 17, 16],     // Cube Front
        [14, 15, 19, 18],     // Cube Back
        [15, 12, 16, 19],     // Cube Right
        [13, 14, 18, 17]      // Cube Left
    ],
    SCALE: 10, // Base scale is huge
    VERTEXES_SCALE: 0.1
});
    octahedron2_shape = (function() {
        const vertices = [
            [0, 0, 1.5],   // 0: Top point
            [0, 0, -1.5],  // 1: Bottom point
            [1.5, 0, 0],   // 2: Right
            [0, 1.5, 0],   // 3: Front
            [-1.5, 0, 0],  // 4: Left
            [0, -1.5, 0]   // 5: Back
        ];
        
        const faceIndices = [
            // Top pyramid half
            [0, 2, 3], [0, 3, 4], [0, 4, 5], [0, 5, 2],
            // Bottom pyramid half
            [1, 3, 2], [1, 4, 3], [1, 5, 4], [1, 2, 5]
        ];

        const formattedFaces = faceIndices.map(face => face.map(i => vertices[i]));

        return makePolyhedron({
            FACES: formattedFaces,
            SCALE: 7.5,
            VERTEXES_SCALE: 0.1
        });
    })();
    geodesic_sphere_shape = (function() {
        const vertices = [
            [-0.79, 1.28, 0],   // 0: Top-ish Left
            [0.79, 1.28, 0],    // 1: Top-ish Right
            [-0.79, -1.28, 0],  // 2: Bottom-ish Left
            [0.79, -1.28, 0],   // 3: Bottom-ish Right
            [0, -0.79, 1.28],   // 4: Front Bottom
            [0, 0.79, 1.28],    // 5: Front Top
            [0, -0.79, -1.28],  // 6: Back Bottom
            [0, 0.79, -1.28],   // 7: Back Top
            [1.28, 0, -0.79],   // 8: Right Back
            [1.28, 0, 0.79],    // 9: Right Front
            [-1.28, 0, -0.79],  // 10: Left Back
            [-1.28, 0, 0.79]    // 11: Left Front
        ];

        const faceIndices = [
            // Top cluster
            [0, 11, 5], 
            [0, 5, 1], 
            [0, 1, 7], 
            [0, 7, 10], 
            [0, 10, 11],

            // Middle zig-zag band
            [1, 5, 9], 
            [5, 11, 4], 
            [11, 10, 2], 
            [10, 7, 6], 
            [7, 1, 8],
            [4, 9, 5], 
            [2, 4, 11], 
            [6, 2, 10], 
            [8, 6, 7], 
            [9, 8, 1],

            // Bottom cluster
            [3, 9, 4], 
            [3, 4, 2], 
            [3, 2, 6], 
            [3, 6, 8], 
            [3, 8, 9]
        ];

        // Maps the index numbers to the actual literal [x, y, z] coordinates
        const formattedFaces = faceIndices.map(face => face.map(i => vertices[i]));

        // Return the final shape object for the engine
        return makePolyhedron({
            FACES: formattedFaces,
            SCALE: 7.5,
            VERTEXES_SCALE: 0.1
        });
    })();
    pentatope_shape = makePolychoron({
        VERTEXES: [
            // To make a perfectly regular 4D pentatope, we use specific Cartesian coordinates.
            // The 4th dimension (W-axis) uses approximations of -1/√5 and 4/√5 to keep it perfectly symmetrical.
            [ 1,  1,  1, -0.447 ],  // 0
            [ 1, -1, -1, -0.447 ],  // 1
            [-1,  1, -1, -0.447 ],  // 2
            [-1, -1,  1, -0.447 ],  // 3
            [ 0,  0,  0,  1.789 ]   // 4: The 4D "Apex"
        ],
        FACES: [
            // A pentatope is made of 10 intersecting triangular faces.
            // Every possible combination of 3 vertices forms a face.
            [0, 1, 2], 
            [0, 1, 3], 
            [0, 1, 4],
            [0, 2, 3], 
            [0, 2, 4],
            [0, 3, 4],
            [1, 2, 3], 
            [1, 2, 4],
            [1, 3, 4],
            [2, 3, 4]
        ],
        VERTEXES_SCALE: 0.1,
        SCALE: 6
    })
    grand_antiprism_shape = (function() {
        const PHI = (1 + Math.sqrt(5)) / 2;
        const vertices = [];
        
        // 1. Generate the 120 vertices of the regular 600-Cell
        
        // -> 16 Tesseract vertices
        for (let i = 0; i < 16; i++) {
            vertices.push([
                (i & 1) ? 1 : -1,
                (i & 2) ? 1 : -1,
                (i & 4) ? 1 : -1,
                (i & 8) ? 1 : -1
            ]);
        }
        
        // -> 8 16-Cell (Hyper-Octahedron) vertices
        for (let i = 0; i < 4; i++) {
            for (let sign of [2, -2]) {
                let v = [0, 0, 0, 0];
                v[i] = sign;
                vertices.push(v);
            }
        }
        
        // -> 96 Snub 24-Cell vertices
        const evenPerms = [
            [0, 1, 2, 3], [0, 2, 3, 1], [0, 3, 1, 2],
            [1, 0, 3, 2], [1, 2, 0, 3], [1, 3, 2, 0],
            [2, 0, 1, 3], [2, 1, 3, 0], [2, 3, 0, 1],
            [3, 0, 2, 1], [3, 1, 0, 2], [3, 2, 1, 0]
        ];
        for (let perm of evenPerms) {
            for (let s = 0; s < 8; s++) {
                let base = [
                    (s & 1) ? PHI : -PHI,
                    (s & 2) ? 1 : -1,
                    (s & 4) ? PHI - 1 : -(PHI - 1),
                    0
                ];
                vertices.push([ base[perm[0]], base[perm[1]], base[perm[2]], base[perm[3]] ]);
            }
        }

        // 2. Subtract the 20 vertices (two orthogonal 10-vertex rings) to carve out the Grand Antiprism
        const removeRing1 = [
            [2, 0, 0, 0], [-2, 0, 0, 0],
            [PHI, 0, 1, PHI-1], [-PHI, 0, 1, PHI-1], [PHI, 0, -1, 1-PHI], [-PHI, 0, -1, 1-PHI],
            [PHI-1, 0, -PHI, 1], [1-PHI, 0, -PHI, 1], [PHI-1, 0, PHI, -1], [1-PHI, 0, PHI, -1]
        ];
        
        const removeRing2 = [
            [0, 2, 0, 0], [0, -2, 0, 0],
            [0, PHI, PHI-1, -1], [0, -PHI, PHI-1, -1], [0, PHI, 1-PHI, 1], [0, -PHI, 1-PHI, 1],
            [0, PHI-1, 1, PHI], [0, 1-PHI, 1, PHI], [0, PHI-1, -1, -PHI], [0, 1-PHI, -1, -PHI]
        ];
        
        const isSame = (v1, v2) => {
            return Math.abs(v1[0]-v2[0]) < 0.001 && Math.abs(v1[1]-v2[1]) < 0.001 && 
                   Math.abs(v1[2]-v2[2]) < 0.001 && Math.abs(v1[3]-v2[3]) < 0.001;
        };

        const finalVertices = [];
        for (let v of vertices) {
            let keep = true;
            for (let r of removeRing1) if (isSame(v, r)) keep = false;
            for (let r of removeRing2) if (isSame(v, r)) keep = false;
            
            if (keep) {
                let isDup = false;
                for (let fv of finalVertices) if (isSame(v, fv)) isDup = true;
                if (!isDup) finalVertices.push(v);
            }
        }

        // 3. Dynamically find and map the 700 equilateral triangular faces
        const faces = [];
        const E2 = 8 - 4 * PHI; // The squared edge-length of the 600-cell geometry (~1.52786)
        
        const distSq = (v1, v2) => {
            let dx = v1[0]-v2[0], dy = v1[1]-v2[1], dz = v1[2]-v2[2], dw = v1[3]-v2[3];
            return dx*dx + dy*dy + dz*dz + dw*dw;
        };

        for (let i = 0; i < finalVertices.length; i++) {
            for (let j = i + 1; j < finalVertices.length; j++) {
                if (Math.abs(distSq(finalVertices[i], finalVertices[j]) - E2) < 0.01) {
                    for (let k = j + 1; k < finalVertices.length; k++) {
                        if (Math.abs(distSq(finalVertices[i], finalVertices[k]) - E2) < 0.01 &&
                            Math.abs(distSq(finalVertices[j], finalVertices[k]) - E2) < 0.01) {
                            faces.push([i, j, k]);
                        }
                    }
                }
            }
        }

        // Returns the formatted array object perfectly tailored for your engine.
        return makePolychoron({
            VERTEXES: finalVertices,
            FACES: faces,
            VERTEXES_SCALE: 0.1,
            SCALE: 6
        });
    })();
smile_shape = makePolyhedron({
    VERTEXES: [
        // --- Front Face of the Smile (Z = +0.5) ---
        [-3.0,  0.0, 0.5],  // 0: Top Left Corner
        [-2.1, -2.1, 0.5],  // 1: Bottom Left Curve
        [ 0.0, -3.0, 0.5],  // 2: Bottom Center Point
        [ 2.1, -2.1, 0.5],  // 3: Bottom Right Curve
        [ 3.0,  0.0, 0.5],  // 4: Top Right Corner

        // --- Back Face of the Smile (Z = -0.5) ---
        [-3.0,  0.0, -0.5], // 5: Top Left Corner
        [-2.1, -2.1, -0.5], // 6: Bottom Left Curve
        [ 0.0, -3.0, -0.5], // 7: Bottom Center Point
        [ 2.1, -2.1, -0.5], // 8: Bottom Right Curve
        [ 3.0,  0.0, -0.5]  // 9: Top Right Corner
    ],
    FACES: [
        // --- Front and Back ---
        [0, 1, 2, 3, 4],    // Front Face (Convex half-circle)
        [9, 8, 7, 6, 5],    // Back Face (Reversed so it points outward)

        // --- The Flat Top Edge (The cut part of the half-circle) ---
        [0, 4, 9, 5],       

        // --- The Curved Bottom Edges ---
        [1, 0, 5, 6],       // Outer Left edge
        [2, 1, 6, 7],       // Bottom Left edge
        [3, 2, 7, 8],       // Bottom Right edge
        [4, 3, 8, 9]        // Outer Right edge
    ],
    SCALE: 7.5,
    VERTEXES_SCALE: 0.1
});
    bettertesseract_shape = makePolychoron({
        VERTEXES: [
            // Outer/Inner Cube 1 (W = 1)
            [ -1,  1,  1,  1 ],  // 0
            [  1,  1,  1,  1 ],  // 1
            [  1, -1,  1,  1 ],  // 2
            [ -1, -1,  1,  1 ],  // 3
            [ -1,  1, -1,  1 ],  // 4
            [  1,  1, -1,  1 ],  // 5
            [  1, -1, -1,  1 ],  // 6
            [ -1, -1, -1,  1 ],  // 7
            
            // Outer/Inner Cube 2 (W = -1)
            [ -1,  1,  1, -1 ],  // 8
            [  1,  1,  1, -1 ],  // 9
            [  1, -1,  1, -1 ],  // 10
            [ -1, -1,  1, -1 ],  // 11
            [ -1,  1, -1, -1 ],  // 12
            [  1,  1, -1, -1 ],  // 13
            [  1, -1, -1, -1 ],  // 14
            [ -1, -1, -1, -1 ]   // 15
        ],
        FACES: [
            // --- Cube 1 Faces (W = 1) ---
            [0, 1, 2, 3],       // Top
            [4, 5, 6, 7],       // Bottom
            [0, 1, 5, 4],       // Front
            [1, 2, 6, 5],       // Right
            [2, 3, 7, 6],       // Back
            [3, 0, 4, 7],       // Left

            // --- Cube 2 Faces (W = -1) ---
            [8, 9, 10, 11],     // Top
            [12, 13, 14, 15],   // Bottom
            [8, 9, 13, 12],     // Front
            [9, 10, 14, 13],    // Right
            [10, 11, 15, 14],   // Back
            [11, 8, 12, 15],    // Left

            // --- Connecting Faces (Bridging W=1 to W=-1) ---
            // Top and Bottom bridges
            [0, 1, 9, 8], 
            [1, 2, 10, 9], 
            [2, 3, 11, 10], 
            [3, 0, 8, 11],
            [4, 5, 13, 12], 
            [5, 6, 14, 13], 
            [6, 7, 15, 14], 
            [7, 4, 12, 15],
            
            // Vertical pillar bridges
            [0, 4, 12, 8], 
            [1, 5, 13, 9], 
            [2, 6, 14, 10], 
            [3, 7, 15, 11]
        ],
        VERTEXES_SCALE: 0.1,
        SCALE: 6
    })
burger_shape = makePolyhedron({
    VERTEXES: [
        // --- LAYER 1: Bottom Bun (Indexes 0 to 7) ---
        [1.0, -1.0, -1.5], [1.0, 1.0, -1.5], [-1.0, 1.0, -1.5], [-1.0, -1.0, -1.5], // Bun Base
        [1.0, -1.0, -0.5], [1.0, 1.0, -0.5], [-1.0, 1.0, -0.5], [-1.0, -1.0, -0.5], // Bun Top

        // --- LAYER 2: The Patty - Slightly wider (Indexes 8 to 15) ---
        [1.2, -1.2, -0.5], [1.2, 1.2, -0.5], [-1.2, 1.2, -0.5], [-1.2, -1.2, -0.5], // Patty Base
        [1.2, -1.2,  0.3], [1.2, 1.2,  0.3], [-1.2, 1.2,  0.3], [-1.2, -1.2,  0.3], // Patty Top

        // --- LAYER 3: The Cheese - Diamond shaped, sticking out (Indexes 16 to 23) ---
        [1.4,  0.0,  0.3], [ 0.0,  1.4, 0.3], [-1.4,  0.0, 0.3], [ 0.0, -1.4, 0.3], // Cheese Base
        [1.4,  0.0,  0.5], [ 0.0,  1.4, 0.5], [-1.4,  0.0, 0.5], [ 0.0, -1.4, 0.5], // Cheese Top

        // --- LAYER 4: Top Bun - Tapered at the top (Indexes 24 to 31) ---
        [1.0, -1.0,  0.5], [1.0,  1.0, 0.5], [-1.0,  1.0, 0.5], [-1.0, -1.0, 0.5], // Top Bun Base
        [0.8, -0.8,  1.5], [0.8,  0.8, 1.5], [-0.8,  0.8, 1.5], [-0.8, -0.8, 1.5]  // Top Bun Crown
    ],
    FACES: [
        // --- Bottom Bun Faces ---
        [3, 2, 1, 0],       // Bottom
        [4, 5, 6, 7],       // Top (hidden by patty)
        [0, 1, 5, 4], [1, 2, 6, 5], [2, 3, 7, 6], [3, 0, 4, 7], // Sides

        // --- Patty Faces ---
        [11, 10, 9, 8],     // Bottom
        [12, 13, 14, 15],   // Top
        [8, 9, 13, 12], [9, 10, 14, 13], [10, 11, 15, 14], [11, 8, 12, 15],
        [19, 18, 17, 16],
        [20, 21, 22, 23],
        [16, 17, 21, 20], [17, 18, 22, 21], [18, 19, 23, 22], [19, 16, 20, 23],
        [27, 26, 25, 24],
        [28, 29, 30, 31],
        [24, 25, 29, 28], [25, 26, 30, 29], [26, 27, 31, 30], [27, 24, 28, 31]
    ],
    SCALE: 7.5,
    VERTEXES_SCALE: 0.1
});
myShape_shape = makePolyhedron({
    VERTEXES: [
        [-1, 0, 0],
        [0, 0, 0],
        [0, 0, 1],
        [-1, 0, 1],
        [-1, 1, 1],
        [-1, 1, 1],
        [-1, 1, 0],
        [0, 1, 0],
        [-1, 1, 0],
        [0, 1, 1],
        [0, 0, 1]
    ],
    FACES: [
        [0, 1, 2, 3, 4, 5, 5, 6, 0, 1, 7, 6, 8, 0, 1, 2, 9, 7, 9, 4, 3, 10, 9]
    ],
    SCALE: 10,
    VERTEXES_SCALE: 0.1
});

Class.myShape = {
    PARENT: "food",
    LABEL: "My Shape",
    VALUE: 1e7,
    SIZE: 18,
    COLOR: "egg",
    SHAPE: myShape_shape,
    BODY: {
        DAMAGE: 6,
        DENSITY: 20,
        HEALTH: 60,
        RESIST: 1.25,
        PENETRATION: 20,
        ACCELERATION: 0.003
    },
    DRAW_HEALTH: true,
    INTANGIBLE: false,
    GIVE_KILL_MESSAGE: true
};
    HexagonalPrism_shape = (function() {
        const vertices = [
            [1.5, 0, 1],        // 0
            [0.75, 1.3, 1],     // 1
            [-0.75, 1.3, 1],    // 2
            [-1.5, 0, 1],       // 3
            [-0.75, -1.3, 1],   // 4
            [0.75, -1.3, 1],    // 5
            [1.5, 0, -1],       // 6
            [0.75, 1.3, -1],    // 7
            [-0.75, 1.3, -1],   // 8
            [-1.5, 0, -1],      // 9
            [-0.75, -1.3, -1],  // 10
            [0.75, -1.3, -1]    // 11
        ];

        const faceIndices = [
            // Top Face (Hexagon)
            [0, 1, 2, 3, 4, 5],
            
            // Bottom Face (Hexagon, drawn in reverse to face outward)
            [6, 11, 10, 9, 8, 7],
            
            // 6 Side Faces (Rectangles/Quads connecting top to bottom)
            [0, 6, 7, 1],
            [1, 7, 8, 2],
            [2, 8, 9, 3],
            [3, 9, 10, 4],
            [4, 10, 11, 5],
            [5, 11, 6, 0]
        ];

        // Maps the index numbers to the actual literal [x, y, z] coordinates
        const formattedFaces = faceIndices.map(face => face.map(i => vertices[i]));

        // Passes it to the 3D renderer exactly how your engine expects it
        return makePolyhedron({
            FACES: formattedFaces,
            SCALE: 7.5,
            VERTEXES_SCALE: 0.1
        });
    })();
    glome_shape = makePolychoron({
        VERTEXES: [
            [ 1.5,  0,  0,  0 ], // 0: +X
            [-1.5,  0,  0,  0 ], // 1: -X
            [ 0,  1.5,  0,  0 ], // 2: +Y
            [ 0, -1.5,  0,  0 ], // 3: -Y
            [ 0,  0,  1.5,  0 ], // 4: +Z
            [ 0,  0, -1.5,  0 ], // 5: -Z
            [ 0,  0,  0,  1.5 ], // 6: +W
            [ 0,  0,  0, -1.5 ]  // 7: -W
        ],
        FACES: [
            // X-Y-Z Faces (W = 0)
            [0,2,4], [0,2,5], [0,3,4], [0,3,5], 
            [1,2,4], [1,2,5], [1,3,4], [1,3,5],
            
            // Y-Z-W Faces (X = 0)
            [2,4,6], [2,4,7], [2,5,6], [2,5,7], 
            [3,4,6], [3,4,7], [3,5,6], [3,5,7],
            
            // X-Z-W Faces (Y = 0)
            [0,4,6], [0,4,7], [0,5,6], [0,5,7], 
            [1,4,6], [1,4,7], [1,5,6], [1,5,7],
            
            // X-Y-W Faces (Z = 0)
            [0,2,6], [0,2,7], [0,3,6], [0,3,7], 
            [1,2,6], [1,2,7], [1,3,6], [1,3,7]
        ],
        VERTEXES_SCALE: 0.1,
        SCALE: 6
    })
    mandelblub_shape = (function() {
        const vertices = [
            // Outer Fractal Spikes
            [1.5, 0, 0],   // 0: +X
            [-1.5, 0, 0],  // 1: -X
            [0, 1.5, 0],   // 2: +Y
            [0, -1.5, 0],  // 3: -Y
            [0, 0, 1.5],   // 4: +Z
            [0, 0, -1.5],  // 5: -Z

            [0.5, 0.5, 0.5],    // 6
            [-0.5, 0.5, 0.5],   // 7
            [-0.5, -0.5, 0.5],  // 8
            [0.5, -0.5, 0.5],   // 9
            [0.5, 0.5, -0.5],   // 10
            [-0.5, 0.5, -0.5],  // 11
            [-0.5, -0.5, -0.5], // 12
            [0.5, -0.5, -0.5]   // 13
        ];

        const faceIndices = [
            // +Z Spike
            [4, 6, 7], [4, 7, 8], [4, 8, 9], [4, 9, 6],
            // -Z Spike
            [5, 11, 10], [5, 10, 13], [5, 13, 12], [5, 12, 11],
            // +Y Spike
            [2, 10, 11], [2, 11, 7], [2, 7, 6], [2, 6, 10],
            // -Y Spike
            [3, 9, 8], [3, 8, 12], [3, 12, 13], [3, 13, 9],
            // +X Spike
            [0, 6, 9], [0, 9, 13], [0, 13, 10], [0, 10, 6],
            // -X Spike
            [1, 7, 11], [1, 11, 12], [1, 12, 8], [1, 8, 7]
        ];

        const formattedFaces = faceIndices.map(face => {
            return face.map(vertexIndex => vertices[vertexIndex]);
        });

        return makePolyhedron({
            FACES: formattedFaces,
            SCALE: 7.5,
            VERTEXES_SCALE: 0.1
        });
    })();
} else {
    cube_shape = [[0.1,0],[0.6,-0.8660254037844386],[1.1,0],[0.6,0.8660254037844386],[0.1,0],[-0.05,0.08660254037844387],[0.45,0.9526279441628825],[-0.55,0.9526279441628825],[-1.05,0.08660254037844387],[-0.05,0.08660254037844387],[0.1,0],[-0.05,-0.08660254037844387],[-1.05,-0.08660254037844387],[-0.55,-0.9526279441628825],[0.45,-0.9526279441628825],[-0.05,-0.08660254037844387]]
    tetrahedron_shape = "M -0.065 0.037 L -0.934 -0.477 L -0.054 1.047 Z M 0.065 0.037 L 0.054 1.047 L 0.934 -0.477 Z M 0 -0.075 L 0.88 -0.57 L -0.88 -0.57 Z"
    octahedron_shape = "M -0.053 0.053 L -0.947 0.053 L -0.053 0.947 Z M 0.053 0.053 L 0.053 0.947 L 0.947 0.053 Z M 0.053 -0.053 L 0.947 -0.053 L 0.053 -0.947 Z M -0.053 -0.053 L -0.053 -0.947 L -0.947 -0.053 Z"
    dodecahedron_shape = "M -0.341 -0.469 H 0.341 L 0.552 0.179 L 0 0.58 L -0.552 0.179 Z M -0.951 -0.309 L -0.95 0.238 L -0.674 0.149 L -0.458 -0.517 L -0.629 -0.751 Z M -0.588 0.809 L -0.067 0.977 L -0.067 0.687 L -0.633 0.276 L -0.909 0.366 Z M 0.588 0.809 L 0.908 0.366 L 0.633 0.276 L 0.067 0.687 L 0.067 0.977 Z M 0.951 -0.309 L 0.629 -0.751 L 0.458 -0.517 L 0.674 0.149 L 0.95 0.238 Z M 0 -1 L -0.52 -0.83 L -0.35 -0.595 H 0.35 L 0.52 -0.83 Z"
    icosahedron_shape = "M -0.836 0.482 L -0.127 0.639 L -0.617 -0.209 Z M 0.699 -0.333 L 0.913 0.362 L 0.896 -0.447 Z M 0.638 -0.439 L 0.143 -0.972 L 0.836 -0.553 Z M 0.836 0.482 L 0.617 -0.209 L 0.127 0.639 Z M -0.638 -0.439 L -0.143 -0.972 L -0.836 -0.553 Z M -0.699 -0.333 L -0.913 0.362 L -0.896 -0.447 Z M 0 -0.965 L -0.49 -0.43 H 0.49 Z M -0.061 0.772 L -0.77 0.61 L -0.061 1 Z M 0.061 0.772 L 0.77 0.61 L 0.061 1 Z M 0 0.62 L -0.537 -0.31 L 0.537 -0.31 Z"
    tesseract_shape = "M 0.47 -0.375 L 0.71 -0.615 L 0.71 0.615 L 0.47 0.375 Z M -0.375 -0.47 L -0.615 -0.71 L 0.615 -0.71 L 0.375 -0.47 Z M -0.47 0.375 L -0.71 0.615 L -0.71 -0.615 L -0.47 -0.375 Z M 0.375 0.47 L 0.615 0.71 L -0.615 0.71 L -0.375 0.47 Z M 0.35 0.35 L 0.35 -0.35 L -0.35 -0.35 L -0.35 0.35 Z"
}

Class.sphere = {
    PARENT: "food",
    LABEL: "Sphere",
    NAME: "The Sphere",
    FACING_TYPE: "noFacing",
    VALUE: 1e7,
    SHAPE: 0,
    SIZE: 9,
    COLOR: {
        BASE: "veryLightGrey",
        BRIGHTNESS_SHIFT: -15,
    },
    BODY: {
        DAMAGE: 4,
        DENSITY: 16,
        HEALTH: 30,
        RESIST: 1.25,
        PENETRATION: 15,
        ACCELERATION: 0.002
    },
    DRAW_HEALTH: true,
    GIVE_KILL_MESSAGE: true,
    PROPS: [{
        POSITION: [17, 0, 0, 0, 1],
        TYPE: ["egg", { COLOR: { BRIGHTNESS_SHIFT: -14 }, BORDERLESS: true }]
    }, {
        POSITION: [15, 1, -1, 0, 1],
        TYPE: ["egg", { COLOR: { BRIGHTNESS_SHIFT: -9 }, BORDERLESS: true }]
    }, {
        POSITION: [13, 2, -2, 0, 1],
        TYPE: ["egg", { COLOR: { BRIGHTNESS_SHIFT: -8 }, BORDERLESS: true }]
    }, {
        POSITION: [11, 3, -3, 0, 1],
        TYPE: ["egg", { COLOR: { BRIGHTNESS_SHIFT: -3 }, BORDERLESS: true }]
    }, {
        POSITION: [8, 3.25, -3.25, 0, 1],
        TYPE: ["egg", { COLOR: { BRIGHTNESS_SHIFT: 3 }, BORDERLESS: true }]
    }, {
        POSITION: [6, 3, -3, 0, 1],
        TYPE: ["egg", { COLOR: { BRIGHTNESS_SHIFT: 9 }, BORDERLESS: true }]
    }]
}
Class.cube = {
    PARENT: "food",
    LABEL: "Cube",
    VALUE: 2e7,
    SIZE: 10,
    COLOR: "egg",
    SHAPE: cube_shape,
    BODY: {
        DAMAGE: 4.8,
        DENSITY: 20,
        HEALTH: 40,
        RESIST: 1.25,
        PENETRATION: 17.5,
        ACCELERATION: 0.002
    },
    DRAW_HEALTH: true,
    INTANGIBLE: false,
    GIVE_KILL_MESSAGE: true
}
Class.HexagonalPrism = {
    PARENT: "food",
    LABEL: "The Hexagonal Prism",
    VALUE: 2e7,
    SIZE: 10,
    COLOR: "egg",
    SHAPE: HexagonalPrism_shape,
    BODY: {
        DAMAGE: 20,
        DENSITY: 200000000,
        HEALTH: 78,
        RESIST: 1.25,
        PENETRATION: 17.5,
        ACCELERATION: 0.002
    },
    DRAW_HEALTH: true,
    INTANGIBLE: false,
    GIVE_KILL_MESSAGE: true
}
Class.cone = {
    PARENT: "food",
    LABEL: "Cone",
    VALUE: 2e7,
    SIZE: 17,
    COLOR: "white",
    SHAPE: cone_shape,
    BODY: {
        DAMAGE: 4.8,
        DENSITY: 20,
        HEALTH: 40,
        RESIST: 1.25,
        PENETRATION: 17.5,
        ACCELERATION: 0.002
    },
    DRAW_HEALTH: true,
    INTANGIBLE: false,
    GIVE_KILL_MESSAGE: true
};
Class.star = {
    PARENT: "food",
    LABEL: "Star",
    VALUE: 2e7,
    SIZE: 23,
    COLOR: "white",
    SHAPE: star_shape,
    BODY: {
        DAMAGE: 4.8,
        DENSITY: 20,
        HEALTH: 40,
        RESIST: 1.25,
        PENETRATION: 17.5,
        ACCELERATION: 0.002
    },
    DRAW_HEALTH: true,
    INTANGIBLE: false,
    GIVE_KILL_MESSAGE: true
};
Class.cnx3DGreatRhombicosidodecahedron = {
    PARENT: ["threeDFood"],
    LABEL: "The True Great Rhombicosidodecahedron",
    VALUE: (20e10) * ThreeDValueMutli,
    SIZE: 15 * 2.5,
    SHAPE: (function() {
        const PHI = (1 + Math.sqrt(5)) / 2;
        const vertices = [];
        
        // 1. Core coordinate bases for the Great Rhombicosidodecahedron
        const bases = [
            [1/PHI, 1/PHI, 3+PHI],
            [2/PHI, PHI, 1+2*PHI],
            [1/PHI, PHI*PHI, -1+3*PHI],
            [2*PHI-1, 2, 2+PHI],
            [PHI, 3, 2*PHI]
        ];
        
        // 2. Mathematically map all 120 symmetric vertices using even permutations
        const perms = [
            (b) => [b[0], b[1], b[2]],
            (b) => [b[1], b[2], b[0]],
            (b) => [b[2], b[0], b[1]]
        ];
        
        for (let b of bases) {
            for (let p of perms) {
                let arr = p(b);
                for (let s = 0; s < 8; s++) {
                    vertices.push([
                        arr[0] * ((s & 1) ? 1 : -1),
                        arr[1] * ((s & 2) ? 1 : -1),
                        arr[2] * ((s & 4) ? 1 : -1)
                    ]);
                }
            }
        }
        
        // 3. Find structural edges by matching the squared distance
        const E2 = 8 - 4 * PHI; // Squared edge length
        const distSq = (a, b) => (a[0]-b[0])**2 + (a[1]-b[1])**2 + (a[2]-b[2])**2;
        
        const neighbors = [];
        for (let i = 0; i < vertices.length; i++) {
            neighbors[i] = [];
            for (let j = 0; j < vertices.length; j++) {
                if (i !== j && Math.abs(distSq(vertices[i], vertices[j]) - E2) < 0.01) {
                    neighbors[i].push(j);
                }
            }
        }
        
        // 4. Dynamically map the 62 flat planes (Faces)
        const faceIndices = []; // Renamed from faces to faceIndices
        const seen = new Set();
        
        // Helper to prevent duplicate faces when traversed from different angles
        const getHash = (path) => {
            let minIdx = 0, minVal = path[0];
            for (let i = 1; i < path.length; i++) {
                if (path[i] < minVal) { minVal = path[i]; minIdx = i; }
            }
            let fw = [], bw = [];
            for (let i = 0; i < path.length; i++) {
                fw.push(path[(minIdx + i) % path.length]);
                bw.push(path[(minIdx - i + path.length) % path.length]);
            }
            let fStr = fw.join(','), bStr = bw.join(',');
            return fStr < bStr ? fStr : bStr;
        };
        
        // Helper to guarantee faces are perfectly flat (Planar Check)
        const isPlanar = (path) => {
            if (path.length < 4) return true;
            let v0 = vertices[path[0]], v1 = vertices[path[1]], v2 = vertices[path[2]];
            let nx = (v1[1]-v0[1])*(v2[2]-v0[2]) - (v1[2]-v0[2])*(v2[1]-v0[1]);
            let ny = (v1[2]-v0[2])*(v2[0]-v0[0]) - (v1[0]-v0[0])*(v2[2]-v0[2]);
            let nz = (v1[0]-v0[0])*(v2[1]-v0[1]) - (v1[1]-v0[1])*(v2[0]-v0[0]);
            let len = Math.sqrt(nx*nx + ny*ny + nz*nz);
            nx /= len; ny /= len; nz /= len; // Normalize
            
            for (let i = 3; i < path.length; i++) {
                let vi = vertices[path[i]];
                let dot = nx*(vi[0]-v0[0]) + ny*(vi[1]-v0[1]) + nz*(vi[2]-v0[2]);
                if (Math.abs(dot) > 0.01) return false;
            }
            return true;
        };
        
        // Rapid DFS cycle-searcher for squares (4), hexagons (6), and decagons (10)
        const stack = [];
        for (let i = 0; i < vertices.length; i++) {
            stack.push({ start: i, current: i, path: [i] });
        }
        
        while (stack.length > 0) {
            let { start, current, path } = stack.pop();
            
            if (path.length === 4 || path.length === 6 || path.length === 10) {
                if (neighbors[current].includes(start) && isPlanar(path)) {
                    let hash = getHash(path);
                    if (!seen.has(hash)) {
                        seen.add(hash);
                        faceIndices.push(path);
                    }
                }
            }
            
            if (path.length < 10) {
                for (let n of neighbors[current]) {
                    if (!path.includes(n)) {
                        stack.push({ start, current: n, path: [...path, n] });
                    }
                }
            }
        }
        
        // FIX 2: Map the indices directly into literal coordinate arrays so the engine can see it!
        const formattedFaces = faceIndices.map(face => face.map(i => vertices[i]));
        
        // 5. Build and inject directly into your engine's Polyhedron pipeline
        return makePolyhedron({
            FACES: formattedFaces,
            VERTEXES_SCALE: 0.25, 
            SCALE: 2
        });
    })(),
    BODY: {
        DAMAGE: 50,
        DENSITY: 65,
        HEALTH: 5200 * ThreeDHealthMutli,
        RESIST: 21.5,
        PENETRATION: 75,
        ACCELERATION: 0.002
    },
    DRAW_HEALTH: true,
    INTANGIBLE: false,
    GIVE_KILL_MESSAGE: true,
};
Class.smile = {
    PARENT: "food",
    LABEL: "Floating Smile",
    VALUE: 10000,
    SIZE: 25,
    COLOR: "white",
    SHAPE: smile_shape,
    BODY: {
        DAMAGE: 0.5,
        DENSITY: 10,
        HEALTH: 50,
        RESIST: 1.0,
        PENETRATION: 5.0,
        ACCELERATION: 0.002
    },
    DRAW_HEALTH: true,
    INTANGIBLE: false,
    GIVE_KILL_MESSAGE: true
};
Class.confusing = {
    PARENT: "food",
    LABEL: "Confusing!!!",
    VALUE: 1000000000000000e90,
    SIZE: 25,
    COLOR: "white",
    SHAPE: confusing_shape,
    BODY: {
        DAMAGE: 145.8,
        DENSITY: 10000000000000,
        HEALTH: 500e93,
        RESIST: 100000.0,
        PENETRATION: 50000.0,
        ACCELERATION: 0.04
    },
    DRAW_HEALTH: true,
    INTANGIBLE: false,
    GIVE_KILL_MESSAGE: true
};
Class.octahedron2 = {
    PARENT: "food",
    LABEL: "Octahedron",
    NAME: "The Super Octahedron",
    VALUE: 4e9,
    SIZE: 75,
    COLOR: "egg",
    SHAPE: octahedron2_shape,
    BODY: {
        DAMAGE: 4.3,
        DENSITY: 50,
        HEALTH: 100,
        RESIST: 2.3,
        PENETRATION: 10,
        ACCELERATION: 0.006
    },
    DRAW_HEALTH: true,
    INTANGIBLE: false,
    GIVE_KILL_MESSAGE: true
}
Class.wedge = {
    PARENT: "food",
    LABEL: "Wedge",
    NAME: "The Wedge",
    VALUE: 4e9,
    SIZE: 30,
    COLOR: "egg",
    SHAPE: wedge_shape,
    BODY: {
        DAMAGE: 6,
        DENSITY: 50,
        HEALTH: 120,
        RESIST: 2.3,
        PENETRATION: 10,
        ACCELERATION: 0.004
    },
    DRAW_HEALTH: true,
    INTANGIBLE: false,
    GIVE_KILL_MESSAGE: true
}
Class.hexeract = {
    PARENT: "food",
    LABEL: "Hexeract",
    NAME: "The Hexeract",
    VALUE: 1e10, // 10 Billion score!
    SIZE: 45,
    COLOR: "hexagon", 
    SHAPE: (function() {
        const vertices6D = [];
        const faces = [];

        // 1. Generate the 64 6D Vertices (x, y, z, w, v, u)
        for (let i = 0; i < 64; i++) {
            vertices6D.push([
                (i & 1) ? 1 : -1, (i & 2) ? 1 : -1,
                (i & 4) ? 1 : -1, (i & 8) ? 1 : -1,
                (i & 16) ? 1 : -1, (i & 32) ? 1 : -1
            ]);
        }

        // 2. Dynamically build the 240 square faces
        for (let i = 0; i < 64; i++) {
            for (let d1 = 0; d1 < 6; d1++) {
                for (let d2 = d1 + 1; d2 < 6; d2++) {
                    if (((i >> d1) & 1) === 0 && ((i >> d2) & 1) === 0) {
                        faces.push([
                            i, 
                            i | (1 << d1), 
                            i | (1 << d1) | (1 << d2), 
                            i | (1 << d2)
                        ]);
                    }
                }
            }
        }

        // 3. Double Projection (6D -> 5D -> 4D)
        const vertices4D = vertices6D.map(val => {
            let [x, y, z, w, v, u] = val;
            
            // Squash 6th dimension into 5D space
            let scale5 = 1.5 / (2.5 - u);
            let px = x * scale5, py = y * scale5, pz = z * scale5, pw = w * scale5, pv = v * scale5;
            
            // Squash 5th dimension into 4D space
            let scale4 = 1.5 / (2.5 - pv);
            return [px * scale4, py * scale4, pz * scale4, pw * scale4];
        });

        return makePolychoron({
            VERTEXES: vertices4D,
            FACES: faces,
            VERTEXES_SCALE: 0.1,
            SCALE: 6
        });
    })(),
    BODY: {
        DAMAGE: 20,
        DENSITY: 100,
        RESIST: 2,
        HEALTH: 2000, // Boss-level health
        PENETRATION: 100,
        ACCELERATION: 0.0005 // Extremely slow and imposing
    },
    DRAW_HEALTH: true,
    GIVE_KILL_MESSAGE: true
};
Class.inkling_head = {
    SHAPE: inkling_head_shape,
    COLOR: "#FF6600", // Splatoon Neon Orange
    INDEPENDENT: true // Keeps it locked to the body's rotation
};
Class.burger = {
    PARENT: "food",
    LABEL: "Cheeseburger",
    VALUE: 50000,
    SIZE: 23,
    COLOR: "orange", // Change to "brown" or "yellow" depending on what you want to emphasize!
    SHAPE: burger_shape,
    BODY: {
        DAMAGE: 1.5,
        DENSITY: 25,
        HEALTH: 100,
        RESIST: 1.5,
        PENETRATION: 10,
        ACCELERATION: 0.001
    },
    DRAW_HEALTH: true,
    INTANGIBLE: false,
    GIVE_KILL_MESSAGE: true
};
Class.inkling_tank = {
    SHAPE: inkling_tank_shape,
    COLOR: "#00FFFF", // Cyan Ink
    INDEPENDENT: true 
};
Class.inkling = {
    PARENT: "food",
    LABEL: "Inkling",
    VALUE: 50000,
    SIZE: 18,
    COLOR: "#FFFFFF", // White Basic Tee
    SHAPE: inkling_body_shape,
    
    // --- THIS IS THE MAGIC PART ---
    // We attach the colored parts to the main body!
    // Format: [size, X_offset, Y_offset, angle, arc, visible]
    TURRETS: [
        { POSITION: [12, 0, 0, 0, 360, 1], TYPE: "inkling_head" }, // Mounts head on top
        { POSITION: [8, -3.5, 0, 0, 360, 1], TYPE: "inkling_tank" } // Mounts tank on back
    ],

    BODY: {
        DAMAGE: 20,
        DENSITY: 20,
        HEALTH: 500,
        RESIST: 0.5,
        PENETRATION: 15,
        ACCELERATION: 0.02 // Very fast, like swimming in ink
    },
    DRAW_HEALTH: true,
    GIVE_KILL_MESSAGE: true
};
Class.cat = {
    PARENT: "food",
    LABEL: "Cat",
    VALUE: 5e8,
    SIZE: 25,
    COLOR: "grey",
    SHAPE: cat_shape,
    BODY: {
        DAMAGE: 0.1,
        DENSITY: 20,
        HEALTH: 50,
        RESIST: 1.25,
        PENETRATION: 17.5,
        ACCELERATION: 0.003,
        PUSHABILITY: 0.8
    },
    DRAW_HEALTH: true,
    INTANGIBLE: false,
    GIVE_KILL_MESSAGE: true
};
Class.heart = {
    PARENT: "food",
    LABEL: "Heart",
    VALUE: 1e8,
    SIZE: 20,
    COLOR: "red",
    SHAPE: heart_shape,
    BODY: {
        DAMAGE: 0,
        DENSITY: 20,
        HEALTH: 150,
        RESIST: 1.25,
        PENETRATION: 17.5,
        ACCELERATION: 0.002
    },
    DRAW_HEALTH: true,
    INTANGIBLE: false,
    GIVE_KILL_MESSAGE: true
};
Class.penteract = {
    PARENT: "food",
    LABEL: "Penteract",
    NAME: "The Penteract",
    VALUE: 2e9,
    SIZE: 35,
    COLOR: "purple", 
    SHAPE: (function() {
        const vertices5D = [];
        const faces = [];

        // 1. Generate the 32 5D Vertices (x, y, z, w, v)
        for (let i = 0; i < 32; i++) {
            vertices5D.push([
                (i & 1) ? 1 : -1, (i & 2) ? 1 : -1,
                (i & 4) ? 1 : -1, (i & 8) ? 1 : -1,
                (i & 16) ? 1 : -1
            ]);
        }

        // 2. Dynamically build the 80 square faces
        for (let i = 0; i < 32; i++) {
            for (let d1 = 0; d1 < 5; d1++) {
                for (let d2 = d1 + 1; d2 < 5; d2++) {
                    // Only start on a corner where both target dimensions are 0 to avoid duplicates
                    if (((i >> d1) & 1) === 0 && ((i >> d2) & 1) === 0) {
                        faces.push([
                            i, 
                            i | (1 << d1), 
                            i | (1 << d1) | (1 << d2), 
                            i | (1 << d2)
                        ]);
                    }
                }
            }
        }

        // 3. Project 5D down to 4D so makePolychoron can read it
        const vertices4D = vertices5D.map(val => {
            let [x, y, z, w, v] = val;
            let scale = 1.5 / (2.5 - v); // Perspective projection of the 5th dimension
            return [x * scale, y * scale, z * scale, w * scale];
        });

        return makePolychoron({
            VERTEXES: vertices4D,
            FACES: faces,
            VERTEXES_SCALE: 0.1,
            SCALE: 6
        });
    })(),
    BODY: {
        DAMAGE: 15,
        DENSITY: 60,
        RESIST: 1.5,
        HEALTH: 500, // Very tanky
        PENETRATION: 75,
        ACCELERATION: 0.001
    },
    DRAW_HEALTH: true,
    GIVE_KILL_MESSAGE: true
};
Class.glome = {
    PARENT: "food",
    LABEL: "Glome",
    NAME: "The Glome",
    VALUE: 19e10,
    SIZE: 45,
    COLOR: "egg",
    SHAPE: glome_shape,
    BODY: {
        DAMAGE: 100,
        DENSITY: 50,
        HEALTH: 2250,
        RESIST: 2.0,
        PENETRATION: 15,
        ACCELERATION: 0.002
    },
    DRAW_HEALTH: true,
    INTANGIBLE: false,
    GIVE_KILL_MESSAGE: true
}
Class.octahedron3 = {
    PARENT: "food",
    LABEL: "Geo Prism",
    VALUE: 7e8,
    SIZE: 15,
    COLOR: "cyan",
    SHAPE: octahedron3_shape,
    BODY: {
        DAMAGE: 2,
        DENSITY: 15,
        HEALTH: 75,
        RESIST: 1.1,
        PENETRATION: 5,
        ACCELERATION: 0.005
    },
    DRAW_HEALTH: true,
    GIVE_KILL_MESSAGE: false
};
Class.pentatope = {
    PARENT: "food",
    LABEL: "Pentatope",
    NAME: "The Pentatope",
    VALUE: 12e6,
    SIZE: 80,
    COLOR: "egg",
    SHAPE: pentatope_shape,
    BODY: {
        DAMAGE: 6,
        DENSITY: 5000000000,
        HEALTH: 700,
        RESIST: 2.3,
        PENETRATION: 10,
        ACCELERATION: 0.004
    },
    DRAW_HEALTH: true,
    INTANGIBLE: false,
    GIVE_KILL_MESSAGE: true
}
Class.grand_antiprism = {
    PARENT: "food",
    LABEL: "Grand Antiprism",
    NAME: "The Grand Antiprism",
    VALUE:15e7,
    SIZE: 80,
    COLOR: "egg",
    SHAPE: grand_antiprism_shape,
    BODY: {
        DAMAGE: 6,
        DENSITY: 5000000000,
        HEALTH: 1750,
        RESIST: 2.3,
        PENETRATION: 10,
        ACCELERATION: 0.004
    },
    DRAW_HEALTH: true,
    INTANGIBLE: false,
    GIVE_KILL_MESSAGE: true
}
Class.bettertesseract = {
    PARENT: "food",
    LABEL: "Tesseract",
    NAME: "The Ultra Tesseract",
    VALUE: 2e6,
    SIZE: 80,
    COLOR: "egg",
    SHAPE: bettertesseract_shape,
    BODY: {
        DAMAGE: 10,
        DENSITY: 5000000000,
        HEALTH: 45,
        RESIST: 2.3,
        PENETRATION: 10,
        ACCELERATION: 0.009
    },
    DRAW_HEALTH: true,
    INTANGIBLE: false,
    GIVE_KILL_MESSAGE: true
}
Class.pyramid = {
    PARENT: "food",
    LABEL: "Pyramid",
    NAME: "The Pyramid",
    VALUE: 2e4,
    SIZE: 25,
    COLOR: "egg",
    SHAPE: pyramid_shape,
    BODY: {
        DAMAGE: 4,
        DENSITY: 20,
        HEALTH: 75,
        RESIST: 2.3,
        PENETRATION: 10,
        ACCELERATION: 0.003
    },
    DRAW_HEALTH: true,
    INTANGIBLE: false,
    GIVE_KILL_MESSAGE: true
}
Class.geodesic = {
    PARENT: "food",
    LABEL: "Geodesic",
    NAME: "The Geodesic",
    VALUE: 14e9,
    SIZE: 125,
    COLOR: "egg",
    SHAPE: geodesic_sphere_shape,
    BODY: {
        DAMAGE: 10.3,
        DENSITY: 100,
        HEALTH: 1500,
        RESIST: 2.9,
        PENETRATION: 15,
        ACCELERATION: 0.002
    },
    DRAW_HEALTH: true,
    INTANGIBLE: false,
    GIVE_KILL_MESSAGE: true
}
Class.mandelblub = {
    PARENT: "food",
    LABEL: "Mandelblub",
    NAME: "The Mandelblub",
    VALUE: 7e9,
    SIZE: 100,
    COLOR: "egg",
    SHAPE: mandelblub_shape,
    BODY: {
        DAMAGE: 8.6,
        DENSITY: 50,
        HEALTH: 1000,
        RESIST: 2.7,
        PENETRATION: 20,
        ACCELERATION: 0.005
    },
    DRAW_HEALTH: true,
    INTANGIBLE: false,
    GIVE_KILL_MESSAGE: true
}
Class.tetrahedron = {
    PARENT: "food",
    LABEL: "Tetrahedron",
    NAME: "The Tetrahedron",
    VALUE: 3e7,
    SIZE: 12,
    COLOR: "egg",
    SHAPE: tetrahedron_shape,
    BODY: {
        DAMAGE: 6,
        DENSITY: 23,
        HEALTH: 50,
        RESIST: 1.25,
        PENETRATION: 22.5,
        ACCELERATION: 0.002
    },
    DRAW_HEALTH: true,
    GIVE_KILL_MESSAGE: true
}
Class.world_ender = {
    PARENT: "food",
    LABEL: "ULTAMATE WORLD DESTROYER",
    VALUE: 100e150,
    SIZE: 50,
    COLOR: "57",
    SHAPE: world_ender_shape,
    BODY: {
        DAMAGE: 5000,
        DENSITY: 500,
        HEALTH: 999999,
        RESIST: 10,
        PENETRATION: 500,
        ACCELERATION: 0.005
    },
    DRAW_HEALTH: true,
    INTANGIBLE: false,
    GIVE_KILL_MESSAGE: true
};
Class.octahedron = {
    PARENT: "food",
    LABEL: "Octahedron",
    NAME: "The Octahedron",
    VALUE: 4e7,
    SIZE: 13,
    COLOR: "egg",
    SHAPE: octahedron_shape,
    BODY: {
        DAMAGE: 6.5,
        DENSITY: 26,
        HEALTH: 60,
        RESIST: 1.25,
        PENETRATION: 30,
        ACCELERATION: 0.002
    },
    DRAW_HEALTH: true,
    GIVE_KILL_MESSAGE: true
}
Class.dodecahedron = {
    PARENT: "food",
    LABEL: "Dodecahedron",
    NAME: "The Dodecahedron",
    VALUE: 5e7,
    SIZE: 18,
    COLOR: "egg",
    SHAPE: dodecahedron_shape,
    BODY: {
        DAMAGE: 7,
        DENSITY: 28,
        HEALTH: 70,
        RESIST: 1.25,
        PENETRATION: 32.5,
        ACCELERATION: 0.002
    },
    DRAW_HEALTH: true,
    GIVE_KILL_MESSAGE: true
}
Class.icosahedron = {
    PARENT: "food",
    LABEL: "Icosahedron",
    NAME: "The Icosahedron",
    VALUE: 1e8,
    SIZE: 20,
    COLOR: "egg",
    SHAPE: icosahedron_shape,
    BODY: {
        DAMAGE: 9,
        DENSITY: 30,
        HEALTH: 80,
        RESIST: 1.25,
        PENETRATION: 35,
        ACCELERATION: 0.002
    },
    DRAW_HEALTH: true,
    GIVE_KILL_MESSAGE: true
}

// 4D
Class.tesseract = {
    PARENT: "food",
    LABEL: "Tesseract",
    NAME: "The Tesseract",
    VALUE: 42e7,
    SIZE: 25,
    COLOR: "egg",
    SHAPE: tesseract_shape,
    BODY: {
        DAMAGE: 10,
        DENSITY: 40,
        RESIST: 1.25,
        HEALTH: 200,
        PENETRATION: 50,
        ACCELERATION: 0.003
    },
    DRAW_HEALTH: true,
    GIVE_KILL_MESSAGE: true
}

// Presents (todo: make this a self-creating function)
Class.presentRY = makePresent("red", "yellow")
Class.presentRP = makePresent("red", "purple")
Class.presentRW = makePresent("red", "white")
Class.presentGY = makePresent("green", "yellow")
Class.presentGP = makePresent("green", "purple")
Class.presentGW = makePresent("green", "white")
Class.presentBY = makePresent("blue", "yellow")
Class.presentBP = makePresent("blue", "purple")
Class.presentBW = makePresent("blue", "white")

// Relics
for (let [gemColor, name] of [
    [undefined, ""],
    ["powerGem", "Power"],
    ["spaceGem", "Space"],
    ["realityGem", "Reality"],
    ["soulGem", "Soul"],
    ["timeGem", "Time"],
    ["mindGem", "Mind"]
]) {
    let gem;
    if (gemColor) {
        gem = Class[name + "Gem"] = {
            PARENT: 'gem',
            LABEL: name + ' Gem',
            SHAPE: 6,
            COLOR: gemColor
        }
    }

    Class[name + "EggRelic"] = makeRelic("egg", 0.5, gem, 7)
    Class[name + "SquareRelic"] = makeRelic("square", 1, gem)
    Class[name + "TriangleRelic"] = makeRelic("triangle", 1.45, gem)
    Class[name + "PentagonRelic"] = makeRelic("pentagon", -0.6, gem)
    Class[name + "BetaPentagonRelic"] = makeRelic("betaPentagon", -0.6, gem)
    Class[name + "AlphaPentagonRelic"] = makeRelic("alphaPentagon", -0.6, gem)
    Class[name + "HexagonRelic"] = makeRelic("hexagon", -0.4, gem, undefined, 6.25)
    Class[name + "Hexagon_oldRelic"] = makeRelic("hexagon_old", -0.4, gem, undefined, 6.25)
    Class[name + "SeptagonRelic"] = makeRelic("septagon", -0.325, gem, undefined, 5.25)
    Class[name + "OctagonRelic"] = makeRelic("octagon", -0.3, gem, undefined, 4.75)
    Class[name + "NonagonRelic"] = makeRelic("nonagon", -0.25, gem, undefined, 4)
    Class[name + "CubeRelic"] = makeRelic("cube", -0.25, gem, undefined, 4)
    Class[name + "TesseractRelic"] = makeRelic("tesseract", -0.25, gem, undefined, 4)
    Class[name + "cnxSphereRelic"] = makeRelic("cnxSphere", -0.25, gem, undefined, 4)
    Class[name + "cnxDisdyakisTriacontahedronRelic"] = makeRelic("cnxDisdyakisTriacontahedron", -0.25, gem, undefined, 4)

}

// Tiered Food
let polyNames = ['egg', 'square', 'triangle', 'pentagon', 'hexagon'],
    shinyNames = ['', 'shiny', 'legendary', 'shadow', 'rainbow', 'trans'];
for (let tier = 0; tier < 6; tier++) {
    for (let poly in polyNames) {
        let polyName = polyNames[poly];
        polyName = polyName[0].toUpperCase() + polyName.slice(1);

        for (let shiny in shinyNames) {
            let shinyName = shinyNames[shiny];
            let food = shinyName + polyName;
            food = food[0].toLowerCase() + food.slice(1);

            Class[`laby_${poly}_${tier}_${shiny}_0`] = makeLaby(
                Class[food],
                parseInt(poly),
                parseInt(shiny),
                tier,
                polyName === 'Triangle' && tier > 0 ? 2 / 3 : 1
            );

            Class[`laby_${poly}_${tier}_${shiny}_1`] = makeCrasher(
                Class[`laby_${poly}_${tier}_${shiny}_0`]
            );
        }
    }
}
