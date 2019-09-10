// @ts-ignore
import {delay} from 'roadhog-api-doc';

const proxy = {
  'GET /api/v1/assets/stickers/official': {
    code: 0,
    message: 'success',
    data: {
      stickers: [
        // 基础形状
        {
          id: '9e56a59d-336f-4beb-9312-7af9226d1a81',
          name: 'square',
          name_chn: '正方形',
          type: 'sticker',
          type_chn: "贴纸",
          sub_type: 'basics',
          sub_type_chn: "基础形状",
          resource_url: "http://scdn.58share.com/square.jpg",
          thumbnail_url: 'http://scdn.58share.com/square.jpg?imageView2/1/w/200/h/200/q/75|imageslim',
          resources_meta: {
            stickerType: "json",
            stickerMode: "any",
            hasBorder: true,
            scale: 0.5,
            json_url: "http://scdn.58share.com/square.json"
          },
          sort: 1000,
          tag: "几何,正方形,框,方框,标识,黑色,四边形,gray,geometry,shape,basic,round,灰色,形状,图形,面,模型,线框,边框,基础形状",
          created_at: '2019-09-02T22:12:11.186+0800',
          updated_at: '2019-09-02T22:12:11.186+0800',
        },
        // 拼图网格
        {
          id: '9e56a59d-336f-4beb-9112-7af9126d1a81',
          name: 'grids',
          name_chn: '上下拼图',
          type: 'sticker',
          type_chn: "贴纸",
          sub_type: 'image_grid',
          sub_type_chn: "拼图网格",
          resource_url: "http://scdn.58share.com/grid.png",
          thumbnail_url: 'http://scdn.58share.com/grid.png?imageView2/1/w/200/h/200/q/75|imageslim',
          resources_meta: {
            stickerType: "json",
            stickerMode: "equal",
            hasBorder: true,
            scale: 1,
            json_url: "http://scdn.58share.com/grid.json"
          },
          sort: 1000,
          tag: "拼图网格",
          created_at: '2019-09-02T22:12:11.186+0800',
          updated_at: '2019-09-02T22:12:11.186+0800',
        },

        // 线
        {
          id: '9e56a59d-336f-4beb-9112-7af9126d1a81',
          name: 'arrow',
          name_chn: '基础箭头',
          type: 'sticker',
          type_chn: "贴纸",
          sub_type: 'line',
          sub_type_chn: "线",
          resource_url: "http://scdn.58share.com/arrow.jpg",
          thumbnail_url: 'http://scdn.58share.com/arrow.jpg?imageMogr2/auto-orient/thumbnail/200x100>/blur/1x0/quality/75|imageslim',
          resources_meta: {
            stickerType: "svg",
            stretchMode: "any",
            hasBorder: true,
            scale: 1,
            width: 200,
            height: 100,
            svg_url: "http://scdn.58share.com/arrow.svg"
          },
          sort: 1000,
          tag: "箭头,右箭头,指示,线,线条,线段,虚线剪头,基础箭头",
          created_at: '2019-09-02T22:12:11.186+0800',
          updated_at: '2019-09-02T22:12:11.186+0800',
        },

        // 插画
        {
          id: '9e56a59d-336f-4beb-9112-7af9126d1a81',
          name: 'summer_fun',
          name_chn: '夏日缤纷',
          type: 'sticker',
          type_chn: "贴纸",
          sub_type: 'illustrations',
          sub_type_chn: "插画",
          resource_url: "http://cdn.58share.com/summer_fun.jpg",
          thumbnail_url: 'http://cdn.58share.com/summer_fun.jpg?imageMogr2/auto-orient/thumbnail/200x100>/blur/1x0/quality/75|imageslim',
          resources_meta: {
            stickerType: "svg",
            stretchMode: "equal",
            hasBorder: true,
            scale: 0.5,
            width: 200,
            height: 100,
            svg_url: "http://cdn.58share.com/summer_fun.svg"
          },
          sort: 1000,
          tag: "沙滩帽,帽子,遮阳帽,休闲,彩色,愉快,自由,舒适,阳光,黄色,夏天,summer,holiday,joy,color,leisure,lovely夏天,度假,欢乐,可爱,旅行,旅游,夏日缤纷",
          created_at: '2019-09-02T22:12:11.186+0800',
          updated_at: '2019-09-02T22:12:11.186+0800',
        },
      ]
    }
  }
};

export default delay(proxy, 1000);
