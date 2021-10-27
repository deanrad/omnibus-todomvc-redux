const PASS = () => {};

// A UI-Centric Specification phrased in terms of events sent or responded to.
describe("Search UI", () => {
  describe("Search Input Box", () => {
    it("triggers a searchService.requested when typed", PASS);
  });

  describe("Result Label", () => {
    describe("When searchService.requested", () => {
      it("updates label with the search text", PASS);
    });
  });

  describe("Loading", () => {
    describe("When searchService.started", () => {
      it("shows a progress bar", PASS);
    });
    describe("When searchService.complete or error", () => {
      it("does not show a progress bar", PASS);
    });
  });

  describe("Results", () => {
    it("gets a new row for each searchService.next", PASS);
    it("clears when searchService.started", PASS);
  });

  describe("Completion", () => {
    describe("When searchService.complete", () => {
      it("shows complete", PASS);
    });
    describe("When searchService.error", () => {
      it("shows error", PASS);
    });
    describe("When searchService.started", () => {
      it("shows error", PASS);
    });
  });
});
