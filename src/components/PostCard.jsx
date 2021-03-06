import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';
import { Link } from 'react-router-dom';
import { likePost, unLikePost, deletePost } from '../features/posts/request';
import { updatePostOnFeed } from '../features/posts/postsSlice';
import { InitialDP, isAlreadyLiked, getTimeAgo } from '.';
import {
    removePostOnProfile,
    updatePostOnProfile
} from '../features/profile/profileSlice';

export const PostCard = ({ post }) => {
    const { user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const isPostAlreadyLiked = isAlreadyLiked(post.likes, user._id);

    const likePostOnFeed = (userId) => {
        // create copy of post
        let clonedPost = JSON.parse(JSON.stringify(post));

        if (isPostAlreadyLiked) {
            let updatedLikes = clonedPost.likes.filter(
                (like) => like !== userId
            );
            clonedPost.likes = updatedLikes;
            // update in db
            dispatch(unLikePost(post?._id));
        } else {
            clonedPost.likes.push(userId);
            // update in db
            dispatch(likePost(post?._id));
        }
        // update in localState
        dispatch(updatePostOnFeed(clonedPost));
        dispatch(updatePostOnProfile(clonedPost));
    };

    const deleteHandler = () => {
        let postId = post._id;
        dispatch(deletePost(postId));
        dispatch(removePostOnProfile(postId));
    };

    return (
        <div className="my-4 bg-white rounded-md shadow">
            <div className="p-3 border-b">
                <div className="flex justify-between">
                    <Link
                        to={`/profile/${post.creator._id}`}
                        title="View Profile"
                    >
                        <div className="flex items-center">
                            {post.creator.profilePhoto ? (
                                <img
                                    className="w-10 h-auto rounded-md"
                                    src={post.creator.profilePhoto}
                                    alt={post.creator.name}
                                />
                            ) : (
                                <InitialDP
                                    name={post.creator.name}
                                    size={10}
                                    fontSize={'text-xl'}
                                />
                            )}
                            <div className="ml-3 leading-4">
                                <h4 className="font-semibold">
                                    {post.creator.name}
                                </h4>
                                <span className="text-sm font-semibold text-gray-400">
                                    @{post.creator.username}
                                </span>
                            </div>
                        </div>
                    </Link>
                    <div>
                        <span className="text-xs font-medium text-gray-500">
                            {getTimeAgo(post.createdAt)} ago
                        </span>
                    </div>
                </div>
                <div className="p-2 my-1">
                    <p className="mt-2 mb-4">{post.content}</p>
                    {post.postMedia && (
                        <img
                            className="w-full h-auto rounded"
                            src={post.postMedia}
                            alt={post.content.substring(0, 15)}
                        />
                    )}
                </div>
            </div>
            <div className="flex items-center justify-around p-1">
                <button
                    onClick={() => likePostOnFeed(user?._id)}
                    className="flex items-center"
                    title="Like"
                >
                    <i
                        className={`text-base bx ${
                            isPostAlreadyLiked
                                ? 'bxs-heart text-red-600'
                                : 'bx-heart'
                        }`}
                    ></i>
                    <span className="text-gray-400 font-normal ml-1">
                        {post?.likes.length > 0 && post?.likes.length}
                    </span>
                </button>
                <button
                    onClick={() => navigate(`/feed/${post._id}`)}
                    className="flex items-center"
                    title="Comment"
                >
                    <i className="text-lg bx bx-comment"></i>
                    <span className="text-gray-400 font-normal ml-1">
                        {post?.comments.length > 0 && post?.comments.length}
                    </span>
                </button>
                {user?._id === post.creator._id && (
                    <button
                        onClick={deleteHandler}
                        className="flex items-center"
                        title="Delete"
                    >
                        <i className="text-lg bx bx-trash"></i>
                    </button>
                )}
            </div>
        </div>
    );
};
