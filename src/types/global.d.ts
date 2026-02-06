declare global {
  // 1. 定义请求响应数据类型（适配你的后端返回格式）
  interface ResponseData<T = any> {
    code: number; // 业务状态码（如 200 成功，401 未登录）
    msg: string; // 提示信息
    data: T; // 响应数据
  }
}

export {};
