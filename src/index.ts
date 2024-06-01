import { publicAPI } from "./core/publicAPI"
import { streamAPI } from "./core/streamAPI"

export * from "./core/streamAPI"
export * from "./core/publicAPI"

const trakteer = {
  streamAPI,
  publicAPI
}
export default trakteer