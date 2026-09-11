import { useState } from "react";
import { X } from "lucide-react";

export default function AddInstructionModal({
    onClose,
    onAdd
}) {
    const [customerName, setCustomerName] =
        useState("");

    const [address, setAddress] =
        useState("");

    const [remarks, setRemarks] =
        useState("");


    const handleSubmit = e => {
        e.preventDefault();

        onAdd({
            customerId: null,
            customerName,
            address,
            remarks
        });
    };


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

            <form
                onSubmit={handleSubmit}
                className="
                    bg-white
                    rounded-xl
                    shadow-xl
                    w-full
                    max-w-lg
                "
            >

                {/* Header */}

                <div className="
                    px-5
                    py-4
                    border-b
                    flex
                    justify-between
                    items-center
                ">

                    <h2 className="font-bold text-lg">
                        Add Delivery Instruction
                    </h2>


                    <button
                        type="button"
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-lg"
                    >
                        <X size={18} />
                    </button>

                </div>


                {/* Body */}

                <div className="p-5 space-y-4">


                    {/* Customer */}

                    <div>

                        <label className="
                            block
                            text-sm
                            font-semibold
                            mb-1
                        ">
                            Customer
                        </label>

                        <input
                            value={customerName}
                            onChange={e =>
                                setCustomerName(
                                    e.target.value
                                )
                            }
                            placeholder="Customer name"
                            className="
                                w-full
                                border
                                rounded-lg
                                px-3
                                py-2
                                text-sm
                            "
                        />

                    </div>


                    {/* Address */}

                    <div>

                        <label className="
                            block
                            text-sm
                            font-semibold
                            mb-1
                        ">
                            Address
                        </label>

                        <textarea
                            value={address}
                            onChange={e =>
                                setAddress(
                                    e.target.value
                                )
                            }
                            rows={2}
                            placeholder="Customer address"
                            className="
                                w-full
                                border
                                rounded-lg
                                px-3
                                py-2
                                text-sm
                                resize-none
                            "
                        />

                    </div>


                    {/* Remark */}

                    <div>

                        <label className="
                            block
                            text-sm
                            font-semibold
                            mb-1
                        ">
                            Instruction / Remark
                        </label>

                        <textarea
                            value={remarks}
                            onChange={e =>
                                setRemarks(
                                    e.target.value
                                )
                            }
                            rows={3}
                            placeholder="Example: Collect all empty bottles"
                            className="
                                w-full
                                border
                                rounded-lg
                                px-3
                                py-2
                                text-sm
                                resize-none
                            "
                        />

                    </div>

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
                        type="button"
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
                        type="submit"
                        className="
                            px-4
                            py-2
                            bg-blue-600
                            text-white
                            rounded-lg
                            font-semibold
                        "
                    >
                        Add Instruction
                    </button>

                </div>

            </form>

        </div>
    );
}