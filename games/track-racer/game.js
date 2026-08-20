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


// ==========================================
// TRACKS
// ==========================================

const tracks = [

    {
        name: "SPEED RUSH",
        length: 500,
        width: 12,

        turns: [
            { z: 10, x: 0 },
            { z: -60, x: 0 },
            { z: -110, x: 8 },
            { z: -160, x: 8 },
            { z: -210, x: -8 },
            { z: -260, x: -8 },
            { z: -320, x: 8 },
            { z: -380, x: 8 },
            { z: -440, x: 0 },
            { z: -490, x: 0 }
        ]
    },


    {
        name: "TECH CIRCUIT",
        length: 500,
        width: 10,

        turns: [
            { z: 10, x: 0 },
            { z: -50, x: 8 },
            { z: -100, x: -8 },
            { z: -150, x: -8 },
            { z: -200, x: 8 },
            { z: -250, x: 8 },
            { z: -300, x: -8 },
            { z: -350, x: -8 },
            { z: -410, x: 8 },
            { z: -490, x: 0 }
        ]
    },


    {
        name: "AIRBORNE",
        length: 500,
        width: 12,

        turns: [
            { z: 10, x: 0 },
            { z: -80, x: 0 },
            { z: -140, x: 9 },
            { z: -200, x: 9 },
            { z: -260, x: -9 },
            { z: -320, x: -9 },
            { z: -380, x: 9 },
            { z: -440, x: 9 },
            { z: -490, x: 0 }
        ]
    },


    {
        name: "LOOP RUNNER",
        length: 550,
        width: 12,

        turns: [
            { z: 10, x: 0 },
            { z: -70, x: 0 },
            { z: -130, x: 9 },
            { z: -190, x: 9 },
            { z: -250, x: -9 },
            { z: -310, x: -9 },
            { z: -370, x: 9 },
            { z: -430, x: 9 },
            { z: -500, x: -5 },
            { z: -540, x: 0 }
        ]
    },


    {
        name: "FINAL CHALLENGE",
        length: 600,
        width: 10,

        turns: [
            { z: 10, x: 0 },
            { z: -60, x: 9 },
            { z: -120, x: -9 },
            { z: -180, x: -9 },
            { z: -240, x: 9 },
            { z: -300, x: 9 },
            { z: -360, x: -9 },
            { z: -420, x: -9 },
            { z: -480, x: 9 },
            { z: -540, x: 5 },
            { z: -590, x: 0 }
        ]
    }

];


// ==========================================
// START
// ==========================================

init();
animate();


// ==========================================
// CREATE GAME
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


    // GRAPHICS

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
// GET TRACK X POSITION
// ==========================================

function getTrackX(z, track) {

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

        const a =
            points[i];

        const b =
            points[i + 1];


        if (
            z <= a.z &&
            z >= b.z
        ) {

            const amount =
                (z - a.z) /
                (b.z - a.z);


            return (
                a.x +
                (b.x - a.x) *
                amount
            );

        }

    }


    return points[
        points.length - 1
    ].x;

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
        -280;


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

        const a =
            track.turns[i];

        const b =
            track.turns[i + 1];


        const dx =
            b.x - a.x;

        const dz =
            b.z - a.z;


        const length =
            Math.sqrt(
                dx * dx +
                dz * dz
            );


        const angle =
            Math.atan2(
                dx,
                dz
            );


        const roadGeometry =
            new THREE.BoxGeometry(
                track.width,
                0.2,
                length + 2
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
            (a.x + b.x) / 2,
            0.1,
            (a.z + b.z) / 2
        );


        road.rotation.y =
            angle;


        scene.add(
            road
        );


        trackObjects.push(
            road
        );

    }


    // ======================================
    // ROAD CENTER LINES
    // ======================================

    for (
        let z = 0;
        z > -track.length;
        z -= 10
    ) {

        const x =
            getTrackX(
                z,
                track
            );


        const nextX =
            getTrackX(
                z - 1,
                track
            );


        const angle =
            Math.atan2(
                nextX - x,
                -1
            );


        const lineGeometry =
            new THREE.BoxGeometry(
                0.3,
                0.05,
                4
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
            x,
            0.22,
            z
        );


        line.rotation.y =
            angle;


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


        const directionX =
            next.x - previous.x;

        const directionZ =
            next.z - previous.z;


        const angle =
            Math.atan2(
                directionX,
                directionZ
            );


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
            angle;


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


    const finishDirection =
        track.turns[
            track.turns.length - 1
        ];


    const previousPoint =
        track.turns[
            track.turns.length - 2
        ];


    finish.rotation.y =
        Math.atan2(

            finishDirection.x -
            previousPoint.x,

            finishDirection.z -
            previousPoint.z

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
            speed >
            maxSpeed
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


    if (
        keys["a"] ||
        keys["arrowleft"]
    ) {

        steering = -1;

    }


    if (
        keys["d"] ||
        keys["arrowright"]
    ) {

        steering = 1;

    }


    car.position.x +=
        steering *
        speed *
        0.8;


    // ======================================
    // KEEP CAR NEAR TRACK
    // ======================================

    const track =
        tracks[currentTrack];


    const roadCenter =
        getTrackX(
            car.position.z,
            track
        );


    const roadLimit =
        track.width / 2 - 1;


    if (
        car.position.x >
        roadCenter + roadLimit
    ) {

        car.position.x =
            roadCenter + roadLimit;

    }


    if (
        car.position.x <
        roadCenter - roadLimit
    ) {

        car.position.x =
            roadCenter - roadLimit;

    }


    // ======================================
    // MOVE CAR
    // ======================================

    car.position.z -=
        speed;


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

        car.position.z - 10

    );


    // ======================================
    // SPEED DISPLAY
    // ======================================

    document.getElementById(
        "speed"
    ).innerText =
        "Speed: " +
        Math.round(
            speed * 100
        );


    // ======================================
    // TIMER
    // ======================================

    const time =
        (
            performance.now() -
            startTime
        ) / 1000;


    document.getElementById(
        "timer"
    ).innerText =
        "Time: " +
        time.toFixed(2);


    // ======================================
    // FINISH
    // ======================================

    if (
        car.position.z <
        -track.length
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


    speed = 0;

}


// ==========================================
// T = RESTART
// ==========================================

function restartRun() {

    const track =
        tracks[currentTrack];


    car.position.set(

        track.turns[0].x,

        0.7,

        track.turns[0].z

    );


    speed = 0;


    currentCheckpoint =
        0;


    lastCheckpoint = {

        x: track.turns[0].x,

        y: 0.7,

        z: track.turns[0].z

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


    // RESET TIMER

    startTime =
        performance.now();


    timerRunning =
        true;


    document.getElementById(
        "timer"
    ).innerText =
        "Time: 0.00";

}


// ==========================================
// FINISH RACE
// ==========================================

function finishRace(time) {

    timerRunning =
        false;


    const best =
        getBestTime();


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


    document.getElementById(
        "best"
    ).innerText =

        "Best: " +

        getBestTime().toFixed(2);


    // COINS

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


    if (
        !value
    ) {

        return 0;

    }


    return Number(
        value
    );

}


// ==========================================
// COIN REWARD TIERS
// ==========================================

const trackCoinTiers = [

    // SPEED RUSH

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


    // TECH CIRCUIT

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


    // AIRBORNE

    [
        {
            time: 40,
            coins: 10
        },

        {
            time: 32,
            coins: 25
        },

        {
            time: 26,
            coins: 50
        }
    ],


    // LOOP RUNNER

    [
        {
            time: 43,
            coins: 15
        },

        {
            time: 34,
            coins: 30
        },

        {
            time: 28,
            coins: 55
        }
    ],


    // FINAL CHALLENGE

    [
        {
            time: 48,
            coins: 15
        },

        {
            time: 38,
            coins: 35
        },

        {
            time: 31,
            coins: 60
        }
    ]

];


// ==========================================
// GIVE COINS
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

        addCoins(
            reward
        );


        const gameCoins =
            document.getElementById(
                "gameCoins"
            );


        if (
            gameCoins
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
            "180px";


        button.style.margin =
            "5px 0";


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

            }

            else {

                button.style.background =
                    "#ff3b30";

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
