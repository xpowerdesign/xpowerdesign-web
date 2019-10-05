import React, {Component} from 'react';
import {ResizeSensor} from 'css-element-queries';
import {Badge, Button, Popconfirm, Menu, Icon, Layout} from 'antd';
import debounce from 'lodash/debounce';

import {formatMessage} from 'umi-plugin-react/locale';

import Canvas from '../canvas/Canvas';
import ImageMapFooterToolbar from './ImageMapFooterToolbar';

// 左边元素页面
import ImageMapItems from './ImageMapItems';

// 顶部工具页：需要重构为根据选择的元素动态变化: ImageMapTitle 与 ImageHeaderToolbar 一起合并
import ImageMapTitle from './ImageMapTitle';
import ImageMapHeaderToolbar from './ImageMapHeaderToolbar';

const {Sider} = Layout;
import BackgroundComponent from '../assets/BackgroundComponent';

import imageEditorStyles from './ImageMapEditor.less'

// 预览页面：重构为查看全屏页面
import ImageMapPreview from './ImageMapPreview';

// 右侧配置页面，重构为导入图片等功能
import ImageMapConfigurations from './ImageMapConfigurations';


import SandBox from '../sandbox/SandBox';

import '../../../../../public/styles/index.less';

import Container from '../common/Container';
import CommonButton from '../common/CommonButton';

const propertiesToInclude = [
  'id',
  'name',
  'lock',
  'file',
  'src',
  'link',
  'tooltip',
  'animation',
  'layout',
  'workareaWidth',
  'workareaHeight',
  'videoLoadType',
  'autoplay',
  'shadow',
  'muted',
  'loop',
  'code',
  'icon',
  'userProperty',
  'trigger',
  'configuration',
  'superType',
  'points',
  'svg',
  'loadType',
];

const defaultOptions = {
  fill: 'rgba(0, 0, 0, 1)',
  stroke: 'rgba(255, 255, 255, 0)',
  strokeUniform: true,
  resource: {},
  link: {
    enabled: false,
    type: 'resource',
    state: 'new',
    dashboard: {},
  },
  tooltip: {
    enabled: true,
    type: 'resource',
    template: '<div>{{message.name}}</div>',
  },
  animation: {
    type: 'none',
    loop: true,
    autoplay: true,
    delay: 100,
    duration: 1000,
  },
  userProperty: {},
  trigger: {
    enabled: false,
    type: 'alarm',
    script: 'return message.value > 0;',
    effect: 'style',
  },
};

class ImageMapEditor extends Component {
  state = {
    selectedItem: null,
    zoomRatio: 1,
    canvasRect: {
      width: 300,
      height: 300,
    },
    preview: false,
    loading: true,
    progress: 0,
    animations: [],
    styles: [],
    dataSources: [],
    editing: false,
    descriptors: {},
  };

  componentDidMount() {
    this.showLoading(true);
    import('./Descriptors.json').then((descriptors) => {
      this.setState({
        descriptors,
      }, () => {
        this.showLoading(false);
      });
    });
    this.resizeSensor = new ResizeSensor(this.container, () => {
      const {canvasRect: currentCanvasRect} = this.state;
      const canvasRect = Object.assign({}, currentCanvasRect, {
        width: this.container.clientWidth,
        height: this.container.clientHeight,
      });
      this.setState({
        canvasRect,
      });
    });
    this.setState({
      canvasRect: {
        width: this.container.clientWidth,
        height: this.container.clientHeight,
      },
      selectedItem: null,
    });
  }

  canvasHandlers = {
    onAdd: (target) => {
      const {editing} = this.state;
      if (!editing) {
        this.changeEditing(true);
      }
      if (target.type === 'activeSelection') {
        this.canvasHandlers.onSelect(null);
        return;
      }
      this.canvasRef.handlers.select(target);
    },
    onSelect: (target) => {
      const {selectedItem} = this.state;
      if (target
        && target.id
        && target.id !== 'workarea'
        && target.type !== 'activeSelection') {
        if (selectedItem && target.id === selectedItem.id) {
          return;
        }
        this.canvasRef.handlers.getObjects().forEach((obj) => {
          if (obj) {
            this.canvasRef.animationHandlers.initAnimation(obj, true);
          }
        });
        // console.log(target);
        this.setState({
          selectedItem: target,
        });
        return;
      }
      this.canvasRef.handlers.getObjects().forEach((obj) => {
        if (obj) {
          this.canvasRef.animationHandlers.initAnimation(obj, true);
        }
      });
      this.setState({
        selectedItem: null,
      });
    },
    onRemove: () => {
      const {editing} = this.state;
      if (!editing) {
        this.changeEditing(true);
      }
      this.canvasHandlers.onSelect(null);
    },
    onModified: debounce(() => {
      const {editing} = this.state;
      if (!editing) {
        this.changeEditing(true);
      }
    }, 300),
    onZoom: (zoom) => {
      this.setState({
        zoomRatio: zoom,
      });
    },
    onChange: (selectedItem, changedValues, allValues) => {
      const {editing} = this.state;
      if (!editing) {
        this.changeEditing(true);
      }
      const changedKey = Object.keys(changedValues)[0];
      const changedValue = changedValues[changedKey];
      if (allValues.workarea) {
        this.canvasHandlers.onChangeWorkArea(changedKey, changedValue, allValues.workarea);
        return;
      }
      if (changedKey === 'width' || changedKey === 'height') {
        this.canvasRef.handlers.scaleToResize(allValues.width, allValues.height);
        this.canvasRef.transactionHandlers.save(selectedItem, 'modified');
        return;
      }
      if (changedKey === 'lock') {
        this.canvasRef.handlers.setObject({
          lockMovementX: changedValue,
          lockMovementY: changedValue,
          hasControls: !changedValue,
          hoverCursor: changedValue ? 'pointer' : 'move',
          editable: !changedValue,
          lock: changedValue,
        });
        return;
      }
      if (changedKey === 'file' || changedKey === 'src' || changedKey === 'code') {
        if (selectedItem.type === 'image') {
          this.canvasRef.handlers.setImageById(selectedItem.id, changedValue);
        } else if (this.canvasRef.handlers.isElementType(selectedItem.type)) {
          this.canvasRef.elementHandlers.setById(selectedItem.id, changedValue);
        }
        return;
      }
      if (changedKey === 'link') {
        const link = Object.assign({}, defaultOptions.link, allValues.link);
        this.canvasRef.handlers.set(changedKey, link);
        return;
      }
      if (changedKey === 'tooltip') {
        const tooltip = Object.assign({}, defaultOptions.tooltip, allValues.tooltip);
        this.canvasRef.handlers.set(changedKey, tooltip);
        return;
      }
      if (changedKey === 'animation') {
        const animation = Object.assign({}, defaultOptions.animation, allValues.animation);
        this.canvasRef.handlers.set(changedKey, animation);
        return;
      }
      if (changedKey === 'icon') {
        const {unicode, styles} = changedValue[Object.keys(changedValue)[0]];
        const uni = parseInt(unicode, 16);
        if (styles[0] === 'brands') {
          this.canvasRef.handlers.set('fontFamily', 'Font Awesome 5 Brands');
        } else if (styles[0] === 'regular') {
          this.canvasRef.handlers.set('fontFamily', 'Font Awesome 5 Regular');
        } else {
          this.canvasRef.handlers.set('fontFamily', 'Font Awesome 5 Free');
        }
        this.canvasRef.handlers.set('text', String.fromCodePoint(uni));
        this.canvasRef.handlers.set('icon', changedValue);
        return;
      }
      if (changedKey === 'shadow') {
        if (allValues.shadow.enabled) {
          this.canvasRef.handlers.setShadow(changedKey, allValues.shadow);
        } else {
          this.canvasRef.handlers.setShadow(changedKey, null);
        }
        return;
      }
      if (changedKey === 'fontWeight') {
        this.canvasRef.handlers.set(changedKey, changedValue ? 'bold' : 'normal');
        return;
      }
      if (changedKey === 'fontStyle') {
        this.canvasRef.handlers.set(changedKey, changedValue ? 'italic' : 'normal');
        return;
      }
      if (changedKey === 'textAlign') {
        this.canvasRef.handlers.set(changedKey, Object.keys(changedValue)[0]);
        return;
      }
      if (changedKey === 'trigger') {
        const trigger = Object.assign({}, defaultOptions.trigger, allValues.trigger);
        this.canvasRef.handlers.set(changedKey, trigger);
        return;
      }
      if (changedKey === 'filters') {
        const filterKey = Object.keys(changedValue)[0];
        const filterValue = allValues.filters[filterKey];
        if (filterKey === 'gamma') {
          const rgb = [filterValue.r, filterValue.g, filterValue.b];
          this.canvasRef.imageHandler.applyFilterByType(filterKey, changedValue[filterKey].enabled, {gamma: rgb});
          return;
        }
        if (filterKey === 'brightness') {
          this.canvasRef.imageHandler.applyFilterByType(filterKey, changedValue[filterKey].enabled, {brightness: filterValue.brightness});
          return;
        }
        if (filterKey === 'contrast') {
          this.canvasRef.imageHandler.applyFilterByType(filterKey, changedValue[filterKey].enabled, {contrast: filterValue.contrast});
          return;
        }
        if (filterKey === 'saturation') {
          this.canvasRef.imageHandler.applyFilterByType(filterKey, changedValue[filterKey].enabled, {saturation: filterValue.saturation});
          return;
        }
        if (filterKey === 'hue') {
          this.canvasRef.imageHandler.applyFilterByType(filterKey, changedValue[filterKey].enabled, {rotation: filterValue.rotation});
          return;
        }
        if (filterKey === 'noise') {
          this.canvasRef.imageHandler.applyFilterByType(filterKey, changedValue[filterKey].enabled, {noise: filterValue.noise});
          return;
        }
        if (filterKey === 'pixelate') {
          this.canvasRef.imageHandler.applyFilterByType(filterKey, changedValue[filterKey].enabled, {blocksize: filterValue.blocksize});
          return;
        }
        if (filterKey === 'blur') {
          this.canvasRef.imageHandler.applyFilterByType(filterKey, changedValue[filterKey].enabled, {value: filterValue.value});
          return;
        }
        this.canvasRef.imageHandler.applyFilterByType(filterKey, changedValue[filterKey]);
        return;
      }
      this.canvasRef.handlers.set(changedKey, changedValue);
    },
    onChangeWorkArea: (changedKey, changedValue, allValues) => {
      if (changedKey === 'layout') {
        this.canvasRef.workareaHandlers.setLayout(changedValue);
        return;
      }
      if (changedKey === 'file' || changedKey === 'src') {
        this.canvasRef.workareaHandlers.setImage(changedValue);
        return;
      }
      if (changedKey === 'width' || changedKey === 'height') {
        this.canvasRef.handlers.originScaleToResize(this.canvasRef.workarea, allValues.width, allValues.height);
        this.canvasRef.canvas.centerObject(this.canvasRef.workarea);
        return;
      }
      this.canvasRef.workarea.set(changedKey, changedValue);
      this.canvasRef.canvas.requestRenderAll();
    },
    onTooltip: (ref, target) => {
      const value = (Math.random() * 10) + 1;
      const {animations, styles} = this.state;
      // const { code } = target.trigger;
      // const compile = SandBox.compile(code);
      // const result = compile(value, animations, styles, target.userProperty);
      // console.log(result);
      return (
        <div>
          <div>
            <div>
              <Button>
                {target.id}
              </Button>
            </div>
            <Badge count={value}/>
          </div>
        </div>
      );
    },
    onLink: (canvas, target) => {
      const {link} = target;
      if (link.state === 'current') {
        document.location.href = link.url;
        return;
      }
      window.open(link.url);
    },
    onContext: (ref, event, target) => {
      if ((target && target.id === 'workarea') || !target) {
        const {layerX: left, layerY: top} = event;
        return (
          <Menu>
            <Menu.SubMenu key="add" style={{width: 120}} title={formatMessage({id: 'editor.action.add'})}>
              {
                this.transformList().map((item) => {
                  const option = Object.assign({}, item.option, {left, top});
                  const newItem = Object.assign({}, item, {option});
                  return (
                    <Menu.Item style={{padding: 0}} key={item.name}>
                      {this.itemsRef.renderItem(newItem, false)}
                    </Menu.Item>
                  );
                })
              }
            </Menu.SubMenu>
          </Menu>
        );
      }
      if (target.type === 'activeSelection') {
        return (
          <Menu>
            <Menu.Item onClick={() => {
              this.canvasRef.handlers.toGroup();
            }}>
              {formatMessage({id: 'editor.action.object-group'})}
            </Menu.Item>
            <Menu.Item onClick={() => {
              this.canvasRef.handlers.duplicate();
            }}>
              {formatMessage({id: 'editor.action.clone'})}
            </Menu.Item>
            <Menu.Item onClick={() => {
              this.canvasRef.handlers.remove();
            }}>
              {formatMessage({id: 'editor.action.delete'})}
            </Menu.Item>
          </Menu>
        );
      }
      if (target.type === 'group') {
        return (
          <Menu>
            <Menu.Item onClick={() => {
              this.canvasRef.handlers.toActiveSelection();
            }}>
              {formatMessage({id: 'editor.action.object-ungroup'})}
            </Menu.Item>
            <Menu.Item onClick={() => {
              this.canvasRef.handlers.duplicate();
            }}>
              {formatMessage({id: 'editor.action.clone'})}
            </Menu.Item>
            <Menu.Item onClick={() => {
              this.canvasRef.handlers.remove();
            }}>
              {formatMessage({id: 'editor.action.delete'})}
            </Menu.Item>
          </Menu>
        );
      }
      return (
        <Menu>
          <Menu.Item onClick={() => {
            this.canvasRef.handlers.duplicateById(target.id);
          }}>
            {formatMessage({id: 'editor.action.clone'})}
          </Menu.Item>
          <Menu.Item onClick={() => {
            this.canvasRef.handlers.removeById(target.id);
          }}>
            {formatMessage({id: 'editor.action.delete'})}
          </Menu.Item>
        </Menu>
      );
    },
  }

  handlers = {
    onChangePreview: (checked) => {
      this.setState({
        preview: typeof checked === 'object' ? false : checked,
      }, () => {
        if (this.state.preview) {
          // 导出json数据，判断ID是否为空
          const data = this.canvasRef.handlers.exportJSON().objects.filter((obj) => {
            if (!obj.id) {
              return false;
            }
            return true;
          });
          // 在preview的canvas中导入JSON数据
          this.preview.canvasRef.handlers.importJSON(data);
          // 退出快捷键
          this.shortcutHandlers.esc();
          return;
        }
        // 清除preview canvas中操作
        this.preview.canvasRef.handlers.clear();
      });
    },
    onProgress: (progress) => {
      this.setState({
        progress,
      });
    },
    onImport: (files) => {
      if (files) {
        this.showLoading(true);
        setTimeout(() => {
          const reader = new FileReader();
          reader.onprogress = (e) => {
            if (e.lengthComputable) {
              const progress = parseInt(((e.loaded / e.total) * 100), 10);
              this.handlers.onProgress(progress);
            }
          };
          reader.onload = (e) => {
            const {objects, animations, styles, dataSources} = JSON.parse(e.target.result);
            this.setState({
              animations,
              styles,
              dataSources,
            });
            if (objects) {
              this.canvasRef.handlers.clear(true);
              const data = objects.filter((obj) => {
                if (!obj.id) {
                  return false;
                }
                return true;
              });
              this.canvasRef.handlers.importJSON(JSON.stringify(data));
            }
          };
          reader.onloadend = () => {
            this.showLoading(false);
          };
          reader.onerror = () => {
            this.showLoading(false);
          };
          reader.readAsText(files[0]);
        }, 500);
      }
    },
    onUpload: () => {
      const inputEl = document.createElement('input');
      inputEl.accept = '.json';
      inputEl.type = 'file';
      inputEl.hidden = true;
      inputEl.onchange = (e) => {
        this.handlers.onImport(e.target.files);
      };
      document.body.appendChild(inputEl); // required for firefox
      inputEl.click();
      inputEl.remove();
    },
    onDownload: () => {
      this.showLoading(true);
      const objects = this.canvasRef.handlers.exportJSON().objects.filter((obj) => {
        // filter the workArea image
        if (!obj.id || obj.id === 'workarea')
          return false;
        return true;
      });
      const {animations, styles, dataSources} = this.state;
      const exportDatas = {
        objects,
        animations,
        styles,
        dataSources,
      };
      const anchorEl = document.createElement('a');
      anchorEl.href = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(exportDatas, null, '\t'))}`;
      anchorEl.download = `${this.canvasRef.workarea.name || 'sample'}.json`;
      document.body.appendChild(anchorEl); // required for firefox
      anchorEl.click();
      anchorEl.remove();
      this.showLoading(false);
    },
    onChangeAnimations: (animations) => {
      if (!this.state.editing) {
        this.changeEditing(true);
      }
      this.setState({
        animations,
      });
    },
    onChangeStyles: (styles) => {
      if (!this.state.editing) {
        this.changeEditing(true);
      }
      this.setState({
        styles,
      });
    },
    onChangeDataSources: (dataSources) => {
      if (!this.state.editing) {
        this.changeEditing(true);
      }
      this.setState({
        dataSources,
      });
    },
    onSaveImage: () => {
      this.canvasRef.handlers.saveCanvasImage();
    },
  }

  shortcutHandlers = {
    esc: () => {
      document.addEventListener('keydown', (e) => {
        if (e.keyCode === 27) {
          this.handlers.onChangePreview(false);
        }
      }, {
        once: true,
      });
    },
  }

  transformList = () => {
    return Object.values(this.state.descriptors).reduce((prev, curr) => prev.concat(curr), []);
  }

  showLoading = (loading) => {
    this.setState({
      loading,
    });
  }

  changeEditing = (editing) => {
    this.setState({
      editing,
    });
  }

  render() {
    const {
      preview,
      selectedItem,
      canvasRect,
      zoomRatio,
      loading,
      progress,
      animations,
      styles,
      dataSources,
      editing,
      descriptors,
    } = this.state;
    const {
      onAdd,
      onRemove,
      onSelect,
      onModified,
      onChange,
      onZoom,
      onTooltip,
      onLink,
      onContext,
    } = this.canvasHandlers;
    const {
      onChangePreview,
      onDownload,
      onUpload,
      onChangeAnimations,
      onChangeStyles,
      onChangeDataSources,
      onSaveImage,
    } = this.handlers;
    const action = (
      <React.Fragment>
        <CommonButton
          className="rde-action-btn"
          shape="circle"
          icon="file-download"
          disabled={!editing}
          tooltipTitle={formatMessage({id: 'editor.action.download'})}
          onClick={onDownload}
          tooltipPlacement="bottomRight"
        />
        {
          editing ? (
            <Popconfirm
              title={formatMessage({id: 'editor.title'})}
              okText={formatMessage({id: 'editor.action.ok'})}
              cancelText={formatMessage({id: 'editor.action.cancel'})}
              onConfirm={onUpload}
              placement="bottomRight"
            >
              <CommonButton
                className="rde-action-btn"
                shape="circle"
                icon="file-upload"
                tooltipTitle={formatMessage({id: 'editor.action.upload'})}
                tooltipPlacement="bottomRight"
              />
            </Popconfirm>
          ) : (
            <CommonButton
              className="rde-action-btn"
              shape="circle"
              icon="file-upload"
              tooltipTitle={formatMessage({id: 'editor.action.upload'})}
              tooltipPlacement="bottomRight"
              onClick={onUpload}
            />
          )
        }
        <CommonButton
          className="rde-action-btn"
          shape="circle"
          icon="image"
          tooltipTitle={formatMessage({id: 'editor.action.image-save'})}
          onClick={onSaveImage}
          tooltipPlacement="bottomRight"
        />
      </React.Fragment>
    );
    const titleContent = (
      <React.Fragment>
        <span>{formatMessage({id: 'editor.name'})}</span>
      </React.Fragment>
    );
    const title = (
      <ImageMapTitle
        title={titleContent}
        action={action}
      />
    );
    const content = (
      <div className="rde-editor">
        <Sider className={imageEditorStyles.leftSider} width={100} style={{background: '#fff'}}>
          <Menu
            theme="dark"
            mode="inline"
            defaultSelectedKeys={['background']}
            style={{height: '100%', borderRight: 0}}
          >
            <Menu.Item key="background">
              <Icon type="mail"/>
              {formatMessage({id: "menu.background"})}
            </Menu.Item>
            <Menu.Item key="sticker">
              <Icon type="sketch"/>
              {formatMessage({id: "menu.sticker"})}
            </Menu.Item>
            <Menu.Item key="text">
              <Icon type="file-word"/>
              {formatMessage({id: "menu.text"})}
            </Menu.Item>
            <Menu.Item key="photo">
              <Icon type="ant-cloud"/>
              {formatMessage({id: "menu.photo"})}
            </Menu.Item>
          </Menu>
        </Sider>

        <Sider width={356} style={{background: '#f0f2f5'}}>
          <BackgroundComponent canvasRef={this.canvasRef}/>
        </Sider>

        {/*<ImageMapItems ref={(c) => {*/}
        {/*  this.itemsRef = c;*/}
        {/*}} canvasRef={this.canvasRef} descriptors={descriptors}/>*/}
        <div className="rde-editor-canvas-container">
          <div className="rde-editor-header-toolbar">
            <ImageMapHeaderToolbar canvasRef={this.canvasRef} selectedItem={selectedItem} onSelect={onSelect}/>
          </div>
          <div
            ref={(c) => {
              this.container = c;
            }}
            className="rde-editor-canvas"
          >
            <Canvas
              ref={(c) => {
                this.canvasRef = c;
              }}
              canvasOption={{
                width: canvasRect.width,
                height: canvasRect.height,
                backgroundColor: '#dcdcdc',
                selection: true,
              }}
              minZoom={30}
              defaultOptions={defaultOptions}
              propertiesToInclude={propertiesToInclude}
              onModified={onModified}
              onAdd={onAdd}
              onRemove={onRemove}
              onSelect={onSelect}
              onZoom={onZoom}
              onTooltip={onTooltip}
              onLink={onLink}
              onContext={onContext}
            />
          </div>
          <div className="rde-editor-footer-toolbar">
            <ImageMapFooterToolbar canvasRef={this.canvasRef} preview={preview} onChangePreview={onChangePreview}
                                   zoomRatio={zoomRatio}/>
          </div>
        </div>
        {/*<ImageMapConfigurations*/}
        {/*  canvasRef={this.canvasRef}*/}
        {/*  onChange={onChange}*/}
        {/*  selectedItem={selectedItem}*/}
        {/*  onChangeAnimations={onChangeAnimations}*/}
        {/*  onChangeStyles={onChangeStyles}*/}
        {/*  onChangeDataSources={onChangeDataSources}*/}
        {/*  animations={animations}*/}
        {/*  styles={styles}*/}
        {/*  dataSources={dataSources}*/}
        {/*/>*/}
        <ImageMapPreview ref={(c) => {
          this.preview = c;
        }} preview={preview} onChangePreview={onChangePreview} onTooltip={onTooltip} onLink={onLink}/>
      </div>
    );
    return (
      <Container
        title={title}
        content={content}
        loading={loading}
        className=""
      />
    );
  }
}

export default ImageMapEditor;
