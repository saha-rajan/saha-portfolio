
// Only the live site is tracked: localhost, LAN/IP addresses and Vercel preview links are not
export const isLiveSite = () => {
  if (typeof window === "undefined") return false;
  const host = window.location.hostname;
  return host === "saharajan.me" || host === "www.saharajan.me";
};

export const isAnalyticsEnabled = () => {
  if (!isLiveSite()) return false;
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
