import React from 'react';
import {Form, Select, Switch, Input} from 'antd';
import { formatMessage } from 'umi-plugin-react/locale';


export default {
  render(canvasRef, form, data) {
    const {getFieldDecorator} = form;
    return (
      <React.Fragment>
        <Form.Item label={formatMessage({id: 'editor.imagemap.link.link-enabled'})} colon={false}>
          {
            getFieldDecorator('link.enabled', {
              rules: [{
                required: true,
                message: formatMessage({id: 'editor.validation.enter-property'}),
              }],
              valuePropName: 'checked',
              initialValue: data.link.enabled,
            })(
              <Switch size="small"/>,
            )
          }
        </Form.Item>
        {
          data.link.enabled ? (
            <React.Fragment>
              <Form.Item label={formatMessage({id: 'editor.common.state'})} colon={false}>
                {
                  getFieldDecorator('link.state', {
                    initialValue: data.link.state || 'current',
                  })(
                    <Select>
                      <Select.Option value="current">{formatMessage({id: 'editor.common.current'})}</Select.Option>
                      <Select.Option value="new">{formatMessage({id: 'editor.common.new'})}</Select.Option>
                    </Select>,
                  )
                }
              </Form.Item>
              <Form.Item label={formatMessage({id: 'editor.common.url'})} colon={false}>
                {
                  getFieldDecorator('link.url', {
                    rules: [{
                      required: true,
                      message: formatMessage({id: 'editor.validation.enter-property'}),
                    }],
                    initialValue: data.link.url || '',
                  })(
                    <Input/>,
                  )
                }
              </Form.Item>
            </React.Fragment>
          ) : null
        }
      </React.Fragment>
    );
  },
};
