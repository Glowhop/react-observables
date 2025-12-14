# @glowhop/react-observables

Adaptateurs React legers pour les primitives `Observable` du paquet `@glowhop/observables`. Rattachez vos flux reactifs a l'ecosysteme React sans dupliquer la logique metier.

## Fonctionnalites

- Hooks concis pour projeter des `Observable`, `ObservableList` et `ObservableMap` dans l'UI.
- Selection memoizable via un `accessor` et une liste de dependances controlee.
- Version "lazily concurrente" (`useLazy`) qui synchronise les emissions sous `startTransition`.
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

- Retourne la valeur courante exposee par l'`Observable` et se met a jour sur chaque emission.
- `accessor` permet de deriver un sous-ensemble des donnees (selector).
- `deps` controle quand recalculer l'accessor; laissez vide si l'accesseur n'utilise pas d'autres valeurs React.

```tsx
const identity = useValue(userObservable); // recoit l'objet entier
const displayName = useValue(
	userObservable,
	(user) => `${user.firstName} ${user.lastName}`,
	[], // deps optionnelles si l'accessor reference d'autres valeurs
);
```

### `useLazy(observable, accessor?, deps?)`

- Meme API que `useValue`, mais les mises a jour sont schedulees via `startTransition` afin de laisser React prioriser les interactions urgentes.
- Utile lorsque les projections sont couteuses ou quand vous souhaitez eviter les re-render synchrones sous forte charge.

```tsx
const preview = useLazy(
	searchResults$,
	(results) => results.slice(0, 5),
	[],
);
```

### `useChange(observable, accessor, deps)`

- Execute `accessor` immediatement puis a chaque emission.
- Ideal pour relayer l'etat observable vers une reference mutable, un service ou une integration non React.

```tsx
const titleRef = useRef<HTMLTitleElement | null>(null);

useChange(
	documentTitle$,
	(value) => {
		const node = titleRef.current;
		if (node) {
			node.textContent = value;
		}
	},
	[titleRef],
);
```

### `useEntry(observableList, index, accessor?, deps?)` / `useEntry(observableMap, key, accessor?, deps?)`

- Projette un element cible depuis une `ObservableList` (par index) ou une `ObservableMap` (par cle).
- `accessor` optionnel pour deriver une valeur a partir de l'item (y compris quand il est `undefined`).
- Les resouscriptions sont automatiquement gerees quand `index`/`key` changent.

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
