// ═══════════════════════════════════════════════════════════════════════════
//  U N D E R W O R L D   R O O M   S E T U P
//  File: server/rooms/underworld_room.js
//
//  This script runs when the Underworld server initialises.
//  It:
//    1. Places bone-wall corridors across the map (catacomb layout)
//    2. Marks Soul Altar zones and applies passive regen to players inside
//    3. Drives the Phantom Wave event loop (boss spawning + announcements)
//    4. Hooks player death to temporarily switch them to the Wraith class
//
//  HOW TO USE:
//    In config.js, under your Underworld server entry, add:
//      room_setup: require('./server/rooms/underworld_room.js'),
//
//  The room_setup function receives the Room object as its argument and is
//  called once after the server finishes initialising its first room.
// ═══════════════════════════════════════════════════════════════════════════

'use strict';

// ── Tunables (match underworld.js gamemode config) ────────────────────────────
const CFG = {
    WIDTH:  14000,
    HEIGHT: 14000,

    PHANTOM_WAVE_INTERVAL:    3 * 60 * 1000,
    PHANTOM_WAVE_MESSAGE:     '⚠ A Phantom Wave rises from the abyss...',
    PHANTOM_WAVE_END_MESSAGE: 'The wave has been repelled... for now.',
    PHANTOM_WAVE_REVENANTS:   3,
    PHANTOM_WAVE_KING:        true,

    BOSS_REVENANT: 'theRevenant_UW',
    BOSS_KING:     'phantomKing_UW',

    SOUL_ALTARS: [
        { x: 0.5,  y: 0.15 },
        { x: 0.15, y: 0.82 },
        { x: 0.85, y: 0.82 },
    ],
    ALTAR_REGEN:  12,    // HP/s
    ALTAR_RADIUS: 420,   // map units

    WAVE_KILL_BONUS: 2.5,

    // Bone wall dimensions (each wall is a rectangular maze wall entity)
    WALL_THICKNESS: 55,
    // Catacomb corridor layout — each entry is { x1, y1, x2, y2 } in map units
    // These form a rough T/cross catacomb pattern across the map
    WALLS: buildCatacombWalls(14000, 14000),
};

// ── Build catacomb wall layout ────────────────────────────────────────────────
// Creates a sparse grid of corridors: one cross in the centre,
// four outer rings, and diagonal bone pillars at midpoints.
function buildCatacombWalls(W, H) {
    const walls = [];
    const T = 55;   // thickness

    // Helper: horizontal wall segment
    const hw = (x1, y, x2) => ({ x1, y1: y - T/2, x2, y2: y + T/2 });
    // Helper: vertical wall segment
    const vw = (x, y1, y2) => ({ x1: x - T/2, y1, x2: x + T/2, y2 });

    // ── Central cross ───────────────────────────────────────────────────────
    // Horizontal bar across centre, with gaps for corridors
    walls.push(hw(500,       H/2, W/2 - 600));   // left half
    walls.push(hw(W/2 + 600, H/2, W - 500));     // right half
    // Vertical bar through centre, with gaps
    walls.push(vw(W/2, 500,       H/2 - 600));
    walls.push(vw(W/2, H/2 + 600, H - 500));

    // ── Inner ring (quarter-map radius) ─────────────────────────────────────
    const r1x = W * 0.25, r1y = H * 0.25;
    // Top-left quadrant wall
    walls.push(hw(r1x - 900, r1y, r1x + 900));
    walls.push(vw(r1x, r1y - 900, r1y + 900));
    // Top-right quadrant
    walls.push(hw(W - r1x - 900, r1y, W - r1x + 900));
    walls.push(vw(W - r1x, r1y - 900, r1y + 900));
    // Bottom-left
    walls.push(hw(r1x - 900, H - r1y, r1x + 900));
    walls.push(vw(r1x, H - r1y - 900, H - r1y + 900));
    // Bottom-right
    walls.push(hw(W - r1x - 900, H - r1y, W - r1x + 900));
    walls.push(vw(W - r1x, H - r1y - 900, H - r1y + 900));

    // ── Diagonal bone pillars (short walls at 45° feel; simulate with short X+Y pairs) ──
    const pillarSpots = [
        [W*0.375, H*0.375], [W*0.625, H*0.375],
        [W*0.375, H*0.625], [W*0.625, H*0.625],
        [W*0.125, H*0.5],   [W*0.875, H*0.5],
        [W*0.5,   H*0.125], [W*0.5,   H*0.875],
    ];
    for (const [px, py] of pillarSpots) {
        walls.push(hw(px - 350, py, px + 350));
        walls.push(vw(px, py - 350, py + 350));
    }

    // ── Outer cloister — walls near the map edge ─────────────────────────────
    const margin = 1200;
    // Top edge segments (leave four gaps for entrances)
    walls.push(hw(margin,         margin, W*0.3));
    walls.push(hw(W*0.4,          margin, W*0.6));
    walls.push(hw(W*0.7,          margin, W - margin));
    // Bottom edge
    walls.push(hw(margin,         H - margin, W*0.3));
    walls.push(hw(W*0.4,          H - margin, W*0.6));
    walls.push(hw(W*0.7,          H - margin, W - margin));
    // Left edge
    walls.push(vw(margin, margin, H*0.3));
    walls.push(vw(margin, H*0.4, H*0.6));
    walls.push(vw(margin, H*0.7, H - margin));
    // Right edge
    walls.push(vw(W - margin, margin, H*0.3));
    walls.push(vw(W - margin, H*0.4, H*0.6));
    walls.push(vw(W - margin, H*0.7, H - margin));

    return walls;
}

// ── Altar entity marker ───────────────────────────────────────────────────────
// We don't draw a sprite — we just track zones in JS and apply regen in the
// update loop. But we do spawn a visible "altar core" entity at each position
// so players can see the soul shrines on the minimap.
function spawnAltarCore(room, ax, ay) {
    // OSA exposes room.spawnEntity(classname, x, y) for non-player entities.
    // We use a large, stationary, invisible-ish entity as the altar "beacon".
    // It is set to INVINCIBLE so players cannot destroy it.
    try {
        const altar = room.spawnEntity('soulAltar_UW', ax, ay);
        if (altar) {
            altar.invincible = true;
            altar.facing     = 0;
        }
        return altar;
    } catch (e) {
        // If the entity class doesn't exist (addon not loaded), silently skip
        console.warn('[underworld_room] Could not spawn soulAltar_UW:', e.message);
        return null;
    }
}

// ── Main export ───────────────────────────────────────────────────────────────
module.exports = function setupUnderworldRoom(room) {
    console.log('[underworld_room] Setting up Underworld — Soul Surge room...');

    const W = CFG.WIDTH, H = CFG.HEIGHT;

    // ── 1. Place catacomb bone walls ─────────────────────────────────────────
    // OSA exposes room.spawnWall(x1, y1, x2, y2) or room.addWall(opts).
    // We try both APIs for maximum compatibility across OSA versions.
    let wallsPlaced = 0;
    for (const w of CFG.WALLS) {
        try {
            if (typeof room.spawnWall === 'function') {
                room.spawnWall(w.x1, w.y1, w.x2, w.y2);
            } else if (typeof room.addWall === 'function') {
                room.addWall({ x1: w.x1, y1: w.y1, x2: w.x2, y2: w.y2 });
            }
            wallsPlaced++;
        } catch (e) { /* wall API not available — skip */ }
    }
    console.log(`[underworld_room] Placed ${wallsPlaced}/${CFG.WALLS.length} catacomb walls.`);

    // ── 2. Register Soul Altar zones ─────────────────────────────────────────
    const altarZones = CFG.SOUL_ALTARS.map(a => ({
        x: a.x * W,
        y: a.y * H,
        r: CFG.ALTAR_RADIUS,
        entity: spawnAltarCore(room, a.x * W, a.y * H),
    }));
    console.log(`[underworld_room] Soul Altars placed at ${altarZones.map(z => `(${~~z.x},${~~z.y})`).join(', ')}`);

    // ── 3. Per-tick altar regen ───────────────────────────────────────────────
    // OSA rooms have an onTick(dt) hook or similar update mechanism.
    // We attach to it to do altar regen each server tick (~25ms).
    const REGEN_PER_TICK = CFG.ALTAR_REGEN / 40; // ~40 ticks/sec

    const applyAltarRegen = (dt) => {
        if (!room.players) return;
        for (const player of room.players) {
            if (!player || !player.alive) continue;
            const px = player.x, py = player.y;
            for (const zone of altarZones) {
                const dx = px - zone.x, dy = py - zone.y;
                if (dx*dx + dy*dy <= zone.r * zone.r) {
                    // Inside altar — heal the player
                    if (player.health < player.maxHealth) {
                        player.health = Math.min(
                            player.maxHealth,
                            player.health + REGEN_PER_TICK * (dt || 25)
                        );
                    }
                    break; // only one altar at a time
                }
            }
        }
    };

    // Hook into tick — try both common OSA hook names
    if (typeof room.onTick === 'function') {
        const orig = room.onTick.bind(room);
        room.onTick = (dt) => { orig(dt); applyAltarRegen(dt); };
    } else if (room.tickHooks && Array.isArray(room.tickHooks)) {
        room.tickHooks.push(applyAltarRegen);
    } else {
        // Fallback: raw setInterval at ~25ms
        setInterval(() => applyAltarRegen(25), 25);
    }

    // ── 4. Phantom Wave event loop ────────────────────────────────────────────
    let waveInProgress  = false;
    let waveKillCount   = 0;
    const waveEntities  = [];   // track spawned boss entities so we know when dead

    const broadcast = (msg) => {
        try {
            if (typeof room.broadcast === 'function') room.broadcast(msg);
            else if (typeof room.sendMessage === 'function') room.sendMessage(msg);
            else console.log('[underworld_room] BROADCAST:', msg);
        } catch (e) { console.log('[underworld_room] BROADCAST:', msg); }
    };

    const spawnBoss = (className, x, y) => {
        try {
            const boss = room.spawnEntity(className, x, y);
            if (boss) waveEntities.push(boss);
            return boss;
        } catch (e) {
            console.warn(`[underworld_room] Could not spawn ${className}:`, e.message);
            return null;
        }
    };

    const startPhantomWave = () => {
        if (waveInProgress) return;
        waveInProgress = true;
        waveKillCount  = 0;
        waveEntities.length = 0;

        broadcast(CFG.PHANTOM_WAVE_MESSAGE);

        // Spawn Revenants at random positions around the edges
        for (let i = 0; i < CFG.PHANTOM_WAVE_REVENANTS; i++) {
            const angle  = (Math.PI * 2 * i) / CFG.PHANTOM_WAVE_REVENANTS;
            const radius = Math.min(W, H) * 0.38;
            const bx = W/2 + Math.cos(angle) * radius;
            const by = H/2 + Math.sin(angle) * radius;
            spawnBoss(CFG.BOSS_REVENANT, bx, by);
        }

        // Spawn Phantom King at the map centre (or 50/50 chance)
        if (CFG.PHANTOM_WAVE_KING || Math.random() < 0.5) {
            spawnBoss(CFG.BOSS_KING, W/2, H/2);
        }

        // Poll for all wave bosses to be dead, then end the wave
        const waveCheck = setInterval(() => {
            const allDead = waveEntities.every(e => !e || !e.alive);
            if (allDead && waveEntities.length > 0) {
                clearInterval(waveCheck);
                endPhantomWave();
            }
        }, 3000);

        // Safety timeout — 10 minutes max per wave
        setTimeout(() => {
            if (waveInProgress) {
                clearInterval(waveCheck);
                endPhantomWave();
            }
        }, 10 * 60 * 1000);
    };

    const endPhantomWave = () => {
        waveInProgress = false;
        broadcast(CFG.PHANTOM_WAVE_END_MESSAGE);
    };

    // Fire the first wave after a 60-second grace period, then every interval
    setTimeout(() => {
        startPhantomWave();
        setInterval(startPhantomWave, CFG.PHANTOM_WAVE_INTERVAL);
    }, 60 * 1000);

    // ── 5. Kill bonus during Phantom Wave ─────────────────────────────────────
    // OSA fires room.onKill(killer, victim) — we hook in for score multiplier.
    const isWaveBoss = (entity) =>
        entity &&
        (entity.type === CFG.BOSS_REVENANT || entity.type === CFG.BOSS_KING);

    if (typeof room.onKill === 'function' || room.killHooks) {
        const killBonus = (killer, victim) => {
            if (!waveInProgress || !killer) return;
            if (isWaveBoss(victim)) {
                // Extra score for killing a wave boss
                const bonus = Math.floor((victim.score || 1000) * (CFG.WAVE_KILL_BONUS - 1));
                if (killer.score != null) killer.score += bonus;
            }
        };

        if (room.killHooks && Array.isArray(room.killHooks)) {
            room.killHooks.push(killBonus);
        } else {
            const origOnKill = room.onKill?.bind(room);
            room.onKill = (killer, victim) => {
                origOnKill?.(killer, victim);
                killBonus(killer, victim);
            };
        }
    }

    // ── 6. Wraith respawn mechanic ────────────────────────────────────────────
    // When a player is killed by a boss, they respawn as the Wraith class
    // for 20 seconds before being set back to their chosen class.
    // OSA fires room.onDeath(player, killer).
    const WRAITH_DURATION = 20 * 1000;

    const wraithRespawn = (player, killer) => {
        if (!player || !isWaveBoss(killer)) return;
        // Schedule the class override after OSA handles normal respawn (~1–2s)
        setTimeout(() => {
            try {
                if (player.alive && player.setClass) {
                    const prevClass = player.currentClass || 'genericTank';
                    player.setClass('wraith_UW');
                    // Revert after WRAITH_DURATION
                    setTimeout(() => {
                        try {
                            if (player.alive && player.setClass) {
                                player.setClass(prevClass);
                            }
                        } catch (_) {}
                    }, WRAITH_DURATION);
                }
            } catch (_) {}
        }, 1500);
    };

    if (room.deathHooks && Array.isArray(room.deathHooks)) {
        room.deathHooks.push(wraithRespawn);
    } else if (typeof room.onDeath === 'function') {
        const origOnDeath = room.onDeath.bind(room);
        room.onDeath = (player, killer) => {
            origOnDeath(player, killer);
            wraithRespawn(player, killer);
        };
    }

    console.log('[underworld_room] ✓ Underworld — Soul Surge fully initialised.');
    console.log('[underworld_room]   • Catacomb walls placed');
    console.log('[underworld_room]   • Soul Altars active (regen: ' + CFG.ALTAR_REGEN + ' HP/s)');
    console.log('[underworld_room]   • Phantom Wave timer armed (every 3 min, first in 60s)');
    console.log('[underworld_room]   • Wraith respawn mechanic active');
};