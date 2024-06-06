import { addTagToTask } from '../Tasks/repository';
import { createTag, searchTags } from './repository';
import { Tag } from './types';

const TagService = {
  async createTag(data: Tag) {
    const newTag = await createTag(data);
    const taskId = newTag?.taskId || '';
    await addTagToTask(taskId.toString(), newTag._id.toString());
    return newTag;
  },
  async searchTag(search: string) {
    const searchData = await searchTags(search);
    return searchData;
  },
};

export default TagService;
