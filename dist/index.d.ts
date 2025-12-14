import { Observable, ObservableList, ObservableMap } from '@glowhop/observables';
import { DependencyList } from 'react';

declare function useChange<T, W>(observable: Observable<T>, accessor: (value: T) => W, deps: React.DependencyList): void;

interface UseEntry {
    <T>(observable: ObservableList<T>, index: number): T | undefined;
    <K extends string | number | bigint, T>(observable: ObservableMap<K, T>, key: K): T | undefined;
    <T, W = T | undefined>(observable: ObservableList<T>, index: number, accessor: (value: T | undefined) => W, deps?: DependencyList): W;
    <K extends string | number | bigint, T, W = T | undefined>(observable: ObservableMap<K, T>, key: K, accessor: (value: T | undefined) => W, deps?: DependencyList): W;
}
declare const useEntry: UseEntry;

declare function useObservable<T>(initialValue: T): Observable<T>;

declare function useObservableList<T>(initialValue: T[]): ObservableList<T>;

declare function useObservableMap<K extends string | number | bigint, T>(initialValue: Map<K, T> | [K, T][]): ObservableMap<K, T>;

interface UseValue {
    <T>(observable: Observable<T>): T;
    <T, W = T>(observable: Observable<T>, accessor?: (value: T) => W, deps?: React.DependencyList): W;
}
declare const useValue: UseValue;

interface UseLazy {
    <T>(observable: Observable<T>): T;
    <T, W = T>(observable: Observable<T>, accessor?: (value: T) => W, deps?: React.DependencyList): W;
}
declare const useLazy: UseLazy;

export { useChange, useEntry, useLazy, useObservable, useObservableList, useObservableMap, useValue };
