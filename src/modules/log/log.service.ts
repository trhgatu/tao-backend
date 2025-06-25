import Log from './log.model'
import { CreateLogInput, UpdateLogInput } from './dtos/log.dto';

export const getAllLogs = () => Log.find().sort({ createdAt: -1 });

export const getLogById = (id: string) => Log.findById(id);

export const createLog = (data: CreateLogInput) => Log.create(data);

export const updateLog = (id: string, data: UpdateLogInput) =>
  Log.findByIdAndUpdate(id, data, { new: true });

export const deleteLog = (id: string) => Log.findByIdAndDelete(id);
