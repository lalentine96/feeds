from aiohttp import web

from srv import posts
from srv import request as req
from srv import session_manager
from srv import tags_index


@session_manager.check_session
async def handler(request: req.Request) -> web.Response:
    ctx = request.app
    ctx.posts = posts.load_demo()
    ctx.tags_index = tags_index.TagsIndex()
    for post in ctx.posts.values():
        for tag in post.tags:
            ctx.tags_index.add(tag)
    return web.json_response({})
