import { ObservableList } from "@glowhop/observables";
import { useState } from "react";

export default function useObservableList<T>(initialValue: T[]): ObservableList<T> {
    return useState(() => new ObservableList(initialValue))[0];
}