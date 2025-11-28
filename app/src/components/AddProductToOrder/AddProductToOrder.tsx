import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { fetchProducts } from "../../store/slices/productsSlice";
import { Order, addProductToOrder } from "../../store/slices/ordersSlice";

type Props = {
  order: Order;
};

const AddProductToOrder: React.FC<Props> = ({ order }) => {
  const dispatch = useDispatch();
  const { items: products, loading: productsLoading } = useSelector(
    (s: RootState) => s.products,
  );

  const [selectedProductId, setSelectedProductId] = useState<number | "">("");
  const [submitting, setSubmitting] = useState(false);

  // Ensure products list is present; fetch if empty
  useEffect(() => {
    if (!productsLoading && products.length === 0) {
      (dispatch as any)(fetchProducts());
    }
  }, [dispatch, products.length, productsLoading]);

  const availableProducts = useMemo(() => {
    if (!order) return [] as any[];
    // Allow repeats: show all products, even if already present in this order.
    return products;
  }, [products, order]);

  const onAdd = async () => {
    if (!order || !selectedProductId || submitting) return;
    setSubmitting(true);
    try {
      await (dispatch as any)(
        addProductToOrder({ orderId: order.id, productId: Number(selectedProductId) }),
      );
      setSelectedProductId("");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
      <select
        value={selectedProductId}
        onChange={(e) =>
          setSelectedProductId(e.target.value ? Number(e.target.value) : "")
        }
        disabled={submitting || productsLoading}
      >
        <option value="">
          {productsLoading ? "Loading products…" : "Select product…"}
        </option>
        {availableProducts.map((p: any) => (
          <option key={p.id} value={p.id}>
            {p.title} — {p.type}
          </option>
        ))}
      </select>
      <button onClick={onAdd} disabled={!selectedProductId || submitting}>
        {submitting ? "Adding…" : "Add to order"}
      </button>
    </div>
  );
};

export default AddProductToOrder;
