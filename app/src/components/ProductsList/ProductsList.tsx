import React from "react";
import { Product } from "../../store/slices/productsSlice";
import styles from "./ProductsList.module.scss";
import { useTranslation } from "react-i18next";

const ProductsList: React.FC<{ products: Product[] }> = ({ products }) => {
    const { t } = useTranslation("common");
    return (
        <div className={styles.root}>
            <table className={styles.table}>
                <thead>
                <tr>
                    <th>{t("products.table.photo")}</th>
                    <th>{t("products.table.title")}</th>
                    <th>{t("products.table.type")}</th>
                    <th>{t("products.table.serial")}</th>
                    <th>{t("products.table.guarantee")}</th>
                    <th>{t("products.table.price")}</th>
                    <th>{t("products.table.order")}</th>
                </tr>
                </thead>
                <tbody>
                {products.map(p => (
                    <tr key={p.id}>
                        <td>{p.photo ? <img src={p.photo} className={styles.thumb} alt={p.title}/> :
                            <img src="/images/placeholder.png" className={styles.thumb} alt={t("products.placeholderAlt")}/>}</td>
                        <td>{p.title}</td>
                        <td>{p.type}</td>
                        <td>{p.serialNumber}</td>
                        <td>{p.guarantee ? `${p.guarantee.start} → ${p.guarantee.end}` : t("common.na")}</td>
                        <td>{p.price?.map(pr => `${pr.value} ${pr.symbol}`).join(", ")}</td>
                        <td>{p.order ?? t("common.na")}</td>
                    </tr>
                ))}
                </tbody>
            </table>
            {/* Responsive cards for small screens */}
            <div className={styles.cards}>
                {products.map(p => (
                    <div key={`card-${p.id}`} className={styles.cardItem}>
                        {p.photo ? (
                            <img src={p.photo} className={styles.thumb} alt={p.title} />
                        ) : (
                            <img src="/images/placeholder.png" className={styles.thumb} alt={t("products.placeholderAlt")} />
                        )}
                        <div className={styles.cardBody}>
                            <div><strong>{p.title}</strong></div>
                            <div><span className={styles.label}>{t("products.table.type")}:</span> {p.type}</div>
                            <div><span className={styles.label}>{t("products.table.serial")}:</span> {p.serialNumber || t("common.na")}</div>
                            <div><span className={styles.label}>{t("products.table.guarantee")}:</span> {p.guarantee ? `${p.guarantee.start} → ${p.guarantee.end}` : t("common.na")}</div>
                            <div><span className={styles.label}>{t("products.table.price")}:</span> {p.price?.map(pr => `${pr.value} ${pr.symbol}`).join(", ")}</div>
                            <div><span className={styles.label}>{t("products.table.order")}:</span> {p.order ?? t("common.na")}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProductsList;
