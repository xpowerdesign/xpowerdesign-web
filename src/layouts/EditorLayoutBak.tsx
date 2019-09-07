import React, { useEffect } from 'react';
import ProLayout, { BasicLayoutProps as ProLayoutProps, Settings } from '@ant-design/pro-layout';
import { Dispatch } from 'redux';
import { connect } from 'dva';
import { ConnectState } from '@/models/connect';
import EditorHeader from '@/components/EditorHeader';
import { formatMessage } from 'umi-plugin-react/locale';

export interface EditorLayoutProps extends ProLayoutProps {
  settings: Settings;
  dispatch: Dispatch;
}

const footerRender = () => '';

const EditorLayoutBak: React.FC<EditorLayoutProps> = props => {
  const { dispatch, children, settings } = props;
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
    <ProLayout
      headerRender={EditorHeader}
      footerRender={footerRender}
      formatMessage={formatMessage}
      menuRender={false}
      {...settings}
      {...props}
    >
      {children}
    </ProLayout>
  );
};

export default connect(({ settings }: ConnectState) => ({
  settings,
}))(EditorLayoutBak);
