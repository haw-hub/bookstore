import React, { useState } from 'react';
import { useBooks } from '../hooks/useBooks';
import type { Book } from '../types/Book';
import './BookList.css';

export const BookList: React.FC = () => {
  const { books, loading, error, addBook, deleteBook, updateBook } = useBooks();
  const [newBook, setNewBook] = useState<Omit<Book, 'id'>>({
    title: '',
    author: '',
    price: 0
  });
  const [showForm, setShowForm] = useState(true);

  const [searchTerm, setSearchTerm] = useState('');
  const [editingBook, setEditingBook] = useState<Book | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addBook(newBook);
      setNewBook({ title: '', author: '', price: 0 });
    } catch (err) {
      console.error('Failed to add book:', err);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      try {
        await deleteBook(id);
      } catch (err) {
        console.error('Failed to delete book:', err);
      }
    }
  };

  const startEdit = (book: Book) => {
    setEditingBook(book);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingBook) {
      try {
        await updateBook(editingBook.id!, editingBook);
        setEditingBook(null);
      } catch (err) {
        console.error('Failed to update book:', err);
      }
    }
  };

  // Filtered books for search
  const filteredBooks = books.filter(book =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Stats
  const totalBooks = books.length;
  const totalValue = books.reduce((sum, book) => sum + (book.price || 0), 0);
  const averagePrice = totalBooks > 0 ? totalValue / totalBooks : 0;

  if (loading) return (
    <div className="book-store">
      <h1>Elite Book Collection</h1>
      <div className="loading">
        <div className="loading-spinner"></div>
        <div>Loading Your Library...</div>
      </div>
    </div>
  );

  if (error) return (
    <div className="book-store">
      <h1>📚 Elite Book Collection</h1>
      <div className="error">⚠️ {error}</div>
    </div>
  );

  return (
    <div className="book-store">
      
      <h1>
        <span className="icon">📚</span>
        <span className="title">Elite Book Collection</span>
     </h1>

       

      {/* Stats Bar */}
      <div className="stats-bar">
        <div className="stat-item">
          <span className="stat-number">{totalBooks}</span>
          <span className="stat-label">Total Books</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">${totalValue.toFixed(2)}</span>
          <span className="stat-label">Collection Value</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">${averagePrice.toFixed(2)}</span>
          <span className="stat-label">Avg. Price</span>
        </div>
      </div>

      {/* Search Bar */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="🔍 Search by title or author..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Add Book Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="add-book-form">
          <input
            type="text"
            placeholder="📖 Enter Book Title"
            value={newBook.title}
            onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="✍️ Author Name"
            value={newBook.author}
            onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
            required
          />
          <input
            type="number"
            placeholder="💰 Price"
            value={newBook.price}
            onChange={(e) => setNewBook({ ...newBook, price: parseFloat(e.target.value) || 0 })}
            step="0.01"
            min="0"
            required
          />
          <button type="submit">🚀 ADD BOOK</button>
        </form>
      )}

      {/* Edit Book Form */}
      {editingBook && (
        <form onSubmit={handleUpdate} className="edit-book-form">
          <input
            type="text"
            value={editingBook.title}
            onChange={(e) => setEditingBook({ ...editingBook, title: e.target.value })}
          />
          <input
            type="text"
            value={editingBook.author}
            onChange={(e) => setEditingBook({ ...editingBook, author: e.target.value })}
          />
          <input
            type="number"
            value={editingBook.price}
            onChange={(e) => setEditingBook({ ...editingBook, price: parseFloat(e.target.value) })}
          />
          <button type="submit">💾 SAVE</button>
          <button type="button" onClick={() => setEditingBook(null)}>❌ CANCEL</button>
        </form>
      )}

      {/* Book Grid */}
      <div className="book-list">
        {filteredBooks.map(book => (
          <div key={book.id} className="book-item">
            <h3>"{book.title}"</h3>
            <p>👨‍💼 Author: {book.author}</p>
            <p className="price">💎 ${book.price?.toFixed(2)}</p>

            <button onClick={() => startEdit(book)}>✏️ EDIT</button>
            <button onClick={() => handleDelete(book.id!)}>🗑️ REMOVE</button>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {books.length === 0 && !loading && (
        <div style={{
          textAlign: 'center',
          color: 'white',
          padding: '60px',
          background: 'rgba(255,255,255,0.1)',
          backdropFilter: 'blur(10px)',
          borderRadius: '25px',
          border: '1px solid rgba(255,255,255,0.2)'
        }}>
          <h3 style={{ fontSize: '2rem', marginBottom: '20px' }}>📚 Your Library Awaits!</h3>
          <p style={{ fontSize: '1.2rem', opacity: 0.9 }}>
            Start building your collection by adding your first book above.
          </p>
        </div>
      )}

      {/* Floating Action Button */}
      <button
        className="fab"
        onClick={() => setShowForm(!showForm)}
        title={showForm ? "Hide Form" : "Add Book"}
      >
        {showForm ? '−' : '+'}
      </button>
    </div>
  );
};
