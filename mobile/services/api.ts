/**
 * API 客户端 — axios 实例 + 鉴权拦截器
 * 
 * 红线：API_KEY 决不出现于此文件，所有 AI 调用经由服务端代理
 */
import axios, { AxiosError } from "axios";
import type { ApiError, SearchRequest, SearchResponse } from "../types";

// 开发环境指向本地服务端
const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:8000";

const client = axios.create({
  baseURL: BASE_URL,
  timeout: 30_000,
  headers: { "Content-Type": "application/json" },
});

// 请求拦截：注入 JWT token
client.interceptors.request.use((config) => {
  // TODO: Phase 1 后续从安全存储读取 token
  const token = "";
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 响应拦截：统一错误处理
client.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiError>) => {
    if (error.response?.status === 401) {
      // TODO: 跳转登录
    }
    return Promise.reject(error);
  }
);

/** 资料搜索 */
export async function searchMaterials(req: SearchRequest): Promise<SearchResponse> {
  const { data } = await client.post<SearchResponse>("/api/search/", req);
  return data;
}

/** 健康检查 */
export async function healthCheck(): Promise<{ status: string }> {
  const { data } = await client.get("/api/health");
  return data;
}

export default client;
