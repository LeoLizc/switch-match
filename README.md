# Switch Matcher <span style="float:right;">[![Estado del Proyecto](https://img.shields.io/badge/Estado-En%20progreso-yellow.svg)](https://github.com/LeoLizc/switch-matcher)</span>

Simple and lightweight library to handle switch statements and Pattern Matching in JavaScript and typescript.

## Installation

To install the package, you can use npm or your favorite package manager.

```bash
npm install switch-match
```

## Features

- **Simple**: Uses a syntax similar to JavaScript switch statements and chainable methods.
- **Lightweight**: Has few dependencies and is very lightweight.
- **Versatile**: Can be used in any JavaScript or TypeScript project.

## Usage

To use the library, you need to import the `match` function and use it in your code.

```javascript
import { match } from "switch-matcher";

const result = match(5)
  .case(1, () => "One")
  .case(2, () => "Two")
  .case(3, () => "Three")
  .default(() => "Other");

console.log(result); // Other
```

## Contributing

If you want to contribute to the project, you can follow these steps:

1. Fork the project.
2. Create a new branch.
3. Make your changes.
4. Commit your changes.
5. Push your changes to your fork.
6. Open a pull request.

And that's it! You can easily contribute to the project and help improve it.

## Incoming Features

Here we will list the features that we plan to add to the library in the future.

## Credits

Este paquete fue desarrollado por [LeoLizc](https://github.com/LeoLizc). Agradecemos a las siguientes personas y proyectos por sus contribuciones:

- [leovergaramarq](https://github.com/leovergaramarq): Descripción breve de su contribución.

## Licencia

Este paquete está bajo la licencia MIT. Puedes ver el archivo de licencia [aquí](LICENSE).
