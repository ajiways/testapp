import { InjectDataSource } from '@nestjs/typeorm';
import EventEmitter = require('events');
import {
  DataSource,
  EntityManager,
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
  In,
  Repository,
} from 'typeorm';
import { BaseEntity } from '../base.entity';
import {
  EntityManagerWithTransactionEvents,
  QueryRunnerWithTransactionEvents,
  TRANSACTION_END_EVENT,
} from '../types/transaction-events';

export abstract class AbstractService<T extends BaseEntity> {
  private onModuleInit() {
    this.repository = this.dataSource.getRepository<T>(this.Entity);
  }

  protected abstract Entity: {
    new (): T;
    prototype: Record<any, any>;
  };

  @InjectDataSource()
  protected readonly dataSource: DataSource;

  protected repository: Repository<T>;

  protected async findOne(
    options: FindOneOptions<T>,
    manager?: EntityManager | undefined,
  ): Promise<T | null> {
    if (!manager) {
      manager = this.dataSource.manager;
    }

    return await manager.findOne(this.Entity, options);
  }

  protected async find(
    options: FindManyOptions<T>,
    manager?: EntityManager | undefined,
  ) {
    if (!manager) {
      manager = this.dataSource.manager;
    }

    return manager.find(this.Entity, options);
  }

  protected async saveEntity(
    entity: Partial<T>,
    manager?: EntityManager | undefined,
  ): Promise<T> {
    if (!manager) {
      return this.startTransaction((manager) =>
        this.saveEntity(entity, manager),
      );
    }

    const result = await manager.save(this.Entity, entity as T);

    return result;
  }

  protected createEntity(entity: Partial<T>): T {
    return this.dataSource.manager.create(this.Entity, entity as T);
  }

  protected async updateEntity(
    toUpdate: T,
    updateWith: Partial<T>,
    manager?: EntityManager | undefined,
  ): Promise<T> {
    if (!manager) {
      return this.startTransaction((manager) =>
        this.updateEntity(toUpdate, updateWith, manager),
      );
    }

    return await this.saveEntity({ ...toUpdate, ...updateWith }, manager);
  }

  protected async deleteEntity(
    toDelete: T,
    manager?: EntityManager | undefined,
  ): Promise<T>;
  protected async deleteEntity(
    criteria: FindOptionsWhere<T>,
    manager?: EntityManager | undefined,
  ): Promise<T>;
  protected async deleteEntity(
    toDeleteOrCriteria: T | FindOptionsWhere<T>,
    manager?: EntityManager | undefined,
  ): Promise<T>;
  protected async deleteEntity(
    toDeleteOrCriteria: T | FindOptionsWhere<T>,
    manager?: EntityManager | undefined,
  ): Promise<T> {
    if (!manager) {
      return this.startTransaction((manager) =>
        this.deleteEntity(toDeleteOrCriteria, manager),
      );
    }

    if (toDeleteOrCriteria instanceof this.Entity) {
      const entity = toDeleteOrCriteria as T;
      await manager.delete(this.Entity, { id: entity.id });
      return entity;
    } else {
      const candidate = await this.findOne({
        where: toDeleteOrCriteria as FindOptionsWhere<T>,
      });

      if (!candidate) {
        throw new Error('Nothing to delete');
      }

      await manager.delete(this.Entity, candidate);
      return candidate;
    }
  }

  protected async deleteEntities(
    toDelete: T[],
    manager?: EntityManager | undefined,
  ): Promise<void>;
  protected async deleteEntities(
    criteria: FindOptionsWhere<T>,
    manager?: EntityManager | undefined,
  ): Promise<void>;
  protected async deleteEntities(
    toDeleteOrCriteria: T[] | FindOptionsWhere<T>,
    manager?: EntityManager | undefined,
  ): Promise<void> {
    if (!manager) {
      return this.startTransaction((manager) => {
        if (toDeleteOrCriteria instanceof Array) {
          return this.deleteEntities(toDeleteOrCriteria, manager);
        } else {
          return this.deleteEntities(toDeleteOrCriteria, manager);
        }
      });
    }

    if (toDeleteOrCriteria instanceof Array) {
      await manager.delete(this.Entity, {
        id: In(toDeleteOrCriteria.map((i) => i.id)),
      });
    } else {
      await manager.delete(this.Entity, {
        id: toDeleteOrCriteria,
      });
    }
  }

  protected async startTransaction<T>(
    runInTransaction: (entityManager: EntityManager) => Promise<T>,
    manager?: EntityManager,
  ): Promise<T> {
    manager = manager || this.dataSource.manager;

    if (manager.queryRunner?.isTransactionActive) {
      return runInTransaction(manager);
    }

    let queryRunner: QueryRunnerWithTransactionEvents | undefined;

    const result = await manager.transaction(
      async (entityManager: EntityManagerWithTransactionEvents) => {
        try {
          queryRunner = entityManager.queryRunner;
          if (queryRunner) {
            if (!queryRunner.data) {
              queryRunner.data = {};
            }
            queryRunner.data.transactionEvents = new EventEmitter();
          }

          return runInTransaction(entityManager);
        } catch (error) {
          if (queryRunner && queryRunner.data.transactionEvents) {
            queryRunner.data.transactionEvents.removeAllListeners(
              TRANSACTION_END_EVENT,
            );
          }
          throw error;
        }
      },
    );

    if (queryRunner && queryRunner.data.transactionEvents) {
      queryRunner.data.transactionEvents.emit(TRANSACTION_END_EVENT);
    }

    return result;
  }
}
