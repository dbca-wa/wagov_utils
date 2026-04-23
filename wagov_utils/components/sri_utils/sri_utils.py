import hashlib
from django.conf import settings
import os
from confy import env

import logging
logger = logging.getLogger(__name__)

ENABLE_SRI_CHECK = env("ENABLE_SRI_CHECK", False)
SRI_FILE_STRUCTURE_DIR = os.path.join(settings.BASE_DIR, "sri-files")
ERROR_HASH = "sha384-0"
def lookup_hash(filename):

    if not ENABLE_SRI_CHECK:
        return None

    try:
        if not filename:
            logger.error("No filename provided for hash lookup.")
            return ERROR_HASH

        hashed_filename = hashlib.sha256(filename.encode()).hexdigest()
        hashed_dir = hashed_filename[:2]

        check_file_path = os.path.join(SRI_FILE_STRUCTURE_DIR, hashed_dir, hashed_filename)
        
        with open(check_file_path, "r") as f:
            hash = f.readline()

        return hash
    except Exception as e:
        logger.error(e)
        return ERROR_HASH