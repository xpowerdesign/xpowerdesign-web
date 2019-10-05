import {fabric} from 'fabric';
import ShapeImage from './ShapeImage'

let stateProperties = fabric.Object.prototype.stateProperties.concat();
stateProperties.push(
  "isZoomAble", "imageBaseScale", "imageZoomAdd", "imageAngle", "imageSource",
  "backgroundColor", "useOwn"
);
let cacheProperties = fabric.Object.prototype.cacheProperties.concat();
cacheProperties.push(
  "isZoomAble", "imageBaseScale", "imageZoomAdd", "imageAngle", "imageSource",
  "backgroundColor", "useOwn"
);

const BackgroundShapeImage = fabric.util.createClass(ShapeImage, {
  type: "background-shape-image",
  stateProperties: stateProperties,
  cacheProperties: cacheProperties,
  originX: "left",
  originY: "top",
  isStatic: true,
  isBackground: true,
  backgroundColor: "rgba(255,255,255,1)",
  initialize(obj, t) {
    obj.isBackground = true;
    this.callSuper("initialize", obj, t);
  },
  _repeatPatternObject: null,
  hoverCursor: "default",
  isControlVisible(controlName) {
    return false;
  },
  // @override
  handleDragOver() {
  },
  // @override
  handleDragOut() {
  },
  toObject(text) {
    let obj = this.callSuper("toObject", text);
    obj.useOwn = this.useOwn;
    return obj;
  }
});

BackgroundShapeImage.fromObject = (options, callback) => {
  return callback(new BackgroundShapeImage(options));
};

export default BackgroundShapeImage;
