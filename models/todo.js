const { db } = require('../helpers/db');
const { sequelize, Types } = db;

const Todo = sequelize.define('todos', {
    activity_group_id: {
      type: Types.STRING,
      allowNull: false
    },
    title: {
      type: Types.STRING,
      allowNull: false
    },
    is_active: {
      type: Types.STRING,
      allowNull: false
    },
    priority: {
      type: Types.ENUM('very-low', 'low', 'normal', 'high', 'very-high'),
      defaultValue: 'very-high'
    },
    created_at: {
      type: Types.DATE,
      defaultValue: Types.NOW
    },
    updated_at: {
      type: Types.DATE,
      defaultValue: Types.NOW
    },
    deleted_at: Types.DATE,
}, { timestamps: false, freezeTableName: true })

module.exports = Todo