import { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { Link } from "react-router-dom";
import { convertDate } from "../utils/timeConvert";

const Landing = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getPosts = async () => {
      setLoading(true);
      try {
        const postsRef = collection(db, "blogPosts");
        const q = query(postsRef, orderBy("createdAt", "desc"));
        const postsCollection = await getDocs(q);
        const postsData = await postsCollection.docs.map((post) => {
          return {
            ...post.data(),
            id: post.id,
          };
        });

        setPosts(postsData);
        setLoading(false);
      } catch (err) {
        console.error(err.message);
        alert(err.message);
      }
    };
    getPosts();
  }, []);

  if (loading) return <h2>Loading...</h2>;

  return (
    <div className='max-w-3xl w-11/12 mx-auto flex flex-col justify-center items-center h-full'>
      {!posts.length > 0 ? (
        <div>You have {posts.length} Posts</div>
      ) : (
        <div>
          {posts.map((post) => {
            return (
              <Link key={post.id} to={`post/${post.id}`}>
                <div className='shadow-md text-lg font-mono py-3 px-2 mt-2 space-y-2'>
                  <h2>{post.title}</h2>
                  <div className='flex justify-between'>
                    <p>{post.author.name}</p>
                    <p>{convertDate(post.createdAt)}</p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Landing;
