import icons from "./icons"
const { AiOutlineStar, AiFillStar, FaStarHalfAlt, FaStar, FaRegStar } = icons

export const createSlug = string => string.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").split(' ').join('-')

export const formatMoney = number => Number(number?.toFixed(1)).toLocaleString()

export const renderStarFromNumber = (number, size) => {
    if (!Number(number)) return;

    const integerPart = Math.floor(number);
    const decimalPart = number - integerPart;

    const stars = [];

    for (let i = 0; i < 5; i++) {
        if (i < integerPart) {
            stars.push(<FaStar key={i} color="orange" size={size || 16} />);
        } else if (i === integerPart && decimalPart > 0) {
            // In ra ngôi sao có phần thập phân
            stars.push(<FaStarHalfAlt key={i} color="orange" size={size || 16} />);
        } else {
            stars.push(<FaRegStar key={i} color="orange" size={size || 16} />);
        }
    }

    return stars;
};

export const validate = (payload, setInvalidFields) => {
    let invalids = 0
    const formatPayload = Object.entries(payload)
    for (let arr of formatPayload) {
        if (arr[1].trim() === '') {
            invalids++
            setInvalidFields(prev => [...prev, { name: arr[0], mes: 'Require this field' }])
        }
    }
    for (let arr of formatPayload) {
        switch (arr[0]) {
            case 'email':
                const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
                if (!arr[1].match(regex)) {
                    invalids++
                    setInvalidFields(prev => [...prev, { name: arr[0], mes: 'Invalid email' }])
                }
                break;
            case 'password':
                if (arr[1].length < 6) {
                    invalids++
                    setInvalidFields(prev => [...prev, { name: arr[0], mes: 'Password minimum 6 characters' }])
                }
                break;
            default:
                break;
        }
    }
    return invalids
}

export const formatPrice = number => Math.round(number / 1000) * 1000

export const generateRange = (start, end) => {
    // start = 3, end = 6 ==> [3,4,5,6]
    // start = 2, end = 7 ==> [2,3,4,5,6,7]
    const length = end + 1 - start
    return Array.from({ length }, (_, index) => start + index)
}

export function getBase64(file) {
    if (!file) {
        return ''
    }
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

export const formattedCategory = (category) => category?.replace(/-/g, " ");

export const convertToTitleCase = (inputString) => {
    return inputString
        .replace("/", "") // Loại bỏ dấu /
        .split("-") // Tách chuỗi bởi dấu -
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // Viết hoa chữ cái đầu của mỗi từ
        .join(" "); // Nối lại thành một chuỗi
};

export function BoxWrapper({ children }) {
    return <div className="bg-white rounded-sm p-4 flex-1 border border-gray-200 flex items-center">{children}</div>
}

export const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    const RADIAN = Math.PI / 180
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5
    const x = cx + radius * Math.cos(-midAngle * RADIAN)
    const y = cy + radius * Math.sin(-midAngle * RADIAN)

    return (
        <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
            {`${(percent * 100).toFixed(0)}%`}
        </text>
    )
}