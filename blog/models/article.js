/**
 * Created by tzr4032369 on 2016/5/9.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var articleSchema = new Schema({
    title:{type:String},
    content : {type: String},
    commentNum : {type: Number},
    likeNum:{type: Number},
    viewNum:{type: Number},
    tag :{type:String},
    //comments: [{type:String}],
    createTime :  {type: Date, default: Date.now},
    editTime :  {type: Date, default: Date.now}
},{
    strict : false
});


var Article = mongoose.model('Article', articleSchema);



Article.schema.pre('save', function(next) {
    var article = this;
    article.editTime = new Date();
    next();
});

//·¢±íÎÄÕÂ
Article.create = function(obj) {
    var article = new Article(obj);
    return article.save();
};


module.exports = Article;
