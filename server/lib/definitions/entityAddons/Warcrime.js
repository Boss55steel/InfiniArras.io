module.exports = ({ Class, Config }) => {
    // return console.log('BY ENABLING THIS ADDON, YOU WILL COMMIT A WAR CRIME!')

    Class.redCross = {
        PARENT: ["healerSymbol"],          // string → array
        COLOR: "#FF0000",
        BORDERLESS: true,
        CONTROLLERS: [["spin", { startAngle: Math.PI / 4, speed: 0, independent: true }]],
        GUNS: [],
    };

    Class.whiteBackground = {
        PARENT: ["genericTank"],           // genericEntity → genericTank (safer)
        SHAPE: 4,
        COLOR: "#FFFFFF",
        MIRROR_MASTER_ANGLE: true,
        BORDERLESS: true,
        GUNS: [],
    };

    Class.warCrime = {
        PARENT: ["genericTank"],
        LABEL: "geneva convention violation",
        SHAPE: 4,
        SIZE: 25,
        BORDERLESS: true,
        CONTROLLERS: [["spin", { startAngle: Math.PI / 4, speed: 0, independent: true }]],
        GUNS: [],
        TURRETS: [
            {
                POSITION: [20, 0, 0, 0, 360, 1],   // object format → array [size,x,y,angle,arc,layer]
                TYPE: "whiteBackground",
            },
            {
                POSITION: [12.5, 0, 0, 0, 360, 1],
                TYPE: "redCross",                  // array wrapper removed
            },
        ],
    };

    // Hook into spawn class and enable REPL
    Config.REPL_WINDOW = true;
    Config.SPAWN_CLASS = "warCrime";

    // PASTE THIS INTO THE CONSOLE TO TURN ALL EXISTING ENTITIES INTO WAR CRIMES:
    /*
        let queueArr = []
        for (let i = 0; i < entities.length; i++) queueArr.push(entities[i])
        for (let i = 0; i < queueArr.length; i++) queueArr[i].define('warCrime')
        queueArr = []
    */
};