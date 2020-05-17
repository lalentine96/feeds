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
        .catch(() => dispatch(feedsError('load the post')));
};

const deletePost = (feedsService, dispatch) => (postId) => {
    dispatch(feedsRequested());
    feedsService.deletePost(postId)
        .then(() => {
            const timerId = setTimeout(() => dispatch(postDeleted(postId)), 3000);
            dispatch(postRemoved(postId, timerId));
        })
        .catch(() => dispatch(feedsError('delete post')));
}

const restorePost = (feedsService, dispatch) => (postId) => {
    dispatch(feedsRequested());
    feedsService.restorePost(postId)
        .then(() => dispatch(postRestored(postId)))
        .catch((err) => dispatch(feedsError('restore post')));
};

const changeTag = (feedsService, dispatch) => (postId, isDelete, tag) => {
    dispatch(feedsRequested());
    feedsService.postTags(postId, isDelete, { tags: [ tag ] })
        .then(() => dispatch(tagChanged(postId, isDelete, tag)))
        .catch((err) => dispatch(feedsError(isDelete ? 'delete tag' : 'add a new tag')));
};

const suggestTags = (feedsService, dispatch) => (prefix) => {
    dispatch(feedsRequested());
    feedsService.suggestTags(prefix)
        .then((tags) => dispatch(tagsSuggested(tags)))
        .catch((err) => dispatch(feedsError('find the tags')));
};

const auth = (feedsService, dispatch, action) => (login, password) => {
    dispatch(feedsRequested());
    feedsService.auth(action, login, password)
        .then(login => dispatch(loginChanged(login)))
        .catch((err) => dispatch(feedsError('log in')));
};

const logout = (feedsService, dispatch) => () => {
    dispatch(feedsRequested());
    feedsService.logout()
        .then(() => dispatch(loginChanged(null)))
        .catch((err) => dispatch(feedsError('log out')));
};

const checkLogin = (feedsService, dispatch) => () => {
    dispatch(feedsRequested());
    feedsService.whoAmI()
        .then(({ login, is_demo: isDemo }) => dispatch(loginChanged(login, isDemo)))
        .catch((err) => dispatch(feedsError('load the page')));
};

const reset = (feedsService, dispatch) => () => {
    dispatch(feedsRequested());
    feedsService.reset()
        .then(loadFeeds)
        .catch((err) => dispatch(feedsError('reset')));
}

export {
    deletePost,
    restorePost,
    loadFeeds,
    changeTag,
    suggestTags,
    checkLogin,
    auth,
    logout,
    reset
};