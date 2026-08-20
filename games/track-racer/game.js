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
            { z: -80, x: 0 },
            { z: -160, x: 7 },
            { z: -240, x: 7 },
            { z: -320, x: -7 },
            { z: -400, x: -7 },
            { z: -500, x: 0 }
        ]
    },


    // ==========================================
    // B01 - BACK TO BASICS
    // ==========================================

    {
        name: "B01 - BACK TO BASICS",
        length: 550,
        width: 11,

        turns: [
            { z: 0, x: 0 },
            { z: -60, x: 0 },
            { z: -120, x: 8 },
            { z: -180, x: 8 },
            { z: -240, x: -8 },
            { z: -300, x: -8 },
            { z: -360, x: 5 },
            { z: -420, x: 5 },
            { z: -480, x: -5 },
            { z: -550, x: 0 }
        ]
    },


    // ==========================================
    // C01 - COASTLINE
    // ==========================================

    {
        name: "C01 - COASTLINE",
        length: 600,
        width: 12,

        turns: [
            { z: 0, x: 0 },
            { z: -70, x: 4 },
            { z: -140, x: 9 },
            { z: -210, x: 9 },
            { z: -280, x: 0 },
            { z: -350, x: -9 },
            { z: -420, x: -9 },
            { z: -490, x: -3 },
            { z: -550, x: 7 },
            { z: -600, x: 0 }
        ]
    },


    // ==========================================
    // D01 - DESERT STORM
    // ==========================================

    {
        name: "D01 - DESERT STORM",
        length: 650,
        width: 10,

        turns: [
            { z: 0, x: 0 },
            { z: -50, x: 7 },
            { z: -100, x: 7 },
            { z: -150, x: -7 },
            { z: -200, x: -7 },
            { z: -250, x: 6 },
            { z: -300, x: 8 },
            { z: -350, x: 0 },
            { z: -400, x: -8 },
            { z: -450, x: -8 },
            { z: -500, x: 7 },
            { z: -550, x: 7 },
            { z: -600, x: -4 },
            { z: -650, x: 0 }
        ]
    },


    // ==========================================
    // E01 - ENDURANCE
    // ==========================================

    {
        name: "E01 - ENDURANCE",
        length: 750,
        width: 10,

        turns: [
            { z: 0, x: 0 },
            { z: -50, x: 5 },
            { z: -100, x: 9 },
            { z: -150, x: 9 },
            { z: -200, x: -8 },
            { z: -250, x: -8 },
            { z: -300, x: 5 },
            { z: -350, x: 9 },
            { z: -400, x: 0 },
            { z: -450, x: -9 },
            { z: -500, x: -9 },
            { z: -550, x: 7 },
            { z: -600, x: 9 },
            { z: -650, x: -6 },
            { z: -700, x: -4 },
            { z: -750, x: 0 }
        ]
    }

];


// ==========================================
// COIN REWARDS
// ==========================================

const trackCoinTiers = [

    [
        { time: 35, coins: 10 },
        { time: 28, coins: 20 },
        { time: 23, coins: 40 }
    ],

    [
        { time: 40, coins: 10 },
        { time: 32, coins: 25 },
        { time: 26, coins: 45 }
    ],

    [
        { time: 45, coins: 10 },
        { time: 36, coins: 25 },
        { time: 29, coins: 50 }
    ],

    [
        { time: 52, coins: 15 },
        { time: 42, coins: 30 },
        { time: 34, coins: 55 }
    ],

    [
        { time: 60, coins: 15 },
        { time: 48, coins: 35 },
        { time: 39, coins: 60 }
    ]

];


// ==========================================
// START
// ==========================================

init();

animate();


// ==========================================
// INIT
// ==========================================

function init() {

    scene = new THREE.Scene();

    scene.background =
        new THREE.Color(0x87ceeb);


    // CAMERA

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


    // RENDERER

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


    // LIGHT

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


    // CAR

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


    // CAR ROOF

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


    // TRACK

    createTrack(
        currentTrack
    );


    // KEYBOARD

    window.addEventListener(
        "keydown",
        function(event) {

            const key =
                event.key.toLowerCase();

            keys[key] = true;


            // TRACK SELECT

            if (
                event.key >= "1" &&
                event.key <= "5"
            ) {

                selectTrack(
                    Number(event.key) - 1
                );

            }


            // CHECKPOINT

            if (
                key === "r"
            ) {

                respawnCheckpoint();

            }


            // RESTART

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


    // RESIZE

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


    if (
        z >= points[0].z
    ) {

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


    return points[
        points.length - 1
    ].x;

}


// ==========================================
// GET TRACK DIRECTION
// ==========================================

function getTrackDirection(z) {

    const smallStep = 1;

    const x1 =
        getTrackCenterX(z);

    const x2 =
        getTrackCenterX(
            z - smallStep
        );


    return Math.atan2(
        x2 - x1,
        -smallStep
    );

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
            1000
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
        -375;


    scene.add(
        ground
    );


    trackObjects.push(
        ground
    );


    // ======================================
    // SMALL ROAD SEGMENTS
    // ======================================

    const segmentSize = 5;


    for (
        let z = 0;
        z > -track.length;
        z -= segmentSize
    ) {

        const nextZ =
            Math.max(
                z - segmentSize,
                -track.length
            );


        const centerX1 =
            getTrackCenterX(z);


        const centerX2 =
            getTrackCenterX(nextZ);


        const centerX =
            (centerX1 + centerX2) / 2;


        const centerZ =
            (z + nextZ) / 2;


        const dx =
            centerX2 - centerX1;


        const dz =
            nextZ - z;


        const segmentLength =
            Math.sqrt(
                dx * dx +
                dz * dz
            );


        // ==================================
        // ROAD
        // ==================================

        const roadGeometry =
            new THREE.BoxGeometry(
                track.width,
                0.2,
                segmentLength + 0.3
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
                3
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


        // Rotate checkpoint
        // across the road

        checkpoint.rotation.y =
            getTrackDirection(
                point.z
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

    const finishPoint =
        track.turns[
            track.turns.length - 1
        ];


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
        finishPoint.x,
        0.23,
        finishPoint.z
    );


    finish.rotation.y =
        getTrackDirection(
            finishPoint.z
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


    const trackName =
        document.getElementById(
            "trackName"
        );


    if (trackName) {

        trackName.innerText =
            tracks[
                currentTrack
            ].name;

    }


    const best =
        document.getElementById(
            "best"
        );


    if (best) {

        best.innerText =
            "Best: " +
            getBestTime().toFixed(2);

    }


    updateButtons();

}


// ==========================================
// UPDATE
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
    // BRAKE
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


    // A = LEFT

    if (
        keys["a"] ||
        keys["arrowleft"]
    ) {

        steering = -1;

    }


    // D = RIGHT

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
    // ROAD LIMIT
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
    // MOVE FORWARD
    // ======================================

    car.position.z -=
        speed;


    // ======================================
    // FOLLOW ROAD
    // ======================================

    const roadCenter =
        getTrackCenterX(
            car.position.z
        );


    car.position.x =
        roadCenter +
        carOffset;


    // ======================================
    // CAR ROTATION
    // ======================================

    const direction =
        getTrackDirection(
            car.position.z
        );


    car.rotation.y =
        direction;


    // ======================================
    // CHECKPOINTS
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
    // SPEED DISPLAY
    // ======================================

    const speedDisplay =
        document.getElementById(
            "speed"
        );


    if (
        speedDisplay
    ) {

        speedDisplay.innerText =
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


    const timerDisplay =
        document.getElementById(
            "timer"
        );


    if (
        timerDisplay
    ) {

        timerDisplay.innerText =
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
            tracks[currentTrack]
                .turns.length - 1
        ].z;


    if (
        car.position.z <
        finishZ
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

                z:
                    checkpoint.z + 5

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
// R = CHECKPOINT
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
// T = RESTART
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


    // RESET CHECKPOINTS

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


    // TIMER

    startTime =
        performance.now();


    timerRunning =
        true;


    const timer =
        document.getElementById(
            "timer"
        );


    if (
        timer
    ) {

        timer.innerText =
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


    // NEW BEST

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


    const bestDisplay =
        document.getElementById(
            "best"
        );


    if (
        bestDisplay
    ) {

        bestDisplay.innerText =
            "Best: " +
            getBestTime().toFixed(2);

    }


    // COINS

    giveTrackRacerCoins(
        time
    );

}


// ==========================================
// BEST TIME
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
// COINS
// ==========================================

function giveTrackRacerCoins(time) {

    const tiers =
        trackCoinTiers[
            currentTrack
        ];


    let reward = 0;


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


    if (
        reward > 0
    ) {

        if (
            typeof addCoins ===
            "function"
        ) {

            addCoins(
                reward
            );

        }


        const gameCoins =
            document.getElementById(
                "gameCoins"
            );


        if (
            gameCoins &&
            typeof getCoins ===
            "function"
        ) {

            gameCoins.innerText =
                getCoins();

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
// TRACK MENU
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
        "20px";


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
            "220px";


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
// UPDATE BUTTONS
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
