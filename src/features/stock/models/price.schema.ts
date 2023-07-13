import { Model, DataTypes, InferAttributes, InferCreationAttributes, CreationOptional, ForeignKey } from 'sequelize';

import { mysqlConnection } from '@service/mysql/mysql.connection';
import { Tick } from '@stock/models/tick.schema';
const { sequelize } = mysqlConnection;

export class Price extends Model<InferAttributes<Price>, InferCreationAttributes<Price>> {
	declare id?: CreationOptional<number>;
	declare indicatorType: string;
	declare price: number;
	declare date: Date;
	declare color: string;
	declare breakRatio: number;
	declare isAbove: boolean;
	declare TickId: ForeignKey<Tick['id']>;
}

Price.init(
	{
		id: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			primaryKey: true
		},
		indicatorType: {
			type: DataTypes.STRING,
			allowNull: false
		},
		price: {
			type: DataTypes.DOUBLE.UNSIGNED,
			allowNull: false
		},
		date: {
			type: DataTypes.DATE,
			allowNull: false
		},
		color: {
			type: DataTypes.STRING,
			allowNull: false
		},
		breakRatio: {
			type: DataTypes.FLOAT,
			allowNull: false
		},
		isAbove: {
			type: DataTypes.BOOLEAN,
			allowNull: false
		}
		// TickId: {
		// 	type: DataTypes.STRING,
		// 	allowNull: false
		// }
	},
	{ tableName: 'price', sequelize }
);

Tick.hasMany(Price, { onDelete: 'CASCADE' });
Price.belongsTo(Tick);
