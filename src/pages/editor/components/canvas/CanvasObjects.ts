import {fabric} from 'fabric';

import Arrow from './Arrow';

// canvas绘图对象元素

export default (mergedObjects: any, defaultOptions: any) => {
  const fabricObjects = {
    group: {
      create: ({objects, ...option}) => new fabric.Group(objects, {
        ...defaultOptions,
        ...option,
      }),
    },
    'i-text': {
      create: ({text, ...option}) => new fabric.IText(text, {
        ...defaultOptions,
        ...option,
      }),
    },
    textbox: {
      create: ({text, ...option}) => new fabric.Textbox(text, {
        ...defaultOptions,
        ...option,
      }),
    },
    triangle: {
      create: option => new fabric.Triangle({
        ...defaultOptions,
        ...option,
      }),
    },
    circle: {
      create: option => new fabric.Circle({
        ...defaultOptions,
        ...option,
      }),
    },
    rect: {
      create: option => new fabric.Rect({
        ...defaultOptions,
        ...option,
      }),
    },
    image: {
      create: ({imgElement, ...option}) => new fabric.Image(imgElement, {
        ...defaultOptions,
        ...option,
        crossOrigin: true,
      }),
    },
    video: {
      create: ({videoElement, ...option}) => new fabric.Image(videoElement, {
        ...defaultOptions,
        ...option,
        crossOrigin: true,
      }),
    },
    polygon: {
      create: ({points, ...option}) => new fabric.Polygon(points, {
        ...defaultOptions,
        ...option,
        perPixelTargetFind: true,
      }),
    },
    line: {
      create: ({points, ...option}) => new fabric.Line(points, {
        ...defaultOptions,
        ...option,
        points,
      }),
    },
    arrow: {
      create: ({points, ...option}) => new Arrow(points, {
        ...defaultOptions,
        ...option,
        points,
      }),
    },
  };
  if (mergedObjects) {
    Object.assign(fabricObjects, mergedObjects);
  }
  return fabricObjects;
};
