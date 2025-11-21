import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import fs from 'fs/promises';
import path from 'path';

// GET /api/translations - Get all translation files
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const locale = searchParams.get('locale');

    const messagesDir = path.join(process.cwd(), 'messages');

    if (locale) {
      // Return specific language file
      const filePath = path.join(messagesDir, `${locale}.json`);
      try {
        const content = await fs.readFile(filePath, 'utf-8');
        return NextResponse.json({
          locale,
          translations: JSON.parse(content),
        });
      } catch (error) {
        return NextResponse.json({ error: 'Language file not found' }, { status: 404 });
      }
    } else {
      // Return list of available languages
      const files = await fs.readdir(messagesDir);
      const languages = files
        .filter((file) => file.endsWith('.json'))
        .map((file) => file.replace('.json', ''));

      return NextResponse.json({ languages });
    }
  } catch (error) {
    console.error('Error fetching translations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch translations' },
      { status: 500 }
    );
  }
}

// POST /api/translations - Update translation file
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { locale, translations } = body;

    if (!locale || !translations) {
      return NextResponse.json(
        { error: 'Locale and translations are required' },
        { status: 400 }
      );
    }

    const messagesDir = path.join(process.cwd(), 'messages');
    const filePath = path.join(messagesDir, `${locale}.json`);

    // Ensure messages directory exists
    try {
      await fs.access(messagesDir);
    } catch {
      await fs.mkdir(messagesDir, { recursive: true });
    }

    // Write translations to file
    await fs.writeFile(
      filePath,
      JSON.stringify(translations, null, 2),
      'utf-8'
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating translations:', error);
    return NextResponse.json(
      { error: 'Failed to update translations' },
      { status: 500 }
    );
  }
}
