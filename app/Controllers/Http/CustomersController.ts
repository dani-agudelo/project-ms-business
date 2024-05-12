import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Customer from "App/Models/Customer";

import axios from "axios";

import Env from "@ioc:Adonis/Core/Env";
import { ModelObject } from "@ioc:Adonis/Lucid/Orm";

export default class CustomersController {
  public async find({ request, params }: HttpContextContract) {
    const customers: ModelObject[] = [];
    const { page, per_page } = request.only(["page", "per_page"]);

    if (params.id) {
      const theCustomer: Customer = await Customer.findOrFail(params.id);
      customers.push(theCustomer);
    } else if (page && per_page) {
      const { meta, data } = await Customer.query()
        .paginate(page, per_page)
        .then((res) => res.toJSON());

      await Promise.all(
        data.map(async (customer: Customer) => {
          const res = await axios.get(
            `${Env.get("MS_SECURITY")}/api/users/email/${customer.email}`,
            {
              headers: {
                Authorization: `Bearer ${Env.get("MS_SECURITY_KEY")}`,
              },
            },
          );
          const { _id, name, email } = res.data;
          customers.push({ id: customer.id, user_id: _id, name, email });
        }),
      );

      return { meta, data: customers };
    } else {
      const allCustomers = await Customer.all();
      customers.push(...allCustomers.map((c) => c.toJSON()));
    }

    await Promise.all(
      customers.map(async (customer: Customer, index: number) => {
        const res = await axios.get(
          `${Env.get("MS_SECURITY")}/api/users/email/${customer.email}`,
          {
            headers: {
              Authorization: `Bearer ${Env.get("MS_SECURITY_KEY")}`,
            },
          },
        );
        const { _id, name, email } = res.data;
      customers[index] = { id: customer.id, user_id: _id, name, email };
      }),
    );

    return customers;
  }

  public async create({ request }: HttpContextContract) {
    const body = request.body();
    const theCustomer: Customer = await Customer.create(body);
    return theCustomer;
  }

  public async update({ params, request }: HttpContextContract) {
    const theCustomer: Customer = await Customer.findOrFail(params.id);
    const data = request.body();
    theCustomer.merge(data);
    return await theCustomer.save();
  }

  public async delete({ params, response }: HttpContextContract) {
    const theCustomer: Customer = await Customer.findOrFail(params.id);
    response.status(204);
    return await theCustomer.delete();
  }
}
