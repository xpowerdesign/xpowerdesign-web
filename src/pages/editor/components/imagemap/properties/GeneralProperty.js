import React from 'react';
import {Form, Input, Slider, Switch, Col, InputNumber, Row} from 'antd';

import { formatMessage } from 'umi-plugin-react/locale';
export default {
  render(canvasRef, form, data) {
    const {getFieldDecorator} = form;
    return (
      <React.Fragment>
        <Row>
          <Col span={12}>
            <Form.Item label={formatMessage({id: 'editor.common.lock'})} colon={false}>
              {
                getFieldDecorator('lock', {
                  rules: [{
                    type: 'boolean',
                  }],
                  valuePropName: 'checked',
                  initialValue: data.lock,
                })(
                  <Switch size="small"/>,
                )
              }
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label={formatMessage({id: 'editor.common.visible'})} colon={false}>
              {
                getFieldDecorator('visible', {
                  rules: [{
                    type: 'boolean',
                  }],
                  valuePropName: 'checked',
                  initialValue: data.visible,
                })(
                  <Switch size="small"/>,
                )
              }
            </Form.Item>
          </Col>
        </Row>
        <Form.Item label={formatMessage({id: 'editor.common.name'})} colon={false}>
          {
            getFieldDecorator('name', {
              initialValue: data.name,
            })(
              <Input/>,
            )
          }
        </Form.Item>
        <Row>
          <Col span={12}>
            <Form.Item label={formatMessage({id: 'editor.common.width'})} colon={false}>
              {
                getFieldDecorator('width', {
                  rules: [{
                    type: 'number',
                    required: true,
                    message: 'Please input width',
                    min: 1,
                  }],
                  initialValue: parseInt(data.width * data.scaleX, 10),
                })(
                  <InputNumber min={1}/>,
                )
              }
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label={formatMessage({id: 'editor.common.height'})} colon={false}>
              {
                getFieldDecorator('height', {
                  rules: [{
                    type: 'number',
                    required: true,
                    message: 'Please input height',
                    min: 1,
                  }],
                  initialValue: parseInt(data.height * data.scaleY, 10),
                })(
                  <InputNumber min={1}/>,
                )
              }
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <Form.Item label={formatMessage({id: 'editor.common.left'})} colon={false}>
              {
                getFieldDecorator('left', {
                  rules: [{
                    required: true,
                    message: 'Please input x position',
                  }],
                  initialValue: data.left,
                })(
                  <InputNumber/>,
                )
              }
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label={formatMessage({id: 'editor.common.top'})} colon={false}>
              {
                getFieldDecorator('top', {
                  rules: [{
                    required: true,
                    message: 'Please input y position',
                  }],
                  initialValue: data.top,
                })(
                  <InputNumber/>,
                )
              }
            </Form.Item>
          </Col>
        </Row>
        <Form.Item label={formatMessage({id: 'editor.common.angle'})} colon={false}>
          {
            getFieldDecorator('angle', {
              rules: [{
                type: 'number',
                required: true,
                message: 'Please input rotation',
              }],
              initialValue: data.angle,
            })(
              <Slider min={0} max={360}/>,
            )
          }
        </Form.Item>
      </React.Fragment>
    );
  },
};
