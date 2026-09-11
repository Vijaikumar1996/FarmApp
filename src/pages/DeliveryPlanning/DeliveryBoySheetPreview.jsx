import React, {
    useEffect,
    useState,
    useRef
} from "react";

import {
    X,
    Plus,
    Pencil,
    Trash2,
    ChevronLeft,
    ChevronRight
} from "lucide-react";

import toast from "react-hot-toast";

import { toBlob } from "html-to-image";

import { useDeliveryBoySheetPreview } from "../../queries/useDeliveryPlanning";


export default function DeliveryBoySheetPreview({
    deliveryDate,
    areaId,
    onClose
}) {
    // =========================================================
    // API
    // =========================================================

    const {
        data,
        isLoading,
        isError
    } = useDeliveryBoySheetPreview(
        deliveryDate,
        areaId
    );


    // =========================================================
    // State
    // =========================================================

    const [areas, setAreas] = useState([]);

    const [activeAreaIndex, setActiveAreaIndex] =
        useState(0);

    const [editingRow, setEditingRow] =
        useState(null);

    const [editingDeliveryTotal, setEditingDeliveryTotal] =
        useState(null);

    const [showAddInstruction, setShowAddInstruction] =
        useState(false);

    const sheetRef = useRef(null);


    // =========================================================
    // Load API Data
    // =========================================================

    useEffect(() => {

        if (!data?.areas) {
            setAreas([]);
            return;
        }

        const mappedAreas =
            data.areas.map(area => ({
                ...area,

                groups: (area.groups || []).map(
                    group => ({
                        ...group,

                        rows: (group.rows || []).map(
                            row => ({
                                ...row,

                                _previewId:
                                    crypto.randomUUID()
                            })
                        )
                    })
                )
            }));

        setAreas(mappedAreas);

        setActiveAreaIndex(0);

    }, [data]);


    // =========================================================
    // Active Area
    // =========================================================

    const activeArea =
        areas[activeAreaIndex] || null;


    // =========================================================
    // Check whether current area contains
    // non-grouped delivery data
    //
    // showDeliveryTotal = true
    //     => GroupDeliverySheetByLocation = true
    //
    // showDeliveryTotal = false
    //     => GroupDeliverySheetByLocation = false
    // =========================================================

    const hasWholeSheetOption =
        activeArea?.groups?.some(
            group => !group.showDeliveryTotal
        ) || false;

    const openEditDeliveryTotal = (groupIndex) => {
        const group = activeArea?.groups?.[groupIndex];

        if (!group?.showDeliveryTotal || !group.deliveryTotal) {
            return;
        }

        setEditingDeliveryTotal({
            groupIndex,
            value: group.deliveryTotal.value || ""
        });
    };

    const saveDeliveryTotal = () => {
        if (!editingDeliveryTotal) {
            return;
        }

        const {
            groupIndex,
            value
        } = editingDeliveryTotal;

        const trimmedValue = value.trim();

        if (!trimmedValue) {
            toast.error("Delivery total cannot be empty.");
            return;
        }

        setAreas(prev =>
            prev.map((area, areaIndex) => {

                if (areaIndex !== activeAreaIndex) {
                    return area;
                }

                return {
                    ...area,

                    groups: area.groups.map(
                        (group, index) => {

                            if (index !== groupIndex) {
                                return group;
                            }

                            return {
                                ...group,

                                deliveryTotal:
                                    group.deliveryTotal
                                        ? {
                                            ...group.deliveryTotal,
                                            value: trimmedValue
                                        }
                                        : group.deliveryTotal
                            };
                        }
                    )
                };
            })
        );

        setEditingDeliveryTotal(null);

        toast.success(
            "Temporary delivery total updated."
        );
    };


    // =========================================================
    // Edit Remark
    // =========================================================

    const openEditRemark = row => {

        setEditingRow({
            ...row,

            remarkValue:
                row.remarks || ""
        });

    };


    // =========================================================
    // Save Temporary Remark
    // =========================================================

    const saveRemark = () => {

        if (!editingRow) {
            return;
        }

        const {
            _previewId,
            remarkValue
        } = editingRow;


        setAreas(prev =>
            prev.map(area => ({
                ...area,

                groups:
                    area.groups.map(group => ({
                        ...group,

                        rows:
                            group.rows.map(row =>
                                row._previewId ===
                                    _previewId
                                    ? {
                                        ...row,
                                        remarks:
                                            remarkValue
                                    }
                                    : row
                            )
                    }))
            }))
        );


        setEditingRow(null);


        toast.success(
            "Temporary remark updated."
        );

    };


    // =========================================================
    // Add Temporary Instruction
    // =========================================================

    const addManualInstruction = ({
        customerName,
        address,
        milk,
        otherProducts,
        remarks
    }) => {

        if (!activeArea) {
            return;
        }


        const manualRow = {

            _previewId:
                crypto.randomUUID(),

            customerId:
                null,

            areaCode:
                activeArea.areaCode || "",

            customerName:
                customerName || "",

            address:
                address || "",

            milk:
                milk || "",

            otherProducts:
                otherProducts || "",

            remarks:
                remarks || "",

            isManual:
                true,

            hasOtherProducts:
                !!otherProducts
        };


        setAreas(prev =>
            prev.map((area, index) => {

                if (
                    index !==
                    activeAreaIndex
                ) {
                    return area;
                }


                /*
                 * Manual instructions are kept
                 * in a separate group.
                 *
                 * This ensures they are NOT included
                 * in any Delivery Total.
                 */

                return {
                    ...area,

                    groups: [
                        ...area.groups,

                        {
                            rows: [
                                manualRow
                            ],

                            showDeliveryTotal:
                                false,

                            deliveryTotal:
                                null
                        }
                    ]
                };

            })
        );


        setShowAddInstruction(false);


        toast.success(
            "Temporary instruction added."
        );

    };


    // =========================================================
    // Delete Manual Row
    // =========================================================

    const deleteManualRow = rowId => {

        setAreas(prev =>
            prev.map(area => ({

                ...area,

                groups:
                    area.groups

                        .map(group => ({

                            ...group,

                            rows:
                                group.rows.filter(
                                    row =>
                                        row._previewId !==
                                        rowId
                                )

                        }))

                        .filter(
                            group =>
                                group.rows.length > 0
                        )

            }))
        );


        toast.success(
            "Temporary instruction removed."
        );

    };


    // =========================================================
    // Get Original Container Styles
    // =========================================================

    const getContainerStyles = container => ({
        height:
            container.style.height,

        maxHeight:
            container.style.maxHeight,

        overflow:
            container.style.overflow,

        flex:
            container.style.flex,

        minHeight:
            container.style.minHeight
    });


    // =========================================================
    // Restore Container Styles
    // =========================================================

    const restoreContainerStyles = (
        container,
        originalStyles
    ) => {

        container.style.height =
            originalStyles.height;

        container.style.maxHeight =
            originalStyles.maxHeight;

        container.style.overflow =
            originalStyles.overflow;

        container.style.flex =
            originalStyles.flex;

        container.style.minHeight =
            originalStyles.minHeight;
    };


    // =========================================================
    // Convert Existing DOM to Image
    // =========================================================

    const createImageBlob = async () => {

        if (!sheetRef.current) {
            throw new Error(
                "Preview is not available."
            );
        }


        const container =
            sheetRef.current;


        const originalStyles =
            getContainerStyles(
                container
            );


        try {

            /*
             * The preview is inside a scrollable container.
             *
             * Expand it temporarily so html-to-image
             * captures ALL rows instead of only the
             * visible 3-4 rows.
             */

            const fullHeight =
                container.scrollHeight;


            container.style.height =
                `${fullHeight}px`;

            container.style.maxHeight =
                "none";

            container.style.overflow =
                "visible";

            container.style.flex =
                "none";

            container.style.minHeight =
                "0";


            /*
             * Wait for browser repaint.
             */

            await new Promise(resolve =>
                requestAnimationFrame(() =>
                    requestAnimationFrame(
                        resolve
                    )
                )
            );


            const blob =
                await toBlob(
                    container,
                    {
                        backgroundColor:
                            "#ffffff",

                        pixelRatio:
                            1.5,

                        cacheBust:
                            true,

                        filter:
                            node => {

                                if (
                                    node instanceof
                                    HTMLElement &&
                                    (
                                        node.hasAttribute(
                                            "data-html2canvas-ignore"
                                        ) ||
                                        node.getAttribute(
                                            "data-preview-section"
                                        ) === "loading-summary"
                                    )
                                ) {
                                    return false;
                                }

                                return true;
                            }
                    }
                );


            if (!blob) {

                throw new Error(
                    "Failed to generate image."
                );

            }


            return {
                blob,
                originalStyles
            };

        } catch (error) {

            restoreContainerStyles(
                container,
                originalStyles
            );

            throw error;
        }

    };


    // =========================================================
    // Copy Whole Sheet as Image
    // =========================================================

    const copyWholeSheetAsImage = async () => {

        if (!sheetRef.current) {

            toast.error(
                "Preview is not available."
            );

            return;
        }


        const container =
            sheetRef.current;


        const originalStyles =
            getContainerStyles(
                container
            );


        try {

            /*
             * Expand the existing scrollable
             * container.
             */

            const fullHeight =
                container.scrollHeight;


            container.style.height =
                `${fullHeight}px`;

            container.style.maxHeight =
                "none";

            container.style.overflow =
                "visible";

            container.style.flex =
                "none";

            container.style.minHeight =
                "0";


            /*
             * Wait for repaint.
             */

            await new Promise(resolve =>
                requestAnimationFrame(() =>
                    requestAnimationFrame(
                        resolve
                    )
                )
            );


            /*
             * Convert EXISTING DOM.
             */

            const blob =
                await toBlob(
                    container,
                    {
                        backgroundColor:
                            "#ffffff",

                        pixelRatio:
                            1.5,

                        cacheBust:
                            true,

                        filter:
                            node => {

                                if (
                                    node instanceof
                                    HTMLElement &&
                                    (
                                        node.hasAttribute(
                                            "data-html2canvas-ignore"
                                        ) ||
                                        node.getAttribute(
                                            "data-preview-section"
                                        ) === "loading-summary"
                                    )
                                ) {
                                    return false;
                                }

                                return true;
                            }
                    }
                );


            if (!blob) {

                throw new Error(
                    "Failed to generate image."
                );

            }


            /*
             * Copy image.
             */

            await navigator.clipboard.write([
                new ClipboardItem({
                    "image/png":
                        blob
                })
            ]);


            toast.success(
                "Whole sheet copied as image."
            );

        } catch (error) {

            console.error(
                "Copy whole sheet as image failed:",
                error
            );

            toast.error(
                "Failed to copy whole sheet as image."
            );

        } finally {

            restoreContainerStyles(
                container,
                originalStyles
            );

        }

    };


    // =========================================================
    // Copy Individual Location / Group as Image
    // =========================================================

    const copyLocationAsImage = async (
        groupIndex
    ) => {

        if (!sheetRef.current) {

            toast.error(
                "Preview is not available."
            );

            return;
        }


        const group =
            activeArea?.groups?.[groupIndex];


        if (!group) {

            toast.error(
                "Location group not found."
            );

            return;
        }


        if (!group.showDeliveryTotal) {

            toast.error(
                "This group does not have a separate location image."
            );

            return;
        }


        const container =
            sheetRef.current;


        const originalStyles =
            getContainerStyles(
                container
            );


        /*
         * All elements belonging to preview groups.
         *
         * This includes:
         *
         * - Customer rows
         * - Delivery Total rows
         */

        const groupElements =
            container.querySelectorAll(
                "[data-preview-group]"
            );


        const hiddenElements = [];


        /*
         * Loading Summary should NOT be
         * included in location image.
         */

        const loadingSummary =
            container.querySelector(
                '[data-preview-section="loading-summary"]'
            );


        const originalLoadingSummaryDisplay =
            loadingSummary
                ? loadingSummary.style.display
                : "";


        try {

            // =================================================
            // Hide other groups
            // =================================================

            groupElements.forEach(
                element => {

                    const elementGroup =
                        element.getAttribute(
                            "data-preview-group"
                        );


                    if (
                        elementGroup !==
                        String(groupIndex)
                    ) {

                        hiddenElements.push({
                            element,

                            display:
                                element.style.display
                        });


                        element.style.display =
                            "none";
                    }

                }
            );


            // =================================================
            // Hide Loading Summary
            // =================================================

            if (loadingSummary) {

                loadingSummary.style.display =
                    "none";

            }


            // =================================================
            // Expand existing container
            // =================================================

            const fullHeight =
                container.scrollHeight;


            container.style.height =
                `${fullHeight}px`;

            container.style.maxHeight =
                "none";

            container.style.overflow =
                "visible";

            container.style.flex =
                "none";

            container.style.minHeight =
                "0";


            // =================================================
            // Wait for repaint
            // =================================================

            await new Promise(resolve =>
                requestAnimationFrame(() =>
                    requestAnimationFrame(
                        resolve
                    )
                )
            );


            // =================================================
            // Generate Image
            // =================================================

            const blob =
                await toBlob(
                    container,
                    {
                        backgroundColor:
                            "#ffffff",

                        pixelRatio:
                            1.5,

                        cacheBust:
                            true,

                        filter:
                            node => {

                                if (
                                    node instanceof
                                    HTMLElement &&
                                    (
                                        node.hasAttribute(
                                            "data-html2canvas-ignore"
                                        ) ||
                                        node.getAttribute(
                                            "data-preview-section"
                                        ) === "loading-summary"
                                    )
                                ) {
                                    return false;
                                }

                                return true;
                            }
                    }
                );


            if (!blob) {

                throw new Error(
                    "Failed to generate image."
                );

            }


            // =================================================
            // Copy to Clipboard
            // =================================================

            await navigator.clipboard.write([
                new ClipboardItem({
                    "image/png":
                        blob
                })
            ]);


            toast.success(
                "Location copied as image."
            );

        } catch (error) {

            console.error(
                "Copy location as image failed:",
                error
            );

            toast.error(
                "Failed to copy location as image."
            );

        } finally {

            // =================================================
            // Restore hidden groups
            // =================================================

            hiddenElements.forEach(
                ({
                    element,
                    display
                }) => {

                    element.style.display =
                        display;

                }
            );


            // =================================================
            // Restore Loading Summary
            // =================================================

            if (loadingSummary) {

                loadingSummary.style.display =
                    originalLoadingSummaryDisplay;

            }


            // =================================================
            // Restore Container
            // =================================================

            restoreContainerStyles(
                container,
                originalStyles
            );

        }

    };


    // =========================================================
    // Copy Loading Summary as Text
    // =========================================================

    const copyLoadingSummaryAsText = async () => {
        if (!activeArea) {
            toast.error("Loading summary is not available.");
            return;
        }

        const summaryItems = activeArea.loadingSummary || [];

        if (summaryItems.length === 0) {
            toast.error("No loading summary available.");
            return;
        }

        const summaryText = summaryItems
            .map(item => `${String(item.product || "").trim()} ${item.quantity ?? ""}`.trim())
            .filter(Boolean)
            .join("\n");

        try {
            await navigator.clipboard.writeText(summaryText);
            toast.success("Loading summary copied as text.");
        } catch (error) {
            console.error("Copy loading summary as text failed:", error);
            toast.error("Failed to copy loading summary.");
        }
    };


    // =========================================================
    // Previous Area
    // =========================================================

    const previousArea = () => {

        if (activeAreaIndex <= 0) {
            return;
        }

        setActiveAreaIndex(
            previous =>
                previous - 1
        );

    };


    // =========================================================
    // Next Area
    // =========================================================

    const nextArea = () => {

        if (
            activeAreaIndex >=
            areas.length - 1
        ) {
            return;
        }

        setActiveAreaIndex(
            previous =>
                previous + 1
        );

    };


    // =========================================================
    // Loading
    // =========================================================

    if (isLoading) {

        return (

            <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">

                <div className="bg-white rounded-xl px-6 py-5 shadow-xl">

                    Loading preview...

                </div>

            </div>

        );

    }


    // =========================================================
    // Error
    // =========================================================

    if (isError) {

        return (

            <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">

                <div className="bg-white rounded-xl p-6 shadow-xl">

                    <p className="text-red-600">
                        Failed to load delivery preview.
                    </p>


                    <button
                        onClick={onClose}
                        className="mt-4 px-4 py-2 bg-gray-800 text-white rounded"
                    >
                        Close
                    </button>

                </div>

            </div>

        );

    }


    // =========================================================
    // Main UI
    // =========================================================

    return (

        <div className="fixed inset-0 z-1000 bg-black/50 flex items-center justify-center">

            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-[1500px] h-[99vh] flex flex-col">


                {/* ================================================= */}
                {/* Header */}
                {/* ================================================= */}

                <div className="flex items-center justify-between px-5 py-3 border-b">

                    <div>

                        <h2 className="text-sm font-semibold">
                            Delivery Boy Sheet Preview
                        </h2>


                        <p className="text-sm text-gray-500">
                            Delivery Date:{" "}
                            {data?.deliveryDate}
                        </p>

                    </div>


                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg hover:bg-gray-100"
                    >

                        <X size={20} />

                    </button>

                </div>


                {/* ================================================= */}
                {/* Area Tabs */}
                {/* ================================================= */}

                <div className="px-5 pt-3 border-b">

                    <div className="flex items-center gap-2 overflow-x-auto">

                        {areas.map(
                            (area, index) => (

                                <button
                                    key={
                                        area.areaCode
                                    }

                                    onClick={() =>
                                        setActiveAreaIndex(
                                            index
                                        )
                                    }

                                    className={`
                                        px-4
                                        py-2
                                        rounded-t-lg
                                        text-sm
                                        font-medium
                                        border-b-2
                                        whitespace-nowrap
                                        ${activeAreaIndex ===
                                            index
                                            ? "border-blue-600 text-blue-600 bg-blue-50"
                                            : "border-transparent text-gray-600 hover:bg-gray-50"
                                        }
                                    `}
                                >

                                    {
                                        area.areaCode
                                    }

                                </button>

                            )
                        )}

                    </div>

                </div>


                {/* ================================================= */}
                {/* Toolbar */}
                {/* ================================================= */}

                <div className="px-5 py-3 border-b flex items-center justify-between">

                    <div className="text-sm text-gray-500">


                    </div>


                    <div className="flex items-center gap-2">


                        {/* ========================================= */}
                        {/* Add Instruction */}
                        {/* ========================================= */}

                        {/* <button
                            onClick={() =>
                                setShowAddInstruction(
                                    true
                                )
                            }

                            className="flex items-center gap-2 px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >

                            <Plus size={16} />

                            Add Instruction

                        </button> */}


                        {/* ========================================= */}
                        {/* Copy Whole Sheet */}
                        {/* ========================================= */}

                        {hasWholeSheetOption && (

                            <button
                                onClick={
                                    copyWholeSheetAsImage
                                }

                                className="flex items-center gap-2 px-3 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700"
                            >

                                Copy Whole Sheet

                            </button>

                        )}

                        <button
                            onClick={copyLoadingSummaryAsText}
                            className="flex items-center gap-2 px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                            Copy Summary
                        </button>

                    </div>

                </div>


                {/* ================================================= */}
                {/* Sheet */}
                {/* ================================================= */}

                <div

                    className="flex-1 overflow-auto p-5 bg-white"
                >

                    {!activeArea ? (

                        <div className="text-center py-10 text-gray-500">

                            No delivery data available.

                        </div>

                    ) : (

                        <>

                            {/* ===================================== */}
                            {/* Title */}
                            {/* ===================================== */}
                            <div ref={sheetRef}>
                                <div className="text-center  mb-2">
                                    <div className="flex justify-center gap-10 mt-2 text-xl font-semibold">

                                        <span>
                                            Delivery Date:{" "}
                                            {
                                                data?.deliveryDate
                                            }
                                        </span>


                                        <span>
                                            Area:{" "}
                                            {
                                                activeArea.areaCode
                                            }
                                        </span>

                                    </div>

                                </div>


                                {/* ===================================== */}
                                {/* Delivery Table */}
                                {/* ===================================== */}

                                <table className="w-full border-collapse  text-xl">

                                    <thead>

                                        <tr className="bg-blue-600 text-white">

                                            {/* <th className="border px-2 py-2">
                                            Area
                                        </th> */}


                                            <th className="border px-2 py-2">
                                                Customer
                                            </th>


                                            <th className="border px-2 py-2">
                                                Address
                                            </th>


                                            <th className="border w-1/14 px-2 py-2">
                                                Milk
                                            </th>


                                            <th className="border px-2 py-2">
                                                Other Products
                                            </th>


                                            <th
                                                className="border px-2 py-2"
                                                data-html2canvas-ignore="true"
                                            >
                                                Action
                                            </th>

                                        </tr>

                                    </thead>


                                    <tbody>

                                        {activeArea.groups.map(
                                            (
                                                group,
                                                groupIndex
                                            ) => (

                                                <React.Fragment
                                                    key={
                                                        groupIndex
                                                    }
                                                >

                                                    {/* ================================= */}
                                                    {/* Customer Rows */}
                                                    {/* ================================= */}

                                                    {group.rows.map(
                                                        row => (

                                                            <tr
                                                                key={
                                                                    row._previewId
                                                                }

                                                                data-preview-row={
                                                                    row._previewId
                                                                }

                                                                data-preview-group={
                                                                    groupIndex
                                                                }

                                                                className={
                                                                    row.isManual
                                                                        ? "bg-orange-50"
                                                                        : row.hasOtherProducts
                                                                            ? "bg-yellow-100"
                                                                            : ""
                                                                }
                                                            >

                                                                {/* Area */}
                                                                {/* 
                                                            <td className="border px-2 py-2 align-top whitespace-pre-wrap">

                                                                {
                                                                    row.areaCode
                                                                }

                                                            </td> */}


                                                                {/* Customer */}

                                                                <td className="border px-2 py-2 align-top">

                                                                    <div className="font-medium">

                                                                        {
                                                                            row.customerName
                                                                        }

                                                                    </div>


                                                                    {row.isManual && (

                                                                        <span className="inline-block mt-1 text-xs px-2 py-0.5 rounded bg-orange-200 text-orange-800 font-semibold">

                                                                            MANUAL

                                                                        </span>

                                                                    )}

                                                                </td>


                                                                {/* Address */}

                                                                <td className="border px-2 py-2 align-top whitespace-pre-wrap">

                                                                    {
                                                                        row.address ||
                                                                        "-"
                                                                    }

                                                                </td>


                                                                {/* Milk */}

                                                                <td className="border font-bold px-2 py-2 text-2xl text-center align-top whitespace-pre-wrap">

                                                                    {
                                                                        row.milk ||
                                                                        "-"
                                                                    }

                                                                </td>


                                                                {/* Other Products */}

                                                                <td className="border px-2 py-2 text-2xl align-top whitespace-pre-wrap">

                                                                    {row.otherProducts && (

                                                                        <div>
                                                                            {
                                                                                row.otherProducts
                                                                            }
                                                                        </div>

                                                                    )}


                                                                    {row.remarks && (

                                                                        <div className="mt-1 font-semibold whitespace-pre-wrap">

                                                                            {
                                                                                row.remarks
                                                                            }

                                                                        </div>

                                                                    )}


                                                                    {!row.otherProducts &&
                                                                        !row.remarks && (

                                                                            <span className="text-gray-400">
                                                                                -
                                                                            </span>

                                                                        )}

                                                                </td>


                                                                {/* Action */}

                                                                <td
                                                                    className="border px-2 py-2 align-top"
                                                                    data-html2canvas-ignore="true"
                                                                >

                                                                    {row.isManual ? (

                                                                        <button
                                                                            onClick={() =>
                                                                                deleteManualRow(
                                                                                    row._previewId
                                                                                )
                                                                            }

                                                                            className="p-2 text-red-600 hover:bg-red-50 rounded"

                                                                            title="Delete"
                                                                        >

                                                                            <Trash2
                                                                                size={16}
                                                                            />

                                                                        </button>

                                                                    ) : (

                                                                        <button
                                                                            onClick={() =>
                                                                                openEditRemark(
                                                                                    row
                                                                                )
                                                                            }

                                                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded"

                                                                            title="Edit Remark"
                                                                        >

                                                                            <Pencil
                                                                                size={16}
                                                                            />

                                                                        </button>

                                                                    )}

                                                                </td>

                                                            </tr>

                                                        )
                                                    )}


                                                    {/* ================================= */}
                                                    {/* Delivery Total */}
                                                    {/* ================================= */}

                                                    {group.showDeliveryTotal &&
                                                        group.deliveryTotal && (

                                                            <tr
                                                                className="font-semibold bg-yellow-100"

                                                                data-preview-group={
                                                                    groupIndex
                                                                }
                                                            >

                                                                <td
                                                                    colSpan={2}
                                                                    className="border px-2 py-2 text-right"
                                                                >

                                                                    {
                                                                        group.deliveryTotal.label
                                                                    }

                                                                </td>


                                                                <td
                                                                    colSpan={2}
                                                                    className="border text-2xl px-2 py-2 whitespace-pre-wrap"
                                                                >
                                                                    {group.deliveryTotal.value}
                                                                </td>

                                                                <td
                                                                    className="border px-2 py-2"
                                                                    data-html2canvas-ignore="true"
                                                                >
                                                                    <div className="flex items-center gap-1">

                                                                        <button
                                                                            onClick={() =>
                                                                                openEditDeliveryTotal(groupIndex)
                                                                            }
                                                                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
                                                                            title="Edit Delivery Total"
                                                                        >
                                                                            <Pencil size={15} />
                                                                        </button>

                                                                        <button
                                                                            onClick={() =>
                                                                                copyLocationAsImage(groupIndex)
                                                                            }
                                                                            className="whitespace-nowrap px-2 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700"
                                                                        >
                                                                            Copy Image
                                                                        </button>

                                                                    </div>
                                                                </td>

                                                            </tr>

                                                        )}

                                                    {/* ================================= */}
                                                    {/* Space After Location */}
                                                    {/* ================================= */}

                                                    {activeArea.showSpaceAfterLocation &&
                                                        groupIndex < activeArea.groups.length - 1 && (

                                                            <tr>
                                                                <td
                                                                    colSpan={5}
                                                                    className="border-0 h-4"
                                                                >
                                                                    &nbsp;
                                                                </td>
                                                            </tr>

                                                        )}

                                                </React.Fragment>

                                            )
                                        )}

                                    </tbody>

                                </table>
                            </div>

                            {/* ===================================== */}
                            {/* Loading Summary */}
                            {/* ===================================== */}

                            <div
                                className="mt-8"

                                data-preview-section="loading-summary"
                            >

                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="text-sm font-semibold">
                                        Loading Summary
                                    </h3>
                                    <button
                                        onClick={copyLoadingSummaryAsText}
                                        data-html2canvas-ignore="true"
                                        className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                    >
                                        Copy Summary
                                    </button>
                                </div>


                                <table className="w-full max-w-md border-collapse text-sm">

                                    <thead>

                                        <tr className="bg-gray-100">

                                            <th className="border px-3 py-2 text-left">
                                                Product
                                            </th>


                                            <th className="border px-3 py-2 text-left">
                                                Quantity
                                            </th>

                                        </tr>

                                    </thead>


                                    <tbody>

                                        {activeArea.loadingSummary?.map(
                                            (item, index) => (

                                                <tr
                                                    key={`${item.product}-${index}`}
                                                >

                                                    <td className="border px-3 py-2">

                                                        {
                                                            item.product
                                                        }

                                                    </td>


                                                    <td className="border px-3 py-2">

                                                        {
                                                            item.quantity
                                                        }

                                                    </td>

                                                </tr>

                                            )
                                        )}

                                    </tbody>

                                </table>

                            </div>

                        </>

                    )}

                </div>


                {/* ================================================= */}
                {/* Footer */}
                {/* ================================================= */}

                <div className="px-5 py-3 border-t flex items-center justify-between">

                    <button
                        onClick={
                            previousArea
                        }

                        disabled={
                            activeAreaIndex === 0
                        }

                        className="flex items-center gap-1 px-3 py-2 border rounded-lg disabled:opacity-40"
                    >

                        <ChevronLeft
                            size={16}
                        />

                        Previous

                    </button>


                    <span className="text-sm text-gray-500">

                        Area{" "}
                        {activeAreaIndex + 1}
                        {" "}
                        of{" "}
                        {areas.length}

                    </span>


                    <button
                        onClick={
                            nextArea
                        }

                        disabled={
                            activeAreaIndex ===
                            areas.length - 1
                        }

                        className="flex items-center gap-1 px-3 py-2 border rounded-lg disabled:opacity-40"
                    >

                        Next

                        <ChevronRight
                            size={16}
                        />

                    </button>

                </div>

            </div>


            {/* ===================================================== */}
            {/* Edit Remark Modal */}
            {/* ===================================================== */}

            {editingRow && (

                <div className="fixed inset-0 z-[60] bg-black/40 flex items-center justify-center p-4">

                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-5">


                        <h3 className="text-sm font-semibold mb-4">
                            Edit Remark
                        </h3>


                        <div className="mb-4">

                            <p className="text-sm text-gray-500 mb-1">
                                Customer
                            </p>


                            <p className="font-medium">
                                {
                                    editingRow.customerName
                                }
                            </p>

                        </div>


                        <textarea
                            value={
                                editingRow.remarkValue
                            }

                            onChange={e =>
                                setEditingRow(
                                    prev => ({
                                        ...prev,

                                        remarkValue:
                                            e.target.value
                                    })
                                )
                            }

                            rows={5}

                            placeholder="Enter temporary instruction..."

                            className="w-full border rounded-lg px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />


                        <div className="flex justify-end gap-2 mt-4">

                            <button
                                onClick={() =>
                                    setEditingRow(null)
                                }

                                className="px-4 py-2 border rounded-lg"
                            >
                                Cancel
                            </button>


                            <button
                                onClick={
                                    saveRemark
                                }

                                className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                            >
                                Apply
                            </button>

                        </div>

                    </div>

                </div>

            )}

            {/* ===================================================== */}
            {/* Edit Delivery Total Modal */}
            {/* ===================================================== */}

            {editingDeliveryTotal && (

                <div className="fixed inset-0 z-[60] bg-black/40 flex items-center justify-center p-4">

                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-5">

                        <h3 className="text-sm font-semibold mb-4">
                            Edit Delivery Total
                        </h3>

                        <div className="mb-4">

                            <label className="block text-sm font-medium mb-1">
                                Delivery Total
                            </label>

                            <input
                                type="text"
                                value={editingDeliveryTotal.value}
                                onChange={e =>
                                    setEditingDeliveryTotal(
                                        prev => ({
                                            ...prev,
                                            value: e.target.value
                                        })
                                    )
                                }
                                placeholder="Example: 2 HLB, 1 OLB, 1 Curd"
                                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                autoFocus
                            />

                        </div>

                        <div className="flex justify-end gap-2">

                            <button
                                onClick={() =>
                                    setEditingDeliveryTotal(null)
                                }
                                className="px-4 py-2 border rounded-lg"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={saveDeliveryTotal}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                            >
                                Apply
                            </button>

                        </div>

                    </div>

                </div>

            )}

            {/* ===================================================== */}
            {/* Add Instruction Modal */}
            {/* ===================================================== */}

            {showAddInstruction && (

                <AddInstructionModal

                    onClose={() =>
                        setShowAddInstruction(
                            false
                        )
                    }

                    onAdd={
                        addManualInstruction
                    }

                />

            )}

        </div>

    );
}


/* ================================================================
   Add Instruction Modal
   ================================================================ */

function AddInstructionModal({
    onClose,
    onAdd
}) {

    const [
        customerName,
        setCustomerName
    ] = useState("");

    const [
        address,
        setAddress
    ] = useState("");

    const [
        milk,
        setMilk
    ] = useState("");

    const [
        otherProducts,
        setOtherProducts
    ] = useState("");

    const [
        remarks,
        setRemarks
    ] = useState("");




    // =============================================================
    // Handle Add
    // =============================================================

    const handleAdd = () => {

        if (
            !customerName.trim() &&
            !address.trim()
        ) {

            toast.error(
                "Please enter customer name or address."
            );

            return;
        }


        onAdd({

            customerName:
                customerName.trim(),

            address:
                address.trim(),

            milk:
                milk.trim(),

            otherProducts:
                otherProducts.trim(),

            remarks:
                remarks.trim()

        });

    };


    // =============================================================
    // UI
    // =============================================================

    return (

        <div className="fixed inset-0 z-[70] bg-black/40 flex items-center justify-center p-4">

            <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-5">


                {/* ================================================= */}
                {/* Header */}
                {/* ================================================= */}

                <div className="flex items-center justify-between mb-4">

                    <h3 className="text-sm font-semibold">
                        Add Temporary Instruction
                    </h3>


                    <button
                        onClick={onClose}
                        className="p-2 rounded hover:bg-gray-100"
                    >

                        <X size={18} />

                    </button>

                </div>


                <div className="space-y-3">


                    {/* ================================================= */}
                    {/* Customer */}
                    {/* ================================================= */}

                    <div>

                        <label className="block text-sm font-medium mb-1">
                            Customer
                        </label>


                        <input
                            value={
                                customerName
                            }

                            onChange={e =>
                                setCustomerName(
                                    e.target.value
                                )
                            }

                            className="w-full border rounded-lg px-3 py-2"

                            placeholder="Customer name"
                        />

                    </div>


                    {/* ================================================= */}
                    {/* Address */}
                    {/* ================================================= */}

                    <div>

                        <label className="block text-sm font-medium mb-1">
                            Address
                        </label>


                        <textarea
                            value={
                                address
                            }

                            onChange={e =>
                                setAddress(
                                    e.target.value
                                )
                            }

                            rows={2}

                            className="w-full border rounded-lg px-3 py-2 resize-none"

                            placeholder="Address"
                        />

                    </div>


                    {/* ================================================= */}
                    {/* Milk */}
                    {/* ================================================= */}

                    <div>

                        <label className="block text-sm font-medium mb-1">
                            Milk
                        </label>


                        <input
                            value={
                                milk
                            }

                            onChange={e =>
                                setMilk(
                                    e.target.value
                                )
                            }

                            className="w-full border rounded-lg px-3 py-2"

                            placeholder="Example: 1 L HLB"
                        />

                    </div>


                    {/* ================================================= */}
                    {/* Other Products */}
                    {/* ================================================= */}

                    <div>

                        <label className="block text-sm font-medium mb-1">
                            Other Products
                        </label>


                        <input
                            value={
                                otherProducts
                            }

                            onChange={e =>
                                setOtherProducts(
                                    e.target.value
                                )
                            }

                            className="w-full border rounded-lg px-3 py-2"

                            placeholder="Example: 2 Curd"
                        />

                    </div>


                    {/* ================================================= */}
                    {/* Remarks */}
                    {/* ================================================= */}

                    <div>

                        <label className="block text-sm font-medium mb-1">
                            Remarks
                        </label>


                        <textarea
                            value={
                                remarks
                            }

                            onChange={e =>
                                setRemarks(
                                    e.target.value
                                )
                            }

                            rows={3}

                            className="w-full border rounded-lg px-3 py-2 resize-none"

                            placeholder="Example: Collect all empty bottles"
                        />

                    </div>

                </div>


                {/* ================================================= */}
                {/* Footer */}
                {/* ================================================= */}

                <div className="flex justify-end gap-2 mt-5">

                    <button
                        onClick={onClose}
                        className="px-4 py-2 border rounded-lg"
                    >
                        Cancel
                    </button>


                    <button
                        onClick={
                            handleAdd
                        }

                        className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                    >
                        Add Instruction
                    </button>

                </div>

            </div>

        </div>

    );
}