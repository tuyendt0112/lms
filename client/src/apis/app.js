import axios from '../axios'

export const apiGetCategories = () => axios({
    url: '/pitchcategory/',
    method: 'get'
})

