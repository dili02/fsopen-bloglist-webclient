import React, { useState, useEffect } from 'react'

import blogService from './services/blogs'
import loginService from './services/login'

import Blog from './components/Blog'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [message, setMessage] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs)
    )
  }, [blogs])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username, password
      })

      window.localStorage.setItem(
        'loggedBlogAppUser', JSON.stringify(user)
      )

      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setMessage('Wrong credentials')
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    }
  }

  const handleLogout = () => {
    setUser(null)
    blogService.setToken(user.token)
    window.localStorage.removeItem('loggedBlogAppUser')
  }

  const addBlog = async (blogObject) => {
    try {
      const returnedBlog = await blogService.create(blogObject)
      setBlogs(blogs.concat(returnedBlog))
      setMessage('A new blog has been added')
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    } catch (exception) {
      setMessage('an error occurred and the blog could not be created')
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    }
  }

  const addLike = (id, likes) => {
    blogService.update({
      id: id,
      likes: likes + 1
    })
  }

  const deleteBlog = (id, title, author) => {
    console.log(id, title, author)
    const result = window.confirm(`Delete ${title} by ${author}`)

    if (result) {
      blogService.remove({
        id
      })
    }
  }

  const sortBlogsByLikes = (arrayblogs) => {
    arrayblogs.sort((a, b) => (a.likes > b.likes ? -1 : 1))
    return arrayblogs
  }

  return (
    <div>

      <h1>Blog List App</h1>

      <Notification message={message} />

      {
        user === null
          ? <LoginForm
            username={username}
            password={password}
            handleUserNameChange={({ target }) => setUsername(target.value)}
            handlePasswordChange={({ target }) => setPassword(target.value)}
            handleSubmit={handleLogin}
          />
          : <div>
            <p>
              {user.name} logged-in
              <button onClick={handleLogout}>
                logout
              </button>
            </p>
            <Togglable buttonLabel="create a new blog">
              <BlogForm addBlog={addBlog} />
            </Togglable>
          </div>
      }

      <h2>blogs</h2>

      {
        sortBlogsByLikes(blogs) && blogs.map(blog =>
          <Blog
            key={blog.id}
            blog={blog}
            addLike={addLike}
            deleteBlog={deleteBlog}
          />
        )
      }
    </div>
  )
}

export default App
