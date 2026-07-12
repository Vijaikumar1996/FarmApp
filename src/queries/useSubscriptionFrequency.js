import { useQuery } from "@tanstack/react-query";
import { getSubscriptionFrequencyDropdown } from "../services/subscriptionFrequencyService";

export function useSubscriptionFrequencyDropdown() {
  return useQuery({
    queryKey: ["subscription-frequency-dropdown"],

    queryFn: getSubscriptionFrequencyDropdown,
  });
}
