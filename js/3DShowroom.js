let scene, camera, renderer, controls;

function init() {
    camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 1000 );
    camera.position.z = 50;

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.BasicShadowMap;
   
    document.body.appendChild( renderer.domElement );

    controls = new THREE.TrackballControls( camera, renderer.domElement);

    scene = new THREE.Scene();
    scene.background = new THREE.Color( 0xdddddd );

    var loader = new THREE.GLTFLoader();
    loader.load('models/scene.glb', load);

    const material = new THREE.ShadowMaterial();
    material.opacity = 0.2;
    const plane = new THREE.Mesh(new THREE.PlaneGeometry( 100, 100, 100 ), material);
    plane.receiveShadow = true;
    scene.add(plane);
    plane.position.set(0, 0, -5);

    const light = new THREE.PointLight( 0xffffff, 0.8, 18 );
    light.position.set( -5, 5, 10 );
    light.castShadow = true;
    scene.add( light );

    const ambientLight = new THREE.AmbientLight( 0xffffff, 0.2 );
    scene.add( ambientLight );
    }

function animate() {
    requestAnimationFrame( animate );
    controls.update();
    renderer.render( scene, camera );
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}

function load(gltf) {
    mesh = gltf.scene.children[0];
    scene.add(mesh);
}

window.addEventListener('resize', onWindowResize, false);

init();
animate();

