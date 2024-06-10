# Switch Matcher <span style="float:right;">[![Status in Progress](https://img.shields.io/badge/Status-In%20progress-yellow.svg)](https://github.com/LeoLizc/switch-matcher)</span>

Simple and lightweight library for handling switch statements and Pattern Matching in JavaScript and TypeScript.

## Installation

To install the package, you can use npm or your favorite package manager.

```bash
npm install switch-matcher
```

## Features

- **Simple**: Uses a syntax similar to JavaScript switch statements and chainable methods.
- **Lightweight**: Has few dependencies and is very lightweight.
- **Versatile**: Can be used in any JavaScript or TypeScript project.

## Usage

`Switch-Matcher` provides two main interfaces to work with: the `Switcher` and `Matcher` classes (the latter through the `match` function).
_Here comes a more detailed description of the interfaces._

### Switcher

`SMSwitcher` is a class that facilitates the definition and evaluation of conditions in a structured manner. It allows creating a pipeline through multiple cases (`case`), a default handler (`default`), and an alternative handler (`else`). Additionally, it supports both synchronous and asynchronous evaluations.

First, import the `SMSwitcher` class.

```typescript
import { SMSwitcher } from "switch-matcher";
```

#### Creating a switcher

```typescript
const switcher = new SMSwitcher<string, string>();
```

#### Defining cases

```typescript
switcher
  .case("value1", () => "Handled value1")
  .case("value2", "Handled value2")
  .case((value) => value.startsWith("test"), "Handled test values")
  .default(() => "Default handler")
  .elseValue("Else handler");
```

#### Evaluating a value

```typescript
const result = switcher.syncEval("value1"); // Result: 'Handled value1'
const promiseResult = switcher.eval("unknown"); // Result: 'Else handler'
```

### Matcher

`SMMatcher` is a class similar to `SMSwitcher`, but designed to evaluate a specific value against multiple conditions more straightforwardly. It offers a direct way to define cases (`case`), a default handler (`default`), and an alternative value (`else`). Unlike `Switcher`, `Matcher` evaluates the cases at the moment and does not support asynchronous evaluations.

First, import the `match` function.

```typescript
import { match } from "switch-matcher";
```

#### Creating a matcher

```typescript
const matcher = match<string, string>("value1");
```

#### Defining cases

```typescript
matcher
  .case("value1", () => "Handled value1")
  .case("value2", "Handled value2")
  .case((value) => value.startsWith("test"), "Handled test values")
  .default(() => "Default handler")
  .else("Else handler");
```

#### Getting the resulting value

```typescript
const result = matcher.value; // Result: 'Handled value1' or 'Else handler' if no matches
```

## Contributions

If you want to contribute to the project, you can follow these steps:

1. Fork the project.
2. Create a new branch.
3. Make your changes.
4. Commit your changes.
5. Push your changes to your fork.
6. Open a pull request.

And that's it! You can easily contribute to the project and help improve it.

## Future Features

Here we will list the features we plan to add to the library in the future.

## Credits

This package was developed by [LeoLizc](https://github.com/LeoLizc). We thank the following people and projects for their contributions:

- [leovergaramarq](https://github.com/leovergaramarq): Brief description of their contribution.

## License

This package is under the MIT license. You can view the license file [here](LICENSE).
