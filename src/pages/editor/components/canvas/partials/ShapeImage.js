import {fabric} from 'fabric';

let stateProperties = fabric.Object.prototype.stateProperties.concat();
stateProperties.push(
  "effectId", "brightness", "isBackground", "isPhoto", "hasCropped", "cropScaleX",
  "cropScaleY", "isZoomAble", "imageBaseScale", "imageZoomAdd", "imageAngle", "imageSource"
);

let cacheProperties = fabric.Object.prototype.cacheProperties.concat();
cacheProperties.push(
  "effectId", "brightness", "isBackground", "isPhoto", "hasCropped", "cropScaleX",
  "cropScaleY", "isZoomAble", "imageBaseScale", "imageZoomAdd", "imageAngle", "imageSource"
);

const ShapeImage = fabric.util.createClass(fabric.Object, {
  type: "shape-image",
  stateProperties: stateProperties,
  cacheProperties: cacheProperties,
  shapeSource: void 0,
  imageSource: void 0,
  imageWidth: void 0,
  imageHeight: void 0,
  imageAdded: false,
  imageZoomAdd: 0,
  imageBaseScale: 1,
  imageAngle: 0,
  isZoomMode: false,
  cacheRenderCanvas: null,

  cacheRenderCanvasContext: null,
  dummyPic: null,
  isZoomAble: true,
  backgroundColor: "rgba(255,255,255,0)",
  shapeWidth: 1,
  shapeHeight: 1,
  _cropScaleX: 1,
  cropScaleY: 1,
  isPhoto: false,
  isBackground: false,
  isPattern: false,
  hasCropped: false,
  needRerenderCanvas: false,
  effectId: 0,
  brightness: 0,
  _dummyRect: null,
  setDefaultBackground(value) {
    this._set("backgroundColor", value);
  },
  setBackGround(value, swapFn) {
    /** @type {string} */
    var item = "color";
    if ("string" == typeof value) {
      this.removeImage();
      /** @type {boolean} */
      this.isBackground = true;
      this._set("backgroundColor", value);
      this.resetDummyPic();
      /** @type {boolean} */

      this.needRerenderCanvas = true;
      this.afterScale();
      this.fire("backgroundColorChange", item);
      if (swapFn) {
        swapFn();
      }
    } else {
      if ("object" == (void 0 === value ? "undefined" : o(value))) {
        /** @type {boolean} */
        this.isBackground = false;
        this.resetDummyPic();
        this._set("backgroundColor", "rgba(255,255,255,0)");
        this.setImageSource(value, swapFn);
        /** @type {string} */
        item = "image";
      }
    }
  },
  // 初始化双击事件模仿
  initDoubleClickSimulation() {
    /** @type {number} */
    this.__lastClickTime = +new Date;
    this.__lastPointer = {};
    this.on("mousedown", this.onMouseDown.bind(this));
  },
  // 鼠标出发点击
  onMouseDown(options) {
    /** @type {number} */
    this.__newClickTime = +new Date;
    let newPointer = this.canvas.getPointer(options.e);
    if (this.isDoubleClick(newPointer)) {
      if (!this.imageSource) {
        return;
      }
      if (this.isZoomMode) {
        this.exitZoomMode();
      } else {
        this.enterZoomMode();
      }
      this.fire("dblclick", options);
      this._stopEvent(options.e);
    }
    /** @type {number} */
    this.__lastClickTime = this.__newClickTime;
    this.__lastPointer = newPointer;
  },
  // 判断是不是鼠标双击
  isDoubleClick(newPointer) {
    return this.__newClickTime - this.__lastClickTime < 500 &&
      this.__lastPointer.x === newPointer.x &&
      this.__lastPointer.y === newPointer.y;
  },
  // 阻止事件冒泡和取消默认事件
  _stopEvent(event) {
    if (event.preventDefault) {
      event.preventDefault();
    }
    if (event.stopPropagation) {
      event.stopPropagation();
    }
  },
  beforeCropProp: null,
  // 进入缩放视图模式：根据绘图的大小判断元素的尺寸
  enterZoomMode() {
    // 如果元素是可以视图化的 && 不为视图模式 && 图片已经被加入 && 不需要形成图像
    if (this.isZoomAble && !this.isZoomMode && this.imageAdded && !this.isPattern) {
      // 不为图片和分组
      if (!(this.isPhoto && this.group)) {
        /** @type {boolean} */
        this.isZoomMode = true;
        // 裁剪前的props
        this.beforeCropProp = {
          imageZoomAdd: this.imageZoomAdd,
          cropScaleX: this.cropScaleX,
          cropScaleY: this.cropScaleY,
          scaleX: this.scaleX,
          scaleY: this.scaleY,
          imageLeft: this.image.left,
          imageTop: this.image.top,
          imageScaleX: this.image.scaleX,
          imageScaleY: this.image.scaleY
        };
        // 将对象的原点位置设置为中心
        this._setOriginToCenter();
        // 不为 被裁剪过的 或者是非图片的元素 或者 分组
        if (!(this.hasCropped || !this.isPhoto || this.group)) {
          this.cropScaleX /= 2;
          this.cropScaleY /= 2;
          this.set("scaleX", this.scaleX / 2);
          this.set("scaleY", this.scaleY / 2);
          // 设置坐标点
          this.setCoords();
          this._updateShapeScale();
          /** @type {number} */
          this.image.left = this.image.left - .5 * this.shapeOriginalWidth * this.cropScaleX;
          /** @type {number} */
          this.image.top = this.image.top - .5 * this.shapeOriginalHeight * this.cropScaleY;
          this.image.setCoords();
        }
        this.renderCanvas();
        this.fire("enterZoomMode");
      }
    }
  },
  // 退出缩放视图模式
  exitZoomMode(zoomAware) {
    // 图片被加入并且不为模式
    if (this.imageAdded && !this.isPattern) {
      // 未变焦 && 有裁剪前的属性
      if (!zoomAware && this.beforeCropProp) {
        this.cropScaleX = this.beforeCropProp.cropScaleX;
        this.cropScaleY = this.beforeCropProp.cropScaleY;
        this.set("scaleX", this.beforeCropProp.scaleX);
        this.set("scaleY", this.beforeCropProp.scaleY);
        this.setCoords();
        // 更能原色的形状比例
        this._updateShapeScale();
        this.image.left = this.beforeCropProp.imageLeft;
        this.image.top = this.beforeCropProp.imageTop;
        this.image.scaleX = this.beforeCropProp.imageScaleX;
        this.image.scaleY = this.beforeCropProp.imageScaleY;
        this.imageZoomAdd = this.beforeCropProp.imageZoomAdd;
        this.image.setCoords();
        this._resetOrigin();
      }
      if (zoomAware) {
        /** @type {boolean} */
        this.hasCropped = true;
      }
      /** @type {null} */
      this.beforeCropProp = null;
      /** @type {boolean} */
      this.isZoomMode = false;
      /** @type {boolean} */
      this.hasControls = true;
      this.renderCanvas();
      this.fire("exitZoomMode");
    }
  },
  handleAllReady: null,
  checkAllReady() {
    // if (!(
    //   (void 0 != this.shapeSource || void 0 != this.clipShape) && void 0 == this.clipShape || void 0 != this.imageSource && void 0 == this.image)
    // ) {
    //
      // if (!_.isEmpty(this.handleAllReady)) {
        // this.handleAllReady.call(null, this);
      // }
    // }
  },
  getDefaultDummyPic() {
    if (this.isBackground) {
      if (_.isEmpty(this._dummyRect)) {
        this._dummyRect =
          this._dummyRect = new fabric.Rect({
            width: 10,
            height: 10,
            fill: "rgba(255,255,255,1)",
            strokeWidth: 0,
            objectCaching: false
          });
        return this._dummyRect;
      }
    } else {
      // return fabric.ShapeImage.defaultDummyPic;
      console.debug("debug: fabric.ShapeImage.defaultDummyPic")
    }
  },
  initialize(obj, t) {
    /** @type {number} */
    this.strokeWidth = 0;
    let container = this;
    obj = obj || {};
    if (void 0 === obj.cropScaleX && obj.scaleX) {
      obj.cropScaleX = obj.scaleX;
    }
    if (void 0 === obj.cropScaleY && obj.scaleY) {
      obj.cropScaleY = obj.scaleY;
    }
    if (isNode) {
      this.cacheRenderCanvas = (new fabric.createCanvasForNode).getElement();
    } else {
      this.cacheRenderCanvas = fabric.document.createElement("canvas");
    }
    this.cacheRenderCanvasContext = this.cacheRenderCanvas.getContext("2d");
    if (obj.isZoomAble) {
      this.isZoomAble = obj.isZoomAble;
    }
    if (obj.shapeSource) {
      this.shapeSource = obj.shapeSource;
    }
    if (obj.clipShape) {
      this.clipShape = obj.clipShape;
    }
    if (obj.imageBaseScale) {
      this.imageBaseScale = obj.imageBaseScale;
    }
    if (obj.imageZoomAdd) {
      this.imageZoomAdd = obj.imageZoomAdd;
    }
    if (obj.imageAngle) {
      this.imageAngle = obj.imageAngle;
    }
    if (obj.isBackground) {
      this.isBackground = obj.isBackground;
    }

    // 右下侧浮窗
    // if (!isNode) {
      // this.resetDummyPic();
    // }
    /** @type {!Function} */
    this.handleAllReady = t;

    let image = obj.image;
    if (obj.image) {
      delete obj.image;
    }
    this.on("added", () => {
      container.canvas.on("selection:cleared", () => {
        if (this.isZoomMode) {
          container.exitZoomMode();
        }
      });
    });

    this.callSuper("initialize", obj);
    if (image) {
      this.imageSource = image;
      if (void 0 !== obj.originalWidth) {
        image.originalWidth = obj.originalWidth;
      }
      if (void 0 !== obj.originalHeight) {
        image.originalHeight = obj.originalHeight;
      }
      this.setImageSource(image, this.checkAllReady.bind(this), false);
    } else {
      if (obj.imageSource) {
        if (void 0 !== obj.originalWidth) {
          obj.imageSource.originalWidth = obj.originalWidth;
        }
        if (void 0 !== obj.originalHeight) {
          obj.imageSource.originalHeight = obj.originalHeight;
        }
        this.setImageSource(obj.imageSource, this.checkAllReady.bind(this), false);
      } else {
        if (obj.isBackground) {
          this.setBackGround(obj.backgroundColor);
        }
      }
    }
    // if (obj.clipShape) {
    //   container.setClipShape(obj.clipShape);
    //   container.checkAllReady();
    // } else {
    //   if (obj.shapeSource) {
    //     fabric.loadSVGFromURL(obj.shapeSource, (objects, options) => {
    //       if (objects && objects.length > 0) {
    //         objects.forEach((canCreateDiscussions) => {
    //           /** @type {boolean} */
    //           canCreateDiscussions.objectCaching = false;
    //         });
    //         /** @type {boolean} */
    //         options.objectCaching = false;
    //         container.setClipShape(new fabric.PathGroup(objects, options));
    //         container.checkAllReady();
    //       } else {
    //         container.setDefaultClipShape(obj);
    //       }
    //     });
    //   } else {
    //     container.setDefaultClipShape(obj);
    //   }
    // }

    /** @type {boolean} */
    this.objectCaching = false;
  },
  setDefaultClipShape(layer) {
    this.setClipShape(new fabric.Rect({
      top: 0,
      left: 0,
      width: layer.width ? layer.width : 100,
      height: layer.height ? layer.height : 100,
      rx: layer.roundCorner ? layer.roundCorner / (layer.scaleX ? layer.scaleX : 1) : 0,
      ry: layer.roundCorner ? layer.roundCorner / (layer.scaleY ? layer.scaleY : 1) : 0,
      angle: 0,
      minScaleLimit: 1e-8,
      strokeWidth: 0,
      objectCaching: false
    }));
    this.checkAllReady();
  },
  setSize(h, w) {
    this.set({width: h, height: w});
    if (this.clipShape) {
      this.clipShape.set({width: h, height: w});
    }
    this.shapeOriginalWidth = h;
    this.shapeOriginalHeight = w;
    this.shapeWidth = this.shapeOriginalWidth;
    this.shapeHeight = this.shapeOriginalHeight;
    this.setCoords();
    this._updateShapeScale();
    if (this.image) {
      this._updateImageScale();
      this._updateImageOffset();
    }
    /** @type {boolean} */

    this.needRerenderCanvas = true;
    this.renderCanvas();
  },
  _dropAreaRect: null,
  getDropAreaRect() {
    if (_.isEmpty(this._dropAreaRect)) {
      this._dropAreaRect = new fabric.Rect({
        width: 10,
        height: 10,
        fill: "black",
        opacity: 0
      });
      return this._dropAreaRect;
    }
  },
  _isDragOvering: false,
  handleDragOver() {
    /** @type {boolean} */
    this._isDragOuting = false;
    if (!this._isDragOvering) {
      /** @type {boolean} */
      this._isDragOvering = true;
      this.getDropAreaRect().animate("opacity", .3, {
        duration: 300,
        onChange: this.forceRenderAll.bind(this),
        easing: fabric.util.ease.easeOutCubic
      });
    }
  },
  _isDragOuting: false,
  handleDragOut() {
    /** @type {boolean} */
    this._isDragOvering = false;
    if (!this._isDragOuting) {
      /** @type {boolean} */
      this._isDragOuting = true;
      this.getDropAreaRect().animate("opacity", 0, {
        duration: 300,
        onChange: this.forceRenderAll.bind(this),
        easing: fabric.util.ease.easeOutCubic
      });
    }
  },
  onDeselect(callback) {
    if (this.isZoomMode) {
      this.exitZoomMode(true);
    }
    /** @type {boolean} */
    this.selected = false;
    fabric.Object.prototype.onDeselect.call(this, callback);
  },
  cacheOffsetScale: 1,
  renderCacheCanvas() {
    if (this.clipShape) {
      /** @type {boolean} */
      this.clipShape.dirty = true;
    }
    /** @type {number} */
    var percentage = this.shapeWidth * Math.abs(this.scaleX);
    /** @type {number} */
    var h = this.shapeHeight * Math.abs(this.scaleY);
    /** @type {number} */
    this.cacheOffsetScale = Math.max(600 / Math.max(percentage, h), Math.min(1, 3e3 / Math.max(percentage, h)));
    /** @type {number} */
    percentage = percentage * this.cacheOffsetScale;
    /** @type {number} */
    h = h * this.cacheOffsetScale;
    this.cacheRenderCanvas.setAttribute("width", Math.ceil(percentage));
    this.cacheRenderCanvas.setAttribute("height", Math.ceil(h));
    this.cacheRenderCanvasContext.save();
    this.cacheRenderCanvasContext.clearRect(0, 0, this.cacheRenderCanvas.width, this.cacheRenderCanvas.height);
    this.cacheRenderCanvasContext.save();
    this.cacheRenderCanvasContext.scale(this.cacheOffsetScale, this.cacheOffsetScale);
    this.cacheRenderCanvasContext.scale(Math.abs(this.scaleX), Math.abs(this.scaleY));
    if (this.imageAdded && this.image && this.image.alive) {
      this.image.canvas = this.canvas;
      this.image.render(this.cacheRenderCanvasContext);
    } else {
      if (this.dummyPic) {
        if (this.isBackground) {
          this.dummyPic.fill = this.backgroundColor;
        }
        this.dummyPic.canvas = this.canvas;
        this.dummyPic.render(this.cacheRenderCanvasContext);
      }
    }
    this.cacheRenderCanvasContext.restore();
    if (this._isDragOvering) {
      this.getDropAreaRect().set({
        width: percentage,
        height: h
      });
      this.getDropAreaRect().render(this.cacheRenderCanvasContext);
    }
    this.cacheRenderCanvasContext.scale(this.cacheOffsetScale, this.cacheOffsetScale);
    this.cacheRenderCanvasContext.scale(Math.abs(this.cropScaleX), Math.abs(this.cropScaleY));
    this.cacheRenderCanvasContext.scale(Math.abs(this.scaleX), Math.abs(this.scaleY));
    /** @type {string} */
    this.cacheRenderCanvasContext.globalCompositeOperation = "destination-in";
    /** @type {boolean} */
    // this.clipShape.objectCaching = false;
    // this.clipShape.render(this.cacheRenderCanvasContext);
    this.cacheRenderCanvasContext.restore();
    /** @type {boolean} */
    this.needRerenderCanvas = false;
  },
  _render(ctx) {
    this.ctx = ctx;

    if (this.needRerenderCanvas) {
      this.renderCacheCanvas();
    }
    if (this.isZoomMode) {
      ctx.save();
      ctx.translate(-this.width / 2, -this.height / 2);
      ctx.scale(Math.abs(1 / this.cropScaleX), Math.abs(1 / this.cropScaleY));
      if (this.image && this.image.render) {
        this.image.render(ctx);
      }
      ctx.restore();
    } else {
      ctx.save();
      ctx.translate(-this.width / 2, -this.height / 2);
      ctx.scale(Math.abs(1 / this.cropScaleX), Math.abs(1 / this.cropScaleY));
      ctx.scale(1 / this.scaleX, 1 / this.scaleY);
      ctx.scale(1 / this.cacheOffsetScale, 1 / this.cacheOffsetScale);
      ctx.drawImage(this.cacheRenderCanvas, 0, 0);
      ctx.restore();
    }
  },
  isControlVisible(controlName) {
    if (this.isZoomMode) {
      if (!this.isPhoto) {
        return false;
      }
      if ("tl" !== controlName && "bl" !== controlName && "tr" !== controlName && "br" !== controlName) {
        return false;
      }
    } else {
      if (this.isLocked) {
        return false;
      }
    }
    return this._getControlsVisibility()[controlName];
  },
  drawBorders(ctx, styleOverride, width) {
    styleOverride = styleOverride || {};
    if (!this.hasBorders || styleOverride && void 0 != styleOverride.hasBorders && !styleOverride.hasBorders) {
      return this;
    }
    let wh = this._calculateCurrentDimensions();
    /** @type {number} */
    let strokeWidth = 1 / this.borderScaleFactor;
    let w = wh.x + strokeWidth;
    let height = wh.y + strokeWidth;
    return ctx.save(), ctx.globalAlpha = this.isMoving ? this.borderOpacityWhenMoving : 1, ctx.strokeStyle = styleOverride.borderColor || this.borderColor, width ? ctx.strokeStyle = "rgba(169, 146, 82, 1)" : (ctx.strokeRect(-w / 2, -height / 2, w, height), ctx.strokeStyle = "white"), this.isZoomMode && (ctx.strokeStyle = "rgba(0,0,0,0)"), this._setLineDash(ctx, styleOverride.borderDashArray || this.borderDashArray || [3, 3], null), ctx.lineWidth = 1 / this.borderScaleFactor, ctx.strokeRect(-w /
      2, -height / 2, w, height), ctx.restore(), this;
  },
  drawControls(ctx, styleOverride) {
    if (!this.hasControls || styleOverride && void 0 !== styleOverride.hasControls && !styleOverride.hasControls || this.group && !this.isZoomMode) {
      return this;
    }
    let wh = this._calculateCurrentDimensions(true);
    let width = wh.x;
    let height = wh.y;
    /** @type {number} */
    let left = -width / 2;
    /** @type {number} */
    let top = -height / 2;
    /** @type {number} */
    let delta = this.cornerSize / 2;
    if (ctx.save(), ctx.globalAlpha = this.isMoving ? 0 : 1, ctx.lineWidth = 2 / this.borderScaleFactor, ctx.strokeStyle = this.cornerStrokeColor, ctx.setLineDash([]), this._drawControl("tl", ctx, "fill", left - delta, top - delta), this._drawControl("tr", ctx, "fill", left + width - delta, top - delta), this._drawControl("bl", ctx, "fill", left - delta, top + height - delta), this._drawControl("br", ctx, "fill", left + width - delta, top + height - delta), this.isZoomMode || (this.get("lockUniScaling") ||
    "activeSelection" == this.type || (this.get("lockScalingY") || (this._drawControl("mt", ctx, "fill", left + width / 2 - delta, top - delta), this._drawControl("mb", ctx, "fill", left + width / 2 - delta, top + height - delta)), this.get("lockScalingX") || (this._drawControl("mr", ctx, "fill", left + width - delta, top + height / 2 - delta), this._drawControl("ml", ctx, "fill", left - delta, top + height / 2 - delta))), this.hasRotatingPoint && this._drawControl("mtr", ctx, "fill", left + width /
      2 - delta, top - this.rotatingPointOffset - delta)), ctx.restore(), this.isZoomMode) {
      ctx.save();
      ctx.translate(left, top);
      let vpt = this.getViewportTransform();
      vpt = fabric.util.multiplyTransformMatrices(vpt, [(this.flipX ? -1 : 1) * this.scaleX / this.cropScaleX, 0, 0, (this.flipY ? -1 : 1) * this.scaleY / this.cropScaleY, 0, 0]);
      let p = fabric.util.transformPoint(this.image.getCenterPoint().addEquals({
        x: this.flipX ? -this.width * this.cropScaleX : 0,
        y: this.flipY ? -this.height * this.cropScaleY : 0
      }), vpt, true);
      ctx.translate(p.x, p.y);
      ctx.rotate(fabric.util.degreesToRadians(this.image.angle));
      this.image.drawControls(ctx);
      this.image.drawBorders(ctx);
      ctx.restore();
    }
    return this;
  },
  _drawControl(control, ctx, name, x, y) {
    if (this.isControlVisible(control)) {
      /** @type {number} */
      let width = this.cornerSize / this.borderScaleFactor;
      /** @type {number} */
      let PI = 0;
      /** @type {number} */
      let angle = 2 * Math.PI;
      if (this.transparentCorners || ctx.clearRect(x, y, width, width), "tl" == control || "tr" == control || "bl" == control || "br" == control) {
        let g_avatarImage;
        /** @type {number} */
        let padding = -4;
        /** @type {number} */
        let p = -4;
        if ("tl" == control) {
          /** @type {number} */
          PI = Math.PI / 2;
          g_avatarImage = fabric.Object.cropTLIcon;
        } else {
          if ("tr" == control) {
            /** @type {number} */
            PI = Math.PI;
            /** @type {number} */
            angle = Math.PI / 2;
            /** @type {number} */
            padding = 4 - fabric.Object.cropTRIcon.width;
            g_avatarImage = fabric.Object.cropTRIcon;
          } else {
            if ("bl" == control) {
              /** @type {number} */
              angle = 3 * Math.PI / 2;
              /** @type {number} */
              p = 4 - fabric.Object.cropBLIcon.height;
              g_avatarImage = fabric.Object.cropBLIcon;
            } else {
              if ("br" == control) {
                /** @type {number} */
                PI = -Math.PI / 2;
                /** @type {number} */
                angle = Math.PI;
                /** @type {number} */
                padding = 4 - fabric.Object.cropBRIcon.width;
                /** @type {number} */
                p = 4 - fabric.Object.cropBRIcon.height;
                g_avatarImage = fabric.Object.cropBRIcon;
              }
            }
          }
        }
        if (this.isZoomMode) {
          ctx.drawImage(g_avatarImage, x + width / 2 + padding, y + width / 2 + p);
        } else {
          ctx.beginPath();
          ctx.moveTo(x + width / 2, y + width / 2);
          ctx.arc(x + width / 2, y + width / 2, width / 2, PI, angle);
          ctx.closePath();
          ctx[name]();
          ctx.stroke();
        }
      } else {
        if ("mtr" == control) {
          ctx.drawImage(fabric.Object.rotateIcon, x + width / 2 - fabric.Object.rotateIcon.width / 2, y + width / 2 - fabric.Object.rotateIcon.height / 2);
        } else {
          if ("ml" == control) {
            /** @type {number} */
            PI = Math.PI / 2;
            /** @type {number} */
            angle = 3 * Math.PI / 2;
          } else {
            if ("mr" == control) {
              /** @type {number} */
              PI = -Math.PI / 2;
              /** @type {number} */
              angle = Math.PI / 2;
            } else {
              if ("mt" == control) {
                /** @type {number} */
                PI = Math.PI;
                /** @type {number} */
                angle = 0;
              } else {
                if ("mb" == control) {
                  /** @type {number} */
                  PI = 0;
                  /** @type {number} */
                  angle = Math.PI;
                }
              }
            }
          }
          ctx.beginPath();
          ctx.moveTo(x + width / 2, y + width / 2);
          ctx.arc(x + width / 2, y + width / 2, width / 2, PI, angle);
          ctx.closePath();
          ctx[name]();
          ctx.stroke();
        }
      }
    }
  },
  setClipShape(propAccessorObj) {
    let p = this;
    /** @type {!Object} */
    p.clipShape = propAccessorObj;
    /** @type {number} */
    p.clipShape.strokeWidth = 0;
    p.shapeOriginalWidth = p.clipShape.width;
    p.shapeOriginalHeight = p.clipShape.height;
    /** @type {number} */
    p.clipShape.left = p.clipShape.top = 0;
    p.setSize(p.clipShape.width, p.clipShape.height);
    p.forceRenderAll();
  },
  forceRenderAll() {

    this.needRerenderCanvas = true;
    this.renderCanvas();
  },
  setImageSource(data, source, image) {
    let me = this;
    if (void 0 == image && (image = true), this.hasFitScale = !image, this.imageSource = data, data && data.originalWidth && void 0 != data.originalWidth && (this.originalWidth = data.originalWidth), data && data.originalHeight && void 0 != data.originalHeight && (this.originalHeight = data.originalHeight), null == data) {
      return void this.removeImage();
    }
    /** @type {boolean} */
    this.imageAdded = true;
    /** @type {null} */
    this.image = null;
    if ("image" == data.type) {
      this.imageWidth = data.width;
      this.imageHeight = data.height;
    } else {
      if (void 0 != data.fileWidth) {
        this.imageWidth = data.fileWidth;
      } else {
        if (void 0 != data.initWidth) {
          this.imageWidth = data.initWidth;
        }
      }
      if (void 0 != data.fileHeight) {
        this.imageHeight = data.fileHeight;
      } else {
        if (void 0 != data.initHeight) {
          this.imageHeight = data.initHeight;
        }
      }
    }
    if (void 0 == data.originX) {
      /** @type {string} */
      data.originX = "center";
    }
    if (void 0 == data.originY) {
      /** @type {string} */
      data.originY = "center";
    }
    if (void 0 == data.left) {
      /** @type {number} */
      data.left = me.shapeWidth / 2;
    }
    if (void 0 == data.top) {
      /** @type {number} */
      data.top = me.shapeHeight / 2;
    }
    if ("nine-grid-path-group" == data.type) {
      fabric.NineGridPathGroup.fromObject(data, function (item) {
        /** @type {!Object} */
        me.image = item;
        item.set("width", me.width);
        item.set("height", me.height);
        me.imageWidth = item.width;
        me.imageHeight = item.height;
        item.afterScale();
        me._initImage(source);
        me.fire("imageChange");
      });
    } else {
      fabric.Image.fromObject(data, function (label) {
        if (null != label) {
          if (null != label.getElement()) {
            /** @type {!Object} */
            me.image = label;
            if (!(void 0 == data.miniSrc && void 0 == data.thumbUrl && void 0 == data.fileId && void 0 == data.resId)) {
              /**
               * @return {undefined}
               */
              me.image.handleOriginalSrcLoaded = function () {
                if (me.image && me.image.getOriginalSize) {
                  let data = me.image.getOriginalSize();
                  if (void 0 == me.imageWidth) {
                    me.imageWidth = data.width;
                    me.imageHeight = data.height;
                  }
                  me._initImage(source);
                }
              };
            }
            /** @type {boolean} */
            me._initImage(void 0 != data.miniSrc || void 0 != data.thumbUrl ? null : source);
          } else {
            /**
             * @return {undefined}
             */
            label.handleOriginalSrcLoaded = function () {
              /** @type {!Object} */
              me.image = label;
              me._initImage(source);
            };
          }
          me.fire("imageChange");
        }
      });
    }
  },
  _initImage(b) {
    let mediaLoaded = this;
    this.image.group = this;
    this.setImageAngle(this.imageAngle);
    this.image.setCoords();
    this.on("mousewheel", this.___onMouseWheel.bind(this));
    /** @type {boolean} */

    this.needRerenderCanvas = true;
    this.cachedSvg = void 0;
    if ("image" == this.image.type) {
      this.image.updateFilters();
    }
    this.renderCanvas();
    if (b) {
      b(mediaLoaded);
    }
    /** @type {boolean} */
    this.imageAdded = true;
    this.fire("imageChange", {
      target: this
    });
    if (this.canvas) {
      this.canvas.fire("shapeImage:imageChange", {
        target: this
      });
    }
    this.afterUpdated();
  },
  scaleEqually(charIndex, value) {
    this.get("scaleX");
    this.get("scaleY");
    this.shapeWidth;
    this.shapeHeight;
    this.scaleX;
    this.callSuper("_set", "scaleX", charIndex);
    this.callSuper("_set", "scaleY", value);
    /** @type {boolean} */

    this.needRerenderCanvas = true;
  },
  afterScale(canCreateDiscussions) {
    this._updateShapeScale();
    if (this.image) {
      this._updateImageScale();
      this._updateImageOffset();
    }
    /** @type {boolean} */

    this.needRerenderCanvas = true;
    this.renderCanvas();
  },
  ___onMouseWheel(event) {
    if (this.isZoomMode) {
      if (!this.imageAdded || this.canvas.isColorPickMode || this.canvas && this.canvas.getActiveObject() != this) {
        return;
      }
      /** @type {number} */
      let clojIsReversed = this.imageZoomAdd - (event.e.deltaY > 0 ? .07 : -.07);
      if (clojIsReversed < 0) {
        /** @type {number} */
        clojIsReversed = 0;
      }
      if (clojIsReversed > 4) {
        /** @type {number} */
        clojIsReversed = 4;
      }
      this.setImageZoomAdd(clojIsReversed);
      /** @type {boolean} */

      this.needRerenderCanvas = true;
      this.renderCanvas();
      event.e.stopPropagation();
      event.e.preventDefault();
    }
  },
  _set(key, value) {
    let defaultValue = this.get(key);
    this.callSuper("_set", key, value);
    let obj = this;
    // if ("width" === key || "height" === key) {
    //   fabric.util.transformPoint(
    //     new fabric.Point(20, 20),
    //     // fabric.util.invertTransform(Fotor.canvas.viewportTransform),
    //     true
    //   );
    // }
    if ("scaleX" == key && value != defaultValue || "scaleY" == key && value != defaultValue) {
      /** @type {null} */
      let options = null;
      if (("scaleX" == key || "scaleY" == key) && this.canvas && this.canvas._currentTransform) {
        if (this.canvas._currentTransform instanceof Array) {
          options = this.canvas._currentTransform.find(function (n) {
            return n.target == obj;
          });
        } else {
          if (this.canvas._currentTransform.target == obj) {
            options = this.canvas._currentTransform;
          }
        }
      }
      if (this.isZoomMode || this.isPhoto) {
        if (this.isZoomMode && options) {
          if ("scaleX" == key) {
            /** @type {number} */
            this.cropScaleX = value / options.scaleX * options.cropScaleX;
          }
          if ("scaleY" == key) {
            /** @type {number} */
            this.cropScaleY = value / options.scaleY * options.cropScaleY;
          }
          this._updateShapeScale();
          if ("scaleX" == key && ("right" == options.originX && !this.flipX || "left" == options.originX && this.flipX) && this.image) {
            /** @type {number} */
            this.image.left = options.imageTransform.left - this.shapeOriginalWidth * (1 - value / options.scaleX) * options.cropScaleX;
          }
          if ("scaleY" == key && ("bottom" == options.originY && !this.flipY || "top" == options.originY && this.flipY) && this.image) {
            /** @type {number} */
            this.image.top = options.imageTransform.top - this.shapeOriginalHeight * (1 - value / options.scaleY) * options.cropScaleY;
          }
        }
      } else {
        if ("scaleX" == key && options && this.image) {
          this.image.left *= value / defaultValue;
        }
        if ("scaleY" == key && options && this.image) {
          this.image.top *= value / defaultValue;
        }
        if ("scaleX" == key && options) {
          /** @type {number} */
          this.cropScaleX = value / options.scaleX * options.cropScaleX;
        }
        if ("scaleY" == key && options) {
          /** @type {number} */
          this.cropScaleY = value / options.scaleY * options.cropScaleY;
        }
        this._updateShapeScale();
        this._updateImageScale();
        this._updateImageOffset();
      }

      /** @type {boolean} */
      this.needRerenderCanvas = true;
    }
  },

  // 更新形状比例
  _updateShapeScale() {

    // 需要裁剪形状 && 需要假照 && image是否为空
    if (this.clipShape && (this.dummyPic && _.isEmpty(this.image))) {
      this.shapeWidth = Math.max(1, this.shapeOriginalWidth * Math.abs(this.cropScaleX));
      this.shapeHeight = Math.max(1, this.shapeOriginalHeight * Math.abs(this.cropScaleY));

      // 小标签比例
      let hourLabelsScale = 1;
      if (this.dummyPic.type === "image") {
        hourLabelsScale = Math.max(
          this.shapeWidth / this.dummyPic.getOriginalSize().width,
          this.shapeHeight / this.dummyPic.getOriginalSize().height
        )
      } else {
        hourLabelsScale = Math.max(
          this.shapeWidth / this.dummyPic.width,
          this.shapeHeight / this.dummyPic.height
        );
      }
      this.dummyPic.scale(hourLabelsScale);

      // 判断假照的类型是否为矩形
      if (this.dummyPic.type !== "rect") {
        this.dummyPic.left = this.shapeWidth / 2;
        this.dummyPic.top = this.shapeHeight / 2;
      } else {
        this.dummyPic.left = 0;
        this.dummyPic.top = 0;
      }
    }
  },
  // 重置假照
  resetDummyPic() {
    let t = this;
    let url = this.getDefaultDummyPic();
    if ("string" == typeof url) {
      fabric.Image.fromURL(url, function (ecma5) {
        /** @type {!Object} */
        t.dummyPic = ecma5;
        t.dummyPic.group = t;
        /** @type {string} */
        t.dummyPic.originX = "center";
        /** @type {string} */
        t.dummyPic.originY = "center";
        t._updateShapeScale();
        if (!t.imageAdded) {
          /** @type {boolean} */

          t.needRerenderCanvas = true;
          t.renderCanvas();
        }
      }, {
        crossOrigin: "Anonymous"
      });
    } else {
      t.dummyPic = url;
      t._updateShapeScale();
      if (!t.imageAdded) {
        /** @type {boolean} */

        t.needRerenderCanvas = true;
        t.renderCanvas();
      }
    }
  },
  isImageSwitchHV() {
    return Math.round(this.image.angle / 90) % 2 != 0;
  },
  rotateImageLeft() {
    this.saveState();
    this.setImageAngle(this.imageAngle - 90);
  },
  rotateImageRight() {
    this.saveState();
    this.setImageAngle(this.imageAngle + 90);
  },
  flipImageH() {
    this.saveState();
    this.setImageFlipX(!this.image.flipX);
  },
  flipImageV() {
    this.saveState();
    this.setImageFlipY(!this.image.flipY);
  },
  setImageAngle(url) {
    /** @type {number} */
    this.imageAngle = url;
    if (this.image) {
      /** @type {number} */
      this.image.angle = url;
      this._updateImageScale();
      this._updateImageOffset();
      /** @type {boolean} */

      this.needRerenderCanvas = true;
    }
  },
  setImageFlipX(url) {
    if (this.image) {
      /** @type {!Object} */
      this.image.flipX = url;
      this._updateImageScale();
      this._updateImageOffset();
      /** @type {boolean} */

      this.needRerenderCanvas = true;
    }
  },
  setImageFlipY(url) {
    if (this.image) {
      /** @type {boolean} */
      this.image.flipY = url;
      this._updateImageScale();
      this._updateImageOffset();
      /** @type {boolean} */

      this.needRerenderCanvas = true;
    }
  },
  hasFitScale: false,
  fitScale: 1,
  lastShapeWidth: 1,
  lastShapeHeight: 1,
  _updateImageScale(canCreateDiscussions) {
    if (void 0 != this.clipShape && void 0 != this.image) {
      if (this.image instanceof fabric.NineGridPathGroup) {
        this.imageWidth = this.image.width;
        this.imageHeight = this.image.height;
      }
      this.lastShapeWidth = this.shapeWidth;
      this.lastShapeHeight = this.shapeHeight;
      let link;
      if (1 != canCreateDiscussions) {
        let loose = this.isImageSwitchHV();
        let velProj = loose ? this.imageHeight : this.imageWidth;
        let r = loose ? this.imageWidth : this.imageHeight;
        /** @type {number} */
        let start = Math.abs(this.image.scaleX);
        if (this.hasFitScale) {
          this.fitScale;
          /** @type {number} */
          this.fitScale = Math.max(this.shapeWidth / velProj, this.shapeHeight / r);
          this.image.left *= this.shapeWidth / this.lastShapeWidth;
          this.image.top *= this.shapeHeight / this.lastShapeHeight;
          /** @type {number} */
          link = Math.max(this.fitScale, start);
          /** @type {number} */
          this.imageZoomAdd = link / this.fitScale - 1;
        } else {
          /** @type {number} */
          link = Math.max(this.shapeWidth / velProj, this.shapeHeight / r);
          /** @type {number} */
          this.fitScale = link;
          /** @type {number} */
          this.imageZoomAdd = 0;
          /** @type {boolean} */
          this.hasFitScale = true;
        }
      }
      this.image.scale(this.fitScale * (1 + this.imageZoomAdd));
      this.fire("zoomChange");
    }
  },
  _updateImageOffset() {
    if (void 0 != this.clipShape && void 0 != this.image && !isNaN(this.imageWidth)) {
      let point = this.isImageSwitchHV();
      let x = point ? this.imageHeight : this.imageWidth;
      let y = point ? this.imageWidth : this.imageHeight;
      let stripesSelection = new fabric.Rectangle((this.shapeWidth - x * this.image.scaleX) / 2, (this.shapeHeight - y * this.image.scaleY) / 2, Math.abs(this.shapeWidth - x * this.image.scaleX), Math.abs(this.shapeHeight - y * this.image.scaleY));
      stripesSelection.offset({
        x: this.shapeWidth / 2,
        y: this.shapeHeight / 2
      });
      let data = stripesSelection.getNearestPoint({
        x: this.image.left,
        y: this.image.top
      });
      this.image.left = data.x;
      this.image.top = data.y;
      /** @type {boolean} */

      this.needRerenderCanvas = true;
    }
  },
  setImageZoomAdd(isSlidingUp) {
    /** @type {number} */
    this.imageZoomAdd = isSlidingUp;
    if (this.image) {
      this.image.scale(this.fitScale * (1 + this.imageZoomAdd));
    }
    this._updateImageScale();
    this._updateImageOffset();
    /** @type {boolean} */

    this.needRerenderCanvas = true;
  },
  toObject(value) {
    let info = this.callSuper("toObject", value);
    return this.shapeSource && (info.shapeSource = this.shapeSource), this.image && this.imageAdded ? info.image = this.image.toObject(value) : this.imageSource && (info.image = this.imageSource), info.imageBaseScale = this.imageBaseScale, info.imageZoomAdd = this.imageZoomAdd, info.imageAngle = this.imageAngle, info.isPhoto = this.isPhoto, info.cropScaleX = this.cropScaleX, info.cropScaleY = this.cropScaleY, info.originalWidth = this.originalWidth, info.originalHeight = this.originalHeight, info.effectId =
      this.effectId, info.brightness = this.brightness, info.backgroundColor = this.backgroundColor, info.isBackground = this.isBackground, info;
  },
  remove() {
    return this.imageAdded && !this.isPhoto ? (this.saveState(), this.removeImage(), this.activeModify()) : this.canvas && this.canvas.remove(this), this;
  },
  removeAll() {
    if (this.imageAdded && !this.isPhoto) {
      this.saveState();
      this.removeImage();
      this.activeModify();
      if (this.canvas) {
        this.canvas.remove(this);
      }
    } else {
      if (this.canvas) {
        this.canvas.remove(this);
      }
    }
  },
  removeImage() {
    if (this.imageAdded) {
      this.exitZoomMode();
      if (this.image) {
        this.image.remove();
      }
      /** @type {boolean} */
      this.imageAdded = false;
      /** @type {boolean} */

      this.needRerenderCanvas = true;
      /** @type {null} */
      this.imageSource = null;
      /** @type {null} */
      this.image = null;
      /** @type {number} */
      this.imageWidth = 1;
      /** @type {number} */
      this.imageHeight = 1;
      this.fire("imageChange", {
        target: this
      });
      if (this.canvas) {
        this.canvas.fire("shapeImage:imageChange", {
          target: this
        });
      }
      this.cachedSvg = void 0;
      this.afterScale();
      this.afterUpdated();
      this.renderCanvas();
    }
  },
  getCurrentState() {
    let obj = this.callSuper("getCurrentState");
    return obj.imageSource = this.imageSource, this.image ? obj.imageSource = obj.image = this.image.toObject() : this.backgroundColor && (obj.backgroundColor = this.backgroundColor, obj.image = null), obj;
  },
  loadState(obj) {
    let t = this;
    if (this.isZoomMode) {
      this.exitZoomMode();
    }
    this.callSuper("loadState", obj);
    this.resetDummyPic();
    if (obj.image) {
      if (this.image && this.image.objectId == obj.image.objectId && (this.image.objectId || obj.image.objectId)) {
        this.image.set(obj.image);
        /**
         * @return {undefined}
         */
        this.image.handleOriginalSrcLoaded = function () {
          t._initImage();
        };
        this.image.updateFilters();
      } else {
        this.setImageSource(obj.image, null, false);
      }
    } else {
      if (obj.imageSource) {
        this.setImageSource(obj.imageSource, null, true);
      } else {
        if (obj.isBackground) {
          this.setBackGround(obj.backgroundColor);
        } else {
          this.removeImage();
        }
      }
    }
    this.afterScale();
  }
});

ShapeImage.fromObject = function (options, callback) {
  return callback(new ShapeImage(options));
};

export default ShapeImage;
