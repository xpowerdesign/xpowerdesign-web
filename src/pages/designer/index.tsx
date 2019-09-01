import { Card, Col, Input, Row, Button } from 'antd';
import React, { PureComponent } from 'react';

import { formatMessage } from 'umi-plugin-react/locale';
import { Dispatch } from 'redux';
import { GridContent } from '@ant-design/pro-layout';
import { RouteChildrenProps } from 'react-router';

import { connect } from 'dva';
import Projects from './components/Projects';
import { CurrentUser } from '@/models/user';
import styles from './Center.less';
import { ConnectState } from '@/models/connect';

const operationTabList = [
  {
    key: 'projects',
    tab: (
      <span>
        设计稿 <span style={{ fontSize: 14 }}>(8)</span>
      </span>
    ),
  },
];

interface DesignerProps extends RouteChildrenProps {
  dispatch: Dispatch<any>;
  currentUser: CurrentUser;
}

interface DesignerState {
  tabKey: 'projects';
}

@connect(({ user }: ConnectState) => ({
  currentUser: user.currentUser,
}))
class Designer extends PureComponent<DesignerProps, DesignerState> {
  state: DesignerState = {
    tabKey: 'projects',
  };

  public input: Input | null | undefined = undefined;

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'designer/fetch',
    });
  }

  onTabChange = (key: string) => {
    this.setState({
      tabKey: key as DesignerState['tabKey'],
    });
  };

  renderChildrenByTabKey = (tabKey: DesignerState['tabKey']) => {
    if (tabKey === 'projects') {
      return <Projects />;
    }
    return null;
  };

  render() {
    const { tabKey } = this.state;
    const { currentUser } = this.props;
    const dataLoading = !(currentUser && Object.keys(currentUser).length);
    return (
      <GridContent>
        <Row gutter={24}>
          <Col lg={7} md={24}>
            <Card bordered={false} style={{ marginBottom: 24 }} loading={dataLoading}>
              {!dataLoading ? (
                <div>
                  <div className={styles.avatarHolder}>
                    <img alt="" src={currentUser.avatar} />
                    <div className={styles.name}>{currentUser.username}</div>
                  </div>
                  <div className={styles.newProject}>
                    <Button type="primary" size="large">
                      {formatMessage({ id: 'designer.new-project' })}
                    </Button>
                  </div>
                </div>
              ) : null}
            </Card>
          </Col>
          <Col lg={17} md={24}>
            <Card
              className={styles.tabsCard}
              bordered={false}
              tabList={operationTabList}
              activeTabKey={tabKey}
              onTabChange={this.onTabChange}
            >
              {this.renderChildrenByTabKey(tabKey)}
            </Card>
          </Col>
        </Row>
      </GridContent>
    );
  }
}

export default Designer;
