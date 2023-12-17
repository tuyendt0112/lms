import axios from "../axios";

export const apiCreateDepartment = (data) => axios({
    url: "/department/",
    method: "post",
    data
});

export const apiGetDepartment = (params) => axios({
    url: "/department/",
    method: "get",
    params
});