export default function CommonDrawer({
    open,
    onClose,
    children,
    width = "max-w-3xl",
    closeOnOverlayClick = true
}) {

    if (!open) return null;

    return (
        <div
            className="fixed inset-0 z-1000 flex justify-end bg-black/40"
            onClick={() => {
                if (closeOnOverlayClick) {
                    onClose();
                }
            }}
        >
            <div
                className={`w-full ${width} bg-white h-full overflow-y-auto shadow-2xl`}
                onClick={(e) => e.stopPropagation()}
            >
                {children}
            </div>
        </div>
    );

}