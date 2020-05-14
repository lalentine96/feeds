from aiohttp import web
import aiohttp_cors

from srv import api_handlers
from srv import session_manager


def setup_routes(
        cors: aiohttp_cors.CorsConfig,
        app: web.Application,
        client_origin='http://localhost:3000',
):
    def _add_route(method: str, path: str, module):
        cors.add(
            app.router.add_route(method, path, module.handler),
            {
                client_origin: aiohttp_cors.ResourceOptions(
                    allow_credentials=True,
                    allow_headers=(
                        'Content-Type',
                        session_manager.CSRF_TOKEN_HEADER,
                    ),
                    max_age=3600,
                ),
            },
        )

    _add_route('GET', '/api/data', api_handlers.get_data)
    _add_route('DELETE', '/api/data', api_handlers.delete_data)
    _add_route('POST', '/api/data/reset-demo', api_handlers.reset_demo)
    _add_route('POST', '/api/data/restore', api_handlers.restore_data)
    _add_route('POST', '/api/data/tag', api_handlers.add_tag)
    _add_route('POST', '/api/data/tag/delete', api_handlers.delete_tag)
    _add_route('POST', '/api/login', api_handlers.login)
    _add_route('POST', '/api/logout', api_handlers.logout)
    _add_route('GET', '/api/whoami', api_handlers.who_am_i)
    _add_route('GET', '/api/tags/suggest', api_handlers.tags_suggest)
