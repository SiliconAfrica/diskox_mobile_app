export type PaginatedResponse<T> = {
    code: number;
    data: {
        current_page: number,
        data: Array<T>,
        next_page_url: string;
        path: string;
        per_page: number;
        prev_page_url: string;
        to: number;
        total: number;
    }
}