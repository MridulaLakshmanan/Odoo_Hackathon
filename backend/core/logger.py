import logging

from backend.config import settings


def configure_logging() -> logging.Logger:
    logger = logging.getLogger("assetflow")
    if not logger.handlers:
        handler = logging.StreamHandler()
        handler.setFormatter(
            logging.Formatter("%(asctime)s [%(levelname)s] %(name)s - %(message)s")
        )
        logger.addHandler(handler)
    logger.setLevel(settings.log_level)
    logger.propagate = False
    return logger


logger = configure_logging()
