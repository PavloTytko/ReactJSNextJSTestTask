import React from "react";
import { Order } from "../../store/slices/ordersSlice";
import styles from "./OrdersList.module.scss";
import { dateFull, dateRelative } from "../../utils/date";
import { useTranslation } from "react-i18next";

const OrdersList: React.FC<{
    orders: Order[];
    loading?: boolean;
    onSelect: (o: Order) => void;
    onDelete: (id: number) => void
}> = ({ orders, loading, onSelect, onDelete }) => {
    const { t } = useTranslation("common");
    if (loading) return <div>{t("orders.loading")}</div>;
    return (
        <div className={styles.root}>
            <h3>{t("orders.title")}</h3>
            {orders.map(o => (
                <div key={o.id} className={styles.item}>
                    <div onClick={() => onSelect(o)} className={styles.clickable}>
                        <div className={styles.itemTitle}>{o.title}</div>
                        <div className={styles.itemMeta}>{dateFull(o.date)} • {dateRelative(o.date)}</div>
                    </div>
                    <div>
                        <button
                            className={styles.btnDelete}
                            onClick={() => onDelete(o.id)}
                            aria-label={t("orders.deleteAria", { title: o.title })}
                        >
                            {t("common.delete")}
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default OrdersList;
