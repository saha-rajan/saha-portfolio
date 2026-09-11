
export const isAnalyticsEnabled = () => {
  if (typeof window === "undefined") return false;
  if (window.location.hostname === "localhost") return false;
  if (localStorage.getItem("ignore_analytics") === "true") return false;
  return true;
};

export const trackEvent = (eventName: string, eventParams?: Record<string, any>) => {
  if (!isAnalyticsEnabled()) {
    console.log(`[Analytics Disabled] ${eventName}`, eventParams);
    return;
  }
  
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", eventName, eventParams);
  } else {
    console.warn(`Analytics not loaded. Event: ${eventName}`, eventParams);
  }
};
