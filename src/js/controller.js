// "use strict";
// import { async } from 'regenerator-runtime';
// import 'core-js/stable';
// import 'regenerator-runtime/runtime';
import * as model from "./model.js";
import recipeView from "./views/recipeView.js";
import searchView from "./views/searchView.js";
import resultView from "./views/resultView.js";
import paginationView from "./views/paginationView.js";

// https://forkify-api.herokuapp.com/v2
///////////////////////////////////////

if (model.hot) {
  model.hot.accept();
}

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;
    recipeView.renderSpinner();

    //0) update result view to mark selected result
    resultView.update(model.getSearchResultPage());

    // 1) Loading recipe
    await model.loadRecipe(id);

    // 2) Rendering recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    console.log(err);
    recipeView.renderError();
  }
};

const controlSearchResult = async function () {
  try {
    resultView.renderSpinner();
    //1) get search query
    const query = searchView.getQuery();
    if (!query) return;

    //2) load search query
    await model.loadSearchResult(query);

    //3) render result
    resultView.render(model.getSearchResultPage());

    //4) render initial pagination button
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};

const controlPagination = function (goToPage) {
  // 1) Render NEW results
  resultView.render(model.getSearchResultPage(goToPage));

  // 2) Render NEW pagination buttons
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  //update the recipe servings (In state)
  model.updateServings(newServings);

  //update the recipe view
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function() {
  if (!model.state.recipe.bookmarked)
   model.addBookmark(model.state.recipe); 

  else model.deleteBookmark(model.state.recipe.id);
  
  recipeView.update(model.state.recipe);
};

const init = function () {
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResult); //calling controlSearchResult by clicking search button
  paginationView.addHandlerClick(controlPagination);
};
init();
