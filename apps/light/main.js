import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import GUI from "lil-gui";

const canvas = document.getElementById("webgl");

/* ---------------------------------- scene --------------------------------- */
const scene = new THREE.Scene();

/* --------------------------------- camera --------------------------------- */
const camera = new THREE.PerspectiveCamera(75, innerWidth / innerHeight);
camera.position.z = 5;
scene.add(camera);

/* ---------------------------------- light --------------------------------- */
// const ambientLight = new THREE.AmbientLight();
// ambientLight.color = new THREE.Color(0xffff);
// ambientLight.intensity = 1;
// scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0x00fffc, 0.3);
directionalLight.position.set(1, 0.25, 0);
scene.add(directionalLight);

// const hemisphereLight = new THREE.HemisphereLight(0xff0000, 0x0000ff, 0.3);
// scene.add(hemisphereLight);

// const pointLight = new THREE.PointLight(0xff9000, 0.5, 10, 2);
// pointLight.position.set(1, -0.5, 1);
// scene.add(pointLight);

// const rectAreaLight = new THREE.RectAreaLight(0x4e00ff, 2, 1, 1);
// rectAreaLight.position.set(-1.5, 0, 1.5);
// rectAreaLight.lookAt(new THREE.Vector3());
// scene.add(rectAreaLight);

/* ------------------------------- lightHelper ------------------------------ */
// const hemisphereLightHelper = new THREE.HemisphereLightHelper(hemisphereLight, 0.2);
// scene.add(hemisphereLightHelper);

const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight, 0.2);
scene.add(directionalLightHelper);

// const pointLightHelper = new THREE.PointLightHelper(pointLight, 0.2);
// scene.add(pointLightHelper);

// const spotLightHelper = new THREE.SpotLightHelper(spotLight);
// scene.add(spotLightHelper);

/* -------------------------------- controls -------------------------------- */
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/* ---------------------------------- mesh ---------------------------------- */
const geo = new THREE.BoxGeometry(1, 1, 1);
const mat = new THREE.MeshStandardMaterial({
  roughness: 0.4,
});
const box = new THREE.Mesh(geo, mat);

const planeGeo = new THREE.PlaneGeometry(5, 5);
const plane = new THREE.Mesh(planeGeo, mat);

plane.rotation.x = -Math.PI * 0.5;
plane.position.y = -1;

scene.add(box);
scene.add(plane);

/* ---------------------------------- debug --------------------------------- */
const gui = new GUI();
const guiObj = {
  boxColor: 0xff0000,
  planeColor: 0xffff,
};

gui.addColor(guiObj, "boxColor").onChange((val) => {
  box.material.color.set(val);
});
gui.addColor(guiObj, "planeColor").onChange((val) => {
  plane.material.color.set(val);
});

gui.add(box.position, "y", -3, 3, 0.01);
gui.add(box.position, "x", -3, 3, 0.01);
gui.add(box.position, "z", -3, 3, 0.01);

gui.add(directionalLight.position, "x", 0, 2, 0.01);
gui.add(directionalLight.position, "y", 0, 2, 0.01);
gui.add(directionalLight.position, "z", 0, 2, 0.01);

/* -------------------------------- renderer -------------------------------- */
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(innerWidth, innerHeight);
renderer.setPixelRatio(devicePixelRatio);

const render = () => {
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
