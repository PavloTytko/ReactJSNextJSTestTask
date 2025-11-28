import { GetServerSideProps } from "next";
import React, { useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import ProductsList from "../../components/ProductsList/ProductsList";
import withAuth from "../../components/protectedRoute/withAuth";
import {
  fetchProducts,
  Product,
  setProducts,
} from "../../store/slices/productsSlice";

const ProductsPage: React.FC<{ initialProducts?: Product[] }> = ({
  initialProducts,
}) => {
  const dispatch = useDispatch();
  const { items, loading } = useSelector((s: RootState) => s.products);

  useEffect(() => {
    // hydrate from SSR then ensure fresh data on client
    dispatch(setProducts(initialProducts || []));
    dispatch(fetchProducts() as any);
  }, [dispatch, initialProducts]);

  return (
    <div style={{ width: "100%" }}>
      {loading && items.length === 0 ? (
        <div>Loading...</div>
      ) : (
        <ProductsList products={items} />
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
