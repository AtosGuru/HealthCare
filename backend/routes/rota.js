const express = require("express");
const router = express.Router();
const Nurse = require('../models/nurse.model');

router.route("/assign").post(async function(req,res){
    const assign = req.body;
    let updateAssignNurse = [];
    let updateAssignAllNurse = [];

    assign.assignData.map((value,index) =>{
        if(value.nurse_id != 'NA' && value.hour != 'NA'){
            updateAssignAllNurse.push({
                _id:value.nurse_id,
                date:value.date,
                rotation:value.rotation,
                patient_id:assign.patient_id,
                duty_start:value.duty_start,
                duty_end:value.duty_end,
                hour:value.hour
            });

            if(updateAssignNurse[value.nurse_id] === undefined){
                updateAssignNurse[value.nurse_id] = [{
                    date:value.date,
                    rotation:value.rotation,
                    patient_id:assign.patient_id,
                    duty_start:value.duty_start,
                    duty_end:value.duty_end,
                    hour:value.hour
                 }];
            }else{
                updateAssignNurse[value.nurse_id] = [...updateAssignNurse[value.nurse_id],{
                date:value.date,
                rotation:value.rotation,
                patient_id:assign.patient_id,
                duty_start:value.duty_start,
                duty_end:value.duty_end,
                hour:value.hour
                }];
            }
        }
    });
    
    let step = function(){
        return new Promise(function(resolve){
            let flag = 0;

            let month = assign.year+'-'+(assign.month<10?+'0'+String(assign.month):assign.month);
            let daysInMonth = new Date(assign.year, assign.month, 0). getDate();
            let firstDay = month+'-01';
            let lastDay = month+'-'+daysInMonth;
           
            // Nurse.updateMany({}, {$unset: {"rota": 1}});
            // resolve();

            Nurse.updateMany({},
                {$pull:{"rota":{patient_id:assign.patient_id ,date:{$gte:firstDay,$lte:lastDay}}}}
            ).then(function(){
                let flag = 0;
                let length = Object.keys(updateAssignAllNurse).length;
                if(length == 0){
                    resolve();
                }
                for(let index in updateAssignAllNurse){
                    let nurse = updateAssignAllNurse[index];
                    Nurse.findByIdAndUpdate(nurse._id,
                    {$pull:{"rota": {date:nurse.date,duty_start:{$lte:nurse.duty_end},duty_end:{$gte:nurse.duty_start}}}}
                    ).then(function(data){
                        flag++;
                        if(flag == length){
                            resolve();
                        }
                    });
                }
            });
        }).then(function(){
            return new Promise(function(resolve){
                let flag = 0;
                let length = Object.keys(updateAssignNurse).length;
                if(length == 0){
                    resolve();
                }
                for(let _id in updateAssignNurse){
                        Nurse.findByIdAndUpdate(_id,
                    {"$push":{"rota": {$each:updateAssignNurse[_id]}}},{new:true,upsert:true}
                    ,function(err,data){
                        flag++;
                        if(flag == length){
                            resolve();
                        }
                    });
                }
                // resolve();
            }).then(function(){
                Nurse.find({},function(err,nurses){
                    res.send({NurseDatas:nurses});
                });
            });
        });
    }
    step();
});
router.route("/report").post(function(req,res){
    const data = req.body;
    Nurse.findOneAndUpdate(
        {_id: data._id},
        {$set: {"rota.$[el].hour": data.hour,"rota.$[el].service":data.service } },
        { 
          arrayFilters: [{ "el.date": data.date }],
          new: true
        },function(err,data){
            if(!err){
                res.send(data);
            }
        }
    );
});
router.route("/delete").post(function(req,res){
    const data = req.body;
    Nurse.findOneAndUpdate({
        "_id": data._id
      },
      {
        "$pull": {
          "rota": {
            "date":data.date
          }
        }
      },{new:true,upsert:true},function(err,data){
        if(!err){
            res.send(data);
        }
      }
    )
});

module.exports = router;