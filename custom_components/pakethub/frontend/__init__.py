"""Frontend registration for PaketHub."""
from __future__ import annotations

import logging
from pathlib import Path
from typing import Any

from homeassistant.components.http import StaticPathConfig
from homeassistant.core import HomeAssistant
from homeassistant.helpers.event import async_call_later

_LOGGER = logging.getLogger(__name__)

CARD_URL_BASE = "/pakethub"
CARD_FILENAME = "pakethub-card.js"
CARD_VERSION = "1.3.1"
CARD_URL = f"{CARD_URL_BASE}/{CARD_FILENAME}?v={CARD_VERSION}"


async def async_register_frontend(hass: HomeAssistant) -> None:
    """Expose and, where possible, register the PaketHub card."""
    frontend_path = Path(__file__).parent
    try:
        await hass.http.async_register_static_paths(
            [StaticPathConfig(CARD_URL_BASE, str(frontend_path), True)]
        )
    except RuntimeError:
        _LOGGER.debug("PaketHub frontend path is already registered")

    lovelace = hass.data.get("lovelace")
    if lovelace is None:
        _LOGGER.debug("Lovelace is not available; card resource can be added manually")
        return

    mode = getattr(lovelace, "resource_mode", getattr(lovelace, "mode", "yaml"))
    if mode != "storage":
        _LOGGER.info(
            "PaketHub card is available at %s; Lovelace YAML mode requires manual resource registration",
            CARD_URL,
        )
        return

    async def _try_register(_now: Any = None) -> None:
        resources = getattr(lovelace, "resources", None)
        if resources is None or not getattr(resources, "loaded", False):
            async_call_later(hass, 5, _try_register)
            return

        existing = None
        for item in resources.async_items():
            url = item.get("url", "")
            if url.split("?", 1)[0] == f"{CARD_URL_BASE}/{CARD_FILENAME}":
                existing = item
                break

        try:
            if existing is None:
                await resources.async_create_item({"res_type": "module", "url": CARD_URL})
                _LOGGER.info("Registered PaketHub dashboard card resource")
            elif existing.get("url") != CARD_URL:
                await resources.async_update_item(
                    existing["id"], {"res_type": "module", "url": CARD_URL}
                )
                _LOGGER.info("Updated PaketHub dashboard card resource")
        except (KeyError, TypeError, ValueError) as err:
            _LOGGER.warning("Could not automatically register PaketHub card: %s", err)

    await _try_register()
