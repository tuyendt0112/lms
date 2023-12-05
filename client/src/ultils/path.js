const path = {

    // Public Route 
    PUBLIC: '/',
    HOME: '',
    ALL: '*',
    LOGIN: 'login',
    PITCHES: ':category',
    BLOGS: 'blogs',
    OUR_SERVICE: 'services',
    FAQ: 'faqs',
    DETAIL_PITCH__CATEGORY__PID__TITLE: ':category/:pid/:title',
    FINAL_REGISTER: 'finalregister/:status',
    RESET_PASSWORD: 'reset-password/:token',

    // Admin Route
    ADMIN: 'admin',
    DASHBOARD: 'dashboard',
    MANAGE_USER: 'manage-user',
    MANAGE_PITCH: 'manage-pitch',
    MANAGE_ORDER: 'manage-order',
    CREATE_PITCH: 'create-pitch',

    // Member Route
    MEMBER: 'member',
    PERSONAL: 'personal',
    HISTORY: 'buy-history',
    WISHLIST: 'wishlist',
}
export default path