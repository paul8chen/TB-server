import { Model, DataTypes, InferAttributes, InferCreationAttributes, CreationOptional, ForeignKey } from 'sequelize';

import { mysqlConnection } from '@service/mysql/mysql.connection';
import { Tick } from '@stock/models/tick.schema';

const { sequelize } = mysqlConnection;

export class Ma extends Model<InferAttributes<Ma>, InferCreationAttributes<Ma>> {
	declare id?: CreationOptional<string>;
	declare indicatorType: string;
	declare ma: number;
	declare maBy: string;
	declare color: string;
	declare breakRatio: number;
	declare isAbove: boolean;
	declare TickId: ForeignKey<Tick['id']>;
}

Ma.init(
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
		ma: {
			type: DataTypes.DOUBLE.UNSIGNED,
			allowNull: false
		},
		maBy: {
			type: DataTypes.STRING,
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
	},
	{ tableName: 'ma', sequelize }
);

Tick.hasMany(Ma, { onDelete: 'CASCADE' });
Ma.belongsTo(Tick);
