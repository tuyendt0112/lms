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

  CREATE_STUDENT: "create-student",
  MANAGE_STUDENT: "manage-student",

  CREATE_LECTURER: "create-lecturer",
  MANAGE_LECTURER: "manage-lecturer",

  CREATE_TOPIC: "create-topic",
  MANAGE_TOPIC: "manage-topic",

  CREATE_MAJOR: "create-major",
  MANAGE_MAJOR: "manage-major",

  CREATE_SCHOOLYEAR: "create-schoolyear",
  MANAGE_SCHOOLYEAR: "manage-schoolyear",

  CREATE_DEPARTMENT: "create-department",
  MANAGE_DEPARTMENT: "manage-department",

  CREATE_NOTIFICATION: "create-notification",
  MANAGE_NOTIFICATION: "manage-notification",
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
