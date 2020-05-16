import { changeTag } from '../utils';

const initialState = {
    login: null,
    isDemo: false,
    feeds: [],
    loading: false,
    error: '',
    hasMore: true,
    suggestedTags: []
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
        error: '',
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
                error: '',
                login: action.login,
                isDemo: action.isDemo ? true : state.isDemo,
                loading: false
            }
        case 'LOAD_FEEDS_REQUEST':
            return {
                ...state,
                loading: true,
                error: ''
            };
        case 'LOAD_FEEDS_SUCCESS':
            return {
                ...state,
                error: '',
                loading: false,
                hasMore: action.hasMore,
                feeds: [
                    ...state.feeds, 
                    ...action.newPosts.map(post => ({...post, deleteTimer: -1 }))],
            };
        case 'CLEAR_FEEDS_SUCCESS':
            return {
                ...state,
                feeds: [],
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
                    error: '',
                    loading: false,
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
                error: '',
                suggestedTags: action.tags,
            };
         
        default:
            return state;
    }
}

export default reducer;