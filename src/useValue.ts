import type { Observable } from "@glowhop/observables";
import { useEffect, useState } from "react";

interface UseValue {
	<T>(observable: Observable<T>): T;
	<T, W = T>(
		observable: Observable<T>,
		accessor?: (value: T) => W,
		deps?: React.DependencyList,
	): W;
}

const useValue: UseValue = <T, W = T>(
	observable: Observable<T>,
	accessor?: (value: T) => W,
	deps?: React.DependencyList,
) => {
	// Accessors let callers derive a slice without forcing consumers to handle optional chaining everywhere.
	const project = (newValue: T) => {
		return accessor ? accessor(newValue) : (newValue as unknown as W);
	};

	const [value, setValue] = useState(() => project(observable.get()));

	// biome-ignore lint/correctness/useExhaustiveDependencies: accessor stability is delegated to deps
	useEffect(() => {
		const handleValue = (next: T) => {
			setValue(project(next));
		};

		// Replay the latest snapshot so the hook responds immediately even if no emission happens.
		handleValue(observable.get());
		const unsubscribe = observable.subscribe(handleValue);

		return () => {
			unsubscribe();
		};
	}, [observable, ...(deps ?? [])]);

	return value;
};

export default useValue;
