import React, { useState } from 'react';
import { ApiService, DataItem } from '../services/api';

interface DeleteTemplateProps {
  onDataDeleted?: (id: number) => void;
}

const DeleteTemplate: React.FC<DeleteTemplateProps> = ({ onDataDeleted }) => {
  const [idToDelete, setIdToDelete] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<boolean>(false);
  const [itemToDelete, setItemToDelete] = useState<DataItem | null>(null);

  // 查询要删除的项目信息
  const fetchItemInfo = async () => {
    if (!idToDelete) return;
    
    try {
      const id = parseInt(idToDelete);
      if (isNaN(id)) {
        setError('请输入有效的数字ID');
        return;
      }
      
      const result = await ApiService.getDataById(id);
      setItemToDelete(result);
      setError('');
    } catch (err: any) {
      if (err.response?.status === 404) {
        setError(`ID为 ${idToDelete} 的数据不存在`);
      } else {
        setError(err.response?.data?.message || '查询数据失败');
      }
      setItemToDelete(null);
    }
  };

  // 执行删除操作
  const handleDelete = async () => {
    if (!idToDelete || !itemToDelete) return;
    
    setLoading(true);
    setError('');
    setSuccess(false);
    
    try {
      const id = parseInt(idToDelete);
      await ApiService.deleteData(id);
      setSuccess(true);
      onDataDeleted?.(id);
      
      // 重置表单
      setIdToDelete('');
      setItemToDelete(null);
      
      // 3秒后清除成功状态
      setTimeout(() => setSuccess(false), 3000);
      
    } catch (err: any) {
      setError(err.response?.data?.message || '删除数据失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px', margin: '10px' }}>
      <h2>🗑️ 删除操作模板</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
          要删除的数据ID：
        </label>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <input
            type="text"
            value={idToDelete}
            onChange={(e) => setIdToDelete(e.target.value)}
            placeholder="请输入数据ID"
            style={{ 
              padding: '8px', 
              flex: 1, 
              border: '1px solid #ccc', 
              borderRadius: '4px' 
            }}
          />
          <button
            onClick={fetchItemInfo}
            disabled={!idToDelete}
            style={{
              padding: '8px 16px',
              backgroundColor: !idToDelete ? '#ccc' : '#17a2b8',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: !idToDelete ? 'not-allowed' : 'pointer'
            }}
          >
            🔍 查询信息
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

      {itemToDelete && (
        <div style={{ 
          backgroundColor: '#fff3cd', 
          border: '1px solid #ffeaa7',
          padding: '15px', 
          borderRadius: '6px',
          marginBottom: '20px'
        }}>
          <h4 style={{ color: '#856404', marginTop: 0 }}>⚠️ 确认删除以下数据？</h4>
          
          <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: '8px' }}>
            <strong>ID：</strong><span>{itemToDelete.id}</span>
            <strong>名称：</strong><span>{itemToDelete.name}</span>
            <strong>描述：</strong><span>{itemToDelete.description}</span>
            <strong>数值：</strong><span style={{ color: '#e74c3c', fontWeight: 'bold' }}>{itemToDelete.value}</span>
          </div>
          
          <div style={{ marginTop: '15px' }}>
            <button
              onClick={handleDelete}
              disabled={loading}
              style={{
                padding: '10px 20px',
                backgroundColor: loading ? '#ccc' : '#dc3545',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: loading ? 'not-allowed' : 'pointer',
                marginRight: '10px'
              }}
            >
              {loading ? '删除中...' : '✅ 确认删除'}
            </button>
            
            <button
              onClick={() => {
                setIdToDelete('');
                setItemToDelete(null);
                setError('');
              }}
              style={{
                padding: '10px 20px',
                backgroundColor: '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              ❌ 取消
            </button>
          </div>
        </div>
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
          ✅ 数据删除成功！
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
          <li>输入要删除的数据ID</li>
          <li>点击"查询信息"按钮验证数据存在性</li>
          <li>确认信息后点击"确认删除"</li>
          <li>删除操作不可逆，请谨慎操作</li>
        </ol>
      </div>
    </div>
  );
};

export default DeleteTemplate;