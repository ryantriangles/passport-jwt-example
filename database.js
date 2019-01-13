const users = [
  { id: 1, email: "fox@fbi.gov", password: "spooky" },
  { id: 2, email: "cooper@bluerose.gov", password: "quinine" },
  { id: 3, email: "michaela@cbs.net", password: "donkey" }
];

module.exports = {
  find: {
    id: id => users.find(user => user.id === id),
    email: email => users.find(user => user.email === email)
  },
  length: () => users.length,
  add: user => users.push(user)
};
