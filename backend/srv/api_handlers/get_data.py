import dataclasses
import logging
from typing import List
from typing import Iterable
from typing import Set

from aiohttp import web

from srv import session_manager
from srv.data_providers import reddit

logger = logging.getLogger(__name__)


@session_manager.check_session
async def handler(request: web.Request) -> web.Response:
    tags = request.query.get('tags', '')
    parsed_tags: Set[str] = set()
    if tags:
        parsed_tags = set(tags.split(','))
    page_size = 5
    if 'page' in request.query:
        page = int(request.query.get('page', '1'))
        if page < 1:
            return web.json_response(
                {'error': 'page must be >= 1'}, status=400,
            )
        chunk: List[reddit.RedditPost] = _get_posts(
            all_posts=request.app['ctx'].reddit_posts.values(),
            page_size=page_size,
            page_num=page,
            tags=parsed_tags,
        )
        logger.info(
            f'GOT CHUNK len {len(chunk)} for page {page}',
        )  # todo: no f-strings
    else:
        after = int(request.query.get('after', 0))
        chunk: List[reddit.RedditPost] = _get_posts_after(
            all_posts=request.app['ctx'].reddit_posts.values(),
            page_size=page_size,
            after=after,
            tags=parsed_tags,
        )
        logger.info(
            f'GOT CHUNK len {len(chunk)} after {after}',
        )  # todo: no f-strings
    return web.json_response(
        {'posts': [dataclasses.asdict(post) for post in chunk]},
    )


def _get_posts(
        all_posts: Iterable[reddit.RedditPost],
        page_size: int,
        page_num: int,
        tags: Set[str],
) -> List[reddit.RedditPost]:
    chunk = []
    to_skip = page_size * (page_num - 1)
    for post in all_posts:
        if not set(post.tags).issuperset(tags):
            continue
        if to_skip > 0:
            if not post.deleted:
                to_skip -= 1
                continue
        if not post.deleted:
            chunk.append(post)
        if len(chunk) == page_size:
            break
    return chunk


def _get_posts_after(
        all_posts: Iterable[reddit.RedditPost],
        page_size: int,
        after: int,
        tags: Set[str],
) -> List[reddit.RedditPost]:
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
