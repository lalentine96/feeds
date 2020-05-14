from aiohttp import web

from srv import session_manager


@session_manager.check_session
async def handler(request: web.Request) -> web.Response:
    session = request.cookies.get('feeds-session')
    request.app['ctx'].session_manager.delete_session(session)
    return web.Response(status=200)
