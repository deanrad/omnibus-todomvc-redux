import { Action } from "typescript-fsa";
import { Omnibus } from "omnibus-rxjs";

export const bus = new Omnibus<Action<any>>();
bus.spy((e) => console.log(e));
