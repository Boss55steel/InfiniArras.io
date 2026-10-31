// ═══════════════════════════════════════════════════════════════════════════
//  TANK SHARE CODES  —  OSA addon
//  File: server/addons/shareCodes.js
//
//  $savecode  $loadcode <CODE>  $deletecode <CODE>  $listcodes
//
//  SAVE STRATEGY (three layers, merged together):
//   1. Full class definition from Classes[classKey] — serialised with
//      deepSerialize so every object-reference TYPE is resolved to a string.
//      This is the definitive source for bosses: GUNS, TURRETS, BODY, SKILL,
//      CONTROLLERS, FACING_TYPE, SHAPE, COLOR, SIZE, PARENT, all of it.
//   2. body.GUNS override — if the player has more/different guns than the
//      class (e.g. $addgun was used) we save those instead.
//   3. best-available TURRETS override — tries body.TURRETS, body.turrets,
//      body.defs.TURRETS in that order; if any has data we save it.
//
//  LOAD STRATEGY:
//   1. define(classKey) if the original class still exists — correct shape,
//      pre-registered mockups, SVG polygon.
//      OR define(tempKey) from the saved classDef if classKey is gone.
//   2. define({ GUNS, TURRETS }) to overlay the exact saved live state.
//   3. setupTurrets() + refreshBodyAttributes() to force entity spawn.
// ═══════════════════════════════════════════════════════════════════════════
"use strict";

const fs   = require("fs");
const path = require("path");

// ── Storage ───────────────────────────────────────────────────────────────────
const CODES_FILE = path.join(process.cwd(), "tank_codes.json");
function readCodes() {
    if (!fs.existsSync(CODES_FILE)) return {};
    try { return JSON.parse(fs.readFileSync(CODES_FILE, "utf8")); } catch { return {}; }
}
function writeCodes(o) { fs.writeFileSync(CODES_FILE, JSON.stringify(o, null, 2)); }
function makeCode(existing) {
    const c = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let code;
    do { code = Array.from({length:6}, () => c[Math.floor(Math.random()*c.length)]).join(""); }
    while (existing[code]);
    return code;
}

// ── Reverse-lookup: Class object → key string ─────────────────────────────────
function buildReverseMap(Classes) {
    const m = new Map();
    for (const [k, v] of Object.entries(Classes))
        if (v && typeof v === "object") m.set(v, k);
    return m;
}

// ── Deep serialiser ───────────────────────────────────────────────────────────
// Walks any value recursively and returns a JSON-safe clone.
// • Registered Class object references → their key string
// • Functions → undefined (dropped from output)
// • Circular refs → null
function deepSerialize(val, rev, seen) {
    if (val === null || val === undefined) return val;
    if (typeof val === "function")  return undefined;
    if (typeof val === "string")    return val;
    if (typeof val === "boolean")   return val;
    if (typeof val === "number")    return isFinite(val) ? val : 0;
    if (typeof val === "object") {
        // Registered Class object? → return its key
        const key = rev.get(val);
        if (key) return key;
        if (seen.has(val)) return null;
        seen.add(val);
        let r;
        if (Array.isArray(val)) {
            r = [];
            for (const x of val) { const s = deepSerialize(x, rev, seen); if (s !== undefined) r.push(s); }
        } else {
            r = {};
            for (const [k, v2] of Object.entries(val)) {
                const s = deepSerialize(v2, rev, seen);
                if (s !== undefined) r[k] = s;
            }
        }
        seen.delete(val);
        return r;
    }
    return val;
}

// Serialise a complete class definition — skip ON (function event handlers only).
function serializeClassDef(def, rev) {
    if (!def || typeof def !== "object") return null;
    const out = {};
    for (const [k, v] of Object.entries(def)) {
        if (k === "ON") continue;
        const s = deepSerialize(v, rev, new Set());
        if (s !== undefined) out[k] = s;
    }
    return out;
}

// ── Find classKey for a live body ─────────────────────────────────────────────
function findClassKey(body, Classes) {
    // 1. body.class string property
    if (typeof body.class === "string" && Classes[body.class]) return body.class;

    // 2. body.type is the actual Class object reference
    if (body.type && typeof body.type === "object") {
        const k = Object.keys(Classes).find(k => Classes[k] === body.type);
        if (k) return k;
    }

    // 3. LABEL match (exact, then case-insensitive)
    if (body.label) {
        // Exact match
        const exact = Object.keys(Classes).filter(k =>
            Classes[k] && typeof Classes[k] === "object" && Classes[k].LABEL === body.label
        );
        if (exact.length === 1) return exact[0];
        if (exact.length > 1) {
            // Break tie with gun count
            const gl = body.GUNS?.length ?? 0;
            let best = exact[0], bs = -Infinity;
            for (const k of exact) { const s = (Classes[k].GUNS?.length??0)===gl?1:0; if(s>bs){bs=s;best=k;} }
            return best;
        }
        // Case-insensitive fallback
        const lo = body.label.toLowerCase();
        const icase = Object.keys(Classes).filter(k =>
            Classes[k] && typeof Classes[k] === "object" &&
            typeof Classes[k].LABEL === "string" &&
            Classes[k].LABEL.toLowerCase() === lo
        );
        if (icase.length >= 1) return icase[0];
    }

    // 4. body.defs is the class object itself
    if (body.defs && typeof body.defs === "object") {
        const k = Object.keys(Classes).find(k => Classes[k] === body.defs);
        if (k) return k;
    }

    return null;
}

// ─────────────────────────────────────────────────────────────────────────────
//  GUN SERIALISATION
// ─────────────────────────────────────────────────────────────────────────────
const DEF_SS = {reload:1,recoil:0,shudder:0.1,size:1,health:1,damage:1,pen:1,speed:1,maxSpeed:1,range:1,density:1};
const GUN_FLAGS = ["AUTOFIRE","COLOR","ALPHA","LABEL","STAT_CALCULATOR","SYNCS_SKILLS","WAIT_UNTIL_NONE_EXIST","MAX_CHILDREN","INDEPENDENT_CHILDREN","ALT_FIRE","SHOOT_ON_DEATH","IDENTIFIER","HAS_NO_RECOIL"];

function serializeGunArray(arr, rev) {
    if (!Array.isArray(arr) || arr.length === 0) return null;
    const out = [];
    for (const g of arr) {
        if (!g) continue;
        const pos = g.POSITION ?? g.def?.POSITION;
        if (!Array.isArray(pos)) continue;
        const entry = { POSITION: deepSerialize(pos, rev, new Set()) };
        const props = g.PROPERTIES ?? g.def?.PROPERTIES;
        if (props) {
            const src = Array.isArray(props.SHOOT_SETTINGS)
                ? (props.SHOOT_SETTINGS[0]||{})
                : (props.SHOOT_SETTINGS && typeof props.SHOOT_SETTINGS==="object" ? props.SHOOT_SETTINGS : {});
            entry.PROPERTIES = {
                SHOOT_SETTINGS: { ...DEF_SS, ...deepSerialize(src, rev, new Set()) },
                TYPE: deepSerialize(props.TYPE, rev, new Set()) ?? "bullet",
            };
            for (const f of GUN_FLAGS)
                if (props[f] !== undefined)
                    entry.PROPERTIES[f] = deepSerialize(props[f], rev, new Set());
        }
        out.push(entry);
    }
    return out.length > 0 ? out : null;
}

// ─────────────────────────────────────────────────────────────────────────────
//  TURRET SERIALISATION
// ─────────────────────────────────────────────────────────────────────────────
function serializeTurretArray(arr, rev) {
    if (!Array.isArray(arr) || arr.length === 0) return null;
    const out = [];
    for (const t of arr) {
        if (!t || t.isGhost || t.isDead) continue;
        const def = t.def || t;
        const pos = def.POSITION ?? t.POSITION;
        if (!Array.isArray(pos)) continue;
        const rawType = def.TYPE ?? t.TYPE ?? t.shape;
        out.push({
            POSITION: [...pos],
            TYPE: deepSerialize(rawType, rev, new Set()) ?? "autoTurret",
        });
    }
    return out.length > 0 ? out : null;
}

// ─────────────────────────────────────────────────────────────────────────────
//  PICK BEST GUN SOURCE
//  Class definition is authoritative. Live body overrides only if it has
//  MORE guns (i.e. $addgun was used) or if the class has no guns.
// ─────────────────────────────────────────────────────────────────────────────
function pickGuns(body, classDef, rev) {
    const classGuns   = serializeGunArray(classDef?.GUNS, rev);
    const bodyGuns    = serializeGunArray(body.GUNS, rev);
    const defsGuns    = serializeGunArray(body.defs?.GUNS, rev);
    const liveGuns    = serializeGunArray(body.guns, rev);  // lowercase live entities

    const classLen = classGuns?.length ?? 0;
    const bodyLen  = bodyGuns?.length  ?? 0;

    console.log(`[ShareCodes]   GUNS  class:${classLen}  body.GUNS:${bodyGuns?.length??0}  defs:${defsGuns?.length??0}  live:${liveGuns?.length??0}`);

    // Use class guns unless body has more (user added guns) or class has none
    if (bodyGuns && bodyLen > classLen)  { console.log("[ShareCodes]   → body.GUNS (more than class)");   return bodyGuns; }
    if (classGuns)                        { console.log("[ShareCodes]   → class GUNS (authoritative)");    return classGuns; }
    if (bodyGuns)                         { console.log("[ShareCodes]   → body.GUNS (class fallback)");    return bodyGuns; }
    if (defsGuns)                         { console.log("[ShareCodes]   → defs.GUNS");                     return defsGuns; }
    if (liveGuns)                         { console.log("[ShareCodes]   → live body.guns");                return liveGuns; }

    console.log("[ShareCodes]   → no guns found");
    return [];
}

// ─────────────────────────────────────────────────────────────────────────────
//  PICK BEST TURRET SOURCE
//  Same logic: class is authoritative, body overrides if it has more.
// ─────────────────────────────────────────────────────────────────────────────
function pickTurrets(body, classDef, rev) {
    const classTurrets = serializeTurretArray(classDef?.TURRETS, rev);
    const bodyTurrets  = serializeTurretArray(body.TURRETS, rev);      // uppercase definition
    const liveTurrets  = serializeTurretArray(body.turrets, rev);      // lowercase live entities
    const defsTurrets  = serializeTurretArray(body.defs?.TURRETS, rev);

    const classLen = classTurrets?.length ?? 0;
    const bodyLen  = bodyTurrets?.length  ?? 0;
    const liveLen  = liveTurrets?.length  ?? 0;

    console.log(`[ShareCodes]   TURRETS  class:${classLen}  body.TURRETS:${bodyLen}  body.turrets:${liveLen}  defs:${defsTurrets?.length??0}`);

    // More turrets on body than in class = user added extras, use body
    if (bodyTurrets && bodyLen  > classLen)  { console.log("[ShareCodes]   → body.TURRETS (more than class)");  return bodyTurrets; }
    if (liveTurrets && liveLen  > classLen)  { console.log("[ShareCodes]   → body.turrets (more than class)");  return liveTurrets; }
    if (classTurrets)                         { console.log("[ShareCodes]   → class TURRETS (authoritative)");   return classTurrets; }
    if (bodyTurrets)                          { console.log("[ShareCodes]   → body.TURRETS (class fallback)");   return bodyTurrets; }
    if (liveTurrets)                          { console.log("[ShareCodes]   → body.turrets (live fallback)");    return liveTurrets; }
    if (defsTurrets)                          { console.log("[ShareCodes]   → defs.TURRETS");                    return defsTurrets; }

    console.log("[ShareCodes]   → no turrets found");
    return [];
}

// ═════════════════════════════════════════════════════════════════════════════
//  COMMANDS
// ═════════════════════════════════════════════════════════════════════════════

function cmdSavecode({ socket }) {
    try {
        const player = socket.player;
        const body   = player?.body;
        if (!body) return socket.talk("m", 3_000, "❌ You need a tank to save!");

        const Classes  = global.Class || {};
        const rev      = buildReverseMap(Classes);
        const classKey = findClassKey(body, Classes);
        const classDef = classKey ? Classes[classKey] : null;

        console.log(`\n[ShareCodes] ════ SAVE  player="${player.name}"  label="${body.label}"  classKey=${classKey??"NOT FOUND"} ════`);

        // Serialise the FULL class definition — this is the complete snapshot
        // of BODY, SKILL, CONTROLLERS, FACING_TYPE, SHAPE, COLOR, PARENT etc.
        const serializedDef = serializeClassDef(classDef, rev);
        if (serializedDef) {
            console.log(`[ShareCodes]   classDef serialized: keys=[${Object.keys(serializedDef).join(",")}]`);
        } else {
            console.log("[ShareCodes]   classDef: NOT FOUND — will save guns/turrets only");
        }

        // Pick best guns and turrets
        const guns    = pickGuns(body, classDef, rev);
        const turrets = pickTurrets(body, classDef, rev);

        if (!serializedDef && guns.length === 0 && turrets.length === 0) {
            console.warn("[ShareCodes] SAVE ABORTED — nothing to save");
            return socket.talk("m", 6_000,
                `⚠️  Nothing to save for "${body.label}". ` +
                "Check the server console. Use $define <classname> first."
            );
        }

        const entry = {
            savedBy:  player.name || "Unknown",
            savedAt:  new Date().toISOString(),
            classKey: classKey ?? null,
            classDef: serializedDef ?? null,
            GUNS:     guns,
            TURRETS:  turrets,
            LABEL:    classDef?.LABEL || body.label || "Custom",
        };

        const existing = readCodes();
        const code = makeCode(existing);
        existing[code] = entry;
        writeCodes(existing);

        console.log(`[ShareCodes] ════ SAVED  code=${code}  guns=${guns.length}  turrets=${turrets.length} ════\n`);
        socket.talk("m", 14_000,
            `✅ Code: ${code}  |  "${entry.LABEL}"${classKey?` (${classKey})`:""}` +
            `  guns:${guns.length}  turrets:${turrets.length}  |  $loadcode ${code}`
        );

    } catch (err) {
        console.error("[ShareCodes] SAVECODE ERROR:", err);
        socket.talk("m", 3_000, "❌ Save failed — check the server console.");
    }
}

function cmdLoadcode({ socket, args }) {
    try {
        const body = socket.player?.body;
        if (!body) return socket.talk("m", 3_000, "❌ Spawn in first!");

        const code  = (args[0]||"").toUpperCase().trim();
        if (!code)  return socket.talk("m", 3_000, "Usage: $loadcode <CODE>");

        const all   = readCodes();
        const entry = all[code];
        if (!entry) return socket.talk("m", 4_000, `❌ Code "${code}" not found.`);

        const Classes = global.Class || {};
        console.log(`\n[ShareCodes] ════ LOAD  code=${code}  player="${socket.player.name}" ════`);

        // Step 1 — apply class (shape / BODY / SKILL / CONTROLLERS)
        if (entry.classKey && Classes[entry.classKey]) {
            body.define(entry.classKey);
            console.log(`[ShareCodes]   step1: define("${entry.classKey}") — original class`);
        } else if (entry.classDef) {
            const tempKey = `shareCode_${code}`;
            Classes[tempKey] = entry.classDef;
            body.define(tempKey);
            console.log(`[ShareCodes]   step1: define("${tempKey}") — from saved classDef`);
        } else {
            return socket.talk("m", 5_000,
                `❌ Class "${entry.classKey}" is gone and no saved definition exists for this code.`
            );
        }

        // Step 2 — overlay exact guns + turrets from the snapshot
        body.define({
            GUNS:    entry.GUNS    || [],
            TURRETS: entry.TURRETS || [],
        });
        console.log(`[ShareCodes]   step2: overlaid ${(entry.GUNS||[]).length} guns, ${(entry.TURRETS||[]).length} turrets`);

        // Force turret entities to spawn
        if (typeof body.setupTurrets          === "function") body.setupTurrets();
        if (typeof body.refreshBodyAttributes === "function") body.refreshBodyAttributes();
        console.log(`[ShareCodes] ════ LOAD COMPLETE ════\n`);

        const when = entry.savedAt ? new Date(entry.savedAt).toLocaleString() : "?";
        socket.talk("m", 10_000,
            `🎉 Loaded: "${entry.LABEL}"  guns:${(entry.GUNS||[]).length}  turrets:${(entry.TURRETS||[]).length}  |  by ${entry.savedBy||"?"} on ${when}`
        );

    } catch (err) {
        console.error("[ShareCodes] LOADCODE ERROR:", err);
        if (socket.talk) socket.talk("m", 3_000, "❌ Load failed — check the server console.");
    }
}

function cmdDeletecode({ socket, args }) {
    try {
        const isAdmin = (socket.permissions?.level ?? 0) >= 3;
        const code    = (args[0]||"").toUpperCase().trim();
        if (!code) return socket.talk("m", 3_000, "Usage: $deletecode <CODE>");
        const all = readCodes(), entry = all[code];
        if (!entry) return socket.talk("m", 3_000, `❌ Code "${code}" not found.`);
        const name = socket.player?.name || "Unknown";
        if (!isAdmin && entry.savedBy !== name)
            return socket.talk("m", 4_000, "❌ You can only delete your own codes.");
        delete all[code]; writeCodes(all);
        socket.talk("m", 5_000, `🗑️  Deleted "${code}" ("${entry.LABEL}").`);
    } catch (err) {
        console.error("[ShareCodes] DELETECODE ERROR:", err);
        socket.talk("m", 3_000, "❌ Delete failed.");
    }
}

function cmdListcodes({ socket }) {
    try {
        const all = readCodes(); const keys = Object.keys(all);
        if (keys.length === 0) { console.log("[ShareCodes] No codes."); return socket.talk("m", 3_000, "No codes saved yet."); }
        const Classes = global.Class || {};
        const BAR = "─".repeat(72);
        console.log(`\n${BAR}\n  TANK SHARE CODES\n${BAR}`);
        for (const code of keys) {
            const d = all[code], at = d.savedAt ? new Date(d.savedAt).toLocaleString() : "?";
            const ck = d.classKey ? (Classes[d.classKey] ? d.classKey : `${d.classKey}(MISSING)`) : "(custom)";
            console.log(`  [${code}]  "${d.LABEL}"  ${ck}  def:${d.classDef?"✓":"✗"}  guns:${d.GUNS?.length??"?"}  turrets:${d.TURRETS?.length??"?"}  by:${d.savedBy||"?"}  at:${at}`);
        }
        console.log(`${BAR}\n`);
        socket.talk("m", 6_000, `📋 ${keys.length} code(s) — see server console.`);
    } catch (err) {
        console.error("[ShareCodes] LISTCODES ERROR:", err); socket.talk("m", 3_000, "❌ Error."); }
}

// ═════════════════════════════════════════════════════════════════════════════
//  EXPORT
// ═════════════════════════════════════════════════════════════════════════════
module.exports = ({ Config, Class, Events }) => {
    if (typeof global.addChatCommand !== "function") {
        console.error("[ShareCodes] ❌ global.addChatCommand not found."); return;
    }
    const cmds = [
        { command:["savecode"],   description:"Snapshot your exact live tank.",             level:2, run:cmdSavecode   },
        { command:["loadcode"],   description:"Restore snapshot. Usage: $loadcode <CODE>",  level:2, run:cmdLoadcode   },
        { command:["deletecode"], description:"Delete a code. Usage: $deletecode <CODE>",   level:2, run:cmdDeletecode },
        { command:["listcodes"],  description:"List all saved codes in server console.",     level:3, run:cmdListcodes  },
    ];
    let ok = 0;
    for (const cmd of cmds) {
        try { global.addChatCommand(cmd); ok++; }
        catch (e) { console.warn(`[ShareCodes] Skipped $${cmd.command[0]}: ${e.message}`); }
    }
    console.log(`[ShareCodes] ✅ ${ok}/${cmds.length} registered: ` + cmds.map(c=>`$${c.command[0]}`).join(", "));
};