// API Site = http://www.omdbapi.com/?apikey=16f80093&
const myApp = document.getElementById("app");
const searchBtn = document.getElementById("btn");
const lightBtn = document.getElementById("light-toggle");

// const body = document.querySelector("body");

const searchResults = document.querySelector(".search-results");
const subtitleFront = document.querySelector(".subtitle-front");
const subtitleBack = document.querySelector(".subtitle-back");
const main = document.querySelector(".main");
const mainBack = document.querySelector(".main-back");
const myWatchlist = document.querySelector(".my-watchlist");
const searchInput = document.querySelector(".movie-search");

subtitleFront.addEventListener("click", flipThePage);
subtitleBack.addEventListener("click", flipThePage);

lightBtn.addEventListener("change", switchMode);

function flipThePage() {
  myApp.classList.toggle("clicked");

//   setTimeout(() => {
//     body.style.overflow = "hidden";
//   }, 200);

  if (myApp.classList.contains("clicked")) {
    mainBack.classList.remove("hide");

    setTimeout(() => {
      main.classList.add("hide");
    }, 1000); 

  } else {
    main.classList.remove("hide");

    setTimeout(() => {
      mainBack.classList.add("hide");
    }, 1000);

  }

//   setTimeout(() => {
//     body.style.overflow = "unset";
//   }, 1000);
}

function switchMode() {
  const descs = document.querySelectorAll(".desc");

  main.classList.toggle("light");
  mainBack.classList.toggle("light");

  descs.forEach((desc) => {
    desc.classList.toggle("light");
  });
}

let moviesArray = [];
let watchList = [];

render(watchList, myWatchlist);
render(moviesArray, searchResults);

async function fetchMovies(name) {
  const res = await fetch(`http://www.omdbapi.com/?apikey=16f80093&s=${name}`);
  const data = await res.json();

  console.log(data);

  if (data.Response === "True") {
    if (data.Search) {
      const ids = data.Search.map((item) => item.imdbID);

      const promises = ids.map(async (id) => {
        const res = await fetch(
          `http://www.omdbapi.com/?apikey=16f80093&i=${id}`
        );
        return await res.json();
      });

      moviesArray = await Promise.all(promises);
    }

    render(moviesArray, searchResults);
  } else {
    console.log(data.Error);
    searchResults.innerHTML = `<p class="error">${data.Error}</p>`;
  }
}

searchBtn.addEventListener("click", function () {
  if (searchInput.value) {
    fetchMovies(searchInput.value);
  }
});

function createMovie(array) {
  if (array === watchList) {
    return array
      .map((object) => {
        return `
            <div class="movie flex">
                <div class="poster">
                    <img class="poster-img" src="${
                      object.Poster
                    }" alt="Movie Poster" >
                </div>
    
                <div class="details flex">
    
                    <div class="name flex">
                        <h5 class="movie-name">${object.Title}</h5>
                        <i class="fa-solid fa-star star"></i>
                        <p class="rating">${object.imdbRating}</p>
                    </div>
    
                    <div class="more flex">
                        <p class="run-time">${object.Runtime}</p>
                        <p class="chategory">${object.Genre}</p>
                        <button class="add flex" >
                            <i class="fa-solid fa-minus plus" data-btn="${
                              object.imdbID
                            }"></i>
                        </button>
                        <p class="add-to-watchlist">
                            Remove
                        </p>
                    </div>
                    <p 
                        class="${lightBtn.checked ? "desc light" : "desc"}">
                        ${object.Plot}
                    </p>
                </div>
            </div>
        
            <hr>
            `;
      })
      .join("");
  } else {
    return array
      .map((object) => {
        return `
            <div class="movie flex">
                    <div class="poster">
                        <img class="poster-img" src="${
                          object.Poster
                        }" alt="Movie Poster">
                    </div>
        
                    <div class="details flex">
        
                        <div class="name flex">
                            <h5 class="movie-name">${object.Title}</h5>
                            <i class="fa-solid fa-star star"></i>
                            <p class="rating">${object.imdbRating}</p>
                        </div>
        
                        <div class="more flex">
                            <p class="run-time">${object.Runtime}</p>
                            <p class="chategory">${object.Genre}</p>
                            <button class="add flex" >
                                <i class="fa-solid fa-plus plus" data-btn="${
                                  object.imdbID
                                }"></i>
                            </button>
                            <p class="add-to-watchlist">
                                Watchlist
                            </p>
                        </div>
                        <p 
                            class="${lightBtn.checked ? "desc light" : "desc"}">
                            ${object.Plot}
                        </p>
                    </div>
                </div>
        
                <hr>
            `;
      })
      .join("");
  }
}

function render(array, element) {
  if (createMovie(array)) {
    element.innerHTML = createMovie(array);
  } else if (!createMovie(array) && element === searchResults) {
    element.innerHTML = `
        <div class="empty-search flex">
                <img src="img/Icon.png">
                <p>Start exploring</p>
            </div>
        `;
  } else {
    element.innerHTML = `
        <div class="empty-search flex"> 
                <p>Your watchlist is looking a little empty...</p>
                <p>Let's add some movies!</p>
            </div>
        `;
  }
}

document.addEventListener("click", function (e) {
  if (e.target.dataset.btn) {
    // console.log(e.target.dataset.btn)
    addTheMovie(e.target.dataset.btn);
  }
});

function addTheMovie(id) {
  const element = document.querySelector(`[data-btn="${id}"]`);

  const myMovie = moviesArray.filter((item) => {
    return item.imdbID === id;
  })[0];

  if (element.classList.contains("fa-plus")) {
    element.classList.remove("fa-plus");
    element.classList.add("fa-minus");

    if (!watchList.some((item) => item.imdbID === id)) {
      watchList.unshift(myMovie);
      render(watchList, myWatchlist);
    }
  } else if (element.classList.contains("fa-minus")) {
    watchList = watchList.filter((item) => {
      return item.imdbID !== id;
    });

    element.classList.remove("fa-minus");
    element.classList.add("fa-plus");
    render(watchList, myWatchlist);
  }
}
