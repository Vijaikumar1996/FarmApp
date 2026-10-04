import farmLogo from "/images/logo/full-logo.png";
import luxuryFarmLogo from "/images/logo/luxury-logo.png";

export default function BillHeader({
    farm,
    customer
}) {

    // ============================================
    // BILLING MONTH
    // ============================================

    const billingMonth = new Date(
        customer.billingMonth
    ).toLocaleDateString(
        "en-IN",
        {
            month: "long",
            year: "numeric"
        }
    );


    // ============================================
    // GENERATED DATE
    // ============================================

    const generatedDate =
        new Date().toLocaleDateString("en-IN");


    // ============================================
    // CUSTOMER TYPE
    // ============================================

    const isLuxury =
        farm?.customerType?.toUpperCase() === "LUXURY";


    // ============================================
    // SELECT LOGO
    // ============================================

    const selectedFarmLogo =
        isLuxury
            ? luxuryFarmLogo
            : farmLogo;


    return (
        <>
            {/* =====================================================
                FARM HEADER
            ===================================================== */}

            <div className="border-b-2 border-green-700 mb-3">

                {/* =================================================
                    NORMAL CUSTOMER HEADER
                ================================================= */}

                {!isLuxury && (

                    <div className="flex justify-between items-center">

                        {/* =================================
                            LEFT - FARM BRANDING
                        ================================= */}

                        <div className="flex items-center gap-3">

                            {/* Farm Logo */}

                            <div className="h-40 rounded-full flex items-center justify-center overflow-visible">

                                <img
                                    src={farmLogo}
                                    alt={farm?.farmName || "Farm Logo"}
                                    className="h-40 rounded-full object-contain"
                                />

                            </div>


                            {/* Farm Details */}

                            <div>

                                <h1 className="text-2xl font-bold text-green-700">
                                    {farm?.farmName}
                                </h1>

                                <p className="text-sm text-gray-600 mt-1">
                                    {farm?.farmQuote}
                                </p>

                                <p className="text-xs text-gray-500 mt-1">
                                    Mobile : {farm?.mobileNo}
                                </p>

                            </div>

                        </div>


                        {/* =================================
                            RIGHT - BILL INFORMATION
                        ================================= */}

                        <div className="text-right">

                            <h2 className="text-2xl font-bold text-gray-800 uppercase">
                                Summary Bill
                            </h2>

                            <p className="text-sm text-gray-600 mt-2">
                                {billingMonth}
                            </p>

                            <p className="text-xs text-gray-500 mt-1">
                                Generated : {generatedDate}
                            </p>

                        </div>

                    </div>

                )}


                {/* =================================================
                    LUXURY CUSTOMER HEADER
                ================================================= */}

                {isLuxury && (

                    <div className="grid grid-cols-3 items-center min-h-[85px]">

                        {/* =================================
                            LEFT - FARM DETAILS
                        ================================= */}

                        <div className="text-left">

                            <h1 className="text-xl font-bold text-green-700">
                                {farm?.farmName}
                            </h1>

                            <p className="text-xs text-gray-600 mt-1">
                                {farm?.farmQuote}
                            </p>

                            <p className="text-[10px] text-gray-500 mt-1">
                                Mobile : {farm?.mobileNo}
                            </p>

                        </div>


                        {/* =================================
                            CENTER - LUXURY FARM LOGO
                        ================================= */}

                        <div className="flex justify-center items-center">

                            <img
                                src={luxuryFarmLogo}
                                alt={farm?.farmName || "Luxury Farm Logo"}
                                className="h-20 w-auto object-contain scale-x-[1.6]"
                            />

                        </div>


                        {/* =================================
                            RIGHT - BILL INFORMATION
                        ================================= */}

                        <div className="text-right">

                            <h2 className="text-xl font-bold text-gray-800 uppercase whitespace-nowrap">
                                Summary Bill
                            </h2>

                            <p className="text-xs text-gray-600 mt-1">
                                {billingMonth}
                            </p>

                            <p className="text-[10px] text-gray-500 mt-1">
                                Generated : {generatedDate}
                            </p>

                        </div>

                    </div>

                )}

            </div>


            {/* =====================================================
                CUSTOMER INFORMATION
                COMMON FOR NORMAL + LUXURY
            ===================================================== */}

            <div className="mb-4 border rounded-lg bg-gray-50 px-4 py-3">

                <p className="text-md">

                    <span className="font-semibold">
                        Customer :
                    </span>

                    {" "}

                    {customer?.customerName}

                    {" | "}

                    {customer?.mobileNo}

                    {" | "}

                    {customer?.areaName}

                </p>

            </div>
        </>
    );
}