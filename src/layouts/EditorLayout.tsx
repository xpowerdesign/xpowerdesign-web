import React, {useEffect} from 'react';
import {connect} from 'dva';
import {ConnectState} from '@/models/connect';
import {Layout} from 'antd';
import RightContent from '@/components/GlobalHeader/RightContent';
import TopNavHeader from "@ant-design/pro-layout/lib/TopNavHeader";
import logo from '../assets/logo-blue.svg';
import editorStyles from './EditorLayout.less';
import Editor from '@/pages/editor/index';
import {Dispatch} from "redux";

import {Settings} from '@ant-design/pro-layout';

export interface EditorLayoutProps {
  settings: Settings;
  dispatch: Dispatch;
}

const EditorLayout: React.FC<EditorLayoutProps> = props => {
  const {dispatch, settings} = props;
  settings.navTheme = 'dark';

  useEffect(() => {
    if (dispatch) {
      dispatch({
        type: 'user/fetchCurrent',
      });
      dispatch({
        type: 'settings/getSetting',
      });
    }
  }, []);
  return (
    <Layout>
      <header className={editorStyles.dark}>
        <TopNavHeader
          logo={logo} title={settings.title}
          rightContentRender={rightProps => <RightContent {...rightProps} />}
        >
        </TopNavHeader>
      </header>

      <Editor settings={settings}/>
    </Layout>
  );
};

export default connect(({settings}: ConnectState) => ({
  settings,
}))(EditorLayout);
