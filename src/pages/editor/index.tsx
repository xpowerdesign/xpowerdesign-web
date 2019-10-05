import {Card, Layout} from 'antd';

import React from 'react';
import styles from './index.less';
import {GridContent, Settings} from "@ant-design/pro-layout";
import ImageMapEditor from "@/pages/editor/components/imagemap/ImageMapEditor";

export interface EditorProps {
  settings: Settings
}

const Editor: React.FC<EditorProps> = ({settings}) => {
  return (
    <Layout>
      <Layout className={styles.rightContent}>
        <GridContent>
          <Card bordered={false}>
            <ImageMapEditor/>
          </Card>
        </GridContent>
      </Layout>
    </Layout>
  )
};

export default Editor;
