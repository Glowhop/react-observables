import "./setup";
import { describe, expect, it } from "bun:test";
import { act, renderHook, waitFor } from "@testing-library/react";
import { Observable } from "@glowhop/observables";
import useValue from "../useValue";

describe("useValue", () => {
	it("returns the current observable value and updates on change", async () => {
		const observable = new Observable(1);

		const { result } = renderHook(() => useValue(observable));

		expect(result.current).toBe(1);

		act(() => {
			observable.set(2);
		});

		await waitFor(() => {
			expect(result.current).toBe(2);
		});
	});

	it("derives values via accessor and respects dependency changes", async () => {
		const observable = new Observable({ count: 1 });

		const { result, rerender } = renderHook(
			({ multiplier }) =>
				useValue(
					observable,
					(value) => value.count * multiplier,
					[multiplier],
				),
			{ initialProps: { multiplier: 2 } },
		);

		await waitFor(() => {
			expect(result.current).toBe(2);
		});

		act(() => {
			observable.set({ count: 3 });
		});

		await waitFor(() => {
			expect(result.current).toBe(6);
		});

		rerender({ multiplier: 3 });

		await waitFor(() => {
			expect(result.current).toBe(9);
		});
	});
});
