const express = require("express");
const cors = require("cors");
const { MongoClient, ObjectId } = require("mongodb");
require("dotenv").config();

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());
const uri = `mongodb+srv://adminuser:adminuser@cluster0.juguzvf.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    //collections
    const UserCollection = client.db("tableData").collection("information");
    //all user get api
    app.get("/users", async (req, res) => {
      const query = {};
      const state = await UserCollection.find(query).toArray();
      res.send(state);
    });
    //single user update api
    app.patch("/users/:id", async (req, res) => {
      const id = req.params.id;
      const updatedProfile = req.body;
      const query = { _id: new ObjectId(id) };
      const option = { upsert: true };
      const updateDoc = {
        $set: {
          name: updatedProfile.name,
          position: updatedProfile.position,
          age: updatedProfile.age,
        },
      };
      const result = await UserCollection.updateOne(query, updateDoc, option);
      res.send(result);
    });

    // delete user by id
    app.delete("/deleteUsers/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const result = await UserCollection.deleteOne(filter);
      res.send(result);
    });
  } finally {
  }
}
run().catch((err) => console.error(err));

app.get("/", (res, req) => {
  req.send("server is fucking running");
});
app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
