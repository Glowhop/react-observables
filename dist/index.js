// src/useChange.ts
import { useEffect } from "react";
function useChange(observable, accessor, deps) {
  const onEffect = (value) => {
    accessor(value);
  };
  useEffect(() => {
    const sub = () => {
      onEffect(observable.get());
    };
    sub();
    const unsubscribe = observable.subscribe(sub);
    return () => {
      unsubscribe();
    };
  }, [observable, ...deps]);
}

// src/useEntry.ts
import { useEffect as useEffect2, useState } from "react";
var OBSERVABLE_MAP_TAG = "[object ObservableMap]";
function isObservableMap(observable) {
  return Object.prototype.toString.call(observable) === OBSERVABLE_MAP_TAG;
}
var useEntry = (observable, index, accessor, deps) => {
  const project = (entry) => {
    return accessor ? accessor(entry) : entry;
  };
  const readSnapshot = () => {
    if (isObservableMap(observable)) {
      return project(observable.getEntry(index));
    }
    return project(observable.getEntry(index));
  };
  const [value, setValue] = useState(readSnapshot);
  useEffect2(() => {
    const handleEntry = (entry) => {
      setValue(project(entry));
    };
    if (isObservableMap(observable)) {
      const key = index;
      handleEntry(observable.getEntry(key));
      const unsubscribe2 = observable.subscribeEntry(key, handleEntry);
      return () => {
        unsubscribe2();
      };
    }
    const idx = index;
    handleEntry(observable.getEntry(idx));
    const unsubscribe = observable.subscribeEntry(idx, handleEntry);
    return () => {
      unsubscribe();
    };
  }, [observable, index, ...deps ?? []]);
  return value;
};
var useEntry_default = useEntry;

// src/useObservable.ts
import { Observable } from "@glowhop/observables";
import { useState as useState2 } from "react";
function useObservable(initialValue) {
  return useState2(() => new Observable(initialValue))[0];
}

// src/useObservableList.ts
import { ObservableList } from "@glowhop/observables";
import { useState as useState3 } from "react";
function useObservableList(initialValue) {
  return useState3(() => new ObservableList(initialValue))[0];
}

// src/useObservableMap.ts
import { ObservableMap } from "@glowhop/observables";
import { useState as useState4 } from "react";
function useObservableMap(initialValue) {
  return useState4(() => new ObservableMap(initialValue))[0];
}

// src/useValue.ts
import { useEffect as useEffect3, useState as useState5 } from "react";
var useValue = (observable, accessor, deps) => {
  const project = (newValue) => {
    return accessor ? accessor(newValue) : newValue;
  };
  const [value, setValue] = useState5(() => project(observable.get()));
  useEffect3(() => {
    const handleValue = (next) => {
      setValue(project(next));
    };
    handleValue(observable.get());
    const unsubscribe = observable.subscribe(handleValue);
    return () => {
      unsubscribe();
    };
  }, [observable, ...deps ?? []]);
  return value;
};
var useValue_default = useValue;

// src/useLazy.ts
import { startTransition, useEffect as useEffect4, useState as useState6 } from "react";
var useLazy = (observable, accessor, deps) => {
  const project = (newValue) => {
    return accessor ? accessor(newValue) : newValue;
  };
  const [value, setValue] = useState6(() => project(observable.get()));
  useEffect4(() => {
    const handleValue = (next) => {
      startTransition(() => {
        setValue(project(next));
      });
    };
    handleValue(observable.get());
    const unsubscribe = observable.subscribe(handleValue);
    return () => {
      unsubscribe();
    };
  }, [observable, ...deps ?? []]);
  return value;
};
var useLazy_default = useLazy;
export {
  useChange,
  useEntry_default as useEntry,
  useLazy_default as useLazy,
  useObservable,
  useObservableList,
  useObservableMap,
  useValue_default as useValue
};
//# sourceMappingURL=index.js.map