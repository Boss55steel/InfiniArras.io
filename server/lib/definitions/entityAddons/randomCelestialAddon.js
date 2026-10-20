// ── Random Celestial Addon ───────────────────────────────────────────────────
// Converted to work with open-source-arras (AE0hello/open-source-arras latest).
//
// INSTALL:
//   Place in: server/lib/definitions/entityAddons/randomCelestialAddon.js
//   In combined.js loadAddons section, require this file.
//
// FIXES APPLIED:
//   - gunCalcNames removed from constants in new OSA → defined inline
//   - All short gunval aliases (g.mach, g.arty, g.skim, etc.) → OSA full names
//   - Custom gunvals (g.bent, g.bees, g.hive, g.sidewind, etc.) → defined inline
//   - module.exports wrapper removed (file now runs directly on require)
//   - Upgrade hook now tries menu_addons → addons → basic.UPGRADES_TIER_1
// ─────────────────────────────────────────────────────────────────────────────

const { combineStats, addAura, makeAuto, weaponArray } = require('../facilitators.js');
const { base } = require('../constants.js');
const g = require('../gunvals.js');

// ── gunCalcNames: newest OSA removed this from constants, define inline ───────
const gunCalcNames = {
    sustained: 'sustained',
    drone:     'drone',
    swarm:     'swarm',
    thruster:  'thruster',
    trap:      'trap',
    necro:     'necro',
    block:     'block',
};

// ── Gunval aliases: short names → full OSA names ──────────────────────────────
g.anni        = g.anni        || g.annihilator;
g.arty        = g.arty        || g.artillery;
g.assass      = g.assass      || g.assassin;
g.destroy     = g.destroy     || g.destroyer;
g.hunter2     = g.hunter2     || g.hunterSecondary;
g.launcher    = g.launcher    || g.rocketeer;      // closest match: rocketeer launch stats
g.lowpower    = g.lowpower    || g.lowPower;
g.mach        = g.mach        || g.machineGun;
g.mini        = g.mini        || g.minigun;
g.nail        = g.nail        || g.nailgun;
g.preda       = g.preda       || g.predator;
g.skim        = g.skim        || g.skimmer;
g.spread      = g.spread      || g.spreadshot;
g.spreadmain  = g.spreadmain  || g.spreadshotMain;
g.stream      = g.stream      || g.streamliner;
g.spawner     = g.spawner     || g.factory;        // factory/spawner = same mechanic

// ── Custom modifier gunvals not in standard OSA ───────────────────────────────
g.bent          = g.bent          || { reload: 0.8, damage: 0.8, recoil: 0.5 };
g.bees          = g.bees          || g.bee || { reload: 0.7, damage: 0.85, health: 0.9, size: 0.8 };
g.chain         = g.chain         || { reload: 0.6, damage: 0.7, speed: 1.2, maxSpeed: 1.2 };
g.fast          = g.fast          || { speed: 1.5, maxSpeed: 1.5 };
g.hive          = g.hive          || { reload: 0.5, damage: 0.6, health: 0.8, size: 0.7 };
g.morerecoil    = g.morerecoil    || { recoil: 2 };
g.morespeed     = g.morespeed     || { speed: 1.3, maxSpeed: 1.3 };
g.one_third_reload = g.one_third_reload || { reload: 1/3 };
g.puregunner    = g.puregunner    || g.gunner || { reload: 0.5, damage: 0.7, speed: 1.1, maxSpeed: 1.1 };
g.sidewind      = g.sidewind      || { speed: 0.9, maxSpeed: 0.5, range: 0.7, shudder: 0.2, spray: 0.2 };
g.atomizer      = g.atomizer      || { reload: 0.4, damage: 0.5, pen: 0.8, resist: 0.8, density: 0.9, spray: 1.6, size: 0.8 };
/*
████████╗██╗░░██╗██╗░██████╗  ░█████╗░██████╗░██████╗░░█████╗░███╗░░██╗  ███╗░░░███╗░█████╗░██████╗░███████╗
╚══██╔══╝██║░░██║██║██╔════╝  ██╔══██╗██╔══██╗██╔══██╗██╔══██╗████╗░██║  ████╗░████║██╔══██╗██╔══██╗██╔════╝
░░░██║░░░███████║██║╚█████╗░  ███████║██║░░██║██║░░██║██║░░██║██╔██╗██║  ██╔████╔██║███████║██║░░██║█████╗░░
░░░██║░░░██╔══██║██║░╚═══██╗  ██╔══██║██║░░██║██║░░██║██║░░██║██║╚████║  ██║╚██╔╝██║██╔══██║██║░░██║██╔══╝░░
░░░██║░░░██║░░██║██║██████╔╝  ██║░░██║██████╔╝██████╔╝╚█████╔╝██║░╚███║  ██║░╚═╝░██║██║░░██║██████╔╝███████╗
░░░╚═╝░░░╚═╝░░╚═╝╚═╝╚═════╝░  ╚═╝░░╚═╝╚═════╝░╚═════╝░░╚════╝░╚═╝░░╚══╝  ╚═╝░░░░░╚═╝╚═╝░░╚═╝╚═════╝░╚══════╝

██████╗░██╗░░░██╗  ░█████╗░░█████╗░███╗░░██╗██╗░░██╗░█████╗░
██╔══██╗╚██╗░██╔╝  ██╔══██╗██╔══██╗████╗░██║╚██╗██╔╝██╔══██╗
██████╦╝░╚████╔╝░  ██║░░╚═╝███████║██╔██╗██║░╚███╔╝░███████║
██╔══██╗░░╚██╔╝░░  ██║░░██╗██╔══██║██║╚████║░██╔██╗░██╔══██║
██████╦╝░░░██║░░░  ╚█████╔╝██║░░██║██║░╚███║██╔╝╚██╗██║░░██║
╚═════╝░░░░╚═╝░░░  ░╚════╝░╚═╝░░╚═╝╚═╝░░╚══╝╚═╝░░╚═╝╚═╝░░╚═╝
*/
const names = ["Zeus", "Odin", "Ra", "Apollo", "Athena", "Thor", "Shiva", "Vishnu", "Baal", "Anubis", "Horus", "Isis", "Poseidon", "Ares", "Hera", "Dionysus", "Demeter", "Hephaestus", "Hermes", "Hades", "Jupiter", "Mars", "Venus", "Minerva", "Mercury", "Neptune", "Janus", "Juno", "Saturn", "Pluto", "Ceres", "Loki", "Freya", "Brahma", "Ganesh", "Indra", "Lakshmi", "Kali", "Quetzalcoatl", "Tezcatlipoca", "Huitzilopochtli", "Tlaloc", "Pachamama", "Inti", "Viracocha", "Marduk", "Enlil", "Inanna", "Tiamat", "Ereshkigal", "Ishtar", "Nergal", "Ahura Mazda", "Mithra", "Perun", "Svarog", "Rod", "Dazhbog", "Yarilo", "Veles", "Chango", "Ogun", "Yemaya", "Oshun", "Obatala", "Shango", "Huitzilopochtli", "Amaterasu", "Susanoo", "Tsukuyomi", "Izanagi", "Izanami", "Fujin", "Raijin", "Benten", "Hachiman", "Morrigan", "Dagda", "Lugh", "Brigid", "Danu", "Cernunnos", "Manannán", "Taranis", "Teutates", "Epona", "Cú Chulainn", "Balder", "Frigg", "Skadi", "Njord", "Frey", "Freyja", "Set", "Thoth", "Bastet", "Sekhmet", "Ptah", "Sobek", "Nut", "Geb", "Osiris", "Enki", "Nanna", "Dumuzi", "Ninurta", "Quirinus", "Cupid", "Faunus", "Boreas", "Zephyrus", "Notus", "Eurus", "Thanatos", "Hypnos", "Selene", "Helios", "Eos", "Pan", "Hecate", "Eris", "Tyche"];
const randomName = names[Math.floor(Math.random() * names.length)];

const characters = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F"];
const randomCharacter1 = characters[Math.floor(Math.random() * characters.length)];
const randomCharacter2 = characters[Math.floor(Math.random() * characters.length)];
const randomCharacter3 = characters[Math.floor(Math.random() * characters.length)];
const randomCharacter4 = characters[Math.floor(Math.random() * characters.length)];
const randomCharacter5 = characters[Math.floor(Math.random() * characters.length)];
const randomCharacter6 = characters[Math.floor(Math.random() * characters.length)];

const regularDrones = Array(7).fill().map((_, i) => ({POSITION: [3.6, 6, 1.4, 8, 0, (360/7) * (i + 0.5), 0], PROPERTIES: { SHOOT_SETTINGS: combineStats([g.drone]), TYPE: ["drone", {INDEPENDENT: true,}], AUTOFIRE: true, SYNCS_SKILLS: true, WAIT_TO_CYCLE: true, MAX_CHILDREN: 4}}));
const machineGunDrones = Array(7).fill().map((_, i) => ({POSITION: [3.6, 5.25, 1.775, 8, 0, (360/7) * (i + 0.5), 0], PROPERTIES: { SHOOT_SETTINGS: combineStats([g.drone, g.mach, {reload: 0.75, damage: 0.7}]), TYPE: ["drone", {INDEPENDENT: true,}], AUTOFIRE: true, SYNCS_SKILLS: true, WAIT_TO_CYCLE: true, MAX_CHILDREN: 6}}));
const sniperDrones = Array(7).fill().map((_, i) => ({POSITION: [4.45, 5.75, 1.4, 8, 0, (360/7) * (i + 0.5), 0], PROPERTIES: { SHOOT_SETTINGS: combineStats([g.drone, g.sniper]), TYPE: ["drone", {INDEPENDENT: true,}], AUTOFIRE: true, SYNCS_SKILLS: true, WAIT_TO_CYCLE: true, MAX_CHILDREN: 3}}));
const pounderDrones = Array(7).fill().map((_, i) => ({POSITION: [3.6, 6.5, 1.2, 8, 0, (360/7) * (i + 0.5), 0], PROPERTIES: { SHOOT_SETTINGS: combineStats([g.drone, g.pounder]), TYPE: ["drone", {INDEPENDENT: true,}], AUTOFIRE: true, SYNCS_SKILLS: true, WAIT_TO_CYCLE: true, MAX_CHILDREN: 3}}));
const eggDrones = Array(7).fill().map((_, i) => ({POSITION: [2.6, 5, 1.4, 9.5, 0, (360/7) * (i + 0.5), 0], PROPERTIES: { SHOOT_SETTINGS: combineStats([g.drone, g.summoner, g.mach, { size: 0.4, spray: 150, speed: 2, shudder: 1.75 }]), TYPE: ["waferbread", {INDEPENDENT: true,}], AUTOFIRE: true, SYNCS_SKILLS: true, WAIT_TO_CYCLE: true, MAX_CHILDREN: 7}}));
const squareDrones = Array(7).fill().map((_, i) => ({POSITION: [2.6, 5, 1.4, 9.5, 0, (360/7) * (i + 0.5), 0], PROPERTIES: { SHOOT_SETTINGS: combineStats([g.drone, g.summoner, { size: 0.8 }]), TYPE: ["sunchip", {INDEPENDENT: true,}], AUTOFIRE: true, SYNCS_SKILLS: true, WAIT_TO_CYCLE: true, MAX_CHILDREN: 4}}));
const triangleDrones = Array(7).fill().map((_, i) => ({POSITION: [2.6, 5, 1.4, 9.5, 0, (360/7) * (i + 0.5), 0], PROPERTIES: { SHOOT_SETTINGS: combineStats([g.drone, g.summoner, { size: 0.9 }]), TYPE: ["drone", {INDEPENDENT: true,}], AUTOFIRE: true, SYNCS_SKILLS: true, WAIT_TO_CYCLE: true, MAX_CHILDREN: 3}}));
const pentagonDrones = Array(7).fill().map((_, i) => ({POSITION: [2.6, 5, 1.4, 9.5, 0, (360/7) * (i + 0.5), 0], PROPERTIES: { SHOOT_SETTINGS: combineStats([g.drone, g.summoner, g.destroyer]), TYPE: ["demonchip", {INDEPENDENT: true,}], AUTOFIRE: true, SYNCS_SKILLS: true, WAIT_TO_CYCLE: true, MAX_CHILDREN: 2}}));
const regularMinions = Array(7).fill().map((_, i) => ({POSITION: [3.6, 7, -1.4, 8, 0, (360/7) * (i + 0.5), 0], PROPERTIES: { SHOOT_SETTINGS: combineStats([g.spawner]), TYPE: ["minion", {INDEPENDENT: true,}], AUTOFIRE: true, SYNCS_SKILLS: true, WAIT_TO_CYCLE: true, MAX_CHILDREN: 3}}));
const pounderMinions = Array(7).fill().map((_, i) => ({POSITION: [3.6, 8, -1.2, 8, 0, (360/7) * (i + 0.5), 0], PROPERTIES: { SHOOT_SETTINGS: combineStats([g.spawner, g.pounder]), TYPE: ["megaMinion", {INDEPENDENT: true,}], AUTOFIRE: true, SYNCS_SKILLS: true, WAIT_TO_CYCLE: true, MAX_CHILDREN: 3}}));

const droneTypes = [regularDrones, machineGunDrones, sniperDrones, pounderDrones, eggDrones, squareDrones, triangleDrones, pentagonDrones, regularMinions, pounderMinions];
const randomDrones = droneTypes[Math.floor(Math.random() * droneTypes.length)];

Class.randomCelestialLowerBody = {
    LABEL: "",
    CONTROLLERS: [["spin", { independent: true, speed: -0.05 }]],
    COLOR: `#${randomCharacter1 + randomCharacter2 + randomCharacter3 + randomCharacter4 + randomCharacter5 + randomCharacter6}`,
    SIZE: 100,
    SKILL: [9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
    SHAPE: 7,
    FOV: 1,
    FACING_TYPE: "autospin",
    MAX_CHILDREN: 35,
    INDEPENDENT: true,
    GUNS: randomDrones
};


Class.genericTrret = {
    PARENT: "genericTank", // FIXED PARENT BRACKETS
    LABEL: "",
    BODY: {
        FOV: 2,
    },
    CONTROLLERS: [
        "canRepel",
        "onlyAcceptInArc",
        "mapAltToFire",
        "nearestDifferentMaster",
    ],
    COLOR: 16,
};
Class.randomSkimmerTurret = {
    PARENT: "genericTrret", // FIXED PARENT BRACKETS
    LABEL: "Skimmer",
    GUNS: [
        {
            POSITION: [10, 14, -0.5, 9, 0, 0, 0],
        },
        {
            POSITION: [17, 15, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    g.basic,
                    g.pounder,
                    g.skimmer,
                ]),
                TYPE: "missile",
                STAT_CALCULATOR: gunCalcNames.sustained,
            },
        },
    ],
};
Class.randomTwisterTurret = {
    PARENT: "genericTrret", // FIXED PARENT BRACKETS
    LABEL: "Twister",
    GUNS: [
        {
            POSITION: [10, 13, -0.5, 9, 0, 0, 0],
        },
        {
            POSITION: [17, 14, -1.4, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    g.basic,
                    g.pounder,
                    g.arty,
                    g.arty,
                    g.skim,
                    g.morespeed,
                    g.one_third_reload,
                ]),
                TYPE: "spinmissile",
                STAT_CALCULATOR: gunCalcNames.sustained,
            },
        },
    ],
};
Class.randomSwarmerTurret = {
    PARENT: "genericTrret", // FIXED PARENT BRACKETS
    LABEL: "Swarmer",
    GUNS: [
        {
            POSITION: [14, 14, -1.2, 5, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.destroy, g.hive]),
                TYPE: "hive",
            },
        },
        {
            POSITION: [15, 12, 1, 5, 0, 0, 0],
        },
    ],
};
Class.randomRocketeerTurret = {
    PARENT: "genericTrret", // FIXED PARENT BRACKETS
    LABEL: "Rocketeer",
    GUNS: [
        {
            POSITION: [10, 12.5, -0.7, 10, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    g.basic,
                    g.pounder,
                    g.launcher,
                    g.rocketeer,
                ]),
                TYPE: "rocketeerMissile",
                STAT_CALCULATOR: gunCalcNames.sustained,
            },
        },
        {
            POSITION: [17, 18, 0.65, 0, 0, 0, 0],
        },
    ],
};
Class.randomSidewinderTurret = {
    PARENT: "genericTrret", // FIXED PARENT BRACKETS
    LABEL: "Sidewinder",
    GUNS: [
        {
            POSITION: [10, 11, -0.5, 14, 0, 0, 0],
        },
        {
            POSITION: [21, 12, -1.1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.hunter, g.sidewind]),
                TYPE: "snake",
                STAT_CALCULATOR: gunCalcNames.sustained,
            },
        },
    ],
};
Class.randomPentaShotTurret = {
    PARENT: "genericTrret", // FIXED PARENT BRACKETS
    LABEL: "Penta Shot",
    GUNS: [
        {
            POSITION: [16, 8, 1, 0, -3, -30, 0.667],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.bent]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [16, 8, 1, 0, 3, 30, 0.667],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.bent]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [19, 8, 1, 0, -2, -15, 0.333],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.bent]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [19, 8, 1, 0, 2, 15, 0.333],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.bent]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [22, 8, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.bent]),
                TYPE: "bullet",
            },
        },
    ],
};
Class.randomSpreadshotTurret = {
    PARENT: "genericTrret", // FIXED PARENT BRACKETS
    LABEL: "Spreadshot",
    GUNS: [
        {
            /*** LENGTH  WIDTH   ASPECT    X       Y     ANGLE   DELAY */
            POSITION: [13, 4, 1, 0, -0.5, -75, 5 / 6],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    g.basic,
                    g.gunner,
                    g.arty,
                    g.twin,
                    g.spread,
                ]),
                TYPE: "bullet",
                LABEL: "Spread",
            },
        },
        {
            POSITION: [13, 4, 1, 0, 0.5, 75, 5 / 6],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    g.basic,
                    g.gunner,
                    g.arty,
                    g.twin,
                    g.spread,
                ]),
                TYPE: "bullet",
                LABEL: "Spread",
            },
        },
        {
            POSITION: [14.5, 4, 1, 0, -0.5, -60, 4 / 6],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    g.basic,
                    g.gunner,
                    g.arty,
                    g.twin,
                    g.spread,
                ]),
                TYPE: "bullet",
                LABEL: "Spread",
            },
        },
        {
            POSITION: [14.5, 4, 1, 0, 0.5, 60, 4 / 6],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    g.basic,
                    g.gunner,
                    g.arty,
                    g.twin,
                    g.spread,
                ]),
                TYPE: "bullet",
                LABEL: "Spread",
            },
        },
        {
            POSITION: [16, 4, 1, 0, -0.5, -45, 3 / 6],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    g.basic,
                    g.gunner,
                    g.arty,
                    g.twin,
                    g.spread,
                ]),
                TYPE: "bullet",
                LABEL: "Spread",
            },
        },
        {
            POSITION: [16, 4, 1, 0, 0.5, 45, 3 / 6],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    g.basic,
                    g.gunner,
                    g.arty,
                    g.twin,
                    g.spread,
                ]),
                TYPE: "bullet",
                LABEL: "Spread",
            },
        },
        {
            POSITION: [17.5, 4, 1, 0, -0.5, -30, 2 / 6],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    g.basic,
                    g.gunner,
                    g.arty,
                    g.twin,
                    g.spread,
                ]),
                TYPE: "bullet",
                LABEL: "Spread",
            },
        },
        {
            POSITION: [17.5, 4, 1, 0, 0.5, 30, 2 / 6],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    g.basic,
                    g.gunner,
                    g.arty,
                    g.twin,
                    g.spread,
                ]),
                TYPE: "bullet",
                LABEL: "Spread",
            },
        },
        {
            POSITION: [19, 4, 1, 0, -1, -15, 1 / 6],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    g.basic,
                    g.gunner,
                    g.arty,
                    g.twin,
                    g.spread,
                ]),
                TYPE: "bullet",
                LABEL: "Spread",
            },
        },
        {
            POSITION: [19, 4, 1, 0, 1, 15, 1 / 6],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    g.basic,
                    g.gunner,
                    g.arty,
                    g.twin,
                    g.spread,
                ]),
                TYPE: "bullet",
                LABEL: "Spread",
            },
        },
        {
            /*** LENGTH  WIDTH   ASPECT    X       Y     ANGLE   DELAY */
            POSITION: [12, 8, 1, 8, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    g.basic,
                    g.pounder,
                    g.spreadmain,
                    g.spread,
                ]),
                TYPE: "bullet",
            },
        },
    ],
};
Class.randomGunnerTurret = {
    PARENT: "genericTrret", // FIXED PARENT BRACKETS
    LABEL: "Gunner",
    GUNS: [
        {
            POSITION: [12, 3.5, 1, 0, 7.25, 0, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.puregunner, g.fast]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [12, 3.5, 1, 0, -7.25, 0, 0.75],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.puregunner, g.fast]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [16, 3.5, 1, 0, 3.75, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.puregunner, g.fast]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [16, 3.5, 1, 0, -3.75, 0, 0.25],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.puregunner, g.fast]),
                TYPE: "bullet",
            },
        },
    ],
};
Class.randomNailgunTurret = {
    PARENT: "genericTrret", // FIXED PARENT BRACKETS
    LABEL: "Nailgun",
    GUNS: [
        {
            /*** LENGTH  WIDTH   ASPECT    X       Y     ANGLE   DELAY */
            POSITION: [19, 2, 1, 0, -2.5, 0, 0.25],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    g.basic,
                    g.gunner,
                    g.power,
                    g.twin,
                    g.nail,
                ]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [19, 2, 1, 0, 2.5, 0, 0.75],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    g.basic,
                    g.gunner,
                    g.power,
                    g.twin,
                    g.nail,
                ]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [20, 2, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    g.basic,
                    g.gunner,
                    g.power,
                    g.twin,
                    g.nail,
                ]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [5.5, 7, -1.8, 6.5, 0, 0, 0],
        },
    ],
};
Class.randomRangerTurret = {
    PARENT: "genericTrret", // FIXED PARENT BRACKETS
    LABEL: "Ranger",
    GUNS: [
        {
            /*** LENGTH  WIDTH   ASPECT    X       Y     ANGLE   DELAY */
            POSITION: [32, 8, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.assass]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [5, 8, -1.4, 8, 0, 0, 0],
        },
    ],
};
Class.randomPredatorTurret = {
    PARENT: "genericTrret", // FIXED PARENT BRACKETS
    LABEL: "Predator",
    GUNS: [
        {
            POSITION: [24, 8, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    g.basic,
                    g.sniper,
                    g.hunter,
                    g.hunter2,
                    g.hunter2,
                    g.preda,
                ]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [21, 12, 1, 0, 0, 0, 0.15],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    g.basic,
                    g.sniper,
                    g.hunter,
                    g.hunter2,
                    g.preda,
                ]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [18, 16, 1, 0, 0, 0, 0.3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.hunter, g.preda]),
                TYPE: "bullet",
            },
        },
    ],
};
Class.randomStreamlinerTurret = {
    PARENT: "genericTrret", // FIXED PARENT BRACKETS
    LABEL: "Streamliner",
    GUNS: [
        {
            /*** LENGTH  WIDTH   ASPECT    X       Y     ANGLE   DELAY */
            POSITION: [25, 8, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.mini, g.stream]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [23, 8, 1, 0, 0, 0, 0.2],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.mini, g.stream]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [21, 8, 1, 0, 0, 0, 0.4],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.mini, g.stream]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [19, 8, 1, 0, 0, 0, 0.6],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.mini, g.stream]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [17, 8, 1, 0, 0, 0, 0.8],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.mini, g.stream]),
                TYPE: "bullet",
            },
        },
    ],
};
Class.randomArtilleryTurret = {
    PARENT: "genericTrret", // FIXED PARENT BRACKETS
    LABEL: "Artillery",
    GUNS: [
        {
            POSITION: [17, 3, 1, 0, -6, -7, 0.25],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.gunner, g.arty]),
                TYPE: "bullet",
                LABEL: "Secondary",
            },
        },
        {
            POSITION: [17, 3, 1, 0, 6, 7, 0.75],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.gunner, g.arty]),
                TYPE: "bullet",
                LABEL: "Secondary",
            },
        },
        {
            POSITION: [19, 12, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.arty]),
                TYPE: "bullet",
                LABEL: "Heavy",
            },
        },
    ],
};
Class.randomMortarTurret = {
    PARENT: "genericTrret", // FIXED PARENT BRACKETS
    LABEL: "Mortar",
    GUNS: [
        {
            POSITION: [13, 3, 1, 0, -8, -7, 0.6],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.gunner, g.arty, g.twin]),
                TYPE: "bullet",
                LABEL: "Secondary",
            },
        },
        {
            POSITION: [13, 3, 1, 0, 8, 7, 0.8],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.gunner, g.arty, g.twin]),
                TYPE: "bullet",
                LABEL: "Secondary",
            },
        },
        {
            POSITION: [17, 3, 1, 0, -6, -7, 0.2],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.gunner, g.arty, g.twin]),
                TYPE: "bullet",
                LABEL: "Secondary",
            },
        },
        {
            POSITION: [17, 3, 1, 0, 6, 7, 0.4],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.gunner, g.arty, g.twin]),
                TYPE: "bullet",
                LABEL: "Secondary",
            },
        },
        {
            POSITION: [19, 12, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.arty]),
                TYPE: "bullet",
                LABEL: "Heavy",
            },
        },
    ],
};
Class.randomOrdnanceTurret = {
    PARENT: "genericTrret", // FIXED PARENT BRACKETS
    LABEL: "Ordnance",
    GUNS: [
        {
            /*** LENGTH  WIDTH   ASPECT    X       Y     ANGLE   DELAY */
            POSITION: [17, 3, 1, 0, -5.75, -6, 0.25],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.gunner, g.arty]),
                TYPE: "bullet",
                LABEL: "Secondary",
            },
        },
        {
            POSITION: [17, 3, 1, 0, 5.75, 6, 0.75],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.gunner, g.arty]),
                TYPE: "bullet",
                LABEL: "Secondary",
            },
        },
        {
            POSITION: [24, 8, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.hunter, g.hunter2]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [21, 11, 1, 0, 0, 0, 0.25],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.hunter]),
                TYPE: "bullet",
            },
        },
    ],
};
Class.randomBeekeeperTurret = {
    PARENT: "genericTrret", // FIXED PARENT BRACKETS
    LABEL: "Beekeeper",
    GUNS: [
        {
            /*** LENGTH  WIDTH   ASPECT    X       Y     ANGLE   DELAY */
            POSITION: [14, 3, 1, 0, -6, -7, 0.25],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.swarm, g.bees]),
                TYPE: ["bee", { INDEPENDENT: true }],
                SYNCS_SKILLS: true,
                STAT_CALCULATOR: gunCalcNames.drone,
                WAIT_TO_CYCLE: true,
                LABEL: "Secondary",
            },
        },
        {
            POSITION: [14, 3, 1, 0, 6, 7, 0.75],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.swarm, g.bees]),
                TYPE: ["bee", { INDEPENDENT: true }],
                SYNCS_SKILLS: true,
                STAT_CALCULATOR: gunCalcNames.drone,
                WAIT_TO_CYCLE: true,
                LABEL: "Secondary",
            },
        },
        {
            POSITION: [19, 12, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.arty]),
                TYPE: "bullet",
                LABEL: "Heavy",
            },
        },
    ],
};
Class.randomFieldGunTurret = {
    PARENT: "genericTrret", // FIXED PARENT BRACKETS
    LABEL: "Field Gun",
    GUNS: [
        {
            /*** LENGTH  WIDTH   ASPECT    X       Y     ANGLE   DELAY */
            POSITION: [15, 3, 1, 0, -6, -7, 0.25],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.gunner, g.arty]),
                TYPE: "bullet",
                LABEL: "Secondary",
            },
        },
        {
            POSITION: [15, 3, 1, 0, 6, 7, 0.75],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.gunner, g.arty]),
                TYPE: "bullet",
                LABEL: "Secondary",
            },
        },
        {
            /*** LENGTH  WIDTH   ASPECT    X       Y     ANGLE   DELAY */
            POSITION: [10, 9, 1, 9, 0, 0, 0],
        },
        {
            POSITION: [17, 13, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.arty, g.arty]),
                TYPE: "minimissile",
                STAT_CALCULATOR: gunCalcNames.sustained,
            },
        },
    ],
};
Class.randomSprayerTurret = {
    PARENT: "genericTrret", // FIXED PARENT BRACKETS
    LABEL: "Sprayer",
    GUNS: [
        {
            POSITION: [23, 7, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    g.basic,
                    g.gunner,
                    g.lowpower,
                    g.mach,
                    g.morerecoil,
                ]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [12, 10, 1.4, 8, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.mach]),
                TYPE: "bullet",
            },
        },
    ],
};
Class.randomRedistributorTurret = {
    PARENT: "genericTrret", // FIXED PARENT BRACKETS
    LABEL: "Redistributor",
    GUNS: [
        {
            POSITION: [26, 7, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    g.basic,
                    g.gunner,
                    g.lowpower,
                    g.mach,
                    g.morerecoil,
                ]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [23, 10, 1, 0, 0, 0, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    g.basic,
                    g.gunner,
                    g.lowpower,
                    g.mach,
                    g.morerecoil,
                ]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [12, 10, 1.4, 8, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.mach]),
                TYPE: "bullet",
            },
        },
    ],
};
Class.randomAtomizerTurret = {
    PARENT: "genericTrret", // FIXED PARENT BRACKETS
    LABEL: "Atomizer",
    GUNS: [
        {
            POSITION: [5, 7.5, 1.3, 18.5, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    g.basic,
                    g.gunner,
                    g.lowpower,
                    g.mach,
                    g.morerecoil,
                    g.atomizer,
                ]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [12, 10, 1.4, 8, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.mach]),
                TYPE: "bullet",
            },
        },
    ],
};
Class.randomFocalTurret = {
    PARENT: "genericTrret", // FIXED PARENT BRACKETS
    LABEL: "Focal",
    GUNS: [
        {
            POSITION: [25, 7, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    g.basic,
                    g.gunner,
                    g.lowpower,
                    g.mach,
                    g.morerecoil,
                ]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [14, 10, 1.3, 8, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.mach, g.chain]),
                TYPE: "bullet",
            },
        },
    ],
};
Class.randomShotgunTurret = {
    PARENT: "genericTrret", // FIXED PARENT BRACKETS
    LABEL: "Shotgun",
    GUNS: [
        {
            POSITION: [4, 3, 1, 11, -3, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.mach, g.shotgun]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [4, 3, 1, 11, 3, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.mach, g.shotgun]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [4, 4, 1, 13, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.mach, g.shotgun]),
                TYPE: "casing",
            },
        },
        {
            POSITION: [1, 4, 1, 12, -1, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.mach, g.shotgun]),
                TYPE: "casing",
            },
        },
        {
            POSITION: [1, 4, 1, 11, 1, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.mach, g.shotgun]),
                TYPE: "casing",
            },
        },
        {
            POSITION: [1, 3, 1, 13, -1, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.mach, g.shotgun]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [1, 3, 1, 13, 1, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.mach, g.shotgun]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [1, 2, 1, 13, 2, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.mach, g.shotgun]),
                TYPE: "casing",
            },
        },
        {
            POSITION: [1, 2, 1, 13, -2, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.mach, g.shotgun]),
                TYPE: "casing",
            },
        },
        {
            POSITION: [15, 14, 1, 6, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.mach, g.shotgun, g.fake]),
                TYPE: "casing",
            },
        },
        {
            POSITION: [8, 14, -1.3, 4, 0, 0, 0],
        },
    ],
};
Class.randomDestroyerTurret = {
    PARENT: "genericTrret", // FIXED PARENT BRACKETS
    LABEL: "Destroyer",
    GUNS: [
        {
            POSITION: [21, 14, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.destroy]),
                TYPE: "bullet",
            },
        },
    ],
};
Class.randomAnnihilatorTurret = {
    PARENT: "genericTrret", // FIXED PARENT BRACKETS
    LABEL: "Annihilator",
    GUNS: [
        {
            POSITION: [20.5, 19.5, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.destroy, g.anni]),
                TYPE: "bullet",
            },
        },
    ],
};

const turretTypes = ["randomSkimmerTurret", "randomTwisterTurret", "randomSwarmerTurret", "randomRocketeerTurret", "randomSidewinderTurret", "randomPentaShotTurret", "randomSpreadshotTurret", "randomGunnerTurret", "randomNailgunTurret", "randomRangerTurret", "randomPredatorTurret", "randomStreamlinerTurret", "randomArtilleryTurret", "randomMortarTurret", "randomOrdnanceTurret", "randomBeekeeperTurret", "randomFieldGunTurret", "randomSprayerTurret", "randomRedistributorTurret", "randomAtomizerTurret", "randomFocalTurret", "randomShotgunTurret", "randomDestroyerTurret"];
const randomTurrets = turretTypes[Math.floor(Math.random() * turretTypes.length)];

Class.randomCelestialUpperBody = {
    LABEL: "",
    CONTROLLERS: [["spin", { independent: true, speed: 0.05 }]],
    AUTOSPIN: true,
    COLOR: `#${randomCharacter1 + randomCharacter2 + randomCharacter3 + randomCharacter4 + randomCharacter5 + randomCharacter6}`,
    SIZE: 100,
    SKILL: [9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
    MAX_CHILDREN: 28,
    SHAPE: 5,
    INDEPENDENT: true,
    TURRETS: [
        {
            /********* SIZE         X             Y         ANGLE        ARC */
            POSITION: [10, 7.5, 0, 35, 160, 0],
            TYPE: randomTurrets,
        },
        {
            POSITION: [10, 7.5, 0, 110, 160, 0],
            TYPE: randomTurrets,
        },
        {
            POSITION: [10, 7.5, 0, 180, 160, 0],
            TYPE: randomTurrets,
        },
        {
            POSITION: [10, 7.5, 0, 252, 160, 0],
            TYPE: randomTurrets,
        },
        {
            POSITION: [10, 7.5, 0, 325, 160, 0],
            TYPE: randomTurrets,
        },
    ],
};

Class.randomCelestial = {
    PARENT: "miniboss", // CHANGED FROM ["celestial"] SO IT ACTUALLY SPAWNS AND HAS BOSS PROPERTIES
    NAME: randomName,
    UPGRADE_LABEL: "Random Celestial",
    COLOR: `#${randomCharacter1 + randomCharacter2 + randomCharacter3 + randomCharacter4 + randomCharacter5 + randomCharacter6}`,
    UPGRADE_COLOR: `#${randomCharacter1 + randomCharacter2 + randomCharacter3 + randomCharacter4 + randomCharacter5 + randomCharacter6}`,
    TURRETS: [
        {
            /********* SIZE         X             Y         ANGLE        ARC */
            POSITION: [6.5, 9, 0, 260, 180, 0],
            TYPE: ["baseTrapTurret", { INDEPENDENT: true }],
        },
        {
            POSITION: [6.5, 9, 0, 219, 180, 0],
            TYPE: ["baseTrapTurret", { INDEPENDENT: true }],
        },
        {
            POSITION: [6.5, 9, 0, 180, 180, 0],
            TYPE: ["baseTrapTurret", { INDEPENDENT: true }],
        },
        {
            POSITION: [6.5, 9, 0, 300, 180, 0],
            TYPE: ["baseTrapTurret", { INDEPENDENT: true }],
        },
        {
            POSITION: [6.5, 9, 0, 339, 180, 0],
            TYPE: ["baseTrapTurret", { INDEPENDENT: true }],
        },
        {
            POSITION: [6.5, 9, 0, 380, 180, 0],
            TYPE: ["baseTrapTurret", { INDEPENDENT: true }],
        },
        {
            POSITION: [6.5, 9, 0, 420, 180, 0],
            TYPE: ["baseTrapTurret", { INDEPENDENT: true }],
        },
        {
            POSITION: [6.5, 9, 0, 459, 180, 0],
            TYPE: ["baseTrapTurret", { INDEPENDENT: true }],
        },
        {
            POSITION: [6.5, 9, 0, 500, 180, 0],
            TYPE: ["baseTrapTurret", { INDEPENDENT: true }],
        },
        {
            POSITION: [14.94, 0, 0, 0, 360, 1],
            TYPE: "randomCelestialLowerBody", // REMOVED ARRAY BRACKETS
        },
        {
            POSITION: [8.6, 0, 0, 0, 360, 1],
            TYPE: "randomCelestialUpperBody", // REMOVED ARRAY BRACKETS
        },
    ],
};

// Hook into the upgrade tree: try menu_addons first, then addons, then basic
if (Class.menu_addons && Array.isArray(Class.menu_addons.UPGRADES_TIER_0)) {
    Class.menu_addons.UPGRADES_TIER_0.push("randomCelestial");
} else if (Class.addons && Array.isArray(Class.addons.UPGRADES_TIER_0)) {
    Class.addons.UPGRADES_TIER_0.push("randomCelestial");
} else if (Class.basic) {
    if (!Class.basic.UPGRADES_TIER_1) Class.basic.UPGRADES_TIER_1 = [];
    Class.basic.UPGRADES_TIER_1.push("randomCelestial");
}