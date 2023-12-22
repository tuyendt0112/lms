import axios from "../axios";
export const apiCreateTopic = (data) =>
  axios({
    url: "/topic/",
    method: "post",
    data,
  });

export const apiGetTopics = (params) => axios({
  url: '/topic/',
  method: 'get',
  params
})

export const apiDeleteTopic = (pid) => axios({
  url: '/topic/' + pid,
  method: 'delete',
})
