import { getItemInLocalStorage } from "./localStorage";

export const BLOCK_PRICING_FEATURE = "amenity_block_pricing";
export const BLOCK_PRICING_TYPE = "base_plus_extra";

export const isBlockPricingFeatureOn = () => {
  const features = getItemInLocalStorage("FEATURES");
  return (
    Array.isArray(features) &&
    features.some((feature) => feature?.feature_name === BLOCK_PRICING_FEATURE)
  );
};

export const isAmenityAdmin = () =>
  ["pms_admin", "pms_organization_admin"].includes(getItemInLocalStorage("USERTYPE"));

export const emptyBlockPricing = {
  pricing_type: "",
  base_amount: "",
  base_duration_minutes: "",
  extra_amount: "",
  extra_duration_minutes: "",
};

export const blockPricingFromFacility = (facility) => ({
  pricing_type: facility?.pricing_type || "",
  base_amount: facility?.base_amount ?? "",
  base_duration_minutes: facility?.base_duration_minutes ?? "",
  extra_amount: facility?.extra_amount ?? "",
  extra_duration_minutes: facility?.extra_duration_minutes ?? "",
});

export const validateBlockPricing = (data) => {
  if (data.pricing_type !== BLOCK_PRICING_TYPE) return null;
  if (!(Number(data.base_amount) > 0)) return "Base amount must be greater than 0";
  if (!(Number(data.base_duration_minutes) > 0)) return "Base duration must be greater than 0";
  if (Number(data.extra_amount) > 0 && !(Number(data.extra_duration_minutes) > 0)) {
    return "Extra time duration must be greater than 0";
  }
  return null;
};

export const appendBlockPricing = (formData, data) => {
  const isBlock = data.pricing_type === BLOCK_PRICING_TYPE;
  formData.append("amenity[pricing_type]", isBlock ? BLOCK_PRICING_TYPE : "");
  formData.append("amenity[base_amount]", isBlock ? data.base_amount || "" : "");
  formData.append("amenity[base_duration_minutes]", isBlock ? data.base_duration_minutes || "" : "");
  formData.append("amenity[extra_amount]", isBlock ? data.extra_amount || "" : "");
  formData.append("amenity[extra_duration_minutes]", isBlock ? data.extra_duration_minutes || "" : "");
};

export const formatMinutes = (minutes) => {
  const total = Number(minutes) || 0;
  const hours = Math.floor(total / 60);
  const mins = total % 60;
  if (!hours) return `${mins} min`;
  return mins ? `${hours} hr ${mins} min` : `${hours} hr`;
};

export const rupees = (value) =>
  `₹${Number(value || 0).toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;
