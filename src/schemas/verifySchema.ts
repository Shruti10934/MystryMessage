import {z} from 'zod';

export const verifySchema = z.string().length(6, 'Verification code most be 6 digits')


