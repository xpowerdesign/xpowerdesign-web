import {Effect} from 'dva';
import {Reducer} from 'redux';

import {queryCurrent} from '@/services/user';

export interface CurrentUser {
  id?: string,
  username?: string,
  avatar?: string,
  mobile?: string,
  email?: string,
  nickname?: string,
  openid?: string,
  user_type?: number,
  status?: number,
}

export interface UserModelState {
  currentUser?: CurrentUser;
}

export interface UserModelType {
  namespace: 'user';
  state: UserModelState;
  effects: {
    fetchCurrent: Effect;
  };
  reducers: {
    saveCurrentUser: Reducer<UserModelState>;
  };
}

const UserModel: UserModelType = {
  namespace: 'user',

  state: {
    currentUser: {},
  },

  effects: {
    * fetchCurrent(_, {call, put}) {
      const response = yield call(queryCurrent);
      yield put({
        type: 'saveCurrentUser',
        payload: response,
      });
    },
  },

  reducers: {
    saveCurrentUser(state, action) {
      return {
        ...state,
        currentUser: action.payload.data || {},
      };
    },
  },
};

export default UserModel;
