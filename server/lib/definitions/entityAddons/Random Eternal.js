// ── Random Eternal Addon ──────────────────────────────────────────────────────
// Fixed for open-source-arras (AE0hello/open-source-arras latest).
// Place in: server/lib/definitions/entityAddons/randomEternal.js
// ─────────────────────────────────────────────────────────────────────────────

const { combineStats } = require('../facilitators.js');
const { base } = require('../constants.js');
const g = require('../gunvals.js');

const gunCalcNames = {
    sustained: 'sustained', drone: 'drone', swarm: 'swarm',
    thruster: 'thruster', trap: 'trap',
};

// ── Gunval aliases ────────────────────────────────────────────────────────────
g.anni       = g.anni       || g.annihilator;
g.arty       = g.arty       || g.artillery;
g.assass     = g.assass     || g.assassin;
g.destroy    = g.destroy    || g.destroyer;
g.hunter2    = g.hunter2    || g.hunterSecondary;
g.lowpower   = g.lowpower   || g.lowPower;
g.mach       = g.mach       || g.machineGun;
g.mini       = g.mini       || g.minigun;
g.nail       = g.nail       || g.nailgun;
g.over       = g.over       || g.overseer;
g.pound      = g.pound      || g.pounder;
g.preda      = g.preda      || g.predator;
g.skim       = g.skim       || g.skimmer;
g.spread     = g.spread     || g.spreadshot;
g.spreadmain = g.spreadmain || g.spreadshotMain;
g.stream     = g.stream     || g.streamliner;

g.atomizer      = g.atomizer      || { reload: 0.4, damage: 0.5, pen: 0.8, spray: 1.6, size: 0.8 };
g.bees          = g.bees          || g.bee || { reload: 0.7, damage: 0.85, health: 0.9, size: 0.8 };
g.bent          = g.bent          || { reload: 0.8, damage: 0.9, speed: 0.9 };
g.celeslower    = g.celeslower    || { reload: 1.5, damage: 0.8, health: 0.8 };
g.chain         = g.chain         || { reload: 0.6, damage: 0.7, speed: 1.2, maxSpeed: 1.2 };
g.fast          = g.fast          || { speed: 1.5, maxSpeed: 1.5 };
g.hive          = g.hive          || { reload: 0.5, damage: 0.6, health: 0.8, size: 0.7 };
g.launcher      = g.launcher      || { speed: 0.6, maxSpeed: 1.4, reload: 1.5 };
g.machgun       = g.machgun       || g.machineGun || {};
g.morerecoil    = g.morerecoil    || { recoil: 2 };
g.morespeed     = g.morespeed     || { speed: 1.3, maxSpeed: 1.3 };
g.one_third_reload = g.one_third_reload || { reload: 1/3 };
g.puregunner    = g.puregunner    || g.gunner || { reload: 0.5, damage: 0.7, speed: 1.1, maxSpeed: 1.1 };
g.sidewind      = g.sidewind      || { speed: 0.9, maxSpeed: 0.5, range: 0.7, shudder: 0.2, spray: 0.2 };

// ── Missing type classes ──────────────────────────────────────────────────────
if (!Class.megaMinion)    Class.megaMinion    = { PARENT: 'minion', LABEL: 'Minion', SIZE: 1.3 };
if (!Class.sunchip)       Class.sunchip       = { PARENT: 'drone', LABEL: 'Sunchip',   SHAPE: 4, COLOR: 'gold' };
if (!Class.dorito)        Class.dorito        = { PARENT: 'drone', LABEL: 'Dorito',    SHAPE: 3, COLOR: 'orange' };
if (!Class.demonchip)     Class.demonchip     = { PARENT: 'drone', LABEL: 'Demonchip', SHAPE: 5, COLOR: 'purple' };
if (!Class.waferbread)    Class.waferbread    = { PARENT: 'swarm', LABEL: 'Waferbread',SHAPE: 4, COLOR: 'gold', BODY: { SIZE: 0.5 } };
if (!Class.spinmissile)   Class.spinmissile   = { PARENT: 'missile', LABEL: 'Spinmissile',
    CONTROLLERS: [['spin', {speed: 0.12}]],
    GUNS: [{ POSITION: [14, 8, 1, 0, 0, 180, 0], PROPERTIES: { AUTOFIRE: true,
        SHOOT_SETTINGS: combineStats([g.basic, g.lowPower]), TYPE: 'bullet', STAT_CALCULATOR: 'thruster' } }] };
if (!Class.rocketeerMissile) Class.rocketeerMissile = { PARENT: 'missile', LABEL: 'Rocket',
    GUNS: [{ POSITION: [16, 10, 1.5, 0, 0, 180, 0], PROPERTIES: { AUTOFIRE: true,
        SHOOT_SETTINGS: combineStats([g.basic, g.lowPower, {reload:0.5,recoil:1.4,spray:10}]),
        TYPE: 'bullet', STAT_CALCULATOR: 'thruster' } }] };
if (!Class.snake)         Class.snake         = { PARENT: 'missile', LABEL: 'Snake',
    GUNS: [
        { POSITION: [6, 12, 1.4, 8, 0, 180, 0], PROPERTIES: { AUTOFIRE: true, SHOOT_SETTINGS: combineStats([g.basic, g.lowPower, {speed:0.15,maxSpeed:0.15,range:0.5}]), TYPE: 'bullet', STAT_CALCULATOR: 'thruster' } },
        { POSITION: [10, 12, 0.8, 8, 0, 180, 0.5], PROPERTIES: { AUTOFIRE: true, NEGATIVE_RECOIL: true, SHOOT_SETTINGS: combineStats([g.basic, g.lowPower, {speed:0.15,maxSpeed:0.15,range:0.5}]), TYPE: 'bullet', STAT_CALCULATOR: 'thruster' } },
    ] };
if (!Class.baseTrapTurret) Class.baseTrapTurret = {
    PARENT: 'genericTank', LABEL: '', INDEPENDENT: true, BODY: { FOV: 2 },
    CONTROLLERS: ['canRepel','onlyAcceptInArc','mapAltToFire','nearestDifferentMaster'], COLOR: 16,
    GUNS: [
        { POSITION: [15, 8, 1, 0, 0, 0, 0] },
        { POSITION: [3, 8, 1.7, 15, 0, 0, 0], PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.trap, {health:1.3, speed:1.2, size:1.1}]),
            TYPE: 'trap', STAT_CALCULATOR: 'trap' } },
    ] };

// ── Random name and color ─────────────────────────────────────────────────────
const names = ["Zeus","Odin","Ra","Apollo","Athena","Thor","Shiva","Vishnu","Baal","Anubis","Horus","Isis","Poseidon","Ares","Hera","Dionysus","Demeter","Hephaestus","Hermes","Hades","Jupiter","Mars","Venus","Minerva","Mercury","Neptune","Janus","Juno","Saturn","Pluto","Ceres","Loki","Freya","Brahma","Ganesh","Indra","Lakshmi","Kali","Quetzalcoatl","Tezcatlipoca","Tlaloc","Pachamama","Inti","Viracocha","Marduk","Enlil","Inanna","Tiamat","Ereshkigal","Ishtar","Amaterasu","Susanoo","Tsukuyomi","Izanagi","Izanami","Fujin","Raijin","Benten","Hachiman","Morrigan","Dagda","Lugh","Brigid","Danu","Cernunnos","Taranis","Balder","Frigg","Skadi","Njord","Frey","Freyja","Set","Thoth","Bastet","Sekhmet","Ptah","Sobek","Nut","Geb","Osiris","Enki","Nanna","Dumuzi","Ninurta","Boreas","Zephyrus","Thanatos","Hypnos","Selene","Helios","Eos","Pan","Hecate","Eris","Tyche"];
const randomName = names[Math.floor(Math.random() * names.length)];
const hex = () => "123456789ABCDEF"[Math.floor(Math.random() * 15)];
const randomColor = `#${hex()}${hex()}${hex()}${hex()}${hex()}${hex()}`;

// ── Drone types for the lower body ───────────────────────────────────────────
const regularDronesE    = Array(9).fill().map((_, i) => ({POSITION: [3.6, 6*0.8, 1.4, 8, 0, (360/9)*(i+0.5), 0], PROPERTIES: {SHOOT_SETTINGS: combineStats([g.drone, g.over]), TYPE: ['drone', {INDEPENDENT: true}], AUTOFIRE: true, SYNCS_SKILLS: true, WAIT_TO_CYCLE: true, MAX_CHILDREN: 4}}));
const machineGunDronesE = Array(9).fill().map((_, i) => ({POSITION: [3.6, 5.25*0.8, 1.775, 8, 0, (360/9)*(i+0.5), 0], PROPERTIES: {SHOOT_SETTINGS: combineStats([g.drone, g.over, g.mach, {reload:0.75,damage:0.7}]), TYPE: ['drone', {INDEPENDENT: true}], AUTOFIRE: true, SYNCS_SKILLS: true, WAIT_TO_CYCLE: true, MAX_CHILDREN: 6}}));
const sniperDronesE     = Array(9).fill().map((_, i) => ({POSITION: [4.45, 5.75*0.8, 1.4, 8, 0, (360/9)*(i+0.5), 0], PROPERTIES: {SHOOT_SETTINGS: combineStats([g.drone, g.over, g.sniper]), TYPE: ['drone', {INDEPENDENT: true}], AUTOFIRE: true, SYNCS_SKILLS: true, WAIT_TO_CYCLE: true, MAX_CHILDREN: 3}}));
const pounderDronesE    = Array(9).fill().map((_, i) => ({POSITION: [3.6, 6.5*0.8, 1.2, 8, 0, (360/9)*(i+0.5), 0], PROPERTIES: {SHOOT_SETTINGS: combineStats([g.drone, g.over, g.pound]), TYPE: ['drone', {INDEPENDENT: true}], AUTOFIRE: true, SYNCS_SKILLS: true, WAIT_TO_CYCLE: true, MAX_CHILDREN: 3}}));
const eggDronesE        = Array(9).fill().map((_, i) => ({POSITION: [2.6, 5*0.8, 1.4, 9.5, 0, (360/9)*(i+0.5), 0], PROPERTIES: {SHOOT_SETTINGS: combineStats([g.drone, g.summoner, g.mach, {size:0.4,spray:150,speed:2,shudder:1.75}]), TYPE: ['waferbread', {INDEPENDENT: true}], AUTOFIRE: true, SYNCS_SKILLS: true, WAIT_TO_CYCLE: true, MAX_CHILDREN: 7}}));
const squareDronesE     = Array(9).fill().map((_, i) => ({POSITION: [2.6, 5*0.8, 1.4, 9.5, 0, (360/9)*(i+0.5), 0], PROPERTIES: {SHOOT_SETTINGS: combineStats([g.drone, g.summoner, {size:0.8}]), TYPE: ['sunchip', {INDEPENDENT: true}], AUTOFIRE: true, SYNCS_SKILLS: true, WAIT_TO_CYCLE: true, MAX_CHILDREN: 4}}));
const triangleDronesE   = Array(9).fill().map((_, i) => ({POSITION: [2.6, 5*0.8, 1.4, 9.5, 0, (360/9)*(i+0.5), 0], PROPERTIES: {SHOOT_SETTINGS: combineStats([g.drone, g.summoner, {size:0.9}]), TYPE: ['dorito', {INDEPENDENT: true}], AUTOFIRE: true, SYNCS_SKILLS: true, WAIT_TO_CYCLE: true, MAX_CHILDREN: 3}}));
const pentagonDronesE   = Array(9).fill().map((_, i) => ({POSITION: [2.6, 5*0.8, 1.4, 9.5, 0, (360/9)*(i+0.5), 0], PROPERTIES: {SHOOT_SETTINGS: combineStats([g.drone, g.summoner, g.destroy]), TYPE: ['demonchip', {INDEPENDENT: true}], AUTOFIRE: true, SYNCS_SKILLS: true, WAIT_TO_CYCLE: true, MAX_CHILDREN: 2}}));
const regularMinionsE   = Array(9).fill().map((_, i) => ({POSITION: [3.6, 7*0.8, -1.4, 8, 0, (360/9)*(i+0.5), 0], PROPERTIES: {SHOOT_SETTINGS: combineStats([g.spawner, g.celeslower]), TYPE: ['minion', {INDEPENDENT: true}], AUTOFIRE: true, SYNCS_SKILLS: true, WAIT_TO_CYCLE: true, MAX_CHILDREN: 3}}));
const pounderMinionsE   = Array(9).fill().map((_, i) => ({POSITION: [3.6, 8*0.8, -1.2, 8, 0, (360/9)*(i+0.5), 0], PROPERTIES: {SHOOT_SETTINGS: combineStats([g.spawner, g.celeslower, g.pound]), TYPE: ['megaMinion', {INDEPENDENT: true}], AUTOFIRE: true, SYNCS_SKILLS: true, WAIT_TO_CYCLE: true, MAX_CHILDREN: 3}}));

const droneTypesE = [regularDronesE, machineGunDronesE, sniperDronesE, pounderDronesE, eggDronesE, squareDronesE, triangleDronesE, pentagonDronesE, regularMinionsE, pounderMinionsE];
const randomDronesE = droneTypesE[Math.floor(Math.random() * droneTypesE.length)];

// ── Turret library (same as terrestrial) ─────────────────────────────────────
// Only define if not already defined by randomTerrestrial loaded first
if (!Class.genericTrret) Class.genericTrret = {
    PARENT: ['genericTank'], LABEL: '', BODY: { FOV: 2 },
    CONTROLLERS: ['canRepel','onlyAcceptInArc','mapAltToFire','nearestDifferentMaster'], COLOR: 16,
};
if (!Class.randomSkimmerTurret)      Class.randomSkimmerTurret      = { PARENT: ['genericTrret'], LABEL: 'Skimmer',       GUNS: [{ POSITION: [10, 14, -0.5, 9, 0, 0, 0] }, { POSITION: [17, 15, 1, 0, 0, 0, 0], PROPERTIES: { SHOOT_SETTINGS: combineStats([g.basic, g.pound, g.arty, g.arty, g.skim]), TYPE: 'missile', STAT_CALCULATOR: gunCalcNames.sustained } }] };
if (!Class.randomTwisterTurret)      Class.randomTwisterTurret      = { PARENT: ['genericTrret'], LABEL: 'Twister',       GUNS: [{ POSITION: [10, 13, -0.5, 9, 0, 0, 0] }, { POSITION: [17, 14, -1.4, 0, 0, 0, 0], PROPERTIES: { SHOOT_SETTINGS: combineStats([g.basic, g.pound, g.arty, g.arty, g.skim, g.morespeed, g.one_third_reload]), TYPE: 'spinmissile', STAT_CALCULATOR: gunCalcNames.sustained } }] };
if (!Class.randomSwarmerTurret)      Class.randomSwarmerTurret      = { PARENT: ['genericTrret'], LABEL: 'Swarmer',       GUNS: [{ POSITION: [14, 14, -1.2, 5, 0, 0, 0], PROPERTIES: { SHOOT_SETTINGS: combineStats([g.basic, g.pound, g.destroy, g.hive]), TYPE: 'hive' } }, { POSITION: [15, 12, 1, 5, 0, 0, 0] }] };
if (!Class.randomRocketeerTurret)    Class.randomRocketeerTurret    = { PARENT: ['genericTrret'], LABEL: 'Rocketeer',     GUNS: [{ POSITION: [10, 12.5, -0.7, 10, 0, 0, 0], PROPERTIES: { SHOOT_SETTINGS: combineStats([g.basic, g.pound, g.launcher, g.rocketeer]), TYPE: 'rocketeerMissile', STAT_CALCULATOR: gunCalcNames.sustained } }, { POSITION: [17, 18, 0.65, 0, 0, 0, 0] }] };
if (!Class.randomSidewinderTurret)   Class.randomSidewinderTurret   = { PARENT: ['genericTrret'], LABEL: 'Sidewinder',    GUNS: [{ POSITION: [10, 11, -0.5, 14, 0, 0, 0] }, { POSITION: [21, 12, -1.1, 0, 0, 0, 0], PROPERTIES: { SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.hunter, g.sidewind]), TYPE: 'snake', STAT_CALCULATOR: gunCalcNames.sustained } }] };
if (!Class.randomGunnerTurret)       Class.randomGunnerTurret       = { PARENT: ['genericTrret'], LABEL: 'Gunner',        GUNS: [{ POSITION: [12, 3.5, 1, 0, 7.25, 0, 0.5], PROPERTIES: { SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.puregunner, g.fast]), TYPE: 'bullet' } }, { POSITION: [12, 3.5, 1, 0, -7.25, 0, 0.75], PROPERTIES: { SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.puregunner, g.fast]), TYPE: 'bullet' } }, { POSITION: [16, 3.5, 1, 0, 3.75, 0, 0], PROPERTIES: { SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.puregunner, g.fast]), TYPE: 'bullet' } }, { POSITION: [16, 3.5, 1, 0, -3.75, 0, 0.25], PROPERTIES: { SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.puregunner, g.fast]), TYPE: 'bullet' } }] };
if (!Class.randomDestroyerTurret)    Class.randomDestroyerTurret    = { PARENT: ['genericTrret'], LABEL: 'Destroyer',     GUNS: [{ POSITION: [21, 14, 1, 0, 0, 0, 0], PROPERTIES: { SHOOT_SETTINGS: combineStats([g.basic, g.pound, g.destroy]), TYPE: 'bullet' } }] };
if (!Class.randomAnnihilatorTurret)  Class.randomAnnihilatorTurret  = { PARENT: ['genericTrret'], LABEL: 'Annihilator',   GUNS: [{ POSITION: [20.5, 19.5, 1, 0, 0, 0, 0], PROPERTIES: { SHOOT_SETTINGS: combineStats([g.basic, g.pound, g.destroy, g.anni]), TYPE: 'bullet' } }] };
// (All other turret types loaded from randomTerrestrial if loaded first, or defined there)
// Ensure they exist with fallback
const _t = (n, d) => { if (!Class[n]) Class[n] = d; };
_t('randomNailgunTurret',       { PARENT: ['genericTrret'], LABEL: 'Nailgun',       GUNS: [{ POSITION: [20, 3, 1, 0, 0, 0, 0], PROPERTIES: { SHOOT_SETTINGS: combineStats([g.basic, g.gunner, g.power, g.twin, g.nail]), TYPE: 'bullet' } }] });
_t('randomRangerTurret',        { PARENT: ['genericTrret'], LABEL: 'Ranger',         GUNS: [{ POSITION: [32, 8, 1, 0, 0, 0, 0], PROPERTIES: { SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.assass]), TYPE: 'bullet' } }, { POSITION: [5, 8, -1.4, 8, 0, 0, 0] }] });
_t('randomPredatorTurret',      { PARENT: ['genericTrret'], LABEL: 'Predator',       GUNS: [{ POSITION: [24, 8, 1, 0, 0, 0, 0], PROPERTIES: { SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.hunter, g.hunter2, g.hunter2, g.preda]), TYPE: 'bullet' } }, { POSITION: [21, 12, 1, 0, 0, 0, 0.15], PROPERTIES: { SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.hunter, g.preda]), TYPE: 'bullet' } }] });
_t('randomStreamlinerTurret',   { PARENT: ['genericTrret'], LABEL: 'Streamliner',    GUNS: [{ POSITION: [25, 8, 1, 0, 0, 0, 0], PROPERTIES: { SHOOT_SETTINGS: combineStats([g.basic, g.mini, g.stream]), TYPE: 'bullet' } }, { POSITION: [23, 8, 1, 0, 0, 0, 0.2], PROPERTIES: { SHOOT_SETTINGS: combineStats([g.basic, g.mini, g.stream]), TYPE: 'bullet' } }] });
_t('randomArtilleryTurret',     { PARENT: ['genericTrret'], LABEL: 'Artillery',      GUNS: [{ POSITION: [17, 3, 1, 0, -6, -7, 0.25], PROPERTIES: { SHOOT_SETTINGS: combineStats([g.basic, g.gunner, g.arty]), TYPE: 'bullet' } }, { POSITION: [19, 12, 1, 0, 0, 0, 0], PROPERTIES: { SHOOT_SETTINGS: combineStats([g.basic, g.pound, g.arty]), TYPE: 'bullet' } }] });
_t('randomMortarTurret',        { PARENT: ['genericTrret'], LABEL: 'Mortar',         GUNS: [{ POSITION: [19, 12, 1, 0, 0, 0, 0], PROPERTIES: { SHOOT_SETTINGS: combineStats([g.basic, g.pound, g.arty]), TYPE: 'bullet' } }] });
_t('randomOrdnanceTurret',      { PARENT: ['genericTrret'], LABEL: 'Ordnance',       GUNS: [{ POSITION: [24, 8, 1, 0, 0, 0, 0], PROPERTIES: { SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.hunter, g.hunter2]), TYPE: 'bullet' } }] });
_t('randomBeekeeperTurret',     { PARENT: ['genericTrret'], LABEL: 'Beekeeper',      GUNS: [{ POSITION: [14, 3, 1, 0, -6, -7, 0.25], PROPERTIES: { SHOOT_SETTINGS: combineStats([g.swarm, g.bees]), TYPE: ['bee', {INDEPENDENT:true}], SYNCS_SKILLS: true, STAT_CALCULATOR: 'drone', WAIT_TO_CYCLE: true } }, { POSITION: [19, 12, 1, 0, 0, 0, 0], PROPERTIES: { SHOOT_SETTINGS: combineStats([g.basic, g.pound, g.arty]), TYPE: 'bullet' } }] });
_t('randomFieldGunTurret',      { PARENT: ['genericTrret'], LABEL: 'Field Gun',      GUNS: [{ POSITION: [10, 9, 1, 9, 0, 0, 0] }, { POSITION: [17, 13, 1, 0, 0, 0, 0], PROPERTIES: { SHOOT_SETTINGS: combineStats([g.basic, g.pound, g.arty, g.arty]), TYPE: 'minimissile', STAT_CALCULATOR: 'sustained' } }] });
_t('randomSprayerTurret',       { PARENT: ['genericTrret'], LABEL: 'Sprayer',        GUNS: [{ POSITION: [23, 7, 1, 0, 0, 0, 0], PROPERTIES: { SHOOT_SETTINGS: combineStats([g.basic, g.gunner, g.lowpower, g.mach, g.morerecoil]), TYPE: 'bullet' } }, { POSITION: [12, 10, 1.4, 8, 0, 0, 0], PROPERTIES: { SHOOT_SETTINGS: combineStats([g.basic, g.mach]), TYPE: 'bullet' } }] });
_t('randomRedistributorTurret', { PARENT: ['genericTrret'], LABEL: 'Redistributor',  GUNS: [{ POSITION: [26, 7, 1, 0, 0, 0, 0], PROPERTIES: { SHOOT_SETTINGS: combineStats([g.basic, g.gunner, g.lowpower, g.mach, g.morerecoil]), TYPE: 'bullet' } }, { POSITION: [12, 10, 1.4, 8, 0, 0, 0], PROPERTIES: { SHOOT_SETTINGS: combineStats([g.basic, g.mach]), TYPE: 'bullet' } }] });
_t('randomAtomizerTurret',      { PARENT: ['genericTrret'], LABEL: 'Atomizer',       GUNS: [{ POSITION: [5, 7.5, 1.3, 18.5, 0, 0, 0], PROPERTIES: { SHOOT_SETTINGS: combineStats([g.basic, g.gunner, g.lowpower, g.mach, g.morerecoil, g.atomizer]), TYPE: 'bullet' } }, { POSITION: [12, 10, 1.4, 8, 0, 0, 0], PROPERTIES: { SHOOT_SETTINGS: combineStats([g.basic, g.mach]), TYPE: 'bullet' } }] });
_t('randomFocalTurret',         { PARENT: ['genericTrret'], LABEL: 'Focal',          GUNS: [{ POSITION: [25, 7, 1, 0, 0, 0, 0], PROPERTIES: { SHOOT_SETTINGS: combineStats([g.basic, g.gunner, g.lowpower, g.mach, g.morerecoil]), TYPE: 'bullet' } }, { POSITION: [14, 10, 1.3, 8, 0, 0, 0], PROPERTIES: { SHOOT_SETTINGS: combineStats([g.basic, g.mach, g.chain]), TYPE: 'bullet' } }] });
_t('randomShotgunTurret',       { PARENT: ['genericTrret'], LABEL: 'Shotgun',        GUNS: [{ POSITION: [4, 3, 1, 11, -3, 0, 0], PROPERTIES: { SHOOT_SETTINGS: combineStats([g.basic, g.mach, g.shotgun]), TYPE: 'bullet' } }, { POSITION: [4, 3, 1, 11, 3, 0, 0], PROPERTIES: { SHOOT_SETTINGS: combineStats([g.basic, g.mach, g.shotgun]), TYPE: 'bullet' } }, { POSITION: [15, 14, 1, 6, 0, 0, 0], PROPERTIES: { SHOOT_SETTINGS: combineStats([g.basic, g.mach, g.shotgun, g.fake]), TYPE: 'casing' } }] });
_t('randomPentaShotTurret',     { PARENT: ['genericTrret'], LABEL: 'Penta Shot',     GUNS: [{ POSITION: [16, 8, 1, 0, -3, -30, 0.667], PROPERTIES: { SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.bent]), TYPE: 'bullet' } }, { POSITION: [16, 8, 1, 0, 3, 30, 0.667], PROPERTIES: { SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.bent]), TYPE: 'bullet' } }, { POSITION: [22, 8, 1, 0, 0, 0, 0], PROPERTIES: { SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.bent]), TYPE: 'bullet' } }] });
_t('randomSpreadshotTurret',    Class.randomSpreadshotTurret || { PARENT: ['genericTrret'], LABEL: 'Spreadshot', GUNS: [{ POSITION: [12, 8, 1, 8, 0, 0, 0], PROPERTIES: { SHOOT_SETTINGS: combineStats([g.basic, g.pound, g.spreadmain, g.spread]), TYPE: 'bullet' } }] });

const turretTypesE = ["randomSkimmerTurret","randomTwisterTurret","randomSwarmerTurret","randomRocketeerTurret","randomSidewinderTurret","randomPentaShotTurret","randomSpreadshotTurret","randomGunnerTurret","randomNailgunTurret","randomRangerTurret","randomPredatorTurret","randomStreamlinerTurret","randomArtilleryTurret","randomMortarTurret","randomOrdnanceTurret","randomBeekeeperTurret","randomFieldGunTurret","randomSprayerTurret","randomRedistributorTurret","randomAtomizerTurret","randomFocalTurret","randomShotgunTurret","randomDestroyerTurret"];
const randomTurretsE  = turretTypesE[Math.floor(Math.random() * turretTypesE.length)];
const randomTurretsE2 = turretTypesE[Math.floor(Math.random() * turretTypesE.length)];

// ── Body layers ───────────────────────────────────────────────────────────────
Class.randomEternalLowerBody = {
    LABEL: '', CONTROLLERS: [['spin', {independent: true, speed: -0.05}]],
    COLOR: randomColor, SIZE: 100, SKILL: [9,9,9,9,9,9,9,9,9,9],
    SHAPE: 9, FOV: 1, FACING_TYPE: 'autospin', MAX_CHILDREN: 35, INDEPENDENT: true,
    GUNS: randomDronesE,
};
Class.randomEternalMiddleBody = {
    LABEL: '', CONTROLLERS: [['spin', {independent: true, speed: 0.05}]],
    AUTOSPIN: true, COLOR: randomColor, SIZE: 100, SKILL: [9,9,9,9,9,9,9,9,9,9],
    MAX_CHILDREN: 28, SHAPE: 7, INDEPENDENT: true, TURRETS: [],
};
for (let i = 0; i < 7; i++) {
    Class.randomEternalMiddleBody.TURRETS.push({
        POSITION: [7, 8.5, 0, 360/7*(i+0.5), 160, 0],
        TYPE: [randomTurretsE, {INDEPENDENT: true}],
    });
}
Class.randomEternalUpperBody = {
    LABEL: '', CONTROLLERS: [['spin', {independent: true, speed: -0.05}]],
    AUTOSPIN: true, COLOR: randomColor, SIZE: 100, SKILL: [9,9,9,9,9,9,9,9,9,9],
    MAX_CHILDREN: 28, SHAPE: 5, INDEPENDENT: true, TURRETS: [],
};
for (let i = 0; i < 5; i++) {
    Class.randomEternalUpperBody.TURRETS.push({
        POSITION: [8.5, 9, 0, 360/5*(i+0.5), 160, 0],
        TYPE: [randomTurretsE2, {INDEPENDENT: true}],
    });
}

// ── Main class ────────────────────────────────────────────────────────────────
Class.randomEternal = {
    PARENT: ['eternal'],
    NAME: randomName,
    UPGRADE_LABEL: 'Random Eternal',
    COLOR: randomColor,
    UPGRADE_COLOR: randomColor,
    TURRETS: [
        { POSITION: [15.5, 0, 0, 0, 360, 1], TYPE: ['randomEternalLowerBody'] },
        { POSITION: [11,   0, 0, 0, 360, 1], TYPE: ['randomEternalMiddleBody'] },
        { POSITION: [6.5,  0, 0, 0, 360, 1], TYPE: ['randomEternalUpperBody'] },
    ],
};
for (let i = 0; i < 11; i++) {
    Class.randomEternal.TURRETS.push({
        POSITION: [5, 8.5, 0, 360/11*(i+0.5), 180, 0],
        TYPE: ['baseTrapTurret', {INDEPENDENT: true}],
    });
}

// ── Hook into upgrade tree ────────────────────────────────────────────────────
if (Class.menu_addons && Array.isArray(Class.menu_addons.UPGRADES_TIER_0)) {
    Class.menu_addons.UPGRADES_TIER_0.push('randomEternal');
} else if (Class.addons && Array.isArray(Class.addons.UPGRADES_TIER_0)) {
    Class.addons.UPGRADES_TIER_0.push('randomEternal');
} else if (Class.basic) {
    if (!Class.basic.UPGRADES_TIER_1) Class.basic.UPGRADES_TIER_1 = [];
    Class.basic.UPGRADES_TIER_1.push('randomEternal');
}