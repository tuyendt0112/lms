import axios from "../axios";
export const apiCreateTopic = (data) =>
  axios({
    url: "/topic/",
    method: "post",
    data,
  });
