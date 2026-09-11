import { useEffect, useState } from "react";
import { X } from "lucide-react";

export default function EditRemarkModal({
    row,
    onClose,
    onSave
}) {
    const [remark, setRemark] =
        useState(row?.remarks || "");

    useEffect(() => {
        setRemark(
            row?.remarks || ""
        );
    }, [row]);


    return (
        <div className="
            fixed
            inset-0
            z-[60]
            bg-black/50
            flex
            items-center
            justify-center
            p-4
        ">

            <div className="
                bg-white
                rounded-xl
                shadow-xl
                w-full
                max-w-lg
            ">

                {/* Header */}

                <div className="
                    px-5
                    py-4
                    border-b
                    flex
                    justify-between
                    items-center
                ">

                    <div>

                        <h2 className="font-bold text-lg">
                            Edit Delivery Remark
                        </h2>

                        <p className="text-sm text-gray-500">
                            {row.customerName}
                        </p>

                    </div>


                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-lg"
                    >
                        <X size={18} />
                    </button>

                </div>


                {/* Body */}

                <div className="p-5">

                    <label className="
                        block
                        text-sm
                        font-semibold
                        mb-2
                    ">
                        Remark
                    </label>


                    <textarea
                        value={remark}
                        onChange={e =>
                            setRemark(
                                e.target.value
                            )
                        }
                        rows={4}
                        autoFocus
                        placeholder="Enter delivery instruction..."
                        className="
                            w-full
                            border
                            rounded-lg
                            px-3
                            py-2
                            text-sm
                            resize-none
                            focus:outline-none
                            focus:ring-2
                            focus:ring-blue-500
                        "
                    />

                </div>


                {/* Footer */}

                <div className="
                    px-5
                    py-3
                    border-t
                    flex
                    justify-end
                    gap-2
                ">

                    <button
                        onClick={onClose}
                        className="
                            px-4
                            py-2
                            border
                            rounded-lg
                        "
                    >
                        Cancel
                    </button>


                    <button
                        onClick={() =>
                            onSave(
                                remark.trim()
                            )
                        }
                        className="
                            px-4
                            py-2
                            bg-blue-600
                            text-white
                            rounded-lg
                            font-semibold
                        "
                    >
                        Apply
                    </button>

                </div>

            </div>

        </div>
    );
}