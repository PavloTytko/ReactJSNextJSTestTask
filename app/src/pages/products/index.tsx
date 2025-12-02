import { GetServerSideProps } from "next";
import React, { useEffect, useMemo, useState } from "react";
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
import { getApiBaseUrl } from "../../utils/api";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "react-i18next";
import styles from "./ProductsPage.module.scss";

const ProductsPage: React.FC<{ initialProducts?: Product[] }> = ({
  initialProducts,
}) => {
  const dispatch = useDispatch();
  const { items, loading, types } = useSelector((s: RootState) => s.products);
  const search = useSelector((s: RootState) => s.ui.searchQuery);
  const [showAdd, setShowAdd] = useState(false);
  const { t } = useTranslation("common");
  const [typeFilter, setTypeFilter] = useState<string>("");

  useEffect(() => {
    // hydrate from SSR then ensure fresh data on client
    dispatch(setProducts(initialProducts || []));
    dispatch(fetchProducts() as any);
  }, [dispatch, initialProducts]);

  // Re-fetch products from the API whenever search changes (server-side filtering)
  useEffect(() => {
    (dispatch as any)(fetchProducts(search ? { q: search } : undefined));
  }, [dispatch, search]);

  const filteredItems = useMemo(() => {
    if (!typeFilter) return items;
    return items.filter((p) => p.type === typeFilter);
  }, [items, typeFilter]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.leftGroup}>
          <button onClick={() => setShowAdd(true)} aria-label={t("products.addAria")} title={t("products.add")}>
            +
          </button>
          <h3 className={styles.title}>{t("products.title")}</h3>
        </div>
        <div>
          <label htmlFor="typeFilter" className={styles.filterLabel}>
            {t("products.filterType")}:
          </label>
          <select
            id="typeFilter"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            aria-label={t("products.filterType")}
          >
            <option value="">{t("products.allTypes")}</option>
            {types.map((tp) => (
              <option key={tp} value={tp}>
                {tp}
              </option>
            ))}
          </select>
        </div>
      </div>
      {loading && items.length === 0 ? (
        <div>{t("common.loading")}</div>
      ) : (
        <ProductsList products={filteredItems} />
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

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  try {
    const baseUrl = getApiBaseUrl();
    const res = await axios.get(`${baseUrl}/rest/products`);
    return {
      props: {
        ...(await serverSideTranslations(ctx.locale ?? "en", ["common"])),
        initialProducts: res.data,
      },
    };
  } catch (e) {
    return {
      props: {
        ...(await serverSideTranslations(ctx.locale ?? "en", ["common"])),
        initialProducts: [],
      },
    };
  }
};

export default withAuth(ProductsPage);
