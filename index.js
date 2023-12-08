const queries = (base) => {
  const parseDataObject = (data) => {
    const cols = [];
    const count = [];
    const vals = [];
    for (const [key, value] of Object.entries(data)) {
      cols.push(key);
      count.push(`?`);
      vals.push(value);
    }

    return {
      cols,
      count,
      vals,
    };
  };

  const main = {
    findOne: async (id = null, key = "id") => {
      if (!id) {
        return null;
      }
      const result = await base.db
        .prepare(`SELECT * FROM ${base.table} WHERE ${key} = ?`)
        .bind(id)
        .all();
      // normalizing output to the main application
      result.results = result.results[0];
      return result;
    },
    findAll: async (query = null) => {
      if (!query) {
        return await base.db.prepare(`SELECT * FROM ${base.table}`).all();
      }
      return null;
    },
    insert: async (data) => {
      const { cols, count, vals } = parseDataObject(data);

      const statement = `INSERT INTO ${base.table} (${cols.join(
        ","
      )}) VALUES (${count.join(",")})`;

      const result = await base.db
        .prepare(statement)
        .bind(...vals)
        .all();

      console.log(result);

      const createdItem = await main.findOne(result.meta.last_row_id);

      return createdItem;
    },
    create: async (data) => {
      return await main.insert(data);
    },
    update: async (data, key = "id", id = null) => {
      if (!id && data[key]) {
        id = data[key];
      }
      if (!id) {
        return null;
      }

      delete data[key];
      if ("uuid" in data) {
        delete data.uuid;
      }

      const { cols, vals } = parseDataObject(data);

      const statement = `UPDATE ${base.table} SET ${cols.join(
        " = ?, "
      )} = ? WHERE ${key} = ?`;

      vals.push(id);

      const result = await base.db
        .prepare(statement)
        .bind(...vals)
        .all();

      if (!result.success) {
        return { error: "Some kind of DB error" };
      }

      const updatedItem = await main.findOne(id, key);

      return updatedItem;
    },
    deleteByID: async (id = null, key = "id") => {
      if (!id) {
        return { error: "No ID" };
      }
      const statement = `DELETE FROM ${base.table} WHERE id = ?`;

      return await base.db.prepare(statement).bind(id).all();
    },
  };

  return main;
};

module.exports = {
  queries,
};

// need to resolve error possibilities with error states
