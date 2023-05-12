import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../firebaseConfig";
import { useParams } from "react-router";

const Post = () => {
  const [post, setPost] = useState({});
  const [loading, setLoading] = useState(true);

  const params = useParams();

  useEffect(() => {
    const getPost = async () => {
      const postRef = await doc(db, "blogPosts", params.postId);

      // Fetch post data from Firestore
      const postSnapshot = await getDoc(postRef);
      const postData = postSnapshot.data();

      setLoading(false);

      setPost(postData);
    };
    getPost();
  }, [params.postId]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className='container mx-auto mt-3 px-3 py-2'>
      <h1 className='text-2xl text-gray-900'>{post.title}</h1>
      <p className='mt-2'>{post.author.name}</p>
      <p className='mt-7'>{post.body}</p>
    </div>
  );
};

export default Post;
