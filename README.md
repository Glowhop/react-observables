# @glowhop/react-observables

Adaptateurs React legers pour les primitives `Observable` du paquet `@glowhop/observables`. Rattachez vos flux reactifs a l'ecosysteme React sans dupliquer la logique metier.

## Fonctionnalites

- Hooks concis pour projeter des `Observable`, `ObservableList` et `ObservableMap` dans l'UI.
- Selection memoizable via un `accessor` et une liste de dependances controlee.
- Typage complet TypeScript avec builds ESM et CommonJS dans `dist/`.
- Aucun runtime supplementaire : les hooks exploitent vos instances existantes d'`@glowhop/observables`.

## Installation

Assurez-vous que les dependances pair `@glowhop/observables` et `react` sont deja presentes.

```bash
npm install @glowhop/react-observables
# ou
yarn add @glowhop/react-observables
# ou
pnpm add @glowhop/react-observables
# ou
bun add @glowhop/react-observables
```

## Prise en main

```tsx
import { Observable } from "@glowhop/observables";
import { useMemo } from "react";
import { useValue } from "@glowhop/react-observables";

const counter = new Observable(0);

export function CounterButton() {
	const clicks = useValue(counter);

	return (
		<button onClick={() => counter.set((prev) => prev + 1)}>
			Clics: {clicks}
		</button>
	);
}
```

Les hooks ne creent ni ne gerent d'instances observables : vous restez libre de les declarer dans vos stores, services ou providers. Tant que l'instance est stable (memoisee, stockee dans un contexte, etc.), React se resynchronise automatiquement.

## Hooks disponibles

### `useValue(observable, accessor?, deps?)`

- Retourne la valeur courante exposee par l'`Observable`.
- `accessor` permet de deriver un sous-ensemble des donnees (selector).
- `deps` controle quand recalculer l'accessor; laissez vide pour utiliser uniquement les changements emis par l'observable.

```tsx
const identity = useValue(userObservable); // recoit l'objet entier
const displayName = useValue(
	userObservable,
	(user) => `${user.firstName} ${user.lastName}`,
	[], // deps optionnelles si l'accessor reference d'autres valeurs
);
```

### `useChange(observable, accessor, deps)`

Execute `accessor` a chaque emission. Ideal pour relayer l'etat observable vers une reference mutable ou un service.

```tsx
const titleRef = useRef<HTMLTitleElement | null>(null);

useChange(
	documentTitle$,
	(value) => {
		if (titleRef.current) {
			titleRef.current.textContent = value;
		}
	},
	[titleRef],
);
```

### `useEntry(observableList, index, accessor?, deps?)` / `useEntry(observableMap, key, accessor?, deps?)`

Projette un element cible depuis une `ObservableList` ou une `ObservableMap`. L'`accessor` optionnel permet de deriver une valeur a partir de l'item (y compris quand il est `undefined`), et `deps` controle les resouscriptions.

```tsx
const secondTodo = useEntry(todos$, 1);
const theme = useEntry(settings$, "theme", (entry) => entry ?? "light");
```

## Recommandations d'architecture

- Stabilisez vos observables avec `useMemo`, des contexts ou des singletons pour eviter les resouscriptions inutiles.
- Combinez les observables entre eux dans la couche metier, puis exposez uniquement les flux necessaires aux composants React.
- Appuyez-vous sur TypeScript pour beneficier des generiques proposes par le paquet.

## Scripts de developpement

```bash
bun install       # installe les dependances
bun test          # lance la suite de tests
bun run build     # genere les bundles ESM/CJS + declarations .d.ts
```

Le paquet est publie via `semantic-release`, configure dans `package.json` via le script `bun run release`.

## Licence

Ce projet est distribue sous licence ISC.
