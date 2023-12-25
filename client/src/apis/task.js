import axios from "../axios";
export const apiCreateTask = (data) => axios({
    url: "/task/",
    method: "post",
    data,
});

export const apiGetTasks = (params) => axios({
    url: '/task/',
    method: 'get',
    params
})

export const apiGetTask = (tid) => axios({
    url: '/task/' + tid,
    method: 'get',
})

export const apiDeleteTask = (tid) => axios({
    url: '/task/' + tid,
    method: 'delete',
})

export const apiUpdateTask = (data, tid) => axios({
    url: '/task/' + tid,
    method: 'put',
    data
})