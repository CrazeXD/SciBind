from odfdo import *

def create_document(title: str):
    """
    Create a new ODF document.
    """
    doc = Document('text')
    doc.meta.title = 'str'
    