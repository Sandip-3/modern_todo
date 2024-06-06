import React, { useState, ChangeEvent } from "react";
import { Input } from "../ui/input";
import { RxCross2 } from "react-icons/rx";
import { IoSend } from "react-icons/io5";

interface TagInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
}

const TagInput: React.FC<TagInputProps> = ({ tags, onChange }) => {
  const [inputValue, setInputValue] = useState("");

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const addTag = () => {
    if (inputValue.trim() !== "") {
      onChange([...tags, inputValue.trim()]);
      setInputValue("");
    }
  };

  const removeTag = (index: number) => {
    onChange(tags.filter((_, i) => i !== index));
  };

  return (
    <div className="">
      <div className="flex items-center gap-2">
        <Input
          variant="signup"
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder="Add a tag"
          className="w-full p-2 border border-gray-300 rounded"
        />
        <IoSend
          className={`${
            inputValue === ""
              ? "disabled size-0"
              : "p-2 rounded-md size-10 text-purple-500"
          }`}
          onClick={addTag}
        />
      </div>
      <div className="mt-2 flex flex-wrap gap-2">
        {tags.map((tag, index) => (
          <div
            key={index}
            className="bg-orange-300 text-white font-thin font-sans text-sm flex items-center px-1 rounded-full"
          >
            <span>{tag}</span>
            <RxCross2 onClick={() => removeTag(index)} size={15} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default TagInput;
