use admin
db.createUser(
  {
    user: 'tuan',
    pwd: '20226100',
    roles: [ { role: 'root', db: 'admin' } ]
  }
)

db = db.getSiblingDB('admin');
db.createUser({
  user: "tuan",
  pwd: "20226100",
  roles: [
    { role: "userAdminAnyDatabase", db: "admin" },
    { role: "readWriteAnyDatabase", db: "admin" }
  ]
})

db = db.getSiblingDB('high_school_db');
db.createUser({
  user: "tuan",
  pwd: "20226100",
  roles: [
    { role: "readWrite", db: "high_school_db" }
  ]
})

