import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/database';

export interface ContactAttributes {
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  organization: string;
  role: string;
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ContactCreationAttributes extends ContactAttributes {}

export class Contact extends Model<ContactAttributes, ContactCreationAttributes> implements ContactAttributes {
  public id!: number;
  public firstName!: string;
  public lastName!: string;
  public email!: string;
  public phone!: string;
  public organization!: string;
  public role!: string;
  public notes!: string;

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Contact.init(
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
    organization: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    role: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: 'contacts',
    sequelize,
  }
);

export default Contact; 