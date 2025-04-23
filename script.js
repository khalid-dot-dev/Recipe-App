const searchBox = document.querySelector(".searchBox");
const searchBtn = document.querySelector(".searchBtn");
const recipeDetailsContent = document.querySelector(".recipe-details-content");
const recipeContainer = document.querySelector(".recipe-container");
const recipeCloseBtn = document.querySelector(".recipe-close-btn");
const loader = document.querySelector(".loader");

const fetchRecipes = async (query) => {
  try {
    loader.style.display = "block";
    recipeContainer.innerHTML = "";

    const data = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`);
    const response = await data.json();

    loader.style.display = "none";

    if (!response.meals) {
      recipeContainer.innerHTML = "<h2>No recipes found.</h2>";
      return;
    }

    response.meals.forEach(meal => {
      const recipeDiv = document.createElement("div");
      recipeDiv.classList.add("recipe");

      recipeDiv.innerHTML = `
        <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
        <h3>${meal.strMeal}</h3>
        <p><span>${meal.strArea}</span> Dish</p>
        <p>Belongs to <span>${meal.strCategory}</span> Category</p>
      `;

      const button = document.createElement("button");
      button.textContent = "View Recipe";
      button.addEventListener("click", () => openRecipePopup(meal));
      recipeDiv.appendChild(button);

      recipeContainer.appendChild(recipeDiv);
    });
  } catch (error) {
    loader.style.display = "none";
    recipeContainer.innerHTML = "<h2>Error fetching recipes...</h2>";
    console.error("Fetch error:", error);
  }
};

const fetchIngredients = (meal) => {
  let ingredientsList = "";
  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}`];
    const measure = meal[`strMeasure${i}`];
    if (ingredient && ingredient.trim()) {
      ingredientsList += `<li>${measure} ${ingredient}</li>`;
    } else {
      break;
    }
  }
  return ingredientsList;
};

const openRecipePopup = (meal) => {
  const shortInstructions = meal.strInstructions.length > 500
    ? meal.strInstructions.slice(0, 500) + "..."
    : meal.strInstructions;

  recipeDetailsContent.innerHTML = `
    <h2 class="recipeName">${meal.strMeal}</h2>
    <h3>Ingredients:</h3>
    <ul class="ingredientList">${fetchIngredients(meal)}</ul>
    <div class="recipeInstructions">
      <h3>Instructions</h3>
      <p>${shortInstructions}</p>
    </div>
  `;
  recipeDetailsContent.parentElement.style.display = "block";
};

recipeCloseBtn.addEventListener("click", () => {
  recipeDetailsContent.parentElement.style.display = "none";
});

searchBtn.addEventListener("click", (e) => {
  e.preventDefault();
  const searchInput = searchBox.value.trim();
  if (!searchInput) {
    recipeContainer.innerHTML = "<h2>Please type a meal to search.</h2>";
    return;
  }
  fetchRecipes(searchInput);
});

// Close with ESC key
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    recipeDetailsContent.parentElement.style.display = "none";
  }
});

// Autofocus input on load
window.addEventListener("load", () => {
  searchBox.focus();
});