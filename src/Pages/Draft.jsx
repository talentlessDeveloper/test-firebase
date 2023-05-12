// import { doc, getDoc } from "firebase/firestore";
// import { useEffect, useState } from "react";
// import { db } from "../firebaseConfig";
// import { useParams } from "react-router";

const Draft = () => {
  //     const [draftForm, setDraftForm] = useState({});
  //   const [draft, setDraft] = useState({});
  //   const [loading, setLoading] = useState(true);

  //   const params = useParams();

  //   useEffect(() => {
  //     const getDraft = async () => {
  //       const draftRef = await doc(db, "blogDrafts", params.postId);

  //       // Fetch post data from Firestore
  //       const draftSnapshot = await getDoc(draftRef);
  //       const draftData = draftSnapshot.data();

  //       setLoading(false);

  //       setDraft(draftData);
  //     };
  //     getDraft();
  //   }, [params.postId]);

  //   if (loading) return <div>Loading...</div>;

  return (
    <div className='max-w-md mx-auto'>
      <h2 className='text-xl font-bold mb-4'>Create a Post</h2>
      <form className='space-y-4'>
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
          ></button>
        </div>
      </form>
    </div>
  );
};

export default Draft;
