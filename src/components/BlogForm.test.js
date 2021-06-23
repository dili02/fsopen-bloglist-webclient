import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import BlogForm from './BlogForm'

describe('<BlogForm />', () => {
  const addBlog = jest.fn()

  const component = render(<BlogForm addBlog={addBlog} />)

  test('algo', () => {
    const title = component.container.querySelector('#title')
    const author = component.container.querySelector('#author')
    const url = component.container.querySelector('#url')
    const form = component.container.querySelector('form')

    fireEvent.change(title, {
      target: { value: 'Testing Title' }
    })

    fireEvent.change(author, {
      target: { value: 'Testing Author' }
    })

    fireEvent.change(url, {
      target: { value: 'www.testing.com' }
    })

    fireEvent.submit(form)

    expect(addBlog.mock.calls).toHaveLength(1)
    expect(addBlog.mock.calls[0][0].title).toBe('Testing Title')
    expect(addBlog.mock.calls[0][0].author).toBe('Testing Author')
    expect(addBlog.mock.calls[0][0].url).toBe('www.testing.com')
  })
})
