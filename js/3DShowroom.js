let scene, camera, renderer, controls, values, model

function init() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color( 'grey' );

    camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 100000 );
    camera.position.set(300, 0, 0);

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.toneMapping = THREE.ReinhardToneMapping;
    renderer.toneMappingExposure = 2;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
   
    document.body.appendChild( renderer.domElement );

    controls = new THREE.TrackballControls( camera, renderer.domElement);
    controls.rotateSpeed = 2;
    //controls.noPan = true;
    //controls.noZoom = true;

    new THREE.GLTFLoader().load('models/girl.glb', result => {
        model = result.scene.children[0];
        model.position.set(0, -100, 0);
        model.traverse(n => {
            if(n.isMesh) {
                n.castShadow = true;
                n.receiveShadow = true;
                if(n.material.map) n.material.map.anisotropy = 16; 
            }
        });
        scene.add(model);
    });

    const lightTop = new THREE.PointLight( 0xfff4f2, 1, 1000 );
    lightTop.castShadow = true;
    lightTop.shadow.bias = -0.001;
    lightTop.shadow.mapSize.width = 4096;
    lightTop.shadow.mapSize.height = 4096;
    lightTop.position.set( 500, 0, 0 );
    scene.add( lightTop );

    const ambientLight = new THREE.AmbientLight( 0xffffff, 0.2 );
    scene.add( ambientLight );

    values = new function () {
        this.rotate = Math.PI / 2;
	}

    const gui = new dat.GUI();
    gui.add(values, 'rotate', 0, Math.PI * 2);

    window.addEventListener('resize', onWindowResize, false);
}

function animate() {
    requestAnimationFrame( animate );
    controls.update();
    model.rotation.z = values.rotate;
    renderer.render( scene, camera );
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}

init();
animate();

