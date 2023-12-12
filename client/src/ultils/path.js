const path = {

    // Public Route 
    PUBLIC: '/',
    HOME: '',
    ALL: '*',
    LOGIN: 'login',
    BLOGS: 'blogs',
    PITCHES: 'pitches',
    OUR_SERVICE: 'services',
    FAQ: 'faqs',
    DETAIL_ORDER: "my-order",
    CHECKOUT: "checkout",
    PITCHES__CATEGORY: ':category',
    FINAL_REGISTER: 'finalregister/:status',
    RESET_PASSWORD: 'reset-password/:token',
    DETAIL_PITCH__CATEGORY__BRAND__PITCHID__TITLE: ":category/:brand/:pid/:title",
    CATEGORY__BRAND: ":category/:brand",

    // Admin Route
    ADMIN: 'admin',
    DASHBOARD: 'dashboard',
    MANAGE_USER: 'manage-user',
    MANAGE_PITCH: 'manage-pitch',
    MANAGE_ORDER: 'manage-order',
    CREATE_PITCH: 'create-pitch',
    MANAGE_CATEGORY: 'manage-category',
    CREATE_CATEGORY: 'create-category',
    MANAGE_BRANDS: 'manage-brands',
    CREATE_BRANDS: 'create-brands',

    // Member Route
    MEMBER: 'member',
    PERSONAL: 'personal',
    HISTORY: 'buy-history',
    WISHLIST: 'wishlist',

    // PitchOwner Route
    PITCHOWNER: 'pitchonwer',
    PERSONALOWN: 'personal',
    MANAGE_PITCHOWN: 'manage-pitch',
    CREATE_PITCHOWN: 'create-pitch',
    MANAGE_BRAND_PITCHOWNER: "manage-pitchowner-brands",
    CREATE_BRAND_PITCHOWNER: "create-pitchowner-brands",
    MANAGE_ORDER_PITCHOWNER: "manage-pitchowner-order",
}
export default path