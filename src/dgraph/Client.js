const dgraph = require('dgraph-js');
const grpc = require('grpc');

class Client {
  constructor(url = 'http://localhost:8080') {
    this.url = url;
    this.dgraphClientStub = new dgraph.DgraphClientStub('localhost:9080');
    this.dgraphClient = new dgraph.DgraphClient(this.dgraphClientStub);
  }
  getDgraphClient() {
    return this.dgraphClient;
  }

  getDgraphClientStub() {
    return this.dgraphClientStub;
  }

  async setSchema(schema) {
    const op = new dgraph.Operation();
    op.setSchema(schema);
    return await this.dgraphClient.alter(op);
  }

  async dropAll() {
    const op = new dgraph.Operation();
    op.setDropAll(true);
    return await this.dgraphClient.alter(op);
  }

  // Drop All Data, but keep the schema.
  async dropData() {
    const op = new dgraph.Operation();
    op.setDropOp(dgraph.Operation.DropOp.DATA);
    return await this.dgraphClient.alter(op);
  }
  async createData() {
    const txn = this.dgraphClient.newTxn();
    try {
      // Run mutation.
      const mu = new dgraph.Mutation();
      mu.setSetJson(p);
      const response = await txn.mutate(mu);

      // Commit transaction.
      await txn.commit();
      response.getUidsMap().forEach((uid, key) => console.log(`${key} => ${uid}`));
    } finally {
      // Clean up. Calling this after txn.commit() is a no-op
      // and hence safe.
      await txn.discard();
    }
  }

  // Query for data.
  async queryData(query, vars) {
    // Run query.
    const res = await this.dgraphClient.newTxn({ readOnly: true }).queryWithVars(query, vars);
    const ppl = res.getJson();
    // Print results.
    ppl.all.forEach((person) => console.log(person));
  }
}

async function main() {
  const dgraphClientStub = newClientStub();
  const dgraphClient = newClient(dgraphClientStub);
  await dropAll(dgraphClient);
  await setSchema(dgraphClient);
  await createData(dgraphClient);
  await queryData(dgraphClient);
  await dropData(dgraphClient);
  await queryData(dgraphClient);
  await createData(dgraphClient);
  await queryData(dgraphClient);

  // Close the client stub.
  dgraphClientStub.close();
}

module.exports = new Client();
