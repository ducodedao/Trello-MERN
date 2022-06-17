const { MongoClient } = require('mongodb')

async function connectDB() {
    const uri = process.env.MONGODB_URI
    const client = new MongoClient(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })

    try {
        await client.connect()
        console.log('Connect mongodb successfully!')

        await listDatabases(client)
    } catch (error) {
        console.error(error)
    } finally {
        await client.close()
    }
}

async function listDatabases(client) {
    databasesList = await client.db().admin().listDatabases()

    console.log('Databases:')
    databasesList.databases.forEach((db) => console.log(` - ${db.name}`))
}

module.exports = connectDB
