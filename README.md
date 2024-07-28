# Personal book finder - v0.0.1

A project designed to store data about the books I've read and manage their order on physical shelves, helping me find them easily and allowing you to to the same.

## Bugs and TODO

- The downloaded JSON doesn't work properly.
- A book gets the black color instead of the linear-gradient for some reason.
- Books get duplicated when uploading the JSON.
- Add more JSON data to the website.
- Optimize website to not refetch all ISBNs.
- Add more .book's from the JSON file.
- Implement a way to let the different shelves be different widths.
- Updated all documentation and information.

## Fun features

- Add shelf brackets to the website.
- Allow users to change colors.
- Allow users to move shelves for a more accurate layout.
- Allow users to lay books down on the shelves.
- Let users add books by a search bar or settings page.
- Connect this to an LED so an LED below the book lights up when you click a button on the website.
- Create a tutorial.
- Store last changes in localstorage for redundancy.

## Data needed (Might need some refining)

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

- Calculated based on data like rating, reading number or custom user-defined order.

## Features

- A website that displays a shelf with all the backs of the books I own to easily find the ones I want in real life.
- Drag-and-drop on the website to update the JSON.
- Hover over a back on the shelf it should get a bit bigger.
- Left-click the back of the book to enter a page about that book.
- Right-click the back of the book to display the title and category.

## How to use

I will write a guide here later on when the website is more complete.
