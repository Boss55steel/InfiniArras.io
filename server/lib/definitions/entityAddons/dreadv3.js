const { combineStats: _combineStats, makeAuto } = require('../facilitators.js');
const _constants = require('../constants.js');
const { smshskl, base } = _constants;
const g = require('../gunvals.js');
const combineStats = (stats) => _combineStats(stats.filter(s => s != null));
const gunCalcNames = _constants.gunCalcNames || _constants.GunCalcNames || _constants.statCalcNames || {};
if (!gunCalcNames.thruster)  gunCalcNames.thruster  = gunCalcNames.sustained || 'sustained';
if (!gunCalcNames.sustained) gunCalcNames.sustained = 'sustained';
if (!gunCalcNames.drone)     gunCalcNames.drone      = 'drone';
if (!gunCalcNames.swarm)     gunCalcNames.swarm      = 'swarm';
if (!gunCalcNames.trap)      gunCalcNames.trap       = 'trap';
const ensureIsClass = (Class, str) => {
    if ("object" == typeof str) {
        return str;
    }
    if (str in Class) {
        return Class[str];
    }
    throw Error(`Definition ${str} is attempted to be gotten but does not exist!`);
};
const eggnoughtBody = {
    SPEED: base.SPEED * 0.8,
    HEALTH: base.HEALTH * 1.75,
	SHIELD: base.SHIELD * 1.5,
	REGEN: base.REGEN * 1.5,
    FOV: base.FOV,
	RESIST: base.RESIST,
	DENSITY: base.DENSITY * 1.5,
};
const squarenoughtBody = {
    SPEED: base.SPEED * 0.675,
    HEALTH: base.HEALTH * 2.5,
	SHIELD: base.SHIELD * 2,
	REGEN: base.REGEN * 2,
    FOV: base.FOV * 0.95,
	RESIST: base.RESIST,
	DENSITY: base.DENSITY * 2,
};
const trinoughtBody = {
    SPEED: base.SPEED * 0.55,
    HEALTH: base.HEALTH * 3.5,
	SHIELD: base.SHIELD * 2.5,
	REGEN: base.REGEN * 2.5,
    FOV: base.FOV * 0.95,
	RESIST: base.RESIST,
	DENSITY: base.DENSITY * 2.5,
};
const pentanoughtBody = {
    SPEED: base.SPEED * 0.425,
    HEALTH: base.HEALTH * 4.25,
	SHIELD: base.SHIELD * 3,
	REGEN: base.REGEN * 3,
    FOV: base.FOV * 0.95,
	RESIST: base.RESIST,
	DENSITY: base.DENSITY * 3,
};
const hexnoughtBody = {
    SPEED: base.SPEED * 0.3,
    HEALTH: base.HEALTH * 5,
	SHIELD: base.SHIELD * 3.5,
	REGEN: base.REGEN * 3.5,
    FOV: base.FOV * 0.95,
	RESIST: base.RESIST,
	DENSITY: base.DENSITY * 3.5,
};

module.exports = ({ Class }) => {
	// Comment out the line below to enable this addon, uncomment it to disable this addon (WARNING: Increases load time by approximately 3x).
	//return console.log('--- Snowdreads addon [snowdreads.js] is disabled. ---');

	// Set the below variable to true to enable hex dreadnought building (WARNING: increases load time by approximately 10x)
	const buildHexnoughts = true;
	
	// For hexnought merging
	const hexnoughtScaleFactor = 0.9;

	// Missing stats
	g.flame = {reload: 0.5, recoil: 0.1, shudder: 1.5, range: 0.5, spray: 7, damage: 2, health: 1/3, speed: 0.6, maxSpeed: 0.3};
	g.honcho = {size: 2, damage: 2.5, health: 1.2, reload: 2, speed: 0.7};
	if (!g.aura) g.aura = {reload: 60, recoil: 0, shudder: 0, size: 8, damage: 1, speed: 0, maxSpeed: 0, range: 1.5, spray: 0, health: 9999};
	if (!Class.auraBase) Class.auraBase = {
		PARENT: ["genericTank"],
		INDEPENDENT: true,
		CONTROLLERS: [["spin", {speed: 0.018}]],
		BODY: { DAMAGE: 0.5, PENETRATION: 1e9, RANGE: 300, SPEED: 0, HEALTH: 1e9, RESIST: 1e9 },
		SHAPE: 0,
		COLOR: 0,
		ALPHA: 0.4,
		LAYER: 30,
		DRAW_FILL: true,
		BORDER_FIRST: true,
		LABEL: "",
	};

	// Body helpers
	const hpBuffBodyStats = [
		{ HEALTH: 2.4, SHIELD: 2.4, REGEN: 2,   SPEED: 0.65 },
		{ HEALTH: 3.2, SHIELD: 3.2, REGEN: 2.5, SPEED: 0.5  },
		{ HEALTH: 4,   SHIELD: 4,   REGEN: 2.5, SPEED: 0.4  },
	];
	const speedBuffBodyStats = [
		{ SPEED: 1.75, HEALTH: 0.65 },
		{ SPEED: 2.15, HEALTH: 0.5  },
		{ SPEED: 2.35, HEALTH: 0.35 },
	];
	const sizeBuffBodyStats = [
		{ SPEED: 0.9,  HEALTH: 2.4 },
		{ SPEED: 0.85, HEALTH: 3.2 },
		{ SPEED: 0.8,  HEALTH: 3.7 },
	];

	// Snowdread Building Functions --------------
	// Guns
	function addSniper({length = 18, width = 8, aspect = 1, x = 0, y = 0, angle = 0, delay = 0}, brightShift = 6, stats = [g.sniper]) {
		let output = [
			{ // Main barrel
				POSITION: [length, width, 1, x, y, angle, delay],
				PROPERTIES: {
					SHOOT_SETTINGS: combineStats(stats),
					TYPE: "bullet",
					COLOR: { BASE: -1, BRIGHTNESS_SHIFT: brightShift - 20, SATURATION_SHIFT: 0.5 }
				},
			}, {
				POSITION: [length - 3.2, width * 0.8, -0.65, x, y, angle, delay],
				PROPERTIES: {
					SHOOT_SETTINGS: combineStats([...stats, g.fake]),
					TYPE: "bullet",
					COLOR: { BASE: -1, BRIGHTNESS_SHIFT: brightShift - 10 },
					BORDERLESS: true,
				},
			}, {
				POSITION: [length - 1.5, width * 0.6, -0.65, x, y, angle, delay],
				PROPERTIES: {
					SHOOT_SETTINGS: combineStats([...stats, g.fake]),
					TYPE: "bullet",
					COLOR: { BASE: -1, BRIGHTNESS_SHIFT: brightShift - 25, SATURATION_SHIFT: 0.5 },
					BORDERLESS: true,
				},
			},
		];
		for (let i = 0; i < 2; i++) {
			output.push(
				{
					POSITION: [0.6, width * 0.7, -0.9, x + length - 2 - i * 2.5, y, angle, delay],
					PROPERTIES: {
						SHOOT_SETTINGS: combineStats([...stats, g.fake]),
						TYPE: "bullet",
						COLOR: { BASE: -1, BRIGHTNESS_SHIFT: brightShift - 32.5, SATURATION_SHIFT: 0.5 },
					},
				},
			)
		}
		return output;
	}
	function addAssassin({length = 18, width = 8, aspect = 1, x = 0, y = 0, angle = 0, delay = 0}, brightShift = 6, stats = [g.sniper]) {
		return [
			{
				POSITION: [(length - x) * 0.6, width, -1.6, x, y, angle, delay],
				PROPERTIES: {
					SHOOT_SETTINGS: combineStats([...stats, g.fake]),
					TYPE: "bullet",
					COLOR: { BASE: 17, BRIGHTNESS_SHIFT: brightShift },
				},
			},
			...addSniper({length, width, aspect, x: 0, y, angle, delay}, brightShift, stats),
			{
				POSITION: [5, width, -1.6, x, y, angle, 0],
				PROPERTIES: { COLOR: { BASE: -1, BRIGHTNESS_SHIFT: brightShift - 20, SATURATION_SHIFT: 0.5 } },
			}, {
				POSITION: [5, width - 1.5, -1.6, x - 1.5, y, angle, 0],
				PROPERTIES: { COLOR: { BASE: 17, BRIGHTNESS_SHIFT: brightShift + 10 } },
			},
		];
	}
	function addRifle({length = 18, width = 8, aspect = 1, x = 0, y = 0, angle = 0, delay = 0}, brightShift = 6, stats = [g.sniper], isMusket = false) {
		if (isMusket) {
			return [
				{
					POSITION: [length - 1, 1, aspect, x, y + width + 1, angle, 0],
					PROPERTIES: {COLOR: { BASE: -1, BRIGHTNESS_SHIFT: brightShift - 22.5, SATURATION_SHIFT: 0.5 },}
				}, {
					POSITION: [length - 1, 1, aspect, x, y - width - 1, angle, 0],
					PROPERTIES: {COLOR: { BASE: -1, BRIGHTNESS_SHIFT: brightShift - 22.5, SATURATION_SHIFT: 0.5 },}
				}, {
					POSITION: [4.5, width + 4, 0, x + length - 8, y + (width + 1) / 2, angle, delay],
					PROPERTIES: {
						SHOOT_SETTINGS: combineStats([...stats, g.fake]),
						TYPE: "bullet",
						COLOR: { BASE: 17, BRIGHTNESS_SHIFT: brightShift + 10 },
					}
				}, {
					POSITION: [4.5, width + 4, 0, x + length - 12, y + (width + 1) / 2, angle, delay],
					PROPERTIES: {
						SHOOT_SETTINGS: combineStats([...stats, g.fake]),
						TYPE: "bullet",
						COLOR: { BASE: 17, BRIGHTNESS_SHIFT: brightShift + 10 },
					}
				}, {
					POSITION: [4.5, width + 4, 0, x + length - 8, y - (width + 1) / 2, angle, delay + 0.5],
					PROPERTIES: {
						SHOOT_SETTINGS: combineStats([...stats, g.fake]),
						TYPE: "bullet",
						COLOR: { BASE: 17, BRIGHTNESS_SHIFT: brightShift + 10 },
					}
				}, {
					POSITION: [4.5, width + 4, 0, x + length - 12, y - (width + 1) / 2, angle, delay + 0.5],
					PROPERTIES: {
						SHOOT_SETTINGS: combineStats([...stats, g.fake]),
						TYPE: "bullet",
						COLOR: { BASE: 17, BRIGHTNESS_SHIFT: brightShift + 10 },
					}
				}, {
					POSITION: [length, width, aspect, x, y + (width + 1) / 2, angle, delay],
					PROPERTIES: {
						SHOOT_SETTINGS: combineStats(stats),
						COLOR: { BASE: -1, BRIGHTNESS_SHIFT: brightShift - 17.5, SATURATION_SHIFT: 0.65 },
						TYPE: "bullet",
					},
				}, {
					POSITION: [length, width, aspect, x, y - (width + 1) / 2, angle, delay + 0.5],
					PROPERTIES: {
						SHOOT_SETTINGS: combineStats(stats),
						COLOR: { BASE: -1, BRIGHTNESS_SHIFT: brightShift - 17.5, SATURATION_SHIFT: 0.65 },
						TYPE: "bullet",
					},
				}, {
					POSITION: [length - 1.5, width, aspect - 0.3, x, y + (width + 1) / 2, angle, delay],
					PROPERTIES: {
						SHOOT_SETTINGS: combineStats([...stats, g.fake]),
						TYPE: "bullet",
						COLOR: { BASE: -1, BRIGHTNESS_SHIFT: brightShift - 7.5, SATURATION_SHIFT: 0.65 },
						BORDERLESS: true
					}
				}, {
					POSITION: [length - 1.5, width, aspect - 0.3, x, y - (width + 1) / 2, angle, delay + 0.5],
					PROPERTIES: {
						SHOOT_SETTINGS: combineStats([...stats, g.fake]),
						TYPE: "bullet",
						COLOR: { BASE: -1, BRIGHTNESS_SHIFT: brightShift - 7.5, SATURATION_SHIFT: 0.65 },
						BORDERLESS: true
					}
				},
			];
		}
		return [
			{
				POSITION: [length - 2.5, width + 3, aspect, x, y, angle, 0],
				PROPERTIES: {COLOR: { BASE: -1, BRIGHTNESS_SHIFT: brightShift - 22.5, SATURATION_SHIFT: 0.5 },}
			}, {
				POSITION: [4.5, width + 4, 0, x + length - 8, y, angle, delay],
				PROPERTIES: {
					SHOOT_SETTINGS: combineStats([...stats, g.fake]),
					TYPE: "bullet",
					COLOR: { BASE: 17, BRIGHTNESS_SHIFT: brightShift + 10 },
				}
			}, {
				POSITION: [4.5, width + 4, 0, x + length - 12, y, angle, delay],
				PROPERTIES: {
					SHOOT_SETTINGS: combineStats([...stats, g.fake]),
					TYPE: "bullet",
					COLOR: { BASE: 17, BRIGHTNESS_SHIFT: brightShift + 10 },
				}
			}, {
				POSITION: [length, width, aspect, x, y, angle, delay],
				PROPERTIES: {
					SHOOT_SETTINGS: combineStats(stats),
					COLOR: { BASE: -1, BRIGHTNESS_SHIFT: brightShift - 17.5, SATURATION_SHIFT: 0.65 },
					TYPE: "bullet",
				},
			}, {
				POSITION: [length - 1, width, aspect - 0.2, x, y, angle, delay],
				PROPERTIES: {
					SHOOT_SETTINGS: combineStats([...stats, g.fake]),
					TYPE: "bullet",
					COLOR: { BASE: -1, BRIGHTNESS_SHIFT: brightShift - 10, SATURATION_SHIFT: 0.65 },
					BORDERLESS: true
				}
			}, {
				POSITION: [length - 2.5, width - 1.5, aspect - 0.2, x, y, angle, delay],
				PROPERTIES: {
					SHOOT_SETTINGS: combineStats([...stats, g.fake]),
					TYPE: "bullet",
					COLOR: { BASE: -1, BRIGHTNESS_SHIFT: brightShift - 2.5, SATURATION_SHIFT: 0.65 },
					BORDERLESS: true
				}
			},
		];
	}
	function addHunter({length = 18, width = 8, dimensionDifference = 3, barrelCount = 2, aspect = 1, x = 0, y = 0, angle = 0, delay = 0}, brightShift = 6, stats = [g.sniper]) {
		let output = [
			{
				POSITION: [length - 2.5, width + 2, -aspect - 0.3, x, y, angle, 0],
				PROPERTIES: { COLOR: { BASE: -1, BRIGHTNESS_SHIFT: brightShift - 2.5, SATURATION_SHIFT: 0.8 } },
			},
		];
		let delayOffset = 0.5 / barrelCount;
		for (let i = 0; i < barrelCount; i++) stats.push(g.hunter2);
		for (let i = barrelCount - 1; i >= 0; i--) {
			output.push(
				{
					POSITION: [length + i * dimensionDifference, width - i * dimensionDifference, aspect, x, y, angle, delay + delayOffset * (barrelCount - i - 1)],
					PROPERTIES: {
						SHOOT_SETTINGS: combineStats(stats),
						COLOR: { BASE: 17, BRIGHTNESS_SHIFT: brightShift + 10 },
						TYPE: "bullet",
					},
				}, {
					POSITION: [length + i * dimensionDifference, width - i * dimensionDifference - 2.5, -aspect + 0.3, x, y, angle, delay + delayOffset * (barrelCount - i - 1)],
					PROPERTIES: {
						SHOOT_SETTINGS: combineStats([...stats, g.fake]),
						COLOR: { BASE: -1, BRIGHTNESS_SHIFT: brightShift - 12.5, SATURATION_SHIFT: 0.75 },
						TYPE: "bullet",
					},
				},
			)
			stats.pop();
		}
		output.push(
			{
				POSITION: [length - 1.5, width - 3.5, -aspect + 0.3, x, y, angle, delay + delayOffset * (barrelCount - 1)],
				PROPERTIES: {
					SHOOT_SETTINGS: combineStats([...stats, g.fake]),
					COLOR: { BASE: -1, BRIGHTNESS_SHIFT: brightShift - 2.5, SATURATION_SHIFT: 0.8 },
					TYPE: "bullet",
					BORDERLESS: true,
				},
			},
		)
		return output;
	}
	function addHeavySniper({length = 18, width = 8, aspect = 1, x = 0, y = 0, angle = 0, delay = 0}, brightShift = 6, stats = [g.sniper]) {
		return [
			{
				POSITION: [length, width, 1, x, y, angle, delay],
				PROPERTIES: {
					SHOOT_SETTINGS: combineStats(stats),
					TYPE: "bullet",
					COLOR: { BASE: -1, BRIGHTNESS_SHIFT: brightShift - 12.5, SATURATION_SHIFT: 0.6 },
				},
			}, {
				POSITION: [length - 1.5, width * 0.7, -1.3, x, y, angle, delay],
				PROPERTIES: { 
					SHOOT_SETTINGS: combineStats([...stats, g.fake]),
					TYPE: "bullet",
					COLOR: { BASE: -1, BRIGHTNESS_SHIFT: brightShift - 2.5, SATURATION_SHIFT: 0.6}, 
					BORDERLESS: true
				},
			}, {
				POSITION: [length - 7, width * 0.4, -1.4, x, y, angle, 0],
				PROPERTIES: { COLOR: { BASE: 17, BRIGHTNESS_SHIFT: brightShift + 12.5 } },
			}, {
				POSITION: [4, width + 2, 1, x + length - 7, y, angle, delay],
				PROPERTIES: {
					SHOOT_SETTINGS: combineStats([...stats, g.fake]),
					TYPE: "bullet",
					COLOR: { BASE: -1, BRIGHTNESS_SHIFT: brightShift - 2.5, SATURATION_SHIFT: 0.6 },
				},
			}, {
				POSITION: [2, width + 2.5, 1, x + length - 6, y, angle, delay],
				PROPERTIES: {
					SHOOT_SETTINGS: combineStats([...stats, g.fake]),
					TYPE: "bullet",
					COLOR: { BASE: 17, BRIGHTNESS_SHIFT: brightShift + 5 },
				},
			},
		];
	}
	function addRailgun({length = 18, width = 8, aspect = 1, x = 0, y = 0, angle = 0, delay = 0}, brightShift = 6, stats = [g.sniper]) {
		let output = [
			{
				POSITION: [length - x - 3.5, width + 3, 1, x, y, angle, 0],
				PROPERTIES: {COLOR: { BASE: -1, BRIGHTNESS_SHIFT: brightShift - 10, SATURATION_SHIFT: 0.7 }}
			}, {
				POSITION: [length - x, width, 1, x, y, angle, delay],
				PROPERTIES: {
					SHOOT_SETTINGS: combineStats(stats),
					TYPE: "bullet",
					COLOR: { BASE: 17, BRIGHTNESS_SHIFT: brightShift + 10 },
				},
			}, {
				POSITION: [5, width + 3, -1.7, x, y, angle, 0],
				PROPERTIES: {COLOR: { BASE: 17, BRIGHTNESS_SHIFT: brightShift + 15 },}
			}, {
				POSITION: [3.5, width + 1.5, -1.7, x, y, angle, 0],
				PROPERTIES: {COLOR: { BASE: -1, BRIGHTNESS_SHIFT: brightShift - 10, SATURATION_SHIFT: 0.65 },}
			},
		];
		for (let i = 0; i < 3; i++) {
			output.splice(1, 0,
				{
					POSITION: [0.6, width + 4, 1, length - 4 - 2.5 * i, y, angle, delay],
					PROPERTIES: {
						SHOOT_SETTINGS: combineStats([...stats, g.fake]),
						TYPE: "bullet",
						COLOR: { BASE: -1, BRIGHTNESS_SHIFT: brightShift - 2.5, SATURATION_SHIFT: 0.85 },
					},
				}
			)
		}
		return output;
	}
	
	function addNormal({length = 18, width = 8, aspect = 1, x = 0, y = 0, angle = 0, delay = 0}, brightShift = 0, stats = [g.basic], drawTop = true) {
		let output = [
			{
				POSITION: [length, width, aspect, x, y, angle, delay],
				PROPERTIES: {
					SHOOT_SETTINGS: combineStats(stats),
					TYPE: "bullet",
					COLOR: { BASE: -1, BRIGHTNESS_SHIFT: brightShift - 20, SATURATION_SHIFT: 0.5 }
				},
			},
		];
		if (drawTop) {
			output.push(
				{
					POSITION: [length - 2, width * 0.85, aspect * 0.9, x, y, angle, delay],
					PROPERTIES: {
						SHOOT_SETTINGS: combineStats([...stats, g.fake]),
						TYPE: "bullet",
						COLOR: { BASE: -1, BRIGHTNESS_SHIFT: brightShift - 27.5, SATURATION_SHIFT: 0.5 },
						BORDERLESS: true,
					},
				}, {
					POSITION: [length - 2, width * 0.5, aspect * -0.7, x, y, angle, delay],
					PROPERTIES: {
						SHOOT_SETTINGS: combineStats([...stats, g.fake]),
						TYPE: "bullet",
						COLOR: { BASE: -1, BRIGHTNESS_SHIFT: brightShift - 32.5, SATURATION_SHIFT: 0.5 },
						BORDERLESS: true,
					},
				}, {
					POSITION: [1.5 * aspect, aspect * width * 0.7, -0.6, x + length - 1.5 - 1.5 * aspect, y, angle, delay],
					PROPERTIES: {
						SHOOT_SETTINGS: combineStats([...stats, g.fake]),
						TYPE: "bullet",
						COLOR: { BASE: -1, BRIGHTNESS_SHIFT: brightShift - 10 },
					},
				},
			);
		}
		return output;
	}
	function addSpam({length = 18, width = 8, aspect = 1, x = 0, y = 0, angle = 0, delay = 0}, brightShift = 0, stats = [g.basic]) {
		return [
			{ // Main barrel
				POSITION: [length, width, aspect, x, y, angle, delay],
				PROPERTIES: {
					SHOOT_SETTINGS: combineStats(stats),
					TYPE: "bullet",
					COLOR: { BASE: 17, BRIGHTNESS_SHIFT: brightShift + 15 }
				},
			}, {
				POSITION: [length - 1.2, width, aspect * (length - 2) / length, x, y, angle, delay],
				PROPERTIES: {
					SHOOT_SETTINGS: combineStats([...stats, g.fake]),
					TYPE: "bullet",
					COLOR: { BASE: -1, BRIGHTNESS_SHIFT: brightShift - 5, SATURATION_SHIFT: 0.65 }
				},
			}, {
				POSITION: [length - 2, width - 1, aspect - 0.3, x, y, angle, delay],
				PROPERTIES: {
					SHOOT_SETTINGS: combineStats([...stats, g.fake]),
					TYPE: "bullet",
					COLOR: { BASE: -1, BRIGHTNESS_SHIFT: brightShift, SATURATION_SHIFT: 0.65 },
					BORDERLESS: true,
				},
			},
		];
	}
	function addGunner({length = 18, width = 8, aspect = 1, x = 0, y = 0, angle = 0, delay = 0}, brightShift = 0, stats = [g.basic]) {
		return [
			{ // Main barrel
				POSITION: [length, width, 1, x, y, angle, delay],
				PROPERTIES: {
					SHOOT_SETTINGS: combineStats(stats),
					TYPE: "bullet",
					COLOR: { BASE: 17, BRIGHTNESS_SHIFT: brightShift + 15 }
				},
			}, {
				POSITION: [length - 1.25, width * 0.8, -0.8, x, y, angle, delay],
				PROPERTIES: {
					SHOOT_SETTINGS: combineStats([...stats, g.fake]),
					TYPE: "bullet",
					COLOR: { BASE: -1, BRIGHTNESS_SHIFT: brightShift - 5, SATURATION_SHIFT: 0.65 }
				},
			},
		];
	}
	function addCrowbar({length = 38, width = 6.5, aspect = 1, x = 8, y = 0, angle = 0, delay = 0}, brightShift = 0) {
		return [
			{
				POSITION: [length - x - 8, width, -1.5, x, y, angle, 0],
				PROPERTIES: {COLOR: { BASE: 17, BRIGHTNESS_SHIFT: brightShift + 5 }},
			}, {
				POSITION: [length - x, width, 1, x, y, angle, 0],
				PROPERTIES: {COLOR: { BASE: -1, BRIGHTNESS_SHIFT: brightShift - 12.5, SATURATION_SHIFT: 0.6 }}
			}, {
				POSITION: [length - x, width - 2, 1, x, y, angle, 0],
				PROPERTIES: {COLOR: { BASE: -1, BRIGHTNESS_SHIFT: brightShift - 5, SATURATION_SHIFT: 0.7 }, BORDERLESS: true}
			}, {
				POSITION: [5, width + 2, -1.5, x, y, angle, 0],
				PROPERTIES: {COLOR: { BASE: -1, BRIGHTNESS_SHIFT: brightShift - 7.5, SATURATION_SHIFT: 0.6 }}
			}, {
				POSITION: [5, width + 0.5, -1.6, x - 1.5, y, angle, 0],
				PROPERTIES: {COLOR: { BASE: 17, BRIGHTNESS_SHIFT: brightShift + 10 }},
			},
		];
	}
	function addHeavy({length = 18, width = 8, aspect = 1, x = 0, y = 0, angle = 0, delay = 0}, brightShift = 0, stats = [g.basic]) {
		return [
			{
				POSITION: [12.5, width * 1.3, -aspect + 0.25, x, y, angle, 0],
				PROPERTIES: { COLOR: { BASE: 17, BRIGHTNESS_SHIFT: brightShift + 12.5 } },
			}, {
				POSITION: [length, width, aspect, x, y, angle, delay],
				PROPERTIES: {
					SHOOT_SETTINGS: combineStats(stats),
					TYPE: "bullet",
					COLOR: { BASE: -1, BRIGHTNESS_SHIFT: brightShift - 20, SATURATION_SHIFT: 0.5 },
					BORDERLESS: true
				},
			}, {
				POSITION: [length, width * 0.8, -aspect + 0.175, x, y, angle, delay],
				PROPERTIES: {
					SHOOT_SETTINGS: combineStats([...stats, g.fake]),
					TYPE: "bullet",
					COLOR: { BASE: -1, BRIGHTNESS_SHIFT: brightShift - 10, SATURATION_SHIFT: 0.8 },
					BORDERLESS: true
				},
			}, {
				POSITION: [length, width * 0.55, -aspect + 0.35, x, y, angle, delay],
				PROPERTIES: {
					SHOOT_SETTINGS: combineStats([...stats, g.fake]),
					TYPE: "bullet",
					COLOR: { BASE: 17, BRIGHTNESS_SHIFT: brightShift + 7.5 },
					BORDERLESS: true
				},
			}, {
				POSITION: [length, width, aspect, x, y, angle, delay],
				PROPERTIES: {
					SHOOT_SETTINGS: combineStats([...stats, g.fake]),
					TYPE: "bullet",
					COLOR: { BASE: -1, BRIGHTNESS_SHIFT: brightShift - 20, SATURATION_SHIFT: 0.5 },
					DRAW_FILL: false
				},
			},
		];
	}
	function addLauncher({length = 18, width = 8, aspect = 1, x = 0, y = 0, angle = 0, delay = 0}, brightShift = 0, stats = [g.basic], isSkimmer = false, TYPE = "missile") {
		if (isSkimmer) {
			return [
				{
					POSITION: [10, width - 1, -0.75, x + length - 8, y, angle, 0],
					PROPERTIES: {COLOR: { BASE: -1, BRIGHTNESS_SHIFT: brightShift - 10, SATURATION_SHIFT: 0.6 }} 
				}, {
					POSITION: [9.5, width - 3, -0.75, x + length - 8, y, angle, 0],
					PROPERTIES: {COLOR: { BASE: -1, BRIGHTNESS_SHIFT: brightShift - 2.5, SATURATION_SHIFT: 0.7 }, BORDERLESS: true} 
				}, {
					POSITION: [length, width, 1, x, y, angle, delay],
					PROPERTIES: {
						SHOOT_SETTINGS: combineStats(stats),
						TYPE,
						STAT_CALCULATOR: gunCalcNames.sustained,
						COLOR: { BASE: 17, BRIGHTNESS_SHIFT: brightShift + 10 },
					},
				}, {
					POSITION: [length - 2, width - 2, 0.8, x, y, angle, 0],
					PROPERTIES: {COLOR: { BASE: -1, BRIGHTNESS_SHIFT: brightShift - 10, SATURATION_SHIFT: 0.6 }}
				}, {
					POSITION: [length, width - 2, 0.75, x - 3.5, y, angle, 0],
					PROPERTIES: {COLOR: { BASE: -1, BRIGHTNESS_SHIFT: brightShift - 2.5, SATURATION_SHIFT: 0.7 }, BORDERLESS: true}
				},
			];
		} else {
			return [
				{
					POSITION: [length - 6, width - 3, 1, x+8, y, angle, delay],
					PROPERTIES: {
						SHOOT_SETTINGS: combineStats(stats),
						TYPE,
						STAT_CALCULATOR: gunCalcNames.sustained,
						COLOR: { BASE: -1, BRIGHTNESS_SHIFT: brightShift - 15, SATURATION_SHIFT: 0.6 },
					},
				}, {
					POSITION: [length, width, 1, x, y, angle, 0],
					PROPERTIES: {COLOR: { BASE: 17, BRIGHTNESS_SHIFT: brightShift + 5 }} 
				}, {
					POSITION: [length, width - 2, 1, x, y, angle, 0],
					PROPERTIES: {COLOR: { BASE: -1, BRIGHTNESS_SHIFT: brightShift - 10, SATURATION_SHIFT: 0.6 }}
				}, {
					POSITION: [length, width - 2, 0.75, x - 1.5, y, angle, 0],
					PROPERTIES: {COLOR: { BASE: -1, BRIGHTNESS_SHIFT: brightShift - 2.5, SATURATION_SHIFT: 0.7 }, BORDERLESS: true}
				}, {
					POSITION: [length, width - 2, 0.75, x - 4, y, angle, 0],
					PROPERTIES: {COLOR: { BASE: -1, BRIGHTNESS_SHIFT: brightShift + 2.5, SATURATION_SHIFT: 0.7 }, BORDERLESS: true}
				},
			];
		}
	}
	function addShotgun({length = 18, width = 8, aspect = 1, x = 0, y = 0, angle = 0, delay = 0}, brightShift = 0, realGuns = [], bigStats = [g.basic], smallStats = [g.basic]) {
		let output = [
			{
				POSITION: [length - x, width, 1, x, y, angle, delay],
				PROPERTIES: {
					SHOOT_SETTINGS: combineStats([...bigStats, g.fake]),
					TYPE: "bullet",
					COLOR: { BASE: -1, BRIGHTNESS_SHIFT: brightShift - 20, SATURATION_SHIFT: 0.6 },
				},
			}, {
				POSITION: [length - x - 1.5, width - 2, 0.85, x, y, angle, delay],
				PROPERTIES: {
					SHOOT_SETTINGS: combineStats([...bigStats, g.fake]),
					TYPE: "bullet",
					COLOR: { BASE: 17, BRIGHTNESS_SHIFT: brightShift + 5 },
				},
			}, {
				POSITION: [6, width, -1.3, x, y, angle, 0],
				PROPERTIES: {
					COLOR: { BASE: -1, BRIGHTNESS_SHIFT: brightShift - 20, SATURATION_SHIFT: 0.6 },
				},
			}, {
				POSITION: [length - x - 1, width / 2, -0.6, x, y, angle, delay],
				PROPERTIES: {
					SHOOT_SETTINGS: combineStats([...bigStats, g.fake]),
					TYPE: "bullet",
					COLOR: { BASE: -1, BRIGHTNESS_SHIFT: brightShift - 10, SATURATION_SHIFT: 0.7 },
				},
			}, {
				POSITION: [6, width - 1.5, -1.3, x - 1.5, y, angle, 0],
				PROPERTIES: { COLOR: { BASE: 17, BRIGHTNESS_SHIFT: brightShift + 10 } },
			},
		];
		let hasSmall = false;
		for (let i = 0; i < realGuns.length; i++) {
			let gun = realGuns[i],
				stats = gun.small ? smallStats : bigStats,
				TYPE = i % 3 == 0 ? "casing" : "bullet";
			if (gun.small) hasSmall = true;
			output.push({
				POSITION: [gun.l, gun.w, 0.001, 0, gun.y, angle, delay],
				PROPERTIES: {
					SHOOT_SETTINGS: combineStats(stats),
					TYPE,
				}
			});
		}
		if (hasSmall) {
			output.splice(0, 0, {
				POSITION: [length - x + 2.5, width - 3.5, 1, x, y, angle, delay],
				PROPERTIES: {
					SHOOT_SETTINGS: combineStats([...bigStats, g.fake]),
					TYPE: "bullet",
					COLOR: { BASE: -1, BRIGHTNESS_SHIFT: brightShift - 10, SATURATION_SHIFT: 0.6 },
				},
			});
		}
		return output;
	}
	function addTwister({length = 18, width = 8, aspect = -1.4, x = 0, y = 0, angle = 0, delay = 0}, brightShift = 0, stats = [g.basic], TYPE = "spinmissile") {
		return [
			{
				POSITION: [10, width - 1, -0.5, x + length - 8, y, angle, 0],
				PROPERTIES: {COLOR: { BASE: -1, BRIGHTNESS_SHIFT: brightShift - 7.5, SATURATION_SHIFT: 0.65 },}
			}, {
				POSITION: [length, width, aspect, x, y, angle, delay],
				PROPERTIES: {
					SHOOT_SETTINGS: combineStats(stats),
					TYPE,
					STAT_CALCULATOR: gunCalcNames.sustained,
					COLOR: { BASE: 17, BRIGHTNESS_SHIFT: brightShift + 5 },
				},
			}, {
				POSITION: [length, width * 1.08, aspect, x - length / 5, y, angle, delay],
				PROPERTIES: {
					SHOOT_SETTINGS: combineStats([...stats, g.fake]),
					TYPE: 'bullet',
					COLOR: { BASE: -1, BRIGHTNESS_SHIFT: brightShift - 15, SATURATION_SHIFT: 0.7 },
				},
			}, {
				POSITION: [length, width * 0.8, aspect - 0.1, x - length / 5 - 1.5, y, angle, delay],
				PROPERTIES: {
					SHOOT_SETTINGS: combineStats([...stats, g.fake]),
					TYPE: 'bullet',
					COLOR: { BASE: -1, BRIGHTNESS_SHIFT: brightShift - 6.25, SATURATION_SHIFT: 0.7 },
					BORDERLESS: true
				},
			}, {
				POSITION: [length - 2, width * 0.65, 0.7, x, y, angle, 0],
				PROPERTIES: {COLOR: { BASE: -1, BRIGHTNESS_SHIFT: brightShift - 5, SATURATION_SHIFT: 0.65 }}
			},
		];
	}
	function addDrone({length = 18, width = 8, aspect = 1.2, x = 8, y = 0, angle = 0, delay = 0}, brightShift = 6, stats = [g.drone], MAX_CHILDREN = 4, TYPE = "drone") {
		let output = [
			{
				POSITION: [length, width, aspect, x, y, angle, delay],
				PROPERTIES: {
					SHOOT_SETTINGS: combineStats(stats),
					TYPE,
					MAX_CHILDREN,
					AUTOFIRE: true,
					SYNCS_SKILLS: true,
					STAT_CALCULATOR: gunCalcNames.drone,
					WAIT_TO_CYCLE: true,
					COLOR: {BASE: -1, BRIGHTNESS_SHIFT: brightShift - 10, SATURATION_SHIFT: 0.8}
				},
			}, {
				POSITION: [length - 1, width, 0.8, x, y, angle, 0],
				PROPERTIES: { COLOR: {BASE: -1, BRIGHTNESS_SHIFT: brightShift, SATURATION_SHIFT: 0.8}, BORDERLESS: true },
			}, {
				POSITION: [length - 2.5, width * 0.8, -1.2, x, y, angle, 0],
				PROPERTIES: { COLOR: {BASE: 17, BRIGHTNESS_SHIFT: brightShift + 12.5} },
			},
		];
		if (MAX_CHILDREN > 2) {
			output.splice(0, 0,
				{
					POSITION: [length - 2, width + 3, 1, x, y, angle, 0],
					PROPERTIES: { COLOR: {BASE: 17, BRIGHTNESS_SHIFT: brightShift} },
				}
			)
		}
		return output;
	}
	function addMinion({length = 18, gap = 3, width = 8, aspect = 1, x = 0, y = 0, angle = 0, delay = 0}, brightShift = 6, stats = [g.factory], TYPE = "assailantMinionSnowdread", MAX_CHILDREN = 2) {
		return [
			{
				POSITION: [length + 1, width, -1.3, x, y, angle, 0],
				PROPERTIES: { COLOR: {BASE: -1, BRIGHTNESS_SHIFT: brightShift - 17.5, SATURATION_SHIFT: 0.6} },
			}, {
				POSITION: [gap, width - 1, 1, x + length, y, angle, 0],
				PROPERTIES: { COLOR: {BASE: -1, BRIGHTNESS_SHIFT: brightShift - 12.5, SATURATION_SHIFT: 0.6} },
			}, {
				POSITION: [1.5, width, 1, x + length + gap, y, angle, delay],
				PROPERTIES: {
					SHOOT_SETTINGS: combineStats(stats),
					TYPE,
					STAT_CALCULATOR: gunCalcNames.drone,
					AUTOFIRE: true,
					SYNCS_SKILLS: true,
					MAX_CHILDREN,
					COLOR: {BASE: -1, BRIGHTNESS_SHIFT: brightShift - 12.5, SATURATION_SHIFT: 0.6},
				},
			}, {
				POSITION: [length, width, 1, x, y, angle, 0],
				PROPERTIES: { COLOR: {BASE: 17, BRIGHTNESS_SHIFT: brightShift + 7.5} },
			}, {
				POSITION: [length + gap - 1, width * 0.6, -1.4, x, y, angle, 0],
				PROPERTIES: { COLOR: {BASE: 17, BRIGHTNESS_SHIFT: brightShift + 15} },
			},
		];
	}
	function addAutoDrone({length = 18, width = 8, aspect = 1.2, x = 8, y = 0, angle = 0, delay = 0}, brightShift = 6, stats = [g.drone], MAX_CHILDREN = 4) {
		return [
			{
				POSITION: [length, width, aspect, x, y, angle, delay],
				PROPERTIES: {
					SHOOT_SETTINGS: combineStats(stats),
					TYPE: "turretedDroneSnowdread",
					AUTOFIRE: true,
					SYNCS_SKILLS: true,
					STAT_CALCULATOR: gunCalcNames.drone,
					WAIT_TO_CYCLE: true,
					MAX_CHILDREN,
					COLOR: {BASE: -1, BRIGHTNESS_SHIFT: brightShift - 10, SATURATION_SHIFT: 0.65},
				},
			}, {
				POSITION: [length - 3, width - 2, aspect * 0.95, x, y, angle, delay],
				PROPERTIES: {COLOR: {BASE: 17, BRIGHTNESS_SHIFT: brightShift + 7.5}},
			}, {
				POSITION: [length - 1, width - 3, aspect, x, y, angle, delay],
				PROPERTIES: {COLOR: {BASE: -1, BRIGHTNESS_SHIFT: brightShift - 2.5, SATURATION_SHIFT: 0.75}},
			}, {
				POSITION: [length - 2, width / 2, 1, x, y, angle, 0],
				PROPERTIES: {COLOR: {BASE: 17, BRIGHTNESS_SHIFT: brightShift + 12.5},}
			},
		];
	}
	function addHoncho({length = 18, width = 8, aspect = 1, x = 0, y = 0, angle = 0, delay = 0}, brightShift = 0, stats = [g.drone], MAX_CHILDREN = 4) {
		return [
			{
				POSITION: [length, width, aspect, x, y, angle, delay],
				PROPERTIES: {
					SHOOT_SETTINGS: combineStats(stats),
					TYPE: "honchoDroneSnowdread",
					AUTOFIRE: true,
					SYNCS_SKILLS: true,
					STAT_CALCULATOR: gunCalcNames.drone,
					WAIT_TO_CYCLE: true,
					MAX_CHILDREN,
					COLOR: {BASE: -1, BRIGHTNESS_SHIFT: brightShift - 10, SATURATION_SHIFT: 0.6},
				},
			}, {
				POSITION: [1.5, width * 1.1, 0.5, x + length - 2.5, y, angle, 0],
				PROPERTIES: {COLOR: {BASE: -1, BRIGHTNESS_SHIFT: brightShift - 2.5, SATURATION_SHIFT: 0.7}, BORDERLESS: true}
			}, {
				POSITION: [1.5, width * 1.1, 1, x + length - 4.5, y, angle, 0],
				PROPERTIES: {COLOR: {BASE: 17, BRIGHTNESS_SHIFT: brightShift + 5}}
			}, {
				POSITION: [length + 3, 4, 0.001, x, y + width * 0.3, angle + 22.5, 0],
				PROPERTIES: {COLOR: {BASE: 17, BRIGHTNESS_SHIFT: brightShift + 12.5},}
			}, {
				POSITION: [length + 3, 4, 0.001, x, y - width * 0.3, angle - 22.5, 0],
				PROPERTIES: {COLOR: {BASE: 17, BRIGHTNESS_SHIFT: brightShift + 12.5},}
			},
		];
	}
	function addSwarm({length = 18, width = 8, aspect = 0.6, x = 0, y = 0, angle = 0, delay = 0}, brightShift = 6, stats = [g.swarm]) {
		return [
			{
				POSITION: [length, width, aspect, x, y, angle, delay],
				PROPERTIES: {
					SHOOT_SETTINGS: combineStats(stats),
					TYPE: "swarm",
					STAT_CALCULATOR: gunCalcNames.swarm,
					COLOR: {BASE: -1, BRIGHTNESS_SHIFT: brightShift - 12.5, SATURATION_SHIFT: 0.7}
				},
			}, {
				POSITION: [length * 1.5, width * 0.8, aspect, x - length * 0.65, y, angle, delay],
				PROPERTIES: {
					SHOOT_SETTINGS: combineStats([...stats, g.fake]),
					TYPE: "swarm",
					COLOR: {BASE: -1, BRIGHTNESS_SHIFT: brightShift - 5, SATURATION_SHIFT: 0.7},
					BORDERLESS: true
				},
			},
		];
	}
	function addTrap({length = 18, length2 = 3, width = 8, aspect = 1.6, x = 0, y = 0, angle = 0, delay = 0}, brightShift = 6, stats = [g.trap], isBox = false) {
		return [
			{
				POSITION: [length, width * 1.25, 1, x, y, angle, 0],
				PROPERTIES: {COLOR: {BASE: 17, BRIGHTNESS_SHIFT: brightShift + 10}}
			}, {
				POSITION: [length, width, 1, x, y, angle, 0],
				PROPERTIES: {COLOR: {BASE: -1, BRIGHTNESS_SHIFT: brightShift - 10, SATURATION_SHIFT: 0.6}}
			}, {
				POSITION: [length2, width, aspect, x + length, y, angle, delay],
				PROPERTIES: {
					SHOOT_SETTINGS: combineStats(stats),
					TYPE: isBox ? "unsetTrap" : "trap",
					STAT_CALCULATOR: gunCalcNames.trap,
					COLOR: {BASE: -1, BRIGHTNESS_SHIFT: brightShift - 12.5, SATURATION_SHIFT: 0.6}
				},
			}, {
				POSITION: [length + length2 / 3, width * 0.8, 0.7, x, y, angle, 0],
				PROPERTIES: {COLOR: {BASE: -1, BRIGHTNESS_SHIFT: brightShift - 20,  SATURATION_SHIFT: 0.8}}
			},
		];
	}
	function addAutoTrap({length = 18, length2 = 3, width = 8, aspect = 1, x = 0, y = 0, angle = 0, delay = 0}, brightShift = 0, stats = [g.trap], isBox = false) {
		let output = [
			{
				POSITION: [length, width, 1, x, y, angle, 0],
				PROPERTIES: {COLOR: {BASE: -1, BRIGHTNESS_SHIFT: brightShift - 15, SATURATION_SHIFT: 0.6}}
			}, {
				POSITION: [length - 3, width + 3, 1, x, y, angle, 0],
				PROPERTIES: {COLOR: {BASE: 17, BRIGHTNESS_SHIFT: brightShift + 7.5}}
			}, {
				POSITION: [length - 4, width + 1, 1, x, y, angle, 0],
				PROPERTIES: {COLOR: {BASE: 17, BRIGHTNESS_SHIFT: brightShift + 15}, BORDERLESS: true}
			}, {
				POSITION: [length2, width, aspect, x + length, y, angle, delay],
				PROPERTIES: {
					SHOOT_SETTINGS: combineStats(stats),
					TYPE: isBox ? 'unsetPillbox' : 'autoTrap',
					STAT_CALCULATOR: gunCalcNames.trap,
					INDEPENDENT: true,
					COLOR: {BASE: -1, BRIGHTNESS_SHIFT: brightShift - 15, SATURATION_SHIFT: 0.6}
				},
			}, {
				POSITION: [length + length2 / 2, width * 0.9, 0.6, x, y, angle, 0],
				PROPERTIES: {COLOR: {BASE: -1, BRIGHTNESS_SHIFT: brightShift - 7.5, SATURATION_SHIFT: 0.7}}
			},
		];
		if (isBox) {
			output.splice(1, 0, {
				POSITION: [length - 1, width - 2, 1, x, y, angle, 0],
				PROPERTIES: {COLOR: {BASE: -1, BRIGHTNESS_SHIFT: brightShift - 7.5, SATURATION_SHIFT: 0.65}, BORDERLESS: true}
			});
			output.push({
				POSITION: [length + length2 / 2 - 1.5, width * 0.75, 0.6, x, y, angle, 0],
				PROPERTIES: {COLOR: {BASE: -1, BRIGHTNESS_SHIFT: brightShift, SATURATION_SHIFT: 0.75}, BORDERLESS: true}
			});
		}
		return output;
	}
	function addAuraTrap({length = 18, length2 = 3, width = 8, aspect = 1, x = 0, y = 0, angle = 0, delay = 0}, brightShift = 6, stats = [g.trap], isBox = false) {
		return [
			{
				POSITION: [length, width, 1, x, y, angle, 0],
				PROPERTIES: {COLOR: {BASE: -1, BRIGHTNESS_SHIFT: brightShift - 15, SATURATION_SHIFT: 0.6}}
			}, {
				POSITION: [length2 + 1, width - 1.5, -1.7, x + length - length2 - 3, y, angle, 0],
				PROPERTIES: {COLOR: {BASE: 17, BRIGHTNESS_SHIFT: brightShift + 7.5}}
			}, {
				POSITION: [length, width * 0.6, -0.1, x, y, angle, 0],
				PROPERTIES: {COLOR: {BASE: -1, BRIGHTNESS_SHIFT: brightShift - 5, SATURATION_SHIFT: 0.75}}
			}, {
				POSITION: [length2, width, aspect, x + length, y, angle, delay],
				PROPERTIES: {
					SHOOT_SETTINGS: combineStats(stats),
					TYPE: isBox ? 'auraBlock' : 'auraTrap',
					STAT_CALCULATOR: gunCalcNames.trap,
					COLOR: {BASE: -1, BRIGHTNESS_SHIFT: brightShift - 15, SATURATION_SHIFT: 0.6}
				},
			}, {
				POSITION: [length2 - 1, width - 2, aspect, x + length + 1, y, angle, delay],
				PROPERTIES: {
					SHOOT_SETTINGS: combineStats([...stats, g.fake]),
					TYPE: 'bullet',
					COLOR: {BASE: 17, BRIGHTNESS_SHIFT: brightShift + 7.5}
				},
			},
		];
	}
	function addDroneOnAuto({length = 6, width = 12, aspect = 1.2, x = 8, y = 0, angle = 0, delay = 0}, brightShift = 6, stats = [g.drone]) {
		return [
			{
				POSITION: [length, width + 1, -1.2, x - 1, y, angle, 0],
				PROPERTIES: { COLOR: { BASE: 17, BRIGHTNESS_SHIFT: brightShift + 10 } },
			}, {
				POSITION: [length, width, 1.2, x, y, angle, delay],
				PROPERTIES: {
					SHOOT_SETTINGS: combineStats(stats),
					TYPE: ['drone', {INDEPENDENT: true}],
					AUTOFIRE: true,
					SYNCS_SKILLS: true,
					STAT_CALCULATOR: gunCalcNames.drone,
					WAIT_TO_CYCLE: true,
					COLOR: { BASE: -1, BRIGHTNESS_SHIFT: brightShift - 20, SATURATION_SHIFT: 0.5 },
				},
			}, {
				POSITION: [length - 2, width * 2/3, 1, x - 1, y, angle, 0],
				PROPERTIES: { COLOR: { BASE: 17, BRIGHTNESS_SHIFT: brightShift + 10 }, DRAW_ABOVE: true },
			},
		];
	}

	// Deco bodies
	Class.eggBaseDeco = {
		SHAPE: "M 0.71 0.71 A 1 0.98 0 0 1 -0.71 0.71 L -0.6 0.6 A 1 1.25 0 0 0 0.6 0.6 L 0.71 0.71" + 
				"M -0.71 -0.71 A 1 0.98 180 0 1 0.71 -0.71 L 0.6 -0.6 A 1 1.25 180 0 0 -0.6 -0.6 L -0.71 -0.71" + 
				"M 0.79 0.33 A 1 0.95 45 0 1 0.6 0.6 L 0.54 0.54 A 1.88 1 45 0 0 0.71 0.29 L 0.79 0.33" + 
				"M -0.79 0.33 A 1 0.95 157.5 0 0 -0.6 0.6 L -0.54 0.54 A 1.88 1 157.5 0 1 -0.71 0.29 L -0.79 0.33" + 
				"M 0.79 -0.33 A 1 0.95 -45 0 0 0.6 -0.6 L 0.54 -0.54 A 1.88 1 -45 0 1 0.71 -0.29 L 0.79 -0.33" + 
				"M -0.79 -0.33 A 1 0.95 -157.5 0 1 -0.6 -0.6 L -0.54 -0.54 A 1.88 1 -157.5 0 0 -0.71 -0.29 L -0.79 -0.33",
		COLOR: { BASE: 17, BRIGHTNESS_SHIFT: 10 },
		MIRROR_MASTER_ANGLE: true,
		GUNS: [],
	}
	for(let i = 0; i < 2; i++) {
		Class.eggBaseDeco.GUNS.push(
			{
				POSITION: [8.25, 6.75, 0.6, 0, 0, 180*i+55, 0],
				PROPERTIES: {
					COLOR: { BASE: 6, BRIGHTNESS_SHIFT: -12.5, SATURATION_SHIFT: 0.85 },
					BORDERLESS: true,
				}
			}, {
				POSITION: [8.25, 6.75, 0.6, 0, 0, 180*i+125, 0],
				PROPERTIES: {
					COLOR: { BASE: 6, BRIGHTNESS_SHIFT: -12.5, SATURATION_SHIFT: 0.85 },
					BORDERLESS: true,
				}
			}, {
				POSITION: [4, 1.3, 0.001, 9, 0, 48 + 180 * i, 0],
				PROPERTIES: {
					COLOR: { BASE: 6, BRIGHTNESS_SHIFT: -20 },
					DRAW_ABOVE: true,
				},
			}, {
				POSITION: [3.5, 1.7, 0.001, 9, 0, 90 + 180 * i, 0],
				PROPERTIES: {
					COLOR: { BASE: 6, BRIGHTNESS_SHIFT: -20 },
					DRAW_ABOVE: true,
				},
			}, {
				POSITION: [4, 1.3, 0.001, 9, 0, 132 + 180 * i, 0],
				PROPERTIES: {
					COLOR: { BASE: 6, BRIGHTNESS_SHIFT: -20 },
					DRAW_ABOVE: true,
				},
			}, {
				POSITION: [1.5, 1.3, 0, 7.5, 0, 48 + 180 * i, 0],
				PROPERTIES: {
					COLOR: { BASE: 6, BRIGHTNESS_SHIFT: -20 },
					DRAW_ABOVE: true,
				},
			}, {
				POSITION: [1, 1.7, 0, 8, 0, 90 + 180 * i, 0],
				PROPERTIES: {
					COLOR: { BASE: 6, BRIGHTNESS_SHIFT: -20 },
					DRAW_ABOVE: true,
				},
			}, {
				POSITION: [1.5, 1.3, 0, 7.5, 0, 132 + 180 * i, 0],
				PROPERTIES: {
					COLOR: { BASE: 6, BRIGHTNESS_SHIFT: -20 },
					DRAW_ABOVE: true,
				},
			}, 
		)
	}
	Class.squareBaseDeco = {
		SHAPE: "M -0.98 0.98 L -0.3 0.75 L -0.63 0.63 L -0.75 0.3 L -0.98 0.98" + 
				"M 0.98 0.98 L 0.75 0.3 L 0.63 0.63 L 0.3 0.75 L 0.98 0.98" + 
				"M 0.98 -0.98 L 0.3 -0.75 L 0.63 -0.63 L 0.75 -0.3 L 0.98 -0.98" + 
				"M -0.98 -0.98 L -0.75 -0.3 L -0.63 -0.63 L -0.3 -0.75 L -0.98 -0.98",
		COLOR: { BASE: 17, BRIGHTNESS_SHIFT: 10 },
		MIRROR_MASTER_ANGLE: true,
		GUNS: [],
	}
	for(let i = 0; i < 4; i++) {
		Class.squareBaseDeco.GUNS.push(
			{
				POSITION: [4, 2, 0.001, 9.5, 2.6, 20 + 90 * i, 0],
				PROPERTIES: { COLOR: { BASE: -1, BRIGHTNESS_SHIFT: -15 } },
			}, {
				POSITION: [4, 2, 0.001, 9.5, -2.6, 70 + 90 * i, 0],
				PROPERTIES: { COLOR: { BASE: -1, BRIGHTNESS_SHIFT: -15 } },
			}, {
				POSITION: [5, 1.5, 0.001, -2, 9, -70 + 90 * i, 0],
				PROPERTIES: { COLOR: { BASE: 17, BRIGHTNESS_SHIFT: 17.5 } },
			}, {
				POSITION: [5, 1.5, 0.001, -2, -9, 70 + 90 * i, 0],
				PROPERTIES: { COLOR: { BASE: 17, BRIGHTNESS_SHIFT: 17.5 } },
			},
		)
	}
	Class.triangleBaseDeco = {
		SHAPE: "M -1.546 -0.108 L -1.546 0.108 L -0.175 0.303 L 0.679 1.393 L 0.867 1.285 L 0.35 0 L 0.867 -1.285 L 0.679 -1.393 L -0.175 -0.303 L -1.546 -0.108",
		COLOR: { BASE: 17, BRIGHTNESS_SHIFT: 5 },
		MIRROR_MASTER_ANGLE: true,
		GUNS: [],
	}
	for(let i = 0; i < 3; i++) {
		Class.triangleBaseDeco.GUNS.push(
			{
				POSITION: [7, 3, 0.001, 10, 0, 120 * i + 60, 0],
				PROPERTIES: { COLOR: { BASE: -1, BRIGHTNESS_SHIFT: -12.5, SATURATION_SHIFT: 0.7 } },
			}, {
				POSITION: [5, 2.5, 0.001, 6.5, -2, 120 * i + 90, 0],
				PROPERTIES: { COLOR: { BASE: -1, BRIGHTNESS_SHIFT: -10, SATURATION_SHIFT: 0.85 } },
			}, {
				POSITION: [5, 2.5, 0.001, 6.5, 2, 120 * i + 30, 0],
				PROPERTIES: { COLOR: { BASE: -1, BRIGHTNESS_SHIFT: -10, SATURATION_SHIFT: 0.85 } },
			}, {
				POSITION: [9, 5, 0.25, 0, 0, 120 * i + 60, 0],
				PROPERTIES: { COLOR: { BASE: 17, BRIGHTNESS_SHIFT: 12.5 }, BORDERLESS: true, DRAW_ABOVE: true },
			},
		)
	}
	Class.pentagonBaseDeco = {
		SHAPE: "M -1.207 -0.324 L -0.724 -0.194 L -0.408 -0.629 L -0.681 -1.048 L -0.688 -0.5 Z" +
			"M -1.207 0.324 L -0.724 0.194 L -0.408 0.629 L -0.681 1.048 L -0.688 0.5 Z" +
			"M 0.787 -0.971 L 0.472 -0.583 L -0.039 -0.749 L -0.065 -1.248 L 0.263 -0.808 Z" +
			"M 0.787 0.971 L 0.472 0.583 L -0.039 0.749 L -0.065 1.248 L 0.263 0.808 Z" +
			"M 1.167 0.448 L 0.7 0.269 L 0.7 -0.269 L 1.167 -0.448 L 0.85 0 Z",
		COLOR: { BASE: 17, BRIGHTNESS_SHIFT: 5 },
		MIRROR_MASTER_ANGLE: true,
		GUNS: [],
	}
	for(let i = 0; i < 5; i++) {
		Class.pentagonBaseDeco.GUNS.push(
			{
				POSITION: [4, 6, 0.001, 8.5, 0, 72 * i, 0],
				PROPERTIES: { COLOR: { BASE: -1, BRIGHTNESS_SHIFT: -10, SATURATION_SHIFT: 0.6 } },
			}, {
				POSITION: [7, 2.5, 0.001, 6, -6.2, 72 * i + 60, 0],
				PROPERTIES: { COLOR: { BASE: -1, BRIGHTNESS_SHIFT: -2.5, SATURATION_SHIFT: 0.8 } },
			}, {
				POSITION: [7, 2.5, 0.001, 6, 6.2, 72 * i - 60, 0],
				PROPERTIES: { COLOR: { BASE: -1, BRIGHTNESS_SHIFT: -2.5, SATURATION_SHIFT: 0.8 } },
			},
		)
	}
	Class.hexagonBaseDeco = {
		SHAPE: "M -1.1 0 L -0.956 0.292 L -0.669 0.205 L -0.669 -0.205 L -0.956 -0.292 Z" +
			"M -0.55 0.952 L -0.225 0.974 L -0.157 0.682 L -0.512 0.477 L -0.731 0.682 Z" +
			"M -0.55 -0.952 L -0.225 -0.974 L -0.157 -0.682 L -0.512 -0.477 L -0.731 -0.682 Z" +
			"M 0.55 0.952 L 0.225 0.974 L 0.157 0.682 L 0.512 0.477 L 0.731 0.682 Z" +
			"M 0.55 -0.952 L 0.225 -0.974 L 0.157 -0.682 L 0.512 -0.477 L 0.731 -0.682 Z" +
			"M 1.1 0 L 0.956 0.292 L 0.669 0.205 L 0.669 -0.205 L 0.956 -0.292 Z",
		COLOR: { BASE: 17, BRIGHTNESS_SHIFT: 2.5 },
		MIRROR_MASTER_ANGLE: true,
		GUNS: [],
	}
	for(let i = 0; i < 6; i++) {
		Class.hexagonBaseDeco.GUNS.push(
			{
				POSITION: [1.75, 3, -0.75, 7.5, 0, 60 * i, 0],
				PROPERTIES: { COLOR: { BASE: -1, BRIGHTNESS_SHIFT: 2.5, SATURATION_SHIFT: 0.9 }, DRAW_ABOVE: true },
			}, {
				POSITION: [1, 9, 0, 8.8, 0, 60 * i + 30, 0],
				PROPERTIES: { COLOR: { BASE: -1, BRIGHTNESS_SHIFT: 10, SATURATION_SHIFT: 1.15 } },
			},
		)
	}

	// Auras
	Class.auraSmall = {
		PARENT: ["auraBase"],
		LAYER: 30,
		CONTROLLERS: [["spin", {speed: 0.018}]],
		INDEPENDENT: true,
		DRAW_FILL: true,
		ALPHA: 0.4,
		LABEL: "Aura",
		COLOR: 0,
		BODY: { DAMAGE: 0.5 },
		BORDER_FIRST: true,
		SHAPE: "M 1 0 L 0.715 0.519 L 0.309 0.951 L -0.273 0.84 L -0.809 0.588 L -0.883 0 L -0.809 -0.588 L -0.273 -0.84 L 0.309 -0.951 L 0.715 -0.519 L 1 0" + 
			"L 0.309 0.951 L -0.809 0.588 L -0.809 -0.588 L 0.309 -0.951 L 1 0" + 
			"L 0 0 L 0.309 0.951 M 0 0 L -0.809 0.588 M 0 0 L -0.809 -0.588 M 0 0 L 0.309 -0.951",
	}
	Class.healAuraSmall = {
		PARENT: ["auraSmall"],
		LABEL: "Heal Aura",
		HEALER: true,
		COLOR: 12,
		DRAW_FILL: true,
		ALPHA: 0.4,
		BODY: { DAMAGE: 0.1 },
	}
	Class.auraMedium = {
		PARENT: ["auraBase"],
		LAYER: 30,
		CONTROLLERS: [["spin", {speed: 0.018}]],
		INDEPENDENT: true,
		DRAW_FILL: true,
		ALPHA: 0.4,
		LABEL: "Aura",
		COLOR: 0,
		BODY: { DAMAGE: 0.5 },
		BORDER_FIRST: true,
		SHAPE: "M 1 0 L 0.809 0.588 L 1 0 L 0.809 0.588 L 0.309 0.951 L -0.309 0.951 L -0.809 0.588 L -1 0 L -0.809 -0.588 L -0.309 -0.951 L 0.309 -0.951 L 0.809 -0.588 L 1 0" + 
			"L 0.856 0.278 L 0.809 0.588 L 0.551 0.759 L 0.309 0.951 L 0 0.9 L -0.309 0.951 L -0.551 0.759 L -0.809 0.588 L -0.856 0.278 L -1 0 L -0.892 -0.29 L -0.809 -0.588 L -0.529 -0.728 L -0.309 -0.951 L 0 -0.938 L 0.309 -0.951 L 0.529 -0.728 L 0.809 -0.588 L 0.892 -0.29 L 1 0" + 
			"M 0.856 0.278 L 0.551 0.759 L 0 0.9 L -0.551 0.759 L -0.856 0.278 L -0.892 -0.29 L -0.529 -0.728 L 0 -0.938 L 0.529 -0.728 L 0.892 -0.29 L 0.856 0.278" + 
			"M 0.892 -0.29 L 0.546 -0.178 L 0.856 0.278 L 0.338 0.465 L 0.551 0.759 M 0.338 0.465 L 0 0.9 L -0.338 0.465 L -0.551 0.759 M -0.338 0.465 L -0.856 0.278 L -0.546 -0.178 L -0.892 -0.29 M -0.546 -0.178 L -0.529 -0.728 L 0 -0.575 L 0 -0.938 M 0 -0.575 L 0.529 -0.728 L 0.546 -0.178" + 
			"L 0.338 0.465 L 0 0 L 0.546 -0.178 L 0 -0.575 L 0 0 L -0.546 -0.178 L -0.338 0.465 L 0 0 M 0 -0.575 L -0.546 -0.178 M -0.338 0.465 L 0.338 0.465",
	}
	Class.healAuraMedium = {
		PARENT: ["auraMedium"],
		LABEL: "Heal Aura",
		HEALER: true,
		COLOR: 12,
		DRAW_FILL: true,
		ALPHA: 0.4,
		BODY: { DAMAGE: 0.1 },
	}
	Class.auraLarge = {
		PARENT: ["auraBase"],
		LAYER: 30,
		CONTROLLERS: [["spin", {speed: 0.018}]],
		INDEPENDENT: true,
		DRAW_FILL: true,
		ALPHA: 0.4,
		LABEL: "Aura",
		COLOR: 0,
		BODY: { DAMAGE: 0.5 },
		BORDER_FIRST: true,
		SHAPE: "M 1 0 L 0.988 0.156 L 0.951 0.309 L 0.891 0.454 L 0.809 0.588 L 0.707 0.707 L 0.588 0.809 L 0.454 0.891 L 0.309 0.951 L 0.156 0.988 L 0 1 L -0.156 0.988 L -0.309 0.951 L -0.454 0.891 L -0.588 0.809 L -0.707 0.707 L -0.809 0.588 L -0.891 0.454 L -0.951 0.309 L -0.988 0.156 L -1 0 L -0.988 -0.156 L -0.951 -0.309 L -0.891 -0.454 L -0.809 -0.588 L -0.707 -0.707 L -0.588 -0.809 L -0.454 -0.891 L -0.309 -0.951 L -0.156 -0.988 L 0 -1 L 0.156 -0.988 L 0.309 -0.951 L 0.454 -0.891 L 0.588 -0.809 L 0.707 -0.707 L 0.809 -0.588 L 0.891 -0.454 L 0.951 -0.309 L 0.988 -0.156 L 1 0" + 
			"M 0.988 -0.156 L 0.988 0.156 L 0.891 0.454 L 0.707 0.707 L 0.454 0.891 L 0.156 0.988 L -0.156 0.988 L -0.454 0.891 L -0.707 0.707 L -0.891 0.454 L -0.988 0.156 L -0.988 -0.156 L -0.891 -0.454 L -0.707 -0.707 L -0.454 -0.891 L -0.156 -0.988 L 0.156 -0.988 L 0.454 -0.891 L 0.707 -0.707 L 0.891 -0.454 L 0.988 -0.156 L 0.949 0" + 
			"L 0.988 0.156 L 0.891 0.256 L 0.891 0.454 L 0.739 0.537 L 0.707 0.707 L 0.519 0.769 L 0.454 0.891 L 0.293 0.902 L 0.156 0.988 L 0.032 0.927 L -0.156 0.988 L -0.282 0.869 L -0.454 0.891 L -0.571 0.731 L -0.707 0.707 L -0.768 0.558 L -0.891 0.454 L -0.871 0.317 L -0.988 0.156 L -0.914 0 L -0.988 -0.156 L -0.871 -0.317 L -0.891 -0.454 L -0.768 -0.558 L -0.707 -0.707 L -0.571 -0.731 L -0.454 -0.891 L -0.282 -0.869 L -0.156 -0.988 L 0.032 -0.927 L 0.156 -0.988 L 0.293 -0.902 L 0.454 -0.891 L 0.519 -0.769 L 0.707 -0.707 L 0.739 -0.537 L 0.891 -0.454 L 0.891 -0.256 L 0.988 -0.156 L 0.949 0" + 
			"L 0.891 0.256 L 0.739 0.537 L 0.519 0.769 L 0.293 0.902 L 0.032 0.927 L -0.282 0.869 L -0.571 0.731 L -0.768 0.558 L -0.871 0.317 L -0.914 0 L -0.871 -0.317 L -0.768 -0.558 L -0.571 -0.731 L -0.282 -0.869 L 0.032 -0.927 L 0.293 -0.902 L 0.519 -0.769 L 0.739 -0.537 L 0.891 -0.256 L 0.949 0" + 
			"M 0.834 0 L 0.891 0.256 L 0.704 0.291 L 0.739 0.537 L 0.495 0.579 L 0.519 0.769 L 0.258 0.793 L 0.032 0.927 L -0.06 0.759 L -0.282 0.869 L -0.398 0.649 L -0.571 0.731 L -0.674 0.49 L -0.871 0.317 L -0.741 0.178 L -0.914 0 L -0.741 -0.178 L -0.871 -0.317 L -0.674 -0.49 L -0.571 -0.731 L -0.398 -0.649 L -0.282 -0.869 L -0.06 -0.759 L 0.032 -0.927 L 0.258 -0.793 L 0.519 -0.769 L 0.495 -0.579 L 0.739 -0.537 L 0.704 -0.291 L 0.891 -0.256 L 0.834 0" + 
			"L 0.704 0.291 L 0.495 0.579 L 0.258 0.793 L -0.06 0.759 L -0.398 0.649 L -0.674 0.49 L -0.741 0.178 L -0.741 -0.178 L -0.674 -0.49 L -0.398 -0.649 L -0.06 -0.759 L 0.258 -0.793 L 0.495 -0.579 L 0.704 -0.291 L 0.834 0" + 
			"M 0.592 0 L 0.704 0.291 L 0.413 0.3 L 0.495 0.579 L 0.183 0.563 L -0.06 0.759 L -0.158 0.485 L -0.398 0.649 L -0.479 0.348 L -0.741 0.178 L -0.51 0 L -0.741 -0.178 L -0.479 -0.348 L -0.398 -0.649 L -0.158 -0.485 L -0.06 -0.759 L 0.183 -0.563 L 0.495 -0.579 L 0.413 -0.3 L 0.704 -0.291 L 0.592 0" + 
			"L 0.413 0.3 L 0.183 0.563 L -0.158 0.485 L -0.479 0.348 L -0.51 0 L -0.479 -0.348 L -0.158 -0.485 L 0.183 -0.563 L 0.413 -0.3 L 0.592 0" + 
			"M 0.292 0 L 0.413 0.3 L 0.09 0.277 L -0.158 0.485 L -0.236 0.171 L -0.51 0 L -0.236 -0.171 L -0.158 -0.485 L 0.09 -0.277 L 0.413 -0.3 L 0.292 0 L 0.09 0.277" + 
			"L -0.236 0.171 L -0.236 -0.171 L 0.09 -0.277 L 0.292 0 M 0 0 L 0.949 0" + 
			"M 0 0 L 0.293 0.902 M 0 0 L -0.768 0.558 M 0 0 L -0.768 -0.558 M 0 0 L 0.293 -0.902",
	}
	Class.healAuraLarge = {
		PARENT: ["auraLarge"],
		LABEL: "Heal Aura",
		HEALER: true,
		COLOR: 12,
		DRAW_FILL: true,
		ALPHA: 0.4,
		BODY: { DAMAGE: 0.1 },
	}
	Class.auraSymbolSnowdreads = {
		PARENT: ["genericTank"],
		CONTROLLERS: [["spin", { speed: -0.04 }]],
		INDEPENDENT: true,
		COLOR: 0,
		BORDER_FIRST: true,
		SHAPE: "M 1 0 L 0.797 0.46 L 0.5 0.866 L 0 0.92 L -0.5 0.866 L -0.797 0.46 L -1 0 L -0.797 -0.46 L -0.5 -0.866 L 0 -0.92 L 0.5 -0.866 L 0.797 -0.46 L 1 0 Z" +
		"M 0.52 0.3 L 0.52 -0.3 L 0.797 -0.46 M 0.52 -0.3 L 0 -0.6 L 0 -0.92 M 0 -0.6 L -0.52 -0.3 L -0.797 -0.46 M -0.52 -0.3 L -0.52 0.3 L -0.797 0.46 M -0.52 0.3 L 0 0.6 L 0 0.92 M 0 0.6 L 0.52 0.3 L 0.797 0.46"
	}
	Class.healAuraSymbolSnowdreads = {
		PARENT: ["genericTank"],
		CONTROLLERS: [["spin", { speed: -0.04 }]],
		INDEPENDENT: true,
		COLOR: "red",
		BORDER_FIRST: true,
		SHAPE: "M 1 0 L 0.5 0.866 L -0.5 0.866 L -1 0 L -0.5 -0.866 L 0.5 -0.866 L 1 0 Z M 0.7 0 L 1 0 L 0.5 0.866 L 0.7 0 L -0.35 0.606 L 0.5 0.866 L -0.5 0.866 L -0.35 0.606 M -0.5 0.866 L -1 0 L -0.35 0.606 L -0.35 -0.606 L -1 0 L -0.5 -0.866 L -0.35 -0.606 L -0.5 -0.866 L 0.5 -0.866 L -0.35 -0.606 L 0.7 0 L 0.5 -0.866 L 1 0",
	};
	function addAura(damageFactor = 1, sizeFactor = 1, opacity = 0.3, auraColor, auraSize = "Medium") {
		let isHeal = damageFactor < 0;
		let auraType = isHeal ? "healAura" + auraSize : "aura" + auraSize;
		let symbolType = isHeal ? "healAuraSymbolSnowdreads" : "auraSymbolSnowdreads";
		auraColor = auraColor ?? (isHeal ? 12 : 0);
		return {
			PARENT: ["genericTank"],
			INDEPENDENT: true,
			LABEL: "",
			COLOR: 17,
			GUNS: [
				{
					POSITION: [0, 40, 1, 0, 0, 0, 0,],
					PROPERTIES: {
						SHOOT_SETTINGS: combineStats([g.aura, { size: sizeFactor, damage: damageFactor }]),
						TYPE: [auraType, {COLOR: auraColor, ALPHA: opacity}],
						MAX_CHILDREN: 1,
						AUTOFIRE: true,
						SYNCS_SKILLS: true,
					}, 
				}, 
			],
			TURRETS: [
				{
					POSITION: [20 - isHeal, 0, 0, 0, 360, 1],
					TYPE: [symbolType, {COLOR: auraColor, INDEPENDENT: true}],
				},
			]
		};
	}

	function addTrinoughtAuraRing(heal = false) {
		let output = [],
			TYPE = heal ? "trinoughtSmallHealAura" : "trinoughtSmallAura";
		for (let i = 0; i < 3; i++) {
			output.push(
				{
					POSITION: [3.5, 10.5, 0, 120*i+60, 360, 1],
					TYPE,
				},
			);
		}
		return output;
	}
	function addTrinoughtTurretRing() {
		let output = [];
		for (let i = 0; i < 3; i++) {
			output.push(
				{
					POSITION: [3.5, 10.5, 0, 120*i+60, 180, 1],
					TYPE: "spamAutoTurret",
				},
			);
		}
		return output;
	}
	function addPentanoughtAuraRing(heal = false) {
		let output = [],
			TYPE = heal ? "pentanoughtSmallHealAura" : "pentanoughtSmallAura";
		for (let i = 0; i < 5; i++) {
			output.push(
				{
					POSITION: [4, 8.5, 0, 72*i+36, 360, 1],
					TYPE,
				},
			)
		}
		return output;
	}
	function addPentanoughtTurretRing() {
		let output = [];
		for (let i = 0; i < 5; i++) {
			output.push(
				{
					POSITION: [3.25, 9, 0, 72*i+36, 180, 1],
					TYPE: "spamAutoTurret",
				},
			)
		}
		return output;
	}

	// Misc
	Class.genericDreadnoughtSnowdread = {
		PARENT: ["genericTank"],
		SKILL_CAP: Array(10).fill(smshskl),
		REROOT_UPGRADE_TREE: ["dreadWeaponSnowdread", "dreadBodySnowdread"],
	}
	Class.genericEggnought = {
		PARENT: ["genericDreadnoughtSnowdread"],
		BODY: eggnoughtBody,
	    SHAPE: 0,
	    COLOR: 6,
	    SIZE: 14,
		DANGER: 8,
	}
	Class.genericSquarenought = {
		PARENT: ["genericDreadnoughtSnowdread"],
		BODY: squarenoughtBody,
	    SHAPE: 4,
	    COLOR: 13,
	    SIZE: 18,
		DANGER: 9,
	}
	Class.genericTrinought = {
		PARENT: ["genericDreadnoughtSnowdread"],
		BODY: trinoughtBody,
	    SHAPE: 3.5,
	    COLOR: 2,
	    SIZE: 21,
		DANGER: 10,
	}
	Class.genericPentanought = {
		PARENT: ["genericDreadnoughtSnowdread"],
		BODY: pentanoughtBody,
	    SHAPE: 5.5,
	    COLOR: 14,
	    SIZE: 23,
		DANGER: 11,
	}
	Class.genericHexnought = {
		PARENT: ["genericDreadnoughtSnowdread"],
		BODY: hexnoughtBody,
	    SHAPE: 6,
	    COLOR: 0,
	    SIZE: 24,
		DANGER: 12,
	}

	Class.spamAutoTurret = {
		PARENT: ["autoTankGun"],
		INDEPENDENT: true,
		COLOR: 17,
		GUNS: [
			{
				POSITION: [17, 14, 1, 0, 0, 0, 0],
				PROPERTIES: {
					SHOOT_SETTINGS: combineStats([g.basic, g.flank, g.flank, g.auto, g.fake]),
					TYPE: "bullet",
					COLOR: {BASE: 17, BRIGHTNESS_SHIFT: -7.5}
				},
			}, {
				POSITION: [22, 10, 1, 0, 0, 0, 0],
				PROPERTIES: {
					SHOOT_SETTINGS: combineStats([g.basic, g.flank, g.flank, g.auto, {recoil: 0.2}]),
					TYPE: "bullet",
					COLOR: {BASE: -1, BRIGHTNESS_SHIFT: -10, SATURATION_SHIFT: 0.6}
				},
			}, {
				POSITION: [14, 12, 1, 0, 0, 0, 0],
				PROPERTIES: {
					SHOOT_SETTINGS: combineStats([g.basic, g.flank, g.flank, g.auto, g.fake]),
					TYPE: "bullet",
					COLOR: {BASE: 17, BRIGHTNESS_SHIFT: 7.5}
				},
			},
		],
		TURRETS: [
			{
				POSITION: [13, 0, 0, 0, 0, 1],
				TYPE: ["egg", {COLOR: /*{BASE: -1, BRIGHTNESS_SHIFT: -12.5, SATURATION_SHIFT: 0.7}*/ -1, BORDERLESS: true}],
			},
		],
	}
	Class.supermissile = {
		PARENT: ["bullet"],
		LABEL: "Missile",
		INDEPENDENT: true,
		BODY: {
			RANGE: 120,
		},
		GUNS: [
			{
				POSITION: [14, 6, 1, 0, -2, 130, 0],
				PROPERTIES: {
					AUTOFIRE: true,
					SHOOT_SETTINGS: combineStats([g.basic, g.skim, g.doublereload, g.lowpower, g.muchmorerecoil, g.morespeed, g.morespeed]),
					TYPE: ["bullet", {PERSISTS_AFTER_DEATH: true}],
					STAT_CALCULATOR: gunCalcNames.thruster,
				},
			}, {
				POSITION: [14, 6, 1, 0, 2, 230, 0],
				PROPERTIES: {
					AUTOFIRE: true,
					SHOOT_SETTINGS: combineStats([g.basic, g.skim, g.doublereload, g.lowpower, g.muchmorerecoil, g.morespeed, g.morespeed]),
					TYPE: ["bullet", {PERSISTS_AFTER_DEATH: true}],
					STAT_CALCULATOR: gunCalcNames.thruster,
				},
			}, {
				POSITION: [14, 6, 1, 0, 0, 0, 0.2],
				PROPERTIES: {
					AUTOFIRE: true,
					SHOOT_SETTINGS: combineStats([g.basic, g.skim, g.doublereload, g.morespeed, g.morespeed]),
					TYPE: ["bullet", {PERSISTS_AFTER_DEATH: true}],
				},
			},
		],
	};
	Class.betadrone = {
		PARENT: ["drone"],
		TURRETS: [
			{
				POSITION: [10, 0, 0, 180, 0, 1],
				TYPE: ["triangle", {COLOR: -1}],
			},
		]
	}
	Class.droneAutoTurretSnowdread = {
		PARENT: 'autoTurret',
		CONTROLLERS: ['nearestDifferentMaster'],
		INDEPENDENT: true,
		COLOR: {BASE: -1, BRIGHTNESS_SHIFT: -10, SATURATION_SHIFT: 0.8},
		GUNS: [
			{
				POSITION: [22, 10, 1, 0, 0, 0, 0],
				PROPERTIES: {
					SHOOT_SETTINGS: combineStats([g.basic, g.gunner, g.power, g.morerecoil, g.turret, g.overdrive]),
					TYPE: "bullet",
					COLOR: {BASE: -1, BRIGHTNESS_SHIFT: -5, SATURATION_SHIFT: 0.8},
				},
			},
		]
	}
	Class.turretedDroneSnowdread = {
		PARENT: 'drone',
		TURRETS: [
			{
				POSITION: [13, 0, 0, 0, 0, 1],
				TYPE: ['triangle', {MIRROR_MASTER_ANGLE: true, COLOR: {BASE: 17, BRIGHTNESS_SHIFT: 5}}],
			}, {
				POSITION: [10, 0, 0, 180, 360, 1],
				TYPE: 'droneAutoTurretSnowdread',
			},
		]
	}
	Class.honchoDroneSnowdread = {
		PARENT: 'drone',
		TURRETS: [
			{
				POSITION: [20, 0, 0, 180, 0, 1],
				TYPE: ["aggressorMinionTopSnowdread"],
			},
		]
	}

	// T0
	Class.dreadSnowdread = {
		PARENT: ["genericEggnought"],
		LABEL: "Dreadnought",
		UPGRADE_LABEL: "Snowdreads",
		LEVEL: 90,
		EXTRA_SKILL: 18,
	}
	Class.dreadWeaponSnowdread = {
		LABEL: "",
		COLOR: 6,
		REROOT_UPGRADE_TREE: "dreadWeaponSnowdread",
	}
	Class.dreadBodySnowdread = {
		LABEL: "",
		COLOR: 6,
		REROOT_UPGRADE_TREE: "dreadBodySnowdread",
	}

	// T1 Weapons
	Class.swordSnowdread = {
	    PARENT: ["genericEggnought"],
	    LABEL: "Sword",
	    GUNS: [],
	}
	for (let i = 0; i < 2; i++) {
		Class.swordSnowdread.GUNS.push(
			...addSniper({length: 20, width: 7, angle: 180 * i}, 0, [g.basic, g.sniper, g.assass, {reload: 0.85}])
		)
	}
	Class.sword2Snowdread = {
		PARENT: "swordSnowdread",
		BATCH_UPGRADES: true,
	}
	Class.pacifierSnowdread = {
	    PARENT: ["genericEggnought"],
	    LABEL: "Pacifier",
	    GUNS: [],
	}
	for (let i = 0; i < 2; i++) {
		Class.pacifierSnowdread.GUNS.push(
			...addNormal({length: 15, width: 7.5, angle: 180 * i}, 0, [g.basic, {reload: 0.8}])
		)
	}
	Class.pacifier2Snowdread = {
		PARENT: "pacifierSnowdread",
		BATCH_UPGRADES: true,
	}
	Class.peacekeeperSnowdread = {
	    PARENT: ["genericEggnought"],
	    LABEL: "Peacekeeper",
	    GUNS: [],
	}
	for (let i = 0; i < 2; i++) {
		Class.peacekeeperSnowdread.GUNS.push(
			...addHeavy({length: 17, width: 9, angle: 180*i}, 0, [g.basic, {reload: 1.2, damage: 1.5}]),
		)
	}
	Class.peacekeeper2Snowdread = {
		PARENT: "peacekeeperSnowdread",
		BATCH_UPGRADES: true,
	}
	Class.invaderSnowdread = {
	    PARENT: ["genericEggnought"],
	    LABEL: "Invader",
	    GUNS: [],
	}
	for (let i = 0; i < 2; i++) {
		Class.invaderSnowdread.GUNS.push(
			...addDrone({length: 5, width: 9, angle: 180*i}, 0, [g.drone, g.over, {reload: 0.85}])
		)
	}
	Class.invader2Snowdread = {
		PARENT: "invaderSnowdread",
		BATCH_UPGRADES: true,
	}
	Class.centaurSnowdread = {
	    PARENT: ["genericEggnought"],
	    LABEL: "Centaur",
	    GUNS: [],
	}
	for (let i = 0; i < 2; i++) {
		Class.centaurSnowdread.GUNS.push(
			...addTrap({length: 13, length2: 3, width: 7, angle: 180*i}, 0, [g.trap, {health: 2}])
		)
	}
	Class.centaur2Snowdread = {
		PARENT: "centaurSnowdread",
		BATCH_UPGRADES: true,
	}

	// T1 Bodies
	Class.byteTurretSnowdread = {
		PARENT: ["genericTank"],
		CONTROLLERS: ["nearestDifferentMaster"],
		INDEPENDENT: true,
		COLOR: {
			BASE: 6,
			BRIGHTNESS_SHIFT: -20,
			SATURATION_SHIFT: 0.5,
		},
		GUNS: [
			{
				POSITION: [18, 12, 1, 0, 0, 0, 0],
				PROPERTIES: {
					SHOOT_SETTINGS: combineStats([g.basic, g.flank, g.auto, g.fake]),
					TYPE: "bullet",
					COLOR: { BASE: 17, BRIGHTNESS_SHIFT: 5 },
				},
			}, { // Main gun
				POSITION: [22, 10, 1, 0, 0, 0, 0],
				PROPERTIES: {
					SHOOT_SETTINGS: combineStats([g.basic, g.flank, g.auto]),
					TYPE: "bullet",
					COLOR: { BASE: -1, BRIGHTNESS_SHIFT: -20, SATURATION_SHIFT: 0.5 },
				},
			}, {
				POSITION: [18.5, 6.5, 1, 0, 0, 0, 0],
				PROPERTIES: {
					SHOOT_SETTINGS: combineStats([g.basic, g.flank, g.auto, g.fake]),
					TYPE: "bullet",
					COLOR: { BASE: -1, BRIGHTNESS_SHIFT: -10, SATURATION_SHIFT: 0.5 },
					BORDERLESS: true,
				},
			}, {
				POSITION: [14.5, 2, 1, 0, 5, 0, 0],
				PROPERTIES: {
					SHOOT_SETTINGS: combineStats([g.basic, g.flank, g.auto, g.fake]),
					TYPE: "bullet",
					COLOR: { BASE: 17, BRIGHTNESS_SHIFT: 15 },
				},
			}, {
				POSITION: [14.5, 2, 1, 0, -5, 0, 0],
				PROPERTIES: {
					SHOOT_SETTINGS: combineStats([g.basic, g.flank, g.auto, g.fake]),
					TYPE: "bullet",
					COLOR: { BASE: 17, BRIGHTNESS_SHIFT: 15 },
				},
			}, {
				POSITION: [10, 6, 0.5, 0, 0, 123, 0],
				PROPERTIES: { 
					COLOR: 17,
					DRAW_ABOVE: true,
				}
			}, {
				POSITION: [10, 6, 0.5, 0, 0, -123, 0],
				PROPERTIES: { 
					COLOR: 17,
					DRAW_ABOVE: true,
				}
			}
		],
		TURRETS: [
			{
				POSITION: [14.5, 0, 0, 0, 0, 1],
				TYPE: ["egg", { COLOR: { BASE: -1, BRIGHTNESS_SHIFT: -20, SATURATION_SHIFT: 0.5 } }],
			}, {
				POSITION: [8, 0, 0, 0, 0, 1],
				TYPE: ["egg", { COLOR: { BASE: -1 } }]
			},
		]
	}
	Class.byteSnowdread = {
	    PARENT: ["genericEggnought"],
		LABEL: "Byte",
	    TURRETS: [
			{
				POSITION: [15, 0, 0, 0, 0, 1],
				TYPE: 'egg',
			}, {
				POSITION: [20, 0, 0, 0, 0, 1],
				TYPE: "eggBaseDeco",
			}, {
				POSITION: [9, 0, 0, 0, 360, 1],
				TYPE: 'byteTurretSnowdread',
			},
		],
	}
	Class.showerTurretSnowdread = {
		PARENT: "genericTank",
		LABEL: "",
		BODY: { FOV: 1.5 },
		CONTROLLERS: [[ 'spin', {speed: 0.03}]],
		COLOR: {
			BASE: 6,
			BRIGHTNESS_SHIFT: -20,
			SATURATION_SHIFT: 0.5,
		},
		INDEPENDENT: true,
		MAX_CHILDREN: 4,
		GUNS: [
			...addDroneOnAuto({length: 6, width: 12, x: 8}, 0, [g.drone, {size: 1.3}])
		],
		TURRETS: [
			{
				POSITION: [14.5, 0, 0, 0, 0, 1],
				TYPE: ["egg", { COLOR: { BASE: -1, BRIGHTNESS_SHIFT: -20, SATURATION_SHIFT: 0.5 } }],
			}, {
				POSITION: [8, 0, 0, 0, 0, 1],
				TYPE: ["egg", { COLOR: { BASE: -1 } }]
			},
		]
	}
	Class.showerSnowdread = { // Drones
	    PARENT: ["genericEggnought"],
	    LABEL: "Shower",
	    BODY: {
			SPEED: 0.93,
			FOV: 1.1,
		},
		TURRETS: [
			{
				POSITION: [15, 0, 0, 0, 0, 1],
				TYPE: 'egg',
			}, {
				POSITION: [20, 0, 0, 0, 0, 1],
				TYPE: "eggBaseDeco",
			}, {
				POSITION: [10, 0, 0, 0, 360, 1],
				TYPE: "showerTurretSnowdread",
			},
		],
	}
	Class.atmosphereAuraSnowdread = addAura();
	Class.atmosphereSnowdread = {
	    PARENT: ["genericEggnought"],
	    LABEL: "Atmosphere",
	    TURRETS: [
			{
				POSITION: [14, 0, 0, 0, 0, 1],
				TYPE: 'egg',
			}, {
				POSITION: [20, 0, 0, 0, 0, 1],
				TYPE: "eggBaseDeco",
			}, {
				POSITION: [11, 0, 0, 0, 360, 1],
				TYPE: 'atmosphereAuraSnowdread',
			},
		],
	}
	Class.juggernautSnowdread = {
	    PARENT: ["genericEggnought"],
	    LABEL: "Juggernaut",
		BODY: {
			HEALTH: 1.6,
			SHIELD: 1.6,
			REGEN: 1.5,
			SPEED: 0.8,
		},
	    TURRETS: [
			{
				POSITION: [20, 0, 0, 0, 0, 1],
				TYPE: "eggBaseDeco",
			}, {
				POSITION: [13, 0, 0, 0, 0, 1],
				TYPE: ['egg', {COLOR: {BASE: 9, BRIGHTNESS_SHIFT: 5}, BORDERLESS: true}],
			}, {
				POSITION: [6.5, 0, 0, 0, 0, 1],
				TYPE: ['hexagon', {COLOR: {BASE: 9, BRIGHTNESS_SHIFT: 15}, BORDERLESS: true, MIRROR_MASTER_ANGLE: true}],
			}, {
				POSITION: [24, 0, 0, 0, 0, 0],
				TYPE: ['egg', {COLOR: 9}]
			},
		],
	}
	Class.stomperTurretSnowdread = {
		PARENT: 'genericTank',
		MIRROR_MASTER_ANGLE: true,
		LABEL: "",
		COLOR: -1,
		GUNS: [],
		TURRETS: [
			{
				POSITION: [10, 0, 0, 0, 0, 1],
				TYPE: ["egg", {COLOR: {BASE: -1, BRIGHTNESS_SHIFT: -15}}]
			}
		]
	}
	for(let i = 0; i < 2; i++) {
		Class.stomperTurretSnowdread.GUNS.push(
			{
				POSITION: [17, 17, -0.2, 0, 0, 180*i, 0],
				PROPERTIES: {COLOR: 9},
			}, {
				POSITION: [15, 12.5, -0.2, 0, 0, 180*i, 0],
				PROPERTIES: { COLOR: { BASE: 9, BRIGHTNESS_SHIFT: 7.5 }, BORDERLESS: true },
			},
		)
	}
	Class.stomperSnowdread = { // Size increase
	    PARENT: ["genericEggnought"],
		LABEL: "Stomper",
		SIZE: 1.2,
		BODY: {
			SPEED: 0.9,
			HEALTH: 1.6,
		},
		TURRETS: [
			{
				POSITION: [20, 0, 0, 0, 0, 1],
				TYPE: "eggBaseDeco",
			}, {
				POSITION: [10, 0, 0, 0, 0, 1],
				TYPE: 'stomperTurretSnowdread',
			},
		],
	}
	Class.dropperTurretSnowdread = {
		PARENT: 'genericTank',
		CONTROLLERS: [["spin", {speed: -0.035}]],
		INDEPENDENT: true,
		LABEL: "",
		COLOR: { BASE: 17, BRIGHTNESS_SHIFT: 15 },
		GUNS: [
			{ 
				POSITION: [13, 25, 1, -6.5, 0, 0, 0],
				PROPERTIES: { COLOR: { BASE: -1, BRIGHTNESS_SHIFT: -20 } },
			}, { 
				POSITION: [8, 32, 1, -4, 0, 0, 0],
				PROPERTIES: { COLOR: { BASE: 17, BRIGHTNESS_SHIFT: 5 } },
			},
		],
		TURRETS: [
			{
				POSITION: [14, 0, 0, 0, 0, 1],
				TYPE: ["egg", { COLOR: { BASE: -1, BRIGHTNESS_SHIFT: -20, SATURATION_SHIFT: 0.5 } }],
			}, {
				POSITION: [6.5, 0, 0, 0, 0, 1],
				TYPE: ["egg", { COLOR: { BASE: -1 } }]
			},
		]
	}
    Class.dropperSnowdread = { // Minelayer
	    PARENT: ["genericEggnought"],
	    LABEL: "Dropper",
		GUNS: [
			{
				POSITION: [0, 7, 1, 3, 0, 0, 0],
				PROPERTIES: {
					SHOOT_SETTINGS: combineStats([g.trap, {recoil: 0, maxSpeed: 1e-3, speed: 1e-3}]),
					TYPE: 'trap',
					STAT_CALCULATOR: gunCalcNames.trap,
				},
			}
		],
		TURRETS: [
			{
				POSITION: [14, 0, 0, 0, 0, 1],
				TYPE: 'egg',
			}, {
				POSITION: [20, 0, 0, 0, 0, 1],
				TYPE: "eggBaseDeco",
			}, {
				POSITION: [10, 0, 0, 0, 360, 1],
				TYPE: 'dropperTurretSnowdread',
			}
		],
	}
	Class.spotterRadarSnowdread = {
		PARENT: 'genericTank',
		CONTROLLERS: [['spin', {speed: 0.02}]],
		INDEPENDENT: true,
		SHAPE: [[0.225, 1], [0.225, -1], [-0.225, -1], [-0.225, 1]],
		COLOR: 17,
		GUNS: [
			{
				POSITION: [4.5, 26, 1, -2.25, 0, 0, 0],
				PROPERTIES: {COLOR: -1}
			}, {
				POSITION: [7, 17, 1, -3.5, 0, 0, 0],
				PROPERTIES: {COLOR: {BASE: -1, BRIGHTNESS_SHIFT: -20}}
			},
		]
	};
    Class.spotterSnowdread = { // FOV
	    PARENT: ["genericEggnought"],
	    LABEL: "Spotter",
		BODY: {
			FOV: 1.1,
		},
	    TURRETS: [
			{
				POSITION: [15, 0, 0, 0, 0, 1],
				TYPE: 'egg',
			}, {
				POSITION: [20, 0, 0, 0, 0, 1],
				TYPE: "eggBaseDeco",
			}, {
				POSITION: [9, 0, 0, 0, 0, 1],
				TYPE: 'egg',
			}, {
				POSITION: [13, 0, 0, 0, 360, 1],
				TYPE: 'spotterRadarSnowdread',
			},
		],
	}

	// T2 Weapons
	Class.sabreSnowdread = {
	    PARENT: ["genericSquarenought"],
	    LABEL: "Sabre",
	    GUNS: [],
	}
	for (let i = 0; i < 4; i++) {
		Class.sabreSnowdread.GUNS.push(
			...addAssassin({length: 24, width: 7, x: 7, angle: 90*i}, 7.5, [g.basic, g.sniper, g.assass, g.assass, {reload: 0.85}])
		)
	}
	Class.gladiusSnowdread = {
	    PARENT: ["genericSquarenought"],
	    LABEL: "Gladius",
	    GUNS: [],
	}
	for (let i = 0; i < 4; i++) {
		Class.gladiusSnowdread.GUNS.push(
			...addRifle({length: 19.5, width: 5, angle: 90*i}, -2.5, [g.basic, g.sniper, g.rifle, {health: 1.3}])
		)
	}
	Class.slingSnowdread = { // hunter
	    PARENT: ["genericSquarenought"],
	    LABEL: "Sling",
		CONTROLLERS: [["zoom", { distance: 300 }]],
    	TOOLTIP: "Hold right click to zoom.",
	    GUNS: [],
	}
	for (let i = 0; i < 4; i++) {
		Class.slingSnowdread.GUNS.push(
			...addHunter({length: 17, width: 9, angle: 90*i}, -10, [g.basic, g.sniper, g.hunter, {health: 1.1, speed: 1.05}])
		)
	}
	Class.catapultSnowdread = { // mega-sniper
	    PARENT: ["genericSquarenought"],
	    LABEL: "Catapult",
	    GUNS: [],
	}
	for (let i = 0; i < 4; i++) {
		Class.catapultSnowdread.GUNS.push(
			...addHeavySniper({length: 22, width: 9, angle: 90*i}, -2.5, [g.basic, g.sniper, g.preda, g.preda, g.preda, g.bitlessspeed, g.one_third_reload, {size: 2}])
		)
	}
	Class.dartSnowdread = { // railgun
	    PARENT: ["genericSquarenought"],
	    LABEL: "Dart",
	    GUNS: [],
	}
	for (let i = 0; i < 4; i++) {
		Class.dartSnowdread.GUNS.push(
			...addRailgun({length: 25, width: 4, x: 7, angle: 90*i}, -2.5, [g.basic, g.sniper, g.sniper, g.sniper, g.pound, g.lessreload])
		)
	}
	Class.mediatorSnowdread = {
	    PARENT: ["genericSquarenought"],
	    LABEL: "Mediator",
	    GUNS: [],
	}
	for (let i = 0; i < 4; i++) {
		Class.mediatorSnowdread.GUNS.push(
			...addNormal({length: 15, width: 7, y: 4.25, angle: 90*i}, 5, [g.basic, g.twin, {reload: 0.85}]),
			...addNormal({length: 15, width: 7, y: -4.25, angle: 90*i, delay: 0.5}, 5, [g.basic, g.twin, {reload: 0.85}]),
		)
	}
	Class.negotiatorSnowdread = {
	    PARENT: ["genericSquarenought"],
	    LABEL: "Negotiator",
	    GUNS: [],
	}
	for (let i = 0; i < 4; i++) {
		Class.negotiatorSnowdread.GUNS.push(
			...addNormal({length: 9, width: 8, aspect: 1.4, x: 6, angle: 90*i}, 5, [g.basic, g.mach, {size: 0.8, health: 1.3}]),
		)
	}
	Class.melderAutoSnowdread = {
		PARENT: 'autoTankGun',
		GUNS: [
			{
				POSITION: [18, 12, 1, 0, 0, 0, 0],
				PROPERTIES: {
					SHOOT_SETTINGS: combineStats([g.basic, g.flank, g.auto, {reload: 1.1}, g.fake]),
					TYPE: "bullet",
					COLOR: { BASE: 17, BRIGHTNESS_SHIFT: 5 },
				},
			}, { // Main gun
				POSITION: [22, 10, 1, 0, 0, 0, 0],
				PROPERTIES: {
					SHOOT_SETTINGS: combineStats([g.basic, g.flank, g.auto, {reload: 1.1}]),
					TYPE: "bullet",
					COLOR: { BASE: -1, BRIGHTNESS_SHIFT: -17.5, SATURATION_SHIFT: 0.5 },
				},
			}, {
				POSITION: [18.5, 6.5, 1, 0, 0, 0, 0],
				PROPERTIES: {
					SHOOT_SETTINGS: combineStats([g.basic, g.flank, g.auto, {reload: 1.1}, g.fake]),
					TYPE: "bullet",
					COLOR: { BASE: -1, BRIGHTNESS_SHIFT: -7.5, SATURATION_SHIFT: 0.5 },
					BORDERLESS: true,
				},
			}, {
				POSITION: [14.5, 2, 1, 0, 5, 0, 0],
				PROPERTIES: {
					SHOOT_SETTINGS: combineStats([g.basic, g.flank, g.auto, {reload: 1.1}, g.fake]),
					TYPE: "bullet",
					COLOR: { BASE: 17, BRIGHTNESS_SHIFT: 15 },
				},
			}, {
				POSITION: [14.5, 2, 1, 0, -5, 0, 0],
				PROPERTIES: {
					SHOOT_SETTINGS: combineStats([g.basic, g.flank, g.auto, {reload: 1.1}, g.fake]),
					TYPE: "bullet",
					COLOR: { BASE: 17, BRIGHTNESS_SHIFT: 15 },
				},
			},
		],
		TURRETS: [
			{
				POSITION: [14.5, 0, 0, 0, 0, 1],
				TYPE: ["egg", { COLOR: { BASE: -1, BRIGHTNESS_SHIFT: -15, SATURATION_SHIFT: 0.5 } }],
			}, {
				POSITION: [8, 0, 0, 0, 0, 1],
				TYPE: ["egg", { COLOR: { BASE: -1 } }]
			},
		]
	}
	Class.melderSnowdread = { // all auto
	    PARENT: ["genericSquarenought"],
	    LABEL: "Melder",
		TURRETS: [],
	}
	for(let i = 0; i < 4; i++) {
		Class.melderSnowdread.TURRETS.push(
			{
				POSITION: [10, 9, 0, 90*i, 195, 0],
				TYPE: 'melderAutoSnowdread',
			},
		)
	  }
	Class.crackerSnowdread = { // ultra bullet spam
	    PARENT: ["genericSquarenought"],
	    LABEL: "Cracker",
	    GUNS: [],
	}
	for(let i = 0; i < 4; i++) {
		Class.crackerSnowdread.GUNS.push(
			...addSpam({length: 19, width: 8, angle: 90*i}, -10, [g.basic, g.mini, {reload: 0.85}]),
			...addSpam({length: 17, width: 8, angle: 90*i, delay: 1/3}, -10, [g.basic, g.mini, {reload: 0.85}]),
			...addSpam({length: 15, width: 8, angle: 90*i, delay: 2/3}, -10, [g.basic, g.mini, {reload: 0.85}]),
		)
	}
	Class.grabberTurretSnowdread = {
		PARENT: ["spamAutoTurret"],
		GUNS: [
			{
				POSITION: [17, 14, 1, 0, 0, 0, 0],
				PROPERTIES: {
					SHOOT_SETTINGS: combineStats([g.basic, g.flank, g.flank, g.flank, g.auto, g.fake]),
					TYPE: "bullet",
					COLOR: {BASE: 17, BRIGHTNESS_SHIFT: -7.5}
				},
			}, {
				POSITION: [22, 10, 1, 0, 0, 0, 0],
				PROPERTIES: {
					SHOOT_SETTINGS: combineStats([g.basic, g.flank, g.flank, g.flank, g.auto, {recoil: 0.2}]),
					TYPE: "bullet",
					COLOR: {BASE: -1, BRIGHTNESS_SHIFT: -10, SATURATION_SHIFT: 0.6}
				},
			}, {
				POSITION: [14, 12, 1, 0, 0, 0, 0],
				PROPERTIES: {
					SHOOT_SETTINGS: combineStats([g.basic, g.flank, g.flank, g.flank, g.auto, g.fake]),
					TYPE: "bullet",
					COLOR: {BASE: 17, BRIGHTNESS_SHIFT: 7.5}
				},
			},
		],
	};
	Class.grabberSnowdread = { // crowbar
	    PARENT: ["genericSquarenought"],
	    LABEL: "Grabber",
	    GUNS: [],
		TURRETS: [],
	}
	for(let i = 0; i < 4; i++) {
		Class.grabberSnowdread.GUNS.push(
			...addCrowbar({x: 8, angle: 90*i}, -2.5)
		)
		Class.grabberSnowdread.TURRETS.push(
			{
				POSITION: [6.5, 38, 0, 90*i, 200, 1],
				TYPE: 'grabberTurretSnowdread',
			},
			{
				POSITION: [6.5, 28, 0, 90*i, 200, 1],
				TYPE: 'grabberTurretSnowdread',
			},
		)
	}
	Class.enforcerSnowdread = {
	    PARENT: ["genericSquarenought"],
	    LABEL: "Enforcer",
	    GUNS: [],
	}
	for (let i = 0; i < 4; i++) {
		Class.enforcerSnowdread.GUNS.push(
			...addHeavy({length: 17, width: 9, angle: 90*i}, 0, [g.basic, g.pound, {reload: 0.9}])
		)
	}
	Class.executorSnowdread = {
	    PARENT: ["genericSquarenought"],
	    LABEL: "Executor",
	    GUNS: [],
	}
	for (let i = 0; i < 4; i++) {
		Class.executorSnowdread.GUNS.push(
			...addLauncher({length: 17, width: 9, angle: 90*i}, -5, [g.basic, g.pound, g.arty, g.halfspeed, {maxSpeed: 0.8, reload: 0.8}])
		)
	}
	Class.doserSnowdread = { // shotgun
	    PARENT: ["genericSquarenought"],
	    LABEL: "Doser",
	    GUNS: [],
	}
	for(let i = 0; i < 4; i++) {
		Class.doserSnowdread.GUNS.push(
			...addShotgun({length: 21, width: 12, x: 6, angle: 90*i}, -2.5, [
				{l: 15, w: 3, y: -3},
				{l: 14, w: 3, y: 3},
				{l: 17, w: 4, y: 0},
				{l: 13, w: 4, y: -1},
				{l: 12, w: 4, y: 1},
			], [g.basic, g.mach, g.shotgun, {health: 1.4, damage: 1.4}]),
		)
	}
	Class.swirlMissileSnowdread = {
		PARENT: 'spinmissile',
		GUNS: [
			{
				POSITION: [14, 8, 1, 0, 0, 0, 0],
				PROPERTIES: {
					AUTOFIRE: !0,
					SHOOT_SETTINGS: combineStats([g.basic, g.skim, g.morespeed]),
					TYPE: [ "bullet", { PERSISTS_AFTER_DEATH: true } ],
					STAT_CALCULATOR: gunCalcNames.thruster,
				},
			},
			{
				POSITION: [14, 8, 1, 0, 0, 180, 0],
				PROPERTIES: {
					AUTOFIRE: !0,
					SHOOT_SETTINGS: combineStats([g.basic, g.skim, g.morespeed]),
					TYPE: [ "bullet", { PERSISTS_AFTER_DEATH: true } ],
					STAT_CALCULATOR: gunCalcNames.thruster,
				},
			},
		],
	}
	Class.swirlSnowdread = { // twister
	    PARENT: ["genericSquarenought"],
	    LABEL: "Swirl",
	    GUNS: [],
	}
	for(let i = 0; i < 4; i++) {
		Class.swirlSnowdread.GUNS.push(
			...addTwister({length: 17, width: 10, angle: 90*i}, -5, [g.basic, g.pound, g.arty, g.arty, g.skim, g.morespeed, g.one_third_reload], "swirlMissileSnowdread")
		)
	}
	Class.pelterSnowdread = { // artillery
	    PARENT: ["genericSquarenought"],
	    LABEL: "Pelter",
	    GUNS: [],
	}
	for(let i = 0; i < 4; i++) {
		Class.pelterSnowdread.GUNS.push(
			...addGunner({length: 15, width: 3, y: -3.5, angle: 90*i-7, delay: 0.25}, -5, [g.basic, g.gunner, g.arty, {health: 1.1}]),
			...addGunner({length: 15, width: 3, y: 3.5, angle: 90*i+7, delay: 0.75}, -5, [g.basic, g.gunner, g.arty, {health: 1.1}]),
			...addHeavy({length: 17, width: 8, angle: 90*i}, -5, [g.basic, g.pound, g.arty, {health: 1.1}]),
		)
	}
	Class.inquisitorSnowdread = {
	    PARENT: ["genericSquarenought"],
	    LABEL: "Inquisitor",
	    GUNS: [],
	}
	for (let i = 0; i < 4; i++) {
		Class.inquisitorSnowdread.GUNS.push(
			...addDrone({length: 5, width: 11, aspect: 1.1, x: 8, angle: 90*i}, -7.5, [g.drone, g.over, g.over, {size: 1.5, reload: 0.6}], 3)
		)
	}
	Class.assailantMinionTopSnowdread = {
		SHAPE: "M 0.5 0 L 1 1 L 0 0.5 L -1 1 L -0.5 0 L -1 -1 L 0 -0.5 L 1 -1 L 0.5 0",
		COLOR: {BASE: -1, BRIGHTNESS_SHIFT: -5, SATURATION_SHIFT: 0.75},
		MIRROR_MASTER_ANGLE: true,
	}
	Class.assailantMinionSnowdread = {
		PARENT: ["minion"],
		BODY: { SPEED: 0.5 },
		SHAPE: 4,
	    COLOR: 13,
		GUNS: [],
		TURRETS: [
			{
				POSITION: [20, 0, 0, 0, 0, 1],
				TYPE: ["square", {COLOR: {BASE: 17, BRIGHTNESS_SHIFT: 7.5}, MIRROR_MASTER_ANGLE: true}]
			}, {
				POSITION: [20, 0, 0, 0, 0, 1],
				TYPE: "assailantMinionTopSnowdread"
			}
		]
	}
	for (let i = 0; i < 4; i++) {
		Class.assailantMinionSnowdread.GUNS.push(
			...addGunner({length: 15, width: 7.5, angle: 90*i}, -5, [g.basic, g.assass, g.minion])
		)
	}
	Class.assailantSnowdread = {
	    PARENT: ["genericSquarenought"],
	    LABEL: "Assailant",
	    GUNS: [],
	}
	for (let i = 0; i < 4; i++) {
		Class.assailantSnowdread.GUNS.push(
			...addMinion({length: 12, gap: 3, width: 11, angle: 90*i}, -2.5, [g.factory, {size: 0.9, reload: 0.5}])
		)
	}
	Class.radiationSnowdread = { // auto-drones
	    PARENT: ["genericSquarenought"],
	    LABEL: "Radiation",
	    GUNS: [],
	}
	for(let i = 0; i < 4; i++) {
		Class.radiationSnowdread.GUNS.push(
			...addAutoDrone({length: 6, width: 10, angle: 90*i}, -5, [g.drone, g.over, {reload: 0.8}], 3)
		)
	};
	Class.boxerSnowdread = { // honcho
	    PARENT: ["genericSquarenought"],
	    LABEL: "Boxer",
	    GUNS: [],
	}
	for(let i = 0; i < 4; i++) {
		Class.boxerSnowdread.GUNS.push(
			...addHoncho({length: 5, width: 11, aspect: 1.5, x: 8, angle: 90*i}, -5, [g.drone, g.over, g.over, g.honcho], i % 2 + 1)
		)
	};
	Class.disablerSnowdread = { // swarms
	    PARENT: ["genericSquarenought"],
	    LABEL: "Disabler",
	    GUNS: [],
	}
	for(let i = 0; i < 4; i++) {
		Class.disablerSnowdread.GUNS.push(
			...addSwarm({length: 7, width: 7, x: 6, y: 3.5, angle: 90*i}, -5, [g.swarm, g.over, g.over, g.lessreload]),
			...addSwarm({length: 7, width: 7, x: 6, y: -3.5, angle: 90*i, delay: 0.5}, -5, [g.swarm, g.over, g.over, g.lessreload]),
		)
	};
	Class.daemonSnowdread = {
	    PARENT: ["genericSquarenought"],
	    LABEL: "Daemon",
	    GUNS: [],
	}
	for (let i = 0; i < 4; i++) {
		Class.daemonSnowdread.GUNS.push(
			...addTrap({length: 11, length2: 2, width: 4.5, aspect: 1.7, y: 4.5, angle: 90*i}, 1.5, [g.trap, g.twin, {health: 2}]),
			...addTrap({length: 11, length2: 2, width: 4.5, aspect: 1.7, y: -4.5, angle: 90*i}, 1.5, [g.trap, g.twin, {health: 2}]),
		)
	}
	Class.minotaurSnowdread = {
	    PARENT: ["genericSquarenought"],
	    LABEL: "Minotaur",
	    GUNS: [],
	}
	for (let i = 0; i < 4; i++) {
		Class.minotaurSnowdread.GUNS.push(
			...addTrap({length: 13, length2: 3.75, width: 7, aspect: 1.75, angle: 90*i}, 0, [g.trap, g.block, {health: 2}], true),
		)
	}
	Class.autoTrap = {
		PARENT: 'trap',
		TURRETS: [
			{
				POSITION: [11, 0, 0, 0, 360, 1],
				TYPE: "pillboxTurret",
			},
		],
	}
	Class.cleanerSnowdread = { // auto-traps
	    PARENT: ["genericSquarenought"],
	    LABEL: "Cleaner",
	    GUNS: [],
	}
	for(let i = 0; i < 4; i++) {
		Class.cleanerSnowdread.GUNS.push(
			...addAutoTrap({length: 15, width: 6, aspect: 1.7, angle: 90*i}, -5, [g.trap, {health: 1.2, reload: 1.15}])
		)
	}
	Class.auraTrapAura = addAura(1/3, 2, 0.15, 0, "Small");
	Class.auraTrap = makeAuto(Class.trap, "", {type: 'auraTrapAura'});
	Class.shadeSnowdread = { // aura-traps
	    PARENT: ["genericSquarenought"],
	    LABEL: "Shade",
	    GUNS: [],
	}
	for(let i = 0; i < 4; i++) {
		Class.shadeSnowdread.GUNS.push(
			...addAuraTrap({length: 14, length2: 3, width: 7, aspect: 1.6, angle: 90*i}, -5, [g.trap, g.hexatrap, {range: 0.8, health: 1.2}])
		)
	}
	Class.screwdriverSnowdread = { // trap + gun
	    PARENT: ["genericSquarenought"],
	    LABEL: "Screwdriver",
	    GUNS: [],
	}
	for(let i = 0; i < 4; i++) {
		Class.screwdriverSnowdread.GUNS.push(
			...addNormal({length: 19, width: 7, angle: 90*i}, 0, [g.basic, g.flank]),
			...addTrap({length: 13, length2: 3.75, width: 7, aspect: 1.75, angle: 90*i}, 1.5, [g.trap, g.hexatrap]),
		)
	}

	// T2 Bodies
	Class.automationSnowdread = {
	    PARENT: ["genericSquarenought"],
	    LABEL: "Automation",
	    TURRETS: [
			{
				POSITION: [11, 0, 0, 0, 0, 1],
				TYPE: ["square", {MIRROR_MASTER_ANGLE: true, COLOR: {BASE: -1, BRIGHTNESS_SHIFT: 7.5}}],
			}, {
				POSITION: [20, 0, 0, 0, 0, 1],
				TYPE: ["squareBaseDeco"],
			}, {
				POSITION: [8, 0, 0, 0, 0, 1],
				TYPE: ["square", {MIRROR_MASTER_ANGLE: true, BORDERLESS: true, COLOR: {BASE: -1, BRIGHTNESS_SHIFT: 15}}],
			},
		],
	}
	for (let i = 0; i < 4; i++) {
		Class.automationSnowdread.TURRETS.push(
			{
				POSITION: [4, 9, 0, 90*i+45, 180, 1],
				TYPE: "spamAutoTurret",
			},
		)
	}
	Class.kilobyteTurretSnowdread = {
		PARENT: ["genericTank"],
		CONTROLLERS: ["nearestDifferentMaster"],
		INDEPENDENT: true,
		COLOR: { BASE: -1, BRIGHTNESS_SHIFT: -15, SATURATION_SHIFT: 0.65 },
		GUNS: [
			{
				POSITION: [21, 12, -1.4, 0, 0, 0, 0],
				PROPERTIES: {
					SHOOT_SETTINGS: combineStats([g.basic, g.assass, g.auto, g.fake]),
					TYPE: "bullet",
					COLOR: { BASE: 17, BRIGHTNESS_SHIFT: 5 },
				},
			}, { // Main gun
				POSITION: [26, 10, 1, 0, 0, 0, 0],
				PROPERTIES: {
					SHOOT_SETTINGS: combineStats([g.basic, g.assass, g.auto, {health: 1.2, speed: 0.8}]),
					TYPE: "bullet",
					COLOR: { BASE: -1, BRIGHTNESS_SHIFT: -17.5, SATURATION_SHIFT: 0.65 },
				},
			}, {
				POSITION: [21.5, 6.5, 1, 0, 0, 0, 0],
				PROPERTIES: {
					SHOOT_SETTINGS: combineStats([g.basic, g.assass, g.auto, g.fake]),
					TYPE: "bullet",
					COLOR: { BASE: -1, BRIGHTNESS_SHIFT: -7.5, SATURATION_SHIFT: 0.75 },
					BORDERLESS: true,
				},
			}, {
				POSITION: [16.5, 2, -1.35, 0, 5.1, 0, 0],
				PROPERTIES: {
					SHOOT_SETTINGS: combineStats([g.basic, g.assass, g.auto, g.fake]),
					TYPE: "bullet",
					COLOR: { BASE: 17, BRIGHTNESS_SHIFT: 15 },
				},
			}, {
				POSITION: [16.5, 2, -1.35, 0, -5.1, 0, 0],
				PROPERTIES: {
					SHOOT_SETTINGS: combineStats([g.basic, g.assass, g.auto, g.fake]),
					TYPE: "bullet",
					COLOR: { BASE: 17, BRIGHTNESS_SHIFT: 15 },
				},
			}, {
				POSITION: [10, 8, 0.5, 0, 0, 73, 0],
				PROPERTIES: { COLOR: 17, DRAW_ABOVE: true }
			}, {
				POSITION: [10, 8, 0.5, 0, 0, -73, 0],
				PROPERTIES: { COLOR: 17, DRAW_ABOVE: true }
			}, {
				POSITION: [10, 8, 0.5, 0, 0, 180, 0],
				PROPERTIES: { COLOR: 17, DRAW_ABOVE: true }
			}
		],
		TURRETS: [
			{
				POSITION: [14.5, 0, 0, 0, 0, 1],
				TYPE: ["egg", { COLOR: { BASE: -1, BRIGHTNESS_SHIFT: -17.5, SATURATION_SHIFT: 0.5 } }],
			}, {
				POSITION: [8, 0, 0, 0, 0, 1],
				TYPE: ["egg", { COLOR: { BASE: -1 } }]
			},
		]
	}
	Class.kilobyteSnowdread = {
	    PARENT: ["genericSquarenought"],
	    LABEL: "Kilobyte",
	    TURRETS: [
			{
				POSITION: [12, 0, 0, 0, 0, 1],
				TYPE: ["square", {MIRROR_MASTER_ANGLE: true, COLOR: {BASE: -1, BRIGHTNESS_SHIFT: 7.5}}],
			}, {
				POSITION: [20, 0, 0, 0, 0, 1],
				TYPE: ["squareBaseDeco"],
			}, {
				POSITION: [10, 0, 0, 0, 360, 1],
				TYPE: "kilobyteTurretSnowdread",
			},
		],
	}
	Class.lighterTurretSnowdread = {
		PARENT: 'genericTank',
		COLOR: {BASE: -1, BRIGHTNESS_SHIFT: -12.5},
		BODY: {FOV: 5},
		CONTROLLERS: ['nearestDifferentMaster'],
		INDEPENDENT: true,
		GUNS: [
			{
				POSITION: [15, 11, 1, 0, 0, 180, 0],
				PROPERTIES: {COLOR: 13},
			}, {
				POSITION: [16.5, 7, 1, 0, 0, 180, 0],
				PROPERTIES: {COLOR: {BASE: 17, BRIGHTNESS_SHIFT: 5}},
			}, {
				POSITION: [14, 2, 1, 0, 7, 0, 0],
				PROPERTIES: {COLOR: {BASE: 17, BRIGHTNESS_SHIFT: 12.5}},
			}, {
				POSITION: [14, 2, 1, 0, -7, 0, 0],
				PROPERTIES: {COLOR: {BASE: 17, BRIGHTNESS_SHIFT: 12.5}},
			}, {
				POSITION: [22, 7, 1, 0, 0, 0, 0],
				PROPERTIES: {
					SHOOT_SETTINGS: combineStats([g.basic, g.auto, g.flame]),
					TYPE: 'growBullet',
					COLOR: {BASE: -1, BRIGHTNESS_SHIFT: -17.5},
				}
			}, {
				POSITION: [13, 8, -1.3, 0, 0, 0, 0],
				PROPERTIES: {COLOR: {BASE: 17, BRIGHTNESS_SHIFT: 7.5}},
			},
		],
		TURRETS: [
			{
				POSITION: [13.5, 0, 0, 0, 0, 1],
				TYPE: ["egg", { COLOR: { BASE: 17, BRIGHTNESS_SHIFT: 7.5 } }],
			}, {
				POSITION: [9, 0, 0, 0, 0, 1],
				TYPE: ["egg", { COLOR: { BASE: -1 } }]
			},
		]
	};
	Class.lighterSnowdread = { // Flamethrower
	    PARENT: ["genericSquarenought"],
	    LABEL: "Lighter",
	    TURRETS: [
			{
				POSITION: [13, 0, 0, 0, 0, 1],
				TYPE: ["square", {MIRROR_MASTER_ANGLE: true, COLOR: {BASE: -1, BRIGHTNESS_SHIFT: 7.5}}],
			}, {
				POSITION: [20, 0, 0, 0, 0, 1],
				TYPE: ["squareBaseDeco"],
			}, {
				POSITION: [9, 0, 0, 0, 360, 1],
				TYPE: 'lighterTurretSnowdread',
			}
		],
	}
	Class.stormTurretSnowdread = {
		PARENT: 'genericTank',
		LABEL: "",
		BODY: { FOV: 1.5 },
		CONTROLLERS: [[ 'spin', {speed: 0.03}]],
		COLOR: {BASE: 17, BRIGHTNESS_SHIFT: 7.5},
		INDEPENDENT: true,
		MAX_CHILDREN: 6,
		GUNS: [
			...addDroneOnAuto({length: 6, width: 12, x: 8, angle: 90}, 5, [g.drone, {size: 1.2}]),
			...addDroneOnAuto({length: 6, width: 12, x: 8, angle: -90}, 5, [g.drone, {size: 1.2}]),
		],
		TURRETS: [
			{
				POSITION: [14, 0, 0, 0, 0, 1],
				TYPE: ["egg", { COLOR: { BASE: -1, BRIGHTNESS_SHIFT: -15, SATURATION_SHIFT: 0.6 } }],
			}, {
				POSITION: [8.5, 0, 0, 0, 0, 1],
				TYPE: ["egg", { COLOR: { BASE: -1 } }]
			},
		]
	};
	Class.stormSnowdread = { // Drones
	    PARENT: ["genericSquarenought"],
	    LABEL: "Storm",
		BODY: {
			SPEED: 0.93,
			FOV: 1.1,
		},
	    TURRETS: [
			{
				POSITION: [14, 0, 0, 0, 0, 1],
				TYPE: ["square", {MIRROR_MASTER_ANGLE: true, COLOR: {BASE: -1, BRIGHTNESS_SHIFT: 7.5}}],
			}, {
				POSITION: [20, 0, 0, 0, 0, 1],
				TYPE: ["squareBaseDeco"],
			}, {
				POSITION: [10, 0, 0, 0, 360, 1],
				TYPE: 'stormTurretSnowdread',
			}
		],
	}
	Class.coronaAuraSnowdread = addAura(1.5, 0.8);
	Class.coronaSnowdread = {
	    PARENT: ["genericSquarenought"],
	    LABEL: "Corona",
	    TURRETS: [
			{
				POSITION: [14, 0, 0, 0, 0, 1],
				TYPE: ["square", {MIRROR_MASTER_ANGLE: true, COLOR: {BASE: -1, BRIGHTNESS_SHIFT: 7.5}}],
			}, {
				POSITION: [20, 0, 0, 0, 0, 1],
				TYPE: ["squareBaseDeco"],
			}, {
				POSITION: [11, 0, 0, 0, 360, 1],
				TYPE: "coronaAuraSnowdread",
			},
		],
	}
	Class.thermosphereAuraSnowdread = addAura(-1, 1.5);
	Class.thermosphereSnowdread = {
	    PARENT: ["genericSquarenought"],
	    LABEL: "Thermosphere",
	    TURRETS: [
			{
				POSITION: [14, 0, 0, 0, 0, 1],
				TYPE: ["square", {MIRROR_MASTER_ANGLE: true, COLOR: {BASE: -1, BRIGHTNESS_SHIFT: 7.5}}],
			}, {
				POSITION: [20, 0, 0, 0, 0, 1],
				TYPE: ["squareBaseDeco"],
			}, {
				POSITION: [11, 0, 0, 0, 360, 1],
				TYPE: "thermosphereAuraSnowdread",
			},
		],
	}
	Class.octogon = { SHAPE: 8 }
	Class.jumboSnowdread = {
	    PARENT: ["genericSquarenought"],
	    LABEL: "Jumbo",
	    BODY: hpBuffBodyStats[0],
	    TURRETS: [
			{
				POSITION: [13, 0, 0, 0, 0, 1],
				TYPE: ['square', {MIRROR_MASTER_ANGLE: true, COLOR: 9}]
			}, {
				POSITION: [7, 0, 0, 0, 0, 1],
				TYPE: ['octogon', {MIRROR_MASTER_ANGLE: true, COLOR: {BASE: 9, BRIGHTNESS_SHIFT: 10}, BORDERLESS: true}]
			}, {
				POSITION: [20, 0, 0, 0, 0, 1],
				TYPE: ["squareBaseDeco"],
			}, {
				POSITION: [24, 0, 0, 0, 0, 0],
				TYPE: ['square', {COLOR: 9, MIRROR_MASTER_ANGLE: true}]
			},
		],
	}
	Class.colossalTopSnowdread = {
	    PARENT: ["genericSquarenought"],
	    GUNS: [],
	}
	for (let i = 0; i < 4; i++) {
		Class.colossalTopSnowdread.GUNS.push(
			{
				POSITION: [3.5, 17.5, 0.001, 9, 0, 90*i, 0],
				PROPERTIES: {COLOR: 9},
			}, {
				POSITION: [2.5, 9, 0, 7, 0, 90*i, 0],
				PROPERTIES: {COLOR: 9, DRAW_ABOVE: true},
			},
		)
	}
	Class.colossalBottomSnowdread = {
	    PARENT: ["genericSquarenought"],
	    GUNS: [],
	}
	for (let i = 0; i < 4; i++) {
		Class.colossalTopSnowdread.GUNS.push(
			{
				POSITION: [3.5, 17.5, 0.001, 9, 0, 90*i, 0],
				PROPERTIES: {COLOR: 9},
			},
		)
	}
	for (let i = 0; i < 4; i++) {
		Class.colossalBottomSnowdread.GUNS.push(
			{
				POSITION: [4, 17.5, 0.001, 9, 0, 90*i, 0],
				PROPERTIES: {COLOR: 9},
			},
		)
	}
	Class.colossalSnowdread = {
	    PARENT: ["genericSquarenought"],
	    LABEL: "Colossal",
		BODY: speedBuffBodyStats[0],
		GUNS: [],
	    TURRETS: [
			{
				POSITION: [13, 0, 0, 0, 0, 1],
				TYPE: ['colossalTopSnowdread', {MIRROR_MASTER_ANGLE: true}]
			}, {
				POSITION: [20, 0, 0, 0, 0, 1],
				TYPE: ["squareBaseDeco"],
			}, {
				POSITION: [20, 0, 0, 0, 0, 0],
				TYPE: ['colossalBottomSnowdread', {MIRROR_MASTER_ANGLE: true}]
			},
		],
	}
	Class.cottonTurretSnowdread = {
		PARENT: ["genericSquarenought"],
		MIRROR_MASTER_ANGLE: true,
		SHAPE: [[1, 0], [0, 1], [-1, 0], [0, -1]],
		GUNS: [],
	}
	for(let i = 0; i < 4; i++) {
		Class.cottonTurretSnowdread.GUNS.push(
			{
				POSITION: [25, 16, 0.001, 0, 0, 90*i+45, 0],
				PROPERTIES: {COLOR: 9}
			},
		)
	}
	for(let i = 0; i < 4; i++) { // layering issues
		Class.cottonTurretSnowdread.GUNS.push(
			{
				POSITION: [25 * 3/4, 12, 0.001, 0, 0, 90*i+45, 0],
				PROPERTIES: {COLOR: {BASE: 9, BRIGHTNESS_SHIFT: 6}, BORDERLESS: true}
			},
		)
	}
	Class.cottonSnowdread = { // Drifter
	    PARENT: ["genericSquarenought"],
	    LABEL: "Cotton",
		BODY: {
			SPEED: 1.9,
			ACCELERATION: 0.25,
		},
	    TURRETS: [
			{
				POSITION: [20, 0, 0, 0, 0, 1],
				TYPE: ["squareBaseDeco"],
			}, {
				POSITION: [12, 0, 0, 0, 0, 1],
				TYPE: 'cottonTurretSnowdread',
			}
		],
	}
	Class.ironTopSnowdread = {
		PARENT: ["genericSquarenought"],
		SHAPE: 0,
		MIRROR_MASTER_ANGLE: true,
		COLOR: {BASE: -1, BRIGHTNESS_SHIFT: 7.5},
		GUNS: [],
	}
	for(let i = 0; i < 8; i++) {
		Class.ironTopSnowdread.GUNS.push(
			{
				POSITION: [8, 6, 0.001, 20, 0, 45*i, 0],
				PROPERTIES: {COLOR: 9},
			}, {
				POSITION: [8, 6, 0.001, -20, 0, 45*i, 0],
				PROPERTIES: {COLOR: 9},
			},
		)
	}
	Class.ironBottomSnowdread = {
		PARENT: ["genericSquarenought"],
		MIRROR_MASTER_ANGLE: true,
		GUNS: [],
	}
	for(let i = 0; i < 4; i++) {
		Class.ironBottomSnowdread.GUNS.push(
			{
				POSITION: [6, 6, 0.001, 9.5, 5, 90*i, 0],
				PROPERTIES: {COLOR: 9},
			}, {
				POSITION: [6, 6, 0.001, 9.5, -5, 90*i, 0],
				PROPERTIES: {COLOR: 9},
			},
		)
	}
	Class.ironSnowdread = { // Body damage increase
	    PARENT: ["genericSquarenought"],
	    LABEL: "Iron",
		BODY: {
			DAMAGE: 2,
			PENETRATION: 1.6,
		},
		GUNS: [],
	    TURRETS: [
			{
				POSITION: [5.5, 0, 0, 0, 0, 1],
				TYPE: 'ironTopSnowdread',
			}, {
				POSITION: [20, 0, 0, 0, 0, 1],
				TYPE: ["squareBaseDeco"],
			}, {
				POSITION: [20, 0, 0, 0, 0, 0],
				TYPE: 'ironBottomSnowdread',
			},
		],
	}
	Class.rollerTurretSnowdread = {
		PARENT: ["genericSquarenought"],
		MIRROR_MASTER_ANGLE: true,
		GUNS: [],
	}
	for(let i = 0; i < 4; i++) {
		Class.rollerTurretSnowdread.GUNS.push(
			{
				POSITION: [20, 20, 0, 0, 0, 90*i, 0],
				PROPERTIES: {COLOR: 9},
			}, {
				POSITION: [15, 15, 0, 2.5, 0, 90*i, 0],
				PROPERTIES: {COLOR: {BASE: 9, BRIGHTNESS_SHIFT: 7.5}, BORDERLESS: true},
			},
		)
	}
	Class.rollerSnowdread = { // Size increase
	    PARENT: ["genericSquarenought"],
	    LABEL: "Roller",
		SIZE: 1.3,
		BODY: sizeBuffBodyStats[0],
	    TURRETS: [
			{
				POSITION: [20, 0, 0, 0, 0, 1],
				TYPE: ["squareBaseDeco"],
			}, {
				POSITION: [10, 0, 0, 0, 0, 1],
				TYPE: 'rollerTurretSnowdread',
			}, {
				POSITION: [6, 0, 0, 0, 0, 1],
				TYPE: ['square', {COLOR: {BASE: -1, BRIGHTNESS_SHIFT: -15}, MIRROR_MASTER_ANGLE: true}]
			},
		],
	}
	Class.owlSnowdread = { // Size decrease
	    PARENT: ["genericSquarenought"],
	    LABEL: "Owl",
		SIZE: 0.85,
		BODY: {
			HEALTH: 0.8,
			SPEED: 1.1,
			ACCELERATION: 1.25,
		},
	    TURRETS: [
			{
				POSITION: [11, 0, 0, 0, 0, 1],
				TYPE: ['square', {COLOR: 9, MIRROR_MASTER_ANGLE: true}]
			}, {
				POSITION: [20, 0, 0, 0, 0, 1],
				TYPE: ["squareBaseDeco"],
			}, {
				POSITION: [12.5 / Math.SQRT2, 0, 0, 45, 0, 1],
				TYPE: ['square', {MIRROR_MASTER_ANGLE: true, COLOR: {BASE: -1, BRIGHTNESS_SHIFT: -7.5}}]
			},
		],
	}
	Class.baiterTurretSnowdread = {
		PARENT: 'genericTank',
		CONTROLLERS: [["spin", {speed: -0.035}]],
		INDEPENDENT: true,
		LABEL: "",
		COLOR: {BASE: 17, BRIGHTNESS_SHIFT: 12.5},
		GUNS: [
			{ 
			  	POSITION: [11, 23, 1, -5.5, 0, 0, 0],
				PROPERTIES: {COLOR: {BASE: -1, BRIGHTNESS_SHIFT: -17.5}}
			}, {
				POSITION: [11, 23, 1, -5.5, 0, 90, 0],
				PROPERTIES: {COLOR: {BASE: -1, BRIGHTNESS_SHIFT: -17.5}}
			}, { 
			  	POSITION: [7, 28, 1, -3.5, 0, 0, 0],
				PROPERTIES: {COLOR: {BASE: 17, BRIGHTNESS_SHIFT: 6}}
			}, {
				POSITION: [7, 28, 1, -3.5, 0, 90, 0],
				PROPERTIES: {COLOR: {BASE: 17, BRIGHTNESS_SHIFT: 6}}
			},
		],
		TURRETS: [
			{
				POSITION: [15, 0, 0, 0, 0, 1],
				TYPE: ["egg", { COLOR: { BASE: -1, BRIGHTNESS_SHIFT: -17.5, SATURATION_SHIFT: 0.45 } }],
			}, {
				POSITION: [7.5, 0, 0, 0, 0, 1],
				TYPE: ["egg", { COLOR: { BASE: -1 } }]
			},
		]
	}
    Class.baiterSnowdread = { // Minelayer
	    PARENT: ["genericSquarenought"],
	    LABEL: "Baiter",
		GUNS: [
			{
				POSITION: [0, 12, 1, 8, 0, 0, 0],
				PROPERTIES: {
					SHOOT_SETTINGS: combineStats([g.trap, {health: 1.3, recoil: 0, maxSpeed: 1e-3, speed: 1e-3}]),
					TYPE: 'trap',
					STAT_CALCULATOR: gunCalcNames.trap,
				},
			}
		],
	    TURRETS: [
			{
				POSITION: [14, 0, 0, 0, 0, 1],
				TYPE: ['square', {MIRROR_MASTER_ANGLE: true, COLOR: {BASE: -1, BRIGHTNESS_SHIFT: 7.5}}]
			}, {
				POSITION: [20, 0, 0, 0, 0, 1],
				TYPE: ["squareBaseDeco"],
			}, {
				POSITION: [11, 0, 0, 0, 360, 1],
				TYPE: 'baiterTurretSnowdread'
			},
		],
	}
	Class.spyRadarSnowdread = {
		PARENT: 'genericTank',
		CONTROLLERS: [['spin', {speed: 0.02}]],
		INDEPENDENT: true,
		SHAPE: [[0.2, 1], [0.2, -1], [-0.2, -1], [-0.2, 1]],
		COLOR: 17,
		GUNS: [
			{
				POSITION: [4, 26, 1, -2, 0, 0, 0],
				PROPERTIES: {COLOR: 13}
			}, {
				POSITION: [7, 17, 1, -3.5, 0, 0, 0],
				PROPERTIES: {COLOR: {BASE: -1, BRIGHTNESS_SHIFT: -17.5}}
			}
		]
	}
    Class.spySnowdread = { // FOV
	    PARENT: ["genericSquarenought"],
	    LABEL: "Spy",
		BODY: {
			FOV: 1.2,
			SPEED: 0.95,
		},
	    TURRETS: [
			{
				POSITION: [14, 0, 0, 0, 0, 1],
				TYPE: ['square', {MIRROR_MASTER_ANGLE: true, COLOR: {BASE: -1, BRIGHTNESS_SHIFT: 7.5}}]
			}, {
				POSITION: [20, 0, 0, 0, 0, 1],
				TYPE: ["squareBaseDeco"],
			}, {
				POSITION: [10.5, 0, 0, 0, 0, 1],
				TYPE: ['egg', {COLOR: {BASE: 17, BRIGHTNESS_SHIFT: 15}, MIRROR_MASTER_ANGLE: true}]
			}, {
				POSITION: [7.5, 0, 0, 0, 0, 1],
				TYPE: ['egg', {COLOR: 13, MIRROR_MASTER_ANGLE: true}]
			}, {
				POSITION: [15, 0, 0, 0, 360, 1],
				TYPE: 'spyRadarSnowdread',
			}
		],
	}

	// T3 Weapons
	Class.bayonetSnowdread = {
	    PARENT: ["genericTrinought"],
	    LABEL: "Bayonet",
	    GUNS: [],
	}
	for (let i = 0; i < 3; i++) {
		Class.bayonetSnowdread.GUNS.push(
			...addAssassin({length: 28, width: 7, x: 7, angle: 120*i}, 2.5, [g.basic, g.sniper, g.assass, g.assass, g.assass, {reload: 0.8, density: 2/5}])
		)
	}
	Class.bladeSnowdread = {
	    PARENT: ["genericTrinought"],
	    LABEL: "Blade",
	    GUNS: [],
	}
	for (let i = 0; i < 3; i++) {
		Class.bladeSnowdread.GUNS.push(
			...addRifle({length: 18, width: 5, angle: 120*i}, -5, [g.basic, g.sniper, g.rifle, g.twin, {speed: 0.8, health: 1.5}], true)
		)
	}
	Class.atlatlSnowdread = { // hunter
	    PARENT: ["genericTrinought"],
	    LABEL: "Atlatl",
	    CONTROLLERS: [["zoom", { distance: 500 }]],
    	TOOLTIP: "Hold right click to zoom.",
	    GUNS: [],
	}
	for (let i = 0; i < 3; i++) {
		Class.atlatlSnowdread.GUNS.push(
			...addHunter({length: 18, width: 9, dimensionDifference: 3, angle: 120*i}, 0, [g.basic, g.sniper, g.assass, g.hunter, {health: 1.1}]),
			{
				POSITION: [5, 9, -1.6, 6, 0, 120*i, 0],
				PROPERTIES: { COLOR: { BASE: -1, BRIGHTNESS_SHIFT: -20, SATURATION_SHIFT: 0.5 }, },
			}, {
				POSITION: [5, 7.5, -1.6, 4.5, 0, 120*i, 0],
				PROPERTIES: { COLOR: { BASE: 17, BRIGHTNESS_SHIFT: 10 } },
			},
		)
	}
	Class.ballistaSnowdread = { // mega-sniper
	    PARENT: ["genericTrinought"],
	    LABEL: "Ballista",
	    GUNS: [],
	}
	for (let i = 0; i < 3; i++) {
		Class.ballistaSnowdread.GUNS.push(
			...addHeavySniper({length: 22, width: 11, angle: 120*i}, -2.5, [g.basic, g.sniper, g.preda, g.preda, g.preda, g.bitlessspeed, g.lessreload, {health: 1.2, size: 2}])
		)
	}
	Class.barbSnowdread = { // railgun
	    PARENT: ["genericTrinought"],
	    LABEL: "Barb",
	    GUNS: [],
	}
	for (let i = 0; i < 3; i++) {
		Class.barbSnowdread.GUNS.push(
			...addRailgun({length: 26.5, width: 4, x: 7, angle: 120*i}, 0, [g.basic, g.sniper, g.sniper, g.sniper, g.pound, g.lessreload, {damage: 1.2}])
		)
	}
	Class.mitigatorSnowdread = {
	    PARENT: ["genericTrinought"],
	    LABEL: "Mitigator",
	    GUNS: [],
	}
	for (let i = 0; i < 3; i++) {
		Class.mitigatorSnowdread.GUNS.push(
			...addNormal({length: 13, width: 8, y: 5, angle: 120*i}, 5, [g.basic, {reload: 0.85}]),
			...addNormal({length: 13, width: 8, y: -5, angle: 120*i, delay: 0.5}, 5, [g.basic, {reload: 0.85}]),
		)
	}
	Class.appeaserSnowdread = {
	    PARENT: ["genericTrinought"],
	    LABEL: "Appeaser",
	    GUNS: [],
	}
	for (let i = 0; i < 3; i++) {
		Class.appeaserSnowdread.GUNS.push(
			...addNormal({length: 7, width: 11, aspect: 1.35, x: 6, angle: 120*i}, 5, [g.basic, g.mach, {size: 0.8}], false),
			...addNormal({length: 7, width: 10, aspect: 1.3, x: 8, angle: 120*i}, 5, [g.basic, g.mach, {size: 0.8, reload: 0.9}]),
		)
	}
	Class.amalgamAutoSnowdread = {
		PARENT: 'autoTankGun',
		BODY: {FOV: 2},
		GUNS: [
			...addGunner({length: 16, width: 4, y: -3.5, delay: 0.5}, 0, [g.basic, g.auto, g.gunner, g.power, g.twin, g.bent, {recoil: 0.5}]),
			...addGunner({length: 16, width: 4, y: 3.5, delay: 0.5}, 0, [g.basic, g.auto, g.gunner, g.power, g.twin, g.bent, {recoil: 0.5}]),
			...addGunner({length: 18, width: 4, delay: 0}, 0, [g.basic, g.auto, g.gunner, g.power, g.twin, g.bent, {recoil: 0.5}]),
			{
				POSITION: [7, 11, -1.3, 5, 0, 0, 0],
				PROPERTIES: { COLOR: { BASE: -1, BRIGHTNESS_SHIFT: -15, SATURATION_SHIFT: 0.5 } },
			}, {
				POSITION: [7, 11 - 1.5, -1.3, 3.5, 0, 0, 0],
				PROPERTIES: { COLOR: { BASE: 17, BRIGHTNESS_SHIFT: 10 } },
			},
		],
		TURRETS: [
			{
				POSITION: [15.5, 0, 0, 0, 0, 1],
				TYPE: ["egg", { COLOR: { BASE: -1, BRIGHTNESS_SHIFT: -15, SATURATION_SHIFT: 0.5 } }],
			}, {
				POSITION: [9.5, 0, 0, 0, 0, 1],
				TYPE: ["egg", { COLOR: { BASE: -1 } }]
			},
		]
	}
	Class.amalgamSnowdread = { // all auto
	    PARENT: ["genericTrinought"],
	    LABEL: "Amalgam",
		TOOLTIP: "Reverse tank to focus more fire.",
		TURRETS: [],
	}
	for(let i = 0; i < 3; i++) {
		Class.amalgamSnowdread.TURRETS.push(
			{
				POSITION: [11, 7, 0, 120*i, 190, 0],
				TYPE: 'amalgamAutoSnowdread',
			},
		)
	};
	Class.breakerSnowdread = { // ultra bullet spam
	    PARENT: ["genericTrinought"],
	    LABEL: "Breaker",
	    GUNS: [],
	}
	for(let i = 0; i < 3; i++) {
		Class.breakerSnowdread.GUNS.push(
			...addGunner({length: 19, width: 2.75, y: -3, angle: 120*i, delay: 1/3}, 0, [g.basic, g.gunner, g.power, g.nail, {speed: 1.05, maxSpeed: 1.05}]),
			...addGunner({length: 19, width: 2.75, y: 3, angle: 120*i, delay: 2/3}, 0, [g.basic, g.gunner, g.power, g.nail, {speed: 1.05, maxSpeed: 1.05}]),
			...addGunner({length: 21.5, width: 3.25, y: 0, angle: 120*i}, 0, [g.basic, g.gunner, g.power, g.nail, {speed: 1.05, maxSpeed: 1.05, size: 2.75/3.25}]),
			{
				POSITION: [10, 8.5, 0.6, 5, 0, 120*i, 0],
				PROPERTIES: { COLOR: { BASE: 17, BRIGHTNESS_SHIFT: 10 } },
			}, {
				POSITION: [5.5, 9, -1.8, 6.5, 0, 120*i, 0],
				PROPERTIES: { COLOR: { BASE: -1, BRIGHTNESS_SHIFT: -20, SATURATION_SHIFT: 0.5 }, },
			}, {
				POSITION: [5.5, 7.5, -1.8, 5, 0, 120*i, 0],
				PROPERTIES: { COLOR: { BASE: 17, BRIGHTNESS_SHIFT: 10 } },
			},
		)
	}
	Class.clasperTurretSnowdread = {
		PARENT: ["spamAutoTurret"],
		INDEPENDENT: true,
		GUNS: [
			{
				POSITION: [14, 15, -1.2, 0, 0, 0, 0],
				PROPERTIES: { COLOR: { BASE: 17, BRIGHTNESS_SHIFT: 10 } },
			},
			...addGunner({length: 16, width: 4, y: -4}, 0, [g.basic, g.auto, g.gunner, g.twin, g.power, g.flank, g.flank, g.slow, {recoil: 0.25}]),
			...addGunner({length: 16, width: 4, y: 4, delay: 0.5}, 0, [g.basic, g.auto, g.gunner, g.twin, g.power, g.flank, g.flank, g.slow, {recoil: 0.25}]),
		],
	};
	Class.clasperSnowdread = { // crowbar
	    PARENT: ["genericTrinought"],
	    LABEL: "Clasper",
	    GUNS: [],
		TURRETS: [],
	}
	for(let i = 0; i < 3; i++) {
		Class.clasperSnowdread.GUNS.push(
			...addCrowbar({length: 38, width: 6.5, aspect: -1.5, x: 8, angle: 120*i}, 0)
		)
		Class.clasperSnowdread.TURRETS.push(
			{
				POSITION: [6.5, 38, 0, 120*i, 200, 1],
				TYPE: 'clasperTurretSnowdread'
			}, {
				POSITION: [6.5, 28, 0, 120*i, 200, 1],
				TYPE: 'clasperTurretSnowdread'
			}, {
				POSITION: [6.5, 18, 0, 120*i, 200, 1],
				TYPE: 'clasperTurretSnowdread'
			},
		)
	}
	Class.suppressorSnowdread = {
	    PARENT: ["genericTrinought"],
	    LABEL: "Suppressor",
	    GUNS: [],
	}
	for (let i = 0; i < 3; i++) {
		Class.suppressorSnowdread.GUNS.push(
			...addHeavy({length: 16.5, width: 11.5, angle: 120*i}, 0, [g.basic, g.pound, g.destroy, {reload: 0.85}])
		)
	}
	Class.inhibitorSnowdread = {
	    PARENT: ["genericTrinought"],
	    LABEL: "Inhibitor",
	    GUNS: [],
	}
	for (let i = 0; i < 3; i++) {
		Class.inhibitorSnowdread.GUNS.push(
			...addLauncher({length: 15, width: 15, angle: 120*i}, -5, [g.basic, g.pound, g.arty, g.skim, g.halfspeed, {reload: 1.5}], true, "supermissile")
		)
	}
	Class.tranquilizerSnowdread = { // shotgun
	    PARENT: ["genericTrinought"],
	    LABEL: "Tranquilizer",
	    GUNS: [],
	}
	for(let i = 0; i < 3; i++) {
		Class.tranquilizerSnowdread.GUNS.push(
			...addShotgun({length: 21, width: 14, x: 5, angle: 120*i}, 0, [
				{l: 15, w: 3, y: -3},
				{l: 15, w: 3, y: 3},
				{l: 17, w: 4, y: 0},
				{l: 13, w: 4, y: -1},
				{l: 12, w: 5, y: 1},
				{l: 12, w: 5, y: 0},
			], [g.basic, g.mach, g.shotgun, {health: 1.4, damage: 1.4}]),
		)
	}
	Class.spiralMissileSnowdread = {
		PARENT: 'spinmissile',
		GUNS: [
			{
				POSITION: [14, 8, 1, 0, 0, 0, 0],
				PROPERTIES: {
					AUTOFIRE: !0,
					SHOOT_SETTINGS: combineStats([g.basic, g.rocketeer, g.morespeed]),
					TYPE: [ "bullet", { PERSISTS_AFTER_DEATH: true } ],
					STAT_CALCULATOR: gunCalcNames.thruster,
				},
			},
			{
				POSITION: [14, 8, 1, 0, 0, 180, 0],
				PROPERTIES: {
					AUTOFIRE: !0,
					SHOOT_SETTINGS: combineStats([g.basic, g.rocketeer, g.morespeed]),
					TYPE: [ "bullet", { PERSISTS_AFTER_DEATH: true } ],
					STAT_CALCULATOR: gunCalcNames.thruster,
				},
			},
		],
	}
	Class.spiralSnowdread = { // twister
	    PARENT: ["genericTrinought"],
	    LABEL: "Spiral",
	    GUNS: [],
	}
	for(let i = 0; i < 3; i++) {
		Class.spiralSnowdread.GUNS.push(
			...addTwister({length: 17, width: 11, aspect: -1.4, angle: 120*i}, 0, [g.basic, g.pound, g.arty, g.arty, g.skim, g.morespeed, g.fast, g.one_third_reload], "spiralMissileSnowdread")
		)
	}
	Class.shellerSnowdread = { // artillery
	    PARENT: ["genericTrinought"],
	    LABEL: "Sheller",
	    GUNS: [],
	}
	for(let i = 0; i < 3; i++) {
		Class.shellerSnowdread.GUNS.push(
			...addGunner({length: 12.5, width: 3, y: -6.5, angle: 120*i-7, delay: 0.6}, 0, [g.basic, g.gunner, g.arty]),
			...addGunner({length: 12.5, width: 3, y: 6.5, angle: 120*i+7, delay: 0.8}, 0, [g.basic, g.gunner, g.arty]),
			...addGunner({length: 15.5, width: 3, y: -4.5, angle: 120*i-7, delay: 0.2}, 0, [g.basic, g.gunner, g.arty, g.twin]),
			...addGunner({length: 15.5, width: 3, y: 4.5, angle: 120*i+7, delay: 0.4}, 0, [g.basic, g.gunner, g.arty, g.twin]),
			...addHeavy({length: 17.5, width: 10, angle: 120*i}, 0, [g.basic, g.destroy, g.arty])
		)
	}
	Class.infiltratorSnowdread = {
	    PARENT: ["genericTrinought"],
	    LABEL: "Infiltrator",
	    GUNS: [],
	}
	for (let i = 0; i < 3; i++) {
		Class.infiltratorSnowdread.GUNS.push(
			...addDrone({length: 5, width: 6, aspect: 1.4, x: 6, y: 5.5, angle: 120*i}, -2.5, [g.drone, g.over, g.over, {size: 1.5, reload: 0.6}], 2),
			...addDrone({length: 5, width: 6, aspect: 1.4, x: 6, y: -5.5, angle: 120*i}, -2.5, [g.drone, g.over, g.over, {size: 1.5, reload: 0.6}], 2),
			...addDrone({length: 5, width: 6, aspect: 1.4, x: 8, angle: 120*i}, -2.5, [g.drone, g.over, g.over, g.pound, {size: 2, reload: 0.4}], 2, "betadrone"),
		)
	}
	Class.aggressorMinionTopSnowdread = {
		SHAPE: "M -1.546 -0.108 L -1.546 0.108 L -0.175 0.303 L 0.679 1.393 L 0.867 1.285 L 0.35 0 L 0.867 -1.285 L 0.679 -1.393 L -0.175 -0.303 L -1.546 -0.108",
		COLOR: { BASE: 17, BRIGHTNESS_SHIFT: 5 },
		MIRROR_MASTER_ANGLE: true,
	}
	Class.aggressorMinionSnowdread = {
		PARENT: ["minion"],
		SHAPE: 3.5,
		COLOR: 2,
		BODY: { SPEED: 0.8, },
		GUNS: [],
		TURRETS: [
			{
				POSITION: [20, 0, 0, 0, 0, 1],
				TYPE: "aggressorMinionTopSnowdread"
			}
		]
	}
	for (let i = 0; i < 3; i++) {
		Class.aggressorMinionSnowdread.GUNS.push(
			...addGunner({length: 16, width: 8.5, angle: 120*i}, -2.5, [g.basic, g.sniper, g.assass, g.bitlessspeed, g.minion])
		)
	}
	Class.aggressorSnowdread = {
	    PARENT: ["genericTrinought"],
	    LABEL: "Aggressor",
	    GUNS: [],
	}
	for (let i = 0; i < 3; i++) {
		Class.aggressorSnowdread.GUNS.push(
			...addMinion({length: 12, gap: 3, width: 13, angle: 120*i}, 0, [g.factory, {size: 0.9, reload: 0.5}], "aggressorMinionSnowdread", 2)
		)
	}
	Class.haloSnowdread = { // auto-drones
	    PARENT: ["genericTrinought"],
	    LABEL: "Halo",
	    GUNS: [],
	}
	for(let i = 0; i < 3; i++) {
		Class.haloSnowdread.GUNS.push(
			...addAutoDrone({length: 5, width: 14.5, aspect: 1.2, x: 8, angle: 120*i}, 0, [g.drone, g.over, {reload: 1.2, size: 0.8, speed: 1.15, maxSpeed: 1.15}], 4)
		)
	}
	Class.sluggerSnowdread = { // honcho
	    PARENT: ["genericTrinought"],
	    LABEL: "Slugger",
	    GUNS: [],
	}
	for(let i = 0; i < 3; i++) {
		Class.sluggerSnowdread.GUNS.push(
			...addHoncho({length: 5, width: 13, aspect: 1.5, x: 8, angle: 120*i}, 0, [g.drone, g.over, g.honcho, {maxSpeed: 0.9, size: 0.75}], 2)
		)
	};
	Class.debilitatorSnowdread = { // swarms
	    PARENT: ["genericTrinought"],
	    LABEL: "Debilitator",
	    GUNS: [],
	}
	for(let i = 0; i < 3; i++) {
		Class.debilitatorSnowdread.GUNS.push(
			...addSwarm({length: 6, width: 9, aspect: 0.6, x: 6, y: 5, angle: 120*i}, 0, [g.swarm, g.over, g.over, {reload: 1.1}]),
			...addSwarm({length: 6, width: 9, aspect: 0.6, x: 6, y: -5, angle: 120*i, delay: 0.5}, 0, [g.swarm, g.over, g.over, {reload: 1.1}]),
			{
				POSITION: [2, 15, 0.85, 8, 0, 120*i, 0],
				PROPERTIES: {COLOR: {BASE: 17, BRIGHTNESS_SHIFT: 7.5}},
			},
		)
	};
	Class.hydraSnowdread = {
	    PARENT: ["genericTrinought"],
	    LABEL: "Hydra",
	    GUNS: [],
	}
	for (let i = 0; i < 3; i++) {
		Class.hydraSnowdread.GUNS.push(
			...addTrap({length: 6, length2: 2, width: 3.5, aspect: 1.8, x: 4, y: 8.5, angle: 120*i, delay: 2/3}, 0, [g.trap, g.twin, g.pound, g.fast]),
			...addTrap({length: 6, length2: 2, width: 3.5, aspect: 1.8, x: 4, y: -8.5, angle: 120*i, delay: 1/3}, 0, [g.trap, g.twin, g.pound, g.fast]),
			...addTrap({length: 12, length2: 2.5, width: 5, aspect: 1.7, angle: 120*i}, 0, [g.trap, g.block, g.twin, g.pound, g.fast, {reload: 1/1.1}], true),
		)
	}
	Class.beelzebubSnowdread = {
	    PARENT: ["genericTrinought"],
	    LABEL: "Beelzebub",
	    GUNS: [],
	}
	for (let i = 0; i < 3; i++) {
		Class.beelzebubSnowdread.GUNS.push(
			...addTrap({length: 13, length2: 3.5, width: 10, aspect: 1.6, angle: 120*i}, 0, [g.trap, g.block, g.pound, g.morespeed, {size: 1.2, health: 2}], true)
		)
	}
	Class.sweeperSnowdread = { // auto-traps
	    PARENT: ["genericTrinought"],
	    LABEL: "Sweeper",
	    GUNS: [],
	}
	for(let i = 0; i < 3; i++) {
		Class.sweeperSnowdread.GUNS.push(
			...addAutoTrap({length: 15.5, length2: 2, width: 15, aspect: 1.3, angle: 120*i}, -2.5, [g.trap, g.block, g.halfreload, {reload: 1.25}], true)
		)
	}
	Class.auraBlockAura = addAura(1/3, 1.6, 0.15, 0, "Small");
	Class.auraBlock = makeAuto(Class.unsetTrap, "", {type: 'auraBlockAura'});
	Class.aegisSnowdread = { // aura-traps
	    PARENT: ["genericTrinought"],
	    LABEL: "Aegis",
	    GUNS: [],
	}
	for(let i = 0; i < 3; i++) {
		Class.aegisSnowdread.GUNS.push(
			...addAuraTrap({length: 14, length2: 3, width: 10, aspect: 1.6, angle: 120*i}, 0, [g.trap, g.block, g.hexatrap, {reload: 2, range: 0.8, health: 2.4}], true)
		)
	}
	Class.drillSnowdread = { // trap + gun
	    PARENT: ["genericTrinought"],
	    LABEL: "Drill",
	    GUNS: [],
	}
	for(let i = 0; i < 3; i++) {
		Class.drillSnowdread.GUNS.push(
			...addNormal({length: 20, width: 9, angle: 120*i}, 0, [g.basic, g.flank]),
			...addTrap({length: 13.5, length2: 3, width: 11, aspect: 1.4, angle: 120*i}, 0, [g.trap, g.block, g.hexatrap], true)
		)
	}

	// T3 Bodies
	Class.mechanismSnowdread = {
	    PARENT: ["genericTrinought"],
	    LABEL: "Mechanism",
	    TURRETS: [
			{
				POSITION: [14, 0, 0, 180, 0, 1],
				TYPE: ["triangle", {MIRROR_MASTER_ANGLE: true, COLOR: {BASE: -1, BRIGHTNESS_SHIFT: 5}}],
			}, {
				POSITION: [20, 0, 0, 0, 0, 1],
				TYPE: ["triangleBaseDeco"],
			},
		],
	}
	for (let i = 0; i < 3; i++) {
		Class.mechanismSnowdread.TURRETS.push(
			{
				POSITION: [3.5, 6, 0, 120*i, 180, 1],
				TYPE: "spamAutoTurret",
			},
			{
				POSITION: [3.5, 10, 0, 120*i+60, 180, 1],
				TYPE: "spamAutoTurret",
			},
		)
	}
	Class.trinoughtBigAura = addAura(2, 1.5);
	Class.fusionSnowdread = {
	    PARENT: ["genericTrinought"],
	    LABEL: "Fusion",
	    TURRETS: [
			{
				POSITION: [15, 0, 0, 180, 0, 1],
				TYPE: ["triangle", {MIRROR_MASTER_ANGLE: true, COLOR: {BASE: -1, BRIGHTNESS_SHIFT: 5}}],
			}, {
				POSITION: [20, 0, 0, 0, 0, 1],
				TYPE: ["triangleBaseDeco"],
			},
			...addTrinoughtTurretRing(),
			{
				POSITION: [9.5, 0, 0, 0, 360, 1],
				TYPE: "trinoughtBigAura",
			},
		],
	}
	Class.binarySnowdread = {
	    PARENT: ["genericTrinought"],
	    LABEL: "Binary",
	    TURRETS: [
			{
				POSITION: [15, 0, 0, 180, 0, 1],
				TYPE: ["triangle", {MIRROR_MASTER_ANGLE: true, COLOR: {BASE: -1, BRIGHTNESS_SHIFT: 5}}],
			}, {
				POSITION: [20, 0, 0, 0, 0, 1],
				TYPE: ["triangleBaseDeco"],
			},
			...addTrinoughtTurretRing(),
			{
				POSITION: [10, 0, 0, 0, 360, 1],
				TYPE: "kilobyteTurretSnowdread",
			},
		],
	}
	Class.trinoughtBigHealAura = addAura(-1.5, 1.5);
	Class.exosphereSnowdread = {
	    PARENT: ["genericTrinought"],
	    LABEL: "Exosphere",
	    TURRETS: [
			{
				POSITION: [15, 0, 0, 180, 0, 1],
				TYPE: ["triangle", {MIRROR_MASTER_ANGLE: true, COLOR: {BASE: -1, BRIGHTNESS_SHIFT: 5}}],
			}, {
				POSITION: [20, 0, 0, 0, 0, 1],
				TYPE: ["triangleBaseDeco"],
			},
			...addTrinoughtTurretRing(),
			{
				POSITION: [9.5, 0, 0, 0, 360, 1],
				TYPE: "trinoughtBigHealAura",
			},
		],
	}
	Class.megabyteTurretSnowdread = {
		PARENT: ["autoTankGun"],
		COLOR: { BASE: -1, BRIGHTNESS_SHIFT: -12.5, SATURATION_SHIFT: 0.65 },
		INDEPENDENT: true,
		GUNS: [
			{
				POSITION: [21, 15, -1.4, 0, 0, 0, 0],
				PROPERTIES: {
					SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.pound, g.auto, g.fake]),
					TYPE: "bullet",
					COLOR: { BASE: 17, BRIGHTNESS_SHIFT: 5 },
				},
			}, { // Main gun
				POSITION: [26, 13, 1, 0, 0, 0, 0],
				PROPERTIES: {
					SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.pound, g.auto, {health: 1.2, speed: 0.8}]),
					TYPE: "bullet",
					COLOR: { BASE: -1, BRIGHTNESS_SHIFT: -15, SATURATION_SHIFT: 0.65 },
				},
			}, {
				POSITION: [21.5, 8, 1, 0, 0, 0, 0],
				PROPERTIES: {
					SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.pound, g.auto, g.fake]),
					TYPE: "bullet",
					COLOR: { BASE: -1, BRIGHTNESS_SHIFT: -7.5, SATURATION_SHIFT: 0.75 },
					BORDERLESS: true,
				},
			}, {
				POSITION: [16.5, 2.6, -1.6, 0, 6.1, 0, 0],
				PROPERTIES: {
					SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.pound, g.auto, g.fake]),
					TYPE: "bullet",
					COLOR: { BASE: 17, BRIGHTNESS_SHIFT: 15 },
				},
			}, {
				POSITION: [16.5, 2.6, -1.6, 0, -6.1, 0, 0],
				PROPERTIES: {
					SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.pound, g.auto, g.fake]),
					TYPE: "bullet",
					COLOR: { BASE: 17, BRIGHTNESS_SHIFT: 15 },
				},
			}, {
				POSITION: [10, 9.5, 0.5, 0, 0, 55, 0],
				PROPERTIES: { COLOR: 17, DRAW_ABOVE: true }
			}, {
				POSITION: [10, 9.5, 0.5, 0, 0, -55, 0],
				PROPERTIES: { COLOR: 17, DRAW_ABOVE: true }
			}, {
				POSITION: [10, 9.5, 0.5, 0, 0, 135, 0],
				PROPERTIES: { COLOR: 17, DRAW_ABOVE: true }
			}, {
				POSITION: [10, 9.5, 0.5, 0, 0, -135, 0],
				PROPERTIES: { COLOR: 17, DRAW_ABOVE: true }
			}
		],
		TURRETS: [
			{
				POSITION: [14.5, 0, 0, 0, 0, 1],
				TYPE: ["egg", { COLOR: { BASE: -1, BRIGHTNESS_SHIFT: -17.5, SATURATION_SHIFT: 0.5 } }],
			}, {
				POSITION: [8.5, 0, 0, 0, 0, 1],
				TYPE: ["egg", { COLOR: { BASE: -1 } }]
			},
		]
	}
	Class.megabyteSnowdread = {
	    PARENT: ["genericTrinought"],
	    LABEL: "Megabyte",
	    TURRETS: [
			{
				POSITION: [15.5, 0, 0, 180, 0, 1],
				TYPE: ["triangle", {MIRROR_MASTER_ANGLE: true, COLOR: {BASE: -1, BRIGHTNESS_SHIFT: 5}}],
			}, {
				POSITION: [20, 0, 0, 0, 0, 1],
				TYPE: ["triangleBaseDeco"],
			}, {
				POSITION: [12, 0, 0, 0, 360, 1],
				TYPE: "megabyteTurretSnowdread",
			},
		],
	}
	Class.trinoughtSmallAura = addAura(1, 2.1, 0.15, 0, "Small");
	Class.trojanSnowdread = {
	    PARENT: ["genericTrinought"],
	    LABEL: "Trojan",
	    TURRETS: [
			{
				POSITION: [14, 0, 0, 180, 0, 1],
				TYPE: ["triangle", {MIRROR_MASTER_ANGLE: true, COLOR: {BASE: -1, BRIGHTNESS_SHIFT: 5}}],
			}, {
				POSITION: [20, 0, 0, 0, 0, 1],
				TYPE: ["triangleBaseDeco"],
			},
			...addTrinoughtAuraRing(),
			{
				POSITION: [10, 0, 0, 0, 360, 1],
				TYPE: "kilobyteTurretSnowdread",
			},
		],
	}
	Class.trinoughtSmallHealAura = addAura(-2/3, 2.1, 0.15, "red", "Small");
	Class.hardwareSnowdread = {
	    PARENT: ["genericTrinought"],
	    LABEL: "Hardware",
	    TURRETS: [
			{
				POSITION: [14, 0, 0, 180, 0, 1],
				TYPE: ["triangle", {MIRROR_MASTER_ANGLE: true, COLOR: {BASE: -1, BRIGHTNESS_SHIFT: 5}}],
			}, {
				POSITION: [20, 0, 0, 0, 0, 1],
				TYPE: ["triangleBaseDeco"],
			},
			...addTrinoughtAuraRing(true),
			{
				POSITION: [10, 0, 0, 0, 360, 1],
				TYPE: "kilobyteTurretSnowdread",
			},
		],
	}
	Class.burnerTurretSnowdread = {
		PARENT: 'genericTank',
		COLOR: -1,
		CONTROLLERS: ['nearestDifferentMaster'],
		INDEPENDENT: true,
		GUNS: [
			{
				POSITION: [15, 11, 1, 0, 0, 140, 0],
				PROPERTIES: {COLOR: {BASE: -1, BRIGHTNESS_SHIFT: 5, SATURATION_SHIFT: 0.9}},
			}, {
				POSITION: [16.5, 7, 1, 0, 0, 140, 0],
				PROPERTIES: {COLOR: {BASE: 17, BRIGHTNESS_SHIFT: 7.5}}
			}, {
				POSITION: [15, 11, 1, 0, 0, -140, 0],
				PROPERTIES: {COLOR: {BASE: -1, BRIGHTNESS_SHIFT: 5, SATURATION_SHIFT: 0.9}},
			}, {
				POSITION: [16.5, 7, 1, 0, 0, -140, 0],
				PROPERTIES: {COLOR: {BASE: 17, BRIGHTNESS_SHIFT: 7.5}}
			}, {
				POSITION: [16, 2, 1, 0, 7.5, 0, 0],
				PROPERTIES: {COLOR: {BASE: 17, BRIGHTNESS_SHIFT: 12.5}}
			}, {
				POSITION: [16, 2, 1, 0, -7.5, 0, 0],
				PROPERTIES: {COLOR: {BASE: 17, BRIGHTNESS_SHIFT: 12.5}}
			}, {
				POSITION: [24, 8, 1.25, 0, 0, 0, 0],
				PROPERTIES: {
					SHOOT_SETTINGS: combineStats([g.basic, g.auto, g.flame, g.morespeed]),
					TYPE: 'growBullet',
					COLOR: {BASE: -1, BRIGHTNESS_SHIFT: -10, SATURATION_SHIFT: 0.7},
				}
			}, {
				POSITION: [21.5, 6.5, 1.3, 0, 0, 0, 0],
				PROPERTIES: { 
					SHOOT_SETTINGS: combineStats([g.basic, g.auto, g.flame, g.fake]),
					TYPE: 'bullet',
					COLOR: {BASE: -1, BRIGHTNESS_SHIFT: -2.5, SATURATION_SHIFT: 0.8}, 
					BORDERLESS: true 
				}
			}, {
				POSITION: [14, 8.5, -1.4, 0, 0, 0, 0],
				PROPERTIES: {COLOR: {BASE: 17, BRIGHTNESS_SHIFT: 7.5}}
			},
		],
		TURRETS: [
			{
				POSITION: [15, 0, 0, 0, 0, 1],
				TYPE: ["egg", { COLOR: { BASE: 17, BRIGHTNESS_SHIFT: 7.5 } }],
			}, {
				POSITION: [9, 0, 0, 0, 0, 1],
				TYPE: ["egg", { COLOR: { BASE: -1 } }]
			},
		]
	};
	Class.burnerSnowdread = { // Flamethrower
	    PARENT: ["genericTrinought"],
	    LABEL: "Burner",
	    TURRETS: [
			{
				POSITION: [14, 0, 0, 180, 0, 1],
				TYPE: ["triangle", {MIRROR_MASTER_ANGLE: true, COLOR: {BASE: -1, BRIGHTNESS_SHIFT: 5}}],
			}, {
				POSITION: [20, 0, 0, 0, 0, 1],
				TYPE: ["triangleBaseDeco"],
			}, {
				POSITION: [9, 0, 0, 0, 360, 1],
				TYPE: 'burnerTurretSnowdread',
			}
		],
	}
	Class.tempestTurretSnowdread = {
		PARENT: 'genericTank',
		LABEL: "",
		BODY: { FOV: 1.5 },
		CONTROLLERS: [[ 'spin', {speed: 0.03}]],
		COLOR: {BASE: 17, BRIGHTNESS_SHIFT: 7.5},
		INDEPENDENT: true,
		MAX_CHILDREN: 9,
		GUNS: [],
		TURRETS: [
			{
				POSITION: [14, 0, 0, 0, 0, 1],
				TYPE: ["egg", { COLOR: { BASE: -1, BRIGHTNESS_SHIFT: -15, SATURATION_SHIFT: 0.6 } }],
			}, {
				POSITION: [8.5, 0, 0, 0, 0, 1],
				TYPE: ["egg", { COLOR: { BASE: -1 } }]
			},
		]
	};
	for (let i = 0; i < 3; i++) {
		Class.tempestTurretSnowdread.GUNS.push(
			...addDroneOnAuto({length: 6, width: 12, x: 8, aspect: 1.2, angle: 120*i}, 7.5, [g.drone, g.over, {size: 1.4}]),
		)
	}
	Class.tempestSnowdread = { // Drones
	    PARENT: ["genericTrinought"],
	    LABEL: "Tempest",
	    BODY: {
			SPEED: 0.93,
			FOV: 1.1,
		},
		TURRETS: [
			{
				POSITION: [14, 0, 0, 180, 0, 1],
				TYPE: ["triangle", {MIRROR_MASTER_ANGLE: true, COLOR: {BASE: -1, BRIGHTNESS_SHIFT: 5}}],
			}, {
				POSITION: [20, 0, 0, 0, 0, 1],
				TYPE: ["triangleBaseDeco"],
			}, {
				POSITION: [10, 0, 0, 0, 360, 1],
				TYPE: 'tempestTurretSnowdread',
			},
		]
	}
	Class.chromosphereSnowdread = {
	    PARENT: ["genericTrinought"],
	    LABEL: "Chromosphere",
	    TURRETS: [
			{
				POSITION: [14, 0, 0, 180, 0, 1],
				TYPE: ["triangle", {MIRROR_MASTER_ANGLE: true, COLOR: {BASE: -1, BRIGHTNESS_SHIFT: 5}}],
			}, {
				POSITION: [20, 0, 0, 0, 0, 1],
				TYPE: ["triangleBaseDeco"],
			},
			...addTrinoughtAuraRing(),
			{
				POSITION: [9.5, 0, 0, 0, 360, 1],
				TYPE: "trinoughtBigAura",
			},
		],
	}
	Class.mesosphereSnowdread = {
	    PARENT: ["genericTrinought"],
	    LABEL: "Mesosphere",
	    TURRETS: [
			{
				POSITION: [14, 0, 0, 180, 0, 1],
				TYPE: ["triangle", {MIRROR_MASTER_ANGLE: true, COLOR: {BASE: -1, BRIGHTNESS_SHIFT: 5}}],
			}, {
				POSITION: [20, 0, 0, 0, 0, 1],
				TYPE: ["triangleBaseDeco"],
			},
			...addTrinoughtAuraRing(true),
			{
				POSITION: [9.5, 0, 0, 0, 360, 1],
				TYPE: "trinoughtBigHealAura",
			},
		],
	}
	Class.goliathSnowdread = {
	    PARENT: ["genericTrinought"],
	    LABEL: "Goliath",
	    BODY: hpBuffBodyStats[1],
	    TURRETS: [
			{
				POSITION: [14, 0, 0, 180, 0, 1],
				TYPE: ['triangle', {COLOR: 9, MIRROR_MASTER_ANGLE: true}]
			}, {
				POSITION: [24, 0, 0, 180, 0, 0],
				TYPE: ['triangle', {COLOR: 9, MIRROR_MASTER_ANGLE: true}]
			}, {
				POSITION: [20, 0, 0, 0, 0, 1],
				TYPE: ["triangleBaseDeco"],
			},
		],
	}
	Class.planetSnowdread = {
	    PARENT: ["genericTrinought"],
	    LABEL: "Planet",
		BODY: hpBuffBodyStats[0],
	    TURRETS: [
			{
				POSITION: [24, 0, 0, 180, 0, 0],
				TYPE: ['triangle', {COLOR: 9, MIRROR_MASTER_ANGLE: true}]
			}, {
				POSITION: [13, 0, 0, 180, 0, 1],
				TYPE: ["triangle", {MIRROR_MASTER_ANGLE: true, COLOR: {BASE: -1, BRIGHTNESS_SHIFT: 5}}],
			}, {
				POSITION: [20, 0, 0, 0, 0, 1],
				TYPE: ["triangleBaseDeco"],
			},
			...addTrinoughtAuraRing(),
		],
	}
	Class.moonSnowdread = {
	    PARENT: ["genericTrinought"],
	    LABEL: "Moon",
		BODY: hpBuffBodyStats[0],
	    TURRETS: [
			{
				POSITION: [24, 0, 0, 180, 0, 0],
				TYPE: ['triangle', {COLOR: 9, MIRROR_MASTER_ANGLE: true}]
			}, {
				POSITION: [13, 0, 0, 180, 0, 1],
				TYPE: ["triangle", {MIRROR_MASTER_ANGLE: true, COLOR: {BASE: -1, BRIGHTNESS_SHIFT: 5}}],
			}, {
				POSITION: [20, 0, 0, 0, 0, 1],
				TYPE: ["triangleBaseDeco"],
			},
			...addTrinoughtAuraRing(true),
		],
	}
	Class.burgSnowdread = { // HP + auto spam
	    PARENT: ["genericTrinought"],
	    LABEL: "Burg",
		BODY: hpBuffBodyStats[0],
	    TURRETS: [
			{
				POSITION: [24, 0, 0, 180, 0, 0],
				TYPE: ['triangle', {COLOR: 9, MIRROR_MASTER_ANGLE: true}]
			}, {
				POSITION: [13, 0, 0, 180, 0, 1],
				TYPE: ["triangle", {MIRROR_MASTER_ANGLE: true, COLOR: {BASE: -1, BRIGHTNESS_SHIFT: 5}}],
			}, {
				POSITION: [20, 0, 0, 0, 0, 1],
				TYPE: ["triangleBaseDeco"],
			},
			...addTrinoughtTurretRing(),
		],
	}
	Class.siloSnowdread = { // HP + big auto
	    PARENT: ["genericTrinought"],
	    LABEL: "Silo",
		BODY: hpBuffBodyStats[0],
	    TURRETS: [
			{
				POSITION: [24, 0, 0, 180, 0, 0],
				TYPE: ['triangle', {COLOR: 9, MIRROR_MASTER_ANGLE: true}]
			},
			{
				POSITION: [14, 0, 0, 180, 0, 1],
				TYPE: ["triangle", {MIRROR_MASTER_ANGLE: true, COLOR: {BASE: -1, BRIGHTNESS_SHIFT: 5}}],
			}, {
				POSITION: [20, 0, 0, 0, 0, 1],
				TYPE: ["triangleBaseDeco"],
			}, {
				POSITION: [10, 0, 0, 0, 360, 1],
				TYPE: "kilobyteTurretSnowdread",
			},
		],
	}
	Class.titanTopSnowdread = {
	    PARENT: ["genericTrinought"],
	    GUNS: [],
	}
	for (let i = 0; i < 3; i++) {
		Class.titanTopSnowdread.GUNS.push(
			{
				POSITION: [5, 26, 0.001, 8, 0, 120*i, 0],
				PROPERTIES: {COLOR: 9},
			},
		)
	}
	Class.titanSnowdread = {
	    PARENT: ["genericTrinought"],
	    LABEL: "Titan",
		BODY: speedBuffBodyStats[1],
		GUNS: [],
	    TURRETS: [
			{
				POSITION: [11, 0, 0, 0, 0, 1],
				TYPE: ["titanTopSnowdread", {MIRROR_MASTER_ANGLE: true}]
			}, {
				POSITION: [20, 0, 0, 0, 0, 1],
				TYPE: ["triangleBaseDeco"],
			}, {
				POSITION: [20, 0, 0, 0, 0, 0],
				TYPE: ["titanTopSnowdread", {MIRROR_MASTER_ANGLE: true}]
			},
		],
	}
	Class.sirenSnowdread = {
	    PARENT: ["genericTrinought"],
	    LABEL: "Siren",
		BODY: speedBuffBodyStats[0],
		GUNS: [],
	    TURRETS: [
			{
				POSITION: [13, 0, 0, 180, 0, 1],
				TYPE: ["triangle", {MIRROR_MASTER_ANGLE: true, COLOR: {BASE: -1, BRIGHTNESS_SHIFT: 5}}],
			}, {
				POSITION: [20, 0, 0, 0, 0, 1],
				TYPE: ["triangleBaseDeco"],
			}, {
				POSITION: [20, 0, 0, 0, 0, 0],
				TYPE: ["titanTopSnowdread", {MIRROR_MASTER_ANGLE: true}]
			},
			...addTrinoughtAuraRing(),
		],
	}
	Class.harpySnowdread = {
	    PARENT: ["genericTrinought"],
	    LABEL: "Harpy",
		BODY: speedBuffBodyStats[0],
		GUNS: [],
	    TURRETS: [
			{
				POSITION: [13, 0, 0, 180, 0, 1],
				TYPE: ["triangle", {MIRROR_MASTER_ANGLE: true, COLOR: {BASE: -1, BRIGHTNESS_SHIFT: 5}}],
			}, {
				POSITION: [20, 0, 0, 0, 0, 1],
				TYPE: ["triangleBaseDeco"],
			}, {
				POSITION: [20, 0, 0, 0, 0, 0],
				TYPE: ["titanTopSnowdread", {MIRROR_MASTER_ANGLE: true}]
			},
			...addTrinoughtAuraRing(true),
		],
	}
	Class.batonSnowdread = { // Speed + auto spam
	    PARENT: ["genericTrinought"],
	    LABEL: "Baton",
		BODY: speedBuffBodyStats[0],
	    TURRETS: [
			{
				POSITION: [13, 0, 0, 180, 0, 1],
				TYPE: ["triangle", {MIRROR_MASTER_ANGLE: true, COLOR: {BASE: -1, BRIGHTNESS_SHIFT: 5}}],
			}, {
				POSITION: [20, 0, 0, 0, 0, 1],
				TYPE: ["triangleBaseDeco"],
			}, {
				POSITION: [20, 0, 0, 0, 0, 0],
				TYPE: ["titanTopSnowdread", {MIRROR_MASTER_ANGLE: true}]
			},
			...addTrinoughtTurretRing(),
		],
	}
	Class.fireworkSnowdread = { // Speed + big auto
	    PARENT: ["genericTrinought"],
	    LABEL: "Firework",
		BODY: speedBuffBodyStats[0],
	    TURRETS: [
			{
				POSITION: [14, 0, 0, 180, 0, 1],
				TYPE: ["triangle", {MIRROR_MASTER_ANGLE: true, COLOR: {BASE: -1, BRIGHTNESS_SHIFT: 5}}],
			}, {
				POSITION: [20, 0, 0, 0, 0, 1],
				TYPE: ["triangleBaseDeco"],
			}, {
				POSITION: [20, 0, 0, 0, 0, 0],
				TYPE: ["titanTopSnowdread", {MIRROR_MASTER_ANGLE: true}]
			}, {
				POSITION: [10, 0, 0, 0, 360, 1],
				TYPE: "kilobyteTurretSnowdread",
			},
		],
	}
	Class.armadaSnowdread = { // Speed + HP
	    PARENT: ["genericTrinought"],
	    LABEL: "Armada",
		BODY: {
			HEALTH: 1.8, 
			SHIELD: 1.8, 
			REGEN: 1.4, 
			SPEED: 1.75,
		},
	    TURRETS: [
			{
				POSITION: [14, 0, 0, 180, 0, 1],
				TYPE: ['triangle', {COLOR: 9, MIRROR_MASTER_ANGLE: true}]
			}, {
				POSITION: [20, 0, 0, 0, 0, 1],
				TYPE: ["triangleBaseDeco"],
			}, {
				POSITION: [20, 0, 0, 0, 0, 0],
				TYPE: ["titanTopSnowdread", {MIRROR_MASTER_ANGLE: true}]
			},
		],
	}
	Class.featherTurretSnowdread = {
		PARENT: ["genericTrinought"],
		MIRROR_MASTER_ANGLE: true,
		GUNS: [],
	}
	for(let i = 0; i < 3; i++) {
		Class.featherTurretSnowdread.GUNS.push(
			{
				POSITION: [20, 17, 0.001, 3, 0, 120*i, 0],
				PROPERTIES: {COLOR: 9}
			}, {
				POSITION: [15, 12, 0.001, 3, 0, 120*i, 0],
				PROPERTIES: {COLOR: {BASE: 9, BRIGHTNESS_SHIFT: 6}, BORDERLESS: true}
			},
		)
	}
	Class.featherSnowdread = { // Drifter
	    PARENT: ["genericTrinought"],
	    LABEL: "Feather",
		BODY: {
			SPEED: 2.05,
			ACCELERATION: 0.21,
		},
	    TURRETS: [
			{
				POSITION: [10, 0, 0, 0, 0, 1],
				TYPE: 'featherTurretSnowdread',
			}, {
				POSITION: [20, 0, 0, 0, 0, 1],
				TYPE: ["triangleBaseDeco"],
			}
		],
	}
	Class.steelTopSnowdread = {
		PARENT: ["genericTrinought"],
		SHAPE: 0,
		COLOR: {BASE: -1, BRIGHTNESS_SHIFT: 7.5},
		MIRROR_MASTER_ANGLE: true,
		GUNS: [],
	}
	for(let i = 0; i < 9; i++) {
		Class.steelTopSnowdread.GUNS.push(
			{
				POSITION: [8, 6, 0.001, 17.5, 0, 40*i, 0],
				PROPERTIES: {COLOR: 9},
			}, {
				POSITION: [8, 6, 0.001, -17.5, 0, 40*i+20, 0],
				PROPERTIES: {COLOR: 9},
			},
		)
	}
	Class.steelBottomSnowdread = {
		PARENT: ["genericTrinought"],
		MIRROR_MASTER_ANGLE: true,
		GUNS: [],
	}
	for(let i = 0; i < 3; i++) {
		Class.steelBottomSnowdread.GUNS.push(
			{
				POSITION: [3, 5, 0.001, 8, 7.5, 120*i, 0],
				PROPERTIES: {COLOR: 9},
			}, {
				POSITION: [3, 5, 0.001, 8, 0, 120*i, 0],
				PROPERTIES: {COLOR: 9},
			}, {
				POSITION: [3, 5, 0.001, 8, -7.5, 120*i, 0],
				PROPERTIES: {COLOR: 9},
			},
		)
	}
	Class.steelSnowdread = { // Body damage increase
	    PARENT: ["genericTrinought"],
	    LABEL: "Steel",
		BODY: {
			DAMAGE: 3,
			PENETRATION: 2.2,
		},
		GUNS: [],
	    TURRETS: [
			{
				POSITION: [20, 0, 0, 0, 0, 1],
				TYPE: ["triangleBaseDeco"],
			}, {
				POSITION: [6, 0, 0, 0, 360, 1],
				TYPE: 'steelTopSnowdread'
			}, {
				POSITION: [20, 0, 0, 0, 360, 0],
				TYPE: 'steelBottomSnowdread'
			},
		],
	}
	Class.flattenerTurretSnowdread = {
		PARENT: ["genericTrinought"],
		SHAPE: "",
		MIRROR_MASTER_ANGLE: true,
		GUNS: [],
	}
	Class.flattenerTurret2Snowdread = {
		PARENT: ["genericTrinought"],
		SHAPE: "",
		MIRROR_MASTER_ANGLE: true,
		GUNS: [],
	}
	for(let i = 0; i < 3; i++) {
		Class.flattenerTurretSnowdread.GUNS.push(
			{
				POSITION: [18, 25, 0, 0, 0, 120*i, 0],
				PROPERTIES: {COLOR: 9},
			}, {
				POSITION: [12, 17, 0, 4.5, 0, 120*i, 0],
				PROPERTIES: {COLOR: {BASE: 9, BRIGHTNESS_SHIFT: 6}, BORDERLESS: true},
			},
		)
		Class.flattenerTurret2Snowdread.GUNS.push(
			{
				POSITION: [17, 20, 0, 0, 0, 120*i, 0],
				PROPERTIES: {COLOR: 9},
			}, {
				POSITION: [11, 12, 0, 4, 0, 120*i, 0],
				PROPERTIES: {COLOR: {BASE: 9, BRIGHTNESS_SHIFT: 6}, BORDERLESS: true},
			},
		)
	}
	Class.flattenerSnowdread = { // Size increase
	    PARENT: ["genericTrinought"],
	    LABEL: "Flattener",
		SIZE: 1.4,
		BODY: sizeBuffBodyStats[1],
	    TURRETS: [
			{
				POSITION: [10, 0, 0, 0, 0, 1],
				TYPE: 'flattenerTurretSnowdread'
			}, {
				POSITION: [20, 0, 0, 0, 0, 1],
				TYPE: ["triangleBaseDeco"],
			}
		],
	}
	Class.towerSnowdread = { // Size increase + auras
	    PARENT: ["genericTrinought"],
	    LABEL: "Tower",
		SIZE: 1.3,
		BODY: sizeBuffBodyStats[0],
	    TURRETS: [
			{
				POSITION: [12, 0, 0, 0, 0, 1],
				TYPE: 'flattenerTurret2Snowdread'
			}, {
				POSITION: [20, 0, 0, 0, 0, 1],
				TYPE: ["triangleBaseDeco"],
			},
			...addTrinoughtAuraRing(),
		],
	}
	Class.creatureSnowdread = { // Size increase + heal auras
	    PARENT: ["genericTrinought"],
	    LABEL: "Creature",
	    SIZE: 1.3,
		BODY: sizeBuffBodyStats[0],
	    TURRETS: [
			{
				POSITION: [12, 0, 0, 0, 0, 1],
				TYPE: 'flattenerTurret2Snowdread'
			}, {
				POSITION: [20, 0, 0, 0, 0, 1],
				TYPE: ["triangleBaseDeco"],
			},
			...addTrinoughtAuraRing(true),
		],
	}
	Class.spotlightSnowdread = { // Size increase + big aura
	    PARENT: ["genericTrinought"],
	    LABEL: "Spotlight",
	    SIZE: 1.3,
		BODY: sizeBuffBodyStats[0],
	    TURRETS: [
			{
				POSITION: [12, 0, 0, 0, 0, 1],
				TYPE: 'flattenerTurretSnowdread'
			}, {
				POSITION: [20, 0, 0, 0, 0, 1],
				TYPE: ["triangleBaseDeco"],
			}, {
				POSITION: [9.5, 0, 0, 0, 360, 1],
				TYPE: "trinoughtBigAura",
			},
		],
	}
	Class.furnaceSnowdread = { // Size increase + big heal aura
	    PARENT: ["genericTrinought"],
	    LABEL: "Furnace",
	    SIZE: 1.3,
		BODY: sizeBuffBodyStats[0],
	    TURRETS: [
			{
				POSITION: [12, 0, 0, 0, 0, 1],
				TYPE: 'flattenerTurretSnowdread'
			}, {
				POSITION: [20, 0, 0, 0, 0, 1],
				TYPE: ["triangleBaseDeco"],
			}, {
				POSITION: [9.5, 0, 0, 0, 360, 1],
				TYPE: "trinoughtBigHealAura",
			},
		],
	}
	Class.asteroidSnowdread = { // Size increase + big auto
	    PARENT: ["genericTrinought"],
	    LABEL: "Asteroid",
	    SIZE: 1.3,
		BODY: sizeBuffBodyStats[0],
	    TURRETS: [
			{
				POSITION: [12, 0, 0, 0, 0, 1],
				TYPE: 'flattenerTurretSnowdread'
			}, {
				POSITION: [20, 0, 0, 0, 0, 1],
				TYPE: ["triangleBaseDeco"],
			}, {
				POSITION: [10, 0, 0, 0, 360, 1],
				TYPE: "kilobyteTurretSnowdread",
			},
		],
	}
	Class.cardinalSnowdread = { // Size decrease
	    PARENT: ["genericTrinought"],
	    LABEL: "Cardinal",
		SIZE: 0.75,
		BODY: {
			HEALTH: 0.65,
			SPEED: 1.2,
			ACCELERATION: 1.4,
		},
	    TURRETS: [
			{
				POSITION: [20, 0, 0, 0, 0, 1],
				TYPE: ["triangleBaseDeco"],
			}, {
				POSITION: [10, 0, 0, 180, 0, 1],
				TYPE: ["triangle", {COLOR: 9, MIRROR_MASTER_ANGLE: true}],
			}, {
				POSITION: [7, 0, 0, 0, 0, 1],
				TYPE: ["triangle", {COLOR: {BASE: -1, BRIGHTNESS_SHIFT: -5}, MIRROR_MASTER_ANGLE: true}],
			},
		],
	}
	Class.cagerTurretSnowdread = {
		PARENT: 'genericTank',
		CONTROLLERS: [["spin", {speed: -0.035}]],
		INDEPENDENT: true,
		LABEL: "",
		COLOR: {BASE: 17, BRIGHTNESS_SHIFT: 10},
		GUNS: [],
		TURRETS: [
			{
				POSITION: [14.5, 0, 0, 0, 0, 1],
				TYPE: ['egg', {COLOR: {BASE: 17, BRIGHTNESS_SHIFT: 17.5}}]
			}, {
				POSITION: [10, 0, 0, 30, 0, 1],
				TYPE: ['hexagon', {COLOR: -1, MIRROR_MASTER_ANGLE: true}]
			},
		]
	};
	for (let i = 0; i < 3; i++) {
		Class.cagerTurretSnowdread.GUNS.push(
			{ 
				POSITION: [10, 22, 1, -5, 2.5, 120*i, 0],
				PROPERTIES: {COLOR: {BASE: -1, BRIGHTNESS_SHIFT: -5, SATURATION_SHIFT: 0.8}}
			}, { 
				POSITION: [6, 30, 1, -3, 1.5, 120*i, 0],
				PROPERTIES: {COLOR: {BASE: 17, BRIGHTNESS_SHIFT: 5}}
			},
		)
	}
    Class.cagerSnowdread = { // Minelayer
	    PARENT: ["genericTrinought"],
	    LABEL: "Cager",
		GUNS: [
			{
				POSITION: [0, 9, 1, 0, 0, 0, 0],
				PROPERTIES: {
					MAX_CHILDREN: 5,
					SHOOT_SETTINGS: combineStats([g.trap, g.block, {recoil: 0, maxSpeed: 1e-3, speed: 1e-3}]),
					TYPE: 'unsetPillbox',
					INDEPENDENT: true,
					SYNCS_SKILLS: true,
					DESTROY_OLDEST_CHILD: true,
				}
			},
		],
	    TURRETS: [
			{
				POSITION: [14, 0, 0, 180, 0, 1],
				TYPE: ["triangle", {MIRROR_MASTER_ANGLE: true, COLOR: {BASE: -1, BRIGHTNESS_SHIFT: 5}}],
			}, {
				POSITION: [20, 0, 0, 0, 0, 1],
				TYPE: ["triangleBaseDeco"],
			}, {
				POSITION: [9.5, 0, 0, 0, 360, 1],
				TYPE: 'cagerTurretSnowdread',
			}
		],
	}
	Class.monitorRadarSnowdread = {
		PARENT: 'genericTank',
		CONTROLLERS: [['spin', {speed: 0.02}]],
		INDEPENDENT: true,
		SHAPE: [[0.175, 1], [0.175, -1], [-0.175, -1], [-0.175, 1]],
		COLOR: 17,
		GUNS: [
			{
				POSITION: [6, 17, 1, -3, 0, 0, 0],
				PROPERTIES: {COLOR: {BASE: -1, BRIGHTNESS_SHIFT: -12.5, SATURATION_SHIFT: 0.65}}
			}, {
				POSITION: [3.5, 26, 1, -1.75, 0, 0, 0],
				PROPERTIES: {COLOR: 2}
			}
		]
	};
    Class.monitorSnowdread = { // FOV
	    PARENT: ["genericTrinought"],
	    LABEL: "Monitor",
	    BODY: {
			FOV: 1.3,
			SPEED: 0.9,
		  },
		  TURRETS: [
			{
				POSITION: [14, 0, 0, 180, 0, 1],
				TYPE: ['triangle', {MIRROR_MASTER_ANGLE: true, COLOR: {BASE: -1, BRIGHTNESS_SHIFT: 5}}],
			}, {
				POSITION: [20, 0, 0, 0, 0, 1],
				TYPE: ["triangleBaseDeco"],
			}, {
				POSITION: [9, 0, 0, 0, 0, 1],
				TYPE: ['egg', {COLOR: {BASE: 17, BRIGHTNESS_SHIFT: 10}}]
			}, {
				POSITION: [6, 0, 0, 0, 0, 1],
				TYPE:['egg', {COLOR: 2}]
			}, {
				POSITION: [16, 0, 0, 0, 360, 1],
				TYPE: 'monitorRadarSnowdread'
			}
		]
	}

	// T4 Weapons
	Class.javelinSnowdread = {
	    PARENT: ["genericPentanought"],
	    LABEL: "Javelin",
	    GUNS: [],
	}
  	for (let i = 0; i < 5; i++) {
		Class.javelinSnowdread.GUNS.push(
			...addAssassin({length: 28, width: 7, x: 7, angle: 72*i}, 10, [g.basic, g.sniper, g.assass, g.assass, g.assass, g.assass, {reload: 0.8, density: 2/9}])
		)
	}
	Class.rapierSnowdread = {
	    PARENT: ["genericPentanought"],
	    LABEL: "Rapier",
	    GUNS: [],
	}
  	for (let i = 0; i < 5; i++) {
		Class.rapierSnowdread.GUNS.push(
			...addRifle({length: 18, width: 5, angle: 72*i}, 5, [g.basic, g.sniper, g.rifle, {speed: 0.8, health: 1.5}], true)
		)
	}
	Class.woomeraSnowdread = { // hunter
	    PARENT: ["genericPentanought"],
	    LABEL: "Woomera",
		CONTROLLERS: [["zoom", { distance: 450 }]],
	    GUNS: [],
	}
	for (let i = 0; i < 5; i++) {
		Class.woomeraSnowdread.GUNS.push(
			...addHunter({length: 20, width: 10.5, dimensionDifference: 2.5, angle: 72*i, barrelCount: 3}, 5, [g.basic, g.sniper, g.assass, g.hunter, g.preda, {health: 1.1}]),
			{
				POSITION: [5, 10.5, -1.6, 7.5, 0, 72*i, 0],
				PROPERTIES: { COLOR: { BASE: -1, BRIGHTNESS_SHIFT: -15, SATURATION_SHIFT: 0.5 }, },
			}, {
				POSITION: [5, 9, -1.6, 6, 0, 72*i, 0],
				PROPERTIES: { COLOR: { BASE: 17, BRIGHTNESS_SHIFT: 15 } },
			},
		)
	}
	Class.trebuchetSnowdread = { // mega-sniper
	    PARENT: ["genericPentanought"],
	    LABEL: "Trebuchet",
	    GUNS: [],
	}
	for (let i = 0; i < 5; i++) {
		Class.trebuchetSnowdread.GUNS.push(
			...addHeavySniper({length: 24, width: 9.5, angle: 72*i}, -2.5, [g.basic, g.sniper, g.preda, g.preda, g.preda, g.preda, g.bitlessspeed, g.lessreload, {health: 1.4, size: 2}])
		)
	}
	Class.boltSnowdread = { // railgun
	    PARENT: ["genericPentanought"],
	    LABEL: "Bolt",
	    GUNS: [],
	}
	for (let i = 0; i < 5; i++) {
		Class.boltSnowdread.GUNS.push(
			...addRailgun({length: 28.5, width: 4, x: 8, angle: 72*i}, -2.5, [g.basic, g.sniper, g.sniper, g.sniper, g.pound, g.lessreload, {damage: 1.2, speed: 1.2, maxSpeed: 1.2}])
		)
	}
	Class.diplomatSnowdread = {
	    PARENT: ["genericPentanought"],
	    LABEL: "Diplomat",
	    GUNS: [],
	}
  	for (let i = 0; i < 5; i++) {
		Class.diplomatSnowdread.GUNS.push(
			...addNormal({length: 13, width: 7, y: 3.25, angle: 72*i, delay: 0.5}, 10, [g.basic, g.spam, g.spam, {size: 0.85}]),
			...addNormal({length: 13, width: 7, y: -3.25, angle: 72*i, delay: 0.5}, 10, [g.basic, g.spam, g.spam, {size: 0.85}]),
			...addNormal({length: 15, width: 7, angle: 72*i}, 10, [g.basic, g.spam, g.spam, {size: 0.85}]),
		)
	}
	Class.arbitratorSnowdread = {
	    PARENT: ["genericPentanought"],
	    LABEL: "Arbitrator",
	    GUNS: [],
	}
  	for (let i = 0; i < 5; i++) {
		Class.arbitratorSnowdread.GUNS.push(
			...addNormal({length: 7.5, width: 10.75, aspect: 1.33, x: 5.5, angle: 72*i}, 10, [g.basic, g.mach, g.spam, g.spam, {size: 0.7, reload: 1.2}], false),
			...addNormal({length: 7.5, width: 9.5, aspect: 1.33, x: 7.5, angle: 72*i}, 10, [g.basic, g.mach, g.spam, g.spam, {size: 0.7, reload: 1.1}]),
			...addNormal({length: 7.5, width: 7.25, aspect: 1.25, x: 9.5, angle: 72*i}, 10, [g.basic, g.mach, g.spam, g.spam, {size: 0.7, reload: 1}]),
		)
	}
	Class.dissolverAutoSnowdread = {
		PARENT: 'autoTankGun',
		BODY: {FOV: 5},
		GUNS: [
			...addGunner({length: 25.5, width: 5, y: -3.5}, 0, [g.basic, g.sniper, g.assass, g.flank, g.flank, g.auto]),
			...addGunner({length: 25.5, width: 5, y: 3.5, delay: 0.5}, 0, [g.basic, g.sniper, g.assass, g.flank, g.flank, g.auto]),
			{
				POSITION: [7, 13, -1.3, 6, 0, 0, 0],
				PROPERTIES: { COLOR: { BASE: -1, BRIGHTNESS_SHIFT: -15, SATURATION_SHIFT: 0.5 }, },
			}, {
				POSITION: [7, 11, -1.3, 4.5, 0, 0, 0],
				PROPERTIES: { COLOR: { BASE: 17, BRIGHTNESS_SHIFT: 10 } },
			},
		],
		TURRETS: [
			{
				POSITION: [15.5, 0, 0, 0, 0, 1],
				TYPE: ["egg", { COLOR: { BASE: -1, BRIGHTNESS_SHIFT: -7.5, SATURATION_SHIFT: 0.5 } }],
			}, {
				POSITION: [10, 0, 0, 0, 0, 1],
				TYPE: ["egg", { COLOR: { BASE: -1 } }]
			},
		]
	}
	Class.dissolverSnowdread = { // all auto
	    PARENT: ["genericPentanought"],
	    LABEL: "Dissolver",
		TURRETS: [],
	}
	for(let i = 0; i < 5; i++) {
		Class.dissolverSnowdread.TURRETS.push(
			{
				POSITION: [9, 10, 0, 72*i, 200, 0],
				TYPE: 'dissolverAutoSnowdread',
			},
		)
	}
	Class.eroderSnowdread = { // ultra bullet spam
	    PARENT: ["genericPentanought"],
	    LABEL: "Eroder",
	    GUNS: [],
	}
	for(let i = 0; i < 5; i++) {
		Class.eroderSnowdread.GUNS.push(
			...addSpam({length: 14, width: 4, y: 4.5, angle: 72*i, delay: 0}, 0, [g.basic, g.mini, {health: 1.1}]),
			...addSpam({length: 12, width: 4, y: 4.5, angle: 72*i, delay: 0.5}, 0, [g.basic, g.mini, {health: 1.1}]),
			...addSpam({length: 14, width: 4, y: -4.5, angle: 72*i, delay: 0.25}, 0, [g.basic, g.mini, {health: 1.1}]),
			...addSpam({length: 12, width: 4, y: -4.5, angle: 72*i, delay: 0.75}, 0, [g.basic, g.mini, {health: 1.1}]),
			...addGunner({length: 18.5, width: 1.6, y: -2, angle: 72*i}, 0, [g.basic, g.gunner, g.twin, g.power, g.slow]),
			...addGunner({length: 18.5, width: 1.6, y: 2, angle: 72*i, delay: 0.5}, 0, [g.basic, g.gunner, g.twin, g.power, g.slow]),
			{
				POSITION: [13.5, 7.5, 1, 0, 0, 72*i, 0],
				PROPERTIES: { COLOR: { BASE: -1, BRIGHTNESS_SHIFT: -15, SATURATION_SHIFT: 0.5 }, },
			}, {
				POSITION: [12.5, 6, 1, 0, 0, 72*i, 0],
				PROPERTIES: { COLOR: { BASE: 17, BRIGHTNESS_SHIFT: 5 } },
			},
		)
	}
	Class.gripperTurretSnowdread = {
		PARENT: ["spamAutoTurret"],
		INDEPENDENT: true,
		GUNS: [
			...addGunner({length: 23, width: 13}, -2.5, [g.basic, g.pound, g.flank, g.flank, g.auto, {reload: 0.9, recoil: 0.25}])
		],
	};
	Class.gripperSnowdread = { // crowbar
	    PARENT: ["genericPentanought"],
	    LABEL: "Gripper",
	    GUNS: [],
		TURRETS: [],
	}
	for(let i = 0; i < 5; i++) {
		Class.gripperSnowdread.GUNS.push(
			...addCrowbar({length: 38, width: 7.5, x: 8, angle: 72*i}, 0)
		)
		Class.gripperSnowdread.TURRETS.push(
			{
				POSITION: [7.5, 38, 0, 72*i, 200, 1],
				TYPE: 'gripperTurretSnowdread',
			}, {
				POSITION: [7.5, 28, 0, 72*i, 200, 1],
				TYPE: 'gripperTurretSnowdread',
			},
		)
	}
	Class.retardantSnowdread = {
	    PARENT: ["genericPentanought"],
	    LABEL: "Retardant",
	    GUNS: [],
	}
  	for (let i = 0; i < 5; i++) {
		Class.retardantSnowdread.GUNS.push(
			...addHeavy({length: 17, width: 12, angle: 72*i}, 0, [g.basic, g.pound, g.destroy, g.anni, {reload: 0.9, health: 1.1}])
		)
	}
	Class.tyrantSnowdread = {
	    PARENT: ["genericPentanought"],
	    LABEL: "Tyrant",
	    GUNS: [],
	}
  	for (let i = 0; i < 5; i++) {
		Class.tyrantSnowdread.GUNS.push(
			...addLauncher({length: 15, width: 12, angle: 72*i}, 0, [g.basic, g.destroy, g.arty, g.skim, g.halfspeed, {reload: 1.5}], true, "supermissile")
		)
	}
	Class.anesthesiologistSnowdread = { // shotgun
	    PARENT: ["genericPentanought"],
	    LABEL: "Anesthesiologist",
	    GUNS: [],
	}
	for(let i = 0; i < 5; i++) {
		Class.anesthesiologistSnowdread.GUNS.push(
			...addShotgun({length: 20.5, width: 11, x: 7.5, angle: 72*i}, 5, [
				{l: 15, w: 4, y: -3},
				{l: 15, w: 4, y: 3},
				{l: 17, w: 5, y: 0},
				{l: 13, w: 5, y: -2},
				{l: 12, w: 1.5, y: -1, small: true},
				{l: 12, w: 2, y: 1, small: true},
				{l: 12, w: 2, y: 2, small: true},
			], [g.basic, g.mach, g.shotgun, {reload: 1.2, health: 1.4, damage: 1.4}], [g.basic, g.mach, g.shotgun, g.morespeed, g.fast, {reload: 1.2}])
		)
	}
	Class.helixSnowdread = { // twister
	    PARENT: ["genericPentanought"],
	    LABEL: "Helix",
	    GUNS: [],
	}
	for(let i = 0; i < 5; i++) {
		Class.helixSnowdread.GUNS.push(
			...addTwister({length: 17, width: 9.5, angle: 72*i}, 0, [g.basic, g.pound, g.arty, g.arty, g.skim, g.morespeed, g.fast, g.fast, g.one_third_reload], "spiralMissileSnowdread")
		)
	}
	Class.bombardmentSnowdread = { // artillery
	    PARENT: ["genericPentanought"],
	    LABEL: "Bombardment",
	    GUNS: [],
	}
	for(let i = 0; i < 5; i++) {
		Class.bombardmentSnowdread.GUNS.push(
			...addGunner({length: 14, width: 2, y: -4.25, angle: 72*i-7, delay: 0.6}, 0, [g.basic, g.gunner, g.arty, {speed: 1.1, maxSpeed: 1.1}]),
			...addGunner({length: 14, width: 2, y: 4.25, angle: 72*i+7, delay: 0.8}, 0, [g.basic, g.gunner, g.arty, {speed: 1.1, maxSpeed: 1.1}]),
			...addGunner({length: 15.5, width: 2, y: -2.5, angle: 72*i-7, delay: 0.2}, 0, [g.basic, g.gunner, g.arty]),
			...addGunner({length: 15.5, width: 2, y: 2.5, angle: 72*i+7, delay: 0.4}, 0, [g.basic, g.gunner, g.arty]),
			...addHeavy({length: 17.5, width: 8, angle: 72*i}, 0, [g.basic, g.destroy, g.arty, {speed: 1.1, maxSpeed: 1.1}])
		)
	}
	Class.raiderSnowdread = {
	    PARENT: ["genericPentanought"],
	    LABEL: "Raider",
	    GUNS: [],
	}
	for (let i = 0; i < 5; i++) {
		Class.raiderSnowdread.GUNS.push(
			...addDrone({length: 4, width: 5, aspect: 2.1, x: 9, y: 3.25, angle: 72*i}, 0, [g.drone, g.over, g.over, g.over, {size: 1.5, reload: 0.6}], 2, ["drone", {COLOR: 5}]),
			...addDrone({length: 4, width: 5, aspect: 2.1, x: 9, y: -3.25, angle: 72*i}, 0, [g.drone, g.over, g.over, g.over, {size: 1.5, reload: 0.6}], 2, ["drone", {COLOR: 5}]),
			...addDrone({length: 6, width: 6.5, aspect: 1.4, x: 9, angle: 72*i}, 0, [g.drone, g.over, g.over, g.over, g.pound, {size: 2, reload: 0.4}], 2, ["betadrone", {COLOR: 5}]),
		)
	}
	Class.gladiatorGenericMinionSnowdread = {
	    PARENT: ["minion"],
		BODY: { SPEED: 1 },
		SHAPE: 3.5,
	    COLOR: 5,
		GUNS: [],
	}
	Class.gladiatorTritankMinionSnowdread = {
	    PARENT: ["gladiatorGenericMinionSnowdread"],
		GUNS: [],
	}
	Class.gladiatorTritrapMinionSnowdread = {
	    PARENT: ["gladiatorGenericMinionSnowdread"],
		GUNS: [],
	}
	Class.gladiatorTriswarmMinionSnowdread = {
	    PARENT: ["gladiatorGenericMinionSnowdread"],
		GUNS: [],
	}
	Class.gladiatorAutoMinionSnowdread = makeAuto({
	    PARENT: ["gladiatorGenericMinionSnowdread"],
	}, "Minion", {size: 12, angle: 0});
	Class.gladiatorAuraMinionAuraSnowdread = addAura(1, 1.2, 0.3, 0, "Small");
	Class.gladiatorAuraMinionSnowdread = {
	    PARENT: ["gladiatorGenericMinionSnowdread"],
		TURRETS: [
			{
				POSITION: [12, 0, 0, 0, 360, 1],
				TYPE: "gladiatorAuraMinionAuraSnowdread",
			}
		]
	}
	Class.gladiatorHealAuraMinionAuraSnowdread = addAura(-2/3, 1.2);
	Class.gladiatorHealAuraMinionSnowdread = {
	    PARENT: ["gladiatorGenericMinionSnowdread"],
		TURRETS: [
			{
				POSITION: [12, 0, 0, 0, 360, 1],
				TYPE: "gladiatorHealAuraMinionAuraSnowdread",
			}
		]
	}
	for (let i = 0; i < 3; i++) {
		Class.gladiatorTritankMinionSnowdread.GUNS.push(
			{
				POSITION: [15, 8.5, 1, 0, 0, 120*i, 0],
				PROPERTIES: {
					SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.assass, g.slow, g.minion]),
					WAIT_TO_CYCLE: true,
					TYPE: ["bullet", {COLOR: 5}],
				},
			},
		);
		Class.gladiatorTritrapMinionSnowdread.GUNS.push(
			{
				POSITION: [13, 7, 1, 0, 0, 120*i, 0],
			}, {
				POSITION: [3, 7, 1.7, 13, 0, 120*i, 0],
				PROPERTIES: {
					SHOOT_SETTINGS: combineStats([g.trap, g.flank, g.minion]),
					TYPE: "trap",
					STAT_CALCULATOR: gunCalcNames.trap,
				},
			},
		);
		Class.gladiatorTriswarmMinionSnowdread.GUNS.push(
			{
				POSITION: [7, 8.5, -1.5, 7, 0, 120*i, 0],
				PROPERTIES: {
					SHOOT_SETTINGS: combineStats([g.swarm, {size: 1.6, range: 0.5}]),
					TYPE: ["swarm", {COLOR: 5}],
					STAT_CALCULATOR: gunCalcNames.swarm,
				},
			},
		);
	}
	Class.gladiatorSnowdread = {
	    PARENT: ["genericPentanought"],
	    LABEL: "Gladiator",
	    GUNS: [
			...addMinion({length: 13, width: 13, gap: 2.75, angle: 0}, 0, [g.factory, {size: 0.9, reload: 0.5}], "gladiatorTritankMinionSnowdread", 2),
			...addMinion({length: 13, width: 13, gap: 2.75, angle: 72}, 0, [g.factory, {size: 0.9, reload: 0.5}], "gladiatorTritrapMinionSnowdread", 2),
			...addMinion({length: 13, width: 13, gap: 2.75, angle: 144}, 0, [g.factory, {size: 0.9, reload: 0.5}], "gladiatorTriswarmMinionSnowdread", 2),
			...addMinion({length: 13, width: 13, gap: 2.75, angle: -144}, 0, [g.factory, {size: 0.9, reload: 0.5}], "gladiatorAutoMinionSnowdread", 2),
			...addMinion({length: 13, width: 13, gap: 2.75, angle: -72}, 0, [g.factory, {size: 0.9, reload: 0.5}], "gladiatorAuraMinionSnowdread", 2),
		],
	}
	Class.starlightSnowdread = { // auto-drones
	    PARENT: ["genericPentanought"],
	    LABEL: "Starlight",
	    GUNS: [],
	}
	for(let i = 0; i < 5; i++) {
		Class.starlightSnowdread.GUNS.push(
			...addAutoDrone({length: 5, width: 10, aspect: 1.2, x: 9, angle: 72*i}, 0, [g.drone, g.over, {reload: 1.5, speed: 1.15, maxSpeed: 1.15}], 3)
		)
	}
	Class.bruiserSnowdread = { // honcho
	    PARENT: ["genericPentanought"],
	    LABEL: "Bruiser",
	    GUNS: [],
	}
	for(let i = 0; i < 5; i++) {
		Class.bruiserSnowdread.GUNS.push(
			...addHoncho({length: 5, width: 9, aspect: 1.5, x: 9, angle: 72*i}, 0, [g.drone, g.over, g.over, g.honcho, {maxSpeed: 0.85}], 2)
		)
	};
	Class.incapacitatorSnowdread = { // swarms
	    PARENT: ["genericPentanought"],
	    LABEL: "Incapacitator",
	    GUNS: [],
	}
	for(let i = 0; i < 5; i++) {
		Class.incapacitatorSnowdread.GUNS.push(
			...addSwarm({length: 6, width: 6, x: 8, y: 3.25, angle: 72*i, delay: 0}, 0, [g.swarm, g.over, g.over, g.over, {reload: 1.15}]),
			...addSwarm({length: 6, width: 6, x: 8, y: -3.25, angle: 72*i, delay: 0.5}, 0, [g.swarm, g.over, g.over, g.over, {reload: 1.15}]),
			{
				POSITION: [3, 10, 0.85, 9, 0, 72*i, 0],
				PROPERTIES: {COLOR: {BASE: 17, BRIGHTNESS_SHIFT: 7.5}},
			},
		)
	};
	Class.cerberusSnowdread = {
	    PARENT: ["genericPentanought"],
	    LABEL: "Cerberus",
	    GUNS: [],
	}
	for (let i = 0; i < 5; i++) {
		Class.cerberusSnowdread.GUNS.push(
			...addTrap({length: 13, length2: 1.5, width: 4, y: 2.5, angle: 72*i+10, delay: 0.5}, 0, [g.trap, g.pound, g.fast, {reload: 1.09}]),
			...addTrap({length: 13, length2: 1.5, width: 4, y: -2.5, angle: 72*i-10, delay: 0.5}, 0, [g.trap, g.pound, g.fast, {reload: 1.09}]),
			...addTrap({length: 15, length2: 2, width: 5.5, aspect: 1.7, angle: 72*i}, 0, [g.trap, g.block, g.pound, g.fast, {reload: 1.09}], true),
		)
	}
	Class.luciferSnowdread = {
	    PARENT: ["genericPentanought"],
	    LABEL: "Lucifer",
	    GUNS: [],
	}
	for (let i = 0; i < 5; i++) {
		Class.luciferSnowdread.GUNS.push(
			...addTrap({length: 13, length2: 3.5, width: 10, angle: 72*i}, 0, [g.trap, g.block, g.pound, g.morespeed, {size: 1.3, health: 2}], true),
		)
	}
	Class.sterilizerSnowdread = { // auto-traps
	    PARENT: ["genericPentanought"],
	    LABEL: "Sterilizer",
	    GUNS: [],
	}
	for(let i = 0; i < 5; i++) {
		Class.sterilizerSnowdread.GUNS.push(
			...addAutoTrap({length: 16.5, length2: 2, width: 11, aspect: 1.3, angle: 72*i}, 0, [g.trap, g.block, g.halfreload, g.one_third_reload], true)
		)
	}
	Class.hielamanSnowdread = { // aura-traps
	    PARENT: ["genericPentanought"],
	    LABEL: "Hielaman",
	    GUNS: [],
	}
	for(let i = 0; i < 5; i++) {
		Class.hielamanSnowdread.GUNS.push(
			...addAuraTrap({length: 15, length2: 3, width: 9, aspect: 1.6, angle: 72*i}, 0, [g.trap, g.block, g.hexatrap, {reload: 2.4, range: 0.8, health: 2.4}], true)
		)
	}
	Class.jackhammerSnowdread = { // trap + gun
	    PARENT: ["genericPentanought"],
	    LABEL: "Jackhammer",
	    GUNS: [],
	}
	for(let i = 0; i < 5; i++) {
		Class.jackhammerSnowdread.GUNS.push(
			...addNormal({length: 21, width: 8, angle: 72*i}, 7.5),
			...addTrap({length: 14.5, length2: 3, width: 10, aspect: 1.4, angle: 72*i}, 0, [g.trap, g.block, g.hexatrap], true)
		)
	}

	// T4 Bodies
	Class.skynetSnowdread = {
	    PARENT: ["genericPentanought"],
	    LABEL: "Skynet",
	    TURRETS: [
			{
				POSITION: [11, 0, 0, 180, 0, 1],
				TYPE: ["pentagon", {MIRROR_MASTER_ANGLE: true, COLOR: {BASE: -1, BRIGHTNESS_SHIFT: 7.5}}],
			}, {
				POSITION: [20, 0, 0, 0, 0, 1],
				TYPE: ["pentagonBaseDeco"],
			},
		],
	}
	for (let i = 0; i < 5; i++) {
		Class.skynetSnowdread.TURRETS.push(
			{
				POSITION: [3.25, 4.5, 0, 72*i, 180, 1],
				TYPE: "spamAutoTurret",
			},
		)
	}
	for (let i = 0; i < 5; i++) {
		Class.skynetSnowdread.TURRETS.push(
			{
				POSITION: [3.25, 8, 0, 72*i+36, 180, 1],
				TYPE: "spamAutoTurret",
			},
		)
	}
	Class.pentanoughtBigAura = addAura(2.5, 1.5, 0.3, 0, "Large");
	Class.supernovaSnowdread = {
	    PARENT: ["genericPentanought"],
	    LABEL: "Supernova",
	    TURRETS: [
			{
				POSITION: [12, 0, 0, 180, 0, 1],
				TYPE: ["pentagon", {MIRROR_MASTER_ANGLE: true, COLOR: {BASE: -1, BRIGHTNESS_SHIFT: 7.5}}],
			}, {
				POSITION: [20, 0, 0, 0, 0, 1],
				TYPE: ["pentagonBaseDeco"],
			},
			...addPentanoughtTurretRing(),
			{
				POSITION: [9, 0, 0, 0, 360, 1],
				TYPE: "pentanoughtBigAura",
			},
		],
	}
	Class.cipherSnowdread = {
	    PARENT: ["genericPentanought"],
	    LABEL: "Cipher",
	    TURRETS: [
			{
				POSITION: [13, 0, 0, 180, 0, 1],
				TYPE: ["pentagon", {MIRROR_MASTER_ANGLE: true, COLOR: {BASE: -1, BRIGHTNESS_SHIFT: 7.5}}],
			}, {
				POSITION: [20, 0, 0, 0, 0, 1],
				TYPE: ["pentagonBaseDeco"],
			},
			...addPentanoughtTurretRing(),
			{
				POSITION: [11.5, 0, 0, 0, 360, 1],
				TYPE: "megabyteTurretSnowdread",
			},
		],
	}
	Class.pentanoughtBigHealAura = addAura(-2, 1.45, 0.3, "red", "Large");
	Class.interstellarSnowdread = {
	    PARENT: ["genericPentanought"],
	    LABEL: "Interstellar",
	    TURRETS: [
			{
				POSITION: [12, 0, 0, 180, 0, 1],
				TYPE: ["pentagon", {MIRROR_MASTER_ANGLE: true, COLOR: {BASE: -1, BRIGHTNESS_SHIFT: 7.5}}],
			}, {
				POSITION: [20, 0, 0, 0, 0, 1],
				TYPE: ["pentagonBaseDeco"],
			}, {
				POSITION: [9.5, 0, 0, 0, 360, 1],
				TYPE: "pentanoughtBigHealAura",
			},
			...addPentanoughtTurretRing(),
		],
	}
	Class.gigabyteTurretSnowdread = {
		PARENT: ["autoTankGun"],
		INDEPENDENT: true,
		COLOR: { BASE: 17, BRIGHTNESS_SHIFT: 5 },
		GUNS: [
			{
				POSITION: [21, 16, 1.3, 0, 0, 0, 0],
				PROPERTIES: {
					SHOOT_SETTINGS: combineStats([g.basic, g.pound, g.pound, g.destroy, g.auto, g.fake]),
					TYPE: "bullet",
					COLOR: { BASE: 17, BRIGHTNESS_SHIFT: 5 },
				},
			}, { // Main gun
				POSITION: [26, 16, 1, 0, 0, 0, 0],
				PROPERTIES: {
					SHOOT_SETTINGS: combineStats([g.basic, g.pound, g.pound, g.destroy, g.auto, {speed: 1.1, health: 0.8}]),
					TYPE: "bullet",
					COLOR: { BASE: -1, BRIGHTNESS_SHIFT: -15, SATURATION_SHIFT: 0.6 },
				},
			}, {
				POSITION: [21.5, 10, 1, 0, 0, 0, 0],
				PROPERTIES: {
					SHOOT_SETTINGS: combineStats([g.basic, g.pound, g.pound, g.destroy, g.auto, g.fake]),
					TYPE: "bullet",
					COLOR: { BASE: -1, BRIGHTNESS_SHIFT: -7.5, SATURATION_SHIFT: 0.7 },
					BORDERLESS: true,
				},
			}, {
				POSITION: [16.5, 3, -1.6, 0, 6.1, 0, 0],
				PROPERTIES: {
					SHOOT_SETTINGS: combineStats([g.basic, g.pound, g.pound, g.destroy, g.auto, g.fake]),
					TYPE: "bullet",
					COLOR: { BASE: 17, BRIGHTNESS_SHIFT: 7.5 },
				},
			}, {
				POSITION: [16.5, 3, -1.6, 0, -6.1, 0, 0],
				PROPERTIES: {
					SHOOT_SETTINGS: combineStats([g.basic, g.pound, g.pound, g.destroy, g.auto, g.fake]),
					TYPE: "bullet",
					COLOR: { BASE: 17, BRIGHTNESS_SHIFT: 7.5 },
				},
			}, {
				POSITION: [10, 9.5, 0.5, 0, 0, 55, 0],
				PROPERTIES: { COLOR: 17, DRAW_ABOVE: true }
			}, {
				POSITION: [10, 9.5, 0.5, 0, 0, -55, 0],
				PROPERTIES: { COLOR: 17, DRAW_ABOVE: true }
			}, {
				POSITION: [10, 9.5, 0.5, 0, 0, 135, 0],
				PROPERTIES: { COLOR: 17, DRAW_ABOVE: true }
			}, {
				POSITION: [10, 9.5, 0.5, 0, 0, -135, 0],
				PROPERTIES: { COLOR: 17, DRAW_ABOVE: true }
			}
		],
		TURRETS: [
			{
				POSITION: [14.5, 0, 0, 0, 0, 1],
				TYPE: ["egg", { COLOR: { BASE: -1, BRIGHTNESS_SHIFT: -17.5, SATURATION_SHIFT: 0.5 } }],
			}, {
				POSITION: [9.5, 0, 0, 0, 0, 1],
				TYPE: ["egg", { COLOR: { BASE: -1 } }]
			},
		]
	}
	Class.gigabyteSnowdread = {
	    PARENT: ["genericPentanought"],
	    LABEL: "Gigabyte",
	    TURRETS: [
			{
				POSITION: [14.5, 0, 0, 180, 0, 1],
				TYPE: ["pentagon", {MIRROR_MASTER_ANGLE: true, COLOR: {BASE: -1, BRIGHTNESS_SHIFT: 7.5}}],
			}, {
				POSITION: [20, 0, 0, 0, 0, 1],
				TYPE: ["pentagonBaseDeco"],
			}, {
				POSITION: [13, 0, 0, 0, 360, 1],
				TYPE: "gigabyteTurretSnowdread",
			},
		],
	}
	Class.pentanoughtSmallAura = addAura(1, 1.6, 0.15, 0, "Small");
	Class.malwareSnowdread = {
	    PARENT: ["genericPentanought"],
	    LABEL: "Malware",
	    TURRETS: [
			{
				POSITION: [13, 0, 0, 180, 0, 1],
				TYPE: ["pentagon", {MIRROR_MASTER_ANGLE: true, COLOR: {BASE: -1, BRIGHTNESS_SHIFT: 7.5}}],
			}, {
				POSITION: [20, 0, 0, 0, 0, 1],
				TYPE: ["pentagonBaseDeco"],
			},
			...addPentanoughtAuraRing(),
			{
				POSITION: [11.5, 0, 0, 0, 360, 1],
				TYPE: "megabyteTurretSnowdread",
			},
		],
	}
	Class.pentanoughtSmallHealAura = addAura(-2/3, 1.6, 0.15, "red", "Small");
	Class.softwareSnowdread = {
	    PARENT: ["genericPentanought"],
	    LABEL: "Software",
	    TURRETS: [
			{
				POSITION: [13, 0, 0, 180, 0, 1],
				TYPE: ["pentagon", {MIRROR_MASTER_ANGLE: true, COLOR: {BASE: -1, BRIGHTNESS_SHIFT: 7.5}}],
			}, {
				POSITION: [20, 0, 0, 0, 0, 1],
				TYPE: ["pentagonBaseDeco"],
			},
			...addPentanoughtAuraRing(true),
			{
				POSITION: [11.5, 0, 0, 0, 360, 1],
				TYPE: "megabyteTurretSnowdread",
			},
		],
	}
	Class.roasterTurretSnowdread = {
		PARENT: 'genericTank',
		COLOR: -1,
		CONTROLLERS: ['nearestDifferentMaster'],
		INDEPENDENT: true,
		GUNS: [
			{
				POSITION: [15, 12, 1.6, 0, 0, 180, 0],
				PROPERTIES: {COLOR: {BASE: -1, BRIGHTNESS_SHIFT: 5, SATURATION_SHIFT: 0.9}},
			}, {
			  	POSITION: [16.5, 7, 1.5, 0, 0, 180, 0],
				PROPERTIES: {COLOR: {BASE: 17, BRIGHTNESS_SHIFT: 5}},
			}, {
			  	POSITION: [13, 2, 1, 0, -8, -10, 0],
				  PROPERTIES: {COLOR: {BASE: 17, BRIGHTNESS_SHIFT: 12.5}},
			}, {
			  	POSITION: [20.5, 7, 1.1, 0, -2, -10, 0],
			  	PROPERTIES: {
					SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.auto, g.flame]),
					TYPE: 'growBullet',
					COLOR: {BASE: -1, BRIGHTNESS_SHIFT: -5, SATURATION_SHIFT: 0.7},
			  	}
			}, {
				POSITION: [13, 2, 1, 0, 8, 10, 0],
				PROPERTIES: {COLOR: {BASE: 17, BRIGHTNESS_SHIFT: 12.5}},
			}, {
				POSITION: [20.5, 7, 1.1, 0, 2, 10, 0],
				PROPERTIES: {
					SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.auto, g.flame]),
					TYPE: 'growBullet',
					COLOR: {BASE: -1, BRIGHTNESS_SHIFT: -5, SATURATION_SHIFT: 0.7},
				}
			}, {
				POSITION: [13, 11.5, -1.4, 0, 0, 0, 0],
				PROPERTIES: {COLOR: {BASE: 17, BRIGHTNESS_SHIFT: 7.5}}
			},
		],
		TURRETS: [
			{
				POSITION: [15.5, 0, 0, 0, 0, 1],
				TYPE: ["egg", { COLOR: { BASE: 17, BRIGHTNESS_SHIFT: 7.5 } }],
			}, {
				POSITION: [10, 0, 0, 0, 0, 1],
				TYPE: ["egg", { COLOR: { BASE: -1, BRIGHTNESS_SHIFT: -2.5 } }]
			},
		]
	};
	Class.roasterSnowdread = { // Flamethrower
	    PARENT: ["genericPentanought"],
	    LABEL: "Roaster",
	    TURRETS: [
			{
				POSITION: [14, 0, 0, 180, 0, 1],
				TYPE: ['pentagon', {MIRROR_MASTER_ANGLE: true, COLOR: {BASE: -1, BRIGHTNESS_SHIFT: 7.5}}],
			}, {
				POSITION: [20, 0, 0, 0, 0, 1],
				TYPE: ["pentagonBaseDeco"],
			}, {
				POSITION: [10.5, 0, 0, 0, 360, 1],
				TYPE: 'roasterTurretSnowdread'
			},
		],
	}
	Class.monsoonTurretSnowdread = {
		PARENT: 'genericTank',
		LABEL: "",
		BODY: { FOV: 1.5 },
		CONTROLLERS: [[ 'spin', {speed: 0.03}]],
		COLOR: {BASE: 17, BRIGHTNESS_SHIFT: 7.5},
		INDEPENDENT: true,
		MAX_CHILDREN: 9,
		GUNS: [],
		TURRETS: [
			{
				POSITION: [14, 0, 0, 0, 0, 1],
				TYPE: ["egg", { COLOR: { BASE: -1, BRIGHTNESS_SHIFT: -15, SATURATION_SHIFT: 0.6 } }],
			}, {
				POSITION: [9.5, 0, 0, 0, 0, 1],
				TYPE: ["egg", { COLOR: { BASE: -1 } }]
			},
		]
	}
	for (let i = 0; i < 3; i++) {
		Class.monsoonTurretSnowdread.GUNS.push(
			...addDroneOnAuto({length: 6.5, width: 12.5, aspect: 1.2, x: 7.5, angle: 120*i}, 5, [g.drone, {size: 1.5, health: 1.1}])
		)
	}
	Class.monsoonSnowdread = { // Drones
	    PARENT: ["genericPentanought"],
	    LABEL: "Monsoon",
		BODY: {
			SPEED: 0.93,
			FOV: 1.1,
		},
	    TURRETS: [
			{
				POSITION: [14, 0, 0, 180, 0, 1],
				TYPE: ['pentagon', {MIRROR_MASTER_ANGLE: true, COLOR: {BASE: -1, BRIGHTNESS_SHIFT: 7.5}}],
			}, {
				POSITION: [20, 0, 0, 0, 0, 1],
				TYPE: ["pentagonBaseDeco"],
			}, {
				POSITION: [10.5, 0, 0, 0, 360, 1],
				TYPE: 'monsoonTurretSnowdread'
			},
		],
	}
	Class.photosphereSmallAuraSnowdread = addAura(1, 1.85, 0.1, 0, "Small");
	Class.photosphereBigAuraSnowdread = addAura(1.5, 4, 0.15);
	Class.photosphereSnowdread = {
	    PARENT: ["genericPentanought"],
	    LABEL: "Photosphere",
	    TURRETS: [
			{
				POSITION: [12, 0, 0, 180, 0, 1],
				TYPE: ["pentagon", {MIRROR_MASTER_ANGLE: true, COLOR: {BASE: -1, BRIGHTNESS_SHIFT: 7.5}}],
			}, {
				POSITION: [20, 0, 0, 0, 0, 1],
				TYPE: ["pentagonBaseDeco"],
			},
		],
	}
	for (let i = 0; i < 5; i++) {
		Class.photosphereSnowdread.TURRETS.push(
			{
				POSITION: [3.5, 8.75, 0, 72*i+36, 360, 1],
				TYPE: "photosphereSmallAuraSnowdread",
			},
		)
	}
	for (let i = 0; i < 5; i++) {
		Class.photosphereSnowdread.TURRETS.push(
			{
				POSITION: [3, 4, 0, 72*i, 360, 1],
				TYPE: "photosphereBigAuraSnowdread",
			},
		)
	}
	Class.stratosphereSnowdread = {
	    PARENT: ["genericPentanought"],
	    LABEL: "Stratosphere",
	    TURRETS: [
			{
				POSITION: [12, 0, 0, 180, 0, 1],
				TYPE: ["pentagon", {MIRROR_MASTER_ANGLE: true, COLOR: {BASE: -1, BRIGHTNESS_SHIFT: 7.5}}],
			}, {
				POSITION: [20, 0, 0, 0, 0, 1],
				TYPE: ["pentagonBaseDeco"],
			},
			...addPentanoughtAuraRing(true),
			{
				POSITION: [9.5, 0, 0, 0, 360, 1],
				TYPE: "pentanoughtBigHealAura",
			},
		],
	}
	Class.behemothSnowdread = {
	    PARENT: ["genericPentanought"],
	    LABEL: "Behemoth",
		BODY: hpBuffBodyStats[2],
	    TURRETS: [
			{
				POSITION: [14, 0, 0, 180, 0, 1],
				TYPE: ["pentagon", {COLOR: 9, MIRROR_MASTER_ANGLE: true}],
			}, {
				POSITION: [20, 0, 0, 0, 0, 1],
				TYPE: ["pentagonBaseDeco"],
			}, {
				POSITION: [24, 0, 0, 180, 0, 0],
				TYPE: ["pentagon", {COLOR: 9, MIRROR_MASTER_ANGLE: true}],
			},
		],
	}
	Class.astronomicSnowdread = {
	    PARENT: ["genericPentanought"],
	    LABEL: "Astronomic",
		BODY: hpBuffBodyStats[1],
	    TURRETS: [
			{
				POSITION: [12, 0, 0, 180, 0, 1],
				TYPE: ["pentagon", {MIRROR_MASTER_ANGLE: true, COLOR: {BASE: -1, BRIGHTNESS_SHIFT: 7.5}}],
			}, {
				POSITION: [24, 0, 0, 180, 0, 0],
				TYPE: ["pentagon", {COLOR: 9,MIRROR_MASTER_ANGLE: true}],
			}, {
				POSITION: [20, 0, 0, 0, 0, 1],
				TYPE: ["pentagonBaseDeco"],
			},
			...addPentanoughtAuraRing(),
		],
	}
	Class.grandioseSnowdread = {
	    PARENT: ["genericPentanought"],
	    LABEL: "Grandiose",
		BODY: hpBuffBodyStats[1],
	    TURRETS: [
			{
				POSITION: [12, 0, 0, 180, 0, 1],
				TYPE: ["pentagon", {MIRROR_MASTER_ANGLE: true, COLOR: {BASE: -1, BRIGHTNESS_SHIFT: 7.5}}],
			}, {
				POSITION: [20, 0, 0, 0, 0, 1],
				TYPE: ["pentagonBaseDeco"],
			}, {
				POSITION: [24, 0, 0, 180, 0, 0],
				TYPE: ["pentagon", {COLOR: 9,MIRROR_MASTER_ANGLE: true}],
			},
			...addPentanoughtAuraRing(true),
		],
	}
	Class.bunkerSnowdread = { // HP + auto spam
	    PARENT: ["genericPentanought"],
	    LABEL: "Bunker",
		BODY: hpBuffBodyStats[1],
	    TURRETS: [
			{
				POSITION: [12, 0, 0, 180, 0, 1],
				TYPE: ["pentagon", {MIRROR_MASTER_ANGLE: true, COLOR: {BASE: -1, BRIGHTNESS_SHIFT: 7.5}}],
			}, {
				POSITION: [20, 0, 0, 0, 0, 1],
				TYPE: ["pentagonBaseDeco"],
			}, {
				POSITION: [24, 0, 0, 180, 0, 0],
				TYPE: ["pentagon", {COLOR: 9,MIRROR_MASTER_ANGLE: true}],
			},
			...addPentanoughtTurretRing(),
		],
	}
	Class.arsenalSnowdread = { // HP + big auto
	    PARENT: ["genericPentanought"],
	    LABEL: "Arsenal",
		BODY: hpBuffBodyStats[1],
	    TURRETS: [
			{
				POSITION: [14, 0, 0, 180, 0, 1],
				TYPE: ["pentagon", {MIRROR_MASTER_ANGLE: true, COLOR: {BASE: -1, BRIGHTNESS_SHIFT: 7.5}}],
			}, {
				POSITION: [20, 0, 0, 0, 0, 1],
				TYPE: ["pentagonBaseDeco"],
			}, {
				POSITION: [24, 0, 0, 180, 0, 0],
				TYPE: ["pentagon", {COLOR: 9,MIRROR_MASTER_ANGLE: true}],
			}, {
				POSITION: [11.5, 0, 0, 0, 360, 1],
				TYPE: "megabyteTurretSnowdread",
			},
		],
	}
	Class.pentagonLeviathanTopSnowdread = {
	    PARENT: ["genericPentanought"],
	    LABEL: "Leviathan",
		MIRROR_MASTER_ANGLE: true,
	    GUNS: [],
	}
	Class.pentagonLeviathanBottomSnowdread = {
	    PARENT: ["genericPentanought"],
	    LABEL: "Leviathan",
		MIRROR_MASTER_ANGLE: true,
	    GUNS: [],
	}
	for (let i = 0; i < 5; i++) {
		Class.pentagonLeviathanTopSnowdread.GUNS.push(
			{
				POSITION: [6, 13.5, 0.001, 9, 0, 72*i, 0],
				PROPERTIES: {COLOR: 9},
			}, {
				POSITION: [4, 11.5, 0, 5.7, 0, 72*i, 0],
				PROPERTIES: {COLOR: 9, DRAW_ABOVE: true},
			},
		);
		Class.pentagonLeviathanBottomSnowdread.GUNS.push(
			{
				POSITION: [7, 17, 0.001, 9, 0, 72*i, 0],
				PROPERTIES: {COLOR: 9},
			}
		);
	}
	Class.hexagonLeviathanTopSnowdread = {
	    PARENT: ["genericHexnought"],
	    LABEL: "Leviathan",
		MIRROR_MASTER_ANGLE: true,
	    GUNS: [],
	}
	Class.hexagonLeviathanBottomSnowdread = {
	    PARENT: ["genericHexnought"],
	    LABEL: "Leviathan",
		MIRROR_MASTER_ANGLE: true,
	    GUNS: [],
	}
	for (let i = 0; i < 6; i++) {
		Class.hexagonLeviathanTopSnowdread.GUNS.push(
			{
				POSITION: [6, 10, 0.001, 9.5, 0, 60*i, 0],
				PROPERTIES: {COLOR: 9},
			}, {
				POSITION: [3, 9, 0, 7, 0, 60*i, 0],
				PROPERTIES: {COLOR: 9, DRAW_ABOVE: true},
			},
		)
		Class.hexagonLeviathanBottomSnowdread.GUNS.push(
			{
				POSITION: [7, 13.5, 0.001, 9.5, 0, 60*i, 0],
				PROPERTIES: {COLOR: 9},
			},
		)
	}
	Class.leviathanSnowdread = {
	    PARENT: ["genericPentanought"],
	    LABEL: "Leviathan",
		BODY: speedBuffBodyStats[2],
	    TURRETS: [
			{
				POSITION: [12, 0, 0, 0, 0, 1],
				TYPE: ["pentagonLeviathanTopSnowdread", {MIRROR_MASTER_ANGLE: true}]
			}, {
				POSITION: [20, 0, 0, 0, 0, 1],
				TYPE: ["pentagonBaseDeco"],
			}, {
				POSITION: [20, 0, 0, 0, 0, 0],
				TYPE: ["pentagonLeviathanBottomSnowdread", {MIRROR_MASTER_ANGLE: true}]
			},
		],
	}
	Class.valrayvnSnowdread = {
	    PARENT: ["genericPentanought"],
	    LABEL: "Valrayvn",
		BODY: speedBuffBodyStats[1],
	    TURRETS: [
			{
				POSITION: [12, 0, 0, 180, 0, 1],
				TYPE: ["pentagon", {MIRROR_MASTER_ANGLE: true, COLOR: {BASE: -1, BRIGHTNESS_SHIFT: 7.5}}],
			}, {
				POSITION: [20, 0, 0, 0, 0, 1],
				TYPE: ["pentagonBaseDeco"],
			}, {
				POSITION: [20, 0, 0, 0, 0, 0],
				TYPE: ["pentagonLeviathanBottomSnowdread", {MIRROR_MASTER_ANGLE: true}]
			},
			...addPentanoughtAuraRing(),
		],
	}
	Class.pegasusSnowdread = {
	    PARENT: ["genericPentanought"],
	    LABEL: "Pegasus",
		BODY: speedBuffBodyStats[1],
	    TURRETS: [
			{
				POSITION: [12, 0, 0, 180, 0, 1],
				TYPE: ["pentagon", {MIRROR_MASTER_ANGLE: true, COLOR: {BASE: -1, BRIGHTNESS_SHIFT: 7.5}}],
			}, {
				POSITION: [20, 0, 0, 0, 0, 1],
				TYPE: ["pentagonBaseDeco"],
			}, {
				POSITION: [20, 0, 0, 0, 0, 0],
				TYPE: ["pentagonLeviathanBottomSnowdread", {MIRROR_MASTER_ANGLE: true}]
			},
			...addPentanoughtAuraRing(true),
		],
	}
	Class.maceSnowdread = { // Speed + auto spam
	    PARENT: ["genericPentanought"],
	    LABEL: "Mace",
		BODY: speedBuffBodyStats[1],
	    TURRETS: [
			{
				POSITION: [12, 0, 0, 180, 0, 1],
				TYPE: ["pentagon", {MIRROR_MASTER_ANGLE: true, COLOR: {BASE: -1, BRIGHTNESS_SHIFT: 7.5}}],
			}, {
				POSITION: [20, 0, 0, 0, 0, 1],
				TYPE: ["pentagonBaseDeco"],
			}, {
				POSITION: [20, 0, 0, 0, 0, 0],
				TYPE: ["pentagonLeviathanBottomSnowdread", {MIRROR_MASTER_ANGLE: true}]
			},
			...addPentanoughtTurretRing(),
		],
	}
	Class.missileSnowdread = { // Speed + big auto
	    PARENT: ["genericPentanought"],
	    LABEL: "Missile",
		BODY: speedBuffBodyStats[1],
	    TURRETS: [
			{
				POSITION: [14, 0, 0, 180, 0, 1],
				TYPE: ["pentagon", {MIRROR_MASTER_ANGLE: true, COLOR: {BASE: -1, BRIGHTNESS_SHIFT: 7.5}}],
			}, {
				POSITION: [20, 0, 0, 0, 0, 1],
				TYPE: ["pentagonBaseDeco"],
			}, {
				POSITION: [20, 0, 0, 0, 0, 0],
				TYPE: ["pentagonLeviathanBottomSnowdread", {MIRROR_MASTER_ANGLE: true}]
			}, {
				POSITION: [11.5, 0, 0, 0, 360, 1],
				TYPE: "megabyteTurretSnowdread",
			},
		],
	}
	Class.battalionSnowdread = { // Speed + HP
	    PARENT: ["genericPentanought"],
	    LABEL: "Battalion",
		BODY: {
			HEALTH: 2.8, 
			SHIELD: 2.8, 
			REGEN: 1.8, 
			SPEED: 2.15,
		},
	    TURRETS: [
			{
				POSITION: [15, 0, 0, 180, 0, 1],
				TYPE: ["pentagon", {COLOR: 9, MIRROR_MASTER_ANGLE: true}],
			}, {
				POSITION: [20, 0, 0, 0, 0, 1],
				TYPE: ["pentagonBaseDeco"],
			}, {
				POSITION: [20, 0, 0, 0, 0, 0],
				TYPE: ["pentagonLeviathanBottomSnowdread", {MIRROR_MASTER_ANGLE: true}]
			},
		],
	}
	Class.pentagonWispTurretSnowdread = {
		PARENT: ["genericPentanought"],
		SHAPE: 5,
		COLOR: {BASE: -1, BRIGHTNESS_SHIFT: 7.5},
		MIRROR_MASTER_ANGLE: true,
		GUNS: [],
	}
	for(let i = 0; i < 5; i++) {
		Class.pentagonWispTurretSnowdread.GUNS.push(
			{
				POSITION: [26, 13, 0.001, 3, 0, 72*i+36, 0],
				PROPERTIES: {COLOR: 9}
			}, {
				POSITION: [23.5, 10, 0.001, 0, 0, 72*i+36, 0],
				PROPERTIES: {COLOR: {BASE: 9, BRIGHTNESS_SHIFT: 6}, BORDERLESS: true}
			},
		)
	}
	Class.hexagonWispTurretSnowdread = {
		PARENT: ["genericHexnought"],
		SHAPE: 6,
		MIRROR_MASTER_ANGLE: true,
		GUNS: [],
	}
	for(let i = 0; i < 6; i++) {
		Class.hexagonWispTurretSnowdread.GUNS.push(
			{
				POSITION: [26, 13, 0.001, 3, 0, 60*i, 0],
				PROPERTIES: {COLOR: 9}
			}, {
				POSITION: [23.5, 10, 0.001, 0, 0, 60*i, 0],
				PROPERTIES: {COLOR: {BASE: 9, BRIGHTNESS_SHIFT: 6}, BORDERLESS: true}
			},
		)
	}
	Class.wispSnowdread = { // Drifter
	    PARENT: ["genericPentanought"],
	    LABEL: "Wisp",
		BODY: {
			SPEED: 2.2,
			ACCELERATION: 0.18,
		},
	    TURRETS: [
			{
				POSITION: [20, 0, 0, 0, 0, 1],
				TYPE: ["pentagonBaseDeco"],
			}, {
				POSITION: [11, 0, 0, 0, 0, 1],
				TYPE: ['pentagonWispTurretSnowdread']
			}
		],
	}
	Class.pentagonTitaniumTopSnowdread = {
		PARENT: ["genericPentanought"],
		SHAPE: 0,
		COLOR: {BASE: -1, BRIGHTNESS_SHIFT: 7.5},
		MIRROR_MASTER_ANGLE: true,
		GUNS: [],
	}
	for(let i = 0; i < 10; i++) {
		Class.pentagonTitaniumTopSnowdread.GUNS.push(
			{
				POSITION: [8, 6, 0.001, 20, 0, 36*i, 0],
				PROPERTIES: {COLOR: 9},
			}, {
				POSITION: [8, 6, 0.001, -20, 0, 36*i, 0],
				PROPERTIES: {COLOR: 9},
			},
		)
	}
	Class.pentagonTitaniumBottomSnowdread = {
		PARENT: ["genericPentanought"],
		MIRROR_MASTER_ANGLE: true,
		GUNS: [],
	}
	for(let i = 0; i < 5; i++) {
		Class.pentagonTitaniumBottomSnowdread.GUNS.push(
			{
				POSITION: [5, 6, 0.001, 9.5, 3.5, 72*i, 0],
				PROPERTIES: {COLOR: 9},
			}, {
				POSITION: [5, 6, 0.001, 9.5, -3.5, 72*i, 0],
				PROPERTIES: {COLOR: 9},
			},
		)
	}
	Class.hexagonTitaniumTopSnowdread = {
		PARENT: ["genericHexnought"],
		SHAPE: 0,
		COLOR: {BASE: -1, BRIGHTNESS_SHIFT: 7.5},
		MIRROR_MASTER_ANGLE: true,
		GUNS: [],
	}
	for(let i = 0; i < 12; i++) {
		Class.hexagonTitaniumTopSnowdread.GUNS.push(
			{
				POSITION: [8, 6, 0.001, 20, 0, 30*i, 0],
				PROPERTIES: {COLOR: 9},
			}, {
				POSITION: [8, 6, 0.001, -20, 0, 30*i, 0],
				PROPERTIES: {COLOR: 9},
			},
		)
	}
	Class.hexagonTitaniumBottomSnowdread = {
		PARENT: ["genericHexnought"],
		MIRROR_MASTER_ANGLE: true,
		GUNS: [],
	}
	for(let i = 0; i < 6; i++) {
		Class.hexagonTitaniumBottomSnowdread.GUNS.push(
			{
				POSITION: [5, 5.5, 0.001, 9.5, 3.5, 60*i, 0],
				PROPERTIES: {COLOR: 9},
			}, {
				POSITION: [5, 5.5, 0.001, 9.5, -3.5, 60*i, 0],
				PROPERTIES: {COLOR: 9},
			},
		)
	}
	Class.titaniumSnowdread = { // Body damage increase
	    PARENT: ["genericPentanought"],
	    LABEL: "Titanium",
		BODY: {
			DAMAGE: 3.7,
			PENETRATION: 2.9,
		},
	    TURRETS: [
			{
				POSITION: [14, 0, 0, 180, 0, 1],
				TYPE: ["pentagon", {MIRROR_MASTER_ANGLE: true, COLOR: {BASE: -1, BRIGHTNESS_SHIFT: 7.5}}],
			}, {
				POSITION: [20, 0, 0, 0, 0, 1],
				TYPE: ["pentagonBaseDeco"],
			}, {
				POSITION: [6, 0, 0, 0, 360, 1],
				TYPE: ['pentagonTitaniumTopSnowdread']
			}, {
				POSITION: [20, 0, 0, 0, 360, 0],
				TYPE: ['pentagonTitaniumBottomSnowdread']
			},
		],
	}
	Class.pentagonCrusherTurretSnowdread = {
		PARENT: ["genericPentanought"],
		MIRROR_MASTER_ANGLE: true,
		COLOR: {BASE: -1, BRIGHTNESS_SHIFT: 7.5},
		GUNS: [],
	}
	Class.pentagonCrusherTurret2Snowdread = {
		PARENT: ["genericPentanought"],
		MIRROR_MASTER_ANGLE: true,
		COLOR: {BASE: -1, BRIGHTNESS_SHIFT: 7.5},
		GUNS: [],
	}
	Class.pentagonCrusherTurret3Snowdread = {
		PARENT: ["genericPentanought"],
		MIRROR_MASTER_ANGLE: true,
		COLOR: {BASE: -1, BRIGHTNESS_SHIFT: 7.5},
		GUNS: [],
	}
	for(let i = 0; i < 5; i++) {
		Class.pentagonCrusherTurretSnowdread.GUNS.push(
			{
				POSITION: [20, 16, 0, 0, 0, 72*i, 0],
				PROPERTIES: {COLOR: 9},
			}, {
				POSITION: [14, 10, 0, 3.5, 0, 72*i, 0],
				PROPERTIES: {COLOR: {BASE: 9, BRIGHTNESS_SHIFT: 6}, BORDERLESS: true},
			},
		)
		Class.pentagonCrusherTurret2Snowdread.GUNS.push(
			{
				POSITION: [21, 11, 0, 0, 0, 72*i, 0],
				PROPERTIES: {COLOR: 9},
			}, {
				POSITION: [15, 6, 0, 3.5, 0, 72*i, 0],
				PROPERTIES: {COLOR: {BASE: 9, BRIGHTNESS_SHIFT: 6}, BORDERLESS: true},
			},
		)
		Class.pentagonCrusherTurret3Snowdread.GUNS.push(
			{
				POSITION: [17, 16, 0, 0, 0, 72*i, 0],
				PROPERTIES: {COLOR: 9},
			}, {
				POSITION: [10, 11, 0, 5, 0, 72*i, 0],
				PROPERTIES: {COLOR: {BASE: 9, BRIGHTNESS_SHIFT: 6}, BORDERLESS: true},
			},
		)
	}
	Class.hexagonCrusherTurretSnowdread = {
		PARENT: ["genericHexnought"],
		MIRROR_MASTER_ANGLE: true,
		COLOR: {BASE: -1, BRIGHTNESS_SHIFT: 7.5},
		GUNS: [],
	}
	Class.hexagonCrusherTurret2Snowdread = {
		PARENT: ["genericHexnought"],
		MIRROR_MASTER_ANGLE: true,
		COLOR: {BASE: -1, BRIGHTNESS_SHIFT: 7.5},
		GUNS: [],
	}
	Class.hexagonCrusherTurret3Snowdread = {
		PARENT: ["genericHexnought"],
		MIRROR_MASTER_ANGLE: true,
		COLOR: {BASE: -1, BRIGHTNESS_SHIFT: 7.5},
		GUNS: [],
	}
	for(let i = 0; i < 6; i++) {
		Class.hexagonCrusherTurretSnowdread.GUNS.push(
			{
				POSITION: [20, 13.5, 0, 0, 0, 60*i, 0],
				PROPERTIES: {COLOR: 9},
			}, {
				POSITION: [14, 7.5, 0, 3.5, 0, 60*i, 0],
				PROPERTIES: {COLOR: {BASE: 9, BRIGHTNESS_SHIFT: 6}, BORDERLESS: true},
			},
		)
		Class.hexagonCrusherTurret2Snowdread.GUNS.push(
			{
				POSITION: [21, 8.5, 0, 0, 0, 60*i, 0],
				PROPERTIES: {COLOR: 9},
			}, {
				POSITION: [15, 4, 0, 3.5, 0, 60*i, 0],
				PROPERTIES: {COLOR: {BASE: 9, BRIGHTNESS_SHIFT: 6}, BORDERLESS: true},
			},
		)
		Class.hexagonCrusherTurret3Snowdread.GUNS.push(
			{
				POSITION: [17, 13.5, 0, 0, 0, 60*i, 0],
				PROPERTIES: {COLOR: 9},
			}, {
				POSITION: [10, 9, 0, 5, 0, 60*i, 0],
				PROPERTIES: {COLOR: {BASE: 9, BRIGHTNESS_SHIFT: 6}, BORDERLESS: true},
			},
		)
	}
	Class.crusherSnowdread = { // Size increase
	    PARENT: ["genericPentanought"],
	    LABEL: "Crusher",
		SIZE: 1.5,
		BODY: sizeBuffBodyStats[2],
	    TURRETS: [
			{
				POSITION: [20, 0, 0, 0, 0, 1],
				TYPE: ["pentagonBaseDeco"],
			}, {
				POSITION: [10, 0, 0, 0, 0, 1],
				TYPE: ['pentagonCrusherTurretSnowdread']
			}
		],
	}
	Class.mountainSnowdread = { // Size increase + auras
	    PARENT: ["genericPentanought"],
	    LABEL: "Mountain",
		SIZE: 1.4,
		BODY: sizeBuffBodyStats[1],
	    TURRETS: [
			{
				POSITION: [20, 0, 0, 0, 0, 1],
				TYPE: ["pentagonBaseDeco"],
			}, {
				POSITION: [10, 0, 0, 0, 0, 1],
				TYPE: ['pentagonCrusherTurret2Snowdread']
			},
			...addPentanoughtAuraRing(),
		],
	}
	Class.beastSnowdread = { // Size increase + heal auras
	    PARENT: ["genericPentanought"],
	    LABEL: "Beast",
		SIZE: 1.4,
		BODY: sizeBuffBodyStats[1],
	    TURRETS: [
			{
				POSITION: [20, 0, 0, 0, 0, 1],
				TYPE: ["pentagonBaseDeco"],
			}, {
				POSITION: [10, 0, 0, 0, 0, 1],
				TYPE: ['pentagonCrusherTurret2Snowdread']
			},
			...addPentanoughtAuraRing(true),
		],
	}
	Class.luminanceSnowdread = { // Size increase + big aura
	    PARENT: ["genericPentanought"],
	    LABEL: "Luminance",
		SIZE: 1.4,
		BODY: sizeBuffBodyStats[1],
	    TURRETS: [
			{
				POSITION: [20, 0, 0, 0, 0, 1],
				TYPE: ["pentagonBaseDeco"],
			}, {
				POSITION: [12, 0, 0, 0, 0, 1],
				TYPE: ['pentagonCrusherTurret3Snowdread']
			}, {
				POSITION: [9, 0, 0, 0, 360, 1],
				TYPE: "pentanoughtBigAura",
			},
		],
	}
	Class.foundrySnowdread = { // Size increase + big heal aura
	    PARENT: ["genericPentanought"],
	    LABEL: "Foundry",
		SIZE: 1.4,
		BODY: sizeBuffBodyStats[1],
	    TURRETS: [
			{
				POSITION: [20, 0, 0, 0, 0, 1],
				TYPE: ["pentagonBaseDeco"],
			}, {
				POSITION: [12, 0, 0, 0, 0, 1],
				TYPE: ['pentagonCrusherTurret3Snowdread']
			}, {
				POSITION: [9.5, 0, 0, 0, 360, 1],
				TYPE: "pentanoughtBigHealAura",
			},
		],
	}
	Class.planetoidSnowdread = { // Size increase + big auto
	    PARENT: ["genericPentanought"],
	    LABEL: "Planetoid",
		SIZE: 1.4,
		BODY: sizeBuffBodyStats[1],
	    TURRETS: [
			{
				POSITION: [20, 0, 0, 0, 0, 1],
				TYPE: ["pentagonBaseDeco"],
			}, {
				POSITION: [12, 0, 0, 0, 0, 1],
				TYPE: ['pentagonCrusherTurret3Snowdread']
			}, {
				POSITION: [11.5, 0, 0, 0, 360, 1],
				TYPE: "megabyteTurretSnowdread",
			},
		],
	}
	Class.pentagonFinchTurretSnowdread = {
		PARENT: ["genericPentanought"],
		MIRROR_MASTER_ANGLE: true,
		COLOR: 9,
		TURRETS: [
			{
				POSITION: [15.5, 0, 0, 0, 0, 1],
				TYPE: ['pentagon', {MIRROR_MASTER_ANGLE: true, COLOR: {BASE: -1, BRIGHTNESS_SHIFT: 7.5}}]
			}
		]
	}
	Class.hexagonFinchTurretSnowdread = {
		PARENT: ["genericHexnought"],
		MIRROR_MASTER_ANGLE: true,
		COLOR: 9,
		TURRETS: [
			{
				POSITION: [16.5, 0, 0, 30, 0, 1],
				TYPE: ['hexagon', {MIRROR_MASTER_ANGLE: true, COLOR: {BASE: -1, BRIGHTNESS_SHIFT: 7.5}}]
			}
		]
	}
	Class.finchSnowdread = { // Size decrease
	    PARENT: ["genericPentanought"],
	    LABEL: "Finch",
		SIZE: 0.65,
		BODY: {
			HEALTH: 0.5,
			SPEED: 1.3,
			ACCELERATION: 1.6,
		},
	    TURRETS: [
			{
				POSITION: [13, 0, 0, 0, 0, 1],
				TYPE: ['pentagonFinchTurretSnowdread']
			}, {
				POSITION: [20, 0, 0, 0, 0, 1],
				TYPE: ["pentagonBaseDeco"],
			},
		],
	}
	Class.pentagonHoarderTurretSnowdread = {
		PARENT: 'genericTank',
		CONTROLLERS: [["spin", {speed: -0.035}]],
		INDEPENDENT: true,
		LABEL: "",
		COLOR: {BASE: -1, BRIGHTNESS_SHIFT: 5},
		GUNS: [],
		TURRETS: [
			{
				POSITION: [17, 0, 0, 0, 0, 1],
				TYPE: ['egg', {COLOR: -1}]
			}, {
				POSITION: [10, 0, 0, 0, 0, 1],
				TYPE: ['egg', {COLOR: {BASE: 17, BRIGHTNESS_SHIFT: 10}}]
			},
		]
	};
	Class.hexagonHoarderTurretSnowdread = {
		PARENT: 'genericTank',
		CONTROLLERS: [["spin", {speed: -0.035}]],
		INDEPENDENT: true,
		LABEL: "",
		COLOR: {BASE: -1, BRIGHTNESS_SHIFT: 5},
		GUNS: [],
		TURRETS: [
			{
				POSITION: [17, 0, 0, 0, 0, 1],
				TYPE: ['egg', {COLOR: -1}]
			}, {
				POSITION: [10, 0, 0, 0, 0, 1],
				TYPE: ['egg', {COLOR: {BASE: 17, BRIGHTNESS_SHIFT: 10}}]
			},
		]
	};
	for(let i = 0; i < 5; i++) {
		Class.pentagonHoarderTurretSnowdread.GUNS.push(
			{ 
				POSITION: [15, 5.5, -2.5, 0, 0, 72*i, 0],
				PROPERTIES: {COLOR: {BASE: 17, BRIGHTNESS_SHIFT: 7.5}},
			},
		)
	}
	for(let i = 0; i < 6; i++) {
		Class.hexagonHoarderTurretSnowdread.GUNS.push(
			{ 
				POSITION: [16, 5, -2.5, 0, 0, 60*i, 0],
				PROPERTIES: {COLOR: {BASE: 17, BRIGHTNESS_SHIFT: 7.5}},
			},
		)
	}
    Class.hoarderSnowdread = { // Minelayer
	    PARENT: ["genericPentanought"],
	    LABEL: "Hoarder",
	    GUNS: [
			{
				POSITION: [0, 14, 1, 0, 0, 0, 0],
				PROPERTIES: {
					MAX_CHILDREN: 5,
					SHOOT_SETTINGS: combineStats([g.trap, g.block, g.construct, {recoil: 0, maxSpeed: 1e-3, speed: 1e-3}]),
					TYPE: 'unsetPillbox',
					INDEPENDENT: true,
					SYNCS_SKILLS: true,
					DESTROY_OLDEST_CHILD: true,
				}
			},
		],
	    TURRETS: [
			{
				POSITION: [14, 0, 0, 180, 0, 1],
				TYPE: ["pentagon", {MIRROR_MASTER_ANGLE: true, COLOR: {BASE: -1, BRIGHTNESS_SHIFT: 7.5}}],
			}, {
				POSITION: [20, 0, 0, 0, 0, 1],
				TYPE: ["pentagonBaseDeco"],
			}, {
				POSITION: [10, 0, 0, 0, 360, 1],
				TYPE: ['pentagonHoarderTurretSnowdread']
			}
		],
	}
	Class.trackerRadarSnowdread = {
		PARENT: 'genericTank',
		CONTROLLERS: [['spin', {speed: 0.02}]],
		INDEPENDENT: true,
		SHAPE: [[0.16, 1], [0.16, -1], [-0.16, -1], [-0.16, 1]],
		COLOR: 17,
		GUNS: [
			{
				POSITION: [6.2, 17, 1, -3.1, 0, 0, 0],
				PROPERTIES: {COLOR: {BASE: -1, BRIGHTNESS_SHIFT: -7.5, SATURATION_SHIFT: 0.65}}
			}, {
				POSITION: [3.2, 26, 1, -1.6, 0, 0, 0],
				PROPERTIES: {COLOR: {BASE: -1, BRIGHTNESS_SHIFT: 2.5}}
			}
		]
	};
    Class.trackerSnowdread = { // FOV
	    PARENT: ["genericPentanought"],
	    LABEL: "Tracker",
		BODY: {
			FOV: 1.4,
			SPEED: 0.85
		},
	    TURRETS: [
			{
				POSITION: [14, 0, 0, 180, 0, 1],
				TYPE: ["pentagon", {MIRROR_MASTER_ANGLE: true, COLOR: {BASE: -1, BRIGHTNESS_SHIFT: 7.5}}],
			}, {
				POSITION: [20, 0, 0, 0, 0, 1],
				TYPE: ["pentagonBaseDeco"],
			}, {
				POSITION: [11, 0, 0, 180, 0, 1],
				TYPE: ["egg", {COLOR: {BASE: 17, BRIGHTNESS_SHIFT: 5}, MIRROR_MASTER_ANGLE: true}],
			}, {
				POSITION: [7.5, 0, 0, 180, 0, 1],
				TYPE: ["egg", {COLOR: -1, MIRROR_MASTER_ANGLE: true}],
			}, {
				POSITION: [15.5, 0, 0, 0, 360, 1],
				TYPE: 'trackerRadarSnowdread'
			},
		],
	}

	if (Class.menu_addons && Class.menu_addons.UPGRADES_TIER_0) Class.menu_addons.UPGRADES_TIER_0.push("dreadSnowdread");
		Class.dreadSnowdread.UPGRADES_TIER_0 = [
			["sword2Snowdread", "dreadBodySnowdread",],
			["pacifier2Snowdread", "dreadBodySnowdread"],
			["peacekeeper2Snowdread", "dreadBodySnowdread"],
			["invader2Snowdread", "dreadBodySnowdread"],
			["centaur2Snowdread", "dreadBodySnowdread"],
		];

		Class.sword2Snowdread.UPGRADES_TIER_0 = ["swordSnowdread"];
		Class.pacifier2Snowdread.UPGRADES_TIER_0 = ["pacifierSnowdread"];
		Class.peacekeeper2Snowdread.UPGRADES_TIER_0 = ["peacekeeperSnowdread"];
		Class.invader2Snowdread.UPGRADES_TIER_0 = ["invaderSnowdread"];
		Class.centaur2Snowdread.UPGRADES_TIER_0 = ["centaurSnowdread"];

		Class.dreadWeaponSnowdread.UPGRADES_TIER_0 = ["swordSnowdread", "pacifierSnowdread", "peacekeeperSnowdread", "invaderSnowdread", "centaurSnowdread"];

			Class.swordSnowdread.UPGRADES_TIER_0 = ["gladiusSnowdread", "sabreSnowdread", "slingSnowdread", "catapultSnowdread", "dartSnowdread"];
				Class.gladiusSnowdread.UPGRADES_TIER_0 = ["bladeSnowdread"];
					Class.bladeSnowdread.UPGRADES_TIER_0 = ["rapierSnowdread"];
						Class.rapierSnowdread.UPGRADES_TIER_0 = [];
				Class.sabreSnowdread.UPGRADES_TIER_0 = ["bayonetSnowdread"];
					Class.bayonetSnowdread.UPGRADES_TIER_0 = ["javelinSnowdread"];
						Class.javelinSnowdread.UPGRADES_TIER_0 = [];
				Class.slingSnowdread.UPGRADES_TIER_0 = ["atlatlSnowdread"];
					Class.atlatlSnowdread.UPGRADES_TIER_0 = ["woomeraSnowdread"];
						Class.woomeraSnowdread.UPGRADES_TIER_0 = [];
				Class.catapultSnowdread.UPGRADES_TIER_0 = ["ballistaSnowdread"];
					Class.ballistaSnowdread.UPGRADES_TIER_0 = ["trebuchetSnowdread"];
						Class.trebuchetSnowdread.UPGRADES_TIER_0 = [];
				Class.dartSnowdread.UPGRADES_TIER_0 = ["barbSnowdread"];
					Class.barbSnowdread.UPGRADES_TIER_0 = ["boltSnowdread"];
						Class.boltSnowdread.UPGRADES_TIER_0 = [];

			Class.pacifierSnowdread.UPGRADES_TIER_0 = ["mediatorSnowdread", "negotiatorSnowdread", "melderSnowdread", "crackerSnowdread", "grabberSnowdread"];
				Class.mediatorSnowdread.UPGRADES_TIER_0 = ["mitigatorSnowdread"];
					Class.mitigatorSnowdread.UPGRADES_TIER_0 = ["diplomatSnowdread"];
						Class.diplomatSnowdread.UPGRADES_TIER_0 = [];
				Class.negotiatorSnowdread.UPGRADES_TIER_0 = ["appeaserSnowdread"];
					Class.appeaserSnowdread.UPGRADES_TIER_0 = ["arbitratorSnowdread"];
						Class.arbitratorSnowdread.UPGRADES_TIER_0 = [];
				Class.melderSnowdread.UPGRADES_TIER_0 = ["amalgamSnowdread"];
					Class.amalgamSnowdread.UPGRADES_TIER_0 = ["dissolverSnowdread"];
						Class.dissolverSnowdread.UPGRADES_TIER_0 = [];
				Class.crackerSnowdread.UPGRADES_TIER_0 = ["breakerSnowdread"];
					Class.breakerSnowdread.UPGRADES_TIER_0 = ["eroderSnowdread"];
						Class.eroderSnowdread.UPGRADES_TIER_0 = [];
				Class.grabberSnowdread.UPGRADES_TIER_0 = ["clasperSnowdread"];
					Class.clasperSnowdread.UPGRADES_TIER_0 = ["gripperSnowdread"];
						Class.gripperSnowdread.UPGRADES_TIER_0 = [];

			Class.peacekeeperSnowdread.UPGRADES_TIER_0 = ["enforcerSnowdread", "executorSnowdread", "doserSnowdread", "swirlSnowdread", "pelterSnowdread"];
				Class.enforcerSnowdread.UPGRADES_TIER_0 = ["suppressorSnowdread"];
					Class.suppressorSnowdread.UPGRADES_TIER_0 = ["retardantSnowdread"];
						Class.retardantSnowdread.UPGRADES_TIER_0 = [];
				Class.executorSnowdread.UPGRADES_TIER_0 = ["inhibitorSnowdread"];
					Class.inhibitorSnowdread.UPGRADES_TIER_0 = ["tyrantSnowdread"];
						Class.tyrantSnowdread.UPGRADES_TIER_0 = [];
				Class.doserSnowdread.UPGRADES_TIER_0 = ["tranquilizerSnowdread"];
					Class.tranquilizerSnowdread.UPGRADES_TIER_0 = ["anesthesiologistSnowdread"];
						Class.anesthesiologistSnowdread.UPGRADES_TIER_0 = [];
				Class.swirlSnowdread.UPGRADES_TIER_0 = ["spiralSnowdread"];
					Class.spiralSnowdread.UPGRADES_TIER_0 = ["helixSnowdread"];
						Class.helixSnowdread.UPGRADES_TIER_0 = [];
				Class.pelterSnowdread.UPGRADES_TIER_0 = ["shellerSnowdread"];
					Class.shellerSnowdread.UPGRADES_TIER_0 = ["bombardmentSnowdread"];
						Class.bombardmentSnowdread.UPGRADES_TIER_0 = [];

			Class.invaderSnowdread.UPGRADES_TIER_0 = ["inquisitorSnowdread", "assailantSnowdread", "radiationSnowdread", "boxerSnowdread", "disablerSnowdread"];
				Class.inquisitorSnowdread.UPGRADES_TIER_0 = ["infiltratorSnowdread"];
					Class.infiltratorSnowdread.UPGRADES_TIER_0 = ["raiderSnowdread"];
						Class.raiderSnowdread.UPGRADES_TIER_0 = [];
				Class.assailantSnowdread.UPGRADES_TIER_0 = ["aggressorSnowdread"];
					Class.aggressorSnowdread.UPGRADES_TIER_0 = ["gladiatorSnowdread"];
						Class.gladiatorSnowdread.UPGRADES_TIER_0 = [];
				Class.radiationSnowdread.UPGRADES_TIER_0 = ["haloSnowdread"];
					Class.haloSnowdread.UPGRADES_TIER_0 = ["starlightSnowdread"];
						Class.starlightSnowdread.UPGRADES_TIER_0 = [];
				Class.boxerSnowdread.UPGRADES_TIER_0 = ["sluggerSnowdread"];
					Class.sluggerSnowdread.UPGRADES_TIER_0 = ["bruiserSnowdread"];
						Class.bruiserSnowdread.UPGRADES_TIER_0 = [];
				Class.disablerSnowdread.UPGRADES_TIER_0 = ["debilitatorSnowdread"];
					Class.debilitatorSnowdread.UPGRADES_TIER_0 = ["incapacitatorSnowdread"];
						Class.incapacitatorSnowdread.UPGRADES_TIER_0 = [];

			Class.centaurSnowdread.UPGRADES_TIER_0 = ["daemonSnowdread", "minotaurSnowdread", "cleanerSnowdread", "shadeSnowdread", "screwdriverSnowdread"];
				Class.daemonSnowdread.UPGRADES_TIER_0 = ["hydraSnowdread"];
					Class.hydraSnowdread.UPGRADES_TIER_0 = ["cerberusSnowdread"];
						Class.cerberusSnowdread.UPGRADES_TIER_0 = [];
				Class.minotaurSnowdread.UPGRADES_TIER_0 = ["beelzebubSnowdread"];
					Class.beelzebubSnowdread.UPGRADES_TIER_0 = ["luciferSnowdread"];
						Class.luciferSnowdread.UPGRADES_TIER_0 = [];
				Class.cleanerSnowdread.UPGRADES_TIER_0 = ["sweeperSnowdread"];
					Class.sweeperSnowdread.UPGRADES_TIER_0 = ["sterilizerSnowdread"];
						Class.sterilizerSnowdread.UPGRADES_TIER_0 = [];
				Class.shadeSnowdread.UPGRADES_TIER_0 = ["aegisSnowdread"];
					Class.aegisSnowdread.UPGRADES_TIER_0 = ["hielamanSnowdread"];
						Class.hielamanSnowdread.UPGRADES_TIER_0 = [];
				Class.screwdriverSnowdread.UPGRADES_TIER_0 = ["drillSnowdread"];
					Class.drillSnowdread.UPGRADES_TIER_0 = ["jackhammerSnowdread"];
						Class.jackhammerSnowdread.UPGRADES_TIER_0 = [];

		Class.dreadBodySnowdread.UPGRADES_TIER_0 = ["byteSnowdread", "showerSnowdread", "atmosphereSnowdread", "juggernautSnowdread", "stomperSnowdread", "dropperSnowdread", "spotterSnowdread"];

			Class.byteSnowdread.UPGRADES_TIER_0 = ["automationSnowdread", "kilobyteSnowdread", "lighterSnowdread"];

				Class.automationSnowdread.UPGRADES_TIER_0 = ["mechanismSnowdread", "fusionSnowdread", "binarySnowdread", "exosphereSnowdread", "burgSnowdread", "batonSnowdread"];
					Class.mechanismSnowdread.UPGRADES_TIER_0 = ["skynetSnowdread"];
						Class.skynetSnowdread.UPGRADES_TIER_0 = [makeHexnoughtBodyV2("skynetSnowdread")];
					Class.fusionSnowdread.UPGRADES_TIER_0 = ["supernovaSnowdread"];
						Class.supernovaSnowdread.UPGRADES_TIER_0 = [makeHexnoughtBodyV2("supernovaSnowdread")];
					Class.binarySnowdread.UPGRADES_TIER_0 = ["cipherSnowdread"];
						Class.cipherSnowdread.UPGRADES_TIER_0 = [makeHexnoughtBodyV2("cipherSnowdread")];
					Class.exosphereSnowdread.UPGRADES_TIER_0 = ["interstellarSnowdread"];
						Class.interstellarSnowdread.UPGRADES_TIER_0 = [makeHexnoughtBodyV2("interstellarSnowdread")];
					Class.burgSnowdread.UPGRADES_TIER_0 = ["bunkerSnowdread"];
						Class.bunkerSnowdread.UPGRADES_TIER_0 = [makeHexnoughtBodyV2("bunkerSnowdread")];
					Class.batonSnowdread.UPGRADES_TIER_0 = ["maceSnowdread"];
						Class.maceSnowdread.UPGRADES_TIER_0 = [makeHexnoughtBodyV2("maceSnowdread")];

				Class.kilobyteSnowdread.UPGRADES_TIER_0 = ["megabyteSnowdread", "binarySnowdread", "trojanSnowdread", "hardwareSnowdread", "siloSnowdread", "fireworkSnowdread"];
					Class.megabyteSnowdread.UPGRADES_TIER_0 = ["gigabyteSnowdread"];
						Class.gigabyteSnowdread.UPGRADES_TIER_0 = [makeHexnoughtBodyV2("gigabyteSnowdread")];
					// Class.binarySnowdread.UPGRADES_TIER_0 = ["cipherSnowdread"];
					Class.trojanSnowdread.UPGRADES_TIER_0 = ["malwareSnowdread"];
						Class.malwareSnowdread.UPGRADES_TIER_0 = [makeHexnoughtBodyV2("malwareSnowdread")];
					Class.hardwareSnowdread.UPGRADES_TIER_0 = ["softwareSnowdread"];
						Class.softwareSnowdread.UPGRADES_TIER_0 = [makeHexnoughtBodyV2("softwareSnowdread")];
					Class.siloSnowdread.UPGRADES_TIER_0 = ["arsenalSnowdread"];
						Class.arsenalSnowdread.UPGRADES_TIER_0 = [makeHexnoughtBodyV2("arsenalSnowdread")];
					Class.fireworkSnowdread.UPGRADES_TIER_0 = ["missileSnowdread"];
						Class.missileSnowdread.UPGRADES_TIER_0 = [makeHexnoughtBodyV2("missileSnowdread")];
					
				Class.lighterSnowdread.UPGRADES_TIER_0 = ["burnerSnowdread"];
					Class.burnerSnowdread.UPGRADES_TIER_0 = ["roasterSnowdread"];
						Class.roasterSnowdread.UPGRADES_TIER_0 = [makeHexnoughtBodyV2("roasterSnowdread")];

			Class.showerSnowdread.UPGRADES_TIER_0 = ["stormSnowdread"];
				Class.stormSnowdread.UPGRADES_TIER_0 = ["tempestSnowdread"];
					Class.tempestSnowdread.UPGRADES_TIER_0 = ["monsoonSnowdread"];
						Class.monsoonSnowdread.UPGRADES_TIER_0 = [makeHexnoughtBodyV2("monsoonSnowdread")];

			Class.atmosphereSnowdread.UPGRADES_TIER_0 = ["coronaSnowdread", "thermosphereSnowdread"];

				Class.coronaSnowdread.UPGRADES_TIER_0 = ["chromosphereSnowdread", "fusionSnowdread", "trojanSnowdread", "planetSnowdread", "sirenSnowdread", "towerSnowdread"];
					Class.chromosphereSnowdread.UPGRADES_TIER_0 = ["photosphereSnowdread"];
						Class.photosphereSnowdread.UPGRADES_TIER_0 = [makeHexnoughtBodyV2("photosphereSnowdread")];
					// Class.fusionSnowdread.UPGRADES_TIER_0 = ["supernovaSnowdread"];
					// Class.trojanSnowdread.UPGRADES_TIER_0 = ["malwareSnowdread"];
					Class.planetSnowdread.UPGRADES_TIER_0 = ["astronomicSnowdread"];
						Class.astronomicSnowdread.UPGRADES_TIER_0 = [makeHexnoughtBodyV2("astronomicSnowdread")];
					Class.sirenSnowdread.UPGRADES_TIER_0 = ["valrayvnSnowdread"];
						Class.valrayvnSnowdread.UPGRADES_TIER_0 = [makeHexnoughtBodyV2("valrayvnSnowdread")];
					Class.towerSnowdread.UPGRADES_TIER_0 = ["mountainSnowdread"];
						Class.mountainSnowdread.UPGRADES_TIER_0 = [makeHexnoughtBodyV2("mountainSnowdread")];

				Class.thermosphereSnowdread.UPGRADES_TIER_0 = ["mesosphereSnowdread", "exosphereSnowdread", "hardwareSnowdread", "moonSnowdread", "harpySnowdread", "creatureSnowdread"];
					Class.mesosphereSnowdread.UPGRADES_TIER_0 = ["stratosphereSnowdread"];
						Class.stratosphereSnowdread.UPGRADES_TIER_0 = [makeHexnoughtBodyV2("stratosphereSnowdread")];
					// Class.exosphereSnowdread.UPGRADES_TIER_0 = ["interstellarSnowdread"];
					// Class.hardwareSnowdread.UPGRADES_TIER_0 = ["softwareSnowdread"];
					Class.moonSnowdread.UPGRADES_TIER_0 = ["grandioseSnowdread"];
						Class.grandioseSnowdread.UPGRADES_TIER_0 = [makeHexnoughtBodyV2("grandioseSnowdread")];
					Class.harpySnowdread.UPGRADES_TIER_0 = ["pegasusSnowdread"];
						Class.pegasusSnowdread.UPGRADES_TIER_0 = [makeHexnoughtBodyV2("pegasusSnowdread")];
					Class.creatureSnowdread.UPGRADES_TIER_0 = ["beastSnowdread"];
						Class.beastSnowdread.UPGRADES_TIER_0 = [makeHexnoughtBodyV2("beastSnowdread")];

			Class.juggernautSnowdread.UPGRADES_TIER_0 = ["jumboSnowdread", "colossalSnowdread", "cottonSnowdread", "ironSnowdread"];

				Class.jumboSnowdread.UPGRADES_TIER_0 = ["goliathSnowdread", "planetSnowdread", "moonSnowdread", "burgSnowdread", "siloSnowdread", "armadaSnowdread"];
					Class.goliathSnowdread.UPGRADES_TIER_0 = ["behemothSnowdread"];
						Class.behemothSnowdread.UPGRADES_TIER_0 = [makeHexnoughtBodyV2("behemothSnowdread")];
					// Class.planetSnowdread.UPGRADES_TIER_0 = ["astronomicSnowdread"];
					// Class.moonSnowdread.UPGRADES_TIER_0 = ["grandioseSnowdread"];
					// Class.burgSnowdread.UPGRADES_TIER_0 = ["bunkerSnowdread"];
					// Class.siloSnowdread.UPGRADES_TIER_0 = ["arsenalSnowdread"];
					Class.armadaSnowdread.UPGRADES_TIER_0 = ["battalionSnowdread"];
						Class.battalionSnowdread.UPGRADES_TIER_0 = [makeHexnoughtBodyV2("battalionSnowdread")];

				Class.colossalSnowdread.UPGRADES_TIER_0 = ["titanSnowdread", "sirenSnowdread", "harpySnowdread", "batonSnowdread", "fireworkSnowdread", "armadaSnowdread"];
					Class.titanSnowdread.UPGRADES_TIER_0 = ["leviathanSnowdread"];
						Class.leviathanSnowdread.UPGRADES_TIER_0 = [makeHexnoughtBodyV2("leviathanSnowdread")];
					// Class.sirenSnowdread.UPGRADES_TIER_0 = ["valrayvnSnowdread"];
					// Class.harpySnowdread.UPGRADES_TIER_0 = ["pegasusSnowdread"];
					// Class.batonSnowdread.UPGRADES_TIER_0 = ["maceSnowdread"];
					// Class.fireworkSnowdread.UPGRADES_TIER_0 = ["missileSnowdread"];
					// Class.armadaSnowdread.UPGRADES_TIER_0 = ["battalionSnowdread"];

				Class.cottonSnowdread.UPGRADES_TIER_0 = ["featherSnowdread"];
					Class.featherSnowdread.UPGRADES_TIER_0 = ["wispSnowdread"];
						Class.wispSnowdread.UPGRADES_TIER_0 = [makeHexnoughtBodyV2("wispSnowdread")];

				Class.ironSnowdread.UPGRADES_TIER_0 = ["steelSnowdread"];
					Class.steelSnowdread.UPGRADES_TIER_0 = ["titaniumSnowdread"];
						Class.titaniumSnowdread.UPGRADES_TIER_0 = [makeHexnoughtBodyV2("titaniumSnowdread")];
			
			Class.stomperSnowdread.UPGRADES_TIER_0 = ["rollerSnowdread", "owlSnowdread"];

				Class.rollerSnowdread.UPGRADES_TIER_0 = ["flattenerSnowdread", "towerSnowdread", "creatureSnowdread", "spotlightSnowdread", "furnaceSnowdread", "asteroidSnowdread"];
					Class.flattenerSnowdread.UPGRADES_TIER_0 = ["crusherSnowdread"];
						Class.crusherSnowdread.UPGRADES_TIER_0 = [makeHexnoughtBodyV2("crusherSnowdread")];
					// Class.towerSnowdread.UPGRADES_TIER_0 = ["mountainSnowdread"];
					// Class.creatureSnowdread.UPGRADES_TIER_0 = ["beastSnowdread"];
					Class.spotlightSnowdread.UPGRADES_TIER_0 = ["luminanceSnowdread"];
						Class.luminanceSnowdread.UPGRADES_TIER_0 = [makeHexnoughtBodyV2("luminanceSnowdread")];
					Class.furnaceSnowdread.UPGRADES_TIER_0 = ["foundrySnowdread"];
						Class.foundrySnowdread.UPGRADES_TIER_0 = [makeHexnoughtBodyV2("foundrySnowdread")];
					Class.asteroidSnowdread.UPGRADES_TIER_0 = ["planetoidSnowdread"];
						Class.planetoidSnowdread.UPGRADES_TIER_0 = [makeHexnoughtBodyV2("planetoidSnowdread")];

				Class.owlSnowdread.UPGRADES_TIER_0 = ["cardinalSnowdread"];
					Class.cardinalSnowdread.UPGRADES_TIER_0 = ["finchSnowdread"];
						Class.finchSnowdread.UPGRADES_TIER_0 = [makeHexnoughtBodyV2("finchSnowdread")];

			Class.dropperSnowdread.UPGRADES_TIER_0 = ["baiterSnowdread"];
				Class.baiterSnowdread.UPGRADES_TIER_0 = ["cagerSnowdread"];
					Class.cagerSnowdread.UPGRADES_TIER_0 = ["hoarderSnowdread"];
						Class.hoarderSnowdread.UPGRADES_TIER_0 = [makeHexnoughtBodyV2("hoarderSnowdread")];

			Class.spotterSnowdread.UPGRADES_TIER_0 = ["spySnowdread"];
				Class.spySnowdread.UPGRADES_TIER_0 = ["monitorSnowdread"];
					Class.monitorSnowdread.UPGRADES_TIER_0 = ["trackerSnowdread"];
						Class.trackerSnowdread.UPGRADES_TIER_0 = [makeHexnoughtBodyV2("trackerSnowdread")];

	const hexDreadNames = {
		Javelin: {
			Javelin: 'Javelin',
			Rapier: 'Lance',
			Woomera: 'Shikari',
			Trebuchet: 'Ballista',
			Bolt: 'Tomahawk',
			Diplomat: 'Envoy',
			Arbitrator: 'Cutlass',
			Dissolver: 'Hellfire',
			Eroder: 'Partisan',
			Gripper: 'Encircler',
			Retardant: 'Rebel',
			Tyrant: 'Autocrat',
			Anesthesiologist: 'Patriot',
			Helix: 'Stinger',
			Bombardment: 'Downpour',
			Raider: 'Pirate',
			Gladiator: 'Pillager',
			Starlight: 'Hornet',
			Bruiser: 'Felon',
			Incapacitator: 'Stretcher',
			Cerberus: 'Argonaut',
			Lucifer: 'Kitsune',
			Sterilizer: 'Mastermind',
			Hielaman: 'Swordsman', 
			Jackhammer: 'Fissure',
		},
		Rapier: {
			Rapier: 'Rapier',
			Woomera: 'Cavalier',
			Trebuchet: 'Katana',
			Bolt: 'Claymore',
			Diplomat: 'Emissary',
			Arbitrator: 'Umpire',
			Dissolver: 'Relocator',
			Eroder: 'Debris',
			Gripper: 'Interrogator',
			Retardant: 'Impeder',
			Tyrant: 'Oppressor',
			Anesthesiologist: 'Slumberer',
			Helix: 'Vortex',
			Bombardment: 'Butcher',
			Raider: 'Bandit',
			Gladiator: 'Injurer',
			Starlight: 'Radiance',
			Bruiser: 'Ringster',
			Incapacitator: 'Swamper',
			Cerberus: 'Cyclops',
			Lucifer: 'Damocles',
			Sterilizer: 'Sanitizer',
			Hielaman: 'Escutcheon', 
			Jackhammer: 'Borer',
		},
		Woomera: {
			Woomera: 'Woomera',
			Trebuchet: 'Cannonball',
			Bolt: 'Piercer', // Soap
			Diplomat: 'Contractor',
			Arbitrator: 'Spirit',
			Dissolver: 'Venom',
			Eroder: 'Decomposer',
			Gripper: 'Crucifier',
			Retardant: 'Overrunner',
			Tyrant: 'Revolutionary',
			Anesthesiologist: 'Guerilla',
			Helix: 'Cultivator',
			Bombardment: 'Incendiary',
			Raider: 'Dispatcher', // Soap
			Gladiator: 'Pugilist',
			Starlight: 'Starborne',
			Bruiser: 'Soldier',
			Incapacitator: 'Scavenger', // Soap
			Cerberus: 'Poltergeist',
			Lucifer: 'Hunkerer',
			Sterilizer: 'Janitor',
			Hielaman: 'Reinforcer', 
			Jackhammer: 'Pyroclastic',
		},
		Trebuchet: {
			Trebuchet: 'Trebuchet',
			Bolt: 'Archer',
			Diplomat: 'Sherman',
			Arbitrator: 'Ultimatum',
			Dissolver: 'Grapeshot',
			Eroder: 'Shrapnel',
			Gripper: 'Razer',
			Retardant: 'Mangonel',
			Tyrant: 'Incarcerator', // Zenphia
			Anesthesiologist: 'Evacuator',
			Helix: 'Hurricane',
			Bombardment: 'Surrenderer',
			Raider: 'Capitulator',
			Gladiator: 'Uprising',
			Starlight: 'Magnetar',
			Bruiser: 'Crumpler',
			Incapacitator: 'Pinner',
			Cerberus: 'Phantom', // Umbra
			Lucifer: 'Sisyphus',
			Sterilizer: 'Operation',
			Hielaman: 'Entrencher', 
			Jackhammer: 'Demolitionist',
		},
		Bolt: {
			Bolt: 'Bolt',
			Diplomat: 'Informant',
			Arbitrator: 'Assaulter',
			Dissolver: 'Sprinter',
			Eroder: 'Discharger', // Soap
			Gripper: 'Lightning',
			Retardant: 'Evicter',
			Tyrant: 'Minister',
			Anesthesiologist: 'Ambusher',
			Helix: 'Ultraviolet',
			Bombardment: 'Dynamo',
			Raider: 'Infector',
			Gladiator: 'Blinder',
			Starlight: 'Neutrino',
			Bruiser: 'Impactor',
			Incapacitator: 'Volt',
			Cerberus: 'Collapse',
			Lucifer: 'Barycenter',
			Sterilizer: 'Greenhouse',
			Hielaman: 'Nebula', 
			Jackhammer: 'Archaeologist',
		},
		Diplomat: {
			Diplomat: 'Diplomat',
			Arbitrator: 'Moderator',
			Dissolver: 'Impaler', // Soap
			Eroder: 'Vulcan',
			Gripper: 'Politician',
			Retardant: 'Insurgent',
			Tyrant: 'Dictator',
			Anesthesiologist: 'Transporter',
			Helix: 'Signature',
			Bombardment: 'Berserker', // Soap
			Raider: 'Marauder',
			Gladiator: 'Champion',
			Starlight: 'Comet',
			Bruiser: 'Ambassador',
			Incapacitator: 'Erebus', // Yharon
			Cerberus: 'Orion',
			Lucifer: 'Manticore',
			Sterilizer: 'Officer',
			Hielaman: 'Investigator', 
			Jackhammer: 'Devourer', // Soap
		},
		Arbitrator: {
			Arbitrator: 'Arbitrator',
			Dissolver: 'Bargainer',
			Eroder: 'Stipulator',
			Gripper: 'Adjudicator',
			Retardant: 'Extinguisher',
			Tyrant: 'Shogun',
			Anesthesiologist: 'Brute',
			Helix: 'Referee',
			Bombardment: 'Jury',
			Raider: 'Buccaneer',
			Gladiator: 'Warrior',
			Starlight: 'Genesis', // Siece
			Bruiser: 'Terminator', // Soap
			Incapacitator: 'Debater',
			Cerberus: 'Gorgon',
			Lucifer: 'Keres',
			Sterilizer: 'Warden',
			Hielaman: 'Crusader', 
			Jackhammer: 'Excavator',
		},
		Dissolver: {
			Dissolver: 'Dissolver',
			Eroder: 'Current',
			Gripper: 'Patronizer',
			Retardant: 'Corroder',
			Tyrant: 'Throne',
			Anesthesiologist: 'Neurotoxin',
			Helix: 'Solution',
			Bombardment: 'Chlorine',
			Raider: 'Traitor',
			Gladiator: 'Abolitionist',
			Starlight: 'Accretion',
			Bruiser: 'Piranha',
			Incapacitator: 'Sandstorm',
			Cerberus: 'Appalachian',
			Lucifer: 'Styx',
			Sterilizer: 'Peroxide',
			Hielaman: 'Frontier', 
			Jackhammer: 'Fracker',
		},
		Eroder: {
			Eroder: 'Eroder',
			Gripper: 'Psychologist',
			Retardant: 'Shatterer',
			Tyrant: 'Crackdown',
			Anesthesiologist: 'Torrent',
			Helix: 'Tornado',
			Bombardment: 'Backstabber',
			Raider: 'Militant', // Umbra
			Gladiator: 'Vitrifier',
			Starlight: 'Stardust',
			Bruiser: 'Gasher', // Soap
			Incapacitator: 'Lacerator', // Soap
			Cerberus: 'Inevitability',
			Lucifer: 'Fragment',
			Sterilizer: 'Cynic',
			Hielaman: 'Polisher', 
			Jackhammer: 'Hoser',
		},
		Gripper: {
			Gripper: 'Gripper',
			Retardant: 'Arrestor',
			Tyrant: 'Tormentor', // Soap
			Anesthesiologist: 'Experimenter',
			Helix: 'Blockader',
			Bombardment: 'Striker',
			Raider: 'Warmongerer', // Umbra
			Gladiator: 'Throwdown',
			Starlight: 'Cryogen',
			Bruiser: 'Knockout',
			Incapacitator: 'Restrainer',
			Cerberus: 'Prometheus',
			Lucifer: 'Mortician',
			Sterilizer: 'Cleanser',
			Hielaman: 'Periscope', 
			Jackhammer: 'Vice',
		},
		Retardant: {
			Retardant: 'Retardant',
			Tyrant: 'Anarchist',
			Anesthesiologist: 'Buckshot', // Soap
			Helix: 'Magnetron',
			Bombardment: 'Sergeant',
			Raider: 'Freebooter',
			Gladiator: 'Combatant',
			Starlight: 'Apparition',
			Bruiser: 'Executioner', // Soap
			Incapacitator: 'Smotherer',
			Cerberus: 'Gigantes',
			Lucifer: 'Demogorgon',
			Sterilizer: 'Fumigator',
			Hielaman: 'Avalanche', 
			Jackhammer: 'Propagator',
		},
		Tyrant: {
			Tyrant: 'Tyrant',
			Anesthesiologist: 'Barbarian',
			Helix: 'Nautilus',
			Bombardment: 'Admiral',
			Raider: 'Corsair',
			Gladiator: 'Amazon',
			Starlight: 'Theocrat',
			Bruiser: 'Authoritarian',
			Incapacitator: 'Jailkeeper',
			Cerberus: 'Ouroboros',
			Lucifer: 'Raiju',
			Sterilizer: 'Purifier',
			Hielaman: 'Protectorate', 
			Jackhammer: 'Detailer',
		},
		Anesthesiologist: {
			Anesthesiologist: 'Anesthesiologist',
			Helix: 'Blizzard',
			Bombardment: 'Nightmare',
			Raider: 'Vaccinator',
			Gladiator: 'Harbinger', // Siece
			Starlight: 'Hypnotizer',
			Bruiser: 'Tactician',
			Incapacitator: 'Psychic', // Soap
			Cerberus: 'Revenant',
			Lucifer: 'Rehabilitator',
			Sterilizer: 'Pestilence',
			Hielaman: 'Heater', 
			Jackhammer: 'Sledgehammer',
		},
		Helix: {
			Helix: 'Helix',
			Bombardment: 'Derecho',
			Raider: 'Deliverer',
			Gladiator: 'Constrictor',
			Starlight: 'Orbit',
			Bruiser: 'Cobra',
			Incapacitator: 'Windfall',
			Cerberus: 'Viper',
			Lucifer: 'Taipan',
			Sterilizer: 'Networker',
			Hielaman: 'Turbine', 
			Jackhammer: 'Spindler',
		},
		Bombardment: {
			Bombardment: 'Bombardment',
			Raider: 'Specialist',
			Gladiator: 'Leonidas',
			Starlight: 'Meteor',
			Bruiser: 'Grenadier',
			Incapacitator: 'Shellshocker',
			Cerberus: 'Deluge',
			Lucifer: 'Containment',
			Sterilizer: 'Haven',
			Hielaman: 'Ballistic', 
			Jackhammer: 'Mallet', // Soap
		},
		Raider: {
			Raider: 'Raider',
			Gladiator: 'Filibuster',
			Starlight: 'Colonizer',
			Bruiser: 'Plunderer', // Umbra
			Incapacitator: 'Blitzkrieg',
			Cerberus: 'Wyvern',
			Lucifer: 'Kraken',
			Sterilizer: 'Splatterer',
			Hielaman: 'Strategist', 
			Jackhammer: 'Extractor',
		},
		Gladiator: {
			Gladiator: 'Gladiator',
			Starlight: 'Enveloper',
			Bruiser: 'Fistfighter',
			Incapacitator: 'Overloader', // Umbra
			Cerberus: 'Ogre',
			Lucifer: 'Wendigo',
			Sterilizer: 'Garrison', // Umbra
			Hielaman: 'Uziel', // Zenphia
			Jackhammer: 'Warlord',
		},
		Starlight: {
			Starlight: 'Starlight',
			Bruiser: 'Wanderer',
			Incapacitator: 'Starstruck',
			Cerberus: 'Constellation',
			Lucifer: 'Galaxy',
			Sterilizer: 'Evaporator',
			Hielaman: 'Protostar', 
			Jackhammer: 'Luminance',
		},
		Bruiser: {
			Bruiser: 'Bruiser',
			Incapacitator: 'Mauler',
			Cerberus: 'Serpent',
			Lucifer: 'Trident',
			Sterilizer: 'Suture',
			Hielaman: 'Heavyweight', 
			Jackhammer: 'Stapler',
		},
		Incapacitator: {
			Incapacitator: 'Incapacitator',
			Cerberus: 'Opportunist',
			Lucifer: 'Condemner',
			Sterilizer: 'Poisoner',
			Hielaman: 'Eyrie', 
			Jackhammer: 'Thrasher', // Soap
		},
		Cerberus: {
			Cerberus: 'Cerberus',
			Lucifer: 'Oni',
			Sterilizer: 'Antibody',
			Hielaman: 'Typhon', 
			Jackhammer: 'Paver',
		},
		Lucifer: {
			Lucifer: 'Lucifer',
			Sterilizer: 'Lipid',
			Hielaman: 'Insulator', 
			Jackhammer: 'Earthquaker',
		},
		Sterilizer: {
			Sterilizer: 'Sterilizer',
			Hielaman: 'Homeland', 
			Jackhammer: 'Bulldozer',
		},
		Hielaman: {
			Hielaman: 'Hielaman', 
			Jackhammer: 'Compactor',
		},
		Jackhammer: {
			Jackhammer: 'Jackhammer',
		},
	};

	function mergeHexnoughtWeaponV2(weapon1, weapon2) {
		weapon1 = ensureIsClass(Class, weapon1);
		weapon2 = ensureIsClass(Class, weapon2);

		let PARENT = Class.genericHexnought,
			BODY = JSON.parse(JSON.stringify(PARENT.BODY)),
			GUNS = [],
			gunsOnOneSide = [],
			weapon2GunsOnOneSide = [],
			TURRETS = [],
			turretsOnOneSide = [],
			weapon2TurretsOnOneSide = [],
			CONTROLLERS = weapon2.CONTROLLERS;

		// Label
		let name1 = hexDreadNames[weapon1.LABEL][weapon2.LABEL],
			name2 = hexDreadNames[weapon2.LABEL][weapon1.LABEL],
			weaponName = weapon1.LABEL + weapon2.LABEL,
			orientationId = 0;
		if (name1) {
			weaponName = name1;
		} else if (name2) {
			weaponName = name2,
			orientationId = 1;
		}
		let LABEL = weaponName,
			className = weapon1.LABEL.toLowerCase() + weapon2.LABEL + orientationId + "Snowdread";
		
		// Guns ----------------------
		if (weapon1.GUNS) gunsOnOneSide.push(...JSON.parse(JSON.stringify(weapon1.GUNS.slice(0, weapon1.GUNS.length / 5))));
		if (weapon2.GUNS) weapon2GunsOnOneSide = JSON.parse(JSON.stringify(weapon2.GUNS.slice(0, weapon2.GUNS.length / 5)));

		for (let g in weapon2GunsOnOneSide) weapon2GunsOnOneSide[g].POSITION[5] += 60;
		gunsOnOneSide.push(...weapon2GunsOnOneSide)

		// Turrets -------------------
		if (weapon1.TURRETS) turretsOnOneSide.push(...JSON.parse(JSON.stringify(weapon1.TURRETS.slice(0, weapon1.TURRETS.length / 5))));
		if (weapon2.TURRETS) weapon2TurretsOnOneSide = JSON.parse(JSON.stringify(weapon2.TURRETS.slice(0, weapon2.TURRETS.length / 5)));

		for (let t in weapon2TurretsOnOneSide) weapon2TurretsOnOneSide[t].POSITION[3] += 60;
		turretsOnOneSide.push(...weapon2TurretsOnOneSide)

		// Scale to fit size constraints
		for (let g in gunsOnOneSide) {
			gunsOnOneSide[g].POSITION[1] *= hexnoughtScaleFactor ** 2;
			gunsOnOneSide[g].POSITION[4] *= hexnoughtScaleFactor ** 2;
		}

		for (let t in turretsOnOneSide) {
			turretsOnOneSide[t].POSITION[0] *= hexnoughtScaleFactor ** 2;
		}

		for (let i = 0; i < 3; i++) {
			for (let g in gunsOnOneSide) {
				let gun = JSON.parse(JSON.stringify(gunsOnOneSide[g]));
				gun.POSITION[5] += 120 * i;
				GUNS.push(gun);
			}
			for (let t in turretsOnOneSide) {
				let turret = JSON.parse(JSON.stringify(turretsOnOneSide[t]));
				turret.POSITION[3] += 120 * i;
				TURRETS.push(turret);
			}
		};

		// Gladiator
		if (weapon1.LABEL == "Gladiator" || weapon2.LABEL == "Gladiator") {
			let droneSpawnerIndex = 0
			for (let g in GUNS) {
				let gun = GUNS[g];
				if (gun.PROPERTIES && gun.PROPERTIES.TYPE == "gladiatorTritankMinionSnowdread") {
					switch (droneSpawnerIndex) {
						case 1:
							gun.PROPERTIES.TYPE = "gladiatorTritrapMinionSnowdread";
							break;
						case 2:
							gun.PROPERTIES.TYPE = "gladiatorTriswarmMinionSnowdread";
							break;
						case 3:
							gun.PROPERTIES.TYPE = "gladiatorAutoMinionSnowdread";
							break;
						case 4:
							gun.PROPERTIES.TYPE = "gladiatorAuraMinionSnowdread";
							break;
						case 5:
							gun.PROPERTIES.TYPE = "gladiatorHealAuraMinionSnowdread";
							break;
					}
					droneSpawnerIndex++;
				}
			}
		}
		
		// Body stat modification
		if (weapon1.BODY) for (let m in weapon1.BODY) BODY[m] *= weapon1.BODY[m];
		if (weapon2.BODY) for (let m in weapon2.BODY) BODY[m] *= weapon2.BODY[m];

		// Smash it together
		Class[className] = {
			PARENT, BODY, LABEL, GUNS, TURRETS, CONTROLLERS
		};
		return className;
	}

	function makeHexnoughtBodyV2(body) {
		if (!buildHexnoughts) return;
		
		body = ensureIsClass(Class, body);

		let PARENT = Class.genericHexnought,
			SIZE = body.SIZE ?? 1,
			BODY = {},
			GUNS = body.GUNS ?? [],
			TURRETS = [],
			LABEL = body.LABEL;

		// Label
		let className = LABEL.toLowerCase() + "HexSnowdread";
		
		// Turrets --------------------
		let turretRingLoopLength = Math.floor(body.TURRETS.length / 5);
  
    	// Turret adding
		for (let t = 0; t < body.TURRETS.length; t++) {
			let turret = body.TURRETS[t];
			if (turret.TYPE[0].indexOf('pentagon') >= 0) { // Replace pentagons with hexagons
				TURRETS.push(
					{
						POSITION: [turret.POSITION[0], 0, 0, turret.POSITION[3], turret.POSITION[4], turret.POSITION[5]],
						TYPE: ['hexagon' + turret.TYPE[0].substring(8), turret.TYPE[1] ?? {}],
					}
				);
			} else if (turret.POSITION[1]) { // Do whole turret loop at once
				for (let i = 0; i < turretRingLoopLength; i++) {
					for (let j = 0; j < 6; j++) {
						turret = body.TURRETS[t + i * 5];
						TURRETS.push(
							{
								POSITION: [turret.POSITION[0] * hexnoughtScaleFactor, turret.POSITION[1] * hexnoughtScaleFactor ** 0.5, turret.POSITION[2], turret.POSITION[3] / 6 * 5 + 60 * j, turret.POSITION[4], turret.POSITION[5]],
								TYPE: turret.TYPE,
							}
						)
					}
				}
				t += 5 * turretRingLoopLength - 1;
			} else { // Centered turrets
				TURRETS.push(
					{
						POSITION: [turret.POSITION[0] * hexnoughtScaleFactor ** 0.5, 0, 0, turret.POSITION[3], turret.POSITION[4], turret.POSITION[5]],
						TYPE: turret.TYPE,
					}
				) 
      		}
		}
		
		// Body stat modification
		if (body.BODY) for (let m in body.BODY) BODY[m] = body.BODY[m];

		// Smash it together
		Class[className] = {
			PARENT, SIZE, BODY, LABEL, GUNS, TURRETS,
		};
		return className;
	}

	// Merge hexdreads
	const pentanoughtWeapons = [
								"rapierSnowdread",     "javelinSnowdread",     "woomeraSnowdread",           "trebuchetSnowdread",  "boltSnowdread",
								"diplomatSnowdread",   "arbitratorSnowdread",  "dissolverSnowdread",         "eroderSnowdread",     "gripperSnowdread",
								"retardantSnowdread",  "tyrantSnowdread",      "anesthesiologistSnowdread",  "helixSnowdread",      "bombardmentSnowdread",
								"raiderSnowdread",     "gladiatorSnowdread",   "starlightSnowdread",         "bruiserSnowdread",    "incapacitatorSnowdread",
								"cerberusSnowdread",   "luciferSnowdread",     "sterilizerSnowdread",        "hielamanSnowdread",   "jackhammerSnowdread",
								];
	if(buildHexnoughts) {
		for (let i of pentanoughtWeapons) {
			for (let j of pentanoughtWeapons) {
				Class[i].UPGRADES_TIER_0.push(mergeHexnoughtWeaponV2(i, j));
			}
		}
	}
};