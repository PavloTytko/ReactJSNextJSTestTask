import React from "react";
import { Order } from "@/store/slices/ordersSlice";
import styles from "./OrdersList.module.scss";
import { dateFull, dateRelative } from "@/utils/date";
import { useTranslation } from "next-i18next";

const OrdersList: React.FC<{
  orders: Order[];
  loading?: boolean;
  onSelect: (order: Order) => void;
  onDelete: (id: number) => void;
}> = ({ orders, loading, onSelect, onDelete }) => {
  const { t } = useTranslation("common");
  if (loading) return <div>{t("orders.loading")}</div>;
  return (
    <div className={styles.root}>
      <h3>{t("orders.title")}</h3>
      {orders.map((order) => (
        <div key={order.id} className={styles.item}>
          <div onClick={() => onSelect(order)} className={styles.clickable}>
            <div className={styles.itemTitle}>{order.title}</div>
            <div className={styles.itemMeta}>
              {dateFull(order.date)} •
              <span suppressHydrationWarning> {dateRelative(order.date)}</span>
            </div>
          </div>
          <div>
            <button
              className={styles.btnDelete}
              onClick={() => onDelete(order.id)}
              aria-label={t("orders.deleteAria", { title: order.title })}
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
