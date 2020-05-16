export const feedsRequested = () => {
    return {
        type: 'LOAD_FEEDS_REQUEST',
    };
};

export const feedsLoaded = (newPosts) => {

    return {
        type: 'LOAD_FEEDS_SUCCESS',
        newPosts,
        hasMore: Boolean(newPosts.length)
    };
};

export const feedsCleared = () => ({ type: 'CLEAR_FEEDS_SUCCESS' });

export const feedsError = (error) => {
    return {
        type: 'LOAD_FEEDS_FAILURE',
        payload: error,
    };
};

export const postDeleted = (id) => {
    return {
        type: 'DELETE_FEEDS_SUCCESS',
        postId: id,
    };
};

export const postRemoved = (postId, timerId) => {
    return {
        type: 'REMOVE_FEEDS_SUCCESS',
        postId,
        timerId
    };
};

export const postRestored = (postId) => {
    return {
        type: 'RESTORE_FEEDS_SUCCESS',
        postId
    };
};

export const tagChanged = (postId, isDelete, tag) => {
    return {
        type: 'CHANGE_TAG_SUCCESS',
        postId,
        isDelete,
        tag
    };
};

export const tagsSuggested = (tags) => {
    return {
        type: 'SUGGEST_TAGS_SUCCESS',
        tags
    };
};

export const loginChanged = (login, isDemo) => {
    return {
        type: 'CHANGE_LOGIN_SUCCESS',
        login,
        isDemo
    };
};
