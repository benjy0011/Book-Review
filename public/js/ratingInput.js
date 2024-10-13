// Select all star icons
// .rating-input -> class , i -> icon
// just as css
const stars = document.querySelectorAll('.rating-input i');

// Add click event to each star
stars.forEach(star => {
    star.addEventListener('click', function() {
        const value = this.getAttribute('data-value'); // Get the value of the clicked star

        // Set the hidden input's value to the selected rating (id: 'ratingvalue')
        document.getElementById('ratingValue').value = value;

        // Clear the 'selected' class from all stars
        stars.forEach(s => s.classList.remove('selected'));

        // Add 'selected' class to all stars 
        this.classList.add('selected');
        let prevStar = this.previousElementSibling;
        while (prevStar) {
            prevStar.classList.add('selected');
            prevStar = prevStar.previousElementSibling;
        }
    });
});