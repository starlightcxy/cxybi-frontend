// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** add GET /api/Queue/add */
export async function addUsingGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.addUsingGETParams,
  options?: { [key: string]: any },
) {
  return request<any>('/api/Queue/add', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** get GET /api/Queue/get */
export async function getUsingGet(options?: { [key: string]: any }) {
  return request<string>('/api/Queue/get', {
    method: 'GET',
    ...(options || {}),
  });
}
