const localcache = {

    setUserInfo : (obj)=>{
        localStorage.setItem('token',obj.token);
        localStorage.setItem('userInfo',JSON.stringify(obj));
    },
    getUserInfo : ()=>{
        return JSON.parse(localStorage.getItem('userInfo'));
    },
    getToken: ()=>{
        return localStorage.getItem('token')
    },
    clearUserInfo:()=>{
        localStorage.removeItem('userInfo');
        localStorage.removeItem('token');
    }
};

export default localcache;
