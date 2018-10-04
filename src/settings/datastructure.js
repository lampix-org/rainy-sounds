// The datastructure file is used to define Application Modules, functionalities,
// objects and their recommendations and UI.

export const settings = {
  // These are used to define which main functionalities the app will have.
  appModules: {
    // Disable physics here.
    physics: true, // Default is true.
    // Enable product rating here.
    productRating: false, // Default is false.
    // Disable manual product close.
    productClose: false, // Default is false.
    // Enable growth animations for recommendations.
    growthAnimations: false, // Default is false.
    // Lines between products and recommendations can be enabled here.
    lineConnections: true, // Default is false.
    // Locks a product on the table (if you move the product everything stays).
    lockProducts: true, // Default is true.
    // Use this to enable or disable the built in Matter JS Render.
    internalCanvasDisabled: false, // Default is true.
    // Establish if the screen should have physical walls around or not.
    wallsDisabled: true, // Default is false.
    // Idle state animation code. It's a string.
    idleAnimation: 'lines-from-center', // Default is none.
    // Idle animation timeout
    idleAnimationSeconds: 300000
  },

  // A list of all the image resources that the app will use.
  imageResources: [
  ],

  // A list of the products and their recommendations.
  productResources: {
    // Every product has a number associated to them or a class tag.
    3: {
      // Used to define if this objects attracts towards it other ones.
      // attractsOthers: true,
      // If this objects attracts others, you may define a general orbit upon
      // which its targets will gravitate around the object.
      // attractionOrbit: 100,
      // The recommendations list.
      recommendations: [
        {
          // The class number of a recommended item.
          classTag: '5',
          // Angle to the product used to place the recommendation geometrically.
          // This angle may change dynamically in case physics are enabled and
          // physical interactions occur.
          angleToProduct: 90,
          // This defines the absolute minimum distance between it and the product.
          // This distance will change dynamically in case physics are enabled and
          // physical interactions occur.
          minimumDistanceToProduct: 200,
          // The maximum distance can also be defined but is not mandatory.
          // maximumDistanceToProduct: 0,
          // In case you want a line to be drawn from the product to the recommendation.
          lineConnectionSettings: {
            // Two types are supported: straight or curved.
            type: 'curved',
            color: '#aaf80e',
            thickness: 3
          }
        }
      ],
      // Image is used in case you want some other image over the product,
      // other than the spotlight.
      image: 'NouRistretto'
    },
    5: {
      recommendations: [
        {
          classTag: '9',
          angleToProduct: 90,
          minimumDistanceToProduct: 200,
          lineConnectionSettings: {
            type: 'curved',
            color: '#aaf80e',
            thickness: 3
          }
        }
      ],
      image: 'NouDulsao'
    },
    9: {
      recommendations: [
        {
          classTag: '4',
          angleToProduct: 90,
          minimumDistanceToProduct: 200,
          lineConnectionSettings: {
            type: 'curved',
            color: '#aaf80e',
            thickness: 3
          }
        }
      ],
      image: 'NouLinizio'
    },
    4: {
      recommendations: [
        {
          classTag: '10',
          angleToProduct: 90,
          minimumDistanceToProduct: 200,
          lineConnectionSettings: {
            type: 'curved',
            color: '#aaf80e',
            thickness: 3
          }
        }
      ],
      image: 'NouRosabaya'
    },
    10: {
      recommendations: [
        {
          classTag: '3',
          angleToProduct: 90,
          minimumDistanceToProduct: 200,
          lineConnectionSettings: {
            type: 'curved',
            color: '#aaf80e',
            thickness: 3
          }
        }
      ],
      image: 'NouVivalto'
    }
  },

  // These are the resources for the UI Object Types. Possible usage can be found in the commented section below.
  // // Type tag.
  // "69": {
  //   // Define what kind of an UI element this is.
  //   itemType: "simpleButton",
  //   // A default image for the button.
  //   image: images.z,
  //   // Add this if you want your button to have a press animation.
  //   pressAnimation: "fillRing", // fillRing and growButton are the first two types.
  //   animationTimer: 500,  // The amount of miliseconds needed for a full animation loop.
  //   // If there is no image you can use text settings as seen below.
  //   text: "Button A",
  //   font: "20px Roboto",
  //   color: 'grey',
  //   // If there is no image and no text, you can tell the app to build a graphical object.
  //   graphics: "circle", // Can be circle or square.
  //   size: 30, // Either the radius or the side length.
  //   borderSize: 3,  // Outer side thickness.
  //   borderColor: 'green', // Border color.
  //   fillColor: 'black', // Fill color for the button interior.
  //   // Now it's time to pick which function the button will fulfill upon press.
  //   functionality: "simpleButtonFunction"
  // },
  // "79": {
  //   itemType: "compositeButton",
  //   totalWidth: 300,  // All the pixels needed for the elements.
  //   totalHeight: 200, // All the pixels needed for the elements.
  //   components: [
  //     {
  //       // Same item properties as above. You can have more of them though.
  //     },
  //     { }
  //   ],
  //   functionality: "compositeButtonFunction"
  // }
  userInterfaceResources: { }
};

// This code loads all the above mentioned images into the app.
export const images = {};
settings.imageResources.forEach((element) => {
  const img = new Image();
  img.src = `src/assets/${element}.png`;
  images[element] = img;
});

// These are the two classifier strings which will be used by the app for products and fingers.
// export const classifierString = 'segm_cls_loc_nes;circle:10,70,0.65|area:10,60000|thresh:65';
export const classifierString = 'hand_classifier';
export const fingerClassifierString = 'cls_loc_fin_all_small';
