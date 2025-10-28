import "./setup";
import { describe, expect, it } from "bun:test";
import { renderHook } from "@testing-library/react";
import { Observable } from "@glowhop/observables";
import useObservable from "../useObservable";

describe("useObservable", () => {
	it("creates an Observable only once", () => {
		const { result, rerender } = renderHook(({ initial }) => useObservable(initial), {
			initialProps: { initial: 42 },
		});

		const firstInstance = result.current;

		expect(firstInstance).toBeInstanceOf(Observable);
		expect(firstInstance.get()).toBe(42);

		rerender({ initial: 99 });

		expect(result.current).toBe(firstInstance);
		expect(result.current.get()).toBe(42);
	});
});
