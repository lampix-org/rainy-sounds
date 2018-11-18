# Lampix App Starter

Minimal boilerplate to help get started with Lampix apps.  
It does not assume the technologies that will be used.

## Table of Contents

1. [Installation](#installation)
2. [Usage](#usage)
3. [Contributing](#contributing)
4. [License](#license)

## Installation

`git clone --depth=1 git@gitlab.rosoftlab.net:lampix/lampix-app-starter.git yourapp`  
`cd yourapp`  
`npm install`

If you're not improving the boilerplate, but rather starting a new app: 

- if you want to update with changes from upstream: `git remote add upstream git@github.com:lampix-org/app-boilerplate.git`, and `git remote set-url origin <your-remote>`
- if you don't care about upstream, either remove the `.git` folder completely or run `git remote set-url origin <your-remote>`, overwriting the connection to upstream with your own

### Features

### HMR

Helps speed up development as you won't have to manually reload all the time for the slightest of changes (this works both in the browser and in the simulator since the content is served via the WebpackDevServer).

Other features are on their way, and you are more than welcome to create an issue or a pull request for them.

### Sourcemaps

Sourcemaps are enabled by default for the development environment.

### Usage

#### Developing

`src/index.js` is defined as the entry point of the application. You do not need to add scripts to `index.html`. As long as any dependency in the dependency tree connects to the root (`src/index.js`) directly or indirectly, Webpack will bundle the dependencies correctly. That means you should import ANY dependencies, including `json` files, images, CSS files and the whatever else you might need.

With the above in mind, get started developing by running `npm start` and going to the specified URL.

#### Production

`npm run build` will output the `dist` directory with a flattened file structure and paths to them updated automatically and accordingly in your code.

## Contributing

Open an issue first to discuss potential changes/additions.  
We'd like to keep the `master` branch minimal, but we can definitely have branches specific for environments using SASS, LESS, Stylus, JSX, TypeScript etc.

**[Back to top](#table-of-contents)**

## License

#### (The MIT License)

Copyright (c) 2018 Lampix

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

**[Back to top](#table-of-contents)**
