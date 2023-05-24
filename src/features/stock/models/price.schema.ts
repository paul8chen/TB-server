import { Model, DataTypes, InferAttributes, InferCreationAttributes, CreationOptional, ForeignKey } from 'sequelize';

import { mysqlConnection } from '@service/mysql/mysql.connection';
import { Tick } from '@stock/models/tick.schema';
const { sequelize } = mysqlConnection;

export class Price extends Model<InferAttributes<Price>, InferCreationAttributes<Price>> {
	declare id?: CreationOptional<number>;
	declare price: number;
	declare TickId: ForeignKey<Tick['id']>;
}

Price.init(
	{
		// id: {
		// 	type: DataTypes.UUID,
		// 	defaultValue: DataTypes.UUIDV4,
		// 	primaryKey: true
		// },
		id: {
			type: DataTypes.INTEGER.UNSIGNED,
			autoIncrement: true,
			primaryKey: true
		},
		price: {
			type: DataTypes.INTEGER.UNSIGNED,
			allowNull: false
		}
	},
	{ tableName: 'price', sequelize }
);

Tick.hasMany(Price, { onDelete: 'CASCADE' });
Price.belongsTo(Tick);
