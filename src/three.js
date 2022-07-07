import * as THREE from 'three';
import vertexShader from "./shaders/vertexShader.glsl";
import fragmentShader from "./shaders/fragmentShader.glsl";
import anime from "animejs"



// Canvas
const canvas = document.querySelector("canvas.webgl");

// DOM
const navItems = [...document.querySelectorAll('.nav__item')];
const loading = document.querySelector('.loading');
const loadingBar = document.querySelector('.loading__bar');
const loadingNumber = document.querySelector('.loading__progress__number');

/**
 * Variables & Functions
 */
function lerp(start, end, t){
  return start * ( 1 - t ) + end * t;
}
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
}
const bgColor = ['#ffa0a0', '#ffc74f', '#9cd6f0']
const easing = 'easeOutExpo';
let matArray = [];
let planesArray = [];
let textureWidth = 360;
let textureHeight = 480;
let textureMargin = sizes.height/2;
let texturePosX = 100;
let texturePosY = 0;
let currentItem = 0;
let offset = new THREE.Vector2(0,0)
let mouse = new THREE.Vector2(0,0)
let sceneReady = false
let wheelSpeed = 0


/**
 * Loading Manager
 */


const loadingManager = new THREE.LoadingManager(
 // Loaded
 () => {
    // Point handler is ready
    sceneReady = true

    setTimeout(() => {
      loading.classList.add('loading--loaded')
    }, 500);
 },
 // Progress
 (itemUrl, itemsLoaded, itemsTotal) => {
     const progressRatio = itemsLoaded/itemsTotal
     loadingNumber.innerHTML = Math.ceil(progressRatio * 100)
     loadingBar.style.transform = `scaleX(${progressRatio})`
 }
)


/**
 * Scene Initialisation
 */
 const scene = new THREE.Scene();
 const meshGroup = new THREE.Group();


 let fov = (180 * (2 * Math.atan(sizes.height / 2 / 1000))) / Math.PI;
 let aspect = sizes.width / sizes.height;
 const camera = new THREE.PerspectiveCamera(
   fov,
   aspect,
   1,
   2000
 );
 camera.position.set(0, 0, 1000);
 camera.lookAt(scene.position);
 scene.add(camera);



const renderer = new THREE.WebGLRenderer( { 
  canvas: canvas,
  antialias: true,
  alpha: true
} );

renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setAnimationLoop( animation );

/**
 * Texture Loader
 */
const textureLoader = new THREE.TextureLoader(loadingManager)

/**
 * Plane Geometry And Material
 */
const geometry = new THREE.PlaneBufferGeometry(1, 1, 40, 40);
const material = new THREE.ShaderMaterial({
  vertexShader,
  fragmentShader,
  side: THREE.DoubleSide,
  uniforms: {
    uTexture1: { value: textureLoader.load(`/images/img1.jpg`)},
    uTexture2: { value: textureLoader.load(`/images/img2.jpg`)},
    uTexture3: { value: textureLoader.load(`/images/img3.jpg`)},
    uCurrentItem: { value: 0 },
    uTime: { value: 0 },
    uWaveSpeed: { value: 2 },
    uTwistAngle: { value: 1 },
    uOffset: {value: new THREE.Vector2(0, 0)},
    uRaycastUvCoord: {value: new THREE.Vector2(0, 0)},
    uRaycastUvFade: { value: -0.2 },
    uRaycastUvStrength: { value: 0.01 },
  },
  transparent: true,
});



/**
 * Media Query
 */

 const smallMedia = window.matchMedia('only screen and (max-width: 767px)');

 if (smallMedia.matches) {
  textureWidth = 250;
  textureHeight = 330;
  texturePosX = 0
  texturePosY = -40;
 }

 smallMedia.addEventListener('change', event => {
   if (event.matches) {
    textureWidth = 250;
    textureHeight = 330;
    texturePosX = 0
    texturePosY = -40;
  } else {
    textureWidth = 360;
    textureHeight = 480;
    texturePosX = 100;
    texturePosY = 0;

  }
  planesArray.forEach((plane, i) => {
    plane.position.x = texturePosX;
    plane.position.y += texturePosY;
    plane.scale.set(textureWidth, textureHeight, 1);
  })
})



/**
 * Create Planes
 */

let plane
const creatingPlane = () => {

  navItems.forEach((itm, i) => {
    let mat = material.clone();
    mat.uniforms.uCurrentItem.value = i
    matArray.push(mat);

    plane = new THREE.Mesh(geometry, mat);
    meshGroup.rotation.set(-0.35, -0.45, -0.2);
    plane.scale.set(textureWidth, textureHeight, 1);
    plane.position.set(texturePosX, - i * (textureHeight + textureMargin) + texturePosY, 0)

    meshGroup.add(plane);
    scene.add(meshGroup);
    planesArray.push(plane);
  });
};
creatingPlane();




/**
 * Mouse Move Event
 */
window.addEventListener('mousemove', (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
})



/**
 * Resize Event
 */

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.fov = fov
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

});

/**
 * Function That Handles Plane Animation
 */
const animatePlane = () => {

    // Animate Planes on Each Nav Item Click
    navItems.forEach((itm, i) => {
      anime({
        targets: planesArray[i].position,
        y: -i * (textureHeight + textureMargin) + currentItem * (textureHeight + textureMargin) + texturePosY,
        duration: 2000,  // 3000
        easing: easing,
      })
      anime({
        targets: planesArray[i].rotation,
        y: `-=${Math.PI}`,
        duration: 3000,
        easing: easing,
      })
      anime({
        targets: matArray[i].uniforms.uTwistAngle,
        value: 8,
        duration: 1500, 
        easing: easing,
        complete: () => {
          anime({
            targets: matArray[i].uniforms.uTwistAngle,
            value: 1,
            duration: 1500,
            easing: easing,
          })
        }
      })
    })
}

/**
 * Navigate Through Nav Items Click
 */
 navItems.forEach((item, i) => {
  item.addEventListener('click', e => {
      if (currentItem != i) {
          currentItem = i
          animatePlane()
      }
  })
})

/**
 * Navigate Through Keybord 1/2/3 Keys
 */
 document.addEventListener('keydown', (e) => {
  // 1/2/3 Keys
  switch(e.which) {
    case 97:
        if (currentItem != 0 ){
            currentItem = 0
            animatePlane()
        }
        break;
    case 98:
        if (currentItem != 1 ){
            currentItem = 1
            animatePlane()
        }
        break;
    case 99:
        if (currentItem != 2 ){
            currentItem = 2
            animatePlane()
        }
        break;
  } 

  // Up & Down Keys
  switch(e.which) {
    case 38:   // Up
        if (currentItem != 0) {
            currentItem--
            animatePlane()
        } 
        break;
    case 40:   // Down
        if (currentItem != 2) {
            currentItem++
            animatePlane()
        }
        break;
}
})


/**
 * Navigate Through Mouse Wheel
 */
 window.addEventListener("wheel", (e) => {
  wheelSpeed += e.deltaY * 0.0025;
  wheelSpeed = Math.min(Math.max(0, wheelSpeed), 2);

  if (currentItem != wheelSpeed) {
      currentItem = Math.round(wheelSpeed)
      animatePlane()
  }
})


/**
 * No Raycasting Effect on Tablets and Mobiles to Prevent Weired Behavior on Touch Screen
 */
 const ua = navigator.userAgent;
 if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
   planesArray.forEach(plane => {
    plane.material.uniforms.uRaycastUvStrength = 0
   })
 }
 else if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
  planesArray.forEach(plane => {
    plane.material.uniforms.uRaycastUvStrength = 0
   }) } 


/**
 * Raycaster
 */
 const raycaster = new THREE.Raycaster()
 const pointer = new THREE.Vector2();
// Getting [-1, 1] Coordinates to Target The uv Coordinates of The Plane
window.addEventListener('mousemove', (e) => {
  pointer.x = ( e.clientX / window.innerWidth ) * 2 - 1;
  pointer.y = - ( e.clientY / window.innerHeight ) * 2 + 1;
})

/**
 * Animation
 */
function animation(time) {
  const elapsedTime = time/1500;



  offset.x = lerp(offset.x, mouse.x, 0.1);
  offset.y = lerp(offset.y, mouse.y, 0.1);

  matArray.forEach(mat => {
    mat.uniforms.uTime.value = elapsedTime
    mat.uniforms.uOffset.value.set((mouse.x- offset.x) * 0.0001 , -(mouse.y- offset.y) * 0.0001 )
  })

  // Offset Plane Position on Mouse Move Effect 
  planesArray.forEach(plane => {
    plane.position.x = offset.x*0.05 + texturePosX;
  })

  // Raycasting
  if (sceneReady) {

    raycaster.setFromCamera( pointer, camera );

    const intersects = raycaster.intersectObject(planesArray[currentItem]);

    if (intersects.length) {
      // Mouse Enter The Plane
      for ( let i = 0; i < intersects.length; i ++ ) {
        // Get The UV Coordinates From The Plane Intersection With Pointer And Transform Them Into The Fragment Shader
        planesArray[currentItem].material.uniforms.uRaycastUvCoord.value = intersects[ i ].uv
      }
      anime({
        targets: planesArray[currentItem].material.uniforms.uRaycastUvFade,
        value: 0.15,
        duration: 500
      })
    } else {
      // Mouse Leave The Plane
      anime({
        targets: planesArray[currentItem].material.uniforms.uRaycastUvFade,
        value: -0.2,
        duration: 1500
      })
    }
  }

	renderer.render( scene, camera );
}
