import { collection, getDocs, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { auth, db } from "../firebaseConfig";
import { convertDate } from "../utils/timeConvert";
import { Link } from "react-router-dom";

const Drafts = () => {
  const [drafts, setDrafts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getDrafts = async () => {
      setLoading(true);
      try {
        const { currentUser } = auth;
        const draftsRef = collection(db, "blogDrafts");
        const q = query(
          draftsRef,
          where("author.id", "==", `${currentUser.uid}`)
        );
        const draftsCollection = await getDocs(q);
        const draftsData = await draftsCollection.docs.map((draft) => {
          return {
            ...draft.data(),
            id: draft.id,
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
          {drafts.map((draft) => {
            return (
              <Link key={draft.id} to={`/draft/${draft.id}`}>
                <div className='shadow-md text-lg font-mono py-3 px-2 mt-2 space-y-2'>
                  <h2>{draft.title}</h2>
                  <div className='flex justify-between'>
                    <p>{draft.author.name}</p>
                    <p>{convertDate(draft.createdAt)}</p>
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
