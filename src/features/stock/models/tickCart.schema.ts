import { Model, DataTypes, InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';

import { mysqlConnection } from '@service/mysql/mysql.connection';

const { sequelize } = mysqlConnection;

export class TickCart extends Model<InferAttributes<TickCart>, InferCreationAttributes<TickCart>> {
	declare id?: CreationOptional<string>;
	declare cartName: string;
	declare userId: string;
}

TickCart.init(
	{
		id: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			primaryKey: true
		},

		cartName: {
			type: DataTypes.STRING,
			allowNull: false
		},
		userId: {
			type: DataTypes.STRING,
			allowNull: true
		}
	},
	{ tableName: 'tickcart', sequelize }
);
