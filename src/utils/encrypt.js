import JSEncrypt from "jsencrypt";
const pub_key = "MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCqholsol7qL4UKAff0GtT5JqpVzsld3t8Gpe/dcvKgu01EQbWy8gDKoA2zvLU3OkbcFW6IaDZsTi8JpFNQmy5xONomYgltmgk9I5O3jqgJVhWheDsUtEcCGQWUoaY2/rBBwiyoBCkJgGKQub+Ksj2lua9Opl+stpHN9OzQD3inQQIDAQAB";

const encryptor = new JSEncrypt();
encryptor.setPublicKey(pub_key);

const encryptProps = [
    'pwd',
    'confirmPwd'
]

encryptor.comEncrypt = (obj)=>{
    encryptProps.forEach(prop =>{
        if(obj[prop]){
            obj[prop] = encryptor.encrypt(obj[prop]);
        }
    })
}

export default encryptor