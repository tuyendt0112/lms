import axios from "../axios";

export const apiGetBrands = () =>
    axios({
        url: "/brand/",
        method: "get",
    });
// export const apiGetBrandByOwner = (uid) =>
//   axios({
//     url: "/brand/" + uid,
//     method: "get",
//   });
// export const apiCreatePitch = (data) => axios({
//     url: '/pitch/',
//     method: 'post',
//     data
// })
export const apiCreateBrand = (data) =>
    axios({
        url: "/brand/",
        method: "post",
        data,
    });
export const apiGetBrandByOwner = (userId) =>
    axios({
        url: "/brand/" + userId,
        method: "get",
    });
export const apiGetBrand = () =>
    axios({
        url: "/brand/",
        method: "get",
    });
export const apiGetBrandByTitle = (params) =>
    axios({
        url: "/brand/title/" + params,
        method: "get",
    });
export const apiRatingsBrand = (data) =>
    axios({
        url: "/brand/ratings",
        method: "put",
        data,
    });
export const apiGetAllBrands = (params) =>
    axios({
        url: "/brand/all/",
        method: "get",
        params,
    });
export const apiDeleteBrand = (bid) =>
    axios({
        url: "/brand/" + bid,
        method: "delete",
    });
export const apiUpdateBrand = (data) =>
    axios({
        url: "/brand/",
        method: "put",
        data,
    });
// export const apiUpdatePitch = (data, pid) =>
//   axios({
//     url: "/pitch/" + pid,
//     method: "put",
//     data,
//   });