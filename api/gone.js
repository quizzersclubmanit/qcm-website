// True 410 Gone for retired quiz-play URLs (/quiz/*) while live quizzes
// are paused. Static hosting can only serve 200+noindex; this function lets
// crawlers see a real 410. Wired via vercel.json rewrite.
export default function handler(req, res) {
  res.setHeader("Content-Type", "text/html; charset=utf-8")
  res.setHeader("X-Robots-Tag", "noindex")
  res.setHeader("Cache-Control", "public, max-age=0, s-maxage=86400, stale-while-revalidate=86400")
  res.status(410).send(`<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Quiz Removed | Quizzers' Club NIT Bhopal</title>
  <meta name="description" content="This live quiz has ended or was removed. Explore QBIT registration and quiz events by Quizzers' Club NIT Bhopal." />
  <meta name="robots" content="noindex, nofollow" />
  <link rel="canonical" href="https://www.quizzersclub.com/" />
</head>
<body style="font-family:system-ui,sans-serif;text-align:center;padding:4rem 1rem">
  <h1>This Quiz Is No Longer Available</h1>
  <p>Live quizzes are paused while we focus on QBIT'26 team registrations.</p>
  <p><a href="/signup">Register for QBIT'26</a> · <a href="/">Go to Home</a></p>
</body>
</html>`)
}
