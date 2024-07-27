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
  const books = document.querySelectorAll('.book');

  books.forEach(book => {
    const isbn = book.getAttribute('data-isbn');
    setBookSpineColorAndSize(isbn, book);
  });

  // Initialize SortableJS for each book container
  const bookContainers = document.querySelectorAll('.book-container');
  bookContainers.forEach(container => {
    Sortable.create(container, {
      animation: 150,
      group: 'shared', // Allow dragging between shelves
      onEnd: updateBookOrder,
    });
  });

  // Event listener for downloading JSON
  document
    .getElementById('download-json')
    .addEventListener('click', downloadBookOrder);

  // Event listener for uploading JSON
  document
    .getElementById('upload-json')
    .addEventListener('change', uploadBookOrder);
});

// Update the book order based on the current DOM
function updateBookOrder() {
  const shelves = document.querySelectorAll('.shelf');
  const order = [];

  shelves.forEach((shelf, shelfIndex) => {
    const books = shelf.querySelectorAll('.book');
    const shelfOrder = [];

    books.forEach(book => {
      const isbn = book.getAttribute('data-isbn');
      const thickness = parseFloat(book.getAttribute('data-thickness'));
      shelfOrder.push({ isbn, thickness });
    });

    order.push({ shelfIndex, books: shelfOrder });
  });

  localStorage.setItem('bookOrder', JSON.stringify(order));
}

// Download the current book order as a JSON file
function downloadBookOrder() {
  const order = JSON.parse(localStorage.getItem('bookOrder') || '[]');
  const blob = new Blob([JSON.stringify(order, null, 2)], {
    type: 'application/json',
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'bookshelf.json';
  a.click();
  URL.revokeObjectURL(url);
}

// Upload the book order from a JSON file
function uploadBookOrder(event) {
  const file = event.target.files[0];
  const reader = new FileReader();

  reader.onload = function (e) {
    const order = JSON.parse(e.target.result);
    localStorage.setItem('bookOrder', JSON.stringify(order));
    renderBookOrder(order);
  };

  reader.readAsText(file);
}

// Render the books based on the uploaded order
function renderBookOrder(order) {
  const shelfContainer = document.getElementById('shelf-container');
  shelfContainer.innerHTML = ''; // Clear current shelves

  // Populate shelves with books from the order
  order.forEach(shelfData => {
    const shelfIndex = shelfData.shelfIndex;
    const books = shelfData.books;

    // Create a new shelf element
    const shelf = document.createElement('div');
    shelf.className = 'shelf';

    // Create a new book container element
    const bookContainer = document.createElement('div');
    bookContainer.className = 'book-container';

    books.forEach(bookData => {
      const book = document.createElement('div');
      book.className = 'book';
      book.setAttribute('data-isbn', bookData.isbn);
      book.setAttribute('data-thickness', bookData.thickness);

      const isbn = bookData.isbn;
      const thickness = parseFloat(bookData.thickness); // Ensure thickness is a number
      setBookSpineColorAndSize(isbn, thickness, book);

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
