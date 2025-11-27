import React from "react";
import {Product} from "../../store/slices/productsSlice";
import styles from "./ProductsList.module.scss";

const ProductsList: React.FC<{ products: Product[] }> = ({products}) => {
    return (
        <div className={styles.root}>
            <table className={styles.table}>
                <thead>
                <tr>
                    <th>Photo</th>
                    <th>Title</th>
                    <th>Type</th>
                    <th>Serial</th>
                    <th>Guarantee</th>
                    <th>Price</th>
                    <th>Order</th>
                </tr>
                </thead>
                <tbody>
                {products.map(p => (
                    <tr key={p.id}>
                        <td>{p.photo ? <img src={p.photo} className={styles.thumb} alt={p.title}/> :
                            <img src="/images/placeholder.png" className={styles.thumb} alt="placeholder"/>}</td>
                        <td>{p.title}</td>
                        <td>{p.type}</td>
                        <td>{p.serialNumber}</td>
                        <td>{p.guarantee ? `${p.guarantee.start} → ${p.guarantee.end}` : '-'}</td>
                        <td>{p.price?.map(pr => `${pr.value} ${pr.symbol}`).join(", ")}</td>
                        <td>{p.order ?? '-'}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default ProductsList;
