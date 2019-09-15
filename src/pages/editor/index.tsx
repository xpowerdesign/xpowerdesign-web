import {Card, Icon, Layout, Menu} from 'antd';
import {formatMessage} from 'umi-plugin-react/locale';
import React from 'react';
import styles from './index.less';
import {GridContent, Settings} from "@ant-design/pro-layout";
import ImageMapEditor from "@/pages/editor/components/imagemap/ImageMapEditor";

import BackgroundComponent from '@/pages/editor/components/assets/BackgroundComponent';

const {Sider} = Layout;

export interface EditorProps {
  settings: Settings
}

const Editor: React.FC<EditorProps> = ({settings}) => {
  return (
    <Layout>

      <Sider className={styles.leftSider} width={100} style={{background: '#fff'}}>
        <Menu
          theme={settings.navTheme}
          mode="inline"
          defaultSelectedKeys={['background']}
          style={{height: '100%', borderRight: 0}}
        >
          <Menu.Item key="background">
            <Icon type="mail"/>
            {formatMessage({id: "menu.background"})}
          </Menu.Item>
          <Menu.Item key="sticker">
            <Icon type="sketch"/>
            {formatMessage({id: "menu.sticker"})}
          </Menu.Item>
          <Menu.Item key="text">
            <Icon type="file-word"/>
            {formatMessage({id: "menu.text"})}
          </Menu.Item>
          <Menu.Item key="photo">
            <Icon type="ant-cloud"/>
            {formatMessage({id: "menu.photo"})}
          </Menu.Item>
        </Menu>
      </Sider>

      <Sider width={356} style={{background: '#f0f2f5'}}>
        <BackgroundComponent/>
      </Sider>

      <Layout className={styles.rightContent}>
        <GridContent>
          <Card bordered={false}>
            <ImageMapEditor  />
          </Card>
        </GridContent>
      </Layout>
    </Layout>
  )
};

export default Editor;
