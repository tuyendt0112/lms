import axios from '../axios'

export const apiGetBrands = () => axios({
    url: '/brand/',
    method: 'get',
})

// export const apiCreatePitch = (data) => axios({
//     url: '/pitch/',
//     method: 'post',
//     data
// })