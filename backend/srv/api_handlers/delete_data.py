from aiohttp import web

from srv import session_manager
from srv.data_providers import reddit


@session_manager.check_session
async def handler(request: web.Request) -> web.Response:
    post_id = request.query.get('post_id')
    if not post_id:
        return web.json_response(
            {'error': 'post_id is required query parameter'}, status=400,
        )
    post: reddit.RedditPost = request.app['ctx'].reddit_posts.get(post_id)
    if post is None:
        return web.json_response({'error': 'post not found'}, status=404)
    post.deleted = True
    for tag in post.tags:
        request.app['ctx'].tags_index.delete(tag)
    return web.json_response()
