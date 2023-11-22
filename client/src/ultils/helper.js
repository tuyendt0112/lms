import { number } from "yup"
import icons from "./icons"
const { AiOutlineStar, AiFillStar } = icons

export const createSlug = string => string.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").split(' ').join('-')
export const formatMoney = number => Number(number?.toFixed(1)).toLocaleString()
export const renderStarFromNumber = (number, size) => {
    if (!Number(number)) return
    // 4 => [1,1,1,1,0]
    // 2 =>[1,1,0,0,0]
    const stars = []
    for (let i = 0; i < +number; i++) stars.push(<AiFillStar color="orange" size={size || 16}></AiFillStar>)
    for (let i = 5; i > +number; i--) stars.push(<AiOutlineStar color="orange" size={size || 16}></AiOutlineStar>)
    return stars

}

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