import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../firebaseConfig";
import { useNavigate, useParams } from "react-router";

const Draft = () => {
  const [draftForm, setDraftForm] = useState({});
  // const [draft, setDraft] = useState({});
  const [loading, setLoading] = useState(true);
  const [loadingSaveDraft, setLoadingSaveDraft] = useState(false);
  const navigate = useNavigate();

  const params = useParams();

  const handleChange = (e) => {
    setDraftForm((prevForm) => ({
      ...prevForm,
      [e.target.id]: e.target.value,
    }));
  };

  useEffect(() => {
    const getDraft = async () => {
      const draftRef = await doc(db, "blogDrafts", params.draftId);

      // Fetch post data from Firestore
      const draftSnapshot = await getDoc(draftRef);
      const draftData = draftSnapshot.data();

      setLoading(false);

      setDraftForm(draftData);
    };
    getDraft();
  }, [params.draftId]);

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      const collectionRef = collection(db, "blogPosts");
      const draftRef = await doc(db, "blogDrafts", params.draftId);
      const draftPost = {
        title: draftForm.title,
        body: draftForm.body,
        author: draftForm.author,
        createdAt: serverTimestamp(),
      };

      await addDoc(collectionRef, draftPost);

      await deleteDoc(draftRef);

      setDraftForm({
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

  const updateDraft = async () => {
    const draftRef = await doc(db, "blogDrafts", params.draftId);
    setLoadingSaveDraft(true);
    try {
      await updateDoc(draftRef, {
        ...draftForm,
        updatedAt: serverTimestamp(),
      });
      setLoadingSaveDraft(false);
      navigate("/drafts");
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className='max-w-md mx-auto'>
      <h2 className='text-xl font-bold mb-4'>Create a Post</h2>
      <form className='space-y-4' onSubmit={handleSubmit}>
        <div>
          <label htmlFor='title' className='block font-medium mb-2'>
            Title
          </label>
          <input
            type='text'
            id='title'
            name='title'
            className='w-full px-4 py-2 border border-gray-400 rounded-md'
            placeholder='Enter title'
            required
            value={draftForm.title}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor='body' className='block font-medium mb-2'>
            Body
          </label>
          <textarea
            id='body'
            name='body'
            className='w-full px-4 py-2 border border-gray-400 rounded-md'
            rows={4}
            placeholder='Enter body text'
            required
            value={draftForm.body}
            onChange={handleChange}
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
            onClick={updateDraft}
          >
            {loadingSaveDraft ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Draft;
