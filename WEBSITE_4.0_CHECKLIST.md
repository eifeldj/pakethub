
# PaketHub Website 4.0 – Release Checklist

## Build
- [ ] `mkdocs build --strict`
- [ ] `mkdocs serve`
- [ ] English homepage tested
- [ ] German homepage tested

## Visual
- [ ] Light mode checked
- [ ] Dark mode checked
- [ ] Desktop checked
- [ ] Tablet checked
- [ ] Mobile checked
- [ ] Interactive shipment filters checked
- [ ] Timeline demo checked
- [ ] Provider selector checked
- [ ] Copy button checked

## GitHub live data
- [ ] Release version loads
- [ ] GitHub star count loads
- [ ] Fallback text remains readable when API is unavailable

## SEO
- [ ] Social preview PNG exists at `docs/assets/social-preview.png`
- [ ] Open Graph preview tested
- [ ] Sitemap available
- [ ] robots.txt available
- [ ] 404 page tested

## Publish
- [ ] `git status`
- [ ] `git add -A`
- [ ] `git commit -m "feat: launch PaketHub website 4.0"`
- [ ] `git push origin main`
