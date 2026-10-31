const { combineStats, weaponArray, makeTurret } = require('../facilitators.js');
const { base } = require('../constants.js');
const g = require('../gunvals.js');

// if (!Class.CMCSolar)        throw new Error('[SolarsAndAntediluvians] CMCSolar missing — set createSolars=true');
// if (!Class.CMCAntediluvian) throw new Error('[SolarsAndAntediluvians] CMCAntediluvian missing — set createAntediluvian=true');

// ── Gunval thing ────────────────────────────────────────────────────────────
g.pound      = g.pound      || g.pounder;
g.destroy    = g.destroy    || g.destroyer;
g.anni       = g.anni       || g.annihilator;
g.mach       = g.mach       || g.machineGun;
g.mini       = g.mini       || g.minigun;
g.over       = g.over       || g.overseer;
g.stream     = g.stream     || g.streamliner;
g.hunter2    = g.hunter2    || g.hunterSecondary;
g.spread     = g.spread     || g.spreadshot;
g.arty       = g.arty       || g.artillery;
g.skim       = g.skim       || g.skimmer;
g.spreadshotMain = g.spreadshotMain || g.spreadshot;
g.noRecoil   = g.noRecoil   || { recoil: 0 };

const s = (...a) => combineStats(a);

// ─────────────────────────────────────────────────────────────────────────────
// ██  SOLAR WEAPON TURRET CLASSES  ██
// ─────────────────────────────────────────────────────────────────────────────

Class.solarPredatorTurret = {
    PARENT:'autoTurret',LABEL:'Predator',INDEPENDENT:true,BODY:{FOV:base.FOV*5},
    GUNS:[
        {POSITION:[22,8,1,0,0,0,0],   PROPERTIES:{SHOOT_SETTINGS:s(g.basic,g.sniper,g.hunter,g.hunter2,g.hunter2,g.predator,{damage:1.35,health:1.1},g.noRecoil),TYPE:'bullet'}},
        {POSITION:[19,10,1,0,0,0,0.2],PROPERTIES:{SHOOT_SETTINGS:s(g.basic,g.sniper,g.hunter,g.hunter2,g.predator,{damage:1.25},g.noRecoil),TYPE:'bullet'}},
        {POSITION:[16,12,1,0,0,0,0.4],PROPERTIES:{SHOOT_SETTINGS:s(g.basic,g.sniper,g.hunter,g.predator,{damage:1.15},g.noRecoil),TYPE:'bullet'}},
    ],
};
Class.solarStreamlinerTurret = {
    PARENT:'autoTurret',LABEL:'Streamliner',INDEPENDENT:true,BODY:{FOV:base.FOV*4},
    GUNS:[
        {POSITION:[22,8,1,0,0,0,0],  PROPERTIES:{SHOOT_SETTINGS:s(g.basic,g.mini,g.stream,{damage:1.25,health:1.1},g.noRecoil),TYPE:'bullet'}},
        {POSITION:[20,8,1,0,0,0,0.2],PROPERTIES:{SHOOT_SETTINGS:s(g.basic,g.mini,g.stream,{damage:1.25,health:1.1},g.noRecoil),TYPE:'bullet'}},
        {POSITION:[18,8,1,0,0,0,0.4],PROPERTIES:{SHOOT_SETTINGS:s(g.basic,g.mini,g.stream,{damage:1.25,health:1.1},g.noRecoil),TYPE:'bullet'}},
        {POSITION:[16,8,1,0,0,0,0.6],PROPERTIES:{SHOOT_SETTINGS:s(g.basic,g.mini,g.stream,{damage:1.25,health:1.1},g.noRecoil),TYPE:'bullet'}},
        {POSITION:[14,8,1,0,0,0,0.8],PROPERTIES:{SHOOT_SETTINGS:s(g.basic,g.mini,g.stream,{damage:1.25,health:1.1},g.noRecoil),TYPE:'bullet'}},
    ],
};
Class.solarGunnerTurret = {
    PARENT:'autoTurret',LABEL:'Gunner',INDEPENDENT:true,BODY:{FOV:base.FOV*2.5},
    GUNS:[
        {POSITION:[14,3,1,0, 6,0,0],   PROPERTIES:{SHOOT_SETTINGS:s(g.basic,g.twin,g.gunner,{speed:1.4,maxSpeed:1.4,damage:1.2},g.noRecoil),TYPE:'bullet'}},
        {POSITION:[14,3,1,0,-6,0,0.25],PROPERTIES:{SHOOT_SETTINGS:s(g.basic,g.twin,g.gunner,{speed:1.4,maxSpeed:1.4,damage:1.2},g.noRecoil),TYPE:'bullet'}},
        {POSITION:[18,3,1,0, 3,0,0.5], PROPERTIES:{SHOOT_SETTINGS:s(g.basic,g.twin,g.gunner,{speed:1.4,maxSpeed:1.4,damage:1.2},g.noRecoil),TYPE:'bullet'}},
        {POSITION:[18,3,1,0,-3,0,0.75],PROPERTIES:{SHOOT_SETTINGS:s(g.basic,g.twin,g.gunner,{speed:1.4,maxSpeed:1.4,damage:1.2},g.noRecoil),TYPE:'bullet'}},
    ],
};
Class.solarSkimmerTurret = {
    PARENT:'autoTurret',LABEL:'Skimmer',INDEPENDENT:true,BODY:{FOV:base.FOV*4},
    GUNS:[
        {POSITION:[8,18,-0.4,10,0,0,0]},
        {POSITION:[14,16,-0.7,0,0,0,0],PROPERTIES:{SHOOT_SETTINGS:s(g.basic,g.pounder,g.arty,g.arty,g.skim,{damage:1.4,health:1.2},g.noRecoil),TYPE:'missile',STAT_CALCULATOR:'sustained'}},
    ],
};

// Annihilator — single massive slow shell
Class.solarAnniTurret = {
    PARENT:'autoTurret',LABEL:'Annihilator',INDEPENDENT:true,BODY:{FOV:base.FOV*3},
    GUNS:[{POSITION:[18,18,1,0,0,0,0],PROPERTIES:{SHOOT_SETTINGS:s(g.basic,g.pounder,g.destroy,g.anni,{damage:1.5,health:1.3,size:1.1},g.noRecoil),TYPE:'bullet',LABEL:'Annihilator'}}],
};

// Swarm Cloud — 4-direction battleship autoswarms
Class.solarSwarmTurret = {
    PARENT:'autoTurret',LABEL:'Swarm Cloud',INDEPENDENT:true,BODY:{FOV:base.FOV*3},
    GUNS:[
        {POSITION:[0,7,1.1,9,0,  0,0],   PROPERTIES:{SHOOT_SETTINGS:s(g.swarm,g.battleship,{damage:1.3,health:1.2},g.noRecoil),TYPE:['autoswarm',{INDEPENDENT:true}],AUTOFIRE:true,SYNCS_SKILLS:true,STAT_CALCULATOR:'swarm'}},
        {POSITION:[0,7,1.1,9,0, 90,0.25],PROPERTIES:{SHOOT_SETTINGS:s(g.swarm,g.battleship,{damage:1.3,health:1.2},g.noRecoil),TYPE:['autoswarm',{INDEPENDENT:true}],AUTOFIRE:true,SYNCS_SKILLS:true,STAT_CALCULATOR:'swarm'}},
        {POSITION:[0,7,1.1,9,0,180,0.5], PROPERTIES:{SHOOT_SETTINGS:s(g.swarm,g.battleship,{damage:1.3,health:1.2},g.noRecoil),TYPE:['autoswarm',{INDEPENDENT:true}],AUTOFIRE:true,SYNCS_SKILLS:true,STAT_CALCULATOR:'swarm'}},
        {POSITION:[0,7,1.1,9,0,270,0.75],PROPERTIES:{SHOOT_SETTINGS:s(g.swarm,g.battleship,{damage:1.3,health:1.2},g.noRecoil),TYPE:['autoswarm',{INDEPENDENT:true}],AUTOFIRE:true,SYNCS_SKILLS:true,STAT_CALCULATOR:'swarm'}},
    ],
};

// Hive — fires pods that burst into bees on impact
Class.solarHiveHive = { PARENT:'bullet',LABEL:'Solar Hive',BODY:{RANGE:80,FOV:0.5},INDEPENDENT:true,CONTROLLERS:['nearestDifferentMaster','targetSelf'],AI:{NO_LEAD:true},GUNS:weaponArray({POSITION:[5.5,5.5,0.6,5.5,0,0,0],PROPERTIES:{SHOOT_SETTINGS:s(g.swarm,g.hive,g.bee,{damage:1.4,health:1.2}),TYPE:['bee',{PERSISTS_AFTER_DEATH:true}],STAT_CALCULATOR:'swarm',AUTOFIRE:true}},7,1/7) };
Class.solarHiveTurret = {
    PARENT:'autoTurret',LABEL:'Hive',INDEPENDENT:true,BODY:{FOV:base.FOV*3},
    GUNS:[
        {POSITION:[13,13,-1.1,5,0,0,0],PROPERTIES:{SHOOT_SETTINGS:s(g.basic,g.pounder,g.destroy,g.hive,{damage:1.45,health:1.3,range:1.2},g.noRecoil),TYPE:'solarHiveHive',LABEL:'Hive'}},
        {POSITION:[13,11,1,5,0,0,0]},
    ],
};

// Rocketeer — guided rocket launcher
Class.solarRocketeerTurret = {
    PARENT:'autoTurret',LABEL:'Rocketeer',INDEPENDENT:true,BODY:{FOV:base.FOV*3},
    GUNS:[
        {POSITION:[9,11,-0.6,9,0,0,0],PROPERTIES:{SHOOT_SETTINGS:s(g.basic,g.pounder,g.launcher,g.rocketeer,{damage:1.4,health:1.3},g.noRecoil),TYPE:'rocketeerMissile',STAT_CALCULATOR:'sustained'}},
        {POSITION:[15,16,0.6,0,0,0,0]},
    ],
};

// Twister — spin-missile, spirals at target
Class.solarTwisterTurret = {
    PARENT:'autoTurret',LABEL:'Twister',INDEPENDENT:true,BODY:{FOV:base.FOV*4},
    GUNS:[
        {POSITION:[8,16,-0.4,10,0,0,0]},
        {POSITION:[14,14,-1.1,0,0,0,0],PROPERTIES:{SHOOT_SETTINGS:s(g.basic,g.pounder,g.arty,g.arty,g.skim,{speed:0.5,reload:1.4,shudder:0.1,damage:1.3},g.noRecoil),TYPE:'spinmissile',STAT_CALCULATOR:'sustained'}},
    ],
};

// Redistributor — triple machine gun spray with body barrel
Class.solarRedistTurret = {
    PARENT:'autoTurret',LABEL:'Redistributor',INDEPENDENT:true,BODY:{FOV:base.FOV*2.5},
    GUNS:[
        {POSITION:[22,7,1,0,0,0,0.67], PROPERTIES:{SHOOT_SETTINGS:s(g.basic,g.mach,g.lowPower,g.pelleter,{recoil:0.8,damage:1.25},g.noRecoil),TYPE:'bullet'}},
        {POSITION:[19,9,1,0,0,0,0.33], PROPERTIES:{SHOOT_SETTINGS:s(g.basic,g.mach,g.lowPower,g.pelleter,{recoil:0.8,damage:1.25},g.noRecoil),TYPE:'bullet'}},
        {POSITION:[10,9,1.4,7,0,0,0],  PROPERTIES:{SHOOT_SETTINGS:s(g.basic,g.mach,{damage:1.15},g.noRecoil),TYPE:'bullet'}},
    ],
};

// Nailgun — 3 tight nail spikes
Class.solarNailgunTurret = {
    PARENT:'autoTurret',LABEL:'Nailgun',INDEPENDENT:true,BODY:{FOV:base.FOV*3},
    GUNS:[
        {POSITION:[18,2,1,0,-2,0,0.25],PROPERTIES:{SHOOT_SETTINGS:s(g.basic,g.pelleter,g.power,g.twin,g.nailgun,{damage:1.2},g.noRecoil),TYPE:'bullet'}},
        {POSITION:[18,2,1,0, 2,0,0.75],PROPERTIES:{SHOOT_SETTINGS:s(g.basic,g.pelleter,g.power,g.twin,g.nailgun,{damage:1.2},g.noRecoil),TYPE:'bullet'}},
        {POSITION:[19,2,1,0, 0,0,0],   PROPERTIES:{SHOOT_SETTINGS:s(g.basic,g.pelleter,g.power,g.twin,g.nailgun,{damage:1.2},g.noRecoil),TYPE:'bullet'}},
        {POSITION:[5,6,-1.8,5.5,0,0,0]},
    ],
};

// Carrier — guided + autonomous split swarm
Class.solarCarrierTurret = {
    PARENT:'autoTurret',LABEL:'Carrier',INDEPENDENT:true,BODY:{FOV:base.FOV*2.5},
    GUNS:[
        {POSITION:[7,7,0.6,6, 2, 30,0.67],PROPERTIES:{SHOOT_SETTINGS:s(g.swarm,g.battleship,g.carrier,{damage:1.3,health:1.2},g.noRecoil),TYPE:'swarm',   STAT_CALCULATOR:'swarm'}},
        {POSITION:[7,7,0.6,6,-2,-30,0.67],PROPERTIES:{SHOOT_SETTINGS:s(g.swarm,g.battleship,g.carrier,{damage:1.3,health:1.2},g.noRecoil),TYPE:'swarm',   STAT_CALCULATOR:'swarm'}},
        {POSITION:[7,7,0.6,6, 0,  0,0],   PROPERTIES:{SHOOT_SETTINGS:s(g.swarm,g.battleship,g.carrier,{damage:1.2,health:1.1},g.noRecoil),TYPE:'autoswarm',STAT_CALCULATOR:'swarm'}},
    ],
};

// Spreadshot — wide fan of bullets
Class.solarSpreadshotTurret = {
    PARENT:'autoTurret',LABEL:'Spreadshot',INDEPENDENT:true,BODY:{FOV:base.FOV*3},
    GUNS:[
        {POSITION:[11,4,1,0,-0.5,-55,5/6],PROPERTIES:{SHOOT_SETTINGS:s(g.basic,g.gunner,g.arty,g.twin,g.spread,{damage:1.3},g.noRecoil),TYPE:'bullet',LABEL:'Spread'}},
        {POSITION:[11,4,1,0, 0.5, 55,5/6],PROPERTIES:{SHOOT_SETTINGS:s(g.basic,g.gunner,g.arty,g.twin,g.spread,{damage:1.3},g.noRecoil),TYPE:'bullet',LABEL:'Spread'}},
        {POSITION:[12,4,1,0,-0.5,-32,3/6],PROPERTIES:{SHOOT_SETTINGS:s(g.basic,g.gunner,g.arty,g.twin,g.spread,{damage:1.3},g.noRecoil),TYPE:'bullet',LABEL:'Spread'}},
        {POSITION:[12,4,1,0, 0.5, 32,3/6],PROPERTIES:{SHOOT_SETTINGS:s(g.basic,g.gunner,g.arty,g.twin,g.spread,{damage:1.3},g.noRecoil),TYPE:'bullet',LABEL:'Spread'}},
        {POSITION:[14,7,1,0,   0,   0,  0],PROPERTIES:{SHOOT_SETTINGS:s(g.basic,g.pounder,g.spreadshotMain,{damage:1.4},g.noRecoil),TYPE:'bullet'}},
    ],
};

// Trapper — setTrap field builder
Class.solarTrapTurret = {
    PARENT:'autoTurret',LABEL:'Trapper',INDEPENDENT:true,BODY:{FOV:base.FOV*2.5},
    GUNS:[
        {POSITION:[12,7,1,0,0,0,0]},
        {POSITION:[3,7,1.7,12,0,0,0],PROPERTIES:{SHOOT_SETTINGS:s(g.trap,g.setTrap,g.pounder,{reload:1.1,speed:1.4,size:1.05,health:1.25},g.noRecoil),TYPE:'setTrap',STAT_CALCULATOR:'block'}},
    ],
};

// Destroyer — heavy single shell
Class.solarDestroyerTurret = {
    PARENT:'autoTurret',LABEL:'Destroyer',INDEPENDENT:true,BODY:{FOV:base.FOV*3},
    GUNS:[{POSITION:[18,13,1,0,0,0,0],PROPERTIES:{SHOOT_SETTINGS:s(g.basic,g.pounder,g.destroy,{damage:1.4,health:1.2},g.noRecoil),TYPE:'bullet',LABEL:'Destroyer'}}],
};

// Triplet burst — 3 stacked medium shells
Class.solarTripletTurret = {
    PARENT:'autoTurret',LABEL:'Triplet',INDEPENDENT:true,BODY:{FOV:base.FOV*3},
    GUNS:[
        {POSITION:[19,8,1,0, 0,  0,0],   PROPERTIES:{SHOOT_SETTINGS:s(g.basic,g.twin,g.triplet,{damage:1.25,health:1.1},g.noRecoil),TYPE:'bullet'}},
        {POSITION:[17,8,1,0, 4,-15,0.5], PROPERTIES:{SHOOT_SETTINGS:s(g.basic,g.twin,g.triplet,{damage:1.2},g.noRecoil),TYPE:'bullet'}},
        {POSITION:[17,8,1,0,-4, 15,0.5], PROPERTIES:{SHOOT_SETTINGS:s(g.basic,g.twin,g.triplet,{damage:1.2},g.noRecoil),TYPE:'bullet'}},
    ],
};

// Ranger — extreme range assassin-class shot
Class.solarRangerTurret = {
    PARENT:'autoTurret',LABEL:'Ranger',INDEPENDENT:true,BODY:{FOV:base.FOV*6},
    GUNS:[
        {POSITION:[28,8,1,0,0,0,0],PROPERTIES:{SHOOT_SETTINGS:s(g.basic,g.sniper,g.assassin,{damage:1.4,health:1.15,range:1.2},g.noRecoil),TYPE:'bullet'}},
        {POSITION:[12,8,-2.2,0,0,0,0]},
    ],
};

// Artillery — heavy centre + flanking machine guns
Class.solarArtilleryTurret = {
    PARENT:'autoTurret',LABEL:'Artillery',INDEPENDENT:true,BODY:{FOV:base.FOV*3},
    GUNS:[
        {POSITION:[17,3,1,0,-5,-7,0.25],PROPERTIES:{SHOOT_SETTINGS:s(g.basic,g.gunner,g.arty,{damage:1.2},g.noRecoil),TYPE:'bullet',LABEL:'Secondary'}},
        {POSITION:[17,3,1,0, 5, 7,0.75],PROPERTIES:{SHOOT_SETTINGS:s(g.basic,g.gunner,g.arty,{damage:1.2},g.noRecoil),TYPE:'bullet',LABEL:'Secondary'}},
        {POSITION:[19,12,1,0,0,0,0],    PROPERTIES:{SHOOT_SETTINGS:s(g.basic,g.pounder,g.arty,{damage:1.35,health:1.2},g.noRecoil),TYPE:'bullet',LABEL:'Heavy'}},
    ],
};

// Overseer drone launcher — 2-gun drone overseer style
Class.solarOverseerTurret = {
    PARENT:'autoTurret',LABEL:'Overseer',INDEPENDENT:true,BODY:{FOV:base.FOV*3},
    GUNS:[
        {POSITION:[0,7,1.1,9,0, 90,0],   PROPERTIES:{SHOOT_SETTINGS:s(g.drone,g.over,{size:1.1,health:1.5,damage:1.35,maxSpeed:1.4},g.noRecoil),TYPE:['drone',{INDEPENDENT:true}],AUTOFIRE:true,SYNCS_SKILLS:true,STAT_CALCULATOR:'drone',WAIT_TO_CYCLE:true,MAX_CHILDREN:2}},
        {POSITION:[0,7,1.1,9,0,270,0.5], PROPERTIES:{SHOOT_SETTINGS:s(g.drone,g.over,{size:1.1,health:1.5,damage:1.35,maxSpeed:1.4},g.noRecoil),TYPE:['drone',{INDEPENDENT:true}],AUTOFIRE:true,SYNCS_SKILLS:true,STAT_CALCULATOR:'drone',WAIT_TO_CYCLE:true,MAX_CHILDREN:2}},
    ],
};

// Swarmer — hive bomb swarmer
Class.solarSwarmerTurret = {
    PARENT:'autoTurret',LABEL:'Swarmer',INDEPENDENT:true,BODY:{FOV:base.FOV*3},
    GUNS:[
        {POSITION:[14,14,-1.2,5,0,0,0],PROPERTIES:{SHOOT_SETTINGS:s(g.basic,g.pounder,g.destroy,g.hive,{damage:1.4,health:1.2,range:1.15},g.noRecoil),TYPE:'solarHiveHive',LABEL:'Swarmer'}},
        {POSITION:[14,12,1,5,0,0,0]},
    ],
};

// Mortar — 5-barrel heavy/flanking artillery
Class.solarMortarTurret = {
    PARENT:'autoTurret',LABEL:'Mortar',INDEPENDENT:true,BODY:{FOV:base.FOV*3},
    GUNS:[
        {POSITION:[13,3,1,0,-7,-7,0.6],PROPERTIES:{SHOOT_SETTINGS:s(g.basic,g.gunner,g.arty,g.twin,{damage:1.2},g.noRecoil),TYPE:'bullet',LABEL:'Secondary'}},
        {POSITION:[13,3,1,0, 7, 7,0.8],PROPERTIES:{SHOOT_SETTINGS:s(g.basic,g.gunner,g.arty,g.twin,{damage:1.2},g.noRecoil),TYPE:'bullet',LABEL:'Secondary'}},
        {POSITION:[17,3,1,0,-5,-7,0.2],PROPERTIES:{SHOOT_SETTINGS:s(g.basic,g.gunner,g.arty,g.twin,{damage:1.2},g.noRecoil),TYPE:'bullet',LABEL:'Secondary'}},
        {POSITION:[17,3,1,0, 5, 7,0.4],PROPERTIES:{SHOOT_SETTINGS:s(g.basic,g.gunner,g.arty,g.twin,{damage:1.2},g.noRecoil),TYPE:'bullet',LABEL:'Secondary'}},
        {POSITION:[19,12,1,0,0,0,0],   PROPERTIES:{SHOOT_SETTINGS:s(g.basic,g.pounder,g.arty,{damage:1.35,health:1.2},g.noRecoil),TYPE:'bullet',LABEL:'Heavy'}},
    ],
};

// Battleship — 4-gun guided+auto combo
Class.solarBattleshipTurret = {
    PARENT:'autoTurret',LABEL:'Battleship',INDEPENDENT:true,BODY:{FOV:base.FOV*2.5},
    GUNS:[
        {POSITION:[7,7,0.6,6,0, 90,0],   PROPERTIES:{SHOOT_SETTINGS:s(g.swarm,g.battleship,{damage:1.3,health:1.2,size:1.05},g.noRecoil),TYPE:'swarm',   STAT_CALCULATOR:'swarm',LABEL:'Guided'}},
        {POSITION:[7,7,0.6,6,0,270,0.5], PROPERTIES:{SHOOT_SETTINGS:s(g.swarm,g.battleship,{damage:1.3,health:1.2,size:1.05},g.noRecoil),TYPE:'swarm',   STAT_CALCULATOR:'swarm',LABEL:'Guided'}},
        {POSITION:[7,7,0.6,6,0, 90,0.25],PROPERTIES:{SHOOT_SETTINGS:s(g.swarm,{damage:1.15,health:1.1},g.noRecoil),TYPE:'autoswarm',STAT_CALCULATOR:'swarm',LABEL:'Auto'}},
        {POSITION:[7,7,0.6,6,0,270,0.75],PROPERTIES:{SHOOT_SETTINGS:s(g.swarm,{damage:1.15,health:1.1},g.noRecoil),TYPE:'autoswarm',STAT_CALCULATOR:'swarm',LABEL:'Auto'}},
    ],
};

// Ordnance — dual-purpose: sniper + artillery flankers
Class.solarOrdnanceTurret = {
    PARENT:'autoTurret',LABEL:'Ordnance',INDEPENDENT:true,BODY:{FOV:base.FOV*4},
    GUNS:[
        {POSITION:[17,3,1,0,-5,-6,0.25],PROPERTIES:{SHOOT_SETTINGS:s(g.basic,g.gunner,g.arty,{damage:1.2},g.noRecoil),TYPE:'bullet',LABEL:'Secondary'}},
        {POSITION:[17,3,1,0, 5, 6,0.75],PROPERTIES:{SHOOT_SETTINGS:s(g.basic,g.gunner,g.arty,{damage:1.2},g.noRecoil),TYPE:'bullet',LABEL:'Secondary'}},
        {POSITION:[22,8,1,0,0,0,0],    PROPERTIES:{SHOOT_SETTINGS:s(g.basic,g.sniper,g.hunter,g.hunter2,{damage:1.35,health:1.1},g.noRecoil),TYPE:'bullet'}},
        {POSITION:[19,11,1,0,0,0,0.25],PROPERTIES:{SHOOT_SETTINGS:s(g.basic,g.sniper,g.hunter,{damage:1.25},g.noRecoil),TYPE:'bullet'}},
    ],
};

// Sidewinder — snake missile
Class.solarSidewinderTurret = {
    PARENT:'autoTurret',LABEL:'Sidewinder',INDEPENDENT:true,BODY:{FOV:base.FOV*4},
    GUNS:[
        {POSITION:[9,10,-0.5,12,0,0,0]},
        {POSITION:[18,12,-1.1,0,0,0,0],PROPERTIES:{SHOOT_SETTINGS:s(g.basic,g.sniper,g.hunter,g.sidewinder,{damage:1.35,health:1.15},g.noRecoil),TYPE:'snake',STAT_CALCULATOR:'sustained'}},
    ],
};

// Summoner drone — sunchip rectangle drones
Class.solarSummonerTurret = {
    PARENT:'autoTurret',LABEL:'Summoner',INDEPENDENT:true,BODY:{FOV:base.FOV*3},
    GUNS:[
        {POSITION:[0,8,1.1,9,0, 90,0],   PROPERTIES:{SHOOT_SETTINGS:s(g.drone,g.summoner,g.destroy,{size:1.1,health:1.5,damage:1.4,maxSpeed:1.3},g.noRecoil),TYPE:['demonchip',{INDEPENDENT:true}],AUTOFIRE:true,SYNCS_SKILLS:true,STAT_CALCULATOR:'drone',WAIT_TO_CYCLE:true,MAX_CHILDREN:2}},
        {POSITION:[0,8,1.1,9,0,270,0.5], PROPERTIES:{SHOOT_SETTINGS:s(g.drone,g.summoner,g.destroy,{size:1.1,health:1.5,damage:1.4,maxSpeed:1.3},g.noRecoil),TYPE:['sunchip', {INDEPENDENT:true}],AUTOFIRE:true,SYNCS_SKILLS:true,STAT_CALCULATOR:'drone',WAIT_TO_CYCLE:true,MAX_CHILDREN:2}},
    ],
};

// ─────────────────────────────────────────────────────────────────────────────
// ██  ANTEDILUVIAN WEAPON TURRET CLASSES  ██
// Heavier, larger, more extreme versions designed for SIZE 250 bosses
// ─────────────────────────────────────────────────────────────────────────────

// Mega-Annihilator — colossal single shell
Class.anteAnniTurret = {
    PARENT:'autoTurret',LABEL:'Mega-Annihilator',INDEPENDENT:true,BODY:{FOV:base.FOV*3},
    GUNS:[
        {POSITION:[20,22,1,0,0,0,0],PROPERTIES:{SHOOT_SETTINGS:s(g.basic,g.pounder,g.destroy,g.anni,{damage:1.8,health:1.5,size:1.2,resist:1.2,density:1.4},g.noRecoil),TYPE:'bullet',LABEL:'Mega-Anni'}},
        {POSITION:[13,24,-1.4,3,0,0,0]},
    ],
};

// Void Hive — 9-bee pod bombs
Class.anteHiveHive = { PARENT:'bullet',LABEL:'Void Hive',BODY:{RANGE:100,FOV:0.6},INDEPENDENT:true,CONTROLLERS:['nearestDifferentMaster','targetSelf'],AI:{NO_LEAD:true},GUNS:weaponArray({POSITION:[6,6,0.6,6,0,0,0],PROPERTIES:{SHOOT_SETTINGS:s(g.swarm,g.hive,g.bee,g.battleship,{damage:1.6,health:1.4}),TYPE:['bee',{PERSISTS_AFTER_DEATH:true}],STAT_CALCULATOR:'swarm',AUTOFIRE:true}},9,1/9) };
Class.anteHiveTurret = {
    PARENT:'autoTurret',LABEL:'Void Hive',INDEPENDENT:true,BODY:{FOV:base.FOV*3},
    GUNS:[
        {POSITION:[16,15,-1.1,5,0,0,0],PROPERTIES:{SHOOT_SETTINGS:s(g.basic,g.pounder,g.destroy,g.hive,{damage:1.7,health:1.5,range:1.3},g.noRecoil),TYPE:'anteHiveHive',LABEL:'Void Hive'}},
        {POSITION:[16,13,1,5,0,0,0]},
    ],
};

// Overlord — 4-gun drone cluster
Class.anteOverlordTurret = {
    PARENT:'autoTurret',LABEL:'Overlord',INDEPENDENT:true,BODY:{FOV:base.FOV*4},
    GUNS:[
        {POSITION:[0,8,1.1,9,0,  0,0],   PROPERTIES:{SHOOT_SETTINGS:s(g.drone,g.over,{size:1.2,health:1.8,damage:1.7,maxSpeed:1.3,resist:1.3},g.noRecoil),TYPE:['drone',{INDEPENDENT:true}],AUTOFIRE:true,SYNCS_SKILLS:true,STAT_CALCULATOR:'drone',WAIT_TO_CYCLE:true,MAX_CHILDREN:2}},
        {POSITION:[0,8,1.1,9,0, 90,0.25],PROPERTIES:{SHOOT_SETTINGS:s(g.drone,g.over,{size:1.2,health:1.8,damage:1.7,maxSpeed:1.3,resist:1.3},g.noRecoil),TYPE:['drone',{INDEPENDENT:true}],AUTOFIRE:true,SYNCS_SKILLS:true,STAT_CALCULATOR:'drone',WAIT_TO_CYCLE:true,MAX_CHILDREN:2}},
        {POSITION:[0,8,1.1,9,0,180,0.5], PROPERTIES:{SHOOT_SETTINGS:s(g.drone,g.over,{size:1.2,health:1.8,damage:1.7,maxSpeed:1.3,resist:1.3},g.noRecoil),TYPE:['drone',{INDEPENDENT:true}],AUTOFIRE:true,SYNCS_SKILLS:true,STAT_CALCULATOR:'drone',WAIT_TO_CYCLE:true,MAX_CHILDREN:2}},
        {POSITION:[0,8,1.1,9,0,270,0.75],PROPERTIES:{SHOOT_SETTINGS:s(g.drone,g.over,{size:1.2,health:1.8,damage:1.7,maxSpeed:1.3,resist:1.3},g.noRecoil),TYPE:['drone',{INDEPENDENT:true}],AUTOFIRE:true,SYNCS_SKILLS:true,STAT_CALCULATOR:'drone',WAIT_TO_CYCLE:true,MAX_CHILDREN:2}},
    ],
};

// Fate-locked missile (homing skimmer + spin)
Class.anteFateMissile = { PARENT:'missile',LABEL:'Fate-Missile',CONTROLLERS:[['spin2',{speed:0.035}]],GUNS:[{POSITION:[14,6,1,0,0,0,0],PROPERTIES:{AUTOFIRE:true,SHOOT_SETTINGS:s(g.basic,g.lowPower,{size:1.1,recoil:0.1,damage:1.1}),TYPE:['bullet',{PERSISTS_AFTER_DEATH:true}],STAT_CALCULATOR:'thruster'}}] };
Class.anteFateTurret = {
    PARENT:'autoTurret',LABEL:'Fatelocked',INDEPENDENT:true,BODY:{FOV:base.FOV*4},
    GUNS:[
        {POSITION:[9,12,-0.65,7,0,0,0]},
        {POSITION:[14,13,-1.2,0,0,0,0],PROPERTIES:{SHOOT_SETTINGS:s(g.basic,g.pounder,g.arty,g.arty,g.skim,{reload:1.1,damage:1.6,health:1.4,speed:0.55,maxSpeed:0.55},g.noRecoil),TYPE:'anteFateMissile',STAT_CALCULATOR:'sustained',LABEL:'Fate'}},
    ],
};

// Void Chaos — spreadshot fan + annihilator + chaos hive combo
Class.anteVoidChaosHiveHive = { PARENT:'bullet',LABEL:'Chaos Hive',BODY:{RANGE:100,FOV:0.6},INDEPENDENT:true,CONTROLLERS:['nearestDifferentMaster','targetSelf'],AI:{NO_LEAD:true},GUNS:weaponArray({POSITION:[6,6,0.6,6,0,0,0],PROPERTIES:{SHOOT_SETTINGS:s(g.swarm,g.hive,g.bee,g.battleship,{damage:1.7,health:1.5}),TYPE:['bee',{PERSISTS_AFTER_DEATH:true}],STAT_CALCULATOR:'swarm',AUTOFIRE:true}},11,1/11) };
Class.anteVoidChaosTurret = makeTurret({
    GUNS:[
        {POSITION:[10,10,0,0,0,0,0],PROPERTIES:{SHOOT_SETTINGS:s(g.basic,{range:0.0005,speed:0.0005,maxSpeed:0.0005,recoil:0}),TYPE:'stupidBullet',DRAW_FILL:false,BORDERLESS:true}},
        {POSITION:[11,4,1,0,-1,-52,5/6],PROPERTIES:{SHOOT_SETTINGS:s(g.basic,g.gunner,g.arty,g.twin,g.spread,{damage:1.55},g.noRecoil),TYPE:'bullet'}},
        {POSITION:[11,4,1,0, 1, 52,5/6],PROPERTIES:{SHOOT_SETTINGS:s(g.basic,g.gunner,g.arty,g.twin,g.spread,{damage:1.55},g.noRecoil),TYPE:'bullet'}},
        {POSITION:[12,4,1,0,-1,-28,3/6],PROPERTIES:{SHOOT_SETTINGS:s(g.basic,g.gunner,g.arty,g.twin,g.spread,{damage:1.55},g.noRecoil),TYPE:'bullet'}},
        {POSITION:[12,4,1,0, 1, 28,3/6],PROPERTIES:{SHOOT_SETTINGS:s(g.basic,g.gunner,g.arty,g.twin,g.spread,{damage:1.55},g.noRecoil),TYPE:'bullet'}},
        {POSITION:[20,20,1,0,0,0,0],PROPERTIES:{SHOOT_SETTINGS:s(g.basic,g.pounder,g.destroy,g.anni,{damage:1.85,health:1.6},g.noRecoil),TYPE:'bullet',LABEL:'Void'}},
        {POSITION:[16,13,-1.1,4,0,0,0.5],PROPERTIES:{SHOOT_SETTINGS:s(g.basic,g.pounder,g.destroy,g.hive,{damage:1.6,health:1.4,range:1.2},g.noRecoil),TYPE:'anteVoidChaosHiveHive'}},
        {POSITION:[16,11,1,4,0,0,0.5]},
    ]
},{limitFov:true,fov:10,extraStats:[],label:'Void Chaos'});

// Mega-Streamliner — 7 stacked continuous rays
Class.anteMegaStreamTurret = {
    PARENT:'autoTurret',LABEL:'Mega-Streamliner',INDEPENDENT:true,BODY:{FOV:base.FOV*4.5},
    GUNS:[
        {POSITION:[26,8,1,0,0,0,0],   PROPERTIES:{SHOOT_SETTINGS:s(g.basic,g.mini,g.stream,{damage:1.35,health:1.15,range:1.1},g.noRecoil),TYPE:'bullet'}},
        {POSITION:[24,8,1,0,0,0,0.15],PROPERTIES:{SHOOT_SETTINGS:s(g.basic,g.mini,g.stream,{damage:1.35,health:1.15,range:1.1},g.noRecoil),TYPE:'bullet'}},
        {POSITION:[22,8,1,0,0,0,0.3], PROPERTIES:{SHOOT_SETTINGS:s(g.basic,g.mini,g.stream,{damage:1.35,health:1.15,range:1.1},g.noRecoil),TYPE:'bullet'}},
        {POSITION:[20,8,1,0,0,0,0.45],PROPERTIES:{SHOOT_SETTINGS:s(g.basic,g.mini,g.stream,{damage:1.35,health:1.15,range:1.1},g.noRecoil),TYPE:'bullet'}},
        {POSITION:[18,8,1,0,0,0,0.6], PROPERTIES:{SHOOT_SETTINGS:s(g.basic,g.mini,g.stream,{damage:1.35,health:1.15,range:1.1},g.noRecoil),TYPE:'bullet'}},
        {POSITION:[16,8,1,0,0,0,0.75],PROPERTIES:{SHOOT_SETTINGS:s(g.basic,g.mini,g.stream,{damage:1.35,health:1.15,range:1.1},g.noRecoil),TYPE:'bullet'}},
        {POSITION:[14,8,1,0,0,0,0.9], PROPERTIES:{SHOOT_SETTINGS:s(g.basic,g.mini,g.stream,{damage:1.35,health:1.15,range:1.1},g.noRecoil),TYPE:'bullet'}},
    ],
};

// Mega-Trap field — 4-way radial setTrap field
Class.anteMegaTrapTurret = makeTurret({
    GUNS:[
        {POSITION:[10,10,0,0,0,0,0],PROPERTIES:{SHOOT_SETTINGS:s(g.basic,{range:0.0005,speed:0.0005,maxSpeed:0.0005,recoil:0}),TYPE:'stupidBullet',DRAW_FILL:false,BORDERLESS:true}},
        ...Array(4).fill(0).flatMap((_,i)=>[
            {POSITION:[14,7,1,0,0,i*90,i/4]},
            {POSITION:[3,7,1.7,14,0,i*90,i/4],PROPERTIES:{SHOOT_SETTINGS:s(g.trap,g.setTrap,{reload:1.8,speed:0.4,maxSpeed:0.4,health:1.8,damage:1.7,size:1.2},g.noRecoil),TYPE:'setTrap',STAT_CALCULATOR:'block'}},
        ]),
    ]
},{limitFov:true,fov:10,extraStats:[],label:'Mega-Trap'});

// Mega-Destroyer — 2-shell crescendo
Class.anteDestroyerTurret = {
    PARENT:'autoTurret',LABEL:'Mega-Destroyer',INDEPENDENT:true,BODY:{FOV:base.FOV*3},
    GUNS:[
        {POSITION:[20,14,1,0,0,0,0],   PROPERTIES:{SHOOT_SETTINGS:s(g.basic,g.pounder,g.destroy,{damage:1.65,health:1.4,size:1.1},g.noRecoil),TYPE:'bullet',LABEL:'Destroyer'}},
        {POSITION:[17,16,1,0,0,0,0.3], PROPERTIES:{SHOOT_SETTINGS:s(g.basic,g.pounder,g.destroy,{damage:1.55,health:1.3},g.noRecoil),TYPE:'bullet'}},
    ],
};

// Ante-Predator — 3-shot ultra-range precision
Class.antePredatorTurret = {
    PARENT:'autoTurret',LABEL:'Ante-Predator',INDEPENDENT:true,BODY:{FOV:base.FOV*6},
    GUNS:[
        {POSITION:[26,8,1,0,0,0,0],   PROPERTIES:{SHOOT_SETTINGS:s(g.basic,g.sniper,g.hunter,g.hunter2,g.hunter2,g.predator,{damage:1.6,health:1.25,range:1.2},g.noRecoil),TYPE:'bullet'}},
        {POSITION:[23,11,1,0,0,0,0.2],PROPERTIES:{SHOOT_SETTINGS:s(g.basic,g.sniper,g.hunter,g.hunter2,g.predator,{damage:1.5,health:1.2},g.noRecoil),TYPE:'bullet'}},
        {POSITION:[20,14,1,0,0,0,0.4],PROPERTIES:{SHOOT_SETTINGS:s(g.basic,g.sniper,g.hunter,g.predator,{damage:1.4,health:1.15},g.noRecoil),TYPE:'bullet'}},
    ],
};

// Ante-Carrier — 5-gun swarm barrage
Class.anteCarrierTurret = {
    PARENT:'autoTurret',LABEL:'Ante-Carrier',INDEPENDENT:true,BODY:{FOV:base.FOV*3},
    GUNS:[
        {POSITION:[7,7,0.6,6, 3, 40,0.8],PROPERTIES:{SHOOT_SETTINGS:s(g.swarm,g.battleship,g.carrier,{damage:1.5,health:1.3,size:1.05},g.noRecoil),TYPE:'swarm',STAT_CALCULATOR:'swarm'}},
        {POSITION:[7,7,0.6,6,-3,-40,0.8],PROPERTIES:{SHOOT_SETTINGS:s(g.swarm,g.battleship,g.carrier,{damage:1.5,health:1.3,size:1.05},g.noRecoil),TYPE:'swarm',STAT_CALCULATOR:'swarm'}},
        {POSITION:[7,7,0.6,6, 0,  0,0],  PROPERTIES:{SHOOT_SETTINGS:s(g.swarm,g.battleship,{damage:1.4,health:1.2},g.noRecoil),TYPE:'autoswarm',STAT_CALCULATOR:'swarm'}},
        {POSITION:[7,7,0.6,6, 0, 90,0.4],PROPERTIES:{SHOOT_SETTINGS:s(g.swarm,g.battleship,{damage:1.4,health:1.2},g.noRecoil),TYPE:'autoswarm',STAT_CALCULATOR:'swarm'}},
        {POSITION:[7,7,0.6,6, 0,270,0.6],PROPERTIES:{SHOOT_SETTINGS:s(g.swarm,g.battleship,{damage:1.4,health:1.2},g.noRecoil),TYPE:'autoswarm',STAT_CALCULATOR:'swarm'}},
    ],
};

// Ante-Skimmer — heavier homing missile
Class.anteSkimmerTurret = {
    PARENT:'autoTurret',LABEL:'Ante-Skimmer',INDEPENDENT:true,BODY:{FOV:base.FOV*4},
    GUNS:[
        {POSITION:[10,20,-0.4,11,0,0,0]},
        {POSITION:[16,18,-0.65,0,0,0,0],PROPERTIES:{SHOOT_SETTINGS:s(g.basic,g.pounder,g.arty,g.arty,g.skim,{damage:1.65,health:1.4,reload:0.9},g.noRecoil),TYPE:'missile',STAT_CALCULATOR:'sustained'}},
    ],
};

// Ante-Rocketeer — fat guided rocket
Class.anteRocketeerTurret = {
    PARENT:'autoTurret',LABEL:'Ante-Rocketeer',INDEPENDENT:true,BODY:{FOV:base.FOV*3},
    GUNS:[
        {POSITION:[10,13,-0.6,10,0,0,0],PROPERTIES:{SHOOT_SETTINGS:s(g.basic,g.pounder,g.launcher,g.rocketeer,{damage:1.6,health:1.45,size:1.1},g.noRecoil),TYPE:'rocketeerMissile',STAT_CALCULATOR:'sustained'}},
        {POSITION:[17,19,0.6,0,0,0,0]},
    ],
};

// Ante-Summoner — mixed multi-drone swarm
Class.anteSummonerTurret = {
    PARENT:'autoTurret',LABEL:'Ante-Summoner',INDEPENDENT:true,BODY:{FOV:base.FOV*3.5},
    GUNS:[
        {POSITION:[0,8,1.1,9,0,  0,0],   PROPERTIES:{SHOOT_SETTINGS:s(g.drone,g.summoner,g.destroy,{size:1.2,health:1.8,damage:1.7,maxSpeed:1.35},g.noRecoil),TYPE:['demonchip',{INDEPENDENT:true}],AUTOFIRE:true,SYNCS_SKILLS:true,STAT_CALCULATOR:'drone',WAIT_TO_CYCLE:true,MAX_CHILDREN:2}},
        {POSITION:[0,8,1.1,9,0, 90,0.25],PROPERTIES:{SHOOT_SETTINGS:s(g.drone,g.summoner,{size:1.2,health:1.8,damage:1.6,maxSpeed:1.4},g.noRecoil),TYPE:['sunchip', {INDEPENDENT:true}],AUTOFIRE:true,SYNCS_SKILLS:true,STAT_CALCULATOR:'drone',WAIT_TO_CYCLE:true,MAX_CHILDREN:2}},
        {POSITION:[0,8,1.1,9,0,180,0.5], PROPERTIES:{SHOOT_SETTINGS:s(g.drone,g.summoner,g.destroy,{size:1.2,health:1.8,damage:1.7,maxSpeed:1.35},g.noRecoil),TYPE:['dorito',  {INDEPENDENT:true}],AUTOFIRE:true,SYNCS_SKILLS:true,STAT_CALCULATOR:'drone',WAIT_TO_CYCLE:true,MAX_CHILDREN:2}},
        {POSITION:[0,8,1.1,9,0,270,0.75],PROPERTIES:{SHOOT_SETTINGS:s(g.drone,g.summoner,{size:1.2,health:1.8,damage:1.6,maxSpeed:1.4},g.noRecoil),TYPE:['realchip',{INDEPENDENT:true}],AUTOFIRE:true,SYNCS_SKILLS:true,STAT_CALCULATOR:'drone',WAIT_TO_CYCLE:true,MAX_CHILDREN:2}},
    ],
};

// ─────────────────────────────────────────────────────────────────────────────
// SPINNING RING FACTORY
//
// Creates Class[name] as a fully independent spinning entity with turrets
// placed at equal angles around it. Each turret points outward so weapons
// fire away from the boss body and look clean.
//
// spinSpeed: rad/tick. Positive=CW, negative=CCW.
// sideCount: number of turrets on this ring (= number of polygon sides of parent).
// radius: absolute game-unit distance from ring center to turret.
// turretClass: weapon class name.
// dmg/hp: stat scale multipliers for weapons on this ring.
// ─────────────────────────────────────────────────────────────────────────────
function makeSpinRing(name, sideCount, spinSpeed, radius, turretClass, dmg, hp, extra) {
    const scale = Object.assign({ damage: dmg, health: hp }, extra || {});
    const step = 360 / sideCount;
    Class[name] = {
        PARENT: 'genericTank',
        LABEL: '',
        INDEPENDENT: true,
        DRAW_HEALTH: false,
        IGNORED_BY_AI: true,
        SKILL: [9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
        BODY: { HEALTH: 99999, DAMAGE: 0, PUSHABILITY: 0, FOV: 0.001 },
        FACING_TYPE: ['spin', { speed: spinSpeed, independent: true }],
        CONTROLLERS: [],
        GUNS: [],
        TURRETS: Array(sideCount).fill(0).map((_, i) => {
            const deg = step * i;
            const rad = deg * Math.PI / 180;
            const rx = Math.cos(rad) * radius;
            const ry = Math.sin(rad) * radius;
            return {
                POSITION: [8, rx, ry, deg, 360, 0],
                TYPE: [turretClass, { INDEPENDENT: true, GUN_STAT_SCALE: scale }],
            };
        }),
    };
}

// ─────────────────────────────────────────────────────────────────────────────
// RING CONFIGS
//
// Solar: 8 rings, SIZE 200, 15 sides each.
// Rings start fast+tight (inner) and get slower+wider (outer).
// CW/CCW alternates every ring for visual drama.
//
// [spinSpeed, radius, dmgScale, hpScale, extraScale]
// radius in game units (absolute, not %)
// ─────────────────────────────────────────────────────────────────────────────
const SOLAR_RINGS = [
    [+0.14,  27, 1.10, 1.05, {}],   // R0: fastest, innermost, CW
    [-0.10,  36, 1.15, 1.08, {}],   // R1: medium, CCW
    [+0.09,  45, 1.20, 1.10, {}],   // R2: medium, CW
    [-0.13,  54, 1.26, 1.12, {}],   // R3: faster, CCW
    [+0.07,  62, 1.32, 1.15, {}],   // R4: slow, CW
    [-0.11,  70, 1.39, 1.18, {}],   // R5: medium, CCW
    [+0.08,  78, 1.46, 1.22, {}],   // R6: medium, CW
    [-0.06,  86, 1.55, 1.27, {}],   // R7: slowest, outermost, CCW
];

// Antediluvian: 10 rings, SIZE 250, 17 sides each.
// Wider spread, more contrast in spin speeds.
const ANTE_RINGS = [
    [+0.17,  32, 1.15, 1.10, {}],   // R0: blazing fast, CW
    [-0.12,  43, 1.20, 1.12, {}],   // R1: medium CCW
    [+0.09,  54, 1.26, 1.15, {}],   // R2: medium CW
    [-0.16,  64, 1.32, 1.17, {}],   // R3: fast CCW
    [+0.11,  74, 1.38, 1.20, {}],   // R4: medium CW
    [-0.08,  84, 1.45, 1.23, {}],   // R5: slow CCW
    [+0.14,  93, 1.52, 1.27, {}],   // R6: fast CW (sudden speed change)
    [-0.10, 102, 1.60, 1.32, {}],   // R7: medium CCW
    [+0.06, 111, 1.70, 1.38, {}],   // R8: very slow CW
    [-0.09, 120, 1.82, 1.45, {}],   // R9: medium CCW, outermost
];

// Boss factory for Solars (8 rings + center)
function mkSolar(name, label, color, weapons8, centerClass) {
    SOLAR_RINGS.forEach(([spd, r, dm, hp, ex], i) => {
        makeSpinRing(`${name}_r${i}`, 5, spd, r, weapons8[i], dm, hp, ex);
    });
    Class[name] = {
        PARENT: 'CMCSolar',
        NAME: label,
        UPGRADE_LABEL: label,
        COLOR: color,
        UPGRADE_COLOR: color,
        TURRETS: [
            ...SOLAR_RINGS.map((_, i) => ({
                POSITION: [100, 0, 0, 0, 360, i + 1],
                TYPE: `${name}_r${i}`,
            })),
            {
                POSITION: [14, 0, 0, 0, 360, 9],
                TYPE: [centerClass, {
                    INDEPENDENT: true,
                    GUN_STAT_SCALE: { damage: 1.85, health: 1.55, size: 1.2 },
                }],
            },
        ],
    };
}

// Boss factory for Antediluvians (10 rings + center)
function mkAnte(name, label, color, weapons10, centerClass) {
    ANTE_RINGS.forEach(([spd, r, dm, hp, ex], i) => {
        makeSpinRing(`${name}_r${i}`, 6, spd, r, weapons10[i], dm, hp, ex);
    });
    Class[name] = {
        PARENT: 'CMCAntediluvian',
        NAME: label,
        UPGRADE_LABEL: label,
        COLOR: color,
        UPGRADE_COLOR: color,
        TURRETS: [
            ...ANTE_RINGS.map((_, i) => ({
                POSITION: [100, 0, 0, 0, 360, i + 1],
                TYPE: `${name}_r${i}`,
            })),
            {
                POSITION: [18, 0, 0, 0, 360, 11],
                TYPE: [centerClass, {
                    INDEPENDENT: true,
                    GUN_STAT_SCALE: { damage: 2.3, health: 1.85, size: 1.3 },
                }],
            },
        ],
    };
}

// ─────────────────────────────────────────────────────────────────────────────
// Weapon shorthand aliases (Solar)
// ─────────────────────────────────────────────────────────────────────────────
const P  = 'solarPredatorTurret';
const S  = 'solarStreamlinerTurret';
const G  = 'solarGunnerTurret';
const K  = 'solarSkimmerTurret';
const A  = 'solarAnniTurret';
const W  = 'solarSwarmTurret';
const H  = 'solarHiveTurret';
const R  = 'solarRocketeerTurret';
const T  = 'solarTwisterTurret';
const D  = 'solarRedistTurret';
const N  = 'solarNailgunTurret';
const C  = 'solarCarrierTurret';
const F  = 'solarSpreadshotTurret';
const L  = 'solarTrapTurret';
const V  = 'solarDestroyerTurret';
const TR = 'solarTripletTurret';
const RA = 'solarRangerTurret';
const AR = 'solarArtilleryTurret';
const OV = 'solarOverseerTurret';
const SW = 'solarSwarmerTurret';
const MO = 'solarMortarTurret';
const BS = 'solarBattleshipTurret';
const OR = 'solarOrdnanceTurret';
const SD = 'solarSidewinderTurret';
const SM = 'solarSummonerTurret';

// Weapon shorthand aliases (Antediluvian)
const AA  = 'anteAnniTurret';
const AH  = 'anteHiveTurret';
const AO  = 'anteOverlordTurret';
const AF  = 'anteFateTurret';
const AC  = 'anteVoidChaosTurret';
const AST = 'anteMegaStreamTurret';
const ATP = 'anteMegaTrapTurret';
const ADT = 'anteDestroyerTurret';
const APR = 'antePredatorTurret';
const ACR = 'anteCarrierTurret';
const ASK = 'anteSkimmerTurret';
const ARK = 'anteRocketeerTurret';
const ASU = 'anteSummonerTurret';

// ─────────────────────────────────────────────────────────────────────────────
// ████  S O L A R S  ████
// Each boss has 8 UNIQUE weapon types across its rings (no repeats).
// Inner rings = lighter weapons, outer rings = heavier weapons.
// ─────────────────────────────────────────────────────────────────────────────

// APOLLO — Gold — Precision master
mkSolar('apolloSolar', 'Apollo', 'gold',
    [G, S, P, N, T, K, H, A], A);

// DIANA — Silver — Moon twin: missiles + traps
mkSolar('dianaSolar', 'Diana', 'veryLightGrey',
    [TR, P, R, N, L, A, T, H], R);

// RA — Orange — Scarab swarm king
mkSolar('raSolar', 'Ra', 'orange',
    [C, W, H, V, P, AR, D, A], A);

// HORUS — Blue — Sky warrior: streams + overseer
mkSolar('horusSolar', 'Horus', 'blue',
    [OV, S, G, C, K, P, W, A], W);

// HELIOS — Yellow — Blinding radiance
mkSolar('heliosSolar', 'Helios', 'yellow',
    [D, G, S, N, AR, T, MO, A], S);

// PHAETHON — Red — Reckless son
mkSolar('phaethonSolar', 'Phaethon', 'red',
    [H, W, V, A, C, P, SW, AA], H);

// SURYA — Crimson — Hindu fire god
mkSolar('suryaSolar', 'Surya', 'crimson',
    [H, G, BS, C, MO, V, F, A], H);

// INDRA — Lavender — Storm overlord
mkSolar('indraSolar', 'Indra', 'lavender',
    [W, T, C, K, AR, N, F, A], W);

// AMATERASU — Pink — Divine mirror
mkSolar('amaterasuSolar', 'Amaterasu', 'pink',
    [SM, W, C, G, F, OV, P, A], W);

// SUSANOO — Dark Blue — Storm god
mkSolar('susanooSolar', 'Susanoo', 'darkBlue',
    [T, D, K, R, OR, H, AR, A], T);

// TONATIUH — Orange — Aztec blood-sun
mkSolar('tonatiuhSolar', 'Tonatiuh', 'orange',
    [H, V, F, AR, SD, W, P, A], A);

// QUETZALCOATL — Green — Feathered serpent
mkSolar('quetzalcoatlSolar', 'Quetzalcoatl', 'lightGreen',
    [L, C, OV, SW, K, H, F, A], L);

// SOL — Light grey — Steady Roman attrition
mkSolar('solSolar', 'Sol', 'veryLightGrey',
    [N, D, S, AR, P, MO, T, A], N);

// LUNA — Dark blue — Moonlit precision
mkSolar('lunaSolar', 'Luna', 'darkBlue',
    [P, L, RA, K, TR, H, OR, A], P);

// KHEPRI — Teal — Scarab dawn
mkSolar('khepriSolar', 'Khepri', 'teal',
    [L, C, SW, OV, H, AR, F, A], L);

// THOTH — Lavender — Divine scribe
mkSolar('thothSolar', 'Thoth', 'lavender',
    [F, G, S, OR, TR, P, SD, A], F);

if (Class.moarCelestialsSolars) {
    Class.moarCelestialsSolars.UPGRADES_TIER_0.push(
        'apolloSolar', 'dianaSolar', 'raSolar', 'horusSolar',
        'heliosSolar', 'phaethonSolar', 'suryaSolar', 'indraSolar',
        'amaterasuSolar', 'susanooSolar', 'tonatiuhSolar', 'quetzalcoatlSolar',
        'solSolar', 'lunaSolar', 'khepriSolar', 'thothSolar',
    );
} else {
    console.warn('[SolarsAndAntediluvians] moarCelestialsSolars not found');
}

// ─────────────────────────────────────────────────────────────────────────────
// ████  A N T E D I L U V I A N S  ████
// Each boss has 10 UNIQUE weapon types across its rings.
// Mix Solar + Ante weapons; all-Ante on outer rings for escalating power.
// ─────────────────────────────────────────────────────────────────────────────

// CHRONOS — Dark grey — God of Time: traps + fate missiles + annihilators
mkAnte('chronosAntediluvian', 'Chronos', 'darkGrey',
    [L, ATP, G, AF, AH, AC, APR, AST, AO, AA], AA);

// KAIROS — Gold — Opportune moment: predators + fate + rockets
mkAnte('kairosAntediluvian', 'Kairos', 'gold',
    [G, AF, K, APR, R, AH, ASK, AC, AST, AA], AF);

// GAIA — Green — World mother: drones + swarms + hives + minions
mkAnte('gaiaAntediluvian', 'Gaia', 'green',
    [OV, C, AO, W, AH, ACR, ASU, ATP, ADT, AA], AO);

// URANOS — Sky blue — Sky father: overlords + streams + predators
mkAnte('uranosAntediluvian', 'Uranos', 'blue',
    [OV, AST, T, APR, ASK, AO, ARK, ACR, AH, AA], AO);

// CHAOS — Rainbow — Primordial void: all weapons
mkAnte('chaosAntediluvian', 'Chaos', 'rainbow',
    [F, H, AC, AO, AA, ATP, AH, AST, AF, AC], AC);

// NYX PRIME — Black — Born from Chaos: pure drone void
mkAnte('nyxPrimAntediluvian', 'Nyx Prime', 'black',
    [SM, AO, W, AC, AA, AH, AST, AF, ADT, AO], AO);

// ANANKE — Purple — Cosmic necessity: fate missiles dominate
mkAnte('anankeAntediluvian', 'Ananke', 'purple',
    [T, AF, R, ASK, AC, AA, ARK, AH, AST, AF], AF);

// ATROPOS — Grey — Fate-cutter: destroyers + annihilators
mkAnte('atroposAntediluvian', 'Atropos', 'grey',
    [V, ADT, ATP, APR, AC, AH, AST, AF, AO, AA], AA);

// EREBUS — Black — Primordial darkness: drones + hives + streams
mkAnte('erebusAntediluvian', 'Erebus', 'black',
    [AO, AH, W, ACR, AST, AA, AF, ATP, ADT, AC], AO);

// AETHER — White — Upper sky: streams + precision + drones
mkAnte('aetherAntediluvian', 'Aether', 'veryLightGrey',
    [S, AST, APR, N, AH, W, AO, ACR, AF, AA], AST);

if (Class.moarCelestialsAntediluvians) {
    Class.moarCelestialsAntediluvians.UPGRADES_TIER_0.push(
        'chronosAntediluvian', 'kairosAntediluvian',
        'gaiaAntediluvian', 'uranosAntediluvian',
        'chaosAntediluvian', 'nyxPrimAntediluvian',
        'anankeAntediluvian', 'atroposAntediluvian',
        'erebusAntediluvian', 'aetherAntediluvian',
    );
} else {
    console.warn('[SolarsAndAntediluvians] moarCelestialsAntediluvians not found');
}
