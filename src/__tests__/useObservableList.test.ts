import "./setup";
import { describe, expect, it } from "bun:test";
import { act, renderHook } from "@testing-library/react";
import { ObservableList } from "@glowhop/observables";
import useObservableList from "../useObservableList";

describe("useObservableList", () => {
	it("exposes a stable ObservableList instance", () => {
		const { result, rerender } = renderHook(({ initial }) => useObservableList(initial), {
			initialProps: { initial: ["a", "b"] },
		});

		const firstInstance = result.current;

		expect(firstInstance).toBeInstanceOf(ObservableList);
		expect(firstInstance.get()).toEqual(["a", "b"]);

		rerender({ initial: ["c"] });

		expect(result.current).toBe(firstInstance);
		expect(result.current.get()).toEqual(["a", "b"]);
	});

	it("allows list operations on the same instance", () => {
		const { result } = renderHook(() => useObservableList<string>(["a"]));

		act(() => {
			result.current.addEntry("b");
			result.current.setEntry(0, "z");
		});

		expect(result.current.get()).toEqual(["z", "b"]);
	});
});
