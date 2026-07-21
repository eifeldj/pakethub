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
    CONF_UPS_CLIENT_ID,
    CONF_UPS_CLIENT_SECRET,
    DEFAULT_SCAN_INTERVAL,
    DOMAIN,
    MAX_SCAN_INTERVAL,
    MIN_SCAN_INTERVAL,
)
from .providers import UpsAuthenticationError, UpsProvider, UpsProviderError


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
        """Manage options and optional native carrier credentials."""
        errors: dict[str, str] = {}

        if user_input is not None:
            scan_interval = int(user_input[CONF_SCAN_INTERVAL])
            ups_client_id = user_input.get(CONF_UPS_CLIENT_ID, "").strip()
            ups_client_secret = user_input.get(CONF_UPS_CLIENT_SECRET, "").strip()

            if bool(ups_client_id) != bool(ups_client_secret):
                errors["base"] = "ups_credentials_incomplete"
            elif ups_client_id and ups_client_secret:
                provider = UpsProvider(
                    async_get_clientsession(self.hass),
                    ups_client_id,
                    ups_client_secret,
                )
                try:
                    await provider.async_validate()
                except UpsAuthenticationError:
                    errors["base"] = "ups_invalid_auth"
                except UpsProviderError:
                    errors["base"] = "ups_cannot_connect"

            if not errors:
                return self.async_create_entry(
                    title="",
                    data={
                        CONF_SCAN_INTERVAL: scan_interval,
                        CONF_UPS_CLIENT_ID: ups_client_id,
                        CONF_UPS_CLIENT_SECRET: ups_client_secret,
                    },
                )

        current_interval = int(
            self.config_entry.options.get(
                CONF_SCAN_INTERVAL,
                DEFAULT_SCAN_INTERVAL,
            )
        )
        current_ups_client_id = str(
            self.config_entry.options.get(CONF_UPS_CLIENT_ID, "")
        )
        current_ups_client_secret = str(
            self.config_entry.options.get(CONF_UPS_CLIENT_SECRET, "")
        )

        defaults = user_input or {
            CONF_SCAN_INTERVAL: current_interval,
            CONF_UPS_CLIENT_ID: current_ups_client_id,
            CONF_UPS_CLIENT_SECRET: current_ups_client_secret,
        }

        return self.async_show_form(
            step_id="init",
            data_schema=vol.Schema(
                {
                    vol.Required(
                        CONF_SCAN_INTERVAL,
                        default=defaults.get(CONF_SCAN_INTERVAL, current_interval),
                    ): vol.All(
                        vol.Coerce(int),
                        vol.Range(
                            min=MIN_SCAN_INTERVAL,
                            max=MAX_SCAN_INTERVAL,
                        ),
                    ),
                    vol.Optional(
                        CONF_UPS_CLIENT_ID,
                        default=defaults.get(CONF_UPS_CLIENT_ID, ""),
                    ): str,
                    vol.Optional(
                        CONF_UPS_CLIENT_SECRET,
                        default=defaults.get(CONF_UPS_CLIENT_SECRET, ""),
                    ): str,
                }
            ),
            errors=errors,
        )
