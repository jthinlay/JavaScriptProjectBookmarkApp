const modalShow = document.getElementById('show-modal');
const modalContainer = document.getElementById('modal');
const modalClose = document.getElementById('close-modal');
const bookmarkForm = document.getElementById('bookmark-form');
const websiteNameEl = document.getElementById('website-name');
const websiteUrlEl = document.getElementById('website-url');
const bookmarksContainer = document.getElementById('bookmarks-container');

// Show Modal, Focus on Input
function showmodal(){
    modalContainer.classList.add('show-modal');
    websiteNameEl.focus();
} 
// Modal Event Listeners
modalShow.addEventListener('click', showmodal);
modalClose.addEventListener('click', () => { modalContainer.classList.remove('show-modal') });
window.addEventListener('click', (e) => {e.target === modalContainer ? modalContainer.classList.remove('show-modal') : false });

let bookmarks = {};

// Validate Form 
function validate(nameValue, urlValue){
    const expression = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g;
    const regex = new RegExp(expression);
    if(!nameValue || !urlValue){
        alert("Please submit values for both fields.");
        return false;
    }
    if(!urlValue.match(regex)){
        alert("Please provide website address");
        return false;
    }
    // valid
    return true;
}

// Build Bookmarks DOM
function buildBookmarks(){
    
    // Remove all bookmark elements
    bookmarksContainer.textContent = '';

    // Build items
    bookmarks.forEach((bookmark) => {
        const {name, url } = bookmark;
            //  Item
            const item = document.createElement('div');
                item.classList.add('item');

            // CloseIcon
            const closeIcon = document.createElement('i');
                closeIcon.classList.add('fas', 'fa-trash-alt');
                closeIcon.setAttribute('title', 'Delete Bookmark');
                closeIcon.setAttribute('onClick', `deleteBookmark('${url}')`);
            
            // Favicon / Link Container
            const linkInfo = document.createElement('div');
                linkInfo.classList.add('name');

            // Favicon
            const favicon = document.createElement('img');
                favicon.setAttribute('src', `https://s2.googleusercontent.com/s2/favicons?domain=${url}`);
                favicon.setAttribute('alt', 'Favicon');

            // Link
            const link = document.createElement('a');
                link.setAttribute('href', `${url}`);
                link.setAttribute('target', '_blank');
                link.textContent = name;

            // Append to bookmarks container
                linkInfo.append(favicon, link);
                item.append(closeIcon, linkInfo);
                bookmarksContainer.appendChild(item);
    });
}
// Fetch Bookmarks
function fetchBookmarks(){
    // Get bookmarks from localStorage if available
    if(localStorage.getItem('bookmarks')){
        bookmarks = JSON.parse(localStorage.getItem('bookmarks'));
    } else {
        // Create bookmarks array in localStorage
        bookmarks = {
            
                name: 'jtwebarchitect',
                url: 'https://www.jtwebarchitect.com',
    };
        localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    }
   buildBookmarks();
}

// Delete Bookmarks
function deleteBookmark(url){
    bookmarks.forEach((bookmark, i) => {
        if(bookmark.url === url){
            bookmarks.splice(i, 1);
        }
    });
    // Update bookmarks array in localStorage, re-populate DOM
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    fetchBookmarks();

    // Remove bookmarks if there is no values
    let localStorageItem = JSON.parse(localStorage.getItem('bookmarks')).length;
    if(localStorageItem === 0){
       localStorage.removeItem('bookmarks');
   }
}
// Handle Data from Form
function storeBookmark(e){
    e.preventDefault();
    const nameValue = websiteNameEl.value;
    let urlValue = websiteUrlEl.value;
    
    if(!urlValue.includes('http://', 'https://')){
        urlValue = `https://${urlValue}`;
    }
    if(!validate(nameValue, urlValue)){
        return false;
    }
    const bookmark = {
        name: nameValue,
        url: urlValue,
    };
    bookmarks.push(bookmark);
    
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks)); 
    fetchBookmarks();
    bookmarkForm.reset();
    websiteNameEl.focus();
};
    
// Event Listener
bookmarkForm.addEventListener('submit', storeBookmark);

// On Load, Fetch Bookmarks
fetchBookmarks();







