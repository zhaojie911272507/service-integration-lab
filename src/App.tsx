import React, { useState } from 'react';
import CreateTemplate from './components/CreateTemplate';
import QueryTemplate from './components/QueryTemplate';
import DeleteTemplate from './components/DeleteTemplate';
import UpdateTemplate from './components/UpdateTemplate';
import { DataItem } from './services/api';

import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('create');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // 处理数据创建后的回调
  const handleDataCreated = (data: DataItem) => {
    console.log('数据创建成功:', data);
    // 触发查询页面刷新
    setRefreshTrigger(prev => prev + 1);
  };

  // 处理数据删除后的回调
  const handleDataDeleted = (id: number) => {
    console.log('数据删除成功，ID:', id);
    // 触发查询页面刷新
    setRefreshTrigger(prev => prev + 1);
  };

  // 处理数据更新后的回调
  const handleDataUpdated = (data: DataItem) => {
    console.log('数据更新成功:', data);
    // 触发查询页面刷新
    setRefreshTrigger(prev => prev + 1);
  };

  const tabs = [
    { id: 'create', label: '📝 新增数据', component: <CreateTemplate onDataCreated={handleDataCreated} /> },
    { id: 'query', label: '🔍 查询数据', component: <QueryTemplate key={refreshTrigger} autoRefresh={true} /> },
    { id: 'update', label: '🔄 更新数据', component: <UpdateTemplate onDataUpdated={handleDataUpdated} /> },
    { id: 'delete', label: '🗑️ 删除数据', component: <DeleteTemplate onDataDeleted={handleDataDeleted} /> },
  ];

  return (
    <div className="App">
      <header className="App-header">
        <h1>🚀 React + TypeScript 后端API测试平台</h1>
        <p>企业级前端项目模板 - 支持完整的CRUD操作测试</p>
      </header>

      <nav className="App-nav">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={activeTab === tab.id ? 'active' : ''}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      <main className="App-main">
        {tabs.find(tab => tab.id === activeTab)?.component}
      </main>

      <footer className="App-footer">
        <p>📧 API基础URL: {process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001/api'}</p>
        <p>⚡ 基于React 18 + TypeScript + Axios构建</p>
      </footer>
    </div>
  );
}

export default App;