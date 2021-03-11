if (window.location.href.includes('edit') && window.location.href.includes('recipes')) {
    document.querySelector('input[name="removed_files"]').value = ""
}
const photosUpload = {
    input: "",
    files: [],
    inputAdd(event, page) {
        photosUpload.input = event.target
        const files = event.target.files

        if (page == 'recipes') {
            if (photosUpload.limit(event, page)) return
        }

        Array.from(files).forEach(file => {
            photosUpload.files.push(file)
            if (page == 'recipes') {
                const reader = new FileReader()
                reader.onload = () => {
                    const image = new Image()
                    image.src = String(reader.result)
                    const div = photosUpload.container(image)

                    document.querySelector('.field_container.images .preview').appendChild(div)
                }
                reader.readAsDataURL(file)
            }
        })

        photosUpload.input.files = photosUpload.allFiles()
        this.urlChange()
    },
    limit(event) {
        let uploadLimit = 5

        const files = photosUpload.input.files
        const preview = document.querySelector('.preview')

        if (files.length > uploadLimit) {
            alert(`Envie no máximo ${uploadLimit} arquivos`)
            event.preventDefault()
            return true
        }

        let imagesQuantity = []
        preview.childNodes.forEach(item => {
            const classes = item.classList
            if (classes) {
                if (classes.contains('image')) { imagesQuantity.push(item) }
            }
        })

        if (files.length + imagesQuantity.length > uploadLimit) {
            alert('você atingiu o limite máximo de fotos')
            event.preventDefault()
            return true
        }

        return false
    },
    allFiles() {
        const dataTransfer = new ClipboardEvent("").clipboardData || new DataTransfer
        photosUpload.files.forEach(file => dataTransfer.items.add(file))

        return dataTransfer.files
    },
    container(image) {
        const div = document.createElement('div')

        div.classList.add('image')
        div.onclick = photosUpload.remove

        div.appendChild(image)
        div.appendChild(photosUpload.icon())

        return div
    },
    icon(div) {
        const button = document.createElement('i')
        button.classList.add('material-icons')
        button.innerHTML = 'close'

        return button
    },
    remove(event) {
        const div = event.target.parentNode
        const images = Array.from(document.querySelector('.images .preview').children)
        let index = images.indexOf(div)

        photosUpload.files.splice(index, 1)
        photosUpload.input.files = photosUpload.allFiles()

        div.remove()
    },
    delete(event) {
        const div = event.target.parentNode

        if (div.id) {
            const removedFiles = document.querySelector('input[name="removed_files"]')
            if (removedFiles) {
                removedFiles.value += `${div.id},`
            }
        }
        div.remove()
    },
    urlChange() {
        const urlholder = document.querySelector("input.url_holder")
        if (urlholder) {
            urlholder.value = photosUpload.input.files[0].name
        }
    }
}
const gallery = {
    highlight(event) {
        const { target } = event
        document.querySelectorAll('.preview img').forEach(image => image.classList.remove('active'))

        target.classList.add('active')

        document.querySelector('.highlight').src = target.src
    }
}
const defaultBorder = (event) => {
    const input = event.target
    input.style.border = ' 1px solid #DDDDDD'
}

let setAdmin = (event) => {
    const input = event.target

    if (input.checked)
        input.value = true

    if (!input.checked)
        input.value = false
}

const containers = document.querySelectorAll(".container")
const sections = document.querySelectorAll(".section")
const fields = document.querySelectorAll(".field_container.addible")
const select = document.querySelector("select")
const options = document.querySelectorAll("option")

for (let container of containers) {

    if (window.location.href.includes('admin') && window.location.href.includes('recipes')) {
        container.addEventListener('click', function () {
            const id = container.getAttribute('id')
            window.location.href = `/admin/recipes/${id}`
        })
    } else if (window.location.href.includes('admin') && window.location.href.includes('chefs')) {
        container.addEventListener('click', function () {
            const id = container.getAttribute('id')
            window.location.href = `/admin/chefs/${id}`
        })
    } else if (window.location.href.includes('chefs')) {
        container.addEventListener('click', function () {
            const id = container.getAttribute('id')
            window.location.href = `/chefs/${id}`
        })
    } else {
        container.addEventListener('click', function () {
            const id = container.getAttribute('id')
            window.location.href = `/recipes/${id}`
        })
    }
}
for (let section of sections) {
    let button = section.querySelector("span")
    button.addEventListener('click', function () {
        if (button.innerHTML == "ESCONDER") {
            button.innerHTML = "MOSTRAR"
            section.classList.add('hide')
        } else {
            button.innerHTML = "ESCONDER"
            section.classList.remove('hide')
        }
    })
}
for (let field of fields) {
    const thefields = field.querySelector(".thefields")
    let inputs = thefields.querySelectorAll("input")
    const button = field.querySelector("button")

    button.addEventListener('click', function () {
        const newinput = inputs[inputs.length - 1].cloneNode(true)
        if (inputs[inputs.length - 1].value == "") return false

        newinput.value = ""
        thefields.appendChild(newinput)
        inputs = thefields.querySelectorAll("input")
    })
}
for (let option of options) {
    option.addEventListener('click', () => {
        select.setAttribute('id', '')
    })
}

