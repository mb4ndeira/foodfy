module.exports = {
    convertToArray(strings_object) {
        let Array = []
        Array = strings_object.replace(`{"`, "")
        Array = Array.replace(`"}`, "")
        Array = Array.split(`","`)
        return (Array)
    },
    date(timestamp) {

        const date = new Date(timestamp)

        const year = date.getUTCFullYear()
        const month = `0${date.getUTCMonth() + 1}`.slice(-2) //0 to 11
        const day = `0${date.getUTCDate()}`.slice(-2)

        return {
            day,
            month,
            year,
            iso: `${year}-${month}-${day}`,
            birthDay: `${day}/${month}`,
            format: `${day}/${month}/${year}`
        }
    },
    checkCompletion(data) {
        const form = Object.keys(data)
        for (field of form) {
            const content = data[field]
            if (Array.isArray(content)) {
                if (content[content.length - 1] == "") { content.splice(content.length - 1) }
                for (let thing of content) {
                    index = content.indexOf(thing)
                    if (thing == "") { content.splice(index, 1) }
                }
                if (content == "") return false
            } else {
                if (content == "" && field != "information" && field != "removed_files" && field != "removed_file" && field != "admin") return false
            }
        }
        return (data)
    },
    fixComma(input) {
        const value = input.split(",")
        const lastIndex = value.length - 1
        value.splice(lastIndex, 1)

        return value
    },
    async getImages_show(images_id, protocol, host, model) {
        let images = []
        let results = ""

        if (Array.isArray(images_id)) {
            let promises = images_id.map(id => model.find(id))
            results = await Promise.all(promises)

            results.forEach(result => {
                images.push(result[0])
            })

            images.forEach(image => {
                if (image.path.includes('https://')) {
                    image.src = `${image.path}`
                } else {
                    image.src = `${protocol}://${host}/${image.path}`
                }
            })
        } else {
            images = await model.find(images_id)

            images.forEach(image => {
                if (image.path.includes('https://')) {
                    image.src = `${image.path}`
                } else {
                    image.src = `${protocol}://${host}/${image.path}`
                }
            })
        }

        return (images)
    },
    async getImages_recipes(list, protocol, host, model) {
        let promises = list.map(item => model.allRecipe_files(item.id))
        let results = await Promise.all(promises)

        let images = ""
        images = results.map(result => result.rows)
        images = images.map(image => (image[0]))

        // images = images.map(image => ({
        //     ...image,
        //     src: `${protocol}://${host}/${image.path}`
        // }))

        images.forEach(image => {
            if (image.path.includes('https://')) {
                image.src = `${image.path}`
            } else {
                image.src = `${protocol}://${host}/${image.path}`
            }
        })

        return (images)
    }
}