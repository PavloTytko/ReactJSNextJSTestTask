import React, {useMemo, useState} from "react";
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
    const [specification, setSpecification] = useState("");
    const [isNew, setIsNew] = useState<boolean>(true);
    const [guaranteeStart, setGuaranteeStart] = useState<string>("");
    const [guaranteeEnd, setGuaranteeEnd] = useState<string>("");
    const [usdPrice, setUsdPrice] = useState<string>("");
    const [uahPrice, setUahPrice] = useState<string>("");
    const [defaultCurrency, setDefaultCurrency] = useState<"USD" | "UAH">("UAH");
    const [photo, setPhoto] = useState<string>("");
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
        if (!title.trim() || !type.trim()) {
            setError("Title and Type are required");
            return;
        }
        // Validate prices (allow empty). If provided, must be >= 0 numbers
        const parsedUsd = usdPrice.trim() === "" ? undefined : Number(usdPrice);
        const parsedUah = uahPrice.trim() === "" ? undefined : Number(uahPrice);
        if ((parsedUsd !== undefined && (isNaN(parsedUsd) || parsedUsd < 0)) ||
            (parsedUah !== undefined && (isNaN(parsedUah) || parsedUah < 0))) {
            setError("Prices must be non-negative numbers");
            return;
        }
        const priceArr: NonNullable<Product["price"]> = [];
        if (parsedUsd !== undefined) priceArr.push({ value: parsedUsd, symbol: "USD", isDefault: defaultCurrency === "USD" ? 1 : 0 });
        if (parsedUah !== undefined) priceArr.push({ value: parsedUah, symbol: "UAH", isDefault: defaultCurrency === "UAH" ? 1 : 0 });

        const payload: Omit<Product, "id"> = {
            title: title.trim(),
            type: type.trim(),
            serialNumber: serialNumber.trim() || undefined,
            specification: specification.trim() || undefined,
            guarantee: guaranteeStart || guaranteeEnd ? {
                start: guaranteeStart ? new Date(guaranteeStart).toISOString() : "",
                end: guaranteeEnd ? new Date(guaranteeEnd).toISOString() : "",
            } : undefined,
            price: priceArr.length ? priceArr : undefined,
            date: (dateLocal ? new Date(dateLocal) : new Date()).toISOString(),
            photo: photo.trim() || undefined,
            isNew: isNew ? 1 : 0,
        };

        onSubmit(payload);
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
                    <textarea placeholder="Specification (optional)" value={specification}
                              onChange={(e) => setSpecification(e.target.value)} />
                    <label style={{display: "flex", alignItems: "center", gap: 6}}>
                        <input type="checkbox" checked={isNew} onChange={(e) => setIsNew(e.target.checked)} />
                        Is new
                    </label>
                    <div style={{display: "flex", gap: 8}}>
                        <input type="datetime-local" placeholder="Guarantee start" value={guaranteeStart}
                               onChange={(e) => setGuaranteeStart(e.target.value)} />
                        <input type="datetime-local" placeholder="Guarantee end" value={guaranteeEnd}
                               onChange={(e) => setGuaranteeEnd(e.target.value)} />
                    </div>
                    <div style={{display: "flex", flexDirection: "column", gap: 6}}>
                        <div style={{display: "flex", gap: 8, alignItems: "center"}}>
                            <label style={{width: 40}}>USD</label>
                            <input type="number" min="0" step="0.01" placeholder="Price in USD" value={usdPrice}
                                   onChange={(e) => setUsdPrice(e.target.value)} />
                            <label style={{display: "flex", alignItems: "center", gap: 4}}>
                                <input type="radio" name="defaultCurrency" value="USD" checked={defaultCurrency === "USD"}
                                       onChange={() => setDefaultCurrency("USD")} /> Default
                            </label>
                        </div>
                        <div style={{display: "flex", gap: 8, alignItems: "center"}}>
                            <label style={{width: 40}}>UAH</label>
                            <input type="number" min="0" step="0.01" placeholder="Price in UAH" value={uahPrice}
                                   onChange={(e) => setUahPrice(e.target.value)} />
                            <label style={{display: "flex", alignItems: "center", gap: 4}}>
                                <input type="radio" name="defaultCurrency" value="UAH" checked={defaultCurrency === "UAH"}
                                       onChange={() => setDefaultCurrency("UAH")} /> Default
                            </label>
                        </div>
                    </div>
                    <input type="datetime-local" value={dateLocal || nowLocal} onChange={(e) => setDateLocal(e.target.value)} />
                    <input placeholder="Photo URL (optional)" value={photo} onChange={(e) => setPhoto(e.target.value)} />
                    {photo && <img src={photo} alt="Product photo preview" style={{width: 64, height: 64, objectFit: "cover", borderRadius: 4}} />}
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
