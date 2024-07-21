import { object, string } from 'superstruct'

export const RequestBodyStruct = object({
  text: string(),
})
