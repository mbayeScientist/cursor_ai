'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import Notification from '@/components/ui/Notification';
import { apiKeyService } from '@/services/apiKeyService';

export default function Protected() {
  const router = useRouter();
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  const [isValidating, setIsValidating] = useState(true);

  useEffect(() => {
    const validateAccess = async () => {
      const apiKey = sessionStorage.getItem('apiKey');
      
      if (!apiKey) {
        router.push('/playground');
        return;
      }

      try {
        const isValid = await apiKeyService.validateApiKey(apiKey);
        if (!isValid) {
          router.push('/playground');
        }
      } catch (error) {
        router.push('/playground');
      } finally {
        setIsValidating(false);
      }
    };

    validateAccess();
  }, [router]);

  if (isValidating) {
    return (
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex-1 min-h-screen p-8 flex items-center justify-center">
          <div className="text-lg">Validating access...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 min-h-screen p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-sm">
            <h1 className="text-2xl font-bold mb-6">Protected Content</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              This is a protected page that can only be accessed with a valid API key.
            </p>

            {/* Add your protected content here */}
            <div className="prose dark:prose-invert max-w-none">
              <h2>API Documentation</h2>
              <p>
                Welcome to the protected API documentation. Here you can find detailed information
                about available endpoints and how to use them.
              </p>
              {/* Add more content as needed */}
            </div>
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