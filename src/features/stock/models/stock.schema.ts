import { Model, DataTypes, InferAttributes, InferCreationAttributes } from 'sequelize';

import { mysqlConnection } from '@service/mysql/mysql.connection';

const { sequelize } = mysqlConnection;

export class Stock extends Model<InferAttributes<Stock>, InferCreationAttributes<Stock>> {
	declare date: Date;
	declare open: number;
	declare close: number;
	declare high: number;
	declare low: number;
	declare volume: number;
}

Stock.init(
	{
		date: {
			type: DataTypes.DATE,
			primaryKey: true,
			unique: true
		},

		open: {
			type: DataTypes.INTEGER.UNSIGNED,
			allowNull: false
		},
		close: {
			type: DataTypes.INTEGER.UNSIGNED,
			allowNull: false
		},
		high: {
			type: DataTypes.INTEGER.UNSIGNED,
			allowNull: false
		},
		low: {
			type: DataTypes.INTEGER.UNSIGNED,
			allowNull: false
		},
		volume: {
			type: DataTypes.INTEGER.UNSIGNED,
			allowNull: false
		}
	},
	{ tableName: 'BTCUSDT', sequelize }
);
