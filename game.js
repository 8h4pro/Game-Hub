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
let timerRunning = true;


// START
init();
animate();


// CREATE GAME
function init() {

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x87ceeb);

    // CAMERA
    camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );

    camera.position.set(0, 5, 10);


    // GRAPHICS
    renderer = new THREE.WebGLRenderer({
        antialias: true
    });

    renderer.setSize(
        window.innerWidth,
        window.innerHeight
    );

    document.body.appendChild(renderer.domElement);


    // LIGHT
    const sunlight = new THREE.DirectionalLight(
        0xffffff,
        2
    );

    sunlight.position.set(10, 20, 10);
    scene.add(sunlight);

    const ambientLight =
        new THREE.AmbientLight(0xffffff, 0.6);

    scene.add(ambientLight);


    // GROUND
    const groundGeometry =
        new THREE.PlaneGeometry(200, 200);

    const groundMaterial =
        new THREE.MeshStandardMaterial({
            color: 0x3b8c3b
        });

    const ground =
        new THREE.Mesh(
            groundGeometry,
            groundMaterial
        );

    ground.rotation.x = -Math.PI / 2;

    scene.add(ground);


    // ROAD
    const roadGeometry =
        new THREE.BoxGeometry(12, 0.2, 200);

    const roadMaterial =
        new THREE.MeshStandardMaterial({
            color: 0x333333
        });

    const road =
        new THREE.Mesh(
            roadGeometry,
            roadMaterial
        );

    road.position.y = 0.1;

    scene.add(road);


    // ROAD CENTER LINES
    for (let z = -95; z < 100; z += 10) {

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

        line.position.set(0, 0.22, z);

        scene.add(line);
    }


    // CAR
    const carGeometry =
        new THREE.BoxGeometry(2, 0.7, 3.5);

    const carMaterial =
        new THREE.MeshStandardMaterial({
            color: 0xff2222
        });

    car =
        new THREE.Mesh(
            carGeometry,
            carMaterial
        );

    car.position.set(0, 0.7, 70);

    scene.add(car);


    // CAR ROOF
    const roofGeometry =
        new THREE.BoxGeometry(1.5, 0.5, 1.5);

    const roofMaterial =
        new THREE.MeshStandardMaterial({
            color: 0xaa0000
        });

    const roof =
        new THREE.Mesh(
            roofGeometry,
            roofMaterial
        );

    roof.position.y = 0.55;

    car.add(roof);


    // TIMER
    startTime = performance.now();


    // KEYBOARD
    window.addEventListener("keydown", function(event) {
        keys[event.key.toLowerCase()] = true;
    });

    window.addEventListener("keyup", function(event) {
        keys[event.key.toLowerCase()] = false;
    });


    // RESIZE
    window.addEventListener("resize", function() {

        camera.aspect =
            window.innerWidth /
            window.innerHeight;

        camera.updateProjectionMatrix();

        renderer.setSize(
            window.innerWidth,
            window.innerHeight
        );
    });
}


// UPDATE GAME
function update() {

    // ACCELERATE
    if (keys["w"] || keys["arrowup"]) {

        speed += acceleration;

        if (speed > maxSpeed) {
            speed = maxSpeed;
        }
    }

    // BRAKE
    else if (keys["s"] || keys["arrowdown"]) {

        speed -= acceleration * 2;

        if (speed < 0) {
            speed = 0;
        }
    }

    // FRICTION
    else {

        speed -= friction;

        if (speed < 0) {
            speed = 0;
        }
    }


    // STEERING
    let steering = 0;

    if (keys["a"] || keys["arrowleft"]) {
        steering = 1;
    }

    if (keys["d"] || keys["arrowright"]) {
        steering = -1;
    }

    car.position.x += steering * speed * 0.8;


    // KEEP CAR ON ROAD
    if (car.position.x > 5) {
        car.position.x = 5;
    }

    if (car.position.x < -5) {
        car.position.x = -5;
    }


    // MOVE CAR
    car.position.z -= speed;


    // CAMERA FOLLOW
    camera.position.x = car.position.x;
    camera.position.y = 5;
    camera.position.z = car.position.z + 10;

    camera.lookAt(
        car.position.x,
        car.position.y,
        car.position.z - 10
    );


    // SPEED
    document.getElementById("speed").innerText =
        "Speed: " + Math.round(speed * 100);


    // TIMER
    if (timerRunning) {

        let time =
            (performance.now() - startTime) / 1000;

        document.getElementById("timer").innerText =
            "Time: " + time.toFixed(2);
    }


    // FINISH
    if (car.position.z < -90) {

        timerRunning = false;

        alert(
            "FINISH!\nTime: " +
            ((performance.now() - startTime) / 1000)
                .toFixed(2)
        );
    }
}


// GAME LOOP
function animate() {

    requestAnimationFrame(animate);

    update();

    renderer.render(scene, camera);
}


// RESTART
function restartGame() {

    car.position.set(0, 0.7, 70);

    speed = 0;

    startTime = performance.now();

    timerRunning = true;
}
