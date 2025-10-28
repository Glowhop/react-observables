import { ObservableMap } from "@glowhop/observables";
import { useState } from "react";

export default function useObservableMap<K extends string | number | bigint, T>(initialValue: Map<K, T> | [K, T][]): ObservableMap<K, T> {
    return useState(() => new ObservableMap<K, T>(initialValue))[0];
}