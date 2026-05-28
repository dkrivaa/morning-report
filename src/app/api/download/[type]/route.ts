import { NextRequest, NextResponse } from 'next/server';
import { apiStream } from '@/lib/api';

export async function GET(
  _req: NextRequest,
  { params }: { params: { type: string } }
) {
  const { type } = params; // 'income' or 'expense'

  if (!['income', 'expense'].includes(type)) {
    return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
  }

  const upstream = await apiStream(`/reports/${type}/pdf`);

  return new NextResponse(upstream.body, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${type}-report.pdf"`,
    },
  });
}