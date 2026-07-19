"""Config flow for PaketHub."""
from __future__ import annotations

from typing import Any

import voluptuous as vol

from homeassistant.config_entries import ConfigFlow, ConfigFlowResult, OptionsFlow
from homeassistant.core import callback
from homeassistant.helpers.aiohttp_client import async_get_clientsession

from .api import (
    PaketHubApi,
    PaketHubApiError,
    PaketHubAuthenticationError,
)
from .const import (
    CONF_API_KEY,
    CONF_SCAN_INTERVAL,
    DEFAULT_SCAN_INTERVAL,
    DOMAIN,
    MAX_SCAN_INTERVAL,
    MIN_SCAN_INTERVAL,
)


class PaketHubConfigFlow(ConfigFlow, domain=DOMAIN):
    """Handle a config flow for PaketHub."""

    VERSION = 1

    async def async_step_user(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """Handle the initial step."""
        errors: dict[str, str] = {}

        if user_input is not None:
            api_key = user_input[CONF_API_KEY].strip()
            api = PaketHubApi(async_get_clientsession(self.hass), api_key)

            try:
                await api.async_validate()
            except PaketHubAuthenticationError:
                errors["base"] = "invalid_auth"
            except PaketHubApiError:
                errors["base"] = "cannot_connect"
            else:
                await self.async_set_unique_id("17track_api")
                self._abort_if_unique_id_configured()
                return self.async_create_entry(
                    title="PaketHub",
                    data={CONF_API_KEY: api_key},
                )

        schema = vol.Schema(
            {
                vol.Required(CONF_API_KEY): str,
            }
        )
        return self.async_show_form(
            step_id="user",
            data_schema=schema,
            errors=errors,
        )

    @staticmethod
    @callback
    def async_get_options_flow(config_entry):
        """Return the options flow."""
        return PaketHubOptionsFlow()


class PaketHubOptionsFlow(OptionsFlow):
    """Handle PaketHub options."""

    async def async_step_init(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """Manage options."""
        if user_input is not None:
            return self.async_create_entry(title="", data=user_input)

        current = int(
            self.config_entry.options.get(
                CONF_SCAN_INTERVAL,
                DEFAULT_SCAN_INTERVAL,
            )
        )
        return self.async_show_form(
            step_id="init",
            data_schema=vol.Schema(
                {
                    vol.Required(
                        CONF_SCAN_INTERVAL,
                        default=current,
                    ): vol.All(
                        vol.Coerce(int),
                        vol.Range(
                            min=MIN_SCAN_INTERVAL,
                            max=MAX_SCAN_INTERVAL,
                        ),
                    )
                }
            ),
        )
