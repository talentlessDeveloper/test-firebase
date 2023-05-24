/* eslint-disable react/prop-types */
import { useState } from "react";

const CommentForm = ({ onSubmit, submitLabel = "Submit" }) => {
  const [comment, setComment] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit(comment);
    setComment("");
  };

  const handleChange = (event) => {
    setComment(event.target.value);
  };

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        className='w-full p-2 mb-2 border border-gray-300 rounded-lg'
        placeholder='Write your comment...'
        value={comment}
        onChange={handleChange}
      />
      <button
        type='submit'
        className='px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600'
        disabled={!comment}
      >
        {submitLabel}
      </button>
    </form>
  );
};

export default CommentForm;
