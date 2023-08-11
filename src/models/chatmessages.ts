export type IChatMessage = {
    chat_code: string;
    created_at: string;
    deleted_by: number;
    deleted_for: any;
    deleted_time: string;
    id: number;
    message: string;
    post_images: Array<any>;
    reactions: Array<any>;
    receiver_id: number;
    sender_id: number;
    sender_user: Array<any>;
}

export type IChatResponse = {
    status: string;
    code: number;
    data: Array<IChatMessage>;
    links: {
        first: string;
        last: string;
        prev: string;
        next: string;
    },
    meta: {
        current_page: number;
        from: number;
        last_page: number;
        path: string;
        per_page: number;
        to: number;
        total: number;
    }
}