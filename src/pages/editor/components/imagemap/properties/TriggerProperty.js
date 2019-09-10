import React from 'react';
import {Form, Switch} from 'antd';


import CodeModal from '../../common/CodeModal';
import { formatMessage } from 'umi-plugin-react/locale';
export default {
  render(canvasRef, form, data) {
    const {getFieldDecorator} = form;
    return (
      <React.Fragment>
        <Form.Item label={formatMessage({id: 'editor.imagemap.trigger.trigger-enabled'})} colon={false}>
          {
            getFieldDecorator('trigger.enabled', {
              rules: [{
                type: 'boolean',
              }],
              valuePropName: 'checked',
              initialValue: data.trigger.enabled,
            })(
              <Switch size="small"/>,
            )
          }
        </Form.Item>
        <Form.Item style={{display: data.trigger.enabled ? 'block' : 'none'}}>
          {
            getFieldDecorator('trigger.code', {
              initialValue: data.trigger.code || 'return null;',
            })(
              <CodeModal form={form}/>,
            )
          }
        </Form.Item>
      </React.Fragment>
    );
  },
};
