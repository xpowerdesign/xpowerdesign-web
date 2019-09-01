// @ts-ignore
import {delay} from 'roadhog-api-doc';
import {Request, Response} from 'express';

function getCaptcha(req: Request, res: Response) {
  return res.json('captcha-xxx');
}

const proxy = {
  // 支持值为 Object 和 Array
  'GET /api/v1/users/current': {
    code: 0,
    message: 'success',
    data: {
      id: '9acf15a8-8ea8-40e3-a114-dd17cb7b3444',
      username: 'jerryLewis',
      mobile: '15882828282',
      email: 'jerrery520@gmail.com',
      user_type: 'admin', // 0 普通用户 1 设计师 2 管理员
      nickname: 'jerryLewis',
      avatar: 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png',
      status: 'active', // 0 活动的 1 禁用的
      openid: 'dd17cb7b3444',
    }
  },

  'POST /api/v1/login': (req: Request, res: Response) => {
    const {password, username} = req.body;
    if (password === 'admin' && username === 'admin') {
      res.send({
        code: 0, message: 'success', data: {
          id: '9acf15a8-8ea8-40e3-a114-dd17cb7b3444',
          username: 'jerryLewis',
          mobile: '15882828282',
          email: 'jerrery520@gmail.com',
          user_type: 'admin', // 0 普通用户 1 设计师 2 管理员
          nickname: 'jerryLewis',
          avatar: 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png',
          status: 'active', // 0 活动的 1 禁用的
          openid: 'dd17cb7b3444',
        }
      });
      return;
    }
    if (password === 'designer' && username === 'designer') {
      res.send({
        code: 0, message: 'success', data: {
          id: '9acf15a8-8ea8-40e3-a114-dd17cb7b3444',
          username: 'jerryLewis',
          mobile: '15882828282',
          email: 'jerrery520@gmail.com',
          user_type: 'designer', // 0 普通用户 1 设计师 2 管理员
          nickname: 'jerryLewis',
          avatar: 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png',
          status: 'active', // 0 活动的 1 禁用的
          openid: 'dd17cb7b3444',
        }
      });
      return;
    }
    res.send({
      code: 0, message: 'success', data: {
        id: '9acf15a8-8ea8-40e3-a114-dd17cb7b3444',
        username: 'jerryLewis',
        mobile: '15882828282',
        email: 'jerrery520@gmail.com',
        user_type: 'user', // 0 普通用户 1 设计师 2 管理员
        nickname: 'jerryLewis',
        avatar: 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png',
        status: 'active', // 0 活动的 1 禁用的
        openid: 'dd17cb7b3444',
      }
    });
  },
  'POST /api/v1/register': (req: Request, res: Response) => {
    res.send({
      code: 0, message: 'success', data: {
        id: '9acf15a8-8ea8-40e3-a114-dd17cb7b3444',
        username: 'jerryLewis',
        mobile: '15882828282',
        email: 'jerrery520@gmail.com',
        user_type: 0, // 0 普通用户 1 设计师 2 管理员
        nickname: 'jerryLewis',
        avatar: 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png',
        status: 'active', // 0 活动的 1 禁用的
        openid: 'dd17cb7b3444',
      }
    });
  },
  'GET /api/v1/500': (req: Request, res: Response) => {
    res.status(500).send({
      timestamp: 1513932555104,
      status: 500,
      error: 'error',
      message: 'error',
      path: '/base/category/list',
    });
  },
  'GET /api/v1/404': (req: Request, res: Response) => {
    res.status(404).send({
      timestamp: 1513932643431,
      status: 404,
      error: 'Not Found',
      message: 'No message available',
      path: '/base/category/list/2121212',
    });
  },
  'GET /api/v1/403': (req: Request, res: Response) => {
    res.status(403).send({
      timestamp: 1513932555104,
      status: 403,
      error: 'Unauthorized',
      message: 'Unauthorized',
      path: '/base/category/list',
    });
  },
  'GET /api/v1/401': (req: Request, res: Response) => {
    res.status(401).send({
      timestamp: 1513932555104,
      status: 401,
      error: 'Unauthorized',
      message: 'Unauthorized',
      path: '/base/category/list',
    });
  },

  'GET  /api/v1/captcha': getCaptcha,
};

// 代码中会兼容本地 service mock 以及部署站点的静态数据
export default delay(proxy, 1000)
