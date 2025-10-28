import "./setup";
import { describe, expect, it } from "bun:test";
import { act, renderHook, waitFor } from "@testing-library/react";
import { ObservableList, ObservableMap } from "@glowhop/observables";
import useEntry from "../useEntry";

describe("useEntry", () => {
	it("subscribes to a list index and reacts to updates", async () => {
		const list = new ObservableList(["a", "b"]);

		const { result } = renderHook(() => useEntry(list, 1));

		expect(result.current).toBe("b");

		act(() => {
			list.setEntry(1, "c");
		});

		await waitFor(() => {
			expect(result.current).toBe("c");
		});
	});

	it("re-subscribes when the requested index changes", async () => {
		const list = new ObservableList(["a", "b", "c"]);

		const { result, rerender } = renderHook(({ index }) => useEntry(list, index), {
			initialProps: { index: 0 },
		});

		expect(result.current).toBe("a");

		rerender({ index: 2 });

		await waitFor(() => {
			expect(result.current).toBe("c");
		});

		act(() => {
			list.setEntry(2, "z");
		});

		await waitFor(() => {
			expect(result.current).toBe("z");
		});
	});

	it("supports observable maps with accessors", async () => {
		const map = new ObservableMap([["count", { value: 1 }]]);

		const { result } = renderHook(() =>
			useEntry(map, "count", (entry) => entry?.value ?? 0),
		);

		expect(result.current).toBe(1);

		act(() => {
			map.setEntry("count", { value: 3 });
		});

		await waitFor(() => {
			expect(result.current).toBe(3);
		});

		act(() => {
			map.removeEntry("count");
		});

		await waitFor(() => {
			expect(result.current).toBe(0);
		});
	});
});
