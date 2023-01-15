const express = require("express");
const router = express.Router();
const Patient = require('../../models/patient.model');

router.route("/list").get(function(req,res){
    Patient.findAll({},function(err,data){
        if(!err){
            res.send(data);
        }
    });
});

router.route("/add").post(function(req,res){
    sendData = req.body;
    if(sendData.id == 0){
        Patient.create({
            ...sendData
        },function(err,data){
            if(!err){
                console.log('insert'+data._id);
                res.send({state:'insert',data:data});
            }
        });
    }else{
        Patient.findOneAndUpdate({_id:sendData.id},sendData,{new:true,upsert:true},function(err,data){
            if(!err){
                res.send({state:'update',data:data});
            }else{
                console.log(err);
            }
        });
    }
});

router.route('/import').post(function(req,res){
    const datas = req.body.importData;
    let count = datas.length;
    let flag = 0;
    let step = function(){
        let notFoundPatient = [];
        return new Promise(function(resolve){
            for(let data of datas){
                let Revenue = data.Revenue;
                if(Revenue != 'Total'){
                    delete data.Revenue;
                    delete data.Total;
                    Patient.findOneAndUpdate({name:Revenue},[{"$set":{
                        "revenue":{
                        "$mergeObjects":[
                            "$revenue",
                            data
                        ]
                        }
                    }}],function(err,result){
                        if(!err){
                            if(result == null){
                                notFoundPatient.push(Revenue);
                            }
                            console.log(Revenue,flag,count);
                            flag++;
                            if(flag == count-1){
                                resolve();
                            }
                        }
                    });
                }
            }
        }).then(function(){
            Patient.find({},function(err,data){
                if(!err){
                    res.send({patients:data,notFound:notFoundPatient});
                }
            });
        });
    }
    step();
});
router.route('/remove').post(function(req,res){
    console.log(req.body);
    const _id = req.body;
    Patient.findOneAndRemove({_id:_id},function(err,result){
        if(!err){
            res.send(result);
        }
    });
});

module.exports = router;