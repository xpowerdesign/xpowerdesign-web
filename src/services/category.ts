import request from '@/utils/request';

export async function getCategoriesByGroup(): Promise<any> {
  return request('/api/v1/categories/group');
}
