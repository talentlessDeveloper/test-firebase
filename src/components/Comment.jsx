/* eslint-disable react/prop-types */

import CommentForm from "./CommentForm";

import { auth } from "../firebaseConfig";
import { convertDate } from "../utils/timeConvert";

const Comment = ({
  author,
  body,
  createdAt,
  id,
  replies,
  activeComment,
  setActiveComment,
  addComment,
  updateComment,
  parentId = null,
}) => {
  const { currentUser } = auth;

  const canReply = Boolean(currentUser.uid);
  const fiveMinutes = 300000;
  const timePassed = new Date() - new Date(createdAt) > fiveMinutes;

  const canEdit = currentUser.uid === author.id && !timePassed;
  const canDelete = currentUser.uid === author.id && !timePassed;

  const isReplying =
    activeComment &&
    activeComment.type === "replying" &&
    activeComment.id === id;
  const isEditing =
    activeComment &&
    activeComment.type === "editing" &&
    activeComment.id === id;

  const replyId = parentId ? parentId : id;

  return (
    <div className='flex items-start my-4'>
      <div className='flex-shrink-0'>
        <img
          className='w-10 h-10 rounded-full object-cover'
          src={
            author.avatar
              ? author.avatar
              : "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8YXZhdGFyfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60"
          } // Assuming the author object has an "avatar" field
          alt={author.name} // Assuming the author object has a "name" field
        />
      </div>
      <div className='ml-4'>
        <div className='flex items-center'>
          <span className='font-bold'>{author.name}</span>
          <span className='ml-2 text-gray-600 text-sm'>
            {convertDate(createdAt)}
          </span>
        </div>

        {!isEditing && <p className='text-gray-800'>{body}</p>}
        {isEditing && (
          <CommentForm
            submitLabel='Update'
            hasCancelButton
            initialText={body}
            handleSubmit={(text) => updateComment(text, replyId)}
            handleCancel={() => setActiveComment(null)}
          />
        )}
        <div className='flex gap-x-3 mt-1'>
          {canReply && (
            <button
              className='text-sm text-slate-500'
              onClick={() =>
                setActiveComment({
                  id,
                  type: "replying",
                })
              }
            >
              Reply
            </button>
          )}
          {canEdit && <button className='text-sm text-slate-500'>Edit</button>}
          {canDelete && (
            <button className='text-sm text-slate-500'>Delete</button>
          )}
        </div>
        {isReplying && (
          <div className='mt-3 w-full max-w-3xl'>
            <CommentForm
              submitLabel={"Reply"}
              onSubmit={(text) => addComment(text, replyId)}
            />
          </div>
        )}
        {replies.length > 0 && (
          <div className='ml-8'>
            {replies.map((reply) => {
              return (
                <Comment
                  key={reply.id}
                  author={reply.author}
                  body={reply.body}
                  id={reply.id}
                  createdAt={reply.createdAt}
                  replies={[]}
                  parentId={id}
                  addComment={addComment}
                  updateComment={updateComment}
                  activeComment={activeComment}
                  setActiveComment={setActiveComment}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Comment;
