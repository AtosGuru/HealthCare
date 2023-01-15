const express = require("express");
const router = express.Router();
const Level = require('../../models/level.model');

router.route("/list").get(function(req,res){
    Level.findAll({},function(err,data){
        if(!err){
            res.send(data);
        }
    });
});

router.route("/add").post(function(req,res){
    sendData = req.body;
    if(sendData.id == 0){
        Level.create({
            ...sendData
        },function(err,data){
            if(!err){
                console.log('insert'+data._id);
                res.send({state:'insert',data:data});
            }
        });
    }else{
        Level.findOneAndUpdate({_id:sendData.id},sendData,{new:true,upsert:true},function(err,data){
            if(!err){
                console.log('up'+data);
                res.send({state:'update',data:data});
            }else{
                console.log(err);
            }
        });
    }
});

router.route('/remove').post(function(req,res){
    const _id = req.body;
    Level.findOneAndRemove({_id:_id},function(err,result){
        if(!err){
            res.send(result);
        }
    });
});

module.exports = router;