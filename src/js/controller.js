import * as model from './model.js';
import { MODAL_CLOSE_SEC } from './config.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarkView from './views/bookmarkView.js';
import addRecipeView from './views/addRecipeView.js';
import 'core-js/stable';
import 'regenerator-runtime';

// if (model.hot) {
//   model.hot.accept();
// }


// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

const controlRecipe = async function () {
  try {
    const hash = window.location.hash;
    const id = hash.slice(1);

    if (!id) return;
    // Loading spinner
    recipeView.renderSpinner();

    //update the results views
    resultsView.update(model.getSearchResultPage(model.state.search.currentPage));

    // Loading recipe
    await model.loadRecipe(id);

    //2. Render recipe
    recipeView.render(model.state.recipe);


    //TEST SERVING

  } catch (err) {
    recipeView.renderError();
  }
};


// Load recipe view when ever window loaded or change with recipe id

const controlResults = async function () {
  try {

    const query = searchView.getQuery();
    if (query === "") {
      return;
    }
    resultsView.renderSpinner();
    await model.loadSearchResults(query);

    //Render 1st page
    model.state.search.currentPage = 1;
    controlPagination();


  } catch (error) {
    console.log(error);
  }
};

const controlPagination = function () {
  const currentPage = model.state.search.currentPage;
  resultsView.render(model.getSearchResultPage(currentPage));
  paginationView.render(model.state.search);
}

const controlServings = function (newServings) {
  // Update the recipe servings (in the state)
  model.updateServing(newServings);

  //Update the recipe view
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
}

const controlBookmark = function () {
  if (!model.state.recipe.bookmarked) {
    model.addBookmark(model.state.recipe);
  } else {
    model.removeBookmark(model.state.recipe.id);
  }
  recipeView.update(model.state.recipe);
  bookmarkView.render(model.state.bookmarks);

}
const controlBookmarkRender = function () {
  model.loadBookmarks();
  bookmarkView.render(model.state.bookmarks);
}

const controlAddRecipe = async function (newRecipe) {
  try {

    addRecipeView.renderSpinner();

    await model.uploadRecipe(newRecipe);

    //Render recipe
    recipeView.render(model.state.recipe);

    addRecipeView.renderMessage();

    bookmarkView.render(model.state.bookmarks);

    //Change ID in URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    //close from window form 
    setTimeout(function () {
      addRecipeView._toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);


  } catch (error) {
    addRecipeView.renderError(error.message);
  }
}

const init = () => {
  recipeView.addHandlerRender(controlRecipe);
  searchView.addHandlerSearch(controlResults);
  paginationView.addHandleClick(controlPagination);
  recipeView.addHandlerUpdateServing(controlServings);

  //CONTROL BOOK MARK
  recipeView.addHandlerAddBookmark(controlBookmark);
  bookmarkView.addHandlerRender(controlBookmarkRender);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};
init();