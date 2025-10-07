import Payment from "./core/Payment";
import { publicAPI } from "./core/publicAPI";
import { streamAPI } from "./core/streamAPI";
import User from "./core/User";

export * from "./core/streamAPI";
export * from "./core/publicAPI";
export * from "./core/Payment";
export * from "./core/User";

const trakteer = {
    streamAPI,
    publicAPI,
    Payment,
    User
};
export default trakteer;
