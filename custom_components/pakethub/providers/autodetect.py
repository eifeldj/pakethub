"""Tracking-number based provider detection for PaketHub."""
from __future__ import annotations

import re

_UPS_PATTERN = re.compile(r"^1Z[0-9A-Z]{16}$", re.IGNORECASE)


def normalize_tracking_number(number: str) -> str:
    """Return a canonical tracking number without spaces or separators."""
    return re.sub(r"[\s-]+", "", number).upper()


def detect_provider_id(number: str) -> str | None:
    """Detect a direct tracking provider from a tracking number."""
    normalized = normalize_tracking_number(number)
    if _UPS_PATTERN.fullmatch(normalized):
        return "ups"
    return None
