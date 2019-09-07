import {Button, Card, Icon, Layout, Menu, Result} from 'antd';
import {FormattedMessage, formatMessage} from 'umi-plugin-react/locale';
import React, {Fragment} from 'react';
import styles from './index.less';
import {GridContent, Settings} from "@ant-design/pro-layout";

const {Sider} = Layout;

export interface EditorProps {
  settings: Settings
}

const Content = (
  <Fragment>
    <div className={styles.title}>
      <FormattedMessage
        id="editor.error.hint-title"
        defaultMessage="The content you submitted has the following error:"
      />
    </div>
    <div style={{ marginBottom: 16 }}>
      <Icon style={{ marginRight: 8 }} className={styles.error_icon} type="close-circle-o" />
      <FormattedMessage
        id="editor.error.hint-text1"
        defaultMessage="Your account has been frozen"
      />
      <a style={{ marginLeft: 16 }}>
        <FormattedMessage id="editor.error.hint-btn1" defaultMessage="Thaw immediately" />
        <Icon type="right" />
      </a>
    </div>
    <div>
      <Icon style={{ marginRight: 8 }} className={styles.error_icon} type="close-circle-o" />
      <FormattedMessage
        id="editor.error.hint-text2"
        defaultMessage="Your account is not yet eligible to apply"
      />
      <a style={{ marginLeft: 16 }}>
        <FormattedMessage id="editor.error.hint-btn2" defaultMessage="Upgrade immediately" />
        <Icon type="right" />
      </a>
    </div>
  </Fragment>
);

const Editor: React.FC<EditorProps> = ({settings}) => {
  return (
    <Layout>
      <Sider className={styles.leftSider} width={100} style={{background: '#fff'}}>
        <Menu
          theme={settings.navTheme}
          mode="inline"
          defaultSelectedKeys={['1']}
          style={{height: '100%', borderRight: 0}}
        >
          <Menu.Item key="1">
            <Icon type="sketch"/>
            {formatMessage({id: "menu.sticker"})}
          </Menu.Item>
          <Menu.Item key="2">
            <Icon type="file-word"/>
            {formatMessage({id: "menu.text"})}
          </Menu.Item>
          <Menu.Item key="3">
            <Icon type="mail"/>
            {formatMessage({id: "menu.background"})}
          </Menu.Item>
          <Menu.Item key="4">
            <Icon type="ant-cloud"/>
            {formatMessage({id: "menu.photo"})}
          </Menu.Item>
        </Menu>
      </Sider>

      <Sider width={100} style={{background: '#f0f2f5'}}>

      </Sider>

      <Layout>
        <GridContent>
          <Card bordered={false}>
            <Result
              status="error"
              title={formatMessage({ id: 'editor.error.title' })}
              subTitle={formatMessage({ id: 'editor.error.description' })}
              extra={
                <Button type="primary">
                  <FormattedMessage id="editor.error.btn-text" defaultMessage="Return to modify" />
                </Button>
              }
              style={{ marginTop: 48, marginBottom: 16 }}
            >
              {Content}
            </Result>
          </Card>
        </GridContent>
      </Layout>
    </Layout>
  )
};


export default Editor;
