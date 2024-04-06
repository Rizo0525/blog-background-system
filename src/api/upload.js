import request from '@/utils/request'

export async function upload(data){
    return request({
        method:'post',
        url:'/api/upload',
        data
    })
}