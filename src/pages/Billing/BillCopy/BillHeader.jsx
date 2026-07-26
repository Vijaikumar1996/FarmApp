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
        });

    const generatedDate =
        new Date().toLocaleDateString("en-IN");

    return (

        <>

            {/* Farm Header */}

            <div className="border-b-2 border-green-700 pb-3">

                <div className="flex justify-between items-start">

                    <div>

                        <h1 className="text-3xl font-bold text-green-700">

                            {farm.farmName}

                        </h1>

                        <p className="text-sm text-gray-600 mt-1">

                            Fresh Farm Products

                        </p>

                        <p className="text-xs text-gray-500">

                            Mobile : {farm.mobileNo}

                        </p>

                    </div>

                    <div className="text-right">

                        <h2 className="text-xl font-bold uppercase">

                            Summary Bill

                        </h2>

                        <p className="text-sm text-gray-600 mt-1">

                            {billingMonth}

                            {" | "}

                            Generated : {generatedDate}

                        </p>

                    </div>

                </div>

            </div>

            {/* Customer Information */}

            <div className="mt-3 mb-4 border rounded-lg bg-gray-50 px-4 py-3">

                <p className="text-md">

                    <span className="font-semibold">

                        Customer :

                    </span>

                    {" "}

                    {customer.customerName}

                    {" | "}

                    {customer.mobileNo}

                    {" | "}

                    {customer.deliveryLocation}

                    {" | "}

                    {customer.areaName}

                </p>

            </div>

        </>

    );

}