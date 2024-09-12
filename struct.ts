import { array, number, object, string } from 'superstruct'

export const RequestBodyStruct = object({
  text: string(),
})

export const ResponseStruct = object({
  suggestions: array(
    object({
      description: string(),
      start: number(),
      end: number(),
      text: string(),
      candidates: array(string()),
    })
  ),
})
