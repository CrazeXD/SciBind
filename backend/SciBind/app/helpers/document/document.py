import uuid
from typing import List, Dict, Any, Union
from datetime import datetime
import re

from . import constants


class Element:
    """Individual blocks of content that can be added to a document."""

    def __init__(self, element_type: str, content: Any):
        self.id = str(uuid.uuid4())
        self.type = element_type
        self.content = content
        self.styling: Dict[str, Any] = constants.DEFAULT_STYLING.copy()

    def modify_styling(self, styling: Dict[str, Any]):
        self.styling.update(styling)

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "type": self.type,
            "content": self.content,
            "styling": self.styling,
        }


class TextElement(Element):
    def __init__(self, content: str, stylelevel: int = 0):
        super().__init__("text", content)
        self.stylelevel = stylelevel

    def to_dict(self) -> Dict[str, Any]:
        dict_repr = super().to_dict()
        dict_repr["stylelevel"] = self.stylelevel
        return dict_repr


class Equation(Element):
    def __init__(self, content: str, inline: bool = False):
        super().__init__("equation", content)
        self.inline = inline
        self.latex = content

    def render_latex(self) -> str:
        # This method would be implemented on the client-side
        # Here we just return the LaTeX string
        return self.latex

    def to_dict(self) -> Dict[str, Any]:
        dict_repr = super().to_dict()
        dict_repr["inline"] = self.inline
        dict_repr["latex"] = self.latex
        return dict_repr


class Hyperlink(Element):
    def __init__(self, content: str, url: Union[str, "Element"] = None):
        super().__init__("hyperlink", content)
        if isinstance(url, str):
            self.url = url
        elif isinstance(url, Element):
            self.url = url.id

    def to_dict(self) -> Dict[str, Any]:
        dict_repr = super().to_dict()
        dict_repr["url"] = self.url
        return dict_repr


class PageBreak(Element):
    def __init__(self):
        super().__init__("page_break", None)


class Image(Element):
    def __init__(self, content, caption: str = None, alt_text: str = None):
        super().__init__("image", content)
        self.caption = caption
        self.alt_text = alt_text

    def to_dict(self) -> Dict[str, Any]:
        dict_repr = super().to_dict()
        dict_repr["caption"] = self.caption
        dict_repr["alt_text"] = self.alt_text
        return dict_repr


class Table(Element):
    def __init__(self, rows: int, cols: int):
        super().__init__("table", [["" for _ in range(cols)] for _ in range(rows)])
        self.rows = rows
        self.cols = cols

    def set_cell(self, row: int, col: int, content: str):
        if 0 <= row < self.rows and 0 <= col < self.cols:
            self.content[row][col] = content

    def to_dict(self) -> Dict[str, Any]:
        dict_repr = super().to_dict()
        dict_repr["rows"] = self.rows
        dict_repr["cols"] = self.cols
        return dict_repr


class Comment:
    def __init__(self, user: str, content: str, element_id: str):
        self.id = str(uuid.uuid4())
        self.user = user
        self.content = content
        self.element_id = element_id
        self.timestamp = datetime.now()
        self.replies: List["Comment"] = []

    def add_reply(self, reply: "Comment"):
        self.replies.append(reply)

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "user": self.user,
            "content": self.content,
            "element_id": self.element_id,
            "timestamp": self.timestamp.isoformat(),
            "replies": [reply.to_dict() for reply in self.replies],
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
            "elements": [element.to_dict() for element in self.elements],
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
        self.collaborators: List[str] = []
        self.tags: List[str] = []

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

    def add_collaborator(self, user: str):
        if user not in self.collaborators:
            self.collaborators.append(user)

    def remove_collaborator(self, user: str):
        if user in self.collaborators:
            self.collaborators.remove(user)

    def add_tag(self, tag: str):
        if tag not in self.tags:
            self.tags.append(tag)

    def remove_tag(self, tag: str):
        if tag in self.tags:
            self.tags.remove(tag)

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "title": self.title,
            "version": self.version,
            "sections": [section.to_dict() for section in self.sections],
            "comments": [comment.to_dict() for comment in self.comments],
            "created_at": self.created_at.isoformat(),
            "last_modified": self.last_modified.isoformat(),
            "collaborators": self.collaborators,
            "tags": self.tags,
        }

    def get_version(self) -> int:
        return self.version

    def update_version(self, amount: int = 1):
        self.version += amount
        self.last_modified = datetime.now()

    def search(self, query: str) -> List[Dict[str, Any]]:
        results = []
        for section in self.sections:
            for element in section.elements:
                if (
                    isinstance(element, TextElement)
                    and query.lower() in element.content.lower()
                ):
                    results.append(
                        {
                            "section_id": section.id,
                            "element_id": element.id,
                            "content": element.content,
                            "type": "text",
                        }
                    )
                elif (
                    isinstance(element, Equation)
                    and query.lower() in element.latex.lower()
                ):
                    results.append(
                        {
                            "section_id": section.id,
                            "element_id": element.id,
                            "content": element.latex,
                            "type": "equation",
                        }
                    )
        return results


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
        return [
            {
                "id": doc.id,
                "title": doc.title,
                "last_modified": doc.last_modified,
                "tags": doc.tags,
            }
            for doc in self.documents.values()
        ]

    def search_documents(self, query: str) -> List[Dict[str, Any]]:
        results = []
        for doc in self.documents.values():
            if doc_results := doc.search(query):
                results.append(
                    {
                        "document_id": doc.id,
                        "document_title": doc.title,
                        "results": doc_results,
                    }
                )
        return results


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

    def get_diff(self, version1: int, version2: int) -> Dict[str, Any]:
        # Implementation for diff between two versions
        pass


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

    @staticmethod
    def to_markdown(document: Document) -> str:
        # Implementation for Markdown export
        pass
