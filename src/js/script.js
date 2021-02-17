import data from "./data.js";
import { searchMovieByTitle, makeBgActive } from "./helpers.js";

class MoviesApp {
    constructor(options) {
        const { searchInput, searchForm, yearHandler, yearSubmitter, genreSubmitter, searchButton } = options;
        this.$cardsEl = document.querySelector(".main");
        this.$yearEl = document.querySelector(".year__container");
        this.$genreEl = document.querySelector(".genre__container");

        this.$searchInput = document.getElementById(searchInput);
        this.$searchForm = document.getElementById(searchForm);
        this.yearHandler = yearHandler;
        this.$yearSubmitter = document.getElementById(yearSubmitter);
        this.$genreSubmitter = document.getElementById(genreSubmitter);
        this.$searchButton = document.getElementById(searchButton);
    }

    createMovieCardEl(movie) {
        const { image, title, genre, year, id } = movie;
        return `
        <div class="scene scene--card" >
          <div class="card__wrapper" data-id="${id}">
            <div class="card__face card__face--front"><img src="${image}" class="card-img-top" onerror="this.src = 'https://static.techgig.com/files/skilllogo/Placeholder.svg';"></div>
            <div class="card__face card__face--back">
                <h5 class="card-title">${title}</h5>
                <p class="card-label mt-4">${genre}</p>
                <p class="card-label mt-4"><small>${year}</small></p>
            </div>
          </div>
        </div>
        
        `
    }

    createFilterYearEl(movie, length) {
        //const { image, title, genre, year, id } = movie;
        return `
        <div class="form-check position-relative d-flex align-items-center ">
            <input class="form-check-input me-3 mb-1" type="radio" name="year" id="year${movie}" value="${movie}">
            <label class="form-check-label" for="year${movie}">
                ${movie}
            </label>
            <label class="form-check-label position-absolute end-0 tag-count" for="genre${movie}">
                ${length}
            </label>
        </div>
        `
    }

    createFilterGenreEl(movie, length) {
        //const { genre, length } = movie;
        return `
        <div class="form-check position-relative d-flex align-items-center ">
            <input class="form-check-input me-3 mb-1" type="checkbox" value="${movie}" id="genre${movie}" />
            <label class="form-check-label" for="genre${movie}">
                ${movie}
            </label>
            <label class="form-check-label position-absolute end-0 tag-count" for="genre${movie}">
                ${length}
            </label>
        </div>
        `
    }

    groupBy(key) {
        return function group(array) {
            return array.reduce((acc, obj) => {
                const proporty = obj[key];
                acc[proporty] = acc[proporty] || [];
                acc[proporty].push(obj);
                return acc;
            }, {});
        }
    }

    fillYear() {
        const groupByGenre = this.groupBy("year");
        const _tmpObj = groupByGenre(data)
        const moviesArr = Object.keys(_tmpObj).sort((a, b) => {
            return b.year - a.year;
        }).map((movie) => {
            return this.createFilterYearEl(movie, _tmpObj[movie].length)
        }).join("");
        this.$yearEl.innerHTML = moviesArr;
    }

    fillGenre() {
        const _tmpData = [];
        const groupByGenre = this.groupBy("genre");

        const _tmpObj = groupByGenre(data)
        const moviesArr = Object.keys(_tmpObj).sort((a, b) => {
            return ('' + a).localeCompare(b);
        }).map((movie) => {
            return this.createFilterGenreEl(movie, _tmpObj[movie].length)
        }).join("");

        this.$genreEl.innerHTML = moviesArr;
    }

    fillCards() {
        const moviesArr = data.map((movie) => {
            return this.createMovieCardEl(movie)
        }).join("");
        this.$cardsEl.innerHTML = moviesArr;
    }

    reset() {
        const $cardWrapperEl = document.querySelectorAll('.card__wrapper');
        $cardWrapperEl.forEach((e) => {
            e.classList.remove('activeCards');
        })
    }

    handleSearchButtonActive() {
        this.$searchInput.addEventListener('keyup', (event) => {
            console.log("event=>", event)
            if (this.$searchInput.value === "") {
                this.$searchButton.disabled = true;
            } else {
                this.$searchButton.disabled = false;
            }
        })
    }

    handleSearch() {
        this.$searchForm.addEventListener("submit", (event) => {
            event.preventDefault();
            this.reset();

            const searchValue = this.$searchInput.value;
            const matchedMovies = data.filter((movie) => {
                return searchMovieByTitle(movie, searchValue);
            }).forEach(makeBgActive)

            this.$searchInput.value = '';
            this.$searchInput.focus();
            this.$searchButton.disabled = true;
        });
    }

    handleYearFilter() {
        this.$yearSubmitter.addEventListener("click", () => {
            this.reset();
            const selectedYear = document.querySelector(`input[name='${this.yearHandler}']:checked`)?.value
            const matchedMovies = data.filter((movie) => {
                return movie.year === selectedYear;
            }).forEach(makeBgActive)
        });
    }

    handleGenreFilter() {
        this.$genreSubmitter.addEventListener("click", () => {
            this.reset();
            const selectedGenres = document.querySelectorAll(`input[type='checkbox']:checked`)
            selectedGenres.forEach((item) => {
                const matchedMovies = data.filter((movie) => {
                    return movie.genre === item.value;
                }).forEach(makeBgActive)
            })

        });
    }

    init() {
        this.fillCards();
        this.fillYear();
        this.fillGenre();
        this.handleSearch();
        this.handleYearFilter();
        this.handleGenreFilter();
        this.handleSearchButtonActive();
    }
}

let myMoviesApp = new MoviesApp({
    searchInput: "searchInput",
    searchForm: "searchForm",
    searchButton: 'searchButton',
    yearHandler: "year",
    yearSubmitter: "yearSubmitter",
    genreSubmitter: 'genreSubmitter',

});

myMoviesApp.init();