import { Events } from 'matter-js';
import lampixCore from '@lampix/core';
import lampixPhysics from '@lampix/physics';
import debounce from 'lodash.debounce';
import updateSimpleClassifiers from './utils/updateSimpleClassifiers';
import { settings, classifierString } from './settings/datastructure';
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

// Request Animation Frame is being called 30 times per second.
const requestAnimFrame = (function () {
  return window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    function (callback) {
      window.setTimeout(callback, 1000 / 60);
    };
}());

// Full screen dimensions.
export const cw = window.innerWidth;
export const ch = window.innerHeight;
let firstObjectDetected = false;
const matterObject = [];
const placedObject = new Map();
// const vertexSets = [];
placedObject.set(-1, { x: randomInt(cw / 2 - 30, cw / 2 + 30) });
let refreshRate = 500;

// See if the physics engine is required and instantiate it.
let tempMatter;
if (settings.appModules.physics) {
// Setting up the Matter JS Physics library.
  const mSetupOptions = {
    width: 1280,
    height: 800,
    noWalls: settings.appModules.wallsDisabled,
    noRenderer: settings.appModules.internalCanvasDisabled
  };
  const MatterSetup = lampixPhysics;
  tempMatter = new MatterSetup(mSetupOptions);
} else {
  tempMatter = null;
}
export const matterSetup = tempMatter;

export const simpleClassifiers = [];

// Loading a debounce function for updating the simple classfiers.
export const debouncedUpdateSC = debounce(updateSimpleClassifiers, 2000);

// Initializing everything with this function.
init();

// Main application loop. Runs endlessly with requestAnimationFrame.
function loop() {
  // Updating Lampix Physics as well, if enabled.
  if (settings.appModules.physics) {
    matterSetup.utils.updateMatterEngine();
    matterObject.forEach((element, index) => {
      if (element.body.position.y > ch) {
        matterSetup.utils.deleteBody(element);
        matterObject.splice(index, 1);
      }
    });
  }
  requestAnimFrame(loop);
}

// Once the window loads, we start the loop.
window.onload = loop;

// Initializing the app.
export function init() {
  if (lampixCore) {
    let lastRandom;
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
        sound.volume = 1;
        sound.play();
      }
    });

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
    message.innerHTML = 'Place a capsule';

    lampixCore.registerPositionClassifier(
      [{
        posX: 0, posY: 0, width: 1280, height: 800, classifier: classifierString
      }],
      // Identification callback.
      (rectIndex, outlines) => {
        document.createElement('div');
        const element = document.createElement('div');
        element.setAttribute('style', 'position: relative; left: 0; top: 0; width: auto; color: #aaa');
        document.body.appendChild(element);
        outlines.forEach(classification => {
          const id = classification.objectId;
          if (classification.classTag === '' || classification.classTag === undefined || !classification.classTag) {
            element.innerHTML = '-';
            matterSetup.utils.deleteBody(placedObject.get(id).obj);
            placedObject.delete(id);
            if (placedObject.size === 0) {
              document.getElementById('how-to-start').style.display = 'block';
              firstObjectDetected = false;
              placedObject.set(-1, { x: randomInt(cw / 2 - 30, cw / 2 + 30) });
            }
          } else {
            const cx = classification.centerPoint.posX;
            const cy = classification.centerPoint.posY;
            placedObject.set(id, { obj: staticObject(cx, cy, 30), x: cx });
            element.innerHTML = '+';
            if (!firstObjectDetected) {
              firstObjectDetected = true;
              placedObject.delete(-1);
              document.getElementById('how-to-start').style.display = 'none';
            }
          }
        });
      },
      // Detection callback.
      // (rectIndex, outlines) => {
      // }
    );
  } else {
    const classOptionDomElement = document.createElement('select');
    classOptionDomElement.setAttribute('style', 'position: absolute; width: 32px; height: 19px; top: 0; left: 0;');
    for (let i = 0; i < 7; i++) {
      const option = document.createElement('option');
      option.value = i.toString();
      option.text = i.toString();
      classOptionDomElement.appendChild(option);
    }
    document.body.insertBefore(classOptionDomElement, document.body.firstChild);
  }
}

function staticObject(x, y, r) {
  const options = {
    x,
    y,
    sides: randomInt(3, 5),
    r,
    matterOptions: {
      isStatic: true,
      collisionFilter: {
        category: 0x0002
      },
      render: {
        fillStyle: 'rgba(255, 0, 255, 0)',
        lineWidth: 0
      }
    }
  };
  return matterSetup.utils.createCircular(options);
}

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

matterSetup.world.gravity = { x: 0, y: 0.5 };
randomParticle();
function randomParticle() {
  const keys = Array.from(placedObject.keys());
  const options = {
    x: placedObject.get(keys[Math.floor(randomInt(0, keys.length))]).x + 25 - randomInt(0, 50),
    y: -randomInt(40, 200),
    r: randomInt(2, 6),
    matterOptions: {
      friction: 1,
      frictionAir: randomInt(0.01, 0.04),
      restitution: 0.4,
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
