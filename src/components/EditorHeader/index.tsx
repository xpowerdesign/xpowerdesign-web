import React from 'react';
import GlobalHeaderRight from '@/components/GlobalHeader/RightContent';
import styles from '@/components/GlobalHeader/index.less';
import logo from '../../assets/logo-blue.svg';
import { ConnectProps } from '@/models/connect';

export interface EditorHeaderProps extends ConnectProps {
  title?: any;
}

const EditorHeader: React.SFC<EditorHeaderProps> = props => {
  const { title } = props;
  return (
    <div className={styles.dark}>
      <div className={styles.logo}>
        <a href="">
          <img src={logo} alt="" />
          <h1>{title}</h1>
        </a>
      </div>
      <GlobalHeaderRight></GlobalHeaderRight>
    </div>
  );
};

export default EditorHeader;
