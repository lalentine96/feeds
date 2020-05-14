import itertools
import typing

from aiohttp import web

from srv import session_manager


CHUNK_SIZE = 7


@session_manager.check_session
async def handler(request: web.Request) -> web.Response:
    prefix = request.query.get('prefix', '')
    tags_index = request.app['ctx'].tags_index
    tags: typing.List[str] = []
    try:
        tags = list(itertools.islice(tags_index.get(prefix), CHUNK_SIZE))
    except KeyError:
        pass
    return web.json_response({'tags': tags})
