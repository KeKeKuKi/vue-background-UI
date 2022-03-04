import {request, blogService, authService} from '@/utils/request'

export function listRoles(data) {
  return authService.post('/role/list', data)
}

export function pageRole(data) {
  return authService.post('/role/page', data)
}

export function updateRole(data) {
  return authService.post('/role/update', data)
}

export function addRole(data) {
  return authService.post('/role/add', data)
}

export function delRole(data) {
  return authService.get('/role/del/' + data)
}
