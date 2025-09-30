import type { Book } from '../types/Book';
import type { BookSearchParams } from '../types/Book';

const API_BASE_URL = 'http://localhost:8080/api/books';

export const bookService = {
    // Get all books
    async getAllBooks(): Promise<Book[]> {
        try {
            const response = await fetch(API_BASE_URL);
            if (!response.ok) throw new Error('Failed to fetch books');
            return await response.json();
        } catch (error) {
            console.error('Error fetching all books:', error);
            throw error;
        }
    },

    // Get book by ID
    async getBookById(id: number): Promise<Book> {
        try {
            const response = await fetch(`${API_BASE_URL}/${id}`);
            if (!response.ok) throw new Error('Failed to fetch book');
            return await response.json();
        } catch (error) {
            console.error(`Error fetching book with ID ${id}:`, error);
            throw error;
        }
    },

    // Create new book
    async createBook(book: Book): Promise<Book> {
        try {
            const response = await fetch(API_BASE_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(book),
            });
            if (!response.ok) throw new Error('Failed to create book');
            return await response.json();
        } catch (error) {
            console.error('Error creating book:', error);
            throw error;
        }
    },

    // Update book
    async updateBook(id: number, book: Book): Promise<Book> {
        try {
            const response = await fetch(`${API_BASE_URL}/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(book),
            });
            if (!response.ok) throw new Error('Failed to update book');
            return await response.json();
        } catch (error) {
            console.error(`Error updating book with ID ${id}:`, error);
            throw error;
        }
    },

    // Delete book
    async deleteBook(id: number): Promise<void> {
        try {
            const response = await fetch(`${API_BASE_URL}/${id}`, {
                method: 'DELETE',
            });
            if (!response.ok) throw new Error('Failed to delete book');
        } catch (error) {
            console.error(`Error deleting book with ID ${id}:`, error);
            throw error;
        }
    },

    // Search books
    async searchBooks(params: BookSearchParams): Promise<Book[]> {
        try {
            const queryParams = new URLSearchParams();
            if (params.keyword) queryParams.append('keyword', params.keyword);
            if (params.author) queryParams.append('author', params.author);
            if (params.maxPrice) queryParams.append('maxPrice', params.maxPrice.toString());

            const url = `${API_BASE_URL}/search?${queryParams}`;
            const response = await fetch(url);
            if (!response.ok) throw new Error('Failed to search books');
            return await response.json();
        } catch (error) {
            console.error('Error searching books:', error);
            throw error;
        }
    },

    // Get books by author
    async getBooksByAuthor(author: string): Promise<Book[]> {
        try {
            const response = await fetch(`${API_BASE_URL}/author/${encodeURIComponent(author)}`);
            if (!response.ok) throw new Error('Failed to fetch books by author');
            return await response.json();
        } catch (error) {
            console.error(`Error fetching books by author "${author}":`, error);
            throw error;
        }
    },

    // Get books by max price
    async getBooksByMaxPrice(maxPrice: number): Promise<Book[]> {
        try {
            const response = await fetch(`${API_BASE_URL}/price/max/${maxPrice}`);
            if (!response.ok) throw new Error('Failed to fetch books by price');
            return await response.json();
        } catch (error) {
            console.error(`Error fetching books with max price ${maxPrice}:`, error);
            throw error;
        }
    }
};
