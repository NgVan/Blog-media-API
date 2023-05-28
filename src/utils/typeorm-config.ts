import { ConfigService } from '../modules/shared/services/config.service';

const configService = new ConfigService();
const jsonConfig = configService.mysqlDataSource;

export default jsonConfig;
