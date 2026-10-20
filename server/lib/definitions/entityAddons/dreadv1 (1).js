const { combineStats, makeAuto, weaponArray, makeTurret } = require('../facilitators.js');
const { smshskl, base, basePolygonDamage, basePolygonHealth } = require('../constants.js');
const g = require('../gunvals.js');
const dreadnoughtBody = {
    SPEED: base.SPEED * 0.6,
    HEALTH: base.HEALTH * 4,
    DAMAGE: base.DAMAGE * 2.5,
    SHIELD: base.SHIELD * 2.5,
    FOV: base.FOV * 1.25,
    DENSITY: base.DENSITY * 6,
	REGEN: base.REGEN,
};
g.dreadv1Generic = {
	damage: 1.35,
	range: 0.8,
	recoil: 0,
}
g.dreadv1Sniper = {
	speed: 1.07,
	maxSpeed: 1.07,
	health: 1.2,
	damage: 1.1,
	reload: 1.13,
	density: 1.8,
	pen: 1.05,
	resist: 1.2,
	range: 0.8,
}
g.dreadv1Slow = {
	health: 1.3,
	damage: 1.25,
	resist: 1.1,
	speed: 0.65,
	maxSpeed: 0.65,
}
g.dreadv1Drone = {
	health: 1.1,
	speed: 0.77,
	maxSpeed: 0.77,
	reload: 1.65,
	size: 1.2,
	recoil: 0,
}
g.dreadv1Trap = {
	range: 1.3,
	shudder: 0.2,
	speed: 0.95,
	reload: 2.8,
	damage: 1.45,
	health: 1.35,
	resist: 1.1,
	size: 1.25,
}

// Comment out the line below to enable this addon, uncomment it to disable this addon.
// return console.log('--- Dreadnoughts v1 addon [dreadv1.js] is disabled. See lines 32-33 to enable it. ---');

// Set the below variable to true to enable the Medicare and Medicaid healing bodies.
const enableHealers = true;

// Food
Class.hexagonOfficialV1 = {
	PARENT: 'food',
	COLOR: 'magenta',
	LABEL: "Hexagon",
	BODY: {
        DAMAGE: 2 * basePolygonDamage,
        DENSITY: 80,
        HEALTH: 600 * basePolygonHealth,
        RESIST: Math.pow(1.25, 3),
        PENETRATION: 1.1,
        SHIELD: 40 * basePolygonHealth,
        ACCELERATION: 0.0025
    },
	VALUE: 21000,
	SHAPE: 6,
	SIZE: 70,
	DRAW_HEALTH: true,
    GIVE_KILL_MESSAGE: true,
}
Class.heptagonOfficialV1 = {
	PARENT: 'food',
	COLOR: 'green',
	LABEL: "Heptagon",
	BODY: {
        DAMAGE: 2 * basePolygonDamage,
        DENSITY: 80,
        HEALTH: 750 * basePolygonHealth,
        RESIST: Math.pow(1.25, 3),
        PENETRATION: 1.1,
        SHIELD: 50 * basePolygonHealth,
        ACCELERATION: 0.0025
    },
	VALUE: 28000,
	SHAPE: 7,
	SIZE: 80,
	DRAW_HEALTH: true,
    GIVE_KILL_MESSAGE: true,
}
Class.octagonOfficialV1 = {
	PARENT: 'food',
	COLOR: 'hexagon',
	LABEL: "Octagon",
	BODY: {
        DAMAGE: 2 * basePolygonDamage,
        DENSITY: 80,
        HEALTH: 900 * basePolygonHealth,
        RESIST: Math.pow(1.25, 3),
        PENETRATION: 1.1,
        SHIELD: 60 * basePolygonHealth,
        ACCELERATION: 0.0025
    },
	VALUE: 35000,
	SHAPE: 8,
	SIZE: 90,
	DRAW_HEALTH: true,
    GIVE_KILL_MESSAGE: true,
}
Class.nonagonOfficialV1 = {
	PARENT: 'food',
	COLOR: 'white',
	LABEL: "Nonagon",
	BODY: {
        DAMAGE: 2 * basePolygonDamage,
        DENSITY: 80,
        HEALTH: 1050 * basePolygonHealth,
        RESIST: Math.pow(1.25, 3),
        PENETRATION: 1.1,
        SHIELD: 70 * basePolygonHealth,
        ACCELERATION: 0.0025
    },
	VALUE: 42000,
	SHAPE: 9,
	SIZE: 100,
	DRAW_HEALTH: true,
    GIVE_KILL_MESSAGE: true,
}

// Map elements
function portalRings(color = '#1c3766') {
	return [
		{
			POSITION: [22, 0, 0, 0, 1],
			TYPE: ['portalRing1OfficialV1', {COLOR: color}]
		}, {
			POSITION: [20.5, 0, 0, -45, 1],
			TYPE: ['portalRing2OfficialV1', {COLOR: color}]
		}, {
			POSITION: [20.5, 0, 0, 135, 1],
			TYPE: ['portalRing3OfficialV1', {COLOR: color}]
		}, {
			POSITION: [21.2, 0, 0, 0, 1],
			TYPE: ['portalRing4OfficialV1', {COLOR: color}]
		}
	]
}
Class.portalRing1OfficialV1 = {
	SHAPE: "M -1 0 A 1 1 90 0 0 1 0 L 0.7 0 A 0.7 0.7 90 0 1 -0.7 0 Z M -1 0 A 1 1 90 0 1 1 0 L 0.7 0 A 0.7 0.7 90 0 0 -0.7 0 Z",
	COLOR: "#1c3766",
	BORDERLESS: true,
}
Class.portalRing2OfficialV1 = {
	SHAPE: "M -0.707 0.707 A 1 1 0 0 1 -0.707 -0.707 A 1 1.225 0 0 0 -0.707 0.707 Z",
	COLOR: {BASE: "#1c3766", BRIGHTNESS_SHIFT: 16, SATURATION_SHIFT: 0.7},
	BORDERLESS: true,
}
Class.portalRing3OfficialV1 = {
	SHAPE: "M -0.5 0.866 A 1 1 0 0 1 -0.5 -0.866 A 1 1.1 0 0 0 -0.5 0.866 Z",
	COLOR: {BASE: "#1c3766", BRIGHTNESS_SHIFT: -6, SATURATION_SHIFT: 1.1},
	BORDERLESS: true,
}
Class.portalRing4OfficialV1 = {
	SHAPE: "M -0.92 0 A 0.92 0.92 90 0 0 0.92 0 L 0.84 0 A 0.84 0.84 90 0 1 -0.84 0 Z M -0.92 0 A 0.92 0.92 90 0 1 0.92 0 L 0.84 0 A 0.84 0.84 90 0 0 -0.84 0 Z",
	COLOR: {BASE: "#1c3766", BRIGHTNESS_SHIFT: 7, SATURATION_SHIFT: 0.9},
	BORDERLESS: true,
}
Class.portalOfficialV1 = {
	LABEL: "",
	TYPE: 'portal',
	BODY: {
		HEALTH: 1e10,
		SHIELD: 1e10,
		REGEN: 1e10,
		DAMAGE: 0,
		PENETRATION: 1e10,
		DENSITY: 1e10,
		RANGE: 2000,
	},
	ALWAYS_ACTIVE: true,
	HITS_OWN_TYPE: 'never',
	GIVE_KILL_MESSAGE: false,
	DRAW_HEALTH: false,
	TEAM: TEAM_ROOM,
	COLOR: 'pureBlack',
	FACING_TYPE: 'noFacing',
	SIZE: 33,
	DIE_AT_RANGE: true,
	INTANGIBLE: true
}
Class.spikyPortalSpikesOfficialV1 = {
	SHAPE: "",
	INDEPENDENT: true,
	FACING_TYPE: ["spin", {speed: 0.07}],
	GUNS: weaponArray({
		POSITION: [30, 8, 0.001, 0, 0, 0, 0],
		PROPERTIES: {COLOR: 'egg'}
	}, 5),
}
Class.spikyPortalBumpsOfficialV1 = {
	SHAPE: "M 1 0 L 0.666 0.216 L 0.566 0.41 L 0.41 0.566 L 0.309 0.951 L 0 0.7 L -0.215 0.665 L -0.412 0.565 L -0.809 0.588 L -0.666 0.217 L -0.699 0.001 L -0.664 -0.217 L -0.809 -0.588 L -0.412 -0.566 L -0.217 -0.664 L 0.001 -0.699 L 0.309 -0.951 L 0.411 -0.567 L 0.565 -0.412 L 0.665 -0.215 Z",
	COLOR: 'egg',
	INDEPENDENT: true,
	FACING_TYPE: ["spin", {speed: 0.12}],
}
Class.spikyPortalOfficialV1 = {
	PARENT: 'portalOfficialV1',
	TURRETS: [
		{
			POSITION: [26, 0, 0, 0, 0, 0],
			TYPE: "spikyPortalSpikesOfficialV1"
		}, {
			POSITION: [35, 0, 0, 0, 0, 0],
			TYPE: "spikyPortalBumpsOfficialV1"
		}
	],
	PROPS: [
		{
			POSITION: [20, 0, 0, 0, 1],
			TYPE: ['egg', {COLOR: '#212121'}]
		},
		...portalRings('#1c1c1c')
	]
}
Class.bluePortalOfficialV1 = {
	PARENT: 'portalOfficialV1',
	PROPS: [
		{
			POSITION: [20, 0, 0, 0, 1],
			TYPE: ['egg', {COLOR: 'black'}]
		},
		...portalRings()
	]
}
Class.greenPortalOfficialV1 = {
	PARENT: 'portalOfficialV1',
	PROPS: [
		{
			POSITION: [20, 0, 0, 0, 1],
			TYPE: ['egg', {COLOR: 'black'}]
		},
		...portalRings('#1c6620')
	]
}

// Misc
Class.genericDreadnought1 = {
	PARENT: "genericTank",
	BODY: dreadnoughtBody,
	SHAPE: 6,
	COLOR: 'darkGrey',
	SIZE: 22.5,
	SKILL_CAP: Array(10).fill(smshskl+3),
	REROOT_UPGRADE_TREE: "dreadnought_dreadsV1",
}
// Turret damage modifiers:
// Automation secondary: 1x
// Automation main: 1.6x
// Mechanism secondary: 1.12x
// Mechanism main: 1.8x
Class.dreadv1BodyTurret = makeTurret({
	GUNS: [{
		POSITION: [22, 10, 1, 0, 0, 0, 0],
		PROPERTIES: {
			SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.power, { recoil: 0.7 }, g.turret, { size: 0.8, damage: 1.05, speed: 0.4, maxSpeed: 0.4, reload: 0.7 }]),
			TYPE: "bullet"
		}
	}]
}, {limitFov: true, fov: 0.8, independent: true, label: "Turret", extraStats: []})
Class.medicareTurret = {
	PARENT: "genericTank",
	LABEL: "Turret",
	FACING_TYPE: ["spin", {speed: 0.04}],
	INDEPENDENT: true,
	COLOR: 16,
	GUNS: weaponArray([
		{
			POSITION: [8, 9, -0.5, 12.5, 0, 0, 0],
		}, {
			POSITION: [18, 10, 1, 0, 0, 0, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic, g.flankGuard, g.flankGuard, g.flankGuard, g.healer]),
				TYPE: "healerBullet",
				AUTOFIRE: true,
			},
		}
	], 3),
	TURRETS: [{
		POSITION: [13, 0, 0, 0, 360, 1],
		TYPE: "healerSymbol",
	}]
}
Class.medicaidTurret = {
	PARENT: "genericTank",
	LABEL: "Turret",
	FACING_TYPE: ["spin", {speed: 0.04}],
	INDEPENDENT: true,
	COLOR: 16,
	GUNS: weaponArray([
		{
			POSITION: [8, 9, -0.5, 12.5, 0, 0, 0],
		}, {
			POSITION: [18, 10, 1, 0, 0, 0, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic, g.flankGuard, g.flankGuard, g.flankGuard, g.flankGuard, g.healer]),
				TYPE: "healerBullet",
				AUTOFIRE: true,
			},
		}
	], 5),
	TURRETS: [{
		POSITION: [13, 0, 0, 0, 360, 1],
		TYPE: "healerSymbol",
	}]
}
Class.refugeTurret = {
	PARENT: "genericTank",
	LABEL: "Turret",
	FACING_TYPE: ["spin", {speed: 0.04}],
	INDEPENDENT: true,
	COLOR: 16,
	GUNS: weaponArray([
		{
			POSITION: [8, 9, -0.5, 12.5, 0, 0, 0],
		}, {
			POSITION: [18, 10, 1, 0, 0, 0, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic, g.flankGuard, g.flankGuard, g.flankGuard, g.flankGuard, g.healer]),
				TYPE: "healerBullet",
				AUTOFIRE: true,
			},
		}
	], 7),
	TURRETS: [{
		POSITION: [13, 0, 0, 0, 360, 1],
		TYPE: "healerSymbol",
	}]
}
Class.turretedTrap = makeAuto("trap", "Auto-Trap", {size: 7.5, type: 'droneAutoTurret'});
Class.turretedTrap.BODY.RECOIL_MULTIPLIER = 0;

Class.twinTurretedTrap = makeAuto("trap", "Auto-Trap", {size: 7.5, type: 'legionaryTwin'});
Class.twinTurretedTrap.BODY.RECOIL_MULTIPLIER = 0;

Class.swarmTrap = {
	PARENT: "trap",
	GUNS: weaponArray({
		POSITION: [7, 10, 0.4, 7, 0, 60, 0],
		PROPERTIES: {
			SHOOT_SETTINGS: combineStats([g.swarm, {recoil: 0}]),
			TYPE: ["swarm", {INDEPENDENT: true}],
			AUTOFIRE: true,
			STAT_CALCULATOR: "swarm",
		}
	}, 3, 1/3)
};

Class.screwGun = {
    PARENT: "genericTank",
    LABEL: "",
    BODY: {
        FOV: 3,
    },
    CONTROLLERS: ["canRepel", "onlyAcceptInArc", "mapAltToFire", "nearestDifferentMaster"],
    COLOR: 16,
    INDEPENDENT: true,
    HAS_NO_RECOIL: true,
    GUNS: [
        {
            POSITION: [22, 10, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.flankGuard, g.autoTurret]),
                TYPE: "bullet",
            },
        },
    ],
}

// T0
Class.dreadnought_dreadsV1 = {
	PARENT: "genericDreadnought1",
	LABEL: "Dreadnought",
	UPGRADE_LABEL: "Dreads V1",
	EXTRA_SKILL: 18,
}

// T1
Class.swordOfficialV1 = {
	PARENT: "genericDreadnought1",
	LABEL: "Sword",
	UPGRADE_TOOLTIP: "Snipers",
	GUNS: weaponArray({
		POSITION: [20, 7, 1, 0, 0, 0, 0],
		PROPERTIES: {
			SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.dreadv1Generic, g.dreadv1Sniper]),
			TYPE: "bullet"
		}
	}, 3)
}

Class.pacifierOfficialV1 = {
	PARENT: "genericDreadnought1",
	LABEL: "Pacifier",
	UPGRADE_TOOLTIP: "Bullet Spam",
	GUNS: weaponArray({
		POSITION: [15.5, 7.25, 1, 0, 0, 0, 0],
		PROPERTIES: {
			SHOOT_SETTINGS: combineStats([g.basic, g.dreadv1Generic, g.dreadv1Slow]),
			TYPE: "bullet"
		}
	}, 3)
}

Class.invaderOfficialV1 = {
	PARENT: "genericDreadnought1",
	LABEL: "Invader",
	UPGRADE_TOOLTIP: "Drones",
	GUNS: weaponArray({
		POSITION: [5.5, 7.5, 1.3, 7.5, 0, 0, 0],
		PROPERTIES: {
			SHOOT_SETTINGS: combineStats([g.drone, g.overseer, g.dreadv1Drone]),
			TYPE: "drone",
			AUTOFIRE: true,
			SYNCS_SKILLS: true,
			STAT_CALCULATOR: "drone",
			WAIT_TO_CYCLE: true,
			MAX_CHILDREN: 4,
		}
	}, 3)
}

Class.centaurOfficialV1 = {
	PARENT: "genericDreadnought1",
	LABEL: "Centaur",
	UPGRADE_TOOLTIP: "Traps",
	GUNS: weaponArray([
		{
			POSITION: [13, 7, 1, 0, 0, 0, 0],
		}, {
			POSITION: [3, 7, 1.5, 13, 0, 0, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.trap, g.dreadv1Generic, g.dreadv1Slow, g.dreadv1Trap]),
				TYPE: ["trap", {HITS_OWN_TYPE: "never"} ],
				STAT_CALCULATOR: "trap",
			},
		}
	], 3)
}

Class.automationOfficialV1 = {
	PARENT: "genericDreadnought1",
	LABEL: "Automation",
	UPGRADE_TOOLTIP: "Auto Turrets",
	TURRETS: [
		...weaponArray({
			POSITION: [3.5, 8.25, 0, 30, 180, 1],
			TYPE: "dreadv1BodyTurret",
		}, 6),
		{
			POSITION: [9, 0, 0, 0, 360, 1],
			TYPE: ["dreadv1BodyTurret", {GUN_STAT_SCALE: {damage: 1.6}}],
		}
	]
}

Class.juggernautOfficialV1 = {
	PARENT: "genericDreadnought1",
	LABEL: "Juggernaut",
	UPGRADE_TOOLTIP: "Health Buff",
	BODY: {
		HEALTH: 1.7,
		SHIELD: 2.2,
		REGEN: 1.5,
		SPEED: 1.1,
	},
	TURRETS: [{
		POSITION: [22, 0, 0, 0, 0, 0],
		TYPE: ["hexagon", {COLOR: "black"}]
	}]
}
Class.medicareOfficialV1 = {
	PARENT: "genericDreadnought1",
	LABEL: "Medicare",
	UPGRADE_TOOLTIP: "Healing",
	TURRETS: [{
		POSITION: [8, 0, 0, 0, 360, 1],
		TYPE: "medicareTurret",
	}]
}

// T2
Class.sabreOfficialV1 = {
	PARENT: "genericDreadnought1",
	LABEL: "Sabre",
	UPGRADE_TOOLTIP: "Assassins",
	GUNS: weaponArray([
		{
			POSITION: [27, 7, 1, 0, 0, 0, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.assassin, g.dreadv1Generic, g.dreadv1Sniper]),
				TYPE: "bullet"
			}
		}, {
			POSITION: [3.5, 7, -1.4, 9, 0, 0, 0]
		}
	], 3)
}
Class.gladiusOfficialV1 = {
	PARENT: "genericDreadnought1",
	LABEL: "Gladius",
	UPGRADE_TOOLTIP: "Rifles",
	GUNS: weaponArray([
		{
			POSITION: [17, 9, 1, 0, 0, 0, 0]
		}, {
			POSITION: [20, 6, 1, 0, 0, 0, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.rifle, g.dreadv1Generic, g.dreadv1Sniper, {damage: 1.05}]),
				TYPE: "bullet"
			}
		}
	], 3)
}
Class.tarnisherOfficialV1 = {
	PARENT: "genericDreadnought1",
	LABEL: "Tarnisher",
	UPGRADE_TOOLTIP: "Hunters",
	GUNS: weaponArray([
		{
			POSITION: [21, 7, 1, 0, 0, 0, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.hunter, g.hunterSecondary, g.dreadv1Generic, g.dreadv1Sniper]),
				TYPE: "bullet"
			}
		},
		{
			POSITION: [19, 9, 1, 0, 0, 0, 0.25],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.hunter, g.dreadv1Generic, g.dreadv1Sniper]),
				TYPE: "bullet"
			}
		}
	], 3)
}

Class.appeaserOfficialV1 = {
	PARENT: "genericDreadnought1",
	LABEL: "Appeaser",
	UPGRADE_TOOLTIP: "Machine Guns",
	GUNS: weaponArray([
		{
			POSITION: [8.5, 8.875, 1.25, 7, 0, 0, 1/2],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.twin, g.dreadv1Generic, g.dreadv1Slow, {health: 1.13, shudder: 1.2, speed: 0.9, maxSpeed: 0.7, range: 0.7, size: 0.6}]),
				TYPE: "bullet"
			}
		}, {
			POSITION: [8.5, 7.875, 1.2, 9, 0, 0, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.twin, g.dreadv1Generic, g.dreadv1Slow, {health: 1.13, shudder: 1.2, speed: 0.9, maxSpeed: 0.7, range: 0.7, size: 0.6 * 8.5 / 7.5}]),
				TYPE: "bullet"
			}
		}
	], 3)
}
Class.peacekeeperOfficialV1 = {
	PARENT: "genericDreadnought1",
	LABEL: "Peacekeeper",
	UPGRADE_TOOLTIP: "Heavy Bullets",
	GUNS: weaponArray({
		POSITION: [17.5, 9, 1, 0, 0, 0, 0],
		PROPERTIES: {
			SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.destroyer, g.dreadv1Generic, g.dreadv1Slow, {reload: 1.3, health: 1.2, range: 1.1}]),
			TYPE: "bullet",
		}
	}, 3)
}
Class.diplomatOfficialV1 = {
	PARENT: "genericDreadnought1",
	LABEL: "Diplomat",
	UPGRADE_TOOLTIP: "Triplets",
	GUNS: weaponArray([
		{
			POSITION: [15.25, 4.75, 1, 0, 3, 0, 0.5],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.triplet, g.dreadv1Generic, g.dreadv1Slow, {range: 0.9}]),
				TYPE: "bullet"
			}
		}, {
			POSITION: [15.25, 4.75, 1, 0, -3, 0, 0.5],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.triplet, g.dreadv1Generic, g.dreadv1Slow, {range: 0.9}]),
				TYPE: "bullet"
			}
		}, {
			POSITION: [16.25, 4.75, 1, 0, 0, 0, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.triplet, g.dreadv1Generic, g.dreadv1Slow, {range: 0.9}]),
				TYPE: "bullet"
			}
		}
	], 3)
}

Class.inquisitorOfficialV1 = {
	PARENT: "genericDreadnought1",
	LABEL: "Inquisitor",
	UPGRADE_TOOLTIP: "Drones",
	GUNS: weaponArray({
		POSITION: [7, 7.5, 1.3, 7.5, 0, 0, 0],
		PROPERTIES: {
			SHOOT_SETTINGS: combineStats([g.drone, g.overseer, g.dreadv1Drone, {speed: 0.95, maxSpeed: 0.95, damage: 0.93, health: 0.92}]),
			TYPE: "drone",
			AUTOFIRE: true,
			SYNCS_SKILLS: true,
			STAT_CALCULATOR: "drone",
			WAIT_TO_CYCLE: true,
			MAX_CHILDREN: 5,
		}
	}, 3)
}
Class.assailantOfficialV1 = {
	PARENT: "genericDreadnought1",
	LABEL: "Assailant",
	UPGRADE_TOOLTIP: "Minions",
	GUNS: weaponArray([
		{
			POSITION: [14.25, 9, 1, 0, 0, 0, 0],
		}, {
			POSITION: [1.5, 10, 1, 14.25, 0, 0, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.spawner, g.overseer, g.dreadv1Drone, {damage: 0.45}]),
				TYPE: ["minion", {GUN_STAT_SCALE: {reload: 1.5, health: 0.75, speed: 0.8, maxSpeed: 0.8}}],
				STAT_CALCULATOR: "drone",
				AUTOFIRE: true,
				SYNCS_SKILLS: true,
				WAIT_TO_CYCLE: true,
				MAX_CHILDREN: 4,
			}
		}, {
			POSITION: [11.5, 10, 1, 0, 0, 0, 0]
		}
	], 3)
}
Class.infiltratorOfficialV1 = {
	PARENT: "genericDreadnought1",
	LABEL: "Infiltrator",
	UPGRADE_TOOLTIP: "Swarms",
	GUNS: weaponArray([
		{
			POSITION: [7, 6, 0.6, 5.5, 2.8, 0, 0.5],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.swarm, g.carrier, { reload: 2, speed: 0.5, range: 0.9, health: 0.85}]),
				TYPE: "swarm",
				STAT_CALCULATOR: "swarm"
			}
		}, {
			POSITION: [7, 6, 0.6, 5.5, -2.8, 0, 0.5],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.swarm, g.carrier, { reload: 2, speed: 0.5, range: 0.9, health: 0.85}]),
				TYPE: "swarm",
				STAT_CALCULATOR: "swarm"
			}
		}, {
			POSITION: [7, 6, 0.6, 8, 0, 0, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.swarm, g.carrier, { reload: 2, speed: 0.5, range: 0.9, health: 0.85}]),
				TYPE: "swarm",
				STAT_CALCULATOR: "swarm"
			}
		}
	], 3)
}

Class.cerberusOfficialV1 = {
	PARENT: "genericDreadnought1",
	LABEL: "Cerberus",
	UPGRADE_TOOLTIP: "Trap Spam",
	GUNS: weaponArray([
		{
			POSITION: [13.25, 2.25, 1, 0, 4, 0, 0]
		}, {
			POSITION: [1.75, 2.25, 1.7, 13.25, 4, 0, 2/3],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.trap, g.dreadv1Generic, g.dreadv1Slow, g.dreadv1Trap, { reload: 1.22, health: 0.67, damage: 0.7 }]),
				TYPE: ["trap", {HITS_OWN_TYPE: "never"} ],
				STAT_CALCULATOR: "trap",
			},
		}, {
			POSITION: [13.25, 2.25, 1, 0, -4, 0, 0]
		}, {
			POSITION: [1.75, 2.25, 1.7, 13.25, -4, 0, 1/3],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.trap, g.dreadv1Generic, g.dreadv1Slow, g.dreadv1Trap, { reload: 1.22, health: 0.67, damage: 0.7 }]),
				TYPE: ["trap", {HITS_OWN_TYPE: "never"} ],
				STAT_CALCULATOR: "trap"
			}
		}, {
			POSITION: [14.75, 3, 1, 0, 0, 0, 0]
		}, {
			POSITION: [2, 3, 1.7, 14.75, 0, 0, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.trap, g.dreadv1Generic, g.dreadv1Slow, g.dreadv1Trap, { reload: 1.22, health: 0.67, damage: 0.7 }]),
				TYPE: ["trap", {HITS_OWN_TYPE: "never"} ],
				STAT_CALCULATOR: "trap"
			}
		}
	], 3)
}
Class.minotaurOfficialV1 = {
	PARENT: "genericDreadnought1",
	LABEL: "Minotaur",
	UPGRADE_TOOLTIP: "Blocks",
	GUNS: weaponArray([
		{
			POSITION: [13, 9.5, 1, 0, 0, 0, 0],
		}, {
			POSITION: [3, 9.5, 1.6, 13, 0, 0, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.trap, g.setTrap, g.dreadv1Generic, g.dreadv1Slow, g.dreadv1Trap, { damage: 0.9, reload: 1.55, range: 0.93, health: 1.55 }]),
				TYPE: ["unsetTrap", {HITS_OWN_TYPE: "never"} ],
				STAT_CALCULATOR: "block"
			}
		}
	], 3)
}
Class.sirenOfficialV1 = {
	PARENT: "genericDreadnought1",
	LABEL: "Siren",
	UPGRADE_TOOLTIP: "Auto-Traps",
	GUNS: weaponArray([
		{
			POSITION: [6, 7, -1.5, 7, 0, 0, 0],
		}, {
			POSITION: [3, 7, 1.5, 13, 0, 0, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.trap, g.dreadv1Generic, g.dreadv1Slow, g.dreadv1Trap]),
				TYPE: ["turretedTrap", {HITS_OWN_TYPE: "never"} ],
				STAT_CALCULATOR: "trap",
			}
		}
	], 3)
}

Class.mechanismOfficialV1 = {
	PARENT: "genericDreadnought1",
	LABEL: "Mechanism",
	UPGRADE_TOOLTIP: "Auto Turrets",
	TURRETS: [
		...weaponArray({
			POSITION: [4, 8.25, 0, 30, 180, 1],
		TYPE: ["dreadv1BodyTurret", {GUN_STAT_SCALE: {damage: 1.12}}],
		}, 6),
		{
			POSITION: [9.5, 0, 0, 0, 360, 1],
			TYPE: ["dreadv1BodyTurret", {GUN_STAT_SCALE: {damage: 1.8}}],
		}
	]
}

Class.behemothOfficialV1 = {
	PARENT: "genericDreadnought1",
	LABEL: "Behemoth",
	UPGRADE_TOOLTIP: "Health Buff",
	BODY: {
		HEALTH: 2.3,
		SHIELD: 2.8,
		REGEN: 1.7,
		SPEED: 1.15,
	},
	TURRETS: [{
		POSITION: [23.5, 0, 0, 0, 0, 0],
		TYPE: ["hexagon", {COLOR: "black"}]
	}]
}
Class.medicaidOfficialV1 = {
	PARENT: "genericDreadnought1",
	LABEL: "Medicaid",
	UPGRADE_TOOLTIP: "Healing",
	TURRETS: [{
		POSITION: [8, 0, 0, 0, 360, 1],
		TYPE: "medicaidTurret",
	}]
}
// T3
Class.lanceOfficialV1 = {
	PARENT: "genericDreadnought1",
	LABEL: "Lance",
	UPGRADE_TOOLTIP: "Rangers",
	GUNS: weaponArray([
  {
		POSITION: [30, 7, 1, 0, 0, 0, 0],
		PROPERTIES: {
			SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.assassin, g.dreadv1Generic, g.dreadv1Sniper, {speed: 1.3, damage: 1.2, pen: 1.3}]),
			TYPE: "bullet"
		}
	}, {
    POSITION: [3.5, 7, -1.4, 9, 0, 0, 0]
  }], 3)
}
Class.screwOfficialV1 = {
	PARENT: "genericDreadnought1",
	LABEL: "Screw",
	UPGRADE_TOOLTIP: "Wrenches",
	GUNS: weaponArray([{
        POSITION: [50, 6, 1, 0, 0, 0, 0]
    }, {
        POSITION: [5, 8, -1.4, 8, 0, 0, 0]
    }], 3),
	TURRETS: weaponArray([{
        POSITION: [5.5, 35, 0, 0, 190, 1],
        TYPE: "screwGun"
    }, {
        POSITION: [5.5, 42.5, 0, 0, 190, 1],
        TYPE: "screwGun"
    }, {
        POSITION: [5.5, 50, 0, 0, 190, 1],
        TYPE: "screwGun"
    }], 3)
}
Class.carbineOfficialV1 = {
	PARENT: "genericDreadnought1",
	LABEL: "Carbine",
	UPGRADE_TOOLTIP: "Stalkers",
	INVISIBLE: [0.08, 0.03],
	GUNS: weaponArray([
		{
			POSITION: [27, 8, -1.4, 0, 0, 0, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.assassin, g.dreadv1Generic, g.dreadv1Sniper]),
				TYPE: "bullet"
			}
		}
	], 3)
}
Class.warriorOfficialV1 = {
	PARENT: "genericDreadnought1",
	LABEL: "Warrior",
	UPGRADE_TOOLTIP: "Crossbows",
	GUNS: weaponArray([
        {
            POSITION: [15, 2.5, 1, 0, 4.5, 0, 2/3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.rifle, g.crossbow, { speed: 0.7, maxSpeed: 0.7 }, { recoil: 0.5 }]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: [15, 2.5, 1, 0, -4.5, 0, 2/3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.rifle, g.crossbow, { speed: 0.7, maxSpeed: 0.7 }, { recoil: 0.5 }]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: [20, 3.5, 1, 0, 3, 0, 1/3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.rifle, g.crossbow, { speed: 0.7, maxSpeed: 0.7 }, { recoil: 0.5 }]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: [20, 3.5, 1, 0, -3, 0, 1/3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.rifle, g.crossbow, { speed: 0.7, maxSpeed: 0.7 }, { recoil: 0.5 }]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: [24, 5, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.rifle, g.crossbow, { speed: 0.7, maxSpeed: 0.7 }, { recoil: 0.5 }]),
                TYPE: "bullet"
            }
        }
	], 3)
}
Class.duelistOfficialV1 = {
	PARENT: "genericDreadnought1",
	LABEL: "Duelist",
	UPGRADE_TOOLTIP: "Duelists",
	GUNS: weaponArray([
		{
			POSITION: [17, 9, 1, 0, 0, 0, 0]
		}, {
			POSITION: [20, 6, 1, 0, 0, 0, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.rifle, g.dreadv1Generic, g.dreadv1Sniper, {damage: 1.05}]),
				TYPE: ["bullet", { MOTION_TYPE: "accel" }]
			}
		}, {
			POSITION: [22, 3, 0.001, 0, 0, 0, 0]
		},
	], 3)
}
Class.toeOfficialV1 = {
	PARENT: "genericDreadnought1",
	LABEL: "Toe",
	UPGRADE_TOOLTIP: "Railguns",
	GUNS: weaponArray([
		{
     		POSITION: [20, 8, 1, 0, 0, 0, 0]
    	},
    	{
      		POSITION: [24, 5, 1, 0, 0, 0, 0],
      		PROPERTIES: {
        		SHOOT_SETTINGS: combineStats([g.basic, g.sniper, { reload: 5, size: 0.9, health: 0.9, damage: 1.35, pen: 1.25, speed: 1.5, maxSpeed: 1.04, density: 3.5 }]),
        		TYPE: "bullet"
      		},
    	},
    	{
    		POSITION: [4, 8, -1.5, 8, 0, 0, 0]
	    }
	], 3)
}
Class.raptureOfficialV1 = {
	PARENT: "genericDreadnought1",
	LABEL: "Rapture",
	UPGRADE_TOOLTIP: "Predators",
	GUNS: weaponArray([
		{
			POSITION: [23, 5, 1, 0, 0, 0, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.hunter, g.predator, g.hunterSecondary, g.dreadv1Generic, g.dreadv1Sniper]),
				TYPE: "bullet"
			}
		},
		{
			POSITION: [21, 7, 1, 0, 0, 0, 0.15],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.hunter, g.predator, g.hunterSecondary, g.dreadv1Generic, g.dreadv1Sniper]),
				TYPE: "bullet"
			}
		},
		{
			POSITION: [19, 9, 1, 0, 0, 0, 0.3],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.hunter, g.predator, g.dreadv1Generic, g.dreadv1Sniper]),
				TYPE: "bullet"
			}
		}
	], 3)
}
Class.demomanOfficialV1 = {
	PARENT: "genericDreadnought1",
	LABEL: "Demoman",
	UPGRADE_TOOLTIP: "Ordnances",
	GUNS: weaponArray([
		{
            POSITION: [17, 3, 1, 0, -3.25, -6, 0.25],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.artillery]),
                TYPE: "bullet",
                LABEL: "Secondary",
            },
        },
        {
            POSITION: [17, 3, 1, 0, 3.25, 6, 0.75],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.artillery]),
                TYPE: "bullet",
                LABEL: "Secondary",
            },
        },
		{
			POSITION: [21, 7, 1, 0, 0, 0, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.hunter, g.hunterSecondary, g.dreadv1Generic, g.dreadv1Sniper]),
				TYPE: "bullet"
			}
		},
		{
			POSITION: [19, 9, 1, 0, 0, 0, 0.25],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.hunter, g.dreadv1Generic, g.dreadv1Sniper]),
				TYPE: "bullet"
			}
		}
	], 3)
}
Class.rummagerOfficialV1 = {
	PARENT: "genericDreadnought1",
	LABEL: "Rummager",
	UPGRADE_TOOLTIP: "Mega Hunters",
	GUNS: weaponArray([
		{
			POSITION: [21, 9, 1, 0, 0, 0, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.sniper, g.hunter, g.hunterSecondary, g.dreadv1Generic, g.dreadv1Sniper]),
				TYPE: "bullet"
			}
		},
		{
			POSITION: [19, 11, 1, 0, 0, 0, 0.25],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.sniper, g.hunter, g.dreadv1Generic, g.dreadv1Sniper]),
				TYPE: "bullet"
			}
		}
	], 3)
}

Class.ravagerOfficialV1 = {
	PARENT: "genericDreadnought1",
	LABEL: "Ravager",
	UPGRADE_TOOLTIP: "Machine Guns",
	GUNS: weaponArray([
		{
			POSITION: [8.5, 9.875, 1.3, 5, 0, 0, 2/3],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.twin, g.dreadv1Generic, g.dreadv1Slow, {health: 1.13, shudder: 1.2, speed: 0.9, maxSpeed: 0.7, range: 0.7, size: 0.575}]),
				TYPE: "bullet"
			}
		}, {
			POSITION: [8.5, 8.875, 1.25, 7, 0, 0, 1/3],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.twin, g.dreadv1Generic, g.dreadv1Slow, {health: 1.13, shudder: 1.2, speed: 0.9, maxSpeed: 0.7, range: 0.7, size: 0.6}]),
				TYPE: "bullet"
			}
		}, {
			POSITION: [8.5, 7.875, 1.2, 9, 0, 0, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.twin, g.dreadv1Generic, g.dreadv1Slow, {health: 1.13, shudder: 1.2, speed: 0.9, maxSpeed: 0.7, range: 0.7, size: 0.6 * 8.5 / 7.5}]),
				TYPE: "bullet"
			}
		}
	], 3)
}
Class.dopamineOfficialV1 = {
	PARENT: "genericDreadnought1",
	LABEL: "Dopamine",
	UPGRADE_TOOLTIP: "Sprayers",
	GUNS: weaponArray([
		{
			POSITION: [19, 8, 1, 0, 0, 0, 0.25],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.lowPower, g.pelleter, g.dreadv1Generic, g.dreadv1Slow, {health: 1.13, shudder: 1.2, speed: 0.9, maxSpeed: 0.7, range: 0.7, size: 0.6}]),
				TYPE: "bullet",
			},
		}, {
			POSITION: [8.5, 8.875, 1.25, 7, 0, 0, 0.5],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.twin, g.dreadv1Generic, g.dreadv1Slow, {health: 1.13, shudder: 1.2, speed: 0.9, maxSpeed: 0.7, range: 0.7, size: 0.6}]),
				TYPE: "bullet"
			}
		}, {
			POSITION: [8.5, 7.875, 1.2, 9, 0, 0, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.twin, g.dreadv1Generic, g.dreadv1Slow, {health: 1.13, shudder: 1.2, speed: 0.9, maxSpeed: 0.7, range: 0.7, size: 0.6 * 8.5 / 7.5}]),
				TYPE: "bullet"
			}
		}
	], 3)
}
Class.successorOfficialV1 = {
	PARENT: "genericDreadnought1",
	LABEL: "Successor",
	UPGRADE_TOOLTIP: "Gunners",
	GUNS: weaponArray([
		{
			POSITION: [19, 2, 1, 0, -2.5, 0, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.power, g.twin, { speed: 0.7, maxSpeed: 0.7 }, g.flankGuard, { recoil: 1.8 }]),
				TYPE: "bullet",
			},
		},
		{
			POSITION: [19, 2, 1, 0, 2.5, 0, 3/6],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.power, g.twin, { speed: 0.7, maxSpeed: 0.7 }, g.flankGuard, { recoil: 1.8 }]),
				TYPE: "bullet",
			},
		},
		{
			POSITION: [17, 2, 1, 0, -2.5, 0, 1/6],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.power, g.twin, { speed: 0.7, maxSpeed: 0.7 }, g.flankGuard, { recoil: 1.8 }]),
				TYPE: "bullet",
			},
		},
		{
			POSITION: [17, 2, 1, 0, 2.5, 0, 4/6],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.power, g.twin, { speed: 0.7, maxSpeed: 0.7 }, g.flankGuard, { recoil: 1.8 }]),
				TYPE: "bullet",
			},
		},
		{
			POSITION: [15, 2, 1, 0, -2.5, 0, 2/6],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.power, g.twin, { speed: 0.7, maxSpeed: 0.7 }, g.flankGuard, { recoil: 1.8 }]),
				TYPE: "bullet",
			},
		},
		{
			POSITION: [15, 2, 1, 0, 2.5, 0, 5/6],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.power, g.twin, { speed: 0.7, maxSpeed: 0.7 }, g.flankGuard, { recoil: 1.8 }]),
				TYPE: "bullet",
			},
		},
		{
			POSITION: [12, 11, 1, 0, 0, 0, 0],
		},
	], 3)
}
Class.conciliatorOfficialV1 = {
	PARENT: "genericDreadnought1",
	LABEL: "Conciliator",
	UPGRADE_TOOLTIP: "Heavier Bullets",
	GUNS: weaponArray({
		POSITION: [19.5, 10, 1, 0, 0, 0, 0],
		PROPERTIES: {
			SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.destroyer, g.annihilator, g.dreadv1Generic, g.dreadv1Slow, {reload: 1.3, health: 1.3, range: 1.1}]),
			TYPE: "bullet",
		}
	}, 3)
}
Class.statespersonOfficialV1 = {
	PARENT: "genericDreadnought1",
	LABEL: "Statesperson",
	UPGRADE_TOOLTIP: "Launchers",
	GUNS: weaponArray([
		{
    	    POSITION: [10, 7, 1, 9, 0, 0, 0],
	    },
    	{
	        POSITION: [17, 9, 1, 0, 0, 0, 0],
        	PROPERTIES: {
    	        SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.launcher, g.dreadv1Generic, g.dreadv1Slow, {reload: 1.3, health: 1.3, range: 1.1}]),
	            TYPE: "minimissile",
            	STAT_CALCULATOR: "sustained",
    		},
    	}
	], 3)
}
Class.saviorOfficialV1 = {
	PARENT: "genericDreadnought1",
	LABEL: "Savior",
	UPGRADE_TOOLTIP: "Shotguns",
	GUNS: weaponArray([
        {
            POSITION: [4, 3, 1, 11, -3, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.shotgun]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [4, 3, 1, 11, 3, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.shotgun]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [4, 4, 1, 13, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.shotgun]),
                TYPE: "casing",
            },
        },
        {
            POSITION: [1, 4, 1, 12, -1, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.shotgun]),
                TYPE: "casing",
            },
        },
        {
            POSITION: [1, 4, 1, 11, 1, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.shotgun]),
                TYPE: "casing",
            },
        },
        {
            POSITION: [1, 3, 1, 13, -1, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.shotgun]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [1, 3, 1, 13, 1, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.shotgun]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [1, 2, 1, 13, 2, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.shotgun]),
                TYPE: "casing",
            },
        },
        {
            POSITION: [1, 2, 1, 13, -2, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.shotgun]),
                TYPE: "casing",
            },
        },
        {
            POSITION: [15, 9, 1, 6, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.shotgun, g.fake]),
                TYPE: "casing",
            },
        },
        {
            POSITION: [8, 9, -1.3, 4, 0, 0, 0],
        },
    ], 3)
}
Class.presidentOfficialV1 = {
	PARENT: "genericDreadnought1",
	LABEL: "President",
	UPGRADE_TOOLTIP: "Quintuplets",
	GUNS: weaponArray([
		{
			POSITION: [14.5, 4.75, 1, 0, 2.75, 0, 2/3],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.triplet, g.dreadv1Generic, g.dreadv1Slow, {range: 0.9}]),
				TYPE: "bullet"
			}
		}, {
			POSITION: [14.5, 4.75, 1, 0, -2.75, 0, 2/3],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.triplet, g.dreadv1Generic, g.dreadv1Slow, {range: 0.9}]),
				TYPE: "bullet"
			}
		}, {
			POSITION: [15.25, 4.75, 1, 0, 2, 0, 1/3],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.triplet, g.dreadv1Generic, g.dreadv1Slow, {range: 0.9}]),
				TYPE: "bullet"
			}
		}, {
			POSITION: [15.25, 4.75, 1, 0, -2, 0, 1/3],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.triplet, g.dreadv1Generic, g.dreadv1Slow, {range: 0.9}]),
				TYPE: "bullet"
			}
		}, {
			POSITION: [16.25, 4.75, 1, 0, 0, 0, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.triplet, g.dreadv1Generic, g.dreadv1Slow, {range: 0.9}]),
				TYPE: "bullet"
			}
		}
	], 3)
}
Class.moderatorOfficialV1 = {
	PARENT: "genericDreadnought1",
	LABEL: "Moderator",
	UPGRADE_TOOLTIP: "Nailguns",
	GUNS: weaponArray([
		{
			POSITION: [19, 2, 1, 0, -2.5, 0, 0.25],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.power, g.twin, g.nailgun]),
				TYPE: "bullet",
			},
		},
		{
			POSITION: [19, 2, 1, 0, 2.5, 0, 0.75],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.power, g.twin, g.nailgun]),
				TYPE: "bullet",
			},
		},
		{
			POSITION: [20, 2, 1, 0, 0, 0, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.power, g.twin, g.nailgun]),
				TYPE: "bullet",
			},
		},
		{
			POSITION: [5.5, 7, -1.8, 6.5, 0, 0, 0],
		},
	], 3)
}
Class.personelOfficialV1 = {
	PARENT: "genericDreadnought1",
	LABEL: "Personel",
	UPGRADE_TOOLTIP: "Spread Shots",
	GUNS: weaponArray([
		{
			POSITION: [16, 4, 1, 0, -0.5, -15, 3 / 6],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.artillery, g.twin, g.spreadshot]),
				TYPE: "bullet",
				LABEL: "Spread"
			}
		},
		{
			POSITION: [16, 4, 1, 0, 0.5, 15, 3 / 6],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.artillery, g.twin, g.spreadshot]),
				TYPE: "bullet",
				LABEL: "Spread"
			}
		},
		{
			POSITION: [17.5, 4, 1, 0, -0.5, -10, 2 / 6],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.artillery, g.twin, g.spreadshot]),
				TYPE: "bullet",
				LABEL: "Spread"
			}
		},
		{
			POSITION: [17.5, 4, 1, 0, 0.5, 10, 2 / 6],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.artillery, g.twin, g.spreadshot]),
				TYPE: "bullet",
				LABEL: "Spread"
			}
		},
		{
			POSITION: [19, 4, 1, 0, -1, -5, 1 / 6],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.artillery, g.twin, g.spreadshot]),
				TYPE: "bullet",
				LABEL: "Spread"
			}
		},
		{
			POSITION: [19, 4, 1, 0, 1, 5, 1 / 6],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.artillery, g.twin, g.spreadshot]),
				TYPE: "bullet",
				LABEL: "Spread"
			}
		},
		{
			POSITION: [12, 8, 1, 8, 0, 0, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.spreadshotMain, g.spreadshot]),
				TYPE: "bullet"
			}
		}
	], 3)
}

Class.proberOfficialV1 = {
	PARENT: "genericDreadnought1",
	LABEL: "Prober",
	UPGRADE_TOOLTIP: "Drones",
	GUNS: weaponArray({
		POSITION: [9, 8, 1.25, 7.5, 0, 0, 0],
		PROPERTIES: {
			SHOOT_SETTINGS: combineStats([g.drone, g.overseer, g.dreadv1Drone, {speed: 0.95, maxSpeed: 0.95, damage: 0.9, health: 0.92}]),
			TYPE: "drone",
			AUTOFIRE: true,
			SYNCS_SKILLS: true,
			STAT_CALCULATOR: "drone",
			WAIT_TO_CYCLE: true,
			MAX_CHILDREN: 7,
		}
	}, 3)
}
Class.dictatorOfficialV1 = {
	PARENT: "genericDreadnought1",
	LABEL: "Dictator",
	UPGRADE_TOOLTIP: "Overdriven Drones",
	GUNS: weaponArray([{
		POSITION: [7, 7.5, 1.3, 7.5, 0, 0, 0],
		PROPERTIES: {
			SHOOT_SETTINGS: combineStats([g.drone, g.overseer, g.dreadv1Drone, {speed: 0.95, maxSpeed: 0.95, damage: 0.93, health: 0.92}]),
			TYPE: "turretedDrone",
			AUTOFIRE: true,
			SYNCS_SKILLS: true,
			STAT_CALCULATOR: "drone",
			WAIT_TO_CYCLE: true,
			MAX_CHILDREN: 3,
		}
	}, {
		POSITION: [7, 5, 1.3, 5, 0, 0, 0],
		PROPERTIES: {
			COLOR: "darkGrey"
		}
	}], 3)
}
Class.fatassOfficialV1 = {
	PARENT: "genericDreadnought1",
	LABEL: "FATASS",
	UPGRADE_TOOLTIP: "Big Cheese Drones",
	GUNS: weaponArray({
		POSITION: [16, 10, 1.4, 0, 0, 0, 0],
		PROPERTIES: {
			SHOOT_SETTINGS: combineStats([g.drone, g.bigCheese, g.dreadv1Drone, {speed: 0.95, maxSpeed: 0.95, damage: 0.93, health: 0.92}]),
			TYPE: "drone",
			AUTOFIRE: true,
			SYNCS_SKILLS: true,
			STAT_CALCULATOR: "drone",
			WAIT_TO_CYCLE: true,
			MAX_CHILDREN: 1,
		},
	}, 3)
}
Class.attackerOfficialV1 = {
	PARENT: "genericDreadnought1",
	LABEL: "Attacker",
	UPGRADE_TOOLTIP: "Twin Minions",
	GUNS: weaponArray([
		{
			POSITION: [14.25, 9, 1, 0, 0, 0, 0],
		}, {
			POSITION: [1.5, 10, 1, 14.25, 0, 0, 0],
			PROPERTIES: {
				MAX_CHILDREN: 4,
				SHOOT_SETTINGS: combineStats([g.spawner, g.overseer, g.dreadv1Drone, {damage: 0.6}]),
				TYPE: ["twinMinion", {GUN_STAT_SCALE: {reload: 1.333, health: 0.7, speed: 0.8, maxSpeed: 0.8}}],
				STAT_CALCULATOR: "drone",
				AUTOFIRE: true,
				SYNCS_SKILLS: true
			}
		}, {
			POSITION: [11.5, 10, 1, 0, 0, 0, 0]
		}, {
			POSITION: [12.5, 3, 1, 0, 3, 0, 0]
		}, {
			POSITION: [12.5, 3, 1, 0, -3, 0, 0]
		}
	], 3)
}
Class.defenderOfficialV1 = {
	PARENT: "genericDreadnought1",
	LABEL: "Defender",
	UPGRADE_TOOLTIP: "Machine Minions",
	GUNS: weaponArray([
		{
			POSITION: [14.25, 9, 1, 0, 0, 0, 0],
		}, {
			POSITION: [1.5, 10, 1, 14.25, 0, 0, 0],
			PROPERTIES: {
				MAX_CHILDREN: 4,
				SHOOT_SETTINGS: combineStats([g.spawner, g.overseer, g.dreadv1Drone, {damage: 0.6}]),
				TYPE: ["machineMinion", {GUN_STAT_SCALE: {reload: 1.333, health: 0.7, speed: 0.8, maxSpeed: 0.8}}],
				STAT_CALCULATOR: "drone",
				AUTOFIRE: true,
				SYNCS_SKILLS: true
			}
		}, {
			POSITION: [11.5, 10, 1, 0, 0, 0, 0]
		}, {
			POSITION: [12.5, 4, 1.8, 0, 0, 0, 0]
		}
	], 3)
}
Class.coallesceOfficialV1 = {
	PARENT: "genericDreadnought1",
	LABEL: "Coallesce",
	UPGRADE_TOOLTIP: "Machine Minions",
	GUNS: weaponArray([
		{
			POSITION: [14.25, 9, 1, 0, 0, 0, 0],
		}, {
			POSITION: [1.5, 10, 1, 14.25, 0, 0, 0],
			PROPERTIES: {
				MAX_CHILDREN: 4,
				SHOOT_SETTINGS: combineStats([g.spawner, g.overseer, g.dreadv1Drone, {damage: 0.6}]),
				TYPE: ["thrusterMinion", {GUN_STAT_SCALE: {reload: 1.333, health: 0.7, speed: 0.8, maxSpeed: 0.8}}],
				STAT_CALCULATOR: "drone",
				AUTOFIRE: true,
				SYNCS_SKILLS: true
			}
		}, {
			POSITION: [11.5, 10, 1, 0, 0, 0, 0]
		}, {
			POSITION: [12.5, 3, 1, 0, 1, 10, 0]
		}, {
			POSITION: [12.5, 3, 1, 0, -1, -10, 0]
		}
	], 3)
}
Class.theifOfficialV1 = {
	PARENT: "genericDreadnought1",
	LABEL: "Theif",
	UPGRADE_TOOLTIP: "Swarms",
	GUNS: weaponArray([
		{
			POSITION: [7, 6, 0.6, 7.5, 1.4, 0, 2/3],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.swarm, g.carrier, { reload: 2, speed: 0.5, range: 0.9, health: 0.85}]),
				TYPE: "swarm",
				STAT_CALCULATOR: "swarm"
			}
		}, {
			POSITION: [7, 6, 0.6, 7.5, -1.4, 0, 2/3],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.swarm, g.carrier, { reload: 2, speed: 0.5, range: 0.9, health: 0.85}]),
				TYPE: "swarm",
				STAT_CALCULATOR: "swarm"
			}
		}, {
			POSITION: [7, 6, 0.6, 5.5, 2.8, 0, 1/3],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.swarm, g.carrier, { reload: 2, speed: 0.5, range: 0.9, health: 0.85}]),
				TYPE: "swarm",
				STAT_CALCULATOR: "swarm"
			}
		}, {
			POSITION: [7, 6, 0.6, 5.5, -2.8, 0, 1/3],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.swarm, g.carrier, { reload: 2, speed: 0.5, range: 0.9, health: 0.85}]),
				TYPE: "swarm",
				STAT_CALCULATOR: "swarm"
			}
		}, {
			POSITION: [7, 6, 0.6, 8, 0, 0, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.swarm, g.carrier, { reload: 2, speed: 0.5, range: 0.9, health: 0.85}]),
				TYPE: "swarm",
				STAT_CALCULATOR: "swarm"
			}
		}
	], 3)
}
Class.banditOfficialV1 = {
	PARENT: "genericDreadnought1",
	LABEL: "bandit",
	UPGRADE_TOOLTIP: "Automated Swarms",
	GUNS: weaponArray([
		{
			POSITION: [7, 6, 0.6, 5.5, 2.8, 0, 0.5],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.swarm, g.carrier, { reload: 0.5, speed: 0.5, range: 0.9, health: 0.85}]),
				TYPE: "autoswarm",
				STAT_CALCULATOR: "swarm",
				COLOR: "red"
			}
		}, {
			POSITION: [7, 6, 0.6, 5.5, -2.8, 0, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.swarm, g.carrier, { reload: 0.5, speed: 0.5, range: 0.9, health: 0.85}]),
				TYPE: "autoswarm",
				STAT_CALCULATOR: "swarm",
				COLOR: "red"
			}
		}
	], 3)
}
Class.pirateOfficialV1 = {
	PARENT: "genericDreadnought1",
	LABEL: "Pirate",
	UPGRADE_TOOLTIP: "Bees/Swarms",
	GUNS: weaponArray([
		{
			POSITION: [7, 6, 0.6, 5.5, 2.8, 0, 0.5],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.swarm, g.carrier, { reload: 2, speed: 0.5, range: 0.9, health: 0.85}]),
				TYPE: "swarm",
				STAT_CALCULATOR: "swarm"
			}
		}, {
			POSITION: [7, 6, 0.6, 5.5, -2.8, 0, 0.5],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.swarm, g.carrier, { reload: 2, speed: 0.5, range: 0.9, health: 0.85}]),
				TYPE: "swarm",
				STAT_CALCULATOR: "swarm"
			}
		}, {
			POSITION: [7, 6, 1, 6.5, 0, 0, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.swarm, g.carrier, { reload: 1.5, speed: 0.5, range: 0.9, health: 0.85}]),
				TYPE: "bee",
				STAT_CALCULATOR: "swarm"
			}
		}
	], 3)
}
Class.ogreOfficialV1 = {
	PARENT: "genericDreadnought1",
	LABEL: "Ogre",
	UPGRADE_TOOLTIP: "Spammier Traps",
	GUNS: weaponArray([
		{
			POSITION: [12.25, 2.25, 1, 0, -5, 0, 0]
		}, {
			POSITION: [1.75, 2.25, 1.7, 12.25, -5, 0, 4/5],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.trap, g.dreadv1Generic, g.dreadv1Slow, g.dreadv1Trap, { reload: 1.22, health: 0.67, damage: 0.7 }]),
				TYPE: ["trap", {HITS_OWN_TYPE: "never"} ],
				STAT_CALCULATOR: "trap",
			},
		}, {
			POSITION: [12.25, 2.25, 1, 0, 5, 0, 0]
		}, {
			POSITION: [1.75, 2.25, 1.7, 12.25, 5, 0, 3/5],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.trap, g.dreadv1Generic, g.dreadv1Slow, g.dreadv1Trap, { reload: 1.22, health: 0.67, damage: 0.7 }]),
				TYPE: ["trap", {HITS_OWN_TYPE: "never"} ],
				STAT_CALCULATOR: "trap",
			},
		}, {
			POSITION: [13.25, 2.25, 1, 0, 4, 0, 0]
		}, {
			POSITION: [1.75, 2.25, 1.7, 13.25, 4, 0, 2/5],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.trap, g.dreadv1Generic, g.dreadv1Slow, g.dreadv1Trap, { reload: 1.22, health: 0.67, damage: 0.7 }]),
				TYPE: ["trap", {HITS_OWN_TYPE: "never"} ],
				STAT_CALCULATOR: "trap",
			},
		}, {
			POSITION: [13.25, 2.25, 1, 0, -4, 0, 0]
		}, {
			POSITION: [1.75, 2.25, 1.7, 13.25, -4, 0, 1/5],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.trap, g.dreadv1Generic, g.dreadv1Slow, g.dreadv1Trap, { reload: 1.22, health: 0.67, damage: 0.7 }]),
				TYPE: ["trap", {HITS_OWN_TYPE: "never"} ],
				STAT_CALCULATOR: "trap"
			}
		}, {
			POSITION: [14.75, 3, 1, 0, 0, 0, 0]
		}, {
			POSITION: [2, 3, 1.7, 14.75, 0, 0, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.trap, g.dreadv1Generic, g.dreadv1Slow, g.dreadv1Trap, { reload: 1.22, health: 0.67, damage: 0.7 }]),
				TYPE: ["trap", {HITS_OWN_TYPE: "never"} ],
				STAT_CALCULATOR: "trap"
			}
		}
	], 3)
}
Class.hadesOfficialV1 = {
	PARENT: "genericDreadnought1",
	LABEL: "Hades",
	UPGRADE_TOOLTIP: "Faster Trap Spam",
	GUNS: weaponArray([
		{
			POSITION: [13.25, 2.25, 1, 0, 4, 0, 0]
		}, {
			POSITION: [2.75, 2.25, 1.7, 13.25, 4, 0, 2/3],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.trap, g.dreadv1Generic, g.dreadv1Slow, g.dreadv1Trap, { reload: 1.22, health: 0.67, damage: 0.7, speed: 2.5, maxSpeed: 2.5 }]),
				TYPE: ["trap", {HITS_OWN_TYPE: "never"} ],
				STAT_CALCULATOR: "trap",
			},
		}, {
			POSITION: [13.25, 2.25, 1, 0, -4, 0, 0]
		}, {
			POSITION: [2.75, 2.25, 1.7, 13.25, -4, 0, 1/3],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.trap, g.dreadv1Generic, g.dreadv1Slow, g.dreadv1Trap, { reload: 1.22, health: 0.67, damage: 0.7, speed: 2.5, maxSpeed: 2.5 }]),
				TYPE: ["trap", {HITS_OWN_TYPE: "never"} ],
				STAT_CALCULATOR: "trap"
			}
		}, {
			POSITION: [14.75, 3, 1, 0, 0, 0, 0]
		}, {
			POSITION: [3, 3, 1.7, 14.75, 0, 0, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.trap, g.dreadv1Generic, g.dreadv1Slow, g.dreadv1Trap, { reload: 1.22, health: 0.67, damage: 0.7, speed: 2.5, maxSpeed: 2.5 }]),
				TYPE: ["trap", {HITS_OWN_TYPE: "never"} ],
				STAT_CALCULATOR: "trap"
			}
		}
	], 3)
}
Class.hellhoundOfficialV1 = {
	PARENT: "genericDreadnought1",
	LABEL: "Hellhound",
	UPGRADE_TOOLTIP: "Machine Traps",
	GUNS: weaponArray([
		{
			POSITION: [14.75, 5, 1.7, 0, 0, 0, 0]
		}, {
			POSITION: [2, 5 * 1.7, 1.7, 14.75, 0, 0, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.trap, g.machineGun, g.dreadv1Generic, g.dreadv1Slow, g.dreadv1Trap, { reload: 0.25, health: 0.67, damage: 0.7, range: 0.5, spray: 2, shudder: 1.5, size: 0.3 }]),
				TYPE: ["trap", {HITS_OWN_TYPE: "never"} ],
				STAT_CALCULATOR: "trap"
			}
		}
	], 3)
}
Class.hecatoncheiresOfficialV1 = {
	PARENT: "genericDreadnought1",
	LABEL: "Hecatoncheires",
	UPGRADE_TOOLTIP: "Bigger Blocks",
	GUNS: weaponArray([
		{
			POSITION: [13, 10, 1, 0, 0, 0, 0],
		}, {
			POSITION: [3, 10, 1.6, 13, 0, 0, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.trap, g.setTrap, g.dreadv1Generic, g.dreadv1Slow, g.dreadv1Trap, { reload: 1.75, range: 1.2, health: 1.75 }]),
				TYPE: ["unsetTrap", {HITS_OWN_TYPE: "never"} ],
				STAT_CALCULATOR: "block"
			}
		}
	], 3)
}
Class.cyclopsOfficialV1 = {
	PARENT: "genericDreadnought1",
	LABEL: "Cyclops",
	UPGRADE_TOOLTIP: "Set Blocks",
	GUNS: weaponArray([
		{
			POSITION: [13, 9.5, 1, 0, 0, 0, 0],
		}, {
			POSITION: [1, 9.5, 1.3, 13, 0, 0, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.trap, g.setTrap, g.dreadv1Generic, g.dreadv1Slow, g.dreadv1Trap, { reload: 1.55, range: 0.93, health: 1.55 }]),
				TYPE: ["setTrap", {HITS_OWN_TYPE: "never"} ],
				STAT_CALCULATOR: "block"
			}
		}
	], 3)
}
Class.mermaidOfficialV1 = {
	PARENT: "genericDreadnought1",
	LABEL: "Mermaid",
	UPGRADE_TOOLTIP: "Boomerangs",
	GUNS: weaponArray([
		{
			POSITION: [5, 9, 1, 13, 0, 0, 0],
		},
		{
			POSITION: [6, 9, -1.5, 7, 0, 0, 0],
		},
		{
			POSITION: [2, 9, 1.3, 18, 0, 0, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.trap, g.setTrap, g.boomerang]),
				TYPE: "boomerang",
				STAT_CALCULATOR: "block"
			},
		},
	], 3)
}

Class.policerOfficialV1 = {
	PARENT: "genericDreadnought1",
	LABEL: "Policer",
	UPGRADE_TOOLTIP: "Auto-Blocks",
	GUNS: weaponArray([
		{
			POSITION: [6, 9, -1.5, 7, 0, 0, 0],
		}, {
			POSITION: [3, 9, 1.5, 13, 0, 0, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.trap, g.dreadv1Generic, g.dreadv1Slow, g.dreadv1Trap]),
				TYPE: ["unsetPillbox", {HITS_OWN_TYPE: "never"} ],
				STAT_CALCULATOR: "trap",
			}
		}
	], 3)
}

Class.alarmOfficialV1 = {
	PARENT: "genericDreadnought1",
	LABEL: "Alarm",
	UPGRADE_TOOLTIP: "Twin Auto-Traps",
	GUNS: weaponArray([
		{
			POSITION: [6, 7, -1.5, 7, 0, 0, 0],
		}, {
			POSITION: [3, 7, 1.5, 13, 0, 0, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.trap, g.dreadv1Generic, g.dreadv1Slow, g.dreadv1Trap]),
				TYPE: ["twinTurretedTrap", {HITS_OWN_TYPE: "never"} ],
				STAT_CALCULATOR: "trap",
			}
		}, {
			POSITION: [12.5, 3, 1, 0, 3, 0, 0]
		}, {
			POSITION: [12.5, 3, 1, 0, -3, 0, 0]
		}
	], 3)
}
Class.clockOfficialV1 = {
	PARENT: "genericDreadnought1",
	LABEL: "Clock",
	UPGRADE_TOOLTIP: "Swarm Traps",
	GUNS: weaponArray([
		{
			POSITION: [6, 7, -1.5, 7, 0, 0, 0],
		}, {
			POSITION: [3, 7, 1.5, 13, 0, 0, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.trap, g.dreadv1Generic, g.dreadv1Slow, g.dreadv1Trap]),
				TYPE: ["swarmTrap", {HITS_OWN_TYPE: "never"} ],
				STAT_CALCULATOR: "trap",
			}
		}, {
			POSITION: [7.5, 3, -1.6, 5, 0, 0, 0]
		},
	], 3)
}

Class.robotOfficialV1 = {
	PARENT: "genericDreadnought1",
	LABEL: "Robot",
	UPGRADE_TOOLTIP: "Auto Turrets",
	TURRETS: [
		...weaponArray([{
			POSITION: [4, 4.25, 0, 0, 180, 1],
			TYPE: ["dreadv1BodyTurret", {GUN_STAT_SCALE: {damage: 1.12}}],
		}, {
			POSITION: [4, 8.25, 0, 30, 180, 1],
			TYPE: ["dreadv1BodyTurret", {GUN_STAT_SCALE: {damage: 1.12}}],
		}], 6),
		{
			POSITION: [9.5, 0, 0, 0, 360, 1],
			TYPE: ["dreadv1BodyTurret", {GUN_STAT_SCALE: {damage: 1.8}}],
		}
	]
}
Class.titanOfficialV1 = {
	PARENT: "genericDreadnought1",
	LABEL: "Titan",
	UPGRADE_TOOLTIP: "Health Buff",
	BODY: {
		HEALTH: 3.3,
		SHIELD: 2.8,
		REGEN: 1.7,
		SPEED: 1.15,
	},
	TURRETS: [{
		POSITION: [25.5, 0, 0, 0, 0, 0],
		TYPE: ["hexagon", {COLOR: "black"}]
	}]
}
Class.refugeOfficialV1 = {
	PARENT: "genericDreadnought1",
	LABEL: "Refuge",
	UPGRADE_TOOLTIP: "Healing",
	TURRETS: [{
		POSITION: [8, 0, 0, 0, 360, 1],
		TYPE: "refugeTurret",
	}]
}
// TIER 4 LEGS RACE
Class.bayonetOfficialV1 = {
	PARENT: "genericDreadnought1",
	LABEL: "Bayonet",
	UPGRADE_TOOLTIP: "Vindicators",
	GUNS: weaponArray([
  {
		POSITION: [35, 7, 1, 0, 0, 0, 0],
		PROPERTIES: {
			SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.assassin, g.assassin, g.dreadv1Generic, g.dreadv1Sniper, {speed: 1.3, damage: 1.2, pen: 1.3}]),
			TYPE: "bullet"
		}
	}, {
    POSITION: [3.5, 7, -1.4, 9, 0, 0, 0]
  }], 3)
}
Class.wrenchOfficialV1 = {
	PARENT: "genericDreadnought1",
	LABEL: "Wrench",
	UPGRADE_TOOLTIP: "Wrench/Pryer Hybrids",
	GUNS: weaponArray([{
        POSITION: [50, 6, 1, 0, 0, 0, 0]
    }, {
        POSITION: [5, 8, -1.4, 8, 0, 0, 0]
    }], 3),
	TURRETS: weaponArray([{
        POSITION: [5.5, 20, 0, 0, 190, 1],
        TYPE: "screwGun"
    }, {
        POSITION: [5.5, 27.5, 0, 0, 190, 1],
        TYPE: "screwGun"
    }, {
        POSITION: [5.5, 35, 0, 0, 190, 1],
        TYPE: "screwGun"
    }, {
        POSITION: [5.5, 42.5, 0, 0, 190, 1],
        TYPE: "screwGun"
    }, {
        POSITION: [5.5, 50, 0, 0, 190, 1],
        TYPE: "screwGun"
    }], 3)
}
Class.altarOfficialV1 = {
	PARENT: "genericDreadnought1",
	LABEL: "Altar",
	UPGRADE_TOOLTIP: "Persuers",
	INVISIBLE: [0.04, 0.015],
	GUNS: weaponArray([
		{
			POSITION: [25, 8, -1.4, 0, 0, 0, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.assassin, g.dreadv1Generic, g.dreadv1Sniper]),
				TYPE: "bullet"
			}
		}
	], 3)
}
Class.archerOfficialV1 = {
	PARENT: "genericDreadnought1",
	LABEL: "Archer",
	UPGRADE_TOOLTIP: "Balistas",
	GUNS: weaponArray([
        {
            POSITION: [13, 2.5, 1, 0, 5, 0, 3/4],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.rifle, g.crossbow, { speed: 0.7, maxSpeed: 0.7 }, { recoil: 0.5 }]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: [13, 2.5, 1, 0, -5, 0, 3/4],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.rifle, g.crossbow, { speed: 0.7, maxSpeed: 0.7 }, { recoil: 0.5 }]),
                TYPE: "bullet"
            }
        },
		{
            POSITION: [15, 2.5, 1, 0, 4.5, 0, 2/4],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.rifle, g.crossbow, { speed: 0.7, maxSpeed: 0.7 }, { recoil: 0.5 }]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: [15, 2.5, 1, 0, -4.5, 0, 2/4],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.rifle, g.crossbow, { speed: 0.7, maxSpeed: 0.7 }, { recoil: 0.5 }]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: [20, 3.5, 1, 0, 3, 0, 1/4],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.rifle, g.crossbow, { speed: 0.7, maxSpeed: 0.7 }, { recoil: 0.5 }]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: [20, 3.5, 1, 0, -3, 0, 1/4],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.rifle, g.crossbow, { speed: 0.7, maxSpeed: 0.7 }, { recoil: 0.5 }]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: [24, 5, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.rifle, g.crossbow, { speed: 0.7, maxSpeed: 0.7 }, { recoil: 0.5 }]),
                TYPE: "bullet"
            }
        }
	], 3)
}
Class.championOfficialV1 = {
	PARENT: "genericDreadnought1",
	LABEL: "Champion",
	UPGRADE_TOOLTIP: "Champions",
	GUNS: weaponArray([
		{
			POSITION: [17, 9, 1, 0, 0, 0, 0]
		}, {
			POSITION: [20, 6, 1, 0, 0, 0, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.rifle, g.dreadv1Generic, g.dreadv1Sniper, {damage: 1.05, speed: 1.25}]),
				TYPE: ["bullet", { MOTION_TYPE: "accel" }]
			}
		}, {
			POSITION: [22, 3, 0.001, 0, 0, 0, 0]
		}, {
			POSITION: [22, 3, 0.001, -5, 0, 0, 0]
		},
	], 3)
}
Class.palmOfficialV1 = {
	PARENT: "genericDreadnought1",
	LABEL: "Palm",
	UPGRADE_TOOLTIP: "Fingers",
	GUNS: weaponArray([
		{
     		POSITION: [24, 8, 1, 0, 0, 0, 0]
    	},
    	{
      		POSITION: [28, 5, 1, 0, 0, 0, 0],
      		PROPERTIES: {
        		SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.assassin, { reload: 5, size: 0.9, health: 0.9, damage: 1.35, pen: 1.25, speed: 1.5, maxSpeed: 1.04, density: 3.5 }]),
        		TYPE: "bullet"
      		},
    	},
    	{
    		POSITION: [4, 8, -1.5, 8, 0, 0, 0]
	    }
	], 3)
}
Class.uplifterOfficialV1 = {
	PARENT: "genericDreadnought1",
	LABEL: "Uplifter",
	UPGRADE_TOOLTIP: "Carnivores",
	GUNS: weaponArray([
		{
			POSITION: [23, 4, 1, 0, 0, 0, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.hunter, g.predator, g.hunterSecondary, g.hunterSecondary, g.hunterSecondary, g.dreadv1Generic, g.dreadv1Sniper]),
				TYPE: "bullet"
			}
		},
		{
			POSITION: [21, 6, 1, 0, 0, 0, 0.15],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.hunter, g.predator, g.hunterSecondary, g.hunterSecondary, g.dreadv1Generic, g.dreadv1Sniper]),
				TYPE: "bullet"
			}
		},
		{
			POSITION: [19, 8, 1, 0, 0, 0, 0.3],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.hunter, g.predator, g.hunterSecondary, g.dreadv1Generic, g.dreadv1Sniper]),
				TYPE: "bullet"
			}
		},
		{
			POSITION: [17, 10, 1, 0, 0, 0, 0.3],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.hunter, g.predator, g.dreadv1Generic, g.dreadv1Sniper]),
				TYPE: "bullet"
			}
		}
	], 3)
}
Class.bomberOfficialV1 = {
	PARENT: "genericDreadnought1",
	LABEL: "Bomber",
	UPGRADE_TOOLTIP: "Ruiners",
	GUNS: weaponArray([
		{
			POSITION: [13, 3, 1, 0, -8, -7, 0.6],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.artillery, g.twin ]),
				TYPE: "bullet",
				LABEL: "Secondary",
			},
		},
		{
			POSITION: [13, 3, 1, 0, 8, 7, 0.8],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.artillery, g.twin ]),
				TYPE: "bullet",
				LABEL: "Secondary",
			},
		},
		{
			POSITION: [17, 3, 1, 0, -6, -7, 0.2],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.artillery, g.twin ]),
				TYPE: "bullet",
				LABEL: "Secondary",
			},
		},
		{
			POSITION: [17, 3, 1, 0, 6, 7, 0.4],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.artillery, g.twin ]),
				TYPE: "bullet",
				LABEL: "Secondary",
			},
		},
		{
			POSITION: [21, 7, 1, 0, 0, 0, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.hunter, g.hunterSecondary, g.dreadv1Generic, g.dreadv1Sniper]),
				TYPE: "bullet"
			}
		},
		{
			POSITION: [19, 9, 1, 0, 0, 0, 0.25],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.hunter, g.dreadv1Generic, g.dreadv1Sniper]),
				TYPE: "bullet"
			}
		}
	], 3)
}
Class.rummagerOfficialV1 = {
	PARENT: "genericDreadnought1",
	LABEL: "Rummager",
	UPGRADE_TOOLTIP: "Mega Hunters",
	GUNS: weaponArray([
		{
			POSITION: [21, 9, 1, 0, 0, 0, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.sniper, g.hunter, g.hunterSecondary, g.dreadv1Generic, g.dreadv1Sniper]),
				TYPE: "bullet"
			}
		},
		{
			POSITION: [19, 11, 1, 0, 0, 0, 0.25],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.sniper, g.hunter, g.dreadv1Generic, g.dreadv1Sniper]),
				TYPE: "bullet"
			}
		}
	], 3)
}
Class.nailOfficialV1 = {
	PARENT: "genericDreadnought1",
	LABEL: "Nail",
	UPGRADE_TOOLTIP: "Ultra Hunters",
	GUNS: weaponArray([
		{
			POSITION: [21, 10, 1, 0, 0, 0, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.destroyer, g.sniper, g.hunter, g.hunterSecondary, g.dreadv1Generic, g.dreadv1Sniper]),
				TYPE: "bullet"
			}
		},
		{
			POSITION: [19, 11.5, 1, 0, 0, 0, 0.25],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.destroyer, g.sniper, g.hunter, g.dreadv1Generic, g.dreadv1Sniper]),
				TYPE: "bullet"
			}
		}
	], 3)
}

Class.pillagerOfficialV1 = {
	PARENT: "genericDreadnought1",
	LABEL: "Pillager",
	UPGRADE_TOOLTIP: "Machine Guns",
	GUNS: weaponArray([
		{
			POSITION: [8.5, 10.875, 1.3, 6, 0, 0, 3/4],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.twin, g.dreadv1Generic, g.dreadv1Slow, {health: 1.13, shudder: 1.2, speed: 0.9, maxSpeed: 0.7, range: 0.7, size: 0.575}]),
				TYPE: "bullet"
			}
		}, {
			POSITION: [8.5, 9.375, 1.3, 7, 0, 0, 2/4],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.twin, g.dreadv1Generic, g.dreadv1Slow, {health: 1.13, shudder: 1.2, speed: 0.9, maxSpeed: 0.7, range: 0.7, size: 0.575}]),
				TYPE: "bullet"
			}
		}, {
			POSITION: [8.5, 8.375, 1.25, 8, 0, 0, 1/4],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.twin, g.dreadv1Generic, g.dreadv1Slow, {health: 1.13, shudder: 1.2, speed: 0.9, maxSpeed: 0.7, range: 0.7, size: 0.6}]),
				TYPE: "bullet"
			}
		}, {
			POSITION: [8.5, 7.875, 1.2, 9, 0, 0, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.twin, g.dreadv1Generic, g.dreadv1Slow, {health: 1.13, shudder: 1.2, speed: 0.9, maxSpeed: 0.7, range: 0.7, size: 0.6 * 8.5 / 7.5}]),
				TYPE: "bullet"
			}
		}
	], 3)
}
Class.methamphetamineOfficialV1 = {
	PARENT: "genericDreadnought1",
	LABEL: "Methamphetamine",
	UPGRADE_TOOLTIP: "Redistributors",
	GUNS: weaponArray([
		{
			POSITION: [21, 6, 1, 0, 0, 0, 0.75],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.lowPower, g.pelleter, g.dreadv1Generic, g.dreadv1Slow, {health: 1.13, shudder: 1.2, speed: 0.9, maxSpeed: 0.7, range: 0.7, size: 0.6}]),
				TYPE: "bullet",
			},
		}, {
			POSITION: [19, 8, 1, 0, 0, 0, 0.25],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.lowPower, g.pelleter, g.dreadv1Generic, g.dreadv1Slow, {health: 1.13, shudder: 1.2, speed: 0.9, maxSpeed: 0.7, range: 0.7, size: 0.6}]),
				TYPE: "bullet",
			},
		}, {
			POSITION: [8.5, 8.875, 1.25, 7, 0, 0, 0.5],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.twin, g.dreadv1Generic, g.dreadv1Slow, {health: 1.13, shudder: 1.2, speed: 0.9, maxSpeed: 0.7, range: 0.7, size: 0.6}]),
				TYPE: "bullet"
			}
		}, {
			POSITION: [8.5, 7.875, 1.2, 9, 0, 0, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.twin, g.dreadv1Generic, g.dreadv1Slow, {health: 1.13, shudder: 1.2, speed: 0.9, maxSpeed: 0.7, range: 0.7, size: 0.6 * 8.5 / 7.5}]),
				TYPE: "bullet"
			}
		}
	], 3)
}
Class.rimfireOfficialV1 = {
	PARENT: "genericDreadnought1",
	LABEL: "Rimfire",
	UPGRADE_TOOLTIP: "Gunners",
	GUNS: weaponArray([
		{
			POSITION: [21, 2, 1, 0, -2.5, 0, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.power, g.twin, { speed: 0.7, maxSpeed: 0.7 }, g.flankGuard, { recoil: 1.8 }]),
				TYPE: "bullet",
			},
		},
		{
			POSITION: [21, 2, 1, 0, 2.5, 0, 4/8],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.power, g.twin, { speed: 0.7, maxSpeed: 0.7 }, g.flankGuard, { recoil: 1.8 }]),
				TYPE: "bullet",
			},
		},
		{
			POSITION: [19, 2, 1, 0, -2.5, 0, 1/8],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.power, g.twin, { speed: 0.7, maxSpeed: 0.7 }, g.flankGuard, { recoil: 1.8 }]),
				TYPE: "bullet",
			},
		},
		{
			POSITION: [19, 2, 1, 0, 2.5, 0, 5/8],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.power, g.twin, { speed: 0.7, maxSpeed: 0.7 }, g.flankGuard, { recoil: 1.8 }]),
				TYPE: "bullet",
			},
		},
		{
			POSITION: [17, 2, 1, 0, -2.5, 0, 2/8],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.power, g.twin, { speed: 0.7, maxSpeed: 0.7 }, g.flankGuard, { recoil: 1.8 }]),
				TYPE: "bullet",
			},
		},
		{
			POSITION: [17, 2, 1, 0, 2.5, 0, 6/8],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.power, g.twin, { speed: 0.7, maxSpeed: 0.7 }, g.flankGuard, { recoil: 1.8 }]),
				TYPE: "bullet",
			},
		},
		{
			POSITION: [15, 2, 1, 0, -2.5, 0, 3/8],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.power, g.twin, { speed: 0.7, maxSpeed: 0.7 }, g.flankGuard, { recoil: 1.8 }]),
				TYPE: "bullet",
			},
		},
		{
			POSITION: [15, 2, 1, 0, 2.5, 0, 7/8],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.power, g.twin, { speed: 0.7, maxSpeed: 0.7 }, g.flankGuard, { recoil: 1.8 }]),
				TYPE: "bullet",
			},
		},
		{
			POSITION: [12, 11, 1, 0, 0, 0, 0],
		},
	], 3)
}
Class.retardantOfficialV1 = {
	PARENT: "genericDreadnought1",
	LABEL: "Retardant",
	UPGRADE_TOOLTIP: "Heaviest Bullets",
	GUNS: weaponArray({
		POSITION: [19.5, 11.5, 1, 0, 0, 0, 0],
		PROPERTIES: {
			SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.pounder, g.destroyer, g.annihilator, g.dreadv1Generic, g.dreadv1Slow, {reload: 1.3, health: 1.3, range: 1.1}]),
			TYPE: "bullet",
		}
	}, 3)
}
Class.spokespersonOfficialV1 = {
	PARENT: "genericDreadnought1",
	LABEL: "Spokesperson",
	UPGRADE_TOOLTIP: "Rocketeers",
	GUNS: weaponArray([
		{
			POSITION: [8.5, 8.35, -0.8, 10, 0, 0, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.launcher, g.rocketeer]),
				TYPE: "rocketeerMissile",
				STAT_CALCULATOR: "sustained",
			},
		},
		{
			POSITION: [17, 12, 0.65, 0, 0, 0, 0],
		},
	], 3)
}
Class.rescuerOfficialV1 = {
	PARENT: "genericDreadnought1",
	LABEL: "Rescuer",
	UPGRADE_TOOLTIP: "Buckshots",
	GUNS: weaponArray([
        {
            POSITION: [4, 3, 1, 11, -3, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.shotgun, {spray: 1.2}]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [4, 3, 1, 11, 3, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.shotgun, {spray: 1.2}]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [4, 4, 1, 13, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.shotgun, {spray: 1.2}]),
                TYPE: "casing",
            },
        },
        {
            POSITION: [1, 4, 1, 12, -1, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.shotgun, {spray: 1.2}]),
                TYPE: "casing",
            },
        },
        {
            POSITION: [1, 4, 1, 11, 1, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.shotgun, {spray: 1.2}]),
                TYPE: "casing",
            },
        },
        {
            POSITION: [1, 3, 1, 13, -1, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.shotgun, {spray: 1.2}]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [1, 3, 1, 13, 1, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.shotgun, {spray: 1.2}]),
                TYPE: "bullet",
            },
        },
		{
            POSITION: [1, 3, 1, 13, -1, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.shotgun, {spray: 1.2}]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [1, 3, 1, 13, 1, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.shotgun, {spray: 1.2}]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [1, 2, 1, 13, 2, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.shotgun, {spray: 1.2}]),
                TYPE: "casing",
            },
        },
        {
            POSITION: [1, 2, 1, 13, 2, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.shotgun, {spray: 1.2}]),
                TYPE: "casing",
            },
        },
        {
            POSITION: [1, 2, 1, 13, -2, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.shotgun, {spray: 1.2}]),
                TYPE: "casing",
            },
        },
        {
            POSITION: [15, 9, 1.15, 6, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.shotgun, g.fake]),
                TYPE: "casing",
            },
        },
        {
            POSITION: [8, 9.5, -1.5, 4, 0, 0, 0],
        },
    ], 3)
}
Class.presidentOfficialV1 = {
	PARENT: "genericDreadnought1",
	LABEL: "President",
	UPGRADE_TOOLTIP: "Quintuplets",
	GUNS: weaponArray([
		{
			POSITION: [14.5, 4.75, 1, 0, 2.75, 0, 2/3],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.triplet, g.dreadv1Generic, g.dreadv1Slow, {range: 0.9}]),
				TYPE: "bullet"
			}
		}, {
			POSITION: [14.5, 4.75, 1, 0, -2.75, 0, 2/3],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.triplet, g.dreadv1Generic, g.dreadv1Slow, {range: 0.9}]),
				TYPE: "bullet"
			}
		}, {
			POSITION: [15.25, 4.75, 1, 0, 2, 0, 1/3],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.triplet, g.dreadv1Generic, g.dreadv1Slow, {range: 0.9}]),
				TYPE: "bullet"
			}
		}, {
			POSITION: [15.25, 4.75, 1, 0, -2, 0, 1/3],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.triplet, g.dreadv1Generic, g.dreadv1Slow, {range: 0.9}]),
				TYPE: "bullet"
			}
		}, {
			POSITION: [16.25, 4.75, 1, 0, 0, 0, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.triplet, g.dreadv1Generic, g.dreadv1Slow, {range: 0.9}]),
				TYPE: "bullet"
			}
		}
	], 3)
}
Class.moderatorOfficialV1 = {
	PARENT: "genericDreadnought1",
	LABEL: "Moderator",
	UPGRADE_TOOLTIP: "Nailguns",
	GUNS: weaponArray([
		{
			POSITION: [19, 2, 1, 0, -2.5, 0, 0.25],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.power, g.twin, g.nailgun]),
				TYPE: "bullet",
			},
		},
		{
			POSITION: [19, 2, 1, 0, 2.5, 0, 0.75],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.power, g.twin, g.nailgun]),
				TYPE: "bullet",
			},
		},
		{
			POSITION: [20, 2, 1, 0, 0, 0, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.power, g.twin, g.nailgun]),
				TYPE: "bullet",
			},
		},
		{
			POSITION: [5.5, 7, -1.8, 6.5, 0, 0, 0],
		},
	], 3)
}
Class.personelOfficialV1 = {
	PARENT: "genericDreadnought1",
	LABEL: "Personel",
	UPGRADE_TOOLTIP: "Spread Shots",
	GUNS: weaponArray([
		{
			POSITION: [16, 4, 1, 0, -0.5, -15, 3 / 6],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.artillery, g.twin, g.spreadshot]),
				TYPE: "bullet",
				LABEL: "Spread"
			}
		},
		{
			POSITION: [16, 4, 1, 0, 0.5, 15, 3 / 6],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.artillery, g.twin, g.spreadshot]),
				TYPE: "bullet",
				LABEL: "Spread"
			}
		},
		{
			POSITION: [17.5, 4, 1, 0, -0.5, -10, 2 / 6],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.artillery, g.twin, g.spreadshot]),
				TYPE: "bullet",
				LABEL: "Spread"
			}
		},
		{
			POSITION: [17.5, 4, 1, 0, 0.5, 10, 2 / 6],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.artillery, g.twin, g.spreadshot]),
				TYPE: "bullet",
				LABEL: "Spread"
			}
		},
		{
			POSITION: [19, 4, 1, 0, -1, -5, 1 / 6],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.artillery, g.twin, g.spreadshot]),
				TYPE: "bullet",
				LABEL: "Spread"
			}
		},
		{
			POSITION: [19, 4, 1, 0, 1, 5, 1 / 6],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.artillery, g.twin, g.spreadshot]),
				TYPE: "bullet",
				LABEL: "Spread"
			}
		},
		{
			POSITION: [12, 8, 1, 8, 0, 0, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.spreadshotMain, g.spreadshot]),
				TYPE: "bullet"
			}
		}
	], 3)
}

Class.proberOfficialV1 = {
	PARENT: "genericDreadnought1",
	LABEL: "Prober",
	UPGRADE_TOOLTIP: "Drones",
	GUNS: weaponArray({
		POSITION: [9, 8, 1.25, 7.5, 0, 0, 0],
		PROPERTIES: {
			SHOOT_SETTINGS: combineStats([g.drone, g.overseer, g.dreadv1Drone, {speed: 0.95, maxSpeed: 0.95, damage: 0.9, health: 0.92}]),
			TYPE: "drone",
			AUTOFIRE: true,
			SYNCS_SKILLS: true,
			STAT_CALCULATOR: "drone",
			WAIT_TO_CYCLE: true,
			MAX_CHILDREN: 7,
		}
	}, 3)
}
Class.dictatorOfficialV1 = {
	PARENT: "genericDreadnought1",
	LABEL: "Dictator",
	UPGRADE_TOOLTIP: "Overdriven Drones",
	GUNS: weaponArray([{
		POSITION: [7, 7.5, 1.3, 7.5, 0, 0, 0],
		PROPERTIES: {
			SHOOT_SETTINGS: combineStats([g.drone, g.overseer, g.dreadv1Drone, {speed: 0.95, maxSpeed: 0.95, damage: 0.93, health: 0.92}]),
			TYPE: "turretedDrone",
			AUTOFIRE: true,
			SYNCS_SKILLS: true,
			STAT_CALCULATOR: "drone",
			WAIT_TO_CYCLE: true,
			MAX_CHILDREN: 3,
		}
	}, {
		POSITION: [7, 5, 1.3, 5, 0, 0, 0],
		PROPERTIES: {
			COLOR: "darkGrey"
		}
	}], 3)
}
Class.fatassOfficialV1 = {
	PARENT: "genericDreadnought1",
	LABEL: "FATASS",
	UPGRADE_TOOLTIP: "Big Cheese Drones",
	GUNS: weaponArray({
		POSITION: [16, 10, 1.4, 0, 0, 0, 0],
		PROPERTIES: {
			SHOOT_SETTINGS: combineStats([g.drone, g.bigCheese, g.dreadv1Drone, {speed: 0.95, maxSpeed: 0.95, damage: 0.93, health: 0.92}]),
			TYPE: "drone",
			AUTOFIRE: true,
			SYNCS_SKILLS: true,
			STAT_CALCULATOR: "drone",
			WAIT_TO_CYCLE: true,
			MAX_CHILDREN: 1,
		},
	}, 3)
}
Class.attackerOfficialV1 = {
	PARENT: "genericDreadnought1",
	LABEL: "Attacker",
	UPGRADE_TOOLTIP: "Twin Minions",
	GUNS: weaponArray([
		{
			POSITION: [14.25, 9, 1, 0, 0, 0, 0],
		}, {
			POSITION: [1.5, 10, 1, 14.25, 0, 0, 0],
			PROPERTIES: {
				MAX_CHILDREN: 4,
				SHOOT_SETTINGS: combineStats([g.spawner, g.overseer, g.dreadv1Drone, {damage: 0.6}]),
				TYPE: ["twinMinion", {GUN_STAT_SCALE: {reload: 1.333, health: 0.7, speed: 0.8, maxSpeed: 0.8}}],
				STAT_CALCULATOR: "drone",
				AUTOFIRE: true,
				SYNCS_SKILLS: true
			}
		}, {
			POSITION: [11.5, 10, 1, 0, 0, 0, 0]
		}, {
			POSITION: [12.5, 3, 1, 0, 3, 0, 0]
		}, {
			POSITION: [12.5, 3, 1, 0, -3, 0, 0]
		}
	], 3)
}
Class.defenderOfficialV1 = {
	PARENT: "genericDreadnought1",
	LABEL: "Defender",
	UPGRADE_TOOLTIP: "Machine Minions",
	GUNS: weaponArray([
		{
			POSITION: [14.25, 9, 1, 0, 0, 0, 0],
		}, {
			POSITION: [1.5, 10, 1, 14.25, 0, 0, 0],
			PROPERTIES: {
				MAX_CHILDREN: 4,
				SHOOT_SETTINGS: combineStats([g.spawner, g.overseer, g.dreadv1Drone, {damage: 0.6}]),
				TYPE: ["machineMinion", {GUN_STAT_SCALE: {reload: 1.333, health: 0.7, speed: 0.8, maxSpeed: 0.8}}],
				STAT_CALCULATOR: "drone",
				AUTOFIRE: true,
				SYNCS_SKILLS: true
			}
		}, {
			POSITION: [11.5, 10, 1, 0, 0, 0, 0]
		}, {
			POSITION: [12.5, 4, 1.8, 0, 0, 0, 0]
		}
	], 3)
}
Class.coallesceOfficialV1 = {
	PARENT: "genericDreadnought1",
	LABEL: "Coallesce",
	UPGRADE_TOOLTIP: "Machine Minions",
	GUNS: weaponArray([
		{
			POSITION: [14.25, 9, 1, 0, 0, 0, 0],
		}, {
			POSITION: [1.5, 10, 1, 14.25, 0, 0, 0],
			PROPERTIES: {
				MAX_CHILDREN: 4,
				SHOOT_SETTINGS: combineStats([g.spawner, g.overseer, g.dreadv1Drone, {damage: 0.6}]),
				TYPE: ["thrusterMinion", {GUN_STAT_SCALE: {reload: 1.333, health: 0.7, speed: 0.8, maxSpeed: 0.8}}],
				STAT_CALCULATOR: "drone",
				AUTOFIRE: true,
				SYNCS_SKILLS: true
			}
		}, {
			POSITION: [11.5, 10, 1, 0, 0, 0, 0]
		}, {
			POSITION: [12.5, 3, 1, 0, 1, 10, 0]
		}, {
			POSITION: [12.5, 3, 1, 0, -1, -10, 0]
		}
	], 3)
}
Class.twinMinion = {
    PARENT: "minion",
    GUNS: [
        {
            POSITION: {
                LENGTH: 20,
                WIDTH: 8,
                Y: 5.5
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: {
                LENGTH: 20,
                WIDTH: 8,
                Y: -5.5,
                DELAY: 0.5
            },
            PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.basic, g.twin]),
                TYPE: "bullet"
            }
        }
    ],
}
Class.machineMinion = {
    PARENT: "minion",
    GUNS: [
        {
            POSITION: {
                LENGTH: 12,
                WIDTH: 10,
                ASPECT: 1.4,
                X: 8
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.machineGun]),
                TYPE: "bullet"
            }
        }
    ],
}
Class.thrusterMinion = {
    PARENT: "drone",
    SHAPE: 0,
    GUNS: [
        {
            POSITION: [16, 8, 1, 0, 0, 150, 0.1],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.flankGuard, g.triAngle, g.thruster]),
                TYPE: "bullet",
                LABEL: "thruster",
            },
        },
        {
            POSITION: [16, 8, 1, 0, 0, 210, 0.1],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.flankGuard, g.triAngle, g.thruster]),
                TYPE: "bullet",
                LABEL: "thruster",
            },
        },
    ]
}
Class.theifOfficialV1 = {
	PARENT: "genericDreadnought1",
	LABEL: "Theif",
	UPGRADE_TOOLTIP: "Swarms",
	GUNS: weaponArray([
		{
			POSITION: [7, 6, 0.6, 7.5, 1.4, 0, 2/3],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.swarm, g.carrier, { reload: 2, speed: 0.5, range: 0.9, health: 0.85}]),
				TYPE: "swarm",
				STAT_CALCULATOR: "swarm"
			}
		}, {
			POSITION: [7, 6, 0.6, 7.5, -1.4, 0, 2/3],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.swarm, g.carrier, { reload: 2, speed: 0.5, range: 0.9, health: 0.85}]),
				TYPE: "swarm",
				STAT_CALCULATOR: "swarm"
			}
		}, {
			POSITION: [7, 6, 0.6, 5.5, 2.8, 0, 1/3],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.swarm, g.carrier, { reload: 2, speed: 0.5, range: 0.9, health: 0.85}]),
				TYPE: "swarm",
				STAT_CALCULATOR: "swarm"
			}
		}, {
			POSITION: [7, 6, 0.6, 5.5, -2.8, 0, 1/3],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.swarm, g.carrier, { reload: 2, speed: 0.5, range: 0.9, health: 0.85}]),
				TYPE: "swarm",
				STAT_CALCULATOR: "swarm"
			}
		}, {
			POSITION: [7, 6, 0.6, 8, 0, 0, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.swarm, g.carrier, { reload: 2, speed: 0.5, range: 0.9, health: 0.85}]),
				TYPE: "swarm",
				STAT_CALCULATOR: "swarm"
			}
		}
	], 3)
}
Class.banditOfficialV1 = {
	PARENT: "genericDreadnought1",
	LABEL: "bandit",
	UPGRADE_TOOLTIP: "Automated Swarms",
	GUNS: weaponArray([
		{
			POSITION: [7, 6, 0.6, 5.5, 2.8, 0, 0.5],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.swarm, g.carrier, { reload: 0.5, speed: 0.5, range: 0.9, health: 0.85}]),
				TYPE: "autoswarm",
				STAT_CALCULATOR: "swarm",
				COLOR: "red"
			}
		}, {
			POSITION: [7, 6, 0.6, 5.5, -2.8, 0, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.swarm, g.carrier, { reload: 0.5, speed: 0.5, range: 0.9, health: 0.85}]),
				TYPE: "autoswarm",
				STAT_CALCULATOR: "swarm",
				COLOR: "red"
			}
		}
	], 3)
}
Class.pirateOfficialV1 = {
	PARENT: "genericDreadnought1",
	LABEL: "Pirate",
	UPGRADE_TOOLTIP: "Bees/Swarms",
	GUNS: weaponArray([
		{
			POSITION: [7, 6, 0.6, 5.5, 2.8, 0, 0.5],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.swarm, g.carrier, { reload: 2, speed: 0.5, range: 0.9, health: 0.85}]),
				TYPE: "swarm",
				STAT_CALCULATOR: "swarm"
			}
		}, {
			POSITION: [7, 6, 0.6, 5.5, -2.8, 0, 0.5],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.swarm, g.carrier, { reload: 2, speed: 0.5, range: 0.9, health: 0.85}]),
				TYPE: "swarm",
				STAT_CALCULATOR: "swarm"
			}
		}, {
			POSITION: [7, 6, 1, 6.5, 0, 0, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.swarm, g.carrier, { reload: 1.5, speed: 0.5, range: 0.9, health: 0.85}]),
				TYPE: "bee",
				STAT_CALCULATOR: "swarm"
			}
		}
	], 3)
}
Class.ogreOfficialV1 = {
	PARENT: "genericDreadnought1",
	LABEL: "Ogre",
	UPGRADE_TOOLTIP: "Spammier Traps",
	GUNS: weaponArray([
		{
			POSITION: [12.25, 2.25, 1, 0, -5, 0, 0]
		}, {
			POSITION: [1.75, 2.25, 1.7, 12.25, -5, 0, 4/5],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.trap, g.dreadv1Generic, g.dreadv1Slow, g.dreadv1Trap, { reload: 1.22, health: 0.67, damage: 0.7 }]),
				TYPE: ["trap", {HITS_OWN_TYPE: "never"} ],
				STAT_CALCULATOR: "trap",
			},
		}, {
			POSITION: [12.25, 2.25, 1, 0, 5, 0, 0]
		}, {
			POSITION: [1.75, 2.25, 1.7, 12.25, 5, 0, 3/5],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.trap, g.dreadv1Generic, g.dreadv1Slow, g.dreadv1Trap, { reload: 1.22, health: 0.67, damage: 0.7 }]),
				TYPE: ["trap", {HITS_OWN_TYPE: "never"} ],
				STAT_CALCULATOR: "trap",
			},
		}, {
			POSITION: [13.25, 2.25, 1, 0, 4, 0, 0]
		}, {
			POSITION: [1.75, 2.25, 1.7, 13.25, 4, 0, 2/5],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.trap, g.dreadv1Generic, g.dreadv1Slow, g.dreadv1Trap, { reload: 1.22, health: 0.67, damage: 0.7 }]),
				TYPE: ["trap", {HITS_OWN_TYPE: "never"} ],
				STAT_CALCULATOR: "trap",
			},
		}, {
			POSITION: [13.25, 2.25, 1, 0, -4, 0, 0]
		}, {
			POSITION: [1.75, 2.25, 1.7, 13.25, -4, 0, 1/5],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.trap, g.dreadv1Generic, g.dreadv1Slow, g.dreadv1Trap, { reload: 1.22, health: 0.67, damage: 0.7 }]),
				TYPE: ["trap", {HITS_OWN_TYPE: "never"} ],
				STAT_CALCULATOR: "trap"
			}
		}, {
			POSITION: [14.75, 3, 1, 0, 0, 0, 0]
		}, {
			POSITION: [2, 3, 1.7, 14.75, 0, 0, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.trap, g.dreadv1Generic, g.dreadv1Slow, g.dreadv1Trap, { reload: 1.22, health: 0.67, damage: 0.7 }]),
				TYPE: ["trap", {HITS_OWN_TYPE: "never"} ],
				STAT_CALCULATOR: "trap"
			}
		}
	], 3)
}
Class.hadesOfficialV1 = {
	PARENT: "genericDreadnought1",
	LABEL: "Hades",
	UPGRADE_TOOLTIP: "Faster Trap Spam",
	GUNS: weaponArray([
		{
			POSITION: [13.25, 2.25, 1, 0, 4, 0, 0]
		}, {
			POSITION: [2.75, 2.25, 1.7, 13.25, 4, 0, 2/3],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.trap, g.dreadv1Generic, g.dreadv1Slow, g.dreadv1Trap, { reload: 1.22, health: 0.67, damage: 0.7, speed: 2.5, maxSpeed: 2.5 }]),
				TYPE: ["trap", {HITS_OWN_TYPE: "never"} ],
				STAT_CALCULATOR: "trap",
			},
		}, {
			POSITION: [13.25, 2.25, 1, 0, -4, 0, 0]
		}, {
			POSITION: [2.75, 2.25, 1.7, 13.25, -4, 0, 1/3],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.trap, g.dreadv1Generic, g.dreadv1Slow, g.dreadv1Trap, { reload: 1.22, health: 0.67, damage: 0.7, speed: 2.5, maxSpeed: 2.5 }]),
				TYPE: ["trap", {HITS_OWN_TYPE: "never"} ],
				STAT_CALCULATOR: "trap"
			}
		}, {
			POSITION: [14.75, 3, 1, 0, 0, 0, 0]
		}, {
			POSITION: [3, 3, 1.7, 14.75, 0, 0, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.trap, g.dreadv1Generic, g.dreadv1Slow, g.dreadv1Trap, { reload: 1.22, health: 0.67, damage: 0.7, speed: 2.5, maxSpeed: 2.5 }]),
				TYPE: ["trap", {HITS_OWN_TYPE: "never"} ],
				STAT_CALCULATOR: "trap"
			}
		}
	], 3)
}
Class.hellhoundOfficialV1 = {
	PARENT: "genericDreadnought1",
	LABEL: "Hellhound",
	UPGRADE_TOOLTIP: "Machine Traps",
	GUNS: weaponArray([
		{
			POSITION: [14.75, 5, 1.7, 0, 0, 0, 0]
		}, {
			POSITION: [2, 5 * 1.7, 1.7, 14.75, 0, 0, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.trap, g.machineGun, g.dreadv1Generic, g.dreadv1Slow, g.dreadv1Trap, { reload: 0.25, health: 0.67, damage: 0.7, range: 0.5, spray: 2, shudder: 1.5, size: 0.3 }]),
				TYPE: ["trap", {HITS_OWN_TYPE: "never"} ],
				STAT_CALCULATOR: "trap"
			}
		}
	], 3)
}
Class.hecatoncheiresOfficialV1 = {
	PARENT: "genericDreadnought1",
	LABEL: "Hecatoncheires",
	UPGRADE_TOOLTIP: "Bigger Blocks",
	GUNS: weaponArray([
		{
			POSITION: [13, 10, 1, 0, 0, 0, 0],
		}, {
			POSITION: [3, 10, 1.6, 13, 0, 0, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.trap, g.setTrap, g.dreadv1Generic, g.dreadv1Slow, g.dreadv1Trap, { reload: 1.75, range: 1.2, health: 1.75 }]),
				TYPE: ["unsetTrap", {HITS_OWN_TYPE: "never"} ],
				STAT_CALCULATOR: "block"
			}
		}
	], 3)
}
Class.cyclopsOfficialV1 = {
	PARENT: "genericDreadnought1",
	LABEL: "Cyclops",
	UPGRADE_TOOLTIP: "Set Blocks",
	GUNS: weaponArray([
		{
			POSITION: [13, 9.5, 1, 0, 0, 0, 0],
		}, {
			POSITION: [1, 9.5, 1.3, 13, 0, 0, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.trap, g.setTrap, g.dreadv1Generic, g.dreadv1Slow, g.dreadv1Trap, { reload: 1.55, range: 0.93, health: 1.55 }]),
				TYPE: ["setTrap", {HITS_OWN_TYPE: "never"} ],
				STAT_CALCULATOR: "block"
			}
		}
	], 3)
}
Class.mermaidOfficialV1 = {
	PARENT: "genericDreadnought1",
	LABEL: "Mermaid",
	UPGRADE_TOOLTIP: "Boomerangs",
	GUNS: weaponArray([
		{
			POSITION: [5, 9, 1, 13, 0, 0, 0],
		},
		{
			POSITION: [6, 9, -1.5, 7, 0, 0, 0],
		},
		{
			POSITION: [2, 9, 1.3, 18, 0, 0, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.trap, g.setTrap, g.boomerang]),
				TYPE: "boomerang",
				STAT_CALCULATOR: "block"
			},
		},
	], 3)
}

Class.policerOfficialV1 = {
	PARENT: "genericDreadnought1",
	LABEL: "Policer",
	UPGRADE_TOOLTIP: "Auto-Blocks",
	GUNS: weaponArray([
		{
			POSITION: [6, 9, -1.5, 7, 0, 0, 0],
		}, {
			POSITION: [3, 9, 1.5, 13, 0, 0, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.trap, g.dreadv1Generic, g.dreadv1Slow, g.dreadv1Trap]),
				TYPE: ["unsetPillbox", {HITS_OWN_TYPE: "never"} ],
				STAT_CALCULATOR: "trap",
			}
		}
	], 3)
}

Class.alarmOfficialV1 = {
	PARENT: "genericDreadnought1",
	LABEL: "Alarm",
	UPGRADE_TOOLTIP: "Twin Auto-Traps",
	GUNS: weaponArray([
		{
			POSITION: [6, 7, -1.5, 7, 0, 0, 0],
		}, {
			POSITION: [3, 7, 1.5, 13, 0, 0, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.trap, g.dreadv1Generic, g.dreadv1Slow, g.dreadv1Trap]),
				TYPE: ["twinTurretedTrap", {HITS_OWN_TYPE: "never"} ],
				STAT_CALCULATOR: "trap",
			}
		}, {
			POSITION: [12.5, 3, 1, 0, 3, 0, 0]
		}, {
			POSITION: [12.5, 3, 1, 0, -3, 0, 0]
		}
	], 3)
}
Class.clockOfficialV1 = {
	PARENT: "genericDreadnought1",
	LABEL: "Clock",
	UPGRADE_TOOLTIP: "Swarm Traps",
	GUNS: weaponArray([
		{
			POSITION: [6, 7, -1.5, 7, 0, 0, 0],
		}, {
			POSITION: [3, 7, 1.5, 13, 0, 0, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.trap, g.dreadv1Generic, g.dreadv1Slow, g.dreadv1Trap]),
				TYPE: ["swarmTrap", {HITS_OWN_TYPE: "never"} ],
				STAT_CALCULATOR: "trap",
			}
		}, {
			POSITION: [7.5, 3, -1.6, 5, 0, 0, 0]
		},
	], 3)
}

Class.robotOfficialV1 = {
	PARENT: "genericDreadnought1",
	LABEL: "Robot",
	UPGRADE_TOOLTIP: "Auto Turrets",
	TURRETS: [
		...weaponArray([{
			POSITION: [4, 4.25, 0, 0, 180, 1],
			TYPE: ["dreadv1BodyTurret", {GUN_STAT_SCALE: {damage: 1.12}}],
		}, {
			POSITION: [4, 8.25, 0, 30, 180, 1],
			TYPE: ["dreadv1BodyTurret", {GUN_STAT_SCALE: {damage: 1.12}}],
		}], 6),
		{
			POSITION: [9.5, 0, 0, 0, 360, 1],
			TYPE: ["dreadv1BodyTurret", {GUN_STAT_SCALE: {damage: 1.8}}],
		}
	]
}
Class.titanOfficialV1 = {
	PARENT: "genericDreadnought1",
	LABEL: "Titan",
	UPGRADE_TOOLTIP: "Health Buff",
	BODY: {
		HEALTH: 3.3,
		SHIELD: 2.8,
		REGEN: 1.7,
		SPEED: 1.15,
	},
	TURRETS: [{
		POSITION: [25.5, 0, 0, 0, 0, 0],
		TYPE: ["hexagon", {COLOR: "black"}]
	}]
}
Class.refugeOfficialV1 = {
	PARENT: "genericDreadnought1",
	LABEL: "Refuge",
	UPGRADE_TOOLTIP: "Healing",
	TURRETS: [{
		POSITION: [8, 0, 0, 0, 360, 1],
		TYPE: "refugeTurret",
	}]
}

// Account for lower level cap
let tier1 = 10;
let tier2 = 12;
let tier3 = 14;
let tier4 = 16;
if (Config.MAX_UPGRADE_TIER < 10) {
	tier1 = 0;
	tier2 = 0;
	tier3 = 0;
	tier4 = 0;
}

Class.menu_addons.UPGRADES_TIER_0.push("dreadnought_dreadsV1");
	Class.dreadnought_dreadsV1[`UPGRADES_TIER_${tier1}`] = ["swordOfficialV1", "pacifierOfficialV1", "invaderOfficialV1", "centaurOfficialV1"];
		Class.swordOfficialV1.UPGRADES_TIER_M1 = ["sabreOfficialV1", "gladiusOfficialV1", "tarnisherOfficialV1"];
			Class.sabreOfficialV1.UPGRADES_TIER_M1 = ["lanceOfficialV1", "screwOfficialV1", "carbineOfficialV1"]
				Class.lanceOfficialV1.UPGRADES_TIER_M1 = ["bayonetOfficialV1"]
				Class.screwOfficialV1.UPGRADES_TIER_M1 = ["wrenchOfficialV1"]
				Class.carbineOfficialV1.UPGRADES_TIER_M1 = ["altarOfficialV1"]
			Class.gladiusOfficialV1.UPGRADES_TIER_M1 = ["warriorOfficialV1", "duelistOfficialV1", "toeOfficialV1"]
				Class.warriorOfficialV1.UPGRADES_TIER_M1 = ["archerOfficialV1"]
				Class.duelistOfficialV1.UPGRADES_TIER_M1 = ["championOfficialV1"]
				Class.toeOfficialV1.UPGRADES_TIER_M1 = ["palmOfficialV1"]
			Class.tarnisherOfficialV1.UPGRADES_TIER_M1 = ["raptureOfficialV1", "demomanOfficialV1", "rummagerOfficialV1"]
				Class.raptureOfficialV1.UPGRADES_TIER_M1 = ["uplifterOfficialV1"]
				Class.demomanOfficialV1.UPGRADES_TIER_M1 = ["bomberOfficialV1"]
				Class.rummagerOfficialV1.UPGRADES_TIER_M1 = ["nailOfficialV1"]
		Class.pacifierOfficialV1.UPGRADES_TIER_M1 = ["appeaserOfficialV1", "peacekeeperOfficialV1", "diplomatOfficialV1"];
			Class.appeaserOfficialV1.UPGRADES_TIER_M1 = ["ravagerOfficialV1", "dopamineOfficialV1", "successorOfficialV1"]
				Class.ravagerOfficialV1.UPGRADES_TIER_M1 = ["pillagerOfficialV1"]
				Class.dopamineOfficialV1.UPGRADES_TIER_M1 = ["methamphetamineOfficialV1"]
				Class.successorOfficialV1.UPGRADES_TIER_M1 = ["rimfireOfficialV1"]
			Class.peacekeeperOfficialV1.UPGRADES_TIER_M1 = ["conciliatorOfficialV1", "statespersonOfficialV1", "saviorOfficialV1"]
				Class.conciliatorOfficialV1.UPGRADES_TIER_M1 = ["retardantOfficialV1"]
				Class.statespersonOfficialV1.UPGRADES_TIER_M1 = ["spokespersonOfficialV1"]
				Class.saviorOfficialV1.UPGRADES_TIER_M1 = ["rescuerOfficialV1"]
			Class.diplomatOfficialV1.UPGRADES_TIER_M1 = ["presidentOfficialV1", "moderatorOfficialV1", "personelOfficialV1"]
		Class.invaderOfficialV1.UPGRADES_TIER_M1 = ["inquisitorOfficialV1", "assailantOfficialV1", "infiltratorOfficialV1"];
			Class.inquisitorOfficialV1.UPGRADES_TIER_M1 = ["proberOfficialV1", "dictatorOfficialV1", "fatassOfficialV1"];
			Class.assailantOfficialV1.UPGRADES_TIER_M1 = ["attackerOfficialV1", "defenderOfficialV1", "coallesceOfficialV1"];
			Class.infiltratorOfficialV1.UPGRADES_TIER_M1 = ["theifOfficialV1", "banditOfficialV1", "pirateOfficialV1"]
		Class.centaurOfficialV1.UPGRADES_TIER_M1 = ["cerberusOfficialV1", "minotaurOfficialV1", "sirenOfficialV1"];
			Class.cerberusOfficialV1.UPGRADES_TIER_M1 = ["ogreOfficialV1", "hadesOfficialV1", "hellhoundOfficialV1"];
			Class.minotaurOfficialV1.UPGRADES_TIER_M1 = ["hecatoncheiresOfficialV1", "cyclopsOfficialV1", "mermaidOfficialV1"];
			Class.sirenOfficialV1.UPGRADES_TIER_M1 = ["policerOfficialV1", "alarmOfficialV1", "clockOfficialV1"];
		Class.automationOfficialV1.UPGRADES_TIER_M1 = ["mechanismOfficialV1"];
			Class.mechanismOfficialV1.UPGRADES_TIER_M1 = ["robotOfficialV1"];
		Class.juggernautOfficialV1.UPGRADES_TIER_M1 = ["behemothOfficialV1"];
			Class.behemothOfficialV1.UPGRADES_TIER_M1 = ["titanOfficialV1"];
		Class.medicareOfficialV1.UPGRADES_TIER_M1 = ["medicaidOfficialV1"];
			Class.medicaidOfficialV1.UPGRADES_TIER_M1 = ["refugeOfficialV1"];

const t1Bodies = [ "swordOfficialV1", "pacifierOfficialV1", "invaderOfficialV1", "centaurOfficialV1", "medicareOfficialV1", "automationOfficialV1", "juggernautOfficialV1" ];
if (!enableHealers) {
	t1Bodies.splice(4, 1); // Remove Medicare if healers are disabled
}

function mergeDreads(dread1, dread2, sourceDread, tier) {
	let dread1Name = dread1;
	let dread2Name = dread2;

	dread1 = ensureIsClass(dread1);
	dread2 = ensureIsClass(dread2);

	let GUNS = [],
		TURRETS = [],
		LABEL = `${dread1.LABEL}-${dread2.LABEL}`,
		BODY = JSON.parse(JSON.stringify(dreadnoughtBody)),
		UPGRADE_TOOLTIP = `${dread1.UPGRADE_TOOLTIP ?? ""} + ${dread2.UPGRADE_TOOLTIP ?? ""}`,
		INVISIBLE = null;

	// Label it
	if (dread1.LABEL == dread2.LABEL) LABEL = dread1.LABEL + " II";
	if (dread1.UPGRADE_TOOLTIP == dread2.UPGRADE_TOOLTIP) UPGRADE_TOOLTIP = dread1.UPGRADE_TOOLTIP;

	// Guns
	if (dread1.GUNS) GUNS.push(...dread1.GUNS);
	for (let g in dread2.GUNS) {
		let POSITION = JSON.parse(JSON.stringify(dread2.GUNS[g].POSITION)),
			PROPERTIES = dread2.GUNS[g].PROPERTIES;
		POSITION[5] += 60;
		GUNS.push({ POSITION, PROPERTIES });
	}

	// Turrets
	//if (dread1.TURRETS) TURRETS.push(...dread1.TURRETS);
	//if (dread2.TURRETS) TURRETS.push(...dread2.TURRETS);

	if (dread1.TURRETS) TURRETS.push(...dread1.TURRETS);
	for (let g in dread2.TURRETS) {
		let POSITION = JSON.parse(JSON.stringify(dread2.TURRETS[g].POSITION)),
			TYPE = dread2.TURRETS[g].TYPE;
		POSITION[3] += 60;
		TURRETS.push({ POSITION, TYPE });
	}

	// Invisibility

	if (dread1.INVISIBLE !== null) {
		INVISIBLE = dread1.INVISIBLE
	}
	if (dread2.INVISIBLE !== null) {
		INVISIBLE = dread2.INVISIBLE
	}

	// Body
	if (dread1.BODY) {
		for (let m in dread1.BODY) {
			BODY[m] += (dread1.BODY[m] - dreadnoughtBody[m]) / 2;
		}
	}
	if (dread2.BODY) {
		for (let m in dread2.BODY) {
			BODY[m] += (dread2.BODY[m] - dreadnoughtBody[m]) / 2;
		}
	}

	// Definition name
	let definitionName = dread1Name + dread2Name;

	// Save definition to Class
	Class[definitionName] = {
		PARENT: "genericDreadnought1",
		BODY, INVISIBLE, LABEL, UPGRADE_TOOLTIP, GUNS, TURRETS,
	}

	// Save upgrade to previous dread
	let upgradeLevel = `UPGRADES_TIER_${eval(`tier${tier}`)}`;
	util.forcePush(Class[sourceDread], upgradeLevel, definitionName);
	
	// Generate new dreads recursively
	if (!dread1.UPGRADES_TIER_M1 || !dread2.UPGRADES_TIER_M1) return;

	for (let upgrade1 of dread1.UPGRADES_TIER_M1) {
		for (let upgrade2 of dread2.UPGRADES_TIER_M1) {
			mergeDreads(upgrade1, upgrade2, definitionName, tier + 1);
		}
	}
}

// Initiate dread merge
for (let branch1 of Class.dreadnought_dreadsV1[`UPGRADES_TIER_${tier1}`]) {
	for (let branch2 of t1Bodies) {
		mergeDreads(branch1, branch2, branch1, 1);
	}
}