import { Model, DataTypes, InferAttributes, InferCreationAttributes, CreationOptional, ForeignKey } from 'sequelize';

import { mysqlConnection } from '@service/mysql/mysql.connection';
import { Tick } from '@stock/models/tick.schema';
const { sequelize } = mysqlConnection;

export class Candlestick extends Model<InferAttributes<Candlestick>, InferCreationAttributes<Candlestick>> {
	declare id?: CreationOptional<number>;
	declare indicatorType: string;
	declare bodyRatio: number;
	declare upperShadow: number;
	declare lowerShadow: number;
	declare candlestickType: string;
	declare TickId: ForeignKey<Tick['id']>;
}

Candlestick.init(
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
		bodyRatio: {
			type: DataTypes.FLOAT,
			allowNull: false
		},
		upperShadow: {
			type: DataTypes.FLOAT,
			allowNull: false
		},
		lowerShadow: {
			type: DataTypes.FLOAT,
			allowNull: false
		},
		candlestickType: {
			type: DataTypes.STRING,
			allowNull: false
		}
	},
	{ tableName: 'candlestick', sequelize }
);

Tick.hasMany(Candlestick, { onDelete: 'CASCADE' });
Candlestick.belongsTo(Tick);
