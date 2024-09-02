
document.addEventListener('DOMContentLoaded', function() {
    const allButtons = document.querySelectorAll('.searchBtn');
    const searchBar = document.querySelector('.searchBar');
    const searchInput = document.getElementById('searchInput');
    const searchClose = document.getElementById('searchClose');

    // Show the search bar and focus on the input
    allButtons.forEach(button => {
        button.addEventListener('click', function() {
            searchBar.style.visibility = 'visible';
            searchBar.classList.add('open');
            this.setAttribute('aria-expanded', "true");
            searchInput.focus();
        });
    });

    // Hide the search bar
    searchClose.addEventListener('click', function() {
        searchBar.style.visibility = 'hidden';
        searchBar.classList.remove('open');
        allButtons.forEach(button => {
            button.setAttribute('aria-expanded', "false");
        });
        searchInput.blur(); // Optional: remove focus from the search input
    });
});
