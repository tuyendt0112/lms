import axios from "../axios";

export const apiCreateNotification = (data) => axios({
    url: "/notification/",
    method: "post",
    data,
});

export const apiGetAllNotification = (params) => axios({
    url: "/notification/",
    method: "get",
    params,
});

export const apiDeleteNotification = (nid) => axios({
    url: "/notification/" + nid,
    method: "delete",
});

export const apiUpdateNotification = (data, nid) => axios({
    url: "/notification/" + nid,
    method: "put",
    data,
});

