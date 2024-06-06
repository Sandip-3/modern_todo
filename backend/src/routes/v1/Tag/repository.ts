import { TagModel } from './model';
import { Tag } from './types';

export const createTag = (data: Tag) => {
  const newTag = TagModel.create(data);
  return newTag;
};

export const searchTags = (search: string) => {
  return TagModel.find({ title: { $regex: search, $options: 'i' } })
    .populate('taskId')
    .populate('asignerId')
    .exec();
};



