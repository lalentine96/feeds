from aiohttp import web

from srv import request as req
from srv import session_manager


@session_manager.check_session
async def handler(request: req.Request) -> web.Response:
    session = request.raw.cookies.get('feeds-session')
    request.app.session_manager.delete_session(session)
    return web.Response(status=200)
