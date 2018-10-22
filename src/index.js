import { World, Bodies } from 'matter-js';
import lampixCore from '@lampix/core';
import lampixPhysics from '@lampix/physics';
import settings from './settings/datastructure';
import style from './css/style.css';
import './utils/pathseg';
import randomInt from './utils/randomInt';

// import audio1 from './assets/musical_notes/major/1.ogg';
// import audio2 from './assets/musical_notes/major/2.ogg';
// import audio3 from './assets/musical_notes/major/3.ogg';
// import audio4 from './assets/musical_notes/major/4.ogg';
// import audio5 from './assets/musical_notes/major/5.ogg';
// import audio6 from './assets/musical_notes/major/6.ogg';
// import audio7 from './assets/musical_notes/major/7.ogg';
// import audio8 from './assets/musical_notes/major/8.ogg';

// const audioList = [
//   audio1,
//   audio2,
//   audio3,
//   audio4,
//   audio5,
//   audio6,
//   audio7,
//   audio8
// ];

export default style;

global.decomp = require('poly-decomp');

// Full screen dimensions.
export const cw = window.innerWidth;
export const ch = window.innerHeight;
let firstObjectDetected = false;
const matterObject = [];
const placedObject = new Map();
// const vertexSets = [];

placedObject.set(-1, { x: randomInt(cw / 2 - 30, cw / 2 + 30) });
let refreshRate = 300;

const mSetupOptions = {
  width: 1280,
  height: 800,
  noWalls: settings.appModules.wallsDisabled,
  noRenderer: settings.appModules.internalCanvasDisabled
};
const MatterSetup = lampixPhysics;
export const matterSetup = new MatterSetup(mSetupOptions);

// Initializing everything with this function.
init();

// Main application loop. Runs endlessly with requestAnimationFrame.
function loop() {
  // Updating Lampix Physics as well, if enabled.
  matterSetup.utils.updateMatterEngine();
  matterObject.forEach((element, index) => {
    if (element.body.position.y > ch) {
      matterSetup.utils.deleteBody(element);
      matterObject.splice(index, 1);
    }
  });
  window.requestAnimationFrame(loop);
}

// Once the window loads, we start the loop.
window.onload = loop;

// Initializing the app.
export function init() {
  if (lampixCore) {
    registerDOMSimpleClassifiers();
    depthClassifier();
    // let lastRandom;
    // Events.on(matterSetup.engine, 'collisionStart', (event) => {
    //   const { pairs } = event;
    //   if (pairs[0] && !pairs[0].touched) {
    //     pairs[0].touched = true;
    //     let randomNr = Math.floor(randomInt(0, audioList.length));
    //     while (randomNr === lastRandom) {
    //       randomNr = Math.floor(randomInt(0, audioList.length));
    //     }
    //     lastRandom = randomNr;

    //     const sound = new Audio(audioList[randomNr]);
    //     sound.volume = 1;
    //     sound.play();
    //   }
    // });

    const refreshRateOnScreen = document.createElement('div');
    refreshRateOnScreen.setAttribute(
      'style',
      `font-family: Helvetica;
       font-size: 14px;
       position: absolute;
       left: 0;
       width: auto;
       top: 0;
       color: #ccc;`
    );
    refreshRateOnScreen.setAttribute('id', 'refresh-rate');
    document.body.appendChild(refreshRateOnScreen);
    refreshRateOnScreen.innerHTML = `refresh rate: ${refreshRate / 1000}s`;

    document.body.addEventListener('keypress', (ev) => {
      if (ev.key === 'w') {
        refreshRate += 10;
      }
      if (ev.key === 's') {
        refreshRate -= 10;
      }
      if (refreshRate < 30) {
        refreshRate = 30;
      }
      if (refreshRate > 2000) {
        refreshRate = 2000;
      }
      refreshRateOnScreen.innerHTML = `refresh rate: ${refreshRate / 1000}s`;
    });

    const message = document.createElement('div');
    message.setAttribute(
      'style',
      `font-family: Helvetica;
       text-transform: uppercase;
       font-size: 30px;
       text-align: center;
       position: absolute;
       left: 0;
       width: 100%;
       top: 50%;
       color: #222;
       text-shadow: 2px 1px 0px rgba(255,255,255,0.75), 3px 2px 0px rgba(255,255,255,0.45);`
    );
    message.setAttribute('id', 'how-to-start');
    document.body.appendChild(message);
    message.innerHTML = 'Place an object';
  }
}

function depthClassifier() {
  const promise = new Promise(resolve => {
    const watcher = {
      type: 'segmenter',
      name: 'DepthClassifier',
      shape: lampixCore.helpers.rectangle(0, 0, 1280, 800),
      params: {},
      onClassification: (detectedObjects) => {
        detectedObjects.forEach((obj) => {
          const { posX, posY } = obj.centerPoint;
          const { objectId } = obj;
          if (placedObject.get(objectId)) {
            matterSetup.Matter.World.remove(matterSetup.world, placedObject.get(objectId).obj);
          }
          const { points } = obj.outline;
          const result = [];
          points.forEach((point) => {
            result.push({ x: point.posX, y: point.posY });
          });
          placedObject.set(objectId, { obj: createObjectFromVertices(posX, posY, result), x: posX });
          // const theOptions = {
          //   x: posX,
          //   y: posY,
          //   vertices: result,
          //   matterOptions: {
          //     isStatic: true,
          //     collisionFilter: {
          //       category: 0x0002
          //     }
          //   }
          // };
          // placedObject.set(objectId, { obj: matterSetup.utils.createIrregular(theOptions), x: posX });
          if (!firstObjectDetected) {
            firstObjectDetected = true;
            placedObject.delete(-1);
            document.getElementById('how-to-start').style.display = 'none';
          }
        });
      },
      onLocation: () => console.log('onLocation')
    };
    lampixCore.watchers.add(watcher).then(([result]) => resolve(result));
  });
  return promise;
}

function createObjectFromVertices(cx, cy, outlines) {
  const obj = Bodies.fromVertices(cx, cy, outlines, {
    isStatic: true,
    collisionFilter: {
      category: 0x0002
    }
  }, true);
  World.add(matterSetup.engine.world, obj);
  return obj;
}

// function staticObject(x, y, r) {
//   const options = {
//     x,
//     y,
//     sides: randomInt(3, 5),
//     r,
//     matterOptions: {
//       isStatic: true,
//       collisionFilter: {
//         category: 0x0002
//       },
//       render: {
//         fillStyle: 'rgba(255, 0, 255, 0)',
//         lineWidth: 0
//       }
//     }
//   };
//   return matterSetup.utils.createCircular(options);
// }

// function loadSVG() {
//   fetch('./src/assets/Falling_for_fall_7501.svg')
//     .then(response => response.text())
//     .then(svg => {
//       const tempHTML = document.createElement('div');
//       tempHTML.innerHTML = svg;
//       Array.from(tempHTML.getElementsByTagName('path')).forEach(path => {
//         vertexSets.push(Svg.pathToVertices(path, 30));
//       });
//       setTimeout(matterTest, refreshRate);
//     });
// }
// loadSVG();

function registerDOMSimpleClassifiers() {
  const closeApp = document.getElementById('close-app');
  closeApp.style.opacity = 1;
  createSimpleClassifier(closeApp, 'closeApp', true);
}

function createSimpleClassifier(button) {
  const box = button.getBoundingClientRect();
  lampixCore.watchers.add({
    type: 'classifier',
    name: 'NeuralNetworkClassifier',
    shape: lampixCore.helpers.rectangle(box.left, box.top, box.width, box.height),
    params: {
      neural_network_name: 'cls_loc_fin_all_small'
    },
    onClassification: (result) => {
      if (parseInt(result, 10)) {
        lampixCore.switchToApp('app-switcher');
      }
    }
  });
}


matterSetup.world.gravity = { x: 0, y: 0.5 };
randomParticle();
function randomParticle() {
  const keys = Array.from(placedObject.keys());
  const options = {
    x: placedObject.get(keys[Math.floor(randomInt(0, keys.length))]).x + 25 - randomInt(0, 50),
    y: -randomInt(40, 200),
    r: randomInt(8, 14),
    matterOptions: {
      friction: 0,
      frictionAir: randomInt(0.008, 0.03),
      restitution: 0.7,
      torque: 0,
      collisionFilter: {
        mask: 0x0002
      },
      render: {
        lineWidth: 0
      }
    }
  };
  matterObject.push(matterSetup.utils.createCircular(options));
  setTimeout(randomParticle, refreshRate);
}
