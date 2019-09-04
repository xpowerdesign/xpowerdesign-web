import request from '@/utils/request';

// TODO: when finish the project move the common service
export async function queryFakeList(params: { count: number }) {
  return request('/api/fake_list', {
    params,
  });
}
