import { SupabaseService } from './base/supabaseService';
import { generateApiKey } from '@/utils/apiKeyGenerator';

class ApiKeyService extends SupabaseService {
  constructor() {
    super('api_keys');
  }

  async fetchApiKeys() {
    return this.select('*', {
      orderBy: 'created_at',
      ascending: false
    });
  }

  async createApiKey(keyData) {
    const newKey = {
      name: keyData.name,
      keys: generateApiKey(),
      usage: 0
    };

    return this.insert(newKey, { select: true, single: true });
  }

  async updateApiKey(id, name) {
    return this.update(id, { name });
  }

  async deleteApiKey(id) {
    return this.delete(id);
  }

  async validateApiKey(apiKey) {
    try {
      const data = await this.select('id, usage', {
        filters: [{ field: 'keys', value: apiKey }],
        single: true
      });

      if (data) {
        await this.update(data.id, { usage: (data.usage || 0) + 1 });
        return true;
      }

      return false;
    } catch (error) {
      console.error('Error validating API key:', error);
      return false;
    }
  }
}

export const apiKeyService = new ApiKeyService(); 