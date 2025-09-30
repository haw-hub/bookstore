export interface Book {
    id?: number;
    title: string;
    author: string;
    price: number;
    createdAt?: string;
}

export interface BookSearchParams {
    keyword?: string;
    author?: string;
    maxPrice?: number;
}