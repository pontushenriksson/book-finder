document.addEventListener('DOMContentLoaded', () => {
  const shelfContainer = document.getElementById('shelf-container');
  const bookModal = document.getElementById('book-modal');
  const closeModalButton = document.querySelector('.close-button');
  const bookTitle = document.getElementById('book-title');
  const bookCategory = document.getElementById('book-category');
  const bookDescription = document.getElementById('book-description');
  const downloadJsonButton = document.getElementById('download-json');

  let data = {};

  fetch('data.json')
    .then(response => response.json())
    .then(jsonData => {
      data = jsonData;
      renderShelves(data.shelves);
    });

  function renderShelves(shelves) {
    shelves.forEach((shelf, shelfIndex) => {
      const shelfElement = document.createElement('div');
      shelfElement.classList.add('shelf');
      shelf.books.forEach((bookISBN, bookIndex) => {
        const book = data.books.find(b => b.ISBN === bookISBN);
        const bookElement = document.createElement('div');
        bookElement.classList.add('book');
        bookElement.style.width = `${book.width}px`;
        bookElement.dataset.isbn = book.ISBN;
        bookElement.draggable = true;
        bookElement.addEventListener('dragstart', e =>
          handleDragStart(e, shelfIndex, bookIndex)
        );
        bookElement.addEventListener('dragover', handleDragOver);
        bookElement.addEventListener('drop', e => handleDrop(e, shelfIndex));

        bookElement.addEventListener('mouseover', () => {
          bookElement.classList.add('active');
        });

        bookElement.addEventListener('mouseout', () => {
          bookElement.classList.remove('active');
        });

        bookElement.addEventListener('click', () => {
          showBookDetails(book);
        });

        shelfElement.appendChild(bookElement);
      });
      shelfContainer.appendChild(shelfElement);
    });
  }

  function handleDragStart(e, shelfIndex, bookIndex) {
    e.dataTransfer.setData(
      'text/plain',
      JSON.stringify({ shelfIndex, bookIndex })
    );
  }

  function handleDragOver(e) {
    e.preventDefault();
  }

  function handleDrop(e, targetShelfIndex) {
    e.preventDefault();
    const data = JSON.parse(e.dataTransfer.getData('text/plain'));
    const { shelfIndex, bookIndex } = data;
    const bookISBN = data.shelves[shelfIndex].books[bookIndex];
    data.shelves[shelfIndex].books.splice(bookIndex, 1);
    data.shelves[targetShelfIndex].books.push(bookISBN);
    updateShelves();
  }

  function showBookDetails(book) {
    bookTitle.textContent = book.name;
    bookCategory.textContent = `Category: ${book.status}`;
    bookDescription.textContent = book.description;
    bookModal.style.display = 'block';
  }

  closeModalButton.addEventListener('click', () => {
    bookModal.style.display = 'none';
  });

  window.onclick = function (event) {
    if (event.target == bookModal) {
      bookModal.style.display = 'none';
    }
  };

  function updateShelves() {
    shelfContainer.innerHTML = '';
    renderShelves(data.shelves);
  }

  downloadJsonButton.addEventListener('click', () => {
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'data.json';
    a.click();
    URL.revokeObjectURL(url);
  });
});
