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

/* -------------------------------- controls -------------------------------- */
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/* ---------------------------------- mesh ---------------------------------- */
const geo = new THREE.BoxGeometry(1, 1, 1);
const mat = new THREE.MeshBasicMaterial({
  color: "red",
});
const box = new THREE.Mesh(geo, mat);

const planeGeo = new THREE.PlaneGeometry(5, 5);
const plane = new THREE.Mesh(
  planeGeo,
  new THREE.MeshBasicMaterial({
    color: "gray",
  }),
);

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
