import { DateTime } from "luxon";
import {
  BaseModel,
  column,
  hasMany,
  HasMany,
  HasOne,
  hasOne,
} from "@ioc:Adonis/Lucid/Orm";
import Comment from "./Comment";
import Chat from "./Chat";
import Customer from "./Customer";
import Service from "./Service";

export default class ServiceExecution extends BaseModel {
  @column({ isPrimary: true })
  public id: number;

  @column()
  public customer_id: number;

  @column()
  public service_id: number;

  @column()
  public comment_id: number;

  @column()
  public chat_id: number;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;

  @hasMany(() => Customer, {
    foreignKey: "customer_id",
  })
  public customer: HasMany<typeof Customer>;

  @hasMany(() => Service, {
    foreignKey: "service_id",
  })
  public service: HasMany<typeof Service>;

  @hasMany(() => Comment, {
    foreignKey: "service_execution_id",
  })
  public comments: HasMany<typeof Comment>;

  @hasOne(() => Chat, {
    foreignKey: "service_execution_id",
  })
  public chat: HasOne<typeof Chat>;
}