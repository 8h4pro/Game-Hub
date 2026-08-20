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
            { z: 0, x: 0 },
            { z: -70, x: 0 },
            { z: -140, x: 5 },
            { z: -210, x: 5 },
            { z: -280, x: -5 },
            { z: -350, x: -5 },
            { z: -420, x: 0 }
        ]
    },

    {
        name: "TECH CIRCUIT",
        length: 500,
        width: 10,

        turns: [
            { z: 0, x: 0 },
            { z: -50, x: 5 },
            { z: -100, x: -5 },
            { z: -150, x: -5 },
            { z: -200, x: 5 },
            { z: -250, x: 5 },
            { z: -300, x: -5 },
            { z: -370, x: 0 },
            { z: -440, x: 0 }
        ]
    },

    {
        name: "AIRBORNE",
        length: 500,
        width: 12,

        turns: [
            { z: 0, x: 0 },
            { z: -100, x: 0 },
            { z: -170, x: 4 },
            { z: -240, x: -4 },
            { z: -320, x: -4 },
            { z: -400, x: 4 },
            { z: -470, x: 0 }
        ]
    },

    {
        name: "LOOP RUNNER",
        length: 550,
        width: 12,

        turns: [
            { z: 0, x: 0 },
            { z: -100, x: 0 },
            { z: -180, x: 5 },
            { z: -250, x: 5 },
            { z: -330, x: -5 },
            { z: -410, x: -5 },
            { z: -500, x: 0 }
        ]
    },

    {
        name: "FINAL CHALLENGE",
        length: 600,
        width: 10,

        turns: [
            { z: 0, x: 0 },
            { z: -60, x: 5 },
            { z: -120, x: -5 },
            { z: -190, x: -5 },
            { z: -260, x: 5 },
            { z: -330, x: 5 },
            { z: -400, x: -5 },
            { z: -470, x: 5 },
            { z: -540, x: 0 }
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


            if (
                event.key >= "1" &&
                event.key <= "5"
            ) {

                selectTrack(
                    Number(event.key) - 1
                );

            }


            if (
                key === "r"
            ) {

                respawnCheckpoint();

            }


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
// CREATE TRACK
// ==========================================

function createTrack(
    trackNumber
) {

    removeTrack();

    checkpoints = [];

    const track =
        tracks[trackNumber];


    // GROUND

    const groundGeometry =
        new THREE.PlaneGeometry(
            300,
            800
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
        -250;


    scene.add(
        ground
    );


    trackObjects.push(
        ground
    );


    // ROAD

    const roadGeometry =
        new THREE.BoxGeometry(
            track.width,
            0.2,
            track.length
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


    road.position.y =
        0.1;


    road.position.z =
        -track.length / 2 + 10;


    scene.add(
        road
    );


    trackObjects.push(
        road
    );


    // CENTER LINES

    for (
        let z = 0;
        z > -track.length;
        z -= 10
    ) {

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
            0,
            0.22,
            z
        );


        scene.add(
            line
        );


        trackObjects.push(
            line
        );

    }


    // CHECKPOINTS

    track.turns.forEach(
        function(
            point,
            index
        ) {

            if (
                index === 0
            ) {
                return;
            }


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
    );


    // FINISH LINE

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
        0,
        0.23,
        -track.length
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

function selectTrack(
    number
) {

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


    // ACCELERATE

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


    // BRAKE

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


    // FRICTION

    else {

        speed -=
            friction;


        if (
            speed < 0
        ) {

            speed = 0;

        }

    }


    // STEERING

    let steering = 0;


    if (
        keys["a"] ||
        keys["arrowleft"]
    ) {

        steering = 1;

    }


    if (
        keys["d"] ||
        keys["arrowright"]
    ) {

        steering = -1;

    }


    car.position.x +=
        steering *
        speed *
        0.8;


    // KEEP CAR ON ROAD

    const roadWidth =
        tracks[
            currentTrack
        ].width / 2 - 1;


    if (
        car.position.x >
        roadWidth
    ) {

        car.position.x =
            roadWidth;

    }


    if (
        car.position.x <
        -roadWidth
    ) {

        car.position.x =
            -roadWidth;

    }


    // MOVE CAR

    car.position.z -=
        speed;


    checkCheckpoints();


    // CAMERA

    camera.position.x =
        car.position.x;


    camera.position.y = 5;


    camera.position.z =
        car.position.z + 10;


    camera.lookAt(
        car.position.x,
        car.position.y,
        car.position.z - 10
    );


    // SPEED

    document.getElementById(
        "speed"
    ).innerText =
        "Speed: " +
        Math.round(
            speed * 100
        );


    // TIMER

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


    // FINISH

    if (
        car.position.z <
        -tracks[
            currentTrack
        ].length
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
// RESPAWN
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
// RESTART RUN
// ==========================================

function restartRun() {

    car.position.set(
        0,
        0.7,
        10
    );


    speed = 0;


    currentCheckpoint =
        0;


    lastCheckpoint = {
        x: 0,
        y: 0.7,
        z: 10
    };


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

function finishRace(
    time
) {

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


    // GIVE COINS

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
// COIN REWARDS
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


function giveTrackRacerCoins(
    time
) {

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
