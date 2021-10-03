import request from "../utils/request";

const model_name = "menu";


 const tree = () => {
    return request({
        url: `/${model_name}/tree`,
        method: 'get',
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

const roleTree = id => {
    return request({
        url: `/${model_name}/roleTree/${id}`,
        method: 'get',
    });
};

export default {
    tree,
    add,
    update,
    del,
    roleTree
}
