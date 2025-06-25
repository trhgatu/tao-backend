import { Template } from './__template__.model';
import { CreateTemplateInput, UpdateTemplateInput } from './dtos/__template__.dto';

export const getAllTemplates = () => Template.find().sort({ createdAt: -1 });

export const getTemplateById = (id: string) => Template.findById(id);

export const createTemplate = (data: CreateTemplateInput) => Template.create(data);

export const updateTemplate = (id: string, data: UpdateTemplateInput) =>
  Template.findByIdAndUpdate(id, data, { new: true });

export const deleteTemplate = (id: string) => Template.findByIdAndDelete(id);
