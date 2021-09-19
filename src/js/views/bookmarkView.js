import View from './View.js';
import icons from '../../img/icons.svg';

class BookmarkView extends View {
    _parentElement = document.querySelector('.bookmarks__list');
    _errorMessage = 'No bookmarks yet. Find a nice recipe and bookmark it :)';


    addHandlerRender(handler) {
        window.addEventListener('load', handler);
    }
    _generateMarkup() {
        return `
                ${this._data.map(recipe => {
            return `
                <li class="preview">
                    <a class="preview__link" href="#${recipe.id}">
                        <figure class="preview__fig">
                            <img src="${recipe.image}" alt=""/>
                        </figure>
                        <div class="preview__data">
                            <h4 class="preview__title">
                                ${recipe.title}
                            </h4>
                            <p class="preview__publisher">${recipe.publisher}</p>
                        </div>
                    </a>
                </li> `
        }).join('')}
            `

    }

}

export default new BookmarkView();