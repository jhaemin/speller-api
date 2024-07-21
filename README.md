# Speller API

부산대학교 인공지능연구실과 (주)나라인포테크에서 함께 만든 [한국어 맞춤법/문법 검사기](http://speller.cs.pusan.ac.kr/)를 활용한 API 서버입니다.

## Usage

```http
POST https://speller.town
```

#### Request

```json
{
  "text": "한국어 맞춤법 틀리면 어떻게 되나요?"
}
```

#### Response

```json
{
  "suggestions": [
    {
      "description": "뜻으로 볼 때 틀렸을 가능성이 큽니다.",
      "start": 12,
      "end": 19,
      "text": "어떡해 되나요",
      "candidates": ["어떻게 되나요"]
    }
  ]
}
```

> If the text is correct, the `suggestions` field will be an empty array.

## Development

#### Install dependencies

```bash
bun install
```

#### Run the server

```bash
bun dev   # Restart the server automatically when the source code changes
bun start
```

#### Environment variables

> Create a `.env` file in the root directory of the project.

- `PORT`: HTTP server port (default: 3000)

#### PM2

```bash
pm2 start --interpreter ~/.bun/bin/bun index.ts --name speller
```
