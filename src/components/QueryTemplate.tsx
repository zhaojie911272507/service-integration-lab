import React, { useState, useEffect } from 'react';
import { ApiService, DataItem } from '../services/api';

interface QueryTemplateProps {
  autoRefresh?: boolean;
  refreshInterval?: number;
}

const QueryTemplate: React.FC<QueryTemplateProps> = ({ 
  autoRefresh = false, 
  refreshInterval = 5000 
}) => {
  const [data, setData] = useState<DataItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [detailData, setDetailData] = useState<DataItem | null>(null);

  // 获取所有数据
  const fetchAllData = async () => {
    setLoading(true);
    setError('');
    
    try {
      const result = await ApiService.getAllData();
      setData(result);
    } catch (err: any) {
      setError(err.response?.data?.message || '获取数据失败');
    } finally {
      setLoading(false);
    }
  };

  // 获取单个数据详情
  const fetchDetailData = async (id: number) => {
    try {
      const result = await ApiService.getDataById(id);
      setDetailData(result);
    } catch (err: any) {
      setError(`获取详情失败: ${err.response?.data?.message || err.message}`);
    }
  };

  // 自动刷新
  useEffect(() => {
    if (autoRefresh) {
      fetchAllData();
      const interval = setInterval(fetchAllData, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [autoRefresh, refreshInterval]);

  // 组件挂载时获取数据
  useEffect(() => {
    fetchAllData();
  }, []);

  // 处理详情查看
  const handleViewDetail = (id: number) => {
    setSelectedId(id);
    fetchDetailData(id);
  };

  return (
    <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px', margin: '10px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>🔍 查询渲染模板</h2>
        <button 
          onClick={fetchAllData} 
          disabled={loading}
          style={{
            padding: '8px 16px',
            backgroundColor: loading ? '#ccc' : '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? '刷新中...' : '🔄 手动刷新'}
        </button>
      </div>

      {error && (
        <div style={{ color: 'red', marginBottom: '15px', padding: '10px', backgroundColor: '#ffe6e6', borderRadius: '4px' }}>
          ❌ 错误：{error}
        </div>
      )}

      <div style={{ marginBottom: '20px' }}>
        <h4>📊 数据列表（共 {data.length} 条）</h4>
        {data.length === 0 ? (
          <p>暂无数据</p>
        ) : (
          <div style={{ display: 'grid', gap: '10px' }}>
            {data.map((item) => (
              <div 
                key={item.id} 
                style={{ 
                  padding: '15px', 
                  border: '1px solid #eee', 
                  borderRadius: '6px',
                  backgroundColor: selectedId === item.id ? '#f0f8ff' : 'white',
                  cursor: 'pointer'
                }}
                onClick={() => handleViewDetail(item.id!)}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <strong>{item.name}</strong>
                    <p style={{ margin: '5px 0', color: '#666', fontSize: '14px' }}>
                      {item.description}
                    </p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#007bff' }}>
                      {item.value}
                    </div>
                    <div style={{ fontSize: '12px', color: '#999' }}>
                      ID: {item.id}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedId && detailData && (
        <div style={{ 
          padding: '15px', 
          backgroundColor: '#f8f9fa', 
          borderRadius: '6px',
          border: '1px solid #dee2e6'
        }}>
          <h4>📋 详细信息（ID: {selectedId}）</h4>
          <div style={{ display: 'grid', gridTemplateColumns: '100px 1fr', gap: '10px' }}>
            <strong>名称：</strong><span>{detailData.name}</span>
            <strong>描述：</strong><span>{detailData.description}</span>
            <strong>数值：</strong><span style={{ color: '#007bff', fontWeight: 'bold' }}>{detailData.value}</span>
            <strong>创建时间：</strong><span>{detailData.createdAt || '未知'}</span>
            <strong>更新时间：</strong><span>{detailData.updatedAt || '未知'}</span>
          </div>
        </div>
      )}

      {autoRefresh && (
        <div style={{ marginTop: '15px', fontSize: '12px', color: '#6c757d' }}>
          ⏰ 自动刷新已启用（{refreshInterval / 1000}秒间隔）
        </div>
      )}
    </div>
  );
};

export default QueryTemplate;