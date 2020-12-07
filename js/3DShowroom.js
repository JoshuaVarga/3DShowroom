let scene, camera, renderer, controls, controller, model, stats, loader, pivot

function init() {
    stats = createStats();

    scene = new THREE.Scene();
    const textureLoader = new THREE.CubeTextureLoader();
    const texture = textureLoader.load([
        'cubemaps/pos-x.jpg',
        'cubemaps/neg-x.jpg',
        'cubemaps/pos-y.jpg',
        'cubemaps/neg-y.jpg',
        'cubemaps/pos-z.jpg',
        'cubemaps/neg-z.jpg',
    ]);
    scene.background = texture;

    camera = new THREE.PerspectiveCamera( 90, window.innerWidth / window.innerHeight, 0.1, 10000 );
    camera.position.set(0, 0, 5);

    pivot = new THREE.Group();
    scene.add( pivot );

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.toneMapping = THREE.ReinhardToneMapping;
    renderer.toneMappingExposure = 2;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
   
    document.body.appendChild( renderer.domElement );
    document.body.appendChild( stats.domElement );

    controls = new THREE.TrackballControls( camera, renderer.domElement);
    controls.rotateSpeed = 2;

    loader = new THREE.GLTFLoader();
    loader.load('models/cat.glb', addModel);

    const ambientLight = new THREE.AmbientLight( 0xffffff, 0.2 );
    scene.add( ambientLight );

    controller = {
        rotate: 0,
        test: 0,
        test2: 0,
        cat: () => {
            pivot.remove(model);
            loader.load('models/cat.glb', addModel)
        },
        anatomy: () => {
            pivot.remove(model);
            loader.load('models/anatomy.glb', addModel)
        },
        globe: () => {
            pivot.remove(model);
            loader.load('models/globe.glb', addModel)
        },
        front: false,
        back: false,
        top: false,
        bottom: false,
        left: false,
        right: false,
        colour: 0xffffff
    }
    
    var lights = [];

    for (i = 0; i < 6; i++) {
        lights[i] = new THREE.PointLight( controller.colour, controller.intensity, 1000 );
        lights[i].power = 0;
        lights[i].shadow.bias = -0.001;
        lights[i].shadow.mapSize.width = 2048;
        lights[i].shadow.mapSize.height = 2048;
        scene.add(lights[i]);
    }

    lights[0].position.set(0, 0, 50);
    lights[1].position.set(0, 0, -50);
    lights[2].position.set(0, 50, 0);
    lights[3].position.set(0, -50, 0);
    lights[4].position.set(50, 0, 0);
    lights[5].position.set(-50, 0, 0);

    const gui = new dat.GUI();

    const modelFolder = gui.addFolder( 'models' );
    modelFolder.add(controller, 'cat');
    modelFolder.add(controller, 'anatomy');
    modelFolder.add(controller, 'globe');
    const transformFolder = gui.addFolder( 'transform' );
    transformFolder.add(controller, 'rotate', 0, Math.PI * 2).name( 'rotate x' );
    transformFolder.add(controller, 'test', 0, Math.PI * 2).name( 'rotate y' );
    transformFolder.add(controller, 'test2', 0, Math.PI * 2).name( 'rotate z' );
    const lightFolder = gui.addFolder( 'lights' );
    lightFolder.add(controller, 'front').onChange(function(){toggleLight(controller.front, lights[0]);});
    lightFolder.add(controller, 'back').onChange(function(){toggleLight(controller.back, lights[1]);});
    lightFolder.add(controller, 'top').onChange(function(){toggleLight(controller.top, lights[2]);});
    lightFolder.add(controller, 'bottom').onChange(function(){toggleLight(controller.bottom, lights[3]);});
    lightFolder.add(controller, 'left').onChange(function(){toggleLight(controller.left, lights[4]);});
    lightFolder.add(controller, 'right').onChange(function(){toggleLight(controller.right, lights[5]);});
    lightFolder.addColor(controller, 'colour').onChange(function(){changeColour(controller.colour, lights);});;

    window.addEventListener('resize', onWindowResize, false);
}

function animate() {
    requestAnimationFrame( animate );
    stats.update();
    controls.update();  
    pivot.rotation.x = controller.rotate;
    pivot.rotation.y = controller.test;
    pivot.rotation.z = controller.test2;
    renderer.render( scene, camera );
}

function createStats() {
    var stats = new Stats();
    stats.setMode(0);

    stats.domElement.style.position = 'absolute';
    stats.domElement.style.left = '0';
    stats.domElement.style.top = '0';

    return stats;
  } 

function addModel(gltf) {
    model = gltf.scene.children[0];
    model.traverse(n => {
        if(n.isMesh) {
            n.castShadow = true;
            n.receiveShadow = true;
            if(n.material.map) n.material.map.anisotropy = 16; 
        }
    });
    const box = new THREE.Box3().setFromObject( model );
    box.getCenter( model.position );
    model.position.multiplyScalar( - 1 );
    pivot.add(model);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}

function toggleLight(bool, light) {
    if (bool) {
        light.intensity = 1;
        light.castShadow = true;
    } else {
        light.intensity = 0;
        light.castShadow = false;
    }
}

function changeColour( hex, arr ) {
    for (i = 0; i < 6; i++) {
        arr[i].color.setHex( hex )
    }
}


init();
animate();

