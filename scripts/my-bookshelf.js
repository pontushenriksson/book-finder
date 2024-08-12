// Function to fetch the book cover image
function getBookCover(isbn, callback) {
  if (!isbn) {
    callback(null); // No ISBN provided
    return;
  }

  const url = `https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg`;
  const img = new Image();
  img.crossOrigin = 'Anonymous';
  img.src = url;
  img.onload = () => callback(img);
  img.onerror = () => callback(null); // Image failed to load
}

// Function to fetch book data from Open Library API
function getBookData(isbn, callback) {
  if (!isbn) {
    callback(null); // No ISBN provided
    return;
  }

  const url = `https://openlibrary.org/api/books?bibkeys=ISBN:${isbn}&format=json&jscmd=data`;
  fetch(url)
    .then(response => response.json())
    .then(data => {
      const bookData = data[`ISBN:${isbn}`];
      callback(bookData);
    })
    .catch(() => callback(null));
}

// Function to find the most frequently used color in an image
function getMostFrequentColor(image) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = image.width;
  canvas.height = image.height;
  ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  const colorCount = {};
  let maxColor = '';
  let maxCount = 0;

  for (let i = 0; i < data.length; i += 4) {
    const color = `rgb(${data[i]}, ${data[i + 1]}, ${data[i + 2]})`;
    colorCount[color] = (colorCount[color] || 0) + 1;

    if (colorCount[color] > maxCount) {
      maxCount = colorCount[color];
      maxColor = color;
    }
  }

  return maxColor;
}

// Function to set the spine color and size for each book
function setBookSpineColorAndSize(isbn, element) {
  getBookCover(isbn, img => {
    if (img) {
      const dominantColor = getMostFrequentColor(img);
      element.style.backgroundColor = dominantColor;
    } else {
      element.style.background = 'linear-gradient(#e0ab81, #493026)';
    }
  });

  getBookData(isbn, bookData => {
    if (bookData && bookData.number_of_pages) {
      const thicknessInCm = bookData.number_of_pages / 100; // Calculation - 1 cm per 100 pages
      const thicknessInMm = thicknessInCm * 10;
      element.style.width = `${thicknessInMm}px`;
      element.setAttribute('data-thickness', thicknessInCm); // Store thickness as attribute
    } else {
      // Default thickness if no data available
      element.style.width = `25px`;
      element.setAttribute('data-thickness', 2.5); // Default thickness in cm
    }
  });
}

// Initialize the bookshelf
document.addEventListener('DOMContentLoaded', () => {
  fetch('data/bookshelf.json')
    .then(response => response.json())
    .then(data => {
      renderBookOrder(data);
    })
    .catch(error => console.error('Error loading bookshelf data:', error));
});

// Render the books based on the uploaded order
function renderBookOrder(order) {
  const shelfContainer = document.getElementById('shelf-container');
  shelfContainer.innerHTML = ''; // Clear current shelves

  // Populate shelves with books from the order
  order.shelves.forEach(shelfData => {
    const shelf = document.createElement('div');
    shelf.className = 'shelf';
    shelf.setAttribute('data-width', shelfData.width);

    const bookContainer = document.createElement('div');
    bookContainer.className = 'book-container';

    shelfData.books.forEach(isbn => {
      const book = document.createElement('div');
      book.className = 'book';
      book.setAttribute('data-isbn', isbn);

      setBookSpineColorAndSize(isbn, book);

      bookContainer.appendChild(book);
    });

    shelf.appendChild(bookContainer);
    shelfContainer.appendChild(shelf);

    // Re-initialize SortableJS for the new book container
    Sortable.create(bookContainer, {
      animation: 150,
      group: 'shared', // Allow dragging between shelves
      onEnd: updateBookOrder,
    });
  });
}

// Update the book order based on the current DOM
function updateBookOrder() {
  const shelves = document.querySelectorAll('.shelf');
  const order = {
    shelves: [],
  };

  shelves.forEach(shelf => {
    const books = shelf.querySelectorAll('.book');
    const shelfBooks = [];

    books.forEach(book => {
      const isbn = book.getAttribute('data-isbn');
      shelfBooks.push(isbn);
    });

    order.shelves.push({
      width: parseFloat(shelf.getAttribute('data-width')),
      books: shelfBooks,
    });
  });

  localStorage.setItem('bookOrder', JSON.stringify(order));
}
