import React, {useState} from 'react';

const BlogDetail = () => {
    const blog = {
        title: "Blog Title",
        thumbnail: "https://picsum.photos/200",
        content: "<p>Blog content.</p>",
        images: ["https://picsum.photos/201", "https://picsum.photos/202"],
        category: "Travel",
        date: "Jun 20, 2021",
        author: "John Doe",
    };

    const relatedPosts = [
        {
            id: 1,
            title: "Related Post 1",
            date: "Jun 20, 2021",
            category: "Hotel Booking",
            image: "https://picsum.photos/204"
        },
        {
            id: 2,
            title: "Related Post 2",
            date: "Dec 20, 2020",
            category: "Car Booking",
            image: "https://picsum.photos/205"
        }
    ];

    const [review, setReview] = useState('');

    const handleReviewSubmit = () => {
        alert('Review submitted successfully');
        setReview('');
    };

    return (
        <div className="max-w-5xl mx-auto px-7 pt-[6rem] pb-7">
            <div className="flex flex-row justify-between">
                <div className="">
                    <span className="text-orange-500 bg-orange-100 text-sm py-1 px-2 rounded-lg">{blog.category}</span>
                    <div className="flex gap-3 mt-4">
                        <h1 className="text-3xl font-bold mb-4">{blog.title}</h1>
                        <div className="flex items-end gap-2 mb-4">
                            <h4 className="text-gray-500 font-bold">{blog.date}</h4>
                            <span className="text-gray-500">by {blog.author}</span>
                        </div>
                    </div>
                </div>

                    <div>
                        <button className="text-gray-500 hover:text-orange-500">
                            <i className="fas fa-bookmark text-xl"></i>
                        </button>
                        <button className="text-gray-500 hover:text-orange-500 ml-4">
                            <i className="fas fa-share-alt text-xl"></i>
                        </button>
                    </div>
            </div>

            <img src={blog.thumbnail} alt="Thumbnail" className="w-full h-[65vh] mb-4 rounded-lg object-cover overflow-hidden"/>
            <div className="mb-4" dangerouslySetInnerHTML={{__html: blog.content}}></div>
            <div className="flex flex-wrap gap-4 mb-4">
                {blog.images.map((image, index) => (
                    <img key={index} src={image} alt={`Additional ${index}`}
                         className="w-32 h-32 object-cover rounded-lg"/>
                ))}
            </div>
            <div className="mb-4">
                <h2 className="text-2xl font-bold mb-2">Related Posts</h2>
                <ul>
                    {relatedPosts.map(post => (
                        <li key={post.id} className="flex gap-4 mb-4 border-b pb-4">
                            <img src={post.image} alt={post.title} className="w-24 h-24 object-cover rounded-lg"/>
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <span
                                        className="text-orange-500 bg-orange-100 text-sm py-1 px-2 rounded-lg">{post.category}</span>
                                    <h4 className="text-gray-500 font-bold">{post.date}</h4>
                                </div>
                                <h3 className="text-lg font-semibold">{post.title}</h3>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="mb-4">
                <h2 className="text-2xl font-bold mb-2">Leave a Review</h2>
                <textarea
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                    placeholder="Write your review here"
                    className="w-full h-32 p-2 border rounded-lg mb-2"
                ></textarea>
                <button
                    onClick={handleReviewSubmit}
                    className="py-2 px-4 bg-blue-500 text-white rounded-lg"
                >
                    Submit
                </button>
            </div>
        </div>
    );
};

export default BlogDetail;