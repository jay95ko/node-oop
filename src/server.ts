import { app } from "./app";
import config from "./config";

app.listen(config.port, function () {
  console.log("Express listening on port", config.port);
});
