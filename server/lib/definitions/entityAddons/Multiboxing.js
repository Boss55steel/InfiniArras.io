"use strict";

const { combineStats } = require("../facilitators.js");
const { base }         = require("../constants.js");
const g                = require("../gunvals.js");
const botRegistry = new Map();   // socket -> [ entity, entity, ... ]
function parseCommand(message) {
    const body = message.slice("$multibox".length).trim();
    if (!body) return null;

    const parts  = body.split(",").map(s => s.trim());
    const amount = parseInt(parts[0], 10);
    if (isNaN(amount) || amount < 0) return null;

    return {
        amount: Math.min(amount, 100),
        color:  parts[1] || null,
        name:   parts[2] || null,
        type:   parts[3] || null,
    };
}
function getCursor(bot) {
    try {
        const s = bot._ownerSocket;
        if (!s) throw new Error("no socket");
        if (s.player?.mouse?.x !== undefined) return s.player.mouse;
        if (s.player?.input?.mouse?.x !== undefined) return s.player.input.mouse;
        if (s.player?.angle !== undefined) {
            const a = s.player.angle;
            const master = bot.master;
            if (master) {
                return {
                    x: master.x + Math.cos(a) * 400,
                    y: master.y + Math.sin(a) * 400,
                };
            }
        }
    } catch (_) {}

    // Last resort: stay near the master
    const m = bot.master;
    return m ? { x: m.x, y: m.y } : { x: bot.x, y: bot.y };
}
const builtBotClasses = new Map();

function getBotClass(tankType) {
    if (builtBotClasses.has(tankType)) return builtBotClasses.get(tankType);

    const classId = "_multibox_bot_" + tankType;

    Class[classId] = {
        PARENT:      [tankType],
        SKILL:       [9, 9, 9, 9, 9, 9, 9, 9, 9, 0],

        DRAW_HEALTH:  true,

        ON: [{
            event: "tick",
            handler: ({ body }) => {
                if (!body || body.isDead) return;

                const cursor = getCursor(body);
                const dx     = cursor.x - body.x;
                const dy     = cursor.y - body.y;
                const dist   = Math.sqrt(dx * dx + dy * dy);

                if (dist < 6) {
                    body.velocity.x *= 0.70;
                    body.velocity.y *= 0.70;
                    return;
                }
                const ramp  = Math.min(1, dist / 200);
                const speed = (body.BODY?.SPEED ?? base.SPEED) * ramp;

                body.velocity.x = (dx / dist) * speed;
                body.velocity.y = (dy / dist) * speed;
                body.facing = Math.atan2(dy, dx);
            },
        }],
    };

    builtBotClasses.set(tankType, classId);
    return classId;
}
function removeBots(socket) {
    const list = botRegistry.get(socket);
    if (!list) return;
    for (const bot of list) {
        try {
            if (bot && !bot.isDead && bot.health)
                bot.health.amount = -1;
        } catch (_) {}
    }
    botRegistry.delete(socket);
}
function spawnBots(socket, opts) {
    removeBots(socket);
    if (opts.amount === 0) return 0;
    const playerEntity = socket.player?.entity ?? socket.entity;
    if (!playerEntity) {
        console.warn("[Multibox] Could not resolve player entity for socket.");
        return 0;
    }
    const botName  = opts.name  || socket.player?.name  || playerEntity.label || "Player";
    const botColor = opts.color || playerEntity.COLOR   || socket.player?.color || "grey";
    const tankType = opts.type  && Class[opts.type]
        ? opts.type
        : (playerEntity.type ?? "basic");

    const classId = getBotClass(tankType);

    const spawned = [];
    for (let i = 0; i < opts.amount; i++) {
        const angle  = (2 * Math.PI / opts.amount) * i;
        const spawnX = playerEntity.x + Math.cos(angle) * 100;
        const spawnY = playerEntity.y + Math.sin(angle) * 100;

        let bot = null;
        try {
            if (typeof entities?.new === "function") {
                bot = entities.new(classId, {
                    x:      spawnX,
                    y:      spawnY,
                    team:   playerEntity.team,
                    master: playerEntity,
                    name:   botName,
                    color:  botColor,
                    label:  botName,
                    level:  45,
                });
            }
        } catch (_) {}

        if (!bot) {
            try {
                if (typeof room?.addEntity === "function") {
                    bot = room.addEntity(classId, {
                        x:      spawnX,
                        y:      spawnY,
                        team:   playerEntity.team,
                        master: playerEntity,
                        name:   botName,
                        label:  botName,
                        level:  45,
                    });
                }
            } catch (_) {}
        }

        if (!bot) {
            try {
                if (typeof gameServer?.addEntity === "function") {
                    bot = gameServer.addEntity(classId, spawnX, spawnY, {
                        team:   playerEntity.team,
                        master: playerEntity,
                        name:   botName,
                        level:  45,
                    });
                }
            } catch (_) {}
        }

        if (!bot) {
            console.warn("[Multibox] All entity creation strategies failed for bot " + i);
            continue;
        }
        bot._ownerSocket = socket;
        try { if (botColor && bot.COLOR === undefined) bot.COLOR = botColor; } catch (_) {}
        try { if (botName  && !bot.label)              bot.label = botName;  } catch (_) {}

        spawned.push(bot);
    }

    if (spawned.length > 0) botRegistry.set(socket, spawned);
    return spawned.length;
}
function sendMessage(socket, text) {
    try {
        if (typeof socket.sendChat === "function") { socket.sendChat(text); return; }
        if (typeof socket.talk     === "function") { socket.talk("chat", false, text); return; }
        if (typeof socket.send     === "function") { socket.send(JSON.stringify({ type: "chat", message: text })); return; }
    } catch (_) {}
    console.log("[Multibox] -> " + text);
}
Events.on("chat", (socket, message) => {
    if (typeof message !== "string") return;
    if (!message.toLowerCase().startsWith("$multibox")) return;

    const opts = parseCommand(message);
    if (!opts) {
        sendMessage(socket,
            "Usage: $multibox {amount}, {color}, {name}, {type}" +
            "  --  only amount is required.  Use 0 to remove bots."
        );
        return;
    }

    const count = spawnBots(socket, opts);

    if (opts.amount === 0) {
        sendMessage(socket, "Multibox: all bots removed.");
    } else if (count > 0) {
        sendMessage(socket,
            "Multibox: " + count + " bot(s) spawned." +
            (opts.type  ? "  Type: " + opts.type   : "") +
            (opts.color ? "  Colour: " + opts.color : "") +
            (opts.name  ? "  Name: "  + opts.name  : "")
        );
    } else {
        sendMessage(socket,
            "Multibox: could not spawn bots.  " +
            "Check that the tank type exists and the server supports entity creation."
        );
    }
});
Events.on("disconnect", (socket) => {
    removeBots(socket);
});

console.log("[Multibox] Loaded.  Command: $multibox {amount}, {color}, {name}, {type}");