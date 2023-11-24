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
    {
        id: 3,
        value: 'BLOGS',
        path: `/${path.BLOGS}`
    },
    {
        id: 4,
        value: 'OUR SERVICES',
        path: `/${path.OUR_SERVICE}`
    },
    {
        id: 5,
        value: 'FAQs',
        path: `/${path.FAQ}`
    }
]

const { BsReplyFill, BsShieldShaded, FaTty, AiFillGift } = icons
export const pitchExtraInformation = [
    {
        id: '1',
        title: 'Guarantee',
        sub: 'Quality Checked',
        icon: <BsShieldShaded></BsShieldShaded>
    },
    {
        id: '2',
        title: 'Consultancy',
        sub: 'Online 24/7',
        icon: <FaTty></FaTty>
    },
    {
        id: '3',
        title: 'Free Return Money',
        sub: 'Within 24 hours',
        icon: <BsReplyFill></BsReplyFill>
    },
    {
        id: '4',
        title: 'Special Deal',
        sub: 'Deals Everyday',
        icon: <AiFillGift></AiFillGift>
    }
]

export const pitchInforTabs = [
    {
        id: 1,
        name: 'DESCRIPTION',
        content: `San bong da 5 7 11 day du tien ich phu hop voi hoc sinh sinh vien va moi lua tuoi`
    },
    {
        id: 2,
        name: 'FACILITIES',
        content: `Infrastructure at football stadiums plays an important role in creating a favorable and safe environment for players and fans. Modern football fields are often equipped with high-quality natural or artificial grass surfaces, helping to improve the playing experience and reduce the risk of injury.
        The lighting system is an important factor, especially for matches or training in the evening. Modern lighting and reasonable arrangement help create a safe and comfortable space, stimulating players' ability to compete.  
        Changing rooms and bathrooms are clean and comfortable, along with amenities such as air conditioning, helping players focus on the match without worrying about comfort. In addition, football stadiums often have break areas, restaurants or bars so players and fans can relax after each match.    
        Security and surveillance systems also play an important role in protecting assets and ensuring the safety of everyone participating in the event. All these elements together create a complete infrastructure that meets all the needs of the football community and creates an enjoyable space for everyone.
        `
    },
    {
        id: 3,
        name: 'SERVICES',
        content: `Services at the soccer field are not only a place for matches and practices, but also an ideal meeting place for the sports-loving community. The football field not only provides expanded space for sports activities but still pays attention to quality and comfort.
        On the soccer field, players can take advantage of turf advertising, modern lighting for evening play, and comfortable rest areas. In addition, additional services such as clean changing rooms, restaurants and bars in the courtyard area, along with a team of professional staff, all create a friendly and professional environment.
        Flexible field booking service, allowing teams and individuals to book fields by the hour, even through online applications, helping to save time and enhance the player's experience. From friendly matches to tournaments, the football field is not only a place to express football passion but also a great destination to enjoy joy and health from sports activities.
        `
    },
    {
        id: 4,
        name: 'PAYMENT',
        content: `Co nhieu hinh thuc thanh toan truc tuyen
        ZALOPAY
        MOMO
        BANKING
        `
    },
  
]
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
        text: 'Alphabetically, A-Z'
    },
    {
        id: 4,
        value: 'title',
        text: 'Alphabetically, Z-A'
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