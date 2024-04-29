import React, { useState } from 'react'
import styled from '@emotion/styled'
import saveAs from 'file-saver'
import { createBook } from './epub.js'

const Container = styled.div`
    display: flex;
    box-sizing: border-box;
    padding: 1rem;
    align-items: center;
    min-height: 100vh;
    flex-direction: column;

    .title {
        font-size: 1.5rem;
        font-weight: bold;
    }

    .form-box {
        width: 100%;
        padding: 1rem;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
    }

    table {
        width: 100%;
        max-width: 400px;
        border: 1px solid #111;
        border-collapse: collapse;

        td {
            padding: .25rem .5rem;
            border: 1px solid #111;
        }
    }

    .text-center {
        text-align: center;
    }

    input {
        width: 100%;
        outline: none;
        border: none;
        text-align: center;

        &:disabled {
            background-color: inherit;
        }
    }

    span.selector {
        box-sizing: border-box;
        border-radius: 2px;
        font-size: .875rem;
        padding: .125rem 2rem;
        border: 1px dashed #999;
    }

    span.ellipsis {
        display: block;
        color: #999999;
        max-width: 380px;
        font-size: 14px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        cursor: default;
    }

    label {
        display: inline-block;
        height: max-content;
        position: relative;

        input {
            position: absolute;
            left: 0;
            top: 0;
            opacity: 0;
        }
    }

    .btn {
        position: relative;
        z-index: 1;
        display: inline-block;
        box-sizing: border-box;
        font-size: 1rem;
        line-height: 1.5;
        border: 1px solid #000;
        border-radius: 2px;
        background-color: #fff;
        transition: color, background-color 200ms;
        cursor: pointer;
        padding: .25rem .5rem;

        :hover {
            color: #fff;
            background-color: #000;
        }

        :active {
            transform: scale(0.95, 0.95);
            color: #fff;
            background-color: #000;
        }

        :disabled {
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
            <div className="title">Album Creator</div>
            <form className="form-box" onSubmit={handleSubmit}>
                <table>
                    <tbody>
                    <tr>
                        <td className="text-center">Title</td>
                        <td><input disabled={loading} type="text" name="title" placeholder="Enter title"/></td>
                    </tr>
                    <tr>
                        <td className="text-center">Creator</td>
                        <td><input disabled={loading} type="text" name="creator" placeholder="Enter create user"/></td>
                    </tr>
                    <tr>
                        <td className="text-center">Filename</td>
                        <td><input disabled={loading} type="text" name="filename" placeholder="Enter filename"/></td>
                    </tr>
                    <tr>
                        <td className="text-center">Images</td>
                        <td className="text-center">
                            <label>
                                <span className="btn">Select images</span>
                                <input disabled={loading} type="file"
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
                            <button className="btn" disabled={loading}>Create Album</button>
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
