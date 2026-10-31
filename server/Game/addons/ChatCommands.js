const prefix = "$";
function _getAll() {
  return global.entities ? [...global.entities.values()] : [];
}

function _findPlayer(name) {
  const lower = name.toLowerCase();
  return _getAll().find(
    e => e && e.isPlayer && !e.isDead && e.name && e.name.toLowerCase() === lower
  );
}

function _bcast(msg, duration) {
  const socks = (global.sockets && global.sockets.players) || [];
  for (const s of socks) if (s && s.talk) s.talk("m", duration || 3000, msg);
}
let fs = require("fs");
const SAVES_FILE = "./server/game/addons/saves.js";
try { if (!fs.existsSync(SAVES_FILE)) fs.writeFileSync(SAVES_FILE, "[]"); } catch (e) { }
/** COMMANDS **/
let commands = [
  {
        command: ["help"],
        description: "Show this help menu.",
        level: 0,
        run: ({ socket, level }) => {
            let useOldMenu = false;
            let lines = [
            "Help menu:",
            ...commands.filter((c) => level >= c.level && !c.hidden).map((c) => {
                    let cmdData = [c.command];
                    let commandText = cmdData.map((e) => e.map((name) => name).join(` or ${prefix} `)).join(" ")
                    let description = c.description ?? false;
                    let text = `- ${prefix} ${commandText}`;
                    if (description) text += ` - ${description}`;
                    return text;
                }),
            ];
            if (useOldMenu) {
                for (let line of lines.reverse()) {
                    socket.talk("m", 15_000, line);
                }
            } else socket.talk("Em", 15_000, JSON.stringify(lines));
        },
    },
    {
        command: ["leaderboard", "b"],
        description: "Select the leaderboard to display.",
        level: 0,
        run: ({ socket, args }) => {
            let sendAvailableLeaderboardMessage = () => {
                let lines = [
                    "Available leaderboards:",
                    ...leaderboards.map(lb => `- ${lb}`)
                ];
                socket.talk("Em", 10_000, JSON.stringify(lines));
            };

            const leaderboards = [
                "default",
                "players",
                "bosses",
                "global",
            ];
            const choice = args[0];

            if (!choice) {
                sendAvailableLeaderboardMessage(socket);
                return;
            }

            if (leaderboards.includes(choice)) {
                socket.status.selectedLeaderboard = choice;
                socket.status.forceNewBroadcast = true;
                socket.talk("m", 4_000, "Leaderboard changed.");
            } else {
                socket.talk("m", 4_000, "Unknown leaderboard.");
            }
        }
    },
    {
        command: ["toggle", "t"],
        description: "Enable or disable chat",
        level: 0,
        run: ({ socket }) => {
            socket.status.disablechat = !socket.status.disablechat;
            socket.talk("m", 3_000, `In-game chat ${socket.status.disablechat ? "disabled" : "enabled"}.`);
        }
    },
    {
        command: ["zonecollapse", "zc"],
        description: "Zone Collapse battle royale.",
        level: 2,
        run({ socket, args }) {
            const zc = global.zoneCollapse;
            if (!zc) return socket.talk("m", 3_000, "❌ Zone Collapse addon not loaded.");
            zc.handleCommand(socket, args);
        }
    },
    {
        command: ["arena"],
        description: "Manage the arena",
        level: 1,
        hidden: true,
        run: ({ socket, args, gameManager }) => {
            let sendAvailableArenaMessage = () => {
                let lines = [
                    "Help menu:",
                    `- ${prefix} arena size dynamic - Make the size of the arena dynamic, depending on the number of players`,
                    `- ${prefix} arena size <width> <height> - Set the size of the arena`,
                    `- ${prefix} arena team <team> - Set the number of teams, from 0 (FFA) to 4 (4TDM)`,
                    `- ${prefix} arena spawnpoint [x] [y] - Set a location where all players spawn on default`,
                    `- ${prefix} arena close - Close the arena`,
                ];
                if (!Config.sandbox) lines.splice(1, 1)
                socket.talk("Em", 10_000, JSON.stringify(lines));
            }
            if (!args[0]) sendAvailableArenaMessage(); else {
                switch (args[0]) {
                    case "size":
                        if (args[1] === "dynamic") {
                            if (!Config.sandbox) return socket.talk("m", 3_000, "This command is only available on sandbox.");
                            gameManager.room.settings.sandbox.do_not_change_arena_size = false;
                        } else {
                            if (!args[1] || !args[2]) return socket.talk("m", 3_000, "Invalid arguments.");
                            if (args[1] % 2 === 0 && args[2] % 2 === 0) {
                                if (Config.sandbox) gameManager.room.settings.sandbox.do_not_change_arena_size = true;
                                gameManager.updateBounds(args[1] * 30, args[2] * 30);
                            } else {
                                socket.talk("m", 3000, "Arena size must be even.");
                            }
                        }
                        break;
                    case "team":
                        if (!args[1]) return socket.talk("m", 3_000, "Invalid argument.");
                        if (args[1] === "0") {
                            Config.mode = "ffa";
                            Config.teams = null;
                            socket.rememberedTeam = undefined;
                        } else {
                            Config.mode = "tdm";
                            Config.teams = args[1];
                            socket.rememberedTeam = undefined;
                        }
                        break;
                    case "spawnpoint":
                        if (!args[1] || !args[2]) return socket.talk("m", 3_000, "Invalid arguments.");
                        socket.talk("m", 4_000, "Spawnpoint set.");
                        global.spawnPoint = {
                            x: parseInt(args[1] * 30),
                            y: parseInt(args[2] * 30),
                        };
                        break;
                    case "close":
                        util.warn(`${socket.player.body.name === "" ? `An unnamed player (ip: ${socket.ip})` : socket.player.body.name} has closed the arena.`);
                        gameManager.closeArena();
                        break;
                    default:
                        socket.talk("m", 4_000, "Unknown subcommand.");
                }
            }
        }
    },
    {
        command: ["truebroadcast", "tbr"],
        description: "Broadcast a message to all players.",
        level: 2,
        hidden: true,
        run: ({ args, socket }) => {
            if (!args[0]) {
                socket.talk("m", 5_000, "No message specified.");
            }
            else {
                gameManager.socketManager.broadcast(args.join(" "));
            }
        }
    },
    {
        command: ["broadcast", "br"],
        description: "Broadcast a message to all players.",
        level: 0,
        run: ({ args, socket }) => {
            const COOLDOWN_TIME = 6000; 
            const now = Date.now();
            if (socket.lastBroadcastTime && (now - socket.lastBroadcastTime) < COOLDOWN_TIME) {
                const secondsLeft = Math.ceil((COOLDOWN_TIME - (now - socket.lastBroadcastTime)) / 1000);
                return socket.talk("m", 3000, `Please wait ${secondsLeft} seconds before broadcasting again!`);
            }
            if (!args[0]) {
                return socket.talk("m", 5000, "No message specified. Usage: $br [message]");
            }
            const playerName = socket.player?.body?.name || socket.player?.name || "Unnamed";
            const finalMessage = `${playerName} says,  ${args.join(" ")}`;
            
            gameManager.socketManager.broadcast(finalMessage);

            socket.lastBroadcastTime = now;
        }
    },
    {
        command: ["time", "freeze", "timestone"],
        description: "Hard-freezes all entities. Usage: $time <seconds>",
        level: 2,
        run: ({ args, socket }) => {
            try {
                const body = socket.player?.body;
                if (!body) return;

                const freezeTime = (parseFloat(args[0]) || 10) * 1000;
                const getEntities = () => global.entities || (typeof entities !== 'undefined' ? entities : []);
                const freezeLogic = (instance) => ({
                    get: () => ({
                        speed: 0,
                        acceleration: 0,
                        goal: { x: 0, y: 0 },
                        think: () => {
                            if (instance.velocity) {
                                instance.velocity.x = 0;
                                instance.velocity.y = 0;
                            }
                        }
                    })
                });

                getEntities().forEach(e => {
                    if (!e || e === body || e.isWall || e.isGhost) return;

                    if (e.velocity) { e.velocity.x = 0; e.velocity.y = 0; }
                    
                    if (Array.isArray(e.controllers)) {
                        e.isFrozen = true;
                        e.controllers.unshift(freezeLogic(e).get());
                    }
                });

                socket.talk("m", 3000, `⏳ TIME FROZEN FOR ${freezeTime / 1000}s ⏳`);
                setTimeout(() => {
                    getEntities().forEach(e => {
                        if (e && e.isFrozen && Array.isArray(e.controllers)) {
                            e.controllers.shift();
                            e.isFrozen = false;
                        }
                    });
                    if (socket.talk) socket.talk("m", 3000, "Time resumes...");
                }, freezeTime);

            } catch (err) {
                console.error("FREEZE ERROR:", err);
            }
        }
    },
    {
        command: ["random", "randomize"],
        description: "Turns you (or everyone) into a completely randomly generated tank! Usage: $random [playername | all]",
        level: 2,
        run: ({ args, socket }) => {
            try {
                const targetName = args.length > 0 ? args.join(" ").toLowerCase() : null;
                let allEntities = global.entities || [];
                let targets = [];
                if (targetName === "all") {
                    targets = allEntities.filter(e => e && e.isPlayer && !e.isDead);
                } else if (targetName) {
                    let found = allEntities.find(e => e && e.isPlayer && !e.isDead && e.name && e.name.toLowerCase() === targetName);
                    if (found) targets.push(found);
                    else return socket.talk("m", 3000, `Player '${targetName}' not found!`);
                } else {
                    if (socket.player?.body) targets.push(socket.player.body);
                    else return socket.talk("m", 3000, "You need a tank!");
                }

                targets.forEach(targetBody => {
                    const randomId = "RNG_" + Math.random().toString(36).substring(2, 9).toUpperCase();
                    
                    const numGuns = Math.floor(Math.random() * 12) + 1; // 1 to 12 guns
                    const randomGuns = [];
                    for (let i = 0; i < numGuns; i++) {
                        
                        const projTypes = ["bullet", "trap", "drone", "swarm", "missile"];
                        const randomProj = projTypes[Math.floor(Math.random() * projTypes.length)];

                        randomGuns.push({
                            POSITION: [
                                Math.random() * 25 + 5,   // Length
                                Math.random() * 15 + 2,   // Width
                                Math.random() * 1.5 + 0.5, // Aspect (can be stretched now!)
                                (Math.random() - 0.5) * 20, // X Offset
                                (Math.random() - 0.5) * 20, // Y Offset
                                Math.random() * 360,      // Angle
                                Math.random()             // Firing Delay
                            ],
                            PROPERTIES: {
                                // FIXED: No longer in an array so the engine actually reads the stats!
                                SHOOT_SETTINGS: {
                                    reload: Math.random() * 1.5 + 0.2, // 0.2 to 1.7 reload
                                    recoil: Math.random() * 3,
                                    shudder: Math.random() * 0.5,
                                    size: Math.random() * 2 + 0.5,
                                    health: Math.random() * 5 + 0.5,
                                    damage: Math.random() * 5 + 0.5,
                                    pen: Math.random() * 5 + 0.5,
                                    speed: Math.random() * 3 + 0.5,
                                    maxSpeed: Math.random() * 3 + 0.5,
                                    range: Math.random() * 2 + 0.5,
                                    density: Math.random() * 3 + 0.5
                                },
                                TYPE: randomProj,
                                AUTOFIRE: Math.random() > 0.6 // 40% chance the gun shoots automatically
                            }
                        });
                    }

                    // -- Generate Random Turrets --
                    const numTurrets = Math.floor(Math.random() * 4); // 0 to 3 turrets
                    const randomTurrets = [];
                    for (let i = 0; i < numTurrets; i++) {
                        randomTurrets.push({
                            POSITION: [
                                Math.random() * 15 + 5,     // Size
                                (Math.random() - 0.5) * 20, // X Offset
                                (Math.random() - 0.5) * 20, // Y Offset
                                Math.random() * 360,        // Angle
                                360,                        // Arc
                                1                           // Z-index
                            ],
                            TYPE: "autoTurret"
                        });
                    }

                    // -- Assemble the Chimera Class --
                    global.Class[randomId] = {
                        PARENT: ["genericTank"],
                        LABEL: "RNG-" + randomId.substring(4, 8),
                        SHAPE: Math.floor(Math.random() * 13), // 0 to 12 sides
                        COLOR: Math.floor(Math.random() * 36), // Random color
                        SIZE: Math.random() * 25 + 5,          // Random tank size! (tiny to massive)
                        BODY: {
                            SPEED: Math.random() * 3 + 0.2,    // Snails pace to lightning speed
                            HEALTH: Math.random() * 10 + 0.5,
                            DAMAGE: Math.random() * 10 + 0.5,
                            PENETRATION: Math.random() * 10 + 0.5,
                            SHIELD: Math.random() * 10 + 0.5,
                            REGEN: Math.random() * 10 + 0.5,
                            FOV: Math.random() * 2 + 0.5,      // Random field of view
                            DENSITY: Math.random() * 10 + 0.5,
                            PUSHABILITY: Math.random()
                        },
                        GUNS: randomGuns,
                        TURRETS: randomTurrets
                    };

                    // -- Apply the abomination to the player --
                    targetBody.define(global.Class[randomId]);
                    
                    // Force the physical size to update live in case .define misses it
                    targetBody.size = global.Class[randomId].SIZE;
                    targetBody.coreSize = global.Class[randomId].SIZE;

                    targetBody.customDef = global.Class[randomId];
                    
                    if (typeof targetBody.setupTurrets === 'function') targetBody.setupTurrets();
                });

                // 3. Announce the chaos
                if (targetName === "all") {
                    socket.talk("m", 5000, `🎲 ROLLED THE DICE! Everyone is now a random abomination!`);
                } else if (targets.length > 0) {
                    socket.talk("m", 4000, `🎲 Turned ${targets[0].name} into a procedural nightmare!`);
                }

            } catch (err) {
                console.error("RANDOMIZER ERROR:", err);
                if (socket.talk) socket.talk("m", 3000, "Error generating random tank. Check console.");
            }
        }
    },

    {
        command: ["save"],
        description: "Save",
        level: 6,
        run: ({ socket, args }) => {
            if (socket.permissions?.level < 6) {
                socket.talk('m', Config.popup_message_duration, "You do not have the permissions to use this command!");
                return;
            }
            if (!args[0]) {
                socket.talk('m', Config.popup_message_duration, "Please input a name!");
                return;
            }
            let saves = []
            try {
                if (fs.existsSync(SAVES_FILE)) {
                    saves = JSON.parse(fs.readFileSync(SAVES_FILE));
                }
            } catch (e) {
                console.error("Error checking saves:", e);
            }
            let savedEntities = []
            for (let entity of entities.values()) {
                if (entity.type === "tank" || entity.type === "miniboss" || entity.type === "food" || entity.type === "wall" || entity.type === "portal") {
                    savedEntities.push({
                        defs: entity.defs,
                        SIZE: entity.SIZE,
                        name: entity.name,
                        skill: {score: entity.skill.score},
                        team: entity.team,
                        color: {base: entity.color.base, hueShift: entity.color.hueShift, brightnessShift: entity.color.brightnessShift, saturationShift: entity.color.saturationShift},
                        walltype: entity.walltype,
                        x: entity.x,
                        y: entity.y,
                    });
                }
            }
            saves.push(
                {
                    NAME: args[0],
                    ENTITIES: savedEntities,
                    ROOM: {width: global.gameManager.room.width, height: global.gameManager.room.height}
                }
            )
            socket.talk('m', Config.popup_message_duration, `Successfully saved ${savedEntities.length} entities!`);

            fs.writeFileSync(SAVES_FILE, JSON.stringify(saves, null, 2));
        }
    },
    {
        command: ["load"],
        description: "Load",
        level: 6,
        run: ({ socket, args }) => {
            if (socket.permissions?.level < 6) {
                socket.talk('m', Config.popup_message_duration, "You do not have the permissions to use this command!");
                return;
            }
            if (!args[0]) {
                socket.talk('m', Config.popup_message_duration, "Please input a name!");
                return;
            }
            let saves = []
            try {
                if (fs.existsSync(SAVES_FILE)) {
                    saves = JSON.parse(fs.readFileSync(SAVES_FILE));
                }
            } catch (e) {
                console.error("Error checking saves:", e);
            }
            let curSave = saves.find(obj => obj.NAME === args[0]);
            for (let i = 0; i < curSave.ENTITIES.length; i++) {
                let o = new Entity({x: curSave.ENTITIES[i].x, y: curSave.ENTITIES[i].y})
                o.define(curSave.ENTITIES[i].defs)
                o.SIZE = curSave.ENTITIES[i].SIZE
                o.name = curSave.ENTITIES[i].name
                o.skill.score = curSave.ENTITIES[i].skill.score
                o.color.base = curSave.ENTITIES[i].color.base
                o.color.hueShift = curSave.ENTITIES[i].color.hueShift
                o.color.brightnessShift = curSave.ENTITIES[i].color.brightnessShift
                o.color.saturationShift = curSave.ENTITIES[i].color.saturationShift
                o.walltype = curSave.ENTITIES[i].walltype
                o.team = curSave.ENTITIES[i].team
            }
            gameManager.updateBounds(curSave.ROOM.width, curSave.ROOM.height);
        }
    },
    {
        command: ["setclass", "forceclass"],
        description: "Changes a player's tank class. Usage: $setclass <classname> [playername]. If no name is given, changes you.",
        level: 3, // Admin only
        run: ({ args, socket }) => {
            try {
                // 1. Check if they provided a class name
                if (args.length < 1) {
                    return socket.talk("m", 3000, "Usage: $setclass <classname> [playername]");
                }

                const className = args[0]; // The tank they want to change into
                const playerName = args.length > 1 ? args.slice(1).join(" ") : null; // Joins the rest in case their name has spaces

                // 2. Check if the class actually exists in the game
                if (!global.Class[className]) {
                    return socket.talk("m", 3000, `❌ Class '${className}' does not exist!`);
                }

                let targetBody = null;

                // 3. Find the target player
                if (playerName) {
                    let allEntities = global.entities || [];
                    // Search all living players for a matching name (case-insensitive so you don't have to type perfect caps)
                    targetBody = allEntities.find(e => 
                        e && e.isPlayer && !e.isDead && 
                        e.name && e.name.toLowerCase() === playerName.toLowerCase()
                    );

                    if (!targetBody) {
                        return socket.talk("m", 3000, `❌ Player '${playerName}' not found or is dead!`);
                    }
                } else {
                    // If no name was given, target the admin who ran the command
                    targetBody = socket.player?.body;
                    if (!targetBody) {
                        return socket.talk("m", 3000, "You don't have a tank right now!");
                    }
                }

                // 4. Transform the tank!
                targetBody.define(global.Class[className]);
                
                // Refresh turrets (if the new class has them) so they don't break
                if (typeof targetBody.setupTurrets === 'function') targetBody.setupTurrets();

                // 5. Success Message
                if (playerName) {
                    socket.talk("m", 4000, `✅ You turned ${targetBody.name} into a ${className}!`);
                } else {
                    socket.talk("m", 4000, `✨ You morphed into a ${className}!`);
                }

            } catch (err) {
                console.error("SETCLASS ERROR:", err);
                if (socket.talk) socket.talk("m", 3000, "Error applying class. Check server console.");
            }
        }
    },
    {        
        command: ["kill", "k"],
        description: "Kill yourself or a specified entity. Usage: $kill [name]",
        level: 2, 
        hidden: true,
        run: ({ args, socket }) => {
            let target = socket.player?.body;
            let targetName = "yourself";

            // If arguments are provided, try to find an entity by that name
            if (args.length > 0) {
                let searchName = args.join(" ");
                let found = null;
                
                // Search through all global entities to find a matching name
                for (let entity of entities.values()) {
                    if (entity.name === searchName && !entity.isGhost) {
                        found = entity;
                        break;
                    }
                }

                if (found) {
                    target = found;
                    targetName = `'${found.name}'`;
                } else {
                    socket.talk("m", 5_000, `Could not find an entity named '${searchName}'.`);
                    return;
                }
            }

            // Ensure the target actually exists before trying to kill it
            if (!target) {
                socket.talk("m", 5_000, "No target to kill.");
                return;
            }

            // Trigger the death of the entity
            target.kill(); 
            socket.talk("m", 5_000, `Killed ${targetName}.`);
        }
    },
    {
        command: ["clone", "copy"],
        description: "weak clones... Max 15.",
        level: 2, 
        run: ({ args, socket }) => {
            let body = socket.player?.body;
            if (!body) return;

            // 1. COUNT AND LIMIT
            let currentClones = [];
            for (let entity of entities.values()) {
                if (entity.master === body && entity !== body) currentClones.push(entity);
            }
            const MAX_TOTAL = 15;
            let amountToSpawn = Math.min(parseInt(args[0]) || 1, MAX_TOTAL - currentClones.length);
            if (amountToSpawn <= 0) return socket.talk("m", 3000, "Max 15 clones reached!");

            // 2. LOOKUP CLASS
            let myClassKey = Object.keys(global.Class || Class).find(k => (global.Class || Class)[k].LABEL === body.label);
            let myClassDef = (global.Class || Class)[myClassKey] || (global.Class || Class).basic;

            for (let i = 0; i < amountToSpawn; i++) {
                let clone = new body.constructor({ x: body.x, y: body.y });
                clone.define(myClassDef);

                // 3. MIRROR STATS & VISUALS
                if (body.skill && clone.skill) {
                    clone.skill.level = body.skill.level;
                    for (let s = 0; s < 10; s++) clone.skill.raw[s] = body.skill.raw[s];
                }
                for (let key in body.BODY) clone.BODY[key] = body.BODY[key];
                clone.team = body.team;
                clone.SIZE = body.SIZE;
                clone.color = body.color;
                clone.master = body;
                clone.name = `${body.name || "Admin"}'s Shadow`;

                // 4. AI CONFIG (Smasher Focus)
                let isSmasher = body.label.toLowerCase().includes("smasher") || body.label.toLowerCase().includes("spike");
                clone.define({
                    CONTROLLERS: isSmasher ? ["nearestDifferentMaster", "minion"] : ["nearestDifferentMaster", "minion", "canRepel"],
                    AI: { NO_LEAD: !isSmasher, VIOLENT: true, FOV: 0.5 }
                });

                // 5. THE "SYNC LOOP" (Cursor Follow & No Wandering)
                let sync = setInterval(() => {
                    if (clone.isDead || body.isDead) return clearInterval(sync);

                    // A. Follow Cursor if Autofire is ON
                    // We check if the player is currently clicking or has autofire toggled
                    if (socket.player.target && (body.control.fire || body.control.main)) {
                        clone.target = { x: socket.player.target.x, y: socket.player.target.y };
                    } else {
                        clone.target = { x: body.x, y: body.y }; // Default back to master
                    }

                    // B. Strict Leash (Prevent wandering)
                    let dist = Math.sqrt(Math.pow(clone.x - body.x, 2) + Math.pow(clone.y - body.y, 2));
                    if (dist > 200) {
                        clone.velocity.x += (body.x - clone.x) * 0.08;
                        clone.velocity.y += (body.y - clone.y) * 0.08;
                    }
                }, 100);

                clone.refreshBodyAttributes();
                clone.health.amount = clone.health.max;
                clone.life();
            }
            socket.talk("m", 4000, `Bodyguards synced to cursor. Total: ${currentClones.length + amountToSpawn}/15`);
        }
    },
    {
        command: ["nuke", "doomsday", "apocalypse"],
        description: "Initiate a devastating nuclear wipe with a countdown. Usage: $nuke",
        level: 3, 
        hidden: true,
        run: ({ args, socket }) => {
            let userBody = socket.player?.body;
            let casterName = userBody ? (userBody.name || "An Admin") : "The Server";

            // Helper function to send a message to EVERY player on the server
            const broadcast = (msg, duration = 2_000) => {
                for (let entity of entities.values()) {
                    if (entity.isPlayer && entity.socket) {
                        entity.socket.talk("m", duration, msg);
                    }
                }
            };

            // Start the dramatic sequence
            broadcast(`⚠️ WARNING: NUCLEAR LAUNCH DETECTED FROM ${casterName.toUpperCase()} ⚠️`, 7_000);

            let count = 3;
            let countdownTimer = setInterval(() => {
                if (count > 0) {
                    broadcast(`☢️ DETONATION IN ${count}... ☢️`, 1_500);
                    count--;
                } else {
                    clearInterval(countdownTimer);
                    broadcast("💥 BOOM! 💥", 5_000);
                    
                    let killCount = 0;
                    let stolenScore = 0;
                    
                    // The Wipe
                    for (let entity of entities.values()) {
                        // Don't kill the caster, map walls, or things that are already dead
                        if (entity === userBody || entity.type === "wall" || entity.isGhost) continue;
                        
                        // Optional: Spare other players if you only want to nuke shapes/bosses
                        // if (entity.isPlayer) continue; 

                        // 1. Fling them in random directions for a shockwave effect
                        if (entity.velocity) {
                            entity.velocity.x += (Math.random() - 0.5) * 150;
                            entity.velocity.y += (Math.random() - 0.5) * 150;
                        }

                        // 2. Inflate them to 3x size right before they pop for massive explosion particles
                        if (entity.SIZE) {
                            entity.SIZE *= 3;
                        }

                        // 3. Steal their score
                        if (entity.skill && entity.skill.score) {
                            stolenScore += entity.skill.score;
                        }
                        
                        // 4. Obliterate them
                        entity.kill();
                        killCount++;
                    }
                    
                    // Reward the admin who pushed the button
                    if (userBody && userBody.skill) {
                        let bonus = killCount * 2500; // Flat bonus for every entity destroyed
                        userBody.skill.score += (stolenScore + bonus);
                        
                        // Force a stat update so the score bar immediately shoots up
                        if (userBody.socket) {
                            userBody.socket.talk("m", 8_000, `Nuke successful! Eradicated ${killCount} entities and gained ${Math.round(stolenScore + bonus)} score.`);
                        }
                    }
                }
            }, 1000); // Ticks every 1000ms (1 second)
        }
    },
    {
        command: ["bossrush", "raid", "bosses"],
        description: "Spawns a ring of Elite and Celestial bosses. Usage: $bossrush",
        level: 2,
        run: ({ socket }) => {
            try {
                const body = socket.player?.body;
                if (!body) return socket.talk("m", 3000, "You must be spawned in to use this!");

                // 1. SAFE CLASS LOOKUP
                // Using typeof prevents the "is not defined" crash entirely
                const Classes = typeof Class !== 'undefined' ? Class : (global.Class || null);
                if (!Classes) throw new Error("Could not find server Class list.");

                // 2. SAFE BROADCAST
                const announce = (msg) => {
                    let socks = [];
                    try {
                        if (typeof sockets !== 'undefined' && sockets.players) {
                            socks = sockets.players;
                        } else if (global.sockets && global.sockets.players) {
                            socks = global.sockets.players;
                        }

                        for (let s of socks) {
                            if (s && s.talk) {
                                s.talk("m", 5000, msg);
                            }
                        }
                    } catch (err) {
                        console.log("[ERROR] Could not send message:", err);
                    }
                }; // Closes the command function
                announce("BOSS RUSH INITIATED!");

                // 3. BOSS LINEUP FILTER
                const possibleBosses = [
                    "eliteSkimmer", "eliteDestroyer", "eliteSprayer", 
                    "eliteBattleship", "nestWarden", "nestDeacon", 
                    "summoner", "nestKeeper", "thaumaturge", "julius",
                    "witch", "freyja", "selene", "ezekiel"
                ];

                const validBosses = possibleBosses.filter(name => Classes[name] !== undefined);
                if (validBosses.length === 0) {
                    return socket.talk("m", 3000, "Error: No boss definitions found in your server.");
                }

                // 4. THE ROOM FIX & FAILSAFE
                // Default the center to YOUR tank's location just in case
                let centerX = body.x; 
                let centerY = body.y;

                // Safely try to find the actual room size
                let Room = typeof room !== 'undefined' ? room : (global.room || null);
                
                if (Room) {
                    if (Room.width && Room.height) {
                        centerX = Room.width / 2;
                        centerY = Room.height / 2;
                    } else if (Room.x && Room.y) {
                        centerX = (Room.x[0] + Room.x[1]) / 2;
                        centerY = (Room.y[0] + Room.y[1]) / 2;
                    }
                }

                const radius = 800; // How big the circle is

                // 5. SPAWN LOOP
                validBosses.forEach((bossName, index) => {
                    let angle = (index / validBosses.length) * Math.PI * 2;
                    let spawnX = centerX + Math.cos(angle) * radius;
                    let spawnY = centerY + Math.sin(angle) * radius;

                    // The Safe Spawn Method
                    let boss = new body.constructor({ x: spawnX, y: spawnY });

                    boss.define(Classes[bossName]);
                    boss.team = -100; // Standard Boss Team
                    
                    boss.define({
                        CONTROLLERS: ["nearestDifferentMaster", "canRepel"],
                        AI: { VIOLENT: true, NO_LEAD: false }
                    });

                    boss.refreshBodyAttributes();
                    if (boss.health) boss.health.amount = boss.health.max;
                    if (boss.shield) boss.shield.amount = boss.shield.max;

                    boss.life();
                });

                socket.talk("m", 3000, `Spawned ${validBosses.length} Bosses!`);

            } catch (err) {
                console.error("Boss Rush Error:", err);
                if (socket && socket.talk) socket.talk("m", 5000, "Error: " + err.message);
            }
        }
    },
    {
        command: ["1v1", "duel", "arena"],
        description: "Spawn a temporary 1v1 arena around you.",
        level: 1,
        run: ({ socket }) => {
            const body = socket.player?.body;
            if (!body) return;

            const centerX = body.x;
            const centerY = body.y;
            const radius = 800; // Size of the arena
            const wallCount = 50; // How many wall segments make up the circle
            const duelWalls = [];

            socket.talk("m", 3000, "DUEL ARENA SPAWNING! 2 minutes on the clock...");

            // Calculate the circle math
            for (let i = 0; i < wallCount; i++) {
                // Determine the angle for this wall segment
                let angle = (i / wallCount) * Math.PI * 2;
                
                // Calculate position based on the circle formula:
                // x = centerX + radius * cos(angle)
                // y = centerY + radius * sin(angle)
                let x = centerX + radius * Math.cos(angle);
                let y = centerY + radius * Math.sin(angle);

                // Spawn the wall
                let wall = new Entity({ x: x, y: y });
                wall.define("wall");
                wall.team = -101; // Neutral "Room" team
                wall.SIZE = 100;  // Thick enough to stop bullets
                
                // Rotate the wall to face the center for a cleaner look
                wall.facing = angle; 
                
                duelWalls.push(wall);
            }

            // The 60-second cleanup timer
            setTimeout(() => {
                for (let wall of duelWalls) {
                    if (wall && !wall.isDead) {
                        wall.destroy();
                    }
                }
                // Send a message to the player if they are still online
                if (socket && socket.talk) {
                    socket.talk("m", 3000, "Duel time is up! Arena dissolved.");
                }
            }, 120000); 
        }
    },
    {
        command: ["shapes", "listshapes"],
        description: "Lists all available shapes and food.",
        level: 3,
        run: ({ socket }) => {
            const Classes = global.Class || (typeof Class !== 'undefined' ? Class : {});
            const keys = Object.keys(Classes);
            
            let found = keys.filter(k => {
                let c = Classes[k];
                
                if (!c || !c.LABEL || c.LABEL === "") return false; 
                
                let isNormalFood = c.PARENT === 'food';
                let isFoodType = c.TYPE === 'food'; // Case-sensitive!
                let is3DFood = Array.isArray(c.PARENT) && c.PARENT.includes('threeDFood');
                
                return isNormalFood || isFoodType || is3DFood;
            });
            found.sort();

            if (found.length === 0) return socket.talk("m", 3000, "No shapes found. Check your Class object definitions.");

            socket.talk("m", 3000, `Found ${found.length} shapes. Sending in chunks...`);

            for (let i = 0; i < found.length; i += 10) {
                const chunk = found.slice(i, i + 10).join(", ");
                setTimeout(() => {
                    if (socket.talk) socket.talk("m", 10000, `[${i+1}] ${chunk}`);
                }, (i / 10) * 8000); 
            }
        }
    },
    {
        command: ["gauntlet", "thanos", "infinity"],
        description: "Equips the Infinity Gauntlet. Usage: $gauntlet",
        level: 2,
        run: ({ socket }) => {
            const body = socket.player?.body;
            if (!body) return;
            const Classes = global.Class || Class;
            body.define({
                LABEL: "The Mad Titan",
                COLOR: 11, // Purple
                BODY: { HEALTH: 1e9, SHIELD: 1e9, REGEN: 1e6, DAMAGE: 100, SPEED: 5 }
            });
            const gemType = Classes.cnxTheSphere ? "cnxTheSphere" : "egg";
            const gemColors = [12, 13, 11, 10, 8, 14];

            body.define({
                PROPS: gemColors.map((col, i) => ({
                    TYPE: [gemType, { COLOR: col, MIRROR_MASTER_ANGLE: true }],
                    POSITION: [4, 10, (i - 2.5) * 4, 0, 360, 1]
                }))
            });

            body.hasGauntlet = true;
            socket.talk("m", 5000, "Destiny arrives all the same.");
        }
    },
    {
        command: ["scatter", "shockwave"],
        description: "Blasts all nearby entities away from you. Usage: $scatter [power]",
        level: 2,
        run: ({ args, socket }) => {
            const body = socket.player?.body;
            if (!body) return;
            const power = Math.min(parseFloat(args[0]) || 30, 200);
            let count = 0;
            (global.entities || []).forEach(e => {
                if (!e || e === body || e.isWall || e.isGhost) return;
                const dx = e.x - body.x, dy = e.y - body.y;
                const dist = Math.sqrt(dx*dx + dy*dy) || 1;
                if (dist < 1500) { e.velocity.x += (dx/dist)*power; e.velocity.y += (dy/dist)*power; count++; }
            });
            socket.talk("m", 3000, `Scattered ${count} entities!`);
        }
    },
    {
        command: ["aura", "surround"],
        description: "Spawns a ring of a named class around you. Usage: $aura [classname] [count]",
        level: 2,
        run: ({ args, socket }) => {
            const body = socket.player?.body;
            if (!body) return;
            const Classes = global.Class || Class;
            const clsName = args[0] || "crasher";
            const cls = Classes[clsName];
            if (!cls) return socket.talk("m", 3000, `Class "${clsName}" not found.`);
            const n = Math.min(parseInt(args[1]) || 6, 20);
            for (let i = 0; i < n; i++) {
                const angle = (i/n)*Math.PI*2;
                const e = new body.constructor({ x: body.x + Math.cos(angle)*120, y: body.y + Math.sin(angle)*120 });
                e.define(cls);
                e.master = body;
                e.team = body.team;
                e.define({ CONTROLLERS: ["nearestDifferentMaster", "hangOutNearMaster", "canRepel"] });
                e.refreshBodyAttributes?.();
                e.life?.();
            }
            socket.talk("m", 3000, `Spawned ${n} ${clsName} in your aura.`);
        }
    },
    {
        command: ["crown"],
        description: "Equips a crown of 8 auto-turrets around your tank.",
        level: 2,
        run: ({ socket }) => {
            const body = socket.player?.body;
            if (!body) return;
            const existing = body.TURRETS ? [...body.TURRETS] : [];
            const crown = Array.from({length:8}, (_,i) => ({
                POSITION: [9, 18, 0, i*45, 360, 1],
                TYPE: "autoTurret"
            }));
            body.define({ TURRETS: [...existing, ...crown] });
            if (typeof body.setupTurrets === "function") body.setupTurrets();
            socket.talk("m", 3000, "Crown equipped!");
        }
    },
    {
        command: ["tremor", "quake", "shake"],
        description: "Violently shakes every entity on the map. Usage: $tremor [strength]",
        level: 2,
        run: ({ args, socket }) => {
            const str = Math.min(parseFloat(args[0]) || 15, 80);
            let count = 0;
            (global.entities || []).forEach(e => {
                if (!e || e.isWall || e.isGhost) return;
                e.velocity.x += (Math.random()-0.5)*str*2;
                e.velocity.y += (Math.random()-0.5)*str*2;
                count++;
            });
            socket.talk("m", 3000, `Tremor! ${count} entities shaken.`);
        }
    },
    {
        command: ["prison", "cage", "trap"],
        description: "Builds a wall box around the nearest enemy player.",
        level: 2,
        run: ({ socket }) => {
            const body = socket.player?.body;
            if (!body) return;
            let target = null, minD = Infinity;
            (global.entities || []).forEach(e => {
                if (!e || e === body || !e.isPlayer || e.isDead || e.team === body.team) return;
                const d = (e.x-body.x)**2 + (e.y-body.y)**2;
                if (d < minD) { minD=d; target=e; }
            });
            if (!target) return socket.talk("m", 3000, "No enemy player nearby.");
            const cx = target.x, cy = target.y, r = 120, n = 16;
            for (let i = 0; i < n; i++) {
                const a = (i/n)*Math.PI*2;
                const w = new body.constructor({ x: cx+Math.cos(a)*r, y: cy+Math.sin(a)*r });
                w.define("wall"); w.team = -100; w.SIZE = 28; w.life?.();
                setTimeout(() => { if (!w.isDead) w.kill?.(); }, 20000);
            }
            socket.talk("m", 3000, `Caged ${target.name || "a player"} for 20s!`);
        }
    },
    {
        command: ["storm", "drop"],
        description: "Rains shapes/food down around you. Usage: $storm [count]",
        level: 2,
        run: ({ args, socket }) => {
            const body = socket.player?.body;
            if (!body) return;
            const Classes = global.Class || Class;
            const foods = ["square","triangle","pentagon","crasher"].filter(k => Classes[k]);
            if (!foods.length) return socket.talk("m", 3000, "No food classes found.");
            const n = Math.min(parseInt(args[0]) || 30, 100);
            for (let i = 0; i < n; i++) {
                setTimeout(() => {
                    if (!body || body.isDead) return;
                    const fc = Classes[foods[Math.floor(Math.random()*foods.length)]];
                    const e = new body.constructor({ x: body.x+(Math.random()-0.5)*800, y: body.y+(Math.random()-0.5)*800 });
                    e.define(fc); e.team = -100;
                    e.velocity.y = Math.random()*10+5;
                    e.refreshBodyAttributes?.(); e.life?.();
                }, i*80);
            }
            socket.talk("m", 3000, `Storm incoming — ${n} shapes!`);
        }
    },
    {
        command: ["stats", "mystats"],
        description: "Shows your current BODY stat block.",
        level: 0,
        run: ({ socket }) => {
            const body = socket.player?.body;
            if (!body) return;
            const B = body.BODY || {};
            const lines = [
                `Stats for ${body.name || "you"}:`,
                `SIZE: ${body.SIZE ?? "?"}`,
                `HP: ${Math.round(body.health?.amount ?? 0)} / ${Math.round(body.health?.max ?? 0)}`,
                `SHIELD: ${Math.round(body.shield?.amount ?? 0)} / ${Math.round(body.shield?.max ?? 0)}`,
                `SPEED: ${B.SPEED?.toFixed?.(2) ?? "?"}`,
                `DAMAGE: ${B.DAMAGE?.toFixed?.(2) ?? "?"}`,
                `PENETRATION: ${B.PENETRATION?.toFixed?.(2) ?? "?"}`,
                `REGEN: ${B.REGEN?.toFixed?.(2) ?? "?"}`,
                `FOV: ${B.FOV?.toFixed?.(2) ?? "?"}`,
                `DENSITY: ${B.DENSITY?.toFixed?.(2) ?? "?"}`,
                `Team: ${body.team ?? "?"}   Level: ${body.skill?.level ?? "?"}`,
            ];
            socket.talk("Em", 10000, JSON.stringify(lines));
        }
    },
    {
        command: ["rename", "name"],
        description: "Changes your in-game name. Usage: $rename [newname]",
        level: 1,
        run: ({ args, socket }) => {
            const body = socket.player?.body;
            if (!body) return;
            if (!args[0]) return socket.talk("m", 3000, "Usage: $rename <newname>");
            const n = args.join(" ").slice(0,32);
            body.name = n;
            if (socket.player) socket.player.name = n;
            socket.talk("m", 3000, `Name changed to "${n}".`);
        }
    },
    {
        command: ["reset", "basic", "revert"],
        description: "Resets you to the basic tank and clears upgrades.",
        level: 3,
        run: ({ socket }) => {
            const body = socket.player?.body;
            if (!body) return;
            body.define({ RESET_UPGRADES: true, BATCH_UPGRADES: false });
            body.define("basic");
            socket.talk("m", 3000, "Reset to basic tank.");
        }
    },
    {
        command: ["nearest", "closest", "near"],
        description: "Shows info about the entity closest to you.",
        level: 0,
        run: ({ socket }) => {
            const body = socket.player?.body;
            if (!body) return;
            let tgt = null, minD = Infinity;
            (global.entities || []).forEach(e => {
                if (!e || e === body || e.isWall || e.isGhost) return;
                const d = (e.x-body.x)**2 + (e.y-body.y)**2;
                if (d < minD) { minD=d; tgt=e; }
            });
            if (!tgt) return socket.talk("m", 3000, "Nothing nearby.");
            const dist = Math.round(Math.sqrt(minD)/30);
            socket.talk("Em", 8000, JSON.stringify([
                `Nearest entity:`,
                `Name: ${tgt.name || tgt.label || "unknown"}`,
                `Type: ${tgt.type || "?"}`,
                `Class: ${tgt.label || "?"}`,
                `Distance: ~${dist} units`,
                `HP: ${Math.round(tgt.health?.amount ?? 0)} / ${Math.round(tgt.health?.max ?? 0)}`,
                `Size: ${tgt.SIZE ?? "?"}`,
                `Team: ${tgt.team ?? "?"}`,
            ]));
        }
    },
    {
        command: ["supernova", "explode", "nova"],
        description: "Giant shockwave launching everything off the map away from you.",
        level: 2,
        run: ({ socket }) => {
            const body = socket.player?.body;
            if (!body) return;
            let count = 0;
            (global.entities || []).forEach(e => {
                if (!e || e === body || e.isWall || e.isGhost) return;
                const dx = e.x-body.x, dy = e.y-body.y;
                const dist = Math.sqrt(dx*dx+dy*dy) || 1;
                const force = Math.max(5, 200-dist*0.05);
                e.velocity.x += (dx/dist)*force;
                e.velocity.y += (dy/dist)*force;
                if (e.SIZE) e.SIZE *= 2.5;
                setTimeout(() => { if (!e.isDead) e.kill?.(); }, 600);
                count++;
            });
            const pl = (global.sockets?.players) || [];
            pl.forEach(s => s?.talk?.("m", 4000, "SUPERNOVA!"));
            socket.talk("m", 4000, `Supernova erased ${count} entities.`);
        }
    },
    {
        command: ["gravity", "push"],
        description: "Pushes all entities in a direction for N seconds. Usage: $gravity [up|down|left|right] [seconds]",
        level: 2,
        run: ({ args, socket }) => {
            const dir = (args[0] || "down").toLowerCase();
            const dur = Math.min(parseFloat(args[1]) || 8, 30)*1000;
            const vx = dir==="left"?-8:dir==="right"?8:0;
            const vy = dir==="up"?-8:dir==="down"?8:0;
            socket.talk("m", 3000, `Gravity ${dir} for ${dur/1000}s.`);
            const iv = setInterval(() => {
                (global.entities||[]).forEach(e => {
                    if (!e || e.isWall || e.isGhost) return;
                    e.velocity.x += vx; e.velocity.y += vy;
                });
            }, 50);
            setTimeout(() => { clearInterval(iv); if(socket.talk) socket.talk("m",3000,"Gravity restored."); }, dur);
        }
    },
    {
        command: ["whisper", "w", "dm", "pm", "msg"],
        description: "Private message another player. Usage: $whisper <name> <message>",
        level: 0,
        run: ({ args, socket }) => {
            const body = socket.player?.body;
            const from = body?.name || socket.player?.name || "Anonymous";
            if (args.length < 2) return socket.talk("m", 3000, "Usage: $whisper <playername> <message>");
            const tgt = _findPlayer(args[0]);
            if (!tgt)  return socket.talk("m", 3000, `"${args[0]}" is not online right now.`);
            if (tgt === body) return socket.talk("m", 3000, "You can't whisper to yourself.");
            const now = Date.now();
            if (socket._wCD && now - socket._wCD < 1500) return socket.talk("m", 1500, "Slow down!");
            socket._wCD = now;
            const msg = args.slice(1).join(" ");
            // store so $reply works
            if (tgt.socket) tgt.socket._lastWhisperer = from;
            tgt.socket?.talk?.("m", 9000, `[DM from ${from}]: ${msg}`);
            socket.talk("m", 5000, `[DM → ${tgt.name}]: ${msg}`);
        }
    },
    {
        command: ["reply", "r"],
        description: "Reply to the last player who DM'd you. Usage: $reply <message>",
        level: 0,
        run: ({ args, socket }) => {
            const body = socket.player?.body;
            const from = body?.name || "Anonymous";
            if (!args.length) return socket.talk("m", 3000, "Usage: $reply <message>");
            const who = socket._lastWhisperer;
            if (!who) return socket.talk("m", 3000, "No one has whispered you yet.");
            const tgt = _findPlayer(who);
            if (!tgt) return socket.talk("m", 3000, `${who} is no longer online.`);
            if (tgt.socket) tgt.socket._lastWhisperer = from;
            const msg = args.join(" ");
            tgt.socket?.talk?.("m", 9000, `[DM from ${from}]: ${msg}`);
            socket.talk("m", 5000, `[DM → ${tgt.name}]: ${msg}`);
        }
    },
    {
        command: ["who", "players", "online"],
        description: "Lists every player currently on the server.",
        level: 0,
        run: ({ socket }) => {
            const list = [];
            _getAll().forEach(e => {
                if (e && e.isPlayer && !e.isDead)
                    list.push(`• ${e.name || "Unnamed"}  Lv ${e.skill?.level ?? "?"}  [${e.label || "?"}]`);
            });
            if (!list.length) return socket.talk("m", 4000, "No players found on the server.");
            socket.talk("Em", 14000, JSON.stringify(["── Players Online ──", ...list, `Total: ${list.length}`]));
        }
    },
    {
        command: ["heal", "restore"],
        description: "Heals you or a named player to full. Usage: $heal [name|all]",
        level: 1,
        run: ({ args, socket }) => {
            let targets = [];
            const who = args[0]?.toLowerCase?.()?.trim();
            if (!who) {
                const b = socket.player?.body; if (b) targets.push(b);
            } else if (who === "all") {
                _getAll().forEach(e => { if (e?.isPlayer && !e.isDead) targets.push(e); });
            } else {
                const f = _findPlayer(who);
                if (!f) return socket.talk("m", 3000, `Player "${args[0]}" not found.`);
                targets.push(f);
            }
            targets.forEach(b => {
                if (b.health) b.health.amount = b.health.max || 1e9;
                if (b.shield) b.shield.amount = b.shield.max || 1e9;
            });
            socket.talk("m", 3000, `Healed ${targets.length} target(s).`);
        }
    },
    {
        command: ["freeze", "stop", "halt"],
        description: "Freezes a player in place for N seconds. Usage: $freeze <name> [seconds]",
        level: 2,
        run: ({ args, socket }) => {
            if (!args[0]) return socket.talk("m", 3000, "Usage: $freeze <playername> [seconds]");
            const tgt = _findPlayer(args[0]);
            if (!tgt) return socket.talk("m", 3000, `"${args[0]}" not found. Check exact name with $who.`);
            const dur = Math.min(parseFloat(args[1]) || 5, 60) * 1000;
            const fx = tgt.x, fy = tgt.y;
            const iv = setInterval(() => {
                if (tgt.isDead) { clearInterval(iv); return; }
                tgt.x = fx; tgt.y = fy;
                if (tgt.velocity) { tgt.velocity.x = 0; tgt.velocity.y = 0; }
            }, 20);
            setTimeout(() => {
                clearInterval(iv);
                if (socket.talk) socket.talk("m", 3000, `${tgt.name} has been unfrozen.`);
                tgt.socket?.talk?.("m", 3000, "You have been unfrozen!");
            }, dur);
            socket.talk("m", 3000, `Frozen ${tgt.name} for ${dur / 1000}s.`);
            tgt.socket?.talk?.("m", dur, "You are FROZEN!");
        }
    },
    {
        command: ["yeet", "launch", "blast"],
        description: "Launches a named player in a random direction. Usage: $yeet <name>",
        level: 2,
        run: ({ args, socket }) => {
            if (!args[0]) return socket.talk("m", 3000, "Usage: $yeet <playername>");
            const tgt = _findPlayer(args[0]);
            if (!tgt) return socket.talk("m", 3000, `"${args[0]}" not found. Use $who to check names.`);
            const angle = Math.random() * Math.PI * 2;
            const power = 130;
            if (tgt.velocity) { tgt.velocity.x += Math.cos(angle) * power; tgt.velocity.y += Math.sin(angle) * power; }
            socket.talk("m", 3000, `YEET! ${tgt.name} launched!`);
            tgt.socket?.talk?.("m", 3000, "You have been YEETED!");
        }
    },
    {
        command: ["grapple", "hook", "tether"],
        description: "Grapples toward a named player, pulling you to them. Usage: $grapple <name>",
        level: 1,
        run: ({ args, socket }) => {
            const body = socket.player?.body;
            if (!body) return;
            if (!args[0]) return socket.talk("m", 3000, "Usage: $grapple <playername>");
            const tgt = _findPlayer(args[0]);
            if (!tgt) return socket.talk("m", 3000, `"${args[0]}" not found.`);
            socket.talk("m", 2500, `Grappling toward ${tgt.name}!`);
            let ticks = 25;
            const iv = setInterval(() => {
                if (body.isDead || tgt.isDead || ticks <= 0) { clearInterval(iv); return; }
                const dx = tgt.x - body.x, dy = tgt.y - body.y, d = Math.sqrt(dx * dx + dy * dy) || 1;
                if (d < 90) { clearInterval(iv); return; }
                body.velocity.x += (dx / d) * 14;
                body.velocity.y += (dy / d) * 14;
                ticks--;
            }, 30);
        }
    },
    {
        command: ["dash", "zip"],
        description: "Instantly dashes forward in your aiming direction. Usage: $dash [distance]",
        level: 2,
        run: ({ args, socket }) => {
            const body = socket.player?.body;
            if (!body) return;
            const dist = Math.min(parseInt(args[0]) || 300, 1500);
            let dx = 1, dy = 0;
            if (body.control?.target) {
                const tx = body.control.target.x, ty = body.control.target.y;
                const mag = Math.sqrt(tx * tx + ty * ty) || 1;
                dx = tx / mag; dy = ty / mag;
            } else if (typeof body.facing === "number") {
                dx = Math.cos(body.facing); dy = Math.sin(body.facing);
            }
            body.x += dx * dist;
            body.y += dy * dist;
            if (body.velocity) { body.velocity.x = 0; body.velocity.y = 0; }
            socket.talk("m", 2000, "Dash!");
        }
    },
    {
        command: ["titan", "mecha"],
        description: "Transforms you into a massive titan for N seconds. Usage: $titan [seconds]",
        level: 2,
        run: ({ args, socket }) => {
            const body = socket.player?.body;
            if (!body) return;
            const dur = Math.min(parseFloat(args[0]) || 20, 60) * 1000;
            const savedSize = body.SIZE;
            const savedBody = body.BODY ? { ...body.BODY } : {};
            body.SIZE = savedSize * 4;
            body.coreSize = body.SIZE;
            if (body.BODY) {
                body.BODY.HEALTH = (savedBody.HEALTH || 1) * 5;
                body.BODY.DAMAGE = (savedBody.DAMAGE || 1) * 3;
                body.BODY.SPEED  = (savedBody.SPEED  || 1) * 1.3;
                body.BODY.SHIELD = (savedBody.SHIELD || 1) * 4;
                body.BODY.REGEN  = (savedBody.REGEN  || 1) * 2;
            }
            body.refreshBodyAttributes?.();
            if (body.health) body.health.amount = body.health.max;
            _bcast(`${body.name || "A player"} became a TITAN!`, 4000);
            setTimeout(() => {
                if (body.isDead) return;
                body.SIZE = savedSize; body.coreSize = savedSize;
                if (body.BODY) Object.assign(body.BODY, savedBody);
                body.refreshBodyAttributes?.();
                if (socket.talk) socket.talk("m", 3000, "You reverted to normal size.");
            }, dur);
        }
    },
    {
        command: ["thunderbolt", "lightning", "strike"],
        description: "Strikes the nearest N enemies with lightning damage. Usage: $thunderbolt [count] [damage]",
        level: 2,
        run: ({ args, socket }) => {
            const body = socket.player?.body;
            if (!body) return;
            const n   = Math.min(parseInt(args[0]) || 3, 15);
            const dmg = Math.min(parseInt(args[1]) || 300, 5000);
            const enemies = _getAll()
                .filter(e => e && e !== body && !e.isWall && !e.isGhost && e.team !== body.team && e.health)
                .map(e => ({ e, d: (e.x - body.x) ** 2 + (e.y - body.y) ** 2 }))
                .sort((a, b) => a.d - b.d)
                .slice(0, n);
            enemies.forEach(({ e }) => {
                e.health.amount = Math.max(1, e.health.amount - dmg);
                if (e.velocity) { e.velocity.x += (Math.random() - 0.5) * 40; e.velocity.y += (Math.random() - 0.5) * 40; }
                e.socket?.talk?.("m", 2000, "You were struck by lightning!");
            });
            socket.talk("m", 3000, `Thunderbolt struck ${enemies.length} enemies for ${dmg} damage!`);
        }
    },
    {
        command: ["inferno", "firezone", "scorch"],
        description: "Creates a burning zone at your position. Usage: $inferno [seconds] [radius]",
        level: 2,
        run: ({ args, socket }) => {
            const body = socket.player?.body;
            if (!body) return;
            const dur = Math.min(parseFloat(args[0]) || 10, 30) * 1000;
            const radius = parseInt(args[1]) || 250;
            const zx = body.x, zy = body.y;
            socket.talk("m", 3000, `Inferno zone created for ${dur / 1000}s!`);
            const iv = setInterval(() => {
                _getAll().forEach(e => {
                    if (!e || e.isWall || e.isGhost || !e.health) return;
                    const d = Math.sqrt((e.x - zx) ** 2 + (e.y - zy) ** 2);
                    if (d < radius) e.health.amount = Math.max(1, e.health.amount - (e.health.max || 500) * 0.03);
                });
            }, 500);
            setTimeout(() => clearInterval(iv), dur);
        }
    },
    {
        command: ["magnetize", "collect", "harvest"],
        description: "Pulls all nearby non-player entities toward you. Usage: $magnetize [radius]",
        level: 1,
        run: ({ args, socket }) => {
            const body = socket.player?.body;
            if (!body) return;
            const radius = parseInt(args[0]) || 600;
            let count = 0;
            _getAll().forEach(e => {
                if (!e || e === body || e.isWall || e.isGhost || e.isPlayer) return;
                const dx = body.x - e.x, dy = body.y - e.y, d = Math.sqrt(dx * dx + dy * dy) || 1;
                if (d < radius) { e.velocity.x += (dx / d) * 15; e.velocity.y += (dy / d) * 15; count++; }
            });
            socket.talk("m", 3000, `Magnetized ${count} nearby entities toward you!`);
        }
    },
    {
        command: ["taunt", "provoke"],
        description: "Pulls nearby enemy mobs toward you, provoking them. Usage: $taunt [radius]",
        level: 1,
        run: ({ args, socket }) => {
            const body = socket.player?.body;
            if (!body) return;
            const radius = parseInt(args[0]) || 700;
            let count = 0;
            _getAll().forEach(e => {
                if (!e || e === body || e.isWall || e.isGhost || e.isPlayer || e.team === body.team) return;
                const dx = body.x - e.x, dy = body.y - e.y, d = Math.sqrt(dx * dx + dy * dy) || 1;
                if (d < radius) { e.velocity.x += (dx / d) * 10; e.velocity.y += (dy / d) * 10; count++; }
            });
            socket.talk("m", 3000, `Provoked ${count} enemies toward you!`);
        }
    },
    {
        command: ["soulswap", "bodyswap"],
        description: "Fully swaps class, position and name with another player. Usage: $soulswap <name>",
        level: 2,
        run: ({ args, socket }) => {
            const body = socket.player?.body;
            if (!body) return;
            if (!args[0]) return socket.talk("m", 3000, "Usage: $soulswap <playername>");
            const tgt = _findPlayer(args[0]);
            if (!tgt) return socket.talk("m", 3000, `"${args[0]}" not found.`);
            const bodyGuns = JSON.parse(JSON.stringify(body.GUNS || []));
            const bodyTurrets = JSON.parse(JSON.stringify(body.TURRETS || []));
            const bodySize = body.SIZE, bodyColor = body.color, bodyName = body.name;
            const tgtGuns = JSON.parse(JSON.stringify(tgt.GUNS || []));
            const tgtTurrets = JSON.parse(JSON.stringify(tgt.TURRETS || []));
            const tgtSize = tgt.SIZE, tgtColor = tgt.color, tgtName = tgt.name;
            body.define({ GUNS: tgtGuns, TURRETS: tgtTurrets, SIZE: tgtSize, COLOR: tgtColor });
            body.name = tgtName;
            if (socket.player) socket.player.name = tgtName;
            tgt.define({ GUNS: bodyGuns, TURRETS: bodyTurrets, SIZE: bodySize, COLOR: bodyColor });
            tgt.name = bodyName;
            if (tgt.socket?.player) tgt.socket.player.name = bodyName;
            const ax = body.x, ay = body.y, bx = tgt.x, by = tgt.y;
            body.x = bx; body.y = by; tgt.x = ax; tgt.y = ay;
            body.refreshBodyAttributes?.();
            tgt.refreshBodyAttributes?.();
            socket.talk("m", 4000, `Soul swapped with ${tgtName}!`);
            tgt.socket?.talk?.("m", 4000, `Your soul was swapped with ${bodyName}!`);
        }
    },
    {
        command: ["judgement", "wrath"],
        description: "Calls down a devastating strike on a player's location. Usage: $judgement <name>",
        level: 2,
        run: ({ args, socket }) => {
            if (!args[0]) return socket.talk("m", 3000, "Usage: $judgement <playername>");
            const tgt = _findPlayer(args[0]);
            if (!tgt) return socket.talk("m", 3000, `"${args[0]}" not found.`);
            const zx = tgt.x, zy = tgt.y;
            tgt.socket?.talk?.("m", 3000, "The sky darkens above you...");
            setTimeout(() => {
                _getAll().forEach(e => {
                    if (!e || e.isWall || e.isGhost || !e.health) return;
                    const d = Math.sqrt((e.x - zx) ** 2 + (e.y - zy) ** 2);
                    if (d < 220) {
                        e.health.amount = Math.max(1, e.health.amount - (e.health.max || 500) * 0.6);
                        if (e.velocity) { e.velocity.x += (Math.random() - 0.5) * 50; e.velocity.y -= 40; }
                    }
                });
                _bcast(`Judgement fell upon ${tgt.name}'s location!`, 5000);
            }, 1500);
            socket.talk("m", 3000, `Judgement called down on ${tgt.name} in 1.5s...`);
        }
    },
    {
        command: ["fortify", "bunker"],
        description: "Builds a ring of walls around you for N seconds. Usage: $fortify [seconds]",
        level: 2,
        run: ({ args, socket }) => {
            const body = socket.player?.body;
            if (!body) return;
            const dur = Math.min(parseFloat(args[0]) || 15, 60) * 1000;
            const r = (body.SIZE || 12) * 6 + 80;
            const n = 14;
            const walls = [];
            for (let i = 0; i < n; i++) {
                const a = (i / n) * Math.PI * 2;
                const w = new body.constructor({ x: body.x + Math.cos(a) * r, y: body.y + Math.sin(a) * r });
                w.define("wall"); w.team = body.team; w.SIZE = 36; w.life?.();
                walls.push(w);
            }
            socket.talk("m", 3000, `Fortified with a wall ring for ${dur / 1000}s!`);
            setTimeout(() => {
                walls.forEach(w => { if (!w.isDead) w.kill?.(); });
                if (socket.talk) socket.talk("m", 3000, "Fortification collapsed.");
            }, dur);
        }
    },
    {
        command: ["ping", "latency"],
        description: "Shows a rough round-trip ping estimate.",
        level: 0,
        run: ({ socket }) => {
            const now = Date.now();
            if (socket._pingSent) {
                socket.talk("m", 4000, `Ping: ~${now - socket._pingSent}ms since last check.`);
            } else {
                socket.talk("m", 4000, "Measuring... run $ping again in a moment.");
            }
            socket._pingSent = now;
        }
    },
    {
        command: ["spectate", "follow"],
        description: "Continuously follows a named player's position. Run again to stop. Usage: $spectate <name>",
        level: 1,
        run: ({ args, socket }) => {
            const body = socket.player?.body;
            if (!body) return;
            if (body._spectateIv) {
                clearInterval(body._spectateIv);
                delete body._spectateIv;
                return socket.talk("m", 3000, "Stopped following.");
            }
            if (!args[0]) return socket.talk("m", 3000, "Usage: $spectate <playername>");
            const tgt = _findPlayer(args[0]);
            if (!tgt) return socket.talk("m", 3000, `"${args[0]}" not found.`);
            socket.talk("m", 3000, `Following ${tgt.name}. Run $spectate again to stop.`);
            body._spectateIv = setInterval(() => {
                if (body.isDead || tgt.isDead) { clearInterval(body._spectateIv); delete body._spectateIv; return; }
                body.x = tgt.x; body.y = tgt.y;
                if (body.velocity) { body.velocity.x = 0; body.velocity.y = 0; }
            }, 50);
        }
    },
    {
        command: ["airdrop", "supplydrop", "crate"],
        description: "Drops a supply crate that buffs the first player who reaches it.",
        level: 1,
        run: ({ socket }) => {
            const body = socket.player?.body;
            if (!body) return;
            const Classes = global.Class || (typeof Class !== "undefined" ? Class : {});
            const cls = Classes.square || Classes.crasher || Classes.food;
            if (!cls) return socket.talk("m", 3000, "No crate visual class available.");
            const crate = new body.constructor({ x: body.x + (Math.random() - 0.5) * 400, y: body.y - 600 });
            crate.define(cls); crate.team = -100; crate.SIZE = 26; crate.coreSize = 26;
            if (crate.velocity) crate.velocity.y = 6;
            crate.refreshBodyAttributes?.();
            crate.life?.();
            socket.talk("m", 3000, "Supply crate incoming!");
            const iv = setInterval(() => {
                if (!crate || crate.isDead) { clearInterval(iv); return; }
                let claimed = false;
                _getAll().forEach(e => {
                    if (claimed || !e || !e.isPlayer || e.isDead) return;
                    const d = Math.sqrt((e.x - crate.x) ** 2 + (e.y - crate.y) ** 2);
                    if (d < 60) {
                        claimed = true;
                        if (e.BODY) {
                            const os = e.BODY.DAMAGE || 1, osp = e.BODY.SPEED || 1;
                            e.BODY.DAMAGE = os * 1.5; e.BODY.SPEED = osp * 1.3;
                            e.refreshBodyAttributes?.();
                            setTimeout(() => { if (!e.isDead && e.BODY) { e.BODY.DAMAGE = os; e.BODY.SPEED = osp; e.refreshBodyAttributes?.(); } }, 20000);
                        }
                        e.socket?.talk?.("m", 5000, "Supply crate claimed! +50% damage, +30% speed for 20s.");
                        crate.kill?.();
                        clearInterval(iv);
                    }
                });
            }, 200);
            setTimeout(() => { if (crate && !crate.isDead) crate.kill?.(); clearInterval(iv); }, 15000);
        }
    },
    {
        command: ["zombify", "plaguebearer"],
        description: "Infects a player — they periodically damage nearby players. Usage: $zombify <name>",
        level: 2,
        run: ({ args, socket }) => {
            if (!args[0]) return socket.talk("m", 3000, "Usage: $zombify <playername>");
            const tgt = _findPlayer(args[0]);
            if (!tgt) return socket.talk("m", 3000, `"${args[0]}" not found.`);
            const origColor = tgt.color;
            tgt.color = 4; tgt.define({ COLOR: 4 });
            tgt.socket?.talk?.("m", 6000, "You have been INFECTED! You spread plague to nearby players.");
            let ticks = 10;
            const iv = setInterval(() => {
                if (tgt.isDead || ticks <= 0) {
                    clearInterval(iv);
                    if (!tgt.isDead) { tgt.color = origColor; tgt.define({ COLOR: origColor }); }
                    return;
                }
                _getAll().forEach(e => {
                    if (!e || e === tgt || !e.isPlayer || e.isDead) return;
                    const d = Math.sqrt((e.x - tgt.x) ** 2 + (e.y - tgt.y) ** 2);
                    if (d < 150 && e.health) {
                        e.health.amount = Math.max(1, e.health.amount - (e.health.max || 500) * 0.05);
                        e.socket?.talk?.("m", 2000, "The plague spreads to you!");
                    }
                });
                ticks--;
            }, 2000);
            socket.talk("m", 3000, `${tgt.name} has been infected!`);
        }
    },
    {
        command: ["track", "locate", "find"],
        description: "Shows the exact coordinates of a named player. Usage: $track <name>",
        level: 2,
        run: ({ args, socket }) => {
            if (!args[0]) return socket.talk("m", 3000, "Usage: $track <playername>");
            const tgt = _findPlayer(args[0]);
            if (!tgt) return socket.talk("m", 3000, `"${args[0]}" not found.`);
            socket.talk("m", 6000, `${tgt.name} is at (${Math.round(tgt.x / 30)}, ${Math.round(tgt.y / 30)}).`);
        }
    },
    {
        command: ["countdown", "timer"],
        description: "Broadcasts a countdown that ends with a message. Usage: $countdown [seconds] [message]",
        level: 1,
        run: ({ args, socket }) => {
            const n = Math.min(parseInt(args[0]) || 3, 10);
            const label = args.slice(1).join(" ") || "GO";
            let count = n;
            _bcast(`Countdown started: ${count}...`, 1500);
            const iv = setInterval(() => {
                count--;
                if (count > 0) { _bcast(`${count}...`, 1200); }
                else { clearInterval(iv); _bcast(`${label}!`, 3000); }
            }, 1000);
        }
    },
    {
        command: ["execute", "finishhim", "overkill"],
        description: "Deals damage equal to a % of a player's CURRENT HP. Usage: $execute <name> [percent]",
        level: 2,
        run: ({ args, socket }) => {
            if (!args[0]) return socket.talk("m", 3000, "Usage: $execute <playername> [percent]");
            const tgt = _findPlayer(args[0]);
            if (!tgt) return socket.talk("m", 3000, `"${args[0]}" not found.`);
            const pct = Math.min(Math.max(parseFloat(args[1]) || 50, 1), 100) / 100;
            if (tgt.health) tgt.health.amount = Math.max(1, tgt.health.amount * (1 - pct));
            socket.talk("m", 3000, `Executed ${tgt.name} for ${Math.round(pct * 100)}% of current HP!`);
            tgt.socket?.talk?.("m", 3000, "You were struck by an execution attack!");
        }
    },
    {
        command: ["inspect", "scan"],
        description: "Shows detailed loadout info for a named or nearest target. Usage: $inspect [name]",
        level: 1,
        run: ({ args, socket }) => {
            const body = socket.player?.body;
            let tgt = null;
            if (args[0]) {
                tgt = _findPlayer(args[0]);
                if (!tgt) return socket.talk("m", 3000, `"${args[0]}" not found.`);
            } else {
                let minD = Infinity;
                _getAll().forEach(e => {
                    if (!e || e === body || e.isWall || e.isGhost) return;
                    const d = (e.x - body.x) ** 2 + (e.y - body.y) ** 2;
                    if (d < minD) { minD = d; tgt = e; }
                });
            }
            if (!tgt) return socket.talk("m", 3000, "No target found.");
            socket.talk("Em", 10000, JSON.stringify([
                `── Inspecting ${tgt.name || tgt.label || "?"} ──`,
                `Class: ${tgt.label || "?"}`,
                `Guns: ${(tgt.GUNS || []).length}`,
                `Turrets: ${(tgt.TURRETS || []).length}`,
                `Size: ${tgt.SIZE ?? "?"}`,
                `Colour: ${tgt.color ?? "?"}`,
                `Team: ${tgt.team ?? "?"}`,
                `HP: ${Math.round(tgt.health?.amount ?? 0)}/${Math.round(tgt.health?.max ?? 0)}`,
            ]));
        }
    },
    {
        command: ["duelzone", "colosseum"],
        description: "Builds an arena and teleports two players into it. Usage: $duelzone <p1> <p2>",
        level: 2,
        run: ({ args, socket }) => {
            const body = socket.player?.body;
            if (!body) return;
            if (args.length < 2) return socket.talk("m", 3000, "Usage: $duelzone <player1> <player2>");
            const p1 = _findPlayer(args[0]), p2 = _findPlayer(args[1]);
            if (!p1 || !p2) return socket.talk("m", 3000, "One or both players not found.");
            const cx = body.x, cy = body.y, r = 500, n = 40;
            const walls = [];
            for (let i = 0; i < n; i++) {
                const a = (i / n) * Math.PI * 2;
                const w = new body.constructor({ x: cx + Math.cos(a) * r, y: cy + Math.sin(a) * r });
                w.define("wall"); w.team = -100; w.SIZE = 90; w.life?.();
                walls.push(w);
            }
            p1.x = cx - 150; p1.y = cy;
            p2.x = cx + 150; p2.y = cy;
            [p1, p2].forEach(p => { if (p.velocity) { p.velocity.x = 0; p.velocity.y = 0; } });
            p1.socket?.talk?.("m", 5000, `Duel vs ${p2.name} begins!`);
            p2.socket?.talk?.("m", 5000, `Duel vs ${p1.name} begins!`);
            socket.talk("m", 3000, `Duel zone built for ${p1.name} vs ${p2.name}!`);
            setTimeout(() => {
                walls.forEach(w => { if (!w.isDead) w.kill?.(); });
                if (socket.talk) socket.talk("m", 3000, "Duel zone dissolved.");
            }, 120000);
        }
    },
    {
        command: ["teamup", "alliance"],
        description: "Forces two named players onto the same team for 60s. Usage: $teamup <p1> <p2>",
        level: 2,
        run: ({ args, socket }) => {
            if (args.length < 2) return socket.talk("m", 3000, "Usage: $teamup <player1> <player2>");
            const p1 = _findPlayer(args[0]), p2 = _findPlayer(args[1]);
            if (!p1 || !p2) return socket.talk("m", 3000, "One or both players not found.");
            const newTeam = p1.team, origTeam2 = p2.team;
            p2.team = newTeam; p2.define({ TEAM: newTeam });
            socket.talk("m", 3000, `${p2.name} joined ${p1.name}'s team for 60s.`);
            p1.socket?.talk?.("m", 5000, `${p2.name} is now your ally!`);
            p2.socket?.talk?.("m", 5000, `You are now allied with ${p1.name}!`);
            setTimeout(() => {
                if (!p2.isDead) { p2.team = origTeam2; p2.define({ TEAM: origTeam2 }); p2.socket?.talk?.("m", 3000, "Alliance ended."); }
            }, 60000);
        }
    },
    {
        command: ["decoy", "mirage"],
        description: "Spawns harmless visual clones of yourself to confuse enemies. Usage: $decoy [count]",
        level: 1,
        run: ({ args, socket }) => {
            const body = socket.player?.body;
            if (!body) return;
            const Classes = global.Class || (typeof Class !== "undefined" ? Class : {});
            const key = Object.keys(Classes).find(k => Classes[k].LABEL === body.label);
            const cls = key ? Classes[key] : Classes.basic;
            if (!cls) return socket.talk("m", 3000, "Could not find your class to mimic.");
            const n = Math.min(parseInt(args[0]) || 1, 5);
            for (let i = 0; i < n; i++) {
                const a = Math.random() * Math.PI * 2;
                const d = new body.constructor({ x: body.x + Math.cos(a) * 150, y: body.y + Math.sin(a) * 150 });
                d.define(cls);
                d.team = body.team;
                d.name = body.name || "???";
                d.define({ BODY: { DAMAGE: 0, HEALTH: 1, SPEED: (body.BODY?.SPEED || 1) }, CONTROLLERS: ["nearestDifferentMaster", "mapTargetToGoal"] });
                d.refreshBodyAttributes?.();
                d.life?.();
                setTimeout(() => { if (!d.isDead) d.kill?.(); }, 15000);
            }
            socket.talk("m", 3000, `${n} decoy(s) deployed for 15s!`);
        }
    },
    {
        command: ["curse", "hex", "doom"],
        description: "Curses a player — lose 8% HP every 2s for 20s. Usage: $curse <name>",
        level: 2,
        run: ({ args, socket }) => {
            if (!args[0]) return socket.talk("m", 3000, "Usage: $curse <playername>");
            const tgt = _findPlayer(args[0]);
            if (!tgt) return socket.talk("m", 3000, `"${args[0]}" not found.`);
            let ticks = 10;
            tgt.socket?.talk?.("m", 5000, "You have been CURSED!");
            const iv = setInterval(() => {
                if (tgt.isDead || ticks <= 0) { clearInterval(iv); return; }
                if (tgt.health) tgt.health.amount = Math.max(1, tgt.health.amount - (tgt.health.max || 500) * 0.08);
                tgt.socket?.talk?.("m", 2200, `Curse: ${ticks} ticks remaining...`);
                ticks--;
            }, 2000);
            socket.talk("m", 3000, `${tgt.name} cursed for 20s.`);
        }
    },
    {
        command: ["bless", "consecrate"],
        description: "Blesses a player — gain 12% HP every 2s for 20s. Usage: $bless [name]",
        level: 1,
        run: ({ args, socket }) => {
            const body = socket.player?.body;
            let tgt = body;
            if (args[0]) { tgt = _findPlayer(args[0]); if (!tgt) return socket.talk("m", 3000, `"${args[0]}" not found.`); }
            let ticks = 10;
            tgt.socket?.talk?.("m", 5000, "You have been BLESSED!");
            const iv = setInterval(() => {
                if (tgt.isDead || ticks <= 0) { clearInterval(iv); return; }
                if (tgt.health) tgt.health.amount = Math.min(tgt.health.max || 1e9, tgt.health.amount + (tgt.health.max || 500) * 0.12);
                if (tgt.shield) tgt.shield.amount = Math.min(tgt.shield.max || 1e9, tgt.shield.amount + (tgt.shield.max || 200) * 0.08);
                ticks--;
            }, 2000);
            socket.talk("m", 3000, `${tgt.name} blessed for 20s.`);
        }
    },
    {
        command: ["swap", "switchplaces"],
        description: "Swaps positions with a named player. Usage: $swap <name>",
        level: 1,
        run: ({ args, socket }) => {
            const body = socket.player?.body;
            if (!body) return;
            if (!args[0]) return socket.talk("m", 3000, "Usage: $swap <playername>");
            const tgt = _findPlayer(args[0]);
            if (!tgt) return socket.talk("m", 3000, `"${args[0]}" not found.`);
            const ax = body.x, ay = body.y;
            body.x = tgt.x; body.y = tgt.y;
            tgt.x = ax;    tgt.y = ay;
            if (body.velocity) { body.velocity.x = 0; body.velocity.y = 0; }
            if (tgt.velocity)  { tgt.velocity.x  = 0; tgt.velocity.y  = 0; }
            socket.talk("m", 3000, `Swapped positions with ${tgt.name}!`);
            tgt.socket?.talk?.("m", 3000, `Your position was swapped with ${body.name || "an admin"}!`);
        }
    },
    {
        command: ["doppelganger", "impersonate"],
        description: "Copies another player's look onto you. Usage: $doppelganger <name>",
        level: 1,
        run: ({ args, socket }) => {
            const body = socket.player?.body;
            if (!body) return;
            if (!args[0]) return socket.talk("m", 3000, "Usage: $doppelganger <playername>");
            const tgt = _findPlayer(args[0]);
            if (!tgt) return socket.talk("m", 3000, `"${args[0]}" not found.`);
            try {
                body.define({
                    GUNS:    JSON.parse(JSON.stringify(tgt.GUNS    || [])),
                    TURRETS: JSON.parse(JSON.stringify(tgt.TURRETS || [])),
                    SIZE:    tgt.SIZE,
                    COLOR:   tgt.color,
                });
            } catch (_) {
                body.define({ GUNS: tgt.GUNS || [], TURRETS: tgt.TURRETS || [], SIZE: tgt.SIZE });
            }
            body.name = tgt.name + " [copy]";
            if (socket.player) socket.player.name = body.name;
            body.refreshBodyAttributes?.();
            socket.talk("m", 3000, `You are now a doppelganger of ${tgt.name}.`);
        }
    },
    {
        command: ["copyclass", "steal", "become"],
        description: "Copies another player's class onto you. Usage: $copyclass <name>",
        level: 1,
        run: ({ args, socket }) => {
            const body = socket.player?.body;
            if (!body) return;
            if (!args[0]) return socket.talk("m", 3000, "Usage: $copyclass <playername>");
            const tgt = _findPlayer(args[0]);
            if (!tgt) return socket.talk("m", 3000, `"${args[0]}" not found.`);
            const Classes = global.Class || (typeof Class !== "undefined" ? Class : {});
            const key = Object.keys(Classes).find(k => Classes[k].LABEL === tgt.label);
            if (key) {
                body.define(Classes[key]);
                if (typeof body.setupTurrets === "function") body.setupTurrets();
            } else {
                body.define({ GUNS: tgt.GUNS || [], TURRETS: tgt.TURRETS || [], SIZE: tgt.SIZE });
            }
            body.refreshBodyAttributes?.();
            socket.talk("m", 3000, `Copied ${tgt.name}'s class.`);
        }
    },
    {
        command: ["bounty", "wanted"],
        description: "Places a bounty on a player — killer gets the XP reward. Usage: $bounty <name> [reward]",
        level: 1,
        run: ({ args, socket }) => {
            if (!args[0]) return socket.talk("m", 3000, "Usage: $bounty <playername> [reward]");
            const tgt = _findPlayer(args[0]);
            if (!tgt) return socket.talk("m", 3000, `"${args[0]}" not found. Check $who.`);
            const reward = Math.abs(parseInt(args[1]) || 5000);
            const name = tgt.name;
            global._bounties = global._bounties || {};
            if (global._bounties[name]) return socket.talk("m", 3000, `${name} already has a bounty!`);
            global._bounties[name] = reward;
            _bcast(`BOUNTY: ${name} — Kill them for ${reward} XP!`, 8000);
            tgt.socket?.talk?.("m", 8000, `You have a bounty of ${reward} XP on your head!`);
            const lastPos = { x: tgt.x, y: tgt.y };
            const watchIv = setInterval(() => {
                if (tgt && !tgt.isDead) { lastPos.x = tgt.x; lastPos.y = tgt.y; return; }
                clearInterval(watchIv);
                delete global._bounties[name];
                let killer = null, minD = Infinity;
                _getAll().forEach(e => {
                    if (!e || !e.isPlayer || e.isDead || e.name === name) return;
                    const d = (e.x - lastPos.x) ** 2 + (e.y - lastPos.y) ** 2;
                    if (d < minD) { minD = d; killer = e; }
                });
                if (killer) {
                    if (killer.skill) killer.skill.score = (killer.skill.score || 0) + reward;
                    killer.socket?.talk?.("m", 8000, `BOUNTY COLLECTED! You killed ${name} and earned ${reward} XP!`);
                    _bcast(`${killer.name || "Someone"} collected the bounty on ${name}! (+${reward} XP)`, 8000);
                } else {
                    _bcast(`${name}'s bounty of ${reward} XP went uncollected.`, 6000);
                }
            }, 500);
            setTimeout(() => {
                clearInterval(watchIv);
                if (global._bounties?.[name]) {
                    delete global._bounties[name];
                    _bcast(`The bounty on ${name} has expired.`, 5000);
                }
            }, 300000);
        }
    },
    {
        command: ["orbit", "guards", "escort"],
        description: "Spawns N copies of a class that actually orbit you in a ring. Usage: $orbit [class] [count] [speed]",
        level: 2,
        run: ({ args, socket }) => {
            const body = socket.player?.body;
            if (!body) return;
            const Classes = global.Class || (typeof Class !== "undefined" ? Class : {});
            const clsName = args[0] || "crasher";
            const cls = Classes[clsName];
            if (!cls) return socket.talk("m", 3000, `Class "${clsName}" not found. Try $orbit basic 4`);
            const n        = Math.min(parseInt(args[1]) || 5, 20);
            const spd      = Math.min(parseFloat(args[2]) || 0.04, 0.2);   // radians per tick
            const orbitR   = Math.max((body.SIZE || 12) * 5, 100);
            const orbiters = [];
            for (let i = 0; i < n; i++) {
                const startAngle = (i / n) * Math.PI * 2;
                const e = new body.constructor({ x: body.x + Math.cos(startAngle) * orbitR, y: body.y + Math.sin(startAngle) * orbitR });
                e.define(cls);
                e.team = body.team;
                e.master = body;
                e.name = "";
                // Give them shooting AI but we override movement ourselves
                e.define({ CONTROLLERS: ["nearestDifferentMaster", "onlyAcceptInArc", "mapAltToFire", "canRepel"] });
                e.refreshBodyAttributes?.();
                if (e.health) e.health.amount = e.health.max || 1e9;
                e.life?.();
                orbiters.push({ e, angle: startAngle });
            }
            socket.talk("m", 3000, `${n}x ${clsName} orbiting you at radius ${Math.round(orbitR)}.`);
            const iv = setInterval(() => {
                if (body.isDead) {
                    clearInterval(iv);
                    orbiters.forEach(o => { if (!o.e.isDead) o.e.kill?.(); });
                    return;
                }
                orbiters.forEach(o => {
                    if (o.e.isDead) return;
                    o.angle += spd;
                    // Hard-set position to enforce orbit
                    o.e.x = body.x + Math.cos(o.angle) * orbitR;
                    o.e.y = body.y + Math.sin(o.angle) * orbitR;
                    // Face outward so guns fire outward
                    if (o.e.velocity) { o.e.velocity.x = 0; o.e.velocity.y = 0; }
                });
            }, 30);
            // Clean up orbit after 3 minutes
            setTimeout(() => {
                clearInterval(iv);
                orbiters.forEach(o => { if (!o.e.isDead) o.e.kill?.(); });
                if (socket.talk) socket.talk("m", 3000, "Orbit expired.");
            }, 180000);
        }
    },
    {
        command: ["rain", "meteor", "asteroid"],
        description: "Rains large meteors (shapes) down around you. Usage: $rain [count]",
        level: 2,
        run: ({ args, socket }) => {
            const body = socket.player?.body;
            if (!body) return;
            const Classes = global.Class || (typeof Class !== "undefined" ? Class : {});
            // Try several common shape/food class names
            const candidates = ["square","triangle","pentagon","crasher","food","basicFood"];
            const cls = candidates.map(k => Classes[k]).find(Boolean);
            if (!cls) return socket.talk("m", 3000, "No shape class found to use as meteors.");
            const n   = Math.min(parseInt(args[0]) || 20, 80);
            const cx  = body.x, cy = body.y;
            socket.talk("m", 3000, `${n} meteors incoming!`);
            for (let i = 0; i < n; i++) {
                setTimeout(() => {
                    try {
                        if (body.isDead) return;
                        // Spawn above the player, scattered left/right
                        const e = new body.constructor({
                            x: cx + (Math.random() - 0.5) * 1400,
                            y: cy - 900 - Math.random() * 400,
                        });
                        e.define(cls);
                        e.team = -100;
                        e.SIZE = Math.random() * 28 + 14;
                        e.coreSize = e.SIZE;
                        if (e.BODY) { e.BODY.DAMAGE = (e.BODY.DAMAGE || 1) * 3; e.BODY.DENSITY = 10; }
                        if (e.velocity) { e.velocity.x = (Math.random() - 0.5) * 8; e.velocity.y = Math.random() * 22 + 12; }
                        e.refreshBodyAttributes?.();
                        e.life?.();
                        // Auto-clean after 10 seconds
                        setTimeout(() => { if (!e.isDead) e.kill?.(); }, 10000);
                    } catch (err) { /* entity spawn error, ignore */ }
                }, i * 180);
            }
        }
    },
    {
        command: ["tiny", "smol", "shrink"],
        description: "Shrinks a target (or all) to tiny size. Usage: $tiny [name|all]",
        level: 2,
        run: ({ args, socket }) => {
            let targets = [];
            const who = args[0]?.toLowerCase?.()?.trim();
            if (!who) {
                const b = socket.player?.body; if (b) targets.push(b);
            } else if (who === "all") {
                _getAll().forEach(e => { if (e && !e.isDead && !e.isWall) targets.push(e); });
            } else {
                const f = _findPlayer(who);
                if (!f) return socket.talk("m", 3000, `"${args[0]}" not found.`);
                targets.push(f);
            }
            targets.forEach(b => { b.SIZE = 3; b.coreSize = 3; b.refreshBodyAttributes?.(); });
            socket.talk("m", 3000, `Shrunk ${targets.length} target(s).`);
        }
    },
    {
        command: ["giant", "big"],
        description: "Makes you (or a target) massive. Usage: $giant [size] [name]",
        level: 2,
        run: ({ args, socket }) => {
            let target = socket.player?.body;
            if (args[1]) { const f = _findPlayer(args[1]); if (f) target = f; }
            if (!target) return;
            const sz = Math.min(parseInt(args[0]) || 60, 250);
            target.SIZE = sz; target.coreSize = sz;
            if (target.BODY) {
                target.BODY.HEALTH  = (target.BODY.HEALTH  || 1) * (sz / 12);
                target.BODY.DAMAGE  = (target.BODY.DAMAGE  || 1) * 2;
                target.BODY.DENSITY = (target.BODY.DENSITY || 1) * 4;
            }
            target.refreshBodyAttributes?.();
            if (target.health) target.health.amount = target.health.max;
            socket.talk("m", 3000, `${target.name || "Target"} is now GIANT (size ${sz}).`);
        }
    },
    {
        command: ["nearest", "closest", "near"],
        description: "Shows info about the entity closest to you.",
        level: 0,
        run: ({ socket }) => {
            const body = socket.player?.body;
            if (!body) return;
            let tgt = null, minD = Infinity;
            _getAll().forEach(e => {
                if (!e || e === body || e.isWall || e.isGhost) return;
                const d = (e.x - body.x) ** 2 + (e.y - body.y) ** 2;
                if (d < minD) { minD = d; tgt = e; }
            });
            if (!tgt) return socket.talk("m", 3000, "Nothing nearby.");
            const dist = Math.round(Math.sqrt(minD) / 30);
            socket.talk("Em", 9000, JSON.stringify([
                "── Nearest Entity ──",
                `Name:  ${tgt.name || tgt.label || "unknown"}`,
                `Class: ${tgt.label || "?"}`,
                `Type:  ${tgt.type  || "?"}`,
                `Dist:  ~${dist} units`,
                `HP:    ${Math.round(tgt.health?.amount ?? 0)} / ${Math.round(tgt.health?.max ?? 0)}`,
                `Size:  ${tgt.SIZE  ?? "?"}`,
                `Team:  ${tgt.team  ?? "?"}`,
                `Level: ${tgt.skill?.level ?? "?"}`,
            ]));
        }
    },
    {
        command: ["stats", "mystats"],
        description: "Shows your full body stat block.",
        level: 0,
        run: ({ socket }) => {
            const body = socket.player?.body;
            if (!body) return;
            const B = body.BODY || {};
            socket.talk("Em", 12000, JSON.stringify([
                `── Stats: ${body.name || "You"} ──`,
                `Class:  ${body.label || "?"}   Level: ${body.skill?.level ?? "?"}`,
                `Size:   ${body.SIZE ?? "?"}`,
                `HP:     ${Math.round(body.health?.amount ?? 0)} / ${Math.round(body.health?.max ?? 0)}`,
                `Shield: ${Math.round(body.shield?.amount ?? 0)} / ${Math.round(body.shield?.max ?? 0)}`,
                `Speed:  ${B.SPEED?.toFixed?.(3) ?? "?"}`,
                `Damage: ${B.DAMAGE?.toFixed?.(3) ?? "?"}`,
                `Pen:    ${B.PENETRATION?.toFixed?.(3) ?? "?"}`,
                `Regen:  ${B.REGEN?.toFixed?.(3) ?? "?"}`,
                `Shield/s: ${B.SHIELD?.toFixed?.(3) ?? "?"}`,
                `FOV:    ${B.FOV?.toFixed?.(3) ?? "?"}`,
                `Density:${B.DENSITY?.toFixed?.(3) ?? "?"}`,
                `Team:   ${body.team ?? "?"}`,
            ]));
        }
    },
    {
        command: ["instamap", "quickmaze", "mapgen"],
        description: "Maze: any size you want, anchored near you. Tile: real gameplay logic (team zones, nest, etc). Usage: $instamap <type|tile_X> [size] [seconds] | list | preview <type> | clear",
        level: 2,
        run: ({ args, socket, gameManager }) => {
            try {
                const body = socket.player?.body;
                if (!body) return socket.talk("m", 3000, "You need a tank to use this!");

                const sub = (args[0] || "").toLowerCase();
                const MazeGeneratorClass = getMazeGeneratorClass();
                const room = gameManager?.room;

                if (!sub || sub === "list") {
                    const mazeNames = Object.keys(MAZE_TYPE_CODES).join(", ");
                    const tileNames = Object.keys(buildTileLayouts()).map(n => "tile_" + n).join(", ");
                    return socket.talk("Em", 14000, JSON.stringify([
                        "── Instamap types ──",
                        "Mazes (any size): " + (mazeNames || "(none)") + (MazeGeneratorClass ? "" : " [not loaded yet]"),
                        "Tiles (real logic): " + (tileNames || "(none available yet)"),
                        "Usage: $instamap <type> [size] [seconds]",
                    ]));
                }

                if (sub === "clear") {
                    const n = clearInstamap();
                    return socket.talk("m", 3000, `Cleared ${n} instamap entities.`);
                }

                if (sub === "preview") {
                    const type = (args[1] || "").toLowerCase();
                    if (!MazeGeneratorClass || MAZE_TYPE_CODES[type] === undefined) {
                        return socket.talk("m", 4000, `Unknown maze type "${type}" for preview. Try $instamap list.`);
                    }
                    const gen = new MazeGeneratorClass(MAZE_TYPE_CODES[type]);
                    const trial = gen.runTrial();
                    if (!trial) return socket.talk("m", 4000, "Could not generate a preview — try again.");
                    const lines = trial.toString().split("\n");
                    return socket.talk("Em", 16000, JSON.stringify([`── Preview: ${type} ──`, ...lines.slice(0, 40)]));
                }

                const isTile = sub.startsWith("tile_");
                const tileName = isTile ? sub.slice(5) : null;

                if (isTile && !buildTileLayouts()[tileName]) {
                    return socket.talk("m", 4000, `Unknown or unavailable tile layout "${tileName}". Try $instamap list.`);
                }
                if (!isTile && MAZE_TYPE_CODES[sub] === undefined) {
                    return socket.talk("m", 4000, `Unknown maze type "${sub}". Try $instamap list.`);
                }
                if (!isTile && !MazeGeneratorClass) {
                    return socket.talk("m", 4000, "mazeGenerator isn't loaded on this process yet — try again shortly.");
                }

                clearInstamap();
                const duration = Math.min(parseFloat(args[2]) || 0, 1800) * 1000;

                if (isTile) {
                    const sizeOverride = args[1] ? Math.min(Math.max(parseFloat(args[1]) || 0, 20), 2000) : null;
                    const result = placeTileLayout(body, tileName, room, gameManager, sizeOverride, sizeOverride, body.x, body.y);
                    if (!result || !result.activations.length) {
                        return socket.talk("m", 4000, "Generation produced nothing — try again or check the server console.");
                    }
                    global._instamapEntities = result.placed;
                    global._instamapActivations = result.activations;
                    const hasTeamTiles = result.activations.some(a => a.tickEntry);
                    socket.talk("m", 5500, `Placed tile layout "${tileName}" — ${result.activations.length} tiles (${result.placed.length} visible).` +
                        (hasTeamTiles ? " Some tiles enforce real team/zone logic." : ""));
                } else {
                    // Maze: fully caller-controlled size, no relation to any
                    // room's real tile dimensions — 5 to 20,000 world units.
                    const cellSize = Math.min(Math.max(parseFloat(args[1]) || 150, 5), 20000);
                    const placed = placeMaze(body, sub, cellSize, body.x, body.y);
                    if (!placed || !placed.length) {
                        return socket.talk("m", 4000, "Generation produced nothing — try again or check the server console.");
                    }
                    global._instamapEntities = placed;
                    global._instamapActivations = [];
                    socket.talk("m", 4000, `Placed maze "${sub}" (cellSize ${cellSize}) — ${placed.length} pieces.`);
                }

                if (duration > 0) {
                    setTimeout(() => { clearInstamap(); socket.talk?.("m", 3000, "Instamap layout expired."); }, duration);
                }
            } catch (err) {
                console.error("[instamap] error:", err);
                socket.talk("m", 5000, "instamap failed: " + err.message);
            }
        }
    },
    {
        command: ["switchmode", "gamemode", "setgamemode"],
        description: "Switches to a real gamemode config — Config reset+applied fresh, room placed at the exact shape/size/position that mode really uses. Usage: $switchmode <name> | list",
        level: 3,
        hidden: true,
        run: ({ args, socket, gameManager }) => {
            try {
                const body = socket.player?.body;
                const name = (args[0] || "").toLowerCase();
                const room = gameManager?.room;

                if (!name || name === "list") {
                    const names = discoverGamemodeConfigNames();
                    return socket.talk("Em", 14000, JSON.stringify([
                        "── Gamemode configs found on disk ──",
                        ...names.map(n => "• " + n),
                        "(instamap's maze/tile names also work here as a fallback)",
                        "Usage: $switchmode <name>",
                    ]));
                }

                const gmConfig = requireGamemodeConfig(name);
                const fallbackFlags = GAMEMODE_FLAG_MAP[name];

                if (!gmConfig && !fallbackFlags && MAZE_TYPE_CODES[name] === undefined && !buildTileLayouts()[name]) {
                    return socket.talk("m", 4000, `Unknown gamemode "${name}". Try $switchmode list.`);
                }

                resetConfigToSnapshot();
                if (gmConfig) Object.assign(Config, gmConfig);
                else if (fallbackFlags) Object.assign(Config, fallbackFlags);

                clearInstamap();

                const tileWidth = gmConfig?.map_tile_width || (room && room.tileWidth) || 150;
                const tileHeight = gmConfig?.map_tile_height || (room && room.tileHeight) || tileWidth;

                let mergedGrid = null;
                if (gmConfig && Array.isArray(gmConfig.room_setup)) {
                    const grids = gmConfig.room_setup.map(requireRoomSetupGrid).filter(Boolean);
                    if (grids.length) mergedGrid = mergeRoomGrids(grids);
                }

                let placed = [], activations = [], shapeSource = "none found";

                if (mergedGrid) {
                    // Room-centered: originX/Y = 0,0, matching tileEntity.js's
                    // real loc formula exactly (tileWidth*(col+0.5) - roomWidth/2
                    // is algebraically the same as what placeTileLayout computes
                    // when origin is 0 and roomWidth == cols*tileWidth).
                    const result = placeTileLayout(body, mergedGrid, room, gameManager, tileWidth, tileHeight, 0, 0);
                    if (result) {
                        placed = result.placed;
                        activations = result.activations;
                        shapeSource = "room_setup (" + gmConfig.room_setup.join(" + ") + "), " +
                            result.cols + "x" + result.rows + " tiles @ " + tileWidth + "x" + tileHeight;
                        if (room) {
                            room.tileWidth = tileWidth;
                            room.tileHeight = tileHeight;
                            room.width = result.cols * tileWidth;
                            room.height = result.rows * tileHeight;
                        }
                    }
                } else if (gmConfig && typeof gmConfig.maze_type === "number") {
                    placed = placeMaze(body, gmConfig.maze_type, tileWidth, 0, 0) || [];
                    shapeSource = "maze_type " + gmConfig.maze_type + " (no room_setup file resolved — approximate shape)";
                } else if (MAZE_TYPE_CODES[name] !== undefined) {
                    const span = (room && room.width) || 6000;
                    const cellSize = Math.max(80, Math.min(300, span / 30));
                    placed = placeMaze(body, name, cellSize, 0, 0) || [];
                    shapeSource = "maze by name (no gamemode config file found)";
                } else if (buildTileLayouts()[name]) {
                    const result = placeTileLayout(body, name, room, gameManager, tileWidth, tileHeight, 0, 0);
                    if (result) { placed = result.placed; activations = result.activations; shapeSource = "tile layout by name (no gamemode config file found)"; }
                }

                global._instamapEntities = placed;
                global._instamapActivations = activations;

                const msg = `🔁 Mode switched to "${name}"!`;
                if (typeof _bcast === "function") _bcast(msg, 6000);
                else if (gameManager?.socketManager?.broadcast) gameManager.socketManager.broadcast(msg);

                socket.talk("m", 7000, `Switched to "${name}". Shape: ${shapeSource}. ${placed.length} entities placed, room-centered.` +
                    (gmConfig ? " Config reset + applied from the real gamemode file." : " No gamemode config file found for this name — used fallback only."));

            } catch (err) {
                console.error("[switchmode] error:", err);
                socket.talk("m", 5000, "Switch failed: " + err.message);
            }
        }
    },
    {
        command: ["sign", "billboard", "notice"],
        description: "Places a persistent, player-proof sign with custom text. Usage: $sign <text> | list | remove <id> | clear",
        level: 2,
        run: ({ args, socket }) => {
            try {
                const body = socket.player?.body;
                if (!body) return socket.talk("m", 3000, "You need a tank to use this!");

                const sub = (args[0] || "").toLowerCase();

                if (sub === "list") {
                    if (!global._signs.length) return socket.talk("m", 4000, "No signs placed yet.");
                    return socket.talk("Em", 14000, JSON.stringify([
                        "── Active signs ──",
                        ...global._signs.map(s => `#${s.id}: "${s.text}" (by ${s.owner || "?"})`),
                    ]));
                }

                if (sub === "remove") {
                    const id = parseInt(args[1]);
                    const idx = global._signs.findIndex(s => s.id === id);
                    if (idx === -1) return socket.talk("m", 3000, `No sign with id ${id}. Use $sign list to see ids.`);
                    const s = global._signs[idx];
                    if (s.entity && !s.entity.isDead) s.entity.kill();
                    global._signs.splice(idx, 1);
                    return socket.talk("m", 3000, `Removed sign #${id}.`);
                }

                if (sub === "clear") {
                    let n = 0;
                    for (const s of global._signs) {
                        if (s.entity && !s.entity.isDead) { s.entity.kill(); n++; }
                    }
                    global._signs = [];
                    return socket.talk("m", 3000, `Cleared ${n} sign(s).`);
                }

                const text = args.join(" ").trim();
                if (!text) return socket.talk("m", 3000, "Usage: $sign <text> | $sign list | $sign remove <id> | $sign clear");
                if (text.length > 120) return socket.talk("m", 3000, "Sign text is limited to 120 characters.");

                const e = new body.constructor({ x: body.x, y: body.y });
                e.define("floatingSign_ADDON");
                e.team = TEAM_ROOM;
                e.name = text;
                e.displayName = true;
                e.facing = 0;
                if (e.health) { e.health.amount = 1e9; e.health.max = 1e9; }
                if (e.shield) { e.shield.amount = 1e9; e.shield.max = 1e9; }
                e.life();

                const id = (global._signs.reduce((m, s) => Math.max(m, s.id), 0) || 0) + 1;
                global._signs.push({ id, entity: e, text, owner: body.name || "Admin", x: body.x, y: body.y });

                socket.talk("m", 4000, `Sign #${id} placed: "${text}"`);
            } catch (err) {
                console.error("[sign] error:", err);
                socket.talk("m", 4000, "Failed to place sign: " + err.message);
            }
        }
    },
    {
        command: ["aura", "surround"],
        description: "Spawns a ring of entities at your position that follow you. Usage: $aura [class] [count]",
        level: 2,
        run: ({ args, socket }) => {
            const body = socket.player?.body;
            if (!body) return;
            const Classes = global.Class || (typeof Class !== "undefined" ? Class : {});
            const clsName = args[0] || "crasher";
            const cls = Classes[clsName];
            if (!cls) return socket.talk("m", 3000, `Class "${clsName}" not found.`);
            const n = Math.min(parseInt(args[1]) || 6, 24);
            for (let i = 0; i < n; i++) {
                const a = (i / n) * Math.PI * 2;
                const r = Math.max((body.SIZE || 12) * 4, 80);
                const e = new body.constructor({ x: body.x + Math.cos(a) * r, y: body.y + Math.sin(a) * r });
                e.define(cls); e.master = body; e.team = body.team;
                e.define({ CONTROLLERS: ["hangOutNearMaster", "nearestDifferentMaster", "canRepel"] });
                e.refreshBodyAttributes?.(); e.life?.();
            }
            socket.talk("m", 3000, `${n}× ${clsName} summoned around you.`);
        }
    },
    {
        command: ["swarm", "crashers", "horde"],
        description: "Spawns a swarm of crashers loyal to you. Usage: $swarm [count] [class]",
        level: 2,
        run: ({ args, socket }) => {
            const body = socket.player?.body;
            if (!body) return;
            const Classes = global.Class || (typeof Class !== "undefined" ? Class : {});
            const clsName = args[1] || "crasher";
            const cls = Classes[clsName] || Classes.crasher || Classes.triangle || Classes.square;
            if (!cls) return socket.talk("m", 3000, "No swarm class found.");
            const n = Math.min(parseInt(args[0]) || 25, 80);
            for (let i = 0; i < n; i++) {
                const a = Math.random() * Math.PI * 2, r = Math.random() * 350 + 80;
                const e = new body.constructor({ x: body.x + Math.cos(a) * r, y: body.y + Math.sin(a) * r });
                e.define(cls); e.master = body; e.team = body.team;
                e.define({ CONTROLLERS: ["nearestDifferentMaster", "hangOutNearMaster"] });
                e.refreshBodyAttributes?.(); e.life?.();
            }
            socket.talk("m", 3000, `Swarm of ${n} ${clsName} deployed.`);
        }
    },
    {
        command: ["bodyguard", "protector"],
        description: "Spawns a powerful AI guardian that follows and fights for you. Usage: $bodyguard [class]",
        level: 1,
        run: ({ args, socket }) => {
            const body = socket.player?.body;
            if (!body) return;
            const Classes = global.Class || (typeof Class !== "undefined" ? Class : {});
            const options = ["developer", "overlord", "battleship", "factory", "fighter"].filter(k => Classes[k]);
            const cls = (args[0] && Classes[args[0]]) || Classes[options[0]];
            if (!cls) return socket.talk("m", 3000, "No guardian class found.");
            const g = new body.constructor({ x: body.x + 120, y: body.y + 120 });
            g.define(cls); g.master = body; g.team = body.team;
            g.name = `${body.name || "Admin"}'s Guard`;
            g.define({
                CONTROLLERS: ["hangOutNearMaster", "nearestDifferentMaster", "canRepel"],
                BODY: { HEALTH: 1e9, DAMAGE: 50, SPEED: 3, SHIELD: 1e9, REGEN: 1e6 },
            });
            g.refreshBodyAttributes?.();
            if (g.health) g.health.amount = g.health.max;
            g.life?.();
            socket.talk("m", 3000, `Guardian (${cls.LABEL || args[0] || "?"}) spawned.`);
        }
    },
    {
        command: ["godmode", "invincible"],
        description: "Toggles godmode — extreme stats. Run again to turn off.",
        level: 2,
        run: ({ socket }) => {
            const body = socket.player?.body;
            if (!body) return;
            if (body._godmode) {
                body._godmode = false;
                const S = body._godSaved || {};
                if (body.BODY) Object.assign(body.BODY, S);
                body.refreshBodyAttributes?.();
                return socket.talk("m", 3000, "Godmode OFF.");
            }
            body._godSaved = {};
            ["HEALTH","DAMAGE","SHIELD","REGEN","SPEED"].forEach(k => {
                body._godSaved[k] = body.BODY?.[k] ?? 1;
            });
            body._godmode = true;
            if (body.BODY) {
                body.BODY.HEALTH = 1e9; body.BODY.SHIELD = 1e9; body.BODY.REGEN = 1e6;
                body.BODY.DAMAGE = (body.BODY.DAMAGE || 1) * 3;
                body.BODY.SPEED  = (body.BODY.SPEED  || 1) * 2;
            }
            body.refreshBodyAttributes?.();
            if (body.health) body.health.amount = body.health.max;
            if (body.shield) body.shield.amount = body.shield.max;
            socket.talk("m", 3000, "GODMODE ON.");
        }
    },
    {
        command: ["listbounties", "bounties"],
        description: "Lists all active bounties on the server.",
        level: 0,
        run: ({ socket }) => {
            const b = global._bounties || {};
            const keys = Object.keys(b);
            if (!keys.length) return socket.talk("m", 4000, "No active bounties right now.");
            socket.talk("Em", 10000, JSON.stringify(["── Active Bounties ──", ...keys.map(k => `• ${k}: ${b[k]} XP`)]));
        }
    },
    {
        command: ["rename", "name"],
        description: "Changes your in-game name. Usage: $rename <newname>",
        level: 0,
        run: ({ args, socket }) => {
            const body = socket.player?.body;
            if (!body) return;
            if (!args[0]) return socket.talk("m", 3000, "Usage: $rename <newname>");
            const n = args.join(" ").slice(0, 32);
            body.name = n;
            if (socket.player) socket.player.name = n;
            socket.talk("m", 3000, `Name set to "${n}".`);
        }
    },
    {
        command: ["color", "colour", "hue"],
        description: "Changes your tank's colour. Usage: $color [0-35 | red/blue/gold/etc]",
        level: 0,
        run: ({ args, socket }) => {
            const body = socket.player?.body;
            if (!body) return;
            const named = { red:2, blue:6, green:4, yellow:14, orange:3, purple:11, teal:8, pink:12, white:22, grey:18, gray:18, black:19, gold:14, cyan:7, magenta:12 };
            let c = parseInt(args[0]);
            if (isNaN(c)) c = named[args[0]?.toLowerCase()] ?? 0;
            c = Math.max(0, Math.min(35, c));
            body.color = c;
            if (socket.player) socket.player.color = c;
            body.define({ COLOR: c });
            socket.talk("m", 3000, `Colour → ${args[0] || c}`);
        }
    },
    {
        command: ["detonate", "selfdestruct"],
        description: "You explode: kills you and launches nearby entities with massive force.",
        level: 1,
        run: ({ socket }) => {
            const body = socket.player?.body;
            if (!body) return;
            let count = 0;
            (global.entities||[]).forEach(e => {
                if (!e || e === body || e.isWall) return;
                const dx = e.x-body.x, dy = e.y-body.y;
                const dist = Math.sqrt(dx*dx+dy*dy)||1;
                if (dist<600) {
                    const f = (600-dist)/8;
                    e.velocity.x += (dx/dist)*f; e.velocity.y += (dy/dist)*f;
                    if (e.health) e.health.amount -= 200*(1-dist/600);
                    count++;
                }
            });
            socket.talk("m", 2000, "BOOM!");
            setTimeout(() => body.kill?.(), 100);
        }
    },
    {
        command: ["swarm", "crashers", "horde"],
        description: "Spawns a horde of crashers with you as master. Usage: $swarm [count]",
        level: 2,
        run: ({ args, socket }) => {
            const body = socket.player?.body;
            if (!body) return;
            const Classes = global.Class || Class;
            const cls = Classes.crasher || Classes.triangle || Classes.square;
            if (!cls) return socket.talk("m", 3000, "No swarm class found.");
            const n = Math.min(parseInt(args[0]) || 20, 6000000);
            for (let i = 0; i < n; i++) {
                const a = Math.random()*Math.PI*2, r = Math.random()*300+80;
                const e = new body.constructor({ x: body.x+Math.cos(a)*r, y: body.y+Math.sin(a)*r });
                e.define(cls);
                e.master = body; e.team = body.team;
                e.define({ CONTROLLERS: ["nearestDifferentMaster", "hangOutNearMaster"] });
                e.refreshBodyAttributes?.(); e.life?.();
            }
            socket.talk("m", 3000, `Swarm of ${n} spawned!`);
        }
    },
    {
        command: ["maze", "labyrinth"],
        description: "Generates a random wall maze around your position. Usage: $maze [size]",
        level: 2,
        run: ({ args, socket }) => {
            const body = socket.player?.body;
            if (!body) return;
            const size = Math.min(parseInt(args[0]) || 8, 20);
            const cell = 80;
            const walls = [];
            for (let x = -size; x <= size; x++) {
                for (let y = -size; y <= size; y++) {
                    if (Math.abs(x)===size || Math.abs(y)===size || (Math.random()<0.3 && !(x===0&&Math.abs(y)<2))) {
                        const w = new body.constructor({ x: body.x+x*cell, y: body.y+y*cell });
                        w.define("wall"); w.team=-100; w.SIZE=cell*0.55; w.life?.();
                        walls.push(w);
                    }
                }
            }
            socket.talk("m", 3000, `Maze built (${size}x${size}) — ${walls.length} walls.`);
            setTimeout(() => { walls.forEach(w => { if(!w.isDead) w.kill?.(); }); if(socket.talk) socket.talk("m",3000,"Maze cleared."); }, 60000);
        }
    },
    {
        command: ["mirror", "reflect", "flip"],
        description: "Teleports you to the mirrored coordinates across the map centre.",
        level: 1,
        run: ({ socket }) => {
            const body = socket.player?.body;
            if (!body) return;
            let cx = 0, cy = 0;
            const R = typeof room!=="undefined"?room:global.room||null;
            if (R?.width && R?.height) { cx=R.width/2; cy=R.height/2; }
            else if (R?.x && R?.y) { cx=(R.x[0]+R.x[1])/2; cy=(R.y[0]+R.y[1])/2; }
            const newX = 2*cx - body.x;
            const newY = 2*cy - body.y;
            body.x = newX; body.y = newY;
            if (body.velocity) { body.velocity.x = 0; body.velocity.y = 0; }
            socket.talk("m", 3000, `Mirrored to (${Math.round(newX/30)}, ${Math.round(newY/30)}).`);
        }
    },
    {
        command: ["wipe", "clear", "clean"],
        description: "Destroys all non-player entities (shapes, bosses, bullets) from the map.",
        level: 3,
        run: ({ socket }) => {
            const body = socket.player?.body;
            let count = 0;
            (global.entities||[]).forEach(e => {
                if (!e || e.isPlayer || e.isWall || e.isGhost || e === body) return;
                e.kill?.(); count++;
            });
            socket.talk("m", 3000, `Wiped ${count} entities from the map.`);
        }
    },

    {
        command: ["spin", "twirl"],
        description: "Makes you spin in place at speed N for T seconds. Usage: $spin [speed] [seconds]",
        level: 0,
        run: ({ args, socket }) => {
            const body = socket.player?.body;
            if (!body) return;
            const spd = Math.min(parseFloat(args[0]) || 5, 30);
            const dur = Math.min(parseFloat(args[1]) || 5, 30)*1000;
            body.define({ FACING_TYPE: ["spin", { speed: spd/100 }] });
            socket.talk("m", 3000, `Spinning for ${dur/1000}s!`);
            setTimeout(() => {
                if (body.isDead) return;
                body.define({ FACING_TYPE: "toTarget" });
                if (socket.talk) socket.talk("m", 3000, "Stopped spinning.");
            }, dur);
        }
    },
    {
        command: ["spaghettify", "stretch", "elongate"],
        description: "Stretches all entities to ridiculous proportions for 10s.",
        level: 2,
        run: ({ socket }) => {
            const targets = [];
            (global.entities||[]).forEach(e=>{
                if(!e||e.isWall||e.isGhost)return;
                targets.push({e,sz:e.SIZE});
                e.SIZE = (e.SIZE||12)*8;
                e.coreSize = e.SIZE;
            });
            socket.talk("m",3000,"Spaghettification in progress...");
            (global.sockets?.players||[]).forEach(s=>s?.talk?.("m",3000,"Everything is noodles now."));
            setTimeout(()=>{
                targets.forEach(({e,sz})=>{ if(!e.isDead){e.SIZE=sz;e.coreSize=sz;} });
                if(socket.talk) socket.talk("m",3000,"Entities restored.");
            },10000);
        }
    },
    {
        command: ["kamikaze", "missile", "launch"],
        description: "Launches YOU as a giant homing missile at the nearest enemy.",
        level: 1,
        run: ({ socket }) => {
            const body = socket.player?.body;
            if(!body) return;
            let tgt=null,minD=Infinity;
            (global.entities||[]).forEach(e=>{
                if(!e||e===body||e.isWall||e.isGhost||e.team===body.team)return;
                const d=(e.x-body.x)**2+(e.y-body.y)**2;
                if(d<minD){minD=d;tgt=e;}
            });
            if(!tgt) return socket.talk("m",3000,"No enemy target found.");
            body.SIZE = (body.SIZE||12)*4;
            if(body.BODY){body.BODY.SPEED=(body.BODY.SPEED||1)*8;body.BODY.DAMAGE=1e9;body.BODY.DENSITY=(body.BODY.DENSITY||1)*10;}
            body.refreshBodyAttributes?.();
            socket.talk("m",3000,`KAMIKAZE toward ${tgt.label||"target"}!`);
            const iv=setInterval(()=>{
                if(body.isDead){clearInterval(iv);return;}
                const dx=tgt.x-body.x,dy=tgt.y-body.y,d=Math.sqrt(dx*dx+dy*dy)||1;
                body.velocity.x+=(dx/d)*25;body.velocity.y+=(dy/d)*25;
                if(d<80){clearInterval(iv);body.kill?.();}
            },30);
        }
    },
    {
        command: ["dimension", "void", "blink"],
        description: "Every entity has a 40% chance to instantly vanish to a random map location.",
        level: 2,
        run: ({ socket }) => {
            let cx=0,cy=0,rw=5000,rh=5000;
            const R=typeof room!=="undefined"?room:global.room||null;
            if(R?.width&&R?.height){cx=R.width/2;cy=R.height/2;rw=R.width;rh=R.height;}
            let count=0;
            (global.entities||[]).forEach(e=>{
                if(!e||e.isWall||e.isGhost||Math.random()>0.4)return;
                e.x=cx+(Math.random()-0.5)*rw*0.85;
                e.y=cy+(Math.random()-0.5)*rh*0.85;
                count++;
            });
            (global.sockets?.players||[]).forEach(s=>s?.talk?.("m",3000,"Dimensional rift!"));
            socket.talk("m",3000,`${count} entities blinked to random positions.`);
        }
    },
    {
        command: ["deathmatch", "ffa", "war"],
        description: "Sets ALL entities to different teams so everyone fights everyone.",
        level: 3,
        run: ({ socket }) => {
            let i=0;
            (global.entities||[]).forEach(e=>{
                if(!e||e.isWall||e.isGhost)return;
                e.team=-200-i; i++;
            });
            (global.sockets?.players||[]).forEach(s=>s?.talk?.("m",5000,"⚔DEATHMATCH — Everyone fights everyone!"));
            socket.talk("m",3000,`War declared. ${i} entities split into ${i} teams.`);
        }
    },
    {
        command: ["earthquake",],
        description: "Massive quake: shakes entities AND shatters wall entities.",
        level: 2,
        run: ({ args, socket }) => {
            const str=Math.min(parseFloat(args[0])||25,100);
            let shook=0,broken=0;
            (global.entities||[]).forEach(e=>{
                if(!e||e.isGhost)return;
                if(e.isWall||e.type==="wall"){
                    if(Math.random()<0.35){e.kill?.();broken++;}
                    return;
                }
                e.velocity.x+=(Math.random()-0.5)*str*2.5;
                e.velocity.y+=(Math.random()-0.5)*str*2.5;
                shook++;
            });
            (global.sockets?.players||[]).forEach(s=>s?.talk?.("m",4000,`EARTHQUAKE! Magnitude ${str}`));
            socket.talk("m",3000,`Shook ${shook} entities, broke ${broken} walls.`);
        }
    },
    {
        command: ["protector", "guardian"],
        description: "Spawns a powerful guardian tank that follows and fights for you.",
        level: 1,
        run: ({ args, socket }) => {
            const body=socket.player?.body;
            if(!body)return;
            const Classes=global.Class||Class;
            const options=["developer","overlord","battleship","factory","fighter"].filter(k=>Classes[k]);
            const cls=Classes[args[0]]||Classes[options[Math.floor(Math.random()*options.length)]];
            if(!cls)return socket.talk("m",3000,"No guardian class found.");
            const g=new body.constructor({x:body.x+100,y:body.y+100});
            g.define(cls);g.master=body;g.team=body.team;
            g.name=`${body.name||"Admin"}'s Guardian`;
            g.define({CONTROLLERS:["hangOutNearMaster","nearestDifferentMaster","canRepel"],BODY:{HEALTH:1e9,DAMAGE:50,SPEED:3,SHIELD:1e9,REGEN:1e6}});
            g.refreshBodyAttributes?.();if(g.health)g.health.amount=g.health.max;g.life?.();
            socket.talk("m",3000,`Guardian spawned (${cls.LABEL||args[0]||"?"}).`);
        }
    },
    {
        command: ["gravitywell"],
        description: "Creates a persistent gravity well at your position for N seconds. Usage: $gravitywell [seconds] [power]",
        level: 2,
        run: ({ args, socket }) => {
            const body=socket.player?.body;
            if(!body)return;
            const dur=Math.min(parseFloat(args[0])||10,60)*1000;
            const power=Math.min(parseFloat(args[1])||8,40);
            const wx=body.x,wy=body.y;
            socket.talk("m",3000,`Gravity well at your position for ${dur/1000}s!`);
            const iv=setInterval(()=>{
                (global.entities||[]).forEach(e=>{
                    if(!e||e===body||e.isWall||e.isGhost)return;
                    const dx=wx-e.x,dy=wy-e.y,d=Math.sqrt(dx*dx+dy*dy)||1;
                    if(d<1200){e.velocity.x+=(dx/d)*power*(1200-d)/300;e.velocity.y+=(dy/d)*power*(1200-d)/300;}
                    if(d<60)e.kill?.();
                });
            },50);
            setTimeout(()=>clearInterval(iv),dur);
        }
    },
    {
        command: ["giant2", "colossus"],
        description: "Makes every entity on the map enormous simultaneously.",
        level: 3,
        run: ({ args, socket }) => {
            const mul=Math.min(parseFloat(args[0])||5,20);
            const dur=Math.min(parseFloat(args[1])||10,30)*1000;
            const saved=[];
            (global.entities||[]).forEach(e=>{
                if(!e||e.isWall||e.isGhost)return;
                saved.push({e,sz:e.SIZE});
                e.SIZE=(e.SIZE||12)*mul;e.coreSize=e.SIZE;
            });
            (global.sockets?.players||[]).forEach(s=>s?.talk?.("m",dur,`GIANT MODE ×${mul}!`));
            setTimeout(()=>{
                saved.forEach(({e,sz})=>{if(!e.isDead){e.SIZE=sz;e.coreSize=sz;}});
                if(socket.talk)socket.talk("m",3000,"Normal size restored.");
            },dur);
        }
    },
    {
        command: ["roulette", "gamble", "random2"],
        description: "Randomly picks ONE crazy effect from all effects and applies it.",
        level: 1,
        run: ({ socket }) => {
            const body=socket.player?.body;
            if(!body)return;
            const effects=[
                ()=>{ body.SIZE=(body.SIZE||12)*6;socket.talk("m",4000,"GIANT!"); },
                ()=>{ body.SIZE=2;socket.talk("m",4000,"Tiny..."); },
                ()=>{ if(body.BODY){body.BODY.SPEED=(body.BODY.SPEED||1)*10;body.refreshBodyAttributes?.();}socket.talk("m",4000,"WARP SPEED!");setTimeout(()=>{if(body.BODY&&!body.isDead){body.BODY.SPEED=(body.BODY.SPEED||10)/10;body.refreshBodyAttributes?.();}},8000); },
                ()=>{ (global.entities||[]).forEach(e=>{if(e&&!e.isWall&&!e.isGhost&&!e.isPlayer){e.velocity.x+=(Math.random()-0.5)*60;e.velocity.y+=(Math.random()-0.5)*60;}});socket.talk("m",4000,"Tremor!"); },
                ()=>{ if(body.health){body.health.amount=body.health.max||1e9;}if(body.shield){body.shield.amount=body.shield.max||1e9;}socket.talk("m",4000,"Full heal!"); },
                ()=>{ body.define({COLOR:Math.floor(Math.random()*36)});socket.talk("m",4000,"New colour!"); },
                ()=>{ if(body.BODY){body.BODY.DAMAGE=(body.BODY.DAMAGE||1)*5;body.refreshBodyAttributes?.();}socket.talk("m",4000,"POWER SURGE!");setTimeout(()=>{if(body.BODY&&!body.isDead){body.BODY.DAMAGE=(body.BODY.DAMAGE||5)/5;body.refreshBodyAttributes?.();}},10000); },
                ()=>{ body.x+=(Math.random()-0.5)*2000;body.y+=(Math.random()-0.5)*2000;socket.talk("m",4000,"Random teleport!"); },
            ];
            effects[Math.floor(Math.random()*effects.length)]();
        }
    },
    {
        command: ["assassin", "hunter", "stalker"],
        description: "Spawns an invisible fast AI that hunts a specific player. Usage: $assassin [playername]",
        level: 3,
        run: ({ args, socket }) => {
            const body=socket.player?.body;
            if(!body)return;
            const who=args.join(" ").toLowerCase();
            const Classes=global.Class||Class;
            const cls=Classes.assassin||Classes.ranger||Classes.stalker;
            if(!cls)return socket.talk("m",3000,"Assassin class not found.");
            const tgt=who?[...(global.entities||[])].find(e=>e?.isPlayer&&!e.isDead&&e.name?.toLowerCase()===who):null;
            const a=new body.constructor({x:body.x+(Math.random()-0.5)*600,y:body.y+(Math.random()-0.5)*600});
            a.define(cls);a.team=-300;
            if(tgt){a.master=tgt;a.define({CONTROLLERS:["nearestDifferentMaster","mapTargetToGoal"]});}
            a.define({BODY:{SPEED:5,HEALTH:1e9,DAMAGE:100},INVISIBLE:[0.05,0]});
            a.refreshBodyAttributes?.();a.life?.();
            socket.talk("m",3000,`Assassin spawned${tgt?` targeting ${tgt.name}`:""}!`);
        }
    },
    {
        command: ["recall", "home", "return"],
        description: "Teleports you back to the spawn centre of the map.",
        level: 0,
        run: ({ socket }) => {
            const body = socket.player?.body;
            if (!body) return;
            let cx = 0, cy = 0;
            const R = typeof room!=="undefined"?room:global.room||null;
            if (R?.width && R?.height) { cx=R.width/2; cy=R.height/2; }
            body.x = cx; body.y = cy;
            if (body.velocity) { body.velocity.x=0; body.velocity.y=0; }
            socket.talk("m", 3000, "Recalled to map centre.");
        }
    },
    {
        command: ["snap"],
        description: "Erase exactly 50% of all entities. Usage: $snap",
        level: 2,
        run: ({ socket }) => {
            try {
                const body = socket.player?.body;
                if (!body || !body.hasGauntlet) return socket.talk("m", 3000, "You lack the stones.");

                // 1. GET ALL ENTITIES INTO A TARGETABLE ARRAY
                const entitySource = global.entities || (typeof entities !== 'undefined' ? entities : null);
                if (!entitySource) throw new Error("Entity list not found.");

                // Convert to Array and filter out things we MUST NOT kill
                let targets = [];
                entitySource.forEach(e => {
                    if (e && e !== body && !e.isWall && !e.isGhost) {
                        targets.push(e);
                    }
                });

                // 2. CALCULATE EXACTLY 50%
                const totalToKill = Math.floor(targets.length / 2);
                
                // 3. SHUFFLE THE ARRAY (To make the 50% truly random)
                targets.sort(() => Math.random() - 0.5);

                // 4. THE BROADCAST
                const playerList = (global.sockets && global.sockets.players) || (typeof sockets !== 'undefined' ? sockets.players : []);
                for (let s of playerList) if (s && s.talk) s.talk("m", 5000, "🤌 *SNAP*");

                // 5. EXECUTE THE HALF
                let erasedCount = 0;
                for (let i = 0; i < totalToKill; i++) {
                    let e = targets[i];
                    if (e) {
                        // Use destroy for maximum speed/low lag
                        if (typeof e.kill === 'function') e.kill();
                        else if (typeof e.destroy === 'function') e.destroy();
                        erasedCount++;
                    }
                }

                socket.talk("m", 5000, `Perfectly balanced. ${erasedCount} entities have ceased to exist.`);

            } catch (err) {
                console.error("SNAP FATAL ERROR:", err);
                if (socket && socket.talk) socket.talk("m", 5000, "Snap Failed: " + err.message);
            }
        }
    },
    {        command: ["tp", "teleport"],
        description: "Teleport to coordinates. Usage: $ tp [x] [y]",
        level: 2,
        hidden: true,
        run: ({ args, socket }) => {
            let body = socket.player?.body;
            let x = parseFloat(args[0]) * 30; // Multiply by 30 to match grid units
            let y = parseFloat(args[1]) * 30;

            if (isNaN(x) || isNaN(y)) {
                return socket.talk("m", 4_000, "Usage: $ tp 10 10");
            }

            body.x = x;
            body.y = y;
            socket.talk("m", 3_000, `Teleported to ${args[0]}, ${args[1]}`);
        }
    },
    {
        command: ["smite", "killnear"],
        description: "Instantly destroys the entity closest to you.",
        level: 2,
        hidden: true,
        run: ({ socket }) => {
            let body = socket.player?.body;
            let nearest = null;
            let minDist = Infinity;

            for (let entity of entities.values()) {
                if (entity.id === body.id || entity.type === 'wall') continue;
                let dist = Math.sqrt(Math.pow(body.x - entity.x, 2) + Math.pow(body.y - entity.y, 2));
                if (dist < minDist) {
                    minDist = dist;
                    nearest = entity;
                }
            }

            if (nearest && minDist < 500) {
                nearest.kill();
                socket.talk("m", 3_000, `⚡ Smited ${nearest.label || "entity"}!`);
            } else {
                socket.talk("m", 3_000, "Nothing close enough to smite.");
            }
        }
    },
    {
        command: ["vanish", "ghost"],
        description: "Toggles invisibility.",
        level: 2,
        hidden: true,
        run: ({ socket }) => {
            let body = socket.player?.body;
            body.alpha = (body.alpha === 1 || body.alpha === undefined) ? 0.1 : 1;
            socket.talk("m", 4_000, body.alpha < 1 ? "You have vanished..." : "You are visible!");
        }
    },
    {
        command: ["vortex", "pull"],
        description: "Creates a gravity well that pulls nearby entities toward you. Usage: $ vortex [power]",
        level: 2,
        hidden: true,
        run: ({ socket, args }) => {
            let body = socket.player?.body;
            if (!body) return socket.talk("m", 3_000, "You need to be alive to use the Vortex!");

            // Power determines how strong the pull is. Default to 2 if not specified.
            let power = parseFloat(args[0]) || 5;
            let range = 600; // How far away entities can be to feel the pull

            // The 'entities' collection is globally available in this engine
            for (let entity of entities.values()) {
                // Don't pull yourself or static walls
                if (entity.id === body.id || entity.type === 'wall') continue;

                let dx = body.x - entity.x;
                let dy = body.y - entity.y;
                let distance = Math.sqrt(dx * dx + dy * dy);

                // Only pull things within range, but not so close they glitch inside you
                if (distance < range && distance > 20) {
                    // Calculate direction vector and apply velocity
                    // Power is divided by distance so things closer get pulled harder
                    entity.velocity.x += (dx / distance) * power;
                    entity.velocity.y += (dy / distance) * power;
                }
            }

            socket.talk("m", 3_000, `Vortex at power ${power}!`);
        }
    },
    {        command: ["singularity", "blackhole"],
        description: "A lethal gravity well that shrinks and consumes nearby objects.",
        level: 2,
        run: ({ socket }) => {
            let body = socket.player?.body;
            let duration = 10000; // 10 seconds
            let range = 800;

            let wellInterval = setInterval(() => {
                if (body.isDead) return clearInterval(wellInterval);

                for (let entity of entities.values()) {
                    if (entity.id === body.id || entity.type === 'wall') continue;

                    let dx = body.x - entity.x;
                    let dy = body.y - entity.y;
                    let dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < range) {
                        // Stronger pull the closer they get
                        let force = (range - dist) / 50;
                        entity.velocity.x += (dx / dist) * force;
                        entity.velocity.y += (dy / dist) * force;

                        // Shrink the entity as it gets closer
                        if (dist < 100 && entity.SIZE > 5) {
                            entity.SIZE *= 0.95;
                        }
                        
                        // Consume the entity
                        if (dist < 30) entity.kill();
                    }
                }
            }, 50);

            setTimeout(() => clearInterval(wellInterval), duration);
            socket.talk("m", 4000, "The Singularity has opened...");
        }
    },
    {
        command: ["build", "structure"],
        description: "Builds a structure. Usage: $ build [circle/square] [size]",
        level: 2,
        run: ({ args, socket, gameManager }) => {
            let body = socket.player?.body;
            let mode = args[0] || "circle";
            let size = parseInt(args[1]) || 5;
            let spacing = 45;

            if (mode === "circle") {
                let steps = size * 4;
                for (let i = 0; i < steps; i++) {
                    let theta = (i / steps) * Math.PI * 2;
                    let x = body.x + Math.cos(theta) * (size * spacing);
                    let y = body.y + Math.sin(theta) * (size * spacing);
                    gameManager.addEntity("wall", x, y).team = body.team;
                }
            } else if (mode === "square") {
                for (let x = -size; x <= size; x++) {
                    for (let y = -size; y <= size; y++) {
                        // Only build the perimeter (hollow square)
                        if (Math.abs(x) === size || Math.abs(y) === size) {
                            gameManager.addEntity("wall", body.x + x * spacing, body.y + y * spacing).team = body.team;
                        }
                    }
                }
            }
            socket.talk("m", 4000, `Constructed a ${size}-scale ${mode}!`);
        }
    },
    {        command: ["copyturrets"],
        description: "Copies turrets from the nearest tank. Usage: $copyturrets",
        level: 2,
        run: ({ socket }) => {
            try {
                const body = socket.player?.body;
                if (!body) return;

                let nearest = null;
                let minDist = Infinity;
                const entityList = typeof entities !== 'undefined' ? entities.values() : [];

                for (let e of entityList) {
                    if (!e || e.id === body.id || e.isGhost || e.type === "wall") continue;
                    
                    // Target anything that looks like a tank or boss
                    if (e.type === 'tank' || e.isPlayer || e.isBoss || e.player) {
                        let distSq = Math.pow(e.x - body.x, 2) + Math.pow(e.y - body.y, 2);
                        if (distSq < minDist) {
                            minDist = distSq;
                            nearest = e;
                        }
                    }
                }

                if (!nearest) return socket.talk("m", 3000, "No targets found nearby.");

                // SCAN BOTH PLACES: The blueprint (TURRETS) and the live list (turrets)
                let rawTurrets = nearest.TURRETS || nearest.turrets || [];
                
                // If it's the live list, we need to extract the definition from each live turret
                if (rawTurrets.length === 0) {
                    return socket.talk("m", 4000, `Found ${nearest.label || 'target'}, but no turret data was found.`);
                }

                let copiedTurrets = [];
                let limit = Math.min(rawTurrets.length, 25);

                for (let i = 0; i < limit; i++) {
                    let t = rawTurrets[i];
                    if (!t) continue;

                    // This part is the "Secret Sauce":
                    // If 't' is a live entity, we grab its 'raw' definition.
                    // If 't' is just a definition, we use it directly.
                    let definition = t.def || t; 
                    
                    if (definition.POSITION || t.POSITION) {
                        copiedTurrets.push({
                            POSITION: definition.POSITION || t.POSITION,
                            TYPE: definition.TYPE || t.TYPE || t.shape || "autoTurret"
                        });
                    }
                }

                if (copiedTurrets.length === 0) {
                    return socket.talk("m", 4000, "Could not extract valid turret blueprints.");
                }

                // Apply to you
                body.define({ TURRETS: copiedTurrets });
                
                // Force a rebuild of the tank's guns/turrets
                if (typeof body.setupTurrets === 'function') body.setupTurrets(copiedTurrets);
                if (typeof body.refreshBodyAttributes === 'function') body.refreshBodyAttributes();

                socket.talk("m", 4000, `Cloned ${copiedTurrets.length} turrets from ${nearest.label || 'the target'}!`);

            } catch (err) {
                console.error(err);
                socket.talk("m", 3000, "Error: " + err.message);
            }
        }
    },
    {
        command: ["clearturrets", "removeturrets", "noturrets"],
        description: "Clears all turrets from your tank.",
        level: 2,
        hidden: true,
        run: ({ socket }) => {
            try {
                const body = socket.player?.body;
                if (!body) return;

                // 1. CLEAR THE BLUEPRINT
                body.TURRETS = [];
                body.hasCustomTurrets = true;

                // 2. DESTROY THE LIVE ENTITIES
                // Most Arras forks store the actual firing turret objects in lowercase 'turrets'
                if (body.turrets && Array.isArray(body.turrets)) {
                    for (let t of body.turrets) {
                        if (t) {
                            // Using both .kill() and .destroy() just to be safe for all engines
                            if (typeof t.destroy === 'function') t.destroy();
                            else if (typeof t.kill === 'function') t.kill();
                        }
                    }
                    // Empty the live list
                    body.turrets = [];
                }

                // 3. FORCE THE RE-RENDER
                body.define({ TURRETS: [] });

                // Try to sync using whatever method your fork uses
                if (typeof body.setupTurrets === 'function') {
                    body.setupTurrets([]); 
                } else if (typeof body.refreshBodyAttributes === 'function') {
                    body.refreshBodyAttributes();
                }

                socket.talk("m", 3000, "All turrets have been cleared! Your tank is clean.");

            } catch (err) {
                console.error("CLEAR TURRETS ERROR:", err);
                if (socket.talk) socket.talk("m", 5000, "Error clearing turrets: " + err.message);
            }
        }
    },
    {
        command: ["turrets+"],
        description: "Lists all available turret-like classes.",
        level: 3,
        run: ({ socket }) => {
            const Classes = global.Class || (typeof Class !== 'undefined' ? Class : {});
            const keys = Object.keys(Classes);
            
            // Filter for things that are likely turrets or smashers
            const keywords = ["turret", "auto", "smasher", "spike", "landmine", "gunner", "minion", "aura"];
            const found = keys.filter(k => keywords.some(word => k.toLowerCase().includes(word)));

            if (found.length === 0) return socket.talk("m", 3000, "No turret classes found.");

            socket.talk("m", 3000, `Found ${found.length} classes. Sending in chunks...`);

            // Send in groups of 10 to prevent a socket crash
            for (let i = 0; i < found.length; i += 10) {
                const chunk = found.slice(i, i + 10).join(", ");
                setTimeout(() => {
                    if (socket.talk) socket.talk("m", 10000, `[${i+1}] ${chunk}`);
                }, i * 2000); 
            }
        }
    },
    {
        command: ["addgun"],
        description: "Add a gun easily. Usage: $addgun [tank] [front/back/left/right] [projectile]",
        level: 3,
        run: ({ args, socket }) => {
            try {
                const body = socket.player?.body;
                if (!body) return;
                const Classes = global.Class || Class;
                
                // 1. Find the Tank Class to copy from
                const tankName = args[0] || "basic";
                const targetClass = Classes[tankName];
                if (!targetClass || !targetClass.GUNS) {
                    return socket.talk("m", 4000, `❌ Tank "${tankName}" not found.`);
                }

                // 2. Setup Easy Positions
                let angle = 0, fwd = 0, side = 0;
                const posInput = (args[1] || "front").toLowerCase();

                if (posInput === "front") { angle = 0;   fwd = 5;  side = 0; }
                else if (posInput === "back")  { angle = 180; fwd = 5;  side = 0; }
                else if (posInput === "left")  { angle = 270; fwd = 0;  side = -12; }
                else if (posInput === "right") { angle = 90;  fwd = 0;  side = 12; }

                // 3. Deep Clone your current guns so they don't vanish
                let currentGuns = [];
                if (body.GUNS) {
                    currentGuns = body.GUNS.map(g => ({
                        POSITION: [...g.POSITION],
                        PROPERTIES: g.PROPERTIES ? { ...g.PROPERTIES } : undefined
                    }));
                }

                // 4. Create the new gun
                const sourceGun = targetClass.GUNS[0]; // Take the main gun of the chosen tank
                const newGun = {
                    POSITION: [
                        sourceGun.POSITION[0], // length
                        sourceGun.POSITION[1], // width
                        sourceGun.POSITION[2], // aspect
                        sourceGun.POSITION[3] + fwd, 
                        sourceGun.POSITION[4] + side,
                        (sourceGun.POSITION[5] + angle) % 360,
                        sourceGun.POSITION[6]
                    ],
                    PROPERTIES: { 
                        ...sourceGun.PROPERTIES,
                        AUTOFIRE: true 
                    }
                };

                // 5. Bullet Override (e.g., $addgun basic front destroyer)
                if (args[2] && Classes[args[2]]) {
                    newGun.PROPERTIES.TYPE = args[2];
                }

                // 6. APPLY AND REFRESH (The most important part!)
                currentGuns.push(newGun);
                body.define({ GUNS: currentGuns });
                
                // This forces the server to actually create the gun objects
                if (body.setupGuns) body.setupGuns(); 

                socket.talk("m", 4000, `🔫 Added ${tankName} gun to the ${posInput}!`);
            } catch (err) {
                console.error(err);
                socket.talk("m", 3000, "❌ System Error adding gun.");
            }
        }
    },
    {
        command: ["clearguns"],
        description: "Removes ALL guns from your tank.",
        level: 3,
        run: ({ socket }) => {
            if (socket.player?.body) {
                socket.player.body.define({ GUNS: [] });
                socket.talk("m", 3000, "🗑️ All guns cleared!");
            }
        }
    },
    {
        command: ["savebuild", "save"],
        description: "Save your exact tank, turrets, color, and name. Usage: $savebuild [name]",
        level: 3,
        run: ({ args, socket }) => {
            try {
                const body = socket.player?.body;
                if (!body) return;

                if (!socket.savedBuilds) socket.savedBuilds = {};
                const buildName = args[0] || "default";
                const Classes = global.Class || Class;

                // 1. Find the exact string name of your main tank's class
                const mainClassName = Object.keys(Classes).find(key => Classes[key] === body.type) || "basic";

                // 2. Map turrets safely by finding their actual internal class string
                const currentTurrets = body.TURRETS || [];
                const savedTurrets = currentTurrets.map(t => {
                    const turretClassName = Object.keys(Classes).find(key => Classes[key] === t.TYPE) || t.TYPE?.label || "autoTurret";
                    return {
                        POSITION: [...t.POSITION],
                        typeName: turretClassName
                    };
                });

                // 3. Save EVERYTHING (Main Class, Turrets, Guns, Color, Name, Size)
                socket.savedBuilds[buildName] = {
                    className: mainClassName,
                    turrets: savedTurrets,
                    color: body.color,
                    name: body.name || socket.player.name || "Unnamed",
                    size: body.SIZE || 12,
                    // If your server allows custom gun arrays, this backs them up too
                    guns: body.GUNS ? body.GUNS.map(g => ({ POSITION: [...g.POSITION], PROPERTIES: g.PROPERTIES })) : undefined 
                };

                socket.talk("m", 4000, `Snapshot "${buildName}" saved! (Class: ${mainClassName}, ${currentTurrets.length} turrets)`);

            } catch (err) {
                console.error("SAVE BUILD ERROR:", err);
                if (socket.talk) socket.talk("m", 3000, "Error saving build.");
            }
        }
    },
    {
        command: ["loadbuild", "load"],
        description: "Load a saved snapshot exactly. Usage: $loadbuild [name]",
        level: 3,
        run: ({ args, socket }) => {
            try {
                const body = socket.player?.body;
                if (!body) return;
                
                const buildName = args[0] || "default";
                if (!socket.savedBuilds || !socket.savedBuilds[buildName]) {
                    return socket.talk("m", 4000, `Build "${buildName}" not found!`);
                }

                const Classes = global.Class || Class;
                const savedData = socket.savedBuilds[buildName];

                if (body.children && body.children.length) {
                    body.children.forEach(c => {
                        if (c.isTurret) c.kill();
                    });
                }

                const mainClass = Classes[savedData.className] || Classes.basic;
                body.define(mainClass);

                let newTurrets = savedData.turrets.map(data => ({
                    POSITION: data.POSITION,
                    TYPE: Classes[data.typeName] || Classes["autoTurret"]
                }));

                const newDefinition = { TURRETS: newTurrets };
                if (savedData.guns) newDefinition.GUNS = savedData.guns;

                body.hasCustomTurrets = true;
                body.define(newDefinition);

                if (savedData.color !== undefined) {
                    body.color = savedData.color;
                    socket.player.color = savedData.color; 
                }
                if (savedData.name !== undefined) {
                    body.name = savedData.name;
                    socket.player.name = savedData.name;
                }
                if (savedData.size !== undefined) body.SIZE = savedData.size;

                if (typeof body.setupTurrets === 'function') body.setupTurrets();
                else if (typeof body.refreshBodyAttributes === 'function') body.refreshBodyAttributes();

                socket.talk("m", 4000, `Loaded "${buildName}"! Welcome back, ${body.name}.`);

            } catch (err) {
                console.error("LOAD BUILD ERROR:", err);
                if (socket.talk) socket.talk("m", 3000, "Error loading build.");
            }
        }
    },
    {
        command: ["listbuilds", "lb"],
        description: "Show your saved turret layouts.",
        level: 3,
        run: ({ socket }) => {
            if (!socket.savedBuilds || Object.keys(socket.savedBuilds).length === 0) {
                return socket.talk("m", 3000, "You haven't saved any builds yet.");
            }
            const names = Object.keys(socket.savedBuilds).join(", ");
            socket.talk("m", 5000, `Your builds: ${names}`);
        }
    },
    {
        command: ["addturret", "turret"],
        description: "Add any turret. Usage: $addturret [name] [x] [y] [size] [angle]",
        level: 3,
        run: ({ args, socket }) => {
            try {
                const body = socket.player?.body;
                if (!body) return;

                const Classes = global.Class || (typeof Class !== 'undefined' ? Class : null);
                if (!Classes) return socket.talk("m", 3000, "Error: Class library not found.");

                let inputName = args[0] || "autoTurret";
                // Try exact match first, then case-insensitive search
                let typeDef = Classes[inputName] || Object.values(Classes).find(c => c.label?.toLowerCase() === inputName.toLowerCase());
                
                if (!typeDef) {
                    let key = Object.keys(Classes).find(k => k.toLowerCase() === inputName.toLowerCase());
                    if (key) typeDef = Classes[key];
                }

                if (!typeDef) {
                    return socket.talk("m", 4000, `Couldn't find turret: "${inputName}". Try 'autoTurret' or 'gunner'.`);
                }

                let x = parseFloat(args[1]) || 0;
                let y = parseFloat(args[2]) || 0;
                let size = parseFloat(args[3]) || 10;
                let angle = parseFloat(args[4]) || 0;

                if (!body.hasCustomTurrets) {
                    body.TURRETS = body.TURRETS ? [...body.TURRETS] : [];
                    body.hasCustomTurrets = true;
                }

                body.TURRETS.push({
                    POSITION: [size, x, y, angle, 360, 1],
                    TYPE: typeDef
                });

                body.define({ TURRETS: body.TURRETS });

                if (typeof body.setupTurrets === 'function') body.setupTurrets();
                else if (typeof body.refreshBodyAttributes === 'function') body.refreshBodyAttributes();

                socket.talk("m", 4000, `Mounted ${typeDef.label || inputName}!`);

            } catch (err) {
                console.error(err);
                socket.talk("m", 3000, "Error adding turret.");
            }
        }
    },
    {
        command: ["space", "spacestone", "portal", "vacuum"],
        description: "Creates a gravitational singularity that pulls everything to you. Usage: $space",
        level: 2,
        run: ({ socket }) => {
            let body = socket.player?.body;
            if (!body || !body.hasGauntlet) return socket.talk("m", 3000, "The Space Stone is required to manipulate coordinates.");

            // 1. Broadcast the spatial rift
            for (let e of entities.values()) {
                if (e.isPlayer && e.socket) e.socket.talk("m", 4000, "🌌 SPACE IS COLLAPSING 🌌");
            }

            let pullDuration = 100; // About 5 seconds of pulling
            let spaceLoop = setInterval(() => {
                if (pullDuration <= 0) {
                    clearInterval(spaceLoop);
                    return;
                }

                for (let entity of entities.values()) {
                    // Don't pull yourself, the walls, or ghosts
                    if (entity === body || entity.type === "wall" || entity.isGhost) continue;

                    // Calculate direction towards the player
                    let dx = body.x - entity.x;
                    let dy = body.y - entity.y;
                    let distance = Math.sqrt(dx * dx + dy * dy);

                    // If they aren't already touching you, pull them
                    if (distance > 50) {
                        let force = 2.5; // Strength of the pull
                        entity.velocity.x += (dx / distance) * force;
                        entity.velocity.y += (dy / distance) * force;
                        
                        // Visual effect: Turn them slightly blue while being pulled
                        entity.color = "teal";
                    }
                }
                pullDuration--;
            }, 50); // Runs every 50ms
        }
    },
    {
        command: ["spawn", "summon", "create"],
        description: "Spawn entity relative to you. Usage: $spawn <x> <y> <class> [ai]",
        level: 3,
        run: ({ args, socket }) => {
            const body = socket.player?.body;
            if (!body) return;
            const Classes = global.Class || Class;

            let xOff = parseFloat(args[0]) || 0;
            let yOff = parseFloat(args[1]) || 0;
            let type = args[2];
            let useAi = args[3] === "true";

            if (!Classes[type]) return socket.talk("m", 3000, "Unknown class!");

            // Safe Spawn using player constructor
            let entity = new body.constructor({ x: body.x + xOff, y: body.y + yOff });
            entity.define(Classes[type]);

            if (useAi) {
                entity.define({ CONTROLLERS: ["nearestDifferentMaster"] });
            }

            entity.refreshBodyAttributes();
            entity.life();
            socket.talk("m", 3000, `Spawned ${type}.`);
        }
    },
    {
        command: ["size", "sz"],
        description: "Set the size of your tank.",
        level: 2, // Set to 2 to match your other admin commands (like 'define' and 'level')
        hidden: true,
        run: ({ args, socket }) => {
            let body = socket.player.body;
            
            // Parse the first argument as a number
            let size = parseFloat(args[0]);

            // If no size is provided, or if it is <= 0, display the current size
            if (isNaN(size) || size <= 0) {
                socket.talk("m", 5_000, `Your tank size is ${body.SIZE}`);
                return;
            }

            // Save old size, apply new size, calculate the difference
            let oldSize = body.SIZE;
            body.SIZE = size;
            
            let delta = size - oldSize;
            let sign = delta > 0 ? '+' : '';
            
            socket.talk("m", 5_000, `Changed size ${oldSize} -> ${size} (${sign}${delta})`);
        }
    },
    {
        command: ["define"],
        description: "Change your tank.",
        level: 2,
        hidden: true,
        run: ({ args, socket }) => {
            if (!args[0]) {
                socket.talk("m", 5_000, "No entity specified.");
            }
            else {
                socket.player.body.define({RESET_UPGRADES: true, BATCH_UPGRADES: false});
                socket.player.body.define(args[0]);
                socket.talk("m", 5_000, `Changed to ${socket.player.body.label}`);
            }
        },
    },
    {
        command: ["level"],
        description: "Change your level.",
        level: 2,
        hidden: true,
        run: ({ args, socket }) => {
            if (!args[0]) {
                socket.talk("m", 5_000, "No level specified.");
            }
            else {
                socket.player.body.define({ LEVEL: args[0] });
                socket.talk("m", 5_000, `Changed to level ${socket.player.body.level}`);
            }
        },
    },
    {
        command: ["team"],
        description: "Change your team.", // player teams are -1 through -8, dreads are -10, room is -100 and enemies is -101
        level: 2,
        hidden: true,
        run: ({ args, socket }) => {
            if (!args[0]) {
                socket.talk("m", 5_000, "No team specified.");
            }
            else {
                socket.player.body.define({ COLOR: getTeamColor(args[0]), TEAM: args[0] });
                socket.talk("m", 5_000, `Changed to team ${socket.player.body.team}`);
            }
        },
    },
    {
        command: ["developer", "dev"],
        description: "Developer commands, go troll some players or just take a look for yourself.",
        level: 3,
        hidden: true,
        run: ({ socket, args, gameManager }) => {
            let sendAvailableDevCommandsMessage = () => {
                let lines = [
                    "Help menu:",
                    "- $ (developer / dev) reloaddefs - reloads definitions.",
                    "- $ (savebuild, save) Save your exact tank, turrets, color, and name. Usage: $savebuild [name]",
                    "- $ (loadbuild, load) Load a saved snapshot exactly. Usage: $loadbuild [name]",
                    "- $ (random, randomize) Turns you (or everyone) into a completely randomly generated tank! Usage: $random [playername | all] (does not quite work DO NOT USE ON OTHER PLAYERS!!!)",
                    "- $ (truebroadcast, tbr) Broadcast a message to all players.",
                    "- $ (size) = bigger/smaller (eg.$size 1 = really small, or $size 100 = really big!)",
                    "- $ (savecode) Saves your current custom tank and gives you a Share Code. (does not work yet!)",
                    "- $ (loadcode) Loads a saved tank using a Share Code. Usage: $loadcode <code> (doesn not work either!)",
                    "- $ (listcodes) Admin tool to see all saved tank codes in the console.",
                    "- $ (kill, k) Kill yourself or a specified entity. Usage: $kill <name>",
                    "- $ (clone, copy) weak clones : (",
                    "- $ (setclass, forceclass) Changes a player's tank class. Usage: $setclass <classname> [playername]. If no name is given, changes you.",
                    "- $ (nuke, doomsday, apocalypse)Initiate a devastating nuclear wipe with a countdown. Usage: $nuke",
                    "- $ (bossrush, raid, bosses) Spawns a ring of Elite and Celestial bosses. Usage: $bossrush",
                    "- $ (1v1, duel) Spawn a 1v1 arena around you.",
                    "- $ (gauntlet, thanos, infinity) Equips the Infinity Gauntlet. Usage: $gauntlet",
                    "- $ (snap) Erase exactly 50% of all entities. Usage: $snap",
                    "- $ (tp, teleport) Teleport to coordinates. Usage: $ tp [x] [y]",
                    "- $ (smite, killnear) Instantly destroys the entity closest to you.",
                    "- $ (vanish, ghost) Toggles invisibility.",
                    "- $ (vortex, pull) Creates a gravity well that pulls nearby entities toward you. Usage: $ vortex [power]",
                    "- $ (clearturrets, removeturrets, noturrets) Clears ALL turrets from your tank.",
                    "- $ (turrets+) Lists all available turret-like classes. (note: takes a long time!)",
                    "- $ (shapes, listshapes) Lists all available shapes and food.",
                    "- $ (clearguns) Removes ALL guns from your tank."
                ];
                socket.talk("Em", 10_000, JSON.stringify(lines));
            }
            let command = args[0];
            if (command === "reloaddefs" || command === "redefs") {
                /* IMPORT FROM (defsReloadCommand.js) */
                if (!global.reloadDefinitionsInfo) {
                    global.reloadDefinitionsInfo = {
                        lastReloadTime: 1,
                    };
                }
                // Rate limiter for anti-lag
                let time = performance.now();
                let sinceLastReload = time - global.reloadDefinitionsInfo.lastReloadTime;
                if (sinceLastReload < 5000) {
                    socket.talk('m', Config.popup_message_duration, `Wait ${Math.floor((5000 - sinceLastReload) / 100) / 10} seconds and try again.`);
                    return;
                }
                // Set the timeout timer ---
                lastReloadTime = time;

                // Remove function so all for(let x in arr) loops work
                delete Array.prototype.remove;

                // Before we purge the class, we are going to stop the game interval first
                gameManager.gameHandler.stop();

                // Now we can purge Class
                Class = {};

                // Log it.
                util.warn(`[IMPORTANT] Definitions are going to be reloaded on server ${gameManager.gamemode} (${gameManager.webProperties.id})!`);

                // Purge all cache entries of every file in definitions
                for (let file in require.cache) {
                    if (!file.includes('definitions') || file.includes(__filename)) continue;
                    delete require.cache[file];
                }

                // Load all definitions
                gameManager.reloadDefinitions();

                // Put the removal function back
                Array.prototype.remove = function (index) {
                    if (index === this.length - 1) return this.pop();
                    let r = this[index];
                    this[index] = this.pop();
                    return r;
                };

                // Redefine all tanks and bosses
                for (let entity of entities.values()) {
                    // If it's a valid type, and it's not a turret
                    if (!['tank', 'miniboss', 'food'].includes(entity.type)) continue;
                    if (entity.bond) continue;

                    let entityDefs = JSON.parse(JSON.stringify(entity.defs));
                    // Save color to put it back later
                    let entityColor = entity.color.compiled;

                    // Redefine all properties and update values to match
                    entity.upgrades = [];
                    entity.define(entityDefs);
                    for (let instance of entities.values()) {
                        if (
                            instance.settings.clearOnMasterUpgrade &&
                            instance.master.id === entity.id
                        ) {
                            instance.kill();
                        }
                    }
                    entity.skill.update();
                    entity.syncTurrets();
                    entity.refreshBodyAttributes();
                    entity.color.interpret(entityColor);
                }

                // Tell the command sender
                socket.talk('m', Config.popup_message_duration, "Successfully reloaded all definitions.");


                // Erase mockups so it can rebuild.
                mockupData = [];
                // Load all mockups if enabled in configuration
                if (Config.load_all_mockups) global.loadAllMockups(false);

                setTimeout(() => { // Let it sit for a second.
                    // Erase cached mockups for each connected clients.
                    gameManager.clients.forEach(socket => {
                        socket.status.mockupData = socket.initMockupList();
                        socket.status.selectedLeaderboard2 = socket.status.selectedLeaderboard;
                        socket.status.selectedLeaderboard = "stop";
                        socket.talk("RE"); // Also reset the global.entities in the client so it can refresh.
                        if (Config.load_all_mockups) for (let i = 0; i < mockupData.length; i++) {
                            socket.talk("M", mockupData[i].index, JSON.stringify(mockupData[i]));
                        }
                        socket.status.selectedLeaderboard = socket.status.selectedLeaderboard2;
                        delete socket.status.selectedLeaderboard2;
                        socket.talk("CC"); // Clear cache
                    });
                    // Log it again.
                    util.warn(`[IMPORTANT] Definitions are successfully reloaded on server ${gameManager.gamemode} (${gameManager.webProperties.id})!`);
                    gameManager.gameHandler.run();
                }, 1000)
            } else sendAvailableDevCommandsMessage();
        },
    },
]

/** COMMANDS RUN FUNCTION **/
function runCommand(socket, message, gameManager) {
    if (!message.startsWith(prefix) || !socket?.player?.body) return;

    let args = message.slice(prefix.length).split(" ");
    let commandName = args.shift();
    let command = commands.find((command) => command.command.includes(commandName));
    if (command) {
        let permissionsLevel = socket.permissions?.level ?? 0;
        let level = command.level;

        if (permissionsLevel >= level) {
            try {
                command.run({ socket, message, args, level: permissionsLevel, gameManager: gameManager });
            } catch (e) {
                console.error("Error while running ", commandName);
                console.error(e);
                socket.talk("m", 5_000, "An error occurred while running this command.");
            }
        } else socket.talk("m", 5_000, "You do not have access to this command.");
    } else socket.talk("m", 5_000, "Unknown command.");

    return true;
}
global.addChatCommand = function (command) {
    if (!command.command || !command.run) {
        throw new Error("Invalid command format. A command must have at least a 'command' and a 'run' property.");
    }
    if (!Array.isArray(command.command)) {
        throw new Error("Invalid command format. The 'command' property must be an array of strings.");
    }
    if (commands.find(c => c.command.some(cmd => command.command.includes(cmd)))) {
        throw new Error("A command with this name already exists.");
    }
    commands.push(command);
}


/** CHAT MESSAGE EVENT **/
module.exports = ({ Events }) => {
    Events.on("chatMessage", ({ socket, message, preventDefault, gameManager }) => {
        if (message.startsWith(prefix)) {
            preventDefault();
            runCommand(socket, message, gameManager);
        }
    });
};