import React, { useState } from 'react'

export const LinkCard = ({ link }) => {
  const [clicks, setClicks] = useState(link.clicks)

  const clickHandler = () => {
    setClicks((prev) => prev + 1)
  }

  return (
    <>
      <h2>Link</h2>
      <p>
        Your link:{' '}
        <a
          href={link.to}
          target="_blank"
          rel="noreferrer noopener"
          onClick={clickHandler}
        >
          {link.to}
        </a>
      </p>
      <p>
        Link from:{' '}
        <a href={link.from} target="_blank" rel="noreferrer noopener">
          {link.from}
        </a>
      </p>
      <p>
        Count of clicks: <strong>{clicks}</strong>
      </p>
      <p>
        Date of creation:{' '}
        <strong>{new Date(link.date).toLocaleDateString()}</strong>
      </p>
    </>
  )
}
