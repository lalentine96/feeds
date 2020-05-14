from aiohttp import web

from srv import session_manager


@session_manager.check_session
async def handler(request: web.Request) -> web.Response:
    post_id = request.query.get('post_id')
    if not post_id:
        return web.json_response(
            {'error': 'post_id is required query parameter'}, status=400,
        )
    post = request.app['ctx'].reddit_posts.get(post_id)
    if post is None:
        return web.json_response({'error': 'post not found'}, status=404)
    tags = (await request.json()).get('tags', [])
    # todo: check uniqueness
    post.tags.extend(tags)
    for tag in tags:
        request.app['ctx'].tags_index.add(tag)
    return web.json_response()
