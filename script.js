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
function setBookSpineColorAndSize(isbn, thickness, element) {
  getBookCover(isbn, img => {
    if (img) {
      const dominantColor = getMostFrequentColor(img);
      element.style.backgroundColor = dominantColor;
    } else {
      element.style.background = 'linear-gradient(#e0ab81, #493026)';
    }

    // Convert thickness from cm to mm and set as pixel width
    const thicknessInMm = thickness * 10;
    element.style.width = `${thicknessInMm}px`;
  });
}

// Initialize the bookshelf
document.addEventListener('DOMContentLoaded', () => {
  const books = document.querySelectorAll('.book');

  books.forEach(book => {
    const isbn = book.getAttribute('data-isbn');
    const thickness = parseFloat(book.getAttribute('data-thickness'));
    setBookSpineColorAndSize(isbn, thickness, book);
  });
});
