import { World, Bodies, Events } from 'matter-js';
import lampixCore from '@lampix/core';
import lampixPhysics from '@lampix/physics';
import settings from './settings/datastructure';
import style from './css/style.css';
import './utils/pathseg';
import randomInt from './utils/randomInt';

import audio1 from './assets/musical_notes/major/1.ogg';
import audio2 from './assets/musical_notes/major/2.ogg';
import audio3 from './assets/musical_notes/major/3.ogg';
import audio4 from './assets/musical_notes/major/4.ogg';
import audio5 from './assets/musical_notes/major/5.ogg';
import audio6 from './assets/musical_notes/major/6.ogg';
import audio7 from './assets/musical_notes/major/7.ogg';
import audio8 from './assets/musical_notes/major/8.ogg';

const audioList = [
  audio1,
  audio2,
  audio3,
  audio4,
  audio5,
  audio6,
  audio7,
  audio8
];

export default style;

global.decomp = require('poly-decomp');

// Full screen dimensions.
export const cw = window.innerWidth;
export const ch = window.innerHeight;
const matterObject = [];
const placedObject = {};
// const addedToList = [];
// const removedFromList = [];
// const vertexSets = [];
const initialObjectOnSet = { x: randomInt(cw / 2 - 30, cw / 2 + 30) };
placedObject.initial = initialObjectOnSet;

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
    let lastRandom;

    lampixCore
      .getAppConfig()
      .then((config) => {
        if (!config.volume) {
          return;
        }

        Events.on(matterSetup.engine, 'collisionStart', (event) => {
          const { pairs } = event;
          if (pairs[0] && !pairs[0].touched) {
            pairs[0].touched = true;
            let randomNr = Math.floor(randomInt(0, audioList.length));
            while (randomNr === lastRandom) {
              randomNr = Math.floor(randomInt(0, audioList.length));
            }
            lastRandom = randomNr;

            const sound = new Audio(audioList[randomNr]);
            sound.volume = config.volume;
            sound.play();
          }
        });
      });

    const refreshRateOnScreen = document.createElement('div');
    refreshRateOnScreen.setAttribute(
      'style',
      `font-family: Helvetica;
       font-size: 14px;
       position: absolute;
       left: 50px;
       width: auto;
       top: 0;
       color: #ccc;`
    );
    refreshRateOnScreen.setAttribute('id', 'refresh-rate');
    document.body.appendChild(refreshRateOnScreen);

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
  return lampixCore.getAppConfig()
    .then((config) => {
      const watcher = {
        name: 'DepthClassifier',
        shape: lampixCore.helpers.rectangle(0, 0, 1280, 800),
        params: config.depthClassifierParams,
        onClassification: (detectedObjects) => {
          detectedObjects.forEach((obj) => {
            const { posX, posY } = obj.centerPoint;
            const { objectId } = obj;
            if (placedObject[objectId]) {
              matterSetup.Matter.World.remove(matterSetup.world, placedObject[objectId].obj);
              delete placedObject[objectId];
            } else if (obj.outline && obj.outline.points.length) {
              const { points } = obj.outline;
              const result = [];
              points.forEach(point => {
                result.push({ x: point.posX, y: point.posY });
              });
              placedObject[objectId] = { obj: createObjectFromVertices(posX, posY, result), x: posX };

              if (placedObject.initial) {
                delete placedObject.initial;
                document.getElementById('how-to-start').style.display = 'none';
              }
            }
            if (Object.keys(placedObject).length === 0) {
              placedObject.initial = initialObjectOnSet;
              document.getElementById('how-to-start').style.display = 'block';
            }
          });
        }
      };

      return lampixCore.watchers.add(watcher).then(([result]) => result);
    });
}

function createObjectFromVertices(cx, cy, outlines) {
  const obj = Bodies.fromVertices(cx, cy, outlines, {
    isStatic: true,
    collisionFilter: {
      category: 0x0002
    },
    // angle: 0.2 * (Math.PI / 180)
  }, true);
  World.add(matterSetup.engine.world, obj);
  return obj;
}

function registerDOMSimpleClassifiers() {
  const closeApp = document.getElementById('close-app');
  closeApp.style.opacity = 1;
  createSimpleClassifier(closeApp, 'closeApp', true);
}

function createSimpleClassifier(button) {
  const box = button.getBoundingClientRect();
  lampixCore.watchers.add({
    name: 'NeuralNetworkClassifier',
    shape: lampixCore.helpers.rectangle(box.left, box.top, box.width, box.height),
    params: {
      neural_network_name: 'fingers'
    },
    onClassification: ([recognizedObject]) => {
      if (parseInt(recognizedObject.classTag, 10)) {
        lampixCore.switchToApp('app-switcher');
      }
    }
  });
}


matterSetup.world.gravity = { x: 0, y: 1.7 };
randomParticle();
function randomParticle() {
  const keys = Object.keys(placedObject);
  const randomKey = keys[Math.floor(randomInt(0, keys.length))];
  const options = {
    x: placedObject[randomKey].x + 25 - randomInt(0, 50),
    y: -randomInt(40, 200),
    r: randomInt(8, 18),
    matterOptions: {
      friction: 0,
      frictionAir: randomInt(0.03, 0.07),
      restitution: 0.4,
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
