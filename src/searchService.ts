import { after } from "polyrhythm";

import {
  createObservableService,
  fromPromisedArray
} from "./createObservableService";
import { bus } from "./bus";
import { concat, from } from "rxjs";

type Result = Record<string, string>;

export const searchService = createObservableService<
  string,
  Result,
  void,
  Error
>(bus)("search", (r) => {
  if (r.payload.startsWith("err")) {
    return new Promise((_, reject) =>
      setTimeout(() => reject("HTTP/501"), 2000)
    );
  }
  // The service can return data synchronously or asynchronously
  // - returning basically anything that an RxJS Observable can be made from.
  // An 'immediate' single-valued Promise
  // return Promise.resolve({ match: "a" });
  // return Promise.reject({ match: "a" });  // emits error(e)
  // A Promise, converted to an Observable
  return fromPromisedArray(
    new Promise((resolve) => setTimeout(resolve, 3000)).then(() => [
      { match: `${r.payload}aardvark` },
      { match: `${r.payload}abba` },
      { match: `${r.payload}apple` }
    ])
  );

  // A Multi-valued stream (RxJS Observable)
  // return concat(
  //   after(1000, { match: `${r.payload}aardvark` }),
  //   after(1000, { match: `${r.payload}abba` }),
  //   after(1000, { match: `${r.payload}apple` })
  // );

  // The remaining are // Multivalued, synchronous
  // return from([{ match: "aardvark" }, { match: "abba" }, { match: "apple" }]);
  // return [{ match: "aardavark" }, { match: "abba" }, { match: "apple" }];
  // return function* () {
  //   yield {match: "aardvark"}
  //   yield {match: "abba"}
  // };
});
