import React, { useState, useEffect } from 'react'

import blogService from './services/blogs'
import loginService from './services/login'

import Blog from './components/Blog'
import Notification from './components/Notification'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [message, setMessage] = useState(null);
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  /* const [newBlog, setNewBlog] = useState("") */

  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [url, setUrl] = useState('');


  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )
  }, [])

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
        username, password,
      })

      window.localStorage.setItem(
        'loggedBlogAppUser', JSON.stringify(user)
      )

      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setMessage(exception.error)
      setMessage('Wrong credentials')
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    }
  }

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        username
          <input
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
          <input
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit">login</button>
    </form>
  )

  const handleLogout = () => {
    setUser(null)
    blogService.setToken(user.token)
    window.localStorage.removeItem('loggedBlogAppUser')
  }

  const handleBlogTitleChange = (e) => setTitle(e.target.value)

  const handleBlogAuthorChange = (e) => setAuthor(e.target.value)

  const handleBlogUrlChange = (e) => setUrl(e.target.value)


  const addBlog = async (event) => {
    event.preventDefault();

    const blogObject = {
      title,
      author,
      url
    };

    try {
      const returnedBlog = await blogService.create(blogObject)
      setBlogs(blogs.concat(returnedBlog))
      setMessage(`A new blog "${title}" by ${author} has been added`)
      setTitle("");
      setAuthor("");
      setUrl("");
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    } catch (exception) {
      setMessage("an error occurred and the blog could not be created")
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    }
  };

  const blogForm = () => (
    <form onSubmit={addBlog}>
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
  )

  return (
    <div>

    <h1>Blog List App</h1>

    <Notification message={message} />

    <h2>login in to application</h2>
      {
        user === null
          ? loginForm()
          : <div>
            <p>
              {user.name} logged-in
              <button onClick={handleLogout}>
                logout
              </button>
            </p>
            { blogForm() }
          </div>
      }

      <h2>blogs</h2>
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  )
}

export default App