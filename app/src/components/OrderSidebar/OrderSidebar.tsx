import React from 'react';
import { Order } from '@/store/slices/ordersSlice';
import styles from './OrderSidebar.module.scss';
import { AnimatePresence, motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/store/store';
import AddProductToOrder from '../AddProductToOrder/AddProductToOrder';
import { removeProductFromOrder } from '@/store/slices/ordersSlice';
import { useTranslation } from 'next-i18next';
import type { Product } from '@/store/slices/productsSlice';

const OrderSidebar: React.FC<{ order: Order | null; onClose: () => void }> = ({
  order,
  onClose,
}) => {
  const currentOrder = useSelector((s: RootState) =>
    order ? s.orders.items.find((o) => o.id === order.id) || order : null,
  );

  const dispatch = useDispatch<AppDispatch>();
  const { t } = useTranslation('common');

  const onDeleteProduct = (productId: number) => {
    if (!currentOrder) return;
    dispatch(removeProductFromOrder({ orderId: currentOrder.id, productId }));
  };

  return (
    <AnimatePresence>
      {currentOrder && (
        <>
          <motion.div
            className={styles.backdrop}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            aria-hidden
          />
          <motion.aside
            className={styles.root}
            initial={{ x: 320, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 320, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 26 }}
            role="complementary"
            aria-label={t('orders.sidebarAria', { title: currentOrder.title })}
          >
            <div className={styles.header}>
              <h4>{currentOrder.title}</h4>
              <button onClick={onClose} aria-label={t('orders.close')}>
                ×
              </button>
            </div>
            <div>{currentOrder.description}</div>
            <div className={styles.products}>
              <h5>{t('orders.products')}</h5>
              {currentOrder.products?.map((p: Product) => (
                <div key={p.id} className={styles.productItem}>
                  <span>
                    {p.title} — {p.type}
                  </span>
                  <button
                    onClick={() => onDeleteProduct(Number(p.id))}
                    aria-label={t('orders.removeFromOrderAria', {
                      title: p.title,
                    })}
                    className={styles.ml8}
                  >
                    {t('orders.remove')}
                  </button>
                </div>
              ))}
              {currentOrder && <AddProductToOrder order={currentOrder} />}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};

export default OrderSidebar;
