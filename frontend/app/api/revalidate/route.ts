import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';

export async function POST(req: NextRequest) {
  try {
    const { paths = [], tags = [] } = await req.json();

    if (paths.length > 0) {
      for (const path of paths) {
        // @ts-ignore
        revalidatePath(path);
      }
    }
    
    if (tags.length > 0) {
      for (const tag of tags) {
        // @ts-ignore
        revalidateTag(tag);
      }
    }

    return NextResponse.json({ success: true, revalidatedPaths: paths, revalidatedTags: tags });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Invalid request' }, { status: 400 });
  }
}
