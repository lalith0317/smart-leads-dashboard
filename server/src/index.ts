import { connectDb } from "./config/db.js";
import { env } from "./config/env.js";
import { app } from "./app.js";

await connectDb();

app.listen(env.PORT, () => {
  console.log(`API running on port ${env.PORT}`);
});
