import React, { useState } from 'react'

const BlogForm = ({ addBlog }) => {
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [url, setUrl] = useState('');

    const handleBlogTitleChange = (e) => setTitle(e.target.value)

    const handleBlogAuthorChange = (e) => setAuthor(e.target.value)

    const handleBlogUrlChange = (e) => setUrl(e.target.value)

    const handleSubmit = (e) => {
        e.preventDefault()

        const blogObject = {
            title,
            author,
            url
        };

        addBlog(blogObject)

        setTitle("");
        setAuthor("");
        setUrl("");
    }

    return (
        <div>
            <h2>
                Create a New Blog
            </h2>

            <form onSubmit={handleSubmit}>
                <div>
                    title
                    <input
                        value={title}
                        onChange={handleBlogTitleChange}
                    />
                    </div>
                    <div>
                    author
                    <input
                        value={author}
                        onChange={handleBlogAuthorChange}
                    />
                    </div>
                    <div>
                    url
                    <input
                        value={url}
                        onChange={handleBlogUrlChange}
                    />
                </div>
                <button type="submit">create</button>
            </form>
        </div>
    )
}

export default BlogForm
