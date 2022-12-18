import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import GUI from "lil-gui";

const gui = new GUI();

const canvas = document.getElementById("webgl");

/* --------------------------------- texture -------------------------------- */
const textureLoader = new THREE.TextureLoader();
const bakedShadow = textureLoader.load("/textures/bakedShadow.jpg");
const simpleShadow = textureLoader.load("/textures/simpleShadow.jpg");

/* ---------------------------------- scene --------------------------------- */
const scene = new THREE.Scene();

/* --------------------------------- camera --------------------------------- */
const camera = new THREE.PerspectiveCamera(75, innerWidth / innerHeight);
camera.position.z = 5;
scene.add(camera);

/* -------------------------------- controls -------------------------------- */
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/* ---------------------------------- light --------------------------------- */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
gui.add(ambientLight, "intensity", 0, 1, 0.001);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(2, 2 - 1);
gui.add(directionalLight, "intensity", 0, 1, 0.001);
gui.add(directionalLight.position, "x").min(-5).max(5).step(0.001);
gui.add(directionalLight.position, "y").min(-5).max(5).step(0.001);
gui.add(directionalLight.position, "z").min(-5).max(5).step(0.001);

scene.add(directionalLight);

directionalLight.castShadow = true;
directionalLight.shadow.mapSize.width = 1024;
directionalLight.shadow.mapSize.height = 1024;

// shadow camera
directionalLight.shadow.camera.near = 1;
directionalLight.shadow.camera.far = 5;
directionalLight.shadow.camera.top = 2;
directionalLight.shadow.camera.right = 2;
directionalLight.shadow.camera.bottom = -2;
directionalLight.shadow.camera.left = -2;
directionalLight.shadow.radius = 10;

// 카매라 헬퍼
const directioanlLightCameraHelper = new THREE.CameraHelper(directionalLight.shadow.camera);
scene.add(directioanlLightCameraHelper);

/* ---------------------------------- mesh ---------------------------------- */

const mat = new THREE.MeshStandardMaterial();
mat.roughness = 0.7;
gui.add(mat, "metalness").min(0).max(1).step(0.001);
gui.add(mat, "roughness").min(0).max(1).step(0.001);
const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), mat);
sphere.castShadow = true;

const planeGeo = new THREE.PlaneGeometry(5, 5);
const plane = new THREE.Mesh(
  planeGeo,
  new THREE.MeshBasicMaterial({
    // map: bakedShadow, // apply texture
  }),
);

plane.receiveShadow = true;
plane.rotation.x = -Math.PI * 0.5;
plane.position.y = -0.5;

scene.add(sphere);
scene.add(plane);

const shadowPlane = new THREE.Mesh(
  new THREE.PlaneGeometry(1.5, 1.5),
  new THREE.MeshBasicMaterial({
    color: 0x000000,
    transparent: true,
    alphaMap: simpleShadow,
  }),
);

shadowPlane.rotation.x = -Math.PI * 0.5;
shadowPlane.position.y = plane.position.y + 0.01;

scene.add(shadowPlane);

/* -------------------------------- renderer -------------------------------- */
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(innerWidth, innerHeight);
renderer.setPixelRatio(devicePixelRatio);

// Eanble rendering shadow
// renderer.shadowMap.enabled = true;

const clock = new THREE.Clock();

const render = () => {
  const elapsedTime = clock.getElapsedTime();

  // animate sphere
  sphere.position.x = Math.cos(elapsedTime) * 1.5;
  sphere.position.z = Math.sin(elapsedTime) * 1.5;
  sphere.position.y = Math.abs(Math.sin(elapsedTime * 3));

  // move shadow
  shadowPlane.position.x = sphere.position.x;
  shadowPlane.position.z = sphere.position.z;
  shadowPlane.material.opacity = (1 - sphere.position.y) * 0.3;

  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(render);
};

// Event Handlers
addEventListener("resize", (e) => {
  // update camera
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  // Update renderer
  renderer.setSize(innerWidth, innerHeight);
  renderer.setPixelRatio(devicePixelRatio);
});

render();
