import View from './View.js';
import icons from 'url:../../img/icons.svg';

class PaginationView extends View {
    _parentElement = document.querySelector('.pagination');


    addHandleClick(handle) {
        this._parentElement.addEventListener('click', function (e) {
            const btn = e.target.closest('.btn--inline');
            if (!btn) {
                return;
            }
            this._data.currentPage = Number.parseInt(btn.getAttribute("goto_page"));
            handle();
        }.bind(this));
    }

    _generateMarkup() {
        // Page 1 and there are no pages
        if (this._data.results.length <= this._data.resultsPerPage) {
            return '';
        }
        //Page 1 and there is at least one page more
        if (this._data.currentPage === 1 && this._data.results.length > this._data.resultsPerPage) {
            return `<button goto_page="2" class="btn--inline pagination__btn--next">
            <span>Page ${2}</span>
            <svg class="search__icon">
                <use href="${icons}#icon-arrow-right"></use>
            </svg>
           </button> `;
        }
        //Last page 
        const lastPage = Math.ceil(this._data.results.length / this._data.resultsPerPage);
        if (this._data.currentPage == lastPage) {
            return `
            <button goto_page="${lastPage - 1}" class="btn--inline pagination__btn--prev" >
                <svg class="search__icon">
                 <use href="${icons}#icon-arrow-left"></use>
                </svg>
            <span>Page ${lastPage - 1}</span>
            </button >`;
        }

        // other page 

        else return `
            <button goto_page="${this._data.currentPage - 1}" class="btn--inline pagination__btn--prev">
                <svg class="search__icon">
                <use href="${icons}#icon-arrow-left"></use>
                </svg>
            <span>Page ${this._data.currentPage - 1}</span>
            </button>
            <button goto_page="${this._data.currentPage + 1}" class="btn--inline pagination__btn--next">
                <span>Page ${this._data.currentPage + 1}</span>
                <svg class="search__icon">
                <use href="${icons}#icon-arrow-right"></use>
                </svg>
            </button> `
    }

}

export default new PaginationView();