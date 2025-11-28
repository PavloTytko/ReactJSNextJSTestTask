import { GetServerSideProps } from "next";
import React, { useEffect, useState } from "react";
import {
  fetchOrders,
  Order,
  setOrders,
  createOrder,
  deleteOrder,
} from "../../store/slices/ordersSlice";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import OrdersList from "../../components/OrdersList/OrdersList";
import OrderSidebar from "../../components/OrderSidebar/OrderSidebar";
import DeleteModal from "../../components/DeleteModal/DeleteModal";
import withAuth from "../../components/protectedRoute/withAuth";
import AddOrderModal from "../../components/AddOrderModal/AddOrderModal";
import { fetchProducts } from "../../store/slices/productsSlice";

const OrdersPage: React.FC<{ initialOrders?: Order[] }> = ({
  initialOrders,
}) => {
  const dispatch = useDispatch();
  const { items, loading } = useSelector((s: RootState) => s.orders);
  const [selected, setSelected] = useState<Order | null>(null);
  const [showDelete, setShowDelete] = useState<number | null>(null);
  const [showAdd, setShowAdd] = useState(false);

  useEffect(() => {
    dispatch(setOrders(initialOrders || []));
    dispatch(fetchOrders() as any);
    dispatch(fetchProducts() as any);
  }, [dispatch, initialOrders]);

  const confirmDelete = (id: number) => {
    // call API delete
    dispatch(deleteOrder(id) as any).then(() => {
      setShowDelete(null);
      if (selected?.id === id) setSelected(null);
    });
  };

  return (
    <div style={{ display: "flex", gap: 12, flexDirection: "column" }}>
      <div
        style={{
          display: "flex",
          marginBottom: 12,
        }}
      >
        <button onClick={() => setShowAdd(true)}>Add Order</button>
      </div>
      <div
        className=""
        style={{
          display: "flex",
          marginBottom: 12,
        }}
      >
        <div style={{ flex: 1 }}>
          <OrdersList
            orders={items}
            onSelect={(o) => setSelected(o)}
            onDelete={(id) => setShowDelete(id)}
            loading={loading}
          />
        </div>
        <OrderSidebar order={selected} onClose={() => setSelected(null)} />
        {showDelete && (
          <DeleteModal
            onClose={() => setShowDelete(null)}
            onConfirm={() => confirmDelete(showDelete)}
          />
        )}
        {showAdd && (
          <AddOrderModal
            onClose={() => setShowAdd(false)}
            onSubmit={(o) => {
              dispatch(createOrder(o) as any).then(() => setShowAdd(false));
            }}
          />
        )}
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  try {
    // Prefer explicit server API URL; fall back to browser URL; finally localhost (useful when not running Docker)
    const baseUrl =
      process.env.NEXT_PUBLIC_API_URL ||
      process.env.NEXT_PUBLIC_API_URL_BROWSER ||
      "http://localhost:4000";
    const res = await axios.get(`${baseUrl}/rest/orders`);
    return { props: { initialOrders: res.data } };
  } catch (e) {
    return { props: { initialOrders: [] } };
  }
};

export default withAuth(OrdersPage);
