import React, {Component} from 'react';
import PropTypes from 'prop-types';

import {Button} from 'antd';
import { formatMessage } from 'umi-plugin-react/locale';

import {FlexBox, FlexItem} from '../flex';
import CanvasList from '../canvas/CanvasList';
import {CommonButton} from '../common';
import Icon from '../icon/Icon';

class ImageMapHeaderToolbar extends Component {
  static propTypes = {
    canvasRef: PropTypes.any,
    selectedItem: PropTypes.object,
  }

  render() {
    const {canvasRef, selectedItem} = this.props;
    const isCropping = canvasRef ? canvasRef.interactionMode === 'crop' : false;
    return (
      <FlexBox className="rde-editor-header-toolbar-container" flex="1">
        <FlexItem className="rde-canvas-toolbar rde-canvas-toolbar-list">
          <CommonButton
            className="rde-action-btn"
            shape="circle"
            icon="layer-group"
            tooltipTitle={formatMessage({id: 'editor.action.canvas-list'})}
          />
          <div className="rde-canvas-list">
            <CanvasList canvasRef={canvasRef} selectedItem={selectedItem}/>
          </div>
        </FlexItem>
        <FlexItem className="rde-canvas-toolbar rde-canvas-toolbar-alignment">
          <CommonButton
            className="rde-action-btn"
            shape="circle"
            disabled={isCropping}
            onClick={() => canvasRef.handlers.bringForward()}
            icon="angle-up"
            tooltipTitle={formatMessage({id: 'editor.action.bring-forward'})}
          />
          <CommonButton
            className="rde-action-btn"
            shape="circle"
            disabled={isCropping}
            onClick={() => canvasRef.handlers.sendBackwards()}
            icon="angle-down"
            tooltipTitle={formatMessage({id: 'editor.action.send-backwards'})}
          />
          <CommonButton
            className="rde-action-btn"
            shape="circle"
            disabled={isCropping}
            onClick={() => canvasRef.handlers.bringToFront()}
            icon="angle-double-up"
            tooltipTitle={formatMessage({id: 'editor.action.bring-to-front'})}
          />
          <CommonButton
            className="rde-action-btn"
            shape="circle"
            disabled={isCropping}
            onClick={() => canvasRef.handlers.sendToBack()}
            icon="angle-double-down"
            tooltipTitle={formatMessage({id: 'editor.action.send-to-back'})}
          />
        </FlexItem>
        <FlexItem className="rde-canvas-toolbar rde-canvas-toolbar-alignment">
          <CommonButton
            className="rde-action-btn"
            shape="circle"
            disabled={isCropping}
            onClick={() => canvasRef.alignmentHandlers.left()}
            icon="align-left"
            tooltipTitle={formatMessage({id: 'editor.action.align-left'})}
          />
          <CommonButton
            className="rde-action-btn"
            shape="circle"
            disabled={isCropping}
            onClick={() => canvasRef.alignmentHandlers.center()}
            icon="align-center"
            tooltipTitle={formatMessage({id: 'editor.action.align-center'})}
          />
          <CommonButton
            className="rde-action-btn"
            shape="circle"
            disabled={isCropping}
            onClick={() => canvasRef.alignmentHandlers.right()}
            icon="align-right"
            tooltipTitle={formatMessage({id: 'editor.action.align-right'})}
          />
        </FlexItem>
        <FlexItem className="rde-canvas-toolbar rde-canvas-toolbar-group">
          <CommonButton
            className="rde-action-btn"
            shape="circle"
            disabled={isCropping}
            onClick={() => canvasRef.handlers.toGroup()}
            icon="object-group"
            tooltipTitle={formatMessage({id: 'editor.action.object-group'})}
          />
          <CommonButton
            className="rde-action-btn"
            shape="circle"
            disabled={isCropping}
            onClick={() => canvasRef.handlers.toActiveSelection()}
            icon="object-ungroup"
            tooltipTitle={formatMessage({id: 'editor.action.object-ungroup'})}
          />
        </FlexItem>
        <FlexItem className="rde-canvas-toolbar rde-canvas-toolbar-crop">
          <CommonButton
            className="rde-action-btn"
            shape="circle"
            disabled={canvasRef ? canvasRef.cropHandlers.validType() : true}
            onClick={() => canvasRef.cropHandlers.start()}
            icon="crop"
            tooltipTitle={formatMessage({id: 'editor.action.crop'})}
          />
          <CommonButton
            className="rde-action-btn"
            shape="circle"
            disabled={canvasRef ? !canvasRef.cropRect : true}
            onClick={() => canvasRef.cropHandlers.finish()}
            icon="check"
            tooltipTitle={formatMessage({id: 'editor.action.crop-save'})}
          />
          <CommonButton
            className="rde-action-btn"
            shape="circle"
            disabled={canvasRef ? !canvasRef.cropRect : true}
            onClick={() => canvasRef.cropHandlers.cancel()}
            icon="times"
            tooltipTitle={formatMessage({id: 'editor.action.crop-cancel'})}
          />
        </FlexItem>
        <FlexItem className="rde-canvas-toolbar rde-canvas-toolbar-operation">
          <CommonButton
            className="rde-action-btn"
            shape="circle"
            disabled={isCropping}
            onClick={() => canvasRef.handlers.saveImage()}
            icon="image"
            tooltipTitle={formatMessage({id: 'editor.action.image-save'})}
          />
          <CommonButton
            className="rde-action-btn"
            shape="circle"
            disabled={isCropping}
            onClick={() => canvasRef.handlers.duplicate()}
            icon="clone"
            tooltipTitle={formatMessage({id: 'editor.action.clone'})}
          />
          <CommonButton
            className="rde-action-btn"
            shape="circle"
            disabled={isCropping}
            onClick={() => canvasRef.handlers.remove()}
            icon="trash"
            tooltipTitle={formatMessage({id: 'editor.action.delete'})}
          />
        </FlexItem>
        <FlexItem className="rde-canvas-toolbar rde-canvas-toolbar-history">
          {/* <Button
                        className="rde-action-btn"
                        disabled={isCropping || (canvasRef && !canvasRef.undos.length)}
                        onClick={() => canvasRef.transactionHandlers.undo()}
                    >
                        <Icon name="undo-alt" style={{ marginRight: 8 }} />
                        {'Undo'}
                    </Button>
                    <Button
                        className="rde-action-btn"
                        disabled={isCropping || (canvasRef && !canvasRef.redos.length)}
                        onClick={() => canvasRef.transactionHandlers.redo()}
                    >
                        {'Redo'}
                        <Icon name="redo-alt" style={{ marginLeft: 8 }} />
                    </Button> */}
        </FlexItem>
      </FlexBox>
    );
  }
}

export default ImageMapHeaderToolbar;
