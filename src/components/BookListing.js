import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from '../context/AuthContext';
import './BookListing.css';
const BookListing = () => {
    const { authData, logout } = useAuth();
    const [books, setBooks] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredBooks, setFilteredBooks] = useState([]);
    const [editBookData, setEditBookData] = useState(null); // State for book being edited
    const [originalBookData, setOriginalBookData] = useState(null); // Original book data to detect changes
    const [newBook, setNewBook] = useState({
        title: "",
        author: "",
        genre: "",
        condition: "New",
        availabilityStatus: "Available",
        location: ""
    });
    const [isAddingBook, setIsAddingBook] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false); // Modal state
    const navigate = useNavigate();
    useEffect(() => {
        console.log("entered use effect");
        console.log(authData);
        if (authData && authData.email) {
            console.log("making call for function fecthbooks");
            fetchBooks();
        }
    }, [authData]);

    const handleSearchClick = () => {
        navigate('/search');
      };

    const fetchBooks = async () => {
        if (authData && authData.email) {
            try {
                console.log("Fetch books call");
                const response = await axios.get(`http://localhost:8080/book/getbooks?email=${authData.email}`);
                setBooks(response.data);
                setFilteredBooks(response.data);
            } catch (error) {
                console.error("Error fetching books:", error);
            }
        }
        else {
            console.error("User email not found in auth data.");
        }
    };


    const filterBooks = (searchTerm) => {
        const filtered = books.filter((book) =>
            book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
            book.genre.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredBooks(filtered);
    };
    const handleAddBookToggle = () => {
        setIsAddingBook(!isAddingBook);
    };

    const handleNewBookChange = (e) => {
        setNewBook({
            ...newBook,
            [e.target.name]: e.target.value
        });
    };

    const handleAddBookSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`http://localhost:8080/book/add?email=${authData.email}`, newBook);
            fetchBooks(); // Refresh the book list after adding
            setNewBook({
                title: "",
                author: "",
                genre: "",
                condition: "New",
                availabilityStatus: "Available",
                location: ""
            });
            setIsAddingBook(false);
        } catch (error) {
            console.error("Error adding book:", error);
        }
    };
    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const handleViewProfile = () => {
        navigate('/profile');
    };

    const handleResetPassword = () => {
        navigate('/reset-password');
    };
    const handleDelete = async (bookId) => {
        try {
            await axios.delete(`http://localhost:8080/book/delete?bookId=${bookId}`);
            setBooks(books.filter(book => book.bookId !== bookId));
            setFilteredBooks(filteredBooks.filter(book => book.bookId !== bookId));
        } catch (error) {
            console.error("Error deleting book:", error);
        }
    };

    const handleEdit = (book) => {
        setEditBookData({ ...book }); // Load book data into edit form
        setOriginalBookData({ ...book }); // Save a copy for comparison
        setIsEditModalOpen(true);
    };
    const closeEditModal = () => {
        setIsEditModalOpen(false);
    };
    const handleEditSubmit = async (e) => {
        e.preventDefault();

        // Determine the changed fields only
        const updatedFields = {};
        for (const key in editBookData) {
            if (editBookData[key] !== originalBookData[key]) {
                updatedFields[key] = editBookData[key];
            }
        }

        if (Object.keys(updatedFields).length === 0) {
            console.log("No changes detected.");
            return; // Exit if no changes
        }

        updatedFields.bookId = editBookData.bookId; // Ensure bookId is included

        try {
            const response = await axios.put("http://localhost:8080/book/edit", updatedFields);
            console.log(response.data.message); // Log success message
            fetchBooks(); // Refresh book list after edit
            setIsEditModalOpen(false);
        } catch (error) {
            console.error("Error editing book:", error);
        }
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditBookData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };
    return (
        <div className="book-listing">
            {/* Top right dropdown */}
            <div className="user-dropdown">
                <button className="dropdown-btn">Options ▼</button>
                <div className="dropdown-content">
                    <button onClick={handleViewProfile}>View Profile</button>
                    <button onClick={handleResetPassword}>Reset Password</button>
                    <button onClick={handleLogout}>Logout</button>
                </div>
            </div>

            <h2>Book Listing</h2>
             {/* Search Icon */}
             <button onClick={handleSearchClick} className="search-page">Search</button>
            <button onClick={handleAddBookToggle}>
                {isAddingBook ? "Cancel" : "Add a Book"}
            </button>

            {isAddingBook && (
                <form onSubmit={handleAddBookSubmit} className="add-book-form">
                    <input
                        type="text"
                        name="title"
                        placeholder="Title"
                        value={newBook.title}
                        onChange={handleNewBookChange}
                        required
                    />
                    <input
                        type="text"
                        name="author"
                        placeholder="Author"
                        value={newBook.author}
                        onChange={handleNewBookChange}
                        required
                    />
                    <input
                        type="text"
                        name="genre"
                        placeholder="Genre"
                        value={newBook.genre}
                        onChange={handleNewBookChange}
                        required
                    />
                    {/* Condition Dropdown */}
                    <select
                        name="condition"
                        value={newBook.condition}
                        onChange={handleNewBookChange}
                        required
                    >
                        <option value="New">New</option>
                        <option value="LikeNew">Like New</option>
                        <option value="Good">Good</option>
                        <option value="Acceptable">Acceptable</option>
                        <option value="Poor">Poor</option>
                    </select>
                    {/* Availability Status Dropdown */}
                    <select
                        name="availabilityStatus"
                        value={newBook.availabilityStatus}
                        onChange={handleNewBookChange}
                        required
                    >
                        <option value="Available">Available</option>
                        <option value="LentOut">Lent Out</option>
                        <option value="Reserved">Reserved</option>
                    </select>
                    <input
                        type="text"
                        name="location"
                        placeholder="Location"
                        value={newBook.location}
                        onChange={handleNewBookChange}
                        required
                    />
                    <button type="submit">Add Book</button>
                </form>
            )}
            <div className="book-list">
                {filteredBooks.map((book) => (
                    <div className="book-card" key={book.bookId}>
                        <h3>{book.title}</h3>
                        <p><strong>Author:</strong> {book.author}</p>
                        <p><strong>Genre:</strong> {book.genre}</p>
                        <p><strong>Condition:</strong> {book.condition}</p>
                        <p><strong>Availability:</strong> {book.availabilityStatus}</p>
                        <p><strong>Location:</strong> {book.location}</p>
                        <button onClick={() => handleEdit(book)}>Edit</button>
                        <button onClick={() => handleDelete(book.bookId)}>Delete</button>
                    </div>
                ))}
            </div>
            {isEditModalOpen && (
                <div className="modal-overlay" onClick={closeEditModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h3>Edit Book</h3>
                        <form onSubmit={handleEditSubmit} className="edit-book-form">
                            <label>Title:</label>
                            <input type="text" name="title" value={editBookData.title} onChange={handleEditChange} required />
                            <label>Author:</label>
                            <input type="text" name="author" value={editBookData.author} onChange={handleEditChange} required />
                            <label>Genre:</label>
                            <input type="text" name="genre" value={editBookData.genre} onChange={handleEditChange} required />
                            <label>Condition:</label>
                            <select name="condition" value={editBookData.condition} onChange={handleEditChange} required>
                                <option value="New">New</option>
                                <option value="LikeNew">Like New</option>
                                <option value="Good">Good</option>
                                <option value="Acceptable">Acceptable</option>
                                <option value="Poor">Poor</option>
                            </select>
                            <label>Availability:</label>
                            <select name="availabilityStatus" value={editBookData.availabilityStatus} onChange={handleEditChange} required>
                                <option value="Available">Available</option>
                                <option value="LentOut">Lent Out</option>
                                <option value="Reserved">Reserved</option>
                            </select>
                            <label>Location:</label>
                            <input type="text" name="location" value={editBookData.location} onChange={handleEditChange} required />
                            <button type="submit">Save Changes</button>
                            <button type="button" onClick={closeEditModal}>Cancel</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BookListing;
