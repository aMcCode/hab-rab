const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Counts extends Model {
  static upCount(body, models) {
    return models.Counts.create({
        id: body.id
      }).then(() => {
        return Counts.findOne({
          where: {
            id: body.habit_id
          },
          attributes: [
            'total_confirms'
          ]
      }).then(dbPostData => {
      if (!dbPostData) {
        res.status(404).json({ message: 'No Count found with this id' });
        return;
      }
      return dbPostData.total_confirms + 1;;
  });
      });
    };
};

Counts.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    habit_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'habit',
            key: 'id'
        }
    },
    user_id: {
        type: DataTypes.INTEGER,
        references: {
          model: 'user',
          key: 'id'
        }
    },
    total_confirms: {
        type: DataTypes.INTEGER,
    },
    prev_confirm_date: {
        type: DataTypes.DATE,
        allowNull: true
        //This is date/time now, but should only update when habit confirmed.
    },
    prev_streak: {
        type: DataTypes.INTEGER
        //= current_streak just before current_streak resets to 0
    },
    current_streak: {
        type: DataTypes.INTEGER
        //Increments by 1 w/ each confirmation unles prev confirm date is > 1 day earlier, then it resets to 0
    }
  },
  {
    // hooks: {

    // },
    sequelize,
    timestamps: true,
    freezeTableName: true,
    underscored: true,
    modelName: 'Counts'
  }
);

module.exports = Counts;