import axios from "../axios";

export const apiCreateMajor = (data) =>
  axios({
    url: "/major/",
    method: "post",
    data,
  });

export const apiGetAllMajor = (params) =>
  axios({
    url: "/major/all/",
    method: "get",
    params,
  });

export const apiDeleteMajor = (mid) =>
  axios({
    url: "/major/" + mid,
    method: "delete",
  });
export const apiUpdateMajor = (data) =>
  axios({
    url: "/major",
    method: "put",
    data,
  });
