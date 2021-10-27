import { after } from "polyrhythm";
import { searchService } from "./searchService";

let searchInput;

///////////////////////////////////////
after(1000, () => {
  searchInput = document.getElementById("searchInput");
  // demo a search
  // const fetchAction = searchService("a");
  // console.log(fetchAction);
  // or do it live
  // Now declaratively map events on the input to searchService firings
  searchInput?.addEventListener("keyup", ({ target: { value } }) => {
    // Note this doesnt just create the action, it triggers it
    searchService(value);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      searchService.cancelCurrent();
    }
  });
}).subscribe();
