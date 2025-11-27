import {GetServerSideProps} from "next";
import React, {useEffect, useState} from "react";
import {fetchOrders, Order, removeOrder, setOrders} from "../../store/slices/ordersSlice";
import axios from "axios";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../store/store";
import OrdersList from "../../components/OrdersList/OrdersList";
import OrderSidebar from "../../components/OrderSidebar/OrderSidebar";
import DeleteModal from "../../components/DeleteModal/DeleteModal";
import withAuth from "../../components/protectedRoute/withAuth";

const OrdersPage: React.FC<{ initialOrders?: Order[] }> = ({initialOrders}) => {
    const dispatch = useDispatch();
    const {items, loading} = useSelector((s: RootState) => s.orders);
    const [selected, setSelected] = useState<Order | null>(null);
    const [showDelete, setShowDelete] = useState<number | null>(null);

    useEffect(() => {
        dispatch(setOrders(initialOrders || []));
        dispatch(fetchOrders() as any);
    }, [dispatch, initialOrders]);

    const confirmDelete = (id: number) => {
        // local deletion - ideally call API delete
        dispatch(removeOrder(id));
        setShowDelete(null);
        if (selected?.id === id) setSelected(null);
    };

    return (
        <div style={{display: "flex", gap: 12}}>
            <OrdersList orders={items} onSelect={(o) => setSelected(o)} onDelete={(id) => setShowDelete(id)}
                        loading={loading}/>
            <OrderSidebar order={selected} onClose={() => setSelected(null)}/>
            {showDelete &&
                <DeleteModal onClose={() => setShowDelete(null)} onConfirm={() => confirmDelete(showDelete)}/>}
        </div>
    );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || "http://api:4000"}/rest/orders`);
        return {props: {initialOrders: res.data}};
    } catch (e) {
        return {props: {initialOrders: []}};
    }
};

export default withAuth(OrdersPage);
