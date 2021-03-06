from aiohttp import web

from srv import app
from srv import request as req


async def handler(request: req.Request) -> web.Response:
    ctx: app.App = request.app
    data = await request.raw.json()
    login, password = data.get('login'), data.get('password')
    if not (login or password):
        return web.json_response(
            {'error': 'login or password not provided'}, status=400,
        )
    if not ctx.users_storage.check_user(login, password):
        return web.json_response(
            {'error': 'incorrect login or password provided'}, status=400,
        )
    session = ctx.session_manager.get_session_for_login(login=login)
    return web.json_response(
        {'csrf_token': session.csrf_token, 'is_demo': True, 'login': login},
        status=200,
        headers={'Set-Cookie': f'feeds-session={session.sid}; HttpOnly;'},
    )
