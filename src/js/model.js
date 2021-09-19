
import 'regenerator-runtime';
import { API_URL, RES_PER_PAGE, KEY } from './config.js';
// import * as helper from './helper.js';
import { AJAX } from './helper.js';


export const state = {
    recipe: {},
    search: {
        query: '',
        results: [],
        currentPage: 1,
        resultsPerPage: RES_PER_PAGE,
    },
    bookmarks: [],
}

const createRecipeObject = function (data) {
    const { recipe } = data.data;
    return {
        id: recipe.id,
        title: recipe.title,
        publisher: recipe.publisher,
        sourceUrl: recipe.source_url,
        image: recipe.image_url,
        servings: recipe.servings,
        cookingTime: recipe.cooking_time,
        ingredients: recipe.ingredients,
        ...(recipe.key && { key: recipe.key }),
    }
}
export const loadRecipe = async function (id) {
    try {

        const data = await AJAX(`${API_URL}/${id}`);

        //recreate recipe
        state.recipe = createRecipeObject(data);
        if (state.bookmarks.some(bookmark => bookmark.id === id)) {
            state.recipe.bookmarked = true;
        } else {
            state.recipe.bookmarked = false;
        }

        //CHECK
    } catch (error) {
        //temporary error handling
        console.log('Error');
        throw error;
    }
};

export const loadSearchResults = async function (query) {
    try {
        state.search.query = query;
        const data = await AJAX(`${API_URL}?search=${query}&key=${KEY}`);

        state.search.results = data.data.recipes.map(recipe => {
            return {
                id: recipe.id,
                title: recipe.title,
                publisher: recipe.publisher,
                image: recipe.image_url,
                ...(recipe.key && { key: recipe.key })
            }
        });


    } catch (error) {
        throw error;
    }
}
export const getSearchResultPage = function (page) {
    const start = (page - 1) * state.search.resultsPerPage;
    const end = page * state.search.resultsPerPage;
    state.search.currentPage = page;
    return state.search.results.slice(start, end);
}

export const updateServing = function (newServings) {
    if (newServings <= 0)
        return;
    state.recipe.ingredients.forEach(ing => {
        ing.quantity = ing.quantity * newServings / state.recipe.servings;
    })

    state.recipe.servings = newServings;
};

export const addBookmark = function (recipe) {
    //add bookmarks
    state.bookmarks.push(recipe);
    //Mark current recipe add bookmarks
    if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;
    persitBookmarks();
}
export const removeBookmark = function (id) {
    const index = state.bookmarks.findIndex(el => el.id === id);
    if (id === state.recipe.id) state.recipe.bookmarked = false;
    state.bookmarks.splice(index, 1);
    persitBookmarks();
}

const persitBookmarks = function () {
    localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
}
export const loadBookmarks = function () {
    const storage = localStorage.getItem('bookmarks');
    state.bookmarks = JSON.parse(storage);
}

export const uploadRecipe = async function (data) {
    try {
        const ingredients = Object.entries(data)
            .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
            .map(ing => {
                const ingArr = ing[1].replaceAll(' ', '').split(',');
                if (ingArr.length !== 3) {
                    throw new Error('Wrong ingredient format. Please enter again');
                }
                const [quantity, unit, description] = ingArr;
                return { quantity, unit, description };
            });
        const recipe = {
            title: data.title,
            source_url: data.sourceUrl,
            image_url: data.image,
            publisher: data.publisher,
            cooking_time: +data.cookingTime,
            servings: data.servings,
            ingredients,
        };
        const response = await AJAX(`${API_URL}?key=${KEY}`, recipe);
        state.recipe = createRecipeObject(response);
        addBookmark(state.recipe);
        console.log(state.recipe);
    } catch (err) {
        console.error(err);
        throw err;
    }

    ;
};