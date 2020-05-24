import typing

from aiohttp import web

from srv import app as _app


class Request:
    def __init__(
            self,
            raw_request: web.Request,
            app: _app.App,
            context=None,  # todo: annotate context
    ) -> None:
        self.raw = raw_request
        self.app = app
        self.context = context


@web.middleware
async def wrapping_middleware(request: web.Request, handler: typing.Callable):
    return await handler(Request(raw_request=request, app=request.app['ctx']))
