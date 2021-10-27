import { Omnibus } from "omnibus-rxjs";
import { from, ObservableInput } from "rxjs";
import { mergeAll, takeUntil } from "rxjs/operators";
import { Action, actionCreatorFactory } from "typescript-fsa";

/*
  Given a bus, a listen mode, a prefix namespace, and a possibly async handler,
  sets up a listener on the bus in the specified mode that will
  run the handler on any call, and trigger lifecycle events back
  to the bus in the specified listening mode.

  Akin to createAsyncThunk with the following differences:
    - Data is carried on next() events, not the complete() event, for 1-many data events
    - prefix/requested - the action which triggers the handler
    - prefix/started - the handler has begun (may be delayed in queueing mode)
    - prefix/next - the handler has emitted a data item (contains the data)
    - prefix/canceled - the handler was terminated early
    - prefix/complete - the handler is done (NOTE: carries no data!)
    - prefix/error - the handler errored (contains the error)
*/
export function createObservableService<TRequest, TNext, TError, TBusItem>(
  bus: Omnibus<Action<any>>,
  listenMode:
    | "listen"
    | "listenQueueing"
    | "listenSwitching"
    | "listenBlocking" = "listen"
) {
  return function (
    typePrefix: string,
    handler: (r: TRequest) => ObservableInput<TNext>
  ) {
    const lifecycle = actionCreatorFactory(typePrefix);
    const _requested = lifecycle<TRequest>("requested");
    const _cancelCurrent = lifecycle<void>("cancel");
    const started = lifecycle("started");
    const next = lifecycle<TNext>("next");
    const error = lifecycle<TError>("error");
    const complete = lifecycle<any>("complete");
    const canceled = lifecycle<TError>("canceled");

    // The main return value - creates and triggers an action to the bus
    const requested = (req: TRequest) => {
      const action = _requested(req);
      bus.trigger(action);
    };

    // @ts-ignore
    const listener = bus[listenMode](
      _requested.match,
      // handler,
      () => from(handler()).pipe(takeUntil(bus.query(_cancelCurrent.match))),
      bus.observeWith({
        next,
        error,
        complete,
        subscribe: started,
        unsubscribe: canceled
      })
    );
    return Object.assign(requested, {
      requested: _requested,
      cancelCurrent: () => bus.trigger(_cancelCurrent()),
      started,
      next,
      error,
      complete,
      canceled,
      stop: () => listener.unsubscribe()
    });
  };
}

// Flattens a Promise for an array to an Observable of its
// individual items (returned all at the end, and non-cancelable)
export function fromPromisedArray<T>(pa: Promise<Array<T>>) {
  return from(pa).pipe(mergeAll());
}
