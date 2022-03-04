import { request, blogService, authService } from '@/utils/request'

export function login(data) {
  return authService.post('/login', data)
}

export function getInfo(token) {
  return authService({
    url: '/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return authService({
    url: '/user/logout',
    method: 'get'
  })
}

export function pageUser(data) {
  return authService.post('/user/page', data)
}

export function addUser(data) {
  return authService.post('/user/add', data)
}

export function updateUser(data) {
  return authService.post('/user/update', data)
}

export function listUser(data) {
  return authService.post('/user/list', data)
}

export function findUserById(data) {
  return authService.get('/user/getById/' + data)
}
