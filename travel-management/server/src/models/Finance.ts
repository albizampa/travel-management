import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/database';
import Travel from './Travel';

export interface FinanceAttributes {
  id?: number;
  type: 'income' | 'expense';
  category: string;
  amount: number;
  date: Date;
  description: string;
  travelId?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface FinanceCreationAttributes extends FinanceAttributes {}

export class Finance extends Model<FinanceAttributes, FinanceCreationAttributes> implements FinanceAttributes {
  public id!: number;
  public type!: 'income' | 'expense';
  public category!: string;
  public amount!: number;
  public date!: Date;
  public description!: string;
  public travelId?: number;

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Finance.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    type: {
      type: DataTypes.ENUM('income', 'expense'),
      allowNull: false,
    },
    category: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    description: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    travelId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'travels',
        key: 'id',
      },
    },
  },
  {
    tableName: 'finances',
    sequelize,
  }
);

// Define relationship with Travel model (optional relationship)
Finance.belongsTo(Travel, { foreignKey: 'travelId', as: 'travel' });
Travel.hasMany(Finance, { foreignKey: 'travelId', as: 'finances' });

export default Finance; 