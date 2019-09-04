import { Modal, Button, Tabs, List, Card } from 'antd';
import React, { Component } from 'react';
import styles from './index.less';
import { connect } from 'dva';
import { CategoriesState } from '@/models/category';

const { TabPane } = Tabs;

export interface ISelectMeasureModalProps {
  modalVisible?: boolean;
  handleModalVisible: () => void;
}

@connect(({ category }: { category: CategoriesState }) => ({
  list: category.list,
}))
class SelectMeasure extends Component<CategoriesState & ISelectMeasureModalProps> {
  render() {
    const { modalVisible, handleModalVisible, list } = this.props;

    return (
      <Modal
        width={960}
        className={styles.layout}
        visible={modalVisible}
        title="请选择尺寸"
        onCancel={() => handleModalVisible()}
        footer={[
          <div className={styles.center}>
            <Button key="submit" type="primary" shape="round">
              开始设计
            </Button>
          </div>,
        ]}
      >
        <Tabs defaultActiveKey="1" type="card">
          {list &&
            list.map((item, _) => (
              <TabPane tab={item.name_chn} key={item.id}>
                <Card bordered={false}>
                  <div className={styles.cover}>
                    <img src={item.cover} alt="" />
                  </div>
                  <div className={styles.cover}>
                    <img src={item.cover_display} alt="" />
                  </div>

                  <List
                    className={styles.notices}
                    size="small"
                    itemLayout="horizontal"
                    dataSource={item.notices.words}
                    bordered={false}
                    split={false}
                    renderItem={element => (
                      <List.Item>
                        <List.Item.Meta title={element} />
                      </List.Item>
                    )}
                  />
                </Card>
              </TabPane>
            ))}
        </Tabs>
      </Modal>
    );
  }
}

export default SelectMeasure;
