import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './BookSearchPage.css'

const BookSearchPage = () => {
  const [location, setLocation] = useState('');
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [genre, setGenre] = useState('');
  const [availabilityStatuses, setAvailabilityStatuses] = useState([]);
  const [books, setBooks] = useState([]);
  const [page, setPage] = useState(0); // Track the current page
  const [totalPages, setTotalPages] = useState(0); // Total number of pages
  const navigate = useNavigate();

  const handleSearch = async (event, pageNum = 0) => {
    event?.preventDefault();

    // Create a request object and filter out empty values
    const requestBody = {
      ...(location && { location }),
      ...(title && { title }),
      ...(author && { author }),
      ...(genre && { genre }),
      ...(availabilityStatuses.length > 0 && { availabilityStatuses }),
    };

    try {
      // Make the API call with the filtered search criteria
      const response = await axios.post(
        `http://localhost:8080/book/search?page=${pageNum}&size=10`,
        requestBody
      );
      setBooks(response.data.content); // Assuming response.data.content contains the list of books
      setPage(pageNum); // Update the current page
      setTotalPages(response.data.totalPages); // Update total pages from response
    } catch (error) {
      console.error('Error searching books:', error);
    }
  };

  const handleStatusChange = (event) => {
    const { value, checked } = event.target;
    setAvailabilityStatuses((prevStatuses) =>
      checked ? [...prevStatuses, value] : prevStatuses.filter((status) => status !== value)
    );
  };

  const goToHome = () => {
    navigate('/book-listing');
  };

  const goToNextPage = () => {
    if (page < totalPages - 1) handleSearch(null, page + 1);
  };

  const goToPreviousPage = () => {
    if (page > 0) handleSearch(null, page - 1);
  };

  return (
    <div className="page-container">
      <h1>Search Books</h1>
      <button onClick={goToHome}>Home</button>
      <form className="search-form" onSubmit={handleSearch}>
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Enter location"
        />
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter title"
        />
        <input
          type="text"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          placeholder="Enter author"
        />
        <input
          type="text"
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
          placeholder="Enter genre"
        />
        <div>
          <label>Availability Status:</label>
          <label className="checkbox-group">
            <input
              type="checkbox"
              value="Available"
              onChange={handleStatusChange}
              checked={availabilityStatuses.includes('Available')}
            />
            Available
          </label>
          <label>
            <input
              type="checkbox"
              value="LentOut"
              onChange={handleStatusChange}
              checked={availabilityStatuses.includes('LentOut')}
            />
            Lent Out
          </label>
          <label>
            <input
              type="checkbox"
              value="Reserved"
              onChange={handleStatusChange}
              checked={availabilityStatuses.includes('Reserved')}
            />
            Reserved
          </label>
        </div>
        <button type="submit">Search</button>
      </form>

      <div className="results-container">
        <h2>Search Results</h2>
        {books.length === 0 ? (
          <p>No books found</p>
        ) : (
          <ul>
            {books.map((book) => (
              <li className="book-item" key={book.bookId}>
                <h3>{book.title}</h3>
                <p>Author: {book.author}</p>
                <p>Location: {book.location}</p>
                <p>Condition: {book.condition}</p>
                <p>Availability: {book.availabilityStatus}</p>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="pagination-controls">
        <button
          onClick={goToPreviousPage}
          disabled={page === 0}
        >
          Previous
        </button>
        <span>Page {page + 1} of {totalPages}</span>
        <button
          onClick={goToNextPage}
          disabled={page >= totalPages - 1}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default BookSearchPage;
