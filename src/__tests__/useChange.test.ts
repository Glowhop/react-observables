import "./setup";
import { describe, expect, it } from "bun:test";
import { act, renderHook, waitFor } from "@testing-library/react";
import { Observable } from "@glowhop/observables";
import useChange from "../useChange";

describe("useChange", () => {
	it("invokes the accessor immediately and on each change", async () => {
		const observable = new Observable(0);
		const calls: number[] = [];

		renderHook(() => useChange(observable, (value) => calls.push(value), []));

		await waitFor(() => {
			expect(calls).toEqual([0]);
		});

		act(() => {
			observable.set(1);
		});

		await waitFor(() => {
			expect(calls).toEqual([0, 1]);
		});
	});

	it("re-subscribes when dependencies change", async () => {
		const observable = new Observable(1);
		const records: Array<{ dep: number; value: number }> = [];

		const { rerender } = renderHook(
			({ dep }) =>
				useChange(
					observable,
					(value) => {
						records.push({ dep, value });
					},
					[dep],
				),
			{ initialProps: { dep: 1 } },
		);

		await waitFor(() => {
			expect(records).toEqual([{ dep: 1, value: 1 }]);
		});

		rerender({ dep: 2 });

		await waitFor(() => {
			expect(records[records.length - 1]).toEqual({ dep: 2, value: 1 });
		});

		act(() => {
			observable.set(3);
		});

		await waitFor(() => {
			expect(records[records.length - 1]).toEqual({ dep: 2, value: 3 });
		});
	});
});
