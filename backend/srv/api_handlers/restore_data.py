import typing

from aiohttp import web

from srv import posts
from srv import request as req
from srv import session_manager


@session_manager.check_session
async def handler(request: req.Request) -> web.Response:
    post_id = request.raw.query.get('post_id')
    if not post_id:
        return web.json_response(
            {'error': 'post_id is required query parameter'}, status=400,
        )
    post: typing.Optional[posts.Post] = request.app.posts.get(post_id)
    if post is None:
        return web.json_response({'error': 'post not found'}, status=404)
    post.deleted = False
    for tag in post.tags:
        request.app.tags_index.add(tag)
    return web.json_response()
