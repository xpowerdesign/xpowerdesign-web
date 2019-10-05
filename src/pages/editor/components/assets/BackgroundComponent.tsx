import {Component} from "react";
import {Dispatch} from "redux";
import * as React from "react";
import {Divider, message, notification} from 'antd';
import {connect} from "dva";
import {AssetsState, Asset} from "@/models/asset";
import {map} from 'lodash';
import styles from './BackgroundComponent.less'
import {formatMessage} from 'umi-plugin-react/locale';
import {ChromePicker} from 'react-color';
import {Icon} from 'antd';
import PropTypes from "prop-types";
import uuid from "uuid/v4";

export interface BackgroundProps {
  dispatch: Dispatch<any>;
  list: Asset[];
  canvasRef: any;
}

class BackgroundComponent extends Component<BackgroundProps> {
  static propTypes = {
    canvasRef: PropTypes.any,
  };

  state = {
    displayColorPicker: false,
    color: "#f0f0f0",
    displayColorSelected: false,
  };

  componentDidMount() {
    const {dispatch} = this.props;
    dispatch({
      type: 'assets/fetchAssetsForBackgrounds',
    });
  }

  handlers = {
    onAddItem: (color: string) => {
      const {canvasRef} = this.props;
      if (canvasRef.workarea.layout === 'responsive') {
        if (!canvasRef.workarea.isElement) {
          notification.warn({
            message: 'Please your select background image',
          });
          return;
        }
      }
      if (canvasRef.interactionMode === 'polygon') {
        message.info('Already drawing');
        return;
      }
      const id = uuid();
      const backgroundImageOptions = {
        type: 'background-shape-image',
        backgroundColor: color,
        width: Number(canvasRef.workarea.workareaWidth),
        height: Number(canvasRef.workarea.workareaHeight),
        isLocked: true,
        editable: false
      };
      const option = Object.assign({}, {id}, backgroundImageOptions);
      canvasRef.handlers.add(option, true);
    }
  };

  handleClick = () => {
    this.setState({displayColorPicker: !this.state.displayColorPicker})
  };

  handleClose = () => {
    this.setState({displayColorPicker: false})
  };

  handleChange = (color: any) => {
    let colorHex = color.hex;
    this.setState({color: colorHex, displayColorSelected: true});
    this.handlers.onAddItem(colorHex);
  };

  render() {
    const {list} = this.props;
    const colors: Asset[] = [];
    const images = [];

    list && map(list, (item) => {
      if (item.sub_type == "color") {
        colors.push(item)
      } else {
        images.push(item)
      }
    });

    return (
      <div className={styles.colorBoxWrapper}>
        <div className={styles.title}>{formatMessage({id: "editor.component.background.color"})}</div>

        <div>

          <div className={styles.colorPresetTitle}>{formatMessage({id: "editor.component.background.theme"})}</div>
          <div className={styles.colorWrapper}>
            <div className={styles.colorItem}>
              <Icon type="plus-square"
                    onClick={this.handleClick}
                    twoToneColor="#eb2f96" theme="twoTone"/>
            </div>
            <div className={styles.defaultTheme}
                 onClick={e => this.handlers.onAddItem("#3C3C3C")}
            />
            {this.state.displayColorSelected ?
              <div className={styles.defaultTheme} style={{backgroundColor: this.state.color}}/> : null}
          </div>

          {this.state.displayColorPicker ? <div className={styles.colorPicker}>
            <div className={styles.cover} onClick={this.handleClose}/>
            <ChromePicker disableAlpha={true} color={this.state.color} onChange={this.handleChange}/>
          </div> : null}

          <div className={styles.colorPresetTitle}>
            {formatMessage({id: "editor.component.background.preinstall"})}
          </div>

          <div className={styles.colorWrapper}>
            {colors.map((color, index) => {
              return (<div className={styles.colorItem} key={index}
                           onClick={e => this.handlers.onAddItem(color.resources_meta.value)}
                           style={{backgroundColor: color.resources_meta.value}}/>)
            })}
          </div>
        </div>

        <Divider/>
        <div className={styles.title}>{formatMessage({id: "editor.component.background.image"})}</div>
      </div>
    )
  }
}


export default connect(({assets}: { assets: AssetsState }) => ({
  list: assets.list
}))(BackgroundComponent);


