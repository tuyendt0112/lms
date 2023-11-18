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