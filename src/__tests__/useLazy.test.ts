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

	it("coalesces synchronous emissions and projects only the latest value", async () => {
		const observable = new Observable(0);
		const projected: number[] = [];

		const { result } = renderHook(() =>
			useLazy(observable, (value) => {
				projected.push(value);
				return value;
			}),
		);

		await waitFor(() => {
			expect(result.current).toBe(0);
		});
		projected.length = 0;

		act(() => {
			observable.set(1);
			observable.set(2);
			observable.set(3);
		});

		await waitFor(() => {
			expect(result.current).toBe(3);
		});
		expect(projected).toEqual([3]);
	});
});
