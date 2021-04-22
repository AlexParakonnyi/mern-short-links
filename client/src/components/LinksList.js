import React, { useContext, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { useHttp } from '../hooks/http.hook'
import { AuthContext } from '../context/AuthContext'
import { useMessage } from '../hooks/message.hook'
import { Loader } from '../components/Loader'

export const LinksList = ({ links, removeLink }) => {
  const history = useHistory()
  const { request, loading, error, clearError } = useHttp()
  const { token } = useContext(AuthContext)
  const message = useMessage()

  useEffect(() => {
    // message(error)
    clearError()
  }, [error, message, clearError])

  if (!links.length) {
    return <p className="center">There aren't links yet</p>
  }

  const clickHandler = (link) => {
    history.push(`/detail/${link._id}`)
  }

  const deleteHandler = async (link) => {
    try {
      const data = await request(
        '/api/link/delete',
        'POST',
        { linkId: link._id },
        { Authorization: `Bearer ${token}` }
      )

      if (data.deleted) {
        message('Link successfully deleted')
        const clearLinks = links.filter((el) => el !== link)
        removeLink(clearLinks)
      }
    } catch (e) {}
  }

  if (loading) return <Loader />

  return (
    <table>
      <thead>
        <tr>
          <th>№</th>
          <th>Original</th>
          <th>Short</th>
          <th>Open</th>
        </tr>
      </thead>

      <tbody>
        {links.map((link, index) => {
          return (
            <tr key={link._id}>
              <td onClick={() => clickHandler(link)}>{index + 1}</td>
              <td onClick={() => clickHandler(link)}>{link.from}</td>
              <td onClick={() => clickHandler(link)}>{link.to}</td>
              <td>
                <button
                  className="waves-effect waves-light btn red lighten-2"
                  onClick={() => deleteHandler(link)}
                >
                  Delete
                </button>
              </td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}
