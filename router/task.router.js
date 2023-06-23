const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const uuid = require("uuid").v4;
const filePath = path.join(__dirname, "../data/data.json");
// list all tasks
router.get("/", async (req, res) => {
  try {
    fs.readFile(filePath, (err, content) => {
      const data = JSON.parse(content);
      if (data && !data.project) {
        res
          .send({
            message: "no data getting the tasks",
          })
          .status(404);
      } else {
        res
          .send({
            data: data,
          })
          .status(200);
      }
    });
  } catch (err) {
    res
      .send({
        message: "error getting the tasks",
      })
      .status(404);
  }
});
// create task group
router.post("/", (req, res) => {
  // get all the tasks
  // append the task with group
  const { name, desc } = req.body;
  if (!name && !desc) throw new Error("no name and desc provided");
  const content = {
    id: uuid(),
    name,
    description: desc,
    completed: false,
    priority: "low",
  };
  fs.readFile(filePath, "utf-8", (err, data) => {
    if (err) console.log("err while reading file", err);
    const obj = data ? JSON.parse(data) : { project: [] };
    obj.project && obj.project.push(content);
    const json = JSON.stringify(obj);
    fs.writeFile(filePath, json, (err, data) => {
      console.log("write file success", err);
    });
  });
  res
    .send({
      message: "write success",
      data: content,
    })
    .status(200);
});
// get by task ID
router.get("/:id", (req, res) => {
  try {
    const id = req.params.id;
    fs.readFile(filePath, (err, content) => {
      const data = JSON.parse(content);
      const getByID =
        data && data.project
          ? data.project.filter((item) => item.id === id)
          : [];
      res
        .send({
          message: "success",
          data: getByID,
        })
        .status(200);
    });
  } catch (err) {
    res
      .send({
        message: "error getting the tasks",
      })
      .status(404);
  }
});
// delete task by id
router.delete("/:id", (req, res) => {
  try {
    const id = req.params.id;
    fs.readFile(filePath, (err, content) => {
      const data = JSON.parse(content);
      const getByID =
        data && data.project
          ? data.project.filter((item) => item.id !== id)
          : [];
      const json = JSON.stringify(getByID);
      fs.writeFile(filePath, json, (err, data) => {
        console.log("write file success", err);
      });
      res
        .send({
          message: "delete success",
          data: getByID,
        })
        .status(200);
    });
  } catch (err) {
    res
      .send({
        message: "error getting the tasks",
      })
      .status(404);
  }
});
// update task IDs
router.put("/:id", (req, res) => {
  try {
    const id = req.params.id;
    if (!req.body) throw new Error("no body provided");
    fs.readFile(filePath, (err, content) => {
      const data = JSON.parse(content);
      const copy =
        data && data.project && data.project.filter((item) => item.id !== id);
      const getByID =
        data && data.project
          ? data.project.map(
              (item) => item.id === id && { ...item, ...req.body }
            )
          : [];
      const json = [...copy, ...getByID];
      data.project = json;
      fs.writeFile(filePath, JSON.stringify(data), (err, data) => {
        console.log("update file success", err);
      });
      res
        .send({
          message: "update success",
          data: getByID,
        })
        .status(200);
    });
  } catch (err) {
    res
      .send({
        message: "error while updating the tasks",
      })
      .status(404);
  }
});
module.exports = router;
