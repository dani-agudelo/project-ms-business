import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import { ModelObject } from "@ioc:Adonis/Lucid/Orm";
import Administrator from "App/Models/Administrator";

import axios from "axios";

import Env from "@ioc:Adonis/Core/Env";

export default class AdministratorsController {
  public async find({ request, params }: HttpContextContract) {
    const administrators: ModelObject[] = [];
    const { page, per_page } = request.only(["page", "per_page"]);

    if (params.id) {
      const theCustomer: Administrator = await Administrator.findOrFail(
        params.id,
      );
      administrators.push(theCustomer);
    } else if (page && per_page) {
      const { meta, data } = await Administrator.query()
        .paginate(page, per_page)
        .then((res) => res.toJSON());

      await Promise.all(
        data.map(async (Administrator: Administrator) => {
          const res = await axios.get(
            `${Env.get("MS_SECURITY")}/api/users/email/${Administrator.email}`,
            {
              headers: {
                Authorization: `Bearer ${Env.get("MS_SECURITY_KEY")}`,
              },
            },
          );
          const { _id, name, email } = res.data;
          administrators.push({
            id: Administrator.id,
            user_id: _id,
            name,
            email,
          });
        }),
      );

      return { meta, data: administrators };
    } else {
      const allCustomers = await Administrator.all();
      administrators.push(...allCustomers.map((c) => c.toJSON()));
    }

    await Promise.all(
      administrators.map(
        async (Administrator: Administrator, index: number) => {
          const res = await axios.get(
            `${Env.get("MS_SECURITY")}/api/users/email/${Administrator.email}`,
            {
              headers: {
                Authorization: `Bearer ${Env.get("MS_SECURITY_KEY")}`,
              },
            },
          );
          const { _id, name, email } = res.data;
          administrators[index] = {
            id: Administrator.id,
            user_id: _id,
            name,
            email,
          };
        },
      ),
    );

    return administrators;
  }

  public async create({ request }: HttpContextContract) {
    const body = request.body();
    const theCustomer: Administrator = await Administrator.create(body);
    return theCustomer;
  }

  public async update({ params, request }: HttpContextContract) {
    const theCustomer: Administrator = await Administrator.findOrFail(
      params.id,
    );
    const data = request.body();
    theCustomer.merge(data);
    return await theCustomer.save();
  }

  public async delete({ params, response }: HttpContextContract) {
    const theCustomer: Administrator = await Administrator.findOrFail(
      params.id,
    );
    response.status(204);
    return await theCustomer.delete();
  }
}
