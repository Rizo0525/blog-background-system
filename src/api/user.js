import request from '@/utils/request'

export function loginApi(data) {
  return request({
    url: '/api/admin/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/api/admin/whoami',
    method: 'get',
  })
}

export function logout() {
  return request({
    url: '/vue-admin-template/user/logout',
    method: 'post'
  })
}

export function updateAdmin(data){
  return request({
    url:'/api/admin',
    method:'put',
    data
  })
}