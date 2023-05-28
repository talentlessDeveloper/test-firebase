import {
  Timestamp,
  doc,
  getDoc,
  increment,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { auth, db } from "../firebaseConfig";
import { useNavigate, useParams } from "react-router";
import CommentForm from "../components/CommentForm";
import { v4 } from "uuid";
import Comment from "../components/Comment";
import { convertDate } from "../utils/timeConvert";
import Reactions from "../components/Reactions";
import { useAuthStatus } from "../hooks/UseAuth";
import { getAuth } from "firebase/auth";
import { deleteDocApi } from "../utils/deleteDocApi";

const Post = () => {
  const [post, setPost] = useState({});
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState([]);
  const [activeComment, setActiveComment] = useState({});
  const [emojis, setEmojis] = useState({
    thumbsUp: 0,
    hooray: 0,
    heart: 0,
    rocket: 0,
    eyes: 0,
  });

  const { user } = useAuthStatus();
  const { currentUser } = getAuth();
  const navigate = useNavigate();

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

      if (postData.reactions) {
        setEmojis(postData.reactions);
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

  const addReactions = async (name) => {
    console.log(name);

    setEmojis((em) => ({
      ...em,
      [name]: emojis[name]++,
    }));

    try {
      const postRef = await doc(db, "blogPosts", params.postId);
      await updateDoc(postRef, {
        ...post,
        reactions: {
          ...emojis,
        },
      });
      // onSnapshot(postRef, (snapshot) => {
      //   const reaction = snapshot.data().reactions;
      //   console.log(reaction);
      //   setEmojis(reaction);
      // });

      // setEmojis((em) => ({
      //   ...em,
      //   [name]: emojis[name]++,
      // }));
    } catch (e) {
      console.log(e.message);
    }
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

  const updateComment = async (text, commentId) => {
    const updated = comments.map((b) => {
      if (b.id === commentId) {
        return { ...b, body: text };
      }
      return b;
    });

    const postData = {
      ...post,
      comments: [...updated],
    };

    try {
      const postRef = await doc(db, "blogPosts", params.postId);
      await updateDoc(postRef, postData);
      // onSnapshot(postRef, (snapshot) => {
      //   console.log(snapshot.data());
      // });

      setComments(updated);
    } catch (e) {
      console.log(e.message);
    }

    setActiveComment(null);
  };

  const deleteComment = async (commentId) => {
    if (window.confirm("Delete?")) {
      const updated = comments.filter((b) => b.id !== commentId);

      const postData = {
        ...post,
        comments: [...updated],
      };

      try {
        const postRef = await doc(db, "blogPosts", params.postId);
        await updateDoc(postRef, postData);
        // onSnapshot(postRef, (snapshot) => {
        //   console.log(snapshot.data());
        // });

        setComments(updated);
      } catch (e) {
        console.log(e.message);
      }
    }
  };

  const deletePost = async () => {
    try {
      const postRef = await doc(db, "blogPosts", params.postId);
      await deleteDocApi(postRef);
      navigate("/");
    } catch (e) {
      console.log(e.message);
    }
  };

  if (loading) return <div>Loading...</div>;
  const canDelete = user && currentUser?.uid === post?.author?.id;

  return (
    <div className='container mx-auto mt-3 px-3 py-2 relative'>
      {canDelete ? (
        <button
          onClick={deletePost}
          className='bg-red-500 absolute right-0 bottom-0 text-white px-4 py-2'
        >
          Delete Post
        </button>
      ) : null}
      <div className='flex gap-2'>
        <div className='w-[10%]'>
          <Reactions emojis={emojis} addReactions={addReactions} />
        </div>
        <div className='w-[90%]'>
          <img src={post.imageUrl} alt='' className='w-full  object-cover' />
          <h1 className='text-2xl text-gray-900 text-center mt-3'>
            {post.title}
          </h1>
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
                    deleteComment={deleteComment}
                  />
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Post;
