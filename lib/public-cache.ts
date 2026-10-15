import { revalidatePath } from 'next/cache';

/** Invalidates all public pages after a successful CMS mutation. */
export function revalidatePublicPages() {
  revalidatePath('/', 'layout');
}
