/**
 * Ant Design Pro v4 use `@ant-design/pro-layout` to handle Layout.
 * You can view component api by:
 * https://github.com/ant-design/ant-design-pro-layout
 */

import ProLayout, {
  MenuDataItem,
  BasicLayoutProps as ProLayoutProps,
  Settings,
} from '@ant-design/pro-layout';
import React, {useEffect} from 'react';
import Link from 'umi/link';
import {Dispatch} from 'redux';
import {connect} from 'dva';
import {formatMessage} from 'umi-plugin-react/locale';

import Authorized from '@/utils/Authorized';
import RightContent from '@/components/GlobalHeader/RightContent';
import {ConnectState} from '@/models/connect';
import logo from '../assets/logo-blue.svg';
import editorStyles from './EditorLayout.less';

export interface BasicLayoutProps extends ProLayoutProps {
  settings: Settings;
  dispatch: Dispatch;
}

export type BasicLayoutContext = { [K in 'location']: BasicLayoutProps[K] } & {
  breadcrumbNameMap: {
    [path: string]: MenuDataItem;
  };
};

/**
 * use Authorized check all menu item
 */
const menuDataRender = (menuList: MenuDataItem[]): MenuDataItem[] =>
  menuList.map(item => {
    const localItem = {
      ...item,
      children: item.children ? menuDataRender(item.children) : [],
    };
    return Authorized.check(item.authority, localItem, null) as MenuDataItem;
  });

const footerRender = () => '';

const EditorLayoutNew: React.FC<BasicLayoutProps> = props => {
  const {dispatch, children, settings} = props;
  settings.navTheme = 'dark';
  settings.layout = 'sidemenu';
  /**
   * constructor
   */

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
      className={editorStyles.layout}
      siderWidth={100}
      logo={logo}
      menuItemRender={(menuItemProps, defaultDom) => {
        if (menuItemProps.isUrl) {
          return defaultDom;
        }
        return <Link to={menuItemProps.path}>{defaultDom}</Link>;
      }}
      menuDataRender={menuDataRender}
      formatMessage={formatMessage}
      rightContentRender={rightProps => <RightContent {...rightProps} />}
      footerRender={footerRender}
      {...props}
      {...settings}
    >
      <div className={editorStyles.tools}>
        {children}
      </div>
      <div className={editorStyles.canvas}>
        我是一个canvas
      </div>
    </ProLayout>
  );
};

export default connect(({settings}: ConnectState) => ({
  settings,
}))(EditorLayoutNew);
