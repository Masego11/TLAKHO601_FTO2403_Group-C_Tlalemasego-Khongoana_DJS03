
export const elementsObject = { // Object containing queryselectors
    listItems: document.querySelector('[data-list-items]'),
    searchEngines: document.querySelector('[data-search-genres]'),
    searchAuthors: document.querySelector('[data-search-authors]'),
    settingsTheme: document.querySelector('[data-settings-theme]'),
    listButton: document.querySelector('[data-list-button]'),
    searchCancel: document.querySelector('[data-search-cancel]'),
    searchOverlay: document.querySelector('[data-search-overlay]'),
    settingsCancel: document.querySelector('[data-settings-cancel]'),
    settingsOverlay: document.querySelector('[data-settings-overlay]'),
    headerSearch: document.querySelector('[data-header-search]'),
    searchTitle: document.querySelector('[data-search-title]'),
    headerSettings: document.querySelector('[data-header-settings]'),
    listClose: document.querySelector('[data-list-close]'),
    listActive: document.querySelector('[data-list-active]'),
    settingsForm: document.querySelector('[data-settings-form]'),
    searchForm: document.querySelector('[data-search-form]'),
    listMessage: document.querySelector('[data-list-message]'),
    listImage: document.querySelector('[data-list-image]'),
    listBlur: document.querySelector('[data-list-blur]'),
    listTitle: document.querySelector('[data-list-title]'),
    listSubtitle: document.querySelector('[data-list-subtitle]'),
    listDescription: document.querySelector('[data-list-description]'),
}

class BookPreview extends HTMLElement {
  static get attributes() { // defines an array of attribute names 
    return ["author", "id", "image", "title"];
  }
    constructor() {
      super();
      this.attachShadow({ mode: "open" });
    }

    connectedCallback() {  // Method used to render element's content
      this.render();
    }

      render() {   // Attribute values are retrieved and assigned to a variable 
        const author= this.getAttribute("author");
        const id= this.getAttribute("id");
        const image= this.getAttribute("image");
        const title= this.getAttribute("title");
      
          // css styling and structure of my html elements
      this.shadowRoot.innerHTML = `<style>
                .preview {
                    display: flex;
                    align-items: center;
                    cursor: pointer;
                    border: 1px solid;
                    padding: 10px;
                    border-radius: 10px; 
                    width: 250px;
                    height: 180px;
                    text-aign: center; 
                  
                }

                .preview__image {
                  width: 50px;
                  height: 60px;
                  object-fit: cover;
                  margin-right: 10px;
        
                .preview__info {
                    display: flex; 
                    flex-direction: column;
                }
                .preview__title 
                    font-size: 1rem
                    font-weight: bold;
                    margin:0;
                   
                }
                .preview__author {
                    font-size 0.75rem;
                }
            </style>
     <button class="preview" data-preview>  
     <img class="preview__image" src="${image}">
     <div class="preview__info">
     <h3 class="preview__title">${title}</h3>
     <div class="preview__author">${author}<p>
     </div>
     </button>
       `;
    }
  }
  customElements.define("book-preview", BookPreview);  
  export {BookPreview}; 
