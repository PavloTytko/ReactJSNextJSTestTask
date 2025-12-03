import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/store/store";
import { fetchProducts, Product } from "@/store/slices/productsSlice";
import { Order, addProductToOrder } from "@/store/slices/ordersSlice";
import styles from "./AddProductToOrder.module.scss";

type Props = {
  order: Order;
};

const AddProductToOrder: React.FC<Props> = ({ order }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { items: products, loading: productsLoading } = useSelector(
    (s: RootState) => s.products,
  );

  const [selectedProductId, setSelectedProductId] = useState<number | "">("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!productsLoading && products.length === 0) {
      dispatch(fetchProducts());
    }
  }, [dispatch, products.length, productsLoading]);

  const availableProducts = useMemo(() => products, [products]);

  const onAdd = async () => {
    if (!order || !selectedProductId || submitting) return;
    setSubmitting(true);
    try {
      await dispatch(
        addProductToOrder({
          orderId: order.id,
          productId: Number(selectedProductId),
        }),
      );
      setSelectedProductId("");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.row}>
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
        {availableProducts.map((p: Product) => (
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
