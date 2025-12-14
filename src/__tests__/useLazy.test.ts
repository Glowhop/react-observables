import "./setup";
import { describe, expect, it } from "bun:test";
import { act, renderHook, waitFor } from "@testing-library/react";
import { Observable } from "@glowhop/observables";
import useLazy from "../useLazy";

describe("useLazy", () => {
	it("returns the current observable value and updates lazily on change", async () => {
		const observable = new Observable(1);

		const { result } = renderHook(() => useLazy(observable));

		expect(result.current).toBe(1);

		act(() => {
			observable.set(3);
		});

		await waitFor(() => {
			expect(result.current).toBe(3);
		});
	});

	it("derives values via accessor and respects dependency changes", async () => {
		const observable = new Observable({ count: 2 });

		const { result, rerender } = renderHook(
			({ multiplier }) =>
				useLazy(
					observable,
					(value) => value.count * multiplier,
					[multiplier],
				),
			{ initialProps: { multiplier: 2 } },
		);

		await waitFor(() => {
			expect(result.current).toBe(4);
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
