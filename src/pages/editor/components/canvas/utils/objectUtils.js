import {fabric} from 'fabric';

fabric.util.object.extend(fabric.Object.prototype, {
  renderCanvas() {
    this.canvas && this.canvas.requestRenderAll()
  },
});
