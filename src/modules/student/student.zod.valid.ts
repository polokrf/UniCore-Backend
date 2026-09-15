 import z from 'zod'
export const createStudentProfile = z.object({
  departmentId: z.string('department-uuid'),
  batch: z.int('give batch year'),
  phone: z.string('give string number 01700000000'),
  dateOfBirth: z.string('give string date'),
  gender: z.string('give string gender like male'),
  address: z.string('give me string address like Naogaon, Bangladesh'),
});


export const updateProfile = z.object({
  phone: z.string('plz give an string number value').optional(),
  address: z.string('plz give an string  address value').optional(),
});