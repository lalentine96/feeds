import dataclasses
import json
import pathlib
import typing
import html

import srv

DEMO_POSTS_PATH = pathlib.Path(srv.__file__).parent.parent / 'static'


@dataclasses.dataclass
class RedditPost:
    id: int
    author: str
    author_link: str
    title: str
    original_url: str
    resource_url: str
    text: str
    date: float
    subreddit: str
    avatar_url: str = (  # todo
        'https://www.redditstatic.com/' 'avatars/avatar_default_12_A5A4A4.png'
    )
    source_type: str = 'reddit'
    tags: typing.List[str] = dataclasses.field(default_factory=list)
    deleted: bool = False


def _get_old_demo_post() -> RedditPost:
    return RedditPost(
        id=0,
        author='CriticalComb',
        author_link='https://www.reddit.com/user/CriticalComb/',
        title='Writing a filesystem in Rust',
        original_url='https://www.reddit.com/r/rust/comments/dr31wj/writing_a_filesystem_in_rust',
        resource_url='https://www.reddit.com/r/rust/comments/dr31wj/writing_a_filesystem_in_rust',
        text="""[https://github.com/andrewhalle/memfs](https://github.com/andrewhalle/memfs)\n\nHi all,\n\nI've been working on this little hobby project for a bit, and I feel like I've gotten it to a point where I can share it. My goal was to implement a very simple filesystem in Rust, with directory structure and file contents all defined in code. I looked at [fuse](https://crates.io/crates/fuse), but decided I'd rather write some FFI myself, so I used [bindgen](https://crates.io/crates/bindgen) to create bindings to libfuse (latest version) and wrote a wrapper on top of that (pretty unsafe, but at least all unsafe code is limited to the `fuse-sys` crate).\n\nI made heavy use of trait objects, defining traits for files, directories, and the whole filesystem, so that I could implement those traits in a separate crate without any unsafe code. I've overused `clone()` in order to avoid dealing with lifetimes and stay mostly safe, accepting the performance cost for my small test. I'd like to improve this in the future.\n\nRight now, you can `cargo run` in the workspace directory, which will start up the filesystem and mount it to `/tmp/memfs`, (hardcoded, will fix this in the future). CTRL-C-ing the running process will unmount the filesystem. `tree`, `ls`, and `cat` work for me (I'm on Linux, latest libfuse3 required, so won't work on Mac without a VM).\n\nI'm planning to write a blog post about this sometime soon, so I'll update this when I get there. Any feedback about the code is greatly appreciated!""",
        date=1572799821.0,
        tags=['rust', 'system programming', 'unix', 'github'],
        subreddit='r/rust',
    )


def load_demo() -> typing.Dict[str, RedditPost]:
    old_post = _get_old_demo_post()
    posts = {str(old_post.id): old_post}

    with open(DEMO_POSTS_PATH / 'reddit_saved.json') as fin:
        raw_saved = json.load(fin)['data']['children']
    for i, post in enumerate(raw_saved, start=1):
        data = post['data']
        tags = [data['subreddit_name_prefixed'][2:]]
        if 'youtu' in data['url']:
            tags.append('2watch')
        posts[str(i)] = RedditPost(
            id=i,
            author=data['author'],
            author_link=f'https://www.reddit.com/user/{data["author"]}',
            title=html.unescape(data['title']),
            original_url=f'https://www.reddit.com{data["permalink"]}',
            resource_url=data['url'],
            text=html.unescape(data['selftext']),
            date=data['created_utc'],
            tags=tags,
            subreddit=data['subreddit_name_prefixed'],
        )
    return posts
