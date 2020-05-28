import dataclasses
import html
import json
import pathlib
import typing

import srv


DEMO_POSTS_PATH = pathlib.Path(srv.__file__).parent.parent / 'static'


@dataclasses.dataclass
class Post:
    id: int
    data: 'PostData'
    date: float
    source_type: str
    tags: typing.List[str] = dataclasses.field(default_factory=list)
    deleted: bool = False

    def as_dict(self):
        data = dataclasses.asdict(self)
        del data['data']
        # todo: keys intersection
        data.update(self.data.as_dict())
        return data


class PostData:
    def as_dict(self) -> dict:
        raise NotImplementedError


@dataclasses.dataclass
class BasicData(PostData):
    author: str
    author_link: str
    original_url: str
    resource_url: str
    text: str

    def as_dict(self) -> dict:
        return dataclasses.asdict(self)


@dataclasses.dataclass
class RedditData(PostData):
    author: str
    author_link: str
    title: str
    original_url: str
    resource_url: str
    text: str
    subreddit: str
    avatar_url: str = (  # todo
        'https://www.redditstatic.com/avatars/avatar_default_12_A5A4A4.png'
    )

    def as_dict(self) -> dict:
        return dataclasses.asdict(self)


def _get_old_demo_post() -> Post:
    return Post(
        id=0,
        date=1572799821.0,
        tags=['rust', 'system programming', 'unix', 'github'],
        source_type='reddit',
        data=RedditData(
            author='CriticalComb',
            author_link='https://www.reddit.com/user/CriticalComb/',
            title='Writing a filesystem in Rust',
            original_url=(
                'https://www.reddit.com/r/rust/'
                'comments/dr31wj/writing_a_filesystem_in_rust'
            ),
            resource_url=(
                'https://www.reddit.com/r/rust/'
                'comments/dr31wj/writing_a_filesystem_in_rust'
            ),
            text=(
                '[https://github.com/andrewhalle/memfs]'
                '(https://github.com/andrewhalle/memfs)'
                '\n\nHi all,\n\nI\'ve been working on this '
                'little hobby project for a bit, and I feel '
                'like I\'ve gotten it to a point where I can '
                'share it. My goal was to implement a very '
                'simple filesystem in Rust, with directory '
                'structure and file contents all defined in '
                'code. I looked at '
                '[fuse](https://crates.io/crates/fuse), '
                'but decided I\'d rather write some FFI '
                'myself, so I used '
                '[bindgen](https://crates.io/crates/bindgen) '
                'to create bindings to libfuse '
                '(latest version) and wrote a wrapper '
                'on top of that (pretty unsafe, but at least '
                'all unsafe code is limited to the '
                '`fuse-sys` crate).\n\n'
                'I made heavy use of trait objects, '
                'defining traits for files, directories, '
                'and the whole filesystem, so that I could '
                'implement those traits in a separate crate '
                'without any unsafe code. I\'ve overused `clone()` '
                'in order to avoid dealing with lifetimes and stay '
                'mostly safe, accepting the performance cost '
                'for my small test. I\'d like to improve this '
                'in the future.\n\n'
                'Right now, you can `cargo run` '
                'in the workspace directory, which '
                'will start up the filesystem and mount '
                'it to `/tmp/memfs`, '
                '(hardcoded, will fix this in the future). '
                'CTRL-C-ing the running process will unmount '
                'the filesystem. `tree`, `ls`, and `cat` '
                'work for me (I\'m on Linux, '
                'latest libfuse3 required, so won\'t '
                'work on Mac without a VM).\n\n'
                'I\'m planning to write a blog post about '
                'this sometime soon, so I\'ll update this when '
                'I get there. Any feedback about the code is '
                'greatly appreciated!'
            ),
            subreddit='r/rust',
        ),
    )


def load_demo() -> typing.Dict[str, Post]:
    old_post = _get_old_demo_post()
    posts = {str(old_post.id): old_post}
    with open(DEMO_POSTS_PATH / 'posts.json') as fin:
        raw_saved = json.load(fin)
    for i, post in enumerate(raw_saved, start=1):
        source_type = post['source_type']
        if source_type == 'reddit':
            tags = [post['subreddit_name_prefixed'][2:]]
            if 'youtu' in post['url']:
                tags.append('2watch')
            posts[str(i)] = Post(
                id=i,
                date=post['created_utc'],
                tags=tags,
                source_type=source_type,
                data=RedditData(
                    author=post['author'],
                    author_link=(
                        f'https://www.reddit.com/user/{post["author"]}'
                    ),
                    title=html.unescape(post['title']),
                    original_url=f'https://www.reddit.com{post["permalink"]}',
                    resource_url=post['url'],
                    text=html.unescape(post['selftext']),
                    subreddit=post['subreddit_name_prefixed'],
                ),
            )
        elif source_type in ('telegram', 'twitter'):
            posts[str(i)] = Post(
                id=i,
                date=post['date'],
                source_type=source_type,
                data=BasicData(
                    author=post['author'],
                    author_link=post['author_link'],
                    original_url=post['permalink'],
                    resource_url=post['url'],
                    text=post['text'],
                ),
            )
        else:
            raise RuntimeError(f'unexpected source_type: {source_type}')
    return posts
