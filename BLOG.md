# Writing a blog post

Publish a post by adding one Markdown file to `_posts/` and pushing it to the `gh-pages` branch. GitHub Pages builds the site. There is no separate workflow to run.

The blog is English-only. It lives at `/blog/` and is not copied under `/zh/`, `/ko/`, or `/es/`.

## Where the file goes

```
_posts/YYYY-MM-DD-slug.md
```

Example: `_posts/2026-10-30-first-acupuncture-visit-doraville-ga.md`

- `YYYY-MM-DD` is the post date. Use the same date in the front matter.
- `slug` is the public address: `https://www.shallowfordherbs.net/blog/slug`
- No `.html` and no trailing slash on a post URL. The blog index is `https://www.shallowfordherbs.net/blog/`.
- The `slug` field in the front matter is what sets that address. Keep it the same as the filename (after the date) so the file is easy to find.
- Use lowercase words separated by hyphens. No spaces.

## Front matter

```yaml
---
title: "Post title"
description: "One or two sentences for the blog index, Google, and link previews."
date: 2026-10-30
slug: post-title
tags:
  - acupuncture
published: true
# image: /img/example.jpg
# image_alt: "What the photo shows"
# faq:
#   - question: "A question readers ask"
#     answer: "The answer, in plain text."
---
```

| Field | Required | What it does |
| --- | --- | --- |
| `title` | yes | The only H1 on the page, and the SEO title. Plain text. |
| `description` | yes | The summary on `/blog/`, the meta description, and social cards. Plain text. |
| `date` | yes | Ordering (newest first), sitemap `lastmod`, and the RSS/Atom feed. It is not shown on the page. |
| `slug` | yes | The URL: `/blog/<slug>`. |
| `tags` | yes | Topic labels on the post and categories in the feed. They are not dates. |
| `published` | yes | `true` puts the post on the site. `false` hides it from the index, the sitemap, and the feed. |
| `image` | no | Root-relative path such as `/img/photo.jpg`, or a full `https://` URL. Shown on the index and the post. |
| `image_alt` | no | Alt text for `image`. Set this whenever you set `image`. |
| `faq` | no | Optional. See FAQ below. |

Put images in the site's `img/` folder. A path like `photo.jpg` next to the Markdown file will not be copied.

Links to other pages on this site should start with `/`, for example `[directions and hours](/visit.html)`.

## Copy-paste template

```markdown
---
title: ""
description: ""
date: 2026-10-30
slug: your-slug-here
tags:
  - acupuncture
published: true
---

First paragraph. Do not start with a heading.

## First section

Section text.

## Frequently asked questions

### First question?

Answer.

### Second question?

Answer.
```

## Do not put an H1 in the body

The template prints `title` as the only H1. Start the body with a paragraph or with `##`. A `#` heading in the body would make a second H1.

## Dates stay off the page

Do not write the publish date in the body, and do not add a byline with a date. The page does not print `date`, and it has no `<time>` element. `date` is used only to sort the index, to set sitemap `lastmod`, and to date entries in the feed (`/feed.xml` and `/rss.xml`).

`future: false` is set for the site. A post dated after the build day is left out. GitHub Pages rebuilds when you push, not every morning, so when a post should go live with a push, date it that day or earlier.

## `published`

Leave `published: true` (or delete the line) to publish.

Set `published: false` to hold a draft. A normal build skips it. To preview a draft locally:

```bash
bundle exec jekyll serve --unpublished
```

The first post, `first-acupuncture-visit-doraville-ga`, is `published: false` until the final copy is ready. Flip that one field to `true` to put it on the site. With no published posts, `/blog/` shows a short empty state.

## FAQ rich results

If the body has a `## FAQ` or `## Frequently Asked Questions` heading (wording can vary as long as it says "FAQ" or "frequently asked"), and each question is a `###` heading with the answer under it, the page adds FAQPage structured data automatically. The sample post is detected this way. You do not need an `faq` list for that pattern.

If the questions are not written as those headings, add the optional list instead. Each item needs `question` and `answer` (plain text). The list is used only when the headings are not found.

```yaml
faq:
  - question: "Does acupuncture hurt?"
    answer: "Most people feel very little."
```

The call box at the end of every post (phone and directions) is added by the template. You do not need to paste it.
