import { useEffect, useState } from "react";
import { auth, db } from "../firebaseConfig";
import { convertDate } from "../utils/timeConvert";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { Link } from "react-router-dom";

const UserPosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const getPosts = async () => {
      setLoading(true);

      try {
        const { currentUser } = auth;
        const postsRef = collection(db, "blogPosts");
        const q = query(
          postsRef,
          where("author.id", "==", `${currentUser.uid}`)
        );
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
    <div>
      {!posts.length > 0 ? (
        <div>You have {posts.length} Posts</div>
      ) : (
        <div>
          {posts.map((post) => {
            return (
              <div key={post.id}>
                <div className='shadow-md text-lg font-mono py-3 px-2 mt-2 space-y-2'>
                  <Link to={`post/${post.id}`}>
                    <h2>{post.title}</h2>
                  </Link>
                  <div className='flex justify-between'>
                    <p>{post.author.name}</p>
                    <p>{convertDate(post.createdAt)}</p>
                  </div>
                  <div className='flex gap-x-2'>
                    <button>🗑</button>
                    <button>✍</button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default UserPosts;
