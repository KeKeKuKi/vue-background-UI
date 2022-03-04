import { request, blogService } from '@/utils/request'

export function pageArticle(query) {
  return blogService.post(
    '/article/page', query
  )
}

export function articleBody(id) {
  return blogService.get(
    '/article/body/' + id, {}
  )
}

export function updateArticle(params) {
  return blogService.post('/article/updateById', params)
}

export function saveArticle(params) {
  return blogService.post('/article/save', params)
}

export function putOnArticle(params) {
  return blogService.get('/article/putOn/' + params, {})
}

export function putOffArticle(params) {
  return blogService.get('/article/putOff/' + params, {})
}

export function passArticle(params) {
  return blogService.get('/article/pass/' + params, {})
}

export function refuseArticle(params) {
  return blogService.get('/article/refuse/' + params, {})
}

export function submitReviewArticle(params) {
  return blogService.get('/article/submitReview/' + params, {})
}

export function delArticle(params) {
  return blogService.get('/article/del/' + params, {})
}

export function uploadImage(params) {
  return blogService.post('/oss/uploadImage', params)
}

export function fetchList(query) {
  return blogService({
    url: '/vue-element-admin/article/list',
    method: 'get',
    params: query
  })
}

export function fetchArticle(id) {
  return request({
    url: '/vue-element-admin/article/detail',
    method: 'get',
    params: { id }
  })
}

export function fetchPv(pv) {
  return request({
    url: '/vue-element-admin/article/pv',
    method: 'get',
    params: { pv }
  })
}

export function createArticle(data) {
  return request({
    url: '/vue-element-admin/article/create',
    method: 'post',
    data
  })
}

