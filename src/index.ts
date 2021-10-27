import { bus } from "./bus";
import { searchService } from "./searchService";
import "./user-search";
console.clear();

function or(...predicates) {
  return (e: any) => {
    return predicates.find((pred) => pred(e));
  };
}
/////////////////////// UI /////////////
// These DOM refs are set at end of load
let query, spinner, values, completion;
const showQuery = ({ payload }) => {
  query.innerText = `Results for "${payload}"`;
};
// "Loading state" isnt actually state - it's the time between two events!
const spinnerOn = () => {
  //  spinner.innerText = "...";
  spinner.innerHTML = "<progress/>";
};
const spinnerOff = () => {
  spinner.innerText = "";
};
const appendValue = (o) => {
  values.value = values.value + JSON.stringify(o) + "\n";
};
const clearValues = () => {
  values.value = "";
};
const markEnd = (e) => {
  completion.innerText = searchService.error.match(e)
    ? `Error: ${e.payload}`
    : "Success";
};
const throwError = () => {
  throw new Error("SourceOfTruthUpdateFailed");
};

// bus.listen(searchService.requested.match, throwError);
bus.listen(searchService.requested.match, showQuery);

bus.listen(searchService.started.match, () => {
  spinnerOn();
  clearValues();
});
bus.listen(
  or(searchService.complete.match, searchService.error.match),
  spinnerOff
);
bus.listen(searchService.next.match, ({ payload }) => appendValue(payload));
bus.listen(
  or(searchService.complete.match, searchService.error.match),
  markEnd
);

document.getElementById("app").innerHTML = `
<h1>Observables, RTK-Style!</h1>
<p> <i>Behaviors: Force an error with the search term 'err'. Change from Promise (all-at-the-end) to streaming in the code. See specs for expected behavior.</i></p>
Search: <input id="searchInput" autocomplete="off" autosuggest="off"/>
<p>
<span title="In between 'started' and 'complete|error'">Loading:</span><span id="spinner"></spinner>
</p>
<label for="values"><span id="query">Results for: </span><br/>
<textarea id="values" style="height: 7rem">
</textarea>
</label>
<p>Completion Result:
<span id="completion"></spinner>
</p>
`;

query = document.getElementById("query");
spinner = document.getElementById("spinner");
values = document.getElementById("values");
completion = document.getElementById("completion");
