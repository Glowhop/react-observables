"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  useChange: () => useChange,
  useEntry: () => useEntry_default,
  useObservable: () => useObservable,
  useObservableList: () => useObservableList,
  useObservableMap: () => useObservableMap,
  useValue: () => useValue_default
});
module.exports = __toCommonJS(src_exports);

// src/useChange.ts
var import_react = require("react");
function useChange(observable, accessor, deps) {
  const onEffect = (value) => {
    accessor(value);
  };
  (0, import_react.useEffect)(() => {
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
var import_react2 = require("react");
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
  const [value, setValue] = (0, import_react2.useState)(readSnapshot);
  (0, import_react2.useEffect)(() => {
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
var import_observables = require("@glowhop/observables");
var import_react3 = require("react");
function useObservable(initialValue) {
  return (0, import_react3.useState)(() => new import_observables.Observable(initialValue))[0];
}

// src/useObservableList.ts
var import_observables2 = require("@glowhop/observables");
var import_react4 = require("react");
function useObservableList(initialValue) {
  return (0, import_react4.useState)(() => new import_observables2.ObservableList(initialValue))[0];
}

// src/useObservableMap.ts
var import_observables3 = require("@glowhop/observables");
var import_react5 = require("react");
function useObservableMap(initialValue) {
  return (0, import_react5.useState)(() => new import_observables3.ObservableMap(initialValue))[0];
}

// src/useValue.ts
var import_react6 = require("react");
var useValue = (observable, accessor, deps) => {
  const project = (newValue) => {
    return accessor ? accessor(newValue) : newValue;
  };
  const [value, setValue] = (0, import_react6.useState)(() => project(observable.get()));
  (0, import_react6.useEffect)(() => {
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  useChange,
  useEntry,
  useObservable,
  useObservableList,
  useObservableMap,
  useValue
});
//# sourceMappingURL=index.cjs.map