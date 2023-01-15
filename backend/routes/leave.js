const express = require("express");
const router = express.Router();
const Nurse = require('../models/nurse.model');

router.route("/add").post(function(req,res){
    const data = req.body;
    let today = new Date();
    let leave_id = today.getFullYear()*(today.getMonth()+today.getDate()+today.getDay())*(today.getHours()+today.getMinutes()+today.getSeconds()+today.getMilliseconds());
    console.log(new Date().getDate());
    Nurse.findOneAndUpdate({_id:data.nurse_id},
        {$push:{"leave":{leave_id:leave_id,from:data.from,to:data.to, type: data.type}}}
    ).then(function(data){
        Nurse.find({},function(err,nurses){
            res.send({NurseDatas:nurses});
        });
    });
});
router.route("/remove").post(function(req,res){
    const data = req.body;
    Nurse.findOneAndUpdate({_id:data.nurse_id},
        {$pull:{"leave":{leave_id:data.leave_id}}}
    ).then(function(data){
        Nurse.find({},function(err,nurses){
            res.send({NurseDatas:nurses});
        });
    });
});

router.route("/edit").post(function(req,res){
    const data = req.body;
    Nurse.findOneAndUpdate({_id:data.nurse_id},
        {$set:{"leave.$[el].from": data.from,"leave.$[el].to": data.to }},
        {
            arrayFilters: [{ "el.leave_id": data.leave_id }],
            new:true,
        }
    ).then(function(data){
        console.log(data);
        Nurse.find({},function(err,nurses){
            res.send({NurseDatas:nurses});
        });
    });
});

module.exports = router;