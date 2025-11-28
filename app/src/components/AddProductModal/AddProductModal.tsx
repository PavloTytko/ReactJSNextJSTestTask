import React, {useState} from "react";
import styles from "../DeleteModal/DeleteModal.module.scss";
import {motion} from "framer-motion";
import {Product} from "../../store/slices/productsSlice";

const AddProductModal: React.FC<{
    onClose: () => void;
    onSubmit: (product: Omit<Product, "id">) => void;
}> = ({onClose, onSubmit}) => {
    const [title, setTitle] = useState("");
    const [type, setType] = useState("");
    const [serialNumber, setSerialNumber] = useState("");
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = () => {
        if (!title.trim() || !type.trim()) {
            setError("Title and Type are required");
            return;
        }
        onSubmit({
            title: title.trim(),
            type: type.trim(),
            serialNumber: serialNumber.trim() || undefined,
            date: new Date().toISOString()
        });
        onClose();
    };

    return (
        <div className={styles.overlay} onClick={onClose}>
            <motion.div className={styles.modal} initial={{scale: 0.95, opacity: 0}} animate={{scale: 1, opacity: 1}}
                        onClick={(e) => e.stopPropagation()}>
                <h3>Add product</h3>
                <div style={{display: "flex", flexDirection: "column", gap: 8}}>
                    <input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
                    <input placeholder="Type" value={type} onChange={(e) => setType(e.target.value)} />
                    <input placeholder="Serial Number (optional)" value={serialNumber}
                           onChange={(e) => setSerialNumber(e.target.value)} />
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

export default AddProductModal;
