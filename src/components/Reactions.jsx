import { useState } from "react";
import { useAuthStatus } from "../hooks/UseAuth";
import SignInModal from "./SIgnInModal";

/* eslint-disable react/prop-types */
const reactionEmoji = {
  thumbsUp: "👍",
  hooray: "🎉",
  heart: "❤️",
  rocket: "🚀",
  eyes: "👀",
};

//  onClick={() => dispatch(reactionAdded({ postId: post.id, reaction: name }))}
// { post.reactions[name] }

const Reactions = ({ emojis, addReactions }) => {
  //   const dispatch = useDispatch();

  // const [emojis, setEmojis] = useState({
  //   thumbsUp: 4,
  //   hooray: 6,
  //   heart: 8,
  //   rocket: 3,
  //   eyes: 2,
  // });
  const [modal, setModal] = useState(false);

  const { user } = useAuthStatus();

  const closeModal = () => setModal(false);

  const reactionButtons = Object.entries(reactionEmoji).map(([name, emoji]) => {
    return (
      <button
        key={name}
        type='button'
        className='text-base flex gap-2 items-center'
        name={name}
        onClick={() => {
          if (!user) {
            setModal(true);
            return;
          }
          addReactions(name);
        }}
      >
        <span>{emoji}</span>
        <span>{emojis[name]}</span>
      </button>
    );
  });

  return (
    <>
      <div className='flex flex-col h-full items-center pt-14 gap-3'>
        {reactionButtons}
      </div>
      {modal ? <SignInModal onClose={closeModal} /> : null}
    </>
  );
};

export default Reactions;
