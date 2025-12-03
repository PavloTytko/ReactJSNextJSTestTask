import reducer, { setProducts, addProduct, Product } from './productsSlice';

const p = (id: number, type = 'notebook'): Product => ({
  id,
  title: `P${id}`,
  type,
  price: [],
  isNew: 0,
});

describe('productsSlice', () => {
  it('returns initial state by default', () => {
    const state = reducer(undefined, { type: '@@INIT' } as any);
    expect(state.items).toEqual([]);
    expect(state.loading).toBe(false);
    expect(state.types).toEqual([]);
  });

  it('setProducts populates items and types unique', () => {
    const state = reducer(undefined, setProducts([p(1, 'pc'), p(2, 'pc'), p(3, 'server')]));
    expect(state.items).toHaveLength(3);
    expect(state.types.sort()).toEqual(['pc', 'server'].sort());
  });

  it('addProduct adds item and updates types if new', () => {
    const base = reducer(undefined, setProducts([p(1, 'pc')]));
    const next = reducer(base, addProduct(p(2, 'laptop')));
    expect(next.items).toHaveLength(2);
    expect(next.types.sort()).toEqual(['pc', 'laptop'].sort());
  });
});
