import { Test } from './test.model';
import { CreateTestInput, UpdateTestInput } from './dtos/test.dto';

export const getAllTests = () => Test.find().sort({ createdAt: -1 });

export const getTestById = (id: string) => Test.findById(id);

export const createTest = (data: CreateTestInput) => Test.create(data);

export const updateTest = (id: string, data: UpdateTestInput) =>
  Test.findByIdAndUpdate(id, data, { new: true });

export const deleteTest = (id: string) => Test.findByIdAndDelete(id);
