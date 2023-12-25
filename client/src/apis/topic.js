import axios from "../axios";

export const apiCreateTopic = (data) => axios({
  url: "/topic/",
  method: "post",
  data,
});

export const apiGetTopics = (params) => axios({
  url: '/topic/',
  method: 'get',
  params
})

export const apiGetTopic = (pid) => axios({
  url: '/topic/' + pid,
  method: 'get',
})

export const apiDeleteTopic = (pid) => axios({
  url: '/topic/' + pid,
  method: 'delete',
})

export const apiUpdateTopic = (data, pid) => axios({
  url: '/topic/' + pid,
  method: 'put',
  data
})

export const apiRegisterTopic = (data, pid) => axios({
  url: '/topic/register/' + pid,
  method: 'put',
  data
})

export const apiUndoRegisterTopic = (data, pid) => axios({
  url: '/topic/undoregister/' + pid,
  method: 'put',
  data
})