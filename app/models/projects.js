'use strict';

var mongoose = require('mongoose'),
  mongoosePaginate = require('mongoose-paginate'),
  Schema = mongoose.Schema,
  ProjectSchema;

/**
 * Project document Schema
 */
ProjectSchema = new Schema({
    name: String
});

ProjectSchema.plugin(mongoosePaginate);
mongoose.model('Project', ProjectSchema);
