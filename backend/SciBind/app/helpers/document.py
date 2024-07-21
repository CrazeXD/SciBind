import uuid
from typing import List, Dict, Any

class Element:
    def __init__(self, element_type: str, content: Any):
        self.id = str(uuid.uuid4())
        self.type = element_type
        self.content = content
        self.styling: Dict[str, Any] = {
            "bold": False,
            "italic": False,
            "underline": False,
            "color": "black",
            "alignment": "left",
            "font": "Arial",
            "size": 12,
            "highlight": "none",
            "bullet": False, # Could be an integer to represent the level of indentation
            "number": False, # Could be an integer to represent the level of indentation
            "indent": 0 # Could be an integer to represent the level of indentation
        }
        
    def modify_styling(self, styling: Dict[str, Any]):
        self.styling.update(styling)
    
    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "type": self.type,
            "content": self.content,
            "styling": self.styling
        }

class Equation(Element):
    def __init__(self, content: str):
        super().__init__("equation", content)
    
class Hyperlink(Element):
    def __init__(self, content: str, url = None):
        super().__init__("hyperlink", content)
        if type(url) == str:
            self.url = url
        elif url.issubclass(Element):
            self.url = url.id
        else:
            self.url = None
    
class Section:
    def __init__(self, title: str, elements: List[Element] = None):
        self.id = str(uuid.uuid4())
        self.title = title
        self.elements = elements or []

    def add_element(self, element: Element):
        self.elements.append(element)
        
    def insert_element(self, element: Element, index: int):
        self.elements.insert(index, element)
    
    def modify_element(self, element: Element, index: int):
        self.elements[index] = element
    
    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "title": self.title,
            "elements": [element.to_dict() for element in self.elements]
        }

class Document:
    def __init__(self, title: str, sections: List[Section] = None):
        self.id = str(uuid.uuid4())
        self.title = title
        self.sections = sections or []
        self.version = 1

    def add_section(self, section: Section):
        self.sections.append(section)

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "title": self.title,
            "version": self.version,
            "sections": [section.to_dict() for section in self.sections]
        }
    
    def get_version(self) -> int:
        return self.version
      
    def update_version(self, amount: int = 1):
        self.version += amount