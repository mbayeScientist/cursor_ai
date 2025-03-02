'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import Notification from '@/components/ui/Notification';
import { apiKeyService } from '@/services/apiKeyService';

export default function Playground() {
  const router = useRouter();
  const [apiKey, setApiKey] = useState('');
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  const [loading, setLoading] = useState(false);

  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: '', type: '' }), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const isValid = await apiKeyService.validateApiKey(apiKey);
      
      if (isValid) {
        showNotification('Valid API key, /protected can be accessed', 'success');
        // Store the API key in session storage for protected route
        sessionStorage.setItem('apiKey', apiKey);
        // Navigate to protected route after a short delay
        setTimeout(() => router.push('/protected'), 1000);
      } else {
        showNotification('Invalid API Key', 'error');
      }
    } catch (error) {
      showNotification('Invalid API Key', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 min-h-screen p-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-sm">
            <h1 className="text-2xl font-bold mb-6">API Playground</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              Enter your API key to access protected endpoints.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  API Key
                  <span className="text-gray-500 ml-1">— Enter your API key to validate</span>
                </label>
                <input
                  type="text"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="mbaye-xxxxxxxxxxxxxxxx"
                  className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={!apiKey || loading}
                className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Validating...' : 'Validate API Key'}
              </button>
            </form>
          </div>
        </div>

        <Notification
          show={notification.show}
          message={notification.message}
          type={notification.type}
        />
      </div>
    </div>
  );
} 