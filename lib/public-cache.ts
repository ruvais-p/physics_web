import { revalidatePath } from 'next/cache';
import { notifyTvDisplay } from '@/lib/tv-events';

/** Invalidates all public pages after a successful CMS mutation and alerts TV screens via SSE. */
export function revalidatePublicPages() {
  revalidatePath('/', 'layout');
  notifyTvDisplay();
}

