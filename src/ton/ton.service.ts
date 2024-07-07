import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Address, TonClient } from 'ton';

@Injectable()
export class TonService implements OnModuleInit {
  private readonly logger = new Logger(TonService.name);
  private client: TonClient;

  async onModuleInit() {
    try {
      this.client = new TonClient({
        endpoint: 'https://testnet.toncenter.com/api/v2/jsonRPC',
        apiKey:
          '93c3e09c01f9948be45aed0f3d9cec71a754567766ca1980fd8830e1af033048',
      });
      this.logger.log(
        'TonClient has been initialized and connected successfully.',
      );
    } catch (error) {
      this.logger.error('Failed to initialize TonClient', error);
    }
  }

  async getAccountBalance(addressString: string): Promise<string> {
    try {
      const address = Address.parse(addressString);
      const account = await this.client.getContractState(address);
      return account.balance.toString();
    } catch (error) {
      this.logger.error('Failed to fetch account balance', error);
      throw error;
    }
  }
}
