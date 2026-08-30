import farmLogo from "/images/logo/full-logo.png";
export default function BillHeader({
    farm,
    customer
}) {

    const billingMonth = new Date(
        customer.billingMonth
    ).toLocaleDateString(
        "en-IN",
        {
            month: "long",
            year: "numeric"
        }
    );

    const generatedDate =
        new Date().toLocaleDateString("en-IN");

    return (
        <>
            {/* Farm Header */}

            <div className="border-b-2 border-green-700 mb-3">

                <div className="flex justify-between items-center">

                    {/* Left - Farm Branding */}

                    <div className="flex items-center gap-3">

                        {/* Farm Logo */}

                        <div className="h-40 rounded-full flex items-center justify-center overflow-visible">
                            <img
                                src={farmLogo}
                                alt={farm.farmName}
                                className="h-40 rounded-full"
                            />
                        </div>

                        {/* Farm Details */}

                        <div>

                            <h1 className="text-2xl font-bold text-green-700">
                                {farm.farmName}
                            </h1>

                            <p className="text-sm text-gray-600 mt-1">
                                {farm.farmQuote}
                            </p>

                            <p className="text-xs text-gray-500 mt-1">
                                Mobile : {farm.mobileNo}
                            </p>

                        </div>

                    </div>


                    {/* Right - Bill Information */}

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

            </div>


            {/* Customer Information */}

            <div className="mb-4 border rounded-lg bg-gray-50 px-4 py-3">

                <p className="text-md">

                    <span className="font-semibold">
                        Customer :
                    </span>

                    {" "}

                    {customer.customerName}

                    {" | "}

                    {customer.mobileNo}

                    {" | "}

                    {customer.areaName}

                </p>

            </div>
        </>
    );
}