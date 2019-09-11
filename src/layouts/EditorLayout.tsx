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
import { Helmet } from 'react-helmet';

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
    <Layout className="rde-main">

      <Helmet>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content="React Design Editor has started to developed direct manipulation of editable design tools like Powerpoint, We've developed it with react.js, ant.design, fabric.js " />
        <link rel="manifest" href="./manifest.json" />
        <link rel="shortcut icon" href="./favicon.ico" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/earlyaccess/notosanskr.css" />
        <title>React Design Editor</title>
        <script async src="https://www.googletagmanager.com/gtag/js?id=UA-97485289-3" />
        <script>
          {`
                        window.dataLayer = window.dataLayer || [];
                        function gtag(){dataLayer.push(arguments);}
                        gtag('js', new Date());
                        gtag('config', 'UA-97485289-3');
                        `}
        </script>
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js" />
      </Helmet>

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
