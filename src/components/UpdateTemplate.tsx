import React, { useState, useEffect } from 'react';
import { ApiService, DataItem } from '../services/api';

interface UpdateTemplateProps {
  onDataUpdated?: (data: DataItem) => void;
}

const UpdateTemplate: React.FC<UpdateTemplateProps> = ({ onDataUpdated }) => {
  const [idToUpdate, setIdToUpdate] = useState<string>('');
  const [originalData, setOriginalData] = useState<DataItem | null>(null);
  const [formData, setFormData] = useState<Partial<DataItem>>({});
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<boolean>(false);

  // 获取原始数据
  const fetchOriginalData = async () => {
    if (!idToUpdate) return;
    
    setFetching(true);
    setError('');
    setOriginalData(null);
    setFormData({});
    
    try {
      const id = parseInt(idToUpdate);
      if (isNaN(id)) {
        setError('请输入有效的数字ID');
        return;
      }
      
      const result = await ApiService.getDataById(id);
      setOriginalData(result);
      setFormData({
        name: result.name,
        description: result.description,
        value: result.value
      });
    } catch (err: any) {
      if (err.response?.status === 404) {
        setError(`ID为 ${idToUpdate} 的数据不存在`);
      } else {
        setError(err.response?.data?.message || '获取数据失败');
      }
    } finally {
      setFetching(false);
    }
  };

  // 处理表单输入变化
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'value' ? Number(value) : value
    }));
  };

  // 执行更新操作
  const handleUpdate = async () => {
    if (!idToUpdate || !originalData || !formData) return;
    
    setLoading(true);
    setError('');
    setSuccess(false);
    
    try {
      const id = parseInt(idToUpdate);
      const updatedData = await ApiService.updateData(id, formData);
      setSuccess(true);
      onDataUpdated?.(updatedData);
      
      // 3秒后清除成功状态
      setTimeout(() => setSuccess(false), 3000);
      
    } catch (err: any) {
      setError(err.response?.data?.message || '更新数据失败');
    } finally {
      setLoading(false);
    }
  };

  // 重置表单
  const handleReset = () => {
    if (originalData) {
      setFormData({
        name: originalData.name,
        description: originalData.description,
        value: originalData.value
      });
    }
    setError('');
    setSuccess(false);
  };

  // 检查是否有修改
  const hasChanges = originalData && (
    formData.name !== originalData.name ||
    formData.description !== originalData.description ||
    formData.value !== originalData.value
  );

  return (
    <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px', margin: '10px' }}>
      <h2>🔄 更新数据模板</h2>
      
      {/* ID输入区域 */}
      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
          要更新的数据ID：
        </label>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <input
            type="text"
            value={idToUpdate}
            onChange={(e) => setIdToUpdate(e.target.value)}
            placeholder="请输入数据ID"
            style={{ 
              padding: '8px', 
              flex: 1, 
              border: '1px solid #ccc', 
              borderRadius: '4px' 
            }}
          />
          <button
            onClick={fetchOriginalData}
            disabled={!idToUpdate || fetching}
            style={{
              padding: '8px 16px',
              backgroundColor: !idToUpdate || fetching ? '#ccc' : '#fd7e14',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: !idToUpdate || fetching ? 'not-allowed' : 'pointer'
            }}
          >
            {fetching ? '查询中...' : '📋 获取数据'}
          </button>
        </div>
      </div>

      {error && (
        <div style={{ 
          color: '#721c24', 
          backgroundColor: '#f8d7da', 
          border: '1px solid #f5c6cb',
          padding: '10px', 
          borderRadius: '4px',
          marginBottom: '15px'
        }}>
          ❌ {error}
        </div>
      )}

      {originalData && (
        <>
          {/* 原始数据显示 */}
          <div style={{ 
            backgroundColor: '#e8f5e8', 
            border: '1px solid #c3e6cb',
            padding: '15px', 
            borderRadius: '6px',
            marginBottom: '20px'
          }}>
            <h4 style={{ color: '#155724', marginTop: 0 }}>📋 原始数据</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: '8px' }}>
              <strong>ID：</strong><span>{originalData.id}</span>
              <strong>名称：</strong><span>{originalData.name}</span>
              <strong>描述：</strong><span>{originalData.description}</span>
              <strong>数值：</strong><span style={{ color: '#28a745', fontWeight: 'bold' }}>{originalData.value}</span>
            </div>
          </div>

          {/* 更新表单 */}
          <div style={{ 
            backgroundColor: '#fff3cd', 
            border: '1px solid #ffeaa7',
            padding: '20px', 
            borderRadius: '6px',
            marginBottom: '20px'
          }}>
            <h4 style={{ color: '#856404', marginTop: 0 }}>✏️ 编辑数据</h4>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div>
                <label>名称：</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name || ''}
                  onChange={handleInputChange}
                  style={{ padding: '8px', width: '100%', border: '1px solid #ccc', borderRadius: '4px' }}
                />
                {formData.name !== originalData.name && (
                  <span style={{ color: '#28a745', fontSize: '12px', marginLeft: '5px' }}>已修改</span>
                )}
              </div>
              
              <div>
                <label>描述：</label>
                <textarea
                  name="description"
                  value={formData.description || ''}
                  onChange={handleInputChange}
                  rows={3}
                  style={{ padding: '8px', width: '100%', border: '1px solid #ccc', borderRadius: '4px' }}
                />
                {formData.description !== originalData.description && (
                  <span style={{ color: '#28a745', fontSize: '12px', marginLeft: '5px' }}>已修改</span>
                )}
              </div>
              
              <div>
                <label>数值：</label>
                <input
                  type="number"
                  name="value"
                  value={formData.value || 0}
                  onChange={handleInputChange}
                  style={{ padding: '8px', width: '100%', border: '1px solid #ccc', borderRadius: '4px' }}
                />
                {formData.value !== originalData.value && (
                  <span style={{ color: '#28a745', fontSize: '12px', marginLeft: '5px' }}>已修改</span>
                )}
              </div>
            </div>

            <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
              <button
                onClick={handleUpdate}
                disabled={loading || !hasChanges}
                style={{
                  padding: '10px 20px',
                  backgroundColor: loading || !hasChanges ? '#ccc' : '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: loading || !hasChanges ? 'not-allowed' : 'pointer',
                  flex: 1
                }}
              >
                {loading ? '更新中...' : '💾 确认更新'}
              </button>
              
              <button
                onClick={handleReset}
                disabled={!hasChanges}
                style={{
                  padding: '10px 20px',
                  backgroundColor: !hasChanges ? '#ccc' : '#6c757d',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: !hasChanges ? 'not-allowed' : 'pointer'
                }}
              >
                🔄 重置
              </button>
            </div>
          </div>
        </>
      )}

      {success && (
        <div style={{ 
          color: '#155724', 
          backgroundColor: '#d4edda', 
          border: '1px solid #c3e6cb',
          padding: '10px', 
          borderRadius: '4px',
          marginTop: '15px'
        }}>
          ✅ 数据更新成功！
        </div>
      )}

      <div style={{ 
        marginTop: '20px', 
        padding: '15px', 
        backgroundColor: '#f8f9fa', 
        borderRadius: '6px',
        fontSize: '14px',
        color: '#6c757d'
      }}>
        <strong>💡 操作说明：</strong>
        <ol style={{ margin: '10px 0 0 20px', padding: 0 }}>
          <li>输入要更新的数据ID</li>
          <li>点击"获取数据"按钮加载原始数据</li>
          <li>修改需要更新的字段</li>
          <li>点击"确认更新"保存更改</li>
          <li>支持部分字段更新，未修改的字段将保持不变</li>
        </ol>
      </div>
    </div>
  );
};

export default UpdateTemplate;