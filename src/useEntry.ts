import type { ObservableList, ObservableMap } from "@glowhop/observables";
import { type DependencyList, useEffect, useState } from "react";

const OBSERVABLE_MAP_TAG = "[object ObservableMap]";

function isObservableMap<K extends string | number | bigint, T>(
	observable: ObservableList<T> | ObservableMap<K, T>,
): observable is ObservableMap<K, T> {
	// ObservableList and ObservableMap share the same surface API; Symbol.toStringTag is the safest runtime discriminator.
	return Object.prototype.toString.call(observable) === OBSERVABLE_MAP_TAG;
}

interface UseEntry {
	<T>(observable: ObservableList<T>, index: number): T | undefined;
	<K extends string | number | bigint, T>(observable: ObservableMap<K, T>, key: K): T | undefined;
	<T, W = T | undefined>(
		observable: ObservableList<T>,
		index: number,
		accessor: (value: T | undefined) => W,
		deps?: DependencyList,
	): W;
	<K extends string | number | bigint, T, W = T | undefined>(
		observable: ObservableMap<K, T>,
		key: K,
		accessor: (value: T | undefined) => W,
		deps?: DependencyList,
	): W;
}

const useEntry: UseEntry = <T, K extends string | number | bigint = number, W = T | undefined>(
	observable: ObservableList<T> | ObservableMap<K, T>,
	index: K | number,
	accessor?: (value: T | undefined) => W,
	deps?: DependencyList,
) => {
	// Normalise the projected value so list and map branches share the same update logic.
	const project = (entry: T | undefined): W => {
		return accessor ? accessor(entry) : (entry as unknown as W);
	};

	const readSnapshot = () => {
		if (isObservableMap(observable)) {
			return project(observable.getEntry(index as K));
		}
		return project(observable.getEntry(index as number));
	};

	const [value, setValue] = useState<W>(readSnapshot);

	// Subscribe to either the indexed list entry or the keyed map entry and mirror updates into local state.
	// biome-ignore lint/correctness/useExhaustiveDependencies: accessor participation is managed via deps
	useEffect(() => {
		const handleEntry = (entry: T | undefined) => {
			setValue(project(entry));
		};

		if (isObservableMap(observable)) {
			const key = index as K;

			handleEntry(observable.getEntry(key));
			const unsubscribe = observable.subscribeEntry(key, handleEntry);

			return () => {
				unsubscribe();
			};
		}

		const idx = index as number;

		handleEntry(observable.getEntry(idx));
		const unsubscribe = observable.subscribeEntry(idx, handleEntry);

		return () => {
			unsubscribe();
		};
	}, [observable, index, ...(deps ?? [])]);

	return value;
};

export default useEntry;
