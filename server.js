const express = require("express");
const fs = require("fs");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.get("/", (req, res) => {
  fs.readFile("./data.json", "utf8", (err, data) => {
    if (err) {
      return res.status(500).send("Internal Server Error");
    }

    try {
      const jsonData = JSON.parse(data);
      res.json(jsonData);
    } catch (e) {
      res.status(500).send("Internal Server Error");
    }
  });
});

app.post("/", async (req, res) => {
    try {
      const { name, email, gender, address, phone } = req.body;
  
      const data = JSON.parse(fs.readFileSync("./data.json", "utf8"));
  
      const newId = data.length > 0 ? data[data.length - 1].id + 1 : 1;
  
      const newPerson = {
        id: newId,
        name,
        email,
        gender,
        address,
        phone,
      };
  
      const newData = [...data, newPerson];
  
      fs.writeFileSync("./data.json", JSON.stringify(newData));
  
      res.json(newData);
    } catch (err) {
      console.error(err);
      res.status(500).send("Internal Server Error");
    }
  });

  app.put("/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const { name, email, gender, address, phone } = req.body;
  
      let data2 = fs.readFileSync("./data.json", "utf8");
      const data = JSON.parse(data2);
  
      const index = data.findIndex((item) => item.id === parseInt(id));
      if (index === -1) {
        return res.status(404).send("User not found");
      }
  
      const updatedPerson = {
        id: parseInt(id),
        name: name || data[index].name,
        email: email || data[index].email,
        gender: gender || data[index].gender,
        address: address || data[index].address,
        phone: phone || data[index].phone,
      };
  
      data[index] = updatedPerson;
  
      fs.writeFile("./data.json", JSON.stringify(data), (err) => {
        if (err) throw err;
        res.json(updatedPerson);
      });
    } catch (err) {
      console.error(err);
      res.status(500).send("Internal Server Error");
    }
  });

app.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    let data2 = fs.readFileSync("./data.json", "utf8");
    const data = JSON.parse(data2).filter((item) => item.id !== parseInt(id));
    fs.writeFile("./data.json", JSON.stringify(data), (err) => {
      if (err) throw err;
      res.json(data);
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(8000, () => {
  console.log("Server started on port 8000");
});