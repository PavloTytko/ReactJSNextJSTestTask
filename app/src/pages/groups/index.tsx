import React from "react";
import withAuth from "../../components/protectedRoute/withAuth";
import styles from "./GroupsPage.module.scss";
import { GetServerSideProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

const GroupsPage = () => {
  return (
    <div className={styles.card}>
      <h2>Groups</h2>
    </div>
  );
};

export default withAuth(GroupsPage);

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  return {
    props: {
      ...(await serverSideTranslations(ctx.locale ?? "en", ["common"])),
    },
  };
};
