import {request, blogService, authService} from '@/utils/request'

export function listPermission(data) {
  return authService.post('/permission/list', data)
}

export function pagePermission(data) {
  return authService.post('/permission/page', data)
}

export function addPermission(data) {
  return authService.post('/permission/add', data)
}

export function delPermission(id) {
  return authService.get('/permission/del/' + id)
}
