from typing import Dict, Any

DEFAULT_STYLING: Dict[str, Any] = {
    "bold": False,
    "italic": False,
    "underline": False,
    "color": "black",
    "alignment": "left",
    "font": "Arial",
    "size": 12,
    "highlight": "none",
    "bullet": False,
    "number": False,
    "indent": 0
}

BASE_LEVEL_STYLE_MAP = {
    level: {tag: DEFAULT_STYLING.copy()} 
    for level, tag in enumerate(["p", "h1", "h2", "h3", "h4", "title", "subtitle"])
    # Reference: 0 -> p, 1 -> h1, 2 -> h2, 3 -> h3, 4 -> h4, 5 -> title, 6 -> subtitle
}
