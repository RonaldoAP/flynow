/* Campaign-scoped adaptation of backend/assets/js/checkout-params.js. */
(function () {
  "use strict";

  const storageKey = "divessenceBlackFridayCheckoutParams";
  const accepted = [
    "src", "utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content",
    "fbclid", "gclid", "full_name", "email", "phone", "rtkcid", "clickid"
  ];
  const incoming = new URLSearchParams(location.search);
  let saved = {};
  try {
    const value = JSON.parse(localStorage.getItem(storageKey));
    if (value && typeof value === "object" && !Array.isArray(value)) saved = value;
  } catch (_) {}

  // A new attribution source begins a fresh visit instead of mixing old leads.
  if (["src", "utm_source", "utm_campaign", "rtkcid", "clickid"].some(key => incoming.has(key))) saved = {};
  const captured = {};
  accepted.forEach(key => {
    const value = incoming.has(key) ? incoming.get(key) : saved[key];
    if (typeof value === "string" && value.trim()) captured[key] = value.trim();
  });
  if (!captured.src) captured.src = "blackfriday";
  try {
    localStorage.setItem(storageKey, JSON.stringify(captured));
  } catch (_) {}

  function buildCheckoutUrl(productLink, previousLink, offerKey) {
    const url = new URL(productLink, location.href);
    // Preserve product-specific parameters such as PayT split=12.
    if (previousLink) {
      new URL(previousLink, location.href).searchParams.forEach((value,key) => {
        if (!url.searchParams.has(key)) url.searchParams.set(key,value);
      });
    }
    Object.entries(captured).forEach(([key,value]) => url.searchParams.set(key,value));
    incoming.forEach((value,key) => url.searchParams.set(key,value));
    const clickid = incoming.get("clickid") || incoming.get("rtkcid") || captured.clickid || captured.rtkcid;
    if (clickid) url.searchParams.set("clickid", clickid);
    const kit = {one:"k1", three:"k3", six:"k6"}[offerKey];
    // Keep inbound utm_content for ad attribution and identify the kit separately.
    if (kit) {
      url.searchParams.set("kit",kit);
      if (!captured.utm_content && !incoming.has("utm_content")) url.searchParams.set("utm_content",kit);
    }
    return url.href;
  }

  window.CheckoutParams = {
    buildCheckoutUrl,
    getSavedParams: () => ({...captured})
  };
})();
