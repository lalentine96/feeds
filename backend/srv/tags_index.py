import dataclasses

import pygtrie


@dataclasses.dataclass
class Entry:
    tag: str
    count: int = 0


class TagsIndex:
    def __init__(self):
        self.trie = pygtrie.CharTrie()

    def add(self, key: str) -> None:
        self.trie.setdefault(key, Entry(key)).count += 1

    def delete(self, key: str) -> None:
        entry = self.trie.get(key)
        if not entry:
            return
        if entry.count == 1:
            self.trie.pop(key)
        else:
            entry.count -= 1

    def get(self, prefix: str):
        return (entry.tag for entry in self.trie[prefix:])
