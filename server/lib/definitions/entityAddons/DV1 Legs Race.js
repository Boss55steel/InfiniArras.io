const { combineStats, makeAuto, weaponArray, makeTurret, weaponMirror, makeHat, makeAura, dereference, makeMenu } = require('../facilitators.js');
const { smshskl, base, basePolygonDamage, basePolygonHealth } = require('../constants.js');
const g = require('../gunvals.js');

function makeLaserON(gain = "(body.skill.raw[0] / 10) + 1", limit = "100 * (1 + (body.skill.raw[2] / 5))") {
    return [
        {
            event: "define",
            handler: ({ body }) => {
                body.charge = 0
                body.laserGuns = []
                for (let i = 0; i < body.gunsArrayed.length; i++) {
                    if (body.gunsArrayed[i].identifier == "laser") body.laserGuns.push(body.gunsArrayed[i])
                }
            
                for (let i = 0; i < body.laserGuns.length; i++) {
                    body.laserGuns[i].canShoot = false
                    body.laserGuns[i].shootOverride = true
                    body.ogSize = body.laserGuns[i].settings.size
                    body.ogDamage = body.laserGuns[i].settings.damage
                }
                body.ogLabel = body.label
            }
        },
        {
            event: "tick",
            handler: ({ body }) => {
                body.laserGuns[0].interpret()
                if (body.control.fire) {
                    body.charge += eval(gain);
                }
                if (body.charge >= eval(limit)) body.charge = eval(limit)
                body.label = body.charge > 0 ? `${body.ogLabel} ${body.charge.toFixed(2)}` : body.ogLabel
                for (let i = 0; i < body.laserGuns.length; i++) {
                    body.ogSize = body.laserGuns[i].settings.size
                    body.ogDamage = body.laserGuns[i].settings.damage
                }
                if (!body.control.fire && body.charge > 0) {
                    if (body.charge >= 20) {
                        for (let i = 0; i < body.laserGuns.length; i++) {
                            body.laserGuns[i].settings.size = body.ogSize * (1 + body.charge / 100)
                            body.laserGuns[i].settings.damage = body.ogDamage * (1 + body.charge / 100)
                            body.laserGuns[i].shoot()
                            body.laserGuns[i].settings.size = body.ogSize
                            body.laserGuns[i].settings.damage = body.ogDamage
                        }
                    }
                    body.charge = 0;
                }
            }
        }
    ]
}

const dreadnoughtBody = {
    SPEED: base.SPEED * 0.6,
    HEALTH: base.HEALTH * 4,
    DAMAGE: base.DAMAGE * 2.5,
    SHIELD: base.SHIELD * 2.5,
    FOV: base.FOV * 1.25,
    DENSITY: base.DENSITY * 6,
	PENETRATION: base.PENETRATION,
	REGEN: base.REGEN,
	ACCELERATION: base.ACCEL
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
g.dreadv1Lance = {
	range: 0.05,
	reload: 0.075,
	damage: 0.5,
	spray: 0,
	shudder: 0,
}

// Comment out the line below to enable this addon, uncomment it to disable this addon.
// return console.log('--- Dreadnoughts v1 addon [dreadv1.js] is disabled. See lines 32-33 to enable it. ---');

// Set the below variable to true to enable the Medicare and Medicaid and Refuge healing bodies.
const enableHealers = true;
// Set the below variable to true to enable the Legs race version of this
const legsrace = true

// Cogwheel

/*
class io_cogwheel extends IO {
    constructor(b, opts = {}) {
        super(b)
		this.interval = opts.interval ?? 2
		this.X = 0
        this.velY = this.body.velocity.y
        this.velX = this.body.velocity.x
    }
    think(input) {
		this.X += Math.PI / 32
		this.body.velocity.x = (this.velX * (Math.sin(this.X * this.interval) + 1.2)) * 0.6
		this.body.velocity.y = (this.velY * (Math.sin(this.X * this.interval) + 1.2)) * 0.6
    }
}
ioTypes.cogwheel = io_cogwheel
*/

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
Class.genericDreadnought = {
	PARENT: "genericTank",
	BODY: dreadnoughtBody,
	SHAPE: 6,
	COLOR: 'darkGrey',
	SIZE: 22.5,
	IS_THRUSTER_DREAD: false,
	SKILL_CAP: Array(10).fill(smshskl+3),
	REROOT_UPGRADE_TREE: "dreadOfficialV1",
}

Class.placeholderOfficialV1 = {
	PARENT: "genericDreadnought",
	LABEL: "PLACEHOLDER",
	UPGRADE_TOOLTIP: "PLACEHOLDER"
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
		TYPE: "healerHat",
	}]
}
Class.healerTrap = {
    PARENT: "trap",
    HEALER: true,
	TURRETS: [{
		POSITION: [15, 0, 0, 0, 360, 1],
		TYPE: "healerHat",
	}]
}
Class.tricareTurret = {
	PARENT: "genericTank",
	LABEL: "Turret",
	FACING_TYPE: ["spin", {speed: 0.04}],
	INDEPENDENT: true,
	COLOR: 16,
	GUNS: weaponArray([
		{
			POSITION: [8, 9, -0.5, 10.5, 0, 0, 0],
		}, {
			POSITION: [16, 10, 1, 0, 0, 0, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic, g.flankGuard, g.flankGuard, g.flankGuard, g.healer]),
				TYPE: "healerBullet",
				AUTOFIRE: true,
			},
		}
	], 2),
	TURRETS: [{
		POSITION: [13, 0, 0, 0, 360, 1],
		TYPE: "healerHat",
	}]
}
Class.trapcareTurret = {
	PARENT: "genericTank",
	LABEL: "Turret",
	FACING_TYPE: ["spin", {speed: 0.04}],
	INDEPENDENT: true,
	COLOR: 16,
	GUNS: weaponArray([
		{
            POSITION: {
                LENGTH: 16,
                WIDTH: 7
            }
        },
        {
            POSITION: {
                LENGTH: 13.5,
                WIDTH: 8
            }
        },
        {
            POSITION: {
                LENGTH: 3,
                WIDTH: 7,
                ASPECT: 1.5,
                X: 16
            },
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.trap, g.flankGuard, g.healer, {damage: 0.5}]),
				TYPE: "healerTrap",
				STAT_CALCULATOR: "trap",
				AUTOFIRE: true,
			},
        }
	], 2),
	TURRETS: [{
		POSITION: [13, 0, 0, 0, 360, 1],
		TYPE: "healerHat",
	}]
}
Class.inkTurret = {
	PARENT: "genericTank",
	LABEL: "Turret",
	FACING_TYPE: ["spin", {speed: 0.04}],
	INDEPENDENT: true,
	COLOR: 16,
	GUNS: weaponArray([
		{
            POSITION: {
                LENGTH: 11,
                WIDTH: 6,
                ASPECT: -0.4,
                X: 12
            }
        },
        {
            POSITION: {
                LENGTH: 21.5,
                WIDTH: 7
            },
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic, g.flankGuard, g.healer, {damage: 0.5}]),
				TYPE: "healerBullet",
				AUTOFIRE: true,
			}
        },
        {
            POSITION: {
                LENGTH: 13.5,
                WIDTH: 8
            }
        },
        {
            POSITION: {
                LENGTH: 3,
                WIDTH: 7,
                ASPECT: 1.5,
                X: 16
            },
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.trap, g.flankGuard, g.healer, {damage: 0.5}]),
				TYPE: "healerTrap",
				STAT_CALCULATOR: "trap",
				AUTOFIRE: true,
			}
        }
	], 2),
	TURRETS: [{
		POSITION: [13, 0, 0, 0, 360, 1],
		TYPE: "healerHat",
	}]
}
Class.megacareTurret = {
	PARENT: "genericTank",
	LABEL: "Turret",
	FACING_TYPE: ["spin", {speed: 0.04}],
	INDEPENDENT: true,
	COLOR: 16,
	GUNS: [
		{
			POSITION: [8, 11, -0.5, 12.5, 0, 0, 0],
		}, {
			POSITION: [18, 12, 1, 0, 0, 0, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic, g.flankGuard, g.flankGuard, g.pounder, g.healer, {damage: 2}]),
				TYPE: "healerBullet",
				AUTOFIRE: true,
			},
		}
	],
	TURRETS: [{
		POSITION: [13, 0, 0, 0, 360, 1],
		TYPE: "healerHat",
	}]
}
Class.ultracareTurret = {
	PARENT: "genericTank",
	LABEL: "Turret",
	FACING_TYPE: ["spin", {speed: 0.04}],
	INDEPENDENT: true,
	COLOR: 16,
	GUNS: [
		{
			POSITION: [8, 13, -0.5, 12.5, 0, 0, 0],
		}, {
			POSITION: [18, 14, 1, 0, 0, 0, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic, g.flankGuard, g.flankGuard, g.pounder, g.destroyer, g.healer, {damage: 2}]),
				TYPE: "healerBullet",
				AUTOFIRE: true,
			},
		}
	],
	TURRETS: [{
		POSITION: [13, 0, 0, 0, 360, 1],
		TYPE: "healerHat",
	}]
}
Class.teracareTurret = {
	PARENT: "genericTank",
	LABEL: "Turret",
	FACING_TYPE: ["spin", {speed: 0.04}],
	INDEPENDENT: true,
	COLOR: 16,
	GUNS: [
		{
			POSITION: [8, 18.5, -0.5, 12.5, 0, 0, 0],
		}, {
			POSITION: [18, 19.5, 1, 0, 0, 0, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic, g.flankGuard, g.flankGuard, g.pounder, g.destroyer, g.annihilator, g.healer, {damage: 2}]),
				TYPE: "healerBullet",
				AUTOFIRE: true,
			},
		}
	],
	TURRETS: [{
		POSITION: [13, 0, 0, 0, 360, 1],
		TYPE: "healerHat",
	}]
}

Class.megacareTurret = {
	PARENT: "genericTank",
	LABEL: "Turret",
	FACING_TYPE: ["spin", {speed: 0.04}],
	INDEPENDENT: true,
	COLOR: 16,
	GUNS: [
		{
			POSITION: [8, 11, -0.5, 12.5, 0, 0, 0],
		}, {
			POSITION: [18, 12, 1, 0, 0, 0, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic, g.flankGuard, g.flankGuard, g.pounder, g.healer, {damage: 2}]),
				TYPE: "healerBullet",
				AUTOFIRE: true,
			},
		}
	],
	TURRETS: [{
		POSITION: [13, 0, 0, 0, 360, 1],
		TYPE: "healerHat",
	}]
}
Class.hospitalBullet = {
    PARENT: "minimissile",
    HITS_OWN_TYPE: "push",
    BODY: {
        PENETRATION: Class.bullet.BODY.PENETRATION,
        SPEED: Class.bullet.BODY.SPEED,
        RANGE: Class.bullet.BODY.RANGE,
        DENSITY: Class.bullet.BODY.DENSITY,
        HEALTH: Class.bullet.BODY.HEALTH,
        DAMAGE: Class.bullet.BODY.DAMAGE + 20,
        PUSHABILITY: Class.bullet.BODY.PENETRATION,
    },
    HEALER: true,
	GUNS: [
		{
			POSITION: [14, 6, 1, 0, 0, 180, 0],
			PROPERTIES: {
				AUTOFIRE: true,
				SHOOT_SETTINGS: combineStats([g.basic, { recoil: 0.5 }, g.lowPower, g.healer]),
				TYPE: ["healerBullet", { PERSISTS_AFTER_DEATH: true }],
				STAT_CALCULATOR: "thruster",
			},
		},
	],
	TURRETS: [{
		POSITION: [13, 0, 0, 0, 360, 1],
		TYPE: "healerHat",
	}]
}
Class.hospitalTurret = {
	PARENT: "genericTank",
	LABEL: "Turret",
	FACING_TYPE: ["spin", {speed: 0.04}],
	INDEPENDENT: true,
	COLOR: 16,
	GUNS: [
		{
			POSITION: [19.2, 13, 0.7, 0, 0, 0, 0]
		}, {
			POSITION: [17, 13, 1, 0, 0, 0, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic, g.flankGuard, g.flankGuard, g.pounder, g.launcher, g.healer, {damage: 2}]),
				TYPE: 'hospitalBullet',
				STAT_CALCULATOR: 'sustained',
				AUTOFIRE: true,
			}
		}
	],
	TURRETS: [{
		POSITION: [13, 0, 0, 0, 360, 1],
		TYPE: "healerHat",
	}]
}
Class.clinicBullet = {
    PARENT: "minimissile",
    HITS_OWN_TYPE: "push",
    BODY: {
        PENETRATION: Class.bullet.BODY.PENETRATION,
        SPEED: Class.bullet.BODY.SPEED,
        RANGE: Class.bullet.BODY.RANGE,
        DENSITY: Class.bullet.BODY.DENSITY,
        HEALTH: Class.bullet.BODY.HEALTH,
        DAMAGE: Class.bullet.BODY.DAMAGE + 20,
        PUSHABILITY: Class.bullet.BODY.PENETRATION,
    },
    HEALER: true,
	GUNS: [
		{
			POSITION: [16.5, 10, 1.5, 0, 0, 180, 3],
			PROPERTIES: {
				AUTOFIRE: true,
				SHOOT_SETTINGS: combineStats([g.basic, g.missileTrail, g.rocketeerMissileTrail, g.healer]),
				TYPE: ["healerBullet", { PERSISTS_AFTER_DEATH: true }],
				STAT_CALCULATOR: "thruster",
			},
		},
	],
	TURRETS: [{
		POSITION: [13, 0, 0, 0, 360, 1],
		TYPE: "healerHat",
	}]
}
Class.clinicTurret = {
	PARENT: "genericTank",
	LABEL: "Turret",
	FACING_TYPE: ["spin", {speed: 0.04}],
	INDEPENDENT: true,
	COLOR: 16,
	GUNS: [
		{
			POSITION: [19, 7.73, 1.5, 0, 0, 0, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic, g.flankGuard, g.flankGuard, g.pounder, g.launcher, g.rocketeer, g.healer, {damage: 2}]),
				TYPE: 'clinicBullet',
				STAT_CALCULATOR: 'sustained',
				AUTOFIRE: true,
			}
		}, {
			POSITION: [16, 11, -1.5, 0, 0, 0, 0]
		}
	],
	TURRETS: [{
		POSITION: [13, 0, 0, 0, 360, 1],
		TYPE: "healerHat",
	}]
}
Class.pharmacyTurret = {
	PARENT: "genericTank",
	LABEL: "Turret",
	FACING_TYPE: ["spin", {speed: 0.04}],
	INDEPENDENT: true,
	COLOR: 16,
	GUNS: [
		...weaponMirror([{
			POSITION: {
				LENGTH: 4,
				WIDTH: 3,
				X: 11,
				Y: 3
			},
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.shotgun, g.healer]),
				TYPE: 'healerBullet'
			}
		},
		{
			POSITION: {
				LENGTH: 1,
				WIDTH: 4,
				X: 12,
				Y: 1
			},
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.shotgun, g.healer]),
				TYPE: 'healerBullet'
			}
		},
		{
			POSITION: {
				LENGTH: 1,
				WIDTH: 3,
				X: 13,
				Y: 1
			},
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.shotgun, g.healer]),
				TYPE: 'healerBullet'
			}
		},
		{
			POSITION: {
				LENGTH: 1,
				WIDTH: 2,
				X: 13,
				Y: 2
			},
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.shotgun, g.healer]),
				TYPE: 'healerBullet'
			}
		}]),
		{
			POSITION: {
				LENGTH: 4,
				WIDTH: 4,
				X: 13
			},
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.shotgun, g.healer]),
				TYPE: 'healerBullet'
			}
		},
		{
			POSITION: {
				LENGTH: 15,
				WIDTH: 14,
				X: 6
			},
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.shotgun, g.healer, g.fake]),
				TYPE: 'healerBullet'
			}
		},
		{
			POSITION: {
				LENGTH: 8,
				WIDTH: 14,
				ASPECT: -1.3,
				X: 4
			}
		}
	],
	TURRETS: [{
		POSITION: [13, 0, 0, 0, 360, 1],
		TYPE: "healerHat",
	}]
}
Class.apothecaryTurret = {
	PARENT: "genericTank",
	LABEL: "Turret",
	FACING_TYPE: ["spin", {speed: 0.04}],
	INDEPENDENT: true,
	COLOR: 16,
	GUNS: [
		...weaponMirror([{
			POSITION: {
				LENGTH: 4,
				WIDTH: 3,
				X: 11,
				Y: 3
			},
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.shotgun, g.machineGun, g.healer]),
				TYPE: 'healerBullet'
			}
		},
		{
			POSITION: {
				LENGTH: 1,
				WIDTH: 4,
				X: 12,
				Y: 1
			},
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.shotgun, g.machineGun, g.healer]),
				TYPE: 'healerBullet'
			}
		},
		{
			POSITION: {
				LENGTH: 1,
				WIDTH: 3,
				X: 13,
				Y: 1
			},
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.shotgun, g.machineGun, g.healer]),
				TYPE: 'healerBullet'
			}
		},
		{
			POSITION: {
				LENGTH: 1,
				WIDTH: 2,
				X: 13,
				Y: 2
			},
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.shotgun, g.machineGun, g.healer]),
				TYPE: 'healerBullet'
			}
		}]),
		{
			POSITION: {
				LENGTH: 4,
				WIDTH: 4,
				X: 13
			},
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.shotgun, g.machineGun, g.healer]),
				TYPE: 'healerBullet'
			}
		},
		{
			POSITION: {
				LENGTH: 15,
				WIDTH: 14,
				X: 6,
				ASPECT: 1.4
			},
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.shotgun, g.machineGun, g.healer, g.fake]),
				TYPE: 'healerBullet'
			}
		},
		{
			POSITION: {
				LENGTH: 8,
				WIDTH: 14,
				ASPECT: -1.3,
				X: 4
			}
		}
	],
	TURRETS: [{
		POSITION: [13, 0, 0, 0, 360, 1],
		TYPE: "healerHat",
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
		TYPE: "healerHat",
	}]
}
Class.menderBall = {
	PARENT: "genericTank",
	COLOR: "grey",
	HITS_OWN_TYPE: 'hard',
	INDEPENDENT: true,
	TURRETS: [{
		POSITION: [21.5, 0, 0, 0, 360, 0],
		TYPE: "flailBallSpike",
	}],
	GUNS: [
		{ 
			POSITION: {WIDTH: 10, LENGTH: -10},
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic, g.healer, {
					range: 0.1,
					speed: 0,
					maxSpeed: 0,
					recoil: 0,
					reload: 0.1,
					damage: 4,
					size: 2,
					health: 1,
				}]),
				TYPE: ["healerBullet", {
					ALPHA: 0,
					ON: [{
						event: 'tick',
						handler: ({body}) => {
							body.SIZE -= 0.6;
							if (body.SIZE < 1) body.kill();
						}
					}],
				}], 
				AUTOFIRE: true,
				BORDERLESS: true,
				DRAW_FILL: false,
			}
		}
	]
}
Class.menderBolt1 = {
	PARENT: "genericTank",
	COLOR: "grey",
	INDEPENDENT: true,
	GUNS: [{
		POSITION: [40, 5, 1, 8, 0, 0, 0]
	}],
	TURRETS: [{
		POSITION: [48, 56, 0, 0, 360, 1],
		TYPE: "menderBall"
	}],
}
Class.menderBolt2 = {
	PARENT: "genericTank",
	COLOR: "grey",
	INDEPENDENT: true,
	GUNS: [{
		POSITION: [30, 5, 1, 8, 0, 0, 0]
	}],
	TURRETS: [{
		POSITION: [20, 36, 0, 0, 360, 1],
		TYPE: "menderBolt1"
	}],
}
Class.menderBolt3 = {
	PARENT: "genericTank",
	COLOR: "grey",
	GUNS: [{
		POSITION: [30, 5, 1, 8, 0, 0, 0]
	}],
	TURRETS: [{
		POSITION: [20, 36, 0, 0, 360, 1],
		TYPE: "menderBolt2"
	}],
}
Class.menderBolt4 = {
	PARENT: "genericTank",
	COLOR: "grey",
	GUNS: [{
		POSITION: [30, 5, 1, 8, 0, 0, 0]
	}],
	TURRETS: [{
		POSITION: [20, 36, 0, 0, 360, 1],
		TYPE: "menderBolt3"
	}],
}
Class.menderBolt5 = {
	PARENT: "genericTank",
	COLOR: "grey",
	GUNS: [{
		POSITION: [30, 5, 1, 8, 0, 0, 0]
	}],
	TURRETS: [{
		POSITION: [20, 36, 0, 0, 360, 1],
		TYPE: "menderBolt4"
	}],
}
Class.menderTurret = {
	PARENT: "genericTank",
	LABEL: "Turret",
    LABEL: "Mender",
	FACING_TYPE: ["spin", {speed: 0.04}],
	INDEPENDENT: true,
	COLOR: 16,
    TURRETS: [
		...weaponArray({
        	TYPE: ['menderBolt5', {
            	INDEPENDENT: true
        	}],
        	POSITION: {
    	        SIZE: 6,
	            X: 10,
            	ARC: 190
        	}
    	}, 3),
		{
			POSITION: [13, 0, 0, 0, 360, 1],
			TYPE: "healerHat",
		}
	]
}
Class.repairmentTurret = {
	PARENT: "genericTank",
	LABEL: "Turret",
	FACING_TYPE: ["spin", {speed: 0.04}],
	INDEPENDENT: true,
	COLOR: 16,
    TURRETS: [
		...weaponArray(
			[
				{
        			TYPE: ['menderBolt5', {
        	    		INDEPENDENT: true
        			}],
	    	    	POSITION: {
    			        SIZE: 6,
	    		        X: 10,
            			ARC: 190
        			}
    			},
				{
        			TYPE: ['menderBolt3', {
        	    		INDEPENDENT: true
        			}],
	    	    	POSITION: {
    			        SIZE: 6,
						ANGLE: 60,
	    		        X: 10,
            			ARC: 190
        			}
    			}
			], 3),
		{
			POSITION: [13, 0, 0, 0, 360, 1],
			TYPE: "healerHat",
		}
	]
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
	], 6),
	TURRETS: [{
		POSITION: [13, 0, 0, 0, 360, 1],
		TYPE: "healerHat",
	}]
}
Class.havenTurret = {
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
		TYPE: "healerHat",
	}]
}
Class.reanimatorTurret = {
	PARENT: "genericTank",
	LABEL: "Turret",
	FACING_TYPE: ["spin", {speed: 0.04}],
	INDEPENDENT: true,
	COLOR: 16,
	GUNS: weaponArray([
		{
			POSITION: [8, 3, -0.5, 6.5, 0, 0, 0],
		}, {
			POSITION: [13, 4, 1, 0, 0, 0, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic, g.flankGuard, g.flankGuard, g.gunner, g.cyclone, g.healer]),
				TYPE: "healerBullet",
				AUTOFIRE: true,
			},
		}
	], 12, {delayIncrement: 1/3}),
	TURRETS: [{
		POSITION: [13, 0, 0, 0, 360, 1],
		TYPE: "healerHat",
	}]
}
Class.recoveryTurret = {
	PARENT: "genericTank",
	LABEL: "Turret",
	FACING_TYPE: ["spin", {speed: 0.04}],
	INDEPENDENT: true,
	COLOR: 16,
	GUNS: weaponArray([
		{
			POSITION: [8, 2, -0.5, 6.5, 0, 0, 0],
		}, {
			POSITION: [13, 3, 1, 0, 0, 0, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic, g.flankGuard, g.flankGuard, g.gunner, g.cyclone, g.healer]),
				TYPE: "healerBullet",
				AUTOFIRE: true,
			},
		}
	], 15, {delayIncrement: 1/3}),
	TURRETS: [{
		POSITION: [13, 0, 0, 0, 360, 1],
		TYPE: "healerHat",
	}]
}
Class.turretedDrone = makeAuto("drone", "Auto-Drone", {size: 7.5, type: 'droneAutoTurret'});
Class.twinTurretedDrone = makeAuto("drone", "Auto-Drone", {size: 7.5, type: 'legionaryTwin'});
Class.turretedTrap = makeAuto("trap", "Auto-Trap", {size: 7.5, type: 'droneAutoTurret'});
Class.turretedTrap.BODY.RECOIL_MULTIPLIER = 0.1;

Class.megaAutoPillbox = makeAuto("unsetTrap", "Mega Pillbox", {type: "megaAutoTurret", size: 12})
Class.twinTurretedTrap = makeAuto("trap", "Auto-Trap", {size: 7.5, type: 'legionaryTwin'});
Class.tripleTurretedTrap = makeAuto("trap", "Auto-Trap", {size: 7.5, type: 'tripleShot'});
Class.twinTurretedTrap.BODY.RECOIL_MULTIPLIER = 0.1;
Class.tripleTurretedTrap.BODY.RECOIL_MULTIPLIER = 0.1;

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
	}, 3, {delayIncrement: 1/3})
};

Class.twinSwarmTrap = {
	PARENT: "trap",
	GUNS: weaponArray([{
		POSITION: [6, 8, 0.4, 7, 5, 60, 0],
		PROPERTIES: {
			SHOOT_SETTINGS: combineStats([g.swarm, g.twin, {recoil: 0}]),
			TYPE: ["swarm", {INDEPENDENT: true}],
			AUTOFIRE: true,
			STAT_CALCULATOR: "swarm",
		}
	}, {
		POSITION: [6, 8, 0.4, 7, -5, 60, 0.5],
		PROPERTIES: {
			SHOOT_SETTINGS: combineStats([g.swarm, g.twin, {recoil: 0}]),
			TYPE: ["swarm", {INDEPENDENT: true}],
			AUTOFIRE: true,
			STAT_CALCULATOR: "swarm",
		}
	}], 3, {delayIncrement: 1/3})
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
Class.tripleShotMinion = {
    PARENT: "minion",
    GUNS: [
		...weaponMirror({
			POSITION: {
				LENGTH: 19,
				WIDTH: 8,
				Y: 2,
				ANGLE: 18,
				DELAY: 0.5
			},
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.tripleShot]),
				TYPE: 'bullet'
			}
		}),
		{
			POSITION: {
				LENGTH: 22,
				WIDTH: 8
			},
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.tripleShot]),
				TYPE: 'bullet'
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
Class.dieselMinion = {
    PARENT: "minion",
    GUNS: [
        {
            POSITION: {
                LENGTH: 14,
                WIDTH: 12,
                ASPECT: 1.6,
                X: 8
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, {reload: 0.8}]),
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
            POSITION: [16, 8, 1, 0, 0, -150, 0.1],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.flankGuard, g.triAngle, g.thruster]),
                TYPE: "bullet",
                LABEL: "thruster",
            },
        },
    ]
}
Class.boosterMinion = {
    PARENT: "drone",
    SHAPE: 0,
    GUNS: weaponMirror([
        {
            POSITION: {
                LENGTH: 14,
                WIDTH: 8,
                ANGLE: 135,
                DELAY: 0.6
            },
	            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.flankGuard, g.triAngle, g.thruster]),
                TYPE: 'bullet',
                LABEL: "Thruster"
            }
        },
        {
            POSITION: {
                LENGTH: 16,
                WIDTH: 8,
            	ANGLE: 150,
                DELAY: 0.1
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.flankGuard, g.triAngle, g.thruster]),
                TYPE: 'bullet',
                LABEL: "Thruster"
            }
        }
    ])
}

makeAuraV1 = (damageFactor = 1, sizeFactor = 1, opacity = 0.3, shapeBase = Class.dodecahedron.SHAPE, shapeAura = Class.icosahedron.SHAPE, auraColor) => {
	auraColor = auraColor ?? 0;
	Class["aura" + damageFactor.toString() + sizeFactor.toString() + opacity.toString()] = {
    	PARENT: "auraBase",
    	LABEL: "Aura",
    	COLOR: auraColor,
		SHAPE: Class.icosahedron.SHAPE,
    	FACING_TYPE: ["spin", {speed: -0.02}],
		LAYER: 13,
    	BODY: {
        	DAMAGE: 0.4,
    	},
	};
	return {
		PARENT: "genericTank",
		INDEPENDENT: true,
		LABEL: "",
		COLOR: auraColor,
		SHAPE: shapeBase,
    	FACING_TYPE: ["spin", {speed: 0.02}],
		GUNS: [
			{
				POSITION: [0, 20, 1, 0, 0, 0, 0,],
				PROPERTIES: {
					SHOOT_SETTINGS: combineStats([g.aura, { size: sizeFactor, damage: damageFactor }]),
					TYPE: ["aura" + damageFactor.toString() + sizeFactor.toString() + opacity.toString(), {COLOR: auraColor, ALPHA: opacity}],
					MAX_CHILDREN: 1,
					AUTOFIRE: true,
					SYNCS_SKILLS: true,
					ALPHA: 0
				}, 
			}, 
		],
	};
}

function makeSceneAuraAura(force, shape = Class.icosahedron.SHAPE, eligibleTypes = ["tank", "miniboss", "food", "bullet", "trap", "minion", "swarm"]) {
	let isAttract = force < 0;
	
	return {
        PARENT: 'aura',
        HEALER: true,
        BODY: {
            DAMAGE: 0,
        },
		SHAPE: shape,
    	FACING_TYPE: ["spin", {speed: -0.02}],
		LAYER: 13,
        ON: [
            {
                event: "tick",
                handler: ({ body }) => {
                    if (body.master.autoOverride) return
                    for (let instance of entities.values()) {
                        let diffX = instance.x - body.x,
                            diffY = instance.y - body.y,
                            dist2 = diffX ** 2 + diffY ** 2;
                        if (util.getDistance(body, instance) <= (body.size + instance.size)) {
                            if ((instance.team != body.team || (instance.type == "undertowEffect" && instance.master.id == body.master.id)) && instance.isTurret != true) {
                                if (!eligibleTypes.includes(instance.type)) return
                                else if (instance.type == "food") {
                                    forceMulti = (6 / instance.size)
                                }
                                else {
                                    forceMulti = (2 / instance.size)
                                }
                                forceMulti = forceMulti * (force * -1)
                                instance.velocity.x += util.clamp(body.x - instance.x, -90, 90) * instance.damp * forceMulti;
                                instance.velocity.y += util.clamp(body.y - instance.y, -90, 90) * instance.damp * forceMulti;
                            }
                        }
                    }
                }
            }
        ],
    }
}

function makeSceneAura(force = 1, sizeFactor = 1, opacity = 0.3, shape = Class.dodecahedron.SHAPE, auraShape = Class.icosahedron.SHAPE, auraColor, eligibleTypes = ["tank", "miniboss", "food", "bullet", "trap", "minion", "swarm"]) {
    let isAttract = force < 0;
    auraColor = auraColor ?? (isAttract ? "green" : "yellow");

    Class[(isAttract ? "attractionAura" : "repulsionAura") + "f" + force + "s" + sizeFactor + "o" + opacity] = makeSceneAuraAura(force, auraShape, eligibleTypes)
    return {
        PARENT: "genericTank",
        INDEPENDENT: true,
        LABEL: "",
        COLOR: auraColor,
		SHAPE: shape,
    	FACING_TYPE: ["spin", {speed: 0.02}],
        GUNS: [
            {
                POSITION: [0, 20, 1, 0, 0, 0, 0,],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.aura, { size: sizeFactor }]),
                    TYPE: [(isAttract ? "attractionAura" : "repulsionAura") + "f" + force + "s" + sizeFactor + "o" + opacity, {COLOR: auraColor, ALPHA: opacity}],
                    MAX_CHILDREN: 1,
                    AUTOFIRE: true,
                    SYNCS_SKILLS: true,
                },
            },
        ]
    };
}

Class.radiationAura = makeAuraV1(1, 1, 0.6)

Class.uraniumAura = makeAuraV1(1.25 ** -0.75, 1.25, 0.6)

Class.thoriumAura = makeAuraV1(1.5 ** -0.75, 1.5, 0.6)
Class.chernobylAura = makeAuraV1(2/3 ** -0.9, 5/3, 0.4)
Class.emmissionAura = makeAuraV1(1.1, 0.9, 0.7)

Class.radiumAura = makeAuraV1(1.75 ** -0.75, 1.75, 0.6)
Class.hiroshimaAura = makeAuraV1(3/4 ** -0.9, 7/4, 0.4)
Class.dispersalAura = makeAuraV1(1.2, 0.8, 0.8)

Class.divergenceAura = makeSceneAura(1, 1, 0.6)

Class.discrepancyAura = makeSceneAura(4/3, 1, 0.7)
Class.conformityAura = makeSceneAura(-1, 1, 0.6)
Class.magnetPosAura = makeSceneAuraAura(1)
Class.magnetNegAura = makeSceneAuraAura(-1)

Class.dissimilitudeAura = makeSceneAura(5/3, 1, 0.8)
Class.similarityAura = makeSceneAura(-4/3, 1, 0.7)

Class.upheavalAura = makeAuraV1(1, 1, 0.6, Class.cube.SHAPE)
Class.upheavalTrap = {
	PARENT: "trap",
	TURRETS: [
		{
			POSITION: [10, 0, 0, 0, 0, 1],
			TYPE: "chernobylAura"
		}
	]
}

Class.upheavalAura.GUNS = weaponArray({
	POSITION: [0, 20, 1, 0, 0, 0, 0],
	PROPERTIES: {
		SHOOT_SETTINGS: combineStats([g.trap, {damage: 0.1, health: 10, range: 0.2, reload: 4, shudder: 0}]),
		TYPE: "upheavalTrap",
		STAT_CALCULATOR: "trap",
		ALPHA: 0,
		AUTOFIRE: true
	}
}, 3)

Class.dispositionAura = makeAuraV1(1, 1, 0.6, Class.tetrahedron.SHAPE)

Class.dispositionAura.GUNS = weaponArray({
	POSITION: [0, 20, 1, 0, 0, 0, 0],
	PROPERTIES: {
		SHOOT_SETTINGS: combineStats([g.trap, {damage: 0.1, health: 10, range: 0.2, reload: 6, shudder: 0}]),
		TYPE: "upheavalTrap",
		STAT_CALCULATOR: "trap",
		ALPHA: 0,
		AUTOFIRE: true
	}
}, 5)

Class.propensityAura = makeAuraV1(1, 1, 0.6, Class.octahedron.SHAPE)

Class.propensityAura.GUNS = weaponArray({
	POSITION: [0, 20, 1, 0, 0, 0, 0],
	PROPERTIES: {
		SHOOT_SETTINGS: combineStats([g.trap, {damage: 0.1, health: 10, range: 0.2, reload: 8, shudder: 0}]),
		TYPE: "upheavalTrap",
		STAT_CALCULATOR: "trap",
		ALPHA: 0,
		AUTOFIRE: true
	}
}, 7)

Class.cataclysmBase = makeAuraV1(1, 1, 0.6, Class.cube.SHAPE)
Class.cataclysmAura = makeSceneAura(1, 1, 0.6)
Class.cataclysmTrap = {
	PARENT: "trap",
	TURRETS: [
		{
			POSITION: [10, 0, 0, 0, 0, 1],
			TYPE: "cataclysmAura"
		}
	]
}

Class.cataclysmBase.GUNS = weaponArray({
	POSITION: [0, 20, 1, 0, 0, 0, 0],
	PROPERTIES: {
		SHOOT_SETTINGS: combineStats([g.trap, {damage: 0.5, health: 10, range: 0.2, reload: 4, shudder: 0}]),
		TYPE: "cataclysmTrap",
		STAT_CALCULATOR: "trap",
		ALPHA: 0,
		AUTOFIRE: true
	}
}, 3)

Class.turmoilBase = makeAuraV1(1, 1, 0.6, Class.cube.SHAPE)
Class.turmoilAura = makeSceneAura(-1, 1, 0.6)
Class.turmoilTrap = {
	PARENT: "trap",
	TURRETS: [
		{
			POSITION: [10, 0, 0, 0, 0, 1],
			TYPE: "turmoilAura"
		}
	]
}

Class.turmoilBase.GUNS = weaponArray({
	POSITION: [0, 20, 1, 0, 0, 0, 0],
	PROPERTIES: {
		SHOOT_SETTINGS: combineStats([g.trap, {damage: 0.5, health: 10, range: 0.2, reload: 4, shudder: 0}]),
		TYPE: "turmoilTrap",
		STAT_CALCULATOR: "trap",
		ALPHA: 0,
		AUTOFIRE: true
	}
}, 3)

Class.disruptionAura = makeAuraV1(2/3 ** -0.9, 5/3, 0.4, 0, 0)
Class.rippleAura = makeSceneAura(-1, 1, 0.6, 0, 0)

// T0
Class.dreadOfficialV1 = {
	PARENT: "genericDreadnought",
	LABEL: "Dreadnought",
	UPGRADE_LABEL: "Dreads V1",
	EXTRA_SKILL: 18,
	VALUE: 1031304914
}

// T1
Class.swordOfficialV1 = {
	PARENT: "genericDreadnought",
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
	PARENT: "genericDreadnought",
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
	PARENT: "genericDreadnought",
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
	PARENT: "genericDreadnought",
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

Class.lancerOfficialV1 = {
	PARENT: "genericDreadnought",
	LABEL: "Lancer",
	UPGRADE_TOOLTIP: "Lancers",
	BODY: {
		SPEED: 0.8 * dreadnoughtBody.SPEED
	},
	GUNS: weaponArray([
		{
			POSITION: [0, 7, 1, 10, 0, 0, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic, g.dreadv1Lance]),
				TYPE: ["bullet", {ALPHA: 0}],
				ALPHA: 0
			},
		},
		{
			POSITION: [13, 8, 0.01, 9, 0, 0, 0]
		}
	], 3)
}

Class.automationOfficialV1 = {
	PARENT: "genericDreadnought",
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
	PARENT: "genericDreadnought",
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
	PARENT: "genericDreadnought",
	LABEL: "Medicare",
	UPGRADE_TOOLTIP: "Healing",
	TURRETS: [{
		POSITION: [8, 0, 0, 0, 360, 1],
		TYPE: "medicareTurret",
	}]
}

Class.chernobylTurret = {
	PARENT: "genericTank",
	SHAPE: Class.dodecahedron.SHAPE,
	FACING_TYPE: ["spin", {speed: 0.02}],
	GUNS: weaponArray({
		POSITION: [70, 5, 1, 0, 0, 0, 0]
	}, 3),
	TURRETS: weaponArray({
		POSITION: [15, 70, 0, 0, 0, 360, 1],
		TYPE: ["chernobylAura"]
	}, 3)
}

Class.hiroshimaTurret = {
	PARENT: "genericTank",
	SHAPE: Class.dodecahedron.SHAPE,
	FACING_TYPE: ["spin", {speed: 0.02}],
	GUNS: weaponArray({
		POSITION: [70, 5, 1, 0, 0, 0, 0]
	}, 5),
	TURRETS: weaponArray({
		POSITION: [15, 70, 0, 0, 0, 360, 1],
		TYPE: ["hiroshimaAura"]
	}, 5)
}

Class.magnetPositiveSign = makeHat("M 0.2 0.3 L 0.3 0.2 L 0.9 0.2 L 1 0.1 L 1 -0.1 L 0.9 -0.2 L 0.3 -0.2 L 0.2 -0.3 L 0.2 -0.9 L 0.1 -1 L -0.1 -1 L -0.2 -0.9 L -0.2 -0.3 L -0.3 -0.2 L -0.9 -0.2 L -1 -0.1 L -1 0.1 L -0.9 0.2 L -0.3 0.2 L -0.2 0.3 L -0.2 0.9 L -0.1 1 L 0.1 1 L 0.2 0.9 Z", {color: "black"})
Class.magnetNegativeSign = makeHat("M 0.9 0.2 L 1 0.1 L 1 -0.1 L 0.9 -0.2 L -0.9 -0.2 L -1 -0.1 L -1 0.1 L -0.9 0.2 Z", {color: "black"})
Class.magnetPositive = {
	PARENT: "genericTank",
	COLOR: "red",
	SHAPE: 4,
    GUNS: [
        {
            POSITION: [0, 20, 1, 0, 0, 0, 0,],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.aura, { size: 1 }]),
                TYPE: ["magnetPosAura", {COLOR: "red", ALPHA: 0.2}],
                MAX_CHILDREN: 1,
                AUTOFIRE: true,
                SYNCS_SKILLS: true,
				ALPHA: 0
            },
        },
    ],
	TURRETS: [
		{
			POSITION: [10, 0, 0, 0, 0, 1],
			TYPE: ["magnetPositiveSign", {FACING_TYPE: "noFacing"}]
		}
	]
}
Class.magnetNegative = {
	PARENT: "genericTank",
	COLOR: "blue",
	SHAPE: 4,
    GUNS: [
        {
            POSITION: [0, 20, 1, 0, 0, 0, 0,],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.aura, { size: 1 }]),
                TYPE: ["magnetNegAura", {COLOR: "blue", ALPHA: 0.2}],
                MAX_CHILDREN: 1,
                AUTOFIRE: true,
                SYNCS_SKILLS: true,
				ALPHA: 0
            },
        },
    ],
	TURRETS: [
		{
			POSITION: [10, 0, 0, 0, 0, 1],
			TYPE: ["magnetNegativeSign", {FACING_TYPE: "noFacing"}]
		}
	]
}

Class.magnetTurret = {
	PARENT: "genericTank",
	FACING_TYPE: "spin",
	COLOR: 16,
	SHAPE: "M -1.1 0.3 L -0.9 0.4 L 0.9 0.4 L 1.1 0.3 L 1.1 -0.3 L 0.9 -0.4 L -0.9 -0.4 L -1.1 -0.3 Z",
	GUNS: weaponArray({
		POSITION: [55, 5, 1, 0, 0, 0, 0]
	}, 2),
	TURRETS: [
		{
			POSITION: [20, 50, 0, 0, 0, 1],
			TYPE: ["magnetNegative", {FACING_TYPE: "noFacing"}]
		},
		{
			POSITION: [20, 50, 0, 180, 0, 1],
			TYPE: ["magnetPositive", {FACING_TYPE: "noFacing"}]
		}
	]
}

Class.snareTurret = {
	PARENT: "genericTank",
	FACING_TYPE: "spin",
	COLOR: 16,
	SHAPE: "M -1.3 0.3 L -1.1 0.4 L -0.5 0.4 L -0.4 0.5 L -0.4 1.1 L -0.3 1.3 L 0.3 1.3 L 0.4 1.1 L 0.4 0.5 L 0.5 0.4 L 1.1 0.4 L 1.3 0.3 L 1.3 -0.3 L 1.1 -0.4 L 0.5 -0.4 L 0.4 -0.5 L 0.4 -1.1 L 0.3 -1.3 L -0.3 -1.3 L -0.4 -1.1 L -0.4 -0.5 L -0.5 -0.4 L -1.1 -0.4 L -1.3 -0.3 Z",
	GUNS: weaponArray({
		POSITION: [55, 5, 1, 0, 0, 0, 0]
	}, 4),
	TURRETS: weaponArray([
		{
			POSITION: [20, 55, 0, 0, 0, 1],
			TYPE: ["magnetNegative", {FACING_TYPE: "noFacing"}]
		},
		{
			POSITION: [20, 55, 0, 90, 0, 1],
			TYPE: ["magnetPositive", {FACING_TYPE: "noFacing"}]
		}
	], 2)
}

Class.radiationOfficialV1 = {
	PARENT: "genericDreadnought",
	LABEL: "Radiation",
	UPGRADE_TOOLTIP: "Aura",
	TURRETS: [
		{
			POSITION: [15, 0, 0, 0, 0, 360, 1],
			TYPE: ["hexagon", {COLOR: -1, MIRROR_MASTER_ANGLE: true}]
		},
		{
			POSITION: [10, 0, 0, 0, 0, 360, 1],
			TYPE: ["radiationAura"]
		}
	]
}

Class.thrusterOfficialV1 = {
	PARENT: "genericDreadnought",
	LABEL: "Thruster",
	UPGRADE_TOOLTIP: "Thrusters",
	IS_THRUSTER_DREAD: true,
	GUNS: [
		{
			POSITION: [13, 7, 1, 0, 0, 180, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic, g.flankGuard, g.triAngle, g.thruster, {reload: 0.9}]),
				TYPE: 'bullet',
				LABEL: "Thruster",
				ALT_FIRE: true
			}
		}
	]
}

Class.laserOfficialV1 = {
	PARENT: "genericDreadnought",
	LABEL: "Laser",
	UPGRADE_TOOLTIP: "Laser",
	GUNS: [
        {
            POSITION: [18, 8, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic]),
                TYPE: 'bullet',
                IDENTIFIER: "laser",
                ALPHA: 0
            }
        },
		{
			POSITION: [25, 3, 1, 0, 0, 0, 0]
		},
		{
			POSITION: [10, 2, 0.01, 15, 7.5, 0, 0]
		},
		{
			POSITION: [10, 2, 0.01, 15, -7.5, 0, 0]
		},
		{
			POSITION: [4, 7, -1.2, 9, 0, 0, 0]
		},
		{
			POSITION: [2, 7, 2.5, 13, 0, 0, 0]
		}
	],
	TURRETS: [
		{
			POSITION: [10, 22, 0, 0, 360, 1],
			TYPE: ["genericTank", {COLOR: "#00ffff"}]
		}
	],
	ON: makeLaserON()
}

// T2
Class.sabreOfficialV1 = {
	PARENT: "genericDreadnought",
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
	PARENT: "genericDreadnought",
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
	PARENT: "genericDreadnought",
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
	PARENT: "genericDreadnought",
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
	PARENT: "genericDreadnought",
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
	PARENT: "genericDreadnought",
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
	PARENT: "genericDreadnought",
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
	PARENT: "genericDreadnought",
	LABEL: "Assailant",
	UPGRADE_TOOLTIP: "Minions",
	GUNS: weaponArray([
		{
			POSITION: [14.25, 9, 1, 0, 0, 0, 0],
		}, {
			POSITION: [1.5, 10, 1, 14.25, 0, 0, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.minion, g.overseer, g.dreadv1Drone, {damage: 0.45}]),
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
	PARENT: "genericDreadnought",
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
	PARENT: "genericDreadnought",
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
	PARENT: "genericDreadnought",
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
	PARENT: "genericDreadnought",
	LABEL: "Siren",
	UPGRADE_TOOLTIP: "Auto-Traps",
	GUNS: weaponArray([
		{
			POSITION: [13, 7, 1, 0, 0, 0, 0],
		}, {
			POSITION: [11, 9, 1, 0, 0, 0, 0],
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

Class.javelinOfficialV1 = {
	PARENT: "genericDreadnought",
	LABEL: "Javelin",
	UPGRADE_TOOLTIP: "Longer Lances",
	BODY: {
		SPEED: 0.75 * dreadnoughtBody.SPEED
	},
	GUNS: weaponArray([
		{
			POSITION: [0, 7, 1, 10, 0, 0, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.dreadv1Lance]),
				TYPE: ["bullet", {ALPHA: 0}],
				ALPHA: 0
			},
		},
		{
			POSITION: [15, 8.5, 0.01, 9, 0, 0, 0]
		}
	], 3)
}

Class.axeOfficialV1 = {
	PARENT: "genericDreadnought",
	LABEL: "Axe",
	UPGRADE_TOOLTIP: "Bigger Lances",
	BODY: {
		SPEED: 0.75 * dreadnoughtBody.SPEED
	},
	GUNS: weaponArray([
		{
			POSITION: [0, 7, 1, 10, 0, 0, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.dreadv1Lance]),
				TYPE: ["bullet", {ALPHA: 0}],
				ALPHA: 0
			},
		},
		{
			POSITION: [12.5, 9.5, 0.01, 9, 0, 0, 0]
		}
	], 3)
}

Class.spearOfficialV1 = {
	PARENT: "genericDreadnought",
	LABEL: "Spear",
	UPGRADE_TOOLTIP: "Ranged Lancers",
	BODY: {
		SPEED: 0.8 * dreadnoughtBody.SPEED
	},
	GUNS: weaponArray([
		{
			POSITION: [0, 7, 1, 30, 0, 0, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic, g.dreadv1Lance]),
				TYPE: ["bullet", {ALPHA: 0}],
				ALPHA: 0
			},
		},
		{
			POSITION: [30, 5, 1, 0, 0, 0, 0]
		},
		{
			POSITION: [13, 8, 0.01, 29, 0, 0, 0]
		}
	], 3)
}

Class.mechanismOfficialV1 = {
	PARENT: "genericDreadnought",
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
Class.clockworkOfficialV1 = {
	PARENT: "genericDreadnought",
	LABEL: "Clockwork",
	UPGRADE_TOOLTIP: "Auto Turrets",
	TURRETS: [
		...weaponArray({
			POSITION: [3.5, 8.25, 0, 30, 180, 1],
			TYPE: "dreadv1BodyTurret",
		}, 6),
		...weaponArray({
			POSITION: [6, 4, 0, 0, 270, 1],
			TYPE: ["dreadv1BodyTurret", {GUN_STAT_SCALE: {damage: 1.3}}],
		}, 3),
	]
}
Class.megabyteOfficialV1 = {
	PARENT: "genericDreadnought",
	LABEL: "Megabyte",
	UPGRADE_TOOLTIP: "Mega Auto Turret",
	TURRETS: [
		{
			POSITION: [10, 0, 0, 0, 360, 1],
			TYPE: "megaAutoTurret"
		}
	]
}
Class.behemothOfficialV1 = {
	PARENT: "genericDreadnought",
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
Class.sawbladeOfficialV1 = {
	PARENT: "genericDreadnought",
	LABEL: "Sawblade",
	UPGRADE_TOOLTIP: "Damage Buff",
	BODY: {
		HEALTH: 1.3,
		SHIELD: 2,
		REGEN: 1.3,
		DAMAGE: 3.3,
	},
	TURRETS: weaponArray([{
		POSITION: [2.5, 9, 3, 0, 0, 0],
		TYPE: ["triangle", {COLOR: "black"}]
	}, {
		POSITION: [2.5, 10, -0, 0, 0, 0],
		TYPE: ["triangle", {COLOR: "black"}]
	}, {
		POSITION: [2.5, 9, -3, 0, 0, 0],
		TYPE: ["triangle", {COLOR: "black"}]
	}], 3)
}
Class.speedsterOfficialV1 = {
	PARENT: "genericDreadnought",
	LABEL: "Speedster",
	UPGRADE_TOOLTIP: "Speed Buff",
	BODY: {
		HEALTH: 1.1,
		SHIELD: 1.6,
		REGEN: 1.1,
		SPEED: 5
	},
	TURRETS: [{
		POSITION: [10, 0, 0, 0, 0, 1],
		TYPE: ["hexagon", {COLOR: "black", MIRROR_MASTER_ANGLE: true}]
	}]
}
Class.medicaidOfficialV1 = {
	PARENT: "genericDreadnought",
	LABEL: "Medicaid",
	UPGRADE_TOOLTIP: "Healing",
	TURRETS: [{
		POSITION: [8, 0, 0, 0, 360, 1],
		TYPE: "medicaidTurret",
	}]
}
Class.tricareOfficialV1 = {
	PARENT: "genericDreadnought",
	LABEL: "Tricare",
	UPGRADE_TOOLTIP: "Triple Healing",
	TURRETS: weaponArray({
		POSITION: [6, 10, 0, 0, 360, 1],
		TYPE: "tricareTurret",
	}, 3)
}
Class.megacareOfficialV1 = {
	PARENT: "genericDreadnought",
	LABEL: "Megacare",
	UPGRADE_TOOLTIP: "Big Healing",
	TURRETS: [{
		POSITION: [12, 0, 0, 0, 360, 1],
		TYPE: "megacareTurret",
	}]
}

Class.uraniumOfficialV1 = {
	PARENT: "genericDreadnought",
	LABEL: "Uranium",
	UPGRADE_TOOLTIP: "Bigger Aura",
	TURRETS: [
		{
			POSITION: [15, 0, 0, 0, 0, 360, 1],
			TYPE: ["hexagon", {COLOR: -1, MIRROR_MASTER_ANGLE: true}]
		},
		{
			POSITION: [11, 0, 0, 0, 0, 360, 1],
			TYPE: ["uraniumAura"]
		}
	]
}

Class.divergenceOfficialV1 = {
	PARENT: "genericDreadnought",
	LABEL: "Divergence",
	UPGRADE_TOOLTIP: "Repulsion Aura",
	TURRETS: [
		{
			POSITION: [15, 0, 0, 0, 0, 360, 1],
			TYPE: ["hexagon", {COLOR: -1, MIRROR_MASTER_ANGLE: true}]
		},
		{
			POSITION: [10, 0, 0, 0, 0, 360, 1],
			TYPE: ["divergenceAura"]
		}
	]
}

Class.upheavalOfficialV1 = {
	PARENT: "genericDreadnought",
	LABEL: "Upheaval",
	UPGRADE_TOOLTIP: "Aura Traps",
	TURRETS: [
		{
			POSITION: [15, 0, 0, 0, 0, 360, 1],
			TYPE: ["cube", {COLOR: 0, FACING_TYPE: ["spin", {speed: 0.02}]}]
		},
		{
			POSITION: [10, 0, 0, 0, 0, 360, 1],
			TYPE: ["upheavalAura", {COLOR: -1}]
		}
	]
}

Class.runnerOfficialV1 = {
	PARENT: "genericDreadnought",
	LABEL: "Runner",
	UPGRADE_TOOLTIP: "Thrusters",
	IS_THRUSTER_DREAD: true,
	GUNS: [
		{
			POSITION: [3, 8, 1.2, 9, 0, 180, 0.5],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic, g.flankGuard, g.triAngle, g.thruster, {reload: 0.9, recoil: 0.9}]),
				TYPE: 'bullet',
				LABEL: "Thruster",
				ALT_FIRE: true
			}
		},
		{
			POSITION: [13, 7, 1, 0, 0, 180, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic, g.flankGuard, g.triAngle, g.thruster, {reload: 0.9}]),
				TYPE: 'bullet',
				LABEL: "Thruster",
				ALT_FIRE: true
			}
		}
	]
}

Class.vehicleOfficialV1 = {
	PARENT: "genericDreadnought",
	LABEL: "Vehicle",
	UPGRADE_TOOLTIP: "Bigger Thrusters",
	IS_THRUSTER_DREAD: true,
	GUNS: [
		{
			POSITION: [14, 9, 1, 0, 0, 180, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic, g.flankGuard, g.triAngle, g.thruster, {reload: 1.5, recoil: 2}]),
				TYPE: 'bullet',
				LABEL: "Thruster",
				ALT_FIRE: true
			}
		}
	]
}

Class.blasterOfficialV1 = {
	PARENT: "genericDreadnought",
	LABEL: "Blaster",
	UPGRADE_TOOLTIP: "More Charge Gain",
	GUNS: [
        {
            POSITION: [18, 8, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic]),
                TYPE: 'bullet',
                IDENTIFIER: "laser",
                ALPHA: 0
            }
        },
		{
			POSITION: [25, 3, 1, 0, 0, 0, 0]
		},
		{
			POSITION: [10, 2, 0.01, 15, 7.5, 0, 0]
		},
		{
			POSITION: [10, 2, 0.01, 15, -7.5, 0, 0]
		},
		{
			POSITION: [4, 7, -1.2, 9, 0, 0, 0]
		},
		{
			POSITION: [2, 7, 2.5, 13, 0, 0, 0]
		}
	],
	TURRETS: [
		{
			POSITION: [10, 22, 0, 0, 360, 1],
			TYPE: ["genericTank", {COLOR: "#00ffff"}]
		},
		{
			POSITION: [5, 22, 0, 0, 360, 1],
			TYPE: ["genericTank", {COLOR: "#00ffff"}]
		}
	],
	ON: makeLaserON("(body.skill.raw[0] / 5) + 1")
}

Class.voltageOfficialV1 = {
	PARENT: "genericDreadnought",
	LABEL: "Voltage",
	UPGRADE_TOOLTIP: "More Charge Limit",
	GUNS: [
        {
            POSITION: [18, 8, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic]),
                TYPE: 'bullet',
                IDENTIFIER: "laser",
                ALPHA: 0
            }
        },
		{
			POSITION: [27, 3, 1, 0, 0, 0, 0]
		},
		{
			POSITION: [10, 2, 0.01, 15, 8, 0, 0]
		},
		{
			POSITION: [10, 2, 0.01, 15, -8, 0, 0]
		},
		{
			POSITION: [4, 7, -1.2, 9, 0, 0, 0]
		},
		{
			POSITION: [2, 7, 2.65, 13, 0, 0, 0]
		}
	],
	TURRETS: [
		{
			POSITION: [12, 23, 0, 0, 360, 1],
			TYPE: ["genericTank", {COLOR: "#00ffff"}]
		}
	],
	ON: makeLaserON("(body.skill.raw[0] / 10) + 1", "100 * (1 + (body.skill.raw[2] / 4))")
}

Class.triLaserOfficialV1 = {
	PARENT: "genericDreadnought",
	LABEL: "Tri Laser",
	UPGRADE_TOOLTIP: "3 Lasers",
	GUNS: weaponArray([
        {
            POSITION: [18, 8, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic]),
                TYPE: 'bullet',
                IDENTIFIER: "laser",
                ALPHA: 0
            }
        },
		{
			POSITION: [25, 3, 1, 0, 0, 0, 0]
		},
		{
			POSITION: [10, 2, 0.01, 15, 7.5, 0, 0]
		},
		{
			POSITION: [10, 2, 0.01, 15, -7.5, 0, 0]
		},
		{
			POSITION: [4, 7, -1.2, 9, 0, 0, 0]
		},
		{
			POSITION: [2, 7, 2.5, 13, 0, 0, 0]
		}
	], 3),
	TURRETS: weaponArray(
		{
			POSITION: [10, 22, 0, 0, 360, 1],
			TYPE: ["genericTank", {COLOR: "#00ffff"}]
		}, 3
	),
	ON: makeLaserON()
}

// T3
Class.lanceOfficialV1 = {
	PARENT: "genericDreadnought",
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
	PARENT: "genericDreadnought",
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
	PARENT: "genericDreadnought",
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
	PARENT: "genericDreadnought",
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
	PARENT: "genericDreadnought",
	LABEL: "Duelist",
	UPGRADE_TOOLTIP: "Accelerating Bullets",
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
	PARENT: "genericDreadnought",
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
	PARENT: "genericDreadnought",
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
	PARENT: "genericDreadnought",
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
	PARENT: "genericDreadnought",
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
	PARENT: "genericDreadnought",
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
	PARENT: "genericDreadnought",
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
			POSITION: [8.5, 7.875, 1.2, 9, 0, 0, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.twin, g.dreadv1Generic, g.dreadv1Slow, {health: 1.13, shudder: 1.2, speed: 0.9, maxSpeed: 0.7, range: 0.7, size: 0.6 * 8.5 / 7.5}]),
				TYPE: "bullet"
			}
		}
	], 3)
}
Class.successorOfficialV1 = {
	PARENT: "genericDreadnought",
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
	PARENT: "genericDreadnought",
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
	PARENT: "genericDreadnought",
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
	PARENT: "genericDreadnought",
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
	PARENT: "genericDreadnought",
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
			POSITION: [15.25, 4.75, 1, 0, 1.75, 0, 1/3],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.triplet, g.dreadv1Generic, g.dreadv1Slow, {range: 0.9}]),
				TYPE: "bullet"
			}
		}, {
			POSITION: [15.25, 4.75, 1, 0, -1.75, 0, 1/3],
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
	PARENT: "genericDreadnought",
	LABEL: "Moderator",
	UPGRADE_TOOLTIP: "Nailguns",
	GUNS: weaponArray([
		{
			POSITION: [19, 2, 1, 0, -2.5, 0, 1/3],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.power, g.twin, g.nailgun]),
				TYPE: "bullet",
			},
		},
		{
			POSITION: [19, 2, 1, 0, 2.5, 0, 2/3],
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
	PARENT: "genericDreadnought",
	LABEL: "Personel",
	UPGRADE_TOOLTIP: "Spread Shots",
	GUNS: weaponArray([
		{
			POSITION: [16, 4, 1, 0, -1.75, -10, 3 / 6],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.artillery, g.twin, g.spreadshot]),
				TYPE: "bullet",
				LABEL: "Spread"
			}
		},
		{
			POSITION: [16, 4, 1, 0, 1.75, 10, 3 / 6],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.artillery, g.twin, g.spreadshot]),
				TYPE: "bullet",
				LABEL: "Spread"
			}
		},
		{
			POSITION: [17.5, 4, 1, 0, -1.5, -7, 2 / 6],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.artillery, g.twin, g.spreadshot]),
				TYPE: "bullet",
				LABEL: "Spread"
			}
		},
		{
			POSITION: [17.5, 4, 1, 0, 1.5, 7, 2 / 6],
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
			POSITION: [12, 6, 1, 8, 0, 0, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.artillery, g.twin, g.spreadshot]),
				TYPE: "bullet"
			}
		}
	], 3)
}

Class.proberOfficialV1 = {
	PARENT: "genericDreadnought",
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
	PARENT: "genericDreadnought",
	LABEL: "Dictator",
	UPGRADE_TOOLTIP: "Overdriven Drones",
	GUNS: weaponArray({
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
	}, 3),
	TURRETS: weaponArray({
		POSITION: [3, 10, 0, 0, 360, 1],
		TYPE: ["square", {COLOR: 16, INDEPENDENT: true}],
	}, 3)
}
Class.fatassOfficialV1 = {
	PARENT: "genericDreadnought",
	LABEL: "FATASS",
	UPGRADE_TOOLTIP: "Big Cheese Drones",
	GUNS: weaponArray({
		POSITION: [16, 6.5, 2.15, 0, 0, 0, 0],
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
	PARENT: "genericDreadnought",
	LABEL: "Attacker",
	UPGRADE_TOOLTIP: "Twin Minions",
	GUNS: weaponArray([
		{
			POSITION: [14.25, 9, 1, 0, 0, 0, 0],
		}, {
			POSITION: [1.5, 10, 1, 14.25, 0, 0, 0],
			PROPERTIES: {
				MAX_CHILDREN: 2,
				SHOOT_SETTINGS: combineStats([g.minion, g.overseer, g.dreadv1Drone, {damage: 0.6}]),
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
	PARENT: "genericDreadnought",
	LABEL: "Defender",
	UPGRADE_TOOLTIP: "Machine Minions",
	GUNS: weaponArray([
		{
			POSITION: [14.25, 9, 1, 0, 0, 0, 0],
		}, {
			POSITION: [1.5, 10, 1, 14.25, 0, 0, 0],
			PROPERTIES: {
				MAX_CHILDREN: 2,
				SHOOT_SETTINGS: combineStats([g.minion, g.overseer, g.dreadv1Drone, {damage: 0.6}]),
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
	PARENT: "genericDreadnought",
	LABEL: "Coallesce",
	UPGRADE_TOOLTIP: "Thruster Minions",
	GUNS: weaponArray([
		{
			POSITION: [14.25, 9, 1, 0, 0, 0, 0],
		}, {
			POSITION: [1.5, 10, 1, 14.25, 0, 0, 0],
			PROPERTIES: {
				MAX_CHILDREN: 2,
				SHOOT_SETTINGS: combineStats([g.minion, g.overseer, g.dreadv1Drone, {damage: 0.6}]),
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
Class.thiefOfficialV1 = {
	PARENT: "genericDreadnought",
	LABEL: "Thief",
	UPGRADE_TOOLTIP: "Swarms",
	GUNS: weaponArray([
		{
			POSITION: [7, 6, 0.6, 5, 3, 0, 2/3],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.swarm, g.carrier, { reload: 2, speed: 0.5, range: 0.9, health: 0.85}]),
				TYPE: "swarm",
				STAT_CALCULATOR: "swarm"
			}
		}, {
			POSITION: [7, 6, 0.6, 5, -3, 0, 2/3],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.swarm, g.carrier, { reload: 2, speed: 0.5, range: 0.9, health: 0.85}]),
				TYPE: "swarm",
				STAT_CALCULATOR: "swarm"
			}
		}, {
			POSITION: [7, 6, 0.6, 7, 1.75, 0, 1/3],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.swarm, g.carrier, { reload: 2, speed: 0.5, range: 0.9, health: 0.85}]),
				TYPE: "swarm",
				STAT_CALCULATOR: "swarm"
			}
		}, {
			POSITION: [7, 6, 0.6, 7, -1.75, 0, 1/3],
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
	PARENT: "genericDreadnought",
	LABEL: "Bandit",
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
	PARENT: "genericDreadnought",
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
	PARENT: "genericDreadnought",
	LABEL: "Ogre",
	UPGRADE_TOOLTIP: "Spammier Traps",
	GUNS: weaponArray([{
			POSITION: [13, 2.25, 1, 0, -3.5, 0, 0]
		}, {
			POSITION: [1.75, 2.25, 1.7, 13, -3.5, 0, 3/5],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.trap, g.dreadv1Generic, g.dreadv1Slow, g.dreadv1Trap, { reload: 1.22, health: 0.67, damage: 0.7 }]),
				TYPE: ["trap", {HITS_OWN_TYPE: "never"} ],
				STAT_CALCULATOR: "trap",
			},
		}, {
			POSITION: [13, 2.25, 1, 0, 3.5, 0, 0]
		}, {
			POSITION: [1.75, 2.25, 1.7, 13, 3.5, 0, 4/5],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.trap, g.dreadv1Generic, g.dreadv1Slow, g.dreadv1Trap, { reload: 1.22, health: 0.67, damage: 0.7 }]),
				TYPE: ["trap", {HITS_OWN_TYPE: "never"} ],
				STAT_CALCULATOR: "trap",
			},
		}, {
			POSITION: [14, 2.25, 1, 0, 2.5, 0, 0]
		}, {
			POSITION: [1.75, 2.25, 1.7, 14, 2.5, 0, 2/5],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.trap, g.dreadv1Generic, g.dreadv1Slow, g.dreadv1Trap, { reload: 1.22, health: 0.67, damage: 0.7 }]),
				TYPE: ["trap", {HITS_OWN_TYPE: "never"} ],
				STAT_CALCULATOR: "trap",
			},
		}, {
			POSITION: [14, 2.25, 1, 0, -2.5, 0, 0]
		}, {
			POSITION: [1.75, 2.25, 1.7, 14, -2.5, 0, 1/5],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.trap, g.dreadv1Generic, g.dreadv1Slow, g.dreadv1Trap, { reload: 1.22, health: 0.67, damage: 0.7 }]),
				TYPE: ["trap", {HITS_OWN_TYPE: "never"} ],
				STAT_CALCULATOR: "trap"
			}
		}, {
			POSITION: [15, 3, 1, 0, 0, 0, 0]
		}, {
			POSITION: [2, 3, 1.7, 15, 0, 0, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.trap, g.dreadv1Generic, g.dreadv1Slow, g.dreadv1Trap, { reload: 1.22, health: 0.67, damage: 0.7 }]),
				TYPE: ["trap", {HITS_OWN_TYPE: "never"} ],
				STAT_CALCULATOR: "trap"
			}
		}
	], 3)
}
Class.hadesOfficialV1 = {
	PARENT: "genericDreadnought",
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
	PARENT: "genericDreadnought",
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
	PARENT: "genericDreadnought",
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
	PARENT: "genericDreadnought",
	LABEL: "Cyclops",
	UPGRADE_TOOLTIP: "Set Blocks",
	GUNS: weaponArray([
		{
			POSITION: [13, 9.5, 1, 0, 0, 0, 0],
		}, {
			POSITION: [2, 9.5, 1.3, 13, 0, 0, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.trap, g.setTrap, g.dreadv1Generic, g.dreadv1Slow, g.dreadv1Trap, { reload: 1.55, range: 0.93, health: 1.55 }]),
				TYPE: ["setTrap", {HITS_OWN_TYPE: "never"} ],
				STAT_CALCULATOR: "block"
			}
		}
	], 3)
}
Class.mermaidOfficialV1 = {
	PARENT: "genericDreadnought",
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
				SHOOT_SETTINGS: combineStats([g.trap, g.setTrap, g.boomerang, {reload: 2.5}]),
				TYPE: "boomerang",
				STAT_CALCULATOR: "block"
			},
		},
	], 3)
}

Class.policerOfficialV1 = {
	PARENT: "genericDreadnought",
	LABEL: "Policer",
	UPGRADE_TOOLTIP: "Auto-Blocks",
	GUNS: weaponArray([
		{
			POSITION: [13, 9, 1, 0, 0, 0, 0],
		}, {
			POSITION: [11, 11, 1, 0, 0, 0, 0],
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
	PARENT: "genericDreadnought",
	LABEL: "Alarm",
	UPGRADE_TOOLTIP: "Twin Auto-Traps",
	GUNS: weaponArray([
		{
			POSITION: [13, 7, 1, 0, 0, 0, 0],
		}, {
			POSITION: [11, 9, 1, 0, 0, 0, 0],
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
	PARENT: "genericDreadnought",
	LABEL: "Clock",
	UPGRADE_TOOLTIP: "Swarm Traps",
	GUNS: weaponArray([
		{
			POSITION: [13, 7, 1, 0, 0, 0, 0],
		}, {
			POSITION: [11, 9, 1, 0, 0, 0, 0],
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

Class.harpoonOfficialV1 = {
	PARENT: "genericDreadnought",
	LABEL: "Harpoon",
	UPGRADE_TOOLTIP: "Longer Lances",
	BODY: {
		SPEED: 0.7 * dreadnoughtBody.SPEED
	},
	GUNS: weaponArray([
		{
			POSITION: [0, 7, 1, 10, 0, 0, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.assassin, g.dreadv1Lance]),
				TYPE: ["bullet", {ALPHA: 0}],
				ALPHA: 0
			},
		},
		{
			POSITION: [17, 8.75, 0.01, 9, 0, 0, 0]
		}
	], 3)
}

Class.scytheOfficialV1 = {
	PARENT: "genericDreadnought",
	LABEL: "Scythe",
	UPGRADE_TOOLTIP: "Spiky Lances",
	BODY: {
		SPEED: 0.7 * dreadnoughtBody.SPEED
	},
	GUNS: weaponArray([
		{
			POSITION: [0, 7, 1, 10, 0, 0, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic, g.dreadv1Lance, {damage: 1.2}]),
				TYPE: ["bullet", {ALPHA: 0}],
				ALPHA: 0
			},
		},
		{
			POSITION: [4, 3, 0.01, 0, 20, -90, 0]
		},
		{
			POSITION: [5, 4, 0.01, 0, 16, -90, 0]
		},
		{
			POSITION: [6, 5, 0.01, 0, 12, -90, 0]
		},
		{
			POSITION: [4, 3, 0.01, 0, -20, 90, 0]
		},
		{
			POSITION: [5, 4, 0.01, 0, -16, 90, 0]
		},
		{
			POSITION: [6, 5, 0.01, 0, -12, 90, 0]
		},
		{
			POSITION: [15, 8.5, 0.01, 9, 0, 0, 0]
		}
	], 3)
}

Class.robotOfficialV1 = {
	PARENT: "genericDreadnought",
	LABEL: "Robot",
	UPGRADE_TOOLTIP: "Auto Turrets",
	TURRETS: [
		...weaponArray({
			POSITION: [4.5, 8.25, 0, 30, 180, 1],
			TYPE: ["dreadv1BodyTurret", {GUN_STAT_SCALE: {damage: 1.24}}],
		}, 6),
		{
			POSITION: [10, 0, 0, 0, 360, 1],
			TYPE: ["dreadv1BodyTurret", {GUN_STAT_SCALE: {damage: 2}}],
		}
	]
}
Class.structureOfficialV1 = {
	PARENT: "genericDreadnought",
	LABEL: "Structure",
	UPGRADE_TOOLTIP: "Auto Turrets",
	TURRETS: weaponArray([
		{
			POSITION: [3.5, 8.25, 0, 30, 180, 1],
			TYPE: "dreadv1BodyTurret",
		},
		{
			POSITION: [3.5, 4.25, 0, 0, 180, 1],
			TYPE: "dreadv1BodyTurret",
		}
	], 6)
}
Class.doohickeyTurret = makeTurret({
	GUNS: weaponArray(
		{
			POSITION: {
				LENGTH: 17,
				WIDTH: 4.5
			},
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.gunner]),
				TYPE: 'bullet',
				AUTOFIRE: true
			}
		}, 9, {delayIncrement: 1/3}
	)
}, {independent: true})
Class.doohickeyTurret.FACING_TYPE = "spin"
Class.dobleydooTurret = makeTurret({
	GUNS: weaponArray(
		{
			POSITION: {
				LENGTH: 15,
				WIDTH: 4
			},
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.gunner, g.cyclone]),
				TYPE: 'bullet',
				AUTOFIRE: true
			}
		}, 12, {delayIncrement: 1/3}
	)
}, {independent: true})
Class.dobleydooTurret.FACING_TYPE = "spin"
Class.doohickeyOfficialV1 = {
	PARENT: "genericDreadnought",
	LABEL: "Doohickey",
	UPGRADE_TOOLTIP: "Auto Turrets",
	TURRETS: [
		...weaponArray([
			{
				POSITION: [3.5, 8, 0, 0, 180, 1],
				TYPE: "dreadv1BodyTurret",
			}
		], 3),
		{
			POSITION: [8, 0, 0, 0, 360, 1],
			TYPE: "doohickeyTurret",
		}
	]
}
Class.gunnerTurret = makeTurret("gunner", {independent: true})
Class.nailgunTurret = makeTurret("nailgun", {independent: true})
Class.thingamajigOfficialV1 = {
	PARENT: "genericDreadnought",
	LABEL: "Thingamajig",
	UPGRADE_TOOLTIP: "Gunner Turrets",
	TURRETS: weaponArray({
		POSITION: [6, 5, 0, 0, 360, 1],
		TYPE: "gunnerTurret",
	}, 3)
}
Class.boatTurret = {
    PARENT: "genericTank",
	INDEPENDENT: true,
	SHAPE: 4,
	CONTROLLERS: [["nearestDifferentMaster"]],
	GUNS: [
		{
			POSITION: [0, 20, 1, 0, 0, 0, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.swarm]),
				TYPE: "swarm",
				STAT_CALCULATOR: "swarm",
				ALPHA: 0
			}
		}
	]
}
Class.boatOfficialV1 = {
	PARENT: "genericDreadnought",
	LABEL: "Boat",
	UPGRADE_TOOLTIP: "Swarm Turrets",
	TURRETS: [
		...weaponArray({
			POSITION: [4, 10, 0, 0, 180, 1],
			TYPE: ["boatTurret", {GUN_STAT_SCALE: {damage: 1.12}}],
		}, 6),
		{
			POSITION: [9.5, 0, 0, 0, 360, 1],
			TYPE: ["dreadv1BodyTurret", {GUN_STAT_SCALE: {damage: 1.8}}],
		}
	]
}
Class.trapTurret = makeTurret("trapper", {independent: true})
Class.megaTrapTurret = makeTurret({
	GUNS: [
		{
			POSITION: {
				LENGTH: 14,
				WIDTH: 12
			}
		},
		{
			POSITION: {
				LENGTH: 5,
				WIDTH: 12,
				ASPECT: 1.7,
				X: 13
			},
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.trap, g.pounder]),
				TYPE: "trap",
				STAT_CALCULATOR: "trap"
			}
		}
	]
}, {independent: true})
Class.apparatusOfficialV1 = {
	PARENT: "genericDreadnought",
	LABEL: "Apparatus",
	UPGRADE_TOOLTIP: "Trap Turrets",
	TURRETS: [
		...weaponArray({
			POSITION: [4, 8.25, 0, 30, 180, 1],
			TYPE: ["trapTurret", {GUN_STAT_SCALE: {damage: 1.12}}],
		}, 6),
		{
			POSITION: [9.5, 0, 0, 0, 360, 1],
			TYPE: ["dreadv1BodyTurret", {GUN_STAT_SCALE: {damage: 1.8}}],
		}
	]
}
Class.gigabyteOfficialV1 = {
	PARENT: "genericDreadnought",
	LABEL: "Gigabyte",
	UPGRADE_TOOLTIP: "Ultra Auto Turret",
	TURRETS: [
		{
			POSITION: [12, 0, 0, 0, 360, 1],
			TYPE: "ultraAutoTurret"
		}
	]
}
Class.launcherTurret = makeTurret("launcher", {independent: true})
Class.swarmerTurret = makeTurret("swarmer", {independent: true})
Class.mebibyteOfficialV1 = {
	PARENT: "genericDreadnought",
	LABEL: "Mebibyte",
	UPGRADE_TOOLTIP: "Launcher Turret",
	TURRETS: [
		{
			POSITION: [10, 0, 0, 0, 360, 1],
			TYPE: "launcherTurret"
		}
	]
}
Class.shotgunTurret = makeTurret("shotgun", {independent: true})
Class.culverinTurret = makeTurret({
	GUNS: [
		...weaponMirror([{
			POSITION: {
				LENGTH: 4,
				WIDTH: 3,
				X: 11,
				Y: 3
			},
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.shotgun, g.sniper]),
				TYPE: 'bullet'
			}
		},
		{
			POSITION: {
				LENGTH: 1,
				WIDTH: 4,
				X: 12,
				Y: 1
			},
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.shotgun, g.sniper]),
				TYPE: 'casing'
			}
		},
		{
			POSITION: {
				LENGTH: 1,
				WIDTH: 3,
				X: 13,
				Y: 1
			},
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.shotgun, g.sniper]),
				TYPE: 'bullet'
			}
		},
		{
			POSITION: {
				LENGTH: 1,
				WIDTH: 2,
				X: 13,
				Y: 2
			},
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.shotgun, g.sniper]),
				TYPE: 'casing'
			}
		}]),
		{
			POSITION: {
				LENGTH: 4,
				WIDTH: 4,
				X: 13
			},
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.shotgun, g.sniper]),
				TYPE: 'casing'
			}
		},
		{
			POSITION: {
				LENGTH: 17,
				WIDTH: 14,
				X: 6
			},
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.shotgun, g.sniper, g.fake]),
				TYPE: 'casing'
			}
		},
		{
			POSITION: {
				LENGTH: 8,
				WIDTH: 14,
				ASPECT: -1.3,
				X: 4
			}
		}
	]
}, {independent: true})
Class.binaryOfficialV1 = {
	PARENT: "genericDreadnought",
	LABEL: "Binary",
	UPGRADE_TOOLTIP: "Shotgun Turret",
	TURRETS: [
		{
			POSITION: [10, 0, 0, 0, 360, 1],
			TYPE: "shotgunTurret"
		}
	]
}
Class.titanOfficialV1 = {
	PARENT: "genericDreadnought",
	LABEL: "Titan",
	UPGRADE_TOOLTIP: "Health Buff",
	BODY: {
		HEALTH: 3.3,
		SHIELD: 2.8,
		REGEN: 1.7,
		SPEED: 1.2,
	},
	TURRETS: [{
		POSITION: [25.5, 0, 0, 0, 0, 0],
		TYPE: ["hexagon", {COLOR: "black"}]
	}]
}
Class.beefyOfficialV1 = {
	PARENT: "genericDreadnought",
	LABEL: "Beefy",
	UPGRADE_TOOLTIP: "Size increase",
	BODY: {
		HEALTH: 2.3,
		SHIELD: 2.8,
		REGEN: 1.7,
		SPEED: 1.15,
	},
	SIZE: 27.5,
	TURRETS: [{
		POSITION: [23.5, 0, 0, 0, 0, 0],
		TYPE: ["hexagon", {COLOR: "black"}]
	}, {
		POSITION: [12, 0, 0, 0, 0, 1],
		TYPE: ["hexagon", {COLOR: -1, MIRROR_MASTER_ANGLE: true}]
	}]
}
Class.beastOfficialV1 = {
	PARENT: "genericDreadnought",
	LABEL: "Beast",
	UPGRADE_TOOLTIP: "Increased Bullet Health",
	BODY: {
		HEALTH: 2.3,
		SHIELD: 2.8,
		REGEN: 1.7,
		SPEED: 1.15,
	},
	TURRETS: [{
		POSITION: [23.5, 0, 0, 0, 0, 0],
		TYPE: ["hexagon", {COLOR: "black"}]
	}, {
		POSITION: [23.5, 0, 0, 30, 0, 0],
		TYPE: ["hexagon", {COLOR: "black"}]
	}]
}
Class.chainsawOfficialV1 = {
	PARENT: "genericDreadnought",
	LABEL: "Chainsaw",
	UPGRADE_TOOLTIP: "Damage Buff",
	BODY: {
		HEALTH: 1.3,
		SHIELD: 2,
		REGEN: 1.3,
		DAMAGE: 4.6,
	},
	TURRETS: weaponArray([{
		POSITION: [2.5, 9, 4, 0, 0, 0],
		TYPE: ["triangle", {COLOR: "black"}]
	}, {
		POSITION: [2.5, 10, 4/3, 0, 0, 0],
		TYPE: ["triangle", {COLOR: "black"}]
	}, {
		POSITION: [2.5, 10, -4/3, 0, 0, 0],
		TYPE: ["triangle", {COLOR: "black"}]
	}, {
		POSITION: [2.5, 9, -4, 0, 0, 0],
		TYPE: ["triangle", {COLOR: "black"}]
	}], 3)
}
Class.buzzsawOfficialV1 = {
	PARENT: "genericDreadnought",
	LABEL: "Buzzsaw",
	UPGRADE_TOOLTIP: "Penetration Buff",
	BODY: {
		HEALTH: 1.3,
		SHIELD: 2,
		REGEN: 1.3,
		DAMAGE: 3.3,
		PENETRATION: 1.5,
	},
	TURRETS: weaponArray([{
		POSITION: [2.5, 9, 3, 0, 0, 0],
		TYPE: ["triangle", {COLOR: "white"}]
	}, {
		POSITION: [2.5, 10, -0, 0, 0, 0],
		TYPE: ["triangle", {COLOR: "white"}]
	}, {
		POSITION: [2.5, 9, -3, 0, 0, 0],
		TYPE: ["triangle", {COLOR: "white"}]
	}], 3)
}
Class.switchbladeTurret = {
    TURRETS: weaponArray([{
        TYPE: ['triangleHat_spin', {COLOR: 'black'}],
        POSITION: {SIZE: 18}
    }], 4)
}
Class.switchbladeOfficialV1 = {
	PARENT: "genericDreadnought",
	LABEL: "Switchblade",
	UPGRADE_TOOLTIP: "Increased Bullet Damage",
	BODY: {
		HEALTH: 1.3,
		SHIELD: 2,
		REGEN: 1.3,
		DAMAGE: 3.3
	},
	TURRETS: weaponArray([{
		POSITION: [5, 8, 0, 30, 0, 0],
		TYPE: "switchbladeTurret"
	}, {
		POSITION: [5, 7, 0, 0, 0, 0],
		TYPE: "switchbladeTurret"
	}], 6)
}
Class.cogwheelDeco = makeHat("M 0.6364 -1.3435 L 1.4142 -1.9799 L 1.9092 -1.4849 L 1.2728 -0.7071 Z M -0.6364 1.3435 L -1.4142 1.9799 L -1.9092 1.4849 L -1.2728 0.7071 Z M -1.3435 -0.6364 L -1.9799 -1.4142 L -1.4849 -1.9092 L -0.7071 -1.2728 Z M 1.3435 0.6364 L 1.9799 1.4142 L 1.4849 1.9092 L 0.7071 1.2728 Z M -0.5 -1.4 L -0.4 -2.4 L 0.3 -2.4 L 0.4 -1.4 Z M 0.5 1.4 L 0.4 2.4 L -0.3 2.4 L -0.4 1.4 Z M -1.4 0.5 L -2.4 0.4 L -2.4 -0.3 L -1.4 -0.4 Z M 1.4 -0.5 L 2.4 -0.4 L 2.4 0.3 L 1.4 0.4 Z M 1.6 0 A 1 1 0 0 1 -1.6 0 A 1 1 0 0 1 1.6 0 M 1 0 A 1 1 0 0 0 -1 0 A 1 1 0 0 0 1 0")
Class.cogwheelDeco.FACING_TYPE = "spin"
Class.cogwheelDeco2 = makeHat("M 0.267 -1.4624 L 0.5036 -1.6722 L 1.1098 -1.3222 L 1.0464 -1.0124 Z M -1.133 -0.9624 L -1.1964 -1.2722 L -0.5902 -1.6222 L -0.3536 -1.4124 Z M -1.4 0.5 L -1.7 0.4 L -1.7 -0.3 L -1.4 -0.4 Z M -0.267 1.4624 L -0.5036 1.6722 L -1.1098 1.3222 L -1.0464 1.0124 Z M 1.133 0.9624 L 1.1964 1.2722 L 0.5902 1.6222 L 0.3536 1.4124 Z M 1.4 -0.5 L 1.7 -0.4 L 1.7 0.3 L 1.4 0.4 Z M 1.6 0 A 1 1 0 0 1 -1.6 0 A 1 1 0 0 1 1.6 0 M 1 0 A 1 1 0 0 0 -1 0 A 1 1 0 0 0 1 0")
Class.cogwheelDeco2.FACING_TYPE = ["spin", {speed: -0.05}]
Class.cogwheelOfficialV1 = {
	PARENT: "genericDreadnought",
	LABEL: "Cogwheel",
	UPGRADE_TOOLTIP: "Increased Bullet Speed",
	BODY: {
		HEALTH: 1.3,
		SHIELD: 2,
		REGEN: 1.3,
		DAMAGE: 4.6,
	},
	TURRETS: [{
		POSITION: [6.5, 0, 0, 0, 0, 1],
		TYPE: ["cogwheelDeco", {COLOR: "black"}]
	}]
}
Class.lightningOfficialV1 = {
	PARENT: "genericDreadnought",
	LABEL: "Lightning",
	UPGRADE_TOOLTIP: "Speed Buff",
	BODY: {
		HEALTH: 1.1,
		SHIELD: 1.6,
		REGEN: 1.1,
		SPEED: 7
	},
	TURRETS: [{
		POSITION: [(20/3) * 2, 0, 0, 0, 0, 1],
		TYPE: ["hexagon", {COLOR: "black", MIRROR_MASTER_ANGLE: true}]
	}, {
		POSITION: [20/3, 0, 0, 0, 0, 1],
		TYPE: ["hexagon", {COLOR: -1, MIRROR_MASTER_ANGLE: true}]
	}]
}
Class.carOfficialV1 = {
	PARENT: "genericDreadnought",
	LABEL: "Car",
	UPGRADE_TOOLTIP: "Lower Acceleration",
	BODY: {
		HEALTH: 1.1,
		SHIELD: 1.6,
		REGEN: 1.1,
		SPEED: 5,
		ACCELERATION: 0.05 //base.ACCEL
	},
	TURRETS: [{
		POSITION: [5, 0, 0, 0, 0, 1],
		TYPE: ["triangle", {COLOR: "black", MIRROR_MASTER_ANGLE: true}]
	}]
}
Class.refugeOfficialV1 = {
	PARENT: "genericDreadnought",
	LABEL: "Refuge",
	UPGRADE_TOOLTIP: "Healing",
	TURRETS: [{
		POSITION: [8, 0, 0, 0, 360, 1],
		TYPE: "refugeTurret",
	}]
}
Class.menderOfficialV1 = {
	PARENT: "genericDreadnought",
	LABEL: "Mender",
	UPGRADE_TOOLTIP: "Healing",
	TURRETS: [{
		POSITION: [10, 0, 0, 0, 360, 1],
		TYPE: "menderTurret",
	}]
}
Class.reanimatorOfficialV1 = {
	PARENT: "genericDreadnought",
	LABEL: "Reanimator",
	UPGRADE_TOOLTIP: "Healing",
	TURRETS: [{
		POSITION: [10, 0, 0, 0, 360, 1],
		TYPE: "reanimatorTurret",
	}]
}
Class.hexacareOfficialV1 = {
	PARENT: "genericDreadnought",
	LABEL: "Hexacare",
	UPGRADE_TOOLTIP: "Hextuple Healing",
	TURRETS: weaponArray({
		POSITION: [5, 10, 0, 0, 360, 1],
		TYPE: "tricareTurret",
	}, 6)
}
Class.healerDrone = {
    PARENT: "drone",
    BODY: {
        PENETRATION: Class.bullet.BODY.PENETRATION,
        SPEED: Class.bullet.BODY.SPEED,
        RANGE: Class.bullet.BODY.RANGE,
        DENSITY: Class.bullet.BODY.DENSITY,
        HEALTH: Class.bullet.BODY.HEALTH,
        DAMAGE: Class.bullet.BODY.DAMAGE + 20,
        PUSHABILITY: Class.bullet.BODY.PENETRATION,
    },
    HEALER: true,
	TURRETS: [{
		POSITION: [15, 0, 0, 0, 360, 1],
		TYPE: "healerHat",
	}]
}
Class.drocareOfficialV1 = {
	PARENT: "genericDreadnought",
	LABEL: "Drocare",
	UPGRADE_TOOLTIP: "Drone Healing",
	GUNS: weaponArray([{
		POSITION: [5.5, 7.5, 1.3, 7.5, 0, 0, 0],
		PROPERTIES: {
			SHOOT_SETTINGS: combineStats([g.drone, g.overseer, g.dreadv1Drone, g.healer]),
			TYPE: "healerDrone",
			AUTOFIRE: true,
			SYNCS_SKILLS: true,
			STAT_CALCULATOR: "drone",
			WAIT_TO_CYCLE: true,
			MAX_CHILDREN: 4,
		}
	}], 3),
	TURRETS: weaponArray({
		POSITION: [3, 10, 0, 0, 360, 1],
		TYPE: "healerHat",
	}, 3)
}
Class.trapcareOfficialV1 = {
	PARENT: "genericDreadnought",
	LABEL: "Trapcare",
	UPGRADE_TOOLTIP: "Trap Healing",
	TURRETS: weaponArray({
		POSITION: [6, 10, 0, 0, 360, 1],
		TYPE: "trapcareTurret",
	}, 3)
}
Class.ultracareOfficialV1 = {
	PARENT: "genericDreadnought",
	LABEL: "Ultracare",
	UPGRADE_TOOLTIP: "Bigger Healing",
	TURRETS: [{
		POSITION: [14, 0, 0, 0, 360, 1],
		TYPE: "ultracareTurret",
	}]
}
Class.hospitalOfficialV1 = {
	PARENT: "genericDreadnought",
	LABEL: "Hospital",
	UPGRADE_TOOLTIP: "Launcher Healing",
	TURRETS: [{
		POSITION: [12, 0, 0, 0, 360, 1],
		TYPE: "hospitalTurret",
	}]
}

Class.pharmacyOfficialV1 = {
	PARENT: "genericDreadnought",
	LABEL: "Pharmacy",
	UPGRADE_TOOLTIP: "Shotgun Healing",
	TURRETS: [{
		POSITION: [14, 0, 0, 0, 360, 1],
		TYPE: "pharmacyTurret",
	}]
}

Class.thoriumOfficialV1 = {
	PARENT: "genericDreadnought",
	LABEL: "Thorium",
	UPGRADE_TOOLTIP: "Bigger Aura",
	TURRETS: [
		{
			POSITION: [15, 0, 0, 0, 0, 360, 1],
			TYPE: ["hexagon", {COLOR: -1, MIRROR_MASTER_ANGLE: true}]
		},
		{
			POSITION: [12, 0, 0, 0, 0, 360, 1],
			TYPE: ["thoriumAura"]
		}
	]
}

Class.chernobylOfficialV1 = {
	PARENT: "genericDreadnought",
	LABEL: "Chernobyl",
	UPGRADE_TOOLTIP: "3 Auras",
	TURRETS: [
		{
			POSITION: [15, 0, 0, 0, 0, 360, 1],
			TYPE: ["hexagon", {COLOR: -1, MIRROR_MASTER_ANGLE: true}]
		},
		{
			POSITION: [10, 0, 0, 0, 0, 360, 1],
			TYPE: ["chernobylTurret", {COLOR: 0}]
		}
	]
}

Class.emmissionOfficialV1 = {
	PARENT: "genericDreadnought",
	LABEL: "Emmission",
	UPGRADE_TOOLTIP: "Damaging Aura",
	TURRETS: [
		{
			POSITION: [15, 0, 0, 0, 0, 360, 1],
			TYPE: ["hexagon", {COLOR: -1, MIRROR_MASTER_ANGLE: true}]
		},
		{
			POSITION: [11, 0, 0, 0, 0, 360, 1],
			TYPE: ["emmissionAura"]
		}
	]
}
Class.discrepancyOfficialV1 = {
	PARENT: "genericDreadnought",
	LABEL: "Discrepancy",
	UPGRADE_TOOLTIP: "Repulsion Aura",
	TURRETS: [
		{
			POSITION: [15, 0, 0, 0, 0, 360, 1],
			TYPE: ["hexagon", {COLOR: -1, MIRROR_MASTER_ANGLE: true}]
		},
		{
			POSITION: [10, 0, 0, 0, 0, 360, 1],
			TYPE: ["discrepancyAura"]
		}
	]
}
Class.conformityOfficialV1 = {
	PARENT: "genericDreadnought",
	LABEL: "Conformity",
	UPGRADE_TOOLTIP: "Attraction Aura",
	TURRETS: [
		{
			POSITION: [15, 0, 0, 0, 0, 360, 1],
			TYPE: ["hexagon", {COLOR: -1, MIRROR_MASTER_ANGLE: true}]
		},
		{
			POSITION: [10, 0, 0, 0, 0, 360, 1],
			TYPE: ["conformityAura"]
		}
	]
}
Class.magnetOfficialV1 = {
	PARENT: "genericDreadnought",
	LABEL: "Magnet",
	UPGRADE_TOOLTIP: "Attraction/Repulsion Aura",
	TURRETS: [
		{
			POSITION: [15, 0, 0, 0, 0, 360, 1],
			TYPE: ["hexagon", {COLOR: -1, MIRROR_MASTER_ANGLE: true}]
		},
		{
			POSITION: [10, 0, 0, 0, 0, 360, 1],
			TYPE: ["magnetTurret"]
		}
	]
}

Class.dispositionOfficialV1 = {
	PARENT: "genericDreadnought",
	LABEL: "Disposition",
	UPGRADE_TOOLTIP: "Aura Traps",
	TURRETS: [
		{
			POSITION: [15, 0, 0, 0, 0, 360, 1],
			TYPE: ["tetrahedron", {COLOR: 0, FACING_TYPE: ["spin", {speed: 0.02}]}]
		},
		{
			POSITION: [10, 0, 0, 0, 0, 360, 1],
			TYPE: ["dispositionAura", {COLOR: -1}]
		}
	]
}

Class.cataclysmOfficialV1 = {
	PARENT: "genericDreadnought",
	LABEL: "Cataclysm",
	UPGRADE_TOOLTIP: "Repulsion Aura Traps",
	TURRETS: [
		{
			POSITION: [15, 0, 0, 0, 0, 360, 1],
			TYPE: ["cube", {COLOR: "yellow", FACING_TYPE: ["spin", {speed: 0.02}]}]
		},
		{
			POSITION: [10, 0, 0, 0, 0, 360, 1],
			TYPE: ["cataclysmBase", {COLOR: -1}]
		}
	]
}

Class.disruptionProp = {
	PARENT: "genericTank",
	COLOR: "teal",
	GLOW: {RADIUS: 2.5, STRENTGTH: 25, COLOR: -1, RECURSION: 2.5, ALPHA: 1}
}

Class.disruptionOfficialV1 = {
	PARENT: "genericDreadnought",
	LABEL: "Disruption",
	UPGRADE_TOOLTIP: "Aura Bullets",
	TURRETS: [
		{
			POSITION: [15, 0, 0, 0, 0, 360, 1],
			TYPE: ["hexagon", {COLOR: -1, MIRROR_MASTER_ANGLE: true}]
		},
		{
			POSITION: [5, 0, 0, 0, 0, 360, 1],
			TYPE: ["disruptionProp"]
		},
		{
			POSITION: [12.5, 0, 0, 0, 0, 360, 1],
			TYPE: ["dodecahedron", {COLOR: -1, FACING_TYPE: ["spin", {speed: 0.02}]}]
		},
		{
			POSITION: [10, 0, 0, 0, 0, 360, 1],
			TYPE: ["dodecahedron", {COLOR: "teal", FACING_TYPE: ["spin", {speed: 0.02}]}]
		}
	]
}

Class.gammaRayOfficialV1 = {
	PARENT: "genericDreadnought",
	LABEL: "Gamma Ray",
	UPGRADE_TOOLTIP: "More Charge Gain",
	GUNS: [
        {
            POSITION: [18, 8, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic]),
                TYPE: 'bullet',
                IDENTIFIER: "laser",
                ALPHA: 0
            }
        },
		{
			POSITION: [25, 3, 1, 0, 0, 0, 0]
		},
		{
			POSITION: [10, 2, 0.01, 15, 7.5, 0, 0]
		},
		{
			POSITION: [10, 2, 0.01, 15, -7.5, 0, 0]
		},
		{
			POSITION: [4, 7, -1.2, 9, 0, 0, 0]
		},
		{
			POSITION: [2, 7, 2.5, 13, 0, 0, 0]
		}
	],
	TURRETS: [
		{
			POSITION: [10, 22, 0, 0, 360, 1],
			TYPE: ["genericTank", {COLOR: "#00ffff"}]
		},
		{
			POSITION: [10 * 2/3, 22, 0, 0, 360, 1],
			TYPE: ["genericTank", {COLOR: "#00ffff"}]
		},
		{
			POSITION: [10 * 1/3, 22, 0, 0, 360, 1],
			TYPE: ["genericTank", {COLOR: "#00ffff"}]
		}
	],
	ON: makeLaserON("(body.skill.raw[0] / 3) + 1")
}

Class.beamOfficialV1 = {
	PARENT: "genericDreadnought",
	LABEL: "Beam",
	UPGRADE_TOOLTIP: "More Charge Gain & a Turret",
	GUNS: [
        {
            POSITION: [18, 8, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic]),
                TYPE: 'bullet',
                IDENTIFIER: "laser",
                ALPHA: 0
            }
        },
		{
			POSITION: [25, 3, 1, 0, 0, 0, 0]
		},
		{
			POSITION: [10, 2, 0.01, 15, 7.5, 0, 0]
		},
		{
			POSITION: [10, 2, 0.01, 15, -7.5, 0, 0]
		},
		{
			POSITION: [4, 7, -1.2, 9, 0, 0, 0]
		},
		{
			POSITION: [2, 7, 2.5, 13, 0, 0, 0]
		}
	],
	TURRETS: [
		{
			POSITION: [10, 22, 0, 0, 360, 1],
			TYPE: ["genericTank", {COLOR: "#00ffff"}]
		},
		{
			POSITION: [5, 22, 0, 0, 360, 1],
			TYPE: ["autoTankGun", {COLOR: "#00ffff"}]
		}
	],
	ON: makeLaserON("(body.skill.raw[0] / 7) + 1")
}

Class.electricRifleOfficialV1 = {
	PARENT: "genericDreadnought",
	LABEL: "Electric Rifle",
	UPGRADE_TOOLTIP: "Shotgun Lasers",
	GUNS: [
        {
            POSITION: [18, 8, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, {spray: 3, shudder: 3}]),
                TYPE: 'bullet',
                IDENTIFIER: "laser",
                ALPHA: 0
            }
        },
        {
            POSITION: [18, 7.5, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, {spray: 3, shudder: 3}]),
                TYPE: 'bullet',
                IDENTIFIER: "laser",
                ALPHA: 0
            }
        },
        {
            POSITION: [18, 7, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, {spray: 3, shudder: 3}]),
                TYPE: 'bullet',
                IDENTIFIER: "laser",
                ALPHA: 0
            }
        },
        {
            POSITION: [18, 6.5, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, {spray: 3, shudder: 3}]),
                TYPE: 'bullet',
                IDENTIFIER: "laser",
                ALPHA: 0
            }
        },
        {
            POSITION: [18, 6, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, {spray: 3, shudder: 3}]),
                TYPE: 'bullet',
                IDENTIFIER: "laser",
                ALPHA: 0
            }
        },
        {
            POSITION: [18, 5.5, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, {spray: 3, shudder: 3}]),
                TYPE: 'bullet',
                IDENTIFIER: "laser",
                ALPHA: 0
            }
        },
		{
			POSITION: [25, 3, 1, 0, 0, 0, 0]
		},
		{
			POSITION: [10, 2, 0.01, 16, 6, 7, 0]
		},
		{
			POSITION: [10, 2, 0.01, 16, -6, -7, 0]
		},
		{
			POSITION: [4, 7, -1.2, 9, 0, 0, 0]
		},
		{
			POSITION: [2, 7, 2.5, 13, 0, 0, 0]
		}
	],
	TURRETS: [
		{
			POSITION: [10, 22, 0, 0, 360, 1],
			TYPE: ["hexagon", {COLOR: "#00ffff", FACING_TYPE: "spin"}]
		}
	],
	ON: makeLaserON()
}

Class.teslaOfficialV1 = {
	PARENT: "genericDreadnought",
	LABEL: "Tesla",
	UPGRADE_TOOLTIP: "More Charge Limit",
	GUNS: [
        {
            POSITION: [18, 8, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic]),
                TYPE: 'bullet',
                IDENTIFIER: "laser",
                ALPHA: 0
            }
        },
		{
			POSITION: [29, 3, 1, 0, 0, 0, 0]
		},
		{
			POSITION: [10, 2, 0.01, 15, 9.5, 0, 0]
		},
		{
			POSITION: [10, 2, 0.01, 15, -9.5, 0, 0]
		},
		{
			POSITION: [4, 7, -1.2, 9, 0, 0, 0]
		},
		{
			POSITION: [2, 7, 2.8, 13, 0, 0, 0]
		}
	],
	TURRETS: [
		{
			POSITION: [15, 25, 0, 0, 360, 1],
			TYPE: ["genericTank", {COLOR: "#00ffff"}]
		}
	],
	ON: makeLaserON("(body.skill.raw[0] / 10) + 1", "100 * (1 + (body.skill.raw[2] / 3))")
}

Class.ohmOfficialV1 = {
	PARENT: "genericDreadnought",
	LABEL: "Ohm",
	UPGRADE_TOOLTIP: "Trap Lasers",
	GUNS: [
        {
            POSITION: [18, 8, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap]),
                TYPE: 'unsetTrap',
                IDENTIFIER: "laser",
                ALPHA: 0
            }
        },
		{
			POSITION: [29, 3, 1, 0, 0, 0, 0]
		},
		{
			POSITION: [10, 2, 0.01, 15, 9.5, 0, 0]
		},
		{
			POSITION: [10, 2, 0.01, 15, -9.5, 0, 0]
		},
		{
			POSITION: [4, 7, -1.2, 9, 0, 0, 0]
		},
		{
			POSITION: [2, 7, 2.8, 13, 0, 0, 0]
		}
	],
	TURRETS: [
		{
			POSITION: [15, 25, 0, 0, 360, 1],
			TYPE: ["unsetTrap", {COLOR: "#00ffff", FACING_TYPE: "spin"}]
		}
	],
	ON: makeLaserON("(body.skill.raw[0] / 10) + 1", "100 * (1 + (body.skill.raw[2] / 6))")
}

Class.coulombOfficialV1 = {
	PARENT: "genericDreadnought",
	LABEL: "Coulomb",
	UPGRADE_TOOLTIP: "Swarm Lasers",
	GUNS: [
        {
            POSITION: [18, 8, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap]),
                TYPE: 'autoswarm',
                IDENTIFIER: "laser",
                ALPHA: 0
            }
        },
		{
			POSITION: [24, 3, 1, 0, 0, 0, 0]
		},
		{
			POSITION: [10, 2, 0.01, 15, 9.5, 0, 0]
		},
		{
			POSITION: [10, 2, 0.01, 15, -9.5, 0, 0]
		},
		{
			POSITION: [4, 7, -1.2, 9, 0, 0, 0]
		},
		{
			POSITION: [2, 7, 2.8, 13, 0, 0, 0]
		}
	],
	TURRETS: [
		{
			POSITION: [10, 23, 0, 0, 360, 1],
			TYPE: ["triangle", {COLOR: "#00ffff", FACING_TYPE: "spin"}]
		}
	],
	ON: makeLaserON("(body.skill.raw[0] / 10) + 1", "100 * (1 + (body.skill.raw[2] / 6))")
}

Class.hexaLaserOfficialV1 = {
	PARENT: "genericDreadnought",
	LABEL: "Hexa Laser",
	UPGRADE_TOOLTIP: "6 Lasers",
	GUNS: [
		...weaponArray([
    	    {
    	        POSITION: [18, 8, 1, 0, 0, 0, 0],
    	        PROPERTIES: {
    	            SHOOT_SETTINGS: combineStats([g.basic]),
    	            TYPE: 'bullet',
    	            IDENTIFIER: "laser",
    	            ALPHA: 0
    	        }
    	    },
			{
				POSITION: [25, 3, 1, 0, 0, 0, 0]
			},
			{
				POSITION: [10, 2, 0.01, 15, 7.5, 0, 0]
			},
			{
				POSITION: [10, 2, 0.01, 15, -7.5, 0, 0]
			},
			{
				POSITION: [4, 7, -1.2, 9, 0, 0, 0]
			},
			{
				POSITION: [2, 7, 2.5, 13, 0, 0, 0]
			}
		], 3),
		...weaponArray([
    	    {
    	        POSITION: [18, 8, 1, 0 + 20, 0, 60, 0],
    	        PROPERTIES: {
    	            SHOOT_SETTINGS: combineStats([g.basic]),
    	            TYPE: 'bullet',
    	            IDENTIFIER: "laser",
    	            ALPHA: 0
    	        }
    	    },
			{
				POSITION: [25 + 20, 3, 1, 0, 0, 60, 0]
			},
			{
				POSITION: [10, 2, 0.01, 15 + 20, 7.5, 60, 0]
			},
			{
				POSITION: [10, 2, 0.01, 15 + 20, -7.5, 60, 0]
			},
			{
				POSITION: [2, 3, 2.8, 7 + 20, 0, 60, 0]
			},
			{
				POSITION: [4, 7, -1.2, 9 + 20, 0, 60, 0]
			},
			{
				POSITION: [2, 7, 2.5, 13 + 20, 0, 60, 0]
			}
		], 3)
	],
	TURRETS: [
		...weaponArray(
			{
				POSITION: [10, 22, 0, 0, 360, 1],
				TYPE: ["genericTank", {COLOR: "#00ffff"}]
			}, 3
		),
		...weaponArray(
			{
				POSITION: [10, 22 + 20, 0, 60, 360, 1],
				TYPE: ["genericTank", {COLOR: "#00ffff"}]
			}, 3
		)
	],
	ON: makeLaserON("(body.skill.raw[0] / 10) + 1", "100 * (1 + (body.skill.raw[2] / 15))")
}

Class.triFoLaserOfficialV1 = {
	PARENT: "genericDreadnought",
	LABEL: "Tri Fo Laser",
	UPGRADE_TOOLTIP: "3 Focused Lasers",
	GUNS: [
        {
            POSITION: [18, 8, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic]),
                TYPE: 'bullet',
                IDENTIFIER: "laser",
                ALPHA: 0
            }
        },
        {
            POSITION: [18 + 12, 8, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic]),
                TYPE: 'bullet',
                IDENTIFIER: "laser",
                ALPHA: 0
            }
        },
        {
            POSITION: [18 + 24, 8, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic]),
                TYPE: 'bullet',
                IDENTIFIER: "laser",
                ALPHA: 0
            }
        },
		{
			POSITION: [45, 3, 1, 0, 0, 0, 0]
		},
		{
			POSITION: [30, 2, 0.01, 15, 7.5, 0, 0]
		},
		{
			POSITION: [30, 2, 0.01, 15, -7.5, 0, 0]
		},
		{
			POSITION: [4, 7, -1.2, 9, 0, 0, 0]
		},
		{
			POSITION: [2, 7, 2.5, 13, 0, 0, 0]
		}
	],
	TURRETS: [
		{
			POSITION: [10, 22, 0, 0, 360, 1],
			TYPE: ["genericTank", {COLOR: "#00ffff"}]
		},
		{
			POSITION: [10, 34, 0, 0, 360, 1],
			TYPE: ["genericTank", {COLOR: "#00ffff"}]
		},
		{
			POSITION: [10, 46, 0, 0, 360, 1],
			TYPE: ["genericTank", {COLOR: "#00ffff"}]
		}
	],
	ON: makeLaserON()
}

Class.explosiveLaserBullet = {
	PARENT: "bullet",
	INDEPENDENT: true,
	GUNS: weaponArray(
		{
			POSITION: [0, 10, 0, 0, 0, 0, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic]),
				TYPE: ["bullet", {PERSISTS_AFTER_DEATH: true}],
				SHOOT_ON_DEATH: true
			}
		}, 6
	),
	TURRETS: [
		{
			POSITION: [10, 0, 0, 0, 0, 1],
			TYPE: ["hexagonOfficialV1", {COLOR: 16}]
		}
	]
}

Class.triExploLaserOfficialV1 = {
	PARENT: "genericDreadnought",
	LABEL: "Tri Explo Laser",
	UPGRADE_TOOLTIP: "3 Explosive Lasers",
	GUNS: weaponArray([
        {
            POSITION: [18, 8, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, {range: 0.5}]),
                TYPE: 'explosiveLaserBullet',
                IDENTIFIER: "laser",
                ALPHA: 0
            }
        },
		{
			POSITION: [25, 3, 1, 0, 0, 0, 0]
		},
		{
			POSITION: [10, 2, 0.01, 15, 7.5, 0, 0]
		},
		{
			POSITION: [10, 2, 0.01, 15, -7.5, 0, 0]
		},
		{
			POSITION: [4, 7, -1.2, 9, 0, 0, 0]
		},
		{
			POSITION: [2, 7, 2.5, 13, 0, 0, 0]
		}
	], 3),
	TURRETS: weaponArray(
		{
			POSITION: [10, 22, 0, 0, 360, 1],
			TYPE: ["genericTank", {COLOR: "#ff00ff"}]
		}, 3
	),
	ON: makeLaserON()
}

// TIER 4 LEGS RACE
Class.bayonetOfficialV1 = {
	PARENT: "genericDreadnought",
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
	PARENT: "genericDreadnought",
	LABEL: "Wrench",
	UPGRADE_TOOLTIP: "Pryers",
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
	PARENT: "genericDreadnought",
	LABEL: "Altar",
	UPGRADE_TOOLTIP: "Persuers",
    INVISIBLE: [0, 0],
	ALPHA: 0.3,
	IGNORED_BY_AI: true,
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
	PARENT: "genericDreadnought",
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
	PARENT: "genericDreadnought",
	LABEL: "Champion",
	UPGRADE_TOOLTIP: "Accelerating Bullets",
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
			POSITION: [22, 7, 0.001, 0, 0, 0, 0]
		}, {
			POSITION: [22, 7, 0.001, -7, 0, 0, 0]
		},
	], 3)
}
Class.palmOfficialV1 = {
	PARENT: "genericDreadnought",
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
	PARENT: "genericDreadnought",
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
			POSITION: [21, 6, 1, 0, 0, 0, 0.1],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.hunter, g.predator, g.hunterSecondary, g.hunterSecondary, g.dreadv1Generic, g.dreadv1Sniper]),
				TYPE: "bullet"
			}
		},
		{
			POSITION: [19, 8, 1, 0, 0, 0, 0.2],
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
	PARENT: "genericDreadnought",
	LABEL: "Bomber",
	UPGRADE_TOOLTIP: "Ruiners",
	GUNS: weaponArray([
		{
			POSITION: [13, 3, 1, 0, -3, -9, 0.6],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.artillery, g.twin ]),
				TYPE: "bullet",
				LABEL: "Secondary",
			},
		},
		{
			POSITION: [13, 3, 1, 0, 3, 9, 0.8],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.artillery, g.twin ]),
				TYPE: "bullet",
				LABEL: "Secondary",
			},
		},
		{
			POSITION: [17, 3, 1, 0, -2.5, -7, 0.2],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.artillery, g.twin ]),
				TYPE: "bullet",
				LABEL: "Secondary",
			},
		},
		{
			POSITION: [17, 3, 1, 0, 2.5, 7, 0.4],
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
	PARENT: "genericDreadnought",
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
	PARENT: "genericDreadnought",
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
	PARENT: "genericDreadnought",
	LABEL: "Pillager",
	UPGRADE_TOOLTIP: "Machine Guns",
	GUNS: weaponArray([
		{
			POSITION: [8.5, 9, 1.3, 6, 0, 0, 3/4],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.twin, g.dreadv1Generic, g.dreadv1Slow, {health: 1.13, shudder: 1.2, speed: 0.9, maxSpeed: 0.7, range: 0.7, size: 0.575}]),
				TYPE: "bullet"
			}
		}, {
			POSITION: [8.5, 8.5, 1.3, 7, 0, 0, 2/4],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.twin, g.dreadv1Generic, g.dreadv1Slow, {health: 1.13, shudder: 1.2, speed: 0.9, maxSpeed: 0.7, range: 0.7, size: 0.575}]),
				TYPE: "bullet"
			}
		}, {
			POSITION: [8.5, 8, 1.25, 8, 0, 0, 1/4],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.twin, g.dreadv1Generic, g.dreadv1Slow, {health: 1.13, shudder: 1.2, speed: 0.9, maxSpeed: 0.7, range: 0.7, size: 0.6}]),
				TYPE: "bullet"
			}
		}, {
			POSITION: [8.5, 7.5, 1.2, 9, 0, 0, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.twin, g.dreadv1Generic, g.dreadv1Slow, {health: 1.13, shudder: 1.2, speed: 0.9, maxSpeed: 0.7, range: 0.7, size: 0.6 * 8.5 / 7.5}]),
				TYPE: "bullet"
			}
		}
	], 3)
}
Class.methamphetamineOfficialV1 = {
	PARENT: "genericDreadnought",
	LABEL: "Methamphetamine",
	UPGRADE_TOOLTIP: "Redistributors",
	GUNS: weaponArray([
		{
			POSITION: [20, 6, 1, 0, 0, 0, 0.75],
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
			POSITION: [8.5, 7.875, 1.2, 9, 0, 0, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.twin, g.dreadv1Generic, g.dreadv1Slow, {health: 1.13, shudder: 1.2, speed: 0.9, maxSpeed: 0.7, range: 0.7, size: 0.6 * 8.5 / 7.5}]),
				TYPE: "bullet"
			}
		}
	], 3)
}
Class.rimfireOfficialV1 = {
	PARENT: "genericDreadnought",
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
	PARENT: "genericDreadnought",
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
	PARENT: "genericDreadnought",
	LABEL: "Spokesperson",
	UPGRADE_TOOLTIP: "Rocketeers",
	GUNS: weaponArray([
		{
			POSITION: [3.5, 8, -0.8, 15, 0, 0, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.launcher, g.rocketeer, {reload: 1.75, size: 0.6}]),
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
	PARENT: "genericDreadnought",
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
Class.politicianOfficialV1 = {
	PARENT: "genericDreadnought",
	LABEL: "Politician",
	UPGRADE_TOOLTIP: "Heptuplets",
	GUNS: weaponArray([
		{
			POSITION: [12.75, 4.75, 1, 0, 2.5, 0, 3/4],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.triplet, g.dreadv1Generic, g.dreadv1Slow, {range: 0.9}]),
				TYPE: "bullet"
			}
		}, {
			POSITION: [12.75, 4.75, 1, 0, -2.5, 0, 3/4],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.triplet, g.dreadv1Generic, g.dreadv1Slow, {range: 0.9}]),
				TYPE: "bullet"
			}
		}, {
			POSITION: [14.5, 4.75, 1, 0, 2, 0, 2/4],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.triplet, g.dreadv1Generic, g.dreadv1Slow, {range: 0.9}]),
				TYPE: "bullet"
			}
		}, {
			POSITION: [14.5, 4.75, 1, 0, -2, 0, 2/4],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.triplet, g.dreadv1Generic, g.dreadv1Slow, {range: 0.9}]),
				TYPE: "bullet"
			}
		}, {
			POSITION: [15.25, 4.75, 1, 0, 1.5, 0, 1/4],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.triplet, g.dreadv1Generic, g.dreadv1Slow, {range: 0.9}]),
				TYPE: "bullet"
			}
		}, {
			POSITION: [15.25, 4.75, 1, 0, -1.5, 0, 1/4],
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
Class.agentOfficialV1 = {
	PARENT: "genericDreadnought",
	LABEL: "Agent",
	UPGRADE_TOOLTIP: "Staplers",
	GUNS: weaponArray([
		{
			POSITION: [17, 2, 1, 0, -3.4, 0, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.power, g.twin, g.nailgun]),
				TYPE: "bullet",
			},
		},
		{
			POSITION: [17, 2, 1, 0, 3.4, 0, 0.2],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.power, g.twin, g.nailgun]),
				TYPE: "bullet",
			},
		},
		{
			POSITION: [19, 2, 1, 0, -2, 0, 0.4],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.power, g.twin, g.nailgun]),
				TYPE: "bullet",
			},
		},
		{
			POSITION: [19, 2, 1, 0, 2, 0, 0.6],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.power, g.twin, g.nailgun]),
				TYPE: "bullet",
			},
		},
		{
			POSITION: [20, 2, 1, 0, 0, 0, 0.8],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.power, g.twin, g.nailgun]),
				TYPE: "bullet",
			},
		},
		{
			POSITION: [3.5, 9, -1.3, 8.5, 0, 0, 0],
		},
	], 3)
}
Class.officerOfficialV1 = {
	PARENT: "genericDreadnought",
	LABEL: "Officer",
	UPGRADE_TOOLTIP: "Daubers",
	GUNS: weaponArray([
		{
			POSITION: [14, 4, 1, 0, -2, -10, 1 / 2],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.artillery, g.twin, g.spreadshot]),
				TYPE: "bullet",
				LABEL: "Spread"
			}
		},
		{
			POSITION: [14, 4, 1, 0, 2, 10, 1 / 2],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.artillery, g.twin, g.spreadshot]),
				TYPE: "bullet",
				LABEL: "Spread"
			}
		},
		{
			POSITION: [16, 4, 1, 0, -1.75, -8, 3 / 8],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.artillery, g.twin, g.spreadshot]),
				TYPE: "bullet",
				LABEL: "Spread"
			}
		},
		{
			POSITION: [16, 4, 1, 0, 1.75, 8, 3 / 8],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.artillery, g.twin, g.spreadshot]),
				TYPE: "bullet",
				LABEL: "Spread"
			}
		},
		{
			POSITION: [17.5, 4, 1, 0, -1.5, -5, 1 / 4],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.artillery, g.twin, g.spreadshot]),
				TYPE: "bullet",
				LABEL: "Spread"
			}
		},
		{
			POSITION: [17.5, 4, 1, 0, 1.5, 5, 1 / 4],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.artillery, g.twin, g.spreadshot]),
				TYPE: "bullet",
				LABEL: "Spread"
			}
		},
		{
			POSITION: [19, 4, 1, 0, -1, -3, 1 / 8],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.artillery, g.twin, g.spreadshot]),
				TYPE: "bullet",
				LABEL: "Spread"
			}
		},
		{
			POSITION: [19, 4, 1, 0, 1, 3, 1 / 8],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.artillery, g.twin, g.spreadshot]),
				TYPE: "bullet",
				LABEL: "Spread"
			}
		},
		{
			POSITION: [12, 6, 1, 8, 0, 0, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.artillery, g.twin, g.spreadshot]),
				TYPE: "bullet"
			}
		}
	], 3)
}

Class.multimeterOfficialV1 = {
	PARENT: "genericDreadnought",
	LABEL: "Multimeter",
	UPGRADE_TOOLTIP: "Drones",
	GUNS: weaponArray({
		POSITION: [10, 8, 1.25, 7.5, 0, 0, 0],
		PROPERTIES: {
			SHOOT_SETTINGS: combineStats([g.drone, g.overseer, g.dreadv1Drone, {speed: 0.95, maxSpeed: 0.95, damage: 0.9, health: 0.92}]),
			TYPE: "drone",
			AUTOFIRE: true,
			SYNCS_SKILLS: true,
			STAT_CALCULATOR: "drone",
			WAIT_TO_CYCLE: true,
			MAX_CHILDREN: 9,
		}
	}, 3)
}
Class.despotShape = makeHat("M -1 -0.5 L 1 -0.5 L 1 0.5 L -1 0.5 Z")
Class.despotOfficialV1 = {
	PARENT: "genericDreadnought",
	LABEL: "Despot",
	UPGRADE_TOOLTIP: "Twin Overdriven Drones",
	GUNS: weaponArray({
		POSITION: [7, 7.5, 1.3, 7.5, 0, 0, 0],
		PROPERTIES: {
			SHOOT_SETTINGS: combineStats([g.drone, g.overseer, g.dreadv1Drone, {speed: 0.95, maxSpeed: 0.95, damage: 0.93, health: 0.92}]),
			TYPE: "twinTurretedDrone",
			AUTOFIRE: true,
			SYNCS_SKILLS: true,
			STAT_CALCULATOR: "drone",
			WAIT_TO_CYCLE: true,
			MAX_CHILDREN: 3,
		}
	}, 3),
	TURRETS: weaponArray([{
		POSITION: [3, 10, 1.3, 0, 360, 1],
		TYPE: ["despotShape", {COLOR: 16, INDEPENDENT: true}],
	}, {
		POSITION: [3, 10, -1.3, 0, 360, 1],
		TYPE: ["despotShape", {COLOR: 16, INDEPENDENT: true}],
	}], 3)
}
Class.caseohOfficialV1 = {
	PARENT: "genericDreadnought",
	LABEL: "CaseOh",
	UPGRADE_TOOLTIP: "Bigger Cheese Drones",
	GUNS: weaponArray({
		POSITION: [16, 6, 2.5, 0, 0, 0, 0],
		PROPERTIES: {
			SHOOT_SETTINGS: combineStats([g.drone, g.bigCheese, g.bigCheese, g.dreadv1Drone, {speed: 0.95, maxSpeed: 0.95, damage: 0.93, health: 0.92}]),
			TYPE: "drone",
			AUTOFIRE: true,
			SYNCS_SKILLS: true,
			STAT_CALCULATOR: "drone",
			WAIT_TO_CYCLE: true,
			MAX_CHILDREN: 1,
		},
	}, 3)
}
Class.antagonistOfficialV1 = {
	PARENT: "genericDreadnought",
	LABEL: "Antagonist",
	UPGRADE_TOOLTIP: "Triple Shot Minions",
	GUNS: weaponArray([
		{
			POSITION: [14.25, 9, 1, 0, 0, 0, 0],
		}, {
			POSITION: [1.5, 10, 1, 14.25, 0, 0, 0],
			PROPERTIES: {
				MAX_CHILDREN: 1,
				SHOOT_SETTINGS: combineStats([g.minion, g.overseer, g.dreadv1Drone, {damage: 0.6}]),
				TYPE: ["tripleShotMinion", {GUN_STAT_SCALE: {reload: 1.333, health: 0.7, speed: 0.8, maxSpeed: 0.8}}],
				STAT_CALCULATOR: "drone",
				AUTOFIRE: true,
				SYNCS_SKILLS: true
			}
		}, {
			POSITION: [11.5, 10, 1, 0, 0, 0, 0]
		}, {
			POSITION: [12.25, 3, 1, 0, -0.5, 10, 0]
		}, {
			POSITION: [12.25, 3, 1, 0, 0.5, -10, 0]
		}, {
			POSITION: [12.5, 3, 1, 0, 0, 0, 0]
		}
	], 3)
}
Class.advocateOfficialV1 = {
	PARENT: "genericDreadnought",
	LABEL: "Advocate",
	UPGRADE_TOOLTIP: "Diesel Minions",
	GUNS: weaponArray([
		{
			POSITION: [14.25, 9, 1, 0, 0, 0, 0],
		}, {
			POSITION: [1.5, 10, 1, 14.25, 0, 0, 0],
			PROPERTIES: {
				MAX_CHILDREN: 1,
				SHOOT_SETTINGS: combineStats([g.minion, g.overseer, g.dreadv1Drone, {damage: 0.6}]),
				TYPE: ["dieselMinion", {GUN_STAT_SCALE: {reload: 1.333, health: 0.7, speed: 0.8, maxSpeed: 0.8}}],
				STAT_CALCULATOR: "drone",
				AUTOFIRE: true,
				SYNCS_SKILLS: true
			}
		}, {
			POSITION: [11.5, 10, 1, 0, 0, 0, 0]
		}, {
			POSITION: [12.5, 4, 1.9, 0, 0, 0, 0]
		}
	], 3)
}
Class.systemistOfficialV1 = {
	PARENT: "genericDreadnought",
	LABEL: "Systemist",
	UPGRADE_TOOLTIP: "Booster Minions",
	GUNS: weaponArray([
		{
			POSITION: [14.25, 9, 1, 0, 0, 0, 0],
		}, {
			POSITION: [1.5, 10, 1, 14.25, 0, 0, 0],
			PROPERTIES: {
				MAX_CHILDREN: 1,
				SHOOT_SETTINGS: combineStats([g.minion, g.overseer, g.dreadv1Drone, {damage: 0.6}]),
				TYPE: ["boosterMinion", {GUN_STAT_SCALE: {reload: 1.333, health: 0.7, speed: 0.8, maxSpeed: 0.8}}],
				STAT_CALCULATOR: "drone",
				AUTOFIRE: true,
				SYNCS_SKILLS: true
			}
		}, {
			POSITION: [11.5, 10, 1, 0, 0, 0, 0]
		}, {
			POSITION: [12, 3, 1, 0, 1, 15, 0]
		}, {
			POSITION: [12, 3, 1, 0, -1, -15, 0]
		}, {
			POSITION: [12.5, 3, 1, 0, 0.5, 10, 0]
		}, {
			POSITION: [12.5, 3, 1, 0, -0.5, -10, 0]
		}
	], 3)
}
Class.robberOfficialV1 = {
	PARENT: "genericDreadnought",
	LABEL: "Robber",
	UPGRADE_TOOLTIP: "Swarms",
	GUNS: weaponArray([
		{
			POSITION: [7, 6, 0.6, 5, 2.5, 0, 3/4],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.swarm, g.carrier, { reload: 2, speed: 0.5, range: 0.9, health: 0.85}]),
				TYPE: "swarm",
				STAT_CALCULATOR: "swarm"
			}
		}, {
			POSITION: [7, 6, 0.6, 5, -2.5, 0, 3/4],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.swarm, g.carrier, { reload: 2, speed: 0.5, range: 0.9, health: 0.85}]),
				TYPE: "swarm",
				STAT_CALCULATOR: "swarm"
			}
		}, 
		{
			POSITION: [7, 6, 0.6, 6, 2, 0, 2/4],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.swarm, g.carrier, { reload: 2, speed: 0.5, range: 0.9, health: 0.85}]),
				TYPE: "swarm",
				STAT_CALCULATOR: "swarm"
			}
		}, {
			POSITION: [7, 6, 0.6, 6, -2, 0, 2/4],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.swarm, g.carrier, { reload: 2, speed: 0.5, range: 0.9, health: 0.85}]),
				TYPE: "swarm",
				STAT_CALCULATOR: "swarm"
			}
		}, {
			POSITION: [7, 6, 0.6, 7, 1, 0, 1/4],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.swarm, g.carrier, { reload: 2, speed: 0.5, range: 0.9, health: 0.85}]),
				TYPE: "swarm",
				STAT_CALCULATOR: "swarm"
			}
		}, {
			POSITION: [7, 6, 0.6, 7, -1, 0, 1/4],
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
Class.hooliganOfficialV1 = {
	PARENT: "genericDreadnought",
	LABEL: "Hooligan",
	UPGRADE_TOOLTIP: "More Automated Swarms",
	GUNS: weaponArray([
		{
			POSITION: [7, 6, 0.6, 5.5, 2, 0, 0.5],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.swarm, g.carrier, { reload: 0.5, speed: 0.5, range: 0.9, health: 0.85}]),
				TYPE: "autoswarm",
				STAT_CALCULATOR: "swarm",
				COLOR: "red"
			}
		}, {
			POSITION: [7, 6, 0.6, 5.5, -2, 0, 0.5],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.swarm, g.carrier, { reload: 0.5, speed: 0.5, range: 0.9, health: 0.85}]),
				TYPE: "autoswarm",
				STAT_CALCULATOR: "swarm",
				COLOR: "red"
			}
		}, {
			POSITION: [7, 6, 0.6, 6.5, 0, 0, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.swarm, g.carrier, { reload: 0.5, speed: 0.5, range: 0.9, health: 0.85}]),
				TYPE: "autoswarm",
				STAT_CALCULATOR: "swarm",
				COLOR: "red"
			}
		}
	], 3)
}

Class.wasp = {
	PARENT: "autoswarm",
	SHAPE: 5
}

Class.landlubberOfficialV1 = {
	PARENT: "genericDreadnought",
	LABEL: "Landlubber",
	UPGRADE_TOOLTIP: "Wasps/Bees/Swarms",
	GUNS: weaponArray([
		{
			POSITION: [7, 6, 0.6, 7, 2, 0, 0.5],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.swarm, g.carrier, { reload: 2.5, speed: 1.5, range: 0.7, health: 0.85}]),
				TYPE: "wasp",
				STAT_CALCULATOR: "swarm"
			}
		}, {
			POSITION: [7, 6, 0.6, 7, -2, 0, 0.5],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.swarm, g.carrier, { reload: 2.5, speed: 1.5, range: 0.7, health: 0.85}]),
				TYPE: "wasp",
				STAT_CALCULATOR: "swarm"
			}
		}, {
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
			POSITION: [9, 6, 1, 6.5, 0, 0, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.swarm, g.carrier, { reload: 1.5, speed: 0.5, range: 0.9, health: 0.85}]),
				TYPE: "bee",
				STAT_CALCULATOR: "swarm"
			}
		}
	], 3)
}
Class.shrekOfficialV1 = {
	PARENT: "genericDreadnought",
	LABEL: "Shrek",
	UPGRADE_TOOLTIP: "Spammier Traps",
	GUNS: weaponArray([
		{
			POSITION: [12, 2.25, 1, 0, -3.5, 0, 0]
		}, {
			POSITION: [1.75, 2.25, 1.7, 12, -3.5, 0, 5/7],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.trap, g.dreadv1Generic, g.dreadv1Slow, g.dreadv1Trap, { reload: 1.22, health: 0.67, damage: 0.7 }]),
				TYPE: ["trap", {HITS_OWN_TYPE: "never"} ],
				STAT_CALCULATOR: "trap",
			},
		}, {
			POSITION: [12, 2.25, 1, 0, 3.5, 0, 0]
		}, {
			POSITION: [1.75, 2.25, 1.7, 12, 3.5, 0, 6/7],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.trap, g.dreadv1Generic, g.dreadv1Slow, g.dreadv1Trap, { reload: 1.22, health: 0.67, damage: 0.7 }]),
				TYPE: ["trap", {HITS_OWN_TYPE: "never"} ],
				STAT_CALCULATOR: "trap",
			},
		}, {
			POSITION: [13, 2.25, 1, 0, -3, 0, 0]
		}, {
			POSITION: [1.75, 2.25, 1.7, 13, -3, 0, 3/7],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.trap, g.dreadv1Generic, g.dreadv1Slow, g.dreadv1Trap, { reload: 1.22, health: 0.67, damage: 0.7 }]),
				TYPE: ["trap", {HITS_OWN_TYPE: "never"} ],
				STAT_CALCULATOR: "trap",
			},
		}, {
			POSITION: [13, 2.25, 1, 0, 3, 0, 0]
		}, {
			POSITION: [1.75, 2.25, 1.7, 13, 3, 0, 4/7],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.trap, g.dreadv1Generic, g.dreadv1Slow, g.dreadv1Trap, { reload: 1.22, health: 0.67, damage: 0.7 }]),
				TYPE: ["trap", {HITS_OWN_TYPE: "never"} ],
				STAT_CALCULATOR: "trap",
			},
		}, {
			POSITION: [14, 2.25, 1, 0, 2, 0, 0]
		}, {
			POSITION: [1.75, 2.25, 1.7, 14, 2, 0, 2/7],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.trap, g.dreadv1Generic, g.dreadv1Slow, g.dreadv1Trap, { reload: 1.22, health: 0.67, damage: 0.7 }]),
				TYPE: ["trap", {HITS_OWN_TYPE: "never"} ],
				STAT_CALCULATOR: "trap",
			},
		}, {
			POSITION: [14, 2.25, 1, 0, -2, 0, 0]
		}, {
			POSITION: [1.75, 2.25, 1.7, 14, -2, 0, 1/7],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.trap, g.dreadv1Generic, g.dreadv1Slow, g.dreadv1Trap, { reload: 1.22, health: 0.67, damage: 0.7 }]),
				TYPE: ["trap", {HITS_OWN_TYPE: "never"} ],
				STAT_CALCULATOR: "trap"
			}
		}, {
			POSITION: [15, 3, 1, 0, 0, 0, 0]
		}, {
			POSITION: [2, 3, 1.7, 15, 0, 0, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.trap, g.dreadv1Generic, g.dreadv1Slow, g.dreadv1Trap, { reload: 1.22, health: 0.67, damage: 0.7 }]),
				TYPE: ["trap", {HITS_OWN_TYPE: "never"} ],
				STAT_CALCULATOR: "trap"
			}
		}
	], 3)
}
Class.thanatosOfficialV1 = {
	PARENT: "genericDreadnought",
	LABEL: "Thanatos",
	UPGRADE_TOOLTIP: "Faster Trap Spam",
	GUNS: weaponArray([
		{
			POSITION: [13.25, 2.25, 1, 0, 4, 0, 0]
		}, {
			POSITION: [3.75, 2.25, 1.7, 13.25, 4, 0, 2/3],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.trap, g.dreadv1Generic, g.dreadv1Slow, g.dreadv1Trap, { reload: 1.22, health: 0.67, damage: 0.7, speed: 3, maxSpeed: 3 }]),
				TYPE: ["trap", {HITS_OWN_TYPE: "never"} ],
				STAT_CALCULATOR: "trap",
			},
		}, {
			POSITION: [13.25, 2.25, 1, 0, -4, 0, 0]
		}, {
			POSITION: [3.75, 2.25, 1.7, 13.25, -4, 0, 1/3],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.trap, g.dreadv1Generic, g.dreadv1Slow, g.dreadv1Trap, { reload: 1.22, health: 0.67, damage: 0.7, speed: 3, maxSpeed: 3 }]),
				TYPE: ["trap", {HITS_OWN_TYPE: "never"} ],
				STAT_CALCULATOR: "trap"
			}
		}, {
			POSITION: [14.75, 3, 1, 0, 0, 0, 0]
		}, {
			POSITION: [4, 3, 1.7, 14.75, 0, 0, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.trap, g.dreadv1Generic, g.dreadv1Slow, g.dreadv1Trap, { reload: 1.22, health: 0.67, damage: 0.7, speed: 3, maxSpeed: 3 }]),
				TYPE: ["trap", {HITS_OWN_TYPE: "never"} ],
				STAT_CALCULATOR: "trap"
			}
		}
	], 3)
}
Class.thugOfficialV1 = {
	PARENT: "genericDreadnought",
	LABEL: "Thug",
	UPGRADE_TOOLTIP: "Diesel Traps",
	GUNS: weaponArray([
		{
			POSITION: [14.75, 5, 1.9, 0, 0, 0, 0]
		}, {
			POSITION: [2, 5 * 1.9, 1.7, 14.75, 0, 0, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.trap, g.machineGun, g.dreadv1Generic, g.dreadv1Slow, g.dreadv1Trap, { reload: 0.12, health: 0.67, damage: 0.7, range: 0.5, spray: 2, shudder: 1.5, size: 0.3 }]),
				TYPE: ["trap", {HITS_OWN_TYPE: "never"} ],
				STAT_CALCULATOR: "trap"
			}
		}
	], 3)
}
Class.bumOfficialV1 = {
	PARENT: "genericDreadnought",
	LABEL: "Bum",
	UPGRADE_TOOLTIP: "Diesel Traps, But Big",
	GUNS: weaponArray([
		{
			POSITION: [14.75, 5, 1.9, 0, 0, 0, 0]
		}, {
			POSITION: [2, 5 * 1.9, 1.7, 14.75, 0, 0, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.trap, g.machineGun, g.dreadv1Generic, g.dreadv1Slow, g.dreadv1Trap, { reload: 0.1, health: 0.9, damage: 0.8, range: 0.7, spray: 3.5, shudder: 2.5, size: 1.5 }]),
				TYPE: ["trap", {HITS_OWN_TYPE: "never"} ],
				STAT_CALCULATOR: "trap"
			}
		}
	], 3)
}
Class.hulkOfficialV1 = {
	PARENT: "genericDreadnought",
	LABEL: "Hulk",
	UPGRADE_TOOLTIP: "Bigger Blocks",
	GUNS: weaponArray([
		{
			POSITION: [13, 11, 1, 0, 0, 0, 0],
		}, {
			POSITION: [3, 11, 1.5, 13, 0, 0, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.trap, g.setTrap, g.dreadv1Generic, g.dreadv1Slow, g.dreadv1Trap, g.dreadv1Trap, { reload: 1.75, range: 1.2, health: 1.75 }]),
				TYPE: ["unsetTrap", {HITS_OWN_TYPE: "never"} ],
				STAT_CALCULATOR: "block"
			}
		}
	], 3)
}
Class.gargantuaOfficialV1 = {
	PARENT: "genericDreadnought",
	LABEL: "Gargantua",
	UPGRADE_TOOLTIP: "Unset Assemblent",
	GUNS: weaponArray([
		{
			POSITION: [13, 9.5, 1, 0, 0, 0, 0],
		}, {
			POSITION: [2, 9.5, 1.3, 13, 0, 0, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.trap, g.setTrap, g.dreadv1Generic, g.dreadv1Slow, g.dreadv1Trap, { reload: 1.55, range: 0.93, health: 1.55 }]),
				TYPE: 'assemblent',
				NO_LIMITATIONS: true,
				MAX_CHILDREN: 8,
				STAT_CALCULATOR: 'block',
			}
		}
	], 3),
	TURRETS: weaponArray(
        {
            POSITION: [2, 12.5, 0, 0, 360, 1],
            TYPE: ["squareHatCurved", { COLOR: "darkGrey" }],
        }, 3
	)
}
Class.fairyOfficialV1 = {
	PARENT: "genericDreadnought",
	LABEL: "Fairy",
	UPGRADE_TOOLTIP: "Bent Boomerangs",
	GUNS: weaponArray([
		{
			POSITION: [5, 4, 1, 10, 3, 0, 0],
		},
		{
			POSITION: [3, 4, -1.5, 9, 3, 0, 0],
		},
		{
			POSITION: [2, 4, 1.3, 15, 3, 0, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.trap, g.twin, g.setTrap, g.boomerang, {reload: 2.5}]),
				TYPE: "boomerang",
				STAT_CALCULATOR: "block"
			},
		},
		{
			POSITION: [5, 4, 1, 10, -3, 0, 0],
		},
		{
			POSITION: [3, 4, -1.5, 9, -3, 0, 0],
		},
		{
			POSITION: [2, 4, 1.3, 15, -3, 0, 0.5],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.trap, g.twin, g.setTrap, g.boomerang, {reload: 2.5}]),
				TYPE: "boomerang",
				STAT_CALCULATOR: "block"
			},
		},
	], 3)
}

Class.sheriffOfficialV1 = {
	PARENT: "genericDreadnought",
	LABEL: "Sheriff",
	UPGRADE_TOOLTIP: "Mega Auto-Blocks",
	GUNS: weaponArray([
		{
			POSITION: [13, 10, 1, 0, 0, 0, 0],
		}, {
			POSITION: [11, 11, 1, 0, 0, 0, 0],
		}, {
			POSITION: [3, 10, 1.5, 13, 0, 0, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.trap, g.dreadv1Generic, g.dreadv1Slow, g.dreadv1Trap]),
				TYPE: ["megaAutoPillbox", {HITS_OWN_TYPE: "never"}],
				STAT_CALCULATOR: "trap",
			}
		}
	], 3)
}

Class.scareOfficialV1 = {
	PARENT: "genericDreadnought",
	LABEL: "Scare",
	UPGRADE_TOOLTIP: "Triple Auto-Traps",
	GUNS: weaponArray([
		{
			POSITION: [13, 7, 1, 0, 0, 0, 0],
		}, {
			POSITION: [11, 9, 1, 0, 0, 0, 0],
		}, {
			POSITION: [3, 7, 1.5, 13, 0, 0, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.trap, g.dreadv1Generic, g.dreadv1Slow, g.dreadv1Trap]),
				TYPE: ["tripleTurretedTrap", {HITS_OWN_TYPE: "never"} ],
				STAT_CALCULATOR: "trap",
			}
		}, {
			POSITION: [12.75, 3, 1, 0, -0.5, 10, 0]
		}, {
			POSITION: [12.75, 3, 1, 0, 0.5, -10, 0]
		}, {
			POSITION: [13, 3, 1, 0, 0, 0, 0]
		}
	], 3)
}
Class.tickOfficialV1 = {
	PARENT: "genericDreadnought",
	LABEL: "Tick",
	UPGRADE_TOOLTIP: "Twin Swarm Traps",
	GUNS: weaponArray([
		{
			POSITION: [13, 7, 1, 0, 0, 0, 0],
		}, {
			POSITION: [11, 9, 1, 0, 0, 0, 0],
		}, {
			POSITION: [3, 7, 1.5, 13, 0, 0, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.trap, g.dreadv1Generic, g.dreadv1Slow, g.dreadv1Trap]),
				TYPE: ["twinSwarmTrap", {HITS_OWN_TYPE: "never"} ],
				STAT_CALCULATOR: "trap",
			}
		}, {
			POSITION: [7.5, 3, -1.6, 5, 3, 0, 0]
		}, {
			POSITION: [7.5, 3, -1.6, 5, -3, 0, 0]
		}
	], 3)
}

Class.aiOfficialV1 = {
	PARENT: "genericDreadnought",
	LABEL: "AI",
	UPGRADE_TOOLTIP: "Auto Turrets",
	TURRETS: [
		...weaponArray({
			POSITION: [5.5, 8.25, 0, 30, 180, 1],
			TYPE: ["dreadv1BodyTurret", {GUN_STAT_SCALE: {damage: 1.36}}],
		}, 6),
		{
			POSITION: [11, 0, 0, 0, 360, 1],
			TYPE: ["dreadv1BodyTurret", {GUN_STAT_SCALE: {damage: 2.5}}],
		}
	]
}
Class.cruiseOfficialV1 = {
	PARENT: "genericDreadnought",
	LABEL: "Cruise",
	UPGRADE_TOOLTIP: "Swarm Turrets",
	TURRETS: [
		...weaponArray({
			POSITION: [4, 10, 0, 0, 180, 1],
			TYPE: ["boatTurret", {GUN_STAT_SCALE: {damage: 1.12}}],
		}, 6),
		{
			POSITION: [9.5, 0, 0, 0, 360, 1],
			TYPE: ["boatTurret", {GUN_STAT_SCALE: {damage: 1.8}}],
		}
	]
}
Class.gizmoOfficialV1 = {
	PARENT: "genericDreadnought",
	LABEL: "Gizmo",
	UPGRADE_TOOLTIP: "Trap Turrets",
	TURRETS: [
		...weaponArray({
			POSITION: [4, 8.25, 0, 30, 180, 1],
			TYPE: ["trapTurret", {GUN_STAT_SCALE: {damage: 1.12}}],
		}, 6),
		{
			POSITION: [9.5, 0, 0, 0, 360, 1],
			TYPE: ["megaTrapTurret", {GUN_STAT_SCALE: {damage: 1.8}}],
		}
	]
}
Class.cyborgOfficialV1 = {
	PARENT: "genericDreadnought",
	LABEL: "Cyborg",
	UPGRADE_TOOLTIP: "Auto Turrets",
	TURRETS: [
		...weaponArray([
			{
				POSITION: [3.5, 8.25, 0, 30, 180, 1],
				TYPE: "dreadv1BodyTurret",
			},
			{
				POSITION: [3.5, 8, 0, 0, 180, 1],
				TYPE: "dreadv1BodyTurret",
			},
			{
				POSITION: [3.5, 4.25, 0, 30, 180, 1],
				TYPE: "dreadv1BodyTurret",
			}
		], 6),
	]
}
Class.dobleydooOfficialV1 = {
	PARENT: "genericDreadnought",
	LABEL: "Dobleydoo",
	UPGRADE_TOOLTIP: "Auto Turrets",
	TURRETS: [
		...weaponArray([
			{
				POSITION: [3.5, 8, 0, 0, 180, 1],
				TYPE: "dreadv1BodyTurret",
			}
		], 3),
		{
			POSITION: [8, 0, 0, 0, 360, 1],
			TYPE: "dobleydooTurret",
		}
	]
}
Class.doodadOfficialV1 = {
	PARENT: "genericDreadnought",
	LABEL: "Doodad",
	UPGRADE_TOOLTIP: "Nailgun Turrets",
	TURRETS: weaponArray({
		POSITION: [6, 5, 0, 0, 360, 1],
		TYPE: "nailgunTurret",
	}, 3)
}
Class.teraAutoTurret = makeTurret({
	GUNS: [
		{
			POSITION: [22, 24, 1, 0, 0, 0, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.destroyer, g.annihilator, g.pelleter, g.power, { recoil: 1.15 }, g.turret]),
				TYPE: "bullet",
			},
		},
		{
			POSITION: [8, 24, -0.5, -8, 0, 0, 0],
		}
	],
}, {label: "Turret", fov: 0.8, extraStats: []})
Class.gibibyteOfficialV1 = {
	PARENT: "genericDreadnought",
	LABEL: "Gibibyte",
	UPGRADE_TOOLTIP: "Swarmer Turret",
	TURRETS: [
		{
			POSITION: [10, 0, 0, 0, 360, 1],
			TYPE: "swarmerTurret"
		}
	]
}
Class.ternaryOfficialV1 = {
	PARENT: "genericDreadnought",
	LABEL: "Ternary",
	UPGRADE_TOOLTIP: "Culverin Turret",
	TURRETS: [
		{
			POSITION: [10, 0, 0, 0, 360, 1],
			TYPE: "culverinTurret"
		}
	]
}
Class.terabyteOfficialV1 = {
	PARENT: "genericDreadnought",
	LABEL: "Terabyte",
	UPGRADE_TOOLTIP: "Tera Auto Turret",
	TURRETS: [
		{
			POSITION: [12, 0, 0, 0, 360, 1],
			TYPE: "teraAutoTurret"
		}
	]
}
Class.giantOfficialV1 = {
	PARENT: "genericDreadnought",
	LABEL: "Giant",
	UPGRADE_TOOLTIP: "Health Buff",
	BODY: {
		HEALTH: 4.3,
		SHIELD: 3.8,
		REGEN: 2.5,
		SPEED: 1.25,
	},
	TURRETS: [{
		POSITION: [27.5, 0, 0, 0, 0, 0],
		TYPE: ["hexagon", {COLOR: "black"}]
	}]
}
Class.cowOfficialV1 = {
	PARENT: "genericDreadnought",
	LABEL: "Cow",
	UPGRADE_TOOLTIP: "Size increase",
	BODY: {
		HEALTH: 2.3,
		SHIELD: 2.8,
		REGEN: 1.7,
		SPEED: 1.15,
	},
	SIZE: 32.5,
	TURRETS: [{
		POSITION: [23.5, 0, 0, 0, 0, 0],
		TYPE: ["hexagon", {COLOR: "black"}]
	}, {
		POSITION: [15, 0, 0, 0, 0, 1],
		TYPE: ["hexagon", {COLOR: -1, MIRROR_MASTER_ANGLE: true}]
	}, {
		POSITION: [7, 0, 0, 0, 0, 1],
		TYPE: ["hexagon", {COLOR: -1, MIRROR_MASTER_ANGLE: true}]
	}]
}
Class.monsterOfficialV1 = {
	PARENT: "genericDreadnought",
	LABEL: "Monster",
	UPGRADE_TOOLTIP: "Increased Bullet Health",
	BODY: {
		HEALTH: 2.3,
		SHIELD: 2.8,
		REGEN: 1.7,
		SPEED: 1.15,
	},
	TURRETS: [{
		POSITION: [23.5, 0, 0, 0, 0, 0],
		TYPE: ["hexagon", {COLOR: "black"}]
	}, {
		POSITION: [23.5, 0, 0, 20, 0, 0],
		TYPE: ["hexagon", {COLOR: "black"}]
	}, {
		POSITION: [23.5, 0, 0, 40, 0, 0],
		TYPE: ["hexagon", {COLOR: "black"}]
	}]
}
Class.cutlassOfficialV1 = {
	PARENT: "genericDreadnought",
	LABEL: "Cutlass",
	UPGRADE_TOOLTIP: "Damage Buff",
	BODY: {
		HEALTH: 1.3,
		SHIELD: 2,
		REGEN: 1.3,
		DAMAGE: 4.6,
	},
	TURRETS: weaponArray([{
		POSITION: [2.5, 9, 4, 0, 0, 0],
		TYPE: ["triangle", {COLOR: "black"}]
	}, {
		POSITION: [2.5, 10, 2, 0, 0, 0],
		TYPE: ["triangle", {COLOR: "black"}]
	}, {
		POSITION: [2.5, 11, 0, 0, 0, 0],
		TYPE: ["triangle", {COLOR: "black"}]
	}, {
		POSITION: [2.5, 10, -2, 0, 0, 0],
		TYPE: ["triangle", {COLOR: "black"}]
	}, {
		POSITION: [2.5, 9, -4, 0, 0, 0],
		TYPE: ["triangle", {COLOR: "black"}]
	}], 3)
}
Class.cutterOfficialV1 = {
	PARENT: "genericDreadnought",
	LABEL: "Cutter",
	UPGRADE_TOOLTIP: "Penetration Buff",
	BODY: {
		HEALTH: 1.3,
		SHIELD: 2,
		REGEN: 1.3,
		DAMAGE: 3.3,
		PENETRATION: 1.9,
	},
	TURRETS: weaponArray([{
		POSITION: [2.5, 9, 4, 0, 0, 0],
		TYPE: ["triangle", {COLOR: "white"}]
	}, {
		POSITION: [2.5, 10, 4/3, 0, 0, 0],
		TYPE: ["triangle", {COLOR: "white"}]
	}, {
		POSITION: [2.5, 10, -4/3, 0, 0, 0],
		TYPE: ["triangle", {COLOR: "white"}]
	}, {
		POSITION: [2.5, 9, -4, 0, 0, 0],
		TYPE: ["triangle", {COLOR: "white"}]
	}], 3)
}
Class.styletOfficialV1 = {
	PARENT: "genericDreadnought",
	LABEL: "Stylet",
	UPGRADE_TOOLTIP: "Increased Bullet Damage",
	BODY: {
		HEALTH: 1.3,
		SHIELD: 2,
		REGEN: 1.3,
		DAMAGE: 3.3
	},
	TURRETS: weaponArray([{
		POSITION: [12, 4, 0, 30, 0, 0],
		TYPE: "switchbladeTurret"
	}], 6)
}
Class.gearOfficialV1 = {
	PARENT: "genericDreadnought",
	LABEL: "Gear",
	UPGRADE_TOOLTIP: "Increased Bullet Speed",
	BODY: {
		HEALTH: 1.3,
		SHIELD: 2,
		REGEN: 1.3,
		DAMAGE: 4.6,
	},
	TURRETS: [{
		POSITION: [6.5, 0, 0, 0, 0, 1],
		TYPE: ["cogwheelDeco", {COLOR: "black"}]
	}, {
		POSITION: [15, 0, 0, 0, 0, 0],
		TYPE: ["cogwheelDeco2", {COLOR: "black"}]
	}]
}
Class.usainOfficialV1 = {
	PARENT: "genericDreadnought",
	LABEL: "Usain",
	UPGRADE_TOOLTIP: "Speed Buff",
	BODY: {
		HEALTH: 1.1,
		SHIELD: 1.6,
		REGEN: 1.1,
		SPEED: 10
	},
	TURRETS: [{
		POSITION: [15, 0, 0, 0, 0, 1],
		TYPE: ["hexagon", {COLOR: "black", MIRROR_MASTER_ANGLE: true}]
	}, {
		POSITION: [10, 0, 0, 0, 0, 1],
		TYPE: ["hexagon", {COLOR: -1, MIRROR_MASTER_ANGLE: true}]
	}, {
		POSITION: [5, 0, 0, 0, 0, 1],
		TYPE: ["hexagon", {COLOR: "black", MIRROR_MASTER_ANGLE: true}]
	}]
}
Class.ferrariOfficialV1 = {
	PARENT: "genericDreadnought",
	LABEL: "Ferrari",
	UPGRADE_TOOLTIP: "Lower Acceleration",
	BODY: {
		HEALTH: 1.1,
		SHIELD: 1.6,
		REGEN: 1.1,
		SPEED: 5,
		ACCELERATION: 0.01 //base.ACCEL
	},
	TURRETS: [{
		POSITION: [5, 0, 0, 0, 0, 1],
		TYPE: ["triangle", {COLOR: "black", MIRROR_MASTER_ANGLE: true}]
	}, {
		POSITION: [5, 0, 0, 180, 0, 1],
		TYPE: ["triangle", {COLOR: "black", MIRROR_MASTER_ANGLE: true}]
	}]
}
Class.havenOfficialV1 = {
	PARENT: "genericDreadnought",
	LABEL: "Haven",
	UPGRADE_TOOLTIP: "Healing",
	TURRETS: [{
		POSITION: [8, 0, 0, 0, 360, 1],
		TYPE: "havenTurret",
	}]
}
Class.repairmentOfficialV1 = {
	PARENT: "genericDreadnought",
	LABEL: "Repairment",
	UPGRADE_TOOLTIP: "Healing",
	TURRETS: [{
		POSITION: [10, 0, 0, 0, 360, 1],
		TYPE: "repairmentTurret",
	}]
}
Class.recoveryOfficialV1 = {
	PARENT: "genericDreadnought",
	LABEL: "Recovery",
	UPGRADE_TOOLTIP: "Healing",
	TURRETS: [{
		POSITION: [10, 0, 0, 0, 360, 1],
		TYPE: "recoveryTurret",
	}]
}
Class.heptacareOfficialV1 = {
	PARENT: "genericDreadnought",
	LABEL: "Heptacare",
	UPGRADE_TOOLTIP: "Heptuple Healing",
	TURRETS: [
		...weaponArray({
			POSITION: [5, 10, 0, 0, 360, 1],
			TYPE: "tricareTurret",
		}, 6),
		{
			POSITION: [8, 0, 0, 0, 360, 1],
			TYPE: "medicareTurret",
		}
	]
}
Class.inquisicareOfficialV1 = {
	PARENT: "genericDreadnought",
	LABEL: "Inquisicare",
	UPGRADE_TOOLTIP: "Drone Healing",
	GUNS: weaponArray({
		POSITION: [7, 7.5, 1.3, 7.5, 0, 0, 0],
		PROPERTIES: {
			SHOOT_SETTINGS: combineStats([g.drone, g.overseer, g.dreadv1Drone, g.healer, {speed: 0.95, maxSpeed: 0.95, damage: 0.93, health: 0.92}]),
			TYPE: "healerDrone",
			AUTOFIRE: true,
			SYNCS_SKILLS: true,
			STAT_CALCULATOR: "drone",
			WAIT_TO_CYCLE: true,
			MAX_CHILDREN: 5,
		}
	}, 3),
	TURRETS: weaponArray({
		POSITION: [4, 10, 0, 0, 360, 1],
		TYPE: "healerHat",
	}, 3)
}
Class.inkOfficialV1 = {
	PARENT: "genericDreadnought",
	LABEL: "Ink",
	UPGRADE_TOOLTIP: "Pen Healing",
	TURRETS: weaponArray({
		POSITION: [6, 10, 0, 0, 360, 1],
		TYPE: "inkTurret",
	}, 3)
}
Class.teracareOfficialV1 = {
	PARENT: "genericDreadnought",
	LABEL: "Teracare",
	UPGRADE_TOOLTIP: "Biggest Healing",
	TURRETS: [{
		POSITION: [14, 0, 0, 0, 360, 1],
		TYPE: "teracareTurret",
	}]
}

Class.clinicOfficialV1 = {
	PARENT: "genericDreadnought",
	LABEL: "Clinic",
	UPGRADE_TOOLTIP: "Rocketeer Healing",
	TURRETS: [{
		POSITION: [14, 0, 0, 0, 360, 1],
		TYPE: "clinicTurret",
	}]
}

Class.apothecaryOfficialV1 = {
	PARENT: "genericDreadnought",
	LABEL: "Apothecary",
	UPGRADE_TOOLTIP: "Buckshot Healing",
	TURRETS: [{
		POSITION: [14, 0, 0, 0, 360, 1],
		TYPE: "apothecaryTurret",
	}]
}

Class.radiumOfficialV1 = {
	PARENT: "genericDreadnought",
	LABEL: "Radium",
	UPGRADE_TOOLTIP: "Bigger Aura",
	TURRETS: [
		{
			POSITION: [15, 0, 0, 0, 0, 360, 1],
			TYPE: ["hexagon", {COLOR: -1, MIRROR_MASTER_ANGLE: true}]
		},
		{
			POSITION: [13, 0, 0, 0, 0, 360, 1],
			TYPE: ["radiumAura"]
		}
	]
}

Class.hiroshimaOfficialV1 = {
	PARENT: "genericDreadnought",
	LABEL: "Hiroshima",
	UPGRADE_TOOLTIP: "5 Auras",
	TURRETS: [
		{
			POSITION: [15, 0, 0, 0, 0, 360, 1],
			TYPE: ["hexagon", {COLOR: -1, MIRROR_MASTER_ANGLE: true}]
		},
		{
			POSITION: [10, 0, 0, 0, 0, 360, 1],
			TYPE: ["hiroshimaTurret", {COLOR: 0}]
		}
	]
}

Class.dispersalOfficialV1 = {
	PARENT: "genericDreadnought",
	LABEL: "Dispersal",
	UPGRADE_TOOLTIP: "Damaging Aura",
	TURRETS: [
		{
			POSITION: [15, 0, 0, 0, 0, 360, 1],
			TYPE: ["hexagon", {COLOR: -1, MIRROR_MASTER_ANGLE: true}]
		},
		{
			POSITION: [10, 0, 0, 0, 0, 360, 1],
			TYPE: ["dispersalAura"]
		}
	]
}

Class.dissimilitudeOfficialV1 = {
	PARENT: "genericDreadnought",
	LABEL: "Dissimilitude",
	UPGRADE_TOOLTIP: "Repulsion Aura",
	TURRETS: [
		{
			POSITION: [15, 0, 0, 0, 0, 360, 1],
			TYPE: ["hexagon", {COLOR: -1, MIRROR_MASTER_ANGLE: true}]
		},
		{
			POSITION: [10, 0, 0, 0, 0, 360, 1],
			TYPE: ["dissimilitudeAura"]
		}
	]
}
Class.similarityOfficialV1 = {
	PARENT: "genericDreadnought",
	LABEL: "Similarity",
	UPGRADE_TOOLTIP: "Attraction Aura",
	TURRETS: [
		{
			POSITION: [15, 0, 0, 0, 0, 360, 1],
			TYPE: ["hexagon", {COLOR: -1, MIRROR_MASTER_ANGLE: true}]
		},
		{
			POSITION: [10, 0, 0, 0, 0, 360, 1],
			TYPE: ["similarityAura"]
		}
	]
}
Class.snareOfficialV1 = {
	PARENT: "genericDreadnought",
	LABEL: "Snare",
	UPGRADE_TOOLTIP: "Attraction/Repulsion Aura",
	TURRETS: [
		{
			POSITION: [15, 0, 0, 0, 0, 360, 1],
			TYPE: ["hexagon", {COLOR: -1, MIRROR_MASTER_ANGLE: true}]
		},
		{
			POSITION: [10, 0, 0, 0, 0, 360, 1],
			TYPE: ["snareTurret"]
		}
	]
}

Class.propensityOfficialV1 = {
	PARENT: "genericDreadnought",
	LABEL: "Propensity",
	UPGRADE_TOOLTIP: "Aura Traps",
	TURRETS: [
		{
			POSITION: [15, 0, 0, 0, 0, 360, 1],
			TYPE: ["octahedron", {COLOR: 0, FACING_TYPE: ["spin", {speed: 0.02}]}]
		},
		{
			POSITION: [10, 0, 0, 0, 0, 360, 1],
			TYPE: ["propensityAura", {COLOR: -1}]
		}
	]
}

Class.turmoilOfficialV1 = {
	PARENT: "genericDreadnought",
	LABEL: "Turmoil",
	UPGRADE_TOOLTIP: "Attraction Aura Traps",
	TURRETS: [
		{
			POSITION: [15, 0, 0, 0, 0, 360, 1],
			TYPE: ["cube", {COLOR: "green", FACING_TYPE: ["spin", {speed: 0.02}]}]
		},
		{
			POSITION: [10, 0, 0, 0, 0, 360, 1],
			TYPE: ["turmoilBase", {COLOR: -1}]
		}
	]
}

Class.rippleOfficialV1 = {
	PARENT: "genericDreadnought",
	LABEL: "Ripple",
	UPGRADE_TOOLTIP: "Attraction Aura Bullets",
	TURRETS: [
		{
			POSITION: [15, 0, 0, 0, 0, 360, 1],
			TYPE: ["hexagon", {COLOR: -1, MIRROR_MASTER_ANGLE: true}]
		},
		{
			POSITION: [5, 0, 0, 0, 0, 360, 1],
			TYPE: ["disruptionProp", {COLOR: "green"}]
		},
		{
			POSITION: [12.5, 0, 0, 0, 0, 360, 1],
			TYPE: ["dodecahedron", {COLOR: -1, FACING_TYPE: ["spin", {speed: 0.02}]}]
		},
		{
			POSITION: [10, 0, 0, 0, 0, 360, 1],
			TYPE: ["dodecahedron", {COLOR: "green", FACING_TYPE: ["spin", {speed: 0.02}]}]
		}
	]
}

Class.omegaRayOfficialV1 = {
	PARENT: "genericDreadnought",
	LABEL: "Omega Ray",
	UPGRADE_TOOLTIP: "More Charge Gain",
	GUNS: [
        {
            POSITION: [18, 8, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic]),
                TYPE: 'bullet',
                IDENTIFIER: "laser",
                ALPHA: 0
            }
        },
		{
			POSITION: [25, 3, 1, 0, 0, 0, 0]
		},
		{
			POSITION: [10, 2, 0.01, 15, 7.5, 0, 0]
		},
		{
			POSITION: [10, 2, 0.01, 15, -7.5, 0, 0]
		},
		{
			POSITION: [4, 7, -1.2, 9, 0, 0, 0]
		},
		{
			POSITION: [2, 7, 2.5, 13, 0, 0, 0]
		}
	],
	TURRETS: [
		{
			POSITION: [10, 22, 0, 0, 360, 1],
			TYPE: ["genericTank", {COLOR: "#00ffff"}]
		},
		{
			POSITION: [10 * 3/4, 22, 0, 0, 360, 1],
			TYPE: ["genericTank", {COLOR: "#00ffff"}]
		},
		{
			POSITION: [10 * 2/4, 22, 0, 0, 360, 1],
			TYPE: ["genericTank", {COLOR: "#00ffff"}]
		},
		{
			POSITION: [10 * 1/4, 22, 0, 0, 360, 1],
			TYPE: ["genericTank", {COLOR: "#00ffff"}]
		}
	],
	ON: makeLaserON("(body.skill.raw[0] / 1.5) + 1")
}

Class.accretionDiskOfficialV1 = {
	PARENT: "genericDreadnought",
	LABEL: "Accretion Disk",
	UPGRADE_TOOLTIP: "More Charge Gain & 2 Turrets",
	GUNS: [
        {
            POSITION: [18, 8, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic]),
                TYPE: 'bullet',
                IDENTIFIER: "laser",
                ALPHA: 0
            }
        },
		{
			POSITION: [25, 3, 1, 0, 0, 0, 0]
		},
		{
			POSITION: [10, 2, 0.01, 15, 7.5, 0, 0]
		},
		{
			POSITION: [10, 2, 0.01, 15, -7.5, 0, 0]
		},
		{
			POSITION: [4, 7, -1.2, 9, 0, 0, 0]
		},
		{
			POSITION: [2, 7, 2.5, 13, 0, 0, 0]
		}
	],
	TURRETS: [
		{
			POSITION: [10, 22, 0, 0, 360, 1],
			TYPE: ["genericTank", {COLOR: "#00ffff"}]
		},
		{
			POSITION: [10 * 2/3, 22, 0, 0, 360, 1],
			TYPE: ["autoTankGun", {COLOR: "#00ffff"}]
		},
		{
			POSITION: [10 * 1/3, 22, 0, 0, 360, 1],
			TYPE: ["autoTankGun", {COLOR: "#00ffff", GUN_STAT_SCALE: {reload: Math.PI / 2.7}}]
		}
	],
	ON: makeLaserON("(body.skill.raw[0] / 6.5) + 1")
}

Class.electricShotgunOfficialV1 = {
	PARENT: "genericDreadnought",
	LABEL: "Electric Shotgun",
	UPGRADE_TOOLTIP: "Shotgun Lasers",
	GUNS: [
        {
            POSITION: [18, 8, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, {spray: 3, shudder: 3}]),
                TYPE: 'bullet',
                IDENTIFIER: "laser",
                ALPHA: 0
            }
        },
        {
            POSITION: [18, 7.5, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, {spray: 3, shudder: 3}]),
                TYPE: 'bullet',
                IDENTIFIER: "laser",
                ALPHA: 0
            }
        },
        {
            POSITION: [18, 7, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, {spray: 3, shudder: 3}]),
                TYPE: 'bullet',
                IDENTIFIER: "laser",
                ALPHA: 0
            }
        },
        {
            POSITION: [18, 6.5, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, {spray: 3, shudder: 3}]),
                TYPE: 'bullet',
                IDENTIFIER: "laser",
                ALPHA: 0
            }
        },
        {
            POSITION: [18, 6, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, {spray: 3, shudder: 3}]),
                TYPE: 'bullet',
                IDENTIFIER: "laser",
                ALPHA: 0
            }
        },
        {
            POSITION: [18, 5.5, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, {spray: 3, shudder: 3}]),
                TYPE: 'bullet',
                IDENTIFIER: "laser",
                ALPHA: 0
            }
        },
        {
            POSITION: [18, 5, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, {spray: 3, shudder: 3}]),
                TYPE: 'bullet',
                IDENTIFIER: "laser",
                ALPHA: 0
            }
        },
        {
            POSITION: [18, 4.5, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, {spray: 3, shudder: 3}]),
                TYPE: 'bullet',
                IDENTIFIER: "laser",
                ALPHA: 0
            }
        },
		{
			POSITION: [25, 3, 1, 0, 0, 0, 0]
		},
		{
			POSITION: [10, 2, 0.01, 16, 6, 7, 0]
		},
		{
			POSITION: [10, 2, 0.01, 16, -6, -7, 0]
		},
		{
			POSITION: [4, 7, -1.2, 9, 0, 0, 0]
		},
		{
			POSITION: [2, 7, 2.5, 13, 0, 0, 0]
		}
	],
	TURRETS: [
		{
			POSITION: [10, 22, 0, 0, 360, 1],
			TYPE: ["octagonOfficialV1", {COLOR: "#00ffff", FACING_TYPE: "spin"}]
		}
	],
	ON: makeLaserON()
}

Class.weberOfficialV1 = {
	PARENT: "genericDreadnought",
	LABEL: "Weber",
	UPGRADE_TOOLTIP: "More Charge Limit",
	GUNS: [
        {
            POSITION: [18, 8, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic]),
                TYPE: 'bullet',
                IDENTIFIER: "laser",
                ALPHA: 0
            }
        },
		{
			POSITION: [29, 3, 1, 0, 0, 0, 0]
		},
		{
			POSITION: [10, 2, 0.01, 15, 10.5, 0, 0]
		},
		{
			POSITION: [10, 2, 0.01, 15, -10.5, 0, 0]
		},
		{
			POSITION: [4, 7, -1.2, 9, 0, 0, 0]
		},
		{
			POSITION: [2, 7, 3, 13, 0, 0, 0]
		}
	],
	TURRETS: [
		{
			POSITION: [17, 27, 0, 0, 360, 1],
			TYPE: ["genericTank", {COLOR: "#00ffff"}]
		}
	],
	ON: makeLaserON("(body.skill.raw[0] / 10) + 1", "100 * (1 + (body.skill.raw[2] / 1.5))")
}

Class.siemensOfficialV1 = {
	PARENT: "genericDreadnought",
	LABEL: "Siemens",
	UPGRADE_TOOLTIP: "Pillbox Lasers",
	GUNS: [
        {
            POSITION: [18, 8, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap]),
                TYPE: 'unsetPillbox',
                IDENTIFIER: "laser",
                ALPHA: 0
            }
        },
		{
			POSITION: [29, 3, 1, 0, 0, 0, 0]
		},
		{
			POSITION: [10, 2, 0.01, 15, 9.5, 0, 0]
		},
		{
			POSITION: [10, 2, 0.01, 15, -9.5, 0, 0]
		},
		{
			POSITION: [4, 7, -1.2, 9, 0, 0, 0]
		},
		{
			POSITION: [2, 7, 2.8, 13, 0, 0, 0]
		}
	],
	TURRETS: [
		{
			POSITION: [15, 25, 0, 0, 360, 1],
			TYPE: ["unsetTrap", {COLOR: "#00ffff", FACING_TYPE: "spin"}]
		},
		{
			POSITION: [7.5, 25, 0, 0, 360, 1],
			TYPE: ["genericTank", {COLOR: "#00ffff"}]
		}
	],
	ON: makeLaserON("(body.skill.raw[0] / 10) + 1", "100 * (1 + (body.skill.raw[2] / 6))")
}

Class.henryOfficialV1 = {
	PARENT: "genericDreadnought",
	LABEL: "Henry",
	UPGRADE_TOOLTIP: "Minion Lasers",
	GUNS: [
        {
            POSITION: [18, 8, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap]),
                TYPE: 'tinyMinion',
                IDENTIFIER: "laser",
                ALPHA: 0
            }
        },
		{
			POSITION: [24, 3, 1, 0, 0, 0, 0]
		},
		{
			POSITION: [10, 2, 0.01, 15, 9.5, 0, 0]
		},
		{
			POSITION: [10, 2, 0.01, 15, -9.5, 0, 0]
		},
		{
			POSITION: [4, 7, -1.2, 9, 0, 0, 0]
		},
		{
			POSITION: [2, 7, 2.8, 13, 0, 0, 0]
		}
	],
	TURRETS: [
		{
			POSITION: [10, 23, 0, 0, 360, 1],
			TYPE: ["minion", {COLOR: "#00ffff", FACING_TYPE: "spin"}]
		}
	],
	ON: makeLaserON("(body.skill.raw[0] / 10) + 1", "100 * (1 + (body.skill.raw[2] / 6))")
}

Class.nonaLaserOfficialV1 = {
	PARENT: "genericDreadnought",
	LABEL: "Nona Laser",
	UPGRADE_TOOLTIP: "9 Lasers",
	GUNS: [
		...weaponArray([
    	    {
    	        POSITION: [18, 8, 1, 0 + 20, 0, 60, 0],
    	        PROPERTIES: {
    	            SHOOT_SETTINGS: combineStats([g.basic]),
    	            TYPE: 'bullet',
    	            IDENTIFIER: "laser",
    	            ALPHA: 0
    	        }
    	    },
			{
				POSITION: [25 + 20, 3, 1, 0, 0, 0, 0]
			},
			{
				POSITION: [10, 2, 0.01, 15 + 20, 7.5, 0, 0]
			},
			{
				POSITION: [10, 2, 0.01, 15 + 20, -7.5, 0, 0]
			},
			{
				POSITION: [2, 3, 2.8, 7 + 20, 0, 0, 0]
			},
			{
				POSITION: [4, 7, -1.2, 9 + 20, 0, 0, 0]
			},
			{
				POSITION: [2, 7, 2.5, 13 + 20, 0, 0, 0]
			}
		], 6),
		...weaponArray([
    	    {
    	        POSITION: [18, 8, 1, 0, 0, 0, 0],
    	        PROPERTIES: {
    	            SHOOT_SETTINGS: combineStats([g.basic]),
    	            TYPE: 'bullet',
    	            IDENTIFIER: "laser",
    	            ALPHA: 0
    	        }
    	    },
			{
				POSITION: [25, 3, 1, 0, 0, 0, 0]
			},
			{
				POSITION: [10, 2, 0.01, 15, 7.5, 0, 0]
			},
			{
				POSITION: [10, 2, 0.01, 15, -7.5, 0, 0]
			},
			{
				POSITION: [4, 7, -1.2, 9, 0, 0, 0]
			},
			{
				POSITION: [2, 7, 2.5, 13, 0, 0, 0]
			}
		], 3)
	],
	TURRETS: [
		...weaponArray(
			{
				POSITION: [10, 22, 0, 0, 360, 1],
				TYPE: ["genericTank", {COLOR: "#00ffff"}]
			}, 3
		),
		...weaponArray(
			{
				POSITION: [10, 22 + 20, 0, 0, 360, 1],
				TYPE: ["genericTank", {COLOR: "#00ffff"}]
			}, 6
		)
	],
	ON: makeLaserON("(body.skill.raw[0] / 10) + 1", "100 * (1 + (body.skill.raw[2] / 15))")
}

Class.pentaFoLaserOfficialV1 = {
	PARENT: "genericDreadnought",
	LABEL: "Penta Fo Laser",
	UPGRADE_TOOLTIP: "5 Focused Lasers",
	GUNS: [
        {
            POSITION: [18, 8, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic]),
                TYPE: 'bullet',
                IDENTIFIER: "laser",
                ALPHA: 0
            }
        },
        {
            POSITION: [18 + 12, 8, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic]),
                TYPE: 'bullet',
                IDENTIFIER: "laser",
                ALPHA: 0
            }
        },
        {
            POSITION: [18 + 24, 8, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic]),
                TYPE: 'bullet',
                IDENTIFIER: "laser",
                ALPHA: 0
            }
        },
        {
            POSITION: [18 + 36, 8, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic]),
                TYPE: 'bullet',
                IDENTIFIER: "laser",
                ALPHA: 0
            }
        },
        {
            POSITION: [18 + 48, 8, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic]),
                TYPE: 'bullet',
                IDENTIFIER: "laser",
                ALPHA: 0
            }
        },
		{
			POSITION: [65, 3, 1, 0, 0, 0, 0]
		},
		{
			POSITION: [40, 2, 0.01, 15, 7.5, 0, 0]
		},
		{
			POSITION: [40, 2, 0.01, 15, -7.5, 0, 0]
		},
		{
			POSITION: [4, 7, -1.2, 9, 0, 0, 0]
		},
		{
			POSITION: [2, 7, 2.5, 13, 0, 0, 0]
		}
	],
	TURRETS: [
		{
			POSITION: [10, 22, 0, 0, 360, 1],
			TYPE: ["genericTank", {COLOR: "#00ffff"}]
		},
		{
			POSITION: [10, 22 + 12, 0, 0, 360, 1],
			TYPE: ["genericTank", {COLOR: "#00ffff"}]
		},
		{
			POSITION: [10, 22 + 24, 0, 0, 360, 1],
			TYPE: ["genericTank", {COLOR: "#00ffff"}]
		},
		{
			POSITION: [10, 22 + 36, 0, 0, 360, 1],
			TYPE: ["genericTank", {COLOR: "#00ffff"}]
		},
		{
			POSITION: [10, 22 + 48, 0, 0, 360, 1],
			TYPE: ["genericTank", {COLOR: "#00ffff"}]
		},
	],
	ON: makeLaserON()
}

Class.megaExplosiveLaserBullet = {
	PARENT: "bullet",
	INDEPENDENT: true,
	GUNS: weaponArray(
		{
			POSITION: [0, 10, 0, 0, 0, 0, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic]),
				TYPE: ["bullet", {PERSISTS_AFTER_DEATH: true}],
				SHOOT_ON_DEATH: true
			}
		}, 9
	),
	TURRETS: [
		{
			POSITION: [10, 0, 0, 0, 0, 1],
			TYPE: ["nonagonOfficialV1", {COLOR: 16}]
		}
	]
}

Class.triMegaExploLaserOfficialV1 = {
	PARENT: "genericDreadnought",
	LABEL: "Tri MegaExplo Laser",
	UPGRADE_TOOLTIP: "3 Explosive Lasers",
	GUNS: weaponArray([
        {
            POSITION: [18, 8, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, {range: 0.5}]),
                TYPE: 'megaExplosiveLaserBullet',
                IDENTIFIER: "laser",
                ALPHA: 0
            }
        },
		{
			POSITION: [25, 3, 1, 0, 0, 0, 0]
		},
		{
			POSITION: [10, 2, 0.01, 15, 7.5, 0, 0]
		},
		{
			POSITION: [10, 2, 0.01, 15, -7.5, 0, 0]
		},
		{
			POSITION: [4, 7, -1.2, 9, 0, 0, 0]
		},
		{
			POSITION: [2, 7, 2.5, 13, 0, 0, 0]
		}
	], 3),
	TURRETS: weaponArray(
		{
			POSITION: [10, 22, 0, 0, 360, 1],
			TYPE: ["genericTank", {COLOR: "#ff0000"}]
		}, 3
	),
	ON: makeLaserON()
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

Class.graveyard = makeMenu("Graveyard", {
	upgrades: [
		"lancerOfficialV1",
		"thrusterOfficialV1"
	],
	tooltip: "Upgrades that were scrapped for many reasons, either being too powerful or too hard to balance or just miscellaneous reasons."
})

Class.menu_addons.UPGRADES_TIER_0.push("dreadOfficialV1", "graveyard");
	Class.dreadOfficialV1[`UPGRADES_TIER_${tier1}`] = ["swordOfficialV1", "pacifierOfficialV1", "invaderOfficialV1", "centaurOfficialV1", "laserOfficialV1"];
		Class.swordOfficialV1.UPGRADES_TIER_M1 = ["sabreOfficialV1", "gladiusOfficialV1", "tarnisherOfficialV1"];
			Class.sabreOfficialV1.UPGRADES_TIER_M1 = ["lanceOfficialV1", "screwOfficialV1", "carbineOfficialV1"]
			Class.gladiusOfficialV1.UPGRADES_TIER_M1 = ["warriorOfficialV1", "duelistOfficialV1", "toeOfficialV1"]
			Class.tarnisherOfficialV1.UPGRADES_TIER_M1 = ["raptureOfficialV1", "demomanOfficialV1", "rummagerOfficialV1"]
		Class.pacifierOfficialV1.UPGRADES_TIER_M1 = ["appeaserOfficialV1", "peacekeeperOfficialV1", "diplomatOfficialV1"];
			Class.appeaserOfficialV1.UPGRADES_TIER_M1 = ["ravagerOfficialV1", "dopamineOfficialV1", "successorOfficialV1"]
			Class.peacekeeperOfficialV1.UPGRADES_TIER_M1 = ["conciliatorOfficialV1", "statespersonOfficialV1", "saviorOfficialV1"]
			Class.diplomatOfficialV1.UPGRADES_TIER_M1 = ["presidentOfficialV1", "moderatorOfficialV1", "personelOfficialV1"]
		Class.invaderOfficialV1.UPGRADES_TIER_M1 = ["inquisitorOfficialV1", "assailantOfficialV1", "infiltratorOfficialV1"];
			Class.inquisitorOfficialV1.UPGRADES_TIER_M1 = ["proberOfficialV1", "dictatorOfficialV1", "fatassOfficialV1"];
			Class.assailantOfficialV1.UPGRADES_TIER_M1 = ["attackerOfficialV1", "defenderOfficialV1", "coallesceOfficialV1"];
			Class.infiltratorOfficialV1.UPGRADES_TIER_M1 = ["thiefOfficialV1", "banditOfficialV1", "pirateOfficialV1"]
		Class.centaurOfficialV1.UPGRADES_TIER_M1 = ["cerberusOfficialV1", "minotaurOfficialV1", "sirenOfficialV1"];
			Class.cerberusOfficialV1.UPGRADES_TIER_M1 = ["ogreOfficialV1", "hadesOfficialV1", "hellhoundOfficialV1"];
			Class.minotaurOfficialV1.UPGRADES_TIER_M1 = ["hecatoncheiresOfficialV1", "cyclopsOfficialV1", "mermaidOfficialV1"];
			Class.sirenOfficialV1.UPGRADES_TIER_M1 = ["policerOfficialV1", "alarmOfficialV1", "clockOfficialV1"];
		Class.automationOfficialV1.UPGRADES_TIER_M1 = ["mechanismOfficialV1", "clockworkOfficialV1", "megabyteOfficialV1"];
			Class.mechanismOfficialV1.UPGRADES_TIER_M1 = ["robotOfficialV1", "boatOfficialV1", "apparatusOfficialV1"];
			Class.clockworkOfficialV1.UPGRADES_TIER_M1 = ["structureOfficialV1", "doohickeyOfficialV1", "thingamajigOfficialV1"];
			Class.megabyteOfficialV1.UPGRADES_TIER_M1 = ["gigabyteOfficialV1", "mebibyteOfficialV1", "binaryOfficialV1"]
		Class.juggernautOfficialV1.UPGRADES_TIER_M1 = ["behemothOfficialV1", "sawbladeOfficialV1", "speedsterOfficialV1"];
			Class.behemothOfficialV1.UPGRADES_TIER_M1 = ["titanOfficialV1", "beefyOfficialV1", "beastOfficialV1"];
			Class.sawbladeOfficialV1.UPGRADES_TIER_M1 = ["chainsawOfficialV1", "buzzsawOfficialV1", "switchbladeOfficialV1"];
			Class.speedsterOfficialV1.UPGRADES_TIER_M1 = ["lightningOfficialV1", "carOfficialV1", "cogwheelOfficialV1"];
		Class.medicareOfficialV1.UPGRADES_TIER_M1 = ["medicaidOfficialV1", "tricareOfficialV1", "megacareOfficialV1"];
			Class.medicaidOfficialV1.UPGRADES_TIER_M1 = ["refugeOfficialV1", "menderOfficialV1", "reanimatorOfficialV1"];
			Class.tricareOfficialV1.UPGRADES_TIER_M1 = ["hexacareOfficialV1", "drocareOfficialV1", "trapcareOfficialV1"];
			Class.megacareOfficialV1.UPGRADES_TIER_M1 = ["ultracareOfficialV1", "hospitalOfficialV1", "pharmacyOfficialV1"];
		Class.radiationOfficialV1.UPGRADES_TIER_M1 = ["uraniumOfficialV1", "divergenceOfficialV1", "upheavalOfficialV1"];
			Class.uraniumOfficialV1.UPGRADES_TIER_M1 = ["thoriumOfficialV1", "chernobylOfficialV1", "emmissionOfficialV1"];
			Class.divergenceOfficialV1.UPGRADES_TIER_M1 = ["discrepancyOfficialV1", "conformityOfficialV1", "magnetOfficialV1"];
			Class.upheavalOfficialV1.UPGRADES_TIER_M1 = ["dispositionOfficialV1", "cataclysmOfficialV1", "disruptionOfficialV1"];
		Class.lancerOfficialV1.UPGRADES_TIER_M1 = ["javelinOfficialV1", "axeOfficialV1", "spearOfficialV1"];
			Class.javelinOfficialV1.UPGRADES_TIER_M1 = ["harpoonOfficialV1", "scytheOfficialV1"];
		Class.thrusterOfficialV1.UPGRADES_TIER_M1 = ["runnerOfficialV1", "vehicleOfficialV1", "placeholderOfficialV1"];
			Class.runnerOfficialV1.UPGRADES_TIER_M1 = ["placeholderOfficialV1", "placeholderOfficialV1", "placeholderOfficialV1"];
		Class.laserOfficialV1.UPGRADES_TIER_M1 = ["blasterOfficialV1", "voltageOfficialV1", "triLaserOfficialV1"];
			Class.blasterOfficialV1.UPGRADES_TIER_M1 = ["gammaRayOfficialV1", "beamOfficialV1", "electricRifleOfficialV1"];
			Class.voltageOfficialV1.UPGRADES_TIER_M1 = ["teslaOfficialV1", "ohmOfficialV1", "coulombOfficialV1"];
			Class.triLaserOfficialV1.UPGRADES_TIER_M1 = ["hexaLaserOfficialV1", "triFoLaserOfficialV1", "triExploLaserOfficialV1"]

if (legsrace) {
	Class.lanceOfficialV1.UPGRADES_TIER_M1 = ["bayonetOfficialV1"]
	Class.screwOfficialV1.UPGRADES_TIER_M1 = ["wrenchOfficialV1"]
	Class.carbineOfficialV1.UPGRADES_TIER_M1 = ["altarOfficialV1"]
	Class.warriorOfficialV1.UPGRADES_TIER_M1 = ["archerOfficialV1"]
	Class.duelistOfficialV1.UPGRADES_TIER_M1 = ["championOfficialV1"]
	Class.toeOfficialV1.UPGRADES_TIER_M1 = ["palmOfficialV1"]
	Class.raptureOfficialV1.UPGRADES_TIER_M1 = ["uplifterOfficialV1"]
	Class.demomanOfficialV1.UPGRADES_TIER_M1 = ["bomberOfficialV1"]
	Class.rummagerOfficialV1.UPGRADES_TIER_M1 = ["nailOfficialV1"]
	Class.ravagerOfficialV1.UPGRADES_TIER_M1 = ["pillagerOfficialV1"]
	Class.dopamineOfficialV1.UPGRADES_TIER_M1 = ["methamphetamineOfficialV1"]
	Class.successorOfficialV1.UPGRADES_TIER_M1 = ["rimfireOfficialV1"]
	Class.conciliatorOfficialV1.UPGRADES_TIER_M1 = ["retardantOfficialV1"]
	Class.statespersonOfficialV1.UPGRADES_TIER_M1 = ["spokespersonOfficialV1"]
	Class.saviorOfficialV1.UPGRADES_TIER_M1 = ["rescuerOfficialV1"]
	Class.presidentOfficialV1.UPGRADES_TIER_M1 = ["politicianOfficialV1"]
	Class.moderatorOfficialV1.UPGRADES_TIER_M1 = ["agentOfficialV1"]
	Class.personelOfficialV1.UPGRADES_TIER_M1 = ["officerOfficialV1"]
	Class.proberOfficialV1.UPGRADES_TIER_M1 = ["multimeterOfficialV1"]
	Class.dictatorOfficialV1.UPGRADES_TIER_M1 = ["despotOfficialV1"]
	Class.fatassOfficialV1.UPGRADES_TIER_M1 = ["caseohOfficialV1"]
	Class.attackerOfficialV1.UPGRADES_TIER_M1 = ["antagonistOfficialV1"]
	Class.defenderOfficialV1.UPGRADES_TIER_M1 = ["advocateOfficialV1"]
	Class.coallesceOfficialV1.UPGRADES_TIER_M1 = ["systemistOfficialV1"]
	Class.thiefOfficialV1.UPGRADES_TIER_M1 = ["robberOfficialV1"]
	Class.banditOfficialV1.UPGRADES_TIER_M1 = ["hooliganOfficialV1"]
	Class.pirateOfficialV1.UPGRADES_TIER_M1 = ["landlubberOfficialV1"]
	Class.ogreOfficialV1.UPGRADES_TIER_M1 = ["shrekOfficialV1"]
	Class.hadesOfficialV1.UPGRADES_TIER_M1 = ["thanatosOfficialV1"]
	Class.hellhoundOfficialV1.UPGRADES_TIER_M1 = ["thugOfficialV1"]
	Class.hecatoncheiresOfficialV1.UPGRADES_TIER_M1 = ["hulkOfficialV1"]
	Class.cyclopsOfficialV1.UPGRADES_TIER_M1 = ["gargantuaOfficialV1"]
	Class.mermaidOfficialV1.UPGRADES_TIER_M1 = ["fairyOfficialV1"]
	Class.policerOfficialV1.UPGRADES_TIER_M1 = ["sheriffOfficialV1"]
	Class.alarmOfficialV1.UPGRADES_TIER_M1 = ["scareOfficialV1"]
	Class.clockOfficialV1.UPGRADES_TIER_M1 = ["tickOfficialV1"]
	Class.robotOfficialV1.UPGRADES_TIER_M1 = ["aiOfficialV1"]
	Class.boatOfficialV1.UPGRADES_TIER_M1 = ["cruiseOfficialV1"]
	Class.apparatusOfficialV1.UPGRADES_TIER_M1 = ["gizmoOfficialV1"]
	Class.structureOfficialV1.UPGRADES_TIER_M1 = ["cyborgOfficialV1"];
	Class.doohickeyOfficialV1.UPGRADES_TIER_M1 = ["dobleydooOfficialV1"];
	Class.thingamajigOfficialV1.UPGRADES_TIER_M1 = ["doodadOfficialV1"];
	Class.gigabyteOfficialV1.UPGRADES_TIER_M1 = ["terabyteOfficialV1"]
	Class.mebibyteOfficialV1.UPGRADES_TIER_M1 = ["gibibyteOfficialV1"]
	Class.binaryOfficialV1.UPGRADES_TIER_M1 = ["ternaryOfficialV1"]
	Class.titanOfficialV1.UPGRADES_TIER_M1 = ["giantOfficialV1"];
	Class.beefyOfficialV1.UPGRADES_TIER_M1 = ["cowOfficialV1"];
	Class.beastOfficialV1.UPGRADES_TIER_M1 = ["monsterOfficialV1"];
	Class.chainsawOfficialV1.UPGRADES_TIER_M1 = ["cutlassOfficialV1"];
	Class.buzzsawOfficialV1.UPGRADES_TIER_M1 = ["cutterOfficialV1"];
	Class.switchbladeOfficialV1.UPGRADES_TIER_M1 = ["styletOfficialV1"];
	Class.lightningOfficialV1.UPGRADES_TIER_M1 = ["usainOfficialV1"];
	Class.carOfficialV1.UPGRADES_TIER_M1 = ["ferrariOfficialV1"];
	Class.cogwheelOfficialV1.UPGRADES_TIER_M1 = ["gearOfficialV1"];
	Class.refugeOfficialV1.UPGRADES_TIER_M1 = ["havenOfficialV1"];
	Class.menderOfficialV1.UPGRADES_TIER_M1 = ["repairmentOfficialV1"];
	Class.reanimatorOfficialV1.UPGRADES_TIER_M1 = ["recoveryOfficialV1"];
	Class.hexacareOfficialV1.UPGRADES_TIER_M1 = ["heptacareOfficialV1"];
	Class.drocareOfficialV1.UPGRADES_TIER_M1 = ["inquisicareOfficialV1"];
	Class.trapcareOfficialV1.UPGRADES_TIER_M1 = ["inkOfficialV1"];
	Class.ultracareOfficialV1.UPGRADES_TIER_M1 = ["teracareOfficialV1"];
	Class.hospitalOfficialV1.UPGRADES_TIER_M1 = ["clinicOfficialV1"];
	Class.pharmacyOfficialV1.UPGRADES_TIER_M1 = ["apothecaryOfficialV1"];
	Class.thoriumOfficialV1.UPGRADES_TIER_M1 = ["radiumOfficialV1"];
	Class.chernobylOfficialV1.UPGRADES_TIER_M1 = ["hiroshimaOfficialV1"];
	Class.emmissionOfficialV1.UPGRADES_TIER_M1 = ["dispersalOfficialV1"];
	Class.discrepancyOfficialV1.UPGRADES_TIER_M1 = ["dissimilitudeOfficialV1"];
	Class.conformityOfficialV1.UPGRADES_TIER_M1 = ["similarityOfficialV1"];
	Class.magnetOfficialV1.UPGRADES_TIER_M1 = ["snareOfficialV1"];
	Class.dispositionOfficialV1.UPGRADES_TIER_M1 = ["propensityOfficialV1"];
	Class.cataclysmOfficialV1.UPGRADES_TIER_M1 = ["turmoilOfficialV1"];
	Class.disruptionOfficialV1.UPGRADES_TIER_M1 = ["rippleOfficialV1"];
	Class.gammaRayOfficialV1.UPGRADES_TIER_M1 = ["omegaRayOfficialV1"];
	Class.beamOfficialV1.UPGRADES_TIER_M1 = ["accretionDiskOfficialV1"];
	Class.electricRifleOfficialV1.UPGRADES_TIER_M1 = ["electricShotgunOfficialV1"];
	Class.teslaOfficialV1.UPGRADES_TIER_M1 = ["weberOfficialV1"];
	Class.ohmOfficialV1.UPGRADES_TIER_M1 = ["siemensOfficialV1"];
	Class.coulombOfficialV1.UPGRADES_TIER_M1 = ["henryOfficialV1"];
	Class.hexaLaserOfficialV1.UPGRADES_TIER_M1 = ["nonaLaserOfficialV1"];
	Class.triFoLaserOfficialV1.UPGRADES_TIER_M1 = ["pentaFoLaserOfficialV1"];
	Class.triExploLaserOfficialV1.UPGRADES_TIER_M1 = ["triMegaExploLaserOfficialV1"];
}
const t1Bodies = [ "swordOfficialV1", "pacifierOfficialV1", "invaderOfficialV1", "centaurOfficialV1", "medicareOfficialV1", "automationOfficialV1", "juggernautOfficialV1", "radiationOfficialV1" ];
if (!enableHealers) {
	t1Bodies.splice(4, 1); // Remove Medicare if healers are disabled
}

var x = 0

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
		SIZE = 22.5,
		GUN_STAT_SCALE = {},
		INVISIBLE = null,
		CONTROLLERS = [],
		ALPHA = 1,
		IGNORED_BY_AI = false;
		ON = [];

	// Label it
	if (dread1.LABEL == dread2.LABEL) LABEL = dread1.LABEL + " II";
	if (dread1.UPGRADE_TOOLTIP == dread2.UPGRADE_TOOLTIP) UPGRADE_TOOLTIP = dread1.UPGRADE_TOOLTIP;

	// Guns
	if (dread1.GUNS) GUNS.push(...dread1.GUNS);
	for (let g in dread2.GUNS) {
		let POSITION = JSON.parse(JSON.stringify(dread2.GUNS[g].POSITION)),
			PROPERTIES = dread2.GUNS[g].PROPERTIES;
		if (!dread2.IS_THRUSTER_DREAD) POSITION[5] += 60;
		GUNS.push({ POSITION, PROPERTIES });
	}

	GUNS = JSON.parse(JSON.stringify(GUNS));

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

	// ON
	
	if (dread1.ON != null) {
		ON = dread1.ON
	}

	// Invisibility

	if (dread2.INVISIBLE != null) {
		INVISIBLE = dread2.INVISIBLE
	}
	if (dread1.INVISIBLE != null) {
		INVISIBLE = dread1.INVISIBLE
	}

	// Alpha

	if (dread2.ALPHA != null) {
		ALPHA = dread2.ALPHA
	}
	if (dread1.ALPHA != null) {
		ALPHA = dread1.ALPHA
	}

	// AI targetability

	if (dread2.IGNORED_BY_AI != null) {
		IGNORED_BY_AI = dread2.IGNORED_BY_AI
	}
	if (dread1.IGNORED_BY_AI != null) {
		IGNORED_BY_AI = dread1.IGNORED_BY_AI
	}

	// Size

	if (dread2.SIZE != null) {
		SIZE = dread2.SIZE
	}
	if (dread1.SIZE != null) {
		SIZE = dread1.SIZE
	}

	// Controllers

	if (dread2.CONTROLLERS != null) {
		CONTROLLERS = dread2.CONTROLLERS
	}
	if (dread1.CONTROLLERS != null) {
		CONTROLLERS = dread1.CONTROLLERS
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

	// Check if dread2 is Cogwheel or Gear

	if (dread2 == Class.cogwheelOfficialV1) {
		for (let gun of GUNS) {
			if (!gun.PROPERTIES?.SHOOT_SETTINGS) continue
			gun.PROPERTIES.SHOOT_SETTINGS = combineStats([gun.PROPERTIES.SHOOT_SETTINGS, {speed: 1.3}]);
		}
	}
	if (dread2 == Class.gearOfficialV1) {
		for (let gun of GUNS) {
			if (!gun.PROPERTIES?.SHOOT_SETTINGS) continue
			gun.PROPERTIES.SHOOT_SETTINGS = combineStats([gun.PROPERTIES.SHOOT_SETTINGS, {speed: 1.6}]);
		}
	}

	// Check if dread2 is Switchblade or Stylet

	if (dread2 == Class.switchbladeOfficialV1) {
		for (let gun of GUNS) {
			if (!gun.PROPERTIES?.SHOOT_SETTINGS) continue
			gun.PROPERTIES.SHOOT_SETTINGS = combineStats([gun.PROPERTIES.SHOOT_SETTINGS, {damage: 1.3}]);
		}
	}
	if (dread2 == Class.styletOfficialV1) {
		for (let gun of GUNS) {
			if (!gun.PROPERTIES?.SHOOT_SETTINGS) continue
			gun.PROPERTIES.SHOOT_SETTINGS = combineStats([gun.PROPERTIES.SHOOT_SETTINGS, {damage: 1.6}]);
		}
	}

	// Check if dread2 is Beast or Monster

	if (dread2 == Class.beastOfficialV1) {
		for (let gun of GUNS) {
			if (!gun.PROPERTIES?.SHOOT_SETTINGS) continue
			gun.PROPERTIES.SHOOT_SETTINGS = combineStats([gun.PROPERTIES.SHOOT_SETTINGS, {health: 1.6}]);
		}
	}
	if (dread2 == Class.monsterOfficialV1) {
		for (let gun of GUNS) {
			if (!gun.PROPERTIES?.SHOOT_SETTINGS) continue
			gun.PROPERTIES.SHOOT_SETTINGS = combineStats([gun.PROPERTIES.SHOOT_SETTINGS, {health: 2.3}]);
		}
	}

	// Check if dread2 is Disruption or Ripple

	if (dread2 == Class.disruptionOfficialV1) {
		for (let gun of GUNS) {
			if (!gun.PROPERTIES?.SHOOT_SETTINGS) continue
			if (!gun.PROPERTIES?.TYPE) continue
			gun.PROPERTIES.SHOOT_SETTINGS = combineStats([gun.PROPERTIES.SHOOT_SETTINGS, {reload: 1.9, damage: 0.1, health: 1.2, speed: 0.8}]);
			let isArr = Array.isArray(gun.PROPERTIES.TYPE) 
			let projectile = dereference(gun.PROPERTIES.TYPE)
			let name = "aura" + (Array.isArray(gun.PROPERTIES.TYPE) ? gun.PROPERTIES.TYPE[0] : gun.PROPERTIES.TYPE)
			Class[name] = {
                PARENT: projectile,
				TURRETS: [
					{
						POSITION: [10, 0, 0, 0, 0, 1],
						TYPE: "disruptionAura"
					}
				]
			}
			let turret = {
				POSITION: [10, 0, 0, 0, 0, 1],
				TYPE: "disruptionAura"
			}
    		if (gun.PROPERTIES.TYPE.TURRETS != null) {
    		    Class[name].TURRETS = [gun.PROPERTIES.TYPE.TURRETS, turret];
    		}
            gun.PROPERTIES.TYPE = Class[name]
		}
	}

	if (dread2 == Class.rippleOfficialV1) {
		for (let gun of GUNS) {
			if (!gun.PROPERTIES?.SHOOT_SETTINGS) continue
			if (!gun.PROPERTIES?.TYPE) continue
			gun.PROPERTIES.SHOOT_SETTINGS = combineStats([gun.PROPERTIES.SHOOT_SETTINGS, {reload: 1.9, damage: 0.1, health: 1.2, speed: 0.8}]);
			let isArr = Array.isArray(gun.PROPERTIES.TYPE) 
			let projectile = dereference(gun.PROPERTIES.TYPE)
			let name = "repAura" + (Array.isArray(gun.PROPERTIES.TYPE) ? gun.PROPERTIES.TYPE[0] : gun.PROPERTIES.TYPE)
			Class[name] = {
                PARENT: projectile,
				TURRETS: [
					{
						POSITION: [10, 0, 0, 0, 0, 1],
						TYPE: "rippleAura"
					}
				]
			}
			let turret = {
				POSITION: [10, 0, 0, 0, 0, 1],
				TYPE: "rippleAura"
			}
    		if (gun.PROPERTIES.TYPE.TURRETS != null) {
    		    Class[name].TURRETS = [gun.PROPERTIES.TYPE.TURRETS, turret];
    		}
            gun.PROPERTIES.TYPE = Class[name]
		}
	}

	// Definition name
	let definitionName = dread1Name + dread2Name;

	// Save definition to Class
	Class[definitionName] = {
		PARENT: "genericDreadnought",
		BODY, SIZE, INVISIBLE, ALPHA, IGNORED_BY_AI, CONTROLLERS, LABEL, UPGRADE_TOOLTIP, GUNS, TURRETS, ON
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
for (let branch1 of Class.dreadOfficialV1[`UPGRADES_TIER_${tier1}`]) {
	for (let branch2 of t1Bodies) {
		mergeDreads(branch1, branch2, branch1, 1);
	}
}