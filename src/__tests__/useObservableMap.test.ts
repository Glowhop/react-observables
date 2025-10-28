import "./setup";
import { describe, expect, it } from "bun:test";
import { act, renderHook } from "@testing-library/react";
import { ObservableMap } from "@glowhop/observables";
import useObservableMap from "../useObservableMap";

describe("useObservableMap", () => {
	it("returns a stable ObservableMap instance", () => {
		const initialEntries: [string, number][] = [
			["a", 1],
			["b", 2],
		];

		const { result, rerender } = renderHook(({ entries }) => useObservableMap(entries), {
			initialProps: { entries: initialEntries },
		});

		const firstInstance = result.current;

		expect(firstInstance).toBeInstanceOf(ObservableMap);
		expect(Array.from(firstInstance.get().entries())).toEqual(initialEntries);

		rerender({ entries: [["c", 3]] });

		expect(result.current).toBe(firstInstance);
		expect(Array.from(result.current.get().entries())).toEqual(initialEntries);
	});

	it("allows map mutations on the same instance", () => {
		const { result } = renderHook(() =>
			useObservableMap<string, number>([
				["a", 1],
				["b", 2],
			]),
		);

		act(() => {
			result.current.setEntry("c", 3);
			result.current.setEntry("a", 10);
			result.current.removeEntry("b");
		});

		expect(Array.from(result.current.get().entries())).toEqual([
			["a", 10],
			["c", 3],
		]);
	});
});
