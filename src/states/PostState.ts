import { create } from 'zustand'
import {IPost} from "../models/post";
import {uniqBy} from "lodash";

export type POSTYPE = 'NEW'|'TRENDING'|'FOLLOWING'|'POLL'|'QUESTION';

type PostState = {
    trending: IPost[];
    poll: IPost[];
    following: IPost[];
    question: IPost[];
    newPosts: IPost[];

    add: (type:POSTYPE, item: IPost) => void;
    addMany: (type: POSTYPE, items: IPost[]) => void;
    edit: (type: POSTYPE, index: number, item: Partial<IPost>) => void;
    deleteItem: (type: POSTYPE, index: number) => void;
}

export const usePostState = create<PostState>((set) => ({
    trending: [],
    poll: [],
    following: [],
    question: [],
    newPosts: [],
    add: (type, item) => set((state) => {
        switch(type) {
            case "NEW": {
                return { ...state, newPosts: [...state.newPosts, item] }
            }
            case "TRENDING": {
                return { ...state, trending: [...state.trending, item] }
            }
            case "FOLLOWING": {
                return { ...state, following: [...state.following, item] }
            }
            case "POLL": {
                return { ...state, poll: [...state.poll, item] }
            }
            case "QUESTION": {
                return { ...state, question: [...state.question, item] }
            }
        }
    }),
    addMany: (type, items) => set((state) => {
            switch(type) {
                case "NEW": {
                    return { ...state, newPosts: uniqBy([...state.newPosts, ...items], 'id') }
                }
                case "TRENDING": {
                    return { ...state, trending: uniqBy([...state.trending, ...items], 'id') }
                }
                case "FOLLOWING": {
                    return { ...state, following: uniqBy([...state.following, ...items], 'id') }
                }
                case "POLL": {
                    return { ...state, poll: uniqBy([...state.poll, ...items], 'id') }
                }
                case "QUESTION": {
                    return { ...state, question: uniqBy([...state.question, ...items], 'id') }
                }
            }
        }),
    edit: (type, index, item) => set((state) => {
        switch(type) {
            case "NEW": {
                return { ...state, newPosts: state.newPosts.map((post, indx) => {
                    if (index === indx) {
                        return { ...post, ...item}
                    }
                    return item;
                    })  as IPost[],
                }
            }
            case "TRENDING": {
                return { ...state, trending: state.trending.map((post, indx) => {
                        if (index === indx) {
                            return { ...post, ...item}
                        }
                        return item;
                    }) as IPost[],
                }
            }
            case "FOLLOWING": {
                return { ...state, following: state.following.map((post, indx) => {
                        if (index === indx) {
                            return { ...post, ...item}
                        }
                        return item;
                    }) as IPost[],
                }
            }
            case "POLL": {
                return { ...state, poll: state.poll.map((post, indx) => {
                        if (index === indx) {
                            return { ...post, ...item}
                        }
                        return item;
                    }) as IPost[],
                }
            }
            case "QUESTION": {
                return { ...state, question: state.question.map((post, indx) => {
                        if (index === indx) {
                            return { ...post, ...item}
                        }
                        return item;
                    }) as IPost[],
                }
            }
        }
    }),
    deleteItem: (type, index) => set((state) => {
        switch(type) {
            case "NEW": {
                return { ...state, newPosts: state.newPosts.filter((post, indx) => index !== indx)  as IPost[],
                }
            }
            case "TRENDING": {
                return { ...state, trending: state.trending.filter((post, indx) => index !== indx) as IPost[],
                }
            }
            case "FOLLOWING": {
                return { ...state, following: state.following.filter((post, indx) => index !== indx) as IPost[],
                }
            }
            case "POLL": {
                return { ...state, poll: state.poll.filter((post, indx) => index !== indx) as IPost[],
                }
            }
            case "QUESTION": {
                return { ...state, question: state.question.filter((post, indx) => index !== indx) as IPost[],
                }
            }
        }
    })
}));