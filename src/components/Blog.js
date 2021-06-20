import React, { useState } from 'react'

const Blog = ({
  blog,
  addLike,
  deleteBlog
}) => {
  const [showFull, setShowFull] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const showFullBlog = () => (
    <div>
      <p>{blog.url}</p>
      <p>{blog.likes} <button onClick={() => addLike(blog.id, blog.likes)}>like</button></p>
      <p>{blog.user.username}</p>
      <button onClick={() => deleteBlog(blog.id, blog.title, blog.author)}>remove</button>
    </div>
  )

  const buttonLabel = showFull ? 'hide' : 'view'

  return (
    <div style={blogStyle}>
      <b>{blog.title}</b> - <i>{blog.author}</i> <button onClick={() => setShowFull(!showFull)}>{buttonLabel}</button>
      <div>
        {showFull && showFullBlog()}
      </div>
    </div>
  )
}

export default Blog
