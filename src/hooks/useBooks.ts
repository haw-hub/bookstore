import { useState, useEffect } from 'react';
import type { Book, BookSearchParams } from '../types/Book';
import { bookService } from '../services/BookService';

export const useBooks = () => {
    const [books, setBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const loadBooks = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await bookService.getAllBooks();
            console.log(data);
            setBooks(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    const addBook = async (book: Book) => {
        try {
            const newBook = await bookService.createBook(book);
            setBooks(prev => [...prev, newBook]);
            return newBook;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to add book');
            throw err;
        }
    };

    const updateBook = async (id: number, book: Book) => {
        try {
            const updatedBook = await bookService.updateBook(id, book);
            setBooks(prev => prev.map(b => b.id === id ? updatedBook : b));
            return updatedBook;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to update book');
            throw err;
        }
    };

    const deleteBook = async (id: number) => {
        try {
            await bookService.deleteBook(id);
            setBooks(prev => prev.filter(book => book.id !== id));
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to delete book');
            throw err;
        }
    };

    const searchBooks = async (params: BookSearchParams): Promise<Book[]> => {
        try {
            const results = await bookService.searchBooks(params);
            return results;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to search books');
            throw err;
        }
    };

    useEffect(() => {
        loadBooks();
    }, []);

    return { 
        books, 
        loading, 
        error, 
        addBook, 
        updateBook, 
        deleteBook, 
        searchBooks,
        refreshBooks: loadBooks 
    };
};