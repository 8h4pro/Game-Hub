let scene;
let camera;
let renderer;

let car;

let speed = 0;
let maxSpeed = 1.2;
let acceleration = 0.025;
let friction = 0.015;

let keys = {};

let startTime;
let timerRunning = false;

let currentTrack = 0;

let trackObjects = [];

let checkpoints = [];

let lastCheckpoint = {
    x: 0,
    y: 0.7,
    z: 10
};

let currentCheckpoint = 0;

let carOffset = 0;


// ==========================================
// TRACKS
// ==========================================

const tracks = [

    // ==========================================
    // A01 - SPEED RUSH
    // EASY
    // ==========================================

    {
        name: "A01 - SPEED RUSH",

        length: 500,

        width: 12,

        turns: [

            { z: 0, x: 0 },

            { z: -60, x: 0 },

            { z: -120, x: 3 },

            { z: -180, x: 6 },

            { z: -240, x: 6 },

            { z: -300, x: 2 },

            { z: -360, x: -3 },

            { z: -420, x: 0 },

            { z: -500, x: 0 }

        ]

    },


    // ==========================================
    // B01 - BACK TO BASICS
    // MEDIUM
    // ==========================================

    {
        name: "B01 - BACK TO BASICS",

        length: 520,

        width: 11,

        turns: [

            { z: 0, x: 0 },

            { z: -50, x: 4 },

            { z: -100, x: 4 },

            { z: -150, x: -4 },

            { z: -200, x: -5 },

            { z: -250, x: 2 },

            { z: -300, x: 6 },

            { z: -360, x: 6 },

            { z: -420, x: -3 },

            { z: -480, x: 0 },

            { z: -520, x: 0 }

        ]

    },


    // ==========================================
    // C01 - COASTLINE
    // MEDIUM / HARD
    // ==========================================

    {
        name: "C01 - COASTLINE",

        length: 560,

        width: 12,

        turns: [

            { z: 0, x: 0 },

            { z: -60, x: 2 },

            { z: -120, x: 6 },

            { z: -180, x: 6 },

            { z: -240, x: 2 },

            { z: -300, x: -5 },

            { z: -360, x: -6 },

            { z: -420, x: -2 },

            { z: -480, x: 5 },

            { z: -530, x: 0 },

            { z: -560, x: 0 }

        ]

    },


    // ==========================================
    // D01 - DESERT STORM
    // HARD
    // ==========================================

    {
        name: "D01 - DESERT STORM",

        length: 600,

        width: 10,

        turns: [

            { z: 0, x: 0 },

            { z: -45, x: 5 },

            { z: -90, x: 5 },

            { z: -135, x: -5 },

            { z: -180, x: -5 },

            { z: -225, x: 4 },

            { z: -270, x: 6 },

            { z: -320, x: 0 },

            { z: -370, x: -6 },

            { z: -420, x: -4 },

            { z: -470, x: 5 },

            { z: -520, x: 6 },

            { z: -570, x: 0 },

            { z: -600, x: 0 }

        ]

    },


    // ==========================================
    // E01 - ENDURANCE
    // VERY HARD
    // ==========================================

    {
        name: "E01 - ENDURANCE",

        length: 700,

        width: 10,

        turns: [

            { z: 0, x: 0 },

            { z: -50, x: 4 },

            { z: -100, x: 6 },

            { z: -150, x: 2 },

            { z: -200, x: -5 },

            { z: -250, x: -6 },

            { z: -300, x: -2 },

            { z: -350, x: 5 },

            { z: -400, x: 6 },

            { z: -450, x: 0 },

            { z: -500, x: -6 },

            { z: -550, x: -5 },

            { z: -600, x: 5 },

            { z: -650, x: 6 },

            { z: -700, x: 0 }

        ]

    }

];


// ==========================================
// COIN REWARD TIERS
// ==========================================

const trackCoinTiers = [

    // A01

    [

        {
            time: 35,
            coins: 10
        },

        {
            time: 28,
            coins: 20
        },

        {
            time: 23,
            coins: 40
        }

    ],


    // B01

    [

        {
            time: 38,
            coins: 10
        },

        {
            time: 30,
            coins: 25
        },

        {
            time: 25,
            coins: 45
        }

    ],


    // C01

    [

        {
            time: 42,
            coins: 10
        },

        {
            time: 34,
            coins: 25
        },

        {
            time: 28,
            coins: 50
        }

    ],


    // D01

    [

        {
            time: 48,
            coins: 15
        },

        {
            time: 39,
            coins: 30
        },

        {
            time: 32,
            coins: 55
        }

    ],


    // E01

    [

        {
            time: 58,
            coins: 15
        },

        {
            time: 47,
            coins: 35
        },

        {
            time: 38,
            coins: 60
        }

    ]

];


// ==========================================
// START
// ==========================================

init();

animate();


// ==========================================
// INITIALIZE GAME
// ==========================================

function init() {

    scene =
        new THREE.Scene();


    scene.background =
        new THREE.Color(
            0x87ceeb
        );


    // ======================================
    // CAMERA
    // ======================================

    camera =
        new THREE.PerspectiveCamera(

            75,

            window.innerWidth /
            window.innerHeight,

            0.1,

            1000

        );


    camera.position.set(

        0,

        5,

        10

    );


    // ======================================
    // RENDERER
    // ======================================

    renderer =
        new THREE.WebGLRenderer({

            antialias: true

        });


    renderer.setSize(

        window.innerWidth,

        window.innerHeight

    );


    document.body.appendChild(

        renderer.domElement

    );


    // ======================================
    // LIGHT
    // ======================================

    const sunlight =
        new THREE.DirectionalLight(

            0xffffff,

            2

        );


    sunlight.position.set(

        10,

        20,

        10

    );


    scene.add(

        sunlight

    );


    const ambientLight =
        new THREE.AmbientLight(

            0xffffff,

            0.6

        );


    scene.add(

        ambientLight

    );


    // ======================================
    // CAR
    // ======================================

    const carGeometry =
        new THREE.BoxGeometry(

            2,

            0.7,

            3.5

        );


    const carMaterial =
        new THREE.MeshStandardMaterial({

            color: 0xff2222

        });


    car =
        new THREE.Mesh(

            carGeometry,

            carMaterial

        );


    car.position.set(

        0,

        0.7,

        10

    );


    scene.add(

        car

    );


    // ======================================
    // CAR ROOF
    // ======================================

    const roofGeometry =
        new THREE.BoxGeometry(

            1.5,

            0.5,

            1.5

        );


    const roofMaterial =
        new THREE.MeshStandardMaterial({

            color: 0xaa0000

        });


    const roof =
        new THREE.Mesh(

            roofGeometry,

            roofMaterial

        );


    roof.position.y =
        0.55;


    car.add(

        roof

    );


    // ======================================
    // CREATE TRACK
    // ======================================

    createTrack(

        currentTrack

    );


    // ======================================
    // KEYBOARD
    // ======================================

    window.addEventListener(

        "keydown",

        function(event) {

            const key =
                event.key.toLowerCase();


            keys[key] = true;


            // TRACK 1-5

            if (

                event.key >= "1" &&

                event.key <= "5"

            ) {

                selectTrack(

                    Number(event.key) - 1

                );

            }


            // R = CHECKPOINT

            if (

                key === "r"

            ) {

                respawnCheckpoint();

            }


            // T = RESTART

            if (

                key === "t"

            ) {

                restartRun();

            }

        }

    );


    window.addEventListener(

        "keyup",

        function(event) {

            keys[

                event.key.toLowerCase()

            ] = false;

        }

    );


    // ======================================
    // RESIZE
    // ======================================

    window.addEventListener(

        "resize",

        function() {

            camera.aspect =

                window.innerWidth /

                window.innerHeight;


            camera.updateProjectionMatrix();


            renderer.setSize(

                window.innerWidth,

                window.innerHeight

            );

        }

    );


    createTrackMenu();


    selectTrack(0);

}


// ==========================================
// GET TRACK CENTER
// ==========================================

function getTrackCenterX(z) {

    const track =
        tracks[currentTrack];


    const points =
        track.turns;


    if (z >= points[0].z) {

        return points[0].x;

    }


    for (

        let i = 0;

        i < points.length - 1;

        i++

    ) {

        const p1 =
            points[i];

        const p2 =
            points[i + 1];


        if (

            z <= p1.z &&

            z >= p2.z

        ) {

            const amount =

                (z - p1.z) /

                (p2.z - p1.z);


            return (

                p1.x +

                (p2.x - p1.x) *

                amount

            );

        }

    }


    return points[points.length - 1].x;

}


// ==========================================
// CREATE TRACK
// ==========================================

function createTrack(trackNumber) {

    removeTrack();


    checkpoints = [];


    const track =
        tracks[trackNumber];


    // ======================================
    // GROUND
    // ======================================

    const groundGeometry =
        new THREE.PlaneGeometry(

            300,

            900

        );


    const groundMaterial =
        new THREE.MeshStandardMaterial({

            color: 0x3b8c3b

        });


    const ground =
        new THREE.Mesh(

            groundGeometry,

            groundMaterial

        );


    ground.rotation.x =
        -Math.PI / 2;


    ground.position.z =
        -350;


    scene.add(

        ground

    );


    trackObjects.push(

        ground

    );


    // ======================================
    // ROAD SEGMENTS
    // ======================================

    for (

        let i = 0;

        i < track.turns.length - 1;

        i++

    ) {

        const p1 =
            track.turns[i];

        const p2 =
            track.turns[i + 1];


        const dx =
            p2.x - p1.x;


        const dz =
            p2.z - p1.z;


        const length =
            Math.sqrt(

                dx * dx +

                dz * dz

            );


        const centerX =
            (p1.x + p2.x) / 2;


        const centerZ =
            (p1.z + p2.z) / 2;


        const roadGeometry =
            new THREE.BoxGeometry(

                track.width,

                0.2,

                length

            );


        const roadMaterial =
            new THREE.MeshStandardMaterial({

                color: 0x333333

            });


        const road =
            new THREE.Mesh(

                roadGeometry,

                roadMaterial

            );


        road.position.set(

            centerX,

            0.1,

            centerZ

        );


        road.rotation.y =

            Math.atan2(

                dx,

                -dz

            );


        scene.add(

            road

        );


        trackObjects.push(

            road

        );


        // ==================================
        // CENTER LINE
        // ==================================

        const lineGeometry =
            new THREE.BoxGeometry(

                0.3,

                0.05,

                length

            );


        const lineMaterial =
            new THREE.MeshStandardMaterial({

                color: 0xffffff

            });


        const line =
            new THREE.Mesh(

                lineGeometry,

                lineMaterial

            );


        line.position.set(

            centerX,

            0.22,

            centerZ

        );


        line.rotation.y =

            Math.atan2(

                dx,

                -dz

            );


        scene.add(

            line

        );


        trackObjects.push(

            line

        );

    }


    // ======================================
    // CHECKPOINTS
    // ======================================

    for (

        let i = 1;

        i < track.turns.length - 1;

        i++

    ) {

        const point =
            track.turns[i];


        const previous =
            track.turns[i - 1];


        const next =
            track.turns[i + 1];


        const dx =
            next.x - previous.x;


        const dz =
            next.z - previous.z;


        const checkpointGeometry =
            new THREE.BoxGeometry(

                track.width,

                3,

                0.5

            );


        const checkpointMaterial =
            new THREE.MeshStandardMaterial({

                color: 0x00ffff,

                transparent: true,

                opacity: 0.35

            });


        const checkpoint =
            new THREE.Mesh(

                checkpointGeometry,

                checkpointMaterial

            );


        checkpoint.position.set(

            point.x,

            1.5,

            point.z

        );


        checkpoint.rotation.y =

            Math.atan2(

                dx,

                -dz

            );


        scene.add(

            checkpoint

        );


        trackObjects.push(

            checkpoint

        );


        checkpoints.push({

            mesh: checkpoint,

            x: point.x,

            z: point.z,

            passed: false

        });

    }


    // ======================================
    // FINISH LINE
    // ======================================

    const lastPoint =
        track.turns[

            track.turns.length - 1

        ];


    const previousPoint =
        track.turns[

            track.turns.length - 2

        ];


    const finishDX =
        lastPoint.x -

        previousPoint.x;


    const finishDZ =
        lastPoint.z -

        previousPoint.z;


    const finishGeometry =
        new THREE.BoxGeometry(

            track.width,

            0.05,

            2

        );


    const finishMaterial =
        new THREE.MeshStandardMaterial({

            color: 0xffffff

        });


    const finish =
        new THREE.Mesh(

            finishGeometry,

            finishMaterial

        );


    finish.position.set(

        lastPoint.x,

        0.23,

        lastPoint.z

    );


    finish.rotation.y =

        Math.atan2(

            finishDX,

            -finishDZ

        );


    scene.add(

        finish

    );


    trackObjects.push(

        finish

    );

}


// ==========================================
// REMOVE TRACK
// ==========================================

function removeTrack() {

    for (

        let object of trackObjects

    ) {

        scene.remove(

            object

        );

    }


    trackObjects = [];

}


// ==========================================
// SELECT TRACK
// ==========================================

function selectTrack(number) {

    currentTrack =
        number;


    createTrack(

        currentTrack

    );


    restartRun();


    document.getElementById(

        "trackName"

    ).innerText =

        tracks[

            currentTrack

        ].name;


    document.getElementById(

        "best"

    ).innerText =

        "Best: " +

        getBestTime().toFixed(2);


    updateButtons();

}


// ==========================================
// UPDATE GAME
// ==========================================

function update() {

    if (

        !timerRunning

    ) {

        return;

    }


    // ======================================
    // ACCELERATION
    // ======================================

    if (

        keys["w"] ||

        keys["arrowup"]

    ) {

        speed +=

            acceleration;


        if (

            speed > maxSpeed

        ) {

            speed =

                maxSpeed;

        }

    }


    // ======================================
    // BRAKING
    // ======================================

    else if (

        keys["s"] ||

        keys["arrowdown"]

    ) {

        speed -=

            acceleration * 2;


        if (

            speed < 0

        ) {

            speed = 0;

        }

    }


    // ======================================
    // FRICTION
    // ======================================

    else {

        speed -=

            friction;


        if (

            speed < 0

        ) {

            speed = 0;

        }

    }


    // ======================================
    // STEERING
    // ======================================

    let steering = 0;


    // LEFT = LEFT

    if (

        keys["a"] ||

        keys["arrowleft"]

    ) {

        steering = -1;

    }


    // RIGHT = RIGHT

    if (

        keys["d"] ||

        keys["arrowright"]

    ) {

        steering = 1;

    }


    carOffset +=

        steering *

        speed *

        0.8;


    // ======================================
    // ROAD WIDTH
    // ======================================

    const roadWidth =

        tracks[

            currentTrack

        ].width / 2 - 1;


    if (

        carOffset > roadWidth

    ) {

        carOffset =

            roadWidth;

    }


    if (

        carOffset < -roadWidth

    ) {

        carOffset =

            -roadWidth;

    }


    // ======================================
    // MOVE CAR FORWARD
    // ======================================

    car.position.z -=

        speed;


    // ======================================
    // FOLLOW TRACK CENTER
    // ======================================

    const trackCenter =

        getTrackCenterX(

            car.position.z

        );


    car.position.x =

        trackCenter +

        carOffset;


    // ======================================
    // CHECK CHECKPOINTS
    // ======================================

    checkCheckpoints();


    // ======================================
    // CAMERA
    // ======================================

    camera.position.x =

        car.position.x;


    camera.position.y =

        5;


    camera.position.z =

        car.position.z + 10;


    camera.lookAt(

        car.position.x,

        car.position.y,

        car.position.z - 15

    );


    // ======================================
    // CAR ROTATION
    // ======================================

    const aheadCenter =

        getTrackCenterX(

            car.position.z - 10

        );


    const directionX =

        aheadCenter -

        trackCenter;


    car.rotation.y =

        Math.atan2(

            directionX,

            -10

        );


    // ======================================
    // SPEED DISPLAY
    // ======================================

    const speedElement =

        document.getElementById(

            "speed"

        );


    if (speedElement) {

        speedElement.innerText =

            "Speed: " +

            Math.round(

                speed * 100

            );

    }


    // ======================================
    // TIMER
    // ======================================

    const time =

        (

            performance.now() -

            startTime

        ) / 1000;


    const timerElement =

        document.getElementById(

            "timer"

        );


    if (timerElement) {

        timerElement.innerText =

            "Time: " +

            time.toFixed(2);

    }


    // ======================================
    // FINISH
    // ======================================

    const finishZ =

        tracks[

            currentTrack

        ].turns[

            tracks[currentTrack].turns.length - 1

        ].z;


    if (

        car.position.z < finishZ

    ) {

        finishRace(

            time

        );

    }

}


// ==========================================
// CHECK CHECKPOINTS
// ==========================================

function checkCheckpoints() {

    for (

        let i = 0;

        i < checkpoints.length;

        i++

    ) {

        const checkpoint =

            checkpoints[i];


        if (

            checkpoint.passed

        ) {

            continue;

        }


        const distance =

            Math.abs(

                car.position.z -

                checkpoint.z

            );


        if (

            distance < 5

        ) {

            checkpoint.passed =

                true;


            currentCheckpoint =

                i + 1;


            lastCheckpoint = {

                x: checkpoint.x,

                y: 0.7,

                z: checkpoint.z + 5

            };


            checkpoint.mesh.material =

                new THREE.MeshStandardMaterial({

                    color: 0x00ff00,

                    transparent: true,

                    opacity: 0.4

                });

        }

    }

}


// ==========================================
// R = RESPAWN CHECKPOINT
// ==========================================

function respawnCheckpoint() {

    if (

        !timerRunning

    ) {

        return;

    }


    car.position.set(

        lastCheckpoint.x,

        lastCheckpoint.y,

        lastCheckpoint.z

    );


    carOffset = 0;


    speed = 0;

}


// ==========================================
// T = RESTART RUN
// ==========================================

function restartRun() {

    const firstPoint =

        tracks[

            currentTrack

        ].turns[0];


    car.position.set(

        firstPoint.x,

        0.7,

        10

    );


    carOffset = 0;


    speed = 0;


    currentCheckpoint =

        0;


    lastCheckpoint = {

        x: firstPoint.x,

        y: 0.7,

        z: 10

    };


    // ======================================
    // RESET CHECKPOINTS
    // ======================================

    for (

        let checkpoint of checkpoints

    ) {

        checkpoint.passed =

            false;


        checkpoint.mesh.material =

            new THREE.MeshStandardMaterial({

                color: 0x00ffff,

                transparent: true,

                opacity: 0.35

            });

    }


    // ======================================
    // RESET TIMER
    // ======================================

    startTime =

        performance.now();


    timerRunning =

        true;


    const timerElement =

        document.getElementById(

            "timer"

        );


    if (timerElement) {

        timerElement.innerText =

            "Time: 0.00";

    }

}


// ==========================================
// FINISH RACE
// ==========================================

function finishRace(time) {

    timerRunning =

        false;


    const best =

        getBestTime();


    // ======================================
    // BEST TIME
    // ======================================

    if (

        best === 0 ||

        time < best

    ) {

        localStorage.setItem(

            "trackRacerBest_" +

            currentTrack,

            time

        );


        alert(

            "NEW BEST TIME!\n\n" +

            tracks[

                currentTrack

            ].name +

            "\n" +

            time.toFixed(2) +

            " seconds"

        );

    }


    else {

        alert(

            "FINISH!\n\n" +

            tracks[

                currentTrack

            ].name +

            "\n" +

            time.toFixed(2) +

            " seconds"

        );

    }


    // ======================================
    // UPDATE BEST
    // ======================================

    const bestElement =

        document.getElementById(

            "best"

        );


    if (bestElement) {

        bestElement.innerText =

            "Best: " +

            getBestTime().toFixed(2);

    }


    // ======================================
    // GIVE COINS
    // ======================================

    giveTrackRacerCoins(

        time

    );

}


// ==========================================
// GET BEST TIME
// ==========================================

function getBestTime() {

    const value =

        localStorage.getItem(

            "trackRacerBest_" +

            currentTrack

        );


    if (!value) {

        return 0;

    }


    return Number(

        value

    );

}


// ==========================================
// GIVE TRACK RACER COINS
// ==========================================

function giveTrackRacerCoins(time) {

    const tiers =

        trackCoinTiers[

            currentTrack

        ];


    let reward = 0;


    // ======================================
    // CHECK BEST TIER FIRST
    // ======================================

    for (

        let i = tiers.length - 1;

        i >= 0;

        i--

    ) {

        if (

            time <= tiers[i].time

        ) {

            reward =

                tiers[i].coins;

            break;

        }

    }


    // ======================================
    // GIVE COINS
    // ======================================

    if (

        reward > 0

    ) {

        // Use Game Hub coin system

        if (

            typeof addCoins ===

            "function"

        ) {

            addCoins(

                reward

            );

        }


        // Update visible coin counter

        const gameCoins =

            document.getElementById(

                "gameCoins"

            );


        if (

            gameCoins

        ) {

            if (

                typeof getCoins ===

                "function"

            ) {

                gameCoins.innerText =

                    getCoins();

            }

        }


        alert(

            "COINS EARNED!\n\n" +

            "+" +

            reward +

            " 🪙"

        );

    }

}


// ==========================================
// CREATE TRACK MENU
// ==========================================

function createTrackMenu() {

    const menu =

        document.createElement(

            "div"

        );


    menu.id =

        "trackMenu";


    menu.style.position =

        "fixed";


    menu.style.top =

        "20px";


    menu.style.right =

        "320px";


    menu.style.zIndex =

        "20";


    menu.style.color =

        "white";


    menu.style.background =

        "rgba(0,0,0,0.7)";


    menu.style.padding =

        "15px";


    menu.style.borderRadius =

        "10px";


    menu.style.fontFamily =

        "Arial, sans-serif";


    // ======================================
    // TITLE
    // ======================================

    const title =

        document.createElement(

            "div"

        );


    title.innerText =

        "TRACK SELECT";


    title.style.fontWeight =

        "bold";


    title.style.marginBottom =

        "10px";


    menu.appendChild(

        title

    );


    // ======================================
    // TRACK BUTTONS
    // ======================================

    for (

        let i = 0;

        i < tracks.length;

        i++

    ) {

        const button =

            document.createElement(

                "button"

            );


        button.innerText =

            (i + 1) +

            ". " +

            tracks[i].name;


        button.style.display =

            "block";


        button.style.width =

            "200px";


        button.style.margin =

            "5px 0";


        button.style.padding =

            "8px";


        button.style.border =

            "none";


        button.style.borderRadius =

            "5px";


        button.style.cursor =

            "pointer";


        button.onclick =

            function() {

                selectTrack(i);

            };


        menu.appendChild(

            button

        );

    }


    document.body.appendChild(

        menu

    );

}


// ==========================================
// UPDATE TRACK BUTTONS
// ==========================================

function updateButtons() {

    const buttons =

        document.querySelectorAll(

            "#trackMenu button"

        );


    buttons.forEach(

        function(

            button,

            index

        ) {

            if (

                index ===

                currentTrack

            ) {

                button.style.background =

                    "#00aaff";

                button.style.color =

                    "white";

            }


            else {

                button.style.background =

                    "#ff3b30";

                button.style.color =

                    "white";

            }

        }

    );

}


// ==========================================
// GAME LOOP
// ==========================================

function animate() {

    requestAnimationFrame(

        animate

    );


    update();


    renderer.render(

        scene,

        camera

    );

}
