import axios from 'axios';

// 配置axios实例
const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器
apiClient.interceptors.request.use(
  (config) => {
    console.log('发送请求:', config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
apiClient.interceptors.response.use(
  (response) => {
    console.log('收到响应:', response.status, response.data);
    return response;
  },
  (error) => {
    console.error('请求错误:', error.response?.status, error.message);
    return Promise.reject(error);
  }
);

// 数据模型接口
export interface DataItem {
  id?: number;
  name: string;
  description: string;
  value: number;
  createdAt?: string;
  updatedAt?: string;
}

// API服务类
export class ApiService {
  // 创建数据
  static async createData(item: Omit<DataItem, 'id'>): Promise<DataItem> {
    const response = await apiClient.post<DataItem>('/data', item);
    return response.data;
  }

  // 查询所有数据
  static async getAllData(): Promise<DataItem[]> {
    const response = await apiClient.get<DataItem[]>('/data');
    return response.data;
  }

  // 查询单个数据
  static async getDataById(id: number): Promise<DataItem> {
    const response = await apiClient.get<DataItem>(`/data/${id}`);
    return response.data;
  }

  // 更新数据
  static async updateData(id: number, item: Partial<DataItem>): Promise<DataItem> {
    const response = await apiClient.put<DataItem>(`/data/${id}`, item);
    return response.data;
  }

  // 删除数据
  static async deleteData(id: number): Promise<void> {
    await apiClient.delete(`/data/${id}`);
  }

  // 批量查询
  static async batchGetData(ids: number[]): Promise<DataItem[]> {
    const response = await apiClient.post<DataItem[]>('/data/batch', { ids });
    return response.data;
  }
}

export default ApiService;