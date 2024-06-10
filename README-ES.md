# Switch Matcher <span style="float:right;">[![Estado en Progreso](https://img.shields.io/badge/Estado-En%20progreso-yellow.svg)](https://github.com/LeoLizc/switch-matcher)</span>

Biblioteca simple y ligera para manejar sentencias switch y Pattern Matching en JavaScript y TypeScript.

## Instalación

Para instalar el paquete, puedes usar npm o tu gestor de paquetes favorito.

```bash
npm install switch-matcher
```

## Características

- **Simple**: Usa una sintaxis similar a las sentencias switch de JavaScript y métodos encadenables.
- **Ligero**: Tiene pocas dependencias y es muy ligero.
- **Versátil**: Puede ser utilizado en cualquier proyecto de JavaScript o TypeScript.

## Uso

`Switch-Matcher` te proporciona dos interfaces principales para trabajar: la clase `Switcher` y `Matcher` (esta última a través de la función `match`).
_Aquí viene una descripción más detallada sobre las interfaces._

### Switcher

`SMSwitcher` es una clase que facilita la definición y evaluación de condiciones de manera estructurada. Permite crear un pipeline a través de múltiples casos (`case`), un manejador por defecto (`default`) y un manejador alternativo (`else`). Además, soporta evaluaciones tanto síncronas como asíncronas.

Primero importar la clase `SMSwitcher`.

```typescript
import { SMSwitcher } from "switch-matcher";
```

#### Crear un switcher

```typescript
const switcher = new SMSwitcher<string, string>();
```

#### Definir casos

```typescript
switcher
  .case("value1", () => "Handled value1")
  .case("value2", "Handled value2")
  .case((value) => value.startsWith("test"), "Handled test values")
  .default(() => "Default handler")
  .elseValue("Else handler");
```

#### Evaluar un valor

```typescript
const result = switcher.syncEval("value1"); // Result: 'Handled value1'
const promiseResult = switcher.eval("unknown"); // Result: 'Else handler'
```

### Matcher

`SMMatcher` es una clase similar a `SMSwitcher`, pero diseñada para evaluar un valor específico contra múltiples condiciones de manera más sencilla. Ofrece una forma directa de definir casos (`case`), un manejador por defecto (`default`) y un valor alternativo (`else`). A diferencia del `Switcher`, `Matcher` los casos se evaluan en el momento, y no soporta evaluaciones asíncronas.

Primero importar la función `match`.

```typescript
import { match } from "switch-matcher";
```

#### Crear un matcher

```typescript
const matcher = match<string, string>("value1");
```

#### Definir casos

```typescript
matcher
  .case("value1", () => "Handled value1")
  .case("value2", "Handled value2")
  .case((value) => value.startsWith("test"), "Handled test values")
  .default(() => "Default handler")
  .else("Else handler");
```

#### Obtener el valor resultante

```typescript
const result = matcher.value; // Result: 'Handled value1' o 'Else handler' si no hay coincidencias
```

## Contribuciones

Si deseas contribuir al proyecto, puedes seguir estos pasos:

1. Haz un fork del proyecto.
2. Crea una nueva rama.
3. Realiza tus cambios.
4. Haz commit de tus cambios.
5. Sube tus cambios a tu fork.
6. Abre una pull request.

¡Y eso es todo! Puedes contribuir fácilmente al proyecto y ayudar a mejorarlo.

## Funcionalidades Futuras

Aquí listaremos las funcionalidades que planeamos añadir a la biblioteca en el futuro.

## Créditos

Este paquete fue desarrollado por [LeoLizc](https://github.com/LeoLizc). Agradecemos a las siguientes personas y proyectos por sus contribuciones:

- [leovergaramarq](https://github.com/leovergaramarq): Descripción breve de su contribución.

## Licencia

Este paquete está bajo la licencia MIT. Puedes ver el archivo de licencia [aquí](LICENSE).
