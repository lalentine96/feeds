import logging
from typing import Iterable
from typing import List
from typing import Set

from aiohttp import web

from srv import posts
from srv import request as req
from srv import session_manager

logger = logging.getLogger(__name__)


@session_manager.check_session
async def handler(request: req.Request) -> web.Response:
    tags = request.raw.query.get('tags', '')
    parsed_tags: Set[str] = set()
    if tags:
        parsed_tags = set(tags.split(','))
    page_size = 5
    after = int(request.raw.query.get('after', 0))
    chunk: List[posts.Post] = _get_posts_after(
        all_posts=request.app.posts.values(),
        page_size=page_size,
        after=after,
        tags=parsed_tags,
    )
    logger.info(f'GOT CHUNK len %s after %s', len(chunk), after)
    return web.json_response({'posts': [post.as_dict() for post in chunk]})


def _get_posts_after(
        all_posts: Iterable[posts.Post],
        page_size: int,
        after: int,
        tags: Set[str],
) -> List[posts.Post]:
    chunk = []
    for post in all_posts:
        if post.id <= after:
            continue
        if not set(post.tags).issuperset(tags):
            continue
        if not post.deleted:
            chunk.append(post)
        if len(chunk) == page_size:
            break
    return chunk
