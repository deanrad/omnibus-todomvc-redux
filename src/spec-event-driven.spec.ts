const PASS = () => {};

describe("Search UI", () => {
  describe('User Event: types "e"', () => {
    it("sets the results label");
    it("sets the loading");
    it("clears the results");
    it("returns 3 results");
    it("unsets the loading");
    it("sets the completion status to success");
  });
  describe("ASAP mode - Race condition!", () => {
    describe("User types e", () => {
      it("sets the results label e");
      it("sets the loading");
      it("clears the results");
      describe("User types r", () => {
        it("sets the loading");
        it("clears the results");
        it("shows results for 'e' - TODO BUG!");
        it("shows completion success - TODO BUG!");
      });
    });
  });

  describe("Switching mode", () => {
    describe("Promise Style", () => {
      describe("User types e", () => {
        it("sets the results label e");
        it("sets the loading");
        it("clears the results");
        describe("User types r", () => {
          it("sets the results label er");
          it("shows results for 'er'");
          it("(does not show results for 'e')");
          it("shows completion success");
        });
      });
    });
    describe("Observable/Streaming Style", () => {
      describe("User types e", () => {
        it("sets the results label e");
        it("sets the loading");
        it("clears the results");
        it("loads one result for 'e'");
        describe("User types r", () => {
          it("sets the results label er");
          it("clears the results (no more results for 'e'!)");
          it("does not show future results for 'e'");
          it("shows results for 'er'");
          it("shows completion success");
        });
      });
    });
  });
});
