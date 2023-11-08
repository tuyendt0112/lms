import axios from '../axios'

export const apiGetPitches = (params) => axios({
    url: '/pitch/',
    method: 'get',
    params
})