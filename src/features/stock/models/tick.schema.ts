import { Model, DataTypes, InferAttributes, InferCreationAttributes, CreationOptional, ForeignKey } from 'sequelize';

import { mysqlConnection } from '@service/mysql/mysql.connection';
import { TickCart } from '@stock/models/tickCart.schema';
const { sequelize } = mysqlConnection;

export class Tick extends Model<InferAttributes<Tick>, InferCreationAttributes<Tick>> {
	declare id?: CreationOptional<string>;
	declare tick: string;
	declare open: number;
	declare close: number;
	declare low: number;
	declare high: number;
	declare TickCartId: ForeignKey<TickCart['id']>;
}

Tick.init(
	{
		id: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			primaryKey: true
		},
		open: {
			type: DataTypes.INTEGER.UNSIGNED,
			allowNull: false
		},
		close: {
			type: DataTypes.INTEGER.UNSIGNED,
			allowNull: false
		},
		low: {
			type: DataTypes.INTEGER.UNSIGNED,
			allowNull: false
		},
		high: {
			type: DataTypes.INTEGER.UNSIGNED,
			allowNull: false
		},
		tick: {
			type: DataTypes.STRING,
			allowNull: false
		}
	},
	{ tableName: 'tick', sequelize }
);

TickCart.hasMany(Tick, { onDelete: 'CASCADE' });
Tick.belongsTo(TickCart);
