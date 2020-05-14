import dataclasses
import logging
import secrets
import typing

from aiohttp import web

logger = logging.getLogger(__name__)

CSRF_TOKEN_HEADER = 'X-CSRF-Token'


@dataclasses.dataclass(frozen=True)
class Session:
    sid: str
    csrf_token: str
    # login: str

    @classmethod
    def new(cls):
        return cls(sid=secrets.token_hex(32), csrf_token=secrets.token_hex(32))


class SessionManager:
    def __init__(self) -> None:
        self._sessions_by_login: typing.Dict[str, Session] = {}
        self._sessions_by_sid: typing.Dict[str, Session] = {}
        self._logins_by_session: typing.Dict[Session, str] = {}

    def get_session_for_login(self, login: str) -> Session:
        if login in self._sessions_by_login:
            return self._sessions_by_login[login]
        session = self._sessions_by_login[login] = Session.new()
        self._logins_by_session[session] = login
        self._sessions_by_sid[session.sid] = session
        return session

    def get_login_for_sid(self, sid: str) -> typing.Optional[str]:
        session = self._sessions_by_sid.get(sid)
        if not session:
            return None
        return self._logins_by_session.get(session)

    def delete_session(self, sid: str) -> None:
        session = self._sessions_by_sid.pop(sid)
        login = self._logins_by_session.pop(session)
        self._sessions_by_login.pop(login)


def check_session(handler):
    handler.session_check = True
    return handler


@web.middleware
async def session_check_middleware(
        request: web.Request, handler,
) -> web.Response:
    if not getattr(handler, 'session_check', False):
        return await handler(request)
    sid = request.cookies.get(
        'feeds-session',
    )  # todo: this is external knowledge

    if sid is None:
        logger.info('session cookie is missing or empty')
        return _error_response()
    print(sid)
    session_manager: SessionManager = request.app['ctx'].session_manager

    login = session_manager.get_login_for_sid(sid)
    if login is None:
        logger.info('login not found for session cookie')
        return _error_response()

    session = session_manager.get_session_for_login(login)
    csrf_token = request.headers.get(CSRF_TOKEN_HEADER)

    if not csrf_token:
        logger.info('csrf token is missing or empty')
        return _error_response()

    if not secrets.compare_digest(session.csrf_token, csrf_token):
        logger.info('csrf token mismatch')
        return _error_response()

    return await handler(request)


def _error_response() -> web.Response:
    return web.json_response({'error': 'no auth provided'}, status=401)
