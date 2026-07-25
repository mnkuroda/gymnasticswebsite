# Young's Gym — Modern Website Recreation

A modern, responsive redesign of [youngsgym.com](https://youngsgym.com/) built with vanilla HTML, CSS, and JavaScript. Created as a portfolio project demonstrating front-end design and development skills.

**Live site:** [https://mnkuroda.github.io/gymnasticswebsite/](https://mnkuroda.github.io/gymnasticswebsite/)

> This is a design recreation for portfolio purposes and is not affiliated with Young's Gym.

## Pages

| Page | Description |
|------|-------------|
| Home | Hero, programs overview, mission, benefits |
| Classes | Class list, benefits, owner message |
| Camps | Summer camp schedule, day camp info |
| Parties | Birthday party packages and pricing |
| Team | Competitive USAG Xcel program |
| Our Story | Gym history, owners, staff credentials |
| Contact | Location, phone, email, contact form |

## Tech stack

- Semantic HTML5
- CSS custom properties, Grid, Flexbox
- Vanilla JavaScript (mobile nav, form demo)
- Google Fonts (Bebas Neue + Plus Jakarta Sans)
- Unsplash images (placeholder photography)

## Local development

No build step required. Open `index.html` in a browser, or serve locally:

```bash
# Python
python -m http.server 8080

# Node (if npx available)
npx serve .
```

Then visit `http://localhost:8080`.

## Deploy to GitHub Pages

1. Push this repo to `github.com/mnkuroda/gymnasticswebsite`
2. Go to **Settings → Pages**
3. Under **Build and deployment**, set Source to **Deploy from a branch**
4. Select branch `main` and folder `/ (root)`
5. Save — your site will be live at `https://mnkuroda.github.io/gymnasticswebsite/`

## Project structure

```
gymnasticswebsite/
├── index.html
├── classes.html
├── camps.html
├── parties.html
├── team.html
├── history.html
├── contact.html
├── css/
│   └── styles.css
├── js/
│   └── main.js
└── README.md
```

## License

Content inspired by Young's Gym public website. Code is open for portfolio use.
