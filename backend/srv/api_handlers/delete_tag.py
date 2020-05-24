from aiohttp import web

from srv import request as req
from srv import session_manager


@session_manager.check_session
async def handler(request: req.Request) -> web.Response:
    post_id = request.raw.query.get('post_id')
    if not post_id:
        return web.json_response(
            {'error': 'post_id is required query parameter'}, status=400,
        )
    post = request.app.posts.get(post_id)
    if post is None:
        return web.json_response({'error': 'post not found'}, status=404)
    tags = (await request.raw.json()).get('tags', [])
    for tag in set(tags):
        try:
            post.tags.remove(tag)
            request.app.tags_index.delete(tag)
        except ValueError:
            pass
    return web.json_response()
