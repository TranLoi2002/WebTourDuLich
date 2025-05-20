import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, Link } from "react-router-dom";
import { getBlogs, getDetailBlog, createLike, deleteLike, createComment } from "../../api/blog.api";
import { verifyUser } from "../../api/auth.api";
import { format } from "date-fns";
import { toast } from "react-toastify";

const BlogDetail = () => {
    const { id } = useParams();
    const [blogs, setBlogs] = useState([]);
    const [blog, setBlog] = useState(null);
    const [relatedBlogs, setRelatedBlogs] = useState([]);
    const [comments, setComments] = useState([]);
    const [visibleComments, setVisibleComments] = useState([]);
    const [likes, setLikes] = useState(0);
    const [hasLiked, setHasLiked] = useState(false);
    const [newComment, setNewComment] = useState("");
    const [replyText, setReplyText] = useState({});
    const [showReplyInput, setShowReplyInput] = useState({});
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const commentsPerPage = 5;
    const commentSectionRef = useRef(null);

    const scrollToComments = () => {
        if (commentSectionRef.current) {
            commentSectionRef.current.scrollIntoView({ behavior: "smooth" });
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) {
            // console.error("Invalid date value:", dateString);
            return "Invalid Date";
        }
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) {
                console.error("Invalid date value:", dateString);
                return "Invalid Date";
            }
            return format(date, 'MMMM dd, yyyy');
        } catch (error) {
            console.error("Date parsing error:", error);
            return "Invalid Date";
        }
    };

    const fetchAllPages = async (fetchFunction, size = 10, sortBy = 'id', sortDir = 'asc') => {
        let allData = [];
        let currentPage = 0;
        let totalPages = 1;

        while (currentPage < totalPages) {
            const response = await fetchFunction(currentPage, size, sortBy, sortDir);
            allData = [...allData, ...response.content];
            currentPage = response.currentPage + 1;
            totalPages = response.totalPages;
        }
        return allData;
    };

    const fetchBlogs = useCallback(async () => {
        try {
            setIsLoading(true);
            const allBlogs = await fetchAllPages(getBlogs);
            setBlogs(allBlogs);
        } catch (error) {
            setError("Failed to fetch blogs");
            console.error("Error fetching blogs:", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const verifyUserAuth = useCallback(async () => {
        try {
            const userData = localStorage.getItem('user');
            if (!userData) {
                setUser(null);
                return;
            }
            const parsedUser = JSON.parse(userData);
            const verifiedUser = await verifyUser(parsedUser.token);
            setUser(verifiedUser);
        } catch (error) {
            localStorage.removeItem('user');
            setUser(null);
            console.error("User verification failed:", error);
        }
    }, []);

    const fetchBlogDetails = useCallback(async () => {
        try {
            setIsLoading(true);
            if (blogs.length === 0) {
                await fetchBlogs();
            }
            const response = await getDetailBlog(id);
            if (!response || !response.categoryId) {
                throw new Error("Invalid blog data");
            }
            setBlog(response);
            setLikes(response.likeCount || 0);
            setComments(response.comments || []);
            setVisibleComments((response.comments || []).slice(0, commentsPerPage));
            setHasLiked(user && response.likes?.some(like => like.userId === user.id));
            const related = blogs.filter(
                (b) => b.categoryId === response.categoryId && b.id !== response.id
            );
            setRelatedBlogs(related);
        } catch (error) {
            setError("Failed to fetch blog details");
            console.error("Error fetching blog details:", error.message);
        } finally {
            setIsLoading(false);
        }
    }, [id, blogs, fetchBlogs, user]);

    useEffect(() => {
        verifyUserAuth();
    }, [verifyUserAuth]);

    useEffect(() => {
        if (id) {
            fetchBlogDetails();
        }
    }, [id, fetchBlogDetails]);

    const handleLike = async () => {
        if (!user) {
            toast.info("Please log in to like this post.");
            return;
        }
        try {
            if (hasLiked) {
                await deleteLike(id, user.id);
                setLikes(prev => prev - 1);
                setHasLiked(false);
                setBlog(prev => ({ ...prev, likeCount: prev.likeCount - 1 })); // Cập nhật likeCount
            } else {
                await createLike(id, user.id);
                setLikes(prev => prev + 1);
                setHasLiked(true);
                setBlog(prev => ({ ...prev, likeCount: prev.likeCount + 1 }));
            }
        } catch (error) {
            setError(hasLiked ? "Failed to unlike post" : "Failed to like post");
            console.error("Error handling like:", error);
        }
    };

    const handleCommentSubmit = async () => {
        if (!user) {
            toast.info("Please log in to comment.");
            return;
        }
        if (!newComment.trim()) {
            toast.warn("Comment cannot be empty.");
            return;
        }
        try {
            const comment = await createComment(id, user.id, newComment, null);
            const newCommentWithReplies = {
                ...comment,
                replies: [],
                userName: user.username || "Anonymous",
                userAvatar: user.avatar || null
            };
            setComments(prev => {
                const updated = [...prev, newCommentWithReplies];
                setVisibleComments(updated.slice(0, visibleComments.length + 1));
                return updated;
            });
            setNewComment("");
            setBlog(prev => ({ ...prev, commentCount: prev.commentCount + 1 })); // Cập nhật commentCount
        } catch (error) {
            setError("Failed to post comment");
            console.error("Error creating comment:", error);
        }
    };

    const handleReplySubmit = async (parentCommentId) => {
        if (!user) {
            toast.info("Please log in to reply.");
            return;
        }
        const replyContent = replyText[parentCommentId]?.trim();
        if (!replyContent) {
            toast.warn("Reply cannot be empty.");
            return;
        }
        try {
            const reply = await createComment(id, user.id, replyContent, parentCommentId);
            const replyWithUser = {
                ...reply,
                replies: [],
                userName: user.username || "Anonymous",
                userAvatar: user.avatar || null,
                parentId: parentCommentId
            };
            setComments(prev => {
                const updated = prev.map(comment =>
                    comment.id === parentCommentId
                        ? { ...comment, replies: [...comment.replies, replyWithUser] }
                        : comment
                );
                setVisibleComments(updated.slice(0, visibleComments.length));
                return updated;
            });
            setReplyText(prev => ({ ...prev, [parentCommentId]: "" }));
            setShowReplyInput(prev => ({ ...prev, [parentCommentId]: false }));
        } catch (error) {
            setError("Failed to post reply");
            console.error("Error creating reply:", error);
        }
    };

    const toggleReplyInput = (commentId) => {
        setShowReplyInput(prev => ({ ...prev, [commentId]: !prev[commentId] }));
    };

    const loadMoreComments = () => {
        setVisibleComments(comments.slice(0, visibleComments.length + commentsPerPage));
    };

    if (isLoading) return <div className="text-center py-10">Loading...</div>;
    if (error) return <div className="text-center py-10 text-red-500">{error}</div>;

    return (
        <div className="max-w-5xl mx-auto px-7 pt-[6rem] pb-7">
            {blog && (
                <>


                    <div className="flex flex-row justify-between">
                        <div>
                            <span className="text-orange-500 bg-orange-100 text-sm py-1 px-2 rounded-lg">
                                {blog.categoryName || "N/A"}
                            </span>
                            <div className="flex gap-3 mt-4">
                                <h1 className="text-3xl font-bold mb-4">{blog.title}</h1>
                                <div className="flex items-end gap-2 mb-4">
                                    <h4 className="text-gray-500 font-bold">{formatDate(blog.createdAt)}</h4>
                                    <span className="text-gray-500">by {blog.authorName}</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 mb-4">
                            <button
                                onClick={handleLike}
                                // className={`px-4 py-2 rounded-lg transition ${
                                //     hasLiked
                                //         ? "bg-blue-600 text-white"
                                //         : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                // }`}
                                // disabled={!user}
                            >
                                <i className={`fa-solid fa-heart text-xl ${hasLiked ? "text-red-600" : "text-gray-500"}`}></i>
                                ( {blog.likeCount} )
                            </button>
                            <span onClick={scrollToComments} className="cursor-pointer">
                                <i className="fa-solid fa-comment-dots text-xl text-gray-500"></i>( {blog.commentCount} )
                            </span>
                            <button>
                                {/*<i className="fa-solid fa-bookmark text-xl text-gray-500"></i>*/}
                            </button>
                        </div>
                    </div>

                    <img
                        src={blog.thumbnail}
                        alt="Thumbnail"
                        className="w-full h-[65vh] mb-4 rounded-lg object-cover overflow-hidden"
                    />
                    <div className="mb-4" dangerouslySetInnerHTML={{__html: blog.content}}></div>

                    <div ref={commentSectionRef} className="mt-8">
                        <h2 className="text-2xl font-bold mb-4">Comments</h2>
                        {user ? (
                            <div className="mb-4">
                                <textarea
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Write a comment..."
                                />
                                <button
                                    onClick={handleCommentSubmit}
                                    className="bg-green-500 text-white px-4 py-2 mt-2 rounded-lg hover:bg-green-600 transition"
                                >
                                    Post
                                </button>
                            </div>
                        ) : (
                            <p className="text-gray-500">Please log in to comment.</p>
                        )}

                        <ul>
                            {visibleComments.map((comment) => (
                                <li key={comment.id} className="mb-4 border-b pb-4">
                                    <div className="flex items-start gap-3">
                                        <img
                                            src={comment.userAvatar || "https://via.placeholder.com/40"}
                                            alt="Avatar"
                                            className="w-10 h-10 rounded-full object-cover"
                                        />
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                <p className="font-bold">{comment.userName || "Anonymous"}</p>
                                                <p className="text-sm text-gray-500">
                                                    {formatDate(comment.createdAt)}
                                                </p>
                                            </div>
                                            <p className="mt-1">{comment.content}</p>
                                            <div className="mt-2 flex items-center gap-2">
                                                {user && (
                                                    <button
                                                        onClick={() => toggleReplyInput(comment.id)}
                                                        className="text-blue-500 text-sm hover:underline"
                                                    >
                                                        {showReplyInput[comment.id] ? "Cancel" : "Reply"}
                                                    </button>
                                                )}
                                                {comment.replies.length > 0 && (
                                                    <span className="text-sm text-gray-500">
                                                        ({comment.replies.length} {comment.replies.length === 1 ? "reply" : "replies"})
                                                    </span>
                                                )}
                                            </div>
                                            {showReplyInput[comment.id] && user && (
                                                <div className="mt-2">
                                                    <textarea
                                                        value={replyText[comment.id] || ""}
                                                        onChange={(e) => setReplyText(prev => ({
                                                            ...prev,
                                                            [comment.id]: e.target.value
                                                        }))}
                                                        className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                        placeholder="Write a reply..."
                                                    />
                                                    <button
                                                        onClick={() => handleReplySubmit(comment.id)}
                                                        className="bg-green-500 text-white px-4 py-2 mt-2 rounded-lg hover:bg-green-600 transition"
                                                    >
                                                        Answer
                                                    </button>
                                                </div>
                                            )}
                                            {comment.replies.length > 0 && (
                                                <div className="ml-4 mt-2">
                                                    {comment.replies.map((reply) => (
                                                        <div
                                                            key={reply.id}
                                                            className="flex items-start gap-3 mt-2 border-l pl-4"
                                                        >
                                                            <img
                                                                src={reply.userAvatar || "https://via.placeholder.com/40"}
                                                                alt="Avatar"
                                                                className="w-8 h-8 rounded-full object-cover"
                                                            />
                                                            <div className="flex-1">
                                                                <div className="flex items-center gap-2">
                                                                    <p className="font-bold">{reply.userName || "Anonymous"}</p>
                                                                    <p className="text-sm text-gray-500">
                                                                        {formatDate(reply.createdAt)}
                                                                    </p>
                                                                </div>
                                                                <p className="mt-1">{reply.content}</p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                        {visibleComments.length < comments.length && (
                            <button
                                onClick={loadMoreComments}
                                className="mt-4 text-blue-500 hover:underline"
                            >
                                Load More Comments
                            </button>
                        )}
                    </div>

                    <div className="mb-4 mt-20">
                        <h2 className="text-2xl font-bold mb-2">Related Posts</h2>
                        <ul>
                            {relatedBlogs.map((relatedBlog) => (
                                <li key={relatedBlog.id} className="flex gap-4 mb-4 border-b pb-4">
                                    <img
                                        src={relatedBlog.thumbnail || "https://via.placeholder.com/150"}
                                        alt={relatedBlog.title}
                                        className="w-24 h-24 object-cover rounded-lg"
                                    />
                                    <div>
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="text-orange-500 bg-orange-100 text-sm py-1 px-2 rounded-lg">
                                                {relatedBlog.categoryName}
                                            </span>
                                            <h4 className="text-gray-500 font-bold">
                                                {formatDate(relatedBlog.createdAt)}
                                            </h4>
                                        </div>
                                        <Link
                                            to={`/blogs/detailblog/${relatedBlog.id}`}
                                            className="text-lg font-semibold hover:text-blue-500 transition"
                                        >
                                            {relatedBlog.title}
                                        </Link>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </>
            )}
        </div>
    );
};

export default BlogDetail;