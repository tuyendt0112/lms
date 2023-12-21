import axios from "../axios";

export const apiCreateDepartment = (data) =>
  axios({
    url: "/department/",
    method: "post",
    data,
  });

export const apiGetDepartment = (params) =>
  axios({
    url: "/department/",
    method: "get",
    params,
  });
export const apiGetAllDepartment = (params) =>
  axios({
    url: "/department/all/",
    method: "get",
    params,
  });

export const apiDeleteDepartment = (did) =>
  axios({
    url: "/department/" + did,
    method: "delete",
  });
export const apiUpdateDepartment = (data) =>
  axios({
    url: "/department",
    method: "put",
    data,
  });
export const apiGetMajorByDepartment = (title) =>
  axios({
    url: "/department/" + title,
    method: "get",
  });
