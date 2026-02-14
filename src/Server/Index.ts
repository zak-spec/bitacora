import app from "./App.js";
import { connectDB } from "./Db.js";
import { PORT } from "./Config.js";

connectDB();

app.listen(PORT, () => {
  console.log(`Server on port ${PORT}`);
});
