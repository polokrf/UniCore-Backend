 import z from 'zod'
export const createStudentProfile = z.object({
  departmentId: z.string('department-uuid'),
  batch: z.int('give batch year'),
  phone: z.string('give string number 01700000000').optional(),
  dateOfBirth: z.string('give string date').optional(),
  gender: z.string('give string gender like male').optional(),
  address: z.string('give me string address like Naogaon, Bangladesh').optional,
});


export const updateProfile = z.object({
  phone: z.string('plz give an string number value').optional(),
  address: z.string('plz give an string  address value').optional(),
});