import dataclasses
from typing import Optional


@dataclasses.dataclass
class RequestContext:
    # todo
    current_session: Optional[str]
