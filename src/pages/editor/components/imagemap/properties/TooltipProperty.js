import React from 'react';
import {Form, Switch} from 'antd';

import { formatMessage } from 'umi-plugin-react/locale';
export default {
  render(canvasRef, form, data) {
    const {getFieldDecorator} = form;
    if (!data) {
      return null;
    }
    return (
      <Form.Item label={formatMessage({id: 'editor.imagemap.tooltip.tooltip-enabled'})} colon={false}>
        {
          getFieldDecorator('tooltip.enabled', {
            rules: [
              {type: 'boolean'},
            ],
            valuePropName: 'checked',
            initialValue: data.tooltip.enabled,
          })(
            <Switch size="small"/>,
          )
        }
      </Form.Item>
    );
  },
};
