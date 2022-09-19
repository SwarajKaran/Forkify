import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultView from './views/resultView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { async } from 'regenerator-runtime';
import bookmarksView from './views/bookmarksView.js';
import { MODAL_CLOSE_SEC } from './config.js';
if (module.hot) {
  module.hot.accept();
}
const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;
    recipeView.renderSpinner();
    //0. Update result view to mark selected search result
    resultView.update(model.getSearchResultsPage());
    // 1. Updating bookmarks view
    bookmarksView.update(model.state.bookmarks);
    // 2. Loading Recipe
    await model.loadRecipe(id);
    // 3. Rendering Recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.rendorError();

    console.error(err);
  }
};
const controlSearchResults = async function () {
  try {
    // 1. get search query
    const query = searchView.getQuery();
    if (!query) return;
    resultView.renderSpinner();
    // 2. load search results
    await model.loadSearchResults(query);
    // 3. Render results
    // resultView.render(model.state.search.results);
    resultView.render(model.getSearchResultsPage());
    // Render initial pagination buttons
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};
const controlPagination = function (goToPage) {
  // 1. Render NEW results
  // resultView.render(model.state.search.results);
  resultView.render(model.getSearchResultsPage(goToPage));
  // 2. Render NEW pagination buttons
  paginationView.render(model.state.search);
};
const controlServings = function (newServings) {
  // Update recipe serving (in the state)
  model.updateServings(newServings);
  // Update the Recipe View
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};
const controlAddBookmark = function () {
  // 1) Add/Remove bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);
  // 2) Update the Recipe View
  recipeView.update(model.state.recipe);
  // 3) Render bookmarks
  bookmarksView.render(model.state.bookmarks);
};
const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};
const controlAddRecipe = async function (newRecipe) {
  try {
    //Show loading spinner
    addRecipeView.renderSpinner();
    //Upload new recipe data
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);
    //Render recipe
    recipeView.render(model.state.recipe);
    //Sucess Message
    addRecipeView.rendorMessage();
    // Render bookmark view
    bookmarksView.render(model.state.bookmarks);
    // change id in url
    window.history.pushState(null, '', `#${model.state.recipe.id}`);
    //close form window
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.error('👀👀', err);
    addRecipeView.rendorError(err.message);
  }
};
const newFeature = function () {
  console.log('new feature');
};
const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
  newFeature();
};
init();
