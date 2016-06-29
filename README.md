Copy
=====

Copy is a node module that allows for smooth recursive copies in Node.js, it provides some shiny options to simplfy your packages.

## Installation
```
npm install -g sb-copy
```

## API
```
export type Options = {
  filter?: ((source: string, destination: string) => boolean),
  dotFiles?: boolean,
  overwrite?: boolean,
  deleteExtra?: boolean,
  failIfExists?: boolean,
  tickCallback?: ((source: string, destination: string) => void)
}
```

## License

This Project is licensed under the terms of MIT License, see the LICENSE file for more info.
