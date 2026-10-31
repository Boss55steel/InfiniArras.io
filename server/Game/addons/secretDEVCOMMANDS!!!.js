// ==========================================
// SECRET DEVELOPER '/' COMMANDS
// ==========================================
const prefix = "/";

module.exports = ({ Events }) => {
    console.log("Secret Developer Commands Addon Loaded!");

    Events.on('chatMessage', (arg1, arg2) => {
        let socket, message;

        // Auto-detect the event arguments based on engine version
        if (arg1 && arg1.message !== undefined) {
            message = arg1.message;
            socket = arg1.socket || arg1;
        } else if (typeof arg1 === 'string') {
            message = arg1;
            socket = arg2;
        } else {
            socket = arg1;
            message = arg2;
        }

        // CRASH PREVENTER: Ensure valid text
        if (!message || typeof message !== 'string') return;
        if (!socket) return;

        // Only run if the message starts with the prefix (slash)
        if (message.startsWith(prefix)) {
            
            // SECURITY CHECK: Matches your exact in-game Dev name!
            let isDev = (socket.player && socket.player.name === "Boss55steel [Boss] YT") || (socket.permissions && socket.permissions.level >= 4);
            
            if (!isDev) {
                socket.talk("m", 3000, "!!ONLY FOR DEV!!"); 
                return; 
            }

            let args = message.slice(prefix.length).split(" ");
            let cmd = args.shift().toLowerCase();
            let body = socket.player?.body;

            if (!body) return;

            let allEntities = global.entities || [];

            // --- CRASH-PROOF BROADCAST HELPER ---
            // Tries to announce to everyone, falls back to just telling you if it fails!
            const announce = (text) => {
                try {
                    const sockets = require('../network/sockets.js');
                    if (sockets && typeof sockets.broadcast === 'function') {
                        sockets.broadcast(text);
                    } else {
                        socket.talk("m", 5000, text);
                    }
                } catch (e) {
                    socket.talk("m", 5000, text);
                }
            };

            // 1. THE NUKE: Kills every entity on the server EXCEPT you.
            if (cmd === "nuke") {
                level: 4,
                announce("!!!THE DEVELOPER HAS AUTHORIZED A SERVER WIPE!!!");
                
                allEntities.forEach(e => {
                    // Added safety check: only kill if the entity actually has a kill function
                    if (e && e !== body && e.health && typeof e.kill === 'function') {
                        e.kill(); 
                    }
                });
                
                socket.talk("m", 3000, "Nuke deployed successfully.");
                return; 
            }

            // 2. GHOST MODE: Invisible, infinite health, and zero knockback.
            if (cmd === "ghost") {
                body.alpha = 0; // Completely invisible to others
                body.health.max = 1e9;
                body.health.amount = 1e9;
                body.pushability = 0; // Cannot be pushed
                socket.talk("m", 3000, "👻 Ghost Mode Activated. You are unseen and unkillable.");
                return;
            }

            // 3. TROLL MODE: Turns every other player into a slow, harmless square.
            if (cmd === "troll") {
                level: 0,
                announce("THE DEVELOPER IS FEELING FUNNY...");
                
                allEntities.forEach(e => {
                    // Check if it's a tank, make sure it's not YOU or a bot, and has define function
                    if (e && e.type === 'tank' && e !== body && !e.isBot && typeof e.define === 'function') {
                        e.define(global.Class.square || "square"); 
                        e.color = 12; // Red
                        e.name = "I got trolled";
                    }
                });
                
                socket.talk("m", 3000, "Troll mode engaged.");
                return;
            }
        } 
    }); 
};