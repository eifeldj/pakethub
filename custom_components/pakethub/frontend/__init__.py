"""Frontend registration for PaketHub."""
from __future__ import annotations

import json
import logging
from pathlib import Path
from typing import Any

from homeassistant.components.http import StaticPathConfig
from homeassistant.core import HomeAssistant
from homeassistant.helpers.event import async_call_later

_LOGGER = logging.getLogger(__name__)
CARD_URL_BASE = "/pakethub"
CARD_FILENAME = "pakethub-card.js"


def _integration_version() -> str:
    try:
        manifest = json.loads(
            (Path(__file__).parent.parent / "manifest.json").read_text(encoding="utf-8")
        )
    except (OSError, ValueError, TypeError):
        return "unknown"
    return str(manifest.get("version", "unknown"))


async def async_register_frontend(hass: HomeAssistant) -> None:
    frontend_path = Path(__file__).parent
    card_url = f"{CARD_URL_BASE}/{CARD_FILENAME}?v={_integration_version()}"

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
            card_url,
        )
        return

    async def _try_register(_now: Any = None) -> None:
        resources = getattr(lovelace, "resources", None)
        if resources is None or not getattr(resources, "loaded", False):
            async_call_later(hass, 5, _try_register)
            return

        existing = next(
            (
                item
                for item in resources.async_items()
                if item.get("url", "").split("?", 1)[0]
                == f"{CARD_URL_BASE}/{CARD_FILENAME}"
            ),
            None,
        )

        try:
            if existing is None:
                await resources.async_create_item(
                    {"res_type": "module", "url": card_url}
                )
                _LOGGER.info("Registered PaketHub dashboard card resource %s", card_url)
            elif existing.get("url") != card_url:
                await resources.async_update_item(
                    existing["id"], {"res_type": "module", "url": card_url}
                )
                _LOGGER.info("Updated PaketHub dashboard card resource to %s", card_url)
        except (KeyError, TypeError, ValueError) as err:
            _LOGGER.warning("Could not automatically register PaketHub card: %s", err)

    await _try_register()
