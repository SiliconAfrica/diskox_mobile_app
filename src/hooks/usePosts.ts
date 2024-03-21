import { useState, useCallback } from 'react';
import {IPost} from "../models/post";
import {useQuery} from "react-query";
import {URLS} from "../services/urls";
import httpService from "../utils/httpService";
import {PaginatedResponse} from "../models/PaginatedResponse";
import {POSTYPE, usePostState} from "../states/PostState";
import {uniqBy} from "lodash";


const usePosts = ({ type, url }: {
    url: string,
    type: POSTYPE,
}) => {
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);

    // post state
    const { add, addMany, edit, newPosts, trending, following, poll, question  } = usePostState((state) => state);

    const enableFetcher = useCallback(() => {
        switch (type) {
            case "NEW": {
                if (total === 0) return false;
                return newPosts.length === total;
            }
            case "TRENDING": {
                if (total === 0) return false;
                return trending.length === total;
            }
            case "FOLLOWING": {
                if (total === 0) return false;
                return following.length === total;
            }
            case "POLL": {
                if (total === 0) return false;
                return poll.length === total;
            }
            case "QUESTION": {
                if (total === 0) return false;
                return question.length === total;
            }
        }
    }, [newPosts, trending, following, poll, question]);

    const { isLoading, isError } = useQuery(['getPosts', page, type], () => httpService.get(url, {
        params: {
            page,
        }
    }), {
        enabled: enableFetcher(),
        onSuccess: (data) => {
            const item: PaginatedResponse<IPost> = data.data;
            handleFetch(item.data.data);
            setTotal(item.data.total);
        },
        onError: () => {},
    });

    const handleNew = useCallback((data: IPost[]) => {
        if(newPosts.length > 0) {
            const arr = uniqBy([...newPosts, ...data], 'id');
            addMany('NEW', arr);
        } else {
            addMany('NEW', data);
        }
    }, [newPosts]);

    const handleTrending = useCallback((data: IPost[]) => {
        if(trending.length > 0) {
            const arr = uniqBy([...newPosts, ...data], 'id');
            addMany('TRENDING', arr);
        } else {
            addMany('TRENDING', data);
        }
    }, [trending]);

    const handleFollowng = useCallback((data: IPost[]) => {
        if(following.length > 0) {
            const arr = uniqBy([...newPosts, ...data], 'id');
            addMany('FOLLOWING', arr);
        } else {
            addMany('FOLLOWING', data);
        }
    }, [following]);

    const handlePolls = useCallback((data: IPost[]) => {
        if(poll.length > 0) {
            const arr = uniqBy([...newPosts, ...data], 'id');
            addMany('POLL', arr);
        } else {
            addMany('POLL', data);
        }
    }, [poll]);

    const handleQuestions = useCallback((data: IPost[]) => {
        if(question.length > 0) {
            const arr = uniqBy([...newPosts, ...data], 'id');
            addMany('QUESTION', arr);
        } else {
            addMany('QUESTION', data);
        }
    }, [question])

    const handleFetch = useCallback((data: IPost[]) => {
        const obj = {
            TRENDING: () => handleTrending(data),
            NEW: () => handleNew(data),
            FOLLOWING: () => handleFollowng(data),
            POLL: () => handlePolls(data),
            QUESTION: () => handleQuestions(data),
        }
        obj[type]();
    }, [])

    return {
        total,
        page,
        setPage,
        isLoading,
        isError
    }
}

export default usePosts;