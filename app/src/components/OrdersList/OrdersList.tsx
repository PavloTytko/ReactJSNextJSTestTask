import React from "react";
import {Order} from "../../store/slices/ordersSlice";
import styles from "./OrdersList.module.scss";
import {dateFull, dateRelative} from "../../utils/date";

const OrdersList: React.FC<{
    orders: Order[];
    loading?: boolean;
    onSelect: (o: Order) => void;
    onDelete: (id: number) => void
}> = ({orders, loading, onSelect, onDelete}) => {
    if (loading) return <div>Loading orders...</div>;
    return (
        <div className={styles.root}>
            <h3>Orders</h3>
            {orders.map(o => (
                <div key={o.id} className={styles.item}>
                    <div onClick={() => onSelect(o)} style={{cursor: "pointer"}}>
                        <div className={styles.itemTitle}>{o.title}</div>
                        <div className={styles.itemMeta}>{dateFull(o.date)} • {dateRelative(o.date)}</div>
                    </div>
                    <div>
                        <button className={styles.btnDelete} onClick={() => onDelete(o.id)}>Delete</button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default OrdersList;
