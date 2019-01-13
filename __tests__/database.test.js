const db = require("../database");

describe("mock database", () => {
  it("finds a user by their ID", () => {
    const user = db.find.id(1);
    expect(user.id).toEqual(1);
    expect(user.email).toEqual("fox@fbi.gov");
    expect(user.password).toEqual("spooky");
  });

  it("finds a user by their email address", () => {
    const user = db.find.email("michaela@cbs.net");
    expect(user.id).toEqual(3);
    expect(user.email).toEqual("michaela@cbs.net");
    expect(user.password).toEqual("donkey");
  });

  it("can temporarily add a user", () => {
    expect(db.length()).toEqual(3);
    db.add({ id: 4, email: "example@example.com", password: "foobarbaz" });
    expect(db.length()).toEqual(4);
  });
});
