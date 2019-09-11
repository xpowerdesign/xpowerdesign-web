import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Button} from 'antd';
import classnames from 'classnames';

import Icon from '../icon/Icon';
import Canvas from '../canvas/Canvas';

class ImageMapPreview extends Component {
  static propTypes = {
    preview: PropTypes.bool,
    onChangePreview: PropTypes.func,
    onTooltip: PropTypes.func,
    onAction: PropTypes.func,
  };

  state = {
    canvasRect: {
      width: 0,
      height: 0,
    },
  };

  componentDidMount() {
    this.setState({
      canvasRect: {
        width: window.innerWidth,
        height: window.innerHeight
      }
    })
  }

  render() {
    const {canvasRect} = this.state;
    const {onChangePreview, onTooltip, onLink, preview} = this.props;
    const previewClassName = classnames('rde-preview', {preview});
    return (
      <div className={previewClassName}>
        <div style={{overvlow: 'hidden', display: 'flex', flex: '1', height: '100%'}}>
          <Canvas
            ref={(c) => {
              this.canvasRef = c;
            }}
            editable={false}
            canvasOption={{
              width: canvasRect.width,
              height: canvasRect.height,
              backgroundColor: '#f3f3f3',
              selection: false,
            }}
            onTooltip={onTooltip}
            onLink={onLink}
          />
          <Button className="rde-action-btn rde-preview-close-btn" onClick={onChangePreview}>
            <Icon name="times" size={1.5}/>
          </Button>
        </div>
      </div>
    );
  }
}

export default ImageMapPreview;
