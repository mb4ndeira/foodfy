const faker = require("faker")
const { hash, compare } = require("bcryptjs")
const User = require("./src/models/User")
const Chef = require("./src/models/Chef")
const Recipe = require("./src/models/Recipe")
const File = require("./src/models/file")
const RecipeFile = require("./src/models/recipe_file")
const { date } = require("./src/lib/useful")

let usersIds = [],
  chefsIds = [],
  recipesIds = [],
  recipesImages = [],
  totalUsers = 5,
  totalChefs = 8,
  totalRecipes = 12

async function createUsers() {
  const users = []
  const password = await hash("1", 8)

  while (users.length < totalUsers) {
    users.push({
      name: faker.name.findName(),
      email: faker.internet.email().toLowerCase(),
      password,
      is_admin: true,
    })
  }

  const usersPromise = users.map((user) => User.create(user))

  usersIds = await Promise.all(usersPromise)
}

async function createChefs() {
  let files = []
  let n = 0

  while (files.length < totalChefs) {
    files.push({
      name: faker.name.findName(),
      path: `https://source.unsplash.com/collection/2013520/${Math.round(
        Math.random() * 1000
      )}`,
    })
  }
  const filesPromise = files.map((file) => File.create(file))
  filesId = await Promise.all(filesPromise)

  let chefs = []

  while (chefs.length < totalChefs) {
    chefs.push({
      name: faker.name.findName(),
      created_at: date(Date.now()).iso,
      file_id: filesId[n],
    })
    n += 1
  }

  const chefsPromise = chefs.map((chef) => Chef.create(chef))
  chefsIds = await Promise.all(chefsPromise)
}

async function createRecipes() {
  let recipes = []

  while (recipes.length < totalRecipes) {
    recipes.push({
      chef_id: chefsIds[Math.floor(Math.random() * totalChefs)],
      user_id: usersIds[Math.floor(Math.random() * totalUsers)],
      title: faker.commerce.productName(),
      ingredients: [faker.lorem.lines(5)],
      preparation: [faker.lorem.lines(5)],
      information: faker.lorem.paragraph(),
    })
  }

  // console.log(recipes)

  const recipesPromise = recipes.map(recipe => Recipe.create(recipe))
  recipesIds = await Promise.all(recipesPromise)

  let files = []

  while (files.length < totalRecipes) {
    files.push({
      name: faker.commerce.product(),
      path: `https://source.unsplash.com/collection/251966/${Math.round(
        Math.random() * 1000
      )}`,
    })
  }

  const filesPromise = files.map((file) => File.create(file))
  recipesImages = await Promise.all(filesPromise)
}

async function createRecipeFile() {
  let recipeFiles = []
  let n = 0

  while (recipeFiles.length < totalRecipes) {
    recipeFiles.push({
      recipe_id: recipesIds[n],
      file_id: recipesImages[n],
    })

    n += 1
  }

  const recipeFilesPromise = recipeFiles.map((recipeFile) =>
    RecipeFile.create(recipeFile)
  )

  await Promise.all(recipeFilesPromise)
}

async function init() {
  await createUsers(),
    await createChefs(),
    await createRecipes(),
    await createRecipeFile()
}

init()