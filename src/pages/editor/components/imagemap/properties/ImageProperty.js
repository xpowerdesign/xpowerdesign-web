import React from 'react';
import {Form, Radio} from 'antd';


import UrlModal from '../../common/UrlModal';
import FileUpload from '../../common/FileUpload';
import { formatMessage } from 'umi-plugin-react/locale';

export default {
  render(canvasRef, form, data) {
    const {getFieldDecorator} = form;
    if (!data) {
      return null;
    }
    const imageLoadType = data.imageLoadType || 'file';
    return (
      <React.Fragment>
        <Form.Item label={formatMessage({id: 'editor.imagemap.image.image-load-type'})} colon={false}>
          {
            getFieldDecorator('imageLoadType', {
              initialValue: imageLoadType,
            })(
              <Radio.Group size="small">
                <Radio.Button value="file">{formatMessage({id: 'editor.imagemap.image.file-upload'})}</Radio.Button>
                <Radio.Button value="src">{formatMessage({id: 'editor.imagemap.image.image-url'})}</Radio.Button>
              </Radio.Group>,
            )
          }
        </Form.Item>
        {
          imageLoadType === 'file' ? (
            <Form.Item label={formatMessage({id: 'editor.common.file'})} colon={false}>
              {
                getFieldDecorator('file', {
                  rules: [{
                    required: true,
                    message: formatMessage({id: 'editor.validation.enter-property'}),
                  }],
                  initialValue: data.file,
                })(
                  <FileUpload accept="image/*"/>,
                )
              }
            </Form.Item>
          ) : (
            <Form.Item>
              {
                getFieldDecorator('src', {
                  initialValue: data.src,
                })(
                  <UrlModal form={form}/>,
                )
              }
            </Form.Item>
          )
        }
      </React.Fragment>
    );
  },
};
