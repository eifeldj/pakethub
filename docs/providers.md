# Providers

PaketHub separates shipment registration from native tracking.

## Registry provider

17TRACK is responsible for shipment registration and acts as the fallback tracking provider.

## Native providers

Native providers retrieve carrier-specific tracking data. PaketHub 2.5 includes native UPS support.

## Fallback

When a native provider cannot return usable data, PaketHub automatically falls back to 17TRACK.

| Provider | Purpose | Status |
| --- | --- | --- |
| 17TRACK | Registry and fallback | Supported |
| UPS | Native tracking | Supported |
