'use strict'
// jscs:disable requireCamelCaseOrUpperCaseIdentifiers
/**
  * Module dependencies.
  */
var mongoose = require('mongoose'),
    mongoosePaginate = require('mongoose-paginate'),
    Schema = mongoose.Schema,
    RepoSchema,
    VoteSchema;

/**
  * Repository document Schema
  */

VoteSchema = new Schema({
    userMail: String,
    vote: Number
});

RepoSchema = new Schema({
    id: String,
    name: String,
    lowerCaseName: String,
    full_name: String,
    description: String,
    createdAt: {type: Date, default: Date.now},
    owner: {
        login: String,
        avatar_url: String,
        html_url: String
    },
    html_url: String,
    created_at: Date,
    updated_at: Date,
    pushed_at: Date,
    git_url: String,
    homepage: String,
    fork: Boolean,
    bower_json: Schema.Types.Mixed,
    dependenciesArray: [String],
    devDependenciesArray: [String],
    projects: [{type: Schema.Types.ObjectId, ref: 'Project'}],
    votes: [VoteSchema],
    voteSum: Number
});

RepoSchema.plugin(mongoosePaginate);
mongoose.model('Repository', RepoSchema);
