var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');
var util = require('util');
 
var config = require('../config/config').config;
var pool = require('../db/db').pool;

function selectResult(ran, res, uname){

    if(ran < 3){        
        res.render('result', {
            uname: uname,
            wname: config.wine_data[ran].name,
            reason: config.wine_data[ran].reason,
            image: config.wine_data[ran].image,

            reason1: config.wine_data[ran]["reason-1"],
            reason2: config.wine_data[ran]["reason-2"],
            money: config.wine_data[ran].money,
            href: config.wine_data[ran].href
        });
    }else{                
        res.render('result-n', {
            uname: uname,
            wname: config.wine_data[ran].name,
            reason: config.wine_data[ran].reason,
            image:  config.wine_data[ran].image           
        });
    }
}

/* 主页 */
router.get('/', function(req, res, next) {   

    // 从数据库中读，并返回
    pool.getConnection(function(err, connection) {

        if(err){
            console.log('connect err'+err);
            return res.render('index', {
                count:0
            });
        }  

        connection.query('SELECT * from user', function(err, rows, fields) {
            if (err) {
                console.log('count error:'+err);
                return res.render('index', {
                    count:0
                });
            }

            try{

                res.render('index', {
                    count:rows.length
                });

                connection.release(); 
            }catch(e){

                console.log('count code error:'+e);
                res.render('index', {
                    count:0
                });
            }     
            
        });

    });  // connection end       
    
});

router.get('/result', function(req, res, next) {

    var uname = req.query.uname;
    
    // 从数据库中读，并返回
    pool.getConnection(function(err, connection) {

        if(err){
            console.log('connect err'+err);
            res.redirect('/');
        }

        var ran = parseInt(config.wine_data.length*Math.random());
        var user = {name:uname, wine:ran};

        connection.query("INSERT INTO user SET ?", user, function(err, result){
            if(err){
                console.log('insert err'+err);
                res.redirect('/');
            }
            try{
                res.redirect('/result/'+result.insertId);
                connection.release();
            }catch(e){
                res.redirect('/');
                console.log('insert code error');
            }
            
        });          

    });  // connection end   

});

router.get('/result/:id', function(req, res, next){

    var id = req.params.id;

    // 从数据库中读，并返回
    pool.getConnection(function(err, connection) {

        if(err){
            res.redirect('/');
            console.log('connect err'+err);
        }  

        connection.query('SELECT * from user where id = '+id, function(err, rows, fields) {
            if (err) {
                console.log('select id err'+err);
                res.redirect('/');
            }
            
            try{

                if(rows.length !== 0){

                    selectResult(rows[0].wine, res, rows[0].name);

                }else{

                    res.redirect('/');
                    console.log('no this id');

                }               

                connection.release();

            }catch(e){
                console.log('select id code error:'+e);
                res.redirect('/');
            }           
            
        });

    });  // connection end

});

module.exports = router;
