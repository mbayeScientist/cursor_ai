import { useState } from 'react';
import { apiKeyService } from '@/services/apiKeyService';
import Modal from '@/components/ui/Modal';
import Notification from '@/components/ui/Notification';

export default function ApiKeys({ apiKeys, onApiKeyChange }) {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editingKey, setEditingKey] = useState(null);
  const [editName, setEditName] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  const [visibleKeys, setVisibleKeys] = useState(new Set());
  const [newKeyData, setNewKeyData] = useState({ name: '' });

  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: '', type: '' }), 3000);
  };

  const handleCreateKey = async () => {
    setLoading(true);
    try {
      const newKey = await apiKeyService.createApiKey(newKeyData);
      onApiKeyChange([newKey, ...apiKeys]);
      setShowModal(false);
      setNewKeyData({ name: '' });
      showNotification('API key created successfully');
    } catch (error) {
      showNotification('Failed to create API key', 'error');
      console.error('Error creating API key:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteKey = async (id) => {
    try {
      await apiKeyService.deleteApiKey(id);
      onApiKeyChange(apiKeys.filter(key => key.id !== id));
      showNotification('API key deleted successfully');
    } catch (error) {
      showNotification('Failed to delete API key', 'error');
      console.error('Error deleting API key:', error);
    }
    setShowDeleteConfirm(null);
  };

  const handleUpdateKey = async (id) => {
    try {
      await apiKeyService.updateApiKey(id, editName);
      onApiKeyChange(apiKeys.map(key => 
        key.id === id ? { ...key, name: editName } : key
      ));
      setEditingKey(null);
      showNotification('API key updated successfully');
    } catch (error) {
      showNotification('Failed to update API key', 'error');
      console.error('Error updating API key:', error);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    showNotification('API key copied to clipboard');
  };

  const toggleKeyVisibility = (id) => {
    setVisibleKeys(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">API Keys</h2>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-black text-white dark:bg-white dark:text-black rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
        >
          + Create New Key
        </button>
      </div>

      {/* Keys list */}
      <div className="space-y-4">
        <div className="grid grid-cols-12 gap-4 px-4 py-2 text-sm text-gray-500 border-b">
          <div className="col-span-3">NAME</div>
          <div className="col-span-2">USAGE</div>
          <div className="col-span-5">KEY</div>
          <div className="col-span-2 text-right">OPTIONS</div>
        </div>
        {apiKeys.map((apiKey) => (
          <div key={apiKey.id} className="grid grid-cols-12 gap-4 items-center px-4 py-3 border rounded-lg">
            <div className="col-span-3">
              {editingKey === apiKey.id ? (
                <div className="flex gap-2 items-center">
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="px-2 py-1 border rounded-lg w-full"
                  />
                  <button
                    onClick={() => handleUpdateKey(apiKey.id)}
                    className="text-green-500 hover:text-green-600"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingKey(null)}
                    className="text-gray-500 hover:text-gray-600"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="font-medium">{apiKey.name}</span>
                  <button
                    onClick={() => {
                      setEditingKey(apiKey.id);
                      setEditName(apiKey.name);
                    }}
                    className="text-gray-500 hover:text-gray-600"
                  >
                    ✎
                  </button>
                </div>
              )}
            </div>
            <div className="col-span-2">
              <span className="text-sm">{apiKey.usage || 0}</span>
            </div>
            <div className="col-span-5">
              <div className="flex items-center gap-2">
                <code className="font-mono text-sm bg-gray-50 dark:bg-gray-900 px-2 py-1 rounded flex-grow">
                  {visibleKeys.has(apiKey.id) ? apiKey.keys : apiKey.keys.replace(/(?<=^.{12}).*(?=.{5}$)/g, '*'.repeat(15))}
                </code>
                <div className="flex gap-2">
                  <button
                    onClick={() => toggleKeyVisibility(apiKey.id)}
                    className="text-gray-500 hover:text-gray-700"
                    title={visibleKeys.has(apiKey.id) ? "Hide API Key" : "Show API Key"}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      {visibleKeys.has(apiKey.id) ? (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      )}
                    </svg>
                  </button>
                  <button
                    onClick={() => copyToClipboard(apiKey.keys)}
                    className="text-gray-500 hover:text-gray-700"
                    title="Copy to clipboard"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
            <div className="col-span-2 text-right">
              {showDeleteConfirm === apiKey.id ? (
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => handleDeleteKey(apiKey.id)}
                    className="text-red-500 hover:text-red-600"
                  >
                    Confirm
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(null)}
                    className="text-gray-500 hover:text-gray-600"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowDeleteConfirm(apiKey.id)}
                  className="text-red-500 hover:text-red-600"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Create API Key Modal */}
      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        title="Create a new API key"
      >
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Enter a name for the new API key.
        </p>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">
              Key Name
              <span className="text-gray-500 ml-1">— A unique name to identify this key</span>
            </label>
            <input
              type="text"
              value={newKeyData.name}
              onChange={(e) => setNewKeyData({ ...newKeyData, name: e.target.value })}
              placeholder="Key Name"
              className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
            />
          </div>

          <div className="flex justify-end gap-4 mt-8">
            <button
              onClick={() => setShowModal(false)}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              onClick={handleCreateKey}
              disabled={!newKeyData.name || loading}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create'}
            </button>
          </div>
        </div>
      </Modal>

      {/* Notification */}
      <Notification
        show={notification.show}
        message={notification.message}
        type={notification.type}
      />
    </div>
  );
} 