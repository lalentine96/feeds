from aiohttp import web


async def handler(request: web.Request) -> web.Response:
    login = None
    sid = request.cookies.get('feeds-session')
    # todo: pass login and session with request
    if not sid:
        return web.json_response({'login': login})

    session_manager = request.app['ctx'].session_manager
    login = session_manager.get_login_for_sid(sid=sid)
    session = session_manager.get_session_for_login(login)
    return web.json_response(
        {'login': login, 'csrf_token': session.csrf_token, 'is_demo': True},
    )
