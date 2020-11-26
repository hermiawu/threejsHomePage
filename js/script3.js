var scene, camera, renderer, vending, lights, composer;
var controls, raycaster, clickableObj, mouse, intersects, intersected;
var preModule, bestBuy, hmSo, book, contact ;

init();

function init(){
    const canvas = document.querySelector('#c');
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x0A1225);
  
  camera = new THREE.PerspectiveCamera( 35, window.innerWidth / window.innerHeight, 0.1, 100 );
  camera.position.set(-0.026,1,6);

  renderer = new THREE.WebGLRenderer({canvas, antialias: true});
  renderer.setSize( window.innerWidth, window.innerHeight );
  
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  document.body.appendChild( renderer.domElement );
 
  const ambient = new THREE.AmbientLight(0xfff3cb, 0.1);
  scene.add(ambient);
    
    lights = {};
    //add spotlight to street lamp
    lights.spot = new THREE.SpotLight(0xFFC02f, 2);
    lights.spot.position.set(-0.85,2.7,-0.45);
    lights.spot.target.position.set(-0.85,-1,-0.45);
    lights.spot.angle = Math.PI/6;
    lights.spot.distance = 4;
    lights.spot.penumbra = 0.2;
    lights.spot.decay = 0.5;
    scene.add(lights.spot);
    scene.add(lights.spot.target);
  
//  lights.spotHelper = new THREE.SpotLightHelper(lights.spot);
//  lights.spotHelper.visible = true;
//  scene.add(lights.spotHelper);
    
    lights.spot.castShadow = true;
    lights.spot.shadow.mapSize.width = 1024;
    lights.spot.shadow.mapSize.height = 1024;
    lights.spot.shadow.camera.near = 0.3;
    lights.spot.shadow.camera.far = 10;
    lights.spot.shadow.bias = -0.01;
  
  // add directional light as the moon
  lights.direct = new THREE.DirectionalLight(0xFFFFFF, 0.1);
    lights.direct.position.set(-0.5,5,1);
    scene.add(lights.direct);
//     lights.directionalHelper = new THREE.DirectionalLightHelper(lights.direct);
//  lights.directionalHelper.visible = true;
//  scene.add(lights.directionalHelper);
 
    lights.direct.castShadow= true;
    lights.direct.shadow.mapSize.width = 1024;
    lights.direct.shadow.mapSize.height = 1024;
  lights.direct.shadow.near =0;
  lights.direct.shadow.far = 10;
  const shadowSize = 5;
  lights.direct.shadow.left = -shadowSize;
  lights.direct.shadow.right = shadowSize;
  lights.direct.shadow.top = shadowSize;
  lights.direct.shadow.bottom = -shadowSize;
    lights.direct.shadow.bias = -0.01;
    
//    const directHelper = new THREE.CameraHelper(lights.direct.shadow.camera);
//    scene.add(directHelper);
    
    // add point light to mailbox
lights.point = new THREE.PointLight(0xFFC02f, 2);
    lights.point.distance = 2.5;
    lights.point.decay = 2;
    lights.point.position.set(0.88,1.43,-0.58);
    scene.add(lights.point);
    
//    lights.pointHelper = new THREE.PointLightHelper(lights.point);
//  lights.pointHelper.visible = true;
//  scene.add(lights.pointHelper);
    
    lights.point.castShadow = true;
    lights.point.shadow.mapSize.width = 1024;
    lights.point.shadow.mapSize.height = 1024;
    lights.point.shadow.camera.near = 0.18;
    lights.point.shadow.camera.far = 3;
    lights.point.shadow.bias = -0.01;
    
//    const pointCamHelper = new THREE.CameraHelper(lights.point.shadow.camera);
//    scene.add(pointCamHelper);
    
    //add area light to vending machine
    THREE.RectAreaLightUniformsLib.init();
    //top level
    lights.area1 = new THREE.RectAreaLight(0xffffff);
    lights.area1.intensity = 2;
    lights.area1.width = 1;
    lights.area1.height = 0.2;
    lights.area1.position.set(-0.052, 1.95, 0);
    lights.area1.lookAt(-0.052,0,0);
    scene.add(lights.area1);
    
//    const area1Helper = new THREE.RectAreaLightHelper(lights.area1);
//    lights.area1.add(area1Helper);
    
    //middle level
    lights.area2 = new THREE.RectAreaLight(0xffffff);
    lights.area2.intensity = 1.2;
    lights.area2.width = 1;
    lights.area2.height = 0.2;
    lights.area2.position.set(-0.052, 1.5, 0);
    lights.area2.lookAt(-0.052,0,0);
    scene.add(lights.area2);
    
//    const area2Helper = new THREE.RectAreaLightHelper(lights.area2);
//    lights.area2.add(area2Helper);
    
    //bottom level
    lights.area3 = new THREE.RectAreaLight(0xffffff);
    lights.area3.intensity = 1.2;
    lights.area3.width = 1;
    lights.area3.height = 0.2;
    lights.area3.position.set(-0.052, 1.14, 0);
    lights.area3.lookAt(-0.052,0.7,0);
    scene.add(lights.area3);
    
//    const area3Helper = new THREE.RectAreaLightHelper(lights.area3);
//    lights.area3.add(area3Helper);
    
    //pickup window
    lights.area4 = new THREE.RectAreaLight(0xffffff);
    lights.area4.intensity = 1.5;
    lights.area4.width = 0.6;
    lights.area4.height = 0.2;
    lights.area4.position.set(-0.05, 0.4, 0);
    lights.area4.lookAt(-0.05, 0, 0);
    scene.add(lights.area4);
    
//    const area4Helper = new THREE.RectAreaLightHelper(lights.area4);
//    lights.area4.add(area4Helper);
    
    //cash return
    lights.area5 = new THREE.RectAreaLight(0xffffff);
    lights.area5.intensity = 1.5;
    lights.area5.width = 0.056;
    lights.area5.height = 0.06;
    lights.area5.position.set(0.36, 0.36, 0.1);
    lights.area5.lookAt(0.36, 0, 0.2);
    scene.add(lights.area5);
    
//    const area5Helper = new THREE.RectAreaLightHelper(lights.area5);
//    lights.area5.add(area5Helper);
    
    //add spotlight to active apps
    //premodule
    lights.spotlightS1 = new THREE.SpotLight(0xffffff);
    lights.spotlightS1.position.set(-0.06,1.91,0.15);
    lights.spotlightS1.target.position.set(-0.06, 1.5, -0.18);
    lights.spotlightS1.intensity = 1.2;
    lights.spotlightS1.angle = Math.PI/3;
    lights.spotlightS1.distance = 0.38;
    lights.spotlightS1.penumbra = 0.34;
    lights.spotlightS1.decay = 0.7;
    scene.add(lights.spotlightS1);
    scene.add(lights.spotlightS1.target);
    
//    const spotS1Helper = new THREE.SpotLightHelper(lights.spotlightS1);
//    scene.add(spotS1Helper);
    
    lights.spotlightS1.castShadow = true;
    lights.spotlightS1.shadow.mapSize.width = 1024;
    lights.spotlightS1.shadow.mapSize.height = 1024;
    lights.spotlightS1.shadow.camera.near = 0.1;
    lights.spotlightS1.shadow.camera.far = 0.4;
    lights.spotlightS1.shadow.bias = -0.01;
    
//    const spotS1CamHelper = new THREE.CameraHelper(lights.spotlightS1.shadow.camera);
//    scene.add(spotS1CamHelper);
    
    
    //bestbuy
    lights.spotlightS2 = new THREE.SpotLight(0xffffff);
    lights.spotlightS2.position.set(-0.36,1.5,0.15);
    lights.spotlightS2.target.position.set(-0.36, 1.1, -0.3);
    lights.spotlightS2.intensity = 0.8;
    lights.spotlightS2.angle = Math.PI/4;
    lights.spotlightS2.distance = 0.3;
    lights.spotlightS2.penumbra = 0.34;
    lights.spotlightS2.decay = 0.7;
    scene.add(lights.spotlightS2);
    scene.add(lights.spotlightS2.target);
    
//    const spotS2Helper = new THREE.SpotLightHelper(lights.spotlightS2);
//    scene.add(spotS2Helper);
    
    lights.spotlightS2.castShadow = true;
    lights.spotlightS2.shadow.mapSize.width = 1024;
    lights.spotlightS2.shadow.mapSize.height = 1024;
    lights.spotlightS2.shadow.camera.near = 0.06;
    lights.spotlightS2.shadow.camera.far = 0.4;
    lights.spotlightS2.shadow.bias = -0.01;
    
//    const spotS2CamHelper = new THREE.CameraHelper(lights.spotlightS2.shadow.camera);
//    scene.add(spotS2CamHelper);
    
    //hmSo
    lights.spotlightS3 = new THREE.SpotLight(0xffffff);
    lights.spotlightS3.position.set(0.24,1.5,0.15);
    lights.spotlightS3.target.position.set(0.24, 1.1, -0.3);
    lights.spotlightS3.intensity = 0.5;
    lights.spotlightS3.angle = Math.PI/4;
    lights.spotlightS3.distance = 0.3;
    lights.spotlightS3.penumbra = 0.34;
    lights.spotlightS3.decay = 0.5;
    scene.add(lights.spotlightS3);
    scene.add(lights.spotlightS3.target);
    
//    const spotS3Helper = new THREE.SpotLightHelper(lights.spotlightS3);
//    scene.add(spotS3Helper);
    
    lights.spotlightS3.castShadow = true;
    lights.spotlightS3.shadow.mapSize.width = 1024;
    lights.spotlightS3.shadow.mapSize.height = 1024;
    lights.spotlightS3.shadow.camera.near = 0.06;
    lights.spotlightS3.shadow.camera.far = 0.4;
    lights.spotlightS3.shadow.bias = -0.01;
    
//    const spotS3CamHelper = new THREE.CameraHelper(lights.spotlightS3.shadow.camera);
//    scene.add(spotS3CamHelper);
  
   controls = new THREE.OrbitControls( camera, renderer.domElement );
  controls.target.set(-0.026,1.2,0);
  
    
    raycaster = new THREE.Raycaster();
    clickableObj = [];
    mouse = new THREE.Vector2();
    preModule = new THREE.Object3D();
    bestBuy = new THREE.Object3D();
    hmSo = new THREE.Object3D();
    book = new THREE.Object3D();
    contact = new THREE.Object3D();
    
  //Load meshes here
    const loader = new THREE.GLTFLoader();
  loader.load('https://uploads-ssl.webflow.com/5f91951e33e73451fff81a96/5fbefb2e234e05bac6ff15fb_vending_machine_model_min2.glb.txt', function(object){
    object.scene.traverse(function(child){
        if (child.isMesh){  
          child.castShadow = true;
          child.receiveShadow = true;
            child.material.transparent = true;
            if (child.name === 'postLampGlass'){
                child.renderOrder = 100; //to fix the lightbult disappearing problem
                child.material.opacity = 0.15;
            }
        }
    });
      preModule = object.scene.getObjectByName('premodule_base');
      bestBuy = object.scene.getObjectByName('bestbuy_base');
      hmSo = object.scene.getObjectByName('hmso_base');
      book = object.scene.getObjectByName('book_red');
      contact = object.scene.getObjectByName('mailbox');
      
      preModule.userData = {URL: "http://google.com"};
      //console.log(preModule.userData.URL);
      bestBuy.userData = {URL: "http://google.com"};
      hmSo.userData = {URL: "http://google.com"};
      book.userData = {URL: "http://google.com"};
      contact.userData = {URL: "http://google.com"};
      
      clickableObj.push(preModule);
      clickableObj.push(bestBuy);
      clickableObj.push(hmSo);
      clickableObj.push(book);
      clickableObj.push(contact);
      
      
      //console.log(clickableObj);
      scene.add(object.scene);
      //console.log(object);

  });
    
    //correct color
    renderer.gammaInput = true;
    renderer.gammaOutput = true;
    renderer.gammaFactor = 2.2;
    renderer.setClearColor(0x000000);

  window.addEventListener( 'resize', resize, false);
    renderer.domElement.addEventListener('mousemove', onMouseMove, false);
    
    renderer.domElement.addEventListener('touchstart', onTouch,false);
    
  
  render();

}


function render(){
    requestAnimationFrame(render);
    controls.update();
    renderer.render(scene, camera);
        
}

function resize(){
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );
}

function getRelativePosition(event){
    mouse.x = (event.clientX / renderer.domElement.clientWidth)*2 -1;
    mouse.y = -(event.clientY / renderer.domElement.clientHeight)*2+1;
    raycaster.setFromCamera(mouse, camera);
}

function onMouseMove(event){
    getRelativePosition(event);
    
    intersects = raycaster.intersectObjects(clickableObj, false);
    if (intersects.length>0){
        $('html, body').css('cursor', 'pointer');
        if(intersected != intersects[0].object){
            if(intersected){
                intersected.material=intersected.currentMaterial;
            }
            intersected = intersects[0].object;
            intersected.currentMaterial = intersected.material;
        }
        //console.log('yes');
        //console.log(intersects[0]);
        const color = intersects[0].object.material.color;
        intersects[0].object.material = new THREE.MeshPhongMaterial({color:color, emissive: color, emissiveIntensity: 0.6});
        
        renderer.domElement.addEventListener('mousedown', onClick, false);
    
        function onClick(event){
            if(intersects.length>0){
                //controls.enabled =false;
                window.open(intersects[0].object.userData.URL,'_self');
            }
        }
    }else{
        if(intersected){
            intersected.material = intersected.currentMaterial;
        }
        intersected = null;
        $('html, body').css('cursor','default');
    }    
}

function onTouch(event){
    //event.preventDefault();
    //controls.enabled = false; 
    getRelativePosition(event.touches[0]);
    console.log(mouse);
    console.log(event);
    
    intersects = raycaster.intersectObjects(clickableObj, false);
    console.log(intersects);
    
    if (intersects.length>0){
        console.log('yes');
        if(intersected != intersects[0].object){
            if(intersected){
                intersected.material=intersected.currentMaterial;
            }
            intersected = intersects[0].object;
            intersected.currentMaterial = intersected.material;
        }
        
        const color = intersects[0].object.material.color;
        intersects[0].object.material = new THREE.MeshPhongMaterial({color:color, emissive: color, emissiveIntensity: 0.6});
        
        renderer.domElement.addEventListener('touchend', onTouched, false);
    
        function onTouched(event){
            if(intersects.length>0){
                window.open(intersects[0].object.userData.URL,'_self');
            }
        }
    }else{
        if(intersected){
            intersected.material = intersected.currentMaterial;
        }
        intersected = null; 
    }
}