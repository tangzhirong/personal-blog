var express = require('express');
var markdown = require('markdown').markdown;
var Article = require('../models/article')
var router = express.Router();

module.exports = function(app) {
    //首页
    app.get('/', function (req, res) {
        //获取页号
        var page = parseInt(req.query.p) || 1;
        Article.find({}).then(function(articles){
            var total = articles.length;
            Article.find({}).skip((page-1)*10).limit(10).sort({createTime : -1}).then(function(posts) {
                //解析 markdown 为 html
                posts.forEach(function (doc) {
                    doc.content = markdown.toHTML(doc.content);
                });
                res.render('index',{title:'呆呆流云',list:posts,page:page,isFirstPage: (page - 1) == 0,
                    isLastPage: ((page - 1) * 10 + posts.length) == total});
            }).then(null,function(err) {
                console.log(err);
                res.status(500).end();
            });
        })

    });

    //单个标签页
    app.get('/tag/:type', function (req, res) {
        var type = req.params.type;
        //获取页号
        var page = parseInt(req.query.p) || 1;
        Article.find({tag:type}).then(function(articles){
            var total = articles.length;
            Article.find({tag:type}).skip((page-1)*10).limit(10).sort({createTime : -1}).then(function(posts) {
                //解析 markdown 为 html
                posts.forEach(function (doc) {
                    doc.content = markdown.toHTML(doc.content);
                });
                res.render('index',{title:'呆呆流云',list:posts,page:page,isFirstPage: (page - 1) == 0,
                    isLastPage: ((page - 1) * 10 + posts.length) == total});
            }).then(null,function(err) {
                console.log(err);
                res.status(500).end();
            });
        })
    });

    //管理员上传文章页
    app.get('/manager', function (req, res) {
        res.render('manager',{title:'呆呆流云',success:''});
    });

    //发表文章
    app.post('/post_article', function (req, res) {
        var title = req.body.title;
        var content = req.body.post;
        var tag = req.body.tag;

        var post ={
            title:title,
            content : content,
            commentNum : 0,
            likeNum:0,
            viewNum:0,
            tag : tag,
        }
        Article.create(post).then(function(new_post){
            res.render('manager',{title:'呆呆流云',success:'发布成功！'});
        }).then(null, function(err){
            res.status(500).end();
        });
    });


    //阅读单篇文章
    app.get('/article', function (req, res) {
        var id = req.query._id;
        Article.findOneAndUpdate({_id:id},{$inc:{viewNum:1}}).then(function(article) {
            //解析 markdown 为 html
            article.content = markdown.toHTML(article.content);
            res.render('article',{title:'呆呆流云',post:article});
        }).then(null,function(err) {
            console.log(err);
            res.status(500).end();
        });
    });

    app.get('/like',function(req,res){
        var article_id = req.query.article_id;
        Article.findOne({_id:article_id}).then(function(article){
            article.likeNum++;
            article.save();
            res.send({status:'ok',msg:article.likeNum});
        }).then(null,function(err){
            console.log(err);
            res.status(500).end();
        })
    })



}
