import request from "../utils/request";

const model_name = "constant";

 const pageList = params => {
    return request({
        url: `/${model_name}/pageList`,
        method: 'post',
        data: params
    });
};



 const add = params => {
    return request({
        url: `/${model_name}/add`,
        method: 'post',
        data: params
    });
};

 const update = params => {
    return request({
        url: `/${model_name}/update`,
        method: 'put',
        data: params
    });
};

 const del = id => {
    return request({
        url: `/${model_name}/delete/${id}`,
        method: 'delete',
    });
};

 const updateState = params => {
    return request({
        url: `/${model_name}/updateState`,
        method: 'post',
        data: params
    });
};

 export default {
    pageList,
    add,
    update,
    del,
    updateState
}
