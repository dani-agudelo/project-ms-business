import { DateTime } from "luxon";
import { BaseModel, BelongsTo, belongsTo, column } from "@ioc:Adonis/Lucid/Orm";
import Customer from "./Customer";
import Holder from "./Holder";

export default class Beneficiary extends BaseModel {
  @column({ isPrimary: true })
  public id: number;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;

  @belongsTo(() => Customer, {
    foreignKey: "customer_id",
  })
  public customer: BelongsTo<typeof Customer>;

  @belongsTo(() => Holder, {
    foreignKey: "holder_id",
  })
  public holder: BelongsTo<typeof Holder>;
}
