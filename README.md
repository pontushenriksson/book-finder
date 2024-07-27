# Personal book finder

A project designed to store data about the books I've read and manage their order on physical shelves, helping me find them easily.

## Data needed

### Book information

- `name`: Title of the book
- `description`: Brief summary of the book
- `ISBN`: International Standard Book Number
- `status`: Read/Reading/Unread
- `reading number`: Times the book has been read
- `condition`: Condition of the book (1-100%)
- `width`: Width of the book (in centimeters)
- `rating`: Rating from 1-10 (in increments of 0.25)

### Shelf information

- `width`: Total width of the shelf (in centimeters)
- `books`: List of book arranged based on their width

### Book order

- Calculated based on data, e.g., rating, author, genre, or custom user-defined order.

## Features

- A website that displays a shelf with all the backs of the books I own to easily find the ones I want in real life.
- Drag-and-drop on the website to update the JSON.
- Hover over a back on the shelf it should get a bit bigger.
- Left-click the back of the book to enter a page about that book.
- Right-click the back of the book to display the title and category.
