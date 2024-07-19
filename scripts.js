import { books, authors, genres, BOOKS_PER_PAGE } from './utils/data.js';
import { elementsObject } from './utils/tools.js';
import { svgs } from './utils/assets.js';

let page = 1;
let matches = books



function displayBooks(matches, page, BOOKS_PER_PAGE, newItems, authors) { // Created a function called displayBooks to append book elements to documentFragmnet 
    const fragment = document.createDocumentFragment()

    const start = (page - 1) * BOOKS_PER_PAGE;
    const end = page * BOOKS_PER_PAGE;
    const booksToDisplay = matches.slice(start, end);

    for (const { author, id, image, title } of booksToDisplay) {
        const element = document.createElement('button')
        element.classList = 'preview'
        element.setAttribute('data-preview', id)
    
        element.innerHTML = `
            <img
                class="preview__image"
                src="${image}"
            />
            
            <div class="preview__info">
                <h3 class="preview__title">${title}</h3>
                <div class="preview__author">${authors[author]}</div>
            </div>
        `;
        fragment.appendChild(element);
    }
    newItems.appendChild(fragment);

}

function genreAuthorOptions (firstGenreElementText, items) { // Created the genreAuthorOptions function to generate options for both genres and authors. 
    const fragment = document.createDocumentFragment()
    const firstGenreElement = document.createElement('option')
    firstGenreElement.value = 'any'
    firstGenreElement.innerText = firstGenreElementText;
    fragment.appendChild(firstGenreElement)

for (const [id, name] of Object.entries(items)) {
    const element = document.createElement('option')
    element.value = id
    element.innerText = name 
    fragment.appendChild(element) 
}
return fragment;
}

elementsObject.searchAuthors.appendChild(genreAuthorOptions('All Authors', authors));
elementsObject.searchEngines.appendChild(genreAuthorOptions('All Genres', genres));

function toggleTheme(theme) { // Created toggleTheme function which can be called to switch between night and day themes.
if (theme === 'night')  {
    elementsObject.settingsTheme.value = 'night'
    document.documentElement.style.setProperty('--color-dark', '255, 255, 255');
    document.documentElement.style.setProperty('--color-light', '10, 10, 20');
} else {
    elementsObject.settingsTheme.value = 'day'
    document.documentElement.style.setProperty('--color-dark', '10, 10, 20');
    document.documentElement.style.setProperty('--color-light', '255, 255, 255');
}

}

elementsObject.listButton.innerText = `Show more (${books.length - BOOKS_PER_PAGE})`
elementsObject.listButton.disabled = (matches.length - (page * BOOKS_PER_PAGE)) > 0

elementsObject.listButton.innerHTML = `
    <span>Show more</span>
    <span class="list__remaining"> (${(matches.length - (page * BOOKS_PER_PAGE)) > 0 ? (matches.length - (page * BOOKS_PER_PAGE)) : 0})</span>
`
function myEventListeners () { // Created function containing my eventlistners
elementsObject.searchCancel.addEventListener('click', () => {
    elementsObject.searchOverlay.open = false
});
elementsObject.settingsCancel.addEventListener('click', () => {
    elementsObject.settingsOverlay.open = false
});
elementsObject.headerSearch.addEventListener('click', () => {
    elementsObject.searchOverlay.open = true 
    elementsObject.searchTitle.focus()
});
elementsObject.headerSettings.addEventListener('click', () => {
   elementsObject.settingsOverlay.open = true 
});
elementsObject.listClose.addEventListener('click', () => {
    elementsObject.listActive.open = false
});
elementsObject.settingsForm.addEventListener('submit', (event) => {
    event.preventDefault()
    const formData = new FormData(event.target)
    const { theme } = Object.fromEntries(formData)

    toggleTheme(theme); // Called the toggleTheme in the form submissoion handler
    elementsObject.settingsOverlay.open = false
});
elementsObject.searchForm.addEventListener('submit', (event) => {
    event.preventDefault()
    const formData = new FormData(event.target)
    const filters = Object.fromEntries(formData)
    const result = []

    for (const book of books) {
        let genreMatch = filters.genre === 'any'

        for (const singleGenre of book.genres) {
            if (genreMatch) break;
            if (singleGenre === filters.genre) { genreMatch = true }
        }

        if (
            (filters.title.trim() === '' || book.title.toLowerCase().includes(filters.title.toLowerCase())) && 
            (filters.author === 'any' || book.author === filters.author) && 
            genreMatch
        ) {
            result.push(book)
        }
    }

    page = 1;
    matches = result

    if (result.length < 1) {
        elementsObject.listMessage.classList.add('list__message_show')
    } else {
       elementsObject.listMessage.classList.remove('list__message_show')
    }

    elementsObject.listItems.innerHTML = ''
    displayBooks(matches, page, BOOKS_PER_PAGE, elementsObject.listItems, authors); // Display books is called inside the search form event listener to display filtered results 


    elementsObject.listButton.disabled = (matches.length - (page * BOOKS_PER_PAGE)) <= 0;

    elementsObject.listButton.innerHTML = `
        <span>Show more</span>
        <span class="list__remaining"> (${(matches.length - (page * BOOKS_PER_PAGE)) > 0 ? (matches.length - (page * BOOKS_PER_PAGE)) : 0})</span>
    `

    window.scrollTo({top: 0, behavior: 'smooth'});
    elementsObject.searchOverlay.open = false
});

elementsObject.listButton.addEventListener('click', () => {
    page +=1;
    displayBooks(matches, page, BOOKS_PER_PAGE, elementsObject.listItems, authors); // DisplayBooks is called to display more books as the user clicks show more. 
   
});

elementsObject.listItems.addEventListener('click', (event) => {
    const pathArray = Array.from(event.path || event.composedPath())
    let active = null

    for (const node of pathArray) {
        if (active) break

        if (node?.dataset?.preview) {
            let result = null
    
            for (const singleBook of books) {
                if (result) break;
                if (singleBook.id === node?.dataset?.preview) result = singleBook
            } 
        
            active = result
        }
    }
    
    if (active) {
        elementsObject.listActive.open = true
        elementsObject.listBlur.src = active.image
        elementsObject.listImage.src = active.image
        elementsObject.listTitle.innerText = active.title
        elementsObject.listSubtitle.innerText = `${authors[active.author]} (${new Date(active.published).getFullYear()})`
        elementsObject.listDescription.innerText = active.description 
    }
});

}
displayBooks(matches, page, BOOKS_PER_PAGE, elementsObject.listItems, authors);

document.addEventListener("DOMContentLoaded", () => {
    myEventListeners(); // calls my event listeners function 
    fetch("./links.html")  // fetch request to get the links.html file 
    .then((response) => response.text())  // extracts the text content 
    .then((data) => {  
         document.getElementById("linkstags").innerHTML = data; // inserts the fetched content into the element with ID links tags. 
    });
});
// fetched my elements from the Dom
document.getElementById('headerLogo').innerHTML = svgs.headerShape + svgs.headerText; 
document.getElementById('headerSearch').innerHTML = svgs.headerIconSearch;
document.getElementById('headerSettings').innerHTML = svgs.headerIconSettings;