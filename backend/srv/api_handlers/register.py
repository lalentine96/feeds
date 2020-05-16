from aiohttp import web

from srv import app


async def handler(request: web.Request) -> web.Response:
    ctx: app.App = request.app['ctx']
    data = await request.json()
    login, password = data.get('login'), data.get('password')
    try:
        ctx.users_storage.add_user(login, password)
    except ValueError as exc:
        return web.json_response({'error': str(exc)}, status=400)
    session = ctx.session_manager.get_session_for_login(
        login=login,
    )
    return web.json_response(
        {'csrf_token': session.csrf_token, 'is_demo': True, 'login': login},
        status=200,
        headers={'Set-Cookie': f'feeds-session={session.sid}; HttpOnly;'},
    )
