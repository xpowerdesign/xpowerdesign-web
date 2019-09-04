import { Effect } from 'dva';
import { Reducer } from 'redux';

import { getCategoriesByGroup } from '@/services/category';

export interface Category {
  id: string;
  type: string;
  name: string;
  name_chn: string;
  doc_width: number;
  doc_height: number;
  doc_unit: string;
  size: string;
  height: number;
  width: number;
  dpi: number;
  cover: string;
  cover_display: string;
  status: string;
  notices: any;
  created_at: any;
  updated_at: any;
}

export interface CategoriesState {
  list?: Category[];
}

export interface ModelType {
  namespace: 'category';
  state: {
    list: Category[];
  };
  effects: {
    fetchCategoriesByGroup: Effect;
  };
  reducers: {
    getCategories: Reducer<CategoriesState>;
  };
}

const CategoryModel: ModelType = {
  namespace: 'category',

  state: {
    list: [],
  },

  effects: {
    *fetchCategoriesByGroup(_, { call, put }) {
      const response = yield call(getCategoriesByGroup);
      yield put({
        type: 'getCategories',
        payload: response,
      });
    },
  },

  reducers: {
    getCategories(state, action) {
      return {
        ...state,
        list: action.payload.data.categories || [],
      };
    },
  },
};

export default CategoryModel;
