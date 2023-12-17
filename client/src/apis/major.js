import axios from "../axios";

export const apiCreateMajor = (data) => axios({
    url: "/major/",
    method: "post",
    data
});

export const apiGetAllMajor = (params) =>
    axios({
        url: "/major/all/",
        method: "get",
        params,
    });