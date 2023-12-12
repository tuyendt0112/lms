import axios from "../axios";

export const apiGetCategories = (params) =>
    axios({
        url: "/pitchcategory/",
        method: "get",
        params,
    });

export const apiCreateCategory = (data) =>
    axios({
        url: "/pitchcategory/",
        method: "post",
        data,
    });

export const apiUpdateCategory = (data, pcid) =>
    axios({
        url: "/pitchcategory/" + pcid,
        method: "put",
        data,
    });

export const apiDeleteCategory = (pcid) =>
    axios({
        url: "/pitchcategory/" + pcid,
        method: "delete",
    });
export const apiGetAllCategory = () =>
    axios({
        url: "/pitchcategory/all/",
        method: "get",
    });