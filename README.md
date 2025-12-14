# @glowhop/react-observables

Lightweight React adapters for the `Observable` primitives provided by `@glowhop/observables`. Wire your reactive pipelines into React without duplicating business logic.

## Features

- Concise hooks to project `Observable`, `ObservableList`, and `ObservableMap` data into components.
- Memoizable selection through an `accessor` and an explicit dependency list.
- Lazy concurrent variant (`useLazy`) that mirrors emissions inside `startTransition`.
- Complete TypeScript typings with ESM and CommonJS builds under `dist/`.
- Zero extra runtime: hooks operate on the `@glowhop/observables` instances you already own.

## Installation

Ensure `@glowhop/observables` and `react` are already installed (peer dependencies).

```bash
npm install @glowhop/react-observables
# or
yarn add @glowhop/react-observables
# or
pnpm add @glowhop/react-observables
# or
bun add @glowhop/react-observables
```

## Getting started

```tsx
import { Observable } from "@glowhop/observables";
import { useValue } from "@glowhop/react-observables";

const counter = new Observable(0);

export function CounterButton() {
	const clicks = useValue(counter);

	return (
		<button onClick={() => counter.set((prev) => prev + 1)}>
			Clicks: {clicks}
		</button>
	);
}
```

Hooks never create or manage observable instances; declare them in services, stores, or contexts and keep the reference stable (memoized, context value, singleton, etc.). React will resubscribe automatically.

## Available hooks

### `useValue(observable, accessor?, deps?)`

- Returns the current snapshot exposed by the `Observable` and updates synchronously on new emissions.
- `accessor` lets you derive a slice of the data (selector).
- `deps` controls when the accessor is recomputed if it captures other React values.

```tsx
const identity = useValue(user$); // entire object
const displayName = useValue(
	user$,
	(user) => `${user.firstName} ${user.lastName}`,
	[], // optional deps if the accessor references other values
);
```

### `useLazy(observable, accessor?, deps?)`

- Same signature as `useValue`, but updates are scheduled through `startTransition` so React can prioritize urgent interactions.
- Handy when projections are expensive or you want to avoid synchronous re-render spikes.

```tsx
const preview = useLazy(
	searchResults$,
	(results) => results.slice(0, 5),
	[],
);
```

### `useChange(observable, accessor, deps)`

- Executes `accessor` immediately and on every emission.
- Perfect for mirroring observable state into refs, services, or other non-React integrations.

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

- Projects a single entry from an `ObservableList` (by index) or an `ObservableMap` (by key).
- Optional `accessor` lets you derive a value from the entry, even when it is `undefined`.
- Automatically resubscribes when `index`/`key` changes.

```tsx
const secondTodo = useEntry(todos$, 1);
const theme = useEntry(settings$, "theme", (entry) => entry ?? "light");
```

## Architecture tips

- Stabilize observables with `useMemo`, contexts, or singletons to avoid needless resubscriptions.
- Compose observables in your domain layer, then expose only the streams components require.
- Lean on TypeScript generics provided by the package for end-to-end type safety.

## Development scripts

```bash
bun install       # install dependencies
bun test          # run the test suite
bun run build     # emit ESM/CJS bundles and .d.ts types
```

Releases are automated through `semantic-release` (see `package.json`'s `bun run release` script).

## License

Distributed under the ISC license.
