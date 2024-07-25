import uuid
from typing import List, Dict, Any, Union
from datetime import datetime

from . import constants

class Element:
    """Individual blocks of content that can be added to a document."""
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
            "bullet": False,
            "number": False,
            "indent": 0
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

class TextElement(Element):
    def __init__(self, content: str, stylelevel: int = 0):
        super().__init__("text", content)
        self.stylelevel = stylelevel


class Equation(Element):
    def __init__(self, content: str):
        super().__init__("equation", content)
    
class Hyperlink(Element):
    def __init__(self, content: str, url: Union[str, 'Element'] = None):
        super().__init__("hyperlink", content)
        if isinstance(url, str):
            self.url = url
        elif isinstance(url, Element):
            self.url = url.id
            
class PageBreak(Element):
    def __init__(self):
        super().__init__("page_break", None)

class Image(Element):
    def __init__(self, content, caption: str = None):
        super().__init__("image", content)
        self.caption = caption

class Table(Element):
    def __init__(self, rows: int, cols: int):
        super().__init__("table", [['' for _ in range(cols)] for _ in range(rows)])
        self.rows = rows
        self.cols = cols

    def set_cell(self, row: int, col: int, content: str):
        if 0 <= row < self.rows and 0 <= col < self.cols:
            self.content[row][col] = content

class Comment:
    def __init__(self, user: str, content: str, element_id: str):
        self.id = str(uuid.uuid4())
        self.user = user
        self.content = content
        self.element_id = element_id
        self.timestamp = datetime.now()

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "user": self.user,
            "content": self.content,
            "element_id": self.element_id,
            "timestamp": self.timestamp.isoformat()
        }

class Section:
    """A collection of elements that can be added to a document. Sections can be used to organize content, most commonly as subtopics."""
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
    
    def remove_element(self, index: int):
        del self.elements[index]
    
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
        self.comments: List[Comment] = []
        self.created_at = datetime.now()
        self.last_modified = self.created_at
        self.text_style_levels = constants.BASE_LEVEL_STYLE_MAP
        
    def to_columns(self, columns: int) -> List[List[Section]]:
        # Implementation for column layout
        pass
    
    def add_section(self, section: Section):
        self.sections.append(section)
        self.update_version()

    def remove_section(self, index: int):
        del self.sections[index]
        self.update_version()

    def add_comment(self, comment: Comment):
        self.comments.append(comment)

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "title": self.title,
            "version": self.version,
            "sections": [section.to_dict() for section in self.sections],
            "comments": [comment.to_dict() for comment in self.comments],
            "created_at": self.created_at.isoformat(),
            "last_modified": self.last_modified.isoformat()
        }
    
    def get_version(self) -> int:
        return self.version
      
    def update_version(self, amount: int = 1):
        self.version += amount
        self.last_modified = datetime.now()

class DocumentManager:
    def __init__(self):
        self.documents: Dict[str, Document] = {}

    def create_document(self, title: str) -> Document:
        document = Document(title)
        self.documents[document.id] = document
        return document

    def get_document(self, document_id: str) -> Union[Document, None]:
        return self.documents.get(document_id)

    def delete_document(self, document_id: str) -> bool:
        if document_id in self.documents:
            del self.documents[document_id]
            return True
        return False

    def list_documents(self) -> List[Dict[str, Any]]:
        return [{"id": doc.id, "title": doc.title, "last_modified": doc.last_modified} for doc in self.documents.values()]

class VersionControl:
    def __init__(self, document: Document):
        self.document = document
        self.history: List[Dict[str, Any]] = []

    def save_version(self):
        self.history.append(self.document.to_dict())

    def revert_to_version(self, version: int) -> bool:
        if 0 <= version < len(self.history):
            old_version = self.history[version]
            self.document.__dict__.update(old_version)
            return True
        return False

class Exporter:
    @staticmethod
    def to_html(document: Document) -> str:
        # Implementation for HTML export
        pass

    @staticmethod
    def to_pdf(document: Document) -> bytes:
        # Implementation for PDF export
        pass

    @staticmethod
    def to_plain_text(document: Document) -> str:
        # Implementation for plain text export
        pass