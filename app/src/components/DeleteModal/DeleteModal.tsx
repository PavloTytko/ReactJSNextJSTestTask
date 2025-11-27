import React from "react";
import styles from "./DeleteModal.module.scss";
import {motion} from "framer-motion";

const DeleteModal: React.FC<{ onClose: () => void; onConfirm: () => void }> = ({onClose, onConfirm}) => {
    return (
        <div className={styles.overlay} onClick={onClose}>
            <motion.div className={styles.modal} initial={{scale: 0.95, opacity: 0}} animate={{scale: 1, opacity: 1}}
                        onClick={(e) => e.stopPropagation()}>
                <h3>Delete order</h3>
                <p>Are you sure you want to delete this order? This action cannot be undone.</p>
                <div className={styles.actions}>
                    <button className="cancel" onClick={onClose}>Cancel</button>
                    <button className="confirm" onClick={onConfirm}>Delete</button>
                </div>
            </motion.div>
        </div>
    );
};

export default DeleteModal;
