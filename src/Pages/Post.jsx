import {
  Timestamp,
  doc,
  getDoc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { auth, db } from "../firebaseConfig";
import { useParams } from "react-router";
import CommentForm from "../components/CommentForm";
import { v4 } from "uuid";
import Comment from "../components/Comment";
import { convertDate } from "../utils/timeConvert";

const Post = () => {
  const [post, setPost] = useState({});
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState([]);
  const [activeComment, setActiveComment] = useState({});

  const rootComments = comments.filter((comment) => comment.parentId === null);

  const params = useParams();

  useEffect(() => {
    const getPost = async () => {
      const postRef = await doc(db, "blogPosts", params.postId);

      // Fetch post data from Firestore
      const postSnapshot = await getDoc(postRef);
      const postData = postSnapshot.data();

      setLoading(false);

      setPost(postData);
      if (postData.comments) {
        setComments(postData.comments);
      }
    };
    getPost();
  }, [params.postId]);

  const getReplies = (commentId) => {
    return comments
      .filter((c) => c.parentId === commentId)
      .sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
  };

  const addComment = async (text, parentId = null) => {
    const { currentUser } = auth;

    const commentData = {
      id: v4(),
      author: {
        name: currentUser.displayName,
        id: currentUser.uid,
      },
      createdAt: Timestamp.now(),
      body: text,
      parentId,
    };

    const commentsData = [commentData, ...comments];
    const postData = {
      ...post,
      comments: [...commentsData],
    };

    console.log(postData);

    // const collectionRef = db.collection("documents");

    // collectionRef.onSnapshot((snapshot) => {
    //   // Do something with the snapshot.
    // });

    try {
      const postRef = await doc(db, "blogPosts", params.postId);
      await updateDoc(postRef, postData);
      // onSnapshot(postRef, (snapshot) => {
      //   console.log(snapshot.data());
      // });

      setComments(commentsData);
    } catch (e) {
      console.log(e.message);
    }

    setActiveComment(null);
  };

  const updateComment = (text, commentId) => {
    const updated = comments.map((b) => {
      if (b.id === commentId) {
        return { ...b, body: text };
      }
      return b;
    });

    setComments(updated);
    setActiveComment(null);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className='container mx-auto mt-3 px-3 py-2'>
      <img src={post.imageUrl} alt='' className='w-full  object-cover' />
      <h1 className='text-2xl text-gray-900 text-center mt-3'>{post.title}</h1>
      <div className='space-y-2 mt-2'>
        <p className=' text-sm'>
          Created By :<span className='font-bold'>{post.author.name}</span>
        </p>
        <p className='text-xs italic'>
          CreatedAt: {convertDate(post.createdAt)}
        </p>
      </div>
      <p className='mt-7'>{post.body}</p>
      <div className='mt-8'>
        <CommentForm onSubmit={addComment} />
      </div>
      <div className='mt-5'>
        {rootComments.length > 0 &&
          rootComments.map((comment) => {
            const { author, body, createdAt, id } = comment;
            return (
              <Comment
                key={comment.id}
                author={author}
                body={body}
                createdAt={createdAt}
                id={id}
                replies={getReplies(id)}
                activeComment={activeComment}
                setActiveComment={setActiveComment}
                addComment={addComment}
                updateComment={updateComment}
              />
            );
          })}
      </div>
    </div>
  );
};

export default Post;
