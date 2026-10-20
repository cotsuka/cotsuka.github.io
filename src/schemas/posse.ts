import { z } from 'astro/zod';
import { PLATFORM_IDS } from '@utils/platforms';

/** A partial record permits any subset of the known platform IDs. */
export const posseSchema = z.partialRecord(z.enum(PLATFORM_IDS), z.url());
