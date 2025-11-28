import React from "react";
import { Order } from "../../store/slices/ordersSlice";
import styles from "./OrderSidebar.module.scss";
import { AnimatePresence, motion } from "framer-motion";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import AddProductToOrder from "../AddProductToOrder/AddProductToOrder";

const OrderSidebar: React.FC<{ order: Order | null; onClose: () => void }> = ({
  order,
  onClose,
}) => {
  // Derive the fresh order from store to keep sidebar in sync after updates
  const currentOrder = useSelector((s: RootState) =>
    order ? s.orders.items.find((o) => o.id === order.id) || order : null,
  );

  return (
    <AnimatePresence>
      {currentOrder && (
                <motion.aside
                  className={styles.root}
                  initial={{ x: 300, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: 300, opacity: 0 }}
                >
          <div className={styles.header}>
            <h4>{currentOrder.title}</h4>
            <button onClick={onClose}>X</button>
          </div>
          <div>{currentOrder.description}</div>
          <div className={styles.products}>
            <h5>Products</h5>
            {currentOrder.products?.map((p: any, idx: number) => (
              <div key={`${p.id}-${idx}`} className={styles.productItem}>
                {p.title} — {p.type}
              </div>
            ))}
            {currentOrder && <AddProductToOrder order={currentOrder} />}
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
};

export default OrderSidebar;
