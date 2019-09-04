import { AnyAction, Reducer } from 'redux';
import { EffectsCommandMap } from 'dva';
import { ListItemDataType } from './data.d';
import { queryFakeList } from './service';

// TODO: when finish the project move the common model

export interface ModalState {
  list: ListItemDataType[];
}

export type Effect = (
  action: AnyAction,
  effects: EffectsCommandMap & { select: <T>(func: (state: ModalState) => T) => T },
) => void;

export interface ModelType {
  namespace: string;
  state: ModalState;
  effects: {
    fetch: Effect;
  };
  reducers: {
    queryList: Reducer<ModalState>;
  };
}

const Model: ModelType = {
  namespace: 'designer',

  state: {
    list: [],
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryFakeList, payload);
      yield put({
        type: 'queryList',
        payload: Array.isArray(response) ? response : [],
      });
    },
  },

  reducers: {
    queryList(state, action) {
      return {
        ...(state as ModalState),
        list: action.payload,
      };
    },
  },
};

export default Model;
