import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { PrismaModule } from './prisma/prisma.module';
import { HealthModule } from './modules/health/health.module';
import { UsersModule } from './modules/users/users.module';
import { CardProductsModule } from './modules/card-products/card-products.module';
import { CardInventoryModule } from './modules/card-inventory/card-inventory.module';
import { CardOrdersModule } from './modules/card-orders/card-orders.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    HealthModule,
    UsersModule,
    CardProductsModule,
    CardInventoryModule,
    CardOrdersModule,
  ],
})
export class AppModule {}