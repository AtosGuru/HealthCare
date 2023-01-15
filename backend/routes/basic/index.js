const express = require("express");
const router = express.Router();

const Nurse = require("../../models/nurse.model");
const Patient = require("../../models/patient.model");
const User = require("../../models/user.model");
const Holiday = require("../../models/holiday.model");

router.route("/list").get(function (req, res) {
  Nurse.find({}, function (err, nurseData) {
    if (!err) {
      Patient.find({}, function (err, patientData) {
        if (!err) {
          Holiday.find({}, function (err, holidayData) {
            let holidays;
            console.log(holidayData);
            if (holidayData == null || holidayData.length == 0) {
              holidays = [];
            } else {
              holidays = holidayData[0].holiday;
            }
            res.send({
              state: "success",
              nurse: nurseData,
              patient: patientData,
              holiday: holidays,
            });
          });
        }
      });
    }
  });
});
router.route("/login").post(function (req, res) {
  User.findOne(
    { user: "admin@gmail.com", token: "token123" },
    function (err, data) {
      console.log(data);
      if (data == null) {
        console.log(data);
        console.log("null!");
        User.findOneAndUpdate(
          { user: "admin@gmail.com" },
          { token: "token123" },
          function (err, data) {
            if (data.password == req.body.password) {
              Nurse.find({}, function (err, nurseData) {
                Patient.find({}, function (err, patientData) {
                  if (!err) {
                    res.send({
                      state: "success",
                      token: data.token,
                      nurse: nurseData,
                      patient: patientData,
                    });
                  }
                });
              });
            } else {
              res.send({ state: "wrong" });
              console.log("wrong!");
            }
          }
        );
      } else {
        console.log("no!");
        if (data.password == req.body.password) {
          console.log("yes!");
          Nurse.find({}, function (err, nurseData) {
            // console.log(nurseData);
            if (!err) {
              console.log("success1");
              Patient.find({}, function (err, patientData) {
                console.log(patientData);
                if (!err) {
                  res.send({
                    state: "success",
                    token: data.token,
                    nurse: nurseData,
                    patient: patientData,
                  });
                  console.log("success2");
                } else {
                  console.log(err);
                }
              });
            } else {
                console.log(err);
            }
          });
        } else {
          res.send({ state: "wrong" });
        }
      }
    }
  );
});
router.route("/holiday/get").post(function (req, res) {
  const holiday = req.body;
  Holiday.find({}, function (err, data) {
    if (data == null || data.length == 0) {
      Holiday.create(
        {
          holiday: [holiday.date],
        },
        function (err, data) {
          if (!err) {
            res.send({ holiday: data.holiday });
          }
        }
      );
    } else {
      if (holiday.state == false) {
        Holiday.findOneAndUpdate({}, { $push: { holiday: holiday.date } }).then(
          function (data) {
            Holiday.find({}, function (err, data) {
              if (data == null) {
                res.send({ holiday: [] });
              } else {
                res.send({ holiday: data[0].holiday });
              }
            });
          }
        );
      } else {
        Holiday.findOneAndUpdate({}, { $pull: { holiday: holiday.date } }).then(
          function (data) {
            Holiday.find({}, function (err, data) {
              if (data == null) {
                res.send({ holiday: [] });
              } else {
                res.send({ holiday: data[0].holiday });
              }
            });
          }
        );
      }
    }
  });
});

module.exports = router;
