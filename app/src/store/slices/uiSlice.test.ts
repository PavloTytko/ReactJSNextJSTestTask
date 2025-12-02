import reducer, { setSearchQuery, clearSearch } from "./uiSlice";

describe("uiSlice", () => {
  it("should return initial state by default", () => {
    const state = reducer(undefined, { type: "@@INIT" } as any);
    expect(state.searchQuery).toBe("");
  });

  it("should set search query", () => {
    const state = reducer(undefined, setSearchQuery("laptop"));
    expect(state.searchQuery).toBe("laptop");
  });

  it("should clear search query", () => {
    const state = reducer({ searchQuery: "abc" }, clearSearch());
    expect(state.searchQuery).toBe("");
  });
});
