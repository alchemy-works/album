import JSZip from 'jszip'

import { getContainer, getPackage, getPage0, getToc, getStylesheet } from './template.jsx'

export async function createBook(data = {}) {
    const zip = new JSZip()
    // mimetype
    zip.file('mimetype', 'application/epub+zip');
    // meta info
    const metaInfoFolder = zip.folder('META-INF');
    metaInfoFolder.file('container.xml', await getContainer())
    // OPS
    const contentFolder = zip.folder('OPS');
    contentFolder.file('package.opf', await getPackage({ ...data }))
    // pages
    contentFolder.file('toc.xhtml', await getToc())
    contentFolder.file('page0.xhtml', await getPage0({ ...data }))
    // style
    contentFolder.file('stylesheet.css', await getStylesheet())
    // images
    const { images } = data
    const imageFolder = contentFolder.folder('images')
    images.forEach((it, i) => imageFolder.file(`${i}.${it.name.split('.').pop()}`, it))
    // build zip
    return await zip.generateAsync({ type: 'blob', mimeType: 'application/epub+zip' })
}