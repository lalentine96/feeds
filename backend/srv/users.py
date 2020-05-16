from typing import Dict


class Storage:
    def __init__(self) -> None:
        self._passwords: Dict[str, str] = {}

    def add_user(self, login: str, password: str) -> None:
        if not login:
            raise ValueError('login must no be empty')
        if not password:
            raise ValueError('password must not be empty')
        if login in self._passwords:
            raise ValueError('user already exists')
        self._passwords[login] = password

    def check_user(self, login: str, password: str) -> bool:
        check_password = self._passwords.get(login)
        if not check_password:
            return False
        return password == check_password


def demo_storage() -> Storage:
    storage = Storage()
    storage.add_user('demo', 'demo')
    return storage
