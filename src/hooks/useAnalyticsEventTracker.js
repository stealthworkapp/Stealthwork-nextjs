import ReactGA from "react-ga4";

// const useAnalyticsEventTracker = (category = "Navigation category") => {
//   const eventTracker = (action = "test action", label = "test label") => {
//     ReactGA.event({ category, action, label });
//   };
//   return eventTracker;
// };

// export default useAnalyticsEventTracker;
const useAnalyticsEventTracker = (platform) => {
  ReactGA.event({
    category: "Navigation",
    action: "Click",
    label: platform,
  });
};

export default useAnalyticsEventTracker;
