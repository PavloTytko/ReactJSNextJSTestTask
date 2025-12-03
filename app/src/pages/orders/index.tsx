import { GetServerSideProps } from "next";
import React, { useEffect, useState } from "react";
import {
  fetchOrders,
  Order,
  setOrders,
  createOrder,
  deleteOrder,
} from "@/store/slices/ordersSlice";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/store/store";
import OrdersList from "@/components/OrdersList/OrdersList";
import OrderSidebar from "@/components/OrderSidebar/OrderSidebar";
import DeleteModal from "@/components/DeleteModal/DeleteModal";
import withAuth from "@/components/protectedRoute/withAuth";
import AddOrderModal from "@/components/AddOrderModal/AddOrderModal";
import { fetchProducts } from "@/store/slices/productsSlice";
import { getApiBaseUrl } from "@/utils/api";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import { AnimatePresence, motion } from "framer-motion";
import styles from "./OrdersPage.module.scss";

const OrdersPage: React.FC<{ initialOrders?: Order[] }> = ({
  initialOrders,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { items, loading } = useSelector((s: RootState) => s.orders);
  const search = useSelector((s: RootState) => s.ui.searchQuery);
  const [selected, setSelected] = useState<Order | null>(null);
  const [showDelete, setShowDelete] = useState<number | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const { t } = useTranslation("common");

  useEffect(() => {
    dispatch(setOrders(initialOrders || []));
    dispatch(fetchOrders());
    dispatch(fetchProducts());
  }, [dispatch, initialOrders]);

  const confirmDelete = (id: number) => {
    dispatch(deleteOrder(id)).then(() => {
      setShowDelete(null);
      if (selected?.id === id) setSelected(null);
    });
  };

  useEffect(() => {
    dispatch(fetchOrders(search ? { q: search } : undefined));
  }, [dispatch, search]);

  return (
    <div className={styles.container}>
      <div className={styles.toolbar}>
        <div
          className={styles.addButton}
          onClick={() => setShowAdd(true)}
          aria-label={t("orders.addAria")}
        >
          <span>+</span>
        </div>
      </div>
      <motion.div
        className={styles.content}
        animate={{ gap: selected ? 0 : 12 }}
        transition={{ type: "spring", stiffness: 260, damping: 26 }}
      >
        <motion.div
          className={styles.listWrap}
          animate={{ width: selected ? "50%" : "100%" }}
          transition={{ type: "spring", stiffness: 260, damping: 26 }}
        >
          <OrdersList
            orders={items}
            onSelect={(o) => setSelected(o)}
            onDelete={(id) => setShowDelete(id)}
            loading={loading}
          />
        </motion.div>
        <OrderSidebar order={selected} onClose={() => setSelected(null)} />
        <AnimatePresence>
          {showDelete && (
            <DeleteModal
              key="deleteModal"
              onClose={() => setShowDelete(null)}
              onConfirm={() => confirmDelete(showDelete)}
            />
          )}
        </AnimatePresence>
        {showAdd && (
          <AddOrderModal
            onClose={() => setShowAdd(false)}
            onSubmit={(o) => {
              dispatch(createOrder(o)).then(() => setShowAdd(false));
            }}
          />
        )}
      </motion.div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  try {
    const baseUrl = getApiBaseUrl();
    const res = await axios.get(`${baseUrl}/rest/orders`);
    return {
      props: {
        ...(await serverSideTranslations(ctx.locale ?? "en", ["common"])),
        initialOrders: res.data,
      },
    };
  } catch (e) {
    return {
      props: {
        ...(await serverSideTranslations(ctx.locale ?? "en", ["common"])),
        initialOrders: [],
      },
    };
  }
};

export default withAuth(OrdersPage);
