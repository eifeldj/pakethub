"""Constants for PaketHub."""
from datetime import timedelta

DOMAIN = "pakethub"

CONF_API_KEY = "api_key"
CONF_SCAN_INTERVAL = "scan_interval"

DEFAULT_SCAN_INTERVAL = 10
MIN_SCAN_INTERVAL = 5
MAX_SCAN_INTERVAL = 120

API_BASE_URL = "https://api.17track.net/track/v2.4"
API_PAGE_SIZE = 40
UPDATE_INTERVAL = timedelta(minutes=DEFAULT_SCAN_INTERVAL)

SERVICE_ADD_PACKAGE = "add_package"
SERVICE_REMOVE_PACKAGE = "remove_package"
SERVICE_REFRESH = "refresh"
SERVICE_RENAME_PACKAGE = "rename_package"

ATTR_TRACKING_NUMBER = "tracking_number"
ATTR_PACKAGE_NAME = "package_name"
ATTR_CARRIER = "carrier"

CENTRAL_DEVICE_IDENTIFIER = "pakethub"
