import { NextResponse } from 'next/server';
import { apiKeyService } from '@/services/apiKeyService';

export async function POST(request) {
  try {
    // Get the API key from the Authorization header
    const apiKey = request.headers.get('Authorization')?.replace('Bearer ', '');

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

    // Get the request body
    const body = await request.json();

    // Process the request (example response)
    return NextResponse.json({
      message: 'Success',
      data: body,
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