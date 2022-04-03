import React, { useState } from 'react'
import styled from '@emotion/styled'
import saveAs from 'file-saver'
import { createBook } from './epub.js'

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 75vh;

  & .form-box {
    height: 70%;
    width: 100%;
    padding: 2rem;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }
  
  & table {
    width: 100%;
    max-width: 400px;
  }

  & .text-center {
    text-align: center;
  }

  & input {
    width: 100%;
    outline: none;
    border: none;
    border-bottom: 1px solid #000;
    text-align: center;
    
    &:disabled {
      background-color: inherit;
    }
  }

  & span.selector {
    box-sizing: border-box;
    border-radius: 2px;
    font-size: .875rem;
    padding: .125rem 2rem;
    border: 1px dashed #999;
  }

  & span.ellipsis {
    display: block;
    color: #999999;
    max-width: 380px;
    font-size: 14px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    cursor: default;
  }

  & button.submit {
    font-size: 1rem;
    line-height: 1.5rem;
    box-sizing: border-box;
    border: 1px solid #000;
    border-radius: 2px;
    background-color: #fff;
    transition: color, background-color 200ms;
    cursor: pointer;
    padding-left: .5rem;
    padding-right: .5rem;

    &:hover {
      color: #fff;
      background-color: #000;
    }

    &:active {
      transform: scale(0.95, 0.95);
      color: #fff;
      background-color: #000;
    }

    &:disabled {
      opacity: .75;
      color: #000;
      background-color: #fff;
      cursor: not-allowed;
    }
  }
`

export default function Album(props) {

    const [loading, setLoading] = useState(false)
    const [selectedFileName, setSelectedFileName] = useState('')

    async function handleSubmit(ev) {
        ev.preventDefault()
        const form = ev.target
        const data = {
            images: form.images.files,
            filename: form.filename.value,
            title: form.title.value,
            creator: form.creator.value,
        }
        await onSubmitForm(data)
    }

    async function onSubmitForm(data = {}) {
        const { images = [], filename } = data
        setLoading(true)
        try {
            const bookBlob = await createBook({
                ...data,
                images: [...images],
            })
            saveAs(bookBlob, `${filename || new Date().getTime()}.epub`)
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    function handleFilesSelected(ev) {
        const files = Array.from(ev.target.files)
        const filename = files.map(it => it.name).join(',')
        setSelectedFileName(filename)
    }

    return (
        <Container>
            <form className="form-box" onSubmit={handleSubmit}>
                <table>
                    <tbody>
                    <tr>
                        <td className="text-center">Title</td>
                        <td><input disabled={loading} type="text" name="title" placeholder="Enter"/></td>
                    </tr>
                    <tr>
                        <td className="text-center">Creator</td>
                        <td><input disabled={loading} type="text" name="creator" placeholder="Enter"/></td>
                    </tr>
                    <tr>
                        <td className="text-center">Filename</td>
                        <td><input disabled={loading} type="text" name="filename" placeholder="Enter"/></td>
                    </tr>
                    <tr>
                        <td className="text-center">Images</td>
                        <td className="text-center">
                            <label style={{ cursor: 'pointer', marginTop: '1rem', }}>
                                <span className="selector">Select</span>
                                <input style={{ display: 'none' }} disabled={loading} type="file"
                                       onChange={handleFilesSelected}
                                       name="images" required multiple accept=".jpg,.jpeg,.png,.gif"/>
                            </label>
                        </td>
                    </tr>
                    {selectedFileName && (
                        <tr>
                            <td className="text-center" colSpan="2">
                            <span title={selectedFileName} className="ellipsis">
                                {selectedFileName}
                            </span>
                            </td>
                        </tr>
                    )}
                    <tr>
                        <td className="text-center" colSpan="2">
                            <button className="submit" disabled={loading}>Create Album</button>
                            <br/>
                            <span style={{ marginTop: '1rem', }}>
                                {loading && 'Book creating...'}
                            </span>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </form>
        </Container>
    )
}
