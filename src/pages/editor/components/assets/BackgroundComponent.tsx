import {Component} from "react";
import {Dispatch} from "redux";
import * as React from "react";
import {Divider} from 'antd';
import {connect} from "dva";
import {AssetsState, Asset} from "@/models/asset";
import {map} from 'lodash';
import styles from './BackgroundComponent.less'
import {formatMessage} from 'umi-plugin-react/locale';
import {ChromePicker} from 'react-color';
import {Icon} from 'antd';

export interface BackgroundProps {
  dispatch: Dispatch<any>;
  list: Asset[];
}

class BackgroundComponent extends Component<BackgroundProps> {
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

  handleClick = () => {
    this.setState({displayColorPicker: !this.state.displayColorPicker})
  };

  handleClose = () => {
    this.setState({displayColorPicker: false})
  };

  handleChange = (color: any) => {
    this.setState({color: color.hex, displayColorSelected: true})
  };

  render() {
    const {list} = this.props;
    const colors = [];
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
              <Icon type="plus-square" className={styles.colorItem}
                    onClick={this.handleClick}
                    twoToneColor="#eb2f96" theme="twoTone"/>
            </div>
            <div className={styles.defaultTheme}/>
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
          <div>
            ++++
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


