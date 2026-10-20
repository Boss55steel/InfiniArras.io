const {combineStats, weaponArray, weaponMirror} = require('../facilitators.js')
const g = require('../gunvals.js')

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

Class.laser = {
    PARENT: "genericTank",
    LABEL: "Laser",
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

Class.triLaser = {
    PARENT: "genericTank",
    LABEL: "Tri-Laser",
    GUNS: weaponArray([
        {
            POSITION: [18, 8, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.flankGuard]),
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
    ON: makeLaserON("(body.skill.raw[0] / 13) + 1")
}

Class.particleAccelerator = {
    PARENT: "genericTank",
    LABEL: "Particle Accelerator",
    GUNS: [
        {
            POSITION: [18, 8, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pounder]),
                TYPE: 'bullet',
                IDENTIFIER: "laser",
                ALPHA: 0
            }
        },
        {
            POSITION: [27, 3, 1, 0, 0, 0, 0]
        },
        {
            POSITION: [12, 2, 0.01, 15, 11, 0, 0]
        },
        {
            POSITION: [12, 2, 0.01, 15, -11, 0, 0]
        },
        {
            POSITION: [4, 7, -1.2, 8, 0, 0, 0]
        },
        {
            POSITION: [2, 7, 3.5, 13, 0, 0, 0]
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

Class.electricRifle = {
    PARENT: "genericTank",
    LABEL: "Electric Rifle",
    GUNS: [
        ...weaponMirror([
            {
                POSITION: [9, 8, 1, 0, 20, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.twin]),
                    TYPE: 'bullet',
                    IDENTIFIER: "laser",
                    ALPHA: 0
                }
            },
            {
                POSITION: [16, 3, 1, 0, 20, 0, 0]
            },
            {
                POSITION: [10, 2, 0.01, 6, 27.5, 0, 0]
            },
            {
                POSITION: [10, 2, 0.01, 6, 12.5, 0, 0]
            },
            {
                POSITION: [4, 7, -1.2, 0, 20, 0, 0]
            },
            {
                POSITION: [2, 7, 2.5, 4, 20, 0, 0]
            }
        ]),
        {
            POSITION: [18, 8, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin]),
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
        },
        {
            POSITION: [5, 50, -0.2, -5, 0, 0, 0]
        }
    ],
    TURRETS: [
        ...weaponMirror({
            POSITION: [8, 13, 20, 0, 360, 1],
            TYPE: ["genericTank", {COLOR: "#00ffff"}]
        }),
        {
            POSITION: [10, 22, 0, 0, 360, 1],
            TYPE: ["genericTank", {COLOR: "#00ffff"}]
        }
    ],
    ON: makeLaserON("(body.skill.raw[0] / 10) + 1", "50 * (1 + (body.skill.raw[2] / 7))")
}

Class.laserBlaster = {
    PARENT: "genericTank",
    LABEL: "Laser Blaster",
    GUNS: [
        {
            POSITION: [18, 8, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, {spray: 2, shudder: 2}]),
                TYPE: 'bullet',
                IDENTIFIER: "laser",
                ALPHA: 0
            }
        },
        {
            POSITION: [18, 7.5, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, {spray: 2, shudder: 2}]),
                TYPE: 'bullet',
                IDENTIFIER: "laser",
                ALPHA: 0
            }
        },
        {
            POSITION: [18, 7, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, {spray: 2, shudder: 2}]),
                TYPE: 'bullet',
                IDENTIFIER: "laser",
                ALPHA: 0
            }
        },
        {
            POSITION: [18, 6.5, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, {spray: 2, shudder: 2}]),
                TYPE: 'bullet',
                IDENTIFIER: "laser",
                ALPHA: 0
            }
        },
        {
            POSITION: [18, 6, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, {spray: 2, shudder: 2}]),
                TYPE: 'bullet',
                IDENTIFIER: "laser",
                ALPHA: 0
            }
        },
        {
            POSITION: [18, 5.5, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, {spray: 2, shudder: 2}]),
                TYPE: 'bullet',
                IDENTIFIER: "laser",
                ALPHA: 0
            }
        },
        {
            POSITION: [28, 3, 1, 0, 0, 0, 0]
        },
        {
            POSITION: [10, 2, 0.01, 17, 9, 5, 0]
        },
        {
            POSITION: [10, 2, 0.01, 17, -9, -5, 0]
        },
        {
            POSITION: [4, 8.5, -1.2, 9, 0, 0, 0]
        },
        {
            POSITION: [2, 8.5, 2.6, 13, 0, 0, 0]
        }
    ],
    TURRETS: [
        {
            POSITION: [15, 25, 0, 0, 360, 1],
            TYPE: ["hexagon", {COLOR: "#00ffff", FACING_TYPE: "spin"}]
        }
    ],
    ON: makeLaserON("(body.skill.raw[0] / 20) + 0.2", "100 * (1 + (body.skill.raw[2] / 15))")
}

Class.sniper.UPGRADES_TIER_1 = ["laser"]
Class.laser.UPGRADES_TIER_2 = ["triLaser", "particleAccelerator", "electricRifle", "laserBlaster"]
Class.menu_addons.UPGRADES_TIER_0.push("laser")