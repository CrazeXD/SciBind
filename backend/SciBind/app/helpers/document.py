import uuid
from typing import List, Dict, Any

class Element:
    def __init__(self, element_type: str, content: Any, level: int = 0):
        self.id = str(uuid.uuid4())
        self.type = element_type
        self.content = content
        self.level: int = level
        self.styling: Dict[str, Any] = {
            "bold": False,
            "italic": False,
            "underline": False,
            "color": None,
        }

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "type": self.type,
            "content": self.content
        }

class Equation(Element):
    def __init__(self, content: str, level: int = 0):
        super().__init__("equation", content, level = level)
    
class Hyperlink(Element):
    def __init__(self, content: str, level: int = 0, url = None):
        super().__init__("hyperlink", content, level = level)
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

    def update_version(self):
        self.version += 1

# Example usage
if __name__ == "__main__":
    # Create a document
    doc = Document("Physics Cheat Sheet")

    # Create a section
    mechanics_section = Section("Classical Mechanics")

    # Add elements to the section
    mechanics_section.add_element(Element("text", "Newton's Laws of Motion:"))
    mechanics_section.add_element(Element("formula", "F = ma"))
    mechanics_section.add_element(Element("text", "1. An object at rest stays at rest, and an object in motion stays in motion..."))

    # Add the section to the document
    doc.add_section(mechanics_section)

    # Print the document structure
    import json
    print(json.dumps(doc.to_dict(), indent=2))