import {Effect} from 'dva';
import {Reducer} from 'redux';

import {getAssetsForBackgrounds} from '@/services/asset';
import {getAssetsForStickers} from "@/services/asset";

export interface Asset {
  id: string;
  name: string;
  name_chn: string;
  type: string;
  type_chn: string;
  sub_type: string;
  sub_type_chn: string
  resource_url?: string;
  thumbnail_url?: string;
  resources_meta: any;
  sort: number;
  tag?: string;
  created_at: any;
  updated_at: any;
}

export interface AssetsState {
  list: Asset[]
}

export interface ModelType {
  namespace: 'assets';
  state: {
    list: {};
  };
  effects: {
    fetchAssetsForBackgrounds: Effect;
    fetchAssetsForStickers: Effect;
  };
  reducers: {
    getBackgrounds: Reducer<AssetsState>;
    getStickers: Reducer<AssetsState>;
  };
}

const CategoryModel: ModelType = {
  namespace: 'assets',

  state: {
    list: {},
  },

  effects: {
    * fetchAssetsForBackgrounds(_, {call, put}) {
      const response = yield call(getAssetsForBackgrounds);
      yield put({
        type: 'getBackgrounds',
        payload: response,
      });
    },
    * fetchAssetsForStickers(_, {call, put}) {
      const response = yield call(getAssetsForStickers);
      yield put({
        type: 'getStickers',
        payload: response,
      });
    },
  },

  reducers: {
    getBackgrounds(state, action) {
      return {
        ...state,
        list: action.payload.data.list || {},
      };
    },
    getStickers(state, action) {
      return {
        ...state,
        list: action.payload.data.list || [],
      };
    },
  },
};

export default CategoryModel;
