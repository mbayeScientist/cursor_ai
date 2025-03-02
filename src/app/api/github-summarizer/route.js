import { NextResponse } from 'next/server';
import { apiKeyService } from '@/services/apiKeyService';
import { getReadmeContent } from '@/services/githubService';
import { summarizeRepository } from '@/lib/chains/githubSummarizer';

export async function POST(request) {
  try {
    // Get the request body
    const body = await request.json();
    const apiKey = request.headers.get('Authorization')?.replace('Bearer ', '');
    const { githubUrl } = body;

    // Validate required fields
    if (!apiKey) {
      return NextResponse.json({ error: 'API key is required' }, { status: 401 });
    }
    if (!githubUrl) {
      return NextResponse.json({ error: 'GitHub URL is required' }, { status: 400 });
    }

    // Validate the API key
    const isValid = await apiKeyService.validateApiKey(apiKey);
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid API key' }, { status: 401 });
    }

    // Fetch README content and analyze it
    try {
      const readmeContent = await getReadmeContent(githubUrl);
      const analysis = await summarizeRepository(readmeContent);

      return NextResponse.json({
        message: 'Success',
        data: {
          repository: githubUrl,
          analysis,
          timestamp: new Date().toISOString(),
        },
      });
    } catch (error) {
      console.error('Analysis Error:', error);
      return NextResponse.json({ error: 'Failed to analyze repository', details: error.message }, { status: 500 });
    }
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
