import { Model, DataTypes, InferAttributes, InferCreationAttributes, CreationOptional, ForeignKey } from 'sequelize';

import { mysqlConnection } from '@service/mysql/mysql.connection';

const { sequelize } = mysqlConnection;

export class Ma extends Model<InferAttributes<Ma>, InferCreationAttributes<Ma>> {
	declare id?: CreationOptional<string>;
	declare param: number;
	declare tickId: ForeignKey<string>;
}

Ma.init(
	{
		id: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			primaryKey: true
		},
		param: {
			type: DataTypes.INTEGER.UNSIGNED,
			allowNull: false
		},
		tickId: {
			type: DataTypes.STRING,
			allowNull: false
		}
	},
	{ tableName: 'ma', sequelize }
);
