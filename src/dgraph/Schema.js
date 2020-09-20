const Schema = `
    type Todo {
        title: String! @search(by: [exact])
        body: String!
        completed: bool!
        priority: int!
    }
`;

module.exports = Schema;
