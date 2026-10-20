// ═══════════════════════════════════════════════════════════════════════════
//  RandomAddon2.js  —  OSA entity addon
//  File location: server/entityaddons/RandomAddon2.js
//
//  Defines: absolutechaos + 8 helper turret classes
//  (basicsturret, annisturret, pentasturret, oversturret, octosturret,
//   rangersturret, machinesturret, mothersturret)
//
//  FIXES vs original:
//   • exports.X → Class.X inside module.exports = ({Class}) => {}
//   • All turret POSITION arrays had only 5 elements — added the required
//     6th element (layer / z-index, value 1) so turrets actually spawn.
//   • TYPE: ["className"] single-element arrays kept as-is (OSA handles them).
// ═══════════════════════════════════════════════════════════════════════════
"use strict";

const { combineStats } = require('../facilitators.js');
const { base } = require('../constants.js');
const g = require('../gunvals.js');

module.exports = ({ Class }) => {

    // ── Helper turret classes ──────────────────────────────────────────────
    // Each wraps an existing tank class and overrides CONTROLLERS so it
    // behaves as a turret (tracks target, no recoil, not independent).

    Class.basicsturret = {
        PARENT: ["genericTank"],
        CONTROLLERS: ["mapTargetToGoal"],
        HAS_NO_RECOIL: true,
        GUNS: [{
            POSITION: [18, 8, 1, 0, 0, 0, 0],
            PROPERTIES: { SHOOT_SETTINGS: combineStats([g.basic]), TYPE: "bullet" },
        }],
        DANGER:      0,
        INDEPENDENT: false,
    };

    Class.annisturret = {
        PARENT:        ["annihilator"],
        CONTROLLERS:   ["mapTargetToGoal"],
        HAS_NO_RECOIL: true,
        DANGER:        0,
        INDEPENDENT:   false,
    };

    Class.pentasturret = {
        PARENT:        ["pentaShot"],
        CONTROLLERS:   ["mapTargetToGoal"],
        HAS_NO_RECOIL: true,
        DANGER:        0,
        INDEPENDENT:   false,
    };

    Class.oversturret = {
        PARENT:        ["overlord"],
        CONTROLLERS:   ["mapTargetToGoal"],
        HAS_NO_RECOIL: true,
        DANGER:        0,
        INDEPENDENT:   false,
    };

    Class.octosturret = {
        PARENT:        ["octoTank"],
        CONTROLLERS:   ["spin"],
        HAS_NO_RECOIL: true,
        DANGER:        0,
        INDEPENDENT:   false,
    };

    Class.rangersturret = {
        PARENT:        ["ranger"],
        CONTROLLERS:   ["mapTargetToGoal"],
        HAS_NO_RECOIL: true,
        DANGER:        0,
        INDEPENDENT:   false,
    };

    Class.machinesturret = {
        PARENT:        ["machineGunner"],
        CONTROLLERS:   ["mapTargetToGoal"],
        HAS_NO_RECOIL: true,
        DANGER:        0,
        INDEPENDENT:   false,
    };

    Class.mothersturret = {
        PARENT:        ["mothership"],
        CONTROLLERS:   ["mapTargetToGoal"],
        HAS_NO_RECOIL: true,
        DANGER:        0,
        INDEPENDENT:   false,
    };

    // ── absolutechaos ──────────────────────────────────────────────────────
    // A tank with three offset layers of turrets and two massive mothership
    // turrets at the back. All turret POSITION arrays use 6 elements:
    //   [SIZE, X, Y, ANGLE, ARC, LAYER]
    // The original file only had 5 — the missing LAYER caused turrets not to spawn.

    Class.absolutechaos = {
        PARENT:        ["genericTank"],
        HAS_NO_RECOIL: true,
        LABEL:         "chaos",
        BODY:          { FOV: 3 },
        GUNS: [{
            POSITION: [18, 8, 1, 0, 0, 0, 0],
            PROPERTIES: { SHOOT_SETTINGS: combineStats([g.basic]), TYPE: "bullet" },
        }],
        TURRETS: [
            // ── MIDDLE LAYER ──
            { POSITION: [20,  0,   21, 0, 360, 1], TYPE: "basicsturret"  },
            { POSITION: [20,  0,  -21, 0, 360, 1], TYPE: "basicsturret"  },
            { POSITION: [20,  0,   42, 0, 360, 1], TYPE: "annisturret"   },
            { POSITION: [20,  0,  -42, 0, 360, 1], TYPE: "annisturret"   },
            { POSITION: [20,  0,   63, 0, 360, 1], TYPE: "basicsturret"  },
            { POSITION: [20,  0,  -63, 0, 360, 1], TYPE: "basicsturret"  },
            { POSITION: [20,  0,   84, 0, 360, 1], TYPE: "annisturret"   },
            { POSITION: [20,  0,  -84, 0, 360, 1], TYPE: "annisturret"   },
            { POSITION: [20,  0,  105, 0, 360, 1], TYPE: "basicsturret"  },
            { POSITION: [20,  0, -105, 0, 360, 1], TYPE: "basicsturret"  },
            { POSITION: [20,  0,  126, 0, 360, 1], TYPE: "pentasturret"  },
            { POSITION: [20,  0, -126, 0, 360, 1], TYPE: "pentasturret"  },
            { POSITION: [20,  0,  147, 0, 360, 1], TYPE: "oversturret"   },
            { POSITION: [20,  0, -147, 0, 360, 1], TYPE: "oversturret"   },
            { POSITION: [20,  0,  168, 0, 360, 1], TYPE: "octosturret"   },
            { POSITION: [20,  0, -168, 0, 360, 1], TYPE: "octosturret"   },
            { POSITION: [20,  0,  189, 0, 360, 1], TYPE: "rangersturret" },
            { POSITION: [20,  0, -189, 0, 360, 1], TYPE: "rangersturret" },
            // ── FRONT LAYER ──
            { POSITION: [20, 21,   21, 0, 360, 1], TYPE: "machinesturret" },
            { POSITION: [20, 21,  -21, 0, 360, 1], TYPE: "machinesturret" },
            { POSITION: [20, 21,   42, 0, 360, 1], TYPE: "machinesturret" },
            { POSITION: [20, 21,  -42, 0, 360, 1], TYPE: "machinesturret" },
            { POSITION: [20, 21,   63, 0, 360, 1], TYPE: "machinesturret" },
            { POSITION: [20, 21,  -63, 0, 360, 1], TYPE: "machinesturret" },
            { POSITION: [20, 21,   84, 0, 360, 1], TYPE: "machinesturret" },
            { POSITION: [20, 21,  -84, 0, 360, 1], TYPE: "machinesturret" },
            { POSITION: [20, 21,  105, 0, 360, 1], TYPE: "machinesturret" },
            { POSITION: [20, 21, -105, 0, 360, 1], TYPE: "machinesturret" },
            { POSITION: [20, 21,  126, 0, 360, 1], TYPE: "machinesturret" },
            { POSITION: [20, 21, -126, 0, 360, 1], TYPE: "machinesturret" },
            { POSITION: [20, 21,  147, 0, 360, 1], TYPE: "machinesturret" },
            { POSITION: [20, 21, -147, 0, 360, 1], TYPE: "machinesturret" },
            { POSITION: [20, 21,  168, 0, 360, 1], TYPE: "machinesturret" },
            { POSITION: [20, 21, -168, 0, 360, 1], TYPE: "machinesturret" },
            { POSITION: [20, 21,  189, 0, 360, 1], TYPE: "machinesturret" },
            { POSITION: [20, 21, -189, 0, 360, 1], TYPE: "machinesturret" },
            // ── BACK LAYER ──
            { POSITION: [55, -63,  84, 0, 360, 1], TYPE: "mothersturret" },
            { POSITION: [55, -63, -84, 0, 360, 1], TYPE: "mothersturret" },
        ],
    };

    console.log("[RandomAddon2] Loaded: absolutechaos + 8 turret classes.");
};