import axios from "axios";

const api = axios.create({
  baseURL: "https://api.sea.team",
  timeout: 25000,
  headers: {},
});

// 添加请求拦截器 https://axios-http.com/zh/docs/interceptors
api.interceptors.request.use(
  function (config) {
    // 在发送请求之前做些什么
    return config;
  },
  function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  }
);

// 添加响应拦截器
api.interceptors.response.use(
  function (res) {
    // 2xx 范围内的状态码都会触发该函数。
    // 对响应数据做点什么
    return res.data;
  },
  function (err) {
    // 超出 2xx 范围的状态码都会触发该函数。
    // 对响应错误做点什么
    return {
      ok: false,
      err,
      msg: "request error",
    };
  }
);

export default api;
