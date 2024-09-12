import { expect, test } from 'bun:test'
import { ResponseStruct } from './struct'

test('Speller', async () => {
  const body = {
    text: '맞춘법을 틀리면 어떡해 되나요?',
  }

  const res = await fetch('http://localhost:3000', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })

  const result = await res.json()

  expect(ResponseStruct.is(result)).toBe(true)
})
