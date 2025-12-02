import React, {useMemo, useState} from "react";
import styles from "../DeleteModal/DeleteModal.module.scss";
import {motion} from "framer-motion";
import {Order} from "../../store/slices/ordersSlice";

const AddOrderModal: React.FC<{
    onClose: () => void;
    onSubmit: (order: Omit<Order, "id">) => void;
}> = ({onClose, onSubmit}) => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [photo, setPhoto] = useState("");
    const [dateLocal, setDateLocal] = useState<string>("");
    const [error, setError] = useState<string | null>(null);

    const nowLocal = useMemo(() => {
        const d = new Date();
        const pad = (n: number) => String(n).padStart(2, "0");
        const yyyy = d.getFullYear();
        const mm = pad(d.getMonth() + 1);
        const dd = pad(d.getDate());
        const hh = pad(d.getHours());
        const mi = pad(d.getMinutes());
        return `${yyyy}-${mm}-${dd}T${hh}:${mi}`;
    }, []);

    const handleSubmit = () => {
        if (!title.trim()) {
            setError("Title is required");
            return;
        }
        const isoDate = dateLocal ? new Date(dateLocal).toISOString() : new Date().toISOString();
        onSubmit({
            title: title.trim(),
            description: description.trim() || undefined,
            date: isoDate,
            photo: photo.trim() || undefined,
            products: []
        });
        onClose();
    };

    return (
        <div className={styles.overlay} onClick={onClose}>
            <motion.div className={styles.modal} initial={{scale: 0.95, opacity: 0}} animate={{scale: 1, opacity: 1}}
                        onClick={(e) => e.stopPropagation()}>
                <h3>Add order</h3>
                <div className={styles.form}>
                    <input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
                    <textarea placeholder="Description (optional)" value={description}
                              onChange={(e) => setDescription(e.target.value)} />
                    <input
                        type="datetime-local"
                        value={dateLocal || nowLocal}
                        onChange={(e) => setDateLocal(e.target.value)}
                    />
                    <input
                        placeholder="Photo URL (optional)"
                        value={photo}
                        onChange={(e) => setPhoto(e.target.value)}
                    />
                    {photo && (
                        <img src={photo} alt="Order photo preview" className={styles.previewImg} />
                    )}
                    {error && <div className={styles.errorText}>{error}</div>}
                </div>
                <div className={styles.actions}>
                    <button className="cancel" onClick={onClose}>Cancel</button>
                    <button className="confirm" onClick={handleSubmit}>Add</button>
                </div>
            </motion.div>
        </div>
    );
};

export default AddOrderModal;
