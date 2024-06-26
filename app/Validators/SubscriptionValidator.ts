import { schema, CustomMessages, rules } from "@ioc:Adonis/Core/Validator";
import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";

export default class SubscriptionValidator {
  constructor(protected ctx: HttpContextContract) { }

  public schema = schema.create({
    subscription_id: schema.number.optional([
      rules.unique({
        table: "subscriptions",
        column: "id",
        where: { id: this.ctx.request.input("id") },
      }),
    ]),
    customer: schema.object.optional().members({
      id: schema.number([rules.exists({ table: "customers", column: "id" }),
      ]),
    }),
    customer_id: schema.number.optional([
      rules.exists({ table: "customers", column: "id" }),
    ]),
    plan: schema.object.optional().members({
      id: schema.number([rules.exists({ table: "plans", column: "id" }),
      ]),
    }),
    plan_id: schema.number.optional([
      rules.exists({ table: "plans", column: "id" }),
    ]),
    reference: schema.string.optional(),
    status: schema.boolean([rules.required()]),
    start_date: schema.date(
      {
        format: "yyyy-MM-dd",
      },
      [rules.required()],
    ),
    end_date: schema.date(
      {
        format: "yyyy-MM-dd",
      },
      [rules.afterField("start_date")],
    ),
    monthly_fee: schema.number([rules.required(), rules.range(0, 999999999)]),
  });

  public messages: CustomMessages = {};
}
