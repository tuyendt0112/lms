const path = {
  // Public Route
  PUBLIC: "/",
  HOME: "",
  ALL: "*",
  LOGIN: "login",
  BLOGS: "blogs",
  PITCHES: "pitches",
  OUR_SERVICE: "services",
  FAQ: "faqs",
  DETAIL_ORDER: "my-order",
  CHECKOUT: "checkout",
  PITCHES__CATEGORY: ":category",
  FINAL_REGISTER: "finalregister/:status",
  RESET_PASSWORD: "reset-password/:token",
  DETAIL_PITCH__CATEGORY__BRAND__PITCHID__TITLE: ":category/:brand/:pid/:title",
  CATEGORY__BRAND: ":category/:brand",

  // Admin Route
  ADMIN: "admin",
  DASHBOARD: "dashboard",

  CREATE_USER: "create-user",
  MANAGE_USER: "manage-user",

  CREATE_TOPIC: "create-topic",
  MANAGE_TOPIC: "manage-topic",

  CREATE_MAJOR: "create-major",
  MANAGE_MAJOR: "manage-major",

  CREATE_DEPARTMENT: "create-department",
  MANAGE_DEPARTMENT: "manage-department",

  // Member Route
  MEMBER: "member",
  PERSONAL: "personal",
  HISTORY: "buy-history",
  WISHLIST: "wishlist",

  // PitchOwner Route
  PITCHOWNER: "pitchonwer",
  PERSONALOWN: "personal",
  DASHBOARD_PITCHOWN: "dashboard-owner",
  MANAGE_PITCHOWN: "manage-pitch",
  CREATE_PITCHOWN: "create-pitch",
  MANAGE_BRAND_PITCHOWNER: "manage-pitchowner-brands",
  CREATE_BRAND_PITCHOWNER: "create-pitchowner-brands",
  MANAGE_ORDER_PITCHOWNER: "manage-pitchowner-order",
};
export default path;
