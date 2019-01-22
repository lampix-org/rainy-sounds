# Rainy Sounds

# Scope

This application showcases the use of [`DepthClassifier`](https://api.lampix.co/application-development/standard-watchers#depthclassifier) by dropping circles on top of detected objects.

## Usage

Clone or download the repository and upload the `.zip` file in the `build-x.y.z` (e.g `build-0.2.0`) folder to Lampix for installation. 

After installing and starting the app, place a cup on the surface and watch the circles bounce off of it!

## Building from source

If you're interested in creating the app bundle yourself, you'll need to run the following after cloning:

- `npm install`
- `npm run build`

This will generate a `dist-x.y.z` directory, which has the generated files for the app (which could be used to generate a `.zip` file for Lampix) and a `.zip` file with the name of `rainy-sounds-vX.Y.Z.zip` which is already set up. Upload this `.zip` file to Lampix ([see the local deployment docs](https://api.lampix.co/application-development/deploying/local-upload)).
