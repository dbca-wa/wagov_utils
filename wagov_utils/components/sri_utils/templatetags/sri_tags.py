from wagov_utils.components.sri_utils.sri_utils import lookup_hash
from django.template import Library

register = Library()

@register.simple_tag()
def SRI_HASH(file):
    return lookup_hash(file)