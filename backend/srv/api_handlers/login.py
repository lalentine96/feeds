from aiohttp import web


async def handler(request: web.Request) -> web.Response:
    data = await request.json()
    login, password = data.get('login'), data.get('password')
    if not (login or password):
        return web.json_response(
            {'error': 'login or password not provided'}, status=400,
        )
    if login != password:
        return web.json_response(
            {'error': 'incorrect login or password provided'}, status=400,
        )
    session = request.app['ctx'].session_manager.get_session_for_login(
        login=login,
    )
    print(session)
    return web.json_response(
        {'csrf_token': session.csrf_token, 'is_demo': True, 'login': login},
        status=200,
        headers={'Set-Cookie': f'feeds-session={session.sid}; HttpOnly;'},
    )
