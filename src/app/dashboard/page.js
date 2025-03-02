'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import ApiKeys from '@/components/ApiKeys';
import CurrentPlan from '@/components/CurrentPlan';
import { apiKeyService } from '@/services/apiKeyService';

export default function Dashboard() {
  const [apiKeys, setApiKeys] = useState([]);

  useEffect(() => {
    fetchApiKeys();
  }, []);

  const fetchApiKeys = async () => {
    try {
      const data = await apiKeyService.fetchApiKeys();
      setApiKeys(data);
    } catch (error) {
      console.error('Error fetching API keys:', error);
    }
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 min-h-screen p-8">
        <div className="max-w-6xl mx-auto space-y-8">
          <CurrentPlan apiKeys={apiKeys} />
          <ApiKeys apiKeys={apiKeys} onApiKeyChange={setApiKeys} />
        </div>
      </div>
    </div>
  );
}