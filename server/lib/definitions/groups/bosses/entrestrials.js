const {combineStats, LayeredBoss, makeMenu, setTurretProjectileRecoil} = require('../../facilitators.js')
const {base} = require('../../constants.js')
const g = require('../../gunvals.js')
const preset = require('../../presets.js')

// Entrestrials Base
Class.entrestrial = {
    PARENT: "miniboss",
    LABEL: "Entrestrial",
    SKILL: [9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
    VALUE: 350000,
    SHAPE: 5,
    SIZE: 23,
    CONTROLLERS: [["minion", {orbit: 125}]],
    BODY: {
        FOV: 1.1,
        HEALTH: 750,
        SHIELD: 50,
        REGEN: base.REGEN * 10,
        SPEED: base.SPEED * 2,
        DAMAGE: 4,
    },
};
Class.shotgunTurret = {
    PARENT: "shotgun",
    LABEL: "Turret",
    CONTROLLERS: ["nearestDifferentMaster"],
    INDEPENDENT: true
};
Class.realchip = {
    PARENT: "drone",
    LABEL: "Chip",
    SHAPE: 5, // Makes it a pentagon just like Gaia!
};
// 1. Thor
// Notice the first argument is now "thor" so you can spawn it correctly!
let thor = new LayeredBoss("thor", "Thor", "entrestrial", 7, "purple", "terrestrialTrapTurret", 4, 5);
thor.addLayer({turret: {
    POSITION: [9, 8, 0, null, 120, 0],
    TYPE: ["boomerTurret", { INDEPENDENT: true, COLOR: -1 } ],
}}, true, 10, 10);

// 2. Zeus
let zeus = new LayeredBoss("zeus", "Zeus", "entrestrial", 5, "gold", "terrestrialTrapTurret", 4, 5);
zeus.addLayer({turret: {
    POSITION: [9, 8, 0, null, 120, 0],
    TYPE: ["shotgunTurret", { INDEPENDENT: true, COLOR: -1 } ],
}}, true, 10, 10);

// 3. Gaia
let gaia = new LayeredBoss("gaia", "Gaia", "entrestrial", 5, "lightGreen", "terrestrialTrapTurret", 4, 5);
gaia.addLayer({gun: {
    POSITION: [2, 7, -1.6, 8.85, 0, null, 0],
    PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.drone, g.summoner, g.pounder, g.destroyer, {speed: 6.25, maxSpeed: 8}]),
        TYPE: ["realchip", {INDEPENDENT: true, DRAW_HEALTH: true, COLOR: 'lightGreen', SHAPE: 5}],
        AUTOFIRE: true,
        SYNCS_SKILLS: true,
    },
}}, true, 10, 10);

// 4. Hades
let hades = new LayeredBoss("hades", "Hades", "entrestrial", 5, "orange", "terrestrialTrapTurret", 4, 5);
hades.addLayer({turret: {
    POSITION: [9, 8, 0, null, 120, 0],
    TYPE: ["launcherTurret", { INDEPENDENT: true, COLOR: -1 } ],
}}, true, 10, 10);

// 5. Demeter
let demeter = new LayeredBoss("demeter", "Demeter", "entrestrial", 5, "pink", "terrestrialTrapTurret", 4, 5);
demeter.addLayer({turret: {
    POSITION: [9, 8, 0, null, 120, 0],
    TYPE: ["tripletTurret", { INDEPENDENT: true, COLOR: -1 } ],
}}, true, 10, 10);

// 6. Themis
let themis = new LayeredBoss("themis", "Themis", "entrestrial", 7, "aqua", "terrestrialTrapTurret", 4, 5);
themis.addLayer({turret: {
    POSITION: [9, 8, 0, null, 120, 0],
    TYPE: ["rocketeerTurret", { INDEPENDENT: true, COLOR: -1 } ],
}}, true, 10, 10);