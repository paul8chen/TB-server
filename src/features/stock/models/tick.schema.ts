import { Model, DataTypes, InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';

import { mysqlConnection } from '@service/mysql/mysql.connection';

const { sequelize } = mysqlConnection;

export class Tick extends Model<InferAttributes<Tick>, InferCreationAttributes<Tick>> {
	declare id?: CreationOptional<string>;
	declare tickName: string;
	declare totalIndicator: number;
	declare uId: string;
}

Tick.init(
	{
		id: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			primaryKey: true
		},
		tickName: {
			type: DataTypes.STRING,
			allowNull: false
		},
		totalIndicator: {
			type: DataTypes.INTEGER,
			allowNull: false
		},
		uId: {
			type: DataTypes.STRING,
			allowNull: false
		}
	},
	{ indexes: [{ unique: true, fields: ['uId'] }], tableName: 'tick', sequelize }
);
