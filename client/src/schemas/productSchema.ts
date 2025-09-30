import { z } from 'zod';

export const productSchema = z.object({
  name: z
    .string()
    .min(1, 'Product name is required')
    .min(3, 'Product name must be at least 3 characters')
    .max(255, 'Product name must not exceed 255 characters'),
  
  price: z
    .number({ invalid_type_error: 'Price must be a number' })
    .min(0, 'Price must be greater than or equal to 0')
    .max(999999999, 'Price is too high'),
  
  stock: z
    .number({ invalid_type_error: 'Stock must be a number' })
    .int('Stock must be a whole number')
    .min(0, 'Stock must be greater than or equal to 0')
    .max(999999, 'Stock is too high'),
});

export type ProductFormData = z.infer<typeof productSchema>;