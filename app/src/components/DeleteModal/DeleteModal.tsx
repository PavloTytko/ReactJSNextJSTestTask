import React from "react";
import styles from "./DeleteModal.module.scss";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

const DeleteModal: React.FC<{ onClose: () => void; onConfirm: () => void }> = ({ onClose, onConfirm }) => {
    const { t } = useTranslation("common");
    return (
        <div className={styles.overlay} onClick={onClose} role="dialog" aria-modal="true" aria-label={t("orders.deleteTitle")}>            
            <motion.div
                className={styles.modal}
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.98, opacity: 0 }}
                transition={{ type: "spring", stiffness: 260, damping: 22 }}
                onClick={(e) => e.stopPropagation()}
            >
                <h3>{t("orders.deleteTitle")}</h3>
                <p>{t("orders.deleteDescription")}</p>
                <div className={styles.actions}>
                    <button className={styles.cancel} onClick={onClose}>{t("common.cancel")}</button>
                    <button className={styles.confirm} onClick={onConfirm}>{t("common.delete")}</button>
                </div>
            </motion.div>
        </div>
    );
};

export default DeleteModal;
