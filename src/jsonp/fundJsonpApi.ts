export type IJsonpData = {
  fundcode: string; // 基金代码
  name: string; // 基金名称
  jzrq: string; // 净值日期
  dwjz: number; // 单位净值
  gsz: number; // 最新估值
  gszzl: number; // 估值增长率
  gztime: string; // 估值时间
};

// 保存当前的回调处理函数
let currentCallback: ((data: IJsonpData) => void) | null = null;

// 保存请求队列
const requestQueue: Array<{
  code: string;
  resolve: (data: IJsonpData) => void;
  reject: (error: Error) => void;
  script: HTMLScriptElement;
}> = [];

// 处理JSONP回调
(window as any).jsonpgz = (data: IJsonpData) => {
  if (currentCallback) {
    currentCallback(data);
  }
};

export const fundJsonpApi = (code: string): Promise<IJsonpData> => {
  return new Promise((resolve, reject) => {
    try {
      // 创建script标签
      const script = document.createElement('script');
      script.src = `https://fundgz.1234567.com.cn/js/${code}.js?timestamp=${Date.now()}`;
      
      // 加入请求队列
      requestQueue.push({ code, resolve, reject, script });
      
      // 如果队列中只有一个请求，直接处理
      if (requestQueue.length === 1) {
        processNextRequest();
      }
    } catch (error) {
      reject(error);
    }
  });
};

// 处理下一个请求
function processNextRequest() {
  if (requestQueue.length === 0) {
    return;
  }
  
  const item = requestQueue[0];
  if (!item) return;
  const { code, resolve, reject, script } = item;
  
  // 设置当前回调
  currentCallback = (data: IJsonpData) => {
    // 清理当前回调
    currentCallback = null;
    
    // 处理响应
    resolve({ ...data, fundcode: code });
    script.remove();
    
    // 从队列中移除已处理的请求
    requestQueue.shift();
    
    // 处理下一个请求
    processNextRequest();
  };
  
  // 处理加载失败
  script.onerror = () => {
    // 清理当前回调
    currentCallback = null;
    
    // 处理错误
    reject(new Error(`JSONP请求失败: ${code}`));
    script.remove();
    
    // 从队列中移除失败的请求
    requestQueue.shift();
    
    // 处理下一个请求
    processNextRequest();
  };
  
  // 添加script标签到DOM
  document.body.appendChild(script);
}
