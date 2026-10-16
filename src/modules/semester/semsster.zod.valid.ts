import z from 'zod';

export const createSemester = z
  .object({
    name: z
      .string('Please provide a valid semester name')
      .trim()
      .min(1, 'Semester name is required')
      .max(50, 'Semester name must be at most 50 characters'),

    year: z
      .number('Please provide a valid year')
      .int('Year must be an integer')
      .min(2000, 'Year must be at least 2000')
      .max(2100, 'Year must be at most 2100'),

    startDate: z.coerce.date('Please provide a valid start date'),

    endDate: z.coerce.date('Please provide a valid end date'),
  })
  .superRefine((data, ctx) => {
    const startYear = data.startDate.getFullYear();
    const endYear = data.endDate.getFullYear();

    if (startYear !== data.year) {
      ctx.addIssue({
        code: 'custom',
        message: 'Start date year must match semester year',
        path: ['startDate'],
      });
    }

    if (endYear !== data.year) {
      ctx.addIssue({
        code: 'custom',
        message: 'End date year must match semester year',
        path: ['endDate'],
      });
    }

    if (data.endDate <= data.startDate) {
      ctx.addIssue({
        code: 'custom',
        message: 'End date must be after start date',
        path: ['endDate'],
      });
    }
  });

export const updateSemester = z
  .object({
    name: z
      .string('Please provide a valid semester name')
      .trim()
      .min(1, 'Semester name is required')
      .max(50, 'Semester name must be at most 50 characters')
      .optional(),

    year: z
      .number('Please provide a valid year')
      .int('Year must be an integer')
      .min(2000, 'Year must be at least 2000')
      .max(2100, 'Year must be at most 2100')
      .optional(),

    startDate: z.coerce.date('Please provide a valid start date').optional(),

    endDate: z.coerce.date('Please provide a valid end date').optional(),

    isActive: z.boolean('isActive must be a boolean').optional(),
  })
  .superRefine((data, ctx) => {
    
    if (data.year !== undefined && data.startDate) {
      if (data.startDate.getFullYear() !== data.year) {
        ctx.addIssue({
          code: 'custom',
          message: 'Start date year must match semester year',
          path: ['startDate'],
        });
      }
    }

    
    if (data.year !== undefined && data.endDate) {
      if (data.endDate.getFullYear() !== data.year) {
        ctx.addIssue({
          code: 'custom',
          message: 'End date year must match semester year',
          path: ['endDate'],
        });
      }
    }

    
    if (data.startDate && data.endDate) {
      if (data.endDate <= data.startDate) {
        ctx.addIssue({
          code: 'custom',
          message: 'End date must be after start date',
          path: ['endDate'],
        });
      }
    }
  });