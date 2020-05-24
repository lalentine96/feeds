import logging

from aiohttp import web
import aiohttp_cors

from srv import app
from srv import request
from srv import routes
from srv import session_manager


def main():
    logging.basicConfig(level=logging.DEBUG)
    web_app = web.Application(
        middlewares=[
            session_manager.session_check_middleware,
            request.wrapping_middleware,
        ],
    )
    cors = aiohttp_cors.setup(web_app)
    web_app['ctx'] = ctx = app.App()
    web_app.on_startup.append(ctx.on_startup)
    web_app.on_shutdown.append(ctx.on_shutdown)
    routes.setup_routes(cors, web_app)
    web.run_app(web_app)


if __name__ == '__main__':
    main()
