import { GetServerSideProps } from "next";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import ProductsList from "../../components/ProductsList/ProductsList";
import withAuth from "../../components/protectedRoute/withAuth";
import {
  fetchProducts,
  Product,
  setProducts,
  createProduct,
} from "../../store/slices/productsSlice";
import AddProductModal from "../../components/AddProductModal/AddProductModal";

const ProductsPage: React.FC<{ initialProducts?: Product[] }> = ({
  initialProducts,
}) => {
  const dispatch = useDispatch();
  const { items, loading } = useSelector((s: RootState) => s.products);
  const [showAdd, setShowAdd] = useState(false);

  useEffect(() => {
    // hydrate from SSR then ensure fresh data on client
    dispatch(setProducts(initialProducts || []));
    dispatch(fetchProducts() as any);
  }, [dispatch, initialProducts]);

  return (
    <div style={{ width: "100%" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "left",
          alignItems: "center",
          marginBottom: 12,
        }}
      >
        <button onClick={() => setShowAdd(true)}>+</button>
        <h3 style={{ margin: 0 }}>Products</h3>
      </div>
      {loading && items.length === 0 ? (
        <div>Loading...</div>
      ) : (
        <ProductsList products={items} />
      )}
      {showAdd && (
        <AddProductModal
          onClose={() => setShowAdd(false)}
          onSubmit={(p) => {
            dispatch(createProduct(p) as any).then(() => setShowAdd(false));
          }}
        />
      )}
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL || "http://api:4000"}/rest/products`,
    );
    return { props: { initialProducts: res.data } };
  } catch (e) {
    return { props: { initialProducts: [] } };
  }
};

export default withAuth(ProductsPage);
