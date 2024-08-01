import bodyParser from 'body-parser'
import cors from 'cors'
import express from 'express'
import rateLimit from 'express-rate-limit'
import { assert } from 'superstruct'
import { RequestBodyStruct } from './struct'

const app = express()

app.use(cors())
app.use(bodyParser.json())

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 10,
  message: 'Too many requests, please try again after a minute',
})

app.get('/', (req, res) => {
  res.send(
    `
<!DOCTYPE html>
<html>
<head>
  <title>Speller API</title>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    body {
      font-family: sans-serif;
    }
  </style>
</head>
<body>
Speller API<br />
<a href="https://github.com/jhaemin/speller-api">https://github.com/jhaemin/speller-api</a>
</body>
</html>
`
  )
})

app.post('/', limiter, async (req, res) => {
  const body = req.body

  try {
    assert(body, RequestBodyStruct)
  } catch (e) {
    return res.status(400).send('Invalid request body')
  }

  const text = body.text.split('\n').join('\r\n')

  try {
    const spellerRes = await fetch('http://164.125.7.61/speller/results', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `text1=${encodeURIComponent(text)}`,
    })
    const result = await spellerRes.text()

    const dataString = result.match(/data = \[.*;/g)?.[0] ?? ''

    if (!dataString) {
      return res.status(200).json({
        suggestions: [],
      })
    }

    const data = JSON.parse(dataString.slice(7, -1))[0]

    // const errInfo = data[0].errInfo
    const errInfo = (data.errInfo ?? [])
      .filter((err: any) => err.candWord)
      .map((err: any) => ({
        description: err.help,
        // type: err.correctMethod,
        start: err.start,
        end: err.end,
        text: err.orgStr,
        candidates: err.candWord.split('|'),
      }))

    return res.status(200).json({
      suggestions: errInfo,
    })
  } catch (e) {
    console.error(e)
    return res.status(500).send('Internal Server Error')
  }
})

app.listen(Bun.env.PORT, () => {
  console.log(`Server is running on port ${Bun.env.PORT}`)
})
