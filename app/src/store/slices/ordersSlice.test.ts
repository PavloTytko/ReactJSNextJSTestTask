import reducer, { setOrders, addOrder } from "./ordersSlice";

const sample = (id: number) => ({ id, title: `Order ${id}`, date: new Date().toISOString(), products: [] as any[] });

describe("ordersSlice", () => {
  it("should return initial state by default", () => {
    const state = reducer(undefined, { type: "@@INIT" } as any);
    expect(state.items).toEqual([]);
    expect(state.loading).toBe(false);
  });

  it("setOrders replaces items", () => {
    const state = reducer(undefined, setOrders([sample(1), sample(2)]));
    expect(state.items).toHaveLength(2);
  });

  it("addOrder appends item", () => {
    const base = reducer(undefined, setOrders([sample(1)]));
    const next = reducer(base, addOrder(sample(3)));
    expect(next.items.map((o) => o.id)).toEqual([1, 3]);
  });

  it("handles deleteOrder.fulfilled extraReducer", () => {
    const base = reducer(undefined, setOrders([sample(1), sample(2)]));
    const next = reducer(base, { type: "orders/delete/fulfilled", payload: 1 });
    expect(next.items.map((o) => o.id)).toEqual([2]);
  });
});
