import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import Blog from './Blog'

describe('<Blog />', () => {
  let component
  const blog = {
    title: 'title test',
    author: 'author test',
    url: 'https://test.com',
    likes: 1,
    user: '606f2ec415917a37c0b3732f'
  }
  const mockHandler = jest.fn()

  beforeEach(() => {
    component = render(
      <Blog
        blog={blog}
        addLike={mockHandler}
      />
    )
  })

  test('component displaying a blog renders the blog title and author, but does not render its url or number of likes by default', () => {
    component.getByText(blog.title)
    component.getByText(blog.author)
    expect(component.container).not.toHaveTextContent(blog.likes)
    expect(component.container).not.toHaveTextContent(blog.url)
  })

  test('blog url and number of likes are shown when the button controlling the shown details has been clicked', () => {
    const button = component.getByText('view')

    fireEvent.click(button)

    component.getByText(blog.title)
    component.getByText(blog.author)
    component.getByText(blog.likes)
    component.getByText(blog.url)
  })

  test('like button is clicked twice, the event handler the component received as props is called twice', () => {
    const viewButton = component.getByText('view')
    fireEvent.click(viewButton)
    expect(component.container).toHaveTextContent('like')

    const likesBtn = component.getByText('like')
    fireEvent.click(likesBtn)
    fireEvent.click(likesBtn)
    expect(mockHandler.mock.calls).toHaveLength(2)
  })
})
