const express = require("express");
const router=require("express").Router();
const {test} = require("../models")


router.get("/", (req, res) => {
    res.send("I AM TESTING!");
})
router.post("/", async (req, res) => {
    const test_string = req.body;
    await test.create(test_string);
    res.json(test_string);
})

module.exports = router;