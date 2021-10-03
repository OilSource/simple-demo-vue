import request from "../utils/request";

const model_name = "role";


export const pageList = params => {
    return request({
        url: `/${model_name}/pageList`,
        method: 'post',
        data: params
    });
};

export const add = params => {
    return request({
        url: `/${model_name}/add`,
        method: 'post',
        data: params
    });
};

export const update = params => {
    return request({
        url: `/${model_name}/update`,
        method: 'put',
        data: params
    });
};

export const del = id => {
    return request({
        url: `/${model_name}/delete/${id}`,
        method: 'delete',
    });
};

export const list = () => {
    return request({
        url: `/${model_name}/list`,
        method: 'post',
    });
};

const updateState = params => {
    return request({
        url: `/${model_name}/updateState`,
        method: 'post',
        data: params
    });
};

const authority = params => {
    return request({
        url: `/${model_name}/authority`,
        method: 'post',
        data: params
    });
};

export default {
    pageList,
    add,
    update,
    del,
    list,
    updateState,
    authority
}
