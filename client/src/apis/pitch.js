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