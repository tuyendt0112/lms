import axios from '../axios'

export const apiCreateSchoolYear = (data) => axios({
    url: '/schoolyear/',
    method: 'post',
    data
})

export const apiGetSchoolYears = (params) => axios({
    url: '/schoolyear/',
    method: 'get',
    params
})