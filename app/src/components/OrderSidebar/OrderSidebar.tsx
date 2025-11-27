import React from "react";
import {Order} from "../../store/slices/ordersSlice";
import styles from "./OrderSidebar.module.scss";
import {AnimatePresence, motion} from "framer-motion";

const OrderSidebar: React.FC<{ order: Order | null; onClose: () => void }> = ({order, onClose}) => {
    return (
        <AnimatePresence>
            {order && (
                <motion.aside className={styles.root}
                              initial={{x: 300, opacity: 0}}
                              animate={{x: 0, opacity: 1}}
                              exit={{x: 300, opacity: 0}}>
                    <div className={styles.header}>
                        <h4>{order.title}</h4>
                        <button onClick={onClose}>X</button>
                    </div>
                    <div>{order.description}</div>
                    <div className={styles.products}>
                        <h5>Products</h5>
                        {order.products?.map((p: any) => (
                            <div key={p.id} className={styles.productItem}>
                                {p.title} — {p.type}
                            </div>
                        ))}
                    </div>
                </motion.aside>
            )}
        </AnimatePresence>
    );
};

export default OrderSidebar;
