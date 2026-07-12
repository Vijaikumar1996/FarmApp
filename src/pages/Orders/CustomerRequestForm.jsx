import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { X } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";

import AsyncTypeahead from "../../components/form/form-input/AsyncTypeahead";
import Button from "../../components/ui/button/Button";
import DateField from "../../components/form/form-input/DateField";
import FormGrid from "../../components/form/FormGrid";

import { loadCustomerOptions } from "../../utils/customerLoader";
import { getTomorrowDate } from "../../utils/commonUtils";

import { useCustomerRequestLookup } from "../../queries/useCustomerRequest";

import SubscriptionCard from "./SubscriptionCard";
import ActiveRequestCard from "./ActiveRequestCard";
import RequestEditorDrawer from "./RequestEditorDrawer";
import { customerRequestSchema } from "./customerRequestSchema";

export default function CustomerRequestForm({
  request,
  deliveryDate: initialDeliveryDate,
  onClose,
  readOnly = false,
}) {
  const isEdit = !!request;

  const tomorrowDate = getTomorrowDate();

  const { control, watch, reset } = useForm({
    defaultValues: {
      customerId: "",
      deliveryDate: tomorrowDate,
    },
    resolver: zodResolver(customerRequestSchema),
  });

  useEffect(() => {
    if (request) {
      reset({
        customerId: request.customerId,
        deliveryDate: initialDeliveryDate ?? tomorrowDate,
      });
    }
  }, [request, reset]);

  const customerId = watch("customerId");
  const deliveryDate = watch("deliveryDate");

  console.log("customerId", customerId);
  console.log("deliveryDate", deliveryDate);

  const { data: lookup, isLoading } = useCustomerRequestLookup(
    customerId,
    deliveryDate
  );

  const [drawer, setDrawer] = useState({
    open: false,
    mode: null,
    subscription: null,
    request: null,
  });

  return (
    <div className="rounded-2xl border bg-white p-6">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-semibold">
          {readOnly ? "View Customer Request" : "Customer Request"}
        </h2>

        <button onClick={onClose}>
          <X />
        </button>
      </div>

      <FormGrid cols={2} gap={5}>
        <DateField
          name="deliveryDate"
          control={control}
          label="Delivery Date"
          required
          disabled={isEdit || readOnly}
        />

        <AsyncTypeahead
          name="customerId"
          control={control}
          label="Customer"
          required
          loadOptions={loadCustomerOptions}
          selectedOption={
            request
              ? {
                value: request.customerId,
                label: request.customerName,
              }
              : null
          }
          isDisabled={isEdit || readOnly}
        />
      </FormGrid>

      {customerId && isLoading && (
        <div className="mt-8">
          Loading...
        </div>
      )}

      {lookup && (
        <>
          <div className="mt-8">
            <h3 className="mb-3 font-semibold">
              Current Subscriptions
            </h3>

            <div className="space-y-3">
              {lookup.subscriptions.length === 0 && (
                <div className="rounded-lg border border-dashed p-4 text-center text-gray-500">
                  No active subscriptions.
                </div>
              )}

              {lookup.subscriptions.map((subscription) => (
                <SubscriptionCard
                  key={subscription.subscriptionId}
                  subscription={subscription}
                  readOnly={readOnly}
                  onReplace={(item) =>
                    setDrawer({
                      open: true,
                      mode: "REPLACE",
                      subscription: item,
                      request: null,
                    })
                  }
                  onPause={(item) =>
                    setDrawer({
                      open: true,
                      mode: "PAUSE",
                      subscription: item,
                      request: null,
                    })
                  }
                />
              ))}
            </div>
          </div>

          <div className="mt-8">
            <h3 className="mb-3 font-semibold">
              Active Requests
            </h3>

            <div className="space-y-3">
              {lookup.requests.length === 0 && (
                <div className="rounded-lg border border-dashed p-4 text-center text-gray-500">
                  No active requests.
                </div>
              )}

              {lookup.requests.map((item) => (
                <ActiveRequestCard
                  key={item.id}
                  request={item}
                  readOnly={readOnly}
                  onEdit={(requestItem) =>
                    setDrawer({
                      open: true,
                      mode: requestItem.requestAction,
                      subscription: requestItem.subscriptionId
                        ? {
                          subscriptionId: requestItem.subscriptionId,
                        }
                        : null,
                      request: requestItem,
                    })
                  }
                />
              ))}
            </div>
          </div>

          {!readOnly && (
            <div className="mt-6">
              <Button
                onClick={() =>
                  setDrawer({
                    open: true,
                    mode: "ADD",
                    subscription: null,
                    request: null,
                  })
                }
              >
                + Add Product
              </Button>
            </div>
          )}

          {!readOnly && (
            <RequestEditorDrawer
              open={drawer.open}
              mode={drawer.mode}
              customerId={customerId}
              subscription={drawer.subscription}
              request={drawer.request}
              onClose={() =>
                setDrawer({
                  open: false,
                  mode: null,
                  subscription: null,
                  request: null,
                })
              }
            />
          )}
        </>
      )}
    </div>
  );
}