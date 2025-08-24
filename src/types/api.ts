
// todo 将model全部抽出到types文件夹，与API和page保持一致
// 数据模型接口
export interface DataItem {
  id?: number;
  name: string;
  description: string;
  value: number;
  createdAt?: string;
  updatedAt?: string;
}