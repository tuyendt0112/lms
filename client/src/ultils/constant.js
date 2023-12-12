import path from "./path"
import icons from "./icons"

export const navigation = [
    {
        id: 1,
        value: 'HOME',
        path: `/${path.HOME}`
    },
    {
        id: 2,
        value: 'PITCHES',
        path: `/${path.PITCHES}`
    },
    // {
    //     id: 3,
    //     value: 'BLOGS',
    //     path: `/${path.BLOGS}`
    // },
    // {
    //     id: 4,
    //     value: 'OUR SERVICES',
    //     path: `/${path.OUR_SERVICE}`
    // },
    {
        id: 3,
        value: 'FAQs',
        path: `/${path.FAQ}`
    }
]

const {
    FaShieldAlt,
    FaCar,
    AiOutlineSafety,
    FaWifi,
    IoFastFood,
    // AiFillEye,
    BsFillTelephoneFill,
} = icons;
const { BsReplyFill, BsShieldShaded, FaTty, AiFillGift } = icons
export const pitchExtraInformation = [
    {
        id: '1',
        title: 'Guarantee',
        sub: 'Quality Checked',
        icon: <BsShieldShaded />
    },
    {
        id: '2',
        title: 'Consultancy',
        sub: 'Online 24/7',
        icon: <FaTty />
    },
    {
        id: '3',
        title: 'Free Return Money',
        sub: 'Within 24 hours',
        icon: <BsReplyFill />
    },
    {
        id: '4',
        title: 'Special Deal',
        sub: 'Deals Everyday',
        icon: <AiFillGift />
    }
]

export const pitchInforTabs = [
    {
        id: 1,
        name: "DESCRIPTION",
        content: [
            "Chào mừng đến với Sân - điểm đến lý tưởng cho những người yêu thể thao và đam mê bóng đá! Tọa lạc tại trung tâm thành phố, sân bóng của chúng tôi không chỉ là nơi luyện tập hoàn hảo mà còn là điểm hội tụ của cộng đồng đam mê bóng đá.",
            "🌿 Không gian Xanh Mát: Sân Bóng Xanh tự hào là một oasis xanh giữa thành phố ồn ào. Với thảm cỏ mềm mại và cây xanh bao quanh, không khí tại đây luôn thoải mái và tạo điều kiện lý tưởng cho các trận đấu sôi động.",
            "🏆 Sân đa năng cho Mọi Đội Ngũ: Cho dù bạn là một đội bóng chuyên nghiệp, đội học sinh, hay đơn giản chỉ là nhóm bạn bè muốn thư giãn, Sân Bóng Xanh có sân đa dạng kích thước phù hợp với mọi nhu cầu.",
            "🎉 Sự Kiện và Giải Đấu: Chúng tôi tổ chức định kỳ các sự kiện và giải đấu, tạo cơ hội cho cộng đồng bóng đá gặp gỡ, cạnh tranh và tận hưởng niềm vui của môn thể thao đầy sôi động.",
            "Hãy đến và trải nghiệm Sân Bóng - nơi bạn có thể đắm chìm trong niềm đam mê bóng đá, tận hưởng không gian xanh mát và giao lưu với những người yêu thể thao khác. Chúng tôi cam kết mang đến cho bạn trải nghiệm bóng đá đáng nhớ! ⚽🌟",
        ],
    },
    {
        id: 2,
        name: "FACILITIES",
        content: [
            "Chào mừng bạn đến với Sân , nơi đặt trích tâm lý tưởng cho mọi đội bóng và người yêu thể thao! Cơ sở vật chất tại đây đáp ứng mọi tiêu chuẩn và đảm bảo trải nghiệm tuyệt vời:",
            "🌱 Thảm Cỏ Mềm Mại: Sân Bóng Xanh tự hào sở hữu thảm cỏ mềm mại, tạo nên bề mặt chơi lý tưởng cho mọi trận đấu. Đây không chỉ là nơi thi đấu, mà còn là không gian xanh mát để đội bóng và người hâm mộ tận hưởng.",
            "💡 Đèn Chiếu Sáng Hiện Đại: Đèn chiếu sáng mạnh mẽ tạo điều kiện chơi linh hoạt vào cả ban ngày và ban đêm. Trận đấu sau hoàng hôn trở nên hấp dẫn, và độ an toàn tăng lên với ánh sáng rõ ràng từ hệ thống chiếu sáng hiện đại.",
            "🏟️ Sân Đa Dạng Kích Thước: Có sân đa dạng kích thước để đáp ứng mọi nhu cầu, từ các đội chuyên nghiệp đến nhóm bạn bè đang tìm kiếm không gian giải trí và luyện tập.",
            "🍹 Quầy Dịch Vụ: Khu vực ngồi chờ thoải mái và quầy cung cấp đồ uống đảm bảo sự thuận tiện và thoải mái cho người xem và người tham gia.",
            "Nơi đây không chỉ là sân bóng, mà là trải nghiệm đỉnh cao của sự chuẩn bị chuyên nghiệp và sự thoải mái. Sân Bóng Xanh - Nơi những niềm đam mê bóng đá được thăng hoa! ⚽🌟",
        ],
    },
    {
        id: 3,
        name: "SERVICES",
        content: [
            "Chào mừng đến với Sân, nơi bạn không chỉ trải nghiệm niềm đam mê bóng đá mà còn được hưởng những dịch vụ tốt nhất:",
            "🌐 Đặt Sân Linh Hoạt: Với hệ thống đặt sân trực tuyến tiện lợi, bạn có thể dễ dàng chọn lựa thời gian phù hợp và đặt sân một cách nhanh chóng chỉ bằng vài cú click.",
            "🚀 Dịch Vụ Đồ Uống Thuận Tiện: Quầy dịch vụ với đa dạng thức uống giúp bạn tận hưởng trọn vẹn trận đấu hoặc buổi tập của mình. Thỏa sức thưởng thức cùng bạn bè và đồng đội.",
            "👥 Phòng Đợi Chất Lượng:Khu vực ngồi chờ thoải mái với không gian rộng rãi, giúp bạn và đồng đội tận hưởng sự thoải mái trước và sau mỗi trận đấu.",
            "🏆 Sự Kiện và Giải Đấu: Tham gia vào các sự kiện và giải đấu thú vị do chúng tôi tổ chức, để bạn có cơ hội gặp gỡ cộng đồng, thể hiện kỹ năng và tận hưởng không khí sôi động.",
            "💼 Dịch Vụ Tư Vấn và Hỗ Trợ: Đội ngũ nhân viên chuyên nghiệp và thân thiện sẵn sàng hỗ trợ bạn với mọi nhu cầu. Từ tư vấn đặt sân đến giải đáp mọi thắc mắc, chúng tôi luôn ở đây để giúp đỡ.",
            "Tại đây, chúng tôi cam kết mang đến cho bạn không chỉ là một trận đấu, mà còn là trải nghiệm hoàn hảo cùng những dịch vụ chất lượng. Hãy đến và cảm nhận sự khác biệt ngay hôm nay! ⚽🌟 .",
        ],
    },
    {
        id: 4,
        name: "PAYMENT",
        content: [
            "Thẻ Tín Dụng/Thẻ Ghi Nợ: ",
            "Ví Điện Tử (Digital Wallet): PayPal,MOMO ,Apple Pay, hoặc Google Pay.",
            "Chuyển Khoản Ngân Hàng",
            "Chuyển Khoản Trực Tiếp",
            "Thanh Toán Tiền Mặt:",
        ],
    },
];

export const sorts = [
    {
        id: 1,
        value: '-price',
        text: 'Price, high to low'
    },
    {
        id: 2,
        value: 'price',
        text: 'Price, low to high'
    },
    {
        id: 3,
        value: '-title',
        text: 'Alphabetically, Z-A'
    },
    {
        id: 4,
        value: 'title',
        text: 'Alphabetically, A-Z'
    },
    {
        id: 5,
        value: '-createdAt',
        text: 'Date, new to old'
    },
    {
        id: 6,
        value: 'createdAt',
        text: 'Date, old to new'
    },
]

const { MdSpaceDashboard, MdGroups, FaProductHunt, FaMoneyBill, MdPersonalInjury, MdHistory, AiFillLike, MdCategory, SiBrandfolder } = icons
export const adminSideBar = [
    {
        id: 1,
        type: 'SINGLE',
        text: 'Dashboard',
        path: `/${path.ADMIN}/${path.DASHBOARD}`,
        icon: <MdSpaceDashboard />
    },
    {
        id: 2,
        type: 'SINGLE',
        text: 'Manage users',
        path: `/${path.ADMIN}/${path.MANAGE_USER}`,
        icon: <MdGroups />
    },
    {
        id: 3,
        type: 'SINGLE',
        text: 'Manage Orders',
        path: `/${path.ADMIN}/${path.MANAGE_ORDER}`,
        icon: <FaMoneyBill />
    },
    {
        id: 4,
        type: 'PARENT',
        text: 'Pitches',
        icon: <FaProductHunt />,
        submenu: [
            {
                text: 'Create Pitch',
                path: `/${path.ADMIN}/${path.CREATE_PITCH}`
            },
            {
                text: 'Manage Pitches',
                path: `/${path.ADMIN}/${path.MANAGE_PITCH}`
            },
        ]
    },

    {
        id: 5,
        type: 'PARENT',
        text: 'Category',
        icon: <MdCategory />,
        submenu: [
            {
                text: 'Create Category',
                path: `/${path.ADMIN}/${path.CREATE_CATEGORY}`
            },
            {
                text: 'Manage Category',
                path: `/${path.ADMIN}/${path.MANAGE_CATEGORY}`
            },
        ]
    },
    {
        id: 6,
        type: 'PARENT',
        text: 'Brands',
        icon: <SiBrandfolder />,
        submenu: [
            {
                text: 'Create Brands',
                path: `/${path.ADMIN}/${path.CREATE_BRANDS}`
            },
            {
                text: 'Manage Brands',
                path: `/${path.ADMIN}/${path.MANAGE_BRANDS}`
            },
        ]
    },
]

export const pitchOwnerSideBar = [
    {
        id: 1,
        type: "PARENT",
        text: "Manage pitches",
        icon: <FaProductHunt />,
        submenu: [
            {
                text: "Create pitch",
                path: `/${path.PITCHOWNER}/${path.CREATE_PITCHOWN}`,
            },
            {
                text: "Manage pitches",
                path: `/${path.PITCHOWNER}/${path.MANAGE_PITCHOWN}`,
            },
        ],
    },
    {
        id: 2,
        type: "SINGLE",
        text: "Create Brand",
        path: `/${path.PITCHOWNER}/${path.CREATE_BRAND_PITCHOWNER}`,
        icon: <SiBrandfolder />,
    },
    {
        id: 3,
        type: "SINGLE",
        text: "Manage Orders",
        path: `/${path.PITCHOWNER}/${path.MANAGE_ORDER_PITCHOWNER}`,
        icon: <FaMoneyBill />,
    },
];
export const memberSidebar = [
    {
        id: 1,
        type: 'SINGLE',
        text: 'Personal',
        path: `/${path.MEMBER}/${path.PERSONAL}`,
        icon: <MdPersonalInjury />
    },
    {
        id: 2,
        type: 'SINGLE',
        text: 'Booking histories',
        path: `/${path.MEMBER}/${path.HISTORY}`,
        icon: <MdHistory />
    },
    {
        id: 3,
        type: 'SINGLE',
        text: 'Wishlist',
        path: `/${path.MEMBER}/${path.WISHLIST}`,
        icon: <AiFillLike />
    },
]
export const roles = [
    {
        code: 1,
        value: 'Admin'
    },
    {
        code: 2,
        value: 'PitchOwner'
    },
    {
        code: 3,
        value: 'User'
    },
]

export const blockStatus = [
    {
        code: 1,
        value: 'Block'
    },
    {
        code: 2,
        value: 'Active'
    },
]

export const voteOptions = [

    {
        id: 1,
        text: 'Terrible'
    },
    {
        id: 2,
        text: 'Bad'
    },
    {
        id: 3,
        text: 'Normal'
    },
    {
        id: 4,
        text: 'Good'
    },
    {
        id: 5,
        text: 'Perfect'
    },
]

export const shifts = [
    { value: 1, time: "6:00 AM - 7:00 AM", hour: 6 },
    { value: 2, time: "7:00 AM - 8:00 AM", hour: 7 },
    { value: 3, time: "8:00 AM - 9:00 AM", hour: 8 },
    { value: 4, time: "9:00 AM - 10:00 AM", hour: 9 },
    { value: 5, time: "10:00 AM - 11:00 AM", hour: 10 },
    { value: 6, time: "11:00 AM - 12:00 PM", hour: 11 },
    { value: 7, time: "12:00 PM - 1:00 PM", hour: 12 },
    { value: 8, time: "1:00 PM - 2:00 PM", hour: 13 },
    { value: 9, time: "2:00 PM - 3:00 PM", hour: 14 },
    { value: 10, time: "3:00 PM - 4:00 PM", hour: 15 },
    { value: 11, time: "4:00 PM - 5:00 PM", hour: 16 },
    { value: 12, time: "5:00 PM - 6:00 PM", hour: 17 },
    { value: 13, time: "6:00 PM - 7:00 PM", hour: 18 },
    { value: 14, time: "7:00 PM - 8:00 PM", hour: 19 },
    { value: 15, time: "8:00 PM - 9:00 PM", hour: 20 },
    { value: 16, time: "9:00 PM - 10:00 PM", hour: 21 },
    { value: 17, time: "10:00 PM - 11:00 PM", hour: 22 },
    { value: 18, time: "11:00 PM - 12:00 AM", hour: 23 },
];

export const PitchExtraInformation = [
    {
        id: 1,
        title: "Guarantee",
        sub: "Quality Checked",
        icon: <FaShieldAlt />,
    },
    {
        id: 2,
        title: "Standard parking lot",
        sub: "Ensure safety",
        icon: <FaCar />,
    },
    {
        id: 3,
        title: "Safety",
        sub: "Ensure security ",
        icon: <AiOutlineSafety />,
    },
    {
        id: 4,
        title: "Internet connection",
        sub: "Connect anywhere, anytime",
        icon: <FaWifi />,
    },
    {
        id: 5,
        title: "Food Store",
        sub: "Available Food and Drink",
        icon: <IoFastFood />,
    },

    {
        id: 6,
        title: "Hotline",
        sub: "Call anytime if you have questions",
        icon: <BsFillTelephoneFill />,
    },
];

export const locations = [
    "Quận 1",
    "Quận 2",
    "Quận 3",
    "Quận 4",
    "Quận 5",
    "Quận 6",
    "Quận 7",
    "Quận 8",
    "Quận 9",
    "Quận 10",
    "Quận 11",
    "Quận 12",
    "Thủ Đức",
    "Bình Tân",
    "Tân Bình",
    "Bình Chánh",
    // Thêm thông tin cho các quận/huyện khác ở Tp. Hồ Chí Minh
];