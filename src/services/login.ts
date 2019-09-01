import request from 'umi-request';

export interface LoginParamsType {
  username: string;
  password: string;
  mobile: string;
  captcha: string;
}

export async function userLogin(params: LoginParamsType) {
  return request('/api/v1/login', {
    method: 'POST',
    data: params,
  });
}

export async function getCaptcha(mobile: string) {
  return request(`/api/v1/captcha?mobile=${mobile}`);
}
