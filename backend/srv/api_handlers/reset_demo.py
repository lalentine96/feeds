from aiohttp import web

from srv import session_manager
from srv import tags_index
from srv.data_providers import reddit


@session_manager.check_session
async def handler(request: web.Request) -> web.Response:
    ctx = request.app['ctx']
    ctx.reddit_posts = reddit.load_demo()
    ctx.tags_index = tags_index.TagsIndex()
    for post in ctx.reddit_posts.values():
        for tag in post.tags:
            ctx.tags_index.add(tag)
    return web.json_response({})
