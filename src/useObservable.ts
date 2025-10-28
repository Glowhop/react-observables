import { Observable } from "@glowhop/observables";
import { useState } from "react";

export default function useObservable<T>(initialValue: T): Observable<T> {
    return useState(() => new Observable(initialValue))[0];
}