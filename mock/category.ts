// @ts-ignore
import { delay } from 'roadhog-api-doc';

const proxy = {
  'GET /api/v1/categories/group': {
    code: 0,
    message: 'success',
    data: {
      categories: [
        {
          id: '9e56a59d-336f-4beb-9112-7af9226d1a8e',
          type: 'group',
          name: 'poster',
          name_chn: '英文海报',
          doc_width: 42,
          doc_height: 59.4,
          doc_unit: 'cm',
          size: '42cm × 59.4cm',
          height: 1588,
          width: 2246,
          dpi: 96,
          cover: 'http://scdn.58share.com/ywhbfe888a9af2646937e7445eed84d576d1.png',
          cover_display: 'http://scdn.58share.com/_ywhb45dc31df72d8706547e5959a1bea1f62.png',
          status: 'published',
          notices: {
            words: [
              '设计尺寸：42cm*59.4cm',
              '最小字体32px，主要图片类最短边不得小于4000px',
              '符合英文阅读习惯（避免无规则横竖混排，任意将单词进行分行排版，及破坏语义的进行断句），且所有的标点符号均使用英文半角标点符号',
              '注意字间距、行间距规范',
              '根据主题以及文案进行相关配色',
              '根据文案突出相关重点',
              '审美符合国外流行趋势及文化',
              '产品抠图元素标明版权来源，请勿使用网络矢量元素，自行根据主题设计元素',
            ],
            pdf:
              'http://scdn.58share.com/%E8%8B%B1%E6%96%87%E6%B5%B7%E6%8A%A5%E8%AE%BE%E8%AE%A1%E5%8F%82%E8%80%83.pdf',
          },
          created_at: '2019-09-02T22:12:11.186+0800',
          updated_at: '2019-09-02T22:12:11.186+0800',
        },
        {
          id: '23b4fb3c-c544-4bc2-93f8-99e351e32916',
          type: 'group',
          name: 'office_cover',
          name_chn: '公众号封面大图（新）',
          doc_width: 900,
          doc_height: 383,
          doc_unit: 'px',
          size: '900px × 383px',
          height: 900,
          width: 383,
          dpi: 96,
          cover: 'http://scdn.58share.com/gzh.png',
          cover_display: 'http://scdn.58share.com/_gzh.png',
          status: 'published',
          notices: {
            words: [
              '设计尺寸：900px*383px',
              '标题与辅助文案不可过小',
              '为了使微信分享图片更美观，文案或主要内容建议放置在画面中心区域',
              '整体排版偏下（封面会被标题遮挡上半部分）',
              '注意字间距、行间距规范',
            ],
            pdf:
              'http://scdn.58share.com/%E5%85%AC%E4%BC%97%E5%8F%B7%E5%B0%81%E9%9D%A2%E5%A4%A7%E5%9B%BE%E8%AE%BE%E8%AE%A1%E5%8F%82%E8%80%83.pdf',
          },
          created_at: '2019-09-02T22:12:11.186+0800',
          updated_at: '2019-09-02T22:12:11.186+0800',
        },
        {
          id: '23a4fb3c-c5f4-4bc2-93f8-99e351e32916',
          type: 'group',
          name: 'mobile_poster',
          name_chn: '手机海报',
          doc_width: 721,
          doc_height: 1280,
          doc_unit: 'px',
          size: '720px × 1280px',
          height: 1280,
          width: 721,
          dpi: 96,
          cover: 'http://scdn.58share.com/%E6%89%8B%E6%9C%BA%E6%B5%B7%E6%8A%A5.png',
          cover_display: 'http://scdn.58share.com/_%E6%89%8B%E6%9C%BA%E6%B5%B7%E6%8A%A5.png',
          status: 'published',
          notices: {
            words: [
              '设计尺寸：720px*1280px',
              '文字不得小于20px（以Fotor线上显示大小为准）',
              '文案排版注意划分主题与内容',
              '注意字间距、行间距规范',
            ],
            pdf:
              'http://scdn.58share.com/%E6%89%8B%E6%9C%BA%E6%B5%B7%E6%8A%A5%E8%AE%BE%E8%AE%A1%E5%8F%82%E8%80%83.pdf',
          },
          created_at: '2019-09-02T22:12:11.186+0800',
          updated_at: '2019-09-02T22:12:11.186+0800',
        },
      ],
    },
  },
};

export default delay(proxy, 1000);
