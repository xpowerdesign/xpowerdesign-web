import React from 'react';
import { formatMessage } from 'umi-plugin-react/locale';
import {Form, Input, Radio, Row, Col, InputNumber} from 'antd';


export default {
  render(canvasRef, form, data) {
    const {getFieldDecorator} = form;
    if (!data) {
      return null;
    }
    const layout = data.layout || 'fixed';
    return (
      <React.Fragment>
        <Form.Item label={formatMessage({id: 'editor.common.name'})} colon={false}>
          {
            getFieldDecorator('name', {
              rules: [{
                required: false,
                message: formatMessage({id: 'editor.validation.enter-arg'}, {id: {id: 'editor.common.name'}}),
              }],
              initialValue: data.name || '',
            })(
              <Input/>,
            )
          }
        </Form.Item>
        <Form.Item label={formatMessage({id: 'editor.common.layout'})} colon={false}>
          {
            getFieldDecorator('layout', {
              initialValue: layout,
            })(
              <Radio.Group size="small">
                <Radio.Button value="fixed">{formatMessage({id: 'editor.common.fixed'})}</Radio.Button>
                <Radio.Button value="responsive">{formatMessage({id: 'editor.common.responsive'})}</Radio.Button>
                <Radio.Button value="fullscreen">{formatMessage({id: 'editor.common.fullscreen'})}</Radio.Button>
              </Radio.Group>,
            )
          }
        </Form.Item>
        {
          layout === 'fixed' ? (
            <React.Fragment>
              <Row>
                <Col span={12}>
                  <Form.Item label={formatMessage({id: 'editor.common.width'})} colon={false}>
                    {
                      getFieldDecorator('width', {
                        rules: [{
                          required: true,
                          message: formatMessage({id: 'editor.validation.enter-arg'}, {id: {id: 'editor.common.width'}}),
                        }],
                        initialValue: data.width * data.scaleX,
                      })(
                        <InputNumber/>,
                      )
                    }
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label={formatMessage({id: 'editor.common.height'})} colon={false}>
                    {
                      getFieldDecorator('height', {
                        rules: [{
                          required: true,
                          message: formatMessage({id: 'editor.validation.enter-arg'}, {id: 'editor.common.height'}),
                        }],
                        initialValue: data.height * data.scaleY,
                      })(
                        <InputNumber/>,
                      )
                    }
                  </Form.Item>
                </Col>
              </Row>
            </React.Fragment>
          ) : null
        }
      </React.Fragment>
    );
  },
};
