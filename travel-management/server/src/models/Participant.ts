import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/database';
import Travel from './Travel';

export interface ParticipantAttributes {
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  travelId: number;
  amountPaid: number;
  status: 'registered' | 'confirmed' | 'cancelled';
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ParticipantCreationAttributes extends ParticipantAttributes {}

export class Participant extends Model<ParticipantAttributes, ParticipantCreationAttributes> implements ParticipantAttributes {
  public id!: number;
  public firstName!: string;
  public lastName!: string;
  public email!: string;
  public phone!: string;
  public travelId!: number;
  public amountPaid!: number;
  public status!: 'registered' | 'confirmed' | 'cancelled';
  public notes!: string;

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Participant.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    firstName: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        isEmail: true,
      },
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    travelId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'travels',
        key: 'id',
      },
    },
    amountPaid: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
    },
    status: {
      type: DataTypes.ENUM('registered', 'confirmed', 'cancelled'),
      allowNull: false,
      defaultValue: 'registered',
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: 'participants',
    sequelize,
  }
);

// Define relationship with Travel model
Participant.belongsTo(Travel, { foreignKey: 'travelId', as: 'travel' });
Travel.hasMany(Participant, { foreignKey: 'travelId', as: 'participants' });

export default Participant; 