import request from '@/utils/request';

export async function getAssetsForBackgrounds(): Promise<any> {
  return request('/api/v1/assets/backgrounds');
}

export async function getAssetsForStickers(): Promise<any> {
  return request('/api/v1/assets/stickers');
}
