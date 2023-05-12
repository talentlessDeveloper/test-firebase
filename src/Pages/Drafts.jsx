import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../firebaseConfig";
import { convertDate } from "../utils/timeConvert";
import { Link } from "react-router-dom";

const Drafts = () => {
  const [drafts, setDrafts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getDrafts = async () => {
      setLoading(true);
      try {
        const draftsRef = collection(db, "blogDrafts");
        const q = query(draftsRef, orderBy("createdAt", "desc"));
        const draftsCollection = await getDocs(q);
        const draftsData = await draftsCollection.docs.map((post) => {
          return {
            ...post.data(),
            id: post.id,
          };
        });

        setDrafts(draftsData);
        setLoading(false);
      } catch (err) {
        console.error(err.message);
        alert(err.message);
      }
    };
    getDrafts();
  }, []);

  if (loading) return <h2>Loading...</h2>;

  return (
    <div className='max-w-3xl w-11/12 mx-auto flex flex-col justify-center items-center h-full'>
      {!drafts.length > 0 ? (
        <div>You have {drafts.length} drafts</div>
      ) : (
        <div>
          {drafts.map((post) => {
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

export default Drafts;
