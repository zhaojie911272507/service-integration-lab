import React, { useState } from 'react';
import { ApiService, DataItem } from '../services/api';

interface CreateTemplateProps {
  onDataCreated?: (data: DataItem) => void;
}

const CreateTemplate: React.FC<CreateTemplateProps> = ({ onDataCreated }) => {
  const [formData, setFormData] = useState<Omit<DataItem, 'id'>>({
    name: '',
    description: '',
    value: 0,
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DataItem | null>(null);
  const [error, setError] = useState<string>('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'value' ? Number(value) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const createdData = await ApiService.createData(formData);
      setResult(createdData);
      onDataCreated?.(createdData);
      
      // 重置表单
      setFormData({
        name: '',
        description: '',
        value: 0,
      });
    } catch (err: any) {
      setError(err.response?.data?.message || '创建数据失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px', margin: '10px' }}>
      <h2>📝 新增数据模板</h2>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div>
          <label>名称：</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
            style={{ padding: '8px', width: '100%' }}
          />
        </div>
        
        <div>
          <label>描述：</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            required
            rows={3}
            style={{ padding: '8px', width: '100%' }}
          />
        </div>
        
        <div>
          <label>数值：</label>
          <input
            type="number"
            name="value"
            value={formData.value}
            onChange={handleInputChange}
            required
            style={{ padding: '8px', width: '100%' }}
          />
        </div>
        
        <button
          type="submit"
          disabled={loading}
          style={{
            padding: '10px 20px',
            backgroundColor: loading ? '#ccc' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? '创建中...' : '🚀 提交创建'}
        </button>
      </form>

      {error && (
        <div style={{ color: 'red', marginTop: '10px' }}>
          ❌ 错误：{error}
        </div>
      )}

      {result && (
        <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
          <h4>✅ 创建成功</h4>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default CreateTemplate;