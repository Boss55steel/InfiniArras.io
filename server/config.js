module.exports = {
    // Open Source Arras
    version: 'v2.0.11.2', // The current OSA version. Changing this will likely confuse addons.
    devBuild: false, // Whether this is marked as a development build.

    // Client
    main_menu: 'index.html', // Where the main menu is located (in the /public folder).
    host: 'localhost:3000', // Game server domain. If the host is 'localhost:NUMBER', the NUMBER must be the port setting.
    port: 3000, // Which port to run the web server on.

    // Server
    visible_list_interval: 250, // How often to update the list of the entities that players can see. Has effects of when entities are activated.
    startup_logs: true, // Enable startup logs and log speed loop warnings in the terminal
    load_all_mockups: false, // Set to true if you want every mockup to be loaded when the server starts. May noticeably slow down server startup.

    servers: [ // Make sure to change the host, port and id between servers!
        {
            share_client_server: false, // Only one server at a time can have this enabled.
            // The above is required if your VM (the machine that hosts the website stuff) doesn't support multi-ports and forces everything through the main server.
            // This also overrides the below host and port settings to be identical to the main server's host/port (by default, 3000).

            host: 'localhost:3001', // Server host location.
            port: 3001, // The port on the server.
            id: 'la', // (<host>/#<id>)

            region: "Local", // The region the server is on.
            gamemode: ['tdm'], // The selected gamemode.
            player_cap: 80, // Not including bots. Set to 0 to disable.

            featured: false, // Whether the server is featured or not.
            unlisted: true, // Whether the server shows up in the server list (if its id isn't in the url).
            private: true, // Whether the server requires a privileged token to join (except through server travel).

            properties: { // This overrides settings in the config.js file, assuming the selected gamemode doesn't also override it.
                teams: 4,
                bot_cap: 40
            }
        },
        {
            share_client_server: false, // Only one server at a time can have this enabled.
            // The above is required if your VM (the machine that hosts the website stuff) doesn't support multi-ports and forces everything through the main server.
            // This also overrides the below host and port settings to be identical to the main server's host/port (by default, 3000).

            host: 'localhost:3002', // Server host location.
            port: 3002, // The port on the server.
            id: 'lb', // (<host>/#<id>)

            region: "Local", // The region the server is on.
            gamemode: ['retrograde', 'ffa'], // The selected gamemode.
            player_cap: 80, // Not including bots. Set to 0 to disable.

            featured: false, // Whether the server is featured or not.
            unlisted: true, // Whether the server shows up in the server list (if its id isn't in the url).
            private: true, // Whether the server requires a privileged token to join (except through server travel).

            properties: { // This overrides settings in the config.js file, assuming the selected gamemode doesn't also override it.
                teams: 4,
                bot_cap: 16,
                server_travel_properties: {
                    loop_interval: 30_000, // how often the portal loop executes in seconds
                    portals: 3, // amount of portals to spawn
                },
                daily_tank: {
                    tank: 'whirlwind',
                    tier: 3,
                    ads: false,
                    ad_sources: [
                        {
                            file: 'testadvideo.mp4',
                            use_regular_ad_size: true
                        },
                        {
                            file: 'testadimage.png',
                            use_regular_ad_size: true
                        }
                    ]
                },
                server_travel: [
                    {
                        ip: 'localhost:3003', // destination server host, don't add "https://" or any slashes to it
                        portal_properties: {
                            spawn_chance: 3, // chance for a portal to spawn somewhere in the map each loop iteration (higher = lower chances, lower = higher chance)
                            color: 'red', // portal color
                        }
                    }
                ]
            }
        },
        {
            share_client_server: false, // Only one server at a time can have this enabled.
            // The above is required if your VM (the machine that hosts the website stuff) doesn't support multi-ports and forces everything through the main server.
            // This also overrides the below host and port settings to be identical to the main server's host/port (by default, 3000).

            host: 'localhost:3003', // Server host location.
            port: 3003, // The port on the server.
            id: 'lc', // (<host>/#<id>)

            region: "Local", // The region the server is on.
            gamemode: ['nexus'], // The selected gamemode.
            player_cap: 80, // Not including bots. Set to 0 to disable.

            featured: false, // Whether the server is featured or not.
            unlisted: true, // Whether the server shows up in the server list (if its id isn't in the url).
            private: true, // Whether the server requires a privileged token to join (except through server travel).

            properties: { // This overrides settings in the config.js file, assuming the selected gamemode doesn't also override it.
                teams: 4,
                bot_cap: 0,
                allow_server_travel: true,
                server_travel_properties: {
                    loop_interval: 30_000, // how often the portal loop executes in seconds
                    portals: 5, // amount of portals to spawn
                },
                server_travel: [
                    {
                        ip: 'localhost:3001', // destination server host, don't add "https://" or any slashes to it
                        ip: 'localhost:3002', // destination server host, don't add "https://" or any slashes to it
                        ip: 'localhost:3004', // destination server host, don't add "https://" or any slashes to it
                        ip: 'localhost:3005', // destination server host, don't add "https://" or any slashes to it
                        ip: 'localhost:3006', // destination server host, don't add "https://" or any slashes to it
                        ip: 'localhost:3007', // destination server host, don't add "https://" or any slashes to it
                        portal_properties: {
                            spawn_chance: 1, // chance for a portal to spawn somewhere in the map each loop iteration (higher = lower chances, lower = higher chance)
                            color: 'red', // portal color
                        }
                    }
                ]
            }
        },
        {
            share_client_server: false, // Only one server at a time can have this enabled.
            // The above is required if your VM (the machine that hosts the website stuff) doesn't support multi-ports and forces everything through the main server.
            // This also overrides the below host and port settings to be identical to the main server's host/port (by default, 3000).

            host: 'localhost:3004', // Server host location.
            port: 3004, // The port on the server.
            id: 'ld', // (<host>/#<id>)

            region: "Local", // The region the server is on.
            gamemode: ['sandbox'], // The selected gamemode.
            player_cap: 16, // Not including bots. Set to 0 to disable.

            featured: false, // Whether the server is featured or not.
            unlisted: false, // Whether the server shows up in the server list (if its id isn't in the url).
            private: false, // Whether the server requires a privileged token to join (except through server travel).

            properties: { // This overrides settings in the config.js file, assuming the selected gamemode doesn't also override it.
                //teams: 4,
                //bot_cap: 0
            }
        },
        {
            share_client_server: false, // Only one server at a time can have this enabled.
            // The above is required if your VM (the machine that hosts the website stuff) doesn't support multi-ports and forces everything through the main server.
            // This also overrides the below host and port settings to be identical to the main server's host/port (by default, 3000).

            host: 'localhost:3005', // Server host location.
            port: 3005, // The port on the server.
            id: 'le', // (<host>/#<id>)

            region: "Local", // The region the server is on.
            gamemode: ['march_madness'], // The selected gamemode.
            player_cap: 80, // Not including bots. Set to 0 to disable.

            featured: true, // Whether the server is featured or not.
            unlisted: false, // Whether the server shows up in the server list (if its id isn't in the url).
            private: false, // Whether the server requires a privileged token to join (except through server travel).

            properties: { // This overrides settings in the config.js file, assuming the selected gamemode doesn't also override it.
                //teams: 4,
                //bot_cap: 0
            }
        },
        {
            share_client_server: false, // Only one server at a time can have this enabled.
            // The above is required if your VM (the machine that hosts the website stuff) doesn't support multi-ports and forces everything through the main server.
            // This also overrides the below host and port settings to be identical to the main server's host/port (by default, 3000).

            host: 'localhost:3006', // Server host location.
            port: 3006, // The port on the server.
            id: 'lf', // (<host>/#<id>)

            region: "Local", // The region the server is on.
            gamemode: ['growth', 'arms_race', 'maze', 'tdm'], // The selected gamemode.
            player_cap: 100, // Not including bots. Set to 0 to disable.

            featured: false, // Whether the server is featured or not.
            unlisted: false, // Whether the server shows up in the server list (if its id isn't in the url).
            private: false, // Whether the server requires a privileged token to join (except through server travel).

            properties: { // This overrides settings in the config.js file, assuming the selected gamemode doesn't also override it.
                teams: 8,
                bot_cap: 25
            }
        },
        {
            share_client_server: false, // Only one server at a time can have this enabled.
            // The above is required if your VM (the machine that hosts the website stuff) doesn't support multi-ports and forces everything through the main server.
            // This also overrides the below host and port settings to be identical to the main server's host/port (by default, 3000).

            host: 'localhost:3007', // Server host location.
            port: 3007, // The port on the server.
            id: 'lg', // (<host>/#<id>)

            region: "Local", // The region the server is on.
            gamemode: ['diep', 'space', 'tdm'], // The selected gamemode.
            player_cap: 80, // Not including bots. Set to 0 to disable.

            featured: false, // Whether the server is featured or not.
            unlisted: false, // Whether the server shows up in the server list (if its id isn't in the url).
            private: false, // Whether the server requires a privileged token to join (except through server travel).

            properties: { // This overrides settings in the config.js file, assuming the selected gamemode doesn't also override it.
                teams: 2,
                bot_cap: 25
            }
        },
        {
            share_client_server: false, // Only one server at a time can have this enabled.
            // The above is required if your VM (the machine that hosts the website stuff) doesn't support multi-ports and forces everything through the main server.
            // This also overrides the below host and port settings to be identical to the main server's host/port (by default, 3000).

            host: 'localhost:3008', // Server host location.
            port: 3008, // The port on the server.
            id: 'lh', // (<host>/#<id>)

            region: "Local", // The region the server is on.
            gamemode: ['growth', 'arms_race', 'assault_booster'], // The selected gamemode.
            player_cap: 80, // Not including bots. Set to 0 to disable.

            featured: false, // Whether the server is featured or not.
            unlisted: false, // Whether the server shows up in the server list (if its id isn't in the url).
            private: false, // Whether the server requires a privileged token to join (except through server travel).

            properties: { // This overrides settings in the config.js file, assuming the selected gamemode doesn't also override it.
                teams: 2,
                bot_cap: 25
            }
        },
        {
            share_client_server: false, // Only one server at a time can have this enabled.
            // The above is required if your VM (the machine that hosts the website stuff) doesn't support multi-ports and forces everything through the main server.
            // This also overrides the below host and port settings to be identical to the main server's host/port (by default, 3000).

            host: 'localhost:3009', // Server host location.
            port: 3009, // The port on the server.
            id: 'li', // (<host>/#<id>)

            region: "Local", // The region the server is on.
            gamemode: ['growth', 'arms_race', 'siege_citadel'], // The selected gamemode.
            player_cap: 80, // Not including bots. Set to 0 to disable.

            featured: false, // Whether the server is featured or not.
            unlisted: false, // Whether the server shows up in the server list (if its id isn't in the url).
            private: false, // Whether the server requires a privileged token to join (except through server travel).

            properties: { // This overrides settings in the config.js file, assuming the selected gamemode doesn't also override it.
                teams: 2,
                bot_cap: 0
            }
        },
        {
            share_client_server: false, // Only one server at a time can have this enabled.
            // The above is required if your VM (the machine that hosts the website stuff) doesn't support multi-ports and forces everything through the main server.
            // This also overrides the below host and port settings to be identical to the main server's host/port (by default, 3000).

            host: 'localhost:3010', // Server host location.
            port: 3010, // The port on the server.
            id: 'lj', // (<host>/#<id>)

            region: "Local", // The region the server is on.
            gamemode: ['dreadwars'], // The selected gamemode.
            player_cap: 80, // Not including bots. Set to 0 to disable.

            featured: false, // Whether the server is featured or not.
            unlisted: false, // Whether the server shows up in the server list (if its id isn't in the url).
            private: false, // Whether the server requires a privileged token to join (except through server travel).

            properties: { // This overrides settings in the config.js file, assuming the selected gamemode doesn't also override it.
                teams: 2,
                bot_cap: 0,
                dreadwars:true
            }
        },
        {
            share_client_server: false, // Only one server at a time can have this enabled.
            // The above is required if your VM (the machine that hosts the website stuff) doesn't support multi-ports and forces everything through the main server.
            // This also overrides the below host and port settings to be identical to the main server's host/port (by default, 3000).

            host: 'localhost:3011', // Server host location.
            port: 3011, // The port on the server.
            id: 'lk', // (<host>/#<id>)

            region: "Local", // The region the server is on.
            gamemode: ['corrupted_tanks', 'maze'], // The selected gamemode.
            player_cap: 80, // Not including bots. Set to 0 to disable.

            featured: false, // Whether the server is featured or not.
            unlisted: false, // Whether the server shows up in the server list (if its id isn't in the url).
            private: false, // Whether the server requires a privileged token to join (except through server travel).

            properties: { // This overrides settings in the config.js file, assuming the selected gamemode doesn't also override it.
                teams: 4,
                bot_cap: 0,
                corrupted_tanks:true
            }
        },
        {
            share_client_server: false, // Only one server at a time can have this enabled.
            // The above is required if your VM (the machine that hosts the website stuff) doesn't support multi-ports and forces everything through the main server.
            // This also overrides the below host and port settings to be identical to the main server's host/port (by default, 3000).

            host: 'localhost:3012', // Server host location.
            port: 3012, // The port on the server.
            id: 'lq', // (<host>/#<id>)

            region: "Local", // The region the server is on.
            gamemode: ['tdm'], // The selected gamemode.
            player_cap: 80, // Not including bots. Set to 0 to disable.

            featured: false, // Whether the server is featured or not.
            unlisted: false, // Whether the server shows up in the server list (if its id isn't in the url).
            private: false, // Whether the server requires a privileged token to join (except through server travel).

            properties: { // This overrides settings in the config.js file, assuming the selected gamemode doesn't also override it.
                teams: 1,
                bot_cap: 15,
            }
        },
    ],
    // Web Server
    allow_ACAO: false, // Access-Control-Allow-Origin, allows any server/client to access data from the WebServer.

    // Map
    map_tile_width: 420,
    map_tile_height: 420,

    // The message that appears once a player spawns.
    spawn_message: "You have spawned! Welcome to the game.\n"
                 + "You will be invulnerable until you move or shoot.\n"
                 + "Please report any bugs you encounter!",
    token_message: "Friendly reminder: Please do not repeatedly kill others with an overpowered tank... JK do whatever you want!!!",

    chat_message_duration: 15_000, // How long a chat message lasts in milliseconds. Includes the fade-out period.
    popup_message_duration: 10_000, // How long (in milliseconds) a popup message lasts before fading out.
    sanitize_chat_input: true, // If you don't want your players to color their messages. They get sanitized after addons interpret them, but before they're added to the chat message dictionary.

    // Seasonal
    fireworks: false, // Toggles fireworks (automatic around July 4 in US-region servers)
    thanksgiving: false, // Toggles the seasonal thanksgiving theme (replaces Motherships with Turkeys)
    spooky_theme: false, // Toggles the seasonal halloween theme (adds eyes to walls and replaces rocks to pumpkins)

    // Gameplay
    game_speed: 1, // General game speed.
    run_speed: 1.5, // General multiplier for acceleration and max speeds.
    max_heartbeat_interval: 600_000, // How long (in milliseconds) a socket can be disconnected before their tank self-destructs.
    respawn_delay: 0, // How long you have to wait to respawn in seconds. Set to 0 to disable.

    bullet_spawn_offset: 1, // Where the bullet spawns, where 1 is fully outside the barrel and -1 is fully inside the barrel, and 0 is halfway between.
    damage_multiplier: 1, // General damage multiplier everytime damage is dealt.
    knockback_multiplier: 1.1, // General knockback multiplier everytime knockback is applied.
    glass_health_factor: 2, // TODO: Figure out how the math behind this works.
    room_bound_force: 0.01,// How strong the force is that confines entities to the map and portals apply to entities.
    soft_max_skill: 0.59, // TODO: Find out what the intention behind the implementation of this configuration is.

    // When an entity reaches a level, this function is called and returns how many skill points that entity gets for reaching that level.
    defineLevelSkillPoints: level => {
        if (level < 2) return 0;
        if (level <= 40) return 1;
        if (level <= 45 && level && 1 === 1) return 1;
        return 0;
    },

    level_cap: 45, // Maximum normally achievable level.
    level_cap_cheat: 45, // Maximum level via the level-up key and auto-level-up.

    skill_cap: 9, // Default skill caps.
    tier_cap: 17, // Amount of tank tiers.
    tier_multiplier: 15, // Level difference between each tier.

    // Bots
    bot_cap: 25, // Maximum number of bots that can be on the server. Set to 0 to disable bots.
    bot_xp_gain: 60, // How much XP bots get until they reach level_cap.
    bot_start_level: 45, // How much XP bots will receive when first created.
    bot_skill_upgrade_chances: [1, 1, 3, 4, 4, 4, 4, 2, 1, 1], // The chances of a bot upgrading a specific skill when skill upgrades are available.
    bot_class_upgrade_chances: [1, 5, 20, 37, 37], // The chances of a bot upgrading a specific amount of times before it stops upgrading.
    bot_name_prefix: "", // This is prefixed before the bot's randomly chosen name.

    // The class that players and bots spawn as.
    spawn_class: 'basic',

    // How every entity regenerates their health.
    regenerate_tick: 100,

    // Food
    enable_food: true, // Allows food to spawn.
    food_cap: 100, // Maximum number of regular food at any time.
    food_cap_nest: 25, // Maximum number of nest food at any time.
    enemy_cap_nest: 15, // Maximum number of enemy nest food at any time.
    food_group_cap: 8, // Number of foods that random food groups spawn with

    // Tiered Food
    food_types: Array(3).fill().map((_, i, a) => [ // Possible food types outside the nest
        // Chance of spawning in exponents of 4
        4 ** (a.length - i),
        // 4-wide dimension of the 4 shape tiers - regular, beta, alpha, omega
        Array(3).fill().map((_, j, b) => [
            // Chance of spawning in exponents of 5
            5 ** (b.length - j),
            // 6-wide dimension of the 6 shiny modifiers
            Array(6).fill().map((_, k, c) => [
                // Chance of spawning, set to 200mil for regular polygons and exponents of 10 otherwise
                k ? 10 ** (c.length - k - 1) : 200_000_000,
                
                // 2-wide dimension of the 2 shape "ranks" - normal, crasher
                // laby_${poly}_${tier}_${shiny}_${rank}
                [
                    [24, `laby_${i}_${j}_${k}_0`],
                    //[1, `laby_${i}_${j}_${k}_1`] // uncomment to enable crashers outside nest
                ]
            ])
        ])
    ]),
    food_types_nest: Array(2).fill().map((_, i, a) => [ // Possible food types in the nest
        // Chance of spawning in exponents of 4
        4 ** (a.length - i),
        // 4-wide dimension of the 4 shape tiers - regular, beta, alpha, omega
        Array(3).fill().map((_, j, b) => [
            // Chance of spawning in exponents of 5
            5 ** (b.length - j),
            // 6-wide dimension of the 6 shiny modifiers
            Array(6).fill().map((_, k, c) => [
                // Chance of spawning, set to 200mil for regular polygons and exponents of 10 otherwise
                k ? 10 ** (c.length - k - 1) : 200_000_000,

                // 2-wide dimension of the 2 shape "ranks" - normal, crasher
                // laby_${poly}_${tier}_${shiny}_${rank}
                [
                    [24, `laby_${i + 3}_${j}_${k}_0`],
                    //[1, `laby_${i + 3}_${j}_${k}_1`] // uncomment to enable crashers in nest
                ]
            ])
        ])
    ]),
    //Food
    food_types: [ // Possible food types outside the nest
        [20000000000, [
            [1024, 'egg'], [256, 'square'], [64, 'triangle'], [16, 'pentagon'], [4, 'betaPentagon'], [1, 'alphaPentagon']
        ]],
        [1, [
            [3125, 'gem'], [625, 'shinySquare'], [125, 'shinyTriangle'], [25, 'shinyPentagon'], [5, 'shinyBetaPentagon'], [1, 'shinyAlphaPentagon']
        ]],
        [0.1, [
            [6836, 'jewel'], [1296, 'legendarySquare'], [216, 'legendaryTriangle'], [36, 'legendaryPentagon'], [6, 'legendaryBetaPentagon'], [1, 'legendaryAlphaPentagon']
        ]],
        [0.005, [
            /*[16807, 'egg'], */[2401, 'shadowSquare'], [343, 'shadowTriangle'], [49, 'shadowPentagon'], [7, 'shadowBetaPentagon'], [1, 'shadowAlphaPentagon']
        ]],
        [0.001, [
            /*[65536, 'egg'], */[8192, 'rainbowSquare'], [1024, 'rainbowTriangle'], [64, 'rainbowPentagon'], [8, 'rainbowBetaPentagon'], [1, 'rainbowAlphaPentagon']
        ]],
        [0.0005, [
            [59549, 'egg'], [6561, 'transSquare'], [729, 'transTriangle'], [81, 'transPentagon'], [9, 'transBetaPentagon'], [1, 'transAlphaPentagon']
        ]],
        [1000, [
            [1000000, 'cnxSphere'], [1000000/4, 'cnxTetrahedron'], [1000000/6, 'cnxCube'], [1000000/8, 'cnxOctahedron'], [1000000/12, 'cnxDodecahedron'], [1000000/20, 'cnxIcosahedron'], [1000000/8, 'cnxCuboctahedron'], [1000000/30, 'cnxIcosidodecahedron'], [1000000/62, 'cnxGreatRhombicosidodecahedron'], [1000000/6, 'cnxRectangularPrism'], [1000000/6, 'cnxSlab'], [1000000/1.4, 'cnxCylinder'], [1000000/1.6, 'cnxCone'], [1000000/2, 'cnxLune'], [1000000/4, 'cnxLune'], [1000000/5, 'cnxSquarePyramid'], [1000000/6, 'cnxPentagonalPyramid'], [1000000/7, 'cnxHexagonalPyramid'], [1000000/8, 'cnxTruncatedTetrahedron'], [1000000/14, 'cnxTruncatedCube'], [1000000/14, 'cnxTruncatedOctahedron'], [1000000/32, 'cnxTruncatedDodecahedron'], [1000000/32, 'cnxTruncatedIcosahedron'], [1000000/12, 'cnxTriakisTetrahedron'], [1000000/24, 'cnxTriakisCube'], [1000000/24, 'cnxTriakisOctahedron'], [1000000/60, 'cnxTriakisDodecahedron'], [1000000/60, 'cnxTriakisIcosahedron'], [1000000/30, 'cnxTriacontahedron'], [1000000/120, 'cnxDisdyakisTriacontahedron']
        ]]
    ],
    food_types_nest: [ // Possible food types in the nest
        [15700000000, [
            [16, 'pentagon'], [ 4, 'betaPentagon'], [ 1, 'alphaPentagon']
        ]],
        [100000, [
            [1000000/12, 'cnxDodecahedron'], [1000000/20, 'cnxIcosahedron'], [1000000/30, 'cnxIcosidodecahedron'], [1000000/62, 'cnxGreatRhombicosidodecahedron'], [1000000/14, 'cnxTruncatedCube'], [1000000/14, 'cnxTruncatedOctahedron'], [1000000/32, 'cnxTruncatedDodecahedron'], [1000000/32, 'cnxTruncatedIcosahedron'], [1000000/12, 'cnxTriakisTetrahedron'], [1000000/24, 'cnxTriakisCube'], [1000000/24, 'cnxTriakisOctahedron'], [1000000/60, 'cnxTriakisDodecahedron'], [1000000/60, 'cnxTriakisIcosahedron'], [1000000/30, 'cnxTriacontahedron'], [1000000/120, 'cnxDisdyakisTriacontahedron']
        ]]
    ],
    enemy_types_nest: [ // Possible enemy food types in the nest
        [1, [
            [1, "crasher"]
        ]],
        [1/20, [
            [1, "sentryGun"], [1, "sentrySwarm"], [1, "sentryTrap"]
        ]]
    ],
    // Classic Food
    classic_food: false, // Enables classic (Old Dreadnoughts) food types.
    classic_food_types: [ // Possible classic food types outside the nest
        [1, [
            [65, 'egg'], [64, 'triangle'], [45, 'square'], [7, 'pentagon']//, [1, 'hexagon']
        ]],
        [1/50000, [
            [625, 'gem'], [125, 'shinyTriangle'], [25, 'shinySquare'], [5, 'shinyPentagon']//, [1, 'shinyHexagon']
        ]],
        [1/1000000, [
            [1296, 'jewel'], [216, 'legendaryTriangle'], [36, 'legendarySquare'], [6, 'legendaryPentagon']//, [1, 'legendaryHexagon']
        ]]
    ],
    classic_food_types_nest: [ // Possible classic food types in the nest
        [1, [
            [16, 'pentagon'], [4, 'betaPentagon'], [1, 'alphaPentagon']/*, [16, 'presentRY'], [16, 'presentRP'], [16, 'presentRW'], [16, 'presentGY'], [16, 'presentGP'], [16, 'presentGW'], [16, 'presentBY'], [16, 'presentBP'], [16, 'presentBW'],*/
        ]]
    ],
    classic_enemy_types_nest: [ // Possible classic enemy food types in the nest
        [1, [
            [1, 'crasher']
        ]],
        [1/20, [
            [1, 'sentryGun'], [1, 'sentrySwarm'], [1, 'sentryTrap']
        ]]
    ],

    // Bosses
    enable_bosses: true,
    boss_spawn_cooldown: 260, // The delay (in seconds) between boss spawns.
    boss_spawn_delay: 6, // The delay (in seconds) between the boss spawn being announced and the boss(es) actually spawning.
    boss_types: [
            {
            bosses: ['eliteDestroyer', 'eliteGunner', 'eliteSprayer', 'eliteBattleship', 'eliteSpawner'],
            amount: [5, 5, 4, 2, 1], chance: 2, nameType: 'a',
        },
        {
            bosses: ['roguePalisade'],
            amount: [4, 1], chance: 1, nameType: 'castle',
            message: 'A strange trembling...',
        },
        {
            bosses: ['summoner', 'eliteSkimmer', 'nestKeeper'],
            amount: [2, 2, 1], chance: 1, nameType: 'a',
            message: 'A strange trembling...',
        },
        {
            bosses: ['paladin', 'freyja', 'zaphkiel', 'nyx', 'theia'],
            amount: [1], chance: 0.01,
            message: 'The world tremors as the celestials are reborn anew!',
        },
        {
            bosses: ['julius', 'genghis', 'napoleon'],
            amount: [1], chance: 0.1,
            message: 'The darkness arrives as the realms are torn apart!',
        },
        {
            bosses: ["julius", "genghis", "napoleon"],
            amount: [1], chance: 0.1,
            message: "The darkness arrives as the realms are torn apart!",
        },
        {
            bosses: ["kronos"],
            amount: [1], chance: 0.01,
            message: "The sky darkens as the ground slowly begins to crumble... The end is near.",
        },
        {
            bosses: ["bob", "amun"],
            amount: [12, 1], chance: 0.00001,
            message: "The realms rip apart as a boss who was never supposed to enter you realm... HAS ARRIVED!!!",
    }
    ],

    // How many members a team can have in comparison to an unweighed team.
    // Example: We have team A and B. If the weight of A is 2 and B is 1, then the game will try to give A twice as many members as B.
    // Check game/gamemodes/config to see how this works.
    team_weights: {},

    // Fun
    brain_damage: true, // Disabled by default for epilepsy concerns. Violently shakes your camera and tank if you name yourself 'Brain Damage'.
    random_body_colors: false,

    // These are the default values for gamemode related things.
    // If you want to change them, copy the values you want to change to the server's properties.
    // DO NOT change them here unless you know what you are doing!
    gamemode_name_prefixes: [],
    arena_shape: 'rect',
    arms_race: false,
    blackout: false,
    clan_wars: false,
    diep: false,
    domination: false,
    growth: false,
    groups: false,
    march_madness: false,
    mode: 'ffa',
    mothership: false,
    retrograde: false,
    siege: false,
    space_physics: false,
    spawn_confinement: {},
    tag: false,
    teams: 4,
    train: false,
    use_limited_waves: false,

    // Room setup
    room_setup: ['room_default'],
}
