import { Model, DataTypes, InferAttributes, InferCreationAttributes } from 'sequelize';

import { mysqlConnection } from '@service/mysql/mysql.connection';

const { sequelize } = mysqlConnection;

export class Stock extends Model<InferAttributes<Stock>, InferCreationAttributes<Stock>> {
	declare date: Date;
	declare open: number;
	declare close: number;
	declare high: number;
	declare low: number;
	declare highP: number;
	declare lowP: number;
	// declare highQP: number;
	// declare lowQP: number;
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
			type: DataTypes.DOUBLE.UNSIGNED,
			allowNull: false
		},
		close: {
			type: DataTypes.DOUBLE.UNSIGNED,
			allowNull: false
		},
		high: {
			type: DataTypes.DOUBLE.UNSIGNED,
			allowNull: false
		},
		low: {
			type: DataTypes.DOUBLE.UNSIGNED,
			allowNull: false
		},
		highP: {
			type: DataTypes.DOUBLE.UNSIGNED,
			allowNull: false
		},
		lowP: {
			type: DataTypes.DOUBLE.UNSIGNED,
			allowNull: false
		},
		// highQP: {
		// 	type: DataTypes.FLOAT,
		// 	allowNull: false
		// },
		// lowQP: {
		// 	type: DataTypes.FLOAT,
		// 	allowNull: false
		// },
		volume: {
			type: DataTypes.INTEGER.UNSIGNED,
			allowNull: false
		}
	},
	{ tableName: 'BTCUSDT', sequelize }
);
