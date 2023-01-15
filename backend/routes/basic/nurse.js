const express = require("express");
const router = express.Router();
const Nurse = require('../../models/nurse.model');

router.route("/list").get(function(req,res){
    Nurse.findAll({},function(err,data){
        if(!err){
            res.send(data);
        }
    });
});

router.route("/add").post(function(req,res){
    sendData = req.body;
    if(sendData.id == 0){
        Nurse.create({
            ...sendData
        },function(err,data){
            if(!err){
                res.send({state:'insert',data:data});
            }
        });
    }else{
        Nurse.findOneAndUpdate({_id:sendData.id},sendData,{new:true,upsert:true},function(err,data){
            if(!err){
                res.send({state:'update',data:data});
            }else{
                console.log(err);
            }
        });
    }
});

router.route('/remove').post(function(req,res){
    const _id = req.body;
    Nurse.findOneAndRemove({_id:_id},function(err,result){
        if(!err){
            res.send(result);
        }
    });
});

module.exports = router;