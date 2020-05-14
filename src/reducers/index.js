import { changeTag } from '../utils';

const initialState = {
    login: null,
    feeds: [],
    loading: false,
    error: null,
    hasMore: true,
    suggestedTags: new Set()
};

const updatePosts = (postId, state, getNewPost) => {
    const { feeds } = state;
    const index = feeds.findIndex(({ id }) => id === postId);
    const oldPost = feeds[index];

    const newPost = getNewPost(oldPost);

    let resPosts = [];

    if (newPost === null) {
        resPosts = [
            ...feeds.slice(0, index),
            ...feeds.slice(index + 1)
        ];
    } else {
        resPosts = [
            ...feeds.slice(0, index),
            newPost,
            ...feeds.slice(index + 1)
        ];
    }

    return {
        ...state,
        loading: false,
        feeds: resPosts,
    };
}

const reducer = (state = initialState, action) => {
    console.log(action.type);
    switch (action.type) {
        case 'CHANGE_LOGIN_SUCCESS':
            return {
                ...state,
                login: action.login,
                loading: false
            }
        case 'LOAD_FEEDS_REQUEST':
            return {
                ...state,
                loading: true,
            };
        case 'LOAD_FEEDS_SUCCESS':
            return {
                ...state,
                loading: false,
                error: null,
                hasMore: action.hasMore,
                feeds: [
                    ...state.feeds, 
                    ...action.newPosts.map(post => ({...post, deleteTimer: -1 }))],
            };
        case 'CLEAR_FEEDS_SUCCESS':
            return {
                ...state,
                feeds: []
            }
        case 'LOAD_FEEDS_FAILURE':
            return {
                ...state,
                loading: false,
                hasMore: false,
                error: action.payload,
            };
        case 'REMOVE_FEEDS_SUCCESS':
            return updatePosts(action.postId, state, 
                    (post) => ({ ...post, deleteTimer: action.timerId }));
        case 'DELETE_FEEDS_SUCCESS':
            return updatePosts(action.postId, state, () => null);
        case 'RESTORE_FEEDS_SUCCESS':
            return updatePosts(action.postId, state, (post) => {
                clearTimeout(post.deleteTimer);
                return {
                    ...post,
                    deleteTimer: -1
                };
            });

        case 'CHANGE_TAG_SUCCESS':
            return updatePosts(action.postId, state, 
                    (post) => changeTag(post, action.tag, action.isDelete ? 'delete' : 'add'));
        case 'DELETE_TAG_SUCCESS':
            return updatePosts(action.postId, state, 
                    (post) => changeTag(post, action.tag, 'delete'));
        case 'SUGGEST_TAGS_SUCCESS':
            return {
                ...state,
                suggestedTags: action.tags,
            };
         
        default:
            return state;
    }
}

export default reducer;