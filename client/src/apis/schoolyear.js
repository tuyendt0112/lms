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

export const apiUpdateSchoolYears = (data, sid) => axios({
    url: '/schoolyear/' + sid,
    method: 'put',
    data
})

export const apiDeleteSchoolYears = (sid) => axios({
    url: '/schoolyear/' + sid,
    method: 'delete',
})