import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/database';

export interface TravelAttributes {
  id?: number;
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  location: string;
  travelAgency: string;
  commission: number;
  totalFee: number;
  status: 'planned' | 'ongoing' | 'completed' | 'cancelled';
  createdAt?: Date;
  updatedAt?: Date;
}

export interface TravelCreationAttributes extends TravelAttributes {}

export class Travel extends Model<TravelAttributes, TravelCreationAttributes> implements TravelAttributes {
  public id!: number;
  public name!: string;
  public description!: string;
  public startDate!: Date;
  public endDate!: Date;
  public location!: string;
  public travelAgency!: string;
  public commission!: number;
  public totalFee!: number;
  public status!: 'planned' | 'ongoing' | 'completed' | 'cancelled';

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Travel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    location: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    travelAgency: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    commission: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    totalFee: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('planned', 'ongoing', 'completed', 'cancelled'),
      allowNull: false,
      defaultValue: 'planned',
    },
  },
  {
    tableName: 'travels',
    sequelize,
  }
);

export default Travel; 