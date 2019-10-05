import {fabric} from 'fabric';

const stateProperties = fabric.Object.prototype.stateProperties.concat();

const DrawObject = fabric.util.createClass(fabric.Object, {
  type: "draw-Object",
  stateProperties: stateProperties,
  drawType: "",
  hasBorders: true,
  isDrawLine: false,
  hasPathStroke: true,
  objectCaching: false,
  _scaleX: 1,
  _scaleY: 1,
  initialize(firstName) {
    firstName = firstName || {};
    this.callSuper("initialize", firstName);
  },

  getPathStyle() {
    return {
      stroke: this.stroke,
      strokeWidth: this.strokeWidth,
      strokeDashArray: this.strokeDashArray,
      strokeLineCap: this.strokeLineCap
    };
  },

  changePath(e, next) {
    if ("pathStroke" == e ||
      "pathStrokeWidth" == e ||
      "pathStrokeDashArray" == e ||
      "pathStrokeLineCap" == e ||
      "pathStrokeLineJoin" == e) {
      if ("pathStroke" == e && this.set("stroke", next), "pathStrokeWidth" == e && this.set("strokeWidth", next), "pathStrokeDashArray" == e) {
        let cur = next ? next.slice() : null;
        if (2 == cur.length && "1" == cur[0] && "0" == cur[1] && (cur = null), cur) {
          /** @type {number} */
          var j = 0;
          for (; j < cur.length; j++) {
            cur[j] *= Math.max(1, .5 * this.strokeWidth);
          }
        }
        this.set("strokeDashArray", cur);
      }
      if ("pathStrokeLineCap" == e) {
        this.set("strokeLineCap", next);
      }
      if ("pathStrokeLineJoin" == e) {
        this.set("strokeLineJoin", next);
      }
      this.setCoords();
    }
  },
  __doUpdateBufferCanvas() {
  }
});

DrawObject.fromObject = (options, callback) => {
  return callback(new DrawObject(options));
};

export default DrawObject;
