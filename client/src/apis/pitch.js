import axios from '../axios'

export const apiGetPitches = (params) => axios({
    url: '/pitch/',
    method: 'get',
    params
})

export const apiGetPitch = (pid) => axios({
    url: '/pitch/' + pid,
    method: 'get',
})

export const apiRatings = (data) => axios({
    url: '/pitch/ratings',
    method: 'put',
    data
})

export const apiCreatePitch = (data) => axios({
    url: '/pitch/',
    method: 'post',
    data
})

export const apiUpdatePitch = (data, pid) => axios({
    url: '/pitch/' + pid,
    method: 'put',
    data
})

export const apiDeletePitch = (pid) => axios({
    url: '/pitch/' + pid,
    method: 'delete',
})

export const apiGetOrder = (params) => axios({
    url: '/pitch/',
    method: 'get',
    params
})