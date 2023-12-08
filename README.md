# Exports queries

## Using Hono?

Load a model into Context:

```
app.use('*', async (context, next) => {
  context.models = {
    Users: queries({
      db: context.env.DB, // Set The HONO DB on the System
      table: 'Users', // Set the Table Name
    }),
  }
  await next()
})
```

## Call From Hono Routes

```
app.get('/users', async context => {
  const dbResponse = await context.models.Users.findAll()
  if (dbResponse.success) {
    const { results } = dbResponse

    return context.json({
      data: results,
    })
  }

  return context.jsonError('No DB result', 400)
})
```

Supports

- findAll()
- findOne(id = null, key = "id")
- insert(data) // flat object
- create(data) // alias to insert
- update(data, key = "id", id = null)
- deleteByID(id = null, key = "id")

More questions?

- Why? Cause no one wants to right sql 1000 times
- Want features? Me too submit a PR
- Need More Info? Its like 100 lines, just read it
