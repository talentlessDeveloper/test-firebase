import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useState } from "react";
import { auth, db } from "../firebaseConfig";
import { useNavigate } from "react-router";

function UserPostForm() {
  const [postForm, setPostForm] = useState({
    title: "",
    body: "",
  });

  const [draftLoading, setDraftLoading] = useState(false);

  const navigate = useNavigate();

  function handleChange(e) {
    setPostForm({
      ...postForm,
      [e.target.id]: e.target.value,
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const { currentUser } = auth;

    try {
      const collectionRef = collection(db, "blogPosts");
      const post = {
        title: postForm.title,
        body: postForm.body,
        author: {
          id: currentUser.uid,
          name: currentUser.displayName,
        },
        createdAt: serverTimestamp(),
      };

      await addDoc(collectionRef, post);

      setPostForm({
        title: "",
        body: "",
      });

      navigate("/");
    } catch (error) {
      alert(error.mesage);
      console.error(error.message);
    }

    // TODO: Submit post to database or API
  }

  async function handleDraft() {
    setDraftLoading(true);

    const { currentUser } = auth;

    try {
      const collectionRef = collection(db, "blogDrafts");
      const draft = {
        title: postForm.title,
        body: postForm.body,
        author: {
          id: currentUser.uid,
          name: currentUser.displayName,
        },
        createdAt: serverTimestamp(),
      };

      await addDoc(collectionRef, draft);
      setDraftLoading(false);
      setPostForm({
        title: "",
        body: "",
      });
    } catch (error) {
      alert(error.mesage);
      console.error(error.message);
    }

    // TODO: Submit post to database or API
  }

  return (
    <div className='max-w-md mx-auto'>
      <h2 className='text-xl font-bold mb-4'>Create a Post</h2>
      <form onSubmit={handleSubmit} className='space-y-4'>
        <div>
          <label htmlFor='title' className='block font-medium mb-2'>
            Title
          </label>
          <input
            type='text'
            id='title'
            name='title'
            value={postForm.title}
            onChange={handleChange}
            className='w-full px-4 py-2 border border-gray-400 rounded-md'
            placeholder='Enter title'
            required
          />
        </div>
        <div>
          <label htmlFor='body' className='block font-medium mb-2'>
            Body
          </label>
          <textarea
            id='body'
            name='body'
            value={postForm.body}
            onChange={handleChange}
            className='w-full px-4 py-2 border border-gray-400 rounded-md'
            rows={4}
            placeholder='Enter body text'
            required
          />
        </div>
        <div className='flex gap-x-2 justify-end'>
          <button
            type='submit'
            className='px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors duration-200'
          >
            Submit
          </button>

          <button
            type='button'
            className='px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-200'
            onClick={handleDraft}
          >
            {draftLoading ? <p>Saving...</p> : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default UserPostForm;
