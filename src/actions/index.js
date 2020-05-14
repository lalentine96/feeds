import {
    feedsRequested,
    feedsLoaded,
    feedsError,
    postRemoved,
    postDeleted,
    postRestored,
    tagChanged,
    tagsSuggested,
    feedsCleared,
    loginChanged
} from './creators';

const loadFeeds = (feedsService, dispatch) => (id, tags) => {
    dispatch(feedsRequested());
    if (!id) dispatch(feedsCleared());
    
    feedsService.getPosts(id, Array.from(tags))
        .then(data => dispatch(feedsLoaded(data)))
        .catch((err) => dispatch(feedsError(err)));
};

const deletePost = (feedsService, dispatch) => (postId) => {
    feedsService.deletePost(postId)
        .then(() => {
            const timerId = setTimeout(() => dispatch(postDeleted(postId)), 3000);
            dispatch(postRemoved(postId, timerId));
        })
        .catch((err) => dispatch(feedsError(err)));
}

const restorePost = (feedsService, dispatch) => (postId) => {
    feedsService.restorePost(postId)
        .then(() => dispatch(postRestored(postId)))
        .catch((err) => dispatch(feedsError(err)));
};

const changeTag = (feedsService, dispatch) => (postId, isDelete, tag) => {
    feedsService.postTags(postId, isDelete, { tags: [ tag ] })
        .then(() => dispatch(tagChanged(postId, isDelete, tag)))
        .catch((err) => dispatch(feedsError(err)));
};

const suggestTags = (feedsService, dispatch) => (prefix) => {
    feedsService.suggestTags(prefix)
        .then((tags) => dispatch(tagsSuggested(tags)))
        .catch((err) => dispatch(feedsError(err)));
};

const login = (feedsService, dispatch) => (login, password) => {
    dispatch(feedsRequested());
    feedsService.login(login, password)
        .then(login => dispatch(loginChanged(login)))
        .catch((err) => dispatch(feedsError(err)));
};

const logout = (feedsService, dispatch) => () => {
    feedsService.logout()
        .then(() => dispatch(loginChanged(null)))
        .catch((err) => dispatch(feedsError(err)));
};

const checkLogin = (feedsService, dispatch) => () => {
    dispatch(feedsRequested());
    feedsService.whoAmI()
        .then(({ login }) => dispatch(loginChanged(login)))
        .catch((err) => dispatch(feedsError(err)));
};

export {
    deletePost,
    restorePost,
    loadFeeds,
    changeTag,
    suggestTags,
    checkLogin,
    login,
    logout
};