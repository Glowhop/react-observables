import type { Observable } from "@glowhop/observables";
import { useEffect } from "react";

export default function useChange<T, W>(
	observable: Observable<T>,
	accessor: (value: T) => W,
	deps: React.DependencyList,
) {
	// const onEffect = useEffectEvent((value: T) => {
	//   accessor(value);
	// });

	const onEffect = (value: T) => {
		accessor(value);
	};

	// biome-ignore lint/correctness/useExhaustiveDependencies: we want to control deps manually
	useEffect(() => {
		const sub = () => {
			onEffect(observable.get());
		};

		sub();

		const unsubscribe = observable.subscribe(sub);

		return () => {
			unsubscribe();
		};
	}, [observable, ...deps]);
}
