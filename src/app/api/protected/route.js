import { NextResponse } from 'next/server';
import { apiKeyService } from '@/services/apiKeyService';

export async function POST(request) {
  try {
    // Get the request body
    const body = await request.json();
    const apiKey = body.apiKey;

    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key is required' },
        { status: 401 }
      );
    }

    // Validate the API key
    const isValid = await apiKeyService.validateApiKey(apiKey);

    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid API key' },
        { status: 401 }
      );
    }

    // Return success response
    return NextResponse.json({
      message: 'Success',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 