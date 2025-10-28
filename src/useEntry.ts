import type { ObservableList, ObservableMap } from "@glowhop/observables";
import { type DependencyList, useEffect, useState } from "react";

const OBSERVABLE_MAP_TAG = "[object ObservableMap]";

function isObservableMap<K extends string | number | bigint, T>(
	observable: ObservableList<T> | ObservableMap<K, T>,
): observable is ObservableMap<K, T> {
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
	const resolveValue = (entry: T | undefined): W => {
		return accessor ? accessor(entry) : (entry as unknown as W);
	};

	const readEntry = () => {
		if (isObservableMap(observable)) {
			return resolveValue(observable.getEntry(index as K));
		}
		return resolveValue(observable.getEntry(index as number));
	};

	const [value, setValue] = useState<W>(readEntry);

	// biome-ignore lint/correctness/useExhaustiveDependencies: accessor is controlled via deps
	useEffect(() => {
		const handler = (entry: T | undefined) => {
			setValue(resolveValue(entry));
		};

		if (isObservableMap(observable)) {
			const key = index as K;

			handler(observable.getEntry(key));

			const unsubscribe = observable.subscribeEntry(key, handler);

			return () => {
				unsubscribe();
			};
		}

		const idx = index as number;

		handler(observable.getEntry(idx));

		const unsubscribe = observable.subscribeEntry(idx, handler);

		return () => {
			unsubscribe();
		};
	}, [observable, index, ...(deps ?? [])]);

	return value;
};

export default useEntry;
