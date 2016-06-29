Copy
=====

Copy is a node module that allows for smooth recursive copies in Node.js, it provides some shiny options to simplfy your packages.

## Installation
```
npm install -g sb-copy
```

## API
```js
export type Options = {
  filter?: ((source: string, destination: string) => boolean),
  dotFiles?: boolean,
  overwrite?: boolean,
  deleteExtra?: boolean,
  failIfExists?: boolean,
  tickCallback?: ((source: string, destination: string) => void)
}
export default function copy(source: string, destination: string [, options: Options])
```

## Usage

```js
import copy from 'sb-copy'

copy('./lib', './lib2', {
  failIfExists: false,
}).then(function() {
  console.log('all files moved')
}, function(error) {
  console.log('files not moved', error)
})
```

## License

This Project is licensed under the terms of MIT License, see the LICENSE file for more info.
