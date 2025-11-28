import React, {useState} from "react";
import styles from "../DeleteModal/DeleteModal.module.scss";
import {motion} from "framer-motion";
import {Order} from "../../store/slices/ordersSlice";

const AddOrderModal: React.FC<{
    onClose: () => void;
    onSubmit: (order: Omit<Order, "id">) => void;
}> = ({onClose, onSubmit}) => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = () => {
        if (!title.trim()) {
            setError("Title is required");
            return;
        }
        onSubmit({
            title: title.trim(),
            description: description.trim() || undefined,
            date: new Date().toISOString(),
            products: []
        });
        onClose();
    };

    return (
        <div className={styles.overlay} onClick={onClose}>
            <motion.div className={styles.modal} initial={{scale: 0.95, opacity: 0}} animate={{scale: 1, opacity: 1}}
                        onClick={(e) => e.stopPropagation()}>
                <h3>Add order</h3>
                <div style={{display: "flex", flexDirection: "column", gap: 8}}>
                    <input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
                    <textarea placeholder="Description (optional)" value={description}
                              onChange={(e) => setDescription(e.target.value)} />
                    {error && <div style={{color: "#c00"}}>{error}</div>}
                </div>
                <div className={styles.actions} style={{marginTop: 12}}>
                    <button className="cancel" onClick={onClose}>Cancel</button>
                    <button className="confirm" onClick={handleSubmit}>Add</button>
                </div>
            </motion.div>
        </div>
    );
};

export default AddOrderModal;
