from aiohttp import web

from srv import session_manager
from srv import tags_index
from srv.data_providers import reddit


class App:
    def __init__(self) -> None:
        self.reddit_posts = reddit.load_demo()
        self.session_manager = session_manager.SessionManager()
        self.tags_index = tags_index.TagsIndex()
        for post in self.reddit_posts.values():
            for tag in post.tags:
                self.tags_index.add(tag)

    async def on_startup(self, app: web.Application) -> None:
        pass

    async def on_shutdown(self, app: web.Application) -> None:
        pass
