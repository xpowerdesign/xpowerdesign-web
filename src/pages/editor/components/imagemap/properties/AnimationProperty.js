import React from 'react';
import {Row, Col, Form, Button, Select, Switch, Slider, InputNumber} from 'antd';

import { formatMessage } from 'umi-plugin-react/locale';

import ColorPicker from '../../common/ColorPicker';
import Icon from '../../icon/Icon';

export default {
  render(canvasRef, form, data) {
    const {getFieldDecorator} = form;
    if (!data) {
      return null;
    }
    const type = data.animation.type || 'none';
    return (
      <React.Fragment>
        <Form.Item label={formatMessage({id: 'editor.imagemap.animation.animation-type'})} colon={false}>
          {
            getFieldDecorator('animation.type', {
              initialValue: type,
            })(
              <Select>
                <Select.Option value="none">{formatMessage({id: 'editor.imagemap.animation.none'})}</Select.Option>
                <Select.Option value="fade">{formatMessage({id: 'editor.imagemap.animation.fade'})}</Select.Option>
                <Select.Option value="bounce">{formatMessage({id: 'editor.imagemap.animation.bounce'})}</Select.Option>
                <Select.Option value="shake">{formatMessage({id: 'editor.imagemap.animation.shake'})}</Select.Option>
                <Select.Option value="scaling">{formatMessage({id: 'editor.imagemap.animation.scaling'})}</Select.Option>
                <Select.Option value="rotation">{formatMessage({id: 'editor.imagemap.animation.rotation'})}</Select.Option>
                <Select.Option value="flash">{formatMessage({id: 'editor.imagemap.animation.flash'})}</Select.Option>
              </Select>,
            )
          }
        </Form.Item>
        {
          type === 'none' ? null : (
            <React.Fragment>
              <Row>
                <Col span={12}>
                  <Form.Item label={formatMessage({id: 'editor.imagemap.animation.auto-play'})} colon={false}>
                    {
                      getFieldDecorator('animation.autoplay', {
                        rules: [{
                          type: 'boolean',
                        }],
                        valuePropName: 'checked',
                        initialValue: data.animation.autoplay,
                      })(
                        <Switch size="small"/>,
                      )
                    }
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label={formatMessage({id: 'editor.common.loop'})} colon={false}>
                    {
                      getFieldDecorator('animation.loop', {
                        rules: [{
                          type: 'boolean',
                        }],
                        valuePropName: 'checked',
                        initialValue: data.animation.loop,
                      })(
                        <Switch size="small"/>,
                      )
                    }
                  </Form.Item>
                </Col>
              </Row>
              {
                type !== 'shake' ? (
                  <Row>
                    <Col span={12}>
                      <Form.Item label={formatMessage({id: 'editor.common.delay'})} colon={false}>
                        {
                          getFieldDecorator('animation.delay', {
                            rules: [{
                              type: 'number',
                              min: 100,
                              max: 5000,
                            }],
                            initialValue: data.animation.delay,
                          })(
                            <Slider min={100} max={5000} step={100}/>,
                          )
                        }
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item label={formatMessage({id: 'editor.common.duration'})} colon={false}>
                        {
                          getFieldDecorator('animation.duration', {
                            rules: [{
                              type: 'number',
                              min: 100,
                              max: 5000,
                            }],
                            initialValue: data.animation.duration,
                          })(
                            <Slider min={100} max={5000} step={100}/>,
                          )
                        }
                      </Form.Item>
                    </Col>
                  </Row>
                ) : null
              }
              {this.getComponentType(type, data, getFieldDecorator)}
              <Form.Item label={formatMessage({id: 'editor.imagemap.animation.playback'})} colon={false}>
                <Row>
                  <Col span={8}>
                    <Button block size="small" onClick={() => {
                      canvasRef.animationHandlers.play(data.id);
                    }}>
                      <Icon name="play" style={{marginRight: 8}}/>
                      {formatMessage({id: 'editor.action.start'})}
                    </Button>
                  </Col>
                  <Col span={8}>
                    <Button block size="small" onClick={() => {
                      canvasRef.animationHandlers.pause(data.id);
                    }}>
                      <Icon name="pause" style={{marginRight: 8}}/>
                      {formatMessage({id: 'editor.action.pause'})}
                    </Button>
                  </Col>
                  <Col span={8}>
                    <Button block size="small" onClick={() => {
                      canvasRef.animationHandlers.stop(data.id);
                    }}>
                      <Icon name="stop" style={{marginRight: 8}}/>
                      {formatMessage({id: 'editor.action.stop'})}
                    </Button>
                  </Col>
                </Row>
              </Form.Item>
            </React.Fragment>
          )
        }
      </React.Fragment>
    );
  },
  getComponentType(type, data, getFieldDecorator) {
    let component;
    if (type === 'fade') {
      component = (
        <Form.Item label={formatMessage({id: 'editor.common.opacity'})} colon={false}>
          {
            getFieldDecorator('animation.opacity', {
              rules: [{
                type: 'number',
                min: 0,
                max: 1,
              }],
              initialValue: data.animation.opacity || 0,
            })(
              <Slider min={0} max={1} step={0.1}/>,
            )
          }
        </Form.Item>
      );
    } else if (type === 'bounce') {
      component = (
        <React.Fragment>
          <Form.Item label={formatMessage({id: 'editor.imagemap.animation.bounce-type'})} colon={false}>
            {
              getFieldDecorator('animation.bounce', {
                initialValue: data.animation.bounce || 'hotizontal',
              })(
                <Select>
                  <Select.Option value="hotizontal">Horizontal</Select.Option>
                  <Select.Option value="vertical">Vertical</Select.Option>
                </Select>,
              )
            }
          </Form.Item>
          <Form.Item label={formatMessage({id: 'editor.common.offset'})} colon={false}>
            {
              getFieldDecorator('animation.offset', {
                rules: [{
                  type: 'number',
                  min: 1,
                  max: 10,
                }],
                initialValue: data.animation.offset || 1,
              })(
                <Slider min={1} max={10} step={1}/>,
              )
            }
          </Form.Item>
        </React.Fragment>
      );
    } else if (type === 'shake') {
      component = (
        <React.Fragment>
          <Form.Item label={formatMessage({id: 'editor.imagemap.animation.shake-type'})} colon={false}>
            {
              getFieldDecorator('animation.shake', {
                initialValue: data.animation.shake || 'hotizontal',
              })(
                <Select>
                  <Select.Option value="hotizontal">{formatMessage({id: 'editor.common.horizontal'})}</Select.Option>
                  <Select.Option value="vertical">{formatMessage({id: 'editor.common.vertical'})}</Select.Option>
                </Select>,
              )
            }
          </Form.Item>
          <Form.Item label={formatMessage({id: 'editor.common.offset'})} colon={false}>
            {
              getFieldDecorator('animation.offset', {
                rules: [{
                  type: 'number',
                  min: 1,
                  max: 10,
                }],
                initialValue: data.animation.offset || 1,
              })(
                <Slider min={1} max={10} step={1}/>,
              )
            }
          </Form.Item>
        </React.Fragment>
      );
    } else if (type === 'scaling') {
      component = (
        <Form.Item label={formatMessage({id: 'editor.imagemap.animation.scaling'})} colon={false}>
          {
            getFieldDecorator('animation.scale', {
              rules: [{
                type: 'number',
                min: 1,
                max: 5,
              }],
              initialValue: data.animation.scale || 1,
            })(
              <Slider min={1} max={5} step={0.1}/>,
            )
          }
        </Form.Item>
      );
    } else if (type === 'rotation') {
      component = (
        <Form.Item label={formatMessage({id: 'editor.common.angle'})} colon={false}>
          {
            getFieldDecorator('animation.angle', {
              rules: [{
                type: 'number',
                min: 0,
                max: 360,
              }],
              initialValue: data.animation.angle || data.angle,
            })(
              <Slider min={0} max={360}/>,
            )
          }
        </Form.Item>
      );
    } else if (type === 'flash') {
      component = (
        <Row>
          <Col span={12}>
            <Form.Item label={formatMessage({id: 'editor.imagemap.style.fill-color'})} colon={false}>
              {
                getFieldDecorator('animation.fill', {
                  initialValue: data.animation.fill || data.fill,
                })(
                  <ColorPicker/>,
                )
              }
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label={formatMessage({id: 'editor.imagemap.style.stroke-color'})} colon={false}>
              {
                getFieldDecorator('animation.stroke', {
                  initialValue: data.animation.stroke || data.stroke,
                })(
                  <ColorPicker/>,
                )
              }
            </Form.Item>
          </Col>
        </Row>
      );
    } else {
      component = (
        <Row>
          <Col span={12}>
            <Form.Item label={formatMessage({id: 'editor.common.value'})} colon={false}>
              {
                getFieldDecorator('animation.value', {
                  rules: [{
                    type: 'number',
                    min: 1,
                    max: 10,
                  }],
                  initialValue: data.animation.value || 1,
                })(
                  <InputNumber min={1} max={10}/>,
                )
              }
            </Form.Item>
          </Col>
        </Row>
      );
    }
    return component;
  },
};
